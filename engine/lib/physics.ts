/**
 * physics.ts — closed-form, deterministic physics for frame-based animation.
 *
 * Every function is a pure function of the frame number, so any frame can be rendered
 * on its own (parallel rendering, re-rendering a single shot) and always gives the same result.
 * Where an exact analytic solution exists we use it (projectiles, bounces, springs);
 * rigid-body rotation uses fixed-step RK4 integration from t=0, which is still deterministic.
 *
 * Units: positions in px, time in frames (30 fps), gravity in px/frame² unless noted.
 * Screen y grows downwards, so "up" is negative y.
 */

export const FPS = 30;

// ---------------------------------------------------------------- free fall with bounces
export type DropState = {
  /** offset from the floor (<= 0 means above the floor) */
  y: number;
  /** vertical velocity, px/frame (positive = falling) */
  vy: number;
  /** squash/stretch scale factors (volume-preserving: sx² · sy = 1, so the object keeps its mass) */
  sx: number;
  sy: number;
  /** true once the object has come to rest */
  landed: boolean;
  /** frame (relative to start) of the most recent impact, -1 if none yet */
  impact: number;
  /** number of impacts so far */
  bounces: number;
};

/**
 * Drop an object from height `h` above a floor and let it bounce.
 * Exact piecewise-parabolic solution: first impact after t0 = sqrt(2h/g) with speed g·t0;
 * each bounce leaves with speed e·v_in and stays airborne for 2·v/g.
 *
 * @param e  coefficient of restitution (0 = dead stop, 1 = perfectly elastic)
 * @param minSpeed  bounces slower than this (px/frame) stop the object
 */
export function gravityDrop(
  frame: number,
  start: number,
  opts: { h: number; g?: number; e?: number; maxBounces?: number; minSpeed?: number },
): DropState {
  const { h, g = 1.6, e = 0.42, maxBounces = 3, minSpeed = 3 } = opts;
  const t = frame - start;
  if (t < 0) return { y: -h, vy: 0, sx: 1, sy: 1, landed: false, impact: -1, bounces: 0 };
  const t0 = Math.sqrt((2 * h) / g);
  if (t < t0) {
    const vy = g * t;
    return { y: -h + 0.5 * g * t * t, vy, ...stretch(vy), landed: false, impact: -1, bounces: 0 };
  }
  // walk through the bounces analytically
  let tImpact = t0;
  let v = g * t0; // impact speed
  let n = 1;
  while (n <= maxBounces) {
    const vOut = v * e;
    if (vOut < minSpeed) break;
    const flight = (2 * vOut) / g;
    if (t < tImpact + flight) {
      const dt = t - tImpact;
      const y = -(vOut * dt - 0.5 * g * dt * dt);
      const vy = -vOut + g * dt;
      return { y, vy, ...squashOrStretch(dt, vy), landed: false, impact: tImpact, bounces: n };
    }
    tImpact += flight;
    v = vOut;
    n++;
  }
  const since = t - tImpact;
  return { y: 0, vy: 0, ...squashOrStretch(since, 0), landed: true, impact: tImpact, bounces: n };
}

/** Stretch along the direction of travel while moving fast. */
function stretch(vy: number) {
  const k = Math.min(0.18, Math.abs(vy) / 120);
  const sy = 1 + k;
  return { sx: 1 / Math.sqrt(sy), sy };
}
/** Squash for a few frames right after an impact, otherwise stretch with speed. */
function squashOrStretch(sinceImpact: number, vy: number) {
  if (sinceImpact >= 0 && sinceImpact < 6) {
    const k = 0.35 * Math.exp(-sinceImpact / 1.8);
    const sy = 1 - k;
    return { sx: 1 / Math.sqrt(sy), sy };
  }
  return stretch(vy);
}

// ---------------------------------------------------------------- projectile
/**
 * Ballistic arc from p0 with initial velocity v0 (px/frame) under gravity g (px/frame²).
 * If `floorY` is given the object bounces on it with restitution `e` (and friction `mu` on x).
 */
export function projectile(
  frame: number,
  start: number,
  p0: [number, number],
  v0: [number, number],
  g = 1.2,
  floor?: { y: number; e?: number; mu?: number; maxBounces?: number },
) {
  const t = Math.max(0, frame - start);
  if (!floor) {
    return { x: p0[0] + v0[0] * t, y: p0[1] + v0[1] * t + 0.5 * g * t * t, vx: v0[0], vy: v0[1] + g * t, angle: (Math.atan2(v0[1] + g * t, v0[0]) * 180) / Math.PI, landed: false };
  }
  const { y: fy, e = 0.4, mu = 0.7, maxBounces = 4 } = floor;
  let x = p0[0], y = p0[1], vx = v0[0], vy = v0[1], tt = 0, n = 0;
  while (true) {
    if (n >= maxBounces) return { x, y: fy, vx: 0, vy: 0, angle: 0, landed: true };
    // time s until y reaches the floor: y + vy·s + g·s²/2 = fy
    const a = 0.5 * g, b = vy, c = y - fy;
    const disc = b * b - 4 * a * c;
    const s = disc < 0 ? Infinity : (-b + Math.sqrt(disc)) / (2 * a);
    if (t <= tt + s) {
      const d = t - tt;
      return { x: x + vx * d, y: y + vy * d + 0.5 * g * d * d, vx, vy: vy + g * d, angle: (Math.atan2(vy + g * d, vx) * 180) / Math.PI, landed: false };
    }
    // bounce: reflect vertical speed with restitution, lose some horizontal speed to friction
    x += vx * s; y = fy; vy = -(vy + g * s) * e; vx *= mu; tt += s; n++;
    if (Math.abs(vy) < 1.5) {
      // too slow to bounce again: slide to a stop with friction
      return { x: x + dragDistance(t, tt, vx, 8), y: fy, vx: 0, vy: 0, angle: 0, landed: true };
    }
  }
}

// ---------------------------------------------------------------- springs
/**
 * Damped harmonic oscillator released from 0 towards 1 (closed form).
 * Parameters are in physical units per second: stiffness k (N/m), damping c (N·s/m), mass m (kg).
 * Under-damped springs overshoot and ring; critically damped ones arrive fastest without overshoot.
 */
export function spring(frame: number, cfg: { damping?: number; stiffness?: number; mass?: number } = {}): number {
  const { damping = 10, stiffness = 100, mass = 1 } = cfg;
  if (frame <= 0) return 0;
  const t = frame / FPS;
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
  }
  if (zeta === 1) return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  const s = w0 * Math.sqrt(zeta * zeta - 1);
  const r1 = -zeta * w0 + s, r2 = -zeta * w0 - s;
  return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
}

/** Pose snap: stiff spring with a small, natural overshoot. 999 = "already settled". */
export const poseSpring = (since: number) => (since >= 999 ? 1 : spring(since, { damping: 15, stiffness: 320, mass: 0.6 }));
/** Bouncy pop-in (0 → 1 with visible overshoot). */
export const springPop = (frame: number, start = 0) => (frame < start ? 0 : spring(frame - start, { damping: 9, stiffness: 220, mass: 0.7 }));

// ---------------------------------------------------------------- secondary motion
/**
 * Follow-through: a loose part (cloth, plume, tail, hanging sign) modelled as a damped pendulum
 * kicked by a sudden move. Returns an angle offset in degrees.
 * @param period  natural period in frames (longer = heavier / longer cloth)
 * @param decay   e-folding time of the swing in frames
 */
export function followThrough(since: number, amp = 18, period = 9, decay = 10) {
  if (since < 0 || since > 120) return 0;
  return -amp * Math.exp(-since / decay) * Math.sin((since / period) * Math.PI * 2 + 0.6);
}

/** Anticipation: a small opposite move just before the main action. */
export function anticipate(frame: number, at: number, amt = 1, lead = 6) {
  const t = frame - (at - lead);
  if (t < 0 || t > lead) return 0;
  return -amt * Math.sin((t / lead) * Math.PI);
}

/** Walk cycle helper: two body bobs per stride, opposite leg/arm swing, slight forward lean. */
export function walkCycle(frame: number, speed = 1, phase = 0) {
  const p = (frame * speed) / 2.6 + phase;
  return { swing: Math.sin(p), bob: -Math.abs(Math.sin(p)) * 7, lean: 4 };
}

// ---------------------------------------------------------------- rigid bodies
/**
 * A rigid pole/banner/tree of length L pivoting at its base, toppling under gravity:
 * θ'' = (3g / 2L)·sin θ (uniform rod). Integrated with RK4 (fixed step, deterministic).
 * Lands at `restAngle` degrees with a damped bounce (restitution e). Returns angle in degrees.
 */
export function topple(frame: number, start: number, opts: { length?: number; g?: number; nudge?: number; restAngle?: number; e?: number; dir?: 1 | -1 } = {}) {
  const { length = 400, g = 1.6, nudge = 0.02, restAngle = 88, e = 0.25, dir = 1 } = opts;
  const t = frame - start;
  if (t <= 0) return 0;
  const k = (3 * g) / (2 * length);
  const rest = (restAngle * Math.PI) / 180;
  let th = 0, w = nudge;
  const h = 0.25;
  const f = (a: number) => k * Math.sin(a);
  for (let s = 0; s < t; s += h) {
    const k1v = f(th), k1x = w;
    const k2v = f(th + (h / 2) * k1x), k2x = w + (h / 2) * k1v;
    const k3v = f(th + (h / 2) * k2x), k3x = w + (h / 2) * k2v;
    const k4v = f(th + h * k3x), k4x = w + h * k3v;
    w += (h / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
    th += (h / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    if (th >= rest) { th = rest; w = -w * e; if (Math.abs(w) < 0.005) w = 0; }
  }
  return ((dir * th) * 180) / Math.PI;
}

/** Exponential drag: something pushed with velocity v0 that slows down (px). */
export const dragDistance = (frame: number, start: number, v0: number, tau = 14) => (frame <= start ? 0 : v0 * tau * (1 - Math.exp(-(frame - start) / tau)));

/** Pendulum swing (small-angle, damped) — hanging signs, lanterns, bells. Degrees. */
export function pendulum(frame: number, start: number, amp = 20, lengthPx = 200, g = 1.6, decayFrames = 60) {
  const t = frame - start;
  if (t < 0) return 0;
  const w = Math.sqrt(g / lengthPx);
  return amp * Math.exp(-t / decayFrames) * Math.cos(w * t);
}
