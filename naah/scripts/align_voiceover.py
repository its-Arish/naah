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
  2. Otherwise: ffmpeg silencedetect finds the pauses; speech time is shared out across the beats
     in proportion to their word counts, and each beat boundary is snapped to the nearest pause.
     That is accurate to a fraction of a second when the voiceover follows the script.

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
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', vo, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768.0
duration = len(audio) / SR

# ---------------------------------------------------------------- word timestamps
def whisper_words():
    try:
        from faster_whisper import WhisperModel
        model = WhisperModel(os.environ.get('WHISPER_MODEL', 'base.en'), compute_type='int8')
        segs, _ = model.transcribe(vo, word_timestamps=True)
        return [(clean(w.word), w.start, w.end) for s in segs for w in s.words if clean(w.word)]
    except ImportError:
        pass
    try:
        import whisper
        model = whisper.load_model(os.environ.get('WHISPER_MODEL', 'base.en'))
        r = model.transcribe(vo, word_timestamps=True)
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

# ---------------------------------------------------------------- fallback: pauses + word counts
def align_with_silence():
    r = subprocess.run(['ffmpeg', '-v', 'info', '-i', vo, '-af', 'silencedetect=noise=-35dB:d=0.18', '-f', 'null', '-'], capture_output=True, text=True)
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r.stderr)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r.stderr)]
    pauses = list(zip(starts, ends + [duration] * (len(starts) - len(ends))))
    speech_start = pauses[0][1] if pauses and pauses[0][0] < 0.05 else 0.0
    speech_end = pauses[-1][0] if pauses and pauses[-1][1] >= duration - 0.05 else duration
    inner = [(a, b) for a, b in pauses if a > speech_start + 0.05 and b < speech_end - 0.05]
    # speech-only time axis: map "speech seconds" to real seconds by skipping pauses
    talk = speech_end - speech_start - sum(b - a for a, b in inner)
    counts = [max(1, len(w)) for w in beat_words]
    total = sum(counts)
    def speech_to_real(x):
        t = speech_start + x
        for a, b in inner:
            if t > a: t += b - a
        return t
    # proportional boundaries, then snap each to the nearest pause midpoint within 1.2 s
    cum, bounds = 0, [speech_start]
    for c in counts[:-1]:
        cum += c
        t = speech_to_real(talk * cum / total)
        near = min(inner, key=lambda p: abs((p[0] + p[1]) / 2 - t), default=None)
        if near and abs((near[0] + near[1]) / 2 - t) < 1.2 and near[1] > bounds[-1] + 0.3:
            t = near[1]  # the next beat starts when speech resumes
        bounds.append(max(t, bounds[-1] + 0.3))
    bounds.append(speech_end)
    out = []
    for i, b in enumerate(beats):
        s, e = bounds[i], bounds[i + 1]
        # the beat's own speech ends at the start of the pause before the next beat
        pe = max([a for a, _ in inner if s < a <= e + 0.01] or [e])
        out.append({'id': b['id'], 'start': round(s, 3), 'end': round(pe if pe - s > 0.4 else e, 3)})
    return out

heard = whisper_words()
result = align_with_words(heard) if heard else None
method = 'whisper' if result else 'silence'
if not result:
    result = align_with_silence()
json.dump({'duration': duration, 'method': method, 'file': os.path.basename(vo), 'beats': result}, open(os.path.join(BUILD, 'vo_align.json'), 'w'), indent=1)

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
