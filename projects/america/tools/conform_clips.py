"""Conform recorded History Map segments to the film: 1920×1080, 30 fps, exact frame counts.

  python3 projects/america/tools/conform_clips.py [beat ids...]

clips/raw/<seg>.mp4 (60 fps) → clips/seg/<seg>.mp4 (30 fps, exactly `frames` frames)
→ clips/<beat>.mp4 (the beat's segments joined; exactly the beat's frame count).
"""
import json, os, subprocess, sys

PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLIPS = os.path.join(PROJ, 'clips')
man = json.load(open(os.path.join(PROJ, 'historymap', 'manifest.json')))
only = set(sys.argv[1:])


def nframes(p):
    out = subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout
    return int(out.strip())


os.makedirs(os.path.join(CLIPS, 'seg'), exist_ok=True)
beats = {}
for m in man:
    if only and m['beat'] not in only: continue
    beats.setdefault(m['beat'], []).append(m)
for beat, segs in beats.items():
    parts = []
    for m in segs:
        src, dst = os.path.join(CLIPS, 'raw', f"{m['seg']}.mp4"), os.path.join(CLIPS, 'seg', f"{m['seg']}.mp4")
        n = m['frames']
        # 60 → 30 fps by taking every other frame; pad by repeating the last frame if a frame is short
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vf', f'fps=30,tpad=stop_mode=clone:stop=10,scale=1920:1080,format=yuv420p',
                        '-r', '30', '-frames:v', str(n), '-c:v', 'libx264', '-crf', '17', '-preset', 'veryfast', '-an', dst], check=True)
        got = nframes(dst)
        assert got == n, f'{m["seg"]}: {got} frames, wanted {n}'
        parts.append(dst)
    lst = os.path.join(CLIPS, 'seg', f'{beat}.txt')
    open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    out = os.path.join(CLIPS, f'{beat}.mp4')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', out], check=True)
    got, want = nframes(out), segs[0]['beat_frames']
    assert got == want, f'{beat}: {got} frames, wanted {want}'
    print(f'{beat}: {len(parts)} segment(s) → clips/{beat}.mp4, {got} frames ✓')
