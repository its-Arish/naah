// Acts 11–13 + Close: Gandhi, Partition, the Republic.
import React from 'react';
import { useCurrentFrame, interpolate, Easing, popScale, onTwos, random, gravityDrop, projectile, spring } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { HostKey } from '@engine/characters/Host';
import { Chibi, Outfit, MiniFlag } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { Label } from '@engine/fx/Overlays';
import { Plain, SomnathCoast, TempleVault, Tally, subPath, KingdomMap } from '@engine/scenes/India';
import { SultanCourt, Study, HotRoad, Boulders } from '@engine/scenes/IndiaB1';
import { TajMahal, TajGarden, PeacockThrone, StoneChariot, Diary } from '@engine/scenes/IndiaB2';
import { EmptyVillage, RevenueLedger, Westminster, CompanyCoast } from '@engine/scenes/IndiaB3';
import { DelhiParliament, NightPlatform, BaghPlan, GrainOut, DandiMap, Shallows, Bungalow, PartitionMap, PrincelyMap, Ballot, WheatFields, Airfield, TechOffice, Launch, MarsOrbit } from '@engine/scenes/IndiaB4';
import { SP, talk, wordAt, HostShot, Drop, DropHtml } from './ShotsIndia';
import type { Shot } from '@engine/types';

const W = (s: Shot, w: string) => wordAt(s, w);
const COLS = ['#C0392B', '#2E86C1', '#D4A017', '#8E44AD', '#16A085', '#E8862A', '#6E5A48', '#C07A9C'];
const CIV = (c: string, b = '#E8DCC0'): Outfit => ({ top: c, bottom: b });
const H = (keys: (s: Shot) => HostKey[], opts: { x?: number; spot?: (s: Shot) => { at: number; text?: string; x?: number; y?: number }; kids?: (s: Shot) => React.ReactNode } = {}): React.FC<SP> => ({ s }) => (
  <HostShot s={s} keys={keys(s)} x={opts.x} spot={opts.spot?.(s)}>{opts.kids?.(s)}</HostShot>
);
const PopProp: React.FC<{ at: number; x: number; y: number; s?: number; children: React.ReactNode }> = ({ at, x, y, s = 1, children }) => {
  const f = useCurrentFrame();
  const k = popScale(f, at);
  return k > 0 ? <g transform={`translate(${x} ${y}) scale(${k * s})`}>{children}</g> : null;
};

// ------------------------------------------------------------- cast
const GANDHI_SUIT: Outfit = { top: '#2A2E3A', bottom: '#2A2E3A', belt: '#2A2E3A' };
const GANDHI: Outfit = { top: '#F4F2EC', bottom: '#F4F2EC', sash: '#E8E2D6' };
const NEHRU: Outfit = { top: '#E8DCC0', robe: true, trim: '#B5AA90' };
const PATEL: Outfit = { top: '#F4F2EC', robe: true, sash: '#E8E2D6' };
const RADCLIFFE: Outfit = { top: '#3A3F4A', bottom: '#3A3F4A', belt: '#3A3F4A' };
const OFFICIAL: Outfit = { top: '#E8DCC0', bottom: '#E8DCC0', belt: '#8A7A5A' };
const INDIRA: Outfit = { top: '#E8862A', robe: true, trim: '#B3261E' };
const SOLDIER44: Outfit = { top: '#7A7A4A', bottom: '#6A6A3A', belt: '#4A4A2A' };
const Gandhi = (p: any) => <Chibi outfit={GANDHI} hat="bald" glasses skin="#C98A5A" {...p} />;
const Radcliffe = (p: any) => <Chibi outfit={RADCLIFFE} hat="parted" hatColor="#4A3A2A" glasses {...p} />;

// =============================================================== ACT 11
const Platform: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
    <NightPlatform train={0} />
    <Layer depth={1}><Gandhi x={760} y={760} s={1.0} outfit={GANDHI_SUIT} hat="parted" hatColor="#2A2018" mustache pose="idle" item="notebook" expr="normal" seed="g1" /></Layer>
  </CameraRig>
);
const Platform2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const out = W(s, 'thrown');
  const p = projectile(f, out, [900, 640], [-6, -8], 1.2);
  const case_ = f > out ? (p.y < 790 ? p : { x: p.x, y: 790, angle: 0 }) : null;
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04, shakes: [{ at: out + 18, amp: 4 }] }}>
      <NightPlatform train={f > out + 20 ? (f - out - 20) * 18 : 0} />
      <Layer depth={1}>
        <Gandhi x={f > out ? 600 : 900} y={790} s={1.0} outfit={GANDHI_SUIT} hat="parted" hatColor="#2A2018" mustache pose={f > out ? 'shrug' : 'idle'} expr={f > out ? 'shock' : 'normal'} seed="g2" />
        {case_ && <rect x={case_.x - 40} y={case_.y - 50} width={80} height={56} rx={6} fill="#6B4A2B" stroke={OL} strokeWidth={4} />}
      </Layer>
    </CameraRig>
  );
};
const Platform3: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.12, focus: [700, 700] }}>
    <NightPlatform />
    <Layer depth={1}>
      <Gandhi x={700} y={790} s={1.0} outfit={GANDHI_SUIT} hat="parted" hatColor="#2A2018" mustache legs="sit" pose="chin" expr="determined" seed="g3" />
      <rect x={800} y={734} width={80} height={56} rx={6} fill="#6B4A2B" stroke={OL} strokeWidth={4} />
    </Layer>
  </CameraRig>
);
const Return: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
    <CompanyCoast fort={false} flag={false} />
    <Layer depth={1}><Gandhi x={760} y={950} s={1.05} outfit={{ top: '#F4F2EC', bottom: '#F4F2EC' }} hat="gandhicap" mustache pose="wave" expr="happy" seed="g4" /></Layer>
  </CameraRig>
);
const DrawingRoom: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
    <Study />
    <Layer depth={1}>{[0, 1, 2].map((i) => <Chibi key={i} x={500 + i * 420} y={950} s={0.95} outfit={{ top: '#2A2E3A', bottom: '#2A2E3A' }} hat="parted" hatColor="#2A2018" mustache glasses={i === 1} item="book" pose={[{ at: 0, pose: 'present' }, { at: 20 + i * 10, pose: 'point' }]} expr="normal" talking={[[10 + i * 16, 26 + i * 16]]} seed={'dr' + i} flip={i === 2} />)}</Layer>
  </CameraRig>
);
const Villages: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
    <WheatFields />
    <Layer depth={1}>
      <Gandhi x={760} y={950} s={1.05} mustache pose="present" expr="happy" seed="g5" />
      {[0, 1, 2].map((i) => <Chibi key={i} x={1060 + i * 220} y={950} s={0.9} outfit={CIV(COLS[i + 1], '#F1E6D0')} hat={i === 1 ? 'veil' : 'pagri'} hatColor={COLS[i + 3]} mustache={i !== 1} pose="idle" expr="happy" seed={'fm' + i} flip />)}
    </Layer>
  </CameraRig>
);
const Bagh: React.FC<SP> = ({ s }) => (
  <>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><BaghPlan /></svg>
    <Label text="Jallianwala Bagh, Amritsar" x={960} y={80} at={W(s, 'jallianwala')} size={56} color="#FFD84A" />
  </>
);
const Bagh2: React.FC<SP> = ({ s }) => (
  <>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><BaghPlan hl={1} /></svg>
    <Label text="the only main exit" x={330} y={460} at={W(s, 'exit,')} size={44} color="#FFD84A" />
  </>
);
const Black: React.FC<SP> = () => <div style={{ position: 'absolute', inset: 0, background: '#000' }} />;
const Purse: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
    <Westminster />
    <Layer depth={1}>
      <g transform="translate(960 560) rotate(-4)"><rect x={-300} y={-220} width={600} height={420} fill="#F4F2EC" stroke={OL} strokeWidth={5} /><text y={-150} textAnchor="middle" fontFamily="TagBold" fontSize={44}>THE DAILY PAPER</text>{[...Array(6)].map((_, i) => <path key={i} d={`M-260 ${-80 + i * 44} H260`} stroke="#B5AA90" strokeWidth={6} />)}</g>
    </Layer>
  </CameraRig>
);
const Purse2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
      <Westminster />
      <Layer depth={1}>
        <g transform="translate(960 640)"><path d="M-150 120 Q-180 -40 -60 -110 L-70 -140 L70 -140 L60 -110 Q180 -40 150 120 Z" fill="#C9A47A" stroke={OL} strokeWidth={6} /><text y={40} textAnchor="middle" fontFamily="TagBold" fontSize={80} fill="#5A3E26">£</text></g>
        {[...Array(8)].map((_, i) => f > 10 + i * 6 && (() => { const d = gravityDrop(f, 10 + i * 6, { h: 600, g: 2, e: 0.3 }); return <ellipse key={i} cx={900 + (i % 4) * 40} cy={500 + d.y} rx={22} ry={8} fill="#E2B13C" stroke={OL} strokeWidth={2} />; })())}
      </Layer>
    </CameraRig>
  );
};
const Speech = H((s) => [{ at: 0, arm: 'finger', expr: 'worried' }, { at: W(s, 'any'), arm: 'present' }]);
const Impossible = H((s) => [{ at: 0, arm: 'present' }, { at: W(s, 'operate'), arm: 'finger', expr: 'proud' }], { kids: (s) => <PopProp at={W(s, 'operate')} x={1720} y={600}><g><circle r={90} fill="none" stroke={OL} strokeWidth={10} />{[...Array(8)].map((_, i) => <rect key={i} x={-14} y={-118} width={28} height={36} fill={OL} transform={`rotate(${i * 45})`} />)}<path d="M-120 -120 L120 120" stroke="#B3261E" strokeWidth={14} /></g></PopProp> });
const SaltH = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'salt.'), arm: 'present', expr: 'grin' }], { kids: (s) => <PopProp at={W(s, 'salt.')} x={1720} y={600}><g><ellipse rx={100} ry={30} fill="#C9A47A" stroke={OL} strokeWidth={5} /><path d="M-80 -10 Q0 -110 80 -10 Z" fill="#F4F7FA" stroke={OL} strokeWidth={5} /></g></PopProp> });
const Monopoly: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}><InsertBg /><Layer depth={1}>
      <g transform="translate(960 540)"><rect x={-180} y={-220} width={360} height={440} rx={14} fill="#F4F2EC" stroke={OL} strokeWidth={6} /><text y={-120} textAnchor="middle" fontFamily="TagBold" fontSize={70}>SALT</text><text y={-60} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#B3261E">GOVT. MONOPOLY</text><path d="M-120 40 Q0 -60 120 40 Z" fill="#E8EEF2" stroke={OL} strokeWidth={4} /></g>
      <Drop at={40} x={1300} y={440} h={500}><g transform="rotate(10)"><rect x={-90} y={-46} width={180} height={92} rx={8} fill="#E2B13C" stroke={OL} strokeWidth={5} /><text y={16} textAnchor="middle" fontFamily="TagBold" fontSize={46}>+TAX</text></g></Drop>
    </Layer></CameraRig>
  </>
);
const Hot: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
    <HotRoad />
    <Layer depth={1}>{[0, 1, 2].map((i) => <Chibi key={i} x={600 + i * 360} y={900} s={0.95} outfit={CIV(COLS[i], '#F1E6D0')} hat={i === 1 ? 'veil' : 'pagri'} hatColor={COLS[i + 2]} mustache={i !== 1} pose="carry" item="bundle" expr="worried" seed={'ht' + i} />)}</Layer>
  </CameraRig>
);
const Walked: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'present' }, { at: W(s, 'walked.'), arm: 'point', expr: 'grin' }]}>
      <PopProp at={W(s, 'sixty')} x={1700} y={940}><Gandhi x={0} y={0} s={0.85} mustache item="banner" legs="walk" pose="idle" expr="determined" seed="gw" /></PopProp>
    </HostShot>
  );
};
const DandiMapS: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [6, s.dur - 6], [0, 1]);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><DandiMap p={p} /></svg>
      <Tally text={`DAY ${1 + Math.floor(p * 23)} OF 24`} bump={99} />
      <Label text="Sabarmati ashram" x={1300} y={240} at={4} size={44} />
      <Label text="Dandi" x={700} y={700} at={W(s, 'dandi')} size={56} color="#FFD84A" />
      <Label text="385 km" x={1250} y={560} at={W(s, '385')} size={56} />
    </>
  );
};
const DandiMarch: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = Math.min(14, 3 + Math.floor(f / 8));
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03, panFrom: [0, 0], panTo: [80, 0] }}>
      <HotRoad />
      <Layer depth={1}>
        {[...Array(n)].map((_, i) => <Chibi key={i} x={interpolate(f, [0, s.dur], [900, 1400]) - i * 110} y={900 + (i % 3) * 18} s={0.75} outfit={i === 0 ? GANDHI : CIV(COLS[i % 8], '#F1E6D0')} hat={i === 0 ? 'bald' : i % 3 === 0 ? 'gandhicap' : i % 3 === 1 ? 'veil' : 'pagri'} hatColor={COLS[(i + 3) % 8]} glasses={i === 0} skin={i === 0 ? '#C98A5A' : undefined} item={i === 0 ? 'banner' : undefined} legs="walk" expr="determined" seed={'dm' + i} delay={i * 3} />)}
        <g transform="translate(1600 600) rotate(6)"><rect x={-110} y={-70} width={220} height={140} fill="#F4F2EC" stroke={OL} strokeWidth={4} /><text y={-20} textAnchor="middle" fontFamily="TagBold" fontSize={26}>WORLD NEWS</text>{[0, 1, 2].map((k) => <path key={k} d={`M-90 ${10 + k * 22} H90`} stroke="#B5AA90" strokeWidth={5} />)}</g>
      </Layer>
    </CameraRig>
  );
};
const ShallowsS: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'picked');
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.15, focus: [960, 780], push: { at, to: 1.12, len: 10 } }}>
      <Shallows />
      <Layer depth={1}>
        <Gandhi x={960} y={900} s={1.15} mustache item={f > at ? 'none' : undefined} pose={f < at - 10 ? 'idle' : f < at ? 'carry' : 'raise'} expr={f > at ? 'happy' : 'calm'} seed="gs" />
        {f > at && <path transform={`translate(${1006} ${700 - Math.min(40, (f - at) * 4)})`} d="M-18 0 Q0 -26 18 0 Z" fill="#F4F2EC" stroke={OL} strokeWidth={3} />}
      </Layer>
    </CameraRig>
  );
};
const Crime = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'picking'), arm: 'shrug', expr: 'grin' }], { kids: (s) => <PopProp at={W(s, 'crime.')} x={1720} y={560}><g><rect x={-170} y={-60} width={340} height={120} rx={10} fill="#F4EEDD" stroke={OL} strokeWidth={5} /><text y={-10} textAnchor="middle" fontFamily="TagBold" fontSize={34}>WANTED FOR:</text><text y={36} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#B3261E">PICKING UP SALT</text></g></PopProp> });
const Sketch6: React.FC<SP> = ({ s }) => {
  const id = s.id, A = s.speaker === 'A';
  const bExpr = id === 's6_8' || id === 's6_2' ? 'angry' : id === 's6_10' ? 'shock' : 'normal';
  const aExpr = id === 's6_5' || id === 's6_11' ? 'grin' : id === 's6_9' ? 'worried' : 'normal';
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.02, focus: A ? [1300, 640] : [560, 640] }}>
      <Bungalow />
      <Layer depth={1}>
        <g transform="translate(560 800)"><rect x={-200} y={-40} width={400} height={40} fill="#6B4A2B" stroke={OL} strokeWidth={4} /><path d="M-180 0 V200 M180 0 V200" stroke="#6B4A2B" strokeWidth={12} /><path d="M100 -40 Q120 -90 150 -40 Z" fill="#F4F7FA" stroke={OL} strokeWidth={3} /></g>
        <Chibi x={560} y={800} s={1.15} outfit={OFFICIAL} hat="pith" mustache legs="sit" pose={id === 's6_2' || id === 's6_8' ? 'point' : id === 's6_10' ? 'shrug' : 'cross'} expr={bExpr} talking={A ? [] : talk(s)} seed="off" />
        <Chibi x={1360} y={950} s={1.1} outfit={OFFICIAL} hat="pith" item="notebook" pose={id === 's6_9' ? 'shrug' : 'scribble'} expr={aExpr} talking={A ? talk(s) : []} seed="aide6" flip />
      </Layer>
    </CameraRig>
  );
};
const Jailed: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [6, 60], [0, 60000], Easing.out));
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}>
        {[...Array(5)].map((_, i) => <g key={i} transform={`translate(${460 + i * 250} 560)`}><rect x={-100} y={-160} width={200} height={260} fill="#7A7F8C" stroke={OL} strokeWidth={5} />{[...Array(5)].map((_, k) => <path key={k} d={`M${-80 + k * 40} -160 V100`} stroke="#3A3A44" strokeWidth={8} />)}{f > 30 + i * 8 && <text y={-180} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#B3261E">FULL</text>}</g>)}
      </Layer></CameraRig>
      <Tally text={`JAILED: ${n.toLocaleString()}`} bump={99} />
    </>
  );
};
const WW2: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
    <Westminster />
    <Layer depth={1}><g transform="translate(960 560) rotate(-3)"><rect x={-260} y={-160} width={520} height={320} fill="#F4F2EC" stroke={OL} strokeWidth={5} /><text y={-90} textAnchor="middle" fontFamily="TagBold" fontSize={40}>INDIA AT WAR</text><text y={-30} textAnchor="middle" fontFamily="Hand" fontSize={36}>Indians consulted: 0</text><path d="M60 80 q30 -40 60 0 q30 40 60 -10" stroke="#1E3A8A" strokeWidth={5} fill="none" /></g></Layer>
  </CameraRig>
);
const WW2b: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03, panFrom: [-40, 0], panTo: [40, 0] }}>
      <Plain tents={false} />
      <Layer depth={1}>{[...Array(10)].map((_, i) => <Chibi key={i} x={interpolate(f, [0, s.dur], [-200, 400]) + i * 170} y={950 + (i % 2) * 20} s={0.75} outfit={SOLDIER44} hat={i % 3 === 0 ? 'pagri' : 'helmet'} hatColor={i % 3 === 0 ? '#6A6A3A' : '#5A5A3A'} mustache item="musket" legs="march" expr="determined" seed={'w2' + i} delay={i * 2} />)}</Layer>
    </CameraRig>
  );
};
const Famine43: React.FC<SP> = ({ s }) => <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.02 }}><EmptyVillage /><Layer depth={1.2}><rect x={-200} y={-200} width={2400} height={1500} fill="#000" opacity={0.25} /></Layer></CameraRig>;
const Famine43b: React.FC<SP> = ({ s }) => <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><GrainOut /></svg>;
const Broke45: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
    <Westminster />
    <Layer depth={1}><Chibi x={960} y={950} s={1.1} outfit={{ top: '#2A2E3A', bottom: '#2A2E3A' }} hat="europe" pose="shrug" itemL="sack" expr="worried" seed="br45" /><g transform="translate(1180 860)"><path d="M-40 40 Q-50 -10 -16 -30 L-20 -44 L20 -44 L16 -30 Q50 -10 40 40 Z" fill="#C9A47A" stroke={OL} strokeWidth={3} /><text y={20} textAnchor="middle" fontFamily="TagBold" fontSize={26}>£0</text></g></Layer>
  </CameraRig>
);
const Coming = H(() => [{ at: 0, arm: 'present', expr: 'smile' }, { at: 50, arm: 'finger' }]);
const Coming2 = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'never'), arm: 'shrug', expr: 'shock' }], { kids: (s) => <PopProp at={W(s, 'line')} x={1720} y={560}><g><rect x={-130} y={-150} width={260} height={300} fill="#F1E2C0" stroke={OL} strokeWidth={5} /><path d="M-40 -130 Q20 -40 -20 40 Q30 100 0 140" stroke="#B3261E" strokeWidth={8} fill="none" /></g></PopProp> });

// =============================================================== ACT 12
const RadcliffeS: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06 }}>
      <CompanyCoast fort={false} flag={false} />
      <Layer depth={1}><Radcliffe x={900} y={950} s={1.1} itemL="sack" pose="idle" expr="normal" seed="rad" /></Layer>
    </CameraRig>
    <Label text="Cyril Radcliffe" x={900} y={300} at={W(s, 'cyril')} size={66} color="#FFD84A" />
  </>
);
const Qualification = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'qualification,'), arm: 'shrug', expr: 'grin' }], { kids: (s) => <PopProp at={W(s, 'qualification,')} x={1720} y={560}><g><rect x={-140} y={-170} width={280} height={340} fill="#F4F2EC" stroke={OL} strokeWidth={5} /><text y={-110} textAnchor="middle" fontFamily="TagBold" fontSize={30}>CV</text><text y={-40} textAnchor="middle" fontFamily="Hand" fontSize={30}>Visits to India:</text><text y={20} textAnchor="middle" fontFamily="TagBold" fontSize={70} fill="#2E9A4A">0 ✓</text></g></PopProp> });
const FiveWeeks: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const days = Math.round(interpolate(f, [6, s.dur], [35, 26]));
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}><g transform="translate(500 -10) scale(0.9)"><path d={subPath()} fill="#E8DCC0" stroke={OL} strokeWidth={6} /></g></Layer></CameraRig>
      <Tally text={`DAYS LEFT: ${days}`} bump={99} />
    </>
  );
};
const FiveWeeks2: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}><g transform="translate(500 -10) scale(0.9)"><path d={subPath()} fill="#E8DCC0" stroke={OL} strokeWidth={6} /><ellipse cx={280} cy={300} rx={120} ry={160} fill="none" stroke="#FFD84A" strokeWidth={8} strokeDasharray="14 10" /><ellipse cx={820} cy={460} rx={100} ry={130} fill="none" stroke="#FFD84A" strokeWidth={8} strokeDasharray="14 10" /></g></Layer></CameraRig>
    <Label text="Punjab" x={760} y={250} at={W(s, 'punjab')} size={56} color="#FFD84A" />
    <Label text="Bengal" x={1460} y={350} at={W(s, 'bengal')} size={56} color="#FFD84A" />
  </>
);
const BungalowS: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.15, zoomTo: 0.95, focus: [760, 600] }}>
    <Bungalow />
    <Layer depth={1}>
      <g transform="translate(700 800)"><rect x={-200} y={-40} width={400} height={40} fill="#6B4A2B" stroke={OL} strokeWidth={4} /><path d="M-180 0 V200 M180 0 V200" stroke="#6B4A2B" strokeWidth={12} /><rect x={-150} y={-56} width={200} height={16} fill="#F1E2C0" stroke={OL} strokeWidth={2} /></g>
      <Radcliffe x={700} y={800} s={1.0} legs="sit" item="notebook" pose="scribble" expr="worried" seed="rad2" />
    </Layer>
  </CameraRig>
);
const Bungalow2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.1, focus: [1500, 400] }}>
      <Bungalow />
      <Layer depth={1}><Radcliffe x={1160} y={950} s={1.0} pose="point" expr="worried" seed="rad3" /><path d={`M1400 300 L${1400 + Math.min(1, f / 40) * 40} ${300 + Math.min(1, f / 40) * 260}`} stroke="#B3261E" strokeWidth={6} /></Layer>
    </CameraRig>
  );
};
const Sketch7: React.FC<SP> = ({ s }) => {
  const id = s.id, A = s.speaker === 'A';
  const rExpr = ['s7_11', 's7_13'].includes(id) ? 'worried' : id === 's7_17' ? 'sad' : id === 's7_15' ? 'shock' : 'normal';
  const aExpr = id === 's7_6' || id === 's7_16' ? 'grin' : 'normal';
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.02, focus: A ? [1300, 640] : [560, 640] }}>
      <Bungalow />
      <Layer depth={1}>
        <g transform="translate(560 800)"><rect x={-200} y={-40} width={400} height={40} fill="#6B4A2B" stroke={OL} strokeWidth={4} /><path d="M-180 0 V200 M180 0 V200" stroke="#6B4A2B" strokeWidth={12} /></g>
        <Radcliffe x={560} y={800} s={1.15} legs="sit" pose={id === 's7_17' ? 'chin' : id === 's7_11' ? 'shrug' : 'cross'} expr={rExpr} talking={A ? [] : talk(s)} seed="rad4" />
        <Chibi x={1360} y={950} s={1.1} outfit={OFFICIAL} hat="pith" item="notebook" pose="scribble" expr={aExpr} talking={A ? talk(s) : []} seed="aide7" flip />
      </Layer>
    </CameraRig>
  );
};
const LineDraw: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}><PartitionMap draw={interpolate(f, [6, s.dur * 0.8], [0, 1])} /></Layer></CameraRig>;
};
const LineDraw2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return <CameraRig move={{ zoomFrom: 1.03, zoomTo: 1.06 }}><InsertBg glow={false} /><Layer depth={1}><PartitionMap draw={1} flicker={interpolate(f, [s.dur * 0.5, s.dur], [0, 1])} /></Layer></CameraRig>;
};
const Flows: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}><PartitionMap draw={1} flicker={1} flows={interpolate(f, [6, s.dur], [0, 1])} /></Layer></CameraRig>;
};
const Column: React.FC<SP & { reverse?: boolean }> = ({ s, reverse }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.02 }}>
      <HotRoad />
      <Layer depth={1}>
        <g filter="url(#sil)">
          {[...Array(12)].map((_, i) => <Chibi key={i} x={(reverse ? interpolate(f, [0, s.dur], [1500, 1100]) + i * 160 : interpolate(f, [0, s.dur], [500, 900]) - i * 160) + 0} y={880 + (i % 3) * 20} s={0.7} outfit={CIV('#333')} hat={i % 2 ? 'veil' : 'turbanW'} item="bundle" pose="carry" legs="walk" seed={'cl' + i} delay={i * 2} flip={reverse} />)}
        </g>
      </Layer>
    </CameraRig>
  );
};
const ColumnA: React.FC<SP> = ({ s }) => <Column s={s} />;
const ColumnB: React.FC<SP> = ({ s }) => <Column s={s} reverse />;
const Trains: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.02 }}>
    <NightPlatform train={0} />
    <Layer depth={1.2}><rect x={-200} y={-200} width={2400} height={1500} fill="#000" opacity={0.45} /></Layer>
  </CameraRig>
);
const Toll: React.FC<SP> = ({ s }) => <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.02 }}><InsertBg glow={false} /><Layer depth={1}><PartitionMap draw={1} flicker={1} flows={1} /></Layer></CameraRig>;
const Families: React.FC<SP> = ({ s }) => (
  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
    <rect width={1920} height={1080} fill="#2A2420" />
    {[0, 1].map((side) => (
      <g key={side} transform={`translate(${side ? 1400 : 520} 620)`}>
        <rect x={-200} y={-160} width={400} height={160} fill="#9A7A6A" stroke="#000" strokeWidth={4} />
        <path d="M-240 -150 L0 -300 L240 -150 Z" fill="#7A5A4A" stroke="#000" strokeWidth={4} />
        <rect x={-40} y={-100} width={80} height={100} fill="#2A1A10" stroke="#000" strokeWidth={3} />
      </g>
    ))}
    <path d="M960 120 V1000" stroke="#B3261E" strokeWidth={10} strokeDasharray="30 20" />
  </svg>
);
const Calcutta: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
    <Study />
    <Layer depth={1}><Gandhi x={960} y={930} s={1.05} legs="sit" mustache pose="pray" expr="calm" seed="gc" /></Layer>
    <Layer depth={1.2}><rect x={-200} y={-200} width={2400} height={1500} fill="#000" opacity={0.2} /></Layer>
  </CameraRig>
);
const Gandhi48: React.FC<SP> = ({ s }) => (
  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
    <rect width={1920} height={1080} fill="#1A1612" />
    <ellipse cx={960} cy={760} rx={500} ry={60} fill="#2A2420" />
    {/* spectacles, sandals, staff — what remains */}
    <g transform="translate(860 700)"><circle cx={-30} cy={0} r={34} fill="none" stroke="#C9C0B0" strokeWidth={6} /><circle cx={50} cy={0} r={34} fill="none" stroke="#C9C0B0" strokeWidth={6} /><path d="M4 0 H16 M-64 0 L-110 -10 M84 0 L130 -10" stroke="#C9C0B0" strokeWidth={6} /></g>
    {[1060, 1150].map((x) => <ellipse key={x} cx={x} cy={740} rx={38} ry={16} fill="#6B4A2B" stroke="#000" strokeWidth={3} />)}
    <path d="M600 760 L1360 720" stroke="#8C6A4A" strokeWidth={14} strokeLinecap="round" />
  </svg>
);
const Midnight: React.FC<SP & { full?: boolean }> = ({ s, full }) => {
  const f = useCurrentFrame();
  const flagUp = full ? 1 : interpolate(f, [30, s.dur], [0, 1], Easing.out);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
        <DelhiParliament night />
        <Layer depth={1}>
          <g transform="translate(1630 200)"><circle r={60} fill="#F4EEDD" stroke={OL} strokeWidth={5} /><path d="M0 0 V-44 M0 0 V-40" stroke={OL} strokeWidth={7} strokeLinecap="round" />{[...Array(12)].map((_, i) => <path key={i} d={`M${Math.sin(i * 0.5236) * 50} ${-Math.cos(i * 0.5236) * 50} L${Math.sin(i * 0.5236) * 56} ${-Math.cos(i * 0.5236) * 56}`} stroke={OL} strokeWidth={3} />)}</g>
          <Chibi x={760} y={950} s={1.1} outfit={NEHRU} hat="gandhicap" pose="present" expr="happy" talking={talk(s)} seed="nehru" />
        </Layer>
      </CameraRig>
      <Label text="Jawaharlal Nehru" x={760} y={420} at={W(s, 'jawaharlal')} size={56} color="#FFD84A" />
      <div style={{ position: 'absolute', left: 1160, top: 840 - flagUp * 520, width: 300, height: 200 }}>
        <svg width={300} height={200}><rect x={0} y={0} width={300} height={66} fill="#E8862A" /><rect x={0} y={66} width={300} height={68} fill="#F4F7FA" /><rect x={0} y={134} width={300} height={66} fill="#138808" /><circle cx={150} cy={100} r={26} fill="none" stroke="#000080" strokeWidth={4} />{[...Array(24)].map((_, i) => <path key={i} d={`M150 100 L${150 + Math.cos(i * 0.2618) * 26} ${100 + Math.sin(i * 0.2618) * 26}`} stroke="#000080" strokeWidth={1.5} />)}<rect width={300} height={200} fill="none" stroke="#141414" strokeWidth={4} /></svg>
      </div>
      <div style={{ position: 'absolute', left: 1156, top: 840 - flagUp * 520, width: 6, height: 900, background: '#6B4A2B' }} />
    </>
  );
};
const Midnight2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  // "do not let the triumph sit clean": one frame of the refugee column, intercut
  const cut = f === Math.round(s.dur * 0.6);
  if (cut) return <Column s={s} />;
  return <Midnight s={s} full />;
};
const BothTrue = H(() => [{ at: 0, arm: 'idle', expr: 'worried' }, { at: 40, arm: 'present' }]);
const BothTrue2 = H(() => [{ at: 0, arm: 'present', expr: 'normal' }, { at: 90, arm: 'idle', expr: 'worried' }]);

// =============================================================== ACT 13
const DontKnow = H(() => [{ at: 0, arm: 'finger', expr: 'smile' }]);
const Princely: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}><PrincelyMap resolve={0} /></Layer></CameraRig>
      <Tally text="PRINCELY STATES: 565" bump={99} />
    </>
  );
};
const Princely2: React.FC<SP> = ({ s }) => <CameraRig move={{ zoomFrom: 1.03, zoomTo: 1.06 }}><InsertBg glow={false} /><Layer depth={1}><PrincelyMap resolve={0} /></Layer></CameraRig>;
const PatelS: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const r = interpolate(f, [10, s.dur], [0, 0.8], Easing.inOut);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}>
        <PrincelyMap resolve={r} />
        <Chibi x={1620} y={960} s={1.0} outfit={PATEL} hat="bald" mustache item="notebook" pose="scribble" expr="determined" seed="patel" flip />
      </Layer></CameraRig>
      <Tally text={`REMAINING: ${Math.round(565 * (1 - r))}`} bump={99} />
      <Label text="Vallabhbhai Patel" x={1580} y={500} at={W(s, 'vallabhbhai')} size={52} color="#FFD84A" />
    </>
  );
};
const Patel2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const r = interpolate(f, [0, s.dur], [0.8, 0.99]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}><PrincelyMap resolve={r} /></Layer></CameraRig>
      <Tally text={`REMAINING: ${Math.round(565 * (1 - r))}`} bump={99} />
    </>
  );
};
const Hyderabad: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.15, focus: [860, 720] }}><InsertBg glow={false} /><Layer depth={1}><PrincelyMap resolve={0.995} /><g transform="translate(500 -10) scale(0.9)"><ellipse cx={420} cy={700} rx={110} ry={90} fill="none" stroke="#FFD84A" strokeWidth={8} /></g></Layer></CameraRig>
    <Label text="Hyderabad" x={880} y={500} at={W(s, 'hyderabad,')} size={60} color="#FFD84A" />
  </>
);
const Kashmir: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.2, focus: [840, 150] }}><InsertBg glow={false} /><Layer depth={1}><PrincelyMap resolve={1} /></Layer></CameraRig>
    <Label text="Kashmir — still contested" x={960} y={500} at={W(s, 'kashmir')} size={56} color="#FFD84A" />
  </>
);
const Elections = H((s) => [{ at: 0, arm: 'present' }, { at: W(s, 'elections.'), arm: 'fist', expr: 'grin' }], { kids: (s) => <PopProp at={W(s, 'elections.')} x={1720} y={720}><g><rect x={-110} y={-120} width={220} height={200} fill="#5A6A7A" stroke={OL} strokeWidth={6} /><rect x={-60} y={-130} width={120} height={14} fill="#141414" /><path d="M-30 -190 L30 -190 L30 -130 L-30 -130 Z" fill="#F4F2EC" stroke={OL} strokeWidth={4} /></g></PopProp> });
const BallotS: React.FC<SP> = ({ s }) => <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg /><Layer depth={1}><Ballot mark={0} /></Layer></CameraRig>;
const Ballot2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.1, focus: [960, 480] }}><InsertBg /><Layer depth={1}><Ballot mark={interpolate(f, [W(s, 'party'), W(s, 'party') + 12], [0, 1])} /></Layer></CameraRig>;
};
const Worked = H((s) => [{ at: 0, arm: 'finger' }, { at: W(s, 'still'), arm: 'fist', expr: 'proud' }]);
const Green: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
      <WheatFields />
      <Layer depth={1}><Chibi x={760} y={860} s={1.0} outfit={CIV('#F4F2EC', '#F1E6D0')} hat="pagri" hatColor="#E8862A" mustache item="bundle" pose="cheer" expr="grin" seed="farm" /></Layer>
    </CameraRig>
    <Label text="Green Revolution" x={1300} y={300} at={W(s, 'green')} size={64} color="#FFD84A" />
  </>
);
const Wars: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}><g transform="translate(500 -10) scale(0.9)"><path d={subPath()} fill="#E8862A" stroke={OL} strokeWidth={6} /></g></Layer></CameraRig>
    <Label text="1962 — China" x={1400} y={180} at={W(s, 'china')} size={52} />
    <Label text="Pakistan" x={760} y={360} at={W(s, 'pakistan')} size={52} />
    <Label text="1971 — Bangladesh" x={1440} y={460} at={W(s, 'bangladesh.')} size={52} color="#FFD84A" />
  </>
);
const Emergency: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = W(s, 'emergency.');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06, shakes: [{ at, amp: 5 }] }}>
        <DelhiParliament />
        <Layer depth={1}><Chibi x={760} y={950} s={1.1} outfit={INDIRA} hat="indira" hatColor="#E8862A" pose={f > at ? 'point' : 'cross'} expr="determined" seed="indira" /></Layer>
      </CameraRig>
      <Label text="Indira Gandhi" x={760} y={420} at={W(s, 'indira')} size={56} color="#FFD84A" />
      <DropHtml at={at} left={1400} top={480} h={500}><div style={{ background: '#B3261E', color: '#fff', fontFamily: 'TagBold', fontSize: 70, padding: '10px 36px', border: '6px solid #141414', transform: 'rotate(-5deg)' }}>EMERGENCY</div></DropHtml>
    </>
  );
};
const Emergency2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const items: [string, string][] = [['JAILED', 'jailed,'], ['CENSORED', 'censored,'], ['SUSPENDED', 'suspended,']];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /></CameraRig>
      {items.map(([t, w], i) => <div key={t} style={{ position: 'absolute', left: 520 + i * 440, top: 420, transform: `translate(-50%,-50%) rotate(${(i - 1) * 6}deg) scale(${popScale(f, W(s, w))})`, border: '8px solid #B3261E', color: '#B3261E', fontFamily: 'TagBold', fontSize: 58, padding: '6px 22px', background: 'rgba(244,238,221,0.9)' }}>{t}</div>)}
      <Tally text={`MONTH ${Math.min(21, 1 + Math.floor(f / 4))} OF 21`} bump={99} />
    </>
  );
};
const CalledVote: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
    <DelhiParliament />
    <Layer depth={1}>
      <Chibi x={760} y={950} s={1.1} outfit={INDIRA} hat="indira" hatColor="#E8862A" pose="present" expr="normal" seed="indira2" />
      <g transform="translate(1300 760)"><rect x={-110} y={-120} width={220} height={200} fill="#5A6A7A" stroke={OL} strokeWidth={6} /><path d="M-30 -190 L30 -190 L30 -130 L-30 -130 Z" fill="#F4F2EC" stroke={OL} strokeWidth={4} /></g>
    </Layer>
  </CameraRig>
);
const Lost77 = H((s) => [{ at: 0, arm: 'idle', expr: 'shock' }, { at: W(s, 'accepted'), arm: 'present', expr: 'proud' }], { kids: (s) => <PopProp at={W(s, 'left')} x={1720} y={760}><Chibi x={0} y={200} s={0.8} outfit={INDIRA} hat="indira" hatColor="#E8862A" pose="wave" legs="walk" expr="calm" seed="indira3" flip /></PopProp> });
const Crisis: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [10, s.dur * 0.8], [1, 0.12], Easing.inOut);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}>
        <rect x={460} y={480} width={1000} height={120} rx={16} fill="#3A2E24" stroke={OL} strokeWidth={6} />
        <rect x={470} y={490} width={980 * v} height={100} rx={10} fill={v < 0.2 ? '#B3261E' : '#2E9A4A'} />
      </Layer></CameraRig>
      <Label text="FOREIGN RESERVES" x={960} y={400} at={4} size={56} />
      <Label text="≈ 3 weeks of imports" x={960} y={720} at={W(s, 'three')} size={64} color="#FFD84A" />
    </>
  );
};
const Oil = H((s) => [{ at: 0, arm: 'idle', expr: 'worried' }, { at: W(s, 'oil.'), arm: 'shrug', expr: 'shock' }], { kids: (s) => <PopProp at={W(s, 'oil.')} x={1720} y={720}><g><rect x={-70} y={-160} width={140} height={200} rx={10} fill="#3A3A3A" stroke={OL} strokeWidth={5} /><text y={-50} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#F2C230">OIL</text><text y={-10} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#B3261E">EMPTY</text></g></PopProp> });
const GoldS: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
        <Airfield />
        <Layer depth={1}>
          {[...Array(6)].map((_, i) => { const t = f - 10 - i * 10; return t > 0 ? <g key={i} transform={`translate(${interpolate(t, [0, 30], [300, 860], Easing.out)} ${730 - Math.min(40, t)})`}><rect x={-40} y={-40} width={80} height={60} fill="#8C5A2A" stroke={OL} strokeWidth={3} /><rect x={-26} y={-30} width={52} height={14} fill="#E2B13C" /></g> : null; })}
        </Layer>
      </CameraRig>
      <Tally text="47 TONNES" bump={99} />
    </>
  );
};
const Gold2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.02 }}>
      <Airfield planeX={interpolate(f, [0, s.dur], [900, 2400], Easing.in)} lift={interpolate(f, [s.dur * 0.4, s.dur], [0, 400], Easing.in)} />
      <Layer depth={1}><g transform="translate(300 700)"><Chibi x={0} y={260} s={0.9} outfit={{ top: '#2A2E3A', bottom: '#2A2E3A' }} hat="parted" hatColor="#2A2018" pose="present" expr="worried" seed="shh" /><text x={60} y={-30} fontFamily="Hand" fontSize={48} fill="#fff">shh...</text></g></Layer>
    </CameraRig>
  );
};
const Reforms: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const items: [string, string][] = [['LICENCES ✗', 'licence'], ['FOREIGN INVESTMENT ✓', 'foreign'], ['RUPEE DEVALUED', 'devalued.']];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg /></CameraRig>
      {items.map(([t, w], i) => <div key={t} style={{ position: 'absolute', left: 960, top: 300 + i * 160, transform: `translate(-50%,-50%) scale(${popScale(f, W(s, w))})`, background: '#F4EEDD', border: '6px solid #141414', fontFamily: 'TagBold', fontSize: 56, padding: '8px 30px' }}>{t}</div>)}
    </>
  );
};
const Growth: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [10, s.dur * 0.8], [0, 1]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}>
        <path d="M400 860 H1520 M400 860 V300" stroke="#F4EEDD" strokeWidth={6} />
        <path d={`M400 ${860 - 3 * 50} L${400 + 400} ${860 - 3 * 50} L${400 + 400 + 700 * p} ${860 - (3 + 5.5 * p) * 50}`} stroke="#2E9A4A" strokeWidth={12} fill="none" strokeLinejoin="round" />
        <path d="M800 280 V880" stroke="#FFD84A" strokeWidth={4} strokeDasharray="10 10" />
      </Layer></CameraRig>
      <Label text="~3%/yr" x={600} y={640} at={W(s, '3')} size={54} />
      <Label text="8%+" x={1460} y={330} at={W(s, '8.')} size={64} color="#FFD84A" />
      <Label text="1991" x={800} y={940} at={4} size={44} />
    </>
  );
};
const Software: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
    <TechOffice />
    <Layer depth={1}>{[0, 1, 2].map((i) => <Chibi key={i} x={500 + i * 460} y={870} s={0.95} outfit={CIV(['#2E86C1', '#C07A9C', '#16A085'][i], '#3A3F4A')} hat={i === 1 ? 'hairlong' : 'parted'} hatColor="#1E1612" glasses={i === 0} item="notebook" pose="scribble" expr="happy" seed={'sw' + i} />)}</Layer>
  </CameraRig>
);
const Bangalore: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><TechOffice boom={interpolate(f, [10, s.dur * 0.7], [0, 1])} /></CameraRig>
      <Label text="Bangalore" x={960} y={110} at={W(s, 'bangalore')} size={70} color="#FFD84A" />
      <Tally text={`YEAR ${1990 + Math.min(15, Math.floor(f / 6))}`} bump={99} />
    </>
  );
};
const MarsS: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05, shakes: [{ at: 4, amp: 5, len: 60 }] }}>
      <Launch t={Math.max(0, f - 20)} />
    </CameraRig>
  );
};
const MarsBars: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const h1 = spring(Math.max(0, f - 6), { damping: 12, stiffness: 90 }) * 74 * 4.4, h2 = spring(Math.max(0, f - W(s, 'gravity') ), { damping: 12, stiffness: 90 }) * 100 * 4.4;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.02 }}><InsertBg glow={false} /><Layer depth={1}>
        <path d="M560 700 H1360" stroke="#F4EEDD" strokeWidth={6} />
        <rect x={640} y={700 - h1} width={240} height={h1} fill="#E8862A" stroke={OL} strokeWidth={5} />
        <rect x={1040} y={700 - h2} width={240} height={h2} fill="#9DB4C0" stroke={OL} strokeWidth={5} />
      </Layer></CameraRig>
      <div style={{ position: 'absolute', left: 760, top: 720, transform: 'translateX(-50%)', fontFamily: 'TagBold', fontSize: 38, color: '#fff', textAlign: 'center' }}>MARS MISSION<br />$74M</div>
      <div style={{ position: 'absolute', left: 1160, top: 720, transform: 'translateX(-50%)', fontFamily: 'TagBold', fontSize: 38, color: '#fff', textAlign: 'center' }}>SPACE MOVIE<br />~$100M</div>
    </>
  );
};
const MarsOrbitS: React.FC<SP> = ({ s }) => <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><MarsOrbit /></svg>;

// =============================================================== CLOSE
const Montage = H(() => [{ at: 0, arm: 'present', expr: 'smile' }]);
const MSomnath: React.FC<SP> = () => <CameraRig move={{ zoomFrom: 1.1, zoomTo: 1.0 }}><TempleVault /></CameraRig>;
const MBabur: React.FC<SP> = () => {
  const lines = ['No ice.', 'Bad melons.', 'Bad grapes.', 'Bad horses.', 'Bad bread.'].map((t, i) => ({ text: t, at: -10 }));
  return <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}><InsertBg /><Layer depth={1}><Diary lines={lines} stars={1} /></Layer></CameraRig>;
};
const MTaj: React.FC<SP> = () => <CameraRig move={{ zoomFrom: 1.15, zoomTo: 1.0, focus: [960, 420] }}><TajGarden dusk /><Layer depth={0.8}><TajMahal x={960} y={760} s={0.95} /></Layer></CameraRig>;
const MThrone: React.FC<SP> = () => {
  const f = useCurrentFrame();
  return <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.0 }}><InsertBg /><Layer depth={1}><g transform={`translate(${interpolate(f, [0, 90], [960, 2300], Easing.in)} 0)`}><PeacockThrone x={0} y={860} s={0.9} glow={0.6} /></g></Layer></CameraRig>;
};
const MLedger: React.FC<SP> = () => <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><rect width={1920} height={1080} fill="#3A2E24" /><g transform="translate(510 20)"><RevenueLedger n={12} /></g></svg>;
const MLine: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}><PartitionMap draw={interpolate(f, [4, s.dur * 0.7], [0, 1])} /></Layer></CameraRig>;
};
const MVote: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}><InsertBg /><Layer depth={1}><Ballot mark={interpolate(f, [20, 32], [0, 1])} /></Layer></CameraRig>;
};
const MMars: React.FC<SP> = () => <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><MarsOrbit /></svg>;
const Erased = H(() => [{ at: 0, arm: 'chin', expr: 'normal' }, { at: 60, arm: 'present', expr: 'smile' }]);
const Erased2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const names: [string, string][] = [['Ghazni', 'ghazni,'], ['Aurangzeb', 'aurangzeb,'], ['the Raj', 'raj.']];
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'finger' }, { at: W(s, 'languages'), arm: 'present', expr: 'proud' }]}>
      {names.map(([n, w], i) => { const k = popScale(f, W(s, w)); const cr = interpolate(f, [W(s, w) + 6, W(s, w) + 12], [0, 1]); return k > 0 ? <g key={n} transform={`translate(1640 ${420 + i * 110}) scale(${k})`}><text textAnchor="middle" fontFamily="Hand" fontSize={56}>{n}</text><path d={`M-120 -14 L${-120 + 240 * cr} -14`} stroke="#B3261E" strokeWidth={8} /></g> : null; })}
    </HostShot>
  );
};
const Chariot: React.FC<SP> = ({ s }) => <CameraRig move={{ zoomFrom: 1.1, zoomTo: 1.0, focus: [1100, 700] }}><Boulders sun /><Layer depth={1}><StoneChariot x={1100} y={900} s={1.3} /></Layer></CameraRig>;
const OneThing = H(() => [{ at: 0, arm: 'present', expr: 'normal' }, { at: 60, arm: 'shrug' }]);
const OneThing2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'finger' }, { at: W(s, 'never'), arm: 'fist', expr: 'proud' }]}>
      <PopProp at={W(s, 'never')} x={1700} y={300}><KingdomMap x={-230} y={0} s={0.42} at={0} /></PopProp>
    </HostShot>
  );
};
const NextDoor = H(() => [{ at: 0, arm: 'finger', expr: 'grin' }, { at: 60, arm: 'point' }]);
const NextDoor2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'point', expr: 'smile' }, { at: W(s, 'catch'), arm: 'wave', expr: 'grin' }]}>
      <PopProp at={W(s, 'click')} x={1700} y={480}><g><rect x={-180} y={-110} width={360} height={220} rx={16} fill="#2A2E3A" stroke={OL} strokeWidth={6} /><path d="M-30 -40 L50 0 L-30 40 Z" fill="#F4F2EC" /><text y={150} textAnchor="middle" fontFamily="Hand" fontSize={40}>next video →</text></g></PopProp>
    </HostShot>
  );
};

export const SHOTS_B4: Record<string, React.FC<SP>> = {
  platform: Platform, platform2: Platform2, platform3: Platform3, return: Return, drawingroom: DrawingRoom, villages: Villages,
  bagh: Bagh, bagh2: Bagh2, black: Black, black2: Black, purse: Purse, purse2: Purse2, speech: Speech, impossible: Impossible, salt: SaltH,
  monopoly: Monopoly, hot: Hot, walked: Walked, dandimap: DandiMapS, dandimarch: DandiMarch, shallows: ShallowsS, crime: Crime, sketch6: Sketch6,
  jailed: Jailed, ww2: WW2, ww2b: WW2b, famine43: Famine43, famine43b: Famine43b, broke45: Broke45, coming: Coming, coming2: Coming2,
  radcliffe: RadcliffeS, qualification: Qualification, fiveweeks: FiveWeeks, fiveweeks2: FiveWeeks2, bungalow: BungalowS, bungalow2: Bungalow2,
  sketch7: Sketch7, linedraw: LineDraw, linedraw2: LineDraw2, flows: Flows, column: ColumnA, column2: ColumnB, trains: Trains, toll: Toll,
  families: Families, calcutta: Calcutta, gandhi48: Gandhi48, midnight: Midnight, midnight2: Midnight2, bothtrue: BothTrue, bothtrue2: BothTrue2,
  dontknow: DontKnow, princely: Princely, princely2: Princely2, patel: PatelS, patel2: Patel2, hyderabad: Hyderabad, kashmir: Kashmir,
  elections: Elections, ballot: BallotS, ballot2: Ballot2, worked: Worked, green: Green, wars: Wars, emergency: Emergency, emergency2: Emergency2,
  calledvote: CalledVote, lost77: Lost77, crisis: Crisis, oil: Oil, gold: GoldS, gold2: Gold2, reforms: Reforms, growth: Growth, software: Software,
  bangalore: Bangalore, mars: MarsS, marsbars: MarsBars, marsorbit: MarsOrbitS,
  montage: Montage, m_somnath: MSomnath, m_babur: MBabur, m_taj: MTaj, m_throne: MThrone, m_ledger: MLedger, m_line: MLine, m_vote: MVote, m_mars: MMars,
  erased: Erased, erased2: Erased2, chariot: Chariot, onething: OneThing, onething2: OneThing2, nextdoor: NextDoor, nextdoor2: NextDoor2,
};
