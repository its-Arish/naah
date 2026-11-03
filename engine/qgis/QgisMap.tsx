/**
 * QGIS map kit: map styles drawn from QGIS's world map data (assets/qgis/world_map.gpkg).
 * Export a film's data with `python3 scripts/qgis_export.py projects/<slug>/src/qgis.json [...]`, import it,
 * and draw with these components. Everything is in "world pixels" (whole world = 1920 x 960, see P()).
 *
 * Styles: Choropleth · ProvinceTrace · DisputedLines · Globe · FlowLines (+ MapPin, MapTag, camera helpers).
 */
import React from 'react';
import { useCurrentFrame, interpolate, Easing, springPop } from '../lib/core';
import { gravityDrop } from '../lib/physics';
import { OL } from '../scenes/Parts';

// ------------------------------------------------------------------ data types
export type QCountry = { name: string; iso: string; d: string; nProv: number; c: [number, number] | null; rings?: number[][][] };
export type QProvince = { name: string; d: string; c: [number, number] | null };
export type QLine = { name: string; left: string; d: string };
export type QPoint = { p: [number, number]; ll: [number, number]; [k: string]: unknown };
export type QData = { countries: QCountry[]; provinces: Record<string, QProvince[]>; disputed: QLine[]; points: Record<string, QPoint[]> };

// ------------------------------------------------------------------ projection + camera
export const K = 1920 / 360;
/** lon/lat → world pixels (equirectangular, same as the exporter). */
export const P = (lon: number, lat: number): [number, number] => [(lon + 180) * K, (90 - lat) * K];
export type Cam = { x: number; y: number; z: number };
export const camAt = (lon: number, lat: number, z: number): Cam => { const [x, y] = P(lon, lat); return { x, y, z }; };
export const WORLD_CAM: Cam = { x: 960, y: 420, z: 1.05 };
/** Blend two cameras; zoom is blended in log space so pushes feel even. */
export const mixCam = (a: Cam, b: Cam, t: number): Cam => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * t) });
export const moveCam = (f: number, a: Cam, b: Cam, t0 = 0, t1 = 40) => mixCam(a, b, interpolate(f, [t0, t1], [0, 1], Easing.inOut));
/** World pixel → screen pixel under a camera (for HTML/SVG labels drawn outside the map group). */
export const toScreen = (c: Cam, x: number, y: number) => ({ x: 960 + (x - c.x) * c.z, y: 540 + (y - c.y) * c.z });

// ------------------------------------------------------------------ palette
export const QC = { ink: '#1A1410', sea: '#9EC5DB', land: '#F1E6CC', paper: '#F4ECD8', dark: '#1E2A33', red: '#C8312B', orange: '#E06A3B' };
export const RAMP_HEAT = ['#FFF3C4', '#FBD38D', '#F6A04D', '#E4632F', '#B3261E'];
export const RAMP_COOL = ['#E8F1F8', '#B9D5EA', '#7FAFD6', '#4682B4', '#1F4E79'];
export const SHADES = ['#F6C88D', '#9CC9A0', '#E9A6A0', '#A9C4E8', '#E8D58A', '#C7B3E0', '#9FD6CF', '#F2B8D0', '#D9C3A0'];

// ------------------------------------------------------------------ base
export const Full: React.FC<{ children?: React.ReactNode; bg?: string }> = ({ children, bg }) => (
  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>{bg && <rect width={1920} height={1080} fill={bg} />}{children}</svg>
);

/** The world map under a camera. `fill(c)` colours each country; children are drawn in world pixels on top. */
export const WorldMap: React.FC<{ data: QData; cam: Cam; fill?: (c: QCountry, i: number) => string; stroke?: string; sea?: string; grid?: boolean; sw?: number; children?: React.ReactNode }> = ({ data, cam, fill, stroke = OL, sea = QC.sea, grid = true, sw = 1.4, children }) => (
  <Full bg={sea}>
    <g transform={`translate(960 540) scale(${cam.z}) translate(${-cam.x} ${-cam.y})`}>
      {grid && [...Array(37)].map((_, i) => <line key={'v' + i} x1={i * K * 10} y1={0} x2={i * K * 10} y2={960} stroke="#fff" strokeOpacity={0.18} vectorEffect="non-scaling-stroke" />)}
      {grid && [...Array(19)].map((_, i) => <line key={'h' + i} x1={0} y1={i * K * 10} x2={1920} y2={i * K * 10} stroke="#fff" strokeOpacity={0.18} vectorEffect="non-scaling-stroke" />)}
      {data.countries.map((c, i) => <path key={i} d={c.d} fill={fill ? fill(c, i) : QC.land} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />)}
      {children}
    </g>
  </Full>
);

/** Dark rounded label (screen pixels). */
export const MapTag: React.FC<{ x: number; y: number; text: string; k: number; size?: number; bg?: string; c?: string; anchor?: 'start' | 'middle' }> = ({ x, y, text, k, size = 36, bg = QC.dark, c = '#fff', anchor = 'middle' }) => {
  if (k <= 0) return null;
  const w = text.length * size * 0.56 + 40;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x={anchor === 'middle' ? -w / 2 : 0} y={-size * 0.9} width={w} height={size * 1.6} rx={10} fill={bg} stroke={QC.ink} strokeWidth={3} />
      <text x={anchor === 'middle' ? 0 : 20} y={size * 0.33} textAnchor={anchor} fontFamily="TagBold" fontSize={size} fill={c}>{text}</text>
    </g>
  );
};

/** Pin that drops in with gravity at frame `at`; constant on-screen size at any zoom. Draw inside WorldMap. */
export const MapPin: React.FC<{ x: number; y: number; at: number; z: number; c?: string; r?: number }> = ({ x, y, at, z, c = QC.red, r = 1 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const d = gravityDrop(f, at, { h: 90, g: 2.4, e: 0.3 });
  return (
    <g transform={`translate(${x} ${y}) scale(${r / z}) translate(0 ${d.y}) scale(${d.sx} ${d.sy})`}>
      <path d="M0 0 C-6 -14 -18 -22 -18 -36 A18 18 0 1 1 18 -36 C18 -22 6 -14 0 0Z" fill={c} stroke={QC.ink} strokeWidth={3} />
      <circle cy={-36} r={7} fill="#fff" />
    </g>
  );
};

// ------------------------------------------------------------------ STYLE: choropleth
const firstX = (d: string) => parseFloat(d.slice(1));
/**
 * Countries shaded by a value. `value(c)` returns a number or null (no data → plain land).
 * The colour sweeps west→east from frame `sweepAt` over `sweepLen`. Pair with <ChoroLegend>.
 */
export const Choropleth: React.FC<{ data: QData; cam: Cam; value: (c: QCountry) => number | null | undefined; bins: number[]; ramp?: string[]; sweepAt?: number; sweepLen?: number; children?: React.ReactNode }> = ({ data, cam, value, bins, ramp = RAMP_HEAT, sweepAt = 16, sweepLen = 60, children }) => {
  const f = useCurrentFrame();
  const sweep = interpolate(f, [sweepAt, sweepAt + sweepLen], [-50, 1990]);
  const bin = (n: number) => bins.reduce((a, b, i) => (n >= b ? i : a), 0);
  return <WorldMap data={data} cam={cam} fill={(c) => { const v = value(c); return v == null || firstX(c.d) >= sweep ? QC.land : ramp[Math.min(ramp.length - 1, bin(v))]; }}>{children}</WorldMap>;
};
export const ChoroLegend: React.FC<{ title: string; bins: number[]; ramp?: string[]; at: number; x?: number; y?: number; fmt?: (lo: number, hi?: number) => string }> = ({ title, bins, ramp = RAMP_HEAT, at, x = 60, y = 560, fmt = (lo, hi) => (hi == null ? `${lo}+` : `${lo}–${hi - 1}`) }) => {
  const f = useCurrentFrame();
  const h = 70 + bins.length * 36;
  return (
    <g transform={`translate(${x} ${y}) scale(${springPop(f, at)})`}>
      <rect width={290} height={h} rx={12} fill={QC.paper} stroke={QC.ink} strokeWidth={3} />
      <text x={20} y={40} fontFamily="TagBold" fontSize={24} fill={QC.ink}>{title}</text>
      {bins.map((b, i) => <g key={i} transform={`translate(20 ${62 + i * 36})`}><rect width={40} height={26} fill={ramp[i]} stroke={QC.ink} strokeWidth={2} /><text x={54} y={21} fontFamily="TagBold" fontSize={22} fill={QC.ink}>{fmt(b, bins[i + 1])}</text></g>)}
    </g>
  );
};

// ------------------------------------------------------------------ STYLE: provinces traced in
/** Draw inside WorldMap: each province's outline traces on, then fills. Province i starts at start + i*stagger. */
export const ProvinceTrace: React.FC<{ provinces: QProvince[]; cam: Cam; start?: number; stagger?: number; colors?: string[]; highlight?: string[] }> = ({ provinces, cam, start = 40, stagger = 9, colors = SHADES, highlight }) => {
  const f = useCurrentFrame();
  return (<>{provinces.map((a, i) => {
    const t0 = start + i * stagger, tracing = f < t0 + 20;
    if (f < t0) return null;
    const dim = highlight && !highlight.includes(a.name);
    return <path key={a.name} d={a.d} pathLength={1} fill={dim ? '#EDE6D6' : colors[i % colors.length]} fillOpacity={interpolate(f, [t0 + 14, t0 + 24], [0, 1])}
      stroke={QC.ink} strokeWidth={2.4 / cam.z} strokeDasharray={tracing ? '1 1' : undefined} strokeDashoffset={tracing ? interpolate(f, [t0, t0 + 20], [1, 0]) : undefined} />;
  })}</>);
};
/** Screen-space labels for provinces (skips tiny ones). */
export const ProvinceLabels: React.FC<{ provinces: QProvince[]; cam: Cam; at: number; minSize?: number; size?: number }> = ({ provinces, cam, at, minSize = 400, size = 26 }) => {
  const f = useCurrentFrame();
  return (<>{provinces.filter((a) => a.c && a.d.length > minSize).map((a, i) => { const q = toScreen(cam, a.c![0], a.c![1]); return <MapTag key={a.name} x={q.x} y={q.y} text={a.name} k={springPop(f, at + i * 4) * 0.75} size={size} />; })}</>);
};

// ------------------------------------------------------------------ STYLE: disputed borders
/** Draw inside WorldMap: dashed claim lines, one colour per claim, each claim appearing at its own frame. */
export const DisputedLines: React.FC<{ lines: QLine[]; claims: Record<string, { color: string; at: number }>; width?: number }> = ({ lines, claims, width = 6 }) => {
  const f = useCurrentFrame();
  return (<>{lines.map((x, i) => { const c = claims[x.name]; if (!c || f < c.at) return null; return <path key={i} d={x.d} fill="none" stroke={c.color} strokeWidth={width} strokeDasharray="14 9" opacity={interpolate(f, [c.at, c.at + 10], [0, 1])} vectorEffect="non-scaling-stroke" strokeLinecap="round" />; })}</>);
};
export const LineLegend: React.FC<{ items: { label: string; color: string; at: number }[]; x?: number; y?: number; at: number }> = ({ items, x = 1500, y = 560, at }) => {
  const f = useCurrentFrame();
  const w = Math.max(...items.map((i) => i.label.length)) * 15 + 110;
  return (
    <g transform={`translate(${x} ${y}) scale(${springPop(f, at)})`}>
      <rect width={w} height={40 + items.length * 52} rx={12} fill={QC.paper} stroke={QC.ink} strokeWidth={3} />
      {items.map((it, i) => <g key={it.label} transform={`translate(22 ${48 + i * 52})`} opacity={f >= it.at ? 1 : 0.25}><line x1={0} y1={-8} x2={56} y2={-8} stroke={it.color} strokeWidth={7} strokeDasharray="14 8" /><text x={72} y={0} fontFamily="TagBold" fontSize={26} fill={QC.ink}>{it.label}</text></g>)}
    </g>
  );
};

// ------------------------------------------------------------------ STYLE: globe (orthographic)
const RAD = Math.PI / 180;
/** Needs data exported with --globe. lam0/phi0 = centre lon/lat (animate lam0 to spin). Points: lon/lat pins. */
export const Globe: React.FC<{ data: QData; lam0: number; phi0?: number; R?: number; cx?: number; cy?: number; points?: { ll: [number, number]; color?: string }[]; fill?: (c: QCountry) => string; stars?: boolean }> = ({ data, lam0, phi0 = 22, R = 400, cx = 1060, cy = 520, points = [], fill, stars = true }) => {
  const proj = (lon: number, lat: number) => {
    const l = (lon - lam0) * RAD, p = lat * RAD, p0 = phi0 * RAD;
    let x = Math.cos(p) * Math.sin(l), y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l);
    const vis = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
    if (vis < 0) { const n = Math.hypot(x, y) || 1; x /= n; y /= n; } // hidden points clamp to the horizon
    return [cx + x * R, cy - y * R, vis] as const;
  };
  const grat: string[] = [];
  for (let lo = -180; lo < 180; lo += 30) { let d = '', on = false; for (let la = -80; la <= 80; la += 5) { const [x, y, v] = proj(lo, la); if (v > 0) { d += `${on ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`; on = true; } else on = false; } grat.push(d); }
  for (let la = -60; la <= 60; la += 30) { let d = '', on = false; for (let lo = -180; lo <= 180; lo += 5) { const [x, y, v] = proj(lo, la); if (v > 0) { d += `${on ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`; on = true; } else on = false; } grat.push(d); }
  return (
    <Full bg="#1B2230">
      {stars && [...Array(60)].map((_, i) => <circle key={i} cx={(i * 397) % 1920} cy={(i * 211) % 1080} r={i % 3 ? 1.5 : 2.5} fill="#fff" opacity={0.5} />)}
      <circle cx={cx} cy={cy} r={R + 18} fill="#7FB7E8" opacity={0.18} />
      <circle cx={cx} cy={cy} r={R} fill={QC.sea} stroke={QC.ink} strokeWidth={4} />
      {data.countries.map((c, i) => (c.rings ?? []).map((r, j) => { const pp = r.map(([lo, la]) => proj(lo, la)); if (pp.every((q) => q[2] < 0)) return null; return <path key={i + '-' + j} d={'M' + pp.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L') + 'Z'} fill={fill ? fill(c) : QC.land} stroke={OL} strokeWidth={1.2} strokeLinejoin="round" />; }))}
      {grat.map((d, i) => <path key={'g' + i} d={d} fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={1} />)}
      {points.map((h, i) => { const [x, y, v] = proj(h.ll[0], h.ll[1]); return v > 0.05 ? <circle key={'p' + i} cx={x} cy={y} r={6} fill={h.color ?? QC.red} stroke={QC.ink} strokeWidth={2} /> : null; })}
      <circle cx={cx - R * 0.33} cy={cy - R * 0.38} r={R * 0.42} fill="#fff" opacity={0.07} />
    </Full>
  );
};

// ------------------------------------------------------------------ STYLE: flow lines
/** Draw inside WorldMap: arcs drawn from point i to i+1, one every `step` frames from `start`; points pop as reached. */
export const FlowLines: React.FC<{ pts: [number, number][]; cam: Cam; start: number; step: number; color?: string; done?: string; bend?: number }> = ({ pts, cam, start, step, color = QC.red, done = QC.orange, bend = 0.35 }) => {
  const f = useCurrentFrame();
  const t = (i: number) => start + i * step;
  return (<>
    {pts.slice(1).map((b, i) => {
      const a = pts[i], t0 = t(i), tt = interpolate(f, [t0, t0 + step], [0, 1]);
      if (f < t0) return null;
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const d = `M${a[0]} ${a[1]} Q${(a[0] + b[0]) / 2} ${(a[1] + b[1]) / 2 - L * bend - 4} ${b[0]} ${b[1]}`;
      const drawing = tt < 1;
      return <path key={i} d={d} pathLength={1} fill="none" stroke={drawing ? color : done} strokeOpacity={drawing ? 1 : 0.55} strokeWidth={(drawing ? 6 : 3.5) / cam.z} strokeDasharray={drawing ? '1 1' : undefined} strokeDashoffset={drawing ? 1 - tt : undefined} strokeLinecap="round" />;
    })}
    {pts.map((p, i) => (f >= t(i) - 1 ? <circle key={'c' + i} cx={p[0]} cy={p[1]} r={(8 / cam.z) * springPop(f, t(i) - 1)} fill={color} stroke={QC.ink} strokeWidth={1.5} vectorEffect="non-scaling-stroke" /> : null))}
  </>);
};
/** How many flow points have been reached by frame f (for a ticker). */
export const flowIndex = (f: number, start: number, step: number, n: number) => Math.max(0, Math.min(n, Math.floor((f - start) / step) + 1));
