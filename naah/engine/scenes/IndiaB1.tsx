import React from 'react';
import { useCurrentFrame, onTwos, random, interpolate, Easing, spring, springPop } from '../lib/core';
import { Layer } from '../fx/Camera';
import { OL, Cloud, Hills, Tree, Bush } from './Parts';
import { SUB_PTS, subPath } from './India';

// ---------------------------------------------------------------- Sultanate court
/** Red-sandstone court: cusped arches, marble floor, throne under a canopy. */
export const SultanCourt: React.FC<{ throne?: boolean; library?: boolean; tint?: number }> = ({ throne = true, library }) => (
  <>
    <Layer depth={0.3}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#B5543A" />
      {[...Array(6)].map((_, i) => {
        const x = -120 + i * 380;
        return (
          <g key={i}>
            <rect x={x} y={-200} width={70} height={1000} fill="#9C4430" stroke={OL} strokeWidth={3} />
            <path d={`M${x + 70} 640 L${x + 70} 260 Q${x + 120} 260 ${x + 130} 200 Q${x + 190} 120 ${x + 250} 200 Q${x + 260} 260 ${x + 310} 260 L${x + 310} 640 Z`} fill={library ? '#5A3020' : '#E8C9A0'} stroke={OL} strokeWidth={3} />
            {library && [...Array(5)].map((_, r) => (
              <g key={r}>
                <path d={`M${x + 80} ${300 + r * 68} H${x + 300}`} stroke="#3A2014" strokeWidth={6} />
                {[...Array(9)].map((_, b) => <rect key={b} x={x + 86 + b * 23} y={250 + r * 68} width={18} height={46} fill={['#8C1D18', '#2E5E8C', '#3E6B3A', '#C9962C'][(b + r + i) % 4]} stroke={OL} strokeWidth={1.5} />)}
              </g>
            ))}
            <path d={`M${x} 120 h70`} stroke="#E8D5B0" strokeWidth={10} />
          </g>
        );
      })}
      <path d="M-200 40 H2200" stroke="#E8D5B0" strokeWidth={14} />
      <path d="M-200 40 H2200" stroke="#9C4430" strokeWidth={4} strokeDasharray="30 20" />
    </Layer>
    <Layer depth={0.6}>
      <path d="M-200 640 L2200 640 L2200 1300 L-200 1300 Z" fill="#E8E2D6" stroke={OL} strokeWidth={3} />
      {[...Array(14)].map((_, i) => <path key={i} d={`M${-200 + i * 180} 640 L${-500 + i * 240} 1300`} stroke="#CFC6B6" strokeWidth={3} />)}
      {[...Array(4)].map((_, i) => <path key={i} d={`M-200 ${700 + i * 90} H2200`} stroke="#CFC6B6" strokeWidth={3} />)}
      {throne && (
        <g transform="translate(960 720)">
          <path d="M-200 0 L200 0 L170 -60 L-170 -60 Z" fill="#E8D5B0" stroke={OL} strokeWidth={3} />
          <path d="M-150 -60 L-150 -420 L150 -420 L150 -60" fill="none" stroke="#C9962C" strokeWidth={10} />
          <path d="M-190 -420 Q0 -540 190 -420 Z" fill="#2E6B4A" stroke={OL} strokeWidth={4} />
          <path d="M-190 -420 Q0 -540 190 -420" stroke="#E2B13C" strokeWidth={8} fill="none" />
          <path d="M-90 -60 L-100 -300 Q0 -350 100 -300 L90 -60 Z" fill="#2E6B4A" stroke={OL} strokeWidth={4} />
          <rect x={-110} y={-150} width={220} height={90} rx={10} fill="#C9962C" stroke={OL} strokeWidth={3} />
        </g>
      )}
    </Layer>
  </>
);

// ---------------------------------------------------------------- Qutb Minar (very tall: base at y=1000, top near y=-1700)
export const QutbMinar: React.FC = () => {
  const storeys = [[1000, 560, 165], [560, 200, 140], [200, -150, 118], [-150, -420, 98], [-420, -640, 84]];
  return (
    <>
      <Layer depth={0}>
        <rect x={-200} y={-2400} width={2400} height={3800} fill="url(#skyDay)" />
      </Layer>
      <Layer depth={0.3}>
        <Cloud x={300} y={-400} s={1.4} speed={0.3} /><Cloud x={1400} y={-900} s={1.1} speed={0.25} /><Cloud x={800} y={200} s={1} speed={0.35} />
      </Layer>
      <Layer depth={1}>
        <path d="M-200 1000 L2200 1000 L2200 1600 L-200 1600 Z" fill="#C9B79A" stroke={OL} strokeWidth={3} />
        {/* ruined colonnade at the base */}
        {[...Array(8)].map((_, i) => <rect key={i} x={1180 + i * 70} y={860} width={30} height={140} fill="#C98A6A" stroke={OL} strokeWidth={2.5} />)}
        <path d="M1160 860 H1720" stroke="#B5543A" strokeWidth={14} />
        <g transform="translate(860 0)">
          {storeys.map(([b, t, w], i) => {
            const w2 = storeys[i + 1] ? storeys[i + 1][2] + 6 : w - 12;
            return (
              <g key={i}>
                <path d={`M${-w} ${b} L${-w2} ${t} L${w2} ${t} L${w} ${b} Z`} fill={i < 3 ? '#C2603F' : '#E8E2D6'} stroke={OL} strokeWidth={4} />
                {/* flutes */}
                {[...Array(9)].map((_, k) => {
                  const fx = -1 + (k / 8) * 2;
                  return <path key={k} d={`M${fx * w * 0.92} ${b} L${fx * w2 * 0.92} ${t}`} stroke={i < 3 ? '#9C4430' : '#BDB4A4'} strokeWidth={4} />;
                })}
                {/* inscription bands */}
                <path d={`M${-w * 0.98 + (w - w2) * 0.3} ${b - (b - t) * 0.3} H${w * 0.98 - (w - w2) * 0.3}`} stroke="#E8D5B0" strokeWidth={12} />
                {/* balcony */}
                <path d={`M${-w2 - 40} ${t} L${w2 + 40} ${t} L${w2 + 20} ${t + 34} L${-w2 - 20} ${t + 34} Z`} fill="#9C4430" stroke={OL} strokeWidth={3} />
                <path d={`M${-w2 - 40} ${t} L${-w2 - 40} ${t - 30} M${w2 + 40} ${t} L${w2 + 40} ${t - 30} M${-w2 - 40} ${t - 30} H${w2 + 40}`} stroke={OL} strokeWidth={4} />
              </g>
            );
          })}
          <path d="M-60 -640 Q0 -720 60 -640 Z" fill="#E8E2D6" stroke={OL} strokeWidth={4} />
          <rect x={-40} y={1000 - 120} width={80} height={120} rx={40} fill="#4A2418" stroke={OL} strokeWidth={3} />
        </g>
      </Layer>
    </>
  );
};

// ---------------------------------------------------------------- maps
/** Northern band = Delhi Sultanate (stylised). */
export const SultanateMap: React.FC<{ x: number; y: number; s?: number; grow?: number; at?: number }> = ({ x, y, s = 1, grow = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs><clipPath id="subclip2"><path d={subPath()} /></clipPath></defs>
    <path d={subPath()} fill="#E8DCC0" stroke={OL} strokeWidth={6} />
    <g clipPath="url(#subclip2)">
      <path d={`M0 0 L1000 0 L1000 ${380 + 160 * grow} Q600 ${560 + 160 * grow} 300 ${520 + 140 * grow} Q120 ${500 + 120 * grow} 0 ${560 + 60 * grow} Z`} fill="#2E6B4A" opacity={0.85} />
    </g>
    <path d={subPath()} fill="none" stroke={OL} strokeWidth={6} />
    <circle cx={380} cy={300} r={14} fill="#FFD84A" stroke={OL} strokeWidth={4} />
  </g>
);

/** India outline with Delhi and Daulatabad, plus a crawling "city" line. progress 0..1 (negative = going back). */
export const CapitalMap: React.FC<{ x: number; y: number; s?: number; progress?: number; back?: boolean; dropouts?: boolean }> = ({ x, y, s = 1, progress = 0, back, dropouts = true }) => {
  const f = useCurrentFrame();
  const D: [number, number] = [380, 300], B: [number, number] = [330, 680];
  const p = Math.max(0, Math.min(1, progress));
  const a = back ? B : D, b = back ? D : B;
  const hx = a[0] + (b[0] - a[0]) * p, hy = a[1] + (b[1] - a[1]) * p;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={subPath()} fill="#E8DCC0" stroke={OL} strokeWidth={6} />
      <path d={`M${D[0]} ${D[1]} Q300 490 ${B[0]} ${B[1]}`} stroke={OL} strokeWidth={3} strokeDasharray="10 10" fill="none" opacity={0.4} />
      <path d={`M${a[0]} ${a[1]} L${hx} ${hy}`} stroke="#B3261E" strokeWidth={14} strokeLinecap="round" />
      {/* the walking city: little dots that sometimes drop off and stay behind */}
      {[...Array(14)].map((_, i) => {
        const t = Math.max(0, p - i * 0.018);
        const dx = a[0] + (b[0] - a[0]) * t + Math.sin(i * 2.1) * 10, dy = a[1] + (b[1] - a[1]) * t + Math.cos(i * 1.7) * 10;
        const drop = dropouts && i % 3 === 2 && t > 0.3 + (i % 5) * 0.08;
        const dt = drop ? Math.min(0.3 + (i % 5) * 0.08, t) : t;
        const ddx = a[0] + (b[0] - a[0]) * dt + Math.sin(i * 2.1) * 10, ddy = a[1] + (b[1] - a[1]) * dt + Math.cos(i * 1.7) * 10;
        return p > 0 ? <circle key={i} cx={drop ? ddx : dx} cy={drop ? ddy : dy} r={7} fill={drop ? '#8A8178' : '#141414'} /> : null;
      })}
      <circle cx={D[0]} cy={D[1]} r={16} fill="#FFD84A" stroke={OL} strokeWidth={4} />
      <circle cx={B[0]} cy={B[1]} r={16} fill="#FFD84A" stroke={OL} strokeWidth={4} />
    </g>
  );
};

/** Stylised medieval Asia for the Mongol sweep (blobs, not real borders). */
export const AsiaMap: React.FC<{ flatten?: number[]; arrows?: number }> = ({ flatten = [], arrows = 0 }) => {
  const f = useCurrentFrame();
  const regions = [
    { name: 'MONGOLS', d: 'M700 80 Q1000 40 1300 120 Q1320 260 1100 300 Q860 300 720 240 Z', c: '#8A6A4A' },
    { name: 'CHINA', d: 'M1150 320 Q1400 280 1560 380 Q1600 560 1420 640 Q1220 640 1140 520 Z', c: '#C9B27C' },
    { name: 'PERSIA', d: 'M360 360 Q560 300 700 380 Q720 520 560 560 Q400 560 340 470 Z', c: '#C9B27C' },
    { name: 'BAGHDAD', d: 'M160 420 Q280 380 330 440 Q320 520 230 530 Q160 510 160 420 Z', c: '#C9B27C' },
    { name: 'INDIA', d: 'M760 520 Q920 460 1040 560 Q1020 720 900 860 Q820 760 760 640 Z', c: '#E8862A' },
  ];
  return (
    <g>
      {regions.map((r, i) => {
        const fl = i >= 1 && i <= 3 ? flatten[i - 1] ?? 0 : 0;
        return (
          <g key={r.name}>
            <path d={r.d} fill={fl > 0 ? '#6E6A66' : r.c} stroke={OL} strokeWidth={5} />
          </g>
        );
      })}
      {/* arrows sweeping out of Mongolia */}
      {[[1000, 200, 1350, 470], [900, 220, 520, 440], [850, 240, 250, 470], [900, 260, 880, 600]].map(([x1, y1, x2, y2], i) => {
        const k = Math.max(0, Math.min(1, arrows - i));
        if (k <= 0) return null;
        const ex = x1 + (x2 - x1) * k, ey = y1 + (y2 - y1) * k;
        const ang = Math.atan2(y2 - y1, x2 - x1);
        const india = i === 3;
        return (
          <g key={i}>
            <path d={`M${x1} ${y1} L${ex} ${ey}`} stroke={india ? '#7A2A22' : '#3A2A22'} strokeWidth={22} strokeLinecap="round" opacity={0.85} />
            <path d={`M${ex + Math.cos(ang) * 30} ${ey + Math.sin(ang) * 30} L${ex + Math.cos(ang + 2.4) * 34} ${ey + Math.sin(ang + 2.4) * 34} L${ex + Math.cos(ang - 2.4) * 34} ${ey + Math.sin(ang - 2.4) * 34} Z`} fill={india ? '#7A2A22' : '#3A2A22'} />
          </g>
        );
      })}
    </g>
  );
};

/** NW frontier: forts line + arrows that snap against it (with physics on the broken halves). */
export const FrontierMap: React.FC<{ hits: number[] }> = ({ hits }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <g transform="translate(700 60) scale(0.92)"><path d={subPath()} fill="#E8DCC0" stroke={OL} strokeWidth={6} /></g>
      {/* line of forts across the north-west */}
      {[[860, 300], [930, 380], [1000, 440], [1080, 470], [1170, 480]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <rect x={-26} y={-30} width={52} height={36} fill="#B5543A" stroke={OL} strokeWidth={3} />
          {[0, 1, 2].map((k) => <rect key={k} x={-26 + k * 20} y={-42} width={12} height={12} fill="#B5543A" stroke={OL} strokeWidth={2} />)}
        </g>
      ))}
      {hits.map((h, i) => {
        const t = f - h;
        if (t < -24) return null;
        const sx = 360 + i * 30, sy = 60 + (i % 3) * 40;
        const tx = 900 + (i % 4) * 70, ty = 340 + (i % 4) * 40;
        const ang = Math.atan2(ty - sy, tx - sx);
        if (t < 0) {
          const k = 1 + t / 24;
          const ex = sx + (tx - sx) * k, ey = sy + (ty - sy) * k;
          return <g key={i}><path d={`M${sx} ${sy} L${ex} ${ey}`} stroke="#3A2A22" strokeWidth={20} strokeLinecap="round" /><path d={`M${ex + Math.cos(ang) * 28} ${ey + Math.sin(ang) * 28} L${ex + Math.cos(ang + 2.4) * 30} ${ey + Math.sin(ang + 2.4) * 30} L${ex + Math.cos(ang - 2.4) * 30} ${ey + Math.sin(ang - 2.4) * 30} Z`} fill="#3A2A22" /></g>;
        }
        // snapped: two halves fall away under gravity, spinning
        const g = 1.4;
        const half = (dir: number, k: number) => {
          const vx = dir * 6, vy = -10;
          const px = tx - Math.cos(ang) * (60 + k * 60) + vx * t, py = ty - Math.sin(ang) * (60 + k * 60) + vy * t + 0.5 * g * t * t;
          return <g key={k} transform={`translate(${px} ${py}) rotate(${(ang * 180) / Math.PI + dir * t * 12})`} opacity={Math.max(0, 1 - t / 40)}><rect x={-60} y={-10} width={120} height={20} rx={8} fill="#3A2A22" /></g>;
        };
        return <g key={i}>{half(-1, 0)}{half(1, 1)}{t < 8 && <circle cx={tx} cy={ty} r={20 + t * 8} fill="none" stroke="#FFD84A" strokeWidth={8 - t} />}</g>;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- market
export const Market: React.FC<{ boards?: boolean }> = ({ boards = true }) => {
  const f = useCurrentFrame();
  const goods = [['WHEAT', '#E2B13C'], ['CLOTH', '#C0392B'], ['SUGAR', '#F4F7FA'], ['HORSES', '#8A5A3A'], ['ONIONS', '#C07A9C']];
  return (
    <>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDay)" /></Layer>
      <Layer depth={0.35}>
        {[...Array(8)].map((_, i) => <rect key={i} x={-160 + i * 300} y={300 - (i % 3) * 40} width={280} height={500} fill={i % 2 ? '#D8C2A0' : '#C98A6A'} stroke={OL} strokeWidth={3} />)}
        <Cloud x={500} y={100} s={1} speed={0.3} />
      </Layer>
      <Layer depth={0.7}>
        <path d="M-200 760 L2200 760 L2200 1300 L-200 1300 Z" fill="#C9B79A" stroke={OL} strokeWidth={3} />
        {goods.map(([g, c], i) => {
          const x = 120 + i * 380;
          return (
            <g key={g} transform={`translate(${x} 760)`}>
              <path d="M-150 -260 L150 -260 L170 -200 L-170 -200 Z" fill={i % 2 ? '#B3261E' : '#2E6B4A'} stroke={OL} strokeWidth={3} />
              <path d="M-150 -200 V0 M150 -200 V0" stroke="#6B4A2B" strokeWidth={8} />
              <rect x={-150} y={-90} width={300} height={70} fill="#8C5A2A" stroke={OL} strokeWidth={3} />
              {[...Array(5)].map((_, k) => <ellipse key={k} cx={-110 + k * 55} cy={-96} rx={26} ry={18} fill={c} stroke={OL} strokeWidth={2.5} />)}
              {boards && (
                <g transform={`translate(0 -330) rotate(${Math.sin(onTwos(f) / 12 + i) * 2})`}>
                  <path d="M-60 -50 L0 -80 L60 -50" stroke={OL} strokeWidth={3} fill="none" />
                  <rect x={-110} y={-50} width={220} height={90} rx={6} fill="#F4EEDD" stroke={OL} strokeWidth={4} />
                  <text x={0} y={-12} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#141414">{g}</text>
                  <text x={0} y={26} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#B3261E">FIXED</text>
                </g>
              )}
            </g>
          );
        })}
      </Layer>
    </>
  );
};

/** Price chart insert: flat line under a royal seal. */
export const FlatChart: React.FC<{ p: number }> = ({ p }) => (
  <g transform="translate(360 220)">
    <rect x={0} y={0} width={1200} height={560} rx={12} fill="#F4EEDD" stroke={OL} strokeWidth={6} />
    <path d="M80 480 H1140 M80 480 V60" stroke={OL} strokeWidth={5} />
    {/* ghost: what prices would normally do */}
    <path d={`M80 300 ${[...Array(20)].map((_, i) => `L${80 + (i + 1) * 53} ${300 + Math.sin(i * 1.3) * 120 + Math.cos(i * 0.7) * 60}`).join(' ')}`} stroke="#B5AA90" strokeWidth={5} fill="none" strokeDasharray="12 10" />
    <path d={`M80 300 H${80 + 1060 * p}`} stroke="#2E6B4A" strokeWidth={12} strokeLinecap="round" />
    <text x={610} y={545} textAnchor="middle" fontFamily="Hand" fontSize={44} fill="#141414">years →</text>
    <text x={40} y={280} textAnchor="middle" fontFamily="Hand" fontSize={40} fill="#141414" transform="rotate(-90 40 280)">price</text>
  </g>
);

// ---------------------------------------------------------------- road / heat / mint / study
export const HotRoad: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer depth={0}>
        <rect x={-200} y={-200} width={2400} height={1500} fill="#F2D49A" />
        <circle cx={1500} cy={200} r={260} fill="url(#sunGlow)" />
        <circle cx={1500} cy={200} r={90} fill="#FFF2C0" stroke="#F2A24A" strokeWidth={4} />
        {[...Array(12)].map((_, i) => { const a = (i / 12) * Math.PI * 2 + f / 60; return <path key={i} d={`M${1500 + Math.cos(a) * 120} ${200 + Math.sin(a) * 120} L${1500 + Math.cos(a) * 170} ${200 + Math.sin(a) * 170}`} stroke="#F2A24A" strokeWidth={8} strokeLinecap="round" />; })}
      </Layer>
      <Layer depth={0.35}>
        <Hills y={620} fill="#D8A066" amp={40} seed="hr" stroke={false} />
        {[...Array(4)].map((_, i) => <Bush key={i} x={200 + i * 500} y={640} s={0.6} c="#9A8A4A" />)}
      </Layer>
      <Layer depth={0.7}>
        <path d="M-200 660 L2200 660 L2200 1300 L-200 1300 Z" fill="#E2B97E" stroke={OL} strokeWidth={3} />
        <path d="M-200 800 Q960 760 2200 820 L2200 900 Q960 840 -200 880 Z" fill="#D2A46A" />
        {/* heat shimmer lines */}
        {[...Array(8)].map((_, i) => <path key={i} d={`M${100 + i * 240} ${700 + (i % 3) * 30} q20 ${-8 + Math.sin(f / 4 + i) * 6} 40 0 q20 ${8 + Math.sin(f / 4 + i) * 6} 40 0`} stroke="#F4E2B8" strokeWidth={3} fill="none" opacity={0.7} />)}
      </Layer>
    </>
  );
};

export const Mint: React.FC = () => (
  <>
    <rect x={0} y={0} width={960} height={1080} fill="#5A4636" />
    {[...Array(6)].map((_, i) => <path key={i} d={`M${i * 180} 0 V1080`} stroke="#4A382A" strokeWidth={5} />)}
    <path d="M0 760 H960 V1080 H0 Z" fill="#6E5642" stroke={OL} strokeWidth={3} />
    <text x={480} y={110} textAnchor="middle" fontFamily="TagBold" fontSize={56} fill="#FFD84A">ROYAL MINT</text>
  </>
);
export const Kitchen: React.FC = () => (
  <>
    <rect x={960} y={0} width={960} height={1080} fill="#C98A6A" />
    {[...Array(5)].map((_, i) => <rect key={i} x={1000 + i * 180} y={180} width={120} height={20} fill="#8C5A2A" stroke={OL} strokeWidth={2} />)}
    {[...Array(5)].map((_, i) => <ellipse key={i} cx={1060 + i * 180} cy={170} rx={30} ry={22} fill={['#C9A47A', '#8C5A2A', '#E2B13C', '#B3261E', '#C9A47A'][i]} stroke={OL} strokeWidth={2.5} />)}
    <path d="M960 760 H1920 V1080 H960 Z" fill="#8C6A4A" stroke={OL} strokeWidth={3} />
    <text x={1440} y={110} textAnchor="middle" fontFamily="TagBold" fontSize={56} fill="#FFF">SOMEONE'S KITCHEN</text>
  </>
);

export const Study: React.FC = () => (
  <>
    <Layer depth={0.3}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#E8D5B0" />
      <path d="M1300 160 L1300 560 Q1440 400 1580 560 L1580 160 Q1440 60 1300 160 Z" fill="url(#skyDay)" stroke={OL} strokeWidth={5} />
      <path d="M1440 100 V560 M1300 360 H1580" stroke={OL} strokeWidth={6} />
      {[...Array(3)].map((_, r) => <path key={r} d={`M200 ${260 + r * 120} H760`} stroke="#8C5A2A" strokeWidth={10} />)}
      {[...Array(3)].map((_, r) => [...Array(14)].map((_, b) => <rect key={r + '-' + b} x={210 + b * 38} y={196 + r * 120} width={30} height={60} fill={['#8C1D18', '#2E5E8C', '#3E6B3A', '#C9962C'][(b + r) % 4]} stroke={OL} strokeWidth={1.5} />))}
    </Layer>
    <Layer depth={0.6}>
      <path d="M-200 720 L2200 720 L2200 1300 L-200 1300 Z" fill="#B5543A" stroke={OL} strokeWidth={3} />
      <path d="M600 760 L1320 760 L1380 1080 L540 1080 Z" fill="#2E6B4A" opacity={0.6} />
    </Layer>
  </>
);

/** Hampi-style boulder landscape. */
export const Boulders: React.FC<{ sun?: boolean }> = ({ sun }) => (
  <>
    <Layer depth={0}>
      <rect x={-200} y={-200} width={2400} height={1500} fill={sun ? 'url(#skyDay)' : 'url(#skyDawn)'} />
      <circle cx={1500} cy={260} r={200} fill="url(#sunGlow)" />
    </Layer>
    <Layer depth={0.3}>
      {[...Array(14)].map((_, i) => {
        const x = -100 + i * 170, r = 60 + random('bo' + i) * 70, y = 560 - random('bp' + i) * 60;
        return <ellipse key={i} cx={x} cy={y} rx={r * 1.2} ry={r} fill="#C98A6A" stroke={OL} strokeWidth={3} />;
      })}
    </Layer>
    <Layer depth={0.55}>
      <path d="M-200 620 L2200 620 L2200 1300 L-200 1300 Z" fill="#9DBB5E" stroke={OL} strokeWidth={3} />
      <path d="M-200 720 Q600 680 1200 730 Q1700 770 2200 700 L2200 760 Q1700 830 1200 790 Q600 740 -200 790 Z" fill="#7FB7C9" stroke={OL} strokeWidth={3} />
      {[[200, 620, 150], [420, 640, 110], [1560, 630, 160], [1800, 650, 120], [1340, 650, 90]].map(([x, y, r], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y - r * 0.7} rx={r * 1.15} ry={r * 0.85} fill="#B87A5A" stroke={OL} strokeWidth={4} />
          <ellipse cx={x + r * 0.5} cy={y - r * 1.4} rx={r * 0.6} ry={r * 0.5} fill="#C98A6A" stroke={OL} strokeWidth={4} />
        </g>
      ))}
      <Tree x={980} y={640} s={0.7} /><Tree x={720} y={650} s={0.5} />
    </Layer>
  </>
);

/** EIC-style flag (stylised: red & white stripes, simple cross canton). */
export const CompanyFlag: React.FC<{ x: number; y: number; s?: number; wave?: number }> = ({ x, y, s = 1, wave = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[...Array(9)].map((_, i) => <path key={i} d={`M0 ${i * 20} Q100 ${i * 20 + wave} 200 ${i * 20} L200 ${i * 20 + 20} Q100 ${i * 20 + 20 + wave} 0 ${i * 20 + 20} Z`} fill={i % 2 ? '#F4F7FA' : '#C0392B'} />)}
    <rect x={0} y={0} width={86} height={80} fill="#F4F7FA" />
    <path d="M43 0 V80 M0 40 H86" stroke="#C0392B" strokeWidth={14} />
    <rect x={0} y={0} width={200} height={180} fill="none" stroke={OL} strokeWidth={4} />
  </g>
);

/** Sultanate map breaking apart: pieces drift away with momentum + spin (decelerating). */
export const BreakingMap: React.FC<{ x: number; y: number; s?: number; starts: number[] }> = ({ x, y, s = 1, starts }) => {
  const f = useCurrentFrame();
  const pieces = [
    { d: 'M0 0 L380 0 L360 260 L120 300 L0 240 Z', v: [-7, -3] },
    { d: 'M380 0 L1000 0 L1000 360 L640 380 L360 260 Z', v: [8, -4] },
    { d: 'M0 240 L120 300 L360 260 L340 560 L60 620 L0 520 Z', v: [-8, 4] },
    { d: 'M360 260 L640 380 L620 640 L340 560 Z', v: [3, 6] },
    { d: 'M640 380 L1000 360 L1000 600 L620 640 Z', v: [9, 3] },
    { d: 'M60 620 L340 560 L620 640 L700 1100 L60 1100 Z', v: [0, 8] },
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs><clipPath id="subclip3"><path d={subPath()} /></clipPath></defs>
      {pieces.map((p, i) => {
        const t = Math.max(0, f - (starts[i] ?? 9999));
        const k = (1 - Math.exp(-t / 14)) * 14; // drift with drag
        const dx = p.v[0] * k, dy = p.v[1] * k, rot = (i % 2 ? 1 : -1) * k * 0.8;
        return (
          <g key={i} transform={`translate(${dx} ${dy}) rotate(${rot} 500 500)`}>
            <g clipPath="url(#subclip3)"><path d={p.d} fill={['#2E6B4A', '#3E7B5A', '#5A8A4A', '#2E6B4A', '#6E9A5A', '#E8DCC0'][i]} stroke={OL} strokeWidth={5} /></g>
          </g>
        );
      })}
      <path d={subPath()} fill="none" stroke={OL} strokeWidth={3} opacity={0.25} strokeDasharray="10 10" />
    </g>
  );
};

export { SUB_PTS, interpolate, Easing, spring, springPop, Tree, Cloud };
