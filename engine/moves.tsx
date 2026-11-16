/**
 * Narrator moves toolkit: the staff drawn on its own (so a move can swing, throw, drop or spin it),
 * arm helpers and the reusable moves. See the narrator-moves skill for the catalogue.
 *
 *   import { Staff, along, lerpArm, IDLE, Stage, VaultMove } from '@engine/moves';
 */
import React from 'react';
import { useCurrentFrame, interpolate, Easing, gravityDrop } from './lib/core';
import { CameraRig, Layer } from './fx/Camera';
import { Host, hostLeftHand } from './characters/Host';
import { GreyStage } from './scenes/Backgrounds';

export const IDLE: [number, number] = [42, 12];
export const lerpArm = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
/** Point along a staff held at (hx,hy) at angle `ang` (degrees from vertical), `d` px from the hand towards the crook. */
export const along = (hx: number, hy: number, ang: number, d: number) => ({ x: hx + Math.sin((ang * Math.PI) / 180) * d, y: hy - Math.cos((ang * Math.PI) / 180) * d });
/** Angle (degrees from vertical) that points from (x1,y1) towards (x2,y2). */
export const aim = (x1: number, y1: number, x2: number, y2: number) => (Math.atan2(x2 - x1, -(y2 - y1)) * 180) / Math.PI;

/** The narrator's staff on its own. (hx,hy) = grip; ang = degrees from vertical; gripTop = px from crook end to the hand; len 610.
 *  squash < 1 foreshortens it (rotor seen from the side). */
export const Staff: React.FC<{ hx: number; hy: number; ang: number; s?: number; gripTop?: number; squash?: number }> = ({ hx, hy, ang, s = 1, gripTop = 370, squash = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${hx} ${hy}) rotate(${ang}) scale(${s}) scale(1 ${squash})`}>
      <line x1={0} y1={-gripTop} x2={2} y2={610 - gripTop} stroke="#6B4A2B" strokeWidth={10 / Math.max(0.3, squash)} strokeLinecap="round" />
      <path d={`M-6 ${-gripTop} q6 -24 14 -6`} stroke="#6B4A2B" strokeWidth={9} fill="none" strokeLinecap="round" />
      <g transform={`rotate(${Math.sin(f / 6) * 6} 2 ${-gripTop + 40})`}><path d={`M2 ${-gripTop + 40} q16 4 30 22 l-12 8 q-8 -14 -18 -16 z`} fill="#E8862A" stroke="#151515" strokeWidth={2.5} /></g>
      <rect x={-6} y={-gripTop + 34} width={14} height={10} rx={3} fill="#3B2A1A" />
    </g>
  );
};

/** Grey stage with the usual slow push and optional shakes. */
export const Stage: React.FC<{ children: React.ReactNode; shakes?: { at: number; amp: number; len: number }[]; focus?: [number, number] }> = ({ children, shakes = [], focus = [1300, 500] }) => (
  <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02, focus, shakes }}><GreyStage /><Layer depth={1}>{children}</Layer></CameraRig>
);

/** Pole-vault: run in (14 frames), plant and swing over the staff about its foot (18), land with a squash. `to` beyond the frame = exit. */
export const VaultMove: React.FC<{ t: number; from: number; plant: number; to: number; y?: number; s?: number; talking?: [number, number][] }> = ({ t, from, plant, to, y = 960, s = 1, talking = [] }) => {
  const run = 14, swing = 18, dir = Math.sign(to - plant);
  if (t < run) return <g transform={`translate(0 ${-Math.abs(Math.sin(t / 2)) * 12})`}><Host x={interpolate(t, [0, run], [from, plant], Easing.in)} y={y} scale={s} keys={[{ at: 0, arm: 'fist', expr: 'grin' }]} talking={talking} /></g>;
  if (t < run + swing) {
    const p = (t - run) / swing;
    return <g transform={`rotate(${interpolate(p, [0, 1], [-35, 70], Easing.inOut) * dir} ${plant - 107 * s} ${y})`}><Host x={plant} y={y - Math.sin(p * Math.PI) * 40 * s} scale={s} keys={[{ at: 0, arm: 'wave', expr: 'grin' }]} talking={talking} legs="tuck" /></g>;
  }
  const tt = t - run - swing;
  const land = gravityDrop(tt, 0, { h: 160 * s, g: 2.4, e: 0.2 });
  const x = interpolate(tt, [0, 8], [plant + (to - plant) * 0.75, to], Easing.out);
  return <g transform={`translate(${x} ${y + land.y}) scale(${land.sx} ${land.sy}) translate(${-x} ${-y})`}><Host x={x} y={y} scale={s} keys={[{ at: 0, arm: 'present', expr: 'grin' }]} talking={talking} /></g>;
};

// ------------------------------------------------------------------ TEACH: the staff as a teacher's pointer
/** A thing the narrator points at: frame coords, and the frame it is spoken (he taps it then). */
export type PointAt = { x: number; y: number; at: number };
/**
 * The narrator teaching: he lifts his staff like a pointer, aims the crook at the current target,
 * swings to the next target as each is spoken, and taps it on the word (small recoil + a ring on the target).
 * Before the first target he stands normally. Works at any `scale` (stage 1.0, inserts/maps ~0.45).
 *
 *   <Teach x={1500} y={1000} keys={[...]} talking={talk(s)} targets={[{ x: 1100, y: 400, at: wordAt(s, 'Dial') }]} />
 */
export const Teach: React.FC<{ x: number; y?: number; scale?: number; targets: PointAt[]; keys?: any[]; talking?: [number, number][]; ring?: boolean; [k: string]: any }> = ({ x, y = 960, scale = 1, targets, keys = [], talking = [], ring = true, ...rest }) => {
  const f = useCurrentFrame();
  const T = targets.filter(Boolean).slice().sort((a, b) => a.at - b.at);
  const lift = T.length ? T[0].at - 10 : 1e9;
  if (f < lift) return <Host x={x} y={y} scale={scale} keys={keys} talking={talking} {...rest} />;
  const cur = T.reduce((acc, t, i) => (f >= t.at - 8 ? i : acc), 0);
  const raise = interpolate(f, [lift, lift + 8], [0, 1], Easing.out);
  const t = T[cur];
  // arm: higher targets lift the arm more
  const h0 = hostLeftHand(x, y, scale, [96, 6]);
  const up = Math.max(-1, Math.min(1, (h0.y - t.y) / (400 * scale)));
  const arm = lerpArm(IDLE, [96 + up * 40, 6], raise);
  const h = hostLeftHand(x, y, scale, arm);
  const angOf = (p: PointAt) => aim(h.x, h.y, p.x, p.y);
  const prev = cur > 0 ? angOf(T[cur - 1]) : 0;
  const ang = cur > 0 ? interpolate(f, [t.at - 8, t.at - 2], [prev, angOf(t)], Easing.out) : interpolate(raise, [0, 1], [0, angOf(t)]);
  const dist = Math.hypot(t.x - h.x, t.y - h.y) / scale;
  const tap = f - t.at;
  const recoil = tap >= 0 && tap < 8 ? Math.sin((tap / 8) * Math.PI) * 26 : 0;
  const reachLen = Math.max(260, Math.min(520, dist - 20)) - recoil; // hand -> crook, in unscaled px
  const butt = along(h.x, h.y, ang, -110 * scale), tip = along(h.x, h.y, ang, reachLen * scale);
  const gap = Math.hypot(t.x - tip.x, t.y - tip.y);
  const laser = gap > 40 * scale && cur >= 0 ? interpolate(f, [t.at - 4, t.at + 2], [0, 1]) : 0; // too far to touch: a dotted beam finishes the reach
  const ringK = ring && tap >= 0 && tap < 16 ? tap / 16 : -1;
  return (
    <g>
      <Host x={x} y={y} scale={scale} keys={keys} talking={talking} staffMode="none" leftArm={arm} {...rest} />
      {/* the staff as a pointer: short butt behind the hand, crook at the tip */}
      <line x1={butt.x} y1={butt.y} x2={tip.x} y2={tip.y} stroke="#6B4A2B" strokeWidth={10 * scale} strokeLinecap="round" />
      <g transform={`translate(${tip.x} ${tip.y}) rotate(${ang}) scale(${scale})`}>
        <path d="M-6 0 q6 -24 14 -6" stroke="#6B4A2B" strokeWidth={9} fill="none" strokeLinecap="round" />
        <g transform={`rotate(${Math.sin(f / 6) * 6} 2 40)`}><path d="M2 40 q16 4 30 22 l-12 8 q-8 -14 -18 -16 z" fill="#E8862A" stroke="#151515" strokeWidth={2.5} /></g>
        <rect x={-6} y={34} width={14} height={10} rx={3} fill="#3B2A1A" />
      </g>
      {laser > 0 && <><line x1={tip.x} y1={tip.y} x2={tip.x + (t.x - tip.x) * laser} y2={tip.y + (t.y - tip.y) * laser} stroke="#FFD84A" strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" opacity={0.85} />
        <circle cx={tip.x + (t.x - tip.x) * laser} cy={tip.y + (t.y - tip.y) * laser} r={7} fill="#FFD84A" opacity={0.9} /></>}
      {ringK >= 0 && <circle cx={t.x} cy={t.y} r={(14 + 46 * ringK) * Math.max(0.6, scale)} fill="none" stroke="#FFD84A" strokeWidth={6 * (1 - ringK) + 1} opacity={1 - ringK} />}
    </g>
  );
};
