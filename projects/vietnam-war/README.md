# The Vietnam War: How America Won the Battles but Lost the War

31:25, timed to the creator's voiceover (`voiceover.mp3` + `voiceover.srt`). An opening hook plus ten chapters; 489 beats; shots in `src/Shots01.tsx` … `src/Shots05.tsx`, cast in `src/Cast.tsx`. The Indochina map, aircraft, ships, tank, palace, embassy and backgrounds live in `engine/scenes/Vietnam.tsx` for reuse.

Build: `node scripts/studio.mjs all vietnam-war`, then `node scripts/studio.mjs stems vietnam-war` (stems in `out/stems/`).

## Voiceover notes

- **Captions show what was said in the recording**, not the script. `vo_captions.json` holds 275 lines that differ from the script: 94 are kept exactly as spoken (rewordings, dropped words, small slips), and 181 correct auto-caption mishearings (e.g. "Forch in me" -> Ho Chi Minh, "Dinh Bin Foo" -> Dien Bien Phu, "superiors five hours" -> superior firepower, "Operation Boeing Thunder" -> Rolling Thunder). The file is rebuilt by `python3 vn_caps.py` from `vn_diff.txt` (script vs. heard, per beat).
- Where the spoken words are factually wrong, the caption stays as spoken and a **Note:** box in the top-right corner gives the correction (see the first table below).
- `s05b01` "August 2, 1964." is in the script but not in the recording, so it is dropped; the date is shown on screen instead.
- `s11b47`: the recording says "the fall of Saigon was **not** only the end of the story on the battlefield" (the script says "was only the end"). The caption follows the recording; it changes the emphasis, not a fact, so there is no note.

### Corrections to the spoken words (corner notes)

| Where | Spoken | Note on screen |
|---|---|---|
| Ch. 4, Gulf of Tonkin resolution | "military operations in South Asia" | the resolution covered Southeast Asia |
| Ch. 4, House vote | "416 to 1" | the House vote was 416–0 |
| Ch. 4, Senate vote | "88 to 1" | the Senate vote was 88–2 |
| Ch. 6, Tet | "Then came January 31, 1968" | the attacks began on the night of 30–31 January 1968 |

## Fact-check

The script was checked claim by claim. Other corner notes add precision:

| Where | Narration | On screen | Reason / source |
|---|---|---|---|
| Ch. 1, French Indochina 1887 | federation "included Vietnam, Laos, and Cambodia" | Note: Laos became a protectorate in 1893 and joined the federation in 1899 | Standard chronology of the Indochinese Union |
| Ch. 3, Eisenhower's 80% | "later wrote…" | Note: *Mandate for Change* (1963), about a vote at the time of the fighting | Eisenhower's memoir |
| Ch. 3, the coup | US "quietly supported" | Note: Washington did not order Diem's killing | Pentagon Papers / standard histories |
| Ch. 4, Gulf of Tonkin | NSA study | Note: Robert Hanyok's NSA study, declassified 2005 | NSA |
| Ch. 5, tonnage | "more than… all sides in WWII" | WWII bar "~2–3 million t", note that estimates vary | Commonly cited estimates |
| Ch. 6, Cronkite quote | "a famous account claims" | Note: wording disputed, may never have been said | As the script itself says |
| Ch. 7, Thompson | — | Note: Soldier's Medal awarded 1998 | US Army |
| Ch. 8, Khmer Rouge | "multiple causes" | Note: bombing was one factor historians cite | As the script says |
| Ch. 10, the palace gate | "a tank crashed through the gates" | Tank 390 (tank 843 first hit a side gate) | Standard accounts of 30 April 1975 |

Figures shown on screen: US troops 184k / 385k / ~486k / 543k (1965–69) and 475k / 335k / 157k / 24k (1969–72); House 416–0, Senate 88–2; ~11,000 French prisoners at Dien Bien Phu; 591 POWs returned; ~7,000 evacuated by helicopter in ~19 hours; Cpl. Charles McMahon (21) and L/Cpl. Darwin Judge (19).

## Restraint

No violence is shown. Diem's death is an empty chair; Hue is smoke and a note; Agent Orange is shown as dying trees and words; **My Lai** is an empty village, a dark screen with the estimate, and Hugh Thompson landing his helicopter between soldiers and villagers. The fall of Saigon focuses on the evacuation and the gate.
