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
| 4 | Florida | **script written** (`projects/florida`, ~3865 words, ~21 min) | Gatorade → secret Disney land → St. Augustine older than the Mayflower → Spanish longer than American → fewer people than Boston in 1900; "a doctor, a block of ice and a mosquito" (v2: full tag pass) |
| 5 | New York | **script written** (`projects/new-york`, ~3716 words, ~20 min) | Wall Street was a real wall → cookie/boss/Santa are Dutch → $24 that wasn't a sale → New Orange → slave market on Wall Street; "a ditch, four feet deep" (v2: full tag pass, expanded) |
| 6 | Hawaii | **script written** (`projects/hawaii`, ~3567 words, ~19 min) | pineapple pizza is Canadian → Portuguese ukulele → surfing kings → palace lit before the White House → queen overthrown; "a spoonful of sugar" (v2: full length, full tags) |
| 7 | Alaska | **script written** (`projects/alaska`, ~3480 words, ~19 min) | Balto vs Togo → bigger than TX+CA+MT → farthest north, west AND east → a check for living there → sold for 2 cents an acre; "a fur coat" (v2: full length, full tags) |
| 8 | Louisiana | **script written** (`projects/louisiana`, ~3392 words, ~18 min) | jazz → Tabasco → the Purchase was 15 states → parishes not counties → biggest slave market, half the city below sea level; "a river that refuses to stay still" (v2: full length, full tags) |
| 9 | Nevada | **script written** (`projects/nevada`, ~3225 words, ~17 min) | Vegas was a railroad stop → Area 51 admitted in 2013 → atomic-bomb rooftop parties → statehood by telegram; "that telegram" (v2: full length, full tags) |
| 10 | Arizona | **script written** (`projects/arizona`, ~3157 words, ~17 min) | London Bridge in the desert → not at the O.K. Corral → DST donut → 2-billion-year rocks; "canals nobody had used for four hundred years" (v2: full length, full tags) |
| 11 | Massachusetts | **script written** (`projects/massachusetts`, ~3015 words, ~16 min) | basketball + volleyball + cookie → molasses wave → Salem; "a law about the Devil" (v2: full length, full tags) |
| 12 | Pennsylvania | **script written** (`projects/pennsylvania`, ~2813 words, ~15 min) | Hershey/Crayola/Slinky/groundhog → Centralia fire → Gettysburg → state born from a debt; "a king who owed a man sixteen thousand pounds" (v2: full length, full tags) |
| 13 | Virginia | **script written** (`projects/virginia`, ~2800 words, ~15 min) | 8 presidents/Pentagon/CIA → Lee's front yard → Starving Time → 1619 assembly + 1619 Africans; "a plant the king of England hated" (v2: full length, full tags) |
| 14 | Georgia | **script written** (`projects/georgia`, ~2575 words, ~14 min) | Coca-Cola as medicine → not top peach grower → Atlanta burned → only colony to ban slavery; "a man whose friend died in a debtors' prison" (v2: full length, full tags) |
| 15 | Tennessee | **script written** (`projects/tennessee`, ~2562 words, ~14 min) | Mountain Dew = moonshine → Jack Daniel's dry county → vote decided by a mom's letter → secret city → A-bomb fuel; "a river that kept flooding" (v2: full length, full tags) |
| 16 | Washington | **script written** (`projects/washington`, ~2451 words, ~13 min) | Starbucks/Amazon/Costco/Boeing → Pig War → volcano lost 1,300 ft → Nagasaki plutonium; "a ship carrying a ton of gold" (v2: full length, full tags) |
| 17 | Colorado | **script written** (`projects/colorado`, ~2289 words, ~12 min) | Chipotle/cheeseburger → 697-sided 'rectangle' → America the Beautiful → Sand Creek → gold rush at the wrong mountain; "a mountain an explorer swore no one would ever climb" (v2) |
| 18 | Illinois | **script written** (`projects/illinois`, ~2304 words, ~12 min) | Ferris wheel/Twinkies → river flows backwards → named after a wild onion → Great Fire → 200 to a million in 57 years; "a few miles of mud between two rivers" (v2) |
| 19 | Michigan | **script written** (`projects/michigan`, ~2256 words, ~12 min) | Corn Flakes → 6 miles from water → lost a war to Ohio, won a peninsula → Motor City bankrupt; "a farm boy who hated farming" (v2) |
| 20 | Ohio | **script written** (`projects/ohio`, ~2215 words, ~12 min) | 7 presidents → swallowtail flag → statehood paperwork finished 1953 → Kent State → first plane + first Moonwalker; "a toy helicopter" (v2) |
| 21 | New Jersey | **script written** (`projects/new-jersey`, ~2321 words, ~12 min) | light bulb/drive-in/Monopoly → can't pump your own gas → first movie studio → Hamilton shot, Hindenburg; "a waterfall Alexander Hamilton wanted to put to work" (v2) |
| 22 | North Carolina | **script written** (`projects/north-carolina`, ~2692 words, ~14 min) | Pepsi/Krispy Kreme/first public university → First in Flight but the Wrights were from Ohio → Blackbeard's head → the Lost Colony; "one word, carved into a post" (v2) |
| 23 | South Carolina | **script written** (`projects/south-carolina`, ~2414 words, ~13 min) | first golf club/the Charleston/sweet tea → Fort Sumter → more than half enslaved → rice; "a handful of seed rice from the other side of the world" (v2) |
| 24 | Mississippi | **script written** (`projects/mississippi`, ~2321 words, ~12 min) | teddy bear/Kermit/bottled Coke/Elvis → the blues → Emmett Till → poorest state; "some of the richest soil on Earth" (v2) |
| 25 | Kentucky | **script written** (`projects/kentucky`, ~2324 words, ~12 min) | KFC/Happy Birthday/bourbon barrels/longest cave → Lincoln and Davis both born there; "a gap in the mountains" (v2) |
| 26 | Utah | **script written** (`projects/utah`, ~2264 words, ~12 min) | Jell-O/seagull in the desert/float like a cork → Mountain Meadows → six statehood rejections; "a plague of crickets" (v2) |
| 27 | Oregon | **script written** (`projects/oregon`, ~2287 words, ~12 min) | dysentery/Nike waffle iron/coin-toss Portland/two-sided flag → exclusion clause; "a hat" (v2) |
| 28 | New Mexico | **script written** (`projects/new-mexico`, ~2207 words, ~12 min) | Microsoft/Roswell/passport mix-ups/oldest capital → Trinity; "a boys' school on a lonely mountain mesa" (v2) |
| 29 | Montana | **script written** (`projects/montana`, ~2186 words, ~12 min) | more cows than people/no speed limit/first T. rex/first congresswoman → toxic lake; "a hill everyone thought was worn out" (v2) |
| 30 | Wyoming | **script written** (`projects/wyoming`, ~2087 words, ~11 min) | Yellowstone/Devils Tower/fewest people → Rock Springs → women's vote first; "six men for every woman" (v2) |
| 31 | Idaho | **script written** (`projects/idaho`, ~2105 words, ~11 min) | a third of US potatoes/made-up name/TV in a potato field → SL-1 → first nuclear town; "a desert so empty the Navy used it for target practice" (v2) |
| 32 | Oklahoma | **script written** (`projects/oklahoma`, ~2158 words, ~12 min) | shopping cart/parking meter/yield sign → land run → Tulsa 1921; "as long as the grass grows, and the water runs" (v2) |
| 33 | Kansas | **script written** (`projects/kansas`, ~2116 words, ~11 min) | Pizza Hut/White Castle/flatter than a pancake/Air Capital → Bleeding Kansas; "crates of rifles, labelled Bibles" (v2) |
| 34 | Missouri | **script written** (`projects/missouri`, ~2230 words, ~12 min) | iced tea/ice cream cone/Arch/trails → Dred Scott; "a fourteen-year-old boy and a crew of thirty men" (v2) |
| 35 | Arkansas | **script written** (`projects/arkansas`, ~2087 words, ~11 min) | Walmart/finders-keepers diamonds/pronunciation law → Little Rock Nine; "a little dime store on a town square" (v2) |
| 36 | Minnesota | **script written** (`projects/minnesota`, ~2167 words, ~12 min) | Cheerios/Spam/Scotch tape/11,000 lakes/Mall of America → Mankato 1862; "the only great waterfall on the Mississippi" (v2) |
| 37 | Wisconsin | **script written** (`projects/wisconsin`, ~2150 words, ~12 min) | QWERTY/Harley/first kindergarten/cheeseheads → Peshtigo; "a tiny bug" (v2) |
| 38 | Iowa | **script written** (`projects/iowa`, ~2170 words, ~12 min) | 7 pigs per person/first computer/Field of Dreams → day the music died → caucuses; "a slow copy machine" (v2) |
| 39 | Indiana | **script written** (`projects/indiana`, ~2136 words, ~11 min) | Indy 500/Lincoln grew up here/pi = 3.2/Santa Claus → Klan; "a race track paved with three million bricks" (v2) |
| 40 | Maryland | **script written** (`projects/maryland`, ~2200 words, ~12 min) | Ouija/DC from Maryland land/despot state song → Antietam → anthem; "a flag sewn so big, the enemy couldn't miss it" (v2) |
| 41 | Connecticut | **script written** (`projects/connecticut`, ~2139 words, ~12 min) | Frisbee/first hamburger/first phone book → Mystic 1637 → insurance capital; "ships that never came home" (v2) |
| 42 | Rhode Island | **script written** (`projects/rhode-island`, ~2082 words, ~11 min) | longest name/not an island/Mr. Potato Head/first out, last in → slave trade; "a man thrown out of Massachusetts, in the middle of winter" (v2) |
| 43 | Delaware | **script written** (`projects/delaware`, ~2100 words, ~11 min) | first state/more companies than people/1209 N. Orange St./nylon → slavery to the end; "a mistake made by its neighbour" (v2) |
| 44 | New Hampshire | **script written** (`projects/new-hampshire`, ~2061 words, ~11 min) | Live Free or Die plates/400 reps at $100/231-mph wind → Challenger; "a town meeting" (v2) |
| 45 | Vermont | **script written** (`projects/vermont`, ~2072 words, ~11 min) | Ben & Jerry's/maple/no McDonald's in the capital/no billboards → its own country; "a gang called the Green Mountain Boys" (v2) |
| 46 | Maine | **script written** (`projects/maine`, ~2034 words, ~11 min) | lobsters/one neighbour/earmuffs/part of Massachusetts → Malaga Island → prison food; "lobsters piled two feet high on the beach" (v2) |
| 47 | West Virginia | **script written** (`projects/west-virginia`, ~1980 words, ~11 min) | Mother's Day/Golden Delicious/Country Roads/split from Virginia → Blair Mountain; "a black rock that burns" (v2) |
| 48 | Nebraska | **script written** (`projects/nebraska`, ~2011 words, ~11 min) | Kool-Aid/TV dinner/Arbor Day/one-house legislature → Standing Bear; "a newspaper editor who missed his trees" (v2) |
| 49 | South Dakota | **script written** (`projects/south-dakota`, ~1184 words, ~8 min) | Rushmore → Wall Drug free ice water → Corn Palace → Wounded Knee → $2 billion nobody will take; "a general who went looking for gold" |
| 50 | North Dakota | **script written** (`projects/north-dakota`, ~1227 words, ~8 min) | #1 honey → -60° and 121° in one year → only state-owned bank → least visited → Grand Forks flooded and burned → oil giant; "a farmer named Henry Bakken" |

## Series rules

- Same narrator, same kit, a different QGIS map style per state where it fits (`.claude/skills/qgis-maps`).
- Thumbnail template: split "then vs now" map with black year boxes and one big line (see `projects/alabama-thumb`, "1965 | 1969 · Same State?!"). No characters.
- Title starts with "The Entire History of <State>" for search; the second half promises that film's contrast.
- Music tracks stay "not yet heard" until the creator listens.
