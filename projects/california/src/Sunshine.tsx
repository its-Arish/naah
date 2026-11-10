/** Sunshine (7:20 to 9:13): railroad adverts, the $1 ticket, Los Angeles, the 1906 earthquake (quiet), the aqueduct, Hollywood. */
import React from 'react';
import { interpolate, Easing, springPop } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { OL, Hills, Cloud } from '@engine/scenes/Parts';
import { talk, type ShotMap, type SP } from '@engine/kit';
import { Stage } from '@engine/moves';
import { P, camAt, moveCam, toScreen, Full, MapTag } from '@engine/qgis/QgisMap';
import { PAPER, RED, GOLD, Rider, OldWorld } from './Kit';
import { Tag, useBeat, Pop, Txt, Sign, DarkSign, Panel, Sky, Ground, HostS, Quiet, fade, fmt, Loco, Orange, Person, WaterDrop, FilmCam, House, Jalopy } from './Kit2';

const SERIF = "Georgia, 'Times New Roman', serif";

// c148-c154: the trains needed passengers, so the railroads advertised a place.
const Poster: React.FC<{ title: string; sub: string; c: string }> = ({ title, sub, c }) => (
  <g>
    <rect x={-130} y={-170} width={260} height={340} rx={8} fill={c} stroke={OL} strokeWidth={6} />
    <circle cx={0} cy={-70} r={56} fill="#FFD84A" stroke={OL} strokeWidth={4} />
    <path d="M-130 20 Q-60 -40 0 10 T130 -10 V60 H-130 Z" fill="#6FA35A" stroke={OL} strokeWidth={4} />
    <g transform="translate(-50 36)"><Orange s={0.8} /></g><g transform="translate(20 46)"><Orange s={0.9} /></g>
    <rect x={-130} y={84} width={260} height={86} fill={PAPER} stroke={OL} strokeWidth={5} />
    <Txt y={122} t={title} size={30} c={RED} /><Txt y={154} t={sub} size={19} />
  </g>
);
const Ads: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const posters = B.k >= 3;
  return (
    <Stage>
      {!posters && <g>
        <path d="M860 720 H1400" stroke="#5A5A66" strokeWidth={8} />{[...Array(8)].map((_, i) => <rect key={i} x={872 + i * 70} y={712} width={14} height={30} fill="#6B4A2B" stroke={OL} strokeWidth={2.5} />)}
        <Loco x={1120} y={712} s={1.2} f={B.g} />
        <Sign x={1120} y={320} k={B.pop(0, 'passengers')} text="EMPTY SEATS" size={38} c={RED} rot={-3} />
        <DarkSign x={1120} y={860} k={B.pop(2, 'advertised')} text="SELL THE PLACE" size={36} />
      </g>}
      {posters && <g>
        <Pop k={B.pop(3, 'Posters')} x={1000} y={470} rot={-4}><Poster title="CALIFORNIA" sub="LAND OF SUNSHINE" c="#F2A64A" /></Pop>
        <Pop k={B.pop(4, 'crates')} x={1290} y={500} rot={5}><Poster title="ORANGES" sub="PACKED IN PARADISE" c="#7FB7D8" /></Pop>
        <Sign x={1140} y={760} k={B.pop(5, 'California')} text="COME TO CALIFORNIA" size={40} />
        <DarkSign x={1140} y={880} k={B.pop(6, 'summer')} text="SUMMER ALL YEAR" size={36} rot={-2} />
      </g>}
      <HostS s={s} x={1680} keys={[{ at: 0, arm: posters ? 'present' : B.k === 2 ? 'finger' : 'idle', expr: posters ? 'grin' : 'smile' }]} />
    </Stage>
  );
};

// c155-c156: during one price war, Kansas City to Los Angeles dropped to one dollar.
const Ticket: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <Stage>
      <Sign x={1120} y={280} k={B.pop(0, 'price')} text="PRICE WAR" size={40} c={RED} rot={-3} />
      <Pop k={B.pop(1, 'ticket')} x={1120} y={520} rot={-3}>
        <path d="M-270 -110 H270 V-30 A30 30 0 0 0 270 30 V110 H-270 V30 A30 30 0 0 0 -270 -30 Z" fill={PAPER} stroke={OL} strokeWidth={6} strokeLinejoin="round" />
        <path d="M120 -100 V100" stroke={OL} strokeWidth={3} strokeDasharray="10 10" />
        <Txt x={-70} y={-40} t="KANSAS CITY" size={34} /><Txt x={-70} y={10} t="↓" size={40} /><Txt x={-70} y={64} t="LOS ANGELES" size={34} />
        <g transform={`translate(196 16) scale(${Math.max(0.001, B.pop(1, 'one'))})`}><Txt t="$1" size={86} c={RED} /></g>
      </Pop>
      <HostS s={s} x={1680} keys={[{ at: 0, arm: B.k === 0 ? 'present' : 'shrug', expr: 'grin' }]} />
    </Stage>
  );
};

// c157-c158: Los Angeles, under 6,000 people in 1870; over a million by 1930.
const LosAngeles: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const n = B.k === 0 ? 5700 : interpolate(B.f, [6, 56], [5700, 1238000], Easing.in);
  const bar = B.k === 0 ? 0.02 : interpolate(B.f, [6, 56], [0.02, 1], Easing.in);
  return (
    <Stage>
      <Panel x={1180} y={360} w={480} h={270} title={`LOS ANGELES · ${B.k === 0 ? 1870 : 1930}`}><Txt y={56} t={B.k === 0 ? 'under 6,000' : fmt(n)} size={B.k === 0 ? 68 : 84} c={GOLD} /><Txt y={104} t="people" size={28} c="#CFC6B2" /></Panel>
      <rect x={960} y={880 - 300 * bar} width={440} height={300 * bar} fill="#E8862A" stroke={OL} strokeWidth={5} />
      <path d="M940 880 H1420" stroke={OL} strokeWidth={6} />
      <HostS s={s} x={1680} keys={[{ at: 0, arm: B.k === 0 ? 'present' : 'point', expr: B.k === 0 ? 'smile' : 'shock' }]} />
    </Stage>
  );
};

// c159-c165 (quiet): San Francisco, 18 April 1906. Earthquake, three days of fire, about 3,000 dead; rebuilt in under ten years.
const SKY_LINE: [number, number, number][] = [[140, 150, 260], [300, 120, 380], [430, 170, 300], [610, 110, 460], [730, 190, 330], [930, 130, 400], [1070, 160, 290], [1240, 120, 430], [1370, 180, 310], [1560, 130, 370], [1700, 160, 280]];
const Quake: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const shakeAt = B.at(2, 'earthquake');
  const sh = B.k === 2 && B.f >= shakeAt && B.f < shakeAt + 16 ? Math.sin(B.f * 2.4) * 7 : 0;
  const fire = B.k < 3 ? 0 : B.k >= 6 ? 0 : B.k === 3 ? fade(B.f, 6, 50) : 1;
  const gone = B.k < 5 ? 0 : B.k > 5 ? 1 : fade(B.f, 4, 40);
  const rebuilt = B.k < 6 ? 0 : fade(B.f, 6, 50);
  return (
    <Quiet tone={rebuilt > 0.5 ? '#2A3440' : '#1B1F26'}>
      <rect width={1920} height={1080} fill="#B5452B" opacity={fire * 0.28} />
      <g transform={`translate(${sh} 0)`}>
        {SKY_LINE.map(([x, w, h], i) => { const lost = i % 5 !== 2; return <rect key={i} x={x} y={860 - h} width={w} height={h} fill={rebuilt > 0 ? '#5A6878' : '#0E1014'} stroke="#3A4048" strokeWidth={3} opacity={lost ? Math.max(1 - gone * 0.85, rebuilt) : 1} />; })}
        <rect x={0} y={860} width={1920} height={220} fill="#0E1014" />
        {B.k >= 2 && B.k < 6 && <path d="M700 1080 L760 980 L720 930 L800 860" stroke="#3A4048" strokeWidth={6} fill="none" />}
      </g>
      <text x={960} y={250} textAnchor="middle" fontFamily={SERIF} fontSize={72} fill="#E8E2D4" opacity={B.k < 1 ? 0 : B.k >= 6 ? 0 : B.k > 1 ? 1 : fade(B.f, 4, 30)}>April 18, 1906</text>
      <text x={960} y={340} textAnchor="middle" fontFamily={SERIF} fontSize={44} fill="#A8A294" opacity={B.k === 4 || B.k === 5 ? (B.k === 4 ? fade(B.f, 4, 30) : 1) : 0}>about 3,000 dead</text>
      <text x={960} y={250} textAnchor="middle" fontFamily={SERIF} fontSize={60} fill="#E8E2D4" opacity={rebuilt}>Rebuilt in under ten years</text>
    </Quiet>
  );
};

// c166-c167: a million people coming to a place with almost no water.
const Water: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <Stage>
      {[...Array(18)].map((_, i) => { const k = Math.max(0, springPop(B.f, B.at(1, 'million') + i * 2)); return k > 0 ? <g key={i} transform={`translate(${930 + (i % 6) * 60} ${470 + Math.floor(i / 6) * 100}) scale(${k})`}><Person x={0} y={0} s={1.1} /></g> : null; })}
      <DarkSign x={1080} y={300} k={B.pop(1, 'million')} text="1,000,000 PEOPLE" size={36} />
      <Pop k={B.pop(1, 'water')} x={1350} y={560}><WaterDrop s={1.3} /></Pop>
      <Sign x={1140} y={820} k={B.pop(1, 'water')} text="ALMOST NO WATER" size={38} c={RED} rot={-3} />
      <HostS s={s} x={1680} keys={[{ at: 0, arm: B.k === 0 ? 'present' : 'shrug', expr: B.k === 0 ? 'smile' : 'worried' }]} />
    </Stage>
  );
};

// c168-c171: Mulholland's aqueduct, 233 miles, reaches into Owens Valley and drinks the river.
const AQ: [number, number][] = [[-118.22, 36.98], [-117.98, 36.43], [-117.95, 36.1], [-118.17, 35.05], [-118.42, 34.6], [-118.49, 34.32], [-118.25, 34.05]];
const RIVER: [number, number][] = [[-118.75, 37.62], [-118.4, 37.36], [-118.22, 36.98], [-118.05, 36.6], [-117.98, 36.43]];
const Aqueduct: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const cam = moveCam(B.g, camAt(-118.0, 35.6, 21), camAt(-117.6, 35.7, 24), 0, B.gd);
  const t0 = B.gAt(0, 'aqueduct'), t1 = B.gAt(3, 'drank');
  const p = interpolate(B.g, [t0, t0 + 110], [0, 1], Easing.inOut);
  const dry = interpolate(B.g, [t1, t1 + 40], [0, 1]);
  const path = (pts: [number, number][]) => 'M' + pts.map((q) => P(...q)).map((q) => `${q[0]} ${q[1]}`).join('L');
  const la = toScreen(cam, ...P(-118.25, 34.05)), ov = toScreen(cam, ...P(-118.22, 36.98)), lake = P(-117.98, 36.4);
  return (
    <>
      <OldWorld cam={cam} ca="#F1E2B6">
        <path d={path(RIVER)} fill="none" stroke="#3F8FC8" strokeWidth={(7 - dry * 5.5) / cam.z} strokeLinecap="round" strokeLinejoin="round" opacity={1 - dry * 0.5} />
        <ellipse cx={lake[0]} cy={lake[1] + 0.5} rx={0.9 * (1 - dry * 0.7)} ry={1.5 * (1 - dry * 0.7)} fill="#3F8FC8" stroke="#1A1410" strokeWidth={1.5 / cam.z} />
        {p > 0 && <path d={path(AQ)} pathLength={1} fill="none" stroke={RED} strokeWidth={7 / cam.z} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" strokeLinejoin="round" />}
        <circle cx={P(-118.25, 34.05)[0]} cy={P(-118.25, 34.05)[1]} r={9 / cam.z} fill={GOLD} stroke="#1A1410" strokeWidth={2 / cam.z} />
      </OldWorld>
      <Full>
        <Tag x={60} y={200} anchor="start" text="THE LOS ANGELES AQUEDUCT" k={B.pop(0, 'aqueduct')} size={34} />
        <Tag x={60} y={282} anchor="start" text="233 MILES" k={B.pop(1, '233')} size={44} bg={RED} />
        <Tag x={la.x - 150} y={la.y + 20} text="LOS ANGELES" k={0.85} size={26} bg={PAPER} c="#1A1410" />
        <Tag x={ov.x - 170} y={ov.y} text="OWENS VALLEY" k={B.pop(2, 'Owens') * 0.85} size={26} bg={PAPER} c="#1A1410" />
        <Rider x={1640} y={420} arm="point" expr={B.k === 3 ? 'worried' : 'grin'} talking={talk(s)} flip />
      </Full>
    </>
  );
};

// c172-c175: 1913, the water arrives. "There it is. Take it."
const Speech: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const flow = interpolate(B.g, [10, 70], [0, 1], Easing.in);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [1100, 620] }}>
        <Sky />
        <Layer depth={0.3}><Hills y={520} fill="#C9B46A" amp={130} seed="sp1" /></Layer>
        <Layer depth={1}>
          <Ground y={800} fill="#C8B078" top="#D9C48C" />
          <path d="M1500 300 L1700 300 L1500 830 L1180 830 Z" fill="#B8B4A8" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
          <path d={`M1530 300 L1670 300 L${1670 - 200 * flow} ${300 + 530 * flow} L${1530 - 320 * flow} ${300 + 530 * flow} Z`} fill="#5FA8D8" stroke={OL} strokeWidth={3} />
          {flow >= 1 && [...Array(5)].map((_, i) => <path key={i} d={`M${1200 + i * 60 + (B.g % 20)} ${760 + (i % 2) * 30} q14 -10 28 0`} stroke="#fff" strokeWidth={4} fill="none" />)}
          <g transform="translate(700 850)"><rect x={-60} y={-110} width={120} height={110} fill="#8A5A34" stroke={OL} strokeWidth={5} /><rect x={-70} y={-122} width={140} height={16} fill="#6B4A2B" stroke={OL} strokeWidth={4} /></g>
          <Chibi x={700} y={800} s={0.95} outfit={{ top: '#3A3A44', bottom: '#2B2B33', trim: '#F4ECD8' }} hat="tophat" mustache pose={B.k >= 2 ? 'point' : 'idle'} expr="calm" talking={B.k >= 2 ? [[0, 40]] : []} seed="wm" />
          {[0, 1, 2, 3, 4].map((i) => <Chibi key={i} x={220 + i * 90} y={900 + (i % 2) * 30} s={0.75} outfit={{ top: ['#7A4A3A', '#4A5A6A', '#6A5A3A', '#3A5A3A', '#5A4A6A'][i], bottom: '#3A3A44' }} hat={['cap', 'tophat', 'hair', 'cap', 'europe'][i]} pose={B.k >= 2 ? 'cheer' : 'idle'} expr="happy" talking={[]} seed={'cr' + i} />)}
          <HostS s={s} x={1040} y={960} scale={0.55} keys={[{ at: 0, arm: 'point', expr: 'smile' }]} />
        </Layer>
      </CameraRig>
      <Label text="November 1913" x={460} y={270} at={B.at(0, '1913')} size={50} />
      {B.k >= 2 && <Label text="“There it is.”" x={760} y={400} at={B.at(2, 'There')} size={70} color={GOLD} />}
      {B.k === 3 && <Label text="“Take it.”" x={830} y={560} at={B.at(3, 'Take')} size={84} color={GOLD} rot={-3} />}
    </>
  );
};

// c176: Owens Lake dried into a bowl of dust.
const Owens: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const dry = interpolate(B.g, [10, B.gd - 10], [0, 1], Easing.inOut);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.04, zoomTo: 1, focus: [960, 700] }}>
        <Sky id="skyDust" />
        <Layer depth={0.3}><Hills y={520} fill="#B8A486" amp={160} seed="ow1" /></Layer>
        <Layer depth={1}>
          <Ground y={700} fill="#D2C3A0" top="#DDD0B0" />
          <ellipse cx={960} cy={860} rx={720} ry={150} fill="#C9B994" stroke={OL} strokeWidth={4} />
          {dry > 0.4 && <g opacity={interpolate(dry, [0.4, 1], [0, 1])} stroke="#8E7E5A" strokeWidth={4} fill="none"><path d="M500 840 l60 30 l-20 40 M760 800 l40 50 l60 -10 l30 50 M1100 820 l-30 50 l50 30 M1300 850 l50 -20 l40 40" /></g>}
          <ellipse cx={960} cy={860} rx={720 * (1 - dry * 0.94)} ry={150 * (1 - dry * 0.94)} fill="#5FA8D8" stroke={OL} strokeWidth={4} />
          {dry > 0.6 && [0, 1, 2].map((i) => { const t = (B.g + i * 16) % 48; return <circle key={i} cx={620 + i * 320 + t * 3} cy={800 - t * 2} r={30 + t} fill="#E8DCC0" opacity={0.4 * (1 - t / 48)} />; })}
        </Layer>
      </CameraRig>
      <Label text="Owens Lake" x={960} y={320} at={6} size={56} />
    </>
  );
};

// c177-c178: the insiders who had quietly bought the land where the water would arrive got very rich.
const Insiders: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <Stage>
      <Pop k={B.pop(0, 'insiders')} x={1090} y={470} rot={-4}>
        <rect x={-190} y={-150} width={380} height={300} rx={8} fill={PAPER} stroke={OL} strokeWidth={6} />
        <Txt y={-90} t="LAND DEED" size={40} c={RED} /><path d="M-140 -64 H140" stroke={OL} strokeWidth={3} />
        <Txt y={-14} t="San Fernando Valley" size={34} font="Hand" /><Txt y={40} t="bought cheap," size={28} font="Hand" /><Txt y={80} t="before the water came" size={28} font="Hand" />
        <circle cx={130} cy={104} r={26} fill="#B3261E" stroke={OL} strokeWidth={3} />
      </Pop>
      <DarkSign x={1100} y={800} k={B.pop(1, 'rich')} text="VERY, VERY RICH" size={44} rot={-2} />
      {B.on(1, 'rich') && [0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${900 + i * 100} ${930 - Math.abs(Math.sin((B.f + i * 7) / 8)) * 40})`}><circle r={24} fill={GOLD} stroke={OL} strokeWidth={4} /><Txt y={11} t="$" size={30} /></g>)}
      <HostS s={s} x={1680} keys={[{ at: 0, arm: B.k === 0 ? 'chin' : 'shrug', expr: B.k === 0 ? 'worried' : 'grin' }]} />
    </Stage>
  );
};

// c179-c183: people with cameras wanted sunshine and scenery. A quiet suburb called Hollywood.
const Hollywood: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const cards = [{ w: 'mountains', t: 'MOUNTAINS', c: '#A9C4E8' }, { w: 'desert', t: 'DESERT', c: '#E8D58A' }, { w: 'ocean', t: 'OCEAN', c: '#7FB7D8' }];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [900, 640] }}>
        <Sky />
        <Layer depth={0.1}><circle cx={1500} cy={260} r={150} fill="url(#sunGlow)" /><circle cx={1500} cy={260} r={70} fill="#FFD84A" stroke={OL} strokeWidth={4} /></Layer>
        <Layer depth={0.3}><Hills y={540} fill="#B8B06A" amp={140} seed="hw1" /><Cloud x={360} y={230} s={0.9} /></Layer>
        <Layer depth={1}>
          <Ground y={800} fill="#B9A862" top="#C9BA72" />
          {B.k >= 3 && [0, 1, 2, 3].map((i) => <Pop key={i} k={Math.max(0, springPop(B.f, B.at(3, 'suburb') + i * 4))} x={1150 + i * 150} y={810}><House x={0} y={0} s={0.8} c={['#EFE3C4', '#E7CFA0', '#F4ECD8', '#D9C48C'][i]} /></Pop>)}
          <FilmCam x={640} y={900} s={1} f={B.g} />
          <Chibi x={470} y={900} s={0.95} outfit={{ top: '#F4ECD8', bottom: '#6A5A3A', trim: '#3A3A44' }} hat="cap" pose={B.k >= 1 ? 'point' : 'idle'} expr="happy" talking={[]} seed="dir" />
          <HostS s={s} x={1740} y={950} scale={0.6} keys={[{ at: 0, arm: B.k === 4 ? 'present' : 'point', expr: B.k === 4 ? 'grin' : 'smile' }]} />
        </Layer>
      </CameraRig>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <Sign x={360} y={300} k={B.pop(1, 'sunshine')} text="SUNSHINE ALMOST EVERY DAY" size={30} bg="#FFD84A" />
        {cards.map((c, i) => <Sign key={c.w} x={250 + i * 240} y={400} k={B.pop(2, c.w)} text={c.t} size={28} bg={c.c} rot={[-3, 2, -2][i]} />)}
      </svg>
      {B.k === 4 && <Label text="Hollywood" x={1000} y={540} at={B.at(4, 'Hollywood')} size={130} color={GOLD} rot={-3} />}
    </>
  );
};

// c184-c185: new rush, same rule. And the next crowd arrived with nothing left to lose.
const RUSHES = ['1 · SOULS AND EMPIRE', '2 · GOLD', '3 · THE RAILROAD', '4 · WATER, LAND, MOVIES'];
const Rule: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <Stage>
      <Panel x={1110} y={430} w={480} h={400} k={springPop(B.g, 4)} title="THE RUSHES SO FAR">
        {RUSHES.map((r, i) => <g key={i} opacity={interpolate(B.g, [10 + i * 7, 18 + i * 7], [0, 1])}><Txt x={-200} y={-70 + i * 62} t={r} size={30} c={i === 3 ? GOLD : '#F4ECD8'} anchor="start" /></g>)}
      </Panel>
      <Sign x={1110} y={720} k={B.pop(0, 'Same')} text="NEW RUSH. SAME RULE." size={36} rot={-3} c={RED} />
      {B.k === 1 && <Jalopy x={interpolate(B.f, [0, 70], [900, 1150], Easing.out)} y={920} s={0.9} f={B.f} />}
      <HostS s={s} x={1680} keys={[{ at: 0, arm: B.k === 0 ? 'present' : 'point', expr: B.k === 0 ? 'grin' : 'worried' }]} />
    </Stage>
  );
};

export const SHOTS_SUN: ShotMap = { su_ads: Ads, su_ticket: Ticket, su_la: LosAngeles, su_quake: Quake, su_water: Water, su_aqueduct: Aqueduct, su_speech: Speech, su_owens: Owens, su_insiders: Insiders, su_hollywood: Hollywood, su_rule: Rule };
