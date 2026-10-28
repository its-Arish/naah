/**
 * Act 7 — "Two Wars and a General" and Act 8 — "May 1968".
 * Exports PillarTable (the Fifth Republic diagram), reused in Acts 11–12.
 */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, spring, springPop, gravityDrop, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { FranceMap } from '@engine/scenes/France';
import { ParisStreet, School, Desk } from '@engine/scenes/FranceScenes';
import { Factory } from '@engine/scenes/IndiaB3';
import { hostShot, wordAt, PopProp, DropHtml, type ShotMap, type SP } from '@engine/kit';
import { GOLD, PEOPLE, MONEY, STATE, PEASANT } from './Shots01';
import { SANS, Calendar, Bars, mapXY, TRICOLORE } from './Shots04';
import { Pinned } from './Shots06';

export const DEGAULLE = { outfit: { top: '#5A6A4A', bottom: '#4A5A3A', trim: GOLD }, hat: 'kepi', hatColor: '#5A6A4A' };
export const PM_FIG = { outfit: { top: '#1E1E28', bottom: '#1E1E28', belt: '#F4F7FA' }, hat: 'hair', hair: '#3A2416' };
const POILU = { outfit: { top: '#6A84A8', bottom: '#6A84A8' }, hat: 'helmet', hatColor: '#6A84A8' };
const STUDENT = (c = '#C0392B') => ({ outfit: { top: c, bottom: '#2A3A5A' }, hat: 'hair', hair: ['#3A2416', '#C9A66B', '#1A1410'][Math.abs(c.charCodeAt(2)) % 3] });
const CRS = { outfit: { top: '#2A2E3A', bottom: '#2A2E3A' }, hat: 'helmet', hatColor: '#1E1E28', item: 'shield' };

/**
 * The Fifth Republic diagram: a tall pillar (PRESIDENT) beside a long table (ASSEMBLY) on which
 * a small PRIME MINISTER stands. `pull` (frame) knocks the PM off the table under gravity.
 */
export const PillarTable: React.FC<{ x?: number; y?: number; s?: number; at?: number; pull?: number; tall?: number; label?: boolean; crack?: number }> = ({ x = 960, y = 800, s = 1, at = -99, pull = 99999, tall = 1, label = true, crack = 0 }) => {
  const f = useCurrentFrame();
  const k = springPop(f, at);
  const g = gravityDrop(f, pull, { h: 260, g: 1.5, e: 0.25 });
  const off = f >= pull;
  const px = off ? 120 + Math.min(1, (f - pull) / 10) * 260 : 120;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      <rect x={-460} y={-560 * tall} width={150} height={560 * tall} fill="#E8DCC0" stroke={OL} strokeWidth={7} />
      <rect x={-480} y={-580 * tall} width={190} height={30} fill={GOLD} stroke={OL} strokeWidth={6} />
      {crack > 0 && <path d={`M-400 ${-520 * tall} L-370 ${-420 * tall} L-410 ${-330 * tall} L-380 ${-240 * tall}`} stroke={OL} strokeWidth={5} fill="none" strokeDasharray="400" strokeDashoffset={400 * (1 - crack)} />}
      {label && <text x={-385} y={-600 * tall - 20} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff">PRESIDENT</text>}
      <rect x={-200} y={-260} width={700} height={44} fill="#7A4E2B" stroke={OL} strokeWidth={6} />
      <rect x={-180} y={-216} width={26} height={216} fill="#5A3A22" /><rect x={450} y={-216} width={26} height={216} fill="#5A3A22" />
      {label && <text x={150} y={-227} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#F4ECD8">ASSEMBLY</text>}
      {[...Array(6)].map((_, i) => <circle key={i} cx={-150 + i * 120} cy={-10} r={0} />)}
      <g transform={`translate(${px} ${off ? -260 + 260 + g.y : -260}) rotate(${off && !g.landed ? (f - pull) * 6 : off ? 80 : 0})`}><Chibi x={0} y={0} s={0.8} {...PM_FIG} pose={off ? 'bothUp' : 'present'} expr={off ? 'shock' : 'normal'} talking={[]} seed="pm" /></g>
      {label && !off && <text x={120} y={-470} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#FFD84A">PRIME MINISTER</text>}
    </g>
  );
};

// ------------------------------------------------------------------ Act 7
const WW1: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b02 = s.id === 's08b02';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg glow={false} />
        <Layer depth={1}>
          {!b02 && [...Array(28)].map((_, i) => { const k = springPop(f, 6 + i); return k > 0 ? <g key={i} transform={`translate(${240 + (i % 14) * 110} ${330 + Math.floor(i / 14) * 170}) scale(${k * 0.55})`}><path d="M-60 0 Q-60 -70 0 -76 Q60 -70 60 0 L80 6 L-80 6 Z" fill="#6A84A8" stroke={OL} strokeWidth={6} /><path d="M-20 -76 L0 -100 L20 -76" fill="#6A84A8" stroke={OL} strokeWidth={5} /></g> : null; })}
          {!b02 && <text x={960} y={720} textAnchor="middle" fontFamily="TagBold" fontSize={90} fill="#F4ECD8" opacity={springPop(f, wordAt(s, '1.4'))}>~1,400,000</text>}
          {b02 && [0, 1, 2, 3].map((i) => <g key={i} opacity={i === 3 && f > wordAt(s, 'quarter') ? 0.25 : 1}><Chibi x={480 + i * 320} y={760} s={1.3} {...POILU} pose="idle" expr="normal" talking={[]} seed={'pl' + i} /></g>)}
          {b02 && <text x={960} y={230} textAnchor="middle" fontFamily="TagBold" fontSize={56} fill="#F4ECD8" opacity={springPop(f, wordAt(s, 'quarter'))}>more than 1 in 4 · men aged 18–27</text>}
        </Layer>
      </CameraRig>
      {!b02 && <Label text="1914–1918" x={960} y={150} at={4} size={60} color="#B8B8C0" />}
    </>
  );
};
const Fall1940: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const sweep = interpolate(f, [8, 70], [0, 1], Easing.inOut);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <FranceMap x={330} y={60} s={0.86} />
          <g opacity={0.65}><clipPath id="sw40"><rect x={330 + 860 * (1 - sweep)} y={0} width={1000} height={1080} /></clipPath><path d="M1080 60 L1240 260 L1000 520 L700 560 L520 360 L560 180 Z" fill="#5A5A64" clipPath="url(#sw40)" /></g>
          <path d={`M1300 160 Q${1200 - 400 * sweep} ${200 + 100 * sweep} ${1220 - 600 * sweep} ${260 + 120 * sweep}`} stroke="#3A3A48" strokeWidth={22} fill="none" strokeLinecap="round" />
        </Layer>
      </CameraRig>
      <div style={{ position: 'absolute', right: 80, top: 120, background: 'rgba(26,20,16,0.85)', border: '4px solid #F4ECD8', borderRadius: 12, padding: '8px 24px', fontFamily: 'TagBold', fontSize: 52, color: '#F4ECD8', opacity: springPop(f, wordAt(s, 'six')) }}>~6 WEEKS · 1940</div>
    </>
  );
};
const Vichy: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b05 = s.id === 's08b05';
  const [vx, vy] = mapXY('Vichy');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <FranceMap x={330} y={60} s={0.86} pins={[{ city: 'Vichy', at: b05 ? -99 : wordAt(s, 'spa'), color: '#5A5A64', label: true }]} />
          <path d="M700 120 L1240 160 L1100 520 L860 560 L700 620 L560 560 L420 480 L560 300 Z" fill="#5A5A64" opacity={0.45} />
          <text x={860} y={330} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff">OCCUPIED</text>
          {!b05 && <g transform="translate(1560 900)"><Chibi x={0} y={0} s={1.2} outfit={{ top: '#5A6A4A', bottom: '#5A6A4A', trim: GOLD }} hat="kepi" hatColor="#5A6A4A" mustache item="scroll" pose="scribble" expr="sad" talking={[]} seed="petain" /></g>}
          {b05 && <g transform={`translate(1560 900) scale(${springPop(f, wordAt(s, 'general'))})`} filter="url(#sil)"><Chibi x={0} y={0} s={1.5} {...DEGAULLE} pose="idle" expr="determined" talking={[]} seed="dgs" /></g>}
        </Layer>
      </CameraRig>
      {!b05 && <Label text="armistice · June 1940" x={1500} y={300} at={wordAt(s, 'armistice,')} size={50} color="#FFD84A" />}
    </>
  );
};
const Radio: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b07 = s.id === 's08b07';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform="translate(420 300)"><rect x={-130} y={-60} width={260} height={100} rx={14} fill="#3A3A48" stroke={OL} strokeWidth={6} /><text y={10} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#F4ECD8">LONDON</text></g>
          <Chibi x={420} y={880} s={1.5} {...DEGAULLE} pose="present" expr="determined" talking={[[6, 200]]} seed="dgr" />
          <g transform="translate(560 560)"><rect x={-20} y={0} width={40} height={300} fill="#5A5A64" /><rect x={-50} y={-90} width={100} height={110} rx={40} fill="#3A3A48" stroke={OL} strokeWidth={6} /></g>
          {[0, 1, 2, 3].map((i) => { const r = ((f * 3 + i * 60) % 240); return <path key={i} d={`M${640 + r} ${470 - r * 0.5} Q${700 + r} ${500} ${640 + r} ${530 + r * 0.5}`} stroke="#FFD84A" strokeWidth={6} fill="none" opacity={1 - r / 240} />; })}
          <g transform="translate(1180 60) scale(0.62)"><FranceMap x={0} y={0} s={1} /></g>
        </Layer>
      </CameraRig>
      {!b07 && <Label text="18 June 1940" x={1460} y={720} at={wordAt(s, '18')} size={54} color="#FFD84A" />}
      {b07 && <DropHtml at={wordAt(s, 'battle,') - 6} left={1450} top={400} h={300}><div style={{ fontFamily: 'Hand', fontSize: 50, color: '#1A1410', background: '#F4ECD8', border: '6px solid #1A1410', padding: '14px 30px', textAlign: 'center', maxWidth: 640 }}>"France has lost a battle.<br />But France has not lost the war!"</div></DropHtml>}
      {b07 && <div style={{ position: 'absolute', right: 40, top: 40, maxWidth: 640, textAlign: 'right', fontFamily: 'Tag', fontSize: 26, color: '#F4ECD8', background: 'rgba(26,20,16,0.7)', padding: '6px 14px', borderRadius: 8 }}>The famous line is from his poster of summer 1940; the 18 June broadcast made the same point.</div>}
    </>
  );
};
const Liberation: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <ParisStreet />
        <Layer depth={1.1}>{[...Array(9)].map((_, i) => <Chibi key={i} x={140 + i * 210} y={930} s={0.95} {...SANS(['#C0392B', '#2E4A9A', '#F4F7FA', '#B85A30'][i % 4])} hat={i % 2 ? 'cap' : 'none'} pose={i % 2 ? 'cheer' : 'raise'} expr="happy" talking={[]} seed={'lb' + i} />)}</Layer>
      </CameraRig>
      <Label text="Liberation · August 1944" x={960} y={140} at={wordAt(s, 'liberation')} size={54} color="#1A1410" />
    </>
  );
};
const RevolvingDoor: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b10 = s.id === 's08b10';
  const n = b10 ? Math.min(21, Math.floor(interpolate(f, [wordAt(s, 'twenty') - 30, wordAt(s, 'twenty') + 10], [1, 21]))) : 1;
  const spin = b10 ? f * 9 : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          {!b10 && <><rect x={560} y={500} width={800} height={50} fill="#7A4E2B" stroke={OL} strokeWidth={6} />{[...Array(7)].map((_, i) => <Chibi key={i} x={620 + i * 115} y={500} s={0.6} {...PM_FIG} pose="raise" expr="happy" talking={[]} seed={'p4' + i} />)}<text x={960} y={620} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#fff">PARLIAMENT IN CHARGE</text><g transform="translate(1600 600)"><rect x={-30} y={-150} width={60} height={150} fill="#E8DCC0" stroke={OL} strokeWidth={5} /><text y={50} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#B8B8C0">weak president</text></g></>}
          {b10 && <g transform="translate(860 560)">{[0, 90, 180, 270].map((a) => <g key={a} transform={`rotate(${a + spin})`}><rect x={-6} y={-240} width={12} height={240} fill="#A8C6E0" stroke={OL} strokeWidth={4} /></g>)}<circle r={24} fill="#5A5A64" stroke={OL} strokeWidth={5} />{[0, 1].map((i) => <g key={i} transform={`rotate(${spin + i * 180 + 45}) translate(0 -150) rotate(${-(spin + i * 180 + 45)})`}><Chibi x={0} y={60} s={0.6} {...PM_FIG} pose="bothUp" expr="shock" talking={[]} seed={'rv' + ((Math.floor(spin / 180) + i) % 9)} /></g>)}</g>}
        </Layer>
      </CameraRig>
      {b10 && <div style={{ position: 'absolute', right: 120, top: 380, background: 'rgba(26,20,16,0.85)', border: '4px solid #FFD84A', borderRadius: 12, padding: '10px 28px', fontFamily: 'TagBold', fontSize: 56, color: '#FFD84A', textAlign: 'center' }}>GOVERNMENTS<br />{n}{n >= 21 ? '+' : ''}<div style={{ fontSize: 30, color: '#F4ECD8' }}>in 12 years</div></div>}
      {!b10 && <Label text="Fourth Republic · 1946" x={960} y={140} at={wordAt(s, 'Fourth')} size={54} color="#FFD84A" />}
    </>
  );
};
const Algeria58: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b12 = s.id === 's08b12';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          {!b12 && <>{[...Array(5)].map((_, i) => <Chibi key={i} x={300 + i * 150} y={880} s={0.9} {...{ outfit: { top: '#6A7A4A', bottom: '#6A7A4A' }, hat: 'helmet', hatColor: '#4A5A3A', item: 'musket' }} legs="march" pose="hold" expr="angry" talking={[]} seed={'al' + i} delay={i * 2} />)}<path d="M1100 600 L1500 600" stroke="#B3261E" strokeWidth={18} strokeLinecap="round" /><path d="M1480 570 L1530 600 L1480 630" stroke="#B3261E" strokeWidth={18} fill="none" strokeLinecap="round" /><text x={1640} y={612} fontFamily="TagBold" fontSize={44} fill="#fff">PARIS?</text></>}
          {b12 && <><Chibi x={1160} y={900} s={1.7} {...DEGAULLE} pose="present" expr="calm" talking={[]} seed="dg58" />{[...Array(6)].map((_, i) => <Chibi key={i} x={200 + i * 130} y={940} s={0.8} {...PM_FIG} pose="point" expr="happy" talking={[]} seed={'pt' + i} flip />)}</>}
        </Layer>
      </CameraRig>
      {!b12 && <Label text="Algeria crisis · May 1958" x={960} y={140} at={wordAt(s, 'Algeria')} size={54} color="#FFD84A" />}
    </>
  );
};
const FifthRepublic: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s08b13', 's08b14', 's08b15', 's08b16'].indexOf(s.id);
  const pull = idx === 3 ? wordAt(s, 'down') : 99999;
  const tall = idx >= 2 ? 1 + 0.25 * (idx === 2 ? spring(f - wordAt(s, 'enormous'), { damping: 10, stiffness: 120 }) * (f >= wordAt(s, 'enormous') ? 1 : 0) : 1) : 1;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          {idx === 0 && <g transform={`translate(960 470) scale(${springPop(f, wordAt(s, 'rewrote'))})`}><rect x={-230} y={-260} width={460} height={520} fill="#F4ECD8" stroke={OL} strokeWidth={7} /><text y={-170} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill="#2E4A9A">CONSTITUTION</text><text y={-110} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#1A1410">1958</text>{[...Array(6)].map((_, i) => <path key={i} d={`M-170 ${-40 + i * 50} H${170 - (i % 2) * 60}`} stroke="#C9BFA6" strokeWidth={5} />)}</g>}
          {idx >= 1 && <PillarTable x={1000} y={830} at={idx === 1 ? wordAt(s, 'Fifth') : -99} tall={tall} pull={pull} />}
          {idx === 2 && <g transform={`translate(420 460) scale(${springPop(f, wordAt(s, '1962'))})`}><rect x={-110} y={-80} width={220} height={160} rx={12} fill="#6A4A2A" stroke={OL} strokeWidth={6} /><rect x={-60} y={-88} width={120} height={14} fill={OL} /><text y={20} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#F4ECD8">VOTE</text><path d="M120 0 L260 -60" stroke="#FFD84A" strokeWidth={8} strokeDasharray="14 10" /></g>}
        </Layer>
      </CameraRig>
      {idx === 1 && <Label text="the Fifth Republic · 1958" x={960} y={140} at={wordAt(s, 'Fifth')} size={54} color="#FFD84A" />}
      {idx === 2 && <Label text="directly elected from 1962" x={420} y={260} at={wordAt(s, '1962')} size={46} color="#FFD84A" />}
    </>
  );
};
const RememberDesign = hostShot((s) => [{ at: 0, arm: 'finger', expr: 'proud' }], {
  props: (s) => <g transform="translate(1100 620) scale(0.55)"><PillarTable x={0} y={0} at={-99} label={false} /></g>,
  overlay: (s) => <Pinned text="PILLAR + TABLE" left={720} top={860} at={s.id === 's08b17' ? wordAt(s, 'design.') - 4 : undefined} size={64} />,
});
const Unshakeable: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b20 = s.id === 's08b20';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <PillarTable x={1040} y={830} at={-99} crack={b20 ? interpolate(f, [wordAt(s, 'nearly'), wordAt(s, 'nearly') + 20], [0, 1]) : 0} />
          <Chibi x={440} y={880} s={1.5} {...DEGAULLE} pose={b20 ? 'shrug' : 'cross'} expr={b20 ? 'shock' : 'proud'} talking={[]} seed="dgu" />
          {b20 && <g transform={`translate(1560 300) scale(${springPop(f, wordAt(s, 'dormitory'))}) rotate(4)`}><rect x={-120} y={-170} width={240} height={340} fill="#7A4E2B" stroke={OL} strokeWidth={6} /><rect x={-90} y={-120} width={180} height={70} fill="#F4F7FA" stroke={OL} strokeWidth={4} /><text y={-74} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill="#B3261E">NO VISITORS</text><circle cx={80} cy={20} r={10} fill={GOLD} /></g>}
        </Layer>
      </CameraRig>
      {b20 && <Label text="1968" x={1560} y={560} at={wordAt(s, 'Ten')} size={60} color="#FFD84A" />}
    </>
  );
};

// ------------------------------------------------------------------ Act 8
const Campus: React.FC<{ closed?: boolean }> = ({ closed }) => (
  <>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#B8C8D4" /></Layer>
    <Layer depth={0.6}>{[0, 1, 2].map((i) => <g key={i}><rect x={80 + i * 620} y={220} width={520} height={540} fill="#C9C4BA" stroke={OL} strokeWidth={6} />{[...Array(24)].map((_, k) => <rect key={k} x={110 + i * 620 + (k % 6) * 82} y={250 + Math.floor(k / 6) * 120} width={60} height={80} fill="#7A8A9A" stroke={OL} strokeWidth={3} />)}</g>)}</Layer>
    <Layer depth={1}><rect x={-200} y={760} width={2400} height={600} fill="#8A8A84" stroke={OL} strokeWidth={4} />{closed && <><path d="M-200 700 H2120" stroke="#5A5A64" strokeWidth={10} />{[...Array(24)].map((_, i) => <rect key={i} x={-180 + i * 90} y={600} width={10} height={170} fill="#5A5A64" />)}</>}</Layer>
  </>
);
const Nanterre: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s09b01', 's09b02', 's09b03'].indexOf(s.id);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Campus />
        <Layer depth={1.1}>
          {[...Array(7)].map((_, i) => <Chibi key={i} x={200 + i * 240} y={930} s={0.95} {...STUDENT(['#C0392B', '#2E4A9A', '#E2B13C', '#2E6B4A', '#8A3A8A', '#B85A30', '#3A3A48'][i])} item={i === 2 ? 'banner' : i === 5 ? 'book' : undefined} pose={idx >= 1 ? (i % 2 ? 'fist' : 'raise') : 'idle'} expr={idx >= 1 ? 'angry' : 'normal'} talking={[]} seed={'st' + i} />)}
          {idx === 2 && <g transform={`translate(960 370) scale(${springPop(f, wordAt(s, 'banned'))})`}><rect x={-260} y={-90} width={520} height={180} fill="#F4F7FA" stroke={OL} strokeWidth={6} /><text y={-20} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill="#B3261E">DORMITORY RULES</text><text y={40} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill="#1A1410">NO VISITS ♂ ⇄ ♀</text></g>}
        </Layer>
      </CameraRig>
      {idx === 0 && <Label text="Nanterre · spring 1968" x={960} y={140} at={wordAt(s, 'Nanterre,')} size={54} color="#1A1410" />}
    </>
  );
};
const Closed: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}><Campus closed /></CameraRig>
      <DropHtml at={wordAt(s, 'closed')} left={960} top={400} h={300}><div style={{ fontFamily: 'TagBold', fontSize: 80, color: '#B3261E', border: '8px solid #B3261E', padding: '4px 30px', borderRadius: 12, background: 'rgba(255,255,255,0.92)', transform: 'rotate(-5deg)' }}>FERMÉ · CLOSED</div></DropHtml>
    </>
  );
};
const Sorbonne: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#B8C8D4" /></Layer>
      <Layer depth={0.6}>
        <rect x={460} y={340} width={1000} height={420} fill="#E8DCC0" stroke={OL} strokeWidth={6} />
        <path d="M760 340 Q960 100 1160 340 Z" fill="#8A9AA8" stroke={OL} strokeWidth={6} /><rect x={940} y={120} width={40} height={60} fill="#8A9AA8" stroke={OL} strokeWidth={4} />
        {[...Array(8)].map((_, i) => <rect key={i} x={500 + i * 120} y={420} width={50} height={300} fill="#D4C8A8" stroke={OL} strokeWidth={3} />)}
      </Layer>
      <Layer depth={1}><rect x={-200} y={760} width={2400} height={600} fill="#9A9A90" stroke={OL} strokeWidth={4} />{[...Array(12)].map((_, i) => <Chibi key={i} x={80 + i * 160} y={930 + (i % 2) * 14} s={0.85} {...STUDENT(['#C0392B', '#2E4A9A', '#E2B13C', '#2E6B4A'][i % 4])} pose={i % 3 ? 'raise' : 'fist'} expr="determined" talking={[]} seed={'sb' + i} />)}</Layer>
    </CameraRig>
    <Label text="the Sorbonne, central Paris" x={960} y={140} at={wordAt(s, 'Sorbonne')} size={54} color="#1A1410" />
  </>
);
const Barricades68: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b07 = s.id === 's09b07';
  const swing = b07 ? interpolate(f, [wordAt(s, 'sympathy'), wordAt(s, 'sympathy') + 24], [-40, 40], Easing.inOut) : -40;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <ParisStreet night />
        <Layer depth={1.1}>
          <path d="M200 900 L300 760 L520 740 L700 780 L900 720 L1100 770 L1300 900 Z" fill="#6A6A70" stroke={OL} strokeWidth={6} />
          {[...Array(14)].map((_, i) => <rect key={i} x={300 + i * 66} y={790 - (i % 3) * 18} width={56} height={34} fill="#8A8A90" stroke={OL} strokeWidth={3} />)}
          <g transform="translate(1000 760) rotate(170)"><rect x={-110} y={-50} width={220} height={90} rx={30} fill="#3A4A6A" stroke={OL} strokeWidth={5} /></g>
          {b07 && [0, 1, 2].map((i) => <g key={i} filter="url(#sil)"><Chibi x={1460 + i * 150} y={930} s={1.0} {...CRS} pose="hold" expr="normal" talking={[]} seed={'crs' + i} flip /></g>)}
        </Layer>
      </CameraRig>
      {!b07 && <Label text="night of 10 May · the Latin Quarter" x={960} y={140} at={wordAt(s, '10')} size={52} color="#fff" />}
      {b07 && <svg style={{ position: 'absolute', left: 1460, top: 80 }} width={400} height={240}><path d="M40 200 A160 160 0 0 1 360 200" stroke="#F4ECD8" strokeWidth={8} fill="none" /><text x={40} y={230} fontFamily="TagBold" fontSize={22} fill="#F4ECD8">GOV'T</text><text x={290} y={230} fontFamily="TagBold" fontSize={22} fill="#F4ECD8">STUDENTS</text><g transform={`translate(200 200) rotate(${swing})`}><path d="M0 0 L0 -150" stroke="#FFD84A" strokeWidth={10} strokeLinecap="round" /></g><text x={200} y={30} textAnchor="middle" fontFamily="TagBold" fontSize={24} fill="#FFD84A">PUBLIC SYMPATHY</text></svg>}
    </>
  );
};
/** Strike map: factory lights switching off one by one; counter to 10,000,000. */
const StrikeMap: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s09b08', 's09b09', 's09b10', 's09b11', 's09b12'].indexOf(s.id);
  const t0 = idx === 1 ? wordAt(s, 'open-ended') - 10 : idx >= 2 ? -200 : 99999;
  const cities = ['Paris', 'Lille', 'Nantes', 'Rennes', 'Bordeaux', 'Toulouse', 'Marseille', 'Lyon', 'Strasbourg', 'Limoges', 'Le Havre', 'Orléans', 'Nice', 'Sedan'];
  const n = idx === 2 ? Math.round(10000000 * interpolate(f, [4, wordAt(s, 'million') + 6], [0.15, 1], Easing.out)) : idx > 2 ? 10000000 : idx === 1 ? Math.round(1500000 * Math.min(1, Math.max(0, (f - t0) / 40))) : 0;
  const stop = idx === 4;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <FranceMap x={330} y={60} s={0.86} />
          {cities.map((c, i) => { const [x, y] = mapXY(c); const off = f >= t0 + i * 4; return <g key={c} transform={`translate(${x} ${y})`}><rect x={-20} y={-30} width={40} height={30} fill="#5A5A64" stroke={OL} strokeWidth={3} /><rect x={-10} y={-48} width={10} height={20} fill="#5A5A64" /><circle cy={-14} r={9} fill={off ? '#3A3A48' : '#FFD84A'} />{!off && <circle cy={-14} r={18} fill="#FFD84A" opacity={0.3} />}</g>; })}
          {idx === 0 && [...Array(6)].map((_, i) => <Chibi key={i} x={1380 + (i % 3) * 150} y={600 + Math.floor(i / 3) * 280} s={0.75} {...{ outfit: { top: '#2E4A9A', bottom: '#2E4A9A' }, hat: 'cap', hatColor: '#2E4A9A' }} pose={f > wordAt(s, 'joined.') + i * 2 ? 'raise' : 'idle'} expr="determined" talking={[]} seed={'wk' + i} />)}
          {idx === 3 && ['🏭', '🚆', '📺'].map((e, i) => { const k = springPop(f, wordAt(s, ['Factories,', 'trains,', 'broadcasting.'][i])); return k > 0 ? <g key={e} transform={`translate(${1460} ${280 + i * 200}) scale(${k})`}><text textAnchor="middle" y={40} fontSize={110} opacity={0.5}>{e}</text><path d="M-70 -50 L70 70" stroke="#B3261E" strokeWidth={14} /></g> : null; })}
        </Layer>
      </CameraRig>
      {idx >= 1 && idx <= 3 && <div style={{ position: 'absolute', left: 60, bottom: 260, background: 'rgba(26,20,16,0.85)', border: '4px solid #FFD84A', borderRadius: 12, padding: '8px 24px', fontFamily: 'TagBold', fontSize: 50, color: '#FFD84A' }}>ON STRIKE: {n.toLocaleString('en-US')}</div>}
      {idx === 2 && <Label text="≈ 2/3 of the workforce" x={1460} y={420} at={wordAt(s, 'thirds')} size={52} color="#FFD84A" />}
      {stop && <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,20,26,0.45)' }} />}
      {stop && <div style={{ position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: 'TagBold', fontSize: 120, color: '#F4ECD8', opacity: springPop(f, wordAt(s, 'stopped.')) }}>⏸ FRANCE</div>}
      {idx === 1 && <Label text="13 May 1968" x={960} y={140} at={wordAt(s, '13')} size={54} color="#FFD84A" />}
    </>
  );
};
const Vanished: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b14 = s.id === 's09b14';
  const spin = Math.sin(f / 7) * 20 * Math.exp(-f / 60);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#C9B89A" />{[...Array(5)].map((_, i) => <rect key={i} x={i * 420} y={100} width={30} height={660} fill="#B8A688" />)}<rect x={1300} y={160} width={300} height={360} fill="#A8C6E0" stroke={OL} strokeWidth={8} /></Layer>
        <Layer depth={1}>
          <rect x={-200} y={780} width={2400} height={600} fill="#7A5A3A" stroke={OL} strokeWidth={4} />
          <g transform={`translate(860 760) rotate(${spin})`}><rect x={-80} y={-240} width={160} height={200} rx={20} fill="#8A1E2E" stroke={OL} strokeWidth={6} /><rect x={-90} y={-50} width={180} height={40} fill="#8A1E2E" stroke={OL} strokeWidth={5} /></g>
          <Desk x={960} y={760} s={1.1} candle={false} />
          {b14 && <g transform="translate(1450 420)"><circle r={110} fill="#F4F7FA" stroke={OL} strokeWidth={8} /><path d={`M0 0 L0 -80`} stroke={OL} strokeWidth={8} transform={`rotate(${f * 6})`} /><path d="M0 0 L50 0" stroke={OL} strokeWidth={10} transform={`rotate(${f * 0.5})`} /></g>}
        </Layer>
      </CameraRig>
      {!b14 && <Label text="29 May 1968" x={960} y={140} at={wordAt(s, '29')} size={56} color="#1A1410" />}
      <div style={{ position: 'absolute', left: 860, top: 330, transform: 'translate(-50%,0)', fontFamily: 'TagBold', fontSize: 150, color: '#1A1410', opacity: springPop(f, b14 ? 0 : wordAt(s, 'vanished.')) }}>?</div>
    </>
  );
};
const BadenBaden: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b16 = s.id === 's09b16';
  const P = mapXY('Paris'), B = mapXY('Strasbourg');
  const BB = [B[0] + 60, B[1] - 30];
  const k = b16 ? 1 : interpolate(f, [8, 60], [0, 1], Easing.inOut);
  const hx = P[0] + (BB[0] - P[0]) * k, hy = P[1] + (BB[1] - P[1]) * k - Math.sin(k * Math.PI) * 120;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.1, zoomTo: 1.15, focus: [1000, 340] }}>
        <InsertBg />
        <Layer depth={1}>
          <FranceMap x={330} y={60} s={0.86} pins={[{ city: 'Paris', at: -99, color: STATE }]} />
          <path d={`M${P[0]} ${P[1]} Q${(P[0] + BB[0]) / 2} ${P[1] - 140} ${BB[0]} ${BB[1]}`} stroke="#F4ECD8" strokeWidth={5} strokeDasharray="12 10" fill="none" />
          <g transform={`translate(${BB[0]} ${BB[1]})`}><circle r={12} fill={GOLD} stroke={OL} strokeWidth={4} /><text x={20} y={-16} fontFamily="TagBold" fontSize={32} fill="#fff" stroke={OL} strokeWidth={4} style={{ paintOrder: 'stroke' }}>Baden-Baden</text></g>
          <g transform={`translate(${hx} ${hy})`}><ellipse rx={36} ry={20} fill="#5A6A4A" stroke={OL} strokeWidth={4} /><path d={`M${-50 * Math.cos(f)} -24 L${50 * Math.cos(f)} -24`} stroke={OL} strokeWidth={5} /><path d="M30 0 L64 -6" stroke="#5A6A4A" strokeWidth={8} /></g>
          {b16 && <g transform={`translate(1420 700) scale(${springPop(f, 4) * 0.8})`}><Chibi x={-70} y={0} s={1} {...DEGAULLE} pose="present" expr="calm" talking={[]} seed="dgb" /><Chibi x={70} y={0} s={1} outfit={{ top: '#6A7A4A', bottom: '#6A7A4A', trim: GOLD }} hat="kepi" hatColor="#C0392B" pose="raise" expr="determined" talking={[]} seed="massu" flip /></g>}
        </Layer>
      </CameraRig>
      {b16 && <Label text="is the army with me?" x={1200} y={180} at={wordAt(s, 'army')} size={52} color="#FFD84A" />}
    </>
  );
};
const Landslide: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s09b17', 's09b18', 's09b19'].indexOf(s.id);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          {idx <= 1 && <>
            <g transform="translate(560 560)"><rect x={-170} y={-120} width={340} height={260} rx={12} fill="#6A4A2A" stroke={OL} strokeWidth={6} /><rect x={-80} y={-128} width={160} height={14} fill={OL} /><text y={40} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill="#F4ECD8">JUNE 1968</text></g>
            {idx === 1 && <Bars x={1000} y={740} max={360} h={480} w={180} gap={80} bars={[{ label: 'GAULLISTS', v: 354, c: '#2E4A9A', at: wordAt(s, 'landslide.') - 8, text: '~350 seats' }, { label: 'OTHERS', v: 133, c: '#8A8A94', at: wordAt(s, 'landslide.') - 2, text: '' }]} />}
          </>}
          {idx === 2 && <Bars x={600} y={740} max={4} h={480} w={260} gap={200} bars={[{ label: 'MIN. WAGE · MAY', v: 2.22, c: '#8A8A94', at: 4, text: '2.22 F/h' }, { label: 'AFTER THE DEAL', v: 3.0, c: MONEY, at: wordAt(s, 'jumping'), text: '3.00 F/h' }]} />}
        </Layer>
      </CameraRig>
      {idx === 2 && <Label text="≈ +35%" x={1300} y={160} at={wordAt(s, '35')} size={70} color="#8EE0A8" />}
    </>
  );
};
const Pattern = hostShot((s) => [{ at: 0, arm: s.id === 's09b20' ? 'finger' : 'present', expr: 'proud' }], {
  props: (s) => {
    const f = useCurrentFrame();
    const show = s.id !== 's09b20';
    const t1 = s.id === 's09b21' ? wordAt(s, 'pay') : -99, t2 = s.id === 's09b22' ? wordAt(s, 'landslide') : s.id === 's09b21' ? 99999 : -99;
    return show ? <g transform="translate(1060 560)">
      <g opacity={1}><rect x={-180} y={-180} width={360} height={100} rx={14} fill={PEOPLE} stroke={OL} strokeWidth={5} /><text y={-115} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#fff">"REVOLUTION"</text></g>
      <text y={-20} textAnchor="middle" fontFamily="TagBold" fontSize={60} fill="#1A1410">↓</text>
      {springPop(f, t1) > 0 && <g transform={`translate(0 60) scale(${springPop(f, t1)})`}><rect x={-180} y={-40} width={360} height={80} rx={14} fill={MONEY} stroke={OL} strokeWidth={5} /><text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#fff">PAY RISE</text></g>}
      {springPop(f, t2) > 0 && <g transform={`translate(0 160) scale(${springPop(f, t2)})`}><rect x={-180} y={-40} width={360} height={80} rx={14} fill="#2E4A9A" stroke={OL} strokeWidth={5} /><text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#fff">+ GOV'T LANDSLIDE</text></g>}
    </g> : null;
  },
});
const Resign69: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const walk = interpolate(f, [wordAt(s, 'resigned'), d], [700, 1500]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform={`translate(560 460) scale(${springPop(f, wordAt(s, 'referendum.'))}) rotate(-4)`}><rect x={-160} y={-110} width={320} height={220} fill="#F4F2EC" stroke={OL} strokeWidth={6} /><text y={-40} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill="#1A1410">REFERENDUM 1969</text><text y={50} textAnchor="middle" fontFamily="TagBold" fontSize={80} fill="#B3261E">NON</text></g>
          <Chibi x={walk} y={900} s={1.5} {...DEGAULLE} legs={f > wordAt(s, 'resigned') ? 'walk' : 'stand'} pose="idle" expr="sad" talking={[]} seed="dg69" />
        </Layer>
      </CameraRig>
      <Label text="April 1969" x={1300} y={160} at={wordAt(s, 'resigned')} size={54} color="#FFD84A" />
    </>
  );
};
/** Sketch: 246 cheeses. A (right) = aide, B (left) = de Gaulle at his desk; the cheese pile grows. */
const SketchCheese: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const order = ['s09b24', 's09b25', 's09b26', 's09b27', 's09b28', 's09b29'];
  const idx = order.indexOf(s.id);
  const n = idx < 1 ? 0 : idx === 1 ? Math.min(24, Math.floor(interpolate(f, [wordAt(s, 'two'), wordAt(s, 'cheese?')], [0, 24]))) : 24;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.0 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#C9B89A" /><rect x={760} y={120} width={400} height={300} fill="#A8C6E0" stroke={OL} strokeWidth={8} />{TRICOLORE.map((c, i) => <rect key={i} x={1220 + i * 40} y={140} width={40} height={90} fill={c} stroke={OL} strokeWidth={2} />)}</Layer>
        <Layer depth={1}>
          <rect x={-200} y={780} width={2400} height={600} fill="#7A5A3A" stroke={OL} strokeWidth={4} />
          <Chibi x={420} y={900} s={1.4} {...DEGAULLE} pose={s.speaker === 'B' ? 'present' : 'cross'} expr={s.speaker === 'B' ? 'calm' : 'normal'} talking={s.speaker === 'B' ? [[6, s.talkEnd ?? 60]] : []} seed="dgc" />
          <Desk x={700} y={780} s={0.9} candle={false} />
          {[...Array(n)].map((_, i) => { const row = Math.floor(i / 6), col = i % 6; return <g key={i} transform={`translate(${560 + col * 56 + (row % 2) * 28} ${700 - row * 44})`}><path d="M-26 0 L26 0 L20 -36 L-20 -36 Z" fill={['#F2C230', '#F4ECD8', '#E8A94A'][i % 3]} stroke={OL} strokeWidth={3} /></g>; })}
          <Chibi x={1460} y={900} s={1.4} outfit={{ top: '#1E1E28', bottom: '#1E1E28', belt: '#F4F7FA' }} hat="hair" hair="#3A2416" item="notebook" pose={s.speaker === 'A' ? 'present' : 'hold'} expr={s.speaker === 'A' ? 'worried' : 'shock'} talking={s.speaker === 'A' ? [[6, s.talkEnd ?? 60]] : []} seed="aide68" flip />
        </Layer>
      </CameraRig>
      {idx === 1 && <Label text="246" x={700} y={420} at={wordAt(s, 'cheese?') - 4} size={80} color="#FFD84A" />}
      {idx >= 4 && <div style={{ position: 'absolute', right: 40, top: 40, maxWidth: 560, textAlign: 'right', fontFamily: 'Tag', fontSize: 26, color: '#F4ECD8', background: 'rgba(26,20,16,0.7)', padding: '6px 14px', borderRadius: 8 }}>The cheese line is widely attributed to de Gaulle; the exact wording and number vary.</div>}
    </>
  );
};
const Subscribe2 = hostShot((s) => [{ at: 0, arm: 'present', expr: s.id === 's09b32' ? 'grin' : 'smile' }], {
  props: (s) => s.id === 's09b32' ? <>
    <PopProp at={wordAt(s, 'subscribe,')} x={1060} y={760}><g><rect x={-170} y={-50} width={340} height={100} rx={18} fill="#C0392B" stroke={OL} strokeWidth={6} /><text y={16} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill="#fff">SUBSCRIBE</text></g></PopProp>
    <PopProp at={wordAt(s, '1789')} x={1060} y={560}><g><text x={-110} y={20} textAnchor="middle" fontFamily="TagBold" fontSize={60} fill={GOLD}>1789</text><text y={20} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill="#1A1410">↔</text><text x={110} y={20} textAnchor="middle" fontFamily="TagBold" fontSize={60} fill={PEOPLE}>2026</text></g></PopProp>
  </> : null,
});

export const SHOTS_07: ShotMap = {
  ww1: WW1, fall1940: Fall1940, vichy: Vichy, radio: Radio, liberation: Liberation, revolving_door: RevolvingDoor,
  algeria58: Algeria58, fifth_republic: FifthRepublic, remember_design: RememberDesign, unshakeable: Unshakeable,
  nanterre: Nanterre, closed: Closed, sorbonne: Sorbonne, barricades68: Barricades68, strike_map: StrikeMap,
  vanished: Vanished, baden: BadenBaden, landslide: Landslide, pattern: Pattern, resign69: Resign69,
  sketch_cheese: SketchCheese, subscribe2: Subscribe2,
};
