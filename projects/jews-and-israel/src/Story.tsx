/** Story scenes: a place (backdrop), people who walk / march / gather / argue, things that move, and only tiny labels for dates and names. */
import React from 'react';
import type { Part, PartArgs } from './Cuts';
import { cuts } from './Cuts';
import { Chibi } from '@engine/characters/Chibi';
import { Flame } from '@engine/scenes/Parts';
import { OL } from '@engine/scenes/Parts';
import { Horse } from '@engine/scenes/India';
import { Txt, Pop } from './Kit2';
import { GOLD, RED, INK } from './Kit';
import { W } from '@engine/cast/Wardrobe';
import { interpolate, Easing, random } from '@engine/lib/core';
import { CW, ICONS } from './Dsl';
import { STUNT, type StuntName } from './Stunts';

export const GY = 880; // ground line for feet
const ST = { stroke: OL, strokeWidth: 5, strokeLinejoin: 'round' as const };
const Sky: React.FC<{ a: string; b: string }> = ({ a, b }) => {
  const id = 'sk' + a.slice(1) + b.slice(1);
  return <><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs><rect x={-400} y={-300} width={2800} height={1500} fill={`url(#${id})`} /></>;
};
const Ground: React.FC<{ c: string; y?: number }> = ({ c, y = GY - 40 }) => <><rect x={-400} y={y} width={2800} height={800} fill={c} /><line x1={-400} x2={2400} y1={y} y2={y} stroke={OL} strokeWidth={4} /></>;
const Sun: React.FC<{ x?: number; y?: number; r?: number; c?: string }> = ({ x = 1500, y = 260, r = 90, c = '#FFE9A8' }) => <><circle cx={x} cy={y} r={r * 2.2} fill={c} opacity={0.25} /><circle cx={x} cy={y} r={r} fill={c} /></>;
const Dunes: React.FC<{ c1?: string; c2?: string }> = ({ c1 = '#E6C88C', c2 = '#D9B878' }) => <><path d={`M-400 ${GY - 120} Q0 ${GY - 230} 420 ${GY - 120} T1240 ${GY - 130} T2400 ${GY - 140} V${GY} H-400 Z`} fill={c2} stroke={OL} strokeWidth={3} /><path d={`M-400 ${GY - 60} Q300 ${GY - 150} 900 ${GY - 70} T2400 ${GY - 80} V${GY} H-400 Z`} fill={c1} stroke={OL} strokeWidth={3} /></>;
const Palm: React.FC<{ x: number; s?: number }> = ({ x, s = 1 }) => <g transform={`translate(${x} ${GY - 40}) scale(${s})`}><path d="M0 0 Q14 -120 -6 -250" fill="none" stroke="#6B4A2B" strokeWidth={22} strokeLinecap="round" />{[-70, -30, 20, 60].map((a, i) => <path key={i} d={`M-6 -250 q${a} -60 ${a * 1.8} -10`} fill="none" stroke="#4F8A3A" strokeWidth={16} strokeLinecap="round" />)}</g>;
const House: React.FC<{ x: number; w?: number; h?: number; c?: string; roof?: string; flat?: boolean; win?: number }> = ({ x, w = 200, h = 220, c = '#E8D9AE', roof = '#B5653A', flat = false, win = 2 }) => (
  <g transform={`translate(${x} ${GY - 40})`}>
    <rect x={-w / 2} y={-h} width={w} height={h} fill={c} {...ST} />
    {flat ? <rect x={-w / 2 - 8} y={-h - 16} width={w + 16} height={18} fill="#CDBB94" {...ST} /> : <path d={`M${-w / 2 - 12} ${-h} L0 ${-h - w * 0.45} L${w / 2 + 12} ${-h} Z`} fill={roof} {...ST} />}
    {[...Array(win)].map((_, i) => <rect key={i} x={-w / 2 + 28 + i * ((w - 56 - 34) / Math.max(1, win - 1 || 1))} y={-h + 50} width={34} height={46} fill="#6E8AA6" stroke={OL} strokeWidth={3} />)}
    <rect x={-22} y={-76} width={44} height={76} fill="#6B4A2B" stroke={OL} strokeWidth={3} />
  </g>
);
const Dome: React.FC<{ x: number; s?: number; c?: string }> = ({ x, s = 1, c = '#D9B24A' }) => <g transform={`translate(${x} ${GY - 40}) scale(${s})`}><rect x={-90} y={-170} width={180} height={170} fill="#E8D9AE" {...ST} /><path d="M-90 -170 Q-90 -330 0 -330 Q90 -330 90 -170 Z" fill={c} {...ST} /><line y1={-330} y2={-380} stroke={OL} strokeWidth={5} /></g>;
const Tower: React.FC<{ x: number; h?: number; c?: string }> = ({ x, h = 360, c = '#CDBB94' }) => <g transform={`translate(${x} ${GY - 40})`}><rect x={-50} y={-h} width={100} height={h} fill={c} {...ST} />{[-50, -17, 17].map((d) => <rect key={d} x={d} y={-h - 30} width={33} height={32} fill={c} {...ST} strokeWidth={4} />)}<rect x={-14} y={-h + 60} width={28} height={50} rx={14} fill="#4A3A2A" /></g>;
const Wall: React.FC<{ y?: number; c?: string; x0?: number; x1?: number }> = ({ y = GY - 40, c = '#D9C79A', x0 = -400, x1 = 2400 }) => <g><rect x={x0} y={y - 180} width={x1 - x0} height={180} fill={c} {...ST} />{[...Array(Math.ceil((x1 - x0) / 70))].map((_, i) => <rect key={i} x={x0 + i * 70} y={y - 210} width={38} height={32} fill={c} {...ST} strokeWidth={4} />)}</g>;
const Ziggurat: React.FC<{ x: number; s?: number }> = ({ x, s = 1 }) => <g transform={`translate(${x} ${GY - 40}) scale(${s})`}>{[0, 1, 2, 3].map((i) => <rect key={i} x={-200 + i * 40} y={-70 * (i + 1)} width={400 - i * 80} height={70} fill={['#B5865A', '#C49A6A', '#D3AC7C', '#4A78B8'][i]} {...ST} />)}<path d="M-30 0 V-60 Q0 -90 30 -60 V0 Z" fill="#3A5A8A" stroke={OL} strokeWidth={4} /></g>;
const Column: React.FC<{ x: number; h?: number }> = ({ x, h = 380 }) => <g transform={`translate(${x} ${GY - 40})`}><rect x={-34} y={-h} width={68} height={h} fill="#EFE8D8" {...ST} />{[-14, 0, 14].map((d) => <line key={d} x1={d} x2={d} y1={-h + 20} y2={-14} stroke="#C9C0AA" strokeWidth={3} />)}<rect x={-48} y={-h - 22} width={96} height={24} fill="#E4DAC4" {...ST} /><rect x={-48} y={-16} width={96} height={16} fill="#E4DAC4" {...ST} /></g>;
const Tent: React.FC<{ x: number; s?: number; c?: string }> = ({ x, s = 1, c = '#C9B98A' }) => <g transform={`translate(${x} ${GY - 40}) scale(${s})`}><path d="M-150 0 L0 -170 L150 0 Z" fill={c} {...ST} /><path d="M0 -170 L-34 0 H34 Z" fill="#6B5A3A" stroke={OL} strokeWidth={4} /></g>;
const Cloud: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = '#fff' }) => <g transform={`translate(${x} ${y}) scale(${s})`} opacity={0.9}><ellipse rx={90} ry={34} fill={c} /><ellipse cx={-50} cy={8} rx={60} ry={28} fill={c} /><ellipse cx={55} cy={10} rx={62} ry={26} fill={c} /></g>;
const Smoke: React.FC<{ x: number; y: number; t: number; n?: number; c?: string }> = ({ x, y, t, n = 5, c = '#5A5A62' }) => <>{[...Array(n)].map((_, i) => { const k = ((t + i * 14) % 70) / 70; return <circle key={i} cx={x + Math.sin(k * 6 + i) * 24 + k * 40} cy={y - k * 300} r={26 + k * 50} fill={c} opacity={0.5 * (1 - k)} />; })}</>;
const Stars: React.FC = () => <>{[...Array(40)].map((_, i) => <circle key={i} cx={random('st' + i) * 2000 - 40} cy={random('sy' + i) * 520} r={1.5 + random('sr' + i) * 2.5} fill="#F4ECD8" opacity={0.7} />)}<circle cx={1560} cy={200} r={70} fill="#F4ECD8" /><circle cx={1590} cy={186} r={64} fill="#1B2330" /></>;
const Fence: React.FC<{ x0?: number; x1?: number }> = ({ x0 = -400, x1 = 2400 }) => <g>{[...Array(Math.ceil((x1 - x0) / 60))].map((_, i) => <rect key={i} x={x0 + i * 60} y={GY - 260} width={20} height={220} fill="#8A8F96" {...ST} strokeWidth={3} />)}<rect x={x0} y={GY - 230} width={x1 - x0} height={14} fill="#6A7078" {...ST} strokeWidth={3} /><rect x={x0} y={GY - 130} width={x1 - x0} height={14} fill="#6A7078" {...ST} strokeWidth={3} /></g>;
const Field: React.FC<{ c1?: string; c2?: string }> = ({ c1 = '#8DBA5A', c2 = '#6E9B3C' }) => <>{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M-400 ${GY - 30 + i * 22} H2400`} stroke={i % 2 ? c1 : c2} strokeWidth={14} />)}</>;
const Mount: React.FC<{ c?: string; y?: number }> = ({ c = '#B89A6A', y = GY - 40 }) => <><path d={`M-400 ${y} L-100 ${y - 330} L200 ${y - 140} L560 ${y - 420} L920 ${y - 160} L1240 ${y - 360} L1660 ${y - 140} L2000 ${y - 380} L2400 ${y} Z`} fill={c} {...ST} strokeWidth={4} /></>;
const Skyline: React.FC<{ c?: string; y?: number }> = ({ c = '#8A93A0', y = GY - 40 }) => <>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => { const h = 200 + random('sk' + i) * 300; return <g key={i}><rect x={-300 + i * 230} y={y - h} width={180} height={h} fill={c} {...ST} strokeWidth={4} />{[...Array(Math.floor(h / 70))].map((_, j) => <rect key={j} x={-280 + i * 230} y={y - h + 20 + j * 60} width={26} height={30} fill="#CFE0EE" />)}</g>; })}</>;

/* ---------- backdrops ---------- */
export const BG: Record<string, (t: number) => React.ReactNode> = {
  desert: () => <><Sky a="#F7DDB0" b="#FBF0D4" /><Sun /><Dunes /><Ground c="#E6C88C" /></>,
  oasis: () => <><Sky a="#F7DDB0" b="#FBF0D4" /><Sun /><Dunes /><Ground c="#E6C88C" /><Palm x={260} s={1.1} /><Palm x={1700} s={1.3} /><Palm x={1620} s={0.9} /></>,
  hills: () => <><Sky a="#BFE0F2" b="#F4F1DC" /><Sun x={300} /><Mount c="#C9B07A" /><Ground c="#B9C77A" /><House x={1500} w={160} h={150} flat /><House x={1680} w={140} h={130} flat /></>,
  jerusalem: () => <><Sky a="#BFE0F2" b="#F8F0D8" /><Cloud x={400} y={180} /><Cloud x={1400} y={250} s={1.2} /><Wall /><Dome x={900} s={1.2} /><Tower x={420} /><Tower x={1500} h={300} /><House x={160} flat w={220} h={180} /><House x={1760} flat w={240} h={200} /><Ground c="#D9C79A" /></>,
  temple: () => <><Sky a="#BFE0F2" b="#F8F0D8" /><Cloud x={500} y={200} /><Ground c="#D9C79A" /><g transform={`translate(960 ${GY - 40})`}><rect x={-420} y={-30} width={840} height={30} fill="#CDBB94" {...ST} />{[-330, -220, -110, 0, 110, 220, 330].map((x) => <rect key={x} x={x - 20} y={-300} width={40} height={270} fill="#EFE3C4" {...ST} strokeWidth={4} />)}<path d="M-450 -300 H450 L0 -450 Z" fill="#E2D2A8" {...ST} /><rect x={-80} y={-120} width={160} height={90} fill="#3A2A1A" {...ST} strokeWidth={4} /></g></>,
  babylon: () => <><Sky a="#9CCBEA" b="#F4E8C4" /><Sun x={300} y={220} /><Ziggurat x={1500} s={1.15} /><Wall c="#C49A6A" /><Ground c="#C9A66B" /></>,
  rome: () => <><Sky a="#CFE3F2" b="#F8EFD6" /><Cloud x={300} y={190} /><Column x={200} /><Column x={560} /><Column x={1360} /><Column x={1720} /><path d={`M560 ${GY - 420} H1360 V${GY - 40} H1240 V${GY - 280} Q960 ${GY - 460} 680 ${GY - 280} V${GY - 40} H560 Z`} fill="#E4DAC4" {...ST} /><Ground c="#D6CDB8" /></>,
  camp: () => <><Sky a="#BFE0F2" b="#F4F1DC" /><Sun x={1600} /><Dunes /><Ground c="#E6C88C" /><Tent x={300} s={1.1} /><Tent x={1500} s={1.2} c="#B8A878" /><Tent x={1750} s={0.9} /></>,
  field: () => <><Sky a="#BFE0F2" b="#F4F1DC" /><Cloud x={500} y={200} /><Sun x={1600} /><Hills3 /><Ground c="#8DBA5A" /><Field /></>,
  town: () => <><Sky a="#C9D6E3" b="#EEE9DC" /><Cloud x={300} y={200} c="#F4F4F4" /><Cloud x={1300} y={160} s={1.2} c="#F4F4F4" /><House x={250} w={240} h={280} c="#D9B88A" /><House x={640} w={220} h={220} c="#C9A27A" roof="#8A4A3A" /><g transform={`translate(1500 ${GY - 40})`}><rect x={-100} y={-300} width={200} height={300} fill="#CFC8B8" {...ST} /><path d="M-110 -300 L0 -560 L110 -300 Z" fill="#7A5A4A" {...ST} /><rect x={-24} y={-110} width={48} height={110} rx={24} fill="#4A3A2A" /></g><House x={1000} w={200} h={250} c="#B8C8A8" roof="#6B4A3A" /><House x={1860} w={220} h={230} c="#D9C89A" /><Ground c="#A8A59A" /></>,
  snow: () => <><Sky a="#C9D3DE" b="#EEF1F4" /><House x={260} w={240} h={190} c="#B8855A" roof="#F4F7FA" /><House x={760} w={200} h={170} c="#A97A50" roof="#F4F7FA" /><House x={1300} w={240} h={200} c="#B8855A" roof="#F4F7FA" /><House x={1780} w={200} h={180} c="#A97A50" roof="#F4F7FA" /><Ground c="#F4F7FA" />{[...Array(30)].map((_, i) => <circle key={i} cx={random('sn' + i) * 2000} cy={random('sm' + i) * 800} r={4} fill="#fff" />)}</>,
  spain: () => <><Sky a="#9CCBEA" b="#F8E8C4" /><Sun x={300} /><Ground c="#D6B878" />{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${60 + i * 400} ${GY - 40} V${GY - 330} Q${260 + i * 400} ${GY - 520} ${460 + i * 400} ${GY - 330} V${GY - 40}`} fill="none" stroke="#B5653A" strokeWidth={34} />)}<rect x={-400} y={GY - 640} width={2800} height={120} fill="#E2B07A" {...ST} /></>,
  sea: (t) => <><Sky a="#BFE0F2" b="#F4F1DC" /><Cloud x={400} y={200} /><Cloud x={1500} y={260} /><rect x={-400} y={GY - 260} width={2800} height={900} fill="#5A94BE" /><rect x={-400} y={GY - 260} width={2800} height={900} fill="#4F86AE" opacity={0.5} />{[...Array(10)].map((_, i) => <path key={i} d={`M${-100 + i * 260 + Math.sin(t / 12 + i) * 20} ${GY - 160 + (i % 3) * 70} q40 -22 80 0 t80 0`} fill="none" stroke="#E4F1FA" strokeWidth={6} strokeLinecap="round" />)}</>,
  port: () => <><Sky a="#BFE0F2" b="#F4F1DC" /><rect x={-400} y={GY - 150} width={2800} height={800} fill="#5A94BE" /><rect x={-400} y={GY - 60} width={2800} height={160} fill="#9A8A70" {...ST} /><House x={300} w={200} h={200} c="#D9B88A" /><House x={640} w={180} h={170} c="#C9A27A" roof="#8A4A3A" /></>,
  hall: () => <><rect x={-400} y={-300} width={2800} height={1400} fill="#6E5A44" /><rect x={-400} y={GY - 60} width={2800} height={400} fill="#8A6A44" /><g>{[0, 1, 2, 3].map((i) => <rect key={i} x={120 + i * 480} y={140} width={260} height={520} rx={12} fill="#8A7458" {...ST} />)}</g></>,
  battle: (t) => <><Sky a="#C9B79A" b="#EAD9B8" /><Mount c="#A98A5A" /><Ground c="#C9A66B" /><Smoke x={300} y={GY - 100} t={t} /><Smoke x={1600} y={GY - 100} t={t + 20} /></>,
  night: () => <><rect x={-400} y={-300} width={2800} height={1500} fill="#1B2330" /><Stars /><Skyline c="#2A3340" /><Ground c="#161C26" /></>,
  nightvillage: () => <><rect x={-400} y={-300} width={2800} height={1500} fill="#1B2330" /><Stars /><House x={300} w={220} h={200} c="#3A3F4D" roof="#2A2E3A" /><House x={1450} w={240} h={230} c="#3A3F4D" roof="#2A2E3A" /><Ground c="#161C26" /></>,
  modern: () => <><Sky a="#BFE0F2" b="#EEF1F4" /><Cloud x={500} y={200} /><Skyline c="#9AA6B4" /><Ground c="#B0B4BA" /></>,
  sinai: () => <><Sky a="#F7DDB0" b="#FBF0D4" /><Sun x={400} /><Mount c="#C79A62" /><Ground c="#E0C08A" /></>,
  white: () => <><Sky a="#CFE3F2" b="#F8EFD6" /><Ground c="#D6CDB8" /></>,
};
const Hills3: React.FC = () => <><path d={`M-400 ${GY - 160} Q200 ${GY - 330} 700 ${GY - 160} T1700 ${GY - 180} T2400 ${GY - 160} V${GY} H-400 Z`} fill="#9CC57A" {...ST} strokeWidth={4} /></>;

/* ---------- actors ---------- */
export type Who = any; // a costume from CW or Wardrobe
type Act = (a: PartArgs) => React.ReactNode;
const sk = (n: number) => 'ac' + n;
/** One person, standing. */
export const P1 = (who: Who, x: number, o: { pose?: string; expr?: string; flip?: boolean; s?: number; item?: string; at?: number; y?: number; legs?: string; seed?: string } = {}): Act => (a) => (
  <Chibi x={x} y={(o.y ?? GY)} s={o.s ?? 1.75} {...who} item={o.item ?? who.item} pose={o.pose ?? 'idle'} expr={o.expr ?? 'normal'} flip={o.flip} legs={(o.legs as any) ?? 'stand'} seed={o.seed ?? 'p' + x} talking={[]} />
);
/** People walking across. dir=1 left to right. */
export const Walk = (who: Who | Who[], x0: number, x1: number, o: { n?: number; gap?: number; s?: number; expr?: string; pose?: string; item?: string; y?: number; len?: number; flip?: boolean } = {}): Act => (a) => {
  const ws = Array.isArray(who) ? who : [who]; const n = o.n ?? ws.length; const g = interpolate(a.t, [0, o.len ?? 75], [0, 1]);
  return <>{[...Array(n)].map((_, i) => { const w = ws[i % ws.length]; const x = x0 + (x1 - x0) * g - i * (o.gap ?? 150) * Math.sign(x1 - x0); return <Chibi key={i} x={x} y={(o.y ?? GY) + (i % 2) * 14} s={o.s ?? 1.6} {...w} item={o.item ?? w.item} pose={o.pose ?? 'idle'} expr={o.expr ?? 'normal'} flip={o.flip ?? x1 < x0} legs="walk" seed={'w' + i + x0} talking={[]} delay={i * 4} />; })}</>;
};
/** A standing crowd. */
export const Crowd = (who: Who | Who[], x: number, o: { n?: number; gap?: number; s?: number; pose?: string; expr?: string; y?: number; flip?: boolean; item?: string } = {}): Act => () => {
  const ws = Array.isArray(who) ? who : [who]; const n = o.n ?? 5;
  return <>{[...Array(n)].map((_, i) => <Chibi key={i} x={x + (i - (n - 1) / 2) * (o.gap ?? 175)} y={(o.y ?? GY) + (i % 2) * 16 - 8} s={(o.s ?? 1.5) * (i % 2 ? 0.94 : 1)} {...ws[i % ws.length]} item={o.item ?? ws[i % ws.length].item} pose={o.pose ?? 'idle'} expr={o.expr ?? 'normal'} flip={o.flip} seed={'c' + i + x} talking={[]} delay={i * 5} />)}</>;
};
/** Soldiers marching. */
export const March = (who: Who, x0: number, x1: number, o: { n?: number; gap?: number; s?: number; len?: number; item?: string } = {}): Act => (a) => {
  const n = o.n ?? 4; const g = interpolate(a.t, [0, o.len ?? 75], [0, 1]);
  return <>{[...Array(n)].map((_, i) => <Chibi key={i} x={x0 + (x1 - x0) * g - i * (o.gap ?? 140) * Math.sign(x1 - x0)} y={GY + (i % 2) * 12} s={o.s ?? 1.6} {...who} item={o.item ?? who.item} pose="hold" expr="determined" flip={x1 < x0} legs="march" seed={'m' + i} talking={[]} delay={i * 3} />)}</>;
};
/** A ship drifting across with a bob. */
export const Boat = (x0: number, x1: number, y = GY - 200, s = 1.6, len = 90): Act => (a) => {
  const g = interpolate(a.t, [0, len], [0, 1]); const x = x0 + (x1 - x0) * g; const bob = Math.sin(a.t / 9) * 8; const tilt = Math.sin(a.t / 11) * 2.5;
  return <g transform={`translate(${x} ${y + bob}) rotate(${tilt}) scale(${s})${x1 < x0 ? ' scale(-1 1)' : ''}`}>{ICONS.ship}</g>;
};
/** Flames and smoke on a spot. */
export const Burn = (x: number, y = GY - 60, s = 1.6, at = 0): Act => (a) => {
  const k = Math.min(1, Math.max(0, (a.t - at) / 20));
  return k > 0 ? <g opacity={k}><Smoke x={x} y={y - 120} t={a.t} />{[-80, -30, 30, 80].map((d, i) => <Flame key={i} x={x + d * s} y={y - (i % 2) * 20} s={s * (0.8 + (i % 2) * 0.3)} seed={'b' + i + x} />)}</g> : null;
};
/** A big prop (icon) at a place. */
export const Prop = (icon: string, x: number, y: number, s = 1.2, at = 0): Act => (a) => { const k = Math.max(0, a.pk(at)); return k > 0 ? <g transform={`translate(${x} ${y}) scale(${s * k})`}>{ICONS[icon]}</g> : null; };
/** Rider on a horse crossing. */
export const Ride = (who: Who, x0: number, x1: number, o: { s?: number; len?: number; gait?: 'walk' | 'gallop'; y?: number } = {}): Act => (a) => {
  const g = interpolate(a.t, [0, o.len ?? 75], [0, 1]); const x = x0 + (x1 - x0) * g;
  return <Horse x={x} y={o.y ?? GY} s={o.s ?? 1.3} flip={x1 < x0} gait={o.gait ?? 'walk'} />;
};
/** Small chip with a date or a name (the only text a story scene carries). */
export const Chip = (text: string, x = 960, y = 200, bg = '#26343A', c = '#F4ECD8', at = 6): Act => (a) => {
  const k = Math.max(0, a.pk(at)); const w = text.length * 22 + 50;
  return k > 0 ? <g transform={`translate(${x} ${y}) scale(${k})`}><rect x={-w / 2} y={-30} width={w} height={60} rx={14} fill={bg} stroke={OL} strokeWidth={4} /><Txt y={14} t={text} size={36} c={c} /></g> : null;
};
/** A name tag over a person. */
export const Name = (text: string, x: number, y = GY - 560, at = 8): Act => Chip(text, x, y, '#F4ECD8', INK, at);
/** A document or letter that pops in. */
export const Doc = (x: number, y: number, s = 1, at = 4, lines = 5): Act => (a) => { const k = Math.max(0, a.pk(at)); return k > 0 ? <g transform={`translate(${x} ${y}) rotate(-3) scale(${s * k})`}><rect x={-120} y={-150} width={240} height={300} rx={8} fill="#F4ECD8" {...ST} />{[...Array(lines)].map((_, i) => <line key={i} x1={-84} x2={84 - (i === lines - 1 ? 60 : 0)} y1={-100 + i * 44} y2={-100 + i * 44} stroke="#7A6A4A" strokeWidth={6} strokeLinecap="round" />)}<circle cx={70} cy={110} r={22} fill={RED} stroke={OL} strokeWidth={4} /></g> : null; };

/** Build a story part: backdrop + actors. */
export const SC = (bg: string, acts: Act[], o: { z?: [number, number]; focus?: [number, number]; nar?: Part['nar']; stunt?: StuntName } = {}): Part => ({
  at: 0, z: o.z, focus: o.focus, nar: o.nar, narNode: o.stunt ? STUNT[o.stunt] : undefined,
  draw: (a) => <>{BG[bg]?.(a.t)}{acts.map((f, i) => <g key={i}>{f(a)}</g>)}</>,
});
export const story = (...parts: Part[]) => ({ s }: any) => cuts(parts.map((p, i) => ({ ...p, at: Math.round((i * s.dur) / parts.length) })))({ s });
export { CW, W };
