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
    ('Hook', 1, 34), ('First Alabamians', 35, 69), ('Empires', 70, 120), ('Statehood', 121, 191), ('Cotton', 192, 233),
    ('War', 234, 283), ('Iron and peanuts', 284, 446), ('Rocket City', 447, 494), ('Five blocks', 495, 590),
    ('Moon', 591, 649), ('Today', 650, 720),
]

# first caption, last caption, shot id, type, options
SHOTS = [
    # Hook (second take, 10 Nov 2026: tools/splice_hook.py)
    (1, 1, 'h_title', 'HOST', {}),
    (2, 4, 'h_song', 'HOST', {}),
    (5, 7, 'h_florida', 'HOST', {}),
    (8, 10, 'h_reply', 'HOST', {}),
    (11, 14, 'h_town', 'INSERT', {}),
    (15, 17, 'h_life', 'HOST', {}),
    (18, 19, 'h_beads', 'HOST', {}),
    (20, 21, 'h_mobile', 'INSERT', {'amb': 'waves'}),
    (22, 25, 'h_bag', 'HOST', {}),
    (26, 28, 'h_rocket', 'INSERT', {}),
    (29, 31, 'h_bridge', 'STORY', {'quiet': True}),
    (32, 32, 'h_both', 'HOST', {}),
    (33, 34, 'h_street', 'HOST', {}),
    # First Alabamians
    (35, 35, 'fa_back', 'HOST', {}),
    (36, 43, 'fa_cave', 'STORY', {'amb': 'camp'}),
    (44, 44, 'fa_build', 'HOST', {}),
    (45, 50, 'fa_mounds', 'STORY', {'amb': 'birds'}),
    (51, 54, 'fa_people', 'STORY', {'amb': 'birds'}),
    (55, 58, 'fa_trade', 'INSERT', {}),
    (59, 61, 'fa_empty', 'STORY', {'amb': 'wind'}),
    (62, 66, 'fa_nations', 'INSERT', {}),
    (67, 69, 'fa_name', 'HOST', {}),
    # Empires: de Soto and Mabila
    (70, 73, 'em_route', 'INSERT', {}),
    (74, 75, 'em_gold', 'HOST', {}),
    (76, 81, 'em_chief', 'STORY', {}),
    (82, 84, 'em_follow', 'STORY', {'amb': 'wind'}),
    (85, 91, 'em_mabila', 'STORY', {'quiet': True}),
    (92, 93, 'em_unknown', 'INSERT', {'quiet': True}),
    # Empires: the French, Mardi Gras, four flags
    (94, 95, 'em_quiet', 'HOST', {}), (96, 101, 'em_french', 'INSERT', {'amb': 'waves'}), (102, 109, 'em_party', 'HOST', {}),
    (110, 118, 'em_flags', 'HOST', {}), (119, 120, 'em_inland', 'HOST', {}),
    # Statehood
    (121, 127, 'st_split', 'STORY', {'amb': 'birds'}), (128, 131, 'st_mims', 'STORY', {'quiet': True}), (132, 138, 'st_horseshoe', 'STORY', {'quiet': True}),
    (139, 143, 'st_treaty', 'INSERT', {'quiet': True}), (144, 152, 'st_fever', 'INSERT', {}), (153, 154, 'st_state', 'HOST', {}),
    (155, 166, 'st_capitals', 'HOST', {}), (167, 175, 'st_street', 'HOST', {}), (176, 180, 'st_rest', 'HOST', {}),
    (181, 188, 'st_removal', 'STORY', {'quiet': True}), (189, 191, 'st_poarch', 'STORY', {'quiet': True}),
    # Cotton
    (192, 197, 'co_belt', 'INSERT', {}), (198, 204, 'co_river', 'INSERT', {'amb': 'waves'}), (205, 208, 'co_pick', 'HOST', {}),
    (209, 215, 'co_street', 'HOST', {}), (216, 219, 'co_belt2', 'INSERT', {}), (220, 233, 'co_clotilda', 'STORY', {'quiet': True}),
    # War
    (234, 237, 'wa_secede', 'HOST', {}), (238, 248, 'wa_street', 'HOST', {}), (249, 259, 'wa_telegram', 'HOST', {}),
    (260, 262, 'wa_richmond', 'INSERT', {}), (263, 269, 'wa_sea', 'INSERT', {'amb': 'waves'}), (270, 277, 'wa_bay', 'INSERT', {'amb': 'waves'}),
    (278, 281, 'wa_raid', 'INSERT', {}), (282, 283, 'wa_free', 'HOST', {}),
    # Iron and peanuts
    (284, 288, 'ir_turner', 'HOST', {}), (289, 302, 'ir_const', 'HOST', {}), (303, 312, 'ir_iron', 'HOST', {}), (313, 317, 'ir_magic', 'INSERT', {}),
    (318, 329, 'ir_vulcan', 'HOST', {}), (330, 338, 'ir_lease', 'STORY', {'quiet': True}), (339, 352, 'ir_carver', 'HOST', {}),
    (353, 361, 'ir_weevil', 'STORY', {'amb': 'birds'}), (362, 371, 'ir_monument', 'HOST', {}), (372, 379, 'ir_wright', 'HOST', {}),
    (380, 394, 'ir_keller', 'HOST', {}), (395, 402, 'ir_names', 'HOST', {}), (403, 408, 'ir_migration', 'INSERT', {}),
    (409, 426, 'ir_scottsboro', 'STORY', {'quiet': True}), (427, 436, 'ir_redtails', 'STORY', {'amb': 'wind'}), (437, 446, 'ir_study', 'STORY', {'quiet': True}),
    # Rocket City
    (447, 454, 'rc_arsenal', 'INSERT', {}), (455, 463, 'rc_germans', 'HOST', {}), (464, 475, 'rc_past', 'STORY', {'quiet': True}),
    (476, 479, 'rc_explorer', 'STORY', {}), (480, 487, 'rc_saturn', 'HOST', {}), (488, 494, 'rc_boom', 'HOST', {}),
    # Five blocks
    (495, 500, 'fb_king', 'HOST', {}), (501, 510, 'fb_bus', 'STORY', {}), (511, 518, 'fb_parks', 'HOST', {}), (519, 529, 'fb_boycott', 'HOST', {}),
    (530, 538, 'fb_wallace', 'HOST', {}), (539, 543, 'fb_children', 'STORY', {}), (544, 552, 'fb_church', 'STORY', {'quiet': True}),
    (553, 562, 'fb_selma', 'INSERT', {}), (563, 572, 'fb_bridge', 'STORY', {'quiet': True}), (573, 576, 'fb_march', 'INSERT', {}),
    (577, 584, 'fb_up', 'HOST', {}), (585, 590, 'fb_answer', 'HOST', {}),
    # Moon
    (591, 598, 'mo_launch', 'STORY', {}), (599, 610, 'mo_answer', 'HOST', {}), (611, 614, 'mo_song', 'INSERT', {}), (615, 635, 'mo_fame', 'HOST', {}),
    (636, 649, 'mo_wallace', 'HOST', {}),
    # Today
    (650, 658, 'td_cars', 'INSERT', {}), (659, 670, 'td_bags', 'HOST', {}), (671, 677, 'td_now', 'INSERT', {}), (678, 684, 'td_africatown', 'INSERT', {'quiet': True, 'amb': 'waves'}),
    (685, 693, 'td_artemis', 'STORY', {}), (694, 700, 'td_ironbowl', 'HOST', {}), (701, 710, 'td_name', 'HOST', {}), (711, 720, 'td_path', 'HOST', {}),
]
DRAWN_TO = 720
for name, a, b in ERAS:
    a = max(a, DRAWN_TO + 1)
    if a <= b:
        SHOTS.append((a, b, 'todo_' + name.lower().replace(' ', '_'), 'HOST', {}))

EM = {7: ['Florida.'], 14: ['16,000'], 16: ['life.'], 19: ['wasn\'t'], 21: ['existed.'], 25: ['Alabama.'], 28: ['Alabama.'], 32: ['both?'], 34: ['blocks'], 35: ['10,000'], 49: ['60'], 50: ['Moundville.'], 52: ['10,000'], 69: ['200'], 75: ['any.']}
SFX = {1: [['thud', 'w:Sweet', 0.4], ['ding', 'w:Alabama.', 0.4]], 2: [['pop', 'w:wedding,', 0.4], ['pop', 'w:ball', 0.4]], 3: [['pop', 'w:drive', 0.4]], 7: [['clang', 'w:Florida.', 0.5]], 8: [['whoosh', 'w:comeback,', 0.4]], 9: [['tick', 'w:two', 0.4]], 13: [['pop', 'w:tiny', 0.4]], 15: [['ding', 'w:Alabama.', 0.4]], 17: [['pops', 'w:noticed.', 0.4]], 18: [['pops', 'w:beads', 0.4]], 19: [['stamp', "w:wasn't", 0.6]], 20: [['ding', 'w:Mobile,', 0.4]], 21: [['slam', 'w:existed.', 0.4]], 22: [['thud', 'w:suitcase', 0.5]], 24: [['kaching', 'w:sale', 0.4]], 25: [['ding', 'w:Alabama.', 0.4]], 26: [['rumble', 'w:rocket', 0.6]], 28: [['ding', 'w:Alabama.', 0.5]], 32: [['boing', 'w:both?', 0.4]], 33: [['paper', 'w:street,', 0.5]], 34: [['tick', 'w:blocks', 0.6]], 35: [['whoosh', 'w:back', 0.5], ['ticks', 'w:10,000', 0.5]], 39: [['ding', 'w:Russell', 0.4]], 45: [['thud', 'w:Black', 0.3]], 47: [['pops', 'w:29', 0.4]], 50: [['ding', 'w:Moundville.', 0.4]], 52: [['pops', 'w:10,000', 0.4]], 55: [['pop', 'w:copper', 0.4]], 64: [['pop', 'w:Creek,', 0.4], ['pop', 'w:Cherokee,', 0.4], ['pop', 'w:Choctaw,', 0.4], ['pop', 'w:Chickasaw,', 0.4]], 66: [['ding', 'w:Alabama.', 0.5]], 67: [['scribble', 'w:name.', 0.4]], 70: [['drum', 0, 0.5]], 73: [['bleat', 'w:pigs.', 0.5]], 75: [['boing', 'w:any.', 0.5]], 84: [['thud', 'w:Mabila.', 0.4]], 96: [['ding', 0, 0.4]], 98: [['pop', 'w:fort', 0.5]], 100: [['scribble', 'w:Louisiana,', 0.4]], 104: [['pops', 'w:party.', 0.5]], 105: [['ding', 0, 0.4]], 108: [['drum', 'w:ox', 0.4]], 109: [['tick', 'w:1718.', 0.5]], 110: [['boing', 'w:potato.', 0.4]], 111: [['pop', 'w:Britain', 0.5]], 112: [['pop', 'w:Spain', 0.5]], 115: [['pop', 'w:Mobile.', 0.5]], 116: [['ticks', 0, 0.4]], 117: [['swish', 'w:rental', 0.6]], 118: [['ding', 0, 0.5]], 120: [['whoosh', 'w:inland.', 0.4]], 123: [['slam', 'w:Red', 0.4]], 127: [['drum', 'w:United', 0.4]], 146: [['ding', 'w:Fever.', 0.5]], 150: [['ticks', 'w:10,000', 0.4]], 152: [['ticks', 'w:125,000.', 0.5]], 154: [['ding', 'w:22nd', 0.6]], 158: [['pop', 'w:Cahawba.', 0.5]], 159: [['boing', 'w:flooding.', 0.4]], 160: [['pop', 'w:Tuscaloosa.', 0.5]], 166: [['ding', 'w:Montgomery.', 0.5]], 167: [['pop', 'w:Capitol', 0.5]], 172: [['tick', 0, 0.5]], 177: [['ding', 'w:rest.', 0.4]], 179: [['clang', 'w:Experts', 0.4]], 180: [['stamp', 'w:word', 0.6]], 195: [['scribble', 'w:Black', 0.4]], 198: [['whoosh', 'w:Steamboats', 0.4]], 201: [['whoosh', 'w:England', 0.4]], 241: [['paper', 'w:new', 0.4]], 252: [['blip', 'w:telegram', 0.6]], 255: [['drum', 'w:guns', 0.6]], 261: [['whoosh', 'w:Richmond,', 0.4]], 266: [['whoosh', 'w:CSS', 0.4]], 271: [['rumble', 'w:Union', 0.5]], 274: [['slam', 'w:damn', 0.4]], 277: [['ding', 'w:bay.', 0.4]], 279: [['gallop', 0, 0.4]], 283: [['ding', 'w:free.', 0.5]], 286: [['ding', 'w:Turner', 0.5]], 288: [['thud', 'w:last.', 0.4]], 295: [['stamp', 'w:Poll', 0.5]], 299: [['ticks', 'w:amended', 0.4]], 301: [['thud', 'w:longest', 0.5]], 302: [['boing', 'w:novels.', 0.4]], 306: [['swish', 'w:iron', 0.4]], 307: [['swish', 'w:coal.', 0.4]], 308: [['swish', 'w:limestone.', 0.4]], 310: [['anvil', 'w:iron.', 0.5]], 312: [['stamp', 'w:rare.', 0.5]], 315: [['ding', 'w:Birmingham.', 0.5]], 319: [['clang', 'w:Vulcan,', 0.5]], 324: [['kaching', 'w:pay', 0.4]], 326: [['clang', 'w:pieces', 0.5]], 328: [['boing', 'w:backside', 0.5]], 345: [['pop', 'w:peanuts.', 0.5]], 348: [['tick', 'w:Dyes,', 0.5], ['tick', 'w:milk,', 0.5], ['tick', 'w:plastics,', 0.5], ['tick', 'w:cosmetics.', 0.5]], 349: [['stamp', 'w:peanut', 0.5]], 350: [['boing', 0, 0.4]], 355: [['pops', 'w:weevil.', 0.4]], 359: [['pop', 'w:peanuts.', 0.4]], 365: [['thud', 'w:monument.', 0.6]], 366: [['ding', 'w:bug.', 0.5]], 370: [['stamp', 'w:only', 0.5]], 373: [['whoosh', 'w:Wright', 0.5]], 390: [['tick', 0, 0.4], ['tick', 8, 0.4], ['tick', 16, 0.4], ['tick', 24, 0.4], ['tick', 32, 0.4]], 391: [['ding', 'w:Helen', 0.5]], 396: [['pop', 'w:Owens,', 0.5]], 398: [['pop', 'w:Louis,', 0.5]], 399: [['pop', 'w:Aaron', 0.5], ['pop', 'w:Mays,', 0.5]], 401: [['pop', 'w:Cole,', 0.5], ['pop', 'w:Williams,', 0.5]], 402: [['ding', 'w:born', 0.5]], 407: [['whoosh', 'w:Chicago,', 0.4]], 429: [['whoosh', 'w:Tuskegee,', 0.4]], 433: [['ticks', 'w:thousand', 0.4]], 435: [['whoosh', 'w:red,', 0.5]], 451: [['ding', 'w:Huntsville.', 0.4]], 455: [['whoosh', 'w:1950,', 0.4]], 460: [['rumble', 'w:rockets.', 0.4]], 478: [['rumble', 'w:launches', 0.6]], 479: [['blip', 'w:Explorer', 0.6]], 484: [['slide_down', 'w:drawing', 0.5]], 491: [['ticks', 0, 0.4]], 492: [['ding', 'w:Rocket', 0.5]], 500: [['ding', 'w:King', 0.4]], 510: [['thud', 'w:arrested.', 0.4]], 516: [['ding', 'w:Parks.', 0.4]], 518: [['stamp', 'w:no.', 0.5]], 527: [['ticks', 'w:381', 0.4]], 529: [['stamp', 'w:Constitution.', 0.5]], 534: [['stamp', 'w:forever.', 0.4]], 560: [['whoosh', 'w:54', 0.4]], 578: [['tick', 'w:fountain', 0.4]], 579: [['tick', 'w:bus', 0.4]], 581: [['tick', 'w:church,', 0.4]], 582: [['ding', 'w:Confederacy', 0.4]], 583: [['stamp', 'w:Voting', 0.5]], 593: [['rumble', 'w:lifts', 0.6]], 595: [['whoosh', 0, 0.4]], 596: [['ding', 'w:moon.', 0.5]], 607: [['pop', 'w:engineering.', 0.4]], 608: [['pop', 'w:feet.', 0.4]], 610: [['ding', 'w:song.', 0.5]], 616: [['pop', 'w:FAME', 0.4]], 622: [['ding', 'w:Swampers.', 0.4]], 630: [['stamp', 'w:white', 0.5]], 633: [['pop', 'w:Sugar', 0.4]], 651: [['pop', 'w:Mercedes-Benz', 0.4]], 654: [['pops', 'w:Honda,', 0.4]], 656: [['kaching', 'w:million', 0.4]], 664: [['ding', 'w:Unclaimed', 0.4]], 665: [['ticks', 'w:million', 0.4]], 670: [['boing', 'w:shelf', 0.4]], 686: [['rumble', 'w:lifted', 0.6]], 693: [['ding', 'w:Again.', 0.5]], 698: [['clang', 'w:Iron', 0.5]], 699: [['blip', 0, 0.4]], 706: [['stamp', 'w:language.', 0.4]], 711: [['swish', 'w:path', 0.6]], 713: [['pop', 'w:fire.', 0.4]], 714: [['pop', 'w:peanut.', 0.4]], 715: [['pop', 'w:rocket.', 0.4]], 716: [['pop', 'w:seat.', 0.4]], 717: [['pop', 'w:bridge.', 0.4]], 720: [['ding', 'w:path.', 0.5]]}


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
