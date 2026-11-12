"""
Alabama thumbnail, made in QGIS: "10,000 Years History of Alabama".

How to run (QGIS 3.22 or newer):
  1. Unzip this folder anywhere. Keep world_map.gpkg and Outfit-Bold.ttf next to this script.
  2. In QGIS: Plugins > Python Console, then click "Show Editor" (the notepad icon).
  3. Click "Open Script", choose this file, then click "Run Script" (the green arrow).

It builds two QGIS projects with a 1920x1080 print layout each, and exports two PNGs:
  alabama_thumb_dark.qgz  -> alabama_thumb_dark.png   (gold outline, dark map)
  alabama_thumb_light.qgz -> alabama_thumb_light.png  (red outline, parchment map)

To tweak by hand afterwards: open a .qgz, then Project > Layout Manager > open the layout,
move or edit the text, and Layout > Export as Image (1920x1080).

Map data: QGIS's own world_map.gpkg (Natural Earth 1:10m, public domain).
Font: Outfit Bold (SIL Open Font License).
"""
import os

from qgis.core import (
    QgsProject, QgsVectorLayer, QgsFillSymbol, QgsSingleSymbolRenderer, QgsSimpleLineSymbolLayer,
    QgsPrintLayout, QgsLayoutItemMap, QgsLayoutItemLabel, QgsLayoutPoint, QgsLayoutSize,
    QgsLayoutExporter, QgsRectangle, QgsCoordinateReferenceSystem, QgsTextFormat,
    QgsTextBufferSettings, QgsTextShadowSettings, QgsUnitTypes,
)
from qgis.PyQt.QtCore import Qt, QSize
from qgis.PyQt.QtGui import QColor, QFont, QFontDatabase

# ---------------------------------------------------------------- where the files are
try:
    BASE = os.path.dirname(os.path.abspath(__file__))
except NameError:  # some QGIS consoles don't set __file__
    BASE = os.path.expanduser('~/alabama-thumb-qgis')
GPKG = os.path.join(BASE, 'world_map.gpkg')
if not os.path.exists(GPKG):  # running from inside the repo
    GPKG = os.path.normpath(os.path.join(BASE, '..', '..', '..', 'assets', 'qgis', 'world_map.gpkg'))
FONT_FILE = os.path.join(BASE, 'Outfit-Bold.ttf')
if not os.path.exists(FONT_FILE):
    FONT_FILE = os.path.normpath(os.path.join(BASE, '..', '..', '..', 'assets', 'fonts', 'Outfit-Bold.ttf'))
if not os.path.exists(GPKG):
    raise FileNotFoundError('world_map.gpkg not found. Set BASE at the top of this script to the unzipped folder.')

# ---------------------------------------------------------------- units (QGIS 3.30 moved the enums)
try:
    from qgis.core import Qgis
    PX = Qgis.LayoutUnit.Pixels
except AttributeError:
    PX = QgsUnitTypes.LayoutPixels
MM_PER_PX = 25.4 / 96  # export is 96 dpi, so 1 layout pixel = 1 output pixel

# ---------------------------------------------------------------- the frame
W, H = 1920, 1080
# Alabama sits left of centre; the title goes on the right. EPSG:4326, 16:9 extent.
EXTENT = QgsRectangle(-89.508, 29.622, -78.918, 35.578)

THEMES = {
    'dark': dict(sea='#0E1620', land='#16212C', line='#2A3A48', al_fill=(243, 181, 98, 26),
                 edge='#F3B562', glow='#F3B562', t1='#F3B562', t2='#FFFFFF', ink='#0E141A'),
    'light': dict(sea='#BFD8E3', land='#F2E6CC', line='#D5C6A6', al_fill=(178, 34, 34, 26),
                  edge='#B22222', glow='#B22222', t1='#B22222', t2='#1B1B1B', ink='#F2E6CC'),
}

# text lines: (text, colour key, size in px, top y in px, box height in px, outline px)
LINES = [
    ('10,000', 't1', 250, 150, 270, 9),
    ('YEARS', 't1', 150, 410, 170, 7),
    ('HISTORY OF', 't2', 92, 600, 110, 6),
    ('ALABAMA', 't2', 176, 700, 200, 8),
]
TEXT_X, TEXT_W = 930, 960


def font_family():
    fid = QFontDatabase.addApplicationFont(FONT_FILE) if os.path.exists(FONT_FILE) else -1
    fams = QFontDatabase.applicationFontFamilies(fid) if fid >= 0 else []
    return fams[0] if fams else 'Arial'


def layer(name, subset, symbol):
    lyr = QgsVectorLayer(f'{GPKG}|layername={name}', name, 'ogr')
    if subset:
        lyr.setSubsetString(subset)
    lyr.setRenderer(QgsSingleSymbolRenderer(symbol))
    return lyr


def line(color, width_px, alpha=255):
    c = QColor(color)
    c.setAlpha(alpha)
    sl = QgsSimpleLineSymbolLayer(c, width_px * MM_PER_PX)
    sl.setPenJoinStyle(Qt.RoundJoin)
    sl.setPenCapStyle(Qt.RoundCap)
    return sl


def build(theme):
    t = THEMES[theme]
    project = QgsProject.instance()
    project.clear()
    project.setCrs(QgsCoordinateReferenceSystem('EPSG:4326'))

    countries = layer('countries', None, QgsFillSymbol.createSimple(
        {'color': t['land'], 'outline_color': t['line'], 'outline_width': str(2 * MM_PER_PX)}))
    states = layer('states_provinces', "adm0_a3 = 'USA' AND name <> 'Alabama'", QgsFillSymbol.createSimple(
        {'color': t['land'], 'outline_color': t['line'], 'outline_width': str(2 * MM_PER_PX)}))

    # Alabama: faint fill, three soft glow strokes, then the crisp outline
    al_sym = QgsFillSymbol.createSimple({'color': '%d,%d,%d,%d' % t['al_fill'], 'outline_style': 'no'})
    for w, a in ((60, 18), (34, 33), (18, 56)):
        al_sym.appendSymbolLayer(line(t['glow'], w, a))
    al_sym.appendSymbolLayer(line(t['edge'], 9))
    alabama = layer('states_provinces', "adm0_a3 = 'USA' AND name = 'Alabama'", al_sym)
    alabama.setName('Alabama')

    for lyr in (countries, states, alabama):
        project.addMapLayer(lyr)

    layout = QgsPrintLayout(project)
    layout.initializeDefaults()
    layout.setName(f'Alabama thumbnail ({theme})')
    layout.pageCollection().page(0).setPageSize(QgsLayoutSize(W, H, PX))

    m = QgsLayoutItemMap(layout)
    m.attemptMove(QgsLayoutPoint(0, 0, PX))
    m.attemptResize(QgsLayoutSize(W, H, PX))
    m.setCrs(QgsCoordinateReferenceSystem('EPSG:4326'))
    m.setLayers([alabama, states, countries])
    m.setKeepLayerSet(True)
    m.setExtent(EXTENT)
    m.setBackgroundColor(QColor(t['sea']))
    m.setFrameEnabled(False)
    layout.addLayoutItem(m)

    fam = font_family()
    for text, ckey, size_px, top, box_h, outline_px in LINES:
        lab = QgsLayoutItemLabel(layout)
        lab.setText(text)
        fmt = QgsTextFormat()
        f = QFont(fam)
        f.setWeight(QFont.Bold)
        f.setLetterSpacing(QFont.AbsoluteSpacing, 2)
        fmt.setFont(f)
        fmt.setSize(size_px * 0.75)  # px -> pt at 96 dpi
        fmt.setSizeUnit(QgsUnitTypes.RenderPoints)
        fmt.setColor(QColor(t[ckey]))
        buf = QgsTextBufferSettings()
        buf.setEnabled(True)
        buf.setSize(outline_px * MM_PER_PX)
        buf.setSizeUnit(QgsUnitTypes.RenderMillimeters)
        buf.setColor(QColor(t['ink']))
        buf.setJoinStyle(Qt.RoundJoin)
        fmt.setBuffer(buf)
        sh = QgsTextShadowSettings()
        sh.setEnabled(True)
        sh.setOffsetAngle(180)  # straight down
        sh.setOffsetDistance(8 * MM_PER_PX)
        sh.setOffsetUnit(QgsUnitTypes.RenderMillimeters)
        sh.setBlurRadius(0)
        sh.setColor(QColor(0, 0, 0))
        sh.setOpacity(0.35)
        fmt.setShadow(sh)
        if hasattr(lab, 'setTextFormat'):
            lab.setTextFormat(fmt)
        else:  # QGIS before 3.24: no outline or shadow, just font and colour
            lab.setFont(fmt.font())
            lab.setFontColor(QColor(t[ckey]))
        lab.setHAlign(Qt.AlignLeft)
        lab.setVAlign(Qt.AlignTop)
        lab.setMarginX(0)
        lab.setMarginY(0)
        lab.attemptMove(QgsLayoutPoint(TEXT_X, top, PX))
        lab.attemptResize(QgsLayoutSize(TEXT_W, box_h, PX))
        lab.setBackgroundEnabled(False)
        lab.setFrameEnabled(False)
        layout.addLayoutItem(lab)

    project.layoutManager().addLayout(layout)

    png = os.path.join(BASE, f'alabama_thumb_{theme}.png')
    settings = QgsLayoutExporter.ImageExportSettings()
    settings.dpi = 96
    settings.imageSize = QSize(W, H)
    result = QgsLayoutExporter(layout).exportToImage(png, settings)
    project.write(os.path.join(BASE, f'alabama_thumb_{theme}.qgz'))
    print(theme, 'exported' if result == QgsLayoutExporter.Success else f'export error {result}', '->', png)


for th in THEMES:
    build(th)
print('Done. Open the PNGs in', BASE)
