/**
 * Physics tests: every helper is checked against the closed-form result it claims to compute,
 * plus determinism (same frame → same answer, in any order), which parallel rendering relies on.
 *
 *   npm test        (or: npx tsx --test tests/*.test.ts)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gravityDrop, projectile, spring, topple, pendulum, dragDistance, followThrough, anticipate, FPS } from '../engine/lib/physics';

const close = (a: number, b: number, tol: number, msg?: string) => assert.ok(Math.abs(a - b) <= tol, `${msg ?? ''} expected ${b} ± ${tol}, got ${a}`);

test('gravityDrop: free fall follows y = -h + g t²/2 and lands at t = sqrt(2h/g)', () => {
  const h = 600, g = 1.6;
  for (const t of [0, 5, 10, 20]) close(gravityDrop(t, 0, { h, g }).y, -h + 0.5 * g * t * t, 1e-9, `t=${t}`);
  const t0 = Math.sqrt((2 * h) / g); // 27.39 frames
  assert.equal(gravityDrop(Math.floor(t0), 0, { h, g }).bounces, 0);
  assert.equal(gravityDrop(Math.ceil(t0), 0, { h, g }).bounces, 1);
});

test('gravityDrop: each bounce peaks at e² of the previous height (energy loss)', () => {
  const h = 800, g = 1.6, e = 0.5;
  // sample finely to find the first rebound apex
  let apex = 0;
  for (let t = 0; t < 120; t += 0.01) { const d = gravityDrop(t, 0, { h, g, e, minSpeed: 0.1 }); if (d.bounces === 1) apex = Math.min(apex, d.y); }
  close(-apex, h * e * e, 0.5);
});

test('gravityDrop: never goes below the floor, comes to rest, squash preserves area', () => {
  for (let t = 0; t < 300; t++) {
    const d = gravityDrop(t, 0, { h: 700, e: 0.6 });
    assert.ok(d.y <= 1e-9, `below floor at t=${t}`);
    close(d.sx * d.sx * d.sy, 1, 1e-9, 'sx²·sy'); // sx = 1/sqrt(sy): volume-preserving squash (the object reads as the same mass)
  }
  const end = gravityDrop(299, 0, { h: 700, e: 0.6 });
  assert.equal(end.landed, true);
  assert.equal(end.y, 0);
});

test('projectile: matches x = x0 + vx t, y = y0 + vy t + g t²/2 (no floor)', () => {
  const p0: [number, number] = [100, 500], v0: [number, number] = [12, -25], g = 1.2;
  for (const t of [0, 7, 19, 33]) {
    const p = projectile(t, 0, p0, v0, g);
    close(p.x, p0[0] + v0[0] * t, 1e-9);
    close(p.y, p0[1] + v0[1] * t + 0.5 * g * t * t, 1e-9);
  }
  // apex at t = -vy/g
  const ta = 25 / 1.2;
  close(projectile(ta, 0, p0, v0, g).vy, 0, 1e-9);
});

test('projectile: with a floor it never sinks, bounces lower each time and stops', () => {
  const floor = { y: 800, e: 0.5, mu: 0.8 };
  let maxAfter = -Infinity, hits = 0, prevVy = 0;
  for (let t = 0; t < 400; t++) {
    const p = projectile(t, 0, [0, 400], [10, -20], 1.2, floor);
    assert.ok(p.y <= 800 + 1e-9, `sank at t=${t}`);
    if (prevVy > 0 && p.vy < 0) hits++;
    prevVy = p.vy;
    if (hits === 1) maxAfter = Math.max(maxAfter, 800 - p.y);
  }
  assert.ok(hits >= 2, 'bounced');
  assert.ok(projectile(399, 0, [0, 400], [10, -20], 1.2, floor).landed, 'comes to rest');
});

test('spring: starts at 0, settles at 1; underdamped overshoots, critical/overdamped do not', () => {
  assert.equal(spring(0), 0);
  close(spring(10 * FPS, { damping: 10, stiffness: 100 }), 1, 1e-4);
  const peak = (cfg: object) => Math.max(...[...Array(120).keys()].map((f) => spring(f, cfg)));
  assert.ok(peak({ damping: 4, stiffness: 200, mass: 1 }) > 1.2, 'bouncy overshoots');
  assert.ok(peak({ damping: 2 * Math.sqrt(200), stiffness: 200, mass: 1 }) <= 1 + 1e-9, 'critical: no overshoot');
  assert.ok(peak({ damping: 60, stiffness: 200, mass: 1 }) <= 1 + 1e-9, 'overdamped: no overshoot');
});

test('spring: satisfies m x\'\' + c x\' + k (x - 1) = 0 (finite differences)', () => {
  const m = 0.7, c = 6, k = 180, cfg = { damping: c, stiffness: k, mass: m };
  const h = 0.01; // frames
  for (const f of [3, 9, 20]) {
    const x = (fr: number) => spring(fr, cfg);
    const dt = h / FPS;
    const v = (x(f + h) - x(f - h)) / (2 * dt);
    const a = (x(f + h) - 2 * x(f) + x(f - h)) / (dt * dt);
    close(m * a + c * v + k * (x(f) - 1), 0, 0.05 * k, `f=${f}`);
  }
});

test('topple: a taller rod falls more slowly (period ∝ sqrt(L)) and rests at restAngle', () => {
  const fallTime = (length: number) => { for (let f = 0; f < 2000; f++) if (topple(f, 0, { length, restAngle: 85 }) >= 84.9) return f; return Infinity; };
  const a = fallTime(200), b = fallTime(800);
  close(b / a, 2, 0.15, 'time ratio for 4× length'); // sqrt(4) = 2
  close(topple(1500, 0, { length: 300, restAngle: 80 }), 80, 0.5);
  assert.ok(topple(10, 0, { dir: -1 }) <= 0, 'dir -1 falls the other way');
});

test('pendulum: small-angle period 2π sqrt(L/g) and damping', () => {
  const L = 300, g = 1.6, T = 2 * Math.PI * Math.sqrt(L / g);
  close(pendulum(T, 0, 20, L, g, 1e9), 20, 1e-4);
  assert.ok(Math.abs(pendulum(5 * T, 0, 20, L, g, 60)) < Math.abs(pendulum(T, 0, 20, L, g, 60)));
});

test('dragDistance: approaches v0·τ, monotonic', () => {
  close(dragDistance(10000, 0, 5, 14), 70, 1e-6);
  let prev = -1;
  for (let f = 0; f < 100; f++) { const d = dragDistance(f, 0, 5, 14); assert.ok(d >= prev); prev = d; }
});

test('followThrough / anticipate: zero outside their windows', () => {
  assert.equal(followThrough(-1), 0);
  assert.equal(followThrough(200), 0);
  assert.equal(anticipate(0, 50), 0);
  assert.ok(anticipate(47, 50) < 0, 'pulls back before the action');
});

test('determinism: any frame, any order, same result', () => {
  const frames = [...Array(200).keys()];
  const run = (order: number[]) => order.map((f) => JSON.stringify([gravityDrop(f, 5, { h: 500 }), projectile(f, 3, [0, 0], [4, -9], 1, { y: 200 }), topple(f, 2), spring(f)]));
  const forward = run(frames);
  const shuffled = frames.map((f) => (f * 73) % frames.length); // a fixed permutation (73 is coprime with 200)
  const back = run(shuffled);
  shuffled.forEach((f, i) => assert.equal(back[i], forward[f]));
});
