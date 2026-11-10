#!/usr/bin/env python3
"""Builds beats/*.json from voiceover.srt (one beat per caption) plus the direction table below.

    python3 projects/california/tools/make_beats.py

The film has no chapter cards: every section is {"card": false}. The section title is the era shown
on the timeline bar at the top of the screen (see src/Timeline.tsx).
"""
import json, os, re

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# era (section) -> first and last caption number
ERAS = [
    ('Hook', 1, 12), ('First Californians', 13, 24), ('Spain', 25, 50), ('Mexico', 51, 71), ('Gold', 72, 118),
    ('Railroad', 119, 147), ('Sunshine', 148, 185), ('Dust and war', 186, 215), ('Silicon', 216, 244), ('Today', 245, 283),
]

# first caption, last caption, shot id, type, options
SHOTS = [
    (1, 1, 'h_room', 'HOST', {}),
    (2, 3, 'h_things', 'HOST', {}),
    (4, 4, 'h_globe', 'INSERT', {}),
    (5, 6, 'h_novel', 'INSERT', {}),
    (7, 7, 'h_island', 'INSERT', {}),
    (8, 8, 'h_decree', 'HOST', {}),
    (9, 9, 'h_econ', 'INSERT', {}),
    (10, 12, 'h_board', 'HOST', {}),
    (13, 13, 'fc_cane', 'HOST', {}),
    (14, 17, 'fc_map', 'INSERT', {}),
    (18, 18, 'fc_canoe', 'STORY', {'amb': 'waves'}),
    (19, 19, 'fc_acorn', 'STORY', {'amb': 'birds'}),
    (20, 21, 'fc_fire', 'STORY', {'amb': 'birds'}),
    (22, 23, 'fc_river', 'STORY', {}),
    (24, 24, 'fc_change', 'HOST', {}),
    (25, 26, 'sp_cabrillo', 'INSERT', {'amb': 'waves'}),
    (27, 28, 'sp_react', 'HOST', {}),
    (29, 30, 'sp_wait', 'HOST', {}),
    (31, 32, 'sp_drake', 'STORY', {'amb': 'waves'}),
    (33, 34, 'sp_woke', 'HOST', {}),
    (35, 36, 'sp_russia', 'INSERT', {}),
    (37, 39, 'sp_missions', 'INSERT', {}),
    (40, 43, 'sp_cities', 'HOST', {}),
    (44, 48, 'sp_walls', 'STORY', {'quiet': True}),
    (49, 50, 'sp_rush1', 'HOST', {'quiet': True}),
    (51, 52, 'mx_flag', 'HOST', {}), (53, 55, 'mx_ranch', 'STORY', {'amb': 'birds'}), (56, 57, 'mx_trickle', 'INSERT', {}), (58, 60, 'mx_sonoma', 'STORY', {}),
    (61, 62, 'mx_paint', 'HOST', {}), (63, 64, 'mx_days', 'HOST', {}), (65, 67, 'mx_grizzly', 'HOST', {}), (68, 68, 'mx_dates', 'HOST', {}), (69, 69, 'mx_cession', 'INSERT', {}), (70, 71, 'mx_nine', 'HOST', {}),
    (72, 75, 'gd_mill', 'STORY', {'amb': 'birds'}), (76, 78, 'gd_novel', 'HOST', {}), (79, 80, 'gd_secret', 'HOST', {}), (81, 83, 'gd_brannan', 'HOST', {}), (84, 86, 'gd_shout', 'STORY', {}),
    (87, 88, 'gd_boom', 'HOST', {}), (89, 91, 'gd_ships', 'STORY', {'amb': 'waves'}), (92, 94, 'gd_world', 'INSERT', {}), (95, 96, 'gd_prices', 'HOST', {}), (97, 98, 'gd_state', 'HOST', {}),
    (99, 107, 'gd_quiet', 'STORY', {'quiet': True}), (108, 113, 'gd_men', 'HOST', {'quiet': True}), (114, 118, 'gd_who', 'HOST', {}),
    (119, 120, 'rr_problem', 'HOST', {}), (121, 124, 'rr_routes', 'INSERT', {}), (125, 126, 'rr_crazy', 'INSERT', {}), (127, 130, 'rr_four', 'HOST', {}), (131, 135, 'rr_workers', 'STORY', {'amb': 'wind'}),
    (136, 138, 'rr_meet', 'INSERT', {}), (139, 142, 'rr_quiet', 'STORY', {'quiet': True}), (143, 147, 'rr_stanford', 'STORY', {'amb': 'birds'}),
    (148, 154, 'su_ads', 'HOST', {}), (155, 156, 'su_ticket', 'HOST', {}), (157, 158, 'su_la', 'HOST', {}), (159, 165, 'su_quake', 'STORY', {'quiet': True}), (166, 167, 'su_water', 'HOST', {}),
    (168, 171, 'su_aqueduct', 'INSERT', {}), (172, 175, 'su_speech', 'STORY', {}), (176, 176, 'su_owens', 'STORY', {'amb': 'wind'}), (177, 178, 'su_insiders', 'HOST', {}), (179, 183, 'su_hollywood', 'STORY', {'amb': 'birds'}), (184, 185, 'su_rule', 'HOST', {}),
    (186, 188, 'dw_dust', 'STORY', {'amb': 'wind'}), (189, 190, 'dw_road', 'INSERT', {}), (191, 193, 'dw_border', 'STORY', {'amb': 'wind'}), (194, 195, 'dw_fruit', 'STORY', {'amb': 'birds'}), (196, 197, 'dw_bridge', 'STORY', {'amb': 'waves'}),
    (198, 200, 'dw_war', 'INSERT', {}), (201, 202, 'dw_yard', 'STORY', {'amb': 'waves'}), (203, 204, 'dw_growth', 'HOST', {}), (205, 209, 'dw_quiet', 'STORY', {'quiet': True}), (210, 215, 'dw_after', 'STORY', {'amb': 'birds'}),
    (216, 220, 'si_farm', 'STORY', {'amb': 'birds'}), (221, 222, 'si_garage', 'STORY', {}), (223, 228, 'si_eight', 'HOST', {}), (229, 231, 'si_sand', 'HOST', {}), (232, 233, 'si_net', 'INSERT', {}),
    (234, 236, 'si_screen', 'INSERT', {}), (237, 242, 'si_garages', 'HOST', {}), (243, 244, 'si_gold', 'HOST', {}),
    (245, 246, 'td_nine', 'HOST', {}), (247, 249, 'td_bill', 'HOST', {'quiet': True}), (250, 254, 'td_fire', 'STORY', {'quiet': True}), (255, 257, 'td_ai', 'INSERT', {}), (258, 265, 'td_board', 'HOST', {}),
    (266, 272, 'td_levi', 'HOST', {}), (273, 275, 'td_chips', 'HOST', {}), (276, 278, 'td_gone', 'HOST', {}), (279, 280, 'td_jeans', 'HOST', {}), (281, 283, 'td_end', 'HOST', {}),
]

# caption number -> words to emphasise (coloured, with a tick)
EM = {4: ['never'], 8: ['not'], 9: ['five'], 12: ['rich?'], 15: ['100'], 23: ['nobody'], 30: ['227'], 34: ['Russia.'], 38: ['21'], 43: ['whole']}

# caption number -> sound effects [kind, when, volume]
SFX = {
    2: [['tick', 'w:jeans', 0.5], ['tick', 'w:phone', 0.5], ['tick', 'w:app', 0.5]],
    3: [['tick', 'w:movies', 0.5], ['tick', 'w:almonds', 0.5]],
    5: [['paper', 4, 0.5]],
    6: [['sparkle', 'w:gold.', 0.5]],
    7: [['scribble', 10, 0.4]],
    8: [['stamp', 'w:not', 0.7], ['clang', 'end', 0.5]],
    9: [['pops', 6, 0.4]],
    10: [['thud', 'w:poor,', 0.5]],
    11: [['thud', 'w:millionaire', 0.5]],
    12: [['ding', 'w:rich?', 0.5], ['tick', 'end', 0.5]],
    13: [['tick', 0, 0.5]],
    15: [['pops', 0, 0.4]],
    17: [['pop', 'w:kings,', 0.5], ['pop', 'w:empire,', 0.5]],
    21: [['ding', 'w:fires.', 0.4]],
    22: [['sparkle', 'w:gold?', 0.5]],
    25: [['tick', 0, 0.5]],
    28: [['boing', 'w:Nice.', 0.5]],
    30: [['ticks', 0, 0.5], ['stamp', 'w:later.', 0.7]],
    32: [['pop', 'w:claimed', 0.5], ['whoosh', 'w:left.', 0.5]],
    34: [['slam', 'w:Russia.', 0.6]],
    39: [['ding', 'w:Royal', 0.4]],
    40: [['swish', 0, 0.5]],
    41: [['swish', 0, 0.5], ['swish', 'w:San', 0.5]],
    43: [['kaching', 'w:to-do', 0.4]],
}


# ---- Mexico to Today
EM.update({60: ['Republic.'], 75: ['Gold.'], 88: ['25,000.'], 94: ['300,000'], 138: ['one'], 169: ['233'], 183: ['Hollywood.'], 201: ['747'], 236: ['lo.'], 272: ['Levi'], 280: ['still'], 283: ['shovels.']})
SFX.update({
    52: [['slide_down', 'w:changes', 0.4]], 55: [['kaching', 'w:banknotes.', 0.4]], 60: [['ding', 'w:Republic.', 0.4]], 62: [['boing', 'w:pig.', 0.5]], 63: [['ticks', 0, 0.5]],
    66: [['stamp', 'w:Extinct.', 0.7]], 70: [['paper', 'w:Nine', 0.5]], 74: [['sparkle', 'w:shines.', 0.5]], 75: [['ding', 'w:Gold.', 0.6], ['hit', 'w:Gold.', 0.4]], 78: [['stamp', 'w:338', 0.6]],
    80: [['ticks', 0, 0.5]], 82: [['pop', 'w:pick,', 0.5]], 83: [['pop', 'w:pan,', 0.5], ['pop', 'w:shovel', 0.5], ['kaching', 'end', 0.4]], 86: [['ding', 'w:Gold!', 0.5]], 88: [['pops', 0, 0.4]],
    91: [['pop', 'w:hotels.', 0.5]], 93: [['tick', 'w:China,', 0.5], ['tick', 'w:Chile,', 0.5], ['tick', 'w:Mexico,', 0.5], ['tick', 'w:Australia,', 0.5], ['tick', 'w:France,', 0.5]],
    95: [['kaching', 'w:dollar.', 0.4]], 97: [['boing', 10, 0.5]], 98: [['ding', 'w:31st', 0.5]], 116: [['ding', 'w:who', 0.4]],
    120: [['slam', 'w:Getting', 0.5]], 126: [['scribble', 'w:railroad', 0.4]], 128: [['pops', 0, 0.4]], 137: [['anvil', 'w:meet.', 0.6]], 138: [['stamp', 'w:one', 0.6]], 146: [['ding', 'w:farm.', 0.4]],
    151: [['paper', 0, 0.5]], 152: [['paper', 0, 0.5]], 156: [['kaching', 'w:one', 0.5]], 158: [['riser', 0, 0.4]], 169: [['stamp', 'w:233', 0.6]], 175: [['thud', 'w:Take', 0.5]],
    178: [['coins', 'w:rich.', 0.5]], 183: [['sparkle', 'w:Hollywood.', 0.5]],
    192: [['thud', 'w:police', 0.4]], 196: [['riser', 0, 0.4]], 198: [['drum', 0, 0.6]], 201: [['ticks', 0, 0.5]], 202: [['ding', 'w:five', 0.4]], 204: [['riser', 0, 0.3]],
    212: [['whoosh', 0, 0.4]], 213: [['pops', 0, 0.4]], 214: [['pop', 0, 0.5]],
    222: [['ding', 'w:Hewlett', 0.4]], 225: [['steps', 'w:quit', 0.5]], 228: [['ding', 'w:Intel.', 0.5]], 230: [['stamp', 'w:Silicon', 0.5]], 233: [['blip', 'w:sends', 0.6]],
    234: [['blip', 'w:login.', 0.6]], 235: [['glitch', 'w:crashed', 0.7]], 236: [['ding', 'w:lo.', 0.5]], 239: [['ding', 'w:Apple.', 0.4]], 242: [['ding', 'w:Google.', 0.4]], 244: [['sparkle', 'w:sand.', 0.5]],
    246: [['pops', 0, 0.4]], 256: [['riser', 0, 0.4]], 260: [['thud', 'w:gold.', 0.5]], 261: [['thud', 'w:land.', 0.5]], 263: [['thud', 'w:lost', 0.5]], 264: [['ding', 'w:shopkeepers.', 0.4]], 265: [['ding', 'w:land', 0.4]],
    271: [['anvil', 'w:rivets', 0.5]], 272: [['ding', 'w:Levi', 0.6], ['sparkle', 'w:Strauss.', 0.5]], 275: [['kaching', 'w:shovels.', 0.5]],
    276: [['thud', 'end', 0.4]], 277: [['thud', 'end', 0.4]], 278: [['thud', 'end', 0.4]], 280: [['sparkle', 'w:jeans', 0.5]], 283: [['kaching', 'w:shovels.', 0.5]],
})


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
    os.makedirs(os.path.join(HERE, 'beats'), exist_ok=True)
    for old in os.listdir(os.path.join(HERE, 'beats')):
        os.remove(os.path.join(HERE, 'beats', old))
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
                  open(os.path.join(HERE, 'beats', f'{i:02d}-{title.lower().replace(" ", "-")}.json'), 'w'), indent=1, ensure_ascii=False)
    print(f'{len(caps)} beats in {len(ERAS)} eras')


if __name__ == '__main__':
    main()
