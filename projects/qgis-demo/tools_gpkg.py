"""Convert QGIS's resources/data world_map.gpkg (+ hackfests, contributor points) into SVG paths for the demo.
Usage: python3 tools_gpkg.py <QGIS/resources/data> <out.json>"""
import sqlite3, struct, json, sys, numpy as np
src, out = sys.argv[1], sys.argv[2]
K = 1920 / 360  # px per degree (equirectangular)
def P(lon, lat): return ((lon + 180) * K, (90 - lat) * K)
def wkb_polys(b):
    if b[3] & 16: return []
    env = {0: 0, 1: 32, 2: 48, 3: 48, 4: 64}[(b[3] >> 1) & 7]
    b = b[8 + env:]; o = 0; polys = []
    def rd(fmt):
        nonlocal o; v = struct.unpack_from(fmt, b, o); o += struct.calcsize(fmt); return v
    def geom():
        nonlocal o
        bo = '<' if b[o] == 1 else '>'; o += 1
        t, = rd(bo + 'I'); t %= 1000
        if t == 3:
            n, = rd(bo + 'I'); rings = []
            for _ in range(n):
                m, = rd(bo + 'I'); a = np.frombuffer(b, dtype=bo + 'f8', count=2 * m, offset=o).reshape(-1, 2); o += 16 * m; rings.append(a)
            polys.append(rings)
        elif t == 6:
            n, = rd(bo + 'I')
            for _ in range(n): geom()
        else: raise ValueError(t)
    geom(); return polys
def dp(a, eps):
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
db = sqlite3.connect(f'{src}/world_map.gpkg')
cols = [r[1] for r in db.execute('pragma table_info(countries)')]
gcol = [c for c in cols if c.lower() in ('geom', 'geometry')][0]
namec = next(c for c in ('NAME', 'name', 'ADMIN', 'admin') if c in cols)
isoc = next((c for c in ('ISO_A3', 'iso_a3', 'ADM0_A3', 'adm0_a3') if c in cols), namec)
countries = []
for name, iso, g in db.execute(f'select {namec},{isoc},{gcol} from countries'):
    d = []
    for rings in wkb_polys(g):
        for r in rings:
            far = int(np.argmax(np.hypot(*(r - r[0]).T))); r = np.vstack([dp(r[:far + 1], 0.04)[:-1], dp(r[far:], 0.04)])
            if len(r) < 4: continue
            pts = [P(x, y) for x, y in r]
            if abs(max(p[0] for p in pts) - min(p[0] for p in pts)) * abs(max(p[1] for p in pts) - min(p[1] for p in pts)) < 2: continue
            d.append('M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in pts) + 'Z')
    if d: countries.append({'name': name, 'iso': iso, 'd': ''.join(d)})
hf = [{'n': f['properties']['hackfest_number'], 'year': f['properties']['year'], 'place': f['properties']['place'], 'p': [round(v, 1) for v in P(*f['geometry']['coordinates'])]} for f in json.load(open(f'{src}/qgis-hackfests.json'))['features']]
cf = json.load(open(f'{src}/contributors.json'))['features']
pts = [[round(v, 1) for v in P(*f['geometry']['coordinates'])] for f in cf if f.get('geometry')]
json.dump({'countries': countries, 'hackfests': hf, 'contributors': pts, 'contributorsTotal': len(cf)}, open(out, 'w'))
print(len(countries), 'countries', sum(len(c['d']) for c in countries) // 1024, 'KB paths;', len(hf), 'hackfests;', len(pts), 'located of', len(cf))
