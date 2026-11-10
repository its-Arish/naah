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
    # Empires: the French, Mardi Gras, four flags
    (81, 82, 'em_quiet', 'HOST', {}), (83, 88, 'em_french', 'INSERT', {'amb': 'waves'}), (89, 96, 'em_party', 'HOST', {}),
    (97, 105, 'em_flags', 'HOST', {}), (106, 107, 'em_inland', 'HOST', {}),
    # Statehood
    (108, 114, 'st_split', 'STORY', {'amb': 'birds'}), (115, 118, 'st_mims', 'STORY', {'quiet': True}), (119, 125, 'st_horseshoe', 'STORY', {'quiet': True}),
    (126, 130, 'st_treaty', 'INSERT', {'quiet': True}), (131, 139, 'st_fever', 'INSERT', {}), (140, 141, 'st_state', 'HOST', {}),
    (142, 153, 'st_capitals', 'HOST', {}), (154, 162, 'st_street', 'HOST', {}), (163, 167, 'st_rest', 'HOST', {}),
    (168, 175, 'st_removal', 'STORY', {'quiet': True}), (176, 178, 'st_poarch', 'STORY', {'quiet': True}),
    # Cotton
    (179, 184, 'co_belt', 'INSERT', {}), (185, 191, 'co_river', 'INSERT', {'amb': 'waves'}), (192, 195, 'co_pick', 'HOST', {}),
    (196, 202, 'co_street', 'HOST', {}), (203, 206, 'co_belt2', 'INSERT', {}), (207, 220, 'co_clotilda', 'STORY', {'quiet': True}),
    # War
    (221, 224, 'wa_secede', 'HOST', {}), (225, 235, 'wa_street', 'HOST', {}), (236, 246, 'wa_telegram', 'HOST', {}),
    (247, 249, 'wa_richmond', 'INSERT', {}), (250, 256, 'wa_sea', 'INSERT', {'amb': 'waves'}), (257, 264, 'wa_bay', 'INSERT', {'amb': 'waves'}),
    (265, 268, 'wa_raid', 'INSERT', {}), (269, 270, 'wa_free', 'HOST', {}),
    # Iron and peanuts
    (271, 275, 'ir_turner', 'HOST', {}), (276, 289, 'ir_const', 'HOST', {}), (290, 299, 'ir_iron', 'HOST', {}), (300, 304, 'ir_magic', 'INSERT', {}),
    (305, 316, 'ir_vulcan', 'HOST', {}), (317, 325, 'ir_lease', 'STORY', {'quiet': True}), (326, 339, 'ir_carver', 'HOST', {}),
    (340, 348, 'ir_weevil', 'STORY', {'amb': 'birds'}), (349, 358, 'ir_monument', 'HOST', {}), (359, 366, 'ir_wright', 'HOST', {}),
    (367, 381, 'ir_keller', 'HOST', {}), (382, 389, 'ir_names', 'HOST', {}), (390, 395, 'ir_migration', 'INSERT', {}),
    (396, 413, 'ir_scottsboro', 'STORY', {'quiet': True}), (414, 423, 'ir_redtails', 'STORY', {'amb': 'wind'}), (424, 433, 'ir_study', 'STORY', {'quiet': True}),
    # Rocket City
    (434, 441, 'rc_arsenal', 'INSERT', {}), (442, 450, 'rc_germans', 'HOST', {}), (451, 462, 'rc_past', 'STORY', {'quiet': True}),
    (463, 466, 'rc_explorer', 'STORY', {}), (467, 474, 'rc_saturn', 'HOST', {}), (475, 481, 'rc_boom', 'HOST', {}),
    # Five blocks
    (482, 487, 'fb_king', 'HOST', {}), (488, 497, 'fb_bus', 'STORY', {}), (498, 505, 'fb_parks', 'HOST', {}), (506, 516, 'fb_boycott', 'HOST', {}),
    (517, 525, 'fb_wallace', 'HOST', {}), (526, 530, 'fb_children', 'STORY', {}), (531, 539, 'fb_church', 'STORY', {'quiet': True}),
    (540, 549, 'fb_selma', 'INSERT', {}), (550, 559, 'fb_bridge', 'STORY', {'quiet': True}), (560, 563, 'fb_march', 'INSERT', {}),
    (564, 571, 'fb_up', 'HOST', {}), (572, 577, 'fb_answer', 'HOST', {}),
    # Moon
    (578, 585, 'mo_launch', 'STORY', {}), (586, 597, 'mo_answer', 'HOST', {}), (598, 601, 'mo_song', 'INSERT', {}), (602, 622, 'mo_fame', 'HOST', {}),
    (623, 636, 'mo_wallace', 'HOST', {}),
    # Today
    (637, 645, 'td_cars', 'INSERT', {}), (646, 657, 'td_bags', 'HOST', {}), (658, 664, 'td_now', 'INSERT', {}), (665, 671, 'td_africatown', 'INSERT', {'quiet': True, 'amb': 'waves'}),
    (672, 680, 'td_artemis', 'STORY', {}), (681, 687, 'td_ironbowl', 'HOST', {}), (688, 697, 'td_name', 'HOST', {}), (698, 707, 'td_path', 'HOST', {}),
]
DRAWN_TO = 707
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
    83: [['ding', 0, 0.4]], 85: [['pop', 'w:fort', 0.5]], 87: [['scribble', 'w:Louisiana,', 0.4]], 91: [['pops', 'w:party.', 0.5]], 92: [['ding', 0, 0.4]],
    95: [['drum', 'w:ox', 0.4]], 96: [['tick', 'w:1718.', 0.5]], 97: [['boing', 'w:potato.', 0.4]], 98: [['pop', 'w:Britain', 0.5]], 99: [['pop', 'w:Spain', 0.5]],
    102: [['pop', 'w:Mobile.', 0.5]], 103: [['ticks', 0, 0.4]], 104: [['swish', 'w:rental', 0.6]], 105: [['ding', 0, 0.5]], 107: [['whoosh', 'w:inland.', 0.4]],
    110: [['slam', 'w:Red', 0.4]], 114: [['drum', 'w:United', 0.4]], 133: [['ding', 'w:Fever.', 0.5]], 137: [['ticks', 'w:10,000', 0.4]], 139: [['ticks', 'w:125,000.', 0.5]],
    141: [['ding', 'w:22nd', 0.6]], 145: [['pop', 'w:Cahawba.', 0.5]], 146: [['boing', 'w:flooding.', 0.4]], 147: [['pop', 'w:Tuscaloosa.', 0.5]], 153: [['ding', 'w:Montgomery.', 0.5]],
    154: [['pop', 'w:Capitol', 0.5]], 159: [['tick', 0, 0.5]], 164: [['ding', 'w:rest.', 0.4]], 166: [['clang', 'w:Experts', 0.4]], 167: [['stamp', 'w:word', 0.6]],
    182: [['scribble', 'w:Black', 0.4]], 185: [['whoosh', 'w:Steamboats', 0.4]], 188: [['whoosh', 'w:England', 0.4]],
    228: [['paper', 'w:new', 0.4]], 239: [['blip', 'w:telegram', 0.6]], 242: [['drum', 'w:guns', 0.6]], 248: [['whoosh', 'w:Richmond,', 0.4]],
    253: [['whoosh', 'w:CSS', 0.4]], 258: [['rumble', 'w:Union', 0.5]], 261: [['slam', 'w:damn', 0.4]], 264: [['ding', 'w:bay.', 0.4]], 266: [['gallop', 0, 0.4]], 270: [['ding', 'w:free.', 0.5]],
    273: [['ding', 'w:Turner', 0.5]], 275: [['thud', 'w:last.', 0.4]], 282: [['stamp', 'w:Poll', 0.5]], 286: [['ticks', 'w:amended', 0.4]], 288: [['thud', 'w:longest', 0.5]], 289: [['boing', 'w:novels.', 0.4]],
    293: [['swish', 'w:iron', 0.4]], 294: [['swish', 'w:coal.', 0.4]], 295: [['swish', 'w:limestone.', 0.4]], 297: [['anvil', 'w:iron.', 0.5]], 299: [['stamp', 'w:rare.', 0.5]], 302: [['ding', 'w:Birmingham.', 0.5]],
    306: [['clang', 'w:Vulcan,', 0.5]], 311: [['kaching', 'w:pay', 0.4]], 313: [['clang', 'w:pieces', 0.5]], 315: [['boing', 'w:backside', 0.5]],
    332: [['pop', 'w:peanuts.', 0.5]], 335: [['tick', 'w:Dyes,', 0.5], ['tick', 'w:milk,', 0.5], ['tick', 'w:plastics,', 0.5], ['tick', 'w:cosmetics.', 0.5]], 336: [['stamp', 'w:peanut', 0.5]], 337: [['boing', 0, 0.4]],
    342: [['pops', 'w:weevil.', 0.4]], 346: [['pop', 'w:peanuts.', 0.4]], 352: [['thud', 'w:monument.', 0.6]], 353: [['ding', 'w:bug.', 0.5]], 357: [['stamp', 'w:only', 0.5]],
    360: [['whoosh', 'w:Wright', 0.5]], 377: [['tick', 0, 0.4], ['tick', 8, 0.4], ['tick', 16, 0.4], ['tick', 24, 0.4], ['tick', 32, 0.4]], 378: [['ding', 'w:Helen', 0.5]],
    383: [['pop', 'w:Owens,', 0.5]], 385: [['pop', 'w:Louis,', 0.5]], 386: [['pop', 'w:Aaron', 0.5], ['pop', 'w:Mays,', 0.5]], 388: [['pop', 'w:Cole,', 0.5], ['pop', 'w:Williams,', 0.5]], 389: [['ding', 'w:born', 0.5]],
    394: [['whoosh', 'w:Chicago,', 0.4]], 416: [['whoosh', 'w:Tuskegee,', 0.4]], 420: [['ticks', 'w:thousand', 0.4]], 422: [['whoosh', 'w:red,', 0.5]],
    438: [['ding', 'w:Huntsville.', 0.4]], 442: [['whoosh', 'w:1950,', 0.4]], 447: [['rumble', 'w:rockets.', 0.4]], 465: [['rumble', 'w:launches', 0.6]], 466: [['blip', 'w:Explorer', 0.6]],
    471: [['slide_down', 'w:drawing', 0.5]], 478: [['ticks', 0, 0.4]], 479: [['ding', 'w:Rocket', 0.5]],
    487: [['ding', 'w:King', 0.4]], 497: [['thud', 'w:arrested.', 0.4]], 503: [['ding', 'w:Parks.', 0.4]], 505: [['stamp', 'w:no.', 0.5]],
    514: [['ticks', 'w:381', 0.4]], 516: [['stamp', 'w:Constitution.', 0.5]], 521: [['stamp', 'w:forever.', 0.4]],
    547: [['whoosh', 'w:54', 0.4]], 565: [['tick', 'w:fountain', 0.4]], 566: [['tick', 'w:bus', 0.4]], 568: [['tick', 'w:church,', 0.4]], 569: [['ding', 'w:Confederacy', 0.4]], 570: [['stamp', 'w:Voting', 0.5]],
    580: [['rumble', 'w:lifts', 0.6]], 582: [['whoosh', 0, 0.4]], 583: [['ding', 'w:moon.', 0.5]],
    594: [['pop', 'w:engineering.', 0.4]], 595: [['pop', 'w:feet.', 0.4]], 597: [['ding', 'w:song.', 0.5]],
    603: [['pop', 'w:FAME', 0.4]], 609: [['ding', 'w:Swampers.', 0.4]], 617: [['stamp', 'w:white', 0.5]], 620: [['pop', 'w:Sugar', 0.4]],
    638: [['pop', 'w:Mercedes-Benz', 0.4]], 641: [['pops', 'w:Honda,', 0.4]], 643: [['kaching', 'w:million', 0.4]],
    651: [['ding', 'w:Unclaimed', 0.4]], 652: [['ticks', 'w:million', 0.4]], 657: [['boing', 'w:shelf', 0.4]],
    673: [['rumble', 'w:lifted', 0.6]], 680: [['ding', 'w:Again.', 0.5]], 685: [['clang', 'w:Iron', 0.5]], 686: [['blip', 0, 0.4]],
    693: [['stamp', 'w:language.', 0.4]], 698: [['swish', 'w:path', 0.6]],
    700: [['pop', 'w:fire.', 0.4]], 701: [['pop', 'w:peanut.', 0.4]], 702: [['pop', 'w:rocket.', 0.4]], 703: [['pop', 'w:seat.', 0.4]], 704: [['pop', 'w:bridge.', 0.4]], 707: [['ding', 'w:path.', 0.5]],
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
