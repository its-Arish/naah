/** Hook (0:00 to 0:49): the familiar things, the island that never existed, and "who got rich?". */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop, topple } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Host, hostLeftHand } from '@engine/characters/Host';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { talk, wordAt, type ShotMap, type SP } from '@engine/kit';
import { Staff, aim, lerpArm, IDLE, Stage } from '@engine/moves';
import { Globe, Full, MapTag } from '@engine/qgis/QgisMap';
import { D, PAPER, RED, GOLD, INK, SAND, useGroup, gw, Rider, CaShape, IconCard, Jeans, Phone, PlayApp, Clapper, Almonds, Board, Galleon } from './Kit';

const Y = 960;

// c001: the title line. California glows beside the narrator.
const Room: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'California') - 4;
  const k = springPop(f, at);
  return (
    <Stage>
      {k > 0 && <g transform={`translate(1090 520) scale(${k}) translate(-1090 -520)`}>
        <circle cx={1090} cy={520} r={230 + Math.sin(f / 10) * 8} fill="url(#warmGlow)" opacity={0.9} />
        <CaShape x={1090} y={520} h={400} fill="#F3B562" />
      </g>}
      <Host x={1500} keys={[{ at: 0, arm: 'present', expr: 'grin' }, { at: wordAt(s, 'your'), arm: 'point', expr: 'grin' }]} talking={talk(s)} />
    </Stage>
  );
};

// c002-c003: laser pointer taps each familiar thing on its word.
const THINGS = [
  { b: 0, w: 'jeans', x: 1010, y: 290, label: 'JEANS', icon: <Jeans /> },
  { b: 0, w: 'phone', x: 1180, y: 290, label: 'PHONE', icon: <Phone /> },
  { b: 0, w: 'app', x: 1010, y: 480, label: 'THIS APP', icon: <PlayApp /> },
  { b: 1, w: 'movies', x: 1180, y: 480, label: 'MOVIES', icon: <Clapper /> },
  { b: 1, w: 'almonds', x: 1095, y: 670, label: 'ALMONDS', icon: <Almonds /> },
];
const Things: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const { k } = useGroup(s);
  const X = 1500;
  const T = THINGS.map((t) => ({ ...t, at: gw(s, k, t.b, t.w) }));
  const cur = T.reduce((acc, t, i) => (f >= t.at - 6 ? i : acc), -1);
  const arm: [number, number] = [96, 6];
  const h = hostLeftHand(X, Y, 1, arm);
  const angs = T.map((t) => aim(h.x, h.y, t.x + 60, t.y));
  let ang = 0, grip = 370;
  if (cur >= 0) {
    const t0 = T[cur].at - 6, prev = cur > 0 ? angs[cur - 1] : -10;
    ang = interpolate(f, [t0, t0 + 6], [prev, angs[cur]], Easing.out);
    const dist = Math.hypot(T[cur].x + 60 - h.x, T[cur].y - h.y);
    const tap = f - T[cur].at;
    grip = Math.min(560, dist - 18) - (tap >= 0 && tap < 8 ? Math.sin((tap / 8) * Math.PI) * 26 : 0);
  }
  return (
    <Stage>
      {T.map((t, i) => { const tap = f - t.at; const pulse = tap >= 0 && tap < 12 ? 1 + 0.14 * Math.sin((tap / 12) * Math.PI) : 1; return <IconCard key={t.w} x={t.x} y={t.y} k={springPop(f, t.at - 8) * pulse} hot={i === cur} label={t.label}>{t.icon}</IconCard>; })}
      {cur < 0 ? <Host x={X} keys={[{ at: 0, arm: 'present', expr: 'smile' }]} talking={talk(s)} />
        : <><Host x={X} keys={[{ at: 0, arm: 'present', expr: 'proud' }]} talking={talk(s)} staffMode="none" leftArm={arm} /><Staff hx={h.x} hy={h.y} ang={ang} gripTop={grip} /></>}
    </Stage>
  );
};

// c004: the globe spins to one strip of coast.
const GlobeShot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const lam = interpolate(f, [0, 80], [-10, -112], Easing.inOut);
  const named = wordAt(s, 'named'), never = wordAt(s, 'never');
  return (
    <>
      <Globe data={D} lam0={lam} phi0={30} R={390} cx={1120} cy={460} points={f > 70 ? [{ ll: [-119.5, 36.8], color: RED }] : []} fill={(c) => (c.iso === 'USA' || c.iso === 'MEX' || c.iso === 'CAN' ? '#EFE3C4' : '#E4DAC0')} />
      <Full>
        {f > 78 && <g transform="translate(1079 412)"><circle r={22 + ((f - 78) % 30)} fill="none" stroke={GOLD} strokeWidth={5} opacity={1 - ((f - 78) % 30) / 30} /></g>}
        <MapTag x={840} y={318} text="ONE STRIP OF COAST" k={springPop(f, 84)} size={34} bg={PAPER} c={INK} />
        <MapTag x={420} y={610} anchor="start" text="NAMED AFTER AN ISLAND…" k={springPop(f, named)} size={34} />
        <MapTag x={420} y={690} anchor="start" text="…THAT NEVER EXISTED" k={springPop(f, never)} size={34} bg={RED} />
        <Rider x={300} y={330} s={0.45} arm="point" expr="grin" talking={talk(s)} />
      </Full>
    </>
  );
};

// c005-c006: the 1510 novel and its island of gold.
const Novel: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const { g, k } = useGroup(s);
  const open = interpolate(g, [0, 16], [0.05, 1], Easing.out);
  const isl = springPop(f, gw(s, k, 1, 'island'));
  const gold = gw(s, k, 1, 'gold');
  const women = gw(s, k, 1, 'warrior');
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [820, 480] }}>
      <InsertBg />
      <Layer depth={1}>
        <g transform="translate(800 470)">
          <path d="M-430 -250 L430 -250 L440 270 L-440 270 Z" fill="#5A3A22" stroke={OL} strokeWidth={6} strokeLinejoin="round" />
          <g transform={`scale(${open} 1)`}>
            <path d="M0 -236 Q-210 -262 -412 -236 L-420 250 Q-210 226 0 252 Z" fill="#F1E3BF" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
            <path d="M0 -236 Q210 -262 412 -236 L420 250 Q210 226 0 252 Z" fill="#F6EACB" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
            <line x1={0} y1={-236} x2={0} y2={252} stroke="#8A6A44" strokeWidth={5} />
            <text x={-210} y={-130} textAnchor="middle" fontFamily="Hand" fontSize={44} fill="#5A2A1A">Las Sergas de</text>
            <text x={-210} y={-70} textAnchor="middle" fontFamily="Hand" fontSize={58} fill="#5A2A1A">Esplandián</text>
            <path d="M-330 -34 h240" stroke={RED} strokeWidth={4} strokeLinecap="round" />
            <text x={-210} y={50} textAnchor="middle" fontFamily="TagBold" fontSize={92} fill={RED}>1510</text>
            <text x={-210} y={120} textAnchor="middle" fontFamily="Tag" fontSize={28} fill="#5A4A3A">a Spanish adventure novel</text>
            {[160, 190].map((y) => <path key={y} d={`M-340 ${y} h260`} stroke="#B9A77F" strokeWidth={4} strokeLinecap="round" />)}
            {isl > 0 && <g transform={`translate(210 20) scale(${isl})`}>
              {[-60, 0, 60].map((y, i) => <path key={i} d={`M-170 ${y + 110} q20 -12 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`} stroke="#7FAFD6" strokeWidth={4} fill="none" opacity={0.5 + i * 0.2} transform={`translate(${Math.sin(f / 12 + i) * 8} ${-100 + i * 6})`} />)}
              <path d="M-130 30 Q-150 -40 -80 -70 Q-20 -120 50 -84 Q130 -80 140 -10 Q150 50 70 60 Q-20 90 -130 30 Z" fill="#D9C27A" stroke={OL} strokeWidth={4} />
              <path d="M-60 -40 Q-20 -90 30 -50 Q60 -20 20 0 Q-30 10 -60 -40 Z" fill="#8DB36A" stroke={OL} strokeWidth={3} />
              {f >= women && [-70, -20, 34, 84].map((x, i) => { const a = springPop(f, women + i * 4); return a > 0 ? <g key={i} transform={`translate(${x} ${22 - (i % 2) * 14}) scale(${a})`}><line x1={12} y1={-58} x2={12} y2={10} stroke="#5A3E26" strokeWidth={3} /><path d="M12 -70 l-5 14 h10 Z" fill={GOLD} stroke={OL} strokeWidth={1.5} /><circle cy={-34} r={9} fill="#7A4A2E" stroke={OL} strokeWidth={2.5} /><path d="M-9 -24 h18 l5 36 h-28 Z" fill="#8E3B2E" stroke={OL} strokeWidth={2.5} /><circle cx={-12} cy={-6} r={9} fill={GOLD} stroke={OL} strokeWidth={2.5} /></g> : null; })}
              {f >= gold && [[-100, -20], [60, -60], [110, 20], [-10, 44], [0, -96]].map(([x, y], i) => { const t = (f - gold + i * 5) % 26; return <path key={i} d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z" transform={`translate(${x} ${y}) scale(${0.5 + Math.sin((t / 26) * Math.PI) * 0.9})`} fill={GOLD} stroke={OL} strokeWidth={1.5} />; })}
              <text y={-150} textAnchor="middle" fontFamily="Hand" fontSize={50} fill="#5A2A1A">“California”</text>
              <text y={150} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill={f >= gold ? RED : '#5A4A3A'}>{f >= gold ? 'THE ONLY METAL: GOLD' : 'an island in a story'}</text>
            </g>}
          </g>
        </g>
        <Host x={1650} y={900} scale={0.62} keys={[{ at: 0, arm: 'present', expr: 'grin' }, { at: gw(s, k, 1, 'gold'), arm: 'finger', expr: 'grin' }]} talking={talk(s)} />
      </Layer>
    </CameraRig>
  );
};

// c007: real mapmakers drew California as an island.
const IslandMap: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [14, 70], [1, 0], Easing.inOut);
  const lab = springPop(f, wordAt(s, 'island') - 2);
  return (
    <CameraRig move={{ zoomFrom: 1.02, zoomTo: 1.08, focus: [820, 440] }}>
      <InsertBg />
      <Layer depth={1}>
        <g transform="translate(820 450) rotate(-1.5)">
          <path d="M-540 -330 L530 -340 L548 318 L-528 330 Z" fill={SAND} stroke={OL} strokeWidth={6} strokeLinejoin="round" />
          <path d="M-540 -330 L530 -340 L548 318 L-528 330 Z" fill="none" stroke="#B9A77F" strokeWidth={14} strokeLinejoin="round" opacity={0.5} transform="scale(0.955)" />
          {/* mainland of North America (east side of the sheet) */}
          <path d="M120 -322 Q150 -230 110 -150 Q60 -60 150 20 Q230 90 210 180 Q200 260 260 316 L540 316 L528 -336 Z" fill="#E3C98B" stroke="#5A3E26" strokeWidth={5} strokeLinejoin="round" />
          <text x={380} y={-20} textAnchor="middle" fontFamily="Hand" fontSize={46} fill="#5A3E26" transform="rotate(8 380 -20)">Nova Mexico</text>
          {/* the long island */}
          <path d="M-70 -280 Q10 -260 20 -170 Q10 -70 70 30 Q140 130 120 220 Q96 262 60 232 Q0 150 -60 60 Q-130 -60 -120 -190 Q-112 -270 -70 -280 Z" fill="#F3B562" stroke="#5A3E26" strokeWidth={5} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={draw} fillOpacity={interpolate(f, [50, 76], [0, 1])} />
          {lab > 0 && <g transform={`translate(-30 -40) rotate(64) scale(${lab})`}><text textAnchor="middle" fontFamily="Hand" fontSize={58} fill="#5A2A1A">California</text></g>}
          <text x={60} y={-90} fontFamily="Hand" fontSize={30} fill="#3F6FB5" transform="rotate(62 60 -90)" opacity={interpolate(f, [60, 80], [0, 1])}>Mar Vermejo</text>
          {/* sea, compass, ship */}
          {[[-420, -180], [-380, 40], [-300, 230], [-250, -260]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q14 -10 28 0 t28 0 t28 0`} stroke="#7FA0B0" strokeWidth={3.5} fill="none" transform={`translate(${Math.sin(f / 14 + i) * 6} 0)`} />)}
          <g transform="translate(-400 200)"><circle r={52} fill="none" stroke="#5A3E26" strokeWidth={3} /><path d="M0 -70 L12 0 L0 70 L-12 0 Z M-70 0 L0 -12 L70 0 L0 12 Z" fill="#B3261E" stroke="#5A3E26" strokeWidth={2.5} /><text y={-80} textAnchor="middle" fontFamily="TagBold" fontSize={24} fill="#5A3E26">N</text></g>
          <text x={-520} y={-280} fontFamily="Hand" fontSize={38} fill="#5A3E26">Mar del Zur</text>
        </g>
        <Galleon x={470} y={420} s={0.5} />
        <Host x={1640} y={900} scale={0.62} keys={[{ at: 0, arm: 'point', expr: 'smile' }, { at: wordAt(s, 'island'), arm: 'shrug', expr: 'worried' }]} talking={talk(s)} />
      </Layer>
      <Layer depth={1}><g transform="translate(1310 190)"><MapTag x={0} y={0} text="REAL MAPS, 1620s – 1740s" k={springPop(f, wordAt(s, 'real'))} size={30} /></g></Layer>
    </CameraRig>
  );
};

// c008: the royal decree, and the narrator drops his staff.
const Decree: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const X = 1580;
  // the beat ends soon after the reveal, so he drops the staff and stays startled (no pick-up)
  const T0 = Math.min(wordAt(s, 'not') + 4, d - 34), BEND = T0 + 999, UP = T0 + 999, DONE = T0 + 999;
  const show = springPop(f, wordAt(s, 'announce') - 6), stamp = springPop(f, wordAt(s, 'not'));
  const scroll = (
    <g transform={`translate(1075 470) scale(${show * 0.8})`}>
      <rect x={-190} y={-250} width={380} height={500} rx={10} fill={PAPER} stroke={OL} strokeWidth={6} />
      {[-250, 250].map((y) => <rect key={y} x={-206} y={y - 16} width={412} height={32} rx={16} fill="#D8C79A" stroke={OL} strokeWidth={5} />)}
      <text y={-170} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill={RED}>ROYAL DECREE</text>
      <text y={-126} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#5A4A3A">SPAIN · 1747</text>
      <path d="M-130 -100 h260" stroke={RED} strokeWidth={4} strokeLinecap="round" />
      <text y={-30} textAnchor="middle" fontFamily="Hand" fontSize={54} fill={INK}>California</text>
      <text y={40} textAnchor="middle" fontFamily="Hand" fontSize={54} fill={INK}>is not</text>
      <text y={110} textAnchor="middle" fontFamily="Hand" fontSize={54} fill={INK}>an island.</text>
      <circle cx={110} cy={186} r={34} fill={RED} stroke={OL} strokeWidth={4} /><path d="M96 186 l10 10 l20 -22" stroke={PAPER} strokeWidth={6} fill="none" strokeLinecap="round" />
      {stamp > 0 && <g transform={`translate(-70 190) rotate(-10) scale(${stamp})`}><rect x={-96} y={-30} width={192} height={60} rx={8} fill="rgba(255,255,255,0.85)" stroke={RED} strokeWidth={6} /><text y={12} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill={RED}>OFFICIAL</text></g>}
    </g>
  );
  if (f < T0) return <Stage>{scroll}<Host x={X} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at: wordAt(s, 'officially'), arm: 'finger', expr: 'proud' }]} talking={talk(s)} /></Stage>;
  const footX = X - 107, footY = Y + 10;
  const fallen = topple(f, T0, { length: 610, g: 1.6, nudge: 0.06, restAngle: 86, e: 0.3 });
  const lift = interpolate(f, [UP, UP + 18], [0, 1], Easing.inOut);
  const bend = interpolate(f, [BEND, BEND + 10], [0, 1], Easing.out) * (1 - lift);
  const arm = f < BEND ? lerpArm(IDLE, [10, 4], interpolate(f, [T0, T0 + 6], [0, 1])) : lerpArm([10, 4], [14, 2], bend);
  return (
    <Stage shakes={[{ at: T0 + 22, amp: 5, len: 6 }]}>
      {scroll}
      {f < DONE ? <>
        <g transform={`rotate(${-34 * bend} ${X} ${Y})`}>
          <Host x={X} keys={[{ at: 0, arm: 'idle', expr: 'shock' }, { at: T0 + 26, arm: 'shrug', expr: 'worried' }]} talking={talk(s)} staffMode="none" leftArm={arm} />
        </g>
        <g transform={`rotate(${-fallen * (1 - lift)} ${footX} ${footY})`}><Staff hx={footX} hy={footY - 240} ang={0} gripTop={370} /></g>
      </> : <Host x={X} keys={[{ at: 0, arm: 'shrug', expr: 'grin' }]} talking={talk(s)} />}
    </Stage>
  );
};

// c009: one of the five biggest economies on Earth.
const RANKS = ['UNITED STATES', 'CHINA', 'GERMANY', 'CALIFORNIA', 'JAPAN'];
const Econ: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const five = wordAt(s, 'five');
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [860, 480] }}>
      <InsertBg />
      <Layer depth={1}>
        <text x={860} y={180} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill={PAPER} opacity={interpolate(f, [2, 12], [0, 1])}>BIGGEST ECONOMIES ON EARTH</text>
        {RANKS.map((n, i) => {
          const k = springPop(f, 8 + i * 7), hot = i === 3, glow = hot && f >= five;
          return k > 0 ? (
            <g key={n} transform={`translate(860 ${270 + i * 104}) scale(${k * (glow ? 1.08 : 1)})`}>
              <rect x={-360} y={-42} width={720} height={84} rx={12} fill={glow ? GOLD : hot ? '#F3B562' : PAPER} stroke={OL} strokeWidth={5} />
              <circle cx={-310} cy={0} r={28} fill={INK} /><text x={-310} y={13} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill={PAPER}>{i + 1}</text>
              <text x={-260} y={15} fontFamily="TagBold" fontSize={44} fill={INK}>{n}</text>
              {hot && <CaShape x={300} y={0} h={66} fill="#E8862A" sw={3} />}
            </g>) : null;
        })}
        <text x={860} y={790} textAnchor="middle" fontFamily="Tag" fontSize={26} fill="#CFC6B2" opacity={interpolate(f, [40, 52], [0, 1])}>by size of economy, 2024 figures</text>
        <Host x={1650} y={900} scale={0.62} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at: five, arm: 'point', expr: 'grin' }]} talking={talk(s)} />
      </Layer>
    </CameraRig>
  );
};

// c010-c012: the board. Three men, three crosses, and the question.
const BoardShot: React.FC<SP> = ({ s }) => {
  const { k } = useGroup(s);
  const rows = [
    { label: 'THE FINDER', show: gw(s, k, 0, 'found') - 4, mark: gw(s, k, 0, 'poor') },
    { label: 'THE LANDOWNER', show: gw(s, k, 0, 'owned') - 4, mark: gw(s, k, 0, 'land') + 4 },
    { label: 'THE 1ST MILLIONAIRE', show: gw(s, k, 1, 'first') - 4, mark: gw(s, k, 1, 'made') },
  ];
  return (
    <Stage focus={[1200, 500]}>
      <Board x={1110} y={230} rows={rows} at={k === 0 ? 2 : -999} question={gw(s, k, 2, 'who')} />
      <Host x={1510} keys={k === 2 ? [{ at: 0, arm: 'chin', expr: 'smile' }, { at: wordAt(s, 'rich'), arm: 'finger', expr: 'grin' }] : [{ at: 0, arm: 'point', expr: 'worried' }]} talking={talk(s)} />
    </Stage>
  );
};

export const SHOTS_HOOK: ShotMap = { h_room: Room, h_things: Things, h_globe: GlobeShot, h_novel: Novel, h_island: IslandMap, h_decree: Decree, h_econ: Econ, h_board: BoardShot };
