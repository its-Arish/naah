// A small Remotion-compatible core: frame context, Sequence, interpolate, spring, random.
// Every animation in this project is a pure function of the current frame.
import React, { createContext, useContext } from 'react';

import { FPS, spring } from './physics';
export * from './physics';
export const WIDTH = 1920;
export const HEIGHT = 1080;
/** Frame size of the current project (16:9 by default; set "width"/"height" in project.json, e.g. 1080×1920 for Shorts). */
let FRAME = { w: WIDTH, h: HEIGHT };
export const setFrameSize = (w: number, h: number) => { FRAME = { w, h }; };
export const frameSize = () => FRAME;

const FrameCtx = createContext(0);
const DurCtx = createContext(1);

export const FrameProvider: React.FC<{ frame: number; duration: number; children: React.ReactNode }> = ({ frame, duration, children }) => (
  <DurCtx.Provider value={duration}>
    <FrameCtx.Provider value={frame}>{children}</FrameCtx.Provider>
  </DurCtx.Provider>
);

export const useCurrentFrame = () => useContext(FrameCtx);
export const useDuration = () => useContext(DurCtx);

/** Renders children only inside [from, from+duration); children see a local frame starting at 0. */
export const Sequence: React.FC<{ from: number; duration: number; children: React.ReactNode }> = ({ from, duration, children }) => {
  const f = useCurrentFrame();
  if (f < from || f >= from + duration) return null;
  return (
    <DurCtx.Provider value={duration}>
      <FrameCtx.Provider value={f - from}>{children}</FrameCtx.Provider>
    </DurCtx.Provider>
  );
};

export type EasingFn = (t: number) => number;
export const Easing = {
  linear: (t: number) => t,
  inOut: (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  out: (t: number) => 1 - Math.pow(1 - t, 3),
  in: (t: number) => t * t * t,
  outBack: (t: number) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  outExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
};

/** interpolate(value, inputRange, outputRange) — always clamped on both sides. */
export function interpolate(v: number, inR: number[], outR: number[], easing: EasingFn = Easing.linear): number {
  if (v <= inR[0]) return outR[0];
  if (v >= inR[inR.length - 1]) return outR[outR.length - 1];
  let i = 0;
  while (i < inR.length - 2 && v > inR[i + 1]) i++;
  const t = (v - inR[i]) / (inR[i + 1] - inR[i] || 1);
  return outR[i] + (outR[i + 1] - outR[i]) * easing(t);
}

/** Seeded random in [0,1) — same output for the same seed, every render. */
export function random(seed: string | number): number {
  let h = 2166136261;
  const s = String(seed);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

/** Hold animation "on twos": the value only updates every n frames. */
export const onTwos = (frame: number, n = 2) => Math.floor(frame / n) * n;

/** Pop-in scale: 0 → overshoot → 1 */
export const popScale = (frame: number, start = 0) => {
  const f = frame - start;
  if (f <= 0) return 0;
  return spring(f, { damping: 9, stiffness: 220, mass: 0.7 });
};

/** Blink: returns true for 3 frames every 2–5 s (seeded). */
export function isBlinking(frame: number, seed: string): boolean {
  let t = Math.floor(random(seed + 'b0') * 60) + 20;
  let i = 0;
  while (t < frame + 3 && i < 400) {
    if (frame >= t && frame < t + 3) return true;
    t += 60 + Math.floor(random(seed + 'b' + ++i) * 90);
  }
  return false;
}

// Absolute frame of the whole video (set by the runtime before each render) — used for voiceover lip-sync.
let ABS_FRAME = 0;
export const setAbsoluteFrame = (f: number) => { ABS_FRAME = f; };
export const getAbsoluteFrame = () => ABS_FRAME;

/**
 * Mouth shape: 0 closed, 1 mid, 2 open.
 * With a voiceover, build/vo_env.js defines window.__voEnv (one value per video frame from the audio loudness).
 * Without one, it's a seeded, irregular fake flap while the words are revealing.
 */
export function mouthState(frame: number, talking: boolean, seed: string): number {
  if (!talking) return 0;
  const env = (typeof window !== 'undefined' && (window as any).__voEnv) as string | undefined;
  if (env) return Number(env[ABS_FRAME] ?? 0);
  const bucket = Math.floor(frame / 4);
  const r = random(seed + 'm' + bucket);
  return r < 0.28 ? 0 : r < 0.62 ? 1 : 2;
}

/** Small screen shake. */
export function shake(frame: number, start: number, len = 6, amp = 4, seed = 's') {
  const f = frame - start;
  if (f < 0 || f >= len) return { x: 0, y: 0 };
  const k = 1 - f / len;
  return { x: (random(seed + 'x' + f) * 2 - 1) * amp * k, y: (random(seed + 'y' + f) * 2 - 1) * amp * k };
}

