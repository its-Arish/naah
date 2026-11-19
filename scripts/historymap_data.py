"""Build the boundary data for vendor/historymap from assets/qgis/world_map.gpkg (Natural Earth 1:10m).

  python3 scripts/historymap_data.py            # → vendor/historymap/data/

Writes lon/lat GeoJSON the MapLibre map can fill:
  data/index.json               every country and province name/id, for the sidebar search
  data/countries.geojson        all countries (id = ISO_A3, or C<fid> when the code is missing)
  data/provinces/<ADM0>.geojson the states/provinces of one country (id = <ADM0>:<fid>), loaded on demand
Polygons keep their holes (Lesotho stays out of South Africa). Uses qgis_export.py's Douglas-Peucker simplifier; numpy only."""
import os, sys, json, sqlite3, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import struct
import numpy as np
from qgis_export import simp

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GPKG = os.path.join(ROOT, 'assets/qgis/world_map.gpkg')
OUT = os.path.join(ROOT, 'vendor/historymap/data')


def polygons(b):
    """Decode a GeoPackage (Multi)Polygon blob → list of polygons, each a list of lon/lat rings (outer first, then holes)."""
    if b is None or b[3] & 16: return []
    env = {0: 0, 1: 32, 2: 48, 3: 48, 4: 64}[(b[3] >> 1) & 7]; b = b[8 + env:]; o = 0; out = []
    def rd(fmt):
        nonlocal o; v = struct.unpack_from(fmt, b, o); o += struct.calcsize(fmt); return v
    def geom():
        nonlocal o
        bo = '<' if b[o] == 1 else '>'; o += 1; t, = rd(bo + 'I'); t %= 1000
        if t == 3:
            rings = []
            n, = rd(bo + 'I')
            for _ in range(n):
                m, = rd(bo + 'I'); rings.append(np.frombuffer(b, dtype=bo + 'f8', count=2 * m, offset=o).reshape(-1, 2)); o += 16 * m
            out.append(rings)
        elif t == 6:
            n, = rd(bo + 'I')
            for _ in range(n): geom()
        else: raise ValueError(f'geometry type {t} not handled')
    geom(); return out


def geometry(blob, eps):
    polys = []
    for rings in polygons(blob):
        keep = []
        for k, r in enumerate(rings):
            r = simp('R', r, eps)
            if len(r) < 4:
                if k == 0: break  # outer ring vanished: drop the whole polygon
                continue
            ring = [[round(float(x), 4), round(float(y), 4)] for x, y in r]
            if ring[0] != ring[-1]: ring.append(ring[0])
            keep.append(ring)
        if keep: polys.append(keep)
    if not polys: return None
    return {'type': 'MultiPolygon', 'coordinates': polys}


def write(path, feats):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f: json.dump({'type': 'FeatureCollection', 'features': feats}, f, separators=(',', ':'))


def main():
    db = sqlite3.connect(GPKG)
    index = {'source': 'Natural Earth 1:10m via QGIS world_map.gpkg (public domain)', 'countries': [], 'provinces': []}
    feats = []
    for fid, name, iso, g in db.execute('select fid, NAME, ISO_A3, geom from countries'):
        if not name: continue
        cid = iso if iso and iso != '-99' else f'C{fid}'
        geom = geometry(g, 0.01)
        if not geom: continue
        feats.append({'type': 'Feature', 'id': cid, 'properties': {'id': cid, 'name': name}, 'geometry': geom})
        index['countries'].append({'id': cid, 'name': name})
    write(os.path.join(OUT, 'countries.geojson'), feats)

    by = collections.defaultdict(list)
    for fid, name, adm0, admin, g in db.execute('select fid, name, adm0_a3, admin, geom from states_provinces'):
        if not name or not adm0: continue
        pid = f'{adm0}:{fid}'
        geom = geometry(g, 0.004)
        if not geom: continue
        by[adm0].append({'type': 'Feature', 'id': pid, 'properties': {'id': pid, 'name': name, 'adm0': adm0}, 'geometry': geom})
        index['provinces'].append({'id': pid, 'name': name, 'adm0': adm0, 'country': admin or adm0})
    for adm0, fs in by.items(): write(os.path.join(OUT, 'provinces', f'{adm0}.geojson'), fs)

    index['countries'].sort(key=lambda c: c['name']); index['provinces'].sort(key=lambda p: (p['country'], p['name']))
    try:  # keep the historical years added by historymap_cliopatria.py
        old = json.load(open(os.path.join(OUT, 'index.json')))
        for k in ('historical', 'historicalSource'):
            if k in old: index[k] = old[k]
    except (OSError, ValueError): pass
    with open(os.path.join(OUT, 'index.json'), 'w') as f: json.dump(index, f, separators=(',', ':'), ensure_ascii=False)
    size = lambda p: os.path.getsize(os.path.join(OUT, p)) // 1024
    print(f"{len(index['countries'])} countries ({size('countries.geojson')} KB), {len(index['provinces'])} provinces in {len(by)} files, index {size('index.json')} KB → {OUT}")


if __name__ == '__main__': main()
