/** YouTube thumbnail for "The Entire History of California": the narrator flies at a glowing California, with the film's thread (gold, jeans, chips). */
import React from 'react';
import { OL } from '@engine/scenes/Parts';
import { makeOpening, makeEnd, type ShotMap, type SP } from '@engine/kit';
import { CaShape, Rider, Jeans } from '../california/src/Kit';
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

const Thumb: React.FC<SP> = () => (
  <>
    <svg style={{ position: 'absolute', inset: 0 }} width={1920} height={1080}>
      <defs>
        <radialGradient id="thBg" cx="0.66" cy="0.52" r="0.75">
          <stop offset="0" stopColor="#2F6F9F" />
          <stop offset="0.55" stopColor="#173A57" />
          <stop offset="1" stopColor="#0B1B2A" />
        </radialGradient>
        <radialGradient id="thGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD84A" stopOpacity="0.75" />
          <stop offset="1" stopColor="#FFD84A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#thBg)" />
      {[...Array(14)].map((_, i) => <path key={i} d={`M1290 540 L${1290 + Math.cos(i / 14 * Math.PI * 2) * 1500} ${540 + Math.sin(i / 14 * Math.PI * 2) * 1500} L${1290 + Math.cos((i + 0.45) / 14 * Math.PI * 2) * 1500} ${540 + Math.sin((i + 0.45) / 14 * Math.PI * 2) * 1500} Z`} fill="#FFFFFF" opacity={0.05} />)}
      <ellipse cx={1290} cy={560} rx={520} ry={500} fill="url(#thGlow)" />
      <g transform="rotate(-6 1290 560)"><CaShape x={1290} y={560} h={920} fill="#F6B73C" sw={9} /></g>
      <Badge x={1010} y={300} r={-8}><g transform="scale(1.25)"><Nugget /></g></Badge>
      <Badge x={1020} y={760} r={6}><g transform="scale(1.35)"><Jeans /></g></Badge>
      <Badge x={1560} y={850} r={-4}><g transform="scale(0.72)"><Chip /></g></Badge>
      <Sparkle x={1110} y={225} f={10} r={34} c="#FFF6C8" />
      <Sparkle x={1340} y={420} f={30} r={26} c="#FFF6C8" />
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
