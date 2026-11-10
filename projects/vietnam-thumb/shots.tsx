/** YouTube thumbnail for the Vietnam film: 1945 (quoting America, side by side) vs 1975 (the last helicopter). */
import React from 'react';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Chibi } from '@engine/characters/Chibi';
import { Host } from '@engine/characters/Host';
import { Paddy, Rooftop, Huey, Flag } from '@engine/scenes/Vietnam';
import { OL } from '@engine/scenes/Parts';
import { makeOpening, makeEnd, type ShotMap, type SP } from '@engine/kit';
import { W, SKIN } from '@engine/cast/Wardrobe';

const SPLIT_L = 'polygon(0 0, 1030px 0, 890px 1080px, 0 1080px)';
const SPLIT_R = 'polygon(1030px 0, 1920px 0, 1920px 1080px, 890px 1080px)';
const big = (size: number, color = '#fff', stroke = 14): React.CSSProperties => ({
  fontFamily: 'TagBold', fontSize: size, color, lineHeight: 1, letterSpacing: 1,
  WebkitTextStroke: `${stroke}px #14100C`, paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,0.35)',
});

const Thumb: React.FC<SP> = () => (
  <>
    <div style={{ position: 'absolute', inset: 0, clipPath: SPLIT_L }}>
      <CameraRig move={{ zoomFrom: 1.08, zoomTo: 1.08, focus: [520, 640] }}>
        <Paddy />
        <Layer depth={1}>
          <Flag kind="us" x={170} y={560} s={1.25} pole={420} />
          <Chibi x={400} y={960} s={1.45} {...W.GI(0)} item={undefined} pose="present" expr="happy" talking={[]} seed="t1" />
          <Chibi x={720} y={960} s={1.45} {...W.YOUNG_ACTIVIST_SEA} pose="raise" expr="happy" talking={[]} seed="t2" />
          <g transform="translate(560 430) rotate(-4)">
            <rect x={-250} y={-95} width={500} height={190} rx={10} fill="#F2E3BC" stroke="#5A3A22" strokeWidth={8} />
            <text y={-20} textAnchor="middle" fontFamily="Hand" fontSize={50} fill="#3A2416">“All men are</text>
            <text y={48} textAnchor="middle" fontFamily="Hand" fontSize={50} fill="#3A2416">created equal”</text>
          </g>
        </Layer>
      </CameraRig>
    </div>
    <div style={{ position: 'absolute', inset: 0, clipPath: SPLIT_R }}>
      <CameraRig move={{ zoomFrom: 1.08, zoomTo: 1.08, focus: [1400, 600] }}>
        <Rooftop dusk />
        <Layer depth={1}>
          <rect x={-200} y={-200} width={2400} height={1500} fill="#7A1E14" opacity={0.28} />
          <g transform="translate(1440 300) rotate(-6)"><Huey x={0} y={0} s={1.05} /></g>
          {[...Array(6)].map((_, i) => (
            <g key={i} filter="url(#sil)"><Chibi x={1120 + i * 135} y={930 + (i % 2) * 18} s={1.05} {...W.VILLAGER_SEA('#3A3A3A', i)} pose={i % 2 ? 'raise' : 'bothUp'} expr="shock" talking={[]} seed={'t' + i} /></g>
          ))}
        </Layer>
      </CameraRig>
    </div>
    <svg style={{ position: 'absolute', inset: 0 }} width={1920} height={1080}><path d="M1030 0 L890 1080" stroke="#fff" strokeWidth={16} /><path d="M1030 0 L890 1080" stroke={OL} strokeWidth={5} /></svg>
    <div style={{ position: 'absolute', left: 40, top: 30, ...big(150, '#FFD84A', 16) }}>1945</div>
    <div style={{ position: 'absolute', right: 40, top: 30, ...big(150, '#FF5A4A', 16) }}>1975</div>
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center', ...big(118, '#fff', 18) }}>WHAT WENT WRONG?</div>
  </>
);

export const SHOTS: ShotMap = { opening: makeOpening('thumb', ''), thumb: Thumb, end: makeEnd('thumb') };
