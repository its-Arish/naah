/** Shared bits for the redrawn story scenes: costumes, the stunt rotation, and S() / H() beat builders. */
import React from 'react';
import { SC, story, Prop, Chip, CW, W, GY } from './Story';
import { STUNT, type StuntName } from './Stunts';
import type { Part } from './Cuts';
export * from './Story';
export { E, M } from './Dsl';
export const EL = CW.elder, PR = CW.prophet, PE = CW.peasant, RO = CW.roman, NOB = CW.noble, MONK = CW.monk, ARAB = CW.arab, SET = CW.settler, RAB = CW.rabbi, SUIT = CW.suit;
const tint = (base: any, top: string, extra: any = {}) => ({ ...base, outfit: { ...base.outfit, top }, ...extra });
export const GREEK = tint(W.ROMAN, '#F4F7FA', { hatColor: '#D9B24A' });
export const PERS = tint(W.ROMAN, '#8A2A3A', { hatColor: '#D9B24A' });
export const BABY = tint(W.ROMAN, '#3A5A9A', { hatColor: '#D9B24A' });
export const ASSY = tint(W.ROMAN, '#2F4A7A', { hatColor: '#7A8A9A' });
export const KNIGHT = CW.knight;
export const IDF = W.GI(0);
export const ARSOL = tint(W.GI(0), '#9A8A5A', { hatColor: '#9A8A5A' });
export const BRIT = W.COLONIAL_SOLDIER('#C0392B');
export const POILU = W.POILU;
export const KING = W.KING('#7A4A9A');
export const LEADER = CW.leader;
export const OFF = CW.official;
export const REF = CW.refugee;
export const SOLO = (c: string) => W.PEASANT(c, 1);
export const MOD = CW.modern;
export const MOD2 = W.MODERN('#8A3A3A', 1);
export const MOD3 = W.MODERN('#3A7A5A', 2);
export const PILOT = W.PILOT;

/** Stunt rotation: one every third playful beat, never the same twice in a row. */
const ROT: StuntName[] = ['fly', 'vault', 'twirl', 'cane', 'catch', 'heli', 'drop', 'peek', 'slack'];
export const stuntFor = (n: number, calm = false): StuntName | undefined => (calm || n % 3 !== 0 ? undefined : ROT[(n / 3) % ROT.length | 0]);
/** Story beat n: parts as given; a narrator stunt is added on the first part of every third beat unless `calm`. */
export const S = (n: number, calm: boolean, ...parts: Part[]) => story(...parts.map((p, i) => (i === 0 && !calm && !p.narNode && stuntFor(n) ? { ...p, narNode: STUNT[stuntFor(n)!] } : p)));
/** HOST beat: the narrator himself carries it (always a stunt unless calm), with an optional prop and a small chip. */
export const H = (n: number, calm: boolean, icon?: string, chip?: string, bg = 'white') => {
  const st = calm ? undefined : ROT[((n * 7) >> 1) % ROT.length];
  const acts: any[] = [];
  if (icon) acts.push(Prop(icon, 1100, 600, 1.3, 4));
  if (chip) acts.push(Chip(chip, 760, 330));
  return story({ ...SC(bg, acts), narNode: st ? STUNT[st] : undefined });
};
export { SC, story, Prop, Chip, CW, W, GY };
