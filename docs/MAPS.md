# Map scenes (Mapimator)

Real maps with pins, coloured countries, borders, routes, arrows and labels that appear **on the spoken word**. They're drawn by [Mapimator](https://github.com/miladtz/Mapimator) (a git submodule in `vendor/Mapimator`) from Natural Earth 1:50m data, and slot into a film like any other shot. Captions, the date tag, corner notes and sound effects still go on top.

```
git submodule update --init vendor/Mapimator     # once, after cloning
```

> Permission: Mapimator has no licence file, so its author (miladtz) keeps the rights. The repo owner asked and the author agreed to its use in this studio (30 Oct 2026). Keep that message (or ask them to add a LICENSE file) as your record. It stays linked as a submodule rather than copied in. Natural Earth map data is public domain.

## 1. Mark the beats

Give the beats that should show the map the shot `"map:<name>"`. Consecutive beats with the same name share one continuous map:

```json
{ "id": "s04b01", "shot": "map:geneva-1954", "type": "INSERT", "text": "In July 1954, … divided Vietnam near the 17th parallel." },
{ "id": "s04b02", "shot": "map:geneva-1954", "type": "INSERT", "text": "Ho Chi Minh's communist government controlled the North." }
```

## 2. Describe the map: `projects/<slug>/maps/<name>.json`

```json
{
 "style": "documentary-dark",
 "labels": "none",
 "start": { "lon": 106.5, "lat": 18.0, "zoom": 2.4 },
 "moves": [ { "at": 0.4, "dur": 2.8, "to": { "lon": 106.8, "lat": 14.6, "zoom": 6 } } ],
 "items": [
  { "region": "vnm", "at": "w:Vietnam", "color": "#e8c65a" },
  { "line": "disputed-border", "from": [105.5, 17.0], "to": [109.0, 17.0], "at": "w:divided" },
  { "text": "17th parallel", "ll": [111.4, 17.0], "at": "w:parallel", "size": 24 },
  { "pin": "Hanoi", "ll": [105.85, 21.03], "style": "star", "color": "#ff4d4d", "at": "w:North" },
  { "route": [[105.6, 18.6], [106.3, 15.4], [106.6, 11.9]], "at": "w:trail", "every": 0.4 },
  { "arrow": [[109.6, 16.0], [108.3, 12.3]], "at": "w:advanced" },
  { "effect": "hotspot", "ll": [106.66, 10.78], "at": "end-2", "size": 40 }
 ]
}
```

**When (`at`)**: seconds from the start of the map, `"w:word"` (the moment that word is said; `"w:word#2"` for its second time, `"w:word+0.4"` to delay), `"start+1"` or `"end-2"`. With a voiceover these follow the recording; without one they follow the estimated narration timing.

**Where**: `[lon, lat]` in degrees. Camera `zoom` runs from 1 (whole world) to 6 (about one country the size of Vietnam). `moves` are smooth eased zooms/pans; you can add several.

| Item | Fields |
|---|---|
| `region` | Natural Earth country id (`vnm`, `lao`, `khm`, `tha`, `china`, `fra`, `ind`… usually the ISO3 code in lower case) and `color` |
| `pin` | name, `ll`, `style` (`dot` `map-pin` `location` `target` `star` `circle`), `color`, `size`, `label` (px, or `false`), `labelSide`, `anim` (`pop` `fade` `drop`) |
| `text` | the words, `ll` (centre), `size` in px, `color` |
| `line` | `front-line`, `disputed-border` or `blockade-line`, `from`, `to`, `color` |
| `route` / `arrow` | list of points; each segment appears `every` seconds after the last |
| `effect` | `impact-pulse` `strike-marker` `smoke-plume` `hotspot` `control-zone` `influence-zone` `refugee-flow` `missile-arc` … at `ll` (some take `to`), `size` px |

`style`: `documentary-dark` (default), `documentary-light`, `modern`, `ink`, `terrain`. `labels`: `none` (default, label things yourself) or `en` (Mapimator's own country and city labels).

## 3. Render

`studio check <slug>` (and so `studio all`) renders every map scene before building, to the exact length of its beats, and caches it: only maps whose spec or timing changed render again. `studio maps <slug> --force` re-renders them all. Each map also comes out alone as `out/maps/<name>.mp4` for your own editor.

A project can draw extra studio art over a map by exporting `MapExtras` from `shots.tsx`: `{ 'map:geneva-1954': ({ s }) => <Note at={20} text="…" /> }`.

## Limits

- Pulsing effects render as still frames (Mapimator's exporter freezes CSS animation); movement comes from pins popping, fades, routes and camera moves.
- Countries colour whole. To show a split country, use a `line`, labels and pins (as the Geneva example does).
- Text and effect sizes are fixed at the zoom where they appear; if the camera zooms in later they grow with the map.
