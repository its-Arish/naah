/**
 * Cast and colours for the Russia film. Costumes come from the shared wardrobe (engine/cast/Wardrobe.ts).
 * Colour language: Russia/state = red #B3261E, people = warm browns, Mongols = blue/gold, Byzantium = gold.
 */
import { W, SKIN, dress } from '@engine/cast/Wardrobe';
export { Stamp, Counter, Note, Card, Calendar, Bars, CoinArc } from '@engine/fx/Infographics';

export const RED = '#B3261E', PAPER = '#F4ECD8', GOLD = '#E2B13C', BLUE = '#2E4A9A';

/** Russian peasant (kosovorotka shirt, sash), i varies colour/hair/skin. */
export const PEASANT = (i = 0) => ({
  outfit: { top: ['#C0392B', '#E8DCC0', '#7A8A5A', '#A8643A'][i % 4], bottom: '#5A4A3A', belt: ['#E2B13C', '#B3261E', '#3A2A22', '#2E4A9A'][i % 4] },
  hat: ['hair', 'scarf', 'parted', 'hair'][i % 4], hatColor: ['#7A4A2A', '#C0392B', '#C9A66B', '#3A2416'][i % 4], hair: ['#7A4A2A', '#3A2416', '#C9A66B', '#3A2416'][i % 4],
  beard: i % 4 === 3, beardColor: '#5A3A22', skin: SKIN.light,
});
/** Viking / Varangian (no horned helmets: they never wore them). */
export const VIKING = (i = 0) => dress(W.FRANK, { outfit: { top: ['#6B5A3A', '#5A6A7A', '#7A4A3A'][i % 3], cape: ['#8A3A2A', '#2E4A6A', '#5A6A3A'][i % 3] }, hat: i % 2 ? 'helmet' : 'hairlong', hatColor: i % 2 ? '#8A8A8A' : '#C9932E', skin: SKIN.fair });
/** Slavic tribesman / elder. */
export const TRIBE = (i = 0) => ({ outfit: { top: ['#8A6A4A', '#6A7A4A', '#9A5A3A'][i % 3], bottom: '#4A3A2A', belt: '#2A1B12' }, hat: 'hair', hair: ['#C9A66B', '#5A3A22', '#E8E4DA'][i % 3], hatColor: ['#C9A66B', '#5A3A22', '#E8E4DA'][i % 3], beard: true, beardColor: ['#C9A66B', '#5A3A22', '#E8E4DA'][i % 3], skin: SKIN.light });
/** Grand prince of Kyiv / Rus prince (fur-trimmed cap). */
export const PRINCE = (c = '#B3261E') => ({ outfit: { top: c, bottom: '#3A2A22', trim: GOLD, cape: '#7A1E2E' }, hat: 'mongol', hatColor: '#7A1E2E', beard: true, beardColor: '#5A3A22', skin: SKIN.light });
/** Orthodox priest (black robe, beard). */
export const PRIEST = { outfit: { top: '#1E1E28', robe: true, trim: GOLD }, hat: 'skullcap', hatColor: '#1E1E28', beard: true, beardColor: '#7A7A7A', skin: SKIN.light, item: 'book' };
/** Mongol rider / warrior. */
export const MONGOL = (i = 0) => ({ outfit: { top: ['#2E4A6A', '#7A5A3A', '#5A3A6A'][i % 3], bottom: '#3A2A22', belt: GOLD }, hat: 'mongol', hatColor: ['#8A3A2A', '#5A4A3A', '#3A3A48'][i % 3], item: i % 2 ? 'spear' : 'sword', skin: SKIN.east, mustache: true });
export const KHAN = { outfit: { top: '#2E4A9A', bottom: '#2A2A3A', trim: GOLD, cape: '#B3261E' }, hat: 'mongol', hatColor: '#E2B13C', skin: SKIN.east, mustache: true, beard: true, beardColor: '#2A1B12' };
/** 13th-century European friar-traveller. */
export const FRIAR = { outfit: { top: '#6B4A2B', robe: true, belt: '#E8DCC0' }, hat: 'bald', skin: SKIN.light };
/** Medieval soldier (generic, for armies crossing the plain). */
export const MEDIEVAL = (i = 0) => dress(W.KNIGHT(['#9AA0A6', '#C9C2B4', '#8A8A90'][i % 3], ['#C0392B', '#2E4A9A', '#E2B13C'][i % 3]), { item: i % 2 ? 'spear' : 'sword' });
export const MERCHANT = (i = 0) => ({ outfit: { top: ['#2E6A5A', '#8A5A2A'][i % 2], bottom: '#4A3A2A', belt: GOLD }, hat: 'cap', hatColor: '#5A3A22', item: 'sack', skin: SKIN.light, beard: true, beardColor: '#5A3A22' });
export const SOLDIER_WW2 = { outfit: { top: '#6A6A48', bottom: '#5A5A3A', belt: '#3A2A1A' }, hat: 'helmet', hatColor: '#4E5A3A', skin: SKIN.light };
export const SCHOLAR = (i = 0) => dress(W.GOWN, { hat: 'hair', hatColor: ['#7A7A7A', '#3A2416'][i % 2], hair: ['#7A7A7A', '#3A2416'][i % 2], glasses: i % 2 === 0, item: 'book', skin: SKIN.light });
