/** Chapter 4: The Empire That Won and Fell Behind. */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop, gravityDrop, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL, Cloud, Hills } from '@engine/scenes/Parts';
import { Taiga, LogHut, OnionChurch, Snow, SnowPine, SmokeColumn } from '@engine/scenes/Russia';
import { Sea } from '@engine/scenes/Vietnam';
import { ParisStreet, Bill } from '@engine/scenes/FranceScenes';
import { Factory } from '@engine/scenes/IndiaB3';
import { Plain } from '@engine/scenes/India';
import { hostShot, wordAt, PopProp, Drop, Rider, type ShotMap, type SP } from '@engine/kit';
import { W, dress, SKIN } from '@engine/cast/Wardrobe';
import { Bars, CoinArc } from '@engine/fx/Infographics';
import { PEASANT, PRINCE, RED, PAPER, GOLD } from './Cast';
import { idx, at, Sign, Hand, Insert, Flag, Kremlin, Person, SnowRoad } from './Kit2';

const CATHERINE = { outfit: { top: '#E8E0F0', robe: true, trim: GOLD, belt: '#7FB2E5', cape: '#B3261E' }, hat: 'queen', hatColor: '#F4F7FA', skin: SKIN.fair };
const NAPOLEON = W.GENERAL_1800;
const GRENADIER = W.GRENADIER;
const RUS_SOLDIER = { outfit: { top: '#2E5A3A', bottom: '#F4F4F0', sash: '#F4F7FA', belt: '#B3261E' }, hat: 'shako', hatColor: '#1E1E28', item: 'musket', skin: SKIN.light };
const RUS_GENERAL = { outfit: { top: '#2E5A3A', bottom: '#F4F4F0', trim: GOLD }, hat: 'bicorne', hatColor: '#1E1E28', skin: SKIN.light, hair: '#E8E4DA' };

// ---------------------------------------------------------------- 1762 coup
const Coup = hostShot((s) => [{ at: 0, arm: 'present', expr: 'smile' }, { at: at(s, 'seized'), arm: 'finger', expr: 'grin' }], {
  props: (s) => {
    const f = useCurrentFrame();
    const t = at(s, 'seized', 30);
    const x = interpolate(f, [t - 4, t + 12], [1180, 1000], Easing.out);
    return <g>
      <PopProp at={4} x={1040} y={720}><Chibi x={0} y={0} s={0.9} {...CATHERINE} hat={f >= t + 6 ? 'crown' : 'queen'} hatColor={f >= t + 6 ? GOLD : '#F4F7FA'} pose={f >= t ? 'raise' : 'idle'} expr="determined" talking={[]} seed="cg" /></PopProp>
      {f < t + 6 && <g transform={`translate(${x} 380)`}><path d="M-40 0 L-50 -50 L-20 -26 L0 -60 L20 -26 L50 -50 L40 0 Z" fill={GOLD} stroke={OL} strokeWidth={5} /></g>}
    </g>;
  },
});
const CatherineShot: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.06, focus: [960, 600] }}>
      <Kremlin y={520} winter />
      <Layer depth={1}>
        <Chibi x={960} y={960} s={1.35} {...CATHERINE} hat="crown" hatColor={GOLD} pose="raise" expr="happy" talking={[]} seed="cat" />
        {[0, 1, 2, 3].map((i) => <Chibi key={i} x={i < 2 ? 400 + i * 170 : 1350 + (i - 2) * 170} y={960} s={0.85} {...RUS_SOLDIER} flip={i >= 2} pose="cheer" expr="happy" talking={[]} seed={'cs' + i} />)}
      </Layer>
      <Layer depth={1.1}><Snow density={20} /></Layer>
    </CameraRig>
    <Label text="Catherine II, &quot;the Great&quot; (born in Stettin, Prussia)" x={960} y={110} at={at(s, 'Catherine')} size={44} />
  </>
);

// ---------------------------------------------------------------- Alaska sold, 1867
const Sale: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b9 = s.id === 's05b09';
  const seward = dress(W.SUIT('#2A2E3A', '#E8E4DA'), { item: 'sack' });
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: b9 ? 1.1 : 1.04, focus: [960, 620] }}>
        <Taiga winter ground={760} />
        <Layer depth={1}>
          <Chibi x={620} y={930} s={1.05} {...dress(W.SUIT('#2E4A3A', '#5A3A22'), { beard: true, beardColor: '#5A3A22' })} pose="present" expr="grin" talking={[]} seed="stoeckl" />
          <Chibi x={1300} y={930} s={1.05} {...seward} flip pose={b9 ? 'cheer' : 'present'} expr={b9 ? 'grin' : 'happy'} talking={[]} seed="seward" />
          {!b9 && <CoinArc from={[1240, 780]} to={[700, 780]} start={at(s, 'million') - 8} every={4} n={10} c="#2E8B57" sym="$" />}
          <g transform="translate(960 620)"><path d="M0 0 V-160" stroke="#6E4A2A" strokeWidth={10} /><rect x={-150} y={-280} width={300} height={130} rx={12} fill={PAPER} stroke={OL} strokeWidth={6} /><text y={-232} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill={RED}>ALASKA</text><text y={-186} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill="#1A1410">{b9 ? '≈ 2¢ / acre' : 'SOLD $7.2M'}</text></g>
        </Layer>
        <Layer depth={1.1}><Snow density={20} /></Layer>
      </CameraRig>
      <Label text="1867 · Russia → United States" x={960} y={170} at={6} size={48} />
    </>
  );
};

// ---------------------------------------------------------------- Napoleon, 1812
const NAP = ['s05b10', 's05b11', 's05b12'];
const NapoleonShot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const k = idx(s, NAP);
  const x0 = k === 0 ? interpolate(f, [0, d], [-600, 300]) : 300;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Plain tents={false} />
        <Layer depth={0.7}>{k === 0 && [...Array(18)].map((_, i) => <g key={i} filter="url(#sil)" opacity={0.5}><Chibi x={x0 - 400 + (i % 9) * 120} y={780 + Math.floor(i / 9) * 30} s={0.5} {...GRENADIER} legs="march" pose="hold" expr="normal" talking={[]} seed={'gb' + i} delay={i} /></g>)}</Layer>
        <Layer depth={1}>
          {[...Array(5)].map((_, i) => <Chibi key={i} x={x0 + i * 130} y={940} s={0.85} {...GRENADIER} legs={k === 0 ? 'march' : 'stand'} pose="hold" expr="determined" talking={[]} seed={'gr' + i} delay={i * 2} />)}
          <Chibi x={x0 + 760} y={940} s={1.1} {...NAPOLEON} legs={k === 0 ? 'march' : 'stand'} pose={k === 1 ? 'point' : k === 2 ? 'hipAngry' : 'hold'} expr={k === 2 ? 'angry' : 'determined'} talking={k === 1 ? [[4, 60]] : []} seed="nap" />
          {k === 2 && <Chibi x={1560} y={940} s={1.05} {...RUS_GENERAL} flip pose="shrug" expr="calm" talking={[]} seed="kut" />}
          {k === 1 && <g transform="translate(1440 520)" opacity={springPop(f, at(s, 'battle') - 6)}><rect x={-230} y={-90} width={460} height={180} rx={20} fill="#fff" stroke={OL} strokeWidth={6} /><text y={-10} textAnchor="middle" fontFamily="TagBold" fontSize={42} fill="#1A1410">ONE BIG BATTLE?</text><text y={44} textAnchor="middle" fontFamily="Tag" fontSize={32} fill="#5A4A3A">then peace on my terms</text></g>}
          {k === 2 && <g transform="translate(1560 520)" opacity={springPop(f, at(s, 'refused') - 2)}><rect x={-120} y={-70} width={240} height={140} rx={20} fill="#fff" stroke={OL} strokeWidth={6} /><text y={22} textAnchor="middle" fontFamily="TagBold" fontSize={70} fill={RED}>NYET</text></g>}
        </Layer>
      </CameraRig>
      {k === 0 && <Label text="La Grande Armée: ≈ 600,000 men" x={960} y={180} at={at(s, 'largest')} size={50} />}
    </>
  );
};
const Scorched: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <Plain tents={false} />
      <Layer depth={0.75}>{[0, 1, 2, 3].map((i) => <g key={i}><LogHut x={300 + i * 420} y={780} s={0.32} smoke={false} seed={'sh' + i} /><SmokeColumn x={300 + i * 420} y={700} s={0.8} at={at(s, 'burning') - 10 + i * 8} seed={'sm' + i} /></g>)}</Layer>
      <Layer depth={1}>{[...Array(6)].map((_, i) => <Chibi key={i} x={interpolate(f, [0, d], [900, 1900]) + i * 140} y={940} s={0.8} {...RUS_SOLDIER} legs="march" pose="hold" expr="determined" talking={[]} seed={'rr' + i} delay={i * 2} />)}</Layer>
    </CameraRig>
  );
};
const Moscow1812: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b16 = s.id === 's05b16';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [960, 540] }}>
        <Kremlin y={540} dark={b16} />
        {b16 && <Layer depth={0.6}>{[...Array(6)].map((_, i) => <SmokeColumn key={i} x={160 + i * 320} y={540} s={1.1} at={at(s, 'burning') - 14 + i * 5} seed={'mf' + i} />)}</Layer>}
        <Layer depth={1}><Chibi x={760} y={960} s={1.1} {...NAPOLEON} pose={b16 ? 'bothUp' : 'shrug'} expr={b16 ? 'shock' : 'normal'} talking={[]} seed="np2" /></Layer>
        {b16 && <Layer depth={1.2}><rect x={-300} y={-300} width={2600} height={1700} fill="#E8862A" opacity={interpolate(f, [at(s, 'burning'), at(s, 'burning') + 20], [0, 0.22])} /></Layer>}
      </CameraRig>
      {!b16 && <Label text="Moscow, 14 September 1812: nearly empty" x={960} y={110} at={at(s, 'Moscow')} size={48} />}
      {b16 && <Label text="about three-quarters of the city burned" x={960} y={110} at={at(s, 'burning') + 8} size={48} />}
    </>
  );
};
const Waiting: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const turn = at(s, 'turned', d - 20);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg glow={false} />
        <Layer depth={1}>
          <g transform="translate(1340 420)"><circle r={130} fill={PAPER} stroke={OL} strokeWidth={8} /><path d={`M0 0 L${Math.sin(f / 4) * 90} ${-Math.cos(f / 4) * 90}`} stroke={OL} strokeWidth={8} strokeLinecap="round" /><path d={`M0 0 L${Math.sin(f / 48) * 60} ${-Math.cos(f / 48) * 60}`} stroke={RED} strokeWidth={10} strokeLinecap="round" /></g>
          <Chibi x={interpolate(f, [turn, d], [700, 300])} y={900} s={1.3} {...NAPOLEON} flip={f >= turn} legs={f >= turn ? 'walk' : 'stand'} pose={f >= turn ? 'idle' : 'cross'} expr={f >= turn ? 'sad' : 'normal'} talking={[]} seed="np3" />
        </Layer>
      </CameraRig>
      <Label text="35 days in Moscow, no reply from the Tsar" x={960} y={180} at={at(s, 'surrender')} size={46} />
    </>
  );
};
const Retreat: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <SnowRoad />
        <Layer depth={1}>{[...Array(6)].map((_, i) => <g key={i} opacity={0.9}><Chibi x={interpolate(f, [0, d], [1500, 1100]) - i * 170} y={900 + (i % 2) * 30} s={0.75} {...GRENADIER} flip legs="walk" pose="idle" expr="sad" talking={[]} seed={'rt' + i} delay={i * 4} /></g>)}</Layer>
        <Layer depth={1.1}><Snow density={110} wind={-2} /></Layer>
      </CameraRig>
      <Label text="the snow came late: November" x={960} y={180} at={at(s, 'winter')} size={50} />
    </>
  );
};
const Causes: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b20 = s.id === 's05b20';
  const items = [['DISTANCE', 'distance'], ['HUNGER', 'hunger'], ['DISEASE', 'disease'], ['RUSSIAN ATTACKS', 'attacks']];
  const alive = b20 ? interpolate(f, [at(s, 'fraction') - 10, at(s, 'fraction') + 20], [40, 4]) : 40;
  return (
    <Insert>
      {!b20 && items.map(([t, w], i) => <Sign key={t} t={at(s, w) - 3} x={560 + (i % 2) * 800} y={330 + Math.floor(i / 2) * 200} text={t} size={44} rot={[-3, 2, 2, -2][i]} />)}
      {!b20 && <Sign t={6} x={960} y={720} text="WINTER" size={36} bg="#C8D8E8" sub="came late, made it worse" />}
      {b20 && <g>
        <text x={960} y={240} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill={PAPER}>Grande Armée (each figure ≈ 15,000 men)</text>
        {[...Array(40)].map((_, i) => <Person key={i} x={420 + (i % 10) * 120} y={420 + Math.floor(i / 10) * 120} s={0.9} c={i < alive ? '#C8D8E8' : '#4A4A50'} o={i < alive ? 1 : 0.45} />)}
        <text x={960} y={870} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#FFD84A">only a small fraction returned</text>
      </g>}
    </Insert>
  );
};
const Paris1814: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <ParisStreet />
        <Layer depth={1}>{[...Array(7)].map((_, i) => <Chibi key={i} x={interpolate(f, [0, d], [-300, 500]) + i * 160} y={950} s={0.85} {...RUS_SOLDIER} legs="march" pose="hold" expr="happy" talking={[]} seed={'rp' + i} delay={i * 2} />)}<Rider x={interpolate(f, [0, d], [-300, 500]) + 1250} y={960} s={0.8} gait="walk" rider={dress(RUS_GENERAL, { hat: 'bicorne' })} /></Layer>
      </CameraRig>
      <Label text="Paris, 31 March 1814" x={960} y={95} at={at(s, 'Paris')} size={56} />
    </>
  );
};
const Twist = hostShot(() => [{ at: 0, arm: 'finger', expr: 'worried' }], {
  props: (s) => <PopProp at={at(s, 'twist') - 4} x={1050} y={480}><path d="M-80 -80 Q60 -120 60 -20 Q60 60 -40 40 Q-120 20 -60 -40 Q0 -80 20 -20" fill="none" stroke={RED} strokeWidth={16} strokeLinecap="round" /></PopProp>,
});
const Split: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b24 = s.id === 's05b24';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-300} y={-300} width={1260} height={1700} fill="url(#skyDust)" /><rect x={960} y={-300} width={1360} height={1700} fill="url(#skyDay)" /></Layer>
        <Layer depth={0.8}>
          <path d="M-300 760 H960 V1500 H-300 Z" fill="#8A8278" stroke={OL} strokeWidth={3} />
          <path d="M960 760 H2300 V1500 H960 Z" fill="#B89A5A" stroke={OL} strokeWidth={3} />
          <Factory x={420} y={760} s={0.9} />
          <path d="M-300 820 H960" stroke="#4A4A4A" strokeWidth={10} /><path d="M-300 836 H960" stroke="#4A4A4A" strokeWidth={10} />
          <g transform={`translate(${interpolate(f, [0, d], [-200, 600])} 790)`}><rect x={-120} y={-80} width={160} height={70} fill="#2A2A30" stroke={OL} strokeWidth={4} /><rect x={20} y={-120} width={50} height={110} fill="#2A2A30" stroke={OL} strokeWidth={4} /><circle cx={-80} cy={-6} r={18} fill="#5A5A5A" stroke={OL} strokeWidth={3} /><circle cx={0} cy={-6} r={18} fill="#5A5A5A" stroke={OL} strokeWidth={3} /><circle cx={40} cy={-150 - (f % 20)} r={20 + (f % 20)} fill="#9A9A9A" opacity={0.6} /></g>
          <LogHut x={1650} y={780} s={0.42} seed="sp" />
        </Layer>
        <Layer depth={1}>
          {[0, 1, 2].map((i) => <Chibi key={i} x={1150 + i * 170} y={930} s={0.85} {...PEASANT(i)} item={i === 1 ? 'hammer' : 'sack'} pose={i === 1 ? 'pull' : 'carry'} expr="sad" talking={[]} seed={'sr' + i} />)}
          <path d="M960 -300 V1500" stroke={OL} strokeWidth={8} />
        </Layer>
      </CameraRig>
      <Label text="Europe: factories & railways" x={480} y={190} at={4} size={46} />
      <Label text="Russia: serfs & ploughs" x={1440} y={190} at={b24 ? 4 : 9999} size={46} color="#FFD84A" />
    </>
  );
};
const CrimeaWar: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const Steam: React.FC<{ x: number; flag: 'fr' | 'uk' }> = ({ x, flag }) => <g transform={`translate(${x} ${760 + Math.sin(f / 9 + x) * 6})`}><path d="M-200 0 Q-180 60 0 64 Q180 60 210 -10 Z" fill="#3A3A40" stroke={OL} strokeWidth={5} /><rect x={-40} y={-120} width={50} height={120} fill="#2A2A30" stroke={OL} strokeWidth={4} /><circle cx={-15} cy={-150 - (f % 30)} r={26 + (f % 30) * 0.8} fill="#7A7A7A" opacity={0.6} /><Flag kind={flag} x={120} y={-190} s={0.35} pole={190} /></g>;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Sea horizon={560} />
        <Layer depth={1}>
          <Steam x={interpolate(f, [0, d], [1300, 1100])} flag="fr" /><Steam x={interpolate(f, [0, d], [1720, 1520])} flag="uk" />
          <g transform={`translate(400 ${780 + Math.sin(f / 10) * 4}) rotate(${interpolate(f, [at(s, 'defeat'), d], [0, 8])})`}><path d="M-160 0 Q-150 60 0 64 Q150 60 170 -10 Z" fill="#6E4A2A" stroke={OL} strokeWidth={5} /><path d="M0 0 V-240" stroke="#5E3A20" strokeWidth={9} /><path d="M-70 -210 Q0 -180 70 -210 L70 -100 Q0 -70 -70 -100 Z" fill="#E8E0D0" stroke={OL} strokeWidth={4} /><Flag kind="andrew" x={0} y={-300} s={0.3} pole={60} /></g>
        </Layer>
      </CameraRig>
      <Label text="Crimean War, 1853–56: sail vs steam" x={960} y={180} at={4} size={48} />
    </>
  );
};
const Emancipation: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const t = at(s, 'freed', 30);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05 }}>
        <Taiga winter={false} ground={760} />
        <Layer depth={1}>
          {[...Array(5)].map((_, i) => <Chibi key={i} x={420 + i * 270} y={930} s={0.95} {...PEASANT(i)} pose={f >= t + 4 ? 'cheer' : 'idle'} expr={f >= t + 4 ? 'happy' : 'sad'} talking={[]} seed={'em' + i} delay={i * 2} />)}
          {[...Array(5)].map((_, i) => { if (f < t) return <g key={i} transform={`translate(${420 + i * 270} 820)`}><ellipse rx={26} ry={14} fill="none" stroke="#5A5A64" strokeWidth={8} /></g>; const g = gravityDrop(f, t, { h: 0, g: 2.4, e: 0.3 }); return <g key={i} transform={`translate(${420 + i * 270 + (i - 2) * (f - t) * 2} ${820 + Math.min(110, 0.5 * 2.4 * (f - t) ** 2)}) rotate(${(f - t) * 9})`}><path d="M-26 0 A26 14 0 0 1 20 -8" fill="none" stroke="#5A5A64" strokeWidth={8} /></g>; })}
        </Layer>
      </CameraRig>
      <Label text="Emancipation Manifesto, 1861 · Alexander II" x={960} y={180} at={4} size={46} />
      <Label text="≈ 23 million serfs" x={960} y={260} at={at(s, 'million')} size={56} color="#FFD84A" />
    </>
  );
};
const Debt: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b28 = s.id === 's05b28';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Taiga winter={false} dusk ground={760} />
        <Layer depth={1}>
          <Chibi x={700} y={930} s={1.05} {...PEASANT(0)} pose={b28 ? 'shrug' : 'idle'} expr="sad" talking={[]} seed="db" />
          {b28 && <Bill x={1000} y={600} len={interpolate(f, [at(s, 'debt') - 6, at(s, 'debt') + 30], [0, 520], Easing.out)} text="REDEMPTION PAYMENTS · 49 YEARS" />}
        </Layer>
      </CameraRig>
      {!b28 && <Label text="freed… but the land wasn't free" x={960} y={180} at={6} size={52} />}
    </>
  );
};
const Assassination: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-300} y={-300} width={2600} height={1700} fill="url(#skyWinter)" /></Layer>
        <Layer depth={0.5}>{[...Array(7)].map((_, i) => <rect key={i} x={-100 + i * 320} y={360} width={300} height={420} fill={['#E8D8B8', '#D8C8C0', '#C8D0D8'][i % 3]} stroke={OL} strokeWidth={4} />)}<path d="M-300 780 H2300 V1500 H-300 Z" fill="#E8EEF2" stroke={OL} strokeWidth={3} /></Layer>
        <Layer depth={0.8}><SmokeColumn x={960} y={760} s={1.1} at={at(s, 'bomb') - 10} seed="as" /></Layer>
        <Layer depth={1.2}><rect x={-300} y={-300} width={2600} height={1700} fill="#0A0A14" opacity={0.3} /></Layer>
      </CameraRig>
      <Label text="St Petersburg, 13 March 1881" x={960} y={180} at={4} size={50} />
    </>
  );
};
const TrainStart: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <Taiga winter ground={760} />
      <Layer depth={1}>
        <path d="M-300 860 H2300" stroke="#4A3A2A" strokeWidth={12} /><path d="M-300 880 H2300" stroke="#4A3A2A" strokeWidth={12} />
        {[...Array(30)].map((_, i) => <rect key={i} x={-300 + i * 90} y={856} width={20} height={36} fill="#6E4A2A" />)}
        <g transform={`translate(${interpolate(f, [0, d], [-300, 1700])} 850)`}>
          {[0, 1, 2].map((c) => <g key={c} transform={`translate(${-c * 280} 0)`}><rect x={-120} y={-150} width={250} height={130} fill={c === 0 ? '#2A3A2A' : '#3E6A4A'} stroke={OL} strokeWidth={5} />{c > 0 && [...Array(3)].map((_, w) => <rect key={w} x={-100 + w * 76} y={-130} width={50} height={46} fill="#F2C230" stroke={OL} strokeWidth={3} />)}<circle cx={-70} cy={-10} r={24} fill="#3A3A3A" stroke={OL} strokeWidth={4} /><circle cx={80} cy={-10} r={24} fill="#3A3A3A" stroke={OL} strokeWidth={4} /></g>)}
          <rect x={60} y={-220} width={40} height={80} fill="#2A2A30" stroke={OL} strokeWidth={4} />
          {[0, 1, 2].map((p) => <circle key={p} cx={80 - p * 70} cy={-240 - p * 40} r={30 + p * 20} fill="#E8E8E8" opacity={0.7 - p * 0.2} />)}
        </g>
      </Layer>
      <Layer depth={1.1}><Snow density={30} /></Layer>
    </CameraRig>
  );
};
const Romanovs: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const t = at(s, 'Romanovs', 30);
  const crack = interpolate(f, [t - 4, t + 10], [0, 1]);
  return (
    <Insert>
      <g transform="translate(960 480)">
        <rect x={-260} y={-300} width={520} height={600} rx={20} fill="#8A6A2A" stroke={OL} strokeWidth={10} />
        <rect x={-220} y={-260} width={440} height={520} fill="#3A2A2A" />
        <path d="M-80 60 L-100 -60 L-40 -10 L0 -110 L40 -10 L100 -60 L80 60 Z" fill={GOLD} stroke={OL} strokeWidth={6} strokeLinejoin="round" />
        <path d={`M-200 -240 L${-200 + 140 * crack} ${-240 + 160 * crack} L${-200 + 220 * crack} ${-240 + 120 * crack} L${-200 + 420 * crack} ${-240 + 480 * crack}`} stroke="#F4ECD8" strokeWidth={6} fill="none" />
        <text y={230} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill={PAPER}>HOUSE OF ROMANOV</text>
      </g>
    </Insert>
  );
};

export const SHOTS_05: ShotMap = {
  c4_coup: Coup, c4_catherine: CatherineShot, c4_sale: Sale, c4_napoleon: NapoleonShot, c4_scorched: Scorched, c4_moscow1812: Moscow1812,
  c4_waiting: Waiting, c4_retreat: Retreat, c4_causes: Causes, c4_paris: Paris1814, c4_twist: Twist, c4_split: Split, c4_crimea: CrimeaWar,
  c4_emancipation: Emancipation, c4_debt: Debt, c4_1881: Assassination, c4_train: TrainStart, c4_romanovs: Romanovs,
};
