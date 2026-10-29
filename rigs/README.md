# Character rigs for hand animation

Every character in the studio as a **cut-out rig**: each moving part on its own named layer, ready to animate by hand in other programs. The same characters still work in the studio's own renderer, so you can use either route.

One folder per character (`NVA/`, `HOST/` (the narrator), `GI/`, `QUEEN/`…). See `docs/gallery/13-rigs-cutout.png` for all of them.

| File | Use it in |
|---|---|
| `NAME.psd` | **After Effects** (Import → Composition – Retain Layer Sizes), **Character Animator**, Photoshop, Krita, GIMP, Affinity, Photopea. Layer groups and hidden alternates are kept. |
| `NAME.svg` | **Illustrator**, Inkscape, Affinity Designer, **Moho**, **Toon Boom Harmony**, Blender (Import SVG). Vector, scales to any size. |
| `parts/*.png` | Anything else (Spine, DragonBones, CapCut, Premiere, Blender planes). Every PNG is the full canvas size, so all parts line up when stacked in number order. |
| `rig.json` | Canvas size, layer order and the **pivot** (joint) of every part, in pixels from the top-left. |
| `pivots.png` | The assembled character with each pivot marked in pink: set your anchor points there. |
| `preview.png` | The assembled character. |

## Layers

Bottom to top: Cape, Right/Left Leg (Thigh, Foot), **Right Arm** (Item, Forearm, Upper Arm, Hand), Body (Torso, Trim, Sash, Belt), **Head** (Face, Hair, Eyes, Eyebrows, Beard, Mouth, Mustache, Glasses, Hat), **Left Arm**.

- **Sides follow the character**, as Character Animator expects: "Right Arm" is on the left of the screen.
- **Eyes**: `Pupil` (visible), `Blink`, `Eye Calm`, `Eye Shock`, `Eye Grin` (hidden; swap in).
- **Eyebrows**: `Neutral`, `Angry`, `Sad`, `Determined`.
- **Mouth**: `Neutral` visible; `Smile`, `Frown`, `Surprised`, `Grin`, and the lip-sync visemes Character Animator auto-tags: `Aa D Ee F L M Oh R S Uh W-Oo`.
- Rotate each part around its pivot: shoulder for Upper Arm, elbow for Forearm, wrist for Hand and Item, hip for Leg, neck for Head.

**Character Animator:** import the PSD, then rename the top group to start with `+` (e.g. `+NVA`) and the `Head` group to `+Head` so they become independent puppets; the eye, brow and mouth names are already the ones it recognises.

**After Effects:** import as Composition – Retain Layer Sizes, move each layer's anchor point to its pivot (from `pivots.png` / `rig.json`), then parent Forearm → Upper Arm → Body and Hand/Item → Forearm. Swap mouths by toggling layer visibility, or put them in a sequence comp.

## Making new or re-dressed characters

Costumes live in `engine/cast/Wardrobe.ts`; the rig geometry is in `engine/characters/Rig.tsx`. Add or change a costume, then run

```
node scripts/export_rigs.mjs            # all characters (about 2½ minutes)
node scripts/export_rigs.mjs NVA HOST   # just some
```

Set `RIG_SCALE=5` for bigger PNG/PSD files (the default 3 makes a figure about 1,000 px tall). The SVGs are vectors and need no scale.
