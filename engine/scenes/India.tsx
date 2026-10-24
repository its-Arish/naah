import React from 'react';
import { useCurrentFrame, onTwos, random, interpolate, Easing, springPop, gravityDrop } from '../lib/core';
import { Layer } from '../fx/Camera';
import { OL, Cloud, Hills, Tree, Bush, Fronds } from './Parts';

// ---------------------------------------------------------------- animals
/** Side-view horse with a gallop / walk / idle cycle. Origin = ground under the belly. Faces right. */
export const Horse: React.FC<{ x: number; y: number; s?: number; flip?: boolean; gait?: 'idle' | 'walk' | 'gallop'; color?: string; saddle?: boolean; phase?: number; silhouette?: boolean }> = ({ x, y, s = 1, flip, gait = 'idle', color = '#8A5A3A', saddle = true, phase = 0, silhouette }) => {
  const f = onTwos(useCurrentFrame()) + phase;
  const sp = gait === 'gallop' ? 1.6 : gait === 'walk' ? 0.7 : 0;
  const p = (f * sp) / 3;
  const leg = (o: number, amp: number) => (sp ? Math.sin(p + o) * amp : 0);
  const bob = gait === 'gallop' ? -Math.abs(Math.sin(p)) * 14 : gait === 'walk' ? -Math.abs(Math.sin(p)) * 4 : 0;
  const pitch = gait === 'gallop' ? Math.sin(p) * 4 : 0;
  const fill = silhouette ? '#1A1410' : color;
  const st = silhouette ? '#1A1410' : OL;
  const Leg = ({ hx, o, amp }: { hx: number; o: number; amp: number }) => (
    <g transform={`rotate(${leg(o, amp)} ${hx} -100)`}>
      <path d={`M${hx - 9} -100 L${hx + 9} -100 L${hx + 7} -14 L${hx - 7} -14 Z`} fill={fill} stroke={st} strokeWidth={3} />
      <rect x={hx - 9} y={-16} width={18} height={14} rx={3} fill={silhouette ? '#1A1410' : '#2A1B12'} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g transform={`translate(0 ${bob}) rotate(${pitch} 0 -120)`}>
        <Leg hx={-62} o={0.6} amp={28} />
        <Leg hx={58} o={2.2} amp={30} />
        {/* tail */}
        <path d={`M-96 -150 Q${-140 + (sp ? Math.sin(p * 1.3) * 10 : 0)} -130 ${-128 + (sp ? Math.sin(p) * 14 : 0)} -70 Q-112 -110 -92 -128 Z`} fill={silhouette ? '#1A1410' : '#3A2416'} stroke={st} strokeWidth={3} />
        {/* body */}
        <path d="M-100 -150 Q-104 -96 -60 -92 L60 -92 Q100 -96 100 -140 Q96 -176 40 -176 L-60 -176 Q-98 -176 -100 -150 Z" fill={fill} stroke={st} strokeWidth={3.5} />
        {/* neck + head */}
        <path d="M60 -170 Q80 -230 112 -250 Q150 -262 160 -236 L140 -214 Q118 -220 104 -196 L96 -140 Z" fill={fill} stroke={st} strokeWidth={3.5} strokeLinejoin="round" />
        <path d="M112 -250 L106 -272 L124 -256 Z" fill={fill} stroke={st} strokeWidth={3} />
        <path d={`M70 -186 Q90 -236 114 -252`} stroke={silhouette ? '#1A1410' : '#3A2416'} strokeWidth={14} fill="none" strokeLinecap="round" />
        {!silhouette && <circle cx={132} cy={-240} r={4} fill={OL} />}
        <Leg hx={-44} o={0} amp={32} />
        <Leg hx={76} o={3.0} amp={34} />
        {saddle && !silhouette && (
          <g>
            <path d="M-36 -178 Q0 -196 36 -178 L30 -150 L-30 -150 Z" fill="#8C1D18" stroke={OL} strokeWidth={3} />
            <path d="M-30 -150 L30 -150" stroke="#E2B13C" strokeWidth={4} />
          </g>
        )}
      </g>
    </g>
  );
};

/** Camel carrying treasure chests. Faces right. */
export const Camel: React.FC<{ x: number; y: number; s?: number; flip?: boolean; walk?: boolean; load?: boolean; silhouette?: boolean; phase?: number }> = ({ x, y, s = 1, flip, walk = true, load = true, silhouette, phase = 0 }) => {
  const f = onTwos(useCurrentFrame()) + phase;
  const p = walk ? f / 4 : 0;
  const fill = silhouette ? '#1A1410' : '#C9A06A';
  const st = silhouette ? '#1A1410' : OL;
  const L = ({ hx, o }: { hx: number; o: number }) => (
    <path transform={`rotate(${walk ? Math.sin(p + o) * 18 : 0} ${hx} -110)`} d={`M${hx - 7} -110 L${hx + 7} -110 L${hx + 5} 0 L${hx - 5} 0 Z`} fill={fill} stroke={st} strokeWidth={3} />
  );
  return (
    <g transform={`translate(${x} ${y + (walk ? -Math.abs(Math.sin(p)) * 4 : 0)}) scale(${flip ? -s : s} ${s})`}>
      <L hx={-50} o={0.5} /><L hx={50} o={2.4} />
      <path d="M-90 -130 Q-96 -100 -60 -100 L70 -100 Q96 -104 92 -136 Q86 -170 50 -176 Q30 -230 0 -176 Q-30 -228 -60 -170 Q-88 -164 -90 -130 Z" fill={fill} stroke={st} strokeWidth={3.5} />
      <path d="M80 -130 Q120 -170 120 -220 Q122 -250 150 -250 Q172 -246 168 -226 L140 -220 Q140 -170 100 -110 Z" fill={fill} stroke={st} strokeWidth={3.5} strokeLinejoin="round" />
      {!silhouette && <circle cx={152} cy={-238} r={4} fill={OL} />}
      <L hx={-34} o={0} /><L hx={66} o={3.1} />
      {load && (
        <g>
          <rect x={-60} y={-232} width={56} height={44} rx={4} fill={silhouette ? '#1A1410' : '#8C5A2A'} stroke={st} strokeWidth={3} />
          <rect x={0} y={-226} width={50} height={38} rx={4} fill={silhouette ? '#1A1410' : '#8C5A2A'} stroke={st} strokeWidth={3} />
          {!silhouette && <path d="M-60 -214 h56 M0 -210 h50" stroke="#E2B13C" strokeWidth={4} />}
          {!silhouette && <circle cx={-32} cy={-236} r={6} fill="#F2C230" stroke={OL} strokeWidth={2} />}
        </g>
      )}
    </g>
  );
};

/** War elephant (for later acts too). Faces right. */
export const Elephant: React.FC<{ x: number; y: number; s?: number; flip?: boolean; walk?: boolean; howdah?: boolean; phase?: number; panic?: boolean }> = ({ x, y, s = 1, flip, walk, howdah = true, phase = 0, panic }) => {
  const f = onTwos(useCurrentFrame()) + phase;
  const p = walk ? f / 5 : 0;
  const trunk = Math.sin(f / 9) * 8 + (panic ? -40 : 0);
  const L = ({ hx, o }: { hx: number; o: number }) => (
    <path transform={`rotate(${walk ? Math.sin(p + o) * 12 : 0} ${hx} -90)`} d={`M${hx - 18} -90 L${hx + 18} -90 L${hx + 16} 0 L${hx - 16} 0 Z`} fill="#8E8A96" stroke={OL} strokeWidth={3.5} />
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <L hx={-70} o={0.4} /><L hx={50} o={2.5} />
      <path d="M-120 -120 Q-130 -230 -10 -240 Q100 -240 110 -150 Q112 -100 80 -80 L-100 -80 Q-124 -90 -120 -120 Z" fill="#9E9AA6" stroke={OL} strokeWidth={3.5} />
      <path d={`M100 -180 Q160 -170 150 -110 Q${146 + trunk} -40 ${130 + trunk} -10 L${116 + trunk} -14 Q${128 + trunk / 2} -60 120 -110 Q110 -130 96 -130 Z`} fill="#9E9AA6" stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M30 -210 Q-20 -200 -10 -140 Q30 -120 60 -150 Z" fill="#8E8A96" stroke={OL} strokeWidth={3} />
      <path d="M126 -120 Q150 -110 160 -92" stroke="#F4EEDD" strokeWidth={8} strokeLinecap="round" fill="none" />
      {panic ? (
        <g><circle cx={112} cy={-186} r={12} fill="#fff" stroke={OL} strokeWidth={3} /><circle cx={114} cy={-184} r={3} fill={OL} /></g>
      ) : <circle cx={112} cy={-186} r={5} fill={OL} />}
      <L hx={-50} o={0} /><L hx={70} o={3.0} />
      {howdah && (
        <g>
          <path d="M-90 -236 L60 -236 L50 -200 L-80 -200 Z" fill="#8C1D18" stroke={OL} strokeWidth={3} />
          <path d="M-80 -236 L-70 -290 L40 -290 L50 -236 Z" fill="#E2B13C" stroke={OL} strokeWidth={3} />
          <path d="M-74 -290 Q-16 -330 44 -290 Z" fill="#B3261E" stroke={OL} strokeWidth={3} />
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- backgrounds
export const DelhiGate: React.FC<{ dusk?: boolean; silhouette?: boolean }> = ({ dusk = true, silhouette }) => {
  const sand = silhouette ? '#2A1E1A' : '#B5543A';
  return (
    <>
      <Layer depth={0}>
        <rect x={-200} y={-200} width={2400} height={1500} fill={dusk ? 'url(#skySunrise)' : 'url(#skyDay)'} />
        {dusk && <circle cx={1500} cy={640} r={280} fill="url(#sunGlow)" />}
        {dusk && <circle cx={1500} cy={640} r={80} fill="#FFE2A0" />}
      </Layer>
      <Layer depth={0.3}>
        <Hills y={720} fill={silhouette ? '#3A2A2A' : '#C99A6A'} amp={30} seed="dg1" stroke={false} />
      </Layer>
      <Layer depth={0.6}>
        {/* city wall */}
        <rect x={-200} y={520} width={2400} height={260} fill={sand} stroke={silhouette ? 'none' : OL} strokeWidth={3} />
        {[...Array(30)].map((_, i) => <rect key={i} x={-200 + i * 84} y={492} width={46} height={32} fill={sand} stroke={silhouette ? 'none' : OL} strokeWidth={2.5} />)}
        {/* the gate */}
        <g transform="translate(560 780)">
          <path d="M-220 0 L-220 -420 L220 -420 L220 0 Z" fill={sand} stroke={silhouette ? 'none' : OL} strokeWidth={4} />
          <path d="M-110 0 L-110 -220 Q0 -340 110 -220 L110 0 Z" fill={silhouette ? '#F4B27A' : '#4A2418'} stroke={silhouette ? 'none' : OL} strokeWidth={4} />
          {silhouette && <ellipse cx={0} cy={-120} rx={90} ry={140} fill="url(#sunGlow)" />}
          {!silhouette && <path d="M-180 -380 L180 -380 M-180 -260 L-140 -260 M140 -260 L180 -260" stroke="#E8D5B0" strokeWidth={8} />}
          {[-200, 200].map((cx) => (
            <g key={cx}>
              <path d={`M${cx - 50} -420 L${cx - 50} -520 Q${cx} -600 ${cx + 50} -520 L${cx + 50} -420 Z`} fill={sand} stroke={silhouette ? 'none' : OL} strokeWidth={4} />
              {!silhouette && <path d={`M${cx - 50} -520 Q${cx} -600 ${cx + 50} -520`} fill="#F1E6D0" stroke={OL} strokeWidth={3} />}
            </g>
          ))}
        </g>
      </Layer>
      <Layer depth={0.85}>
        <path d="M-200 780 L2200 780 L2200 1300 L-200 1300 Z" fill={silhouette ? '#1E1612' : '#C9A06A'} stroke={silhouette ? 'none' : OL} strokeWidth={3} />
        <path d="M400 780 L720 780 L1400 1300 L-100 1300 Z" fill={silhouette ? '#241A16' : '#D8B47E'} opacity={0.8} />
      </Layer>
    </>
  );
};

/** Desert road to the horizon (for the treasure train). */
export const DesertRoad: React.FC = () => (
  <>
    <Layer depth={0}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="url(#skySunrise)" />
      <circle cx={420} cy={560} r={260} fill="url(#sunGlow)" />
    </Layer>
    <Layer depth={0.3}>
      <Hills y={600} fill="#B98A5E" amp={40} seed="dr1" stroke={false} />
    </Layer>
    <Layer depth={0.6}>
      <path d="M-200 600 L2200 600 L2200 1300 L-200 1300 Z" fill="#D8B47E" stroke={OL} strokeWidth={3} />
      <path d="M940 600 L1000 600 L1900 1300 L60 1300 Z" fill="#C9A06A" />
    </Layer>
  </>
);

export const RajputFort: React.FC = () => (
  <>
    <Layer depth={0}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDay)" />
      <Cloud x={300} y={160} s={1} speed={0.3} />
    </Layer>
    <Layer depth={0.3}>
      <path d="M-200 700 Q300 420 900 520 Q1400 380 2200 600 L2200 1300 L-200 1300 Z" fill="#B98A5E" stroke={OL} strokeWidth={3} />
      {/* hill fort with crenellated walls and chhatri domes */}
      <g transform="translate(1180 470)">
        <path d="M-380 60 L-360 -90 L380 -90 L400 60 Z" fill="#D8A066" stroke={OL} strokeWidth={3.5} />
        {[...Array(18)].map((_, i) => <rect key={i} x={-360 + i * 42} y={-112} width={24} height={24} fill="#D8A066" stroke={OL} strokeWidth={2.5} />)}
        {[-260, 0, 260].map((cx) => (
          <g key={cx}>
            <rect x={cx - 60} y={-210} width={120} height={120} fill="#E2B07A" stroke={OL} strokeWidth={3} />
            <path d={`M${cx - 66} -210 Q${cx} -300 ${cx + 66} -210 Z`} fill="#F1E6D0" stroke={OL} strokeWidth={3} />
            <path d={`M${cx - 30} -150 Q${cx} -186 ${cx + 30} -150 L${cx + 30} -110 L${cx - 30} -110 Z`} fill="#6B3A22" stroke={OL} strokeWidth={2.5} />
          </g>
        ))}
      </g>
    </Layer>
    <Layer depth={0.7}>
      <path d="M-200 800 Q800 760 2200 810 L2200 1300 L-200 1300 Z" fill="#D8B47E" stroke={OL} strokeWidth={3} />
      <Bush x={140} y={820} s={0.8} c="#8A9A4A" /><Bush x={1760} y={830} s={0.7} c="#8A9A4A" />
    </Layer>
  </>
);

/** Afghan mountain passes. */
export const Passes: React.FC = () => (
  <>
    <Layer depth={0}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDay)" />
    </Layer>
    <Layer depth={0.2}>
      <path d="M-200 600 L100 260 L380 520 L640 200 L960 560 L1240 240 L1560 520 L1840 280 L2200 600 Z" fill="#9C8A78" stroke={OL} strokeWidth={3} />
      <path d="M100 260 L160 330 L60 320 Z M640 200 L700 270 L590 266 Z M1240 240 L1300 310 L1190 300 Z M1840 280 L1900 350 L1790 340 Z" fill="#F4F7FA" />
    </Layer>
    <Layer depth={0.5}>
      <path d="M-200 760 L200 480 L560 760 L900 420 L1300 760 L1640 470 L2200 760 L2200 1300 L-200 1300 Z" fill="#8A6E58" stroke={OL} strokeWidth={3} />
    </Layer>
    <Layer depth={0.8}>
      <path d="M-200 880 Q960 760 2200 880 L2200 1300 L-200 1300 Z" fill="#B09070" stroke={OL} strokeWidth={3} />
      <path d="M600 880 Q960 830 1320 880 L1600 1300 L320 1300 Z" fill="#C4A27E" />
    </Layer>
  </>
);

/** Temple treasury interior: gold doors, lamps, chests. No deity shown. */
export const TempleVault: React.FC<{ emptied?: number }> = ({ emptied = 0 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer depth={0.3}>
        <rect x={-200} y={-200} width={2400} height={1500} fill="#5A4636" />
        {[...Array(12)].map((_, i) => <path key={i} d={`M${-200 + i * 200} -200 V1300`} stroke="#4A382A" strokeWidth={6} />)}
        {[...Array(8)].map((_, i) => <path key={i} d={`M-200 ${i * 140} H2200`} stroke="#4A382A" strokeWidth={4} />)}
        {/* golden doors */}
        <g transform="translate(960 760)">
          <path d="M-240 0 L-240 -480 Q0 -620 240 -480 L240 0 Z" fill="#7A5A30" stroke={OL} strokeWidth={5} />
          <rect x={-200} y={-470} width={196} height={470} fill="#E2B13C" stroke={OL} strokeWidth={4} />
          <rect x={4} y={-470} width={196} height={470} fill="#E2B13C" stroke={OL} strokeWidth={4} />
          {[...Array(4)].map((_, r) => [...Array(2)].map((_, c) => (
            <g key={r + '-' + c}>
              <rect x={-180 + c * 200} y={-450 + r * 112} width={156} height={92} fill="none" stroke="#B8862A" strokeWidth={5} />
              {[0, 1, 2].map((k) => <circle key={k} cx={-150 + c * 200 + k * 48} cy={-404 + r * 112} r={9} fill={['#B3261E', '#2E9A4A', '#2E6FD1'][(k + r + c) % 3]} stroke={OL} strokeWidth={2} />)}
            </g>
          )))}
        </g>
      </Layer>
      <Layer depth={0.7}>
        <path d="M-200 760 L2200 760 L2200 1300 L-200 1300 Z" fill="#6E5642" stroke={OL} strokeWidth={3} />
        {/* lamps on tall stands */}
        {[360, 1560].map((x, i) => {
          const k = Math.floor(f / 3);
          const h = 26 + random('vl' + i + k) * 10;
          return (
            <g key={x} transform={`translate(${x} 760)`}>
              <circle cx={0} cy={-470} r={120} fill="url(#warmGlow)" />
              <path d="M-10 0 L-6 -440 L6 -440 L10 0 Z M-50 0 L50 0 L30 -20 L-30 -20 Z" fill="#E2B13C" stroke={OL} strokeWidth={3} />
              <path d="M-40 -440 Q0 -416 40 -440 Z" fill="#E2B13C" stroke={OL} strokeWidth={3} />
              {[-24, 0, 24].map((dx) => <path key={dx} d={`M${dx} -444 Q${dx - 7} -456 ${dx} ${-444 - h} Q${dx + 7} -456 ${dx} -444`} fill="#FFB21E" />)}
            </g>
          );
        })}
        {/* chests of coins */}
        {[[520, 860], [1400, 870], [760, 900], [1160, 905]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${1 - emptied * 0.0})`} opacity={1 - emptied}>
            <rect x={-80} y={-60} width={160} height={70} rx={6} fill="#8C5A2A" stroke={OL} strokeWidth={3.5} />
            <path d="M-84 -60 Q0 -110 84 -60" fill="#F2C230" stroke={OL} strokeWidth={3} />
            {[...Array(6)].map((_, k) => <circle key={k} cx={-50 + k * 20} cy={-76 + Math.abs(k - 2.5) * 6} r={10} fill="#F2C230" stroke={OL} strokeWidth={2} />)}
            <rect x={-8} y={-40} width={16} height={20} fill="#E2B13C" stroke={OL} strokeWidth={2} />
          </g>
        ))}
      </Layer>
    </>
  );
};

/** Somnath-style shikhara temple on the coast with sea. */
export const SomnathCoast: React.FC = () => {
  const f = onTwos(useCurrentFrame(), 2);
  return (
    <>
      <Layer depth={0}>
        <rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDay)" />
        <Cloud x={200} y={140} s={1} speed={0.3} />
      </Layer>
      <Layer depth={0.3}>
        <rect x={-200} y={560} width={2400} height={200} fill="#4F8FB8" />
        {[...Array(12)].map((_, i) => <path key={i} d={`M${-200 + i * 200 + ((f * 1.5) % 200)} ${600 + (i % 3) * 40} q20 -12 40 0 q20 12 40 0`} stroke="#DDEFF7" strokeWidth={4} fill="none" />)}
      </Layer>
      <Layer depth={0.55}>
        <path d="M-200 700 Q600 660 1200 700 L2200 690 L2200 1300 L-200 1300 Z" fill="#E2C98E" stroke={OL} strokeWidth={3} />
        {/* the temple: stepped base + curved shikhara tower */}
        <g transform="translate(1320 720)">
          <path d="M-300 0 L300 0 L270 -50 L-270 -50 Z" fill="#E8D5B0" stroke={OL} strokeWidth={3.5} />
          <rect x={-240} y={-210} width={200} height={160} fill="#F1E2C0" stroke={OL} strokeWidth={3.5} />
          <path d="M-240 -210 L-140 -290 L-40 -210 Z" fill="#E8D5B0" stroke={OL} strokeWidth={3} />
          <rect x={-40} y={-260} width={260} height={210} fill="#F1E2C0" stroke={OL} strokeWidth={3.5} />
          <path d="M-30 -260 Q-30 -440 90 -540 Q210 -440 210 -260 Z" fill="#E8D5B0" stroke={OL} strokeWidth={4} />
          {[...Array(6)].map((_, i) => <path key={i} d={`M${-20 + i * 4} ${-290 - i * 40} Q90 ${-300 - i * 40} ${200 - i * 4} ${-290 - i * 40}`} stroke="#C8B48E" strokeWidth={3} fill="none" />)}
          <circle cx={90} cy={-548} r={16} fill="#E2B13C" stroke={OL} strokeWidth={3} />
          <path d="M90 -564 V-610" stroke={OL} strokeWidth={4} />
          <path d={`M90 -610 L${130 + Math.sin(f / 4) * 6} -598 L90 -586 Z`} fill="#E8862A" stroke={OL} strokeWidth={2.5} />
          <rect x={50} y={-160} width={80} height={110} rx={40} fill="#6B4A2B" stroke={OL} strokeWidth={3} />
        </g>
      </Layer>
      <Layer depth={1.25}>
        <Fronds x={60} y={1110} s={1.2} c="#2F4A2A" />
      </Layer>
    </>
  );
};

/** Wide flat North Indian plain (Tarain) with distant tents. */
export const Plain: React.FC<{ dawn?: boolean; tents?: boolean }> = ({ dawn, tents = true }) => (
  <>
    <Layer depth={0}>
      <rect x={-200} y={-200} width={2400} height={1500} fill={dawn ? 'url(#skyDawn)' : 'url(#skyDay)'} />
      {dawn && <circle cx={1600} cy={560} r={220} fill="url(#sunGlow)" />}
    </Layer>
    <Layer depth={0.3}>
      <Hills y={600} fill={dawn ? '#9AA07A' : '#A8B07A'} amp={20} seed="pl1" stroke={false} />
      {[...Array(9)].map((_, i) => <Tree key={i} x={-60 + i * 260} y={620} s={0.45} c="#6E8F4A" c2="#5A7A3A" />)}
    </Layer>
    <Layer depth={0.6}>
      <path d="M-200 640 L2200 640 L2200 1300 L-200 1300 Z" fill={dawn ? '#B8B07A' : '#C4BC84'} stroke={OL} strokeWidth={3} />
      {tents && [...Array(6)].map((_, i) => <Tent key={i} x={140 + i * 330} y={690} s={0.5} closed c={i % 2 ? '#F1E6D0' : '#E8C9A0'} />)}
    </Layer>
  </>
);

export const Tent: React.FC<{ x: number; y: number; s?: number; closed?: boolean; c?: string; flag?: string }> = ({ x, y, s = 1, closed = true, c = '#F1E6D0', flag = '#E8862A' }) => {
  const f = onTwos(useCurrentFrame());
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-180 0 L0 -220 L180 0 Z" fill={c} stroke={OL} strokeWidth={4} strokeLinejoin="round" />
      <path d="M-180 0 Q0 -30 180 0" stroke="#B3261E" strokeWidth={8} fill="none" />
      {closed ? <path d="M0 -160 L-30 0 M0 -160 L30 0" stroke={OL} strokeWidth={3} /> : <path d="M0 -160 L-60 0 L60 0 Z" fill="#3A2A1E" />}
      <path d="M0 -220 V-290" stroke={OL} strokeWidth={5} />
      <path d={`M0 -290 L${54 + Math.sin(f / 4) * 6} -276 L0 -262 Z`} fill={flag} stroke={OL} strokeWidth={2.5} />
    </g>
  );
};

/** Inside a big Rajput camp tent (for the sketch). */
export const TentInterior: React.FC = () => (
  <>
    <Layer depth={0.3}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#E8C9A0" />
      {[...Array(14)].map((_, i) => <path key={i} d={`M${-200 + i * 180} -200 Q${-110 + i * 180} 400 ${-200 + i * 180} 760`} stroke="#D2AE80" strokeWidth={10} fill="none" />)}
      <path d="M-200 60 Q960 -40 2200 60" stroke="#B3261E" strokeWidth={26} fill="none" />
      <path d="M-200 60 Q960 -40 2200 60" stroke="#E2B13C" strokeWidth={6} fill="none" strokeDasharray="20 16" />
    </Layer>
    <Layer depth={0.6}>
      <path d="M-200 760 L2200 760 L2200 1300 L-200 1300 Z" fill="#8C1D18" stroke={OL} strokeWidth={3} />
      <path d="M200 800 L1720 800 L1820 1080 L100 1080 Z" fill="none" stroke="#E2B13C" strokeWidth={6} />
      {/* low royal seat */}
      <g transform="translate(560 800)">
        <rect x={-150} y={-70} width={300} height={70} rx={10} fill="#E2B13C" stroke={OL} strokeWidth={3.5} />
        <rect x={-130} y={-200} width={260} height={140} rx={30} fill="#B3261E" stroke={OL} strokeWidth={3.5} />
        <circle cx={-150} cy={-80} r={24} fill="#E8862A" stroke={OL} strokeWidth={3} />
        <circle cx={150} cy={-80} r={24} fill="#E8862A" stroke={OL} strokeWidth={3} />
      </g>
    </Layer>
  </>
);

// ---------------------------------------------------------------- inserts
/** Stylised Indian subcontinent outline (c. 1000 AD, no modern borders) in a 1000×1100 box. */
export const SUB_PTS: [number, number][] = [
  [330, 0], [420, 30], [440, 90], [400, 140], [450, 190], [520, 230], [600, 270], [700, 300], [780, 300], [860, 280], [940, 300], [990, 340], [960, 380], [900, 400],
  [860, 450], [820, 420], [780, 440], [760, 480], [720, 470], [700, 520], [650, 560], [600, 600], [560, 650], [530, 720], [500, 800], [470, 880], [440, 960],
  [410, 1040], [380, 1090], [350, 1050], [320, 960], [290, 860], [260, 760], [230, 680], [200, 640], [150, 620], [110, 600], [60, 560], [90, 520], [60, 480],
  [120, 460], [150, 420], [190, 380], [220, 320], [260, 250], [240, 180], [280, 120], [300, 60],
];
export const subPath = () => 'M' + SUB_PTS.map((p) => p.join(' ')).join(' L') + ' Z';

type Pt = [number, number];
function clipHalf(poly: Pt[], a: Pt, b: Pt): Pt[] {
  // keep points closer to a than to b
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, nx = b[0] - a[0], ny = b[1] - a[1];
  const side = (p: Pt) => (p[0] - mx) * nx + (p[1] - my) * ny;
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    const sp = side(p), sq = side(q);
    if (sp <= 0) out.push(p);
    if (sp * sq < 0) { const t = sp / (sp - sq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
  }
  return out;
}
/** Voronoi cells inside the subcontinent box — computed once. */
export const KINGDOMS = (() => {
  const seeds: Pt[] = [];
  let i = 0;
  while (seeds.length < 46 && i < 4000) {
    const p: Pt = [random('ks' + i) * 1000, random('kt' + i) * 1100];
    i++;
    // keep roughly inside (cheap polygon test)
    let inside = false;
    for (let a = 0, b = SUB_PTS.length - 1; a < SUB_PTS.length; b = a++) {
      const [xa, ya] = SUB_PTS[a], [xb, yb] = SUB_PTS[b];
      if (ya > p[1] !== yb > p[1] && p[0] < ((xb - xa) * (p[1] - ya)) / (yb - ya) + xa) inside = !inside;
    }
    if (inside && seeds.every((s) => Math.hypot(s[0] - p[0], s[1] - p[1]) > 70)) seeds.push(p);
  }
  const pal = ['#E07A5F', '#F2CC8F', '#81B29A', '#9DB4C0', '#E2B13C', '#C07A9C', '#7FA7D9', '#B5B35C', '#D98C5F', '#A3C4A8', '#E6A4B4', '#C9B27C'];
  return seeds.map((s, k) => {
    let cell: Pt[] = [[-20, -20], [1020, -20], [1020, 1120], [-20, 1120]];
    seeds.forEach((o, j) => { if (j !== k) cell = clipHalf(cell, s, o); });
    return { seed: s, poly: cell, c: pal[k % pal.length] };
  });
})();

export const KingdomMap: React.FC<{ x: number; y: number; s?: number; wobble?: boolean; unify?: number; unifyColor?: string; at?: number }> = ({ x, y, s = 1, wobble = true, unify = 0, unifyColor = '#E8862A', at = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs><clipPath id="subclip"><path d={subPath()} /></clipPath></defs>
      <path d={subPath()} fill="#C9B79A" stroke={OL} strokeWidth={6} transform="translate(10 12)" opacity={0.35} />
      <g clipPath="url(#subclip)">
        <rect x={-20} y={-20} width={1040} height={1140} fill="#E8DCC0" />
        {KINGDOMS.map((k, i) => {
          const appear = springPop(f, at + i * 0.6);
          const w = wobble ? 1 + Math.sin(f / 5 + i * 1.7) * 0.035 : 1;
          const col = unify > (i / KINGDOMS.length) ? unifyColor : k.c;
          return (
            <polygon key={i} points={k.poly.map((p) => p.join(',')).join(' ')} fill={col} stroke={OL} strokeWidth={3}
              transform={`translate(${k.seed[0]} ${k.seed[1]}) scale(${w * appear}) translate(${-k.seed[0]} ${-k.seed[1]})`} />
          );
        })}
      </g>
      <path d={subPath()} fill="none" stroke={OL} strokeWidth={6} strokeLinejoin="round" />
    </g>
  );
};

/** World-GDP pie chart with India's wedge. share 0..1. */
export const GdpPie: React.FC<{ x: number; y: number; r?: number; share: number; label?: string }> = ({ x, y, r = 300, share, label = 'INDIA' }) => {
  const a = share * Math.PI * 2;
  const x1 = Math.sin(a) * r, y1 = -Math.cos(a) * r;
  const large = share > 0.5 ? 1 : 0;
  const mid = a / 2;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 8} fill="#1A1410" opacity={0.3} transform="translate(10 12)" />
      <circle r={r} fill="#9DB4C0" stroke={OL} strokeWidth={6} />
      {[0.32, 0.55, 0.78].map((t, i) => <path key={i} d={`M0 0 L${Math.sin(t * 6.283) * r} ${-Math.cos(t * 6.283) * r}`} stroke={OL} strokeWidth={3} opacity={0.5} />)}
      {share > 0.002 && <path d={`M0 0 L0 ${-r} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`} fill="#E8862A" stroke={OL} strokeWidth={6} strokeLinejoin="round" transform={`translate(${Math.sin(mid) * 18} ${-Math.cos(mid) * 18})`} />}
      <text x={Math.sin(mid) * r * 0.6 + Math.sin(mid) * 18} y={-Math.cos(mid) * r * 0.6 + 14} textAnchor="middle" fontFamily="Hand" fontSize={share > 0.08 ? 50 : 34} fill="#fff" stroke={OL} strokeWidth={6} style={{ paintOrder: 'stroke' }}>{label}</text>
      <text x={-r * 0.35} y={r * 0.35} textAnchor="middle" fontFamily="Hand" fontSize={46} fill="#fff" stroke={OL} strokeWidth={6} style={{ paintOrder: 'stroke' }}>rest of world</text>
    </g>
  );
};

/** Corner tally / counter box (e.g. "RAID 1 OF 17"). */
export const Tally: React.FC<{ text: string; x?: number; y?: number; bump?: number }> = ({ text, x = 1880, y = 40, bump = 99 }) => {
  const s = bump < 12 ? springPop(bump, 0) * 0.15 + 0.85 + (bump < 3 ? 0.15 : 0) : 1;
  return (
    <div style={{ position: 'absolute', right: 1920 - x, top: y, transform: `scale(${s})`, transformOrigin: 'right top', background: '#1A1410', color: '#FFD84A', fontFamily: 'TagBold', fontSize: 46, padding: '8px 22px', borderRadius: 6, border: '3px solid #FFD84A', letterSpacing: 2 }}>
      {text}
    </div>
  );
};

/** Gold coins flying out under real gravity (used in raids). */
export const CoinBurst: React.FC<{ x: number; y: number; at: number; n?: number; seed?: string }> = ({ x, y, at, n = 14, seed = 'cb' }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const t = f - at;
  return (
    <g>
      {[...Array(n)].map((_, i) => {
        const vx = (random(seed + 'x' + i) - 0.5) * 22;
        const vy = -14 - random(seed + 'y' + i) * 12;
        const g = 1.3;
        let px = x + vx * t, py = y + vy * t + 0.5 * g * t * t;
        const floor = y + 120 + random(seed + 'f' + i) * 40;
        if (py > floor) py = floor; // lands and stays
        if (py >= floor) px = x + vx * Math.min(t, (-vy + Math.sqrt(vy * vy + 2 * g * (floor - y))) / g);
        return <ellipse key={i} cx={px} cy={py} rx={11} ry={py >= floor ? 4 : 11} fill="#F2C230" stroke={OL} strokeWidth={2} />;
      })}
    </g>
  );
};

export { Fronds, Bush, Tree, Cloud, Hills, gravityDrop, interpolate, Easing };
