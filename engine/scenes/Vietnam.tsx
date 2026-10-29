/**
 * Vietnam.tsx — scene library for the Vietnam War film (reusable by any Indochina / Cold War story).
 *
 * IndochinaMap: Vietnam, Laos and Cambodia traced from latitude/longitude (equirectangular,
 * cos-corrected), with real city positions. Local space: lon 100–110°E × lat 8–24°N →
 * about 461 × 800 units. Use vnXY(lon, lat) for any point.
 *
 * Props: Huey, B52, Jet, Destroyer, TorpedoBoat, Tank, Artillery, Bicycle, TVSet, Flags,
 * buildings (WhiteHouse, Capitol, Embassy, Palace, Citadel), backgrounds (Paddy, Village, Sea,
 * Valley, Tunnels, Rooftop, CarrierDeck, Plantation).
 */
import React from 'react';
import { useCurrentFrame, springPop, gravityDrop, random, onTwos, interpolate } from '../lib/core';
import { Layer } from '../fx/Camera';
import { OL, Tree, Hills, Cloud, Hut } from './Parts';

// ------------------------------------------------------------------ map
const K = 50, CX = 0.96;
export const vnXY = (lon: number, lat: number): [number, number] => [(lon - 100) * K * CX, (24 - lat) * K];
const path = (pts: number[][]) => 'M' + pts.map(([lo, la]) => vnXY(lo, la).map((v) => v.toFixed(1)).join(' ')).join(' L') + ' Z';
const VN_PTS = [
  [102.14, 22.4], [102.71, 22.71], [103.57, 22.65], [103.96, 22.5], [104.48, 22.82], [104.83, 23.12], [105.33, 23.39], [105.87, 22.93], [106.73, 22.84], [106.69, 22.29], [107.36, 21.67], [108.05, 21.55],
  [107.4, 21.2], [107.05, 20.95], [106.7, 20.8], [106.55, 20.45], [106.1, 19.95], [105.85, 19.6], [105.75, 18.8], [106.45, 18.05], [106.6, 17.48], [107.1, 16.85], [107.6, 16.48], [108.22, 16.07], [108.65, 15.5], [108.9, 15.1], [109.1, 14.3], [109.22, 13.77], [109.32, 13.05], [109.45, 12.6], [109.2, 12.25], [109.15, 11.9], [109.0, 11.55], [108.7, 11.2], [108.1, 10.93], [107.5, 10.5], [107.08, 10.35], [106.75, 10.15], [106.5, 9.75], [106.2, 9.3], [105.5, 8.75], [104.75, 8.6],
  [104.85, 9.3], [104.95, 9.9], [105.05, 10.0], [104.48, 10.38], [104.6, 10.6], [105.1, 10.9], [105.85, 10.85], [106.15, 11.05], [106.4, 11.7], [106.9, 11.95], [107.55, 12.35], [107.5, 13.0], [107.56, 14.69],
  [107.45, 15.2], [107.65, 15.6], [107.25, 16.2], [106.6, 16.62], [106.0, 17.3], [105.6, 17.9], [105.1, 18.6], [104.5, 19.05], [104.0, 19.25], [104.4, 19.7], [104.0, 20.0], [104.5, 20.4], [104.0, 20.95], [103.3, 20.8], [102.9, 21.4], [102.7, 21.9],
];
const LAOS_PTS = [
  [100.1, 20.4], [100.6, 21.5], [101.15, 21.45], [101.8, 22.45], [102.14, 22.4], [102.7, 21.9], [102.9, 21.4], [103.3, 20.8], [104.0, 20.95], [104.5, 20.4], [104.0, 20.0], [104.4, 19.7], [104.0, 19.25], [104.5, 19.05], [105.1, 18.6], [105.6, 17.9], [106.0, 17.3], [106.6, 16.62], [107.25, 16.2], [107.65, 15.6], [107.45, 15.2], [107.56, 14.69],
  [106.9, 14.35], [106.0, 14.35], [105.6, 14.1], [105.6, 15.0], [105.6, 15.6], [104.8, 16.5], [104.75, 17.4], [103.95, 18.3], [103.2, 18.15], [102.1, 17.95], [101.1, 17.5], [101.25, 18.6], [100.5, 19.5],
];
const CAMB_PTS = [
  [107.56, 14.69], [107.5, 13.0], [107.55, 12.35], [106.9, 11.95], [106.4, 11.7], [106.15, 11.05], [105.85, 10.85], [105.1, 10.9], [104.6, 10.6], [104.48, 10.38], [103.6, 10.5], [103.1, 11.1], [102.95, 11.65], [102.6, 12.2], [102.4, 13.5], [102.9, 14.2], [103.9, 14.35], [104.8, 14.4], [105.6, 14.1], [106.0, 14.35], [106.9, 14.35],
];
export const VN_PATH = path(VN_PTS), LAOS_PATH = path(LAOS_PTS), CAMB_PATH = path(CAMB_PTS);
const CHINA_PATH = path([[100.0, 24.6], [100.1, 20.4], [100.6, 21.5], [101.15, 21.45], [101.8, 22.45], [102.14, 22.4], [102.71, 22.71], [103.57, 22.65], [103.96, 22.5], [104.48, 22.82], [104.83, 23.12], [105.33, 23.39], [105.87, 22.93], [106.73, 22.84], [106.69, 22.29], [107.36, 21.67], [108.05, 21.55], [108.6, 21.7], [109.6, 21.5], [110.5, 21.2], [110.5, 24.6]]);
const THAI_PATH = path([[99.0, 21.0], [100.1, 20.4], [100.5, 19.5], [101.25, 18.6], [101.1, 17.5], [102.1, 17.95], [103.2, 18.15], [103.95, 18.3], [104.75, 17.4], [104.8, 16.5], [105.6, 15.6], [105.6, 14.1], [104.8, 14.4], [103.9, 14.35], [102.9, 14.2], [102.4, 13.5], [102.6, 12.2], [102.0, 12.3], [100.9, 13.4], [100.0, 13.3], [99.0, 14.0]]);
const HAINAN_PATH = path([[108.6, 19.2], [109.2, 18.3], [110.0, 18.2], [110.5, 18.8], [110.6, 19.8], [110.1, 20.1], [109.2, 19.9]]);
export const VCITIES: Record<string, [number, number]> = {
  Hanoi: vnXY(105.85, 21.03), Haiphong: vnXY(106.68, 20.86), Hue: vnXY(107.59, 16.46), 'Da Nang': vnXY(108.22, 16.05), Saigon: vnXY(106.7, 10.78),
  'Dien Bien Phu': vnXY(103.02, 21.39), 'Ia Drang': vnXY(107.7, 13.55), 'Khe Sanh': vnXY(106.73, 16.63), 'My Lai': vnXY(108.87, 15.18), 'Cu Chi': vnXY(106.49, 11.0),
  'Phnom Penh': vnXY(104.92, 11.56), Vientiane: vnXY(102.6, 17.97), 'Gulf of Tonkin': vnXY(107.4, 19.6), 'Ban Me Thuot': vnXY(108.05, 12.67), 'Quang Tri': vnXY(107.19, 16.75), 'Nha Trang': vnXY(109.19, 12.24), 'Tay Ninh': vnXY(106.1, 11.31),
};
export type VPin = { city: string; at: number; color?: string; label?: boolean };
export const VN_RED = '#C8102E', VN_YEL = '#FFCD00', US_BLUE = '#2E3A6A', FR_BLUE = '#2E4A9A';
/**
 * Indochina map. `split` colours the North/South at the 17th parallel; `fills` overrides country fills.
 */
export const IndochinaMap: React.FC<{ x: number; y: number; s?: number; fills?: { vn?: string; laos?: string; camb?: string; north?: string; south?: string }; split?: boolean; parallel?: number; neighbours?: boolean; pins?: VPin[]; labels?: boolean; children?: React.ReactNode; labelSize?: number; chinaFill?: string }> = ({ x, y, s = 1, fills = {}, split, parallel = 0, neighbours = true, pins = [], labels = false, children, labelSize = 30, chinaFill = '#C9C0AA' }) => {
  const f = useCurrentFrame();
  const vn = fills.vn ?? '#E8DCC0', laos = fills.laos ?? '#D8CCB0', camb = fills.camb ?? '#D8CCB0';
  const y17 = vnXY(0, 17.0)[1];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {neighbours && <><path d={CHINA_PATH} fill={chinaFill} stroke={OL} strokeWidth={3 / s} opacity={0.85} /><path d={THAI_PATH} fill="#CFC6AE" stroke={OL} strokeWidth={3 / s} opacity={0.7} /><path d={HAINAN_PATH} fill={chinaFill} stroke={OL} strokeWidth={3 / s} opacity={0.85} /></>}
      <path d={VN_PATH} fill="#1A1410" opacity={0.25} transform="translate(8 10)" />
      <path d={LAOS_PATH} fill={laos} stroke={OL} strokeWidth={4 / s} strokeLinejoin="round" />
      <path d={CAMB_PATH} fill={camb} stroke={OL} strokeWidth={4 / s} strokeLinejoin="round" />
      {split ? <>
        <clipPath id="vnN"><rect x={-100} y={-100} width={800} height={y17 + 100} /></clipPath>
        <clipPath id="vnS"><rect x={-100} y={y17} width={800} height={900} /></clipPath>
        <path d={VN_PATH} fill={fills.north ?? '#D9584A'} clipPath="url(#vnN)" />
        <path d={VN_PATH} fill={fills.south ?? '#E8C65A'} clipPath="url(#vnS)" />
        <path d={VN_PATH} fill="none" stroke={OL} strokeWidth={5 / s} strokeLinejoin="round" />
      </> : <path d={VN_PATH} fill={vn} stroke={OL} strokeWidth={5 / s} strokeLinejoin="round" />}
      {parallel > 0 && <path d={`M${vnXY(105.3, 17)[0]} ${y17} L${vnXY(107.9, 17)[0]} ${y17}`} stroke="#fff" strokeWidth={6 / s} strokeDasharray={`${14 / s} ${10 / s}`} opacity={parallel} />}
      {labels && <g fontFamily="TagBold" fontSize={labelSize / s} fill="#5A4A3A" textAnchor="middle" opacity={0.85}>
        <text x={vnXY(103.2, 19.3)[0]} y={vnXY(103.2, 19.3)[1]}>LAOS</text>
        <text x={vnXY(104.6, 12.8)[0]} y={vnXY(104.6, 12.8)[1]}>CAMBODIA</text>
        <text x={vnXY(104.5, 23.7)[0]} y={vnXY(104.5, 23.7)[1]}>CHINA</text>
      </g>}
      {children}
      {pins.map((p, i) => {
        if (f < p.at) return null;
        const [cx, cy] = VCITIES[p.city];
        const d = gravityDrop(f, p.at, { h: 220, g: 3.2, e: 0.35 });
        return <g key={i}>
          <ellipse cx={cx} cy={cy} rx={12 / s} ry={4 / s} fill="#000" opacity={0.25} />
          <g transform={`translate(${cx} ${cy + d.y}) scale(${d.sx / s} ${d.sy / s})`}><path d="M0 0 C-6 -14 -18 -22 -18 -36 A18 18 0 1 1 18 -36 C18 -22 6 -14 0 0 Z" fill={p.color ?? VN_RED} stroke={OL} strokeWidth={4} /><circle cy={-36} r={7} fill="#fff" /></g>
          {p.label !== false && springPop(f, p.at + 6) > 0 && <text x={cx + 22 / s} y={cy - 10 / s} fontFamily="TagBold" fontSize={labelSize / s} fill="#1A1410" stroke="#fff" strokeWidth={6 / s} style={{ paintOrder: 'stroke' }}>{p.city}</text>}
        </g>;
      })}
    </g>
  );
};

// ------------------------------------------------------------------ flags
export const Flag: React.FC<{ kind: 'vn' | 'svn' | 'us' | 'fr' | 'cn' | 'vc' | 'white'; x: number; y: number; s?: number; wave?: number; pole?: number }> = ({ kind, x, y, s = 1, wave = 0, pole = 300 }) => {
  const W = 210, H = 140;
  const body = (() => {
    switch (kind) {
      case 'vn': case 'cn': return <><rect width={W} height={H} fill={VN_RED} /><path d="M105 34 L114 61 L142 61 L119 77 L128 104 L105 88 L82 104 L91 77 L68 61 L96 61 Z" transform={kind === 'cn' ? 'translate(-70 -22) scale(0.6)' : ''} fill={VN_YEL} /></>;
      case 'vc': return <><rect width={W} height={H / 2} fill={VN_RED} /><rect y={H / 2} width={W} height={H / 2} fill="#2E6BC8" /><path d="M105 34 L114 61 L142 61 L119 77 L128 104 L105 88 L82 104 L91 77 L68 61 L96 61 Z" fill={VN_YEL} /></>;
      case 'svn': return <><rect width={W} height={H} fill={VN_YEL} />{[0, 1, 2].map((i) => <rect key={i} y={52 + i * 14} width={W} height={8} fill={VN_RED} />)}</>;
      case 'us': return <>{[...Array(13)].map((_, i) => <rect key={i} y={(i * H) / 13} width={W} height={H / 13} fill={i % 2 ? '#F4F7FA' : '#B22234'} />)}<rect width={W * 0.42} height={(H * 7) / 13} fill="#3C3B6E" />{[...Array(15)].map((_, i) => <circle key={i} cx={10 + (i % 5) * 16} cy={10 + Math.floor(i / 5) * 22} r={3} fill="#fff" />)}</>;
      case 'fr': return <>{['#2E4A9A', '#F4F7FA', '#C0392B'].map((c, i) => <rect key={i} x={(i * W) / 3} width={W / 3} height={H} fill={c} />)}</>;
      case 'white': return <rect width={W} height={H} fill="#F4F7FA" />;
    }
  })();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {pole > 0 && <path d={`M0 0 V${pole}`} stroke="#5A3A22" strokeWidth={10} />}
      <g transform={`translate(4 0) skewY(${wave})`}><g>{body}</g><rect width={W} height={H} fill="none" stroke={OL} strokeWidth={4} /></g>
    </g>
  );
};

// ------------------------------------------------------------------ vehicles
/** UH-1 "Huey" helicopter, side view. `rotor` = frame for blade animation. */
export const Huey: React.FC<{ x: number; y: number; s?: number; flip?: boolean; tilt?: number; color?: string; door?: boolean }> = ({ x, y, s = 1, flip, tilt = 0, color = '#5E6B45', door = true }) => {
  const f = useCurrentFrame();
  const b = Math.abs(Math.cos(f * 0.9)) * 220 + 30;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) rotate(${tilt})`}>
      <path d="M60 -10 L330 -30 L340 -60 L360 -60 L352 -18 L330 0 Z" fill={color} stroke={OL} strokeWidth={5} strokeLinejoin="round" />
      <path d="M-150 -40 Q-160 -110 -60 -118 L80 -118 Q120 -110 120 -60 L120 30 L-120 30 Q-160 20 -150 -40 Z" fill={color} stroke={OL} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-148 -50 Q-150 -100 -90 -104 L-60 -104 L-60 -30 L-140 -30 Z" fill="#9EC3D6" stroke={OL} strokeWidth={4} />
      {door && <rect x={-40} y={-100} width={90} height={110} fill="#2E3424" stroke={OL} strokeWidth={4} />}
      <rect x={-40} y={-150} width={70} height={34} rx={8} fill={color} stroke={OL} strokeWidth={5} />
      <rect x={-6} y={-170} width={10} height={22} fill={OL} />
      <ellipse cx={0} cy={-172} rx={b} ry={8} fill="#2A2A2A" opacity={0.55} />
      <path d="M-120 40 L100 40 M-100 30 L-110 40 M80 30 L90 40" stroke={OL} strokeWidth={7} strokeLinecap="round" />
      <circle cx={350} cy={-40} r={Math.abs(Math.sin(f)) * 26 + 6} fill="#2A2A2A" opacity={0.4} />
      <text x={190} y={-26} fontFamily="TagBold" fontSize={24} fill="#F4F7FA" opacity={0.8}>U.S. ARMY</text>
    </g>
  );
};
/** B-52 bomber, top-down silhouette pointing right. */
export const B52: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = '#4A5058' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-200 -14 L180 -14 Q230 0 180 14 L-200 14 Z" fill={color} stroke={OL} strokeWidth={4} />
    <path d="M40 -12 L-60 -230 L-100 -230 L-40 -12 Z M40 12 L-60 230 L-100 230 L-40 12 Z" fill={color} stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-170 -12 L-210 -80 L-230 -80 L-200 -12 Z M-170 12 L-210 80 L-230 80 L-200 12 Z" fill={color} stroke={OL} strokeWidth={4} />
    {[-160, -90, 90, 160].map((o) => <rect key={o} x={-30 - Math.abs(o) * 0.35} y={o - 8} width={40} height={16} rx={6} fill="#2A2E34" />)}
  </g>
);
/** Jet fighter, side view pointing right. */
export const Jet: React.FC<{ x: number; y: number; s?: number; color?: string; flip?: boolean }> = ({ x, y, s = 1, color = '#8A949E', flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M-160 0 L120 -10 Q170 0 120 10 L-160 14 Z" fill={color} stroke={OL} strokeWidth={4} />
    <path d="M10 0 L-60 -60 L-90 -60 L-40 0 Z M-130 -4 L-170 -60 L-185 -60 L-160 -2 Z" fill={color} stroke={OL} strokeWidth={4} />
    <path d="M80 -8 Q100 -26 120 -8 Z" fill="#9EC3D6" stroke={OL} strokeWidth={3} />
    <path d="M-170 6 L-220 6" stroke="#E8A94A" strokeWidth={8} opacity={0.8} />
  </g>
);
/** Destroyer, side view pointing right. */
export const Destroyer: React.FC<{ x: number; y: number; s?: number; flash?: number; name?: string; dark?: boolean }> = ({ x, y, s = 1, flash = 0, name, dark }) => {
  const hull = dark ? '#3A4250' : '#7A8592';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-380 -40 L360 -40 L320 30 L-350 30 Z" fill={hull} stroke={OL} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-200 -40 L-200 -100 L40 -100 L40 -40 Z M-120 -100 L-120 -160 L-20 -160 L-20 -100 Z" fill={dark ? '#4A5260' : '#9AA4AE'} stroke={OL} strokeWidth={5} />
      <path d="M-70 -160 V-230 M-100 -210 H-40" stroke={OL} strokeWidth={6} />
      <rect x={60} y={-80} width={50} height={40} fill={hull} stroke={OL} strokeWidth={4} /><path d="M110 -64 L180 -70" stroke={OL} strokeWidth={8} />
      <rect x={-300} y={-76} width={50} height={36} fill={hull} stroke={OL} strokeWidth={4} /><path d="M-300 -60 L-360 -66" stroke={OL} strokeWidth={8} />
      {flash > 0 && <circle cx={190} cy={-70} r={30 * flash} fill="#FFD84A" opacity={flash} />}
      {name && <text x={-60} y={10} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#F4F7FA">{name}</text>}
    </g>
  );
};
export const TorpedoBoat: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M-110 -16 L100 -16 L80 14 L-100 14 Z" fill="#5A6A5A" stroke={OL} strokeWidth={4} />
    <rect x={-40} y={-46} width={60} height={30} fill="#6A7A6A" stroke={OL} strokeWidth={4} />
    <path d="M100 0 Q140 -4 170 0" stroke="#E8F4F8" strokeWidth={6} fill="none" />
  </g>
);
/** T-54 style tank, side view pointing right. `turret` rotation deg. */
export const Tank: React.FC<{ x: number; y: number; s?: number; color?: string; flip?: boolean; num?: string; star?: boolean }> = ({ x, y, s = 1, color = '#5C6B3E', flip, num, star }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-200 -10 L190 -10 Q220 30 190 60 L-200 60 Q-230 30 -200 -10 Z" fill="#3A3A34" stroke={OL} strokeWidth={6} />
      {[...Array(7)].map((_, i) => <g key={i} transform={`translate(${-160 + i * 55} 28) rotate(${f * 10})`}><circle r={24} fill="#6A6A60" stroke={OL} strokeWidth={4} /><path d="M-20 0 H20" stroke={OL} strokeWidth={3} /></g>)}
      <path d="M-190 -10 L-160 -60 L170 -60 L195 -10 Z" fill={color} stroke={OL} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-90 -60 Q-80 -140 20 -140 Q100 -130 110 -60 Z" fill={color} stroke={OL} strokeWidth={6} />
      <rect x={100} y={-112} width={230} height={22} rx={6} fill={color} stroke={OL} strokeWidth={5} />
      {star && <path d="M0 -112 l7 18 h19 l-15 11 l6 18 l-17 -11 l-17 11 l6 -18 l-15 -11 h19 Z" fill={VN_RED} stroke={OL} strokeWidth={2} />}
      {num && <text x={-10} y={-80} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#F4F7FA">{num}</text>}
    </g>
  );
};
export const Artillery: React.FC<{ x: number; y: number; s?: number; angle?: number; flash?: number; flip?: boolean }> = ({ x, y, s = 1, angle = -25, flash = 0, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <g transform={`rotate(${angle})`}><rect x={-20} y={-14} width={200} height={28} rx={6} fill="#4E5A3A" stroke={OL} strokeWidth={5} />{flash > 0 && <circle cx={200} cy={0} r={34 * flash} fill="#FFD84A" opacity={flash} />}</g>
    <path d="M-60 40 L0 0 L60 40" stroke="#4E5A3A" strokeWidth={14} fill="none" strokeLinecap="round" />
    <circle cx={-30} cy={40} r={30} fill="#5A4A3A" stroke={OL} strokeWidth={5} /><circle cx={30} cy={40} r={30} fill="#5A4A3A" stroke={OL} strokeWidth={5} />
  </g>
);
/** A heavily loaded supply bicycle (Dien Bien Phu / Ho Chi Minh Trail). */
export const LoadedBike: React.FC<{ x: number; y: number; s?: number; roll?: number }> = ({ x, y, s = 1, roll = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-70, 70].map((cx) => <g key={cx} transform={`translate(${cx} 0) rotate(${roll})`}><circle r={44} fill="none" stroke={OL} strokeWidth={6} /><path d="M-40 0 H40 M0 -40 V40" stroke={OL} strokeWidth={3} /></g>)}
    <path d="M-70 0 L-10 -60 L60 -60 L70 0 M-10 -60 L-20 -90" stroke={OL} strokeWidth={7} fill="none" />
    <rect x={-70} y={-190} width={150} height={130} rx={10} fill="#8A6A3A" stroke={OL} strokeWidth={5} />
    <rect x={-60} y={-250} width={120} height={64} rx={10} fill="#6E7A4A" stroke={OL} strokeWidth={5} />
    <path d="M-70 -120 H80 M-70 -150 H80" stroke="#5A3A22" strokeWidth={5} />
  </g>
);
/** 1960s television set. Children render on the screen (local 0..300 × 0..220). */
export const TVSet: React.FC<{ x: number; y: number; s?: number; children?: React.ReactNode; glow?: boolean }> = ({ x, y, s = 1, children, glow = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-210} y={-170} width={420} height={320} rx={30} fill="#7A4E2B" stroke={OL} strokeWidth={8} />
    <clipPath id="tvclip"><rect x={-170} y={-140} width={300} height={240} rx={30} /></clipPath>
    <rect x={-170} y={-140} width={300} height={240} rx={30} fill={glow ? '#C9D6D0' : '#2A2E2A'} stroke={OL} strokeWidth={6} />
    <g clipPath="url(#tvclip)"><g transform="translate(-170 -140)">{children}</g></g>
    <circle cx={170} cy={-90} r={16} fill="#3A2A1A" stroke={OL} strokeWidth={4} /><circle cx={170} cy={-40} r={16} fill="#3A2A1A" stroke={OL} strokeWidth={4} />
    <path d="M-120 150 L-150 200 M120 150 L150 200" stroke={OL} strokeWidth={10} strokeLinecap="round" />
    <path d="M-40 -170 L-110 -260 M40 -170 L110 -260" stroke={OL} strokeWidth={5} />
  </g>
);

// ------------------------------------------------------------------ buildings
export const WhiteHouse: React.FC<{ x: number; y: number; s?: number; night?: boolean }> = ({ x, y, s = 1, night }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-420} y={-200} width={840} height={200} fill={night ? '#B8BCC8' : '#F4F2EC'} stroke={OL} strokeWidth={6} />
    <path d="M-140 -200 L0 -280 L140 -200 Z" fill={night ? '#B8BCC8' : '#F4F2EC'} stroke={OL} strokeWidth={6} />
    {[...Array(6)].map((_, i) => <rect key={i} x={-110 + i * 44} y={-200} width={16} height={200} fill="#E0DCD0" stroke={OL} strokeWidth={3} />)}
    {[...Array(10)].map((_, i) => i > 2 && i < 7 ? null : <rect key={i} x={-390 + i * 80} y={-160} width={40} height={60} fill={night ? '#E8C66A' : '#8A9AA8'} stroke={OL} strokeWidth={3} />)}
    <path d="M0 -280 V-330" stroke={OL} strokeWidth={4} /><rect x={2} y={-330} width={50} height={30} fill="#B22234" stroke={OL} strokeWidth={2} />
  </g>
);
export const Capitol: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-460} y={-160} width={920} height={160} fill="#F4F2EC" stroke={OL} strokeWidth={6} />
    <rect x={-160} y={-260} width={320} height={100} fill="#F4F2EC" stroke={OL} strokeWidth={6} />
    <path d="M-130 -260 Q0 -470 130 -260 Z" fill="#F4F2EC" stroke={OL} strokeWidth={6} />
    {[...Array(9)].map((_, i) => <rect key={i} x={-120 + i * 28} y={-250} width={10} height={90} fill="#E0DCD0" />)}
    <rect x={-10} y={-500} width={20} height={60} fill="#F4F2EC" stroke={OL} strokeWidth={4} />
    {[...Array(12)].map((_, i) => <rect key={i} x={-440 + i * 76} y={-130} width={30} height={60} fill="#8A9AA8" stroke={OL} strokeWidth={3} />)}
  </g>
);
/** US Embassy in Saigon: a tall concrete block with a grille facade, and its compound wall. */
export const Embassy: React.FC<{ x: number; y: number; s?: number; night?: boolean; breach?: number }> = ({ x, y, s = 1, night, breach = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-240} y={-520} width={480} height={520} fill={night ? '#9AA0AA' : '#E8E4D8'} stroke={OL} strokeWidth={6} />
    {[...Array(48)].map((_, i) => <rect key={i} x={-220 + (i % 8) * 56} y={-500 + Math.floor(i / 8) * 80} width={44} height={64} rx={20} fill={night ? '#5A6070' : '#C9C4B8'} stroke={OL} strokeWidth={2} />)}
    <path d="M-560 0 V-130 H560 V0" fill="none" stroke={OL} strokeWidth={0} />
    <rect x={-560} y={-130} width={1120} height={130} fill={night ? '#7A8090' : '#D4CCBE'} stroke={OL} strokeWidth={5} />
    {breach > 0 && <path d={`M300 -130 L${300 + 30 * breach} -60 L${280 - 20 * breach} 0 L${400 + 20 * breach} 0 L${380 - 10 * breach} -70 L420 -130 Z`} fill={night ? '#1C2333' : '#3A3A40'} stroke={OL} strokeWidth={4} />}
  </g>
);
/** Independence Palace, Saigon, with its gate (panels swing open by `gateOpen` 0..1, or `crash` frame). */
export const Palace: React.FC<{ x: number; y: number; s?: number; crash?: number; flag?: 'svn' | 'vc' | 'none' }> = ({ x, y, s = 1, crash = 99999, flag = 'svn' }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f - crash);
  const panel = (sd: number) => {
    if (t <= 0) return `translate(${sd * 110} 0)`;
    const ang = Math.min(80, t * t * 0.8);
    return `translate(${sd * 110 + sd * Math.min(60, t * 4)} 0) rotate(${sd * ang} ${sd * 110} 0)`;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-600} y={-520} width={1200} height={300} fill="#E8E4D8" stroke={OL} strokeWidth={6} />
      {[...Array(30)].map((_, i) => <rect key={i} x={-580 + (i % 15) * 78} y={-500 + Math.floor(i / 15) * 140} width={12} height={120} fill="#C9C4B8" />)}
      <rect x={-640} y={-540} width={1280} height={26} fill="#C9C4B8" stroke={OL} strokeWidth={5} />
      {flag !== 'none' && <Flag kind={flag} x={0} y={-760} s={0.8} pole={280} wave={Math.sin(f / 8) * 3} />}
      <rect x={-700} y={-220} width={1400} height={220} fill="#7A9A5A" />
      <rect x={-700} y={-60} width={480} height={60} fill="#D4CCBE" stroke={OL} strokeWidth={4} />
      <rect x={220} y={-60} width={480} height={60} fill="#D4CCBE" stroke={OL} strokeWidth={4} />
      {[-1, 1].map((sd) => <g key={sd} transform={panel(sd)}><rect x={sd < 0 ? -110 : -110} y={-160} width={220} height={160} fill="none" stroke="#2A2A2A" strokeWidth={8} />{[...Array(9)].map((_, i) => <rect key={i} x={-104 + i * 25} y={-156} width={6} height={152} fill="#2A2A2A" />)}</g>)}
      <rect x={-232} y={-190} width={22} height={190} fill="#D4CCBE" stroke={OL} strokeWidth={4} /><rect x={210} y={-190} width={22} height={190} fill="#D4CCBE" stroke={OL} strokeWidth={4} />
    </g>
  );
};
/** Hue's Citadel wall and gate tower. */
export const Citadel: React.FC<{ x: number; y: number; s?: number; smoke?: boolean }> = ({ x, y, s = 1, smoke }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-900} y={-220} width={1800} height={220} fill="#8A7A62" stroke={OL} strokeWidth={6} />
      {[...Array(30)].map((_, i) => <rect key={i} x={-900 + i * 60} y={-250} width={36} height={30} fill="#8A7A62" stroke={OL} strokeWidth={3} />)}
      <rect x={-160} y={-420} width={320} height={200} fill="#B0463A" stroke={OL} strokeWidth={6} />
      <path d="M-220 -420 Q0 -520 220 -420 Z" fill="#E2B13C" stroke={OL} strokeWidth={6} />
      <path d="M-60 0 V-140 Q0 -200 60 -140 V0 Z" fill="#2A1B12" />
      {smoke && [...Array(6)].map((_, i) => { const t = (f + i * 30) % 180; return <circle key={i} cx={-500 + i * 200 + t * 0.4} cy={-300 - t * 1.4} r={40 + t * 0.5} fill="#5A5A60" opacity={0.5 * (1 - t / 180)} />; })}
    </g>
  );
};

// ------------------------------------------------------------------ backgrounds
/** Rice paddies with water reflections and distant palms. */
export const Paddy: React.FC<{ dusk?: boolean }> = ({ dusk }) => {
  const f = onTwos(useCurrentFrame(), 2);
  return (
    <>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={dusk ? '#E8A070' : '#A8D4E6'} /><Cloud x={300} y={160} s={1.1} /><Cloud x={1400} y={120} s={0.9} /></Layer>
      <Layer depth={0.3}><Hills y={520} fill="#5E8E4A" amp={50} seed="pd" />{[...Array(8)].map((_, i) => <g key={i} transform={`translate(${-60 + i * 280} 520)`}><path d="M0 0 V-170" stroke="#6A4A2A" strokeWidth={10} /><path d="M0 -170 q-80 -10 -110 40 M0 -170 q80 -10 110 40 M0 -170 q-50 -60 -100 -40 M0 -170 q50 -60 100 -40" stroke="#3E7A3A" strokeWidth={18} fill="none" strokeLinecap="round" /></g>)}</Layer>
      <Layer depth={0.6}>
        <rect x={-200} y={560} width={2400} height={800} fill="#8AB860" />
        {[...Array(5)].map((_, r) => <path key={r} d={`M-200 ${600 + r * 90} H2200`} stroke="#6E9A48" strokeWidth={8} />)}
        {[...Array(4)].map((_, r) => <rect key={'w' + r} x={-200} y={610 + r * 90} width={2400} height={50} fill="#9CC8D8" opacity={0.45} />)}
        {[...Array(60)].map((_, i) => <path key={i} d={`M${-180 + (i % 15) * 160} ${640 + Math.floor(i / 15) * 90} l-6 -26 M${-170 + (i % 15) * 160} ${640 + Math.floor(i / 15) * 90} l6 -24`} stroke="#4E8A3A" strokeWidth={5} />)}
        {[...Array(6)].map((_, i) => <path key={'r' + i} d={`M${100 + i * 330 + (f % 40)} ${660 + (i % 3) * 90} h36`} stroke="#E8F4F8" strokeWidth={4} />)}
      </Layer>
    </>
  );
};
/** A village of thatched huts among palms. `empty` for the restrained My Lai scene. */
export const Village: React.FC<{ dawn?: boolean }> = ({ dawn }) => (
  <>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={dawn ? '#D8B8A0' : '#A8D4E6'} /></Layer>
    <Layer depth={0.4}><Hills y={540} fill={dawn ? '#7A8A6A' : '#5E8E4A'} amp={40} seed="vl" /></Layer>
    <Layer depth={0.7}>
      <rect x={-200} y={640} width={2400} height={700} fill={dawn ? '#9A9A6A' : '#A8B868'} />
      {[...Array(5)].map((_, i) => <g key={i} transform={`translate(${140 + i * 400} ${700 + (i % 2) * 30})`}><rect x={-110} y={-120} width={220} height={120} fill="#B8935A" stroke={OL} strokeWidth={5} /><path d="M-150 -110 L0 -230 L150 -110 Z" fill="#C9A85A" stroke={OL} strokeWidth={5} /><rect x={-24} y={-80} width={48} height={80} fill="#4A3020" /></g>)}
      {[...Array(6)].map((_, i) => <g key={'p' + i} transform={`translate(${-20 + i * 380} 660)`}><path d="M0 0 V-240" stroke="#6A4A2A" strokeWidth={10} /><path d="M0 -240 q-80 -10 -110 40 M0 -240 q80 -10 110 40 M0 -240 q-50 -60 -100 -40 M0 -240 q50 -60 100 -40" stroke="#3E7A3A" strokeWidth={18} fill="none" strokeLinecap="round" /></g>)}
    </Layer>
  </>
);
/** Open sea, day or a dark stormy night. */
export const Sea: React.FC<{ night?: boolean; rough?: number; horizon?: number }> = ({ night, rough = 0, horizon = 520 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={night ? '#0E1422' : '#9CC8E0'} />{!night && <><Cloud x={300} y={150} /><Cloud x={1500} y={110} s={0.8} /></>}</Layer>
      <Layer depth={0.6}>
        <rect x={-200} y={horizon} width={2400} height={900} fill={night ? '#16223A' : '#3E7AA8'} />
        {[...Array(14)].map((_, r) => <path key={r} d={`M-200 ${horizon + 30 + r * 40} ${[...Array(24)].map((_, i) => `Q${-150 + i * 100} ${horizon + 30 + r * 40 - (8 + rough * 30) * Math.sin(f / 6 + i + r)} ${-100 + i * 100} ${horizon + 30 + r * 40}`).join(' ')}`} stroke={night ? '#2A3A5A' : '#6AA0C8'} strokeWidth={4} fill="none" />)}
      </Layer>
    </>
  );
};
/** Dien Bien Phu: a valley floor with a fortified base and an airstrip, ringed by hills. */
export const Valley: React.FC<{ guns?: number; craters?: number; surrender?: boolean }> = ({ guns = 0, craters = 0, surrender }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#B8CCD8" /></Layer>
      <Layer depth={0.3}>
        <path d="M-200 520 L100 260 L380 420 L700 220 L1000 380 L1300 200 L1600 400 L1900 240 L2200 480 L2200 1300 L-200 1300 Z" fill="#4E7A3E" stroke={OL} strokeWidth={5} />
        {[...Array(12)].map((_, i) => <Tree key={i} x={-120 + i * 200} y={420 + (i % 3) * 30} s={0.6} c="#2F5E2E" c2="#244A24" />)}
        {[...Array(guns)].map((_, i) => { const gx = [180, 520, 820, 1150, 1450, 1760][i % 6], gy = [400, 330, 340, 300, 360, 380][i % 6]; const fl = Math.max(0, 1 - ((f + i * 13) % 40) / 8); return <g key={i}><Artillery x={gx} y={gy} s={0.32} angle={gx < 960 ? 20 : 160} flash={fl} /></g>; })}
      </Layer>
      <Layer depth={0.6}>
        <path d="M-200 640 Q960 560 2200 640 L2200 1300 L-200 1300 Z" fill="#9AA86A" stroke={OL} strokeWidth={4} />
        <rect x={300} y={700} width={1300} height={50} fill="#8A7A62" stroke={OL} strokeWidth={4} />
        {[...Array(12)].map((_, i) => <rect key={i} x={340 + i * 105} y={720} width={50} height={8} fill="#F4F2EC" />)}
        {[...Array(craters)].map((_, i) => <ellipse key={i} cx={360 + random('cr' + i) * 1200} cy={725 + (random('cs' + i) - 0.5) * 40} rx={40} ry={14} fill="#5A4A3A" />)}
        {[...Array(5)].map((_, i) => <g key={i} transform={`translate(${520 + i * 220} 820)`}><path d="M-80 0 Q0 -60 80 0 Z" fill="#7A6A4A" stroke={OL} strokeWidth={4} /><rect x={-24} y={-20} width={48} height={20} fill="#2A1B12" /></g>)}
        {surrender && <Flag kind="white" x={960} y={560} s={0.7} wave={Math.sin(f / 8) * 4} />}
        <Flag kind={surrender ? 'vn' : 'fr'} x={surrender ? 1300 : 960} y={surrender ? 560 : 560} s={0.6} wave={Math.sin(f / 7) * 3} />
      </Layer>
    </>
  );
};
/** Cross-section of the Cu Chi tunnels: jungle floor above, rooms below. */
export const Tunnels: React.FC<{ lamp?: number; rooms?: number }> = ({ lamp = -1, rooms = 3 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={500} fill="#A8D4E6" /><rect x={-200} y={300} width={2400} height={1100} fill="#6A4A2E" /></Layer>
      <Layer depth={0.5}>
        {[...Array(9)].map((_, i) => <Tree key={i} x={-60 + i * 250} y={300} s={0.7} c="#3E7A3A" c2="#2E5E2E" />)}
        <rect x={-200} y={290} width={2400} height={20} fill="#4E7A3A" />
        {[...Array(40)].map((_, i) => <circle key={i} cx={random('ts' + i) * 2000 - 40} cy={340 + random('tu' + i) * 500} r={4 + random('tv' + i) * 6} fill="#5A3E26" />)}
        <path d="M200 310 V420 Q200 460 260 460 H1700 Q1760 460 1760 520 V700 H400 Q340 700 340 760 V820 H1500" stroke="#2A1B12" strokeWidth={70} fill="none" strokeLinejoin="round" opacity={0.9} />
        {rooms >= 1 && <g transform="translate(700 460)"><rect x={-150} y={-60} width={300} height={120} rx={50} fill="#2A1B12" /><text y={10} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#E8C66A">KITCHEN</text></g>}
        {rooms >= 2 && <g transform="translate(1200 700)"><rect x={-150} y={-60} width={300} height={120} rx={50} fill="#2A1B12" /><text y={10} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#E8C66A">MEDICAL</text></g>}
        {rooms >= 3 && <g transform="translate(700 820)"><rect x={-150} y={-60} width={300} height={120} rx={50} fill="#2A1B12" /><text y={10} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#E8C66A">COMMAND</text></g>}
        {lamp >= 0 && <path d={`M${200 + lamp} 460 l300 -60 l0 120 Z`} fill="#FFF2B0" opacity={0.25 + 0.05 * Math.sin(f / 3)} />}
      </Layer>
    </>
  );
};
/** A Saigon rooftop with a ladder up to a small helipad-like stair housing (the famous evacuation image, drawn generically). */
export const Rooftop: React.FC<{ dusk?: boolean }> = ({ dusk = true }) => (
  <>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={dusk ? '#E8A070' : '#A8D4E6'} /><circle cx={1600} cy={300} r={90} fill="#F4D49A" opacity={0.8} /></Layer>
    <Layer depth={0.4}>{[...Array(8)].map((_, i) => <rect key={i} x={-100 + i * 280} y={460 + (i % 3) * 50} width={220} height={700} fill={dusk ? '#9A7A6A' : '#C9C4BA'} stroke={OL} strokeWidth={4} />)}</Layer>
    <Layer depth={0.8}>
      <rect x={300} y={620} width={1320} height={700} fill="#D4CCBE" stroke={OL} strokeWidth={6} />
      <rect x={760} y={420} width={400} height={200} fill="#C9C4B8" stroke={OL} strokeWidth={6} />
      <rect x={700} y={400} width={520} height={24} fill="#B8B0A0" stroke={OL} strokeWidth={4} />
      <g stroke="#3A3A3A" strokeWidth={8}><path d="M1080 620 L1130 410 M1140 620 L1190 410" />{[...Array(6)].map((_, i) => <path key={i} d={`M${1084 + i * 8} ${600 - i * 34} H${1144 + i * 8}`} />)}</g>
    </Layer>
  </>
);
/** Carrier / amphibious ship deck at sea, seen from the side. */
export const CarrierDeck: React.FC = () => (
  <>
    <Sea horizon={460} />
    <Layer depth={0.9}>
      <path d="M-300 640 L2200 640 L2100 900 L-200 900 Z" fill="#6A7480" stroke={OL} strokeWidth={6} />
      <rect x={-300} y={600} width={2500} height={44} fill="#4A525C" stroke={OL} strokeWidth={5} />
      {[...Array(10)].map((_, i) => <rect key={i} x={-200 + i * 240} y={618} width={120} height={8} fill="#E8E8E0" />)}
      <rect x={1500} y={380} width={160} height={220} fill="#7A8490" stroke={OL} strokeWidth={5} /><rect x={1540} y={300} width={80} height={80} fill="#7A8490" stroke={OL} strokeWidth={5} />
    </Layer>
  </>
);
/** Rubber plantation rows with tapped trees. */
export const Plantation: React.FC = () => (
  <>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#B8D4C0" /></Layer>
    <Layer depth={0.5}>
      <rect x={-200} y={600} width={2400} height={800} fill="#8A7A4A" />
      {[...Array(3)].map((_, r) => [...Array(9)].map((_, i) => { const x = -120 + i * 260 + r * 60, y = 600 + r * 70, sc = 0.7 + r * 0.25; return <g key={r + '-' + i} transform={`translate(${x} ${y}) scale(${sc})`}><rect x={-14} y={-260} width={28} height={260} fill="#7A5A3A" stroke={OL} strokeWidth={4} /><circle cy={-300} r={110} fill={['#4E7A3A', '#3E6A2E', '#5A8A44'][r]} stroke={OL} strokeWidth={4} /><path d="M-14 -120 L14 -100" stroke="#F4F2EC" strokeWidth={5} /><rect x={-10} y={-96} width={20} height={20} fill="#F4F2EC" stroke={OL} strokeWidth={2} /></g>; }))}
    </Layer>
  </>
);
