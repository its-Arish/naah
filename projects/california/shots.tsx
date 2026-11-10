/**
 * The Entire History of California: shot index. One file per era in src/.
 * No chapter cards: the era is shown on the timeline bar across the top (src/Timeline.tsx, exported as Overlay).
 */
import React from 'react';
import { hostShot, makeEnd, type ShotMap } from '@engine/kit';
import { SHOTS_HOOK } from './src/Hook';
import { SHOTS_FIRST } from './src/First';
import { SHOTS_SPAIN } from './src/Spain';
import { SHOTS_MEXICO } from './src/Mexico';
import { SHOTS_GOLD } from './src/Gold';
import { SHOTS_RAIL } from './src/Railroad';
import { SHOTS_SUN } from './src/Sunshine';
import { SHOTS_DUST } from './src/DustWar';
import { SHOTS_SILICON } from './src/Silicon';
import { SHOTS_TODAY } from './src/Today';
export { Overlay } from './src/Timeline';

const Opening: React.FC = () => <div style={{ position: 'absolute', inset: 0, background: '#C4C4C4' }} />;
/** Placeholder for eras that are not drawn yet. */
const Todo = hostShot(() => [{ at: 0, arm: 'present', expr: 'smile' }]);

export const SHOTS: ShotMap = { opening: Opening, end: makeEnd('California'), todo: Todo, ...SHOTS_HOOK, ...SHOTS_FIRST, ...SHOTS_SPAIN, ...SHOTS_MEXICO, ...SHOTS_GOLD, ...SHOTS_RAIL, ...SHOTS_SUN, ...SHOTS_DUST, ...SHOTS_SILICON, ...SHOTS_TODAY };
