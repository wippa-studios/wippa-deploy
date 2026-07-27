#!/bin/bash
# Wippa deploy script — run on the VPS
# Usage: bash scripts/deploy.sh
#
# First deploy: clones repo, builds Docker image, starts services.
# Subsequent runs: git pull, rebuild, restart.

set -e

WIPPA_REPO_URL="${WIPPA_REPO_URL:-https://github.com/wippa-studios/wippa-deploy.git}"
REPO_DIR="${REPO_DIR:-$HOME/wippa-deploy}"
COMPOSE_FILE="docker-compose.dev.yml"

echo "=== Wippa Deploy ==="

# --- Docker Compose detection ---
if docker compose version &>/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &>/dev/null; then
    COMPOSE_CMD="docker-compose"
else
    echo "Docker Compose not found. Please install Docker with the Compose plugin."
    echo "Run: sudo apt update && sudo apt install -y docker.io docker-compose-v2"
    exit 1
fi
echo "Using: $COMPOSE_CMD"

# --- Clone or update repo ---
if [ -d "$REPO_DIR/.git" ]; then
    echo "Updating repo..."
    cd "$REPO_DIR"
    git pull
else
    echo "Cloning $WIPPA_REPO_URL ..."
    git clone "$WIPPA_REPO_URL" "$REPO_DIR"
    cd "$REPO_DIR"
fi

# --- Create .env if not present ---
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "=== IMPORTANT ==="
    echo "Edit .env with your secrets before continuing."
    echo "Required: AP_ENCRYPTION_KEY, AP_JWT_SECRET, AP_POSTGRES_PASSWORD"
    echo "Generate keys: openssl rand -hex 32"
    echo "Then run this script again."
    exit 1
fi

# --- Build Docker image ---
echo "Building Wippa image (first build ~10-15 min)..."
$COMPOSE_CMD -f "$COMPOSE_FILE" build --pull

# --- Start services ---
echo "Starting services..."
$COMPOSE_CMD -f "$COMPOSE_FILE" up -d

echo ""
echo "=== Deploy complete ==="
echo "App: http://$(curl -s ifconfig.me):8081"
echo "Logs: $COMPOSE_CMD -f $COMPOSE_FILE logs -f app"
echo "Stop: $COMPOSE_CMD -f $COMPOSE_FILE down"
