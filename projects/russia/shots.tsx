/**
 * Russia: The Country With Everything Except People — shot index. One file per chapter group in src/.
 */
import { makeOpening, makeEnd, type ShotMap } from '@engine/kit';
import { SHOTS_01 } from './src/Shots01';
import { SHOTS_02 } from './src/Shots02';
import { SHOTS_03 } from './src/Shots03';
import { SHOTS_04 } from './src/Shots04';
import { SHOTS_05 } from './src/Shots05';
import { SHOTS_06 } from './src/Shots06';
import { SHOTS_07 } from './src/Shots07';
import { SHOTS_08 } from './src/Shots08';
import { SHOTS_09 } from './src/Shots09';
import { SHOTS_10 } from './src/Shots10';
import { SHOTS_HOOKS, MAP_EXTRAS_HOOKS, OpeningDark } from './src/Hooks';

export const SHOTS: ShotMap = {
  opening: OpeningDark,
  end: makeEnd('Russia'),
  ...SHOTS_01,
  ...SHOTS_02,
  ...SHOTS_03,
  ...SHOTS_04,
  ...SHOTS_05,
  ...SHOTS_06,
  ...SHOTS_07,
  ...SHOTS_08,
  ...SHOTS_09,
  ...SHOTS_10,
  ...SHOTS_HOOKS,
};

export const MapExtras = MAP_EXTRAS_HOOKS;
