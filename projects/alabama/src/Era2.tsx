/** Empires (French to 1813), Statehood, Cotton, War: captions 81-270 (3:35 to 11:00). */
import React from 'react';
import { interpolate, Easing, springPop } from '@engine/lib/core';
import { OL, Tree, Hills } from '@engine/scenes/Parts';
import { Chibi } from '@engine/characters/Chibi';
import { SKIN } from '@engine/cast/Wardrobe';
import { talk, type ShotMap, type SP } from '@engine/kit';
import { Stage } from '@engine/moves';
import { PAPER, RED, GOLD, INK, alPt } from './Kit';
import { useBeat, HostS, Txt, Pop } from './Kit2';
import { AlMap, Pin, Route, Palisade, Mound, ease, NAVY } from './KitAL';
import { Laser, Sweep, sweptPos, VaultOn, ReactionDrop } from './Moves';
import { hostScene, mapScene, quietScene, streetScene, storyScene, Items, T, K, Pg, On, type B, type Item } from './Factory';

// ------------------------------------------------------------------ small drawn props
export const Flag: React.FC<{ kind: 'fr' | 'gb' | 'es' | 'us' | 'csa' | 'al'; w?: number }> = ({ kind, w = 150 }) => {
  const h = w * 0.62;
  return (
    <g>
      <line x1={-w / 2 - 8} y1={-h / 2 - 10} x2={-w / 2 - 8} y2={h / 2 + 60} stroke="#5A3E26" strokeWidth={7} strokeLinecap="round" />
      <g transform={`translate(${-w / 2} ${-h / 2})`}>
        {kind === 'fr' && <><rect width={w} height={h} fill="#F4F2EC" stroke={OL} strokeWidth={4} />{[[0.3, 0.35], [0.7, 0.35], [0.5, 0.7]].map(([x, y], i) => <circle key={i} cx={x * w} cy={y * h} r={w * 0.07} fill={GOLD} stroke={OL} strokeWidth={2} />)}</>}
        {kind === 'gb' && <><rect width={w} height={h} fill="#2E4A9A" stroke={OL} strokeWidth={4} /><path d={`M0 0 L${w} ${h} M${w} 0 L0 ${h}`} stroke="#fff" strokeWidth={h * 0.18} /><path d={`M${w / 2} 0 V${h} M0 ${h / 2} H${w}`} stroke="#fff" strokeWidth={h * 0.3} /><path d={`M${w / 2} 0 V${h} M0 ${h / 2} H${w}`} stroke="#C0392B" strokeWidth={h * 0.16} /><rect width={w} height={h} fill="none" stroke={OL} strokeWidth={4} /></>}
        {kind === 'es' && <><rect width={w} height={h} fill="#C0392B" stroke={OL} strokeWidth={4} /><rect y={h * 0.25} width={w} height={h * 0.5} fill={GOLD} /><rect width={w} height={h} fill="none" stroke={OL} strokeWidth={4} /></>}
        {kind === 'us' && <><rect width={w} height={h} fill="#fff" stroke={OL} strokeWidth={4} />{[0, 2, 4, 6].map((i) => <rect key={i} y={(i * h) / 7} width={w} height={h / 7} fill="#C0392B" />)}<rect width={w * 0.42} height={h * 0.55} fill="#2E4A9A" /><rect width={w} height={h} fill="none" stroke={OL} strokeWidth={4} /></>}
        {kind === 'csa' && <><rect width={w} height={h} fill="#C0392B" stroke={OL} strokeWidth={4} /><rect y={h / 3} width={w} height={h / 3} fill="#F4F2EC" /><rect width={w * 0.38} height={h * 0.67} fill="#2E4A9A" /><rect width={w} height={h} fill="none" stroke={OL} strokeWidth={4} /></>}
      </g>
    </g>
  );
};
const Boll: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><path d="M-6 30 L0 60 L6 30" fill="#5A3E26" />{[[-18, -4], [18, -4], [0, -24], [0, 10]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={20} fill="#FBFAF4" stroke={OL} strokeWidth={3} />)}<path d="M-26 24 q26 -14 52 0" stroke="#7A5A34" strokeWidth={6} fill="none" /></g>
);
const Steamboat: React.FC<{ s?: number; f?: number }> = ({ s = 1, f = 0 }) => (
  <g transform={`scale(${s})`}>
    {[0, 1].map((i) => { const t = (f + i * 15) % 30; return <circle key={i} cx={-30 - t} cy={-150 - t * 2} r={12 + t * 0.6} fill="#D8D2C4" opacity={0.7 - t / 45} />; })}
    <rect x={-44} y={-150} width={14} height={70} fill="#2A2A30" /><rect x={-14} y={-150} width={14} height={70} fill="#2A2A30" />
    <rect x={-120} y={-84} width={220} height={40} fill="#F4F2EC" stroke={OL} strokeWidth={4} />
    <path d="M-150 -44 H140 L110 0 H-130 Z" fill="#B9A77F" stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    {[-90, -40, 10, 60].map((x) => <g key={x}><rect x={x} y={-112} width={40} height={30} fill="#FBFAF4" stroke={OL} strokeWidth={3} /><path d={`M${x} -97 h40`} stroke="#B9A77F" strokeWidth={2} /></g>)}
    <circle cx={120} cy={-26} r={30} fill="none" stroke="#8A5A34" strokeWidth={6} transform={`rotate(${f * 6} 120 -26)`} strokeDasharray="10 8" />
  </g>
);
const Telegram: React.FC = () => (
  <g transform="rotate(-4)">
    <rect x={-170} y={-110} width={340} height={220} fill="#F6EACB" stroke={OL} strokeWidth={5} />
    <Txt y={-60} t="TELEGRAM" size={34} c={RED} />
    <Txt y={-18} t="MONTGOMERY, APRIL 11, 1861" size={18} c="#5A4A3A" />
    {[16, 46, 76].map((y) => <path key={y} d={`M-130 ${y} h${y === 76 ? 150 : 260}`} stroke="#B9A77F" strokeWidth={6} strokeLinecap="round" />)}
    <Txt x={60} y={84} t="FORT SUMTER" size={24} c={INK} />
  </g>
);
const Mask: React.FC<{ c?: string }> = ({ c = '#7B3FA0' }) => (
  <g><path d="M-90 -20 Q-60 -50 0 -30 Q60 -50 90 -20 Q80 30 30 20 Q0 10 -30 20 Q-80 30 -90 -20 Z" fill={c} stroke={OL} strokeWidth={4} /><ellipse cx={-40} cy={-8} rx={20} ry={11} fill="#1A1410" /><ellipse cx={40} cy={-8} rx={20} ry={11} fill="#1A1410" />{[-70, -50, -30].map((x, i) => <path key={i} d={`M${x} -34 q-10 -50 ${10 + i * 6} -60`} stroke={[GOLD, '#2E9D57', GOLD][i]} strokeWidth={8} fill="none" strokeLinecap="round" />)}</g>
);
const Ox: React.FC = () => (
  <g>
    <rect x={-150} y={10} width={300} height={40} rx={8} fill="#8A5A34" stroke={OL} strokeWidth={4} />{[-110, 110].map((x) => <circle key={x} cx={x} cy={56} r={18} fill="#5A3E26" stroke={OL} strokeWidth={3} />)}
    <ellipse cx={0} cy={-40} rx={110} ry={50} fill="#C99A6A" stroke={OL} strokeWidth={4} />
    <path d="M90 -70 q50 -10 60 30 q-20 20 -50 10 Z" fill="#C99A6A" stroke={OL} strokeWidth={4} /><path d="M120 -80 q20 -30 40 -20 M100 -84 q-10 -30 6 -36" stroke="#F4ECD8" strokeWidth={7} fill="none" strokeLinecap="round" /><circle cx={132} cy={-48} r={4} fill={OL} />
    {[-70, -30, 30, 70].map((x) => <rect key={x} x={x - 7} y={-6} width={14} height={20} fill="#C99A6A" stroke={OL} strokeWidth={3} />)}
    <Txt y={-36} t="BOEUF GRAS" size={22} c="#5A2A1A" />
  </g>
);

// ------------------------------------------------------------------ 81-107: the French, Mardi Gras, four flags
const emQuiet = hostScene({ items: [
  { at: [0, '160'], kind: 'big', count: 160, text: ' YEARS', sub: 'EUROPE GOES QUIET', x: 1110, y: 360 },
  { at: [1, 'french'], kind: 'art', x: 1110, y: 700, el: () => <Flag kind="fr" w={170} /> },
] });
const LOUISIANA: [number, number][] = [[-94, 29.5], [-89, 29], [-84.5, 30], [-80, 40], [-78, 45], [-88, 49], [-100, 49], [-106, 44], [-104, 36], [-97, 31]];
// zoom: the map starts on Mobile and pulls out to the whole claim
const emFrenchZ: React.FC<SP> = (p) => { const S = mapScene({
  world: { from: [-88.5, 31, 10], to: [-90, 39, 3.2], move: [60, 140] }, rider: { x: 1680, y: 760 },
  extra: (b, pt) => { const q = Pg(b, [4, 'louisiana'], 40); return q > 0 ? <path d={'M' + LOUISIANA.map(pt).map((v) => v.join(' ')).join(' L') + ' Z'} fill="#2E4A9A" fillOpacity={0.25 * q} stroke="#2E4A9A" strokeWidth={4} strokeDasharray="12 8" /> : null; },
  pins: [{ at: [2, 'fort'], ll: [-88.04, 30.9], label: 'FORT LOUIS · 1702', c: '#2E4A9A', star: true, dx: 26, dy: -28 }],
  tags: [{ at: [0], text: '1702', x: 260, y: 260, bg: RED, size: 54 }, { at: [4, 'louisiana'], text: 'LOUISIANA', x: 960, y: 300, bg: '#2E4A9A', size: 40 }, { at: [4, 'dreams'], text: '(IN FRENCH DREAMS)', x: 960, y: 370, size: 28 }],
}); return <S {...p} />; };

const PARTY: Item[] = [
  { at: [2, 'party'], kind: 'gold', text: 'PARTY!', x: 1110, y: 200, size: 46 },
  { at: [3, '1703'], kind: 'big', text: '1703', sub: 'MOBILE', x: 1000, y: 420 },
  { at: [4, 'masks'], kind: 'art', x: 1270, y: 380, el: () => <Mask /> },
  { at: [5, 'society'], kind: 'art', x: 1100, y: 720, el: () => <Ox /> },
  { at: [7, '1718'], kind: 'big', text: '1718', sub: 'NEW ORLEANS', x: 1250, y: 470, c: '#5A4A3A' },
];
const emParty = hostScene({ items: PARTY, move: (b, s) => (
  <Laser f={b.f} X={1600} talking={talk(s)} keys={[{ at: 0, arm: 'present', expr: 'grin' }]}
    targets={[{ x: 1000, y: 470, at: T(b, [3, '1703']) }, { x: 1250, y: 520, at: T(b, [7, '1718']) }]} />
), under: (b) => On(b, [2, 'party']) ? <>{Array.from({ length: 22 }, (_, i) => { const t = (b.g * 1.2 + i * 23) % 140; return <rect key={i} x={940 + ((i * 97) % 520)} y={140 + t * 5} width={14} height={9} fill={['#7B3FA0', '#2E9D57', GOLD][i % 3]} transform={`rotate(${t * 9 + i * 40} ${940 + ((i * 97) % 520)} ${140 + t * 5})`} opacity={0.8} />; })}</> : null });

// four flags, then the sword sweep clears them
const FLAGS: { kind: 'fr' | 'gb' | 'es' | 'us'; at: [number, string]; year: string; x: number; y: number }[] = [
  { kind: 'fr', at: [0, 'coast'], year: '1702', x: 990, y: 300 }, { kind: 'gb', at: [1, 'britain'], year: '1763', x: 1260, y: 300 },
  { kind: 'es', at: [2, 'spain'], year: '1780', x: 990, y: 580 }, { kind: 'us', at: [5, 'mobile'], year: '1813', x: 1260, y: 580 },
];
const EmFlags: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const S = T(b, [7, 'rental']) + 6;           // the swing lands just after "rental"
  const sweepLocal = b.k === 7 ? S : b.k > 7 ? -999 : 99999;
  return (
    <Stage shakes={b.k === 7 ? [{ at: S + 6, amp: 8, len: 6 }] : []}>
      {FLAGS.map((fl, i) => {
        const k = K(b, fl.at); if (k <= 0) return null;
        const p = sweptPos(b.f, sweepLocal, fl.x, fl.y, i);
        if (p.gone) return null;
        return <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.rot}) scale(${k})`}><Flag kind={fl.kind} w={150} /><Txt y={110} t={fl.year} size={30} c={RED} /></g>;
      })}
      <Items b={b} items={[
        { at: [6, '111'], kind: 'big', text: '4 FLAGS', sub: 'IN 111 YEARS', x: 1125, y: 160, hide: [7, 'rental'], size: 36 },
        { at: [8], kind: 'art', x: 1120, y: 470, el: () => <g><rect x={-200} y={-90} width={400} height={180} rx={18} fill={GOLD} stroke={OL} strokeWidth={6} /><Txt y={-12} t="MOBILE:" size={40} /><Txt y={46} t="A RENTAL CAR" size={46} c={RED} /></g> },
      ]} />
      {b.k >= 7 ? <Sweep f={b.f} S={sweepLocal} X={1600} talking={talk(s)} keys={[{ at: 0, arm: 'shrug', expr: 'grin' }]} /> : <HostS s={s} x={1600} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at: T(b, [1, 'britain']), arm: 'point', expr: 'grin' }]} />}
    </Stage>
  );
};
const emInland = hostScene({ items: [{ at: [1, 'inland'], kind: 'dark', text: 'INLAND →', x: 1110, y: 470, size: 52 }], keys: (b) => [{ at: 0, arm: 'chin', expr: 'proud' }, { at: T(b, [1, 'inland']), arm: 'point', expr: 'grin' }] });

// ------------------------------------------------------------------ 108-178: Creek War, statehood, capitals, the street, removal
const CREEK = (i: number, c = '#A8744A') => ({ outfit: { top: c, bottom: '#7A5234', sash: i % 2 ? '#B3261E' : '#2F5E3A' }, hat: i % 2 ? 'hairlong' : 'none', hatColor: '#1A1410', hair: '#1A1410', skin: SKIN.brown });
const stSplit = storyScene({
  sky: 'skyDay', ground: '#9CB874', rider: { x: 1680, y: 260, flip: true, arm: 'point', expr: 'worried' },
  art: (b) => {
    const gap = Pg(b, [0, 'two'], 30) * 160;
    return (<>
      <Hills y={600} fill="#7E9E62" amp={30} seed="cr" />
      {[0, 1, 2].map((i) => <Chibi key={'a' + i} x={500 - gap / 2 + i * 120} y={930} s={0.8} {...CREEK(i, '#C49A6C')} pose={i === 1 ? 'wave' : 'idle'} seed={'ca' + i} />)}
      {[0, 1, 2].map((i) => <Chibi key={'b' + i} x={1160 + gap / 2 + i * 120} y={930} s={0.8} {...CREEK(i + 1, '#8E3B2E')} pose={i === 0 ? 'fist' : 'idle'} expr="angry" seed={'cb' + i} flip />)}
      {gap > 10 && <path d={`M960 640 L940 760 L975 840 L950 960`} stroke={RED} strokeWidth={8} fill="none" strokeLinecap="round" opacity={gap / 160} />}
    </>);
  },
  items: [
    { at: [1, 'alongside'], kind: 'green', text: 'LIVE ALONGSIDE THEM', x: 520, y: 330, size: 32 },
    { at: [2, 'red'], kind: 'red', text: 'RED STICKS: SETTLERS OUT', x: 1300, y: 330, size: 32 },
    { at: [4, 'civil'], kind: 'dark', text: 'A CIVIL WAR', x: 960, y: 190, size: 40 },
    { at: [6, 'united'], kind: 'art', x: 960, y: 540, el: () => <Flag kind="us" w={140} /> },
  ],
});
const stMims = quietScene({ lines: [{ at: [0], text: 'AUGUST 1813', y: 220 }, { at: [1, 'fort'], text: 'FORT MIMS', y: 290, size: 52, c: '#E4DCCB' }, { at: [3, 'hundreds'], text: 'HUNDREDS KILLED', y: 780, size: 36 }],
  art: () => <><Palisade x1={360} x2={1560} y={720} h={200} dark /><rect y={720} width={1920} height={360} fill="#0E1116" /></> });
const stHorseshoe = quietScene({ lines: [{ at: [0], text: 'MARCH 1814', y: 200 }, { at: [2, 'horseshoe'], text: 'HORSESHOE BEND', y: 270, size: 52, c: '#E4DCCB' }, { at: [5, '800'], text: '800+ RED STICK WARRIORS', y: 800, size: 36 }],
  art: () => <path d="M640 900 C 640 380, 1280 380, 1280 900" fill="none" stroke="#3A5670" strokeWidth={70} strokeLinecap="round" /> });
const stTreaty = mapScene({ al: { x: 900, y: 540, h: 820, fill: '#E9D9B0', neighbours: true, nbFill: '#D9CFB4' }, rider: null,
  extra: (b, pt) => { const p = Pg(b, [3, '23'], 50); const C: [number, number][] = [[-88.2, 31.2], [-86.9, 31.0], [-85.6, 31.2], [-85.0, 32.0], [-85.6, 33.6], [-86.6, 33.3], [-87.4, 32.9], [-88.3, 32.6]]; return p > 0 ? <path d={'M' + C.map(pt).map((q) => q.join(' ')).join(' L') + ' Z'} fill="#B3261E" fillOpacity={0.35 * p} stroke="#B3261E" strokeWidth={5} strokeDasharray="14 10" /> : null; },
  tags: [{ at: [0, 'jackson'], text: 'TREATY OF FORT JACKSON, 1814', x: 1480, y: 230, size: 30 }, { at: [1, 'even'], text: 'EVEN HIS ALLIES', x: 1480, y: 310, bg: RED, size: 30 }, { at: [3, '23'], text: '23 MILLION ACRES', x: 1480, y: 420, bg: '#8A2A1E', size: 40 }] });
const stFever = mapScene({ world: { from: [-84, 34, 7.5] }, rider: { x: 1700, y: 300 },
  routes: [{ at: [3, 'georgia'], ll: [[-83.4, 33.4], [-85.6, 32.9], [-86.8, 32.6]] }, { at: [4, 'carolinas'], ll: [[-80.0, 34.6], [-84.0, 34.0], [-86.6, 33.4]] }, { at: [4, 'tennessee'], ll: [[-86.5, 36.0], [-86.7, 34.5]] }],
  tags: [{ at: [0], text: '23 MILLION ACRES', x: 300, y: 230, size: 34 }, { at: [2, 'fever'], text: 'ALABAMA FEVER', x: 300, y: 310, bg: RED, size: 44 }, { at: [5, 'cotton'], text: 'ONE CROP: COTTON', x: 300, y: 390, bg: '#5A3E26', size: 34 }],
  items: [{ at: [6, '1810'], kind: 'big', text: '', count: 10000, sub: '1810', x: 1450, y: 600, size: 44 }, { at: [8, 'ten'], kind: 'big', text: '+', count: 125000, sub: '1820', x: 1450, y: 820, size: 44, c: '#2F5E3A' }] });
const stState = hostScene({ items: [{ at: [0, 'december'], kind: 'big', text: 'DEC 14, 1819', x: 1110, y: 360, size: 48 }, { at: [1, '22nd'], kind: 'gold', text: '★ 22ND STATE ★', x: 1110, y: 620, size: 46 }],
  keys: (b) => [{ at: 0, arm: 'present', expr: 'smile' }, { at: T(b, [1, '22nd']), arm: 'fist', expr: 'grin' }] });
const CAPS: { place: string; ll: [number, number]; at: [number, string] }[] = [
  { place: 'CAHAWBA', ll: [-87.1, 32.32], at: [3, 'cahawba'] }, { place: 'TUSCALOOSA', ll: [-87.57, 33.21], at: [5, 'tuscaloosa'] }, { place: 'MONTGOMERY', ll: [-86.3, 32.37], at: [11, 'montgomery'] },
];
const StCapitals: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const X = 1120, Y = 500, H = 600;
  const cur = CAPS.reduce((a, c, i) => (On(b, c.at) ? i : a), -1);
  const flood = On(b, [4, 'flooding']) && cur === 0;
  return (
    <Stage>
      <g transform={`translate(${X} ${Y}) scale(${b.pop(0, 'capital')}) translate(${-X} ${-Y})`}>
        <rect x={X - 260} y={Y - 330} width={520} height={660} rx={18} fill={PAPER} stroke={OL} strokeWidth={6} />
        <AlMap x={X} y={Y} h={H} neighbours={false} fill="#F3D6A0" />
        {CAPS.map((c, i) => <Pin key={c.place} p={alPt(X, Y, H, c.ll[0], c.ll[1])} t={T(b, c.at)} label={c.place} c={i === cur ? RED : '#8A8272'} star={i === cur} dx={i === 1 ? -24 : 24} dy={i === 2 ? 40 : -24} size={22} />)}
        {flood && [0, 1, 2].map((i) => { const p = alPt(X, Y, H, -87.1, 32.32); return <path key={i} d={`M${p[0] - 60} ${p[1] + 20 + i * 14} q15 -10 30 0 t30 0 t30 0 t30 0`} stroke="#4682B4" strokeWidth={5} fill="none" transform={`translate(${Math.sin(b.g / 6 + i) * 8} 0)`} />; })}
      </g>
      <Items b={b} items={[
        { at: [1, 'while'], kind: 'red', text: 'THIS TOOK A WHILE', x: 1120, y: 880, size: 30, hide: [7, 'five'] },
        { at: [7, 'five'], kind: 'big', text: '5 CAPITALS', sub: 'IN UNDER 30 YEARS', x: 1120, y: 860, size: 36 },
      ]} />
      {b.k === 0 ? <VaultOn t={b.f - 2} to={1620} talking={talk(s)} keys={[{ at: 0, arm: 'present', expr: 'grin' }]} /> : <HostS s={s} x={1620} keys={[{ at: 0, arm: b.k >= 3 && b.k <= 5 ? 'point' : 'present', expr: b.k === 4 ? 'shock' : 'grin' }]} />}
    </Stage>
  );
};
const StStreet: React.FC<SP> = (p) => { const S = streetScene({
  pins: [{ label: 'CAPITOL BUILT', year: '1846', block: 5, side: -1, at: [0, 'capitol'] }],
  items: [{ at: [5, 'five'], kind: 'gold', text: '5 BLOCKS', x: 1060, y: 940, size: 34 }, { at: [6, 'remember'], kind: 'dark', text: 'REMEMBER THIS STREET', x: 1400, y: 940, size: 30 }],
  move: (b, s) => <Laser f={b.f} X={1640} talking={talk(s)} keys={[{ at: 0, arm: 'point', expr: 'grin' }]} targets={[{ x: 1060, y: 300, at: T(b, [0, 'capitol']) }, { x: 1060, y: 745, at: T(b, [4, 'fountain']) }]} />,
}); return <S {...p} />; };
const StRest: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const drop = b.k === 3 ? b.f - T(b, [3, 'experts']) : b.k > 3 ? 999 : -1;
  return (
    <Stage>
      <Pop k={b.pop(1, 'here')} x={1110} y={400}>
        <rect x={-300} y={-110} width={600} height={220} rx={18} fill={PAPER} stroke={OL} strokeWidth={6} />
        <Txt y={-30} t="ALABAMA =" size={44} />
        <Txt y={44} t={'"HERE WE REST"'} size={56} c="#2F5E7A" />
        {!On(b, [3, 'experts']) && [0, 1, 2].map((i) => <Txt key={i} x={250 + i * 30} y={-80 - i * 30 - ((b.g * 0.6) % 20)} t="z" size={30 + i * 8} c="#5A4A3A" o={0.7} />)}
      </Pop>
      <Items b={b} items={[{ at: [2, 'beautiful'], kind: 'sign', text: 'NEWSPAPER, 1840s', x: 1110, y: 180, size: 28 }, { at: [4, 'word'], kind: 'stamp', text: 'NO SUCH WORDS', x: 1110, y: 400, size: 52 }]} />
      <ReactionDrop t={drop} X={1610} talking={talk(s)} after={[{ at: 0, arm: 'shrug', expr: 'grin' }]} />
    </Stage>
  );
};
const WEST: [number, number][][] = [[[-85.8, 32.6], [-87.5, 32.9], [-88.6, 33.6]], [[-85.7, 34.3], [-87.2, 34.7], [-88.6, 35.0]], [[-88.2, 32.0], [-88.6, 32.3]]];
const stRemoval = quietScene({ lines: [{ at: [0], text: 'NOT ALLOWED TO REST', y: 210, c: '#E4DCCB' }, { at: [3, '1830s'], text: '1830s', y: 270 }, { at: [6, 'tens'], text: 'TENS OF THOUSANDS FORCED WEST', y: 770, size: 34 }, { at: [7, 'thousands'], text: 'THOUSANDS DIED ON THE WAY', y: 830, size: 34 }],
  art: (b) => <><AlMap x={960} y={560} h={560} fill="#2E3540" nbFill="#20262E" nbStroke="#3A424C" />{WEST.map((r, i) => <Route key={i} pts={r.map((q) => alPt(960, 560, 560, q[0], q[1]))} p={Pg(b, [6, 'tens'], 60)} c="#8E98A4" w={6} />)}</> });
const stPoarch = quietScene({ lines: [{ at: [0, 'few'], text: 'A FEW FAMILIES STAYED', y: 200, c: '#E4DCCB' }, { at: [1, 'poarch'], text: 'POARCH BAND OF CREEK INDIANS', y: 800, size: 38, c: GOLD }],
  art: (b) => <><AlMap x={960} y={540} h={560} fill="#2E3540" nbFill="#20262E" nbStroke="#3A424C" /><Pin p={alPt(960, 540, 560, -87.49, 31.02)} t={T(b, [1, 'poarch'])} c={GOLD} star /></> });

// ------------------------------------------------------------------ 179-220: cotton, the market, the Clotilda
const BELT: [number, number][] = [[-88.4, 32.9], [-87.4, 32.75], [-86.4, 32.6], [-85.3, 32.5], [-85.2, 31.95], [-86.4, 32.0], [-87.4, 32.1], [-88.4, 32.2]];
const beltPath = (pt: (ll: [number, number]) => [number, number]) => 'M' + BELT.map(pt).map((q) => q.join(' ')).join(' L') + ' Z';
const coBelt = mapScene({ al: { x: 860, y: 540, h: 820, fill: '#E9D9B0' }, rider: { x: 1640, y: 620 },
  extra: (b, pt) => { const p = Pg(b, [3, 'black'], 40); return p > 0 ? <><path d={beltPath(pt)} fill="#2A231C" fillOpacity={0.75 * p} stroke={OL} strokeWidth={4} />{On(b, [5, 'cotton']) && [[-87.9, 32.5], [-87.1, 32.35], [-86.3, 32.3], [-85.6, 32.2], [-86.8, 32.6], [-87.6, 32.3]].map((ll, i) => { const q = pt(ll as [number, number]); return <g key={i} transform={`translate(${q[0]} ${q[1]}) scale(${springPop(b.f, T(b, [5, 'cotton']) + i * 4) * 0.7})`}><Boll /></g>; })}</> : null; },
  tags: [{ at: [3, 'black'], text: 'THE BLACK BELT', x: 1450, y: 260, bg: '#2A231C', size: 42 }, { at: [4, 'color'], text: '(THE COLOUR OF THE SOIL)', x: 1450, y: 330, size: 26 }] });
const coRiver = mapScene({ world: { from: [-87, 32, 9], to: [-40, 40, 1.6], move: [120, 200] }, rider: { x: 1700, y: 720 },
  routes: [{ at: [0, 'steamboats'], ll: [[-86.3, 32.4], [-87.4, 31.6], [-88.04, 30.7]], dur: 50 }, { at: [3, 'england'], ll: [[-88, 30], [-80, 25], [-60, 35], [-20, 48], [-3, 53.4]], dur: 60 }, { at: [4, 'new'], ll: [[-80, 25], [-72, 36], [-71.3, 42.6]], dur: 40 }],
  pins: [{ at: [1, 'mobile'], ll: [-88.04, 30.69], label: 'MOBILE', c: GOLD, star: true }, { at: [3, 'england'], ll: [-2.2, 53.5], label: 'MILLS OF ENGLAND', dx: -30, dy: -30 }, { at: [4, 'new'], ll: [-71.3, 42.6], label: 'NEW ENGLAND', dx: -30, dy: -30 }],
  tags: [{ at: [2, 'cotton'], text: 'ONE OF THE BIGGEST COTTON PORTS', x: 520, y: 230, size: 30 }],
  items: [{ at: [0, 'steamboats'], kind: 'art', x: 420, y: 760, el: (b) => <Steamboat s={0.8} f={b.g} />, hide: [3, 'england'] }] });
const coPick = hostScene({ X: 1640, keys: () => [{ at: 0, arm: 'idle', expr: 'worried' }], items: [
  { at: [1, '1860'], kind: 'big', count: 960000, text: '', sub: 'PEOPLE IN 1860', x: 1110, y: 250, size: 42, c: INK },
  { at: [2, 'enslaved'], kind: 'big', count: 435000, text: '', sub: 'ENSLAVED', x: 1110, y: 520, size: 42 },
  { at: [3, 'half'], kind: 'dark', text: 'ALMOST HALF THE STATE', x: 1110, y: 780, size: 36 },
] });
const coStreet = streetScene({ X: 1640, keys: () => [{ at: 0, arm: 'idle', expr: 'worried' }],
  pins: [{ label: 'CAPITOL', year: '1846', block: 5, side: -1, at: 'past' }, { label: 'SLAVE MARKET', year: '1850s', block: 0, side: -1, at: [2, 'court'], c: '#1A1410' }],
  items: [{ at: [4, 'men'], kind: 'dark', text: 'MEN, WOMEN AND CHILDREN', x: 1060, y: 950, size: 30 }] });
const coBelt2 = mapScene({ al: { x: 860, y: 540, h: 820, fill: '#E9D9B0' }, rider: { x: 1640, y: 620, arm: 'present', expr: 'smile' },
  extra: (b, pt) => <path d={beltPath(pt)} fill="#2A231C" fillOpacity={0.75} stroke={OL} strokeWidth={4} />,
  tags: [{ at: [0], text: 'THE BLACK BELT', x: 1450, y: 260, bg: '#2A231C', size: 42 }, { at: [1, 'second'], text: 'A SECOND MEANING', x: 1450, y: 340, bg: RED, size: 32 }, { at: [3, 'black'], text: 'HOME OF MOST BLACK ALABAMIANS', x: 1450, y: 420, size: 26 }] });
const coClotilda = quietScene({ lines: [
  { at: [0], text: '1808: IMPORTING PEOPLE BANNED', y: 200, size: 30 }, { at: [3, 'summer'], text: 'SUMMER 1860 · THE CLOTILDA', y: 260, size: 40, c: '#E4DCCB' },
  { at: [5, '110'], text: '110 PEOPLE', y: 790, size: 44, c: '#E4DCCB' }, { at: [12, 'last'], text: 'THE LAST KNOWN SLAVE SHIP TO AMERICA', y: 850, size: 32 }],
  art: (b) => { const burn = Pg(b, [10, 'burned'], 80); return <>
    <rect y={700} width={1920} height={380} fill="#121821" />
    {[0, 1, 2].map((i) => <path key={i} d={`M0 ${730 + i * 40} q120 -12 240 0 t240 0 t240 0 t240 0 t240 0 t240 0 t240 0 t240 0`} stroke="#2A3646" strokeWidth={4} fill="none" transform={`translate(${-((b.g * 0.5 + i * 60) % 240)} 0)`} />)}
    <g transform={`translate(${760 + b.g * 0.4} 700)`} opacity={1 - burn}>
      <path d="M-160 -30 L-130 30 Q0 46 130 30 L170 -40 L120 -30 Z" fill="#2E3540" />
      {[-60, 40].map((mx) => <g key={mx}><line x1={mx} y1={-30} x2={mx} y2={-250} stroke="#2E3540" strokeWidth={8} /><path d={`M${mx - 60} -230 Q${mx} -210 ${mx + 60} -230 L${mx + 50} -90 Q${mx} -76 ${mx - 50} -90 Z`} fill="#3A4450" /></g>)}
    </g>
    {burn > 0 && <ellipse cx={1000} cy={690} rx={300} ry={90} fill="url(#warmGlow)" opacity={0.5 * (1 - Math.abs(burn - 0.5) * 2)} />}
  </>; } });

// ------------------------------------------------------------------ 221-270: secession, the street, the war at sea and in the bay, freedom
const waSecede = hostScene({ X: 1640, keys: (b) => [{ at: 0, arm: 'present', expr: 'worried' }], items: [
  { at: [2, 'january'], kind: 'big', text: 'JAN 11, 1861', x: 1110, y: 320, size: 46 },
  { at: [3, 'leave'], kind: 'red', text: 'ALABAMA LEAVES THE UNION', x: 1110, y: 560, size: 34 },
  { at: [0, 'coming'], kind: 'art', x: 1110, y: 790, el: (b) => { const c = Pg(b, [1, 'apart'], 20) * 30; return <g><g transform={`translate(${-c} 0) rotate(${-c / 6})`}><Flag kind="us" w={140} /></g></g>; } },
] });
const waStreet = streetScene({ X: 1640,
  pins: [{ label: 'CAPITOL', year: '1846', block: 5, side: -1, at: 'past' }, { label: 'SLAVE MARKET', year: '1850s', block: 0, side: -1, at: 'past', c: '#1A1410' }, { label: 'DAVIS SWORN IN', year: 'FEB 1861', block: 5, side: 1, at: [8, 'jefferson'], c: '#5A5A6A', dy: 80 }],
  items: [{ at: [3, 'found'], kind: 'dark', text: 'CONFEDERATE STATES OF AMERICA', x: 1060, y: 160, size: 28 }, { at: [5, 'montgomery'], kind: 'red', text: 'CAPITAL: MONTGOMERY', x: 1060, y: 950, size: 30, hide: [10, 'bronze'] }, { at: [10, 'bronze'], kind: 'gold', text: '★ A BRONZE STAR MARKS THE SPOT', x: 1060, y: 950, size: 28 }],
  keys: (b) => [{ at: 0, arm: 'present', expr: 'proud' }, { at: Math.max(0, T(b, [8, 'jefferson'])), arm: 'point', expr: 'worried' }] });
const waTelegram = streetScene({ X: 1640,
  pins: [{ label: 'CAPITOL', year: '1846', block: 5, side: -1, at: 'past' }, { label: 'SLAVE MARKET', year: '1850s', block: 0, side: -1, at: 'past', c: '#1A1410' }, { label: 'DAVIS SWORN IN', year: 'FEB 1861', block: 5, side: 1, at: 'past', c: '#5A5A6A', dy: 80 }, { label: 'SUMTER TELEGRAM', year: 'APR 11, 1861', block: 0, side: 1, at: [3, 'telegram'], dy: -80 }],
  items: [{ at: [3, 'telegram'], kind: 'art', x: 1420, y: 230, rot: 6, el: () => <g transform="scale(0.8)"><Telegram /></g>, hide: [6, 'guns'] }, { at: [7, 'begun'], kind: 'red', text: 'THE CIVIL WAR BEGINS', x: 1420, y: 230, size: 34 }, { at: [9, 'five'], kind: 'dark', text: 'SAME FIVE BLOCKS', x: 1060, y: 950, size: 32 }],
  keys: () => [{ at: 0, arm: 'idle', expr: 'worried' }] });
const waRichmond = mapScene({ world: { from: [-82, 35, 6.2] }, rider: { x: 1700, y: 760 },
  routes: [{ at: [1, 'richmond'], ll: [[-86.3, 32.37], [-81, 35.5], [-77.44, 37.54]], dur: 40 }],
  pins: [{ at: [0], ll: [-86.3, 32.37], label: 'MONTGOMERY', c: '#8A8272', dx: -24, dy: 40 }, { at: [1, 'richmond'], ll: [-77.44, 37.54], label: 'RICHMOND', star: true, dx: 26, dy: -28 }],
  tags: [{ at: [0, 'three'], text: 'CAPITAL FOR ~3 MONTHS', x: 420, y: 230, size: 34 }] });
const waSea = mapScene({ world: { from: [-40, 30, 1.7] }, rider: { x: 1700, y: 800 },
  routes: [{ at: [3, 'csa'], ll: [[-76, 25], [-35, 5], [-10, -25], [20, -36], [60, -20], [100, -5], [80, -30], [10, -38], [-25, 10], [-10, 40], [-1.6, 49.7]], dur: 110 }],
  pins: [{ at: [6, 'france'], ll: [-1.6, 49.7], label: 'SUNK OFF FRANCE, 1864', dx: -30, dy: -30, c: '#1A1410' }],
  tags: [{ at: [3, 'csa'], text: 'CSS ALABAMA', x: 300, y: 240, bg: '#5A5A6A', size: 40 }, { at: [2, 'men'], text: 'ITS MEN WENT TO WAR', x: 300, y: 160, size: 28 }] });
const waBay = mapScene({ world: { from: [-88.05, 30.45, 70] }, rider: { x: 1700, y: 300 },
  extra: (b, pt) => <>{On(b, [2, 'mines']) && Array.from({ length: 9 }, (_, i) => { const q = pt([-88.05 + (i - 4) * 0.012, 30.24 + ((i * 7) % 3) * 0.008]); return <circle key={i} cx={q[0]} cy={q[1]} r={10 * springPop(b.f, T(b, [2, 'mines']) + i * 2)} fill="#1A1410" stroke={RED} strokeWidth={3} />; })}</>,
  routes: [{ at: [1, 'union'], ll: [[-88.0, 30.1], [-88.03, 30.22], [-88.02, 30.35], [-88.0, 30.5]], dur: 60, c: '#2E4A9A' }],
  tags: [{ at: [0], text: 'AUGUST 1864 · MOBILE BAY', x: 480, y: 230, size: 34 }, { at: [3, 'torpedoes'], text: 'MINES = "TORPEDOES"', x: 480, y: 310, bg: RED, size: 30 }, { at: [4, 'damn'], text: '"DAMN THE TORPEDOES!" (THE STORY GOES)', x: 700, y: 820, bg: '#2E4A9A', size: 30 }, { at: [6, 'won'], text: 'UNION WINS THE BAY', x: 480, y: 390, bg: '#2E4A9A', size: 30 }] });
const waRaid = mapScene({ al: { x: 860, y: 540, h: 820, fill: '#E9D9B0' }, rider: { x: 1640, y: 640 },
  routes: [{ at: [0, 'cavalry'], ll: [[-87.7, 34.9], [-87.3, 33.9], [-87.57, 33.21], [-87.02, 32.41], [-86.3, 32.37], [-85.1, 32.46]], dur: 80, c: '#2E4A9A' }],
  pins: [{ at: [2, 'ironworks'], ll: [-87.02, 32.41], label: 'SELMA IRONWORKS', c: '#1A1410', dx: -24, dy: 40 }, { at: [3, 'university'], ll: [-87.57, 33.21], label: 'UNIVERSITY BURNED', c: '#1A1410', dx: -24, dy: -24 }],
  tags: [{ at: [0, '1865'], text: 'SPRING 1865 · UNION CAVALRY', x: 1450, y: 240, bg: '#2E4A9A', size: 32 }] });
const waFree = hostScene({ X: 1620, keys: (b) => [{ at: 0, arm: 'present', expr: 'smile' }, { at: T(b, [1, 'free']), arm: 'wave', expr: 'proud' }], items: [
  { at: [0, 'ends'], kind: 'dark', text: 'THE WAR ENDS · 1865', x: 1110, y: 300, size: 40 },
  { at: [1, 'free'], kind: 'big', count: 435000, text: '', sub: 'PEOPLE FREE', x: 1110, y: 560, size: 50, c: '#2F5E3A' },
] });

export const SHOTS_ERA2: ShotMap = {
  em_quiet: emQuiet, em_french: emFrenchZ, em_party: emParty, em_flags: EmFlags, em_inland: emInland,
  st_split: stSplit, st_mims: stMims, st_horseshoe: stHorseshoe, st_treaty: stTreaty, st_fever: stFever, st_state: stState, st_capitals: StCapitals, st_street: StStreet, st_rest: StRest, st_removal: stRemoval, st_poarch: stPoarch,
  co_belt: coBelt, co_river: coRiver, co_pick: coPick, co_street: coStreet, co_belt2: coBelt2, co_clotilda: coClotilda,
  wa_secede: waSecede, wa_street: waStreet, wa_telegram: waTelegram, wa_richmond: waRichmond, wa_sea: waSea, wa_bay: waBay, wa_raid: waRaid, wa_free: waFree,
};
void Mound; void Tree; void NAVY; void Pg;
