/** Why Texas Can't Stay One Party: shot map. Acts are drawn in src/ShotsNN.tsx. */
import { makeOpening, makeEnd, type ShotMap } from '@engine/kit';
import { SHOTS_00 } from './src/Shots00';
import { SHOTS_01 } from './src/Shots01';
import { SHOTS_02 } from './src/Shots02';
import { SHOTS_04 } from './src/Shots04';
import { SHOTS_06 } from './src/Shots06';
import { SHOTS_08 } from './src/Shots08';
import { TreasureCard } from './src/TreasureCard';

/** Section cards are a treasure map of Texas: the narrator rides the trail to each act's landmark. */
export const Card = TreasureCard;

export const SHOTS: ShotMap = {
  opening: makeOpening("Why Texas Can't", 'Stay One Party'),
  end: makeEnd("Why Texas Can't Stay One Party"),
  ...SHOTS_00,
  ...SHOTS_01,
  ...SHOTS_02,
  ...SHOTS_04,
  ...SHOTS_06,
  ...SHOTS_08,
};
