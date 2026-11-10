/**
 * Alabama film: the narrator's staff moves, adapted from projects/moves-demo and moves-demo2 (approved Nov 2026).
 * Each takes t = frames since the move started (negative = not yet) and the narrator's x; ground y = 960.
 * Never next to a tragedy (see the narrator-moves skill).
 */
import React from 'react';
import { interpolate, Easing, gravityDrop, topple } from '@engine/lib/core';
import { Host, hostLeftHand, reach } from '@engine/characters/Host';
import { OL } from '@engine/scenes/Parts';
import { Staff, along, lerpArm, IDLE, VaultMove } from '@engine/moves';

const Y = 960;
type Talk = [number, number][];
type Key = { at: number; arm?: string; expr?: string };

/** Pole-vault on: run, plant, swing over, land at `to`. ~50 frames, then a plain narrator. */
export const VaultOn: React.FC<{ t: number; to: number; from?: number; plant?: number; talking: Talk; keys: Key[] }> = ({ t, to, from = -200, plant, talking, keys }) =>
  t < 50 ? <VaultMove t={Math.max(0, t)} from={from} plant={plant ?? to - 380} to={to} y={Y} s={1} talking={talking} />
    : <Host x={to} keys={keys} talking={talking} />;

/** Reaction drop: goes slack, the staff clatters, he bends and picks it up. 82 frames. For busted myths, never deaths. */
export const ReactionDrop: React.FC<{ t: number; X: number; talking: Talk; after: Key[] }> = ({ t, X, talking, after }) => {
  if (t < 0 || t >= 82) return <Host x={X} keys={t < 0 ? [{ at: 0, arm: 'present', expr: 'smile' }] : after} talking={talking} />;
  const T0 = 0, BEND = 44, UP = 56;
  const footX = X - 107, footY = Y + 10;
  const fallen = topple(t, T0, { length: 610, g: 1.6, nudge: 0.06, restAngle: 86, e: 0.3 });
  const lift = interpolate(t, [UP, UP + 18], [0, 1], Easing.inOut);
  const bend = interpolate(t, [BEND, BEND + 10], [0, 1], Easing.out) * (1 - lift);
  const arm = t < BEND ? lerpArm(IDLE, [10, 4], interpolate(t, [T0, T0 + 6], [0, 1])) : lerpArm([10, 4], [14, 2], bend);
  return (
    <>
      <g transform={`rotate(${-34 * bend} ${X} ${Y})`}>
        <Host x={X} keys={[{ at: 0, arm: 'idle', expr: 'shock' }]} talking={talking} staffMode="none" leftArm={arm} />
      </g>
      <g transform={`rotate(${-fallen * (1 - lift)} ${footX} ${footY})`}><Staff hx={footX} hy={footY - 240} ang={0} gripTop={370} /></g>
      {t > 18 && t < 34 && <text x={footX - 520} y={footY - 30} fontFamily="TagBold" fontSize={44} fill="#3A3A48" opacity={interpolate(t, [18, 34], [1, 0])}>CLANG!</text>}
    </>
  );
};

/** Baton twirl + flip: spins (0-36), tosses end over end and catches (36-66). */
export const Twirl: React.FC<{ t: number; X: number; talking: Talk; keys: Key[] }> = ({ t, X, talking, keys }) => {
  if (t >= 0 && t < 36) return <Host x={X} keys={[{ at: 0, arm: 'present', expr: 'grin' }]} talking={talking} staffMode="spin" staffRot={t * 26} />;
  if (t >= 36 && t < 66) {
    const u = t - 36, g = 2.3, v = g * 15;
    const arm: [number, number] = [60, 20];
    const h = hostLeftHand(X, Y, 1, arm);
    return <><Host x={X} keys={[{ at: 0, arm: 'idle', expr: 'grin' }]} talking={talking} staffMode="none" leftArm={arm} /><Staff hx={h.x} hy={h.y - (v * u - 0.5 * g * u * u)} ang={u >= 29 ? 0 : u * 25} gripTop={305} /></>;
  }
  return <Host x={X} keys={keys} talking={talking} />;
};

/** Walking-cane lean: storyteller pose for "long ago". */
export const Cane: React.FC<{ t: number; X: number; talking: Talk }> = ({ t, X, talking }) => {
  const sx = X - 95, gy1 = 640, gy2 = 690;
  const lean = interpolate(t, [0, 14], [0, -7], Easing.out) + Math.sin(t / 20) * 0.6;
  return (
    <g transform={`rotate(${lean} ${X} ${Y})`}>
      <Staff hx={sx} hy={gy1} ang={0} gripTop={290} />
      <Host x={X} keys={[{ at: 0, arm: 'idle', expr: 'proud' }]} talking={talking} staffMode="none" legs="crossed" leftArm={reach(X, Y, 1, -1, sx, gy1)} rightArm={reach(X, Y, 1, 1, sx, gy2)} />
    </g>
  );
};

/** Catch: the staff drops from above into his raised hand (caught at t = 20). */
export const Catch: React.FC<{ t: number; X: number; talking: Talk; keys: Key[] }> = ({ t, X, talking, keys }) => {
  if (t >= 20) return <Host x={X} keys={keys} talking={talking} />;
  const arm: [number, number] = [160, 12];
  const h = hostLeftHand(X, Y, 1, arm);
  const fall = gravityDrop(Math.max(0, t), 0, { h: 760, g: 2.6, e: 0 });
  return <><Host x={X} keys={[{ at: 0, arm: 'idle', expr: 'smile' }]} talking={talking} staffMode="none" leftArm={arm} /><Staff hx={h.x} hy={h.y + fall.y} ang={0} /></>;
};

/** Screen puller: hooks the top of the frame with the crook and pulls a panel down. Returns the panel's bottom y. */
export const pullerState = (t: number, X: number, rest: number) => {
  const raise = interpolate(t, [4, 14], [0, 1], Easing.out), pull = interpolate(t, [18, 44], [0, 1], Easing.inOut), back = interpolate(t, [50, 62], [0, 1], Easing.inOut);
  let arm = lerpArm(IDLE, [168, 10], raise); arm = lerpArm(arm, [70, 30], pull); arm = lerpArm(arm, IDLE, back);
  const ang = -28 * raise - 47 * pull + 75 * back;
  const grip = 370 + 190 * raise - 190 * back;
  const h = hostLeftHand(X, Y, 1, arm);
  const crook = along(h.x, h.y, ang, grip);
  const bottom = t < 18 ? -60 : t < 44 ? Math.max(-60, crook.y + 10) : rest + (crook.y + 10 - rest) * Math.exp(-(t - 44) / 5) * Math.cos((t - 44) * 0.55);
  return { arm, ang, grip, h, bottom: t >= 44 ? rest + (450 - rest) * Math.exp(-(t - 44) / 5) * Math.cos((t - 44) * 0.55) : bottom, done: t >= 62 };
};
export const Puller: React.FC<{ t: number; X: number; talking: Talk; keys: Key[] }> = ({ t, X, talking, keys }) => {
  const p = pullerState(t, X, 0);
  if (t < 0 || p.done) return <Host x={X} keys={keys} talking={talking} />;
  return <><Host x={X} keys={[{ at: 0, arm: t < 18 ? 'idle' : 'fist', expr: t > 18 && t < 44 ? 'proud' : 'smile' }]} talking={talking} staffMode="none" leftArm={p.arm} /><Staff hx={p.h.x} hy={p.h.y} ang={p.ang} gripTop={p.grip} /></>;
};

/** Fishing rod: casts and reels a card down on a line. Each cast is at a frame; the caller draws the card at `fishCard(...)`. */
export const fishAng = (t: number, casts: number[]) => {
  let ang = -20;
  casts.forEach((w) => { const c = w - 14; if (t >= c && t < c + 12) ang = t < c + 5 ? interpolate(t, [c, c + 5], [-20, 25]) : interpolate(t, [c + 5, c + 12], [25, -40], Easing.out); else if (t >= c + 12) ang = -40; });
  return ang;
};
export const fishCard = (t: number, cast: number, slot: number) => {
  const u = t - (cast - 2);
  if (u < 0) return null;
  return { y: interpolate(u, [0, 16], [-140, slot], Easing.out), swing: u > 16 ? Math.sin((u - 16) / 3) * 10 * Math.exp(-(u - 16) / 12) : 6, line: u < 24 };
};
export const FishHost: React.FC<{ t: number; X: number; casts: number[]; talking: Talk; lines: { x: number; y: number }[] }> = ({ t, X, casts, talking, lines }) => {
  const arm: [number, number] = [128, 18];
  const h = hostLeftHand(X, Y, 1, arm);
  const ang = fishAng(t, casts);
  const crook = along(h.x, h.y, ang, 520);
  return (
    <>
      {lines.map((c, i) => <path key={i} d={`M${crook.x} ${crook.y} Q${(crook.x + c.x) / 2} ${Math.min(crook.y, c.y) - 60} ${c.x} ${c.y}`} stroke="#3A3A44" strokeWidth={2.5} fill="none" />)}
      <Host x={X} keys={[{ at: 0, arm: 'present', expr: 'grin' }]} talking={talking} staffMode="none" leftArm={arm} />
      <Staff hx={h.x} hy={h.y} ang={ang} gripTop={520} />
    </>
  );
};

/** Helicopter: both hands overhead, staff spins as a rotor, lifts off and hovers (no fly-away). */
export const Heli: React.FC<{ t: number; X: number; talking: Talk }> = ({ t, X, talking }) => {
  const f = Math.max(0, t);
  const up = interpolate(f, [0, 12], [0, 1], Easing.out);
  const speed = interpolate(f, [12, 40], [0, 55], Easing.in);
  const theta = (speed * f) / 2 + (f > 40 ? (f - 40) * 55 : 0);
  const lift = f < 42 ? 0 : -Math.pow(f - 42, 1.55) * 2.2;
  const dy = Math.max(lift, -120) + (f > 42 ? Math.sin(f / 8) * 10 : 0);
  const hx = X, hy = Y + dy;
  const cy = hy - 660, AL = interpolate(f, [0, 12], [1, 1.55], Easing.out);
  const span = 305 * Math.abs(Math.cos((theta * Math.PI) / 180));
  const blur = Math.min(1, speed / 40);
  const la = reach(hx, hy, 1, -1, hx - 100, hy - 500, 1.55), ra = reach(hx, hy, 1, 1, hx + 100, hy - 500, 1.55);
  const c = Math.cos((theta * Math.PI) / 180) >= 0 ? 1 : -1;
  return (
    <>
      <ellipse cx={hx} cy={Y + 8} rx={Math.max(20, 90 + dy / 6)} ry={14} fill="#000" opacity={Math.max(0.05, 0.22 + dy / 2500)} />
      {f > 38 && f < 70 && [...Array(8)].map((_, i) => { const u = f - 38; return <circle key={i} cx={X + (i - 3.5) * 40 * (1 + u / 10)} cy={Y - u * 0.8} r={14 + u * 0.9} fill="#A8A8A8" opacity={Math.max(0, 0.5 - u / 60)} />; })}
      <g transform={`rotate(${f > 42 ? Math.sin(f / 9) * 4 : 0} ${hx} ${cy})`}>
        <Host x={hx} y={hy} keys={[{ at: 0, arm: 'idle', expr: f > 42 ? 'grin' : 'smile' }]} talking={talking} staffMode="none" armLen={AL} leftArm={up < 1 ? lerpArm(IDLE, la, up) : la} rightArm={up < 1 ? lerpArm([18, 14], ra, up) : ra} />
        {up > 0.6 && [-1, 1].map((sd) => <path key={sd} d={`M${hx + sd * 100} ${hy - 500} L${hx + sd * 30} ${cy + 12}`} stroke={OL} strokeWidth={6} fill="none" strokeLinejoin="round" strokeLinecap="round" />)}
        {blur > 0.3 && <ellipse cx={hx} cy={cy} rx={305} ry={22} fill="#6B4A2B" opacity={blur * 0.22} />}
        <g transform={`translate(${hx} ${cy})`}>
          <line x1={-span} y1={0} x2={span} y2={0} stroke="#6B4A2B" strokeWidth={10} strokeLinecap="round" />
          <path d={`M${c * span} 0 q${c * 18} -10 ${c * 6} -16`} stroke="#6B4A2B" strokeWidth={9} fill="none" strokeLinecap="round" />
          <rect x={-8} y={-12} width={16} height={24} rx={4} fill="#3B2A1A" />
        </g>
      </g>
      {f > 46 && f < 90 && <text x={hx - 470} y={cy + 60} fontFamily="TagBold" fontSize={40} fill="#3A3A48" opacity={0.7}>WHUP WHUP</text>}
    </>
  );
};
