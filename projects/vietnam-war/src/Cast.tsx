/**
 * Cast for the Vietnam film. The costumes live in the shared wardrobe (engine/cast/Wardrobe.ts) and the
 * overlays in engine/fx/Infographics.tsx; this file only gives them the film's names.
 * Colour language: America = navy #2E3A6A, the North / Viet Minh = red #C8102E, the South = yellow #E8C23A,
 * France = blue #2E4A9A, money = green #2E8B57, truth/lies = paper #F4ECD8 vs grey.
 */
import { W, SKIN } from '@engine/cast/Wardrobe';
export { Stamp, Counter, Note, Card, Calendar, Bars, CoinArc } from '@engine/fx/Infographics';

export const USA = '#2E3A6A', NORTH = '#C8102E', SOUTH = '#E8C23A', FRANCE = '#2E4A9A', MONEY = '#2E8B57', GOLD = '#E2B13C';

export const HO_OLD = W.ELDER_LEADER_SEA;
export const HO_YOUNG = W.YOUNG_ACTIVIST_SEA;
export const GIAP = { ...W.NVA, item: undefined };
export const NVA = W.NVA;
export const VC = W.VC;
export const FARMER = W.FARMER_SEA;
export const VILLAGER = W.VILLAGER_SEA;
export const SVN = W.ARVN;
export const GI = W.GI;
export const FR_SOLDIER = W.COLONIAL_SOLDIER();
export const FR_OFFICIAL = W.COLONIAL_OFFICIAL;
export const FR_OFFICER = W.COLONIAL_OFFICER();
export const SUIT = W.SUIT;
export const EISENHOWER = SUIT('#5A5A64', '#E8E4DA', { hat: 'bald' });
export const JFK = SUIT('#2A2E3A', '#8A5A2A');
export const LBJ = SUIT('#3A3A48', '#9A9A9A');
export const NIXON = SUIT('#1E2E4A', '#2A2A2A');
export const DIEM = W.STATESMAN_SEA();
export const THIEU = W.GENERAL_SEA;
export const ANCHOR = W.ANCHOR;
export const KISSINGER = SUIT('#2A2E3A', '#5A5A5A', { glasses: true });
export const LE_DUC_THO = W.STATESMAN_SEA('#8A8A84', '#E8E4DA');
export const MONK = W.MONK();
export const PILOT = W.PILOT;
export const OFFICIAL_US = W.OFFICIAL;
export const PROTESTER = W.PROTESTER;
export const SKIN_VN = SKIN.east;
