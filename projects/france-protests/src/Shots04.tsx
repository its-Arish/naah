/**
 * Act 4 — "The Disguise": Varennes, war, the fall of the monarchy, and (restrained) the execution.
 * Shared helpers for later acts are exported from here: Calendar, Carriage, Tuileries, Bars, Night.
 */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, spring, springPop, gravityDrop, random, onTwos } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { GreyStage, InsertBg } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { FranceMap, CITIES, cityXY } from '@engine/scenes/France';
import { SmallCrown, FleurDeLis, ParisStreet } from '@engine/scenes/FranceScenes';
import { hostShot, wordAt, Drop, PopProp, DropHtml, type ShotMap, type SP } from '@engine/kit';
import { GOLD, PEOPLE, MONEY, STATE, LOUIS16, NOBLE, PEASANT } from './Shots01';

export const MARIE_A = { outfit: { top: '#F2A7C3', robe: true, trim: '#F4F7FA', belt: '#B85A86' }, hat: 'queen', hatColor: '#F4F7FA' };
export const VALET = { outfit: { top: '#5A4A3A', bottom: '#3A2A22', belt: '#2A1B12' }, hat: 'tophat', hatColor: '#3A2A22' };
export const SANS = (c = PEOPLE) => ({ outfit: { top: c, bottom: '#3A3A5A', belt: '#2A1B12' }, hat: 'cap', hatColor: '#C0392B' });
export const GUARD_NAT = { outfit: { top: '#2E4A9A', bottom: '#F4F7FA', sash: '#C0392B' }, hat: 'tricorn', hatColor: '#1E1E28', item: 'musket' };
export const ROBES = { outfit: { top: '#2E6B4A', bottom: '#F4ECD8', trim: '#F4F7FA' }, hat: 'hairlong', hatColor: '#ECECEC' };
const MAP = { x: 330, y: 60, s: 0.86 };
export const mapXY = (city: string | [number, number]) => { const [px, py] = typeof city === 'string' ? CITIES[city] : city; return [MAP.x + MAP.s * px, MAP.y + MAP.s * py]; };

/** A wall calendar page that can flip to a new date. */
export const Calendar: React.FC<{ x: number; y: number; s?: number; month: string; day: string | number; year?: string | number; flipAt?: number; from?: { month: string; day: string | number }; glow?: number; color?: string }> = ({ x, y, s = 1, month, day, year, flipAt, from, glow = 0, color = PEOPLE }) => {
  const f = useCurrentFrame();
  const k = flipAt == null ? 1 : interpolate(f, [flipAt, flipAt + 10], [0, 1], Easing.inOut);
  const show = k < 0.5 && from ? from : { month, day };
  const sy = Math.abs(Math.cos(k * Math.PI));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {glow > 0 && <rect x={-200} y={-230} width={400} height={470} rx={24} fill="none" stroke="#FFD84A" strokeWidth={14 * glow} />}
      <rect x={-180} y={-210} width={360} height={420} rx={16} fill="#F4F7FA" stroke={OL} strokeWidth={8} />
      <g transform={`scale(1 ${from ? Math.max(0.05, sy) : 1})`}>
        <rect x={-180} y={-210} width={360} height={100} rx={16} fill={color} stroke={OL} strokeWidth={8} />
        <text y={-142} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill="#fff">{show.month}</text>
        <text y={60} textAnchor="middle" fontFamily="TagBold" fontSize={String(show.day).length > 2 ? 100 : 150} fill="#1A1410">{show.day}</text>
      </g>
      {year != null && <text y={170} textAnchor="middle" fontFamily="TagBold" fontSize={48} fill="#5A4A3A">{year}</text>}
      {[-110, 110].map((rx) => <rect key={rx} x={rx - 10} y={-228} width={20} height={44} rx={8} fill="#8A8A8A" stroke={OL} strokeWidth={4} />)}
    </g>
  );
};
/** The royal berline (a big travelling coach). */
export const Carriage: React.FC<{ x: number; y: number; s?: number; roll?: number; lit?: boolean; flip?: boolean }> = ({ x, y, s = 1, roll = 0, lit = true, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M-220 -40 Q-230 -190 -120 -200 L140 -200 Q240 -190 230 -40 Z" fill="#2E3A5A" stroke={OL} strokeWidth={7} />
    <rect x={-170} y={-170} width={130} height={95} rx={8} fill={lit ? '#E8C66A' : '#5A6A8A'} stroke={OL} strokeWidth={5} />
    <rect x={20} y={-170} width={130} height={95} rx={8} fill={lit ? '#E8C66A' : '#5A6A8A'} stroke={OL} strokeWidth={5} />
    <rect x={-240} y={-50} width={490} height={24} rx={8} fill="#5A3A22" stroke={OL} strokeWidth={5} />
    {[-150, 160].map((wx) => <g key={wx} transform={`translate(${wx} 30) rotate(${roll})`}><circle r={62} fill="none" stroke="#7A4E2B" strokeWidth={12} /><circle r={62} fill="none" stroke={OL} strokeWidth={3} />{[0, 45, 90, 135].map((a) => <path key={a} d="M-60 0 H60" transform={`rotate(${a})`} stroke="#7A4E2B" strokeWidth={6} />)}<circle r={12} fill="#5A3A22" stroke={OL} strokeWidth={3} /></g>)}
  </g>
);
/** The Tuileries palace (Paris), day or night. */
export const Tuileries: React.FC<{ night?: boolean; smoke?: boolean }> = ({ night, smoke }) => {
  const f = useCurrentFrame();
  const wall = night ? '#3A4058' : '#E8DCC0', roof = night ? '#22283A' : '#5A6A8A', win = night ? '#E8C66A' : '#A8C6E0';
  return (
    <>
      <Layer depth={0}>
        <rect x={-200} y={-200} width={2400} height={1500} fill={night ? '#151B2B' : '#8FB8DE'} />
        {night && [...Array(50)].map((_, i) => <circle key={i} cx={random('ts' + i) * 1920} cy={random('tu' + i) * 380} r={1.8} fill="#fff" opacity={0.7} />)}
        {night && <circle cx={1580} cy={160} r={60} fill="#F4ECD8" />}
      </Layer>
      <Layer depth={0.5}>
        <path d="M-100 330 L-100 250 L560 250 L560 330 Z M1360 330 L1360 250 L2020 250 L2020 330 Z" fill={roof} stroke={OL} strokeWidth={5} />
        <rect x={-100} y={330} width={2120} height={420} fill={wall} stroke={OL} strokeWidth={6} />
        <path d="M760 330 L760 170 Q960 90 1160 170 L1160 330 Z" fill={roof} stroke={OL} strokeWidth={6} />
        {[...Array(20)].map((_, i) => <rect key={i} x={-60 + i * 104} y={400} width={54} height={110} fill={win} opacity={night && i % 3 ? 0.35 : 1} stroke={OL} strokeWidth={3} />)}
        {[...Array(20)].map((_, i) => <rect key={'b' + i} x={-60 + i * 104} y={570} width={54} height={130} fill={win} opacity={night && i % 4 ? 0.3 : 1} stroke={OL} strokeWidth={3} />)}
        <rect x={900} y={590} width={120} height={160} fill="#5A3A22" stroke={OL} strokeWidth={5} />
      </Layer>
      <Layer depth={1}><rect x={-200} y={750} width={2400} height={600} fill={night ? '#2A2E3A' : '#C9B48A'} stroke={OL} strokeWidth={4} /></Layer>
      {smoke && <Layer depth={0.7}>{[...Array(7)].map((_, i) => { const t = (f + i * 30) % 210; return <circle key={i} cx={500 + i * 160 + t * 0.6} cy={300 - t * 1.2} r={40 + t * 0.5} fill="#6A6A70" opacity={0.55 * (1 - t / 210)} />; })}</Layer>}
    </>
  );
};
/** Restrained bar chart. */
export const Bars: React.FC<{ x: number; y: number; bars: { label: string; v: number; c: string; at: number; text?: string }[]; max: number; h?: number; w?: number; gap?: number }> = ({ x, y, bars, max, h = 520, w = 220, gap = 90 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M-30 0 H${bars.length * (w + gap)}`} stroke="#F4ECD8" strokeWidth={6} />
      {bars.map((b, i) => {
        const k = f < b.at ? 0 : spring(f - b.at, { damping: 14, stiffness: 90 });
        const bh = (b.v / max) * h * k;
        return <g key={i} transform={`translate(${i * (w + gap)} 0)`}>
          <rect x={0} y={-bh} width={w} height={bh} fill={b.c} stroke={OL} strokeWidth={5} />
          <text x={w / 2} y={52} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill="#F4ECD8">{b.label}</text>
          {k > 0.3 && <text x={w / 2} y={-bh - 22} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#fff" opacity={Math.min(1, (k - 0.3) * 3)}>{b.text ?? b.v}</text>}
        </g>;
      })}
    </g>
  );
};
export const Night: React.FC<{ ground?: string }> = ({ ground = '#2A2E3A' }) => (
  <>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#151B2B" />{[...Array(60)].map((_, i) => <circle key={i} cx={random('ns' + i) * 1920} cy={random('nu' + i) * 520} r={1.8} fill="#fff" opacity={0.7} />)}<circle cx={1600} cy={170} r={60} fill="#F4ECD8" /></Layer>
    <Layer depth={1}><rect x={-200} y={780} width={2400} height={600} fill={ground} stroke={OL} strokeWidth={4} /></Layer>
  </>
);

// ------------------------------------------------------------------ shots
const NightFlight = hostShot((s) => [{ at: 0, arm: 'present', expr: 'normal' }, { at: wordAt(s, 'XVI,'), arm: 'finger', expr: 'smile' }], {
  props: (s) => <PopProp at={6} x={1060} y={640}><Calendar x={0} y={0} s={0.75} month="JUNE" day={20} year={1791} color={STATE} /></PopProp>,
});
const Escape: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b3 = s.id === 's05b03';
  const walk = interpolate(f, [0, d], b3 ? [760, 1180] : [520, 940]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 700] }}>
        <Tuileries night />
        <Layer depth={1.1}>
          {b3 && <Carriage x={1560} y={840} s={0.95} lit={false} />}
          {[
            { p: b3 ? VALET : { ...LOUIS16, outfit: { ...LOUIS16.outfit, top: '#3A3A48' } }, dx: 0, sc: 1.15, seed: 'lk' },
            { p: { ...MARIE_A, outfit: { ...MARIE_A.outfit, top: '#5A4A6A' } }, dx: -170, sc: 1.1, seed: 'mq' },
            { p: { outfit: { top: '#7FB2E5', bottom: '#3A3A48' }, hat: 'hair', hair: '#C9A66B' }, dx: -300, sc: 0.75, seed: 'k1' },
            { p: { outfit: { top: '#F2A7C3', robe: true }, hat: 'hair', hair: '#C9A66B' }, dx: -400, sc: 0.8, seed: 'k2' },
          ].map((c, i) => <Chibi key={i} x={walk + c.dx} y={910} s={c.sc} {...(c.p as any)} legs="walk" pose="idle" expr="shock" talking={[]} seed={c.seed} delay={i * 3} />)}
        </Layer>
      </CameraRig>
      {s.id === 's05b02' && <Label text="The Tuileries Palace, Paris" x={960} y={140} at={wordAt(s, 'Tuileries')} size={54} color="#fff" />}
      {b3 && <Label text="disguised as a valet" x={walk - 40} y={560} at={wordAt(s, 'valet,')} size={50} color="#FFD84A" />}
    </>
  );
};
const VarennesMap: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const P = mapXY('Paris'), V = mapXY('Varennes'), M = mapXY(cityXY(49.52, 5.37));
  const k = interpolate(f, [4, 34], [0, 0.88], Easing.inOut);
  const pt = [P[0] + (V[0] - P[0]) * Math.min(1, k / 0.88 * 1) , P[1] + (V[1] - P[1]) * Math.min(1, k / 0.88)];
  return (
    <CameraRig move={{ zoomFrom: 1.05, zoomTo: 1.15, focus: [P[0] + 120, P[1]] }}>
      <InsertBg />
      <Layer depth={1}>
        <FranceMap x={MAP.x} y={MAP.y} s={MAP.s} pins={[{ city: 'Paris', at: 2, color: GOLD }]} />
        <path d={`M${P[0]} ${P[1]} L${M[0]} ${M[1]}`} stroke="#F4ECD8" strokeWidth={6} strokeDasharray="14 10" opacity={0.6} />
        <path d={`M${P[0]} ${P[1]} L${pt[0]} ${pt[1]}`} stroke={GOLD} strokeWidth={10} strokeLinecap="round" />
        <circle cx={M[0]} cy={M[1]} r={12} fill={STATE} stroke={OL} strokeWidth={4} />
        <text x={M[0] + 18} y={M[1] - 16} fontFamily="TagBold" fontSize={28} fill="#fff" stroke={OL} strokeWidth={4} style={{ paintOrder: 'stroke' }}>loyal troops</text>
        <g transform={`translate(${pt[0]} ${pt[1]})`}><rect x={-26} y={-20} width={52} height={32} rx={8} fill="#2E3A5A" stroke={OL} strokeWidth={4} /></g>
      </Layer>
    </CameraRig>
  );
};
const VarennesStop: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const stop = wordAt(s, 'stopped.');
  const vx = f < stop ? interpolate(f, [0, stop], [200, 760]) : 760 + 30 * (1 - Math.exp(-(f - stop) / 4));
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, shakes: [{ at: stop, amp: 8, len: 8 }] }}>
        <Night />
        <Layer depth={0.6}>{[...Array(6)].map((_, i) => <g key={i}><rect x={-60 + i * 340} y={420 + (i % 2) * 40} width={280} height={360} fill="#2A3048" stroke={OL} strokeWidth={4} /><path d={`M${-80 + i * 340} ${420 + (i % 2) * 40} L${80 + i * 340} ${330 + (i % 2) * 40} L${240 + i * 340} ${420 + (i % 2) * 40} Z`} fill="#1E2230" stroke={OL} strokeWidth={4} /><rect x={20 + i * 340} y={520} width={60} height={70} fill="#E8C66A" opacity={0.8} /></g>)}</Layer>
        <Layer depth={1.1}>
          <Carriage x={vx} y={850} s={0.9} roll={f < stop ? f * 8 : stop * 8} />
          <Chibi x={1380} y={920} s={1.2} {...SANS('#3A3A48')} item="lamp" pose={f > stop - 6 ? 'raise' : 'hold'} expr="determined" talking={[]} seed="drouet" flip />
          <Chibi x={1560} y={920} s={1.1} {...GUARD_NAT} pose="hold" expr="determined" talking={[]} seed="vg" flip />
        </Layer>
      </CameraRig>
      <Label text="Varennes, 21 June 1791" x={960} y={140} at={wordAt(s, 'Varennes,')} size={54} color="#fff" />
    </>
  );
};
const Banknote: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const disputed = s.id === 's05b07';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [960, 480] }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform="translate(700 470) rotate(-4)">
            <rect x={-330} y={-190} width={660} height={380} rx={10} fill="#E8DFC4" stroke={OL} strokeWidth={7} />
            <rect x={-300} y={-160} width={600} height={320} rx={6} fill="none" stroke="#8A7A5A" strokeWidth={4} strokeDasharray="10 6" />
            <text x={-60} y={-90} textAnchor="middle" fontFamily="Hand" fontSize={44} fill="#5A3A22">Assignat</text>
            <text x={-60} y={-30} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#5A3A22">50 LIVRES</text>
            <ellipse cx={180} cy={10} rx={95} ry={115} fill="#D6CBA8" stroke="#8A7A5A" strokeWidth={5} />
            <g transform="translate(180 120) scale(0.55)"><Chibi x={0} y={0} s={1.2} {...LOUIS16} pose="idle" expr="normal" talking={[]} seed="note" /></g>
          </g>
          <g transform="translate(1440 470)">
            <rect x={-170} y={-200} width={340} height={300} rx={14} fill="#2E3A5A" stroke={OL} strokeWidth={7} />
            <rect x={-140} y={-170} width={280} height={240} fill="#E8C66A" stroke={OL} strokeWidth={5} />
            <g transform="translate(0 70) scale(0.8)"><Chibi x={0} y={0} s={1.2} {...VALET} pose="idle" expr="shock" talking={[]} seed="win" /></g>
          </g>
          <path d="M1060 470 H1240" stroke="#FFD84A" strokeWidth={8} strokeDasharray="16 12" strokeDashoffset={-f * 2} />
          <text x={1150} y={440} textAnchor="middle" fontFamily="TagBold" fontSize={70} fill="#FFD84A">=</text>
        </Layer>
      </CameraRig>
      {disputed && <DropHtml at={wordAt(s, 'argue')} left={960} top={150} h={300}><div style={{ fontFamily: 'TagBold', fontSize: 52, color: '#FFD84A', border: '6px solid #FFD84A', padding: '4px 22px', borderRadius: 10, background: 'rgba(26,20,16,0.8)' }}>DETAILS DISPUTED</div></DropHtml>}
    </>
  );
};
const MarchBack: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const x = interpolate(f, [0, d], [1500, 900]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#B8C4CC" /></Layer>
        <Layer depth={0.5}>{[...Array(14)].map((_, i) => <g key={i} opacity={0.85}><Chibi x={-40 + i * 150} y={700} s={0.7} {...PEASANT(['#8A3A2A', '#5A4A3A', '#3A3A48'][i % 3])} hat="cap" hatColor="#3A3A48" pose="cross" expr="normal" talking={[]} seed={'mb' + i} /></g>)}</Layer>
        <Layer depth={1}><rect x={-200} y={760} width={2400} height={600} fill="#9A8C70" stroke={OL} strokeWidth={4} /></Layer>
        <Layer depth={1.1}>
          <Carriage x={x} y={850} s={0.9} roll={-f * 3} flip />
          {[0, 1, 2, 3].map((i) => <Chibi key={i} x={x + 330 + i * 120} y={920} s={0.95} {...GUARD_NAT} legs="march" pose="hold" expr="determined" talking={[]} seed={'mg' + i} flip delay={i * 3} />)}
        </Layer>
      </CameraRig>
      <Label text="hats kept on: silence" x={960} y={150} at={wordAt(s, 'silence.')} size={50} color="#1A1410" />
    </>
  );
};
const Scales: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const order = ['s05b09', 's05b10', 's05b11', 's05b12'];
  const idx = order.indexOf(s.id);
  const tipAt = idx === 2 ? wordAt(s, 'never') : idx > 2 ? -99 : 99999;
  const target = f >= tipAt ? 14 : -12;
  const from = f >= tipAt ? -12 : -12;
  const ang = f >= tipAt ? from + (target - from) * spring(f - tipAt, { damping: 7, stiffness: 60 }) : -12;
  const left = idx >= 1 ? 1 : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 500] }}>
        <InsertBg />
        <Layer depth={1}>
          <path d="M960 260 V760 M820 760 H1100" stroke="#C9A66B" strokeWidth={18} strokeLinecap="round" />
          <g transform={`translate(960 280) rotate(${ang})`}>
            <path d="M-460 0 H460" stroke="#C9A66B" strokeWidth={16} strokeLinecap="round" />
            {[-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * 440} 0) rotate(${-ang})`}>
              <path d="M0 0 L-120 200 M0 0 L120 200" stroke="#C9A66B" strokeWidth={5} />
              <path d="M-150 200 Q0 270 150 200 Z" fill="#C9A66B" stroke={OL} strokeWidth={5} />
              {sd < 0 && left > 0 && <g transform="translate(0 150)"><rect x={-70} y={-40} width={140} height={90} fill="#2E4A9A" stroke={OL} strokeWidth={5} /><text y={16} textAnchor="middle" fontFamily="TagBold" fontSize={18} fill="#fff">CONSTITUTION</text><SmallCrown x={0} y={-60} s={0.9} /></g>}
              {sd > 0 && idx >= 3 && <g transform={`translate(0 ${150 - 0})`}><text y={0} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill={PEOPLE} stroke="#fff" strokeWidth={6} style={{ paintOrder: 'stroke' }}>NO KING</text></g>}
              <text y={330} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill="#F4ECD8">{sd < 0 ? 'KING + CONSTITUTION' : 'NO KING AT ALL'}</text>
            </g>)}
          </g>
        </Layer>
      </CameraRig>
      {idx === 2 && <Label text="after Varennes" x={960} y={140} at={wordAt(s, 'Varennes,')} size={54} color="#FFD84A" />}
    </>
  );
};
const AUSTRIA = ['#C8102E', '#FFFFFF', '#C8102E'];
const Flag: React.FC<{ x: number; y: number; stripes: string[]; vertical?: boolean; s?: number; wave?: number }> = ({ x, y, stripes, vertical, s = 1, wave = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0 V320" stroke="#5A3A22" strokeWidth={10} />
    <g transform={`skewY(${wave})`}>{stripes.map((c, i) => vertical ? <rect key={i} x={8 + i * 70} y={0} width={70} height={140} fill={c} stroke={OL} strokeWidth={3} /> : <rect key={i} x={8} y={i * (140 / stripes.length)} width={210} height={140 / stripes.length} fill={c} stroke={OL} strokeWidth={3} />)}</g>
  </g>
);
export const TRICOLORE = ['#2E4A9A', '#F4F7FA', '#C0392B'];
const War: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const clash = s.id === 's05b14' ? wordAt(s, 'war') : 99999;
  const k = f < clash ? 0 : spring(f - clash, { damping: 8, stiffness: 160 });
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, shakes: [{ at: clash + 6, amp: 9, len: 9 }] }}>
        <InsertBg />
        <Layer depth={1}>
          <Flag x={360} y={260} stripes={TRICOLORE} vertical wave={Math.sin(f / 9) * 3} />
          <text x={470} y={640} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#fff">FRANCE</text>
          <Flag x={1340} y={260} stripes={AUSTRIA} wave={Math.sin(f / 9 + 1) * 3} />
          <text x={1450} y={640} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#fff">AUSTRIA</text>
          {s.id === 's05b14' && <g transform={`translate(960 400) scale(${0.4 + 0.6 * k})`} opacity={Math.min(1, k * 2)}>{[-1, 1].map((sd) => <g key={sd} transform={`rotate(${sd * 40})`}><rect x={-10} y={-180} width={20} height={300} fill="#D9DDE3" stroke={OL} strokeWidth={4} /><rect x={-50} y={100} width={100} height={18} fill={GOLD} stroke={OL} strokeWidth={4} /><rect x={-10} y={118} width={20} height={60} fill="#5A3A22" stroke={OL} strokeWidth={4} /></g>)}</g>}
          {s.id === 's05b13' && <text x={960} y={440} textAnchor="middle" fontFamily="TagBold" fontSize={120} fill="#F4ECD8" opacity={springPop(f, wordAt(s, 'war.'))}>⚔</text>}
        </Layer>
      </CameraRig>
      {s.id === 's05b14' && <Label text="20 April 1792" x={960} y={150} at={wordAt(s, 'April')} size={56} color="#FFD84A" />}
    </>
  );
};
const Manifesto: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const unroll = interpolate(f, [2, 30], [0.1, 1], Easing.out);
  const fam = s.id === 's05b16';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 480] }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform="translate(640 120)">
            <rect x={-260} y={0} width={520} height={680 * unroll} fill="#F4ECD8" stroke={OL} strokeWidth={6} />
            <rect x={-280} y={-20} width={560} height={36} rx={18} fill="#E0D2B0" stroke={OL} strokeWidth={5} />
            {unroll > 0.3 && <text y={80} textAnchor="middle" fontFamily="Hand" fontSize={40} fill="#1A1410">To the people of Paris:</text>}
            {[...Array(Math.floor(8 * unroll))].map((_, i) => <path key={i} d={`M-200 ${140 + i * 56} H${200 - (i % 3) * 50}`} stroke="#C9BFA6" strokeWidth={5} />)}
            {unroll > 0.8 && <text y={620} textAnchor="middle" fontFamily="Hand" fontSize={34} fill="#B3261E">— Duke of Brunswick</text>}
          </g>
          <g transform="translate(1340 520)">
            <circle r={150} fill="#E8DCC0" stroke={OL} strokeWidth={7} />
            <text y={fam ? -70 : 14} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill="#1A1410">PARIS</text>
            {!fam && <path d={`M-60 -140 L-20 -60 L-70 0 L-10 70 L-40 150`} stroke="#B3261E" strokeWidth={8} fill="none" strokeDasharray="400" strokeDashoffset={interpolate(f, [wordAt(s, 'destruction'), wordAt(s, 'destruction') + 16], [400, 0])} />}
            {fam && <g transform="translate(0 110)">{[{ p: LOUIS16, x: -60, sc: 0.75 }, { p: MARIE_A, x: 60, sc: 0.72 }].map((c, i) => <Chibi key={i} x={c.x} y={0} s={c.sc} {...(c.p as any)} pose="idle" expr="normal" talking={[]} seed={'mf' + i} />)}</g>}
          </g>
        </Layer>
      </CameraRig>
      <Label text="The Brunswick Manifesto, July 1792" x={1340} y={250} at={4} size={50} color="#fff" />
    </>
  );
};
const Backfire = hostShot((s) => [{ at: 0, arm: 'shrug', expr: 'grin' }], {
  props: (s) => {
    const f = useCurrentFrame();
    const at = wordAt(s, 'backfired');
    const puff = Math.max(0, f - at);
    return <PopProp at={4} x={1060} y={700}><g>
      <g transform={`translate(${-Math.min(40, puff * 4) + (puff > 10 ? (puff - 10) * 0.5 : 0)} 0) rotate(${puff > 0 ? -6 : 0})`}>
        <rect x={-150} y={-50} width={260} height={90} rx={40} fill="#3A3A48" stroke={OL} strokeWidth={7} />
        <circle cx={-150} cy={-5} r={50} fill="#3A3A48" stroke={OL} strokeWidth={7} />
        <circle cx={-40} cy={70} r={50} fill="#7A4E2B" stroke={OL} strokeWidth={6} />
      </g>
      {puff > 0 && [...Array(5)].map((_, i) => <circle key={i} cx={-200 - puff * (2 + i)} cy={-20 - i * 18 - puff * 0.8} r={20 + puff * 1.4 + i * 6} fill="#9A9AA4" opacity={Math.max(0, 0.8 - puff / 40)} />)}
    </g></PopProp>;
  },
});
const TuileriesStorm: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const fall = s.id === 's05b20' ? wordAt(s, 'suspended.') - 8 : 99999;
  const drop = gravityDrop(f, fall, { h: 520, g: 1.5, e: 0.35 });
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.04, zoomTo: 1.0, focus: [960, 520] }}>
        <Tuileries smoke />
        <Layer depth={1.1}>
          {s.id !== 's05b20' && [...Array(14)].map((_, i) => <g key={i} filter="url(#sil)"><Chibi x={100 + i * 130} y={920 + (i % 3) * 14} s={0.72} {...SANS()} pose={i % 3 ? 'raise' : 'idle'} expr="determined" talking={[]} seed={'ts' + i} /></g>)}
          {s.id === 's05b20' && f >= fall && <g transform={`translate(960 ${760 + drop.y}) rotate(${drop.bounces > 0 ? 18 : 0}) scale(${drop.sx} ${drop.sy})`}><SmallCrown x={0} y={0} s={2.4} /></g>}
        </Layer>
      </CameraRig>
      {s.id === 's05b18' && <Label text="10 August 1792" x={960} y={140} at={wordAt(s, 'August')} size={56} color="#1A1410" />}
      {s.id === 's05b20' && <DropHtml at={wordAt(s, 'suspended.') + 8} left={960} top={380} h={300}><div style={{ fontFamily: 'TagBold', fontSize: 64, color: '#B3261E', border: '7px solid #B3261E', padding: '4px 26px', borderRadius: 10, background: 'rgba(255,255,255,0.9)', transform: 'rotate(-5deg)' }}>MONARCHY SUSPENDED</div></DropHtml>}
    </>
  );
};
const Republic: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const up = interpolate(f, [6, 40], [0, 1], Easing.out);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <ParisStreet />
        <Layer depth={1.1}>
          <path d="M960 840 V180" stroke="#5A3A22" strokeWidth={14} />
          <g transform={`translate(966 ${700 - 480 * up}) skewY(${Math.sin(f / 8) * 3})`}>{TRICOLORE.map((c, i) => <rect key={i} x={i * 90} y={0} width={90} height={180} fill={c} stroke={OL} strokeWidth={4} />)}</g>
          {[...Array(8)].map((_, i) => <Chibi key={i} x={200 + i * 220 + (i > 3 ? 120 : 0)} y={930} s={0.95} {...SANS(['#C0392B', '#2E4A9A', '#B85A30'][i % 3])} pose={f > 40 + i * 2 ? 'cheer' : 'idle'} expr="happy" talking={[]} seed={'rp' + i} />)}
        </Layer>
      </CameraRig>
      <DropHtml at={wordAt(s, 'republic.')} left={960} top={140} h={300}><div style={{ background: '#F4F7FA', border: '6px solid #1A1410', padding: '8px 28px', fontFamily: 'TagBold', fontSize: 54, color: '#2E4A9A' }}>RÉPUBLIQUE FRANÇAISE · Sept 1792</div></DropHtml>
    </>
  );
};
const Trial: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const name = s.id === 's05b22' ? wordAt(s, 'Citizen') : -99;
  const capet = s.id === 's05b23';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 600] }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#6A5A48" />{[...Array(8)].map((_, i) => <rect key={i} x={-100 + i * 300} y={60} width={80} height={700} fill="#7E6C58" stroke={OL} strokeWidth={4} />)}</Layer>
        <Layer depth={1}>
          <rect x={-200} y={780} width={2400} height={600} fill="#4A3A2A" stroke={OL} strokeWidth={4} />
          <rect x={1120} y={500} width={640} height={120} fill="#7A4E2B" stroke={OL} strokeWidth={6} />
          {[0, 1, 2].map((i) => <Chibi key={i} x={1260 + i * 180} y={520} s={0.9} {...DEPUTY_T} pose={i === 1 ? 'point' : 'cross'} expr="determined" talking={[]} seed={'jt' + i} flip />)}
          <Chibi x={560} y={920} s={1.35} {...{ ...LOUIS16, outfit: { ...LOUIS16.outfit, top: '#5A5A6A', trim: '#8A8A8A', sash: undefined } }} pose="idle" expr="sad" talking={[]} seed="cit" />
        </Layer>
      </CameraRig>
      {f >= name && <div style={{ position: 'absolute', left: 560, top: 300, transform: `translate(-50%,0) scale(${s.id === 's05b22' ? springPop(f, name) : 1}) rotate(-3deg)`, fontFamily: 'TagBold', fontSize: capet ? 72 : 56, color: '#1A1410', background: '#F4ECD8', border: '6px solid #1A1410', padding: '8px 26px', boxShadow: '8px 10px 0 rgba(0,0,0,0.25)', whiteSpace: 'nowrap' }}>{capet ? '📌 CAPET' : 'CITIZEN LOUIS CAPET'}</div>}
      {capet && <Label text="(remember 987?)" x={560} y={470} at={wordAt(s, 'again.')} size={46} color="#FFD84A" />}
    </>
  );
};
const DEPUTY_T = { outfit: { top: '#1E1E28', bottom: '#1E1E28', sash: '#C0392B' }, hat: 'hair', hair: '#3A2416' };
/** The execution is never shown: the calendar flips to the date, then the screen goes to black. */
const Jan21: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const black = wordAt(s, 'guillotined') - 4;
  const a = interpolate(f, [black, black + 14], [0, 1]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.06, focus: [960, 470] }}>
        <InsertBg glow={false} />
        <Layer depth={1}><Calendar x={960} y={460} s={1.1} from={{ month: 'DECEMBER', day: 31 }} flipAt={wordAt(s, 'January') - 6} month="JANUARY" day={21} year={1793} color="#3A3A48" /></Layer>
      </CameraRig>
      <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: a }} />
      {a >= 1 && <div style={{ position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: 'Hand', fontSize: 50, color: '#8A8A8A', opacity: interpolate(f, [black + 30, black + 50], [0, 1]) }}>Place de la Révolution · today's Place de la Concorde</div>}
    </>
  );
};
const MarieOct: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const again = s.id === 's05b26';
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [960, 470] }}>
      <InsertBg glow={false} />
      <Layer depth={1}>
        <Calendar x={again ? 760 : 960} y={460} s={1.05} month="OCTOBER" day={16} year={1793} color="#3A3A48" glow={again ? springPop(f, 2) : 0} />
        {again && <g opacity={0.85} transform="translate(1260 460) scale(0.7)"><Calendar x={0} y={0} month="OCTOBER" day={5} year={1789} color={PEOPLE} /></g>}
        {again && <text x={1010} y={480} textAnchor="middle" fontFamily="TagBold" fontSize={64} fill="#FFD84A">←</text>}
      </Layer>
    </CameraRig>
  );
};
const Besieged: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s05b27', 's05b28', 's05b29'].indexOf(s.id);
  const C = mapXY('Paris');
  const arrows: [number, number, number][] = [[1500, 200, 0], [1580, 520, 4], [1440, 820, 8], [200, 160, 12], [140, 600, 16], [960, 1000, 20], [1250, 60, 24]];
  const dark = idx === 2 ? interpolate(f, [wordAt(s, 'fear'), wordAt(s, 'fear') + 20], [0, 0.55]) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <FranceMap x={MAP.x} y={MAP.y} s={MAP.s} />
          {arrows.map(([ax, ay, dl], i) => { const k = interpolate(f, [dl, dl + 20], [0, 1], Easing.out); const tx = ax + (C[0] - ax) * 0.45 * k, ty = ay + (C[1] - ay) * 0.45 * k; const ang = Math.atan2(C[1] - ay, C[0] - ax) * 180 / Math.PI; return idx === 0 || true ? <g key={i} opacity={idx === 0 ? 1 : 0.6}><path d={`M${ax} ${ay} L${tx} ${ty}`} stroke={STATE} strokeWidth={14} strokeLinecap="round" /><path d="M0 -20 L30 0 L0 20 Z" transform={`translate(${tx} ${ty}) rotate(${ang})`} fill={STATE} stroke={OL} strokeWidth={3} /></g> : null; })}
          {idx >= 1 && ['Nantes', 'Lyon', 'Marseille', 'Toulouse'].map((c, i) => { const [x, y] = mapXY(c); const k = springPop(f, (idx === 1 ? wordAt(s, 'uprisings') : -99) + i * 4); return k > 0 ? <g key={c} transform={`translate(${x} ${y}) scale(${k})`}><path d="M0 -40 Q22 -10 14 10 Q8 26 0 28 Q-8 26 -14 10 Q-22 -10 0 -40 Z" fill="#E8742A" stroke={OL} strokeWidth={4} /></g> : null; })}
          {idx >= 1 && <g transform="translate(1560 760)" opacity={springPop(f, idx === 1 ? wordAt(s, 'prices') : -99)}><rect x={-120} y={-150} width={240} height={190} rx={12} fill="#F4F7FA" stroke={OL} strokeWidth={5} /><path d="M-90 10 L-40 -20 L10 -10 L80 -110" stroke={PEOPLE} strokeWidth={10} fill="none" /><path d="M60 -116 L86 -116 L86 -90" stroke={PEOPLE} strokeWidth={10} fill="none" /><text y={80} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill="#fff">PRICES</text></g>}
        </Layer>
      </CameraRig>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 45%, transparent 30%, #000 85%)', opacity: dark }} />
      {idx === 0 && <Label text="every monarchy in Europe vs France" x={960} y={140} at={wordAt(s, 'monarchy')} size={50} color="#fff" />}
    </>
  );
};
const RobespierreIntro: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b31 = s.id === 's05b31';
  const items = [
    { at: wordAt(s, 'drink,'), icon: '🍷', x: 1120 },
    { at: wordAt(s, 'gamble,'), icon: '🎲', x: 1400 },
  ];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <g filter={b31 ? undefined : 'url(#sil)'}><Chibi x={600} y={900} s={1.6} {...ROBES} item="scroll" pose="hold" expr="calm" talking={[]} seed="robes" /></g>
          {!b31 && <text x={600} y={330} textAnchor="middle" fontFamily="TagBold" fontSize={120} fill="#F4ECD8" opacity={springPop(f, wordAt(s, 'lawyer'))}>?</text>}
        </Layer>
      </CameraRig>
      {b31 && items.map((it, i) => { const k = springPop(f, it.at); return k > 0 ? <div key={i} style={{ position: 'absolute', left: it.x, top: 300, transform: `translate(-50%,-50%) scale(${k})`, fontSize: 120 }}>{it.icon}<div style={{ position: 'absolute', left: -10, right: -10, top: 60, height: 14, background: '#B3261E', transform: 'rotate(-35deg)', borderRadius: 7 }} /></div> : null; })}
      {b31 && <DropHtml at={wordAt(s, 'Incorruptible.') - 6} left={1260} top={600} h={400}><div style={{ fontFamily: 'TagBold', fontSize: 58, color: '#1A1410', background: '#F4ECD8', border: '6px solid #1A1410', padding: '8px 28px', transform: 'rotate(-3deg)', boxShadow: '8px 10px 0 rgba(0,0,0,0.25)' }}>"THE INCORRUPTIBLE"</div></DropHtml>}
    </>
  );
};
/** Restrained: a count, no imagery. */
export const DeathCount: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const at = wordAt(s, 'seventeen') || wordAt(s, '17,000');
  const n = Math.round(17000 * interpolate(f, [at, at + 50], [0, 1], Easing.out));
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <InsertBg glow={false} />
      <Layer depth={1}>
        {[...Array(10)].map((_, i) => <g key={i} opacity={f > at + i * 5 ? 1 : 0.25}><rect x={210 + i * 152} y={240} width={130} height={150} rx={10} fill="#F4F7FA" stroke={OL} strokeWidth={4} /><rect x={210 + i * 152} y={240} width={130} height={36} rx={10} fill="#3A3A48" /><text x={275 + i * 152} y={360} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill="#1A1410">{i + 1}</text></g>)}
        <text x={960} y={210} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#B8B8C0">TEN MONTHS</text>
        <text x={960} y={620} textAnchor="middle" fontFamily="TagBold" fontSize={150} fill="#F4ECD8">~{n.toLocaleString('en-US')}</text>
        <text x={960} y={700} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#B8B8C0">death sentences</text>
      </Layer>
    </CameraRig>
  );
};

export const SHOTS_04: ShotMap = {
  night_flight: NightFlight, escape: Escape, varennes_map: VarennesMap, varennes_stop: VarennesStop, banknote: Banknote,
  march_back: MarchBack, scales: Scales, war: War, manifesto: Manifesto, backfire: Backfire, tuileries_storm: TuileriesStorm,
  republic: Republic, trial: Trial, jan21: Jan21, marie_oct: MarieOct, besieged: Besieged, robespierre_intro: RobespierreIntro,
  death_count: DeathCount,
};
