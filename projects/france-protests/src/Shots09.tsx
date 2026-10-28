/**
 * Act 9 — "The Long Simmer, 2005 to 2025". Restraint for 2005 and Nahel: places, names and dates only.
 * Real politicians appear only as labelled silhouettes.
 */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, spring, springPop, gravityDrop, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { FranceMap } from '@engine/scenes/France';
import { ParisStreet, Desk } from '@engine/scenes/FranceScenes';
import { hostShot, wordAt, PopProp, DropHtml, type ShotMap, type SP } from '@engine/kit';
import { GOLD, PEOPLE, MONEY, STATE, PEASANT } from './Shots01';
import { Calendar, Bars, mapXY, TRICOLORE } from './Shots04';
import { PM_FIG } from './Shots07';

export const MODERN = (c = '#3A5A8A', i = 0) => ({ outfit: { top: c, bottom: ['#2A3A5A', '#3A3A48', '#5A4A3A'][i % 3] }, hat: ['hair', 'none', 'cap', 'bun'][i % 4], hatColor: '#3A3A48', hair: ['#3A2416', '#1A1410', '#C9A66B', '#7A3A1A'][i % 4] });
export const HIVIS = { outfit: { top: '#E8E83A', bottom: '#3A3A5A', sash: '#C9C9C9' }, hat: 'none', hair: '#3A2416' };
export const Stamp: React.FC<{ at: number; left: number; top: number; text: string; color?: string; rot?: number; size?: number }> = ({ at, left, top, text, color = '#B3261E', rot = -6, size = 58 }) => (
  <DropHtml at={at} left={left} top={top} h={360}><div style={{ fontFamily: 'TagBold', fontSize: size, color, border: `7px solid ${color}`, padding: '4px 22px', borderRadius: 10, transform: `rotate(${rot}deg)`, background: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap' }}>{text}</div></DropHtml>
);
export const Counter: React.FC<{ label: string; value: string; right?: number; left?: number; top?: number; color?: string; k?: number }> = ({ label, value, right, left, top = 60, color = '#FFD84A', k = 1 }) => (
  <div style={{ position: 'absolute', right, left, top, transform: `scale(${k})`, transformOrigin: right != null ? 'right top' : 'left top', background: 'rgba(26,20,16,0.85)', border: `4px solid ${color}`, borderRadius: 12, padding: '8px 24px', fontFamily: 'TagBold', fontSize: 50, color, whiteSpace: 'nowrap' }}>{label} {value}</div>
);
/** An on-screen "UPDATE" card for facts that moved after the voiceover was recorded. */
export const Update: React.FC<{ at: number; text: string; source: string; top?: number }> = ({ at, text, source, top = 40 }) => {
  const f = useCurrentFrame();
  const k = springPop(f, at);
  return k > 0 ? <div style={{ position: 'absolute', right: 40, top, maxWidth: 700, transform: `scale(${k})`, transformOrigin: 'right top', background: '#F4ECD8', border: '5px solid #1A1410', borderRadius: 12, padding: '10px 18px', boxShadow: '6px 8px 0 rgba(0,0,0,0.3)' }}>
    <div style={{ fontFamily: 'TagBold', fontSize: 24, color: '#B3261E', letterSpacing: 2 }}>UPDATE</div>
    <div style={{ fontFamily: 'TagBold', fontSize: 32, color: '#1A1410', lineHeight: 1.2 }}>{text}</div>
    <div style={{ fontFamily: 'Tag', fontSize: 20, color: '#5A4A3A', marginTop: 4 }}>{source}</div>
  </div> : null;
};
/** Suburban tower blocks (banlieue). */
export const Banlieue: React.FC<{ night?: boolean }> = ({ night }) => (
  <>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={night ? '#1C2333' : '#B8C8D4'} />{night && [...Array(40)].map((_, i) => <circle key={i} cx={random('bs' + i) * 1920} cy={random('bt' + i) * 300} r={1.6} fill="#fff" opacity={0.6} />)}</Layer>
    <Layer depth={0.6}>{[0, 1, 2, 3, 4].map((i) => { const h = 380 + (i % 2) * 160; return <g key={i}><rect x={-40 + i * 420} y={760 - h} width={300} height={h} fill={night ? '#2E3448' : '#D4CCC0'} stroke={OL} strokeWidth={5} />{[...Array(Math.floor(h / 70) * 4)].map((_, k) => <rect key={k} x={-20 + i * 420 + (k % 4) * 72} y={780 - h + Math.floor(k / 4) * 70} width={44} height={40} fill={night ? (random('w' + i + k) > 0.6 ? '#E8C66A' : '#3A4058') : '#8A9AA8'} stroke={OL} strokeWidth={2} />)}</g>; })}</Layer>
    <Layer depth={1}><rect x={-200} y={760} width={2400} height={600} fill={night ? '#2A2E3A' : '#9A9A90'} stroke={OL} strokeWidth={4} /></Layer>
  </>
);
/** The timeline strip of triggers (2005 → 2025). `upto` = how many icons are visible. */
export const TriggerStrip: React.FC<{ y?: number; upto?: number; at?: number[]; hi?: number; dorm?: boolean }> = ({ y = 420, upto = 5, at = [], hi = -1, dorm }) => {
  const f = useCurrentFrame();
  const items = [
    dorm ? { yr: '1968', lab: 'DORM RULE', c: '#7A4E2B' } : { yr: '2005', lab: 'SUBSTATION', c: '#8A8A94' },
    { yr: '2018', lab: 'FUEL TAX', c: '#E8E83A' },
    { yr: '2023', lab: 'PENSION · 49.3', c: '#2E4A9A' },
    { yr: '2023', lab: 'POLICE STOP', c: '#4A7AE8' },
    { yr: '2024–25', lab: 'BUDGET', c: MONEY },
  ];
  return (
    <g>
      <path d={`M160 ${y} H1760`} stroke="#F4ECD8" strokeWidth={6} />
      {items.slice(0, upto).map((it, i) => { const k = springPop(f, at[i] ?? -99); return k > 0 ? <g key={i} transform={`translate(${260 + i * 350} ${y}) scale(${k * (hi === i ? 1.15 : 1)})`}>
        <circle r={70} fill={it.c} stroke={OL} strokeWidth={6} />
        {i === 0 && !dorm && <path d="M-26 -36 L6 -4 L-10 -4 L22 36" stroke={OL} strokeWidth={8} fill="none" strokeLinejoin="round" />}{i === 0 && dorm && <g><rect x={-26} y={-40} width={52} height={80} fill="#5A3A22" stroke={OL} strokeWidth={4} /><circle cx={16} cy={4} r={5} fill={GOLD} /></g>}
        {i === 1 && <path d="M-34 -30 L-14 -40 L14 -40 L34 -30 L30 36 L-30 36 Z M-10 -40 L0 36 M10 -40 L0 36" fill="#F4F7FA" stroke={OL} strokeWidth={4} />}
        {i === 2 && <g><rect x={-34} y={-20} width={68} height={50} fill="#6A4A2A" stroke={OL} strokeWidth={4} /><rect x={-20} y={-26} width={40} height={8} fill={OL} /><path d="M-30 -40 L30 30" stroke="#B3261E" strokeWidth={8} /></g>}
        {i === 3 && <g><rect x={-24} y={-10} width={48} height={40} rx={6} fill="#2A2E3A" stroke={OL} strokeWidth={4} /><path d="M-18 -10 Q0 -44 18 -10 Z" fill="#7AB8FF" stroke={OL} strokeWidth={4} /></g>}
        {i === 4 && <g><rect x={-30} y={-38} width={60} height={76} fill="#F4ECD8" stroke={OL} strokeWidth={4} /><text y={12} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill={MONEY}>€</text></g>}
        <text y={-96} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill="#fff">{it.yr}</text>
        <text y={120} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill="#F4ECD8">{it.lab}</text>
      </g> : null; })}
    </g>
  );
};

const SmallFires = hostShot((s) => [{ at: 0, arm: s.id === 's10b01' ? 'finger' : 'present', expr: 'smile' }], {
  props: (s) => {
    const f = useCurrentFrame();
    if (s.id === 's10b01') return <PopProp at={wordAt(s, 'explosion.') - 4} x={1060} y={600}><g><circle r={110} fill="#E8742A" stroke={OL} strokeWidth={6} /><path d="M-80 -80 L80 80 M80 -80 L-80 80" stroke="#B3261E" strokeWidth={16} /></g></PopProp>;
    return <g>{[0, 1, 2, 3, 4].map((i) => { const k = springPop(f, wordAt(s, 'smaller') + i * 6); return k > 0 ? <g key={i} transform={`translate(${880 + (i % 3) * 120} ${480 + Math.floor(i / 3) * 160}) scale(${k * 0.9})`}><path d="M0 -50 Q28 -14 18 14 Q10 36 0 38 Q-10 36 -18 14 Q-28 -14 0 -50 Z" fill={['#E8742A', '#E8E83A', '#2E4A9A', '#7AB8FF', MONEY][i]} stroke={OL} strokeWidth={4} /></g> : null; })}</g>;
  },
});
const Clichy: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b04 = s.id === 's10b04';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Banlieue night />
        <Layer depth={1.05}>
          <g transform="translate(1380 780)"><rect x={-160} y={-200} width={320} height={200} fill="#5A5A64" stroke={OL} strokeWidth={6} /><path d="M-200 -240 H200" stroke="#8A8A94" strokeWidth={6} />{[...Array(11)].map((_, i) => <rect key={i} x={-200 + i * 40} y={-240} width={6} height={240} fill="#8A8A94" />)}<g transform="translate(0 -110)"><path d="M0 -40 L44 36 L-44 36 Z" fill="#E8E83A" stroke={OL} strokeWidth={5} /><path d="M-4 -14 L8 2 L-4 2 L8 22" stroke={OL} strokeWidth={5} fill="none" /></g></g>
        </Layer>
      </CameraRig>
      {!b04 && <Label text="October 2005" x={960} y={140} at={wordAt(s, 'October')} size={54} color="#B8B8C0" />}
      {!b04 && <div style={{ position: 'absolute', left: 100, top: 300, fontFamily: 'TagBold', fontSize: 50, color: '#F4ECD8', lineHeight: 1.5, background: 'rgba(16,20,30,0.85)', padding: '14px 30px', borderRadius: 12, opacity: springPop(f, wordAt(s, 'Zyed')) }}>Zyed Benna, 17<br />Bouna Traoré, 15</div>}
      {b04 && <Label text="Clichy-sous-Bois" x={960} y={140} at={wordAt(s, 'Clichy-sous-Bois')} size={54} color="#B8B8C0" />}
    </>
  );
};
const Riots2005: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b06 = s.id === 's10b06';
  const cities = ['Paris', 'Lille', 'Rennes', 'Nantes', 'Bordeaux', 'Toulouse', 'Marseille', 'Lyon', 'Strasbourg', 'Orléans', 'Le Havre', 'Nice'];
  const n = b06 ? Math.round(9000 * interpolate(f, [wordAt(s, '9,000') - 10, wordAt(s, '9,000') + 30], [0, 1], Easing.out)) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg glow={false} />
        <Layer depth={1}>
          <FranceMap x={330} y={60} s={0.86} />
          {cities.map((c, i) => { const [x, y] = mapXY(c); const k = springPop(f, (b06 ? -99 : 6) + i * 5); return k > 0 ? <circle key={c} cx={x} cy={y} r={14 * k + Math.sin(f / 5 + i) * 2} fill="#E8742A" stroke={OL} strokeWidth={3} opacity={0.9} /> : null; })}
        </Layer>
      </CameraRig>
      {!b06 && <Label text="three weeks" x={1500} y={260} at={wordAt(s, 'three')} size={56} color="#FFD84A" />}
      {b06 && <Counter label="VEHICLES BURNED:" value={`~${n.toLocaleString('en-US')}`} right={60} top={60} />}
      {b06 && <Stamp at={wordAt(s, 'emergency.') - 6} left={1450} top={460} text="STATE OF EMERGENCY" size={48} />}
    </>
  );
};
const YellowVests: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s10b07', 's10b08', 's10b09', 's10b10', 's10b11'].indexOf(s.id);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        {idx === 2 ? <ParisStreet /> : <InsertBg />}
        <Layer depth={1.1}>
          {idx === 0 && <g transform={`translate(960 480) scale(${springPop(f, wordAt(s, 'Yellow'))})`}><path d="M-170 -200 L-80 -240 L-40 -150 L40 -150 L80 -240 L170 -200 L150 220 L-150 220 Z" fill="#E8E83A" stroke={OL} strokeWidth={8} /><path d="M-150 60 H150 M-150 120 H150" stroke="#C9C9C9" strokeWidth={22} /><path d="M-40 -150 L0 220 M40 -150 L0 220" stroke={OL} strokeWidth={4} /></g>}
          {idx === 1 && <g><g transform="translate(700 520)"><rect x={-110} y={-240} width={220} height={360} rx={18} fill="#C0392B" stroke={OL} strokeWidth={7} /><rect x={-80} y={-200} width={160} height={90} fill="#1E1E28" /><text y={-140} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill="#7AFF7A">{(1.45 + 0.1 * Math.min(1, Math.max(0, (f - wordAt(s, 'rise')) / 20))).toFixed(2)}</text><path d="M110 -60 Q180 -60 180 40 V160" stroke={OL} strokeWidth={10} fill="none" /></g><path d="M1000 600 L1300 360" stroke="#B3261E" strokeWidth={18} strokeLinecap="round" opacity={springPop(f, wordAt(s, 'rise'))} /><path d="M1260 350 L1310 352 L1300 400" stroke="#B3261E" strokeWidth={18} fill="none" strokeLinecap="round" opacity={springPop(f, wordAt(s, 'rise'))} /><text x={1240} y={660} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill="#fff" opacity={springPop(f, wordAt(s, 'tax.'))}>FUEL TAX ↑</text></g>}
          {idx === 2 && [...Array(9)].map((_, i) => <Chibi key={i} x={140 + i * 210} y={930} s={0.95} {...HIVIS} hair={['#3A2416', '#1A1410', '#C9A66B'][i % 3]} pose={i % 2 ? 'raise' : 'fist'} expr="determined" talking={[]} seed={'yv' + i} />)}
          {idx === 3 && <g><g transform="translate(600 480)"><rect x={-180} y={-120} width={360} height={240} fill="#F4ECD8" stroke={OL} strokeWidth={6} /><text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill="#1A1410">FUEL TAX RISE</text></g><Bars x={1180} y={760} max={100} h={500} w={240} bars={[{ label: 'ANGER', v: 92, c: '#E8742A', at: 4, text: '' }]} /></g>}
          {idx === 4 && <g transform={`translate(960 520) scale(${springPop(f, wordAt(s, 'cost'))})`}><path d="M-200 -80 L200 -80 L160 160 L-160 160 Z" fill="#C9A66B" stroke={OL} strokeWidth={8} /><path d="M-140 -80 Q0 -260 140 -80" stroke={OL} strokeWidth={10} fill="none" />{[...Array(5)].map((_, i) => <circle key={i} cx={-120 + i * 60} cy={-110} r={34} fill={['#C0392B', '#E8A94A', '#2E6B4A', '#F4ECD8', '#8A3A8A'][i]} stroke={OL} strokeWidth={4} />)}<text y={60} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#1A1410">COST OF LIVING</text></g>}
        </Layer>
      </CameraRig>
      {idx === 0 && <Label text="November 2018 · gilets jaunes" x={960} y={140} at={wordAt(s, 'November')} size={54} color="#FFD84A" />}
      {idx === 2 && <Label text="every Saturday" x={960} y={140} at={wordAt(s, 'Saturday')} size={56} color="#1A1410" />}
      {idx === 3 && <Stamp at={wordAt(s, 'dropped')} left={600} top={480} text="DROPPED" />}
    </>
  );
};
const Pensions: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s10b12', 's10b13', 's10b14', 's10b15'].indexOf(s.id);
  const age = idx === 0 ? Math.round(interpolate(f, [wordAt(s, '62') + 4, wordAt(s, '64') + 4], [62, 64])) : 64;
  const n = idx === 3 ? Math.round(1280000 * interpolate(f, [2, 30], [0, 1], Easing.out)) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        {idx === 3 ? <ParisStreet /> : <InsertBg />}
        <Layer depth={1.1}>
          {idx === 0 && <g transform="translate(960 470)"><rect x={-260} y={-180} width={520} height={360} rx={30} fill="#F4F7FA" stroke={OL} strokeWidth={8} /><text y={-100} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#5A5A64">RETIREMENT AGE</text><text y={110} textAnchor="middle" fontFamily="TagBold" fontSize={200} fill={age > 62 ? '#B3261E' : '#1A1410'}>{age}</text></g>}
          {(idx === 1 || idx === 2) && <g><path d="M300 760 Q960 300 1620 760" fill="#8A7A62" stroke={OL} strokeWidth={6} />{[...Array(30)].map((_, i) => { const a = Math.PI * (0.1 + 0.8 * (i / 29)); return <circle key={i} cx={960 - Math.cos(a) * 560} cy={760 - Math.sin(a) * 340} r={20} fill={['#C0392B', '#E8C23A', '#2E4A9A'][Math.floor(i / 10)]} stroke={OL} strokeWidth={3} />; })}<g transform="translate(960 640)"><rect x={-120} y={-60} width={240} height={110} rx={14} fill="#5A5A64" stroke={OL} strokeWidth={6} /><text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#F4ECD8">VOTE</text><path d="M-110 -60 L110 50" stroke="#B3261E" strokeWidth={12} opacity={springPop(f, idx === 1 ? wordAt(s, 'without') : -99)} /></g></g>}
          {idx === 3 && [...Array(10)].map((_, i) => <Chibi key={i} x={120 + i * 190} y={930} s={0.9} {...MODERN(['#C0392B', '#2E4A9A', '#E8C23A', '#2E6B4A'][i % 4], i)} item={i % 3 === 0 ? 'banner' : undefined} pose={i % 2 ? 'raise' : 'fist'} expr="determined" talking={[]} seed={'pn' + i} />)}
        </Layer>
      </CameraRig>
      {idx === 0 && <Label text="2023" x={960} y={140} at={wordAt(s, '2023')} size={60} color="#FFD84A" />}
      {idx === 2 && <Stamp at={wordAt(s, 'Article')} left={960} top={300} text="ARTICLE 49.3" color="#2E4A9A" size={72} />}
      {idx === 3 && <Counter label="MARCHED (peak day):" value={`~${n.toLocaleString('en-US')}`} right={60} top={60} />}
    </>
  );
};
const Nahel: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b17 = s.id === 's10b17';
  const cities = ['Paris', 'Lille', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Strasbourg', 'Nantes'];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        {b17 ? <InsertBg glow={false} /> : <Banlieue night />}
        <Layer depth={1}>
          {b17 && <><FranceMap x={330} y={60} s={0.86} />{cities.map((c, i) => { const [x, y] = mapXY(c); const k = springPop(f, wordAt(s, 'riots') + i * 4); return k > 0 ? <circle key={c} cx={x} cy={y} r={14 * k} fill="#7AB8FF" stroke={OL} strokeWidth={3} /> : null; })}</>}
        </Layer>
      </CameraRig>
      {!b17 && <div style={{ position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: 'TagBold', fontSize: 70, color: '#F4ECD8', opacity: springPop(f, wordAt(s, 'Nahel,')) }}>Nahel, 17</div>}
      {!b17 && <Label text="June 2023 · Nanterre" x={960} y={140} at={wordAt(s, 'June')} size={54} color="#B8B8C0" />}
    </>
  );
};
const Hemicycle: React.FC<{ at?: number; maj?: boolean }> = ({ at = -99, maj = true }) => {
  const f = useCurrentFrame();
  const blocs = [{ n: 18, c: '#C0392B', lab: 'LEFT' }, { n: 15, c: '#E8C23A', lab: 'CENTRE' }, { n: 15, c: '#2E2E5A', lab: 'FAR RIGHT' }];
  let idx = 0;
  const dots: JSX.Element[] = [];
  blocs.forEach((b, bi) => { for (let i = 0; i < b.n; i++, idx++) { const a = Math.PI * (idx / 47); const r = 360 + (idx % 3) * 60; const k = springPop(f, at + bi * 8 + i * 0.6); dots.push(<circle key={idx} cx={960 - Math.cos(a) * r} cy={760 - Math.sin(a) * r} r={20 * k} fill={b.c} stroke={OL} strokeWidth={3} />); } });
  return <g>{dots}{blocs.map((b, i) => <text key={i} x={[620, 960, 1300][i]} y={820} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#fff" opacity={springPop(f, at + i * 8)}>{b.lab}</text>)}{maj && <><path d="M960 300 V780" stroke="#FFD84A" strokeWidth={5} strokeDasharray="14 10" /><text x={980} y={300} fontFamily="TagBold" fontSize={30} fill="#FFD84A">MAJORITY: 289</text></>}</g>;
};
const Wobble: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s10b18', 's10b19', 's10b20', 's10b21'].indexOf(s.id);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          {idx === 0 && <g transform={`translate(960 760) rotate(${Math.sin(f / 5) * 6})`}><rect x={-60} y={-420} width={120} height={420} fill="#E8DCC0" stroke={OL} strokeWidth={6} /><rect x={-80} y={-440} width={160} height={30} fill={GOLD} stroke={OL} strokeWidth={5} /></g>}
          {(idx === 1 || idx === 2) && <Hemicycle at={idx === 1 ? wordAt(s, 'three') : -99} maj={idx === 2} />}
          {idx === 3 && [...Array(6)].map((_, i) => { const t0 = 6 + i * 6; const ang = f < t0 ? 0 : Math.min(80, 0.5 * 0.9 * (f - t0) ** 2); return <g key={i} transform={`translate(${460 + i * 180} 760) rotate(${ang})`}><rect x={-20} y={-220} width={40} height={220} fill="#F4F7FA" stroke={OL} strokeWidth={5} /><circle cy={-180} r={10} fill={OL} /><circle cy={-110} r={10} fill={OL} /></g>; })}
        </Layer>
      </CameraRig>
      {idx === 1 && <Label text="snap election · summer 2024" x={960} y={140} at={wordAt(s, 'snap')} size={54} color="#FFD84A" />}
    </>
  );
};
const PMCard: React.FC<{ x: number; y: number; name: string; sub: string; k: number; fall?: number }> = ({ x, y, name, sub, k, fall = 0 }) => (
  <g transform={`translate(${x} ${y + Math.min(fall, 24) ** 2 * 0.3}) rotate(${Math.min(fall, 24) * 1.2}) scale(${k})`} opacity={1 - Math.min(fall, 24) / 48}>
    <rect x={-150} y={-200} width={300} height={360} rx={16} fill="#3A4058" stroke={OL} strokeWidth={6} />
    <g filter="url(#sil)"><Chibi x={0} y={80} s={0.9} {...PM_FIG} pose="idle" expr="normal" talking={[]} seed={'pm' + name} /></g>
    <text y={120} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill="#fff">{name}</text>
    <text y={154} textAnchor="middle" fontFamily="TagBold" fontSize={22} fill="#FFD84A">{sub}</text>
  </g>
);
const PMs: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s10b22', 's10b23', 's10b24', 's10b25', 's10b26'].indexOf(s.id);
  const barnFall = idx === 0 ? Math.max(0, f - wordAt(s, 'no-confidence')) : idx > 0 ? 60 : 0;
  const bayFall = idx === 1 ? Math.max(0, f - wordAt(s, 'lost')) : idx > 1 ? 60 : 0;
  const names = ['PHILIPPE', 'CASTEX', 'BORNE', 'ATTAL', 'BARNIER', 'BAYROU', 'LECORNU'];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        {idx === 3 ? <ParisStreet /> : <InsertBg />}
        <Layer depth={1.05}>
          {idx <= 1 && <>
            <PMCard x={620} y={480} name="M. BARNIER" sub="Sept–Dec 2024" k={springPop(f, idx === 0 ? 4 : -99)} fall={Math.min(barnFall, 40) * 0.6} />
            {idx >= 1 && <PMCard x={1300} y={480} name="F. BAYROU" sub="Dec 2024–Sept 2025" k={springPop(f, idx === 1 ? 4 : -99)} fall={Math.min(bayFall, 40) * 0.6} />}
          </>}
          {idx === 3 && [...Array(9)].map((_, i) => <Chibi key={i} x={120 + i * 210} y={930} s={0.95} {...MODERN(['#3A3A48', '#C0392B', '#2E6B4A'][i % 3], i)} pose="cross" expr="determined" talking={[]} seed={'bt' + i} />)}
          {idx === 4 && names.map((n, i) => { const k = springPop(f, wordAt(s, 'seventh') - 30 + i * 4); return <PMCard key={n} x={180 + i * 260} y={470} name={n} sub={i === 6 ? 'Sept 2025 →' : ''} k={k * 0.75} />; })}
        </Layer>
      </CameraRig>
      {idx === 0 && <Stamp at={wordAt(s, 'no-confidence')} left={620} top={260} text="NO-CONFIDENCE" size={42} />}
      {idx === 1 && <Stamp at={wordAt(s, 'lost')} left={1300} top={260} text="CONFIDENCE LOST" size={42} />}
      {idx === 2 && <div style={{ position: 'absolute', left: 960, top: 380, transform: `translate(-50%,0) scale(${springPop(f, wordAt(s, '44'))})`, fontFamily: 'TagBold', fontSize: 110, color: '#8EE0A8', background: 'rgba(26,20,16,0.6)', padding: '10px 40px', borderRadius: 18, whiteSpace: 'nowrap' }}>€44 bn of savings</div>}
      {idx === 3 && <DropHtml at={wordAt(s, 'Block')} left={960} top={200} h={300}><div style={{ fontFamily: 'TagBold', fontSize: 64, color: '#fff', background: '#1A1410', padding: '8px 30px', border: '6px solid #fff' }}>« BLOQUONS TOUT » · 10 Sept 2025</div></DropHtml>}
      {idx === 4 && <Label text="7 prime ministers since 2017" x={960} y={150} at={wordAt(s, 'seventh')} size={56} color="#FFD84A" />}
    </>
  );
};
const Triggers: React.FC<SP> = ({ s }) => {
  const b28 = s.id === 's10b28';
  const at = b28 ? [-99, -99, wordAt(s, 'retirement'), wordAt(s, 'police'), wordAt(s, 'budget.')] : [wordAt(s, 'dorm'), wordAt(s, 'fuel'), 99999, 99999, 99999];
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <InsertBg />
      <Layer depth={1}><TriggerStrip y={460} at={at} dorm /></Layer>
    </CameraRig>
  );
};
const FarAway: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b30 = s.id === 's10b30';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#B8C8D4" /><g transform="translate(1600 520) scale(0.45)"><path d="M0 -700 L-40 -300 L-160 300 L-60 300 L0 -100 L60 300 L160 300 L40 -300 Z" fill="#7A7A84" stroke={OL} strokeWidth={8} /><path d="M-100 0 H100 M-70 -300 H70" stroke={OL} strokeWidth={8} /></g><g transform="translate(1600 620)"><rect x={-120} y={-60} width={240} height={80} fill="#E8DCC0" stroke={OL} strokeWidth={4} /><text y={-6} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill="#1A1410">DECISIONS</text></g></Layer>
        <Layer depth={1}><rect x={-200} y={760} width={2400} height={600} fill="#9A9A90" stroke={OL} strokeWidth={4} />{[...Array(5)].map((_, i) => <Chibi key={i} x={200 + i * 180} y={930} s={1.05} {...MODERN(['#C0392B', '#E8E83A', '#2E6B4A', '#3A3A48', '#B85A30'][i], i)} pose={b30 ? 'shrug' : 'point'} expr="angry" talking={[]} seed={'fa' + i} />)}<path d="M1100 700 H1460" stroke="#F4ECD8" strokeWidth={6} strokeDasharray="20 14" /><text x={1280} y={680} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#1A1410" opacity={springPop(f, wordAt(s, 'far') || 4)}>far away</text></Layer>
      </CameraRig>
    </>
  );
};
const DebtClock: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const hand = f * 6;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <rect x={460} y={320} width={1000} height={260} rx={20} fill="#1A1410" stroke={OL} strokeWidth={8} />
          <text x={960} y={300} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#F4ECD8">FRENCH PUBLIC DEBT</text>
          <text x={880} y={490} textAnchor="middle" fontFamily="TagBold" fontSize={110} fill="#FF6B57">≈ €3.4 trillion</text>
          <g transform="translate(1360 450)"><circle r={60} fill="#F4F7FA" stroke={OL} strokeWidth={6} /><path d="M0 0 L0 -46" stroke={OL} strokeWidth={6} transform={`rotate(${hand})`} /></g>
        </Layer>
      </CameraRig>
      {s.id === 's10b32' && <Label text="it doesn't wait" x={960} y={720} at={wordAt(s, 'wait.')} size={60} color="#FFD84A" />}
    </>
  );
};
const Autumn = hostShot((s) => [{ at: 0, arm: 'present', expr: 'normal' }], {
  props: (s) => {
    const f = useCurrentFrame();
    return <g><PopProp at={wordAt(s, 'autumn')} x={1060} y={600}><Calendar x={0} y={0} s={0.75} month="AUTUMN" day="2026" color="#C9732A" /></PopProp>{[...Array(10)].map((_, i) => { const t0 = 4 + i * 7; const fall = Math.max(0, f - t0); return fall > 0 ? <path key={i} d="M0 -14 Q14 0 0 14 Q-14 0 0 -14 Z" transform={`translate(${780 + (random('lf' + i) * 500) + Math.sin((f + i * 9) / 8) * 30} ${200 + Math.min(620, fall * 6)}) rotate(${f * 4 + i * 30})`} fill={['#C9732A', '#B3261E', '#E8A94A'][i % 3]} stroke={OL} strokeWidth={2} /> : null; })}</g>;
  },
});

export const SHOTS_09: ShotMap = {
  small_fires: SmallFires, clichy: Clichy, riots2005: Riots2005, yellow_vests: YellowVests, pensions: Pensions, nahel: Nahel,
  wobble: Wobble, pms: PMs, triggers: Triggers, far_away: FarAway, debt_clock: DebtClock, autumn: Autumn,
};
