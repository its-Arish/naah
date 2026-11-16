/** The hook (captions 1 to 21, 0:00 to 0:49): a new picture every 1.8 s. Real material and GIS maps lead; drawn icons fill the gaps. */
import React from 'react';
import { cuts, type Part } from './Cuts';
import { Sign, DarkSign, Txt, Pop, Chip, Panel } from './Kit2';
import { Phone, PAPER, RED, GOLD, INK, D } from './Kit';
import { WorldMap, MapTag, MapPin, QC, camAt, moveCam, P } from '@engine/qgis/QgisMap';
import { interpolate, Easing } from '@engine/lib/core';
import { OL } from '@engine/scenes/Parts';

const HOME = P(35.0, 31.8); // Israel
const HAIFA = P(34.99, 32.79);
const israelFill = (hot = true) => (c: any) => (c.iso === 'ISR' || c.iso === 'PSE') && hot ? '#F3B562' : QC.land;
const MapShot = (a: { t: number }, from: ReturnType<typeof camAt>, to: ReturnType<typeof camAt>, hot = true, kids?: (cam: any) => React.ReactNode, len = 60) => {
  const cam = moveCam(a.t, from, to, 0, len);
  return <WorldMap data={D} cam={cam} fill={israelFill(hot)} sea="#9EC5DB" grid={false}>{kids?.(cam)}</WorldMap>;
};

const Week: React.FC<{ k: (i: number) => number; rest?: number }> = ({ k, rest = 0 }) => (
  <g transform="translate(560 520)">
    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => {
      const m = k(i); if (m <= 0) return null;
      const hot = i === 6 && rest > 0;
      return (
        <g key={d} transform={`translate(${i * 118} 0) scale(${m})`}>
          <rect x={-50} y={-70} width={100} height={140} rx={12} fill={hot ? GOLD : PAPER} stroke={OL} strokeWidth={5} />
          <rect x={-50} y={-70} width={100} height={34} rx={12} fill={hot ? RED : '#2F4A7A'} stroke={OL} strokeWidth={5} />
          <Txt y={-44} t={d} size={22} c="#fff" /><Txt y={32} t={String(i + 1)} size={56} />
        </g>
      );
    })}
  </g>
);
const Tree: React.FC = () => (
  <g>
    <rect x={-14} y={150} width={28} height={50} fill="#6B4A2B" stroke={OL} strokeWidth={4} />
    {[[0, -10, 120], [0, 50, 160], [0, 110, 200]].map(([x, y, w], i) => <path key={i} d={`M${x - w / 2} ${y + 60} L${x} ${y - 60} L${x + w / 2} ${y + 60} Z`} fill="#3E8E54" stroke={OL} strokeWidth={5} strokeLinejoin="round" />)}
    <path d="M0 -150 l14 30 l32 4 l-24 22 l8 32 l-30 -17 l-30 17 l8 -32 l-24 -22 l32 -4 Z" fill={GOLD} stroke={OL} strokeWidth={4} strokeLinejoin="round" transform="scale(0.8) translate(0 -20)" />
    {[[-40, 90], [34, 60], [-12, 120], [50, 130]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill={i % 2 ? RED : '#4FA6E0'} stroke={OL} strokeWidth={3} />)}
  </g>
);
const Book: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-170 -110 L0 -90 L170 -110 L170 120 L0 140 L-170 120 Z" fill="#7A4A2A" stroke={OL} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-150 -96 L-6 -78 L-6 128 L-150 108 Z M150 -96 L6 -78 L6 128 L150 108 Z" fill={PAPER} stroke={OL} strokeWidth={4} />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M-128 ${-60 + i * 30} l100 10 M128 ${-60 + i * 30} l-100 10`} stroke="#8A7A5A" strokeWidth={5} strokeLinecap="round" />)}
  </g>
);
const Candle: React.FC<{ x: number; f: number }> = ({ x, f }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={-14} y={-40} width={28} height={120} rx={4} fill="#F4ECD8" stroke={OL} strokeWidth={4} />
    <path d={`M0 -96 q${16 + Math.sin(f / 4) * 3} 28 0 52 q-16 -24 0 -52 Z`} fill="#FFB52E" stroke={OL} strokeWidth={3} />
  </g>
);
const Laptop: React.FC = () => (
  <g>
    <rect x={-150} y={-100} width={300} height={190} rx={12} fill="#2B2B33" stroke={OL} strokeWidth={6} />
    <rect x={-132} y={-84} width={264} height={158} rx={5} fill="#9ED0F0" />
    <path d="M-190 110 H190 L170 90 H-170 Z" fill="#8A8A90" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
  </g>
);
const Burst: React.FC<{ x: number; y: number; k: number; c?: string; r?: number }> = ({ x, y, k, c = GOLD, r = 340 }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    {[...Array(14)].map((_, i) => <path key={i} d={`M0 0 L${Math.cos((i / 14) * 6.283 - 0.08) * r} ${Math.sin((i / 14) * 6.283 - 0.08) * r} L${Math.cos((i / 14) * 6.283 + 0.08) * r} ${Math.sin((i / 14) * 6.283 + 0.08) * r} Z`} fill={c} opacity={0.5} />)}
  </g>
);

const P1 = (x: number, y: number, z: number): [number, number] => [x, y];

export const HOOK: Record<string, React.FC<any>> = {
  // "You say the word Amen. You shout Hallelujah."
  k01: cuts([
    { at: 0, nar: { arm: 'present' }, draw: ({ pk }) => <><Burst x={1190} y={430} k={pk(4)} /><Sign x={1190} y={430} k={pk(4)} text="AMEN" size={110} /></> },
    { at: 'shout', nar: { arm: 'wave', expr: 'grin' }, draw: ({ pk }) => <><Burst x={1190} y={430} k={pk(2)} c="#FF8A3D" /><Sign x={1190} y={430} k={pk(2)} text="HALLELUJAH!" size={52} bg={GOLD} rot={-3} /></> },
  ]),
  // "Both Hebrew. You plan your week in seven days"
  k02: cuts([
    { at: 0, nar: { arm: 'point' }, draw: ({ pk }) => <Sign x={900} y={420} k={pk(2)} text="BOTH HEBREW" sub="words you use without thinking" size={86} /> },
    { at: 'plan', nar: { arm: 'present' }, draw: ({ pk }) => <Week k={(i) => pk(2 + i * 4)} /> },
  ]),
  // "with one day of rest."
  k03: cuts([{ at: 0, draw: ({ t, pk }) => <><Week k={() => 1} rest={1} /><g transform="translate(1180 760)">{[-40, 40].map((x) => <Candle key={x} x={x} f={t} />)}</g><Sign x={900} y={290} k={pk(4)} text="ONE DAY OF REST" size={64} bg={GOLD} /></> }]),
  // "That rhythm comes from the Hebrew Bible."
  k04: cuts([{ at: 0, nar: { arm: 'point', expr: 'smile' }, draw: ({ pk }) => <><g transform="translate(880 520)"><Book s={1.5 * (0.4 + 0.6 * pk(2))} /></g><Sign x={880} y={250} k={pk(10)} text="THE HEBREW BIBLE" size={64} /></> }]),
  // "Christmas, built around a Jewish teacher."
  k05: cuts([
    { at: 0, draw: ({ pk }) => <><g transform={`translate(800 520) scale(${1.4 * pk(2)})`}><Tree /></g><Sign x={1150} y={330} k={pk(10)} text="CHRISTMAS" size={72} bg="#CFE8D2" /></> },
    { at: 'Jewish', nar: { arm: 'present' }, draw: ({ pk }) => <Sign x={900} y={430} k={pk(2)} text="A JEWISH TEACHER" sub="from Nazareth, in Galilee" size={78} /> },
  ]),
  // "Your map app, Waze, was built by Israelis."
  k06: cuts([
    { at: 0, draw: ({ pk }) => <><g transform={`translate(860 520) scale(${3.2 * pk(2)})`}><Phone /></g><Sign x={1180} y={300} k={pk(10)} text="YOUR MAP APP" size={56} /></> },
    { at: 'was', nar: { arm: 'point' }, full: (a) => MapShot(a, camAt(35, 31.8, 6), camAt(35, 31.8, 11), true), draw: ({ pk, t }) => <MapTag x={900} y={200} text="BUILT BY ISRAELIS" k={pk(6)} size={56} /> },
  ]),
  // "Your laptop's processor may have been designed in Haifa."
  k07: cuts([
    { at: 0, draw: ({ pk }) => <><g transform={`translate(760 560) scale(${1.5 * pk(2)})`}><Laptop /></g><g transform={`translate(1160 470) scale(${2.2 * pk(14)})`}><Chip /></g><Sign x={900} y={240} k={pk(8)} text="YOUR LAPTOP'S PROCESSOR" size={56} /></> },
    { at: 'designed', nar: { arm: 'point' }, full: (a) => MapShot(a, camAt(35, 31.8, 8), camAt(35, 32.6, 26), true, (cam) => <MapPin x={HAIFA[0]} y={HAIFA[1]} at={12} z={cam.z} />, 58), draw: ({ pk }) => <MapTag x={900} y={230} text="HAIFA" k={pk(14)} size={64} /> },
  ]),
  // "Now here's the strange part."
  k08: cuts([{ at: 0, nar: { arm: 'finger', expr: 'shock' }, draw: ({ pk }) => <><Burst x={1190} y={440} k={pk(4)} c="#C8312B" r={300} /><Sign x={1190} y={440} k={pk(4)} text="STRANGE PART" size={60} bg={DARKISH} c={GOLD} rot={-2} /></> }]),
  // "All of it came from a people who for nearly 2,000 years"
  k09: cuts([
    { at: 0, draw: ({ pk }) => <><g transform={`translate(560 520) scale(${pk(2) * 1.5})`}><Phone /></g><g transform={`translate(860 520) scale(${pk(8) * 1.8})`}><Chip /></g><g transform={`translate(1150 520) scale(${pk(14) * 0.9})`}><Tree /></g><Sign x={1190} y={260} k={pk(18)} text="ALL OF IT CAME FROM ONE PEOPLE" size={50} /></> },
    { at: 'nearly', nar: { arm: 'chin' }, draw: ({ t, pk }) => <><Pop k={pk(2)} x={1190} y={470}><rect x={-330} y={-130} width={660} height={260} rx={22} fill="#26343A" stroke={OL} strokeWidth={8} /><Txt y={40} t={`${Math.round(interpolate(t, [4, 30], [0, 2000], Easing.out)).toLocaleString('en-US')}`} size={150} c={GOLD} /><Txt y={100} t="YEARS" size={50} c="#CFC6B2" /></Pop></> },
  ]),
  // "had no country at all, scattered across every continent,"
  k10: cuts([
    { at: 0, nar: { arm: 'shrug' }, draw: ({ pk }) => <><Sign x={900} y={400} k={pk(2)} text="NO COUNTRY" sub="at all" size={96} bg="#E8E2D2" /><g transform={`translate(1220 560)`} opacity={pk(8)}><line x1={0} y1={-230} x2={0} y2={120} stroke="#6B4A2B" strokeWidth={10} strokeLinecap="round" /><path d="M0 -226 h120 l-26 40 l26 40 h-120" fill="none" stroke={INK} strokeWidth={6} strokeDasharray="10 10" /></g></> },
    { at: 'scattered', full: (a) => MapShot(a, camAt(10, 30, 1.2), camAt(10, 30, 1.45), false, (cam) => <>{[[34.8, 32], [-74, 40.7], [2.3, 48.8], [37.6, 55.7], [-58, -34.6], [18.4, -33.9], [151.2, -33.8], [-0.1, 51.5]].map(([lo, la], i) => { const [x, y] = P(lo, la); return <MapPin key={i} x={x} y={y} at={4 + i * 5} z={cam.z} r={0.8} />; })}</>, 50), draw: ({ pk }) => <MapTag x={900} y={800} text="SCATTERED" k={pk(6)} size={50} /> },
    { at: 'every', full: (a) => MapShot(a, camAt(10, 20, 1.15), camAt(20, 25, 1.0), false, (cam) => <>{[[34.8, 32], [-74, 40.7], [2.3, 48.8], [37.6, 55.7], [-58, -34.6], [18.4, -33.9], [151.2, -33.8], [-0.1, 51.5], [77, 28.6], [-99, 19.4], [31.2, 30], [-6, 34]].map(([lo, la], i) => { const [x, y] = P(lo, la); return <MapPin key={i} x={x} y={y} at={-30} z={cam.z} r={0.8} />; })}</>, 50), draw: ({ pk }) => <MapTag x={900} y={800} text="EVERY CONTINENT" k={pk(4)} size={50} /> },
  ]),
  // "expelled again and again."
  k11: cuts([{ at: 0, nar: { arm: 'fist', expr: 'sad' }, full: (a) => MapShot(a, camAt(25, 40, 3.0), camAt(25, 40, 2.4), false, (cam) => <>{[[-0.1, 51.5, -12, 0], [2.3, 48.8, -8, 6], [-3.7, 40.4, -10, 10]].map(([lo, la, dx, dy], i) => { const [x, y] = P(lo, la); const g = Math.min(1, Math.max(0, (a.t - i * 8) / 24)); return <path key={i} d={`M${x} ${y} q${-20 + dx * 5} ${-40 + dy} ${dx * 12 * g - 20} ${-30 + dy * 3 * g}`} stroke={RED} strokeWidth={5 / cam.z * 2} fill="none" markerEnd="" strokeLinecap="round" />; })}</>), draw: ({ pk }) => <MapTag x={900} y={800} text="EXPELLED. AGAIN. AND AGAIN." k={pk(4)} size={52} bg={RED} /> }]),
  // "Then in 1948, they had one."
  k12: cuts([
    { at: 0, draw: ({ pk }) => <><Burst x={900} y={440} k={pk(3)} /><Sign x={900} y={440} k={pk(3)} text="1948" size={190} bg={GOLD} /></> },
    { at: 'they', nar: { arm: 'present' }, full: (a) => MapShot(a, camAt(35, 31.5, 8), camAt(35, 31.5, 15), true), draw: ({ pk }) => <MapTag x={900} y={250} text="THEY HAD ONE" k={pk(6)} size={64} /> },
  ]),
  // "A land the size of New Jersey,"
  k13: cuts([{ at: 0, full: (a) => MapShot(a, camAt(35, 31.5, 12), camAt(35, 31.5, 16), true), draw: ({ pk }) => <MapTag x={900} y={200} text="ABOUT THE SIZE OF NEW JERSEY" k={pk(4)} size={54} /> }]),
  // "and nearly everyone on earth has an opinion about it."
  k14: cuts([
    { at: 0, nar: { arm: 'present' }, draw: ({ pk }) => <><Pop k={pk(2)} x={1080} y={400} rot={-5}><ellipse rx={120} ry={70} fill="#fff" stroke={OL} strokeWidth={6} /><Txt y={26} t="!!!" size={90} c={RED} /></Pop><Pop k={pk(12)} x={1330} y={560} rot={4}><ellipse rx={120} ry={70} fill="#fff" stroke={OL} strokeWidth={6} /><Txt y={26} t="?!" size={90} c="#2F4A7A" /></Pop></> },
    { at: 'opinion', nar: { arm: 'shrug', expr: 'shock' }, draw: ({ pk }) => <><Pop k={pk(2)} x={1070} y={330} rot={-6}><ellipse rx={120} ry={70} fill="#FFE9A0" stroke={OL} strokeWidth={6} /><Txt y={24} t="OPINION" size={40} /></Pop><Pop k={pk(8)} x={1330} y={470} rot={5}><ellipse rx={120} ry={70} fill="#CFE8D2" stroke={OL} strokeWidth={6} /><Txt y={24} t="OPINION" size={40} /></Pop><Pop k={pk(14)} x={1160} y={660} rot={-2}><ellipse rx={120} ry={70} fill="#F9C5C0" stroke={OL} strokeWidth={6} /><Txt y={24} t="OPINION" size={40} /></Pop></> },
  ]),
  // "Almost nobody has the whole story."
  k15: cuts([
    { at: 0, nar: { arm: 'shrug' }, draw: ({ pk }) => <Sign x={1190} y={420} k={pk(2)} text="THE WHOLE STORY" sub="almost nobody has it" size={44} /> },
    { at: 'nobody', nar: { arm: 'chin' }, draw: ({ pk }) => <><g transform={`translate(880 520) scale(${1.4 * (0.5 + 0.5 * pk(2))})`}><Book /><rect x={-130} y={-30} width={120} height={150} fill="#1B1F26" opacity={0.9} /><rect x={30} y={-10} width={110} height={110} fill="#1B1F26" opacity={0.9} /></g></> },
  ]),
  // "So where does it begin?"
  k16: cuts([{ at: 0, nar: { arm: 'chin', expr: 'smile' }, draw: ({ pk }) => <><Burst x={1190} y={430} k={pk(2)} c="#CFE8D2" r={300} /><Txt x={1190} y={560} t="?" size={420} c={INK} /></> }]),
  // "4,000 years ago in a hot dry land called Canaan."
  k17: cuts([
    { at: 0, nar: { arm: 'present' }, draw: ({ t, pk }) => <Pop k={pk(2)} x={1190} y={440}><rect x={-360} y={-140} width={720} height={280} rx={22} fill="#26343A" stroke={OL} strokeWidth={8} /><Txt y={40} t={`${Math.round(interpolate(t, [2, 30], [0, 4000], Easing.out)).toLocaleString('en-US')}`} size={160} c={GOLD} /><Txt y={102} t="YEARS AGO" size={50} c="#CFC6B2" /></Pop> },
    { at: 'hot', full: (a) => MapShot(a, camAt(35, 31.8, 6), camAt(35, 31.8, 10), true), draw: ({ pk }) => <MapTag x={1190} y={210} text="A HOT, DRY LAND: CANAAN" k={pk(4)} size={54} /> },
  ]),
  // "And why does it still burn?"
  k18: cuts([{ at: 0, nar: { arm: 'finger', expr: 'shock' }, full: (a) => { const cam = moveCam(a.t, camAt(35, 31.8, 9), camAt(35, 31.8, 12), 0, 46); return <WorldMap data={D} cam={cam} fill={(c: any) => (c.iso === 'ISR' || c.iso === 'PSE' ? '#E4632F' : '#3A3F4A')} sea="#1B1F26" stroke="#8A8272" grid={false} />; }, draw: ({ pk }) => <MapTag x={900} y={230} text="WHY DOES IT STILL BURN?" k={pk(2)} size={56} bg="#7A1F1A" /> }]),
  // "4,000 years, 30 minutes."
  k19: cuts([
    { at: 0, nar: { arm: 'present' }, draw: ({ t, pk }) => <Pop k={pk(2)} x={900} y={440}><rect x={-430} y={-110} width={860} height={220} rx={20} fill="#26343A" stroke={OL} strokeWidth={8} /><line x1={-360} y1={30} x2={360} y2={30} stroke="#6E6658" strokeWidth={8} strokeLinecap="round" /><line x1={-360} y1={30} x2={-360 + 720 * interpolate(t, [4, 40], [0, 1], Easing.inOut)} y2={30} stroke={GOLD} strokeWidth={8} strokeLinecap="round" /><Txt y={-24} t="4,000 YEARS" size={72} c="#fff" /></Pop> },
    { at: 'minutes', nar: { arm: 'finger', expr: 'grin' }, draw: ({ pk }) => <Sign x={900} y={440} k={pk(2)} text="30 MINUTES" size={120} bg={GOLD} /> },
  ]),
  // "Each side's story, told fairly."
  k20: cuts([
    { at: 0, nar: { arm: 'present' }, draw: ({ pk }) => <><Panel x={620} y={470} w={560} h={300} k={pk(2)} title="ONE SIDE"><Txt y={24} t="its story" size={64} c={GOLD} /></Panel></> },
    { at: 'told', nar: { arm: 'present' }, draw: ({ pk }) => <><Panel x={620} y={470} w={560} h={300} k={1} title="ONE SIDE"><Txt y={24} t="its story" size={64} c={GOLD} /></Panel><Panel x={1240} y={470} w={560} h={300} k={pk(2)} title="THE OTHER SIDE"><Txt y={24} t="its story" size={64} c={GOLD} /></Panel></> },
  ]),
  // "Let's go."
  k21: cuts([{ at: 0, nar: { arm: 'fist', expr: 'grin' }, draw: ({ pk }) => <><Burst x={1190} y={430} k={pk(1)} /><Sign x={1190} y={430} k={pk(1)} text="LET'S GO" size={90} bg={GOLD} rot={-3} /></> }]),
};
const DARKISH = '#26343A';
