/** Opening (4 s, before the voice): the world map zooms down onto Alabama and the title lands on the state. */
import React from 'react';
import { useCurrentFrame, interpolate, Easing, springPop } from '@engine/lib/core';
import { WorldMap, camAt, moveCam, mixCam, toScreen, type Cam } from '@engine/qgis/QgisMap';
import { OL } from '@engine/scenes/Parts';
import { D, AL_D, GOLD, INK, Rider } from './Kit';

const WORLD: Cam = { x: 960, y: 420, z: 1.05 };
const USA = camAt(-96, 38, 4.2);
const AL = camAt(-86.8, 32.7, 24);
const STATES = D.provinces.USA ?? [];

export const Opening: React.FC = () => {
  const f = useCurrentFrame();
  // two eased legs: world -> USA, then USA -> Alabama
  const cam = f < 44 ? moveCam(f, WORLD, USA, 4, 44) : moveCam(f, USA, AL, 44, 92);
  const glow = interpolate(f, [70, 92], [0, 1], Easing.out);
  const title = springPop(f, 86);
  const states = interpolate(f, [26, 44], [0, 1]);
  const p = toScreen(cam, ...([(-86.8 + 180) * (1920 / 360), (90 - 32.7) * (1920 / 360)] as [number, number]));
  return (
    <>
      <WorldMap data={D} cam={cam} sea="#9EC5DB" fill={(c) => (c.iso === 'USA' ? '#EFE3C4' : '#E4DAC0')}>
        {STATES.map((st, i) => <path key={i} d={st.d} fill={st.name === 'Alabama' ? '#EFE3C4' : 'none'} stroke="#8A7A5A" strokeOpacity={states} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />)}
        <path d={AL_D} fill={`rgba(243,181,98,${0.25 + 0.75 * glow})`} stroke={OL} strokeWidth={2 + 2 * glow} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </WorldMap>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {glow > 0 && <circle cx={p.x} cy={p.y} r={420 + 30 * Math.sin(f / 6)} fill="url(#warmGlow)" opacity={0.35 * glow} />}
        {title > 0 && <g transform={`translate(960 160) scale(${title})`}>
          <rect x={-560} y={-70} width={1120} height={140} rx={18} fill={INK} stroke={GOLD} strokeWidth={5} opacity={0.92} />
          <text y={-14} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#CFC6B2">THE ENTIRE HISTORY OF</text>
          <text y={46} textAnchor="middle" fontFamily="TagBold" fontSize={64} fill={GOLD}>ALABAMA</text>
        </g>}
        <Rider x={interpolate(f, [0, 92], [260, 1560], Easing.inOut)} y={interpolate(f, [0, 92], [300, 640], Easing.inOut)} s={0.42} speed={f < 92 ? 1 : 0.1} tilt={f < 92 ? -12 : -5} arm="point" expr="grin" flip={f >= 92} />
      </svg>
    </>
  );
};
