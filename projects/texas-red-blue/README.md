# Why Texas Can't Stay One Party

18-minute film built from the creator's voiceover (`voiceover.mp3` + `voiceover.srt`, aligned with `studio align`: 284/284 beats, 99% of words matched).

House rules used: GIS (QGIS) map kit for every map, the narrator present in nearly every shot, captions in Times-style serif (`captionFont: serif`), act cards drawn as a treasure map of Texas (`src/TreasureCard.tsx`).

## Deliverables (`out/`)

| File | What it is |
|---|---|
| `texas-red-blue.mp4` | Finished film: picture, captions, voice and sound effects |
| `stems/0-picture-and-effects-no-voice.mp4` | Picture (captions burned in) + sound effects, no voice |
| `stems/1-voice.wav` | Voice only, laid out on the film's timeline (24-bit, 48 kHz) |
| `stems/2-sfx.wav` | Sound effects only, already ducked under the voice |
| `stems/edit-list.csv` | Pauses trimmed from the recording, and where each slice plays |
| `captions.srt` | Captions as a subtitle file (matches the burned-in captions) |

Put the voice and SFX stems on the timeline at 0 dB and you hear the finished mix.

## Fact notes

The captions use the corrected facts. These lines in the recording may be misspoken; check the audio:

| Where (recording) | Said | Should be |
|---|---|---|
| ~3:18 | "200 Texans defender" | around 200 Texan defenders |
| ~4:52 | 20 December 1845 | 29 December 1845 |
| ~5:07 | "It was the Neuse River" | Mexico said it was the Nueces River |
| ~7:16 | "In 1870s" | In 1870 |
| ~8:33 | 18 September 1900 | 8 September 1900 |
| ~9:27 | poll tax in 1901 | 1902 |

2026 results checked against AP / Texas Tribune / KHOU (99% reporting): Senate, Talarico (D) 55.1% vs Paxton (R) 43.0%; Governor, Hinojosa (D) 52.8% vs Abbott (R) 45.7%.

Other figures shown on screen: 1861 secession referendum about 76–24; 1873 Coke vs Davis about 2 to 1; 1961 Tower 50.6 vs Blakley 49.4; 1978 Clements 50.0 vs Hill 49.2; 2018 Cruz 50.9 vs O'Rourke 48.3; 2020 Trump 52.1 vs Biden 46.5; 2024 Trump 56.1 vs Harris 42.5. Real people appear only as labelled silhouettes.
