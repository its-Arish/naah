"""
score.py — background music that follows the narration, played on real sampled instruments
(piano, violin, cello, strings, pizzicato) through FluidSynth and a General MIDI soundfont.

How it follows the voice (inputs come from build/cues.json "phrases", one per spoken beat):
  * the harmony moves when a new sentence starts, not on a fixed loop;
  * when a sentence ends and there is a pause, a short piano phrase answers in the gap;
  * an emphasised word (*word*) can get a single soft note, sparingly;
  * each section has a mood, which decides the instruments and how busy the music is:
      curious  – piano broken chords + plucked strings
      grand    – sustained string chords over a piano bass
      tension  – low cello pulse + tremolo strings, thin high violin
      sombre   – deliberately monotonous: a held cello note, a rare low piano note
      modern   – a steady, quiet piano pattern (monotonous on purpose) over soft strings
      playful  – pizzicato and staccato piano, for comedy sketches
      none     – silence
  * section cards get a chord in the new key.

Uses libfluidsynth (apt: libfluidsynth3) and a GM soundfont: $MUSIC_SF2, else the system
default-GM.sf2. A better piano/string soundfont makes it sound better; nothing else changes.
"""
import ctypes, ctypes.util, os
import numpy as np

SR = 48000
GM = {'piano': 0, 'violin': 40, 'cello': 42, 'tremolo': 44, 'pizz': 45, 'strings': 48, 'slowstrings': 49}
KEYS = [57, 50, 52, 55, 53, 48, 59, 54, 57, 50, 52, 55, 53, 48]   # one key per section (A, D, E, G, F, C, B, F#…)
PROG = {
    'minor': [[(0, 'm'), (8, 'M'), (3, 'M'), (10, 'M')], [(0, 'm'), (5, 'm'), (8, 'M'), (7, 'M')], [(0, 'm'), (10, 'M'), (8, 'M'), (7, 'M')]],
    'major': [[(0, 'M'), (7, 'M'), (9, 'm'), (5, 'M')], [(0, 'M'), (5, 'M'), (9, 'm'), (7, 'M')], [(0, 'M'), (4, 'm'), (5, 'M'), (7, 'M')]],
}
SCALE = {'major': [0, 2, 4, 5, 7, 9, 11], 'minor': [0, 2, 3, 5, 7, 8, 10]}


def _soundfont():
    for p in (os.environ.get('MUSIC_SF2'), '/usr/share/sounds/sf2/default-GM.sf2', '/usr/share/sounds/sf2/FluidR3_GM.sf2',
              '/usr/share/sounds/sf2/TimGM6mb.sf2', '/usr/share/soundfonts/default.sf2'):
        if p and os.path.exists(p):
            return p
    return None


def available():
    return bool((ctypes.util.find_library('fluidsynth') or os.path.exists('/lib/x86_64-linux-gnu/libfluidsynth.so.3')) and _soundfont())


class Synth:
    def __init__(self):
        name = ctypes.util.find_library('fluidsynth') or 'libfluidsynth.so.3'
        L = self.L = ctypes.CDLL(name)
        L.new_fluid_settings.restype = ctypes.c_void_p
        L.new_fluid_synth.restype = ctypes.c_void_p; L.new_fluid_synth.argtypes = [ctypes.c_void_p]
        L.fluid_settings_setnum.argtypes = [ctypes.c_void_p, ctypes.c_char_p, ctypes.c_double]
        L.fluid_settings_setint.argtypes = [ctypes.c_void_p, ctypes.c_char_p, ctypes.c_int]
        L.fluid_synth_sfload.argtypes = [ctypes.c_void_p, ctypes.c_char_p, ctypes.c_int]
        L.fluid_synth_program_change.argtypes = [ctypes.c_void_p, ctypes.c_int, ctypes.c_int]
        L.fluid_synth_noteon.argtypes = [ctypes.c_void_p, ctypes.c_int, ctypes.c_int, ctypes.c_int]
        L.fluid_synth_noteoff.argtypes = [ctypes.c_void_p, ctypes.c_int, ctypes.c_int]
        L.fluid_synth_cc.argtypes = [ctypes.c_void_p, ctypes.c_int, ctypes.c_int, ctypes.c_int]
        L.fluid_synth_write_float.argtypes = [ctypes.c_void_p, ctypes.c_int, ctypes.c_void_p, ctypes.c_int, ctypes.c_int, ctypes.c_void_p, ctypes.c_int, ctypes.c_int]
        st = L.new_fluid_settings()
        L.fluid_settings_setnum(st, b'synth.sample-rate', SR)
        L.fluid_settings_setnum(st, b'synth.gain', 0.5)
        L.fluid_settings_setint(st, b'synth.reverb.active', 1)
        L.fluid_settings_setnum(st, b'synth.reverb.room-size', 0.75)
        L.fluid_settings_setnum(st, b'synth.reverb.level', 0.6)
        self.s = L.new_fluid_synth(st)
        L.fluid_synth_sfload(self.s, _soundfont().encode(), 1)
        for ch, prog in enumerate(GM.values()):
            L.fluid_synth_program_change(self.s, ch, prog)
        self.ch = {k: i for i, k in enumerate(GM)}

    def render(self, events, duration):
        """events: (time, 'on'|'off'|'cc', instrument, note_or_cc, velocity_or_value)."""
        events = sorted(events, key=lambda e: (e[0], 0 if e[1] == 'off' else 1))
        n_total = int(duration * SR); out = np.zeros((n_total, 2), dtype=np.float32)
        pos = 0
        def run(upto):
            nonlocal pos
            while pos < upto:
                n = min(upto - pos, SR)
                Lb = (ctypes.c_float * n)(); Rb = (ctypes.c_float * n)()
                self.L.fluid_synth_write_float(self.s, n, Lb, 0, 1, Rb, 0, 1)
                out[pos:pos + n, 0] = np.frombuffer(Lb, dtype=np.float32); out[pos:pos + n, 1] = np.frombuffer(Rb, dtype=np.float32)
                pos += n
        for t, kind, inst, a, b in events:
            run(min(n_total, max(pos, int(t * SR))))
            c = self.ch[inst]
            if kind == 'on': self.L.fluid_synth_noteon(self.s, c, int(a), int(max(1, min(127, b))))
            elif kind == 'off': self.L.fluid_synth_noteoff(self.s, c, int(a))
            else: self.L.fluid_synth_cc(self.s, c, int(a), int(b))
        run(n_total)
        return out


def compose(phrases, duration, seed=7):
    """phrases: [{'s','e','mood','si','em':[t...],'stop':bool,'card':bool}] sorted by time. Returns (events, quiet_ranges)."""
    rng = np.random.default_rng(seed)
    ev = []
    def note(t, inst, n, v, d):
        ev.append((t, 'on', inst, n, v)); ev.append((t + d, 'off', inst, n, 0))
    by_sec = {}
    chord_i = {}
    last_chord_t = -9
    for i, p in enumerate(phrases):
        mood, si = p.get('mood') or 'none', int(p.get('si', 0))
        if mood == 'none':
            continue
        scale = 'minor' if mood in ('tension', 'sombre') or si % 3 == 2 else 'major'
        key = KEYS[si % len(KEYS)]
        prog = PROG[scale][si % len(PROG[scale])]
        s, e = p['s'], p['e']
        nxt = phrases[i + 1]['s'] if i + 1 < len(phrases) else duration
        gap = nxt - e
        # harmony moves on a new sentence (but not more often than every 2.5 s)
        if p.get('card') or s - last_chord_t >= 2.5:
            chord_i[si] = chord_i.get(si, -1) + 1
            last_chord_t = s
        root, q = prog[chord_i.get(si, 0) % len(prog)]
        r = key + root - 12
        tri = [r, r + (3 if q == 'm' else 4), r + 7]
        span = max(0.6, nxt - s)
        if p.get('card'):
            for k, n in enumerate(tri):
                note(s + k * 0.06, 'piano', n, 52, 2.2)
            note(s, 'strings', tri[0] - 12, 40, 2.6); note(s, 'strings', tri[2], 34, 2.6)
            continue
        if mood == 'curious':
            for k, n in enumerate([tri[0], tri[2], tri[1] + 12]):
                note(s + 0.05 + k * 0.22, 'piano', n, 36 + rng.integers(0, 6), 1.6)
            note(s, 'piano', tri[0] - 12, 34, min(span, 3.5))
        elif mood == 'grand':
            for n in (tri[0] - 12, tri[0], tri[1], tri[2]):
                note(s, 'strings', n, 40, span + 0.4)
            note(s, 'piano', tri[0] - 24, 42, min(span, 4))
        elif mood == 'tension':
            note(s, 'tremolo', tri[0] - 12, 34, span + 0.3); note(s, 'tremolo', tri[2] - 12, 28, span + 0.3)
            for k in range(int(span / 0.55)):
                note(s + k * 0.55, 'cello', tri[0] - 24, 40 if k % 4 == 0 else 30, 0.4)
            if rng.random() < 0.4:
                note(s + 0.3, 'violin', tri[2] + 12, 24, span)
        elif mood == 'sombre':
            # monotonous on purpose: one long cello tone per few sentences, a rare low piano note
            if i == 0 or phrases[i - 1].get('mood') != 'sombre' or rng.random() < 0.25:
                note(s, 'cello', key - 24, 36, max(span, 6))
                note(s, 'slowstrings', key - 12 + 7, 22, max(span, 6))
            if rng.random() < 0.35:
                note(s + 0.4, 'piano', key - 12, 30, 3)
        elif mood == 'modern':
            k, t = 0, s
            while t < s + span - 0.1:
                note(t, 'piano', [tri[0], tri[2], tri[1] + 12, tri[2]][k % 4], 30 if k % 4 else 36, 0.5)
                k += 1; t += 60 / 100 / 2
            note(s, 'strings', tri[0], 26, span + 0.3)
        elif mood == 'playful':
            for k, n in enumerate([tri[0], tri[2], tri[1] + 12, tri[2]]):
                note(s + k * 0.17, 'pizz', n, 50, 0.2)
            note(s + 0.08, 'piano', tri[2] + 12, 30, 0.25)
        # emphasised words: a single soft note, at most one per sentence
        if p.get('em') and mood in ('curious', 'grand', 'tension', 'playful') and rng.random() < 0.6:
            tt = p['em'][0]
            inst = 'pizz' if mood in ('curious', 'playful') else 'piano'
            note(tt, inst, tri[1] + 12, 34, 0.6)
        # the music answers in the pause after a sentence
        if p.get('stop') and gap >= 0.75 and mood in ('curious', 'grand', 'tension', 'modern'):
            deg = SCALE[scale]
            motif = [tri[2] + 12, key + deg[(root // 2 + 4) % 7], tri[1] + 12] if rng.random() < 0.5 else [tri[1] + 12, tri[0] + 12, tri[2]]
            for k, n in enumerate(motif):
                note(e + 0.12 + k * 0.2, 'piano', n, 40 - k * 3, 0.9)
    return ev


def render(phrases, duration, quiet=()):
    ev = compose(phrases, duration)
    x = Synth().render(ev, duration).mean(axis=1)
    # quiet (sombre) beats sink further
    g = np.ones(len(x))
    for a, b in quiet:
        ia, ib = int(a * SR), int(b * SR); ramp = int(0.8 * SR)
        g[ia:ib] = np.minimum(g[ia:ib], 0.4)
        g[max(0, ia - ramp):ia] = np.minimum(g[max(0, ia - ramp):ia], np.linspace(1, 0.4, ia - max(0, ia - ramp)))
        g[ib:ib + ramp] = np.minimum(g[ib:ib + ramp], np.linspace(0.4, 1, len(g[ib:ib + ramp])))
    x = x * g
    m = np.max(np.abs(x)) or 1
    return x / m * 0.8
