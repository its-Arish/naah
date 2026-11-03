#!/usr/bin/env python3
"""
make_music_bed.py: build ONE background-music MP3 for a video from several tracks.

For each cue you give:
  - a direct download link (https://...mp3) or a file on your computer
  - where it starts and ends IN YOUR VIDEO   (e.g. 2:40 and 5:10)
  - optionally, where to start INSIDE the song (e.g. 0:15 skips the intro)
It downloads the files, fits each one into its slot (looping it if the song is
shorter than the slot), fades it in and out, leaves silence in the gaps, and
writes music_bed.mp3, ready to drop under your video at 0:00.

Needs: Python 3 and ffmpeg (https://ffmpeg.org/download.html) on your PATH.

Run it:
  python3 make_music_bed.py              ask me cue by cue
  python3 make_music_bed.py cues.txt     use a saved cue list (no questions)

Downloaded songs are kept in a music_downloads folder, so a re-run (or a fix to
one cue) doesn't download everything again.

Every interactive run also saves your answers to cues.txt, so you can fix one
line in a text editor and re-run instead of typing everything again.

cues.txt format, one cue per line (# starts a comment):
  START  END  SOURCE  [SONG_OFFSET]  [VOLUME]
  0:00   0:20 https://incompetech.com/.../Hidden%20Agenda.mp3
  2:40   5:10 investigations.mp3  0:05  0.8
"""
import os
import re
import time
import shutil
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request

CACHE = "music_downloads"   # songs are kept here, so re-runs don't download again
FADE = 1.5          # seconds of fade in and out on every cue
OUT = "music_bed.mp3"


def secs(text):
    """'1:02:03', '2:40', '95' or '95.5' -> seconds (float)."""
    text = text.strip()
    if not re.fullmatch(r"\d+(:\d{1,2}){0,2}(\.\d+)?", text):
        raise ValueError(f"'{text}' isn't a time. Use m:ss, like 2:40.")
    total = 0.0
    for part in text.split(":"):
        total = total * 60 + float(part)
    return total


def stamp(s):
    m, s = divmod(round(s), 60)
    h, m = divmod(m, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def fetch(source, folder):
    """Return a local path for a URL or a file path."""
    if re.match(r"https?://", source):
        if re.search(r"(youtube\.com|youtu\.be)/", source):
            raise ValueError("That's a YouTube page, not a file. Download the track from "
                             "YouTube Studio > Audio Library (or incompetech.com) and give me the file.")
        name = os.path.basename(urllib.parse.urlparse(source).path) or "track"
        name = urllib.parse.unquote(name)
        dest = os.path.join(CACHE, name)
        if os.path.isfile(dest) and os.path.getsize(dest) >= 10000:
            return dest                      # already downloaded (this run or an earlier one)
        os.makedirs(CACHE, exist_ok=True)
        time.sleep(2)                        # be polite: sites block rapid repeat downloads
        print(f"  downloading {name} ...")
        if shutil.which("curl"):
            # curl uses the system's certificates (fixes Python SSL problems on macOS) and retries
            r = subprocess.run(["curl", "-fL", "--retry", "5", "--retry-delay", "5", "--retry-all-errors",
                                "--connect-timeout", "30", "--max-time", "300",
                                "-A", "Mozilla/5.0 (Macintosh) make_music_bed/1.1",
                                "-o", dest, source], capture_output=True, text=True)
            if r.returncode != 0:
                if os.path.exists(dest):
                    os.remove(dest)
                msg = (r.stderr.strip().splitlines() or ["unknown error"])[-1]
                raise ValueError(f"Couldn't download {name}: {msg}. Open the link in your browser to check it.")
        else:
            req = urllib.request.Request(source, headers={"User-Agent": "make_music_bed/1.1"})
            with urllib.request.urlopen(req, timeout=120) as r, open(dest, "wb") as f:
                shutil.copyfileobj(r, f)
        if os.path.getsize(dest) < 10000:
            raise ValueError(f"{name} downloaded but is too small to be music. Check the link in your browser.")
        return dest
    path = os.path.expanduser(source.strip().strip('"').strip("'"))
    if not os.path.isfile(path):
        raise ValueError(f"Can't find the file '{path}'.")
    return path


def ask_cues():
    print("\nAdd your music cues. Times are positions in YOUR VIDEO, like 2:40.")
    print("Press Enter on an empty 'Link or file' when you're done.\n")
    cues = []
    while True:
        n = len(cues) + 1
        try:
            src = input(f"Cue {n}  Link or file: ").strip()
        except EOFError:
            break
        if not src:
            break
        maybe = os.path.expanduser(src.strip('"').strip("'"))
        if maybe.lower().endswith(".txt") and os.path.isfile(maybe):
            print(f"  That's a cue list, loading every cue from {os.path.basename(maybe)}.\n")
            return read_cues(maybe)
        if not re.match(r"https?://", src) and not os.path.isfile(maybe):
            print(f"  ! Can't find '{maybe}'. Paste a link, or drag the music file into this window.\n")
            continue
        if "\t" in src or len(src.split()) > 1 and not os.path.isfile(maybe):
            print("  ! Paste one link at a time.\n")
            continue
        if re.search(r"(youtube\.com|youtu\.be)/", src):
            print("  ! That's a YouTube page, not a file. Download the track from YouTube Studio >"
                  " Audio Library (or incompetech.com) and give me the file or its direct link.\n")
            continue
        try:
            start = secs(input(f"Cue {n}  Starts in video at: "))
            end = secs(input(f"Cue {n}  Ends in video at: "))
            if end <= start:
                raise ValueError("The end has to be after the start.")
            off = input(f"Cue {n}  Start inside the song at (Enter = 0:00): ").strip()
            vol = input(f"Cue {n}  Volume 0.1 to 1.0 (Enter = 1.0): ").strip()
            cues.append({"start": start, "end": end, "src": src,
                         "off": secs(off) if off else 0.0, "vol": float(vol) if vol else 1.0})
            print(f"  ok: {stamp(start)} to {stamp(end)}\n")
        except ValueError as e:
            print(f"  ! {e} Let's redo cue {n}.\n")
    return cues


VIDEO_LENGTH = None   # set from a "# ... video length m:ss" header line in a cue file


def read_cues(path):
    global VIDEO_LENGTH
    cues = []
    for i, line in enumerate(open(path, encoding="utf-8"), 1):
        m = re.search(r"video length (\d+(?::\d{1,2}){0,2}(?:\.\d+)?)", line)
        if m:
            VIDEO_LENGTH = secs(m.group(1))
        line = line.split("#", 1)[0].strip()
        if not line:
            continue
        parts = line.split()
        if len(parts) < 3:
            sys.exit(f"cues.txt line {i}: need START END SOURCE")
        cues.append({"start": secs(parts[0]), "end": secs(parts[1]), "src": parts[2],
                     "off": secs(parts[3]) if len(parts) > 3 else 0.0,
                     "vol": float(parts[4]) if len(parts) > 4 else 1.0})
    return cues


def save_cues(cues, path="cues.txt"):
    with open(path, "w", encoding="utf-8") as f:
        f.write("# START  END  SOURCE  SONG_OFFSET  VOLUME\n")
        for c in cues:
            f.write(f"{stamp(c['start'])}  {stamp(c['end'])}  {c['src']}  {stamp(c['off'])}  {c['vol']}\n")
    print(f"Saved your cues to {path} (edit it and run: python3 make_music_bed.py {path})")


def build(cues, out=OUT, total=None):
    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg isn't installed or isn't on your PATH. Get it from https://ffmpeg.org/download.html")
    cues = sorted(cues, key=lambda c: c["start"])
    for a, b in zip(cues, cues[1:]):
        if b["start"] < a["end"]:
            print(f"Note: cues at {stamp(a['start'])} and {stamp(b['start'])} overlap; they'll crossfade.")
    total = total or max(c["end"] for c in cues)
    tmp = tempfile.mkdtemp(prefix="musicbed_")
    try:
        args, chains = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error"], []
        for i, c in enumerate(cues):
            path = fetch(c["src"], tmp)
            dur = c["end"] - c["start"]
            fade = min(FADE, dur / 3)
            # loop the song if it's shorter than its slot, skip SONG_OFFSET, cut to the slot length
            args += ["-stream_loop", "-1", "-ss", f"{c['off']:.3f}", "-i", path]
            delay = int(round(c["start"] * 1000))
            chains.append(
                f"[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo,"
                f"atrim=duration={dur:.3f},asetpts=PTS-STARTPTS,"
                f"afade=t=in:d={fade:.2f},afade=t=out:st={dur - fade:.3f}:d={fade:.2f},"
                f"volume={c['vol']},adelay={delay}|{delay}[c{i}]")
        mix = "".join(f"[c{i}]" for i in range(len(cues)))
        chains.append(f"{mix}amix=inputs={len(cues)}:duration=longest:normalize=0,"
                      f"apad,atrim=duration={total:.3f}[out]")
        args += ["-filter_complex", ";".join(chains), "-map", "[out]",
                 "-c:a", "libmp3lame", "-b:a", "192k", out]
        print("  mixing ...")
        subprocess.run(args, check=True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print(f"\nDone: {out}  ({stamp(total)} long, {len(cues)} cue{'s' if len(cues) > 1 else ''})")
    for c in cues:
        print(f"  {stamp(c['start'])}-{stamp(c['end'])}  {os.path.basename(c['src'])}")
    print("Put it under your video at 0:00 and set it well below your voice.")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        cues = read_cues(sys.argv[1])
    else:
        cues = ask_cues()
        if not cues:
            sys.exit("No cues, nothing to do.")
        save_cues(cues)
    try:
        length = input("Total video length (Enter = end of last cue): ").strip() if len(sys.argv) == 1 else ""
    except EOFError:
        length = ""
    try:
        build(cues, total=secs(length) if length else VIDEO_LENGTH)
    except (ValueError, OSError, subprocess.CalledProcessError) as e:
        sys.exit(f"Stopped: {e}")
