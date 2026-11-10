/** Mexico (2:51 to 4:05): the flag change, ranchos, Americans trickle in, the Bear Flag republic, and the worst timing in history. */
import React from 'react';
import { useCurrentFrame, interpolate, Easing, springPop } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Calendar } from '@engine/fx/Infographics';
import { Chibi } from '@engine/characters/Chibi';
import { OL, Hills, Cloud } from '@engine/scenes/Parts';
import { talk, wordAt, type ShotMap, type SP } from '@engine/kit';
import { Stage } from '@engine/moves';
import { P, camAt, moveCam, QC, Full, MapTag, FlowLines, WorldMap } from '@engine/qgis/QgisMap';
import { D, PAPER, RED, GOLD, Rider, OldWorld, CaShape } from './Kit';
import { Tag, useBeat, Pop, Txt, Sign, DarkSign, Panel, Sky, Ground, HostS, Cow, Bear, BearFlag, Sparkle } from './Kit2';

// c051-c052: 1821, California changes flags without a battle.
const FlagSwap: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const t = B.at(1, 'changes');
  const p = interpolate(B.f, [t, t + 34], [0, 1], Easing.inOut);
  const flag = (kind: 'es' | 'mx', yy: number, o: number) => (
    <g transform={`translate(1100 ${yy})`} opacity={o}>
      {kind === 'es' ? <><rect width={170} height={110} fill="#C8312B" /><rect y={27} width={170} height={56} fill="#F2C230" /></> : <><rect width={57} height={110} fill="#2E7D4F" /><rect x={57} width={57} height={110} fill="#F4F4F0" /><rect x={114} width={56} height={110} fill="#C8312B" /><circle cx={85} cy={55} r={15} fill="#8A5A34" stroke="#3B2A1A" strokeWidth={2} /></>}
      <rect width={170} height={110} fill="none" stroke={OL} strokeWidth={4} />
    </g>
  );
  return (
    <Stage>
      <CaShape x={1110} y={640} h={480} fill="#F3D9A0" />
      <line x1={1096} y1={190} x2={1096} y2={520} stroke="#5A3E26" strokeWidth={9} strokeLinecap="round" />
      {flag('es', 200 + p * 190, 1 - p)}
      {flag('mx', 390 - p * 190, p)}
      <DarkSign x={960} y={250} k={B.pop(0, '1821')} text="1821" size={54} />
      <Sign x={980} y={850} k={B.pop(1, 'without')} text="NO BATTLE" size={34} rot={-4} c={RED} />
      <HostS s={s} x={1560} keys={[{ at: 0, arm: B.k === 0 ? 'present' : 'shrug', expr: 'smile' }]} />
    </Stage>
  );
};

// c053-c055: missions closed, giant ranches, cattle, and hides as "California banknotes".
const Ranch: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [900, 640] }}>
        <Sky />
        <Layer depth={0.3}><Hills y={560} fill="#C9B46A" amp={80} seed="rn1" /><Cloud x={420} y={240} /><Cloud x={1420} y={270} s={0.8} /></Layer>
        <Layer depth={1}>
          <Ground y={760} fill="#B9A25A" top="#CDB870" />
          <g transform="translate(330 772)"><rect x={-170} y={-150} width={340} height={150} fill="#E7CFA0" stroke={OL} strokeWidth={5} /><path d="M-190 -150 h380 l-18 -40 h-344 Z" fill="#B5553A" stroke={OL} strokeWidth={5} strokeLinejoin="round" /><rect x={-26} y={-90} width={52} height={90} fill="#5A3E26" stroke={OL} strokeWidth={4} /><rect x={-130} y={-110} width={56} height={46} fill="#5A3E26" stroke={OL} strokeWidth={4} /></g>
          {[...Array(9)].map((_, i) => <rect key={i} x={560 + i * 150} y={690} width={12} height={90} fill="#8A5A34" stroke={OL} strokeWidth={3} />)}
          <path d="M560 715 H1772 M560 750 H1772" stroke="#8A5A34" strokeWidth={8} />
          {[[760, 900, 1], [1040, 940, 1.15], [1300, 890, 0.95]].map(([x, y, sc], i) => <Pop key={i} k={B.pop(1, i * 5)} x={x} y={y}><Cow x={0} y={0} s={sc} flip={i === 1} c={['#8A5A3A', '#5A3E26', '#B88A5A'][i]} /></Pop>)}
          {[0, 1, 2].map((i) => <Pop key={i} k={B.pop(2, 'hides') > 0 ? Math.max(0, springPop(B.f, B.at(2, 'hides') + i * 5)) : 0} x={760 + i * 190} y={470} rot={[-5, 3, -2][i]}>
            <path d="M-60 -70 L-30 -54 L0 -66 L30 -54 L60 -70 L50 -20 L64 30 L30 40 L24 70 L0 56 L-24 70 L-30 40 L-64 30 L-50 -20 Z" fill="#B88A5A" stroke={OL} strokeWidth={4} strokeLinejoin="round" />
            <Txt y={18} t="$" size={56} c="#3B2A1A" />
          </Pop>)}
          <DarkSign x={950} y={610} k={B.pop(2, 'banknotes')} text="“CALIFORNIA BANKNOTES”" size={34} />
          <HostS s={s} x={1660} y={930} scale={0.62} keys={[{ at: 0, arm: B.k === 2 ? 'finger' : 'present', expr: 'smile' }]} />
        </Layer>
      </CameraRig>
      <Label text="giant ranchos" x={420} y={330} at={B.at(0, 'ranches')} size={54} />
    </>
  );
};

// c056-c057: the Americans trickle in, first by ship, then by wagon over the mountains.
const SHIP_IN: [number, number][] = [[-112, 18], [-118, 28], [-121.9, 36.6]];
const TRAIL: [number, number][] = [[-94.4, 39.1], [-104.8, 41.1], [-112.4, 42.9], [-117.7, 40.9], [-120.2, 39.3], [-121.5, 38.6]];
const Trickle: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const cam = moveCam(B.g, camAt(-116, 33, 4.2), camAt(-108, 38, 3.6), 10, B.gd - 20);
  return (
    <>
      <OldWorld cam={cam}>
        <FlowLines pts={SHIP_IN.map((p) => P(...p))} cam={cam} start={B.loc(14)} step={26} bend={-0.15} color="#2F6F9F" done="#2F6F9F" />
        <FlowLines pts={TRAIL.map((p) => P(...p))} cam={cam} start={B.loc(B.gAt(1, 'wagon'))} step={12} bend={0.06} />
      </OldWorld>
      <Full>
        <Tag x={60} y={200} anchor="start" text="THE AMERICANS TRICKLE IN" k={springPop(B.g, 6)} size={34} />
        <Tag x={60} y={280} anchor="start" text="FIRST BY SHIP" k={B.pop(1, 'ship')} size={30} bg="#2F6F9F" />
        <Tag x={60} y={360} anchor="start" text="1841 · BY WAGON, OVER THE MOUNTAINS" k={B.pop(1, 'wagon')} size={30} bg={RED} />
        <Rider x={1580} y={430} arm="point" expr="grin" talking={talk(s)} flip />
      </Full>
    </>
  );
};

// c058-c060: about thirty settlers march into Sonoma, arrest the general, and declare a republic.
const Sonoma: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const march = interpolate(B.g, [0, 90], [-520, 0], Easing.out);
  const arrest = B.on(1, 'arrested');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [1000, 640] }}>
        <Sky id="skyDawn" />
        <Layer depth={0.3}><Hills y={580} fill="#B9A76A" amp={70} seed="sn1" /></Layer>
        <Layer depth={1}>
          <Ground y={800} fill="#C8B078" top="#D9C48C" />
          <g transform="translate(1260 812)"><rect x={-260} y={-230} width={520} height={230} fill="#EADBB8" stroke={OL} strokeWidth={5} /><path d="M-284 -230 h568 l-22 -50 h-524 Z" fill="#B5553A" stroke={OL} strokeWidth={5} strokeLinejoin="round" /><rect x={-40} y={-130} width={80} height={130} fill="#5A3E26" stroke={OL} strokeWidth={4} />{[-170, 130].map((x) => <rect key={x} x={x} y={-160} width={60} height={70} fill="#3B2A1A" stroke={OL} strokeWidth={4} />)}<rect x={-260} y={-110} width={520} height={12} fill="#8A5A34" stroke={OL} strokeWidth={3} /></g>
          {[...Array(6)].map((_, i) => <Chibi key={i} x={250 + i * 105 + march} y={870 + (i % 2) * 30} s={0.85} outfit={{ top: ['#6A5A3A', '#4A5A6A', '#7A4A3A'][i % 3], bottom: '#5A4A3A' }} hat={i % 2 ? 'europe' : 'cap'} beard={i % 3 === 0} pose={arrest ? (i === 5 ? 'point' : 'fist') : 'idle'} legs={B.g < 90 ? 'walk' : 'stand'} expr="determined" talking={[]} seed={'st' + i} />)}
          <Chibi x={1100} y={850} s={0.95} outfit={{ top: '#2F4A7A', bottom: '#E8E0D0', trim: '#E2B13C' }} hat="bicorne" mustache pose={arrest ? 'shrug' : 'idle'} expr={arrest ? 'shock' : 'calm'} talking={[]} seed="vj" flip />
          <DarkSign x={900} y={420} k={B.pop(2, 'California')} text="THE CALIFORNIA REPUBLIC" size={54} />
          <HostS s={s} x={1730} y={940} scale={0.6} keys={[{ at: 0, arm: B.k === 2 ? 'present' : 'point', expr: 'smile' }]} />
        </Layer>
      </CameraRig>
      <Label text="Sonoma, June 1846" x={520} y={300} at={B.at(0, 'Sonoma')} size={54} />
      {B.k === 1 && <Label text="General Vallejo" x={1100} y={430} at={B.at(1, 'general')} size={44} />}
    </>
  );
};

// c061-c062: the flag. A grizzly painted on cotton that looked more like a pig.
const FlagPaint: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const p0 = B.at(0, 'painted');
  return (
    <Stage>
      <BearFlag x={1100} y={520} s={1.12} paint={interpolate(B.f, [p0, p0 + 40], [0, 1])} wave={Math.sin(B.g / 14) * 1.2} />
      <Sign x={1100} y={770} k={B.pop(1, 'pig')} text="…A PIG?" size={46} rot={-5} c={RED} />
      <HostS s={s} x={1600} keys={[{ at: 0, arm: B.k === 0 ? 'present' : 'chin', expr: B.k === 0 ? 'smile' : 'grin' }]} />
    </Stage>
  );
};

// c063-c064: the republic lasted 25 days, then the US Navy arrived.
const Days: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const d = Math.round(interpolate(B.g, [6, 60], [1, 25], Easing.out));
  return (
    <Stage>
      <Panel x={1100} y={400} w={400} h={270} title="THE REPUBLIC LASTED"><Txt y={62} t={`${d} DAYS`} size={92} c={GOLD} /></Panel>
      <Pop k={B.pop(1, 'Navy')} x={1010} y={690}>
        <rect x={-100} y={-60} width={200} height={120} fill="#F4F4F0" stroke={OL} strokeWidth={4} />
        {[0, 2, 4, 6].map((i) => <rect key={i} x={-100} y={-60 + i * 17.2} width={200} height={17.2} fill="#C8312B" />)}
        <rect x={-100} y={-60} width={86} height={66} fill="#2F4A7A" />
        <rect x={-100} y={-60} width={200} height={120} fill="none" stroke={OL} strokeWidth={4} />
      </Pop>
      <Sign x={1110} y={850} k={B.pop(1, 'thanks')} text="“THANKS. WE’LL TAKE IT FROM HERE.”" size={28} rot={-2} />
      <HostS s={s} x={1620} keys={[{ at: 0, arm: B.k === 0 ? 'present' : 'shrug', expr: 'grin' }]} />
    </Stage>
  );
};

// c065-c067: the bear is still on the flag. The California grizzly is extinct.
const Grizzly: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const gone = B.at(1, 'Extinct');
  return (
    <Stage>
      <BearFlag x={990} y={330} s={0.62} />
      <g transform="translate(1110 700)"><Bear s={1.7} o={interpolate(B.f, [gone, gone + 30], [1, 0.25])} /></g>
      <Sign x={1110} y={690} k={B.pop(1, 'Extinct')} text="EXTINCT" size={60} rot={-8} c={RED} stroke={RED} />
      <DarkSign x={1110} y={880} k={B.pop(2, '1922')} text="LAST ONE SHOT: 1922" size={32} />
      <HostS s={s} x={1620} keys={[{ at: 0, arm: B.k === 0 ? 'finger' : 'idle', expr: B.k === 0 ? 'smile' : 'worried' }]} />
    </Stage>
  );
};

// c068: watch the dates.
const Dates: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <Stage>
      <Sign x={1100} y={400} k={B.pop(0, 'dates')} text="WATCH THE DATES" size={46} />
      <DarkSign x={1100} y={560} k={B.pop(0, 'worst')} text="THE WORST TIMING IN HISTORY" size={34} rot={-2} />
      <HostS s={s} x={1620} keys={[{ at: 0, arm: 'finger', expr: 'smile' }]} />
    </Stage>
  );
};

// c069: 2 February 1848, Mexico hands California (and much more) to the United States.
const CEDED = ['California', 'Nevada', 'Utah', 'Arizona', 'New Mexico'];
const Cession: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const cam = moveCam(f, camAt(-104, 36, 3.4), camAt(-112, 37, 4.6), 0, 60);
  const t = wordAt(s, 'hands');
  return (
    <>
      <WorldMap data={D} cam={cam} fill={(c) => (c.iso === 'MEX' ? '#9CC9A0' : c.iso === 'USA' ? '#EFE3C4' : QC.land)}>
        {D.provinces.USA.filter((p) => CEDED.includes(p.name)).map((p, i) => (
          <g key={p.name}>
            <path d={p.d} fill="#9CC9A0" stroke={QC.ink} strokeWidth={2 / cam.z} />
            <path d={p.d} fill={p.name === 'California' ? GOLD : '#A9C4E8'} fillOpacity={interpolate(f, [t + i * 6, t + i * 6 + 16], [0, 1])} stroke={QC.ink} strokeWidth={2 / cam.z} />
          </g>
        ))}
      </WorldMap>
      <Full>
        <Tag x={60} y={200} anchor="start" text="FEBRUARY 2, 1848 · TREATY SIGNED" k={springPop(f, 6)} size={34} />
        <Tag x={60} y={280} anchor="start" text="MEXICO → UNITED STATES" k={springPop(f, t)} size={32} bg={RED} />
        <Tag x={60} y={352} anchor="start" text="shown with today’s state lines" k={springPop(f, t + 20) * 0.8} size={24} bg={PAPER} c="#3B2A1A" />
        <Rider x={1600} y={430} arm="point" expr="worried" talking={talk(s)} flip />
      </Full>
    </>
  );
};

// c070-c071: nine days earlier, a carpenter looked down into a river.
const Nine: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const flip = B.at(0, 'Nine');
  return (
    <Stage>
      <Calendar x={1090} y={470} s={0.72} month="JANUARY" day={24} year={1848} flipAt={flip} from={{ month: "FEBRUARY", day: 2 }} color="#2F4A7A" glow={B.on(0, 'Nine') ? 0.6 : 0} />
      <DarkSign x={1090} y={760} k={B.pop(0, 'earlier')} text="9 DAYS EARLIER" size={40} />
      {B.on(1, 'water') && <Sparkle x={1090} y={880} f={B.f} r={40} c={GOLD} />}
      <HostS s={s} x={1620} keys={[{ at: 0, arm: B.k === 0 ? 'finger' : 'chin', expr: 'grin' }]} />
    </Stage>
  );
};

export const SHOTS_MEXICO: ShotMap = { mx_flag: FlagSwap, mx_ranch: Ranch, mx_trickle: Trickle, mx_sonoma: Sonoma, mx_paint: FlagPaint, mx_days: Days, mx_grizzly: Grizzly, mx_dates: Dates, mx_cession: Cession, mx_nine: Nine };
