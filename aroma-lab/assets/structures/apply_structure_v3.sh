#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT="${1:-.}"
mkdir -p "$REPO_ROOT/aroma-lab/assets/structures"
cp -f aroma-lab/assets/structures/*.svg "$REPO_ROOT/aroma-lab/assets/structures/"
echo "Replaced 51 structure SVGs in $REPO_ROOT/aroma-lab/assets/structures"
