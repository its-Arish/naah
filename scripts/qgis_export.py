"""Export QGIS world-map layers (assets/qgis/world_map.gpkg) to JSON for engine/qgis/QgisMap.tsx.

  python3 scripts/qgis_export.py projects/<slug>/src/qgis.json \
      [--provinces AUS,IND]            # states/provinces of these ISO3 countries (traceable, with label points)
      [--disputed]                     # disputed-border lines
      [--points name=path.geojson ...] # point layers (GeoJSON FeatureCollection of Points), kept with their properties
      [--globe]                        # coarse lon/lat rings for the orthographic globe
      [--gpkg path]                    # another GeoPackage with the same layer names

Coordinates are projected equirectangular to "world pixels": x = (lon+180)*1920/360, y = (90-lat)*1920/360
(the whole world is 1920 x 960). The engine camera zooms/pans in these units.
Only numpy is needed (no GDAL/shapely): GeoPackage geometry blobs are decoded directly."""
import sqlite3, struct, json, sys, argparse, collections, os
import numpy as np

K = 1920 / 360
def P(lon, lat): return ((lon + 180) * K, (90 - lat) * K)

def parts(b):
    """Decode a GeoPackage geometry blob → list of ('R', ring) / ('L', line) numpy arrays of lon/lat."""
    if b is None or b[3] & 16: return []  # empty geometry flag
    env = {0: 0, 1: 32, 2: 48, 3: 48, 4: 64}[(b[3] >> 1) & 7]; b = b[8 + env:]; o = 0; res = []
    def rd(fmt):
        nonlocal o; v = struct.unpack_from(fmt, b, o); o += struct.calcsize(fmt); return v
    def pts(bo):
        nonlocal o; m, = rd(bo + 'I'); a = np.frombuffer(b, dtype=bo + 'f8', count=2 * m, offset=o).reshape(-1, 2); o += 16 * m; return a
    def geom():
        nonlocal o
        bo = '<' if b[o] == 1 else '>'; o += 1; t, = rd(bo + 'I'); t %= 1000
        if t == 2: res.append(('L', pts(bo)))
        elif t == 3:
            n, = rd(bo + 'I')
            for _ in range(n): res.append(('R', pts(bo)))
        elif t in (5, 6):
            n, = rd(bo + 'I')
            for _ in range(n): geom()
        else: raise ValueError(f'geometry type {t} not handled')
    geom(); return res

def dp(a, eps):
    """Douglas-Peucker simplification (degrees)."""
    if len(a) < 4: return a
    keep = np.zeros(len(a), bool); keep[0] = keep[-1] = True; st = [(0, len(a) - 1)]
    while st:
        i, j = st.pop(); p, q = a[i], a[j]; seg = a[i + 1:j]
        if not len(seg): continue
        d = q - p; L = np.hypot(*d) or 1e-9
        dist = np.abs(d[0] * (seg[:, 1] - p[1]) - d[1] * (seg[:, 0] - p[0])) / L
        k = int(np.argmax(dist))
        if dist[k] > eps: keep[i + 1 + k] = True; st += [(i, i + 1 + k), (i + 1 + k, j)]
    return a[keep]

def simp(kind, r, eps):
    if kind == 'L': return dp(r, eps)
    far = int(np.argmax(np.hypot(*(r - r[0]).T)))  # closed ring: split at the farthest point first
    return np.vstack([dp(r[:far + 1], eps)[:-1], dp(r[far:], eps)])

def svg(g, eps, minarea=2):
    d = []
    for kind, r in parts(g):
        r = simp(kind, r, eps)
        if len(r) < (2 if kind == 'L' else 4): continue
        p = [P(x, y) for x, y in r]
        if kind == 'R' and (max(q[0] for q in p) - min(q[0] for q in p)) * (max(q[1] for q in p) - min(q[1] for q in p)) < minarea: continue
        d.append('M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in p) + ('Z' if kind == 'R' else ''))
    return ''.join(d)

def label_point(g):
    rings = [r for k, r in parts(g) if k == 'R']
    if not rings: return None
    big = max(rings, key=lambda r: np.ptp(r[:, 0]) * np.ptp(r[:, 1]))
    return [round(v, 1) for v in P(float(np.mean(big[:, 0])), float(np.mean(big[:, 1])))]

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ap = argparse.ArgumentParser()
    ap.add_argument('out'); ap.add_argument('--gpkg', default=os.path.join(root, 'assets/qgis/world_map.gpkg'))
    ap.add_argument('--provinces', default=''); ap.add_argument('--disputed', action='store_true'); ap.add_argument('--globe', action='store_true')
    ap.add_argument('--points', nargs='*', default=[]); ap.add_argument('--eps', type=float, default=0.04)
    a = ap.parse_args()
    db = sqlite3.connect(a.gpkg)
    nprov = collections.Counter(x for (x,) in db.execute('select adm0_a3 from states_provinces'))
    countries = []
    for name, iso, g in db.execute('select NAME, ISO_A3, geom from countries'):
        d = svg(g, a.eps)
        if not d: continue
        c = {'name': name, 'iso': iso, 'd': d, 'nProv': nprov.get(iso, 0), 'c': label_point(g)}
        if a.globe:
            c['rings'] = [[[round(x, 1), round(y, 1)] for x, y in rr] for k, r in parts(g) if k == 'R'
                          for rr in [simp(k, r, 0.35)] if len(rr) >= 4 and np.ptp(rr[:, 0]) * np.ptp(rr[:, 1]) > 1.5]
        countries.append(c)
    out = {'countries': countries, 'provinces': {}, 'disputed': [], 'points': {}}
    for iso in [x for x in a.provinces.split(',') if x]:
        out['provinces'][iso] = [{'name': n, 'd': d, 'c': label_point(g)} for n, g in db.execute('select name, geom from states_provinces where adm0_a3=?', (iso,)) for d in [svg(g, 0.015, 0.5)] if d]
    if a.disputed:
        out['disputed'] = [{'name': n, 'left': l, 'd': svg(g, 0.01)} for n, l, g in db.execute('select name, adm0_left, geom from disputed_borders')]
    for spec in a.points:
        name, path = spec.split('=', 1)
        fs = json.load(open(path))['features']
        out['points'][name] = [{'p': [round(v, 1) for v in P(*f['geometry']['coordinates'][:2])], 'll': f['geometry']['coordinates'][:2], **{k: v for k, v in f['properties'].items() if isinstance(v, (int, float, str)) and k not in ('avatar_url',)}}
                               for f in fs if f.get('geometry') and f['geometry']['type'] == 'Point']
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    json.dump(out, open(a.out, 'w'))
    print(f"{len(countries)} countries, provinces {{{', '.join(f'{k}: {len(v)}' for k, v in out['provinces'].items())}}}, {len(out['disputed'])} disputed lines, points {{{', '.join(f'{k}: {len(v)}' for k, v in out['points'].items())}}} → {a.out} ({os.path.getsize(a.out) // 1024} KB)")

if __name__ == '__main__': main()
