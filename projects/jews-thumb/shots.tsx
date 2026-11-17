import React from 'react';
import { WorldMap, QC, camAt } from '@engine/qgis/QgisMap';
import { Silhouette } from '@engine/cast/Silhouette';
import { W } from '@engine/cast/Wardrobe';
import { D } from '../jews-and-israel/src/Kit';
import { BG } from '../jews-and-israel/src/Story';
import { Chibi } from '@engine/characters/Chibi';
import type { ShotMap } from '@engine/kit';

const Thumb = (big: string, small: string): React.FC<any> => () => {
  const cam = camAt(35.3, 31.5, 30);
  return (
    <>
            <WorldMap data={D} cam={cam} fill={(c: any) => (c.iso === 'ISR' ? '#2E5FA8' : c.iso === 'PSE' ? '#9DB7D8' : QC.land)} grid={false} />
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
      <rect x={0} y={0} width={1920} height={1080} fill="rgba(10,18,40,0.22)" />
      <g fontFamily="TagBold" fontWeight={900} textAnchor="start">
        <text x={60} y={250} fontSize={160} fill="#FFFFFF" stroke="#0B1530" strokeWidth={16} paintOrder="stroke">{big}</text>
        <text x={60} y={420} fontSize={160} fill="#FFD84A" stroke="#0B1530" strokeWidth={16} paintOrder="stroke">{small}</text>
      </g>
      <Silhouette x={1540} y={560} name="Benjamin Netanyahu" role="Prime Minister" c="#1E3A8A" s={1.55} k={1} costume={W.LEADER as any} />
      </svg>
    </>
  );
};
const ThumbC: React.FC<any> = () => (
  <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
    <defs>
      <clipPath id="cl"><polygon points="0,0 1130,0 790,1080 0,1080" /></clipPath>
      <clipPath id="cr"><polygon points="1130,0 1920,0 1920,1080 790,1080" /></clipPath>
      <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0.55" /><stop offset="0.45" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.35" /></linearGradient>
    </defs>
    <g clipPath="url(#cl)"><g transform="translate(-60 40) scale(1.1)">{BG.jerusalem(0)}</g></g>
    <g clipPath="url(#cr)"><g transform="translate(-100 40) scale(1.1)">{BG.modern(0)}</g></g>
    <polygon points="1130,0 1160,0 820,1080 790,1080" fill="#FFD84A" stroke="#0B1530" strokeWidth={6} />
    <rect width={1920} height={1080} fill="url(#vg)" />
    <Chibi x={1560} y={990} s={3.2} {...(W.SUIT("#1E2F6B", "#8A8A8A") as any)} item="none" pose="present" expr="smile" talking={[]} seed="bn" />
    <g fontFamily="TagBold" fontWeight={900} textAnchor="start">
      <text x={50} y={230} fontSize={215} fill="#FFD84A" stroke="#0B1530" strokeWidth={22} paintOrder="stroke">2000 YEARS</text>
      <text x={50} y={430} fontSize={200} fill="#FFFFFF" stroke="#0B1530" strokeWidth={20} paintOrder="stroke">OF ISRAEL</text>
    </g>
    <g transform="translate(1560 1030)"><rect x={-300} y={-52} width={600} height={74} rx={14} fill="#C8202B" stroke="#0B1530" strokeWidth={6} /><text y={2} fontFamily="TagBold" fontSize={46} fill="#fff" textAnchor="middle">BENJAMIN NETANYAHU</text></g>
  </svg>
);
export const SHOTS: ShotMap = {
  thumbA: Thumb('2000 YEARS', 'OF ISRAEL'),
  thumbB: ThumbC as any,
} as any;

export const Overlay = () => null;
