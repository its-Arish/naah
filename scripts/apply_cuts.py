#!/usr/bin/env python3
"""
apply_cuts.py <projectDir>

Re-creates the edited voice track from a high-quality original (voiceover_hq.wav / .flac / .aiff /
.m4a in the project folder) using exactly the same edits the aligner made to the compressed copy:
the shortened pauses and the removed stutters/retakes listed in build/vo_align.json ("cuts", in
seconds of the original recording). Output: build/voiceover_edit_hq.wav at the original sample rate
and channel count, 24-bit, no re-encoding loss.

The HQ file must be the same recording as voiceover.mp3 (same start), only at higher quality.
"""
import json, os, subprocess, sys
import numpy as np

P = sys.argv[1] if len(sys.argv) > 1 else '.'
hq = next((os.path.join(P, f) for f in ('voiceover_hq.wav', 'voiceover_hq.flac', 'voiceover_hq.aiff', 'voiceover_hq.m4a') if os.path.exists(os.path.join(P, f))), None)
if not hq:
    sys.exit('no voiceover_hq.(wav|flac|aiff|m4a) in ' + P)
align = json.load(open(os.path.join(P, 'build', 'vo_align.json')))
cuts = align.get('cuts', [])

info = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=sample_rate,channels', '-of', 'json', hq], capture_output=True, text=True).stdout)['streams'][0]
sr, ch = int(info['sample_rate']), int(info['channels'])
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', hq, '-f', 'f32le', '-ac', str(ch), '-ar', str(sr), '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype=np.float32).reshape(-1, ch)

# sanity check: same recording as the compressed copy?
mp3 = next((os.path.join(P, f) for f in ('voiceover.mp3', 'voiceover.m4a', 'voiceover.ogg', 'voiceover.wav') if os.path.exists(os.path.join(P, f))), None)
if mp3:
    d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3], capture_output=True, text=True).stdout)
    if abs(d - len(x) / sr) > 0.5:
        print(f'warning: HQ file is {len(x) / sr:.1f} s but the compressed copy is {d:.1f} s; they must be the same recording')

parts, last = [], 0
fade = int(0.004 * sr)  # 4 ms crossfade at every cut, so no clicks
for a, b in cuts:
    ia, ib = int(a * sr), int(b * sr)
    seg = x[last:ia].copy()
    if len(seg) > fade:
        seg[-fade:] *= np.linspace(1, 0, fade)[:, None]
    if parts and len(seg) > fade:
        seg[:fade] *= np.linspace(0, 1, fade)[:, None]
    parts.append(seg); last = ib
tailseg = x[last:].copy()
if parts and len(tailseg) > fade:
    tailseg[:fade] *= np.linspace(0, 1, fade)[:, None]
parts.append(tailseg)
y = np.concatenate(parts)
out = os.path.join(P, 'build', 'voiceover_edit_hq.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', str(ch), '-i', '-', '-c:a', 'pcm_s24le', out], input=y.astype(np.float32).tobytes(), check=True)
print(f'{len(cuts)} edits applied to {os.path.basename(hq)} ({sr} Hz, {ch} ch) -> build/voiceover_edit_hq.wav ({len(y) / sr:.1f} s)')
