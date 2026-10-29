// Prints {name: svg-markup} for every rig (wardrobe costumes + the narrator). Used by export_rigs.mjs.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { W } from '../../engine/cast/Wardrobe';
import { ChibiRig, HostRig } from '../../engine/characters/Rig';

const out: Record<string, string> = {};
out['HOST'] = renderToStaticMarkup(<HostRig />);
for (const [k, v] of Object.entries(W)) {
  const c = typeof v === 'function' ? (v as any)() : v;
  out[k] = renderToStaticMarkup(<ChibiRig c={c} name={k} />);
}
process.stdout.write(JSON.stringify(out));
