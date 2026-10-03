#!/usr/bin/env bash
# Builds the app and publishes it to the `gh-pages` branch, which GitHub Pages
# serves. Usage: npm run deploy
set -euo pipefail

BASE_HREF="/movie-website/"
OUT="dist/movie-website/browser"

npx ng build --base-href "$BASE_HREF"

# GitHub Pages has no SPA fallback: serve the app for unknown paths too, so
# deep links such as /details/27205 survive a refresh.
cp "$OUT/index.html" "$OUT/404.html"
# The public entry page gets a real file as well, so links to it return 200
# rather than the 404 fallback (which link previews and crawlers treat as broken).
mkdir -p "$OUT/search" && cp "$OUT/index.html" "$OUT/search/index.html"
touch "$OUT/.nojekyll"

SHA=$(git rev-parse --short HEAD)
WORKTREE=$(mktemp -d)
BUILD_BRANCH=gh-pages-build

# The temporary branch can only be deleted once its worktree is gone, and a
# leftover from an interrupted run would make the next one fail.
cleanup() {
  git worktree remove --force "$WORKTREE" 2>/dev/null || true
  git branch -D "$BUILD_BRANCH" >/dev/null 2>&1 || true
}
trap cleanup EXIT
git branch -D "$BUILD_BRANCH" >/dev/null 2>&1 || true

git worktree add --detach "$WORKTREE" >/dev/null
(
  cd "$WORKTREE"
  git checkout --orphan "$BUILD_BRANCH" >/dev/null
  git rm -rfq . >/dev/null 2>&1 || true
  cp -a "$OLDPWD/$OUT/." .
  git add -A
  git commit -qm "Deploy $SHA"
  git push -f origin HEAD:gh-pages
)
echo "Published $SHA to gh-pages"
