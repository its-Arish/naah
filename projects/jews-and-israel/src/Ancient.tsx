/** Captions 22 to 63 (Abraham to "the neighborhood gets dangerous"): maps from GIS, drawn story scenes, two real evidence pictures. */
import React from 'react';
import { cuts } from './Cuts';
import { Sign, Txt, Pop, Panel } from './Kit2';
import { PAPER, RED, GOLD, INK, D } from './Kit';
import { WorldMap, MapTag, MapPin, QC, camAt, moveCam, P } from '@engine/qgis/QgisMap';
import { Evidence } from '@engine/fx/Evidence';
import { Teach } from '@engine/moves';
import { Chibi } from '@engine/characters/Chibi';
import { talk } from '@engine/kit';
import { interpolate, Easing } from '@engine/lib/core';
import { OL, Hills } from '@engine/scenes/Parts';

const ROBE = (c = '#B88A5A', hat: string = 'none') => ({ outfit: { top: c, robe: true, sash: '#6B4A2B' }, hat, hair: '#3A2A22', beard: true, skin: '#C68B59' });
const LEV = ['ISR', 'PSE'];
const map = (cam0: any, cam1: any, hot: string[] = LEV, len = 70, kids?: (cam: any, t: number) => React.ReactNode, hotColor = '#F3B562') => (a: { t: number }) => {
  const cam = moveCam(a.t, cam0, cam1, 0, len);
  return <WorldMap data={D} cam={cam} fill={(c: any) => (hot.includes(c.iso) ? hotColor : QC.land)} grid={false}>{kids?.(cam, a.t)}</WorldMap>;
};
const lv = (z: number, lon = 36, lat = 32.5) => camAt(lon, lat, z);
const at2 = (lo: number, la: number) => P(lo, la);
const Tag = (x: number, y: number, text: string, k: number, size = 50, bg?: string) => <MapTag x={x} y={y} text={text} k={k} size={size} bg={bg} />;
const Scene: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <g><rect x={-300} y={760} width={2600} height={500} fill="#D9BF8A" /><Hills y={700} fill="#C9A66B" amp={30} seed="an" stroke={false} />{children}</g>
);
const Stone: React.FC<{ w?: number; h?: number; lines?: number; k?: number }> = ({ w = 220, h = 300, lines = 7, k = 1 }) => (
  <g>
    <path d={`M${-w / 2} ${h / 2} V${-h / 2 + 60} Q${-w / 2} ${-h / 2} 0 ${-h / 2} Q${w / 2} ${-h / 2} ${w / 2} ${-h / 2 + 60} V${h / 2} Z`} fill="#8C8A84" stroke={OL} strokeWidth={6} />
    {[...Array(lines)].map((_, i) => <path key={i} d={`M${-w / 2 + 28} ${-h / 2 + 90 + i * 28} h${(w - 56) * Math.min(1, Math.max(0, k * lines - i))}`} stroke="#4A4944" strokeWidth={6} strokeLinecap="round" strokeDasharray="14 8" />)}
  </g>
);
const Temple: React.FC<{ s?: number; glow?: number }> = ({ s = 1, glow = 0 }) => (
  <g transform={`scale(${s})`}>
    {glow > 0 && <circle r={240} cy={-40} fill={GOLD} opacity={0.3 * glow} />}
    <rect x={-180} y={60} width={360} height={30} fill="#CDBB94" stroke={OL} strokeWidth={5} />
    {[-140, -70, 0, 70, 140].map((x) => <rect key={x} x={x - 14} y={-70} width={28} height={130} fill="#EFE3C4" stroke={OL} strokeWidth={4} />)}
    <path d="M-190 -70 H190 L0 -150 Z" fill="#E2D2A8" stroke={OL} strokeWidth={6} strokeLinejoin="round" />
  </g>
);
const Crown: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><path d="M-80 40 L-90 -40 L-45 0 L0 -60 L45 0 L90 -40 L80 40 Z" fill={GOLD} stroke={OL} strokeWidth={6} strokeLinejoin="round" />{[-90, 0, 90].map((x) => <circle key={x} cx={x} cy={x === 0 ? -64 : -44} r={10} fill={RED} stroke={OL} strokeWidth={3} />)}</g>
);
const Scales: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <line y1={-110} y2={110} stroke="#6B4A2B" strokeWidth={10} strokeLinecap="round" /><line x1={-120} x2={120} y1={-90} y2={-90} stroke="#6B4A2B" strokeWidth={9} strokeLinecap="round" />
    {[-120, 120].map((x) => <g key={x}><path d={`M${x} -90 L${x - 40} -10 M${x} -90 L${x + 40} -10`} stroke="#6B4A2B" strokeWidth={5} /><path d={`M${x - 55} -10 H${x + 55} Q${x + 40} 40 ${x} 40 Q${x - 40} 40 ${x - 55} -10 Z`} fill={GOLD} stroke={OL} strokeWidth={5} /></g>)}
    <rect x={-60} y={104} width={120} height={22} rx={6} fill="#6B4A2B" stroke={OL} strokeWidth={4} />
  </g>
);
const Q = (x: number, y: number, k: number, size = 150) => <Pop k={k} x={x} y={y}><Txt t="?" size={size} c={INK} /></Pop>;

export const ANCIENT: Record<string, React.FC<any>> = {
  // 22 "Start with a man named Abraham." (HOST)
  a22: cuts([{ at: 0, nar: { arm: 'point' }, draw: ({ pk }) => <><g transform={`translate(1180 520) scale(${pk(2)})`}><Chibi x={0} y={150} s={1.5} {...ROBE()} pose="point" expr="happy" seed="abr" talking={[]} /></g><Sign x={1180} y={230} k={pk(10)} text="ABRAHAM" size={64} /></> }]),
  // 23 "According to the Bible,"
  a23: cuts([{ at: 0, draw: ({ pk }) => <Sign x={900} y={430} k={pk(2)} text="ACCORDING TO THE BIBLE" size={64} /> }]),
  // 24 "he leaves his home in Mesopotamia"
  a24: cuts([{ at: 0, full: map(lv(3.2, 44, 32), lv(5, 44, 32), ['IRQ'], 52, (cam) => { const [x, y] = at2(46.1, 30.96); return <MapPin x={x} y={y} at={8} z={cam.z} />; }), draw: ({ pk }) => Tag(900, 220, 'HIS HOME: MESOPOTAMIA', pk(4), 52) }]),
  // 25 "and walks west into Canaan."
  a25: cuts([{ at: 0, full: map(lv(4.2, 41, 33.5), lv(6, 40, 33.5), LEV, 58, (cam, t) => { const a = at2(46.1, 30.96), b = at2(39.0, 36.9), c = at2(35.2, 32.2); const g = interpolate(t, [4, 52], [0, 1], Easing.inOut); return <path d={`M${a[0]} ${a[1]} Q${b[0]} ${b[1] - 4} ${c[0]} ${c[1]}`} stroke={RED} strokeWidth={6 / cam.z * 2} fill="none" strokeDasharray="1 14" strokeLinecap="round" pathLength={1} strokeDashoffset={0} style={{ clipPath: undefined }} opacity={g > 0 ? 1 : 0} />; }), draw: ({ pk }) => Tag(900, 220, 'WEST, INTO CANAAN', pk(4), 52) }]),
  // 26 "The land between the Mediterranean Sea and the Jordan River."
  a26: cuts([
    { at: 0, full: map(lv(9, 35, 32.2), lv(12, 34.8, 32.2), LEV, 56), draw: ({ pk }) => Tag(520, 520, 'MEDITERRANEAN SEA', pk(6), 40) },
    { at: 'Jordan', full: map(lv(12, 35.4, 32.2), lv(15, 35.5, 32.2), LEV, 56, (cam) => { const [x, y] = at2(35.55, 32.4); return <MapPin x={x} y={y} at={4} z={cam.z} />; }), draw: ({ pk }) => Tag(900, 220, 'THE JORDAN RIVER', pk(4), 52) },
  ]),
  // 27 "His grandson Jacob is renamed Israel,"
  a27: cuts([
    { at: 0, draw: ({ pk }) => <><g transform={`translate(900 520) scale(${pk(2)})`}><Chibi x={0} y={150} s={1.5} {...ROBE('#A0764A')} pose="idle" expr="normal" seed="jac" talking={[]} /></g><Sign x={900} y={240} k={pk(8)} text="JACOB" sub="Abraham's grandson" size={64} /></> },
    { at: 'renamed', draw: ({ pk }) => <><g transform="translate(900 520)"><Chibi x={0} y={150} s={1.5} {...ROBE('#A0764A')} pose="cheer" expr="happy" seed="jac" talking={[]} /></g><Sign x={900} y={240} k={pk(2)} text="NOW: ISRAEL" size={72} bg={GOLD} /></> },
  ]),
  // 28 "which means something like he who struggles with God."
  a28: cuts([
    { at: 0, draw: ({ pk }) => <Sign x={900} y={420} k={pk(2)} text="ISRAEL" sub="means something like..." size={110} /> },
    { at: 'struggles', draw: ({ pk, t }) => <><circle cx={1180} cy={470} r={130 + Math.sin(t / 5) * 8} fill={GOLD} opacity={0.35} /><g transform="translate(700 420)"><Chibi x={0} y={150} s={1.4} {...ROBE('#A0764A')} pose="fist" expr="shock" seed="jac" talking={[]} /></g><Sign x={1000} y={270} k={pk(2)} text="HE WHO STRUGGLES WITH GOD" size={46} /></> },
  ]),
  // 29 "Jacob's twelve sons become the twelve tribes."
  a29: cuts([
    { at: 0, draw: ({ pk }) => <>{[...Array(12)].map((_, i) => <Pop key={i} k={pk(2 + i * 3)} x={430 + (i % 6) * 150} y={400 + Math.floor(i / 6) * 150}><rect x={-50} y={-56} width={100} height={110} rx={14} fill={['#C8312B', '#2F4A7A', '#3E8E54', '#E2B13C', '#7A4A9A', '#E06A3B'][i % 6]} stroke={OL} strokeWidth={5} /><Txt y={20} t={String(i + 1)} size={52} c="#fff" /></Pop>)}</> },
    { at: 'twelve', draw: ({ pk }) => <Sign x={900} y={440} k={pk(2)} text="12 SONS = 12 TRIBES" size={80} bg={GOLD} /> },
  ]),
  // 30 "Famine drives the family to Egypt"
  a30: cuts([{ at: 0, full: map(lv(4, 33.5, 31), lv(5.5, 33.5, 31), ['EGY', ...LEV], 54, (cam, t) => { const a = at2(35.2, 31.8), b = at2(31.5, 30.6); const g = interpolate(t, [10, 48], [0, 1], Easing.inOut); return <path d={`M${a[0]} ${a[1]} L${a[0] + (b[0] - a[0]) * g} ${a[1] + (b[1] - a[1]) * g}`} stroke={RED} strokeWidth={7 / cam.z * 2} strokeLinecap="round" fill="none" />; }), draw: ({ pk }) => Tag(900, 220, 'FAMINE: TO EGYPT', pk(4), 52, RED) }]),
  // 31 "and the story says they are enslaved there"
  a31: cuts([{ at: 0, draw: ({ pk, t }) => <><g transform="translate(560 640)">{[...Array(6)].map((_, i) => <rect key={i} x={(i % 3) * 120} y={-Math.floor(i / 3) * 60} width={110} height={52} fill="#B5653A" stroke={OL} strokeWidth={4} opacity={Math.min(1, Math.max(0, (t - i * 6) / 8))} />)}</g><Sign x={1000} y={300} k={pk(6)} text="ENSLAVED, SAYS THE STORY" size={50} /></> }]),
  // 32 "until a leader named Moses brings them out"
  a32: cuts([{ at: 0, draw: ({ pk, t }) => <><Scene>{[0, 1, 2].map((i) => <Chibi key={i} x={500 + i * 160 + t * 1.8} y={900} s={1.1} {...ROBE(['#A0764A', '#8A6A4A', '#B88A5A'][i])} legs="walk" pose="idle" expr="normal" seed={'ex' + i} talking={[]} delay={i * 5} />)}<Chibi x={1050 + t * 1.8} y={900} s={1.3} {...ROBE('#E8E2D2')} legs="walk" pose="point" expr="happy" seed="mos" talking={[]} /></Scene><Sign x={900} y={260} k={pk(6)} text="MOSES LEADS THEM OUT" size={56} /></> }]),
  // 33 "and at Mount Sinai they receive the law."
  a33: cuts([{ at: 0, draw: ({ pk }) => <><path d="M300 860 L760 300 L1000 560 L1180 400 L1560 860 Z" fill="#8A7A66" stroke={OL} strokeWidth={6} strokeLinejoin="round" /><Pop k={pk(10)} x={900} y={500}><rect x={-120} y={-100} width={110} height={170} rx={50} fill="#D9D4C6" stroke={OL} strokeWidth={5} /><rect x={10} y={-100} width={110} height={170} rx={50} fill="#D9D4C6" stroke={OL} strokeWidth={5} /></Pop><Sign x={900} y={220} k={pk(4)} text="MOUNT SINAI: THE LAW" size={56} /></> }]),
  // 34 "Historians can't confirm that story." (HOST)
  a34: cuts([{ at: 0, nar: { arm: 'shrug' }, draw: ({ pk }) => <Sign x={1180} y={440} k={pk(2)} text="UNCONFIRMED" sub="historians can't verify it" size={50} bg="#F9C5C0" rot={-4} /> }]),
  // 35 "There is no Egyptian record of an Exodus,"
  a35: cuts([{ at: 0, draw: ({ pk }) => <><Pop k={pk(2)} x={800} y={520}><rect x={-150} y={-190} width={300} height={380} rx={16} fill="#E8D9AE" stroke={OL} strokeWidth={6} /><Txt y={10} t="EXODUS?" size={50} c="#6B4A2B" /></Pop><Sign x={1180} y={300} k={pk(14)} text="NO EGYPTIAN RECORD" size={46} bg="#F9C5C0" /></> }]),
  // 36 "but there is one very old clue."
  a36: cuts([{ at: 0, nar: { arm: 'finger', expr: 'grin' }, draw: ({ pk }) => <><Pop k={pk(2)} x={800} y={470}><circle r={120} fill="#CFE8F5" stroke={OL} strokeWidth={9} /><line x1={84} y1={84} x2={200} y2={200} stroke="#6B4A2B" strokeWidth={22} strokeLinecap="round" /></Pop><Sign x={1180} y={290} k={pk(10)} text="ONE VERY OLD CLUE" size={44} /></> }]),
  // 37 "Around 1208 BCE,"
  a37: cuts([{ at: 0, draw: ({ pk }) => <Sign x={900} y={430} k={pk(2)} text="1208 BCE" sub="about 3,200 years ago" size={130} bg={GOLD} /> }]),
  // 38 "the Egyptian pharaoh Merneptah carved a victory stone"
  a38: cuts([
    { at: 0, draw: ({ pk }) => <><g transform={`translate(900 520) scale(${pk(2)})`}><Chibi x={0} y={150} s={1.5} outfit={{ top: '#E8E2D2', bottom: '#E8E2D2', trim: GOLD }} hat="crown" hair="#1A1410" skin="#C68B59" pose="point" expr="normal" seed="mer" talking={[]} /></g><Sign x={900} y={230} k={pk(8)} text="PHARAOH MERNEPTAH" size={56} /></> },
    { at: 'carved', draw: ({ pk, t }) => <><g transform={`translate(900 520) scale(${1.1 * pk(2)})`}><Stone k={interpolate(t, [6, 44], [0, 1])} /></g><Sign x={900} y={190} k={pk(10)} text="A VICTORY STONE" size={56} /></> },
  ]),
  // 39 "listing the peoples he had crushed in Canaan."
  a39: cuts([{ at: 0, full: map(lv(5, 36, 32), lv(7, 35.5, 32), LEV, 70, (cam) => { const [x, y] = at2(35.2, 32); return <MapPin x={x} y={y} at={14} z={cam.z} />; }), draw: ({ pk }) => Tag(900, 220, 'PEOPLES CRUSHED IN CANAAN', pk(4), 50) }]),
  // 40 "One of them is called Israel."  (real evidence: the Merneptah Stele)
  a40: ({ s }: any) => EV(s, '01-merneptah.jpg', 0.64, 'Israel', 'Merneptah Stele, about 1208 BCE: the oldest mention of Israel outside the Bible', 560, 880, 330),
  // 41 "It's the oldest known mention of the name outside the Bible."
  a41: cuts([
    { at: 0, draw: ({ pk, t }) => <><line x1={300} y1={500} x2={1500} y2={500} stroke="#6E6658" strokeWidth={8} strokeLinecap="round" /><Pop k={pk(6)} x={1300} y={500}><circle r={22} fill={GOLD} stroke={OL} strokeWidth={5} /></Pop><Sign x={1300} y={400} k={pk(12)} text="1208 BCE" size={44} /><Sign x={900} y={250} k={pk(2)} text="OLDEST KNOWN MENTION" size={56} /></> },
    { at: 'outside', draw: ({ pk }) => <><g transform={`translate(760 520) scale(${pk(2) * 1.2})`}><rect x={-150} y={-190} width={300} height={380} rx={16} fill="#E8D9AE" stroke={OL} strokeWidth={6} /><Txt y={10} t="BIBLE" size={64} c="#6B4A2B" /></g><Sign x={1220} y={470} k={pk(10)} text="OUTSIDE THE BIBLE" size={50} bg="#CFE8D2" /></> },
  ]),
  // 42 "So about 3,200 years ago,"
  a42: cuts([
    { at: 0, draw: ({ pk, t }) => <Pop k={pk(2)} x={900} y={440}><rect x={-380} y={-140} width={760} height={280} rx={22} fill="#26343A" stroke={OL} strokeWidth={8} /><Txt y={40} t={Math.round(interpolate(t, [4, 36], [0, 3200], Easing.out)).toLocaleString('en-US')} size={150} c={GOLD} /><Txt y={104} t="YEARS AGO" size={48} c="#CFC6B2" /></Pop> },
    { at: 'ago', draw: ({ pk }) => <Sign x={900} y={440} k={pk(2)} text="SOMEONE CALLED ISRAEL..." size={64} /> },
  ]),
  // 43 "someone called Israel was already living in those hills."
  a43: cuts([
    { at: 0, full: map(lv(10, 35.2, 32), lv(14, 35.2, 32), LEV, 52), draw: ({ pk }) => Tag(900, 220, 'ISRAEL: ALREADY THERE', pk(4), 50) },
    { at: 'living', draw: ({ pk }) => <><Scene><Chibi x={760} y={900} s={1.3} {...ROBE('#B88A5A')} pose="idle" expr="happy" seed="h1" talking={[]} /><Chibi x={1080} y={900} s={1.1} {...ROBE('#A0764A')} pose="point" expr="normal" seed="h2" talking={[]} /></Scene><Sign x={900} y={240} k={pk(4)} text="LIVING IN THOSE HILLS" size={52} /></> },
  ]),
  // 44 "By around 1,000 BCE,"
  a44: cuts([{ at: 0, draw: ({ pk }) => <Sign x={900} y={430} k={pk(2)} text="1000 BCE" size={130} bg={GOLD} /> }]),
  // 45 "the Bible says the tribes unite under kings."
  a45: cuts([
    { at: 0, draw: ({ pk, t }) => <>{[...Array(12)].map((_, i) => { const a = (i / 12) * 6.283; const k = interpolate(t, [10, 44], [1, 0.15], Easing.inOut); return <rect key={i} x={900 + Math.cos(a) * 260 * k - 40} y={470 + Math.sin(a) * 160 * k - 40} width={80} height={80} rx={14} fill={['#C8312B', '#2F4A7A', '#3E8E54', '#E2B13C', '#7A4A9A', '#E06A3B'][i % 6]} stroke={OL} strokeWidth={5} />; })}<Sign x={900} y={250} k={pk(4)} text="THE TRIBES UNITE" size={56} /></> },
    { at: 'kings', draw: ({ pk }) => <><g transform={`translate(900 470) scale(${2.2 * pk(2)})`}><Crown /></g><Sign x={900} y={760} k={pk(8)} text="UNDER KINGS" size={52} /></> },
  ]),
  // 46 "First Saul, then David,"  (real evidence: the Tel Dan Stele)
  a46: ({ s }: any) => EV(s, '02-tel-dan.jpg', 1.5, 'David', 'Tel Dan Stele, 9th century BCE: widely read as naming the "House of David"', 480, 880, 400),
  // 47 "who captures a hill town called Jerusalem"
  a47: cuts([{ at: 0, full: map(lv(12, 35.2, 31.8), lv(18, 35.2, 31.8), LEV, 64, (cam) => { const [x, y] = at2(35.21, 31.77); return <MapPin x={x} y={y} at={14} z={cam.z} />; }), draw: ({ pk }) => Tag(900, 220, 'JERUSALEM: A HILL TOWN', pk(4), 52) }]),
  // 48 "and makes it his capital."
  a48: cuts([{ at: 0, draw: ({ pk }) => <><g transform={`translate(900 440) scale(${2 * pk(2)})`}><Crown /></g><Sign x={900} y={690} k={pk(8)} text="HIS CAPITAL" size={64} bg={GOLD} /></> }]),
  // 49 "His son Solomon builds a great temple there,"
  a49: cuts([{ at: 0, draw: ({ pk }) => <><g transform={`translate(900 560) scale(${2 * pk(2)})`}><Temple /></g><Sign x={900} y={230} k={pk(8)} text="SOLOMON BUILDS A TEMPLE" size={54} /></> }]),
  // 50 "the first temple."
  a50: cuts([{ at: 0, draw: ({ pk }) => <><g transform={`translate(900 520) scale(${2.1 * pk(2)})`}><Temple glow={1} /></g><Sign x={900} y={230} k={pk(6)} text="THE FIRST TEMPLE" size={64} bg={GOLD} /></> }]),
  // 51 "How big was this kingdom really?"
  a51: cuts([{ at: 0, nar: { arm: 'chin' }, draw: ({ pk }) => <>{Q(1220, 560, pk(2), 340)}<Sign x={1220} y={230} k={pk(8)} text="HOW BIG?" size={64} /></> }]),
  // 52 "Archaeologists argue about it."
  a52: cuts([{ at: 0, draw: ({ pk }) => <><g transform={`translate(640 520) scale(${pk(2)})`}><Chibi x={0} y={150} s={1.4} {...ROBE('#7A8A6A')} hat="pith" pose="point" expr="shock" seed="ar1" talking={[]} /></g><g transform={`translate(1180 520) scale(${pk(8)})`}><Chibi x={0} y={150} s={1.4} {...ROBE('#8A6A7A')} hat="pith" pose="fist" expr="shock" seed="ar2" flip talking={[]} /></g><Sign x={900} y={230} k={pk(14)} text="ARCHAEOLOGISTS ARGUE" size={56} /></> }]),
  // 53 "Some see an empire."
  a53: cuts([{ at: 0, full: map(lv(5, 37, 32.5), lv(5.8, 37, 32.5), ['ISR', 'PSE', 'JOR', 'LBN', 'SYR'], 52, undefined, '#E4632F'), draw: ({ pk }) => Tag(900, 220, 'SOME SEE AN EMPIRE', pk(4), 56) }]),
  // 54 "Others see a small highland kingdom."
  a54: cuts([{ at: 0, full: map(lv(5.8, 37, 32.5), lv(13, 35.3, 32), LEV, 66, undefined, '#9CC9A0'), draw: ({ pk }) => Tag(900, 220, 'OTHERS: A SMALL KINGDOM', pk(4), 46) }]),
  // 55 "What nobody argues about is what the temple did."
  a55: cuts([{ at: 0, draw: ({ pk }) => <><g transform={`translate(900 560) scale(${1.9 * pk(2)})`}><Temple glow={1} /></g><Sign x={900} y={230} k={pk(8)} text="WHAT NOBODY ARGUES ABOUT" size={50} /></> }]),
  // 56 "It made Jerusalem the center of Jewish life for good."
  a56: cuts([
    { at: 0, full: map(lv(14, 35.2, 31.8), lv(18, 35.2, 31.8), LEV, 50, (cam) => { const [x, y] = at2(35.21, 31.77); return <MapPin x={x} y={y} at={4} z={cam.z} />; }), draw: ({ pk }) => Tag(900, 220, 'JERUSALEM', pk(4), 60) },
    { at: 'center', draw: ({ pk, t }) => <><circle cx={900} cy={470} r={Math.min(300, t * 7)} fill={GOLD} opacity={0.35} /><Sign x={900} y={470} k={pk(2)} text="CENTER OF JEWISH LIFE" size={62} bg={GOLD} /></> },
  ]),
  // 57 "After Solomon, the kingdom splits in two."
  a57: cuts([{ at: 0, draw: ({ pk, t }) => { const g = interpolate(t, [24, 50], [0, 1], Easing.out); return <><g transform={`translate(${900 - g * 90} 450)`}><path d="M-160 -90 H0 L-24 -30 L10 20 L-18 90 H-160 Z" fill="#E2B13C" stroke={OL} strokeWidth={6} strokeLinejoin="round" /></g><g transform={`translate(${900 + g * 90} 450)`}><path d="M0 -90 H160 V90 H-18 L10 20 L-24 -30 Z" fill="#9CC9A0" stroke={OL} strokeWidth={6} strokeLinejoin="round" /></g><Sign x={900} y={230} k={pk(2)} text="THE KINGDOM SPLITS IN TWO" size={54} /></>; } }]),
  // 58 "Israel in the north, Judah in the south with Jerusalem."
  a58: cuts([
    { at: 0, full: map(lv(12, 35.2, 32), lv(14, 35.2, 32), LEV, 50, undefined, '#9CC9A0'), draw: ({ pk }) => <>{Tag(1000, 330, 'ISRAEL (NORTH)', pk(4), 44, '#2E6B3E')}</> },
    { at: 'Judah', full: map(lv(14, 35.2, 32), lv(16, 35.2, 31.8), LEV, 50, (cam) => { const [x, y] = at2(35.21, 31.77); return <MapPin x={x} y={y} at={8} z={cam.z} />; }, '#E9A6A0'), draw: ({ pk }) => <>{Tag(1000, 640, 'JUDAH (SOUTH)', pk(4), 44, '#8A3A3A')}</> },
  ]),
  // 59 "In these years, prophets like Amos and Isaiah appear,"
  a59: cuts([
    { at: 0, draw: ({ pk }) => <Sign x={900} y={430} k={pk(2)} text="PROPHETS" size={110} /> },
    { at: 'Amos', draw: ({ pk }) => <><g transform={`translate(900 520) scale(${pk(2)})`}><Chibi x={0} y={150} s={1.5} {...ROBE('#8A6A4A')} pose="point" expr="shock" seed="amo" talking={[]} /></g><Sign x={900} y={230} k={pk(8)} text="AMOS" size={80} /></> },
    { at: 'Isaiah', draw: ({ pk }) => <><g transform={`translate(900 520) scale(${pk(2)})`}><Chibi x={0} y={150} s={1.5} {...ROBE('#C8B890')} pose="fist" expr="shock" seed="isa" talking={[]} /></g><Sign x={900} y={230} k={pk(8)} text="ISAIAH" size={80} /></> },
  ]),
  // 60 "denouncing kings who ignore the poor"
  a60: cuts([{ at: 0, draw: ({ pk }) => <><g transform={`translate(640 520) scale(${pk(2)})`}><Chibi x={0} y={150} s={1.5} outfit={{ top: '#7A4A9A', bottom: '#F4F7FA', trim: GOLD }} hat="crown" hair="#1A1410" skin="#C68B59" pose="hold" expr="normal" seed="kng" talking={[]} /></g><g transform={`translate(1180 560) scale(${pk(8)})`}><Chibi x={0} y={150} s={1.2} {...ROBE('#6B5A45')} pose="idle" expr="sad" seed="poor" flip talking={[]} /></g><Sign x={900} y={230} k={pk(12)} text="KINGS WHO IGNORE THE POOR" size={50} bg="#F9C5C0" /></> }]),
  // 61 "and demanding justice from the powerful."
  a61: cuts([{ at: 0, draw: ({ pk }) => <><g transform={`translate(900 500) scale(${2 * pk(2)})`}><Scales /></g><Sign x={900} y={220} k={pk(8)} text="JUSTICE FROM THE POWERFUL" size={52} /></> }]),
  // 62 "Those demands become some of the most quoted words in the Bible,"
  a62: cuts([
    { at: 0, draw: ({ pk }) => <><Txt x={560} y={520} t={'“'} size={400} c={GOLD} o={pk(2)} /><Sign x={1000} y={450} k={pk(6)} text="THOSE DEMANDS" size={64} /></> },
    { at: 'quoted', draw: ({ pk }) => <><g transform={`translate(900 520) scale(${1.4 * pk(2)})`}><path d="M-170 -110 L0 -90 L170 -110 L170 120 L0 140 L-170 120 Z" fill="#7A4A2A" stroke={OL} strokeWidth={6} strokeLinejoin="round" /></g><Sign x={900} y={230} k={pk(8)} text="MOST QUOTED WORDS IN THE BIBLE" size={46} /></> },
  ]),
  // 63 "but the neighborhood gets dangerous."
  a63: cuts([{ at: 0, full: map(lv(3.2, 40, 34), lv(3.8, 40, 34), LEV, 60, (cam, t) => { const arrows: [number, number][] = [[43.1, 36.3], [44.4, 32.5]]; const tgt = at2(35.2, 32); return <>{arrows.map(([lo, la], i) => { const a = at2(lo, la); const g = interpolate(t, [6 + i * 8, 40 + i * 8], [0, 1], Easing.inOut); return <path key={i} d={`M${a[0]} ${a[1]} L${a[0] + (tgt[0] - a[0]) * g} ${a[1] + (tgt[1] - a[1]) * g}`} stroke={RED} strokeWidth={8 / cam.z * 2} strokeLinecap="round" fill="none" />; })}</>; }), draw: ({ pk }) => Tag(900, 220, 'DANGEROUS NEIGHBORS', pk(4), 44, RED) }]),
};

/** Real picture on the stage, narrator pointing at it; the picture stays for the whole beat (capped at 2.5 s). */
function EV(s: any, src: string, aspect: number, word: string, label: string, h: number, tx: number, ty: number) {
  const f = 0;
  return (
    <>{cuts([{ at: 0, nar: false, draw: ({ w }) => <><Evidence src={src} aspect={aspect} at={3} x={900} y={470} h={h} label={label} len={Math.min(75, s.dur - 12)} zoom={1.1} /><Teach x={1660} y={1010} scale={0.5} keys={[]} talking={talk(s)} targets={[{ x: tx, y: ty, at: w(word) }]} /></> }])({ s })}</>
  );
}
