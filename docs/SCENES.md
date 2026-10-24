# Scene & prop catalog

Everything here is importable from a project's `shots.tsx`. Positions are in the 1920×1080 frame; a `<Layer depth>` inside a `<CameraRig>` gives parallax (0 = far background, 1 = action plane).

The quickest way to see what something looks like is to search `projects/india-1000-years/src/` for its name and render that shot with `studio stills`.

## The narrator (`Host`)

`import { Host } from '@engine/characters/Host'`: the recurring presenter, a stick-figure guide with an orange turban, a red sash and a tall staff. He stands on the grey stage (`GreyStage`) and is usually placed through `hostShot()` / `HostShot` from the kit.

| Prop | Meaning |
|---|---|
| `x`, `y` | position; `y` is the ground line (default 1000) |
| `keys` | pose keyframes `[{ at, arm?, expr? }]` in local frames. Each change springs into place with overshoot, and his clothing follows through. |
| `arm` | `idle` `point` `finger` `shrug` `wave` `present` `fist` `hip` `chin` |
| `expr` | `smile` (default) `grin` `proud` `shock` `worried` |
| `talking` | frame ranges where the mouth moves. Use `talk(s)` for the beat's narration window. With a voiceover the mouth follows the real audio. |
| `hatOff`, `dim`, `scale` | gag hat-tip, stage dimming for sombre beats, size |

## Everyone else (`Chibi`)

`import { Chibi } from '@engine/characters/Chibi'`: the big-headed cast (kings, soldiers, merchants, crowds).

| Prop | Values |
|---|---|
| `x`, `y`, `s`, `flip` | feet position, scale, face left |
| `outfit` | `{ top, bottom?, robe?, trim?, belt?, pattern?, sash?, cape? }` (colours; `pattern` is a `url(#id)` from `fx/Defs`) |
| `hat` | `none` `crown` `queen` `sultan` `pagri` `turbanW` `ghurid` `mongol` `nadiri` `helmet` `cap` `gandhicap` `pith` `shako` `tricorn` `topi` `skullcap` `veil` `scarf` `kirat` `malla` `rana` `europe` `indira` `bald` `bun` `hairlong` `parted` (look at `Hat` in Chibi.tsx for the full set) |
| `hatColor`, `hair`, `skin`, `mustache`, `beard`, `beardColor`, `glasses` | looks |
| `item`, `itemL` | right / left hand: `sword` `spear` `shield` `musket` `khukuri` `flag` `banner` `scroll` `book` `notebook` `lamp` `brick` `hammer` `mallet` `coin` `sack` `bundle` `placard:TEXT` |
| `pose` | `idle` `hold` `point` `raise` `bothUp` `cheer` `present` `cross` `carry` `attack` `pass` `scribble` `hipAngry` `pray` `shrug` `fist` `wave` `pull` … either a fixed string or keyframes `[{ at, pose }]` |
| `legs` | `stand` `walk` `march` `sit` `kneel` |
| `expr` | `normal` `happy` `calm` `grin` `shock` `angry` `sad` `determined`, fixed or keyframes `[{ at, expr }]` |
| `talking`, `seed`, `delay` | mouth ranges; per-character randomness (blinks, idle sway); phase offset for crowds |

## Character internals

`import { … } from '@engine/characters/Chibi'`

| Export | What it is | Props |
|---|---|---|
| `Chibi` |  | |
| `ChibiFace` |  | `{ expr: string; blink: boolean; mouth: number; mustache?: boolean; beard?: boolean; beardColor?: string }` |
| `Item` |  | `{ kind: string; x: number; y: number; ang: number; side: number; frame: number; flip?: boolean }` |
| `MiniFlag` | Nepal flag: two stacked pennants, crimson with blue border, moon above, sun below. Origin = hoist top. Height ~ 120. | `{ wave?: number }` |

`import { … } from '@engine/characters/Host'`

| Export | What it is | Props |
|---|---|---|
| `Host` |  | |
| `Topi` |  | `{ x?: number; y?: number; s?: number }` |
| `Safa` | Rajasthani-style safa turban with a loose tail that swings with follow-through. | `{ tail?: number }` |

## Kit (shot building blocks)

`import { … } from '@engine/kit'`

| Export | What it is | Props |
|---|---|---|
| `talk` | Frames during which a character's mouth should flap (while the beat's words reveal). | |
| `wordAt` | Local frame at which a given word of the beat's narration appears (for syncing actions/sfx). | |
| `HostShot` | The narrator on the grey stage, with optional props (children), overlay HTML and spotlight. | `{ s: Shot; keys: HostKey[]; children?: React.ReactNode; overlay?: React.ReactNode; spot?: { at: number; text?: string; x?: number; y?: number }; x?: number }` |
| `hostShot` | Shorthand factory: `const Intro = hostShot((s) => [{ at: 0, arm: 'wave', expr: 'smile' }])`. | |
| `PopProp` | An SVG group that springs into view at local frame `at`. | `{ at: number; x: number; y: number; s?: number; children: React.ReactNode }` |
| `Drop` | SVG content that falls from height h under gravity, bounces and squashes on landing. | `{ at: number; x: number; y: number; h?: number; children: React.ReactNode; e?: number }` |
| `DropHtml` | Same as Drop, for HTML overlays (stamps, signs with real text). | `{ at: number; left: number; top: number; h?: number; children: React.ReactNode }` |
| `Rider` | Horse + seated chibi rider (walk / gallop gaits, rider bobs with the horse). | `{ x: number; y: number; s?: number; flip?: boolean; gait?: 'idle' \| 'walk' \| 'gallop'; horse?: string; phase?: number; silhouette?: boolean; rider: any }` |
| `makeOpening` | Default opening: title writes itself on over a dark vignette (pass your own art as children). | |
| `Card` | Section title card ("Act 3: Title" → small red "Act 3" + big title). | |
| `makeEnd` | End card with the video title. | |
| `Missing` | Fallback for a shot id with no component yet: shows a visible placeholder so it's caught in stills. | |

## Camera & overlays

`import { … } from '@engine/fx/Camera'`

| Export | What it is | Props |
|---|---|---|
| `useCam` |  | |
| `CameraRig` | Wraps a whole shot. Children use <Layer depth> to get parallax. | `{ move?: CamMove; children: React.ReactNode; seed?: string }` |
| `Layer` | A parallax layer. depth 0 = fixed sky, 1 = main action plane, >1 = foreground. | `{ depth: number; children: React.ReactNode }` |

`import { … } from '@engine/fx/Defs'`

| Export | What it is | Props |
|---|---|---|
| `GlobalDefs` | Shared SVG defs (patterns, filters, gradients) referenced document-wide by id. | |

`import { … } from '@engine/fx/Overlays'`

| Export | What it is | Props |
|---|---|---|
| `DateTag` | Grey date tag, top-left. Rolls like an odometer from `from` to `to` at local frame 0. | `{ from: number \| null; to: number \| null }` |
| `Narration` | Word-by-word narration. variant: host (black, beside the host) or caption (white outline, lower third). | `{ words: Word[]; variant: 'host' \| 'caption' \| 'title'; side?: 'left' \| 'right'; dark?: boolean; top?: number }` |
| `FanWords` | Big floating phrases that fan out around the host (reference: "Should we attack?" / "Will it rain?"). | `{ items: { text: string; at: number; x: number; y: number; rot?: number }[]; dark?: boolean }` |
| `Spotlight` | Spotlight dim: grey stage darkens with a soft white glow and a drifting ghost word. | `{ at: number; text?: string; x?: number; y?: number }` |
| `Label` | Label that pops on, with a little pointer line (e.g. "Kathmandu"). | `{ text: string; x: number; y: number; at: number; color?: string; size?: number; rot?: number }` |
| `Bubble` | Speech bubble for SKETCH dialogue: white rounded box with a tail pointing at the speaker; words reveal one by one. | `{ words: Word[]; x: number; y: number; w?: number; tailX: number; tailY: number }` |

## Generic parts (clouds, hills, trees, huts…)

`import { … } from '@engine/scenes/Parts'`

| Export | What it is | Props |
|---|---|---|
| `Cloud` |  | `{ x: number; y: number; s?: number; speed?: number; fill?: string }` |
| `Range` | A snowy mountain range. peaks: [x, height] | `{ base: number; peaks: [number, number][]; rock?: string; snow?: string; shade?: string; snowLine?: number }` |
| `Hills` |  | `{ y: number; fill: string; amp?: number; seed?: string; stroke?: boolean }` |
| `PrayerFlags` |  | `{ x1: number; y1: number; x2: number; y2: number; sag?: number; n?: number }` |
| `Hut` |  | `{ x: number; y: number; s?: number }` |
| `Tree` |  | `{ x: number; y: number; s?: number; c?: string; c2?: string }` |
| `Pine` |  | `{ x: number; y: number; s?: number; c?: string }` |
| `Bush` |  | `{ x: number; y: number; s?: number; c?: string }` |
| `Fronds` |  | `{ x: number; y: number; s?: number; c?: string; flip?: boolean }` |
| `Pagoda` | Multi-roof pagoda temple (Newar style). Origin = ground centre. | `{ x: number; y: number; s?: number; tiers?: number; stretch?: number }` |
| `Stupa` | Swayambhunath-style stupa with painted eyes. | `{ x: number; y: number; s?: number }` |
| `Flame` |  | `{ x: number; y: number; s?: number; seed?: string }` |
| `Diyo` | Little oil lamp (diyo) with flicker. | `{ x: number; y: number; s?: number; i?: number }` |
| `Critter` |  | `{ kind: 'rabbit' \| 'monkey' \| 'redpanda' \| 'yak' \| 'goat'; x: number; y: number; s?: number; look?: 'stare' \| 'normal'; flip?: boolean }` |

## Backgrounds

`import { … } from '@engine/scenes/Backgrounds'`

| Export | What it is | Props |
|---|---|---|
| `Himalaya` |  | `{ variant?: 'day' \| 'sunrise' }` |
| `Valley` |  | `{ tone?: 'dawn' \| 'day' }` |
| `Lumbini` |  | |
| `StupaHill` |  | |
| `Durbar` |  | `{ stretch?: [number, number, number]; labels?: boolean }` |
| `PalaceHall` |  | `{ throne?: boolean }` |
| `HillBattle` |  | |
| `Street` |  | `{ festive?: boolean }` |
| `Jungle` |  | |
| `FestivalNight` |  | |
| `Quake` |  | `{ rebuild?: number }` |
| `InsertBg` | The dark insert/close-up vignette. | `{ glow?: boolean }` |
| `GreyStage` |  | `{ dim?: number }` |
| `ForegroundFronds` |  | `{ c?: string }` |

## Props

`import { … } from '@engine/scenes/Props'`

| Export | What it is | Props |
|---|---|---|
| `NEPAL_PTS` |  | |
| `NepalShape` |  | `{ fill?: string; stroke?: string; sw?: number }` |
| `Rhino` |  | `{ x: number; y: number; s?: number; flip?: boolean }` |
| `Tiger` |  | `{ x: number; y: number; s?: number; flip?: boolean }` |
| `SnowLeopard` |  | `{ x: number; y: number; s?: number }` |
| `Medal` |  | `{ x: number; y: number; s?: number; ribbon: [string, string]; label?: string; rot?: number }` |
| `Crown` |  | `{ x: number; y: number; s?: number }` |
| `GlassCase` |  | `{ x: number; y: number }` |
| `Flower` |  | `{ x: number; y: number; c: string; at: number; s?: number; kind?: number }` |
| `DalBhat` | Food: thali of dal bhat. | `{ x: number; y: number; s?: number }` |
| `Momo` |  | `{ x: number; y: number; s?: number }` |
| `SelRoti` |  | `{ x: number; y: number; s?: number }` |
| `Book` | Constitution book, open. | `{ x: number; y: number; s?: number; title?: string }` |
| `Icon` |  | `{ kind: 'dam' \| 'laptop' \| 'book' \| 'mountain' \| 'tourist'; x: number; y: number; at: number; s?: number }` |

## Scene library from the India film

`import { … } from '@engine/scenes/India'`

| Export | What it is | Props |
|---|---|---|
| `Horse` | Side-view horse with a gallop / walk / idle cycle. Origin = ground under the belly. Faces right. | `{ x: number; y: number; s?: number; flip?: boolean; gait?: 'idle' \| 'walk' \| 'gallop'; color?: string; saddle?: boolean; phase?: number; silhouette?: boolean }` |
| `Camel` | Camel carrying treasure chests. Faces right. | `{ x: number; y: number; s?: number; flip?: boolean; walk?: boolean; load?: boolean; silhouette?: boolean; phase?: number }` |
| `Elephant` | War elephant (for later acts too). Faces right. | `{ x: number; y: number; s?: number; flip?: boolean; walk?: boolean; howdah?: boolean; phase?: number; panic?: boolean }` |
| `DelhiGate` |  | `{ dusk?: boolean; silhouette?: boolean }` |
| `DesertRoad` | Desert road to the horizon (for the treasure train). | |
| `RajputFort` |  | |
| `Passes` | Afghan mountain passes. | |
| `TempleVault` | Temple treasury interior: gold doors, lamps, chests. No deity shown. | `{ emptied?: number }` |
| `SomnathCoast` | Somnath-style shikhara temple on the coast with sea. | |
| `Plain` | Wide flat North Indian plain (Tarain) with distant tents. | `{ dawn?: boolean; tents?: boolean }` |
| `Tent` |  | `{ x: number; y: number; s?: number; closed?: boolean; c?: string; flag?: string }` |
| `TentInterior` | Inside a big Rajput camp tent (for the sketch). | |
| `SUB_PTS` | Stylised Indian subcontinent outline (c. 1000 AD, no modern borders) in a 1000×1100 box. | |
| `KingdomMap` |  | `{ x: number; y: number; s?: number; wobble?: boolean; unify?: number; unifyColor?: string; at?: number }` |
| `GdpPie` | World-GDP pie chart with India's wedge. share 0..1. | `{ x: number; y: number; r?: number; share: number; label?: string }` |
| `Tally` | Corner tally / counter box (e.g. "RAID 1 OF 17"). | `{ text: string; x?: number; y?: number; bump?: number }` |
| `CoinBurst` | Gold coins flying out under real gravity (used in raids). | `{ x: number; y: number; at: number; n?: number; seed?: string }` |

`import { … } from '@engine/scenes/IndiaB1'`

| Export | What it is | Props |
|---|---|---|
| `SultanCourt` | Red-sandstone court: cusped arches, marble floor, throne under a canopy. | `{ throne?: boolean; library?: boolean; tint?: number }` |
| `QutbMinar` |  | |
| `SultanateMap` | Northern band = Delhi Sultanate (stylised). | `{ x: number; y: number; s?: number; grow?: number; at?: number }` |
| `CapitalMap` | India outline with Delhi and Daulatabad, plus a crawling "city" line. progress 0..1 (negative = going back). | `{ x: number; y: number; s?: number; progress?: number; back?: boolean; dropouts?: boolean }` |
| `AsiaMap` | Stylised medieval Asia for the Mongol sweep (blobs, not real borders). | `{ flatten?: number[]; arrows?: number }` |
| `FrontierMap` | NW frontier: forts line + arrows that snap against it (with physics on the broken halves). | `{ hits: number[] }` |
| `Market` |  | `{ boards?: boolean }` |
| `FlatChart` | Price chart insert: flat line under a royal seal. | `{ p: number }` |
| `HotRoad` |  | |
| `Mint` |  | |
| `Kitchen` |  | |
| `Study` |  | |
| `Boulders` | Hampi-style boulder landscape. | `{ sun?: boolean }` |
| `CompanyFlag` | EIC-style flag (stylised: red & white stripes, simple cross canton). | `{ x: number; y: number; s?: number; wave?: number }` |
| `BreakingMap` | Sultanate map breaking apart: pieces drift away with momentum + spin (decelerating). | `{ x: number; y: number; s?: number; starts: number[] }` |

`import { … } from '@engine/scenes/IndiaB2'`

| Export | What it is | Props |
|---|---|---|
| `HampiStreet` |  | `{ ruin?: number }` |
| `StoneChariot` | Stone chariot (Hampi icon). | `{ x: number; y: number; s?: number }` |
| `PanipatDiagram` |  | `{ charge: number; fire: number; rebound: number; label1761?: boolean }` |
| `Diary` |  | `{ lines: { text: string; at: number }[]; stars: number; title?: string }` |
| `TajMahal` |  | `{ x?: number; y?: number; s?: number; build?: number; lean?: number; scaffold?: number }` |
| `TajGarden` |  | `{ dusk?: boolean }` |
| `AgraWindow` |  | |
| `MughalMap` |  | `{ x: number; y: number; s?: number; extent: number; loud?: number }` |
| `TreasuryBar` | Treasury bar that drains. | `{ x: number; y: number; v: number }` |
| `PeacockThrone` | Peacock Throne. | `{ x: number; y: number; s?: number; glow?: number }` |
| `HillForts` |  | |
| `FamilyTree` | Family tree insert for Babur. | `{ at: number[] }` |
| `DebateHall` | Scholars' debate hall (Ibadat Khana) — respectful, no gags. | |

`import { … } from '@engine/scenes/IndiaB3'`

| Export | What it is | Props |
|---|---|---|
| `EmptyStreet` | Restrained aftermath street: overturned stalls, smoke, nobody. | `{ smoke?: boolean; dim?: number }` |
| `RouteMap` |  | `{ p: number; order: string[] }` |
| `TowerLondon` | Tower of London (stylised) with a display case. | |
| `CompanyCoast` | Coastal Company fort / warehouse with a merchant ship. | `{ fort?: boolean; flag?: boolean }` |
| `TroopBlocks` | Troop blocks (sized honestly). greyThird 0..1 greys out a third of the big block; collapse 0..1 scatters the rest. | `{ small: number; big: number; greyThird?: number; collapse?: number }` |
| `EmptyVillage` | Restrained famine village: doors, empty baskets, cracked earth, no people. | |
| `RevenueLedger` | London ledger with rising revenue column. | `{ n: number; title?: string }` |
| `Westminster` | Westminster-ish facade. | |
| `RailMap` |  | `{ x: number; y: number; s?: number; p: number }` |
| `Factory` | Factory with smokestacks. | `{ x: number; y: number; s?: number }` |
| `Loom` | Hand loom. | `{ x: number; y: number; s?: number }` |

`import { … } from '@engine/scenes/IndiaB4'`

| Export | What it is | Props |
|---|---|---|
| `NightPlatform` | Night railway platform with one lamp. | `{ train?: number }` |
| `BaghPlan` | Overhead plan of a walled garden with one narrow exit (no people drawn). | `{ hl?: number }` |
| `GrainOut` | Grain sacks leaving a village by cart (restrained). | |
| `DandiMap` | Dandi march map (Gujarat coast stylised). progress 0..1 | `{ p: number }` |
| `Shallows` | Beach / shallows at dawn. | |
| `Bungalow` | Bungalow office with ceiling fan and huge maps. | `{ fan?: boolean }` |
| `PartitionMap` | Partition map: Punjab and Bengal with a line that draws itself; villages flicker. | `{ draw: number; flicker?: number; flows?: number }` |
| `PrincelyMap` | Princely states: 565 speckles resolving to one colour; Kashmir keeps flickering. | `{ resolve: number }` |
| `Ballot` | Ballot paper with symbols. | `{ mark: number }` |
| `WheatFields` | Green fields with wheat swaying. | |
| `Airfield` | Night airfield with a cargo plane. | `{ planeX?: number; lift?: number }` |
| `TechOffice` | Office of laptops (Bangalore). | `{ boom?: number }` |
| `Launch` | Rocket launch + Mars orbit. | `{ t: number }` |
| `MarsOrbit` |  | |
| `DelhiParliament` | New Delhi parliament: circular sandstone colonnade. night=true for 14 Aug 1947. | `{ night?: boolean }` |
