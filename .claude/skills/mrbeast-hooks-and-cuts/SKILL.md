---
name: "mrbeast-hooks-and-cuts"
description: "MrBeast-style hook and first-minute edit for long documentary-style films with real-life footage: the 30-second hook, a shot change every 1.8 seconds for the first minute, and the cut sheet that goes with the script. Use when writing or editing the opening of any long-form history film, especially ones that use real footage."
---

# MrBeast hooks and first-minute cuts

The hook is the main factor for everything. Viewers decide in the first 30 seconds, so the opening is written and cut as its own piece of work, before the body of the script. This skill adds to `history-script-writing` (Part A). Where the two disagree for a film that opens on real footage, this one wins: the hook runs about 30 seconds and the body begins by about 0:45 to 1:00, instead of the 12 to 20 seconds in the older rule.

## 1. The promise (0:00 to 0:05)
- Title, thumbnail and first spoken sentence make **one promise**. The title must be clickable and true.
- Thumbnail: text only, no characters. A GIS map or split screen is fine.
- Words start at 0:00. No title card, no logo sting, no "welcome back".

## 2. The hook (0:00 to 0:30)
1. **Start on something the viewer already owns, says or uses** that comes from the place or time of the film (a word, an app, a food, a holiday). Make it intriguing, with a twist.
2. **At least three facts in one flowing run**, no labels. Chain them the way people talk. The last one is the strangest or the darkest.
3. **Then the turn**: "Now here's the strange part…". It states the contrast the whole film explains.
4. **Close the hook with the open question** the film answers, said once, then move on.
5. Never say "stay to the end", "keep watching" or "it comes back at the end". Ask the question and keep going.
6. Never promise what the film will not deliver. The first minute may overpromise nothing.
7. Stakes escalate: familiar → surprising → strange → the open question. No sentence repeats the title.

## 3. Real-life footage in the hook
The first 30 seconds are **real-life footage only**: no cartoon, no narrator, no animation. Real means filmed or photographed, not generated.
- One shot per phrase. The picture must show the phrase, not decorate it.
- Modern things (apps, chips, food, streets) come from clean stock footage. Historical things come from archives.
- Sources, in order of preference: Wikimedia Commons, Library of Congress, US National Archives (NARA), national and state archives, Imperial War Museum and similar public collections, then free stock sites (Pexels, Pixabay). Government press office footage and museum collections often need permission: read the terms.
- **Licence rule:** put the source and licence in the cut sheet for every shot. Never use footage whose licence is unclear. If a shot cannot be cleared, give a fallback in the same row.
- **Never use AI-generated or reconstructed footage as if it were real.** If a recreation is used, label it on screen.
- Sensitive subjects (war, massacre, genocide, famine): short, restrained, non-graphic, dignified. Show places, objects and survivors' faces by consent, not bodies. Contested conflicts: when two sides are shown, give them equal screen time and the same visual treatment.
- 0:30 to 1:00 may mix real footage, archive, GIS maps and the narrator overlaid small in the corner. The grey-stage cartoon world starts after the first minute.

## 4. The first minute: a new frame every 1.8 seconds
- 1.8 s is **54 frames at 30 fps** (45 at 25 fps; avoid 24 fps, which gives 43.2). Set the composition to 30 fps.
- 60 s = **32 shots of 1.8 s + one closing shot of 2.4 s** (57.6 + 2.4 = 60.0). Shot 17 ends at 30.6 s, so shots 1 to 17 are the real-footage hook.
- **Every shot is a different picture.** Never reuse a shot in the first minute, never hold one past 1.8 s, and never put two shots of the same type back to back (two phone shots, two maps).
- Cut **on the spoken word**: each cut lands on the first syllable of its phrase, with no gap and no hold after the phrase ends.
- Words per shot: about 3 to 7, averaging about 4.7 (a 150-word first minute at 2.5 words per second). One idea per shot. Cut a phrase in the middle only if the picture changes meaning with the second half.
- Movement inside each shot (slow push-in, pan, handheld) so no frame is dead for 1.8 s. Add a small sound hit on cuts, and keep the voice louder than music and SFX.
- After 1:00, return to the normal pace: a new picture every 3 to 5 seconds.

## 5. Output: the cut sheet
Write the hook and first minute as a table in `script.md`, above the body:

| # | start | words | visual (what is filmed) | type | source / licence | fallback |
|---|-------|-------|-------------------------|------|------------------|----------|

- `type` is one of: `real`, `archive`, `GIS`, `overlay`.
- `start` is a multiple of 1.8 s.
- Then give the same words as clean text for the voiceover, with no shot numbers.
- Check before handing over: every shot 1.8 s except the last (2.4 s); total 60.0 s; shots 1 to 17 all `real` or `archive`; no shot repeated; word count 140 to 165.

## 6. Voiceover and banned phrases
Follow `history-script-writing` for Gemini TTS: angle-bracket tags such as `<short pause>`, only the supported tags, no emotion tags, years and numbers spelled out. Fast, bright style line for the first minute, then the normal style line.
