import React from 'react';
import { Sequence } from '../lib/core';
import { Narration, DateTag, Bubble } from '../fx/Overlays';
import { Card as DefaultCard, Missing } from '../kit';
import type { Shot } from '../types';
import { MapClip } from '../scenes/MapClip';
// @project resolves to projects/<name>/ at build time (see scripts/studio.mjs)
import * as project from '@project/shots';
import timeline from '@project/build/timeline.json';

export const TOTAL_FRAMES: number = (timeline as any).total;
const shots = (timeline as any).shots as Shot[];
/** optional exports are looked up by name so projects only export what they need */
const opt = (k: string): any => (project as Record<string, unknown>)[k];
const SHOTS: Record<string, React.FC<{ s: Shot }>> = opt('SHOTS');
const Card: React.FC<{ s: Shot }> = opt('Card') ?? DefaultCard;
/** A project can export Overlay to replace the standard captions / date tag (e.g. word-by-word captions for Shorts). */
const Overlay: React.FC<{ s: Shot }> | undefined = opt('Overlay');

/** Speech-bubble placement for SKETCH dialogue: A = right-hand speaker, B = left-hand (seated) speaker. */
const BUBBLES: Record<string, { x: number; y: number; w: number; tailX: number; tailY: number }> = opt('BUBBLES') ?? {
  A: { x: 1000, y: 70, w: 820, tailX: 1330, tailY: 600 },
  B: { x: 110, y: 60, w: 780, tailX: 600, tailY: 440 },
};

/** Map scenes: consecutive beats with shot "map:<name>" share one Mapimator clip (scripts/map/render_map.mjs). */
const MAPS: Record<string, { name: string; offset: number; frames: number }> = (() => {
  const out: Record<string, { name: string; offset: number; frames: number }> = {};
  let run: Shot[] = [];
  const flush = () => { if (!run.length) return; const from = run[0].from, end = run[run.length - 1].from + run[run.length - 1].dur; for (const s of run) out[s.id] = { name: run[0].shot!.slice(4), offset: s.from - from, frames: end - from }; run = []; };
  for (const s of shots) {
    const key = s.shot ?? '';
    if (key.startsWith('map:') && run.length && run[0].shot === key && run[run.length - 1].from + run[run.length - 1].dur === s.from) run.push(s);
    else { flush(); if (key.startsWith('map:')) run = [s]; }
  }
  flush();
  return out;
})();
/** A project can export MapExtras (shotKey → component) to draw its own things over a map scene. */
const MAP_EXTRAS: Record<string, React.FC<{ s: Shot }>> = opt('MapExtras') ?? {};

const MapShot: React.FC<{ s: Shot }> = ({ s }) => {
  const Extra = MAP_EXTRAS[s.shot ?? ''];
  return <MapClip {...MAPS[s.id]}>{Extra && <Extra s={s} />}</MapClip>;
};

export const Video: React.FC = () => (
  <div style={{ position: 'absolute', inset: 0, background: '#000', overflow: 'hidden' }}>
    {shots.map((s) => {
      const key = s.kind === 'CARD' ? 'card' : s.shot ?? s.id;
      const map = MAPS[s.id];
      const Comp = s.kind === 'CARD' ? Card : map ? MapShot : SHOTS[key];
      return (
        <Sequence key={s.id} from={s.from} duration={s.dur}>
          {Comp ? <Comp s={s} /> : <Missing s={s} name={key} />}
          {Overlay ? <Overlay s={s} /> : (<>
            {s.words && s.words.length > 0 && s.kind === 'SKETCH' && <Bubble words={s.words} {...BUBBLES[s.speaker ?? 'A']} />}
            {s.words && s.words.length > 0 && s.kind !== 'SKETCH' && <Narration words={s.words} variant={s.kind === 'HOST' ? 'host' : 'caption'} />}
            {s.words && <DateTag from={s.prevDate ?? null} to={s.date ?? null} />}
          </>)}
        </Sequence>
      );
    })}
  </div>
);
