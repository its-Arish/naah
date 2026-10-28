/**
 * France.tsx — an accurate outline of metropolitan France (mainland + Corsica), traced from a
 * reference political map, with real city positions (least-squares fit of the map's projection to 7 known points; error ≈ 1–3 px on the reference).
 * Local coordinates: the mainland spans about 0..866 × 0..894; draw it with
 * <FranceMap x y s /> or use FRANCE_PATH / CORSICA_PATH / cityXY() directly.
 */
import React from 'react';
import { useCurrentFrame, springPop, gravityDrop } from '../lib/core';
import { OL } from './Parts';

export const FRANCE_PATH = 'M546.0 0.0 L501.8 2.6 L488.8 31.2 L483.6 62.4 L473.2 75.4 L423.8 98.8 L369.2 109.2 L361.4 117.0 L358.8 137.8 L327.6 137.8 L299.0 119.6 L267.8 111.8 L262.6 106.6 L262.6 72.8 L231.4 65.0 L226.2 80.6 L228.8 137.8 L223.6 169.0 L189.8 169.0 L158.6 156.0 L132.6 156.0 L119.6 130.0 L104.0 114.4 L46.8 117.0 L31.2 111.8 L5.2 111.8 L0.0 117.0 L2.6 122.2 L13.0 124.8 L13.0 158.6 L7.8 166.4 L7.8 179.4 L33.8 187.2 L83.2 234.0 L85.8 241.8 L101.4 247.0 L114.4 260.0 L114.4 286.0 L127.4 296.4 L127.4 348.4 L132.6 374.4 L171.6 418.6 L171.6 452.4 L156.0 475.8 L156.0 512.2 L145.6 517.4 L143.0 535.6 L127.4 569.4 L127.4 587.6 L93.6 631.8 L72.8 681.2 L52.0 702.0 L67.6 715.0 L70.2 741.0 L75.4 748.8 L98.8 764.4 L111.8 782.6 L132.6 785.2 L153.4 811.2 L166.4 813.8 L179.4 824.2 L189.8 824.2 L195.0 819.0 L231.4 821.6 L267.8 845.0 L296.4 884.0 L332.8 894.4 L371.8 891.8 L379.6 850.2 L390.0 832.0 L413.4 816.4 L449.8 806.0 L483.6 806.0 L517.4 829.4 L553.8 829.4 L569.4 845.0 L572.0 858.0 L590.2 865.8 L613.6 886.6 L652.6 886.6 L665.6 863.2 L738.4 834.6 L751.4 816.4 L725.4 803.4 L712.4 787.8 L712.4 678.6 L741.0 657.8 L735.8 647.4 L735.8 608.4 L741.0 603.2 L738.4 574.6 L730.6 561.6 L681.2 564.2 L678.6 530.4 L691.6 527.8 L691.6 509.6 L709.8 507.0 L728.0 478.4 L743.6 468.0 L769.6 460.2 L769.6 449.8 L777.4 442.0 L795.6 442.0 L803.4 436.8 L808.6 423.8 L808.6 403.0 L826.8 353.6 L865.8 299.0 L837.2 283.4 L795.6 270.4 L785.2 260.0 L772.2 231.4 L741.0 223.6 L733.2 210.6 L686.4 205.4 L681.2 200.2 L681.2 176.8 L655.2 176.8 L647.4 169.0 L642.2 150.8 L634.4 143.0 L634.4 117.0 L621.4 101.4 L608.4 93.6 L590.2 93.6 L585.0 80.6 L551.2 83.2 L548.6 41.6 L553.8 36.4 L551.2 2.6 Z';
export const CORSICA_PATH = 'M863.2 969.8 L855.4 977.6 L821.6 980.2 L808.6 993.2 L800.8 1011.4 L808.6 1081.6 L816.4 1092.0 L829.4 1097.2 L845.0 1081.6 L847.6 1058.2 L865.8 1019.2 Z';
/** Real cities, positioned from latitude/longitude on the same projection as the outline. */
export const CITIES: Record<string, [number, number]> = {"Paris": [481.7, 218.5], "Versailles": [465.4, 220.0], "Lille": [567.0, 36.6], "Nantes": [181.8, 317.2], "Limoges": [347.6, 515.2], "Bordeaux": [202.9, 580.3], "Marseille": [581.3, 848.8], "Strasbourg": [845.4, 354.2], "Nice": [718.3, 845.0], "Sète": [468.8, 805.8], "Lyon": [590.8, 591.8], "Varennes": [672.5, 230.7], "Nanterre": [472.5, 211.9], "Clichy-sous-Bois": [496.2, 216.6], "Orléans": [432.3, 312.2], "Toulouse": [318.3, 742.1], "Sedan": [676.0, 176.6], "Vichy": [501.4, 527.1], "Rennes": [191.1, 219.7], "Le Havre": [341.2, 105.5]};
/** Any latitude/longitude → local map coordinates. */
export const cityXY = (lat: number, lon: number): [number, number] => {
  const m = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  return [(26.31217 * lon + 293.51838 * m + -164.26622) * 2.6, (7.47924 * lon + -1569.28325 * m + 1604.37447) * 2.6];
};

export type Pin = { city: string; at: number; color?: string; label?: boolean };
/** France with optional pins that drop in under gravity (bounce + squash) and city labels. */
export const FranceMap: React.FC<{ x: number; y: number; s?: number; fill?: string; stroke?: string; corsica?: boolean; pins?: Pin[]; children?: React.ReactNode; labelSize?: number }> = ({ x, y, s = 1, fill = '#E8DCC0', stroke = OL, corsica = true, pins = [], children, labelSize = 34 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={FRANCE_PATH} fill="#1A1410" opacity={0.25} transform="translate(12 14)" />
      <path d={FRANCE_PATH} fill={fill} stroke={stroke} strokeWidth={6 / s} strokeLinejoin="round" />
      {corsica && <path d={CORSICA_PATH} fill={fill} stroke={stroke} strokeWidth={5 / s} strokeLinejoin="round" />}
      {children}
      {pins.map((p, i) => {
        if (f < p.at) return null;
        const [cx, cy] = CITIES[p.city];
        const d = gravityDrop(f, p.at, { h: 260, g: 3.2, e: 0.35 });
        const k = springPop(f, p.at + 4);
        return (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx={14 / s} ry={5 / s} fill="#000" opacity={0.25} />
            <g transform={`translate(${cx} ${cy + d.y}) scale(${d.sx / s} ${d.sy / s})`}>
              <path d="M0 0 C-6 -14 -18 -22 -18 -36 A18 18 0 1 1 18 -36 C18 -22 6 -14 0 0 Z" fill={p.color ?? '#C0392B'} stroke={OL} strokeWidth={4} />
              <circle cy={-36} r={7} fill="#fff" />
            </g>
            {p.label !== false && k > 0 && <text x={cx + 26 / s} y={cy - 14 / s} fontFamily="TagBold" fontSize={labelSize / s} fill="#1A1410" stroke="#fff" strokeWidth={7 / s} style={{ paintOrder: 'stroke' }} opacity={Math.min(1, k)}>{p.city}</text>}
          </g>
        );
      })}
    </g>
  );
};
