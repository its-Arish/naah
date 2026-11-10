/** Five blocks, Moon, Today: captions 482-707 (19:15 to the end). */
import React from 'react';
import { interpolate, Easing, springPop } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { OL, Hills, Flame } from '@engine/scenes/Parts';
import { Chibi } from '@engine/characters/Chibi';
import { W } from '@engine/cast/Wardrobe';
import { talk, type ShotMap, type SP } from '@engine/kit';
import { Stage } from '@engine/moves';
import { PAPER, RED, GOLD, INK, Rider, alPt } from './Kit';
import { useBeat, HostS, Txt, Pop, Sky } from './Kit2';
import { Rocket, Moon, ArchBridge, FiveBlocks, Suitcase, Vinyl, Note, AlMap, Pin, ease, type StreetPin } from './KitAL';
import { Laser, Twirl, FishHost, fishCard, Catch, Sweep, sweptPos, VaultExit } from './Moves';
import { hostScene, mapScene, quietScene, streetScene, storyScene, Items, T, K, Pg, On, type B, type SPin } from './Factory';

const cg = (b: B, j: number, w?: string) => (b.k === j ? b.gAt(j, w) : b.k > j ? -999 : 99999);

// the street's pins so far (all shown)
const PAST: SPin[] = [
  { label: 'CAPITOL', year: '1846', block: 5, at: 'past' }, { label: 'DAVIS SWORN IN', year: 'FEB 1861', block: 5, at: 'past', c: '#5A5A6A', dy: 80 },
  { label: 'SLAVE MARKET', year: '1850s', block: 0, at: 'past', c: '#1A1410' }, { label: 'SUMTER TELEGRAM', year: 'APR 11, 1861', block: 0, at: 'past', dy: -80 },
];
const KING: SPin = { label: "DR. KING'S CHURCH", year: '1954', block: 4, at: 'past', c: '#2F5E3A' };
const PARKS: SPin = { label: 'ROSA PARKS BOARDS', year: 'DEC 1, 1955', block: 0, at: 'past', c: GOLD, dy: 80 };
const WALLACE: SPin = { label: '"SEGREGATION FOREVER"', year: 'WALLACE · 1963', block: 5, at: 'past', c: '#8A2A1E', dy: -80 };
const MARCH: SPin = { label: '25,000 MARCHERS', year: 'MARCH 25, 1965', block: 5, at: 'past', c: '#2E4A9A', dy: 160 };

// ------------------------------------------------------------------ props
const Bus: React.FC<{ door?: number }> = ({ door = 0 }) => (
  <g>
    <rect x={-380} y={-230} width={760} height={230} rx={30} fill="#E8B83A" stroke={OL} strokeWidth={6} />
    <rect x={-380} y={-90} width={760} height={24} fill="#2E4A6A" />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-300 + i * 100} y={-200} width={80} height={80} rx={8} fill="#BFE0F0" stroke={OL} strokeWidth={4} />)}
    <rect x={300} y={-200} width={64} height={190} rx={6} fill={door === 1 ? '#3A3A44' : '#9EB8C8'} stroke={OL} strokeWidth={4} />
    <rect x={-370} y={-200} width={60} height={190} rx={6} fill={door === 2 ? '#3A3A44' : '#9EB8C8'} stroke={OL} strokeWidth={4} />
    {[-250, 250].map((x) => <g key={x}><circle cx={x} cy={0} r={46} fill="#2A2A30" stroke={OL} strokeWidth={4} /><circle cx={x} cy={0} r={16} fill="#9AA3A8" /></g>)}
    <Txt x={0} y={-30} t="MONTGOMERY CITY LINES" size={22} c={INK} />
  </g>
);
const Seat: React.FC = () => (
  <g><rect x={-70} y={-40} width={140} height={40} rx={10} fill="#4A6A8A" stroke={OL} strokeWidth={4} /><rect x={-70} y={-150} width={34} height={120} rx={10} fill="#4A6A8A" stroke={OL} strokeWidth={4} /><rect x={-60} y={0} width={10} height={50} fill="#5A5F68" /><rect x={50} y={0} width={10} height={50} fill="#5A5F68" /></g>
);
const Peanut: React.FC = () => (
  <g><path d="M-60 0 Q-70 -40 -30 -44 Q0 -46 6 -20 Q14 -46 44 -44 Q80 -40 66 0 Q80 40 44 44 Q14 46 6 20 Q0 46 -30 44 Q-70 40 -60 0 Z" fill="#D9B27A" stroke={OL} strokeWidth={4} /></g>
);
const Vine: React.FC<{ seed: number }> = ({ seed }) => (
  <g>{[0, 1, 2].map((i) => <path key={i} d={`M${-90 + i * 20} 60 C ${-60 + ((seed * 37 + i * 50) % 80)} -40, ${40 - ((seed * 23 + i * 30) % 70)} 80, ${90 - i * 10} -50`} stroke={['#3E6B2E', '#4E7A3A', '#2F5A24'][i]} strokeWidth={14} fill="none" strokeLinecap="round" />)}
    {[[-40, 10], [20, -20], [60, 30], [-10, 40]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q-20 -24 0 -40 q20 16 0 40`} fill="#5E8A3A" stroke={OL} strokeWidth={2.5} />)}</g>
);

// ------------------------------------------------------------------ 482-516: King, the buses, Colvin, Parks, the boycott
const fbKing = streetScene({ pins: [...PAST, { ...KING, at: [5, 'king'] }],
  items: [{ at: [0, '1954'], kind: 'big', text: '1954', x: 1250, y: 860, size: 40, hide: [4, '25'] }, { at: [4, '25'], kind: 'dark', text: 'AGE 25', x: 1250, y: 900, size: 36 }],
  keys: (b) => [{ at: 0, arm: 'present', expr: 'smile' }, { at: Math.max(0, T(b, [2, 'dexter'])), arm: 'point', expr: 'proud' }] });
const fbBus = storyScene({ sky: 'skyDay', ground: '#9A9A9A', rider: { x: 1680, y: 340, flip: true, arm: 'point', expr: 'worried' }, zoom: [1, 1.04, 900, 640],
  art: (b) => {
    const walk = Pg(b, [2, 'walked'], 40);
    return (<>
      <rect x={-200} y={760} width={2400} height={30} fill="#7A7A7A" />
      <g transform="translate(900 790)"><Bus door={b.k < 2 ? 1 : b.k < 4 ? 2 : 0} /></g>
      {On(b, [1, 'front']) && b.k < 5 && <Chibi x={interpolate(walk, [0, 1], [1340, 470])} y={820} s={0.55} {...W.MODERN('#6A4A8A', 3)} skin="#7A4A2E" legs={walk > 0 && walk < 1 ? 'walk' : 'stand'} flip seed="rider1" />}
      {On(b, [5, 'stand']) && <Chibi x={760} y={760} s={0.55} {...W.MODERN('#6A4A8A', 3)} skin="#7A4A2E" pose="idle" seed="stand1" />}
      {On(b, [7, 'claudette']) && <Chibi x={1040} y={760} s={0.5} {...W.TEEN('#2E6A8A', 1)} skin="#7A4A2E" expr="determined" seed="colvin" />}
    </>);
  },
  items: [{ at: [0, 'rule'], kind: 'dark', text: 'THE BUS RULES', x: 520, y: 200, size: 36 }, { at: [1, 'front'], kind: 'sign', text: '1. PAY AT THE FRONT', x: 520, y: 290, size: 28 }, { at: [3, 'back'], kind: 'sign', text: '2. WALK ROUND TO THE BACK DOOR', x: 520, y: 360, size: 28 }, { at: [5, 'stand'], kind: 'red', text: '3. GIVE UP YOUR SEAT', x: 520, y: 430, size: 28 },
    { at: [6, '1955'], kind: 'big', text: 'MARCH 1955', x: 1250, y: 300, size: 36, hide: [9, 'arrested'] }, { at: [7, 'claudette'], kind: 'gold', text: 'CLAUDETTE COLVIN, 15', x: 1250, y: 420, size: 32 }, { at: [9, 'arrested'], kind: 'red', text: 'ARRESTED', x: 1250, y: 300, size: 40 }] });
const fbParks = streetScene({ pins: [...PAST, KING, { ...PARKS, at: [3, 'court'] }],
  items: [{ at: [0, 'december'], kind: 'big', text: 'DEC 1, 1955', x: 1250, y: 880, size: 36, hide: [5, 'rosa'] }, { at: [5, 'rosa'], kind: 'gold', text: 'ROSA PARKS', x: 1250, y: 900, size: 44 },
    { at: [7, 'no'], kind: 'art', x: 1250, y: 640, el: () => <g><Seat /><g transform="translate(40 -170)"><rect x={-70} y={-40} width={140} height={80} rx={14} fill={RED} stroke={OL} strokeWidth={5} /><Txt y={18} t="NO." size={52} c="#fff" /></g></g> }],
  keys: (b) => [{ at: 0, arm: 'present', expr: 'smile' }, { at: Math.max(0, T(b, [3, 'court'])), arm: 'point', expr: 'proud' }] });
const BOY = [{ w: [8, '381'] as [number, string], x: 1110, y: 520 }, { w: [9, 'supreme'] as [number, string], x: 1110, y: 760 }];
const FbBoycott: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  return (
    <Stage>
      {On(b, [2, 'miles']) && b.k < 8 && Array.from({ length: 7 }, (_, i) => <Chibi key={i} x={940 + ((b.g * 1.2 + i * 90) % 560)} y={900} s={0.42} {...W.MODERN(['#6A4A8A', '#2E6A8A', '#8A3A2E', '#4A6A3A'][i % 4], i)} skin={['#7A4A2E', '#5A3A22', '#8A5A3A'][i % 3]} legs="walk" seed={'w' + i} delay={i * 4} />)}
      <Items b={b} items={[
        { at: [0, 'stopped'], kind: 'dark', text: 'THE BUS BOYCOTT', x: 1110, y: 240, size: 40 },
        { at: [2, 'miles'], kind: 'sign', text: 'WALKING MILES EVERY DAY', x: 1110, y: 360, size: 30, hide: [5, 'planned'] },
        { at: [4, 'carpools'], kind: 'gold', text: 'CARPOOLS', x: 1110, y: 460, size: 34, hide: [5, 'planned'] },
        { at: [5, 'planned'], kind: 'sign', text: 'PLANNED AT DEXTER AVENUE', sub: 'LED BY DR. KING, 26', x: 1110, y: 360, size: 30, hide: [8, '381'] },
        { at: [8, '381'], kind: 'big', count: 381, text: ' DAYS', x: 1110, y: 520, size: 48 },
        { at: [9, 'supreme'], kind: 'green', text: 'SUPREME COURT: SEGREGATED BUSES', sub: 'ARE UNCONSTITUTIONAL', x: 1110, y: 760, size: 28 },
      ]} />
      <Laser f={b.f} X={1620} talking={talk(s)} keys={[{ at: 0, arm: 'present', expr: 'proud' }]} targets={BOY.map((t) => ({ x: t.x + 160, y: t.y, at: T(b, t.w) }))} />
    </Stage>
  );
};

// ------------------------------------------------------------------ 517-539: Wallace, the children, the church (quiet)
const fbWallace = streetScene({ X: 1640, pins: [...PAST, KING, PARKS, { ...WALLACE, at: [4, 'quote'] }],
  items: [{ at: [1, '1963'], kind: 'big', text: '1963', sub: 'GOVERNOR GEORGE WALLACE', x: 1250, y: 880, size: 34, hide: [5, 'doorway'] }, { at: [5, 'doorway'], kind: 'red', text: 'THE SCHOOLHOUSE DOOR', x: 1250, y: 860, size: 30 }, { at: [8, 'stepped'], kind: 'dark', text: 'HE STEPPED ASIDE', x: 1250, y: 940, size: 28 }],
  keys: () => [{ at: 0, arm: 'idle', expr: 'worried' }] });
const fbChildren = storyScene({ sky: 'skyDay', ground: '#8DA862', rider: { x: 1680, y: 340, flip: true, arm: 'idle', expr: 'worried' },
  art: (b) => <><Hills y={640} fill="#7E9E62" amp={20} seed="ch" />{Array.from({ length: 10 }, (_, i) => <Chibi key={i} x={200 + i * 120 + b.g * 0.6} y={790 + (i % 2) * 24} s={0.5} {...W.TEEN(['#C0392B', '#2E6A8A', '#E8B83A', '#4A6A3A'][i % 4], i)} skin={['#7A4A2E', '#5A3A22', '#8A5A3A'][i % 3]} legs="march" item={i % 3 === 0 ? 'placard:FREEDOM' : undefined} seed={'ch' + i} delay={i * 5} />)}</>,
  items: [{ at: [0, 'birmingham'], kind: 'dark', text: 'BIRMINGHAM · MAY 1963', x: 600, y: 200, size: 34 }, { at: [1, 'marched'], kind: 'gold', text: "THE CHILDREN'S MARCH", x: 600, y: 290, size: 34 }, { at: [2, 'dogs'], kind: 'red', text: 'MET WITH DOGS AND FIRE HOSES', x: 600, y: 380, size: 28 }, { at: [4, 'pictures'], kind: 'sign', text: 'THE PICTURES WENT AROUND THE WORLD', x: 600, y: 470, size: 26 }] });
const fbChurch = quietScene({ lines: [{ at: [0], text: 'SEPTEMBER 15, 1963', y: 200 }, { at: [3, '16th'], text: 'SIXTEENTH STREET BAPTIST CHURCH', y: 260, size: 34, c: '#E4DCCB' },
  { at: [5, 'addie'], text: 'ADDIE MAE COLLINS · CAROLE ROBERTSON', y: 770, size: 32, c: '#E4DCCB' }, { at: [5, 'cynthia'], text: 'CYNTHIA WESLEY · DENISE MCNAIR', y: 830, size: 32, c: '#E4DCCB' }],
  art: (b) => <>{[0, 1, 2, 3].map((i) => { const lit = Pg(b, [4, 'four'], 30 + i * 20); return <g key={i} transform={`translate(${600 + i * 240} 600)`}><path d="M-70 0 V-200 Q0 -280 70 -200 V0 Z" fill="#20262E" stroke="#3A424C" strokeWidth={6} /><path d="M-56 -10 V-196 Q0 -262 56 -196 V-10 Z" fill="#E8C65A" opacity={0.55 * lit} /><path d="M0 -250 V-10 M-56 -120 H56" stroke="#3A424C" strokeWidth={5} /></g>; })}</> });

// ------------------------------------------------------------------ 540-577: Selma, the bridge (quiet), the march, the five blocks
const fbSelma = mapScene({ al: { x: 860, y: 600, h: 760, fill: '#E9D9B0' }, rider: { x: 1640, y: 640, arm: 'point', expr: 'smile' },
  routes: [{ at: [7, '54'], ll: [[-87.02, 32.41], [-86.75, 32.29], [-86.5, 32.32], [-86.3, 32.37]], dur: 50, c: '#2E4A9A' }],
  pins: [{ at: [0, 'selma'], place: 'Selma', label: 'SELMA', c: RED, dx: -24, dy: 40 }, { at: [8, 'montgomery'], place: 'Montgomery', label: 'MONTGOMERY', star: true, c: GOLD, dy: -30 }],
  tags: [{ at: [1, 'dallas'], text: 'DALLAS COUNTY: MOSTLY BLACK', x: 1450, y: 230, size: 30 }, { at: [2, 'two'], text: 'REGISTERED: ~2 IN 100', x: 1450, y: 300, bg: RED, size: 36 }, { at: [6, 'arrested'], text: 'TURNED AWAY OR ARRESTED', x: 1450, y: 370, size: 28 }, { at: [7, '54'], text: 'THE PLAN: MARCH 54 MILES', x: 1450, y: 440, bg: '#2E4A9A', size: 30 }] });
const fbBridge = quietScene({ lines: [{ at: [0], text: 'SUNDAY, MARCH 7, 1965', y: 200 }, { at: [2, 'edmund'], text: 'EDMUND PETTUS BRIDGE', y: 260, size: 40, c: '#E4DCCB' }, { at: [9, 'bloody'], text: 'BLOODY SUNDAY', y: 790, size: 48, c: '#E4DCCB' }],
  art: (b) => { const dim = Pg(b, [4, 'charge'], 60); const walk = On(b, [4, 'charge']) ? 0 : b.g * 0.25; return <>
    <rect y={760} width={1920} height={320} fill="#232B34" />
    <g transform="translate(960 760)"><ArchBridge s={1.05} /></g>
    {Array.from({ length: 16 }, (_, i) => <g key={i} transform={`translate(${380 + (i >> 1) * 52 + walk} ${752 - (i % 2) * 6})`}><circle cy={-44} r={9} fill="#6A7480" /><rect x={-8} y={-36} width={16} height={36} rx={5} fill="#6A7480" /></g>)}
    {On(b, [3, 'troopers']) && Array.from({ length: 14 }, (_, i) => <rect key={i} x={1380 + i * 34} y={700} width={24} height={60} rx={6} fill="#0E1116" opacity={Pg(b, [3, 'troopers'], 20)} />)}
    <rect width={1920} height={1080} fill="#000" opacity={0.45 * dim} />
  </>; } });
const fbMarch = mapScene({ world: { from: [-86.66, 32.36, 170] }, rider: { x: 1680, y: 300, arm: 'point', expr: 'proud' },
  routes: [{ at: [0, 'again'], ll: [[-87.02, 32.41], [-86.9, 32.33], [-86.75, 32.29], [-86.6, 32.3], [-86.45, 32.33], [-86.3, 32.37]], dur: 160, c: '#2E4A9A' }],
  pins: [{ at: [0], ll: [-87.02, 32.41], label: 'SELMA', c: RED, dx: -24, dy: 40 }, { at: [3, 'fields'], ll: [-86.3, 32.37], label: 'MONTGOMERY', star: true, c: GOLD, dy: -30 }],
  tags: [{ at: [0, 'again'], text: 'MARCH 21–25, 1965', x: 420, y: 230, size: 34 }, { at: [1, 'federal'], text: 'PROTECTED BY FEDERAL TROOPS', x: 420, y: 300, bg: '#2E4A9A', size: 28 }, { at: [2, 'five'], text: '5 DAYS · 54 MILES', x: 420, y: 370, bg: RED, size: 36 }] });
const STOPS = [{ w: [1, 'fountain'] as [number, string], y: 0 }, { w: [2, 'bus'] as [number, string], y: 0.1 }, { w: [4, 'church'] as [number, string], y: 0.8 }, { w: [4, 'steps'] as [number, string], y: 1 }];
const FbUp: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  let p = 0;
  STOPS.forEach((st) => { if (On(b, st.w)) p = st.y; });
  const pr = interpolate(b.g, [0, b.gd * 0.7], [0, 1], Easing.inOut);
  const top = Math.max(p * 0.92, pr);
  const sx = 1060, sy = 520, sc = 0.74, H = 520;
  const pins: StreetPin[] = [...PAST, KING, PARKS, WALLACE].map((q) => ({ ...q, at: -999 } as StreetPin)).concat([{ ...MARCH, at: T(b, [5, 'confederacy']) } as StreetPin]);
  return (
    <Stage>
      <FiveBlocks x={sx} y={sy} s={sc} pins={pins} />
      {Array.from({ length: 40 }, (_, i) => { const t = Math.max(0, top - (i % 10) * 0.05); const y = sy + (H / 2 + 40 - t * (H + 40)) * sc; return <circle key={i} cx={sx + (((i * 7) % 5) - 2) * 9} cy={y + Math.floor(i / 10) * 10} r={8} fill={['#2E4A9A', '#C0392B', '#2F5E3A', '#E8B83A'][i % 4]} stroke={OL} strokeWidth={1.5} />; })}
      <Items b={b} items={[{ at: [0, '25000'], kind: 'big', count: 25000, text: ' PEOPLE', x: 1250, y: 900, size: 36, hide: [6, 'voting'] }, { at: [6, 'voting'], kind: 'gold', text: 'VOTING RIGHTS ACT · AUG 1965', x: 1250, y: 900, size: 30 }]} />
      <HostS s={s} x={1660} keys={[{ at: 0, arm: 'point', expr: 'proud' }, { at: Math.max(0, T(b, [6, 'voting'])), arm: 'fist', expr: 'grin' }]} />
    </Stage>
  );
};
const fbAnswer = streetScene({ pins: [...PAST, KING, PARKS, WALLACE, MARCH],
  items: [{ at: [1, 'slavery'], kind: 'dark', text: 'SLAVERY AT THE BOTTOM', x: 1250, y: 900, size: 28, hide: [3, 'hundred'] }, { at: [1, 'confederacy'], kind: 'dark', text: 'THE CONFEDERACY AT THE TOP', x: 1250, y: 210, size: 28 },
    { at: [3, 'hundred'], kind: 'sign', text: '100 YEARS LATER', x: 1250, y: 900, size: 32, hide: [5, 'steps'] }, { at: [5, 'steps'], kind: 'gold', text: 'THEY TOOK THE STEPS', x: 1250, y: 900, size: 40 }],
  keys: (b) => [{ at: 0, arm: 'present', expr: 'proud' }, { at: Math.max(0, T(b, [5, 'steps'])), arm: 'fist', expr: 'grin' }] });

// ------------------------------------------------------------------ 578-636: the Moon, the answer, Muscle Shoals, Wallace's apology
const MoLaunch: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const lt = b.k < 2 ? 0 : b.k === 2 ? Math.max(0, b.f - T(b, [2, 'lifts'])) : b.f + 200;
  const launched = b.k >= 2 && b.f >= T(b, [2, 'lifts']);
  const lift = 0.5 * 0.09 * lt ** 2;
  const atMoon = b.k >= 4;
  const mz = b.k === 4 ? interpolate(b.f, [0, 40], [0.4, 1], Easing.out) : b.k > 4 ? 1 : 0.4;
  const rx = b.k === 4 ? interpolate(b.f, [0, 60], [300, 1560], Easing.out) : 1560;
  const pair = b.k >= 6;
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <rect width={1920} height={1080} fill="url(#skyNight)" />
      {Array.from({ length: 50 }, (_, i) => <circle key={i} cx={(i * 197) % 1920} cy={(i * 131) % 1000} r={1.5 + (i % 3)} fill="#fff" opacity={0.5 + 0.4 * Math.sin(b.g / 10 + i)} />)}
      {!atMoon && <><rect y={960} width={1920} height={120} fill="#2A3038" /><g transform={`translate(760 ${960 - lift})`}><Rocket s={0.95} flame={launched ? 1 : 0} /></g><g transform="translate(1500 220)"><Moon r={70} /></g></>}
      {atMoon && <g transform={`translate(1000 ${1200 - 360 * mz}) scale(${mz * 6})`}><Moon r={100} /></g>}
      {atMoon && On(b, [5, 'moon']) && <g transform="translate(1000 560)"><line x1={0} y1={0} x2={0} y2={-120} stroke="#C9C9C9" strokeWidth={5} /><g transform={`translate(0 -120) scale(${springPop(b.f, T(b, [5, 'moon']))})`}><rect width={90} height={56} fill="#fff" stroke={OL} strokeWidth={3} />{[0, 2, 4].map((r) => <rect key={r} y={r * 8} width={90} height={8} fill="#C0392B" />)}<rect width={38} height={30} fill="#2E4A9A" /></g></g>}
      <Items minLeft={0} b={b} items={[{ at: [0, '1969'], kind: 'big', text: 'JULY 16, 1969', x: 420, y: 240, size: 36, hide: [4, 'four'] }, { at: [1, 'saturn'], kind: 'gold', text: 'SATURN V · DESIGNED IN ALABAMA', x: 420, y: 340, size: 26, hide: [4, 'four'] }, { at: [4, 'four'], kind: 'big', text: 'JULY 20, 1969', sub: 'A HUMAN ON THE MOON', x: 420, y: 240, size: 36, hide: [6, 'bloody'] }]} />
      {pair && <><Pop k={K(b, [6, 'bloody'])} x={640} y={420}><rect x={-200} y={-150} width={400} height={300} rx={14} fill="#1B2028" stroke={OL} strokeWidth={5} /><g transform="translate(0 40)"><ArchBridge s={0.36} /></g><Txt y={110} t="1965" size={40} c="#8E98A4" /></Pop><Pop k={K(b, [6, 'bloody'])} x={1180} y={420}><rect x={-200} y={-150} width={400} height={300} rx={14} fill="#26343A" stroke={OL} strokeWidth={5} /><g transform="translate(0 60) scale(0.25)"><Rocket /></g><Txt y={110} t="1969" size={40} c={GOLD} /></Pop><Pop k={K(b, [7, 'same'])} x={910} y={700}><rect x={-180} y={-44} width={360} height={88} rx={12} fill={GOLD} stroke={OL} strokeWidth={5} /><Txt y={16} t="SAME STATE" size={46} /></Pop></>}
      <Rider x={atMoon ? rx : 1250} y={atMoon ? 700 : 520} s={0.42} speed={b.k === 4 ? 0.8 : 0.1} arm="point" expr="grin" talking={talk(s)} />
    </svg>
  );
};
const MoAnswer: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const gate = b.k >= 5 && b.k <= 7;
  return (
    <Stage>
      <Items b={b} items={[
        { at: [0, 'answer'], kind: 'dark', text: 'THE ANSWER', x: 1110, y: 230, size: 40, hide: [5, 'line'] },
        { at: [3, 'rocket'], kind: 'art', x: 1070, y: 480, el: () => <g><rect x={-120} y={-170} width={240} height={320} rx={14} fill="#26343A" stroke={OL} strokeWidth={5} /><g transform="translate(0 110) scale(0.38)"><Rocket /></g></g> },
        { at: [3, 'bridge'], kind: 'art', x: 1320, y: 480, el: () => <g><rect x={-120} y={-170} width={240} height={320} rx={14} fill="#1B2028" stroke={OL} strokeWidth={5} /><g transform="translate(0 40)"><ArchBridge s={0.22} /></g></g> },
        { at: [4, 'same'], kind: 'gold', text: 'THE SAME KIND OF STORY', x: 1135, y: 760, size: 34, hide: [5, 'line'] },
        { at: [5, 'line'], kind: 'red', text: '"A LINE YOU CAN NEVER CROSS"', x: 1135, y: 230, size: 30, hide: [10] },
        { at: [11, 'song'], kind: 'gold', text: '…AND ONE WITH A SONG', x: 1135, y: 230, size: 34 },
        { at: [7, 'road'], kind: 'stamp', text: 'NOT THE END OF THE ROAD', x: 1135, y: 760, size: 36, c: '#2F5E3A', hide: [8, 'engineering'] },
        { at: [8, 'engineering'], kind: 'sign', text: 'ENGINEERING', x: 1070, y: 680, size: 28 },
        { at: [9, 'feet'], kind: 'sign', text: 'THEIR FEET', x: 1320, y: 680, size: 28 },
      ]} />
      <HostS s={s} x={1620} keys={[{ at: 0, arm: gate ? 'idle' : 'present', expr: gate ? 'proud' : 'smile' }]} staffMode={gate ? 'level' : undefined} />
    </Stage>
  );
};
const moSong = mapScene({ al: { x: 860, y: 600, h: 760, fill: '#E9D9B0' }, rider: { x: 1640, y: 640 },
  pins: [{ at: [2, 'muscle'], place: 'Muscle Shoals', label: 'MUSCLE SHOALS', star: true, c: GOLD, dx: 30, dy: 44, size: 32 }],
  tags: [{ at: [0, '14000'], text: 'POP. 14,000', x: 1450, y: 230, size: 34 }],
  extra: (b, pt) => { if (!On(b, [2, 'muscle'])) return null; const p = pt([-87.67, 34.74]); return <>{[0, 1, 2].map((i) => { const t = (b.g + i * 20) % 60; return <g key={i} transform={`translate(${p[0] + 40 + t * 2} ${p[1] - 40 - t * 1.5})`} opacity={1 - t / 60}><Note s={0.6} /></g>; })}</>; } });
const moFame = hostScene({ items: [
  { at: [1, 'fame'], kind: 'dark', text: 'FAME STUDIOS', x: 1110, y: 230, size: 40, hide: [6, 'white'] },
  { at: [1, 'fame'], kind: 'art', x: 1110, y: 520, el: (b) => <Vinyl rot={b.g * 6} label="FAME" s={0.9} />, hide: [12, 'story'] },
  { at: [2, 'mustang'], kind: 'sign', text: 'WILSON PICKETT · "MUSTANG SALLY"', x: 1110, y: 760, size: 26, hide: [3, 'aretha'] },
  { at: [3, 'aretha'], kind: 'gold', text: 'ARETHA FRANKLIN · 1967', x: 1110, y: 760, size: 34, hide: [6, 'white'] },
  { at: [7, 'swampers'], kind: 'big', text: 'THE SWAMPERS', sub: 'LOCAL WHITE SESSION MUSICIANS', x: 1110, y: 230, size: 40, hide: [12, 'story'] },
  { at: [10, 'soul'], kind: 'green', text: 'BLACK AND WHITE, ONE ROOM', x: 1110, y: 760, size: 26, hide: [12, 'story'] },
  { at: [12, 'story'], kind: 'sign', text: 'THE STORY GOES…', x: 1110, y: 230, size: 32, hide: [16, 'december'] },
  { at: [15, 'white'], kind: 'stamp', text: 'FOUR WHITE GUYS FROM ALABAMA', x: 1180, y: 470, size: 24, hide: [16, 'december'] },
  { at: [16, 'december'], kind: 'big', text: 'DECEMBER 1969', sub: 'THE ROLLING STONES', x: 1110, y: 300, size: 40 },
  { at: [18, 'sugar'], kind: 'sign', text: '"BROWN SUGAR" · "WILD HORSES"', x: 1110, y: 520, size: 26 },
  { at: [20, 'idea'], kind: 'red', text: 'THE LOCALS HAD NO IDEA', x: 1110, y: 720, size: 28 },
], move: (b, s) => <Twirl t={b.g - 8} X={1620} talking={talk(s)} keys={[{ at: 0, arm: b.k >= 15 ? 'shrug' : 'present', expr: 'grin' }]} /> });
const moWallace = streetScene({ X: 1640, pins: [...PAST, KING, PARKS, WALLACE, MARCH, { ...KING, label: 'WALLACE ASKS FORGIVENESS', year: '1979', at: [1, '1979'], c: '#7B3FA0', dy: 80 }],
  items: [{ at: [3, 'wheelchair'], kind: 'sign', text: 'NOW IN A WHEELCHAIR', x: 1250, y: 880, size: 26, hide: [6, 'apologized'] }, { at: [6, 'apologized'], kind: 'dark', text: 'HE APOLOGIZED', x: 1250, y: 880, size: 32, hide: [9, 'forgave'] },
    { at: [9, 'forgave'], kind: 'green', text: 'SOME FORGAVE HIM', x: 1250, y: 860, size: 28 }, { at: [10, 'never'], kind: 'dark', text: 'SOME NEVER DID', x: 1250, y: 940, size: 28 }],
  keys: () => [{ at: 0, arm: 'idle', expr: 'smile' }] });

// ------------------------------------------------------------------ 637-707: today and the ending
const tdCars = mapScene({ al: { x: 860, y: 600, h: 760, fill: '#E9D9B0' }, rider: { x: 1640, y: 640 },
  pins: [{ at: [3, 'vance'], ll: [-87.24, 33.17], label: 'MERCEDES · 1997', c: '#5A5A6A', dx: -24, dy: -26 }, { at: [4, 'honda'], ll: [-86.12, 33.61], label: 'HONDA', c: RED }, { at: [4, 'hyundai'], place: 'Montgomery', label: 'HYUNDAI', c: '#2E4A9A', dy: 30 }, { at: [4, 'toyota'], place: 'Huntsville', label: 'TOYOTA · MAZDA', c: '#2F5E3A' }],
  tags: [{ at: [6, 'million'], text: '1,000,000+ CARS A YEAR', x: 1450, y: 230, bg: RED, size: 36 }, { at: [7, 'suv'], text: 'THE SUV OUTSIDE?', x: 1450, y: 310, size: 32 }, { at: [8, 'here'], text: 'MAYBE MADE HERE', x: 1450, y: 380, bg: '#2F5E3A', size: 32 }] });
const BAGS = [{ w: [1, 'lost'] as [number, string], c: '#B0412E' }, { w: [5, 'unclaimed'] as [number, string], c: '#2E6A8A' }, { w: [9, 'laptops'] as [number, string], c: '#6A4A8A' }];
const TdBags: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const casts = BAGS.map((x) => cg(b, x.w[0], x.w[1]));
  const slots = [260, 400, 540];
  const cards = casts.map((c, i) => fishCard(b.g, c, slots[i]));
  return (
    <Stage>
      {cards.map((c, i) => c && <g key={i} transform={`rotate(${c.swing} ${1240 + i * 40} ${c.y - 110})`}><g transform={`translate(${1240 + i * 40} ${c.y})`}><Suitcase s={0.6} c={BAGS[i].c} tag={i === 2 ? 'SKIS?' : '???'} /></g></g>)}
      <Items b={b} items={[{ at: [0, 'scottsboro'], kind: 'dark', text: 'SCOTTSBORO, 1970', x: 1110, y: 640, size: 30 }, { at: [5, 'unclaimed'], kind: 'gold', text: 'UNCLAIMED BAGGAGE', x: 1110, y: 720, size: 28 },
        { at: [6, 'million'], kind: 'big', count: 1000000, text: '', sub: 'VISITORS A YEAR', x: 1110, y: 850, size: 30, hide: [9, 'laptops'] }, { at: [9, 'laptops'], kind: 'sign', text: 'LAPTOPS · DRESSES · SKIS', x: 1110, y: 850, size: 26 }, { at: [11, 'shelf'], kind: 'red', text: 'YOUR BAG?', x: 1110, y: 950, size: 32, rot: -4 }]} />
      <FishHost t={b.g} X={1640} casts={casts} talking={talk(s)} lines={cards.map((c, i) => (c?.line ? { x: 1240 + i * 40, y: c.y - 110 } : null)).filter(Boolean) as { x: number; y: number }[]} />
    </Stage>
  );
};
const tdNow = mapScene({ al: { x: 860, y: 520, h: 720, fill: '#E9D9B0' }, rider: { x: 1640, y: 640 },
  pins: [{ at: [0, 'airbus'], place: 'Mobile', label: 'AIRBUS JETS', c: '#2E4A9A', dx: 26, dy: -44 }, { at: [3, 'biggest'], place: 'Huntsville', label: 'BIGGEST CITY', star: true, c: GOLD, dy: 44 }],
  tags: [{ at: [1, 'mardi'], text: "AMERICA'S OLDEST MARDI GRAS", x: 1450, y: 230, bg: '#7B3FA0', size: 28 }, { at: [2, 'watercress'], text: 'FROM "WATERCRESS CAPITAL"…', x: 1450, y: 310, size: 28 }, { at: [4, '2025'], text: '2025', x: 1450, y: 390, bg: RED, size: 30 }, { at: [5, 'space'], text: 'SPACE COMMAND HQ: HUNTSVILLE', x: 1450, y: 460, bg: '#2E4A9A', size: 26 }] });
const tdAfricatown = mapScene({ world: { from: [-88.05, 30.77, 400] }, rider: { x: 1680, y: 300, arm: 'present', expr: 'smile' },
  pins: [{ at: [1, 'clotilda'], ll: [-88.03, 30.79], label: 'CLOTILDA WRECK · FOUND 2019', c: '#1A1410', dx: 26, dy: -30 }, { at: [6, 'africatown'], ll: [-88.08, 30.76], label: 'AFRICATOWN', star: true, c: GOLD, dx: -30, dy: 40, size: 34 }],
  tags: [{ at: [0, '2019'], text: '2019 · MOBILE RIVER', x: 420, y: 230, size: 34 }, { at: [3, 'descendants'], text: 'THE DESCENDANTS STILL LIVE HERE', x: 420, y: 310, bg: '#2F5E3A', size: 28 }] });
const TdArtemis: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const lt = b.k < 1 ? 0 : b.k === 1 ? Math.max(0, b.f - T(b, [1, 'lifted'])) : b.f + 200;
  const lift = 0.5 * 0.08 * lt ** 2;
  const orbit = b.k >= 4;
  const a = b.g / 18;
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <rect width={1920} height={1080} fill="url(#skyNight)" />
      {Array.from({ length: 50 }, (_, i) => <circle key={i} cx={(i * 197) % 1920} cy={(i * 131) % 1000} r={1.5 + (i % 3)} fill="#fff" opacity={0.5 + 0.4 * Math.sin(b.g / 10 + i)} />)}
      {!orbit && <><rect y={960} width={1920} height={120} fill="#2A3038" /><g transform={`translate(760 ${960 - lift})`}><g transform="scale(0.9)"><rect x={-50} y={-430} width={100} height={430} fill="#E06A3B" stroke={OL} strokeWidth={5} />{[-1, 1].map((d) => <rect key={d} x={d * 70 - 20} y={-360} width={40} height={360} fill="#F4F2EC" stroke={OL} strokeWidth={4} />)}<path d="M-30 -430 L0 -520 L30 -430 Z" fill="#F4F2EC" stroke={OL} strokeWidth={4} /><path d="M-40 0 Q0 180 40 0 Z" fill="#F6A04D" /></g></g></>}
      {orbit && <><g transform="translate(1100 480)"><Moon r={170} /></g><ellipse cx={1100} cy={480} rx={330} ry={150} fill="none" stroke="#7FAFD6" strokeWidth={3} strokeDasharray="10 10" /><g transform={`translate(${1100 + Math.cos(a) * 330} ${480 + Math.sin(a) * 150})`}><path d="M-20 10 L0 -16 L20 10 Z" fill="#F4F2EC" stroke={OL} strokeWidth={3} /></g></>}
      <Items minLeft={0} b={b} items={[{ at: [0, 'april'], kind: 'big', text: 'APRIL 2026', sub: 'ARTEMIS II · 4 ASTRONAUTS', x: 420, y: 240, size: 36 }, { at: [2, 'marshall'], kind: 'gold', text: 'MANAGED IN HUNTSVILLE', x: 420, y: 370, size: 28 },
        { at: [5, 'farther'], kind: 'dark', text: 'FARTHEST HUMANS EVER FROM EARTH', x: 960, y: 790, size: 30, hide: [7, 'alabama'] }, { at: [8, 'again'], kind: 'gold', text: 'AGAIN.', x: 960, y: 780, size: 56 }]} />
      <Rider x={orbit ? 1100 + Math.cos(a + Math.PI) * 420 : 1300} y={orbit ? 480 + Math.sin(a + Math.PI) * 200 : 560} s={0.4} speed={orbit ? 0.8 : 0.1} arm="wave" expr="grin" talking={talk(s)} flip={orbit && Math.sin(a + Math.PI) < 0} />
    </svg>
  );
};
const tdIronBowl = hostScene({ items: [
  { at: [3, 'alabama'], kind: 'art', x: 1060, y: 420, el: () => <g><rect x={-120} y={-80} width={240} height={160} rx={14} fill="#9E1B32" stroke={OL} strokeWidth={5} /><Txt y={14} t="ALABAMA" size={36} c="#fff" /></g> },
  { at: [3, 'auburn'], kind: 'art', x: 1340, y: 420, el: () => <g><rect x={-120} y={-80} width={240} height={160} rx={14} fill="#0C2340" stroke={OL} strokeWidth={5} /><Txt y={14} t="AUBURN" size={36} c="#E87722" /></g> },
  { at: [3, 'against'], kind: 'gold', text: 'VS', x: 1200, y: 420, size: 36 },
  { at: [4, 'iron'], kind: 'big', text: 'THE IRON BOWL', x: 1200, y: 680, size: 44 },
  { at: [6, 'birmingham'], kind: 'sign', text: 'BIRMINGHAM: BUILT ON IRON', x: 1200, y: 230, size: 30 },
], move: (b, s) => <Catch t={b.k === 5 ? b.f - 2 : 99} X={1620} talking={talk(s)} keys={[{ at: 0, arm: b.k >= 5 ? 'present' : 'point', expr: 'grin' }]} /> });
const tdName = hostScene({ items: [
  { at: [1, 'alabama'], kind: 'big', text: 'ALABAMA = ?', x: 1110, y: 260, size: 52, hide: [6, 'common'] },
  { at: [3, 'rest'], kind: 'sign', text: '"HERE WE REST"', x: 1110, y: 480, size: 40, hide: [6, 'common'] },
  { at: [4, 'nobody'], kind: 'stamp', text: 'NEVER FOUND IN THE LANGUAGE', x: 1150, y: 590, size: 26, hide: [6, 'common'] },
  { at: [7, 'choctaw'], kind: 'big', text: 'CHOCTAW', sub: 'ALBA AMO: THICKET-CLEARERS', x: 1110, y: 260, size: 44 },
  { at: [9, 'people'], kind: 'gold', text: 'THE THICKET CLEARERS', x: 1110, y: 470, size: 40 },
], under: (b) => { const g = Pg(b, [8, 'thicket'], 40); return g > 0 ? <>{Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${960 + (i % 3) * 170} ${640 + Math.floor(i / 3) * 150}) scale(${g})`}><Vine seed={i} /></g>)}</> : null; },
  keys: (b) => [{ at: 0, arm: 'chin', expr: 'proud' }, { at: Math.max(0, T(b, [7, 'choctaw'])), arm: 'point', expr: 'grin' }] });
const ICONS = [
  { w: [2, 'fire'] as [number, string], el: <g transform="translate(0 30)"><Flame x={0} y={0} s={1.2} seed="end" /></g> },
  { w: [3, 'peanut'] as [number, string], el: <Peanut /> },
  { w: [4, 'rocket'] as [number, string], el: <g transform="translate(0 70) scale(0.24)"><Rocket /></g> },
  { w: [5, 'bus'] as [number, string], el: <g transform="translate(0 40) scale(0.7)"><Seat /></g> },
  { w: [6, 'bridge'] as [number, string], el: <g transform="translate(0 20)"><ArchBridge s={0.16} /></g> },
];
const TdPath: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const S = b.k === 0 ? T(b, [0, 'path']) : b.k > 0 ? -999 : 99999;
  const exit = b.k === 9 ? b.f - (T(b, [9, 'path']) + 16) : -1;
  return (
    <Stage shakes={b.k === 0 ? [{ at: S + 6, amp: 8, len: 6 }] : []}>
      {Array.from({ length: 6 }, (_, i) => { const x0 = 960 + (i % 3) * 170, y0 = 640 + Math.floor(i / 3) * 150; const p = sweptPos(b.f, S, x0, y0, i); return p.gone ? null : <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.rot})`}><Vine seed={i} /></g>; })}
      {On(b, [0, 'path']) && <path d={`M900 1000 Q1100 760 1460 700`} stroke="#D9C79A" strokeWidth={70 * Pg(b, [0, 'path'], 30)} fill="none" strokeLinecap="round" opacity={0.9} />}
      {ICONS.map((ic, i) => { const k = K(b, ic.w); return k > 0 ? <g key={i} transform={`translate(${960 + i * 115} ${830 - i * 34}) scale(${k * 1.05})`}><circle r={60} fill={PAPER} stroke={OL} strokeWidth={4} /><g transform="scale(0.8)">{ic.el}</g></g> : null; })}
      <Items b={b} items={[
        { at: [7, 'entire'], kind: 'big', text: 'THE ENTIRE HISTORY OF ALABAMA', x: 1110, y: 300, size: 32 },
        { at: [8, 'rest'], kind: 'stamp', text: 'NEVER "HERE WE REST"', x: 1110, y: 460, size: 36 },
        { at: [9, 'path'], kind: 'gold', text: 'ALWAYS… CLEAR THE PATH', x: 1110, y: 590, size: 38 },
      ]} />
      {b.k === 0 ? <Sweep f={b.f} S={S} X={1620} talking={talk(s)} keys={[{ at: 0, arm: 'present', expr: 'grin' }]} />
        : <VaultExit t={exit} X={1620} talking={talk(s)} keys={[{ at: 0, arm: b.k === 7 ? 'present' : b.k >= 8 ? 'fist' : 'point', expr: 'grin' }]} />}
    </Stage>
  );
};

export const SHOTS_ERA4: ShotMap = {
  fb_king: fbKing, fb_bus: fbBus, fb_parks: fbParks, fb_boycott: FbBoycott, fb_wallace: fbWallace, fb_children: fbChildren, fb_church: fbChurch,
  fb_selma: fbSelma, fb_bridge: fbBridge, fb_march: fbMarch, fb_up: FbUp, fb_answer: fbAnswer,
  mo_launch: MoLaunch, mo_answer: MoAnswer, mo_song: moSong, mo_fame: moFame, mo_wallace: moWallace,
  td_cars: tdCars, td_bags: TdBags, td_now: tdNow, td_africatown: tdAfricatown, td_artemis: TdArtemis, td_ironbowl: tdIronBowl, td_name: tdName, td_path: TdPath,
};
void CameraRig; void Layer; void Sky; void AlMap; void Pin; void alPt;
