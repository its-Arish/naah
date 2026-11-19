"""Splice composited History Map beats into the film piece by piece (low memory).

  python3 projects/america/tools/splice_pieces.py <film.mp4> <out.mp4>

Every piece (film gap or composited beat) is encoded once with the same settings,
exactly its frame count, square pixels; the pieces are joined with the concat demuxer
(stream copy) and the film's own audio is copied unchanged.
"""
import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
film, out = sys.argv[1], sys.argv[2]
work = out + '.parts'; os.makedirs(work, exist_ok=True)
total = int(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=nb_frames', '-of', 'csv=p=0', film], capture_output=True, text=True).stdout.strip())
man = json.load(open(os.path.join(PROJ, 'historymap', 'manifest.json')))
beats = {}
for m in man: beats.setdefault(m['beat'], m)
reps = sorted((m['beat_start_frame'], m['beat_frames'], b) for b, m in beats.items() if os.path.exists(os.path.join(PROJ, 'clips', 'comp', f'{b}.mp4')))
pieces, cur = [], 0
for s, n, b in reps:
    if s < cur: raise SystemExit(f'{b} overlaps')
    if s > cur: pieces.append(('gap', cur, s - cur, None))
    pieces.append(('clip', s, n, b)); cur = s + n
if cur < total: pieces.append(('gap', cur, total - cur, None))
ENC = ['-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-r', str(FPS), '-an']
def run(i):
    kind, start, n, b = pieces[i]
    dst = os.path.join(work, f'p{i:04d}.mp4')
    if os.path.exists(dst): return dst
    tmp = dst + '.tmp.mp4'
    if kind == 'gap':
        cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', f'{start / FPS:.5f}', '-i', film, '-frames:v', str(n), '-vf', 'setsar=1', *ENC, tmp]
    else:
        cmd = ['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(PROJ, 'clips', 'comp', f'{b}.mp4'), '-frames:v', str(n), '-vf', 'setsar=1', *ENC, tmp]
    subprocess.run(cmd, check=True); os.rename(tmp, dst); return dst
with ThreadPoolExecutor(2) as ex: files = list(ex.map(run, range(len(pieces))))
lst = os.path.join(work, 'list.txt'); open(lst, 'w').write(''.join(f"file '{f}'\n" for f in files))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-i', film, '-map', '0:v', '-map', '1:a', '-c', 'copy', '-t', f'{total / FPS:.4f}', '-movflags', '+faststart', out], check=True)
print(len(pieces), 'pieces →', out)
