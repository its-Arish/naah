# The Entire History of … (all 50 US states)

One long-form film per state (20–30 min), house style, Gemini voiceover. Scripts follow `docs/PLAYBOOK.md`: a familiar-thing hook, three flowing facts, no "stay to the end", no chapter cards (timeline bar instead), quiet treatment for tragedies, fact-check everything.

Each new state: `node scripts/studio.mjs new <state> "The Entire History of <State>"`, copy the state-map kit from `projects/alabama/src` (Kit, KitAL, Factory, Moves, Timeline), script in `projects/<state>/script.md`.

**Every hook must pass `docs/HOOKS.md`. Hook seeds are starting ideas only: not fact-checked yet.** Check them when the script is written.

## Done

| # | State | Status | Where |
|---|---|---|---|
| 1 | Alabama | film delivered (28 min); new "Sweet Home Alabama" hook recorded, full re-render pending | branch `alabama-script`, `projects/alabama` |
| 2 | California | film delivered | `projects/california` |
| 3 | Texas | film made | branch `texas-film-teach-pointer` |

## To do (suggested order: big search interest first, then regions so neighbouring maps get reused)

| # | State | Status | Hook seed (familiar thing → twist) |
|---|---|---|---|
| 4 | Florida | **script written** (`projects/florida`, branch `fifty-states`) | Gatorade → Disney's secret land → older than the Mayflower → fewer people than Boston in 1900 |
| 5 | New York | **script written** (`projects/new-york`) | Wall Street → Dutch words → $24 myth → New Orange → slave market; "a ditch, four feet deep" |
| 6 | Hawaii | **script written** (`projects/hawaii`, ~1806 words, ~12 min) | Hawaiian pizza is Canadian → ukulele → palace lit before the White House → overthrow; "a spoonful of sugar" |
| 7 | Alaska | **script written** (`projects/alaska`, ~1659 words, ~11 min) | Balto vs Togo → bigger than TX+CA+MT → easternmost too → paid to live there; "it starts with a fur coat" |
| 8 | Louisiana | **script written** (`projects/louisiana`, ~1677 words, ~11 min) | Jazz → Tabasco → Purchase was 15 states → parishes; "a river that refuses to stay still" |
| 9 | Nevada | **script written** (`projects/nevada`, ~1283 words, ~9 min) | Vegas was a railroad stop → Area 51 → atomic parties → statehood by telegram; "it starts with that telegram" |
| 10 | Arizona | **script written** (`projects/arizona`, ~1482 words, ~10 min) | London Bridge in the desert → not at the O.K. Corral → DST donut → 2-billion-year rocks; "canals nobody had used for four hundred years" |
| 11 | Massachusetts | **script written** (`projects/massachusetts`, ~1624 words, ~11 min) | basketball + volleyball + cookie → molasses wave → Salem; "a law about the Devil" |
| 12 | Pennsylvania | **script written** (`projects/pennsylvania`, ~1455 words, ~10 min) | Hershey/Crayola/Slinky/groundhog → Centralia fire → Gettysburg → state born from a debt; "a king who owed a man sixteen thousand pounds" |
| 13 | Virginia | **script written** (`projects/virginia`, ~1320 words, ~9 min) | 8 presidents/Pentagon/CIA → Lee's front yard → Starving Time → 1619 assembly + 1619 Africans; "a plant the king of England hated" |
| 14 | Georgia | **script written** (`projects/georgia`, ~1285 words, ~9 min) | Coca-Cola as medicine → not top peach grower → Atlanta burned → only colony to ban slavery; "a man whose friend died in a debtors' prison" |
| 15 | Tennessee | **script written** (`projects/tennessee`, ~1423 words, ~9 min) | Mountain Dew = moonshine → Jack Daniel's dry county → vote decided by a mom's letter → secret city → A-bomb fuel; "a river that kept flooding" |
| 16 | Washington | **script written** (`projects/washington`, ~1433 words, ~10 min) | Starbucks/Amazon/Costco/Boeing → Pig War → volcano lost 1,300 ft → Nagasaki plutonium; "a ship carrying a ton of gold" |
| 17 | Colorado | **script written** (`projects/colorado`, ~1332 words, ~9 min) | Chipotle/cheeseburger → 697-sided 'rectangle' → America the Beautiful → Sand Creek → gold rush at the wrong mountain; "a mountain an explorer swore no one would ever climb" |
| 18 | Illinois | **script written** (`projects/illinois`, ~1413 words, ~9 min) | Ferris wheel/Twinkies → river flows backwards → named after a wild onion → Great Fire → 200 to a million in 57 years; "a few miles of mud between two rivers" |
| 19 | Michigan | **script written** (`projects/michigan`, ~1297 words, ~9 min) | Corn Flakes → 6 miles from water → lost a war to Ohio, won a peninsula → Motor City bankrupt; "a farm boy who hated farming" |
| 20 | Ohio | **script written** (`projects/ohio`, ~1309 words, ~9 min) | 7 presidents → swallowtail flag → statehood paperwork finished 1953 → Kent State → first plane + first Moonwalker; "a toy helicopter" |
| 21 | New Jersey | **script written** (`projects/new-jersey`, ~1271 words, ~8 min) | light bulb/drive-in/Monopoly → can't pump your own gas → first movie studio → Hamilton shot, Hindenburg; "a waterfall Alexander Hamilton wanted to put to work" |
| 22 | North Carolina | **script written** (`projects/north-carolina`, ~1450 words, ~10 min) | Pepsi/Krispy Kreme → First in Flight (Wrights from Ohio) → Blackbeard → 115 colonists vanished; "one word, carved into a post" |
| 23 | South Carolina | **script written** (`projects/south-carolina`, ~1350 words, ~9 min) | first golf club/sweet tea → Fort Sumter → enslaved majority → city built on rice; "a handful of seed rice from the other side of the world" |
| 24 | Mississippi | **script written** (`projects/mississippi`, ~1465 words, ~10 min) | teddy bear → Elvis + the blues → 13th Amendment filed in 2013 → Emmett Till → poorest state; "some of the richest soil on Earth" |
| 25 | Kentucky | **script written** (`projects/kentucky`, ~1327 words, ~9 min) | KFC → Happy Birthday → more bourbon barrels than people → longest cave → Lincoln and Davis both born here; "a gap in the mountains" |
| 26 | Utah | **script written** (`projects/utah`, ~1385 words, ~9 min) | Jell-O → seagull in a desert → float like a cork → Mountain Meadows → rejected for statehood 6 times; "a plague of crickets" |
| 27 | Oregon | **script written** (`projects/oregon`, ~1285 words, ~9 min) | You have died of dysentery → Nike waffle iron → coin-toss Portland → two-sided flag → Black exclusion clause; "a hat" |
| 28 | New Mexico | **script written** (`projects/new-mexico`, ~1299 words, ~9 min) | Microsoft/Roswell → mistaken for a foreign country → capital before the Pilgrims → Trinity, families never warned; "a boys' school on a lonely mountain mesa" |
| 29 | Montana | **script written** (`projects/montana`, ~1264 words, ~8 min) | more cows than people → no speed limit → first T. rex → first woman in Congress → toxic lake killed thousands of geese; "a hill everyone thought was worn out" |
| 30 | Wyoming | **script written** (`projects/wyoming`, ~1141 words, ~8 min) | Yellowstone → Devils Tower → fewer people than D.C. → Rock Springs → women voted 50 years early; "a territory that had six men for every woman" |
| 31 | Idaho | **script written** (`projects/idaho`, ~1267 words, ~8 min) | a third of US potatoes → made-up name → TV dreamed up in a potato field → SL-1 → first town lit by the atom; "a desert so empty the Navy used it for target practice" |
| 32 | Oklahoma | **script written** (`projects/oklahoma`, ~1337 words, ~9 min) | shopping cart/parking meter/yield sign → 'red people' → Land Run → Tulsa 1921; "As long as the grass grows, and the water runs" |
| 33 | Kansas | **script written** (`projects/kansas`, ~1131 words, ~8 min) | Pizza Hut/White Castle → flatter than a pancake → Air Capital → Bleeding Kansas; "crates of rifles, labelled Bibles" |
| 34 | Missouri | **script written** (`projects/missouri`, ~1220 words, ~8 min) | iced tea + ice cream cone → Arch twice the Statue of Liberty → every trail west starts here → Dred Scott; "a fourteen-year-old boy and a crew of thirty men" |
| 35 | Arkansas | **script written** (`projects/arkansas`, ~1159 words, ~8 min) | Walmart → keep-what-you-find diamond mine → pronunciation law → Little Rock Nine; "a little dime store on a town square" |
| 36 | Minnesota | | 10,000 lakes, the Mall of America… |
| 37 | Wisconsin | | Cheese, Harley-Davidson… |
| 38 | Iowa | | Corn, the caucuses… |
| 39 | Indiana | | The Indy 500… |
| 40 | Maryland | | The national anthem (Fort McHenry)… |
| 41 | Connecticut | | Hamburgers, Yale, the insurance capital… |
| 42 | Rhode Island | | The smallest state with the longest official name |
| 43 | Delaware | | The first state… |
| 44 | New Hampshire | | "Live Free or Die", the first primary… |
| 45 | Vermont | | Maple syrup, Ben & Jerry's… and it was briefly its own country |
| 46 | Maine | | Lobster, lighthouses… |
| 47 | West Virginia | | "Take Me Home, Country Roads"… |
| 48 | Nebraska | | Kool-Aid was invented here… |
| 49 | South Dakota | | Mount Rushmore… |
| 50 | North Dakota | | The geographic centre of North America… |

## Series rules

- Same narrator, same kit, a different QGIS map style per state where it fits (`.claude/skills/qgis-maps`).
- Thumbnail template: split "then vs now" map with black year boxes and one big line (see `projects/alabama-thumb`, "1965 | 1969 · Same State?!"). No characters.
- Title starts with "The Entire History of <State>" for search; the second half promises that film's contrast.
- Music tracks stay "not yet heard" until the creator listens.
