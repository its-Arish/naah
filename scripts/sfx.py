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



# ------------------------------------------------------------------ "premium" set (Shorts): cinematic hits, risers, foley
def tail(x, d=0.6, mix=0.18):
    """Cheap room reverb: convolve with exponentially decaying filtered noise."""
    ir = lp(noise(d), 5000) * np.exp(-6 * t_(d) / d)
    ir /= np.sqrt(np.sum(ir ** 2)) + 1e-9
    wet = np.convolve(x, ir)[: len(x) + int(d * SR)]
    out = np.zeros(len(wet)); out[: len(x)] += x
    return out + wet * mix

def impact(d=1.4):
    t = t_(d)
    sub = np.sin(2 * np.pi * np.cumsum(60 * (35 / 60) ** (t / d)) / SR) * np.exp(-3.2 * t)
    body = lp(noise(d), 900) * np.exp(-9 * t) * 0.8
    click = hp(noise(0.012), 2000); body[: len(click)] += click * 0.6
    return norm(tail(sub * 1.1 + body, 1.0, 0.25), 0.95)

def boom(d=2.2):
    t = t_(d)
    sub = np.sin(2 * np.pi * np.cumsum(48 * (28 / 48) ** (t / d)) / SR) * np.exp(-1.8 * t)
    rum = lp(noise(d), 260) * np.exp(-2.2 * t)
    return norm(tail(sub + rum * 0.9, 1.4, 0.3), 0.95)

def riser(d=1.1):
    """Noise that sweeps up through 12 bands, plus a rising tone, swelling into the next hit."""
    t = t_(d); x = noise(d); out = np.zeros(len(t))
    bands = np.geomspace(300, 7000, 12)
    for i, f in enumerate(bands):
        c = (i + 0.5) / len(bands)
        out += bp(x, f * 0.75, min(f * 1.3, 20000)) * np.exp(-((t / d - c) ** 2) / 0.02)
    tone = sweep(160, 880, d) * 0.2
    return norm((out + tone) * (t / d) ** 1.8, 0.8)

def swish(d=0.32):
    x = noise(d); out = np.zeros(len(x)); seg = int(0.02 * SR)
    for i in range(0, len(x), seg):
        f = 600 + 4000 * np.sin(np.pi * i / len(x))
        out[i:i + seg] = bp(x[i:i + seg], f * 0.6, min(f * 1.6, 20000))
    return norm(lp(out, 9000) * np.sin(np.pi * t_(d) / d) ** 1.5, 0.75)

def pop2():
    d = 0.16; t = t_(d)
    x = sweep(380, 950, d) * np.exp(-22 * t) + sweep(760, 1900, d) * np.exp(-30 * t) * 0.3
    return norm(tail(x, 0.25, 0.12), 0.8)

def sparkle(d=0.9):
    out = np.zeros(int(d * SR))
    for k in range(12):
        s = int(rng.random() * (d - 0.25) * SR); f = 2400 + rng.random() * 3600
        p = ping(f, 0.22, (1, 2.01, 3.03)) * (0.4 + 0.6 * rng.random())
        out[s:s + len(p)] += p[: len(out) - s]
    return norm(tail(hp(out, 1500), 0.6, 0.3), 0.6)

def deflate(d=0.8):
    t = t_(d)
    w = sweep(900, 140, d) * np.exp(-2.5 * t) * 0.6
    air = bp(noise(d), 800, 3000) * np.exp(-4 * t) * 0.5
    return norm(w + air, 0.7)

def stamp():
    th = thud(0.3); sl = hp(noise(0.06), 1500) * np.exp(-60 * t_(0.06))
    out = np.zeros(int(0.4 * SR)); out[: len(th)] += th; out[: len(sl)] += sl * 0.7
    return norm(tail(out, 0.3, 0.15), 0.9)

def hit():
    d = 0.35; t = t_(d)
    k = np.sin(2 * np.pi * np.cumsum(95 * (45 / 95) ** (t / d)) / SR) * np.exp(-11 * t)
    sn = bp(noise(d), 1500, 6000) * np.exp(-28 * t) * 0.5
    return norm(tail(k + sn, 0.5, 0.2), 0.95)

def glitch(d=0.45):
    out = np.zeros(int(d * SR)); n = int(0.03 * SR)
    for i in range(0, len(out) - n, n):
        if rng.random() < 0.6:
            f = 200 + rng.random() * 1800
            out[i:i + n] = np.sign(np.sin(2 * np.pi * f * t_(0.03))) * 0.4 + hp(noise(0.03), 3000) * 0.3
    return norm(lp(out, 7000), 0.55)

def crack():
    d = 0.9; t = t_(d)
    snap = hp(noise(d), 1200) * np.exp(-40 * t)
    rum = lp(noise(d), 300) * np.exp(-4 * t)
    return norm(tail(snap + rum * 0.7, 0.6, 0.2), 0.9)

def creak(d=1.1):
    t = t_(d)
    f = 140 + 60 * np.sin(2 * np.pi * 1.3 * t) + 25 * rng.standard_normal(len(t)).cumsum() / np.sqrt(len(t))
    saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
    grain = (rng.random(len(t)) < 0.002).astype(float)
    return norm(bp(saw * (0.6 + 0.4 * lp(grain * 40, 60)), 300, 2500) * np.sin(np.pi * t / d), 0.6)

def steps():
    out = np.zeros(int(1.4 * SR))
    for k in range(4):
        th = thud(0.18) * (0.8 - k * 0.12); s = int(k * 0.32 * SR)
        out[s:s + len(th)] += th
    return norm(lp(out, 2500), 0.7)

def drone(d=5.5):
    t = t_(d)
    x = sum(np.sin(2 * np.pi * f * t + rng.random()) * a for f, a in [(55, 1), (82.4, 0.6), (110, 0.4), (164.8, 0.2)])
    return norm(lp(x, 500) * np.minimum(1, t / 1.2) * np.minimum(1, (d - t) / 1.5), 0.5)

def machine(d=2.4):
    out = np.zeros(int(d * SR))
    for k in range(int(d / 0.3)):
        a_, b_ = clang(0.2), thud(0.15); c = np.zeros(max(len(a_), len(b_))); c[:len(a_)] += a_ * 0.4; c[:len(b_)] += b_ * 0.6; s = int(k * 0.3 * SR)
        out[s:s + len(c)] += c[: len(out) - s]
    return norm(lp(out, 4000), 0.6)

def anvil():
    p = ping(1180, 1.2, (1, 2.72, 5.12, 8.1)); q = ping(1630, 0.9, (1, 2.3)); p[: len(q)] += q * 0.5
    i = impact(0.8)
    out = np.zeros(max(len(p), len(i))); out[: len(p)] += p * 0.7; out[: len(i)] += i * 0.6
    return norm(tail(out, 0.8, 0.25), 0.9)



# ------------------------------------------------------------------ scored background music (moods per section)
HZ = lambda m: 440 * 2 ** ((m - 69) / 12)
PROGS = {   # chord roots as semitones above the key, with quality
    'minor': [[(0, 'm'), (8, 'M'), (3, 'M'), (10, 'M')], [(0, 'm'), (5, 'm'), (8, 'M'), (7, 'M')], [(0, 'm'), (10, 'M'), (8, 'M'), (10, 'M')]],
    'major': [[(0, 'M'), (7, 'M'), (9, 'm'), (5, 'M')], [(0, 'M'), (5, 'M'), (9, 'm'), (7, 'M')], [(0, 'M'), (4, 'm'), (5, 'M'), (7, 'M')]],
}
KEYS = [57, 50, 52, 55, 53, 48, 59, 54]  # A, D, E, G, F, C, B, F# (MIDI roots, one per section, cycling)
def chord_notes(root, q):
    return [root, root + (3 if q == 'm' else 4), root + 7]

def pad_voice(notes, n, bright=1200, detune=0.004):
    t = np.arange(n) / SR
    x = np.zeros(len(t))
    for m in notes:
        for dt in (-detune, 0, detune):
            f = HZ(m) * (1 + dt)
            x += sum(np.sin(2 * np.pi * f * k * t + k * 1.7) / k ** 1.4 for k in (1, 2, 3, 4))
    return lp(x, bright) / (len(notes) * 3)

def pluck(f, d=0.5):
    """Karplus-Strong plucked string."""
    n = int(SR / f); buf = rng.uniform(-1, 1, n); out = np.zeros(int(d * SR))
    for i in range(len(out)):
        out[i] = buf[i % n]
        buf[i % n] = 0.5 * (buf[i % n] + buf[(i + 1) % n]) * 0.996
    return out * np.exp(-3 * t_(d))

def mood_track(mood, d, sec_index):
    t = t_(d); x = np.zeros(len(t))
    key = KEYS[sec_index % len(KEYS)]
    if mood in ('none', 'silence'):
        return x
    if mood == 'sombre':   # monotonous: root + fifth drone, slow swell, no rhythm
        for m, a in ((key - 24, 1.0), (key - 17, 0.6), (key - 12, 0.35)):
            x += np.sin(2 * np.pi * HZ(m) * t) * a * (0.75 + 0.25 * np.sin(2 * np.pi * t / 11 + m))
        return lp(x, 400) * 0.5
    scale = 'major' if mood in ('curious', 'grand', 'playful') and sec_index % 3 != 2 else 'minor'
    prog = PROGS[scale][sec_index % len(PROGS[scale])]
    bpm = {'curious': 92, 'grand': 66, 'tension': 84, 'modern': 100, 'playful': 112}.get(mood, 90)
    beat = 60 / bpm; bar = beat * 4
    chord_len = bar * (2 if mood in ('grand', 'tension') else 1)
    n_ch = int(d / chord_len) + 1
    for ci in range(n_ch):
        a = int(ci * chord_len * SR)
        if a >= len(t): break
        root, q = prog[ci % len(prog)]
        notes = chord_notes(key + root - 12, q)
        L = min(len(t) - a, int((chord_len + 0.4) * SR))
        tt = np.arange(L) / SR
        env_ = np.minimum(1, tt / (0.6 if mood != 'playful' else 0.05)) * np.minimum(1, (tt[-1] - tt + 1e-3) / 0.4)
        if mood in ('grand', 'curious', 'modern', 'tension'):
            x[a:a + L] += pad_voice(notes, L, bright=900 if mood != 'grand' else 1500) * env_ * (0.9 if mood == 'grand' else 0.55)
        # bass
        x[a:a + L] += np.sin(2 * np.pi * HZ(notes[0] - 12) * tt) * env_ * 0.35
        # movement inside the chord
        steps = int(chord_len / (beat / 2))
        for k in range(steps):
            s0 = a + int(k * beat / 2 * SR)
            if s0 >= len(t): break
            if mood == 'curious' and k % 2 == 0:
                p_ = pluck(HZ(notes[(k // 2) % 3] + 12), 0.6) * 0.25
            elif mood == 'playful' and k % 2 == 0:
                p_ = pluck(HZ(notes[[0, 2, 1, 2][(k // 2) % 4]] + (12 if k % 4 else 0)), 0.3) * 0.3
            elif mood == 'tension':
                p_ = np.sin(2 * np.pi * HZ(notes[0] - 12) * t_(0.18)) * np.exp(-14 * t_(0.18)) * 0.35
            elif mood == 'modern' and k % 2 == 0:
                p_ = np.sin(2 * np.pi * np.cumsum(70 * (45 / 70) ** (t_(0.2) / 0.2)) / SR) * np.exp(-14 * t_(0.2)) * (0.35 if k % 4 == 0 else 0.0)
            elif mood == 'modern':
                p_ = hp(noise(0.05), 7000) * np.exp(-70 * t_(0.05)) * 0.06
            else:
                continue
            e_ = min(len(t), s0 + len(p_)); x[s0:e_] += p_[: e_ - s0]
    if mood == 'tension':   # thin high shimmer
        x += np.sin(2 * np.pi * HZ(key + 24) * t) * 0.04 * (0.5 + 0.5 * np.sin(2 * np.pi * t / 5))
    return x

def music_score(d, segments, quiet=()):
    """segments: [[start, end, mood, section_index], ...]; moods crossfade over 1.5 s; quiet beats sink to a whisper."""
    out = np.zeros(int(d * SR)); xf = 1.5
    for start, end, mood, si in segments:
        a = max(0.0, start - xf / 2); b = min(d, end + xf / 2)
        seg = mood_track(mood, b - a, int(si))
        n = len(seg); ramp = int(xf * SR)
        w = np.ones(n)
        if a > 0: w[:ramp] = np.sin(np.linspace(0, np.pi / 2, min(ramp, n))) ** 2 if n >= ramp else w[:ramp]
        if b < d: w[-ramp:] = np.cos(np.linspace(0, np.pi / 2, min(ramp, n))) ** 2 if n >= ramp else w[-ramp:]
        i0 = int(a * SR); i1 = min(len(out), i0 + n)
        out[i0:i1] += (seg * w)[: i1 - i0]
    g = np.ones(len(out))
    for a, b in quiet:
        ia, ib = int(a * SR), int(b * SR); ramp = int(0.8 * SR)
        g[ia:ib] = np.minimum(g[ia:ib], 0.25)
        g[max(0, ia - ramp):ia] = np.minimum(g[max(0, ia - ramp):ia], np.linspace(1, 0.25, ia - max(0, ia - ramp)))
        g[ib:ib + ramp] = np.minimum(g[ib:ib + ramp], np.linspace(0.25, 1, len(g[ib:ib + ramp])))
    out *= g
    return norm(out, 0.8)

def music_bed(d, quiet=()):
    """A light, curious documentary bed: soft pad chords + gentle pulse. Ducked under the voice later."""
    t = t_(d)
    bpm = 100; beat = 60 / bpm
    chords = [(57, 60, 64), (53, 57, 60), (48, 52, 55), (55, 59, 62)]   # Am F C G (MIDI)
    hz = lambda m: 440 * 2 ** ((m - 69) / 12)
    bar = beat * 8
    pad = np.zeros(len(t))
    for ci in range(int(d / bar) + 1):
        a, b = int(ci * bar * SR), min(len(t), int((ci + 1) * bar * SR) + int(0.3 * SR))
        if a >= len(t): break
        tt = np.arange(b - a) / SR
        ch = chords[ci % 4]
        seg = sum(sum(np.sin(2 * np.pi * hz(m) * k * tt + k) / k ** 1.6 for k in (1, 2, 3)) for m in ch)
        seg += np.sin(2 * np.pi * hz(ch[0] - 12) * tt) * 0.9
        fade = np.minimum(1, tt / 0.4) * np.minimum(1, (tt[-1] - tt + 1e-3) / 0.4)
        pad[a:b] += seg * fade
    pad = lp(pad, 1400) * 0.22
    pulse = np.zeros(len(t))
    k = np.sin(2 * np.pi * np.cumsum(70 * (45 / 70) ** (t_(0.2) / 0.2)) / SR) * np.exp(-14 * t_(0.2))
    hh = hp(noise(0.05), 7000) * np.exp(-70 * t_(0.05))
    for i in range(int(d / beat)):
        s = int(i * beat * SR)
        if i % 2 == 0 and s + len(k) < len(pulse): pulse[s:s + len(k)] += k * 0.5
        s2 = int((i + 0.5) * beat * SR)
        if s2 + len(hh) < len(pulse): pulse[s2:s2 + len(hh)] += hh * 0.12
    x = pad + pulse
    g = np.ones(len(t))
    for a, b in quiet:                         # sombre passages: the music steps back
        ia, ib = int(a * SR), int(b * SR)
        ramp = int(0.8 * SR)
        g[max(0, ia - ramp):ia] = np.minimum(g[max(0, ia - ramp):ia], np.linspace(1, 0.15, ia - max(0, ia - ramp)))
        g[ia:ib] = 0.15
        g[ib:ib + ramp] = np.minimum(g[ib:ib + ramp], np.linspace(0.15, 1, len(g[ib:ib + ramp])))
    x *= g * np.minimum(1, t / 1.0) * np.minimum(1, (d - t) / 1.5)
    return norm(x, 0.8)

SHOTS = dict(bleat=bleat, whoosh=whoosh, tick=tick, ticks=ticks, pop=pop, pops=pops, boing=boing, thud=thud, drum=drum, coins=coins,
             kaching=kaching, ding=ding, clang=clang, slam=slam, slide_down=slide_down, paper=paper, scribble=scribble,
             blip=blip, sob=sob, neigh=neigh, rumble=rumble,
             impact=impact, boom=boom, riser=riser, swish=swish, pop2=pop2, sparkle=sparkle, deflate=deflate, stamp=stamp,
             hit=hit, glitch=glitch, crack=crack, creak=creak, steps=steps, drone=drone, machine=machine, anvil=anvil)


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
    if data.get('music'):
        m = None
        if data.get('phrases'):
            sys.path.insert(0, __import__('os').path.dirname(__import__('os').path.abspath(__file__)))
            import score as _score
            if _score.available():
                m = _score.render(data['phrases'], data['duration'] + 1, data.get('quiet', []))
                print('music: sampled instruments, following the narration')
        if m is None:
            m = music_score(data['duration'] + 1, data['score'], data.get('quiet', [])) if data.get('score') else music_bed(data['duration'] + 1, data.get('quiet', []))
        mp = out_path.replace('sfx.wav', 'music.wav')
        wavfile.write(mp, SR, (np.stack([m, m], 1) * 32767).astype(np.int16))
        print('wrote', mp)
    stereo = np.stack([mix, mix], 1)
    wavfile.write(out_path, SR, (stereo * 32767).astype(np.int16))
    print('wrote', out_path, f'{N / SR:.1f}s', 'peak', float(np.max(np.abs(mix))))


if __name__ == '__main__':
    main()
