# Session log: Alabama new hook, thumbnail, and the 50-states scripts (10–11 November 2026)

A record of the session that produced the new Alabama hook video, the Alabama thumbnails, `docs/HOOKS.md`, `docs/STATES.md` and a script for every remaining state, so a new session can pick up without the creator repeating anything.

Session: https://claude.ai/code/session_01FRB8kZUQTvJJyKjX8h27Jy

## What the creator asked for, in their words

1. "use naah repo from github and create script for 'the Entire History of Alabama' it should be around 20-30 minutes long". Made and delivered: film, no-voice version, voice track (branch `alabama-script`).
2. "the hook is not so good ... 'Sweet Home alabama' ... other hooks that people in general can relate should be the hook ... give me the hook script only". Wrote a familiar-thing hook.
3. "actaully i just want the first part of it , other is already there" / "i gave you srt and mp3 of the new one please just do that, nothing more". Rendered only the new hook part (`alabama-new-hook.mp4`). Lesson: when the creator says "nothing more", do not start a full re-render.
4. Thumbnail: "clean and minimalist and use qgis", then "no character in thumbnmail only text", then "colors are crap ngl". Split "then vs now" QGIS layout, text only (`projects/alabama-thumb`). Title and description written.
5. "we will write script for all the 50 states ... push name in github and push script in github". Tracker: `docs/STATES.md` (branch `fifty-states`).
6. "please make hook so good , no one can leave for all the script , push that command to github, here hook is the main factor for everything". Became `docs/HOOKS.md` (seven-beat hook: familiar thing, twist, second twist, unbelievable fact, dark turn, one question, concrete promise image; ≤ ~120 words; re-hook every 2–3 min; ending pays off the question). Linked from `CLAUDE.md` and `docs/PLAYBOOK.md`.
7. "after new york , start other one , do not wait just finish and push to github" and "we shall finish all 50 today". Done: every state has `projects/<slug>/script.md` + `README.md` (title, thumbnail concept, question/promise, hook check, quiet parts, timeline labels, fact-check table), each pushed as its own commit.

## How each state script is built

- Gemini TTS format: style-line table, angle-bracket tags only from the supported list, numbers spelled out, sad passages under "(quiet style)" headings, `##` headings are paste breaks only.
- Hook to `docs/HOOKS.md`. The promise line is a concrete image ("a plague of crickets", "a slow copy machine") that the ending repeats word for word.
- Risky hook claims were checked by web search; everything else against known sources. Each README's fact table lists every claim and every wording change made while checking (e.g. Georgia "first major gold rush" → "one of the first"; Michigan's Toledo War casualty was a Michigan deputy; Arkansas diamonds; Maryland Ouija patent 1891).
- Helper used this session (not in the repo): a script that counted spoken words, filled the README length line, updated the `docs/STATES.md` row, committed and pushed.

## Open items

- **Length:** the new scripts run about 1,050–1,650 spoken words, roughly 7–11 minutes voiced. That is shorter than the 20–30 minutes asked for Alabama. Each can be expanded (more re-hooks, longer eras) when the creator picks a state to record.
- **Alabama:** the full film still has the old hook; the new hook exists as a separate video. A cue at 18:57 says "fourteen thousand" vs the hook's "sixteen thousand"; cue 216 (8:52) still needs listening.
- Time-sensitive lines to recheck before recording: Vermont (no McDonald's in Montpelier), North Dakota/New Mexico oil ranking, Iowa/New Hampshire primary calendar, any "today" population or production figures.
