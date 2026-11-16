#!/usr/bin/env python3
"""Builds beats/*.json from voiceover.srt (one beat per caption) plus the direction tables below.
    python3 projects/jews-and-israel/tools/make_beats.py
No chapter cards: every section is {"card": false}; the section title is the era shown on the timeline bar (src/Timeline.tsx).
Shots that are not drawn yet use the placeholder 'g_<era>' (narrator + era name) so the whole film aligns and renders."""
import json, os, re
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ERAS = [('Hook', 1, 21), ('Canaan', 22, 43), ('Kingdoms', 44, 63), ('Exile', 64, 84), ('Return', 85, 92), ('Maccabees', 93, 100),
        ('Rome', 101, 121), ('Diaspora', 122, 157), ('Middle Ages', 158, 187), ('Europe', 188, 242), ('Mandate', 243, 292),
        ('Holocaust', 293, 325), ('Partition', 326, 389), ('Wars', 390, 451), ('Oslo', 452, 479), ('Gaza', 480, 514), ('Today', 515, 591)]

# (first, last, shot, type, options). Ranges not listed fall back to g_<era>.
SHOTS = [
 (1, 1, 'k01', 'HOST', {}), (2, 2, 'k02', 'INSERT', {}), (3, 3, 'k03', 'INSERT', {}), (4, 4, 'k04', 'INSERT', {}), (5, 5, 'k05', 'INSERT', {}),
 (6, 6, 'k06', 'INSERT', {}), (7, 7, 'k07', 'INSERT', {}), (8, 8, 'k08', 'HOST', {}), (9, 9, 'k09', 'INSERT', {}), (10, 10, 'k10', 'INSERT', {}),
 (11, 11, 'k11', 'INSERT', {}), (12, 12, 'k12', 'INSERT', {}), (13, 13, 'k13', 'INSERT', {}), (14, 14, 'k14', 'HOST', {}), (15, 15, 'k15', 'HOST', {}),
 (16, 16, 'k16', 'HOST', {}), (17, 17, 'k17', 'INSERT', {}), (18, 18, 'k18', 'INSERT', {}), (19, 19, 'k19', 'INSERT', {}), (20, 20, 'k20', 'INSERT', {}), (21, 21, 'k21', 'HOST', {}),
]
SHOTS += [
 (22, 22, 'a22', 'HOST', {}), (23, 23, 'a23', 'INSERT', {}), (24, 24, 'a24', 'INSERT', {}), (25, 25, 'a25', 'INSERT', {}), (26, 26, 'a26', 'INSERT', {}), (27, 27, 'a27', 'INSERT', {}), (28, 28, 'a28', 'INSERT', {}), (29, 29, 'a29', 'INSERT', {}), (30, 30, 'a30', 'INSERT', {}), (31, 31, 'a31', 'INSERT', {}), (32, 32, 'a32', 'INSERT', {}), (33, 33, 'a33', 'INSERT', {}), (34, 34, 'a34', 'HOST', {}), (35, 35, 'a35', 'INSERT', {}), (36, 36, 'a36', 'INSERT', {}), (37, 37, 'a37', 'INSERT', {}), (38, 38, 'a38', 'INSERT', {}), (39, 39, 'a39', 'INSERT', {}), (40, 40, 'a40', 'INSERT', {}), (41, 41, 'a41', 'INSERT', {}), (42, 42, 'a42', 'INSERT', {}), (43, 43, 'a43', 'INSERT', {}), (44, 44, 'a44', 'INSERT', {}), (45, 45, 'a45', 'INSERT', {}), (46, 46, 'a46', 'INSERT', {}), (47, 47, 'a47', 'INSERT', {}), (48, 48, 'a48', 'INSERT', {}), (49, 49, 'a49', 'INSERT', {}), (50, 50, 'a50', 'INSERT', {}), (51, 51, 'a51', 'HOST', {}), (52, 52, 'a52', 'INSERT', {}), (53, 53, 'a53', 'INSERT', {}), (54, 54, 'a54', 'INSERT', {}), (55, 55, 'a55', 'INSERT', {}), (56, 56, 'a56', 'INSERT', {}), (57, 57, 'a57', 'INSERT', {}), (58, 58, 'a58', 'INSERT', {}), (59, 59, 'a59', 'INSERT', {}), (60, 60, 'a60', 'INSERT', {}), (61, 61, 'a61', 'INSERT', {}), (62, 62, 'a62', 'INSERT', {}), (63, 63, 'a63', 'INSERT', {}),
]
QUIET = [(293, 325), (520, 540)]

EM = {}
SFX = {}

def read_srt(path):
    out = []
    for block in re.split(r'\n\s*\n', open(path, encoding='utf-8').read().strip()):
        L = block.strip().splitlines(); out.append((int(L[0]), ' '.join(L[2:]).strip()))
    return out

def emphasise(text, words):
    for w in words:
        if w not in text.split(): raise SystemExit(f'emphasis word {w!r} not in caption: {text}')
        text = re.sub(r'(?<!\S)' + re.escape(w) + r'(?!\S)', f'*{w}*', text, count=1)
    return text

def main():
    caps = read_srt(os.path.join(HERE, 'voiceover.srt'))
    shot_of = {}
    for a, b, shot, kind, opts in SHOTS:
        for n in range(a, b + 1): shot_of[n] = (shot, kind, dict(opts))
    os.makedirs(os.path.join(HERE, 'beats'), exist_ok=True)
    for old in os.listdir(os.path.join(HERE, 'beats')): os.remove(os.path.join(HERE, 'beats', old))
    for i, (title, a, b) in enumerate(ERAS):
        beats = []
        for n, text in caps:
            if not a <= n <= b: continue
            shot, kind, opts = shot_of.get(n, ('g_' + re.sub(r'\W', '', title).lower(), 'HOST', {}))
            if any(q0 <= n <= q1 for q0, q1 in QUIET): opts['quiet'] = True
            beat = {'id': f'c{n:03d}', 'shot': shot, 'type': kind, 'text': emphasise(text, EM.get(n, [])), 'date': None}
            beat.update(opts)
            if n in SFX and not opts.get('quiet'): beat['sfx'] = SFX[n]
            beats.append(beat)
        json.dump({'title': title, 'sections': [{'title': title, 'card': False, 'beats': beats}]},
                  open(os.path.join(HERE, 'beats', f'{i:02d}-{re.sub(chr(32), "-", title.lower())}.json'), 'w'), indent=1, ensure_ascii=False)
    print(f'{len(caps)} beats in {len(ERAS)} eras')

if __name__ == '__main__': main()
