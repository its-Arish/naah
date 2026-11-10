# Playbook: from a topic to a finished film

Read this first. It is the creator's standing way of working, written down so that nobody has to be told twice. `CLAUDE.md` is the technical procedure; this file is the creative brief and the shortcuts. The worked example for everything here is `projects/california` ("The Entire History of California", 13:51, Nov 2026).

## 1. The workflow in one line

Topic → script (rules below) → the creator voices it with Gemini TTS → they send the `.mp3` and `.srt` → fix the captions and cut mistakes → one beat per caption → draw the shots → stills → pilot → full render → deliver.

Ask only what you cannot infer. Say what you will make before a long build, and show a pilot of the first 2 to 3 minutes before drawing the rest.

## 2. Script rules (always)

1. **Open on something the viewer already owns, says or does** that comes from the place or time of the film: the jeans they are wearing, the shampoo they used, a word they said today. Make it intriguing, with a twist ("named after an island that never existed").
2. **Follow the hook with at least three facts in one flowing run.** Never label them ("Fact 1"): chain them the way people talk, "The jeans you're wearing. The phone in your hand. The...". The last fact is the strangest or darkest and leads into the question the film answers.
3. **Never say "stay to the end", "watch until the end", "keep watching" or "it comes back at the end".** Viewers recognise a hook trap. Ask the open question ("So who actually got rich?") and move straight on.
4. **No chapter cards and no spoken chapter names.** Chapters lower retention. The narration is one continuous story; each join continues the previous thought. A new era is shown only on the timeline bar across the top of the screen (section 6).
5. **One running thread** that returns and pays off at the end. In California it is the "WHO GOT RICH?" board and the rule "the people who sell the shovels".
6. **Tragedies are quiet:** short, still lines, no jokes beside them. In the script they sit under their own heading marked "quiet style".
7. **Fact-check every date, number and "first".** Word soft claims carefully ("the story goes", "about", "one of the five biggest"). Keep a fact table in the project README (example: `projects/california/README.md`).
8. The first spoken sentence restates the title. The hook is under 20 seconds.

The longer version of these rules is the skill `.claude/skills/history-script-writing/SKILL.md`.

## 3. Writing for Gemini TTS

The creator pastes the script into Gemini TTS, so write it ready to paste (see `projects/california/script.md`).

- **Tags go in angle brackets**, like `<short pause>`. Square brackets are the older Gemini 3.1 syntax.
- **Only supported sound tags.** Anything else is read aloud, and one bad tag can make the tags after it be read aloud too. The list used so far: `<sigh>` `<gasp>` `<laugh>` `<chuckle>` `<giggle>` `<breath>` `<exhales>` `<phew>` `<tsk>` `<groan>` `<cough>` `<throat-clearing>` `<whispers>` `<short pause>` `<long pause>`. Spell them exactly: `<sigh>`, not `<sighs>`. Models change, so check Google's current list before writing.
- **No emotion tags** (`<amazed>`, `<serious>`, `<curious>`): Gemini speaks them. Emotion goes in the style box. Give one style line per part in a table, plus one quiet line.
- Put tags between sentences, never two side by side.
- CAPITALS stress a word. Three dots add a hesitation. Spell out years and numbers ("eighteen forty-eight").
- **One heading = one generation**, each under about 5,000 characters. Tell the creator to paste only the lines under a heading. Gemini will read a pasted heading aloud (it said "Chapter six. Sunshine for sale." in the first California take).
- A valid tag is occasionally spoken anyway. Retake, or swap `<short pause>` for a full stop.

## 4. When the voiceover and .srt arrive

The `.srt` is an automatic transcript of the generated audio, so check it before building on it.

1. **Read the whole `.srt`.** Look for lines spoken twice, headings read aloud, and misheard names.
2. **Cut mistakes from the audio in silence.** Find the gaps with `ffmpeg -af silencedetect=noise=-35dB:d=0.25`, cut between two gaps, and shift every later caption by the same amount. `projects/california/tools/fix_srt.py` does the caption side (drop cues, fix text, shift times); the matching audio cut is one `atrim` + `concat` filter, shown in that project's README.
3. **Fix caption spelling** (names, numbers, punctuation). You cannot hear the audio: if a word may really be mispronounced, list the timestamps and ask the creator to listen.
4. Put the trimmed audio in the project as `voiceover.mp3` and the corrected captions as `voiceover.srt`, then `node scripts/studio.mjs align <slug>`.

## 5. Beats: one per caption

For a voiced film, do not re-split the script. Generate `beats/*.json` straight from the `.srt` so every caption is one beat, timed to the voice. `projects/california/tools/make_beats.py` holds the whole direction in three tables:

- `ERAS`: section name → first and last caption number. Every section is `"card": false`. The section title is the label on the timeline bar.
- `SHOTS`: caption range → shot id, type (`HOST` / `STORY` / `INSERT`) and options (`amb`, `quiet`). Consecutive captions that share a shot id form one scene.
- `EM` and `SFX`: emphasis words and sound cues per caption (`'w:word'` hits on the spoken word).

Copy the file into a new project, replace the tables, run it, then `studio check`.

## 6. The timeline bar (instead of chapter cards)

`projects/california/src/Timeline.tsx` exports `Overlay`, which replaces the standard overlay: captions as usual, no date tag, and a thin bar across the top with one node per era. The marker slides while the narrator keeps talking; the label changes with one soft tick. It is hidden during the hook and appears on the hook's last line.

To reuse: copy the file into the new project's `src/`, edit `ERAS` (names must equal the beat section titles), set `"dateTag": false` in `project.json`, and add `export { Overlay } from './src/Timeline';` to `shots.tsx`. Keep scene content below y ≈ 150.

## 7. Drawing the shots quickly

`projects/california/src/Kit.tsx` and `Kit2.tsx` are small helper sets written for long films. Copy them into a new project.

- `useBeat(s)` gives `f` (frame in this caption), `g` / `gd` (frame and length of the whole scene), `k` (which caption of the scene), and `at(k, 'word')`, `pop(k, 'word')`, `on(k, 'word')` for "when this word is spoken in caption k". `loc()` converts a scene frame for engine parts that read the local frame (`MapPin`, `FlowLines`, `ProvinceTrace`, `Calendar`).
- `Stage` + `HostS` for narrator scenes; `Sign`, `DarkSign`, `Panel`, `Pop`, `Txt` for cards and counters; `Board` for a running tally; `Quiet` for the still, dark frames of quiet passages (no narrator).
- Maps: `OldWorld` (coastlines only, for scenes before modern borders; pass dark `land` / `sea` for the documentary look), `Rider` / `FlyIn` for the narrator on his staff, `Tag` (a `MapTag` with enough room for wide capitals).
- Layout: HOST narration owns the left of the frame up to x ≈ 910. Keep props between x ≈ 930 and 1450 and the narrator at x ≈ 1600 to 1760. Keep labels above y ≈ 850 (captions).

**Never draw a map by hand. Always use GIS.** Every map, coastline, border, state or country outline (thumbnails included) comes from the GIS data: the QGIS kit (`assets/qgis/world_map.gpkg` exported with `scripts/qgis_export.py`, drawn with `engine/qgis/QgisMap.tsx`) or a Mapimator map built on it. If a scene seems to need a map the GIS data cannot give (for example an old chart with false geography), ask the creator before drawing anything.

Standing rules for every film: narrator on screen in most shots and never redesigned; use the QGIS map kit and a different map style per era, never the heatmap; captions in Times Roman (`"captionFont": "serif"`); voice louder than effects; one narrator move every minute or two and none beside a tragedy.

## 8. Check, pilot, render, deliver

1. `studio check <slug>`, then `studio stills <slug> --section N` for every section. Open every contact sheet. Look for text under props, labels behind the timeline pill, clipped tags and anything in the caption zone.
2. **Pilot:** `studio render <slug> 0 <frame> --out out/pilot.mp4`, then `studio sfx` and `studio mux <slug> --video out/pilot.mp4`. Send it and wait for a yes.
3. **Full render without redoing the pilot:** if nothing before the pilot's last frame changed, render only the rest (`studio render <slug> <frame> <total> --out out/rest.mp4`) and join with ffmpeg's concat demuxer and `-c copy`. Rendering runs at about 16 fps, so 14 minutes takes about 25 minutes. Run it in the background and wait for it before replying.
4. `studio sfx`, `studio mux <slug> --video out/video.mp4`, `studio stems <slug>`.
5. **Deliver three files:** the full film (voice + captions + effects), the video with captions and effects but no voice, and the voiceover as its own track of the same length. Music, if any, is a separate track and every track stays "not yet heard" until the creator has previewed it.
6. Say plainly what was not done or not checked (you cannot hear the mix).
7. Commit the project (not `build/` or `out/`) and push, so the next session starts from the repo and not from memory.

## 9. Thumbnails

- **As simple as possible:** the GIS map with the film's place highlighted, plus the title text. No icons, badges, sparkles or extra props.
- **No narrator** on thumbnails.
- The map comes from GIS like every other map (never drawn by hand). Example: `projects/california-thumb/shots.tsx` (render with `studio stills california-thumb 45`, then scale to 1280×720 with ffmpeg).
- Three or four words beat six. Add one question or surprise from the film's hook when it fits ("AN ISLAND?"), and offer two versions to compare with YouTube's Test & Compare.
- To make a place look like an island without drawing, widen its own GIS border into water (`island` shot in `projects/california-thumb/shots.tsx`).
- If the creator's request mixes up films or wording (a different state's map, a number with no unit), ask before making it.

## 10. Known traps

- `Calendar` in `engine/fx/Infographics.tsx` used an undefined default colour (`NORTH`) and crashed the page; fixed in Nov 2026 (default is now navy). If a render shows a blank frame, read the stills log for `pageerror`.
- `MapTag` underestimates the width of wide capitals; use `Tag` from `Kit2.tsx`.
- A beat's `wordAt` falls back to frame 20 when the word is not in the caption: copy the word exactly as it appears in the `.srt`.
- `studio stills` and renders read `build/`: always `studio check` after editing.
