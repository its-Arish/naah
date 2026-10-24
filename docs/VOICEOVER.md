# Using your own voiceover

Without a voiceover the film is narrated by its captions, and timing comes from word counts (3.2 words/s by default; `wordsPerSecond` in `project.json`). With a voiceover, **your voice drives the timing**:

1. Record the narration reading `script.md`, ideally in one take with a natural pause (≥ 0.4 s) between sentences and a longer one between sections. Save it as `projects/<name>/voiceover.mp3` (or `.wav` / `.m4a`).
2. Make the beats as usual: `studio draft`, then edit. The beat texts should match what you say; small differences are fine.
3. Run:
   ```
   node scripts/studio.mjs align <name>       # → build/vo_align.json + lip-sync envelope
   node scripts/studio.mjs check <name>       # timeline now follows the recording
   node scripts/studio.mjs all <name>         # render, sfx, mix voice + sfx
   ```

## What happens

- **Alignment.**
  - If `faster-whisper` (or `openai-whisper`) is installed (`pip install faster-whisper`), every word gets its own timestamp, matched in order against the script.
  - Otherwise the aligner finds the pauses in the recording with `ffmpeg silencedetect` and shares the speech time out across beats in proportion to their word counts, snapping each boundary to the nearest pause. On a clean read this lands within a few hundredths of a second; the test suite checks it against a synthetic recording.
- **Timeline.**
  - Each beat starts when its first word is spoken, and captions appear as the words are said.
  - The opening title plays before the voice starts.
  - Each section title card cuts the recording in the pause before that section and holds it for the card's length (`voSegments` in `timeline.json`), so a card never talks over you.
- **Lip-sync.** The recording's loudness per frame becomes mouth shapes (closed / half / open, held on twos), and that envelope is moved onto the video timeline along with the voice. The narrator's mouth therefore moves with your actual voice, not a fake flap.
- **Mix.** The voice is played at full level and the sound effects at 0.55 underneath. There is no music unless you add it.

## Keeping it small (and committing it to GitHub)

Narration doesn't need music quality. Compress before you commit or upload:
```
ffmpeg -i voiceover.wav -ac 1 -b:a 64k voiceover.mp3      # ≈ 0.5 MB per minute
```
A compressed voiceover can be committed next to `script.md`, so Claude gets the script and the voice together from the repo. WAV, AIFF and FLAC files are ignored by git. GitHub blocks files over 100 MB. Remember that in a public repo your voice is public too, and that every re-recording you push stays in the repo's history.

## Tips

- Re-run `align` whenever you change the beats or the recording.
- If one beat is badly placed, which happens if you ad-libbed a lot, split or merge beats so the text matches what you said, then re-align.
- Sound cues tied to words (`"sfx": [["pop", "w:Mongol"]]`) follow your voice automatically.
