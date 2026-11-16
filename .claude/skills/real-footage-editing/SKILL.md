---
name: "real-footage-editing"
description: "Find, log, conform and composite real-life footage (stock, archive, photographs) into a film from this studio. Real footage is used in the first minute, and after that only as evidence for a fact: sourcing links per shot, the handover folder, ffmpeg recipes for exact-length shots, motion-graphics overlays, and the licence log. Use whenever a film or cut sheet needs real footage, especially the first-minute cut sheet from mrbeast-hooks-and-cuts."
---

# Real-footage editing

Use with `mrbeast-hooks-and-cuts` (which sets the shot lengths) and `make-history-video` (which makes the drawn world). The workflow is: Claude finds the links, the creator downloads, Claude edits.

## 0. When real footage is used
- **First minute:** real footage per the cut sheet in `mrbeast-hooks-and-cuts`.
- **After the first minute: evidence only.** Real material appears only when it proves or shows a fact: an ancient artefact (a stele, a tablet, a scroll, a coin), an archaeological site, a historical document, or an archive photograph or film of the event itself. Never decorative stock or b-roll, because it pulls attention off the story.
- Ancient periods have no film. For them use the surviving artefacts, sites, manuscripts and maps, shown in the studio's drawn style with the real object as a short insert.
- Keep every real insert short (2.5 seconds at most), label what it is on screen, and go back to the drawn story straight after.
- The studio's drawn scenes carry the story. Real material is a proof point, not a replacement.

## 1. What can and cannot be done from the workspace
- **Cannot:** download from stock or archive sites. The workspace network only reaches package registries and GitHub, so every download is done by the creator. Do not try curl, wget or mirrors.
- **Can:** search the web, read the pages that load, and give the creator a direct page link per shot. Everything after the files arrive (trim, crop, grade, push-ins, overlays, audio, assembly) is done here with ffmpeg and the studio's renderer.
- **Never invent a link.** Only give URLs that came back from a search or that the creator supplied. If no real video was found for a shot, say so and give a search page or a photograph instead.

## 2. Sourcing (per shot)
1. Order of preference: Wikimedia Commons, Library of Congress, US National Archives and Internet Archive (government films), then Pexels and Pixabay. Government press-office and news-agency footage usually needs a licence, so use it only if the creator holds one.
2. Give each shot one main link, one backup, and a plain note: what to look for in the clip and what to avoid.
3. **Licence notes, honestly:** say which terms Claude could and could not read. If a licence page cannot be opened, say so and state the rule as "from memory, check it". Wikimedia Commons licences differ per file (read the file page: public domain, CC BY needs credit, CC BY-SA needs credit and share-alike). Pexels and Pixabay: free for commercial use and editing, no credit needed, but do not resell unchanged files, do not imply endorsement, and do not show identifiable people in a bad light.
4. **Identifiable people:** for sensitive topics (religion, war, conflict) only use clips that show people neutrally, such as prayer, walking or work. Never put a stock clip of identifiable people next to a claim about a group's conduct.
5. **Sensitive history** (genocide, massacres, war dead): places, documents, objects and consenting survivors. Nothing graphic, no unverified viral footage, and no AI-generated or reconstructed footage passed off as real.
6. Check that a clip is what its title says before using it (an "arch in Rome" is not automatically the Arch of Titus). If it cannot be confirmed, mark it "verify".

## 3. The footage log
Keep `projects/<film>/footage.md` with one row per shot: shot number, the words spoken, main link, backup link, licence, downloaded (yes/no), cleared (yes/no), and notes. Update it as clips arrive. It is the record of where every clip came from.

## 4. Handover from the creator
- One file per shot, named by shot number: `01.mp4`, `02.mp4`, … (use `07a.mp4`, `07b.mp4` if a shot has options).
- Trim to about 5 to 10 seconds, 1080p or higher, original audio not needed. A zip is fine.
- Photographs are accepted (`11.jpg`). They get a slow push-in so they behave like a shot.
- When files arrive, check each one with `ffprobe` (size, frame rate, length) and report any that are too short, too low-resolution or vertical.

## 5. Conform every clip to its slot
Slot = the length in the cut sheet (54 frames for a 1.8 s shot at 30 fps, 72 frames for the 2.4 s closing shot). These recipes were tested here and give the exact frame count.

Video clip, cropped to fill 1920x1080, with a slow push-in, no audio:
```
ffmpeg -ss <in> -i 07.mp4 -t 1.8 -an -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,zoompan=z='1+0.06*on/54':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30" -frames:v 54 -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p shots/07.mp4
```
- Pick `<in>` so the best moment of the clip falls inside the slot, and vary the push-in (zoom out, pan left or right) so neighbouring shots do not move the same way.
- Photograph: `-loop 1 -i 11.jpg` instead of `-ss … -i`, keep `-t 1.8`.
- Colour match with a light grade, for example `eq=contrast=1.05:saturation=0.9:gamma=0.98`, then compare a contact sheet of the whole minute and adjust so a modern clip and an archive clip do not look like two different films. Archive clips can be left black and white or lightly warmed, but never faked as colour.
- Always verify: `ffprobe -count_frames -show_entries stream=nb_read_frames` must print the slot length.

## 6. Motion graphics over footage
- Render each overlay (timeline bar, date counter, labels, GIS map inserts, captions, narrator) from the studio renderer as transparent PNG frames, or as a single transparent image for a static label, then composite:
```
ffmpeg -i shots/07.mp4 -loop 1 -i overlays/07.png -filter_complex "[0:v][1:v]overlay=0:0:shortest=1" -c:v libx264 -crf 18 -pix_fmt yuv420p out/07.mp4
```
- Keep the overlays inside the safe area (nothing important in the bottom caption zone), animate them on the spoken word, and keep them readable on bright and dark clips (a soft shadow or a small solid plate).
- **Pilot first:** the studio's renderer was built for drawn scenes, so the first time footage is combined with studio graphics, build the first minute only, look at it, and fix the pipeline before doing the whole film.

## 7. Assemble
- Join shots with the concat demuxer (`-f concat -safe 0 -i list.txt -c copy`) so cuts stay frame-exact; do not re-encode between shots.
- Deliver video, voiceover, music and SFX as separate tracks of identical length (per `video-deliverables`), plus a preview with everything mixed. Voiceover louder than music and SFX. Add a short SFX hit on each cut in the first minute.
- Final check: total length of the first minute is 60.0 s, every shot is its slot length, shots 1 to 17 are all real-life footage, and the footage log has a cleared "yes" for every clip used.
