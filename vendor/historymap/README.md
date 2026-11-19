# History Map Studio

Animated maps for history videos. It's a fork of [TripTrail](../triptrail) (MIT, see `LICENSE`) with the travel features removed and coloured countries and provinces added.

```
cd vendor/historymap && python3 -m http.server 8743   # then open http://localhost:8743
```

## What changed from TripTrail
- **Removed:** transport modes (plane, car, train, boat and others), the moving vehicle icon, the "A → B · Car · 304 km" caption, road routing (OSRM) and sea routing (`marnet.json`), and the *Real routes* and *Route glow* switches.
- **Kept:** the camera flight between places (now a straight or great-circle move with no line drawn), pins, labels, notes and photos, the title card, the map styles, globe and 3D tilt, music, and the deterministic 60 fps H.264 MP4 export.
- **Added: Map colours.** Search for a country or province, and each gets its own colour (click the swatch to change it). The areas stay on the map for the whole video, fade in during the opening, and the opening overview frames them. *Fill strength* and *Borders* are in the same section.
- **Added: historical borders.** Search a polity or a year in Map colours (for example "Nazi Germany · 1941" or "1941"). The data comes from Cliopatria; see below.
- **Added: Arrows.** Click *Add arrow*, then click the start and the end on the map. Each arrow has a colour, an optional label (shown under its start) and a choice of when it draws: at the start, or when the camera reaches a given place. Arrows grow along a gentle curve, then stay on screen.
- **Added: camera moves.** *Start from space* (on by default): the video opens on the whole globe with the title, spins and dives down to the story, and at the end holds the full picture before rising back out to the globe. The whole video then renders on the globe projection. *Zoom out between places* (on by default): mid-hop the camera rises most of the way back to the overview, then dives into the next place. Both switches are under Look. Labels hide while the camera is out at globe distance.
- **Defaults:** empty title and subtitle, 60 fps, and an opening view over South Asia.
- **Project file:** GeoJSON with a `historymap` member (settings plus `regions`). Old TripTrail files still import; their `mode` fields are ignored.

## Boundary data
`data/` is built from the studio's QGIS GeoPackage (`assets/qgis/world_map.gpkg`, Natural Earth 1:10m, public domain), so every map comes from GIS data and nothing is drawn by hand:
```
python3 scripts/historymap_data.py
```
- `data/index.json`: names and ids for the search.
- `data/countries.geojson`: all countries.
- `data/provinces/<ISO3>.geojson`: one country's provinces, loaded on demand.

These are today's borders.

### Historical borders
`data/historical/<year>.geojson` holds every polity alive in that year, from **[Cliopatria](https://github.com/Seshat-Global-History-Databank/cliopatria)** (Seshat Global History Databank, **CC BY 4.0**). Only the chosen years are kept, and outlines are simplified to 0.01°.

**Credit it in every video that uses it**, for example in the description: *"Historical borders: Cliopatria, Seshat Global History Databank, CC BY 4.0."*

To add years, download and unzip `cliopatria.geojson.zip` (about 170 MB; keep it outside the repo), then run:
```
python3 scripts/historymap_cliopatria.py <cliopatria_polities_only_*.geojson> 1941 1914 1945
```

The years already added are 1941.

Watch out: Cliopatria's 1941 "Nazi Germany" covers all German-occupied and client territory (France, Norway, Greece, Yugoslavia and others). Label it "German-controlled Europe", not "Germany".
