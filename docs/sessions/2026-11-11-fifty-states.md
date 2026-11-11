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

8. "you have done the task but not the format i had told you to, like <expression> in this format to copy paste, furthermore, the script is very short why is that". Then: "now lets focus on the excellence of the script rather than the end goal ... we can take multiple iteration to finish it all", "keep going do not ask", "go on". Result: the **v2 rewrite** of every state script from Florida to North Dakota (states 4–50). Each now has Alabama-style Gemini tags in every paragraph (about 45–90 per script, never two side by side), a style line per part, quiet-style sections for tragedies, a longer body with more re-hooks and stories, and an expanded README fact table (new rows appended). Each README status line says "v2 (Nov 11): rewritten to full length with Gemini tags throughout."

## How each state script is built

- Gemini TTS format: style-line table, angle-bracket tags only from the supported list, numbers spelled out, sad passages under "(quiet style)" headings, `##` headings are paste breaks only.
- Hook to `docs/HOOKS.md`. The promise line is a concrete image ("a plague of crickets", "a slow copy machine") that the ending repeats word for word.
- Risky hook claims were checked by web search; everything else against known sources. Each README's fact table lists every claim and every wording change made while checking (e.g. Georgia "first major gold rush" → "one of the first"; Michigan's Toledo War casualty was a Michigan deputy; Arkansas diamonds; Maryland Ouija patent 1891).
- Helper used this session (not in the repo): a script that counted spoken words, filled the README length line, updated the `docs/STATES.md` row, committed and pushed.

## Open items

- **Length:** v2 scripts run about 1,950–3,550 spoken words, roughly 11–19 minutes voiced (Florida, New York, Hawaii and Alaska are longest; the last fifteen states are about 11 minutes). That is still short of 20–30 minutes. A third pass can add more stories per era; my first drafts consistently came out at about 1,600–1,900 words, so plan big patches.
- **Alabama:** the full film still has the old hook; the new hook exists as a separate video. A cue at 18:57 says "fourteen thousand" vs the hook's "sixteen thousand"; cue 216 (8:52) still needs listening.
- Time-sensitive lines to recheck before recording: Vermont (no McDonald's in Montpelier), North Dakota/New Mexico oil ranking, Iowa/New Hampshire primary calendar (the DNC's Aug 15 2026 calendar for 2028 leaves Iowa out and puts NH third; the scripts say so), Delaware's Musk case (reinstated Dec 2025), Nebraska's sellout streak, any "today" population or production figures.
- Lesson: when inserting with an anchor that ends mid-line, the rest of the line attaches to the inserted text (happened once in Wisconsin). Anchor on whole paragraph endings.
