/** YouTube thumbnails for "The Entire History of Alabama": clean, minimalist, QGIS map (Natural Earth states). */
import React from 'react';
import { WorldMap, camAt, toScreen, P } from '@engine/qgis/QgisMap';
import { Host } from '@engine/characters/Host';
import { OL } from '@engine/scenes/Parts';
import { makeOpening, makeEnd, type ShotMap, type SP } from '@engine/kit';
import { D, AL_D } from '../alabama/src/Kit';
import { Rocket, ArchBridge } from '../alabama/src/KitAL';

const GOLD = '#F3B562';
const STATES = D.provinces.USA ?? [];
const CAM = camAt(-84.6, 32.75, 27); // Alabama sits left of centre; the narrator stands right
const at = (lon: number, lat: number) => { const [x, y] = P(lon, lat); return toScreen(CAM, x, y); };
const big = (size: number, color = '#fff', stroke = 14): React.CSSProperties => ({
  fontFamily: 'TagBold', fontSize: size, color, lineHeight: 1, letterSpacing: 2,
  WebkitTextStroke: `${stroke}px #0E141A`, paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,0.35)',
});

const Map: React.FC = () => (
  <WorldMap data={D} cam={CAM} sea="#152331" stroke="#2C3B48" fill={(c) => (c.iso === 'USA' ? '#22303C' : '#1C2833')}>
    {STATES.map((st, i) => st.name === 'Alabama' ? null : <path key={i} d={st.d} fill="#24323F" stroke="#3A4B5A" strokeWidth={1.6} vectorEffect="non-scaling-stroke" />)}
    {[70, 44, 24].map((w, i) => <path key={w} d={AL_D} fill="none" stroke={GOLD} strokeOpacity={[0.08, 0.14, 0.25][i]} strokeWidth={w} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />)}
    <path d={AL_D} fill={GOLD} stroke="#FFE6B8" strokeWidth={4} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
  </WorldMap>
);

const Narrator: React.FC = () => (
  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
    <ellipse cx={1480} cy={1042} rx={150} ry={22} fill="#000" opacity={0.3} />
    <g transform="translate(1910 0) scale(-1 1)"><Host x={430} y={1040} scale={1.15} keys={[{ at: 0, arm: 'point', expr: 'grin' }]} talking={[]} seed="thumb" /></g>
  </svg>
);

// A: rocket + bridge on the glowing state, "BOTH?"
const ThumbA: React.FC<SP> = () => {
  const hv = at(-86.59, 34.73), se = at(-87.02, 32.41);
  return (
    <>
      <Map />
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <g transform={`translate(${hv.x} ${hv.y + 150}) scale(0.4)`}><Rocket /></g>
        <g transform={`translate(${se.x + 20} ${se.y + 30})`}><ArchBridge s={0.24} c="#1B2530" light="#3A4654" /></g>
      </svg>
      <Narrator />
      <div style={{ position: 'absolute', right: 70, top: 60, textAlign: 'right', ...big(170, GOLD, 16) }}>BOTH?</div>
    </>
  );
};

// B: just the glowing state and its name
const ThumbB: React.FC<SP> = () => (
  <>
    <Map />
    <Narrator />
    <div style={{ position: 'absolute', right: 60, top: 70, textAlign: 'right', ...big(150, GOLD, 16) }}>ALABAMA</div>
    <div style={{ position: 'absolute', right: 66, top: 240, textAlign: 'right', ...big(64, '#E9EEF2', 10) }}>THE WHOLE STORY</div>
  </>
);

export const SHOTS: ShotMap = { opening: makeOpening('thumb', ''), thumb_a: ThumbA, thumb_b: ThumbB, end: makeEnd('thumb') };
