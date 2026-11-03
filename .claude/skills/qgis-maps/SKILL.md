---
name: qgis-maps
description: "Pick and make map scenes for History Cartoon Studio films: choropleth, province trace, disputed borders, spinning globe, flow lines (QGIS data) or a Mapimator scene. One style per need."
---

# QGIS map styles (History Cartoon Studio, repo its-Arish/naah)

Use this when a film needs a map beyond the standard Mapimator scene: shading countries by a number, zooming into a country's states/provinces, showing disputed borders, a spinning globe, or arcs linking places in order. Built and approved Nov 2026 (`projects/qgis-showcase`, watch `out/qgis-showcase.mp4`: six styles; first demo `projects/qgis-demo`).

**Pick a different style per video** to fit the story (the creator wants variety across films). Don't reuse the same style back to back in one film unless the story needs it.

**Rejected:** the heatmap style (glowing density blobs on a dark map). The creator didn't like it; don't use it. Where a heatmap might have gone, use a **Mapimator** scene instead (style 6 below).

## What's in the repo

- `assets/qgis/world_map.gpkg`: QGIS's own world map (from `qgis/QGIS` `resources/data`), made from Natural Earth 1:10m (public domain). Layers: `countries` (ISO_A3, NAME), `states_provinces` (4,556; name, adm0_a3), `disputed_borders` (46 lines; name like "Indian claim", adm0_left).
- `scripts/qgis_export.py`: exports what a film needs to JSON (only numpy needed; no GDAL/QGIS install):
  ```
  python3 scripts/qgis_export.py projects/<slug>/src/qgis.json \
      --provinces AUS,IND        # states/provinces of these ISO3 countries
      --disputed                 # disputed-border lines
      --globe                    # coarse rings for the globe style
      --points name=file.geojson # any GeoJSON points (battles, cities, events) with their properties
  ```
  Every country also gets `nProv` (province count) and a label point `c`.
- `engine/qgis/QgisMap.tsx`: the components. Import with `import { ... } from '@engine/qgis/QgisMap'` and `import raw from './src/qgis.json'; const D = raw as unknown as QData;`.

## Coordinates and camera

- World pixels: `P(lon, lat)` → equirectangular, whole world 1920 × 960. Points from the exporter already carry `p` (pixels) and `ll` (lon/lat).
- Camera `{x, y, z}`: `camAt(lon, lat, zoom)`, `WORLD_CAM`, `moveCam(f, from, to, t0, t1)` (log-space zoom, eased). Typical zooms: world 1.05, continent 2–3, country 4–6, region (Kashmir) ~15.
- Labels go in a screen-space `<Full>` layer after the map; convert with `toScreen(cam, x, y)`.
- Chain cameras across consecutive beats (end camera of one beat = start camera of the next) so moves feel continuous.

## The styles

| Style | Component(s) | Use it for | Recipe |
|---|---|---|---|
| **Choropleth** | `Choropleth` + `ChoroLegend` | Comparing countries by a number (population, GDP, troops, deaths: deaths beats stay `quiet: true`) | `<Choropleth data={D} cam={cam} value={(c) => VALUES[c.iso] ?? null} bins={[0,5,15,30,60]} ramp={RAMP_HEAT} />`; colours sweep west→east from `sweepAt`; `RAMP_COOL` for neutral data. Legend `<ChoroLegend title bins at />` at left. Push in on the top country afterwards with a red `MapTag`. Values come from the script or a sourced lookup (fact-check them). |
| **Province trace** | `ProvinceTrace` + `ProvinceLabels` inside/after `WorldMap` | Zooming into one country's states (Mughal subahs → Indian states, Australian states, Russian oblasts) | Export `--provinces ISO3`; zoom 0–40f; each province outline draws on then fills, `stagger` 9f; `highlight={[names]}` dims the rest; labels skip tiny provinces. |
| **Disputed borders** | `DisputedLines` + `LineLegend` | Contested territory (Kashmir, Crimea, Western Sahara, Arunachal…) | Export `--disputed`; filter by `left` country; one colour + appear-frame per claim name (e.g. Indian `#E07B00`, Pakistani `#1E7F4F`, Chinese `#C8312B`); keep it even-handed: show every side's claim, neutral narration, no verdict. |
| **Globe** | `Globe` (full-frame) | Openers, "the whole world", far-apart places, spinning to a region | Export `--globe`; animate `lam0` (centre longitude, e.g. `-100 + f*1.6`), `phi0` tilt ~22; `points` as lon/lat pins; `fill(c)` can colour countries. |
| **Flow lines** | `FlowLines` + `flowIndex` | Journeys and sequences: invasion routes, trade, an explorer's stops, events in date order | `pts` = world-pixel points in order; one arc every `step` frames from `start`; ticker tag from `flowIndex(f,start,step,n)` showing year · place. |
| **Mapimator** (style 6) | `"shot": "map:<name>"` + `maps/<name>.json`; overlays via `export const MapExtras = { 'map:<name>': Comp }` | Dark documentary maps from the Russia film: routes with arrows, pins, coloured regions, text, timed to spoken words | See `docs/MAPS.md`. Copy a Russia map (`projects/russia/maps/*.json`) as a start. `at` can be seconds or `"w:word"`, but words must exist in that beat's text (re-time to seconds when reusing). Camera zoom 1 (world) to ~7; it doesn't go closer. Set `"mapSfx": "tech"` in project.json. |
| (helpers) | `MapPin`, `MapTag`, `WorldMap`, `Full` | Pins that drop with gravity (constant size at any zoom), labels | `MapPin` inside `WorldMap` with `z={cam.z}`; highlight a country with `WorldMap fill={(c) => c.iso==='DEU' ? '#F08A2E' : QC.land}`. |

## Rules

- Keep labels above y ≈ 850 (captions) and out of the top-left date tag (move style badges/tags elsewhere if the film uses the date tag).
- Strokes: use `vectorEffect="non-scaling-stroke"` or divide widths by `cam.z`, otherwise lines get fat when zoomed. Don't combine non-scaling-stroke with `pathLength` dash tricks (gaps appear): divide by `cam.z` instead and drop the dash once drawn.
- Physics for anything that drops (pins: `gravityDrop`). SFX on maps: the tech set (`tech_whoosh` on camera moves, `tech_fill`, `tech_trace` for lines, `data_blips` for many points, `tech_chime` on the payoff).
- Facts: data from the repo files is fine as stated; anything else (values for a choropleth, claims) gets fact-checked per CLAUDE.md.
- Real QGIS (terrain/hillshade, satellite basemaps, 3D, Temporal Controller) needs QGIS installed on the creator's computer with the chat linked to it; this kit works without it.

## Check

`node scripts/studio.mjs check <slug>`, then `stills` at mid-move frames (camera arrived, lines half-drawn, labels popped). Look for labels in the caption zone, fat strokes, and points off-frame.
