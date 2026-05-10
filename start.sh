#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$ROOT_DIR/app"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required to run this project."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required to run this project."
  exit 1
fi

if [ ! -d "$APP_DIR/node_modules" ]; then
  echo "Installing missing dependencies..."
  (cd "$APP_DIR" && npm install --no-fund --no-audit)
fi

cd "$APP_DIR"
exec npm run dev -- --host 127.0.0.1