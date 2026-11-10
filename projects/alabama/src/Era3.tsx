/** Iron and peanuts, Rocket City: captions 271-481 (11:00 to 19:15). */
import React from 'react';
import { interpolate, Easing, springPop } from '@engine/lib/core';
import { OL, Hills, Cloud } from '@engine/scenes/Parts';
import { Chibi } from '@engine/characters/Chibi';
import { SKIN } from '@engine/cast/Wardrobe';
import { talk, type ShotMap, type SP } from '@engine/kit';
import { Stage } from '@engine/moves';
import { PAPER, RED, GOLD, INK } from './Kit';
import { useBeat, HostS, Txt, Pop, Quiet } from './Kit2';
import { Rocket, Moon, ease, Corn } from './KitAL';
import { FishHost, fishCard, Twirl, Laser, SkyDrop, Heli, Puller, pullerState } from './Moves';
import { hostScene, mapScene, quietScene, storyScene, Items, T, K, Pg, On, type B, type Item } from './Factory';

/** group frame of a word in beat j, from wherever we are in the run */
const cg = (b: B, j: number, w?: string) => (b.k === j ? b.gAt(j, w) : b.k > j ? -999 : 99999);

// ------------------------------------------------------------------ props
const Book: React.FC<{ h?: number; title?: string }> = ({ h = 260, title = '' }) => (
  <g><rect x={-90} y={-h} width={180} height={h} rx={8} fill="#7A2A1E" stroke={OL} strokeWidth={5} />{Array.from({ length: Math.floor(h / 14) }, (_, i) => <line key={i} x1={84} y1={-h + 8 + i * 14} x2={84} y2={-h + 14 + i * 14} stroke="#F4ECD8" strokeWidth={4} />)}<rect x={-70} y={-h + 30} width={130} height={46} fill={GOLD} stroke={OL} strokeWidth={3} /><Txt x={-5} y={-h + 62} t={title} size={22} /></g>
);
const BallotBox: React.FC<{ fill: number }> = ({ fill }) => (
  <g><rect x={-90} y={-110} width={180} height={150} rx={6} fill="#F4F2EC" stroke={OL} strokeWidth={5} /><rect x={-40} y={-118} width={80} height={12} fill="#1A1410" />{Array.from({ length: Math.round(fill * 10) }, (_, i) => <rect key={i} x={-70 + (i % 5) * 28} y={20 - Math.floor(i / 5) * 30} width={22} height={26} fill="#E9D9B0" stroke={OL} strokeWidth={2} />)}<Txt y={-60} t="VOTERS" size={26} c={RED} /></g>
);
const Vulcan: React.FC<{ s?: number; back?: boolean }> = ({ s = 1, back }) => (
  <g transform={`scale(${back ? -s : s} ${s})`}>
    <rect x={-70} y={-40} width={140} height={40} fill="#5A5F68" stroke={OL} strokeWidth={4} />
    <path d="M-34 -40 L-28 -200 L28 -200 L34 -40 Z" fill="#3A3E46" stroke={OL} strokeWidth={4} />
    <path d="M-40 -200 L-46 -330 Q0 -350 46 -330 L40 -200 Z" fill={back ? '#4A4E58' : '#3A3E46'} stroke={OL} strokeWidth={4} />
    {back && <path d="M-30 -210 q30 30 60 0" stroke="#22252B" strokeWidth={4} fill="none" />}
    <path d="M-34 -230 h68 v30 h-68 Z" fill="#6A4A2E" stroke={OL} strokeWidth={3} />
    <circle cy={-372} r={30} fill="#3A3E46" stroke={OL} strokeWidth={4} />
    <path d="M40 -320 L120 -440" stroke="#3A3E46" strokeWidth={18} strokeLinecap="round" /><path d="M110 -470 L140 -430 L150 -500 Z" fill="#9AA3A8" stroke={OL} strokeWidth={3} />
    <path d="M-40 -320 L-100 -250" stroke="#3A3E46" strokeWidth={18} strokeLinecap="round" /><rect x={-150} y={-262} width={60} height={34} rx={4} fill="#5A5F68" stroke={OL} strokeWidth={3} />
  </g>
);
const Peanut: React.FC = () => (
  <g><path d="M-60 0 Q-70 -40 -30 -44 Q0 -46 6 -20 Q14 -46 44 -44 Q80 -40 66 0 Q80 40 44 44 Q14 46 6 20 Q0 46 -30 44 Q-70 40 -60 0 Z" fill="#D9B27A" stroke={OL} strokeWidth={4} />{[-36, -18, 22, 40].map((x) => <circle key={x} cx={x} cy={0} r={4} fill="#B8905A" />)}</g>
);
const Weevil: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><ellipse rx={30} ry={20} fill="#5A3E26" stroke={OL} strokeWidth={3} /><path d="M24 -6 Q56 -10 70 8" stroke="#5A3E26" strokeWidth={8} fill="none" strokeLinecap="round" /><circle cx={30} cy={-8} r={3} fill="#fff" />{[-18, 0, 18].map((x) => <path key={x} d={`M${x} 16 l-6 14 M${x} 16 l6 14`} stroke={OL} strokeWidth={3} />)}</g>
);
const Monument: React.FC = () => (
  <g>
    <rect x={-120} y={-60} width={240} height={60} fill="#D9D3C4" stroke={OL} strokeWidth={4} />
    <rect x={-80} y={-200} width={160} height={140} fill="#E8E2D4" stroke={OL} strokeWidth={4} />
    <path d="M-30 -200 L-24 -330 Q0 -350 24 -330 L30 -200 Z" fill="#F4F2EC" stroke={OL} strokeWidth={4} />
    <circle cy={-366} r={22} fill="#F4F2EC" stroke={OL} strokeWidth={4} />
    <path d="M-20 -330 L-40 -420 M20 -330 L40 -420" stroke="#F4F2EC" strokeWidth={14} strokeLinecap="round" />
    <path d="M-60 -420 h120" stroke={GOLD} strokeWidth={8} />
    <g transform="translate(0 -460) scale(1.3)"><Weevil /></g>
  </g>
);
const Biplane: React.FC<{ s?: number; f?: number }> = ({ s = 1, f = 0 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-140} y={-40} width={280} height={14} rx={6} fill="#F4ECD8" stroke={OL} strokeWidth={3} />
    <rect x={-140} y={10} width={280} height={14} rx={6} fill="#F4ECD8" stroke={OL} strokeWidth={3} />
    {[-100, -30, 30, 100].map((x) => <line key={x} x1={x} y1={-26} x2={x} y2={10} stroke={OL} strokeWidth={3} />)}
    <path d="M-40 -6 H140" stroke="#8A6A44" strokeWidth={6} />
    <ellipse cx={-50} cy={-2} rx={20 * Math.abs(Math.sin(f / 2))} ry={34} fill="#8A6A44" opacity={0.6} />
    <circle cx={10} cy={-14} r={10} fill="#C9A66B" stroke={OL} strokeWidth={2.5} />
  </g>
);
const RedTail: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-160 0 Q-60 -26 120 -10 Q150 0 120 10 Q-60 24 -160 0 Z" fill="#9AA3A8" stroke={OL} strokeWidth={4} />
    <path d="M-150 -2 L-180 -50 L-130 -46 L-120 -6 Z" fill="#C0392B" stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-20 4 L-80 70 L-40 70 L30 6 Z" fill="#8A939A" stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    <path d="M100 -12 Q120 -30 136 -6" fill="#BFE0F0" stroke={OL} strokeWidth={3} />
    <rect x={118} y={-6} width={36} height={12} fill="#C0392B" stroke={OL} strokeWidth={3} />
  </g>
);
const Leaf: React.FC = () => <g>{[-30, 0, 30].map((x, i) => <path key={i} d={`M${x} 20 q-20 -30 0 -60 q20 30 0 60`} fill="#5E8A3A" stroke={OL} strokeWidth={3} transform={`rotate(${(i - 1) * 25} ${x} 20)`} />)}</g>;

// ------------------------------------------------------------------ 271-289: Turner, the 1901 constitution
const irTurner = hostScene({ items: [
  { at: [0, 'fast'], kind: 'gold', text: 'FREEDOM', x: 1110, y: 200, size: 44, hide: [2, 'turner'] },
  { at: [2, 'turner'], kind: 'big', text: 'BENJAMIN TURNER', sub: "ALABAMA'S 1ST BLACK CONGRESSMAN", x: 1110, y: 300, size: 40 },
  { at: [3, 'enslaved'], kind: 'dark', text: 'BORN ENSLAVED', x: 1110, y: 520, size: 36 },
  { at: [4, 'last'], kind: 'red', text: 'IT DID NOT LAST', x: 1110, y: 700, size: 40, rot: -3 },
] });
const irConst = hostScene({ X: 1640, keys: (b) => [{ at: 0, arm: 'present', expr: 'worried' }, { at: T(b, [13, 'novels']), arm: 'shrug', expr: 'grin' }], items: [
  { at: [0, '1901'], kind: 'big', text: '1901', sub: 'NEW STATE CONSTITUTION', x: 1110, y: 240, size: 44, hide: [4, 'quote'] },
  { at: [4, 'quote'], kind: 'dark', text: '"…TO ESTABLISH WHITE SUPREMACY', sub: 'IN THIS STATE."  JOHN B. KNOX, 1901', x: 1110, y: 260, size: 32, hide: [10, 'amended'] },
  { at: [6, 'poll'], kind: 'red', text: 'POLL TAX', x: 990, y: 470, size: 32, rot: -4, hide: [10, 'amended'] },
  { at: [6, 'literacy'], kind: 'red', text: 'LITERACY TEST', x: 1260, y: 470, size: 32, rot: 4, hide: [10, 'amended'] },
  { at: [7, 'rolls'], kind: 'art', x: 1110, y: 760, el: (b) => <BallotBox fill={1 - Pg(b, [7, 'emptied'], 40)} />, hide: [10, 'amended'] },
  { at: [10, 'amended'], kind: 'big', count: 977, text: ' AMENDMENTS', x: 1110, y: 260, size: 44 },
  { at: [12, 'longest'], kind: 'art', x: 1030, y: 820, el: () => <g>{[0, 1, 2].map((i) => <g key={i} transform={`translate(0 ${-i * 160})`}><Book h={150} title={i === 2 ? 'ALABAMA' : ''} /></g>)}</g> },
  { at: [12, 'longest'], kind: 'gold', text: "WORLD'S LONGEST", x: 1290, y: 460, size: 30, rot: 5 },
  { at: [13, 'novels'], kind: 'art', x: 1290, y: 790, el: () => <g transform="scale(0.5)"><Book h={120} title="NOVEL" /></g> },
] });

// ------------------------------------------------------------------ 290-316: Red Mountain, Birmingham, Vulcan
const ORES = [{ t: 'IRON ORE', c: '#A8503A', w: [3, 'iron'] as [number, string] }, { t: 'COAL', c: '#2A2A30', w: [4, 'coal'] as [number, string] }, { t: 'LIMESTONE', c: '#D9D3C4', w: [5, 'limestone'] as [number, string] }];
const IrIron: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const casts = ORES.map((o) => cg(b, o.w[0], o.w[1]));
  const slots = [300, 470, 640];
  const cards = casts.map((c, i) => fishCard(b.g, c, slots[i]));
  return (
    <Stage>
      <Items b={b} items={[{ at: [2, 'red'], kind: 'dark', text: 'RED MOUNTAIN', x: 1080, y: 860, size: 34 }, { at: [7, 'make'], kind: 'gold', text: '= IRON', x: 1330, y: 800, size: 46 }, { at: [9, 'rare'], kind: 'stamp', text: 'RARE!', x: 1330, y: 720, size: 50 }]} />
      {cards.map((c, i) => c && <g key={i} transform={`rotate(${c.swing} 1080 ${c.y - 40})`}><g transform={`translate(1080 ${c.y})`}>
        <rect x={-150} y={-40} width={300} height={80} rx={12} fill={ORES[i].c} stroke={OL} strokeWidth={5} />
        <Txt y={14} t={ORES[i].t} size={36} c={i === 2 ? INK : '#fff'} />
      </g></g>)}
      <FishHost t={b.g} X={1620} casts={casts} talking={talk(s)} lines={cards.map((c) => (c?.line ? { x: 1080, y: c.y - 40 } : null)).filter(Boolean) as { x: number; y: number }[]} />
    </Stage>
  );
};
const irMagic = mapScene({ al: { x: 860, y: 540, h: 820, fill: '#E9D9B0' }, rider: { x: 1640, y: 640 },
  pins: [{ at: [2, 'birmingham'], place: 'Birmingham', label: 'BIRMINGHAM', star: true, c: RED, size: 34 }],
  tags: [{ at: [0, '1871'], text: '1871', x: 1450, y: 230, bg: RED, size: 50 }, { at: [4, 'magic'], text: '"THE MAGIC CITY"', x: 1450, y: 320, size: 40 }],
  extra: (b, pt) => { const p = pt([-86.8, 33.52]); const k = Pg(b, [3, 'grew'], 60); return k > 0 ? <circle cx={p[0]} cy={p[1]} r={20 + 90 * k} fill={RED} fillOpacity={0.18} stroke={RED} strokeWidth={3} /> : null; } });
const IrVulcan: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const pieces = On(b, [8, 'pieces']) && !On(b, [9, 'today']);
  const onHill = On(b, [9, 'today']);
  const back = On(b, [10, 'backside']);
  const vk = K(b, [1, 'vulcan']);
  return (
    <Stage>
      {onHill && <path d="M860 900 Q1100 600 1380 900 Z" fill="#A8503A" stroke={OL} strokeWidth={5} />}
      {vk > 0 && !pieces && <g transform={`translate(${onHill ? 1120 : 1110} ${onHill ? 700 : 900}) scale(${Math.min(1, vk) * (onHill ? 0.75 : 1)})`}><Vulcan back={back} /></g>}
      {pieces && <g transform="translate(1110 880)">
        <path d="M-260 30 H260 M-260 50 H260" stroke="#5A5F68" strokeWidth={6} />{Array.from({ length: 9 }, (_, i) => <rect key={i} x={-250 + i * 60} y={30} width={14} height={30} fill="#6A4A2E" />)}
        <g transform="translate(-150 -10) rotate(-70)"><path d="M-40 -100 L-46 -230 Q0 -250 46 -230 L40 -100 Z" fill="#3A3E46" stroke={OL} strokeWidth={4} /></g>
        <circle cx={40} cy={0} r={30} fill="#3A3E46" stroke={OL} strokeWidth={4} />
        <g transform="translate(180 -10) rotate(80)"><path d="M-34 -40 L-28 -200 L28 -200 L34 -40 Z" fill="#3A3E46" stroke={OL} strokeWidth={4} /></g>
      </g>}
      <Items b={b} items={[
        { at: [3, '56'], kind: 'big', text: '56 FT', x: 900, y: 420, size: 40, hide: [6, 'fair'] },
        { at: [4, 'largest'], kind: 'gold', text: 'LARGEST CAST-IRON STATUE', x: 1110, y: 220, size: 30, hide: [6, 'fair'] },
        { at: [7, 'shipping'], kind: 'art', x: 1300, y: 300, rot: 6, el: () => <g><rect x={-150} y={-80} width={300} height={160} fill={PAPER} stroke={OL} strokeWidth={4} /><Txt y={-30} t="SHIPPING BILL" size={30} /><Txt y={30} t="UNPAID" size={46} c={RED} /></g>, hide: [9, 'today'] },
        { at: [10, 'backside'], kind: 'sign', text: 'THE NEIGHBOURS →', x: 1330, y: 360, size: 30, rot: 4 },
      ]} />
      <Twirl t={b.g - 6} X={1640} talking={talk(s)} keys={[{ at: 0, arm: back ? 'chin' : 'present', expr: back ? 'grin' : 'proud' }]} />
    </Stage>
  );
};
const irLease = quietScene({ lines: [{ at: [2, 'thousands'], text: 'CONVICT LEASING', y: 210, size: 48, c: '#E4DCCB' }, { at: [4, 'coal'], text: 'LEASED TO COAL MINES AND WORK CAMPS', y: 280, size: 30 }, { at: [6, 'many'], text: 'MANY DIED', y: 770, size: 40 }, { at: [8, '1928'], text: 'ALABAMA ENDED IT LAST: 1928', y: 830, size: 32 }],
  art: () => <><path d="M660 720 Q660 440 960 420 Q1260 440 1260 720 Z" fill="#0E1116" stroke="#2A323C" strokeWidth={8} /><path d="M700 720 L860 560 M1220 720 L1060 560 M760 720 L900 620 M1160 720 L1020 620" stroke="#2A323C" strokeWidth={6} /><rect y={720} width={1920} height={360} fill="#0E1116" /></> });

// ------------------------------------------------------------------ 326-339: Tuskegee, Carver, peanuts
const USES = [{ w: 'dyes', t: 'DYES', x: 990, y: 300 }, { w: 'milk', t: 'MILK', x: 1250, y: 300 }, { w: 'plastics', t: 'PLASTICS', x: 990, y: 470 }, { w: 'cosmetics', t: 'COSMETICS', x: 1250, y: 470 }];
const IrCarver: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const listing = b.k === 9;
  return (
    <Stage>
      <Items b={b} items={[
        { at: [0, 'tuskegee'], kind: 'sign', text: 'TUSKEGEE INSTITUTE', x: 1110, y: 220, size: 34 },
        { at: [1, 'booker'], kind: 'dark', text: 'BOOKER T. WASHINGTON', x: 1110, y: 300, size: 32, hide: [3, '1896'] },
        { at: [3, '1896'], kind: 'big', text: '1896', sub: 'GEORGE WASHINGTON CARVER', x: 1110, y: 330, size: 40, hide: [8, 'hundreds'] },
        { at: [6, 'peanuts'], kind: 'art', x: 1110, y: 680, el: () => <g transform="scale(1.3)"><Peanut /></g>, drop: true },
        { at: [7, 'soil'], kind: 'green', text: 'GOOD FOR THE SOIL', x: 1110, y: 820, size: 30 },
        { at: [8, 'hundreds'], kind: 'gold', text: 'HUNDREDS OF USES', x: 1110, y: 220, size: 34 },
        ...USES.map((u) => ({ at: [9, u.w] as [number, string], kind: 'sign' as const, text: u.t, x: u.x, y: u.y, size: 34 })),
        { at: [10, 'peanut'], kind: 'stamp', text: 'NOT PEANUT BUTTER', x: 1110, y: 560, size: 42 },
        { at: [13, 'money'], kind: 'red', text: 'BUT COTTON = MONEY', x: 1110, y: 220, size: 34 },
      ]} />
      {listing ? <Laser f={b.f} X={1620} talking={talk(s)} keys={[{ at: 0, arm: 'present', expr: 'grin' }]} targets={USES.map((u) => ({ x: u.x + 40, y: u.y, at: T(b, [9, u.w]) }))} />
        : <HostS s={s} x={1620} keys={[{ at: 0, arm: b.k === 11 ? 'shrug' : b.k >= 12 ? 'chin' : 'present', expr: b.k === 11 ? 'grin' : 'smile' }]} />}
    </Stage>
  );
};
const COTTON_XY = Array.from({ length: 24 }, (_, i) => ({ x: 120 + (i % 8) * 230 + ((i >> 3) % 2) * 110, y: 760 + (i >> 3) * 90 }));
const irWeevil = storyScene({ sky: 'skyDay', ground: '#B9A06A', rider: { x: 1650, y: 260, flip: true, arm: 'point', expr: 'shock' },
  art: (b) => {
    const eaten = Pg(b, [3, 'ate'], 80), switched = Pg(b, [6, 'peanuts'], 40);
    return (<>
      <Hills y={620} fill="#8DA862" amp={20} seed="wv" />
      {COTTON_XY.map((p, i) => { const gone = (i / COTTON_XY.length) < eaten; return switched > 0 ? <g key={i} transform={`translate(${p.x} ${p.y}) scale(${switched})`}><path d="M0 0 q-30 -30 -40 -10 M0 0 q30 -30 40 -10 M0 0 v-40" stroke="#5E8A3A" strokeWidth={8} fill="none" strokeLinecap="round" /></g> : !gone ? <g key={i} transform={`translate(${p.x} ${p.y - 40}) scale(0.7)`}><line x1={0} y1={30} x2={0} y2={70} stroke="#5E8A3A" strokeWidth={6} /><circle r={18} fill="#FBFAF4" stroke={OL} strokeWidth={3} /><circle cx={-16} cy={8} r={14} fill="#FBFAF4" stroke={OL} strokeWidth={3} /></g> : <g key={i} transform={`translate(${p.x} ${p.y})`}><line x1={0} y1={0} x2={0} y2={-30} stroke="#7A5A34" strokeWidth={5} /></g>; })}
      {On(b, [2, 'weevil']) && switched < 1 && Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(${200 + i * 230 + Math.sin(b.g / 8 + i) * 20} ${780 + (i % 3) * 90})`}><Weevil s={1.2} /></g>)}
    </>);
  },
  items: [{ at: [0, '1910s'], kind: 'dark', text: 'THE 1910s', x: 300, y: 200, size: 34 }, { at: [2, 'weevil'], kind: 'big', text: 'THE BOLL WEEVIL', x: 960, y: 260, size: 40, hide: [5, 'enterprise'] },
    { at: [4, 'ruined'], kind: 'red', text: 'WHOLE COUNTIES RUINED', x: 960, y: 400, size: 32, hide: [5, 'enterprise'] }, { at: [5, 'enterprise'], kind: 'sign', text: 'ENTERPRISE, ALABAMA', x: 960, y: 260, size: 38 },
    { at: [6, 'peanuts'], kind: 'green', text: 'SWITCH TO PEANUTS', x: 960, y: 370, size: 34 }, { at: [7, 'money'], kind: 'gold', text: 'MORE MONEY THAN COTTON', x: 960, y: 470, size: 30 }] });
const irMonument = hostScene({ items: [
  { at: [0, '1919'], kind: 'big', text: '1919', sub: 'ENTERPRISE', x: 1110, y: 230, size: 40, hide: [3, 'monument'] },
  { at: [3, 'monument'], kind: 'art', x: 1110, y: 820, el: () => <g transform="scale(1.05)"><Monument /></g>, drop: true },
  { at: [4, 'bug'], kind: 'gold', text: 'TO THE BUG', x: 1320, y: 300, size: 38, rot: 5 },
  { at: [8, 'only'], kind: 'stamp', text: "WORLD'S ONLY PEST MONUMENT", x: 1110, y: 220, size: 34, rot: -4 },
], move: (b, s) => <SkyDrop t={b.g - 4} X={1600} talking={talk(s)} keys={[{ at: 0, arm: b.k >= 4 ? 'point' : 'present', expr: 'grin' }]} />, shakes: [{ at: 26, amp: 10, len: 8 }] });
const IrWright: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const night = Pg(b, [4, 'night'], 30);
  const px = interpolate(b.g, [30, b.gd], [980, 1300]);
  return (
    <Stage>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#14203A" opacity={0.75 * night} />
      {night > 0 && Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 197) % 1920} cy={80 + ((i * 131) % 600)} r={2 + (i % 3)} fill="#fff" opacity={night * (0.5 + 0.4 * Math.sin(b.g / 10 + i))} />)}
      {On(b, [1, 'wright']) && <g transform={`translate(${px} ${470 + Math.sin(b.g / 12) * 30}) rotate(${Math.sin(b.g / 16) * 4})`}><Biplane f={b.g} /></g>}
      <Items b={b} items={[{ at: [1, '1910'], kind: 'big', text: '1910', sub: 'THE WRIGHT BROTHERS', x: 1000, y: 700, size: 38, hide: [3, 'flying'] }, { at: [3, 'flying'], kind: 'gold', text: "AMERICA'S 1ST CIVILIAN FLYING SCHOOL", x: 1000, y: 220, size: 28 }, { at: [4, 'night'], kind: 'dark', text: 'FIRST NIGHT FLIGHTS', x: 1000, y: 700, size: 36 }]} />
      <Heli t={b.g - 50} X={1620} talking={talk(s)} />
    </Stage>
  );
};

// ------------------------------------------------------------------ 367-395: Helen Keller, famous Alabamians, the Great Migration
const LETTERS = ['W', 'A', 'T', 'E', 'R'];
const IrKeller: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const w = T(b, [10, 'water']);
  return (
    <Stage>
      <Items b={b} items={[{ at: [3, 'tuscumbia'], kind: 'sign', text: 'TUSCUMBIA, ALABAMA · 1880', x: 1110, y: 220, size: 30 }, { at: [11, 'helen'], kind: 'big', text: 'HELEN KELLER', sub: 'THINGS HAVE NAMES', x: 1110, y: 300, size: 44 }]} />
      {On(b, [6, 'pump']) && <g transform="translate(1000 760)">
        <rect x={-40} y={-260} width={80} height={260} fill="#5A6672" stroke={OL} strokeWidth={5} /><path d="M40 -200 h70 v30 h-40 v20" fill="none" stroke="#5A6672" strokeWidth={16} /><path d="M-40 -230 L-140 -290" stroke="#5A6672" strokeWidth={14} strokeLinecap="round" />
        {Array.from({ length: 6 }, (_, i) => { const t = (b.g * 3 + i * 18) % 108; return <ellipse key={i} cx={90} cy={-140 + t} rx={6} ry={10} fill="#7FAFD6" opacity={0.8} />; })}
        <g transform="translate(110 -10)"><path d="M-40 0 q20 -26 60 -10 l30 4 q8 10 -4 14 l-60 6 Z" fill="#E8C29A" stroke={OL} strokeWidth={3} /></g>
      </g>}
      {b.k >= 10 && LETTERS.map((l, i) => { const a = b.k > 10 ? 1 : springPop(b.f, w - 6 + i * 6); return a > 0 ? <g key={l} transform={`translate(${1180 + i * 60} ${560}) scale(${a})`}><rect x={-26} y={-34} width={52} height={68} rx={8} fill={GOLD} stroke={OL} strokeWidth={4} /><Txt y={14} t={l} size={40} /></g> : null; })}
      <HostS s={s} x={1620} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at: Math.max(0, T(b, [11, 'helen'])), arm: 'point', expr: 'proud' }]} />
    </Stage>
  );
};
const NAMES: { w: [number, string]; t: string; sub: string; x: number; y: number }[] = [
  { w: [1, 'owens'], t: 'JESSE OWENS', sub: '4 GOLDS, BERLIN 1936', x: 1000, y: 200 }, { w: [3, 'louis'], t: 'JOE LOUIS', sub: 'BOXING', x: 1270, y: 200 },
  { w: [4, 'aaron'], t: 'HANK AARON', sub: 'BASEBALL', x: 1000, y: 380 }, { w: [4, 'mays'], t: 'WILLIE MAYS', sub: 'BASEBALL', x: 1270, y: 380 },
  { w: [6, 'cole'], t: 'NAT KING COLE', sub: 'MUSIC', x: 1000, y: 560 }, { w: [6, 'williams'], t: 'HANK WILLIAMS', sub: 'MUSIC', x: 1270, y: 560 },
];
const irNames = hostScene({ items: [
  ...NAMES.map((n) => ({ at: n.w, kind: 'sign' as const, text: n.t, sub: n.sub, x: n.x, y: n.y, size: 28 })),
  { at: [7, 'born'], kind: 'gold', text: 'ALL BORN IN ALABAMA', x: 1135, y: 760, size: 38 },
], keys: (b) => [{ at: 0, arm: 'present', expr: 'grin' }, { at: T(b, [1, 'owens']), arm: 'point', expr: 'proud' }, { at: Math.max(0, T(b, [7, 'born'])), arm: 'fist', expr: 'grin' }] });
const irMigration = mapScene({ world: { from: [-85, 38, 6.0] }, rider: { x: 1700, y: 760 },
  routes: [{ at: [4, 'chicago'], ll: [[-86.8, 33.5], [-87.4, 37], [-87.63, 41.88]], dur: 40 }, { at: [4, 'detroit'], ll: [[-86.5, 33.6], [-85, 37.5], [-83.05, 42.33]], dur: 40 }, { at: [4, 'cleveland'], ll: [[-86.3, 33.7], [-83.5, 37.5], [-81.69, 41.5]], dur: 40 }],
  pins: [{ at: [4, 'chicago'], ll: [-87.63, 41.88], label: 'CHICAGO', dx: -30, dy: -26 }, { at: [4, 'detroit'], ll: [-83.05, 42.33], label: 'DETROIT', dy: -30 }, { at: [4, 'cleveland'], ll: [-81.69, 41.5], label: 'CLEVELAND', dy: 34 }],
  tags: [{ at: [1, 'hundreds'], text: 'THE GREAT MIGRATION', x: 400, y: 230, bg: RED, size: 40 }, { at: [5, 'crow'], text: 'A LIFE WITHOUT JIM CROW', x: 400, y: 310, size: 30 }] });

// ------------------------------------------------------------------ 396-433: Scottsboro (quiet), the Red Tails, the Tuskegee study (quiet)
const irScottsboro = quietScene({ lines: [{ at: [0], text: '1931', y: 200 }, { at: [5, 'scottsboro'], text: 'SCOTTSBORO', y: 270, size: 52, c: '#E4DCCB' }, { at: [2, 'nine'], text: 'NINE BLACK TEENAGERS · INNOCENT', y: 760, size: 32 }, { at: [9, 'supreme'], text: 'SUPREME COURT: TWICE', y: 820, size: 30 }, { at: [14, 'pardoned'], text: 'LAST PARDONED IN 2013', y: 870, size: 30 }],
  art: (b) => <g transform={`translate(${-80 + b.g * 0.2} 0)`}><rect y={640} width={2400} height={8} fill="#2A323C" />{Array.from({ length: 5 }, (_, i) => <g key={i} transform={`translate(${200 + i * 300} 520)`}><rect width={270} height={110} rx={6} fill="#20262E" stroke="#2A323C" strokeWidth={4} /><circle cx={50} cy={120} r={20} fill="#14181E" /><circle cx={220} cy={120} r={20} fill="#14181E" /></g>)}</g> });
const irRedtails = storyScene({ sky: 'skyDay', rider: { x: 1640, y: 760, arm: 'point', expr: 'grin' },
  art: (b) => <><Cloud x={400} y={300} s={1.4} /><Cloud x={1300} y={200} /><Hills y={900} fill="#7E9E62" amp={30} seed="rt" />
    {On(b, [8, 'red']) && [0, 1, 2].map((i) => <g key={i} transform={`translate(${interpolate(b.g, [0, b.gd], [-200, 2000]) - i * 260} ${400 + i * 80 + Math.sin(b.g / 15 + i) * 10})`}><RedTail s={0.9} /></g>)}</>,
  items: [{ at: [0, 'wright'], kind: 'sign', text: 'REMEMBER THE WRIGHT BROTHERS?', x: 760, y: 200, size: 30, hide: [2, '1941'] }, { at: [2, 'tuskegee'], kind: 'big', text: '1941 · TUSKEGEE', sub: "AMERICA'S FIRST BLACK MILITARY PILOTS", x: 760, y: 230, size: 40 },
    { at: [5, 'fail'], kind: 'stamp', text: 'EXPECTED TO FAIL', x: 760, y: 470, size: 40, hide: [6, 'thousand'] }, { at: [6, 'thousand'], kind: 'big', count: 1000, text: ' PILOTS', x: 760, y: 470, size: 40 }, { at: [9, 'tails'], kind: 'red', text: 'THE RED TAILS', x: 760, y: 680, size: 46 }] });
const irStudy = quietScene({ lines: [{ at: [1, '1932'], text: 'TUSKEGEE, 1932', y: 210, size: 44, c: '#E4DCCB' }, { at: [3, 'never'], text: 'NEVER TOLD WHAT THEY HAD', y: 280, size: 30 }, { at: [4, 'penicillin'], text: 'NOT GIVEN THE CURE', y: 760, size: 36 }, { at: [6, '40'], text: '40 YEARS · EXPOSED 1972', y: 820, size: 30 }, { at: [8, '1997'], text: 'APOLOGY: 1997', y: 870, size: 30 }] });

// ------------------------------------------------------------------ 434-481: Redstone, the rocket team, the Saturn V, the boom
const rcArsenal = mapScene({ al: { x: 860, y: 540, h: 820, fill: '#E9D9B0' }, rider: { x: 1640, y: 640 },
  pins: [{ at: [4, 'huntsville'], place: 'Huntsville', label: 'HUNTSVILLE', star: true, c: RED, dx: 26, dy: -26, size: 32 }],
  tags: [{ at: [0, '1941'], text: '1941 · WAR AGAIN', x: 1450, y: 230, bg: RED, size: 40 }, { at: [5, 'redstone'], text: 'REDSTONE ARSENAL', x: 1450, y: 320, size: 38 }, { at: [6, 'quiet'], text: '1945: IT GOES QUIET', x: 1450, y: 400, bg: '#5A5A6A', size: 30 }] });
const rcGermans = hostScene({ items: [
  { at: [0, '1950'], kind: 'big', text: '1950', sub: '100+ GERMAN ENGINEERS', x: 1110, y: 220, size: 40, hide: [2, '16000'] },
  { at: [2, '16000'], kind: 'big', text: 'POP. 16,000', x: 1110, y: 220, size: 40, hide: [6, 'braun'] },
  { at: [3, 'watercress'], kind: 'art', x: 1110, y: 470, el: () => <g><rect x={-230} y={-70} width={460} height={140} rx={12} fill="#2F5E3A" stroke={OL} strokeWidth={5} /><g transform="translate(-170 10) scale(0.8)"><Leaf /></g><Txt x={30} y={-6} t="WATERCRESS CAPITAL" size={30} c="#fff" /><Txt x={30} y={36} t="OF THE WORLD" size={26} c={GOLD} /></g>, hide: [5, 'rockets'] },
  { at: [5, 'rockets'], kind: 'art', x: 1110, y: 760, el: () => <g transform="scale(0.42)"><Rocket /></g> },
  { at: [6, 'braun'], kind: 'dark', text: 'WERNHER VON BRAUN', x: 1110, y: 220, size: 36 },
  { at: [7, 'v2'], kind: 'red', text: 'BUILT THE V-2', sub: 'FIRST LONG-RANGE BALLISTIC MISSILE', x: 1110, y: 420, size: 34 },
] });
const rcPast = quietScene({ lines: [{ at: [0], text: 'THE PART HUNTSVILLE TOOK YEARS TO FACE', y: 210, size: 34, c: '#E4DCCB' }, { at: [3, 'nazi'], text: 'NAZI PARTY · SS OFFICER', y: 280, size: 30 }, { at: [5, 'prisoners'], text: 'BUILT BY CONCENTRATION-CAMP PRISONERS', y: 760, size: 32 }, { at: [7, 'more'], text: 'MORE DIED BUILDING IT THAN WERE KILLED BY IT', y: 820, size: 30 }, { at: [11, 'questions'], text: 'QUESTIONS CAME MUCH LATER', y: 870, size: 28 }] });
const RcExplorer: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const t = Math.max(0, b.g - 30);
  const lift = 0.5 * 0.12 * t * t;
  const orbit = On(b, [3, 'explorer']);
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <rect width={1920} height={1080} fill="url(#skyNight)" />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 197) % 1920} cy={(i * 131) % 700} r={1.5 + (i % 3)} fill="#fff" opacity={0.6} />)}
      <rect y={960} width={1920} height={120} fill="#2A3038" />
      {!orbit && <g transform={`translate(900 ${960 - lift}) scale(0.55, 0.42)`}><Rocket flame={t > 0 ? 1 : 0} /></g>}
      {orbit && <g><ellipse cx={1100} cy={420} rx={420} ry={140} fill="none" stroke="#7FAFD6" strokeWidth={3} strokeDasharray="10 10" /><g transform={`translate(${1100 + Math.cos(b.g / 14) * 420} ${420 + Math.sin(b.g / 14) * 140})`}><rect x={-6} y={-40} width={12} height={80} fill="#C9C9C9" stroke={OL} strokeWidth={3} />{[-1, 1].map((d) => <line key={d} x1={0} y1={0} x2={d * 50} y2={30} stroke="#C9C9C9" strokeWidth={3} />)}</g></g>}
      <Items minLeft={0} b={b} items={[{ at: [1, '1958'], kind: 'big', text: 'JANUARY 1958', x: 480, y: 260, size: 40 }, { at: [3, 'explorer'], kind: 'gold', text: "EXPLORER 1 · AMERICA'S FIRST SATELLITE", x: 900, y: 820, size: 30 }]} />
    </svg>
  );
};
const RcSaturn: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const start = cg(b, 4, 'drawing');
  const t = start > 9e4 ? -1 : start < -900 ? 999 : b.g - start;
  const p = pullerState(t, 1620, 860);
  const bottom = t < 0 ? -60 : p.bottom;
  return (
    <Stage>
      <Items b={b} items={[{ at: [0, '1960'], kind: 'big', text: '1960', sub: 'MARSHALL SPACE FLIGHT CENTER', x: 1110, y: 280, size: 40, hide: [4, 'drawing'] }, { at: [3, 'director'], kind: 'dark', text: 'DIRECTOR: VON BRAUN', x: 1110, y: 520, size: 32, hide: [4, 'drawing'] }]} />
      {bottom > -50 && <g transform={`translate(1060 ${bottom - 760})`}>
        <rect x={-260} y={0} width={520} height={760} rx={10} fill="#1F4E79" stroke="#BFE0F0" strokeWidth={6} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={-260} y1={i * 64} x2={260} y2={i * 64} stroke="#7FAFD6" strokeOpacity={0.3} strokeWidth={2} />)}
        <g transform="translate(-90 700) scale(1)"><Rocket /></g>
        <g transform="translate(130 700)"><path d="M-30 0 V-120 H30 V0 Z M-20 -120 L-14 -400 L14 -400 L20 -120 Z" fill="none" stroke="#BFE0F0" strokeWidth={4} /><circle cy={-420} r={20} fill="none" stroke="#BFE0F0" strokeWidth={4} /><path d="M10 -420 L40 -500" stroke="#BFE0F0" strokeWidth={6} /></g>
        <Txt x={-90} y={60} t="SATURN V" size={34} c="#fff" />
        <Txt x={130} y={300} t="LIBERTY" size={22} c="#BFE0F0" />
        <line x1={-220} y1={80} x2={-220} y2={700} stroke={GOLD} strokeWidth={4} /><Txt x={-150} y={400} t="363 FT" size={26} c={GOLD} />
      </g>}
      {On(b, [7, 'moon']) && <g transform="translate(1440 180)"><Moon r={60} /></g>}
      <Puller t={t} X={1620} talking={talk(s)} keys={[{ at: 0, arm: b.k >= 5 ? 'point' : 'present', expr: 'grin' }]} />
    </Stage>
  );
};
const rcBoom = hostScene({ items: [
  { at: [0, 'engineers'], kind: 'sign', text: 'ENGINEERS · MATHEMATICIANS · MACHINISTS', x: 1110, y: 220, size: 24, hide: [2, 'population'] },
  { at: [2, 'population'], kind: 'big', count: 72000, text: '', sub: 'HUNTSVILLE BY 1960 (FROM 16,000)', x: 1110, y: 300, size: 44, hide: [5, 'montgomery'] },
  { at: [4, 'rocket'], kind: 'gold', text: '"THE ROCKET CITY"', x: 1110, y: 560, size: 46, hide: [5, 'montgomery'] },
  { at: [5, 'montgomery'], kind: 'dark', text: 'MEANWHILE, IN MONTGOMERY…', x: 1110, y: 300, size: 34 },
], keys: (b) => [{ at: 0, arm: 'present', expr: 'grin' }, { at: Math.max(0, T(b, [5, 'montgomery'])), arm: 'point', expr: 'proud' }] });

export const SHOTS_ERA3: ShotMap = {
  ir_turner: irTurner, ir_const: irConst, ir_iron: IrIron, ir_magic: irMagic, ir_vulcan: IrVulcan, ir_lease: irLease, ir_carver: IrCarver,
  ir_weevil: irWeevil, ir_monument: irMonument, ir_wright: IrWright, ir_keller: IrKeller, ir_names: irNames, ir_migration: irMigration,
  ir_scottsboro: irScottsboro, ir_redtails: irRedtails, ir_study: irStudy,
  rc_arsenal: rcArsenal, rc_germans: rcGermans, rc_past: rcPast, rc_explorer: RcExplorer, rc_saturn: RcSaturn, rc_boom: rcBoom,
};
void Chibi; void SKIN; void Corn; void ease; void Quiet; void Pop; void Easing;
