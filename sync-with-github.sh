#!/usr/bin/env bash

# Simple GitHub sync helper for alexbon.com.
# Reuses the same workflow on any machine: commit local changes, pull updates, push everything.

set -euo pipefail

REMOTE_NAME="${SYNC_REMOTE_NAME:-origin}"
REMOTE_URL="${SYNC_REMOTE_URL:-https://github.com/alexbon-com/alexbon.com.git}"
BRANCH="${SYNC_BRANCH:-}"

timestamp() {
  date +"%Y-%m-%d %H:%M:%S"
}

step() {
  printf "\n==> %s\n" "$1"
}

ensure_git_repo() {
  if ! command -v git >/dev/null 2>&1; then
    echo "Git не установлен. Установите git и повторите запуск." >&2
    exit 1
  fi

  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Скрипт нужно запускать внутри папки проекта (git-репозитория)." >&2
    exit 1
  fi
}

ensure_remote() {
  if git remote get-url "$REMOTE_NAME" >/dev/null 2>&1; then
    return
  fi

  step "Добавляю удалённый репозиторий $REMOTE_NAME → $REMOTE_URL"
  git remote add "$REMOTE_NAME" "$REMOTE_URL"
}

checkout_branch() {
  local current_branch
  current_branch="$(git branch --show-current 2>/dev/null || true)"

  if [[ "$current_branch" == "$BRANCH" ]]; then
    return
  fi

  if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
    step "Переключаюсь на ветку $BRANCH"
    git checkout "$BRANCH"
  else
    step "Создаю ветку $BRANCH"
    git checkout -b "$BRANCH"
  fi
}

commit_local_changes() {
  if [[ -z "$(git status --short)" ]]; then
    return
  fi

  step "Фиксирую локальные изменения"
  git add -A
  git commit -m "Auto-sync $(timestamp)"
}

pull_remote_changes() {
  if git ls-remote --exit-code "$REMOTE_NAME" "refs/heads/$BRANCH" >/dev/null 2>&1; then
    step "Обновляю проект из GitHub"
    if ! git pull --rebase "$REMOTE_NAME" "$BRANCH"; then
      echo
      echo "⚠️  Возник конфликт при обновлении. Разрешите его вручную и запустите скрипт ещё раз."
      exit 1
    fi
  else
    step "На GitHub пока нет ветки $BRANCH — пропускаю загрузку"
  fi
}

push_local_changes() {
  step "Отправляю изменения на GitHub"
  git push "$REMOTE_NAME" "$BRANCH"
}

main() {
  ensure_git_repo
  if [[ -z "$BRANCH" ]]; then
    BRANCH="$(git branch --show-current 2>/dev/null || echo main)"
  fi
  ensure_remote
  checkout_branch
  commit_local_changes
  pull_remote_changes
  push_local_changes

  echo
  echo "✅ Синхронизация завершена."
}

main "$@"
