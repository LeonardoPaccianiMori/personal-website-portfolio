#!/usr/bin/env bash
set -euo pipefail

UPSTREAM_REMOTE="${UPSTREAM_REMOTE:-upstream}"
UPSTREAM_BRANCH="${UPSTREAM_BRANCH:-main}"
DO_COMMIT=0
DO_PUSH=0

usage() {
  cat <<'USAGE'
Usage: ./update_upstream.sh [--commit] [--push]

Merges upstream while preserving the current website output.

Policy:
  - Keep all current content, layouts, styles, scripts, assets, and lockfiles.
  - Keep files that were removed from this repo removed.
  - Reject new root-level public files that Jekyll would copy into _site.
  - Verify generated _site output against a pre-merge baseline.

By default the script leaves a verified merge staged but uncommitted.
Use --commit to create the merge commit.
Use --push together with --commit to push main to origin.
USAGE
}

while (($#)); do
  case "$1" in
    --commit)
      DO_COMMIT=1
      ;;
    --push)
      DO_PUSH=1
      DO_COMMIT=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
  shift
done

require_clean_tree() {
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "Working tree is not clean. Commit, stash, or discard local changes first." >&2
    exit 1
  fi
}

path_exists_at() {
  local rev="$1"
  local path="$2"
  git cat-file -e "${rev}:${path}" 2>/dev/null
}

is_removed_from_baseline() {
  local path="$1"
  path_exists_at "$MERGE_BASE" "$path" && ! path_exists_at "$BASE_COMMIT" "$path"
}

PROTECTED_PREFIXES=(
  _config.yml
  _data
  _pages
  _posts
  _books
  _projects
  _bibliography
  _includes
  _layouts
  _sass
  _plugins
  _scripts
  _teachings
  assets/css
  assets/js
  assets/json
  assets/img
  assets/fonts
  assets/webfonts
  assets/rendercv
  Gemfile
  Gemfile.lock
  package.json
  package-lock.json
  requirements.txt
  README.md
  CUSTOMIZE.md
  update_upstream.sh
)

is_protected_path() {
  local path="$1"
  local prefix
  for prefix in "${PROTECTED_PREFIXES[@]}"; do
    if [[ "$path" == "$prefix" || "$path" == "$prefix/"* ]]; then
      return 0
    fi
  done
  return 1
}

remove_paths_if_any() {
  if (($#)); then
    git rm -f -- "$@"
  fi
}

restore_protected_inputs() {
  local prefix
  local existing=()
  local added=()

  for prefix in "${PROTECTED_PREFIXES[@]}"; do
    if git ls-tree -r --name-only "$BASE_COMMIT" -- "$prefix" | grep -q . || path_exists_at "$BASE_COMMIT" "$prefix"; then
      existing+=("$prefix")
    fi
  done

  if ((${#existing[@]})); then
    git restore --source="$BASE_COMMIT" --staged --worktree -- "${existing[@]}"
  fi

  for prefix in "${PROTECTED_PREFIXES[@]}"; do
    while IFS= read -r path; do
      added+=("$path")
    done < <(git diff --cached --name-only --diff-filter=A -- "$prefix" || true)
  done

  remove_paths_if_any "${added[@]}"
}

resolve_unmerged_paths() {
  local unmerged=()
  local path

  while IFS= read -r path; do
    unmerged+=("$path")
  done < <(git diff --name-only --diff-filter=U)

  for path in "${unmerged[@]}"; do
    if is_removed_from_baseline "$path"; then
      git rm -f -- "$path"
    elif is_protected_path "$path"; then
      if path_exists_at "$BASE_COMMIT" "$path"; then
        git restore --source="$BASE_COMMIT" --staged --worktree -- "$path"
      else
        git rm -f -- "$path"
      fi
    else
      git checkout --theirs -- "$path"
      git add -- "$path"
    fi
  done
}

remove_reintroduced_deletions() {
  local reintroduced=()
  local path

  while IFS= read -r path; do
    if is_removed_from_baseline "$path"; then
      reintroduced+=("$path")
    fi
  done < <(git diff --cached --name-only --diff-filter=A)

  remove_paths_if_any "${reintroduced[@]}"
}

remove_public_root_additions() {
  local root_additions=()
  local path

  while IFS= read -r path; do
    if [[ "$path" != */* && "$path" != .* ]]; then
      root_additions+=("$path")
    fi
  done < <(git diff --cached --name-only --diff-filter=A)

  remove_paths_if_any "${root_additions[@]}"
}

ensure_no_unmerged_paths() {
  local remaining
  remaining="$(git diff --name-only --diff-filter=U)"
  if [[ -n "$remaining" ]]; then
    echo "Unresolved merge paths remain:" >&2
    echo "$remaining" >&2
    exit 1
  fi
}

verify_site_output() {
  bundle exec jekyll build

  if ! diff -qr --exclude=feed.xml --exclude=sitemap.xml "$BASELINE_DIR" _site; then
    cat >&2 <<'ERROR'

The generated site differs from the pre-merge baseline.
The merge has been left in place for review. Inspect the diff above, then
either fix it manually or run `git merge --abort` to return to the pre-merge state.
ERROR
    exit 1
  fi
}

require_clean_tree

BASE_COMMIT="$(git rev-parse HEAD)"
BASELINE_DIR="$(mktemp -d /tmp/personal-site-baseline.XXXXXX)"
trap 'rm -rf "$BASELINE_DIR"' EXIT

echo "Building baseline from $BASE_COMMIT..."
bundle exec jekyll build
cp -a _site/. "$BASELINE_DIR/"

echo "Fetching ${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH}..."
git fetch "$UPSTREAM_REMOTE" "$UPSTREAM_BRANCH"
UPSTREAM_REF="${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH}"
MERGE_BASE="$(git merge-base "$BASE_COMMIT" "$UPSTREAM_REF")"

echo "Merging $UPSTREAM_REF without committing..."
set +e
git merge --no-commit --no-ff "$UPSTREAM_REF"
merge_status=$?
set -e

if ((merge_status != 0)); then
  echo "Merge reported conflicts; applying site-preservation policy..."
fi

resolve_unmerged_paths
restore_protected_inputs
remove_reintroduced_deletions
remove_public_root_additions
ensure_no_unmerged_paths

git diff --check
verify_site_output

if git diff --cached --quiet; then
  echo "No upstream changes passed the preservation policy."
  exit 0
fi

echo "Verified: generated site output matches the baseline, excluding feed/sitemap timestamps."

if ((DO_COMMIT)); then
  git commit -m "Merge upstream without visual changes"
  if ((DO_PUSH)); then
    git push origin "$(git branch --show-current)"
  fi
else
  echo "Verified merge is staged but not committed. Run:"
  echo "  git commit -m \"Merge upstream without visual changes\""
fi
