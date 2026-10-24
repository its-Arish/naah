import React from 'react';
import { Sequence } from '../lib/core';
import { Narration, DateTag, Bubble } from '../fx/Overlays';
import { Card as DefaultCard, Missing } from '../kit';
import type { Shot } from '../types';
// @project resolves to projects/<name>/ at build time (see scripts/studio.mjs)
import * as project from '@project/shots';
import timeline from '@project/build/timeline.json';

export const TOTAL_FRAMES: number = (timeline as any).total;
const shots = (timeline as any).shots as Shot[];
/** optional exports are looked up by name so projects only export what they need */
const opt = (k: string): any => (project as Record<string, unknown>)[k];
const SHOTS: Record<string, React.FC<{ s: Shot }>> = opt('SHOTS');
const Card: React.FC<{ s: Shot }> = opt('Card') ?? DefaultCard;

/** Speech-bubble placement for SKETCH dialogue: A = right-hand speaker, B = left-hand (seated) speaker. */
const BUBBLES: Record<string, { x: number; y: number; w: number; tailX: number; tailY: number }> = opt('BUBBLES') ?? {
  A: { x: 1000, y: 70, w: 820, tailX: 1330, tailY: 600 },
  B: { x: 110, y: 60, w: 780, tailX: 600, tailY: 440 },
};

export const Video: React.FC = () => (
  <div style={{ position: 'absolute', inset: 0, background: '#000', overflow: 'hidden' }}>
    {shots.map((s) => {
      const key = s.kind === 'CARD' ? 'card' : s.shot ?? s.id;
      const Comp = s.kind === 'CARD' ? Card : SHOTS[key];
      return (
        <Sequence key={s.id} from={s.from} duration={s.dur}>
          {Comp ? <Comp s={s} /> : <Missing s={s} name={key} />}
          {s.words && s.words.length > 0 && s.kind === 'SKETCH' && <Bubble words={s.words} {...BUBBLES[s.speaker ?? 'A']} />}
          {s.words && s.words.length > 0 && s.kind !== 'SKETCH' && <Narration words={s.words} variant={s.kind === 'HOST' ? 'host' : 'caption'} />}
          {s.words && <DateTag from={s.prevDate ?? null} to={s.date ?? null} />}
        </Sequence>
      );
    })}
  </div>
);
