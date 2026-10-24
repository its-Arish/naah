# Physics

All motion in the studio is a **pure function of the frame number**. A shot can be rendered from any frame, in any order and on any number of workers, and the result is always identical. That is also what lets you re-render a single shot and splice it into a finished film.

Every helper uses the exact closed-form solution where one exists. The one exception is the toppling rod, which has no closed form and is integrated with fixed-step RK4 from t = 0, so it is still deterministic. `tests/physics.test.ts` checks each helper against the equation it claims to solve (`npm test`).

Units: px and frames (30 fps). Screen y points **down**. Gravity is in px/frame². `g ≈ 1.6` reads as everyday objects at the scale of our characters (a 1.6 m person ≈ 300 px), and `g ≈ 2.4` gives snappier cartoon drops.

All helpers are exported from `engine/lib/physics.ts`, which `@engine/lib/core` re-exports.

| Helper | Equation | Use it for |
|---|---|---|
| `gravityDrop(frame, start, { h, g, e, maxBounces, minSpeed })` | `y = -h + g t²/2` until impact at `t₀ = √(2h/g)`. Each bounce leaves at `e·v` and peaks at `e²` of the previous height. Volume-preserving squash on impact (`sx²·sy = 1`); stretch along the motion while falling. | Anything dropped: crates, stamps, crowns, signs, a character landing |
| `projectile(frame, start, p0, v0, g, floor?)` | `x = x₀ + vₓt`, `y = y₀ + v_y t + g t²/2`. With a `floor`, it bounces with restitution `e`, loses horizontal speed to friction `mu`, then slides to a stop with exponential drag. Returns `angle` (the direction of travel) for arrows and spears. | Cannonballs, thrown objects, arrows, coins flying out of a chest |
| `spring(frame, { damping, stiffness, mass })` | Exact damped harmonic oscillator released from 0 towards 1: `m x'' + c x' + k(x−1) = 0`. Under-damped (`c < 2√(km)`) overshoots and rings. Critical (`c = 2√(km)`) is the fastest with no overshoot. Over-damped creeps in. | Any "pop" or settle. `springPop` (bouncy pop-in) and `poseSpring` (characters snapping between poses) are presets. |
| `topple(frame, start, { length, g, nudge, restAngle, e, dir })` | A uniform rod pivoting at its base: `θ'' = (3g / 2L) sin θ`. It falls slowly at first, then fast, which is the classic "timber!" feel. Taller things fall more slowly (time ∝ √L). It hits the ground at `restAngle` with a small damped rebound. | Poles, flags, trees, statues, a fainting character |
| `pendulum(frame, start, amp, lengthPx, g, decayFrames)` | Small-angle pendulum, `θ = A e^(−t/τ) cos(√(g/L) t)`. | Hanging signs, lanterns, bells, a swinging sword |
| `followThrough(since, amp, period, decay)` | A damped swing kicked by a sudden move. | Cloth, turban tails, plumes, capes, hair after a pose change (already built into `Host` and `Chibi`) |
| `anticipate(frame, at, amt, lead)` | A small move the opposite way just before the action. | Wind-up before a throw or a jump |
| `dragDistance(frame, start, v0, tau)` | `v₀τ(1 − e^(−t/τ))`: pushed, then slowed by drag. | Sliding chests, boats coasting, a shove |
| `walkCycle(frame, speed, phase)` | Two body bobs per stride, with opposite swing of the arms and legs. | Custom walkers. `Chibi legs="walk"` already does this. |

## Rules that make it read as "real"

1. **Sync sound to impact frames, not guesses.** The impact frame is known analytically, so compute it. `projects/physics-demo/shots.tsx` shows how, and its beats file lists cues that were calculated from the functions. Thuds get quieter on each bounce, in proportion to the impact speed.
2. **Squash on impact, stretch in flight.** `gravityDrop` returns `sx`/`sy`. Scale about the object's **base** (draw it with its origin at the bottom) so it stays planted on the floor.
3. **Shadows shrink with height.** A contact shadow, an ellipse whose size is `1 − height/k`, sells the floor contact cheaply.
4. **Heavier means less bounce, not slower fall.** Every object falls at the same `g`; vary `e`. Use about 0.15 for a sand bag, 0.45 for a crate and 0.7 for rubber.
5. **Rolling without slipping:** spin angle = distance travelled / radius.
6. **Camera shake on big impacts only**, 6 to 10 frames and decaying (`CameraRig shakes`). Never shake for a sombre beat.
7. **Poses snap on a spring, bodies animate "on twos".** Characters update their drawing every 2 frames (`onTwos`), which gives the hand-drawn feel, while the camera and physics run on ones.
8. **Nothing teleports.** Something that leaves the frame leaves on a curve (ease-in, a projectile, or an exponential like `y = −560(1 − e^(−(t/90)²))` for a rocket), and something that arrives settles on a spring.

## Adding a new helper

Write it as a pure function of `(frame, start, params)`, with no state kept between calls. Add a test in `tests/physics.test.ts` that checks it against its equation, plus the determinism test. Add a shot to `projects/physics-demo` that shows it.
