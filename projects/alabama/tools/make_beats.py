#!/usr/bin/env python3
"""Builds beats/*.json from voiceover.srt (one beat per caption) plus the direction tables below.

    python3 -I projects/alabama/tools/make_beats.py

No chapter cards: every section is {"card": false}; the section title is the era on the timeline bar (src/Timeline.tsx).
Copied from projects/california/tools/make_beats.py. Captions after the pilot still point at per-era placeholder
shots ('todo_*') until they are drawn.
"""
import json, os, re

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ERAS = [
    ('Hook', 1, 21), ('First Alabamians', 22, 56), ('Empires', 57, 107), ('Statehood', 108, 178), ('Cotton', 179, 220),
    ('War', 221, 270), ('Iron and peanuts', 271, 433), ('Rocket City', 434, 481), ('Five blocks', 482, 577),
    ('Moon', 578, 636), ('Today', 637, 707),
]

# first caption, last caption, shot id, type, options
SHOTS = [
    # Hook
    (1, 2, 'h_beads', 'HOST', {}),
    (3, 4, 'h_mobile', 'INSERT', {'amb': 'waves'}),
    (5, 8, 'h_bag', 'HOST', {}),
    (9, 12, 'h_songs', 'HOST', {}),
    (13, 15, 'h_rocket', 'INSERT', {}),
    (16, 18, 'h_bridge', 'STORY', {'quiet': True}),
    (19, 19, 'h_both', 'HOST', {}),
    (20, 21, 'h_street', 'HOST', {}),
    # First Alabamians
    (22, 22, 'fa_back', 'HOST', {}),
    (23, 30, 'fa_cave', 'STORY', {'amb': 'camp'}),
    (31, 31, 'fa_build', 'HOST', {}),
    (32, 37, 'fa_mounds', 'STORY', {'amb': 'birds'}),
    (38, 41, 'fa_people', 'STORY', {'amb': 'birds'}),
    (42, 45, 'fa_trade', 'INSERT', {}),
    (46, 48, 'fa_empty', 'STORY', {'amb': 'wind'}),
    (49, 53, 'fa_nations', 'INSERT', {}),
    (54, 56, 'fa_name', 'HOST', {}),
    # Empires: de Soto and Mabila
    (57, 60, 'em_route', 'INSERT', {}),
    (61, 62, 'em_gold', 'HOST', {}),
    (63, 68, 'em_chief', 'STORY', {}),
    (69, 71, 'em_follow', 'STORY', {'amb': 'wind'}),
    (72, 78, 'em_mabila', 'STORY', {'quiet': True}),
    (79, 80, 'em_unknown', 'INSERT', {'quiet': True}),
]
DRAWN_TO = 80
for name, a, b in ERAS:
    a = max(a, DRAWN_TO + 1)
    if a <= b:
        SHOTS.append((a, b, 'todo_' + name.lower().replace(' ', '_'), 'HOST', {}))

EM = {2: ['wasn\'t'], 4: ['existed.'], 8: ['Alabama.'], 11: ['14,000'], 15: ['Alabama.'], 19: ['both?'], 21: ['blocks'],
      22: ['10,000'], 36: ['60'], 37: ['Moundville.'], 39: ['10,000'], 56: ['200'], 62: ['any.']}
SFX = {
    1: [['pops', 'w:beads', 0.4]],
    2: [['stamp', "w:wasn't", 0.6]],
    3: [['ding', 'w:Mobile,', 0.4]],
    4: [['slam', 'w:existed.', 0.4]],
    5: [['thud', 'w:suitcase', 0.5]],
    7: [['kaching', 'w:sale', 0.4]],
    8: [['ding', 'w:Alabama.', 0.4]],
    9: [['pop', 'w:songs', 0.5]],
    11: [['stamp', 'w:14,000', 0.5]],
    13: [['rumble', 'w:rocket', 0.6]],
    15: [['ding', 'w:Alabama.', 0.5]],
    19: [['boing', 'w:both?', 0.4]],
    20: [['paper', 'w:street,', 0.5]],
    21: [['tick', 'w:blocks', 0.6]],
    22: [['whoosh', 'w:back', 0.5], ['ticks', 'w:10,000', 0.5]],
    26: [['ding', 'w:Russell', 0.4]],
    32: [['thud', 'w:Black', 0.3]],
    34: [['pops', 'w:29', 0.4]],
    37: [['ding', 'w:Moundville.', 0.4]],
    39: [['pops', 'w:10,000', 0.4]],
    42: [['pop', 'w:copper', 0.4]],
    51: [['pop', 'w:Creek,', 0.4], ['pop', 'w:Cherokee,', 0.4], ['pop', 'w:Choctaw,', 0.4], ['pop', 'w:Chickasaw,', 0.4]],
    53: [['ding', 'w:Alabama.', 0.5]],
    54: [['scribble', 'w:name.', 0.4]],
    57: [['drum', 0, 0.5]],
    60: [['bleat', 'w:pigs.', 0.5]],
    62: [['boing', 'w:any.', 0.5]],
    71: [['thud', 'w:Mabila.', 0.4]],
}


def read_srt(path):
    out = []
    for block in re.split(r'\n\s*\n', open(path, encoding='utf-8').read().strip()):
        lines = block.strip().splitlines()
        out.append((int(lines[0]), ' '.join(lines[2:]).strip()))
    return out


def emphasise(text, words):
    for w in words:
        if w not in text.split():
            raise SystemExit(f'emphasis word {w!r} not in caption: {text}')
        text = re.sub(r'(?<!\S)' + re.escape(w) + r'(?!\S)', f'*{w}*', text, count=1)
    return text


def main():
    caps = read_srt(os.path.join(HERE, 'voiceover.srt'))
    shot_of = {}
    for a, b, shot, kind, opts in SHOTS:
        for n in range(a, b + 1):
            shot_of[n] = (shot, kind, opts)
    missing = [n for n, _ in caps if n not in shot_of]
    if missing:
        raise SystemExit(f'captions with no shot: {missing[:10]}')
    bdir = os.path.join(HERE, 'beats')
    os.makedirs(bdir, exist_ok=True)
    for old in os.listdir(bdir):
        os.remove(os.path.join(bdir, old))
    for i, (title, a, b) in enumerate(ERAS):
        beats = []
        for n, text in caps:
            if not a <= n <= b:
                continue
            shot, kind, opts = shot_of[n]
            beat = {'id': f'c{n:03d}', 'shot': shot, 'type': kind, 'text': emphasise(text, EM.get(n, [])), 'date': None}
            beat.update(opts)
            if n in SFX and not opts.get('quiet'):
                beat['sfx'] = SFX[n]
            beats.append(beat)
        json.dump({'title': title, 'sections': [{'title': title, 'card': False, 'beats': beats}]},
                  open(os.path.join(bdir, f'{i:02d}-{title.lower().replace(" ", "-")}.json'), 'w'), indent=1, ensure_ascii=False)
    print(f'{len(caps)} beats in {len(ERAS)} eras')


if __name__ == '__main__':
    main()
