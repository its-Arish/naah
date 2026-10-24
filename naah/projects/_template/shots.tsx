/**
 * shots.tsx — maps every shot id used in beats/*.json to a React component.
 *
 * Start here:
 *   1. `node scripts/studio.mjs draft <project>` turns script.md into beats/00-draft.json.
 *   2. Edit the beats: give each one a meaningful "shot" id (several beats can share one), dates, sfx.
 *   3. Add a component for every shot id below. `studio check <project>` lists the missing ones.
 * See CLAUDE.md for the style rules and docs/SCENES.md for every ready-made scene and prop.
 */
import React from 'react';
import { useCurrentFrame, interpolate, Easing, springPop } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { Hills, Cloud, OL } from '@engine/scenes/Parts';
import { hostShot, makeOpening, makeEnd, wordAt, Drop, type ShotMap, type SP } from '@engine/kit';

// An example STORY shot: a set, a character, one physical action timed to a spoken word.
const Example: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const hit = wordAt(s, 'tea'); // the frame the word "tea" appears in the caption
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [960, 600], shakes: [{ at: hit + 18, amp: 6, len: 8 }] }}>
        <Layer depth={0}>
          <rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDay)" />
          <Cloud x={300} y={150} />
        </Layer>
        <Layer depth={0.5}><Hills y={640} fill="#A8C07A" seed="ex" stroke={false} /></Layer>
        <Layer depth={1}>
          <rect x={-200} y={800} width={2400} height={400} fill="#C9A66B" stroke={OL} strokeWidth={4} />
          <Chibi x={760} y={810} s={1.2} outfit={{ top: '#C0392B', bottom: '#33415C' }} hat="none" hair="#2A1B12" pose={[{ at: 0, pose: 'idle' }, { at: hit, pose: 'cheer' }]} expr={[{ at: 0, expr: 'happy' }, { at: hit, expr: 'grin' }]} talking={[]} seed="ex" />
          {/* a teapot falls under gravity and squashes when it lands */}
          <Drop at={hit} x={1180} y={800} h={700}>
            <path d="M-60 0 Q-70 -90 0 -95 Q70 -90 60 0 Z M60 -60 Q100 -70 110 -110" fill="#2E86C1" stroke={OL} strokeWidth={5} />
          </Drop>
        </Layer>
      </CameraRig>
      <Label text="Tea!" x={1180} y={300} at={hit + 20} size={90} color="#FFD84A" />
    </>
  );
};

// A SKETCH: two characters; the dialogue bubbles are drawn automatically from the beats (speaker A = right, B = left).
const Sketch: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1, zoomTo: 1 }}>
    <InsertBg />
    <Layer depth={1}>
      <Chibi x={560} y={900} s={1.4} outfit={{ top: '#E2B13C', robe: true, trim: '#B3261E' }} hat="crown" beard pose="hold" expr="happy" talking={s.speaker === 'B' ? [[6, s.talkEnd ?? 60]] : []} seed="emp" />
      <Chibi x={1360} y={900} s={1.4} outfit={{ top: '#2E86C1', bottom: '#33415C' }} hat="none" hair="#2A1B12" pose="point" expr="shock" talking={s.speaker === 'A' ? [[6, s.talkEnd ?? 60]] : []} seed="srv" flip />
    </Layer>
  </CameraRig>
);

export const SHOTS: ShotMap = {
  opening: makeOpening('The Story', 'of Tea'),
  end: makeEnd('The Story of Tea'),
  // the narrator presenting (keys = pose changes at local frames; mouth flaps automatically)
  host: hostShot((s) => [{ at: 0, arm: 'idle', expr: 'smile' }, { at: 20, arm: 'present' }]),
  example: Example,
  sketch: Sketch,
};
