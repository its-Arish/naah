#!/usr/bin/env python3
"""Builds voiceover.mp3 + voiceover.srt from two Gemini takes (second hook, 10 Nov 2026).

    tools/vo/hook_v2.wav   new opening: "Sweet Home Alabama ... You just never noticed." (17 cues)
    tools/vo/body_v1.mp3   the first full take; tools/body.srt is its fixed transcript (tools/fix_srt.py)

Result: hook_v2 [0, end] + body [0, CUT_A] (Mardi Gras and the lost suitcase, v1 cues 1-8) + body [CUT_B, end] (rocket onwards, v1 cues 13-707).
The v1 "biggest songs ... town of 14,000" line (v1 cues 9-12) is dropped: the new hook covers that town (16,000). Cuts sit in pauses.
New caption numbers: hook 1-17, v1 1-8 -> 18-25, v1 n>=13 -> n+5 (tools/make_beats.py uses the new numbers).
    python3 -I projects/alabama/tools/splice_hook.py
"""
import os, re, subprocess
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = os.path.join(HERE, 'tools', 'vo')
CUT_A, CUT_B = 23.25, 31.25

def dur(p):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)

def sec(s):
    h, m, r = s.split(':'); return int(h) * 3600 + int(m) * 60 + float(r.replace(',', '.'))

def stamp(t):
    ms = round(t * 1000); return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}'

def cues(path):
    out = []
    for b in re.split(r'\n\s*\n', open(path, encoding='utf-8-sig').read().strip()):
        l = b.strip().splitlines(); a, z = l[1].split(' --> ')
        out.append((int(l[0]), sec(a), sec(z), ' '.join(l[2:]).strip()))
    return out

HOOK_FIX = {1: 'Sweet Home Alabama.', 2: "You've heard it at a wedding, a ball", 12: 'gives a shout-out to a few session'}
hook = [(n, a, z, HOOK_FIX.get(n, t)) for n, a, z, t in cues(os.path.join(V, 'hook_v2_raw.srt'))]
body = cues(os.path.join(HERE, 'tools', 'body.srt'))
H = dur(os.path.join(V, 'hook_v2.wav'))

out = [(a, z, t) for _, a, z, t in hook]
out += [(a + H, z + H, t) for n, a, z, t in body if n <= 8]
assert all(z <= CUT_A for n, a, z, t in body if n <= 8) and body[12][1] >= CUT_B
shift = H + CUT_A - CUT_B
out += [(a + shift, z + shift, t) for n, a, z, t in body if n >= 13]
open(os.path.join(HERE, 'voiceover.srt'), 'w', encoding='utf-8').write(
    '\n'.join(f'{i}\n{stamp(a)} --> {stamp(z)}\n{t}\n' for i, (a, z, t) in enumerate(out, 1)))

subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(V, 'hook_v2.wav'), '-i', os.path.join(V, 'body_v1.mp3'), '-filter_complex',
                f'[0:a]aresample=44100,aformat=channel_layouts=mono[h];'
                f'[1:a]aresample=44100,aformat=channel_layouts=mono,asplit[b1][b2];'
                f'[b1]atrim=0:{CUT_A},asetpts=N/SR/TB[p1];[b2]atrim=start={CUT_B},asetpts=N/SR/TB[p2];'
                f'[h][p1][p2]concat=n=3:v=0:a=1[o]', '-map', '[o]', '-c:a', 'libmp3lame', '-b:a', '128k',
                os.path.join(HERE, 'voiceover.mp3')], check=True)
print(f'{len(out)} cues; voiceover.mp3 {dur(os.path.join(HERE, "voiceover.mp3")):.2f} s (hook {H:.2f} s, body shift {shift:+.2f} s)')
