/** Texas film kit: Texas outline, the Dial, the CAN'T LOSE banner, the six flags, the Switcher, stage helpers. */
import React from 'react';
import { useCurrentFrame, interpolate, Easing, springPop, popScale } from '@engine/lib/core';
import { gravityDrop } from '@engine/lib/physics';
import { Host } from '@engine/characters/Host';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { GreyStage, InsertBg } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { talk } from '@engine/kit';
import { Teach, type PointAt } from '@engine/moves';
import type { Shot } from '@engine/types';
import raw from './qgis.json';

export const RED = '#C8312B', BLUE = '#2A5FA8', PAPER = '#F4ECD8', INK = '#1A1410', GOLD = '#FFD84A', EMPH = '#B3261E';
export const PURPLE = '#7A5C9E';

// ------------------------------------------------------------------ Texas geometry (QGIS Natural Earth admin-1)
const D = raw as unknown as { provinces: Record<string, { name: string; d: string }[]> };
const tx = D.provinces.USA.find((p) => p.name === 'Texas')!;
export const TX_D = tx.d;
const nums = (TX_D.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
let bx0 = 1e9, by0 = 1e9, bx1 = -1e9, by1 = -1e9;
for (let i = 0; i + 1 < nums.length; i += 2) { bx0 = Math.min(bx0, nums[i]); bx1 = Math.max(bx1, nums[i]); by0 = Math.min(by0, nums[i + 1]); by1 = Math.max(by1, nums[i + 1]); }
export const TX_BOX = { x: bx0, y: by0, w: bx1 - bx0, h: by1 - by0 };
const K = 1920 / 360;
/** lon/lat to a point inside a Texas drawn at (x, y) with width w (top-left of the bounding box). */
export const txXY = (lon: number, lat: number, x: number, y: number, w: number): [number, number] => {
  const k = w / TX_BOX.w; const px = (lon + 180) * K, py = (90 - lat) * K;
  return [x + (px - TX_BOX.x) * k, y + (py - TX_BOX.y) * k];
};
export const txH = (w: number) => (w * TX_BOX.h) / TX_BOX.w;
/** Texas outline drawn into a box: top-left (x, y), width w. */
export const TexasShape: React.FC<{ x: number; y: number; w: number; fill?: string; stroke?: string; sw?: number; dash?: string; opacity?: number; clipId?: string; children?: React.ReactNode }> = ({ x, y, w, fill = PAPER, stroke = OL, sw = 5, dash, opacity = 1, clipId, children }) => {
  const k = w / TX_BOX.w;
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(${-TX_BOX.x} ${-TX_BOX.y})`} opacity={opacity}>
      {clipId && <defs><clipPath id={clipId}><path d={TX_D} /></clipPath></defs>}
      <path d={TX_D} fill={fill} stroke={stroke} strokeWidth={sw / k} strokeLinejoin="round" strokeDasharray={dash} />
      {children && <g clipPath={clipId ? `url(#${clipId})` : undefined}>{children}</g>}
    </g>
  );
};

// ------------------------------------------------------------------ the Dial (Texas-shaped plaque with a red/blue gauge)
/** v: -1 = full red (left), +1 = full blue (right). crack 0..1. */
export const Dial: React.FC<{ x: number; y: number; s?: number; v: number; crack?: number; lock?: number; label?: string }> = ({ x, y, s = 1, v, crack = 0, lock = 0, label }) => {
  const w = 360;
  const h = txH(w);
  const cx = 0, cy = 40, R = 110;
  const ang = v * 70; // degrees from vertical
  const arc = (a0: number, a1: number) => { const p = (a: number) => [cx + R * Math.sin((a * Math.PI) / 180), cy - R * Math.cos((a * Math.PI) / 180)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}`; };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`translate(${-w / 2} ${-h / 2 - 20})`}><TexasShape x={0} y={0} w={w} fill="#EADBB8" sw={8} /></g>
      <path d={arc(-72, -24)} stroke={RED} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d={arc(-22, 22)} stroke={PURPLE} strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.8} />
      <path d={arc(24, 72)} stroke={BLUE} strokeWidth={22} fill="none" strokeLinecap="round" />
      <g transform={`translate(${cx} ${cy}) rotate(${ang})`}>
        <path d="M-7 0 L0 -112 L7 0 Z" fill={INK} />
      </g>
      <circle cx={cx} cy={cy} r={13} fill={INK} />
      {crack > 0 && <path d={`M-150 -60 l40 30 l-12 34 l46 22 ${crack > 0.5 ? 'l30 -40 l44 18 l18 -36' : ''}`} stroke="#fff" strokeWidth={4} fill="none" opacity={Math.min(1, crack * 2)} />}
      {crack > 0 && <path d={`M-150 -60 l40 30 l-12 34 l46 22 ${crack > 0.5 ? 'l30 -40 l44 18 l18 -36' : ''}`} stroke={OL} strokeWidth={2} fill="none" opacity={Math.min(1, crack * 2)} transform="translate(2 2)" />}
      {lock > 0 && (
        <g transform={`translate(0 ${cy + 40}) scale(${lock})`}>
          <path d="M-22 -10 v-20 a22 22 0 0 1 44 0 v20" stroke="#8A8F98" strokeWidth={9} fill="none" />
          <rect x={-32} y={-12} width={64} height={50} rx={8} fill="#C9A227" stroke={OL} strokeWidth={4} />
          <circle cx={0} cy={10} r={6} fill={OL} />
        </g>
      )}
      {label && <text x={0} y={h / 2 + 30} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill={INK}>{label}</text>}
    </g>
  );
};
/** Lever beside the Dial; pull 0..1. */
export const Lever: React.FC<{ x: number; y: number; pull: number }> = ({ x, y, pull }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-26} y={-10} width={52} height={40} rx={8} fill="#6D6A65" stroke={OL} strokeWidth={4} />
    <g transform={`rotate(${-35 + pull * 70})`}>
      <rect x={-6} y={-120} width={12} height={120} fill="#3B3B3B" stroke={OL} strokeWidth={3} />
      <circle cx={0} cy={-124} r={18} fill={RED} stroke={OL} strokeWidth={4} />
    </g>
  </g>
);

// ------------------------------------------------------------------ CAN'T LOSE banner
export const Banner: React.FC<{ x: number; y: number; s?: number; color?: string; crack?: number; fall?: number; text?: string }> = ({ x, y, s = 1, color = BLUE, crack = 0, fall = 0, text = "CAN'T LOSE" }) => {
  const dy = fall * fall * 900, rot = fall * 18;
  return (
    <g transform={`translate(${x} ${y + dy}) rotate(${rot}) scale(${s})`} opacity={1 - Math.max(0, fall - 0.7) / 0.3}>
      <path d="M-330 -70 L-300 -150 M330 -70 L300 -150" stroke={OL} strokeWidth={4} />
      <path d="M-340 -70 H340 V40 L300 70 L260 40 L220 70 L180 40 H-180 L-220 70 L-260 40 L-300 70 L-340 40 Z" fill={color} stroke={OL} strokeWidth={6} strokeLinejoin="round" />
      <text x={0} y={18} textAnchor="middle" fontFamily="TagBold" fontSize={70} fill="#fff" letterSpacing={4}>{text}</text>
      {crack > 0 && <path d={`M-30 -70 L-8 -30 L-34 0 L-4 40 ${crack > 0.6 ? 'L-20 60' : ''}`} stroke={INK} strokeWidth={6} fill="none" opacity={Math.min(1, crack * 1.6)} />}
    </g>
  );
};

// ------------------------------------------------------------------ the six flags (simplified, generic)
export type FlagKind = 'spain' | 'france' | 'mexico' | 'texas' | 'csa' | 'usa';
export const FlagArt: React.FC<{ kind: FlagKind; w?: number; wave?: number }> = ({ kind, w = 150, wave = 0 }) => {
  const h = w * 0.64;
  const id = `fl-${kind}-${Math.round(w)}`;
  const clip = <clipPath id={id}><path d={`M0 0 Q${w / 2} ${-8 * wave} ${w} 0 V${h} Q${w / 2} ${h - 8 * wave} 0 ${h} Z`} /></clipPath>;
  let body: React.ReactNode = null;
  if (kind === 'spain') body = <><rect width={w} height={h} fill="#C60B1E" /><rect y={h / 4} width={w} height={h / 2} fill="#FFC400" /></>;
  if (kind === 'france') body = <><rect width={w} height={h} fill="#F7F3E8" /><g transform={`translate(${w / 2} ${h / 2}) scale(${w / 150})`} fill="#C9A227" stroke={OL} strokeWidth={1.5}><path d="M0 -26 C10 -14 10 -4 0 6 C-10 -4 -10 -14 0 -26Z" /><path d="M-4 0 C-20 -6 -26 4 -16 12 C-10 8 -6 6 -4 4Z" /><path d="M4 0 C20 -6 26 4 16 12 C10 8 6 6 4 4Z" /><rect x={-12} y={8} width={24} height={5} /></g></>;
  if (kind === 'mexico') body = <><rect width={w / 3} height={h} fill="#006847" /><rect x={w / 3} width={w / 3} height={h} fill="#fff" /><rect x={(2 * w) / 3} width={w / 3} height={h} fill="#CE1126" /><circle cx={w / 2} cy={h / 2} r={h * 0.14} fill="#8C6A3E" /></>;
  if (kind === 'texas') body = <><rect width={w / 3} height={h} fill="#002868" /><rect x={w / 3} width={(2 * w) / 3} height={h / 2} fill="#fff" /><rect x={w / 3} y={h / 2} width={(2 * w) / 3} height={h / 2} fill="#BF0A30" /><Star x={w / 6} y={h / 2} r={h * 0.18} fill="#fff" /></>;
  if (kind === 'csa') body = <><rect width={w} height={h} fill="#9A9A9A" /><rect y={h / 3} width={w} height={h / 3} fill="#D8D8D8" /><rect width={w * 0.38} height={(h * 2) / 3} fill="#6E6E6E" />{[0, 1, 2, 3, 4, 5, 6].map((i) => <circle key={i} cx={w * 0.19 + Math.cos((i / 7) * 6.28) * h * 0.2} cy={h * 0.33 + Math.sin((i / 7) * 6.28) * h * 0.2} r={3} fill="#EEE" />)}</>;
  if (kind === 'usa') body = <><rect width={w} height={h} fill="#fff" />{[0, 2, 4, 6, 8, 10, 12].map((i) => <rect key={i} y={(i * h) / 13} width={w} height={h / 13} fill="#B22234" />)}<rect width={w * 0.4} height={(h * 7) / 13} fill="#3C3B6E" /></>;
  return (
    <g>
      <defs>{clip}</defs>
      <g clipPath={`url(#${id})`}>{body}</g>
      <path d={`M0 0 Q${w / 2} ${-8 * wave} ${w} 0 V${h} Q${w / 2} ${h - 8 * wave} 0 ${h} Z`} fill="none" stroke={OL} strokeWidth={4} />
    </g>
  );
};
export const Star: React.FC<{ x: number; y: number; r: number; fill?: string; stroke?: string; rot?: number }> = ({ x, y, r, fill = GOLD, stroke, rot = 0 }) => {
  const pts = [...Array(10)].map((_, i) => { const a = ((i * 36 - 90 + rot) * Math.PI) / 180; const rr = i % 2 ? r * 0.42 : r; return `${x + rr * Math.cos(a)},${y + rr * Math.sin(a)}`; }).join(' ');
  return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={stroke ? 3 : 0} strokeLinejoin="round" />;
};
export const FLAGS: FlagKind[] = ['spain', 'france', 'mexico', 'texas', 'csa', 'usa'];
/** A rail of six poles. raised[i] 0..1 (how far up the pole). */
export const FlagRail: React.FC<{ x: number; y: number; s?: number; raised: number[]; dim?: number[] }> = ({ x, y, s = 1, raised, dim = [] }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-20} y={-6} width={6 * 120 + 30} height={14} rx={6} fill="#7A5A3A" stroke={OL} strokeWidth={4} />
      {FLAGS.map((k, i) => {
        const px = i * 120, up = raised[i] ?? 0;
        return (
          <g key={k} transform={`translate(${px} 0)`}>
            <line x1={0} y1={0} x2={0} y2={-260} stroke="#5B4632" strokeWidth={7} strokeLinecap="round" />
            <circle cx={0} cy={-264} r={7} fill={GOLD} stroke={OL} strokeWidth={2} />
            {up > 0 && <g transform={`translate(4 ${-60 - up * 190})`} opacity={dim[i] ? 0.45 : 1}><FlagArt kind={k} w={96} wave={Math.sin(f / 7 + i) * up} /></g>}
          </g>
        );
      })}
    </g>
  );
};

// ------------------------------------------------------------------ the Switcher (original recurring voter)
export const Switcher: React.FC<{ x: number; y: number; s?: number; walk?: boolean; rosette?: string; coat?: string; flip?: boolean; arms?: 'down' | 'crossed' | 'tip'; phase?: number }> = ({ x, y, s = 1, walk = false, rosette = BLUE, coat = '#3A3F4B', flip, arms = 'down', phase = 0 }) => {
  const f = useCurrentFrame() + phase;
  const sw = walk ? Math.sin(f / 3.2) * 22 : 0;
  const bob = walk ? Math.abs(Math.sin(f / 3.2)) * 6 : 0;
  return (
    <g transform={`translate(${x} ${y - bob}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={bob} rx={60} ry={12} fill="#000" opacity={0.18} />
      <g stroke={OL} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
        <path d={`M-10 -120 L${-10 - sw} -2`} stroke="#2B2B30" strokeWidth={22} />
        <path d={`M10 -120 L${10 + sw} -2`} stroke="#2B2B30" strokeWidth={22} />
        <path d="M-42 -250 Q0 -270 42 -250 L48 -118 H-48 Z" fill={coat} />
        {arms === 'crossed' ? <path d="M-40 -205 L30 -175 M40 -205 L-30 -175" stroke={coat} strokeWidth={22} /> : (
          <>
            <path d={`M-40 -240 L${-52 + sw * 0.6} -150`} stroke={coat} strokeWidth={20} />
            <path d={arms === 'tip' ? 'M40 -240 L70 -300' : `M40 -240 L${52 - sw * 0.6} -150`} stroke={coat} strokeWidth={20} />
          </>
        )}
        <circle cx={0} cy={-300} r={44} fill="#E9C9A6" />
        <path d="M-80 -322 Q0 -300 80 -322 Q60 -332 40 -330 Q38 -380 0 -384 Q-38 -380 -40 -330 Q-60 -332 -80 -322Z" fill="#8B5E3C" transform={arms === 'tip' ? 'translate(30 -24) rotate(14)' : undefined} />
        <circle cx={22} cy={-212} r={13} fill={rosette} strokeWidth={3} />
      </g>
      <circle cx={-14} cy={-302} r={4} fill={INK} /><circle cx={14} cy={-302} r={4} fill={INK} />
      <path d="M-12 -282 Q0 -276 12 -282" stroke={INK} strokeWidth={3} fill="none" />
    </g>
  );
};

// ------------------------------------------------------------------ stage helpers
export type SP = { s: Shot };
export const Stage: React.FC<{ children?: React.ReactNode; zoom?: [number, number]; focus?: [number, number]; dim?: number; shakes?: { at: number; amp: number; len: number }[] }> = ({ children, zoom = [1, 1.035], focus = [1100, 500], dim, shakes }) => (
  <CameraRig move={{ zoomFrom: zoom[0], zoomTo: zoom[1], focus, shakes }}>
    <GreyStage dim={dim} />
    <Layer depth={1}>{children}</Layer>
  </CameraRig>
);
export const Insert: React.FC<{ children?: React.ReactNode; zoom?: [number, number]; focus?: [number, number] }> = ({ children, zoom = [1, 1.04], focus = [960, 460] }) => (
  <CameraRig move={{ zoomFrom: zoom[0], zoomTo: zoom[1], focus }}>
    <InsertBg />
    <Layer depth={1}>{children}</Layer>
  </CameraRig>
);
/** Narrator standing at x (default right of centre). */
export const Narr: React.FC<{ s: Shot; keys: any[]; x?: number; y?: number; scale?: number; flip?: boolean; point?: PointAt[]; [k: string]: any }> = ({ s, keys, x = 1500, y = 1000, scale = 1, flip, point, ...rest }) =>
  point && point.length && !flip && !rest.staffMode ? <Teach x={x} y={y} scale={scale} keys={keys} talking={talk(s)} targets={point} {...rest} />
  : <g transform={flip ? `translate(${2 * x} 0) scale(-1 1)` : undefined}><Host x={x} y={y} scale={scale} keys={keys} talking={talk(s)} {...rest} /></g>;
/** Paper card with handwritten text (SVG). */
export const Tag: React.FC<{ x: number; y: number; text: string; k?: number; size?: number; bg?: string; c?: string; rot?: number; font?: string }> = ({ x, y, text, k = 1, size = 44, bg = PAPER, c = INK, rot = 0, font = 'TagBold' }) => {
  if (k <= 0) return null;
  const w = text.length * size * 0.58 + 60;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.75} rx={14} fill={bg} stroke={OL} strokeWidth={5} />
      <text y={size * 0.34} textAnchor="middle" fontFamily={font} fontSize={size} fill={c}>{text}</text>
    </g>
  );
};
export const pop = springPop;
export const ease = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], Easing.inOut);
export const drop = (f: number, at: number, h = 700) => gravityDrop(f, at, { h, g: 2.4, e: 0.25 });
export { popScale };

/** Narrator riding his staff (from the Russia film). */
export const Rider: React.FC<{ x: number; y: number; s?: number; tilt?: number; speed?: number; arm?: string; expr?: string; talking?: [number, number][]; flip?: boolean }> = ({ x, y, s = 0.6, tilt = -6, speed = 1, arm = 'point', expr = 'grin', talking = [], flip }) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 6) * 10 * s;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${flip ? -1 : 1} 1) rotate(${tilt + Math.sin(f / 9) * 2})`}>
      {speed > 0.2 && [0, 1, 2].map((i) => <path key={i} d={`M${-200 * s - i * 14} ${-150 * s + i * 34 * s} h${-(120 + ((f * 9 + i * 37) % 90)) * s * speed}`} stroke="#fff" strokeOpacity={0.6} strokeWidth={6 * Math.max(0.5, s)} strokeLinecap="round" />)}
      <Host x={0} y={215 * s} scale={s} keys={[{ at: 0, arm, expr }]} talking={talking} staffMode="ride" legs="sit" />
    </g>
  );
};

// ------------------------------------------------------------------ GIS map kit for this film (QGIS world map + US states)
import { WorldMap, camAt, toScreen, P, MapPin, MapTag, type Cam, type QData } from '@engine/qgis/QgisMap';
export { camAt, moveCam, MapPin, MapTag } from '@engine/qgis/QgisMap';
export const QD = raw as unknown as QData;
export const STATES = QD.provinces.USA;
/** Whole of Texas framed, with room for captions below. */
export const CAM_TX = camAt(-99.6, 31.0, 11.5);
/** lon/lat to screen pixels under a camera. */
export const scr = (cam: Cam, lon: number, lat: number) => { const [x, y] = P(lon, lat); return toScreen(cam, x, y); };
/** World map with US state lines and Texas highlighted. `txFill` colours Texas; children draw in world pixels (use P(lon, lat)). */
export const TxMap: React.FC<{ cam: Cam; txFill?: string; txStroke?: string; land?: string; mex?: string; sea?: string; children?: React.ReactNode; overlay?: React.ReactNode; clip?: React.ReactNode }> = ({ cam, txFill = '#F1E6CC', txStroke = OL, land = '#E6DCC4', mex = '#DCD3BC', sea = '#9EC5DB', children, overlay, clip }) => (
  <>
    <WorldMap data={QD} cam={cam} sea={sea} fill={(c) => (c.iso === 'MEX' ? mex : land)}>
      {STATES.filter((st) => st.name !== 'Texas').map((st) => <path key={st.name} d={st.d} fill="none" stroke={OL} strokeOpacity={0.35} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />)}
      <defs><clipPath id="txClipW"><path d={TX_D} /></clipPath></defs>
      <path d={TX_D} fill={txFill} />
      {clip && <g clipPath="url(#txClipW)">{clip}</g>}
      <path d={TX_D} fill="none" stroke={txStroke} strokeWidth={3.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {children}
    </WorldMap>
    {overlay && <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>{overlay}</svg>}
  </>
);
/** The narrator on a map: small, standing at the lower right (above the caption zone), or flying on his staff to a point. */
export const MapNarr: React.FC<{ s: Shot; keys?: any[]; x?: number; y?: number; scale?: number; point?: PointAt[]; [k: string]: any }> = ({ s, keys = [{ at: 0, arm: 'point', expr: 'smile' }], x = 1660, y = 820, scale = 0.5, point, ...rest }) => (
  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
    <ellipse cx={x} cy={y + 4} rx={90 * scale * 2} ry={16 * scale * 2} fill="#000" opacity={0.18} />
    {point && point.length ? <Teach x={x} y={y} scale={scale} keys={keys} talking={talk(s)} targets={point} {...rest} /> : <Host x={x} y={y} scale={scale} keys={keys} talking={talk(s)} {...rest} />}
  </svg>
);
