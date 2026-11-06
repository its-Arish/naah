/** Act 1: Six Flags. Native nations, Spain, France, Mexico, the newcomers. */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop, random } from '@engine/lib/core';
import { wordAt, talk, Rider as HorseRider, type ShotMap } from '@engine/kit';
import { Label } from '@engine/fx/Overlays';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { OL, Hills, Cloud } from '@engine/scenes/Parts';
import { Chibi } from '@engine/characters/Chibi';
import { WorldMap, camAt, moveCam, toScreen, MapTag, MapPin, P, type QData } from '@engine/qgis/QgisMap';
import raw from './qgis.json';
import { TxMap, MapNarr, scr, FlagArt, Rider, Stage, Insert, Narr, FlagRail, TexasShape, txXY, txH, Tag, Star, RED, BLUE, GOLD, INK, PAPER, type SP } from './Kit';

const QD = raw as unknown as QData;
const RAIL = { x: 780, y: 820, s: 0.7 };
/** rail state per beat: how many flags are up (and which flag is drooping) */
const Rail: React.FC<{ up: number; raiseAt?: number; droop?: number; dim?: number[] }> = ({ up, raiseAt, droop = 0, dim }) => {
  const f = useCurrentFrame();
  const raised = [0, 1, 2, 3, 4, 5].map((i) => {
    if (i < up - 1) return 1;
    if (i === up - 1) return raiseAt === undefined ? 1 : interpolate(f, [raiseAt, raiseAt + 18], [0, 1], Easing.out);
    return 0;
  });
  if (droop > 0) raised[1] = 1 - droop * 0.75;
  return <FlagRail x={RAIL.x} y={RAIL.y} s={RAIL.s} raised={raised} dim={dim} />;
};

// ------------------------------------------------------------------ host beats
const a1Intro: React.FC<SP> = ({ s }) => <Stage><Narr s={s} keys={[{ at: 0, arm: 'chin', expr: 'smile' }, { at: 20, arm: 'finger', expr: 'smile' }]} /></Stage>;
const a1Hands: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <g opacity={interpolate(f, [0, 12], [0, 1])}><Rail up={0} /></g>
      <Narr s={s} keys={[{ at: 0, arm: 'present', expr: 'smile' }]} point={[{ x: 1000, y: 640, at: 16 }]} />
    </Stage>
  );
};
const a1Behind: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const flick = Math.floor(f / 6) % 7;
  return (
    <Stage>
      <Rail up={0} />
      {flick < 6 && <g transform={`translate(${RAIL.x + 40 + flick * 92} ${RAIL.y - 210})`}><circle r={26} fill={GOLD} opacity={0.6} /></g>}
      <Narr s={s} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at: wordAt(s, 'vote'), arm: 'finger', expr: 'grin' }]} point={[{ x: 1050, y: 620, at: 14 }]} />
    </Stage>
  );
};
const a1Flags: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'flags') - 10;
  const raised = [0, 1, 2, 3, 4, 5].map((i) => interpolate(f, [at + i * 5, at + i * 5 + 14], [0, 1], Easing.out));
  return <Stage><FlagRail x={RAIL.x} y={RAIL.y} s={RAIL.s} raised={raised} /><Narr s={s} keys={[{ at: 0, arm: 'present', expr: 'proud' }]} point={[{ x: 1000, y: 620, at: wordAt(s, 'flags') }]} /></Stage>;
};
const a1Spain: React.FC<SP> = ({ s }) => <Stage><Rail up={1} raiseAt={wordAt(s, 'Spain') - 6} /><Narr s={s} keys={[{ at: 0, arm: 'finger', expr: 'smile' }]} point={[{ x: 830, y: 640, at: wordAt(s, 'Spain') }]} /></Stage>;
const a1France: React.FC<SP> = ({ s }) => <Stage><Rail up={2} raiseAt={wordAt(s, 'France') - 6} /><Narr s={s} keys={[{ at: 0, arm: 'finger', expr: 'grin' }]} point={[{ x: 890, y: 640, at: wordAt(s, 'France') }]} /></Stage>;
const a1Badly: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'not');
  return <Stage><Rail up={2} droop={interpolate(f, [at, at + 20], [0, 1], Easing.in)} /><Narr s={s} keys={[{ at: 0, arm: 'idle', expr: 'smile' }, { at, arm: 'shrug', expr: 'worried' }]} point={[{ x: 890, y: 660, at: at }]} /></Stage>;
};
const a1Border: React.FC<SP> = ({ s }) => (
  <Stage>
    <TexasShape x={930} y={340} w={400} fill={PAPER} sw={6} dash="18 12" />
    <Narr s={s} keys={[{ at: 0, arm: 'idle', expr: 'smile' }]} staffMode="level" />
  </Stage>
);
const a1Fills: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'fills');
  const n = Math.floor(interpolate(f, [at, at + 50], [0, 40], Easing.out));
  const yrAt = wordAt(s, '2026');
  return (
    <Stage>
      <TexasShape x={930} y={340} w={400} fill={PAPER} sw={6} clipId="a1fill">
      </TexasShape>
      {[...Array(n)].map((_, i) => { const [x, y] = txXY(-102.5 + random('px' + i) * 7.5, 29.0 + random('py' + i) * 4.5, 930, 340, 400); return <g key={i} transform={`translate(${x} ${y}) scale(${springPop(f, at + i * 1.2)})`}><circle cy={-14} r={6} fill={INK} /><path d="M-7 0 Q0 -12 7 0 Z" fill={INK} /></g>; })}
      <Tag x={1100} y={300} text="2026" k={springPop(f, yrAt)} size={40} bg={GOLD} />
      <Narr s={s} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at: yrAt, arm: 'finger', expr: 'grin' }]} point={[{ x: 1050, y: 470, at: wordAt(s, 'fills') }, { x: 1100, y: 310, at: yrAt }]} />
    </Stage>
  );
};
const a1Mexico: React.FC<SP> = ({ s }) => <Stage><Rail up={3} raiseAt={wordAt(s, 'Mexico') - 6} /><Narr s={s} keys={[{ at: 0, arm: 'finger', expr: 'smile' }]} point={[{ x: 950, y: 640, at: wordAt(s, 'Mexico') }]} /></Stage>;
const a1Risky: React.FC<SP> = ({ s }) => <Stage><Rail up={3} /><Narr s={s} keys={[{ at: 0, arm: 'chin', expr: 'worried' }]} /></Stage>;
const a1Invite: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'Americans');
  const mat = springPop(f, at);
  return (
    <Stage>
      <Rail up={3} />
      {mat > 0 && <g transform={`translate(1060 560) scale(${mat}) rotate(-4)`}><rect x={-170} y={-50} width={340} height={100} rx={16} fill="#B5651D" stroke={OL} strokeWidth={6} /><text y={18} textAnchor="middle" fontFamily="TagBold" fontSize={54} fill="#FFE9A0">WELCOME!</text></g>}
      <Narr s={s} keys={[{ at: 0, arm: 'idle', expr: 'smile' }, { at, arm: 'present', expr: 'grin' }]} point={[{ x: 1060, y: 560, at: at + 4 }]} />
    </Stage>
  );
};
const a1Grip: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return <Stage shakes={[{ at: 6, amp: 4, len: 14 }]}><g transform={`translate(${Math.sin(f) * 3} 0)`}><Rail up={3} /></g><Narr s={s} keys={[{ at: 0, arm: 'fist', expr: 'worried' }]} /></Stage>;
};
const a1Push: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 16], [0, 1], Easing.out);
  return (
    <Stage>
      <Rail up={3} />
      <g transform="translate(1060 520) scale(1.6)">
        <path d={`M${-200 + p * 60} 0 h120 l-20 -24 m20 24 l-20 24`} stroke={RED} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M${200 - p * 60} 0 h-120 l20 -24 m-20 24 l20 24`} stroke="#006847" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Narr s={s} keys={[{ at: 0, arm: 'fist', expr: 'smile' }]} point={[{ x: 1060, y: 520, at: 14 }]} />
    </Stage>
  );
};
const Wagon: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-110 -60 Q-110 -160 0 -160 Q110 -160 110 -60 Z" fill="#F4ECD8" stroke={OL} strokeWidth={6} />
      {[-60, 0, 60].map((a) => <path key={a} d={`M${a} -60 Q${a * 1.05} -150 ${a * 0.9} -158`} stroke="#C9B48A" strokeWidth={4} fill="none" />)}
      <rect x={-130} y={-62} width={260} height={46} rx={6} fill="#8B5A2B" stroke={OL} strokeWidth={6} />
      {[-80, 80].map((wx) => <g key={wx} transform={`translate(${wx} -10) rotate(${f * 6})`}><circle r={34} fill="none" stroke={OL} strokeWidth={8} /><path d="M-34 0 H34 M0 -34 V34" stroke={OL} strokeWidth={5} /></g>)}
    </g>
  );
};
const a1First: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <Wagon x={interpolate(f, [0, 30], [700, 1060], Easing.out)} y={700} s={1.25} />
      <Tag x={1060} y={420} text="NEWCOMERS" k={springPop(f, wordAt(s, 'newcomers'))} size={44} />
      <Narr s={s} keys={[{ at: 0, arm: 'present', expr: 'smile' }]} point={[{ x: 1060, y: 600, at: wordAt(s, 'newcomers') }]} />
    </Stage>
  );
};
const a1Last: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'last');
  return (
    <Stage zoom={[1.03, 1.08]}>
      <Wagon x={1060} y={700} s={1.25} />
      <Tag x={1060} y={420} text="NEWCOMERS" size={44} />
      <Tag x={1060} y={790} text="…not the last" k={springPop(f, at)} size={40} bg={GOLD} rot={-5} />
      <Narr s={s} keys={[{ at: 0, arm: 'finger', expr: 'smile' }, { at, arm: 'point', expr: 'grin' }]} point={[{ x: 1060, y: 790, at: at + 2 }]} />
    </Stage>
  );
};

// ------------------------------------------------------------------ the land (GIS map): modern red/blue drains to terrain, then the Native nations
/** camera target per Native beat (lon, lat, zoom) */
const NAT_CAM: Record<string, [number, number, number]> = { a1_native: [-99.6, 31.2, 11.5], a1_caddo: [-95.6, 31.8, 16], a1_karank: [-96.8, 28.6, 16], a1_comanche: [-101.2, 33.2, 13] };
const NAT_PREV: Record<string, string> = { a1_caddo: 'a1_native', a1_karank: 'a1_caddo', a1_comanche: 'a1_karank' };
const natCam = (id: string, f: number) => {
  const to = NAT_CAM[id] ?? NAT_CAM.a1_native, from = NAT_CAM[NAT_PREV[id] ?? id];
  return moveCam(f, camAt(from[0], from[1], from[2]), camAt(to[0], to[1], to[2]), 0, 30);
};
const Terrain: React.FC<{ s: SP['s']; drain?: boolean; tags: { name: string; lon: number; lat: number; at: number }[]; extras?: (cam: ReturnType<typeof camAt>) => React.ReactNode; fly: [number, number] }> = ({ s, drain, tags, extras, fly }) => {
  const f = useCurrentFrame();
  const cam = natCam(s.id, f);
  const k = drain ? interpolate(f, [8, 40], [0, 1], Easing.inOut) : 1; // 0 = modern map, 1 = terrain
  const [gx0] = P(-106.7, 30), [gx1] = P(-93.5, 30);
  const terrain = (
    <>
      <defs><linearGradient id="txTerrain" gradientUnits="userSpaceOnUse" x1={gx0} y1={0} x2={gx1} y2={0}><stop offset="0" stopColor="#D2B47C" /><stop offset="0.55" stopColor="#B9B56E" /><stop offset="1" stopColor="#6E9A55" /></linearGradient></defs>
      <rect x={gx0 - 10} y={0} width={gx1 - gx0 + 20} height={960} fill="url(#txTerrain)" />
      <g opacity={1 - k}>
        <rect x={gx0 - 10} y={0} width={gx1 - gx0 + 20} height={960} fill={RED} />
        {[[-96.8, 32.8], [-95.4, 29.8], [-97.7, 30.3], [-98.5, 29.4], [-106.4, 31.8], [-97.9, 26.2]].map(([lo, la], i) => { const [cx, cy] = P(lo, la); return <circle key={i} cx={cx} cy={cy} r={2.4} fill={BLUE} />; })}
      </g>
      {/* rivers: Brazos, Trinity/Red, Rio Grande */}
      {[[[-101.5, 33.6], [-99.5, 31.8], [-96.4, 28.6]], [[-97.6, 33.4], [-96.2, 31.8], [-94.8, 29.6]], [[-106.5, 31.8], [-104.0, 29.6], [-101.4, 29.8], [-99.2, 27.0], [-97.2, 25.9]]].map((r, i) => {
        const pts = r.map(([lo, la]) => P(lo, la));
        return <polyline key={i} points={pts.map((q) => q.join(',')).join(' ')} stroke="#4F86A8" strokeWidth={2.4} fill="none" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity={k} />;
      })}
    </>
  );
  const flyTo = scr(cam, fly[0], fly[1]);
  const rx = interpolate(f, [0, 34], [flyTo.x + 420, flyTo.x + 120], Easing.out);
  const ry = flyTo.y - 230 + Math.sin(f / 9) * 10;
  return (
    <>
      <TxMap cam={cam} txFill="#C9B07A" clip={terrain} overlay={<>
        {extras?.(cam)}
        {tags.map((tg) => { const q = scr(cam, tg.lon, tg.lat); return <MapTag key={tg.name} x={q.x} y={q.y} text={tg.name} k={springPop(f, tg.at)} size={40} />; })}
        <Rider x={Math.min(rx, 1700)} y={Math.max(ry, 220)} s={0.34} speed={f < 34 ? 0.9 : 0.15} flip arm="point" expr="grin" talking={talk(s)} />
      </>} />
    </>
  );
};
const NAT_ORDER = ['a1_native', 'a1_caddo', 'a1_karank', 'a1_comanche'];
const NATIVE = (s: SP['s']) => {
  const me = NAT_ORDER.indexOf(s.id);
  return ([['Caddo', -95.2, 32.2, 1], ['Karankawa', -96.4, 28.4, 2], ['Comanche', -101.4, 33.4, 3]] as const).map(([name, lon, lat, i]) => ({
    name, lon, lat, at: me === i ? Math.max(4, wordAt(s, name) - 4) : me > i ? -99 : 99999,
  }));
};
const a1Native: React.FC<SP> = ({ s }) => <Terrain s={s} drain tags={NATIVE(s)} fly={[-99.5, 31.5]} />;
const Hut2: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => (<g transform={`translate(${x} ${y}) scale(${k})`}><path d="M-34 0 Q-34 -60 0 -70 Q34 -60 34 0 Z" fill="#C9A66B" stroke={OL} strokeWidth={4} /><path d="M-8 0 V-20 H8 V0" fill={OL} /></g>);
const a1Caddo: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'farmed');
  return <Terrain s={s} tags={NATIVE(s)} fly={[-95.2, 32.2]} extras={(cam) => { const q = scr(cam, -95.0, 31.3); return [0, 1, 2].map((i) => <Hut2 key={i} x={q.x - 70 + i * 70} y={q.y + (i % 2) * 18} k={springPop(f, at + i * 4)} />); }} />;
};
const a1Karank: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return <Terrain s={s} tags={NATIVE(s)} fly={[-96.4, 28.4]} extras={(cam) => { const q = scr(cam, -95.9, 27.9); return (
    <g transform={`translate(${q.x} ${q.y + Math.sin(f / 6) * 5}) rotate(${Math.sin(f / 8) * 4}) scale(1.3)`}>
      <path d="M-60 0 Q0 22 60 0 Q50 -6 -50 -6 Z" fill="#8B5A2B" stroke={OL} strokeWidth={4} />
      <circle cx={0} cy={-26} r={10} fill={OL} /><path d="M0 -16 V-6" stroke={OL} strokeWidth={6} /><path d="M14 -24 L40 14" stroke={OL} strokeWidth={4} />
    </g>); }} />;
};
const a1Comanche: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const dur = useDuration();
  return <Terrain s={s} tags={NATIVE(s)} fly={[-101.4, 33.4]} extras={(cam) => { const a = scr(cam, -103.6, 32.2), b = scr(cam, -99.4, 32.2); return (
    <HorseRider x={interpolate(f, [0, dur], [a.x, b.x])} y={a.y + 40} s={0.42} gait="gallop" silhouette rider={{ outfit: { top: '#6B4A2B' }, hat: 'none', hair: '#1A1A1A', item: 'spear' }} />); }} />;
};

// ------------------------------------------------------------------ Spanish mission on the San Antonio River
const Land: React.FC<{ sky?: string; children?: React.ReactNode; river?: boolean; dusk?: number }> = ({ sky = 'url(#skyDay)', children, river, dusk = 0 }) => (
  <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [960, 560] }}>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={sky} /><Cloud x={420} y={180} s={1.2} /><Cloud x={1420} y={140} s={0.9} /></Layer>
    <Layer depth={0.3}><Hills y={560} fill="#B9B56E" amp={50} seed="tx1" /></Layer>
    <Layer depth={0.6}><Hills y={660} fill="#A8C07A" amp={30} seed="tx2" /></Layer>
    <Layer depth={1}>
      <rect x={-200} y={760} width={2400} height={500} fill="#C9A66B" />
      {river && <path d="M-200 900 C300 840 700 980 1100 900 S1800 860 2200 920" stroke="#5D8FA8" strokeWidth={70} fill="none" strokeLinecap="round" />}
      {children}
      {dusk > 0 && <rect x={-200} y={-200} width={2400} height={1500} fill="#1E2A50" opacity={dusk} />}
    </Layer>
  </CameraRig>
);
const Mission: React.FC<{ x: number; y: number; s?: number; built?: number }> = ({ x, y, s = 1, built = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs><clipPath id="mbuild"><rect x={-300} y={-400 * built} width={600} height={400 * built + 4} /></clipPath></defs>
    <g clipPath="url(#mbuild)">
      <path d="M-260 0 V-180 H-110 Q-80 -300 0 -310 Q80 -300 110 -180 H260 V0 Z" fill="#E7D7B5" stroke={OL} strokeWidth={7} strokeLinejoin="round" />
      <path d="M-50 0 V-100 Q0 -150 50 -100 V0" fill="#6B4E33" stroke={OL} strokeWidth={6} />
      {[-180, 180].map((wx) => <rect key={wx} x={wx - 22} y={-140} width={44} height={56} rx={20} fill="#6B4E33" stroke={OL} strokeWidth={4} />)}
      <rect x={-20} y={-250} width={40} height={50} rx={18} fill="#6B4E33" stroke={OL} strokeWidth={4} />
    </g>
  </g>
);
const a1Mission: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const dur = useDuration();
  const built = interpolate(f, [6, dur - 10], [0.05, 1], Easing.out);
  return (
    <Land river>
      <Mission x={960} y={800} s={0.95} built={built} />
      <Chibi x={1340} y={820} s={0.9} outfit={{ top: '#7A5A3A', robe: true }} hat="none" hair="#3A2A1E" item="book" pose="hold" legs="stand" expr="happy" seed="friar" />
      <Chibi x={560} y={820} s={0.85} outfit={{ top: '#E9D9B8' }} hat="none" hair="#1A1A1A" item="brick" pose="carry" legs="walk" expr="calm" seed="builder" />
      <Narr s={s} x={1700} y={850} scale={0.55} keys={[{ at: 0, arm: 'present', expr: 'smile' }]} point={[{ x: 1000, y: 620, at: 20 }]} />
    </Land>
  );
};
const a1Alamo: React.FC<SP> = ({ s }) => (
  <>
    <Land river><Mission x={960} y={800} s={0.95} built={1} /><Chibi x={1340} y={820} s={0.9} outfit={{ top: '#7A5A3A', robe: true }} hat="none" hair="#3A2A1E" item="book" pose="present" legs="stand" expr="happy" seed="friar" /><Narr s={s} x={1700} y={850} scale={0.55} keys={[{ at: 0, arm: 'idle', expr: 'smile' }, { at: wordAt(s, 'Alamo'), arm: 'point', expr: 'grin' }]} /></Land>
    <Label text="The Alamo" x={960} y={220} at={wordAt(s, 'Alamo')} size={96} color={GOLD} />
  </>
);

// ------------------------------------------------------------------ La Salle's fort on the coast
const Coast: React.FC<{ fort?: number; people?: boolean; dusk?: number; s: SP['s'] }> = ({ s, fort = 1, people = true, dusk = 0 }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [900, 560] }}>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={dusk > 0.3 ? 'url(#skyDawn)' : 'url(#skyDay)'} /><Cloud x={1300} y={170} /></Layer>
      <Layer depth={0.5}>
        <rect x={-200} y={560} width={2400} height={300} fill="#4F86A8" />
        {[...Array(8)].map((_, i) => <path key={i} d={`M${i * 260 - 100 + ((f * 1.5) % 260)} ${620 + (i % 3) * 40} q30 -14 60 0`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.7} />)}
        <g transform={`translate(1500 ${600 + Math.sin(f / 10) * 6})`}><path d="M-140 0 L140 0 L100 50 L-100 50 Z" fill="#6B4A2B" stroke={OL} strokeWidth={5} /><path d="M0 0 V-180" stroke={OL} strokeWidth={6} /><path d="M6 -170 Q80 -110 6 -40 Z" fill="#F4ECD8" stroke={OL} strokeWidth={4} /></g>
      </Layer>
      <Layer depth={1}>
        <path d="M-200 760 Q600 700 1200 760 T2200 740 V1300 H-200 Z" fill="#E6CF9A" />
        <g transform="translate(700 790)">
          {[...Array(12)].map((_, i) => { const k = interpolate(fort, [i / 12, (i + 1) / 12], [0, 1]); return k > 0 ? <path key={i} d={`M${-220 + i * 40} 0 V${-120 * k} l18 -22 l18 22 V0`} fill="#8B5A2B" stroke={OL} strokeWidth={4} /> : null; })}
          {fort > 0.9 && people && <g transform="translate(0 -150)"><line x1={0} y1={0} x2={0} y2={-120} stroke={OL} strokeWidth={6} /><g transform="translate(2 -120)"><FlagArtFr /></g></g>}
        </g>
        {people && <Narr s={s} x={1720} y={860} scale={0.55} flip keys={[{ at: 0, arm: 'point', expr: 'smile' }]} />}
        {!people && <Narr s={s} x={1720} y={860} scale={0.55} keys={[{ at: 0, arm: 'idle', expr: 'worried' }]} />}
        {people && <Chibi x={1050} y={830} s={0.85} outfit={{ top: '#2E4A7A' }} hat="tricorn" hair="#5A3A22" item="hammer" pose="raise" legs="stand" expr="determined" seed="lasalle" />}
        {dusk > 0 && <rect x={-200} y={-200} width={2400} height={1500} fill="#1E2A50" opacity={dusk} />}
      </Layer>
    </CameraRig>
  );
};
const FlagArtFr: React.FC = () => <FlagArt kind="france" w={110} wave={0.6} />;
const a1LaSalle: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const dur = useDuration();
  return <Coast s={s} fort={interpolate(f, [10, dur], [0, 0.6])} />;
};
const a1Fort: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return <Coast s={s} fort={interpolate(f, [0, 30], [0.6, 1], Easing.out)} />;
};
const a1Wiped: React.FC<SP> = ({ s }) => <Coast s={s} fort={1} people={false} dusk={0.45} />;

// ------------------------------------------------------------------ Spain never filled the place
const SPANISH = [['San Antonio', -98.49, 29.42], ['La Bahía (Goliad)', -97.39, 28.67], ['Nacogdoches', -94.65, 31.6]] as const;
const Empty: React.FC<{ s: SP['s']; label?: string; labelAt?: number; hello?: boolean }> = ({ s, label, labelAt = 0, hello }) => {
  const f = useCurrentFrame();
  const cam = moveCam(f, camAt(-99.6, 31.2, 10.2), camAt(-99.6, 31.0, 11.2), 0, 120);
  const lonely = scr(cam, -101.8, 32.6);
  return (
    <>
      <TxMap cam={cam} txFill="#EFE3C8" overlay={<>
        {SPANISH.map(([n, lo, la], i) => { const q = scr(cam, lo, la); return <MapTag key={n} x={q.x} y={q.y - 70} text={n} size={28} k={springPop(f, 14 + i * 8)} />; })}
        {label && <MapTag x={760} y={170} text={label} size={44} k={springPop(f, labelAt)} bg="#7A4E25" />}
        {hello && <><Chibi x={lonely.x} y={lonely.y} s={0.5} outfit={{ top: '#C0392B' }} hat="none" hair="#1A1A1A" pose="wave" legs="stand" expr="happy" seed="lonely" /><text x={lonely.x + 40} y={lonely.y - 110} fontFamily="Hand" fontSize={46} fill={INK} opacity={interpolate(f, [24, 34], [0, 1])}>hello?</text></>}
      </>}>
        {SPANISH.map(([n, lo, la], i) => { const [x, y] = P(lo, la); return <MapPin key={n} x={x} y={y} at={8 + i * 8} z={cam.z} c={RED} />; })}
      </TxMap>
      <MapNarr s={s} x={1680} y={830} scale={0.45} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at: labelAt, arm: 'shrug', expr: 'worried' }]} point={[{ x: 760, y: 170, at: labelAt + 2 }]} />
    </>
  );
};
const a1Held: React.FC<SP> = ({ s }) => <Empty s={s} />;
const a1Few: React.FC<SP> = ({ s }) => <Empty s={s} label="A FEW THOUSAND SETTLERS" labelAt={wordAt(s, 'thousand')} hello />;

// ------------------------------------------------------------------ Mexico inherits Texas (QGIS map)
const MEX_CAM = camAt(-101, 25.5, 4.2);
const MexMap: React.FC<{ s: SP['s']; tint?: number; children?: React.ReactNode }> = ({ s, tint = 1, children }) => {
  const f = useCurrentFrame();
  const cam = moveCam(f, camAt(-100, 30, 3.4), MEX_CAM, 0, 40);
  const txProv = QD.provinces.USA.find((p) => p.name === 'Texas')!;
  return (
    <WorldMap data={QD} cam={cam} fill={(c) => (c.iso === 'MEX' ? '#A9C99A' : c.iso === 'USA' ? '#E8DDC6' : '#EFE6D2')}>
      <path d={txProv.d} fill="#A9C99A" fillOpacity={tint} stroke="#2A1B12" strokeWidth={2.2 / cam.z * 2} strokeDasharray={`${6 / cam.z} ${4 / cam.z}`} />
      {children}
    </WorldMap>
  );
};
const a1Indep: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const t = toScreen(moveCam(f, camAt(-100, 30, 3.4), MEX_CAM, 0, 40), (-99 + 180) * (1920 / 360), (90 - 31) * (1920 / 360));
  const m = toScreen(moveCam(f, camAt(-100, 30, 3.4), MEX_CAM, 0, 40), (-102 + 180) * (1920 / 360), (90 - 23) * (1920 / 360));
  return (
    <>
      <MexMap s={s} />
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <MapTag x={m.x} y={m.y} text="MEXICO, 1821" k={springPop(f, 20)} size={40} />
        <MapTag x={t.x} y={t.y} text="Mexican Texas" k={springPop(f, wordAt(s, 'Texas'))} size={36} bg="#2E5E3A" />
      </svg>
      <MapNarr s={s} x={1680} y={830} scale={0.45} keys={[{ at: 0, arm: 'point', expr: 'smile' }]} point={[{ x: t.x, y: t.y, at: wordAt(s, 'Texas') + 2 }]} />
    </>
  );
};

// ------------------------------------------------------------------ Austin's colony: wagons and cheap land
const a1Austin: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const dur = useDuration();
  const x = interpolate(f, [0, dur], [-200, 700]);
  return (
    <>
      <Land>
        <Wagon x={x} y={850} s={0.9} />
        <Wagon x={x - 380} y={850} s={0.9} />
        <Chibi x={x + 260} y={860} s={0.95} outfit={{ top: '#3A3F4B' }} hat="tophat" hair="#5A3A22" item="scroll" pose="point" legs="walk" expr="determined" seed="austin" />
        {[0, 1, 2].map((i) => <Chibi key={i} x={x - 160 - i * 90} y={870} s={0.75} outfit={{ top: ['#8E5A3A', '#6D7F4E', '#7A6A9A'][i] }} hat="cap" legs="walk" pose="carry" item="bundle" expr="happy" seed={'set' + i} delay={i * 3} />)}
      </Land>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><Rider x={Math.min(1650, x + 600)} y={480 + Math.sin(f / 10) * 12} s={0.36} speed={0.6} arm="point" expr="grin" talking={talk(s)} flip /></svg>
      <Label text="Stephen F. Austin" x={Math.min(1500, x + 260)} y={480} at={wordAt(s, 'Austin')} size={58} color="#fff" />
      <Label text="300 families" x={1460} y={260} at={wordAt(s, '300')} size={70} color={GOLD} />
    </>
  );
};
const a1Cheap: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'cheap');
  return (
    <Land>
      <g transform="translate(1000 820)">
        <line x1={0} y1={0} x2={0} y2={-220} stroke={OL} strokeWidth={10} />
        <rect x={-200} y={-360} width={400} height={150} rx={10} fill="#E9D3A3" stroke={OL} strokeWidth={6} />
        <text y={-268} textAnchor="middle" fontFamily="TagBold" fontSize={58} fill={INK}>LAND</text>
        {springPop(f, at) > 0 && <g transform={`translate(150 -380) rotate(12) scale(${springPop(f, at)})`}><rect x={-120} y={-44} width={240} height={88} rx={14} fill={RED} stroke={OL} strokeWidth={5} /><text y={20} textAnchor="middle" fontFamily="TagBold" fontSize={54} fill="#fff">CHEAP!</text></g>}
      </g>
      <Chibi x={640} y={860} s={0.9} outfit={{ top: '#6D7F4E' }} hat="cap" pose={[{ at: 0, pose: 'idle' }, { at, pose: 'cheer' }]} legs="stand" expr={[{ at: 0, expr: 'calm' }, { at, expr: 'grin' }]} seed="buyer" />
      <Narr s={s} x={1650} y={850} scale={0.55} keys={[{ at: 0, arm: 'idle', expr: 'smile' }, { at, arm: 'present', expr: 'grin' }]} point={[{ x: 1050, y: 470, at: at + 2 }]} />
    </Land>
  );
};

// ------------------------------------------------------------------ slavery (quiet, symbolic) and the 10-to-1 imbalance
const SouthFlow: React.FC<{ s: SP['s']; chain?: boolean; doc?: string; strike?: string; replace?: string }> = ({ s, chain, doc, strike, replace }) => {
  const f = useCurrentFrame();
  const cam = camAt(-91, 31.5, 7);
  const src = [(-86 + 180) * (1920 / 360), (90 - 33) * (1920 / 360)] as const;
  const dst = [(-97 + 180) * (1920 / 360), (90 - 30.5) * (1920 / 360)] as const;
  const p = interpolate(f, [4, 40], [0, 1], Easing.inOut);
  const a = toScreen(cam, src[0], src[1]), b = toScreen(cam, dst[0], dst[1]);
  const txProv = QD.provinces.USA.find((pp) => pp.name === 'Texas')!;
  return (
    <>
      <WorldMap data={QD} cam={cam} fill={(c) => (c.iso === 'MEX' ? '#C9D7BE' : c.iso === 'USA' ? '#E8DDC6' : '#EFE6D2')}>
        <path d={txProv.d} fill="#C9D7BE" stroke="#2A1B12" strokeWidth={2 / cam.z * 2} />
      </WorldMap>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {!doc && <path d={`M${a.x} ${a.y} Q${(a.x + b.x) / 2} ${a.y - 160} ${b.x} ${b.y}`} stroke="#5B4632" strokeWidth={12} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />}
        {chain && <g transform={`translate(${b.x} ${b.y - 30}) scale(${interpolate(f, [40, 56], [0, 1], Easing.out)})`}>{[-1, 0, 1].map((i) => <ellipse key={i} cx={i * 34} cy={0} rx={22} ry={14} fill="none" stroke="#6B6F78" strokeWidth={8} />)}</g>}
        {doc && (
          <g transform={`translate(960 450) scale(${springPop(f, 4)})`}>
            <rect x={-360} y={-220} width={720} height={440} rx={14} fill={PAPER} stroke={OL} strokeWidth={6} />
            <text y={-130} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill={INK}>{doc}</text>
            {strike && <><text y={-20} textAnchor="middle" fontFamily="Hand" fontSize={64} fill={INK}>{strike}</text><line x1={-200} y1={-36} x2={200 * interpolate(f, [24, 40], [-1, 1])} y2={-36} stroke={EMPHC} strokeWidth={8} /></>}
            {replace && <text y={90} textAnchor="middle" fontFamily="Hand" fontSize={58} fill="#5B4632" opacity={interpolate(f, [40, 54], [0, 1])}>{replace}</text>}
          </g>
        )}
      </svg>
      <MapNarr s={s} x={1700} y={830} scale={0.42} keys={[{ at: 0, arm: 'idle', expr: 'worried' }]} point={[{ x: 1000, y: 520, at: 30 }]} />
    </>
  );
};
const EMPHC = '#B3261E';
const a1Slaves: React.FC<SP> = ({ s }) => <SouthFlow s={s} chain />;
const a1Abol: React.FC<SP> = ({ s }) => <SouthFlow s={s} doc="MEXICO · 1829" strike="" replace="Slavery abolished" />;
const a1Loop: React.FC<SP> = ({ s }) => <SouthFlow s={s} doc="TEXAS SETTLERS' PAPERS" strike="enslaved worker" replace="&quot;indentured servant&quot;" />;
const a1Ten: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'ten');
  const tilt = interpolate(f, [at - 4, at + 12], [0, -16], Easing.out);
  const P = (x: number, y: number, c: string, k: number, key: string) => <g key={key} transform={`translate(${x} ${y}) scale(${k})`}><circle cy={-22} r={11} fill={c} stroke={OL} strokeWidth={3} /><path d="M-13 0 Q0 -22 13 0Z" fill={c} stroke={OL} strokeWidth={3} /></g>;
  return (
    <Insert>
      <g transform="translate(960 640)">
        <path d="M-60 120 L0 -40 L60 120 Z" fill="#8B6A3E" stroke={OL} strokeWidth={6} />
        <g transform={`rotate(${tilt})`}>
          <rect x={-420} y={-52} width={840} height={20} rx={8} fill="#8B6A3E" stroke={OL} strokeWidth={5} />
          <g transform={`translate(-360 -40) rotate(${-tilt})`}>
            <path d="M-130 60 H130 L100 100 H-100Z" fill="#C9A66B" stroke={OL} strokeWidth={5} /><line x1={0} y1={0} x2={0} y2={60} stroke={OL} strokeWidth={4} />
            {[...Array(10)].map((_, i) => P(-100 + (i % 5) * 50, 58 - Math.floor(i / 5) * 40, '#3A5A9A', springPop(f, 4 + i * 2), 'a' + i))}
            <text y={150} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#fff">Americans</text>
          </g>
          <g transform={`translate(360 -40) rotate(${-tilt})`}>
            <path d="M-130 60 H130 L100 100 H-100Z" fill="#C9A66B" stroke={OL} strokeWidth={5} /><line x1={0} y1={0} x2={0} y2={60} stroke={OL} strokeWidth={4} />
            {P(0, 58, '#2E7D4F', springPop(f, 10), 'm')}
            <text y={150} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#fff">Mexicans</text>
          </g>
        </g>
      </g>
      <Narr s={s} x={1720} y={840} scale={0.45} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at, arm: 'shrug', expr: 'shock' }]} point={[{ x: 1000, y: 250, at: at + 2 }]} />
      <Tag x={960} y={250} text="~10 : 1" size={70} k={springPop(f, at)} bg={GOLD} />
    </Insert>
  );
};

export const SHOTS_01: ShotMap = {
  a1_intro: a1Intro, a1_hands: a1Hands, a1_behind: a1Behind, a1_flags: a1Flags,
  a1_native: a1Native, a1_caddo: a1Caddo, a1_karank: a1Karank, a1_comanche: a1Comanche,
  a1_spain: a1Spain, a1_mission: a1Mission, a1_alamo: a1Alamo,
  a1_france: a1France, a1_lasalle: a1LaSalle, a1_fort: a1Fort, a1_badly: a1Badly, a1_wiped: a1Wiped,
  a1_held: a1Held, a1_few: a1Few, a1_border: a1Border, a1_fills: a1Fills,
  a1_mexico: a1Mexico, a1_indep: a1Indep, a1_risky: a1Risky, a1_invite: a1Invite, a1_austin: a1Austin, a1_cheap: a1Cheap,
  a1_slaves: a1Slaves, a1_abol: a1Abol, a1_loop: a1Loop, a1_ten: a1Ten,
  a1_grip: a1Grip, a1_push: a1Push, a1_first: a1First, a1_last: a1Last,
};
