/**
 * Narrator moves toolkit: the staff drawn on its own (so a move can swing, throw, drop or spin it),
 * arm helpers and the reusable moves. See the narrator-moves skill for the catalogue.
 *
 *   import { Staff, along, lerpArm, IDLE, Stage, VaultMove } from '@engine/moves';
 */
import React from 'react';
import { useCurrentFrame, interpolate, Easing, gravityDrop } from './lib/core';
import { CameraRig, Layer } from './fx/Camera';
import { Host } from './characters/Host';
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
