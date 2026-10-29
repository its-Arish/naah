#!/usr/bin/env bash
# Rebuild the visual catalogue in docs/gallery/ (run from the repo root after adding to the library).
set -e
node scripts/studio.mjs check gallery
rm -rf projects/gallery/out/stills
node scripts/studio.mjs stills gallery
mkdir -p docs/gallery
names=(00-opening 01-wardrobe-people 02-wardrobe-soldiers 03-wardrobe-asia-redress-silhouettes 04-hats 05-poses-expressions 06-backgrounds-general-nepal 07-backgrounds-india-1 08-backgrounds-india-2 09-backgrounds-france-vietnam 10-vehicles-buildings-flags-maps 11-animals-nature-props 12-infographics 13-end)
i=0
for f in $(ls projects/gallery/out/stills/f*.png | sort); do
  n=${names[$i]}; i=$((i+1))
  [[ $n == 00-opening || $n == 13-end ]] && continue
  ffmpeg -v error -y -i "$f" -vf scale=1600:-1 "docs/gallery/$n.png"
done
ls docs/gallery
