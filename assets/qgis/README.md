# QGIS world map data

`world_map.gpkg` is copied from the QGIS repository (`qgis/QGIS`, `resources/data/world_map.gpkg`). It holds three layers made from Natural Earth 1:10m data (public domain):

- `countries`: 240 countries (ISO_A3, NAME)
- `states_provinces`: 4,556 states and provinces (name, adm0_a3)
- `disputed_borders`: 46 disputed-border lines (name such as "Indian claim", adm0_left)

See `README_world_map.md` for how QGIS built it. Export what a film needs with `scripts/qgis_export.py`.
