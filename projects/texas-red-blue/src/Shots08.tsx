/** Acts 8–9: The Flip; Tuesday. */
import React from 'react';
import {
  host, map, scene, insert, people, doc, bigCard, result, quote, timeline, TagProp, DialProp, FlagsProp, both, C, CITY, cue,
  RED, BLUE, GOLD, INK, PAPER, OL, Chibi, W, Tag, Label, Switcher, springPop, interpolate, Easing, type ShotMap,
} from './Gen';
import { Banner } from './Kit';
import { TrapBoard, Board, Ballot } from './Props2';

const SUIT = (c = '#2A2E3A', hair = '#3A2416', extra = {}) => ({ outfit: { top: c, bottom: c, belt: '#F4F7FA' }, hat: 'hair', hair, hatColor: hair, ...extra });
const WOMAN = (c: string, hair = '#E8E4DA') => ({ outfit: { top: c, bottom: c }, hat: 'bun', hair, hatColor: hair });
const dialTo = (from: number, to: number, w: string) => (s: any, f: number) => interpolate(f, [cue(s, w) - 4, cue(s, w) + 16], [from, to], Easing.inOut);

const V1 = ['the national party moved left', 'taxes, guns, abortion, government', 'Texans stayed put', 'oil money & booming suburbs', 'newcomers wanting low taxes'];
const V2 = ['race was at the heart of it', 'sped up after civil rights laws', 'district maps & voting rules', 'locked in Republican power'];
const Views = (n1: number, n2: number, at: string) => insert((s, f) => <>
  <Board x={430} y={430} title="REPUBLICANS & CONSERVATIVES" items={V1} n={n1} at={cue(s, at)} c="#8B2E26" dim={n2 > 0} />
  <Board x={1130} y={430} title="CRITICS & MANY HISTORIANS" items={V2} n={n2} at={cue(s, at)} c="#24356B" dim={n2 === 0} />
</>, { narr: [['present', 'smile']] });
const Trap = (on: number, w?: string) => insert((s, f) => <TrapBoard on={on} at={cue(s, w, 8)} done={on - 1} />, { narr: [['point', 'smile']], point: (s) => [{ x: 780 + (on - 2) * 390 + 120, y: 380, at: cue(s, w, 8) + 2 }] });
const Cracks = (n: number, extra?: string) => timeline([[1961, '1961'], [1978, '1978'], [1994, '1994'], [2026, '2026']], [1955, 2030], [1961, 1978, 2026][n], {
  narr: [['point', 'smile']],
});
const TwoBanners = (crack: number, fall = 0) => (s: any, f: number) => <>
  <Banner x={1110} y={560} s={0.48} color={BLUE} crack={1} />
  <Banner x={1270} y={700} s={0.48} color={RED} crack={crack} fall={fall} />
</>;

export const SHOTS_08: ShotMap = {
  // ---------------- Act 8
  a8_long: host([['chin', 'smile']], TagProp('SLOW…', 'long', { y: 600 })),
  a8_clements: people([{ name: 'Bill Clements', role: 'Republican · Governor 1979–83, 1987–91', c: '#7A2E2E', costume: SUIT('#2A2E3A', '#E8E4DA', { glasses: true }), stamp: ['FIRST GOP GOVERNOR IN 100+ YEARS', 'Republican'] }], [['present', 'shock']]),
  a8_100: people([{ name: 'Bill Clements', role: 'Republican · Governor 1979–83, 1987–91', c: '#7A2E2E', costume: SUIT('#2A2E3A', '#E8E4DA', { glasses: true }), cue: -99, stamp: ['FIRST GOP GOVERNOR IN 100+ YEARS', -99] }], [['present', 'shock']]),
  a8_point: result([{ name: 'Bill Clements (R)', v: 50.0, c: RED }, { name: 'John Hill (D)', v: 49.2, c: BLUE }], 'GOVERNOR · 1978', { note: 'BY LESS THAN 1 POINT', narr: [['point', 'shock', 'point']] }),
  a8_reagan: map({ cam: C.TX, txSweep: [RED, 'Reagan'], big: ['1980: REAGAN CARRIES TEXAS', 'Reagan', '#8B2E26'], narr: [['point', 'smile']] }),
  a8_after: insert((s, f) => <>{[1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020, 2024].map((y, i) => <g key={y} transform={`translate(${250 + (i % 6) * 220} ${300 + Math.floor(i / 6) * 220}) scale(${springPop(f, 6 + i * 3)})`}><rect x={-90} y={-70} width={180} height={140} rx={14} fill={RED} stroke={OL} strokeWidth={5} /><text y={-8} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff">{y}</text><text y={46} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff">R</text></g>)}</>, { narr: [['present', 'smile']] }),
  a8_switch: scene((s, f, dur) => {
    const at = cue(s, 'switching');
    return <>{[0, 1, 2].map((i) => <Switcher key={i} x={interpolate(f, [0, dur], [300, 1000]) + i * 180} y={860} s={0.9} walk rosette={f > at + i * 6 ? RED : BLUE} coat={['#3A3F4B', '#5A4632', '#3A5A4A'][i]} phase={i * 7} />)}</>;
  }, { narr: [['point', 'grin', 'switching']] }),
  a8_gramm: people([{ name: 'Phil Gramm', role: 'Congressman', c: '#5A3A6A', costume: SUIT('#2A2E3A', '#7A7A7A', { glasses: true }), stamp: ['SWITCHED · 1983', 'switched'] }], [['present', 'smile']]),
  a8_perry: people([{ name: 'Rick Perry', role: 'state legislator', c: '#5A3A6A', costume: SUIT('#2A2E3A', '#3A2416'), stamp: ['SWITCHED · 1989', 'switched'] }], [['present', 'smile']]),
  a8_bush: people([
    { name: 'George W. Bush', role: 'Republican', c: '#7A2E2E', costume: SUIT('#2A2E3A', '#7A7A7A'), stamp: ['WON · 1994', 'beat'] },
    { name: 'Ann Richards', role: 'Democratic Governor', c: '#24356B', costume: WOMAN('#4A5A8A', '#F4F4F4') },
  ], [['present', 'smile']]),
  a8_last: bigCard('1994', 'last Democratic statewide wins… for 32 years', { c: 'last', narr: [['finger', 'smile']] }),
  a8_house: map({ cam: C.TX, tx: RED, big: ['2002: TEXAS HOUSE GOES REPUBLICAN', 'House', '#8B2E26'], narr: [['present', 'shock']] }),
  a8_red: host([['point', 'shock', 'red']], DialProp(dialTo(0.2, -1, 'red'), { banner: RED })),
  a8_why: host([['chin', 'smile', 'why']], TagProp('WHY?', 'why', { size: 90, bg: GOLD, y: 560 })),
  a8_ask: host([['shrug', 'grin', 'ask']], both(TagProp('VIEW 1', 'depends', { y: 560, x: 1050, bg: '#F2C4BE' }), TagProp('VIEW 2', 'ask', { y: 700, x: 1250, bg: '#BFD4EE' }))),
  a8_rep: Views(1, 0, 'Republicans'),
  a8_nat: Views(1, 0, -99 as any),
  a8_left: Views(2, 0, 'left'),
  a8_stayed: Views(3, 0, 'stayed'),
  a8_oil: Views(4, 0, 'oil'),
  a8_low: Views(5, 0, 'low'),
  a8_critics: Views(5, 1, 'race'),
  a8_speed: Views(5, 2, 'speed'),
  a8_maps: Views(5, 3, 'maps'),
  a8_lock: Views(5, 4, 'lock'),
  a8_both: host([['present', 'smile'], ['shrug', 'smile', 'both']], (s, f) => <g transform={`translate(1100 640) scale(0.85) rotate(${Math.sin(f / 10) * 3})`}><rect x={-240} y={-10} width={480} height={18} rx={8} fill="#8B6A3E" stroke={OL} strokeWidth={4} /><path d="M-30 180 L0 0 L30 180 Z" fill="#8B6A3E" stroke={OL} strokeWidth={4} /><Tag x={-180} y={-60} text="VIEW 1" size={30} bg="#F2C4BE" /><Tag x={180} y={-60} text="VIEW 2" size={30} bg="#BFD4EE" /></g>),
  a8_night: host([['finger', 'smile']], TagProp('30 YEARS, NOT ONE NIGHT', 'night', { y: 620, bg: GOLD })),

  // ---------------- Act 9
  a9_kept: host([['present', 'grin']], TagProp('“TEXAS IS TURNING BLUE!”', 'blue', { y: 600, bg: '#BFD4EE' })),
  a9_not: host([['shrug', 'grin']], (s, f) => <><Tag x={1150} y={600} text="“TEXAS IS TURNING BLUE!”" size={34} bg="#BFD4EE" /><line x1={940} y1={560} x2={940 + 420 * interpolate(f, [8, 20], [0, 1])} y2={640} stroke={RED} strokeWidth={12} strokeLinecap="round" /></>),
  a9_beto: result([{ name: "Ted Cruz (R)", v: 50.9, c: RED }, { name: "Beto O'Rourke (D)", v: 48.3, c: BLUE }], 'U.S. SENATE · 2018', { note: 'ABOUT 3 POINTS', narr: [['point', 'smile']] }),
  a9_2020: result([{ name: 'Donald Trump (R)', v: 52.1, c: RED }, { name: 'Joe Biden (D)', v: 46.5, c: BLUE }], 'PRESIDENT · 2020 (TEXAS)', { note: 'UNDER 6 POINTS', narr: [['point', 'smile']] }),
  a9_2024: result([{ name: 'Donald Trump (R)', v: 56.1, c: RED }, { name: 'Kamala Harris (D)', v: 42.5, c: BLUE }], 'PRESIDENT · 2024 (TEXAS)', { note: 'ALMOST 14 POINTS', narr: [['point', 'shock', '14']] }),
  a9_starr: map({ cam: [-98.6, 27.6, 14], pins: [[CITY.Starr[0], CITY.Starr[1], 'Starr', 'Starr County · 97% Hispanic', RED]], countries: { MEX: '#CFE0C3' }, narr: [['point', 'shock']] }),
  a9_1892: bigCard('1892', 'the last time Starr County voted Republican for president, before 2024', { c: 6, narr: [['shrug', 'shock']] }),
  a9_hisp: insert((s, f) => <><Tag x={700} y={420} text="HISPANIC VOTERS" size={54} k={springPop(f, 6)} /><g transform={`translate(${interpolate(f, [cue(s, 'right'), cue(s, 'right') + 20], [1000, 1180], Easing.out)} 420)`}><path d="M-80 -20 H40 V-50 L100 0 L40 50 V20 H-80 Z" fill={RED} stroke={OL} strokeWidth={5} /></g><Tag x={760} y={620} text="SHIFTING RIGHT" size={44} bg="#F2C4BE" k={springPop(f, cue(s, 'right'))} /></>, { narr: [['present', 'smile']] }),
  a9_then: host([['point', 'shock', '2026']], DialProp(-1, { crack: 0.6, banner: RED, bcrack: 0.5 }), { shake: '2026' }),
  a9_paxton: people([
    { name: 'Ken Paxton', role: 'Attorney General', c: '#7A2E2E', costume: SUIT('#2A2E3A', '#7A7A7A', { glasses: true }), stamp: ['WON THE PRIMARY', 'beat'] },
    { name: 'John Cornyn', role: 'U.S. Senator, 4 terms', c: '#7A2E2E', costume: SUIT('#2A2E3A', '#E8E4DA', { glasses: true }) },
  ], [['present', 'smile']]),
  a9_cornyn: people([
    { name: 'Ken Paxton', role: 'Attorney General', c: '#7A2E2E', costume: SUIT('#2A2E3A', '#7A7A7A', { glasses: true }), cue: -99, stamp: ['ENDORSED BY TRUMP', 'endorsement'] },
    { name: 'John Cornyn', role: 'U.S. Senator, 4 terms', c: '#7A2E2E', costume: SUIT('#2A2E3A', '#E8E4DA', { glasses: true }), cue: -99 },
  ], [['present', 'smile']]),
  a9_talarico: result([{ name: 'James Talarico (D)', v: 55.1, c: BLUE }, { name: 'Ken Paxton (R)', v: 43.0, c: RED }], 'U.S. SENATE · 3 NOV 2026', { note: 'MORE THAN 10 POINTS', narr: [['point', 'shock']] }),
  a9_hinojosa: result([{ name: 'Gina Hinojosa (D)', v: 52.8, c: BLUE }, { name: 'Greg Abbott (R)', v: 45.7, c: RED }], 'GOVERNOR · 3 NOV 2026', { note: 'ABOUT 7 POINTS', narr: [['point', 'shock']] }),
  a9_latina: people([{ name: 'Gina Hinojosa', role: 'Governor-elect', c: '#24356B', costume: WOMAN('#4A5A8A', '#3A2416'), stamp: ['FIRST LATINA GOVERNOR OF TEXAS', 'Latina'] }], [['present', 'proud']]),
  a9_why: host([['chin', 'smile', 'why']], TagProp('WHY?', 'why', { size: 90, bg: GOLD, y: 560 })),
  a9_national: host([['present', 'smile']], TagProp('THE NATIONAL EXPLANATION', 'national', { y: 560 })),
  a9_midterm: host([['present', 'smile']], both(TagProp('MIDTERM YEAR', 'midterm', { y: 560, x: 1060 }), TagProp('UNPOPULAR PRESIDENT', 'unpopular', { y: 690, x: 1200 }))),
  a9_real: host([['finger', 'smile', 'real']], both(TagProp('MIDTERM YEAR ✓', -99, { y: 560, x: 1060 }), TagProp('UNPOPULAR PRESIDENT ✓', 'real', { y: 690, x: 1200, bg: GOLD }))),
  a9_both: host([['present', 'smile']], both(TagProp('MIDTERM YEAR ✓', -99, { y: 560, x: 1060 }), TagProp('UNPOPULAR PRESIDENT ✓', -99, { y: 690, x: 1200, bg: GOLD }))),
  a9_harder: host([['finger', 'grin', 'harder']], both(TagProp('…BUT WHY TEXAS', 'Texas', { y: 560 }), TagProp('SWUNG HARDER?', 'harder', { y: 690, bg: GOLD }))),
  a9_listen: host([['present', 'smile']], TagProp('TEXAS REPUBLICANS, IN THEIR OWN WORDS', 'Republicans', { y: 600 })),
  a9_young: bigCard('THE MORNING AFTER', 'the head of the Texas Young Republicans said…', { narr: [['chin', 'smile']] }),
  a9_terrible: quote('a terrible candidate', 'head of the Texas Young Republicans', { c: 'terrible' }),
  a9_tired: quote('tired of the Republicans being in office', 'a Republican who lost his statewide race', { c: 'tired' }),
  a9_lazy: quote('lazy arrogance', 'a Texas political scientist', { c: 'lazy' }),
  a9_dems: insert((s, f) => <>{[['EVERYDAY COSTS', 'costs'], ['PUBLIC SCHOOLS', 'schools']].map(([t, w], i) => <Tag key={t} x={460 + i * 520} y={420} text={t} size={46} rot={i ? 3 : -3} k={springPop(f, cue(s, w, 8 + i * 10))} />)}</>, { narr: [['present', 'smile']] }),
  a9_vouchers: insert((s, f) => <>{[['EVERYDAY COSTS'], ['PUBLIC SCHOOLS']].map(([t], i) => <Tag key={t} x={460 + i * 520} y={360} text={t} size={46} rot={i ? 3 : -3} />)}<Tag x={720} y={560} text="SCHOOL VOUCHERS FIGHT" size={46} bg={GOLD} k={springPop(f, cue(s, 'vouchers'))} /></>, { narr: [['present', 'smile']] }),
  a9_decided: scene((s, f, dur) => <>{[0, 1, 2].map((i) => <Switcher key={i} x={interpolate(f, [0, dur], [300, 900]) + i * 180} y={860} s={0.9} walk rosette={RED} coat={['#3A3F4B', '#5A4632', '#3A5A4A'][i]} phase={i * 7} />)}</>, { narr: [['point', 'grin']] }),
  a9_split: insert((s, f) => <Ballot x={760} y={420} title="2026 BALLOT · A REPUBLICAN VOTER" rows={[['Senate: Talarico (D)', true], ['Other races: Republican', true]]} at={cue(s, 'splitting')} />, { narr: [['present', 'grin']] }),
  a9_perm: quote('Paxton gave them permission', 'a Republican pollster', { c: 8, narr: [['finger', 'grin']] }),
  a9_trap: host([['point', 'grin', 'trap']], TagProp('THE ONE-PARTY TRAP', 'trap', { y: 600, bg: GOLD })),
  a9_whole: host([['present', 'grin']], (s, f) => <TrapBoard x={1140} y={680} s={0.36} on={0} />),
  a9_s1: Trap(1, 'one'),
  a9_s1b: Trap(1, 'splits'),
  a9_s2: Trap(2, 'two'),
  a9_s2b: Trap(2, 'stand'),
  a9_s3: Trap(3, 'Switchers'),
  a9_s3b: insert((s, f) => <><TrapBoard on={3} done={2} s={0.8} y={330} /><Switcher x={interpolate(f, [0, 70], [300, 1200], Easing.inOut)} y={800} s={0.8} walk rosette={RED} /></>, { narr: [['present', 'smile']], point: (s) => [{ x: 1090, y: 300, at: 10 }, { x: 900, y: 640, at: cue(s, 'Away', 40) }] }),
  a9_1961: Cracks(0),
  a9_1961b: insert((s, f) => <><Tag x={760} y={300} text="1961 · DEMOCRATS SPLIT" size={50} bg={GOLD} /><Ballot x={760} y={560} s={0.75} title="LIBERAL DEMOCRAT, 1961" rows={[['Blakley (D)?  no thanks']]} /></>, { narr: [['present', 'smile']] }),
  a9_1961c: insert((s, f) => <><Tag x={760} y={300} text="1961 · DEMOCRATS SPLIT" size={50} bg={GOLD} /><Tag x={760} y={520} text="TOWER (R) SLIPS THROUGH" size={50} bg="#F2C4BE" k={springPop(f, cue(s, 'Tower'))} /></>, { narr: [['point', 'grin']] }),
  a9_1978: Cracks(1),
  a9_1978b: insert((s, f) => <><Tag x={760} y={300} text="1978 · PRIMARY KNOCKOUT" size={50} bg={GOLD} /><Tag x={760} y={520} text="CLEMENTS (R) BY < 1 POINT" size={50} bg="#F2C4BE" k={springPop(f, cue(s, 'Clements'))} /></>, { narr: [['point', 'grin']] }),
  a9_2026: Cracks(2),
  a9_2026b: insert((s, f) => <><Tag x={760} y={300} text="2026 · MOST EXPENSIVE SENATE PRIMARY ON RECORD" size={36} bg={GOLD} /></>, { narr: [['present', 'shock']] }),
  a9_2026c: insert((s, f, dur) => <><Tag x={760} y={300} text="2026 · REPUBLICAN SWITCHERS WALK" size={44} bg="#F2C4BE" k={springPop(f, cue(s, 'walked'))} />{[0, 1, 2].map((i) => <Switcher key={i} x={interpolate(f, [0, dur], [300, 900]) + i * 170} y={760} s={0.8} walk rosette={RED} phase={i * 7} />)}</>, { narr: [['point', 'grin']] }),
  a9_same: host([['present', 'grin', 'trap']], TwoBanners(1)),
  a9_nobody: host([['finger', 'smile']], TagProp('THE PART NOBODY TELLS YOU', 'nobody', { y: 600 })),
  a9_33: timeline([[1961, '1961'], [1978, '1978'], [1994, '1994']], [1955, 2000], 1994, { bands: [[1961, 1994, '#C98A84']], narr: [['point', 'shock', '33']] }),
  a9_33b: bigCard('33 YEARS', 'from the first crack to winning everything', { narr: [['finger', 'smile']] }),
  a9_flip: host([['chin', 'smile']], (s, f) => <><Banner x={1120} y={330} s={0.6} color={RED} crack={0.7} /><Tag x={1000} y={620} text="FLIP?" size={50} k={springPop(f, cue(s, 'flip'))} /><Tag x={1260} y={720} text="CRACK?" size={50} bg={GOLD} k={springPop(f, cue(s, 'crack'))} /></>),
  a9_exit: host([['point', 'smile', 'exit']], TagProp('THE TRAP HAS AN EXIT →', 'exit', { y: 620, bg: GOLD })),
  a9_lose: host([['finger', 'grin', 'lose']], (s, f) => <><Banner x={1120} y={380} s={0.6} color={RED} crack={1} /><Tag x={1150} y={680} text="…YOU CAN LOSE" size={46} bg={GOLD} k={springPop(f, cue(s, 'lose'))} /></>),
  a9_six: host([['present', 'smile']], FlagsProp(6, 'Six')),
  a9_ended: host([['present', 'smile']], TwoBanners(1, 0)),
  a9_never: host([['shrug', 'smile']], TwoBanners(1, 1)),
  a9_granted: host([['fist', 'grin', 'granted']], TagProp('NOT TO BE TAKEN FOR GRANTED', 'granted', { y: 600, bg: GOLD })),
  a9_moment: host([['finger', 'smile']], (s, f) => <Banner x={1120} y={380} s={0.6} color={RED} crack={1} fall={interpolate(f, [cue(s, 'starts') - 2, cue(s, 'starts') + 18], [0, 1], Easing.in)} />),
  a9_hey: host([['wave', 'grin']], TagProp('GIVE IT 30 YEARS', '30', { y: 600 })),
  a9_video: host([['point', 'grin', 'Democrat']], (s, f) => <g transform={`translate(1150 520) scale(${springPop(f, 10)}) rotate(-3)`}>
    <rect x={-230} y={-140} width={460} height={260} rx={14} fill="#1E1E28" stroke={OL} strokeWidth={6} />
    <rect x={-210} y={-120} width={420} height={180} fill={BLUE} />
    <text y={-40} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#fff">WHY WAS TEXAS</text>
    <text y={6} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#fff">ALWAYS DEMOCRAT?</text>
    <path d="M-20 70 L20 90 L-20 110 Z" fill="#fff" transform="translate(0 0)" />
  </g>),
};
