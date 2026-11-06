/** Shot builders for Acts 2–9: host beats with props, GIS maps, storybook scenes, inserts. The narrator is in nearly every shot. */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop } from '@engine/lib/core';
import { gravityDrop } from '@engine/lib/physics';
import { wordAt, talk, type ShotMap } from '@engine/kit';
import { Label } from '@engine/fx/Overlays';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { OL, Hills, Cloud } from '@engine/scenes/Parts';
import { Chibi } from '@engine/characters/Chibi';
import { Silhouette } from '@engine/cast/Silhouette';
import { W } from '@engine/cast/Wardrobe';
import { P, MapPin, MapTag } from '@engine/qgis/QgisMap';
import type { Shot } from '@engine/types';
import type { PointAt } from '@engine/moves';
import {
  Stage, Insert, Narr, TxMap, MapNarr, scr, camAt, moveCam, STATES, QD, Dial, Banner, FlagRail, Switcher, Tag, Rider, TexasShape, txXY,
  RED, BLUE, GOLD, INK, PAPER, PURPLE, type SP,
} from './Kit';

export type K = { at: number; arm?: string; expr?: string };
/** cue: a word in the beat ("w:Alamo" style shorthand is just the word) or a frame number */
export type Cue = string | number;
export const cue = (s: Shot, c: Cue | undefined, fb = 12) => (c === undefined ? fb : typeof c === 'number' ? c : s.words?.some((x) => x.w.replace(/[^\w]/g, '').toLowerCase() === c.toLowerCase().replace(/[^\w]/g, '')) ? wordAt(s, c) : fb);
const keysOf = (s: Shot, k: [string, string, Cue?][]): K[] => k.map(([arm, expr, c]) => ({ at: c === undefined ? 0 : cue(s, c), arm, expr }));

// ------------------------------------------------------------------ host beats
/** A host-stage prop: draws itself, and says where the narrator's staff should point (and when). */
export type Prop = ((s: Shot, f: number) => React.ReactNode) & { pt?: (s: Shot) => PointAt[] };
const withPt = (fn: (s: Shot, f: number) => React.ReactNode, pt: (s: Shot) => PointAt[]): Prop => Object.assign(fn, { pt });
/** Host beat: narrator on the grey stage with optional prop (props live at x 930–1320, y 120–820). */
export const host = (k: [string, string, Cue?][], prop?: Prop, opts: { zoom?: [number, number]; shake?: Cue; staff?: string; dim?: number; point?: [number, number, Cue?][] | false } = {}): React.FC<SP> => ({ s }) => {
  const f = useCurrentFrame();
  const point = opts.point === false ? undefined : opts.point ? opts.point.map(([x, y, c]) => ({ x, y, at: cue(s, c, 10) })) : prop?.pt?.(s);
  return (
    <Stage zoom={opts.zoom} dim={opts.dim} shakes={opts.shake !== undefined ? [{ at: cue(s, opts.shake), amp: 8, len: 12 }] : undefined}>
      {prop?.(s, f)}
      <Narr s={s} keys={keysOf(s, k)} staffMode={opts.staff as any} point={point} />
    </Stage>
  );
};
/** the Dial on the wall: v -1 red .. +1 blue */
export const DialProp = (v: number | ((s: Shot, f: number) => number), o: { crack?: number; lock?: number; banner?: string; bcrack?: number } = {}): Prop => withPt((s: Shot, f: number) => (
  <>
    <Banner x={1100} y={150} s={0.5} color={o.banner ?? (typeof v === 'number' ? (v > 0 ? BLUE : RED) : RED)} crack={o.bcrack ?? 0} />
    <Dial x={1100} y={400} s={0.8} v={typeof v === 'number' ? v : v(s, f)} crack={o.crack ?? 0} lock={o.lock ?? 0} />
  </>
), () => [{ x: 1130, y: 420, at: 10 }]);
/** a sticky tag that pops on a word */
const tagPos = (text: string, o: { x?: number; y?: number; size?: number }) => {
  let size = o.size ?? 54;
  while (text.length * size * 0.58 + 60 > 420 && size > 36) size -= 2;
  let w = text.length * size * 0.58 + 60;
  let x: number, y = o.y ?? 640;
  if (w <= 420) x = Math.min(Math.max(o.x ?? 1150, 930 + w / 2), 1350 - w / 2);
  else { while (w > 1180 && size > 26) { size -= 2; w = text.length * size * 0.58 + 60; } x = Math.min(Math.max(o.x ?? 1150, 140 + w / 2), 1350 - w / 2); y = Math.max(y, 770); }
  return { x, y, size, w };
};
export const TagProp = (text: string, c?: Cue, o: { x?: number; y?: number; bg?: string; size?: number; rot?: number } = {}): Prop => withPt((s: Shot, f: number) => {
  // keep host-stage tags between the narration text (x < 930) and the narrator (x > 1390)
  let size = o.size ?? 54;
  while (text.length * size * 0.58 + 60 > 420 && size > 36) size -= 2;
  let w = text.length * size * 0.58 + 60;
  let x: number, y = o.y ?? 640;
  if (w <= 420) x = Math.min(Math.max(o.x ?? 1150, 930 + w / 2), 1350 - w / 2);
  else { // too long for the gap beside the narrator: it goes under the narration text instead
    while (w > 1180 && size > 26) { size -= 2; w = text.length * size * 0.58 + 60; }
    x = Math.min(Math.max(o.x ?? 1150, 140 + w / 2), 1350 - w / 2); y = Math.max(y, 770);
  }
  return <Tag x={x} y={y} text={text} size={size} bg={o.bg ?? PAPER} rot={o.rot ?? -3} k={springPop(f, cue(s, c, 8))} />;
}, (s) => { const p = tagPos(text, o); return [{ x: p.x + p.w * 0.3, y: p.y - 10, at: cue(s, c, 8) + 2 }]; });
/** the six flags rail: `up` flags raised, the last one raising on cue */
export const FlagsProp = (up: number, c?: Cue, dim: number[] = []): Prop => withPt((s: Shot, f: number) => {
  const at = cue(s, c, 6) - 6;
  const raised = [0, 1, 2, 3, 4, 5].map((i) => (i < up - 1 ? 1 : i === up - 1 ? (c === undefined ? 1 : interpolate(f, [at, at + 18], [0, 1], Easing.out)) : 0));
  return <FlagRail x={780} y={820} s={0.7} raised={raised} dim={dim} />;
}, (s) => [{ x: 780 + Math.max(0, up - 1) * 64 + 40, y: 600, at: cue(s, c, 10) }]);
export const both = (...ps: Prop[]): Prop => withPt((s: Shot, f: number) => <>{ps.map((p, i) => <React.Fragment key={i}>{p(s, f)}</React.Fragment>)}</>, (s) => ps.flatMap((p) => p.pt?.(s) ?? []));
/** a thing that drops from above with gravity and squashes on landing */
export const DropProp = (node: React.ReactNode, c: Cue | undefined, x: number, y: number, h = 600): Prop => withPt((s: Shot, f: number) => {
  const at = cue(s, c, 6);
  if (f < at) return null;
  const d = gravityDrop(f, at, { h, g: 2.4, e: 0.3 });
  return <g transform={`translate(${x} ${y + d.y}) scale(${d.sx} ${d.sy})`}>{node}</g>;
}, (s) => [{ x, y: y - 60, at: cue(s, c, 6) + 14 }]);

// ------------------------------------------------------------------ GIS map beats
export type Pin = [number, number, Cue?, string?, string?]; // lon, lat, cue, label, colour
export type Arrow = [number, number, number, number, Cue?, string?]; // from lon/lat, to lon/lat, cue, colour
export type MapSpec = {
  cam: [number, number, number]; from?: [number, number, number];
  pins?: Pin[]; tags?: [string, number, number, Cue?, string?][]; arrows?: Arrow[];
  states?: Record<string, string>; countries?: Record<string, string>; tx?: string; txSweep?: [string, Cue?];
  narr?: [string, string, Cue?][]; fly?: boolean; big?: [string, Cue?, string?];
  extra?: (s: Shot, f: number, cam: ReturnType<typeof camAt>) => React.ReactNode;
  world?: (s: Shot, f: number) => React.ReactNode;
};
export const map = (m: MapSpec): React.FC<SP> => ({ s }) => {
  const f = useCurrentFrame();
  const dur = useDuration();
  const to = camAt(m.cam[0], m.cam[1], m.cam[2]);
  const cam = m.from ? moveCam(f, camAt(m.from[0], m.from[1], m.from[2]), to, 0, 36) : moveCam(f, camAt(m.cam[0], m.cam[1], m.cam[2] * 0.94), to, 0, Math.max(60, dur));
  const [gx0] = P(-107, 30), [gx1] = P(-93, 30);
  const sweep = m.txSweep ? interpolate(f, [cue(s, m.txSweep[1], 6), cue(s, m.txSweep[1], 6) + 30], [0, 1], Easing.inOut) : 0;
  const fly = m.fly && m.pins?.length ? scr(cam, m.pins[m.pins.length - 1][0], m.pins[m.pins.length - 1][1]) : null;
  return (
    <>
      <TxMap cam={cam} txFill={m.tx ?? '#F1E6CC'} clip={m.txSweep ? <rect x={gx0 - 5} y={0} width={(gx1 - gx0 + 10) * sweep} height={960} fill={m.txSweep[0]} opacity={0.9} /> : undefined} overlay={<>
        {m.arrows?.map(([a, b, c, d, cc, col], i) => {
          const A = scr(cam, a, b), B = scr(cam, c, d);
          const p = interpolate(f, [cue(s, cc, 8), cue(s, cc, 8) + 24], [0, 1], Easing.inOut);
          if (p <= 0) return null;
          const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2 - Math.hypot(B.x - A.x, B.y - A.y) * 0.25;
          const ang = Math.atan2(B.y - my, B.x - mx) * 180 / Math.PI;
          return <g key={i}><path d={`M${A.x} ${A.y} Q${mx} ${my} ${B.x} ${B.y}`} stroke={col ?? RED} strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
            {p > 0.98 && <path d="M0 0 L-26 -14 L-26 14 Z" fill={col ?? RED} transform={`translate(${B.x} ${B.y}) rotate(${ang})`} />}</g>;
        })}
        {m.tags?.map(([t, lo, la, c, bg], i) => { const q = scr(cam, lo, la); return <MapTag key={i} x={q.x} y={q.y} text={t} size={36} k={springPop(f, cue(s, c, 10 + i * 6))} bg={bg} />; })}
        {m.pins?.map(([lo, la, c, lab], i) => { if (!lab) return null; const q = scr(cam, lo, la); return <MapTag key={'pl' + i} x={q.x} y={q.y - 78} text={lab} size={30} k={springPop(f, cue(s, c, 8 + i * 6) + 6)} />; })}
        {m.extra?.(s, f, cam)}
        {m.big && <MapTag x={760} y={140} text={m.big[0]} size={52} k={springPop(f, cue(s, m.big[1], 8))} bg={m.big[2] ?? '#7A4E25'} />}
        {fly && <Rider x={Math.min(1700, interpolate(f, [0, 34], [fly.x + 420, fly.x + 150], Easing.out))} y={Math.max(220, fly.y - 220 + Math.sin(f / 9) * 10)} s={0.34} speed={f < 34 ? 0.9 : 0.15} flip arm="point" expr="grin" talking={talk(s)} />}
      </>}>
        {Object.entries(m.countries ?? {}).map(([iso, col]) => QD.countries.filter((c) => c.iso === iso).map((c) => <path key={iso} d={c.d} fill={col} stroke={OL} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />))}
        {Object.entries(m.states ?? {}).map(([n, col]) => { const st = STATES.find((x) => x.name === n); return st ? <path key={n} d={st.d} fill={col} stroke={OL} strokeWidth={1.4} vectorEffect="non-scaling-stroke" /> : null; })}
        {m.world?.(s, f)}
        {m.pins?.map(([lo, la, c, , col], i) => { const [x, y] = P(lo, la); return <MapPin key={i} x={x} y={y} at={cue(s, c, 8 + i * 6)} z={cam.z} c={col ?? RED} />; })}
      </TxMap>
      {!m.fly && <MapNarr s={s} x={1690} y={830} scale={0.44} keys={keysOf(s, m.narr ?? [['point', 'smile']])} point={[
        ...(m.pins ?? []).map(([lo, la, c], i) => { const q = scr(cam, lo, la); return { x: q.x, y: q.y - 20, at: cue(s, c, 8 + i * 6) + 4 }; }),
        ...(m.tags ?? []).map(([, lo, la, c], i) => { const q = scr(cam, lo, la); return { x: q.x, y: q.y, at: cue(s, c, 10 + i * 6) + 2 }; }),
        ...(m.big ? [{ x: 760, y: 160, at: cue(s, m.big[1], 8) + 2 }] : []),
      ].filter((p) => p.x < 1600 && p.x > 60 && p.y > 60 && p.y < 860)} />}
    </>
  );
};
/** handy camera presets */
export const C = {
  TX: [-99.6, 31.0, 11] as [number, number, number],
  US: [-96, 37.5, 4.2] as [number, number, number],
  SOUTH: [-90, 33, 6.5] as [number, number, number],
  MEXUS: [-103, 30, 4.4] as [number, number, number],
};
export const CITY = {
  Gonzales: [-97.45, 29.5], SanAntonio: [-98.49, 29.42], Washington: [-96.15, 30.33], SanJacinto: [-95.09, 29.75], Austin: [-97.74, 30.27],
  Galveston: [-94.8, 29.3], Houston: [-95.37, 29.76], Beaumont: [-94.1, 30.08], Dallas: [-96.8, 32.78], DC: [-77.04, 38.9], Starr: [-98.74, 26.56],
} as Record<string, [number, number]>;

// ------------------------------------------------------------------ storybook scenes
export type Sky = 'day' | 'dawn' | 'dusk' | 'storm' | 'night';
const SKY: Record<Sky, string> = { day: 'url(#skyDay)', dawn: 'url(#skyDawn)', dusk: 'url(#skyDawn)', storm: '#5B6470', night: 'url(#skyNight)' };
export const Land: React.FC<{ sky?: Sky; ground?: string; hills?: [string, string]; children?: React.ReactNode; dim?: number; focus?: [number, number]; shake?: number; zoom?: [number, number] }> = ({ sky = 'day', ground = '#C9A66B', hills = ['#B9B56E', '#A8C07A'], children, dim = 0, focus = [960, 600], shake, zoom = [1, 1.05] }) => (
  <CameraRig move={{ zoomFrom: zoom[0], zoomTo: zoom[1], focus, shakes: shake !== undefined ? [{ at: shake, amp: 10, len: 12 }] : undefined }}>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={SKY[sky]} />{sky !== 'storm' && sky !== 'night' && <><Cloud x={420} y={180} s={1.1} /><Cloud x={1450} y={140} s={0.9} /></>}</Layer>
    <Layer depth={0.3}><Hills y={560} fill={hills[0]} amp={50} seed="g1" /></Layer>
    <Layer depth={0.6}><Hills y={660} fill={hills[1]} amp={30} seed="g2" /></Layer>
    <Layer depth={1}>
      <rect x={-200} y={760} width={2400} height={500} fill={ground} />
      {children}
      {dim > 0 && <rect x={-200} y={-200} width={2400} height={1500} fill="#1E2A50" opacity={dim} />}
    </Layer>
  </CameraRig>
);
/** a scene with the narrator watching from the side (x 1700) */
export type Pts = (s: Shot, f: number) => PointAt[];
export const scene = (body: (s: Shot, f: number, dur: number) => React.ReactNode, o: { sky?: Sky; ground?: string; hills?: [string, string]; narr?: [string, string, Cue?][] | false; nx?: number; flip?: boolean; dim?: number; over?: (s: Shot, f: number) => React.ReactNode; shake?: Cue; point?: Pts } = {}): React.FC<SP> => ({ s }) => {
  const f = useCurrentFrame();
  const dur = useDuration();
  return (
    <>
      <Land sky={o.sky} ground={o.ground} hills={o.hills} dim={o.dim} shake={o.shake !== undefined ? cue(s, o.shake) : undefined}>
        {body(s, f, dur)}
        {o.narr !== false && <Narr s={s} x={o.nx ?? 1720} y={860} scale={0.55} flip={o.flip} keys={keysOf(s, o.narr ?? [['present', 'smile']])} point={o.point?.(s, f) ?? [{ x: 1250, y: 620, at: 16 }]} />}
      </Land>
      {o.over?.(s, f)}
    </>
  );
};

// ------------------------------------------------------------------ inserts (dark vignette)
export const insert = (body: (s: Shot, f: number, dur: number) => React.ReactNode, o: { narr?: [string, string, Cue?][] | false; nx?: number; over?: (s: Shot, f: number) => React.ReactNode; point?: Pts } = {}): React.FC<SP> => ({ s }) => {
  const f = useCurrentFrame();
  const dur = useDuration();
  return (
    <>
      <Insert>
        {body(s, f, dur)}
        {o.narr !== false && <Narr s={s} x={o.nx ?? 1720} y={840} scale={0.45} keys={keysOf(s, o.narr ?? [['present', 'smile']])} point={o.point?.(s, f) ?? [{ x: 1300, y: 430, at: 16 }]} />}
      </Insert>
      {o.over?.(s, f)}
    </>
  );
};
/** real people: silhouettes on coloured cards (never caricatures) */
export const people = (cards: { name: string; role?: string; c: string; x?: number; cue?: Cue; costume?: any; stamp?: [string, Cue?, string?] }[], narr?: [string, string, Cue?][]) => insert((s, f) => (
  <>
    {cards.map((p, i) => {
      const x = p.x ?? (cards.length === 1 ? 760 : 520 + i * 480);
      const k = springPop(f, cue(s, p.cue, 6 + i * 8));
      return <g key={p.name}>
        <Silhouette x={x} y={430} name={p.name} role={p.role} c={p.c} k={k} s={0.95} costume={p.costume ?? W.LEADER} />
        {p.stamp && <Tag x={x} y={700} text={p.stamp[0]} size={44} bg={p.stamp[2] ?? GOLD} rot={-5} k={springPop(f, cue(s, p.stamp[1], 30))} />}
      </g>;
    })}
  </>
), { narr, point: (s) => cards.map((p, i) => ({ x: (p.x ?? (cards.length === 1 ? 760 : 520 + i * 480)) + 150, y: 400, at: cue(s, p.cue, 6 + i * 8) + 4 })).concat(cards.filter((p) => p.stamp).map((p, i) => ({ x: (p.x ?? (cards.length === 1 ? 760 : 520 + i * 480)) + 120, y: 700, at: cue(s, p.stamp![1], 30) + 2 }))) });
/** a pull-quote card */
export const quote = (text: string, who: string, o: { c?: Cue; narr?: [string, string, Cue?][] } = {}) => insert((s, f) => {
  const k = springPop(f, cue(s, o.c, 6));
  return k > 0 ? (
    <g transform={`translate(780 420) scale(${k}) rotate(-1.5)`}>
      <rect x={-560} y={-210} width={1120} height={420} rx={20} fill={PAPER} stroke={OL} strokeWidth={7} />
      <text x={-500} y={-110} fontFamily="Serif" fontSize={150} fill={RED} opacity={0.5}>“</text>
      <text y={10} textAnchor="middle" fontFamily="Serif" fontSize={text.length > 30 ? 60 : 78} fontStyle="italic" fill={INK}>{text}</text>
      <text y={130} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#6B5A45">— {who}</text>
    </g>
  ) : null;
}, { narr: o.narr ?? [['chin', 'smile']], point: (s) => [{ x: 1300, y: 420, at: cue(s, o.c, 6) + 6 }] });
/** big number / headline card */
export const bigCard = (text: string, sub?: string, o: { c?: Cue; color?: string; narr?: [string, string, Cue?][] } = {}) => insert((s, f) => {
  const k = springPop(f, cue(s, o.c, 6));
  return k > 0 ? (
    <g transform={`translate(780 400) scale(${k})`}>
      <rect x={-440} y={-170} width={880} height={sub ? 340 : 260} rx={22} fill={o.color ?? PAPER} stroke={OL} strokeWidth={7} />
      <text y={sub ? -10 : 40} textAnchor="middle" fontFamily="TagBold" fontSize={Math.min(130, 1300 / Math.max(1, text.length))} fill={INK}>{text}</text>
      {sub && <text y={110} textAnchor="middle" fontFamily="TagBold" fontSize={Math.min(44, 1500 / Math.max(1, sub.length))} fill="#6B5A45">{sub}</text>}
    </g>
  ) : null;
}, { narr: o.narr, point: (s) => [{ x: 1200, y: 400, at: cue(s, o.c, 6) + 6 }] });
/** result bars (two candidates) */
export const result = (rows: { name: string; v: number; c: string }[], title: string, o: { c?: Cue; narr?: [string, string, Cue?][]; note?: string } = {}) => insert((s, f) => {
  const at = cue(s, o.c, 6);
  return (
    <g>
      <text x={780} y={180} textAnchor="middle" fontFamily="TagBold" fontSize={60} fill={PAPER}>{title}</text>
      {rows.map((r, i) => {
        const k = interpolate(f, [at + i * 6, at + i * 6 + 26], [0, 1], Easing.out);
        const w = (r.v / 100) * 1100 * k;
        return <g key={r.name} transform={`translate(230 ${300 + i * 170})`}>
          <rect x={0} y={0} width={1100} height={110} rx={14} fill="#00000040" />
          <rect x={0} y={0} width={w} height={110} rx={14} fill={r.c} stroke={OL} strokeWidth={5} />
          <text x={24} y={72} fontFamily="TagBold" fontSize={50} fill="#fff">{r.name}</text>
          {k > 0.5 && <text x={w > 760 ? w - 20 : w + 20} y={72} textAnchor={w > 760 ? 'end' : 'start'} fontFamily="TagBold" fontSize={50} fill="#fff">{`${(r.v * Math.min(1, k * 1.1)).toFixed(1)}%`}</text>}
        </g>;
      })}
      {o.note && <Tag x={780} y={700} text={o.note} size={40} bg={GOLD} rot={-2} k={springPop(f, at + 34)} />}
    </g>
  );
}, { narr: o.narr ?? [['point', 'smile']], point: (s) => [...rows.map((r, i) => ({ x: 230 + (r.v / 100) * 1100, y: 355 + i * 170, at: cue(s, o.c, 6) + i * 10 + 22 })), ...(o.note ? [{ x: 960, y: 700, at: cue(s, o.c, 6) + 40 }] : [])] });
/** a document or proclamation */
export const doc = (title: string, lines: string[], o: { c?: Cue; stamp?: [string, Cue?, string?]; narr?: [string, string, Cue?][]; strike?: number } = {}) => insert((s, f) => {
  const k = springPop(f, cue(s, o.c, 4));
  if (k <= 0) return null;
  return (
    <g transform={`translate(760 430) scale(${k}) rotate(-2)`}>
      <rect x={-400} y={-300} width={800} height={600} rx={10} fill="#F1E3C2" stroke={OL} strokeWidth={6} />
      <text y={-200} textAnchor="middle" fontFamily="TagBold" fontSize={Math.min(46, 1300 / Math.max(1, title.length))} fill={INK}>{title}</text>
      <line x1={-300} y1={-170} x2={300} y2={-170} stroke={OL} strokeWidth={3} />
      {lines.map((l, i) => <text key={i} y={-90 + i * 80} textAnchor="middle" fontFamily="Serif" fontSize={50} fill={INK} opacity={interpolate(f, [10 + i * 10, 20 + i * 10], [0, 1])}>{l}</text>)}
      {o.strike !== undefined && <line x1={-300} y1={-90 + o.strike * 80 - 16} x2={-300 + 600 * interpolate(f, [30, 46], [0, 1])} y2={-90 + o.strike * 80 - 16} stroke={RED} strokeWidth={10} />}
      {o.stamp && springPop(f, cue(s, o.stamp[1], 30)) > 0 && <g transform={`translate(170 200) rotate(-12) scale(${springPop(f, cue(s, o.stamp[1], 30))})`}><rect x={-190} y={-50} width={380} height={100} rx={10} fill="none" stroke={o.stamp[2] ?? RED} strokeWidth={8} /><text y={20} textAnchor="middle" fontFamily="TagBold" fontSize={54} fill={o.stamp[2] ?? RED}>{o.stamp[0]}</text></g>}
    </g>
  );
}, { narr: o.narr ?? [['present', 'smile']], point: (s) => [{ x: 1150, y: 300, at: cue(s, o.c, 4) + 10 }, ...(o.stamp ? [{ x: 1080, y: 630, at: cue(s, o.stamp[1], 30) + 2 }] : [])] });
/** a timeline strip with a moving marker */
export const timeline = (marks: [number, string][], range: [number, number], at: number, o: { bands?: [number, number, string][]; c?: Cue; narr?: [string, string, Cue?][] } = {}) => insert((s, f) => {
  const X = (y: number) => 200 + ((y - range[0]) / (range[1] - range[0])) * 1180;
  const mk = interpolate(f, [cue(s, o.c, 6), cue(s, o.c, 6) + 30], [range[0], at], Easing.inOut);
  return (
    <g>
      {o.bands?.map(([a, b, c], i) => <rect key={i} x={X(a)} y={360} width={(X(b) - X(a)) * interpolate(f, [6 + i * 8, 30 + i * 8], [0, 1])} height={60} rx={8} fill={c} stroke={OL} strokeWidth={4} />)}
      <line x1={180} y1={440} x2={1400} y2={440} stroke={PAPER} strokeWidth={6} />
      {marks.map(([y, l]) => <g key={y}><line x1={X(y)} y1={426} x2={X(y)} y2={454} stroke={PAPER} strokeWidth={4} /><text x={X(y)} y={500} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill={PAPER}>{l}</text></g>)}
      <g transform={`translate(${X(mk)} 330)`}><path d="M0 0 L-22 -36 H22 Z" fill={GOLD} stroke={OL} strokeWidth={4} /><text y={-50} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill={GOLD}>{Math.round(mk)}</text></g>
    </g>
  );
}, { narr: o.narr ?? [['point', 'smile']], point: (s) => [{ x: 200 + ((at - range[0]) / (range[1] - range[0])) * 1180, y: 330, at: cue(s, o.c, 6) + 30 }] });
export { RED, BLUE, GOLD, INK, PAPER, PURPLE, OL, Chibi, W, Switcher, Tag, Label, Rider, TexasShape, txXY, springPop, interpolate, Easing, cue as cueOf };
export type { ShotMap };
