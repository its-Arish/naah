// Acts 8–10: Nadir Shah, the Company, 1857 and the Raj.
import React from 'react';
import { useCurrentFrame, interpolate, Easing, popScale, onTwos, random, gravityDrop, projectile, spring } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { HostKey } from '@engine/characters/Host';
import { Chibi, Outfit } from '@engine/characters/Chibi';
import { InsertBg, GreyStage } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { Label } from '@engine/fx/Overlays';
import { Horse, Camel, Elephant, DelhiGate, Plain, Tent, TentInterior, Tally, CoinBurst, subPath, KingdomMap } from '@engine/scenes/India';
import { SultanCourt, Study, BreakingMap, CompanyFlag } from '@engine/scenes/IndiaB1';
import { MughalMap, PeacockThrone } from '@engine/scenes/IndiaB2';
import { EmptyStreet, RouteMap, TowerLondon, CompanyCoast, TroopBlocks, EmptyVillage, RevenueLedger, Westminster, RailMap, Factory, Loom } from '@engine/scenes/IndiaB3';
import { SP, talk, wordAt, Rider, HostShot, Drop, DropHtml, PieShot } from './ShotsIndia';
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

// ------------------------------------------------------------- cast
const NADIR: Outfit = { top: '#7A1F2B', robe: true, trim: '#E2B13C', belt: '#E2B13C' };
const QIZIL: Outfit = { top: '#7A1F2B', bottom: '#3A2A1E', belt: '#E2B13C' };
const MUGHAL_SOLDIER: Outfit = { top: '#2E6B4A', bottom: '#3A2A1E', belt: '#C9962C' };
const CLIVE: Outfit = { top: '#C0392B', bottom: '#F4F7FA', belt: '#F4F7FA', sash: '#E2B13C' };
const REDCOAT: Outfit = { top: '#C0392B', bottom: '#F4F7FA', belt: '#F4F7FA', sash: '#F4F7FA' };
const SEPOY: Outfit = { top: '#C0392B', bottom: '#F4F7FA', belt: '#F4F7FA' };
const SIRAJ: Outfit = { top: '#2E5E8C', robe: true, trim: '#E2B13C' };
const MIRJAFAR: Outfit = { top: '#C9962C', robe: true, trim: '#7A2A22' };
const ZAFAR: Outfit = { top: '#E8E2D6', robe: true, trim: '#C9962C' };
const MARATHA: Outfit = { top: '#F1E6D0', bottom: '#E8862A', belt: '#E8862A', sash: '#B3261E' };
const AFGHAN: Outfit = { top: '#3E6B3A', bottom: '#3A2A1E', belt: '#C9962C' };
const Nadir = (p: any) => <Chibi outfit={NADIR} hat="nadiri" beard {...p} />;
const Clive = (p: any) => <Chibi outfit={CLIVE} hat="tricorn" {...p} />;
const Zafar = (p: any) => <Chibi outfit={ZAFAR} hat="skullcap" beard beardColor="#F4F7FA" {...p} />;

/** Grey "restrained" card: no motion, quiet. */
const Quiet: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>;

// =============================================================== ACT 8
const NadirS: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.08, focus: [960, 560] }}>
      <Plain tents={false} />
      <Layer depth={1}><Rider x={960} y={960} s={1.1} horse="#3A2A22" rider={{ outfit: NADIR, hat: 'nadiri', beard: true, item: 'sword', pose: 'idle', expr: 'determined', seed: 'nadr' }} /></Layer>
    </CameraRig>
    <Label text="Nadir Shah" x={960} y={110} at={W(s, 'nadir')} size={80} color="#FFD84A" />
  </>
);
const NoLock = H((s) => [{ at: 0, arm: 'present' }, { at: W(s, 'lock'), arm: 'shrug', expr: 'grin' }], {
  kids: (s) => <PopProp at={W(s, 'rich')} x={1730} y={620}><g><rect x={-120} y={-200} width={240} height={360} fill="#8C5A2A" stroke={OL} strokeWidth={6} /><circle cx={80} cy={0} r={12} fill="#E2B13C" />{popScale(useCurrentFrame(), W(s, 'lock')) > 0 && <g transform="translate(150 -40)"><path d="M-30 0 V-30 Q0 -60 30 -30 V0" stroke="#7A7F8C" strokeWidth={8} fill="none" /><rect x={-40} y={0} width={80} height={60} fill="#C9C0B0" stroke={OL} strokeWidth={4} /><path d="M-60 -70 L60 90 M60 -70 L-60 90" stroke="#B3261E" strokeWidth={12} /></g>}</g></PopProp>,
});
const Karnal: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05, shakes: [{ at: 30, amp: 7, len: 10 }] }}>
        <Plain tents={false} />
        <Layer depth={1}>
          {[0, 1, 2].map((i) => <Rider key={'n' + i} x={200 + i * 160 + interpolate(f, [0, 30], [0, 400], Easing.in)} y={970 - (i % 2) * 24} s={0.82} gait="gallop" phase={i * 4} horse="#3A2A22" rider={{ outfit: i ? QIZIL : NADIR, hat: 'nadiri', beard: true, item: 'sword', pose: 'attack', expr: 'grin', seed: 'kn' + i }} />)}
          {[0, 1, 2].map((i) => <Rider key={'m' + i} x={1500 + i * 140 + (f > 30 ? interpolate(f, [30, s.dur], [0, 700], Easing.in) : 0)} y={970 - (i % 2) * 24} s={0.82} flip={f < 30} gait={f > 30 ? 'gallop' : 'idle'} phase={i * 3} horse="#F4F7FA" rider={{ outfit: MUGHAL_SOLDIER, hat: 'turbanW', item: 'spear', pose: f > 30 ? 'bothUp' : 'hold', expr: f > 30 ? 'shock' : 'determined', seed: 'km' + i }} />)}
        </Layer>
      </CameraRig>
      <Label text="Karnal, 1739" x={960} y={110} at={W(s, 'karnal')} size={70} color="#FFD84A" />
    </>
  );
};
const Orderly: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
      <DelhiGate dusk={false} />
      <Layer depth={1}>{[0, 1, 2, 3].map((i) => <Chibi key={i} x={interpolate(f, [0, s.dur], [300, 800]) + i * 170} y={960} s={0.85} outfit={QIZIL} hat="nadiri" beard item="spear" legs="march" expr="normal" seed={'or' + i} delay={i * 3} />)}</Layer>
    </CameraRig>
  );
};
const Rumour: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
      <DelhiGate dusk={false} />
      <Layer depth={1}>
        {[0, 1, 2, 3, 4].map((i) => <Chibi key={i} x={260 + i * 340} y={960} s={0.85} outfit={CIV(COLS[i])} hat={i % 2 ? 'veil' : 'turbanW'} hatColor={COLS[i + 2]} pose={f > 10 + i * 10 ? 'present' : 'idle'} expr={f > 14 + i * 10 ? 'shock' : 'normal'} talking={[[10 + i * 10, 20 + i * 10]]} seed={'ru' + i} flip={i % 2 === 1} />)}
        {[0, 1, 2, 3].map((i) => f > 14 + i * 10 && <text key={i} x={360 + i * 340} y={640 - ((f - i * 10) % 30)} fontFamily="Hand" fontSize={42} fill="#141414">psst!</text>)}
      </Layer>
    </CameraRig>
  );
};
const SeveralK: React.FC<SP> = ({ s }) => <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.02 }}><EmptyStreet smoke={false} dim={0.25} /></CameraRig>;
const Massacre: React.FC<SP> = ({ s }) => <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><EmptyStreet /></CameraRig>;
const Massacre2: React.FC<SP> = ({ s }) => <CameraRig move={{ zoomFrom: 1.03, zoomTo: 1.05 }}><EmptyStreet dim={0.5} /></CameraRig>;
const Emptying: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03, panFrom: [-40, 0], panTo: [60, 0] }}>
      <DelhiGate dusk />
      <Layer depth={1}>
        {[0, 1, 2, 3, 4].map((i) => <Camel key={i} x={interpolate(f, [0, s.dur], [500, 1500]) + i * 220} y={960} s={0.8} phase={i * 3} />)}
        <CoinBurst x={760} y={760} at={30} seed="em1" /><CoinBurst x={980} y={770} at={60} seed="em2" />
      </Layer>
    </CameraRig>
  );
};
const ThroneLeaves: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
      <DelhiGate dusk />
      <Layer depth={1}>
        <g transform={`translate(${interpolate(f, [0, s.dur], [400, 1500], Easing.in)} 0)`}>
          <Elephant x={240} y={960} s={0.8} walk howdah={false} />
          <rect x={-200} y={880} width={420} height={60} fill="#8C5A2A" stroke={OL} strokeWidth={4} />
          {[-140, 160].map((cx) => <circle key={cx} cx={cx} cy={950} r={34} fill="#6B4A2B" stroke={OL} strokeWidth={4} />)}
          <PeacockThrone x={10} y={880} s={0.55} glow={0.6} />
        </g>
      </Layer>
    </CameraRig>
  );
};
const Route: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}><g transform="translate(0 60)"><RouteMap p={interpolate(f, [6, s.dur - 10], [0, 1], Easing.inOut)} order={['Delhi', 'Persia', 'Afghanistan', 'Punjab', 'London']} /></g></Layer></CameraRig>
      {[['Delhi', 1380, 640], ['Persia', 1000, 590], ['Afghanistan', 1180, 400], ['Punjab', 1320, 470], ['London', 300, 380]].map(([n, x, y]) => <Label key={n as string} text={n as string} x={x as number} y={y as number} at={n === 'Delhi' ? 4 : W(s, (n as string).toLowerCase() + (n === 'London' ? ',' : ''))} size={40} />)}
    </>
  );
};
const TowerS: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><TowerLondon /></CameraRig>
      <div style={{ position: 'absolute', left: 1440, top: 560, width: 300, height: 260, transform: `scale(${popScale(f, 10)})`, transformOrigin: 'center', background: 'rgba(207,232,242,0.35)', border: '6px solid #E8F4F8', borderRadius: 10 }} >
        <svg width={300} height={260}><circle cx={150} cy={120} r={70} fill="url(#whiteGlow)" /><path d="M150 84 L186 116 L170 160 L130 160 L114 116 Z" fill="#E8F4FF" stroke="#141414" strokeWidth={4} /><rect x={20} y={200} width={260} height={40} fill="#5A3E26" /></svg>
      </div>
      <Label text="Tower of London" x={960} y={110} at={W(s, 'tower')} size={66} color="#FFD84A" />
    </>
  );
};
const TaxHoliday: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
      <SultanCourt />
      <Layer depth={1}>
        {[0, 1, 2, 3].map((i) => <Chibi key={i} x={300 + i * 440} y={950} s={0.9} outfit={CIV(COLS[i + 1])} hat="turbanW" beard pose={f > W(s, 'three') ? 'cheer' : 'idle'} expr={f > W(s, 'three') ? 'grin' : 'normal'} seed={'th' + i} />)}
        <Drop at={W(s, 'three')} x={960} y={420} h={500}><g><rect x={-330} y={-60} width={660} height={120} rx={10} fill="#2E9A4A" stroke={OL} strokeWidth={6} /><text y={22} textAnchor="middle" fontFamily="TagBold" fontSize={56} fill="#fff">NO TAXES × 3 YEARS</text></g></Drop>
      </Layer>
    </CameraRig>
  );
};
const OneRobbery = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'holiday.'), arm: 'present', expr: 'grin' }], { kids: (s) => <PopProp at={W(s, 'holiday.')} x={1730} y={560}><g><rect x={-120} y={-80} width={240} height={160} rx={10} fill="#F4EEDD" stroke={OL} strokeWidth={5} /><text y={-20} textAnchor="middle" fontFamily="TagBold" fontSize={30}>TAX BILL</text><text y={40} textAnchor="middle" fontFamily="TagBold" fontSize={60} fill="#2E9A4A">£0</text></g></PopProp> });
const Technically = H((s) => [{ at: 0, arm: 'present' }, { at: W(s, 'only'), arm: 'shrug', expr: 'worried' }]);
const BrokeApart: React.FC<SP> = ({ s }) => <CameraRig move={{ zoomFrom: 1.0, zoomTo: 0.96 }}><InsertBg glow={false} /><Layer depth={1}><BreakingMap x={500} y={-10} s={0.9} starts={[10, 24, 38, 52, 66, 80]} /></Layer></CameraRig>;
const MarathaNorth: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [10, s.dur * 0.8], [0, 1], Easing.inOut);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}>
        <InsertBg glow={false} />
        <Layer depth={1}>
          <g transform="translate(500 -10) scale(0.9)">
            <path d={subPath()} fill="#E8DCC0" stroke={OL} strokeWidth={6} />
            <circle cx={340} cy={700} r={80 + k * 260} fill="#E8862A" opacity={0.8} />
            <path d={`M340 700 L${340 + (380 - 340) * k} ${700 + (300 - 700) * k}`} stroke="#B3261E" strokeWidth={20} strokeLinecap="round" />
            <circle cx={380} cy={300} r={16} fill="#FFD84A" stroke={OL} strokeWidth={4} />
          </g>
        </Layer>
      </CameraRig>
      <Label text="Marathas" x={1450} y={700} at={W(s, 'marathas,')} size={64} color="#E8862A" />
      <Label text="Delhi" x={1000} y={240} at={W(s, 'delhi.')} size={52} color="#FFD84A" />
    </>
  );
};
/** Panipat 1761: same field framing as 1526; saffron block attacks green, then saffron collapses. */
const Panipat1761: React.FC<{ s: Shot; collapse: [number, number] }> = ({ s, collapse }) => {
  const f = useCurrentFrame();
  const c = interpolate(f, collapse, [0, 1], Easing.out);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <rect width={1920} height={1080} fill="#C4B98A" />
        {[...Array(20)].map((_, i) => <path key={i} d={`M${random('px' + i) * 1920} ${random('py' + i) * 1080} l14 -6`} stroke="#A89C6A" strokeWidth={3} />)}
        {[...Array(48)].map((_, i) => { const col = i % 8, row = Math.floor(i / 8); const dx = c * (random('mx' + i) - 0.8) * 500, dy = c * (random('my' + i) - 0.5) * 300; return <rect key={'m' + i} x={420 + col * 50 + dx} y={170 + row * 130 + dy} width={36} height={36} fill="#E8862A" stroke={OL} strokeWidth={2} opacity={1 - c * 0.5} transform={`rotate(${c * (random('mr' + i) - 0.5) * 140} ${438 + col * 50 + dx} ${188 + row * 130 + dy})`} />; })}
        {[...Array(48)].map((_, i) => { const col = i % 8, row = Math.floor(i / 8); return <rect key={'a' + i} x={1100 + col * 50 - c * 160} y={170 + row * 130} width={36} height={36} fill="#3E6B3A" stroke={OL} strokeWidth={2} />; })}
      </svg>
      <div style={{ position: 'absolute', left: 760, top: 30, fontFamily: 'TagBold', fontSize: 60, color: '#141414', background: 'rgba(244,238,221,0.85)', padding: '4px 18px', border: '4px solid #141414' }}>PANIPAT — 1761</div>
      <div style={{ position: 'absolute', left: 420, top: 960, fontFamily: 'TagBold', fontSize: 40, color: '#E8862A', WebkitTextStroke: '1.5px #141414' }}>MARATHAS</div>
      <div style={{ position: 'absolute', left: 1120, top: 960, fontFamily: 'TagBold', fontSize: 40, color: '#3E6B3A', WebkitTextStroke: '1.5px #141414' }}>AFGHAN FORCE</div>
    </>
  );
};
const Panipat3: React.FC<SP> = ({ s }) => <Panipat1761 s={s} collapse={[9999, 9999]} />;
const Panipat3b: React.FC<SP> = ({ s }) => <Panipat1761 s={s} collapse={[W(s, 'catastrophically.') - 10, s.dur]} />;
const Panipat3c: React.FC<SP> = ({ s }) => (
  <>
    <Panipat1761 s={s} collapse={[-100, 0]} />
    <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: 0.35 }} />
  </>
);
const Momentum = H(() => [{ at: 0, arm: 'present', expr: 'worried' }, { at: 60, arm: 'shrug' }]);
const Board: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><InsertBg glow={false} /><Layer depth={1}>
        <MughalMap x={500} y={-10} s={0.9} extent={0.25} />
        <PopProp at={W(s, 'shell.')} x={880} y={300}><text textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff">shell</text></PopProp>
        <PopProp at={W(s, 'mauled.')} x={820} y={720}><g><circle r={50} fill="#E8862A" stroke={OL} strokeWidth={4} /><path d="M-30 -30 L30 30 M30 -30 L-30 30" stroke="#141414" strokeWidth={6} /></g></PopProp>
      </Layer></CameraRig>
    </>
  );
};
const Board2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><InsertBg glow={false} /><Layer depth={1}>
      <g transform="translate(500 -10) scale(0.9)"><path d={subPath()} fill="#E8DCC0" stroke={OL} strokeWidth={6} /></g>
      {[...Array(10)].map((_, i) => {
        const a = (i / 10) * Math.PI * 2 + f / 40;
        const x = 960 + Math.cos(a) * 280, y = 520 + Math.sin(a) * 300;
        return <g key={i} transform={`translate(${x} ${y}) scale(${popScale(f, 4 + i * 3)})`}><circle r={34} fill={COLS[i % 8]} stroke={OL} strokeWidth={4} /><text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#fff">{['$', '⚔'][i % 2]}</text></g>;
      })}
    </Layer></CameraRig>
  );
};
const Business: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.1, zoomTo: 1.0, focus: [700, 600] }}><CompanyCoast /></CameraRig>
    <Label text="a business" x={1500} y={300} at={W(s, 'business.')} size={70} color="#FFD84A" />
  </>
);
const NotCountry2 = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'shareholders,'), arm: 'present', expr: 'shock' }], { kids: (s) => <PopProp at={W(s, 'shareholders,')} x={1720} y={560}><CompanyFlag x={-100} y={-90} s={1} wave={Math.sin(useCurrentFrame() / 4) * 6} /></PopProp> });

// =============================================================== ACT 9
const EIC: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const goods: [string, string][] = [['cotton', '#F4F7FA'], ['silk', '#C07A9C'], ['spices', '#C0632B'], ['saltpetre', '#E8E2D6'], ['tea', '#3E6B3A']];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><CompanyCoast fort={false} /></CameraRig>
      {goods.map(([g, c], i) => { const at = W(s, g + (g === 'tea' ? ',' : ',')) || 40 + i * 6; return <div key={g} style={{ position: 'absolute', left: 260 + i * 300, top: 220, transform: `translate(-50%,-50%) scale(${popScale(f, W(s, i === 4 ? 'tea.' : g + ','))})`, background: c, border: '5px solid #141414', borderRadius: 12, padding: '8px 22px', fontFamily: 'Hand', fontSize: 48, color: i === 2 || i === 4 ? '#fff' : '#141414' }}>{g}</div>; })}
      <Label text="East India Company" x={960} y={110} at={W(s, 'east')} size={66} color="#FFD84A" />
    </>
  );
};
const Warehouses: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
        <CompanyCoast />
        <Layer depth={1}><Chibi x={1100} y={950} s={1.0} outfit={{ top: '#1E1E28', bottom: '#4A3A2A', belt: '#C9962C' }} hat="tricorn" item="notebook" pose="scribble" expr="happy" seed="clerk" /><Chibi x={1340} y={950} s={1.0} outfit={{ top: '#2E6B4A', robe: true, trim: '#E2B13C' }} hat="sultan" beard item="scroll" pose="present" expr="normal" seed="permit" flip /></Layer>
      </CameraRig>
      <Tally text={`TRADING ONLY: YEAR ${Math.min(150, 1 + Math.floor(f * 1.4))}`} bump={99} />
    </>
  );
};
const Noticed = H(() => [{ at: 0, arm: 'chin' }, { at: 40, arm: 'point', expr: 'normal' }], { kids: () => <g>{[0, 1].map((i) => <PopProp key={i} at={20 + i * 6} x={1600 + i * 200} y={760}><Chibi x={0} y={200} s={0.7} outfit={{ top: COLS[i * 3], robe: true }} hat="sultan" beard item="sword" pose="attack" expr="angry" seed={'nt' + i} flip={i === 1} /></PopProp>)}</g> });
const Noticed2 = H((s) => [{ at: 0, arm: 'present' }, { at: W(s, 'pay'), arm: 'point', expr: 'grin' }], { kids: (s) => <PopProp at={W(s, 'pay')} x={1730} y={560}><text textAnchor="middle" fontFamily="TagBold" fontSize={110} fill="#2E9A4A">$$$</text></PopProp> });
const Renting: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
      <CompanyCoast />
      <Layer depth={1}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <Chibi x={600 + i * 200} y={950} s={0.85} outfit={SEPOY} hat="turbanW" item="musket" pose="hold" expr="determined" seed={'rs' + i} />
            {f > W(s, 'renting') + i * 4 && <g transform={`translate(${640 + i * 200} 650) rotate(10) scale(${popScale(f, W(s, 'renting') + i * 4)})`}><rect x={-40} y={-24} width={80} height={48} rx={6} fill="#F4EEDD" stroke={OL} strokeWidth={3} /><text y={10} textAnchor="middle" fontFamily="TagBold" fontSize={26}>FOR HIRE</text></g>}
          </g>
        ))}
      </Layer>
    </CameraRig>
  );
};
const PickingSide = H(() => [{ at: 0, arm: 'finger' }, { at: 30, arm: 'point', expr: 'grin' }], { kids: () => <g><PopProp at={10} x={1600} y={760}><Chibi x={0} y={200} s={0.7} outfit={{ top: '#2E5E8C', robe: true }} hat="sultan" beard pose="cheer" expr="grin" seed="ps1" /></PopProp><PopProp at={16} x={1820} y={760}><Chibi x={0} y={200} s={0.7} outfit={{ top: '#7A2A22', robe: true }} hat="sultan" beard pose="shrug" expr="sad" seed="ps2" flip /></PopProp></g> });
const PickingRuler: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'ruler');
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'finger' }, { at, arm: 'present', expr: 'shock' }]}>
      <PopProp at={6} x={1730} y={760}><Chibi x={0} y={200} s={0.8} outfit={{ top: '#C9962C', robe: true }} hat="turbanW" beard pose="idle" expr={f > at ? 'grin' : 'normal'} seed="pr1" /></PopProp>
      {f > at - 6 && (() => { const d = gravityDrop(f, at - 6, { h: 400, g: 2, e: 0.3 }); return <g transform={`translate(1730 ${555 + d.y}) scale(${d.sx} ${d.sy})`}><path d="M-46 0 L-50 -50 L-24 -30 L0 -64 L24 -30 L50 -50 L46 0 Z" fill="#E2B13C" stroke={OL} strokeWidth={4} /></g>; })()}
      <PopProp at={at - 10} x={1730} y={300}><g><path d="M-20 -80 L20 -80 L20 0 L-20 0 Z" fill="#C0392B" stroke={OL} strokeWidth={3} /><path d="M-30 0 Q0 30 30 0" fill="#F6D2A8" stroke={OL} strokeWidth={3} /></g></PopProp>
    </HostShot>
  );
};
const Bengal: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.08, focus: [1200, 400] }}><InsertBg glow={false} /><Layer depth={1}>
        <g transform="translate(500 -10) scale(0.9)">
          <defs><clipPath id="subclipB"><path d={subPath()} /></clipPath></defs>
          <path d={subPath()} fill="#E8DCC0" stroke={OL} strokeWidth={6} />
          <g clipPath="url(#subclipB)"><circle cx={800} cy={460} r={60 + spring(f, { damping: 10, stiffness: 120 }) * 110} fill="#E2B13C" opacity={0.9} /></g>
          <path d={subPath()} fill="none" stroke={OL} strokeWidth={6} />
        </g>
      </Layer></CameraRig>
      <Label text="Bengal — the richest province" x={1450} y={260} at={W(s, 'bengal')} size={52} color="#FFD84A" />
    </>
  );
};
const Siraj: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
      <CompanyCoast />
      <Layer depth={1}><Chibi x={1300} y={950} s={1.1} outfit={SIRAJ} hat="sultan" hatColor="#E8E2D6" pose="hipAngry" expr="angry" seed="siraj" flip /></Layer>
    </CameraRig>
    <Label text="Siraj-ud-Daulah" x={1300} y={300} at={W(s, 'sirajuddaulah,')} size={60} color="#FFD84A" />
  </>
);
const Siraj2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04, shakes: [{ at: 30, amp: 6 }] }}>
      <CompanyCoast flag={f < 30} />
      <Layer depth={1}>
        {[0, 1, 2].map((i) => <Rider key={i} x={interpolate(f, [0, 30], [1900 + i * 200, 1100 + i * 200], Easing.out)} y={970} s={0.8} flip gait={f < 30 ? 'gallop' : 'idle'} phase={i * 4} horse="#3A2A22" rider={{ outfit: i ? { top: '#2E5E8C', bottom: '#3A2A1E' } : SIRAJ, hat: 'sultan', hatColor: '#E8E2D6', item: 'sword', pose: f > 30 ? 'cheer' : 'attack', expr: 'grin', seed: 'sj' + i }} />)}
        {f > 30 && <g transform={`translate(564 ${340 + gravityDrop(f, 30, { h: 300, g: 2.2 }).y})`}><path d="M0 0 L60 16 L0 32 Z" fill="#2E5E8C" stroke={OL} strokeWidth={3} /></g>}
      </Layer>
    </CameraRig>
  );
};
const CliveS: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
        <CompanyCoast fort={false} />
        <Layer depth={1}>
          <Clive x={800} y={950} s={1.15} item="sword" pose="point" expr="determined" seed="clive" />
          {[0, 1, 2].map((i) => <Chibi key={i} x={1060 + i * 160} y={950} s={0.85} outfit={REDCOAT} hat="shako" item="musket" pose="hold" expr="determined" seed={'cr' + i} />)}
        </Layer>
      </CameraRig>
      <Label text="Robert Clive" x={800} y={300} at={W(s, 'robert')} size={64} color="#FFD84A" />
      <Tally text="CLIVE: ~3,000" bump={99} />
    </>
  );
};
const Blocks: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><TroopBlocks small={1} big={popScale(f, W(s, '50000.') - 4)} /></svg>
      <div style={{ position: 'absolute', left: 190, top: 560, fontFamily: 'TagBold', fontSize: 40, color: '#C0392B' }}>~3,000</div>
      <div style={{ position: 'absolute', left: 1180, top: 900, fontFamily: 'TagBold', fontSize: 60, color: '#2E6B4A', WebkitTextStroke: '2px #141414' }}>~50,000</div>
    </>
  );
};
const BoughtS = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'bought'), arm: 'present', expr: 'grin' }], { kids: (s) => <PopProp at={W(s, 'bought')} x={1730} y={620}><g><path d="M-80 70 Q-100 -20 -30 -60 L-40 -80 L40 -80 L30 -60 Q100 -20 80 70 Z" fill="#C9A47A" stroke={OL} strokeWidth={5} /><text y={30} textAnchor="middle" fontFamily="TagBold" fontSize={54} fill="#5A3E26">£</text></g></PopProp> });
const Sketch5: React.FC<SP> = ({ s }) => {
  const id = s.id, A = s.speaker === 'A';
  const clExpr = id === 's5_4' || id === 's5_12' ? 'grin' : id === 's5_8' ? 'calm' : 'normal';
  const aidExpr = id === 's5_5' ? 'worried' : id === 's5_9' ? 'shock' : id === 's5_11' ? 'worried' : 'normal';
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.02, focus: A ? [1300, 640] : [560, 640] }}>
      <Study />
      <Layer depth={1}>
        <g transform="translate(560 800)"><rect x={-180} y={-40} width={360} height={40} fill="#6B4A2B" stroke={OL} strokeWidth={4} /><path d="M-160 0 V200 M160 0 V200" stroke="#6B4A2B" strokeWidth={12} /></g>
        <Clive x={560} y={800} s={1.15} legs="sit" item={id === 's5_10' ? 'notebook' : undefined} pose={id === 's5_10' ? 'scribble' : id === 's5_4' || id === 's5_12' ? 'present' : 'cross'} expr={clExpr} talking={A ? [] : talk(s)} seed="clv" />
        <Chibi x={1360} y={950} s={1.1} outfit={REDCOAT} hat="shako" item="notebook" pose="scribble" expr={aidExpr} talking={A ? talk(s) : []} seed="aide" flip />
        {id === 's5_12' && <g transform="translate(900 880)"><rect x={-40} y={-80} width={80} height={10} fill="#8C5A2A" stroke={OL} strokeWidth={3} /><rect x={-40} y={-70} width={80} height={10} fill="#8C5A2A" /><path d="M-36 -60 V20 M36 -60 V20 M-36 -150 V-80 M36 -150 V-80 M-36 -150 H36" stroke="#8C5A2A" strokeWidth={8} /></g>}
      </Layer>
    </CameraRig>
  );
};
const Plassey: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><TroopBlocks small={1} big={1} greyThird={f > W(s, 'jafar') ? 1 : 0} /></svg>
      <div style={{ position: 'absolute', left: 760, top: 30, fontFamily: 'TagBold', fontSize: 60, background: 'rgba(244,238,221,0.85)', padding: '4px 18px', border: '4px solid #141414' }}>PLASSEY — 1757</div>
      <Label text="Mir Jafar's third: stands still" x={1040} y={150} at={W(s, 'stood')} size={46} color="#FFD84A" />
    </>
  );
};
const Plassey2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><TroopBlocks small={1} big={1} greyThird={1} collapse={interpolate(f, [4, 40], [0, 1], Easing.out)} /></svg>;
};
const Chair: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
      <SultanCourt />
      <Layer depth={1}>
        <Chibi x={960} y={760} s={1.05} outfit={MIRJAFAR} hat="sultan" beard legs="sit" pose="cheer" expr="grin" seed="mj" />
        <Clive x={1450} y={950} s={1.05} item="sack" pose="present" expr="grin" seed="clv2" flip />
      </Layer>
    </CameraRig>
    <Label text="Mir Jafar" x={960} y={110} at={W(s, 'mir')} size={64} color="#FFD84A" />
  </>
);
const Taxes: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}>
        {[...Array(60)].map((_, i) => <g key={i} transform={`translate(${300 + (i % 12) * 60} ${300 + Math.floor(i / 12) * 90}) scale(${popScale(f, 2 + i * 0.5)})`}><circle cy={-30} r={12} fill="#F6D2A8" stroke={OL} strokeWidth={2} /><path d="M-14 0 Q0 -24 14 0 Z" fill={COLS[i % 8]} stroke={OL} strokeWidth={2} /></g>)}
        {[...Array(8)].map((_, i) => { const t = ((f + i * 9) % 60) / 60; return <ellipse key={i} cx={1060 + t * 560} cy={500 + Math.sin(t * Math.PI) * -120} rx={18} ry={18} fill="#E2B13C" stroke={OL} strokeWidth={2} />; })}
        <CompanyFlag x={1560} y={360} s={1.2} />
      </Layer></CameraRig>
      <Label text="30,000,000 taxpayers" x={600} y={180} at={W(s, '30')} size={56} color="#FFD84A" />
    </>
  );
};
const Corp = H((s) => [{ at: 0, arm: 'present' }, { at: W(s, 'larger'), arm: 'shrug', expr: 'shock' }], { kids: (s) => <g><PopProp at={W(s, 'population')} x={1600} y={700}><rect x={-40} y={-300} width={80} height={300} fill="#E2B13C" stroke={OL} strokeWidth={4} /></PopProp><PopProp at={W(s, 'britains.')} x={1760} y={700}><rect x={-40} y={-180} width={80} height={180} fill="#9DB4C0" stroke={OL} strokeWidth={4} /></PopProp></g> });
const CompanyArmy: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03, panFrom: [-40, 0], panTo: [40, 0] }}>
      <Plain tents={false} />
      <Layer depth={1}>{[...Array(10)].map((_, i) => <Chibi key={i} x={interpolate(f, [0, s.dur], [-200, 400]) + i * 170} y={950 + (i % 2) * 20} s={0.75} outfit={SEPOY} hat="turbanW" item="musket" legs="march" expr="determined" seed={'ca' + i} delay={i * 2} />)}</Layer>
    </CameraRig>
  );
};
const CompanyArmy2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const h1 = spring(Math.max(0, f - 6), { damping: 12, stiffness: 90 }) * 600, h2 = spring(Math.max(0, f - 14), { damping: 12, stiffness: 90 }) * 300;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.02 }}><InsertBg glow={false} /><Layer depth={1}>
        <path d="M500 880 H1420" stroke="#F4EEDD" strokeWidth={6} />
        <rect x={620} y={880 - h1} width={240} height={h1} fill="#C0392B" stroke={OL} strokeWidth={5} />
        <rect x={1060} y={880 - h2} width={240} height={h2} fill="#9DB4C0" stroke={OL} strokeWidth={5} />
      </Layer></CameraRig>
      <div style={{ position: 'absolute', left: 740, top: 910, transform: 'translateX(-50%)', fontFamily: 'Hand', fontSize: 44, color: '#fff' }}>Company army</div>
      <div style={{ position: 'absolute', left: 1180, top: 910, transform: 'translateX(-50%)', fontFamily: 'Hand', fontSize: 44, color: '#fff' }}>British Army</div>
      <Label text="×2" x={740} y={180} at={W(s, 'twice')} size={110} color="#FFD84A" />
    </>
  );
};
const Famine: React.FC<SP> = ({ s }) => <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.02 }}><EmptyVillage /></CameraRig>;
const Famine2: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.02, zoomTo: 1.04 }}>
    <EmptyVillage />
    <Layer depth={1.2}><rect x={-200} y={-200} width={2400} height={1500} fill="#000" opacity={0.3} /></Layer>
  </CameraRig>
);
const LedgerSplit: React.FC<{ s: Shot; n: [number, number] }> = ({ s, n }) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 960, height: 1080, overflow: 'hidden' }}><CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.0, focus: [480, 540] }}><EmptyVillage /></CameraRig></div>
      <svg width={960} height={1080} style={{ position: 'absolute', left: 960, top: 0 }}><rect width={960} height={1080} fill="#3A2E24" /><g transform="translate(30 0)"><RevenueLedger n={Math.round(interpolate(f, [0, s.dur], n))} /></g></svg>
      <div style={{ position: 'absolute', left: 955, top: 0, width: 10, height: 1080, background: '#141414' }} />
    </>
  );
};
const Ledger: React.FC<SP> = ({ s }) => <LedgerSplit s={s} n={[1, 6]} />;
const Ledger2: React.FC<SP> = ({ s }) => <LedgerSplit s={s} n={[6, 12]} />;
const Parliament: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
    <Westminster />
    <Layer depth={1}>{[0, 1, 2, 3].map((i) => <Chibi key={i} x={360 + i * 400} y={950} s={0.95} outfit={{ top: '#1E1E28', bottom: '#4A3A2A', belt: '#C9962C' }} hat={i % 2 ? 'tricorn' : 'europe'} pose={[{ at: 0, pose: 'idle' }, { at: 20 + i * 6, pose: i % 2 ? 'point' : 'shrug' }]} expr={i % 2 ? 'angry' : 'worried'} talking={[[20 + i * 6, 40 + i * 6]]} seed={'mp' + i} flip={i > 1} />)}</Layer>
  </CameraRig>
);
const Parliament2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
      <Westminster />
      <Layer depth={1}>
        <g transform={`translate(${interpolate(f, [0, s.dur], [1200, 900])} 0)`}><CompanyFlag x={0} y={560} s={1.2} /></g>
        <path d={`M960 520 L${interpolate(f, [0, s.dur], [1200, 900]) + 20} 600`} stroke="#141414" strokeWidth={6} strokeDasharray="10 8" />
        <Chibi x={760} y={950} s={1.0} outfit={{ top: '#1E1E28', bottom: '#4A3A2A' }} hat="europe" pose="pull" expr="determined" seed="mp9" />
      </Layer>
    </CameraRig>
  );
};
const CartridgeTease = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'cartridge.'), arm: 'present', expr: 'worried' }], { kids: (s) => <PopProp at={W(s, 'cartridge.')} x={1730} y={560}><g transform="rotate(-20)"><rect x={-120} y={-30} width={240} height={60} rx={10} fill="#E8DCC0" stroke={OL} strokeWidth={5} /><path d="M-120 -30 L-160 0 L-120 30" fill="#E8DCC0" stroke={OL} strokeWidth={5} /></g></PopProp> });
const Subscribe: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'wave', expr: 'smile' }, { at: W(s, 'province.'), arm: 'present', expr: 'grin' }]}>
      <PopProp at={W(s, 'subscribing')} x={1700} y={460}><g><rect x={-170} y={-50} width={340} height={100} rx={14} fill="#C0392B" stroke={OL} strokeWidth={5} /><text y={18} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#fff">SUBSCRIBE</text></g></PopProp>
      <PopProp at={W(s, 'province.')} x={1700} y={700}><g><path d="M-70 -60 Q0 -100 70 -50 Q90 20 40 70 Q-20 80 -70 30 Z" fill="#E2B13C" stroke={OL} strokeWidth={5} /><text y={130} textAnchor="middle" fontFamily="Hand" fontSize={40}>(1 province)</text></g></PopProp>
    </HostShot>
  );
};

// =============================================================== ACT 10
const Sepoys: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
    <Plain tents />
    <Layer depth={1}>{[...Array(8)].map((_, i) => <Chibi key={i} x={220 + i * 210} y={950 + (i % 2) * 18} s={0.85} outfit={SEPOY} hat="turbanW" item="musket" pose="hold" expr="normal" seed={'sp' + i} />)}</Layer>
  </CameraRig>
);
const Sepoys2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
        <Plain tents />
        <Layer depth={1}>
          {/* a thin layer of officers literally on top */}
          <rect x={300} y={700} width={1320} height={30} fill="#8C5A2A" stroke={OL} strokeWidth={4} />
          {[...Array(10)].map((_, i) => <Chibi key={i} x={360 + i * 135} y={1000} s={0.72} outfit={SEPOY} hat="turbanW" pose="raise" expr="worried" seed={'s2' + i} />)}
          {[0, 1].map((i) => <Chibi key={'o' + i} x={700 + i * 500} y={700} s={0.72} outfit={REDCOAT} hat="shako" pose="hipAngry" expr="normal" seed={'of' + i} />)}
        </Layer>
      </CameraRig>
      <Label text="sepoys" x={960} y={1000 - 60} at={W(s, 'sepoys,')} size={52} color="#FFD84A" />
    </>
  );
};
const Grievances = H(() => [{ at: 0, arm: 'present' }, { at: 30, arm: 'finger', expr: 'worried' }], { kids: () => <PopProp at={8} x={1730} y={600}><g>{[...Array(1)].map((_, i) => <g key={i}><rect x={-130} y={-260} width={260} height={520} fill="#F4EEDD" stroke={OL} strokeWidth={5} />{[...Array(10)].map((_, k) => <path key={k} d={`M-100 ${-220 + k * 46} H100`} stroke="#B5AA90" strokeWidth={5} />)}</g>)}</g></PopProp> });
const Annex: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}>
      <KingdomMap x={500} y={-10} s={0.9} wobble={false} unify={interpolate(f, [10, s.dur], [0, 0.85])} unifyColor="#C0392B" />
      {[0, 1, 2].map((i) => <PopProp key={i} at={30 + i * 14} x={760 + i * 180} y={400 + i * 120}><g transform="rotate(-10)"><rect x={-110} y={-30} width={220} height={60} fill="none" stroke="#B3261E" strokeWidth={6} /><text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#B3261E">ANNEXED</text></g></PopProp>)}
    </Layer></CameraRig>
  );
};
const Overseas: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}>
        <g transform={`translate(${interpolate(f, [0, s.dur * 0.5], [400, 760])} 520)`}><path d="M-200 0 L200 0 Q170 60 0 66 Q-170 60 -200 0 Z" fill="#6B4A2B" stroke={OL} strokeWidth={4} /><Chibi x={0} y={0} s={0.7} outfit={SEPOY} hat="turbanW" pose="shrug" expr="worried" seed="ovs" /></g>
        <g transform="translate(1480 700)"><rect x={-40} y={-200} width={80} height={200} fill="#C0392B" stroke={OL} strokeWidth={4} /><path d="M-80 -200 H80" stroke="#141414" strokeWidth={10} /><text x={0} y={-220} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#fff">PAY CAP</text></g>
      </Layer></CameraRig>
    </>
  );
};
const Rifle: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}><InsertBg /><Layer depth={1}>
      <g transform="translate(960 520) rotate(-8)">
        <path d="M-600 -10 L400 -10 L400 10 L-600 10 Z" fill="#5A5F66" stroke={OL} strokeWidth={4} />
        <path d="M-300 6 L160 6 L220 60 L240 120 L120 120 L60 40 L-300 40 Z" fill="#8C5A2A" stroke={OL} strokeWidth={4} />
        <path d="M220 60 L420 100 L440 160 L240 120 Z" fill="#8C5A2A" stroke={OL} strokeWidth={4} />
      </g>
    </Layer></CameraRig>
    <Label text="new rifle (1857)" x={960} y={180} at={W(s, 'new')} size={60} color="#FFD84A" />
  </>
);
const Cartridge: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  // teeth approach, then FREEZE one frame before contact
  const freeze = Math.round(s.dur * 0.55);
  const t = Math.min(f, freeze);
  const gap = interpolate(t, [0, freeze], [380, 26], Easing.inOut);
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <rect width={1920} height={1080} fill="#2A201A" />
      <g transform="translate(960 540)">
        <rect x={-500} y={-70} width={760} height={140} rx={18} fill="#E8DCC0" stroke={OL} strokeWidth={6} />
        <path d="M260 -70 L340 0 L260 70" fill="#E8DCC0" stroke={OL} strokeWidth={6} />
        <path d="M-480 -50 H220" stroke="#D2C29A" strokeWidth={8} opacity={0.7} />
        <path d="M-480 40 H220" stroke="#D2C29A" strokeWidth={8} opacity={0.7} />
        {/* teeth */}
        <g transform={`translate(${340 + gap} 0)`}>
          <path d="M0 -200 Q160 -220 260 -120 L260 -40 Q120 -60 0 -40 Z" fill="#B8665A" stroke={OL} strokeWidth={5} />
          {[...Array(5)].map((_, i) => <path key={i} d={`M${20 + i * 44} -44 l20 0 l-6 40 l-8 0 Z`} fill="#F4F2EC" stroke={OL} strokeWidth={3} />)}
          <path d="M0 200 Q160 220 260 120 L260 40 Q120 60 0 40 Z" fill="#B8665A" stroke={OL} strokeWidth={5} />
          {[...Array(5)].map((_, i) => <path key={i} d={`M${20 + i * 44} 44 l20 0 l-6 -40 l-8 0 Z`} fill="#F4F2EC" stroke={OL} strokeWidth={3} />)}
        </g>
      </g>
      {f >= freeze && <rect width={1920} height={1080} fill="none" stroke="#F4F2EC" strokeWidth={14} opacity={0.5} />}
    </svg>
  );
};
const Grease: React.FC<SP> = ({ s }) => (
  <>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <rect width={1920} height={1080} fill="#2A201A" />
      <g transform="translate(960 480)"><rect x={-500} y={-70} width={760} height={140} rx={18} fill="#E8DCC0" stroke="#141414" strokeWidth={6} /><path d="M260 -70 L340 0 L260 70" fill="#E8DCC0" stroke="#141414" strokeWidth={6} /><ellipse cx={-100} cy={0} rx={300} ry={40} fill="#F2E2A0" opacity={0.6} /></g>
    </svg>
    <Label text="cow fat?" x={640} y={760} at={W(s, 'cow')} size={64} color="#FFD84A" />
    <Label text="pig fat?" x={1280} y={760} at={W(s, 'pig')} size={64} color="#FFD84A" />
    <Label text="(rumour)" x={960} y={220} at={W(s, 'rumour')} size={56} />
  </>
);
const Offend = H(() => [{ at: 0, arm: 'finger' }, { at: 50, arm: 'present' }]);
const Offend2 = H((s) => [{ at: 0, arm: 'present' }, { at: W(s, 'everybody.'), arm: 'shrug', expr: 'shock' }]);
const Believed = H(() => [{ at: 0, arm: 'chin' }, { at: 60, arm: 'shrug' }]);
const Believed2 = H(() => [{ at: 0, arm: 'finger', expr: 'worried' }, { at: 50, arm: 'present' }]);
const Pandey: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06, focus: [960, 700] }}>
      <Plain tents />
      <Layer depth={1}><Chibi x={960} y={950} s={1.15} outfit={SEPOY} hat="turbanW" mustache pose="idle" expr="determined" seed="pandey" /></Layer>
    </CameraRig>
    <Label text="Mangal Pandey" x={960} y={110} at={W(s, 'mangal')} size={66} color="#FFD84A" />
  </>
);
const Rising: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><InsertBg glow={false} /><Layer depth={1}>
      <g transform="translate(500 -10) scale(0.9)">
        <path d={subPath()} fill="#E8DCC0" stroke={OL} strokeWidth={6} />
        {[[380, 300], [500, 380], [620, 420], [300, 360], [440, 460], [700, 440], [560, 340], [260, 420]].map(([x, y], i) => { const k = popScale(f, 6 + i * 6); return k > 0 ? <g key={i} transform={`translate(${x} ${y}) scale(${k})`}><circle r={30} fill="url(#warmGlow)" /><path d={`M0 10 Q-14 -10 0 ${-30 - (f % 3) * 3} Q14 -10 0 10`} fill="#FF6A00" stroke={OL} strokeWidth={2} /></g> : null; })}
      </g>
    </Layer></CameraRig>
  );
};
const RedFort: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
        <DelhiGate dusk={false} />
        <Layer depth={1}>{[0, 1, 2, 3, 4].map((i) => <Chibi key={i} x={interpolate(f, [0, s.dur], [1500, 700]) + i * 160} y={960} s={0.85} outfit={SEPOY} hat="turbanW" item="musket" legs="march" expr="determined" seed={'rb' + i} flip delay={i * 3} />)}</Layer>
      </CameraRig>
      <Label text="Red Fort, Delhi" x={560} y={110} at={W(s, 'red')} size={64} color="#FFD84A" />
    </>
  );
};
const ZafarS: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.08, focus: [960, 560] }}>
      <SultanCourt />
      <Layer depth={1}>
        <Zafar x={960} y={760} s={1.05} legs="sit" pose="shrug" expr="worried" seed="zaf" hat="crown" />
        {[0, 1, 2].map((i) => <Chibi key={i} x={360 + i * 200 + (i > 0 ? 900 : 0)} y={950} s={0.85} outfit={SEPOY} hat="turbanW" pose="cheer" expr="grin" seed={'zs' + i} flip={i > 0} />)}
      </Layer>
    </CameraRig>
    <Label text="Bahadur Shah Zafar" x={960} y={110} at={W(s, 'bahadur')} size={64} color="#FFD84A" />
  </>
);
const Poet: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
    <Study />
    <Layer depth={1}><Zafar x={960} y={950} s={1.1} item="notebook" pose="scribble" expr="calm" seed="zaf2" /></Layer>
  </CameraRig>
);
const DidNotAsk: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.12, focus: [960, 620] }}>
    <SultanCourt />
    <Layer depth={1}><Zafar x={960} y={760} s={1.05} legs="sit" pose="shrug" expr="sad" seed="zaf3" hat="crown" /></Layer>
  </CameraRig>
);
const Savage: React.FC<SP> = ({ s }) => <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><EmptyStreet dim={0.4} /></CameraRig>;
const SonsShot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  // restrained: three candles go out, one at a time
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <rect width={1920} height={1080} fill="#14100C" />
      {[0, 1, 2].map((i) => {
        const out = f > 20 + i * 14;
        return (
          <g key={i} transform={`translate(${700 + i * 260} 640)`}>
            <rect x={-26} y={-120} width={52} height={160} fill="#E8E2D6" stroke="#000" strokeWidth={3} />
            {!out && <g><circle cy={-150} r={60} fill="url(#warmGlow)" /><path d={`M0 -124 Q-12 -150 0 ${-180 - (f % 3) * 3} Q12 -150 0 -124`} fill="#FFB21E" /></g>}
            {out && <path d={`M0 -124 q-10 ${-30 - (f - 20 - i * 14)} 6 ${-60 - (f - 20 - i * 14) * 1.5}`} stroke="#6A6460" strokeWidth={4} fill="none" opacity={Math.max(0, 1 - (f - 20 - i * 14) / 40)} />}
          </g>
        );
      })}
    </svg>
  );
};
const RangoonRoom: React.FC = () => (
  <>
    <Layer depth={0.3}><rect x={-200} y={-200} width={2400} height={1500} fill="#BDB4A0" /><rect x={1360} y={260} width={160} height={200} fill="#8A9AA0" stroke={OL} strokeWidth={5} /><path d="M1440 260 V460 M1360 360 H1520" stroke={OL} strokeWidth={5} /></Layer>
    <Layer depth={0.6}><path d="M-200 760 L2200 760 L2200 1300 L-200 1300 Z" fill="#8A7A62" stroke={OL} strokeWidth={3} /></Layer>
  </>
);
const Rangoon: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 0.9, zoomTo: 0.92, focus: [960, 700] }}>
      <RangoonRoom />
      <Layer depth={1}><Zafar x={760} y={930} s={0.7} item="notebook" pose="scribble" expr="calm" seed="zaf4" legs="sit" /></Layer>
    </CameraRig>
    <Label text="Rangoon" x={1440} y={200} at={W(s, 'rangoon,')} size={56} />
  </>
);
const Rangoon2: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#B8C4B0" /></Layer>
    <Layer depth={0.6}>
      <path d="M-200 760 L2200 760 L2200 1300 L-200 1300 Z" fill="#7A8A5A" stroke={OL} strokeWidth={3} />
      <path d="M760 790 Q960 720 1160 790 Z" fill="#8A7A5A" stroke={OL} strokeWidth={4} />
      <g transform="translate(1400 780)"><path d="M-10 0 L-8 -260 L8 -260 L10 0 Z" fill="#6B4A2B" stroke={OL} strokeWidth={3} /><path d="M-160 -240 Q-180 -380 0 -400 Q180 -380 160 -240 Q0 -200 -160 -240 Z" fill="#4E7A3A" stroke={OL} strokeWidth={3} /></g>
    </Layer>
  </CameraRig>
);
const TwoYards: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 0.92, zoomTo: 0.95, focus: [960, 700] }}>
    <RangoonRoom />
    <Layer depth={1}><Zafar x={760} y={930} s={0.7} item="notebook" pose="chin" expr="sad" seed="zaf5" legs="sit" /></Layer>
  </CameraRig>
);
const LastMughal = H(() => [{ at: 0, arm: 'idle', expr: 'worried' }]);
const Raj: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
      <Westminster />
      <Layer depth={1}>
        <g transform="translate(960 560)"><rect x={-200} y={-260} width={400} height={480} rx={10} fill="#C9962C" stroke={OL} strokeWidth={6} /><rect x={-176} y={-236} width={352} height={432} fill="#2E3A5A" /></g>
        <Chibi x={960} y={780} s={1.0} outfit={{ top: '#1E1E28', robe: true, trim: '#E2B13C' }} hat="queen" pose="idle" expr="normal" seed="vic" />
      </Layer>
    </CameraRig>
    <Label text="Empress of India" x={960} y={110} at={W(s, 'empress')} size={70} color="#FFD84A" />
  </>
);
const RajBegun = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'built'), arm: 'present', expr: 'smile' }]);
const Rail: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}><InsertBg /><Layer depth={1}><RailMap x={500} y={-10} s={0.9} p={interpolate(f, [4, s.dur], [0, 1])} /></Layer></CameraRig>
      <Label text="~60,000 km of railway" x={1500} y={260} at={W(s, '60000')} size={56} color="#FFD84A" />
    </>
  );
};
const Rail2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const items: [string, string][] = [['telegraph', 'telegraph'], ['canals', 'canals'], ['universities', 'universities.']];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.05, zoomTo: 1.08 }}><InsertBg /><Layer depth={1}><RailMap x={500} y={-10} s={0.9} p={1} /></Layer></CameraRig>
      {items.map(([t, w], i) => <Label key={t} text={t} x={1500} y={300 + i * 120} at={W(s, w)} size={56} />)}
    </>
  );
};
const OtherNumber = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'other'), arm: 'point', expr: 'worried' }]);
const PieBack: React.FC<SP> = ({ s }) => <PieShot s={s} from={0.244} to={0.244} yearFrom={1700} yearTo={1700} />;
const PieBack2: React.FC<SP> = ({ s }) => <PieShot s={s} from={0.244} to={0.042} yearFrom={1700} yearTo={1950} at={6} len={50} />;
const Textiles: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 960, height: 1080, overflow: 'hidden', background: '#E8C9A0' }}>
        <svg width={960} height={1080}><rect width={960} height={1080} fill="#E8C9A0" /><path d="M0 760 H960 V1080 H0 Z" fill="#C49A63" /><Loom x={480} y={760} s={1.1} /><Chibi x={220} y={940} s={0.95} outfit={{ top: '#F1E6D0', bottom: '#F1E6D0' }} hat="turbanW" mustache pose="present" expr={f > 40 ? 'sad' : 'happy'} seed="weaver" /></svg>
      </div>
      <div style={{ position: 'absolute', left: 960, top: 0, width: 960, height: 1080, overflow: 'hidden', background: '#9DA8B0' }}>
        <svg width={960} height={1080}><rect width={960} height={1080} fill="#9DA8B0" /><path d="M0 760 H960 V1080 H0 Z" fill="#7A7A6A" /><Factory x={540} y={760} s={1.2} /></svg>
      </div>
      <div style={{ position: 'absolute', left: 955, top: 0, width: 10, height: 1080, background: '#141414' }} />
      <Label text="hand-woven" x={480} y={160} at={6} size={56} />
      <Label text="factory cloth: cheaper" x={1440} y={160} at={W(s, 'factory')} size={56} color="#FFD84A" />
    </>
  );
};
const Cotton: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const t = (k: number) => ((f + k * 20) % 80) / 80;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}>
        <g transform="translate(1300 420) scale(0.45)"><path d={subPath()} fill="#E8862A" stroke={OL} strokeWidth={10} /></g>
        <g transform="translate(300 260)"><path d="M0 0 Q80 -60 160 0 Q200 100 120 160 Q40 180 0 100 Z" fill="#9DB4C0" stroke={OL} strokeWidth={6} /></g>
        {[0, 1, 2].map((k) => <g key={k} transform={`translate(${1400 - t(k) * 1000} ${560 - Math.sin(t(k) * Math.PI) * 160})`}><rect x={-40} y={-30} width={80} height={60} fill="#F4F7FA" stroke={OL} strokeWidth={4} /></g>)}
        {[0, 1, 2].map((k) => <g key={'c' + k} transform={`translate(${420 + t(k + 0.5) * 1000} ${740 + Math.sin(t(k + 0.5) * Math.PI) * 120})`}><rect x={-40} y={-24} width={80} height={48} fill="#C0392B" stroke={OL} strokeWidth={4} /></g>)}
      </Layer></CameraRig>
      <Label text="raw cotton →" x={960} y={330} at={6} size={52} />
      <Label text="← finished cloth" x={960} y={900} at={16} size={52} color="#FFD84A" />
    </>
  );
};
const TrainTease: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'thrown');
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'finger' }, { at, arm: 'point', expr: 'shock' }]}>
      <g transform={`translate(${interpolate(f, [0, s.dur], [1500, 1900])} 820)`}>
        <rect x={0} y={-140} width={360} height={140} rx={10} fill="#2E3A5A" stroke={OL} strokeWidth={5} />
        {[0, 1, 2].map((i) => <rect key={i} x={30 + i * 110} y={-110} width={70} height={50} fill="#F2C230" stroke={OL} strokeWidth={3} />)}
        {[60, 300].map((cx) => <circle key={cx} cx={cx} cy={0} r={28} fill="#141414" />)}
      </g>
      {f > at && (() => { const p = projectile(f, at, [1560, 700], [-6, -12], 1.2); return p.y < 960 ? <g transform={`translate(${p.x} ${p.y}) rotate(${(f - at) * -8})`}><rect x={-30} y={-20} width={60} height={40} fill="#6B4A2B" stroke={OL} strokeWidth={3} /></g> : <rect x={p.x - 30} y={940} width={60} height={40} fill="#6B4A2B" stroke={OL} strokeWidth={3} />; })()}
    </HostShot>
  );
};

export const SHOTS_B3: Record<string, React.FC<SP>> = {
  nadir: NadirS, nolock: NoLock, karnal: Karnal, orderly: Orderly, rumour: Rumour, severalk: SeveralK, massacre: Massacre, massacre2: Massacre2,
  emptying: Emptying, throneleaves: ThroneLeaves, route: Route, tower: TowerS, taxholiday: TaxHoliday, onerobbery: OneRobbery, technically: Technically,
  brokeapart: BrokeApart, marathanorth: MarathaNorth, panipat3: Panipat3, panipat3b: Panipat3b, panipat3c: Panipat3c, momentum: Momentum,
  board: Board, board2: Board2, business: Business, notcountry2: NotCountry2,
  eic: EIC, warehouses: Warehouses, noticed: Noticed, noticed2: Noticed2, renting: Renting, pickingside: PickingSide, pickingruler: PickingRuler,
  bengal: Bengal, siraj: Siraj, siraj2: Siraj2, clive: CliveS, blocks: Blocks, bought: BoughtS, sketch5: Sketch5, plassey: Plassey, plassey2: Plassey2,
  chair: Chair, taxes: Taxes, corp: Corp, companyarmy: CompanyArmy, companyarmy2: CompanyArmy2, famine: Famine, famine2: Famine2, ledger: Ledger, ledger2: Ledger2,
  parliament: Parliament, parliament2: Parliament2, cartridgeTease: CartridgeTease, subscribe: Subscribe,
  sepoys: Sepoys, sepoys2: Sepoys2, grievances: Grievances, annex: Annex, overseas: Overseas, rifle: Rifle, cartridge: Cartridge, grease: Grease,
  offend: Offend, offend2: Offend2, believed: Believed, believed2: Believed2, pandey: Pandey, rising: Rising, redfort: RedFort, zafar: ZafarS,
  poet: Poet, didnotask: DidNotAsk, savage: Savage, sons_shot: SonsShot, rangoon: Rangoon, rangoon2: Rangoon2, twoyards: TwoYards, lastmughal: LastMughal,
  raj: Raj, rajbegun: RajBegun, rail: Rail, rail2: Rail2, othernumber: OtherNumber, pieback: PieBack, pieback2: PieBack2, textiles: Textiles, cotton: Cotton,
  traintease: TrainTease,
};
