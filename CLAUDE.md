# CLAUDE.md: how to make a video with this repo

You are working in **History Cartoon Studio**. A person gives you a **script** (text, .md, .pdf or .docx) and sometimes a **voiceover** recording. You turn it into a finished MP4 in this repo's house style: the recurring turbaned narrator on a grey stage, storybook scenes, handwritten captions, physics-based motion and synthesised sound effects. There are no stock images, no AI art and no music, unless the person asks.

Read these before your first video: `docs/STYLE.md` (the look and the rules), `docs/PHYSICS.md` (how things move), `docs/SCENES.md` (every ready-made character, scene and prop) and, if there is a voiceover, `docs/VOICEOVER.md`. Then look at `projects/physics-demo/shots.tsx` and a few shots in `projects/india-1000-years/src/ShotsIndia.tsx` for idioms.

## 0. Environment

```
node scripts/studio.mjs doctor
```
This needs Node ≥ 18, ffmpeg, Python 3 with numpy and scipy, and Chromium for Playwright.
- Normal machine: `npm install && npx playwright install chromium && pip install -r requirements.txt`.
- Sandboxes where the npm registry is blocked: the CLI also finds packages in `/opt/npm-tools/node_modules` or in any folder listed in `NODE_PATH`. For the browser it uses `CHROMIUM_PATH`, then `/opt/pw-browsers/chromium`, then Playwright's own download. Run tests with `npx tsx --test tests/*.test.ts` (or the `tsx` binary found the same way).
- Fonts are bundled in `assets/fonts`, so no downloads are needed.

## 1. Agree the brief (ask only what you can't infer)

Ask once, briefly, if the person hasn't said:
- the **target length** (sets how much you condense or expand)
- whether to **fact-check and correct** the script (the default is yes: correct it, note each fix and tell them)
- whether a **voiceover** is coming
- for long films (> 10 min), whether they want a **pilot** first (default: render the first act, about 2 to 3 minutes, and show it before the rest)

Length maths: narration plays at about 3.2 words/s, plus about 0.9 s per beat and 2.2 s per section card. So 1,000 words is roughly 6 to 7 minutes.

## 2. Set up the project

```
node scripts/studio.mjs new <slug> "Video Title"      # copies projects/_template
```
Put the script into `projects/<slug>/script.md` using these markers. Keep the author's words; only add structure:
```
# Title
## Cold Open {nocard}          section without a title card
## Act 1: Name                  section with a title card
[On-screen: 1192 | Tarain]      date tag for following beats (first number = year; "300 BC" works)
[HOST] / [STORY] / [INSERT]     force the type of the next paragraph
[SKETCH] … A: line / B: line … [/SKETCH]
[Note: …] or (( … ))            production notes (ignored)
```
Then:
```
node scripts/studio.mjs draft <slug>                  # → beats/00-draft.json (mechanical split, ≤14 words per beat)
```

## 3. Fact-check

Go through every specific claim: dates, numbers, superlatives, quotes and "firsts". Use web search when you have it. Fix the beat text and add `"fix": "was …; now … (source)"` to the beat. List every fix in the project's `README.md` as a table (Where / Original / Changed to / Reason). Tell the person what you changed. If they supplied a voiceover containing an error, flag it to them instead of changing the captions.

## 4. Direct the beats (the important creative step)

Replace `beats/00-draft.json` with hand-directed files, one per act or a few acts: `beats/00-cold-open.json`, `01-act-1.json` and so on. Files are read in name order. Each file is `{ "title", "sections": [...] }` or a bare array of sections. **Delete 00-draft.json** once your own files exist; duplicate ids are an error.

A beat:
```json
{ "id": "tarain2", "shot": "tarain", "type": "STORY", "date": 1191,
  "text": "Prithviraj *crushed* the invaders at Tarain.",
  "sfx": [["clang", "w:crushed"], ["gallop", 0, 0.5]],
  "amb": "wind", "gag": false, "quiet": false, "hold": 4.5, "speaker": "A", "fix": "…" }
```
- `id` is unique. `shot` is the component that draws it. Consecutive beats can share a shot id; each still gets its own component instance, with `s.words` and timing.
- `type`: `HOST` | `STORY` | `INSERT` | `SKETCH` (see STYLE.md). The rhythm is roughly 30 % HOST and 70 % STORY/INSERT. Open each act on the host, cut away for the story, and come back to the host for asides and jokes.
- `*word*` emphasises a word (coloured, with a tick sound). Use one or two per beat, at most.
- `date` sets the year on the tag (`null` hides it). Change it only when the story moves in time; the tag animates the change.
- `sfx`: `[kind, when, volume?]`. `when` is a frame within the beat, `"w:word"` (hits as that word appears or is spoken) or `"end"`.
  - Kinds: `whoosh tick ticks pop pops boing thud drum coins kaching ding clang slam slide_down paper scribble blip sob neigh rumble bleat gallop`. For `gallop`, the sound lasts until the end of the beat.
  - Automatic sounds: a whoosh on scene changes, ticks on emphasis and date rolls, and a blip on sketch lines. Turn them off with `"quiet": true`.
- `amb` is an ambience bed under the beat: `wind`, `waves`, `birds` or `camp`. Consecutive beats merge into one bed.
- `gag: true` adds a 1 s beat for the laugh. `hold: 5` fixes the duration in seconds (useful for physics gags that need time).
- **Tragedies**: use `quiet: true` and no gags, and show no violence. See the restraint rules in STYLE.md.

## 5. Draw the shots

`projects/<slug>/shots.tsx` must export `SHOTS: Record<shotId, React.FC<{ s: Shot }>>`, including `opening` and `end` (`makeOpening`, `makeEnd`). For films longer than a few minutes, write one file per act in `src/` and merge them in `shots.tsx`, as `projects/india-1000-years/shots.tsx` does.

Idioms:
```tsx
const Tarain: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();                  // local frame within this beat
  const hit = wordAt(s, 'crushed');             // frame the word appears / is spoken
  return (<>
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [960, 700], shakes: [{ at: hit, amp: 10, len: 10 }] }}>
      <Plain />                                    {/* background with its own <Layer depth> */}
      <Layer depth={1}>
        <Rider x={300 + …} y={960} gait="gallop" rider={{ outfit: …, hat: 'pagri', item: 'sword', pose: 'attack' }} />
        <Drop at={hit} x={960} y={800} h={600}><Crown /></Drop>  {/* gravity + bounce + squash */}
      </Layer>
    </CameraRig>
    <Label text="Tarain, 1191" x={960} y={150} at={hit} />   {/* HTML overlay, above the caption zone */}
  </>);
};
```
- **Host shots**: `hostShot((s) => [{ at: 0, arm: 'present', expr: 'smile' }, { at: wordAt(s, 'but'), arm: 'shrug' }], { props: (s) => <PopProp at={20} x={1000} y={500}>…</PopProp> })`.
- **Reuse before you draw.** First look at the pictures in `docs/gallery/` (every costume, hat, pose, background, vehicle, animal and prop, with its name). Costumes are ready-made in `engine/cast/Wardrobe.ts` (`<Chibi {...W.GI()} />`, re-dress with `dress(W.GI(), { hat: 'cap' })`); real politicians use `engine/cast/Silhouette.tsx`; stamps, counters, corner notes, cards, calendars and bar charts are in `engine/fx/Infographics.tsx`. After adding to the library, run `bash projects/gallery/export.sh` to refresh the pictures, and `node scripts/export_rigs.mjs` to refresh the hand-animation rigs in `rigs/` (PSD, SVG, PNG parts and pivots for every costume and the narrator; see `rigs/README.md`). `docs/SCENES.md` lists the backgrounds, maps, animals, buildings and props. Draw new ones in the same line style (OL outlines, flat fills). Put scenes another film could reuse in `engine/scenes/` and keep one-off scenes in the project's `src/`.
- **Physics**: use `gravityDrop`, `projectile`, `topple`, `pendulum` and `spring` for anything that falls, flies, swings or settles. Never drive a fall with a linear `interpolate`. Time sound cues to the computed impact frames (see `projects/physics-demo`).
- **Determinism**: no `Math.random()`, `Date.now()` or component state. Use `random(seed)` from core, and derive everything from `useCurrentFrame()`.
- **Layout**: keep labels above y ≈ 850 and clear of the top-left date tag. Nothing important should go under the HOST narration text.
- Sketch bubbles are drawn automatically. Place A on the right and B on the left, or export `BUBBLES` from `shots.tsx` to move them.

## 6. Check, look and fix (don't skip this)

```
node scripts/studio.mjs check <slug>                  # timeline → bundle → lists shot ids with no component
node scripts/studio.mjs stills <slug> --section 2     # one still per beat (at 80 %) + 4×4 contact sheets
node scripts/studio.mjs stills <slug> 1200 1215 1230  # specific frames (mid-motion checks)
```
**Always** run `timeline` before `build`; `check` does both. A stale bundle renders black or misaligned frames.

Open every `out/stills/sheet_*.png` and check:
- Text overlaps: labels against captions, labels against the date tag, props against the host text.
- Wrong setting: the place, era, flag or costume doesn't match the story.
- Physics: things land on the floor (not floating or sinking), squash on impact, and arcs look like parabolas.
- Characters cut off by the frame edge, or a shot that is visually empty.
- Red "MISSING SHOT" frames.

Fix the problems and re-check. For physics, also look at 2 or 3 frames *during* the motion.

## 7. Render and deliver

```
node scripts/studio.mjs all <slug>                    # check → render (parallel) → sfx → mux → out/<slug>.mp4
```
- Rendering runs at about 20 fps on 4 workers, so a 10-minute film takes about 15 minutes. Run long renders in the background and check progress.
- For a pilot or a partial render: `studio render <slug> 0 5400 --out out/pilot.mp4`, then `studio sfx` and `studio mux <slug> --video out/pilot.mp4`. The mux trims audio to the video length.
- **Changing one shot without changing its length**: re-render only its frame range (`build/timeline.json` gives `from`/`dur`) and splice it into the video with ffmpeg concat. **Changing text** shifts every later beat, so re-render from that point to the end.
- **Upload limits**: if the file is too large to send, re-encode it with `ffmpeg -i in.mp4 -c:v libx264 -crf 23 -preset slow -c:a copy out.mp4`. A 40-minute film comes out around 250 MB.
- Deliver the MP4 and a short note listing the fact fixes, anything you changed or left out, and how to request edits.

## 8. With a voiceover

Put `voiceover.mp3` in the project. Run `studio align <slug>`, then continue from step 6. The timing now follows the recording; see `docs/VOICEOVER.md`. Keep beat texts matched to what is actually said.

## Repo map

```
engine/            shared by every film (don't fork it per project; improve it)
  lib/core.tsx       frame context, interpolate, easing, seeded random, on-twos, mouth/blink
  lib/physics.ts     the physics (tested in tests/physics.test.ts)
  characters/        Host (the narrator) and Chibi (everyone else)
  fx/                Camera (zoom/pan/push/shake/parallax), Defs (gradients, patterns), Overlays (captions, date tag, bubbles, labels)
  scenes/            backgrounds, parts, props, plus the India film's scene library
  kit.tsx            hostShot, Drop, PopProp, Rider, Card, makeOpening, makeEnd, wordAt
  runtime/           the page that plays a timeline (built per project)
projects/<slug>/   script.md, project.json, beats/*.json, shots.tsx, src/, voiceover.* → build/, out/
scripts/studio.mjs the CLI; build_timeline.mjs, script_to_beats.py, align_voiceover.py, sfx.py do the work
```
