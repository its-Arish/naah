/** YouTube thumbnails for "The Entire History of Alabama": clean, minimalist, QGIS map (Natural Earth states). */
import React from 'react';
import { WorldMap, camAt, toScreen, P } from '@engine/qgis/QgisMap';
import { Host } from '@engine/characters/Host';
import { OL } from '@engine/scenes/Parts';
import { makeOpening, makeEnd, type ShotMap, type SP } from '@engine/kit';
import { D, AL_D } from '../alabama/src/Kit';
import { Rocket, ArchBridge } from '../alabama/src/KitAL';

const GOLD = '#F3B562';
const STATES = D.provinces.USA ?? [];
const CAM = camAt(-84.6, 32.75, 27); // Alabama sits left of centre; the narrator stands right
const at = (lon: number, lat: number) => { const [x, y] = P(lon, lat); return toScreen(CAM, x, y); };
const big = (size: number, color = '#fff', stroke = 14): React.CSSProperties => ({
  fontFamily: 'TagBold', fontSize: size, color, lineHeight: 1, letterSpacing: 2,
  WebkitTextStroke: `${stroke}px #0E141A`, paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,0.35)',
});

const Map: React.FC = () => (
  <WorldMap data={D} cam={CAM} sea="#152331" stroke="#2C3B48" fill={(c) => (c.iso === 'USA' ? '#22303C' : '#1C2833')}>
    {STATES.map((st, i) => st.name === 'Alabama' ? null : <path key={i} d={st.d} fill="#24323F" stroke="#3A4B5A" strokeWidth={1.6} vectorEffect="non-scaling-stroke" />)}
    {[70, 44, 24].map((w, i) => <path key={w} d={AL_D} fill="none" stroke={GOLD} strokeOpacity={[0.08, 0.14, 0.25][i]} strokeWidth={w} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />)}
    <path d={AL_D} fill={GOLD} stroke="#FFE6B8" strokeWidth={4} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
  </WorldMap>
);

const Narrator: React.FC = () => (
  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
    <ellipse cx={1480} cy={1042} rx={150} ry={22} fill="#000" opacity={0.3} />
    <g transform="translate(1910 0) scale(-1 1)"><Host x={430} y={1040} scale={1.15} keys={[{ at: 0, arm: 'point', expr: 'grin' }]} talking={[]} seed="thumb" /></g>
  </svg>
);

// A: rocket + bridge on the glowing state, "BOTH?"
const ThumbA: React.FC<SP> = () => {
  const hv = at(-86.59, 34.73), se = at(-87.02, 32.41);
  return (
    <>
      <Map />
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <g transform={`translate(${hv.x} ${hv.y + 150}) scale(0.4)`}><Rocket /></g>
        <g transform={`translate(${se.x + 20} ${se.y + 30})`}><ArchBridge s={0.24} c="#1B2530" light="#3A4654" /></g>
      </svg>
      <Narrator />
      <div style={{ position: 'absolute', right: 70, top: 60, textAlign: 'right', ...big(170, GOLD, 16) }}>BOTH?</div>
    </>
  );
};

// B: just the glowing state and its name
const ThumbB: React.FC<SP> = () => (
  <>
    <Map />
    <Narrator />
    <div style={{ position: 'absolute', right: 60, top: 70, textAlign: 'right', ...big(150, GOLD, 16) }}>ALABAMA</div>
    <div style={{ position: 'absolute', right: 66, top: 240, textAlign: 'right', ...big(64, '#E9EEF2', 10) }}>THE WHOLE STORY</div>
  </>
);


// ---- split "then vs now" (creator's reference: 1492 | Today | "Oops..."): text only, no characters
const HALF_L = 'polygon(0 0, 958px 0, 958px 1080px, 0 1080px)';
const HALF_R = 'polygon(962px 0, 1920px 0, 1920px 1080px, 962px 1080px)';
const Z = 23;
const camFor = (screenX: number) => camAt(-86.75 - (screenX - 960) / ((1920 / 360) * Z), 32.75 - 40 / ((1920 / 360) * Z), Z);
type Pal = { sea: string; land: string; line: string; al: string; edge: string; vignette: string };
const GRIM: Pal = { sea: '#1F2A36', land: '#5E6268', line: '#8A8F96', al: '#E3242B', edge: '#FFFFFF', vignette: 'rgba(0,0,0,0.55)' };
const BRIGHT: Pal = { sea: '#0F6FD6', land: '#EDE3CB', line: '#FFFFFF', al: '#FFC21A', edge: '#1A1410', vignette: 'rgba(0,30,80,0.35)' };
const Half: React.FC<{ clip: string; sx: number; pal: Pal; icon?: React.ReactNode }> = ({ clip, sx, pal, icon }) => {
  const cam = camFor(sx);
  return (
    <div style={{ position: 'absolute', inset: 0, clipPath: clip }}>
      <WorldMap data={D} cam={cam} sea={pal.sea} stroke={pal.line} fill={() => pal.land}>
        {STATES.map((st, i) => st.name === 'Alabama' ? null : <path key={i} d={st.d} fill={pal.land} stroke={pal.line} strokeOpacity={0.8} strokeWidth={2} vectorEffect="non-scaling-stroke" />)}
        <path d={AL_D} fill={pal.al} stroke={pal.edge} strokeWidth={6} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </WorldMap>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at ${sx}px 480px, rgba(0,0,0,0) 35%, ${pal.vignette} 100%)` }} />
      {icon && <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>{icon}</svg>}
    </div>
  );
};
const box = (x: number, t: string) => (
  <div style={{ position: 'absolute', left: x - 230, width: 460, top: 70, height: 190, background: '#0B0B0B', color: '#fff', fontFamily: 'TagBold', fontSize: 150, lineHeight: '190px', textAlign: 'center' }}>{t}</div>
);
const Split: React.FC<{ icons: boolean; bottom: string }> = ({ icons, bottom }) => {
  const sel = (() => { const cam = camFor(480); const [x, y] = P(-87.02, 32.41); return toScreen(cam, x, y); })();
  const hsv = (() => { const cam = camFor(1440); const [x, y] = P(-86.59, 34.73); return toScreen(cam, x, y); })();
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: '#fff' }} />
      <Half clip={HALF_L} sx={480} pal={GRIM} icon={icons ? <g transform={`translate(${sel.x + 10} ${sel.y + 10})`}><ArchBridge s={0.22} c="#FFFFFF" light="#FFD9D9" /></g> : undefined} />
      <Half clip={HALF_R} sx={1440} pal={BRIGHT} icon={icons ? <g transform={`translate(${hsv.x} ${hsv.y + 230}) scale(0.42)`}><Rocket /></g> : undefined} />
      {box(480, '1965')}
      {box(1440, '1969')}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center', ...big(190, '#FFFFFF', 22) }}>{bottom}</div>
    </>
  );
};
const SplitA: React.FC<SP> = () => <Split icons bottom="Same State?!" />;
const SplitB: React.FC<SP> = () => <Split icons={false} bottom="Same State?!" />;

export const SHOTS: ShotMap = { opening: makeOpening('thumb', ''), thumb_a: ThumbA, thumb_b: ThumbB, split_a: SplitA, split_b: SplitB, end: makeEnd('thumb') };
