/* History Map Studio — animated maps for history videos.
   Forked from TripTrail (MIT, see LICENSE): the travel parts (transport modes,
   vehicle icons, road / sea routing, distance captions) are removed, and
   countries / provinces can be coloured from Natural Earth data (data/, built by
   scripts/historymap_data.py from assets/qgis/world_map.gpkg).
   Stack: MapLibre GL v5 (render, globe) + Esri/CARTO/OpenFreeMap (tiles)
        + Nominatim (geocode). No API keys. */

'use strict';

/* ----------------------------- Vector icons -----------------------------
   All glyphs are hand-drawn 24×24 stroke/fill primitives (no emoji anywhere).
   Same source is used for sidebar buttons (inline SVG) and the canvas
   compositor (rasterized via data-URL images, tinted per accent color). */
const ICONS = {
  camera: '<path d="M4 7.6 H7.4 L9 5.6 H15 L16.6 7.6 H20 C20.66 7.6 21.2 8.14 21.2 8.8 V18 C21.2 18.66 20.66 19.2 20 19.2 H4 C3.34 19.2 2.8 18.66 2.8 18 V8.8 C2.8 8.14 3.34 7.6 4 7.6 Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="13.2" r="3.3" fill="none" stroke="currentColor" stroke-width="1.7"/>',
  up: '<path d="M6 14.5 12 8.5 18 14.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  down: '<path d="M6 9.5 12 15.5 18 9.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  x: '<path d="M7 7 17 17 M17 7 7 17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  chev: '<path d="M7 10 12 15 17 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  check: '<path d="M5.5 12.5 10 17 18.5 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  note: '<path d="M6 4 H14.5 L18.5 8 V20 H6 Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 11.5 H15.5 M9 15 H15.5 M9 18 H12.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
};

function svgIcon(name) {
  return `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
}

/* ----------------------------- Places + coloured regions ----------------------------- */
let stops = [];     // { id, name, lng, lat, note?, img? } — the camera visits them in order
let regions = [];   // { id, kind: 'country' | 'province' | 'historical', name, color } — shown for the whole video
let arrows = [];    // { id, from: [lng,lat], to: [lng,lat], color, label, at: 'start' | stopId } — draw once, then stay

/* ----------------------------- Settings ----------------------------- */
const settings = {
  style: 'satellite',
  aspect: '16:9',
  accent: '#ff5a3c',
  globe: false,
  pitch: false,
  labels: true,
  pace: 1,
  title: '',
  subtitle: '',
  watermark: '',
  format: 'mp4',      // mp4 | webm
  quality: 2,         // 1 | 2 (render pixel-ratio multiplier; 2 = 60 fps)
  fillOpacity: 0.45,  // coloured regions
  borders: true,
  fromSpace: true,    // open on the whole globe, then dive to the story (and rise back out at the end)
  zoomHop: true,      // between places the camera rises to show the wider map, then dives in
};

/* ----------------------------- Animation state ----------------------------- */
const anim = {
  playing: false,
  recording: false,
  phase: 'idle',          // idle | intro | leg | pause | outro
  marker: null,           // [lng,lat]
  reached: 0,
  legIndex: -1,
  caption: '',
  titleAlpha: 0,
  photo: null,
  photoLabel: '',
  photoAlpha: 0,
  pulse: null,            // { lng, lat, start } arrival ripple
  fullCoords: [],
  legs: [],
};

let map, mediaRecorder, recordedChunks = [], cancelToken = 0;
let photoTargetId = null;
let basePixelRatio = window.devicePixelRatio || 1;

/* ============================================================ helpers */
function id() { return Math.random().toString(36).slice(2, 9); }
function $(s) { return document.querySelector(s); }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

// rAF that degrades to setTimeout when the tab is hidden, so a recording
// never freezes forever if the user switches tabs mid-render.
function tick(fn) {
  if (document.hidden) { setTimeout(() => fn(performance.now()), 33); return; }
  requestAnimationFrame(fn);
}

function haversine(a, b) { // [lng,lat] -> km
  const R = 6371, toR = Math.PI / 180;
  const dLat = (b[1] - a[1]) * toR, dLng = (b[0] - a[0]) * toR;
  const la1 = a[1] * toR, la2 = b[1] * toR;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function toast(msg, ms = 2600, action) {
  const t = $('#toast');
  t.textContent = msg;
  if (action) {
    const b = document.createElement('button');
    b.className = 'toast-act'; b.textContent = action.label;
    b.onclick = () => { t.classList.add('hidden'); action.run(); };
    t.appendChild(b);
    ms = Math.max(ms, 6000);
  }
  t.classList.add('hidden'); void t.offsetWidth; t.classList.remove('hidden');   // replay the entrance
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.add('hidden'), ms);
}
function loading(on, text = 'Working…') {
  $('#loading-text').textContent = text;
  $('#loading').classList.toggle('hidden', !on);
}

/* ============================================================ geometry */
// Shortest longitudinal delta, so routes never take the long way around the
// antimeridian (Tokyo → LA crosses the Pacific, not Eurasia).
function shortestDelta(fromLng, toLng) {
  let d = toLng - fromLng;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
}

// Great-circle interpolation (slerp on the unit sphere) — matches how real
// long-haul flights curve toward the poles.
function greatCircle(a, b, n = 96) {
  const toR = Math.PI / 180, toD = 180 / Math.PI;
  const vec = p => {
    const la = p[1] * toR, lo = p[0] * toR;
    return [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)];
  };
  const va = vec(a), vb = vec(b);
  const dot = clamp(va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2], -1, 1);
  const om = Math.acos(dot);
  if (om < 1e-6) return [a.slice(), b.slice()];
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const s1 = Math.sin((1 - t) * om) / Math.sin(om), s2 = Math.sin(t * om) / Math.sin(om);
    const x = s1 * va[0] + s2 * vb[0], y = s1 * va[1] + s2 * vb[1], z = s1 * va[2] + s2 * vb[2];
    pts.push([Math.atan2(y, x) * toD, Math.atan2(z, Math.hypot(x, y)) * toD]);
  }
  // unwrap longitudes so the polyline is continuous across ±180
  pts[0][0] = a[0];
  for (let i = 1; i < pts.length; i++) {
    pts[i][0] = pts[i - 1][0] + shortestDelta(pts[i - 1][0], pts[i][0]);
  }
  // Damp toward the straight chord: pure geodesics on very long hops (e.g.
  // Hong Kong → Toronto) hug the pole and look wrong on a Mercator video —
  // blend keeps a natural poleward curve without the Arctic detour.
  const W = 0.45;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts[i][0] = pts[i][0] * (1 - W) + (a[0] + (b[0] - a[0]) * t) * W;
    pts[i][1] = pts[i][1] * (1 - W) + (a[1] + (b[1] - a[1]) * t) * W;
  }
  return pts;
}

// Camera path between two places: great circle for long hops, straight
// otherwise — always via the short side of the world.
function legCoords(A, B) {
  const b2 = [A[0] + shortestDelta(A[0], B[0]), B[1]];
  const dist = haversine(A, b2);
  if (dist > 1500) return greatCircle(A, b2);
  return arcLine(A, b2, 0);
}

function arcLine(a, b, bend, n = 72) {
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const ctrl = [mid[0] - dy * bend, mid[1] + dx * bend];
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t;
    pts.push([
      u * u * a[0] + 2 * u * t * ctrl[0] + t * t * b[0],
      u * u * a[1] + 2 * u * t * ctrl[1] + t * t * b[1],
    ]);
  }
  return pts;
}

function buildPath(coords) {
  const cum = [0];
  for (let i = 1; i < coords.length; i++) cum.push(cum[i - 1] + haversine(coords[i - 1], coords[i]));
  return { coords, cum, total: cum[cum.length - 1] || 0.0001 };
}
function pointAt(path, frac) {
  const d = clamp(frac, 0, 1) * path.total;
  let i = 1;
  while (i < path.cum.length && path.cum[i] < d) i++;
  if (i >= path.cum.length) { const last = path.coords[path.coords.length - 1]; return { pos: last, idx: path.coords.length - 1 }; }
  const seg = path.cum[i] - path.cum[i - 1] || 1;
  const t = (d - path.cum[i - 1]) / seg;
  const a = path.coords[i - 1], b = path.coords[i];
  return { pos: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], idx: i };
}
function line(coords) { return { type: 'Feature', geometry: { type: 'LineString', coordinates: coords } }; }
const EMPTY = { type: 'FeatureCollection', features: [] };

/* ============================================================ map setup */
// Free satellite imagery (Esri World Imagery) as a self-contained style spec,
// with glyphs so our (compositor) labels aren't needed on the GL side.
const SATELLITE_STYLE = {
  version: 8,
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  sources: {
    satellite: {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256, maxzoom: 18,
      attribution: 'Imagery © Esri, Maxar, Earthstar Geographics',
    },
  },
  layers: [
    { id: 'bg', type: 'background', paint: { 'background-color': '#06101f' } },
    { id: 'satellite', type: 'raster', source: 'satellite', paint: { 'raster-fade-duration': 0 } },
  ],
};
// Resolve a style menu value to a URL or an inline spec.
function styleSpec(value) { return value === 'satellite' ? SATELLITE_STYLE : value; }

function initMap() {
  const initial = styleSpec(settings.style);
  const inline = typeof initial !== 'string';
  map = new maplibregl.Map({
    container: 'map',
    // An inline style object passed to the constructor can silently fail to
    // fire `load` in this build, so start from a trivial style that always
    // loads and swap to the real one below.
    style: inline ? { version: 8, sources: {}, layers: [] } : initial,
    center: [80, 25],
    zoom: 2.2,
    pitch: settings.pitch ? 50 : 0,
    preserveDrawingBuffer: true,   // needed so recording can drawImage the map
    attributionControl: { compact: true },
    maxTileCacheSize: 4096,   // keep prewarmed route tiles in memory
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
  // style.load fires for every style (initial + each switch) — always (re)add
  // our layers; if the style reports "not done loading", retry on styledata.
  const ensureLayers = () => {
    try { applyProjection(); addLayers(); refreshRoutePreview(); refreshRegions(); applyRegionStyle(); refreshArrowsEdit(); }
    catch (e) { map.once('styledata', ensureLayers); }
  };
  map.on('style.load', () => { ensureLayers(); fitToStops(true); });
  map.on('click', (e) => { if (!arrowClick(e.lngLat.lng, e.lngLat.lat)) addStopAt(e.lngLat.lng, e.lngLat.lat); });
  // diff:false forces a full (re)load so style.load fires and our layers re-add
  if (inline) map.once('load', () => map.setStyle(initial, { diff: false }));
}

function applyProjection() {
  try { map.setProjection({ type: settings.globe ? 'globe' : 'mercator' }); } catch (e) { /* older browsers */ }
  applySky();
}

// Subtle atmosphere so the globe (and tilted views) read as a lit planet.
function applySky() {
  try {
    if (!map.setSky) return;
    map.setSky({
      'sky-color': '#0a1626',
      'horizon-color': '#16324c',
      'fog-color': '#0e1116',
      'sky-horizon-blend': 0.6,
      'horizon-fog-blend': 0.5,
      'fog-ground-blend': 0.4,
      'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 0.9, 4, 0.5, 6, 0.2, 8, 0],
    });
  } catch (e) { /* sky unsupported on this build */ }
}

// Resolves when the current viewport's tiles are in (or after a timeout).
function waitForTiles(timeoutMs = 5000) {
  return new Promise(resolve => {
    if (map.areTilesLoaded() && map.loaded()) return resolve();
    let t = setTimeout(done, timeoutMs);
    function check() { if (map.areTilesLoaded()) done(); }
    function done() {
      clearTimeout(t);
      map.off('sourcedata', check); map.off('idle', done);
      resolve();
    }
    map.on('sourcedata', check);
    map.on('idle', done);
  });
}

// Coloured countries / provinces (one GeoJSON source, colour per feature),
// under a faint dashed plan of the visiting order that only shows while editing.
function addLayers() {
  if (!map.getSource('regions')) map.addSource('regions', { type: 'geojson', data: EMPTY, tolerance: 0.2 });
  if (!map.getSource('route-bg')) map.addSource('route-bg', { type: 'geojson', data: EMPTY });

  const ensure = (lid, def) => { if (!map.getLayer(lid)) map.addLayer(def); };
  ensure('regions-fill', { id: 'regions-fill', type: 'fill', source: 'regions',
    paint: { 'fill-color': ['get', 'color'], 'fill-opacity': settings.fillOpacity, 'fill-antialias': true } });
  ensure('regions-line', { id: 'regions-line', type: 'line', source: 'regions',
    layout: { 'line-join': 'round', visibility: settings.borders ? 'visible' : 'none' },
    paint: { 'line-color': ['get', 'color'], 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 1.2, 6, 2.4], 'line-opacity': 0.95 } });
  ensure('route-bg', { id: 'route-bg', type: 'line', source: 'route-bg',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': '#9aa6b2', 'line-width': 2, 'line-opacity': 0.28, 'line-dasharray': [1.5, 2.5] } });
  if (!map.getSource('arrows-edit')) map.addSource('arrows-edit', { type: 'geojson', data: EMPTY });
  ensure('arrows-edit', { id: 'arrows-edit', type: 'line', source: 'arrows-edit', filter: ['==', ['geometry-type'], 'LineString'],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': ['get', 'color'], 'line-width': 4, 'line-opacity': 0.9, 'line-dasharray': [2, 1.2] } });
  ensure('arrows-edit-pt', { id: 'arrows-edit-pt', type: 'circle', source: 'arrows-edit', filter: ['==', ['geometry-type'], 'Point'],
    paint: { 'circle-radius': 6, 'circle-color': '#ffffff', 'circle-stroke-color': '#d62828', 'circle-stroke-width': 3 } });

  applySky();
}

function setSrc(sid, data) { const s = map.getSource(sid); if (s) s.setData(data); }

function refreshRoutePreview() {
  if (!map || !map.getSource('route-bg')) return;
  const feats = [];
  for (let i = 1; i < stops.length; i++) {
    feats.push(line(legCoords([stops[i - 1].lng, stops[i - 1].lat], [stops[i].lng, stops[i].lat])));
  }
  setSrc('route-bg', { type: 'FeatureCollection', features: feats });
}

// Padding that never exceeds what the canvas can absorb (small preview panes).
function fitPadding(want) {
  const c = map.getCanvas();
  const cap = Math.floor(Math.min(c.clientWidth, c.clientHeight) * 0.18);
  return clamp(Math.min(want, cap), 12, 140);
}

// Stop coordinates with longitudes unwrapped along travel order, so bounds
// around a dateline-crossing trip frame the short side of the world.
function unwrappedStops() {
  if (!stops.length) return [];
  let lng = stops[0].lng;
  const out = [[lng, stops[0].lat]];
  for (let i = 1; i < stops.length; i++) {
    lng += shortestDelta(lng, stops[i].lng);
    out.push([lng, stops[i].lat]);
  }
  return out;
}

function fitToStops(instant) {
  if (!map || stops.length === 0) return;
  if (stops.length === 1) { map.jumpTo({ center: [stops[0].lng, stops[0].lat], zoom: 8 }); return; }
  const b = new maplibregl.LngLatBounds();
  unwrappedStops().forEach(c => b.extend(c));
  map.fitBounds(b, { padding: fitPadding(90), duration: instant ? 0 : 700, pitch: settings.pitch ? 50 : 0 });
}

/* ============================================================ stops UI */
function esc(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderStops() {
  const ol = $('#stops'); ol.innerHTML = '';
  if (!stops.length) {
    ol.innerHTML = `<li class="empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/></svg>
      <b>No places yet</b>Search a place above, click the map, or import a project file.</li>`;
  }
  stops.forEach((s, i) => {
    const li = document.createElement('li');
    li.className = 'stop';
    li.dataset.id = s.id;
    const note = noteRow(s);
    li.innerHTML = `
      <div class="top">
        <div class="idx" title="Drag to reorder">${i + 1}</div>
        ${s.photoUrl ? `<img class="thumb" src="${esc(s.photoUrl)}" alt="" />` : ''}
        <div class="name" data-rename="${s.id}" title="Click to rename">${esc(s.name)}</div>
        <button class="mini ${s.photoUrl ? 'on' : ''}" data-photo="${s.id}" title="${s.photoUrl ? 'Replace photo' : 'Attach photo'}">${svgIcon('camera')}</button>
        <button class="mini ${s.note && s.note.trim() ? 'on' : ''}" data-note="${s.id}" title="${s.note ? 'Edit note' : 'Add a note'}">${svgIcon('note')}</button>
        <button class="mini" data-up="${s.id}" title="Move up">${svgIcon('up')}</button>
        <button class="mini" data-down="${s.id}" title="Move down">${svgIcon('down')}</button>
        <button class="mini" data-del="${s.id}" title="Remove">${svgIcon('x')}</button>
      </div>${note ? `<div class="note-row">${note}</div>` : ''}`;
    ol.appendChild(li);
  });
  $('#stop-count').textContent = stops.length;

  ol.querySelectorAll('[data-del]').forEach(b => b.onclick = () => { stops = stops.filter(s => s.id !== b.dataset.del); afterStopsChange(); });
  ol.querySelectorAll('[data-up]').forEach(b => b.onclick = () => move(b.dataset.up, -1));
  ol.querySelectorAll('[data-down]').forEach(b => b.onclick = () => move(b.dataset.down, 1));
  ol.querySelectorAll('[data-note], [data-note-open]').forEach(b => b.onclick = () => {
    const s = stops.find(x => x.id === (b.dataset.note || b.dataset.noteOpen));
    if (!s) return;
    s._noteOpen = !s._noteOpen;
    renderStops();
    if (s._noteOpen) { const ta = ol.querySelector(`[data-note-input="${s.id}"]`); if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); } }
  });
  ol.querySelectorAll('[data-note-input]').forEach(ta => {
    const s = stops.find(x => x.id === ta.dataset.noteInput);
    ta.oninput = () => {
      s.note = ta.value.slice(0, NOTE_MAX);
      const btn = ol.querySelector(`[data-note="${s.id}"]`);
      if (btn) btn.classList.toggle('on', !!s.note.trim());
    };
    ta.onkeydown = e => { if (e.key === 'Escape') { s._noteOpen = false; renderStops(); } };
  });
  ol.querySelectorAll('[data-photo]').forEach(b => b.onclick = () => {
    photoTargetId = b.dataset.photo;
    $('#file-photo').click();
  });
  ol.querySelectorAll('[data-rename]').forEach(el => el.onclick = () => startRename(el.dataset.rename, el));

  // Drag to reorder — grab the number badge. The ▲▼ buttons stay as the
  // touch/keyboard fallback (HTML5 drag-and-drop is pointer-only).
  ol.querySelectorAll('.stop').forEach(li => {
    li.querySelector('.idx').addEventListener('mousedown', () => { li.draggable = true; });
    li.addEventListener('dragstart', e => {
      li.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', li.dataset.id); } catch (err) { /* Safari */ }
    });
    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
      li.draggable = false;
      commitDomOrder();
    });
  });
  scheduleSave();
  ol.ondragover = e => {
    const dragging = ol.querySelector('.dragging');
    if (!dragging) return;
    e.preventDefault();
    const before = stopBefore(ol, e.clientY);
    if (before == null) ol.appendChild(dragging);
    else if (before !== dragging) ol.insertBefore(dragging, before);
  };
}

// note editor when open; otherwise a one-line preview of an existing note
/* ============================================================ menus */
// One popover drives every dropdown (each <select>)
// (kept hidden as the source of truth). Native menus and focus boxes clash
// with the studio look.
let menuOwner = null; // { key, anchor: () => Element, pick: value => void }
function toggleMenu(owner, items, value) {
  if (menuOwner?.key === owner.key) return closeMenu(true);
  closeMenu();
  const el = owner.anchor(); if (!el) return;
  const menu = $('#menu');
  menu.innerHTML = items.map(it => `
    <button class="menu-item ${it.value === value ? 'on' : ''}" role="option" aria-selected="${it.value === value}" data-value="${esc(it.value)}" tabindex="-1">
      ${it.icon ? svgIcon(it.icon) : ''}<span class="menu-label">${esc(it.label)}</span>
      ${it.hint ? `<span class="menu-hint">${esc(it.hint)}</span>` : ''}<span class="tick">${it.value === value ? svgIcon('check') : ''}</span>
    </button>`).join('');
  menu.classList.remove('hidden');
  const r = el.getBoundingClientRect();
  menu.style.minWidth = `${Math.max(178, r.width)}px`;
  const h = menu.offsetHeight, w = menu.offsetWidth;
  const below = r.bottom + 6 + h <= innerHeight - 8;
  menu.classList.toggle('up', !below);
  menu.style.left = `${Math.max(8, Math.min(r.left, innerWidth - w - 8))}px`;
  menu.style.top = `${below ? r.bottom + 6 : Math.max(8, r.top - 6 - h)}px`;
  menuOwner = owner;
  el.setAttribute('aria-expanded', 'true');
  (menu.querySelector('.on') || menu.firstElementChild).focus({ preventScroll: true });
}
function closeMenu(refocus) {
  if (!menuOwner) return;
  const el = menuOwner.anchor();
  if (el) { el.setAttribute('aria-expanded', 'false'); if (refocus) el.focus({ preventScroll: true }); }
  $('#menu').classList.add('hidden');
  menuOwner = null;
}
function pickMenu(value) {
  const owner = menuOwner;
  closeMenu();
  owner.pick(value);
  const el = owner.anchor(); if (el) el.focus({ preventScroll: true });
}
function initMenu() {
  const menu = $('#menu');
  menu.onclick = e => { const it = e.target.closest('.menu-item'); if (it && menuOwner) pickMenu(it.dataset.value); };
  menu.onkeydown = e => {
    const items = [...menu.querySelectorAll('.menu-item')];
    const i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus();
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault(); items[e.key === 'Home' ? 0 : items.length - 1].focus();
    } else if (e.key === 'Escape') { e.preventDefault(); closeMenu(true); }
    else if (e.key === 'Tab') closeMenu(true);
  };
  document.addEventListener('pointerdown', e => {
    if (menuOwner && !e.target.closest('#menu, [aria-haspopup="listbox"]')) closeMenu();
  });
  // the menu is position:fixed, so anything that moves its anchor closes it
  $('#sidebar').addEventListener('scroll', () => closeMenu(), true);
  window.addEventListener('resize', () => closeMenu());
  document.querySelectorAll('#sidebar select:not(.sr-only)').forEach(enhanceSelect);
}
// Swap a <select> for a button that opens the shared menu. The select stays
// in the DOM (hidden) so existing change handlers and .value keep working.
// Option text "Name — hint" shows the hint dimmed.
function enhanceSelect(sel) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'select-btn';
  btn.dataset.select = sel.id;
  btn.setAttribute('aria-haspopup', 'listbox');
  btn.setAttribute('aria-expanded', 'false');
  const lbl = sel.closest('.field')?.querySelector('.lbl');
  if (lbl) btn.setAttribute('aria-label', lbl.textContent.trim());
  btn.innerHTML = `<span class="select-val"></span><span class="select-hint"></span>${svgIcon('chev')}`;
  sel.after(btn);
  sel.classList.add('sr-only'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
  btn.onclick = () => toggleMenu({
    key: sel.id,
    anchor: () => btn,
    pick: v => { if (sel.value !== v) { sel.value = v; sel.dispatchEvent(new Event('change', { bubbles: true })); } syncSelect(sel); },
  }, [...sel.options].map(o => { const [label, hint] = o.text.split(' — '); return { value: o.value, label, hint }; }), sel.value);
  syncSelect(sel);
}
function syncSelect(sel) {
  const btn = $(`[data-select="${sel.id}"]`); if (!btn) return;
  const [label, hint = ''] = (sel.selectedOptions[0]?.text || '').split(' — ');
  btn.querySelector('.select-val').textContent = label;
  btn.querySelector('.select-hint').textContent = hint;
}

const NOTE_MAX = 500;
function noteRow(s) {
  if (s._noteOpen) {
    return `<textarea class="note-input" data-note-input="${s.id}" rows="2" maxlength="${NOTE_MAX}" placeholder="Add a note — shown on the photo, or beside the stop">${esc(s.note || '')}</textarea>`;
  }
  return s.note && s.note.trim() ? `<div class="note-preview" data-note-open="${s.id}" title="Edit note">${esc(s.note)}</div>` : '';
}

// first stop whose midpoint is below the pointer — the drop lands above it
function stopBefore(ol, y) {
  for (const el of ol.querySelectorAll('.stop:not(.dragging)')) {
    const r = el.getBoundingClientRect();
    if (y < r.top + r.height / 2) return el;
  }
  return null;
}

// adopt the order the user dropped the rows into
function commitDomOrder() {
  const byId = new Map(stops.map(s => [s.id, s]));
  const next = [...$('#stops').querySelectorAll('.stop')].map(li => byId.get(li.dataset.id)).filter(Boolean);
  if (next.length !== stops.length) return renderStops();
  const changed = next.some((s, i) => s !== stops[i]);
  stops = next;
  if (changed) afterStopsChange(); else renderStops();
}

// click a stop name to rename it in place
function startRename(sid, nameEl) {
  const s = stops.find(x => x.id === sid);
  if (!s) return;
  const li = nameEl.closest('.stop');
  li.draggable = false;
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'name-edit';
  input.value = s.name;
  nameEl.replaceWith(input);
  input.focus(); input.select();
  let closed = false;
  const close = save => {
    if (closed) return;
    closed = true;
    const v = input.value.trim();
    if (save && v) s.name = v;
    renderStops();
  };
  input.onblur = () => close(true);
  input.onkeydown = e => {
    if (e.key === 'Enter') { e.preventDefault(); close(true); }
    else if (e.key === 'Escape') { e.preventDefault(); close(false); }
  };
}
function move(sid, dir) {
  const i = stops.findIndex(s => s.id === sid); const j = i + dir;
  if (j < 0 || j >= stops.length) return;
  [stops[i], stops[j]] = [stops[j], stops[i]];
  afterStopsChange();
}
function afterStopsChange() { renderStops(); renderArrows(); refreshRoutePreview(); fitToStops(false); }

function addStopAt(lng, lat, name) {
  const s = { id: id(), name: name || `${lat.toFixed(3)}, ${lng.toFixed(3)}`, lng, lat };
  stops.push(s);
  afterStopsChange();
  if (!name) reverseName(s);
  return s;
}
async function reverseName(s) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${s.lat}&lon=${s.lng}`, { headers: { 'Accept-Language': 'en' } });
    const j = await r.json();
    const a = j.address || {};
    s.name = a.city || a.town || a.village || a.county || a.state || j.name || s.name;
    renderStops();
  } catch (e) { /* keep coords as name */ }
}

/* ---- search / geocode ---- */
async function geocodeOne(q) {
  const r = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(q)}`, { headers: { 'Accept-Language': 'en' } });
  const j = await r.json();
  return j[0];
}

async function doSearch() {
  const q = $('#inp-search').value.trim();
  if (!q) return;
  loading(true, 'Searching…');
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&q=${encodeURIComponent(q)}`, { headers: { 'Accept-Language': 'en' } });
    const list = await r.json();
    loading(false);
    if (!list.length) { toast('No places found.'); return; }
    const box = $('#search-results'); box.innerHTML = '';
    list.forEach(p => {
      const d = document.createElement('div');
      d.textContent = p.display_name;
      d.onclick = () => {
        box.classList.add('hidden');
        $('#inp-search').value = '';
        addStopAt(parseFloat(p.lon), parseFloat(p.lat), p.display_name.split(',')[0]);
      };
      box.appendChild(d);
    });
    box.classList.remove('hidden');
  } catch (e) { loading(false); toast('Search failed — check your connection.'); }
}

/* ============================================================ route builders */
async function buildFromText() {
  const raw = $('#inp-trip').value.trim();
  if (!raw) { toast('Type some places first, e.g. "Lumbini, Kathmandu, Lhasa".'); return; }
  const tokens = raw
    .split(/\n|→|->|—>|,|;|、|，|\bthen\b|\bto\b|到|去|再到/i)
    .map(t => t.trim()).filter(Boolean);
  if (!tokens.length) return;

  const parsed = tokens.map(place => ({ place }));

  loading(true, `Geocoding 0/${parsed.length}…`);
  const found = [];
  for (let i = 0; i < parsed.length; i++) {
    loading(true, `Geocoding ${i + 1}/${parsed.length} — ${parsed[i].place}`);
    try {
      const hit = await geocodeOne(parsed[i].place);
      if (hit) found.push({ ...parsed[i], lng: parseFloat(hit.lon), lat: parseFloat(hit.lat), name: hit.display_name.split(',')[0] });
      else toast(`Couldn't find "${parsed[i].place}" — skipped.`);
    } catch (e) { toast(`Lookup failed for "${parsed[i].place}".`); }
    if (i < parsed.length - 1) await sleep(1050); // Nominatim: max 1 req/s
  }
  loading(false);
  if (found.length < 2) { toast('Need at least two recognizable places.'); return; }

  stops = found.map(f => ({ id: id(), name: f.name, lng: f.lng, lat: f.lat }));
  afterStopsChange();
  toast(`Added ${stops.length} places from your text.`);
}

/* ---- GPX / KML / GeoJSON import ---- */
function importRouteFile(file) {
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const text = rd.result;
      let pts = [], meta = null;
      if (/\.gpx$/i.test(file.name)) pts = parseGPX(text);
      else if (/\.kml$/i.test(file.name)) pts = parseKML(text);
      else ({ points: pts, meta } = parseGeoJSON(text));
      if (!pts.length) { toast('No usable points found in that file.'); return; }
      if (!meta) pts = samplePoints(pts, 30);   // a TripTrail export keeps every stop
      loadStops(pts, meta);
      stops.filter(s => /^[\d.,\s-]+$/.test(s.name)).slice(0, 5).forEach((s, i) => setTimeout(() => reverseName(s), i * 1100));
      toast(meta ? `Loaded ${stops.length} places${regions.length ? ` and ${regions.length} coloured areas` : ''}.` : `Imported ${stops.length} places from ${file.name}.`);
    } catch (e) { toast('Could not parse that file.'); }
  };
  rd.readAsText(file);
}
function parseGPX(text) {
  const doc = new DOMParser().parseFromString(text, 'text/xml');
  let els = [...doc.querySelectorAll('wpt')];
  if (!els.length) els = [...doc.querySelectorAll('trkpt')];
  if (!els.length) els = [...doc.querySelectorAll('rtept')];
  return els.map(e => ({
    lat: parseFloat(e.getAttribute('lat')), lng: parseFloat(e.getAttribute('lon')),
    name: e.querySelector('name') ? e.querySelector('name').textContent.trim() : '',
  })).filter(p => isFinite(p.lat) && isFinite(p.lng));
}
function parseKML(text) {
  const doc = new DOMParser().parseFromString(text, 'text/xml');
  const out = [];
  doc.querySelectorAll('Placemark').forEach(pm => {
    const nameEl = pm.querySelector('name');
    const name = nameEl ? nameEl.textContent.trim() : '';
    const point = pm.querySelector('Point > coordinates');
    if (point) {
      const [lng, lat] = point.textContent.trim().split(',').map(parseFloat);
      if (isFinite(lat) && isFinite(lng)) out.push({ lat, lng, name });
      return;
    }
    const lineEl = pm.querySelector('LineString > coordinates');
    if (lineEl) {
      lineEl.textContent.trim().split(/\s+/).forEach(c => {
        const [lng, lat] = c.split(',').map(parseFloat);
        if (isFinite(lat) && isFinite(lng)) out.push({ lat, lng, name: '' });
      });
    }
  });
  return out;
}
// Imported files are untrusted: only inline raster images are accepted as
// photos (a remote URL would make the page fetch from an arbitrary host).
const SAFE_PHOTO = /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/;

function parseGeoJSON(text) {
  const j = JSON.parse(text);
  const feats = j.type === 'FeatureCollection' ? j.features : [j];
  const out = [];
  feats.forEach(f => {
    const g = f.geometry || f;
    const p = f.properties || {};
    const name = String(p.name || p.title || '').slice(0, 120);
    const noteSrc = p.note ?? p.description;
    const note = typeof noteSrc === 'string' ? noteSrc.slice(0, NOTE_MAX) : '';
    const photo = typeof p.photo === 'string' && SAFE_PHOTO.test(p.photo) ? p.photo : null;
    if (!g) return;
    if (g.type === 'Point') out.push({ lng: g.coordinates[0], lat: g.coordinates[1], name, note, photo });
    if (g.type === 'LineString') g.coordinates.forEach(c => out.push({ lng: c[0], lat: c[1], name: '' }));
    if (g.type === 'MultiPoint') g.coordinates.forEach(c => out.push({ lng: c[0], lat: c[1], name, note }));
  });
  // our own project files carry a `historymap` member; TripTrail files a `triptrail` one
  const m = j && (j.historymap || j.triptrail);
  const meta = m && typeof m === 'object' ? m : null;
  return { points: out.filter(p => isFinite(p.lat) && isFinite(p.lng)), meta };
}
/* ---- trip persistence: autosave + GeoJSON export share one serializer ---- */
const SAVE_KEY = 'historymap:project';
const SETTING_KEYS = ['style', 'aspect', 'accent', 'globe', 'pitch', 'labels', 'pace', 'title', 'subtitle', 'watermark', 'format', 'quality', 'fillOpacity', 'borders', 'fromSpace', 'zoomHop'];

// Re-encode an attached photo as a JPEG data URL, longest side capped.
function photoData(img, maxSide, quality) {
  const w0 = img.naturalWidth || img.width, h0 = img.naturalHeight || img.height;
  const sc = Math.min(1, maxSide / Math.max(w0, h0));
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w0 * sc)); c.height = Math.max(1, Math.round(h0 * sc));
  const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);   // flatten transparency for JPEG
  g.imageSmoothingQuality = 'high';
  g.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', quality);
}

// The project as a GeoJSON FeatureCollection: one Point per place carrying name,
// note and (optionally) its photo; settings and coloured regions ride in a
// `historymap` member.
function tripToGeoJSON({ photoSide = 0, photoQuality = 0.85 } = {}) {
  syncSettingsFromUI();
  const r6 = v => Math.round(v * 1e6) / 1e6;
  return {
    type: 'FeatureCollection',
    name: settings.title,
    historymap: {
      version: 1,
      settings: Object.fromEntries(SETTING_KEYS.map(k => [k, settings[k]])),
      regions: regions.map(r => ({ id: r.id, kind: r.kind, name: r.name, color: r.color })),
      arrows: arrowsForSave(),
    },
    features: stops.map(s => {
      const props = { name: s.name };
      if (s.note && s.note.trim()) props.note = s.note;
      if (photoSide) {
        if (s.img) props.photo = (s._photoCache ||= {})[photoSide] ||= photoData(s.img, photoSide, photoQuality);
        else if (s._pendingPhoto) props.photo = s._pendingPhoto;   // still decoding after a restore
      }
      return { type: 'Feature', properties: props, geometry: { type: 'Point', coordinates: [r6(s.lng), r6(s.lat)] } };
    }),
  };
}

function exportTrip() {
  if (!stops.length && !regions.length && !arrows.length) { toast('Add some places first.'); return; }
  const fc = tripToGeoJSON({ photoSide: 2048, photoQuality: 0.9 });
  const blob = new Blob([JSON.stringify(fc, null, 1)], { type: 'application/geo+json' });
  const slug = (settings.title || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '') || 'history-map';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${slug}.geojson`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  const n = stops.filter(s => s.img).length;
  toast(`Exported ${stops.length} places${n ? ` and ${n} photo${n > 1 ? 's' : ''}` : ''} — import the file to pick up where you left off.`);
}

// Attach a photo from a blob: or data: URL; the previous blob URL is released.
function attachPhoto(stop, url, onDone) {
  if (url.startsWith('data:')) stop._pendingPhoto = url;
  const img = new Image();
  img.onload = () => {
    if (stop.photoUrl && stop.photoUrl.startsWith('blob:') && stop.photoUrl !== url) URL.revokeObjectURL(stop.photoUrl);
    stop.photoUrl = url; stop.img = img; stop._photoCache = null; stop._pendingPhoto = null;
    renderStops();
    if (onDone) onDone(true);
  };
  img.onerror = () => {
    stop._pendingPhoto = null;
    if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    if (onDone) onDone(false);
  };
  img.src = url;
}

// Replace the trip with parsed points (any import format, or the autosave).
function loadStops(points, meta) {
  for (const s of stops) if (s.photoUrl && s.photoUrl.startsWith('blob:')) URL.revokeObjectURL(s.photoUrl);
  stops = points.map(p => ({
    id: id(), name: p.name || `${p.lat.toFixed(3)}, ${p.lng.toFixed(3)}`, lng: p.lng, lat: p.lat,
    note: p.note || '',
  }));
  points.forEach((p, i) => { if (p.photo) attachPhoto(stops[i], p.photo); });
  if (meta && meta.settings && typeof meta.settings === 'object') applySettings(meta.settings);
  if (meta && Array.isArray(meta.regions)) setRegions(meta.regions);
  if (meta) setArrows(Array.isArray(meta.arrows) ? meta.arrows : []);
  afterStopsChange();
}

// Apply validated settings (from an import or the autosave) to state and form.
function applySettings(src) {
  const has = (sel, v) => [...$(sel).options].some(o => o.value === String(v));
  const next = {};
  for (const k of SETTING_KEYS) if (k in src && typeof src[k] === typeof settings[k]) next[k] = src[k];
  if ('style' in next && !has('#sel-style', next.style)) delete next.style;
  if ('aspect' in next && !has('#sel-aspect', next.aspect)) delete next.aspect;
  if ('format' in next && !has('#sel-format', next.format)) delete next.format;
  if ('quality' in next && ![1, 2].includes(next.quality)) delete next.quality;
  if ('accent' in next && !/^#[0-9a-f]{6}$/i.test(next.accent)) delete next.accent;
  if ('pace' in next) next.pace = clamp(next.pace, 0.4, 2.2) || 1;
  if ('fillOpacity' in next) next.fillOpacity = clamp(next.fillOpacity, 0.15, 0.85) || 0.45;
  for (const k of ['title', 'subtitle', 'watermark']) if (k in next) next[k] = next[k].slice(0, 120);
  const styleChanged = 'style' in next && next.style !== settings.style;
  Object.assign(settings, next);

  $('#inp-title').value = settings.title; $('#inp-subtitle').value = settings.subtitle;
  $('#inp-watermark').value = settings.watermark; $('#inp-accent').value = settings.accent;
  $('#sel-style').value = settings.style; $('#sel-aspect').value = settings.aspect;
  $('#sel-format').value = settings.format; $('#sel-quality').value = String(settings.quality);
  $('#rng-pace').value = settings.pace;
  $('#chk-globe').checked = settings.globe; $('#chk-pitch').checked = settings.pitch;
  $('#chk-labels').checked = settings.labels;
  $('#rng-fill').value = settings.fillOpacity; $('#chk-borders').checked = settings.borders;
  $('#chk-space').checked = settings.fromSpace; $('#chk-hop').checked = settings.zoomHop;
  syncControls();
  layoutStage();
  if (!map) return;                 // boot: initMap() reads settings directly
  if (styleChanged) map.setStyle(styleSpec(settings.style), { diff: false });   // style.load re-applies the rest
  else { applyProjection(); applyAccent(); applyRegionStyle(); }
}

let saveTimer = null, savedWithoutPhotos = false, restoring = false;
function scheduleSave() {
  if (restoring) return;
  clearTimeout(saveTimer);
  setSaveState('saving', 'Saving…');
  saveTimer = setTimeout(saveTrip, 600);
}
function saveTrip() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(tripToGeoJSON({ photoSide: 1024, photoQuality: 0.82 })));
    savedWithoutPhotos = false;
    setSaveState('', 'Saved');
  } catch (e) {
    // over quota with photos: keep everything else, and say so once
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(tripToGeoJSON()));
      setSaveState('warn', 'Saved without photos');
      if (!savedWithoutPhotos) { savedWithoutPhotos = true; toast('Photos are too large to autosave — use Export to keep them.'); }
    } catch (e2) { setSaveState('off', 'Autosave unavailable'); }
  }
}
function restoreTrip() {
  let raw = null;
  try { raw = localStorage.getItem(SAVE_KEY); } catch (e) { return; }
  if (!raw) return;
  restoring = true;
  try {
    const { points, meta } = parseGeoJSON(raw);
    if (points.length || meta) loadStops(points, meta);
  } catch (e) { console.warn('saved project unreadable, starting fresh:', e); }
  restoring = false;
}

function samplePoints(pts, max) {
  if (pts.length <= max) return pts;
  const out = [];
  for (let i = 0; i < max; i++) out.push(pts[Math.round(i * (pts.length - 1) / (max - 1))]);
  return out;
}

// Uniformly reduce a coordinate list to at most `max` points (keeps endpoints).
// The rendered trail must stay light — a 50k-vertex line re-projected every
// frame (esp. on globe) drops playback to a slideshow.
function decimate(coords, max) {
  if (coords.length <= max) return coords;
  const out = [coords[0]];
  const step = (coords.length - 1) / (max - 1);
  for (let i = 1; i < max - 1; i++) out.push(coords[Math.round(i * step)]);
  out.push(coords[coords.length - 1]);
  return out;
}

/* ============================================================ coloured regions
   Countries and provinces come from data/ (Natural Earth 1:10m, built from the
   studio's QGIS GeoPackage by scripts/historymap_data.py). Provinces load per
   country on demand. All selected areas live in ONE `regions` source with a
   colour per feature; they show for the whole video and fade in on the intro. */
const REGION_PALETTE = ['#e0533d', '#f2a541', '#3d7dca', '#5aa469', '#9b5de5', '#d6457c', '#2a9d8f', '#c9a227', '#7d8597', '#e76f51'];
let regionIndexPromise = null, regionsReady = Promise.resolve(), regionsGen = 0, regionAlpha = 1;
let regionBounds = null;   // [[w,s],[e,n]] of the coloured areas, so the overview frames them
const geoCache = {};

function loadRegionIndex() {
  if (!regionIndexPromise) {
    regionIndexPromise = fetch('data/index.json').then(r => r.json())
      .catch(e => { regionIndexPromise = null; throw e; });
  }
  return regionIndexPromise;
}
function loadGeo(path) {
  if (!geoCache[path]) {
    geoCache[path] = fetch(path).then(r => r.json())
      .then(fc => new Map(fc.features.map(f => [f.properties.id, f])))
      .catch(e => { delete geoCache[path]; throw e; });
  }
  return geoCache[path];
}
function regionFile(r) {
  if (r.kind === 'country') return 'data/countries.geojson';
  if (r.kind === 'historical') return `data/historical/${r.id.split(':')[0]}.geojson`;
  return `data/provinces/${r.id.split(':')[0]}.geojson`;
}
const REGION_ORDER = { historical: 0, country: 1, province: 2 };   // later draws on top

// Push the selected areas to the map (countries first so provinces draw on top).
function refreshRegions() {
  const gen = ++regionsGen;
  regionsReady = (async () => {
    const feats = [];
    for (const r of [...regions].sort((a, b) => REGION_ORDER[a.kind] - REGION_ORDER[b.kind])) {
      try {
        const f = (await loadGeo(regionFile(r))).get(r.id);
        if (f) feats.push({ type: 'Feature', properties: { color: r.color }, geometry: f.geometry });
      } catch (e) { toast(`Could not load the map data for ${r.name}.`); }
    }
    if (gen !== regionsGen) return;
    regionBounds = null;
    for (const f of feats) for (const poly of f.geometry.coordinates) for (const [x, y] of poly[0]) {
      if (!regionBounds) regionBounds = [[x, y], [x, y]];
      regionBounds[0][0] = Math.min(regionBounds[0][0], x); regionBounds[0][1] = Math.min(regionBounds[0][1], y);
      regionBounds[1][0] = Math.max(regionBounds[1][0], x); regionBounds[1][1] = Math.max(regionBounds[1][1], y);
    }
    if (map && map.getSource('regions')) setSrc('regions', { type: 'FeatureCollection', features: feats });
  })();
  return regionsReady;
}
function applyRegionStyle() {
  $('#fill-val').textContent = Math.round(settings.fillOpacity * 100) + '%';
  const r = $('#rng-fill');
  r.style.setProperty('--fill', ((settings.fillOpacity - r.min) / (r.max - r.min) * 100) + '%');
  if (!map || !map.getLayer('regions-fill')) return;
  map.setLayoutProperty('regions-line', 'visibility', settings.borders ? 'visible' : 'none');
  regionAlpha = -1; setRegionAlpha(1);
}
// Per-frame fade (intro); only touches the style when the value changes.
function setRegionAlpha(a) {
  a = Math.round(a * 100) / 100;
  if (a === regionAlpha || !map || !map.getLayer('regions-fill')) return;
  regionAlpha = a;
  map.setPaintProperty('regions-fill', 'fill-opacity', settings.fillOpacity * a);
  map.setPaintProperty('regions-line', 'line-opacity', 0.95 * a);
}

function setRegions(list) {
  const okColor = c => typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c);
  regions = list.filter(r => r && typeof r.id === 'string' && r.kind in REGION_ORDER)
    .slice(0, 300)
    .map((r, i) => ({ id: r.id.slice(0, 40), kind: r.kind, name: String(r.name || r.id).slice(0, 80), color: okColor(r.color) ? r.color : REGION_PALETTE[i % REGION_PALETTE.length] }));
  afterRegionsChange();
}
function afterRegionsChange() { renderRegions(); refreshRegions(); scheduleSave(); }

function addRegion(item) {
  if (regions.some(r => r.id === item.id)) { toast(`${item.name} is already coloured.`); return; }
  if (item.kind === 'historical' && !regions.some(r => r.kind === 'historical')) toast('Historical borders: Cliopatria (CC BY 4.0) — credit it in the video description.', 4500);
  const used = new Set(regions.map(r => r.color));
  const color = REGION_PALETTE.find(c => !used.has(c)) || REGION_PALETTE[regions.length % REGION_PALETTE.length];
  regions.push({ id: item.id, kind: item.kind, name: item.name, color });
  afterRegionsChange();
}

function renderRegions() {
  const ul = $('#regions'); ul.innerHTML = '';
  regions.forEach(r => {
    const li = document.createElement('li');
    li.className = 'region';
    li.innerHTML = `
      <label class="swatch-in" style="background:${r.color}" title="Change colour"><input type="color" value="${r.color}" data-rcolor="${esc(r.id)}" aria-label="Colour of ${esc(r.name)}" /></label>
      <span class="rname" title="${esc(r.name)}">${esc(r.name)}</span>
      <span class="rkind">${r.kind === 'country' ? 'Country' : r.kind === 'province' ? 'Province' : r.id.split(':')[0]}</span>
      <button class="mini" data-rdel="${esc(r.id)}" title="Remove">${svgIcon('x')}</button>`;
    ul.appendChild(li);
  });
  $('#region-count').textContent = regions.length;
  ul.querySelectorAll('[data-rdel]').forEach(b => b.onclick = () => { regions = regions.filter(r => r.id !== b.dataset.rdel); afterRegionsChange(); });
  ul.querySelectorAll('[data-rcolor]').forEach(inp => {
    inp.oninput = () => {
      const r = regions.find(x => x.id === inp.dataset.rcolor); if (!r) return;
      r.color = inp.value; inp.parentElement.style.background = r.color;
      refreshRegions();
    };
    inp.onchange = () => scheduleSave();
  });
}

// Search names locally: countries first, then provinces ("Bihar · India").
async function searchRegions(q) {
  const box = $('#region-results');
  q = q.trim().toLowerCase();
  if (q.length < 2) { box.classList.add('hidden'); return; }
  let idx;
  try { idx = await loadRegionIndex(); } catch (e) { toast('Could not load the country list (data/index.json).'); return; }
  if ($('#inp-region').value.trim().toLowerCase() !== q) return;   // a newer keystroke won
  const rank = n => { n = n.toLowerCase(); return n === q ? 0 : n.startsWith(q) ? 1 : n.includes(q) ? 2 : 9; };
  const hits = [
    ...(idx.historical || []).map(h => ({ id: h.id, kind: 'historical', name: h.name, hint: `${h.year} borders`, r: String(h.year) === q ? 2 : rank(h.name) })),
    ...idx.countries.map(c => ({ id: c.id, kind: 'country', name: c.name, hint: 'country', r: rank(c.name) })),
    ...idx.provinces.map(p => ({ id: p.id, kind: 'province', name: p.name, hint: p.country, r: Math.min(rank(p.name), rank(p.country) < 2 ? 3 : 9) })),
  ].filter(h => h.r < 9).sort((a, b) => a.r - b.r || REGION_ORDER[a.kind] - REGION_ORDER[b.kind] || a.name.localeCompare(b.name)).slice(0, 60);
  box.innerHTML = '';
  if (!hits.length) { box.innerHTML = '<div class="rhint">No country or province by that name.</div>'; box.classList.remove('hidden'); return; }
  hits.forEach(h => {
    const d = document.createElement('div');
    d.innerHTML = `${esc(h.name)}<span class="rhint">${esc(h.hint)}</span>`;
    d.onclick = () => { box.classList.add('hidden'); $('#inp-region').value = ''; addRegion(h); };
    if (h.kind === 'historical') d.title = 'Cliopatria, Seshat Global History Databank (CC BY 4.0)';
    box.appendChild(d);
  });
  box.classList.remove('hidden');
}
function wireRegions() {
  const inp = $('#inp-region');
  inp.addEventListener('input', () => searchRegions(inp.value));
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') { const first = $('#region-results div:not(.rhint)'); if (first) first.click(); }
    if (e.key === 'Escape') $('#region-results').classList.add('hidden');
  });
}

/* ============================================================ arrows
   Attack / movement arrows. Picked with two map clicks, edited in the sidebar,
   drawn by the compositor (so they grow smoothly in the export) and shown as a
   dashed preview line while editing. */
const ARROW_PALETTE = ['#d62828', '#f77f00', '#fcbf49', '#3a86ff', '#2a9d8f', '#9b5de5'];
let arrowPick = null;   // null | { from: [lng,lat] | null }

function arrowCurve(a) {
  // gentle bend so arrows read as movement, via the short side of the world
  return arcLine(a.from, [a.from[0] + shortestDelta(a.from[0], a.to[0]), a.to[1]], 0.12, 48);
}
function refreshArrowsEdit() {
  if (!map || !map.getSource('arrows-edit')) return;
  const feats = anim.playing ? [] : arrows.map(a => ({ type: 'Feature', properties: { color: a.color }, geometry: { type: 'LineString', coordinates: arrowCurve(a) } }));
  if (!anim.playing && arrowPick && arrowPick.from) feats.push({ type: 'Feature', properties: { color: '#ffffff' }, geometry: { type: 'Point', coordinates: arrowPick.from } });
  setSrc('arrows-edit', { type: 'FeatureCollection', features: feats });
}
function setArrowPick(on) {
  arrowPick = on ? { from: null } : null;
  document.body.classList.toggle('picking', !!on);
  $('#btn-arrow-label').textContent = on ? 'Click the start point… (Esc to cancel)' : 'Add arrow';
  refreshArrowsEdit();
}
// returns true when the click was used to place an arrow
function arrowClick(lng, lat) {
  if (!arrowPick) return false;
  if (!arrowPick.from) {
    arrowPick.from = [lng, lat];
    $('#btn-arrow-label').textContent = 'Now click the end point…';
    refreshArrowsEdit();
    return true;
  }
  const used = new Set(arrows.map(a => a.color));
  arrows.push({ id: id(), from: arrowPick.from, to: [lng, lat], label: '', at: 'start',
    color: ARROW_PALETTE.find(c => !used.has(c)) || ARROW_PALETTE[arrows.length % ARROW_PALETTE.length] });
  setArrowPick(false);
  afterArrowsChange();
  return true;
}
function setArrows(list) {
  const ok = p => Array.isArray(p) && p.length >= 2 && isFinite(p[0]) && isFinite(p[1]) && Math.abs(p[1]) <= 90;
  arrows = list.filter(a => a && ok(a.from) && ok(a.to)).slice(0, 60).map((a, i) => ({
    id: id(), from: [+a.from[0], +a.from[1]], to: [+a.to[0], +a.to[1]],
    color: typeof a.color === 'string' && /^#[0-9a-f]{6}$/i.test(a.color) ? a.color : ARROW_PALETTE[i % ARROW_PALETTE.length],
    label: typeof a.label === 'string' ? a.label.slice(0, 60) : '',
    // project files store the place by index (stop ids are per-session)
    at: Number.isInteger(a.atPlace) && stops[a.atPlace] ? stops[a.atPlace].id : 'start',
  }));
  afterArrowsChange();
}
function arrowsForSave() {
  return arrows.map(a => {
    const k = stops.findIndex(s => s.id === a.at);
    const r6 = v => Math.round(v * 1e6) / 1e6;
    return { from: a.from.map(r6), to: a.to.map(r6), color: a.color, label: a.label, ...(k >= 0 ? { atPlace: k } : {}) };
  });
}
function afterArrowsChange() { renderArrows(); refreshArrowsEdit(); scheduleSave(); }

function renderArrows() {
  const ul = $('#arrows'); ul.innerHTML = '';
  arrows.forEach((a, i) => {
    if (a.at !== 'start' && !stops.some(s => s.id === a.at)) a.at = 'start';   // its place was removed
    const li = document.createElement('li');
    li.className = 'region arrow-row';
    const opts = [`<option value="start"${a.at === 'start' ? ' selected' : ''}>at the start</option>`,
      ...stops.map((s, k) => `<option value="${s.id}"${a.at === s.id ? ' selected' : ''}>when the camera reaches ${k + 1}. ${esc(s.name)}</option>`)].join('');
    li.innerHTML = `
      <label class="swatch-in" style="background:${a.color}" title="Change colour"><input type="color" value="${a.color}" data-acolor="${a.id}" aria-label="Arrow ${i + 1} colour" /></label>
      <input class="alabel" type="text" maxlength="60" placeholder="Label (optional), e.g. Army Group Centre" value="${esc(a.label)}" data-alabel="${a.id}" />
      <button class="mini" data-adel="${a.id}" title="Remove">${svgIcon('x')}</button>
      <div class="awhen">Draws<select data-aat="${a.id}" aria-label="When arrow ${i + 1} draws">${opts}</select></div>`;
    ul.appendChild(li);
  });
  $('#arrow-count').textContent = arrows.length;
  const find = el => arrows.find(a => a.id === (el.dataset.acolor || el.dataset.alabel || el.dataset.adel || el.dataset.aat));
  ul.querySelectorAll('[data-adel]').forEach(b => b.onclick = () => { arrows = arrows.filter(a => a.id !== b.dataset.adel); afterArrowsChange(); });
  ul.querySelectorAll('[data-acolor]').forEach(inp => {
    inp.oninput = () => { const a = find(inp); a.color = inp.value; inp.parentElement.style.background = a.color; refreshArrowsEdit(); };
    inp.onchange = () => scheduleSave();
  });
  ul.querySelectorAll('[data-alabel]').forEach(inp => inp.oninput = () => { find(inp).label = inp.value.slice(0, 60); scheduleSave(); });
  ul.querySelectorAll('[data-aat]').forEach(sel => sel.onchange = () => { find(sel).at = sel.value; scheduleSave(); });
}
function wireArrows() {
  $('#btn-arrow').onclick = () => setArrowPick(!arrowPick);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && arrowPick) setArrowPick(false); });
}

/* ============================================================ precompute legs */
function precomputeLegs() {
  anim.legs = [];
  const unwrapped = unwrappedStops();
  for (let i = 1; i < stops.length; i++) {
    const from = stops[i - 1], to = stops[i];
    const A = unwrapped[i - 1], B = unwrapped[i];
    const coords = legCoords(A, B);
    const path = buildPath(coords);
    const b = new maplibregl.LngLatBounds(); coords.forEach(c => b.extend(c));
    const cam = map.cameraForBounds(b, { padding: fitPadding(settings.aspect === '9:16' ? 120 : 90) });
    anim.legs.push({ from, to, path, zoom: clamp((cam && cam.zoom ? cam.zoom : 5) + 0.15, 2, 11), dist: path.total });
  }
  // Full concatenated camera path, measured in Mercator units so the camera
  // glides at an even on-screen speed regardless of latitude.
  anim.fullCoords = [];
  const legStart = [], legLen = [];
  const maxPerLeg = clamp(Math.floor(2200 / anim.legs.length), 80, 600);
  for (const leg of anim.legs) {
    const dc = decimate(leg.path.coords, maxPerLeg);
    legStart.push(anim.fullCoords.length);
    legLen.push(dc.length);
    anim.fullCoords.push(...dc);
  }
  const merc = anim.fullCoords.map(c => { const m = maplibregl.MercatorCoordinate.fromLngLat([c[0], c[1]]); return [m.x, m.y]; });
  const mcum = [0];
  for (let i = 1; i < merc.length; i++) mcum.push(mcum[i - 1] + Math.hypot(merc[i][0] - merc[i - 1][0], merc[i][1] - merc[i - 1][1]));
  anim.mcum = mcum;
  anim.mtotal = mcum[mcum.length - 1] || 1;
  anim.legs.forEach((leg, k) => {
    const s = legStart[k], e = s + legLen[k] - 1;
    leg.pf0 = mcum[s] / anim.mtotal;
    leg.pf1 = mcum[e] / anim.mtotal;
  });
}

// Point at a global Mercator fraction of the full camera path.
function trailPointAt(frac) {
  const cum = anim.mcum, d = clamp(frac, 0, 1) * anim.mtotal;
  let lo = 1, hi = cum.length - 1;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid] < d) lo = mid + 1; else hi = mid; }
  const seg = cum[lo] - cum[lo - 1] || 1, t = (d - cum[lo - 1]) / seg;
  const a = anim.fullCoords[lo - 1], b = anim.fullCoords[lo];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/* ============================================================ tile prewarm */
// "Temporarily offline": before recording, sweep the camera along every hop
// at its cruise zoom so all tiles land in the cache. The real pass then pans
// over already-cached tiles and never stalls.
async function prewarmTiles(token) {
  const c = map.getCanvas();
  // total steps across all legs, for a single smooth progress readout
  const plan = [];
  for (const leg of anim.legs) {
    // km covered by one viewport width at this leg's zoom (web-mercator approx)
    const midLat = leg.path.coords[Math.floor(leg.path.coords.length / 2)][1];
    const kmPerScreen = 40075 * Math.cos(midLat * Math.PI / 180) / Math.pow(2, leg.zoom) * (c.clientWidth / 512);
    const steps = clamp(Math.ceil(leg.path.total / (kmPerScreen * 0.9)), 1, 14);
    plan.push({ leg, steps });
  }
  const total = plan.reduce((s, p) => s + p.steps + 1, 0);
  let done = 0;
  for (const { leg, steps } of plan) {
    for (let j = 0; j <= steps; j++) {
      if (token !== cancelToken) return;
      const { pos } = pointAt(leg.path, j / steps);
      map.jumpTo({ center: pos, zoom: leg.zoom, pitch: settings.globe ? 0 : (settings.pitch ? 22 : 8), bearing: 0 });
      await waitForTiles(700);
      done++;
      loading(true, `Caching map along the camera path… ${Math.round(done / total * 100)}%`);
    }
  }
}

/* ============================================================ animation timeline */
/* ---------------------------------------------------------------
   Time-driven timeline (mult.dev-style engine).
   The whole story is a pure function of elapsed time: paintFrame(t) sets the
   camera, trail reveal, marker, pulse, title/photo/caption — nothing sleeps,
   nothing eases via the map. Preview drives it with rAF at wall-clock speed;
   export steps it frame-by-frame and encodes offline at constant fps, so the
   video is perfectly smooth no matter how fast the machine renders. */

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

// spherical interpolation of a [lng,lat] pair (shortest arc, wrap-safe)
function slerpLL(a, b, t) {
  const toR = Math.PI / 180, toD = 180 / Math.PI;
  const v = p => { const la = p[1] * toR, lo = p[0] * toR; return [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)]; };
  const p0 = v(a), p1 = v(b);
  const th = Math.acos(clamp(p0[0] * p1[0] + p0[1] * p1[1] + p0[2] * p1[2], -1, 1));
  if (th < 1e-5) return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const s = Math.sin(th), w0 = Math.sin((1 - t) * th) / s, w1 = Math.sin(t * th) / s;
  const x = w0 * p0[0] + w1 * p1[0], y = w0 * p0[1] + w1 * p1[1], z = w0 * p0[2] + w1 * p1[2];
  return [Math.atan2(y, x) * toD, Math.atan2(z, Math.hypot(x, y)) * toD];
}

function interpCam(a, b, t) {
  const e = easeInOut(t);
  return { center: slerpLL(a.center, b.center, e), zoom: a.zoom + (b.zoom - a.zoom) * e, pitch: a.pitch + (b.pitch - a.pitch) * e };
}

function overviewCam() {
  // places and arrows set the frame; the coloured areas join in only when
  // they are of a similar size (Tibet around a Nepal trip yes, the whole
  // USSR around three arrows no — that would shrink the story to a speck)
  const b = new maplibregl.LngLatBounds();
  anim.fullCoords.forEach(c => b.extend(c));
  arrows.forEach(a => { b.extend(a.from); b.extend([a.from[0] + shortestDelta(a.from[0], a.to[0]), a.to[1]]); });
  if (regionBounds) {
    const span = bb => bb.isEmpty() ? 0 : Math.max(bb.getEast() - bb.getWest(), (bb.getNorth() - bb.getSouth()) * 1.6);
    const rw = Math.max(regionBounds[1][0] - regionBounds[0][0], (regionBounds[1][1] - regionBounds[0][1]) * 1.6);
    if (b.isEmpty() || rw <= Math.max(4 * span(b), 12)) { b.extend(regionBounds[0]); b.extend(regionBounds[1]); }
  }
  const cf = map.cameraForBounds(b, { padding: fitPadding(90) });
  if (cf && cf.center) {
    const c = maplibregl.LngLat.convert(cf.center);
    return { center: [c.lng, c.lat], zoom: cf.zoom, pitch: 0 };
  }
  const c = map.getCenter();
  return { center: [c.lng, c.lat], zoom: map.getZoom(), pitch: 0 };
}

function buildTimeline() {
  const p = settings.pace;
  const pitchCruise = settings.globe ? 0 : (settings.pitch ? 16 : 0);
  const pitchMax = settings.globe ? 0 : (settings.pitch ? 26 : 8);
  const ov = overviewCam();
  const segs = []; let t = 0;
  const spaceH = map.getCanvas().clientHeight || 600;
  const space = { center: [ov.center[0] - 55, clamp(ov.center[1] * 0.5, -25, 35)], zoom: Math.log2(spaceH / 512) + 0.95, pitch: 0 };
  const add = (type, dur, data) => { segs.push({ type, start: t, end: t + dur, ...data }); t += dur; };

  // reading time for a note: barely scaled by pace, so fast cuts stay legible
  const readMs = st => {
    const n = st.note ? st.note.trim().length : 0;
    return n ? clamp(900 + n * 55, 1400, 4800) / Math.sqrt(p) : 0;
  };
  // hold on an arrived stop: photo card (with its note) or a note bubble
  const hold = (stop, cam, caption, reached) => {
    if (stop.img) add('photo', clamp(2100 / p, 1400, 2600) + readMs(stop), { cam, stop, caption, reached });
    else if (readMs(stop)) add('note', readMs(stop), { cam, stop, caption, reached });
  };

  // arrows draw in their own beat: staggered, then a short hold to read them
  const arrowTimes = {};
  const drawArrows = (list, cam, reached) => {
    if (!list.length) return;
    const draw = clamp(1300 / p, 800, 1800), stagger = clamp(450 / p, 250, 600);
    list.forEach((a, k) => { arrowTimes[a.id] = [t + k * stagger, t + k * stagger + draw]; });
    add('arrows', draw + stagger * (list.length - 1) + clamp(900 / p, 500, 1300), { cam, reached });
  };
  const arrowsAt = sid => arrows.filter(a => a.at === sid || (sid === 'start' && !stops.some(s => s.id === a.at)));

  if (settings.fromSpace) {
    // whole planet first, turned a little away from the story, then an eased
    // dive (spin + zoom together) down to the overview
    add('intro', clamp(5200 / Math.min(p, 1.2), 3800, 6800), { cam: ov, from: space, reached: 1 });
  } else {
    add('intro', clamp(2200 / Math.min(p, 1.2), 1600, 3200), { cam: ov, reached: 1 });
  }
  let prevCam = ov;
  drawArrows([...arrowsAt('start'), ...(stops[0] ? arrowsAt(stops[0].id) : [])], ov, 1);

  if (stops[0] && (stops[0].img || readMs(stops[0])) && anim.legs.length) {
    const pc = { center: [stops[0].lng, stops[0].lat], zoom: anim.legs[0].zoom + 0.55, pitch: pitchCruise };
    add('approach', clamp(750 / p, 350, 950), { a: prevCam, b: pc, caption: '', reached: 1 });
    hold(stops[0], pc, '', 1);
    prevCam = pc;
  }

  anim.legs.forEach((leg, i) => {
    const startCam = { center: trailPointAt(leg.pf0), zoom: leg.zoom, pitch: pitchCruise };
    const endCam = { center: trailPointAt(leg.pf1), zoom: leg.zoom, pitch: pitchCruise };
    const stopCam = { center: endCam.center, zoom: leg.zoom + 0.55, pitch: pitchCruise };
    const caption = '';
    add('approach', clamp(750 / p, 350, 950), { a: prevCam, b: startCam, caption, reached: i + 1 });
    // how far the camera rises mid-hop: a gentle dip, or (zoomHop) most of the
    // way back to the overview so the viewer sees where we are going
    const hop = settings.zoomHop ? clamp((leg.zoom - ov.zoom) * 0.7, 0.4, 2.6) : 0.4;
    add('travel', clamp(2200 + leg.dist * 1.1, 2200, 7000) / p * (settings.zoomHop ? 1.15 : 1), { leg: i, caption, pitchCruise, pitchMax, hop, reached: i + 1 });
    add('arrival', clamp(680 / p, 400, 950), { a: endCam, b: stopCam, leg: i, caption, reached: i + 2 });
    drawArrows(arrowsAt(leg.to.id), stopCam, i + 2);
    hold(leg.to, stopCam, caption, i + 2);
    prevCam = stopCam;
  });

  add('pullback', clamp(1900 / p, 1200, 2600), { a: prevCam, b: ov, reached: stops.length });
  if (settings.fromSpace) {
    add('pullback', clamp(1200 / p, 800, 1600), { a: ov, b: ov, reached: stops.length });      // read the whole story
    add('pullback', clamp(3000 / p, 2200, 3800), { a: ov, b: space, reached: stops.length });  // and rise back to the globe
  }
  return { total: t, segs, arrowTimes };
}

function paintFrame(tl, tMs) {
  const t = clamp(tMs, 0, tl.total - 0.001);
  let seg = tl.segs[tl.segs.length - 1];
  for (const s of tl.segs) { if (t < s.end) { seg = s; break; } }
  const lt = clamp((t - seg.start) / Math.max(1, seg.end - seg.start), 0, 1);
  const key = seg.type + ':' + seg.start;
  const entered = anim._seg !== key; anim._seg = key;

  anim.pulse = null; anim.photo = null; anim.titleAlpha = 0; anim.noteStop = null; anim.noteAlpha = 0;
  anim.reached = seg.reached;
  setRegionAlpha(seg.type !== 'intro' ? 1 : easeInOut(clamp(seg.from ? (lt - 0.3) / 0.45 : lt / 0.7, 0, 1)));
  anim.arrowProg = {};
  for (const [aid, [a0, a1]] of Object.entries(tl.arrowTimes)) anim.arrowProg[aid] = t <= a0 ? 0 : easeInOut(clamp((t - a0) / (a1 - a0), 0, 1));
  let cam;

  if (seg.type === 'intro') {
    anim.phase = 'intro'; anim.caption = ''; anim.marker = null;
    if (seg.from) {
      // title over the turning globe, gone before the dive gets close
      anim.titleAlpha = lt < 0.08 ? lt / 0.08 : (lt > 0.38 ? clamp((0.5 - lt) / 0.12, 0, 1) : 1);
      cam = interpCam(seg.from, seg.cam, lt);
    } else {
      anim.titleAlpha = lt < 0.22 ? lt / 0.22 : (lt > 0.82 ? (1 - lt) / 0.18 : 1);
      cam = seg.cam;
    }
  } else if (seg.type === 'approach') {
    anim.phase = 'pause'; anim.caption = seg.caption; anim.marker = null;
    cam = interpCam(seg.a, seg.b, lt);
  } else if (seg.type === 'travel') {
    const leg = anim.legs[seg.leg];
    anim.phase = 'leg'; anim.caption = seg.caption; anim.legIndex = seg.leg; anim.marker = null;
    const ef = easeInOut(lt), wave = Math.sin(Math.PI * lt);
    const span = leg.pf1 - leg.pf0, frac = leg.pf0 + span * ef;
    const lead = trailPointAt(clamp(frac + 0.2 * wave * span, 0, 1));
    cam = { center: lead, zoom: leg.zoom - seg.hop * wave, pitch: seg.pitchCruise + (seg.pitchMax - seg.pitchCruise) * wave };
  } else if (seg.type === 'arrival') {
    const leg = anim.legs[seg.leg];
    anim.phase = 'pause'; anim.caption = seg.caption; anim.legIndex = seg.leg; anim.marker = null;
    anim.pulse = { lng: leg.to.lng, lat: leg.to.lat, k: easeOutCubic(lt) };
    cam = interpCam(seg.a, seg.b, lt);
  } else if (seg.type === 'arrows') {
    anim.phase = 'pause'; anim.caption = ''; anim.marker = null;
    cam = seg.cam;
  } else if (seg.type === 'photo') {
    anim.phase = 'pause'; anim.caption = seg.caption; anim.marker = null;
    anim.photo = seg.stop.img; anim.photoLabel = seg.stop.name; anim.photoNote = (seg.stop.note || '').trim();
    anim.photoAlpha = lt < 0.16 ? lt / 0.16 : (lt > 0.86 ? (1 - lt) / 0.14 : 1);
    cam = seg.cam;
  } else if (seg.type === 'note') {
    anim.phase = 'pause'; anim.caption = seg.caption; anim.marker = null;
    anim.noteStop = seg.stop;
    anim.noteAlpha = lt < 0.14 ? lt / 0.14 : (lt > 0.88 ? (1 - lt) / 0.12 : 1);
    cam = seg.cam;
  } else { // pullback
    anim.phase = 'outro'; anim.caption = ''; anim.marker = null;
    cam = interpCam(seg.a, seg.b, lt);
  }

  map.jumpTo({ center: cam.center, zoom: cam.zoom, pitch: cam.pitch, bearing: 0 });
}

function runRealtime(tl, token) {
  return new Promise(resolve => {
    const t0 = performance.now();
    function loop(now) {
      if (token !== cancelToken || !anim.playing) return resolve();
      const t = now - t0;
      paintFrame(tl, Math.min(t, tl.total));
      if (t >= tl.total) return resolve();
      tick(loop);
    }
    loop(performance.now());
  });
}

/* ---- offline export: deterministic frame stepping + WebCodecs + mp4 mux ---- */
function mapFrameSettled(maxWaitMs = 900) {
  return new Promise(resolve => {
    let done = false;
    const finish = () => { if (!done) { done = true; clearTimeout(cap); resolve(); } };
    // hard cap: never hang if 'render' doesn't fire (e.g. backgrounded tab)
    const cap = setTimeout(finish, maxWaitMs);
    const t0 = performance.now();
    function attempt() {
      map.once('render', () => {
        if (done) return;
        if (map.areTilesLoaded() || performance.now() - t0 > maxWaitMs) finish();
        else attempt();
      });
      map.triggerRepaint();
    }
    attempt();
  });
}

let muxerModPromise = null;
function loadMuxer() {
  if (!muxerModPromise) {
    muxerModPromise = import('https://cdn.jsdelivr.net/npm/mp4-muxer@5.2.1/+esm')
      .catch(() => import('https://cdn.jsdelivr.net/npm/mp4-muxer@5.2.1/+esm'))   // one retry
      .catch(e => { muxerModPromise = null; throw e; });
  }
  return muxerModPromise;
}

// Decode the music file, loop/trim it to the video length with a closing
// fade, and return a 44.1kHz stereo AudioBuffer ready for AAC encoding.
async function prepareOfflineAudio(totalMs) {
  const el = $('#music');
  if (!el.src) return null;
  if (typeof AudioEncoder === 'undefined') throw new Error('no AudioEncoder');
  const sup = await AudioEncoder.isConfigSupported({ codec: 'mp4a.40.2', sampleRate: 44100, numberOfChannels: 2, bitrate: 160_000 });
  if (!sup.supported) throw new Error('AAC encode unsupported');
  const durS = totalMs / 1000;
  const raw = await fetch(el.src).then(r => r.arrayBuffer());
  const actx = new OfflineAudioContext(2, Math.ceil(durS * 44100), 44100);
  const buf = await actx.decodeAudioData(raw);
  const src = actx.createBufferSource();
  src.buffer = buf; src.loop = true;
  const gain = actx.createGain();
  gain.gain.setValueAtTime(1, 0);
  gain.gain.setValueAtTime(1, Math.max(0, durS - 1));
  gain.gain.linearRampToValueAtTime(0, durS);
  src.connect(gain); gain.connect(actx.destination);
  src.start(0);
  return actx.startRendering();
}

async function renderOffline(tl, token) {
  let mux;
  try {
    mux = await loadMuxer();
  } catch (e) { console.warn('offline export unavailable (muxer):', e); return null; }

  // music: prepared offline and muxed as AAC — if that fails, fall back to
  // realtime capture (which records the audible track)
  let audioBuf = null;
  try { audioBuf = await prepareOfflineAudio(tl.total); }
  catch (e) { console.warn('offline audio unavailable, falling back to realtime:', e); return null; }

  const out = $('#output');
  const fps = settings.quality > 1 ? 60 : 30;
  if (!out.width || !out.height) { console.warn('offline export unavailable: canvas not sized'); return null; }
  // Fit within 1920 on the long edge (H.264 level limits; retina canvases are
  // bigger than any codec level we can rely on) — the downscale from the hi-dpi
  // canvas doubles as supersampling. Dimensions must be even.
  const scale = Math.min(1, 1920 / Math.max(out.width, out.height));
  const W = Math.round(out.width * scale / 2) * 2;
  const H = Math.round(out.height * scale / 2) * 2;
  const exp = document.createElement('canvas');
  exp.width = W; exp.height = H;
  const ectx = exp.getContext('2d');
  ectx.imageSmoothingQuality = 'high';

  const muxer = new mux.Muxer({
    target: new mux.ArrayBufferTarget(),
    video: { codec: 'avc', width: W, height: H },
    audio: audioBuf ? { codec: 'aac', sampleRate: 44100, numberOfChannels: 2 } : undefined,
    fastStart: 'in-memory',
  });
  let encErr = null;
  const encoder = new VideoEncoder({
    output: (chunk, meta) => { try { muxer.addVideoChunk(chunk, meta); } catch (e) { encErr = e; } },
    error: e => { encErr = e; },
  });
  const bitrate = clamp(Math.round(W * H * fps * 0.1), 8_000_000, 32_000_000);
  // pick the strongest H.264 profile this machine actually supports
  let configured = false;
  for (const codec of ['avc1.64002A', 'avc1.640028', 'avc1.4D0028', 'avc1.42E01F']) {
    try {
      const cfg = { codec, width: W, height: H, bitrate, framerate: fps };
      const s = await VideoEncoder.isConfigSupported(cfg);
      if (s.supported) { encoder.configure(cfg); configured = true; break; }
    } catch (e) { /* try next */ }
  }
  if (!configured) { console.warn('offline export unavailable: no supported encoder config'); return null; }

  // encode the whole audio track up front (fast, pure CPU)
  if (audioBuf) {
    const aenc = new AudioEncoder({
      output: (chunk, meta) => { try { muxer.addAudioChunk(chunk, meta); } catch (e) { encErr = e; } },
      error: e => { encErr = e; },
    });
    aenc.configure({ codec: 'mp4a.40.2', sampleRate: 44100, numberOfChannels: 2, bitrate: 160_000 });
    const ch0 = audioBuf.getChannelData(0);
    const ch1 = audioBuf.numberOfChannels > 1 ? audioBuf.getChannelData(1) : ch0;
    const CHUNK = 4410; // 100ms
    for (let off = 0; off < audioBuf.length; off += CHUNK) {
      const n = Math.min(CHUNK, audioBuf.length - off);
      const data = new Float32Array(n * 2);
      data.set(ch0.subarray(off, off + n), 0);
      data.set(ch1.subarray(off, off + n), n);
      const ad = new AudioData({ format: 'f32-planar', sampleRate: 44100, numberOfFrames: n, numberOfChannels: 2, timestamp: Math.round(off / 44100 * 1e6), data });
      aenc.encode(ad); ad.close();
    }
    await aenc.flush();
    if (encErr) { console.warn('offline audio encode failed:', encErr); try { encoder.close(); } catch (e) {} return null; }
  }

  const frames = Math.ceil(tl.total / 1000 * fps);
  const frameUs = Math.round(1e6 / fps);
  for (let i = 0; i < frames; i++) {
    if (token !== cancelToken || encErr) {
      try { encoder.close(); } catch (e) { /* already closed */ }
      if (token !== cancelToken) return undefined;      // user cancelled
      console.warn('offline export aborted (encoder error):', encErr);
      return null;                                       // → realtime fallback
    }
    paintFrame(tl, i * 1000 / fps);
    await mapFrameSettled();
    ectx.drawImage(out, 0, 0, W, H);
    try {
      const vf = new VideoFrame(exp, { timestamp: i * frameUs, duration: frameUs });
      encoder.encode(vf, { keyFrame: i % (fps * 2) === 0 });
      vf.close();
    } catch (e) { encErr = e; continue; }               // handled at loop top
    while (encoder.encodeQueueSize > 8) await sleep(4);
    if (i % 3 === 0) loading(true, `Rendering video… ${Math.round(i / frames * 100)}%`);
  }
  if (encErr) { try { encoder.close(); } catch (e) {} console.warn('offline export failed late:', encErr); return null; }
  loading(true, 'Finalizing video…');
  await encoder.flush();
  muxer.finalize();
  loading(false);
  return new Blob([muxer.target.buffer], { type: 'video/mp4' });
}

function publishVideo(blob, ext) {
  const url = URL.createObjectURL(blob);
  const a = $('#btn-download');
  if (a.href.startsWith('blob:')) URL.revokeObjectURL(a.href);
  a.href = url;
  a.download = `historymap.${ext}`;
  $('#dl-label').textContent = `Download ${ext.toUpperCase()} (${(blob.size / 1048576).toFixed(1)} MB)`;
  a.classList.remove('hidden');
  toast(`Video ready as ${ext.toUpperCase()} — click "Download".`);
}

/* ---- main entry ---- */
async function play(record) {
  if (stops.length < 2) { toast('Add at least two places for the camera to visit.'); return; }
  if (anim.playing) return;
  syncSettingsFromUI();

  loading(true, 'Planning the camera…');
  // Preview renders at 1x for smoothness; export keeps full resolution
  // (×quality) — offline rendering makes its cost irrelevant.
  if (record) {
    if (settings.quality > 1) map.setPixelRatio(Math.max(basePixelRatio, 1) * settings.quality);
  } else {
    map.setPixelRatio(1);
  }
  anim.globeWas = settings.globe;
  if (settings.fromSpace && !settings.globe) { settings.globe = true; applyProjection(); }
  await sleep(200);
  precomputeLegs();
  await regionsReady;

  anim.playing = true;
  anim.recording = record;
  anim.reached = 0; anim.legIndex = -1; anim.marker = null; anim.heading = null;
  anim.photo = null; anim.photoAlpha = 0; anim.pulse = null; anim._seg = null;
  const token = ++cancelToken;
  setControls(true);
  refreshArrowsEdit();   // anim.playing is set: clears the dashed edit preview

  setSrc('route-bg', EMPTY);
  setArrowPick(false);
  anim.arrowPaths = Object.fromEntries(arrows.map(a => [a.id, arrowCurve(a)]));
  anim.arrowProg = {};

  if (record) {
    loading(true, 'Caching map along the camera path… 0%');
    await prewarmTiles(token);
    if (token !== cancelToken) { loading(false); return; }
  }

  const tl = buildTimeline();
  fitToStops(true);
  loading(true, 'Loading overview…');
  await waitForTiles(record ? 5000 : 2000);
  loading(false);
  if (token !== cancelToken) return;

  $('#output').classList.add('show');
  startCompositor();

  // Offline (deterministic, constant-fps) export whenever possible — music is
  // decoded and muxed as AAC. WebM or missing WebCodecs falls back to realtime.
  const offline = record && settings.format === 'mp4' && typeof VideoEncoder !== 'undefined';
  if (offline) {
    let blob = null;
    try { blob = await renderOffline(tl, token); }
    catch (e) { console.warn('offline export failed, falling back to realtime:', e); blob = null; }
    if (blob === undefined) return;                 // cancelled mid-render
    if (blob) {
      if (token === cancelToken) { publishVideo(blob, 'mp4'); endPlay(); }
      return;
    }
    // muxer/encoder unavailable → realtime fallback below
  }

  startMusic();
  if (record) startRecorder();
  await runRealtime(tl, token);
  if (token === cancelToken) endPlay();
}

function endPlay() {
  loading(false);
  anim.playing = false; anim.phase = 'idle';
  if (anim.globeWas === false && settings.globe) { settings.globe = false; applyProjection(); }
  anim.globeWas = undefined;
  stopCompositor();
  if (anim.recording) stopRecorder();
  anim.recording = false;
  anim.titleAlpha = 0; anim.caption = ''; anim.photo = null; anim.photoAlpha = 0;
  anim.pulse = null; anim._seg = null; anim.heading = null;
  stopMusic();
  map.setPixelRatio(basePixelRatio);
  $('#output').classList.remove('show');
  setControls(false);
  setRegionAlpha(1);
  anim.arrowProg = {};
  refreshRoutePreview();
  refreshArrowsEdit();
}

function stopPlay() { cancelToken++; endPlay(); }

/* ============================================================ compositor
   The overlay canvas draws pins, labels and chrome, composited inside
   the map's `render` event so overlays and the map transform share one frame.

   PREVIEW: the overlay is transparent — we DON'T copy the map into it. The live
   WebGL map is shown directly underneath, so tiles render natively with no
   re-sampling (copying the tile buffer every frame was the tile-flicker cause).
   RECORD: we bake the map (fill + drawImage) so the single recorded canvas
   carries everything. */
let compositeFn = null, compositorGen = 0;

function styleBgColor() {
  try {
    const bg = (map.getStyle().layers || []).find(l => l.type === 'background');
    const c = bg && bg.paint && bg.paint['background-color'];
    if (typeof c === 'string') return c;
  } catch (e) { /* ignore */ }
  return '#0b0f14';
}

function startCompositor() {
  const out = $('#output');
  const ctx = out.getContext('2d');
  const bg = styleBgColor();

  compositeFn = () => {
    const m = map.getCanvas();
    if (out.width !== m.width || out.height !== m.height) { out.width = m.width; out.height = m.height; }
    const dpr = m.width / m.clientWidth || 1;
    if (anim.recording) {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, out.width, out.height);
      ctx.drawImage(m, 0, 0, out.width, out.height);
    } else {
      ctx.clearRect(0, 0, out.width, out.height);   // transparent → live map shows through
    }
    drawScene(ctx, out.width, out.height, dpr);
  };
  map.on('render', compositeFn);

  // Keep the map (and thus the compositor) painting even during still pauses,
  // so title/photo/pulse fades stay smooth.
  const gen = ++compositorGen;
  const pump = () => { if (!anim.playing || gen !== compositorGen) return; map.triggerRepaint(); tick(pump); };
  tick(pump);
  compositeFn();

  if (anim.recording && document.hidden) toast('Keep this tab visible while recording for smooth video.');
}

function stopCompositor() {
  compositorGen++;
  if (compositeFn) { map.off('render', compositeFn); compositeFn = null; }
}

function project(lng, lat, dpr) { const p = map.project([lng, lat]); return [p.x * dpr, p.y * dpr]; }

// In globe mode, points on the far side of the earth still project to screen
// coordinates. Use MapLibre's exact camera-based occlusion test, falling back
// to an angular cutoff from the view center on older builds.
function occludedByGlobe(lng, lat) {
  if (!settings.globe) return false;
  try {
    const t = map.transform;
    if (typeof t.isLocationOccluded === 'function') {
      return t.isLocationOccluded(new maplibregl.LngLat(((lng % 360) + 540) % 360 - 180, lat));
    }
  } catch (e) { /* fall through */ }
  const c = map.getCenter();
  return haversine([c.lng, c.lat], [lng, lat]) / 6371 > 1.43; // radians (~82°)
}

function drawScene(ctx, W, H, dpr) {
  // Overlays are designed for a stage at least 480 CSS px on its short side
  // and shrink on smaller ones; export resolution follows the stage size, so
  // a small window would otherwise produce a cramped video.
  const s = dpr * clamp(Math.min(W, H) / dpr / 480, 0.6, 1);
  const accent = settings.accent;
  // the lower-third caption owns the bottom strip; cards and notes stay above it
  const capFs = (settings.aspect === '9:16' ? 17 : 19) * s;
  const safeTop = 16 * s, safeBottom = H - (capFs + 18 * s) - 26 * s - 12 * s;

  // labels would crowd into a speck on the whole-globe shots
  const farOut = map.getZoom() < 2.4;

  // ---- arrows (grow along a curve, then stay) ----
  for (const a of arrows) {
    const prog = anim.arrowProg ? anim.arrowProg[a.id] || 0 : 0;
    const pts = anim.arrowPaths && anim.arrowPaths[a.id];
    if (prog <= 0.001 || !pts) continue;
    if (occludedByGlobe(a.from[0], a.from[1]) && occludedByGlobe(a.to[0], a.to[1])) continue;
    drawArrow(ctx, pts.map(c => project(c[0], c[1], dpr)), prog, a.color, s);
    const [x, y] = project(a.from[0], a.from[1], dpr);
    // label sits under the tail; skipped when the tail is off-screen (pinning
    // it to the frame edge would stack it on other labels)
    if (a.label && !farOut && prog > 0.12 && x > 0 && x < W && y > 0 && y < safeBottom && !occludedByGlobe(a.from[0], a.from[1])) {
      ctx.save();
      ctx.globalAlpha = clamp((prog - 0.12) / 0.25, 0, 1);
      const fs = 15 * s;
      ctx.font = `700 ${fs}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
      const tw = ctx.measureText(a.label).width, px = 9 * s, py = 6 * s;
      const bw = tw + px * 2, bh = fs + py * 2;
      const lx = clamp(x - bw / 2, 8 * s, W - bw - 8 * s), ly = clamp(y + 14 * s, 8 * s, safeBottom - bh);
      roundRect(ctx, lx, ly, bw, bh, 7 * s);
      ctx.fillStyle = hexA(a.color, 0.92); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
      ctx.fillText(a.label, lx + px, ly + bh / 2);
      ctx.restore();
    }
  }

  // ---- city pins + labels (revealed only once a stop is reached) ----
  stops.forEach((st, i) => {
    const reached = anim.phase === 'idle' || i < anim.reached;
    if (!reached) return;
    if (occludedByGlobe(st.lng, st.lat)) return;
    const [x, y] = project(st.lng, st.lat, dpr);
    if (x < -50 || x > W + 50 || y < -50 || y > H + 50) return;
    ctx.beginPath(); ctx.arc(x, y, 6 * s, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.lineWidth = 2.5 * s; ctx.strokeStyle = '#fff'; ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, 11 * s, 0, Math.PI * 2);
    ctx.strokeStyle = hexA(accent, 0.45); ctx.lineWidth = 2 * s; ctx.stroke();
    if (settings.labels && !farOut) {
      const fs = 15 * s;
      ctx.font = `700 ${fs}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
      const tw = ctx.measureText(st.name).width;
      const px = 9 * s, py = 6 * s, lx = x + 12 * s, ly = y - fs - 4 * s;
      roundRect(ctx, lx, ly, tw + px * 2, fs + py * 2, 7 * s);
      ctx.fillStyle = 'rgba(12,16,21,.82)'; ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle';
      ctx.fillText(st.name, lx + px, ly + (fs + py * 2) / 2);
    }
  });

  // ---- note bubble (stop has a note but no photo) ----
  if (anim.noteStop && anim.noteAlpha > 0.01 && !occludedByGlobe(anim.noteStop.lng, anim.noteStop.lat)) {
    const st = anim.noteStop;
    const [x, y] = project(st.lng, st.lat, dpr);
    const fs = (settings.aspect === '9:16' ? 15 : 16) * s, lh = fs * 1.4, pad = 14 * s;
    ctx.save();
    ctx.globalAlpha = anim.noteAlpha;
    ctx.font = `500 ${fs}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    const maxW = Math.min(320 * s, W * 0.44);
    const lines = wrapLines(ctx, st.note.trim(), maxW - pad * 2, 6);
    const bw = Math.max(...lines.map(l => ctx.measureText(l).width)) + pad * 2 + 4 * s;
    const bh = lines.length * lh + pad * 2;
    // first corner around the pin that fits the frame above the caption; the
    // name label sits up and to the right, so above-right clears it
    const left = 16 * s, right = W - 16 * s;
    const spots = [
      [x + 14 * s, y + 18 * s],
      [x - 14 * s - bw, y + 18 * s],
      [x + 14 * s, y - 18 * s - bh - (settings.labels ? 34 * s : 0)],
      [x - 14 * s - bw, y - 18 * s - bh],
    ];
    let [bx, by] = spots.find(([px, py]) => px >= left && px + bw <= right && py >= safeTop && py + bh <= safeBottom) || spots[0];
    bx = clamp(bx, left, right - bw); by = clamp(by, safeTop, Math.max(safeTop, safeBottom - bh));
    ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 18 * s; ctx.shadowOffsetY = 6 * s;
    roundRect(ctx, bx, by, bw, bh, 12 * s);
    ctx.fillStyle = 'rgba(12,16,21,.9)'; ctx.fill();
    ctx.shadowColor = 'transparent';
    roundRect(ctx, bx, by, 4 * s, bh, 2 * s);
    ctx.fillStyle = accent; ctx.fill();
    ctx.fillStyle = '#f2f5f8'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    lines.forEach((l, i) => ctx.fillText(l, bx + pad + 4 * s, by + pad + lh * (i + 0.5)));
    ctx.restore();
  }

  // ---- arrival ripple (timeline-driven) ----
  if (anim.pulse && !occludedByGlobe(anim.pulse.lng, anim.pulse.lat)) {
    const eo = anim.pulse.k;
    const [px, py] = project(anim.pulse.lng, anim.pulse.lat, dpr);
    ctx.beginPath(); ctx.arc(px, py, (9 + 42 * eo) * s, 0, Math.PI * 2);
    ctx.strokeStyle = hexA(accent, 0.5 * (1 - eo)); ctx.lineWidth = 3 * s; ctx.stroke();
  }

  // ---- title card (intro) ----
  if (anim.titleAlpha > 0.01) {
    ctx.save();
    ctx.globalAlpha = anim.titleAlpha;
    ctx.fillStyle = 'rgba(7,10,14,.45)'; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = anim.titleAlpha;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 18 * s;
    const tfs = (settings.aspect === '9:16' ? 46 : 54) * s;
    ctx.font = `800 ${tfs}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    wrapText(ctx, settings.title || '', W / 2, H / 2 - tfs * 0.2, W * 0.86, tfs * 1.15);
    if (settings.subtitle) {
      ctx.shadowBlur = 10 * s;
      ctx.font = `500 ${tfs * 0.42}px system-ui, sans-serif`;
      ctx.fillStyle = hexA(accent, 1);
      ctx.fillText(settings.subtitle, W / 2, H / 2 + tfs * 0.75);
    }
    ctx.restore();
    ctx.textAlign = 'left';
  }

  // ---- polaroid photo card ----
  if (anim.photo && anim.photoAlpha > 0.01) {
    const img = anim.photo, a = anim.photoAlpha;
    ctx.save();
    ctx.globalAlpha = a;
    const note = anim.photoNote || '';
    const nfs = 14 * s, nlh = nfs * 1.38;
    ctx.font = `400 ${nfs}px system-ui, sans-serif`;
    const frame = 12 * s, labelBand = 40 * s;
    // size the photo, wrap the note to the card width, then shrink the photo
    // if the whole card would run into the caption strip
    const fit = maxH => {
      const sc = Math.min(W * 0.46 / img.width, maxH / img.height);
      const w = img.width * sc, h = img.height * sc;
      const lines = note ? wrapLines(ctx, note, Math.max(w, 240 * s) - 8 * s, 4) : [];
      const band = labelBand + (lines.length ? lines.length * nlh + 10 * s : 0);
      return { w, h, lines, band, total: h + frame * 2 + band };
    };
    const room = safeBottom - safeTop;
    let card = fit(H * (note ? 0.46 : 0.56));
    if (card.total > room) card = fit(Math.max(room * 0.3, room - frame * 2 - card.band));
    const { w, h, lines, band } = card;
    const cardW = Math.max(w, 240 * s) + frame * 2;
    const cardTop = Math.max(safeTop, (safeTop + safeBottom - card.total) / 2);
    ctx.translate(W / 2, cardTop + frame + h / 2);
    ctx.rotate(-0.035 + 0.02 * (1 - a));
    ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 30 * s; ctx.shadowOffsetY = 10 * s;
    ctx.fillStyle = '#fff';
    ctx.fillRect(-cardW / 2, -h / 2 - frame, cardW, h + frame * 2 + band);
    ctx.shadowColor = 'transparent';
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.fillStyle = '#222';
    ctx.font = `600 ${16 * s}px system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const labelY = h / 2 + frame + labelBand / 2 - 4 * s;
    ctx.fillText(anim.photoLabel || '', 0, labelY);
    if (lines.length) {
      ctx.fillStyle = '#5b636d';
      ctx.font = `400 ${nfs}px system-ui, sans-serif`;
      lines.forEach((l, i) => ctx.fillText(l, 0, labelY + labelBand / 2 + nlh * (i + 0.5)));
    }
    ctx.restore();
    ctx.textAlign = 'left';
  }

  // ---- lower-third caption ----
  if (anim.caption && (anim.phase === 'leg' || anim.phase === 'pause')) {
    const fs = capFs;
    ctx.font = `600 ${fs}px system-ui, sans-serif`;
    const tw = ctx.measureText(anim.caption).width;
    const px = 16 * s, h = fs + 18 * s;
    const bx = 26 * s, by = H - h - 26 * s;
    roundRect(ctx, bx, by, tw + px * 2, h, 10 * s);
    ctx.fillStyle = hexA(accent, 0.92); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle';
    ctx.fillText(anim.caption, bx + px, by + h / 2);
  }

  // ---- optional custom watermark (off by default) ----
  if (settings.watermark) {
    const fs = 14 * s;
    ctx.font = `600 ${fs}px system-ui, sans-serif`;
    ctx.globalAlpha = 0.8; ctx.fillStyle = '#fff'; ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'right';
    ctx.fillText(settings.watermark, W - 22 * s, H - 22 * s);
    ctx.textAlign = 'left'; ctx.globalAlpha = 1;
  }
}

// A thick arrow along screen points, revealed to `prog` (0..1) of its length:
// dark outline and drop shadow, coloured shaft, solid head at the tip.
function drawArrow(ctx, P, prog, color, s) {
  const cum = [0];
  for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  const total = cum[cum.length - 1];
  if (total < 4) return;
  const L = total * prog;
  const at = d => {   // point at distance d along the path
    let i = 1; while (i < cum.length - 1 && cum[i] < d) i++;
    const t = clamp((d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1), 0, 1);
    return [P[i - 1][0] + (P[i][0] - P[i - 1][0]) * t, P[i - 1][1] + (P[i][1] - P[i - 1][1]) * t];
  };
  const w = clamp(total * 0.035, 7 * s, 15 * s);              // shaft width
  const headL = Math.min(w * 2.6, L * 0.6), headW = w * 2.3;
  const tip = at(L), base = at(Math.max(0, L - headL));
  const shaft = [];
  for (let i = 0; i < P.length && cum[i] < L - headL; i++) shaft.push(P[i]);
  shaft.push(base);
  const ang = Math.atan2(tip[1] - base[1], tip[0] - base[0]);
  const nx = -Math.sin(ang), ny = Math.cos(ang);
  const head = () => {
    ctx.beginPath();
    ctx.moveTo(tip[0], tip[1]);
    ctx.lineTo(base[0] + nx * headW / 2, base[1] + ny * headW / 2);
    ctx.lineTo(base[0] - nx * headW / 2, base[1] - ny * headW / 2);
    ctx.closePath();
  };
  const stroke = (width, style) => {
    if (shaft.length < 2) return;
    ctx.beginPath(); ctx.moveTo(shaft[0][0], shaft[0][1]);
    for (let i = 1; i < shaft.length; i++) ctx.lineTo(shaft[i][0], shaft[i][1]);
    ctx.lineWidth = width; ctx.strokeStyle = style; ctx.stroke();
  };
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 10 * s; ctx.shadowOffsetY = 3 * s;
  stroke(w + 4 * s, 'rgba(10,12,16,.75)');
  head(); ctx.lineWidth = 4 * s; ctx.strokeStyle = 'rgba(10,12,16,.75)'; ctx.stroke();
  ctx.shadowColor = 'transparent';
  stroke(w, color);
  head(); ctx.fillStyle = color; ctx.fill();
  ctx.restore();
}

/* small canvas helpers */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
// Break text into lines that fit maxW. Latin text breaks between words, CJK
// between characters, explicit newlines are kept, and anything past maxLines
// is cut with an ellipsis. Closing punctuation (。，」…) sticks to the token
// before it, so a line never starts with one.
const WRAP_CLOSE = '[\u3001\u3002\u3009\u300b\u300d\u300f\u3011\u3015\uff01\uff09\uff0c\uff0e\uff1a\uff1b\uff1f\u2026\u2019\u201d]*';
const WRAP_CJK = '\u2e80-\u9fff\uac00-\ud7af\uf900-\ufaff\uff00-\uffef';
const WRAP_TOKEN = new RegExp(`\\s+|[${WRAP_CJK}]${WRAP_CLOSE}|[^\\s${WRAP_CJK}]+${WRAP_CLOSE}`, 'g');
function wrapLines(ctx, text, maxW, maxLines = Infinity) {
  const lines = [];
  for (const para of String(text).split(/\n/)) {
    let cur = '';
    for (const tok of para.match(WRAP_TOKEN) || []) {
      const test = cur + tok;
      if (ctx.measureText(test).width <= maxW || !cur.trim()) { cur = test; continue; }
      lines.push(cur.trimEnd());
      cur = /^\s+$/.test(tok) ? '' : tok;
    }
    // hard-break a single token that is wider than the line by itself
    while (ctx.measureText(cur).width > maxW && cur.length > 1) {
      let k = cur.length - 1;
      while (k > 1 && ctx.measureText(cur.slice(0, k)).width > maxW) k--;
      lines.push(cur.slice(0, k)); cur = cur.slice(k);
    }
    lines.push(cur.trimEnd());
  }
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    let last = kept[maxLines - 1];
    while (last && ctx.measureText(last + '…').width > maxW) last = last.slice(0, -1);
    kept[maxLines - 1] = last + '…';
    return kept;
  }
  return lines;
}
function wrapText(ctx, text, cx, cy, maxW, lh) {
  const lines = wrapLines(ctx, text, maxW, 3);
  const startY = cy - (lines.length - 1) * lh / 2;
  lines.forEach((l, i) => ctx.fillText(l, cx, startY + i * lh));
}
function hexA(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16), g = parseInt(h.substring(2, 4), 16), b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/* ============================================================ music */
function startMusic() {
  const el = $('#music');
  if (!el.src) return;
  el.currentTime = 0;
  el.volume = 0.85;
  el.play().catch(() => {});
}
function stopMusic() { const el = $('#music'); if (el.src) el.pause(); }

/* ============================================================ recording */
function pickMime() {
  const wantMp4 = settings.format === 'mp4';
  const candidates = wantMp4
    ? ['video/mp4;codecs=avc1.640028,mp4a.40.2', 'video/mp4;codecs=avc1.640028', 'video/mp4;codecs=avc1.42E01E', 'video/mp4',
       'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp9', 'video/webm']
    : ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
  return candidates.find(t => MediaRecorder.isTypeSupported(t)) || '';
}

function startRecorder() {
  recordedChunks = [];
  const fps = 30;
  const stream = $('#output').captureStream(fps);

  const music = $('#music');
  if (music.src) {
    try {
      const as = music.captureStream ? music.captureStream() : (music.mozCaptureStream && music.mozCaptureStream());
      if (as) as.getAudioTracks().forEach(t => stream.addTrack(t));
    } catch (e) { /* record silent video */ }
  }

  const mime = pickMime();
  mediaRecorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 14_000_000 });
  mediaRecorder.ondataavailable = e => { if (e.data && e.data.size) recordedChunks.push(e.data); };
  mediaRecorder.onstop = () => {
    const type = mediaRecorder.mimeType || 'video/webm';
    const ext = type.includes('mp4') ? 'mp4' : 'webm';
    publishVideo(new Blob(recordedChunks, { type }), ext);
  };
  mediaRecorder.start();
}
function stopRecorder() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
}

/* ============================================================ layout / aspect */
function layoutStage() {
  const area = $('#stage-inner');
  const cs = getComputedStyle(area);
  // the padding reserves room for the floating toolbar; fit inside it
  const r = {
    width: area.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight),
    height: area.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom),
  };
  const [aw, ah] = settings.aspect.split(':').map(Number);
  const ar = aw / ah;
  let w = r.width, h = w / ar;
  if (h > r.height) { h = r.height; w = h * ar; }
  const box = $('#mapbox');
  box.style.width = Math.floor(w) + 'px';
  box.style.height = Math.floor(h) + 'px';
  if (map) map.resize();
}

/* ============================================================ wiring */
function updatePaceLabel() {
  $('#pace-val').textContent = settings.pace < 0.8 ? 'Cinematic' : settings.pace > 1.4 ? 'Snappy' : 'Normal';
  const r = $('#rng-pace');
  r.style.setProperty('--fill', ((settings.pace - r.min) / (r.max - r.min) * 100) + '%');
}
// Segmented buttons drive a hidden <select>, so every other code path keeps
// reading and writing the select as before.
function initSegmented() {
  document.querySelectorAll('.seg[data-for]').forEach(seg => {
    const sel = document.getElementById(seg.dataset.for);
    seg.querySelectorAll('button').forEach(b => b.onclick = () => {
      if (sel.value === b.dataset.value) return;
      sel.value = b.dataset.value;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      syncControls();
    });
  });
  document.querySelectorAll('.swatches [data-color]').forEach(b => b.onclick = () => {
    const inp = $('#inp-accent');
    inp.value = b.dataset.color;
    inp.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
function syncControls() {
  document.querySelectorAll('[data-select]').forEach(b => syncSelect(document.getElementById(b.dataset.select)));
  document.querySelectorAll('.seg[data-for]').forEach(seg => {
    const v = document.getElementById(seg.dataset.for).value;
    seg.querySelectorAll('button').forEach(b => {
      const on = b.dataset.value === v;
      b.classList.toggle('active', on); b.setAttribute('aria-checked', on);
    });
  });
  let preset = false;
  document.querySelectorAll('.swatches [data-color]').forEach(b => {
    const on = b.dataset.color.toLowerCase() === settings.accent.toLowerCase();
    preset = preset || on;
    b.classList.toggle('active', on); b.setAttribute('aria-checked', on);
  });
  document.querySelector('.swatch-custom').classList.toggle('active', !preset);
  updatePaceLabel();
}
function setSaveState(kind, text) {
  const el = $('#save-state');
  el.className = 'save-state ' + kind;
  el.textContent = text;
}
function applyAccent() {
  document.documentElement.style.setProperty('--accent', settings.accent);
  syncControls();
}

function setControls(playing) {
  $('#btn-play').disabled = playing;
  $('#btn-record').disabled = playing;
  $('#btn-stop').disabled = !playing;
}
function syncSettingsFromUI() {
  settings.title = $('#inp-title').value;
  settings.subtitle = $('#inp-subtitle').value;
  settings.watermark = $('#inp-watermark').value.trim();
  settings.accent = $('#inp-accent').value;
  settings.pace = parseFloat($('#rng-pace').value);
  settings.labels = $('#chk-labels').checked;
  settings.pitch = $('#chk-pitch').checked;
  settings.fillOpacity = parseFloat($('#rng-fill').value);
  settings.borders = $('#chk-borders').checked;
  settings.fromSpace = $('#chk-space').checked;
  settings.zoomHop = $('#chk-hop').checked;
  // a space opening renders the whole video on the globe (see play())
  settings.globe = $('#chk-globe').checked || (anim.playing && settings.fromSpace);
  settings.format = $('#sel-format').value;
  settings.quality = parseInt($('#sel-quality').value, 10);
}

function wire() {
  $('#btn-add').onclick = doSearch;
  $('#inp-search').addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  $('#btn-clear').onclick = () => {
    if (!stops.length) return;
    const before = stops;
    stops = []; afterStopsChange();
    toast(`Cleared ${before.length} place${before.length > 1 ? 's' : ''}.`, 6000, { label: 'Undo', run: () => { stops = before; afterStopsChange(); } });
  };

  $('#btn-build').onclick = buildFromText;
  $('#btn-import').onclick = () => $('#file-route').click();
  $('#file-route').onchange = e => { if (e.target.files[0]) importRouteFile(e.target.files[0]); e.target.value = ''; };

  $('#file-photo').onchange = e => {
    const f = e.target.files[0]; e.target.value = '';
    const s = stops.find(x => x.id === photoTargetId);
    if (!f || !s) return;
    attachPhoto(s, URL.createObjectURL(f), ok => toast(ok ? `Photo attached to ${s.name}.` : 'That file could not be read as an image.'));
  };

  $('#btn-music').onclick = () => $('#file-music').click();
  $('#file-music').onchange = e => {
    const f = e.target.files[0]; e.target.value = '';
    if (!f) return;
    const m = $('#music');
    if (m.src.startsWith('blob:')) URL.revokeObjectURL(m.src);
    m.src = URL.createObjectURL(f);
    $('#music-name').textContent = f.name;
    $('#btn-music-clear').classList.remove('hidden');
  };
  $('#btn-music-clear').onclick = () => {
    const m = $('#music'); m.pause();
    if (m.src.startsWith('blob:')) URL.revokeObjectURL(m.src);
    m.removeAttribute('src'); m.load();
    $('#music-name').textContent = 'none';
    $('#btn-music-clear').classList.add('hidden');
  };

  $('#btn-play').onclick = () => play(false);
  $('#btn-record').onclick = () => { $('#btn-download').classList.add('hidden'); play(true); };
  $('#btn-stop').onclick = stopPlay;

  $('#inp-accent').oninput = e => { settings.accent = e.target.value; applyAccent(); };
  $('#sel-style').onchange = e => {
    settings.style = e.target.value;
    map.setStyle(styleSpec(settings.style), { diff: false });
  };
  $('#sel-aspect').onchange = e => { settings.aspect = e.target.value; layoutStage(); };
  $('#chk-globe').onchange = e => { settings.globe = e.target.checked; applyProjection(); };
  $('#chk-pitch').onchange = e => { settings.pitch = e.target.checked; map.easeTo({ pitch: settings.pitch ? 50 : 0, duration: 500 }); };
  $('#chk-labels').onchange = e => settings.labels = e.target.checked;
  $('#rng-fill').oninput = e => { settings.fillOpacity = parseFloat(e.target.value); applyRegionStyle(); };
  $('#chk-borders').onchange = e => { settings.borders = e.target.checked; applyRegionStyle(); };
  $('#chk-space').onchange = e => settings.fromSpace = e.target.checked;
  $('#chk-hop').onchange = e => settings.zoomHop = e.target.checked;
  wireRegions();
  wireArrows();
  $('#rng-pace').oninput = e => { settings.pace = parseFloat(e.target.value); updatePaceLabel(); };
  $('#btn-export').onclick = exportTrip;
  // any form edit persists the trip (debounced)
  $('#sidebar').addEventListener('input', scheduleSave);
  $('#sidebar').addEventListener('change', scheduleSave);
  $('#sel-format').onchange = e => settings.format = e.target.value;
  $('#sel-quality').onchange = e => settings.quality = parseInt(e.target.value, 10);

  document.addEventListener('click', e => {
    if (!e.target.closest('.search')) { $('#search-results').classList.add('hidden'); $('#region-results').classList.add('hidden'); }
  });

  // collapsible sidebar + mobile overlay
  const setNav = hidden => document.body.classList.toggle('nav-hidden', hidden);
  $('#nav-toggle').onclick = () => document.body.classList.toggle('nav-hidden');
  $('#nav-close').onclick = () => setNav(true);
  $('#scrim').onclick = () => setNav(true);
  // resize the map once the slide animation settles (stage width changed on desktop)
  $('#sidebar').addEventListener('transitionend', e => {
    if (e.propertyName === 'margin-left' || e.propertyName === 'transform') layoutStage();
  });

  // keep a sensible default when crossing the mobile breakpoint
  const mq = window.matchMedia('(max-width:820px)');
  let wasMobile = mq.matches;
  window.addEventListener('resize', () => {
    if (mq.matches !== wasMobile) { wasMobile = mq.matches; setNav(mq.matches); }
    layoutStage();
  });
}

/* ============================================================ boot */
function boot() {
  window.addEventListener('unhandledrejection', e => console.warn('unhandled rejection:', e.reason));
  document.documentElement.style.setProperty('--accent', settings.accent);
  if (window.matchMedia('(max-width:820px)').matches) document.body.classList.add('nav-hidden');
  wire();
  initSegmented();
  initMenu();
  restoreTrip();
  syncControls();
  renderStops();
  renderRegions();
  renderArrows();
  initMap();
  layoutStage();
  setTimeout(layoutStage, 300);
}
boot();
