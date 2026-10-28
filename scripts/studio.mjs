#!/usr/bin/env node
/**
 * studio.mjs — one CLI for the whole pipeline.
 *
 *   node scripts/studio.mjs <command> <project> [args]
 *
 *   new      <project> [title]        create projects/<project>/ from the template
 *   doctor                            check Node, Chromium, ffmpeg, Python
 *   draft    <project>                script.md → beats/00-draft.json (mechanical split; then edit by hand)
 *   align    <project>                voiceover.* → build/vo_align.json + build/vo_env.js (lip-sync)
 *   timeline <project>                beats/*.json (+ vo_align) → build/timeline.json, cues.json, sections.json
 *   build    <project>                bundle the project into build/dist/
 *   check    <project>                timeline + build + verify every shot id has a component
 *   stills   <project> [frames...|--every-shot|--section N] → out/stills/*.png + contact sheets
 *   render   <project> [start end] [--workers N] [--out file]   → out/video.mp4 (silent)
 *   sfx      <project>                synthesise the sound-effects mix → build/sfx.wav
 *   mux      <project> [--video f]    video + sfx (+ voiceover) → out/<project>.mp4
 *   stems    <project>                separate voice / sfx / music WAVs + no-voice video + edit list → out/stems/
 *   all      <project>                check → render → sfx → mux
 */
import fs from 'fs';
import path from 'path';
import { spawn, spawnSync, execFileSync } from 'child_process';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

// ------------------------------------------------------------ dependency resolution
// Normal installs use ./node_modules. Sandboxes with preinstalled tools (e.g. /opt/npm-tools) work too.
const NODE_PATHS = [path.join(ROOT, 'node_modules'), '/opt/npm-tools/node_modules', ...(process.env.NODE_PATH ? process.env.NODE_PATH.split(path.delimiter) : [])];
function resolveDep(name) {
  for (const p of NODE_PATHS) {
    try { return require.resolve(name, { paths: [p] }); } catch {}
  }
  throw new Error(`Cannot find "${name}". Run "npm install" in ${ROOT}.`);
}
async function importDep(name) {
  const p = resolveDep(name);
  const m = await import(p.startsWith('/') ? 'file://' + p : p);
  return m.default && typeof m.default === 'object' ? { ...m.default, ...m } : m; // CommonJS packages
}
function chromiumExecutable() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const pre = '/opt/pw-browsers/chromium';
  if (fs.existsSync(pre)) return pre;
  return undefined; // let Playwright use its own downloaded browser
}

const [, , cmd, projectName, ...rest] = process.argv;
const P = projectName ? path.join(ROOT, 'projects', projectName) : null;
const BUILD = P && path.join(P, 'build');
const OUT = P && path.join(P, 'out');
const sh = (bin, args, opts = {}) => { const r = spawnSync(bin, args, { stdio: 'inherit', ...opts }); if (r.status !== 0) throw new Error(`${bin} ${args.join(' ')} failed`); };
const flag = (name, def) => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : def; };
// positional numbers only (skips the values that follow --flags)
const positionalNums = () => rest.filter((a, i) => /^\d+$/.test(a) && !(i > 0 && rest[i - 1].startsWith('--'))).map(Number);
// relative --out/--video paths are relative to the project folder
const projPath = (f) => (path.isAbsolute(f) ? f : path.join(P, f));
const python = () => (spawnSync('python3', ['--version']).status === 0 ? 'python3' : 'python');
function needProject() {
  if (!P || !fs.existsSync(P)) { console.error(`Project not found: projects/${projectName ?? '<name>'}`); process.exit(1); }
  fs.mkdirSync(BUILD, { recursive: true }); fs.mkdirSync(OUT, { recursive: true });
}
const config = () => ({ fps: 30, wordsPerSecond: 3.2, openingSeconds: 4.5, cardSeconds: 2.2, endSeconds: 4.5, ...(fs.existsSync(path.join(P, 'project.json')) ? JSON.parse(fs.readFileSync(path.join(P, 'project.json'), 'utf8')) : {}) });

// ------------------------------------------------------------ commands
const commands = {
  async doctor() {
    const ok = (b, m) => console.log(`${b ? '✔' : '✘'} ${m}`);
    ok(+process.versions.node.split('.')[0] >= 18, `Node ${process.versions.node} (need ≥ 18)`);
    for (const d of ['react', 'react-dom', 'esbuild', 'playwright']) { let found = true; try { resolveDep(d); } catch { found = false; } ok(found, `npm package ${d}`); }
    ok(spawnSync('ffmpeg', ['-version']).status === 0, 'ffmpeg on PATH');
    const py = spawnSync(python(), ['-c', 'import numpy, scipy']).status === 0;
    ok(py, 'Python with numpy + scipy (sound effects)');
    try {
      const { chromium } = await importDep('playwright');
      const b = await chromium.launch({ executablePath: chromiumExecutable() }); await b.close(); ok(true, 'Chromium launches');
    } catch (e) { ok(false, 'Chromium launches — run "npx playwright install chromium" (' + e.message.split('\n')[0] + ')'); }
  },

  new() {
    if (!projectName) throw new Error('usage: new <project-name> [title]');
    const dst = path.join(ROOT, 'projects', projectName);
    if (fs.existsSync(dst)) throw new Error(`projects/${projectName} already exists`);
    fs.cpSync(path.join(ROOT, 'projects', '_template'), dst, { recursive: true, filter: (src) => !/[\\/](build|out)$/.test(src) });
    const title = rest.join(' ') || projectName;
    const pj = path.join(dst, 'project.json');
    fs.writeFileSync(pj, fs.readFileSync(pj, 'utf8').replace('"New Video"', JSON.stringify(title)));
    console.log(`Created projects/${projectName} (with a small example film). Replace script.md with your script (and add voiceover.mp3 if you have one), then: studio draft ${projectName}`);
  },

  draft() { needProject(); sh(python(), [path.join(ROOT, 'scripts', 'script_to_beats.py'), P]); },

  align() { needProject(); sh(python(), [path.join(ROOT, 'scripts', 'align_voiceover.py'), P, String(config().fps)]); },

  timeline() { needProject(); sh(process.execPath, [path.join(ROOT, 'scripts', 'build_timeline.mjs'), P]); },

  async build() {
    needProject();
    const { build } = await importDep('esbuild');
    const dist = path.join(BUILD, 'dist');
    fs.mkdirSync(dist, { recursive: true });
    await build({
      entryPoints: [path.join(ROOT, 'engine', 'runtime', 'index.tsx')],
      bundle: true, outfile: path.join(dist, 'bundle.js'), jsx: 'automatic', minify: true, logLevel: 'warning',
      loader: { '.json': 'json' },
      alias: { '@engine': path.join(ROOT, 'engine'), '@project': P },
      nodePaths: NODE_PATHS,
      define: { 'process.env.NODE_ENV': '"production"' },
    });
    fs.copyFileSync(path.join(ROOT, 'engine', 'runtime', 'index.html'), path.join(dist, 'index.html'));
    fs.cpSync(path.join(ROOT, 'assets', 'fonts'), path.join(dist, 'fonts'), { recursive: true });
    const env = path.join(BUILD, 'vo_env.js');
    fs.writeFileSync(path.join(dist, 'vo_env.js'), fs.existsSync(env) ? fs.readFileSync(env) : '/* no voiceover */');
    console.log('built', path.relative(ROOT, dist));
  },

  async check() {
    await commands.timeline(); await commands.build();
    const tl = JSON.parse(fs.readFileSync(path.join(BUILD, 'timeline.json'), 'utf8'));
    const src = fs.readdirSync(P, { recursive: true }).filter((f) => /\.tsx?$/.test(f)).map((f) => fs.readFileSync(path.join(P, f), 'utf8')).join('\n');
    const ids = [...new Set(tl.shots.filter((s) => s.kind !== 'CARD').map((s) => s.shot ?? s.id))];
    const missing = ids.filter((id) => !new RegExp(`['"\\s{,]${id}\\s*:`).test(src));
    console.log(`${tl.shots.length} shots, ${(tl.total / tl.fps / 60).toFixed(1)} min.`, missing.length ? `MISSING components for: ${missing.join(', ')}` : 'All shot ids have components.');
    if (missing.length) process.exitCode = 1;
  },

  async stills() {
    needProject();
    const tl = JSON.parse(fs.readFileSync(path.join(BUILD, 'timeline.json'), 'utf8'));
    let frames = positionalNums();
    if (rest.includes('--every-shot') || rest.includes('--section') || frames.length === 0) {
      const sec = flag('--section');
      const secs = JSON.parse(fs.readFileSync(path.join(BUILD, 'sections.json'), 'utf8'));
      const range = sec !== undefined ? secs[Number(sec)] : { start: 0, end: tl.total };
      frames = tl.shots.filter((s) => s.from >= range.start && s.from < range.end).map((s) => s.from + Math.round(s.dur * 0.8));
    }
    const dir = path.join(OUT, 'stills');
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    const { chromium } = await importDep('playwright');
    const browser = await chromium.launch({ executablePath: chromiumExecutable(), args: ['--allow-file-access-from-files'] });
    const page = await browser.newPage({ viewport: { width: tl.width ?? 1920, height: tl.height ?? 1080 } });
    page.on('pageerror', (e) => console.log('pageerror:', e.message));
    await page.goto('file://' + path.join(BUILD, 'dist', 'index.html'));
    await page.waitForFunction(() => window.__ready === true);
    for (const f of frames) { await page.evaluate((n) => window.__setFrame(n), f); await page.screenshot({ path: path.join(dir, `f${String(f).padStart(6, '0')}.png`) }); }
    await browser.close();
    // contact sheets, 4×4 per page
    sh('ffmpeg', ['-v', 'error', '-y', '-pattern_type', 'glob', '-i', path.join(dir, 'f*.png'), '-vf', `scale=${(tl.width ?? 1920) > (tl.height ?? 1080) ? 480 : 270}:-1,tile=4x${(tl.width ?? 1920) > (tl.height ?? 1080) ? 4 : 2}`, path.join(dir, 'sheet_%02d.png')]);
    console.log(`${frames.length} stills → ${path.relative(ROOT, dir)} (look at sheet_*.png)`);
  },

  async render() {
    needProject();
    const tl = JSON.parse(fs.readFileSync(path.join(BUILD, 'timeline.json'), 'utf8'));
    const nums = positionalNums();
    const start = nums[0] ?? 0, end = nums[1] ?? tl.total;
    const workers = Number(flag('--workers', Math.max(1, Math.min(4, (await import('os')).cpus().length))));
    const outFile = projPath(flag('--out', 'out/video.mp4'));
    const parts = path.join(OUT, 'parts'); fs.mkdirSync(parts, { recursive: true });
    const { chromium } = await importDep('playwright');
    const browser = await chromium.launch({ executablePath: chromiumExecutable(), args: ['--allow-file-access-from-files'] });
    const per = Math.ceil((end - start) / workers);
    let done = 0; const t0 = Date.now();
    const work = async (w) => {
      const a = start + w * per, b = Math.min(end, a + per);
      if (a >= b) return null;
      const part = path.join(parts, `part${w}.mp4`);
      const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(tl.fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(tl.fps), part], { stdio: ['pipe', 'inherit', 'inherit'] });
      const page = await browser.newPage({ viewport: { width: tl.width ?? 1920, height: tl.height ?? 1080 } });
      page.on('pageerror', (e) => console.log('pageerror:', e.message));
      await page.goto('file://' + path.join(BUILD, 'dist', 'index.html'));
      await page.waitForFunction(() => window.__ready === true);
      for (let f = a; f < b; f++) {
        await page.evaluate((n) => window.__setFrame(n), f);
        const buf = await page.screenshot({ type: 'jpeg', quality: 93 });
        if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
        if (++done % 300 === 0) { const s = (Date.now() - t0) / 1000; console.log(`${done}/${end - start} frames, ${(done / s).toFixed(1)} fps, eta ${((end - start - done) / (done / s) / 60).toFixed(1)} min`); }
      }
      ff.stdin.end(); await new Promise((r) => ff.on('close', r)); await page.close();
      return part;
    };
    const files = (await Promise.all([...Array(workers).keys()].map(work))).filter(Boolean);
    await browser.close();
    const list = path.join(parts, 'list.txt');
    fs.writeFileSync(list, files.map((p) => `file '${p}'`).join('\n'));
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', outFile]);
    console.log('wrote', path.relative(ROOT, outFile), `in ${((Date.now() - t0) / 60000).toFixed(1)} min`);
  },

  sfx() { needProject(); sh(python(), [path.join(ROOT, 'scripts', 'sfx.py'), path.join(BUILD, 'cues.json'), path.join(BUILD, 'sfx.wav')]); },

  mux() {
    needProject();
    const video = projPath(flag('--video', 'out/video.mp4'));
    const tl = JSON.parse(fs.readFileSync(path.join(BUILD, 'timeline.json'), 'utf8'));
    const out = path.join(OUT, `${projectName}.mp4`);
    // the aligner may have written a version with long dead air shortened; timings refer to that one
    const hqSrc = ['voiceover_hq.wav', 'voiceover_hq.flac', 'voiceover_hq.aiff', 'voiceover_hq.m4a'].some((f) => fs.existsSync(path.join(P, f)));
    if (hqSrc) sh(python(), [path.join(ROOT, 'scripts', 'apply_cuts.py'), P]);
    const vo = [path.join(BUILD, 'voiceover_edit_hq.wav'), path.join(BUILD, 'voiceover_edit.m4a'), ...['voiceover.mp3', 'voiceover.wav', 'voiceover.m4a', 'voiceover.ogg'].map((f) => path.join(P, f))].find((f) => fs.existsSync(f));
    const args = ['-v', 'error', '-y', '-i', video, '-i', path.join(BUILD, 'sfx.wav')];
    const mix = config().mix;
    const music = path.join(BUILD, 'music.wav');
    if (vo && mix) {
      // Voice-first mix: the voice is levelled, effects sit underneath and duck a little when it speaks,
      // the music bed (if any) ducks hard under the voice, and the result is normalised for the platform.
      const segs = tl.voSegments ?? [{ src: [0, null], at: tl.voOffset ?? 0 }];
      const parts = segs.map((g, i) => { const ms = Math.round(g.at * 1000); return `[2:a]atrim=start=${g.src[0]}${g.src[1] === null ? '' : `:end=${g.src[1]}`},asetpts=PTS-STARTPTS,adelay=${ms}|${ms}[v${i}]`; });
      const ins = segs.map((_, i) => `[v${i}]`).join('');
      const hasMusic = (mix.music ?? 0) > 0 && fs.existsSync(music);
      args.push('-i', vo);
      if (hasMusic) args.push('-i', music);
      const g = [
        ...parts,
        `${ins}amix=inputs=${segs.length}:normalize=0,loudnorm=I=-16:TP=-2:LRA=9,volume=${mix.voice ?? 1}[vl]`,
        `[vl]apad=whole_dur=${(tl.total / tl.fps).toFixed(3)},asplit=3[vmix][vk1][vk2]`, // pad so the ducking keys last the whole video
        `[1:a]volume=${mix.sfx ?? 0.35}[s0]`,
        `[s0][vk1]sidechaincompress=threshold=0.05:ratio=3:attack=10:release=250[s]`,
        hasMusic ? `[3:a]volume=${mix.music}[m0]` : null,
        hasMusic ? `[m0][vk2]sidechaincompress=threshold=0.03:ratio=4:attack=40:release=600[m]` : `[vk2]anullsink`,
        `[vmix][s]${hasMusic ? '[m]' : ''}amix=inputs=${hasMusic ? 3 : 2}:duration=longest:normalize=0,loudnorm=I=${mix.loudness ?? -14}:TP=-1:LRA=11,aresample=48000[a]`,
      ].filter(Boolean);
      args.push('-filter_complex', g.join(';'), '-map', '0:v', '-map', '[a]');
    } else if (vo) {
      // play each slice of the recording at its place on the video timeline (section cards open gaps)
      const segs = tl.voSegments ?? [{ src: [0, null], at: tl.voOffset ?? 0 }];
      const parts = segs.map((g, i) => { const ms = Math.round(g.at * 1000); return `[2:a]atrim=start=${g.src[0]}${g.src[1] === null ? '' : `:end=${g.src[1]}`},asetpts=PTS-STARTPTS,adelay=${ms}|${ms}[v${i}]`; });
      const ins = segs.map((_, i) => `[v${i}]`).join('');
      args.push('-i', vo, '-filter_complex', `${parts.join(';')};[1:a]volume=0.55[s];[s]${ins}amix=inputs=${segs.length + 1}:duration=first:normalize=0[a]`, '-map', '0:v', '-map', '[a]');
    } else args.push('-map', '0:v', '-map', '1:a');
    args.push('-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out);
    sh('ffmpeg', args);
    console.log('wrote', path.relative(ROOT, out));
  },

  /** Separate tracks for editing elsewhere: voice, effects, music, the picture with no voice, and the edit list. */
  stems() {
    needProject();
    const tl = JSON.parse(fs.readFileSync(path.join(BUILD, 'timeline.json'), 'utf8'));
    const dir = path.join(OUT, 'stems'); fs.mkdirSync(dir, { recursive: true });
    const hqSrc = ['voiceover_hq.wav', 'voiceover_hq.flac', 'voiceover_hq.aiff', 'voiceover_hq.m4a'].some((f) => fs.existsSync(path.join(P, f)));
    if (hqSrc) sh(python(), [path.join(ROOT, 'scripts', 'apply_cuts.py'), P]);
    const vo = [path.join(BUILD, 'voiceover_edit_hq.wav'), path.join(BUILD, 'voiceover_edit.m4a')].find((f) => fs.existsSync(f));
    const total = (tl.total / tl.fps).toFixed(3);
    // voice laid out on the video timeline (card gaps included), full length, 24-bit 48 kHz
    if (vo) {
      const segs = tl.voSegments ?? [{ src: [0, null], at: tl.voOffset ?? 0 }];
      const parts = segs.map((g, i) => { const ms = Math.round(g.at * 1000); return `[0:a]atrim=start=${g.src[0]}${g.src[1] === null ? '' : `:end=${g.src[1]}`},asetpts=PTS-STARTPTS,adelay=${ms}|${ms}[v${i}]`; });
      sh('ffmpeg', ['-v', 'error', '-y', '-i', vo, '-filter_complex', `${parts.join(';')};${segs.map((_, i) => `[v${i}]`).join('')}amix=inputs=${segs.length}:normalize=0,apad=whole_dur=${total},atrim=end=${total}[a]`, '-map', '[a]', '-ar', '48000', '-c:a', 'pcm_s24le', path.join(dir, '1-voice.wav')]);
    }
    const fx = path.join(BUILD, 'sfx.wav'), music = path.join(BUILD, 'music.wav');
    if (fs.existsSync(fx)) sh('ffmpeg', ['-v', 'error', '-y', '-i', fx, '-af', `apad=whole_dur=${total},atrim=end=${total}`, '-ar', '48000', '-c:a', 'pcm_s24le', path.join(dir, '2-sfx.wav')]);
    if (fs.existsSync(music)) sh('ffmpeg', ['-v', 'error', '-y', '-i', music, '-af', `apad=whole_dur=${total},atrim=end=${total}`, '-ar', '48000', '-c:a', 'pcm_s24le', path.join(dir, '3-music.wav')]);
    const video = path.join(OUT, 'video.mp4');
    if (fs.existsSync(video) && fs.existsSync(fx)) {
      const ins = ['-i', video, '-i', path.join(dir, '2-sfx.wav'), ...(fs.existsSync(music) ? ['-i', path.join(dir, '3-music.wav')] : [])];
      const n = fs.existsSync(music) ? 2 : 1;
      sh('ffmpeg', ['-v', 'error', '-y', ...ins, '-filter_complex', n === 2 ? '[1:a][2:a]amix=inputs=2:normalize=0[a]' : '[1:a]anull[a]', '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', path.join(dir, '0-picture-and-effects-no-voice.mp4')]);
    }
    // edit list: what was cut from the original recording, and where each slice of it plays in the video
    const al = fs.existsSync(path.join(BUILD, 'vo_align.json')) ? JSON.parse(fs.readFileSync(path.join(BUILD, 'vo_align.json'), 'utf8')) : { cuts: [] };
    const mmss = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(2).padStart(5, '0')}`;
    const lines = ['# Edits made to the original voice recording (times in the ORIGINAL file)', 'cut_from,cut_to,length_s'];
    (al.cuts ?? []).forEach(([a, b]) => lines.push(`${mmss(a)},${mmss(b)},${(b - a).toFixed(2)}`));
    lines.push('', '# Where the edited voice plays in the video (section cards open gaps)', 'edited_from,edited_to,video_at');
    (tl.voSegments ?? []).forEach((g) => lines.push(`${mmss(g.src[0])},${g.src[1] === null ? 'end' : mmss(g.src[1])},${mmss(g.at)}`));
    fs.writeFileSync(path.join(dir, 'edit-list.csv'), lines.join('\n') + '\n');
    console.log('stems ->', path.relative(ROOT, dir), fs.readdirSync(dir).join(', '));
  },

  async all() { await commands.check(); if (process.exitCode) return; await commands.render(); commands.sfx(); commands.mux(); },
};

if (!cmd || !commands[cmd]) { console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0]); process.exit(cmd ? 1 : 0); }
await commands[cmd]();
