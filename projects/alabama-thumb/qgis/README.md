# Alabama thumbnail in QGIS: "10,000 Years History of Alabama"

1. Unzip `alabama-thumb-qgis.zip` anywhere (keep all files together).
2. Open QGIS (3.22 or newer). Plugins > Python Console > Show Editor.
3. Open Script > `make_alabama_thumb.py` > Run Script.

You get `alabama_thumb_dark.png`, `alabama_thumb_light.png` (1920×1080) and a `.qgz` project for each,
with a print layout you can edit (Project > Layout Manager), then Layout > Export as Image.

Map data: `world_map.gpkg`, QGIS's own world map (Natural Earth 1:10m, public domain); Alabama is the
`states_provinces` feature where name = 'Alabama'. Font: Outfit Bold (OFL, licence included).
