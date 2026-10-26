"""Synthesises every sound effect in code and mixes them from build/cues.json into build/sfx.wav.
No samples, no library: just oscillators, filtered noise and envelopes (numpy + scipy).
Usage: python3 scripts/sfx.py build/cues.json build/sfx.wav   (normally run via: studio sfx <project>)
"""
import json, sys
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

SR = 48000
rng = np.random.default_rng(7)


def t_(d):
    return np.arange(int(d * SR)) / SR


def env(n, a=0.005, r=0.2, shape=4.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-shape * t / max(r, 1e-4))
    return e


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype='band', fs=SR, output='sos'), x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, btype='low', fs=SR, output='sos'), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, btype='high', fs=SR, output='sos'), x)


def noise(d):
    return rng.standard_normal(int(d * SR))


def sweep(f0, f1, d, kind='exp'):
    t = t_(d)
    f = f0 * (f1 / f0) ** (t / d) if kind == 'exp' else f0 + (f1 - f0) * t / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) or 1
    return x / m * peak


# ------------------------------------------------------------------ one-shots
def whoosh(d=0.42):
    n = noise(d)
    t = t_(d)
    out = np.zeros_like(n)
    # sweep a band-pass by processing in chunks
    chunks = 12
    L = len(n) // chunks
    for i in range(chunks):
        c = 300 + 2600 * np.sin(np.pi * (i + 0.5) / chunks)
        seg = bp(n[i * L:(i + 1) * L + 400], c * 0.6, min(c * 1.6, 20000))
        out[i * L:(i + 1) * L] = seg[:L]
    e = np.sin(np.pi * t / d) ** 2
    return norm(out * e, 0.7)


def tick():
    d = 0.03
    x = noise(d) * env(int(d * SR), 0.0005, 0.01, 5)
    return norm(hp(x, 2500), 0.5)


def ticks(d=0.9):
    out = np.zeros(int(d * SR) + 2000)
    tt, gap = 0.0, 0.03
    while tt < d:
        k = tick() * (0.6 + 0.4 * rng.random())
        i = int(tt * SR)
        out[i:i + len(k)] += k
        tt += gap
        gap *= 1.12
    return norm(out, 0.6)


def pop():
    d = 0.12
    x = sweep(900, 180, d) * env(int(d * SR), 0.002, 0.05, 3)
    x += hp(noise(d), 3000) * env(int(d * SR), 0.0005, 0.01, 6) * 0.3
    return norm(x, 0.8)


def pops(d=1.3):
    out = np.zeros(int((d + 0.2) * SR))
    for i in range(14):
        k = pop()
        k = np.interp(np.arange(0, len(k), 0.8 + rng.random() * 0.6), np.arange(len(k)), k)
        s = int(rng.random() * d * SR)
        out[s:s + len(k)] += k * 0.5
    return norm(out, 0.7)


def boing(d=0.7):
    t = t_(d)
    f = 180 + 140 * np.exp(-t * 3) * (1 + 0.5 * np.sin(2 * np.pi * 14 * t))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.003, 0.35, 2)
    x += 0.3 * np.sin(2 * np.pi * np.cumsum(f * 2) / SR) * env(len(t), 0.003, 0.2, 2)
    return norm(x, 0.8)


def thud(d=0.35):
    t = t_(d)
    x = np.sin(2 * np.pi * np.cumsum(70 * np.exp(-t * 6) + 45) / SR) * env(len(t), 0.002, 0.12, 2)
    x += lp(noise(d), 400) * env(len(t), 0.001, 0.05, 3) * 0.8
    return norm(x, 0.9)


def drum(d=1.0):
    t = t_(d)
    x = np.sin(2 * np.pi * np.cumsum(110 * np.exp(-t * 8) + 52) / SR) * env(len(t), 0.002, 0.35, 2)
    x += bp(noise(d), 120, 900) * env(len(t), 0.001, 0.06, 3) * 0.6
    x += 0.5 * np.sin(2 * np.pi * 82 * t) * env(len(t), 0.003, 0.5, 2.5)
    return norm(x, 0.95)


def ping(f, d=0.35, partials=(1, 2.76, 5.4)):
    t = t_(d)
    x = sum(np.sin(2 * np.pi * f * p * t) / (i + 1) for i, p in enumerate(partials))
    return x * env(len(t), 0.0005, d * 0.5, 3)


def coins(d=0.8):
    out = np.zeros(int((d + 0.4) * SR))
    for i in range(18):
        k = ping(2800 + rng.random() * 2600, 0.25)
        s = int(rng.random() ** 1.6 * d * SR)
        out[s:s + len(k)] += k * (0.3 + 0.4 * rng.random())
    return norm(hp(out, 1500), 0.7)


def kaching():
    a = ping(2093, 0.9, (1, 2.4, 3.9, 5.1)) * 0.8
    out = np.zeros(int(1.2 * SR))
    c = coins(0.4)
    out[:len(c)] += c * 0.5
    s = int(0.12 * SR)
    out[s:s + len(a)] += a
    return norm(out, 0.8)


def ding():
    return norm(ping(1760, 1.0, (1, 2.0, 3.01)), 0.6)


def clang(d=0.6):
    t = t_(d)
    x = sum(np.sin(2 * np.pi * f * t + rng.random() * 6) * a for f, a in [(1180, 1), (2730, 0.8), (4120, 0.6), (5650, 0.4), (7300, 0.25)])
    x = x * env(len(t), 0.0005, 0.25, 3)
    x += hp(noise(d), 2000) * env(len(t), 0.0005, 0.02, 5) * 1.2
    return norm(x, 0.8)


def slam():
    d = 0.5
    x = thud(d) * 0.9
    x[:int(0.25 * SR)] += bp(noise(0.25), 800, 6000) * env(int(0.25 * SR), 0.0005, 0.06, 4) * 0.8
    return norm(x, 0.9)


def slide_down(d=1.1):
    t = t_(d)
    f = 1400 * (180 / 1400) ** (t / d)
    x = np.sin(2 * np.pi * np.cumsum(f * (1 + 0.01 * np.sin(2 * np.pi * 6 * t))) / SR)
    x *= np.minimum(1, t / 0.03) * np.minimum(1, (d - t) / 0.1)
    return norm(x, 0.55)


def paper(d=0.45):
    n = bp(noise(d), 1500, 9000)
    t = t_(d)
    am = 0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 9 * t + rng.random(len(t)) * 0.4))
    return norm(n * am * np.sin(np.pi * t / d), 0.5)


def scribble(d=1.0):
    out = np.zeros(int(d * SR))
    tt = 0.0
    while tt < d - 0.12:
        L = 0.06 + rng.random() * 0.1
        s = int(tt * SR)
        seg = bp(noise(L), 2500, 7000) * np.sin(np.pi * t_(L) / L)
        n_ = min(len(seg), len(out) - s)  # the last stroke may run past the end
        out[s:s + n_] += seg[:n_]
        tt += L + rng.random() * 0.05
    return norm(out, 0.45)


def blip():
    a = np.concatenate([ping(880, 0.06, (1,)), ping(1320, 0.08, (1,))])
    return norm(a, 0.35)


def sob(d=1.0):
    t = t_(d)
    f = (520 - 160 * t / d) * (1 + 0.06 * np.sin(2 * np.pi * 9 * t))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.4 * np.sin(2 * np.pi * np.cumsum(f * 2) / SR)
    gate = (np.sin(2 * np.pi * 2.2 * t) > -0.2).astype(float)
    x *= lp(gate, 30) * np.minimum(1, (d - t) / 0.1)
    return norm(lp(x, 3000), 0.5)


def neigh(d=1.1):
    t = t_(d)
    f = np.interp(t, [0, 0.15, 0.45, 1.1], [600, 1150, 900, 420]) * (1 + 0.09 * np.sin(2 * np.pi * 22 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + 0.6 * np.sin(2 * ph) + 0.3 * np.sin(3 * ph)
    x += bp(noise(d), 800, 3000) * 0.25
    x *= np.minimum(1, t / 0.03) * np.minimum(1, (d - t) / 0.25)
    return norm(bp(x, 300, 5000), 0.6)


def rumble(d=2.0):
    t = t_(d)
    x = lp(noise(d), 120, 4) * (0.6 + 0.4 * np.sin(2 * np.pi * 3 * t))
    return norm(x * np.sin(np.pi * t / d), 0.9)


def hoof():
    d = 0.09
    x = lp(noise(d), 900) * env(int(d * SR), 0.001, 0.03, 4)
    x += np.sin(2 * np.pi * 140 * t_(d)) * env(int(d * SR), 0.001, 0.03, 4) * 0.6
    return x


def gallop(d=3.0):
    out = np.zeros(int((d + 0.2) * SR))
    tt = 0.0
    while tt < d:
        for k, off in enumerate((0, 0.09, 0.18)):
            h = hoof() * (0.7 + 0.3 * rng.random())
            s = int((tt + off) * SR)
            if s + len(h) < len(out):
                out[s:s + len(h)] += h
        tt += 0.42
    fade = np.minimum(1, np.arange(len(out)) / (0.2 * SR)) * np.minimum(1, (len(out) - np.arange(len(out))) / (0.4 * SR))
    return norm(out * fade, 0.7)


def bleat(d=0.9):
    t = t_(d)
    f = 520 * (1 + 0.12 * np.sin(2 * np.pi * 26 * t)) * np.interp(t, [0, 0.2, 0.9], [1.0, 1.08, 0.85])
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + 0.7 * np.sin(2 * ph) + 0.4 * np.sin(3 * ph) + 0.2 * np.sin(5 * ph)
    x *= np.minimum(1, t / 0.04) * np.minimum(1, (d - t) / 0.2)
    return norm(bp(x, 300, 4000), 0.6)


SHOTS = dict(bleat=bleat, whoosh=whoosh, tick=tick, ticks=ticks, pop=pop, pops=pops, boing=boing, thud=thud, drum=drum, coins=coins,
             kaching=kaching, ding=ding, clang=clang, slam=slam, slide_down=slide_down, paper=paper, scribble=scribble,
             blip=blip, sob=sob, neigh=neigh, rumble=rumble)


# ------------------------------------------------------------------ ambience beds
def amb(kind, d):
    t = t_(d)
    if kind == 'wind':
        x = lp(noise(d), 500) * (0.5 + 0.35 * np.sin(2 * np.pi * 0.13 * t) + 0.15 * np.sin(2 * np.pi * 0.37 * t))
    elif kind == 'waves':
        swell = 0.5 + 0.5 * np.sin(2 * np.pi * t / 6.5) ** 2
        x = lp(noise(d), 900) * swell + hp(noise(d), 3000) * swell ** 4 * 0.2
    elif kind in ('birds', 'camp'):
        x = lp(noise(d), 400) * 0.35
        if kind == 'camp':
            x += bp(noise(d), 180, 700) * (0.4 + 0.2 * np.sin(2 * np.pi * 0.21 * t)) * 0.6
        nb = int(d * (1.2 if kind == 'birds' else 0.4))
        for _ in range(nb):
            s = int(rng.random() * (d - 0.4) * SR)
            for k in range(rng.integers(2, 5)):
                L = 0.07 + rng.random() * 0.06
                f0 = 3000 + rng.random() * 2000
                ch = sweep(f0, f0 * (1.3 + rng.random() * 0.5), L) * np.sin(np.pi * t_(L) / L)
                ss = s + int(k * 0.11 * SR)
                n_ = min(len(ch), len(x) - ss)
                if n_ > 0:
                    x[ss:ss + n_] += ch[:n_] * 0.35
    else:
        x = lp(noise(d), 300) * 0.3
    return norm(x, 0.5)


def main():
    cues_path = sys.argv[1] if len(sys.argv) > 1 else 'out/cues.json'
    out_path = sys.argv[2] if len(sys.argv) > 2 else 'out/sfx.wav'
    data = json.load(open(cues_path))
    N = int((data['duration'] + 1) * SR)
    mix = np.zeros(N)
    cache = {}
    for c in data['cues']:
        kind, at, vol = c[0], c[1], c[2] if len(c) > 2 and c[2] is not None else 0.8
        if kind == 'gallop':
            d = c[3] if len(c) > 3 and c[3] else 3.0
            snd = gallop(max(0.8, d))
        else:
            if kind not in SHOTS:
                print('unknown sfx', kind); continue
            if kind not in cache or kind in ('coins', 'pops', 'scribble', 'paper'):
                cache[kind] = SHOTS[kind]()
            snd = cache[kind]
        s = int(at * SR)
        e = min(N, s + len(snd))
        mix[s:e] += snd[:e - s] * vol * 0.8
    for kind, a, b in data['amb']:
        d = b - a
        bed = amb(kind, d)
        fade = np.minimum(1, np.minimum(np.arange(len(bed)), len(bed) - np.arange(len(bed))) / (0.6 * SR))
        s = int(a * SR)
        e = min(N, s + len(bed))
        mix[s:e] += (bed * fade)[:e - s] * 0.22
    mix = np.tanh(mix * 1.1) * 0.89  # soft limiter
    stereo = np.stack([mix, mix], 1)
    wavfile.write(out_path, SR, (stereo * 32767).astype(np.int16))
    print('wrote', out_path, f'{N / SR:.1f}s', 'peak', float(np.max(np.abs(mix))))


if __name__ == '__main__':
    main()
