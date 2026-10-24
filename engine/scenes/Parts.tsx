import React from 'react';
import { useCurrentFrame, onTwos, random } from '../lib/core';

export const OL = '#2A1B12';

export const Cloud: React.FC<{ x: number; y: number; s?: number; speed?: number; fill?: string }> = ({ x, y, s = 1, speed = 0.4, fill = '#F4F7FA' }) => {
  const f = useCurrentFrame();
  const dx = ((x + f * speed + 400) % 2500) - 400;
  return (
    <g transform={`translate(${dx} ${y}) scale(${s})`}>
      <path d="M0 40 Q-10 10 25 8 Q35 -20 70 -6 Q95 -26 120 0 Q160 0 150 40 Z" fill={fill} stroke={OL} strokeWidth={3} strokeLinejoin="round" opacity={0.95} />
    </g>
  );
};

/** A snowy mountain range. peaks: [x, height] */
export const Range: React.FC<{ base: number; peaks: [number, number][]; rock?: string; snow?: string; shade?: string; snowLine?: number }> = ({ base, peaks, rock = '#7A7F8C', snow = '#F4F7FA', shade = '#C9D6E3', snowLine = 0.45 }) => (
  <g>
    {peaks.map(([px, h], i) => {
      const w = h * 1.25;
      const top = base - h;
      const sl = top + h * snowLine;
      const lw = px - w * snowLine * 0.9, rw = px + w * snowLine * 0.9;
      return (
        <g key={i}>
          <path d={`M${px - w} ${base} L${px - 8} ${top + 6} Q${px} ${top - 4} ${px + 8} ${top + 6} L${px + w} ${base} Z`} fill={rock} stroke={OL} strokeWidth={3} strokeLinejoin="round" />
          <path d={`M${px - 8} ${top + 6} Q${px} ${top - 4} ${px + 8} ${top + 6} L${rw} ${sl} L${px + w * 0.2} ${sl - 18} L${px + 4} ${sl + 10} L${px - w * 0.18} ${sl - 14} L${lw} ${sl} Z`} fill={snow} stroke={OL} strokeWidth={2.5} strokeLinejoin="round" />
          <path d={`M${px + 4} ${top + 4} L${rw} ${sl} L${px + w * 0.2} ${sl - 18} L${px + 4} ${sl + 10} Z`} fill={shade} />
        </g>
      );
    })}
  </g>
);

export const Hills: React.FC<{ y: number; fill: string; amp?: number; seed?: string; stroke?: boolean }> = ({ y, fill, amp = 40, seed = 'h', stroke = true }) => {
  let d = `M-200 1200 L-200 ${y}`;
  for (let i = 0; i <= 12; i++) {
    const x = -200 + i * 200;
    const yy = y - random(seed + i) * amp;
    d += ` Q${x + 100} ${yy - amp * 0.6} ${x + 200} ${y - random(seed + (i + 1)) * amp}`;
  }
  d += ' L2200 1200 Z';
  return <path d={d} fill={fill} stroke={stroke ? OL : 'none'} strokeWidth={3} />;
};

export const PrayerFlags: React.FC<{ x1: number; y1: number; x2: number; y2: number; sag?: number; n?: number }> = ({ x1, y1, x2, y2, sag = 60, n = 14 }) => {
  const f = onTwos(useCurrentFrame());
  const cols = ['#2E6FD1', '#F4F7FA', '#D1342E', '#2E9A4A', '#F2C230'];
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + sag;
  const pt = (t: number) => ({
    x: (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2,
    y: (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2,
  });
  return (
    <g>
      <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} stroke={OL} strokeWidth={2} fill="none" />
      {[...Array(n)].map((_, i) => {
        const p = pt((i + 0.5) / n);
        const sw = Math.sin(f / 4 + i) * 6;
        return <path key={i} d={`M${p.x - 13} ${p.y} L${p.x + 13} ${p.y} L${p.x + 13 + sw} ${p.y + 34} L${p.x - 13 + sw} ${p.y + 34} Z`} fill={cols[i % 5]} stroke={OL} strokeWidth={2} />;
      })}
    </g>
  );
};

export const Hut: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-50} y={-60} width={100} height={60} fill="#C99A5E" stroke={OL} strokeWidth={3} />
    <rect x={-12} y={-36} width={24} height={36} fill="#5A3E26" stroke={OL} strokeWidth={2.5} />
    <path d="M-66 -54 L0 -112 L66 -54 Z" fill="#D8B46A" stroke={OL} strokeWidth={3} strokeLinejoin="round" />
    <path d="M-40 -70 L-20 -88 M0 -76 L14 -96 M24 -68 L40 -84" stroke="#A88444" strokeWidth={2} />
  </g>
);

export const Tree: React.FC<{ x: number; y: number; s?: number; c?: string; c2?: string }> = ({ x, y, s = 1, c = '#4E8B3A', c2 = '#3C7030' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-8 0 L-6 -80 L6 -80 L8 0 Z" fill="#6B4A2B" stroke={OL} strokeWidth={3} />
    <path d="M-70 -90 Q-90 -150 -40 -170 Q-30 -220 20 -210 Q70 -220 74 -160 Q100 -120 70 -86 Q0 -60 -70 -90 Z" fill={c} stroke={OL} strokeWidth={3} />
    <path d="M-40 -110 Q-20 -130 0 -112 M20 -150 Q40 -170 54 -146" stroke={c2} strokeWidth={5} fill="none" />
  </g>
);

export const Pine: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = '#2F5E3A' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-6} y={-30} width={12} height={30} fill="#5A3E26" stroke={OL} strokeWidth={2.5} />
    <path d="M0 -190 L44 -90 L22 -94 L56 -26 L-56 -26 L-22 -94 L-44 -90 Z" fill={c} stroke={OL} strokeWidth={3} strokeLinejoin="round" />
  </g>
);

export const Bush: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = '#16241C' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-90 0 Q-100 -50 -60 -60 Q-50 -100 -10 -90 Q20 -120 50 -84 Q96 -84 90 0 Z" fill={c} />
  </g>
);

export const Fronds: React.FC<{ x: number; y: number; s?: number; c?: string; flip?: boolean }> = ({ x, y, s = 1, c = '#16241C', flip }) => {
  const f = onTwos(useCurrentFrame());
  const w = Math.sin(f / 10 + x) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} fill={c}>
      <path d={`M0 0 Q-20 -120 ${-90 + w} -180 Q-30 -110 16 0 Z`} />
      <path d={`M10 0 Q20 -150 ${70 + w} -230 Q40 -120 34 0 Z`} />
      <path d={`M20 0 Q80 -80 ${170 + w} -110 Q90 -50 46 0 Z`} />
      <path d={`M0 0 Q-80 -50 ${-160 + w} -60 Q-80 -20 -10 6 Z`} />
    </g>
  );
};

/** Multi-roof pagoda temple (Newar style). Origin = ground centre. */
export const Pagoda: React.FC<{ x: number; y: number; s?: number; tiers?: number; stretch?: number }> = ({ x, y, s = 1, tiers = 3, stretch = 1 }) => {
  const els: React.ReactNode[] = [];
  // plinth steps
  els.push(<path key="p1" d="M-170 0 L170 0 L150 -30 L-150 -30 Z" fill="#B9AE9C" stroke={OL} strokeWidth={3} />);
  els.push(<path key="p2" d="M-140 -30 L140 -30 L122 -58 L-122 -58 Z" fill="#CFC5B3" stroke={OL} strokeWidth={3} />);
  els.push(<path key="p3" d="M-110 -58 L110 -58 L96 -84 L-96 -84 Z" fill="#B9AE9C" stroke={OL} strokeWidth={3} />);
  let yy = -84;
  let w = 80;
  for (let i = 0; i < tiers; i++) {
    const wallH = (i === 0 ? 90 : 46) * stretch;
    els.push(<rect key={'w' + i} x={-w} y={yy - wallH} width={w * 2} height={wallH} fill="url(#brick)" stroke={OL} strokeWidth={3} />);
    if (i === 0) {
      els.push(<rect key="door" x={-22} y={yy - 64} width={44} height={64} fill="#4A2E1E" stroke={OL} strokeWidth={3} />);
      els.push(<path key="dw" d={`M${-w + 14} ${yy - 70} h30 v40 h-30 Z M${w - 44} ${yy - 70} h30 v40 h-30 Z`} fill="#4A2E1E" stroke={OL} strokeWidth={2.5} />);
    }
    yy -= wallH;
    const rw = w + 64;
    els.push(<path key={'r' + i} d={`M${-rw} ${yy + 18} Q${-w} ${yy - 8} ${-w + 18} ${yy - 40} L${w - 18} ${yy - 40} Q${w} ${yy - 8} ${rw} ${yy + 18} Z`} fill="#4A2E1E" stroke={OL} strokeWidth={3} strokeLinejoin="round" />);
    els.push(<path key={'rt' + i} d={`M${-rw} ${yy + 18} Q${-w} ${yy - 8} ${-w + 18} ${yy - 40}`} stroke="#6E4A30" strokeWidth={4} fill="none" />);
    els.push(<path key={'rg' + i} d={`M${-rw + 6} ${yy + 14} L${rw - 6} ${yy + 14}`} stroke="#E2B13C" strokeWidth={4} />);
    // struts
    els.push(<path key={'st' + i} d={`M${-w} ${yy} L${-w - 36} ${yy + 14} M${w} ${yy} L${w + 36} ${yy + 14}`} stroke="#3A2214" strokeWidth={5} />);
    yy -= 40;
    w = w * 0.7;
  }
  els.push(<path key="fin" d={`M-8 ${yy} L0 ${yy - 60} L8 ${yy} Z`} fill="#E2B13C" stroke={OL} strokeWidth={2.5} />);
  els.push(<circle key="fin2" cx={0} cy={yy - 18} r={10} fill="#E2B13C" stroke={OL} strokeWidth={2.5} />);
  return <g transform={`translate(${x} ${y}) scale(${s})`}>{els}</g>;
};

/** Swayambhunath-style stupa with painted eyes. */
export const Stupa: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-260 0 L260 0 L230 -40 L-230 -40 Z" fill="#E8E2D6" stroke={OL} strokeWidth={3} />
    <path d="M-220 -40 A220 170 0 0 1 220 -40 Z" fill="#F7F4EE" stroke={OL} strokeWidth={3.5} />
    <path d="M-150 -150 Q0 -170 150 -150" stroke="#E2B13C" strokeWidth={0} fill="none" />
    <rect x={-70} y={-280} width={140} height={84} fill="#E2B13C" stroke={OL} strokeWidth={3.5} />
    {/* eyes */}
    <path d="M-56 -242 Q-36 -262 -14 -242 Q-36 -232 -56 -242 Z" fill="#fff" stroke={OL} strokeWidth={2.5} />
    <path d="M14 -242 Q36 -262 56 -242 Q36 -232 14 -242 Z" fill="#fff" stroke={OL} strokeWidth={2.5} />
    <circle cx={-34} cy={-245} r={6} fill="#1E3A8A" /><circle cx={36} cy={-245} r={6} fill="#1E3A8A" />
    <path d="M-62 -262 Q-36 -278 -10 -262 M10 -262 Q36 -278 62 -262" stroke={OL} strokeWidth={3.5} fill="none" />
    <path d="M-4 -232 Q-12 -214 0 -208 Q8 -214 2 -222" stroke="#B3261E" strokeWidth={3.5} fill="none" />
    {/* spire rings */}
    {[...Array(7)].map((_, i) => (
      <path key={i} d={`M${-56 + i * 6} ${-280 - i * 22} L${56 - i * 6} ${-280 - i * 22} L${50 - i * 6} ${-302 - i * 22} L${-50 + i * 6} ${-302 - i * 22} Z`} fill="#E2B13C" stroke={OL} strokeWidth={2.5} />
    ))}
    <path d="M-40 -434 Q0 -470 40 -434 Z" fill="#E2B13C" stroke={OL} strokeWidth={3} />
    <path d="M-6 -452 L0 -500 L6 -452 Z" fill="#E2B13C" stroke={OL} strokeWidth={2.5} />
  </g>
);

export const Flame: React.FC<{ x: number; y: number; s?: number; seed?: string }> = ({ x, y, s = 1, seed = 'fl' }) => {
  const f = useCurrentFrame();
  const k = Math.floor(f / 3);
  const r = random(seed + k);
  const h = 60 + r * 20;
  const lean = (random(seed + 'l' + k) - 0.5) * 16;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={-30} rx={60} ry={60} fill="url(#warmGlow)" />
      <path d={`M-26 0 Q-34 -30 ${-10 + lean} ${-h} Q-4 -40 4 -30 Q10 ${-h * 0.8} ${16 + lean} ${-h * 0.7} Q30 -30 26 0 Z`} fill="#FF6A00" stroke={OL} strokeWidth={2.5} />
      <path d={`M-14 0 Q-18 -20 ${-2 + lean / 2} ${-h * 0.55} Q8 -26 14 0 Z`} fill="#FFB21E" />
      <path d={`M-6 0 Q-6 -12 ${lean / 3} ${-h * 0.3} Q6 -10 6 0 Z`} fill="#FFE07A" />
    </g>
  );
};

/** Little oil lamp (diyo) with flicker. */
export const Diyo: React.FC<{ x: number; y: number; s?: number; i?: number }> = ({ x, y, s = 1, i = 0 }) => {
  const f = useCurrentFrame();
  const k = Math.floor(f / 3);
  const h = 14 + random('d' + i + k) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={-10} r={26} fill="url(#warmGlow)" />
      <path d="M-14 0 Q0 10 14 0 L10 -4 L-10 -4 Z" fill="#C1793A" stroke={OL} strokeWidth={2} />
      <path d={`M0 -4 Q-5 -10 0 ${-4 - h} Q5 -10 0 -4`} fill="#FFB21E" />
    </g>
  );
};

export const Critter: React.FC<{ kind: 'rabbit' | 'monkey' | 'redpanda' | 'yak' | 'goat'; x: number; y: number; s?: number; look?: 'stare' | 'normal'; flip?: boolean }> = ({ kind, x, y, s = 1, look = 'normal', flip }) => {
  const big = look === 'stare';
  const eyes = big ? (
    <g>
      <circle cx={-10} cy={-52} r={9} fill="#fff" stroke={OL} strokeWidth={2} /><circle cx={10} cy={-52} r={9} fill="#fff" stroke={OL} strokeWidth={2} />
      <circle cx={-9} cy={-51} r={2.5} fill={OL} /><circle cx={9} cy={-51} r={2.5} fill={OL} />
    </g>
  ) : (
    <g><circle cx={-9} cy={-52} r={3.5} fill={OL} /><circle cx={9} cy={-52} r={3.5} fill={OL} /></g>
  );
  let body: React.ReactNode;
  if (kind === 'redpanda') {
    body = (
      <g>
        <path d="M30 -10 Q80 -20 90 -60 Q70 -30 40 -30 Z" fill="#B5502A" stroke={OL} strokeWidth={2.5} />
        <path d="M60 -26 l8 -10 M74 -34 l6 -10" stroke="#5A2A12" strokeWidth={5} />
        <ellipse cx={0} cy={-18} rx={34} ry={22} fill="#B5502A" stroke={OL} strokeWidth={2.5} />
        <path d="M-30 -84 L-36 -104 L-16 -92 Z M30 -84 L36 -104 L16 -92 Z" fill="#B5502A" stroke={OL} strokeWidth={2.5} />
        <ellipse cx={0} cy={-56} rx={34} ry={30} fill="#C8622F" stroke={OL} strokeWidth={2.5} />
        <path d="M-24 -62 Q-14 -40 -4 -44 M24 -62 Q14 -40 4 -44" stroke="#F4EEDD" strokeWidth={6} fill="none" />
        <ellipse cx={0} cy={-42} rx={10} ry={7} fill="#F4EEDD" />
        <circle cx={0} cy={-44} r={3} fill={OL} />
      </g>
    );
  } else if (kind === 'monkey') {
    body = (
      <g>
        <ellipse cx={0} cy={-20} rx={28} ry={24} fill="#8A6A4A" stroke={OL} strokeWidth={2.5} />
        <circle cx={-30} cy={-58} r={10} fill="#C9A47A" stroke={OL} strokeWidth={2.5} /><circle cx={30} cy={-58} r={10} fill="#C9A47A" stroke={OL} strokeWidth={2.5} />
        <circle cx={0} cy={-56} r={28} fill="#8A6A4A" stroke={OL} strokeWidth={2.5} />
        <ellipse cx={0} cy={-50} rx={20} ry={18} fill="#E0B98C" />
      </g>
    );
  } else if (kind === 'goat') {
    body = (
      <g>
        <ellipse cx={0} cy={-34} rx={50} ry={28} fill="#E8E2D6" stroke={OL} strokeWidth={2.5} />
        <path d="M-34 -8 v34 M-14 -6 v32 M16 -6 v32 M36 -8 v34" stroke={OL} strokeWidth={6} />
        <path d="M30 -50 Q50 -90 70 -76 L76 -52 Q66 -40 44 -40 Z" fill="#E8E2D6" stroke={OL} strokeWidth={2.5} />
        <path d="M54 -84 Q48 -106 30 -104 M62 -84 Q70 -104 86 -98" stroke="#8A7A6A" strokeWidth={5} fill="none" />
        <path d="M70 -50 l2 18 l-8 -6 Z" fill="#C9C0B0" stroke={OL} strokeWidth={2} />
      </g>
    );
  } else if (kind === 'yak') {
    body = (
      <g>
        <ellipse cx={0} cy={-30} rx={60} ry={34} fill="#3A2E28" stroke={OL} strokeWidth={2.5} />
        <path d="M-50 -60 Q-70 -80 -60 -96 M50 -60 Q70 -80 60 -96" stroke="#E8E2D6" strokeWidth={6} fill="none" />
        <circle cx={0} cy={-56} r={30} fill="#4A3A30" stroke={OL} strokeWidth={2.5} />
      </g>
    );
  } else {
    body = (
      <g>
        <path d="M-16 -70 Q-26 -130 -10 -128 Q0 -100 -4 -72 Z M16 -70 Q26 -130 10 -128 Q0 -100 4 -72 Z" fill="#9C8F86" stroke={OL} strokeWidth={2.5} />
        <ellipse cx={0} cy={-20} rx={26} ry={22} fill="#9C8F86" stroke={OL} strokeWidth={2.5} />
        <circle cx={0} cy={-52} r={24} fill="#9C8F86" stroke={OL} strokeWidth={2.5} />
        <circle cx={0} cy={-42} r={3} fill="#D98C9A" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {body}
      {kind !== 'redpanda' && kind !== 'goat' && eyes}
      {kind === 'goat' && <circle cx={58} cy={-70} r={4} fill={OL} />}
      {kind === 'redpanda' && big && <g transform="translate(0 4)">{eyes}</g>}
      {kind === 'redpanda' && !big && <g><circle cx={-12} cy={-58} r={4} fill={OL} /><circle cx={12} cy={-58} r={4} fill={OL} /></g>}
    </g>
  );
};
