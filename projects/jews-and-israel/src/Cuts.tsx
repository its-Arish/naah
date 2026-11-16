/**
 * cuts(): one beat made of several shots, so the picture changes every 1.8 s in the hook and every 2.5 s after it.
 * Each part starts at a frame or on a spoken word, runs until the next part starts, and gets its own camera move
 * (zoom in, zoom out or pan, alternating) and, unless switched off, the narrator.
 *   part.draw  : drawn in the grey stage (inside the camera rig), as a React component body
 *   part.full  : a full-screen background (GIS map) with `draw` drawn on top, no camera rig
 */
import React from 'react';
import { Sequence, useCurrentFrame, springPop } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { GreyStage } from '@engine/scenes/Backgrounds';
import { Host } from '@engine/characters/Host';
import { wordAt, talk, type SP } from '@engine/kit';
import type { Shot } from '@engine/types';

export type PartArgs = { s: Shot; t: number; w: (word: string) => number; pk: (at: number) => number };
export type NarOpt = false | { x?: number; y?: number; scale?: number; arm?: string; expr?: string };
export type Part = {
  at: number | string;
  draw?: (a: PartArgs) => React.ReactNode;
  full?: (a: PartArgs) => React.ReactNode;
  z?: [number, number]; focus?: [number, number]; pan?: [[number, number], [number, number]];
  bg?: 'grey' | 'dark';
  nar?: NarOpt;
};

const Body: React.FC<{ p: Part; s: Shot; st: number; i: number }> = ({ p, s, st, i }) => {
  const t = useCurrentFrame();
  const a: PartArgs = { s, t, w: (word) => wordAt(s, word) - st, pk: (at) => Math.max(0, springPop(t, at)) };
  const host = s.kind === 'HOST';
  const n = p.nar === false ? null : (
    <Host x={p.nar?.x ?? (host ? 1500 : 1690)} y={p.nar?.y ?? (host ? 960 : 1010)} scale={p.nar?.scale ?? (host ? 1 : 0.5)}
      keys={[{ at: 0, arm: p.nar?.arm ?? (host ? 'present' : 'idle'), expr: p.nar?.expr ?? 'smile' }]} talking={talk(s)} />
  );
  if (p.full) {
    return (
      <>
        {p.full(a)}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>{p.draw?.(a)}{n}</svg>
      </>
    );
  }
  const zin = i % 2 === 0;
  const [z0, z1] = p.z ?? (zin ? [1, 1.1] : [1.1, 1]);
  return (
    <CameraRig move={{ zoomFrom: z0, zoomTo: z1, focus: p.focus ?? [960, 520], panFrom: p.pan?.[0], panTo: p.pan?.[1] }} seed={s.id + i}>
      {p.bg === 'dark' ? <rect x={-300} y={-300} width={2600} height={1700} fill="#1B1F26" /> : <GreyStage />}
      <Layer depth={1}>{p.draw?.(a)}{n}</Layer>
    </CameraRig>
  );
};

export const cuts = (parts: Part[]): React.FC<SP> => ({ s }) => {
  const starts = parts.map((p) => (typeof p.at === 'string' ? wordAt(s, p.at) : p.at));
  // keep the order monotonic even if a word is missing or out of order
  const st = starts.map((x, i) => (i === 0 ? 0 : Math.max(x, 8)));
  for (let i = 1; i < st.length; i++) if (st[i] <= st[i - 1] + 6) st[i] = st[i - 1] + 6;
  return (
    <>
      {parts.map((p, i) => {
        const from = st[i], to = i + 1 < parts.length ? st[i + 1] : s.dur;
        return <Sequence key={i} from={from} duration={Math.max(1, to - from)}><Body p={p} s={s} st={from} i={i} /></Sequence>;
      })}
    </>
  );
};
