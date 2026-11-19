"""Build the overlay-only engine project for the America History Map clips.

  python3 projects/america/tools/make_overlay.py <america-share.mp4> [beat ids...]

The film's source project is not in the repo, so the overlays that sat on top of
the old map shots are rebuilt with the studio engine and rendered on a
transparent background (render_overlay.mjs):
  * captions: the cue text (CSV caption_text), engine <Narration> in the serif face;
    word times come from the film's own soundtrack: speech is found by energy and
    the words are spread over it by letter count (the method of scripts/align_srt.py)
  * the narrator: engine <Teach> at the film's spot (x 1660, y 1010, scale 0.5),
    talking while the voice speaks, pointing his staff at the pin / route end /
    highlighted country, projected through the same camera as the History Map clip
  * the map label: dark box, Outfit Bold, popping in 6 frames into each segment
The era bar and section chip are copied from the film itself (composite.py).
Writes projects/america-overlay/{project.json, shots.tsx, build/timeline.json}.
"""
import json, math, os, re, subprocess, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
ROOT = os.path.dirname(os.path.dirname(PROJ))
OV = os.path.join(ROOT, 'projects', 'america-overlay')
FPS, SR = 30, 16000


def speech_mask(film, start_frame, frames):
    """Per-frame speech flags for the beat, from the film's mixed soundtrack."""
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{start_frame / FPS:.4f}', '-t', f'{frames / FPS:.4f}', '-i', film,
                          '-vn', '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout
    x = np.frombuffer(raw, np.int16).astype(float) / 32768
    hop = SR // FPS
    n = min(frames, len(x) // hop)
    rms = np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2)) for i in range(n)] + [0.0] * (frames - n))
    if rms.max() <= 0: return np.zeros(frames, bool)
    loud = np.percentile(rms, 85)
    m = rms > max(0.25 * loud, 0.004)
    # close gaps shorter than 4 frames (between syllables), drop blips shorter than 2
    m = m.copy()
    i = 0
    while i < frames:
        if not m[i]:
            j = i
            while j < frames and not m[j]: j += 1
            if 0 < i and j < frames and j - i < 4: m[i:j] = True
            i = j
        else: i += 1
    return m


def word_times(text, mask):
    """Spread words over the speech frames by letter count → first frame of each word."""
    words = text.split()
    sp = np.nonzero(mask)[0]
    if not len(sp): sp = np.arange(len(mask))
    lens = [max(1, len(re.sub(r'[^\w]', '', w))) for w in words]
    tot, acc, out = sum(lens), 0, []
    for w, L in zip(words, lens):
        k = min(len(sp) - 1, int(acc / tot * len(sp)))
        out.append({'w': w, 'em': False, 'at': int(sp[k])})
        acc += L
    return out


def talking_ranges(mask):
    out, i, n = [], 0, len(mask)
    while i < n:
        if mask[i]:
            j = i
            while j < n and mask[j]: j += 1
            out.append([int(i), int(j)]); i = j
        else: i += 1
    return out


def ease(t): return 2 * t * t if t < 0.5 else 1 - (-2 * t + 2) ** 2 / 2
def my(lat): return (1 - math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)) / math.pi) / 2


def screen(pt, c, qz):
    """[lon,lat] → output pixels for a History Map shot camera (centre c, QGIS zoom qz; world = qz·1920 px)."""
    W = qz * 1920
    dl = (pt[0] - c[0] + 540) % 360 - 180
    return 960 + dl / 360 * W, 540 + (my(pt[1]) - my(c[1])) * W


def main():
    film = sys.argv[1]
    only = set(sys.argv[2:])
    man = json.load(open(os.path.join(PROJ, 'historymap', 'manifest.json')))
    beats = {}
    for m in man:
        if only and m['beat'] not in only: continue
        beats.setdefault(m['beat'], []).append(m)
    shots, t = [], 0
    for bid, segs in beats.items():
        b0 = segs[0]
        mask = speech_mask(film, b0['beat_start_frame'], b0['beat_frames'])
        words = word_times(b0['caption'], mask)
        targets = []
        for g in segs:
            sh = g['shot']
            # the narrator taps when the move has settled a little (after the space dive, if any)
            lead = int(g['frames'] * (sh.get('spaceFrac', 0) if sh.get('space') else 0))
            at_local = lead + min(14, max(4, (g['frames'] - lead) // 3))
            e = ease(min(1, max(0, (at_local - lead) / max(1, g['frames'] - lead))))
            c = [g['c'][0] + (g['to'][0] - g['c'][0]) * e, g['c'][1] + (g['to'][1] - g['c'][1]) * e]
            qz = g['qz'][0] * (g['qz'][1] / g['qz'][0]) ** e
            pt = g['pins'][0] if g['pins'] else g['route_end'] or g['c']
            x, y = screen(pt, c, qz)
            targets.append({'x': round(min(1560, max(160, x)), 1), 'y': round(min(820, max(300, y)), 1), 'at': g['offset'] + at_local})
        shots.append({'id': bid, 'kind': 'STORY', 'shot': 'ov', 'from': t, 'dur': b0['beat_frames'], 'words': words, 'date': None,
                      'ov': {'segs': [{'offset': g['offset'], 'frames': g['frames'], 'label': g['label']} for g in segs],
                             'talking': talking_ranges(mask), 'targets': targets, 'film_start': b0['beat_start_frame']}})
        t += b0['beat_frames']
    os.makedirs(os.path.join(OV, 'build'), exist_ok=True)
    json.dump({'fps': FPS, 'width': 1920, 'height': 1080, 'total': t, 'captionFont': 'serif', 'shots': shots},
              open(os.path.join(OV, 'build', 'timeline.json'), 'w'), indent=1)
    json.dump({'title': 'America overlays (History Map clips)', 'captionFont': 'serif'}, open(os.path.join(OV, 'project.json'), 'w'), indent=1)
    print(f'{len(shots)} beats, {t} overlay frames → projects/america-overlay/build/timeline.json')


if __name__ == '__main__': main()
