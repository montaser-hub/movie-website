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
trap 'git worktree remove --force "$WORKTREE" 2>/dev/null || true' EXIT

git worktree add --detach "$WORKTREE" >/dev/null
(
  cd "$WORKTREE"
  git checkout --orphan gh-pages-build >/dev/null 2>&1
  git rm -rfq . >/dev/null 2>&1 || true
  cp -a "$OLDPWD/$OUT/." .
  git add -A
  git commit -qm "Deploy $SHA"
  git push -f origin HEAD:gh-pages
)
git branch -D gh-pages-build >/dev/null 2>&1 || true
echo "Published $SHA to gh-pages"
