/**
 * Act 3 — "The Tennis Court, the Prison and the Diary".
 */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, spring, springPop, gravityDrop, projectile, random, onTwos } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { Host } from '@engine/characters/Host';
import { GreyStage, InsertBg } from '@engine/scenes/Backgrounds';
import { OL, Cloud } from '@engine/scenes/Parts';
import { FranceMap, CITIES, cityXY } from '@engine/scenes/France';
import { Versailles, Bastille, RoyalRoom, Desk, DiaryPage, ParisStreet, FrWindow, SmallCrown } from '@engine/scenes/FranceScenes';
import { hostShot, wordAt, Drop, PopProp, DropHtml, type ShotMap, type SP } from '@engine/kit';
import type { Shot } from '@engine/types';
import { GOLD, PEOPLE, MONEY, STATE, LOUIS16, NOBLE, PEASANT } from './Shots01';

const CLERGY = { outfit: { top: '#1E1E28', robe: true, trim: '#F4F7FA' }, hat: 'skullcap', hatColor: '#C0392B' };
const DEPUTY = (c = '#1E1E28') => ({ outfit: { top: c, bottom: '#1E1E28', belt: '#F4F7FA' }, hat: 'hair', hair: '#3A2416' });
const GUARD = { outfit: { top: '#2E4A9A', bottom: '#F4F7FA', sash: '#F4F7FA' }, hat: 'tricorn', item: 'musket' };
const Stamp: React.FC<{ at: number; left: number; top: number; text: string; color?: string; rot?: number; size?: number }> = ({ at, left, top, text, color = '#C0392B', rot = -8, size = 56 }) => (
  <DropHtml at={at} left={left} top={top} h={380}><div style={{ fontFamily: 'TagBold', fontSize: size, color, border: `7px solid ${color}`, padding: '4px 22px', borderRadius: 10, transform: `rotate(${rot}deg)`, background: 'rgba(255,255,255,0.88)', whiteSpace: 'nowrap' }}>{text}</div></DropHtml>
);

/** The Estates-General hall at Versailles: a long gilded room, three blocks of deputies. */
const Hall: React.FC<{ dim?: boolean }> = ({ dim }) => (
  <>
    <Layer depth={0}>
      <rect x={-200} y={-200} width={2400} height={1500} fill={dim ? '#5A4A3A' : '#C9A87A'} />
      {[...Array(9)].map((_, i) => <g key={i}><rect x={-60 + i * 250} y={80} width={60} height={620} fill="#E8D6B0" stroke={OL} strokeWidth={4} /><rect x={-70 + i * 250} y={70} width={80} height={24} fill={GOLD} stroke={OL} strokeWidth={3} /></g>)}
      <rect x={-200} y={40} width={2400} height={40} fill={GOLD} stroke={OL} strokeWidth={4} />
      <path d="M760 140 Q960 60 1160 140 V340 H760 Z" fill="#2E4A9A" stroke={OL} strokeWidth={5} />
      <SmallCrown x={960} y={150} s={1.2} />
    </Layer>
    <Layer depth={1}><rect x={-200} y={760} width={2400} height={600} fill="#7A5A3A" stroke={OL} strokeWidth={4} /></Layer>
  </>
);
const Seats: React.FC<{ x: number; n: number; cols: number; color: string; at: number; label: string; count?: number }> = ({ x, n, cols, color, at, label, count }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {[...Array(n)].map((_, i) => { const k = springPop(f, at + (i % cols) * 0.5 + Math.floor(i / cols)); if (k <= 0) return null; return <g key={i} transform={`translate(${x + (i % cols) * 44} ${430 + Math.floor(i / cols) * 46}) scale(${k})`}><circle r={17} fill={color} stroke={OL} strokeWidth={3} /><circle cy={-6} r={8} fill="#F3D2B0" stroke={OL} strokeWidth={2} /></g>; })}
      <text x={x + (cols - 1) * 22} y={400} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#fff" stroke={OL} strokeWidth={5} style={{ paintOrder: 'stroke' }}>{label}</text>
      {count != null && springPop(f, at + 10) > 0 && <text x={x + (cols - 1) * 22} y={760} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#FFD84A" stroke={OL} strokeWidth={5} style={{ paintOrder: 'stroke' }}>~{count}</text>}
    </g>
  );
};
const EgOpen: React.FC<SP> = ({ s }) => {
  const C = hostShot(() => [{ at: 0, arm: 'present', expr: 'smile' }], { props: () => <PopProp at={6} x={1040} y={680}><g><rect x={-180} y={-120} width={360} height={240} fill="#C9A87A" stroke={OL} strokeWidth={8} /><rect x={-180} y={-120} width={360} height={30} fill={GOLD} stroke={OL} strokeWidth={5} />{[0, 1, 2].map((i) => <rect key={i} x={-150 + i * 105} y={-40} width={90} height={110} fill={[GOLD, '#B88A2E', PEOPLE][i]} stroke={OL} strokeWidth={5} />)}</g></PopProp> });
  return <><C s={s} /><Label text="5 May 1789" x={1040} y={500} at={wordAt(s, 'May')} size={60} color="#B3261E" /></>;
};
const EgHall: React.FC<SP> = ({ s }) => {
  const ad = s.id === 's04b03';
  const t = ad ? wordAt(s, '600,') : 4;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Hall />
        <Layer depth={1}>
          <Seats x={180} n={ad ? 21 : 12} cols={7} color="#1E1E28" at={ad ? wordAt(s, 'clergy') : 4} label="CLERGY" count={ad ? 300 : undefined} />
          <Seats x={720} n={ad ? 21 : 12} cols={7} color="#6A4A8A" at={ad ? wordAt(s, 'nobility.') : 6} label="NOBILITY" count={ad ? 300 : undefined} />
          <Seats x={1240} n={ad ? 42 : 12} cols={14} color={PEOPLE} at={ad ? t : 8} label="THIRD ESTATE" count={ad ? 600 : undefined} />
        </Layer>
      </CameraRig>
      {ad && <Label text="double the deputies… but" x={960} y={160} at={wordAt(s, 'generous.')} size={56} color="#fff" />}
    </>
  );
};
/** Sketch: 'One estate, one vote'. A (right) = commoner, B (left) = noble; three ballot boxes, one vote each. */
const SketchVote: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.0 }}>
      <Hall dim />
      <Layer depth={1}>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${760 + i * 180} 760)`}>
            <rect x={-60} y={-110} width={120} height={110} fill="#F4ECD8" stroke={OL} strokeWidth={5} />
            <rect x={-30} y={-116} width={60} height={10} fill={OL} />
            <text y={-40} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill={[GOLD, '#6A4A8A', PEOPLE][i]}>1 VOTE</text>
            <text y={36} textAnchor="middle" fontFamily="Tag" fontSize={24} fill="#fff">{['clergy', 'nobles', '98%'][i]}</text>
          </g>
        ))}
        <Chibi x={420} y={900} s={1.4} {...NOBLE('#6A4A8A')} pose={s.speaker === 'B' ? 'present' : 'cross'} expr={s.speaker === 'B' ? 'happy' : 'normal'} talking={s.speaker === 'B' ? [[6, s.talkEnd ?? 60]] : []} seed="skn" />
        <Chibi x={1500} y={900} s={1.4} {...PEASANT()} hat="cap" hatColor="#3A3A3A" pose={s.speaker === 'A' ? 'point' : 'shrug'} expr={s.speaker === 'A' ? 'determined' : 'angry'} talking={s.speaker === 'A' ? [[6, s.talkEnd ?? 60]] : []} seed="skc" flip />
      </Layer>
    </CameraRig>
  );
};
const NationalAssembly: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = s.id === 's04b17' ? wordAt(s, 'National') : 10;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05 }}>
        <Hall />
        <Layer depth={1}>{[...Array(9)].map((_, i) => <Chibi key={i} x={180 + i * 200} y={900} s={0.95} {...DEPUTY()} pose={f > at + i ? 'raise' : 'idle'} expr="determined" talking={[]} seed={'dp' + i} />)}</Layer>
      </CameraRig>
      {s.id === 's04b17' && <DropHtml at={at} left={960} top={300} h={400}><div style={{ background: '#F4F7FA', border: '6px solid #1A1410', padding: '10px 30px', fontFamily: 'TagBold', fontSize: 64, color: PEOPLE }}>ASSEMBLÉE NATIONALE</div></DropHtml>}
      {s.id === 's04b17' && <Label text="17 June 1789" x={960} y={140} at={wordAt(s, 'June')} size={50} color="#fff" />}
    </>
  );
};
const HallLocked: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const chain = interpolate(f, [wordAt(s, 'locked'), wordAt(s, 'locked') + 10], [0, 1]);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <Versailles gate={false} />
      <Layer depth={1.1}>
        <rect x={810} y={520} width={300} height={360} fill="#5A3A22" stroke={OL} strokeWidth={6} />
        <path d="M810 700 L1110 700" stroke="#8A8A8A" strokeWidth={16} strokeDasharray="20 10" strokeDashoffset={0} opacity={chain} />
        <path d="M820 560 L1100 860 M1100 560 L820 860" stroke="#8A8A8A" strokeWidth={14} strokeDasharray="22 10" opacity={chain} />
        <g opacity={chain}><rect x={925} y={680} width={70} height={60} rx={8} fill={GOLD} stroke={OL} strokeWidth={4} /></g>
        {[0, 1].map((i) => <Chibi key={i} x={660 + i * 600} y={920} s={1.15} {...GUARD} pose="hold" expr="determined" talking={[]} seed={'gd' + i} flip={i === 1} />)}
      </Layer>
    </CameraRig>
  );
};
/** The Tennis Court Oath: a long indoor court, a sea of raised hands, one man reading from a table. */
const TennisOath: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s04b19', 's04b20', 's04b21', 's04b22', 's04b23'].indexOf(s.id);
  const pull = idx >= 3 ? interpolate(f, [0, 40], [1.15, 1.0], Easing.inOut) : 1.08;
  return (
    <>
      <CameraRig move={{ zoomFrom: pull, zoomTo: pull * 0.98, focus: [960, 560] }}>
        <Layer depth={0}>
          <rect x={-200} y={-200} width={2400} height={1500} fill="#D9C9A8" />
          {[...Array(7)].map((_, i) => <g key={i}><rect x={40 + i * 280} y={60} width={160} height={240} fill="#F4F7FA" stroke={OL} strokeWidth={5} /><path d={`M${120 + i * 280} 60 V300 M${40 + i * 280} 180 H${200 + i * 280}`} stroke={OL} strokeWidth={3} /></g>)}
          <rect x={-200} y={320} width={2400} height={40} fill="#5A4030" />
        </Layer>
        <Layer depth={0.6}>
          {[...Array(13)].map((_, i) => <Chibi key={'b' + i} x={-20 + i * 160} y={760} s={0.72} {...DEPUTY(['#1E1E28', '#3A3A48', '#2A2A30'][i % 3])} pose="raise" expr="determined" talking={[]} seed={'tb' + i} delay={i % 4} />)}
        </Layer>
        <Layer depth={0.8}>
          {[...Array(11)].map((_, i) => i === 5 ? null : <Chibi key={'f' + i} x={60 + i * 180} y={930} s={0.9} {...DEPUTY(['#2A2A30', '#1E1E28', '#3A3A48'][i % 3])} pose="raise" expr="determined" talking={[]} seed={'tf' + i} delay={(i + 2) % 4} />)}
        </Layer>
        <Layer depth={1}>
          <rect x={800} y={640} width={320} height={40} fill="#7A4E2B" stroke={OL} strokeWidth={5} /><rect x={830} y={680} width={20} height={240} fill="#5A3A22" /><rect x={1070} y={680} width={20} height={240} fill="#5A3A22" />
          <Chibi x={960} y={650} s={1.1} {...DEPUTY('#1E1E28')} item="scroll" pose="raise" expr="determined" talking={[]} seed="bailly" />
          {idx === 2 && <PopProp at={wordAt(s, 'rulebook')} x={1450} y={460}><g><rect x={-120} y={-150} width={240} height={300} fill="#2E4A9A" stroke={OL} strokeWidth={6} /><text y={-40} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill={GOLD}>CONSTITUTION</text><text y={20} textAnchor="middle" fontFamily="Hand" fontSize={36} fill="#fff">the rulebook</text></g></PopProp>}
        </Layer>
      </CameraRig>
      {idx === 3 && <Label text="The Tennis Court Oath · 20 June 1789" x={960} y={140} at={wordAt(s, 'Tennis')} size={54} color="#1A1410" />}
    </>
  );
};
const Necker: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const fired = s.id === 's04b25' ? wordAt(s, 'Necker,') : 99999;
  const march = interpolate(f, [0, d], [-200, 500]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, shakes: s.id === 's04b26' ? [{ at: wordAt(s, 'exploded.'), amp: 12, len: 10 }] : [] }}>
        {s.id === 's04b26' ? <ParisStreet /> : <InsertBg />}
        <Layer depth={1}>
          {s.id === 's04b24' && <><FranceMap x={330} y={60} s={0.86} pins={[{ city: 'Paris', at: 6, color: PEOPLE }]} />{[...Array(5)].map((_, i) => { const [px, py] = CITIES.Paris; const a = interpolate(f, [8 + i * 4, d], [0, 1], Easing.out); return <g key={i} transform={`translate(${330 + 0.86 * (px + (i - 2) * 120 + 200 * (1 - a))} ${60 + 0.86 * (py + 160 * (1 - a) - 40 + i * 20)})`}><rect x={-14} y={-14} width={28} height={28} fill={STATE} stroke={OL} strokeWidth={3} /></g>; })}</>}
          {s.id === 's04b25' && <g transform="translate(960 480)"><rect x={-170} y={-220} width={340} height={420} fill="#7A4E2B" stroke={OL} strokeWidth={8} /><rect x={-145} y={-195} width={290} height={370} fill="#C9D6E3" /><g transform="translate(0 160) scale(0.95)"><Chibi x={0} y={0} s={1.1} outfit={{ top: '#3A3A3A', bottom: '#F4F7FA' }} hat="hairlong" hatColor="#E8E2D0" pose="idle" expr={f > fired ? 'sad' : 'happy'} talking={[]} seed="necker" /></g><text y={250} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff">JACQUES NECKER</text></g>}
          {s.id === 's04b26' && [...Array(10)].map((_, i) => <Chibi key={i} x={march + i * 150} y={920 + (i % 2) * 20} s={0.95} {...PEASANT(['#C0392B', '#A83A2A', '#B85A30'][i % 3])} hat={i % 3 ? 'cap' : 'none'} hatColor="#3A3A3A" legs="walk" pose={i % 2 ? 'raise' : 'fist'} expr="angry" talking={[]} seed={'px' + i} delay={i * 2} />)}
        </Layer>
      </CameraRig>
      {s.id === 's04b25' && <Stamp at={fired} left={1180} top={520} text="SACKED · 11 JULY" />}
    </>
  );
};
const BastilleDay: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.06, zoomTo: 1.0, focus: [960, 520] }}>
      <Bastille smoke />
      <Layer depth={1}>{[...Array(12)].map((_, i) => <g key={i} filter="url(#sil)"><Chibi x={150 + i * 140} y={900 + (i % 3) * 16} s={0.7} {...PEASANT()} pose={i % 2 ? 'raise' : 'idle'} expr="determined" talking={[]} seed={'bd' + i} /></g>)}</Layer>
    </CameraRig>
    <Label text="The Bastille · 14 July 1789" x={960} y={140} at={6} size={54} color="#1A1410" />
  </>
);
/** Seven prisoners, popped out one by one; a counter ticks to 7. */
const Seven: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s04b29', 's04b30', 's04b31', 's04b32', 's04b33'].indexOf(s.id);
  const kinds = [['FORGER', 'scroll'], ['FORGER', 'scroll'], ['FORGER', 'scroll'], ['FORGER', 'scroll'], ['"INSANE"', 'none'], ['"INSANE"', 'none'], ['NOBLEMAN', 'book']];
  const at = (i: number) => (idx >= 3 ? -99 : idx === 2 ? (i < 4 ? wordAt(s, 'forgers,') + i * 3 : i < 6 ? wordAt(s, 'insane,') + (i - 4) * 3 : wordAt(s, 'nobleman')) : 99999);
  const n = idx >= 2 || (idx === 1 && f >= wordAt(s, 'seven')) ? 7 : 0;
  const pop = idx === 1 ? springPop(f, wordAt(s, 'seven')) : 1;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#5A5560" />{[...Array(8)].map((_, i) => <rect key={i} x={-200} y={-200 + i * 140} width={2400} height={4} fill="#4A4550" />)}</Layer>
        <Layer depth={1}>
          {kinds.map(([lab, item], i) => {
            const k = springPop(f, at(i));
            return <g key={i}>
              <rect x={150 + i * 240} y={420} width={200} height={360} fill="#3A3540" stroke={OL} strokeWidth={5} />
              {[...Array(5)].map((_, b) => <rect key={b} x={160 + i * 240 + b * 40} y={420} width={8} height={360} fill="#8A8A8A" opacity={k > 0.5 ? 0.2 : 1} />)}
              {k > 0 && <g transform={`translate(${250 + i * 240} 780) scale(${k})`}><Chibi x={0} y={0} s={0.85} outfit={{ top: i === 6 ? '#6A4A8A' : '#8A7A6A', bottom: '#5A4A3A' }} hat={i === 6 ? 'hairlong' : 'none'} hatColor="#E8E2D0" hair="#6B5A45" item={item} pose={i >= 4 && i < 6 ? 'bothUp' : 'idle'} expr={i >= 4 && i < 6 ? 'grin' : 'shock'} talking={[]} seed={'pr' + i} /></g>}
              {k > 0 && <text x={250 + i * 240} y={400} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#fff">{lab}</text>}
            </g>;
          })}
        </Layer>
      </CameraRig>
      {n > 0 && <div style={{ position: 'absolute', right: 60, top: 60, transform: `scale(${n ? 0.9 + 0.1 * pop : 1})`, transformOrigin: 'right top', background: 'rgba(26,20,16,0.85)', border: '4px solid #FFD84A', borderRadius: 12, padding: '8px 24px', fontFamily: 'TagBold', fontSize: 52, color: '#FFD84A' }}>PRISONERS FREED: {n}</div>}
    </>
  );
};
const BastilleToll: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05, focus: [960, 500] }}><Bastille silhouette smoke /></CameraRig>
    {s.id === 's04b34' && <Label text="~100 attackers killed" x={960} y={140} at={wordAt(s, 'hundred')} size={62} color="#fff" />}
  </>
);
const KingWrote: React.FC<SP> = () => {
  const f = useCurrentFrame();
  return <CameraRig move={{ zoomFrom: 1.15, zoomTo: 1.0, focus: [900, 480] }}><Layer depth={0}><DiaryPage word="Rien." write={1} /></Layer></CameraRig>;
};
/** Sketch: 'Nothing'. A (right) = aide, B (left) = the king at his desk with the diary. */
const SketchNothing: React.FC<SP> = ({ s }) => (<>
  <CameraRig move={{ zoomFrom: 1, zoomTo: 1.0 }}>
    <RoyalRoom />
    <Layer depth={1}>
      <Chibi x={420} y={860} s={1.3} {...LOUIS16} legs="sit" pose={s.speaker === 'B' ? 'scribble' : 'idle'} expr={s.speaker === 'B' ? 'calm' : 'normal'} talking={s.speaker === 'B' ? [[6, s.talkEnd ?? 60]] : []} seed="kn" />
      <Desk x={620} y={760} s={0.9} />
      <Chibi x={1460} y={900} s={1.3} outfit={{ top: '#2E5A3A', bottom: '#1E1E28', trim: GOLD }} hat="hair" hair="#3A2416" pose={s.speaker === 'A' ? 'point' : 'shrug'} expr={s.speaker === 'A' ? 'shock' : 'sad'} talking={s.speaker === 'A' ? [[6, s.talkEnd ?? 60]] : []} seed="aide" flip />
    </Layer>
  </CameraRig>
  {['s04b39', 's04b40', 's04b41'].includes(s.id) && <div style={{ position: 'absolute', right: 40, top: 40, maxWidth: 620, textAlign: 'right', fontFamily: 'Tag', fontSize: 28, color: '#F4ECD8', background: 'rgba(26,20,16,0.7)', padding: '6px 14px', borderRadius: 8 }}>Exchange as traditionally reported, attributed to the Duc de La Rochefoucauld-Liancourt.</div>}
</>);
const Subscribe: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const C = hostShot(() => [{ at: 0, arm: 'present', expr: 'grin' }], {
    props: (s) => <>
      <PopProp at={wordAt(s, 'subscribe') || 6} x={1080} y={820}><g><rect x={-170} y={-50} width={340} height={100} rx={18} fill="#C0392B" stroke={OL} strokeWidth={6} /><text y={16} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill="#fff">SUBSCRIBE</text></g></PopProp>
      <PopProp at={wordAt(s, 'baguette.') || 8} x={1080} y={640}><g transform="rotate(-20)"><path d="M-230 0 Q-240 -40 -200 -46 L200 -46 Q240 -40 230 0 Q240 40 200 46 L-200 46 Q-240 40 -230 0 Z" fill="#D9A55A" stroke={OL} strokeWidth={6} />{[-140, -60, 20, 100].map((x) => <path key={x} d={`M${x} 20 L${x + 40} -24`} stroke="#A8743E" strokeWidth={8} strokeLinecap="round" />)}</g></PopProp>
    </>,
  });
  return <C s={s} />;
};
const Aug4: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const tear = s.id === 's04b52' ? wordAt(s, 'privileges,') : 99999;
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <Hall />
      <Layer depth={1}>
        {[0, 1, 2].map((i) => <Chibi key={i} x={500 + i * 460} y={900} s={1.2} {...NOBLE(['#6A4A8A', '#2E6B4A', '#8A3A2A'][i])} pose="pull" expr={f > tear ? 'happy' : 'normal'} talking={[]} seed={'tr' + i} />)}
        {[0, 1, 2].map((i) => { const t = f - tear; const k = Math.max(0, t); return <g key={'p' + i}>{[-1, 1].map((sd) => <g key={sd} transform={`translate(${500 + i * 460 + sd * (6 + k * 3)} ${Math.min(780, 400 + 0.6 * k * k)}) rotate(${sd * Math.min(k * 3, 80)})`}><rect x={sd < 0 ? -70 : 0} y={-90} width={70} height={180} fill="#F4ECD8" stroke={OL} strokeWidth={4} /><text x={sd < 0 ? -35 : 35} y={0} textAnchor="middle" fontFamily="TagBold" fontSize={20} fill="#B3261E">{sd < 0 ? 'PRIVI' : 'LEGES'}</text></g>)}</g>; })}
      </Layer>
    </CameraRig>
  );
};
const Declaration: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const unroll = interpolate(f, [4, 40], [0.1, 1], Easing.out);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 480] }}>
        <InsertBg />
        <Layer depth={1}>
          <rect x={560} y={110} width={800} height={720 * unroll} fill="#F4ECD8" stroke={OL} strokeWidth={6} />
          <text x={960} y={190} textAnchor="middle" fontFamily="Hand" fontSize={44} fill="#1A1410">Déclaration des Droits</text>
          <text x={960} y={240} textAnchor="middle" fontFamily="Hand" fontSize={44} fill="#1A1410">de l'Homme et du Citoyen</text>
          {unroll > 0.5 && <text x={960} y={340} textAnchor="middle" fontFamily="Hand" fontSize={36} fill="#5A3A22">"Men are born and remain</text>}
          {unroll > 0.6 && <text x={960} y={390} textAnchor="middle" fontFamily="Hand" fontSize={36} fill="#5A3A22">free and equal in rights."</text>}
          {[...Array(Math.floor(6 * unroll))].map((_, i) => <path key={i} d={`M640 ${470 + i * 50} H${1280 - (i % 3) * 60}`} stroke="#C9BFA6" strokeWidth={4} />)}
          <rect x={540} y={90} width={840} height={36} rx={18} fill="#E0D2B0" stroke={OL} strokeWidth={5} />
        </Layer>
      </CameraRig>
      {s.id === 's04b53' && <Label text="26 August 1789" x={1600} y={200} at={wordAt(s, 'August')} size={48} color="#FFD84A" />}
    </>
  );
};
const NoBread: React.FC<SP> = () => (
  <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
    <ParisStreet />
    <Layer depth={1.1}>
      <rect x={560} y={400} width={800} height={400} fill="#7A4E2B" stroke={OL} strokeWidth={6} />
      <rect x={600} y={360} width={720} height={60} fill="#F4ECD8" stroke={OL} strokeWidth={5} /><text x={960} y={404} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#5A3A22">BOULANGERIE</text>
      {[0, 1, 2].map((r) => <rect key={r} x={600} y={470 + r * 100} width={720} height={14} fill="#5A3A22" />)}
      <g transform="translate(960 640) rotate(-4)"><rect x={-170} y={-40} width={340} height={80} fill="#F4F7FA" stroke={OL} strokeWidth={5} /><text y={16} textAnchor="middle" fontFamily="Hand" fontSize={46} fill="#C0392B">PAS DE PAIN</text></g>
      {[0, 1, 2].map((i) => <Chibi key={i} x={380 + i * 580} y={930} s={1.0} {...PEASANT(['#C0392B', '#8A3A2A', '#B85A30'][i])} pose="shrug" expr="sad" talking={[]} seed={'nb' + i} />)}
    </Layer>
  </CameraRig>
);
/** Map: Paris → Versailles, the march growing along the road in the rain, then the carriage coming back. */
const WomensMarch: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const back = s.id === 's04b59' || s.id === 's04b60';
  const t = back ? interpolate(f, [0, d], [0, 1]) : interpolate(f, [0, d], s.id === 's04b57' ? [0, 0.3] : [0.3, 1]);
  const P = [1400, 380], V = [520, 640];
  const lerp = (a: number[], b: number[], k: number) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const head = back ? lerp(V, P, t) : lerp(P, V, t);
  const crowd = back ? 1 : t;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#8FAE6E" /><path d={`M${P[0]} ${P[1]} Q960 620 ${V[0]} ${V[1]}`} fill="none" stroke="#F4ECD8" strokeWidth={14} strokeDasharray="30 20" /></Layer>
        <Layer depth={1}>
          <g transform={`translate(${P[0]} ${P[1]})`}><circle r={70} fill="#E8DCC0" stroke={OL} strokeWidth={6} /><text y={120} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#1A1410">PARIS</text></g>
          <g transform={`translate(${V[0]} ${V[1]})`}><rect x={-90} y={-60} width={180} height={100} fill="#F0E2C2" stroke={OL} strokeWidth={6} /><text y={100} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#1A1410">VERSAILLES</text></g>
          {[...Array(Math.max(1, Math.round(4 + 18 * crowd)))].map((_, i) => { const k = Math.max(0, (back ? t : t) - i * 0.012); const pos = back ? lerp(V, P, Math.max(0, t - i * 0.012)) : lerp(P, V, k); return <g key={i} transform={`translate(${pos[0] + (random('wx' + i) - 0.5) * 60} ${pos[1] + (random('wy' + i) - 0.5) * 60})`}><circle r={13} fill={PEOPLE} stroke={OL} strokeWidth={3} /><circle cy={-14} r={8} fill="#F3D2B0" stroke={OL} strokeWidth={2} /></g>; })}
          {back && <g transform={`translate(${head[0]} ${head[1] - 50})`}><rect x={-60} y={-40} width={120} height={70} rx={14} fill={GOLD} stroke={OL} strokeWidth={5} /><circle cx={-36} cy={36} r={16} fill="#6B4A2B" stroke={OL} strokeWidth={4} /><circle cx={36} cy={36} r={16} fill="#6B4A2B" stroke={OL} strokeWidth={4} /></g>}
        </Layer>
        <Layer depth={1.2}>{[...Array(60)].map((_, i) => <path key={i} d={`M${(random('rx' + i) * 2200 + f * 4) % 2200 - 100} ${(random('ry' + i) * 1200 + f * 22) % 1200 - 60} l-8 30`} stroke="#C9D6E3" strokeWidth={3} opacity={0.7} />)}</Layer>
      </CameraRig>
      {s.id === 's04b57' && <Label text="5 October 1789" x={960} y={140} at={wordAt(s, 'October')} size={54} color="#fff" />}
      {s.id === 's04b58' && <Label text="~12 miles, in the rain" x={960} y={140} at={wordAt(s, 'twelve')} size={54} color="#fff" />}
    </>
  );
};
const OctoberCal: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const glow = s.id === 's04b65' || s.id === 's04b64' ? springPop(f, s.id === 's04b65' ? 0 : wordAt(s, 'month.')) : 0;
  const C = hostShot(() => [{ at: 0, arm: s.id === 's04b61' ? 'finger' : 'point', expr: 'proud' }], {
    props: () => <PopProp at={4} x={1080} y={600}><g><rect x={-170} y={-200} width={340} height={360} rx={14} fill="#F4F7FA" stroke={OL} strokeWidth={8} /><rect x={-170} y={-200} width={340} height={90} rx={14} fill={PEOPLE} stroke={OL} strokeWidth={8} /><text y={-138} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill="#fff">OCTOBER</text><text y={60} textAnchor="middle" fontFamily="TagBold" fontSize={140} fill="#1A1410">5</text>{glow > 0 && <rect x={-190} y={-220} width={380} height={400} rx={20} fill="none" stroke="#FFD84A" strokeWidth={12 * glow} />}</g></PopProp>,
  });
  return <C s={s} />;
};
const DisguiseTease: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const x = interpolate(f, [0, d], [700, 1150]);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#1C2333" /><circle cx={1500} cy={200} r={70} fill="#F4ECD8" opacity={0.9} />{[...Array(40)].map((_, i) => <circle key={i} cx={random('st' + i) * 1920} cy={random('su' + i) * 500} r={1.8} fill="#fff" opacity={0.7} />)}</Layer>
      <Layer depth={1}>
        {[...Array(7)].map((_, i) => <g key={'h' + i}><rect x={-100 + i * 300} y={440 + (i % 3) * 40} width={240} height={360} fill="#262C3C" stroke={OL} strokeWidth={4} /><path d={`M${-120 + i * 300} ${440 + (i % 3) * 40} L${20 + i * 300} ${340 + (i % 3) * 40} L${160 + i * 300} ${440 + (i % 3) * 40} Z`} fill="#1E2230" stroke={OL} strokeWidth={4} />{i % 2 === 0 && <rect x={-40 + i * 300} y={520 + (i % 3) * 40} width={50} height={60} fill="#E8C66A" opacity={0.8} />}</g>)}
        <rect x={-200} y={780} width={2400} height={500} fill="#2E2E38" stroke={OL} strokeWidth={4} />
        {s.id !== 's04b66' && <g transform={`translate(${interpolate(f, [0, d], [380, 560])} 0)`}><rect x={-40} y={560} width={400} height={200} rx={30} fill="#3A4A6A" stroke={OL} strokeWidth={6} /><rect x={20} y={590} width={110} height={90} fill="#E8C66A" stroke={OL} strokeWidth={4} /><rect x={180} y={590} width={110} height={90} fill="#E8C66A" stroke={OL} strokeWidth={4} />{[20, 300].map((wx) => <g key={wx} transform={`translate(${wx} 780) rotate(${f * 6})`}><circle r={55} fill="none" stroke="#7A4E2B" strokeWidth={10} /><path d="M-55 0 H55 M0 -55 V55" stroke="#7A4E2B" strokeWidth={6} /></g>)}</g>}
        {s.id !== 's04b66' && <Chibi x={x} y={900} s={1.3} outfit={{ top: '#5A4A3A', bottom: '#3A2A22' }} hat="tophat" hatColor="#3A2A22" legs="walk" pose="idle" expr="worried" talking={[]} seed="disg" />}
        {s.id === 's04b66' && <><Chibi x={700} y={900} s={1.2} {...LOUIS16} pose="shrug" expr="normal" talking={[]} seed="sh1" /><Chibi x={1220} y={900} s={1.2} {...PEASANT()} hat="cap" hatColor="#C0392B" pose="cross" expr="normal" talking={[]} seed="sh2" flip /></>}
      </Layer>
    </CameraRig>
  );
};

export const SHOTS_03: ShotMap = {
  eg_open: EgOpen, eg_hall: EgHall, sketch_vote: SketchVote, national_assembly: NationalAssembly, hall_locked: HallLocked,
  tennis_oath: TennisOath, necker: Necker, bastille_day: BastilleDay, seven: Seven, bastille_toll: BastilleToll,
  king_wrote: KingWrote, sketch_nothing: SketchNothing, subscribe: Subscribe, aug4: Aug4, declaration: Declaration,
  no_bread: NoBread, womens_march: WomensMarch, october_cal: OctoberCal, disguise_tease: DisguiseTease,
};
