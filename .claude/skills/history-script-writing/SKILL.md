---
name: "history-script-writing"
description: "Write or punch up narration scripts for History Monkey videos: long-form history films (naah studio) and 60-second Mythic Meme shorts (yeah). Use for hooks, retention inserts, titles."
---

# History script writing

Scripts are written to be **recorded as a voiceover** and then animated. Every line must be speakable in one breath, and every beat must suggest a picture. The recorded voiceover is always the ground truth for timing; captions follow what was actually said.

First decide the format:
- **Long-form film** (10–40 min, 16:9, narrator on a grey stage + storybook scenes) → Part A. Repo: `its-Arish/naah`.
- **Short** (about 60–90 s, 9:16, Mythic Meme style) → Part B. Repo: `its-Arish/yeah`.

---

## Part A: Long-form history film

Based on the MrBeast retention framework (target: about 70% average retention).

### 1. First 5 seconds: title, thumbnail and first line are one promise
- Title must be clickable **and true**. Never claim something that hasn't happened ("Russia attacks NATO") and never put invented quotes in a real person's mouth. Overselling kills retention when viewers feel tricked.
- Offer 3–4 title options and mark a pick. Good shapes: "Why X Is Doing Y Over This Tiny Z", "X Warned Y. The Reason Is 800 Years Old.", "Why the Biggest Country on Earth Is So Afraid".
- The **first spoken sentence restates the title**, and the **first shot matches the thumbnail** (same map, colours, narrator pose).
- Thumbnail suggestion in house style: the narrator pointing at a glowing map region with a short curious label ("WHY THIS?"). No real politicians needed.

### 2. The hook: under 20 seconds
- Never open on a silent title card. Words start at 0:00.
- **Open on something the viewer already owns, says or does** that comes from the place or time of the film: the jeans they are wearing, the shampoo they used, a word they said today. Make it intriguing, with a twist ("named after an island that never existed").
- **Follow the hook with at least three facts in one flowing run.** Never label them ("Fact 1", "Fact 2"): labels break the flow. Chain them the way people talk: "The jeans you're wearing. The phone in your hand. The..." The last fact is the strangest or darkest and leads into the question the film answers.
- Within 20 s deliver: **context** (what's going on), **stakes** (what's at risk), and a **curiosity gap**: an open question paid off near the end ("So who actually got rich?"). **Never say "stay to the end", "watch until the end", "keep watching" or "it comes back at the end":** viewers recognise it as a hook trap. Ask the question and move straight on.
- **Meet, then exceed** the title's promise: after confirming it, add something extra the viewer didn't expect.
- **Input bias:** show effort. Without a big budget, say how much research went in ("I went through 800 years of census records") or open on a visually rich shot.
- **Start the body by 12–20 s.** The hook is where the biggest drop-off happens, so jump into the first real story point fast. If the hook runs over 20 s, cut it.
- If a current news story connects, open with it (dated, factual, both sides stated: "NATO says no blockade is planned"), then pivot: "Because [country] has been afraid of the same thing for eight hundred years." Search the news before writing and warn the user the story may move before publishing.
- Cut any later line that repeats what the new hook already says, and give its timestamp.

### 3. The body: keep the retention curve flat
- **No chapter cards and no spoken chapter names.** Chapters lower retention. The narration runs as one continuous story, and each new era is shown only on a thin timeline across the top of the screen: the marker slides and the label changes while the narrator keeps talking. Write every join so it continues the previous thought. Any headings in the script are paste breaks only, never spoken or shown. Give a table of timeline labels and years with the script.
- **Visual variety:** write so a new picture is possible every 3–5 s. Avoid paragraphs that would hold one map for long.
- **Consistent contrast:** give the film a side story or second thread to cut away to (e.g. one family across the centuries, or the narrator's running gag), so the main storyline never drags.
- **Running thread:** invent one motif that recurs and pays off (e.g. "the bill": a receipt that prints a new line each time the country spends its people, paid off in the final chapter).
- **Energy cycles:** high-energy new thing → calmer exploration → next new thing. Cycles of about 2–4 min, **shorter at the front, longer at the back**. Lighter content early; save slow emotional material for the last 20%.
- **Retention inserts** between chapters: a bridge question ("How does *that* end up owning a tenth of the planet? Short answer… a man nicknamed 'the Moneybag.'"), a "spot the mistake" setup paid off later ("Napoleon invaded in June. Hitler invaded in June."), a quick score check, or a "this is where history stops being history" turn.
- **Callback to the opening promise** just before the payoff: "Remember the numbers I promised you at the very start? Here they are."

### 4. The ending
- Deliver the **big payoff** (the curiosity gap from the hook).
- Then end on a **high note**: dramatic, warm or funny. No long fade-out or recap that invites people to leave early.

### 5. Tragedy rule
Massacres, famines, terror, war deaths: short, still, quiet lines ("Bill number three: twenty-seven million."). No gags, no narrator tricks next to them. Visuals stay symbolic and restrained.

### 6. Animation notes with every insert
After each insert, add one italic line describing the animation, using the narrator's existing moves: flying on his staff, pole-vaulting, staff twirl, staff held level as a gate, pointing, map overlay tags, receipt props, scoreboards, calendars flipping. Draw them on **our own narrator only**, never on copyrighted characters (no Harry Potter, no Monkey King).

### 7. Fact-check everything
- Check every number, date and claim before handing over the script. Show quick checks inline (e.g. "Kaliningrad is about 15,100 km², Russia 17.1 million km², so 'less than one-thousandth' is accurate").
- If the user's existing recording contradicts the facts, list it as a table: time | you say | it should be.
- Give both sides on contested current events; avoid partisan framing.

### 8. Final "boring bits" pass
Before handing over, reread the whole script as a bored viewer about to reach for their phone. Mark any line or stretch that drags, and either rework it (new picture, question, contrast cut) or cut it. List what you cut or changed. After the video is rendered, offer to do the same pass on the finished cut.

### 9. Output format for inserts
```
**INSERT N: <where it goes, quoting the line before it>**
> spoken line
> spoken line

*Animation: ...*
```
Then: total added narration time, which inserts are quiet, and recording instructions: one file per insert (`insert-00.mp3`, `insert-01.mp3`…) or one file with 2–3 s pauses, same mic and room as the original, small wording changes are fine. End with the one question that's still open (e.g. replace or precede the current opening).

---

## Part B: Mythic Meme short (60 s)

Mix: golden mythic look and emotional twist, cut at meme-explainer pace.

### Beat rules
- About 150 words of narration, 18–22 beats, one beat every 2–3.5 s.
- **Beat 1 tells the ending first** ("A teacher asked a boy for his thumb."). **Beat 2 is the shock reply in ≤5 words** ("And the boy said YES.").
- Setup and context: fast, dry, slightly sarcastic.
- Emotional climax (last ~15 s): slow, calm storyteller voice. No jokes inside the climax.
- 3–5 meme inserts in the first 40 s, chosen from: chat-app conversation ("#ashram-admissions", "X has left the chat"), game UI (LEVEL UP, skill bar, XP, counter), wooden sign gag, impact word on a radial burst ("PROBLEM."), achievement badge, autocorrect/search-bar gag, rating/review card.
- Dialogue in quotes, max 6 words per line.
- End on a single image plus one line that reframes the story ("But the forest remembers who was better.").
- Optional 3 s gag end card (review card or checklist) after the emotional line.
- Fact-check the myth against the standard telling and note variants.

### Output
A table: `# | time | visual | caption | sfx`. Captions in CAPS; names marked gold (`*NAME*`), danger words marked red (`!WORD!`), ` / ` for a new caption line. When building in the `yeah` repo, write it straight into `episodes/<name>/episode.txt` using FORMAT.md (`scene | secs | in | mood | captions | fx` plus `> key: value` data lines), preferring the generic `stage`, `chat`, `sign`, `levelup`, `problem` and `review` scenes.

---

## Scripts voiced with Gemini TTS

When the user will generate the voiceover with Gemini TTS, write the script ready to paste:

- **Tags go in angle brackets**, like `<short pause>`, never square brackets.
- **Use only supported sound tags:** `<sigh>`, `<gasp>`, `<laugh>`, `<chuckle>`, `<giggle>`, `<breath>`, `<exhales>`, `<phew>`, `<tsk>`, `<groan>`, `<cough>`, `<throat-clearing>`, `<whispers>`, `<short pause>`, `<long pause>`. Spell them exactly (`<sigh>`, not `<sighs>`). Any other tag is read aloud and can make the tags after it be read aloud too. Check Google's current tag list before writing, because the models change.
- **No emotion tags** (`<amazed>`, `<serious>`, `<curious>`): Gemini speaks them. Emotion goes in the style box. Give one style line per part in a table.
- **Split sad passages under their own heading marked "quiet style"** so they can be generated separately with a quiet, slow style line.
- Put tags between sentences, never two tags side by side.
- Use CAPITALS to stress a word and three dots for a hesitation. Spell out years and numbers ("eighteen forty-eight").
- One part per generation, each under about 5,000 characters. Tell the user to paste only the lines under a heading, never the heading.

---

## Always
- Offer the next step: the next episode idea, or "record and send it, and I'll animate it".
- Keep the narrator character unchanged across all videos.
- Voiceover louder than music and SFX; note SFX style if relevant (tech swooshes and clicks for animated map pop-ups).