# 2026-11-19: History Map (TripTrail fork for history films)

**Asked:**
- Export a TripTrail clip of the Nepal route.
- Then, in the creator's words: "i want to crate videos for history channels, so therefore there are planes, and stuff like that i want to it to be removed, instead to mark the country we will use different colors … perhaps provience of that country".
- Keep what they liked: "the 60 fps and color grading of the work".
- Then show "german troops attack russia in world war 2".
- On the camera: "why not show from the big picture, from the globe … this angle is not fun" and "later we can zoom in zoom out".

**Made:**
- `projects/map-comparison/clips/triptrail.mp4`: 18.6 s, 1080p60. It was driven through Playwright with the creator's Brave browser (`~/Desktop/Brave Browser.app`), because Google Chrome isn't installed.
- `vendor/historymap/`: a fork of TripTrail (MIT) with these changes:
  - **Removed:** transport modes, vehicle icons, km captions, and OSRM and sea routing.
  - **Added: Map colours.** Countries and provinces come from Natural Earth 1:10m via `scripts/historymap_data.py`, which reads `assets/qgis/world_map.gpkg` and keeps polygon holes.
  - **Added: historical borders** from Cliopatria (CC BY 4.0) via `scripts/historymap_cliopatria.py`. Only 1941 is extracted so far.
  - **Added: Arrows.** Placed with two map clicks; each has a label, a colour and a timing (at the start, or when the camera reaches a place).
  - **Added: camera moves.** *Start from space* opens on the globe, dives to the story and rises back out at the end. *Zoom out between places* makes the camera rise between places, then dive in.
  - **Default:** 60 fps.
- Test clip: `projects/map-comparison/clips/historymap-barbarossa-test.mp4` (24 s, 1080p60). It uses the 1941 borders, three army-group arrows, Leningrad, Moscow and Kyiv, and the globe opening and ending.

**Learned:**
- The MP4 export needs a browser that encodes H.264 with WebCodecs. Brave works.
- The HTML's selected option overrides the code's default settings (60 fps had to be set in `index.html`).
- Cliopatria's 1941 "Nazi Germany" covers all occupied and client territory, so label it "German-controlled Europe".
- The overview must frame the places and arrows, not continent-sized areas.
- Hide labels at globe zoom.

**Open:**
- The creator couldn't open the local video paths; ask whether they work on another device.
- Add more Cliopatria years when they're needed (1914, 1945, …). The source file is about 170 MB and stays outside the repo.
- Credit Cliopatria in video descriptions.
