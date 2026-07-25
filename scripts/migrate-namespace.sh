#!/bin/bash
# Migrate @activepieces/ namespace to @wippa/ namespace
# Run from repo root

set -e
cd "$(dirname "$0")/.."

echo "=== Phase 1.1: package.json files ==="
find packages -name "package.json" -not -path "*/node_modules/*" \
  -exec sed -i 's|"@activepieces/|"@wippa/|g' {} +
echo "  ✓ Done"

echo "=== Phase 1.2: tsconfig files ==="
find . -name "tsconfig*.json" -not -path "*/node_modules/*" -not -path "./node_modules/*" \
  -exec sed -i 's|"@activepieces/|"@wippa/|g' {} +
echo "  ✓ Done"

echo "=== Phase 1.2b: Root package.json ==="
sed -i 's|@activepieces/|@wippa/|g' package.json
sed -i 's|--filter=@activepieces/|--filter=@wippa/|g' package.json
echo "  ✓ Done"

echo "=== Phase 1.3: Source imports ==="
find packages -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.mjs" \) \
  -not -path "*/node_modules/*" -not -path "*/dist/*" \
  -exec sed -i "s|from '@activepieces/|from '@wippa/|g" {} +
find packages -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.mjs" \) \
  -not -path "*/node_modules/*" -not -path "*/dist/*" \
  -exec sed -i "s|require('@activepieces/|require('@wippa/|g" {} +
find packages -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/node_modules/*" -not -path "*/dist/*" \
  -exec sed -i "s|import('@activepieces/|import('@wippa/|g" {} +
echo "  ✓ Done"

echo "=== Phase 1.4: Update Dockerfile ==="
sed -i 's|@activepieces/engine|@wippa/engine|g' Dockerfile
sed -i 's|@activepieces/piece-|@wippa/piece-|g' Dockerfile
echo "  ✓ Done"

echo ""
echo "=== Migration complete ==="
echo "Now run: git add -A && git commit -m 'Namespace migration: @activepieces/* → @wippa/*'"
