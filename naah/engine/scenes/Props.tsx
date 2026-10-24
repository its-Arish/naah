import React from 'react';
import { useCurrentFrame, interpolate, Easing, onTwos, random, popScale } from '../lib/core';
import { OL } from './Parts';

// Stylised Nepal outline in a 1000 × 420 box (slanted, west high, east low).
export const NEPAL_PTS: [number, number][] = [
  [0, 120], [60, 90], [130, 60], [200, 70], [260, 40], [340, 60], [420, 92], [500, 112], [580, 140], [660, 168], [740, 188], [820, 206], [900, 226], [960, 236], [1000, 280],
  [992, 360], [944, 402], [862, 410], [780, 396], [700, 382], [620, 366], [540, 342], [460, 322], [380, 300], [300, 272], [220, 252], [140, 240], [80, 222], [30, 192], [0, 160],
];
export const nepalPath = (pts = NEPAL_PTS) => 'M' + pts.map((p) => p.join(' ')).join(' L') + ' Z';

/** Province regions (approximate, stylised) as clip polygons in the same 1000×420 box. */
export const PROVINCES: { name: string; poly: string; c: string; lx: number; ly: number }[] = [
  { name: '1', poly: '-10,0 165,0 135,420 -10,420', c: '#E07A5F', lx: 70, ly: 170 },
  { name: '2', poly: '165,0 450,0 430,190 330,200 230,255 135,420 135,0', c: '#F2CC8F', lx: 290, ly: 140 },
  { name: '3', poly: '135,420 230,255 330,200 430,190 470,250 560,420', c: '#81B29A', lx: 360, ly: 270 },
  { name: '4', poly: '450,0 640,0 640,250 470,250 430,190', c: '#9DB4C0', lx: 540, ly: 190 },
  { name: '5', poly: '640,0 800,0 790,330 640,320 640,250', c: '#E2B13C', lx: 715, ly: 255 },
  { name: '6', poly: '470,250 640,250 640,320 790,330 830,420 560,420', c: '#C07A9C', lx: 680, ly: 362 },
  { name: '7', poly: '800,0 1010,0 1010,420 830,420 790,330', c: '#7FA7D9', lx: 900, ly: 310 },
];

export const NepalShape: React.FC<{ fill?: string; stroke?: string; sw?: number }> = ({ fill = '#DC143C', stroke = OL, sw = 5 }) => (
  <path d={nepalPath()} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
);

export const Rhino: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip }) => {
  const f = onTwos(useCurrentFrame());
  const ear = Math.sin(f / 5) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-120 -40 Q-130 -120 -40 -130 Q60 -140 100 -90 Q120 -60 110 -20 L100 0 L70 0 L66 -24 L-60 -24 L-70 0 L-100 0 Z" fill="#8E8A86" stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M-60 -126 Q-50 -90 -64 -60 M30 -132 Q40 -96 26 -64" stroke="#6E6A66" strokeWidth={4} fill="none" />
      <path d="M90 -100 Q150 -110 180 -70 Q190 -40 160 -36 Q130 -40 110 -50 Z" fill="#8E8A86" stroke={OL} strokeWidth={3.5} />
      <path d="M168 -78 L196 -128 L178 -74 Z" fill="#E8E2D6" stroke={OL} strokeWidth={3} />
      <path d={`M112 -100 l-6 ${-26 + ear} l18 18 Z`} fill="#8E8A86" stroke={OL} strokeWidth={3} />
      <circle cx={140} cy={-80} r={4} fill={OL} />
    </g>
  );
};

export const Tiger: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip }) => {
  const f = onTwos(useCurrentFrame());
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d={`M-110 -50 Q-160 ${-90 + Math.sin(f / 6) * 10} -150 -120`} stroke="#E07B24" strokeWidth={12} fill="none" strokeLinecap="round" />
      <path d="M-110 -40 Q-110 -100 -20 -100 Q60 -104 80 -70 L80 0 L56 0 L52 -30 L-70 -30 L-74 0 L-100 0 Z" fill="#E07B24" stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />
      {[-80, -50, -20, 10, 40].map((sx) => <path key={sx} d={`M${sx} -100 q8 20 0 40`} stroke={OL} strokeWidth={5} fill="none" />)}
      <circle cx={96} cy={-92} r={42} fill="#E07B24" stroke={OL} strokeWidth={3.5} />
      <path d="M66 -126 l-8 -18 l20 8 Z M126 -126 l8 -18 l-20 8 Z" fill="#E07B24" stroke={OL} strokeWidth={3} />
      <path d="M80 -78 Q96 -60 112 -78 Q96 -70 80 -78 Z" fill="#F4EEDD" />
      <circle cx={82} cy={-100} r={4} fill={OL} /><circle cx={110} cy={-100} r={4} fill={OL} />
      <path d="M96 -86 l-5 -6 h10 Z" fill={OL} />
      <path d="M70 -112 q8 4 14 0 M108 -112 q8 4 14 0" stroke={OL} strokeWidth={3} fill="none" />
    </g>
  );
};

export const SnowLeopard: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-100 -40 Q-170 -40 -160 -110" stroke="#D8D4CC" strokeWidth={16} fill="none" strokeLinecap="round" />
    <path d="M-100 -40 Q-100 -90 -20 -92 Q50 -94 66 -64 L66 0 L44 0 L40 -26 L-60 -26 L-64 0 L-90 0 Z" fill="#D8D4CC" stroke={OL} strokeWidth={3.5} />
    {[[-70, -70], [-40, -60], [-10, -76], [20, -62], [-50, -40], [0, -44]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={7} fill="none" stroke="#5A5650" strokeWidth={3} />)}
    <circle cx={84} cy={-84} r={34} fill="#D8D4CC" stroke={OL} strokeWidth={3.5} />
    <circle cx={72} cy={-90} r={4} fill={OL} /><circle cx={96} cy={-90} r={4} fill={OL} />
    <path d="M84 -78 l-4 -5 h8 Z" fill={OL} />
  </g>
);

export const Medal: React.FC<{ x: number; y: number; s?: number; ribbon: [string, string]; label?: string; rot?: number }> = ({ x, y, s = 1, ribbon, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-50 -200 L50 -200 L30 -60 L-30 -60 Z" fill={ribbon[0]} stroke={OL} strokeWidth={3.5} />
    <path d="M-16 -200 L16 -200 L8 -60 L-8 -60 Z" fill={ribbon[1]} />
    <circle cx={0} cy={0} r={70} fill="#E2B13C" stroke={OL} strokeWidth={4} />
    <circle cx={0} cy={0} r={52} fill="none" stroke="#B8862A" strokeWidth={4} />
    {/* crossed khukuris */}
    <path d="M-30 28 Q-10 -10 26 -34 Q0 0 -22 34 Z M30 28 Q10 -10 -26 -34 Q0 0 22 34 Z" fill="#C9D0D6" stroke={OL} strokeWidth={2.5} />
  </g>
);

export const Crown: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-90 0 L-100 -110 L-50 -60 L-20 -140 L0 -70 L20 -140 L50 -60 L100 -110 L90 0 Z" fill="#E2B13C" stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-92} y={-20} width={184} height={30} rx={6} fill="#C9962C" stroke={OL} strokeWidth={3.5} />
    {[-50, 0, 50].map((cx, i) => <circle key={i} cx={cx} cy={-5} r={9} fill={i === 1 ? '#2E9A4A' : '#B3261E'} stroke={OL} strokeWidth={2} />)}
    {/* plume */}
    <path d="M0 -140 Q30 -220 90 -210 Q50 -190 40 -160 Q70 -180 110 -168 Q60 -150 6 -136 Z" fill="#3E6B3A" stroke={OL} strokeWidth={2.5} />
  </g>
);

export const GlassCase: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-210} y={0} width={420} height={260} fill="#5A3E26" stroke={OL} strokeWidth={4} />
    <rect x={-190} y={20} width={380} height={30} fill="#E2B13C" opacity={0.5} />
    <path d="M-180 0 L-180 -320 Q0 -380 180 -320 L180 0 Z" fill="#CFE8F2" opacity={0.25} stroke="#E8F4F8" strokeWidth={5} />
    <path d="M-140 -280 L-120 -60 M-100 -300 L-90 -200" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.6} />
  </g>
);

export const Flower: React.FC<{ x: number; y: number; c: string; at: number; s?: number; kind?: number }> = ({ x, y, c, at, s = 1, kind = 0 }) => {
  const f = useCurrentFrame();
  const g = interpolate(f, [at, at + 8], [0, 1], Easing.outBack);
  if (g <= 0) return null;
  const sway = Math.sin(onTwos(f) / 10 + x) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M0 0 Q${4 + sway} -50 ${sway} ${-100 * g}`} stroke="#3C7030" strokeWidth={6} fill="none" />
      <path d={`M0 -40 q-24 -6 -30 -24 q20 0 30 16`} fill="#4E8B3A" stroke={OL} strokeWidth={2} transform={`scale(${g})`} />
      <g transform={`translate(${sway} ${-100 * g}) scale(${g})`}>
        {[...Array(kind === 1 ? 8 : 6)].map((_, i) => (
          <ellipse key={i} cx={0} cy={-16} rx={kind === 1 ? 7 : 11} ry={kind === 1 ? 18 : 16} fill={c} stroke={OL} strokeWidth={2} transform={`rotate(${(i * 360) / (kind === 1 ? 8 : 6)})`} />
        ))}
        <circle r={9} fill="#F2C230" stroke={OL} strokeWidth={2} />
      </g>
    </g>
  );
};

/** Food: thali of dal bhat. */
export const DalBhat: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={200} ry={110} fill="#C9CED3" stroke={OL} strokeWidth={4} />
    <ellipse cx={0} cy={-6} rx={176} ry={92} fill="#DDE1E5" />
    <path d="M-110 10 Q-120 -60 -40 -70 Q30 -66 30 10 Q-40 40 -110 10 Z" fill="#FBFAF4" stroke={OL} strokeWidth={3} />
    {[...Array(12)].map((_, i) => <path key={i} d={`M${-90 + random('ri' + i) * 100} ${-40 + random('rj' + i) * 50} q4 -2 8 0`} stroke="#D8D2C2" strokeWidth={2} fill="none" />)}
    <g transform="translate(100 -30)">
      <ellipse rx={56} ry={30} fill="#B88A2E" stroke={OL} strokeWidth={3} />
      <ellipse rx={46} ry={22} fill="#E2B13C" />
    </g>
    <g transform="translate(70 50)">
      <ellipse rx={50} ry={24} fill="#B88A2E" stroke={OL} strokeWidth={3} />
      <ellipse rx={40} ry={17} fill="#4E8B3A" />
      <circle cx={-10} cy={-2} r={7} fill="#E07A5F" /><circle cx={12} cy={2} r={6} fill="#F2C230" />
    </g>
    <path d="M-150 40 Q-120 30 -100 52 Q-130 70 -150 40 Z" fill="#D1342E" stroke={OL} strokeWidth={2.5} />
  </g>
);

export const Momo: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={150} ry={70} fill="#F4F7FA" stroke={OL} strokeWidth={4} />
    {[[-60, -6], [0, -16], [60, -6], [-30, 30], [30, 30]].map(([mx, my], i) => (
      <g key={i} transform={`translate(${mx} ${my})`}>
        <path d="M-34 10 Q-36 -20 0 -34 Q36 -20 34 10 Q0 22 -34 10 Z" fill="#F7EBD3" stroke={OL} strokeWidth={3} />
        <path d="M0 -34 Q-6 -16 -14 -6 M0 -34 Q6 -16 14 -6 M0 -34 V-10" stroke="#D8C6A0" strokeWidth={2.5} fill="none" />
      </g>
    ))}
    <ellipse cx={120} cy={-40} rx={30} ry={16} fill="#D1342E" stroke={OL} strokeWidth={3} />
  </g>
);

export const SelRoti: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1].map((i) => (
      <g key={i} transform={`translate(${i * 40 - 20} ${i * -20})`}>
        <ellipse rx={90} ry={56} fill="#B5651D" stroke={OL} strokeWidth={4} />
        <ellipse rx={38} ry={22} fill="#1F3A33" stroke={OL} strokeWidth={3} />
        <path d="M-70 -20 Q-40 -44 0 -46" stroke="#D88A3A" strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
    ))}
  </g>
);

/** Constitution book, open. */
export const Book: React.FC<{ x: number; y: number; s?: number; title?: string }> = ({ x, y, s = 1, title = 'Constitution of Nepal' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0 L-230 -30 L-230 250 L0 280 Z" fill="#F4EEDD" stroke={OL} strokeWidth={4} />
    <path d="M0 0 L230 -30 L230 250 L0 280 Z" fill="#F4EEDD" stroke={OL} strokeWidth={4} />
    {[...Array(8)].map((_, i) => <path key={i} d={`M-200 ${30 + i * 26} L-30 ${42 + i * 26}`} stroke="#B5AA90" strokeWidth={3} />)}
    <text x={-118} y={10} textAnchor="middle" fontFamily="Hand" fontSize={28} fill="#8C1D18" transform="rotate(4 -118 10)">{title}</text>
  </g>
);

export const Icon: React.FC<{ kind: 'dam' | 'laptop' | 'book' | 'mountain' | 'tourist'; x: number; y: number; at: number; s?: number }> = ({ kind, x, y, at, s = 1 }) => {
  const f = useCurrentFrame();
  const k = popScale(f, at);
  if (k <= 0) return null;
  const bob = Math.sin(onTwos(f) / 9 + x) * 4;
  let el: React.ReactNode;
  if (kind === 'dam') el = (
    <g>
      <path d="M-70 40 L-50 -50 L50 -50 L70 40 Z" fill="#B9AE9C" stroke={OL} strokeWidth={3.5} />
      <path d="M-30 40 L-24 -10 L24 -10 L30 40 Z" fill="#7FB7C9" stroke={OL} strokeWidth={3} />
      <path d="M-14 -40 l10 -16 l-4 12 h10 l-12 18 l4 -12 Z" fill="#F2C230" stroke={OL} strokeWidth={2} />
    </g>
  );
  else if (kind === 'laptop') el = (
    <g>
      <rect x={-56} y={-54} width={112} height={74} rx={6} fill="#3A3F4A" stroke={OL} strokeWidth={3.5} />
      <rect x={-46} y={-44} width={92} height={54} fill="#7FB2D9" />
      <path d="M-74 20 L74 20 L84 36 L-84 36 Z" fill="#9AA1AC" stroke={OL} strokeWidth={3.5} />
    </g>
  );
  else if (kind === 'book') el = (
    <g>
      <path d="M0 -40 L-70 -50 L-70 30 L0 40 Z M0 -40 L70 -50 L70 30 L0 40 Z" fill="#F4EEDD" stroke={OL} strokeWidth={3.5} />
      <path d="M-56 -30 L-14 -24 M-56 -14 L-14 -8 M14 -24 L56 -30 M14 -8 L56 -14" stroke="#B5AA90" strokeWidth={3} />
      <path d="M-80 46 L-70 30 L0 40 L70 30 L80 46 L0 56 Z" fill="#8C1D18" stroke={OL} strokeWidth={3} />
    </g>
  );
  else if (kind === 'mountain') el = (
    <g>
      <path d="M-80 40 L-10 -60 L20 -20 L40 -40 L90 40 Z" fill="#7A7F8C" stroke={OL} strokeWidth={3.5} />
      <path d="M-28 -34 L-10 -60 L8 -36 L-4 -30 Z" fill="#F4F7FA" />
      <path d="M-10 -60 V-100 L20 -90 L-10 -80" stroke={OL} strokeWidth={3} fill="#DC143C" />
    </g>
  );
  else el = (
    <g>
      <rect x={-34} y={-50} width={68} height={86} rx={14} fill="#E07A5F" stroke={OL} strokeWidth={3.5} />
      <rect x={-22} y={-20} width={44} height={30} rx={6} fill="#C0634A" stroke={OL} strokeWidth={2.5} />
      <path d="M-20 -50 Q0 -74 20 -50" stroke={OL} strokeWidth={4} fill="none" />
    </g>
  );
  return <g transform={`translate(${x} ${y + bob}) scale(${k * s})`}>{el}</g>;
};
