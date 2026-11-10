"""Fixes the raw TurboScribe .srt of the Gemini voiceover (tools/raw.srt -> tools/body.srt; tools/splice_hook.py then builds voiceover.srt).

Nothing was cut from the audio: no line was spoken twice and no heading was read aloud.
Only caption spelling is fixed here; the words follow the recording.
    python3 -I projects/alabama/tools/fix_srt.py
"""
import os, re
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIX = {
    1: "The Mardi Gras beads you caught?",                      # TurboScribe watermark removed
    137: "In 1810, the census counted fewer than 10,000",
    138: "people here.",
    145: "called Cahawba.",
    154: "And in 1846, Alabama built its Capitol on",
    177: "Their descendants are the Poarch Band of Creek",
    216: "The men behind it hid the people in the swamps.",     # transcript: "hid the swamps"; timing fits the script, creator to confirm
    247: "Montgomery stayed the capital for about three months.",
    304: "the Magic City.",
    317: "But the Magic City had a dark engine",
    385: "Joe Louis, the boxer.",
    448: "Their leader was Wernher von Braun.",
    481: "our street, something else was about to launch.",
    487: "His name is Martin Luther King Jr. In",
    501: "of our five blocks, on Court Square, where people",
    512: "church on Dexter Avenue, with a 26-year-old",
    513: "Dr. King as its leader.",
    536: "Addie Mae Collins, Carole Robertson, Cynthia Wesley, Denise",
    603: "FAME started making hits.",
    617: "they were four white guys from Alabama.",
    651: "Unclaimed Baggage.",
    660: "The little town that called itself the Watercress",
}
src = open(os.path.join(HERE, 'tools', 'raw.srt'), encoding='utf-8-sig').read().strip()
out, used = [], set()
for b in re.split(r'\n\s*\n', src):
    lines = b.strip().splitlines()
    n, times, text = int(lines[0]), lines[1], ' '.join(lines[2:]).strip()
    if n in FIX:
        text = FIX[n]; used.add(n)
    text = re.sub(r'\bblack\b', 'Black', text)            # Black Alabamians, Black voters…
    out.append(f"{n}\n{times}\n{text}\n")
open(os.path.join(HERE, 'tools', 'body.srt'), 'w', encoding='utf-8').write('\n'.join(out))
print('cues:', len(out), 'fixed:', len(used), 'unused:', sorted(set(FIX) - used))
