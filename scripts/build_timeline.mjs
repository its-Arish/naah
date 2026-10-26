#!/usr/bin/env node
/**
 * build_timeline.mjs <projectDir>
 *
 * beats/*.json (sorted by file name)  →  build/timeline.json   frames for every shot and word
 *                                        build/cues.json       sound effects + ambience, in seconds
 *                                        build/sections.json   frame range of each section
 *
 * Each beats file is either { "title"?, "sections": [...] } or a bare array of sections.
 * A section is { "title": "Act 1: Name", "card"?: false, "beats": [...] }.
 * A beat is   { "id", "shot"?, "type": HOST|STORY|INSERT|SKETCH, "text", "speaker"?, "date"?,
 *               "gag"?, "quiet"?, "hold"?, "amb"?, "sfx"?: [[kind, offset, volume?]] }
 *   offset = frame number within the beat | "w:word" (lands on that word) | "end"
 *
 * Timing without voiceover:  max(3 s, words / wordsPerSecond + 0.85 s), +1 s for gags,
 *                            +0.4 s on the last beat of a section; words reveal over ≤70 % of the beat.
 * Timing with voiceover:     if build/vo_align.json exists (made by `studio align`), every beat
 *                            starts when its narration starts in the audio and words appear when
 *                            they are spoken. Each section card cuts the recording in the pause
 *                            before the section and holds it for the card's length (voSegments),
 *                            so the speaker is never interrupted mid-sentence and lip-sync stays exact.
 */
import fs from 'fs';
import path from 'path';

const P = path.resolve(process.argv[2] ?? '.');
const BUILD = path.join(P, 'build');
fs.mkdirSync(BUILD, { recursive: true });

const cfg = { fps: 30, wordsPerSecond: 3.2, openingSeconds: 4.5, cardSeconds: 2.2, endSeconds: 4.5, ...(fs.existsSync(path.join(P, 'project.json')) ? JSON.parse(fs.readFileSync(path.join(P, 'project.json'), 'utf8')) : {}) };
const FPS = cfg.fps, WPS = cfg.wordsPerSecond;

// ---------------------------------------------------------------- load beats
const beatDir = path.join(P, 'beats');
if (!fs.existsSync(beatDir)) { console.error(`No beats/ folder in ${P}. Run "studio draft" first.`); process.exit(1); }
const sections = [];
for (const f of fs.readdirSync(beatDir).filter((n) => n.endsWith('.json')).sort()) {
  let data;
  try { data = JSON.parse(fs.readFileSync(path.join(beatDir, f), 'utf8')); } catch (e) { console.error(`beats/${f}: invalid JSON — ${e.message}`); process.exit(1); }
  sections.push(...(Array.isArray(data) ? data : data.sections ?? []));
}

// sanity checks that catch the usual authoring mistakes early
const seen = new Set(); const problems = [];
sections.forEach((sec, si) => (sec.beats ?? []).forEach((b, bi) => {
  const where = `section ${si} "${sec.title}", beat ${bi}`;
  if (!b.id) problems.push(`${where}: missing "id"`);
  else if (seen.has(b.id)) problems.push(`${where}: duplicate id "${b.id}"`);
  seen.add(b.id);
  if (typeof b.text !== 'string') problems.push(`${where}: missing "text"`);
  if (!['HOST', 'STORY', 'INSERT', 'SKETCH'].includes(b.type)) problems.push(`${where}: type must be HOST, STORY, INSERT or SKETCH (got ${b.type})`);
}));
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }

// ---------------------------------------------------------------- voiceover alignment (optional)
const alignFile = path.join(BUILD, 'vo_align.json');
const align = fs.existsSync(alignFile) ? JSON.parse(fs.readFileSync(alignFile, 'utf8')) : null;
const voById = align ? Object.fromEntries(align.beats.map((b) => [b.id, b])) : null;
if (align) {
  const missing = sections.flatMap((s) => s.beats).filter((b) => !voById[b.id]).map((b) => b.id);
  if (missing.length) { console.error(`vo_align.json has no timing for: ${missing.slice(0, 10).join(', ')}… — re-run "studio align".`); process.exit(1); }
}

// ---------------------------------------------------------------- helpers
const tokenize = (text) => {
  const out = []; let em = false;
  for (const raw of text.split(/\s+/).filter(Boolean)) {
    let w = raw;
    if (w.startsWith('*')) { em = true; w = w.slice(1); }
    const close = /\*[.,:;!?"')]*$/.test(w); w = w.replace(/\*/g, '');
    out.push({ w, em });
    if (close) em = false;
  }
  return out;
};
const norm = (s) => s.replace(/\*/g, '').toLowerCase();
const F = (sec) => Math.round(sec * FPS);

const shots = [], cues = [], amb = [];
let t = 0;
const OPEN = F(cfg.openingSeconds), CARD = F(cfg.cardSeconds), END = F(cfg.endSeconds);
shots.push({ id: 'opening', kind: 'OPENING', from: 0, dur: OPEN }); t += OPEN;
cues.push(['drum', 0.2, 0.9], ['paper', 0.5, 0.6]);
const voOffset = align ? cfg.openingSeconds : 0; // voiceover audio starts after the opening
// With a voiceover, section cards open gaps in it: voSegments says which slice of the recording plays when.
const voSegments = [];
let shift = 0, shiftAtSeg = 0, segSrc = 0, afterCard = false;

let lastDate = null, lastShot = 'opening';
// With a voiceover, beats the reader skipped (vo_align "skip") are dropped; "bi" and "last" are
// recomputed so section cards still open on the first beat that is actually spoken.
const flat = sections.flatMap((sec, si) => {
  const kept = sec.beats.filter((b) => !(align && voById[b.id]?.skip));
  return kept.map((b, bi) => ({ sec, si, b, bi, last: bi === kept.length - 1 }));
});

flat.forEach(({ sec, si, b, bi, last }, k) => {
  // ---------- section card
  if (bi === 0 && sec.card !== false) {
    if (!align) {
      shots.push({ id: 'card' + si, kind: 'CARD', title: sec.title, n: si, from: t, dur: CARD });
      cues.push(['whoosh', t / FPS, 0.7], ['paper', t / FPS + 0.15, 0.7]);
      t += CARD; lastShot = 'card';
    } else {
      // Cut the voiceover in the pause before this section and open a gap for the card.
      const v = voById[b.id];
      const prevV = k > 0 ? voById[flat[k - 1].b.id] : null;
      const cut = prevV ? (prevV.end + v.start) / 2 : 0;
      const cardFrom = OPEN + F(cut) + shift;
      const prev = shots[shots.length - 1];
      if (prev.words) prev.dur = cardFrom - prev.from;
      voSegments.push({ src: [segSrc, cut], at: (OPEN + F(segSrc) + shiftAtSeg) / FPS });
      segSrc = cut;
      shots.push({ id: 'card' + si, kind: 'CARD', title: sec.title, n: si, from: cardFrom, dur: CARD });
      cues.push(['whoosh', cardFrom / FPS, 0.7], ['paper', cardFrom / FPS + 0.15, 0.7]);
      shift += CARD; shiftAtSeg = shift;
      t = cardFrom + CARD; lastShot = 'card'; afterCard = true;
    }
  }

  // ---------- the beat (captions show what was actually said when the alignment provides it)
  const words = tokenize(align && voById[b.id].text ? voById[b.id].text : b.text);
  const lead = 6;
  let from = t, dur, ws, talkEnd;
  if (!align) {
    let s = b.hold ?? Math.max(b.type === 'SKETCH' ? 2.0 : 3.0, words.length / WPS + (b.type === 'SKETCH' ? 0.7 : 0.85));
    if (b.gag) s += 1.0;
    if (last) s += 0.4;
    dur = F(s);
    const revealSpan = F(Math.min(words.length / WPS, s * 0.7));
    ws = words.map((w, i) => ({ ...w, at: lead + Math.round((i / Math.max(1, words.length)) * revealSpan) }));
    talkEnd = lead + revealSpan + 4;
  } else if (voById[b.id].silent) {
    // A beat with no narration (a visual gag, a black screen): cut the recording in the pause
    // here and hold the picture for the beat's "hold" seconds, like a section card.
    const spokenV = (dir) => { for (let q = k + dir; q >= 0 && q < flat.length; q += dir) { const x = voById[flat[q].b.id]; if (!x.silent) return x; } return null; };
    const pv = spokenV(-1), nv = spokenV(1);
    const cut = pv && nv ? (pv.end + nv.start) / 2 : pv ? pv.end + 0.2 : 0;
    from = Math.max(t, OPEN + F(cut) + shift);
    const prev = shots[shots.length - 1];
    if (prev.words && prev.words.length) prev.dur = from - prev.from;
    voSegments.push({ src: [segSrc, cut], at: (OPEN + F(segSrc) + shiftAtSeg) / FPS });
    segSrc = cut;
    dur = F(b.hold ?? 2.5); ws = []; talkEnd = 0;
    shift += from + dur - (OPEN + F(cut) + shift); shiftAtSeg = shift;
    afterCard = true;
  } else {
    const v = voById[b.id];
    const startAbs = OPEN + F(v.start) + shift;
    const prev = shots[shots.length - 1];
    if (afterCard || !prev.words) from = t; // right after the opening or a card: start now, words appear when spoken
    else { prev.dur = Math.max(F(0.5), startAbs - prev.from); from = prev.from + prev.dur; }
    afterCard = false;
    dur = Math.max(F(1), startAbs - from + F(v.end - v.start) + F(0.8)); // provisional; the next beat trims it
    const vw = v.words && v.words.length === words.length ? v.words : null;
    const span = F(v.end - v.start);
    const off = startAbs - from;
    ws = words.map((w, i) => ({ ...w, at: Math.max(0, vw ? OPEN + F(vw[i].start) + shift - from : off + Math.round((i / Math.max(1, words.length)) * span)) }));
    talkEnd = off + span;
  }
  const date = b.date ?? null;
  const shotId = b.shot ?? b.id;
  shots.push({ id: b.id, shot: shotId, kind: b.type, speaker: b.speaker, section: sec.title, from, dur, words: ws, gag: !!b.gag, date, prevDate: date === null ? null : lastDate, talkEnd });

  // ---------- automatic sound cues
  const T = from / FPS;
  const scene = shotId.replace(/\d+$/, '');
  if (!b.quiet && scene !== lastShot.replace(/\d+$/, '') && b.type !== 'HOST') cues.push(['whoosh', T, 0.35]);
  if (date !== null && lastDate !== null && date !== lastDate) cues.push(['ticks', T + 0.05, 0.45]);
  if (b.type === 'SKETCH' && !b.quiet) cues.push(['blip', T + 0.15, 0.5]);
  if (!b.quiet) ws.forEach((w) => { if (w.em && b.type !== 'SKETCH') cues.push(['tick', T + w.at / FPS, 0.25]); });

  // ---------- authored cues
  (b.sfx ?? []).forEach(([kind, off, vol]) => {
    let s2 = 0;
    if (off === 'end') s2 = Math.max(0, dur / FPS - 1.0);
    else if (typeof off === 'string' && off.startsWith('w:')) {
      const target = norm(off.slice(2));
      const hit = ws.find((w) => norm(w.w) === target) ?? ws.find((w) => norm(w.w).replace(/[^\w]/g, '').startsWith(target.replace(/[^\w]/g, '')));
      if (!hit) console.warn(`warning: beat ${b.id}: sfx word "${off.slice(2)}" not found in text`);
      s2 = hit ? hit.at / FPS : 0.3;
    } else s2 = Number(off) / FPS;
    cues.push([kind, T + s2, vol ?? 0.8, kind === 'gallop' ? dur / FPS - s2 : undefined]);
  });
  if (b.amb) amb.push([b.amb, T, T + dur / FPS]);
  lastDate = date; lastShot = shotId; t = from + dur;
});

if (align) {
  voSegments.push({ src: [segSrc, null], at: (OPEN + F(segSrc) + shiftAtSeg) / FPS });
  // lip-sync envelope: re-time the per-frame loudness of the recording onto the video timeline
  const envSrcFile = path.join(BUILD, 'vo_env_src.txt');
  if (fs.existsSync(envSrcFile)) {
    const src = fs.readFileSync(envSrcFile, 'utf8').trim();
    const total = t + END;
    const env = new Array(total).fill('0');
    for (const sg of voSegments) {
      const a = F(sg.src[0]), b = sg.src[1] === null ? src.length : F(sg.src[1]), at = F(sg.at);
      for (let i = a; i < b && at + i - a < total; i++) env[at + i - a] = src[i] ?? '0';
    }
    fs.writeFileSync(path.join(BUILD, 'vo_env.js'), 'window.__voEnv = "' + env.join('') + '";\n');
  }
}
shots.push({ id: 'end', kind: 'END', from: t, dur: END }); cues.push(['drum', t / FPS + 0.2, 0.8]); t += END;

// merge consecutive ambience segments
const merged = [];
amb.forEach(([k, a, b]) => { const l = merged[merged.length - 1]; if (l && l[0] === k && Math.abs(l[2] - a) < 0.05) l[2] = b; else merged.push([k, a, b]); });
const secs = [];
shots.forEach((sh) => { const k = sh.section ?? sh.title; if (!k) return; const l = secs[secs.length - 1]; if (l && l.title === k) l.end = sh.from + sh.dur; else secs.push({ title: k, start: sh.from, end: sh.from + sh.dur }); });

fs.writeFileSync(path.join(BUILD, 'sections.json'), JSON.stringify(secs, null, 1));
fs.writeFileSync(path.join(BUILD, 'timeline.json'), JSON.stringify({ fps: FPS, total: t, voOffset, voSegments: align ? voSegments : undefined, shots }, null, 1));
fs.writeFileSync(path.join(BUILD, 'cues.json'), JSON.stringify({ duration: t / FPS, cues, amb: merged }, null, 1));
const n = shots.filter((s) => s.words).length;
const mmss = `${Math.floor(t / FPS / 60)}:${String(Math.round((t / FPS) % 60)).padStart(2, '0')}`;
console.log(`${n} beats in ${secs.length} sections, ${t} frames = ${mmss}${align ? ' (timed to voiceover)' : ''}; ${cues.length} sound cues`);
