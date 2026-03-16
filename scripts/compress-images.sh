#!/usr/bin/env bash
# compress-images.sh
# Converts all JPEG/JPG/PNG images to WebP (max 1920px wide, quality 82)
# Originals are kept under images/_originals/ as backup

set -euo pipefail

IMAGES_DIR="$(cd "$(dirname "$0")/.." && pwd)/images"
BACKUP_DIR="$IMAGES_DIR/_originals"
CONVERT_BIN="/opt/homebrew/bin/magick"

if [[ ! -x "$CONVERT_BIN" ]]; then
  echo "Error: ImageMagick not found at $CONVERT_BIN"
  exit 1
fi

total=0
converted=0
saved_bytes=0

echo "==> Scanning $IMAGES_DIR ..."

while IFS= read -r -d '' file; do
  ext="${file##*.}"
  ext_lower="$(echo "$ext" | tr '[:upper:]' '[:lower:]')"

  # Skip already-converted webp files and backup dir
  [[ "$file" == *"/_originals/"* ]] && continue
  [[ "$ext_lower" == "webp" ]] && continue

  total=$((total + 1))

  # Determine output path (same location, .webp extension)
  dir="$(dirname "$file")"
  base="$(basename "$file" ".$ext")"
  out="$dir/$base.webp"

  # Backup original
  rel="${file#$IMAGES_DIR/}"
  backup_path="$BACKUP_DIR/$rel"
  mkdir -p "$(dirname "$backup_path")"
  cp "$file" "$backup_path"

  # Convert: resize to max 1920px wide, WebP quality 82
  "$CONVERT_BIN" "$file" \
    -resize '1920x>' \
    -quality 82 \
    -define webp:method=6 \
    "$out"

  orig_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
  new_size=$(stat -f%z "$out" 2>/dev/null || stat -c%s "$out")
  diff=$((orig_size - new_size))
  saved_bytes=$((saved_bytes + diff))

  echo "  ✓ $rel  $(( orig_size / 1024 ))KB → $(( new_size / 1024 ))KB"

  # Remove original after successful conversion
  rm "$file"
  converted=$((converted + 1))

done < <(find "$IMAGES_DIR" \( -name "*.jpeg" -o -name "*.jpg" -o -name "*.JPG" -o -name "*.JPEG" -o -name "*.png" -o -name "*.PNG" \) -not -path "*/_originals/*" -print0)

saved_mb=$(( saved_bytes / 1024 / 1024 ))
echo ""
echo "==> Done: $converted/$total images converted"
echo "==> Space saved: ~${saved_mb} MB"
echo "==> Originals backed up to: $BACKUP_DIR"
