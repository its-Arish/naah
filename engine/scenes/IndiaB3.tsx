import React from 'react';
import { useCurrentFrame, onTwos, random, interpolate, Easing, spring } from '../lib/core';
import { Layer } from '../fx/Camera';
import { OL, Cloud, Hills, Tree, Bush } from './Parts';
import { subPath, SUB_PTS } from './India';

/** Restrained aftermath street: overturned stalls, smoke, nobody. */
export const EmptyStreet: React.FC<{ smoke?: boolean; dim?: number }> = ({ smoke = true, dim = 0.35 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDust)" /></Layer>
      <Layer depth={0.4}>
        {[...Array(8)].map((_, i) => <rect key={i} x={-160 + i * 300} y={320 - (i % 3) * 40} width={280} height={480} fill={i % 2 ? '#A89C8A' : '#9A7A6A'} stroke={OL} strokeWidth={3} />)}
        {[...Array(8)].map((_, i) => <rect key={'d' + i} x={-60 + i * 300} y={620} width={70} height={180} fill="#4A3A2A" stroke={OL} strokeWidth={3} />)}
      </Layer>
      <Layer depth={0.7}>
        <path d="M-200 780 L2200 780 L2200 1300 L-200 1300 Z" fill="#9C9180" stroke={OL} strokeWidth={3} />
        {[[400, 860, -70], [1000, 900, 80], [1500, 860, -100]].map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
            <rect x={-110} y={-20} width={220} height={40} fill="#8C5A2A" stroke={OL} strokeWidth={3} />
            <path d="M-100 20 V80 M100 20 V80" stroke="#6B4A2B" strokeWidth={8} />
          </g>
        ))}
        {[[640, 930], [1240, 950], [1720, 920]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={40} ry={14} fill="#C9A47A" stroke={OL} strokeWidth={2} />)}
        {smoke && [...Array(7)].map((_, i) => {
          const t = ((f + i * 23) % 120) / 120;
          return <circle key={i} cx={200 + i * 260 + t * 50} cy={720 - t * 520} r={60 + t * 120} fill="#5A5450" opacity={(1 - t) * 0.45} />;
        })}
      </Layer>
      <Layer depth={1.2}><rect x={-200} y={-200} width={2400} height={1500} fill="#000" opacity={dim} /></Layer>
    </>
  );
};

/** Stylised world strip for the Koh-i-Noor route (no modern borders). */
export const WORLD = {
  London: [300, 250], Persia: [1000, 470], Afghanistan: [1180, 430], Punjab: [1320, 470], Delhi: [1380, 520],
} as Record<string, [number, number]>;
export const RouteMap: React.FC<{ p: number; order: string[] }> = ({ p, order }) => {
  const f = useCurrentFrame();
  const pts = order.map((k) => WORLD[k]);
  const segs = pts.length - 1;
  const at = Math.min(segs, p * segs);
  const i = Math.min(segs - 1, Math.floor(at)), t = at - i;
  const gx = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, gy = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t;
  return (
    <g>
      {/* land blobs */}
      <path d="M160 160 Q300 100 420 200 Q440 320 320 360 Q200 340 160 260 Z" fill="#B5B35C" stroke={OL} strokeWidth={4} />
      <path d="M520 120 Q900 60 1500 140 Q1700 300 1560 640 Q1400 760 1360 820 Q1300 700 1200 620 Q1000 640 820 600 Q640 500 560 360 Q500 240 520 120 Z" fill="#C9B27C" stroke={OL} strokeWidth={4} />
      <path d="M1260 560 Q1420 520 1480 600 Q1460 760 1380 860 Q1320 760 1260 680 Z" fill="#E8862A" stroke={OL} strokeWidth={4} />
      {/* travelled path */}
      {pts.slice(0, i + 1).map((a, k) => {
        const b = k < i ? pts[k + 1] : [gx, gy];
        return <path key={k} d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} stroke="#B3261E" strokeWidth={10} strokeDasharray="22 14" strokeLinecap="round" />;
      })}
      {pts.map((a, k) => <circle key={k} cx={a[0]} cy={a[1]} r={14} fill={k <= i ? '#FFD84A' : '#F4EEDD'} stroke={OL} strokeWidth={4} />)}
      {/* the diamond itself, sparkling as it travels */}
      <g transform={`translate(${gx} ${gy - 40}) rotate(${Math.sin(f / 6) * 10})`}>
        <circle r={36} fill="url(#whiteGlow)" />
        <path d="M0 -24 L20 -6 L12 22 L-12 22 L-20 -6 Z" fill="#E8F4FF" stroke={OL} strokeWidth={3} />
      </g>
    </g>
  );
};

/** Tower of London (stylised) with a display case. */
export const TowerLondon: React.FC = () => (
  <>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#9DB4C0" /><Cloud x={300} y={150} s={1} speed={0.25} fill="#E8EEF2" /></Layer>
    <Layer depth={0.4}>
      <rect x={560} y={260} width={800} height={540} fill="#C9C0A8" stroke={OL} strokeWidth={5} />
      {[560, 1300].map((x) => <g key={x}><rect x={x - 20} y={140} width={100} height={660} fill="#BDB49C" stroke={OL} strokeWidth={4} /><path d={`M${x - 20} 140 Q${x + 30} 80 ${x + 80} 140`} fill="#5A6A7A" stroke={OL} strokeWidth={4} /></g>)}
      {[...Array(10)].map((_, i) => <rect key={i} x={580 + i * 80} y={232} width={40} height={30} fill="#C9C0A8" stroke={OL} strokeWidth={3} />)}
      {[...Array(4)].map((_, i) => <rect key={i} x={660 + i * 170} y={420} width={50} height={90} rx={25} fill="#3A3A44" stroke={OL} strokeWidth={3} />)}
      <path d="M940 140 V40 L1010 60 L940 80" stroke={OL} strokeWidth={5} fill="#C0392B" />
    </Layer>
    <Layer depth={0.7}><path d="M-200 800 L2200 800 L2200 1300 L-200 1300 Z" fill="#7A8A6A" stroke={OL} strokeWidth={3} /></Layer>
  </>
);

/** Coastal Company fort / warehouse with a merchant ship. */
export const CompanyCoast: React.FC<{ fort?: boolean; flag?: boolean }> = ({ fort = true, flag = true }) => {
  const f = onTwos(useCurrentFrame(), 2);
  return (
    <>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDay)" /><Cloud x={300} y={120} s={1} speed={0.3} /></Layer>
      <Layer depth={0.3}>
        <rect x={-200} y={560} width={2400} height={240} fill="#4F8FB8" />
        {[...Array(12)].map((_, i) => <path key={i} d={`M${-200 + i * 200 + ((f * 1.5) % 200)} ${600 + (i % 3) * 50} q20 -12 40 0 q20 12 40 0`} stroke="#DDEFF7" strokeWidth={4} fill="none" />)}
        {/* merchant ship */}
        <g transform={`translate(1500 ${640 + Math.sin(f / 10) * 6})`}>
          <path d="M-220 0 L220 0 Q190 70 0 76 Q-190 70 -220 0 Z" fill="#6B4A2B" stroke={OL} strokeWidth={4} />
          {[-90, 60].map((mx) => <g key={mx}><path d={`M${mx} 0 V-300`} stroke="#5A3E26" strokeWidth={9} /><rect x={mx - 80} y={-280} width={160} height={110} fill="#F4EEDD" stroke={OL} strokeWidth={3} /><rect x={mx - 64} y={-160} width={128} height={90} fill="#F4EEDD" stroke={OL} strokeWidth={3} /></g>)}
          {flag && <g transform="translate(60 -330) scale(0.45)">{[...Array(9)].map((_, i) => <rect key={i} x={0} y={i * 20} width={200} height={20} fill={i % 2 ? '#F4F7FA' : '#C0392B'} />)}<rect x={0} y={0} width={86} height={80} fill="#F4F7FA" /><path d="M43 0 V80 M0 40 H86" stroke="#C0392B" strokeWidth={14} /></g>}
        </g>
      </Layer>
      <Layer depth={0.6}>
        <path d="M-200 740 Q600 700 1200 740 L2200 760 L2200 1300 L-200 1300 Z" fill="#E2C98E" stroke={OL} strokeWidth={3} />
        {fort && (
          <g transform="translate(560 760)">
            <path d="M-360 0 L-360 -260 L360 -260 L360 0 Z" fill="#D8C2A0" stroke={OL} strokeWidth={4} />
            {[...Array(12)].map((_, i) => <rect key={i} x={-360 + i * 62} y={-284} width={34} height={26} fill="#D8C2A0" stroke={OL} strokeWidth={3} />)}
            {[-360, 360].map((x) => <path key={x} d={`M${x - 70} 0 L${x - 50} -320 L${x + 50} -320 L${x + 70} 0 Z`} fill="#C9B79A" stroke={OL} strokeWidth={4} />)}
            {[-200, 0, 200].map((x) => <rect key={x} x={x - 50} y={-170} width={100} height={170} fill="#6B4A2B" stroke={OL} strokeWidth={3} />)}
            <path d="M0 -284 V-420" stroke="#5A3E26" strokeWidth={8} />
            {flag && <g transform={`translate(4 -420) scale(0.5)`}>{[...Array(9)].map((_, i) => <rect key={i} x={0} y={i * 20} width={200} height={20} fill={i % 2 ? '#F4F7FA' : '#C0392B'} />)}<rect x={0} y={0} width={86} height={80} fill="#F4F7FA" /><path d="M43 0 V80 M0 40 H86" stroke="#C0392B" strokeWidth={14} /></g>}
            <text x={0} y={-200} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#3A2A1E">WAREHOUSE</text>
          </g>
        )}
        {[...Array(6)].map((_, i) => <rect key={i} x={1000 + (i % 3) * 70} y={860 - Math.floor(i / 3) * 50} width={64} height={50} fill="#C9A47A" stroke={OL} strokeWidth={3} />)}
      </Layer>
    </>
  );
};

/** Troop blocks (sized honestly). greyThird 0..1 greys out a third of the big block; collapse 0..1 scatters the rest. */
export const TroopBlocks: React.FC<{ small: number; big: number; greyThird?: number; collapse?: number }> = ({ small, big, greyThird = 0, collapse = 0 }) => {
  const f = useCurrentFrame();
  const cells = 15 * 10;
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#C4B98A" />
      <g transform={`translate(260 480) scale(${small})`}><rect x={-30} y={-30} width={60} height={60} fill="#C0392B" stroke={OL} strokeWidth={4} /></g>
      <g transform="translate(900 200)">
        {[...Array(cells)].map((_, i) => {
          const c = i % 15, r = Math.floor(i / 15);
          const third = c < 5;
          const grey = third && greyThird > 0;
          const sc = collapse > 0 && !third ? collapse : 0;
          const dx = sc * (random('cx' + i) - 0.3) * 600, dy = sc * (random('cy' + i) - 0.5) * 400;
          return <rect key={i} x={c * 52 + dx} y={r * 60 + dy} width={44} height={50} fill={grey ? '#9A9A9A' : '#2E6B4A'} stroke={OL} strokeWidth={2} opacity={big * (1 - sc * 0.6)} transform={`rotate(${sc * (random('cr' + i) - 0.5) * 120} ${c * 52 + 22 + dx} ${r * 60 + 25 + dy})`} />;
        })}
      </g>
    </g>
  );
};

/** Restrained famine village: doors, empty baskets, cracked earth, no people. */
export const EmptyVillage: React.FC = () => (
  <>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#D8C9A0" /><circle cx={1500} cy={220} r={90} fill="#F4E2B0" opacity={0.6} /></Layer>
    <Layer depth={0.4}>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${300 + i * 420} 720)`}>
          <rect x={-120} y={-200} width={240} height={200} fill="#B8A07A" stroke={OL} strokeWidth={4} />
          <path d="M-150 -190 L0 -300 L150 -190 Z" fill="#A8905A" stroke={OL} strokeWidth={4} />
          <rect x={-36} y={-130} width={72} height={130} fill="#3A2A1E" stroke={OL} strokeWidth={3} />
        </g>
      ))}
    </Layer>
    <Layer depth={0.7}>
      <path d="M-200 720 L2200 720 L2200 1300 L-200 1300 Z" fill="#C4AE80" stroke={OL} strokeWidth={3} />
      {[...Array(14)].map((_, i) => <path key={i} d={`M${random('ck' + i) * 1920} ${760 + random('cl' + i) * 300} l30 18 l-12 26 l34 10`} stroke="#9A8460" strokeWidth={3} fill="none" />)}
      {[[520, 830], [1180, 850], [1560, 820]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}><path d="M-60 0 L60 0 L46 60 L-46 60 Z" fill="#C9A47A" stroke={OL} strokeWidth={3} /><ellipse cx={0} cy={0} rx={60} ry={14} fill="#5A4630" stroke={OL} strokeWidth={3} /></g>)}
    </Layer>
  </>
);

/** London ledger with rising revenue column. */
export const RevenueLedger: React.FC<{ n: number; title?: string }> = ({ n, title = 'REVENUE — BENGAL' }) => (
  <g transform="translate(0 0)">
    <rect x={40} y={60} width={820} height={940} fill="#F1E2C0" stroke={OL} strokeWidth={6} />
    <text x={450} y={140} textAnchor="middle" fontFamily="TagBold" fontSize={42} fill="#3A2A1E">{title}</text>
    {[...Array(12)].map((_, i) => (
      <g key={i} opacity={i < n ? 1 : 0}>
        <path d={`M90 ${200 + i * 64} H810`} stroke="#C9B79A" strokeWidth={3} />
        <text x={110} y={190 + i * 64} fontFamily="Hand" fontSize={40} fill="#3A2A1E">{1765 + i}</text>
        <text x={780} y={190 + i * 64} textAnchor="end" fontFamily="Hand" fontSize={40} fill="#3A2A1E">£ {(1.4 + i * 0.12 + (i > 4 ? 0.1 : 0)).toFixed(2)}m</text>
      </g>
    ))}
  </g>
);

/** Westminster-ish facade. */
export const Westminster: React.FC = () => (
  <>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#B8C4CC" /><Cloud x={500} y={140} s={1.1} speed={0.25} fill="#E8EEF2" /></Layer>
    <Layer depth={0.4}>
      <rect x={200} y={360} width={1520} height={440} fill="#C9B48A" stroke={OL} strokeWidth={5} />
      {[...Array(18)].map((_, i) => <g key={i}><rect x={230 + i * 82} y={400} width={30} height={300} fill="#B8A078" stroke={OL} strokeWidth={2} /><path d={`M${230 + i * 82} 400 L${245 + i * 82} 360 L${260 + i * 82} 400`} fill="#B8A078" stroke={OL} strokeWidth={2} /></g>)}
      <rect x={1560} y={60} width={140} height={740} fill="#C9B48A" stroke={OL} strokeWidth={5} />
      <circle cx={1630} cy={200} r={50} fill="#F4EEDD" stroke={OL} strokeWidth={4} />
      <path d="M1630 200 V164 M1630 200 L1656 210" stroke={OL} strokeWidth={5} />
      <path d="M1560 60 L1630 -40 L1700 60 Z" fill="#5A6A7A" stroke={OL} strokeWidth={4} />
    </Layer>
    <Layer depth={0.7}><path d="M-200 800 L2200 800 L2200 1300 L-200 1300 Z" fill="#7A8A6A" stroke={OL} strokeWidth={3} /></Layer>
  </>
);

/** Rail network drawing itself over the subcontinent outline. p 0..1 */
export const RAIL: [number, number][][] = [
  [[380, 300], [600, 380], [800, 430], [900, 420]], // Delhi–Calcutta
  [[380, 300], [300, 460], [240, 560], [180, 600]], // Delhi–Bombay via Gujarat
  [[220, 640], [330, 700], [460, 760], [600, 600], [800, 430]], // Bombay–Calcutta
  [[220, 640], [300, 800], [380, 920], [420, 1000]], // Bombay–Madras–south
  [[600, 600], [560, 800], [480, 900], [420, 1000]],
  [[380, 300], [300, 160], [340, 60]], // north
  [[380, 300], [200, 330], [100, 420]], // west
  [[460, 760], [380, 920]],
];
export const RailMap: React.FC<{ x: number; y: number; s?: number; p: number }> = ({ x, y, s = 1, p }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={subPath()} fill="#E8DCC0" stroke={OL} strokeWidth={6} />
    {RAIL.map((line, i) => {
      const d = 'M' + line.map((q) => q.join(' ')).join(' L');
      const k = Math.max(0, Math.min(1, p * RAIL.length - i * 0.7));
      return (
        <g key={i}>
          <path d={d} stroke="#3A2A1E" strokeWidth={10} fill="none" strokeDasharray="2000" strokeDashoffset={2000 * (1 - k)} strokeLinejoin="round" />
          <path d={d} stroke="#E8DCC0" strokeWidth={4} fill="none" strokeDasharray="12 14" opacity={k > 0.99 ? 1 : 0} />
        </g>
      );
    })}
    {[[380, 300], [220, 640], [800, 430], [420, 1000]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={14} fill="#FFD84A" stroke={OL} strokeWidth={4} opacity={p > 0.2 ? 1 : 0} />)}
  </g>
);

/** Factory with smokestacks. */
export const Factory: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 1].map((i) => {
        const t = ((f + i * 30) % 80) / 80;
        return <g key={i}><rect x={-140 + i * 160} y={-460} width={50} height={300} fill="#8A4A3A" stroke={OL} strokeWidth={4} /><circle cx={-115 + i * 160 + t * 40} cy={-480 - t * 200} r={30 + t * 50} fill="#5A5450" opacity={(1 - t) * 0.7} /></g>;
      })}
      <path d="M-260 0 L-260 -200 L-180 -260 L-180 -200 L-100 -260 L-100 -200 L-20 -260 L-20 -200 L60 -260 L60 -200 L140 -260 L140 0 Z" fill="#A8604A" stroke={OL} strokeWidth={4} />
      {[...Array(4)].map((_, i) => <rect key={i} x={-230 + i * 90} y={-150} width={50} height={60} fill="#F2C230" stroke={OL} strokeWidth={3} />)}
    </g>
  );
};

/** Hand loom. */
export const Loom: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = onTwos(useCurrentFrame());
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-180} y={-260} width={360} height={20} fill="#8C5A2A" stroke={OL} strokeWidth={3} />
      <path d="M-170 -240 V0 M170 -240 V0" stroke="#8C5A2A" strokeWidth={14} />
      {[...Array(14)].map((_, i) => <path key={i} d={`M${-150 + i * 23} -240 V-40`} stroke="#E8862A" strokeWidth={3} />)}
      <rect x={-160} y={-120 + Math.sin(f / 4) * 10} width={320} height={60} fill="#C0392B" stroke={OL} strokeWidth={3} />
      <path d={`M${-150 + ((f * 8) % 300)} -90 l40 0`} stroke="#F4F7FA" strokeWidth={8} strokeLinecap="round" />
    </g>
  );
};

export { SUB_PTS, interpolate, Easing, spring, Tree, Hills, Bush };
