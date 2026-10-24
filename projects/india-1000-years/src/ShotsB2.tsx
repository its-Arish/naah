// Acts 5–7: Vijayanagara, Babur & Akbar, the Taj and Aurangzeb.
import React from 'react';
import { useCurrentFrame, interpolate, Easing, popScale, onTwos, random, gravityDrop, projectile, spring } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { HostKey } from '@engine/characters/Host';
import { Chibi, Outfit } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL, Cloud } from '@engine/scenes/Parts';
import { Label } from '@engine/fx/Overlays';
import { Horse, Camel, Elephant, Passes, Plain, Tent, TentInterior, SomnathCoast, Tally, CoinBurst, subPath, KingdomMap } from '@engine/scenes/India';
import { SultanCourt, Boulders, HotRoad, Study } from '@engine/scenes/IndiaB1';
import { HampiStreet, StoneChariot, PanipatDiagram, Diary, TajMahal, TajGarden, AgraWindow, MughalMap, TreasuryBar, PeacockThrone, HillForts, FamilyTree, DebateHall } from '@engine/scenes/IndiaB2';
import { SP, talk, wordAt, Rider, HostShot, Drop, DropHtml, RAJPUT } from './ShotsIndia';
import type { Shot } from '@engine/types';

const W = (s: Shot, w: string) => wordAt(s, w);
const COLS = ['#C0392B', '#2E86C1', '#D4A017', '#8E44AD', '#16A085', '#E8862A', '#6E5A48', '#C07A9C'];
const CIV = (c: string, b = '#E8DCC0'): Outfit => ({ top: c, bottom: b });
const H = (keys: (s: Shot) => HostKey[], opts: { x?: number; spot?: (s: Shot) => { at: number; text?: string; x?: number; y?: number }; kids?: (s: Shot) => React.ReactNode; overlay?: (s: Shot) => React.ReactNode } = {}): React.FC<SP> => ({ s }) => (
  <HostShot s={s} keys={keys(s)} x={opts.x} spot={opts.spot?.(s)} overlay={opts.overlay?.(s)}>{opts.kids?.(s)}</HostShot>
);
const PopProp: React.FC<{ at: number; x: number; y: number; s?: number; children: React.ReactNode }> = ({ at, x, y, s = 1, children }) => {
  const f = useCurrentFrame();
  const k = popScale(f, at);
  return k > 0 ? <g transform={`translate(${x} ${y}) scale(${k * s})`}>{children}</g> : null;
};
const Seat: React.FC<{ x?: number }> = ({ x = 560 }) => (
  <g transform={`translate(${x} 800)`}>
    <rect x={-160} y={-70} width={320} height={70} rx={10} fill="#C9962C" stroke={OL} strokeWidth={3.5} />
    <rect x={-130} y={-230} width={260} height={170} rx={30} fill="#2E6B4A" stroke={OL} strokeWidth={3.5} />
  </g>
);

// ------------------------------------------------------------- cast
const VIJAYA_KING: Outfit = { top: '#C9962C', bottom: '#F1E6D0', belt: '#B3261E', sash: '#B3261E' };
const RAZZAQ: Outfit = { top: '#2E5E8C', robe: true, trim: '#E2B13C' };
const PAES: Outfit = { top: '#1E1E28', bottom: '#4A3A2A', belt: '#C9962C', cape: '#7A1F2B' };
const BABUR: Outfit = { top: '#3E6B3A', bottom: '#4A3A2A', belt: '#C9962C', cape: '#5A3E26' };
const LODI: Outfit = { top: '#7A2A22', robe: true, trim: '#E2B13C' };
const HUMAYUN: Outfit = { top: '#5A3E8A', robe: true, trim: '#E2B13C' };
const AKBAR: Outfit = { top: '#F1E6D0', robe: true, trim: '#C9962C', belt: '#B3261E' };
const SHAHJAHAN: Outfit = { top: '#E8862A', robe: true, trim: '#E2B13C', belt: '#2E6B4A' };
const MUMTAZ: Outfit = { top: '#B3261E', robe: true, trim: '#E2B13C' };
const AURANG: Outfit = { top: '#E8E2D6', robe: true, trim: '#8A8178' };
const MARATHA: Outfit = { top: '#F1E6D0', bottom: '#E8862A', belt: '#E8862A', sash: '#B3261E' };
const MUGHAL_SOLDIER: Outfit = { top: '#2E6B4A', bottom: '#3A2A1E', belt: '#C9962C' };
const COURTIER: Outfit = { top: '#C9962C', robe: true, trim: '#7A2A22' };
const BabChibi = (p: any) => <Chibi outfit={BABUR} hat="mongol" hatColor="#3E6B3A" mustache {...p} />;
const Aurang = (p: any) => <Chibi outfit={AURANG} hat="skullcap" beard beardColor="#F4F7FA" {...p} />;

// =============================================================== ACT 5
const Vijaya: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06 }}>
      <Boulders sun />
      <Layer depth={1}><Chibi x={960} y={950} s={1.15} outfit={VIJAYA_KING} hat="crown" mustache item="banner" pose="raise" expr="proud" seed="vk" /></Layer>
    </CameraRig>
    <Label text="Vijayanagara" x={960} y={110} at={W(s, 'vijayanagara,')} size={80} color="#FFD84A" />
  </>
);
const Hampi: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.15, zoomTo: 1.0, focus: [960, 500] }}><Boulders sun /></CameraRig>
    <Label text="Hampi" x={960} y={110} at={W(s, 'hampi.')} size={80} color="#FFD84A" />
  </>
);
const Descriptions = H(() => [{ at: 0, arm: 'present', expr: 'smile' }, { at: 40, arm: 'finger' }], { kids: () => <PopProp at={20} x={1730} y={560}><g><rect x={-130} y={-170} width={260} height={340} rx={6} fill="#F1E2C0" stroke={OL} strokeWidth={5} />{[...Array(6)].map((_, i) => <path key={i} d={`M-100 ${-120 + i * 46} H100`} stroke="#B5AA90" strokeWidth={5} />)}</g></PopProp> });
const Descriptions2 = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'real.'), arm: 'shrug', expr: 'grin' }]);
const Razzaq: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
      <HampiStreet />
      <Layer depth={1}><Rider x={interpolate(useCurrentFrame(), [0, s.dur], [300, 760], Easing.out)} y={960} s={0.95} gait="walk" horse="#F4F7FA" rider={{ outfit: RAZZAQ, hat: 'turbanW', beard: true, pose: 'wave', expr: 'happy', seed: 'raz' }} /></Layer>
    </CameraRig>
    <Label text="Abdur Razzaq (Persian ambassador)" x={960} y={110} at={W(s, 'abdur')} size={56} color="#FFD84A" />
  </>
);
const Razzaq2: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.04, zoomTo: 1.12, focus: [960, 600] }}>
    <HampiStreet />
    <Layer depth={1}><Chibi x={960} y={960} s={1.15} outfit={RAZZAQ} hat="turbanW" beard pose={[{ at: 0, pose: 'idle' }, { at: 20, pose: 'bothUp' }]} expr={[{ at: 0, expr: 'normal' }, { at: 20, expr: 'shock' }]} seed="raz2" /></Layer>
  </CameraRig>
);
const Gems: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const g: [string, string, string][] = [['pearls', 'pearls,', '#F4F7FA'], ['rubies', 'rubies,', '#C0392B'], ['emeralds', 'emeralds', '#2E9A4A'], ['diamonds', 'diamonds', '#E8F4FF']];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.2, focus: [960, 820] }}><HampiStreet /></CameraRig>
      {g.map(([t, w, c], i) => <div key={t} style={{ position: 'absolute', left: 300 + i * 440, top: 220, transform: `translate(-50%,-50%) scale(${popScale(f, W(s, w))})`, textAlign: 'center' }}><div style={{ width: 70, height: 70, margin: '0 auto', background: c, border: '5px solid #141414', transform: 'rotate(45deg)' }} /><div style={{ fontFamily: 'Hand', fontSize: 54, color: '#fff', WebkitTextStroke: '8px #000', paintOrder: 'stroke fill', marginTop: 20 }}>{t}</div></div>)}
    </>
  );
};
const Gems2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
      <HampiStreet />
      <Layer depth={1}>
        <Chibi x={700} y={950} s={1.0} outfit={CIV('#E8862A')} hat="pagri" hatColor="#C0392B" mustache item="sack" pose="present" expr="happy" seed="gv" />
        <Chibi x={1240} y={950} s={1.0} outfit={CIV('#2E86C1')} hat="veil" hatColor="#C07A9C" pose={[{ at: 0, pose: 'idle' }, { at: 30, pose: 'point' }]} expr="happy" seed="gb" flip />
        {/* a diamond tossed on the scale like an onion */}
        {f > 20 && (() => { const p = projectile(f, 20, [760, 760], [9, -12], 1.0); return p.y < 960 ? <path transform={`translate(${p.x} ${p.y}) rotate(${(f - 20) * 15})`} d="M0 -18 l14 18 l-14 18 l-14 -18 Z" fill="#E8F4FF" stroke={OL} strokeWidth={3} /> : null; })()}
      </Layer>
    </CameraRig>
  );
};
const Paes: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
      <HampiStreet />
      <Layer depth={1}><Chibi x={interpolate(useCurrentFrame(), [0, s.dur], [400, 820])} y={950} s={1.05} outfit={PAES} hat="europe" beard legs="walk" item="notebook" pose="scribble" expr="happy" seed="paes" /></Layer>
    </CameraRig>
    <Label text="Domingo Paes (Portuguese visitor)" x={960} y={110} at={W(s, 'domingo')} size={56} color="#FFD84A" />
  </>
);
const Roses: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.1, focus: [960, 860] }}>
      <HampiStreet />
      <Layer depth={1}>
        {[0, 1, 2, 3].map((i) => <Chibi key={i} x={360 + i * 400} y={960} s={0.9} outfit={CIV(COLS[i])} hat={i % 2 ? 'veil' : 'pagri'} hatColor={COLS[i + 2]} mustache={i % 2 === 0} pose={[{ at: 0, pose: 'present' }, { at: 30 + i * 6, pose: 'cheer' }]} expr="happy" seed={'rs' + i} />)}
        {[...Array(8)].map((_, i) => { const p = projectile(f, 20 + i * 5, [960, 800], [(i - 3.5) * 4, -16], 1.0); return f > 20 + i * 5 && p.y < 1000 ? <circle key={i} cx={p.x} cy={p.y} r={14} fill="#D1342E" stroke={OL} strokeWidth={2} /> : null; })}
      </Layer>
    </CameraRig>
  );
};
const Roses2 = H((s) => [{ at: 0, arm: 'present', expr: 'smile' }, { at: W(s, 'basic'), arm: 'shrug', expr: 'grin' }], { kids: () => <g>{[...Array(5)].map((_, i) => <PopProp key={i} at={6 + i * 8} x={1580 + (i % 3) * 110} y={620 + Math.floor(i / 3) * 110}><g><circle r={34} fill="#D1342E" stroke={OL} strokeWidth={4} /><path d="M-10 -6 q10 -14 20 0 q-10 14 -20 0" stroke="#8C1D18" strokeWidth={4} fill="none" /><path d="M0 34 V90" stroke="#3C7030" strokeWidth={6} /></g></PopProp>)}</g> });
const Trade: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const items: [string, string, string][] = [['cotton', 'cotton,', '#F4F7FA'], ['spices', 'spices', '#C0632B'], ['iron', 'iron,', '#7A7F8C']];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><InsertBg /><Layer depth={1}>
        {items.map(([t, w, c], i) => <PopProp key={t} at={W(s, w)} x={500 + i * 460} y={520}><g><path d="M-110 90 Q-130 -40 -50 -90 L-60 -120 L60 -120 L50 -90 Q130 -40 110 90 Z" fill="#C9A47A" stroke={OL} strokeWidth={5} /><circle cy={10} r={50} fill={c} stroke={OL} strokeWidth={4} /></g></PopProp>)}
      </Layer></CameraRig>
      {items.map(([t, w], i) => <Label key={t} text={t} x={500 + i * 460} y={760} at={W(s, w)} size={60} />)}
      <Label text="EXPORTS →" x={960} y={140} at={4} size={60} color="#FFD84A" />
    </>
  );
};
const Horses: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
        <SomnathCoast />
        <Layer depth={0.5}>
          <g transform={`translate(${interpolate(f, [0, 40], [2100, 1500], Easing.out)} 640)`}>
            <path d="M-260 0 L260 0 Q220 70 0 76 Q-220 70 -260 0 Z" fill="#8C5A2A" stroke={OL} strokeWidth={4} />
            <path d="M0 0 V-300" stroke="#5A3E26" strokeWidth={10} />
            <path d="M6 -290 Q140 -200 6 -60 Z" fill="#F4EEDD" stroke={OL} strokeWidth={4} />
          </g>
        </Layer>
        <Layer depth={1}>{[0, 1, 2, 3, 4].map((i) => <Horse key={i} x={interpolate(f, [20, s.dur], [1400, 300]) + i * 160} y={970 - (i % 2) * 20} s={0.7} flip gait="gallop" phase={i * 4} color={['#8A5A3A', '#F4F7FA', '#3A2A22', '#C9A06A', '#5A4636'][i]} saddle={false} />)}</Layer>
      </CameraRig>
      <Tally text="WARHORSES FROM ARABIA" bump={99} />
    </>
  );
};
const CityBars: React.FC<{ s: Shot; highlight?: boolean }> = ({ s, highlight }) => {
  const f = useCurrentFrame();
  const bars: [string, number, string][] = [['Beijing', 0.67, '#9DB4C0'], ['Vijayanagara', 0.5, '#E8862A'], ['Cairo', 0.4, '#9DB4C0'], ['Paris', 0.19, '#9DB4C0']];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.02 }}>
        <InsertBg glow={false} />
        <Layer depth={1}>
          <path d="M360 880 H1560" stroke="#F4EEDD" strokeWidth={6} />
          {bars.map(([n, v, c], i) => {
            const h = spring(Math.max(0, f - 6 - i * 5), { damping: 12, stiffness: 90 }) * v * 900;
            return <g key={n}><rect x={420 + i * 280} y={880 - h} width={170} height={h} fill={c} stroke={OL} strokeWidth={5} opacity={highlight && i !== 0 && i !== 1 ? 0.4 : 1} /></g>;
          })}
        </Layer>
      </CameraRig>
      {bars.map(([n], i) => <div key={n} style={{ position: 'absolute', left: 505 + i * 280, top: 920, transform: 'translateX(-50%)', fontFamily: 'Hand', fontSize: 40, color: '#fff' }}>{n}</div>)}
      <div style={{ position: 'absolute', left: 1600, top: 120, fontFamily: 'Hand', fontSize: 40, color: '#D8D2C2', textAlign: 'right', transform: 'translateX(-100%)' }}>c. 1500, rough estimates</div>
    </>
  );
};
const BigCity: React.FC<SP> = ({ s }) => <CityBars s={s} />;
const Beijing: React.FC<SP> = ({ s }) => <CityBars s={s} highlight />;
const Neighbours = H(() => [{ at: 0, arm: 'present' }, { at: 30, arm: 'point', expr: 'grin' }], { kids: () => <g>{[0, 1, 2].map((i) => <PopProp key={i} at={10 + i * 8} x={1600 + i * 110} y={760}><Chibi x={0} y={200} s={0.7} outfit={{ top: COLS[i], robe: true }} hat="sultan" beard pose="hipAngry" expr="angry" seed={'nb' + i} flip={i === 2} /></PopProp>)}</g> });
const Conversation: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'conversation.');
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'finger' }, { at, arm: 'shrug', expr: 'shock' }]} x={1180}>
      {[0, 1, 2].map((i) => {
        const tx = f > at - 10 ? 1640 + (i - 1) * 80 : 1500 + i * 180;
        return <g key={i} transform={`translate(${interpolate(f, [at - 10, at], [1500 + i * 180, tx], Easing.out)} 0)`}><Chibi x={0} y={960} s={0.7} outfit={{ top: COLS[i], robe: true }} hat="sultan" beard pose={f > at ? 'cross' : 'hipAngry'} expr={f > at ? 'grin' : 'angry'} seed={'cv' + i} flip={i === 2} /></g>;
      })}
      {f > at && <text x={1640} y={640} textAnchor="middle" fontFamily="Hand" fontSize={46}>...psst</text>}
    </HostShot>
  );
};
const Five: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
      <InsertBg glow={false} />
      <Layer depth={1}>
        {[...Array(5)].map((_, i) => {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
          const r = interpolate(f, [10 + i * 8, 40 + i * 8], [430, 180], Easing.inOut);
          const k = popScale(f, 4 + i * 8);
          return k > 0 ? <g key={i} transform={`translate(${960 + Math.cos(a) * r} ${520 + Math.sin(a) * r}) scale(${k})`}><path d="M0 60 V-90" stroke="#6B4A2B" strokeWidth={10} /><path d={`M0 -90 L${120 + Math.sin(f / 4 + i) * 8} -60 L0 -30 Z`} fill={['#2E6B4A', '#7A2A22', '#2E5E8C', '#5A3E8A', '#3E6B3A'][i]} stroke={OL} strokeWidth={4} /></g> : null;
        })}
        <circle cx={960} cy={520} r={40 + interpolate(f, [50, 70], [0, 30])} fill="none" stroke="#FFD84A" strokeWidth={6} opacity={f > 50 ? 1 : 0} />
      </Layer>
    </CameraRig>
  );
};
const Talikota: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05, shakes: [{ at: 40, amp: 5, len: 10 }] }}>
        <Plain tents={false} />
        <Layer depth={1}>
          {[0, 1, 2].map((i) => <Rider key={'v' + i} x={300 + i * 150 + interpolate(f, [0, 40], [0, 200])} y={970 - (i % 2) * 24} s={0.8} gait={f < 40 ? 'gallop' : 'idle'} phase={i * 4} horse="#F4F7FA" rider={{ outfit: VIJAYA_KING, hat: 'pagri', hatColor: '#E8862A', mustache: true, item: 'sword', pose: 'attack', expr: 'determined', seed: 'tv' + i }} />)}
          {[0, 1, 2, 3, 4].map((i) => <Rider key={'s' + i} x={1700 - i * 120 - interpolate(f, [0, 40], [0, 300])} y={970 - (i % 2) * 24} s={0.8} flip gait="gallop" phase={i * 3 + 1} horse="#3A2A22" rider={{ outfit: { top: ['#2E6B4A', '#7A2A22', '#2E5E8C', '#5A3E8A', '#3E6B3A'][i], bottom: '#3A2A1E' }, hat: 'turbanW', beard: true, item: 'spear', pose: 'attack', expr: 'determined', seed: 'ts' + i }} />)}
        </Layer>
      </CameraRig>
      <Label text="Talikota, 1565" x={960} y={110} at={W(s, 'talikota.')} size={70} color="#FFD84A" />
    </>
  );
};
const Talikota2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  // restrained: the commander's banner topples under gravity; nothing graphic
  const t = Math.max(0, f - 12);
  let ang = 0, w = 0;
  for (let i = 0; i < t; i++) { w += 0.004 + Math.sin((ang * Math.PI) / 180) * 0.9; ang += w; if (ang > 88) { ang = 88; w = -w * 0.25; } }
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.08, shakes: [{ at: 36, amp: 6, len: 8 }] }}>
      <Plain tents={false} />
      <Layer depth={1}>
        <g transform={`translate(960 960) rotate(${ang})`}><line x1={0} y1={0} x2={0} y2={-460} stroke="#6B4A2B" strokeWidth={10} /><path d="M4 -460 L200 -420 L4 -370 Z" fill="#E8862A" stroke={OL} strokeWidth={4} /></g>
        {f > 40 && [0, 1, 2].map((i) => <Horse key={i} x={interpolate(f, [40, s.dur], [700 - i * 100, -400 - i * 100])} y={980} s={0.7} flip gait="gallop" phase={i * 3} color="#F4F7FA" saddle />)}
      </Layer>
    </CameraRig>
  );
};
const WalkedIn: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
      <HampiStreet />
      <Layer depth={1}>{[0, 1, 2, 3].map((i) => <Chibi key={i} x={interpolate(f, [0, s.dur], [-200, 700]) + i * 180} y={950 + (i % 2) * 14} s={0.85} outfit={{ top: ['#2E6B4A', '#7A2A22', '#2E5E8C', '#5A3E8A'][i], bottom: '#3A2A1E' }} hat="turbanW" beard item="spear" legs="march" expr="determined" seed={'wi' + i} delay={i * 3} />)}</Layer>
    </CameraRig>
  );
};
const Months: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'months,');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><HampiStreet ruin={interpolate(f, [at, s.dur], [0, 0.4])} /></CameraRig>
      <div style={{ position: 'absolute', right: 60, top: 40, background: '#F4EEDD', border: '5px solid #141414', padding: '10px 20px', fontFamily: 'TagBold', fontSize: 44, transform: `scale(${popScale(f, 4)})` }}>{f < at ? 'DAY 1' : `MONTH ${1 + Math.floor((f - at) / 12)}`}</div>
    </>
  );
};
const MatchCut: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const r = interpolate(f, [10, s.dur * 0.7], [0, 1], Easing.inOut);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.0 }}><HampiStreet ruin={0} /></CameraRig>
      <div style={{ position: 'absolute', inset: 0, opacity: r }}><CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.0 }}><HampiStreet ruin={1} /></CameraRig></div>
    </>
  );
};
const Ruins: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><HampiStreet ruin={1} /></CameraRig>
    <Label text="~41 km² of ruins" x={1500} y={160} at={W(s, '41')} size={60} color="#FFD84A" />
  </>
);
const Ruins2: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06 }}>
    <Boulders sun />
    <Layer depth={1}>
      <StoneChariot x={1100} y={900} s={1.1} />
      {[0, 1].map((i) => <Chibi key={i} x={interpolate(useCurrentFrame(), [0, s.dur], [300, 600]) + i * 140} y={950} s={0.8} outfit={CIV(['#2E86C1', '#E8862A'][i], '#3A3F4A')} hat="cap" hatColor={['#C0392B', '#2E9A4A'][i]} legs="walk" expr="happy" seed={'tour' + i} delay={i * 4} />)}
    </Layer>
  </CameraRig>
);
const Kabul: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06 }}>
      <Passes />
      <Layer depth={1}><BabChibi x={960} y={950} s={1.1} pose="idle" expr="sad" seed="bb1" /></Layer>
    </CameraRig>
    <Label text="Kabul" x={960} y={110} at={W(s, 'kabul')} size={70} color="#FFD84A" />
    <Label text="~2,000 km" x={1400} y={230} at={W(s, '2000')} size={56} />
  </>
);
const Kabul2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const ev = [W(s, 'inherited'), W(s, 'lost'), W(s, 'back,'), W(s, 'again,')];
  const has = f >= ev[2] ? f < ev[3] : f >= ev[0] && f < ev[1];
  const lastEv = ev.filter((e) => f >= e).pop() ?? 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.06, zoomTo: 1.06 }}>
        <Passes />
        <Layer depth={1}>
          <BabChibi x={960} y={950} s={1.1} hat={has ? 'crown' : 'mongol'} pose={has ? 'cheer' : 'shrug'} expr={has ? 'grin' : 'sad'} seed="bb2" />
          {!has && f > ev[1] && (() => { const d = gravityDrop(f, lastEv, { h: 260, g: 2, e: 0.45 }); return <g transform={`translate(1140 ${940 + d.y}) scale(${d.sx} ${d.sy})`}><path d="M-40 0 L-44 -48 L-20 -28 L0 -60 L20 -28 L44 -48 L40 0 Z" fill="#E2B13C" stroke={OL} strokeWidth={3} /></g>; })()}
        </Layer>
      </CameraRig>
      <Label text="age 11" x={500} y={160} at={W(s, 'eleven,')} size={56} />
    </>
  );
};
const Broke: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.12, focus: [960, 700] }}>
    <Passes />
    <Layer depth={1}><BabChibi x={960} y={950} s={1.1} pose="shrug" expr="sad" seed="bb3" itemL="sack" /></Layer>
  </CameraRig>
);
const Lineage: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg /><Layer depth={1}><FamilyTree at={[W(s, 'timur,') - 4, W(s, 'genghis') - 4]} /></Layer></CameraRig>
);
const Gunpowder: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'gunpowder.');
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'finger' }, { at, arm: 'idle', expr: 'shock' }]}>
      <PopProp at={at - 6} x={1730} y={760}><g><path d="M-80 60 L-60 -60 L60 -60 L80 60 Z" fill="#3A3A3A" stroke={OL} strokeWidth={5} /><text y={20} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff">BOOM</text><path d={`M40 -60 Q60 -100 ${40 + Math.sin(f) * 6} -120`} stroke="#C9A47A" strokeWidth={5} fill="none" /><circle cx={40} cy={-124} r={8 + (f % 4)} fill="#FFB21E" /></g></PopProp>
    </HostShot>
  );
};

// =============================================================== ACT 6
const Babur: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04, panFrom: [-40, 0], panTo: [60, 0] }}>
        <Passes />
        <Layer depth={1}>
          {[3, 2, 1].map((i) => <Rider key={i} x={interpolate(f, [0, s.dur], [200 - i * 220, 900 - i * 220])} y={970 - (i % 2) * 24} s={0.8} gait="walk" phase={i * 4} horse="#5A4636" rider={{ outfit: MUGHAL_SOLDIER, hat: 'mongol', hatColor: '#3E6B3A', item: 'musket', pose: 'hold', expr: 'determined', seed: 'bs' + i }} />)}
          <Rider x={interpolate(f, [0, s.dur], [500, 1200])} y={970} s={0.95} gait="walk" horse="#F4F7FA" rider={{ outfit: BABUR, hat: 'mongol', hatColor: '#3E6B3A', mustache: true, pose: 'point', expr: 'determined', seed: 'bab' }} />
        </Layer>
      </CameraRig>
      <Label text="Babur" x={960} y={110} at={W(s, 'babur,')} size={80} color="#FFD84A" />
      <Tally text={`BABUR: 12,000`} bump={99} />
    </>
  );
};
const Lodi: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
      <Plain tents={false} />
      <Layer depth={0.8}>{[0, 1, 2].map((i) => <Elephant key={i} x={1000 + i * 320} y={900} s={0.75} flip />)}</Layer>
      <Layer depth={1}><Chibi x={600} y={950} s={1.1} outfit={LODI} hat="sultan" beard pose="cross" expr="grin" seed="lodi" /></Layer>
    </CameraRig>
    <Tally text={`SULTAN: ~100,000 + 100 ELEPHANTS`} bump={99} />
  </>
);
const Morning = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'morning.'), arm: 'present', expr: 'shock' }], { kids: (s) => <PopProp at={W(s, 'single')} x={1730} y={560}><g><circle r={110} fill="#F4EEDD" stroke={OL} strokeWidth={6} /><path d="M0 0 V-80 M0 0 L60 20" stroke={OL} strokeWidth={8} strokeLinecap="round" /><text y={150} textAnchor="middle" fontFamily="Hand" fontSize={44}>before lunch</text></g></PopProp> });
const PanShot: React.FC<{ s: Shot; charge: [number, number]; fire?: number; rebound?: [number, number]; labels?: boolean }> = ({ s, charge, fire = 0, rebound = [9999, 9999], labels }) => {
  const f = useCurrentFrame();
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <PanipatDiagram charge={interpolate(f, [0, s.dur], charge)} fire={f > fire && fire > 0 ? 1 : 0} rebound={interpolate(f, rebound, [0, 1], Easing.out)} />
      </svg>
      <div style={{ position: 'absolute', left: 300, top: 40, fontFamily: 'TagBold', fontSize: 52, color: '#2E6B4A', background: 'rgba(244,238,221,0.85)', padding: '4px 16px', border: '4px solid #141414' }}>12,000</div>
      <div style={{ position: 'absolute', right: 120, top: 40, fontFamily: 'TagBold', fontSize: 52, color: '#B3261E', background: 'rgba(244,238,221,0.85)', padding: '4px 16px', border: '4px solid #141414' }}>100,000</div>
      {labels && <><Label text="chained carts" x={560} y={1000 - 80} at={10} size={44} /><Label text="Panipat" x={960} y={120} at={W(s, 'panipat,')} size={64} color="#FFD84A" /></>}
    </>
  );
};
const Carts: React.FC<SP> = ({ s }) => <PanShot s={s} charge={[0, 0]} labels />;
const Carts2: React.FC<SP> = ({ s }) => <PanShot s={s} charge={[0, 0.1]} />;
const Charge: React.FC<SP> = ({ s }) => <PanShot s={s} charge={[0.1, 0.9]} />;
const Elephants: React.FC<SP> = ({ s }) => <PanShot s={s} charge={[0.9, 1]} fire={W(s, 'artillery.') - 4} rebound={[W(s, 'artillery.'), s.dur + 30]} />;
const Stampede: React.FC<SP> = ({ s }) => <PanShot s={s} charge={[1, 1]} fire={1} rebound={[-30, s.dur * 0.7]} />;
const Mughal: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><InsertBg /><Layer depth={1}><MughalMap x={500} y={-10} s={0.9} extent={interpolate(f, [6, s.dur], [0, 0.55], Easing.out)} /></Layer></CameraRig>
      <Label text="Mughal Empire" x={1460} y={260} at={W(s, 'mughal')} size={70} color="#FFD84A" />
    </>
  );
};
const ThinkQ = H(() => [{ at: 0, arm: 'chin' }, { at: 50, arm: 'finger', expr: 'grin' }]);
const DiaryShot: React.FC<{ s: Shot; stars: [number, number]; n: number }> = ({ s, stars, n }) => {
  const f = useCurrentFrame();
  const lines = ['No ice.', 'Bad melons.', 'Bad grapes.', 'Bad horses.', 'Bad bread.'].slice(0, n).map((t, i) => ({ text: t, at: 8 + i * 12 }));
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><InsertBg /><Layer depth={1}><Diary lines={lines} stars={Math.round(interpolate(f, [0, s.dur], stars))} /></Layer></CameraRig>
  );
};
const DiaryS: React.FC<SP> = ({ s }) => <DiaryShot s={s} stars={[5, 3]} n={2} />;
const Diary2: React.FC<SP> = ({ s }) => <DiaryShot s={s} stars={[3, 1]} n={5} />;
const Sketch4: React.FC<SP> = ({ s }) => {
  const id = s.id, A = s.speaker === 'A';
  const f = useCurrentFrame();
  const bExpr = ['s4_2', 's4_4', 's4_6', 's4_8', 's4_9', 's4_13'].includes(id) ? 'sad' : id === 's4_11' ? 'happy' : id === 's4_17' ? 'calm' : 'normal';
  const aExpr = id === 's4_3' || id === 's4_7' ? 'shock' : id === 's4_12' ? 'grin' : id === 's4_16' ? 'worried' : 'normal';
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.02, focus: A ? [1300, 640] : [560, 640] }}>
      <TentInterior />
      <Layer depth={1}>
        <BabChibi x={560} y={810} s={1.15} legs="sit" pose={id === 's4_6' || id === 's4_8' ? 'present' : id === 's4_17' ? 'cross' : 'shrug'} expr={bExpr} talking={A ? [] : talk(s)} seed="bbs" />
        <Chibi x={1360} y={950} s={1.1} outfit={COURTIER} hat="turbanW" beard pose={id === 's4_14' ? 'present' : 'idle'} item={id === 's4_14' ? 'none' : undefined} expr={aExpr} talking={A ? talk(s) : []} seed="crt" flip />
        {/* a sad melon on a plate */}
        <g transform="translate(860 840)"><ellipse rx={70} ry={20} fill="#F4F7FA" stroke={OL} strokeWidth={3} /><ellipse cy={-30} rx={50} ry={38} fill="#C9C06A" stroke={OL} strokeWidth={3} /><path d="M-30 -40 q30 -16 60 0" stroke="#9A9A4A" strokeWidth={4} fill="none" />{(id === 's4_6' || id === 's4_8') && <text x={0} y={-80} textAnchor="middle" fontFamily="Hand" fontSize={34}>:(</text>}</g>
        {id === 's4_17' && <text x={1700} y={300} textAnchor="middle" fontFamily="TagBold" fontSize={48} fill="#7A2A22">{`DAY ${1 + Math.floor(f / 3)}`}</text>}
      </Layer>
    </CameraRig>
  );
};
const BaburDies: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06 }}>
    <SultanCourt />
    <Layer depth={1.2}><rect x={-200} y={-200} width={2400} height={1500} fill="#000" opacity={0.3} /></Layer>
  </CameraRig>
);
const Humayun: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'lost');
  const d = f > at ? gravityDrop(f, at, { h: 0.01, g: 0 }) : null;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
        <SultanCourt />
        <Layer depth={1}>
          <Chibi x={960} y={760} s={1.1} outfit={HUMAYUN} hat={f > at + 10 ? 'turbanW' : 'crown'} legs="sit" pose={f > at ? 'shrug' : 'cross'} expr={f > at ? 'shock' : 'happy'} seed="hum" />
          {f > at && (() => { const p = projectile(f, at + 6, [960, 520], [14, -10], 1.2); return p.y < 1200 ? <g transform={`translate(${p.x} ${p.y}) rotate(${(f - at) * 10})`}><path d="M-40 0 L-44 -48 L-20 -28 L0 -60 L20 -28 L44 -48 L40 0 Z" fill="#E2B13C" stroke={OL} strokeWidth={3} /></g> : null; })()}
        </Layer>
      </CameraRig>
      <Label text="Humayun" x={960} y={110} at={W(s, 'humayun')} size={70} color="#FFD84A" />
    </>
  );
};
const Exile: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const back = W(s, 'back,');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}>
        <HotRoad />
        <Layer depth={1}>
          <Camel x={interpolate(f, [0, s.dur], [200, 900])} y={920} s={0.8} />
          <Chibi x={interpolate(f, [0, s.dur], [500, 1200])} y={900} s={0.95} outfit={HUMAYUN} hat={f > back ? 'crown' : 'turbanW'} legs="walk" pose={f > back ? 'cheer' : 'idle'} expr={f > back ? 'grin' : 'sad'} seed="hum2" />
        </Layer>
      </CameraRig>
      <Tally text={`EXILE: YEAR ${Math.min(15, 1 + Math.floor(f / 6))}`} bump={99} />
    </>
  );
};
const Stairs: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const fall = W(s, 'falling');
  // tumbling down steps: piecewise hops, each landing a step lower
  const steps = 6;
  const t = Math.max(0, f - fall);
  const k = Math.min(steps, Math.floor(t / 6));
  const sub = (t % 6) / 6;
  const x = 600 + k * 120 + sub * 120, y = 420 + k * 90 - Math.sin(sub * Math.PI) * 50 + sub * 90;
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
      <Study />
      <Layer depth={1}>
        {[...Array(steps + 1)].map((_, i) => <rect key={i} x={560 + i * 120} y={440 + i * 90} width={1400} height={90} fill="#C98A6A" stroke={OL} strokeWidth={3} />)}
        {f < fall ? (
          <Chibi x={620} y={440} s={0.9} outfit={HUMAYUN} hat="crown" item="book" itemL="book" pose="carry" expr="happy" seed="hst" />
        ) : k < steps ? (
          <g transform={`translate(${x} ${y}) rotate(${t * 20})`}><Chibi x={0} y={120} s={0.9} outfit={HUMAYUN} hat="crown" pose="bothUp" expr="shock" seed="hst2" /></g>
        ) : null}
        {f > fall && [0, 1, 2].map((i) => { const p = projectile(f, fall + i * 2, [640, 300], [8 + i * 3, -12], 1.3); return p.y < 1100 ? <rect key={i} x={p.x} y={p.y} width={40} height={50} fill={['#8C1D18', '#2E5E8C', '#3E6B3A'][i]} stroke={OL} strokeWidth={2} transform={`rotate(${(f - fall) * 16} ${p.x} ${p.y})`} /> : null; })}
      </Layer>
    </CameraRig>
  );
};
const Boy = H((s) => [{ at: 0, arm: 'present' }, { at: W(s, 'boy.'), arm: 'point', expr: 'shock' }], { kids: (s) => <PopProp at={W(s, 'thirteen-year-old')} x={1740} y={760}><Chibi x={0} y={200} s={0.75} outfit={AKBAR} hat="crown" pose="cheer" expr="grin" seed="ak0" /></PopProp> });
const Remarkable = H(() => [{ at: 0, arm: 'finger', expr: 'smile' }, { at: 50, arm: 'fist', expr: 'proud' }]);
const Akbar: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.08, focus: [960, 520] }}>
      <SultanCourt />
      <Layer depth={1}><Chibi x={960} y={760} s={1.15} outfit={AKBAR} hat="sultan" mustache legs="sit" pose="present" expr="proud" seed="akb" /></Layer>
    </CameraRig>
    <Label text="Akbar" x={960} y={110} at={W(s, 'akbar,')} size={80} color="#FFD84A" />
    <Label text="49 years" x={1500} y={230} at={W(s, 'fortynine')} size={60} />
  </>
);
const Illiterate: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.1, focus: [960, 600] }}>
      <SultanCourt throne={false} library />
      <Layer depth={1}>
        <Chibi x={960} y={950} s={1.15} outfit={AKBAR} hat="sultan" mustache item="book" pose="present" expr={f > 40 ? 'worried' : 'normal'} seed="akb2" />
        {f > 30 && [...Array(4)].map((_, i) => <text key={i} x={1120 + i * 40 + Math.sin(f / 3 + i) * 10} y={600 - i * 30} fontFamily="TagBold" fontSize={40} fill="#7A2A22" transform={`rotate(${(i - 1.5) * 20} ${1120 + i * 40} ${600 - i * 30})`}>{['b', 'd', 'q', 'p'][i]}</text>)}
      </Layer>
    </CameraRig>
  );
};
const ReadAloud: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
    <SultanCourt throne={false} library />
    <Layer depth={1}>
      <Seat x={560} />
      <Chibi x={560} y={800} s={1.15} outfit={AKBAR} hat="sultan" mustache legs="sit" pose="chin" expr="calm" seed="akb3" />
      {[0, 1, 2].map((i) => <Chibi key={i} x={1100 + i * 260} y={950} s={0.95} outfit={COURTIER} hat="turbanW" beard item="book" pose="present" expr="normal" talking={[[i * 20, i * 20 + 40]]} seed={'rd' + i} flip />)}
    </Layer>
  </CameraRig>
);
const Library: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.2, zoomTo: 0.9, focus: [960, 500] }}>
      <SultanCourt throne={false} library />
      <Layer depth={1}><Chibi x={960} y={950} s={1.15} outfit={AKBAR} hat="sultan" mustache pose="shrug" expr="grin" seed="akb4" /></Layer>
    </CameraRig>
  );
};
const Harder = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'harder'), arm: 'present', expr: 'proud' }]);
const Population: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}>
      <InsertBg glow={false} />
      <Layer depth={1}>
        <g transform="translate(500 -10) scale(0.9)">
          <path d={subPath()} fill="#E8DCC0" stroke={OL} strokeWidth={6} />
          {[...Array(80)].map((_, i) => { const x = 140 + random('pp' + i) * 760, y = 120 + random('pq' + i) * 860; return <circle key={i} cx={x} cy={y} r={9} fill={i % 7 === 0 ? '#2E6B4A' : '#E8862A'} stroke={OL} strokeWidth={2} opacity={popScale(f, 4 + (i % 20))} />; })}
        </g>
      </Layer>
    </CameraRig>
  );
};
const Jizya: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'jizya,') + 6;
  const half = (dir: number) => { const p = projectile(f, at, [960 + dir * 4, 520], [dir * 7, -6], 0.9); return f < at ? { x: 960, y: 520, r: 0 } : { x: p.x, y: p.y, r: dir * (f - at) * 3 }; };
  const L = half(-1), R = half(1);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          {[[-1, L], [1, R]].map(([dir, h]: any) => (
            <g key={dir} transform={`translate(${h.x} ${h.y}) rotate(${h.r})`}>
              <path d={dir < 0 ? 'M-200 -260 L0 -260 L-20 -100 L10 40 L-14 260 L-200 260 Z' : 'M0 -260 L200 -260 L200 260 L-14 260 L10 40 L-20 -100 Z'} fill="#F1E2C0" stroke={OL} strokeWidth={5} />
              {dir < 0 ? <text x={-110} y={-180} textAnchor="middle" fontFamily="TagBold" fontSize={40}>JIZ</text> : <text x={100} y={-180} textAnchor="middle" fontFamily="TagBold" fontSize={40}>YA TAX</text>}
            </g>
          ))}
        </Layer>
      </CameraRig>
      <Label text="abolished" x={960} y={960 - 120} at={at + 4} size={64} color="#FFD84A" />
    </>
  );
};
const RajCourt: React.FC<SP & { gen?: boolean }> = ({ s, gen }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
    <SultanCourt />
    <Layer depth={1}>
      <Chibi x={960} y={760} s={1.1} outfit={AKBAR} hat="sultan" mustache legs="sit" pose="present" expr="happy" seed="akb5" />
      <Chibi x={460} y={950} s={1.0} outfit={RAJPUT('#C0392B')} hat="pagri" hatColor="#C0392B" mustache item={gen ? 'sword' : undefined} pose={gen ? 'raise' : 'idle'} expr="proud" seed="mansingh" />
      <Chibi x={1460} y={950} s={1.0} outfit={{ top: '#C07A9C', robe: true, trim: '#E2B13C' }} hat="veil" hatColor="#E8862A" pose="idle" expr="happy" seed="prin" flip />
      {gen && <Chibi x={260} y={950} s={0.95} outfit={RAJPUT('#2E86C1')} hat="pagri" hatColor="#2E86C1" mustache item="notebook" pose="scribble" expr="proud" seed="gov" />}
    </Layer>
  </CameraRig>
);
const RajCourt1: React.FC<SP> = ({ s }) => <RajCourt s={s} />;
const RajCourt2: React.FC<SP> = ({ s }) => (
  <>
    <RajCourt s={s} gen />
    <Label text="general" x={460} y={500} at={W(s, 'generals')} size={52} color="#FFD84A" />
    <Label text="governor" x={260} y={420} at={W(s, 'governors')} size={52} color="#FFD84A" />
  </>
);
const Scholars: React.FC<{ s: Shot; argue?: boolean }> = ({ s, argue }) => {
  const f = useCurrentFrame();
  const cast: [Outfit, string, string, boolean, boolean][] = [
    [{ top: '#F1E6D0', bottom: '#E8862A', sash: '#E8862A' }, 'hair', 'Hindu', true, false],
    [{ top: '#F4F7FA', robe: true }, 'none', 'Jain', false, false],
    [{ top: '#1E1E28', robe: true }, 'skullcap', 'Christian', false, true],
    [{ top: '#F4F7FA', robe: true, trim: '#C9962C' }, 'skullcap', 'Zoroastrian', false, true],
    [{ top: '#3E6B3A', robe: true }, 'turbanW', 'Muslim', false, true],
  ];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
        <DebateHall />
        <Layer depth={1}>
          <Seat x={960} />
          <Chibi x={960} y={800} s={1.0} outfit={AKBAR} hat="sultan" mustache legs="sit" pose="chin" expr="calm" seed="akb6" />
          {cast.map(([o, h, n, m, b], i) => <Chibi key={n} x={260 + i * 350 + (i > 1 ? 0 : 0)} y={980} s={0.85} outfit={o} hat={h} hatColor={i === 2 ? '#1E1E28' : undefined} mustache={m} beard={b} item={i === 2 ? 'book' : undefined} pose={argue ? [{ at: 0, pose: 'idle' }, { at: 10 + i * 9, pose: 'present' }, { at: 30 + i * 9, pose: 'point' }] : 'idle'} expr="normal" talking={argue ? [[10 + i * 14, 24 + i * 14]] : []} seed={'sch' + i} flip={i > 2} />)}
        </Layer>
      </CameraRig>
      {cast.map(([, , n], i) => <Label key={n} text={n} x={260 + i * 350} y={590} at={4 + i * 4} size={40} />)}
    </>
  );
};
const Ibadat: React.FC<SP> = ({ s }) => <Scholars s={s} />;
const Ibadat2: React.FC<SP> = ({ s }) => <Scholars s={s} argue />;
const Grandson = H(() => [{ at: 0, arm: 'finger' }, { at: 30, arm: 'present', expr: 'worried' }]);
const TombTease = H((s) => [{ at: 0, arm: 'present' }, { at: W(s, 'tomb'), arm: 'point', expr: 'smile' }], { kids: (s) => <PopProp at={W(s, 'tomb')} x={1720} y={880}><TajMahal x={0} y={0} s={0.32} /></PopProp> });

// =============================================================== ACT 7
const Mumtaz: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06 }}>
      <TajGarden dusk />
      <Layer depth={1}>
        <Chibi x={760} y={950} s={1.1} outfit={SHAHJAHAN} hat="sultan" beard pose="pray" expr="sad" seed="sj" />
        {/* a single flower laid down */}
        <g transform="translate(1100 900)"><path d="M0 0 Q20 -30 0 -60" stroke="#3C7030" strokeWidth={6} fill="none" /><circle cy={-64} r={18} fill="#F4F7FA" stroke={OL} strokeWidth={3} /></g>
      </Layer>
    </CameraRig>
    <Label text="Mumtaz Mahal" x={960} y={110} at={W(s, 'mumtaz')} size={66} color="#FFD84A" />
  </>
);
const Taj: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.1, zoomTo: 1.0, focus: [960, 500] }}><TajGarden /><Layer depth={0.8}><TajMahal x={960} y={760} s={0.95} /></Layer></CameraRig>
    <Label text="Taj Mahal" x={960} y={110} at={W(s, 'taj')} size={80} color="#FFD84A" />
  </>
);
const TimeLapse: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b = interpolate(f, [0, s.dur], [0, 1]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.0 }}>
        <TajGarden />
        <Layer depth={0.8}>
          <TajMahal x={960} y={760} s={0.95} build={b} scaffold={b < 0.95 ? 1 : interpolate(b, [0.95, 1], [1, 0])} />
          {[...Array(10)].map((_, i) => <Chibi key={i} x={200 + i * 170 + Math.sin(f / 6 + i) * 20} y={960} s={0.38} outfit={CIV(COLS[i % 8])} hat="turbanW" item="brick" pose="carry" legs="walk" seed={'tw' + i} delay={i * 2} />)}
        </Layer>
      </CameraRig>
      <div style={{ position: 'absolute', right: 60, top: 40, background: '#1A1410', color: '#FFD84A', fontFamily: 'TagBold', fontSize: 56, padding: '6px 22px', border: '3px solid #FFD84A' }}>{Math.round(interpolate(f, [0, s.dur], [1632, 1653]))}</div>
    </>
  );
};
const ElephantsMarble: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
      <HotRoad />
      <Layer depth={1}>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${interpolate(f, [0, s.dur], [1700, 900]) - i * 520} 0)`}>
            <Elephant x={0} y={920} s={0.8} flip walk howdah={false} phase={i * 5} />
            <rect x={150} y={760} width={220} height={130} fill="#F4F2EC" stroke={OL} strokeWidth={4} />
            <path d="M150 820 L60 800" stroke="#6B4A2B" strokeWidth={5} />
            {[0, 1].map((k) => <circle key={k} cx={190 + k * 140} cy={900} r={28} fill="#8C5A2A" stroke={OL} strokeWidth={4} />)}
          </g>
        ))}
      </Layer>
    </CameraRig>
  );
};
const Stones: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const st: [string, string, string, string][] = [['jade', 'China', 'jade', '#3E9A6A'], ['turquoise', 'Tibet', 'turquoise', '#40C0C0'], ['lapis lazuli', 'Afghanistan', 'lapis', '#2E4AA8']];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg /><Layer depth={1}>{st.map(([n, , w, c], i) => <PopProp key={n} at={W(s, w)} x={500 + i * 460} y={500}><g><path d="M0 -110 L95 -40 L60 100 L-60 100 L-95 -40 Z" fill={c} stroke={OL} strokeWidth={6} /><path d="M-95 -40 L95 -40 M0 -110 L-60 100 M0 -110 L60 100" stroke="rgba(255,255,255,0.4)" strokeWidth={4} /></g></PopProp>)}</Layer></CameraRig>
      {st.map(([n, from, w], i) => <React.Fragment key={n}><Label text={n} x={500 + i * 460} y={690} at={W(s, w)} size={52} color="#FFD84A" /><Label text={`from ${from}`} x={500 + i * 460} y={760} at={W(s, w) + 4} size={40} /></React.Fragment>)}
    </>
  );
};
const Billion: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'billion');
  const v = Math.round(interpolate(f, [at - 30, at], [0, 1000000000], Easing.out));
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><InsertBg /><Layer depth={0.8}><TajMahal x={960} y={900} s={0.6} /></Layer></CameraRig>
      <div style={{ position: 'absolute', left: 960, top: 180, transform: 'translateX(-50%)', fontFamily: 'TagBold', fontSize: 110, color: '#FFD84A', WebkitTextStroke: '4px #141414', paintOrder: 'stroke fill' }}>${v.toLocaleString()}</div>
      <div style={{ position: 'absolute', left: 960, top: 320, transform: 'translateX(-50%)', fontFamily: 'Hand', fontSize: 44, color: '#fff' }}>(modern estimates, roughly)</div>
    </>
  );
};
const Grave = H((s) => [{ at: 0, arm: 'idle', expr: 'worried' }, { at: W(s, 'grave.'), arm: 'shrug', expr: 'shock' }]);
const Detail2 = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'mathematically'), arm: 'present', expr: 'grin' }], { kids: (s) => <PopProp at={W(s, 'mathematically')} x={1720} y={520}><g><path d="M-120 100 L120 100 L0 -110 Z" fill="none" stroke={OL} strokeWidth={6} /><path d="M-90 100 A60 60 0 0 1 -70 60" stroke="#B3261E" strokeWidth={5} fill="none" /><text x={-40} y={80} fontFamily="Hand" fontSize={36}>θ</text></g></PopProp> });
const MinaretDiagram: React.FC<{ s: Shot; fall?: boolean }> = ({ s, fall }) => {
  const f = useCurrentFrame();
  const lean = interpolate(f, [6, 30], [0, 7], Easing.out);
  const arc = fall ? interpolate(f, [10, s.dur * 0.7], [0, 1]) : 0;
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.02, shakes: fall ? [{ at: 6, amp: 4, len: 20 }] : [] }}>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#1E3A6A" />{[...Array(30)].map((_, i) => <path key={i} d={`M${i * 70} 0 V1080 M0 ${i * 70} H1920`} stroke="#2E4E80" strokeWidth={2} />)}</Layer>
      <Layer depth={1}>
        <g opacity={0.9}><TajMahal x={960} y={860} s={1.0} lean={lean} /></g>
        {fall && [-1, 1].map((d) => <path key={d} d={`M${960 + d * 470} 860 A 420 420 0 0 ${d > 0 ? 1 : 0} ${960 + d * (470 + 420 * Math.sin(arc * 1.4))} ${860 - 420 * Math.cos(arc * 1.4)}`} transform={`scale(1 -1) translate(0 ${-1720})`} stroke="#FFD84A" strokeWidth={6} strokeDasharray="14 12" fill="none" />)}
        {fall && arc > 0.9 && [-1, 1].map((d) => <text key={d} x={960 + d * 830} y={830} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#FFD84A">falls AWAY</text>)}
      </Layer>
    </CameraRig>
  );
};
const Minarets: React.FC<SP> = ({ s }) => <MinaretDiagram s={s} />;
const Minarets2: React.FC<SP> = ({ s }) => <MinaretDiagram s={s} fall />;
const Thought = H(() => [{ at: 0, arm: 'chin', expr: 'proud' }, { at: 40, arm: 'finger' }]);
const Peacock: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}><InsertBg /><Layer depth={1}><PeacockThrone x={960} y={860} s={1.2} /></Layer></CameraRig>
    <Label text="Peacock Throne" x={960} y={100} at={W(s, 'peacock')} size={70} color="#FFD84A" />
  </>
);
const KohiNoor: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.8, focus: [960, 464] }}><InsertBg /><Layer depth={1}><PeacockThrone x={960} y={860} s={1.2} glow={interpolate(f, [4, 20], [0, 1])} /></Layer></CameraRig>
      <Label text="Koh-i-Noor" x={960} y={140} at={W(s, 'kohinoor.') - 4} size={72} color="#FFD84A" />
    </>
  );
};
const Peacock2: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.0 }}><InsertBg /><Layer depth={1}><PeacockThrone x={600} y={860} s={0.9} /><TajMahal x={1400} y={860} s={0.5} /></Layer></CameraRig>
    <Label text="×2" x={600} y={200} at={W(s, 'twice')} size={110} color="#FFD84A" />
    <Label text="7 years to make" x={1400} y={200} at={W(s, 'seven')} size={52} />
  </>
);
const Remember: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'leaving');
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'finger' }, { at, arm: 'wave', expr: 'grin' }]}>
      <g transform={`translate(${f > at ? interpolate(f, [at, at + 30], [1720, 2400], Easing.in) : 1720} 880)`}><PeacockThrone x={0} y={0} s={0.45} /></g>
    </HostShot>
  );
};
const Sick: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
    <SultanCourt />
    <Layer depth={1}>
      <Chibi x={960} y={760} s={1.1} outfit={SHAHJAHAN} hat="sultan" beard beardColor="#C9C0B0" legs="sit" pose="idle" expr="sad" seed="sj2" />
      {[0, 1, 2, 3].map((i) => <Chibi key={i} x={260 + i * 150 + (i > 1 ? 900 : 0)} y={950} s={0.9} outfit={{ top: COLS[i], robe: true, trim: '#E2B13C' }} hat="sultan" beard={i !== 2} mustache pose="hipAngry" expr="angry" seed={'son' + i} flip={i > 1} />)}
    </Layer>
  </CameraRig>
);
const SonsFight: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  // restrained: four portraits; three get crossed out one by one
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}>
      <InsertBg glow={false} />
      <Layer depth={1}>
        {[0, 1, 2, 3].map((i) => {
          const out = i !== 2 && f > 20 + [0, 12, 0, 24][i];
          return (
            <g key={i} transform={`translate(${360 + i * 400} 500)`}>
              <rect x={-150} y={-200} width={300} height={380} rx={10} fill="#C9962C" stroke={OL} strokeWidth={6} />
              <rect x={-126} y={-176} width={252} height={332} fill="#F1E2C0" />
              <Chibi x={0} y={160} s={0.85} outfit={{ top: COLS[i], robe: true, trim: '#E2B13C' }} hat="sultan" beard={i !== 2} mustache expr={i === 2 ? 'determined' : 'normal'} seed={'por' + i} />
              {out && <path d="M-126 -176 L126 156 M126 -176 L-126 156" stroke="#5A5A5A" strokeWidth={10} opacity={0.6} />}
            </g>
          );
        })}
      </Layer>
    </CameraRig>
  );
};
const Aurangzeb: React.FC<SP> = ({ s }) => (
  <>
    <SonsFight s={s} />
    <Label text="Aurangzeb (3rd son)" x={1160} y={110} at={W(s, 'aurangzeb,')} size={60} color="#FFD84A" />
  </>
);
const Decision = H(() => [{ at: 0, arm: 'finger', expr: 'worried' }], { spot: () => ({ at: 20, text: 'hmm', x: 1700, y: 170 }) });
const Agra: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06 }}>
      <AgraWindow />
      <Layer depth={1}><Chibi x={560} y={950} s={1.1} outfit={SHAHJAHAN} hat="sultan" beard beardColor="#E8E2D6" pose="idle" expr="sad" seed="sj3" /></Layer>
    </CameraRig>
    <Label text="Agra Fort" x={960} y={110} at={W(s, 'agra')} size={64} color="#FFD84A" />
  </>
);
const Window: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03, focus: [1080, 520] }}><AgraWindow /></CameraRig>
);
const MaxMap: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}>
        <InsertBg glow={false} />
        <Layer depth={1}>
          <MughalMap x={460} y={-30} s={0.86} extent={interpolate(f, [6, s.dur], [0.55, 1.15], Easing.out)} />
          <TreasuryBar x={1240} y={880} v={interpolate(f, [6, s.dur], [1, 0.35])} />
        </Layer>
      </CameraRig>
      <Label text="largest ever" x={1500} y={260} at={W(s, 'largest')} size={66} color="#FFD84A" />
    </>
  );
};
const MaxMap2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.03, zoomTo: 1.06 }}>
      <InsertBg glow={false} />
      <Layer depth={1}>
        <MughalMap x={460} y={-30} s={0.86} extent={1.15} />
        <TreasuryBar x={1240} y={880} v={interpolate(f, [0, s.dur], [0.35, 0.15])} />
      </Layer>
    </CameraRig>
  );
};
const TwoReasons = H(() => [{ at: 0, arm: 'finger', expr: 'normal' }, { at: 40, arm: 'present' }], { kids: () => <g><PopProp at={30} x={1660} y={520}><text textAnchor="middle" fontFamily="TagBold" fontSize={80}>1.</text></PopProp><PopProp at={38} x={1660} y={680}><text textAnchor="middle" fontFamily="TagBold" fontSize={80}>2.</text></PopProp></g> });
const Policy2: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06 }}>
    <SultanCourt />
    <Layer depth={1}>
      <Aurang x={960} y={760} s={1.1} legs="sit" pose="point" expr="determined" seed="au1" />
      <Drop at={W(s, 'jizya') + 2} x={1460} y={700} h={600}><g><rect x={-120} y={-150} width={240} height={300} rx={6} fill="#F1E2C0" stroke={OL} strokeWidth={5} /><text y={-90} textAnchor="middle" fontFamily="TagBold" fontSize={36}>JIZYA</text><text y={-50} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill="#B3261E">REINSTATED</text></g></Drop>
    </Layer>
  </CameraRig>
);
const Loud: React.FC<SP> = ({ s }) => <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}><MughalMap x={500} y={-10} s={0.9} extent={1.15} /></Layer></CameraRig>;
const Loud2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><InsertBg glow={false} /><Layer depth={1}><MughalMap x={500} y={-10} s={0.9} extent={1.15} loud={interpolate(f, [W(s, 'loud.') - 10, s.dur], [0, 1])} /></Layer></CameraRig>;
};
const Deccan: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
        <HillForts />
        <Layer depth={1}>
          {[0, 1, 2].map((i) => <Tent key={i} x={300 + i * 500} y={980} s={0.6} closed c="#F1E6D0" flag="#2E6B4A" />)}
          <Rider x={interpolate(f, [0, s.dur], [200, 900])} y={970} s={1.0} gait="walk" horse="#F4F7FA" rider={{ outfit: AURANG, hat: 'skullcap', beard: true, beardColor: '#F4F7FA', pose: 'point', expr: 'determined', seed: 'au2' }} />
        </Layer>
      </CameraRig>
      <Label text="the Deccan" x={960} y={110} at={W(s, 'deccan.')} size={70} color="#FFD84A" />
    </>
  );
};
const Deccan2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
        <HillForts />
        <Layer depth={1}>
          {[0, 1, 2].map((i) => <Tent key={i} x={300 + i * 500} y={980} s={0.6} closed c="#F1E6D0" flag="#2E6B4A" />)}
          <Aurang x={1100} y={950} s={1.05} pose="chin" expr="worried" seed="au3" />
        </Layer>
      </CameraRig>
      <Tally text={`CAMPAIGN YEAR ${Math.min(27, 1 + Math.floor(f / 3))}`} bump={99} />
    </>
  );
};
const NeverWon = H(() => [{ at: 0, arm: 'present' }, { at: 60, arm: 'shrug', expr: 'worried' }], { kids: () => <g><PopProp at={10} x={1620} y={500}><text textAnchor="middle" fontFamily="TagBold" fontSize={50} fill="#2E6B4A">BATTLES ✓</text></PopProp><PopProp at={40} x={1620} y={620}><text textAnchor="middle" fontFamily="TagBold" fontSize={50} fill="#B3261E">WAR ✗</text></PopProp></g> });
const Marathas: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
      <HillForts />
      <Layer depth={1}>{[0, 1, 2].map((i) => <Rider key={i} x={500 + i * 420} y={970 - (i % 2) * 20} s={0.9} gait="idle" horse={['#3A2A22', '#8A5A3A', '#5A4636'][i]} rider={{ outfit: MARATHA, hat: 'pagri', hatColor: '#E8862A', mustache: true, item: i === 1 ? 'banner' : 'spear', pose: i === 1 ? 'raise' : 'hold', expr: 'determined', seed: 'mar' + i }} />)}</Layer>
    </CameraRig>
    <Label text="Marathas" x={960} y={110} at={W(s, 'marathas,')} size={76} color="#FFD84A" />
    <Label text="(movement founded by Shivaji, d. 1680)" x={960} y={200} at={W(s, 'shivaji,')} size={44} />
  </>
);
const Raids: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const v = W(s, 'vanishing.');
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}>
      <HillForts />
      <Layer depth={1}>
        {[0, 1, 2].map((i) => {
          const op = f > v ? Math.max(0, 1 - (f - v) / 6) : 1;
          return <g key={i} opacity={op}><Rider x={interpolate(f, [0, v], [-300 - i * 250, 1300 - i * 250])} y={970 - (i % 2) * 20} s={0.85} gait="gallop" phase={i * 4} horse={['#3A2A22', '#8A5A3A', '#5A4636'][i]} rider={{ outfit: MARATHA, hat: 'pagri', hatColor: '#E8862A', mustache: true, item: 'spear', pose: 'attack', expr: 'grin', seed: 'mr' + i }} /></g>;
        })}
        {f > v && [...Array(8)].map((_, i) => <circle key={i} cx={1100 + Math.cos(i) * (f - v) * 6} cy={860 - Math.abs(Math.sin(i)) * (f - v) * 3} r={30 + (f - v) * 2} fill="#E8DCC0" opacity={Math.max(0, 0.7 - (f - v) / 30)} />)}
        <Chibi x={1600} y={950} s={0.95} outfit={MUGHAL_SOLDIER} hat="ghurid" item="musket" pose={f > v ? 'shrug' : 'hold'} expr={f > v ? 'shock' : 'determined'} seed="mgs" flip />
      </Layer>
    </CameraRig>
  );
};
const TentDeath: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.08 }}>
    <HillForts />
    <Layer depth={1}>
      <Tent x={960} y={980} s={1.4} closed c="#F1E6D0" flag="#2E6B4A" />
      <TreasuryBar x={660} y={300} v={0.02} />
    </Layer>
    <Layer depth={1.2}><rect x={-200} y={-200} width={2400} height={1500} fill="#000" opacity={0.25} /></Layer>
  </CameraRig>
);
const Caps: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06 }}>
    <TentInterior />
    <Layer depth={1}>
      <Aurang x={960} y={950} s={1.15} item="notebook" pose="scribble" expr="calm" seed="au4" />
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${1260 + i * 70} 940)`}><path d="M-30 0 Q-28 -40 0 -42 Q28 -40 30 0 Z" fill="#F4F7FA" stroke={OL} strokeWidth={3} /></g>)}
      <g transform="translate(660 940)"><ellipse rx={50} ry={14} fill="#C98A3A" stroke={OL} strokeWidth={3} /><text y={-20} textAnchor="middle" fontFamily="Hand" fontSize={34}>own money</text></g>
    </Layer>
  </CameraRig>
);
const NadirTease = H((s) => [{ at: 0, arm: 'finger', expr: 'worried' }, { at: W(s, 'persian'), arm: 'point', expr: 'shock' }], { kids: (s) => <PopProp at={W(s, 'persian')} x={1730} y={760}><g filter="url(#sil)"><Chibi x={0} y={200} s={0.9} outfit={{ top: '#7A1F2B', robe: true, trim: '#E2B13C' }} hat="turbanW" beard pose="hold" item="sword" seed="nd0" /></g></PopProp> });

export const SHOTS_B2: Record<string, React.FC<SP>> = {
  vijaya: Vijaya, hampi: Hampi, descriptions: Descriptions, descriptions2: Descriptions2, razzaq: Razzaq, razzaq2: Razzaq2, gems: Gems, gems2: Gems2,
  paes: Paes, roses: Roses, roses2: Roses2, trade: Trade, horses: Horses, bigcity: BigCity, bigcity2: BigCity, beijing: Beijing,
  neighbours: Neighbours, conversation: Conversation, five: Five, talikota: Talikota, talikota2: Talikota2, walkedin: WalkedIn, months: Months,
  matchcut: MatchCut, ruins: Ruins, ruins2: Ruins2, kabul: Kabul, kabul2: Kabul2, broke: Broke, lineage: Lineage, gunpowder: Gunpowder,
  babur: Babur, lodi: Lodi, morning: Morning, carts: Carts, carts2: Carts2, charge: Charge, elephants: Elephants, stampede: Stampede, mughal: Mughal,
  thinkq: ThinkQ, diary: DiaryS, diary2: Diary2, sketch4: Sketch4, baburdies: BaburDies, humayun: Humayun, exile: Exile, stairs: Stairs,
  boy: Boy, remarkable: Remarkable, akbar: Akbar, illiterate: Illiterate, readaloud: ReadAloud, library: Library, harder: Harder,
  population: Population, jizya: Jizya, rajputs_court: RajCourt1, rajputs_court2: RajCourt2, ibadat: Ibadat, ibadat2: Ibadat2, grandson: Grandson, tombtease: TombTease,
  mumtaz: Mumtaz, taj: Taj, timelapse: TimeLapse, elephants_marble: ElephantsMarble, stones: Stones, billion: Billion, grave: Grave, detail2: Detail2,
  minarets: Minarets, minarets2: Minarets2, thought: Thought, peacock: Peacock, kohinoor: KohiNoor, peacock2: Peacock2, remember: Remember,
  sick: Sick, sons_fight: SonsFight, aurangzeb: Aurangzeb, decision: Decision, agra: Agra, window: Window, maxmap: MaxMap, maxmap2: MaxMap2,
  twoReasons: TwoReasons, policy2: Policy2, loud: Loud, loud2: Loud2, deccan: Deccan, deccan2: Deccan2, neverwon: NeverWon, marathas: Marathas,
  raids: Raids, tent_death: TentDeath, caps: Caps, nadirtease: NadirTease,
};
