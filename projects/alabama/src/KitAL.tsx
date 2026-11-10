/** Alabama film: the "five blocks" street map (the running thread), a regional map and drawn props. */
import React from 'react';
import { useCurrentFrame, interpolate, Easing, springPop } from '@engine/lib/core';
import { OL } from '@engine/scenes/Parts';
import { AL_D, alTransform, alPt, PLACES, PAPER, RED, GOLD, INK } from './Kit';
import nb from './neighbors.json';

const NB = nb as Record<string, string>;
export const NAVY = '#26343A';

// ------------------------------------------------------------------ the running thread: FIVE BLOCKS
export type StreetPin = { label: string; year: string; block: number; side?: 1 | -1; at: number; c?: string; dy?: number };
/**
 * Dexter Avenue as a small street map: Court Square fountain at the bottom, the Capitol at the top,
 * five blocks between. Drawn around (x, y) = middle of the street, height 600 at s = 1.
 * `draw` 0..1 draws the street from the bottom up; pins pop at their `at` (local frame); block 0 = fountain, 5 = Capitol.
 */
export const FiveBlocks: React.FC<{ x: number; y: number; s?: number; k?: number; draw?: number; count?: number; pins?: StreetPin[]; title?: boolean }> = ({ x, y, s = 1, k = 1, draw = 1, count = 0, pins = [], title = true }) => {
  const f = useCurrentFrame();
  if (k <= 0) return null;
  const H = 520, top = -H / 2, bot = H / 2, bh = H / 5;
  const yb = (b: number) => bot - b * bh;
  const len = H * draw;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      <rect x={-210} y={top - 120} width={420} height={H + 250} rx={18} fill={PAPER} stroke={OL} strokeWidth={6} />
      {/* city blocks either side */}
      {[0, 1, 2, 3, 4].map((b) => (b + 1) / 5 <= draw + 0.001 && (
        <g key={b}>
          <rect x={-180} y={yb(b + 1) + 8} width={130} height={bh - 16} rx={6} fill="#E3D6B6" stroke="#B9A77F" strokeWidth={3} />
          <rect x={50} y={yb(b + 1) + 8} width={130} height={bh - 16} rx={6} fill="#E3D6B6" stroke="#B9A77F" strokeWidth={3} />
        </g>))}
      {/* the street */}
      <line x1={0} y1={bot} x2={0} y2={bot - len} stroke="#6E6658" strokeWidth={56} strokeLinecap="butt" />
      <line x1={0} y1={bot} x2={0} y2={bot - len} stroke="#F4ECD8" strokeWidth={4} strokeDasharray="18 16" />
      {/* block counter ticks */}
      {[1, 2, 3, 4, 5].map((b) => count >= b && (
        <g key={b} transform={`translate(-196 ${yb(b - 0.5)})`}><circle r={20} fill={GOLD} stroke={OL} strokeWidth={3.5} /><text y={9} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill={INK}>{b}</text></g>))}
      {/* fountain (bottom) */}
      <g transform={`translate(0 ${bot + 44})`}>
        <circle r={46} fill="#9EC5DB" stroke={OL} strokeWidth={5} />
        <circle r={18} fill="#CFE3EE" stroke={OL} strokeWidth={3} />
        <path d={`M0 -12 q-8 -${14 + Math.sin(f / 5) * 3} 0 -22 q8 8 0 22`} fill="#fff" stroke="#7FAFD6" strokeWidth={2} />
      </g>
      <text y={bot + 112} textAnchor="middle" fontFamily="TagBold" fontSize={24} fill="#5A4A3A">COURT SQUARE</text>
      {/* Capitol (top), appears when the street reaches it */}
      {draw > 0.98 && (
        <g transform={`translate(0 ${top - 40}) scale(${Math.min(1, springPop(f, 0))})`}>
          <rect x={-86} y={-6} width={172} height={44} fill="#F8F4EA" stroke={OL} strokeWidth={4} />
          {[-62, -36, -10, 16, 42, 66].map((cx) => <line key={cx} x1={cx} y1={0} x2={cx} y2={34} stroke="#B9A77F" strokeWidth={4} />)}
          <path d="M-44 -6 Q0 -78 44 -6 Z" fill="#F8F4EA" stroke={OL} strokeWidth={4} />
          <rect x={-5} y={-92} width={10} height={20} fill="#F8F4EA" stroke={OL} strokeWidth={3} />
        </g>)}
      {title && <text y={top - 96} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill="#5A4A3A">{draw > 0.98 ? 'CAPITOL' : ''}</text>}
      {pins.map((p, i) => {
        const a = springPop(f, p.at); if (a <= 0) return null;
        const side = 1, py = p.block >= 5 ? top - 30 : p.block <= 0 ? bot + 44 : yb(p.block), dy = p.dy ?? 0;
        return (
          <g key={i} transform={`translate(0 ${py})`}>
            <path d={`M0 0 L${side * 120} ${dy} H${side * 190}`} stroke={OL} strokeWidth={3} strokeDasharray="6 6" fill="none" opacity={Math.min(1, a)} />
            <g transform={`scale(${a})`}><circle r={14} fill={p.c ?? RED} stroke={OL} strokeWidth={3.5} /></g>
            <g transform={`translate(${side * 190} ${dy}) scale(${a})`}>
              <rect x={side > 0 ? 0 : -260} y={-34} width={260} height={68} rx={10} fill={NAVY} stroke={OL} strokeWidth={4} />
              <text x={side > 0 ? 130 : -130} y={-6} textAnchor="middle" fontFamily="TagBold" fontSize={24} fill={GOLD}>{p.year}</text>
              <text x={side > 0 ? 130 : -130} y={22} textAnchor="middle" fontFamily="TagBold" fontSize={19} fill="#F4ECD8">{p.label}</text>
            </g>
          </g>
        );
      })}
    </g>
  );
};

// ------------------------------------------------------------------ Alabama with its neighbours
/** Alabama (and optionally its neighbours) at (x, y), `h` px tall. Children are drawn on top in screen space. */
export const AlMap: React.FC<{ x: number; y: number; h: number; fill?: string; nbFill?: string; neighbours?: boolean; sea?: string | null; children?: React.ReactNode; nbStroke?: string }> = ({ x, y, h, fill = '#F3B562', nbFill = '#E9DEC2', neighbours = true, sea, children, nbStroke = '#8A7A5A' }) => {
  const sw = 3 * (25.5 / h);
  return (
    <g>
      {sea && <rect x={-200} y={-200} width={2400} height={1500} fill={sea} />}
      <g transform={alTransform(x, y, h)}>
        {neighbours && Object.entries(NB).map(([n, d]) => <path key={n} d={d} fill={nbFill} stroke={nbStroke} strokeWidth={sw} strokeLinejoin="round" />)}
        <path d={AL_D} fill={fill} stroke={OL} strokeWidth={sw * 1.6} strokeLinejoin="round" />
      </g>
      {children}
    </g>
  );
};
export const at = (x: number, y: number, h: number, place: string) => alPt(x, y, h, PLACES[place][0], PLACES[place][1]);
/** A pin with a label that pops at `t`. */
export const Pin: React.FC<{ p: [number, number]; t: number; label?: string; c?: string; dx?: number; dy?: number; size?: number; star?: boolean }> = ({ p, t, label, c = RED, dx = 24, dy = -20, size = 30, star }) => {
  const f = useCurrentFrame();
  const a = springPop(f, t); if (a <= 0) return null;
  const ring = (f - t) % 40;
  const w = (label?.length ?? 0) * size * 0.62 + 30;
  return (
    <g>
      <circle cx={p[0]} cy={p[1]} r={14 + ring} fill="none" stroke={c} strokeWidth={4} opacity={Math.max(0, 1 - ring / 40) * 0.8} />
      <g transform={`translate(${p[0]} ${p[1]}) scale(${a})`}>
        {star ? <path d="M0 -20 L6 -6 L21 -6 L9 3 L13 18 L0 9 L-13 18 L-9 3 L-21 -6 L-6 -6 Z" fill={c} stroke={OL} strokeWidth={3} /> : <circle r={12} fill={c} stroke={OL} strokeWidth={4} />}
      </g>
      {label && <g transform={`translate(${p[0] + dx} ${p[1] + dy}) scale(${a})`}>
        <rect x={dx < 0 ? -w : 0} y={-size * 0.85} width={w} height={size * 1.45} rx={8} fill={NAVY} stroke={OL} strokeWidth={3.5} />
        <text x={dx < 0 ? -w / 2 : w / 2} y={size * 0.28} textAnchor="middle" fontFamily="TagBold" fontSize={size} fill="#fff">{label}</text>
      </g>}
    </g>
  );
};
/** Dashed route drawn progressively (p 0..1) through screen points. */
export const Route: React.FC<{ pts: [number, number][]; p: number; c?: string; w?: number }> = ({ pts, p, c = RED, w = 7 }) => {
  const segs = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const tot = segs.reduce((a, b) => a + b, 0);
  let left = tot * Math.max(0, Math.min(1, p));
  const out: [number, number][] = [pts[0]];
  for (let i = 0; i < segs.length && left > 0; i++) {
    const t = Math.min(1, left / segs[i]);
    out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]);
    left -= segs[i];
  }
  return <polyline points={out.map((q) => q.join(',')).join(' ')} fill="none" stroke={c} strokeWidth={w} strokeDasharray="16 10" strokeLinecap="round" strokeLinejoin="round" />;
};
export const routeHead = (pts: [number, number][], p: number): [number, number] => {
  const segs = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  let left = segs.reduce((a, b) => a + b, 0) * Math.max(0, Math.min(1, p));
  for (let i = 0; i < segs.length; i++) { if (left <= segs[i]) { const t = left / segs[i]; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]; } left -= segs[i]; }
  return pts[pts.length - 1];
};

// ------------------------------------------------------------------ props (drawn around 0,0)
export const Beads: React.FC<{ s?: number }> = ({ s = 1 }) => {
  const C = ['#7B3FA0', '#2E9D57', '#E2B13C'];
  return (
    <g transform={`scale(${s})`}>
      {Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2; return <circle key={i} cx={Math.sin(a) * 70} cy={-Math.cos(a) * 92 + 30} r={13} fill={C[i % 3]} stroke={OL} strokeWidth={3} />; })}
      <circle cx={-12} cy={-50} r={6} fill="#fff" opacity={0.5} />
    </g>
  );
};
export const Suitcase: React.FC<{ s?: number; c?: string; tag?: string }> = ({ s = 1, c = '#B0412E', tag }) => (
  <g transform={`scale(${s})`}>
    <path d="M-28 -78 v-22 q0 -10 10 -10 h36 q10 0 10 10 v22" fill="none" stroke={OL} strokeWidth={8} />
    <rect x={-90} y={-80} width={180} height={140} rx={16} fill={c} stroke={OL} strokeWidth={5} />
    <path d="M-50 -80 v140 M50 -80 v140" stroke="#7A2A1E" strokeWidth={6} />
    <circle cx={-66} cy={70} r={11} fill="#3A3A44" stroke={OL} strokeWidth={3} /><circle cx={66} cy={70} r={11} fill="#3A3A44" stroke={OL} strokeWidth={3} />
    {tag && <g transform="translate(96 -40) rotate(14)"><line x1={-10} y1={-4} x2={4} y2={8} stroke={OL} strokeWidth={3} /><rect x={0} y={0} width={70} height={40} rx={5} fill={PAPER} stroke={OL} strokeWidth={3} /><text x={35} y={27} textAnchor="middle" fontFamily="TagBold" fontSize={20} fill={RED}>{tag}</text></g>}
  </g>
);
export const Vinyl: React.FC<{ s?: number; rot?: number; label?: string }> = ({ s = 1, rot = 0, label = 'AL' }) => (
  <g transform={`scale(${s}) rotate(${rot})`}>
    <circle r={150} fill="#1E1E24" stroke={OL} strokeWidth={5} />
    {[120, 100, 80].map((r) => <circle key={r} r={r} fill="none" stroke="#3A3A44" strokeWidth={3} />)}
    <path d="M-100 -60 A120 120 0 0 1 -40 -110" stroke="#6A6A78" strokeWidth={6} fill="none" strokeLinecap="round" />
    <circle r={56} fill={RED} stroke={OL} strokeWidth={4} />
    <text y={10} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill={GOLD}>{label}</text>
    <circle r={7} fill="#F4ECD8" />
  </g>
);
export const Note: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><path d="M0 0 V-60 l34 -10 v52" stroke={OL} strokeWidth={6} fill="none" strokeLinejoin="round" /><ellipse cx={-10} cy={2} rx={14} ry={10} fill={OL} /><ellipse cx={24} cy={-8} rx={14} ry={10} fill={OL} /></g>
);
/** A Saturn V-style moon rocket, base at (0, 0), ~620 px tall at s = 1. flame 0..1. */
export const Rocket: React.FC<{ s?: number; flame?: number }> = ({ s = 1, flame = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`scale(${s})`}>
      {flame > 0 && <g opacity={Math.min(1, flame)}>
        <path d={`M-46 0 Q0 ${200 + Math.sin(f / 2) * 30} 46 0 Z`} fill="#F6A04D" />
        <path d={`M-26 0 Q0 ${120 + Math.sin(f / 1.6) * 20} 26 0 Z`} fill="#FFF3C4" />
      </g>}
      <path d="M-62 0 L-80 30 L-50 0 M62 0 L80 30 L50 0" fill="#3A3A44" stroke={OL} strokeWidth={4} />
      <rect x={-56} y={-260} width={112} height={260} fill="#F8F6F0" stroke={OL} strokeWidth={5} />
      <rect x={-56} y={-90} width={112} height={34} fill="#1E1E24" />
      {[-36, 0, 36].map((x) => <rect key={x} x={x - 9} y={-250} width={18} height={30} fill="#1E1E24" />)}
      <rect x={-46} y={-430} width={92} height={170} fill="#F8F6F0" stroke={OL} strokeWidth={5} />
      <rect x={-46} y={-330} width={92} height={22} fill="#1E1E24" />
      <text x={0} y={-160} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill={INK} transform="rotate(0)">USA</text>
      <path d="M-38 -430 L-30 -500 L30 -500 L38 -430 Z" fill="#F8F6F0" stroke={OL} strokeWidth={5} />
      <path d="M-24 -500 L0 -560 L24 -500 Z" fill="#E8E2D4" stroke={OL} strokeWidth={4} />
      <line x1={0} y1={-560} x2={0} y2={-620} stroke={OL} strokeWidth={5} />
    </g>
  );
};
/** A steel through-arch bridge in silhouette (Edmund Pettus style), deck at y = 0, ~900 px wide at s = 1. */
export const ArchBridge: React.FC<{ s?: number; c?: string; light?: string }> = ({ s = 1, c = '#3A4450', light = '#5A6672' }) => (
  <g transform={`scale(${s})`}>
    <rect x={-480} y={-6} width={960} height={26} fill={c} />
    <path d="M-420 -6 Q0 -330 420 -6" fill="none" stroke={c} strokeWidth={22} />
    <path d="M-420 -6 Q0 -280 420 -6" fill="none" stroke={c} strokeWidth={10} />
    {Array.from({ length: 13 }, (_, i) => { const x = -360 + i * 60; const yTop = -6 - (330 - (x * x) / 534) * 0.92; return <line key={i} x1={x} y1={-6} x2={x} y2={yTop} stroke={light} strokeWidth={6} />; })}
    {[-470, 470].map((x) => <rect key={x} x={x - 20} y={-6} width={40} height={260} fill={c} />)}
  </g>
);
/** A flat-topped earthen platform mound. w = base width, h = height (0 = flat). */
export const Mound: React.FC<{ x: number; y: number; w: number; h: number; c?: string; top?: boolean }> = ({ x, y, w, h, c = '#7FA05A', top }) => h > 1 ? (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M${-w / 2} 0 L${-w * 0.3} ${-h} L${w * 0.3} ${-h} L${w / 2} 0 Z`} fill={c} stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    <path d={`M${-w * 0.3} ${-h} L${w * 0.3} ${-h}`} stroke="#A8C47A" strokeWidth={6} />
    {top && h > 60 && <g transform={`translate(0 ${-h})`}><rect x={-28} y={-40} width={56} height={40} fill="#C9A66B" stroke={OL} strokeWidth={3.5} /><path d="M-36 -40 L0 -70 L36 -40 Z" fill="#9A7A4A" stroke={OL} strokeWidth={3.5} strokeLinejoin="round" /></g>}
  </g>) : null;
/** A wooden palisade (sharpened logs) from x1 to x2 with the bottom at y. dark = silhouette. */
export const Palisade: React.FC<{ x1: number; x2: number; y: number; h?: number; dark?: boolean }> = ({ x1, x2, y, h = 150, dark }) => (
  <g>
    {Array.from({ length: Math.ceil((x2 - x1) / 26) }, (_, i) => { const x = x1 + i * 26; const hh = h + ((i * 37) % 17); return <path key={i} d={`M${x} ${y} V${y - hh} L${x + 12} ${y - hh - 18} L${x + 24} ${y - hh} V${y} Z`} fill={dark ? '#14181E' : '#8A5A34'} stroke={dark ? '#14181E' : OL} strokeWidth={3} strokeLinejoin="round" />; })}
    {!dark && <path d={`M${x1} ${y - h * 0.4} H${x2} M${x1} ${y - h * 0.75} H${x2}`} stroke="#5A3E26" strokeWidth={5} />}
  </g>
);
export const Corn: React.FC<{ x: number; y: number; g: number; s?: number }> = ({ x, y, g, s = 1 }) => g > 0 ? (
  <g transform={`translate(${x} ${y}) scale(${s} ${s * Math.min(1, g)})`}>
    <line x1={0} y1={0} x2={0} y2={-120} stroke="#5E8A3A" strokeWidth={7} strokeLinecap="round" />
    {[-30, -60, -90].map((yy, i) => <path key={yy} d={`M0 ${yy} q${i % 2 ? 40 : -40} -10 ${i % 2 ? 54 : -54} 18`} stroke="#6E9E44" strokeWidth={6} fill="none" strokeLinecap="round" />)}
    <ellipse cx={10} cy={-72} rx={9} ry={20} fill={GOLD} stroke={OL} strokeWidth={2.5} />
  </g>) : null;
export const Pig: React.FC<{ s?: number; flip?: boolean; f?: number }> = ({ s = 1, flip, f = 0 }) => (
  <g transform={`scale(${flip ? -s : s} ${s})`}>
    {[-26, -10, 12, 28].map((lx, i) => <rect key={lx} x={lx - 5} y={-18 + Math.sin(f / 3 + i * 1.6) * 2} width={10} height={20} rx={3} fill="#E8A6A0" stroke={OL} strokeWidth={3} />)}
    <ellipse cy={-36} rx={46} ry={28} fill="#F2B8B0" stroke={OL} strokeWidth={4} />
    <ellipse cx={44} cy={-38} rx={12} ry={14} fill="#E8A6A0" stroke={OL} strokeWidth={3.5} />
    <circle cx={42} cy={-40} r={2.5} fill={OL} /><circle cx={48} cy={-34} r={2.5} fill={OL} />
    <circle cx={28} cy={-48} r={3.5} fill={OL} />
    <path d="M22 -60 l8 -14 l6 14 Z" fill="#E8A6A0" stroke={OL} strokeWidth={3} strokeLinejoin="round" />
    <path d="M-46 -40 q-14 -6 -8 -18 q8 4 0 12" stroke={OL} strokeWidth={3} fill="none" />
  </g>
);
export const Dog: React.FC<{ s?: number; f?: number }> = ({ s = 1, f = 0 }) => (
  <g transform={`scale(${s})`}>
    {[-28, -14, 16, 30].map((lx, i) => <rect key={lx} x={lx - 5} y={-30} width={10} height={32 + Math.sin(f / 2.5 + i * 1.6) * 3} rx={4} fill="#8A6A4A" stroke={OL} strokeWidth={3} />)}
    <ellipse cy={-44} rx={44} ry={20} fill="#9A7A5A" stroke={OL} strokeWidth={4} />
    <path d="M36 -56 q20 -26 44 -8 l10 14 q-10 10 -30 6 q-16 6 -24 -12 Z" fill="#9A7A5A" stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    <path d="M52 -70 l-6 -22 l16 12 Z" fill="#6A4A2E" stroke={OL} strokeWidth={3} />
    <circle cx={66} cy={-58} r={3} fill={OL} />
    <path d="M-42 -50 q-24 -10 -26 -32" stroke={OL} strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);
export const Chest: React.FC<{ s?: number; open?: number }> = ({ s = 1, open = 0 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-110} y={-70} width={220} height={110} rx={8} fill="#8A5A34" stroke={OL} strokeWidth={5} />
    <rect x={-104} y={-64} width={208} height={20} fill="#2A1B12" opacity={open > 0.2 ? 0.8 : 0} />
    <path d="M-110 -30 H110" stroke="#C9A66B" strokeWidth={8} />
    <g transform={`rotate(${-open * 70} -110 -70)`}>
      <path d="M-110 -70 Q0 -140 110 -70 Z" fill="#9A6A40" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
      <path d="M-14 -76 h28 v22 h-28 Z" fill={GOLD} stroke={OL} strokeWidth={3} />
    </g>
  </g>
);
export const Moon: React.FC<{ r?: number }> = ({ r = 90 }) => (
  <g><circle r={r} fill="#EDEAE0" stroke={OL} strokeWidth={4} />{[[-30, -20, 16], [26, 10, 22], [-10, 40, 10], [34, -36, 9]].map(([x, y, rr], i) => <circle key={i} cx={(x * r) / 90} cy={(y * r) / 90} r={(rr * r) / 90} fill="#D3CFC2" stroke="#B9B4A6" strokeWidth={2} />)}</g>
);
/** Soft, slow fade-in helper for quiet passages. */
export const ease = (f: number, a: number, len = 30) => interpolate(f, [a, a + len], [0, 1], Easing.out);
