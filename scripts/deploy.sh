#!/bin/bash
# Wippa deploy script — run on the VPS
# Usage: bash scripts/deploy.sh

set -e

echo "=== Wippa Deploy ==="

# Check prerequisites
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | bash
fi

if ! command -v /tmp/docker-compose &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    curl -sL "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /tmp/docker-compose
    chmod +x /tmp/docker-compose
fi

# Clone or pull
REPO_DIR="$HOME/wippa-deploy"
if [ -d "$REPO_DIR" ]; then
    echo "Updating existing deployment..."
    cd "$REPO_DIR"
    git pull
else
    echo "Cloning repository..."
    git clone https://github.com/your-org/wippa-deploy.git "$REPO_DIR"
    cd "$REPO_DIR"
fi

# Copy .env if not present
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ">>> IMPORTANT: Edit .env with your secrets before continuing! <<<"
    echo ">>> Required: AP_ENCRYPTION_KEY, AP_JWT_SECRET, AP_POSTGRES_PASSWORD <<<"
    exit 1
fi

# Build and start
echo "Building Docker image (first build takes 20-30 min)..."
DOCKER_BUILDKIT=1 docker compose -f docker-compose.dev.yml build

echo "Starting services..."
docker compose -f docker-compose.dev.yml up -d

echo "=== Deploy complete ==="
echo "Check status: docker compose -f docker-compose.dev.yml ps"
echo "View logs: docker compose -f docker-compose.dev.yml logs -f app"
echo "App should be available at http://<vps-ip>:8081"
