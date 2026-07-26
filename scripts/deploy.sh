#!/bin/bash
# Wippa deploy script — run on the VPS
# Usage: bash scripts/deploy.sh
#
# Configure via environment variables:
#   WIPPA_REPO_URL    Git repository containing compose files and .env.example
#   WIPPA_IMAGE       Container image to pull (default: ghcr.io/wippa/wippa:latest)

set -e

WIPPA_REPO_URL="${WIPPA_REPO_URL:-https://github.com/wippa/wippa-deploy.git}"
WIPPA_IMAGE="${WIPPA_IMAGE:-ghcr.io/wippa/wippa:latest}"

REPO_DIR="${REPO_DIR:-$HOME/wippa-deploy}"

echo "=== Wippa Deploy ==="

# --- Docker Compose detection ---
# Prefer the modern Docker plugin (docker compose) over the standalone binary.
if docker compose version &>/dev/null; then
    COMPOSE_CMD="docker compose"
elif docker compose version 2>&1 | grep -q "Docker Compose"; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &>/dev/null; then
    COMPOSE_CMD="docker-compose"
else
    echo "Docker Compose not found. Please install Docker with the Compose plugin."
    exit 1
fi

echo "Using compose command: $COMPOSE_CMD"

# --- Clone or update the deployment repository ---
if [ -d "$REPO_DIR/.git" ]; then
    echo "Updating existing deployment repository..."
    cd "$REPO_DIR"
    git pull
else
    echo "Cloning deployment repository from $WIPPA_REPO_URL ..."
    git clone "$WIPPA_REPO_URL" "$REPO_DIR"
    cd "$REPO_DIR"
fi

# --- Copy .env if not present ---
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ">>> IMPORTANT: Edit .env with your secrets before continuing! <<<"
    echo ">>> Required: AP_ENCRYPTION_KEY, AP_JWT_SECRET, AP_POSTGRES_PASSWORD <<<"
    exit 1
fi

# --- Pull the prebuilt image (do NOT build on the VPS) ---
echo "Pulling Wippa image: $WIPPA_IMAGE"
docker pull "$WIPPA_IMAGE"

# --- Start services ---
echo "Starting Wippa services..."
WIPPA_IMAGE="$WIPPA_IMAGE" $COMPOSE_CMD -f docker-compose.yml up -d

echo "=== Deploy complete ==="
echo "App URL: http://<vps-ip>:8081"
echo "Check status: $COMPOSE_CMD -f docker-compose.yml ps"
echo "View logs: $COMPOSE_CMD -f docker-compose.yml logs -f app"
