/** Redrawn story scenes, test batch: exile (64-84) and Rome (101-121). People, places, motion and narrator stunts; almost no text. */
import React from 'react';
import { SC, story, P1, Walk, Crowd, March, Burn, Prop, Ride, Chip, Name, Doc, CW, W, GY } from './Story';
import { E, M } from './Dsl';
import { RED } from './Kit';
import { Chibi } from '@engine/characters/Chibi';
import { interpolate } from '@engine/lib/core';
import { ICONS } from './Dsl';

const ASSY = { ...W.ROMAN, outfit: { ...W.ROMAN.outfit, top: '#2F4A7A' }, hatColor: '#7A8A9A' };
const BABY = { ...W.ROMAN, outfit: { ...W.ROMAN.outfit, top: '#3A5A9A', bottom: '#C9A66B' }, hatColor: '#D9B24A' };
const EL = CW.elder, PR = CW.prophet, PE = CW.peasant, RO = CW.roman;
const NB = { ...W.KING('#3A5A9A', '#2A1B12'), skin: '#C68B59' };
const HEROD = W.KING('#8A2A3A', '#2A1B12');
const jewSad = [EL, PE, PR];

export const SC1: Record<string, React.FC<any>> = {
  g64: story(SC('battle', [Walk(EL, 200, 420, { n: 2, len: 90, expr: 'shock' }), March(ASSY, 1900, 760, { n: 4, len: 90 }), Chip('722 BCE', 960, 200)], { stunt: 'drop' })),
  g65: story(SC('hills', [Walk(jewSad, 700, 1500, { n: 4, gap: 150, expr: 'sad', item: 'bundle', len: 80 }), Chip('SCATTERED', 960, 200)])),
  g66: story(SC('hills', [Crowd(jewSad, 960, { n: 6, gap: 190, expr: 'sad', s: 1.5 }), Chip('10 LOST TRIBES', 960, 200)])),
  g67: story(SC('jerusalem', [Crowd(EL, 700, { n: 3, pose: 'cheer', expr: 'happy' }), Crowd(PE, 1200, { n: 2, pose: 'cheer', expr: 'happy' }), Chip('JUDAH SURVIVES', 960, 200)], { stunt: 'cane' }), E('03-taylor-prism.jpg', 0.54, 'barely', "Sennacherib's own record of besieging Jerusalem, 701 BCE", { h: 560 })),
  g68: story(E('04-babylonian-chronicle-597.jpg', 0.89, 'Nebuchadnezzar', 'Babylonian record of the first capture of Jerusalem, 597 BCE', { h: 500 }), SC('jerusalem', [March(BABY, 1900, 900, { n: 4, len: 70 }), P1(NB, 1300, { pose: 'point', expr: 'angry', flip: true, s: 1.9 }), Burn(520, GY - 60, 1.5), Chip('586 BCE', 960, 200), Name('NEBUCHADNEZZAR', 1300, 270)])),
  g69: story(SC('temple', [Burn(960, GY - 60, 2.2), Burn(620, GY - 60, 1.4, 8), Burn(1300, GY - 60, 1.4, 14), Chip("SOLOMON'S TEMPLE", 960, 200)], { z: [1, 1.12] })),
  g70: story(SC('desert', [Walk(EL, 200, 1500, { n: 4, gap: 150, expr: 'sad', len: 90 }), Walk(BABY, 360, 1660, { n: 1, gap: 0, len: 90 }), Chip('IN CHAINS, 1,000 MILES EAST', 960, 200)]), M('1,000 MILES EAST, IN CHAINS', { c: [40, 33.5], z: 3.6, z2: 3.9, hot: ['ISR', 'IRQ'], hc: '#F3B562', route: [[35.2, 31.8], [38, 34.5], [44.4, 32.5]], rc: RED })),
  g71: story(SC('desert', [P1(EL, 800, { pose: 'idle', expr: 'sad', flip: true, s: 1.9 }), Chip('THE FIRST EXILE', 960, 200)], { stunt: 'cane', z: [1, 1.15] })),
  g72: story(SC('white', [Chip('AND IT CHANGES EVERYTHING', 1100, 200)], { stunt: 'twirl' })),
  g73: story(SC('white', [Prop('question', 1100, 560, 1.4)], { stunt: 'cane' })),
  g74: story(SC('temple', [Crowd(EL, 960, { n: 5, pose: 'pray', gap: 150 }), Chip('ONE GOD, ONE TEMPLE, ONE CITY', 960, 200)])),
  g75: story(SC('temple', [Burn(960, GY - 60, 1.8), Chip('TEMPLE: RUBBLE', 960, 200)]), SC('babylon', [Crowd(jewSad, 700, { n: 4, expr: 'sad', legs: 'sit' } as any), Chip('1,000 MILES AWAY', 960, 200)])),
  g76: story(SC('white', [Prop('question', 1100, 560, 1.4)], { stunt: 'slack' })),
  g77: story(SC('babylon', [P1(EL, 800, { pose: 'raise', expr: 'happy', s: 1.9 }), Prop('menorah', 1100, 640, 1.2, 10), Chip('A NEW ANSWER', 960, 200)])),
  g78: story(SC('babylon', [Walk(jewSad, 200, 760, { n: 3, len: 50 }), Walk(jewSad, 1800, 1160, { n: 3, len: 50 }), Chip('THEY GATHER', 960, 200)])),
  g79: story(SC('babylon', [Crowd(EL, 760, { n: 3, pose: 'scribble', gap: 220, s: 1.9 }), Doc(1260, 560, 0.9, 10), Doc(1480, 620, 0.7, 30), Chip('THEY WRITE DOWN THEIR STORIES', 960, 200)])),
  g80: story(SC('oasis', [Crowd(jewSad, 960, { n: 5, pose: 'pray', gap: 160 }), Chip('PRAYING, WITHOUT A TEMPLE', 960, 200)])),
  g81: story(SC('babylon', [Prop('book', 960, 560, 1.7, 4), Crowd(EL, 960, { n: 5, gap: 330, pose: 'present', s: 1.7, expr: 'happy' }), Chip('A BOOK AND A CALENDAR', 960, 200)])),
  g82: story(SC('babylon', [Walk(jewSad, 1500, 500, { n: 3, item: 'book', expr: 'happy', len: 80 }), Chip('INSTEAD OF A BUILDING', 960, 200)])),
  g83: story(SC('white', [Chip('REMEMBER THAT', 1100, 200)], { stunt: 'catch' })),
  g84: story(SC('white', [Prop('book', 1100, 560, 1.4)], { stunt: 'vault' })),
  g101: story(SC('rome', [March(RO, 100, 1500, { n: 5, len: 80, item: 'spear' }), Chip('ROME ARRIVES', 960, 200)], { stunt: 'vault' })),
  g102: story(SC('jerusalem', [Ride(RO, 200, 1250, { len: 80 }), March(RO, 100, 900, { n: 3, len: 80 }), Chip('63 BCE: POMPEY', 960, 200)])),
  g103: story(SC('jerusalem', [P1(HEROD, 700, { pose: 'present', expr: 'grin', s: 1.9 }), P1(RO, 1150, { pose: 'present', expr: 'normal', flip: true, s: 1.9 }), Name('HEROD', 700, 270), Chip('ROME BACKS A KING', 960, 200)], { stunt: 'twirl' })),
  g104: story(E('06-temple-scroll-11Q20.jpg', 1.39, 'temple', 'Dead Sea Scroll from the Second Temple period (the Temple Scroll)', { h: 440 }), SC('temple', [Walk(PE, 200, 1500, { n: 4, item: 'brick', len: 80 }), Prop('wall', 1450, 700, 0.9)])),
  g105: story(SC('jerusalem', [Prop('wall', 960, 560, 3.2, 2), Chip('STILL STANDING TODAY', 960, 200)], { stunt: 'heli' })),
  g106: story(SC('white', [Prop('wall', 1100, 600, 1.4, 2), Chip('THE WESTERN WALL', 1100, 200)], { stunt: 'peek' })),
  g107: story(SC('jerusalem', [P1(CW.noble, 520, { pose: 'present', expr: 'grin', item: 'sack', s: 1.9 }), Crowd(PE, 1200, { n: 3, pose: 'fist', expr: 'angry' }), Chip('TAXES, REBELS, RIVAL SECTS', 960, 200)])),
  g108: story(SC('hills', [P1(PR, 960, { pose: 'present', expr: 'happy', s: 1.9 }), Crowd(PE, 960, { n: 6, gap: 240, s: 1.6, expr: 'happy' }), Name('A JEWISH TEACHER', 960, 250)])),
  g109: story(M('FROM GALILEE: JESUS', { c: [35.5, 32.9], z: 14, z2: 17, hot: ['ISR', 'PSE'], pins: [[35.5, 32.8]] })),
  g110: story(SC('night', [Doc(960, 540, 1.3, 4), Chip('THE YEAR 30', 960, 200)], { z: [1, 1] })),
  g111: story(SC('hills', [Walk(PE, 900, 100, { n: 3, expr: 'happy', len: 80 }), Walk(PR, 1000, 1850, { n: 3, expr: 'happy', len: 80 }), Chip('A MOVEMENT BEGINS', 960, 200)])),
  g112: story(SC('town', [Crowd(CW.monk, 960, { n: 4, gap: 200, pose: 'idle' }), Chip('MUCH LATER: CHRISTIANITY', 960, 200)])),
  g113: story(SC('jerusalem', [Crowd(PE, 700, { n: 5, pose: 'fist', expr: 'angry', gap: 140 }), March(RO, 1900, 1400, { n: 2, len: 50 }), Chip('66 CE: THE REVOLT', 960, 200)], { stunt: 'peek' })),
  g114: story(SC('night', [Burn(960, GY - 40, 1.6), Burn(560, GY - 40, 1, 10)], { z: [1, 1] })),
  g115: story(SC('jerusalem', [March(RO, 100, 1300, { n: 5, len: 80, item: 'spear' }), Ride(RO, 40, 1000, { len: 80 }), Chip('70 CE: TITUS', 960, 200)])),
  g116: story(SC('temple', [Burn(960, GY - 60, 2.2), Burn(640, GY - 60, 1.2, 8)], { z: [1, 1] }), E('09-western-wall-fallen-stones.jpg', 0.75, 'burns', 'Stones thrown down from the Temple Mount, Jerusalem', { h: 560, quiet: true })),
  g117: story(SC('night', [Prop('menorah', 960, 620, 0.9, 6)], { z: [1, 1] })),
  g118: story(SC('rome', [Chip('THE ARCH OF TITUS, ROME', 960, 200)], { stunt: 'cane' })),
  g119: story(SC('rome', [March(RO, 100, 1500, { n: 4, len: 80, item: 'spear' }), (a: any) => <g transform={`translate(${interpolate(a.t, [0, 80], [440, 1700])} ${GY - 330}) scale(0.8)`}>{ICONS.menorah}</g>, Chip('THE GOLDEN MENORAH', 960, 200)])),
  g120: story(SC('desert', [Prop('fort', 1100, GY - 150, 2.6, 2), Crowd(EL, 700, { n: 3, pose: 'fist', expr: 'determined' }), Chip('MASADA', 960, 200)], { stunt: 'fly' }), E('10-masada.jpg', 0.75, 'Masada', 'Masada, where the last rebels held out until about 73 CE', { h: 560 })),
  g121: story(SC('desert', [Prop('fort', 1100, GY - 150, 2.6, 0), March(RO, 100, 640, { n: 4, len: 70, item: 'spear' }), Chip('ABOUT 73 CE', 960, 200)])),
};
