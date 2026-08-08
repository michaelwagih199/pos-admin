#!/bin/bash
# Remove any previously generated context files
rm -f angular_context_*.txt

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")
OUTPUT_FILE="angular_context_${TIMESTAMP}.txt"

# Clear the output file if it exists
> "$OUTPUT_FILE"

echo "🔍 Gathering Angular project context into $OUTPUT_FILE..."

# 1. Add a Directory Tree (explicitly skip .angular, .vscode, node_modules, dist)
{
  echo "--- DIRECTORY TREE ---"
  echo "Generated on: $(date)"
  find . -maxdepth 3 \
    -not -path '*/.*' \
    -not -path './node_modules*' \
    -not -path './dist*' \
    -not -path './.angular*' \
    -not -path './.vscode*'
  printf "\n"
} >> "$OUTPUT_FILE"

# 2. Find and merge relevant files, excluding all unwanted directories
find . -type f \
    \( -name "*.ts" -o -name "*.html" -o -name "*.scss" -o -name "*.json" -o -name "*.css" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    -not -path "*/.git/*" \
    -not -path "*/.vscode/*" \
    -not -path "*/.angular/*" \
    -not -name "package-lock.json" \
    -not -name "metadata.json" \
    -not -name "yarn.lock" \
    -print0 | while IFS= read -r -d '' file; do
        echo "Adding: $file"
        {
            echo "================================================"
            echo "FILE: $file"
            echo "================================================"
            cat "$file"
            printf "\n"
        } >> "$OUTPUT_FILE"
    done

echo "✅ Done! Context saved to: $OUTPUT_FILE"
