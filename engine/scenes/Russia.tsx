/**
 * Russia scene library (first used by projects/russia). Reusable for any film about Russia, the steppe,
 * Vikings or Byzantium: taiga, log huts, a Viking longship, onion-dome churches, a Byzantine dome,
 * Mongol gers and a khan's camp, frozen rivers, snowfall.
 *
 *   import { Taiga, LogHut, Longship, RiverScene, OnionChurch, ByzDome, Ger, KhanCamp, Snow, SnowPine } from '@engine/scenes/Russia';
 */
import React from 'react';
import { useCurrentFrame, onTwos, random, interpolate } from '../lib/core';
import { Layer } from '../fx/Camera';
import { OL, Cloud, Hills } from './Parts';

export const SNOW = '#F2F5F8', SNOW_SHADE = '#CBD6E2', LOG = '#8A5A34', LOG_DARK = '#5E3A20', GOLD_DOME = '#E2B13C';

/** A fir with optional snow on its tiers. Origin = foot of the trunk. */
export const SnowPine: React.FC<{ x: number; y: number; s?: number; c?: string; snow?: boolean }> = ({ x, y, s = 1, c = '#2F5E3A', snow = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-9} y={-40} width={18} height={40} fill={LOG_DARK} stroke={OL} strokeWidth={3} />
    {[0, 1, 2].map((i) => {
      const w = 92 - i * 22, top = -60 - i * 62, h = 110;
      return <g key={i}>
        <path d={`M${-w} ${top + h - 60} L0 ${top - 40} L${w} ${top + h - 60} Z`} fill={c} stroke={OL} strokeWidth={4} strokeLinejoin="round" />
        {snow && <path d={`M${-w * 0.55} ${top + 2} Q${-w * 0.25} ${top + 14} 0 ${top - 6} Q${w * 0.3} ${top + 16} ${w * 0.6} ${top + 4} L0 ${top - 38} Z`} fill={SNOW} stroke={OL} strokeWidth={2.5} strokeLinejoin="round" />}
      </g>;
    })}
  </g>
);

/** Falling snow (deterministic). density = flakes on screen. */
export const Snow: React.FC<{ density?: number; wind?: number; seed?: string }> = ({ density = 70, wind = 1.2, seed = 'sn' }) => {
  const f = useCurrentFrame();
  return <g>{[...Array(density)].map((_, i) => {
    const r = random(seed + i), r2 = random(seed + 'b' + i);
    const sp = 1.6 + r2 * 2.2;
    const y = ((r * 1200 + f * sp) % 1200) - 60;
    const x = ((r2 * 2200 + f * wind * sp * 0.6 + Math.sin((f + i * 13) / 18) * 20) % 2200) - 140;
    return <circle key={i} cx={x} cy={y} r={3 + r * 5} fill="#fff" opacity={0.55 + r2 * 0.4} />;
  })}</g>;
};

/** Endless northern forest. winter = snow on the ground and trees. */
export const Taiga: React.FC<{ winter?: boolean; dusk?: boolean; ground?: number }> = ({ winter = true, dusk, ground = 760 }) => (
  <>
    <Layer depth={0}>
      <rect x={-300} y={-300} width={2600} height={1700} fill={dusk ? 'url(#skyDawn)' : winter ? 'url(#skyWinter)' : 'url(#skyDay)'} />
      {!winter && <><Cloud x={380} y={150} /><Cloud x={1500} y={110} s={0.8} /></>}
    </Layer>
    <Layer depth={0.2}>
      <Hills y={ground - 150} fill={winter ? '#B8C6D4' : '#8FA88A'} amp={30} seed="tg0" stroke={false} />
      {[...Array(26)].map((_, i) => <SnowPine key={i} x={-200 + i * 95} y={ground - 120 + (i % 3) * 6} s={0.42} c={winter ? '#3E5E52' : '#3E6A44'} snow={winter} />)}
    </Layer>
    <Layer depth={0.5}>
      {[...Array(15)].map((_, i) => <SnowPine key={i} x={-160 + i * 165 + (i % 2) * 40} y={ground - 30} s={0.75} c={winter ? '#2F5244' : '#2F5E3A'} snow={winter} />)}
      <path d={`M-300 ${ground - 20} L2300 ${ground - 20} L2300 1500 L-300 1500 Z`} fill={winter ? SNOW : '#8FAE5E'} stroke={OL} strokeWidth={3} />
      {winter && [...Array(8)].map((_, i) => <path key={i} d={`M${-100 + i * 300} ${ground + 60 + (i % 3) * 50} q120 -24 240 0`} stroke={SNOW_SHADE} strokeWidth={6} fill="none" strokeLinecap="round" />)}
    </Layer>
  </>
);

/** Log cabin. Origin = ground centre. smoke = chimney smoke. */
export const LogHut: React.FC<{ x: number; y: number; s?: number; smoke?: boolean; snow?: boolean; seed?: string }> = ({ x, y, s = 1, smoke = true, snow = false, seed = 'lh' }) => {
  const f = onTwos(useCurrentFrame());
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[...Array(6)].map((_, i) => <rect key={i} x={-120} y={-30 - i * 26} width={240} height={26} rx={13} fill={i % 2 ? LOG : '#9A6A40'} stroke={OL} strokeWidth={3.5} />)}
      {[...Array(6)].map((_, i) => <circle key={i} cx={-126} cy={-17 - i * 26} r={12} fill="#C9935A" stroke={OL} strokeWidth={3} />)}
      <path d="M-150 -170 L0 -270 L150 -170 Z" fill={snow ? SNOW : '#6E4A2A'} stroke={OL} strokeWidth={5} strokeLinejoin="round" />
      <rect x={-30} y={-120} width={60} height={50} fill="#F2C46A" stroke={OL} strokeWidth={4} />
      <path d="M0 -120 V-70 M-30 -95 H30" stroke={OL} strokeWidth={3} />
      <rect x={60} y={-250} width={26} height={60} fill={LOG_DARK} stroke={OL} strokeWidth={3} />
      {smoke && [0, 1, 2].map((i) => { const t = ((f + i * 20) % 60) / 60; return <circle key={i} cx={73 + Math.sin(t * 6 + i) * 14 + t * 30} cy={-260 - t * 140} r={14 + t * 26} fill="#E8E8E8" opacity={0.7 * (1 - t)} />; })}
    </g>
  );
};

/** Viking longship with a striped square sail, shields and rowing oars. Faces right. Origin = waterline centre. */
export const Longship: React.FC<{ x: number; y: number; s?: number; rowing?: boolean; sail?: string; flip?: boolean }> = ({ x, y, s = 1, rowing = true, sail = '#B3261E', flip }) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 14) * 4, rock = Math.sin(f / 20) * 1.2;
  const oar = rowing ? Math.sin(onTwos(f) / 5) * 16 : 0;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${flip ? -s : s} ${s}) rotate(${rock})`}>
      {[...Array(7)].map((_, i) => <path key={i} d={`M${-210 + i * 70} -40 L${-250 + i * 70 + oar} 40`} stroke="#6E4A2A" strokeWidth={8} strokeLinecap="round" />)}
      <path d="M-330 -90 Q-300 -10 -200 10 L220 10 Q310 -10 330 -100 L300 -70 Q260 -40 220 -40 L-200 -40 Q-270 -40 -300 -80 Z" fill="#8A5A34" stroke={OL} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-300 -60 Q-250 -20 -200 -20 L220 -20 Q270 -20 310 -70" stroke="#5E3A20" strokeWidth={4} fill="none" />
      <path d="M330 -100 Q350 -150 320 -170 Q300 -150 318 -130" fill="#8A5A34" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
      <circle cx={326} cy={-158} r={4} fill={OL} />
      <path d="M-330 -90 Q-350 -130 -325 -150" stroke={OL} strokeWidth={6} fill="none" strokeLinecap="round" />
      {[...Array(8)].map((_, i) => <g key={i}><circle cx={-190 + i * 56} cy={-46} r={22} fill={['#C0392B', '#F4ECD8', '#2E86C1', '#E2B13C'][i % 4]} stroke={OL} strokeWidth={4} /><circle cx={-190 + i * 56} cy={-46} r={6} fill="#9AA0A6" stroke={OL} strokeWidth={2} /></g>)}
      <rect x={-8} y={-360} width={16} height={330} fill="#6E4A2A" stroke={OL} strokeWidth={4} />
      <path d={`M-150 -340 L150 -340 Q${165 + Math.sin(f / 10) * 8} -230 150 -140 L-150 -140 Q${-135 + Math.sin(f / 10) * 8} -230 -150 -340 Z`} fill="#F4ECD8" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${-150 + i * 120 + 30} -340 L${-150 + i * 120 + 90} -340 L${-150 + i * 120 + 90} -140 L${-150 + i * 120 + 30} -140 Z`} fill={sail} opacity={0.9} />)}
      <path d="M-160 -344 H160" stroke="#6E4A2A" strokeWidth={10} strokeLinecap="round" />
    </g>
  );
};

/** River landscape (summer forest banks); frozen = white ice. Use with Longship or riders on the ice. */
export const RiverScene: React.FC<{ frozen?: boolean; ground?: number }> = ({ frozen = false, ground = 600 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer depth={0}>
        <rect x={-300} y={-300} width={2600} height={1700} fill={frozen ? 'url(#skyWinter)' : 'url(#skyDay)'} />
        {!frozen && <><Cloud x={300} y={130} /><Cloud x={1300} y={170} s={0.7} /></>}
      </Layer>
      <Layer depth={0.25}>
        <Hills y={ground - 60} fill={frozen ? '#B8C6D4' : '#8FA88A'} amp={26} seed="rv1" stroke={false} />
        {[...Array(24)].map((_, i) => <SnowPine key={i} x={-220 + i * 105} y={ground - 10 + (i % 2) * 8} s={0.45} c={frozen ? '#3E5E52' : '#3E6A44'} snow={frozen} />)}
      </Layer>
      <Layer depth={0.55}>
        <path d={`M-300 ${ground} L2300 ${ground} L2300 1500 L-300 1500 Z`} fill={frozen ? '#DCE8F2' : '#4F86B8'} stroke={OL} strokeWidth={3} />
        {frozen
          ? [...Array(10)].map((_, i) => <path key={i} d={`M${-150 + i * 240} ${ground + 70 + (i % 3) * 90} l60 20 l40 -14 l70 24`} stroke="#A9C1D6" strokeWidth={4} fill="none" />)
          : [...Array(12)].map((_, i) => <path key={i} d={`M${((i * 230 + f * 2) % 2400) - 300} ${ground + 60 + (i % 4) * 80} q40 -12 80 0`} stroke="#9CC4E4" strokeWidth={5} fill="none" strokeLinecap="round" />)}
      </Layer>
    </>
  );
};

/** White-walled church with gold onion domes. Origin = ground centre. */
export const OnionChurch: React.FC<{ x: number; y: number; s?: number; dome?: string; glow?: number }> = ({ x, y, s = 1, dome = GOLD_DOME, glow = 0 }) => {
  const onion = (cx: number, cy: number, r: number) => (
    <g>
      <rect x={cx - r * 0.55} y={cy} width={r * 1.1} height={r * 1.1} fill="#F4F2EC" stroke={OL} strokeWidth={4} />
      <path d={`M${cx} ${cy - r * 1.9} Q${cx + r * 1.15} ${cy - r * 0.9} ${cx + r * 0.62} ${cy} L${cx - r * 0.62} ${cy} Q${cx - r * 1.15} ${cy - r * 0.9} ${cx} ${cy - r * 1.9} Z`} fill={dome} stroke={OL} strokeWidth={4} strokeLinejoin="round" />
      <path d={`M${cx} ${cy - r * 1.9} V${cy - r * 2.6} M${cx - r * 0.28} ${cy - r * 2.35} H${cx + r * 0.28}`} stroke={OL} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {glow > 0 && <circle cx={0} cy={-260} r={340} fill="url(#warmGlow)" opacity={glow} />}
      <rect x={-200} y={-240} width={400} height={240} fill="#F4F2EC" stroke={OL} strokeWidth={5} />
      <path d="M-200 -240 Q-100 -290 0 -240 Q100 -290 200 -240" fill="#F4F2EC" stroke={OL} strokeWidth={5} />
      {[-120, 0, 120].map((cx) => <path key={cx} d={`M${cx - 26} -40 V-150 Q${cx} -186 ${cx + 26} -150 V-40 Z`} fill={cx === 0 ? '#5E3A20' : '#7FB2E5'} stroke={OL} strokeWidth={4} />)}
      {onion(-140, -300, 42)}{onion(140, -300, 42)}{onion(0, -360, 66)}
    </g>
  );
};

/** Byzantine great church (Hagia Sophia as it was in the 10th century: dome and half-domes, no minarets). */
export const ByzDome: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-330} y={-200} width={660} height={200} fill="#E8C9A0" stroke={OL} strokeWidth={5} />
    <path d="M-330 -200 Q-250 -290 -170 -200 Z M170 -200 Q250 -290 330 -200 Z" fill="#C9A66B" stroke={OL} strokeWidth={5} />
    <rect x={-190} y={-270} width={380} height={70} fill="#E8C9A0" stroke={OL} strokeWidth={5} />
    <path d="M-180 -270 Q0 -470 180 -270 Z" fill="#9AB0BE" stroke={OL} strokeWidth={6} strokeLinejoin="round" />
    {[...Array(9)].map((_, i) => <rect key={i} x={-160 + i * 38} y={-262} width={14} height={28} rx={7} fill="#F2C46A" stroke={OL} strokeWidth={2.5} />)}
    {[...Array(6)].map((_, i) => <path key={i} d={`M${-280 + i * 112} -40 V-130 Q${-256 + i * 112} -160 ${-232 + i * 112} -130 V-40 Z`} fill="#8C5A3A" stroke={OL} strokeWidth={4} />)}
    <path d="M0 -380 V-430 M-16 -414 H16" stroke={OL} strokeWidth={5} strokeLinecap="round" />
  </g>
);

/** Mongol ger (yurt). Origin = ground centre. */
export const Ger: React.FC<{ x: number; y: number; s?: number; c?: string; trim?: string; door?: string }> = ({ x, y, s = 1, c = '#F1E6D0', trim = '#B3261E', door = '#E2B13C' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-170 0 V-120 Q0 -150 170 -120 V0 Z" fill={c} stroke={OL} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-180 -118 Q0 -260 180 -118 Q0 -150 -180 -118 Z" fill={c} stroke={OL} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-170 -60 Q0 -86 170 -60" stroke={trim} strokeWidth={12} fill="none" />
    <path d="M-150 -150 Q0 -220 150 -150" stroke={trim} strokeWidth={8} fill="none" />
    <rect x={-34} y={-96} width={68} height={96} fill={door} stroke={OL} strokeWidth={4} />
    <path d="M-34 -48 H34 M0 -96 V0" stroke={OL} strokeWidth={2.5} />
  </g>
);

/** Steppe camp of the khan: grass plain, gers, horse-tail standards, a big ger at the centre. */
export const KhanCamp: React.FC<{ winter?: boolean }> = ({ winter }) => {
  const f = onTwos(useCurrentFrame());
  const tug = (x: number, y: number) => (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 V-300" stroke="#5E3A20" strokeWidth={9} />
      <path d="M-12 -300 L0 -330 L12 -300 Z" fill="#9AA0A6" stroke={OL} strokeWidth={3} />
      <path d={`M0 -296 q${-22 + Math.sin(f / 6) * 8} 60 ${-10 + Math.sin(f / 6) * 12} 120 M0 -296 q${18 + Math.sin(f / 7) * 8} 60 ${8 + Math.sin(f / 7) * 12} 130`} stroke="#F4ECD8" strokeWidth={14} fill="none" strokeLinecap="round" />
    </g>
  );
  return (
    <>
      <Layer depth={0}><rect x={-300} y={-300} width={2600} height={1700} fill={winter ? 'url(#skyWinter)' : 'url(#skyDust)'} /></Layer>
      <Layer depth={0.25}>
        <Hills y={560} fill={winter ? '#C4CCD4' : '#C9B88A'} amp={18} seed="kc" stroke={false} />
        {[...Array(9)].map((_, i) => <Ger key={i} x={-120 + i * 260} y={600} s={0.32} />)}
      </Layer>
      <Layer depth={0.55}>
        <path d="M-300 620 L2300 620 L2300 1500 L-300 1500 Z" fill={winter ? SNOW : '#C4B47A'} stroke={OL} strokeWidth={3} />
        <Ger x={960} y={700} s={1.25} c="#F4ECD8" trim="#B3261E" door="#E2B13C" />
        {tug(560, 720)}{tug(1360, 720)}
      </Layer>
    </>
  );
};

/** Distant smoke column (restrained way to show a burning town). Origin = base. */
export const SmokeColumn: React.FC<{ x: number; y: number; s?: number; at?: number; seed?: string }> = ({ x, y, s = 1, at = 0, seed = 'sc' }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at, at + 30], [0, 1]);
  if (k <= 0) return null;
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={0.85 * k}>
    {[...Array(7)].map((_, i) => { const t = ((f - at) * 0.6 + i * 40) % 280; return <circle key={i} cx={Math.sin((t + i * 30) / 40) * 30 + t * 0.35} cy={-t * 1.6 * k} r={30 + t * 0.35} fill={i % 2 ? '#7A7A7A' : '#8E8E8E'} opacity={1 - t / 300} />; })}
  </g>;
};
