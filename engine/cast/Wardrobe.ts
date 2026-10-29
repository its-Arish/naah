/**
 * The wardrobe: ready-made costumes for <Chibi>, collected from every film so far.
 *
 *   import { W, dress, SKIN } from '@engine/cast/Wardrobe';
 *   <Chibi x={600} y={960} {...W.GI()} pose="hold" />
 *   <Chibi x={900} y={960} {...dress(W.GI(), { hat: 'cap', outfit: { top: '#8A3A2A' } })} />   // change the costume
 *
 * A costume is plain data ({ outfit, hat, hatColor, hair, skin, item, beard, ... }), so spread it into
 * Chibi and then override pose / expr / talking / item per shot. Functions take a colour or an index
 * (`i`) so crowds vary without random(). See docs/gallery/wardrobe-*.png for how each one looks.
 *
 * Real politicians: dress them with a generic costume and show them as a labelled Silhouette
 * (engine/cast/Silhouette.tsx), not as a caricature.
 */

export type Costume = Record<string, any>;

/** Override parts of a costume. `outfit` is merged, everything else replaced. */
export const dress = (base: Costume, over: Costume = {}): Costume => ({ ...base, ...over, outfit: { ...(base.outfit || {}), ...(over.outfit || {}) } });

export const SKIN = {
  light: '#F3D2B0', fair: '#F6DCC4', east: '#E8C49A', south: '#C68B59', brown: '#A86B3C', dark: '#8D5524', deep: '#5C3A1E',
};
export const GOLD = '#E2B13C';
/** Rotate skins through a crowd: SKINS[i % SKINS.length]. */
export const SKINS = [SKIN.light, SKIN.south, SKIN.east, SKIN.dark, SKIN.fair, SKIN.brown];
const HAIRS = ['#3A2416', '#1A1410', '#C9A66B', '#7A3A1A', '#5A5A5A'];

export const W = {
  // ---------------------------------------------------------------- everyday people (any era, recolour freely)
  /** Farmer / labourer. */
  PEASANT: (c = '#C0392B', i = 0) => ({ outfit: { top: c, bottom: '#6B5A45', belt: '#3A2A22' }, hat: 'none', hair: HAIRS[i % 2], skin: SKINS[i % SKINS.length] }),
  /** Modern civilian; `i` varies hair, hat and trousers. */
  MODERN: (c = '#3A5A8A', i = 0) => ({ outfit: { top: c, bottom: ['#2A3A5A', '#3A3A48', '#5A4A3A'][i % 3] }, hat: ['hair', 'none', 'cap', 'bun'][i % 4], hatColor: '#3A3A48', hair: HAIRS[i % 4], skin: SKINS[i % SKINS.length] }),
  TEEN: (c = '#4A8A5A', i = 0) => ({ outfit: { top: c, bottom: '#33415C' }, hat: ['none', 'hair', 'bun'][i % 3], hair: HAIRS[i % 4], skin: SKINS[(i + 1) % SKINS.length] }),
  /** Protester; pass placard text to give them a sign. */
  PROTESTER: (c = '#C0392B', i = 0, text = '') => ({ outfit: { top: c, bottom: '#2A3A5A' }, hat: ['hair', 'bun', 'hair'][i % 3], hair: ['#C9A66B', '#3A2416', '#7A3A1A'][i % 3], hatColor: ['#C9A66B', '#3A2416', '#7A3A1A'][i % 3], skin: [SKIN.light, SKIN.dark, SKIN.light][i % 3], item: text ? `placard:${text}` : undefined }),
  HIVIS: { outfit: { top: '#E8E83A', bottom: '#3A3A5A', sash: '#C9C9C9' }, hat: 'none', hair: '#3A2416' },
  /** Suit and tie: officials, ministers, journalists, bankers. `extra` adds glasses, mustache, bald… */
  SUIT: (c = '#2A2E3A', hair = '#7A7A7A', extra: Costume = {}) => ({ outfit: { top: c, bottom: c, belt: '#F4F7FA' }, hat: 'hair', hair, hatColor: hair, skin: SKIN.light, ...extra }),
  /** Three alternating grey suits for a room of officials. */
  OFFICIAL: (i = 0) => ({ outfit: { top: ['#2A2E3A', '#3A3A48', '#4A4A54'][i % 3], bottom: ['#2A2E3A', '#3A3A48', '#4A4A54'][i % 3], belt: '#F4F7FA' }, hat: 'hair', hair: ['#5A5A5A', '#3A2416', '#9A9A9A'][i % 3], hatColor: ['#5A5A5A', '#3A2416', '#9A9A9A'][i % 3], skin: SKIN.light }),
  /** Generic head of government (use inside a Silhouette for real people). */
  LEADER: { outfit: { top: '#1E1E28', bottom: '#1E1E28', belt: '#F4F7FA' }, hat: 'hair', hair: '#3A2416' },
  /** TV news anchor. */
  ANCHOR: { outfit: { top: '#3A3A48', bottom: '#3A3A48', belt: '#F4F7FA' }, hat: 'hair', hair: '#5A5A5A', hatColor: '#5A5A5A', mustache: true, skin: SKIN.light },
  DEPUTY: (c = '#1E1E28') => ({ outfit: { top: c, bottom: '#1E1E28', sash: '#C0392B' }, hat: 'hair', hair: '#3A2416' }),
  /** Judge / scholar / doctor in a dark gown and white wig. */
  GOWN: { outfit: { top: '#1E1E28', bottom: '#1E1E28', trim: '#F4F7FA' }, hat: 'hairlong', hatColor: '#ECECEC' },
  MONK: (c = '#D9862A') => ({ outfit: { top: c, robe: true, sash: '#B8601A' }, hat: 'bald', skin: SKIN.east }),
  CLERGY: { outfit: { top: '#1E1E28', robe: true, trim: '#F4F7FA' }, hat: 'skullcap', hatColor: '#C0392B' },
  POPE: { outfit: { top: '#F4F7FA', robe: true, trim: GOLD }, hat: 'skullcap', hatColor: '#F4F7FA' },
  SERVANT: { outfit: { top: '#5A4A3A', bottom: '#3A2A22', belt: '#2A1B12' }, hat: 'tophat', hatColor: '#3A2A22' },

  // ---------------------------------------------------------------- royalty & nobility (any kingdom: recolour)
  KING: (c = '#2E4A9A', wig = '#ECECEC') => ({ outfit: { top: c, bottom: '#F4F7FA', trim: GOLD, sash: '#7FB2E5' }, hat: 'hairlong', hatColor: wig }),
  SUN_KING: { outfit: { top: '#7A1E2E', bottom: '#F4F7FA', trim: GOLD, cape: '#2E4A9A' }, hat: 'hairlong', hatColor: '#3A2416' },
  QUEEN: (c = '#F2A7C3') => ({ outfit: { top: c, robe: true, trim: '#F4F7FA', belt: '#B85A86' }, hat: 'queen', hatColor: '#F4F7FA' }),
  NOBLE: (c = '#6A4A8A') => ({ outfit: { top: c, bottom: '#F4F7FA', trim: GOLD }, hat: 'hairlong', hatColor: '#E8E2D0' }),

  // ---------------------------------------------------------------- soldiers through the ages
  ROMAN: { outfit: { top: '#A8322A', bottom: '#C9A66B', belt: '#6B4A2B' }, hat: 'helmet', hatColor: '#B8A060', item: 'spear' },
  FRANK: { outfit: { top: '#6B5A3A', bottom: '#4A3A2A', cape: '#8A3A2A' }, hat: 'hairlong', hatColor: '#C9932E', beard: true, beardColor: '#A87A2A' },
  KNIGHT: (c = '#F4F7FA', cross = '#C0392B') => ({ outfit: { top: c, bottom: '#5A5A5A', sash: cross }, hat: 'helmet', hatColor: '#9AA0A6', item: 'sword' }),
  /** 18th-century line infantry / revolutionary guard. */
  TRICORN_GUARD: (sash = '#F4F7FA') => ({ outfit: { top: '#2E4A9A', bottom: '#F4F7FA', sash }, hat: 'tricorn', hatColor: '#1E1E28', item: 'musket' }),
  /** Revolutionary sans-culotte with a red cap. */
  SANS_CULOTTE: (c = '#C0392B') => ({ outfit: { top: c, bottom: '#3A3A5A', belt: '#2A1B12' }, hat: 'cap', hatColor: '#C0392B' }),
  /** Napoleonic general in a bicorne (generic, no portrait). */
  GENERAL_1800: { outfit: { top: '#2E4A9A', bottom: '#F4F7FA', trim: GOLD, belt: '#F4F7FA' }, hat: 'bicorne', hatColor: '#1E1E28', hair: '#3A2416' },
  GRENADIER: { outfit: { top: '#2E4A9A', bottom: '#F4F7FA', sash: '#F4F7FA' }, hat: 'shako', hatColor: '#1E1E28', item: 'musket' },
  PRUSSIAN: { outfit: { top: '#3A4A5A', bottom: '#2A2A34' }, hat: 'helmet', hatColor: '#2A2A34', item: 'musket' },
  /** WWI French soldier (horizon blue). */
  POILU: { outfit: { top: '#6A84A8', bottom: '#6A84A8' }, hat: 'helmet', hatColor: '#6A84A8', item: 'musket' },
  /** Colonial-era European soldier in khaki with a kepi. */
  COLONIAL_SOLDIER: (kepi = '#2E4A9A') => ({ outfit: { top: '#B8A878', bottom: '#A89868', belt: '#5A3A22' }, hat: 'kepi', hatColor: kepi, item: 'musket', skin: SKIN.light }),
  COLONIAL_OFFICER: (kepi = '#C0392B') => ({ outfit: { top: '#B8A878', bottom: '#A89868', trim: GOLD }, hat: 'kepi', hatColor: kepi, mustache: true, skin: SKIN.light }),
  /** Colonial administrator in white with a pith helmet. */
  COLONIAL_OFFICIAL: { outfit: { top: '#F4F2EC', bottom: '#F4F2EC', belt: '#C9C4B8' }, hat: 'pith', hatColor: '#F4F2EC', mustache: true, skin: SKIN.light },
  /** Mid-century general in a kepi (generic). */
  GENERAL_1940: { outfit: { top: '#5A6A4A', bottom: '#4A5A3A', trim: GOLD }, hat: 'kepi', hatColor: '#5A6A4A' },
  /** US soldier, 1940s–70s olive drab; `i` rotates skin. */
  GI: (i = 0) => ({ outfit: { top: '#6A7448', bottom: '#5E6B45', belt: '#3A3A2A' }, hat: 'helmet', hatColor: '#5E6B45', item: 'musket', skin: [SKIN.light, SKIN.light, SKIN.dark][i % 3] }),
  PILOT: { outfit: { top: '#6A7448', bottom: '#6A7448' }, hat: 'helmet', hatColor: '#4E5A3A', skin: SKIN.light },
  /** Riot police with shield. */
  RIOT_POLICE: { outfit: { top: '#2A2E3A', bottom: '#2A2E3A' }, hat: 'helmet', hatColor: '#1E1E28', item: 'shield' },

  // ---------------------------------------------------------------- Southeast Asia
  /** Rice farmer in a conical hat. */
  FARMER_SEA: (c = '#6A5A45') => ({ outfit: { top: c, bottom: '#4A3A2A' }, hat: 'nonla', skin: SKIN.east }),
  VILLAGER_SEA: (c = '#8A6A4A', i = 0) => ({ outfit: { top: c, bottom: ['#3A3A48', '#4A3A2A', '#2A2A2A'][i % 3] }, hat: ['nonla', 'bun', 'hair'][i % 3], hair: '#1A1410', skin: SKIN.east }),
  /** North Vietnamese regular (pith helmet). */
  NVA: { outfit: { top: '#5E6B45', bottom: '#5E6B45', belt: '#3A2A1A' }, hat: 'pith', hatColor: '#6E7A4A', item: 'musket', skin: SKIN.east },
  /** Viet Cong guerrilla (black pyjamas, conical hat). */
  VC: { outfit: { top: '#1E1E24', bottom: '#1E1E24', belt: '#5A3A22' }, hat: 'nonla', item: 'musket', skin: SKIN.east },
  /** South Vietnamese (ARVN) soldier. */
  ARVN: { outfit: { top: '#6E7A4A', bottom: '#6E7A4A' }, hat: 'helmet', hatColor: '#5E6B45', item: 'musket', skin: SKIN.east },
  /** Older revolutionary leader: khaki tunic, white hair and beard. */
  ELDER_LEADER_SEA: { outfit: { top: '#C9B98A', bottom: '#C9B98A' }, hat: 'parted', hatColor: '#E8E4DA', beard: true, beardColor: '#E8E4DA', skin: SKIN.east },
  YOUNG_ACTIVIST_SEA: { outfit: { top: '#3A3A48', bottom: '#3A3A48', belt: '#F4F7FA' }, hat: 'parted', hatColor: '#1A1410', skin: SKIN.east },
  /** Asian statesman in a white suit / grey suit / uniform. */
  STATESMAN_SEA: (c = '#F4F2EC', hair = '#1A1410') => ({ outfit: { top: c, bottom: c }, hat: 'parted', hatColor: hair, skin: SKIN.east }),
  GENERAL_SEA: { outfit: { top: '#5E6B45', bottom: '#5E6B45', trim: GOLD }, hat: 'parted', hatColor: '#1A1410', skin: SKIN.east },
};

/** Hats Chibi can wear (pass as `hat`). Recolour with `hatColor`. */
export const HATS = ['none', 'hair', 'parted', 'bun', 'hairlong', 'bald', 'cap', 'helmet', 'pith', 'kepi', 'shako', 'tricorn', 'bicorne', 'tophat', 'nonla', 'crown', 'queen', 'skullcap', 'sultan', 'pagri', 'turbanW', 'ghurid', 'mongol', 'nadiri', 'gandhicap', 'topi', 'veil', 'scarf', 'kirat', 'malla', 'rana', 'europe', 'indira'] as const;
/** Things a Chibi can hold (`item` / `itemL`). */
export const ITEMS = ['sword', 'spear', 'shield', 'musket', 'khukuri', 'flag', 'banner', 'scroll', 'book', 'notebook', 'lamp', 'brick', 'hammer', 'mallet', 'coin', 'sack', 'bundle', 'placard:TEXT'] as const;
