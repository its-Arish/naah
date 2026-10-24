// Every shot id used in beats/*.json must map to a component here.
import { SHOTS as A, Card } from './src/ShotsIndia';
import { SHOTS_B1 } from './src/ShotsB1';
import { SHOTS_B2 } from './src/ShotsB2';
import { SHOTS_B3 } from './src/ShotsB3';
import { SHOTS_B4 } from './src/ShotsB4';

export const SHOTS = { ...A, ...SHOTS_B1, ...SHOTS_B2, ...SHOTS_B3, ...SHOTS_B4 };
export { Card };
