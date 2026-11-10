# Session log: "The Entire History of California" (10 November 2026)

A record of the conversation that produced `projects/california`, so a new session can pick up the work without the creator repeating anything. The creator's instructions are quoted in their own words. The standing rules that came out of it are already in `docs/PLAYBOOK.md` and `.claude/skills/history-script-writing/SKILL.md`; this file says where each rule came from and what went wrong on the way.

Session: https://claude.ai/code/session_01FRB8kZECC6NSaxCugaPgpN

## Who and what

- The creator runs the YouTube channel **History Monkey**. Long-form films are made in this repo (`its-Arish/naah`); 60-second "Mythic Meme" shorts are made in `its-Arish/yeah`.
- Viewers tend to leave after about 30 seconds, so **retention is the main concern** in every script decision below.
- Voice: the creator generates the voiceover with **Gemini TTS** and sends the `.mp3` plus an automatic `.srt`.
- The creator wants the repo, not Claude's memory, to hold the way of working: "push everything … into repo such that i can reuse it again, i do not have to make you remember".

## The conversation, step by step

### 1. Script ideas (before writing)

1. Claude summarised the existing script-writing skill (MrBeast retention rules for long films, ending-first beats for shorts).
2. **The familiar-thing hook.** Creator: "the catchy thing is, something the user are familiar with: like the shoes you are wearing, or the words that came from that place". Open on an object or word the viewer already owns or uses that comes from the film's place.
3. **At least three facts after the hook.** Creator: "more intriguing and more facts like 3 facts at least after the hook".
4. **No labels, one flow.** Claude first showed "Fact 1, Fact 2" labels. Creator: "we are not mentioning 'Fact 1' this will just break the flow … like 'the shampoo you were using …' or even 'the pant you wore'". The facts are chained the way people talk.

### 2. The California script

5. Topic: **"The Entire History of California"**, voiced with Gemini TTS, with emotion cues written in so it can be pasted straight in.
6. Claude wrote about 2,600 words (hook plus nine eras) as a Claude doc, with titles, a fact check and tags. The running question: "So who actually got rich?", paid off with Levi Strauss, the jeans and "the smart ones sell the shovels".
7. **Tag syntax.** Claude used square brackets (`[sighs]`). Creator: "not [] like this [short pause], instead <> like this <short pause>". Changed to angle brackets.
8. **Gemini read the tags aloud.** Creator: "the gemini is repeating <amazed> <serious> <curious>". Claude researched: Gemini 3.8 TTS uses angle brackets but supports **only sound and pause tags**. Emotion words are spoken, an unsupported tag can make later tags be spoken too, emotion belongs in the style box, and `<sigh>` not `<sighs>`. Creator: "lets use the supported tags". The script was converted, with a style line per part and sad passages split out under "quiet style" headings.
9. **No chapters.** Creator: "chapters are actually making retention less lets make a flow such that we will introduce the chapter but only timeline at the top of the screen". The script became one continuous story; the joins were reworded; a timeline bar replaced chapter cards.
10. **No "stay to the end".** Creator: "i told you in the other script stop saying 'stay until the end' audience will know its a hook trap". It had to be said twice, so it is now the third rule in the playbook. The line "they come back at the very end" was also removed.
11. Claude proposed an update to the account skill `history-script-writing` with all of the above. The repo copy is `.claude/skills/history-script-writing/SKILL.md`.

### 3. The voiceover arrives

12. The creator sent a 14:05 `.mp3` and its `.srt`. Claude found:
    - The Leland Stanford lines were spoken twice (7:21 to 7:32).
    - Gemini read a heading aloud: "Chapter six. Sunshine for sale." That is why the script now says to paste only the lines under a heading.
    - Misheard words in the `.srt`: chewmash (Chumash), Branon / Brandon (Brannan), O'Halland (Mulholland), Owens laid (Owens Lake), "Russia number one" (Rush), "The genocide" (A genocide), plains (planes), low (lo).
13. Creator: "you are correct about the srt, please correct it". Claude cut 441.0 to 456.3 s from the audio and fixed 44 caption lines (`tools/fix_srt.py`). The trimmed voiceover runs 13:50.
14. Creator: "what about maps? are you not showing those?" Claude had listed maps inside the scene table without making them visible. A separate list of **13 map scenes** followed. Lesson: when planning a film, list the map scenes on their own.

### 4. Building the film

15. Creator: "correct lets start the video". Claude built the hook, First Californians and Spain (0:00 to 2:52) and sent a pilot.
16. Creator: "render the full video now". Claude drew Mexico through Today (seven files in `src/`), checked a still of every caption, fixed overlaps, rendered only the remaining 11 minutes, and joined them to the pilot without re-rendering it.
17. Delivered: the full film with voice, captions and sound effects; the video with no voice; the voiceover as its own track.

### 5. Into the repo

18. Creator: "push everything, every thing to create video including script, into repo … you can even export our convo in repo so that it becomes easy for any claude to understand". This file, `docs/PLAYBOOK.md`, `projects/california/README.md` and the skill copy are the result.

## Mistakes to avoid next time

| What happened | What to do instead |
| --- | --- |
| Square-bracket tags, then emotion tags Gemini read aloud | Angle brackets, only supported sound tags, emotion in the style box. Check Google's current tag list first. |
| "Fact 1 / Fact 2" labels in a hook draft | One flowing run: "The jeans you're wearing. The phone in your hand. The…" |
| "Stay to the end" (twice, across two scripts) | Never. Ask the open question and move on. |
| Chapter headings that Gemini spoke aloud | Headings are paste breaks only; tell the creator to paste the lines under them. |
| Maps hidden inside a scene table | Give a separate list of map scenes with times and styles. |
| Calendar default colour crashed the page (blank frames) | Fixed in `engine/fx/Infographics.tsx`. Read the stills log for `pageerror`. |
| Claude cannot hear audio | Always list timestamps where a mispronunciation is possible, and say the mix is unchecked. |

## Where to start next time

1. Read `docs/PLAYBOOK.md` (the creative rules and shortcuts), then `CLAUDE.md` (the technical procedure).
2. For a new voiced film, copy from `projects/california`: `tools/make_beats.py`, `tools/fix_srt.py`, `src/Timeline.tsx`, `src/Kit.tsx`, `src/Kit2.tsx`.
3. Still open for California: music, the bigger narrator moves, and a listen for mispronunciations (see `projects/california/README.md`).
