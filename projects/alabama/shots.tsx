/**
 * The Entire History of Alabama: shot index. One file per era in src/.
 * No chapter cards: the era is shown on the timeline bar across the top (src/Timeline.tsx, exported as Overlay).
 * Captions that are not drawn yet use per-era placeholder ids (todo_*), filled here with a plain narrator shot.
 */
import React from 'react';
import { hostShot, makeEnd, type ShotMap } from '@engine/kit';
import { SHOTS_HOOK } from './src/Hook';
import { SHOTS_FIRST } from './src/First';
import { SHOTS_EMPIRES } from './src/Empires';
import { Opening } from './src/Opening';
export { Overlay } from './src/Timeline';

const Todo = hostShot(() => [{ at: 0, arm: 'present', expr: 'smile' }]);
const DRAWN: ShotMap = { opening: Opening, end: makeEnd('Alabama'), ...SHOTS_HOOK, ...SHOTS_FIRST, ...SHOTS_EMPIRES };
const todo: ShotMap = {
  todo_empires: Todo, todo_statehood: Todo, todo_cotton: Todo, todo_war: Todo, todo_iron_and_peanuts: Todo,
  todo_rocket_city: Todo, todo_five_blocks: Todo, todo_moon: Todo, todo_today: Todo,
};
export const SHOTS: ShotMap = { ...todo, ...DRAWN };
