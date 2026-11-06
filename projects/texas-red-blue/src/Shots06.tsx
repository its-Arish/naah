/** Acts 6–7: The Century of Blue; The Crack. */
import React from 'react';
import { CoinArc } from '@engine/fx/Infographics';
import {
  host, map, scene, insert, people, doc, bigCard, result, TagProp, DialProp, both, DropProp, C, CITY, cue,
  RED, BLUE, GOLD, INK, PAPER, OL, Chibi, W, Tag, Label, Switcher, springPop, interpolate, Easing, type ShotMap,
} from './Gen';
import { Derrick, Court, PartyTent, TrapBoard, Ballot } from './Props2';

const SUIT = (c = '#2A2E3A', hair = '#3A2416') => ({ outfit: { top: c, bottom: c, belt: '#F4F7FA' }, hat: 'hair', hair, hatColor: hair });
const VOTER = (i: number) => ({ ...W.MODERN(['#8E5A3A', '#6D7F4E', '#7A6A9A', '#3A5A8A', '#A0522D'][i % 5], i), hat: ['cap', 'hair', 'tophat', 'hair'][i % 4], hatColor: '#3A3A48' });
const Tent = (o: { split?: (s: any, f: number) => number; wings?: (s: any, f: number) => number; shake?: number } = {}) => (s: any, f: number) =>
  <PartyTent x={1150} y={760} s={0.62} split={o.split?.(s, f) ?? 0} wings={o.wings?.(s, f) ?? 0} shake={o.shake ?? 0} />;
const TentI = (o: { split?: number; wings?: (s: any, f: number) => number; shake?: number; tag?: [string, string] } = {}) => insert((s, f) => <>
  <PartyTent x={760} y={700} s={1.05} split={o.split ?? 0} wings={o.wings?.(s, f) ?? 0} shake={o.shake ?? 0} />
  {o.tag && <Tag x={760} y={170} text={o.tag[0]} size={46} bg={GOLD} k={springPop(f, cue(s, o.tag[1]))} />}
</>, { narr: [['present', 'smile']] });

export const SHOTS_06: ShotMap = {
  // ---------------- Act 6
  a6_two: host([['present', 'smile']], (s, f) => <>
    <Tag x={1030} y={560} text="SEPT 1900" size={40} k={springPop(f, cue(s, 'two'))} rot={-4} />
    <Tag x={1260} y={660} text="JAN 1901" size={40} k={springPop(f, cue(s, 'four') )} rot={4} />
  </>),
  a6_storm: scene((s, f) => <>
    <rect x={-200} y={700} width={2400} height={600} fill="#3E5F78" />
    {[...Array(9)].map((_, i) => <path key={i} d={`M${-200 + ((i * 260 + f * 6) % 2400)} ${730 + (i % 3) * 30} q40 -30 80 0`} stroke="#DDE6EE" strokeWidth={5} fill="none" />)}
    {[...Array(60)].map((_, i) => { const x = (i * 97 + f * 14) % 2100 - 100, y = (i * 53 + f * 26) % 900; return <line key={'r' + i} x1={x} y1={y} x2={x - 14} y2={y + 40} stroke="#C9D6E3" strokeWidth={3} opacity={0.6} />; })}
  </>, { sky: 'storm', hills: ['#5D6A5E', '#6E7A62'], ground: '#7A7466', narr: [['idle', 'worried']] }),
  a6_port: map({ cam: [-95, 29.5, 22], pins: [[CITY.Galveston[0], CITY.Galveston[1], 'Galveston', 'Galveston']], narr: [['idle', 'worried']] }),
  a6_dead: bigCard('6,000 – 12,000', 'lives lost', { color: '#E4DCCB', narr: [['idle', 'worried']] }),
  a6_deadliest: bigCard('DEADLIEST', 'natural disaster in U.S. history', { color: '#E4DCCB', narr: [['idle', 'worried']] }),
  a6_spindle: scene((s, f) => <><path d="M300 860 Q860 640 1420 860 Z" fill="#B9A06E" stroke={OL} strokeWidth={5} /><Derrick x={860} y={760} s={1.05} /></>, { narr: [['present', 'smile']], over: (s) => <Label text="Spindletop, near Beaumont · 10 Jan 1901" x={860} y={170} at={cue(s, 'Beaumont')} size={54} color="#fff" /> }),
  a6_gush: scene((s, f) => <><path d="M300 860 Q860 640 1420 860 Z" fill="#B9A06E" stroke={OL} strokeWidth={5} /><Derrick x={860} y={760} s={1.05} gush={Math.max(0, cue(s, 'oil') - 6)} /></>, { narr: [['point', 'shock', 'oil']], shake: 'oil', over: (s) => <Label text="~150 ft" x={1120} y={240} at={cue(s, '150')} size={80} color={GOLD} /> }),
  a6_boom: scene((s, f) => <>
    {[0, 1, 2, 3].map((i) => <Derrick key={i} x={300 + i * 230} y={860} s={0.55} />)}
    <svg x={0} y={0}><CoinArc from={[640, 560]} to={[1320, 700]} start={10} every={5} n={14} c="#2E8B57" sym="$" /></svg>
  </>, { narr: [['present', 'grin']] }),
  a6_houston: map({ cam: [-95.1, 29.6, 20], pins: [[CITY.Galveston[0], CITY.Galveston[1], 4, 'Galveston'], [CITY.Houston[0], CITY.Houston[1], 'Houston', 'Houston', BLUE]], arrows: [[CITY.Galveston[0], CITY.Galveston[1], CITY.Houston[0], CITY.Houston[1], 'replace', GOLD]], narr: [['point', 'grin', 'Houston']] }),
  a6_back: host([['point', 'grin', 'Dial']], DialProp(1)),
  a6_locked: host([['present', 'smile'], ['finger', 'smile', 'keep']], DialProp(1, { lock: 1 })),
  a6_century: host([['chin', 'smile']], both(DialProp(1, { lock: 1 }), TagProp('100 YEARS?', 'century', { y: 720, bg: GOLD }))),
  a6_simple: host([['finger', 'smile', 'simple']], TagProp('PART 1', 'simple', { y: 560 })),
  a6_union: scene((s, f) => <>
    <g transform="translate(1180 760)"><rect x={-90} y={-130} width={180} height={130} fill="#8B5A2B" stroke={OL} strokeWidth={6} /><text y={-50} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#FFE9A0">BALLOT</text></g>
    {[...Array(4)].map((_, i) => <Chibi key={i} x={460 + i * 150} y={860} s={0.85} {...VOTER(i)} pose="idle" legs="stand" expr="calm" seed={'un' + i} />)}
    <Tag x={1180} y={500} text="REPUBLICAN = UNION ARMY" size={34} bg="#F2C4BE" k={springPop(f, cue(s, 'Republican'))} />
  </>, { narr: [['present', 'smile']] }),
  a6_recon: scene((s, f) => <>
    {[...Array(4)].map((_, i) => <Chibi key={i} x={460 + i * 150} y={860} s={0.85} {...VOTER(i)} pose="cross" legs="stand" expr="angry" seed={'un' + i} />)}
    <Tag x={1180} y={500} text="…AND RECONSTRUCTION" size={34} bg="#F2C4BE" k={springPop(f, cue(s, 'Reconstruction'))} />
  </>, { narr: [['present', 'smile']] }),
  a6_done: scene((s, f) => <>
    {[...Array(4)].map((_, i) => <Chibi key={i} x={460 + i * 150} y={860} s={0.85} {...VOTER(i)} pose="cross" legs="stand" expr="angry" seed={'un' + i} />)}
    <Tag x={860} y={420} text="IT JUST WASN'T DONE." size={56} bg={GOLD} rot={-4} k={springPop(f, cue(s, 'done'))} />
  </>, { narr: [['shrug', 'grin', 'done']] }),
  a6_allowed: host([['chin', 'smile']], TagProp('WHO WAS ALLOWED TO VOTE?', 'allowed', { y: 600 })),
  a6_poll: doc('TEXAS POLL TAX · 1902', ['To vote, first pay', 'a yearly tax'], { stamp: ['PAY TO VOTE', 'tax'], narr: [['present', 'worried']] }),
  a6_pay: insert((s, f) => <>
    <g transform="translate(760 560)"><rect x={-160} y={-200} width={320} height={200} fill="#8B5A2B" stroke={OL} strokeWidth={7} /><rect x={-60} y={-210} width={120} height={16} fill={OL} /><text y={-80} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill="#FFE9A0">VOTE</text></g>
    {(() => { const at = cue(s, 'pay'); const y = interpolate(f, [at, at + 14], [140, 340], Easing.in); return f >= at - 10 ? <g transform={`translate(760 ${y})`}><circle r={40} fill={GOLD} stroke={OL} strokeWidth={5} /><text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill={INK}>$</text></g> : null; })()}
  </>, { narr: [['point', 'worried']] }),
  a6_poor: insert((s, f) => <>
    {['POOR VOTERS OF EVERY RACE', 'BLACK TEXANS', 'MEXICAN AMERICAN TEXANS'].map((t, i) => <Tag key={t} x={760} y={260 + i * 150} text={t} size={44} bg={i ? '#E8C9C3' : PAPER} k={springPop(f, cue(s, ['poor', 'Black', 'Mexican'][i], 8 + i * 10))} />)}
  </>, { narr: [['idle', 'worried']] }),
  a6_white: doc('DEMOCRATIC PRIMARY', ['the white primary'], { narr: [['idle', 'worried']] }),
  a6_barred: doc('DEMOCRATIC PRIMARY', ['the white primary', 'Black voters barred'], { narr: [['idle', 'worried']] }),
  a6_nov: insert((s, f) => <>
    <Tag x={500} y={420} text="PRIMARY" size={60} bg={GOLD} k={springPop(f, 8)} />
    <Tag x={1060} y={420} text="NOVEMBER: D wins" size={44} bg="#BFD4EE" k={springPop(f, cue(s, 'November'))} rot={3} />
  </>, { narr: [['present', 'smile']] }),
  a6_only: insert((s, f) => <>
    <g transform={`scale(${1 + 0.05 * springPop(f, cue(s, 'only'))})`} style={{ transformOrigin: '500px 420px' }}><Tag x={500} y={420} text="PRIMARY = THE ELECTION" size={56} bg={GOLD} /></g>
    <g opacity={0.35}><Tag x={1180} y={560} text="NOVEMBER" size={40} bg="#BFD4EE" rot={3} /></g>
  </>, { narr: [['finger', 'smile', 'only']] }),
  a6_smith: people([{ name: 'Dr. Lonnie E. Smith', role: 'dentist, Houston', c: '#3A5A4A', costume: SUIT('#3A3A48'), stamp: ['TOOK IT TO COURT', 'Supreme'] }], [['present', 'proud']]),
  a6_court: scene((s, f) => <Court x={860} y={800} s={1} />, { sky: 'day', narr: [['present', 'smile']], over: (s) => <Label text="U.S. Supreme Court" x={860} y={180} at={cue(s, 'Supreme')} size={62} color="#fff" /> }),
  a6_allwright: doc('SMITH v. ALLWRIGHT · 1944', ['the white primary is', 'unconstitutional'], { stamp: ['STRUCK DOWN', 'struck'], narr: [['present', 'proud']] }),
  a6_eight: bigCard('8 – 1', 'the Supreme Court vote', { c: 'eight', narr: [['finger', 'grin']] }),
  a6_marshall: people([{ name: 'Thurgood Marshall', role: 'lawyer, NAACP', c: '#2E3A5A', costume: { ...SUIT('#2A2E3A'), mustache: true }, cue: 'Thurgood', stamp: ['LATER: SUPREME COURT JUSTICE', 'Marshall'] }], [['present', 'proud']]),
  a6_twist: host([['finger', 'grin', 'twist']], TagProp('THE TWIST', 'twist', { y: 560, bg: GOLD, size: 64, rot: -8 })),
  a6_argued: TentI({}),
  a6_wings: TentI({ wings: (s, f) => springPop(f, cue(s, 'liberal')) }),
  a6_fierce: TentI({ wings: () => 1, shake: 1 }),
  a6_cons: TentI({ wings: () => 1, tag: ['CONSERVATIVE WING USUALLY WINS', 'conservative'] }),
  a6_practice: map({ cam: C.TX, tx: BLUE, tags: [['CONSERVATIVE STATE', -99.6, 32.4, 'conservative', '#7A4E25'], ['…THAT VOTES DEMOCRAT', -99.6, 30.6, 'Democrat', '#24356B']], narr: [['present', 'grin', 'Democrat']] }),
  a6_stage1: host([['point', 'grin', 'trap']], (s, f) => <TrapBoard x={1140} y={680} s={0.36} on={1} at={cue(s, 'trap')} />),
  a6_inside: host([['present', 'smile']], Tent({})),
  a6_splits: host([['shock', 'shock', 'splits']], Tent({ split: (s, f) => interpolate(f, [cue(s, 'splits'), cue(s, 'splits') + 12], [0, 1], Easing.out) }), { shake: 'splits' }),
  a6_mind: host([['chin', 'smile']], Tent({ split: () => 1 })),
  a6_move: host([['point', 'grin', 'move']], DialProp((s, f) => 1 - 0.3 * Math.sin(Math.max(0, f - cue(s, 'move')) / 3) * Math.max(0, 1 - (f - cue(s, 'move')) / 40))),
  a6_two_more: host([['finger', 'grin']], (s, f) => <TrapBoard x={1140} y={680} s={0.36} on={0} done={1} />),

  // ---------------- Act 7
  a7_hero: people([{ name: 'Dwight D. Eisenhower', role: 'Republican · war hero', c: '#4A5A3A', costume: W.GENERAL_1940, stamp: ['TEXAS: 1952 & 1956', 'again'] }], [['present', 'smile']]),
  a7_ike: map({ cam: C.TX, txSweep: [RED, 'Eisenhower'], big: ['PRESIDENT: REPUBLICAN', 'Eisenhower', '#8B2E26'], narr: [['point', 'shock']] }),
  a7_split: insert((s, f) => <Ballot x={760} y={430} title="TEXAS BALLOT · 1950s" rows={[['President: Republican', true], ['Senate: Democrat', true], ['Governor: Democrat', true]]} at={10} />, { narr: [['present', 'grin']] }),
  a7_ticket: insert((s, f) => <Ballot x={760} y={430} title="TEXAS BALLOT · 1950s" rows={[['President: Republican', true], ['Senate: Democrat', true], ['Governor: Democrat', true]]} at={-99} />, { narr: [['shrug', 'grin']] }),
  a7_lbj: people([{ name: 'Lyndon B. Johnson', role: 'Senator → Vice President, 1961', c: '#24356B', costume: SUIT('#2A2E3A', '#5A5A5A') }], [['present', 'smile']]),
  a7_special: scene((s, f) => <>
    <g transform="translate(1100 760)"><rect x={-90} y={-130} width={180} height={130} fill="#8B5A2B" stroke={OL} strokeWidth={6} /><text y={-50} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#FFE9A0">SPECIAL</text></g>
    <Tag x={860} y={360} text="SPECIAL ELECTION · 1961" size={48} k={springPop(f, cue(s, 'special'))} />
  </>, { narr: [['present', 'smile']] }),
  a7_dsplit: host([['shock', 'shock', 'split']], Tent({ split: (s, f) => interpolate(f, [cue(s, 'split'), cue(s, 'split') + 12], [0, 1], Easing.out) }), { shake: 'split' }),
  a7_oilman: people([{ name: 'William Blakley', role: 'Democrat · conservative oilman', c: '#24356B', costume: SUIT('#3A3A48', '#7A7A7A') }], [['present', 'smile']]),
  a7_refused: scene((s, f) => <>{[0, 1, 2].map((i) => <Switcher key={i} x={560 + i * 220} y={860} s={0.9} arms="crossed" rosette={BLUE} coat={['#3A3F4B', '#5A4632', '#3A5A4A'][i]} phase={i * 7} />)}</>, { narr: [['shrug', 'grin']] }),
  a7_home: scene((s, f) => <>
    <g transform="translate(860 860)"><rect x={-220} y={-240} width={440} height={240} fill="#E9D3B0" stroke={OL} strokeWidth={6} /><path d="M-260 -240 L0 -400 L260 -240 Z" fill="#B5651D" stroke={OL} strokeWidth={6} /><rect x={-150} y={-180} width={120} height={100} fill="#BFD4EE" stroke={OL} strokeWidth={4} /></g>
    <g transform="translate(770 680) scale(0.55)"><Switcher x={0} y={0} arms="crossed" rosette={BLUE} /></g>
    <text x={1000} y={560 - (f % 40)} fontFamily="TagBold" fontSize={44} fill={INK} opacity={0.6}>z z</text>
  </>, { narr: [['shrug', 'grin']] }),
  a7_message: scene((s, f) => <>
    <g transform="translate(1150 760)"><rect x={-90} y={-130} width={180} height={130} fill="#8B5A2B" stroke={OL} strokeWidth={6} /><text y={-50} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#FFE9A0">R</text></g>
    <Switcher x={interpolate(f, [0, 30], [600, 960], Easing.out)} y={860} s={0.9} walk={f < 30} rosette={BLUE} />
    <Tag x={1150} y={460} text="“message sent”" size={36} font="Serif" k={springPop(f, cue(s, 'message'))} />
  </>, { narr: [['point', 'grin']] }),
  a7_tower: result([{ name: 'John Tower (R)', v: 50.6, c: RED }, { name: 'William Blakley (D)', v: 49.4, c: BLUE }], 'U.S. SENATE SPECIAL · 1961', { note: 'BY LESS THAN 2 POINTS', narr: [['point', 'shock']] }),
  a7_first: people([{ name: 'John Tower', role: 'Republican · U.S. Senator 1961–85', c: '#7A2E2E', costume: SUIT('#2A2E3A'), stamp: ['FIRST GOP STATEWIDE WIN SINCE RECONSTRUCTION', 'first'] }], [['present', 'shock']]),
  a7_jfk: map({ cam: [-97.5, 31.8, 12], pins: [[CITY.Dallas[0], CITY.Dallas[1], 'Dallas', 'Dallas · 22 Nov 1963', '#5A5A5A']], narr: [['idle', 'worried']] }),
  a7_sworn: people([{ name: 'Lyndon B. Johnson', role: 'President, from 22 Nov 1963', c: '#24356B', costume: SUIT('#2A2E3A', '#5A5A5A'), stamp: ['SWORN IN ON AIR FORCE ONE', 'sworn', '#E4DCCB'] }], [['idle', 'worried']]),
  a7_cra: doc('CIVIL RIGHTS ACT · 1964', ['outlaws segregation'], { stamp: ['LAW', 'Act'], narr: [['present', 'proud']] }),
  a7_vra: doc('VOTING RIGHTS ACT · 1965', ['protects the vote'], { stamp: ['LAW', 'Voting'], narr: [['present', 'proud']] }),
  a7_line: host([['present', 'smile']], TagProp('A FAMOUS LINE…', 'line', { y: 600 })),
  a7_lost: host([['finger', 'worried']], TagProp('“lost the South for a generation”', 'lost', { y: 620, size: 36 })),
  a7_argue: host([['shrug', 'smile', 'argue']], both(TagProp('“lost the South for a generation”', -99, { y: 620, size: 36 }), TagProp('DID HE SAY IT?', 'argue', { y: 740, bg: GOLD }))),
  a7_how: host([['point', 'smile', 'direction']], TagProp('DIRECTION: CLEAR →', 'direction', { y: 640, bg: GOLD })),
  a7_party: map({ cam: C.SOUTH, big: ['NATIONAL DEMOCRATS: PARTY OF CIVIL RIGHTS', 'civil'], narr: [['present', 'smile']] }),
  a7_door: insert((s, f) => {
    const at = cue(s, 'door');
    return <>
      <g transform="translate(1100 700)"><rect x={-110} y={-330} width={220} height={330} fill="#3A2416" stroke={OL} strokeWidth={6} /><g transform={`scale(${1 - 0.8 * interpolate(f, [at - 6, at + 10], [0, 1])} 1)`} style={{ transformOrigin: '-110px 0' }}><rect x={-110} y={-330} width={220} height={330} fill="#8B5A2B" stroke={OL} strokeWidth={6} /><circle cx={70} cy={-160} r={12} fill={GOLD} /></g><text y={-360} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill={GOLD}>EXIT</text></g>
      <Switcher x={interpolate(f, [0, 60], [380, 820], Easing.inOut)} y={700} s={1} walk rosette={BLUE} />
    </>;
  }, { narr: [['point', 'smile']] }),
};
