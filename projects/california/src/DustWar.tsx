/** Dust and war (9:13 to 10:54): the Dust Bowl, the border blockade, the Golden Gate, war factories, the camps (quiet), the suburbs. */
import React from 'react';
import { interpolate, Easing, springPop } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Host } from '@engine/characters/Host';
import { Chibi } from '@engine/characters/Chibi';
import { OL, Hills, Cloud, Tree } from '@engine/scenes/Parts';
import { W } from '@engine/cast/Wardrobe';
import { talk, type ShotMap, type SP } from '@engine/kit';
import { Stage } from '@engine/moves';
import { P, camAt, moveCam, toScreen, QC, Full, MapTag, MapPin, FlowLines, WorldMap } from '@engine/qgis/QgisMap';
import { D, PAPER, RED, GOLD, SEA, Rider, OldWorld } from './Kit';
import { Tag, useBeat, Pop, Txt, Sign, DarkSign, Panel, Sky, Ground, HostS, Quiet, fade, House, Jalopy, Orange, Person, Bridge } from './Kit2';

const SERIF = "Georgia, 'Times New Roman', serif";

// c186-c188: the 1930s. The middle of America turns to dust.
const Dust: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const d = interpolate(B.g, [0, B.gd], [0.15, 0.85]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [900, 640] }}>
        <Sky id="skyDust" />
        <Layer depth={0.3}><Hills y={600} fill="#B8A07A" amp={40} seed="du1" stroke={false} /></Layer>
        <Layer depth={1}>
          <Ground y={780} fill="#B49566" top="#C2A474" />
          {[...Array(9)].map((_, i) => <path key={i} d={`M${-100 + i * 250} 1080 L${700 + i * 60} 790`} stroke="#9A7C52" strokeWidth={5} />)}
          <House x={520} y={800} s={1.7} c="#D9CFB6" roof="#6B5A44" />
          <g transform="translate(900 800)"><path d="M-30 0 L0 -260 L30 0 M-18 -100 H18 M-24 -40 H24" stroke="#5A4A3A" strokeWidth={7} fill="none" /><g transform={`translate(0 -260) rotate(${B.g * 5})`}>{[0, 45, 90, 135].map((a) => <path key={a} d="M-60 0 H60" transform={`rotate(${a})`} stroke="#5A4A3A" strokeWidth={9} />)}</g></g>
          {[...Array(7)].map((_, i) => { const x = ((i * 330 + B.g * (4 + (i % 3))) % 2500) - 300; return <ellipse key={i} cx={x} cy={520 + (i % 4) * 110} rx={260 + (i % 3) * 60} ry={90 + (i % 2) * 40} fill="#C9A878" opacity={d * 0.55} />; })}
          <rect x={-200} y={-200} width={2400} height={1500} fill="#B48A52" opacity={B.k >= 2 ? interpolate(B.f, [0, 60], [0.1, 0.42]) : 0.1} />
          <HostS s={s} x={1640} y={950} scale={0.62} keys={[{ at: 0, arm: 'idle', expr: 'worried' }]} />
        </Layer>
      </CameraRig>
      <Label text="The 1930s" x={520} y={300} at={6} size={64} />
      {B.k >= 1 && <Label text="the Dust Bowl" x={1100} y={380} at={B.at(1, 'dust')} size={52} color={GOLD} />}
    </>
  );
};

// c189-c190: more than 300,000 people drive west, to the place from the posters.
const FROM = ['Oklahoma', 'Texas', 'Arkansas', 'Missouri'];
const Road: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const cam = moveCam(B.g, camAt(-102, 37, 4.2), camAt(-107, 37, 4.6), 0, B.gd);
  const target = P(-119.4, 36.4);
  const drive = B.gAt(0, 'drive');
  const st = D.provinces.USA;
  return (
    <>
      <WorldMap data={D} cam={cam} fill={(c) => (c.iso === 'USA' ? '#EFE3C4' : QC.land)}>
        {st.map((p) => <path key={p.name} d={p.d} fill={FROM.includes(p.name) ? '#C9A066' : p.name === 'California' ? GOLD : '#EFE3C4'} stroke={QC.ink} strokeWidth={1.6 / cam.z} />)}
        {st.filter((p) => FROM.includes(p.name) && p.c).map((p, i) => <FlowLines key={p.name} pts={[p.c as [number, number], target]} cam={cam} start={B.loc(drive + i * 8)} step={50} bend={0.16} />)}
      </WorldMap>
      <Full>
        <Tag x={60} y={200} anchor="start" text="MORE THAN 300,000 PEOPLE" k={B.pop(0, '300,000')} size={36} bg={RED} />
        <Tag x={60} y={282} anchor="start" text="OKLAHOMA · TEXAS · ARKANSAS · MISSOURI" k={B.pop(0, 'load')} size={26} />
        <Tag x={60} y={356} anchor="start" text="TO THE PLACE FROM THE POSTERS" k={B.pop(1, 'posters')} size={28} bg={PAPER} c="#1A1410" />
        <Jalopy x={interpolate(B.g, [drive, drive + 160], [1500, 700])} y={960} s={0.8} f={B.g} flip />
        <Rider x={1640} y={360} arm="point" expr="worried" talking={talk(s)} flip />
      </Full>
    </>
  );
};

// c191-c193: no welcome mat. In 1936 Los Angeles police were sent to the state border.
const Border: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const carX = interpolate(B.g, [0, 70], [-200, 520], Easing.out);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [1000, 660] }}>
        <Sky id="skyDust" />
        <Layer depth={0.3}><Hills y={560} fill="#C4A77A" amp={110} seed="bd1" /></Layer>
        <Layer depth={1}>
          <Ground y={800} fill="#D2B88A" top="#DEC89C" />
          <path d="M-200 880 H2200 V1010 H-200 Z" fill="#6E6A66" stroke={OL} strokeWidth={4} />{[...Array(12)].map((_, i) => <rect key={i} x={-150 + i * 190} y={938} width={90} height={10} fill="#E8E2D4" />)}
          <g transform="translate(1010 800)"><rect x={-8} y={-250} width={16} height={250} fill="#5A3E26" stroke={OL} strokeWidth={4} /><rect x={-190} y={-330} width={380} height={110} rx={8} fill={PAPER} stroke={OL} strokeWidth={5} /><Txt y={-286} t="CALIFORNIA" size={40} /><Txt y={-244} t="STATE LINE" size={30} c={RED} /></g>
          <Jalopy x={carX} y={930} s={1.15} f={B.g < 70 ? B.g : 0} />
          {[0, 1, 2].map((i) => <Chibi key={i} x={860 + i * 120} y={910 + (i % 2) * 26} s={0.9} outfit={{ top: '#22304A', bottom: '#1E2636', trim: '#E2B13C', belt: '#1A1410' }} hat="cap" hatColor="#22304A" pose={i === 1 ? 'cross' : 'hipAngry'} expr="calm" talking={[]} seed={'pl' + i} flip />)}
          <Host x={1560} y={950} scale={0.7} keys={[{ at: 0, arm: 'idle', expr: 'worried' }]} talking={talk(s)} staffMode="level" />
        </Layer>
      </CameraRig>
      {B.k >= 1 && <Label text="1936" x={520} y={290} at={B.at(1, '1936')} size={64} />}
      {B.k === 2 && <Label text="tried to close the door" x={900} y={400} at={B.at(2, 'close')} size={52} color={GOLD} />}
    </>
  );
};

// c194-c195: those who got in picked fruit for pennies, on land owned by somebody else.
const Fruit: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [900, 640] }}>
        <Sky />
        <Layer depth={0.3}><Hills y={560} fill="#B8B06A" amp={90} seed="fr9" /></Layer>
        <Layer depth={1}>
          <Ground y={800} fill="#9AB05E" top="#ACC26E" />
          {[220, 640, 1060, 1480].map((x, i) => <g key={i}><Tree x={x} y={820} s={2.5} c="#4F7F3A" c2="#3A6028" />{[[-70, -250], [40, -290], [80, -210], [-20, -200]].map(([ox, oy], j) => <g key={j} transform={`translate(${x + ox} ${820 + oy})`}><Orange s={0.5} /></g>)}</g>)}
          {[0, 1, 2].map((i) => <Chibi key={i} x={420 + i * 420} y={900} s={0.9} outfit={{ top: ['#8A7A5A', '#6A7A8A', '#8A6A5A'][i], bottom: '#4A4A3A' }} hat={i === 1 ? 'scarf' : 'cap'} pose={Math.floor((B.g + i * 11) / 14) % 2 ? 'raise' : 'carry'} expr="calm" talking={[]} seed={'pk' + i} />)}
          <Pop k={B.pop(1, 'owned')} x={1560} y={760} rot={3}><rect x={-8} y={0} width={16} height={130} fill="#5A3E26" stroke={OL} strokeWidth={4} /><rect x={-170} y={-90} width={340} height={100} rx={8} fill={PAPER} stroke={OL} strokeWidth={5} /><Txt y={-48} t="PRIVATE LAND" size={34} c={RED} /><Txt y={-14} t="somebody else’s" size={24} font="Hand" /></Pop>
          <HostS s={s} x={1780} y={960} scale={0.55} keys={[{ at: 0, arm: 'idle', expr: 'worried' }]} />
        </Layer>
      </CameraRig>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <Pop k={B.pop(0, 'pennies')} x={330} y={330}><circle r={70} fill="#B87333" stroke={OL} strokeWidth={6} /><Txt y={26} t="1¢" size={72} c="#3B2A1A" /></Pop>
      </svg>
    </>
  );
};

// c196-c197: 1937, an impossible bridge across the Golden Gate. Four years later, everything changed again.
const GoldenGate: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const draw = interpolate(B.g, [6, 80], [0, 1], Easing.inOut);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.03, zoomTo: 1, focus: [960, 600] }}>
        <Sky id="skyDawn" />
        <Layer depth={0.4}><Cloud x={300} y={240} /><Cloud x={1300} y={200} s={0.9} /></Layer>
        <Layer depth={1}>
          <path d="M-200 760 Q60 520 300 700 V1200 H-200 Z" fill="#7C8A5A" stroke={OL} strokeWidth={4} />
          <path d="M2200 760 Q1900 480 1640 700 V1200 H2200 Z" fill="#7C8A5A" stroke={OL} strokeWidth={4} />
          <rect x={-200} y={760} width={2400} height={500} fill={SEA} />
          {[...Array(7)].map((_, i) => <path key={i} d={`M${(i * 330 + B.g * 1.4) % 2200 - 150} ${830 + (i % 3) * 50} q18 -12 36 0 t36 0`} stroke="#fff" strokeOpacity={0.55} strokeWidth={4} fill="none" />)}
          <Bridge x={210} y={700} draw={draw} />
          {[0, 1].map((i) => <ellipse key={i} cx={500 + i * 800 + Math.sin(B.g / 40 + i) * 40} cy={740} rx={420} ry={50} fill="#F4F4F0" opacity={0.5} />)}
          <HostS s={s} x={1760} y={1010} scale={0.55} keys={[{ at: 0, arm: B.k === 0 ? 'point' : 'chin', expr: B.k === 0 ? 'grin' : 'worried' }]} />
        </Layer>
      </CameraRig>
      <Label text="Golden Gate Bridge, 1937" x={960} y={270} at={B.at(0, '1937')} size={56} />
    </>
  );
};

// c198-c200: war. California becomes America's factory on the Pacific: planes in the south, ships in the north.
const PLANES: [number, number][] = [[-118.25, 34.05], [-117.16, 32.72], [-118.36, 34.18]];
const YARDS: [number, number][] = [[-122.35, 37.93], [-122.26, 38.1], [-122.48, 37.86]];
const War: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const cam = moveCam(B.g, camAt(-121, 37, 5.2), camAt(-119.6, 36.2, 8.6), 0, 70);
  const so = toScreen(cam, ...P(-117.6, 33.5)), no = toScreen(cam, ...P(-122.4, 38.0));
  return (
    <>
      <OldWorld cam={cam} land="#3D4C54" sea="#17232C" ca="#E8A84A">
        {PLANES.map((p, i) => <MapPin key={'p' + i} x={P(...p)[0]} y={P(...p)[1]} at={B.at(2, 'Planes') + i * 4} z={cam.z} r={0.8} c="#7FB7E8" />)}
        {YARDS.map((p, i) => <MapPin key={'y' + i} x={P(...p)[0]} y={P(...p)[1]} at={B.at(2, 'ships') + i * 4} z={cam.z} r={0.8} c={RED} />)}
      </OldWorld>
      <Full>
        <Tag x={60} y={210} anchor="start" text="WAR · 1941" k={B.pop(0, 'War')} size={54} bg={RED} />
        <Tag x={60} y={310} anchor="start" text="AMERICA’S FACTORY ON THE PACIFIC" k={B.pop(1, 'factory')} size={30} />
        <Tag x={so.x + 170} y={so.y + 10} text="PLANES" k={B.pop(2, 'Planes')} size={32} bg="#7FB7E8" c="#1A1410" />
        <Tag x={no.x - 150} y={no.y - 20} text="SHIPS" k={B.pop(2, 'ships')} size={32} bg={RED} />
        <Rider x={1660} y={330} arm="point" expr="worried" talking={talk(s)} flip />
      </Full>
    </>
  );
};

// c201-c202: the shipyards of one town built 747 ships; one was put together in under five days.
const Yard: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const n = B.k === 0 ? Math.round(interpolate(B.f, [10, 90], [0, 747], Easing.out)) : 747;
  const hull = interpolate(B.g, [0, 90], [0.15, 1]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [1000, 640] }}>
        <Sky />
        <Layer depth={0.3}><Hills y={560} fill="#9AA57A" amp={70} seed="yd1" /></Layer>
        <Layer depth={1}>
          <rect x={-200} y={820} width={2400} height={400} fill={SEA} />
          <path d="M-200 820 H900 L1100 900 H-200 Z" fill="#8E949A" stroke={OL} strokeWidth={4} />
          <g transform="translate(1000 800)">
            <path d="M-420 -150 L-380 0 H360 L460 -170 Z" fill="#7A858E" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
            <rect x={-420} y={-150 - 0} width={880} height={0} />
            <g opacity={hull}><rect x={-200} y={-250} width={260} height={100} fill="#B8BEC4" stroke={OL} strokeWidth={5} /><rect x={-80} y={-330} width={60} height={80} fill="#5A5A66" stroke={OL} strokeWidth={5} />{[-160, -100, 0].map((x) => <rect key={x} x={x} y={-226} width={34} height={30} fill="#BFE0F0" stroke={OL} strokeWidth={3} />)}</g>
            {[-360, -200, -40, 120, 280].map((x) => <path key={x} d={`M${x} 0 V-${150 + (x > 0 ? 10 : 0)}`} stroke="#6B4A2B" strokeWidth={6} />)}
          </g>
          <g transform="translate(1560 820)"><path d="M0 0 V-520 M0 -520 H-380 M0 -520 L80 -440" stroke="#C8452B" strokeWidth={14} fill="none" strokeLinecap="round" /><path d={`M-300 -520 V${-360 + Math.sin(B.g / 12) * 30}`} stroke={OL} strokeWidth={4} /><rect x={-330} y={-360 + Math.sin(B.g / 12) * 30} width={60} height={44} fill="#8E949A" stroke={OL} strokeWidth={4} /></g>
          <HostS s={s} x={260} y={980} scale={0.58} keys={[{ at: 0, arm: 'point', expr: B.k === 1 ? 'shock' : 'smile' }]} />
        </Layer>
      </CameraRig>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <Panel x={330} y={330} w={420} h={250} title="SHIPS BUILT · RICHMOND"><Txt y={70} t={String(n)} size={120} c={GOLD} /></Panel>
        <DarkSign x={330} y={560} k={B.pop(1, 'five')} text="ONE SHIP: UNDER 5 DAYS" size={30} c="#F4ECD8" />
      </svg>
    </>
  );
};

// c203-c204: millions came for the work. Under 7 million people in 1940, over 10 million in 1950.
const Growth: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const t = B.at(1, 'jumped');
  const n = interpolate(B.f, [t, t + 44], [6.9, 10.6], Easing.out);
  return (
    <Stage>
      <Panel x={1190} y={360} w={520} h={270} title={`CALIFORNIA · ${n > 8.7 ? 1950 : 1940}`}><Txt y={56} t={`${n.toFixed(1)} MILLION`} size={66} c={GOLD} /><Txt y={104} t="people" size={28} c="#CFC6B2" /></Panel>
      {[...Array(11)].map((_, i) => (i < Math.round(n) ? <Person key={i} x={970 + i * 44} y={760} s={1} c={i < 7 ? '#F4ECD8' : GOLD} /> : null))}
      <HostS s={s} x={1680} keys={[{ at: 0, arm: B.k === 0 ? 'present' : 'point', expr: 'smile' }]} />
    </Stage>
  );
};

// c205-c209 (quiet): 1942, about 120,000 people of Japanese descent forced into camps; two of three were citizens; apology 46 years later.
const QuietWar: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const o = (k: number, at = 4) => (B.k < k ? 0 : B.k > k ? 1 : fade(B.f, at, 30));
  return (
    <Quiet>
      <path d="M0 760 Q500 700 960 740 T1920 720 V1080 H0 Z" fill="#12151A" />
      {[260, 620, 980, 1340].map((x) => <g key={x}><rect x={x} y={640} width={280} height={90} fill="#0E1014" stroke="#3A4048" strokeWidth={3} /><path d={`M${x - 14} 640 L${x + 140} 590 L${x + 294} 640 Z`} fill="#0E1014" stroke="#3A4048" strokeWidth={3} /></g>)}
      <g><path d="M1700 760 V470 M1780 760 V470 M1700 620 L1780 520 M1780 620 L1700 520" stroke="#3A4048" strokeWidth={6} /><rect x={1680} y={410} width={120} height={64} fill="#0E1014" stroke="#3A4048" strokeWidth={4} /><path d="M1670 410 L1740 370 L1810 410 Z" fill="#0E1014" stroke="#3A4048" strokeWidth={4} /></g>
      {[820, 870, 920].map((y) => <g key={y}><path d={`M0 ${y} H1920`} stroke="#5A626C" strokeWidth={3} />{[...Array(32)].map((_, i) => <path key={i} d={`M${30 + i * 60} ${y - 8} l10 16 M${40 + i * 60} ${y - 8} l-10 16`} stroke="#5A626C" strokeWidth={3} />)}</g>)}
      {[200, 760, 1320, 1880].map((x) => <rect key={x} x={x - 6} y={790} width={12} height={180} fill="#3A4048" />)}
      <text x={150} y={250} fontFamily={SERIF} fontSize={72} fill="#E8E2D4" opacity={o(0, 6)}>1942</text>
      <text x={150} y={370} fontFamily={SERIF} fontSize={100} fill="#E8E2D4" opacity={o(0, 30)}>120,000 people</text>
      <g opacity={o(2)}>{[0, 1, 2].map((i) => <Person key={i} x={1180 + i * 90} y={330} s={1.6} c={i < 2 ? '#E8E2D4' : '#4A525C'} />)}<text x={1270} y={400} textAnchor="middle" fontFamily={SERIF} fontSize={34} fill="#A8A294">2 of 3 were American citizens</text></g>
      <text x={150} y={500} fontFamily={SERIF} fontSize={40} fill="#A8A294" opacity={o(4)}>The official apology came in 1988, 46 years later.</text>
    </Quiet>
  );
};

// c210-c215: after the war: families, freeways, suburbs, a theme park in an orange grove, and the most people of any state.
const After: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [960, 640] }}>
        <Sky />
        <Layer depth={0.1}><circle cx={1560} cy={250} r={70} fill="#FFD84A" stroke={OL} strokeWidth={4} /></Layer>
        <Layer depth={0.3}><Hills y={560} fill="#A9B46A" amp={90} seed="af1" /><Cloud x={420} y={240} /></Layer>
        <Layer depth={1}>
          <Ground y={790} fill="#8FB05E" top="#A1C26E" />
          {B.k >= 2 && <g opacity={B.k > 2 ? 1 : interpolate(B.f, [B.at(2, 'Freeways'), B.at(2, 'Freeways') + 16], [0, 1])}><path d="M-200 1010 Q700 900 1200 960 T2200 880 V980 Q1700 1060 1200 1050 T-200 1100 Z" fill="#6E6A66" stroke={OL} strokeWidth={4} /><path d="M-200 1054 Q700 946 1200 1004 T2200 928" stroke="#E8E2D4" strokeWidth={6} strokeDasharray="40 30" fill="none" /></g>}
          {B.k >= 3 && [...Array(8)].map((_, i) => <Pop key={i} k={Math.max(0, springPop(B.f, B.at(3, 'Suburbs') + i * 3))} x={170 + (i % 4) * 190} y={i < 4 ? 820 : 900}><House x={0} y={0} s={0.85} c={['#F4ECD8', '#E7CFA0', '#CFE0E8', '#F2D9C4'][i % 4]} roof={['#B5553A', '#6B5A44', '#4A6A7A', '#8A4A3A'][i % 4]} /></Pop>)}
          {B.k >= 4 && <Pop k={B.pop(4, 'theme')} x={1280} y={820}>
            <g transform={`translate(0 -230) rotate(${B.g * 1.5})`}><circle r={170} fill="none" stroke="#C8452B" strokeWidth={10} />{[0, 45, 90, 135].map((a) => <path key={a} d="M-170 0 H170" transform={`rotate(${a})`} stroke="#C8452B" strokeWidth={6} />)}{[...Array(8)].map((_, i) => <rect key={i} x={-18} y={-188} width={36} height={30} rx={6} transform={`rotate(${i * 45})`} fill={['#FFD84A', '#7FB7E8', '#9CC9A0', '#F2B8D0'][i % 4]} stroke={OL} strokeWidth={3} />)}</g>
            <path d="M-80 0 L0 -230 L80 0" stroke="#5A3E26" strokeWidth={12} fill="none" strokeLinejoin="round" />
            {[-230, 220].map((x, i) => <g key={i}><Tree x={x} y={10} s={1.6} c="#4F7F3A" c2="#3A6028" /><g transform={`translate(${x + 20} -150)`}><Orange s={0.4} /></g><g transform={`translate(${x - 30} -120)`}><Orange s={0.4} /></g></g>)}
          </Pop>}
          {B.k < 2 && <g><Chibi x={760} y={900} s={0.95} {...W.GI()} pose="wave" expr="happy" talking={[]} seed="gi1" />{B.k === 1 && <><Chibi x={900} y={900} s={0.9} outfit={{ top: '#C85A6A', bottom: '#8A3A4A' }} hat="bun" pose="idle" expr="happy" talking={[]} seed="fm1" /><Chibi x={1000} y={910} s={0.62} outfit={{ top: '#7FB7E8', bottom: '#3A4A6A' }} hat="hair" pose="cheer" expr="happy" talking={[]} seed="fm2" /></>}</g>}
          <DarkSign x={960} y={480} k={B.pop(5, 'more')} text="MORE PEOPLE THAN ANY OTHER STATE" size={38} />
          <HostS s={s} x={1760} y={960} scale={0.58} keys={[{ at: 0, arm: B.k === 5 ? 'finger' : 'present', expr: 'grin' }]} />
        </Layer>
      </CameraRig>
    </>
  );
};

export const SHOTS_DUST: ShotMap = { dw_dust: Dust, dw_road: Road, dw_border: Border, dw_fruit: Fruit, dw_bridge: GoldenGate, dw_war: War, dw_yard: Yard, dw_growth: Growth, dw_quiet: QuietWar, dw_after: After };
