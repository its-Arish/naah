/** Props for Acts 2–9: Alamo, cannon, camp, Capitol, derrick, party tent, the one-party trap board, opinion boards. */
import React from 'react';
import { useCurrentFrame, interpolate, Easing, springPop, random } from '@engine/lib/core';
import { projectile } from '@engine/lib/physics';
import { OL } from '@engine/scenes/Parts';
import type { Shot } from '@engine/types';
import { Tag, Switcher, RED, BLUE, GOLD, INK, PAPER } from './Kit';
import { cue, type Cue } from './Gen';

export const Alamo: React.FC<{ x: number; y: number; s?: number; dark?: boolean }> = ({ x, y, s = 1, dark }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-260 0 V-180 H-110 Q-80 -300 0 -310 Q80 -300 110 -180 H260 V0 Z" fill={dark ? '#7C7466' : '#E7D7B5'} stroke={OL} strokeWidth={7} strokeLinejoin="round" />
    <path d="M-50 0 V-100 Q0 -150 50 -100 V0" fill="#5B4632" stroke={OL} strokeWidth={6} />
    {[-180, 180].map((wx) => <rect key={wx} x={wx - 22} y={-140} width={44} height={56} rx={20} fill="#5B4632" stroke={OL} strokeWidth={4} />)}
  </g>
);
export const Cannon: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = -8 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform={`rotate(${rot})`}><rect x={-20} y={-70} width={170} height={44} rx={20} fill="#3A3A40" stroke={OL} strokeWidth={6} /><circle cx={150} cy={-48} r={12} fill="#1A1A1A" /></g>
    <circle cx={0} cy={-24} r={34} fill="#8B5A2B" stroke={OL} strokeWidth={6} /><circle cx={0} cy={-24} r={8} fill={OL} />
  </g>
);
export const ComeAndTakeIt: React.FC<{ x: number; y: number; s?: number; wave?: number }> = ({ x, y, s = 1, wave = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <line x1={0} y1={0} x2={0} y2={-420} stroke={OL} strokeWidth={10} />
    <path d={`M5 -415 Q130 ${-430 + wave * 12} 260 -415 V-245 Q130 ${-260 + wave * 12} 5 -245 Z`} fill="#F4F4EE" stroke={OL} strokeWidth={6} />
    <g transform="translate(130 -350) scale(0.45)"><Cannon x={-60} y={40} rot={0} /></g>
    <polygon points="130,-400 136,-386 150,-386 139,-378 143,-364 130,-372 117,-364 121,-378 110,-386 124,-386" fill={OL} />
    <text x={132} y={-262} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill={OL}>COME AND TAKE IT</text>
  </g>
);
export const Tent: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = '#E8DCC0' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-110 0 L0 -150 L110 0 Z" fill={c} stroke={OL} strokeWidth={6} strokeLinejoin="round" /><path d="M0 -150 L-24 0 H24 Z" fill="#6B5A45" /></g>
);
export const Capitol: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-360} y={-200} width={720} height={200} fill="#E9D3B0" stroke={OL} strokeWidth={6} />
    {[...Array(9)].map((_, i) => <rect key={i} x={-330 + i * 80} y={-170} width={26} height={150} fill="#D8C29C" stroke={OL} strokeWidth={3} />)}
    <rect x={-160} y={-290} width={320} height={90} fill="#E9D3B0" stroke={OL} strokeWidth={6} />
    <path d="M-120 -290 Q0 -440 120 -290 Z" fill="#E9D3B0" stroke={OL} strokeWidth={6} />
    <rect x={-8} y={-470} width={16} height={60} fill={OL} /><polygon points="0,-500 6,-484 22,-484 9,-474 14,-458 0,-468 -14,-458 -9,-474 -22,-484 -6,-484" fill={GOLD} stroke={OL} strokeWidth={2} />
    <path d="M-40 0 V-80 Q0 -110 40 -80 V0" fill="#6B4E33" stroke={OL} strokeWidth={5} />
  </g>
);
export const Court: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-380 -260 L0 -380 L380 -260 Z" fill="#F1EDE4" stroke={OL} strokeWidth={6} strokeLinejoin="round" />
    <rect x={-380} y={-260} width={760} height={30} fill="#F1EDE4" stroke={OL} strokeWidth={5} />
    {[...Array(8)].map((_, i) => <rect key={i} x={-350 + i * 96} y={-230} width={40} height={200} fill="#F7F4EE" stroke={OL} strokeWidth={4} />)}
    <rect x={-420} y={-30} width={840} height={30} fill="#E4DED2" stroke={OL} strokeWidth={5} />
  </g>
);
/** oil derrick with an optional gusher (droplets fly on ballistic arcs) */
export const Derrick: React.FC<{ x: number; y: number; s?: number; gush?: number }> = ({ x, y, s = 1, gush = -1 }) => {
  const f = useCurrentFrame();
  const t = f - gush;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {gush >= 0 && t >= 0 && <>
        <path d={`M-14 -330 Q0 ${-330 - Math.min(1, t / 10) * 380} 14 -330`} stroke="#1A1410" strokeWidth={Math.min(36, 10 + t)} fill="none" strokeLinecap="round" />
        {[...Array(26)].map((_, i) => { const st = gush + 6 + (i % 13) * 2; const vx = (random('ox' + i) - 0.5) * 16; const p = projectile(f, st, [0, -700], [vx, -6 - random('oy' + i) * 6], 0.6); return f >= st ? <circle key={i} cx={p.x} cy={Math.min(p.y, 0)} r={9} fill="#1A1410" /> : null; })}
      </>}
      <path d="M-110 0 L-20 -340 H20 L110 0" fill="none" stroke={OL} strokeWidth={10} strokeLinejoin="round" />
      {[0.25, 0.5, 0.75].map((k) => <line key={k} x1={-110 + 90 * k} y1={-340 * k} x2={110 - 90 * k} y2={-340 * k} stroke={OL} strokeWidth={6} />)}
      <path d="M-70 -55 L70 -170 M70 -55 L-70 -170" stroke={OL} strokeWidth={5} />
    </g>
  );
};
/** the one big party as a circus tent, which cracks down the middle when it splits */
export const PartyTent: React.FC<{ x: number; y: number; s?: number; c?: string; label?: string; split?: number; wings?: number; shake?: number }> = ({ x, y, s = 1, c = BLUE, label = 'DEMOCRATS', split = 0, wings = 0, shake = 0 }) => {
  const f = useCurrentFrame();
  const sx = shake > 0 ? Math.sin(f * 1.7) * 6 * shake : 0;
  const half = (side: -1 | 1) => (
    <g transform={`translate(${side * split * 70 + sx} ${split * 10}) rotate(${side * split * 6})`}>
      <path d={side < 0 ? 'M0 -330 L-300 0 H0 Z' : 'M0 -330 L300 0 H0 Z'} fill={c} stroke={OL} strokeWidth={7} strokeLinejoin="round" />
      {[0.33, 0.66].map((k) => <path key={k} d={`M0 -330 L${side * 300 * k} 0`} stroke="#ffffff55" strokeWidth={10} />)}
      {wings > 0 && <Tag x={side * 150} y={-80} text={side < 0 ? 'LIBERAL' : 'CONSERVATIVE'} size={30} k={wings} bg={side < 0 ? '#BFD4EE' : '#E8D6B0'} />}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {half(-1)}{half(1)}
      <line x1={0} y1={-330} x2={0} y2={-400} stroke={OL} strokeWidth={6} /><path d="M0 -400 L50 -385 L0 -370 Z" fill={GOLD} stroke={OL} strokeWidth={3} />
      {split < 0.2 && <Tag x={0} y={40} text={label} size={40} />}
    </g>
  );
};
/** the one-party trap: three stages; `lit` stages are highlighted, `on` = current */
export const TrapBoard: React.FC<{ x?: number; y?: number; s?: number; on: number; at?: number; done?: number }> = ({ x = 780, y = 420, s = 1, on, at = 6, done = 0 }) => {
  const f = useCurrentFrame();
  const st = [['1', 'THE PARTY SPLITS'], ['2', 'A WEAK NOMINEE'], ['3', 'THE SWITCHERS WALK']];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <text y={-230} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill={GOLD}>THE ONE-PARTY TRAP</text>
      {st.map(([n, t], i) => {
        const cur = i + 1 === on, lit = i + 1 <= Math.max(on, done);
        const k = cur ? 1 + 0.06 * springPop(f, at) : 1;
        return <g key={n} transform={`translate(${(i - 1) * 390} 0) scale(${k})`} opacity={lit ? 1 : 0.4}>
          <rect x={-170} y={-150} width={340} height={300} rx={22} fill={cur ? PAPER : '#D8D0BE'} stroke={cur ? RED : OL} strokeWidth={cur ? 10 : 6} />
          <text y={-40} textAnchor="middle" fontFamily="TagBold" fontSize={110} fill={cur ? RED : INK}>{n}</text>
          <text y={70} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill={INK}>{t}</text>
          {i + 1 <= done && !cur && <path d="M-40 110 L-10 135 L45 90" stroke="#2E7D4F" strokeWidth={12} fill="none" strokeLinecap="round" />}
        </g>;
      })}
    </g>
  );
};
/** a big wall clock / stopwatch reading `min` minutes */
export const Stopwatch: React.FC<{ x: number; y: number; s?: number; p: number; label?: string }> = ({ x, y, s = 1, p, label }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-20} y={-200} width={40} height={30} rx={6} fill="#B0B4BA" stroke={OL} strokeWidth={5} />
    <circle r={170} fill="#F7F4EE" stroke={OL} strokeWidth={10} />
    <path d={`M0 0 L0 -150 A150 150 0 ${p > 0.5 ? 1 : 0} 1 ${150 * Math.sin(p * 2 * Math.PI)} ${-150 * Math.cos(p * 2 * Math.PI)} Z`} fill={RED} opacity={0.35} />
    <line x1={0} y1={0} x2={130 * Math.sin(p * 2 * Math.PI)} y2={-130 * Math.cos(p * 2 * Math.PI)} stroke={OL} strokeWidth={10} strokeLinecap="round" />
    <circle r={12} fill={OL} />
    {label && <text y={240} textAnchor="middle" fontFamily="TagBold" fontSize={56} fill={GOLD}>{label}</text>}
  </g>
);
/** an opinion board: title + bullet tags revealed one by one up to `n` */
export const Board: React.FC<{ x: number; y: number; title: string; items: string[]; n: number; at?: number; c?: string; dim?: boolean }> = ({ x, y, title, items, n, at = 6, c = '#3A5A8A', dim }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y})`} opacity={dim ? 0.35 : 1}>
      <rect x={-330} y={-260} width={660} height={560} rx={20} fill={PAPER} stroke={OL} strokeWidth={7} />
      <rect x={-330} y={-260} width={660} height={90} rx={20} fill={c} stroke={OL} strokeWidth={7} />
      <text y={-200} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff">{title}</text>
      {items.slice(0, n).map((t, i) => <g key={i} transform={`translate(-290 ${-110 + i * 90}) scale(${i === n - 1 ? springPop(f, at) : 1})`}><circle cx={14} cy={-12} r={10} fill={c} /><text x={40} y={0} fontFamily="Serif" fontSize={36} fill={INK}>{t}</text></g>)}
    </g>
  );
};
/** a ballot paper with ticked boxes */
export const Ballot: React.FC<{ x: number; y: number; s?: number; title: string; rows: [string, boolean?][]; at?: number }> = ({ x, y, s = 1, title, rows, at = 10 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(-2)`}>
      <rect x={-330} y={-260} width={660} height={160 + rows.length * 100} rx={10} fill="#FBF8F0" stroke={OL} strokeWidth={6} />
      <text y={-190} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill={INK}>{title}</text>
      {rows.map(([t, tick], i) => <g key={i} transform={`translate(-280 ${-110 + i * 100})`}>
        <rect x={0} y={-40} width={56} height={56} fill="#fff" stroke={OL} strokeWidth={5} />
        {tick && f > at + i * 8 && <path d="M8 -12 L24 6 L52 -36" stroke={RED} strokeWidth={9} fill="none" strokeLinecap="round" />}
        <text x={84} y={4} fontFamily="Serif" fontSize={44} fill={INK}>{t}</text>
      </g>)}
    </g>
  );
};
export const walkX = (f: number, a: number, b: number, d: number) => interpolate(f, [0, d], [a, b]);
export { Switcher, cue, type Cue, type Shot };
