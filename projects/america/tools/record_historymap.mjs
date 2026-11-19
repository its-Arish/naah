// Record History Map shot projects to MP4 in Brave (WebCodecs H.264).
//   node projects/america/tools/record_historymap.mjs [seg ids...]
// Needs vendor/historymap served on http://localhost:8743 (python3 -m http.server 8743).
// Output: projects/america/clips/raw/<seg>.mp4 (1920×1080, 60 fps, exact shot length).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const RAW = path.join(PROJ, 'clips', 'raw');
const BRAVE = process.env.BRAVE_PATH || `${process.env.HOME}/Desktop/Brave Browser.app/Contents/MacOS/Brave Browser`;
const manifest = JSON.parse(fs.readFileSync(path.join(PROJ, 'historymap', 'manifest.json'), 'utf8'));
const only = process.argv.slice(2);
const todo = manifest.filter((m) => !only.length || only.includes(m.seg) || only.includes(m.beat));
fs.mkdirSync(RAW, { recursive: true });
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

const browser = await chromium.launch({ executablePath: BRAVE, headless: false, args: ['--window-size=1500,900'] });
const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 820 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto('http://localhost:8743', { waitUntil: 'load' });
await page.waitForSelector('.maplibregl-canvas', { timeout: 60000 });
await page.waitForTimeout(1500);

for (const m of todo) {
  const t0 = Date.now();
  await page.setInputFiles('#file-route', path.join(PROJ, m.file));
  // wait until THIS segment's shot is loaded (a stale shot from the previous file must never be recorded)
  await page.waitForFunction((want) => typeof shot !== 'undefined' && shot && Math.abs(shot.durMs - want.durMs) < 0.01
    && shot.from.center[0] === want.from.center[0] && shot.from.qz === want.from.qz && regions.length === want.nreg && arrows.length === want.narr,
    { durMs: m.shot.durMs, from: m.shot.from, nreg: m.regions.length, narr: m.route_end ? 1 : 0 }, { timeout: 20000 });
  // 960×540 CSS at pixel ratio 2 → exactly 1920×1080, the frame the QGIS zooms were set for
  await page.evaluate(async () => {
    const box = document.querySelector('#mapbox');
    box.style.width = '960px'; box.style.height = '540px';
    map.resize();
    await regionsReady;
  });
  await page.waitForTimeout(600);
  await page.click('#btn-record');
  await page.waitForFunction(() => !document.querySelector('#btn-download').classList.contains('hidden'), null, { timeout: 10 * 60e3 });
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#btn-download')]);
  const out = path.join(RAW, `${m.seg}.mp4`);
  await dl.saveAs(out);
  await page.evaluate(() => document.querySelector('#btn-download').classList.add('hidden'));
  log(`${m.seg} (${m.frames} f, "${m.label}") → ${path.relative(PROJ, out)} in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
log('errors:', errors.length ? errors : 'none');
await browser.close();
