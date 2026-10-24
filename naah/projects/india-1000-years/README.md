# 1000 Years of Indian History (40:33)

This is the reference production made with the studio. It has 529 beats in 15 sections, the shot components in `src/`, and scenes from `engine/scenes/India*.tsx`. The narration is on-screen text only: there is no voiceover and no music, and all sound effects are synthesised.

- `script.txt`: the original script, as supplied.
- `beats/*.json`: the script split into timed beats. Each beat carries its shot, date, sound cues and any fact-check notes (`fix`).
- `shots.tsx`: maps every shot id to a component in `src/Shots*.tsx`.

## Rebuilding
```
node scripts/studio.mjs check  india-1000-years            # timeline + bundle + verify
node scripts/studio.mjs stills india-1000-years --section 3  # contact sheets for one act
node scripts/studio.mjs all    india-1000-years            # full render (about 1 h on 4 cores)
```

## Fact corrections made to the script
| Where | Original | Changed to | Reason |
|---|---|---|---|
| Cold Open | "200 years later … ~3 percent" | "About 250 years later … four percent" | Maddison: 24.4% in 1700, 4.2% in 1950. Now matches the script's own Act 10. |
| Act 1 | Ghori "captured alive" at Tarain | "badly wounded and only just escaped"; the capture is introduced as legend | Contemporary sources (Minhaj) |
| Act 2 | Qutb Minar "tallest brick minaret on Earth" | "tallest stone tower in India" | It's sandstone (Britannica) |
| Act 5 | Hampi ruins "about 25 km²" | "about 41 km²" | UNESCO / Wikipedia: 41.5 km² |
| Act 7 | Marathas "led by Shivaji" during Aurangzeb's Deccan war | "the movement founded by Shivaji" | Shivaji died in 1680; the 1681–1707 war was fought by his successors |
| Act 10 | Zafar "wrote a line" (the two-yards couplet) | "a famous line attributed to him" | The authorship is disputed |
| Act 13 | Hyderabad "the size of France" | "bigger than England and Scotland put together" | About 214,000 km², against France's ~550,000 km² |
| Act 13 | "around 85 percent unable to read" (1951) | "more than 80 percent couldn't read" | The 1951 census put literacy at ~18% |

## Sensitive scenes
These follow the script's own instructions: no violence is shown, there are no jokes, and the automatic sound effects are switched off.
- Delhi 1739: an empty street with overturned stalls and smoke.
- Bengal 1770 and 1943: empty villages, a revenue ledger, grain carts leaving the province.
- Jallianwala Bagh: an overhead plan of the walled garden, then a black screen for the firing.
- Mangal Pandey.
- Zafar's sons: three candles going out.
- Partition: silhouetted columns of people and the map; the death trains are shown only as a dim, stationary train.
- Gandhi's assassination: his spectacles, sandals and staff.
- The midnight flag-raising is intercut with one frame of the refugee column.
