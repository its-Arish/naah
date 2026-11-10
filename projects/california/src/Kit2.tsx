/** California film: helpers and small drawn props shared by the eras from Mexico to Today. */
import React from 'react';
import { useCurrentFrame, interpolate, springPop } from '@engine/lib/core';
import { Layer } from '@engine/fx/Camera';
import { Host } from '@engine/characters/Host';
import { OL } from '@engine/scenes/Parts';
import { talk } from '@engine/kit';
import type { Shot } from '@engine/types';
import { MapTag } from '@engine/qgis/QgisMap';
import { useGroup, gw, gf, PAPER, RED, GOLD, INK } from './Kit';

export const DARK = '#26343A';

/** Timing helpers for a run of beats that share one shot. idx = beat number in the run. */
export const useBeat = (s: Shot) => {
  const f = useCurrentFrame();
  const G = useGroup(s);
  /** local frame at which beat idx starts (or a word in it is spoken): -999 if past, 99999 if not yet */
  const at = (idx: number, w?: string | number) => (typeof w === 'string' ? gw(s, G.k, idx, w) : gf(G.k, idx, w ?? 0));
  const pop = (idx: number, w?: string | number) => Math.max(0, springPop(f, at(idx, w)));
  const on = (idx: number, w?: string | number) => f >= at(idx, w);
  /** group frame -> local frame (for components that read the local frame, like MapPin and FlowLines) */
  const loc = (gFrame: number) => gFrame - (G.g - f);
  /** group frame of a beat start or word */
  const gAt = (idx: number, w?: string | number) => { const a = at(idx, w); return a <= -999 || a >= 99999 ? a : G.g - f + a; };
  return { f, ...G, at, pop, on, loc, gAt };
};

export const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

export const Pop: React.FC<{ k: number; x: number; y: number; rot?: number; children: React.ReactNode }> = ({ k, x, y, rot = 0, children }) => (k > 0 ? <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>{children}</g> : null);

export const Txt: React.FC<{ x?: number; y?: number; t: string; size?: number; c?: string; font?: string; anchor?: 'start' | 'middle' | 'end'; o?: number }> = ({ x = 0, y = 0, t, size = 40, c = INK, font = 'TagBold', anchor = 'middle', o = 1 }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={font} fontSize={size} fill={c} opacity={o}>{t}</text>
);

/** A sign that pops: text on a rounded plate, sized to the text. */
export const Sign: React.FC<{ x: number; y: number; k: number; text: string; sub?: string; size?: number; bg?: string; c?: string; rot?: number; stroke?: string }> = ({ x, y, k, text, sub, size = 40, bg = PAPER, c = INK, rot = 0, stroke = OL }) => {
  const w = Math.max(text.length * size * 0.62, (sub?.length ?? 0) * size * 0.36) + 56;
  const h = size * 1.7 + (sub ? size * 0.8 : 0);
  return (
    <Pop k={k} x={x} y={y} rot={rot}>
      <rect x={-w / 2} y={-size * 0.95} width={w} height={h} rx={12} fill={bg} stroke={stroke} strokeWidth={5} />
      <Txt y={size * 0.36} t={text} size={size} c={c} />
      {sub && <Txt y={size * 1.2} t={sub} size={size * 0.56} c={bg === PAPER ? '#5A4A3A' : '#CFC6B2'} />}
    </Pop>
  );
};
export const DarkSign: React.FC<{ x: number; y: number; k: number; text: string; sub?: string; size?: number; rot?: number; c?: string }> = (p) => <Sign {...p} bg={DARK} c={p.c ?? GOLD} />;

/** Dark panel with a title, for counters and lists. Children are drawn from its centre. */
export const Panel: React.FC<{ x: number; y: number; w: number; h: number; k?: number; title?: string; children?: React.ReactNode }> = ({ x, y, w, h, k = 1, title, children }) => (
  <Pop k={k} x={x} y={y}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={16} fill={DARK} stroke={OL} strokeWidth={6} />
    <rect x={-w / 2 + 10} y={-h / 2 + 10} width={w - 20} height={h - 20} rx={9} fill="none" stroke="#8A6A44" strokeWidth={3.5} />
    {title && <Txt y={-h / 2 + 58} t={title} size={30} c="#CFC6B2" />}
    {children}
  </Pop>
);

export const Sky: React.FC<{ id?: string }> = ({ id = 'skyDay' }) => <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={`url(#${id})`} /></Layer>;
export const Ground: React.FC<{ y: number; fill: string; top?: string }> = ({ y, fill, top }) => (
  <g>
    <rect x={-200} y={y} width={2400} height={1300 - y} fill={fill} />
    <path d={`M-200 ${y} q200 -18 400 0 t400 0 t400 0 t400 0 t400 0 t400 0 v30 h-2400 Z`} fill={top ?? fill} stroke={OL} strokeWidth={3} />
  </g>
);
/** The narrator with the beat's mouth timing. */
export const HostS: React.FC<{ s: Shot; x?: number; y?: number; scale?: number; keys: any[]; dim?: number; staffMode?: any }> = ({ s, x = 1520, y = 960, scale = 1, keys, dim = 0, staffMode }) => (
  <Host x={x} y={y} scale={scale} keys={keys} talking={talk(s)} dim={dim} {...(staffMode ? { staffMode } : {})} />
);
/** Still, dark frame for the quiet passages. No narrator, no motion beyond a slow fade. */
export const Quiet: React.FC<{ children?: React.ReactNode; tone?: string }> = ({ children, tone = '#1B1F26' }) => (
  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
    <rect width={1920} height={1080} fill={tone} />
    <rect width={1920} height={1080} fill="url(#insertBg)" opacity={0.35} />
    {children}
  </svg>
);
export const fade = (f: number, at: number, len = 24) => interpolate(f, [at, at + len], [0, 1]);

// ------------------------------------------------------------------ small props (drawn around 0,0)
export const Shovel: React.FC<{ s?: number; c?: string }> = ({ s = 1, c = '#9AA3A8' }) => (
  <g transform={`scale(${s})`}>
    <rect x={-6} y={-90} width={12} height={110} rx={5} fill="#A8744A" stroke={OL} strokeWidth={4} />
    <path d="M-22 -104 h44 v18 h-44 Z" fill="#8A5A34" stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-30 18 h60 v38 Q30 92 0 100 Q-30 92 -30 56 Z" fill={c} stroke={OL} strokeWidth={4} strokeLinejoin="round" />
  </g>
);
export const Pick: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-6} y={-70} width={12} height={170} rx={5} fill="#A8744A" stroke={OL} strokeWidth={4} />
    <path d="M-84 -44 Q0 -100 84 -44 Q0 -72 -84 -44 Z" fill="#9AA3A8" stroke={OL} strokeWidth={4} strokeLinejoin="round" />
  </g>
);
export const Pan: React.FC<{ s?: number; gold?: boolean }> = ({ s = 1, gold }) => (
  <g transform={`scale(${s})`}>
    <ellipse rx={78} ry={30} fill="#8E979C" stroke={OL} strokeWidth={4} />
    <ellipse cy={6} rx={54} ry={17} fill="#6F7A80" stroke={OL} strokeWidth={3} />
    {gold && [[-18, 6], [4, 10], [22, 4]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill={GOLD} stroke={OL} strokeWidth={2.5} />)}
  </g>
);
export const Nugget: React.FC<{ s?: number; c?: string }> = ({ s = 1, c = GOLD }) => (
  <g transform={`scale(${s})`}>
    <path d="M-44 10 L-30 -26 L2 -40 L36 -22 L46 12 L20 36 L-22 34 Z" fill={c} stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-30 -26 L-6 -6 L2 -40 M-6 -6 L36 -22 M-6 -6 L20 36 M-6 -6 L-44 10" stroke="#B8901E" strokeWidth={2.5} fill="none" />
  </g>
);
export const Sparkle: React.FC<{ x: number; y: number; f: number; r?: number; c?: string }> = ({ x, y, f, r = 30, c = '#fff' }) => {
  const k = 0.6 + 0.4 * Math.sin(f / 4);
  return <path d={`M${x} ${y - r * k} L${x + r * 0.22} ${y - r * 0.22} L${x + r * k} ${y} L${x + r * 0.22} ${y + r * 0.22} L${x} ${y + r * k} L${x - r * 0.22} ${y + r * 0.22} L${x - r * k} ${y} L${x - r * 0.22} ${y - r * 0.22} Z`} fill={c} stroke={OL} strokeWidth={2} />;
};
export const Cow: React.FC<{ x: number; y: number; s?: number; flip?: boolean; c?: string }> = ({ x, y, s = 1, flip, c = '#8A5A3A' }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {[-48, -26, 26, 48].map((lx) => <rect key={lx} x={lx - 7} y={-44} width={14} height={46} rx={4} fill={c} stroke={OL} strokeWidth={3.5} />)}
    <ellipse cy={-70} rx={76} ry={40} fill={c} stroke={OL} strokeWidth={4} />
    <path d="M-20 -96 q22 14 44 -2 q-6 26 -24 26 q-16 0 -20 -24 Z" fill="#F1E8D2" />
    <path d="M62 -100 q34 -8 46 18 q4 22 -18 26 q-24 2 -34 -18 Z" fill={c} stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    <path d="M70 -104 q-8 -22 6 -30 M96 -98 q10 -20 22 -16" stroke="#EDE3C8" strokeWidth={6} fill="none" strokeLinecap="round" />
    <circle cx={92} cy={-78} r={4} fill={OL} />
    <path d="M-74 -78 q-22 14 -14 44" stroke={OL} strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);
export const Wagon: React.FC<{ x: number; y: number; s?: number; f?: number }> = ({ x, y, s = 1, f = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-90 -60 Q-90 -150 0 -150 Q90 -150 90 -60 Z" fill="#F4ECD8" stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-40 -146 V-60 M10 -150 V-60 M54 -138 V-60" stroke="#CFC2A0" strokeWidth={3} />
    <rect x={-100} y={-62} width={200} height={34} rx={5} fill="#8A5A34" stroke={OL} strokeWidth={4} />
    {[-60, 60].map((wx) => <g key={wx} transform={`translate(${wx} -14) rotate(${f * 6})`}><circle r={30} fill="#C9A66B" stroke={OL} strokeWidth={4} /><path d="M-30 0 H30 M0 -30 V30 M-21 -21 L21 21 M-21 21 L21 -21" stroke={OL} strokeWidth={2.5} /><circle r={6} fill="#5A3E26" /></g>)}
  </g>
);
/** Steam locomotive facing right, wheels on y = 0. */
export const Loco: React.FC<{ x: number; y: number; s?: number; f?: number; flip?: boolean; c?: string }> = ({ x, y, s = 1, f = 0, flip, c = '#3A3A44' }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {[0, 1, 2].map((i) => { const t = (f + i * 12) % 36; return <circle key={i} cx={96 - t * 2.2} cy={-176 - t * 3} r={14 + t * 0.9} fill="#E8E2D4" opacity={0.6 * (1 - t / 36)} />; })}
    <rect x={-130} y={-120} width={100} height={92} rx={6} fill="#8E2F2A" stroke={OL} strokeWidth={4} />
    <rect x={-112} y={-104} width={42} height={36} rx={4} fill="#BFE0F0" stroke={OL} strokeWidth={3} />
    <rect x={-30} y={-96} width={160} height={68} rx={30} fill={c} stroke={OL} strokeWidth={4} />
    <path d="M84 -96 v-46 h-12 l-8 -14 h52 l-8 14 h-12 v46 Z" fill={c} stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    <path d="M130 -40 l44 26 h-44 Z" fill="#8E2F2A" stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    {[-96, -30, 30, 90].map((wx, i) => <g key={wx} transform={`translate(${wx} -22) rotate(${f * 9})`}><circle r={i === 0 ? 26 : 22} fill="#5A5A66" stroke={OL} strokeWidth={4} /><path d="M-20 0 H20 M0 -20 V20" stroke={OL} strokeWidth={3} /></g>)}
  </g>
);
export const FilmCam: React.FC<{ x: number; y: number; s?: number; f?: number }> = ({ x, y, s = 1, f = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -150 L-60 0 M0 -150 L60 0 M0 -150 L0 0" stroke="#5A3E26" strokeWidth={9} strokeLinecap="round" />
    <rect x={-70} y={-240} width={130} height={90} rx={8} fill="#2B2B33" stroke={OL} strokeWidth={4} />
    <path d="M60 -216 l46 -18 v60 l-46 -18 Z" fill="#5A5A66" stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    {[-36, 26].map((cx, i) => <g key={i} transform={`translate(${cx} -262) rotate(${f * 7})`}><circle r={28} fill="#44444E" stroke={OL} strokeWidth={4} /><path d="M-18 0 H18 M0 -18 V18" stroke="#8A8A90" strokeWidth={4} /></g>)}
  </g>
);
/** Loaded 1930s car facing right, wheels on y = 0. */
export const Jalopy: React.FC<{ x: number; y: number; s?: number; f?: number; flip?: boolean }> = ({ x, y, s = 1, f = 0, flip }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 3) * 2}) scale(${flip ? -s : s} ${s})`}>
    <path d="M-80 -150 h90 v24 h-90 Z M-70 -176 h60 v26 h-60 Z" fill="#A8744A" stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-110 -40 V-126 H30 L62 -86 H120 V-40 Z" fill="#4A5A52" stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-40 -116 H22 L46 -86 H-40 Z" fill="#BFE0F0" stroke={OL} strokeWidth={3} strokeLinejoin="round" />
    <rect x={-104} y={-116} width={50} height={30} rx={3} fill="#BFE0F0" stroke={OL} strokeWidth={3} />
    {[-66, 78].map((wx) => <g key={wx} transform={`translate(${wx} -26) rotate(${f * 10})`}><circle r={28} fill="#2B2B33" stroke={OL} strokeWidth={4} /><circle r={11} fill="#B8B8C0" /><path d="M-26 0 H26" stroke="#8A8A90" strokeWidth={2.5} /></g>)}
  </g>
);
export const House: React.FC<{ x: number; y: number; s?: number; c?: string; roof?: string }> = ({ x, y, s = 1, c = '#EFE3C4', roof = '#B5553A' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={-80} width={120} height={80} fill={c} stroke={OL} strokeWidth={4} />
    <path d="M-76 -80 L0 -140 L76 -80 Z" fill={roof} stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-14} y={-48} width={28} height={48} fill="#8A5A34" stroke={OL} strokeWidth={3} />
    <rect x={-48} y={-62} width={24} height={24} fill="#BFE0F0" stroke={OL} strokeWidth={3} /><rect x={24} y={-62} width={24} height={24} fill="#BFE0F0" stroke={OL} strokeWidth={3} />
  </g>
);
export const Garage: React.FC<{ x: number; y: number; s?: number; open?: number; label?: string }> = ({ x, y, s = 1, open = 1, label }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-150} y={-190} width={300} height={190} fill="#D9CFB6" stroke={OL} strokeWidth={5} />
    <path d="M-176 -190 L0 -270 L176 -190 Z" fill="#6E7A5A" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-110} y={-150} width={220} height={150} fill="#2B2B33" stroke={OL} strokeWidth={4} />
    <rect x={-110} y={-150} width={220} height={150 * (1 - open)} fill="#F4ECD8" stroke={OL} strokeWidth={4} />
    {label && <g transform="translate(0 -214)"><rect x={-label.length * 9 - 14} y={-22} width={label.length * 18 + 28} height={40} rx={6} fill={PAPER} stroke={OL} strokeWidth={3.5} /><Txt y={8} t={label} size={24} /></g>}
  </g>
);
export const Chip: React.FC<{ s?: number; c?: string }> = ({ s = 1, c = '#2F4F4A' }) => (
  <g transform={`scale(${s})`}>
    {[-36, -12, 12, 36].map((p) => <g key={p}><rect x={p - 5} y={-78} width={10} height={156} fill="#C9B037" stroke={OL} strokeWidth={2.5} /><rect x={-78} y={p - 5} width={156} height={10} fill="#C9B037" stroke={OL} strokeWidth={2.5} /></g>)}
    <rect x={-58} y={-58} width={116} height={116} rx={10} fill={c} stroke={OL} strokeWidth={5} />
    <rect x={-30} y={-30} width={60} height={60} rx={5} fill="none" stroke="#7FC8B0" strokeWidth={3} />
    <circle cx={-40} cy={-40} r={5} fill="#7FC8B0" />
  </g>
);
export const Orange: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><circle r={34} fill="#F08A2E" stroke={OL} strokeWidth={4} /><path d="M0 -34 q10 -18 28 -16 q-6 16 -28 16 Z" fill="#4F8A3A" stroke={OL} strokeWidth={3} /><circle cx={-10} cy={-10} r={6} fill="#FFC27A" /></g>
);
export const Person: React.FC<{ x: number; y: number; s?: number; c?: string; o?: number }> = ({ x, y, s = 1, c = '#F4ECD8', o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}><circle cy={-58} r={15} fill={c} stroke={OL} strokeWidth={3.5} /><path d="M-20 0 V-26 Q-20 -40 0 -40 Q20 -40 20 -26 V0 Z" fill={c} stroke={OL} strokeWidth={3.5} strokeLinejoin="round" /></g>
);
export const Bear: React.FC<{ s?: number; c?: string; o?: number }> = ({ s = 1, c = '#7A5230', o = 1 }) => (
  <g transform={`scale(${s})`} opacity={o} fill={c} stroke={OL} strokeWidth={4} strokeLinejoin="round">
    {[-58, -30, 26, 54].map((lx) => <rect key={lx} x={lx - 12} y={10} width={24} height={46} rx={8} />)}
    <path d="M-86 6 Q-90 -44 -40 -48 Q-6 -66 30 -44 Q70 -40 80 0 Q76 30 30 32 H-50 Q-84 30 -86 6 Z" />
    <circle cx={84} cy={-14} r={27} /><circle cx={70} cy={-38} r={9} /><circle cx={96} cy={-36} r={9} />
    <ellipse cx={106} cy={-6} rx={15} ry={11} fill="#B88A5A" /><circle cx={90} cy={-20} r={3.5} fill={OL} stroke="none" />
  </g>
);
/** The 1846 Bear Flag: cotton, a red star, a hand-painted bear, a red stripe. */
export const BearFlag: React.FC<{ x: number; y: number; s?: number; paint?: number; wave?: number }> = ({ x, y, s = 1, paint = 1, wave = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${wave})`}>
    <rect x={-190} y={-120} width={380} height={240} rx={4} fill="#F3EEDD" stroke={OL} strokeWidth={5} />
    <rect x={-190} y={76} width={380} height={44} fill="#B3261E" stroke={OL} strokeWidth={4} />
    <path d="M-140 -98 l9 22 24 2 -18 16 6 24 -21 -13 -21 13 6 -24 -18 -16 24 -2 Z" fill="#B3261E" stroke={OL} strokeWidth={3} strokeLinejoin="round" />
    <g transform="translate(30 -30)" opacity={paint}><Bear s={0.8} c="#8A6A4A" /></g>
    <Txt y={62} t="CALIFORNIA REPUBLIC" size={25} o={paint} />
  </g>
);
/** Mission-style university front with arches. Base on y = 0. */
export const Uni: React.FC<{ x: number; y: number; s?: number; rise?: number }> = ({ x, y, s = 1, rise = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s} ${s * Math.max(0.001, rise)})`}>
    <rect x={-260} y={-130} width={520} height={130} fill="#E8D5A8" stroke={OL} strokeWidth={5} />
    <path d="M-280 -130 h560 l-20 -44 h-520 Z" fill="#B5553A" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-70 -174 L0 -250 L70 -174 Z" fill="#E8D5A8" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
    {[-200, -120, -40, 40, 120, 200].map((ax) => <path key={ax} d={`M${ax - 28} 0 V-70 Q${ax} -112 ${ax + 28} -70 V0 Z`} fill="#6B5A44" stroke={OL} strokeWidth={4} />)}
  </g>
);
/** A suspension bridge in the Golden Gate's colour. Deck on y = 0, spans 1500 px from x. */
export const Bridge: React.FC<{ x: number; y: number; draw?: number }> = ({ x, y, draw = 1 }) => {
  const c = '#C8452B';
  return (
    <g transform={`translate(${x} ${y})`}>
      {[380, 1120].map((tx) => <g key={tx}><rect x={tx - 16} y={-330 * draw} width={12} height={330 * draw + 200} fill={c} stroke={OL} strokeWidth={3.5} /><rect x={tx + 4} y={-330 * draw} width={12} height={330 * draw + 200} fill={c} stroke={OL} strokeWidth={3.5} />{[0.25, 0.5, 0.75].map((q) => <rect key={q} x={tx - 16} y={-330 * draw * q} width={32} height={10} fill={c} stroke={OL} strokeWidth={3} />)}</g>)}
      {draw > 0.6 && <g opacity={interpolate(draw, [0.6, 1], [0, 1])}>
        <path d="M0 -40 Q190 -70 380 -326 Q750 60 1120 -326 Q1310 -70 1500 -40" fill="none" stroke={c} strokeWidth={7} />
        {[...Array(24)].map((_, i) => { const px = 410 + i * 30, t = (px - 380) / 740, cy = -326 + 4 * 286 * t * (1 - t) * 1.0; return <line key={i} x1={px} y1={Math.min(-6, cy)} x2={px} y2={-6} stroke={c} strokeWidth={2.5} />; })}
      </g>}
      <rect x={-100} y={-12} width={1700} height={22} fill={c} stroke={OL} strokeWidth={4} />
    </g>
  );
};
export const WaterDrop: React.FC<{ s?: number }> = ({ s = 1 }) => <path transform={`scale(${s})`} d="M0 -46 Q34 0 26 22 Q18 46 0 46 Q-18 46 -26 22 Q-34 0 0 -46 Z" fill="#5FA8D8" stroke={OL} strokeWidth={4} strokeLinejoin="round" />;
export const Egg: React.FC<{ s?: number }> = ({ s = 1 }) => <path transform={`scale(${s})`} d="M0 -46 Q36 -30 34 14 Q30 46 0 46 Q-30 46 -34 14 Q-36 -30 0 -46 Z" fill="#FBF3E0" stroke={OL} strokeWidth={4} />;
/** Old computer terminal showing `text`. */
export const Terminal: React.FC<{ x: number; y: number; s?: number; text: string; cursor?: boolean; crash?: number }> = ({ x, y, s = 1, text, cursor, crash = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-330} y={-250} width={660} height={460} rx={26} fill="#C9C2AE" stroke={OL} strokeWidth={7} />
    <rect x={-280} y={-205} width={560} height={340} rx={18} fill="#0E1A14" stroke={OL} strokeWidth={5} />
    <text x={-240} y={-40} fontFamily="monospace" fontWeight="bold" fontSize={150} fill={crash > 0 ? '#E4573D' : '#58E08A'}>{text}{cursor ? '_' : ''}</text>
    {crash > 0 && <text x={-240} y={90} fontFamily="monospace" fontSize={40} fill="#E4573D" opacity={crash}>SYSTEM CRASH</text>}
    <rect x={-120} y={210} width={240} height={34} fill="#A8A08A" stroke={OL} strokeWidth={5} />
  </g>
);
export const Fruit: React.FC<{ kind: 'plum' | 'cherry' | 'apricot'; s?: number }> = ({ kind, s = 1 }) => (
  <g transform={`scale(${s})`}>
    {kind === 'cherry' ? <><path d="M-18 14 Q-6 -40 20 -50 M22 18 Q18 -30 20 -50" stroke="#4F8A3A" strokeWidth={5} fill="none" /><circle cx={-20} cy={26} r={22} fill="#C8312B" stroke={OL} strokeWidth={4} /><circle cx={24} cy={30} r={22} fill="#C8312B" stroke={OL} strokeWidth={4} /></>
      : <><circle r={34} fill={kind === 'plum' ? '#7A4A9A' : '#F2A64A'} stroke={OL} strokeWidth={4} /><path d="M0 -34 q4 -14 16 -18" stroke="#5A3E26" strokeWidth={5} fill="none" /><path d="M-4 -30 Q-12 0 -2 30" stroke={kind === 'plum' ? '#5E3478' : '#D8862E'} strokeWidth={3} fill="none" /></>}
  </g>
);
export { RED, GOLD, INK, PAPER };

/** MapTag with a little more room: wide capitals overflow the engine's width estimate. */
export const Tag: React.FC<React.ComponentProps<typeof MapTag>> = (p) => <MapTag {...p} text={p.text + '\u00A0\u00A0\u00A0'} />;
