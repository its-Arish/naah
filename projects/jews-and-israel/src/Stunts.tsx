/** Narrator stunts for story scenes (from the narrator-moves skill). Each is drawn at a design position (X0,Y0, scale 1) and wrapped to fit the corner of the scene.
 *  Usage in a part: nar: STUNT.vault   (the narrator plays the stunt for the beat, then stands). */
import React from 'react';
import { interpolate, Easing, gravityDrop, topple } from '@engine/lib/core';
import { Host, hostLeftHand, reach } from '@engine/characters/Host';
import { Staff, IDLE, lerpArm } from '@engine/moves';
import { OL } from '@engine/scenes/Parts';
import { talk } from '@engine/kit';
import type { PartArgs } from './Cuts';

const X0 = 1300, Y0 = 960;
const HX = -107;
const wrap = (a: PartArgs, node: React.ReactNode) => {
  const host = a.s.kind === 'HOST';
  const sc = host ? 1 : 0.58, tx = host ? 0 : 1640 - X0 * sc, ty = host ? 0 : 1010 - Y0 * sc;
  return <g transform={`translate(${tx} ${ty}) scale(${sc})`}>{node}</g>;
};
type St = (a: PartArgs) => React.ReactNode;
const tk = (a: PartArgs) => talk(a.s);

const Rider: St = (a) => {
  const t = a.t; const g = interpolate(t, [0, 34], [0, 1], Easing.out);
  const x = interpolate(g, [0, 1], [-300, X0]); const y = interpolate(g, [0, 1], [300, 640]) + Math.sin(t / 6) * 10;
  const bob = t > 34 ? Math.sin(t / 7) * 10 : 0;
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${-6 + Math.sin(t / 9) * 2})`}>
      {g < 1 && [0, 1, 2, 3].map((i) => <path key={i} d={`M${-120 - i * 14} ${-90 + i * 20} h${-(120 + ((t * 9 + i * 37) % 90))}`} stroke="#fff" strokeOpacity={0.6} strokeWidth={5} strokeLinecap="round" />)}
      <Host x={0} y={130} scale={0.6} keys={[{ at: 0, arm: 'point', expr: 'grin' }]} talking={tk(a)} staffMode="ride" legs="sit" />
    </g>
  );
};
const Vault: St = (a) => {
  const t = a.t, from = X0 - 700, plant = X0 - 240, to = X0, y = Y0, s = 1, run = 14, swing = 18;
  const talking = tk(a);
  if (t < run) { const x = interpolate(t, [0, run], [from, plant], Easing.in); return <g transform={`translate(0 ${-Math.abs(Math.sin(t / 2)) * 12})`}><Host x={x} y={y} scale={s} keys={[{ at: 0, arm: 'fist', expr: 'grin' }]} talking={talking} /></g>; }
  if (t < run + swing) { const p = (t - run) / swing; const ang = interpolate(p, [0, 1], [-35, 70], Easing.inOut); const footX = plant + HX * s; return <g transform={`rotate(${ang} ${footX} ${y})`}><Host x={plant} y={y - Math.sin(p * Math.PI) * 40} scale={s} keys={[{ at: 0, arm: 'wave', expr: 'grin' }]} talking={talking} legs="tuck" /></g>; }
  const tt = t - run - swing; const land = gravityDrop(tt, 0, { h: 160, g: 2.4, e: 0.2 }); const x = interpolate(tt, [0, 8], [plant + (to - plant) * 0.75, to], Easing.out);
  return <g transform={`translate(${x} ${y + land.y}) scale(${land.sx} ${land.sy}) translate(${-x} ${-y})`}><Host x={x} y={y} scale={s} keys={[{ at: 0, arm: 'present', expr: 'proud' }]} talking={talking} /></g>;
};
const Twirl: St = (a) => {
  const f = a.t, X = X0, Y = Y0;
  if (f < 36) return <Host x={X} keys={[{ at: 0, arm: 'present', expr: 'grin' }]} talking={tk(a)} staffMode="spin" staffRot={f * 26} />;
  if (f < 66) { const t = f - 36, g = 2.3, v = g * 15; const arm: [number, number] = [60, 20]; const h = hostLeftHand(X, Y, 1, arm); const y = h.y - (v * t - 0.5 * g * t * t); return <><Host x={X} keys={[{ at: 0, arm: 'idle', expr: 'grin' }]} talking={tk(a)} staffMode="none" leftArm={arm} /><Staff hx={h.x} hy={y} ang={t >= 29 ? 0 : t * 25} gripTop={305} /></>; }
  return <Host x={X} keys={[{ at: 0, arm: 'present', expr: 'proud' }]} talking={tk(a)} />;
};
const Cane: St = (a) => {
  const f = a.t, X = X0, Y = Y0, sx = X - 95, gy1 = 640, gy2 = 690;
  const lean = interpolate(f, [0, 14], [0, -7], Easing.out) + Math.sin(f / 20) * 0.6;
  return <g transform={`rotate(${lean} ${X} ${Y})`}><Staff hx={sx} hy={gy1} ang={0} gripTop={290} /><Host x={X} keys={[{ at: 0, arm: 'idle', expr: 'proud' }]} talking={tk(a)} staffMode="none" legs="crossed" leftArm={reach(X, Y, 1, -1, sx, gy1)} rightArm={reach(X, Y, 1, 1, sx, gy2)} /></g>;
};
const Catch: St = (a) => {
  const f = a.t, X = X0, Y = Y0; const arm: [number, number] = [160, 12]; const h = hostLeftHand(X, Y, 1, arm); const fall = gravityDrop(f, 4, { h: 760, g: 2.6, e: 0 });
  return f >= 24 ? <Host x={X} keys={[{ at: 0, arm: 'present', expr: 'grin' }]} talking={tk(a)} /> : <><Host x={X} keys={[{ at: 0, arm: 'idle', expr: 'smile' }]} talking={tk(a)} staffMode="none" leftArm={arm} /><Staff hx={h.x} hy={h.y + fall.y} ang={0} /></>;
};
const Slack: St = (a) => {
  const f = a.t, X = X0, Y = Y0 + 10, T0 = 6, BEND = 50, UP = 62, DONE = 82; const footX = X - 107, footY = Y;
  const fallen = topple(f, T0, { length: 610, g: 1.6, nudge: 0.06, restAngle: 86, e: 0.3 });
  const lift = interpolate(f, [UP, UP + 18], [0, 1], Easing.inOut); const staffAng = -fallen * (1 - lift);
  const bend = interpolate(f, [BEND, BEND + 10], [0, 1], Easing.out) * (1 - lift);
  const arm = f < BEND ? lerpArm(IDLE, [10, 4], interpolate(f, [T0, T0 + 6], [0, 1])) : lerpArm([10, 4], [14, 2], bend);
  if (f >= DONE) return <Host x={X} keys={[{ at: 0, arm: 'shrug', expr: 'grin' }]} talking={tk(a)} />;
  return <><g transform={`rotate(${-34 * bend} ${X} ${Y})`}><Host x={X} keys={[{ at: 0, arm: 'idle', expr: 'shock' }, { at: BEND, arm: 'idle', expr: 'worried' }, { at: UP + 10, arm: 'idle', expr: 'smile' }]} talking={tk(a)} staffMode="none" leftArm={arm} /></g><g transform={`rotate(${staffAng} ${footX} ${footY})`}><Staff hx={footX} hy={footY - 240} ang={0} gripTop={370} /></g>{f > T0 + 20 && f < T0 + 34 && <text x={footX - 480} y={footY - 30} fontFamily="TagBold" fontSize={44} fill="#3A3A48" opacity={interpolate(f, [T0 + 20, T0 + 34], [1, 0])}>CLANG!</text>}</>;
};
const Heli: St = (a) => {
  const f = a.t, X = X0, Y = Y0;
  const up = interpolate(f, [0, 12], [0, 1], Easing.out); const speed = interpolate(f, [12, 40], [0, 55], Easing.in); const theta = (speed * f) / 2 + (f > 40 ? (f - 40) * 55 : 0);
  const lift = f < 42 ? 0 : -Math.pow(f - 42, 1.55) * 2.2; const dy = Math.max(lift, -200) + (f > 42 ? Math.sin(f / 8) * 10 : 0);
  const hx = X, hy = Y + dy, cy = hy - 660, AL = interpolate(f, [0, 12], [1, 1.55], Easing.out);
  const span = 305 * Math.abs(Math.cos((theta * Math.PI) / 180)); const blur = Math.min(1, speed / 40);
  const la = reach(hx, hy, 1, -1, hx - 100, hy - 500, 1.55), ra = reach(hx, hy, 1, 1, hx + 100, hy - 500, 1.55);
  return (
    <>
      <ellipse cx={hx} cy={Y + 8} rx={Math.max(20, 90 + dy / 6)} ry={14} fill="#000" opacity={Math.max(0.05, 0.22 + dy / 2500)} />
      <g transform={`rotate(${f > 42 ? Math.sin(f / 9) * 4 : 0} ${hx} ${cy})`}>
        <Host x={hx} y={hy} keys={[{ at: 0, arm: 'idle', expr: f > 42 ? 'grin' : 'smile' }]} talking={tk(a)} staffMode="none" armLen={AL} leftArm={up < 1 ? lerpArm(IDLE, la, up) : la} rightArm={up < 1 ? lerpArm([18, 14], ra, up) : ra} />
        {up > 0.6 && [-1, 1].map((sd) => <path key={sd} d={`M${hx + sd * 100} ${hy - 500} L${hx + sd * 30} ${cy + 12}`} stroke={OL} strokeWidth={6} fill="none" strokeLinejoin="round" strokeLinecap="round" />)}
        {blur > 0.3 && <ellipse cx={hx} cy={cy} rx={305} ry={22} fill="#6B4A2B" opacity={blur * 0.22} />}
        <g transform={`translate(${hx} ${cy})`}><line x1={-span} y1={0} x2={span} y2={0} stroke="#6B4A2B" strokeWidth={10} strokeLinecap="round" /><rect x={-8} y={-12} width={16} height={24} rx={4} fill="#3B2A1A" /></g>
      </g>
    </>
  );
};
const DropIn: St = (a) => {
  const f = a.t, X = X0, Y = Y0; const d = gravityDrop(f, 4, { h: 900, g: 2.6, e: 0.15 });
  return <g transform={`translate(${X} ${Y + d.y}) scale(${d.sx} ${d.sy}) translate(${-X} ${-Y})`}><Host x={X} y={Y} keys={[{ at: 0, arm: f < 20 ? 'wave' : 'present', expr: f < 20 ? 'shock' : 'grin' }]} talking={tk(a)} legs={f < 20 ? 'tuck' : 'stand'} /></g>;
};
const Peek: St = (a) => {
  const f = a.t, k = interpolate(f, [0, 12], [0, 1], Easing.out) * (f > 40 ? interpolate(f, [40, 52], [1, 0.0], Easing.in) + 0 : 1);
  return <g transform={`translate(${(1 - Math.max(0, Math.min(1, f > 40 ? 1 : k))) * 500} 0)`}><Host x={X0} keys={[{ at: 0, arm: f < 40 ? 'chin' : 'shrug', expr: f < 40 ? 'shock' : 'grin' }]} talking={tk(a)} /></g>;
};

const mk = (fn: St) => (a: PartArgs) => wrap(a, fn(a));
export const STUNT = { fly: mk(Rider), vault: mk(Vault), twirl: mk(Twirl), cane: mk(Cane), catch: mk(Catch), slack: mk(Slack), heli: mk(Heli), drop: mk(DropIn), peek: mk(Peek) };
export type StuntName = keyof typeof STUNT;
