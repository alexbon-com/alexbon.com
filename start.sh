#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

URL="http://localhost:3000"

if [ ! -d node_modules ]; then
  echo "🚀 Installing project dependencies (this may take a minute)..."
  npm install
else
  echo "✅ Dependencies already installed — skipping npm install."
fi

echo "🧩 Preparing Velite cache (npm run prebuild)..."
npm run prebuild >/dev/null 2>&1 && echo "✅ Velite cache ready." || echo "⚠️  Velite prebuild exited with a warning; continuing."

echo "▶️  Starting Next.js development server..."
npm run dev -- --hostname 0.0.0.0 --port 3000 &
SERVER_PID=$!

cleanup() {
  echo "\n🛑 Stopping development server..."
  kill "$SERVER_PID" 2>/dev/null || true
}
trap cleanup EXIT

echo "⏳ Waiting for the site to become available at $URL"
until curl -sSf "$URL" >/dev/null 2>&1; do
  sleep 1
  if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    echo "❌ Server exited unexpectedly. Check the logs above for details." >&2
    exit 1
  fi
done

echo "🌐 Opening $URL in your browser..."
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL" >/dev/null 2>&1 &
elif command -v open >/dev/null 2>&1; then
  open "$URL" >/dev/null 2>&1 &
elif command -v start >/dev/null 2>&1; then
  start "" "$URL" >/dev/null 2>&1 &
else
  echo "⚠️  Could not detect a command to open the browser automatically. Please open $URL manually."
fi

echo "✅ Server is running. Leave this window open and press Ctrl+C when you're done."

wait "$SERVER_PID"
