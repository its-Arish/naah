/** The Entire History of Jews and Israel: shot index. Beats come from tools/make_beats.py. */
import React from 'react';
import { makeOpening, makeEnd, type ShotMap, type SP } from '@engine/kit';
import { cuts } from './src/Cuts';
import { Sign } from './src/Kit2';
import { HOOK } from './src/Hook';
import { ANCIENT } from './src/Ancient';
import { ERAS } from './src/Timeline';

export { Overlay } from './src/Timeline';

/** Placeholder for eras not drawn yet: narrator presenting with the era name. */
const era = (name: string) => cuts([{ at: 0, nar: { arm: 'present' }, draw: ({ pk }) => <Sign x={900} y={420} k={pk(2)} text={name.toUpperCase()} sub="(scene not drawn yet)" size={64} /> }]);

export const SHOTS: ShotMap = {
  opening: makeOpening('', ''),
  end: makeEnd('The Entire History of Jews and Israel'),
  ...HOOK,
  ...ANCIENT,
  g_canaan: era('Canaan'),
  g_kingdoms: era('Kingdoms'),
  g_exile: era('Exile'),
  g_return: era('Return'),
  g_maccabees: era('Maccabees'),
  g_rome: era('Rome'),
  g_diaspora: era('Diaspora'),
  g_middleages: era('Middle Ages'),
  g_europe: era('Europe'),
  g_mandate: era('Mandate'),
  g_holocaust: era('Holocaust'),
  g_partition: era('Partition'),
  g_wars: era('Wars'),
  g_oslo: era('Oslo'),
  g_gaza: era('Gaza'),
  g_today: era('Today'),
};
