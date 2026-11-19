"""America film → History Map shot projects.

  python3 projects/america/tools/make_historymap_shots.py <america-map-shots.csv> [first_n_beats]

Reads the map-shot list (one row per map part; the map_call column is the QGIS
`m(label, {...})` call from the film's src/B1-B3.tsx) and writes, per on-screen
segment, a History Map project file (GeoJSON with a `historymap` member and a
scripted `shot`) to projects/america/historymap/<beat>_<k>.geojson, plus
manifest.json describing every segment for the recorder and the compositor.

Segmenting (measured on america-share.mp4): every beat is cut into
max(parts, ceil(seconds / 2.4)) equal segments that cycle through its map parts
in order, each restarting its camera move and label (c024: 2 × 41 f, c034: 2 × 56 f,
c035: 3 × 62 f; c088 at 2.33 s stays whole, c096 at 2.63 s splits).
"""
import csv, json, math, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
OUT = os.path.join(PROJ, 'historymap')
ROOT = os.path.dirname(os.path.dirname(PROJ))
FPS = 30

# ---- constants the film's src/*.tsx defined (rebuilt; the source is not in the repo)
JAM = [-76.78, 37.21]                                    # Jamestown 37.2N 76.8W
MISS = [[-95.2, 47.2], [-93.26, 44.98], [-90.2, 38.6], [-90.05, 35.15], [-90.07, 29.95]]   # Lake Itasca → New Orleans (as in c542)
DANUBE = [[8.5, 47.95], [9.99, 48.4], [12.1, 49.02], [13.46, 48.57], [16.37, 48.21], [17.1, 48.14], [19.04, 47.5],
          [18.93, 45.9], [19.85, 45.25], [20.46, 44.82], [22.5, 44.6], [22.88, 43.99], [25.95, 43.85], [27.26, 44.12],
          [28.05, 45.43], [29.65, 45.16]]                 # Donaueschingen → Sulina, through the river's main cities
CONST = {
    'JAM': JAM, 'MISS': MISS, 'DANUBE': DANUBE,
    'STATES13': ['New Hampshire', 'Massachusetts', 'Rhode Island', 'Connecticut', 'New York', 'New Jersey', 'Pennsylvania',
                 'Delaware', 'Maryland', 'Virginia', 'North Carolina', 'South Carolina', 'Georgia'],
    'EAST1783': ['Maine', 'New Hampshire', 'Vermont', 'Massachusetts', 'Rhode Island', 'Connecticut', 'New York', 'New Jersey',
                 'Pennsylvania', 'Delaware', 'Maryland', 'Virginia', 'West Virginia', 'North Carolina', 'South Carolina',
                 'Georgia', 'Kentucky', 'Tennessee', 'Ohio', 'Indiana', 'Illinois', 'Michigan', 'Wisconsin', 'Alabama', 'Mississippi'],
    'LOUIS': ['Louisiana', 'Arkansas', 'Missouri', 'Iowa', 'Minnesota', 'North Dakota', 'South Dakota', 'Nebraska', 'Kansas',
              'Oklahoma', 'Montana', 'Wyoming', 'Colorado'],
    'SOUTH': ['Delaware', 'Maryland', 'Virginia', 'North Carolina', 'South Carolina', 'Georgia', 'Florida', 'Alabama',
              'Mississippi', 'Louisiana', 'Texas', 'Arkansas', 'Tennessee', 'Kentucky', 'Missouri'],
    'SOUTH7': ['South Carolina', 'Mississippi', 'Florida', 'Alabama', 'Georgia', 'Louisiana', 'Texas'],
    'USSR': ['RUS', 'UKR', 'BLR', 'UZB', 'KAZ', 'GEO', 'AZE', 'LTU', 'MDA', 'LVA', 'KGZ', 'TJK', 'ARM', 'TKM', 'EST'],
    'NATO12': ['USA', 'CAN', 'GBR', 'FRA', 'BEL', 'NLD', 'LUX', 'NOR', 'DNK', 'ISL', 'PRT', 'ITA'],
    'BRIT': ['GBR', 'CAN', 'AUS', 'NZL', 'IND', 'PAK', 'BGD', 'MMR', 'ZAF', 'EGY', 'SDN', 'SSD', 'KEN', 'UGA', 'TZA', 'NGA', 'GHA', 'ZMB', 'ZWE', 'BWA', 'MWI', 'MYS', 'IRQ', 'JOR', 'ISR', 'PSE', 'SLE', 'GMB', 'GUY', 'BLZ', 'NAM', 'LKA', 'SOM', 'YEM', 'IRL'],
    'MONGOL': ['MNG', 'CHN', 'KAZ', 'UZB', 'TKM', 'KGZ', 'TJK', 'AFG', 'IRN', 'IRQ', 'KOR', 'PRK', 'GEO', 'ARM', 'AZE', 'UKR', 'RUS'],
    'ALLIES': ['CAN', 'GBR', 'FRA', 'DEU', 'JPN', 'KOR', 'AUS', 'ITA', 'ESP', 'NLD', 'NOR', 'POL'],
    'MARSHALL16': ['AUT', 'BEL', 'DNK', 'FRA', 'GRC', 'ISL', 'IRL', 'ITA', 'LUX', 'NLD', 'NOR', 'PRT', 'SWE', 'CHE', 'TUR', 'GBR'],
}
DEFAULT_FILL = '#F3B562'   # the film's amber (c175: "every acre I just showed you in amber")
ROUTE_RED = '#C8312B'      # QGIS kit QC.red
RIVERS = {'MISS', 'DANUBE'}


def parse_call(call):
    """m('LABEL', { ... }) → (label, dict, names of route constants used)."""
    m = re.match(r"\s*m\('((?:[^'\\]|\\.)*)',\s*(\{.*\})\s*\)\s*$", call, re.S)
    if not m: raise ValueError('unparsed map_call: ' + call)
    label = m.group(1).replace("\\'", "'")
    body = m.group(2)
    route_const = re.search(r'route:\s*([A-Z][A-Z0-9]+)\b', body)
    body = re.sub(r'GOLDc\(\)', '"#C9932E"', body)
    body = re.sub(r'\.\.\.([A-Z][A-Z0-9]+)', lambda k: json.dumps(CONST[k.group(1)])[1:-1], body)   # spreads
    body = re.sub(r'\b([A-Z][A-Z0-9]+)\b(?!\')', lambda k: json.dumps(CONST[k.group(1)]) if k.group(1) in CONST else k.group(0), body)
    body = re.sub(r"'((?:[^'\\]|\\.)*)'", lambda k: json.dumps(k.group(1)), body)
    body = re.sub(r'([{,]\s*)([a-z][a-z0-9]*)\s*:', r'\1"\2":', body)
    body = re.sub(r',\s*([}\]])', r'\1', body)
    return label, json.loads(body), route_const.group(1) if route_const else None


def main():
    src = sys.argv[1]
    first_n = int(sys.argv[2]) if len(sys.argv) > 2 else None
    rows = list(csv.reader(open(src, newline='')))[1:]
    beats = []
    for r in rows:
        bid = r[0]
        if not beats or beats[-1]['id'] != bid:
            beats.append({'id': bid, 'cue': int(r[1]), 'start_frame': int(r[4]), 'frames': int(r[6]), 'caption': r[8], 'parts': []})
        beats[-1]['parts'].append(r[9])
    if first_n: beats = beats[:first_n]

    idx = json.load(open(os.path.join(ROOT, 'vendor/historymap/data/index.json')))
    countries = {c['id']: c['name'] for c in idx['countries']}
    states = {p['name']: p['id'] for p in idx['provinces'] if p['adm0'] == 'USA'}
    os.makedirs(OUT, exist_ok=True)
    manifest = []
    for b in beats:
        parts = [parse_call(p) for p in b['parts']]
        nseg = max(len(parts), math.ceil(b['frames'] / FPS / 2.4 - 1e-9))
        cuts = [round(k * b['frames'] / nseg) for k in range(nseg + 1)]
        for k in range(nseg):
            label, o, route_const = parts[k % len(parts)]
            frames = cuts[k + 1] - cuts[k]
            dur_ms = frames / FPS * 1000
            regions = []
            def add_countries(codes, color, late=False):
                for c in codes:
                    if c not in countries: raise ValueError(f'{b["id"]}: unknown country {c}')
                    regions.append({'id': c, 'kind': 'country', 'name': countries[c], 'color': color, **({'late': True} if late else {})})
            add_countries(o.get('hot', []), o.get('hc', DEFAULT_FILL))
            add_countries(o.get('hot2', []), o.get('hc2', DEFAULT_FILL), late=True)
            st = o.get('states', [])
            if st == ['*']: st = [n for n in states if n != 'District of Columbia']
            for n in st:
                if n not in states: raise ValueError(f'{b["id"]}: unknown state {n}')
                regions.append({'id': states[n], 'kind': 'province', 'name': n, 'color': o.get('sc', DEFAULT_FILL)})
            arrows = []
            if o.get('route'):
                river = route_const in RIVERS or (b['id'] == 'c542')
                arrows.append({'path': o['route'], 'from': o['route'][0], 'to': o['route'][-1], 'color': o.get('rc', '#2F6EA8' if river else ROUTE_RED),
                               'label': '', 'head': 'dot' if river else 'arrow'})
            pins = o.get('pins', [])
            c = o['c']; to = o.get('to', c)
            draw_ms = (o.get('len', 40)) / FPS * 1000
            shot = {'durMs': round(dur_ms, 3), 'from': {'center': c, 'qz': o['z']}, 'to': {'center': to, 'qz': o.get('z2', o['z'])},
                    'space': False, 'drawStartMs': 270, 'drawEndMs': 270 + draw_ms, 'lateAtMs': round(dur_ms * 0.45)}
            seg_id = f'{b["id"]}_{k}'
            manifest.append({'seg': seg_id, 'beat': b['id'], 'k': k, 'cue': b['cue'], 'beat_start_frame': b['start_frame'],
                             'beat_frames': b['frames'], 'offset': cuts[k], 'frames': frames, 'label': label, 'caption': b['caption'],
                             'c': c, 'to': to, 'qz': [o['z'], o.get('z2', o['z'])], 'pins': pins,
                             'route_end': o['route'][-1] if o.get('route') else None, 'shot': shot,
                             'regions': [r['id'] for r in regions], 'file': f'historymap/{seg_id}.geojson'})
            fc = {'type': 'FeatureCollection', 'name': f'America {seg_id}: {label}',
                  'historymap': {'version': 1,
                                 'settings': {'style': 'satellite', 'aspect': '16:9', 'accent': '#C8312B', 'globe': False, 'pitch': False,
                                              'labels': False, 'pace': 1, 'title': '', 'subtitle': '', 'watermark': '', 'format': 'mp4',
                                              'quality': 2, 'fillOpacity': 0.55, 'borders': True, 'fromSpace': False, 'zoomHop': False},
                                 'regions': regions, 'arrows': arrows, 'shot': shot},
                  'features': [{'type': 'Feature', 'properties': {'name': f'pin {i + 1}'}, 'geometry': {'type': 'Point', 'coordinates': p}} for i, p in enumerate(pins)]}
            json.dump(fc, open(os.path.join(OUT, f'{seg_id}.geojson'), 'w'), indent=1)
    # "start from space" only on the first map of a section; sections are marked in sections.json (beat ids)
    sec_path = os.path.join(PROJ, 'sections.json')
    firsts = set(json.load(open(sec_path))) if os.path.exists(sec_path) else set()
    for m in manifest:
        if m['beat'] in firsts and m['k'] == 0:
            m['shot']['space'] = True; m['shot']['spaceFrac'] = 0.6
            p = os.path.join(PROJ, m['file']); fc = json.load(open(p)); fc['historymap']['shot'] = m['shot']; json.dump(fc, open(p, 'w'), indent=1)
    json.dump(manifest, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
    print(f'{len(beats)} beats → {len(manifest)} segments in {os.path.relpath(OUT, ROOT)}; space intro on: {sorted(firsts & {m["beat"] for m in manifest})}')


if __name__ == '__main__': main()
