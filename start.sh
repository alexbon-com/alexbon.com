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

PORT=3000
get_port_pids() {
  if command -v ss >/dev/null 2>&1; then
    ss -ltnp 2>/dev/null | awk -v PORT="$PORT" '
      NR > 1 {
        split($4, parts, ":")
        if (parts[length(parts)] == PORT) {
          for (i = 1; i <= NF; i++) {
            if ($i ~ /pid=/) {
              split($i, tmp, "=")
              gsub(/[^0-9].*/, "", tmp[2])
              if (tmp[2] != "") print tmp[2]
            }
          }
        }
      }
    ' | sort -u
  elif command -v lsof >/dev/null 2>&1; then
    lsof -ti tcp:"$PORT" 2>/dev/null | sort -u
  elif command -v fuser >/dev/null 2>&1; then
    fuser "$PORT"/tcp 2>/dev/null | tr -s ' ' '\n' | sort -u
  else
    echo ""
  fi
}

EXISTING_PIDS="$(get_port_pids || true)"
if [ -n "$EXISTING_PIDS" ]; then
  echo "🔧 Port ${PORT} is in use by PIDs: ${EXISTING_PIDS}. Attempting to stop them..."
  for PID in $EXISTING_PIDS; do
    kill "$PID" 2>/dev/null || true
  done
  sleep 1

  REMAINING_PIDS="$(get_port_pids || true)"
  if [ -n "$REMAINING_PIDS" ]; then
    echo "⚠️  Some processes did not exit gracefully. Forcing termination..."
    for PID in $REMAINING_PIDS; do
      kill -9 "$PID" 2>/dev/null || true
    done
    sleep 1
  fi

  FINAL_PIDS="$(get_port_pids || true)"
  if [ -n "$FINAL_PIDS" ]; then
    echo "❌ Unable to free port ${PORT}. Still in use by: ${FINAL_PIDS}" >&2
    exit 1
  fi
fi

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
