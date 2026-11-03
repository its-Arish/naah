# Background music

Music is planned per film in `projects/<slug>/music.json`, turned into exact timestamps from the rendered
timeline, and built into one MP3 that sits under the video.

```
node scripts/studio.mjs all <slug>                       # render first, so timings match the voiceover
python3 scripts/music_cues.py <slug>                     # music.json + build/timeline.json -> projects/<slug>/cues.txt
python3 scripts/make_music_bed.py projects/<slug>/cues.txt   # downloads, loops/trims, fades, mixes -> music_bed.mp3
```

`make_music_bed.py` also runs on its own (no repo needed): `python3 make_music_bed.py` asks for each cue
(link or file, start and end in the video, start inside the song, volume). It needs Python 3 and ffmpeg;
downloads use `curl` (works around Python SSL problems on macOS), are kept in `music_downloads/`, and each
song is fetched once.

## music.json

See the docstring in `scripts/music_cues.py`. Cue points can be a beat id (`s01b03`), its end
(`s01b03.end`), the moment a word is said (`s01b03@bomb`, `@word#2`), a shift (`+1.5`), or a plain time (`2:40`).
**Gaps between cues are silences**: plan them on purpose (the hook's punchline, casualty lines, the big twist).

## Rules

- **Every track is `"heard": false` until the creator has listened to it.** Never choose by title or
  description alone: "Hidden Agenda" sounded right on paper and is a playful spy tune. Unheard tracks are
  flagged in `cues.txt` and the console; tell the creator which ones to preview.
- Free sources: YouTube Studio → Audio Library (filter "Attribution not required"), or Kevin MacLeod at
  incompetech.com (CC BY 4.0: credit in the description; `music_cues.py` prints the credit lines).
  Don't rip audio from YouTube pages.
- Tragedy beats (`quiet: true`) get silence or a low drone, never a melody with a hook.
- Levels: music about 20 dB under the voice, ducking another ~6 dB while the narrator speaks.
- A mistaken Content ID claim on a CC track: dispute it, quoting the license.
