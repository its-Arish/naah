# The Entire History of Alabama

Long-form History Monkey film, 16:9. **Status: script written (10 November 2026), waiting for the Gemini TTS voiceover.** About 4,250 spoken words, so roughly 23 to 25 minutes.

Next steps follow `docs/PLAYBOOK.md`: the creator voices `script.md` in Gemini TTS and sends the `.mp3` and `.srt`; then fix the captions, copy `tools/make_beats.py`, `tools/fix_srt.py`, `src/Timeline.tsx`, `src/Kit.tsx` and `src/Kit2.tsx` from `projects/california`, and build.

## The idea

- **Hook (familiar things):** the Mardi Gras beads (Mobile, 1703), the lost suitcase (Unclaimed Baggage, Scottsboro), your parents' songs (Muscle Shoals), the Moon rocket (Huntsville). Then the turn: four years before that rocket flew, people were beaten on a bridge in the same state for trying to vote.
- **The open question:** how does one state do both? Paid off in Part 9: the rocket and the bridge were the same kind of story, people refusing to accept a line as the end of the road.
- **Running thread: "Five blocks."** Dexter Avenue in Montgomery runs five blocks from the Court Square fountain up to the Capitol. Every return adds a pin to one small street map (the same map each time, so viewers learn it):

| Pin | Year | Where on the five blocks | Script part |
| --- | --- | --- | --- |
| 1 | 1846 | Capitol built at the top | 3C |
| 2 | 1850s | Slave auctions at the fountain, Court Square (bottom) | 4 |
| 3 | 1861 | Jefferson Davis sworn in on the Capitol steps (bronze star) | 5 |
| 4 | 1861 | Fort Sumter telegram sent from the Winter Building, Court Square | 5 |
| 5 | 1954–55 | Dr. King's church, one block below the Capitol | 8 |
| 6 | 1955 | Rosa Parks boards the bus at Court Square | 8 |
| 7 | 1963 | Wallace's "segregation forever" on the Davis star | 8 |
| 8 | 1965 | 25,000 Selma marchers walk up Dexter Avenue to the Capitol | 8E |
| 9 | 1979 | Wallace asks forgiveness inside Dr. King's old church | 9 |

- **Second thread (the ending button):** the name. A newspaper said in 1842 that "Alabama" meant "here we rest" (Part 3C); no such words exist in the language. The ending turns it round: the usual explanation is Choctaw words about clearing the thicket, so the last line is "Never 'here we rest.' Always... clear the path."
- **Contrast cuts:** Huntsville rockets (Part 7) and Montgomery/Selma (Part 8) are cut against each other, then meet at the Moon (Part 9).

## Timeline bar labels

First Alabamians 8000 BC–1540 · Empires 1540–1813 · Statehood 1813–1846 · Cotton 1820–1860 · War 1861–1865 · Iron and peanuts 1865–1940 · Rocket City 1941–1960 · Five blocks 1955–1965 · Moon 1969–1979 · Today 1997–now.

## Map scenes (QGIS kit; a different style per era, never the heatmap)

| Part | Map | Style idea |
| --- | --- | --- |
| Hook | Alabama outline with four pins popping in order: Mobile, Scottsboro, Muscle Shoals, Huntsville; then Selma | Mapimator, clean modern |
| 1 | Russell Cave (NE) and Moundville on the Black Warrior River | Old-world coastlines, dark documentary look |
| 2 | De Soto's route into Alabama, Mabila marked "location unknown" (dotted circle) | Flow line on old coastlines |
| 2C | Gulf coast flag swap over Mobile: France → Britain → Spain → USA | Disputed-border style, colour flips |
| 3B/3C | Creek lands; the 23 million acres ceded in 1814 shading in | Province trace |
| 3C | Five capitals hopping: St. Stephens, Huntsville, Cahawba, Tuscaloosa, Montgomery | Pins + hop arrows |
| 3D | Removal routes west | Flow lines, quiet colours |
| 4 | The Black Belt band across the state; cotton flowing down the rivers to Mobile, then across the Atlantic | Choropleth band + flow lines |
| 4B | Clotilda's route Ouidah → Mobile Bay | Spinning globe to flow line |
| 5 | Confederate states with Montgomery starred, star moving to Richmond | Choropleth |
| 5B | Mobile Bay entrance | Close coastal map |
| 6B | Birmingham with Red Mountain, coal and limestone icons | Pins |
| 6E | Great Migration arrows north to Chicago, Detroit, Cleveland | Flow lines |
| 7/8 | Huntsville ↔ Montgomery ↔ Selma triangle for the contrast cuts | Mapimator |
| 8C/8E | Selma to Montgomery, 54 miles along Highway 80 | Route trace |
| 10 | Car plants (Vance, Lincoln, Montgomery, Huntsville), Airbus Mobile, Scottsboro | Pins |

The "five blocks" street map is drawn once (Court Square fountain at the bottom, Capitol at the top) and reused; it is a scene, not a QGIS map.

## Tragedy passages (quiet style, no gags, no narrator moves)

2B Mabila · 3B Fort Mims and Horseshoe Bend · 3D Removal · 4B Clotilda · 6C Convict leasing · 6F Scottsboro · 6H Tuskegee study · 7B Von Braun's Nazi past · 8B Sixteenth Street Baptist Church · 8D Bloody Sunday. Visuals stay symbolic (empty bridge, four church windows, an empty bus seat).

## Fact check

| Claim in the script | Check | Source |
| --- | --- | --- |
| Mobile celebrated Mardi Gras in 1703; New Orleans founded 1718 | Mobile's claim is the oldest organized celebration; worded as "partying fifteen years before New Orleans even existed", which is true either way | Wikipedia, Mardi Gras in Mobile |
| Unclaimed lost luggage ends up at one store in Scottsboro; started 1970; ~1 million visitors a year | Yes | NPR, Nov 2023 |
| Muscle Shoals ~14,000 people; Aretha, Wilson Pickett ("Mustang Sally") at FAME; Stones recorded "Brown Sugar" and "Wild Horses" Dec 1969 | Yes. Muscle Shoals Sound was technically in Sheffield next door; the script says "there" for the region | Encyclopedia of Alabama; UA Alumni magazine |
| Saturn V designed at Marshall Space Flight Center, Huntsville | Yes | NASA / Encyclopedia of Alabama |
| Russell Cave used for about 10,000 years; Moundville 29 mounds, ~1,000 inside walls, ~10,000 in valley | Yes | NPS; Wikipedia, Moundville |
| Mabila, Oct 18 1540; thousands killed; site never found | Estimates 2,500 and up | Encyclopedia of Alabama |
| France 1702 → Britain 1763 → Spain 1780 → USA 1813 ("four flags in 111 years") | Yes | |
| Horseshoe Bend: 800+ Red Sticks killed; Treaty of Fort Jackson 23 million acres, including allies' land | Yes (NPS says 23 million; EOA says "more than 21 million") | NPS; Britannica |
| Under 10,000 people in 1810; 127,901 in 1820 | Yes | 1820 census; Wikipedia, Alabama Fever |
| Statehood Dec 14 1819, 22nd state; five capitals in under 30 years | St. Stephens 1817, Huntsville 1819, Cahawba 1820, Tuscaloosa 1826, Montgomery 1846 | ADAH |
| "Here we rest" invented in an 1842 newspaper; no such phrase in the language | Yes | ADAH Fast Facts |
| 1860: 964,201 people, 435,080 enslaved (45%) | Yes | 1860 census |
| Court Square was Montgomery's slave market; Rosa Parks boarded there; telegram sent from the Winter Building there; Dexter Ave is five blocks to the Capitol | Yes | Historical markers; Alabama Reflector |
| Clotilda, July 1860, 110 captives, burned; found 2019; last known slave ship | Yes. "A bet" is the traditional story, so it says "the story goes" | National Geographic; AHC |
| Secession Jan 11 1861; Davis inaugurated Feb 18 1861; telegram Apr 11; capital moved to Richmond May 1861 | Yes | NPS |
| "Damn the torpedoes" | Attribution uncertain; script says "the story goes… whether he said it or not" | |
| Benjamin Turner of Selma, born enslaved, elected 1870 | Yes | |
| 1901 constitution: "to establish white supremacy in this State" (John B. Knox); 977 amendments; world's longest | Yes | Convention journal; State Court Report |
| Birmingham 1871; Vulcan 56 ft, largest cast-iron statue, left by the tracks for unpaid freight | Yes | Encyclopedia of Alabama |
| Alabama last state to end convict leasing, 1928 | Yes | |
| Carver at Tuskegee 1896; did not invent peanut butter | Yes | |
| Boll Weevil Monument, Enterprise, Dec 11 1919, only monument to a pest | Yes | Encyclopedia of Alabama |
| Wright brothers' first civilian flying school, Montgomery 1910; first night flights | Yes | Encyclopedia of Alabama |
| Helen Keller (Tuscumbia 1880, "water" at the pump); Owens, Louis, Aaron, Mays, Nat King Cole, Hank Williams born in Alabama | Yes | |
| Scottsboro 1931: nine Black teens, youngest about 13, eight sentenced to death, two Supreme Court cases, pardons 2013 | Yes | |
| Tuskegee Airmen ~1,000 pilots; Tuskegee syphilis study 1932–1972, apology 1997 | Yes | |
| Huntsville 16,437 people in 1950, "Watercress Capital"; Explorer 1 Jan 1958; Marshall 1960; population more than quadrupled by 1960 (72,365) | Yes | Huntsville CVB; NASA |
| Von Braun: Nazi Party, SS officer; more died building the V-2 than were killed by it | Yes (Neufeld: at least 10,000 deaths tied to the V-2 programme vs ~5,000 killed by it) | National WWII Museum |
| King at Dexter Ave 1954 aged 25; Colvin, 15, March 1955; Parks Dec 1 1955; 381-day boycott; Supreme Court ruling | Yes | |
| Wallace "segregation forever" Jan 1963 on the Davis star; schoolhouse door June 1963 | Yes | |
| 16th Street Baptist Church, Sept 15 1963: Denise McNair 11, the others 14 | Yes | |
| Selma: ~2% of eligible Black voters registered; ~600 marchers on Bloody Sunday; 54 miles; ~25,000 at the Capitol; VRA Aug 6 1965 | Yes | NPS; History.com |
| Apollo 11: launch July 16, landing July 20 1969 | Yes | |
| Wallace at Dexter Avenue Baptist Church, 1979, asked forgiveness | Yes | America Magazine; Washington Post (1995) |
| Mercedes Vance 1997; Alabama capacity ~1.3 million vehicles a year | Yes | Made in Alabama, 2025 |
| Huntsville now Alabama's largest city; Space Command HQ move announced Sept 2025 | Yes (move still being phased in, and Colorado's lawsuit is pending, so the script only says "announced… would move") | Census 2020; AL Reporter, Sept 2026 |
| Artemis II, April 2026: SLS designed and managed at Marshall; farthest humans from Earth | Yes | NASA; Business Alabama |
| "Alabama" = Choctaw "thicket clearers" | The usual explanation, not certain; script says "the most common explanation" | ADAH |

## Open points

- The hook runs about 40 seconds (133 words), like California's. The playbook target is under 20 seconds; a tighter cut would keep only the beads, the suitcase and the rocket.
- Listen for these names after recording: Tascalusa, Mabila, Iberville, Bienville, Cahawba, Tuscumbia, Clotilda, Wernher von Braun, Claudette Colvin, Edmund Pettus, Poarch.
