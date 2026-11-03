/** Narrator moves demo: Screen Puller, Reaction Drop, Crack (and the staff falling back into his hand). */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop, spring, gravityDrop, topple, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Host, hostLeftHand } from '@engine/characters/Host';
import { GreyStage } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { makeEnd, talk, wordAt, type ShotMap, type SP } from '@engine/kit';

const X = 1420, Y = 960, RED = '#B3261E', PAPER = '#F4ECD8';
const IDLE: [number, number] = [42, 12];
const lerpArm = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** The narrator's staff, drawn separately so a move can swing, drop or throw it. (hx,hy) = grip point; ang = degrees from vertical; gripTop = px from the crook end to the hand. */
export const Staff: React.FC<{ hx: number; hy: number; ang: number; s?: number; gripTop?: number }> = ({ hx, hy, ang, s = 1, gripTop = 370 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${hx} ${hy}) rotate(${ang}) scale(${s})`}>
      <line x1={0} y1={-gripTop} x2={2} y2={610 - gripTop} stroke="#6B4A2B" strokeWidth={10} strokeLinecap="round" />
      <path d={`M-6 ${-gripTop} q6 -24 14 -6`} stroke="#6B4A2B" strokeWidth={9} fill="none" strokeLinecap="round" />
      <g transform={`rotate(${Math.sin(f / 6) * 6} 2 ${-gripTop + 40})`}><path d={`M2 ${-gripTop + 40} q16 4 30 22 l-12 8 q-8 -14 -18 -16 z`} fill="#E8862A" stroke="#151515" strokeWidth={2.5} /></g>
      <rect x={-6} y={-gripTop + 34} width={14} height={10} rx={3} fill="#3B2A1A" />
    </g>
  );
};
/** Point along the staff, `d` px from the hand towards the crook. */
const along = (hx: number, hy: number, ang: number, d: number) => ({ x: hx + Math.sin((ang * Math.PI) / 180) * d, y: hy - Math.cos((ang * Math.PI) / 180) * d });

const Stage: React.FC<{ children: React.ReactNode; shakes?: { at: number; amp: number; len: number }[] }> = ({ children, shakes = [] }) => (
  <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02, focus: [1300, 500], shakes }}><GreyStage /><Layer depth={1}>{children}</Layer></CameraRig>
);

// ------------------------------------------------------------------ slides
const PX = 930, PW = 360, PH = 520, PBOT = 740;
const SlideA: React.FC = () => (
  <g>
    <rect x={PX} y={PBOT - PH} width={PW} height={PH} rx={14} fill="#1E2A36" stroke={OL} strokeWidth={6} />
    <text x={PX + PW / 2} y={PBOT - PH + 56} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#FFD84A">THE MAP</text>
    <path d={`M${PX + 40} ${PBOT - 300} q60 -80 150 -60 q90 -30 130 30 q-10 60 -90 70 q-120 30 -190 -40 Z`} fill={RED} stroke={OL} strokeWidth={4} />
  </g>
);
const SlideB: React.FC<{ bottom: number }> = ({ bottom }) => (
  <g>
    <clipPath id="shade"><rect x={PX - 10} y={-200} width={PW + 20} height={bottom + 200} /></clipPath>
    <g clipPath="url(#shade)" transform={`translate(0 ${bottom - PBOT})`}>
      <rect x={PX} y={PBOT - PH} width={PW} height={PH} rx={14} fill={PAPER} stroke={OL} strokeWidth={6} />
      <text x={PX + PW / 2} y={PBOT - PH + 60} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill={RED}>NEXT UP</text>
      {['Serfdom', 'Peter the Great', 'A city on a swamp'].map((t, i) => <g key={t}><circle cx={PX + 50} cy={PBOT - 380 + i * 90} r={10} fill={RED} /><text x={PX + 76} y={PBOT - 370 + i * 90} fontFamily="TagBold" fontSize={30} fill="#1A1410">{t}</text></g>)}
      <rect x={PX - 8} y={PBOT - 16} width={PW + 16} height={24} rx={10} fill="#8A5A34" stroke={OL} strokeWidth={4} />
      <circle cx={PX + PW / 2} cy={PBOT + 8} r={12} fill="#E2B13C" stroke={OL} strokeWidth={3} />
    </g>
  </g>
);

// ------------------------------------------------------------------ SCREEN PULLER
const Puller: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  if (s.id === 'p1') return <Stage><SlideA /><Host x={X} keys={[{ at: 0, arm: 'present', expr: 'smile' }]} talking={talk(s)} /></Stage>;
  const raise = interpolate(f, [4, 14], [0, 1], Easing.out), pull = interpolate(f, [18, 44], [0, 1], Easing.inOut), back = interpolate(f, [50, 62], [0, 1], Easing.inOut);
  let arm = lerpArm(IDLE, [168, 10], raise); arm = lerpArm(arm, [70, 30], pull); arm = lerpArm(arm, IDLE, back);
  const ang = -28 * raise - 47 * pull + 75 * back;
  const grip = 370 + 190 * raise - 190 * back;
  const h = hostLeftHand(X, Y, 1, arm);
  const crook = along(h.x, h.y, ang, grip);
  const released = f >= 44;
  const relY = 450;
  const bottom = f < 18 ? -60 : !released ? Math.max(-60, crook.y + 10) : PBOT + (relY - PBOT) * Math.exp(-(f - 44) / 5) * Math.cos((f - 44) * 0.55);
  const done = f >= 62;
  return (
    <Stage>
      <SlideA />
      <SlideB bottom={bottom} />
      {done ? <Host x={X} keys={[{ at: 0, arm: 'present', expr: 'grin' }]} talking={talk(s)} />
        : <><Host x={X} keys={[{ at: 0, arm: f < 18 ? 'idle' : 'fist', expr: f > 18 && f < 44 ? 'proud' : 'smile' }]} talking={talk(s)} staffMode="none" leftArm={arm} /><Staff hx={h.x} hy={h.y} ang={ang} gripTop={grip} /></>}
    </Stage>
  );
};

// ------------------------------------------------------------------ REACTION DROP
const Drop_: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const stat = (t: number, big: string, small: string, y: number) => { const k = springPop(f, t); return k > 0 ? <g transform={`translate(${PX + PW / 2} ${y}) scale(${k})`}><rect x={-190} y={-80} width={380} height={150} rx={16} fill={PAPER} stroke={OL} strokeWidth={6} /><text y={0} textAnchor="middle" fontFamily="TagBold" fontSize={52} fill={RED}>{big}</text><text y={46} textAnchor="middle" fontFamily="Tag" fontSize={28} fill="#5A4A3A">{small}</text></g> : null; };
  const cards = <>{stat(s.id === 'r1' ? 20 : -99, '17,100,000', 'square kilometres', 290)}{s.id !== 'r1' && stat(s.id === 'r2' ? wordAt(s, 'people') - 4 : -99, '146,000,000', 'people', 470)}</>;
  if (s.id !== 'r3') return <Stage>{cards}<Host x={X} keys={[{ at: 0, arm: s.id === 'r1' ? 'present' : 'point', expr: 'smile' }]} talking={talk(s)} /></Stage>;
  // r3: goes slack, the staff topples and clatters, he bends down sheepishly and picks it up
  const T0 = 6, BEND = 50, UP = 62, DONE = 82;
  const footX = X - 107, footY = Y + 10;
  const fallen = topple(f, T0, { length: 610, g: 1.6, nudge: 0.06, restAngle: 86, e: 0.3 });
  const lift = interpolate(f, [UP, UP + 18], [0, 1], Easing.inOut);
  const staffAng = -fallen * (1 - lift);
  const bend = interpolate(f, [BEND, BEND + 10], [0, 1], Easing.out) * (1 - lift);
  const arm = f < BEND ? lerpArm(IDLE, [10, 4], interpolate(f, [T0, T0 + 6], [0, 1])) : lerpArm([10, 4], [14, 2], bend);
  return (
    <Stage>
      {cards}
      {f < DONE ? <>
        <g transform={`rotate(${-34 * bend} ${X} ${Y})`}>
          <Host x={X} keys={[{ at: 0, arm: 'idle', expr: 'shock' }, { at: BEND, arm: 'idle', expr: 'worried' }, { at: UP + 10, arm: 'idle', expr: 'smile' }]} talking={talk(s)} staffMode="none" leftArm={arm} />
        </g>
        <g transform={`rotate(${staffAng} ${footX} ${footY})`}><Staff hx={footX} hy={footY - 240} ang={0} gripTop={370} /></g>
        {f > T0 + 20 && f < T0 + 34 && <text x={footX - 480} y={footY - 30} fontFamily="TagBold" fontSize={44} fill="#3A3A48" opacity={interpolate(f, [T0 + 20, T0 + 34], [1, 0])}>CLANG!</text>}
      </> : <Host x={X} keys={[{ at: 0, arm: 'shrug', expr: 'grin' }]} talking={talk(s)} />}
    </Stage>
  );
};

// ------------------------------------------------------------------ CRACK: throws the staff at the viewer, the screen cracks
const Crack: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const WIND = 56, T = 66, HIT = 79;
  const wind = interpolate(f, [WIND, T], [0, 1], Easing.in);
  const arm = f < T ? lerpArm(IDLE, [175, 70], wind) : lerpArm([175, 70], [110, -10], interpolate(f, [T, T + 6], [0, 1]));
  const h = hostLeftHand(X, Y, 1, arm);
  const p = interpolate(f, [T, HIT], [0, 1], Easing.in);
  const sc = 1 + Math.pow(p, 3) * 11;
  const fx = h.x + (900 - h.x) * p, fy = h.y + (520 - h.y) * p;
  const cracked = f >= HIT;
  const flash = cracked ? interpolate(f, [HIT, HIT + 6], [0.95, 0]) : 0;
  const lines = [...Array(14)].map((_, i) => {
    const a = (i / 14) * Math.PI * 2 + random('ca' + i) * 0.3;
    let x = 960, y = 540, pts = `M${x} ${y}`;
    for (let k = 0; k < 5; k++) { const r = 90 + random('cr' + i + k) * 160; x += Math.cos(a + (random('cj' + i + k) - 0.5) * 0.7) * r; y += Math.sin(a + (random('cj' + i + k) - 0.5) * 0.7) * r; pts += ` L${x.toFixed(0)} ${y.toFixed(0)}`; }
    return pts;
  });
  return (
    <>
      <Stage shakes={cracked ? [{ at: HIT, amp: 26, len: 14 }] : []}>
        <Host x={X} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at: WIND, arm: 'idle', expr: 'grin' }]} talking={talk(s)} staffMode="none" leftArm={arm} />
        {f < T && <Staff hx={h.x} hy={h.y} ang={-wind * 70} />}
      </Stage>
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={1920} height={1080}>
        {f >= T && !cracked && <g transform={`translate(${fx} ${fy}) rotate(${p * 620 - 70}) scale(${sc})`}><Staff hx={0} hy={0} ang={0} gripTop={300} /></g>}
        {cracked && <g>
          <circle cx={960} cy={540} r={34} fill="rgba(255,255,255,0.9)" stroke="#fff" strokeWidth={4} />
          {lines.map((l, i) => <path key={i} d={l} stroke="#fff" strokeWidth={4} fill="none" strokeLinejoin="round" opacity={0.9} />)}
          {[120, 230].map((r) => <circle key={r} cx={960} cy={540} r={r} fill="none" stroke="#fff" strokeWidth={2.5} strokeDasharray="30 40" opacity={0.7} />)}
          <text x={960} y={300} textAnchor="middle" fontFamily="TagBold" fontSize={120} fill="#FFD84A" stroke="#1A1410" strokeWidth={6} style={{ paintOrder: 'stroke' }} opacity={interpolate(f, [HIT, HIT + 4, d - 10, d], [0, 1, 1, 0])}>CRACK!</text>
        </g>}
        <rect width={1920} height={1080} fill="#fff" opacity={flash} />
      </svg>
    </>
  );
};

// ------------------------------------------------------------------ the staff falls back into his hand
const Catch: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const arm: [number, number] = [160, 12];
  const h = hostLeftHand(X, Y, 1, arm);
  const fall = gravityDrop(f, 4, { h: 760, g: 2.6, e: 0 });
  const caught = f >= 24;
  return (
    <Stage>
      {caught ? <Host x={X} keys={[{ at: 0, arm: 'present', expr: 'grin' }]} talking={talk(s)} />
        : <><Host x={X} keys={[{ at: 0, arm: 'idle', expr: 'smile' }]} talking={talk(s)} staffMode="none" leftArm={arm} /><Staff hx={h.x} hy={h.y + fall.y} ang={0} /></>}
    </Stage>
  );
};

const Opening: React.FC<SP> = () => <div style={{ position: 'absolute', inset: 0, background: '#C4C4C4' }} />;
export const SHOTS: ShotMap = { opening: Opening, end: makeEnd('Narrator Moves'), mv_puller: Puller, mv_drop: Drop_, mv_crack: Crack, mv_catch: Catch };
