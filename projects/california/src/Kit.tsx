/** California film: shared helpers, props and the "WHO GOT RICH?" board. */
import React from 'react';
import { useCurrentFrame, interpolate, Easing, springPop } from '@engine/lib/core';
import { Host } from '@engine/characters/Host';
import { OL } from '@engine/scenes/Parts';
import { wordAt } from '@engine/kit';
import { type QData, type Cam, WorldMap, QC } from '@engine/qgis/QgisMap';
import type { Shot } from '@engine/types';
import timeline from '@project/build/timeline.json';
import raw from './qgis.json';
import ca from './ca.json';

export const D = raw as unknown as QData;
export const CA_D = (ca as { d: string }).d;
export const PAPER = '#F4ECD8', RED = '#B3261E', GOLD = '#FFD84A', INK = '#1A1410', SEA = '#8FBBD3', SAND = '#E9D9B0';

const SHOTS_ALL = (timeline as any).shots as Shot[];
/** Frame within the run of consecutive beats that share this beat's shot id. k = this beat's index in the run. */
export const useGroup = (s: Shot) => {
  const f = useCurrentFrame();
  const i = SHOTS_ALL.findIndex((x) => x.id === s.id);
  let a = i; while (a > 0 && SHOTS_ALL[a - 1].shot === s.shot && SHOTS_ALL[a - 1].from + SHOTS_ALL[a - 1].dur === SHOTS_ALL[a].from) a--;
  let b = i; while (b < SHOTS_ALL.length - 1 && SHOTS_ALL[b + 1].shot === s.shot && SHOTS_ALL[b].from + SHOTS_ALL[b].dur === SHOTS_ALL[b + 1].from) b++;
  const start = SHOTS_ALL[a]?.from ?? s.from, end = (SHOTS_ALL[b]?.from ?? s.from) + (SHOTS_ALL[b]?.dur ?? s.dur);
  return { g: s.from - start + f, gd: end - start, k: i - a };
};
/** Local frame of a word spoken in beat `idx` of a run, seen from beat `k`: long past (-999) or not yet (99999) otherwise. */
export const gw = (s: Shot, k: number, idx: number, word: string) => (k > idx ? -999 : k < idx ? 99999 : wordAt(s, word));
/** Same for a plain local frame. */
export const gf = (k: number, idx: number, at: number) => (k > idx ? -999 : k < idx ? 99999 : at);

/** Narrator riding his staff (hovering over maps and wide scenes). x/y = his hips. */
export const Rider: React.FC<{ x: number; y: number; s?: number; tilt?: number; speed?: number; arm?: string; expr?: string; talking?: [number, number][]; flip?: boolean }> = ({ x, y, s = 0.42, tilt = -6, speed = 0.1, arm = 'point', expr = 'grin', talking = [], flip }) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 6) * 10;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${flip ? -1 : 1} 1) rotate(${tilt + Math.sin(f / 9) * 2})`}>
      {speed > 0.2 && [0, 1, 2, 3].map((i) => <path key={i} d={`M${-200 * s - i * 14} ${-150 * s + i * 34 * s} h${-(120 + ((f * 9 + i * 37) % 90)) * s * speed}`} stroke="#fff" strokeOpacity={0.55} strokeWidth={5} strokeLinecap="round" />)}
      <Host x={0} y={215 * s} scale={s} keys={[{ at: 0, arm, expr }]} talking={talking} staffMode="ride" legs="sit" />
    </g>
  );
};
/** A rider that arrives from off-screen (top-left) and then hovers at (x, y). g = group frame. */
export const FlyIn: React.FC<{ g: number; x: number; y: number; s?: number; arm?: string; expr?: string; talking?: [number, number][]; len?: number }> = ({ g, x, y, s = 0.42, arm, expr, talking, len = 46 }) => {
  const p = interpolate(g, [0, len], [0, 1], Easing.out);
  return <Rider x={-260 + (x + 260) * p} y={90 + (y - 90) * p} s={s} speed={g < len ? 1 : 0.1} tilt={g < len ? -12 : -5} arm={arm} expr={expr} talking={talking} />;
};

/** Paper card with centred text (SVG). */
export const Card: React.FC<{ x: number; y: number; text: string; k?: number; rot?: number; bg?: string; c?: string; size?: number; stroke?: string }> = ({ x, y, text, k = 1, rot = 0, bg = PAPER, c = INK, size = 38, stroke = OL }) => k > 0 ? (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
    <rect x={-(text.length * size * 0.33 + 34)} y={-size * 0.95} width={text.length * size * 0.66 + 68} height={size * 1.7} rx={12} fill={bg} stroke={stroke} strokeWidth={5} />
    <text y={size * 0.36} textAnchor="middle" fontFamily="TagBold" fontSize={size} fill={c}>{text}</text>
  </g>) : null;

/** California's outline, centred on (x, y) and `h` px tall. */
export const CaShape: React.FC<{ x: number; y: number; h: number; fill?: string; stroke?: string; sw?: number; id?: string }> = ({ x, y, h, fill = '#F6C88D', stroke = OL, sw = 5 }) => {
  const k = h / 50.7;
  return <path d={CA_D} transform={`translate(${x} ${y}) scale(${k}) translate(-324 -281.3)`} fill={fill} stroke={stroke} strokeWidth={sw / k} strokeLinejoin="round" />;
};
export const caTransform = (x: number, y: number, h: number) => `translate(${x} ${y}) scale(${h / 50.7}) translate(-324 -281.3)`;

/** The world with coastlines only (no modern borders): for scenes set before today's countries existed. */
export const OldWorld: React.FC<{ cam: Cam; land?: string; sea?: string; ca?: string | null; children?: React.ReactNode }> = ({ cam, land = '#EFE3C4', sea = SEA, ca = '#F3B562', children }) => (
  <WorldMap data={D} cam={cam} sea={sea} stroke={OL} sw={3.2} fill={() => land}>
    {D.countries.map((c, i) => <path key={'o' + i} d={c.d} fill={land} stroke={land} strokeWidth={1.6} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />)}
    {ca && <path d={CA_D} fill={ca} stroke={QC.ink} strokeWidth={2.2 / cam.z} strokeLinejoin="round" />}
    {children}
  </WorldMap>
);

// ------------------------------------------------------------------ small icons (drawn in a ~120 px box around 0,0)
export const Jeans: React.FC = () => (
  <g>
    <path d="M-36 -52 h72 l10 104 h-32 l-14 -66 l-14 66 h-32 Z" fill="#3F6FB5" stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-37} y={-54} width={74} height={14} rx={3} fill="#345C99" stroke={OL} strokeWidth={3.5} />
    <path d="M-30 -30 q10 12 22 0 M8 -30 q10 12 22 0" stroke="#E2B13C" strokeWidth={2.5} fill="none" />
    {[-28, -8, 8, 28].map((x) => <circle key={x} cx={x} cy={-31} r={2.6} fill="#E2B13C" />)}
  </g>
);
export const Phone: React.FC = () => (
  <g>
    <rect x={-30} y={-54} width={60} height={108} rx={11} fill="#2B2B33" stroke={OL} strokeWidth={4} />
    <rect x={-24} y={-44} width={48} height={82} rx={4} fill="#9ED0F0" />
    <circle cy={46} r={4} fill="#8A8A90" />
    <path d="M-14 -22 h28 M-14 -8 h20 M-14 6 h24" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
  </g>
);
export const PlayApp: React.FC = () => (
  <g>
    <rect x={-48} y={-48} width={96} height={96} rx={22} fill="#1F8A8A" stroke={OL} strokeWidth={4} />
    <path d="M-14 -24 L26 0 L-14 24 Z" fill="#fff" stroke={OL} strokeWidth={3} strokeLinejoin="round" />
  </g>
);
export const Clapper: React.FC = () => (
  <g>
    <rect x={-50} y={-18} width={100} height={66} rx={5} fill="#2B2B33" stroke={OL} strokeWidth={4} />
    <g transform="rotate(-14 -50 -22)"><rect x={-50} y={-44} width={100} height={22} rx={4} fill="#F4F4F0" stroke={OL} strokeWidth={4} />{[-36, -12, 12, 36].map((x) => <path key={x} d={`M${x - 8} -44 l12 22`} stroke={OL} strokeWidth={7} />)}</g>
    <path d="M-36 6 h72 M-36 26 h48" stroke="#8A8A90" strokeWidth={4} strokeLinecap="round" />
  </g>
);
export const Almonds: React.FC = () => (
  <g>
    {[[-24, 6, -30], [18, -16, 20], [14, 28, 70]].map(([x, y, r], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}><path d="M0 -34 Q24 -8 12 22 Q0 36 -12 22 Q-24 -8 0 -34 Z" fill="#B67A45" stroke={OL} strokeWidth={3.5} /><path d="M0 -22 Q6 0 0 20" stroke="#8A5A2E" strokeWidth={2.5} fill="none" /></g>)}
  </g>
);
export const IconCard: React.FC<{ x: number; y: number; k: number; hot?: boolean; label: string; children: React.ReactNode }> = ({ x, y, k, hot, label, children }) => k > 0 ? (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <rect x={-74} y={-80} width={148} height={166} rx={14} fill={hot ? '#FFE9A0' : PAPER} stroke={OL} strokeWidth={5} />
    <g transform="translate(0 -14) scale(0.9)">{children}</g>
    <text y={72} textAnchor="middle" fontFamily="TagBold" fontSize={22} fill={INK}>{label}</text>
  </g>) : null;

/** A sailing ship of the 1500s (hull ~260 px long, drawn around its waterline centre). */
export const Galleon: React.FC<{ x: number; y: number; s?: number; flip?: boolean; flag?: string; rot?: number }> = ({ x, y, s = 1, flip, flag = '#C0392B', rot = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y + Math.sin(f / 14) * 4}) rotate(${rot + Math.sin(f / 18) * 1.5}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-130 -34 L-112 22 Q0 40 104 22 L140 -44 L96 -34 L88 -18 L-96 -18 Z" fill="#8A5A34" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
      <path d="M-104 2 Q0 16 112 0" stroke="#6B4A2B" strokeWidth={4} fill="none" />
      {[-56, 14, 74].map((mx, i) => <g key={i}><line x1={mx} y1={-18} x2={mx} y2={-190 + i * 14} stroke="#5A3E26" strokeWidth={6} strokeLinecap="round" /><path d={`M${mx - 44} ${-170 + i * 14} Q${mx + 6} ${-150 + i * 14} ${mx + 44} ${-170 + i * 14} L${mx + 38} ${-70} Q${mx} ${-52} ${mx - 38} ${-70} Z`} fill="#F4ECD8" stroke={OL} strokeWidth={4} strokeLinejoin="round" /></g>)}
      <path d={`M14 -176 l34 ${8 + Math.sin(f / 5) * 4} l-34 12 Z`} fill={flag} stroke={OL} strokeWidth={3} />
    </g>
  );
};

// ------------------------------------------------------------------ the running thread: WHO GOT RICH?
export type BoardRow = { label: string; show: number; mark?: number; ok?: boolean };
/** The board that returns through the film. Rows pop at `show`; a red cross (or a green tick with ok) lands at `mark`. */
export const Board: React.FC<{ x: number; y: number; rows: BoardRow[]; at?: number; w?: number; question?: number }> = ({ x, y, rows, at = 0, w = 380, question = 99999 }) => {
  const f = useCurrentFrame();
  const k = springPop(f, at);
  if (k <= 0) return null;
  const h = 96 + rows.length * 78 + 80;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x={-w / 2} y={0} width={w} height={h} rx={14} fill="#26343A" stroke={OL} strokeWidth={6} />
      <rect x={-w / 2 + 10} y={10} width={w - 20} height={h - 20} rx={8} fill="none" stroke="#8A6A44" strokeWidth={4} />
      <text y={62} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill={GOLD}>WHO GOT RICH?</text>
      {rows.map((r, i) => {
        const a = springPop(f, r.show); if (a <= 0) return null;
        const m = r.mark != null ? springPop(f, r.mark) : 0;
        return (
          <g key={i} transform={`translate(0 ${128 + i * 78})`} opacity={Math.min(1, a)}>
            <text x={-w / 2 + 34} y={10} fontFamily="TagBold" fontSize={r.label.length > 17 ? 24 : 28} fill={m > 0 && !r.ok ? '#9FA9AC' : '#F4ECD8'}>{r.label}</text>
            {m > 0 && !r.ok && <path d="M-16 -16 L16 16 M16 -16 L-16 16" transform={`translate(${w / 2 - 50} 0) scale(${m})`} stroke="#E4573D" strokeWidth={9} strokeLinecap="round" />}
            {m > 0 && r.ok && <path d="M-18 0 L-4 16 L20 -16" transform={`translate(${w / 2 - 50} 0) scale(${m})`} stroke="#7BC67B" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
          </g>
        );
      })}
      <g transform={`translate(0 ${h - 44}) scale(${Math.max(0.001, springPop(f, question))})`}><text y={16} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill={GOLD}>? ? ?</text></g>
    </g>
  );
};
