---
name: narrator-moves
description: "Animate the History Cartoon Studio narrator with staff action moves: fly, vault, twirl, gate, point, screen pull, laser, cane, lever, crack, fish, helicopter, sword wipe, reaction drop."
---

# Narrator moves (History Cartoon Studio, repo its-Arish/naah)

Use this when a script, insert or re-hook asks the narrator to *do* something with his staff. First used in `projects/russia` (retention inserts, Nov 2026). The creator's planned moves were built and approved in two demos (`projects/moves-demo`, `projects/moves-demo2`, Nov 2026), so every move below is READY. Watch `out/narrator-moves-demo2.mp4` for the second set.

**Rule:** the narrator's design never changes (turban, sash, staff, stick body). These moves only re-pose him. Never draw Harry Potter, Sun Wukong or any other known character; it is always our narrator doing a generic staff move.

**Restraint:** no flying, helicopter, vaulting, twirling, Crack, fidgeting, sword wipes or comic reactions next to tragedies (famines, terror, war dead, child victims). Those beats stay `quiet: true`, still, with no narrator tricks. Reaction Drop is for surprising statistics and myths, never for deaths. Use each move sparingly (one every 1–2 minutes, never the same move twice in a row) so they stay a treat and keep the energy-cycle pacing.

**Rejected:** balancing the staff on a raised finger above his head (it read as balancing it on his head). The creator didn't like it; don't use it.

## Where the code lives

- `engine/characters/Host.tsx`: the narrator. Added props (defaults keep the classic standing pose, so old films are unchanged):
  - `staffMode`: `'hold'` (default, planted) | `'ride'` (astride, broomstick-style, cloth trailing) | `'spin'` (twirls at the hand; set `staffRot` in degrees) | `'level'` (held horizontally at chest height, a gate/barrier) | `'none'` (no staff drawn: the move draws its own `Staff` attached to the hand)
  - `legs`: `'stand'` | `'sit'` (astride) | `'tuck'` (vaults, falls) | `'crossed'` (cane lean)
  - `leftArm?: [a1, a2]` (staff arm, used with `staffMode='none'`), `rightArm?: [a1, a2]` (overrides the keyed right-arm pose)
  - `armLen` (default 1): cartoon arm stretch, e.g. 1.55 so hands can reach above the turban (helicopter)
  - Helpers: `hostLeftHand(x,y,scale,leftArm)`, `hostRightHand(x,y,scale,rightArm)` → hand point in frame coords; `reach(x,y,scale,side,tx,ty,armLen?)` → two-link IK arm angles putting a hand on a target (side -1 = left/staff arm, 1 = right). Use `reach` for both-hands grips.
  - The staff's foot sits at x ≈ `hostX - 107·scale` for the idle left arm (needed for any move that pivots on the staff). Shoulder is at local (0,-380).
- `engine/moves.tsx`: `IDLE` arm `[42,12]`, `lerpArm`, `along(hx,hy,ang,d)` (point along the staff), `aim(x1,y1,x2,y2)` (angle to a target), `Staff` (`hx hy ang gripTop squash s`: a free staff whose grip is at hx,hy; `gripTop` = distance from grip to crook end), `Stage` (camera rig + grey stage, `shakes`, `focus`), `VaultMove` (`t from plant to y s talking`: run 14f, swing 18f about the staff foot with tucked legs, land with squash).
- `projects/russia/src/Hooks.tsx` (copy into a new project's `src/` or promote to the engine):
  - `Rider`: narrator riding his staff. `<Rider x y s tilt speed arm expr talking flip />`. Bobs, tilts, draws speed-lines when `speed > 0.2`. Animate `x`/`y` yourself (a path, a loop with cos/sin, an ease-in arrival).
  - `Vault`: `<Vault t={f} from plant to y s />` (same timing as `VaultMove`). Use `from > plant > to` to vault leftwards.
  - `Receipt` / `BILL_LINES`: a printer whose paper grows one line at a time (`lines`, `printAt`). Good for a running "bill" / tally device across a film.
  - `MapTag`: dark left-aligned tag for drawing over Mapimator maps (dates, quotes, country labels).
  - `useGroup(s)`: frame within the run of consecutive beats that share a shot id, so a flight or march continues smoothly across several caption lines.
- Reference implementations: `projects/moves-demo/shots.tsx` (Screen Puller, Reaction Drop, Crack, Catch) and `projects/moves-demo2/shots.tsx` (Laser, Twirl, Cane, Lever, Fishing Rod, Helicopter, Sword Wipe, Vault Exit/Back). Copy the component and adapt the props/cards.

## Moves (all READY)

| Move | What happens | Use it for | How (component / key numbers) |
|---|---|---|---|
| **Fly in / ride** | Rides the staff like a broomstick, speed lines | Arrivals over maps, re-hooks | `Rider`; over maps use the recipe below |
| **Pole-vault on** | Runs, plants, swings over, lands | Entering the stage or a map | `<Vault t={f} from={-200} plant={720} to={1180} y={900} s={0.62} />` on the first beat; later beats show a plain `<Host x={to}>` |
| **Twirl (quick)** | Spins the staff at his hand | Monkey-King-style flourish at the start of a re-hook | `<Host staffMode={f<34?'spin':'hold'} staffRot={interpolate(f,[0,34],[0,720],Easing.out)} />` |
| **Baton Twirl + Flip** | Spins the staff, tosses it end-over-end and catches it | Light casual explaining | `Twirl` (demo 2): spin 0–36f, then toss g 2.3 v 34 for ~30f with rotation 25°/f, caught upright; then normal pose; swish/swish/whoosh/pop |
| **Gate / barrier** | Staff held level | Even-handed political beats (two tags, each side's view) | `staffMode="level"` |
| **Drop from the sky** | Falls in, lands with dust | Dramatic arrival | wrap Host in `gravityDrop(f,4,{h:900,g:2.6,e:0.15})`, `legs="tuck"` until landing, camera `shakes` + dust circles |
| **Pointing** | Straight arm / raised finger | Any emphasis | `keys=[{at:wordAt(s,'word'),arm:'point'}]` or `'finger'`; other arms: present shrug wave fist chin hip; expr: smile grin proud shock worried; on a `Rider` pass `arm="point"` |
| **Screen Puller** | Hooks the frame top with the crook, pulls down the next panel like a window shade | Changing slides/graphics mid-HOST | `Puller` (demo 1): raise 4–14f, pull 18–44f, back 50–62f; arm IDLE→[168,10]→[70,30]→IDLE; panel bottom follows the crook then a damped bounce; `slide_down` sfx |
| **Laser Pointer / Baton** | Aims the staff at each keyword card and taps on the spoken word | Lists, charts, keywords | `Laser` (demo 2): `staffMode='none'`, `leftArm=[96,6]`, `ang=aim(hand,target)`, `gripTop≈distance`; recoil 26px over 8f on `wordAt`; card pulses 1.14×; `tick` sfx |
| **Walking-Cane Lean** | Plants staff, crosses legs, leans on it with both hands like an old storyteller | "Long ago" story intros, reflective lines | `Cane` (demo 2): staff vertical at X-95, both hands via `reach`, `legs='crossed'`, whole group rotated ~-7°, `expr:'proud'` |
| **Lever / Crowbar** | Wedges staff under a heavy labelled block over a rock, strains, slips once, then tips it | A hard challenge finally overcome | `Lever` (demo 2): narrator mirrored at the long end, hands via `reach`; tilt -24→-15, slip to -22 (thud), then →-6; block rotates about its far-bottom corner; micro-shakes while straining; creak/thud/creak/ding; result card pops |
| **Crack** | Throws the staff at the camera; it grows huge, flash, crack lines, cut | Energetic chapter endings only | `Crack` (demo 1): wind 56, throw to 66, hit 79; scale 1+p³·11 while spinning; white flash, crack lines, shake; `impact`+`crack` sfx |
| **Catch** | Staff drops from above into his raised hand | Fun beat starts | `Catch` (demo 1): `gravityDrop(f,4,{h:760})`, caught at f 24 with hand at [160,12] |
| **Fishing Rod** | Casts up, reels each point card down on a line; cards swing and settle | Revealing points one by one | `Fish` (demo 2): `leftArm=[128,18]`, `gripTop 520`; cast flick 14f before each word (ang -20→25→-40); card descends 16f to its slot with damped swing; swish + reel `ticks` |
| **Helicopter** | Both hands overhead, staff spins as a rotor (stretching/shrinking + blur disc), dust, lifts off legs dangling, sways, flies off | "From above" / overview moments, big-picture maps | `Heli` (demo 2): `armLen` 1→1.55 over 12f, arms via `reach` to elbows at (±100, -500) plus drawn forearms to the hub at y-660; rotor span = 305·abs(cos θ), speed ramps 12–40f; lift from 42f, capped at -200 so the rotor stays in frame; `machine` + whoosh sfx |
| **Sword Sweep / Wipe** | Two-handed swing knocks the clutter cards flying, fresh card pops in | Resetting a crowded screen | `Sweep` (demo 2): grip (X-40, Y-430), both hands via `reach`; wind 0→150° over 12f, swing 150→-115° in 8f; cards fly with projectile + spin; white arc trail; shake; `swish` on the word |
| **Pole-Vault Screen Exit / Back** | Vaults clean out of frame; stage props slide out; after the chapter card vaults back in | Between major chapters | `Exit`/`Back` (demo 2): `VaultMove` from 1420 plant 1700 to 2500 in the last 50f; back: from -300 plant 1080 to 1420, then wave; whoosh |
| **Reaction Drop** | Goes slack, staff clatters down, sheepishly bends to pick it up | Shocking stat / busted myth (never deaths) | `Drop_` (demo 1): T0 6, bend 50, up 62, done 82; staff via `topple({length:610,g:1.6,nudge:0.06,restAngle:86,e:0.3})`; body rotates -34° about the feet; `expr` shock then smile; `clang`; `gag: true` |

## Recipe: fly in over a map (map scenes can't hold React art directly)

1. Give the beats `"shot": "map:<name>"`.
2. Export from `shots.tsx`: `export const MapExtras = { 'map:<name>': MyExtra }`.
3. `MyExtra` returns `<svg style={{position:'absolute',left:0,top:0}} width={1920} height={1080}>…</svg>` with a `<Rider>` whose position comes from `useGroup(s).g`: arrive from off-screen top-left with `Easing.out`, optionally loop round the target (x = cx + cos(a)·r, y = cy + sin(a)·r·0.5, flip when moving left), then hover beside it with `speed≈0.1`.
4. Keep map JSON items sparse (regions, one pin, one effect); put dates and quotes in `MapTag`s at the screen edges so nothing piles up on the target.

## Placement rules

- HOST-type beats: narration text owns the left half (x 110–910); props/cards go at x 900–1300 (keep cards clear of the text block's y-range); the narrator stands at x ≈ 1380–1420, ground y 960.
- STORY/INSERT beats: keep key action above y ≈ 850 (captions) and out of the top-left 300×120 date tag.
- Riders over maps: scale 0.38–0.45, kept to the right third once arrived so the map target stays visible.
- Anything airborne (helicopter, toss, crack) must stay inside the frame top; cap heights and check stills.
- Stick-figure arms are short (left 146px, right 170px from the shoulder at -380): to reach above the head, use `armLen` or draw forearms.

## Check

Run `node scripts/studio.mjs stills <project> <frames>` at mid-motion frames of each moving beat (about 30 % and 85 % through; beat start frames are in `build/timeline.json` → `shots[].from`), open the contact sheet, and fix overlaps or out-of-frame parts before a full render. Renders run at ~13 fps on this machine, so run `studio all` in the background.
