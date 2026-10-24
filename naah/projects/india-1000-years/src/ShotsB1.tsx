// Acts 2–4: Aibak & Razia, Alauddin & the Mongols, Tughlaq's two disasters.
import React from 'react';
import { useCurrentFrame, interpolate, Easing, popScale, onTwos, random, gravityDrop, projectile, springPop, spring } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Host, HostKey } from '@engine/characters/Host';
import { Chibi, Outfit } from '@engine/characters/Chibi';
import { GreyStage, InsertBg } from '@engine/scenes/Backgrounds';
import { OL, Cloud, Critter } from '@engine/scenes/Parts';
import { Label, Spotlight } from '@engine/fx/Overlays';
import { Horse, DelhiGate, Passes, Plain, Tent, TempleVault, CoinBurst, Tally, subPath } from '@engine/scenes/India';
import { SultanCourt, QutbMinar, SultanateMap, CapitalMap, AsiaMap, FrontierMap, Market, FlatChart, HotRoad, Mint, Kitchen, Study, Boulders, CompanyFlag, BreakingMap } from '@engine/scenes/IndiaB1';
import { SP, talk, wordAt, Rider, HostShot, Drop, DropHtml, GHORI, AIBAK, GHURID_SOLDIER } from './ShotsIndia';
import type { Shot } from '@engine/types';

// ------------------------------------------------------------- cast
const ILTUTMISH: Outfit = { top: '#2E6B4A', robe: true, trim: '#E2B13C', belt: '#E2B13C' };
const RAZIA: Outfit = { top: '#2E5E8C', bottom: '#E8DCC0', belt: '#E2B13C', sash: '#E2B13C' };
const RAZIA_ARMOR: Outfit = { top: '#7A7F8C', bottom: '#2E5E8C', belt: '#E2B13C', cape: '#2E5E8C' };
const NOBLE = (c: string): Outfit => ({ top: c, robe: true, trim: '#E2B13C' });
const ALAUDDIN: Outfit = { top: '#4A1A16', robe: true, trim: '#E2B13C', belt: '#E2B13C' };
const JALAL: Outfit = { top: '#E8DCC0', robe: true, trim: '#C9962C' };
const MONGOL: Outfit = { top: '#5A4630', bottom: '#3A2A1E', belt: '#8A6A4A' };
const DELHI_SOLDIER: Outfit = { top: '#7A2A22', bottom: '#3A2A1E', belt: '#E2B13C' };
const TUGHLAQ: Outfit = { top: '#2E5E8C', robe: true, trim: '#E2B13C', belt: '#E2B13C' };
const MINISTER: Outfit = { top: '#C9962C', robe: true, trim: '#7A2A22' };
const BATTUTA: Outfit = { top: '#E8DCC0', robe: true, trim: '#8A5A3A', cape: '#8A5A3A' };
const CIV = (c: string, b = '#E8DCC0'): Outfit => ({ top: c, bottom: b });
const COLS = ['#C0392B', '#2E86C1', '#D4A017', '#8E44AD', '#16A085', '#E8862A', '#6E5A48', '#C07A9C'];

/** Quick host shot from pose keys (+ optional props and spotlight). */
const H = (keys: (s: Shot) => HostKey[], opts: { x?: number; spot?: (s: Shot) => { at: number; text?: string; x?: number; y?: number }; kids?: (s: Shot) => React.ReactNode; overlay?: (s: Shot) => React.ReactNode } = {}): React.FC<SP> => ({ s }) => (
  <HostShot s={s} keys={keys(s)} x={opts.x} spot={opts.spot?.(s)} overlay={opts.overlay?.(s)}>{opts.kids?.(s)}</HostShot>
);
const W = (s: Shot, w: string) => wordAt(s, w);

/** A small throne seat at the left of the court for sketches (speaker B sits here). */
const Seat: React.FC<{ x?: number }> = ({ x = 560 }) => (
  <g transform={`translate(${x} 800)`}>
    <rect x={-160} y={-70} width={320} height={70} rx={10} fill="#C9962C" stroke={OL} strokeWidth={3.5} />
    <rect x={-130} y={-230} width={260} height={170} rx={30} fill="#2E6B4A" stroke={OL} strokeWidth={3.5} />
    <path d="M-130 -200 Q0 -260 130 -200" stroke="#E2B13C" strokeWidth={8} fill="none" />
  </g>
);

const PopProp: React.FC<{ at: number; x: number; y: number; s?: number; children: React.ReactNode }> = ({ at, x, y, s = 1, children }) => {
  const f = useCurrentFrame();
  const k = popScale(f, at);
  return k > 0 ? <g transform={`translate(${x} ${y}) scale(${k * s})`}>{children}</g> : null;
};
const Stamp: React.FC<{ text: string; color?: string; w?: number }> = ({ text, color = '#B3261E', w = 360 }) => (
  <g transform="rotate(-8)">
    <rect x={-w / 2} y={-55} width={w} height={110} rx={10} fill="none" stroke={color} strokeWidth={10} />
    <text x={0} y={22} textAnchor="middle" fontFamily="TagBold" fontSize={58} fill={color}>{text}</text>
  </g>
);
const Doc: React.FC<{ title: string; lines?: number }> = ({ title, lines = 5 }) => (
  <g>
    <rect x={-150} y={-190} width={300} height={380} rx={6} fill="#F4EEDD" stroke={OL} strokeWidth={5} />
    <text x={0} y={-130} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#141414">{title}</text>
    {[...Array(lines)].map((_, i) => <path key={i} d={`M-110 ${-80 + i * 40} H110`} stroke="#B5AA90" strokeWidth={5} />)}
  </g>
);

// =============================================================== ACT 2
const AibakIntro = H((s) => [{ at: 0, arm: 'present' }, { at: W(s, 'slave'), arm: 'idle', expr: 'shock' }], {
  kids: (s) => <PopProp at={W(s, 'qutb')} x={1730} y={560} s={1.1}><Chibi x={0} y={260} outfit={AIBAK} hat="turbanW" pose="cross" expr="determined" seed="ai0" /></PopProp>,
});
const Explain = H(() => [{ at: 0, arm: 'finger' }, { at: 40, arm: 'present', expr: 'smile' }]);

const Training: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
      <Passes />
      <Layer depth={1}>
        <Chibi x={1500} y={990} s={1.1} outfit={GHURID_SOLDIER} hat="ghurid" mustache item="sword" pose={[{ at: 0, pose: 'point' }, { at: 40, pose: 'raise' }]} expr="determined" seed="instr" flip talking={talk(s)} />
        {[0, 1, 2, 3].map((i) => <Chibi key={i} x={360 + i * 230} y={950} s={0.72} outfit={CIV(COLS[i])} hat="hair" item="sword" pose={[{ at: 0, pose: 'idle' }, { at: 20 + i * 4, pose: 'attack' }, { at: 34 + i * 4, pose: 'raise' }]} expr="determined" seed={'boy' + i} />)}
      </Layer>
    </CameraRig>
  );
};
const Training2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at1 = W(s, 'soldiers'), at2 = W(s, 'administrators'), at3 = W(s, 'merit.');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
        <Passes />
        <Layer depth={1}>
          <Chibi x={500} y={950} s={0.95} outfit={GHURID_SOLDIER} hat="ghurid" item="sword" itemL="shield" pose={[{ at: 0, pose: 'idle' }, { at: at1, pose: 'attack' }]} expr="determined" seed="t2a" />
          <Chibi x={960} y={950} s={0.95} outfit={MINISTER} hat="turbanW" item="book" pose={[{ at: 0, pose: 'idle' }, { at: at2, pose: 'present' }]} expr="happy" seed="t2b" />
          <Chibi x={1420} y={950} s={0.95} outfit={AIBAK} hat="turbanW" pose={[{ at: 0, pose: 'idle' }, { at: at3, pose: 'cheer' }]} expr={[{ at: 0, expr: 'normal' }, { at: at3, expr: 'grin' }]} seed="t2c" />
          {/* promotion ladder: a medal drops onto the best one */}
          <Drop at={at3 + 2} x={1420} y={760} h={500}><g><circle r={26} fill="#E2B13C" stroke={OL} strokeWidth={4} /><path d="M-14 -24 L0 -60 L14 -24" fill="#B3261E" stroke={OL} strokeWidth={3} /></g></Drop>
        </Layer>
      </CameraRig>
      <Label text="soldier" x={500} y={420} at={at1} size={56} /><Label text="administrator" x={960} y={420} at={at2} size={56} /><Label text="promoted!" x={1420} y={420} at={at3} size={56} color="#FFD84A" />
    </>
  );
};
const Owed = H(() => [{ at: 0, arm: 'present' }, { at: 30, arm: 'shrug' }], { x: 1500, kids: () => <PopProp at={10} x={1820} y={760} s={1}><g><Chibi x={0} y={200} s={0.8} outfit={AIBAK} hat="turbanW" expr="worried" seed="ow" /><text x={0} y={-130} textAnchor="middle" fontFamily="Hand" fontSize={44}>no family</text></g></PopProp> });
const Owed2 = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'insurance'), arm: 'present', expr: 'proud' }], { kids: (s) => <PopProp at={W(s, 'insurance')} x={1730} y={540}><Doc title="INSURANCE POLICY" /></PopProp> });
const Policy: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'took');
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'idle' }, { at, arm: 'shrug', expr: 'shock' }]}>
      <PopProp at={4} x={1730} y={560}><g><Doc title="INSURANCE POLICY" />{f > at && <g transform="translate(0 30)"><Stamp text="SULTAN NOW" color="#2E6B4A" /></g>}</g></PopProp>
      {f > at && <g transform={`translate(1730 ${360 + gravityDrop(f, at, { h: 300, g: 2.2 }).y})`}><path d="M-60 0 L-66 -60 L-30 -30 L0 -80 L30 -30 L66 -60 L60 0 Z" fill="#E2B13C" stroke={OL} strokeWidth={4} /></g>}
    </HostShot>
  );
};

const Sultan: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'sultan');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.08, focus: [960, 520], push: { at, to: 1.08, len: 8 } }}>
        <SultanCourt />
        <Layer depth={1}>
          <Chibi x={960} y={760} s={1.05} outfit={{ ...AIBAK, robe: true, trim: '#E2B13C' }} hat={f > at ? 'sultan' : 'turbanW'} legs="sit" pose={[{ at: 0, pose: 'idle' }, { at, pose: 'cheer' }]} expr={[{ at: 0, expr: 'normal' }, { at, expr: 'grin' }]} seed="ais" />
          {[0, 1, 2, 3].map((i) => <Chibi key={i} x={300 + i * 140 + (i > 1 ? 900 : 0)} y={950} s={0.85} outfit={NOBLE(COLS[i + 2])} hat="turbanW" beard pose={[{ at: 0, pose: 'idle' }, { at: at + 4 + i * 2, pose: 'bothUp' }]} expr={[{ at: 0, expr: 'normal' }, { at: at + 4, expr: 'shock' }]} seed={'nb' + i} flip={i > 1} />)}
        </Layer>
      </CameraRig>
      <Label text="Sultan of Delhi" x={960} y={110} at={at} size={66} color="#FFD84A" />
    </>
  );
};
const Sultan2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'sold');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.08, zoomTo: 1.18, focus: [960, 560] }}>
        <SultanCourt />
        <Layer depth={1}><Chibi x={960} y={760} s={1.05} outfit={{ ...AIBAK, robe: true, trim: '#E2B13C' }} hat="sultan" legs="sit" pose="cross" expr="happy" seed="ais" /></Layer>
      </CameraRig>
      {f > at && <div style={{ position: 'absolute', left: 1420, top: 260, transform: `rotate(10deg) scale(${popScale(f, at)})`, background: '#F4EEDD', border: '5px solid #141414', padding: '10px 26px', fontFamily: 'TagBold', fontSize: 44 }}>PRICE TAG: <span style={{ textDecoration: 'line-through', color: '#B3261E' }}>for sale</span></div>}
    </>
  );
};
const Tower: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  // builders raising the first storey — blocks drop in and stack with little bounces
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
      <QutbMinar />
      <Layer depth={1}>
        <rect x={600} y={-2000} width={520} height={2400} fill="url(#skyDay)" opacity={0} />
        {[0, 1, 2].map((i) => <Chibi key={i} x={420 + i * 120} y={955} s={0.42} outfit={CIV(COLS[i])} hat="turbanW" legs="walk" item="brick" pose="carry" seed={'bd' + i} delay={i * 4} />)}
        <Chibi x={1400} y={955} s={0.5} outfit={{ ...AIBAK, robe: true, trim: '#E2B13C' }} hat="sultan" pose="point" expr="proud" seed="aitow" flip />
      </Layer>
    </CameraRig>
  );
};
const Minar: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.0, panFrom: [0, 0], panTo: [0, -1550], focus: [960, 540] }}>
      <QutbMinar />
      <Layer depth={1}>{[0, 1, 2, 3].map((i) => <Chibi key={i} x={560 + i * 90} y={955} s={0.16} outfit={CIV(COLS[i])} hat="turbanW" seed={'tiny' + i} expr="happy" />)}</Layer>
    </CameraRig>
    <Label text="Qutb Minar" x={1400} y={160} at={W(s, 'qutb')} size={70} color="#FFD84A" />
    <Label text="73 m" x={1400} y={260} at={W(s, '73')} size={64} />
  </>
);
const Minar2: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 0.5, zoomTo: 0.46, focus: [960, 1000], panFrom: [0, -560], panTo: [0, -560] }}>
      <QutbMinar />
    </CameraRig>
    <Label text="still standing" x={1400} y={300} at={W(s, 'standing')} size={60} color="#FFD84A" />
  </>
);
const Polo: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const ball = projectile(f % 40, 0, [1200, 960], [-14, -8], 0.8);
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04, panFrom: [0, 0], panTo: [80, 0] }}>
      <Plain tents={false} />
      <Layer depth={1}>
        <Rider x={interpolate(f, [0, s.dur], [400, 1300])} y={990} s={1.0} gait="gallop" horse="#8A5A3A" rider={{ outfit: { ...AIBAK, robe: false }, hat: 'sultan', item: 'mallet', pose: 'attack', expr: 'grin', seed: 'polo' }} />
        <Rider x={interpolate(f, [0, s.dur], [1700, 900])} y={950} s={0.85} flip gait="gallop" phase={3} horse="#3A2A22" rider={{ outfit: GHURID_SOLDIER, hat: 'turbanW', item: 'mallet', pose: 'attack', expr: 'determined', seed: 'polo2' }} />
        <circle cx={interpolate(f, [0, s.dur], [900, 1500])} cy={1000 - Math.abs(Math.sin(f / 6)) * 60} r={12} fill="#F4F7FA" stroke={OL} strokeWidth={3} />
      </Layer>
    </CameraRig>
  );
};
const Polo2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const rear = 8;
  const fall = 14;
  const p = projectile(f, fall, [960, 760], [9, -14], 1.5);
  const landed = p.y > 990;
  const rot = interpolate(f, [rear, rear + 8, rear + 30], [0, -24, 0], Easing.out);
  return (
    <CameraRig move={{ zoomFrom: 1.05, zoomTo: 1.1, focus: [1100, 760], shakes: [{ at: 26, amp: 7, len: 8 }] }}>
      <Plain tents={false} />
      <Layer depth={1}>
        <g transform={`rotate(${rot} 900 1000)`}><Horse x={interpolate(f, [0, s.dur], [900, 1500], Easing.in)} y={950} s={1.0} gait={f > rear ? 'gallop' : 'walk'} color="#8A5A3A" /></g>
        {f < fall ? (
          <Chibi x={900} y={880} s={1.0} outfit={{ ...AIBAK, robe: false }} hat="sultan" legs="sit" item="mallet" pose="bothUp" expr="shock" seed="polof" />
        ) : (
          <g transform={`translate(${landed ? 1220 : p.x} ${landed ? 990 : p.y}) rotate(${landed ? 90 : (f - fall) * 14})`}>
            <Chibi x={0} y={120} s={1.0} outfit={{ ...AIBAK, robe: false }} hat="none" hair="#1E1612" pose="bothUp" expr="shock" seed="polof2" />
          </g>
        )}
        {f > 26 && [...Array(6)].map((_, i) => <circle key={i} cx={1220 + Math.cos(i) * (40 + (f - 26) * 4)} cy={990 - Math.abs(Math.sin(i)) * (f - 26) * 2} r={30 + (f - 26)} fill="#D8C9A0" opacity={Math.max(0, 0.8 - (f - 26) / 30)} />)}
      </Layer>
    </CameraRig>
  );
};
const Sport = H(() => [{ at: 0, arm: 'shrug', expr: 'worried' }], { kids: () => <PopProp at={14} x={1740} y={620}><g><rect x={-8} y={-140} width={16} height={260} fill="#8A6A4A" stroke={OL} strokeWidth={2} transform="rotate(30)" /><circle cx={60} cy={110} r={20} fill="#F4F7FA" stroke={OL} strokeWidth={3} /></g></PopProp> });
const SultanateIns: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}><InsertBg /><Layer depth={1}><SultanateMap x={500} y={-10} s={0.9} grow={spring(f, { damping: 16, stiffness: 50 })} /></Layer></CameraRig>
      <Label text="Delhi Sultanate" x={1460} y={260} at={W(s, 'delhi')} size={70} color="#FFD84A" />
    </>
  );
};
const SultanateIns2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const yr = Math.round(interpolate(f, [6, 70], [1206, 1526], Easing.inOut));
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.05, zoomTo: 1.05 }}><InsertBg /><Layer depth={1}><SultanateMap x={500} y={-10} s={0.9} /></Layer></CameraRig>
      <div style={{ position: 'absolute', left: 1400, top: 220, fontFamily: 'TagBold', fontSize: 90, color: '#FFD84A', WebkitTextStroke: '3px #141414' }}>{yr}</div>
      <Label text="300+ years" x={1560} y={420} at={W(s, 'over')} size={70} />
    </>
  );
};
const Detail = H(() => [{ at: 0, arm: 'chin' }, { at: 40, arm: 'finger', expr: 'smile' }]);
const Woman = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'woman.'), arm: 'present', expr: 'grin' }], {
  kids: (s) => <PopProp at={W(s, 'woman.')} x={1740} y={760} s={1.1}><Chibi x={0} y={200} outfit={RAZIA} hat="hairlong" expr="determined" pose="cross" seed="rz0" /></PopProp>,
});
const RaziaWalk: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
        <SultanCourt />
        <Layer depth={1}>
          {[0, 1, 2, 3, 4].map((i) => <Chibi key={i} x={260 + i * 150 + (i > 2 ? 800 : 0)} y={950} s={0.85} outfit={NOBLE(COLS[(i + 3) % 8])} hat="turbanW" beard={i % 2 === 0} mustache={i % 2 === 1} pose="cross" expr="angry" seed={'rn' + i} flip={i > 2} />)}
          <Chibi x={interpolate(f, [0, s.dur], [600, 900])} y={950} s={1.0} outfit={RAZIA} hat="veil" legs="walk" pose="idle" expr="determined" seed="rzw" />
        </Layer>
      </CameraRig>
      <Label text="Razia" x={960} y={110} at={W(s, 'razia.')} size={80} color="#FFD84A" />
    </>
  );
};
const Sons: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
    <SultanCourt throne={false} />
    <Layer depth={1}>
      <Chibi x={420} y={950} s={1.1} outfit={ILTUTMISH} hat="sultan" beard pose={[{ at: 0, pose: 'chin' }, { at: 30, pose: 'point' }]} expr="normal" seed="ilt" />
      {[0, 1, 2, 3].map((i) => <Chibi key={i} x={800 + i * 230} y={950} s={0.9} outfit={CIV(COLS[i + 1], '#E8DCC0')} hat="turbanW" pose={i === 2 ? 'shrug' : 'idle'} expr={i === 1 ? 'grin' : 'normal'} seed={'son' + i} flip />)}
    </Layer>
  </CameraRig>
);
const Sons2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'better');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.04, zoomTo: 1.06, push: { at, to: 1.08, len: 8 } }}>
        <SultanCourt throne={false} />
        <Layer depth={1}>
          <Chibi x={420} y={950} s={1.1} outfit={ILTUTMISH} hat="sultan" beard pose={[{ at: 0, pose: 'point' }, { at, pose: 'present' }]} expr={[{ at: 0, expr: 'normal' }, { at, expr: 'happy' }]} talking={talk(s)} seed="ilt" />
          <Chibi x={interpolate(f, [at - 10, at], [2200, 760], Easing.out)} y={950} s={1.0} outfit={RAZIA} hat="veil" pose="cross" expr="determined" seed="rz2" flip />
          {[0, 1, 2, 3].map((i) => <Chibi key={i} x={1060 + i * 220} y={950} s={0.9} outfit={CIV(COLS[i + 1], '#E8DCC0')} hat="turbanW" pose={f > at ? 'shrug' : 'idle'} expr={f > at ? 'shock' : 'normal'} seed={'son' + i} flip />)}
        </Layer>
      </CameraRig>
      <Label text="better than the lot" x={760} y={330} at={at} size={56} color="#FFD84A" />
    </>
  );
};
const Heir: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'hated');
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05, shakes: [{ at, amp: 6 }] }}>
      <SultanCourt />
      <Layer depth={1}>
        {[...Array(7)].map((_, i) => <Chibi key={i} x={160 + i * 270} y={950} s={0.85} outfit={NOBLE(COLS[i % 8])} hat="turbanW" beard={i % 2 === 0} mustache pose={f > at ? 'hipAngry' : 'idle'} expr={f > at ? 'angry' : 'normal'} seed={'hn' + i} flip={i > 3} />)}
        {f > at && [...Array(5)].map((_, i) => <text key={i} x={300 + i * 330} y={640 - ((f - at) % 30) * 2} fontFamily="TagBold" fontSize={44} fill="#B3261E">{['#!', 'hmph', '!!', 'no.', '#@!'][i]}</text>)}
      </Layer>
    </CameraRig>
  );
};
const RaziaSits: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const vAt = W(s, 'veil,'), tAt = W(s, 'tunic,');
  const sit = f > tAt + 8;
  // dropped veil falls under gravity to the floor
  const veil = f > vAt ? gravityDrop(f, vAt, { h: 160, g: 1.0, e: 0.1, maxBounces: 0 }) : null;
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.08, focus: [960, 560] }}>
      <SultanCourt />
      <Layer depth={1}>
        {[0, 1, 2, 3].map((i) => <Chibi key={i} x={260 + i * 150 + (i > 1 ? 1000 : 0)} y={950} s={0.85} outfit={NOBLE(COLS[(i + 5) % 8])} hat="turbanW" beard mustache pose="cross" expr={f > vAt ? 'shock' : 'angry'} seed={'rs' + i} flip={i > 1} />)}
        <Chibi x={sit ? 960 : interpolate(f, [0, tAt], [700, 900])} y={sit ? 760 : 1000} s={1.0} outfit={RAZIA} hat={f > vAt ? 'hairlong' : 'veil'} legs={sit ? 'sit' : 'walk'} pose={sit ? 'cross' : 'idle'} expr="determined" seed="rzs" />
        {veil && <g transform={`translate(${800} ${1000 - 40 + veil.y * 0 + Math.min(0, veil.y)})`}><path d="M-60 0 Q0 -30 60 0 Q30 14 -60 0 Z" fill="#7A3A5A" stroke={OL} strokeWidth={3} /></g>}
      </Layer>
    </CameraRig>
  );
};
const RaziaArmy: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04, panFrom: [-40, 0], panTo: [60, 0] }}>
        <Plain tents={false} />
        <Layer depth={1}>
          {[3, 2, 1].map((i) => <Rider key={i} x={interpolate(f, [0, s.dur], [200 - i * 220, 1200 - i * 220])} y={990 - (i % 2) * 30} s={0.8} gait="gallop" phase={i * 4} horse="#5A4636" rider={{ outfit: DELHI_SOLDIER, hat: 'ghurid', item: 'spear', pose: 'hold', expr: 'determined', seed: 'ra' + i }} />)}
          <Rider x={interpolate(f, [0, s.dur], [400, 1400])} y={990} s={0.95} gait="gallop" horse="#F4F7FA" rider={{ outfit: RAZIA_ARMOR, hat: 'hairlong', item: 'sword', pose: 'raise', expr: 'determined', seed: 'razr' }} />
        </Layer>
      </CameraRig>
      <Label text="~4 years" x={1560} y={160} at={W(s, 'four')} size={64} color="#FFD84A" />
    </>
  );
};
const Nobles: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.12, focus: [960, 700] }}>
    <SultanCourt />
    <Layer depth={1}>
      {[...Array(6)].map((_, i) => <Chibi key={i} x={300 + i * 260} y={950} s={0.9} outfit={NOBLE(COLS[(i + 2) % 8])} hat="turbanW" beard mustache pose={[{ at: 0, pose: 'cross' }, { at: 30 + i * 3, pose: 'point' }]} expr="angry" seed={'ng' + i} />)}
    </Layer>
  </CameraRig>
);
const Empty: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.1, focus: [960, 520] }}>
    <SultanCourt />
    <Layer depth={1.2}><rect x={-200} y={-200} width={2400} height={1500} fill="#000" opacity={0.35} /></Layer>
  </CameraRig>
);
const SevenHundred = H(() => [{ at: 0, arm: 'idle', expr: 'worried' }, { at: 40, arm: 'present' }], { spot: (s) => ({ at: 4, text: '~700 years', x: 1700, y: 170 }) });
const Survived = H(() => [{ at: 0, arm: 'present' }, { at: 40, arm: 'idle', expr: 'worried' }]);
const Horde: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
      <Passes />
      <Layer depth={0.6}>
        <g filter="url(#sil)">{[...Array(14)].map((_, i) => <Horse key={i} x={interpolate(f, [0, s.dur], [-200 + i * 150, 200 + i * 150])} y={760 + (i % 3) * 18} s={0.35} gait="gallop" phase={i * 3} />)}</g>
      </Layer>
      <Layer depth={1}>{[...Array(3)].map((_, i) => <Rider key={i} x={interpolate(f, [0, s.dur], [-200 - i * 300, 600 - i * 300])} y={950} s={0.85} gait="gallop" phase={i * 4} horse="#5A4630" rider={{ outfit: MONGOL, hat: 'mongol', item: 'spear', pose: 'hold', expr: 'grin', seed: 'mg' + i }} />)}</Layer>
    </CameraRig>
  );
};
const Horde2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [W(s, 'hundred'), W(s, 'hundred') + 40], [1000, 100000], Easing.out));
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.1, zoomTo: 1.0, shakes: [{ at: 20, amp: 4, len: 60 }] }}>
        <Passes />
        <Layer depth={0.5}><g filter="url(#sil)">{[...Array(30)].map((_, i) => <Horse key={i} x={-300 + (i % 15) * 170 + f * 3} y={720 + Math.floor(i / 15) * 60} s={0.28 + Math.floor(i / 15) * 0.08} gait="gallop" phase={i * 2} />)}</g></Layer>
        <Layer depth={1}>{[...Array(5)].map((_, i) => <Rider key={i} x={-200 + i * 380 + f * 4} y={1000 - (i % 2) * 30} s={0.75} gait="gallop" phase={i * 4} horse="#5A4630" rider={{ outfit: MONGOL, hat: 'mongol', item: 'spear', pose: 'attack', expr: 'grin', seed: 'mh' + i }} />)}</Layer>
      </CameraRig>
      <Tally text={`${n.toLocaleString()} HORSES`} bump={99} />
    </>
  );
};

// =============================================================== ACT 3
const MongolMap: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const a = W(s, 'baghdad,'), b = W(s, 'persia,'), c = W(s, 'china.');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
        <InsertBg glow={false} />
        <Layer depth={1}><g transform="translate(120 80)"><AsiaMap flatten={[f > c ? 1 : 0, f > b ? 1 : 0, f > a ? 1 : 0]} arrows={interpolate(f, [4, 60], [0, 3.6])} /></g></Layer>
      </CameraRig>
      {[[a, 'BAGHDAD', 330, 680], [b, 'PERSIA', 690, 400], [c, 'CHINA', 1480, 700]].map(([at, t, x, y]) => (
        <div key={t as string} style={{ position: 'absolute', left: x as number, top: y as number, transform: `translate(-50%,-50%) rotate(-8deg) scale(${popScale(f, at as number)})`, border: '7px solid #B3261E', color: '#B3261E', fontFamily: 'TagBold', fontSize: 34, padding: '2px 12px', background: 'rgba(244,238,221,0.85)' }}>{t} — FLATTENED</div>
      ))}
    </>
  );
};
const Finished = H(() => [{ at: 0, arm: 'idle', expr: 'worried' }, { at: 30, arm: 'shrug' }], { spot: () => ({ at: 20, text: 'uh oh', x: 1700, y: 170 }) });
const Alauddin: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.1, focus: [960, 520] }}>
      <SultanCourt />
      <Layer depth={1}><Chibi x={960} y={760} s={1.15} outfit={ALAUDDIN} hat="sultan" hatColor="#E8862A" mustache pose="cross" expr="determined" legs="sit" seed="ala" /></Layer>
    </CameraRig>
    <Label text="Alauddin Khalji" x={960} y={110} at={W(s, 'alauddin')} size={70} color="#FFD84A" />
  </>
);
const Alauddin2: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.15, zoomTo: 1.3, focus: [960, 480] }}>
    <SultanCourt />
    <Layer depth={1}><Chibi x={960} y={760} s={1.15} outfit={ALAUDDIN} hat="sultan" hatColor="#E8862A" mustache pose={[{ at: 0, pose: 'cross' }, { at: 40, pose: 'point' }]} expr={[{ at: 0, expr: 'determined' }, { at: 40, expr: 'grin' }]} legs="sit" seed="ala" /></Layer>
  </CameraRig>
);
const RiverBG: React.FC = () => {
  const f = onTwos(useCurrentFrame(), 2);
  return (
    <>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDawn)" /></Layer>
      <Layer depth={0.3}><path d="M-200 560 Q900 520 2200 560 L2200 640 L-200 640 Z" fill="#7C9A5A" stroke={OL} strokeWidth={3} />{[...Array(8)].map((_, i) => <Tree key={i} x={i * 280} y={580} s={0.5} />)}</Layer>
      <Layer depth={0.6}>
        <rect x={-200} y={640} width={2400} height={700} fill="#6FA0B8" />
        {[...Array(14)].map((_, i) => <path key={i} d={`M${-200 + i * 180 + ((f * 2) % 180)} ${700 + (i % 4) * 70} q20 -10 40 0 q20 10 40 0`} stroke="#DDEFF7" strokeWidth={4} fill="none" />)}
      </Layer>
    </>
  );
};
const Boat: React.FC<{ x: number; y: number; s?: number; flip?: boolean; children?: React.ReactNode }> = ({ x, y, s = 1, flip, children }) => {
  const f = onTwos(useCurrentFrame());
  return (
    <g transform={`translate(${x} ${y + Math.sin(f / 8 + x) * 4}) rotate(${Math.sin(f / 10 + x) * 2}) scale(${flip ? -s : s} ${s})`}>
      {children}
      <path d="M-200 -20 L200 -20 Q170 50 0 56 Q-170 50 -200 -20 Z" fill="#8C5A2A" stroke={OL} strokeWidth={4} />
      <path d="M-190 -12 H190" stroke="#E2B13C" strokeWidth={5} />
    </g>
  );
};
const River: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
      <RiverBG />
      <Layer depth={1}>
        <Boat x={interpolate(f, [0, s.dur], [300, 640])} y={860}><Chibi x={0} y={-20} s={0.8} outfit={ALAUDDIN} hat="sultan" hatColor="#E8862A" mustache pose="wave" expr="grin" seed="alb" /></Boat>
        <Boat x={interpolate(f, [0, s.dur], [1650, 1300])} y={880} flip><Chibi x={0} y={-20} s={0.8} outfit={JALAL} hat="sultan" beard pose="wave" expr="happy" seed="jal" /></Boat>
      </Layer>
    </CameraRig>
  );
};
const River2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const dark = interpolate(f, [s.dur * 0.5, s.dur * 0.8], [0, 0.85]);
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.15, focus: [960, 760] }}>
      <RiverBG />
      <Layer depth={1}>
        <Boat x={760} y={860}><Chibi x={0} y={-20} s={0.8} outfit={ALAUDDIN} hat="sultan" hatColor="#E8862A" mustache pose="present" expr="grin" seed="alb" /></Boat>
        <Boat x={1160} y={880} flip><Chibi x={0} y={-20} s={0.8} outfit={JALAL} hat="sultan" beard pose="wave" expr="happy" seed="jal" /></Boat>
      </Layer>
      <Layer depth={1.2}><rect x={-200} y={-200} width={2400} height={1500} fill="#000" opacity={dark} /></Layer>
    </CameraRig>
  );
};
const Tense = H((s) => [{ at: 0, arm: 'idle', expr: 'worried' }, { at: W(s, 'tense.'), arm: 'shrug', expr: 'grin' }]);
const Annoying = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'annoying.'), arm: 'present', expr: 'grin' }], { kids: (s) => <PopProp at={W(s, 'annoying.')} x={1740} y={760}><Chibi x={0} y={200} outfit={MONGOL} hat="mongol" pose="hipAngry" expr="angry" seed="mga" /></PopProp> });
const Arrows: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const hits = [24, 44, 64, 84, 104, 124];
  const n = hits.filter((h) => f >= h).length;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}><FrontierMap hits={hits} /></Layer></CameraRig>
      <Tally text={`MONGOL INVASIONS REPELLED — ${n}`} bump={n ? f - hits[n - 1] : 99} />
    </>
  );
};
const Walls: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
    <DelhiGate dusk={false} />
    <Layer depth={1}>
      {[0, 1, 2, 3].map((i) => <Tent key={i} x={1180 + i * 220} y={950} s={0.55} closed c="#8A6A4A" flag="#3A2A22" />)}
      {[0, 1].map((i) => <Chibi key={i} x={1400 + i * 260} y={1040} s={0.8} outfit={MONGOL} hat="mongol" item="spear" pose="hold" expr="grin" seed={'mw' + i} flip />)}
    </Layer>
  </CameraRig>
);
const BeatBack: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04, shakes: [{ at: 8, amp: 5 }, { at: 20, amp: 6 }] }}>
      <Plain tents={false} />
      <Layer depth={1}>
        {[0, 1, 2].map((i) => <Rider key={i} x={interpolate(f, [10, s.dur], [1200 + i * 200, 2500 + i * 200], Easing.in)} y={990 - (i % 2) * 24} s={0.8} gait="gallop" phase={i * 3} horse="#5A4630" rider={{ outfit: MONGOL, hat: 'mongol', pose: 'bothUp', expr: 'shock', seed: 'mb' + i }} />)}
        {[0, 1, 2].map((i) => <Chibi key={i} x={300 + i * 200} y={950} s={0.95} outfit={DELHI_SOLDIER} hat="ghurid" item="sword" itemL="shield" pose={[{ at: 0, pose: 'attack' }, { at: 30, pose: 'cheer' }]} expr={[{ at: 0, expr: 'determined' }, { at: 30, expr: 'grin' }]} seed={'db' + i} />)}
        <Chibi x={820} y={950} s={1.1} outfit={ALAUDDIN} hat="sultan" hatColor="#E8862A" mustache item="sword" pose={[{ at: 0, pose: 'attack' }, { at: 30, pose: 'hipAngry' }]} expr="grin" seed="alw" />
      </Layer>
    </CameraRig>
  );
};
const Forts: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
      <InsertBg glow={false} />
      <Layer depth={1}>
        <g transform="translate(700 60) scale(0.92)"><path d={subPath()} fill="#E8DCC0" stroke={OL} strokeWidth={6} /></g>
        {[[860, 300], [930, 380], [1000, 440], [1080, 470], [1170, 480]].map(([x, y], i) => {
          const d = gravityDrop(f, 4 + i * 6, { h: 300, g: 2.2, e: 0.3 });
          return f >= 4 + i * 6 ? <g key={i} transform={`translate(${x} ${y + d.y}) scale(${d.sx} ${d.sy})`}><rect x={-26} y={-30} width={52} height={36} fill="#B5543A" stroke={OL} strokeWidth={3} />{[0, 1, 2].map((k) => <rect key={k} x={-26 + k * 20} y={-42} width={12} height={12} fill="#B5543A" stroke={OL} strokeWidth={2} />)}</g> : null;
        })}
      </Layer>
    </CameraRig>
  );
};
const Army: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03, panFrom: [-60, 0], panTo: [60, 0] }}>
      <DelhiGate dusk={false} />
      <Layer depth={1}>{[...Array(9)].map((_, i) => <Chibi key={i} x={interpolate(f, [0, s.dur], [-300, 500]) + i * 170} y={1000 + (i % 2) * 20} s={0.75} outfit={DELHI_SOLDIER} hat="ghurid" item="spear" legs="march" expr="determined" seed={'ar' + i} delay={i * 2} />)}</Layer>
    </CameraRig>
  );
};
const NeverTook: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}><FrontierMap hits={[4, 16, 28]} /></Layer></CameraRig>
      <DropHtml at={W(s, 'never') + 2} left={1400} top={820} h={500}><div style={{ border: '9px solid #2E6B4A', color: '#2E6B4A', background: 'rgba(244,238,221,0.9)', fontFamily: 'TagBold', fontSize: 64, padding: '6px 26px', transform: 'rotate(-6deg)' }}>NEVER TAKEN</div></DropHtml>
    </>
  );
};
const Pay = H(() => [{ at: 0, arm: 'finger' }, { at: 40, arm: 'present' }], { kids: () => <PopProp at={20} x={1740} y={760}><Chibi x={0} y={200} outfit={DELHI_SOLDIER} hat="ghurid" item="spear" pose="present" expr="happy" seed="pay" /></PopProp> });
const Eat = H((s) => [{ at: 0, arm: 'present' }, { at: W(s, 'both.'), arm: 'shrug', expr: 'worried' }], {
  kids: (s) => <g><PopProp at={W(s, 'eat.')} x={1680} y={600}><g><ellipse rx={80} ry={40} fill="#F4F7FA" stroke={OL} strokeWidth={4} /><ellipse cx={0} cy={-14} rx={50} ry={24} fill="#E2B13C" /></g></PopProp><PopProp at={W(s, 'afford')} x={1680} y={420}><text textAnchor="middle" fontFamily="TagBold" fontSize={80} fill="#B3261E">$ ?</text></PopProp></g>,
});
const Invented = H(() => [{ at: 0, arm: 'chin' }, { at: 30, arm: 'finger', expr: 'smile' }]);
const Fixed: React.FC<SP> = ({ s }) => {
  const at = W(s, 'fixed');
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'idle' }, { at, arm: 'fist', expr: 'shock' }]}>
      <Drop at={at} x={1660} y={720} h={800}><g><rect x={-170} y={-100} width={340} height={140} rx={8} fill="#F4EEDD" stroke={OL} strokeWidth={5} /><text x={0} y={-10} textAnchor="middle" fontFamily="TagBold" fontSize={56}>PRICE</text><text x={0} y={30} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#B3261E">SET BY THE STATE</text></g></Drop>
    </HostShot>
  );
};
const NotSuggested = H((s) => [{ at: 0, arm: 'shrug' }, { at: W(s, 'fixed.'), arm: 'fist', expr: 'proud' }]);
const MarketShot: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04, panFrom: [80, 0], panTo: [-80, 0] }}>
    <Market boards={false} />
    <Layer depth={1}>{[0, 1, 2].map((i) => <Chibi key={i} x={380 + i * 560} y={960} s={0.85} outfit={CIV(COLS[i + 3])} hat={i === 1 ? 'veil' : 'turbanW'} hatColor={COLS[i]} legs="walk" item="bundle" pose="carry" expr="happy" seed={'mk' + i} delay={i * 3} />)}</Layer>
  </CameraRig>
);
const Market2: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
    <Market />
    <Layer depth={1}>{[0, 1].map((i) => <Chibi key={i} x={500 + i * 900} y={960} s={0.85} outfit={CIV(COLS[i + 5])} hat="turbanW" pose="shrug" expr="worried" seed={'mk2' + i} />)}</Layer>
  </CameraRig>
);
const Inspect: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.12, focus: [1500, 700] }}>
    <Market />
    <Layer depth={1}>
      <Chibi x={1500} y={960} s={1.0} outfit={MINISTER} hat="turbanW" item="notebook" pose="scribble" expr="normal" seed="insp" />
      <Chibi x={600} y={960} s={0.85} outfit={CIV('#C0392B')} hat="turbanW" pose="idle" expr="worried" seed="merch" />
    </Layer>
  </CameraRig>
);
const Undercover: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'undercover');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06, focus: [960, 700] }}>
        <Market />
        <Layer depth={1}>
          <Chibi x={760} y={960} s={0.95} outfit={CIV('#6E5A48')} hat="turbanW" mustache beard pose={[{ at: 0, pose: 'idle' }, { at: at + 10, pose: 'point' }]} expr={[{ at: 0, expr: 'normal' }, { at: at + 10, expr: 'grin' }]} seed="agent" />
          {/* fake moustache slips (gravity) */}
          {f > at + 24 && <g transform={`translate(760 ${1020 - 205 + Math.min(200, gravityDrop(f, at + 24, { h: 200, g: 1.4, e: 0.3 }).y + 200)})`}><path d="M-30 0 Q-14 -8 0 0 Q14 -8 30 0 Q14 6 0 2 Q-14 6 -30 0 Z" fill="#2B2018" /></g>}
          <Chibi x={1200} y={960} s={0.95} outfit={CIV('#C0392B')} hat="turbanW" pose={[{ at: 0, pose: 'present' }, { at: at + 26, pose: 'bothUp' }]} expr={[{ at: 0, expr: 'happy' }, { at: at + 26, expr: 'shock' }]} seed="merch2" flip />
        </Layer>
      </CameraRig>
      <Label text="(undercover)" x={760} y={600} at={at} size={50} />
    </>
  );
};
const Sketch2: React.FC<SP> = ({ s }) => {
  const id = s.id, A = s.speaker === 'A';
  const minExpr = id === 's2_10' ? 'worried' : id === 's2_12' ? 'shock' : id === 's2_6' ? 'worried' : 'normal';
  const alaExpr = id === 's2_11' ? 'grin' : id === 's2_13' ? 'happy' : id === 's2_7' ? 'angry' : 'calm';
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.02, focus: A ? [1300, 640] : [560, 640] }}>
      <SultanCourt throne={false} />
      <Layer depth={1}>
        <Seat />
        <Chibi x={560} y={800} s={1.15} outfit={ALAUDDIN} hat="sultan" hatColor="#E8862A" mustache legs="sit" pose={id === 's2_7' ? 'point' : id === 's2_13' ? 'wave' : 'cross'} expr={alaExpr} talking={A ? [] : talk(s)} seed="ala" />
        <Chibi x={1360} y={950} s={1.1} outfit={MINISTER} hat="turbanW" beard item="notebook" pose={id === 's2_12' ? 'bothUp' : 'scribble'} expr={minExpr} talking={A ? talk(s) : []} seed="mins" flip />
      </Layer>
    </CameraRig>
  );
};
const Flat: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}><FlatChart p={interpolate(f, [6, s.dur * 0.8], [0, 1])} /></Layer></CameraRig>;
};
const Salary: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
      <Market />
      <Layer depth={1}>
        <Chibi x={interpolate(f, [0, 40], [300, 700], Easing.out)} y={960} s={1.0} outfit={DELHI_SOLDIER} hat="ghurid" legs={f < 40 ? 'walk' : 'stand'} item={f < 60 ? 'coin' : 'bundle'} pose={f < 60 ? 'present' : 'cheer'} expr={f < 60 ? 'normal' : 'grin'} seed="sal" />
        <Chibi x={1000} y={960} s={0.95} outfit={CIV('#D4A017')} hat="turbanW" pose="present" expr="happy" seed="vend" flip />
      </Layer>
    </CameraRig>
  );
};
const Experiment = H(() => [{ at: 0, arm: 'present', expr: 'smile' }, { at: 50, arm: 'point' }]);
const Experiment2 = H(() => [{ at: 0, arm: 'finger', expr: 'proud' }]);
const Died1316: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06 }}>
      <SultanCourt />
      <Layer depth={1}>{f > s.dur * 0.5 && <g transform={`translate(${interpolate(f, [s.dur * 0.5, s.dur], [-200, 700])} 0)`}><Chibi x={0} y={950} s={1.0} outfit={TUGHLAQ} hat="sultan" beard legs="walk" item="book" pose="carry" expr="happy" seed="tgw" /></g>}</Layer>
    </CameraRig>
  );
};
const Brilliant: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06 }}>
    <SultanCourt throne={false} library />
    <Layer depth={1}><Chibi x={960} y={950} s={1.15} outfit={TUGHLAQ} hat="sultan" beard item="book" pose={[{ at: 0, pose: 'scribble' }, { at: W(s, 'brilliant.'), pose: 'raise' }]} expr={[{ at: 0, expr: 'normal' }, { at: W(s, 'brilliant.'), expr: 'grin' }]} seed="tgb" /></Layer>
  </CameraRig>
);
const Brilliant2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const items: [string, string][] = [['languages', 'multiple'], ['mathematics', 'mathematics,'], ['philosophy', 'philosophy,'], ['medicine', 'medicine.']];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.06, zoomTo: 1.1 }}>
        <SultanCourt throne={false} library />
        <Layer depth={1}><Chibi x={960} y={950} s={1.15} outfit={TUGHLAQ} hat="sultan" beard item="book" pose="present" expr="happy" seed="tgb" /></Layer>
      </CameraRig>
      {items.map(([t, w], i) => <div key={t} style={{ position: 'absolute', left: i % 2 ? 1450 : 470, top: 200 + Math.floor(i / 2) * 140, transform: `translate(-50%,-50%) scale(${popScale(f, W(s, w))}) rotate(${i % 2 ? 4 : -4}deg)`, background: '#F4EEDD', border: '4px solid #141414', padding: '6px 22px', fontFamily: 'Hand', fontSize: 52 }}>{t}</div>)}
    </>
  );
};
const BadIdeas = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'catastrophically'), arm: 'shrug', expr: 'worried' }], { kids: (s) => <g><PopProp at={W(s, 'two')} x={1640} y={520}><text textAnchor="middle" fontFamily="TagBold" fontSize={70}>IDEA 1</text></PopProp><PopProp at={W(s, 'two') + 6} x={1640} y={640}><text textAnchor="middle" fontFamily="TagBold" fontSize={70}>IDEA 2</text></PopProp></g> });
const BadIdeas2 = H((s) => [{ at: 0, arm: 'present' }, { at: W(s, 'warning.'), arm: 'point', expr: 'shock' }], { kids: (s) => <PopProp at={W(s, 'warning.')} x={1730} y={520}><g><path d="M0 -120 L120 90 L-120 90 Z" fill="#F2C230" stroke={OL} strokeWidth={8} strokeLinejoin="round" /><text x={0} y={60} textAnchor="middle" fontFamily="TagBold" fontSize={130}>!</text></g></PopProp> });

// =============================================================== ACT 4
const Tughlaq: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.1, focus: [960, 520] }}>
      <SultanCourt />
      <Layer depth={1}><Chibi x={960} y={760} s={1.15} outfit={TUGHLAQ} hat="sultan" beard legs="sit" item="book" pose="present" expr="happy" seed="tgt" /></Layer>
    </CameraRig>
    <Label text="Muhammad bin Tughlaq" x={960} y={110} at={W(s, 'muhammad')} size={66} color="#FFD84A" />
  </>
);
const Idea1 = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'wrong'), arm: 'shrug', expr: 'shock' }], { kids: (s) => <PopProp at={W(s, 'wrong')} x={1730} y={560}><g><rect x={-130} y={-60} width={260} height={120} rx={10} fill="#F4EEDD" stroke={OL} strokeWidth={5} /><text x={0} y={18} textAnchor="middle" fontFamily="TagBold" fontSize={56}>DELHI ?</text></g></PopProp> });
const PointMap: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><InsertBg glow={false} /><Layer depth={1}><SultanateMap x={500} y={-10} s={0.9} grow={2.2} /></Layer></CameraRig>
    <Label text="the empire grows south" x={1470} y={700} at={20} size={52} />
  </>
);
const PointMap2: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.12, focus: [840, 260] }}><InsertBg glow={false} /><Layer depth={1}><SultanateMap x={500} y={-10} s={0.9} grow={2.2} /></Layer></CameraRig>
    <Label text="Delhi (way up here)" x={1150} y={260} at={W(s, 'delhi')} size={52} color="#FFD84A" />
  </>
);
const Reasonable = H((s) => [{ at: 0, arm: 'present' }, { at: W(s, 'reasonable.'), arm: 'finger', expr: 'proud' }]);
const Move: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><InsertBg glow={false} /><Layer depth={1}><CapitalMap x={500} y={-10} s={0.9} progress={interpolate(f, [10, s.dur], [0, 0.55])} /></Layer></CameraRig>
      <Label text="THE ENTIRE CITY" x={1250} y={330} at={6} size={50} color="#FFD84A" />
      <Label text="1,100 km" x={1250} y={460} at={W(s, '1100')} size={64} />
    </>
  );
};
const Move2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.04, zoomTo: 1.06 }}><InsertBg glow={false} /><Layer depth={1}><CapitalMap x={500} y={-10} s={0.9} progress={interpolate(f, [0, s.dur * 0.6], [0.55, 1])} /></Layer></CameraRig>
      <Label text="Daulatabad" x={1100} y={600} at={W(s, 'daulatabad.')} size={64} color="#FFD84A" />
    </>
  );
};
const City = H(() => [{ at: 0, arm: 'finger' }, { at: 40, arm: 'present' }], { kids: () => <PopProp at={20} x={1730} y={560}><Doc title="GOVERNMENT" lines={3} /></PopProp> });
const City2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'move');
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'idle' }, { at, arm: 'fist', expr: 'shock' }]}>
      {/* a whole little city slides in, buildings wobbling on springs */}
      {[0, 1, 2, 3].map((i) => {
        const k = spring(Math.max(0, f - at - i * 3), { damping: 8, stiffness: 120 });
        return <g key={i} transform={`translate(${1560 + i * 90} 960) scale(1 ${k})`}><rect x={-40} y={-140 - (i % 2) * 60} width={80} height={140 + (i % 2) * 60} fill={COLS[i]} stroke={OL} strokeWidth={4} /><path d={`M-48 ${-140 - (i % 2) * 60} L0 ${-190 - (i % 2) * 60} L48 ${-140 - (i % 2) * 60} Z`} fill="#6E4A30" stroke={OL} strokeWidth={4} /></g>;
      })}
    </HostShot>
  );
};
const MarchShot: React.FC<SP & { back?: boolean }> = ({ s, back }) => {
  const f = useCurrentFrame();
  const people: [Outfit, string][] = [[NOBLE('#2E6B4A'), 'sultan'], [MINISTER, 'turbanW'], [CIV('#C07A9C'), 'hairlong'], [CIV('#2E86C1'), 'turbanW'], [CIV('#E8862A'), 'veil'], [CIV('#16A085'), 'hair']];
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}>
      <HotRoad />
      <Layer depth={1}>
        {people.map(([o, h], i) => <Chibi key={i} x={back ? interpolate(f, [0, s.dur], [2000, 1200]) - i * -190 : interpolate(f, [0, s.dur], [-200, 600]) + i * 190} y={890 + (i % 2) * 20} s={0.85} outfit={o} hat={h} item={i % 2 ? 'bundle' : undefined} itemL={i % 3 === 0 ? 'book' : undefined} legs="walk" pose={i % 2 ? 'carry' : 'idle'} expr={f > s.dur * 0.5 ? 'sad' : 'worried'} seed={'mr' + i} delay={i * 3} flip={back} />)}
      </Layer>
    </CameraRig>
  );
};
const March: React.FC<SP> = ({ s }) => <MarchShot s={s} />;
const March2: React.FC<SP> = ({ s }) => (
  <>
    <MarchShot s={s} />
    <Label text="in the heat" x={1500} y={430} at={W(s, 'heat.')} size={60} color="#B3261E" />
  </>
);
const Road: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.08, focus: [960, 820] }}>
    <HotRoad />
    <Layer depth={1}>
      {/* restrained: only abandoned bundles and sandals on the road */}
      {[[500, 960], [820, 990], [1180, 970], [1500, 1000]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d="M-36 20 Q-44 -20 0 -28 Q44 -20 36 20 Q0 28 -36 20 Z" fill="#C9A47A" stroke={OL} strokeWidth={3} />
          <ellipse cx={60} cy={24} rx={16} ry={6} fill="#6B4A2B" />
        </g>
      ))}
    </Layer>
  </CameraRig>
);
const Arrived: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
    <SultanCourt />
    <Layer depth={1}><Chibi x={960} y={760} s={1.15} outfit={TUGHLAQ} hat="sultan" beard legs="sit" pose="chin" expr="normal" seed="tga" /></Layer>
  </CameraRig>
);
const Arrived2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><InsertBg glow={false} /><Layer depth={1}><CapitalMap x={500} y={-10} s={0.9} progress={1} dropouts={false} /></Layer></CameraRig>
      <Label text="frontier" x={980} y={130} at={W(s, 'northern')} size={52} color="#FFD84A" />
      <Label text="too far!" x={1100} y={640} at={W(s, 'far')} size={70} color="#B3261E" />
    </>
  );
};
const Back: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><InsertBg glow={false} /><Layer depth={1}><CapitalMap x={500} y={-10} s={0.9} progress={interpolate(f, [8, s.dur], [0, 1])} back /></Layer></CameraRig>
      <Label text="...and back again" x={1300} y={420} at={10} size={60} color="#FFD84A" />
    </>
  );
};
const ForNothing = H((s) => [{ at: 0, arm: 'idle', expr: 'worried' }, { at: W(s, 'nothing.'), arm: 'shrug', expr: 'shock' }]);
const Idea2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'money.');
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'finger' }, { at, arm: 'present', expr: 'grin' }]}>
      {[...Array(10)].map((_, i) => <Drop key={i} at={at + i * 2} x={1600 + (i % 5) * 50} y={960 - Math.floor(i / 5) * 30} h={800 + i * 40} e={0.45}><ellipse rx={26} ry={9} fill="#C98A3A" stroke={OL} strokeWidth={3} /></Drop>)}
    </HostShot>
  );
};
const CoinFace: React.FC<{ x: number; y: number; r?: number; metal: 'silver' | 'brass'; label?: string }> = ({ x, y, r = 120, metal, label }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={metal === 'silver' ? '#C9D0D6' : '#C98A3A'} stroke={OL} strokeWidth={6} />
    <circle r={r * 0.8} fill="none" stroke={metal === 'silver' ? '#9AA1AC' : '#9A6A2A'} strokeWidth={5} />
    <text x={0} y={18} textAnchor="middle" fontFamily="TagBold" fontSize={r * 0.42} fill={metal === 'silver' ? '#5A5F66' : '#5A3A16'}>{label ?? '1'}</text>
  </g>
);
const Silver: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [6, s.dur], [1, 0.25]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg /><Layer depth={1}>{[...Array(12)].map((_, i) => i / 12 < k ? <CoinFace key={i} x={500 + (i % 6) * 180} y={420 + Math.floor(i / 6) * 220} r={80} metal="silver" /> : null)}</Layer></CameraRig>
      <Label text="silver running short" x={960} y={140} at={10} size={60} color="#FFD84A" />
    </>
  );
};
const Token: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><InsertBg /><Layer depth={1}>
        <PopProp at={6} x={620} y={500}><CoinFace x={0} y={0} r={170} metal="silver" /></PopProp>
        <PopProp at={W(s, 'brass')} x={1300} y={500}><CoinFace x={0} y={0} r={170} metal="brass" /></PopProp>
        <PopProp at={W(s, 'same')} x={960} y={500}><text textAnchor="middle" y={30} fontFamily="TagBold" fontSize={140} fill="#fff">=</text></PopProp>
      </Layer></CameraRig>
      <Label text="silver" x={620} y={260} at={6} size={56} /><Label text="brass (officially worth the same)" x={1300} y={260} at={W(s, 'brass')} size={46} color="#FFD84A" />
    </>
  );
};
const Modern = H((s) => [{ at: 0, arm: 'present' }, { at: W(s, 'ahead'), arm: 'finger', expr: 'proud' }], { kids: () => <PopProp at={30} x={1730} y={560}><g><rect x={-150} y={-70} width={300} height={140} rx={10} fill="#A8C49A" stroke={OL} strokeWidth={5} /><circle r={40} fill="none" stroke="#3E6B3A" strokeWidth={5} /><text x={0} y={14} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#3E6B3A">100</text></g></PopProp> });
const Forgot = H(() => [{ at: 0, arm: 'finger', expr: 'smile' }, { at: 40, arm: 'chin', expr: 'worried' }]);
const Split: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const stamp = (t: number) => Math.abs(Math.sin((t * Math.PI) / 20)) * 60;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <Mint /><Kitchen />
        <path d="M960 0 V1080" stroke="#141414" strokeWidth={10} />
        {/* mint: press stamps up and down */}
        <g transform={`translate(480 ${520 - stamp(f)})`}><rect x={-70} y={-260} width={140} height={200} fill="#7A7F8C" stroke={OL} strokeWidth={4} /><rect x={-20} y={-380} width={40} height={120} fill="#5A5F66" /></g>
        <rect x={360} y={560} width={240} height={60} fill="#5A3E26" stroke={OL} strokeWidth={4} />
        <Chibi x={250} y={950} s={0.9} outfit={MINISTER} hat="turbanW" pose="present" expr="normal" seed="minter" />
        {/* kitchen: pan melting over fire */}
        <g transform="translate(1440 640)">
          <path d={`M-90 0 Q0 ${20 + Math.min(40, f * 0.6)} 90 0`} fill="#C98A3A" stroke={OL} strokeWidth={4} />
          <rect x={90} y={-6} width={120} height={14} rx={6} fill="#5A3E26" stroke={OL} strokeWidth={3} />
          {[...Array(3)].map((_, i) => <path key={i} d={`M${-50 + i * 50} 70 Q${-60 + i * 50 + Math.sin(f / 2 + i) * 6} 30 ${-50 + i * 50} ${10 - (f % 4) * 2} Q${-40 + i * 50} 30 ${-50 + i * 50} 70`} fill="#FF6A00" />)}
        </g>
        <Chibi x={1750} y={950} s={0.9} outfit={CIV('#E8862A')} hat="turbanW" mustache pose="present" expr="grin" seed="baker" flip />
        {/* both produce identical coins, dropping with gravity */}
        {[0, 1, 2].map((i) => {
          const a = gravityDrop(f, 18 + i * 14, { h: 260, g: 1.8, e: 0.4 }), b = gravityDrop(f, 22 + i * 14, { h: 260, g: 1.8, e: 0.4 });
          return <g key={i}>{f > 18 + i * 14 && <g transform={`translate(${420 + i * 60} ${900 + a.y}) scale(${a.sx} ${a.sy})`}><CoinFace x={0} y={0} r={34} metal="brass" /></g>}{f > 22 + i * 14 && <g transform={`translate(${1380 + i * 60} ${900 + b.y}) scale(${b.sx} ${b.sy})`}><CoinFace x={0} y={0} r={34} metal="brass" /></g>}</g>;
        })}
      </svg>
      <Label text="identical" x={960} y={820} at={60} size={60} color="#FFD84A" />
    </>
  );
};
const Treasury: React.FC = () => <TempleVault />;
const Sketch3: React.FC<SP> = ({ s }) => {
  const id = s.id, A = s.speaker === 'A';
  const f = useCurrentFrame();
  const tgExpr = id === 's3_6' || id === 's3_9' ? 'shock' : id === 's3_2' || id === 's3_4' ? 'happy' : id === 's3_13' ? 'worried' : 'calm';
  const trExpr = id === 's3_14' ? 'grin' : id === 's3_5' || id === 's3_10' ? 'worried' : 'normal';
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.02, focus: A ? [1300, 640] : [560, 640] }}>
      <SultanCourt throne={false} />
      <Layer depth={1}>
        <Seat />
        {/* heaps of brass coins */}
        {[...Array(18)].map((_, i) => <ellipse key={i} cx={820 + (i % 6) * 40} cy={1010 - Math.floor(i / 6) * 14} rx={24} ry={9} fill="#C98A3A" stroke={OL} strokeWidth={2} />)}
        <Chibi x={560} y={800} s={1.15} outfit={TUGHLAQ} hat="sultan" beard legs="sit" pose={id === 's3_2' ? 'cheer' : id === 's3_9' || id === 's3_6' ? 'shrug' : 'cross'} expr={tgExpr} talking={A ? [] : talk(s)} seed="tgs" />
        <Chibi x={1360} y={950} s={1.1} outfit={MINISTER} hat="turbanW" beard item={id === 's3_10' ? 'coin' : 'notebook'} pose={id === 's3_10' ? 'present' : 'scribble'} expr={trExpr} talking={A ? talk(s) : []} seed="trs" flip />
        {id === 's3_14' && <g transform={`translate(${interpolate(f, [0, s.dur], [2100, 1660])} 1010)`}><Critter kind="goat" x={0} y={0} s={1.2} flip /></g>}
      </Layer>
    </CameraRig>
  );
};
const Cancel: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
      <SultanCourt throne={false} />
      <Layer depth={1}>
        {/* a long queue trades brass for silver */}
        {[0, 1, 2, 3, 4].map((i) => <Chibi key={i} x={interpolate(f, [0, s.dur], [1300, 1100]) + i * 160} y={950} s={0.8} outfit={CIV(COLS[i])} hat={i === 2 ? 'veil' : 'turbanW'} item="sack" pose="carry" expr="grin" seed={'q' + i} flip />)}
        <Chibi x={560} y={950} s={1.0} outfit={MINISTER} hat="turbanW" item="coin" pose="present" expr="worried" seed="pay2" />
        <CoinBurst x={760} y={820} at={10} seed="cn1" /><CoinBurst x={800} y={820} at={40} seed="cn2" />
      </Layer>
    </CameraRig>
  );
};
const Emptied: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.08 }}>
    <TempleVault emptied={1} />
    <Layer depth={1}><Chibi x={960} y={955} s={1.1} outfit={TUGHLAQ} hat="sultan" beard pose="shrug" expr="sad" seed="tge" /></Layer>
  </CameraRig>
);
const Battuta: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06 }}>
      <Study />
      <Layer depth={1}><Chibi x={960} y={950} s={1.15} outfit={BATTUTA} hat="turbanW" beard item="notebook" pose="scribble" expr="normal" seed="bat" /></Layer>
    </CameraRig>
    <Label text="Ibn Battuta" x={960} y={110} at={W(s, 'ibn')} size={70} color="#FFD84A" />
    <Label text="Moroccan traveller & judge" x={960} y={200} at={W(s, 'moroccan')} size={48} />
  </>
);
const Battuta2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><InsertBg /><Layer depth={1}>
        <g transform="translate(960 520)"><path d="M0 -250 L-420 -280 L-420 260 L0 290 Z M0 -250 L420 -280 L420 260 L0 290 Z" fill="#F4EEDD" stroke={OL} strokeWidth={6} />
          {[...Array(9)].map((_, i) => <path key={i} d={`M-380 ${-200 + i * 50} L${-380 + Math.min(340, Math.max(0, (f - i * 6) * 12))} ${-196 + i * 50}`} stroke="#3A2A1E" strokeWidth={5} strokeLinecap="round" />)}
          {[...Array(9)].map((_, i) => <path key={i} d={`M40 ${-210 + i * 50} L${40 + Math.min(340, Math.max(0, (f - 54 - i * 6) * 12))} ${-214 + i * 50}`} stroke="#3A2A1E" strokeWidth={5} strokeLinecap="round" />)}
        </g>
      </Layer></CameraRig>
      <Label text="the Rihla" x={960} y={110} at={6} size={64} color="#FFD84A" />
    </>
  );
};
const LikePlea: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'wave', expr: 'smile' }, { at: 30, arm: 'fist', expr: 'grin' }]}>
      <PopProp at={20} x={1700} y={480}><g><rect x={-90} y={-70} width={180} height={140} rx={30} fill="#2E86C1" stroke={OL} strokeWidth={6} /><path d="M-40 40 V-10 L0 -50 Q20 -60 16 -30 L10 -10 H50 Q66 -6 60 14 L48 44 Q42 54 30 54 H-40 Z" fill="#fff" stroke={OL} strokeWidth={4} /></g></PopProp>
      <PopProp at={40} x={1720} y={900}><g><path d="M-120 -40 L120 -40 L90 40 L-90 40 Z" fill="#7A5A30" stroke={OL} strokeWidth={5} />{[...Array(7)].map((_, i) => <ellipse key={i} cx={-80 + i * 26} cy={-48 - (i % 2) * 10} rx={20} ry={8} fill="#C98A3A" stroke={OL} strokeWidth={2} />)}<circle cx={-60} cy={60} r={24} fill="#4A3A2A" stroke={OL} strokeWidth={4} /><path d="M120 -30 L200 -60" stroke={OL} strokeWidth={8} /></g></PopProp>
    </HostShot>
  );
};
const LikePlea2 = H((s) => [{ at: 0, arm: 'present' }, { at: W(s, 'free.'), arm: 'fist', expr: 'grin' }], { kids: (s) => <PopProp at={W(s, 'free.')} x={1720} y={520}><g><rect x={-130} y={-60} width={260} height={120} rx={12} fill="#2E9A4A" stroke={OL} strokeWidth={5} /><text x={0} y={20} textAnchor="middle" fontFamily="TagBold" fontSize={60} fill="#fff">FREE</text></g></PopProp> });
const Stay = H(() => [{ at: 0, arm: 'finger' }, { at: 50, arm: 'point', expr: 'normal' }], { kids: () => <g><PopProp at={20} x={1640} y={700}><g><path d="M-60 40 Q-70 -10 -20 -30 L-26 -44 L26 -44 L20 -30 Q70 -10 60 40 Z" fill="#C9A47A" stroke={OL} strokeWidth={4} /></g></PopProp></g> });
const Flash: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const white = f < 4 ? 1 - f / 4 : f > s.dur - 4 ? (f - (s.dur - 4)) / 4 : 0;
  const flicker = 0.92 + random('fl' + Math.floor(f / 2)) * 0.08;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.05, zoomTo: 1.0 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#3A2E24" /></Layer>
        <Layer depth={1}>
          <g transform="translate(700 520) rotate(-4)">
            <rect x={-360} y={-380} width={720} height={760} fill="#F1E2C0" stroke={OL} strokeWidth={6} />
            <text x={0} y={-310} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#3A2A1E">LEDGER — DIVIDENDS</text>
            {[...Array(10)].map((_, i) => <g key={i}><path d={`M-320 ${-250 + i * 56} H320`} stroke="#C9B79A" strokeWidth={3} /><text x={-300} y={-260 + i * 56} fontFamily="Hand" fontSize={34} fill="#3A2A1E">£ {(i + 3) * 1170}</text></g>)}
            <path d="M80 300 q40 -50 80 0 q40 50 80 -10 q30 -40 60 10" stroke="#1E3A8A" strokeWidth={6} fill="none" strokeDasharray="500" strokeDashoffset={500 * Math.max(0, 1 - (f - 20) / 30)} />
          </g>
          <CompanyFlag x={1260} y={230} s={2.0} wave={Math.sin(f / 4) * 8} />
          <line x1={1260} y1={230} x2={1260} y2={960} stroke="#6B4A2B" strokeWidth={12} />
        </Layer>
      </CameraRig>
      <div style={{ position: 'absolute', inset: 0, background: '#E8C080', mixBlendMode: 'multiply', opacity: 0.35 * flicker }} />
      <div style={{ position: 'absolute', left: 40, top: 40, fontFamily: 'TagBold', fontSize: 40, color: '#FFD84A' }}>▶▶ FLASH FORWARD: 1757</div>
      {white > 0 && <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: white }} />}
    </>
  );
};
const Flash2 = H((s) => [{ at: 0, arm: 'present' }, { at: W(s, 'bribe,'), arm: 'shrug', expr: 'shock' }], { kids: (s) => <PopProp at={W(s, 'bribe,')} x={1720} y={560}><CompanyFlag x={-100} y={-90} s={1} /></PopProp> });
const Flash3 = H(() => [{ at: 0, arm: 'finger', expr: 'worried' }], { spot: () => ({ at: 20, text: 'stay tuned', x: 1700, y: 170 }) });
const Breakaway: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 0.95, shakes: [{ at: 20, amp: 4 }, { at: 36, amp: 4 }, { at: 52, amp: 4 }] }}>
    <InsertBg glow={false} />
    <Layer depth={1}><BreakingMap x={500} y={-10} s={0.9} starts={[20, 36, 52, 68, 84, 100]} /></Layer>
  </CameraRig>
);
const Brothers: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
    <Boulders />
    <Layer depth={1}>
      <Chibi x={760} y={950} s={1.0} outfit={{ top: '#C0392B', bottom: '#F1E6D0', belt: '#E2B13C' }} hat="pagri" hatColor="#E8862A" mustache item="banner" pose="raise" expr="happy" seed="hari" />
      <Chibi x={1060} y={950} s={1.0} outfit={{ top: '#2E86C1', bottom: '#F1E6D0', belt: '#E2B13C' }} hat="pagri" hatColor="#D4A017" mustache pose="point" expr="grin" seed="bukka" flip />
    </Layer>
  </CameraRig>
);
const Brothers2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.15, focus: [960, 500] }}>
        <Boulders sun />
        <Layer depth={0.8}>
          {[0, 1, 2, 3, 4].map((i) => {
            const k = spring(Math.max(0, f - 20 - i * 6), { damping: 10, stiffness: 120 });
            return <g key={i} transform={`translate(${560 + i * 200} 640) scale(1 ${k})`}><path d={`M-60 0 L-60 -${120 + (i % 2) * 80} L0 -${200 + (i % 2) * 100} L60 -${120 + (i % 2) * 80} L60 0 Z`} fill="#D8B47E" stroke={OL} strokeWidth={4} /><path d={`M0 -${200 + (i % 2) * 100} V-${240 + (i % 2) * 100}`} stroke="#E2B13C" strokeWidth={6} /></g>;
          })}
        </Layer>
      </CameraRig>
      <Label text="Vijayanagara" x={960} y={110} at={30} size={70} color="#FFD84A" />
    </>
  );
};

export const SHOTS_B1: Record<string, React.FC<SP>> = {
  aibak_intro: AibakIntro, explain: Explain, training: Training, training2: Training2, owed: Owed, owed2: Owed2, policy: Policy,
  sultan: Sultan, sultan2: Sultan2, tower: Tower, minar: Minar, minar2: Minar2, polo: Polo, polo2: Polo2, sport: Sport,
  sultanate: SultanateIns, sultanate2: SultanateIns2, detail: Detail, woman: Woman, razia_walk: RaziaWalk, sons: Sons, sons2: Sons2,
  heir: Heir, razia_sits: RaziaSits, razia_army: RaziaArmy, nobles: Nobles, empty: Empty, sevenhundred: SevenHundred, survived: Survived,
  horde: Horde, horde2: Horde2,
  mongolmap: MongolMap, finished: Finished, alauddin: Alauddin, alauddin2: Alauddin2, river: River, river2: River2, tense: Tense, annoying: Annoying,
  arrows: Arrows, walls: Walls, beatback: BeatBack, forts: Forts, army: Army, nevertook: NeverTook, pay: Pay, eat: Eat, invented: Invented,
  fixed: Fixed, notsuggested: NotSuggested, market: MarketShot, market2: Market2, inspect: Inspect, undercover: Undercover, sketch2: Sketch2,
  flat: Flat, salary: Salary, experiment: Experiment, experiment2: Experiment2, died1316: Died1316, brilliant: Brilliant, brilliant2: Brilliant2,
  badideas: BadIdeas, badideas2: BadIdeas2,
  tughlaq: Tughlaq, idea1: Idea1, point: PointMap, point2: PointMap2, reasonable: Reasonable, move: Move, move2: Move2, city: City, city2: City2,
  march: March, march2: March2, road: Road, arrived: Arrived, arrived2: Arrived2, back: Back, fornothing: ForNothing, idea2: Idea2,
  silver: Silver, token: Token, modern: Modern, forgot: Forgot, split: Split, sketch3: Sketch3, cancel: Cancel, emptied: Emptied,
  battuta: Battuta, battuta2: Battuta2, likeplea: LikePlea, likeplea2: LikePlea2, stay: Stay, flash: Flash, flash2: Flash2, flash3: Flash3,
  breakaway: Breakaway, brothers: Brothers, brothers2: Brothers2,
};

import { Tree } from '@engine/scenes/Parts';
