/**
 * A real politician or public figure, shown the house way: a dark silhouette on a coloured card,
 * labelled with name and role, never a caricature.
 *
 *   <Silhouette x={600} y={500} name="Prime Minister" role="2024–25" c="#1E2E6A" k={springPop(f, 10)} />
 *
 * `costume` defaults to the wardrobe's LEADER (suit and tie); pass another (W.GENERAL_1940, W.KING()…)
 * to change the outline. Needs the `sil` filter from fx/Defs, which every film already mounts.
 */
import React from 'react';
import { Chibi } from '@engine/characters/Chibi';
import { OL } from '@engine/scenes/Parts';
import { W, type Costume } from './Wardrobe';

export const Silhouette: React.FC<{ x: number; y: number; name: string; role?: string; c: string; k?: number; s?: number; costume?: Costume; pose?: string }> = ({ x, y, name, role = '', c, k = 1, s = 1, costume = W.LEADER, pose = 'idle' }) =>
  k > 0 ? (
    <g transform={`translate(${x} ${y}) scale(${k * s})`}>
      <rect x={-170} y={-250} width={340} height={420} rx={20} fill={c} stroke={OL} strokeWidth={7} />
      <g filter="url(#sil)"><Chibi x={0} y={90} s={1.05} {...(costume as any)} pose={pose} expr="normal" talking={[]} seed={'si' + name} /></g>
      <rect x={-170} y={100} width={340} height={70} fill="rgba(0,0,0,0.55)" />
      <text y={136} textAnchor="middle" fontFamily="TagBold" fontSize={name.length > 16 ? 26 : 32} fill="#fff">{name}</text>
      {role && <text y={162} textAnchor="middle" fontFamily="TagBold" fontSize={20} fill="#E8E2D8">{role}</text>}
    </g>
  ) : null;
