#!/usr/bin/env python3
"""
align_voiceover.py <projectDir> [fps]

Times every beat to a recorded voiceover (voiceover.mp3 / .wav / .m4a in the project folder).

Writes
  build/vo_align.json   {"duration": s, "method": ..., "beats": [{"id", "start", "end", "words"?: [{"w","start","end"}]}]}
                        (times in seconds from the start of the voiceover file)
  build/vo_env_src.txt  one mouth state per frame of the recording (0 closed, 1 half, 2 open);
                        `studio timeline` turns it into build/vo_env.js on the video's timeline,
                        so the narrator's lips follow the actual voice.

Method
  1. If faster-whisper or openai-whisper is installed: word-level timestamps, matched to the
     script words in order (robust to small differences between script and reading).
  2. Otherwise: the pauses in the recording are detected and dynamic programming places every
     beat boundary on a pause so that each beat's speaking time best matches its text at the
     reader's local pace (robust to speeding up / slowing down over a long read). Beats whose
     spoken length is far from their text are listed, which usually means a skipped or added line.
Before aligning, pauses longer than voMaxPause (project.json, default 1.5 s; 0 = keep) are
shortened; the edited recording is build/voiceover_edit.m4a and is what gets mixed.

The video's opening title plays before the voiceover starts; section cards open short gaps in it.
"""
import json, os, re, subprocess, sys, glob
import numpy as np

P = sys.argv[1] if len(sys.argv) > 1 else '.'
FPS = int(sys.argv[2]) if len(sys.argv) > 2 else 30
BUILD = os.path.join(P, 'build')
os.makedirs(BUILD, exist_ok=True)

vo = next((os.path.join(P, f) for f in ('voiceover.mp3', 'voiceover.wav', 'voiceover.m4a', 'voiceover.aac', 'voiceover.ogg') if os.path.exists(os.path.join(P, f))), None)
if not vo:
    sys.exit('No voiceover.mp3/.wav/.m4a in ' + P)
# A subtitle file of the recording (voiceover.srt) gives far better timing: use it when present.
if os.path.exists(os.path.join(P, 'voiceover.srt')):
    r = subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'align_srt.py'), P, str(FPS)])
    sys.exit(r.returncode)
cfg = {'openingSeconds': 4.5}
if os.path.exists(os.path.join(P, 'project.json')):
    cfg.update(json.load(open(os.path.join(P, 'project.json'))))

# ---------------------------------------------------------------- beats
beats = []
for f in sorted(glob.glob(os.path.join(P, 'beats', '*.json'))):
    d = json.load(open(f, encoding='utf-8'))
    for s in (d if isinstance(d, list) else d.get('sections', [])):
        beats.extend(s['beats'])
if not beats:
    sys.exit('No beats yet — run "studio draft" first.')
clean = lambda w: re.sub(r"[^\w']", '', w.replace('*', '')).lower()
beat_words = [[clean(w) for w in b['text'].split() if clean(w)] for b in beats]

# ---------------------------------------------------------------- audio
SR = 16000
def decode(path, sr):
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(sr), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768.0

def find_pauses(x, sr, thresh_db=-35.0, min_len=0.18):
    """Runs of 10 ms frames quieter than thresh_db lasting at least min_len seconds -> [(start, end)]."""
    hop = sr // 100
    n = len(x) // hop
    rms = np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
    quiet = 20 * np.log10(rms) < thresh_db
    out, i = [], 0
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]:
                j += 1
            if (j - i) / 100 >= min_len:
                out.append((i / 100, j / 100))
            i = j
        else:
            i += 1
    return out

audio = decode(vo, SR)
# Long dead air (> voMaxPause s, default 1.5) is shortened so the film keeps its pace.
# The edited recording is written to build/voiceover_edit.m4a and used for everything after this.
MAX_PAUSE = float(cfg.get('voMaxPause', 1.5))
cuts = []  # (start, end) seconds removed from the original
if MAX_PAUSE > 0:
    for a, b in find_pauses(audio, SR, min_len=MAX_PAUSE + 0.05):
        if a < 0.05 or b > len(audio) / SR - 0.05:
            continue  # leading/trailing silence is handled below
        keep = MAX_PAUSE / 2
        cuts.append((a + keep, b - keep))
def apply_cuts(x, sr):
    if not cuts:
        return x
    parts, last = [], 0
    for a, b in cuts:
        parts.append(x[last:int(a * sr)]); last = int(b * sr)
    parts.append(x[last:])
    return np.concatenate(parts)
edit_path = os.path.join(BUILD, 'voiceover_edit.m4a')
if cuts:
    full = apply_cuts(decode(vo, 44100), 44100)
    enc = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', '44100', '-ac', '1', '-i', '-', '-c:a', 'aac', '-b:a', '128k', edit_path], input=(np.clip(full, -1, 1) * 32767).astype(np.int16).tobytes())
    audio = apply_cuts(audio, SR)
    removed = sum(b - a for a, b in cuts)
    print(f'shortened {len(cuts)} long pauses (saved {removed:.1f} s) -> build/voiceover_edit.m4a')
    vo_used = edit_path
else:
    if os.path.exists(edit_path):
        os.remove(edit_path)
    vo_used = vo
duration = len(audio) / SR

# ---------------------------------------------------------------- word timestamps
def whisper_words():
    try:
        from faster_whisper import WhisperModel
        model = WhisperModel(os.environ.get('WHISPER_MODEL', 'base.en'), compute_type='int8')
        segs, _ = model.transcribe(vo_used, word_timestamps=True)
        return [(clean(w.word), w.start, w.end) for s in segs for w in s.words if clean(w.word)]
    except ImportError:
        pass
    try:
        import whisper
        model = whisper.load_model(os.environ.get('WHISPER_MODEL', 'base.en'))
        r = model.transcribe(vo_used, word_timestamps=True)
        return [(clean(w['word']), w['start'], w['end']) for s in r['segments'] for w in s.get('words', []) if clean(w['word'])]
    except ImportError:
        return None

def align_with_words(heard):
    """Match script words to heard words in order (greedy with a small look-ahead)."""
    script = [(bi, w) for bi, ws in enumerate(beat_words) for w in ws]
    times = [None] * len(script)
    j = 0
    for i, (_, w) in enumerate(script):
        for k in range(j, min(j + 8, len(heard))):
            if heard[k][0] == w or (len(w) > 3 and heard[k][0][:4] == w[:4]):
                times[i] = (heard[k][1], heard[k][2]); j = k + 1; break
    # interpolate the words that were not matched
    known = [i for i, t in enumerate(times) if t]
    if not known:
        return None
    for i in range(len(times)):
        if times[i] is None:
            prev = max([k for k in known if k < i], default=None)
            nxt = min([k for k in known if k > i], default=None)
            a = times[prev][1] if prev is not None else 0.0
            b = times[nxt][0] if nxt is not None else duration
            lo = prev if prev is not None else -1
            hi = nxt if nxt is not None else len(times)
            frac = (i - lo) / (hi - lo)
            s = a + (b - a) * frac
            times[i] = (s, min(b, s + 0.25))
    out, i = [], 0
    for bi, b in enumerate(beats):
        ws = []
        for w in b['text'].split():
            if not clean(w):
                ws.append({'w': w, 'start': ws[-1]['start'] if ws else (times[i][0] if i < len(times) else 0), 'end': ws[-1]['end'] if ws else 0}); continue
            ws.append({'w': w, 'start': round(times[i][0], 3), 'end': round(times[i][1], 3)}); i += 1
        out.append({'id': b['id'], 'start': ws[0]['start'], 'end': ws[-1]['end'], 'words': ws})
    return out

# ---------------------------------------------------------------- syllables (text and audio)
NUM = {'0': 1, '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 2, '8': 1, '9': 1}
def text_syllables(word):
    w = word.replace('*', '').lower()
    digits = re.sub(r'[^0-9]', '', w)
    if digits:  # "1739" -> "seventeen thirty-nine": roughly 1.4 syllables per digit
        return max(1, round(1.4 * len(digits))) + (1 if '%' in w else 0)
    w = re.sub(r'[^a-z]', '', w)
    if not w:
        return 0
    n = len(re.findall(r'[aeiouy]+', w))
    if w.endswith('e') and not w.endswith(('le', 'ee')) and n > 1:
        n -= 1
    return max(1, n)

def audio_syllable_times(x, sr):
    """Syllable nuclei: peaks of the speech-band loudness envelope (de Jong & Wempe style)."""
    from scipy.signal import butter, sosfiltfilt, find_peaks
    sos = butter(4, [300, 2500], btype='band', fs=sr, output='sos')
    y = sosfiltfilt(sos, x)
    hop = sr // 100
    n = len(y) // hop
    env = np.sqrt(np.mean(y[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(env)
    k = np.hanning(5); db = np.convolve(db, k / k.sum(), mode='same')
    floor = np.percentile(db, 35)
    peaks, _ = find_peaks(db, height=floor + 6, prominence=2.0, distance=9)
    return peaks / 100.0

# ---------------------------------------------------------------- fallback: pauses + dynamic programming
def align_with_silence():
    """
    Every beat boundary must fall in a pause. Dynamic programming picks, out of all monotonic ways
    of placing the boundaries on the detected pauses, the one where each beat's speaking time best
    matches its length in letters at the reader's *local* pace, preferring longer pauses at
    boundaries (sentence ends, section breaks) and avoiding long pauses inside a beat.
    Two passes: the first uses the overall pace, the second a pace smoothed over neighbouring beats,
    so speeding up and slowing down across a long read doesn't make it drift.
    """
    pauses = find_pauses(audio, SR)
    speech_start = pauses[0][1] if pauses and pauses[0][0] < 0.05 else 0.0
    speech_end = pauses[-1][0] if pauses and pauses[-1][1] >= duration - 0.05 else duration
    inner = [(a, b) for a, b in pauses if a > speech_start + 0.05 and b < speech_end - 0.05]
    J = len(inner)
    plen = np.array([b - a for a, b in inner])
    # speech-only seconds before each node: node 0 = start, nodes 1..J = pauses, node J+1 = end
    sp = np.zeros(J + 2)
    acc = 0.0
    prev = speech_start
    for j, (a, b) in enumerate(inner):
        acc += a - prev; sp[j + 1] = acc; prev = b
    sp[J + 1] = acc + (speech_end - prev)
    # long pauses inside a span: prefix sums of max(0, len - 0.6)
    ex = np.concatenate([[0.0], np.cumsum(np.maximum(0, plen - 0.6)), [0.0]])
    ex[J + 1] = ex[J]
    letters = np.array([max(2, sum(len(w) for w in ws)) for ws in beat_words], dtype=float)
    tsyl = np.array([max(1, sum(text_syllables(w) for w in b['text'].split())) for b in beats], dtype=float)
    syl_t = audio_syllable_times(audio, SR)
    node_t = np.array([speech_start] + [(a + b) / 2 for a, b in inner] + [speech_end])
    sy = np.searchsorted(syl_t, node_t).astype(float)  # audio syllables before each node
    syl_ratio = (sy[J + 1] - sy[0]) / tsyl.sum()        # detector sensitivity vs text count
    last_in_section = set()
    for f in sorted(glob.glob(os.path.join(P, 'beats', '*.json'))):
        d = json.load(open(f, encoding='utf-8'))
        for sct in (d if isinstance(d, list) else d.get('sections', [])):
            if sct['beats']:
                last_in_section.add(sct['beats'][-1]['id'])
    B = len(beats)
    if J < B - 1:
        return None  # not enough pauses to separate the beats
    reward = 0.35 * np.log1p(np.concatenate([[0.0], plen, [0.0]]) / 0.25)  # longer pause, better boundary
    K = 60  # max pauses spanned by one beat
    W_T = float(os.environ.get("VO_W_TIME", cfg.get("voAlign", {}).get("time", 2.0)))  # weight: speaking time vs text length
    W_S = float(os.environ.get("VO_W_SYL", cfg.get("voAlign", {}).get("syllables", 0.0)))  # weight: syllables heard vs written

    # optional manual pins: vo_anchors.json {"beat_id": "mm:ss.s" | seconds} in the ORIGINAL recording
    anchors = {}
    af = os.path.join(P, 'vo_anchors.json')
    if os.path.exists(af):
        def secs(v):
            if isinstance(v, (int, float)):
                return float(v)
            parts = [float(x) for x in str(v).split(':')]
            return sum(x * 60 ** k for k, x in enumerate(reversed(parts)))
        to_edit = lambda t: t - sum(min(b, t) - a for a, b in cuts if t > a)
        ids = {b['id']: i for i, b in enumerate(beats)}
        for bid, v in json.load(open(af)).items():
            if bid not in ids:
                print(f'vo_anchors.json: unknown beat id {bid}'); continue
            t = to_edit(secs(v))
            anchors[ids[bid]] = int(np.argmin(np.abs(np.array([speech_start] + [b for _, b in inner]) - t)))  # node whose end ≈ t
        print(f'using {len(anchors)} manual anchors from vo_anchors.json')

    def solve(expected):
        INF = 1e18
        cost = np.full(J + 2, INF); cost[0] = 0.0
        back = np.zeros((B, J + 2), dtype=np.int32)
        for i in range(B):
            if i in anchors:  # this beat must start at its pinned pause
                keep = cost[anchors[i]]; cost = np.full(J + 2, INF); cost[anchors[i]] = keep
            new = np.full(J + 2, INF)
            nodes = np.arange(1, J + 2) if i == B - 1 else np.arange(1, J + 1)
            if i == B - 1:
                nodes = np.array([J + 1])
            bonus = reward * (3.0 if beats[i]['id'] in last_in_section else 1.0)
            for k in range(1, K + 1):
                src = nodes - k
                ok = src >= 0
                if not ok.any():
                    break
                bb, aa = nodes[ok], src[ok]
                S = np.maximum(sp[bb] - sp[aa], 0.05)
                Y = np.maximum(sy[bb] - sy[aa], 0.5)
                wgt = np.sqrt(letters[i] / 20.0) + 0.5
                c = cost[aa] + wgt * (W_T * np.log(S / expected[i]) ** 2 + W_S * np.log(Y / (tsyl[i] * syl_ratio)) ** 2) + 0.8 * (ex[bb - 1] - ex[aa]) * (bb - 1 > aa) - (bonus[bb] if i < B - 1 else 0)
                better = c < new[bb]
                new[bb[better]] = c[better]
                back[i, bb[better]] = aa[better]
            cost = new
        # walk back
        node, path = J + 1, [J + 1]
        for i in range(B - 1, -1, -1):
            node = back[i, node]; path.append(node)
        return path[::-1]  # B+1 nodes: start node of beat i = path[i], end node = path[i+1]

    rate = letters.sum() / sp[J + 1]
    path = solve(letters / rate)
    for _ in range(2):  # re-estimate the local pace and solve again
        spent = np.array([max(0.3, sp[path[i + 1]] - sp[path[i]]) for i in range(B)])
        local = np.array([letters[max(0, i - 12): i + 13].sum() / spent[max(0, i - 12): i + 13].sum() for i in range(B)])
        path = solve(letters / local)

    def node_end(n):   # when speech resumes after node n
        return speech_start if n == 0 else inner[n - 1][1]
    def node_start(n): # when speech stops at node n
        return speech_end if n == J + 1 else inner[n - 1][0]
    out, flagged = [], []
    for i, b in enumerate(beats):
        s0, e0 = node_end(path[i]), node_start(path[i + 1])
        # words: share the speech-only time inside the beat by letter count, skipping internal pauses
        segs, t = [], s0
        for j in range(path[i] + 1, path[i + 1]):
            segs.append((t, inner[j - 1][0])); t = inner[j - 1][1]
        segs.append((t, e0))
        total = sum(max(0, y - x) for x, y in segs) or 1e-6
        toks = b['text'].split()
        wl = [max(1, len(clean(w))) for w in toks]
        def at(frac):
            left = frac * total
            for x, y in segs:
                if left <= y - x:
                    return x + left
                left -= y - x
            return segs[-1][1]
        cum, words = 0, []
        for w, L in zip(toks, wl):
            words.append({'w': w, 'start': round(at(cum / sum(wl)), 3), 'end': round(at((cum + L) / sum(wl)), 3)}); cum += L
        out.append({'id': b['id'], 'start': round(s0, 3), 'end': round(e0, 3), 'words': words})
        ratio = (sp[path[i + 1]] - sp[path[i]]) * local[i] / letters[i]
        if ratio < 0.55 or ratio > 1.8:
            orig = s0
            for ca, cb in cuts:  # report in the ORIGINAL recording's time, like vo_anchors.json
                if ca < orig:
                    orig += cb - ca
            flagged.append((b['id'], round(float(ratio), 2), round(orig, 1)))
    if flagged:
        print(f'{len(flagged)} beats whose spoken length is far from their text (skipped/added lines? pin them in vo_anchors.json):')
        for fid, r, t0 in flagged:
            print(f'   {fid}: {r}x expected, at {int(t0 // 60)}:{t0 % 60:04.1f} in your recording')
    return out

heard = whisper_words()
result = align_with_words(heard) if heard else None
method = 'whisper' if result else 'silence'
if not result:
    result = align_with_silence()
json.dump({'duration': duration, 'method': method, 'file': os.path.relpath(vo_used, P), 'cuts': cuts, 'beats': result}, open(os.path.join(BUILD, 'vo_align.json'), 'w'), indent=1)

# ---------------------------------------------------------------- lip-sync envelope (per video frame)
hop = SR // FPS
n = len(audio) // hop
rms = np.sqrt(np.array([np.mean(audio[i * hop:(i + 1) * hop] ** 2) for i in range(n)]) + 1e-12)
db = 20 * np.log10(rms)
speech = db[db > np.percentile(db, 30)]
lo = np.percentile(speech, 20) if len(speech) else -40
hi = np.percentile(speech, 70) if len(speech) else -20
state = np.where(db > hi, 2, np.where(db > lo, 1, 0))
# animate "on twos" like the rest of the film: hold each mouth shape for two frames
state[1::2] = state[0::2][: len(state[1::2])]
# one character per frame of the recording; `studio timeline` re-times it onto the video (cards open gaps)
open(os.path.join(BUILD, 'vo_env_src.txt'), 'w').write(''.join(str(int(s)) for s in state))
print(f'{method} alignment: {len(result)} beats over {duration:.1f} s of voiceover -> build/vo_align.json (+ lip-sync envelope)')
print('next: studio timeline / check (the timeline now follows the voiceover)')
