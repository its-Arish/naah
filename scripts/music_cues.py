#!/usr/bin/env python3
"""
music_cues.py: turn a film's music plan into cues.txt with EXACT timestamps from the rendered timeline.

  python3 scripts/music_cues.py <slug>          reads projects/<slug>/music.json + build/timeline.json
                                                writes projects/<slug>/cues.txt
  python3 scripts/make_music_bed.py projects/<slug>/cues.txt   then builds music_bed.mp3

Run it after `studio.mjs all <slug>` (or at least `timeline`), so the times match the voiceover.

music.json
----------
{
  "base": "https://incompetech.com/music/royalty-free/mp3-royaltyfree/",   # optional prefix for files
  "tracks": {
    "tension": { "file": "Darkest%20Child.mp3", "title": "Darkest Child", "by": "Kevin MacLeod",
                 "license": "CC BY 4.0", "heard": false },
    ...
  },
  "cues": [
    { "from": "q1", "to": "q1@bomb", "track": "tension", "volume": 0.8 },
    { "from": "q1@bomb+1", "to": "q2.end", "track": "tension", "offset": "0:08" },
    ...
  ]
}

Time points ("from" / "to") can be:
  "s01b03"          start of that beat            "s01b03.end"    end of that beat
  "s01b03@word"     the moment that word is said  (first match; "@word#2" for the 2nd)
  "+1.5" / "-0.5"   added to any of the above, in seconds (e.g. "s01b03@bomb+1")
  "2:40"            a plain video time, if you don't want to tie it to a beat
Gaps between cues stay silent: that's how you plan dramatic silences.

House rule (the creator's): every track is "heard": false until the creator has previewed it.
Unheard tracks are flagged in cues.txt and in the console. Never choose a track by its title alone.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def stamp(s):
    s = max(0.0, s)
    m, sec = divmod(s, 60)
    h, m = divmod(int(m), 60)
    return f"{h}:{m:02d}:{sec:04.1f}" if h else f"{m}:{sec:04.1f}"


def plain_time(t):
    if re.fullmatch(r"\d+(:\d{1,2}){0,2}(\.\d+)?", t):
        v = 0.0
        for p in t.split(":"):
            v = v * 60 + float(p)
        return v
    return None


def norm(w):
    return re.sub(r"[^\w]", "", w).lower()


def resolve(point, beats, fps):
    """Time point -> seconds in the video."""
    point = str(point).strip()
    m = re.fullmatch(r"(.*?)([+-]\d+(?:\.\d+)?)?", point)
    base, shift = m.group(1), float(m.group(2) or 0)
    t = plain_time(base)
    if t is not None:
        return t + shift
    end = base.endswith(".end")
    if end:
        base = base[:-4]
    word = None
    if "@" in base:
        base, word = base.split("@", 1)
    if base not in beats:
        raise ValueError(f"no beat '{base}' in the timeline (check the id in beats/*.json)")
    b = beats[base]
    if end:
        return (b["from"] + b["dur"]) / fps + shift
    if word:
        nth = 1
        if "#" in word:
            word, n = word.split("#", 1)
            nth = int(n)
        hits = [w for w in b.get("words", []) if norm(w["w"]) == norm(word)]
        if len(hits) < nth:
            raise ValueError(f"the word '{word}' (#{nth}) isn't in beat '{base}'")
        return (b["from"] + hits[nth - 1]["at"]) / fps + shift
    return b["from"] / fps + shift


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    slug = sys.argv[1]
    proj = os.path.join(ROOT, "projects", slug)
    plan = json.load(open(os.path.join(proj, "music.json"), encoding="utf-8"))
    tl = json.load(open(os.path.join(proj, "build", "timeline.json"), encoding="utf-8"))
    fps = tl["fps"]
    beats = {s["id"]: s for s in tl["shots"] if s.get("id")}
    total = tl["total"] / fps
    base = plan.get("base", "")
    tracks = plan["tracks"]
    lines, unheard, errors = [], set(), []
    for i, c in enumerate(plan["cues"], 1):
        try:
            tr = tracks[c["track"]]
            a, b = resolve(c["from"], beats, fps), resolve(c["to"], beats, fps)
            if b <= a:
                raise ValueError(f"ends ({stamp(b)}) before it starts ({stamp(a)})")
            src = tr["file"] if re.match(r"https?://|/", tr["file"]) else base + tr["file"]
            flag = "" if tr.get("heard") else "   # NOT YET HEARD: preview before publishing"
            if not tr.get("heard"):
                unheard.add(tr.get("title", c["track"]))
            lines.append(f"{stamp(a)}  {stamp(b)}  {src}  {c.get('offset', '0:00')}  {c.get('volume', 0.8)}{flag}")
        except (KeyError, ValueError) as e:
            errors.append(f"cue {i}: {e}")
    if errors:
        sys.exit("Fix music.json:\n  " + "\n  ".join(errors))
    out = os.path.join(proj, "cues.txt")
    with open(out, "w", encoding="utf-8") as f:
        f.write(f"# {slug}: music cues from music.json + build/timeline.json (video length {stamp(total)})\n")
        f.write("# Build: python3 scripts/make_music_bed.py projects/%s/cues.txt\n" % slug)
        f.write("# START  END  SOURCE  SONG_OFFSET  VOLUME\n")
        f.write("\n".join(lines) + "\n")
    print(f"wrote {os.path.relpath(out, ROOT)}: {len(lines)} cues, video {stamp(total)}")
    if unheard:
        print("NOT YET HEARD (preview each before publishing): " + ", ".join(sorted(unheard)))
    credits = {t.get("title") for t in tracks.values() if t.get("title")}
    if credits:
        print("\nDescription credits:")
        for t in sorted(credits):
            tr = next(v for v in tracks.values() if v.get("title") == t)
            if "MacLeod" in tr.get("by", ""):
                print(f'"{t}" Kevin MacLeod (incompetech.com)\nLicensed under Creative Commons: By Attribution 4.0 License\n'
                      "http://creativecommons.org/licenses/by/4.0/\n")
            else:
                print(f'"{t}" by {tr.get("by", "?")} ({tr.get("license", "check license")})\n')


if __name__ == "__main__":
    main()
