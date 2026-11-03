/** Chapter 8: The Old Fear Returns (2000 → October 2026). Even-handed: each side's view is shown in its own words. */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { EmptyStreet } from '@engine/scenes/IndiaB3';
import { Silhouette } from '@engine/cast/Silhouette';
import { hostShot, wordAt, PopProp, type ShotMap, type SP } from '@engine/kit';
import { W, dress, SKIN } from '@engine/cast/Wardrobe';
import { Calendar } from '@engine/fx/Infographics';
import { RED, PAPER, GOLD } from './Cast';
import { idx, at, Sign, Insert, Flag, Kremlin, Person, LineChart, Axes, hostDim } from './Kit2';

const PUTIN = dress(W.SUIT('#1E1E28', '#B8A890'), { hat: 'parted' });
const CIV = (i = 0) => ({ ...W.MODERN(['#5A6A7A', '#7A5A4A', '#4A6A5A', '#6A5A7A'][i % 4], i), skin: SKIN.light });

const Stability = hostShot((s) => [{ at: 0, arm: 'present', expr: 'smile' }], {
  props: (s) => <PopProp at={at(s, 'stability') - 4} x={1040} y={520}><g>{[0, 1, 2].map((i) => <rect key={i} x={-120 + i * 10} y={-i * 70} width={240 - i * 20} height={64} rx={8} fill={['#8A8A90', '#A8A8B0', '#C8C8D0'][i]} stroke={OL} strokeWidth={5} />)}<text y={110} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#3A3A48">STABILITY</text></g></PopProp>,
});
const REC = ['s09b02', 's09b03', 's09b04', 's09b05'];
const Recovery: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const k = idx(s, REC);
  const box: [number, number, number, number] = [380, 300, 1100, 760];
  const oil: [number, number][] = [[1999, 18], [2000, 29], [2001, 24], [2002, 25], [2003, 29], [2004, 38], [2005, 55], [2006, 65], [2007, 72], [2008, 97]];
  const p = k === 0 ? interpolate(f, [at(s, 'prices') - 10, d], [0.1, 1]) : 1;
  return (
    <Insert>
      <text x={740} y={220} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill={PAPER}>OIL PRICE ($ per barrel)</text>
      <Axes box={box} xr={[1999, 2008]} yr={[0, 100]} xl={[[1999, '1999'], [2008, '2008']]} yl={[[20, '$20'], [100, '$100']]} />
      <LineChart pts={oil} xr={[1999, 2008]} yr={[0, 100]} p={p} box={box} color="#FFD84A" />
      <Sign t={k === 1 ? at(s, 'recovered') - 4 : k > 1 ? -99 : 9999} x={1500} y={330} text="ECONOMY ↑" size={44} bg="#C9E0A0" sub="≈ 7% growth a year, 2000–08" />
      <Sign t={k === 2 ? at(s, 'centralised') - 4 : k > 2 ? -99 : 9999} x={1500} y={530} text="POWER → KREMLIN" size={40} />
      <Sign t={k === 3 ? at(s, 'influence') - 4 : 9999} x={1500} y={730} text="INFLUENCE ABROAD" size={40} bg="#F4D58A" />
    </Insert>
  );
};
const Quote: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <Insert>
      <Silhouette x={520} y={520} name="Vladimir Putin" role="address, April 2005" c="#5A2A26" costume={PUTIN} pose="present" />
      <g transform="translate(1300 500)" opacity={springPop(f, at(s, 'called') - 4)}>
        <rect x={-460} y={-170} width={920} height={340} rx={24} fill="#fff" stroke={OL} strokeWidth={6} />
        <text y={-60} textAnchor="middle" fontFamily="Hand" fontSize={58} fill="#1A1410">"…a major geopolitical</text>
        <text y={20} textAnchor="middle" fontFamily="Hand" fontSize={58} fill="#1A1410">catastrophe of the century"</text>
        <text y={110} textAnchor="middle" fontFamily="Tag" fontSize={30} fill="#5A4A3A">on the collapse of the Soviet Union</text>
      </g>
    </Insert>
  );
};
const VIEWS = ['s09b16', 's09b17', 's09b18'];
const Views: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = idx(s, VIEWS);
  const Card: React.FC<{ x: number; y: number; t: number; who: string; line: string; c: string; dim: boolean }> = ({ x, y, t, who, line, c, dim }) => {
    const kk = springPop(f, t);
    return kk > 0 ? <g transform={`translate(${x} ${y}) scale(${kk})`} opacity={dim ? 0.45 : 1}><rect x={-400} y={-120} width={800} height={240} rx={20} fill={PAPER} stroke={OL} strokeWidth={6} /><rect x={-400} y={-120} width={800} height={70} rx={20} fill={c} stroke={OL} strokeWidth={6} /><text y={-70} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#fff">{who}</text><text y={40} textAnchor="middle" fontFamily="Hand" fontSize={44} fill="#1A1410">{line}</text></g> : null;
  };
  if (k === 2) return (
    <Insert>
      <Flag kind="un" x={300} y={260} s={0.8} pole={320} />
      <text x={1100} y={260} textAnchor="middle" fontFamily="TagBold" fontSize={42} fill={PAPER}>UN General Assembly · 2 March 2022</text>
      {[['IN FAVOUR', 141, '#4A9A5A'], ['AGAINST', 5, '#B3261E'], ['ABSTAINED', 35, '#8A8A90']].map(([l, v, c], i) => { const kk = springPop(f, at(s, 'condemned') - 6 + i * 6); return <g key={String(l)} transform={`translate(${720 + i * 380} 620) scale(${kk})`}><rect x={-160} y={-150} width={320} height={260} rx={20} fill={String(c)} stroke={OL} strokeWidth={6} /><text y={0} textAnchor="middle" fontFamily="TagBold" fontSize={110} fill="#fff">{v}</text><text y={80} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#fff">{l}</text></g>; })}
    </Insert>
  );
  return (
    <Insert>
      <Card x={960} y={330} t={at(s, 'pointed', 4) - 4} who="MOSCOW'S STATED REASONS" line="NATO expansion · security fears" c="#8C1D18" dim={k === 1} />
      {k === 1 && <Card x={960} y={680} t={at(s, 'called') - 4} who="UKRAINE & MOST COUNTRIES" line="an unprovoked war of aggression" c="#0057B7" dim={false} />}
    </Insert>
  );
};
const Largest: React.FC<SP> = ({ s }) => (
  <Insert glow={false}>
    <text x={960} y={480} textAnchor="middle" fontFamily="TagBold" fontSize={64} fill={PAPER}>THE LARGEST WAR IN EUROPE</text>
    <text x={960} y={580} textAnchor="middle" fontFamily="TagBold" fontSize={64} fill="#FFD84A">SINCE 1945</text>
  </Insert>
);
const Cities: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b21 = s.id === 's09b21';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <EmptyStreet smoke={!b21} dim={0.3} />
        {b21 && <Layer depth={1}>{[...Array(6)].map((_, i) => <g key={i} filter="url(#sil)" opacity={0.75}><Chibi x={interpolate(f, [0, d], [900, 1900]) + i * 150} y={960} s={0.8} {...CIV(i)} item={i % 2 ? 'bundle' : 'sack'} legs="walk" pose="carry" expr="sad" talking={[]} seed={'dp' + i} delay={i * 4} /></g>)}</Layer>}
      </CameraRig>
      {!b21 && <Label text="Mariupol, Bakhmut, Avdiivka…" x={960} y={180} at={at(s, 'flattened')} size={50} color="#C9C2B4" />}
      {b21 && <Label text="UNHCR: millions of refugees and internally displaced" x={960} y={180} at={at(s, 'displaced')} size={44} color="#C9C2B4" />}
    </>
  );
};
const LOSS = ['s09b22', 's09b23', 's09b24'];
const Losses: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = idx(s, LOSS);
  return (
    <Insert glow={false}>
      <g transform="translate(960 520) rotate(-1)">
        <rect x={-460} y={-330} width={920} height={660} rx={14} fill="#EADCB8" stroke={OL} strokeWidth={7} />
        <text y={-250} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#5A4A3A">RUSSIAN MILITARY LOSSES (killed + wounded)</text>
        {k >= 1 && [['Lower estimates', 'hundreds of thousands'], ['Western estimates, 2025–26', 'over 1 million']].map(([a, b], i) => <g key={a} opacity={springPop(f, k === 1 ? at(s, i ? 'million' : 'hundreds') - 6 : -99)}><text x={-400} y={-140 + i * 110} fontFamily="Tag" fontSize={34} fill="#5A4A3A">{a}</text><text x={400} y={-140 + i * 110} textAnchor="end" fontFamily="TagBold" fontSize={40} fill="#1A1410">{b}</text></g>)}
        {k === 2 && <g opacity={springPop(f, at(s, 'no') - 4)}><text x={-400} y={160} fontFamily="Tag" fontSize={34} fill="#5A4A3A">Official Russian count</text><rect x={120} y={120} width={280} height={60} fill="#1A1410" /></g>}
      </g>
    </Insert>
  );
};
const Talks: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b29 = s.id === 's09b29';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <rect x={460} y={620} width={1000} height={40} rx={10} fill="#8A5A34" stroke={OL} strokeWidth={6} />
          <path d="M520 660 V880 M1400 660 V880" stroke="#6E4A2A" strokeWidth={16} />
          {[0, 1, 2].map((i) => { const on = b29 ? (Math.floor(f / 18) + i) % 2 === 0 : true; return <g key={i} transform={`translate(${640 + i * 320} 600)`}><rect x={-60} y={-160} width={120} height={160} rx={12} fill={on ? '#5A6A8A' : '#3A3A40'} stroke={OL} strokeWidth={5} opacity={on ? 1 : 0.4} /></g>; })}
          {[['ru', 520], ['ukr', 960], ['us', 1400]].map(([k, x]) => k === 'us' ? <g key={String(k)} transform={`translate(${x} 620)`}><rect x={-7} y={-260} width={14} height={260} fill="#8A8A90" />{[...Array(7)].map((_, i) => <rect key={i} x={7} y={-260 + i * 12} width={120} height={12} fill={i % 2 ? '#fff' : '#B22234'} />)}<rect x={7} y={-260} width={50} height={48} fill="#3C3B6E" /></g> : <Flag key={String(k)} kind={k as any} x={Number(x)} y={360} s={0.5} pole={260} />)}
        </Layer>
      </CameraRig>
      <Label text="late October 2026: new three-way talks proposed for November" x={960} y={170} at={4} size={42} />
    </>
  );
};
const OldFear = hostDim((s) => [{ at: 0, arm: s.id === 's09b31' ? 'finger' : 'idle', expr: 'worried' }], (s) => s.id === 's09b31'
  ? <PopProp at={at(s, 'shoot') - 6} x={1040} y={560}><g><path d="M-120 -20 Q0 70 120 -20" stroke={OL} strokeWidth={10} fill="none" /><path d="M-100 -30 H100 V-120 Q0 -100 -100 -120 Z" fill="#C9935A" stroke={OL} strokeWidth={6} strokeLinejoin="round" /><path d="M-100 -120 Q-130 -190 -60 -190 L-60 -120" fill="#E8D8C0" stroke={OL} strokeWidth={5} /></g></PopProp>
  : <PopProp at={at(s, 'old') - 4} x={1040} y={520}><g><path d="M-90 0 Q0 -70 90 0 Q0 70 -90 0 Z" fill="#fff" stroke={OL} strokeWidth={6} /><circle r={26} fill="#2A2E3A" /></g></PopProp>, 0.3);

export const SHOTS_09: ShotMap = {
  c8_stability: Stability, c8_recovery: Recovery, c8_quote: Quote, c8_views: Views, c8_largest: Largest, c8_cities: Cities,
  c8_losses: Losses, c8_talks: Talks, c8_oldfear: OldFear,
};
