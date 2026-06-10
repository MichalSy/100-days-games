#!/usr/bin/env bash
set -euo pipefail

REPO="/home/aiko/git-projects/100-days-games"
RUNTIME_DIR="/home/aiko/.hermes/profiles/ryu/cron/100-days-games"
LOG_DIR="$RUNTIME_DIR/logs"
LOCK="$RUNTIME_DIR/nightly.lock"
mkdir -p "$LOG_DIR"

if [ -f "$LOCK" ]; then
  PID="$(cat "$LOCK" 2>/dev/null || true)"
  if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
    echo "100-days-games nightly run already active: pid=$PID log_dir=$LOG_DIR"
    exit 0
  fi
  rm -f "$LOCK"
fi

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
LOG="$LOG_DIR/$STAMP.log"

PROMPT="Run the daily 100-days-games generator with high reasoning.\n\nRepository/workdir: $REPO\n\nRead and follow the current git-tracked source prompt exactly: $REPO/ai/cron-system-prompt.md\n\nDo not use this launcher text as the game-generation prompt. First generate the detailed day prompt under prompts/day-NNN.md. Then start a fresh implementation subagent/agent with reset context that receives only repo path, day number, generated prompt path, and validation/publish rules. Build/test/publish from that archived prompt. Before pushing verify locally: build, release validation, browser smoke, mobile smoke, screenshot/static checks, Docker/static smoke, immutable guard. After deployment, verify ArgoCD/k3s and live URL. Send Michal a Telegram report with final URLs and verification status. Do not delete scripts/launch-nightly-hermes.sh or files under $RUNTIME_DIR."

cd "$REPO"
(
  echo "[$(date -Is)] starting Hermes nightly generator"
  echo "repo=$REPO"
  echo "prompt_source=$REPO/ai/cron-system-prompt.md"
  HERMES_PROFILE=ryu hermes --profile ryu chat \
    --provider openai-codex \
    --model gpt-5.5 \
    --toolsets terminal,file,web,browser,image_gen,delegation,skills,messaging \
    --query "$PROMPT"
  RC=$?
  echo "[$(date -Is)] Hermes nightly generator exited rc=$RC"
  rm -f "$LOCK"
  exit "$RC"
) >"$LOG" 2>&1 &
PID=$!
echo "$PID" > "$LOCK"
echo "Started 100-days-games nightly Hermes run: pid=$PID log=$LOG"
