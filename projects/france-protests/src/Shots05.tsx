/**
 * Act 5 — "The Terror". Restraint: no executions or guillotine imagery; numbers, documents, empty rooms.
 */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, spring, springPop, gravityDrop, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { FranceMap, CORSICA_PATH } from '@engine/scenes/France';
import { RoyalRoom, ParisStreet } from '@engine/scenes/FranceScenes';
import { hostShot, wordAt, PopProp, DropHtml, type ShotMap, type SP } from '@engine/kit';
import { GOLD, PEOPLE, MONEY, STATE, NOBLE, PEASANT } from './Shots01';
import { ROBES, SANS, GUARD_NAT, Calendar, Bars, mapXY } from './Shots04';

const DEP = (c = '#1E1E28') => ({ outfit: { top: c, bottom: '#1E1E28', sash: '#C0392B' }, hat: 'hair', hair: '#3A2416' });
const Portrait: React.FC<{ x: number; y: number; s?: number; who: any; seed: string; label?: string }> = ({ x, y, s = 1, who, seed, label }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-170} y={-220} width={340} height={420} fill="#7A4E2B" stroke={OL} strokeWidth={8} />
    <rect x={-145} y={-195} width={290} height={370} fill="#C9D6E3" />
    <g transform="translate(0 160)"><Chibi x={0} y={0} s={1.1} {...who} pose="idle" expr="calm" talking={[]} seed={seed} /></g>
    {label && <text y={250} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#fff">{label}</text>}
  </g>
);
const Assembly: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={dark ? '#4A4038' : '#8A7A62'} />{[...Array(5)].map((_, r) => <path key={r} d={`M-200 ${300 + r * 90} Q960 ${200 + r * 90} 2120 ${300 + r * 90}`} stroke="#6A5A48" strokeWidth={40} fill="none" />)}</Layer>
    <Layer depth={1}><rect x={-200} y={780} width={2400} height={600} fill="#5A4636" stroke={OL} strokeWidth={4} /></Layer>
  </>
);

const RobespierreHost = hostShot((s) => [{ at: 0, arm: 'present', expr: 'normal' }, { at: wordAt(s, 'twist.'), arm: 'finger', expr: 'grin' }], {
  props: () => <PopProp at={6} x={1060} y={600}><Portrait x={0} y={0} s={0.8} who={ROBES} seed="rh" label="ROBESPIERRE" /></PopProp>,
});
const Speech1791: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [800, 560] }}>
        <Assembly />
        <Layer depth={1.1}>
          <rect x={620} y={600} width={300} height={200} fill="#7A4E2B" stroke={OL} strokeWidth={6} />
          <Chibi x={770} y={640} s={1.2} {...ROBES} pose="raise" expr="determined" talking={[[6, 120]]} seed="sp" />
          {[...Array(7)].map((_, i) => <Chibi key={i} x={1100 + i * 130} y={930} s={0.8} {...DEP(['#1E1E28', '#3A3A48'][i % 2])} pose={i % 3 ? 'cross' : 'chin'} expr="normal" talking={[]} seed={'sa' + i} flip />)}
        </Layer>
      </CameraRig>
      <DropHtml at={wordAt(s, 'abolish')} left={760} top={260} h={260}><div style={{ fontFamily: 'Hand', fontSize: 52, color: '#1A1410', background: '#fff', border: '5px solid #1A1410', borderRadius: 30, padding: '12px 30px', whiteSpace: 'nowrap' }}>"Abolish the death penalty!"</div></DropHtml>
      <Label text="1791" x={1500} y={160} at={wordAt(s, '1791')} size={60} color="#FFD84A" />
    </>
  );
};
const Committee: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const em = s.id === 's06b04' ? wordAt(s, 'emergency.') : 99999;
  const blink = f >= em && Math.floor((f - em) / 8) % 2 === 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 620] }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#3E3A44" />{[...Array(6)].map((_, i) => <rect key={i} x={i * 340} y={80} width={150} height={260} fill="#2A2830" stroke={OL} strokeWidth={4} />)}</Layer>
        <Layer depth={1}>
          <rect x={-200} y={780} width={2400} height={600} fill="#2E2A30" stroke={OL} strokeWidth={4} />
          {[...Array(6)].map((_, i) => <Chibi key={i} x={340 + i * 250} y={690} s={0.9} {...(i === 2 ? ROBES : DEP(['#1E1E28', '#3A3A48', '#2A3A2A'][i % 3]))} pose={i === 2 ? 'point' : 'cross'} expr="determined" talking={[]} seed={'cm' + i} />)}
          <rect x={220} y={640} width={1480} height={60} fill="#5A3A22" stroke={OL} strokeWidth={6} />
          <rect x={260} y={700} width={30} height={160} fill="#3A2416" /><rect x={1630} y={700} width={30} height={160} fill="#3A2416" />
          <rect x={300} y={612} width={1320} height={30} fill="#2E6B4A" />
        </Layer>
      </CameraRig>
      <div style={{ position: 'absolute', left: 960, top: 120, transform: 'translateX(-50%)', fontFamily: 'TagBold', fontSize: 50, color: '#F4ECD8', background: 'rgba(26,20,16,0.8)', border: '4px solid #F4ECD8', padding: '6px 26px', whiteSpace: 'nowrap' }}>COMMITTEE OF PUBLIC SAFETY</div>
      {f >= em && <div style={{ position: 'absolute', left: 960, top: 230, transform: 'translateX(-50%)', fontFamily: 'TagBold', fontSize: 46, color: blink ? '#fff' : '#B3261E', background: blink ? '#B3261E' : 'rgba(255,255,255,0.9)', border: '5px solid #B3261E', padding: '4px 22px', borderRadius: 10 }}>PERMANENT EMERGENCY</div>}
    </>
  );
};
const Suspects: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b6 = s.id === 's06b06';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <ParisStreet />
        <Layer depth={1.1}>
          {[...Array(6)].map((_, i) => {
            const t = b6 ? wordAt(s, 'suspected') + i * 5 : 99999; const k = springPop(f, t);
            return <g key={i}><Chibi x={260 + i * 280} y={930} s={1.0} {...PEASANT(['#C0392B', '#8A3A2A', '#5A4A3A', '#2E6B4A', '#B85A30', '#3A3A48'][i])} hat={i % 2 ? 'cap' : 'none'} hatColor="#3A3A48" pose={k > 0 ? 'shrug' : 'idle'} expr={k > 0 ? 'shock' : 'normal'} talking={[]} seed={'su' + i} />
              {k > 0 && <g transform={`translate(${260 + i * 280} 520) scale(${k}) rotate(${(i % 2 ? 6 : -6)})`}><rect x={-90} y={-30} width={180} height={56} rx={6} fill="#fff" stroke="#B3261E" strokeWidth={5} /><text y={12} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill="#B3261E">SUSPECT</text></g>}</g>;
          })}
        </Layer>
      </CameraRig>
      {!b6 && <DropHtml at={wordAt(s, 'Suspects')} left={960} top={330} h={360}><div style={{ background: '#F4ECD8', border: '6px solid #1A1410', padding: '18px 40px', textAlign: 'center', boxShadow: '10px 12px 0 rgba(0,0,0,0.3)' }}><div style={{ fontFamily: 'TagBold', fontSize: 64, color: '#1A1410' }}>LAW OF SUSPECTS</div><div style={{ fontFamily: 'Hand', fontSize: 40, color: '#5A3A22' }}>17 September 1793</div></div></DropHtml>}
    </>
  );
};
const Tribunal: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s06b07', 's06b08', 's06b09'].indexOf(s.id);
  const pull = idx === 2 ? interpolate(f, [2, 20], [0, 1], Easing.inOut) : idx > 2 ? 1 : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 620] }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#5A4A3A" />{[...Array(8)].map((_, i) => <rect key={i} x={-100 + i * 300} y={60} width={80} height={700} fill="#6A5A48" stroke={OL} strokeWidth={4} />)}</Layer>
        <Layer depth={1}>
          <rect x={-200} y={780} width={2400} height={600} fill="#3E3024" stroke={OL} strokeWidth={4} />
          <rect x={1100} y={480} width={680} height={130} fill="#5A3A22" stroke={OL} strokeWidth={6} />
          {[0, 1, 2].map((i) => <Chibi key={i} x={1250 + i * 190} y={500} s={0.9} {...DEP()} pose="cross" expr="determined" talking={[]} seed={'tr' + i} flip />)}
          <Chibi x={420} y={920} s={1.15} {...PEASANT('#5A4A3A')} pose="idle" expr="sad" talking={[]} seed="acc" />
          <g transform={`translate(${720 + pull * 900} 0)`} opacity={1 - pull * 0.9}>
            <rect x={-60} y={760} width={120} height={20} fill="#7A4E2B" stroke={OL} strokeWidth={4} /><rect x={-60} y={650} width={20} height={240} fill="#7A4E2B" stroke={OL} strokeWidth={4} /><rect x={-50} y={780} width={14} height={110} fill="#5A3A22" /><rect x={40} y={780} width={14} height={110} fill="#5A3A22" />
            <text x={0} y={620} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#F4ECD8">DEFENCE</text>
          </g>
        </Layer>
      </CameraRig>
      {idx === 0 && <Label text="Revolutionary Tribunal" x={960} y={140} at={wordAt(s, 'tribunals')} size={54} color="#fff" />}
      {idx >= 1 && <Label text="Law of 22 Prairial · June 1794" x={960} y={140} at={idx === 1 ? wordAt(s, 'June') : -99} size={54} color="#FFD84A" />}
    </>
  );
};
const Grim: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s06b10', 's06b11', 's06b12'].indexOf(s.id);
  const more = idx === 1 ? wordAt(s, 'tens') : idx === 2 ? -99 : 99999;
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <InsertBg glow={false} />
      <Layer depth={1}>
        <text x={960} y={200} textAnchor="middle" fontFamily="TagBold" fontSize={70} fill="#F4ECD8" opacity={idx === 0 ? springPop(f, wordAt(s, 'Terror,')) : 1}>THE TERROR · 1793–94</text>
        {idx >= 1 && <Bars x={500} y={690} max={45000} h={400} w={300} gap={320} bars={[
          { label: 'SENTENCED', v: 17000, c: '#8A8A94', at: idx === 1 ? wordAt(s, '17,000') : -99, text: '~17,000' },
          { label: 'NO TRIAL / PRISON', v: 35000, c: '#5A5A64', at: more, text: 'tens of thousands' },
        ]} />}
      </Layer>
    </CameraRig>
  );
};
const WhoDied: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b14 = s.id === 's06b14';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg glow={false} />
        <Layer depth={1}>
          <Bars x={430} y={690} max={85} h={440} gap={160} bars={[
            { label: 'NOBLES', v: 8.5, c: '#6A4A8A', at: b14 ? -99 : wordAt(s, 'aristocrats.') - 10, text: '~8%' },
            { label: 'CLERGY', v: 6.5, c: '#3A3A48', at: b14 ? -99 : wordAt(s, 'aristocrats.') - 4, text: '~7%' },
            { label: 'COMMONERS', v: 85, c: PEOPLE, at: b14 ? -99 : wordAt(s, 'not'), text: '~85%' },
          ]} />
          {b14 && ['farmers,', 'workers,', 'shopkeepers.'].map((w, i) => { const k = springPop(f, wordAt(s, w)); return k > 0 ? <g key={w} transform={`translate(${1500} ${300 + i * 150}) scale(${k})`}><text x={0} y={14} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#F4ECD8">{w.replace(/[,.]/g, '').toUpperCase()}</text></g> : null; })}
        </Layer>
      </CameraRig>
      <div style={{ position: 'absolute', right: 40, top: 40, fontFamily: 'Tag', fontSize: 24, color: '#B8B8C0' }}>approximate shares of official death sentences (Greer, 1935)</div>
    </>
  );
};
const EqualScale: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b16 = s.id === 's06b16';
  const ang = b16 ? 10 * Math.exp(-f / 14) * Math.cos(f / 4) : 10;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 500] }}>
        <InsertBg glow={false} />
        <Layer depth={1}>
          <path d="M960 260 V780 M840 780 H1080" stroke="#8A8A94" strokeWidth={16} strokeLinecap="round" />
          <g transform={`translate(960 280) rotate(${ang})`}>
            <path d="M-420 0 H420" stroke="#8A8A94" strokeWidth={14} strokeLinecap="round" />
            {[-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * 400} 0) rotate(${-ang})`}><path d="M0 0 L-110 190 M0 0 L110 190" stroke="#8A8A94" strokeWidth={5} /><path d="M-140 190 Q0 250 140 190 Z" fill="#8A8A94" stroke={OL} strokeWidth={5} /><g transform="translate(0 190)"><Chibi x={0} y={0} s={0.7} {...(sd < 0 ? NOBLE() : PEASANT())} pose="idle" expr="normal" talking={[]} seed={'eq' + sd} /></g></g>)}
          </g>
        </Layer>
      </CameraRig>
      <Label text={b16 ? 'the same for rich and poor' : 'meant to be "humane"'} x={960} y={150} at={b16 ? wordAt(s, 'same') : wordAt(s, 'humane')} size={54} color="#F4ECD8" />
    </>
  );
};
const DrGuillotin: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b18 = s.id === 's06b18';
  const DOC = { outfit: { top: '#1E1E28', bottom: '#1E1E28', trim: '#F4F7FA' }, hat: 'hairlong', hatColor: '#ECECEC' };
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        {b18 ? <RoyalRoom night /> : <InsertBg />}
        <Layer depth={1.1}>
          {!b18 && <Portrait x={760} y={480} who={DOC} seed="dg" label="DR JOSEPH-IGNACE GUILLOTIN" />}
          {!b18 && springPop(f, wordAt(s, "didn't")) > 0 && <g transform={`translate(1360 470) scale(${springPop(f, wordAt(s, "didn't"))})`}><circle r={110} fill="none" stroke="#B3261E" strokeWidth={14} /><path d="M-60 60 L60 -60" stroke="#B3261E" strokeWidth={14} /><text y={170} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#fff">didn't build it</text><path d="M-40 20 L30 -50 M10 -70 L50 -30" stroke="#C9A66B" strokeWidth={14} strokeLinecap="round" /></g>}
          {b18 && <><rect x={600} y={680} width={720} height={160} rx={20} fill="#F4F7FA" stroke={OL} strokeWidth={6} /><rect x={560} y={560} width={60} height={300} fill="#7A4E2B" stroke={OL} strokeWidth={5} /><rect x={1300} y={620} width={60} height={240} fill="#7A4E2B" stroke={OL} strokeWidth={5} /><circle cx={720} cy={660} r={56} fill="#F3D2B0" stroke={OL} strokeWidth={5} /><path d="M690 660 q10 8 20 0 M730 660 q10 8 20 0" stroke={OL} strokeWidth={4} fill="none" /><rect x={760} y={640} width={540} height={90} rx={30} fill="#7FB2E5" stroke={OL} strokeWidth={5} />{[0, 1, 2].map((i) => <text key={i} x={820 + i * 50 + Math.sin(f / 10 + i) * 6} y={540 - i * 60 - (f % 60) * 0.4} fontFamily="TagBold" fontSize={44 + i * 10} fill="#F4ECD8" opacity={0.8}>z</text>)}</>}
        </Layer>
      </CameraRig>
      {b18 && <Label text="died peacefully · 1814" x={960} y={150} at={wordAt(s, '1814.')} size={56} color="#FFD84A" />}
    </>
  );
};
const Thermidor: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [960, 470] }}>
    <InsertBg />
    <Layer depth={1}>
      <Calendar x={700} y={470} month="THERMIDOR" day={9} year="Year II" color="#2E6B4A" />
      <text x={1000} y={490} textAnchor="middle" fontFamily="TagBold" fontSize={80} fill="#FFD84A" opacity={springPop(useCurrentFrame(), wordAt(s, '27'))}>=</text>
      <PopProp at={wordAt(s, '27')} x={1300} y={470}><Calendar x={0} y={0} month="JULY" day={27} year={1794} color={STATE} /></PopProp>
    </Layer>
  </CameraRig>
);
const TurnOn: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const t = wordAt(s, 'turned');
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [800, 600] }}>
      <Assembly dark />
      <Layer depth={1.1}>
        <rect x={360} y={600} width={300} height={200} fill="#7A4E2B" stroke={OL} strokeWidth={6} />
        <Chibi x={510} y={640} s={1.15} {...ROBES} pose={f > t ? 'shrug' : 'raise'} expr={f > t ? 'shock' : 'determined'} talking={[]} seed="rt" />
        {[...Array(7)].map((_, i) => <Chibi key={i} x={900 + i * 150} y={930} s={0.9} {...DEP(['#1E1E28', '#3A3A48', '#2A3A2A'][i % 3])} pose={f > t + i * 2 ? 'point' : 'cross'} expr="angry" talking={[]} seed={'to' + i} flip />)}
      </Layer>
    </CameraRig>
  );
};
const Arrest: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
    <Assembly dark />
    <Layer depth={1.1}>
      <Chibi x={660} y={930} s={1.15} {...GUARD_NAT} pose="hold" expr="determined" talking={[]} seed="ag1" />
      <Chibi x={960} y={930} s={1.2} {...ROBES} pose="idle" expr="sad" talking={[]} seed="ra" />
      <Chibi x={1260} y={930} s={1.15} {...GUARD_NAT} pose="hold" expr="determined" talking={[]} seed="ag2" flip />
    </Layer>
  </CameraRig>
);
const Dawn: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.03, zoomTo: 1.0 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#3A3A48" /><circle cx={960} cy={760} r={interpolate(f, [0, d], [120, 180])} fill="#C98A5A" opacity={0.5} /></Layer>
        <Layer depth={1}><rect x={-200} y={760} width={2400} height={600} fill="#2A2A34" stroke={OL} strokeWidth={4} />{[...Array(6)].map((_, i) => <g key={i} filter="url(#sil)"><Chibi x={200 + i * 300} y={920} s={0.8} {...GUARD_NAT} pose="hold" expr="normal" talking={[]} seed={'dw' + i} /></g>)}</Layer>
      </CameraRig>
      <Label text="28 July 1794" x={960} y={150} at={8} size={54} color="#B8B8C0" />
    </>
  );
};
/** Gears of a machine labelled FEAR; a name card falls (gravity) into its hopper. */
const MachineOfFear: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'caught');
  const drop = gravityDrop(f, at - 16, { h: 420, g: 1.4, e: 0.2 });
  const Gear: React.FC<{ x: number; y: number; r: number; dir: number }> = ({ x, y, r, dir }) => (
    <g transform={`translate(${x} ${y}) rotate(${dir * f * 1.2})`}>
      {[...Array(10)].map((_, i) => <rect key={i} x={-14} y={-r - 22} width={28} height={36} fill="#6A6A74" stroke={OL} strokeWidth={4} transform={`rotate(${i * 36})`} />)}
      <circle r={r} fill="#7A7A84" stroke={OL} strokeWidth={6} /><circle r={r * 0.3} fill="#4A4A54" stroke={OL} strokeWidth={5} />
    </g>
  );
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 520] }}>
      <InsertBg glow={false} />
      <Layer depth={1}>
        <Gear x={760} y={560} r={150} dir={1} /><Gear x={1080} y={500} r={110} dir={-1.36} /><Gear x={1260} y={680} r={90} dir={1.66} />
        <path d="M820 200 L1100 200 L1010 330 L910 330 Z" fill="#5A5A64" stroke={OL} strokeWidth={6} />
        <text x={960} y={260} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#F4ECD8">FEAR</text>
        {f >= at - 16 && drop.y < -10 && <g transform={`translate(960 ${300 + drop.y}) scale(${drop.sx} ${drop.sy})`}><rect x={-150} y={-36} width={300} height={66} fill="#F4ECD8" stroke={OL} strokeWidth={5} /><text y={12} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#1A1410">ROBESPIERRE</text></g>}
      </Layer>
    </CameraRig>
  );
};
/** Sketch: the revolutionary calendar. A (right) = official with a clipboard, B (left) = a worker. */
const SketchCalendar: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const rain = ['s06b34', 's06b35'].includes(s.id);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.0 }}>
      <Layer depth={0}>
        <rect x={-200} y={-200} width={2400} height={1500} fill="#B89A7A" />
        <rect x={760} y={120} width={400} height={300} fill={rain ? '#7A8A9A' : '#A8C6E0'} stroke={OL} strokeWidth={8} />
        <path d="M960 120 V420 M760 270 H1160" stroke={OL} strokeWidth={6} />
        {rain && [...Array(24)].map((_, i) => <path key={i} d={`M${770 + ((random('rr' + i) * 380 + f * 3) % 380)} ${130 + ((random('rq' + i) * 280 + f * 18) % 280)} l-6 22`} stroke="#E0E8F0" strokeWidth={3} />)}
        <g transform="translate(330 200)"><rect x={-150} y={-60} width={300} height={280} fill="#F4ECD8" stroke={OL} strokeWidth={5} /><text y={-20} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill="#1A1410">THE NEW WEEK</text>{[...Array(10)].map((_, i) => <g key={i}><rect x={-130 + (i % 5) * 52} y={10 + Math.floor(i / 5) * 90} width={46} height={80} fill={i === 9 ? '#2E6B4A' : '#fff'} stroke={OL} strokeWidth={3} /><text x={-107 + (i % 5) * 52} y={60 + Math.floor(i / 5) * 90} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill={i === 9 ? '#fff' : '#1A1410'}>{i + 1}</text></g>)}</g>
      </Layer>
      <Layer depth={1}>
        <rect x={-200} y={780} width={2400} height={600} fill="#7A5A3A" stroke={OL} strokeWidth={4} />
        <Chibi x={460} y={920} s={1.4} {...PEASANT('#B85A30')} hat="cap" hatColor="#C0392B" pose={s.speaker === 'B' ? 'shrug' : 'cross'} expr={s.speaker === 'B' ? 'angry' : 'normal'} talking={s.speaker === 'B' ? [[6, s.talkEnd ?? 60]] : []} seed="wk" />
        <Chibi x={1460} y={920} s={1.4} outfit={{ top: '#1E1E28', bottom: '#1E1E28', sash: '#C0392B' }} hat="tricorn" hatColor="#1E1E28" item="notebook" pose={s.speaker === 'A' ? 'present' : 'hold'} expr={s.speaker === 'A' ? 'happy' : 'normal'} talking={s.speaker === 'A' ? [[6, s.talkEnd ?? 60]] : []} seed="off" flip />
      </Layer>
    </CameraRig>
  );
};
const Checkbox: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}><rect x={-60} y={-60} width={120} height={120} rx={14} fill="#F4F7FA" stroke={OL} strokeWidth={7} /><text y={30} textAnchor="middle" fontFamily="TagBold" fontSize={90} fill="#8A8A94">?</text></g>
);
const BoxesTease: React.FC<SP> = ({ s }) => {
  const order = ['s06b36', 's06b37', 's06b38', 's06b39', 's06b40', 's06b41'];
  const idx = order.indexOf(s.id);
  const C = hostShot(() => [{ at: 0, arm: idx === 3 ? 'finger' : idx === 5 ? 'shrug' : 'present', expr: idx === 5 ? 'grin' : 'smile' }], {
    props: (s) => {
      const f = useCurrentFrame();
      if (idx === 2) return <PopProp at={wordAt(s, 'month,')} x={1060} y={640}><Calendar x={0} y={0} s={0.7} month="OCTOBER" day="NOW" year={2026} color={PEOPLE} /></PopProp>;
      if (idx === 3 || idx === 4) {
        const t0 = idx === 3 ? wordAt(s, 'three') : -99;
        return <g>{[0, 1, 2].map((i) => { const x = interpolate(f, [t0 + i * 4, t0 + i * 4 + 14], [1700, 1060], Easing.out); return <g key={i} transform={`translate(${x - 1060} 0)`}><Checkbox x={1060} y={430 + i * 160} k={0.9} /></g>; })}</g>;
      }
      return null;
    },
  });
  return <C s={s} />;
};
const Exhausted: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b43 = s.id === 's06b43';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}><FranceMap x={330} y={60} s={0.86} fill="#B8B4A8" /></Layer>
      </CameraRig>
      {!b43 && ['exhausted,', 'broke,', 'ideology.'].map((w, i) => { const k = springPop(f, wordAt(s, w)); return k > 0 ? <div key={w} style={{ position: 'absolute', left: [500, 1300, 900][i], top: [300, 380, 640][i], transform: `translate(-50%,-50%) scale(${k}) rotate(${[-6, 5, -3][i]}deg)`, fontFamily: 'TagBold', fontSize: 52, color: '#5A5A64', background: 'rgba(255,255,255,0.9)', border: '6px solid #5A5A64', padding: '4px 20px', borderRadius: 10 }}>{['EXHAUSTED', 'BROKE', 'SICK OF IDEOLOGY'][i]}</div> : null; })}
      {b43 && <DropHtml at={wordAt(s, 'order.') - 4} left={960} top={430} h={400}><div style={{ fontFamily: 'TagBold', fontSize: 110, color: '#2E4A9A', background: '#F4F7FA', border: '9px solid #2E4A9A', padding: '6px 40px', borderRadius: 14 }}>ORDER</div></DropHtml>}
    </>
  );
};
const BICORNE = { outfit: { top: '#2E4A9A', bottom: '#F4F7FA', trim: GOLD, belt: '#F4F7FA' }, hat: 'bicorne', hatColor: '#1E1E28', hair: '#3A2416' };
const Corsica: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b45 = s.id === 's06b45';
  const glow = 0.5 + 0.5 * Math.sin(f / 6);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.06, focus: [1000, 600] }}>
        <InsertBg />
        <Layer depth={1}>
          <FranceMap x={420} y={10} s={0.7} corsica={false} />
          <g transform="translate(420 10) scale(0.7)"><path d={CORSICA_PATH} fill="#FFD84A" stroke={OL} strokeWidth={5} opacity={0.75 + 0.25 * glow} /></g>
          {b45 && <g filter="url(#sil)"><Chibi x={1460} y={880} s={1.3} {...BICORNE} pose="cross" expr="determined" talking={[]} seed="nap" /></g>}
        </Layer>
      </CameraRig>
      {!b45 && <Label text="Corsica · French from 1768" x={1300} y={640} at={wordAt(s, 'island')} size={50} color="#FFD84A" />}
      {b45 && <Label text="born 1769" x={1460} y={330} at={wordAt(s, 'born')} size={50} color="#FFD84A" />}
    </>
  );
};

export const SHOTS_05: ShotMap = {
  robespierre_host: RobespierreHost, speech_1791: Speech1791, committee: Committee, suspects: Suspects, tribunal: Tribunal,
  grim: Grim, who_died: WhoDied, equal_scale: EqualScale, dr_guillotin: DrGuillotin, thermidor: Thermidor, turn_on: TurnOn,
  arrest: Arrest, dawn: Dawn, machine_of_fear: MachineOfFear, sketch_calendar: SketchCalendar, boxes_tease: BoxesTease,
  exhausted: Exhausted, corsica: Corsica,
};
