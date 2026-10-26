#!/usr/bin/env python3
"""
align_srt.py <projectDir> [fps]      (run automatically by `studio align` when voiceover.srt exists)

Times the beats to a voiceover using a subtitle file of that recording (voiceover.srt), e.g. from
CapCut / YouTube / MacWhisper auto-captions. This is far more reliable than pause matching, because
we know *what* is being said *when*.

1. Reads the SRT. Inside each caption, words get times from the audio itself: the caption's span is
   split at the pauses found in the recording and words are spread over the speech by letter count.
2. Marks disfluencies: fillers (uh, um), cut-off fragments ("em-", "intently--"), immediate
   repeats ("in, in", "comes, comes", "Do we … Do we").
3. Lines the script words up with the clean spoken words (sequence matching), so each beat starts
   when you start saying it. The caption text becomes what you actually said (minus disfluencies),
   keeping the script's *emphasis* on matched words. Beats you skipped are marked skip; spoken
   stretches that aren't in the script are attached to the beat they fall in, and listed.
4. Shortens dead air longer than voMaxPause (default 1.5 s), except next to `quiet` beats
   (tragedies keep their silences), writes build/voiceover_edit.m4a, and re-times everything to it.
5. Writes build/vo_align.json, the lip-sync envelope, and build/vo_report.md (stutters, ad-libs,
   skipped lines, wording that differs from the script).
"""
import difflib, glob, json, os, re, subprocess, sys
import numpy as np

P = sys.argv[1] if len(sys.argv) > 1 else '.'
FPS = int(sys.argv[2]) if len(sys.argv) > 2 else 30
BUILD = os.path.join(P, 'build'); os.makedirs(BUILD, exist_ok=True)
cfg = {'voMaxPause': 1.5}
if os.path.exists(os.path.join(P, 'project.json')):
    cfg.update(json.load(open(os.path.join(P, 'project.json'))))
vo = next((os.path.join(P, f) for f in ('voiceover.mp3', 'voiceover.wav', 'voiceover.m4a', 'voiceover.aac', 'voiceover.ogg') if os.path.exists(os.path.join(P, f))), None)
srt_path = os.path.join(P, 'voiceover.srt')
if not vo or not os.path.exists(srt_path):
    sys.exit('need voiceover.(mp3|wav|m4a) and voiceover.srt in ' + P)

def mmss(t):
    return f'{int(t // 60)}:{t % 60:04.1f}'

# ---------------------------------------------------------------- beats
beats, quiet = [], set()
for f in sorted(glob.glob(os.path.join(P, 'beats', '*.json'))):
    d = json.load(open(f, encoding='utf-8'))
    for s in (d if isinstance(d, list) else d.get('sections', [])):
        for b in s['beats']:
            beats.append(b)
            if b.get('quiet'):
                quiet.add(b['id'])

ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split()
TENS = 'zero ten twenty thirty forty fifty sixty seventy eighty ninety'.split()
def say(n):
    """Integer -> words. Years 1100-1999 the way they are read aloud (1739 -> seventeen thirty nine)."""
    if n < 20: return [ONES[n]]
    if n < 100: return [TENS[n // 10]] + ([ONES[n % 10]] if n % 10 else [])
    if 1100 <= n <= 1999 and n % 100:
        return say(n // 100) + (['oh'] if n % 100 < 10 else []) + say(n % 100)
    if n < 1000: return [ONES[n // 100], 'hundred'] + (['and'] + say(n % 100) if n % 100 else [])
    if n < 1000000: return say(n // 1000) + ['thousand'] + (say(n % 1000) if n % 1000 else [])
    return say(n // 1000000) + ['million'] + (say(n % 1000000) if n % 1000000 else [])
CONTRACT = {"there's": ['there', 'is'], "it's": ['it', 'is'], "that's": ['that', 'is'], "he's": ['he', 'is'], "she's": ['she', 'is'],
            "what's": ['what', 'is'], "here's": ['here', 'is'], "i'm": ['i', 'am'], "you're": ['you', 'are'], "we're": ['we', 'are'],
            "they're": ['they', 'are'], "i'll": ['i', 'will'], "we'll": ['we', 'will'], "he'd": ['he', 'would'], "i'd": ['i', 'would'],
            "can't": ['can', 'not'], "cannot": ['can', 'not'], "won't": ['will', 'not'], "don't": ['do', 'not'], "didn't": ['did', 'not'],
            "doesn't": ['does', 'not'], "isn't": ['is', 'not'], "wasn't": ['was', 'not'], "weren't": ['were', 'not'], "couldn't": ['could', 'not']}
def subs(w):
    """Normalised sub-tokens of one written/spoken token: numbers spelled out, contractions expanded."""
    raw = w.lower().replace('’', "'").replace('*', '').replace('%', ' percent')
    out = []
    for part in re.split(r'[-–—/\s]+', raw):
        num = re.sub(r'[^0-9]', '', part)
        if num and re.fullmatch(r"[^\w]*[0-9,]+(s|th|st|nd|rd)?[^\w]*", part):
            out += say(int(num[:9]))
            continue
        n = norm(part)
        if n:
            out += CONTRACT.get(n, [n])
    return out

cap_file = os.path.join(P, 'vo_captions.json')
CAPTIONS = {k: v for k, v in json.load(open(cap_file, encoding='utf-8')).items() if not k.startswith('_')} if os.path.exists(cap_file) else {}

def norm(w):
    w = w.lower().replace('’', "'").replace('*', '')
    w = re.sub(r"[^\w']", '', w)
    return {'colour': 'color', 'colours': 'colors', 'honour': 'honor', 'rumour': 'rumor', 'centre': 'center', "'cause": 'because'}.get(w, w)

# ---------------------------------------------------------------- audio
SR = 16000
def decode(path, sr):
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(sr), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768.0
def find_pauses(x, sr, thresh_db=-35.0, min_len=0.18):
    hop = sr // 100; n = len(x) // hop
    rms = np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
    quietf = 20 * np.log10(rms) < thresh_db
    out, i = [], 0
    while i < n:
        if quietf[i]:
            j = i
            while j < n and quietf[j]:
                j += 1
            if (j - i) / 100 >= min_len:
                out.append((i / 100, j / 100))
            i = j
        else:
            i += 1
    return out
audio = decode(vo, SR)
pauses = find_pauses(audio, SR, min_len=0.12)

# ---------------------------------------------------------------- SRT -> timed spoken tokens
raw = open(srt_path, encoding='utf-8-sig').read().replace('\r', '')
cues = []
for m in re.finditer(r'(\d\d):(\d\d):(\d\d)[,.](\d+)\s*-->\s*(\d\d):(\d\d):(\d\d)[,.](\d+)[^\n]*\n(.*?)(?=\n\s*\n|\Z)', raw, re.S):
    g = m.groups()
    a = int(g[0]) * 3600 + int(g[1]) * 60 + int(g[2]) + int(g[3]) / 10 ** len(g[3])
    b = int(g[4]) * 3600 + int(g[5]) * 60 + int(g[6]) + int(g[7]) / 10 ** len(g[7])
    text = re.sub(r'<[^>]+>', '', g[8]).replace('\n', ' ').strip()
    if text:
        cues.append((a, b, text))

tokens = []  # {w, n, start, end, cue}
for ci, (a, b, text) in enumerate(cues):
    toks = [t for t in re.split(r'\s+', text) if t]
    # speech segments inside the caption = caption span minus detected pauses
    segs, t = [], a
    for pa, pb in pauses:
        if pb <= a or pa >= b:
            continue
        if pa > t:
            segs.append((t, pa))
        t = max(t, pb)
    if t < b:
        segs.append((t, b))
    if not segs:
        segs = [(a, b)]
    total = sum(y - x for x, y in segs)
    lens = [max(1, len(norm(w))) for w in toks]
    L = sum(lens)
    def at(frac):
        left = frac * total
        for x, y in segs:
            if left <= y - x + 1e-9:
                return x + left
            left -= y - x
        return segs[-1][1]
    cum = 0
    for w, l in zip(toks, lens):
        tokens.append({'w': w, 'n': norm(w), 'sub': subs(w), 'start': at(cum / L), 'end': at((cum + l) / L), 'cue': ci})
        cum += l

# ---------------------------------------------------------------- disfluencies
FILLERS = {'uh', 'um', 'erm', 'er', 'uhm', 'hmm', 'mm'}
for i, t in enumerate(tokens):
    w = t['w']
    t['dis'] = None
    if t['n'] in FILLERS:
        t['dis'] = 'filler'
    elif re.search(r'(-|--|—)[,.]?$', w) and not re.search(r'\w-\w', w):
        t['dis'] = 'cut-off'
    elif re.match(r'^(\w)-\1', w.lower()):  # "a-annexed" -> "annexed"
        t['w'] = w[2:]
        t['n'] = norm(t['w']); t['sub'] = subs(t['w'])
    if not t['n'] and not t['dis']:
        t['dis'] = 'empty'
# immediate repeats ("in, in", "comes, comes", "Do we intently-- Do we intend").
# Deliberate repetition ("again, and again", "Give him a horse." / "A horse?") is kept: a repeat is
# only a stutter if the first copy doesn't end a sentence, and a 2-3 word repeat only if a cut-off
# word sits between the copies.
RHETORIC = {'again', 'very', 'no', 'bad', 'that', 'had', 'more', 'far'}
k = 0
while k < len(tokens):
    if tokens[k]['dis']:
        k += 1; continue
    nxt = [i for i in range(k, min(len(tokens), k + 12)) if not tokens[i]['dis']]
    for n in (3, 2, 1):
        if len(nxt) < 2 * n:
            continue
        A, Bq = nxt[:n], nxt[n:2 * n]
        if [tokens[i]['n'] for i in A] != [tokens[i]['n'] for i in Bq] or not all(tokens[i]['n'] for i in A):
            continue
        if re.search(r'[.?!"]$', tokens[A[-1]]['w']):
            continue  # sentence ends between the copies: deliberate
        between_cutoff = any(tokens[i]['dis'] == 'cut-off' for i in range(A[-1] + 1, Bq[0]))
        if n >= 2 and not between_cutoff:
            continue
        if n == 1 and tokens[A[0]]['n'] in RHETORIC:
            continue
        if tokens[Bq[0]]['start'] - tokens[A[-1]]['end'] > 1.2:
            continue
        for i in A:
            tokens[i]['dis'] = 'repeat'
        break
    k += 1
# retakes: "Gandhi's answer was make-- … rule-- Gandhi's answer was to make…": a false start that
# ends in a cut-off word and is then restarted from the same words. The whole first attempt goes.
for c, t in enumerate(tokens):
    if t['dis'] != 'cut-off':
        continue
    after = [i for i in range(c + 1, min(len(tokens), c + 8)) if tokens[i]['dis'] != 'cut-off' and tokens[i]['n']][:2]
    if len(after) < 2:
        continue
    for p_ in range(c - 1, max(-1, c - 16), -1):
        if p_ + 1 < c and [tokens[p_]['n'], tokens[p_ + 1]['n']] == [tokens[after[0]]['n'], tokens[after[1]]['n']] and tokens[p_]['start'] > (t['start'] - 8):
            for i in range(p_, after[0]):
                if not tokens[i]['dis'] or tokens[i]['dis'] == 'repeat':
                    tokens[i]['dis'] = 'retake'
            break
spoken = [i for i, t in enumerate(tokens) if not t['dis']]

# ---------------------------------------------------------------- script <-> speech matching
script = []  # (beat index, sub-token, emphasised)
script_raw = []  # parallel: (beat index, index of the written word within the beat)
for bi, b in enumerate(beats):
    em = False
    for ri, rw in enumerate(b['text'].split()):
        if rw.startswith('*'):
            em = True
        close = bool(re.search(r"\*[.,:;!?\"')]*$", rw))
        for sub in subs(rw):
            script.append((bi, sub, em)); script_raw.append((bi, ri))
        if close:
            em = False
# spoken sub-tokens, each pointing back to its position in `spoken`
ssub, sback = [], []
for p_, ti in enumerate(spoken):
    for sub in tokens[ti]['sub']:
        ssub.append(sub); sback.append(p_)
sm = difflib.SequenceMatcher(None, [s[1] for s in script], ssub, autojunk=False)
match_sub = {}
for blk in sm.get_matching_blocks():
    for d in range(blk.size):
        match_sub[blk.a + d] = blk.b + d
for tag, i1, i2, j1, j2 in sm.get_opcodes():  # fuzzy: "rubbles"/"rubies", "colour"/"color"
    if tag == 'replace' and (i2 - i1) == (j2 - j1):
        for d in range(i2 - i1):
            if difflib.SequenceMatcher(None, script[i1 + d][1], ssub[j1 + d]).ratio() >= 0.6:
                match_sub[i1 + d] = j1 + d
match_sp = {si: sback[j] for si, j in match_sub.items()}  # script sub-token -> position in `spoken`
matched_frac = len(match_sp) / max(1, len(script))

# first spoken position of each beat
B = len(beats)
first = [None] * B
for si, (bi, _, _) in enumerate(script):
    if si in match_sp and first[bi] is None:
        first[bi] = match_sp[si]
# a beat counts as spoken only with at least 2 matched words (or 1 for 1–2-word beats)
nmatch = [0] * B
for si, (bi, _, _) in enumerate(script):
    if si in match_sp:
        nmatch[bi] += 1
nwords = [sum(1 for s in script if s[0] == bi) for bi in range(B)]
silent = [nwords[bi] == 0 for bi in range(B)]  # no narration at all: a held visual beat
for bi in range(B):
    if nmatch[bi] < min(2, nwords[bi]):
        first[bi] = None
# enforce monotonic starts
last = -1
for bi in range(B):
    if first[bi] is not None:
        if first[bi] <= last:
            first[bi] = None
        else:
            last = first[bi]
skip = [f is None and not silent[bi] for bi, f in enumerate(first)]
kept = [bi for bi in range(B) if not skip[bi] and not silent[bi]]
if kept:
    first[kept[0]] = 0  # anything said before the first matched word belongs to the first beat

# Unmatched words just before a beat's first matched word (e.g. a sentence-opening "So" you added)
# belong to that beat, back to the previous sentence end.
matched_pos = set(match_sp.values())
for k_, bi in enumerate(kept[1:], 1):
    a = first[bi]
    floor = first[kept[k_ - 1]] + 1
    while a - 1 >= floor and (a - 1) not in matched_pos and not re.search(r'[.?!"]$', tokens[spoken[a - 1]]['w']):
        a -= 1
    if a > floor and re.search(r'[.?!"]$', tokens[spoken[a - 1]]['w']):
        first[bi] = a
# spans: beat owns spoken tokens [first[bi], next spoken beat's first)
span = {}
for k_, bi in enumerate(kept):
    a = first[bi]
    b = first[kept[k_ + 1]] if k_ + 1 < len(kept) else len(spoken)
    span[bi] = (a, b)

# emphasis carried over from the script
em_sp = {match_sp[si] for si, s in enumerate(script) if s[2] and si in match_sp}

# ---------------------------------------------------------------- report: wording differences, ad-libs
diffs, adlibs = [], []
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'equal':
        continue
    said = ' '.join(ssub[j1:j2])
    wrote = ' '.join(s[1] for s in script[i1:i2])
    t0 = tokens[spoken[sback[j1]]]['start'] if j1 < len(sback) else tokens[spoken[-1]]['end']
    if tag == 'insert' and j2 - j1 >= 4:
        adlibs.append((t0, said))
    elif tag in ('replace', 'delete', 'insert'):
        diffs.append((t0, beats[script[i1][0]]['id'] if i1 < len(script) else beats[-1]['id'], wrote, said))

# ---------------------------------------------------------------- dead air (keep silences around quiet beats)
quiet_ranges = []
for bi in kept:
    if beats[bi]['id'] in quiet:
        a, b = span[bi]
        quiet_ranges.append((tokens[spoken[a]]['start'] - 1.0, tokens[spoken[b - 1]]['end'] + 1.0))
MAX_PAUSE = float(cfg.get('voMaxPause', 1.5))
dur0 = len(audio) / SR
cuts = []
if MAX_PAUSE > 0:
    for a, b in find_pauses(audio, SR, min_len=MAX_PAUSE + 0.05):
        if a < 0.05 or b > dur0 - 0.05:
            continue
        if any(qa < b and qb > a for qa, qb in quiet_ranges):
            continue
        keep = MAX_PAUSE / 2
        cuts.append((a + keep, b - keep))
# Disfluencies are cut from the audio too, but only where the recording has a clear pause at both
# edges (word times inside a caption are estimates; a pause is a safe place to cut).
fine_pauses = find_pauses(audio, SR, min_len=0.08)
def pause_near(t, before=True, tol=0.35):
    best = None
    for a, b in fine_pauses:
        mid = (a + b) / 2
        ok = (b >= t - tol and a <= t + 0.1) if before else (a <= t + tol and b >= t - 0.1)
        if ok and (best is None or abs(mid - t) < abs((best[0] + best[1]) / 2 - t)):
            best = (a, b)
    return best
dis_cuts, dis_kept = [], []
i = 0
while i < len(tokens):
    if tokens[i]['dis'] in ('filler', 'cut-off', 'repeat', 'retake'):
        j = i
        while j + 1 < len(tokens) and tokens[j + 1]['dis'] in ('filler', 'cut-off', 'repeat', 'retake'):
            j += 1
        nxt = tokens[j + 1]['start'] if j + 1 < len(tokens) else tokens[j]['end']
        p0, p1 = pause_near(tokens[i]['start'], True), pause_near(nxt, False)
        if p0 and p1 and p1[0] > p0[1] - 0.01:
            dis_cuts.append(((p0[0] + p0[1]) / 2, (p1[0] + p1[1]) / 2))
            for q in range(i, j + 1): tokens[q]['cut'] = True
        else:
            dis_kept.append(i)
        i = j + 1
    else:
        i += 1
cuts = sorted(cuts + [c for c in dis_cuts if c[1] - c[0] > 0.05])
merged = []
for a, b in cuts:
    if merged and a <= merged[-1][1]:
        merged[-1] = (merged[-1][0], max(merged[-1][1], b))
    else:
        merged.append((a, b))
cuts = merged

def to_edit(t):
    return t - sum(min(b, t) - a for a, b in cuts if t > a)
def apply_cuts(x, sr):
    if not cuts:
        return x
    parts, lastc = [], 0
    for a, b in cuts:
        parts.append(x[lastc:int(a * sr)]); lastc = int(b * sr)
    parts.append(x[lastc:])
    return np.concatenate(parts)
edit_path = os.path.join(BUILD, 'voiceover_edit.m4a')
if cuts:
    full = apply_cuts(decode(vo, 44100), 44100)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', '44100', '-ac', '1', '-i', '-', '-c:a', 'aac', '-b:a', '128k', edit_path],
                   input=(np.clip(full, -1, 1) * 32767).astype(np.int16).tobytes(), check=True)
elif os.path.exists(edit_path):
    os.remove(edit_path)
edited = apply_cuts(audio, SR)
duration = len(edited) / SR

# ---------------------------------------------------------------- output
out = []
for bi, b in enumerate(beats):
    if silent[bi]:
        out.append({'id': b['id'], 'silent': True})
        continue
    if skip[bi]:
        out.append({'id': b['id'], 'skip': True})
        continue
    a, z = span[bi]
    # the beat starts with whatever is said first in its span, disfluencies included
    j = spoken[a - 1] + 1 if a > 0 else 0  # include a stutter right before the first clean word
    start_t = tokens[j]['start']
    end_t = tokens[spoken[z - 1]]['end']
    # Caption text. If the line was read essentially as written, show the SCRIPT's words (correct
    # spellings of names and numbers; auto-captions mishear them), timed to the voice. If it was
    # reworded or ad-libbed, show what was actually said.
    raw_words = b['text'].split()
    pos_of = {}
    for si, (sbi, ri) in enumerate(script_raw):
        if sbi == bi and si in match_sp and a <= match_sp[si] < z:
            pos_of.setdefault(ri, match_sp[si])
    content = [ri for ri, rw in enumerate(raw_words) if subs(rw)]
    ratio = len([ri for ri in content if ri in pos_of]) / max(1, len(content))
    extra = len([q for q in range(a, z) if q not in matched_pos])
    words = []
    if b['id'] in CAPTIONS:
        # hand-written caption: time its words against the speech in this beat's span
        source = 'caption'
        cw = CAPTIONS[b['id']].split()
        csub, cback = [], []
        for ci_, w in enumerate(cw):
            for sub in subs(w):
                csub.append(sub); cback.append(ci_)
        spos, ssubs = [], []
        for q in range(a, z):
            for sub in tokens[spoken[q]]['sub']:
                ssubs.append(sub); spos.append(q)
        m2 = difflib.SequenceMatcher(None, csub, ssubs, autojunk=False)
        cpos = {}
        for blk in m2.get_matching_blocks():
            for d in range(blk.size):
                cpos.setdefault(cback[blk.a + d], spos[blk.b + d])
        known = sorted(cpos.items())
        n_ = len(cw)
        for ci_, w in enumerate(cw):
            if ci_ in cpos:
                t = tokens[spoken[cpos[ci_]]]; st, en = t['start'], t['end']
            else:
                prv = [(r, p) for r, p in known if r < ci_]; nx = [(r, p) for r, p in known if r > ci_]
                lo = tokens[spoken[prv[-1][1]]]['end'] if prv else start_t
                hi = tokens[spoken[nx[0][1]]]['start'] if nx else end_t
                r0 = prv[-1][0] if prv else -1; r1 = nx[0][0] if nx else n_
                st = lo + (hi - lo) * (ci_ - r0 - 1) / max(1, r1 - r0 - 1)
                en = lo + (hi - lo) * (ci_ - r0) / max(1, r1 - r0 - 1)
            words.append({'w': w, 'start': round(to_edit(st), 3), 'end': round(to_edit(max(st, en)), 3)})
        text = cw
    elif ratio >= 0.75 and extra <= 2:
        source = 'script'
        known = sorted(pos_of.items())
        for ri, rw in enumerate(raw_words):
            if ri in pos_of:
                t = tokens[spoken[pos_of[ri]]]; st, en = t['start'], t['end']
            else:  # not heard (or misheard): place it between its neighbours
                prv = [p for r, p in known if r < ri]; nx = [p for r, p in known if r > ri]
                st = tokens[spoken[prv[-1]]]['end'] if prv else tokens[spoken[a]]['start']
                en = tokens[spoken[nx[0]]]['start'] if nx else max(st, tokens[spoken[z - 1]]['end'])
            words.append({'w': rw, 'start': round(to_edit(st), 3), 'end': round(to_edit(max(st, en)), 3)})
        text = list(raw_words)
    else:
        source = 'spoken'
        text = []
        for q in range(a, z):
            t = tokens[spoken[q]]
            w = t['w']
            if q in em_sp:
                w = '*' + w + '*'
            text.append(w)
            words.append({'w': w, 'start': round(to_edit(t['start']), 3), 'end': round(to_edit(t['end']), 3)})
    out.append({'id': b['id'], 'start': round(to_edit(start_t), 3), 'end': round(to_edit(end_t), 3), 'text': ' '.join(text), 'source': source, 'words': words})
json.dump({'duration': duration, 'method': 'srt', 'file': os.path.relpath(edit_path if cuts else vo, P), 'cuts': cuts, 'beats': out},
          open(os.path.join(BUILD, 'vo_align.json'), 'w'), indent=1)

# lip-sync envelope from the edited recording (per frame of the recording)
hop = SR // FPS; n = len(edited) // hop
rms = np.sqrt(np.mean(edited[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
db = 20 * np.log10(rms)
sp_db = db[db > np.percentile(db, 30)]
lo, hi = np.percentile(sp_db, 20), np.percentile(sp_db, 70)
state = np.where(db > hi, 2, np.where(db > lo, 1, 0))
state[1::2] = state[0::2][: len(state[1::2])]
open(os.path.join(BUILD, 'vo_env_src.txt'), 'w').write(''.join(str(int(s)) for s in state))

# ---------------------------------------------------------------- human-readable report
dis = [t for t in tokens if t['dis'] in ('filler', 'cut-off', 'repeat', 'retake')]
R = ['# Voiceover report', '',
     f'- Recording: {mmss(dur0)}; after shortening {len(cuts)} long pauses: {mmss(duration)}',
     f'- Script words matched in the recording: {matched_frac:.0%}',
     f'- Beats spoken: {len(kept)} of {B}; skipped: {sum(skip)}',
     f'- Stutters, restarts, retakes and fillers removed from the captions: {len(dis)} words; '
     f'cut from the audio as well: {sum(1 for t in dis if t.get("cut"))} (only where clean pauses made a safe cut possible)', '']
R += ['## Stutters / restarts / retakes / fillers', '', '| Time in your recording | Word | Kind | Audio |', '|---|---|---|---|']
R += [f'| {mmss(t["start"])} | {t["w"]} | {t["dis"]} | {"cut" if t.get("cut") else "kept"} |' for t in dis]
R += ['', '## Beats not found in the recording (dropped from the video)', '']
R += [f'- `{beats[bi]["id"]}`: {beats[bi]["text"]}' for bi in range(B) if skip[bi]] or ['- none']
R += ['', '## Things you said that are not in the script (kept, attached to the surrounding beat)', '']
R += [f'- {mmss(t)}: "{s}"' for t, s in adlibs] or ['- none']
spoken_src = [o for o in out if o.get('source') == 'spoken']
cap_src = [o for o in out if o.get('source') == 'caption']
R += ['', f'## Lines read differently from the script ({len(spoken_src)}): captions show what you said', '',
      '(Lines read essentially as written keep the script\'s wording and spelling, timed to your voice, because auto-captions mishear names and numbers.)', '',
      '| Beat | Script | Captions (what you said) |', '|---|---|---|']
bt = {b['id']: b['text'] for b in beats}
R += [f'| {o["id"]} | {bt[o["id"]]} | {o["text"]} |' for o in spoken_src]
R += ['', f'## Lines with hand-written captions from vo_captions.json ({len(cap_src)})', '', '| Beat | Script | Caption |', '|---|---|---|']
R += [f'| {o["id"]} | {bt[o["id"]]} | {o["text"]} |' for o in cap_src]
open(os.path.join(BUILD, 'vo_report.md'), 'w').write('\n'.join(R) + '\n')
print(f'srt alignment: {len(kept)}/{B} beats, {matched_frac:.0%} of script words matched; {len(dis)} disfluencies; '
      f'{sum(skip)} beats skipped; {len(adlibs)} ad-libs; cut {len(cuts)} pauses and disfluencies -> build/vo_align.json, build/vo_report.md')
