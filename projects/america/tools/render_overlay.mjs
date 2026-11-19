// Render projects/america-overlay as transparent PNG frames (narrator, captions, map label).
//   node projects/america/tools/render_overlay.mjs
// Run `node scripts/studio.mjs build america-overlay` first.
// Output: projects/america/clips/overlay/<beat>/f000000.png … (local frames of each beat)
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const PROJ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ROOT = path.dirname(path.dirname(PROJ));
const DIST = path.join(ROOT, 'projects', 'america-overlay', 'build', 'dist');
const tl = JSON.parse(fs.readFileSync(path.join(ROOT, 'projects', 'america-overlay', 'build', 'timeline.json'), 'utf8'));
const BRAVE = process.env.BRAVE_PATH || undefined;
const only = process.argv.slice(2);

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(pathToFileURL(path.join(DIST, 'index.html')).href);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
// transparent stage: the runtime paints black behind every shot
await page.addStyleTag({ content: 'html,body{background:transparent!important} #root>div{background:transparent!important}' });

const t0 = Date.now();
for (const s of tl.shots) {
  if (only.length && !only.includes(s.id)) continue;
  const dir = path.join(PROJ, 'clips', 'overlay', s.id);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  for (let i = 0; i < s.dur; i++) {
    await page.evaluate((n) => window.__setFrame(n), s.from + i);
    await page.screenshot({ path: path.join(dir, `f${String(i).padStart(6, '0')}.png`), omitBackground: true });
  }
  console.log(`${s.id}: ${s.dur} frames`);
}
console.log(`done in ${((Date.now() - t0) / 1000).toFixed(0)} s; page errors:`, errors.length ? errors : 'none');
await browser.close();
