/**
 * Infographic overlays and props shared by every film: rubber stamps, counters, corner notes,
 * pop-in cards, a flipping calendar, sprung bar charts and coins flying on a parabola.
 *
 *   import { Stamp, Counter, Note, Card, Calendar, Bars, CoinArc } from '@engine/fx/Infographics';
 *
 * Stamp / Counter / Note / Card are HTML overlays (place them outside the CameraRig).
 * Calendar / Bars / CoinArc are SVG (place them inside a <Layer>). See docs/gallery/infographics.png.
 */
import React from 'react';
import { useCurrentFrame, interpolate, Easing, spring, springPop } from '@engine/lib/core';
import { DropHtml } from '@engine/kit';
import { OL } from '@engine/scenes/Parts';

export const Stamp: React.FC<{ at: number; left: number; top: number; text: string; color?: string; rot?: number; size?: number }> = ({ at, left, top, text, color = '#B3261E', rot = -6, size = 58 }) => (
  <DropHtml at={at} left={left} top={top} h={360}><div style={{ fontFamily: 'TagBold', fontSize: size, color, border: `7px solid ${color}`, padding: '4px 22px', borderRadius: 10, transform: `rotate(${rot}deg)`, background: 'rgba(255,255,255,0.92)', whiteSpace: 'nowrap' }}>{text}</div></DropHtml>
);
export const Counter: React.FC<{ label: string; value: string; right?: number; left?: number; top?: number; color?: string; k?: number }> = ({ label, value, right, left, top = 60, color = '#FFD84A', k = 1 }) => (
  k > 0 ? <div style={{ position: 'absolute', right, left, top, transform: `scale(${k})`, transformOrigin: right != null ? 'right top' : 'left top', background: 'rgba(20,18,16,0.85)', border: `4px solid ${color}`, borderRadius: 12, padding: '8px 24px', fontFamily: 'TagBold', fontSize: 50, color, whiteSpace: 'nowrap' }}>{label} {value}</div> : null
);
/** Small corner note (top right): corrects or adds precision to what the narration says. */
export const Note: React.FC<{ at: number; text: string; top?: number }> = ({ at, text, top = 40 }) => {
  const f = useCurrentFrame();
  const k = springPop(f, at);
  return k > 0 ? <div style={{ position: 'absolute', right: 40, top, maxWidth: 640, transform: `scale(${k})`, transformOrigin: 'right top', textAlign: 'right', fontFamily: 'Tag', fontSize: 30, color: '#F4ECD8', background: 'rgba(20,18,16,0.75)', padding: '6px 14px', borderRadius: 8 }}><span style={{ fontFamily: 'TagBold', color: '#FFD84A' }}>Note: </span>{text}</div> : null;
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
export const CoinArc: React.FC<{ from: [number, number]; to: [number, number]; start?: number; every?: number; n?: number; c?: string; sym?: string }> = ({ from, to, start = 0, every = 4, n = 12, c = '#2E8B57', sym = '$' }) => {
  const f = useCurrentFrame();
  const T = 30, g = 1.2;
  const vx = (to[0] - from[0]) / T, vy = (to[1] - from[1] - 0.5 * g * T * T) / T;
  return <g>{[...Array(n)].map((_, i) => { const t = f - start - i * every; if (t < 0 || t > T) return null; return <g key={i} transform={`translate(${from[0] + vx * t} ${from[1] + vy * t + 0.5 * g * t * t})`}><circle r={18} fill={c} stroke={OL} strokeWidth={3} /><text y={8} textAnchor="middle" fontFamily="TagBold" fontSize={22} fill="#E8F5E8">{sym}</text></g>; })}</g>;
};
