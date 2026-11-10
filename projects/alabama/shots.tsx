/**
 * The Entire History of Alabama: shot index. One file per era in src/.
 * No chapter cards: the era is shown on the timeline bar across the top (src/Timeline.tsx, exported as Overlay).
 */
import React from 'react';
import { makeEnd, type ShotMap } from '@engine/kit';
import { SHOTS_HOOK } from './src/Hook';
import { SHOTS_FIRST } from './src/First';
import { SHOTS_EMPIRES } from './src/Empires';
import { SHOTS_ERA2 } from './src/Era2';
import { SHOTS_ERA3 } from './src/Era3';
import { SHOTS_ERA4 } from './src/Era4';
import { Opening } from './src/Opening';
export { Overlay } from './src/Timeline';

const DRAWN: ShotMap = { opening: Opening, end: makeEnd('Alabama'), ...SHOTS_HOOK, ...SHOTS_FIRST, ...SHOTS_EMPIRES, ...SHOTS_ERA2, ...SHOTS_ERA3, ...SHOTS_ERA4 };
export const SHOTS: ShotMap = DRAWN;
