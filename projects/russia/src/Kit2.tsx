/** Shared helpers for chapters 2–10: dimmed host shots, flags, the Kremlin, sign cards, charts. */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Host } from '@engine/characters/Host';
import { GreyStage, InsertBg } from '@engine/scenes/Backgrounds';
import { OL, Cloud } from '@engine/scenes/Parts';
import { OnionChurch, SnowPine, SNOW } from '@engine/scenes/Russia';
import { talk, wordAt, type SP } from '@engine/kit';
import type { Shot } from '@engine/types';

export const RED = '#B3261E', PAPER = '#F4ECD8', GOLD = '#E2B13C', CREAM = '#F4ECD8';
export const idx = (s: Shot, ids: string[]) => Math.max(0, ids.indexOf(s.id));
/** Local frame of a word, or fallback when the beat doesn't contain it. */
export const at = (s: Shot, w: string, fb = 12) => (s.words?.some((x) => x.w.replace(/[^\w]/g, '').toLowerCase() === w.toLowerCase().replace(/[^\w]/g, '')) ? wordAt(s, w) : fb);

type HK = { at: number; arm?: string; expr?: string };
/** Host on the grey stage with optional dimming and props in the x 900–1200 gap. */
export const HostDim: React.FC<{ s: Shot; keys: HK[]; dim?: number; children?: React.ReactNode; overlay?: React.ReactNode }> = ({ s, keys, dim = 0, children, overlay }) => (
  <>
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.035, focus: [1380, 500] }}>
      <GreyStage dim={dim} />
      <Layer depth={1}>{children}<Host x={1380} keys={keys as any} talking={talk(s)} dim={dim ? dim * 0.6 : undefined} /></Layer>
    </CameraRig>
    {overlay}
  </>
);
export const hostDim = (keys: (s: Shot) => HK[], props?: (s: Shot) => React.ReactNode, dim = 0, overlay?: (s: Shot) => React.ReactNode): React.FC<SP> =>
  ({ s }) => <HostDim s={s} keys={keys(s)} dim={dim} overlay={overlay?.(s)}>{props?.(s)}</HostDim>;

/** An SVG sign card (paper, outline, bold text) that springs in at `t`. */
export const Sign: React.FC<{ t: number; x: number; y: number; text: string; size?: number; color?: string; bg?: string; rot?: number; w?: number; sub?: string }> = ({ t, x, y, text, size = 46, color = '#1A1410', bg = PAPER, rot = 0, w, sub }) => {
  const f = useCurrentFrame();
  const k = springPop(f, t);
  if (k <= 0) return null;
  const width = w ?? Math.max(160, text.length * size * 0.6 + 60);
  const h = size * 1.6 + (sub ? size * 0.8 : 0);
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) rotate(${rot})`}>
      <rect x={-width / 2 + 8} y={-h / 2 + 10} width={width} height={h} rx={14} fill="rgba(0,0,0,0.25)" />
      <rect x={-width / 2} y={-h / 2} width={width} height={h} rx={14} fill={bg} stroke={OL} strokeWidth={6} />
      <text y={sub ? -h / 2 + size * 1.15 : size * 0.36} textAnchor="middle" fontFamily="TagBold" fontSize={size} fill={color}>{text}</text>
      {sub && <text y={h / 2 - size * 0.4} textAnchor="middle" fontFamily="Tag" fontSize={size * 0.55} fill="#5A4A3A">{sub}</text>}
    </g>
  );
};

/** Handwritten label inside SVG. */
export const Hand: React.FC<{ t: number; x: number; y: number; text: string; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end' }> = ({ t, x, y, text, size = 56, color = '#141414', anchor = 'middle' }) => {
  const f = useCurrentFrame();
  const k = springPop(f, t);
  return k > 0 ? <g transform={`translate(${x} ${y}) scale(${k})`}><text textAnchor={anchor} fontFamily="Hand" fontSize={size} fill={color} stroke={color} strokeWidth={1.5}>{text}</text></g> : null;
};

export type FlagKind = 'ussr' | 'ru' | 'pol' | 'jp' | 'white' | 'red' | 'tsar' | 'ukr' | 'fr' | 'eu' | 'nato' | 'un' | 'andrew' | 'uk';
/** Waving flag. Origin = top of pole; flag hangs to the right. */
export const Flag: React.FC<{ kind: FlagKind; x: number; y: number; s?: number; pole?: number; raise?: number }> = ({ kind, x, y, s = 1, pole = 320, raise = 1 }) => {
  const f = useCurrentFrame();
  const w = 240, h = 160;
  const wave = (i: number) => Math.sin(f / 6 + i) * 8;
  const clipId = 'fl' + kind + Math.round(x) + Math.round(y);
  const off = (1 - raise) * (pole - h);
  const stripes = (cs: string[], horiz = true) => cs.map((c, i) => horiz ? <rect key={i} x={0} y={(i * h) / cs.length} width={w} height={h / cs.length + 1} fill={c} /> : <rect key={i} x={(i * w) / cs.length} y={0} width={w / cs.length + 1} height={h} fill={c} />);
  const body = (() => {
    switch (kind) {
      case 'ru': return stripes(['#FFFFFF', '#1C3F94', '#D52B1E']);
      case 'tsar': return stripes(['#1A1A1A', '#F2C230', '#FFFFFF']);
      case 'pol': return stripes(['#FFFFFF', '#DC143C']);
      case 'ukr': return stripes(['#0057B7', '#FFD700']);
      case 'fr': return stripes(['#0055A4', '#FFFFFF', '#EF4135'], false);
      case 'jp': return <><rect width={w} height={h} fill="#fff" /><circle cx={w / 2} cy={h / 2} r={46} fill="#BC002D" /></>;
      case 'white': return <rect width={w} height={h} fill="#F4F4F0" />;
      case 'andrew': return <><rect width={w} height={h} fill="#fff" /><path d={`M0 0 L${w} ${h} M${w} 0 L0 ${h}`} stroke="#1C3F94" strokeWidth={30} /></>;
      case 'uk': return <><rect width={w} height={h} fill="#012169" /><path d={`M0 0 L${w} ${h} M${w} 0 L0 ${h}`} stroke="#fff" strokeWidth={30} /><path d={`M0 0 L${w} ${h} M${w} 0 L0 ${h}`} stroke="#C8102E" strokeWidth={10} /><path d={`M${w / 2} 0 V${h} M0 ${h / 2} H${w}`} stroke="#fff" strokeWidth={46} /><path d={`M${w / 2} 0 V${h} M0 ${h / 2} H${w}`} stroke="#C8102E" strokeWidth={26} /></>;
      case 'red': return <rect width={w} height={h} fill="#C8102E" />;
      case 'eu': return <><rect width={w} height={h} fill="#003399" />{[...Array(12)].map((_, i) => <circle key={i} cx={w / 2 + Math.cos((i / 12) * Math.PI * 2) * 50} cy={h / 2 + Math.sin((i / 12) * Math.PI * 2) * 50} r={7} fill="#FFCC00" />)}</>;
      case 'nato': return <><rect width={w} height={h} fill="#1F3A6A" /><path d={`M${w / 2} 30 L${w / 2 + 14} ${h / 2 - 14} L${w / 2 + 54} ${h / 2} L${w / 2 + 14} ${h / 2 + 14} L${w / 2} ${h - 30} L${w / 2 - 14} ${h / 2 + 14} L${w / 2 - 54} ${h / 2} L${w / 2 - 14} ${h / 2 - 14} Z`} fill="#fff" /></>;
      case 'un': return <><rect width={w} height={h} fill="#5B92E5" /><circle cx={w / 2} cy={h / 2} r={40} fill="none" stroke="#fff" strokeWidth={6} /><path d={`M${w / 2 - 40} ${h / 2} H${w / 2 + 40} M${w / 2} ${h / 2 - 40} V${h / 2 + 40}`} stroke="#fff" strokeWidth={4} /></>;
      default: return <><rect width={w} height={h} fill="#C8102E" />
        <g transform="translate(46 34) scale(0.9)" fill="#FFD700"><path d="M10 0 l3 9 h9 l-7 6 l3 9 l-8 -6 l-8 6 l3 -9 l-7 -6 h9 Z" />
          <path d="M6 38 q20 30 46 4 l-6 -4 q-16 18 -32 -4 Z" /><path d="M14 64 l30 -30 l6 6 l-30 30 Z" /></g></>;
    }
  })();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-7} y={-10} width={14} height={pole + 10} fill="#8A8A90" stroke={OL} strokeWidth={4} />
      <circle cx={0} cy={-14} r={11} fill={GOLD} stroke={OL} strokeWidth={4} />
      <g transform={`translate(7 ${off})`}>
        <clipPath id={clipId}><path d={`M0 0 Q${w / 3} ${wave(0)} ${(2 * w) / 3} ${wave(1)} T${w} ${wave(2)} V${h + wave(2)} Q${(2 * w) / 3} ${h + wave(1)} ${w / 3} ${h + wave(0)} T0 ${h} Z`} /></clipPath>
        <g clipPath={`url(#${clipId})`}>{body}</g>
        <path d={`M0 0 Q${w / 3} ${wave(0)} ${(2 * w) / 3} ${wave(1)} T${w} ${wave(2)} V${h + wave(2)} Q${(2 * w) / 3} ${h + wave(1)} ${w / 3} ${h + wave(0)} T0 ${h} Z`} fill="none" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
      </g>
    </g>
  );
};

/** Kremlin wall with towers and a domed cathedral behind. Origin is the frame; wall top at y. */
export const Kremlin: React.FC<{ y?: number; night?: boolean; winter?: boolean; flag?: FlagKind | null; flagRaise?: number; dark?: boolean }> = ({ y = 520, night, winter, flag = null, flagRaise = 1, dark }) => {
  const f = useCurrentFrame();
  const wall = dark ? '#5A2A26' : '#A8382E';
  return (
    <>
      <Layer depth={0}>
        <rect x={-300} y={-300} width={2600} height={1700} fill={night ? 'url(#skyNight)' : winter ? 'url(#skyWinter)' : 'url(#skyDay)'} />
        {!night && !winter && <><Cloud x={300} y={140} /><Cloud x={1500} y={100} s={0.8} /></>}
        {night && [...Array(30)].map((_, i) => <circle key={i} cx={random('ks' + i) * 1920} cy={random('kt' + i) * 380} r={2 + random('kr' + i) * 2} fill="#fff" opacity={0.5 + 0.5 * Math.sin(f / 20 + i)} />)}
      </Layer>
      <Layer depth={0.4}>
        <OnionChurch x={760} y={y + 10} s={0.62} dome={night ? '#B89A4A' : GOLD} />
        <g transform={`translate(1160 ${y + 10})`}>
          <rect x={-160} y={-220} width={320} height={220} fill={night ? '#CFC6B4' : '#EFE6D0'} stroke={OL} strokeWidth={5} />
          <path d="M-170 -220 L0 -300 L170 -220 Z" fill="#5E7A5A" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
          {[...Array(5)].map((_, i) => <rect key={i} x={-130 + i * 56} y={-170} width={30} height={60} fill={night ? '#F2C230' : '#6A7A8A'} stroke={OL} strokeWidth={3} />)}
          {flag && <Flag kind={flag} x={0} y={-560} s={0.8} pole={300} raise={flagRaise} />}
        </g>
      </Layer>
      <Layer depth={0.7}>
        <rect x={-300} y={y} width={2600} height={260} fill={wall} stroke={OL} strokeWidth={5} />
        {[...Array(40)].map((_, i) => <path key={i} d={`M${-280 + i * 66} ${y} v-26 l14 -12 l14 12 v26 Z`} fill={wall} stroke={OL} strokeWidth={4} strokeLinejoin="round" />)}
        {[200, 1720].map((x) => <g key={x} transform={`translate(${x} ${y})`}>
          <rect x={-70} y={-200} width={140} height={460} fill={wall} stroke={OL} strokeWidth={5} />
          <path d="M-80 -200 L0 -380 L80 -200 Z" fill="#3E6A4A" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
          <path d="M0 -380 l-14 -24 l14 -24 l14 24 Z" fill="#C0392B" stroke={OL} strokeWidth={3} />
          <rect x={-22} y={-140} width={44} height={60} rx={20} fill="#2A1B12" />
        </g>)}
        <path d={`M-300 ${y + 260} L2300 ${y + 260} L2300 1500 L-300 1500 Z`} fill={winter ? SNOW : night ? '#4A4A52' : '#9A948A'} stroke={OL} strokeWidth={3} />
      </Layer>
      {night && <Layer depth={1.3}><rect x={-300} y={-300} width={2600} height={1700} fill="#0A0E1E" opacity={0.25} /></Layer>}
    </>
  );
};

/** Line chart drawn over time on the insert background. pts in data units. */
export const LineChart: React.FC<{ pts: [number, number][]; xr: [number, number]; yr: [number, number]; p: number; box?: [number, number, number, number]; color?: string; dash?: boolean; width?: number }> = ({ pts, xr, yr, p, box = [380, 240, 1540, 760], color = '#FF6B5A', dash, width = 12 }) => {
  const [x0, y0, x1, y1] = box;
  const X = (v: number) => x0 + ((v - xr[0]) / (xr[1] - xr[0])) * (x1 - x0);
  const Y = (v: number) => y1 - ((v - yr[0]) / (yr[1] - yr[0])) * (y1 - y0);
  const n = Math.max(2, Math.ceil(p * pts.length));
  const seg = pts.slice(0, n);
  return <path d={'M' + seg.map(([a, b]) => `${X(a)} ${Y(b)}`).join(' L')} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash ? '22 16' : undefined} />;
};
export const chartXY = (box: [number, number, number, number], xr: [number, number], yr: [number, number]) => ({
  X: (v: number) => box[0] + ((v - xr[0]) / (xr[1] - xr[0])) * (box[2] - box[0]),
  Y: (v: number) => box[3] - ((v - yr[0]) / (yr[1] - yr[0])) * (box[3] - box[1]),
});
export const Axes: React.FC<{ box?: [number, number, number, number]; xl?: [number, string][]; yl?: [number, string][]; xr: [number, number]; yr: [number, number] }> = ({ box = [380, 240, 1540, 760], xl = [], yl = [], xr, yr }) => {
  const { X, Y } = chartXY(box, xr, yr);
  return <g>
    <path d={`M${box[0]} ${box[1] - 20} V${box[3]} H${box[2] + 20}`} stroke={CREAM} strokeWidth={6} fill="none" />
    {xl.map(([v, t]) => <text key={t} x={X(v)} y={box[3] + 46} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill={CREAM}>{t}</text>)}
    {yl.map(([v, t]) => <text key={t} x={box[0] - 20} y={Y(v) + 10} textAnchor="end" fontFamily="TagBold" fontSize={30} fill={CREAM}>{t}</text>)}
  </g>;
};

/** Candle (for remembrance beats); `out` = frame it goes out. */
export const Candle: React.FC<{ x: number; y: number; s?: number; out?: number; seed?: string }> = ({ x, y, s = 1, out = 1e9, seed = 'cd' }) => {
  const f = useCurrentFrame();
  const lit = f < out;
  const fl = Math.sin(f / 3 + random(seed) * 9) * 3;
  const smoke = f - out;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {lit && <circle cx={0} cy={-150} r={70} fill="url(#warmGlow)" opacity={0.7} />}
      <rect x={-22} y={-110} width={44} height={110} rx={6} fill="#F1E6D0" stroke={OL} strokeWidth={4} />
      <path d="M0 -110 V-126" stroke={OL} strokeWidth={3} />
      {lit && <path d={`M0 ${-162 + fl} Q14 -138 0 -124 Q-14 -138 0 ${-162 + fl} Z`} fill="#FFC23A" stroke="#E8862A" strokeWidth={3} />}
      {!lit && smoke < 50 && <path d={`M0 -128 q${10} -20 0 -40 q-10 -20 0 -40`} stroke="#9A9A9A" strokeWidth={4} fill="none" opacity={1 - smoke / 50} transform={`translate(0 ${-smoke * 0.6})`} />}
    </g>
  );
};

/** Plain dark insert with a slow drift; children are SVG. */
export const Insert: React.FC<{ glow?: boolean; zoom?: [number, number]; children: React.ReactNode; overlay?: React.ReactNode }> = ({ glow = true, zoom = [1, 1.03], children, overlay }) => (
  <>
    <CameraRig move={{ zoomFrom: zoom[0], zoomTo: zoom[1] }}><InsertBg glow={glow} /><Layer depth={1}>{children}</Layer></CameraRig>
    {overlay}
  </>
);

/** Little person icon for charts (head + body). */
export const Person: React.FC<{ x: number; y: number; s?: number; c?: string; o?: number }> = ({ x, y, s = 1, c = CREAM, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}><circle cy={-62} r={18} fill={c} stroke={OL} strokeWidth={3} /><path d="M-24 0 V-26 Q-24 -42 0 -42 Q24 -42 24 -26 V0 Z" fill={c} stroke={OL} strokeWidth={3} /></g>
);

/** Snowy steppe road receding to the horizon. */
export const SnowRoad: React.FC<{ dusk?: boolean; ground?: number }> = ({ dusk, ground = 640 }) => (
  <>
    <Layer depth={0}><rect x={-300} y={-300} width={2600} height={1700} fill={dusk ? 'url(#skyDawn)' : 'url(#skyWinter)'} /></Layer>
    <Layer depth={0.3}>{[...Array(24)].map((_, i) => <SnowPine key={i} x={-200 + i * 100} y={ground + (i % 3) * 4} s={0.38} c="#3E5E52" />)}</Layer>
    <Layer depth={0.6}>
      <path d={`M-300 ${ground} L2300 ${ground} L2300 1500 L-300 1500 Z`} fill={SNOW} stroke={OL} strokeWidth={3} />
      <path d={`M900 ${ground} L1020 ${ground} L1500 1300 L420 1300 Z`} fill="#B8B0A4" stroke={OL} strokeWidth={4} />
      <path d={`M960 ${ground + 10} L960 1300`} stroke="#F4F4F0" strokeWidth={8} strokeDasharray="40 50" />
    </Layer>
  </>
);

export { useCurrentFrame, useDuration, interpolate, Easing, springPop };
