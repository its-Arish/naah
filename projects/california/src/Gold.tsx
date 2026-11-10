/** Gold (4:05 to 6:11): the sawmill, Brannan's shovels, the rush, statehood, the quiet passage, and the men who died poor. */
import React from 'react';
import { interpolate, Easing, springPop } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { OL, Hills, Pine } from '@engine/scenes/Parts';
import { talk, type ShotMap, type SP } from '@engine/kit';
import { Stage } from '@engine/moves';
import { Full, MapTag, Globe } from '@engine/qgis/QgisMap';
import { D, PAPER, RED, GOLD, SEA, Rider, Galleon, CaShape, Board } from './Kit';
import { Tag, useBeat, Pop, Txt, Sign, DarkSign, Panel, Sky, Ground, HostS, Quiet, fade, fmt, Shovel, Pick, Pan, Nugget, Sparkle, House, Egg, Person } from './Kit2';

const SERIF = "Georgia, 'Times New Roman', serif";

// c072-c075: 24 January 1848. Marshall, the sawmill, something shines. Gold.
const Mill: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const shine = B.on(2, 'shines'), gold = B.on(3, 'Gold');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.06, focus: [820, 760], shakes: B.k === 3 ? [{ at: B.at(3, 'Gold'), amp: 8, len: 10 }] : [] }}>
        <Sky id="skyDawn" />
        <Layer depth={0.3}><Hills y={540} fill="#8FA070" amp={110} seed="ml1" /></Layer>
        <Layer depth={0.6}>{[[150, 700, 2.2], [520, 690, 1.8], [1700, 700, 2.3]].map(([x, y, sc], i) => <Pine key={i} x={x} y={y} s={sc} c="#3E6B44" />)}</Layer>
        <Layer depth={1}>
          <Ground y={770} fill="#A79458" top="#B9A76A" />
          <path d="M-200 910 Q500 840 1000 900 T2200 880 V1200 H-200 Z" fill="#7FB7D8" stroke={OL} strokeWidth={4} />
          {[...Array(6)].map((_, i) => <path key={i} d={`M${(i * 380 + B.g * 2) % 2200 - 150} ${950 + (i % 3) * 30} q18 -12 36 0 t36 0`} stroke="#fff" strokeOpacity={0.6} strokeWidth={4} fill="none" />)}
          <g transform="translate(1270 790)">
            <rect x={-200} y={-210} width={400} height={210} fill="#C9A66B" stroke={OL} strokeWidth={5} />
            <path d="M-230 -210 L0 -320 L230 -210 Z" fill="#8A5A34" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
            {[-140, -70, 0, 70, 140].map((x) => <path key={x} d={`M${x} -210 V0`} stroke="#A8844A" strokeWidth={4} />)}
            <g transform={`translate(-250 -40) rotate(${B.g * 2})`}><circle r={92} fill="none" stroke="#6B4A2B" strokeWidth={12} />{[0, 45, 90, 135].map((a) => <path key={a} d="M-92 0 H92" transform={`rotate(${a})`} stroke="#6B4A2B" strokeWidth={8} />)}</g>
          </g>
          <Chibi x={760} y={880} s={0.95} outfit={{ top: '#6A5A3A', bottom: '#4A4A3A' }} hat="europe" beard pose={gold ? 'bothUp' : shine ? 'point' : 'hold'} item={shine ? undefined : 'hammer'} expr={gold ? 'shock' : shine ? 'calm' : 'determined'} talking={[]} seed="jm" flip />
          {shine && <g><Sparkle x={600} y={935} f={B.g} r={gold ? 54 : 34} c={GOLD} /><Sparkle x={660} y={960} f={B.g + 9} r={gold ? 30 : 18} c="#fff" /></g>}
          <HostS s={s} x={1700} y={930} scale={0.6} keys={[{ at: 0, arm: gold ? 'finger' : 'present', expr: gold ? 'grin' : 'smile' }]} />
        </Layer>
      </CameraRig>
      <Label text="January 24, 1848" x={520} y={290} at={B.at(0, 'January')} size={54} />
      {B.k >= 1 && <Label text="Sutter’s Mill, Coloma" x={1270} y={390} at={B.at(1, 'sawmill')} size={44} />}
      {B.k === 3 && <Label text="GOLD" x={400} y={520} at={B.at(3, 'Gold')} size={170} color={GOLD} rot={-4} />}
    </>
  );
};

// c076-c078: remember the novel? 338 years later it came true.
const Novel: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <Stage>
      <Pop k={B.pop(0, 'novel')} x={1000} y={450} rot={-4}>
        <rect x={-100} y={-140} width={200} height={280} rx={8} fill="#7A2E2E" stroke={OL} strokeWidth={6} /><rect x={-100} y={-140} width={26} height={280} fill="#5A1E1E" stroke={OL} strokeWidth={4} />
        <Txt x={12} y={-70} t="1510" size={46} c={GOLD} /><path d="M-30 20 q20 -40 60 -20 q30 20 10 50 q-40 30 -70 -30 Z" fill={GOLD} stroke={OL} strokeWidth={3} /><Txt x={12} y={110} t="a novel" size={24} c="#E8D8B0" font="Hand" />
      </Pop>
      <Pop k={B.pop(1, 'gold')} x={1250} y={460}><Nugget s={1.5} /><Sparkle x={40} y={-50} f={B.g} r={26} /></Pop>
      <DarkSign x={1050} y={760} k={B.pop(2, '338')} text="338 YEARS LATER" sub="1510 → 1848 · the made-up story came true" size={42} />
      <HostS s={s} x={1620} keys={[{ at: 0, arm: B.k === 2 ? 'present' : 'chin', expr: B.k === 2 ? 'grin' : 'smile' }]} />
    </Stage>
  );
};

// c079-c080: Sutter begged for secrecy. It lasted about five minutes.
const Secret: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const secs = B.k === 0 ? 300 : Math.round(interpolate(B.f, [6, 56], [300, 0], Easing.in));
  const out = B.k === 1 && secs === 0;
  return (
    <Stage>
      <Chibi x={1010} y={940} s={1.2} outfit={{ top: '#4A5A7A', bottom: '#3A3A44', trim: '#E2B13C' }} hat="europe" mustache pose={out ? 'shrug' : 'pray'} expr={out ? 'shock' : 'sad'} talking={[]} seed="su1" />
      <Sign x={1010} y={420} k={B.pop(0, 'secret')} text="“Shhh!”" size={54} />
      <Panel x={1300} y={300} w={300} h={170} k={B.pop(1, 0)} title="SECRET FOR"><Txt y={44} t={`${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`} size={72} c={out ? '#E4573D' : GOLD} /></Panel>
      <HostS s={s} x={1640} keys={[{ at: 0, arm: B.k === 0 ? 'present' : 'shrug', expr: 'grin' }]} />
    </Stage>
  );
};

// c081-c083: a shopkeeper named Sam Brannan buys every pick, pan and shovel.
const Brannan: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const items: [number, string, React.ReactNode, number, number][] = [[1, 'pick', <Pick s={0.8} />, 1180, 420], [2, 'pan', <Pan s={0.8} />, 1300, 620], [2, 'shovel', <Shovel s={1} />, 1190, 760]];
  return (
    <Stage>
      <Chibi x={980} y={940} s={1.2} outfit={{ top: '#3A5A3A', bottom: '#3A3A44', trim: '#E2B13C' }} hat="tophat" pose={B.k === 0 ? 'idle' : 'carry'} expr={B.k === 0 ? 'calm' : 'grin'} talking={[]} seed="sb1" />
      <Sign x={990} y={250} k={B.pop(0, 'Brannan')} text="SAM BRANNAN" sub="shopkeeper" size={36} />
      {items.map(([b, w, el, x, y], i) => <Pop key={i} k={B.pop(b, w)} x={x} y={y}>{el}<g transform="translate(60 -40) rotate(-10)"><rect x={-44} y={-18} width={88} height={34} rx={5} fill="#fff" stroke={RED} strokeWidth={4} /><Txt y={8} t="BOUGHT" size={20} c={RED} /></g></Pop>)}
      <HostS s={s} x={1660} keys={[{ at: 0, arm: B.k === 0 ? 'present' : 'finger', expr: 'smile' }]} />
    </Stage>
  );
};

// c084-c086: then, the story goes, he ran through San Francisco shouting about gold.
const Shout: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const x = interpolate(B.g, [0, B.gd - 20], [260, 1180]);
  const cry = B.on(2, 'Gold');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [960, 640] }}>
        <Sky />
        <Layer depth={0.5}>{[[160, '#C9A66B', 300], [470, '#B88A5A', 380], [800, '#D9C48C', 320], [1130, '#C9A66B', 400], [1470, '#B88A5A', 330], [1790, '#D9C48C', 360]].map(([bx, c, h], i) => <g key={i} transform={`translate(${bx} 800)`}><rect x={-150} y={-(h as number)} width={300} height={h as number} fill={c as string} stroke={OL} strokeWidth={5} /><rect x={-150} y={-(h as number) - 40} width={300} height={44} fill="#8A5A34" stroke={OL} strokeWidth={5} /><rect x={-36} y={-110} width={72} height={110} fill="#5A3E26" stroke={OL} strokeWidth={4} />{[-104, 60].map((wx) => <rect key={wx} x={wx} y={-(h as number) + 50} width={46} height={60} fill="#BFE0F0" stroke={OL} strokeWidth={4} />)}</g>)}</Layer>
        <Layer depth={1}>
          <Ground y={800} fill="#B9A27A" top="#C9B48A" />
          {[[520, 860], [1420, 870], [1620, 850]].map(([px, py], i) => <Chibi key={i} x={px} y={py} s={0.85} outfit={{ top: ['#7A4A3A', '#4A5A6A', '#6A5A3A'][i], bottom: '#4A4A3A' }} hat={['cap', 'europe', 'hair'][i]} pose={cry ? 'bothUp' : 'idle'} expr={cry ? 'shock' : 'calm'} talking={[]} seed={'tw' + i} flip={px > x} />)}
          <g>
            <Chibi x={x} y={900} s={1} outfit={{ top: '#3A5A3A', bottom: '#3A3A44', trim: '#E2B13C' }} hat="tophat" pose="raise" legs="walk" expr="grin" talking={cry ? [[0, 60]] : []} seed="sb2" />
            <g transform={`translate(${x + 62} ${900 - 250 + Math.sin(B.g / 3) * 8}) rotate(${Math.sin(B.g / 3) * 14})`}><rect x={-12} y={-34} width={24} height={52} rx={6} fill="#CFE8F0" stroke={OL} strokeWidth={3.5} /><rect x={-10} y={-8} width={20} height={24} rx={4} fill={GOLD} /><rect x={-7} y={-46} width={14} height={14} fill="#A8744A" stroke={OL} strokeWidth={3} /></g>
          </g>
          <HostS s={s} x={1760} y={940} scale={0.58} keys={[{ at: 0, arm: 'point', expr: 'grin' }]} />
        </Layer>
      </CameraRig>
      <Label text="San Francisco, 1848 (as the story goes)" x={640} y={250} at={B.at(0, 'story')} size={42} />
      {B.k === 2 && <Label text="“Gold! Gold from the American River!”" x={860} y={390} at={B.at(2, 'Gold')} size={64} color={GOLD} rot={-2} />}
    </>
  );
};

// c087-c088: San Francisco, about 1,000 people. Two years later, 25,000.
const Boom: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const n = B.k === 0 ? 1000 : interpolate(B.f, [6, 50], [1000, 25000], Easing.out);
  const houses = B.k === 0 ? 1 : Math.round(interpolate(B.f, [6, 50], [1, 15]));
  return (
    <Stage>
      <Panel x={1160} y={370} w={460} h={270} title={`SAN FRANCISCO · ${B.k === 0 ? 1848 : 1850}`}><Txt y={56} t={fmt(n)} size={104} c={GOLD} /><Txt y={104} t="people" size={28} c="#CFC6B2" /></Panel>
      {[...Array(15)].map((_, i) => (i < houses ? <House key={i} x={970 + (i % 5) * 96} y={700 + Math.floor(i / 5) * 96} s={0.42} c={['#EFE3C4', '#D9C48C', '#E7CFA0'][i % 3]} /> : null))}
      <HostS s={s} x={1640} keys={[{ at: 0, arm: B.k === 0 ? 'present' : 'point', expr: B.k === 0 ? 'smile' : 'shock' }]} />
    </Stage>
  );
};

// c089-c091: sailors ran for the hills; hundreds of ships rotted in the bay; some became hotels.
const Ships: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const run = interpolate(B.g, [10, 150], [0, 1]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [900, 620] }}>
        <Sky />
        <Layer depth={0.3}><Hills y={520} fill="#C9B46A" amp={120} seed="sh1" /></Layer>
        <Layer depth={0.6}>
          <rect x={-200} y={560} width={2400} height={700} fill={SEA} />
          {[[200, 640, 0.5, -7], [520, 620, 0.45, 5], [820, 650, 0.55, -4], [1120, 625, 0.45, 8], [330, 760, 0.8, 6], [900, 790, 0.9, -8]].map(([x, y, sc, r], i) => <Galleon key={i} x={x} y={y} s={sc} rot={r} flag="#8A8A90" />)}
        </Layer>
        <Layer depth={1}>
          <path d="M1150 1200 L1240 800 Q1600 740 2200 780 V1200 Z" fill="#E7D5A2" stroke={OL} strokeWidth={4} />
          {[0, 1, 2, 3].map((i) => <Chibi key={i} x={1260 + i * 70 + run * 900} y={900 + (i % 2) * 40} s={0.7} outfit={{ top: ['#2F4A7A', '#F4F4F0', '#7A4A3A', '#2F4A7A'][i], bottom: '#3A3A44' }} hat={i % 2 ? 'cap' : 'hair'} pose="bothUp" legs="walk" expr="grin" talking={[]} seed={'sl' + i} />)}
          <Pop k={B.pop(2, 'hotels')} x={1560} y={850}>
            <g transform="translate(-1560 -850)"><Galleon x={1560} y={850} s={0.9} rot={0} flag={GOLD} /></g>
            <g transform="translate(0 -250)"><rect x={-90} y={-30} width={180} height={60} rx={8} fill={PAPER} stroke={OL} strokeWidth={5} /><Txt y={14} t="HOTEL" size={38} c={RED} /></g>
          </Pop>
          <HostS s={s} x={600} y={1000} scale={0.5} keys={[{ at: 0, arm: 'point', expr: 'smile' }]} />
        </Layer>
      </CameraRig>
      {B.k >= 1 && <Label text="hundreds of empty ships" x={620} y={300} at={B.at(1, 'Hundreds')} size={52} />}
    </>
  );
};

// c092-c094: they came from everywhere. About 300,000 people in seven years.
const FROM: { w: string; name: string; iso: string; ll: [number, number] }[] = [
  { w: 'China', name: 'CHINA', iso: 'CHN', ll: [113.3, 23.1] }, { w: 'Chile', name: 'CHILE', iso: 'CHL', ll: [-71.6, -33] }, { w: 'Mexico', name: 'MEXICO', iso: 'MEX', ll: [-110, 29] },
  { w: 'Australia', name: 'AUSTRALIA', iso: 'AUS', ll: [151.2, -33.9] }, { w: 'France', name: 'FRANCE', iso: 'FRA', ll: [0.1, 49.5] },
];
const World: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const lam = interpolate(B.g, [0, B.gd * 0.8], [120, -112], Easing.inOut);
  const seen = FROM.filter((o) => B.on(1, o.w));
  return (
    <>
      <Globe data={D} lam0={lam} phi0={18} R={390} cx={1120} cy={520} points={[...seen.map((o) => ({ ll: o.ll, color: '#E8862A' })), { ll: [-122.4, 37.8] as [number, number], color: RED }]} fill={(c) => (seen.some((o) => o.iso === c.iso) ? '#F3B562' : '#E8DFC6')} />
      <Full>
        <Tag x={60} y={200} anchor="start" text="THEY CAME FROM EVERYWHERE" k={springPop(B.g, 6)} size={34} />
        {FROM.map((o, i) => <Tag key={o.w} x={60} y={280 + i * 68} anchor="start" text={o.name} k={B.pop(1, o.w)} size={30} bg={PAPER} c="#1A1410" />)}
        <Tag x={60} y={660} anchor="start" text="≈ 300,000 PEOPLE IN 7 YEARS" k={B.pop(2, '300,000')} size={38} bg={RED} />
        <Rider x={1700} y={300} arm="point" expr="grin" talking={talk(s)} flip />
      </Full>
    </>
  );
};

// c095-c096: an egg could cost a dollar; a shovel, a small fortune.
const Prices: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <Stage>
      <Pop k={B.pop(0, 'egg')} x={1010} y={470}><Egg s={1.6} /></Pop>
      <DarkSign x={1010} y={640} k={B.pop(0, 'dollar')} text="$1" sub="for one egg" size={62} />
      <Pop k={B.pop(1, 'shovel')} x={1290} y={440}><Shovel s={1.3} /></Pop>
      <DarkSign x={1290} y={690} k={B.pop(1, 'fortune')} text="$ $ $" sub="a small fortune" size={50} />
      <HostS s={s} x={1660} keys={[{ at: 0, arm: B.k === 0 ? 'present' : 'shrug', expr: 'grin' }]} />
    </Stage>
  );
};

// c097-c098: California skipped the waiting line. 1850, the 31st state.
const Statehood: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const t = interpolate(B.g, [14, 64], [0, 1], Easing.inOut);
  return (
    <Stage>
      <Sign x={1060} y={270} k={springPop(B.g, 4)} text="THE WAITING LINE" sub="territories wait here" size={30} />
      {[0, 1, 2, 3].map((i) => <Person key={i} x={960 + i * 80} y={760} s={1.4} c="#B8B4A8" />)}
      <g transform={`translate(${920 + t * 420} ${700 - 4 * 260 * t * (1 - t)}) rotate(${t * 360})`}><CaShape x={0} y={0} h={150} fill={GOLD} sw={4} /></g>
      <DarkSign x={1130} y={900} k={B.pop(1, '31st')} text="1850 · THE 31st STATE" size={38} />
      <HostS s={s} x={1660} keys={[{ at: 0, arm: B.k === 0 ? 'point' : 'present', expr: 'grin' }]} />
    </Stage>
  );
};

// c099-c107 (quiet): around 150,000 Native people; by 1870 about 30,000. A genocide; an apology in 2019.
const QuietGold: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const lost = B.k < 2 ? 0 : B.k > 2 ? 1 : interpolate(B.f, [20, 110], [0, 1]);
  const dots = B.k < 1 ? 0 : B.k > 1 ? 1 : fade(B.f, 6, 40);
  const late = B.k >= 5;
  return (
    <Quiet>
      <path d="M0 880 Q300 780 620 850 T1240 820 T1920 860 V1080 H0 Z" fill="#12151A" />
      <g opacity={late ? 0.07 : 1}>
        {[...Array(150)].map((_, i) => { const keep = i >= 120; return <circle key={i} cx={1020 + (i % 15) * 46} cy={290 + Math.floor(i / 15) * 46} r={13} fill="#D9C9A8" opacity={dots * (keep ? 1 : 1 - lost * 0.9)} />; })}
        <text x={150} y={430} fontFamily={SERIF} fontSize={120} fill="#E8E2D4" opacity={dots}>150,000</text>
        <text x={150} y={490} fontFamily={SERIF} fontSize={34} fill="#A8A294" opacity={dots}>Native people in California, 1848</text>
        <text x={150} y={640} fontFamily={SERIF} fontSize={120} fill="#E8E2D4" opacity={B.k < 2 ? 0 : B.k > 2 ? 1 : fade(B.f, 40, 40)}>30,000</text>
        <text x={150} y={700} fontFamily={SERIF} fontSize={34} fill="#A8A294" opacity={B.k < 2 ? 0 : B.k > 2 ? 1 : fade(B.f, 40, 40)}>by 1870</text>
      </g>
      {late && <g>
        <text x={960} y={400} textAnchor="middle" fontFamily={SERIF} fontSize={54} fill="#A8A294" opacity={B.k > 5 ? 1 : fade(B.f, 6, 30)}>2019</text>
        <text x={960} y={560} textAnchor="middle" fontFamily={SERIF} fontSize={110} fill="#E8E2D4" opacity={B.k < 7 ? 0 : B.k > 7 ? 1 : fade(B.f, 2, 26)}>A genocide.</text>
        <text x={960} y={680} textAnchor="middle" fontFamily={SERIF} fontSize={50} fill="#A8A294" opacity={B.k < 8 ? 0 : fade(B.f, 4, 26)}>And an apology.</text>
      </g>}
    </Quiet>
  );
};

// c108-c113: the men who started it all. Sutter and Marshall both died poor.
const Men: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <Stage>
      <Board x={1100} y={230} w={420} at={B.at(0, 4)} rows={[
        { label: 'SUTTER · LANDOWNER', show: B.at(1, 'Sutter'), mark: B.at(3, 'died') },
        { label: 'MARSHALL · FINDER', show: B.at(4, 'Marshall'), mark: B.at(5, 'autograph') },
      ]} />
      <Sign x={1100} y={720} k={B.pop(3, 'Congress')} text="died still asking Congress for help" size={24} />
      <Sign x={1100} y={800} k={B.pop(5, 'autograph')} text="sold his own autograph to get by" size={24} />
      <HostS s={s} x={1640} keys={[{ at: 0, arm: B.k === 0 ? 'present' : 'idle', expr: 'worried' }]} />
    </Stage>
  );
};

// c114-c118: so who did get rich? Remember the shopkeeper.
const Who: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <Stage>
      <Board x={1080} y={230} w={400} at={-999} question={B.at(2, 'who')} rows={[
        { label: 'THE FINDER', show: -999, mark: B.at(0, 'finder') },
        { label: 'THE LANDOWNER', show: -999, mark: B.at(1, 'landowner') },
      ]} />
      <Pop k={B.pop(3, 'shopkeeper')} x={1360} y={640} rot={12}><Shovel s={1.1} c={GOLD} /></Pop>
      <Sign x={1100} y={820} k={B.pop(3, 'shopkeeper')} text="THE SHOPKEEPER…" size={34} rot={-3} />
      <HostS s={s} x={1660} keys={[{ at: 0, arm: B.k >= 3 ? 'finger' : B.k === 2 ? 'shrug' : 'present', expr: B.k >= 3 ? 'grin' : 'smile' }]} />
    </Stage>
  );
};

export const SHOTS_GOLD: ShotMap = { gd_mill: Mill, gd_novel: Novel, gd_secret: Secret, gd_brannan: Brannan, gd_shout: Shout, gd_boom: Boom, gd_ships: Ships, gd_world: World, gd_prices: Prices, gd_state: Statehood, gd_quiet: QuietGold, gd_men: Men, gd_who: Who };
