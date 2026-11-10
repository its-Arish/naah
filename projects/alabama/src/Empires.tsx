/** Empires, part 1 (2:27 to 3:35): de Soto marches in, Tascalusa, Mabila (quiet), the town never found (quiet). */
import React from 'react';
import { interpolate, Easing, springPop } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { OL, Hills, Tree, Cloud } from '@engine/scenes/Parts';
import { Chibi } from '@engine/characters/Chibi';
import { SKIN } from '@engine/cast/Wardrobe';
import { talk, type ShotMap, type SP } from '@engine/kit';
import { Stage } from '@engine/moves';
import { MapTag, camAt, P, toScreen } from '@engine/qgis/QgisMap';
import { PAPER, RED, GOLD, INK, Rider, OldWorld, alPt } from './Kit';
import { useBeat, HostS, Sign, DarkSign, Pop, Txt, Sky, Quiet } from './Kit2';
import { Heli } from './Moves';
import { AlMap, Route, routeHead, Palisade, Pig, Dog, Chest, ease } from './KitAL';

const SPANIARD = (i: number) => ({ outfit: { top: '#8E9098', bottom: ['#7A2A1E', '#5A3A22', '#2E4A6A'][i % 3], belt: '#3A2A1A' }, hat: 'helmet', hatColor: '#B8B8C0', item: i % 2 ? 'spear' : 'sword', skin: SKIN.light, beard: i % 2 === 0, beardColor: '#3A2416' });
const CHIEF = { outfit: { top: '#A8744A', bottom: '#7A5234', sash: '#B3261E', cape: '#5A2A1E' }, hat: 'hairlong', hatColor: '#1A1410', hair: '#1A1410', skin: SKIN.brown };

// c057-c060: de Soto's route through the Southeast into Alabama; the parade follows on its words.
const ROUTE_LL: [number, number][] = [[-82.6, 27.9], [-84.3, 30.4], [-83.6, 32.8], [-81.0, 34.0], [-82.6, 35.4], [-85.0, 34.4], [-86.36, 33.28], [-86.2, 32.5], [-87.5, 32.0]];
const RouteShot: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const { g, gd } = b;
  const cam = camAt(-84.6, 31.8, 13);
  const pts = ROUTE_LL.map(([lon, lat]) => { const [x, y] = P(lon, lat); const q = toScreen(cam, x, y); return [q.x, q.y] as [number, number]; });
  const p = interpolate(g, [10, gd - 20], [0, 1], Easing.inOut);
  const head = routeHead(pts, p);
  const parade = [
    { at: b.gAt(1, 'soldiers'), el: <Chibi x={0} y={0} s={0.42} {...SPANIARD(0)} legs="march" seed="sp0" /> },
    { at: b.gAt(1, 'soldiers') + 4, el: <Chibi x={0} y={0} s={0.42} {...SPANIARD(1)} legs="march" seed="sp1" delay={6} /> },
    { at: b.gAt(2, 'dogs'), el: <Dog s={0.7} f={g} /> },
    { at: b.gAt(2, 'pigs'), el: <Pig s={0.75} f={g} /> },
    { at: b.gAt(2, 'pigs') + 5, el: <Pig s={0.65} f={g + 7} /> },
  ];
  return (
    <>
      <OldWorld cam={cam} land="#EFE3C4" al="#F3D6A0" />
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <Route pts={pts} p={p} />
        <g transform={`translate(${head[0]} ${head[1]})`}><circle r={16} fill={RED} stroke={OL} strokeWidth={4} /></g>
        <MapTag x={300} y={250} text="1540" k={springPop(g, 2)} size={54} bg={RED} />
        <MapTag x={pts[0][0] + 120} y={pts[0][1] - 60} text="DE SOTO LANDS, 1539" k={springPop(g, 8)} size={24} />
        <MapTag x={pts[8][0] - 30} y={pts[8][1] + 60} text="ALABAMA" k={springPop(b.f, b.at(1, 'region'))} size={28} bg="#8A5A34" />
        {/* the parade strip */}
        <rect x={0} y={700} width={1000} height={170} rx={0} fill="rgba(26,20,16,0.45)" />
        {parade.map((q, i) => {
          const a = q.at > 9e4 ? 0 : q.at < -900 ? 1 : Math.max(0, springPop(g, q.at));
          if (a <= 0) return null;
          const x = 300 + i * 150 + ((g * 1.6) % 40);
          return <g key={i} transform={`translate(${x} 850) scale(${a})`}>{q.el}</g>;
        })}
        <Rider x={1660} y={330} s={0.4} arm="point" expr="grin" talking={talk(s)} flip />
      </svg>
    </>
  );
};

// c061-c062: looking for gold; the chest is empty.
const GoldShot: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const open = interpolate(b.f, [b.at(1, 'find'), b.at(1, 'find') + 10], [0, 1], Easing.out);
  return (
    <Stage>
      <Pop k={b.pop(0, 'gold')} x={1110} y={640}><Chest s={1.2} open={b.k === 1 ? open : 0} /></Pop>
      {b.k === 1 && b.f >= b.at(1, 'any') && [0, 1, 2].map((i) => { const t = b.f - b.at(1, 'any'); return <circle key={i} cx={1060 + i * 50} cy={520 - t * 1.5} r={14 + t * 0.6} fill="#CFC6B2" opacity={Math.max(0, 0.8 - t / 30)} />; })}
      <Sign x={1110} y={320} k={b.pop(1, 'any')} text="GOLD FOUND: 0" size={40} bg={RED} c="#fff" rot={-3} />
      <Heli t={b.g - 4} X={1620} talking={talk(s)} />
    </Stage>
  );
};

// c063-c068: Chief Tascalusa, taller than any Spaniard; taken hostage. Respectful, no gags.
const ChiefShot: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const { k } = b;
  const hostage = k >= 4;
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [900, 700] }}>
      <Sky id="skyDay" />
      <Layer depth={0.4}><Hills y={600} fill="#7E9E62" amp={40} seed="tc" /><Cloud x={500} y={180} /></Layer>
      <Layer depth={1}>
        <rect x={-200} y={600} width={2400} height={600} fill="#9CB874" />
        {[[80, 640], [1700, 660]].map(([x, y], i) => <Tree key={i} x={x} y={y} s={1.1} />)}
        <Chibi x={780} y={930} s={1.25} {...CHIEF} pose={hostage ? 'cross' : 'idle'} expr={hostage ? 'determined' : 'calm'} seed="chief" />
        {[0, 1, 2].map((i) => <Chibi key={i} x={1060 + i * 150} y={930} s={0.95} {...SPANIARD(i)} flip expr={i === 0 && hostage ? 'angry' : 'normal'} pose={i === 0 && hostage ? 'point' : 'hold'} seed={'sx' + i} />)}
        {/* height marks */}
        {b.on(2, 'taller') && <g>
          <line x1={640} y1={930 - 1.25 * 330} x2={1500} y2={930 - 1.25 * 330} stroke={GOLD} strokeWidth={5} strokeDasharray="14 10" />
          <line x1={1000} y1={930 - 0.95 * 330} x2={1500} y2={930 - 0.95 * 330} stroke="#CFC6B2" strokeWidth={4} strokeDasharray="10 10" />
        </g>}
      </Layer>
      <DarkSign x={780} y={170} k={b.pop(1, 'tascalusa')} text="CHIEF TASCALUSA" size={42} />
      <Sign x={1360} y={170} k={b.pop(3, 'chronicler')} text="— THE CHRONICLERS" size={28} />
      <Pop k={b.pop(4, 'demands')} x={1360} y={300} rot={3}>
        <rect x={-200} y={-60} width={400} height={120} rx={8} fill={PAPER} stroke={OL} strokeWidth={4} />
        <Txt y={-10} t="DEMANDS:" size={28} c={RED} />
        <Txt y={34} t={b.on(5, 'food') || k > 5 ? 'PORTERS + FOOD' : 'PORTERS'} size={30} />
      </Pop>
      <Rider x={300} y={300} s={0.38} arm="point" expr="worried" talking={talk(s)} />
    </CameraRig>
  );
};

// c069-c071: "Fine. Follow me." The road to the walled town.
const FollowShot: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const { g, gd } = b;
  const walk = interpolate(g, [0, gd], [0, 260]);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.08, focus: [1200, 600] }}>
      <Sky id="skyDawn" />
      <Layer depth={0.4}><Hills y={560} fill="#6E8A5A" amp={30} seed="fw" /></Layer>
      <Layer depth={1}>
        <rect x={-200} y={560} width={2400} height={600} fill="#8DA862" />
        <path d="M-200 1000 Q600 760 1500 600 L1560 610 Q700 820 200 1100 Z" fill="#C9B98A" />
        <g transform="translate(1500 600) scale(0.55)"><Palisade x1={-260} x2={260} y={0} h={170} /></g>
        <Chibi x={420 + walk} y={930 - walk * 0.55} s={0.8} {...CHIEF} legs="walk" pose="point" expr="calm" seed="cw" />
        {[0, 1, 2].map((i) => <Chibi key={i} x={180 + walk - i * 120} y={980 - (walk - i * 120) * 0.4} s={0.7} {...SPANIARD(i)} legs="march" seed={'fw' + i} delay={i * 5} />)}
      </Layer>
      <Sign x={1500} y={430} k={b.pop(2, 'mabila')} text="MABILA" size={46} />
      <Rider x={1660} y={260} s={0.38} arm="point" expr="worried" talking={talk(s)} flip />
    </CameraRig>
  );
};

// c072-c078 (quiet): October 18, 1540. Palisade in silhouette; a glow behind it at "fire". No figures, no violence.
const MabilaShot: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const { g } = b;
  const fire = b.gAt(3, 'fire');
  const glow = fire > 9e4 ? 0 : fire < -900 ? 1 : ease(g, fire, 60);
  const dead = b.gAt(4, 'thousands');
  return (
    <Quiet tone="#161A20">
      <rect width={1920} height={1080} fill="#5A2A18" opacity={0.35 * glow} />
      <ellipse cx={960} cy={760} rx={900} ry={260} fill="url(#warmGlow)" opacity={0.55 * glow} />
      {glow > 0 && Array.from({ length: 6 }, (_, i) => { const t = (g * 0.4 + i * 40) % 240; return <circle key={i} cx={500 + i * 180 + Math.sin(t / 30) * 30} cy={700 - t * 2} r={60 + t * 0.6} fill="#3A3030" opacity={Math.max(0, 0.35 - t / 700) * glow} />; })}
      <Palisade x1={180} x2={1740} y={860} h={230} dark />
      <rect y={860} width={1920} height={220} fill="#0E1116" />
      <text x={960} y={200} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#9AA4B0" opacity={ease(g, 0, 40)}>OCTOBER 18, 1540</text>
      <text x={960} y={290} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#C9B8A0" opacity={dead > 9e4 ? 0 : ease(g, dead < -900 ? 0 : dead, 40)}>THOUSANDS DIED</text>
    </Quiet>
  );
};

// c079-c080 (quiet): the site has never been found.
const UnknownShot: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const { g } = b;
  const X = 960, Y = 520, H = 760;
  const q = alPt(X, Y, H, -87.6, 32.25);
  const ring = ease(g, 10, 40);
  return (
    <Quiet tone="#161A20">
      <g opacity={ease(g, 0, 30)}><AlMap x={X} y={Y} h={H} fill="#2E3540" nbFill="#20262E" nbStroke="#3A424C" /></g>
      <g transform={`translate(${q[0]} ${q[1]})`} opacity={ring}>
        <circle r={150} fill="none" stroke="#C9B8A0" strokeWidth={5} strokeDasharray="14 14" transform={`rotate(${g * 0.3})`} />
        <text y={26} textAnchor="middle" fontFamily="TagBold" fontSize={90} fill="#C9B8A0">?</text>
      </g>
      <text x={960} y={200} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#C9B8A0" opacity={ease(g, Math.max(0, b.gAt(1, 'never') > 9e4 ? 99999 : b.gAt(1, 'never') < -900 ? 0 : b.gAt(1, 'never')), 30)}>MABILA: SITE NEVER FOUND</text>
    </Quiet>
  );
};

export const SHOTS_EMPIRES: ShotMap = {
  em_route: RouteShot, em_gold: GoldShot, em_chief: ChiefShot, em_follow: FollowShot, em_mabila: MabilaShot, em_unknown: UnknownShot,
};
