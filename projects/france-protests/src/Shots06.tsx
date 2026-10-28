/**
 * Act 6 — "The Emperor, the Flight and the Flames": Napoleon to the Commune.
 * Restraint for Bloody Week: smoke and a number, no bodies.
 */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, spring, springPop, gravityDrop, projectile, random, onTwos } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL, Flame } from '@engine/scenes/Parts';
import { FranceMap, CITIES } from '@engine/scenes/France';
import { Cathedral, ParisStreet, TownHall, SmallCrown, FleurDeLis } from '@engine/scenes/FranceScenes';
import { Elephant } from '@engine/scenes/India';
import { hostShot, wordAt, PopProp, DropHtml, type ShotMap, type SP } from '@engine/kit';
import { GOLD, PEOPLE, MONEY, STATE, NOBLE, PEASANT } from './Shots01';
import { SANS, GUARD_NAT, Calendar, Carriage, Tuileries, Night, mapXY, TRICOLORE } from './Shots04';

export const NAPOLEON = { outfit: { top: '#2E4A9A', bottom: '#F4F7FA', trim: GOLD, belt: '#F4F7FA' }, hat: 'bicorne', hatColor: '#1E1E28', hair: '#3A2416' };
const GRENADIER = { outfit: { top: '#2E4A9A', bottom: '#F4F7FA', sash: '#F4F7FA' }, hat: 'shako', hatColor: '#1E1E28', item: 'musket' };
const PREFECT = { outfit: { top: '#1E2E5A', bottom: '#1E2E5A', trim: '#C9C9D2' }, hat: 'tricorn', hatColor: '#1E1E28' };
const PRUSSIAN = { outfit: { top: '#3A4A5A', bottom: '#2A2A34' }, hat: 'helmet', hatColor: '#2A2A34', item: 'musket' };
const POPE = { outfit: { top: '#F4F7FA', robe: true, trim: GOLD }, hat: 'skullcap', hatColor: '#F4F7FA' };
const LP = { outfit: { top: '#3A3A48', bottom: '#5A5A6A' }, hat: 'tophat', hatColor: '#1E1E28', mustache: true };

export const Pinned: React.FC<{ text: string; left: number; top: number; at?: number; size?: number }> = ({ text, left, top, at, size = 90 }) => {
  const f = useCurrentFrame();
  const k = at == null ? 1 : springPop(f, at);
  return k > 0 ? <div style={{ position: 'absolute', left, top, transform: `translate(-50%,-50%) scale(${k}) rotate(-3deg)`, fontFamily: 'TagBold', fontSize: size, color: '#1A1410', background: '#F4ECD8', border: '6px solid #1A1410', padding: '8px 34px', boxShadow: '8px 10px 0 rgba(0,0,0,0.25)', whiteSpace: 'nowrap' }}>📌 {text}</div> : null;
};

const NapoleonHost = hostShot((s) => [{ at: 0, arm: 'present', expr: 'smile' }], {
  props: () => <PopProp at={6} x={1060} y={600}><g><rect x={-170} y={-220} width={340} height={420} fill="#7A4E2B" stroke={OL} strokeWidth={8} /><rect x={-145} y={-195} width={290} height={370} fill="#C9D6E3" /><g transform="translate(0 160)"><Chibi x={0} y={0} s={1.1} {...NAPOLEON} pose="cross" expr="determined" talking={[]} seed="nh" /></g><text y={250} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#fff">NAPOLEON</text></g></PopProp>,
});
/** 18 Brumaire: grenadiers clear the hall; deputies leave by the windows (as they did at Saint-Cloud). */
const Brumaire: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#C9A87A" />{[0, 1, 2].map((i) => <g key={i}><rect x={180 + i * 600} y={160} width={260} height={420} fill="#A8C6E0" stroke={OL} strokeWidth={8} /><path d={`M${310 + i * 600} 160 V580 M${180 + i * 600} 370 H${440 + i * 600}`} stroke={OL} strokeWidth={5} /></g>)}</Layer>
        <Layer depth={1}>
          <rect x={-200} y={780} width={2400} height={600} fill="#7A5A3A" stroke={OL} strokeWidth={4} />
          {[0, 1, 2].map((i) => { const t0 = 10 + i * 14; const p = projectile(f, t0, [310 + i * 600, 520], [i === 1 ? -3 : 4, -12], 1.2, { y: 900, e: 0.3 }); const on = f >= t0; return <g key={i} transform={`translate(${on ? p.x : 310 + i * 600} ${on ? p.y : 560}) rotate(${on && !p.landed ? (f - t0) * 9 : 0})`}><Chibi x={0} y={0} s={0.85} outfit={{ top: '#C0392B', bottom: '#F4F7FA', sash: '#2E4A9A' }} hat="hair" hair="#3A2416" pose="bothUp" expr="shock" talking={[]} seed={'dw' + i} /></g>; })}
          {[0, 1, 2, 3].map((i) => <Chibi key={i} x={1180 + i * 150} y={930} s={1.0} {...GRENADIER} legs="march" pose="hold" expr="determined" talking={[]} seed={'gr' + i} flip delay={i * 2} />)}
          <Chibi x={1820} y={930} s={1.1} {...NAPOLEON} pose="point" expr="determined" talking={[]} seed="nb" flip />
        </Layer>
      </CameraRig>
      <Label text="November 1799 · a coup" x={960} y={140} at={wordAt(s, 'November')} size={54} color="#1A1410" />
    </>
  );
};
const Coronation: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const grab = wordAt(s, 'taking') - 4;
  const k = interpolate(f, [grab, grab + 16], [0, 1], Easing.inOut);
  const cx = 820 + (1140 - 820) * k, cy = 520 - Math.sin(k * Math.PI) * 120 + (440 - 520) * k;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [960, 560] }}>
        <Cathedral />
        <Layer depth={1.1}>
          <Chibi x={760} y={900} s={1.25} {...POPE} legs="sit" pose={k > 0.2 ? 'shrug' : 'present'} expr={k > 0.4 ? 'shock' : 'calm'} talking={[]} seed="pope" />
          <Chibi x={1140} y={900} s={1.35} {...NAPOLEON} outfit={{ top: '#8A1E2E', bottom: '#F4F7FA', trim: GOLD, cape: '#8A1E2E' }} pose={k > 0.5 ? 'raise' : 'idle'} expr="proud" talking={[]} seed="nc" flip />
          <g transform={`translate(${cx} ${cy})`}><SmallCrown x={0} y={0} s={1.3} /></g>
        </Layer>
      </CameraRig>
      <Label text="Notre-Dame, 1804" x={960} y={140} at={wordAt(s, '1804')} size={54} color="#fff" />
    </>
  );
};
const FullCircle: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const t2 = wordAt(s, 'emperor.');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform="translate(560 480)"><SmallCrown x={0} y={0} s={2.6} /><path d="M-120 -170 L120 70 M120 -170 L-120 70" stroke="#B3261E" strokeWidth={18} opacity={springPop(f, wordAt(s, 'king'))} /><text y={150} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill="#fff">KING · 1793</text></g>
          <path d="M760 360 Q960 200 1160 360" stroke="#FFD84A" strokeWidth={10} fill="none" strokeDasharray="300" strokeDashoffset={interpolate(f, [t2 - 20, t2], [300, 0])} />
          <g transform={`translate(1360 480) scale(${springPop(f, t2)})`}><SmallCrown x={0} y={0} s={3.2} /><text y={150} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill="#fff">EMPEROR · 1804</text></g>
        </Layer>
      </CameraRig>
    </>
  );
};
const CivilCode: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b06 = s.id === 's07b06';
  const at = b06 ? wordAt(s, 'Civil') - 18 : 99999;
  const drop = gravityDrop(f, at, { h: 600, g: 1.6, e: 0.3 });
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, shakes: b06 ? [{ at: at + Math.round(Math.sqrt(1200 / 1.6)), amp: 9, len: 8 }] : [] }}>
        <InsertBg />
        <Layer depth={1}>
          {!b06 && ['LAWS', 'PREFECTS', 'LYCÉES'].map((e, i) => { const k = springPop(f, 6 + i * 6); return k > 0 ? <g key={i} transform={`translate(${560 + i * 400} 480) scale(${k})`}><rect x={-150} y={-110} width={300} height={220} rx={16} fill={['#2E4A9A', STATE, '#2E6B4A'][i]} stroke={OL} strokeWidth={6} /><text y={16} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill="#fff">{e}</text></g> : null; })}
          {b06 && f >= at && <g transform={`translate(960 ${740 + drop.y}) scale(${drop.sx} ${drop.sy})`}><rect x={-260} y={-380} width={520} height={380} rx={14} fill="#2E4A9A" stroke={OL} strokeWidth={8} /><rect x={-250} y={-370} width={30} height={360} fill="#1E2E5A" /><text y={-230} textAnchor="middle" fontFamily="TagBold" fontSize={66} fill={GOLD}>CODE CIVIL</text><text y={-150} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill="#F4ECD8">1804</text></g>}
        </Layer>
      </CameraRig>
      {b06 && <Label text="still the base of French law" x={960} y={140} at={wordAt(s, 'still')} size={54} color="#FFD84A" />}
      {!b06 && <Label text="built to last" x={960} y={180} at={wordAt(s, 'built')} size={60} color="#fff" />}
    </>
  );
};
/** France with a prefect standing in each region, all wired to Paris. */
export const PrefectMap: React.FC<{ at?: number; wire?: number; dim?: boolean }> = ({ at = 6, wire = 1, dim }) => {
  const f = useCurrentFrame();
  const P = mapXY('Paris');
  const spots = ['Lille', 'Rennes', 'Nantes', 'Bordeaux', 'Toulouse', 'Marseille', 'Lyon', 'Strasbourg', 'Limoges', 'Orléans'];
  return (
    <>
      <FranceMap x={330} y={60} s={0.86} fill={dim ? '#C9C2B0' : '#E8DCC0'} pins={[{ city: 'Paris', at: 0, color: STATE }]} />
      {spots.map((c, i) => { const [x, y] = mapXY(c); const k = springPop(f, at + i * 3); return k > 0 ? <g key={c}>
        <path d={`M${P[0]} ${P[1]} L${x} ${y}`} stroke={STATE} strokeWidth={4} strokeDasharray="10 8" opacity={0.7 * wire} />
        <g transform={`translate(${x} ${y + 30}) scale(${k * 0.55})`}><Chibi x={0} y={0} s={1} {...PREFECT} pose="hold" expr="calm" talking={[]} seed={'pf' + i} /></g>
      </g> : null; })}
    </>
  );
};
const Prefects: React.FC<SP> = ({ s }) => {
  const idx = ['s07b07', 's07b08', 's07b09', 's07b10'].indexOf(s.id);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}><PrefectMap at={idx === 0 ? wordAt(s, 'prefects,') : -99} /></Layer>
      </CameraRig>
      {idx === 0 && <Label text="the prefects · 1800" x={1450} y={300} at={wordAt(s, 'prefects,')} size={54} color="#FFD84A" />}
      {idx >= 2 && <Pinned text="PREFECTS" left={1450} top={420} at={idx === 2 ? wordAt(s, 'prefects.') - 4 : undefined} />}
    </>
  );
};
const Height: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s07b11', 's07b12', 's07b13', 's07b14'].indexOf(s.id);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          {idx <= 1 && <>
            <rect x={760} y={180} width={60} height={600} fill="#F4ECD8" stroke={OL} strokeWidth={5} />
            {[...Array(13)].map((_, i) => <path key={i} d={`M760 ${780 - i * 46} h${i % 2 ? 24 : 44}`} stroke={OL} strokeWidth={4} />)}
            <Chibi x={1000} y={780} s={1.6} {...NAPOLEON} pose="cross" expr={idx === 0 ? 'angry' : 'proud'} talking={[]} seed="nhgt" />
            {idx === 1 && <><path d={`M820 ${780 - 0.82 * 600} H1200`} stroke="#FFD84A" strokeWidth={6} strokeDasharray="14 8" opacity={springPop(f, wordAt(s, 'five'))} /><text x={1220} y={780 - 0.82 * 600 + 14} fontFamily="TagBold" fontSize={46} fill="#FFD84A" opacity={springPop(f, wordAt(s, 'five'))}>~1.69 m (5′7″)</text></>}
            {idx === 0 && <text x={1300} y={420} fontFamily="TagBold" fontSize={160} fill="#F4ECD8" opacity={springPop(f, wordAt(s, 'tiny?'))}>?</text>}
          </>}
          {idx === 2 && <>
            {[['FRENCH INCH', 27.07, 0], ['ENGLISH INCH', 25.4, 1]].map(([lab, mm, i]: any) => <g key={i} transform={`translate(360 ${330 + i * 220})`}>
              <rect x={0} y={0} width={mm * 40 * springPop(f, 6 + i * 8)} height={80} fill={i ? '#C0392B' : '#2E4A9A'} stroke={OL} strokeWidth={5} />
              <text x={0} y={-16} fontFamily="TagBold" fontSize={40} fill="#fff">{lab} = {mm} mm</text>
            </g>)}
            <text x={960} y={720} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#FFD84A" opacity={springPop(f, wordAt(s, 'different'))}>"5 feet 2" in French units ≈ 5′7″ in English</text>
          </>}
          {idx === 3 && <g transform="translate(960 470) rotate(-2)">
            <rect x={-360} y={-300} width={720} height={560} fill="#F4ECD8" stroke={OL} strokeWidth={8} />
            <text y={-240} textAnchor="middle" fontFamily="Hand" fontSize={46} fill="#5A3A22">"Little Boney"</text>
            <g transform="translate(0 200)"><Chibi x={0} y={0} s={0.7} {...NAPOLEON} pose="hipAngry" expr="angry" talking={[]} seed="boney" /></g>
            <g transform="translate(220 200)"><Chibi x={0} y={0} s={1.5} outfit={{ top: '#C0392B', bottom: '#F4F7FA' }} hat="hair" hair="#C9A66B" pose="point" expr="grin" talking={[]} seed="john" flip /></g>
            <text y={240} textAnchor="middle" fontFamily="Tag" fontSize={30} fill="#5A3A22">British cartoon, c. 1803</text>
          </g>}
        </Layer>
      </CameraRig>
    </>
  );
};
const Waterloo: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const back = wordAt(s, 'Bourbon');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#9AA6AE" />{[...Array(6)].map((_, i) => <circle key={i} cx={200 + i * 320} cy={420 + (i % 2) * 40} r={110} fill="#B8BCC0" opacity={0.7} />)}</Layer>
        <Layer depth={1}>
          <rect x={-200} y={720} width={2400} height={600} fill="#6E7A4A" stroke={OL} strokeWidth={4} />
          {[...Array(10)].map((_, i) => <g key={i} filter="url(#sil)"><Chibi x={80 + i * 190} y={880} s={0.75} {...(i < 5 ? GRENADIER : { ...GRENADIER, outfit: { top: '#C0392B', bottom: '#F4F7FA' } })} pose="hold" expr="normal" talking={[]} seed={'wl' + i} flip={i >= 5} /></g>)}
          {f >= back && <g transform={`translate(1500 330) scale(${springPop(f, back)})`}><rect x={-140} y={-110} width={280} height={220} fill="#F4F7FA" stroke={OL} strokeWidth={6} /><FleurDeLis x={0} y={10} s={1.6} fill={GOLD} /></g>}
        </Layer>
      </CameraRig>
      <Label text="Waterloo · 18 June 1815" x={760} y={150} at={wordAt(s, 'Waterloo')} size={54} color="#1A1410" />
    </>
  );
};
/** A strip of regime cards: 1815 1830 1848 1852 1870 1871. `upto` controls how many have flipped. */
const REGIMES = [['1815', 'KINGS BACK', GOLD], ['1830', 'NEW KING', '#B88A2E'], ['1848', 'REPUBLIC', PEOPLE], ['1852', 'EMPEROR', '#2E4A9A'], ['1870', 'REPUBLIC', PEOPLE], ['1871', 'COMMUNE', '#8A1E1E']] as const;
const Schedule = hostShot((s) => [{ at: 0, arm: s.id === 's07b16' ? 'present' : 'finger', expr: s.id === 's07b16' ? 'smile' : 'grin' }], {
  props: (s) => {
    const f = useCurrentFrame();
    const t0 = s.id === 's07b17' ? wordAt(s, 'schedule.') - 10 : 99999;
    return <g>{REGIMES.map(([y, lab, c], i) => { const k = interpolate(f, [t0 + i * 3, t0 + i * 3 + 8], [0, 1]); const sy = Math.abs(Math.cos(k * Math.PI)); const face = k > 0.5; return <g key={y} transform={`translate(${200 + i * 160} 720) scale(1 ${Math.max(0.05, sy)})`}><rect x={-70} y={-90} width={140} height={180} rx={12} fill={face ? c : '#5A5A64'} stroke={OL} strokeWidth={5} />{face && <><text y={-20} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill="#fff">{y}</text><text y={40} textAnchor="middle" fontFamily="TagBold" fontSize={20} fill="#fff">{lab}</text></>}</g>; })}</g>;
  },
});
const July1830: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b19 = s.id === 's07b19';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <ParisStreet />
        <Layer depth={1.1}>
          <path d="M300 900 L420 760 L620 740 L760 790 L900 720 L1080 760 L1200 900 Z" fill="#7A6A5A" stroke={OL} strokeWidth={6} />
          {[...Array(9)].map((_, i) => <rect key={i} x={360 + i * 90} y={800 - (i % 3) * 20} width={70} height={40} fill="#8A7A6A" stroke={OL} strokeWidth={3} />)}
          <path d="M760 760 V470" stroke="#5A3A22" strokeWidth={10} /><g transform={`translate(766 470) skewY(${Math.sin(f / 8) * 3})`}>{TRICOLORE.map((c, i) => <rect key={i} x={i * 60} y={0} width={60} height={120} fill={c} stroke={OL} strokeWidth={3} />)}</g>
          {[...Array(5)].map((_, i) => <Chibi key={i} x={420 + i * 170} y={720} s={0.8} {...SANS(['#C0392B', '#2E4A9A', '#3A3A48'][i % 3])} pose={i % 2 ? 'raise' : 'fist'} expr="determined" talking={[]} seed={'bk' + i} />)}
          {b19 && <g transform={`translate(1500 470) rotate(-3) scale(${springPop(f, 4)})`}><rect x={-200} y={-220} width={400} height={440} fill="#F4F2EC" stroke={OL} strokeWidth={6} /><text y={-160} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#1A1410">LE JOURNAL</text>{[...Array(6)].map((_, i) => <rect key={i} x={-170} y={-120 + i * 50} width={340} height={20} fill="#1A1410" opacity={0.75} />)}</g>}
        </Layer>
      </CameraRig>
      {!b19 && <Label text="July 1830 · Charles X falls" x={960} y={140} at={wordAt(s, 'July')} size={54} color="#1A1410" />}
      {b19 && <DropHtml at={wordAt(s, 'muzzle')} left={1500} top={470} h={300}><div style={{ fontFamily: 'TagBold', fontSize: 60, color: '#B3261E', border: '7px solid #B3261E', padding: '4px 22px', borderRadius: 10, background: 'rgba(255,255,255,0.9)', transform: 'rotate(-12deg)' }}>CENSORED</div></DropHtml>}
    </>
  );
};
const MrSmith: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b21 = s.id === 's07b21';
  const vote = b21 ? wordAt(s, 'elected') : 99999;
  const walk = interpolate(f, [0, b21 ? vote - 10 : d], b21 ? [900, 1500] : [500, 900]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        {f < vote ? <><Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#9EB6C8" /><path d="M1200 620 Q1500 560 2200 600 V1300 H1200 Z" fill="#5A7A9A" /></Layer><Layer depth={1}><rect x={-200} y={760} width={1500} height={600} fill="#C9B48A" stroke={OL} strokeWidth={4} />{b21 && <path d="M1300 760 L1500 760" stroke="#7A4E2B" strokeWidth={16} />}</Layer>
          <Layer depth={1.1}><Chibi x={walk} y={900} s={1.25} {...LP} item="lamp" legs="walk" pose="idle" expr="shock" talking={[]} seed="lp" />{b21 && <g transform={`translate(${walk} 520) scale(${springPop(f, wordAt(s, 'Smith.') - 4)})`}><rect x={-150} y={-46} width={300} height={80} rx={10} fill="#fff" stroke={OL} strokeWidth={5} /><text y={10} textAnchor="middle" fontFamily="Hand" fontSize={46} fill="#1A1410">"Mr Smith"</text></g>}</Layer></>
          : <><InsertBg /><Layer depth={1}><g transform="translate(760 560)"><rect x={-170} y={-120} width={340} height={260} rx={12} fill="#6A4A2A" stroke={OL} strokeWidth={6} /><rect x={-80} y={-128} width={160} height={14} fill={OL} /><text y={40} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill="#F4ECD8">1848 VOTE</text></g>
            <g transform="translate(1260 900)"><Chibi x={0} y={0} s={1.3} {...{ outfit: { top: '#1E1E28', bottom: '#1E1E28', sash: '#C0392B' }, hat: 'hair', hair: '#3A2416', mustache: true }} pose="present" expr="happy" talking={[]} seed="lnb" /></g>
            <text x={1260} y={360} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff" opacity={springPop(f, wordAt(s, 'nephew'))}>NAPOLEON'S NEPHEW</text></Layer></>}
      </CameraRig>
      {!b21 && <Label text="1848" x={960} y={140} at={wordAt(s, '1848')} size={60} color="#1A1410" />}
    </>
  );
};
const NapIII: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b23 = s.id === 's07b23';
  const tear = b23 ? wordAt(s, 'coup') : 99999;
  const t = Math.max(0, f - tear);
  const N3 = { outfit: { top: '#2E4A9A', bottom: '#F4F7FA', trim: GOLD }, hat: 'hair', hair: '#3A2416', mustache: true, beard: true, beardColor: '#3A2416' };
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          {[-1, 1].map((sd) => <g key={sd} transform={`translate(${760 + sd * t * 3} ${300 + 0.6 * t * t * (t > 0 ? 1 : 0) * 0.5}) rotate(${sd * Math.min(60, t * 3)})`}><rect x={sd < 0 ? -200 : 0} y={-170} width={200} height={340} fill="#F4ECD8" stroke={OL} strokeWidth={5} /><text x={sd < 0 ? -100 : 100} y={-80} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#1A1410">{sd < 0 ? 'ONE' : 'TERM'}</text><text x={sd < 0 ? -100 : 100} y={-30} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill="#5A3A22">{sd < 0 ? 'CONSTI-' : 'TUTION'}</text></g>)}
          <Chibi x={1340} y={900} s={1.35} {...N3} pose={b23 && f > tear ? 'pull' : 'cross'} expr={b23 ? 'grin' : 'normal'} talking={[]} seed="n3" flip />
          {b23 && <g transform={`translate(1340 ${360 + Math.min(0, (f - wordAt(s, 'Emperor')) * 0)})`} opacity={springPop(f, wordAt(s, 'Emperor'))}><SmallCrown x={0} y={0} s={1.6} /></g>}
        </Layer>
      </CameraRig>
      {b23 && <Label text="Napoleon III · 1852" x={1340} y={200} at={wordAt(s, 'Napoleon')} size={54} color="#FFD84A" />}
    </>
  );
};
/** Haussmann: twisty medieval lanes straighten into a wide boulevard. */
const Boulevards: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b25 = s.id === 's07b25';
  const k = b25 ? 1 : interpolate(f, [wordAt(s, 'boulevards,') - 10, wordAt(s, 'boulevards,') + 20], [0, 1], Easing.inOut);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#CFC6B0" /></Layer>
        <Layer depth={1}>
          {[...Array(12)].map((_, i) => { const row = Math.floor(i / 4), col = i % 4; const jx = (random('bx' + i) - 0.5) * 120 * (1 - k), jy = (random('by' + i) - 0.5) * 80 * (1 - k); const left = col < 2; const bx = (left ? 140 + col * 280 - k * 60 : 1140 + (col - 2) * 280 + k * 60) + jx; return <rect key={i} x={bx} y={140 + row * 230 + jy} width={240} height={190} fill="#E8DCC0" stroke={OL} strokeWidth={5} />; })}
          <rect x={720 - 360 * k * 0 + (1 - k) * 160} y={120} width={480 - (1 - k) * 320} height={720} fill="#B8AE98" opacity={0.9} />
          {b25 && <>{[...Array(5)].map((_, i) => <Chibi key={i} x={860 + (i % 2) * 120} y={300 + i * 110 + (f % 40)} s={0.5} {...GRENADIER} legs="march" pose="hold" expr="determined" talking={[]} seed={'bv' + i} />)}<g opacity={springPop(f, wordAt(s, 'barricades'))}><path d="M760 760 h400" stroke="#8A7A6A" strokeWidth={30} strokeDasharray="60 160" /><text x={960} y={720} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#B3261E">too wide to block</text></g></>}
        </Layer>
      </CameraRig>
      {!b25 && <Label text="Haussmann's Paris · 1850s–60s" x={960} y={80} at={wordAt(s, 'rebuilt')} size={50} color="#1A1410" />}
    </>
  );
};
const DidntSave = hostShot((s) => [{ at: 0, arm: 'shrug', expr: 'normal' }]);
const Sedan: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b28 = s.id === 's07b28';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        {b28 ? <ParisStreet /> : <><Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#A8B0B4" /></Layer><Layer depth={1}><rect x={-200} y={760} width={2400} height={600} fill="#6E7A4A" stroke={OL} strokeWidth={4} /></Layer></>}
        <Layer depth={1.1}>
          {!b28 && <><Chibi x={760} y={920} s={1.3} {...{ outfit: { top: '#2E4A9A', bottom: '#C0392B', trim: GOLD }, hat: 'hair', hair: '#3A2416', mustache: true, beard: true, beardColor: '#3A2416' }} pose="shrug" expr="sad" talking={[]} seed="n3s" />
            <g transform={`translate(930 920)`}><path d="M0 0 V-420" stroke="#7A4E2B" strokeWidth={10} /><path d={`M4 -420 Q60 ${-440 + Math.sin(f / 7) * 10} 120 -420 L120 -320 Q60 ${-340 + Math.sin(f / 7) * 10} 4 -320 Z`} fill="#F4F7FA" stroke={OL} strokeWidth={4} /></g>
            {[0, 1, 2].map((i) => <Chibi key={i} x={1220 + i * 170} y={920} s={1.1} {...PRUSSIAN} pose="hold" expr="determined" talking={[]} seed={'pr' + i} flip />)}</>}
          {b28 && [...Array(8)].map((_, i) => <Chibi key={i} x={200 + i * 220} y={930} s={0.95} {...SANS(['#C0392B', '#2E4A9A', '#B85A30'][i % 3])} pose={i % 2 ? 'cheer' : 'raise'} expr="happy" talking={[]} seed={'tr3' + i} />)}
        </Layer>
      </CameraRig>
      {!b28 && <Label text="Sedan · September 1870" x={960} y={140} at={wordAt(s, 'Sedan,')} size={54} color="#1A1410" />}
      {b28 && <DropHtml at={wordAt(s, 'Third')} left={960} top={200} h={300}><div style={{ background: '#F4F7FA', border: '6px solid #1A1410', padding: '8px 28px', fontFamily: 'TagBold', fontSize: 58, color: '#2E4A9A' }}>THIRD REPUBLIC</div></DropHtml>}
    </>
  );
};
const Siege: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const zoo = wordAt(s, 'zoo,');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          {f < zoo ? <>
            <circle cx={960} cy={480} r={220} fill="#E8DCC0" stroke={OL} strokeWidth={8} /><text x={960} y={498} textAnchor="middle" fontFamily="TagBold" fontSize={60} fill="#1A1410">PARIS</text>
            {[...Array(12)].map((_, i) => { const a = (i / 12) * Math.PI * 2; const k = springPop(f, 4 + i * 2); return k > 0 ? <g key={i} transform={`translate(${960 + Math.cos(a) * 330} ${480 + Math.sin(a) * 300}) scale(${k * 0.5})`}><Chibi x={0} y={60} s={1} {...PRUSSIAN} pose="hold" expr="determined" talking={[]} seed={'sg' + i} flip={Math.cos(a) > 0} /></g> : null; })}
            <Calendar x={1600} y={300} s={0.5} month="4 MONTHS" day="⌛" color={STATE} />
          </> : <>
            <Elephant x={700} y={820} s={1.0} howdah={false} />
            <g transform={`translate(1380 470) rotate(3) scale(${springPop(f, zoo + 4)})`}><rect x={-230} y={-280} width={460} height={540} fill="#F4F2EC" stroke={OL} strokeWidth={6} /><text y={-200} textAnchor="middle" fontFamily="Hand" fontSize={52} fill="#1A1410">Menu</text><text y={-140} textAnchor="middle" fontFamily="Tag" fontSize={28} fill="#5A3A22">Christmas 1870</text>{['Consommé d\'éléphant', 'Civet de kangourou', 'Chat… flanqué de rats'].map((t, i) => <text key={i} y={-50 + i * 80} textAnchor="middle" fontFamily="Hand" fontSize={34} fill="#1A1410">{t}</text>)}</g>
          </>}
        </Layer>
      </CameraRig>
      {f >= zoo && <Label text="a real menu, Café Voisin" x={1380} y={140} at={zoo + 10} size={44} color="#FFD84A" />}
    </>
  );
};
const Commune: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s07b30', 's07b31', 's07b32'].indexOf(s.id);
  const days = idx === 2 ? Math.round(interpolate(f, [4, 34], [1, 72], Easing.out)) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <TownHall label="HÔTEL DE VILLE" />
        <Layer depth={1.1}>
          <path d="M960 330 V120" stroke="#5A3A22" strokeWidth={10} />
          <g transform={`translate(966 120) skewY(${Math.sin(f / 8) * 3})`}><rect x={0} y={0} width={180} height={110} fill="#C0392B" stroke={OL} strokeWidth={4} opacity={idx >= 1 ? springPop(f, idx === 1 ? wordAt(s, 'Commune.') - 6 : -99) : 0} /></g>
          {[...Array(8)].map((_, i) => <Chibi key={i} x={200 + i * 220} y={940} s={0.9} {...SANS(['#C0392B', '#8A1E1E', '#3A3A48'][i % 3])} pose={idx >= 1 ? 'raise' : 'fist'} expr="determined" talking={[]} seed={'cm' + i} />)}
        </Layer>
      </CameraRig>
      {idx === 0 && <Label text="March 1871" x={960} y={60} at={wordAt(s, 'March')} size={50} color="#1A1410" />}
      {idx === 2 && <div style={{ position: 'absolute', right: 60, top: 60, background: 'rgba(26,20,16,0.85)', border: '4px solid #FFD84A', borderRadius: 12, padding: '8px 24px', fontFamily: 'TagBold', fontSize: 56, color: '#FFD84A' }}>DAY {days}</div>}
    </>
  );
};
const BloodyWeek: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b34 = s.id === 's07b34';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.03, zoomTo: 1.0 }}>
        <ParisStreet night />
        <Layer depth={1.05}>{[...Array(8)].map((_, i) => { const t = (f + i * 26) % 200; return <circle key={i} cx={200 + i * 230 + t * 0.4} cy={500 - t * 1.4} r={50 + t * 0.6} fill="#4A4A54" opacity={0.6 * (1 - t / 200)} />; })}</Layer>
      </CameraRig>
      {!b34 && <Label text="'Bloody Week' · May 1871" x={960} y={140} at={wordAt(s, 'Bloody')} size={54} color="#B8B8C0" />}
      {b34 && <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,16,0.6)', opacity: springPop(f, wordAt(s, 'killing') - 6) > 0 ? 1 : 0 }} />}
      {b34 && <div style={{ position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontFamily: 'TagBold', fontSize: 110, color: '#E8E2D8', opacity: springPop(f, wordAt(s, 'killing')) }}>10,000 – 20,000</div>}
      {b34 && <div style={{ position: 'absolute', left: 0, right: 0, top: 500, textAlign: 'center', fontFamily: 'TagBold', fontSize: 40, color: '#B8B8C0', opacity: springPop(f, wordAt(s, 'killing') + 10) }}>killed · estimates vary</div>}
    </>
  );
};
const PalaceFlames: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b36 = s.id === 's07b36';
  const mix = b36 ? interpolate(f, [wordAt(s, 'palace') - 6, wordAt(s, 'palace') + 18], [1, 0], Easing.inOut) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05, focus: [960, 500] }}>
        <Tuileries night smoke />
        <Layer depth={0.8}>{[...Array(9)].map((_, i) => <Flame key={i} x={-20 + i * 230} y={420 + (i % 2) * 60} s={1.6} seed={'pf' + i} />)}</Layer>
      </CameraRig>
      {mix > 0 && <div style={{ position: 'absolute', inset: 0, opacity: mix }}><svg width={1920} height={1080}><rect width={1920} height={1080} fill="#151B2B" /></svg></div>}
      {mix > 0 && <svg style={{ position: 'absolute', inset: 0, opacity: mix }} width={1920} height={1080}><g><Carriage x={interpolate(f, [0, d], [600, 760])} y={860} s={0.9} lit={false} /></g><text x={960} y={160} textAnchor="middle" fontFamily="Hand" fontSize={54} fill="#F4ECD8">1791</text></svg>}
      {!b36 && <Label text="The Tuileries · May 1871" x={960} y={140} at={wordAt(s, 'Tuileries')} size={54} color="#fff" />}
    </>
  );
};
const RegimeTally: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b38 = s.id === 's07b38';
  const groups = [
    { lab: 'EMPIRES', n: 2, c: '#2E4A9A', at: b38 ? -99 : wordAt(s, 'empires,') },
    { lab: 'REPUBLICS', n: 2, c: PEOPLE, at: b38 ? wordAt(s, 'republics') : 99999 },
    { lab: 'KINDS OF MONARCHY', n: 3, c: GOLD, at: b38 ? wordAt(s, 'monarchy.') : 99999 },
  ];
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <InsertBg />
      <Layer depth={1}>
        <text x={960} y={160} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill="#F4ECD8">1789 → 1871</text>
        {groups.map((g, gi) => <g key={gi} transform={`translate(${380 + gi * 580} 480)`}>
          {[...Array(g.n)].map((_, i) => { const k = springPop(f, g.at + i * 4); if (k <= 0) return <rect key={i} x={(i - (g.n - 1) / 2) * 140 - 60} y={-90} width={120} height={180} rx={12} fill="none" stroke="#F4ECD8" strokeWidth={4} strokeDasharray="14 10" opacity={0.35} />; return k > 0 ? <g key={i} transform={`translate(${(i - (g.n - 1) / 2) * 140} 0) scale(${k})`}><rect x={-60} y={-90} width={120} height={180} rx={12} fill={g.c} stroke={OL} strokeWidth={5} />{g.c === GOLD ? <SmallCrown x={0} y={20} s={1} /> : g.c === PEOPLE ? <g><path d="M-40 20 L40 20 M-36 -20 V20 M-12 -20 V20 M12 -20 V20 M36 -20 V20 M-44 -20 L0 -46 L44 -20 Z" stroke="#fff" strokeWidth={6} fill="none" strokeLinejoin="round" /></g> : <g><path d="M0 -40 L10 -10 L44 -26 L22 6 L44 30 L0 18 L-44 30 L-22 6 L-44 -26 L-10 -10 Z" fill={GOLD} stroke={OL} strokeWidth={3} /></g>}</g> : null; })}
          <text y={160} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill="#fff" opacity={springPop(f, g.at)}>{g.n} {g.lab}</text>
        </g>)}
      </Layer>
    </CameraRig>
  );
};
const NotDone = hostShot((s) => [{ at: 0, arm: s.id === 's07b39' ? 'finger' : 'idle', expr: s.id === 's07b39' ? 'normal' : 'sad' }], {
  props: (s) => s.id === 's07b40' ? <PopProp at={wordAt(s, 'seventy')} x={1040} y={640}><g><rect x={-170} y={-60} width={340} height={120} rx={14} fill="#3A3A48" stroke={OL} strokeWidth={6} /><text y={18} textAnchor="middle" fontFamily="TagBold" fontSize={52} fill="#F4ECD8">1871 → 1945</text></g></PopProp> : null,
});

export const SHOTS_06: ShotMap = {
  napoleon_host: NapoleonHost, brumaire: Brumaire, coronation: Coronation, full_circle: FullCircle, civil_code: CivilCode,
  prefects: Prefects, height: Height, waterloo: Waterloo, schedule: Schedule, july1830: July1830, mr_smith: MrSmith,
  nap3: NapIII, boulevards: Boulevards, didnt_save: DidntSave, sedan: Sedan, siege: Siege, commune: Commune,
  bloody_week: BloodyWeek, palace_flames: PalaceFlames, regime_tally: RegimeTally, not_done: NotDone,
};
