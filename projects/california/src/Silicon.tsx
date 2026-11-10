/** Silicon (10:54 to 12:11): the orchard valley, the garage, the eight who quit, Silicon Valley, the first network message, Apple and Google. */
import React from 'react';
import { interpolate, Easing, springPop } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { OL, Hills, Cloud, Tree } from '@engine/scenes/Parts';
import { talk, type ShotMap, type SP } from '@engine/kit';
import { Stage } from '@engine/moves';
import { P, camAt, moveCam, toScreen, Full, MapTag, MapPin, FlowLines } from '@engine/qgis/QgisMap';
import { PAPER, RED, GOLD, Rider, OldWorld } from './Kit';
import { Tag, useBeat, Pop, Txt, Sign, DarkSign, Sky, Ground, HostS, Garage, Chip, Nugget, Fruit, House, Terminal, Sparkle } from './Kit2';

const Orchard: React.FC<{ g: number; blossom?: boolean }> = ({ blossom = true }) => (
  <>
    <Sky />
    <Layer depth={0.3}><Hills y={540} fill="#A9B46A" amp={110} seed="or1" /><Cloud x={380} y={230} /><Cloud x={1450} y={250} s={0.8} /></Layer>
    <Layer depth={0.6}>{[...Array(8)].map((_, i) => <Tree key={i} x={120 + i * 250} y={730} s={1.5} c={blossom ? '#E8A6B8' : '#5F8A3F'} c2={blossom ? '#D88AA0' : '#3F6A2A'} />)}</Layer>
  </>
);

// c216-c220: remember Stanford's farm? The valley around it was famous for fruit: the Valley of Heart's Delight.
const Farm: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const fruits: ['plum' | 'cherry' | 'apricot', string][] = [['plum', 'Plums'], ['cherry', 'cherries'], ['apricot', 'apricots']];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [900, 640] }}>
        <Orchard g={B.g} />
        <Layer depth={1}>
          <Ground y={790} fill="#8FB05E" top="#A1C26E" />
          {[...Array(6)].map((_, i) => <Tree key={i} x={200 + i * 290} y={840} s={2.2} c="#E8A6B8" c2="#D88AA0" />)}
          <DarkSign x={620} y={520} k={B.pop(0, 'farm')} text="STANFORD’S FARM" size={40} rot={-3} />
          <HostS s={s} x={1740} y={960} scale={0.6} keys={[{ at: 0, arm: B.k === 0 ? 'finger' : 'present', expr: 'grin' }]} />
        </Layer>
      </CameraRig>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {B.k === 3 && fruits.map(([kind, w], i) => <Pop key={kind} k={B.pop(3, w)} x={420 + i * 220} y={340}><circle r={70} fill={PAPER} stroke={OL} strokeWidth={5} /><Fruit kind={kind} s={1.1} /></Pop>)}
      </svg>
      {B.k === 2 && <Label text="Fruit." x={960} y={330} at={B.at(2, 'Fruit')} size={110} color={GOLD} />}
      {B.k === 4 && <Label text="The Valley of Heart’s Delight" x={960} y={330} at={B.at(4, 'Valley')} size={64} color={GOLD} rot={-2} />}
    </>
  );
};

// c221-c222: two Stanford graduates start a company in a garage. Hewlett and Packard.
const GarageHP: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.06, focus: [1000, 680] }}>
        <Orchard g={B.g} blossom={false} />
        <Layer depth={1}>
          <Ground y={790} fill="#8FB05E" top="#A1C26E" />
          <Garage x={1000} y={830} s={1.5} open={interpolate(B.g, [6, 40], [0, 1], Easing.out)} />
          <g transform="translate(1000 790)"><rect x={-50} y={-70} width={100} height={60} rx={6} fill="#6E7A80" stroke={OL} strokeWidth={4} /><circle cx={-20} cy={-40} r={14} fill="#F4ECD8" stroke={OL} strokeWidth={3} /><path d="M-20 -40 l8 -10" stroke={RED} strokeWidth={3} /><circle cx={24} cy={-40} r={8} fill="#2B2B33" /></g>
          <Chibi x={880} y={900} s={0.9} outfit={{ top: '#F4ECD8', bottom: '#5A5A66', trim: '#3A3A44' }} hat="parted" pose="point" expr="happy" talking={[]} seed="hp1" />
          <Chibi x={1130} y={900} s={0.9} outfit={{ top: '#CFE0E8', bottom: '#4A4A3A', trim: '#3A3A44' }} hat="hair" glasses pose="hold" item="notebook" expr="happy" talking={[]} seed="hp2" flip />
          <DarkSign x={1000} y={330} k={B.pop(1, 'Hewlett')} text="HEWLETT · PACKARD" sub="Palo Alto, 1939" size={44} />
          <HostS s={s} x={1740} y={960} scale={0.6} keys={[{ at: 0, arm: 'point', expr: 'smile' }]} />
        </Layer>
      </CameraRig>
      <Label text="a garage" x={520} y={320} at={B.at(0, 'garage')} size={60} />
    </>
  );
};

// c223-c228: the transistor inventor, eight brilliant engineers, all eight quit, and their people start more. One is Intel.
const Eight: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const quit = B.on(2, 'quit');
  const bossX = interpolate(B.f, [B.at(2, 'quit'), B.at(2, 'quit') + 30], [930, 820], Easing.out);
  return (
    <Stage>
      <g opacity={quit ? 0.45 : 1}><Chibi x={bossX} y={940} s={0.82} outfit={{ top: '#F4F4F0', bottom: '#3A3A44', trim: '#2B2B33' }} hat="parted" glasses pose={quit ? 'hipAngry' : 'idle'} expr={quit ? 'angry' : 'calm'} talking={[]} seed="ws" /></g>
      <DarkSign x={990} y={250} k={B.pop(0, '1956')} text="1956" size={50} />
      {B.k === 1 && <Pop k={B.pop(1, 'mother')} x={950} y={470}><House x={0} y={40} s={0.6} /><Txt y={76} t="near his mother" size={24} font="Hand" /></Pop>}
      {[...Array(8)].map((_, i) => { const k = Math.max(0, springPop(B.f, B.at(1, 'eight') + i * 3)); return k > 0 ? <g key={i} transform={`translate(${1060 + i * 56} ${940 - (quit ? 0 : 0)}) scale(${k})`}><Chibi x={0} y={0} s={0.5} outfit={{ top: ['#CFE0E8', '#F4ECD8', '#E8D58A', '#C7B3E0'][i % 4], bottom: '#3A3A44' }} hat={i % 3 === 0 ? 'parted' : 'hair'} glasses={i % 2 === 0} pose={quit && B.k < 4 ? 'wave' : 'idle'} expr="happy" talking={[]} seed={'e8' + i} /></g> : null; })}
      {quit && <path d="M1020 700 V960" stroke={RED} strokeWidth={6} strokeDasharray="14 12" />}
      <Sign x={1250} y={640} k={B.pop(2, 'quit')} text="ALL EIGHT QUIT" size={32} c={RED} rot={-3} />
      {B.k >= 3 && <DarkSign x={1250} y={540} k={B.pop(3, 'own')} text="THEIR OWN COMPANY · 1957" size={26} />}
      {B.k >= 4 && [...Array(6)].map((_, i) => { const k = Math.max(0, springPop(B.f, B.at(4, 'more') + i * 4)); const x = 1010 + i * 92, hot = i === 3 && B.on(5, 'Intel'); return k > 0 ? <g key={i}><path d={`M1250 500 L${x} 420`} stroke="#5A5A66" strokeWidth={4} opacity={k} /><g transform={`translate(${x} 380) scale(${k * (hot ? 0.55 : 0.36)})`}><Chip c={hot ? '#B8901E' : '#2F4F4A'} /></g></g> : null; })}
      {B.k === 5 && <Sign x={1286} y={270} k={B.pop(5, 'Intel')} text="INTEL · 1968" size={34} bg={GOLD} />}
      <HostS s={s} x={1700} keys={[{ at: 0, arm: B.k === 2 ? 'shrug' : B.k >= 4 ? 'point' : 'present', expr: B.k === 2 ? 'grin' : 'smile' }]} />
    </Stage>
  );
};

// c229-c231: chips made of silicon, which comes from sand. Silicon Valley, and the fruit trees never came back.
const Sand: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const gone = B.k < 2 ? 0 : interpolate(B.f, [6, 60], [0, 1]);
  return (
    <Stage>
      <Pop k={B.pop(0, 'chips')} x={1010} y={430}><Chip s={1.2} /></Pop>
      <Pop k={B.pop(0, 'sand')} x={1300} y={500}><path d="M-110 60 Q-40 -70 0 -60 Q50 -66 110 60 Z" fill="#E7D5A2" stroke={OL} strokeWidth={5} strokeLinejoin="round" />{[[-30, 10], [10, -20], [40, 26], [-60, 40]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill="#B8A06A" />)}</Pop>
      <Pop k={B.pop(0, 'sand')} x={1160} y={440}><Txt t="←" size={70} /></Pop>
      <DarkSign x={1150} y={690} k={B.pop(1, 'Silicon')} text="SILICON VALLEY" sub="the name first appeared in print in 1971" size={44} />
      {B.k === 2 && [...Array(5)].map((_, i) => <g key={i} transform={`translate(${940 + i * 100} 930)`}><g opacity={1 - gone}><Tree x={0} y={0} s={0.9} c="#E8A6B8" c2="#D88AA0" /></g><g opacity={gone}><rect x={-34} y={-130 - (i % 2) * 30} width={68} height={130 + (i % 2) * 30} fill="#8E9AA4" stroke={OL} strokeWidth={4} />{[0, 1, 2].map((r) => <rect key={r} x={-22} y={-116 + r * 34} width={44} height={16} fill="#BFE0F0" stroke={OL} strokeWidth={2} />)}</g></g>)}
      <HostS s={s} x={1700} keys={[{ at: 0, arm: B.k === 0 ? 'present' : B.k === 1 ? 'finger' : 'idle', expr: B.k === 2 ? 'worried' : 'smile' }]} />
    </Stage>
  );
};

// c232-c233: October 1969, a computer in Los Angeles sends the first message on the network that became the internet.
const Net: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const cam = moveCam(B.g, camAt(-120.6, 36.2, 9), camAt(-120.3, 35.8, 12), 0, 60);
  const a = P(-118.44, 34.07), b = P(-122.18, 37.45);
  const send = B.gAt(1, 'sends');
  const A = toScreen(cam, ...a), Z = toScreen(cam, ...b);
  return (
    <>
      <OldWorld cam={cam} land="#3D4C54" sea="#17232C" ca="#2F5A64">
        <MapPin x={a[0]} y={a[1]} at={B.loc(20)} z={cam.z} r={0.8} c="#58E08A" />
        <MapPin x={b[0]} y={b[1]} at={B.loc(34)} z={cam.z} r={0.8} c="#58E08A" />
        <FlowLines pts={[a, b]} cam={cam} start={B.loc(send)} step={44} bend={0.3} color="#58E08A" done="#58E08A" />
      </OldWorld>
      <Full>
        <Tag x={60} y={200} anchor="start" text="OCTOBER 29, 1969" k={springPop(B.g, 6)} size={38} />
        <Tag x={A.x + 150} y={A.y + 10} text="UCLA, LOS ANGELES" k={Math.max(0, springPop(B.g, 24)) * 0.85} size={26} bg={PAPER} c="#1A1410" />
        <Tag x={Z.x + 210} y={Z.y - 10} text="STANFORD RESEARCH INSTITUTE" k={Math.max(0, springPop(B.g, 38)) * 0.85} size={24} bg={PAPER} c="#1A1410" />
        <Tag x={60} y={284} anchor="start" text="THE FIRST MESSAGE ON THE NETWORK" k={B.pop(1, 'first')} size={30} bg="#1F6B45" />
        <Rider x={1660} y={330} arm="point" expr="grin" talking={talk(s)} flip />
      </Full>
    </>
  );
};

// c234-c236: it was supposed to say "login". The system crashed after two letters. The first word sent online was "lo".
const Screen: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const t = B.at(0, 'login');
  const typed = B.k > 0 ? 'LO' : B.f >= t + 16 ? 'LO' : B.f >= t ? 'L' : '';
  const crash = B.k < 1 ? 0 : B.k > 1 ? 0 : interpolate(B.f, [B.at(1, 'crashed'), B.at(1, 'crashed') + 8], [0, 1]);
  return (
    <Full bg="#1E2A33">
      <Terminal x={820} y={560} s={1.25} text={typed} cursor={B.k === 0 && Math.floor(B.f / 10) % 2 === 0} crash={crash} />
      <Sign x={820} y={210} k={B.pop(0, 'login')} text="meant to type: LOGIN" size={34} />
      <DarkSign x={1430} y={330} k={B.pop(2, 'first')} text="THE FIRST WORD ONLINE" sub="“lo”" size={32} />
      {B.on(2, 'lo') && <Sparkle x={1010} y={420} f={B.f} r={40} c={GOLD} />}
      <HostS s={s} x={1560} y={1010} scale={0.78} keys={[{ at: 0, arm: B.k === 1 ? 'shrug' : 'point', expr: B.k === 0 ? 'smile' : 'grin' }]} />
    </Full>
  );
};

// c237-c242: 1976, two friends named Steve and another garage: Apple. 1998, two students and another garage: Google.
const Garages: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <Stage>
      <DarkSign x={1010} y={290} k={B.pop(0, '1976')} text="1976" size={50} />
      <Pop k={B.pop(1, 'garage')} x={1010} y={760}><Garage x={0} y={0} s={0.66} /></Pop>
      <Sign x={1010} y={860} k={B.pop(2, 'Apple')} text="APPLE" size={40} bg={GOLD} />
      <DarkSign x={1340} y={290} k={B.pop(3, '1998')} text="1998" size={50} />
      <Pop k={B.pop(4, 'garage')} x={1340} y={760}><Garage x={0} y={0} s={0.66} /></Pop>
      <Sign x={1340} y={860} k={B.pop(5, 'Google')} text="GOOGLE" size={40} bg={GOLD} />
      <HostS s={s} x={1720} keys={[{ at: 0, arm: B.k % 3 === 2 ? 'finger' : 'present', expr: 'grin' }]} />
    </Stage>
  );
};

// c243-c244: California had found gold again. This time it was made of sand.
const GoldSand: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <Stage>
      <Pop k={B.pop(0, 'gold')} x={1010} y={470}><Nugget s={1.7} /><Sparkle x={50} y={-56} f={B.g} r={28} /></Pop>
      <Pop k={B.pop(1, 'sand')} x={1180} y={470}><Txt y={24} t="=" size={90} /></Pop>
      <Pop k={B.pop(1, 'sand')} x={1340} y={470}><Chip s={1} /></Pop>
      <DarkSign x={1170} y={760} k={B.pop(1, 'sand')} text="GOLD AGAIN, MADE OF SAND" size={36} rot={-2} />
      <HostS s={s} x={1720} keys={[{ at: 0, arm: B.k === 0 ? 'present' : 'finger', expr: 'grin' }]} />
    </Stage>
  );
};

export const SHOTS_SILICON: ShotMap = { si_farm: Farm, si_garage: GarageHP, si_eight: Eight, si_sand: Sand, si_net: Net, si_screen: Screen, si_garages: Garages, si_gold: GoldSand };
