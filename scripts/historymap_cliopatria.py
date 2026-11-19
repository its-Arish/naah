"""Add historical borders for chosen years to vendor/historymap, from Cliopatria.

Cliopatria (Seshat Global History Databank): polity borders 3400 BCE – 2024 CE,
CC BY 4.0, https://github.com/Seshat-Global-History-Databank/cliopatria
(credit: "Borders: Cliopatria, Seshat Global History Databank, CC BY 4.0").
The source file is ~170 MB, so it stays outside the repo: download and unzip
cliopatria.geojson.zip from that page, then

  python3 scripts/historymap_cliopatria.py <cliopatria_polities_only_*.geojson> 1941 [1914 1945 ...]

Writes vendor/historymap/data/historical/<year>.geojson (every polity alive in
that year, simplified) and lists them under "historical" in data/index.json so
the Map colours search finds them ("Nazi Germany · 1941"). Changes from the
source: only the chosen years are kept, and outlines are simplified (Douglas-
Peucker, 0.01°)."""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from qgis_export import simp

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'vendor/historymap/data')
EPS = 0.01


def simplify(geom):
    polys = geom['coordinates'] if geom['type'] == 'MultiPolygon' else [geom['coordinates']]
    out = []
    for rings in polys:
        keep = []
        for k, r in enumerate(rings):
            a = simp('R', np.asarray([p[:2] for p in r], dtype=float), EPS)
            if len(a) < 4:
                if k == 0: break
                continue
            ring = [[round(float(x), 4), round(float(y), 4)] for x, y in a]
            if ring[0] != ring[-1]: ring.append(ring[0])
            keep.append(ring)
        if keep: out.append(keep)
    return {'type': 'MultiPolygon', 'coordinates': out} if out else None


def main():
    if len(sys.argv) < 3: sys.exit(__doc__)
    src, years = sys.argv[1], [int(y) for y in sys.argv[2:]]
    feats = json.load(open(src))['features']
    idx_path = os.path.join(DATA, 'index.json')
    index = json.load(open(idx_path))
    hist = [h for h in index.get('historical', []) if h['year'] not in years]
    os.makedirs(os.path.join(DATA, 'historical'), exist_ok=True)
    for year in years:
        out = []
        for f in feats:
            p = f['properties']
            if not (p['FromYear'] <= year <= p['ToYear']) or not f.get('geometry'): continue
            geom = simplify(f['geometry'])
            if not geom: continue
            hid = f'{year}:{p["Name"]}'
            out.append({'type': 'Feature', 'id': hid, 'properties': {'id': hid, 'name': p['Name'], 'year': year, 'wikipedia': p.get('Wikipedia') or ''}, 'geometry': geom})
            hist.append({'id': hid, 'name': p['Name'], 'year': year})
        path = os.path.join(DATA, 'historical', f'{year}.geojson')
        with open(path, 'w') as fh: json.dump({'type': 'FeatureCollection', 'features': out}, fh, separators=(',', ':'), ensure_ascii=False)
        print(f'{year}: {len(out)} polities → {os.path.relpath(path, ROOT)} ({os.path.getsize(path) // 1024} KB)')
    index['historical'] = sorted(hist, key=lambda h: (h['year'], h['name']))
    index['historicalSource'] = 'Cliopatria, Seshat Global History Databank (CC BY 4.0); simplified, chosen years only'
    with open(idx_path, 'w') as fh: json.dump(index, fh, separators=(',', ':'), ensure_ascii=False)


if __name__ == '__main__': main()
