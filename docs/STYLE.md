# Style bible

The look is a hand-drawn, comic "history in N minutes" explainer. A friendly narrator stands on a plain grey stage and cuts away to colourful storybook scenes, with captions writing on word by word. The tone is jokey where the story allows it and grave where it doesn't.

## The four beat types

| Type | Screen | Narration |
|---|---|---|
| `HOST` | The **narrator** on the flat grey stage (`#C4C4C4`), standing right of centre (x ≈ 1380), with optional props or a spotlight beside him. | Black handwritten text, top-left (x 110, top 300, 800 px wide), written on word by word. His mouth moves while it reveals. |
| `STORY` | A full-colour **scene** in a storybook look: sky gradient, layered hills, parallax, chibi characters doing something. | White handwritten caption with a dark outline in the lower third, over a soft dark gradient. |
| `INSERT` | **Dark green vignette** (`InsertBg`) for maps, charts, tallies, documents, diagrams and "explainer" graphics. | Same lower-third caption. |
| `SKETCH` | A two-character comedy dialogue: speaker **A** on the right, **B** on the left. | Speech bubbles with tails, drawn automatically from the beats. |

Section **title cards** use the grey stage, a small red act number ("Act 3"), a big handwritten title, a red underline that draws itself, and the narrator presenting. The **opening** writes the title onto a dark vignette, and the **end card** has the narrator waving.

The **date tag** (top-left grey box, Outfit font) rolls like an odometer whenever the year changes. Negative years show as "BC". Set `date: null` on a beat to hide the tag.

## Look

- **Line:** dark brown/black outlines (`OL = #2A1B12`, text `#141414`), stroke width 3 to 6, round joins. Flat fills with at most one soft gradient (sky, glow).
- **Palette:** warm and saturated, never neon.
  - Emphasis red `#B3261E`, highlight yellow `#FFD84A`
  - Sky `url(#skyDay)` / `url(#skyDawn)`, grass `#A8C07A`, earth `#C9A66B`
  - Royal colours: crimson `#C0392B`, saffron `#E8862A`, blue `#2E86C1` and purple `#8E44AD`
- **Fonts:** *Nothing You Could Do* (`Hand`) for all narration, titles and labels; *Outfit* (`Tag`, `TagBold`) only for the date tag and UI-ish labels.
- **Emphasis:** wrap a word in `*asterisks*` in the beat text. It turns red on the grey stage or yellow in captions, and gets a small tick sound.
- **Characters:** big heads (chibi). Faces have dot eyes, blinks, and 3 mouth shapes. The narrator never changes design between films; he is the series' identity.
- **Motion:** characters animate on twos. Poses snap with spring overshoot, cloth follows through, and the camera always drifts slightly (zoom 1.00 → 1.03 to 1.06), with occasional push-ins on a key word. See PHYSICS.md.

## Layout rules (these come from mistakes that were fixed)

- **Caption zone:** nothing important below **y ≈ 850** in STORY/INSERT shots, because two lines of caption sit there. Labels, signs and key action stay above it.
- **Date tag zone:** keep the top-left **300 × 120 px** clear of labels.
- **Host shots:** narration occupies the left half. Props go in the gap between the text and the narrator (x 900 to 1200) or above him, never under the text.
- **One idea per shot.** If the narration names three things, show three things appearing on their words (`wordAt(s, 'word')`).
- **Real places:** set scenes where they happened (for example, an Indian parliament scene for Indian politics, not Westminster). Check maps and borders for the period.

## Humour and restraint

- Gags come from **juxtaposition and timing**: a deadpan narrator, absurd scale, a prop dropping in on the punchline. Mark joke beats `gag: true` to get an extra second for the laugh.
- **Tragedies** (massacres, famines, genocides, assassinations, partitions):
  - **No jokes.** Set `quiet: true` so no automatic whooshes or ticks play.
  - **No depicted violence or bodies.** Use symbolic, still imagery instead: empty streets, a ledger, candles going out, personal objects left behind (spectacles, sandals), maps, silhouettes at a distance, a black screen.
  - Slow camera, dimmed stage (`GreyStage dim`), and soft ambience at most.
- Never mock a living group or religion. Make fun of the powerful, the absurd and the self-important, never of victims.

## Facts

These are history films, so **every specific claim gets checked**: dates, numbers, superlatives ("tallest", "richest", "first"), quotes and attributions. When the script is wrong, fix the beat text and note it in the beat as `"fix": "was X; Y per <source>"`. List the fixes in the project's README.md so the author can see them. Where something is contested, say "according to legend" or "attributed to". If the author's voiceover already contains the error, flag it to the author rather than silently changing the captions.
