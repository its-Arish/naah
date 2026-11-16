import React from 'react';
import { WorldMap, QC, camAt } from '@engine/qgis/QgisMap';
import { Silhouette } from '@engine/cast/Silhouette';
import { W } from '@engine/cast/Wardrobe';
import { D } from '../jews-and-israel/src/Kit';
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
export const SHOTS: ShotMap = {
  thumbA: Thumb('2000 YEARS', 'OF ISRAEL'),
  thumbB: Thumb('4000 YEARS', 'OF ISRAEL'),
} as any;

export const Overlay = () => null;
