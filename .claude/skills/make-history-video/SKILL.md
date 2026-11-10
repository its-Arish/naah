---
name: make-history-video
description: Turn a script (and optional voiceover) into an animated history explainer video in this repo's house style — narrator on a grey stage, storybook scenes, physics-based motion, synthesised sound effects. Use whenever someone gives a script, transcript or story outline and asks for a video.
---

# Make a history video

Read `docs/PLAYBOOK.md` first (the creator's standing rules and shortcuts, with `projects/california` as the worked example), then follow `CLAUDE.md` at the repo root step by step. `CLAUDE.md` is the full procedure, and this skill is the checklist. For a voiced film from Gemini TTS, follow PLAYBOOK §4 to §8 instead of steps 3 to 5 below. At the end, update `docs/sessions/` and push.

1. `node scripts/studio.mjs doctor`: fix the environment first (CLAUDE.md §0).
2. Settle the brief: target length, whether to fact-check (default yes), whether a voiceover is coming, and a pilot first for long films (§1).
3. `studio new <slug> "Title"`, then put the script into `projects/<slug>/script.md` with section markers, then `studio draft <slug>` (§2).
4. Fact-check every specific claim. Fix the beat text, add a `fix` note, and list the fixes in the project README (§3).
5. Direct the beats into `beats/NN-*.json` (shots, types, dates, emphasis, gags, quiet tragedies, sound cues), then delete `00-draft.json` (§4).
6. Write `shots.tsx` / `src/*.tsx`, reusing `docs/SCENES.md`, with physics from `docs/PHYSICS.md` and layout from `docs/STYLE.md` (§5).
7. `studio check`, then `studio stills --section N`. Look at every contact sheet, fix, and repeat (§6).
8. Voiceover? Run `studio align <slug>` before checking (§8).
9. `studio all <slug>` (a pilot range first for long films), then deliver `out/<slug>.mp4` with a note of the fact fixes (§7).
