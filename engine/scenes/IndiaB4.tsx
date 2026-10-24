import React from 'react';
import { useCurrentFrame, onTwos, random, interpolate, Easing, spring } from '../lib/core';
import { Layer } from '../fx/Camera';
import { OL, Cloud, Hills, Tree, Bush } from './Parts';
import { subPath } from './India';

/** Night railway platform with one lamp. */
export const NightPlatform: React.FC<{ train?: number }> = ({ train = -1 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer depth={0}>
        <rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyNight)" />
        {[...Array(50)].map((_, i) => <circle key={i} cx={random('nx' + i) * 1920} cy={random('ny' + i) * 420} r={random('nr' + i) * 2 + 0.6} fill="#fff" opacity={0.6} />)}
      </Layer>
      <Layer depth={0.5}>
        {train >= 0 && (
          <g transform={`translate(${-train} 0)`}>
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${200 + i * 620} 560)`}>
                <rect x={0} y={0} width={600} height={220} rx={14} fill="#2A2E3A" stroke="#0E0A08" strokeWidth={4} />
                {[...Array(5)].map((_, k) => <rect key={k} x={30 + k * 112} y={40} width={80} height={70} fill="#F2C230" opacity={0.85} />)}
                {[80, 520].map((cx) => <circle key={cx} cx={cx} cy={226} r={30} fill="#0E0A08" />)}
              </g>
            ))}
          </g>
        )}
        <path d="M-200 790 H2200" stroke="#3A3A44" strokeWidth={10} />
      </Layer>
      <Layer depth={0.75}>
        <path d="M-200 800 L2200 800 L2200 1300 L-200 1300 Z" fill="#3A3640" stroke="#0E0A08" strokeWidth={3} />
        <path d="M-200 800 H2200" stroke="#E8DCC0" strokeWidth={8} strokeDasharray="40 30" opacity={0.5} />
        <g transform="translate(1300 800)">
          <circle cx={0} cy={-470} r={220} fill="url(#warmGlow)" opacity={0.9} />
          <path d="M-8 0 L-8 -440 L8 -440 L8 0 Z" fill="#2A2E3A" stroke="#0E0A08" strokeWidth={3} />
          <path d="M-30 -440 L30 -440 L22 -500 L-22 -500 Z" fill="#F2C230" stroke="#0E0A08" strokeWidth={3} />
          <ellipse cx={0} cy={6} rx={260} ry={40} fill="#F2C230" opacity={0.12} />
        </g>
      </Layer>
    </>
  );
};

/** Overhead plan of a walled garden with one narrow exit (no people drawn). */
export const BaghPlan: React.FC<{ hl?: number }> = ({ hl = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#2A2420" />
      <rect x={460} y={160} width={1000} height={760} fill="#7A8A5A" stroke="#C9B79A" strokeWidth={30} />
      {[...Array(6)].map((_, i) => <circle key={i} cx={560 + (i % 3) * 360} cy={300 + Math.floor(i / 3) * 460} r={50} fill="#4E6A3A" />)}
      <circle cx={1280} cy={300} r={70} fill="#6FA0B8" stroke="#C9B79A" strokeWidth={10} />
      {/* the single narrow exit */}
      <rect x={440} y={520} width={40} height={60} fill="#2A2420" />
      {hl > 0 && <g><rect x={420} y={500} width={80} height={100} fill="none" stroke="#B3261E" strokeWidth={8} opacity={0.6 + 0.4 * Math.sin(f / 4)} /><path d="M280 550 L410 550" stroke="#B3261E" strokeWidth={10} /><path d="M410 550 l-30 -20 l0 40 Z" fill="#B3261E" /></g>}
    </g>
  );
};

/** Grain sacks leaving a village by cart (restrained). */
export const GrainOut: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#C4AE80" />
      <path d="M0 640 H1920" stroke="#9A8460" strokeWidth={4} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${interpolate(f, [0, 200], [300 + i * 400, 1300 + i * 400])} 600)`}>
          <rect x={-120} y={-60} width={240} height={60} fill="#8C5A2A" stroke={OL} strokeWidth={4} />
          {[0, 1, 2].map((k) => <path key={k} d={`M${-100 + k * 70} -60 Q${-110 + k * 70} -120 ${-70 + k * 70} -126 Q${-30 + k * 70} -120 ${-40 + k * 70} -60 Z`} fill="#E8DCC0" stroke={OL} strokeWidth={3} />)}
          {[-80, 80].map((cx) => <circle key={cx} cx={cx} cy={10} r={32} fill="#6B4A2B" stroke={OL} strokeWidth={4} />)}
        </g>
      ))}
      <text x={1800} y={420} textAnchor="end" fontFamily="TagBold" fontSize={44} fill="#3A2A1E">→ OUT OF BENGAL</text>
    </g>
  );
};

/** Dandi march map (Gujarat coast stylised). progress 0..1 */
export const DandiMap: React.FC<{ p: number }> = ({ p }) => {
  const f = useCurrentFrame();
  const pts: [number, number][] = [[1080, 260], [1040, 380], [1000, 480], [980, 600], [940, 700], [880, 800]];
  const segs = pts.length - 1, at = p * segs, i = Math.min(segs - 1, Math.floor(at)), t = at - i;
  const hx = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, hy = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t;
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#4F8FB8" />
      <path d="M760 -20 Q1000 120 1100 300 Q1060 500 960 700 Q900 820 840 900 Q900 1000 1000 1100 L2000 1100 L2000 -20 Z" fill="#E8DCC0" stroke={OL} strokeWidth={6} />
      <path d={'M' + pts.slice(0, i + 1).map((q) => q.join(' ')).join(' L') + ` L${hx} ${hy}`} stroke="#B3261E" strokeWidth={10} strokeDasharray="20 14" fill="none" strokeLinecap="round" />
      {pts.slice(0, i + 1).map(([x, y], k) => <circle key={k} cx={x} cy={y} r={10 + k * 3} fill="#F4F7FA" stroke={OL} strokeWidth={3} />)}
      {/* the growing crowd icon */}
      <g transform={`translate(${hx} ${hy})`}>
        {[...Array(Math.min(24, 3 + Math.floor(p * 22)))].map((_, k) => <circle key={k} cx={(k % 6) * 14 - 36} cy={Math.floor(k / 6) * 14 - 20} r={7} fill="#F4F7FA" stroke={OL} strokeWidth={2} />)}
      </g>
      <circle cx={1080} cy={260} r={16} fill="#FFD84A" stroke={OL} strokeWidth={4} />
      <circle cx={880} cy={800} r={16} fill="#FFD84A" stroke={OL} strokeWidth={4} />
    </g>
  );
};

/** Beach / shallows at dawn. */
export const Shallows: React.FC = () => {
  const f = onTwos(useCurrentFrame(), 2);
  return (
    <>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDawn)" /><circle cx={1500} cy={460} r={200} fill="url(#sunGlow)" /></Layer>
      <Layer depth={0.4}>
        <rect x={-200} y={520} width={2400} height={300} fill="#6FA0B8" />
        {[...Array(12)].map((_, i) => <path key={i} d={`M${-200 + i * 200 + ((f * 1.2) % 200)} ${560 + (i % 3) * 60} q20 -10 40 0 q20 10 40 0`} stroke="#DDEFF7" strokeWidth={4} fill="none" />)}
      </Layer>
      <Layer depth={0.7}>
        <path d="M-200 820 Q960 760 2200 830 L2200 1300 L-200 1300 Z" fill="#B8A07A" stroke={OL} strokeWidth={3} />
        {[...Array(10)].map((_, i) => <ellipse key={i} cx={random('sx' + i) * 1900} cy={880 + random('sy' + i) * 160} rx={26} ry={8} fill="#F4F2EC" opacity={0.7} />)}
      </Layer>
    </>
  );
};

/** Bungalow office with ceiling fan and huge maps. */
export const Bungalow: React.FC<{ fan?: boolean }> = ({ fan = true }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer depth={0.3}>
        <rect x={-200} y={-200} width={2400} height={1500} fill="#E8DCC0" />
        <rect x={1240} y={180} width={520} height={420} fill="#F1E2C0" stroke={OL} strokeWidth={5} />
        <g transform="translate(1260 200) scale(0.36)"><path d={subPath()} fill="#E8DCC0" stroke={OL} strokeWidth={10} /></g>
        <text x={1500} y={640} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#B3261E">CENSUS 1941</text>
        {fan && <g transform="translate(760 40)"><path d="M0 0 V80" stroke={OL} strokeWidth={6} />{[0, 1, 2].map((k) => <ellipse key={k} cx={0} cy={86} rx={150} ry={14} fill="#8C5A2A" stroke={OL} strokeWidth={3} transform={`rotate(${f * 22 + k * 60} 0 86) scale(1 1)`} opacity={0.85} />)}<circle cx={0} cy={86} r={16} fill="#3A3A3A" /></g>}
      </Layer>
      <Layer depth={0.6}><path d="M-200 760 L2200 760 L2200 1300 L-200 1300 Z" fill="#B88A5A" stroke={OL} strokeWidth={3} /></Layer>
    </>
  );
};

/** Partition map: Punjab and Bengal with a line that draws itself; villages flicker. */
export const PartitionMap: React.FC<{ draw: number; flicker?: number; flows?: number }> = ({ draw, flicker = 0, flows = 0 }) => {
  const f = useCurrentFrame();
  const W = 'M300 160 Q330 260 290 360 Q320 420 300 500';
  const E = 'M800 360 Q780 420 820 470 Q790 520 810 580';
  return (
    <g transform="translate(500 -10) scale(0.9)">
      <path d={subPath()} fill="#E8DCC0" stroke={OL} strokeWidth={6} />
      <path d="M100 160 L300 160 L300 500 L60 560 Z" fill="#5A8A4A" opacity={draw > 0.99 ? 0.4 : 0} />
      <path d="M810 360 L1000 340 L960 420 L820 600 Z" fill="#5A8A4A" opacity={draw > 0.99 ? 0.4 : 0} />
      <path d={W} stroke="#B3261E" strokeWidth={10} fill="none" strokeDasharray="600" strokeDashoffset={600 * (1 - draw)} strokeLinecap="round" />
      <path d={E} stroke="#B3261E" strokeWidth={10} fill="none" strokeDasharray="300" strokeDashoffset={300 * (1 - draw)} strokeLinecap="round" />
      {flicker > 0 && [...Array(24)].map((_, i) => {
        const x = (i < 12 ? 250 : 760) + random('vx' + i) * 100, y = (i < 12 ? 200 : 380) + random('vy' + i) * 260;
        const settled = random('vs' + i) < flicker;
        const side = random('vc' + i) < 0.5;
        const col = settled ? (side ? '#E8862A' : '#2E6B4A') : (Math.floor(f / 3 + i) % 2 ? '#E8862A' : '#2E6B4A');
        return <circle key={i} cx={x} cy={y} r={10} fill={col} stroke={OL} strokeWidth={2} />;
      })}
      {flows > 0 && [0, 1].map((k) => {
        const len = 40 + flows * 120;
        return <g key={k}>
          <path d={`M${280 - (k ? -1 : 1) * 20} ${300 + k * 60} l${(k ? 1 : -1) * len} 0`} stroke={k ? '#E8862A' : '#2E6B4A'} strokeWidth={14 + flows * 16} strokeLinecap="round" opacity={0.85} />
          <path d={`M${800 - (k ? -1 : 1) * 20} ${460 + k * 60} l${(k ? 1 : -1) * len * 0.7} 0`} stroke={k ? '#E8862A' : '#2E6B4A'} strokeWidth={10 + flows * 12} strokeLinecap="round" opacity={0.85} />
        </g>;
      })}
    </g>
  );
};

/** Princely states: 565 speckles resolving to one colour; Kashmir keeps flickering. */
export const PrincelyMap: React.FC<{ resolve: number }> = ({ resolve }) => {
  const f = useCurrentFrame();
  const pal = ['#E07A5F', '#F2CC8F', '#81B29A', '#9DB4C0', '#E2B13C', '#C07A9C', '#7FA7D9', '#B5B35C'];
  return (
    <g transform="translate(500 -10) scale(0.9)">
      <defs><clipPath id="subclipP"><path d={subPath()} /></clipPath></defs>
      <path d={subPath()} fill="#E8862A" stroke={OL} strokeWidth={6} />
      <g clipPath="url(#subclipP)">
        {[...Array(565)].map((_, i) => {
          const x = random('px' + i) * 1000, y = random('py' + i) * 1100;
          const kashmir = y < 140 && x > 260 && x < 460;
          const done = !kashmir && random('pr' + i) < resolve;
          const col = kashmir ? (Math.floor(f / 4 + i) % 2 ? '#2E6B4A' : '#E8862A') : done ? '#E8862A' : pal[i % 8];
          return <rect key={i} x={x - 12} y={y - 12} width={24} height={24} fill={col} />;
        })}
      </g>
      <path d={subPath()} fill="none" stroke={OL} strokeWidth={6} />
    </g>
  );
};

/** Ballot paper with symbols. */
export const Ballot: React.FC<{ mark: number }> = ({ mark }) => (
  <g transform="translate(960 520)">
    <rect x={-300} y={-400} width={600} height={800} fill="#F4F2EC" stroke={OL} strokeWidth={6} />
    {[0, 1, 2, 3].map((i) => (
      <g key={i} transform={`translate(0 ${-300 + i * 190})`}>
        <path d="M-280 80 H280" stroke="#C9C0B0" strokeWidth={3} />
        {i === 0 && <g transform="translate(-160 -10)"><path d="M0 -50 V40 M-40 -10 Q0 -60 40 -10" stroke={OL} strokeWidth={8} fill="none" /><ellipse cx={0} cy={44} rx={30} ry={10} fill={OL} /></g>}
        {i === 1 && <g transform="translate(-160 -10)"><circle r={44} fill="none" stroke={OL} strokeWidth={8} />{[...Array(8)].map((_, k) => <path key={k} d={`M0 0 L${Math.cos(k * 0.785) * 44} ${Math.sin(k * 0.785) * 44}`} stroke={OL} strokeWidth={4} />)}</g>}
        {i === 2 && <g transform="translate(-160 -10)"><path d="M-40 30 Q0 -80 40 30 Z" fill="none" stroke={OL} strokeWidth={8} /><path d="M-30 30 H30" stroke={OL} strokeWidth={8} /></g>}
        {i === 3 && <g transform="translate(-160 -10)"><path d="M-40 20 L0 -40 L40 20 Z" fill="none" stroke={OL} strokeWidth={8} /><rect x={-40} y={20} width={80} height={30} fill="none" stroke={OL} strokeWidth={8} /></g>}
        <rect x={60} y={-50} width={120} height={100} fill="none" stroke={OL} strokeWidth={5} />
        {i === 1 && mark > 0 && <path d={`M80 0 L110 ${30} L${110 + 50 * mark} ${30 - 70 * mark}`} stroke="#2E5E8C" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      </g>
    ))}
  </g>
);

/** Green fields with wheat swaying. */
export const WheatFields: React.FC = () => {
  const f = onTwos(useCurrentFrame());
  return (
    <>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDay)" /><Cloud x={300} y={140} s={1} speed={0.3} /></Layer>
      <Layer depth={0.4}><Hills y={560} fill="#8DA36A" amp={30} seed="wf" /></Layer>
      <Layer depth={0.7}>
        <path d="M-200 620 L2200 620 L2200 1300 L-200 1300 Z" fill="#D8B44A" stroke={OL} strokeWidth={3} />
        {[...Array(60)].map((_, i) => { const x = -100 + (i % 20) * 110 + (Math.floor(i / 20) % 2) * 55, y = 700 + Math.floor(i / 20) * 120; const sw = Math.sin(f / 9 + i * 0.5) * 8; return <g key={i}><path d={`M${x} ${y + 80} Q${x + 4} ${y + 30} ${x + sw} ${y}`} stroke="#A8862A" strokeWidth={5} fill="none" /><ellipse cx={x + sw} cy={y - 6} rx={9} ry={20} fill="#E8C24A" stroke={OL} strokeWidth={2} /></g>; })}
      </Layer>
    </>
  );
};

/** Night airfield with a cargo plane. */
export const Airfield: React.FC<{ planeX?: number; lift?: number }> = ({ planeX = 960, lift = 0 }) => (
  <>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyNight)" />{[...Array(40)].map((_, i) => <circle key={i} cx={random('ax' + i) * 1920} cy={random('ay' + i) * 400} r={1.6} fill="#fff" opacity={0.6} />)}</Layer>
    <Layer depth={0.6}>
      <path d="M-200 760 L2200 760 L2200 1300 L-200 1300 Z" fill="#2A2E3A" stroke="#0E0A08" strokeWidth={3} />
      <path d="M-200 900 H2200" stroke="#F2C230" strokeWidth={6} strokeDasharray="60 50" opacity={0.6} />
      <g transform={`translate(${planeX} ${760 - lift}) rotate(${-lift / 30})`}>
        <path d="M-360 -60 Q-380 -120 -300 -130 L300 -130 Q420 -120 440 -80 Q420 -40 300 -30 L-300 -30 Z" fill="#7A8090" stroke="#0E0A08" strokeWidth={4} />
        <path d="M-60 -100 L-180 -20 L120 -20 L60 -100 Z" fill="#5A606E" stroke="#0E0A08" strokeWidth={4} />
        <path d="M-320 -130 L-380 -230 L-300 -230 L-240 -130 Z" fill="#5A606E" stroke="#0E0A08" strokeWidth={4} />
        {[...Array(8)].map((_, k) => <circle key={k} cx={-200 + k * 60} cy={-90} r={8} fill="#F2C230" opacity={0.8} />)}
        {lift === 0 && [-100, 160].map((cx) => <circle key={cx} cx={cx} cy={-14} r={16} fill="#141414" />)}
      </g>
    </Layer>
  </>
);

/** Office of laptops (Bangalore). */
export const TechOffice: React.FC<{ boom?: number }> = ({ boom = 0 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDay)" /></Layer>
      <Layer depth={0.35}>
        {[...Array(8)].map((_, i) => {
          const h = 200 + spring(Math.max(0, f - i * 4), { damping: 12, stiffness: 80 }) * boom * (200 + (i % 3) * 140);
          return <g key={i}><rect x={-120 + i * 280} y={760 - h} width={220} height={h} fill={['#9DB4C0', '#7FA7D9', '#B8C4CC'][i % 3]} stroke={OL} strokeWidth={4} />{[...Array(Math.floor(h / 60))].map((_, r) => <rect key={r} x={-100 + i * 280} y={780 - h + r * 60} width={180} height={30} fill="#E8F4FF" opacity={0.6} />)}</g>;
        })}
        <Tree x={120} y={760} s={0.6} /><Tree x={1800} y={760} s={0.7} />
      </Layer>
      <Layer depth={0.7}><path d="M-200 760 L2200 760 L2200 1300 L-200 1300 Z" fill="#8A9A7A" stroke={OL} strokeWidth={3} /></Layer>
    </>
  );
};

/** Rocket launch + Mars orbit. */
export const Launch: React.FC<{ t: number }> = ({ t }) => {
  const f = useCurrentFrame();
  const y = t > 0 ? -560 * (1 - Math.exp(-Math.pow(t / 90, 2))) : 0;
  return (
    <>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDawn)" /></Layer>
      <Layer depth={0.5}>
        <path d="M-200 820 L2200 820 L2200 1300 L-200 1300 Z" fill="#7A8A6A" stroke={OL} strokeWidth={3} />
        <path d="M860 820 L860 300 M1060 820 L1060 300" stroke="#7A7F8C" strokeWidth={14} />
        {[...Array(10)].map((_, i) => <path key={i} d={`M860 ${320 + i * 50} L1060 ${345 + i * 50}`} stroke="#7A7F8C" strokeWidth={6} />)}
      </Layer>
      <Layer depth={0.8}>
        <g transform={`translate(960 ${780 + y})`}>
          {t > 0 && [...Array(8)].map((_, i) => <circle key={i} cx={Math.sin(f + i) * 30} cy={60 + i * 26 + random('fl' + i + f) * 10} r={30 + i * 6} fill={i < 3 ? '#FFB21E' : '#E8E2D6'} opacity={i < 3 ? 0.9 : 0.6} />)}
          <path d="M-36 0 L-36 -360 Q0 -440 36 -360 L36 0 Z" fill="#F4F2EC" stroke={OL} strokeWidth={4} />
          <path d="M-36 -40 L-80 30 L-36 10 Z M36 -40 L80 30 L36 10 Z" fill="#E8862A" stroke={OL} strokeWidth={3} />
          <rect x={-36} y={-240} width={72} height={20} fill="#E8862A" />
          <rect x={-36} y={-200} width={72} height={20} fill="#2E9A4A" />
        </g>
      </Layer>
    </>
  );
};

export const MarsOrbit: React.FC = () => {
  const f = useCurrentFrame();
  const a = f / 30;
  return (
    <g>
      <rect width={1920} height={1080} fill="#0A0A18" />
      {[...Array(120)].map((_, i) => <circle key={i} cx={random('mx' + i) * 1920} cy={random('my' + i) * 1080} r={random('mr' + i) * 2 + 0.5} fill="#fff" opacity={0.7} />)}
      <circle cx={960} cy={540} r={240} fill="#C2603F" stroke="#7A3A22" strokeWidth={6} />
      {[...Array(6)].map((_, i) => <ellipse key={i} cx={860 + random('mc' + i) * 200} cy={440 + random('md' + i) * 200} rx={30 + i * 6} ry={18} fill="#A84A32" opacity={0.6} />)}
      <ellipse cx={960} cy={540} rx={420} ry={150} fill="none" stroke="#F4F2EC" strokeWidth={3} strokeDasharray="10 12" opacity={0.6} />
      <g transform={`translate(${960 + Math.cos(a) * 420} ${540 + Math.sin(a) * 150})`}>
        <rect x={-20} y={-16} width={40} height={32} fill="#E2B13C" stroke={OL} strokeWidth={3} />
        <rect x={-70} y={-8} width={44} height={16} fill="#2E5E8C" stroke={OL} strokeWidth={2} />
        <rect x={26} y={-8} width={44} height={16} fill="#2E5E8C" stroke={OL} strokeWidth={2} />
      </g>
    </g>
  );
};

export { interpolate, Easing, spring, Tree, Hills, Bush, Cloud };

/** New Delhi parliament: circular sandstone colonnade. night=true for 14 Aug 1947. */
export const DelhiParliament: React.FC<{ night?: boolean }> = ({ night }) => (
  <>
    <Layer depth={0}>
      <rect x={-200} y={-200} width={2400} height={1500} fill={night ? 'url(#skyNight)' : 'url(#skyDay)'} />
      {night && [...Array(40)].map((_, i) => <circle key={i} cx={random('dpx' + i) * 1920} cy={random('dpy' + i) * 360} r={1.6} fill="#fff" opacity={0.6} />)}
      {!night && <Cloud x={300} y={140} s={1} speed={0.25} />}
    </Layer>
    <Layer depth={0.45}>
      <path d="M160 760 L160 470 Q960 360 1760 470 L1760 760 Z" fill={night ? '#6A4A3A' : '#D8A880'} stroke={OL} strokeWidth={5} />
      <path d="M140 470 Q960 350 1780 470 L1780 430 Q960 310 140 430 Z" fill={night ? '#5A3A2A' : '#C99068'} stroke={OL} strokeWidth={4} />
      {[...Array(28)].map((_, i) => { const x = 200 + i * 56; const top = 470 - Math.sin((i / 27) * Math.PI) * 100 + 30; return <rect key={i} x={x} y={top} width={22} height={760 - top} fill={night ? '#8A6A5A' : '#EAD2B0'} stroke={OL} strokeWidth={2} />; })}
      {night && [...Array(10)].map((_, i) => <rect key={'w' + i} x={240 + i * 150} y={600} width={40} height={60} fill="#F2C230" opacity={0.8} />)}
    </Layer>
    <Layer depth={0.7}><path d="M-200 760 L2200 760 L2200 1300 L-200 1300 Z" fill={night ? '#2E3A2A' : '#7DA850'} stroke={OL} strokeWidth={3} /></Layer>
  </>
);
