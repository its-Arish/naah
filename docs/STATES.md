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
| 6 | Hawaii | **script written** (`projects/hawaii`) | Hawaiian pizza is Canadian → ukulele → palace lit before the White House → overthrow; "a spoonful of sugar" |
| 7 | Alaska | | Bought from Russia for about 2 cents an acre: "Seward's Folly" |
| 8 | Louisiana | | Mardi Gras, jazz, gumbo… and its law still descends from the Napoleonic tradition |
| 9 | Nevada | | Las Vegas, slot machines… and the atomic tests you could watch from a hotel roof |
| 10 | Arizona | | The Grand Canyon… and the state that doesn't change its clocks |
| 11 | Massachusetts | | Thanksgiving, Harvard, the Tea Party… |
| 12 | Pennsylvania | | The Liberty Bell, Hershey's chocolate… |
| 13 | Virginia | | Jamestown, eight presidents… |
| 14 | Georgia | | Coca-Cola, peaches… |
| 15 | Tennessee | | Elvis, Graceland, Nashville, Jack Daniel's… |
| 16 | Washington | | Starbucks, Amazon, Microsoft… |
| 17 | Colorado | | Ski slopes, the Rockies… |
| 18 | Illinois | | Chicago, deep dish, the Great Fire… |
| 19 | Michigan | | The car in your driveway (Detroit, Ford)… |
| 20 | Ohio | | The Wright brothers… and the most presidents' birthplaces after Virginia |
| 21 | New Jersey | | The light bulb lab, the boardwalk… |
| 22 | North Carolina | | First flight (Kitty Hawk), Pepsi… |
| 23 | South Carolina | | Where the Civil War's first shots were fired (Fort Sumter) |
| 24 | Mississippi | | The blues, Elvis's birthplace… |
| 25 | Kentucky | | Fried chicken, the Derby, bourbon… |
| 26 | Utah | | Mormon pioneers, the golden spike… |
| 27 | Oregon | | The Oregon Trail (the game you played at school)… |
| 28 | New Mexico | | Roswell, the first atomic bomb (Trinity)… |
| 29 | Montana | | Little Bighorn, Yellowstone… |
| 30 | Wyoming | | First state to let women vote… |
| 31 | Idaho | | The potato on your plate… |
| 32 | Oklahoma | | The musical, the Dust Bowl, the land run… |
| 33 | Kansas | | The Wizard of Oz, tornado alley… |
| 34 | Missouri | | The Gateway Arch, Mark Twain… |
| 35 | Arkansas | | Walmart was born here… |
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
