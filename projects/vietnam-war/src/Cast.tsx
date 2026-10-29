/**
 * Cast and shared helpers for the Vietnam film.
 * Colour language: America = navy #2E3A6A, the North / Viet Minh = red #C8102E, the South = yellow #E8C23A,
 * France = blue #2E4A9A, money = green #2E8B57, truth/lies = paper #F4ECD8 vs grey.
 */
import React from 'react';
import { useCurrentFrame, interpolate, Easing, spring, springPop } from '@engine/lib/core';
import { DropHtml } from '@engine/kit';
import { OL } from '@engine/scenes/Parts';

export const USA = '#2E3A6A', NORTH = '#C8102E', SOUTH = '#E8C23A', FRANCE = '#2E4A9A', MONEY = '#2E8B57', GOLD = '#E2B13C';
const SKIN_VN = '#E8C49A', SKIN_US = '#F3D2B0', SKIN_US2 = '#8D5524';

export const HO_OLD = { outfit: { top: '#C9B98A', bottom: '#C9B98A' }, hat: 'parted', hatColor: '#E8E4DA', beard: true, beardColor: '#E8E4DA', skin: SKIN_VN };
export const HO_YOUNG = { outfit: { top: '#3A3A48', bottom: '#3A3A48', belt: '#F4F7FA' }, hat: 'parted', hatColor: '#1A1410', skin: SKIN_VN };
export const GIAP = { outfit: { top: '#5E6B45', bottom: '#5E6B45', belt: '#3A2A1A' }, hat: 'pith', hatColor: '#6E7A4A', skin: SKIN_VN };
export const NVA = { outfit: { top: '#5E6B45', bottom: '#5E6B45', belt: '#3A2A1A' }, hat: 'pith', hatColor: '#6E7A4A', item: 'musket', skin: SKIN_VN };
export const VC = { outfit: { top: '#1E1E24', bottom: '#1E1E24', belt: '#5A3A22' }, hat: 'nonla', item: 'musket', skin: SKIN_VN };
export const FARMER = (c = '#6A5A45') => ({ outfit: { top: c, bottom: '#4A3A2A' }, hat: 'nonla', skin: SKIN_VN });
export const VILLAGER = (c = '#8A6A4A', i = 0) => ({ outfit: { top: c, bottom: ['#3A3A48', '#4A3A2A', '#2A2A2A'][i % 3] }, hat: i % 3 === 0 ? 'nonla' : i % 3 === 1 ? 'bun' : 'hair', hair: '#1A1410', skin: SKIN_VN });
export const SVN = { outfit: { top: '#6E7A4A', bottom: '#6E7A4A' }, hat: 'helmet', hatColor: '#5E6B45', item: 'musket', skin: SKIN_VN };
export const GI = (i = 0) => ({ outfit: { top: '#6A7448', bottom: '#5E6B45', belt: '#3A3A2A' }, hat: 'helmet', hatColor: '#5E6B45', item: 'musket', skin: i % 3 === 2 ? SKIN_US2 : SKIN_US });
export const FR_SOLDIER = { outfit: { top: '#B8A878', bottom: '#A89868', belt: '#5A3A22' }, hat: 'kepi', hatColor: '#2E4A9A', item: 'musket', skin: SKIN_US };
export const FR_OFFICIAL = { outfit: { top: '#F4F2EC', bottom: '#F4F2EC', belt: '#C9C4B8' }, hat: 'pith', hatColor: '#F4F2EC', mustache: true, skin: SKIN_US };
export const FR_OFFICER = { outfit: { top: '#B8A878', bottom: '#A89868', trim: GOLD }, hat: 'kepi', hatColor: '#C0392B', mustache: true, skin: SKIN_US };
export const SUIT = (c = '#2A2E3A', hair = '#7A7A7A', extra: any = {}) => ({ outfit: { top: c, bottom: c, belt: '#F4F7FA' }, hat: 'hair', hair, hatColor: hair, skin: SKIN_US, ...extra });
export const EISENHOWER = SUIT('#5A5A64', '#E8E4DA', { hat: 'bald' });
export const JFK = SUIT('#2A2E3A', '#8A5A2A');
export const LBJ = SUIT('#3A3A48', '#9A9A9A');
export const NIXON = SUIT('#1E2E4A', '#2A2A2A');
export const DIEM = { outfit: { top: '#F4F2EC', bottom: '#F4F2EC' }, hat: 'parted', hatColor: '#1A1410', skin: SKIN_VN };
export const THIEU = { outfit: { top: '#5E6B45', bottom: '#5E6B45', trim: GOLD }, hat: 'parted', hatColor: '#1A1410', skin: SKIN_VN };
export const ANCHOR = SUIT('#3A3A48', '#5A5A5A', { mustache: true });
export const KISSINGER = SUIT('#2A2E3A', '#5A5A5A', { glasses: true });
export const LE_DUC_THO = { outfit: { top: '#8A8A84', bottom: '#8A8A84' }, hat: 'parted', hatColor: '#E8E4DA', skin: SKIN_VN };
export const MONK = { outfit: { top: '#D9862A', robe: true, sash: '#B8601A' }, hat: 'bald', skin: SKIN_VN };
export const PILOT = { outfit: { top: '#6A7448', bottom: '#6A7448' }, hat: 'helmet', hatColor: '#4E5A3A', skin: SKIN_US };
export const OFFICIAL_US = (i = 0) => SUIT(['#2A2E3A', '#3A3A48', '#4A4A54'][i % 3], ['#5A5A5A', '#3A2416', '#9A9A9A'][i % 3]);
export const PROTESTER = (c: string, i = 0, text = '') => ({ outfit: { top: c, bottom: '#2A3A5A' }, hat: ['hair', 'bun', 'hair'][i % 3], hair: ['#C9A66B', '#3A2416', '#7A3A1A'][i % 3], hatColor: ['#C9A66B', '#3A2416', '#7A3A1A'][i % 3], skin: [SKIN_US, SKIN_US2, SKIN_US][i % 3], item: text ? `placard:${text}` : undefined });

// ------------------------------------------------------------------ helpers
export const Stamp: React.FC<{ at: number; left: number; top: number; text: string; color?: string; rot?: number; size?: number }> = ({ at, left, top, text, color = '#B3261E', rot = -6, size = 58 }) => (
  <DropHtml at={at} left={left} top={top} h={360}><div style={{ fontFamily: 'TagBold', fontSize: size, color, border: `7px solid ${color}`, padding: '4px 22px', borderRadius: 10, transform: `rotate(${rot}deg)`, background: 'rgba(255,255,255,0.92)', whiteSpace: 'nowrap' }}>{text}</div></DropHtml>
);
export const Counter: React.FC<{ label: string; value: string; right?: number; left?: number; top?: number; color?: string; k?: number }> = ({ label, value, right, left, top = 60, color = '#FFD84A', k = 1 }) => (
  k > 0 ? <div style={{ position: 'absolute', right, left, top, transform: `scale(${k})`, transformOrigin: right != null ? 'right top' : 'left top', background: 'rgba(20,18,16,0.85)', border: `4px solid ${color}`, borderRadius: 12, padding: '8px 24px', fontFamily: 'TagBold', fontSize: 50, color, whiteSpace: 'nowrap' }}>{label} {value}</div> : null
);
/** Small on-screen note for a fact the narration simplifies. */
export const Note: React.FC<{ at: number; text: string; top?: number }> = ({ at, text, top = 40 }) => {
  const f = useCurrentFrame();
  const k = springPop(f, at);
  return k > 0 ? <div style={{ position: 'absolute', right: 40, top, maxWidth: 640, transform: `scale(${k})`, transformOrigin: 'right top', textAlign: 'right', fontFamily: 'Tag', fontSize: 26, color: '#F4ECD8', background: 'rgba(20,18,16,0.75)', padding: '6px 14px', borderRadius: 8 }}>{text}</div> : null;
};
/** A card with big text that pops in. */
export const Card: React.FC<{ at: number; left: number; top: number; text: string; color?: string; bg?: string; size?: number; rot?: number; sub?: string }> = ({ at, left, top, text, color = '#1A1410', bg = '#F4ECD8', size = 56, rot = 0, sub }) => {
  const f = useCurrentFrame();
  const k = springPop(f, at);
  return k > 0 ? <div style={{ position: 'absolute', left, top, transform: `translate(-50%,-50%) scale(${k}) rotate(${rot}deg)`, background: bg, border: '6px solid #1A1410', borderRadius: 14, padding: '10px 30px', boxShadow: '8px 10px 0 rgba(0,0,0,0.3)', textAlign: 'center', whiteSpace: 'nowrap' }}><div style={{ fontFamily: 'TagBold', fontSize: size, color }}>{text}</div>{sub && <div style={{ fontFamily: 'TagBold', fontSize: size * 0.45, color: '#5A4A3A' }}>{sub}</div>}</div> : null;
};
/** A wall calendar page that can flip from another date. */
export const Calendar: React.FC<{ x: number; y: number; s?: number; month: string; day: string | number; year?: string | number; flipAt?: number; from?: { month: string; day: string | number }; glow?: number; color?: string }> = ({ x, y, s = 1, month, day, year, flipAt, from, glow = 0, color = NORTH }) => {
  const f = useCurrentFrame();
  const k = flipAt == null ? 1 : interpolate(f, [flipAt, flipAt + 10], [0, 1], Easing.inOut);
  const show = k < 0.5 && from ? from : { month, day };
  const sy = Math.abs(Math.cos(k * Math.PI));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {glow > 0 && <rect x={-200} y={-230} width={400} height={470} rx={24} fill="none" stroke="#FFD84A" strokeWidth={14 * glow} />}
      <rect x={-180} y={-210} width={360} height={420} rx={16} fill="#F4F7FA" stroke={OL} strokeWidth={8} />
      <g transform={`scale(1 ${from ? Math.max(0.05, sy) : 1})`}>
        <rect x={-180} y={-210} width={360} height={100} rx={16} fill={color} stroke={OL} strokeWidth={8} />
        <text y={-142} textAnchor="middle" fontFamily="TagBold" fontSize={String(show.month).length > 9 ? 38 : 50} fill="#fff">{show.month}</text>
        <text y={60} textAnchor="middle" fontFamily="TagBold" fontSize={String(show.day).length > 2 ? 96 : 150} fill="#1A1410">{show.day}</text>
      </g>
      {year != null && <text y={170} textAnchor="middle" fontFamily="TagBold" fontSize={48} fill="#5A4A3A">{year}</text>}
      {[-110, 110].map((rx) => <rect key={rx} x={rx - 10} y={-228} width={20} height={44} rx={8} fill="#8A8A8A" stroke={OL} strokeWidth={4} />)}
    </g>
  );
};
/** Bar chart with sprung bars. */
export const Bars: React.FC<{ x: number; y: number; bars: { label: string; v: number; c: string; at: number; text?: string }[]; max: number; h?: number; w?: number; gap?: number; labelSize?: number }> = ({ x, y, bars, max, h = 460, w = 200, gap = 80, labelSize = 32 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M-30 0 H${bars.length * (w + gap)}`} stroke="#F4ECD8" strokeWidth={6} />
      {bars.map((b, i) => {
        const k = f < b.at ? 0 : spring(f - b.at, { damping: 14, stiffness: 90 });
        const bh = (b.v / max) * h * k;
        return <g key={i} transform={`translate(${i * (w + gap)} 0)`}>
          <rect x={0} y={-bh} width={w} height={bh} fill={b.c} stroke={OL} strokeWidth={5} />
          <text x={w / 2} y={46} textAnchor="middle" fontFamily="TagBold" fontSize={labelSize} fill="#F4ECD8">{b.label}</text>
          {k > 0.3 && <text x={w / 2} y={-bh - 20} textAnchor="middle" fontFamily="TagBold" fontSize={42} fill="#fff" opacity={Math.min(1, (k - 0.3) * 3)}>{b.text ?? b.v}</text>}
        </g>;
      })}
    </g>
  );
};
/** Coins flying along a parabola from one point to another (gravity), repeating. */
export const CoinArc: React.FC<{ from: [number, number]; to: [number, number]; start?: number; every?: number; n?: number; c?: string; sym?: string }> = ({ from, to, start = 0, every = 4, n = 12, c = MONEY, sym = '$' }) => {
  const f = useCurrentFrame();
  const T = 30, g = 1.2;
  const vx = (to[0] - from[0]) / T, vy = (to[1] - from[1] - 0.5 * g * T * T) / T;
  return <g>{[...Array(n)].map((_, i) => { const t = f - start - i * every; if (t < 0 || t > T) return null; return <g key={i} transform={`translate(${from[0] + vx * t} ${from[1] + vy * t + 0.5 * g * t * t})`}><circle r={18} fill={c} stroke={OL} strokeWidth={3} /><text y={8} textAnchor="middle" fontFamily="TagBold" fontSize={22} fill="#E8F5E8">{sym}</text></g>; })}</g>;
};
