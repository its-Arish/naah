/** YouTube thumbnail for "The Entire History of California": a QGIS map (Natural Earth states via the map kit) with California lit up, the narrator flying in, and the film's thread (gold, jeans, chips). */
import React from 'react';
import { OL } from '@engine/scenes/Parts';
import { makeOpening, makeEnd, type ShotMap, type SP } from '@engine/kit';
import { WorldMap, camAt, P, toScreen } from '@engine/qgis/QgisMap';
import { D, Rider, Jeans } from '../california/src/Kit';
import { Nugget, Chip, Sparkle } from '../california/src/Kit2';

const big = (size: number, color = '#fff', stroke = 14): React.CSSProperties => ({
  fontFamily: 'TagBold', fontSize: size, color, lineHeight: 0.98, letterSpacing: 1,
  WebkitTextStroke: `${stroke}px #14100C`, paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,0.35)',
});

const Badge: React.FC<{ x: number; y: number; r?: number; children: React.ReactNode }> = ({ x, y, r = 0, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <circle r={86} fill="#FBF3E0" stroke={OL} strokeWidth={7} />
    {children}
  </g>
);

const CAM = camAt(-123.0, 37.4, 15.5);
const CA = P(-119.4, 37.3);

const Thumb: React.FC<SP> = () => (
  <>
    <WorldMap data={D} cam={CAM} sea="#1C4A6E" grid={false} sw={2.2} fill={(c) => (c.iso === 'MEX' ? '#4A5E66' : c.iso === 'USA' ? '#55707A' : '#4A5E66')}>
      {D.provinces.USA.filter((p) => p.name !== 'California').map((p) => <path key={p.name} d={p.d} fill="#55707A" stroke="#14100C" strokeWidth={2 / CAM.z} strokeLinejoin="round" />)}
      {D.provinces.USA.filter((p) => p.name === 'California').map((p) => <path key={p.name} d={p.d} fill="#F6B73C" stroke="#14100C" strokeWidth={7 / CAM.z} strokeLinejoin="round" />)}
    </WorldMap>
    <svg style={{ position: 'absolute', inset: 0 }} width={1920} height={1080}>
      <defs>
        <radialGradient id="thGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD84A" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFD84A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="thShade" x1="0" x2="1">
          <stop offset="0" stopColor="#0B1B2A" stopOpacity="0.75" />
          <stop offset="0.5" stopColor="#0B1B2A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#thShade)" />
      {(() => { const g = toScreen(CAM, ...P(-121.6, 40.4)), j = toScreen(CAM, ...P(-119.6, 36.9)), c = toScreen(CAM, ...P(-117.4, 34.6)); return (<>
        <Badge x={g.x} y={g.y} r={-8}><g transform="scale(1.25)"><Nugget /></g></Badge>
        <Badge x={j.x} y={j.y} r={6}><g transform="scale(1.35)"><Jeans /></g></Badge>
        <Badge x={c.x} y={c.y} r={-4}><g transform="scale(0.72)"><Chip /></g></Badge>
        <Sparkle x={g.x + 100} y={g.y - 80} f={10} r={34} c="#FFF6C8" />
      </>); })()}
      <Rider x={1700} y={330} s={0.62} arm="point" expr="grin" flip speed={0.6} />
    </svg>
    <div style={{ position: 'absolute', left: 56, top: 70, width: 900, ...big(176, '#FFD84A', 18) }}>13,000<br />YEARS</div>
    <div style={{ position: 'absolute', left: 60, top: 470, width: 900, ...big(104, '#FFFFFF', 14) }}>OF CALIFORNIA</div>
    <div style={{ position: 'absolute', left: 56, top: 640, transform: 'rotate(-3deg)', transformOrigin: 'left center' }}>
      <div style={{ display: 'inline-block', background: '#D93A2B', border: '8px solid #14100C', borderRadius: 18, padding: '18px 34px 10px', boxShadow: '0 10px 0 rgba(0,0,0,0.35)', ...big(112, '#FFFFFF', 12) }}>IN 13 MINUTES</div>
    </div>
  </>
);

export const SHOTS: ShotMap = { opening: makeOpening('thumb', ''), thumb: Thumb, end: makeEnd('thumb') };
