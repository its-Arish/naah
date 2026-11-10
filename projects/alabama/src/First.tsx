/** First Alabamians (0:57 to 2:27): Russell Cave, Moundville, trade, the nations, the name. */
import React from 'react';
import { interpolate, Easing, springPop } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL, Hills, Tree, Flame, Cloud } from '@engine/scenes/Parts';
import { Chibi } from '@engine/characters/Chibi';
import { SKIN } from '@engine/cast/Wardrobe';
import { talk, type ShotMap, type SP } from '@engine/kit';
import { Stage } from '@engine/moves';
import { MapTag, FlowLines, camAt, P, toScreen } from '@engine/qgis/QgisMap';
import { PAPER, RED, GOLD, INK, Rider, OldWorld } from './Kit';
import { useBeat, HostS, Sign, DarkSign, Pop, Txt, Sky, Ground, fmt } from './Kit2';
import { Cane, Catch, FishHost, fishCard } from './Moves';
import { AlMap, at, Pin, Mound, Palisade, Corn, ease } from './KitAL';

const NATIVE = (i: number) => ({ outfit: { top: ['#B98A5A', '#A8744A', '#C49A6C'][i % 3], bottom: '#7A5234', belt: '#5A3A22' }, hat: i % 2 ? 'hairlong' : 'none', hatColor: '#1A1410', hair: '#1A1410', skin: SKIN.brown });

// c022: back ten thousand years.
const Back: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const t = b.at(0, '10000');
  const n = Math.round(interpolate(b.f, [t - 10, t + 24], [0, 10000], Easing.out) / 100) * 100;
  return (
    <Stage>
      <Pop k={b.pop(0, 'back') } x={1110} y={470}>
        <rect x={-210} y={-120} width={420} height={240} rx={16} fill={PAPER} stroke={OL} strokeWidth={6} />
        <Txt y={4} t={fmt(n)} size={96} c={RED} />
        <Txt y={74} t="YEARS AGO" size={40} />
      </Pop>
      <Cane t={b.f} X={1600} talking={talk(s)} />
    </Stage>
  );
};

// c023-c030: families in the mouth of Russell Cave; the ash layers stack up like a diary.
const LAYERS = ['8000 BC', '6000 BC', '4000 BC', '2000 BC', '0', 'AD 1000'];
const Cave: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const { f, g, k } = b;
  const diary = k >= 4;
  const split = interpolate(g, [b.gAt(4) < -900 ? 0 : b.gAt(4), (b.gAt(4) < -900 ? 0 : b.gAt(4)) + 24], [0, 1], Easing.inOut);
  const layersShown = !diary ? 0 : k === 4 ? 1 : k === 5 ? Math.min(6, 1 + Math.floor(b.f / 10)) : 6;
  return (
    <CameraRig move={{ zoomFrom: 1.08, zoomTo: 1, focus: [700, 560] }}>
      <Sky id="skyDawn" />
      <Layer depth={0.3}><Hills y={640} fill="#6E8A5A" amp={70} seed="rc1" /></Layer>
      <Layer depth={1}>
        {/* the rock face and the cave mouth */}
        <path d="M-200 1100 L-200 300 Q200 180 620 260 Q1000 220 1200 420 L1300 1100 Z" fill="#8A8072" stroke={OL} strokeWidth={6} />
        <path d="M160 900 Q170 520 520 470 Q880 500 900 900 Z" fill="#1E1A16" stroke={OL} strokeWidth={6} />
        {[[-40, 380], [980, 380], [1150, 520]].map(([x, y], i) => <Tree key={i} x={x} y={y} s={0.9} c="#4E7A3A" />)}
        <Flame x={520} y={880} s={1.4} seed="cave" />
        <ellipse cx={520} cy={900} rx={90} ry={16} fill="#3A2A1E" />
        {[0, 1, 2, 3].map((i) => <Chibi key={i} x={330 + i * 110 + (i > 1 ? 150 : 0)} y={900} s={0.62} {...NATIVE(i)} legs={i % 2 ? 'sit' : 'stand'} pose={i === 0 ? 'point' : 'idle'} expr="calm" seed={'rc' + i} flip={i > 1} />)}
        <Sign x={540} y={360} k={b.pop(3, 'russell')} text="RUSSELL CAVE" size={40} />
        <Rider x={1180} y={190} s={0.38} arm="point" expr="smile" talking={talk(s)} flip />
      </Layer>
      {/* the cross-section: layers of old campfires, one per beat */}
      {split > 0 && <g transform={`translate(${1920 - 640 * split} 0)`}>
        <rect x={0} y={0} width={680} height={1080} fill="#2A231C" stroke={OL} strokeWidth={6} />
        <Txt x={320} y={190} t="A DIARY WRITTEN IN ASH" size={36} c={GOLD} />
        {LAYERS.map((l, i) => {
          if (i >= layersShown) return null;
          const y = 820 - i * 86, a = springPop(b.f, k === 5 ? i * 10 : -99);
          return (
            <g key={l} opacity={Math.min(1, a + (k > 5 ? 1 : 0))}>
              <path d={`M40 ${y} q140 -14 280 0 t280 0 v-74 q-140 12 -280 0 t-280 0 Z`} fill={i % 2 ? '#6A5A4A' : '#57483A'} stroke="#1E1A16" strokeWidth={3} />
              {[90, 260, 450].map((cx) => <ellipse key={cx} cx={cx + (i % 2) * 40} cy={y - 34} rx={34} ry={8} fill="#1A1410" opacity={0.6} />)}
              <Txt x={320} y={y - 24} t={l} size={26} c="#F4ECD8" />
            </g>
          );
        })}
      </g>}
    </CameraRig>
  );
};

// c031: "Then the people of this land started building."
const Build: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const h = interpolate(b.f, [b.at(0, 'building') - 6, b.at(0, 'building') + 24], [0, 140], Easing.out);
  return (
    <Stage>
      <ellipse cx={1110} cy={720} rx={300} ry={26} fill="#9A9A9A" />
      <Mound x={1110} y={720} w={460} h={h} top />
      <Catch t={b.f - 2} X={1600} talking={talk(s)} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at: b.at(0, 'building'), arm: 'point', expr: 'grin' }]} />
    </Stage>
  );
};

// c032-c037: Moundville rises: 29 mounds around a plaza; the biggest almost 60 feet.
const MOUNDS = Array.from({ length: 29 }, (_, i) => {
  const a = (i / 29) * Math.PI * 2;
  return { x: 960 + Math.cos(a) * 640, y: 700 + Math.sin(a) * 150, w: 120 + (i % 4) * 26, h: 40 + ((i * 37) % 50) };
}).sort((p, q) => p.y - q.y);
const Mounds: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const { g } = b;
  const t29 = b.gAt(2, '29');
  const n = t29 < -900 ? 29 : t29 > 9e4 ? 0 : Math.max(0, Math.min(29, Math.floor((g - t29) / 2.2)));
  const big = b.gAt(4, 'biggest');
  const bigH = big < -900 ? 300 : big > 9e4 ? 0 : interpolate(g, [big, big + 30], [0, 300], Easing.out);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [960, 620] }}>
      <Sky id="skyDay" />
      <Layer depth={0.2}><Cloud x={400} y={200} s={1.2} /><Cloud x={1500} y={160} /></Layer>
      <Layer depth={0.5}><Hills y={560} fill="#7E9E62" amp={30} seed="mv" /></Layer>
      <Layer depth={1}>
        <rect x={-200} y={560} width={2400} height={600} fill="#9CB874" />
        {/* the Black Warrior River */}
        <path d="M-200 990 Q500 900 980 1000 T2200 950 V1100 H-200 Z" fill="#6E9EC0" stroke={OL} strokeWidth={4} />
        <Sign x={300} y={1010} k={b.pop(1, 'warrior')} text="BLACK WARRIOR RIVER" size={24} bg="#2F5E7A" c="#fff" />
        <ellipse cx={960} cy={700} rx={520} ry={110} fill="#C9B98A" stroke="#A8996A" strokeWidth={3} />
        {MOUNDS.map((m, i) => i < n ? <Mound key={i} x={m.x} y={m.y} w={m.w * 0.8} h={m.h * Math.min(1, springPop(g, t29 + i * 2.2 > 9e4 ? 0 : t29 + i * 2.2))} /> : null)}
        <Mound x={960} y={640} w={420} h={bigH} top />
        {bigH > 280 && <g><line x1={1220} y1={640} x2={1220} y2={340} stroke={RED} strokeWidth={5} /><path d="M1206 340 h28 M1206 640 h28" stroke={RED} strokeWidth={5} /><Txt x={1300} y={500} t="~60 FT" size={38} c={RED} /></g>}
        {bigH > 0 && <Chibi x={1150} y={640} s={0.32} {...NATIVE(1)} seed="tiny" />}
      </Layer>
      <MapTag x={1600} y={260} text={`MOUNDS: ${n}`} k={springPop(b.f, b.k === 2 ? b.at(2, '29') : -99) || (b.k > 2 ? 1 : 0)} size={38} />
      <Sign x={960} y={170} k={b.pop(5, 'moundville')} text="MOUNDVILLE" size={56} />
      <Rider x={300} y={330} s={0.4} arm="point" expr="grin" talking={talk(s)} />
    </CameraRig>
  );
};

// c038-c041: inside the walls and out in the valley; corn.
const People: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const { g } = b;
  const corn = b.gAt(3, 'corn');
  const cg = corn < -900 ? 1 : corn > 9e4 ? 0 : interpolate(g, [corn, corn + 20], [0, 1], Easing.out);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [900, 640] }}>
      <Sky id="skyDay" />
      <Layer depth={0.5}><Hills y={540} fill="#7E9E62" amp={30} seed="pv" /></Layer>
      <Layer depth={1}>
        <rect x={-200} y={540} width={2400} height={600} fill="#9CB874" />
        <Palisade x1={180} x2={900} y={760} h={170} />
        <Mound x={560} y={600} w={300} h={130} top />
        {[0, 1, 2, 3, 4].map((i) => <Chibi key={i} x={260 + i * 140} y={880} s={0.55} {...NATIVE(i)} pose={i === 2 ? 'carry' : 'idle'} legs={i % 2 ? 'walk' : 'stand'} seed={'pp' + i} delay={i * 7} />)}
        {Array.from({ length: 14 }, (_, i) => <Corn key={i} x={1040 + (i % 7) * 100} y={720 + Math.floor(i / 7) * 120} g={cg * (1 - (i % 3) * 0.08)} s={0.8} />)}
        {[0, 1].map((i) => <Chibi key={'f' + i} x={1120 + i * 300} y={900} s={0.5} {...NATIVE(i + 2)} pose="pull" seed={'fm' + i} />)}
      </Layer>
      <DarkSign x={540} y={240} k={b.pop(0, 'thousand')} text="~1,000 INSIDE THE WALLS" size={34} />
      <DarkSign x={1360} y={240} k={b.pop(1, '10000')} text="~10,000 IN THE VALLEY" size={34} c="#9FD6CF" />
      <Sign x={1360} y={360} k={b.pop(3, 'corn')} text="CORN" size={40} bg={GOLD} />
    </CameraRig>
  );
};

// c042-c045: trade routes: shells from the Gulf, copper from the Great Lakes.
const Trade: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const { g } = b;
  const cam = camAt(-87, 37, 5.2);
  const mv = P(-87.63, 33.0), gulf = P(-88.2, 29.6), lakes = P(-88, 46.8);
  const shells = b.gAt(0, 'shells'), copper = b.gAt(0, 'copper');
  const mvS = toScreen(cam, mv[0], mv[1]);
  return (
    <>
      <OldWorld cam={cam} land="#EFE3C4" al={null}>
        <FlowLines pts={[gulf, mv]} cam={cam} start={b.loc(shells < -900 ? -60 : shells)} step={30} color="#E8C65A" bend={0.2} />
        <FlowLines pts={[lakes, mv]} cam={cam} start={b.loc(copper < -900 ? -60 : copper)} step={30} color="#C8712B" bend={0.2} />
        <circle cx={mv[0]} cy={mv[1]} r={1.6} fill={RED} stroke={OL} strokeWidth={0.35} />
      </OldWorld>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <MapTag x={mvS.x} y={mvS.y - 50} text="MOUNDVILLE" k={springPop(g, 4)} size={32} />
        <MapTag x={1240} y={780} text="SHELLS FROM THE GULF" k={springPop(b.f, b.at(0, 'shells'))} size={30} bg="#2F5E7A" />
        <MapTag x={1240} y={170} text="COPPER FROM THE GREAT LAKES" k={springPop(b.f, b.at(0, 'copper')) || (b.k > 0 ? 1 : 0)} size={30} bg="#8A4A1E" />
        <MapTag x={560} y={330} text="ONE OF THE BIGGEST TOWNS IN NORTH AMERICA" k={springPop(b.f, b.at(3, 'biggest'))} size={28} bg={RED} />
        <Rider x={1650} y={620} s={0.4} arm="point" expr="proud" talking={talk(s)} flip />
      </svg>
    </>
  );
};

// c046-c048: Moundville empties out. Slow, quiet, no people.
const Empty: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const { g, gd } = b;
  const dusk = interpolate(g, [0, gd], [0, 0.55]);
  return (
    <CameraRig move={{ zoomFrom: 1.04, zoomTo: 1, focus: [960, 600] }}>
      <Sky id="skyDawn" />
      <Layer depth={0.5}><Hills y={560} fill="#7E9E62" amp={30} seed="mv" /></Layer>
      <Layer depth={1}>
        <rect x={-200} y={560} width={2400} height={600} fill="#9CB874" />
        <ellipse cx={960} cy={700} rx={520} ry={110} fill="#B9C48A" />
        {MOUNDS.map((m, i) => <Mound key={i} x={m.x} y={m.y} w={m.w * 0.8} h={m.h} c="#8DAA62" />)}
        <Mound x={960} y={640} w={420} h={300} c="#8DAA62" />
        {Array.from({ length: 26 }, (_, i) => <path key={i} d={`M${(i * 83) % 1920} ${760 + (i * 47) % 300} q4 -${20 + (i % 3) * 8} ${8 + Math.sin(g / 20 + i) * 3} -${30 + (i % 4) * 6}`} stroke="#5E7A3A" strokeWidth={4} fill="none" />)}
      </Layer>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#1A2030" opacity={dusk} />
      <Rider x={1600} y={360} s={0.36} arm="idle" expr="smile" talking={talk(s)} flip />
    </CameraRig>
  );
};

// c049-c053: the nations, and the Alabama where two rivers meet.
const NATIONS: [string, number, number, number][] = [
  ['CREEK', -86.0, 32.9, 0], ['CHEROKEE', -85.8, 34.5, 1], ['CHOCTAW', -88.1, 32.0, 2], ['CHICKASAW', -88.0, 34.4, 3],
];
const Nations: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const X = 900, Y = 540, H = 820;
  const W = ['creek', 'cherokee', 'choctaw', 'chickasaw'];
  const conf = at(X, Y, H, 'Montgomery');
  const rivers = b.gAt(3, 'rivers');
  const rp = rivers < -900 ? 1 : rivers > 9e4 ? 0 : interpolate(b.g, [rivers, rivers + 30], [0, 1]);
  const coosa: [number, number] = [conf[0] + 20, conf[1] - 330], tall: [number, number] = [conf[0] + 240, conf[1] - 60], ala: [number, number] = [conf[0] - 230, conf[1] + 150];
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [X, Y] }}>
      <InsertBg />
      <Layer depth={1}>
        <AlMap x={X} y={Y} h={H} fill="#E9D9B0" neighbours={false} />
        {rp > 0 && <g fill="none" stroke="#4682B4" strokeWidth={8} strokeLinecap="round">
          <path d={`M${coosa[0]} ${coosa[1]} Q${conf[0] - 40} ${conf[1] - 150} ${conf[0]} ${conf[1]}`} strokeDasharray="600" strokeDashoffset={600 * (1 - rp)} />
          <path d={`M${tall[0]} ${tall[1]} Q${conf[0] + 100} ${conf[1] + 20} ${conf[0]} ${conf[1]}`} strokeDasharray="400" strokeDashoffset={400 * (1 - rp)} />
          <path d={`M${conf[0]} ${conf[1]} Q${conf[0] - 120} ${conf[1] + 40} ${ala[0]} ${ala[1]}`} strokeDasharray="400" strokeDashoffset={400 * (1 - rp)} strokeWidth={11} />
        </g>}
        {NATIONS.map(([n, lon, lat, i]) => {
          const p = at(X, Y, H, 'Montgomery');
          const q = [X + (p[0] - X) + (lon + 86.3) * (H / 25.5) * (1920 / 360), Y + (p[1] - Y) - (lat - 32.37) * (H / 25.5) * (1920 / 360)];
          return <MapTag key={n} x={q[0]} y={q[1]} text={n} k={springPop(b.f, b.at(2, W[i])) || (b.k > 2 ? 1 : 0)} size={36} bg={['#2F5E3A', '#7A3A1A', '#2F5E7A', '#6A4A8A'][i]} />;
        })}
        <Pin p={conf} t={b.k === 4 ? b.at(4, 'alabama') : b.k > 4 ? -99 : 99999} label="THE ALABAMA" c={GOLD} star dx={30} dy={30} size={34} />
        <Sign x={1500} y={260} k={b.pop(1, 'nations')} text="NEW NATIONS" size={44} />
        <Rider x={1560} y={600} s={0.42} arm="point" expr="smile" talking={talk(s)} flip />
      </Layer>
    </CameraRig>
  );
};

// c054-c056: "Hold on to that name."
const Name: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const { g } = b;
  const cast2 = b.k === 2 ? b.gAt(2, '200') : b.k > 2 ? -999 : 99999;
  const casts = [16, cast2];
  const c1 = fishCard(g, 16, 400), c2 = fishCard(g, cast2, 800);
  return (
    <Stage>
      {c1 && <g transform={`rotate(${c1.swing} 1110 ${c1.y - 90})`}><g transform={`translate(1110 ${c1.y})`}>
        <rect x={-260} y={-90} width={520} height={180} rx={16} fill={PAPER} stroke={OL} strokeWidth={6} />
        <Txt y={20} t="ALABAMA = ?" size={72} c={RED} />
      </g></g>}
      {c2 && <g transform={`rotate(${c2.swing} 1110 ${c2.y - 30})`}><g transform={`translate(1110 ${c2.y})`}>
        <rect x={-250} y={-34} width={500} height={68} rx={10} fill="#26343A" stroke={OL} strokeWidth={5} />
        <Txt y={14} t="~200 YEARS OF ARGUING" size={34} c={GOLD} />
      </g></g>}
      {b.on(1, 'arguing') && ['?', '?!', '??', '?'].map((q, i) => <Txt key={i} x={900 + i * 150} y={680 + Math.sin(g / 6 + i) * 14} t={q} size={60} c={INK} o={0.7} />)}
      <FishHost t={g} X={1620} casts={casts} talking={talk(s)} lines={[c1?.line ? { x: 1110, y: c1.y - 90 } : null, c2?.line ? { x: 1110, y: c2.y - 34 } : null].filter(Boolean) as { x: number; y: number }[]} />
    </Stage>
  );
};

export const SHOTS_FIRST: ShotMap = {
  fa_back: Back, fa_cave: Cave, fa_build: Build, fa_mounds: Mounds, fa_people: People, fa_trade: Trade, fa_empty: Empty, fa_nations: Nations, fa_name: Name,
};
