/** YouTube thumbnail for "The Entire History of California": kept as simple as possible. A GIS map (Natural Earth states via the QGIS kit) with California lit up, and the title. No narrator. */
import React from 'react';
import { makeOpening, makeEnd, type ShotMap, type SP } from '@engine/kit';
import { WorldMap, camAt } from '@engine/qgis/QgisMap';
import { D } from '../california/src/Kit';

const big = (size: number, color = '#fff', stroke = 14): React.CSSProperties => ({
  fontFamily: 'TagBold', fontSize: size, color, lineHeight: 0.98, letterSpacing: 1,
  WebkitTextStroke: `${stroke}px #14100C`, paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,0.35)',
});

const CAM = camAt(-123.0, 37.4, 15.5);

const Map: React.FC<{ island?: boolean }> = ({ island }) => {
  const ca = D.provinces.USA.filter((p) => p.name === 'California');
  return (
    <WorldMap data={D} cam={CAM} sea="#1C4A6E" grid={false} sw={2.2} fill={(c) => (c.iso === 'MEX' ? '#4A5E66' : c.iso === 'USA' ? '#55707A' : '#4A5E66')}>
      {D.provinces.USA.filter((p) => p.name !== 'California').map((p) => <path key={p.name} d={p.d} fill="#55707A" stroke="#14100C" strokeWidth={2 / CAM.z} strokeLinejoin="round" />)}
      {/* island version: California's own GIS border, widened into water on every side */}
      {island && ca.map((p) => <path key={'w' + p.name} d={p.d} fill="none" stroke="#14100C" strokeWidth={84 / CAM.z} strokeLinejoin="round" />)}
      {island && ca.map((p) => <path key={'s' + p.name} d={p.d} fill="none" stroke="#1C4A6E" strokeWidth={76 / CAM.z} strokeLinejoin="round" />)}
      {ca.map((p) => <path key={p.name} d={p.d} fill="#F6B73C" stroke="#14100C" strokeWidth={7 / CAM.z} strokeLinejoin="round" />)}
    </WorldMap>
  );
};
const Shade = () => (
  <svg style={{ position: 'absolute', inset: 0 }} width={1920} height={1080}>
    <defs><linearGradient id="thShade" x1="0" x2="1"><stop offset="0" stopColor="#0B1B2A" stopOpacity="0.75" /><stop offset="0.5" stopColor="#0B1B2A" stopOpacity="0" /></linearGradient></defs>
    <rect width={1920} height={1080} fill="url(#thShade)" />
  </svg>
);
const Banner: React.FC<{ text: string; top: number; size?: number }> = ({ text, top, size = 112 }) => (
  <div style={{ position: 'absolute', left: 56, top, transform: 'rotate(-3deg)', transformOrigin: 'left center' }}>
    <div style={{ display: 'inline-block', background: '#D93A2B', border: '8px solid #14100C', borderRadius: 18, padding: '18px 34px 10px', boxShadow: '0 10px 0 rgba(0,0,0,0.35)', ...big(size, '#FFFFFF', 12) }}>{text}</div>
  </div>
);

/** Idea 1: California as the island the old maps drew. Text: one question. */
const Island: React.FC<SP> = () => (
  <>
    <Map island />
    <Shade />
    <div style={{ position: 'absolute', left: 50, top: 270, width: 900, ...big(205, '#FFD84A', 19) }}>AN<br />ISLAND?</div>
  </>
);

/** Idea 2: the original, with fewer words. */
const Short: React.FC<SP> = () => (
  <>
    <Map />
    <Shade />
    <div style={{ position: 'absolute', left: 56, top: 150, width: 900, ...big(230, '#FFD84A', 20) }}>13,000<br />YEARS</div>
    <Banner text="IN 13 MIN" top={660} size={140} />
  </>
);

const Thumb: React.FC<SP> = () => (
  <>
    <WorldMap data={D} cam={CAM} sea="#1C4A6E" grid={false} sw={2.2} fill={(c) => (c.iso === 'MEX' ? '#4A5E66' : c.iso === 'USA' ? '#55707A' : '#4A5E66')}>
      {D.provinces.USA.filter((p) => p.name !== 'California').map((p) => <path key={p.name} d={p.d} fill="#55707A" stroke="#14100C" strokeWidth={2 / CAM.z} strokeLinejoin="round" />)}
      {D.provinces.USA.filter((p) => p.name === 'California').map((p) => <path key={p.name} d={p.d} fill="#F6B73C" stroke="#14100C" strokeWidth={7 / CAM.z} strokeLinejoin="round" />)}
    </WorldMap>
    <svg style={{ position: 'absolute', inset: 0 }} width={1920} height={1080}>
      <defs>
        <linearGradient id="thShade" x1="0" x2="1">
          <stop offset="0" stopColor="#0B1B2A" stopOpacity="0.75" />
          <stop offset="0.5" stopColor="#0B1B2A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#thShade)" />
    </svg>
    <div style={{ position: 'absolute', left: 56, top: 70, width: 900, ...big(176, '#FFD84A', 18) }}>13,000<br />YEARS</div>
    <div style={{ position: 'absolute', left: 60, top: 470, width: 900, ...big(104, '#FFFFFF', 14) }}>OF CALIFORNIA</div>
    <div style={{ position: 'absolute', left: 56, top: 640, transform: 'rotate(-3deg)', transformOrigin: 'left center' }}>
      <div style={{ display: 'inline-block', background: '#D93A2B', border: '8px solid #14100C', borderRadius: 18, padding: '18px 34px 10px', boxShadow: '0 10px 0 rgba(0,0,0,0.35)', ...big(112, '#FFFFFF', 12) }}>IN 13 MINUTES</div>
    </div>
  </>
);

export const SHOTS: ShotMap = { opening: makeOpening('thumb', ''), thumb: Thumb, island: Island, short: Short, end: makeEnd('thumb') };
