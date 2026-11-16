#!/usr/bin/env python3
"""Corrects transcription errors in the auto-generated .srt (timings are untouched).
    python3 tools/fix_srt.py raw.srt voiceover.srt
Only spelling, names and punctuation change; the voice drives the timing."""
import re, sys
FIX = {
 1: "You say the word Amen. You shout Hallelujah.",
 2: "Both Hebrew. You plan your week in seven days",
 6: "Your map app, Waze, was built by Israelis.",
 7: "Your laptop's processor may have been designed in Haifa.",
 10: "had no country at all, scattered across every continent,",
 20: "Each side's story, told fairly.",
 29: "Jacob's twelve sons become the twelve tribes.",
 38: "the Egyptian pharaoh Merneptah carved a victory stone",
 53: "Some see an empire.",
 67: "Judah survives, barely. Then comes Babylon.",
 94: "who in 167 BCE bans Jewish practice",
 96: "a family called the Maccabees rebels, and wins.",
 97: "They rededicate the temple. That is Hanukkah,",
 123: "In 132, a leader named Simon bar Kokhba revolts again.",
 126: "and renames the province Syria Palaestina.",
 127: "The name that Palestine comes from.",
 143: "Now the land that Jews are barred from",
 160: "Maimonides, born in Córdoba in 1138,",
 176: "and Spain, 1492, the same year Columbus sails.",
 183: "that gives the world a word.",
 186: "The island is called the Ghetto.",
 200: "pogroms sweep the country.",
 201: "Mobs burning, killing, year after year.",
 204: "Their ancient homeland, then a quiet corner",
 231: "some funded by the banker Baron Edmond de Rothschild.",
 232: "In 1909, a group founds the first kibbutz, Degania,",
 258: "Tel Aviv grows from a sand-dune suburb into a city.",
 265: "In Hebron, Arab mobs kill 67 Jews.",
 270: "Trust between the communities shrinks.",
 311: "keep their doors mostly closed to refugees.",
 319: "Some try to reach Palestine on crowded,",
 320: "rickety ships past a British naval blockade.",
 326: "Britain, exhausted, hands the problem to the new United Nations.",
 338: "In April, at the village of Deir Yassin,",
 339: "Jewish irregulars kill over 100 Arab villagers.",
 396: "Egypt's president, Nasser,",
 399: "and closes the Straits of Tiran to Israeli ships.",
 404: "In six days, Israel takes the Sinai and Gaza",
 415: "and offers its Palestinian residents residency,",
 417: "And Israelis still argue among themselves",
 419: "The Arab League answers at Khartoum",
 420: "with the famous three noes: no peace, no recognition,",
 425: "Israeli governments dispute that. Through the early 70s,",
 436: "In 1976, Israeli commandos fly 4,000 kilometers",
 437: "to Entebbe, Uganda, and rescue more than 100 hostages",
 458: "The First Intifada, mostly stones, strikes and clashes",
 480: "The Second Intifada begins,",
 486: "which Palestinians say seizes their land.",
 490: "after a brief civil war with its rival Fatah",
 508: "and Bahrain, then Morocco and Sudan",
 555: "a ceasefire brokered by the United States takes hold",
}
src, dst = sys.argv[1], sys.argv[2]
out = []
for b in re.split(r'\n\s*\n', open(src, encoding='utf-8-sig').read().strip()):
    L = b.strip().splitlines(); n = int(L[0])
    out.append(f"{n}\n{L[1]}\n{FIX.get(n, ' '.join(L[2:]).strip())}")
open(dst, 'w', encoding='utf-8').write('\n\n'.join(out) + '\n')
print(len(out), 'captions,', len(FIX), 'corrected')
