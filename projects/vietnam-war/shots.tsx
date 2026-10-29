/**
 * The Vietnam War — shot index. One file per chapter group in src/.
 */
import { makeOpening, makeEnd, type ShotMap } from '@engine/kit';
import { SHOTS_01 } from './src/Shots01';
import { SHOTS_02 } from './src/Shots02';
import { SHOTS_03 } from './src/Shots03';
import { SHOTS_04 } from './src/Shots04';
import { SHOTS_05 } from './src/Shots05';

export const SHOTS: ShotMap = {
  opening: makeOpening('The Vietnam War', 'Won the Battles, Lost the War'),
  end: makeEnd('The Vietnam War', 'History Monkey'),
  ...SHOTS_01,
  ...SHOTS_02,
  ...SHOTS_03,
  ...SHOTS_04,
  ...SHOTS_05,
};
