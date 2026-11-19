# 2026-11-20: America film, every map shot replaced with History Map clips

Asked: replace every map shot in america-share.mp4 (43:48) with History Map satellite clips, keep the voiceover in sync.

Made: 146 map beats, 323 segments. Clips recorded in the Claude desktop built-in browser (the sandbox cannot reach the tile servers), conformed to 30 fps with exact frame counts, composited with the narrator, staff, label chip, captions and era bar, then spliced into the film. Audio stream is copied unchanged (checksum identical), frame count 78,843 = original.

Learned:
- Record only after `map.areTilesLoaded()` plus a 1-2 s settle; otherwise clips start with dark frames. Check per frame, not at 6 fps (single dark first frames show as a flicker at every cut): `tools/fix_dark_lead.py`.
- Check each recording's length; some come back 0.03 s long. Retry until the size is plausible.
- After any manual download click the page's recorder can hang; reload the page and reload the segment json.
- Splice piece by piece (`tools/splice_pieces.py`); a single filter_complex over 146 inputs runs out of memory.
- Hook beats (c001-c020) have no era bar in the original: composite.py leaves the band empty there.

Not done: army icons on war maps, zoom whoosh/impact sounds in the mux, Cliopatria borders only cover 1941.
