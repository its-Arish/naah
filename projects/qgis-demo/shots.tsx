/** QGIS demo: the story of QGIS told with the world map, hackfest list and contributor map that ship in the QGIS repo
 *  (qgis/QGIS resources/data: world_map.gpkg, qgis-hackfests.json, contributors.json → src/world.json via tools_gpkg.py). */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop } from '@engine/lib/core';
import { gravityDrop } from '@engine/lib/physics';
import { Host } from '@engine/characters/Host';
import { OL } from '@engine/scenes/Parts';
import { makeEnd, talk, wordAt, type ShotMap, type SP } from '@engine/kit';
import { Stage } from '@engine/moves';
import { SHOTS as MOVES } from '../moves-demo2/shots';
import W from './src/world.json';

const K = 1920 / 360;
const P = (lon: number, lat: number): [number, number] => [(lon + 180) * K, (90 - lat) * K];
type Cam = { x: number; y: number; z: number };
const WORLD: Cam = { x: 960, y: 420, z: 1.05 };
const EU: Cam = { x: P(9, 50)[0], y: P(9, 50)[1], z: 6 };
const FESTS: Cam = { x: P(11, 20)[0], y: P(11, 20)[1], z: 2.0 };
const mix = (a: Cam, b: Cam, t: number): Cam => {
  const z = Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * t); // zoom in log space so it feels even
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z };
};
const move = (f: number, a: Cam, b: Cam, t0 = 0, t1 = 36) => mix(a, b, interpolate(f, [t0, t1], [0, 1], Easing.inOut));

const SEA = '#9EC5DB', LAND = '#F1E6CC', HI = '#F08A2E', INK = '#1A1410';
const GER = (W.countries as { name: string; iso: string; d: string }[]).find((c) => c.iso === 'DEU');

/** The QGIS world map, drawn in a camera. Children are drawn in map (world-pixel) coordinates. */
const MapView: React.FC<{ cam: Cam; germany?: number; children?: React.ReactNode }> = ({ cam, germany = 0, children }) => (
  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
    <rect width={1920} height={1080} fill={SEA} />
    <g transform={`translate(960 540) scale(${cam.z}) translate(${-cam.x} ${-cam.y})`}>
      {[...Array(13)].map((_, i) => <line key={'v' + i} x1={i * 160} y1={0} x2={i * 160} y2={960} stroke="#fff" strokeOpacity={0.25} strokeWidth={1} vectorEffect="non-scaling-stroke" />)}
      {[...Array(7)].map((_, i) => <line key={'h' + i} x1={0} y1={i * 160} x2={1920} y2={i * 160} stroke="#fff" strokeOpacity={0.25} strokeWidth={1} vectorEffect="non-scaling-stroke" />)}
      {(W.countries as { d: string; iso: string }[]).map((c, i) => <path key={i} d={c.d} fill={LAND} stroke={OL} strokeWidth={1.4} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />)}
      {GER && germany > 0 && <path d={GER.d} fill={HI} fillOpacity={germany} stroke={OL} strokeWidth={2.5} vectorEffect="non-scaling-stroke" />}
      {children}
    </g>
  </svg>
);

/** A map pin that falls in with gravity; size stays constant on screen whatever the zoom. */
const Pin: React.FC<{ x: number; y: number; at: number; z: number; c?: string; r?: number }> = ({ x, y, at, z, c = '#C8312B', r = 1 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const d = gravityDrop(f, at, { h: 90, g: 2.4, e: 0.3 });
  return (
    <g transform={`translate(${x} ${y}) scale(${r / z}) translate(0 ${d.y}) scale(${d.sx} ${d.sy})`}>
      <path d="M0 0 C-6 -14 -18 -22 -18 -36 A18 18 0 1 1 18 -36 C18 -22 6 -14 0 0Z" fill={c} stroke={INK} strokeWidth={3} />
      <circle cy={-36} r={7} fill="#fff" />
    </g>
  );
};
const Tag: React.FC<{ x: number; y: number; text: string; k: number; size?: number; bg?: string; c?: string; anchor?: 'start' | 'middle' }> = ({ x, y, text, k, size = 40, bg = '#1E2A33', c = '#fff', anchor = 'middle' }) => {
  if (k <= 0) return null;
  const w = text.length * size * 0.56 + 44;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x={anchor === 'middle' ? -w / 2 : 0} y={-size * 0.9} width={w} height={size * 1.6} rx={10} fill={bg} stroke={INK} strokeWidth={3} />
      <text x={anchor === 'middle' ? 0 : 22} y={size * 0.33} textAnchor={anchor} fontFamily="TagBold" fontSize={size} fill={c}>{text}</text>
    </g>
  );
};
const screen = (cam: Cam, x: number, y: number) => ({ x: 960 + (x - cam.x) * cam.z, y: 540 + (y - cam.y) * cam.z });
const KA = P(8.40, 49.01);

// ------------------------------------------------------------------ HOST beats
const Intro: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const q = wordAt(s, 'QGIS');
  return (
    <Stage>
      <g transform={`translate(1130 440) scale(${0.85 * springPop(f, q - 4)})`}>
        <rect x={-190} y={-150} width={380} height={300} rx={22} fill={SEA} stroke={OL} strokeWidth={6} />
        <path d="M-150 -40 q60 -60 120 -20 t110 10 l40 80 q-80 70 -170 30 t-100 -40z" fill={LAND} stroke={OL} strokeWidth={4} />
        <g transform="translate(40 -10)"><path d="M0 0 C-6 -14 -18 -22 -18 -36 A18 18 0 1 1 18 -36 C18 -22 6 -14 0 0Z" fill="#C8312B" stroke={OL} strokeWidth={3} /><circle cy={-36} r={7} fill="#fff" /></g>
        <text y={120} textAnchor="middle" fontFamily="TagBold" fontSize={52} fill={INK}>QGIS</text>
      </g>
      <Tag x={1130} y={660} text="FREE · OPEN SOURCE" k={springPop(f, q + 24)} size={30} bg="#C9E0A0" c={INK} />
      <Host x={1420} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at: q, arm: 'present', expr: 'grin' }]} talking={talk(s)} />
    </Stage>
  );
};
const Heli = MOVES.mv_heli;
const Back = MOVES.mv_back;

// ------------------------------------------------------------------ MAP beats
const Karl: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const hit = wordAt(s, 'Karlsruhe');
  const cam = move(f, WORLD, EU, 0, 40);
  const p = screen(cam, KA[0], KA[1]);
  return (<>
    <MapView cam={cam} germany={interpolate(f, [30, 44], [0, 0.85])}><Pin x={KA[0]} y={KA[1]} at={hit - 8} z={cam.z} /></MapView>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><Tag x={p.x + 60} y={p.y - 30} text="Karlsruhe" anchor="start" k={springPop(f, hit + 4)} /></svg>
  </>);
};
const Bug: React.FC<{ x: number; y: number; at: number; squash: number }> = ({ x, y, at, squash }) => {
  const f = useCurrentFrame();
  const k = springPop(f, at), sq = f >= squash ? interpolate(f, [squash, squash + 4], [1, 0.15]) : 1, gone = f > squash + 14;
  if (k <= 0 || gone) return null;
  const wig = f < squash ? Math.sin(f / 2 + x) * 6 : 0;
  return (
    <g transform={`translate(${x + wig} ${y}) scale(${k} ${k * sq})`}>
      {[-1, 1].map((sd) => [-14, 0, 14].map((ly) => <line key={sd + '' + ly} x1={0} y1={ly} x2={sd * 34} y2={ly + (f % 6 < 3 ? -6 : 6)} stroke={INK} strokeWidth={5} strokeLinecap="round" />))}
      <ellipse rx={24} ry={30} fill="#3F7D3A" stroke={INK} strokeWidth={5} /><circle cy={-30} r={13} fill="#2F5E2B" stroke={INK} strokeWidth={5} />
    </g>
  );
};
const Hack: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const cam = { ...EU, z: interpolate(f, [0, 160], [6, 6.6]) };
  const p = screen(cam, KA[0], KA[1]);
  const fixed = Math.min(3, [50, 70, 90].filter((t) => f >= t).length);
  return (<>
    <MapView cam={cam} germany={0.85}><Pin x={KA[0]} y={KA[1]} at={-40} z={cam.z} /></MapView>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <Tag x={p.x + 60} y={p.y - 30} text="Karlsruhe" anchor="start" k={1} />
      {[[-260, 60], [-120, 230], [130, 190]].map(([dx, dy], i) => <Bug key={i} x={p.x + dx} y={p.y + dy} at={8 + i * 8} squash={50 + i * 20} />)}
      <Tag x={1560} y={190} text={`BUGS FIXED: ${fixed}`} k={springPop(f, 46)} size={34} bg="#C9E0A0" c={INK} />
    </svg>
  </>);
};
const Fests: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const cam = move(f, EU, FESTS, 0, 30);
  const hf = W.hackfests as { n: string; year: number; place: string; p: [number, number] }[];
  const step = (d - 60) / hf.length;
  const at = (i: number) => 24 + i * step;
  const shown = hf.filter((_, i) => f >= at(i) + 4);
  const last = shown[shown.length - 1];
  const callouts = ['Lisboa', 'Zanzibar', 'Norrköping'];
  return (<>
    <MapView cam={cam} germany={interpolate(f, [0, 30], [0.85, 0.35])}>
      {hf.map((h, i) => <Pin key={i} x={h.p[0]} y={h.p[1]} at={at(i)} z={cam.z} r={0.8} c={i === shown.length - 1 ? '#C8312B' : '#E06A3B'} />)}
    </MapView>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      {hf.map((h, i) => { if (!callouts.includes(h.place)) return null; const q = screen(cam, h.p[0], h.p[1]); return <Tag key={i} x={q.x + 36} y={q.y - 40} anchor="start" text={`${h.place === 'Lisboa' ? 'Lisbon' : h.place} ${h.year}`} k={springPop(f, at(i) + 4)} size={30} />; })}
      <Tag x={1560} y={190} text={`HACKFESTS: ${shown.length}`} k={springPop(f, 20)} size={44} />
      {last && <Tag x={1560} y={280} text={`${last.year}`} k={1} size={36} bg="#F4ECD8" c={INK} />}
    </svg>
  </>);
};
const Code: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const cam = move(f, FESTS, WORLD, 0, 30);
  const n = Math.round(interpolate(f, [24, 80], [0, W.contributorsTotal as number], Easing.out));
  const code = Math.round(interpolate(f, [70, 110], [0, 600], Easing.out));
  return (<>
    <MapView cam={cam} />
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <rect width={1920} height={1080} fill="#1E2A33" opacity={interpolate(f, [16, 30], [0, 0.35])} />
      <Tag x={960} y={430} text={`${n} CONTRIBUTORS`} k={springPop(f, 20)} size={84} />
      <Tag x={960} y={580} text={`${code} TO THE CODE`} k={springPop(f, 66)} size={48} bg="#F4ECD8" c={INK} />
    </svg>
  </>);
};
const People: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const pts = W.contributors as [number, number][];
  const order = pts.map((p, i) => ({ p, i })).sort((a, b) => a.p[0] - b.p[0]); // sweep west → east
  const n = order.filter((_, k) => f >= 8 + k * 1.6).length;
  return (<>
    <MapView cam={WORLD}>
      {order.map(({ p, i }, k) => { const t = 8 + k * 1.6; if (f < t) return null; const g = gravityDrop(f, t, { h: 50, g: 2.2, e: 0.35 }); return <circle key={i} cx={p[0]} cy={p[1] + g.y / WORLD.z} r={9 / WORLD.z} fill={HI} stroke={INK} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />; })}
    </MapView>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <Tag x={1600} y={210} text={`LOCATED: ${n}`} k={springPop(f, 6)} size={40} />
      {['N. AMERICA', 'S. AMERICA', 'EUROPE', 'AFRICA', 'ASIA', 'OCEANIA'].map((c, i) => <Tag key={c} x={330 + i * 250} y={110} text={c} k={springPop(f, 120 + i * 6)} size={30} bg="#C9E0A0" c={INK} />)}
    </svg>
  </>);
};

const Opening: React.FC<SP> = () => <div style={{ position: 'absolute', inset: 0, background: '#C4C4C4' }} />;
export const SHOTS: ShotMap = { opening: Opening, end: makeEnd('QGIS Demo'), q_intro: Intro, q_heli: Heli, q_karl: Karl, q_hack: Hack, q_fests: Fests, q_code: Code, q_people: People, q_back: Back };
