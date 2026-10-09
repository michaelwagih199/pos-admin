#!/bin/bash
# Generate an Angular project context file.
# Usage: ./merge-ng.sh [output-file] [source-dir]
#
# Defaults:
#   output-file = angular_context_<timestamp>.txt
#   source-dir  = .

set -e

OUTPUT_FILE="${1:-angular_context_$(date +%Y%m%d_%H%M%S).txt}"
SRC_DIR="${2:-.}"

echo "Generating Angular context..."
echo "  Output: $OUTPUT_FILE"
echo "  Source: $SRC_DIR"

{
    echo "# Angular POS — Frontend Context"
    echo "# Generated: $(date)"
    echo "# Source:    $SRC_DIR"
    echo ""

    cd "$SRC_DIR" || { echo "Cannot cd into $SRC_DIR"; exit 1; }

    find . \
        \( -path "*/node_modules" \
        -o -path "*/dist" \
        -o -path "*/.angular" \
        -o -path "*/.git" \
        -o -path "*/.vscode" \
        -o -path "*/e2e" \
        -o -path "*/.github" \) -prune \
        -o -type f \( \
            -name "*.ts" \
            -o -name "*.html" \
            -o -name "*.scss" \
            -o -name "angular.json" \
            -o -name "package.json" \
            -o -name "tsconfig*.json" \
            -o -name "_MODELS.md" \
            -o -name "_ROUTES.md" \
        \) \
        -not -name "*.spec.ts" \
        -not -name "package-lock.json" \
        -not -name "*.cpuprofile" \
        -not -name "merge-ng.sh" \
        -not -name "merge_context.sh" \
        -not -name "angular_context_*.txt" \
        -not -name "project_context_*.txt" \
        -print0 | while IFS= read -r -d '' file; do
            # Skip empty .scss files (contribute nothing)
            if [[ "$file" == *.scss ]] && [[ ! -s "$file" ]]; then
                continue
            fi
            echo "### $file"
            sed -e '/^[[:space:]]*$/d' "$file"
            echo ""
        done
} > "$OUTPUT_FILE"

echo "Done → $OUTPUT_FILE"
echo "Size:   $(wc -c < "$OUTPUT_FILE") bytes"
echo "Files:  $(grep -c '^### ' "$OUTPUT_FILE")"
