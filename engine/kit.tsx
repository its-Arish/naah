/**
 * kit.tsx — building blocks every project uses: host shots, riders, gravity drops, pop-ins,
 * title/section/end cards. Import these in projects/<name>/shots.tsx.
 */
import React from 'react';
import { useCurrentFrame, interpolate, Easing, popScale, onTwos, gravityDrop } from './lib/core';
import { CameraRig, Layer } from './fx/Camera';
import { Host, HostKey } from './characters/Host';
import { Chibi } from './characters/Chibi';
import { GreyStage, InsertBg } from './scenes/Backgrounds';
import { OL } from './scenes/Parts';
import { Label, Spotlight } from './fx/Overlays';
import { Horse } from './scenes/India';
import type { Shot } from './types';

export type SP = { s: Shot };
export type ShotMap = Record<string, React.FC<SP>>;

/** Frames during which a character's mouth should flap (while the beat's words reveal). */
export const talk = (s: Shot): [number, number][] => [[6, s.talkEnd ?? 60]];
/** Local frame at which a given word of the beat's narration appears (for syncing actions/sfx). */
export const wordAt = (s: Shot, w: string) => s.words?.find((x) => x.w.replace(/[^\w]/g, '').toLowerCase() === w.toLowerCase().replace(/[^\w]/g, ''))?.at ?? 20;

/** The narrator on the grey stage, with optional props (children), overlay HTML and spotlight. */
export const HostShot: React.FC<{ s: Shot; keys: HostKey[]; children?: React.ReactNode; overlay?: React.ReactNode; spot?: { at: number; text?: string; x?: number; y?: number }; x?: number }> = ({ s, keys, children, overlay, spot, x = 1380 }) => (
  <>
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.035, focus: [x, 500] }}>
      <GreyStage />
      <Layer depth={1}>
        {children}
        <Host x={x} keys={keys} talking={talk(s)} />
      </Layer>
    </CameraRig>
    {spot && <Spotlight {...spot} />}
    {overlay}
  </>
);

/** Shorthand factory: `const Intro = hostShot((s) => [{ at: 0, arm: 'wave', expr: 'smile' }])`. */
export const hostShot = (
  keys: (s: Shot) => HostKey[],
  opts: { x?: number; spot?: (s: Shot) => { at: number; text?: string; x?: number; y?: number }; props?: (s: Shot) => React.ReactNode; overlay?: (s: Shot) => React.ReactNode } = {},
): React.FC<SP> => ({ s }) => <HostShot s={s} keys={keys(s)} x={opts.x} spot={opts.spot?.(s)} overlay={opts.overlay?.(s)}>{opts.props?.(s)}</HostShot>;

/** An SVG group that springs into view at local frame `at`. */
export const PopProp: React.FC<{ at: number; x: number; y: number; s?: number; children: React.ReactNode }> = ({ at, x, y, s = 1, children }) => {
  const f = useCurrentFrame();
  const k = popScale(f, at);
  return k > 0 ? <g transform={`translate(${x} ${y}) scale(${k * s})`}>{children}</g> : null;
};

/** SVG content that falls from height h under gravity, bounces and squashes on landing. */
export const Drop: React.FC<{ at: number; x: number; y: number; h?: number; children: React.ReactNode; e?: number }> = ({ at, x, y, h = 700, children, e = 0.35 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const d = gravityDrop(f, at, { h, g: 2.4, e });
  return <g transform={`translate(${x} ${y + d.y}) scale(${d.sx} ${d.sy})`}>{children}</g>;
};
/** Same as Drop, for HTML overlays (stamps, signs with real text). */
export const DropHtml: React.FC<{ at: number; left: number; top: number; h?: number; children: React.ReactNode }> = ({ at, left, top, h = 700, children }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const d = gravityDrop(f, at, { h, g: 2.4, e: 0.3 });
  return <div style={{ position: 'absolute', left, top: top + d.y, transform: `translate(-50%,-50%) scale(${d.sx}, ${d.sy})`, transformOrigin: 'center bottom' }}>{children}</div>;
};

/** Horse + seated chibi rider (walk / gallop gaits, rider bobs with the horse). */
export const Rider: React.FC<{ x: number; y: number; s?: number; flip?: boolean; gait?: 'idle' | 'walk' | 'gallop'; horse?: string; phase?: number; silhouette?: boolean; rider: any }> = ({ x, y, s = 1, flip, gait = 'idle', horse, phase = 0, silhouette, rider }) => {
  const f = onTwos(useCurrentFrame()) + phase;
  const bob = gait === 'gallop' ? -Math.abs(Math.sin((f * 1.6) / 3)) * 14 * s : gait === 'walk' ? -Math.abs(Math.sin((f * 0.7) / 3)) * 4 * s : 0;
  const body = (
    <g>
      <Horse x={x} y={y} s={s} flip={flip} gait={gait} color={horse} phase={phase} />
      <Chibi {...rider} x={x + (flip ? 6 : -6) * s} y={y - 118 * s + bob} s={(rider.s ?? 0.9) * s} legs="sit" flip={flip} />
    </g>
  );
  return silhouette ? <g filter="url(#sil)">{body}</g> : body;
};

/** Default opening: title writes itself on over a dark vignette (pass your own art as children). */
export const makeOpening = (line1: string, line2: string, art?: React.ReactNode): React.FC<SP> => () => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [8, 60], [1, 0], Easing.inOut);
  const fill = interpolate(f, [45, 70], [0, 1]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06, focus: [960, 540] }}>
        <InsertBg />
        {art && <Layer depth={1}>{art}</Layer>}
      </CameraRig>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <text x={art ? 620 : 960} y={500} textAnchor="middle" fontFamily="Hand" fontSize={128} fill="#fff" fillOpacity={fill} stroke="#141414" strokeWidth={4} strokeDasharray="1600" strokeDashoffset={1600 * draw} style={{ paintOrder: 'stroke' }}>{line1}</text>
        <text x={art ? 620 : 960} y={650} textAnchor="middle" fontFamily="Hand" fontSize={150} fill="#FFD84A" fillOpacity={fill} stroke="#141414" strokeWidth={4} strokeDasharray="1600" strokeDashoffset={1600 * draw} style={{ paintOrder: 'stroke' }}>{line2}</text>
      </svg>
    </>
  );
};

/** Section title card ("Act 3: Title" → small red "Act 3" + big title). */
export const Card: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const [act, ...rest] = (s.title ?? '').split(':');
  const title = rest.join(':').trim() || act;
  const u = interpolate(f, [6, 22], [0, 1], Easing.out);
  const sc = popScale(f, 2);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1 }}>
        <GreyStage />
        <Layer depth={1}>
          <Host x={1640} keys={[{ at: 0, arm: 'idle' }, { at: 6, arm: 'present', expr: 'smile' }]} talking={[]} />
          <path d={`M150 760 L${150 + 1000 * u} 750`} stroke="#B3261E" strokeWidth={8} strokeLinecap="round" />
        </Layer>
      </CameraRig>
      {rest.length > 0 && <div style={{ position: 'absolute', left: 150, top: 250, fontFamily: 'Hand', fontSize: 64, color: '#B3261E', WebkitTextStroke: '2px #B3261E', opacity: u }}>{act}</div>}
      <div style={{ position: 'absolute', left: 150, top: 340, width: 1200, fontFamily: 'Hand', fontSize: title.length > 30 ? 96 : 118, lineHeight: 1.1, color: '#141414', WebkitTextStroke: '3px #141414', transform: `scale(${sc})`, transformOrigin: 'left center' }}>{title}</div>
    </>
  );
};

/** End card with the video title. */
export const makeEnd = (title: string, sub = 'Thanks for watching!'): React.FC<SP> => () => (
  <>
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1 }}>
      <GreyStage />
      <Layer depth={1}><Host x={1420} keys={[{ at: 0, arm: 'wave', expr: 'smile' }]} talking={[]} /></Layer>
    </CameraRig>
    <Label text={title} x={640} y={430} at={4} size={title.length > 24 ? 84 : 110} color="#fff" />
    <Label text={sub} x={640} y={580} at={20} size={70} color="#FFD84A" />
  </>
);

/** Fallback for a shot id with no component yet: shows a visible placeholder so it's caught in stills. */
export const Missing: React.FC<SP & { name: string }> = ({ name }) => (
  <div style={{ position: 'absolute', inset: 0, background: '#B3261E', color: '#fff', fontFamily: 'TagBold', fontSize: 64, padding: 60 }}>MISSING SHOT: {name}</div>
);

export { OL };
