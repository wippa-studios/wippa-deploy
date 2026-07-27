FROM node:24.14.0-bullseye-slim AS builder

ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

# System dependencies (single layer, cached)
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        openssh-client python3 g++ build-essential git \
        poppler-utils poppler-data procps unzip curl \
        ca-certificates iptables libcap2 parallel

# Install bun
RUN export ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
      curl -fSL https://github.com/oven-sh/bun/releases/download/bun-v1.3.1/bun-linux-x64-baseline.zip -o bun.zip; \
    elif [ "$ARCH" = "aarch64" ]; then \
      curl -fSL https://github.com/oven-sh/bun/releases/download/bun-v1.3.1/bun-linux-aarch64.zip -o bun.zip; \
    fi && \
    unzip bun.zip && mv bun-*/bun /usr/local/bin/bun && chmod +x /usr/local/bin/bun && \
    rm -rf bun.zip bun-*

# Install global build tools
RUN npm install -g --no-fund --no-audit node-gyp npm@11.11.0 esbuild@0.25.0

# Install isolated-vm for sandboxes
RUN cd /usr/src && bun install isolated-vm@6.0.2

WORKDIR /usr/src/app

# Copy dependency lockfile first (layer caching)
COPY package.json bun.lock bunfig.toml .npmrc ./
COPY packages/ ./packages/

# Install all workspace dependencies (lockfile includes all @wippa/* packages)
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install

# Copy remaining source code
COPY . .

# Build core packages: frontend, engine, server API, worker
RUN npx turbo run build \
    --filter=web \
    --filter=@wippa/engine \
    --filter=api \
    --filter=worker \
    --concurrency=2

# Compile all 724+ community pieces with esbuild (replaces per-piece tsc compilation)
# esbuild is 10-100× faster than tsc and uses far less memory per process.
# We use --external:* so npm deps are resolved from node_modules at runtime.
# GNU parallel gives us ~8 concurrent compilations without OOM risk.
RUN find packages/connectors -name "package.json" -maxdepth 3 ! -path "*/node_modules/*" | \
    parallel --will-cite --halt now,fail=1 --jobs=4 --line-buffer ' \
        dir=$(dirname {}); \
        src="$dir/src/index.ts"; \
        outdir="$dir/dist"; \
        if [ -f "$src" ]; then \
            mkdir -p "$outdir" && \
            esbuild "$src" --bundle --outfile="$outdir/src/index.js" --platform=node --external:* && \
            cp "$dir/package.json" "$outdir/"; \
        fi'

# Remove source TypeScript from all pieces (only dist/ + package.json needed at runtime)
# IMPORTANT: -not -path '*/dist/*' prevents deleting dist/src/ (compiled JS output)
RUN find packages/connectors -type d -name src -not -path '*/dist/*' -prune -exec rm -rf {} + 2>/dev/null || true

# Generate migration manifest for rollback support
RUN node -e "\
  const {getMigrations} = require('./packages/server/api/dist/src/app/database/postgres-connection');\
  const names = getMigrations().map(m => new m().name);\
  process.stdout.write(JSON.stringify(names));\
" > packages/server/api/dist/src/migration-manifest.json

# Remove dev-only packages that bloat the runtime node_modules
RUN rm -rf packages/web packages/cli packages/tests-e2e packages/ee && \
    node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));p.workspaces=p.workspaces.filter(w=>fs.existsSync(w.replace('/*','')));fs.writeFileSync('package.json',JSON.stringify(p,null,2))"

# Remove per-piece node_modules (if any exist — bun links root-level when possible)
RUN rm -rf packages/connectors/*/*/node_modules 2>/dev/null || true

### STAGE 2: Runtime ###
FROM node:24.14.0-bullseye-slim

ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

# Runtime system deps
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates curl procps libcap2 && \
    rm -rf /var/lib/apt/lists/*

# PM2 process manager — required by docker-entrypoint.sh (pm2-runtime)
RUN npm install -g --no-fund --no-audit pm2

WORKDIR /usr/src/app

# Isolate config
COPY --from=builder /usr/src/app/packages/server/api/src/assets/default.cf /usr/local/etc/isolate

# Entrypoint
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Root config files
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/.npmrc ./
COPY --from=builder /usr/src/app/bunfig.toml ./
COPY --from=builder /usr/src/app/LICENSE ./

# Workspace package.json files (needed for bun workspace resolution)
COPY --from=builder /usr/src/app/packages ./packages

# Built engine
COPY --from=builder /usr/src/app/dist/packages/engine/ ./dist/packages/engine/

# Full node_modules (already trimmed of dev-only packages in build stage)
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Recreate @wippa workspace package symlinks (Docker COPY doesn't preserve bun's symlinks)
# The connectors and server API require('@wippa/connectors-framework') etc at runtime;
# without these symlinks Node.js can't resolve the workspace packages.
RUN mkdir -p /usr/src/app/node_modules/@wippa && \
    ln -s ../../packages/connectors/framework node_modules/@wippa/connectors-framework && \
    ln -s ../../packages/connectors/common node_modules/@wippa/connectors-common && \
    ln -s ../../packages/core/utils node_modules/@wippa/core-utils && \
    ln -s ../../packages/core/connector-types node_modules/@wippa/core-connector-types && \
    ln -s ../../packages/core/execution node_modules/@wippa/core-execution && \
    ln -s ../../packages/core/shared node_modules/@wippa/shared && \
    ln -s ../../packages/server/utils node_modules/@wippa/server-utils && \
    ln -s ../../packages/server/sandbox node_modules/@wippa/sandbox

# Frontend built files
COPY --from=builder /usr/src/app/dist/packages/web ./dist/packages/web/

# Migration manifest (used for rollback)
COPY --from=builder /usr/src/app/packages/server/api/dist/src/migration-manifest.json \
    ./packages/server/api/dist/src/migration-manifest.json

LABEL service=wippa

HEALTHCHECK --interval=10s --timeout=5s --start-period=60s --retries=5 \
    CMD [ "$AP_CONTAINER_TYPE" = "WORKER" ] && exit 0 || \
        curl -fsS "http://localhost:${AP_PORT:-80}/api/v1/health" || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
EXPOSE 80
