/**
 * The French Revolution vs Today — shot index. One file per act group in src/.
 */
import { makeOpening, makeEnd, type ShotMap } from '@engine/kit';
import { SHOTS_01 } from './src/Shots01';
import { SHOTS_02 } from './src/Shots02';
import { SHOTS_03 } from './src/Shots03';
import { SHOTS_04 } from './src/Shots04';
import { SHOTS_05 } from './src/Shots05';
import { SHOTS_06 } from './src/Shots06';
import { SHOTS_07 } from './src/Shots07';
import { SHOTS_09 } from './src/Shots09';
import { SHOTS_10 } from './src/Shots10';
import { SHOTS_11 } from './src/Shots11';
import { SHOTS_12 } from './src/Shots12';

export const SHOTS: ShotMap = {
  opening: makeOpening('The French Revolution', 'vs Today'),
  end: makeEnd('1789 vs 2026', 'History Monkey'),
  ...SHOTS_01,
  ...SHOTS_02,
  ...SHOTS_03,
  ...SHOTS_04,
  ...SHOTS_05,
  ...SHOTS_06,
  ...SHOTS_07,
  ...SHOTS_09,
  ...SHOTS_10,
  ...SHOTS_11,
  ...SHOTS_12,
};
