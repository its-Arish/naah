// Browser bundle: Mapimator's project model + deterministic frame renderer, plus a small compiler that
// turns a resolved studio map spec (times in seconds) into a Mapimator project. Built by render_map.mjs.
import { createProject, createLayer, createView, createTransition } from '../../vendor/Mapimator/src/core/project';
import { renderProjectPngFrameRange } from '../../vendor/Mapimator/src/core/frameRenderer';
import { lonLatToWorld } from '../../vendor/Mapimator/src/core/globeMath';
import { compileTimeline } from '../../vendor/Mapimator/src/core/viewCompiler';

type LL = [number, number];
type Cam = { lon: number; lat: number; zoom: number };
type Item = { type: string; props: Record<string, any>; ll?: LL; ll2?: LL; at: number; anim?: string; dur?: number; px?: Record<string, number> };
export type Resolved = { style: string; labels: string; duration: number; fps: number; width: number; height: number; start: Cam; moves: { at: number; dur: number; to: Cam }[]; layers: Item[]; steps?: number };

const W = (lon: number, lat: number) => lonLatToWorld(lon, lat);
const camOf = (c: Cam) => { const w = W(c.lon, c.lat); return { x: 500 - w.x * c.zoom, y: 280 - w.y * c.zoom, zoom: c.zoom }; };
const smooth = (u: number) => u * u * (3 - 2 * u);
const invSmooth = (y: number) => { let a = 0, b = 1; for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (smooth(m) < y) a = m; else b = m; } return (a + b) / 2; };

/** Camera (lon, lat, zoom) at time t, following the same eased, geometric-zoom path the render uses. */
export function cameraAt(r: Resolved, t: number): Cam {
  let cur = r.start;
  for (const m of r.moves) {
    if (t < m.at) return cur;
    if (t < m.at + m.dur) {
      const u = smooth((t - m.at) / m.dur);
      return { lon: cur.lon + (m.to.lon - cur.lon) * u, lat: cur.lat + (m.to.lat - cur.lat) * u, zoom: cur.zoom * Math.pow(m.to.zoom / cur.zoom, u) };
    }
    cur = m.to;
  }
  return cur;
}

export function buildProject(r: Resolved) {
  const P = createProject('studio map');
  P.canvas = { ...P.canvas, width: r.width, height: r.height, fps: r.fps as any };
  P.mapSettings.styleId = r.style as any;
  P.mapSettings.labelLanguage = r.labels as any;
  const pxPerUnit = r.width / 1000;
  // canonical layers; sizes given in screen pixels are converted at the zoom where the layer appears
  const layers = r.layers.map((it) => {
    const z = cameraAt(r, it.at).zoom;
    const p: Record<string, any> = { ...it.props };
    for (const [k, v] of Object.entries(it.px ?? {})) p[k] = v / (z * pxPerUnit);
    if (it.ll) Object.assign(p, W(...it.ll));
    if (it.ll2) { const w = W(...it.ll2); p.x2 = w.x; p.y2 = w.y; }
    return { ...createLayer(it.type as any), ...p, visible: true };
  });
  P.layers = layers;
  // segments: hold, N eased steps per move, hold, …
  type Seg = { kind: 'view' | 'transition'; start: number; end: number; ref: any };
  const segs: Seg[] = [];
  const views: any[] = [];
  const transitions: any[] = [];
  let cursor = 0, cur = r.start;
  const N = r.steps ?? 8;
  const addView = (cam: Cam, hold: number) => {
    const v = createView('v' + views.length, [], camOf(cam), layers);
    v.holdDuration = Math.max(0, hold);
    views.push(v);
    if (v.holdDuration > 0) { segs.push({ kind: 'view', start: cursor, end: cursor + v.holdDuration, ref: v }); cursor += v.holdDuration; }
    return v;
  };
  let prev = addView(cur, (r.moves[0]?.at ?? r.duration) - 0);
  for (let mi = 0; mi < r.moves.length; mi++) {
    const m = r.moves[mi];
    for (let k = 1; k <= N; k++) {
      const u = k / N;
      const cam = { lon: cur.lon + (m.to.lon - cur.lon) * u, lat: cur.lat + (m.to.lat - cur.lat) * u, zoom: cur.zoom * Math.pow(m.to.zoom / cur.zoom, u) };
      const dur = m.dur * (invSmooth(k / N) - invSmooth((k - 1) / N));
      const hold = k < N ? 0 : (r.moves[mi + 1]?.at ?? r.duration) - (m.at + m.dur);
      const v = createView('v' + views.length, [], camOf(cam), layers);
      v.holdDuration = 0;
      const tr = createTransition(prev.id, v.id, layers);
      tr.duration = dur; tr.type = 'smooth'; tr.preset = 'linear';
      transitions.push(tr);
      segs.push({ kind: 'transition', start: cursor, end: cursor + dur, ref: tr });
      cursor += dur;
      views.push(v);
      if (hold > 0) { v.holdDuration = hold; segs.push({ kind: 'view', start: cursor, end: cursor + hold, ref: v }); cursor += hold; }
      prev = v;
    }
    cur = m.to;
  }
  // layer membership: present in every segment from its appear time on; the appear animation lives in the
  // segment where it first shows (Mapimator never replays appear for a layer that stays present)
  layers.forEach((l, i) => {
    const it = r.layers[i];
    for (const s of segs) {
      if (s.end <= it.at) continue;
      const first = it.at >= s.start && it.at < s.end;
      s.ref.layerConfigs[l.id] = first
        ? { included: true, animation: { appearEnabled: true, appearType: (it.anim ?? 'fade') as any, appearDelay: it.at - s.start, appearDuration: it.dur ?? 0.5 } }
        : { included: true };
    }
  });
  P.views = views;
  P.transitions = transitions;
  return P;
}

(window as any).StudioMap = {
  async render(r: Resolved, start: number, end: number, save: (i: number, b64: string) => Promise<void>) {
    const P = buildProject(r);
    const total = Math.ceil(compileTimeline(P).duration * r.fps);
    const last = Math.min(end, total - 1);
    await renderProjectPngFrameRange(P, start, last, async (fr: any) => {
      const buf = new Uint8Array(await fr.blob.arrayBuffer());
      let s = '';
      for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
      await save(fr.index, btoa(s));
    }, { width: r.width, height: r.height, fps: r.fps } as any);
    return { total, rendered: last - start + 1 };
  },
};
