/** Acts 2–3: Remember the Alamo; The Country of Texas. */
import React from 'react';
import { Calendar } from '@engine/fx/Infographics';
import { Silhouette } from '@engine/cast/Silhouette';
import { P } from '@engine/qgis/QgisMap';
import {
  host, map, scene, insert, people, doc, bigCard, quote, TagProp, FlagsProp, DialProp, both, DropProp, C, CITY, cue,
  RED, BLUE, GOLD, INK, PAPER, OL, Chibi, W, Tag, Label, springPop, interpolate, Easing, type ShotMap,
} from './Gen';
import { Alamo, Cannon, ComeAndTakeIt, Tent, Stopwatch } from './Props2';
import { FlagArt } from './Kit';

const MEXSOLDIER = { outfit: { top: '#2E4A8A', bottom: '#F4F4EE', sash: '#C0392B' }, hat: 'shako', hatColor: '#1E1E28', item: 'musket' };
const TEXIAN = (c: string, i: number) => ({ outfit: { top: c, bottom: '#6B5A45' }, hat: ['cap', 'hair', 'tophat'][i % 3], hatColor: '#5A4632', hair: '#5A3A22', item: 'musket' });
const SA = [-98.49, 29.42] as const;

// a river drawn on the map in world pixels
const River = (pts: [number, number][], col = '#2E6FA0', w = 4) => <polyline points={pts.map(([lo, la]) => P(lo, la).join(',')).join(' ')} fill="none" stroke={col} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />;
const RIO: [number, number][] = [[-106.5, 31.8], [-104.6, 30.0], [-103.2, 29.0], [-101.4, 29.8], [-100.3, 28.3], [-99.2, 27.0], [-97.2, 25.9]];
const NUECES: [number, number][] = [[-100.3, 29.9], [-99.6, 28.6], [-98.6, 28.2], [-97.6, 27.85], [-97.4, 27.8]];

export const SHOTS_02: ShotMap = {
  // ---------------- Act 2
  a2_cannon: scene((s, f, dur) => {
    const hit = cue(s, 'cannon');
    const bounce = Math.abs(Math.sin(Math.max(0, f - hit) / 4)) * Math.max(0, 1 - (f - hit) / 30) * 40;
    return <>
      <Cannon x={760} y={840 - (f >= hit ? bounce : 0)} s={1.1} />
      {[0, 1, 2].map((i) => <Chibi key={i} x={430 - i * 110} y={850} s={0.9} {...TEXIAN(['#8E5A3A', '#6D7F4E', '#7A6A9A'][i], i)} pose="hold" legs="stand" expr="determined" seed={'tx' + i} />)}
      {[0, 1, 2].map((i) => <Chibi key={'m' + i} x={interpolate(f, [0, dur], [1500, 1180]) + i * 100} y={850} s={0.9} {...MEXSOLDIER} pose="hold" legs="march" expr="determined" seed={'mx' + i} delay={i * 3} flip />)}
    </>;
  }, { narr: [['point', 'smile']], nx: 1780, over: (s) => <Label text="Gonzales, 1835" x={960} y={180} at={8} size={64} color="#fff" /> }),
  a2_flag: scene((s, f) => <>
    <ComeAndTakeIt x={700} y={860} s={1.2} wave={Math.sin(f / 6)} />
    <Chibi x={560} y={860} s={0.95} {...TEXIAN('#8E5A3A', 1)} item="none" pose="fist" legs="stand" expr="grin" seed="flag1" />
    <Cannon x={1080} y={850} s={0.9} />
  </>, { narr: [['present', 'grin', 'Come']] }),
  a2_start: host([['fist', 'grin', 'Revolution']], both(FlagsProp(3), TagProp('TEXAS REVOLUTION', 'Revolution', { y: 420, bg: GOLD }))),
  a2_santa: scene((s, f, dur) => <>
    {[...Array(9)].map((_, i) => <Chibi key={i} x={interpolate(f, [0, dur], [-300, 500]) + (i % 5) * 150 - Math.floor(i / 5) * 70} y={860 - Math.floor(i / 5) * 40} s={0.8} {...MEXSOLDIER} pose="hold" legs="march" expr="determined" seed={'sa' + i} delay={i * 2} />)}
  </>, { sky: 'dawn', narr: [['chin', 'worried']], over: (s, f) => <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><g transform="translate(1250 360)"><SilCard s={s} f={f} /></g></svg> }),
  a2_sanant: map({ cam: [-100, 26.5, 5.2], from: C.MEXUS, arrows: [[-99.1, 19.4, SA[0], SA[1], 8, RED]], pins: [[SA[0], SA[1], 'Antonio', 'San Antonio']], countries: { MEX: '#CFE0C3' }, narr: [['point', 'smile']] }),
  a2_inside: insert((s, f) => <>
    <Alamo x={560} y={640} s={1.0} />
    <Tag x={560} y={230} text="~200 DEFENDERS" size={50} bg={GOLD} k={springPop(f, cue(s, '200'))} />
    <g transform="translate(1180 430)"><DavyCard s={s} f={f} /></g>
  </>, { narr: [['present', 'smile']] }),
  a2_13: insert((s, f) => <>
    <Calendar x={760} y={430} s={1.1} month="MARCH" day={6} year={1836} from={{ month: 'FEB', day: 23 }} flipAt={cue(s, '13') - 6} color="#7A4E25" />
    <Tag x={760} y={760} text="13 DAYS" size={56} bg={GOLD} k={springPop(f, cue(s, '13'))} />
  </>, { narr: [['finger', 'worried']] }),
  a2_fell: scene(() => <Alamo x={900} y={800} s={1.1} dark />, { sky: 'dawn', dim: 0.35, narr: [['idle', 'worried']] }),
  a2_killed: insert(() => <><Alamo x={760} y={640} s={0.9} dark /></>, { narr: [['idle', 'worried']] }),
  a2_mex: insert(() => <><Alamo x={760} y={640} s={0.9} dark /></>, { narr: [['idle', 'worried']] }),
  a2_mistake: host([['idle', 'smile'], ['finger', 'grin', 'mistake']], TagProp('MISTAKE', 'mistake', { bg: '#F2C4BE', size: 70, rot: -6 })),
  a2_cry: host([['fist', 'grin']], both(TagProp('CRY #1: "Remember the Alamo!"', 'cry', { y: 600, x: 1080, size: 30 }), TagProp('CRY #2: ?', 'second', { y: 720, x: 1080, size: 34, bg: GOLD }))),
  a2_split: map({ cam: [-97, 29.9, 15], arrows: [[SA[0], SA[1], -96.2, 30.9, 'split', RED], [SA[0], SA[1], -95.6, 29.7, 'ahead', RED], [SA[0], SA[1], -97.0, 28.7, 'split', RED]], pins: [[SA[0], SA[1], 4, 'San Antonio']], narr: [['point', 'grin']] }),
  a2_declared: doc('TEXAS DECLARATION OF INDEPENDENCE', ['Washington-on-the-Brazos', '2 March 1836'], { stamp: ['INDEPENDENT', 'declared'], narr: [['present', 'proud']] }),
  a2_sanjac: map({ cam: [-95.6, 30.0, 22], arrows: [[-96.2, 30.9, CITY.SanJacinto[0], CITY.SanJacinto[1], 'army', BLUE]], pins: [[CITY.SanJacinto[0], CITY.SanJacinto[1], 'Jacinto', 'San Jacinto · 21 April 1836', RED]], narr: [['point', 'grin', 'caught']] }),
  a2_rest: scene((s, f) => <>
    {[0, 1, 2].map((i) => <Tent key={i} x={420 + i * 300} y={860} s={0.9 + (i % 2) * 0.15} />)}
    {[0, 1].map((i) => <g key={'z' + i} opacity={0.5 + 0.5 * Math.sin(f / 8 + i)}><text x={520 + i * 300} y={620 - ((f + i * 20) % 40)} fontFamily="TagBold" fontSize={48} fill={INK}>z z z</text></g>)}
  </>, { narr: [['chin', 'grin']], over: () => <Label text="afternoon siesta" x={760} y={240} at={20} size={60} color="#fff" /> }),
  a2_remember: scene((s, f, dur) => <>
    {[...Array(6)].map((_, i) => <Chibi key={i} x={interpolate(f, [0, dur], [-200, 700]) + (i % 3) * 130 - Math.floor(i / 3) * 60} y={860 - Math.floor(i / 3) * 30} s={0.85} {...TEXIAN(['#8E5A3A', '#6D7F4E', '#7A6A9A'][i % 3], i)} item={i === 0 ? 'flag' : 'musket'} pose="attack" legs="march" expr="angry" seed={'ch' + i} delay={i * 2} />)}
    {[0, 1].map((i) => <Tent key={i} x={1180 + i * 240} y={860} s={0.85} />)}
  </>, { narr: [['fist', 'grin']], shake: 'Alamo', over: (s) => <Label text="“Remember the Alamo!”" x={820} y={230} at={cue(s, 'Remember') - 2} size={90} color={GOLD} /> }),
  a2_18: scene((s, f) => <Stopwatch x={860} y={480} s={1} p={interpolate(f, [4, 40], [0, 0.3], Easing.out)} label={f > cue(s, '18') ? '18 MINUTES' : undefined} />, { narr: [['finger', 'grin', '18']] }),
  a2_grass: scene((s, f) => <>
    {[...Array(40)].map((_, i) => { const x = 380 + i * 26; const sway = Math.sin(f / 5 + i) * (i > 14 && i < 24 ? 10 : 3); return <path key={i} d={`M${x} 880 Q${x + sway} 760 ${x + sway * 2} ${640 + (i % 4) * 20}`} stroke="#6E8B3D" strokeWidth={8} fill="none" />; })}
    <g opacity={springPop(f, cue(s, 'grass'))}><circle cx={880} cy={700} r={8} fill={OL} /><circle cx={905} cy={700} r={8} fill={OL} /></g>
  </>, { narr: [['point', 'grin', 'grass']], over: () => <Label text="captured, 22 April 1836" x={860} y={240} at={20} size={56} color="#fff" /> }),
  a2_signed: scene((s, f) => <>
    <rect x={560} y={740} width={600} height={30} fill="#8B5A2B" stroke={OL} strokeWidth={5} />
    <rect x={600} y={770} width={20} height={90} fill="#6B4A2B" /><rect x={1100} y={770} width={20} height={90} fill="#6B4A2B" />
    <g transform={`translate(860 720) scale(${springPop(f, 6)})`}><rect x={-140} y={-40} width={280} height={60} rx={6} fill="#F1E3C2" stroke={OL} strokeWidth={4} /><path d={`M-90 -6 q20 -20 40 0 t40 0 t40 0`} stroke={OL} strokeWidth={4} fill="none" pathLength={1} strokeDasharray={`${interpolate(f, [20, 50], [0, 1])} 1`} /></g>
  </>, { narr: [['present', 'smile']], over: (s) => <Label text="Treaties of Velasco, May 1836" x={860} y={240} at={cue(s, 'signed')} size={58} color="#fff" /> }),

  // ---------------- Act 3
  a3_four: host([['finger', 'grin', 'four']], FlagsProp(4, 'four')),
  a3_country: scene((s, f) => <>
    <line x1={860} y1={860} x2={860} y2={300} stroke={OL} strokeWidth={10} />
    <g transform="translate(866 310)"><FlagArt kind="texas" w={360} wave={Math.sin(f / 6)} /></g>
  </>, { narr: [['present', 'proud']], over: (s) => <Label text="Republic of Texas, 1836–1845" x={860} y={200} at={cue(s, 'Republic')} size={64} color="#fff" /> }),
  a3_own: insert((s, f) => <>
    {[['PRESIDENT', 'president'], ['ARMY', 'army'], ['MONEY', 'money'], ['…not much else', 'else']].map(([t, w], i) => <Tag key={t} x={340 + i * 330} y={420} text={t} size={40} bg={i === 3 ? GOLD : PAPER} rot={i % 2 ? 3 : -3} k={springPop(f, cue(s, w, 8 + i * 10))} />)}
  </>, { narr: [['present', 'smile'], ['shrug', 'grin', 'else']] }),
  a3_broke: host([['shrug', 'worried', 'broke']], both(TagProp('BROKE', 'broke', { size: 80, bg: '#F2C4BE', rot: -8, y: 380 }), DropProp(<g><rect x={-80} y={-60} width={160} height={110} rx={30} fill="#C9A66B" stroke={OL} strokeWidth={5} /><text y={10} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill={INK}>$0</text></g>, 'broke', 1110, 640, 500))),
  a3_war: insert((s, f) => <>
    {[['COMANCHE WAR', 'Comanche'], ['HOSTILE MEXICO', 'Mexico'], ['UNPAID DEBTS', 'debts']].map(([t, w], i) => <Tag key={t} x={420 + i * 380} y={420} text={t} size={42} bg={i === 2 ? GOLD : PAPER} rot={i % 2 ? 3 : -3} k={springPop(f, cue(s, w, 8 + i * 12))} />)}
  </>, { narr: [['chin', 'worried']] }),
  a3_slavery: doc('CONSTITUTION OF THE REPUBLIC OF TEXAS, 1836', ['Slavery protected'], { narr: [['idle', 'worried']] }),
  a3_free: doc('CONSTITUTION OF THE REPUBLIC OF TEXAS, 1836', ['Free Black people could not', 'live in Texas without', "Congress's permission"], { narr: [['idle', 'worried']] }),
  a3_join: host([['present', 'smile'], ['chin', 'worried', 'problem']], TagProp('JOIN THE U.S.A.?', 'join', { size: 54, y: 440 })),
  a3_slave: map({ cam: C.US, from: [-99.6, 31, 8], states: { Texas: '#B98A5A' }, big: ['+1 GIANT SLAVE STATE', 'slave'], narr: [['point', 'worried']] }),
  a3_brawl: map({ cam: [-87, 35, 5], pins: [[CITY.DC[0], CITY.DC[1], 'Washington', 'Washington']], arrows: [[-99.4, 31.2, CITY.DC[0], CITY.DC[1], 6, GOLD]], big: ['A 9-YEAR BRAWL', 'brawl', '#8B2E26'], narr: [['shrug', 'grin', 'brawl']] }),
  a3_28: map({ cam: C.US, txSweep: [GOLD, '28th'], big: ['28TH STATE · 29 DEC 1845', '28th'], narr: [['present', 'proud', '28th']] }),
  a3_six: host([['finger', 'smile'], ['point', 'grin', 'five']], both(FlagsProp(4), TagProp('5 FIRST…', 'five', { y: 420, bg: GOLD }))),
  a3_war2: map({ cam: C.MEXUS, countries: { MEX: '#CFE0C3' }, big: ['WAR', 'war', '#8B2E26'], narr: [['shrug', 'worried']] }),
  a3_rio: map({ cam: [-100.5, 28.6, 14], world: (s, f) => River(RIO, '#2E6FA0', 6), tags: [['RIO GRANDE', -101.6, 28.2, 'Rio', '#2E6FA0']], narr: [['point', 'smile']], countries: { MEX: '#CFE0C3' } }),
  a3_nueces: map({ cam: [-100.5, 28.6, 14], world: () => <>{River(RIO, '#2E6FA0', 6)}{River(NUECES, '#2E6FA0', 6)}</>, tags: [['RIO GRANDE', -101.6, 28.2, -99, '#2E6FA0'], ['NUECES', -99.2, 28.9, 'Nueces', '#2E6FA0'], ['DISPUTED', -99.3, 27.6, 'north', '#8B2E26']], narr: [['point', 'smile']], countries: { MEX: '#CFE0C3' } }),
  a3_troops: map({ cam: [-99.5, 28.4, 12], world: () => <>{River(RIO, '#2E6FA0', 6)}{River(NUECES, '#2E6FA0', 6)}</>, arrows: [[-97.8, 30.8, -98.2, 27.2, 'troops', BLUE], [-96.4, 30.2, -97.4, 26.4, 'gap', BLUE]], tags: [['DISPUTED', -99.3, 27.6, -99, '#8B2E26']], narr: [['point', 'worried']], countries: { MEX: '#CFE0C3' } }),
  a3_mexwar: map({ cam: [-106, 32, 4], countries: { MEX: '#CFE0C3' }, big: ['MEXICAN-AMERICAN WAR · 1846–48', 'War'], narr: [['present', 'smile']] }),
  a3_calif: map({ cam: [-108, 34, 4], countries: { MEX: '#CFE0C3' }, states: { California: GOLD, Nevada: GOLD, Utah: GOLD, Arizona: GOLD, 'New Mexico': GOLD, Texas: GOLD }, big: ['MEXICO LOST ABOUT HALF ITS TERRITORY', 'California'], narr: [['present', 'shock']] }),
  a3_starts: host([['present', 'smile'], ['finger', 'grin', 'starts']], DialProp(0)),
  a3_dems: host([['point', 'smile', 'Democrats']], both(DialProp(1), TagProp('DEMOCRATS', 'Democrats', { y: 700, bg: '#BFD4EE' }))),
  a3_party: host([['present', 'smile']], TagProp('THE DEMOCRATS, 1840s', 'Democratic', { y: 360 })),
  a3_south: host([['present', 'smile']], (s, f) => <>
    <Tag x={1160} y={380} text="THE DEMOCRATS, 1840s" size={32} />
    {[['the South', 'South'], ['expansion', 'expansion'], ['defended slavery', 'slavery']].map(([t, w], i) => <Tag key={t} x={1160} y={480 + i * 100} text={t} size={32} bg={i === 2 ? '#E8C9C3' : PAPER} rot={i % 2 ? 2 : -2} k={springPop(f, cue(s, w, 8 + i * 10))} />)}
  </>),
  a3_born: host([['finger', 'smile']], DropProp(<g><ellipse cx={-70} cy={-60} rx={55} ry={70} fill="#F4ECD8" stroke={OL} strokeWidth={5} /><ellipse cx={70} cy={-60} rx={55} ry={70} fill="#F4ECD8" stroke={OL} strokeWidth={5} /><path d="M-90 -80 l15 15 l10 -20 l12 18" stroke={OL} strokeWidth={4} fill="none" /></g>, 'born', 1110, 620, 500)),
  a3_century: host([['fist', 'grin', 'century']], both(DialProp(1, { lock: 0 }), TagProp('…FOR A CENTURY', 'century', { y: 720, bg: GOLD }))),
};

const SilCard: React.FC<{ s: any; f: number }> = ({ s, f }) => {
  return <Silhouette x={0} y={0} name="Antonio López de Santa Anna" role="President of Mexico" c="#2E5E3A" k={springPop(f, cue(s, 'Santa', 10))} s={0.9} costume={{ outfit: { top: '#2E4A8A', bottom: '#F4F4EE', trim: GOLD, sash: '#C0392B' }, hat: 'bicorne', hatColor: '#1E1E28' }} />;
};
const DavyCard: React.FC<{ s: any; f: number }> = ({ s, f }) => {
  return <Silhouette x={0} y={0} name="Davy Crockett" role="frontier celebrity" c="#6B4A2B" k={springPop(f, cue(s, 'Crockett', 20))} s={0.9} costume={{ outfit: { top: '#8B6A3E', bottom: '#5A4632' }, hat: 'cap', hatColor: '#6B4A2B' }} />;
};
