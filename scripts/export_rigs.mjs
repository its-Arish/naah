#!/usr/bin/env node
/**
 * Export every character as a cut-out rig for hand animation in other programs.
 *
 *   node scripts/export_rigs.mjs            # all characters
 *   node scripts/export_rigs.mjs NVA HOST   # just these
 *
 * For each character, rigs/<NAME>/ gets:
 *   <NAME>.svg    layered vector file (Illustrator, Inkscape, Affinity, Moho, Toon Boom, Blender)
 *   <NAME>.psd    layered Photoshop file with groups (After Effects, Character Animator, Photoshop, Krita)
 *   parts/*.png   every part as a transparent PNG on the same canvas, so they line up when stacked
 *   rig.json      layer tree, canvas size and joint pivots in pixels
 *   preview.png   the assembled character with its pivots marked
 * The characters come from engine/characters/Rig.tsx (geometry) and engine/cast/Wardrobe.ts (costumes).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const NODE_PATHS = [path.join(ROOT, 'node_modules'), '/opt/npm-tools/node_modules', ...(process.env.NODE_PATH ? process.env.NODE_PATH.split(path.delimiter) : [])];
const resolveDep = (name) => { for (const p of NODE_PATHS) { try { return require.resolve(name, { paths: [p] }); } catch {} } throw new Error(`Cannot find "${name}". Run "npm install".`); };
const importDep = async (name) => { const m = await import('file://' + resolveDep(name)); return m.default && typeof m.default === 'object' ? { ...m.default, ...m } : m; };
const chromiumExecutable = () => process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);

const SCALE = Number(process.env.RIG_SCALE || 3); // pixels per character unit (a Chibi is ~320 units tall)
const PAD = 16;
const OUT = path.join(ROOT, 'rigs');
const only = process.argv.slice(2);

// 1) bundle and run the markup script → { NAME: '<g data-layer=…>…</g>' }
const { build } = await importDep('esbuild');
const tmp = fs.mkdtempSync(path.join(ROOT, '.rigtmp-'));
const bundle = path.join(tmp, 'markup.cjs');
await build({ entryPoints: [path.join(ROOT, 'scripts/rig/markup.tsx')], bundle: true, platform: 'node', format: 'cjs', outfile: bundle, nodePaths: NODE_PATHS, jsx: 'automatic', logLevel: 'error', alias: { '@engine': path.join(ROOT, 'engine') } });
const r = spawnSync(process.execPath, [bundle], { maxBuffer: 1 << 28, env: { ...process.env, NODE_PATH: NODE_PATHS.join(path.delimiter) } });
if (r.status !== 0) { console.error(String(r.stderr)); process.exit(1); }
const marks = JSON.parse(String(r.stdout));
fs.rmSync(tmp, { recursive: true, force: true });
const names = Object.keys(marks).filter((n) => !only.length || only.includes(n));

// fonts for placard text etc.
const fontCss = ['Hand', 'Tag', 'TagBold'].map((f) => {
  const file = fs.readdirSync(path.join(ROOT, 'assets/fonts')).find((x) => x.toLowerCase().startsWith(f.toLowerCase() + '.'));
  return file ? `@font-face{font-family:'${f}';src:url('file://${path.join(ROOT, 'assets/fonts', file)}')}` : '';
}).join('');

const { chromium } = await importDep('playwright');
const browser = await chromium.launch({ executablePath: chromiumExecutable(), args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
fs.mkdirSync(OUT, { recursive: true });

for (const name of names) {
  const dir = path.join(OUT, name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(path.join(dir, 'parts'), { recursive: true });
  // measure with every layer shown
  await page.setContent(`<html><head><style>${fontCss}html,body{margin:0;background:transparent}</style></head><body><svg id="s" xmlns="http://www.w3.org/2000/svg" width="10" height="10">${marks[name]}</svg></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  const box = await page.evaluate(() => {
    const hid = [...document.querySelectorAll('[data-hidden]')];
    hid.forEach((e) => (e.style.display = ''));
    const b = document.querySelector('#s > g').getBBox();
    hid.forEach((e) => (e.style.display = 'none'));
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  });
  const vx = Math.floor(box.x - PAD), vy = Math.floor(box.y - PAD), vw = Math.ceil(box.w + PAD * 2), vh = Math.ceil(box.h + PAD * 2);
  const W = vw * SCALE, H = vh * SCALE;
  const toPx = (x, y) => [Math.round((x - vx) * SCALE * 10) / 10, Math.round((y - vy) * SCALE * 10) / 10];
  await page.setViewportSize({ width: W, height: H });
  await page.evaluate(({ vx, vy, vw, vh, W, H }) => { const s = document.getElementById('s'); s.setAttribute('viewBox', `${vx} ${vy} ${vw} ${vh}`); s.setAttribute('width', W); s.setAttribute('height', H); }, { vx, vy, vw, vh, W, H });

  // layer tree (bottom → top, as drawn)
  const tree = await page.evaluate(() => {
    let n = 0;
    const walk = (el) => {
      const kids = [...el.querySelectorAll('[data-layer]')].filter((d) => d.parentElement.closest('[data-layer]') === el);
      const node = { name: el.getAttribute('data-layer'), hidden: el.hasAttribute('data-hidden'), pivot: el.getAttribute('data-pivot'), id: 'L' + n++ };
      el.setAttribute('data-id', node.id);
      if (kids.length) node.children = kids.map(walk);
      return node;
    };
    return walk(document.querySelector('#s > g'));
  });

  // rasterise: preview (default visibility) then each leaf on its own, on the full canvas
  await page.screenshot({ path: path.join(dir, 'preview.png'), omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } });
  const leaves = [];
  const collect = (nd, trail) => { if (nd.children) nd.children.forEach((c) => collect(c, [...trail, nd.id])); else leaves.push({ ...nd, trail }); };
  collect(tree, []);
  let i = 0;
  for (const leaf of leaves) {
    const file = `${String(++i).padStart(2, '0')}_${leaf.name.replace(/[^A-Za-z0-9-]+/g, '_')}.png`;
    await page.evaluate(({ id, trail }) => {
      const keep = new Set([id, ...trail]);
      document.querySelectorAll('[data-id]').forEach((e) => {
        const k = e.getAttribute('data-id');
        const isLeaf = !e.querySelector('[data-id]');
        e.style.display = keep.has(k) ? '' : isLeaf ? 'none' : '';
      });
    }, leaf);
    await page.screenshot({ path: path.join(dir, 'parts', file), omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } });
    leaf.file = file;
  }
  const fileOf = Object.fromEntries(leaves.map((l) => [l.id, l.file]));
  const finish = (nd) => {
    const o = { name: nd.name };
    if (nd.hidden) o.hidden = true;
    if (nd.pivot) { const [x, y] = nd.pivot.split(',').map(Number); o.pivot = toPx(x, y); }
    if (nd.children) o.children = nd.children.map(finish); else o.file = 'parts/' + fileOf[nd.id];
    return o;
  };
  const rig = { name, width: W, height: H, scale: SCALE, origin: toPx(0, 0), note: 'Pixels from the top-left of the canvas. origin = point between the feet. pivot = the joint a layer rotates around. Layers are listed bottom to top; hidden ones are alternate mouths, eyes, brows and hands to swap in.', root: finish(tree) };
  fs.writeFileSync(path.join(dir, 'rig.json'), JSON.stringify(rig, null, 1));

  // layered SVG: named groups as Inkscape layers / Illustrator layers (id), pivots kept as data-pivot
  const used = new Set();
  const svgBody = await page.evaluate(() => document.querySelector('#s > g').outerHTML);
  const named = svgBody
    .replace(/<g([^>]*?) data-layer="([^"]+)"/g, (_, pre, nm) => {
      let id = nm.replace(/[^A-Za-z0-9]+/g, '_').replace(/^(\d)/, '_$1'); let k = id, j = 2; while (used.has(k)) k = `${id}_${j++}`; used.add(k);
      return `<g${pre} id="${k}" inkscape:label="${nm}" inkscape:groupmode="layer" data-layer="${nm}"`;
    })
    .replace(/ data-id="[^"]*"/g, '')
    .replace(/style="display: none;"/g, 'style="display:none"')
    .replace(/ style=""/g, '');
  fs.writeFileSync(path.join(dir, `${name}.svg`), `<?xml version="1.0" encoding="UTF-8"?>
<!-- ${name}: cut-out rig from History Cartoon Studio. Layers are named; hidden layers are alternate mouths/eyes/brows.
     data-pivot = joint position in the drawing's own units (feet centre = 0,0). See rig.json for pixel pivots. -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="${W}" height="${H}" viewBox="${vx} ${vy} ${vw} ${vh}">
${named}
</svg>
`);
  // pivots overlay on the preview
  await page.evaluate(({ rig }) => {
    document.querySelectorAll('[data-id]').forEach((e) => (e.style.display = e.hasAttribute('data-hidden') ? 'none' : ''));
    const s = document.getElementById('s');
    const vb = s.viewBox.baseVal;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const dots = [];
    const walk = (n) => { if (n.pivot && !n.hidden) dots.push(n.pivot); (n.children || []).forEach(walk); };
    walk(rig.root);
    for (const [px, py] of dots) {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', vb.x + px / rig.scale); c.setAttribute('cy', vb.y + py / rig.scale); c.setAttribute('r', 3.2);
      c.setAttribute('fill', '#FF2D7A'); c.setAttribute('stroke', '#fff'); c.setAttribute('stroke-width', 1.2);
      g.appendChild(c);
    }
    s.appendChild(g);
  }, { rig });
  await page.screenshot({ path: path.join(dir, 'pivots.png'), omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } });

  // PSD
  const py = spawnSync('python3', [path.join(ROOT, 'scripts/rig/write_psd.py'), dir], { stdio: 'inherit' });
  if (py.status !== 0) throw new Error('PSD failed for ' + name);
  console.log(`${name}: ${leaves.length} layers, ${W}×${H}`);
}
await browser.close();
