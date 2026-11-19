"""Composite each History Map beat clip with the film's overlays.

  python3 projects/america/tools/composite.py <america-share.mp4> [beat ids...]

Per beat, bottom to top:
  1. clips/<beat>.mp4                       the History Map clip (30 fps, exact frames)
  2. era bar + section chip                 copied frame by frame from the film (they are part of
                                            the original frame, so they stay exactly in step);
                                            the bar is semi-transparent in the film, so the old
                                            map's coastlines that showed through it are cleaned
                                            out (pixels darker than the bar fill → bar fill)
  3. clips/overlay/<beat>/f*.png            narrator, captions, map label (render_overlay.mjs)
→ clips/comp/<beat>.mp4
"""
import json, os, subprocess, sys
import numpy as np

PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLIPS = os.path.join(PROJ, 'clips')
FPS, W, H = 30, 1920, 1080
BAR_H = 83                          # rows 0–79 bar, 80–82 its golden rule
CHIP_Y0, CHIP_Y1 = 87, 135          # chip outline rows (inclusive start, exclusive end)
BAR_FILL = np.array([51, 47, 41], np.uint8)
TOP = 136                           # height of the band sent through as RGBA (even: the film is 4:2:0)


def chip_x1(frame):
    """Right edge of the section chip (its width changes with the section name): follow its dark
    fill along a row just inside the top outline, above the text, until the fill ends."""
    row = frame[CHIP_Y0 + 5, :1000].astype(int).mean(1)
    x = 30
    while x < 999 and row[x] < 120: x += 1
    return x + 4


def rounded_mask(w, h, r):
    yy, xx = np.mgrid[0:h, 0:w].astype(float) + 0.5
    cx = np.clip(xx, r, w - r); cy = np.clip(yy, r, h - r)
    d = np.hypot(xx - cx, yy - cy)
    return np.clip(r - d + 0.5, 0, 1)


def top_band(film, start, frames):
    """RGBA frames (W × TOP) holding the cleaned era bar and the chip, everything else transparent."""
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{start / FPS:.4f}', '-i', film, '-frames:v', str(frames),
                          '-vf', f'crop={W}:{TOP}:0:0', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, TOP, W, 3)
    out = np.zeros((len(fr), TOP, W, 4), np.uint8)
    x0 = 22
    for i, f in enumerate(fr):
        o = out[i]
        if f[:80].astype(int).mean() > 90:             # no era bar in the original here (hook beats): leave the band empty
            continue
        bar = f[:BAR_H].copy()
        lum = bar[:80].astype(int).mean(2)
        bar[:80][lum < 38] = BAR_FILL                 # old-map coastlines seen through the bar
        o[:BAR_H, :, :3] = bar; o[:BAR_H, :, 3] = 255
        x1 = chip_x1(f)
        chip = f[CHIP_Y0:CHIP_Y1, x0:x1].copy()
        inner = chip[3:-3, 3:-3]
        il = inner.astype(int).mean(2)
        inner[il < 38] = BAR_FILL
        a = (rounded_mask(x1 - x0, CHIP_Y1 - CHIP_Y0, 8) * 255).astype(np.uint8)
        o[CHIP_Y0:CHIP_Y1, x0:x1, :3] = chip; o[CHIP_Y0:CHIP_Y1, x0:x1, 3] = a
    return out


def main():
    film = sys.argv[1]
    only = set(sys.argv[2:])
    man = json.load(open(os.path.join(PROJ, 'historymap', 'manifest.json')))
    beats = {}
    for m in man:
        if only and m['beat'] not in only: continue
        beats.setdefault(m['beat'], m)
    os.makedirs(os.path.join(CLIPS, 'comp'), exist_ok=True)
    for bid, m in beats.items():
        n, start = m['beat_frames'], m['beat_start_frame']
        band = top_band(film, start, n)
        band_path = os.path.join(CLIPS, 'comp', f'{bid}_top.mov')
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{W}x{TOP}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'qtrle', band_path], stdin=subprocess.PIPE)
        p.stdin.write(band.tobytes()); p.stdin.close(); p.wait()
        out = os.path.join(CLIPS, 'comp', f'{bid}.mp4')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(CLIPS, f'{bid}.mp4'), '-i', band_path,
                        '-framerate', str(FPS), '-i', os.path.join(CLIPS, 'overlay', bid, 'f%06d.png'),
                        '-filter_complex', '[0][1]overlay=0:0:format=auto[a];[a][2]overlay=0:0:format=auto,format=yuv420p',
                        '-frames:v', str(n), '-r', str(FPS), '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-an', out], check=True)
        os.remove(band_path)
        print(f'{bid}: composited ({n} frames) → clips/comp/{bid}.mp4')


if __name__ == '__main__': main()
