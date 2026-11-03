/** Chapter 2: The Moneybag and the Tsars. */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop, gravityDrop } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { Taiga, LogHut, OnionChurch, ByzDome, RiverScene, Snow, SnowPine, KhanCamp } from '@engine/scenes/Russia';
import { hostShot, wordAt, PopProp, Drop, Rider, type ShotMap, type SP } from '@engine/kit';
import { CoinArc, Calendar } from '@engine/fx/Infographics';
import { PEASANT, PRINCE, PRIEST, MONGOL, KHAN, RED, PAPER, GOLD } from './Cast';
import { idx, at, Sign, Hand, hostDim, Insert } from './Kit2';

const IVAN = PRINCE('#8A1E2E');
const COSSACK = (i = 0) => ({ outfit: { top: ['#2E4A6A', '#7A3A2A', '#4A5A3A'][i % 3], bottom: '#2A2A34', belt: GOLD }, hat: 'cap', hatColor: '#3A2A22', mustache: true, skin: '#F3D2B0', item: i % 2 ? 'musket' : 'sword' });

// ---------------------------------------------------------------- 1147
const M1147 = hostShot(() => [{ at: 0, arm: 'present', expr: 'smile' }], {
  props: (s) => <PopProp at={at(s, 'records') - 4} x={1030} y={520}><g>
    <rect x={-150} y={-180} width={300} height={360} rx={12} fill="#EADCB8" stroke={OL} strokeWidth={6} />
    {[...Array(5)].map((_, i) => <path key={i} d={`M-110 ${-120 + i * 50} h220`} stroke="#8A6A4A" strokeWidth={5} strokeLinecap="round" />)}
    <rect x={-120} y={110} width={240} height={50} rx={8} fill={RED} /><text y={147} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff">MOSCOW 1147</text>
  </g></PopProp>,
});

// ---------------------------------------------------------------- a wooden town in the forest
const WoodTown: React.FC<SP> = ({ s }) => {
  const b3 = s.id === 's03b03';
  return (
    <>
      <CameraRig move={{ zoomFrom: b3 ? 1.08 : 1, zoomTo: b3 ? 1.14 : 1.05, focus: [960, 700] }}>
        <Taiga winter={false} ground={760} />
        <Layer depth={0.85}>
          <path d="M520 800 L520 640 M1440 800 L1440 640" stroke="#6E4A2A" strokeWidth={0} />
          {[...Array(24)].map((_, i) => <path key={i} d={`M${560 + i * 36} 800 V${700 - (i % 2) * 10} l18 -26 l18 26 V800`} fill="#9A6A3A" stroke={OL} strokeWidth={3} />)}
          <LogHut x={760} y={700} s={0.36} seed="wt1" /><LogHut x={1180} y={700} s={0.34} seed="wt2" />
          <OnionChurch x={970} y={690} s={0.32} dome="#8A9AA8" />
        </Layer>
        <Layer depth={1}>
          <Chibi x={400} y={930} s={0.9} {...PEASANT(1)} legs="walk" pose="carry" item="bundle" expr="normal" talking={[]} seed="wt3" />
          <Chibi x={1560} y={930} s={0.9} {...PEASANT(3)} pose="idle" expr="calm" talking={[]} seed="wt4" />
        </Layer>
      </CameraRig>
      {!b3 && <Label text="Moscow, a small fort town" x={960} y={220} at={10} size={52} />}
    </>
  );
};

// ---------------------------------------------------------------- but its princes were clever
const Clever = hostShot((s) => [{ at: 0, arm: 'chin', expr: 'smile' }, { at: at(s, 'clever'), arm: 'finger', expr: 'grin' }], {
  props: (s) => <PopProp at={at(s, 'clever') - 2} x={1050} y={420}><g>
    <circle r={80} fill="#FFE27A" stroke={OL} strokeWidth={6} /><rect x={-34} y={70} width={68} height={50} rx={8} fill="#9A9A9A" stroke={OL} strokeWidth={5} />
    {[...Array(8)].map((_, i) => <path key={i} d={`M${Math.cos(i * 0.785) * 110} ${Math.sin(i * 0.785) * 110} L${Math.cos(i * 0.785) * 140} ${Math.sin(i * 0.785) * 140}`} stroke="#E2B13C" strokeWidth={8} strokeLinecap="round" />)}
  </g></PopProp>,
});

// ---------------------------------------------------------------- Ivan I collects tribute and pockets a share
const Kalita: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b7 = s.id === 's03b07';
  const t = at(s, 'tribute', 30);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05 }}>
        <Taiga winter={false} ground={760} />
        <Layer depth={0.8}><LogHut x={300} y={790} s={0.5} seed="ka" /><LogHut x={1700} y={790} s={0.45} seed="kb" /></Layer>
        <Layer depth={1}>
          {[0, 1, 2].map((i) => <Chibi key={i} x={360 + i * 180} y={930} s={0.9} {...PEASANT(i)} flip={false} pose={b7 ? 'idle' : [{ at: 0, pose: 'idle' }, { at: t + i * 6, pose: 'present' }]} expr="sad" talking={[]} seed={'kp' + i} />)}
          <Chibi x={960} y={930} s={1.15} {...IVAN} item="sack" pose={b7 ? [{ at: 0, pose: 'carry' }, { at: at(s, 'share') - 6, pose: 'present' }] : 'carry'} flip expr={b7 ? 'grin' : 'calm'} talking={[]} seed="ivan1" />
          {!b7 && <CoinArc from={[640, 760]} to={[900, 740]} start={t} every={5} n={8} c={GOLD} sym="" />}
          {/* the khan's sack on a cart to the right; on b7 a few coins jump into Ivan's own pouch */}
          <g transform="translate(1440 860)"><rect x={-120} y={-100} width={240} height={100} rx={10} fill="#8A5A34" stroke={OL} strokeWidth={5} /><circle cx={-80} cy={10} r={36} fill="#5E3A20" stroke={OL} strokeWidth={5} /><circle cx={80} cy={10} r={36} fill="#5E3A20" stroke={OL} strokeWidth={5} /><path d="M-70 -100 q70 -110 140 0 Z" fill="#C9A66B" stroke={OL} strokeWidth={5} /><text y={-130} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#2E4A9A">FOR THE KHAN</text></g>
          {b7 ? <CoinArc from={[1060, 760]} to={[1380, 740]} start={4} every={6} n={6} c={GOLD} sym="" /> : <CoinArc from={[1060, 760]} to={[1380, 740]} start={t + 20} every={6} n={6} c={GOLD} sym="" />}
          {b7 && <CoinArc from={[1060, 760]} to={[930, 800]} start={at(s, 'share') - 4} every={5} n={4} c="#FFD84A" sym="" />}
        </Layer>
      </CameraRig>
      <Label text="Ivan I of Moscow" x={960} y={260} at={at(s, 'Ivan', 6)} size={50} />
    </>
  );
};

// ---------------------------------------------------------------- Ivan Kalita = Ivan the Moneybag
const Moneybag: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b9 = s.id === 's03b09';
  return (
    <>
      <CameraRig move={{ zoomFrom: b9 ? 1.06 : 1, zoomTo: b9 ? 1.16 : 1.04, focus: [900, 600] }}>
        <InsertBg />
        <Layer depth={1}>
          <Chibi x={760} y={900} s={1.6} {...IVAN} item="sack" pose={b9 ? 'raise' : 'carry'} expr="grin" talking={[]} seed="mb" />
          {b9 && <Drop at={wordAt(s, 'Moneybag') - 4} x={1260} y={760} h={700} e={0.3}><g><path d="M-110 0 Q-140 -170 -40 -200 L-60 -240 H60 L40 -200 Q140 -170 110 0 Z" fill="#C9A66B" stroke={OL} strokeWidth={7} /><text y={-80} textAnchor="middle" fontFamily="TagBold" fontSize={90} fill={GOLD} stroke={OL} strokeWidth={3}>₽</text></g></Drop>}
        </Layer>
      </CameraRig>
      <Label text={b9 ? '"Kalita" = moneybag' : 'Ivan Kalita'} x={1240} y={250} at={b9 ? wordAt(s, 'Moneybag') : wordAt(s, 'Kalita')} size={70} color="#FFD84A" />
    </>
  );
};

// ---------------------------------------------------------------- land, influence, the church
const Influence: React.FC<SP> = ({ s }) => {
  const b11 = s.id === 's03b11';
  return (
    <Insert>
      <g transform="translate(960 620)">
        <Sign t={b11 ? -99 : at(s, 'land')} x={-560} y={-180} text="LAND" bg="#C9E0A0" />
        <Sign t={b11 ? -99 : at(s, 'influence')} x={0} y={-260} text="INFLUENCE" bg="#F4D58A" />
        <Sign t={b11 ? -99 : at(s, 'influence') + 12} x={-280} y={20} text="MOSCOW" bg={PAPER} color={RED} size={60} />
        {b11 && <PopProp at={at(s, 'Church') - 6} x={420} y={140}><g><OnionChurch x={0} y={0} s={0.7} /><text y={60} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill={PAPER}>HEAD OF THE CHURCH MOVES IN, 1325</text></g></PopProp>}
        {b11 && <PopProp at={8} x={-620} y={160}><Chibi x={0} y={0} s={1.0} {...PRIEST} pose="present" expr="calm" talking={[]} seed="met" /></PopProp>}
      </g>
    </Insert>
  );
};

// ---------------------------------------------------------------- didn't rise by defying them, rose by working for them
const Working = hostShot((s) => [{ at: 0, arm: s.id === 's03b12' ? 'finger' : 'present', expr: s.id === 's03b12' ? 'smile' : 'grin' }], {
  props: (s) => s.id === 's03b12'
    ? <PopProp at={at(s, 'defying') - 3} x={1050} y={500}><g><path d="M-90 -90 L90 90 M90 -90 L-90 90" stroke="#8A8A90" strokeWidth={20} strokeLinecap="round" /><path d="M-130 -130 L130 130 M130 -130 L-130 130" stroke={RED} strokeWidth={14} opacity={0.85} /></g></PopProp>
    : <PopProp at={at(s, 'working') - 3} x={1050} y={520}><g><rect x={-130} y={-80} width={260} height={160} rx={16} fill="#2E4A9A" stroke={OL} strokeWidth={6} /><text y={-18} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#fff">TAX</text><text y={30} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#fff">COLLECTOR</text><text y={64} textAnchor="middle" fontFamily="Tag" fontSize={22} fill="#FFD84A">for the Golden Horde</text></g></PopProp>,
});

// ---------------------------------------------------------------- 1480: Ivan III stops paying
const StopPay: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const t = at(s, 'stopped');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, shakes: [{ at: t, amp: 6, len: 8 }] }}>
        <KhanCamp />
        <Layer depth={1}>
          <Chibi x={1260} y={880} s={1.1} {...KHAN} pose={[{ at: 0, pose: 'present' }, { at: t + 6, pose: 'hipAngry' }]} expr={[{ at: 0, expr: 'grin' }, { at: t + 6, expr: 'shock' }]} talking={[]} flip seed="kh2" />
          <Chibi x={640} y={880} s={1.15} {...PRINCE('#5A2A6A')} pose={[{ at: 0, pose: 'carry' }, { at: t, pose: 'cross' }]} expr="determined" item={f < t ? 'sack' : undefined} talking={[]} seed="iv3" />
          {f >= t && <Drop at={t} x={760} y={880} h={140} e={0.3}><path d="M-50 0 Q-60 -70 -20 -84 L-26 -100 H26 L20 -84 Q60 -70 50 0 Z" fill="#C9A66B" stroke={OL} strokeWidth={5} /></Drop>}
        </Layer>
      </CameraRig>
      <Label text="Ivan III" x={640} y={330} at={at(s, 'Ivan', 6)} size={52} />
      <Label text="NO MORE TRIBUTE" x={960} y={180} at={t + 4} size={66} color="#FFD84A" />
    </>
  );
};

// ---------------------------------------------------------------- the Great Stand on the Ugra
const UGRA = ['s03b15', 's03b16', 's03b17', 's03b18'];
const Ugra: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const k = idx(s, UGRA);
  const leave = k >= 2 ? (k === 2 ? interpolate(f, [wordAt(s, 'withdrew') - 6, d], [0, 1], Easing.in) : 1) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: k === 3 ? 1.0 : 1.05, focus: [960, 600] }}>
        <RiverScene ground={640} />
        <Layer depth={1}>
          {[0, 1, 2, 3, 4].map((i) => <Chibi key={i} x={180 + i * 120} y={940 - (i % 2) * 30} s={0.75} {...PRINCE(['#B3261E', '#2E6A5A', '#5A2A6A'][i % 3])} item={i % 2 ? 'spear' : 'shield'} pose={k === 1 ? 'cross' : 'hold'} expr={k === 3 ? 'happy' : 'determined'} talking={[]} seed={'ug' + i} />)}
          {leave < 1 && [0, 1, 2, 3, 4].map((i) => <Rider key={i} x={1340 + i * 120 + leave * 900} y={620 - (i % 2) * 20} s={0.55} flip={leave === 0} gait={leave > 0 ? 'gallop' : 'idle'} phase={i * 3} rider={MONGOL(i)} />)}
        </Layer>
      </CameraRig>
      {k === 0 && <Label text="Ugra River, autumn 1480" x={960} y={220} at={at(s, 'Ugra')} size={52} />}
      {k === 1 && <Label text="weeks…" x={960} y={220} at={6} size={64} color="#FFD84A" />}
      {k === 3 && <Label text="240 years of Mongol rule: over" x={960} y={220} at={at(s, 'ended')} size={56} color="#FFD84A" />}
    </>
  );
};

// ---------------------------------------------------------------- double-headed eagle
const Eagle: React.FC<{ k: number }> = ({ k }) => (
  <g transform={`scale(${k})`}>
    {[-1, 1].map((sd) => <g key={sd} transform={`scale(${sd} 1)`}>
      <path d="M20 -40 Q120 -180 300 -150 Q220 -110 260 -60 Q180 -60 210 -10 Q130 -10 150 40 Q80 20 30 40 Z" fill={GOLD} stroke={OL} strokeWidth={6} strokeLinejoin="round" />
      <path d="M30 -80 Q40 -170 90 -190 Q130 -190 120 -160 L150 -150 L110 -140 Q80 -130 70 -80 Z" fill={GOLD} stroke={OL} strokeWidth={6} strokeLinejoin="round" />
      <circle cx={95} cy={-168} r={6} fill={OL} />
      <path d="M60 -200 l14 -36 l20 30 l18 -30 l10 36" fill={GOLD} stroke={OL} strokeWidth={4} />
    </g>)}
    <path d="M-40 -90 Q0 -110 40 -90 L50 80 Q0 130 -50 80 Z" fill={GOLD} stroke={OL} strokeWidth={6} />
    <path d="M-40 -10 H40 V60 Q0 90 -40 60 Z" fill={RED} stroke={OL} strokeWidth={5} />
    <path d="M-30 80 L-70 150 M30 80 L70 150" stroke={OL} strokeWidth={10} strokeLinecap="round" />
  </g>
);
const EagleShot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <Insert>
      <g transform="translate(960 520)"><Eagle k={springPop(f, at(s, 'eagle') - 6)} /></g>
      {[[-1, 'Novgorod'], [1, 'Tver']].map(([sd, n], i) => <g key={i} opacity={interpolate(f, [4, 20], [1, 0.25])}><OnionChurch x={960 + (sd as number) * 620} y={720} s={0.4} dome="#8A9AA8" /><text x={960 + (sd as number) * 620} y={780} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill={PAPER}>{n}</text></g>)}
    </Insert>
  );
};

// ---------------------------------------------------------------- Constantinople falls → the Third Rome
const ThirdRome: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = idx(s, ['s03b20', 's03b21', 's03b22']);
  const fall = k === 0 ? interpolate(f, [at(s, 'fell'), at(s, 'fell') + 16], [0, 1], Easing.in) : 1;
  const Col: React.FC<{ x: number; n: string; num: string; t: number; children: React.ReactNode }> = ({ x, n, num: num0, t, children }) => {
    const num = k === 2 ? num0 : '';
    const kk = springPop(f, t);
    return kk > 0 ? <g transform={`translate(${x} 660) scale(${kk})`}>{children}<text y={70} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill={PAPER}>{n}</text><text y={-330} textAnchor="middle" fontFamily="TagBold" fontSize={80} fill="#FFD84A">{num}</text></g> : null;
  };
  return (
    <Insert>
      <Col x={420} n="ROME" num="1" t={k === 2 ? 2 : -99}><g><rect x={-140} y={-180} width={280} height={180} fill="#E8DCC0" stroke={OL} strokeWidth={5} />{[...Array(5)].map((_, i) => <rect key={i} x={-120 + i * 54} y={-170} width={26} height={160} fill="#F4ECD8" stroke={OL} strokeWidth={3} />)}<path d="M-160 -180 L0 -260 L160 -180 Z" fill="#E8DCC0" stroke={OL} strokeWidth={5} /></g></Col>
      <Col x={960} n="CONSTANTINOPLE" num="2" t={-99}><g transform={`rotate(${fall * 18} 0 0) translate(0 ${fall * 40})`} opacity={1 - fall * 0.5}><ByzDome x={0} y={0} s={0.7} /></g></Col>
      {k === 0 && fall > 0.6 && <text x={960} y={300} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#FF8A7A">FALLS TO THE OTTOMANS, 1453</text>}
      <Col x={1500} n="MOSCOW" num="3" t={k >= 1 ? (k === 1 ? at(s, 'Moscow') - 4 : -99) : 9999}><OnionChurch x={0} y={0} s={0.7} glow={0.6} /></Col>
      {k === 2 && <Sign t={at(s, 'Third')} x={960} y={200} text="THE THIRD ROME" size={60} color={RED} />}
    </Insert>
  );
};

// ---------------------------------------------------------------- Ivan IV crowned, 1547
const Crowned: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b24 = s.id === 's03b24';
  const ivan4 = { ...PRINCE('#C9A22A'), hat: 'crown', hatColor: GOLD, outfit: { top: '#C9A22A', bottom: '#3A2A22', trim: '#F4ECD8', cape: '#7A1E2E' } };
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: b24 ? 1.12 : 1.05, focus: [960, 560] }}>
        <Taiga winter ground={760} />
        <Layer depth={0.6}><OnionChurch x={960} y={770} s={0.85} glow={0.4} /></Layer>
        <Layer depth={1}>
          <Chibi x={960} y={930} s={1.3} {...ivan4} pose="raise" expr="determined" talking={[]} seed="iv4" />
          <Chibi x={680} y={930} s={1.05} {...PRIEST} pose="present" expr="calm" talking={[]} seed="pr2" />
          {[0, 1, 2].map((i) => <Chibi key={i} x={1240 + i * 160} y={940} s={0.85} {...PRINCE(['#2E6A5A', '#6A4A8A', '#8A5A2A'][i])} legs="kneel" pose="pray" expr="calm" talking={[]} seed={'bo' + i} />)}
        </Layer>
      </CameraRig>
      {!b24 && <Label text="Ivan IV, crowned Tsar, 1547" x={960} y={180} at={at(s, 'crowned')} size={54} />}
      {b24 && <Label text="CAESAR → TSAR" x={960} y={180} at={at(s, 'Caesar') - 2} size={84} color="#FFD84A" />}
    </>
  );
};

// ---------------------------------------------------------------- terrible vs fearsome
const Terrible = hostShot((s) => {
  const k = idx(s, ['s03b25', 's03b26', 's03b27']);
  return [{ at: 0, arm: k === 1 ? 'finger' : k === 2 ? 'shrug' : 'present', expr: k === 2 ? 'worried' : 'smile' }];
}, {
  props: (s) => {
    const f = useCurrentFrame();
    const k = idx(s, ['s03b25', 's03b26', 's03b27']);
    const cross = k >= 1 ? interpolate(f, [k === 1 ? at(s, 'better') : -20, (k === 1 ? at(s, 'better') : -20) + 10], [0, 1]) : 0;
    return <g>
      <Sign t={k === 0 ? at(s, 'Terrible') - 3 : -99} x={1050} y={330} text="TERRIBLE" size={56} rot={-4} />
      {cross > 0 && k < 2 && <path d={`M930 330 L${930 + 240 * cross} 330`} stroke={RED} strokeWidth={12} strokeLinecap="round" />}
      {k >= 1 && <Sign t={k === 1 ? at(s, 'fearsome') - 3 : -99} x={1050} y={520} text="FEARSOME" size={56} rot={3} sub="Grozny (Грозный)" />}
      {k === 2 && <Hand t={6} x={1050} y={720} text="…both" size={80} color={RED} />}
    </g>;
  },
});

// ---------------------------------------------------------------- the terror (restrained: no violence shown)
const TerrorShot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const k = idx(s, ['s03b28', 's03b29', 's03b30']);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Taiga winter dusk ground={760} />
        <Layer depth={1}>
          <g filter="url(#sil)"><Chibi x={k === 2 ? 960 : 520} y={930} s={1.35} {...PRINCE('#2A1B12')} hat="crown" item="spear" pose="hold" expr="angry" talking={[]} seed="ivt" /></g>
          {k === 0 && [0, 1, 2, 3].map((i) => <g key={i} opacity={0.9}><Chibi x={900 + i * 220} y={940} s={0.95} {...PRINCE(['#6A4A8A', '#2E6A5A', '#8A5A2A', '#5A5A6A'][i])} legs="kneel" pose="pray" expr="sad" talking={[]} seed={'nb' + i} /></g>)}
          {k === 1 && [...Array(9)].map((_, i) => <g key={i} transform={`translate(${880 + (i % 3) * 300} ${560 + Math.floor(i / 3) * 120})`} opacity={interpolate(f, [i * 6, i * 6 + 12], [0, 0.9])}><rect x={-60} y={-80} width={120} height={80} fill="#2A2A30" stroke={OL} strokeWidth={3} /><rect x={-36} y={-60} width={30} height={30} fill={f > 20 + i * 8 ? '#2A2A30' : '#F2C230'} /><rect x={6} y={-60} width={30} height={30} fill={f > 26 + i * 8 ? '#2A2A30' : '#F2C230'} /></g>)}
        </Layer>
        <Layer depth={1.2}><rect x={-300} y={-300} width={2600} height={1700} fill="#0A0A14" opacity={0.25 + k * 0.12} /></Layer>
      </CameraRig>
      {k === 1 && <Label text="the Oprichnina, 1565–1572" x={1300} y={220} at={at(s, 'terror')} size={46} />}
      {k === 2 && <Label text="1581 · the heir, Ivan Ivanovich" x={960} y={220} at={10} size={46} />}
    </>
  );
};

// ---------------------------------------------------------------- no barrier? build distance
const Distance = hostShot((s) => [{ at: 0, arm: s.id === 's03b31' ? 'present' : 'point', expr: 'smile' }], {
  props: (s) => {
    const f = useCurrentFrame();
    const b32 = s.id === 's03b32';
    const len = b32 ? interpolate(f, [at(s, 'distance') - 4, at(s, 'distance') + 20], [0, 1], Easing.out) : 0;
    return <g>
      <PopProp at={b32 ? -99 : at(s, 'walls') - 4} x={1030} y={640}><g opacity={b32 ? 0.35 : 1}>{[...Array(3)].map((_, r) => [...Array(4)].map((__, c) => <rect key={r + '-' + c} x={-140 + c * 70 + (r % 2) * 35} y={-r * 46} width={66} height={42} fill="#B8A890" stroke={OL} strokeWidth={4} />))}<path d="M-160 -140 L160 30" stroke={RED} strokeWidth={14} strokeLinecap="round" /></g></PopProp>
      {b32 && <g><path d={`M880 360 H${880 + 340 * len}`} stroke={RED} strokeWidth={20} strokeLinecap="round" /><path d={`M${880 + 340 * len - 30} 320 l50 40 l-50 40`} fill="none" stroke={RED} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" opacity={len > 0.1 ? 1 : 0} /><text x={1050} y={300} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#3A3A48" opacity={len}>DISTANCE</text></g>}
    </g>;
  },
});

// ---------------------------------------------------------------- the sable: soft gold
const Sable: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip }) => {
  const f = useCurrentFrame();
  const b = Math.sin(f / 4) * 4;
  return <g transform={`translate(${x} ${y + b}) scale(${flip ? -s : s} ${s})`}>
    <path d="M-150 -20 Q-200 -70 -170 -110 Q-150 -60 -110 -50" fill="#4A2E1E" stroke={OL} strokeWidth={5} />
    <path d="M-130 -10 Q-120 -90 0 -90 Q100 -95 130 -60 Q150 -30 120 -10 Z" fill="#5A3A26" stroke={OL} strokeWidth={6} />
    <path d="M100 -70 Q160 -110 190 -70 Q200 -45 170 -40 Q140 -35 115 -45 Z" fill="#5A3A26" stroke={OL} strokeWidth={6} />
    <path d="M130 -60 Q150 -48 170 -55" fill="#E8C878" stroke={OL} strokeWidth={3} />
    <circle cx={165} cy={-75} r={6} fill={OL} /><circle cx={194} cy={-58} r={7} fill={OL} />
    <path d="M140 -100 l10 -22 l12 20 Z" fill="#5A3A26" stroke={OL} strokeWidth={4} />
    {[-90, -40, 40, 90].map((lx, i) => <path key={i} d={`M${lx} -14 V${i % 2 ? 6 : 0}`} stroke={OL} strokeWidth={14} strokeLinecap="round" />)}
  </g>;
};
const SableShot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const k = idx(s, ['s03b36', 's03b37', 's03b38']);
  return (
    <>
      <CameraRig move={{ zoomFrom: k === 1 ? 1.1 : 1, zoomTo: k === 1 ? 1.18 : 1.04, focus: [960, 760] }}>
        <Taiga winter ground={800} />
        <Layer depth={1}>
          {k >= 1 && <Sable x={k === 1 ? interpolate(f, [0, 20], [700, 960], Easing.out) : 760} y={880} s={1.1} />}
          {k === 2 && <g>{[...Array(6)].map((_, i) => { const t = at(s, 'gold') - 8 + i * 4; if (f < t) return null; const g = gravityDrop(f, t, { h: 500, g: 2.4, e: 0.3 }); return <g key={i} transform={`translate(${1180 + i * 70} ${880 + g.y})`}><circle r={28} fill={GOLD} stroke={OL} strokeWidth={4} /></g>; })}</g>}
        </Layer>
        <Layer depth={1.1}><Snow density={35} /></Layer>
      </CameraRig>
      {k === 2 && <Label text="&quot;soft gold&quot;" x={960} y={240} at={at(s, 'soft') - 2} size={80} color="#FFD84A" />}
      {k === 1 && <Label text="sable" x={960} y={480} at={at(s, 'sable')} size={70} />}
    </>
  );
};

// ---------------------------------------------------------------- forts and tribute (ostrog)
const Ostrog: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b40 = s.id === 's03b40';
  const build = b40 ? interpolate(f, [at(s, 'forts') - 6, at(s, 'forts') + 20], [0, 1], Easing.out) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05 }}>
        <Taiga winter ground={780} />
        <Layer depth={0.85}>
          <g transform="translate(1300 800)" opacity={build}>
            {[...Array(16)].map((_, i) => <path key={i} d={`M${-320 + i * 40} 0 V${-140 * build - (i % 2) * 8} l20 -24 l20 24 V0`} fill="#8A5A34" stroke={OL} strokeWidth={3} />)}
            <rect x={-80} y={-260 * build} width={160} height={120 * build} fill="#8A5A34" stroke={OL} strokeWidth={4} />
            <path d={`M-100 ${-260 * build} L0 ${-340 * build} L100 ${-260 * build} Z`} fill="#5E3A20" stroke={OL} strokeWidth={4} />
          </g>
        </Layer>
        <Layer depth={1}>
          {[0, 1, 2, 3].map((i) => <Chibi key={i} x={(b40 ? 420 : interpolate(f, [0, d], [100, 700])) + i * 150} y={930} s={0.85} {...COSSACK(i)} legs={b40 ? 'stand' : 'march'} pose={b40 && i === 0 ? 'point' : 'hold'} expr="determined" talking={[]} seed={'co' + i} delay={i * 3} />)}
          {b40 && <Chibi x={1000} y={930} s={0.85} {...PEASANT(2)} outfit={{ top: '#C9A66B', bottom: '#5A4A3A' }} hat="hair" skin="#E8C49A" item="sack" pose="present" expr="sad" talking={[]} seed="tri" flip />}
        </Layer>
        <Layer depth={1.1}><Snow density={30} /></Layer>
      </CameraRig>
      {!b40 && <Label text="Cossacks & fur traders" x={960} y={230} at={8} size={52} />}
      {b40 && <Label text="ostrog (wooden fort)" x={1300} y={260} at={at(s, 'forts') + 10} size={46} />}
    </>
  );
};

// ---------------------------------------------------------------- the catch: land grows faster than people
const Catch = hostShot((s) => {
  const k = idx(s, ['s03b43', 's03b44', 's03b45']);
  return [{ at: 0, arm: k === 0 ? 'finger' : k === 1 ? 'present' : 'chin', expr: k === 2 ? 'worried' : 'smile' }];
}, {
  props: (s) => {
    const f = useCurrentFrame();
    const k = idx(s, ['s03b43', 's03b44', 's03b45']);
    if (k === 0) return <PopProp at={at(s, 'catch') - 3} x={1050} y={470}><text textAnchor="middle" fontFamily="Hand" fontSize={200} fill={RED} stroke={RED} strokeWidth={3}>!</text></PopProp>;
    const g = k === 1 ? interpolate(f, [at(s, 'land') - 4, at(s, 'people') + 10], [0.3, 1], Easing.out) : 1;
    return <g transform="translate(960 300)">
      <text x={0} y={0} fontFamily="TagBold" fontSize={34} fill="#3A3A48">LAND</text>
      <rect x={0} y={20} width={280 * g} height={60} fill="#8FAE5E" stroke={OL} strokeWidth={5} />
      <text x={0} y={170} fontFamily="TagBold" fontSize={34} fill="#3A3A48">PEOPLE</text>
      <rect x={0} y={190} width={320 * 0.25 * Math.min(1, 0.8 + g * 0.2)} height={60} fill="#E8862A" stroke={OL} strokeWidth={5} />
      {k === 2 && <g transform="translate(160 400)"><path d="M-40 -60 Q-40 -110 0 -110 Q40 -110 40 -60 V0 H-40 Z" fill="#8A8A90" stroke={OL} strokeWidth={6} /><rect x={-60} y={-10} width={120} height={90} rx={10} fill={GOLD} stroke={OL} strokeWidth={6} /><circle cy={30} r={12} fill={OL} /></g>}
    </g>;
  },
});

export const SHOTS_03: ShotMap = {
  c2_1147: M1147, c2_woodtown: WoodTown, c2_clever: Clever, c2_kalita: Kalita, c2_moneybag: Moneybag, c2_influence: Influence,
  c2_working: Working, c2_stoppay: StopPay, c2_ugra: Ugra, c2_eagle: EagleShot, c2_thirdrome: ThirdRome, c2_crowned: Crowned,
  c2_terrible: Terrible, c2_terror: TerrorShot, c2_distance: Distance, c2_sable: SableShot, c2_ostrog: Ostrog, c2_catch: Catch,
};
