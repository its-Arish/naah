/** Acts 4–5: Flag Number Five; The Party of Lincoln. */
import React from 'react';
import { Calendar } from '@engine/fx/Infographics';
import {
  host, map, scene, insert, people, doc, bigCard, result, timeline, TagProp, FlagsProp, DialProp, both, C, CITY, cue,
  RED, BLUE, GOLD, INK, PAPER, OL, Chibi, W, Tag, Label, springPop, interpolate, Easing, type ShotMap,
} from './Gen';
import { Capitol, Ballot } from './Props2';

const UNION = { outfit: { top: '#24356B', bottom: '#4A5A8A', belt: '#C9A227' }, hat: 'kepi', hatColor: '#24356B', hair: '#5A3A22' };
const CROWD = (i: number) => ({ ...W.PEASANT(['#C0392B', '#2E86C1', '#E8862A', '#7A5C9E', '#3A7A4A', '#B8860B'][i % 6], i), skin: ['#8D5524', '#6B3E1E', '#A0663A', '#5A3418'][i % 4] });
const LINCOLN = { ...W.LEADER, hat: 'tophat', hatColor: '#1E1E28', beard: true };
const SUIT19 = (c = '#2A2E3A') => ({ outfit: { top: c, bottom: c, belt: '#F4F7FA' }, hat: 'hair', hair: '#3A2416', mustache: true });

const dialTo = (from: number, to: number, w: string) => (s: any, f: number) => interpolate(f, [cue(s, w) - 4, cue(s, w) + 16], [from, to], Easing.inOut);

export const SHOTS_04: ShotMap = {
  // ---------------- Act 4
  a4_gop: map({ cam: [-88, 41, 6], pins: [[-88.84, 43.84, 'Republican', 'Ripon, Wisconsin · 1854']], big: ['A NEW PARTY: THE REPUBLICANS', 'Republican', '#8B2E26'], narr: [['point', 'smile']] }),
  a4_cause: map({ cam: [-98, 39, 3.8], tags: [['NO SLAVERY IN NEW TERRITORY', -104, 41, 'stopping', '#8B2E26']], arrows: [[-88, 34, -100, 40, 6, '#7A6A5A']], extra: (s, f, cam) => null, narr: [['present', 'smile']] }),
  a4_lincoln: people([{ name: 'Abraham Lincoln', role: 'Republican · President 1861–65', c: '#7A2E2E', costume: LINCOLN, stamp: ['WON 1860', 'presidency'] }], [['present', 'smile']]),
  a4_ballot: insert((s, f) => <Ballot x={760} y={420} s={1} title="TEXAS · NOVEMBER 1860" rows={[['Breckinridge'], ['Bell'], ['Lincoln? not listed']]} />, { narr: [['shrug', 'grin', 'ballot']] }),
  a4_180k: bigCard('~180,000', 'enslaved people in Texas, 1860', { color: '#E4DCCB', narr: [['idle', 'worried']] }),
  a4_third: bigCard('ALMOST 1 IN 3', 'of everyone in the state', { color: '#E4DCCB', narr: [['idle', 'worried']] }),
  a4_conv: host([['present', 'smile']], TagProp('SECESSION CONVENTION', 'convention', { y: 560 }), { }),
  a4_three: result([{ name: 'For secession', v: 76, c: '#8A8A8A' }, { name: 'Against', v: 24, c: '#4A6A8A' }], 'TEXAS REFERENDUM · FEBRUARY 1861', { note: 'ABOUT 3 TO 1', narr: [['point', 'worried']] }),
  a4_why: doc('A DECLARATION OF THE CAUSES · TEXAS, 1861', ['Why we are leaving the Union:', '…'], { narr: [['chin', 'worried']] }),
  a4_protect: doc('A DECLARATION OF THE CAUSES · TEXAS, 1861', ['Why we are leaving the Union:', 'to protect slavery'], { narr: [['idle', 'worried']] }),
  a4_houston: people([{ name: 'Sam Houston', role: 'Governor of Texas', c: '#3A5A7A', costume: SUIT19('#3A3A48'), stamp: ['REFUSED THE OATH', 'refused'] }], [['present', 'smile'], ['point', 'proud', 'refused']]),
  a4_removed: people([{ name: 'Sam Houston', role: 'Governor of Texas', c: '#3A5A7A', costume: SUIT19('#3A3A48'), cue: -99, stamp: ['REMOVED', 'removed', '#E8C9C3'] }], [['shrug', 'worried']]),
  a4_flag5: host([['idle', 'worried']], FlagsProp(5, 'Confederacy')),
  a4_ended: insert((s, f) => <><Calendar x={760} y={430} s={1.1} month="APRIL" day={9} year={1865} color="#5A5A5A" /><Tag x={760} y={760} text="THE WAR ENDS" size={48} k={springPop(f, cue(s, 'ended'))} /></>, { narr: [['present', 'smile']] }),
  a4_weeks: insert((s, f) => <><Calendar x={760} y={430} s={1.1} month="JUNE" day={19} year={1865} from={{ month: 'APRIL', day: 9 }} flipAt={14} color="#5A5A5A" /></>, { narr: [['idle', 'worried']] }),
  a4_june: scene((s, f, dur) => <>
    <rect x={-200} y={760} width={1100} height={500} fill="#4F86A8" />
    <g transform={`translate(${interpolate(f, [0, 40], [-100, 300], Easing.out)} ${780 + Math.sin(f / 10) * 5})`}><path d="M-160 0 L160 0 L120 56 L-120 56 Z" fill="#5A4A3A" stroke={OL} strokeWidth={5} /><path d="M0 0 V-200" stroke={OL} strokeWidth={6} /><path d="M6 -190 Q90 -120 6 -40 Z" fill="#F4ECD8" stroke={OL} strokeWidth={4} /></g>
    <Chibi x={1100} y={860} s={1} {...UNION} item="scroll" pose={[{ at: 0, pose: 'idle' }, { at: cue(s, 'read'), pose: 'present' }]} legs="stand" expr="determined" seed="granger" />
  </>, { narr: [['present', 'smile']], over: (s) => <Label text="Galveston, 19 June 1865" x={860} y={200} at={cue(s, 'Galveston')} size={62} color="#fff" /> }),
  a4_free: scene((s, f) => <>
    {[...Array(7)].map((_, i) => <Chibi key={i} x={360 + i * 150} y={860 - (i % 2) * 20} s={0.85} {...CROWD(i)} pose={[{ at: 0, pose: 'idle' }, { at: cue(s, 'free') + i * 2, pose: 'cheer' }]} legs="stand" expr={[{ at: 0, expr: 'calm' }, { at: cue(s, 'free'), expr: 'happy' }]} seed={'fr' + i} />)}
  </>, { narr: [['present', 'smile'], ['fist', 'grin', 'free']], over: (s) => <Label text="FREE" x={860} y={260} at={cue(s, 'free')} size={130} color={GOLD} /> }),
  a4_juneteenth: scene((s, f) => <>
    <g transform={`translate(860 470) scale(${springPop(f, cue(s, 'Juneteenth') - 4)})`}><path d="M-380 0 Q0 60 380 0 L360 -110 Q0 -60 -360 -110 Z" fill="#C0392B" stroke={OL} strokeWidth={6} /><text y={-20} textAnchor="middle" fontFamily="TagBold" fontSize={72} fill="#FFE9A0">JUNETEENTH</text></g>
    {[...Array(6)].map((_, i) => <Chibi key={i} x={430 + i * 170} y={860} s={0.8} {...CROWD(i + 2)} pose="cheer" legs="stand" expr="happy" seed={'jt' + i} />)}
  </>, { narr: [['fist', 'grin']] }),
  a4_holiday: insert((s, f) => <><Calendar x={600} y={420} s={1.05} month="JUNE" day={19} year="every year" color="#C0392B" glow={springPop(f, cue(s, 'national'))} /><Tag x={1150} y={640} text="NATIONAL HOLIDAY · 2021" size={40} bg={GOLD} k={springPop(f, cue(s, 'national'))} /></>, { narr: [['present', 'grin']] }),

  // ---------------- Act 5
  a5_dial: host([['point', 'grin', 'Dial']], DialProp(0.6)),
  a5_federal: map({ cam: C.TX, from: C.US, tags: [['UNDER FEDERAL CONTROL', -99.6, 31.6, 'federal', '#24356B']], narr: [['present', 'smile']] }),
  a5_vote: scene((s, f) => <>
    <g transform="translate(1180 760)"><rect x={-90} y={-130} width={180} height={130} fill="#8B5A2B" stroke={OL} strokeWidth={6} /><rect x={-50} y={-136} width={100} height={12} fill={OL} /><text y={-50} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#FFE9A0">VOTE</text></g>
    {[...Array(5)].map((_, i) => <Chibi key={i} x={460 + i * 130} y={860} s={0.85} {...CROWD(i)} hat={i % 2 ? 'cap' : 'hair'} pose={i === 4 ? 'present' : 'idle'} legs="stand" expr="happy" seed={'vt' + i} />)}
  </>, { narr: [['present', 'smile']] }),
  a5_lincoln: host([['point', 'grin', 'Republicans']], both(DialProp(dialTo(0.6, -0.8, 'Republicans'), { banner: RED }), TagProp('REPUBLICANS', 'Republicans', { y: 720, bg: '#F2C4BE' }))),
  a5_brief: host([['finger', 'smile', 'brief']], both(DialProp(-0.8, { banner: RED }), TagProp('BRIEFLY', 'brief', { y: 720, bg: GOLD }))),
  a5_davis: people([{ name: 'Edmund J. Davis', role: 'Republican · Governor 1870–74', c: '#7A2E2E', costume: { ...SUIT19('#2A2E3A'), beard: true } }], [['present', 'smile']]),
  a5_union: people([{ name: 'Edmund J. Davis', role: 'Republican · Governor 1870–74', c: '#7A2E2E', costume: { ...SUIT19('#2A2E3A'), beard: true }, cue: -99, stamp: ['FOUGHT FOR THE UNION', 'Union'] }], [['present', 'smile']]),
  a5_black: scene((s, f) => <>
    <Capitol x={860} y={760} s={0.95} />
    {[...Array(4)].map((_, i) => <Chibi key={i} x={560 + i * 200} y={870} s={0.85} {...SUIT19(['#2A2E3A', '#3A3A48', '#4A3A2A', '#2E3A4A'][i])} skin={['#8D5524', '#6B3E1E', '#A0663A', '#5A3418'][i]} pose={i === 1 ? 'wave' : 'idle'} legs="stand" expr="happy" seed={'lg' + i} />)}
  </>, { narr: [['present', 'proud']], over: (s) => <Label text="Texas Legislature, 1870" x={860} y={170} at={8} size={58} color="#fff" /> }),
  a5_occupation: bigCard('“OCCUPATION”', 'how many white Texans saw it', { c: 'occupation', narr: [['chin', 'worried']] }),
  a5_police: insert((s, f) => <>{[['STATE POLICE', 'police'], ['HIGHER TAXES', 'taxes'], ['FEDERAL TROOPS', 'troops']].map(([t, w], i) => <Tag key={t} x={420 + i * 380} y={420} text={t} size={42} rot={i % 2 ? 3 : -3} k={springPop(f, cue(s, w, 8 + i * 10))} />)}</>, { narr: [['present', 'smile']] }),
  a5_else: bigCard('“PROTECTION”', 'how his supporters saw it', { c: 'else', narr: [['present', 'smile']] }),
  a5_rights: bigCard('“PROTECTION”', 'the rights of Black citizens', { c: -99, narr: [['present', 'smile']] }),
  a5_last: host([['shrug', 'smile', 'last']], DialProp(-0.8, { banner: RED })),
  a5_coke: result([{ name: 'Richard Coke (D)', v: 66.7, c: BLUE }, { name: 'Edmund J. Davis (R)', v: 33.3, c: RED }], 'GOVERNOR · 1873', { note: 'ABOUT 2 TO 1', narr: [['point', 'shock']] }),
  a5_refused: scene((s, f) => <><Capitol x={860} y={790} s={1} /><Tag x={860} y={300} text="“I'm not leaving.”" size={44} k={springPop(f, cue(s, 'refused'))} font="Serif" /></>, { narr: [['shrug', 'worried']] }),
  a5_rival: scene((s, f) => <>
    <Capitol x={860} y={790} s={1} />
    <Tag x={560} y={420} text="GOVERNOR DAVIS (downstairs)" size={30} k={springPop(f, cue(s, 'two'))} />
    <Tag x={1150} y={300} text="GOVERNOR COKE (upstairs)" size={30} bg="#BFD4EE" k={springPop(f, cue(s, 'two') + 8)} />
  </>, { narr: [['shrug', 'grin', 'same']] }),
  a5_grant: people([{ name: 'Ulysses S. Grant', role: 'President', c: '#3A3A48', costume: { ...SUIT19('#1E1E28'), beard: true }, stamp: ['NO TROOPS', 'refused', '#E8C9C3'] }], [['present', 'smile']]),
  a5_walked: scene((s, f, dur) => <><Capitol x={760} y={790} s={1} /><Chibi x={interpolate(f, [0, dur], [760, 1250])} y={860} s={0.85} {...SUIT19('#2A2E3A')} beard pose="idle" legs="walk" expr="sad" seed="davis" /></>, { narr: [['idle', 'smile']] }),
  a5_backwards: host([['finger', 'grin', 'backwards']], (s, f) => <g transform={`translate(1150 560) rotate(${interpolate(f, [cue(s, 'backwards'), cue(s, 'backwards') + 14], [0, 180], Easing.out)})`}><Tag x={0} y={0} text="BACKWARDS" size={56} bg={GOLD} k={springPop(f, cue(s, 'backwards') - 6)} /></g>),
  a5_redeem: bigCard('“REDEEMERS”', 'the Democrats who took over, 1874', { c: 'Redeemers', color: '#BFD4EE', narr: [['present', 'smile']] }),
  a5_const: doc('CONSTITUTION OF THE STATE OF TEXAS', ['adopted 1876', 'still in force today'], { stamp: ['1876', 'Constitution'], narr: [['present', 'smile']] }),
  a5_run: timeline([[1874, '1874'], [1900, '1900'], [1925, '1925'], [1950, '1950'], [1978, '1978']], [1870, 1980], 1978, { bands: [[1874, 1978, BLUE]], narr: [['present', 'smile']] }),
  a5_white: bigCard('WHITE POLITICAL CONTROL', 'the party’s open aim', { color: '#E4DCCB', narr: [['idle', 'worried']] }),
};
