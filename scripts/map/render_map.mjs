#!/usr/bin/env node
/**
 * Map scenes for the studio, rendered by Mapimator (vendor/Mapimator, a git submodule).
 *
 *   node scripts/map/render_map.mjs <projectDir>         (normally run by `studio maps <slug>` / `studio check`)
 *
 * Beats whose shot is "map:<name>" form one map scene (consecutive beats share it). The scene is
 * described in projects/<slug>/maps/<name>.json; its cues ("w:Hanoi", seconds, "end-2") are resolved
 * against the beats' words, so with a voiceover every pin lands on the spoken word.
 * Output: build/maps/<name>/f0000.jpg… (one per video frame, read by engine/scenes/MapClip.tsx)
 * and out/maps/<name>.mp4 (a silent clip of the map alone, for your own editor).
 * See docs/MAPS.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const MAPIMATOR = path.join(ROOT, 'vendor', 'Mapimator');
const require = createRequire(import.meta.url);
const NODE_PATHS = [path.join(ROOT, 'node_modules'), '/opt/npm-tools/node_modules', ...(process.env.NODE_PATH ? process.env.NODE_PATH.split(path.delimiter) : [])];
const resolveDep = (name) => { for (const p of NODE_PATHS) { try { return require.resolve(name, { paths: [p] }); } catch {} } throw new Error(`Cannot find "${name}". Run "npm install".`); };
const importDep = async (name) => { const m = await import('file://' + resolveDep(name)); return m.default && typeof m.default === 'object' ? { ...m.default, ...m } : m; };
const chromiumExecutable = () => process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const norm = (w) => String(w).replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();

// ------------------------------------------------------------------ spec → resolved
function groupsOf(tl) {
  const out = [];
  for (const s of tl.shots) {
    const key = s.shot ?? s.id;
    if (!String(key).startsWith('map:')) continue;
    const name = key.slice(4);
    const g = out[out.length - 1];
    if (g && g.name === name && g.end === s.from) { g.shots.push(s); g.end = s.from + s.dur; }
    else out.push({ name, from: s.from, end: s.from + s.dur, shots: [s] });
  }
  return out;
}

function cueResolver(group, fps, duration) {
  const words = group.shots.flatMap((s) => (s.words ?? []).map((w) => ({ w: norm(w.w), t: (s.from - group.from + w.at) / fps })));
  return (cue, what) => {
    if (cue == null) return 0;
    if (typeof cue === 'number') return cue;
    const m = String(cue).match(/^(w:([^#+\-]+)(?:#(\d+))?|end|start)\s*([+-]\s*[\d.]+)?$/);
    if (!m) throw new Error(`${group.name}: can't read cue "${cue}" (${what}). Use seconds, "w:word", "w:word#2", "w:word+0.3" or "end-1".`);
    const off = m[4] ? Number(m[4].replace(/\s/g, '')) : 0;
    if (m[1] === 'end') return duration + off;
    if (m[1] === 'start') return off;
    const want = norm(m[2]), nth = Number(m[3] ?? 1);
    const hits = words.filter((x) => x.w === want);
    if (hits.length < nth) throw new Error(`${group.name}: the word "${m[2]}"${nth > 1 ? ` (#${nth})` : ''} is not spoken in these beats (${what}).`);
    return hits[nth - 1].t + off;
  };
}

const ll = (v) => (Array.isArray(v) && v.length === 2 ? v.map(Number) : undefined);
function resolve(spec, group, fps, width, height) {
  const duration = (group.end - group.from) / fps;
  const at = cueResolver(group, fps, duration);
  const clamp = (t) => Math.max(0, Math.min(duration - 0.05, t));
  const items = [];
  for (const [i, it] of (spec.items ?? []).entries()) {
    const t = clamp(at(it.at, `item ${i + 1}`));
    const base = { at: t, anim: it.anim, dur: it.dur };
    const color = it.color;
    if (it.region) items.push({ ...base, type: 'region', props: { name: '', countryId: it.region, color: color ?? '#e8533e' }, ll: [0, 0] });
    else if (it.pin) items.push({ ...base, anim: it.anim ?? 'pop', type: 'pin', ll: ll(it.ll), props: {
      name: it.pin, text: it.label === false ? '' : it.pin, pinStyle: it.style ?? 'location', color: color ?? '#f3b43f', pinSize: it.size ?? 16,
      pinLabelSize: typeof it.label === 'number' ? it.label : 14, pinLabelPosition: it.labelSide ?? 'right', pinLabelColor: it.labelColor ?? '#ffffff' } });
    else if (it.text) items.push({ ...base, type: 'text', ll: ll(it.ll), props: { name: it.text, text: it.text, color: color ?? '#ffffff', fontSize: 1 }, px: { fontSize: it.size ?? 24 } });
    else if (it.line) items.push({ ...base, type: 'geo-effect', ll: ll(it.from), ll2: ll(it.to), props: { name: it.line, geoEffectType: it.line, color: color ?? '#ffffff', effectSize: 1 }, px: { effectSize: 40 } });
    else if (it.effect) items.push({ ...base, type: 'geo-effect', ll: ll(it.ll), ll2: ll(it.to), props: { name: it.effect, geoEffectType: it.effect, color: color ?? '#ff7159', effectSize: 1 }, px: { effectSize: it.size ?? 40 } });
    else if (it.route || it.arrow) {
      const pts = (it.route ?? it.arrow).map(ll);
      const every = it.every ?? 0.35;
      for (let k = 0; k + 1 < pts.length; k++)
        items.push({ ...base, at: clamp(t + k * every), type: it.route ? 'route' : 'arrow', ll: pts[k], ll2: pts[k + 1], props: { name: (it.name ?? 'path') + k, color: color ?? (it.route ? '#64d5ba' : '#ef694f') } });
    } else throw new Error(`${group.name}: item ${i + 1} needs one of region / pin / text / line / effect / route / arrow.`);
  }
  const cam = (c, what) => {
    if (!c || [c.lon, c.lat, c.zoom].some((v) => typeof v !== 'number')) throw new Error(`${group.name}: ${what} needs { "lon", "lat", "zoom" } (zoom 1–6).`);
    return { lon: c.lon, lat: c.lat, zoom: Math.max(1, Math.min(6, c.zoom)) };
  };
  const moves = (spec.moves ?? []).map((m, i) => ({ at: clamp(at(m.at, `move ${i + 1}`)), dur: m.dur ?? 2, to: cam(m.to, `move ${i + 1}`) })).sort((a, b) => a.at - b.at);
  return { style: spec.style ?? 'documentary-dark', labels: spec.labels ?? 'none', duration, fps, width, height, start: cam(spec.start, 'start'), moves, layers: items, steps: spec.steps ?? 8 };
}

// ------------------------------------------------------------------ bundle + page
async function buildPage(dir) {
  if (!fs.existsSync(path.join(MAPIMATOR, 'src/core/frameRenderer.tsx')))
    throw new Error('Mapimator is missing. Run: git submodule update --init vendor/Mapimator');
  const { build } = await importDep('esbuild');
  const font = (f) => 'data:font/ttf;base64,' + fs.readFileSync(path.join(ROOT, 'assets/fonts', f)).toString('base64');
  await build({
    entryPoints: [path.join(ROOT, 'scripts/map/entry.tsx')], bundle: true, format: 'iife', outfile: path.join(dir, 'bundle.js'), jsx: 'automatic', logLevel: 'error',
    nodePaths: NODE_PATHS, define: { 'import.meta.env.DEV': 'false', 'import.meta.env': '{}', 'process.env.NODE_ENV': '"production"' },
    plugins: [{ name: 'studio-stubs', setup(b) {
      // Mapimator embeds its fonts from npm packages; the studio's own font stands in for them
      b.onResolve({ filter: /\?url$/ }, (a) => ({ path: a.path, namespace: 'font' }));
      b.onLoad({ filter: /.*/, namespace: 'font' }, () => ({ contents: `export default ${JSON.stringify(font('Outfit-Bold.ttf'))}`, loader: 'js' }));
      b.onResolve({ filter: /^@tauri-apps\// }, (a) => ({ path: a.path, namespace: 'tauri' }));
      b.onLoad({ filter: /.*/, namespace: 'tauri' }, () => ({ contents: 'export const invoke = async () => { throw new Error("desktop only"); }; export const open = invoke, save = invoke; export const convertFileSrc = (x) => x;', loader: 'js' }));
    } }],
  });
  const css = fs.readdirSync(path.join(MAPIMATOR, 'src/styles')).map((f) => fs.readFileSync(path.join(MAPIMATOR, 'src/styles', f), 'utf8')).join('\n');
  fs.writeFileSync(path.join(dir, 'page.html'), `<!doctype html><html><head><meta charset="utf-8"><style>${css}\n${fs.readFileSync(path.join(ROOT, 'scripts/map/studio-map.css'), 'utf8')}</style></head><body><script src="bundle.js"></script></body></html>`);
}

export async function renderMaps(P, { force = false } = {}) {
  const BUILD = path.join(P, 'build');
  const tl = JSON.parse(fs.readFileSync(path.join(BUILD, 'timeline.json'), 'utf8'));
  const groups = groupsOf(tl);
  if (!groups.length) return [];
  const fps = tl.fps ?? 30, width = tl.width ?? 1920, height = tl.height ?? 1080;
  const work = [];
  for (const g of groups) {
    const specFile = path.join(P, 'maps', g.name + '.json');
    if (!fs.existsSync(specFile)) throw new Error(`No map spec for "map:${g.name}": create ${path.relative(ROOT, specFile)} (see docs/MAPS.md).`);
    const r = resolve(JSON.parse(fs.readFileSync(specFile, 'utf8')), g, fps, width, height);
    const frames = g.end - g.from;
    const dir = path.join(BUILD, 'maps', g.name);
    const hash = crypto.createHash('sha1').update(JSON.stringify(r) + fs.readFileSync(path.join(ROOT, 'scripts/map/entry.tsx')) + fs.readFileSync(path.join(ROOT, 'scripts/map/studio-map.css'))).digest('hex');
    const done = fs.existsSync(path.join(dir, 'hash')) && fs.readFileSync(path.join(dir, 'hash'), 'utf8') === hash && fs.existsSync(path.join(dir, `f${String(frames - 1).padStart(4, '0')}.jpg`));
    if (done && !force) { console.log(`map:${g.name}: up to date (${frames} frames)`); continue; }
    work.push({ g, r, frames, dir, hash });
  }
  if (work.length) {
    const tmp = path.join(BUILD, 'maps', '_page');
    fs.mkdirSync(tmp, { recursive: true });
    await buildPage(tmp);
    const { chromium } = await importDep('playwright');
    const browser = await chromium.launch({ executablePath: chromiumExecutable(), args: ['--allow-file-access-from-files'] });
    for (const { g, r, frames, dir, hash } of work) {
      fs.rmSync(dir, { recursive: true, force: true });
      const png = path.join(dir, 'png');
      fs.mkdirSync(png, { recursive: true });
      const page = await browser.newPage({ viewport: { width, height } });
      page.on('pageerror', (e) => console.error(`map:${g.name}:`, e.message));
      await page.exposeFunction('saveFrame', (i, b64) => fs.writeFileSync(path.join(png, `f${String(i).padStart(4, '0')}.png`), Buffer.from(b64, 'base64')));
      await page.goto('file://' + path.join(tmp, 'page.html'));
      const t0 = Date.now();
      const info = await page.evaluate(async ({ r, frames }) => window.StudioMap.render(r, 0, frames - 1, (i, b) => window.saveFrame(i, b)), { r, frames });
      await page.close();
      // JPEG for the runtime (small, fast to decode); an MP4 of the map alone for editing
      const enc = spawnSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(fps), '-i', path.join(png, 'f%04d.png'), '-q:v', '2', '-start_number', '0', path.join(dir, 'f%04d.jpg')], { stdio: 'inherit' });
      if (enc.status !== 0) throw new Error('ffmpeg failed on map frames');
      const out = path.join(P, 'out', 'maps');
      fs.mkdirSync(out, { recursive: true });
      spawnSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(fps), '-i', path.join(png, 'f%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', path.join(out, g.name + '.mp4')], { stdio: 'inherit' });
      fs.rmSync(png, { recursive: true, force: true });
      fs.writeFileSync(path.join(dir, 'hash'), hash);
      fs.writeFileSync(path.join(dir, 'resolved.json'), JSON.stringify(r, null, 1));
      console.log(`map:${g.name}: ${info.rendered} frames in ${((Date.now() - t0) / 1000).toFixed(0)} s → out/maps/${g.name}.mp4`);
    }
    await browser.close();
  }
  return groups;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const P = path.resolve(process.argv[2] ?? '.');
  renderMaps(P, { force: process.argv.includes('--force') }).catch((e) => { console.error(e.message); process.exit(1); });
}
