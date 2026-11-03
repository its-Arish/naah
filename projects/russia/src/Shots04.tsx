/** Chapter 3: The Chains (Time of Troubles, serfdom, Peter the Great, St Petersburg). */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop, gravityDrop, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL, Cloud, Hills, Range } from '@engine/scenes/Parts';
import { Taiga, LogHut, OnionChurch, Snow, SnowPine } from '@engine/scenes/Russia';
import { Sea } from '@engine/scenes/Vietnam';
import { hostShot, wordAt, PopProp, Drop, type ShotMap, type SP } from '@engine/kit';
import { W, dress } from '@engine/cast/Wardrobe';
import { PEASANT, PRINCE, PRIEST, MERCHANT, RED, PAPER, GOLD } from './Cast';
import { idx, at, Sign, Hand, Insert, Flag, Kremlin, Person } from './Kit2';

const BOYAR = (c = '#6A4A8A') => ({ ...PRINCE(c), beard: true, beardColor: '#5A3A22' });
const PETER = { outfit: { top: '#2E5A3A', bottom: '#2A2A34', trim: GOLD, belt: '#2A1B12' }, hat: 'hairlong', hatColor: '#3A2416', hair: '#3A2416', mustache: true, skin: '#F3D2B0' };
const POLE = { outfit: { top: '#B3261E', bottom: '#3A2A22', trim: GOLD }, hat: 'cap', hatColor: '#8A1E2E', mustache: true, item: 'spear', skin: '#F3D2B0' };

// ---------------------------------------------------------------- Russia nearly vanished
const Vanish = hostShot((s) => [{ at: 0, arm: 'present', expr: 'smile' }, { at: at(s, 'vanished'), arm: 'shrug', expr: 'shock' }], {
  props: (s) => {
    const f = useCurrentFrame();
    const o = interpolate(f, [at(s, 'vanished') - 2, at(s, 'vanished') + 20], [1, 0.1]);
    return <PopProp at={4} x={1040} y={480}><g opacity={o}><path d="M-170 -40 Q-120 -110 -20 -100 Q80 -130 170 -80 Q190 -10 120 20 Q40 60 -40 40 Q-140 60 -170 -40 Z" fill={RED} stroke={OL} strokeWidth={6} /><text y={-10} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff">RUSSIA</text></g></PopProp>;
  },
});

// ---------------------------------------------------------------- Huaynaputina, 1600
const Volcano: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b3 = s.id === 's04b03';
  const erupt = b3 ? 1 : interpolate(f, [at(s, 'volcano') - 2, at(s, 'volcano') + 40], [0, 1], Easing.out);
  const ash = b3 ? interpolate(f, [0, d], [0.4, 1]) : erupt * 0.4;
  return (
    <>
      <CameraRig move={{ zoomFrom: b3 ? 1.0 : 1.05, zoomTo: b3 ? 0.94 : 1.08, shakes: b3 ? [] : [{ at: at(s, 'volcano'), amp: 10, len: 14 }] }}>
        <Layer depth={0}><rect x={-300} y={-300} width={2600} height={1700} fill="url(#skyDay)" /><rect x={-300} y={-300} width={2600} height={1700} fill="#6A6460" opacity={ash * 0.65} /></Layer>
        <Layer depth={0.4}><Hills y={760} fill="#B08A5A" amp={50} seed="pe" /></Layer>
        <Layer depth={0.7}>
          <path d="M520 860 L880 380 L1040 380 L1400 860 Z" fill="#7A5A44" stroke={OL} strokeWidth={6} strokeLinejoin="round" />
          <path d="M880 380 Q960 420 1040 380" fill="#C0392B" stroke={OL} strokeWidth={5} />
          {[...Array(14)].map((_, i) => { const t = ((f * 1.2 + i * 17) % 160) / 160; if (erupt <= 0) return null; return <circle key={i} cx={960 + Math.sin(i * 2.3) * 140 * t + t * 260 * (b3 ? 1 : 0.3)} cy={360 - t * 420 * erupt} r={50 + t * 160} fill={i % 3 ? '#5A5450' : '#7A726C'} opacity={(1 - t) * 0.85} />; })}
          {erupt > 0 && [...Array(6)].map((_, i) => { const t = f - at(s, 'volcano') - i * 4; if (b3 || t < 0 || t > 40) return null; return <circle key={'r' + i} cx={960 + (i - 2.5) * 12 * t * 0.6} cy={380 - 22 * t + 0.6 * t * t} r={12} fill="#E8862A" stroke={OL} strokeWidth={3} />; })}
          <path d="M-300 860 L2300 860 L2300 1500 L-300 1500 Z" fill="#9A7A54" stroke={OL} strokeWidth={4} />
        </Layer>
      </CameraRig>
      {!b3 && <Label text="Huaynaputina, Peru" x={960} y={180} at={at(s, 'Peru')} size={56} />}
      {b3 && <Label text="1601: coldest summer in centuries" x={960} y={180} at={at(s, 'cooled')} size={50} color="#FFD84A" />}
    </>
  );
};

// ---------------------------------------------------------------- the famine (restrained: empty fields, empty bowls)
const Famine: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b5 = s.id === 's04b05';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-300} y={-300} width={2600} height={1700} fill="url(#skyDust)" /></Layer>
        <Layer depth={0.4}><Hills y={640} fill="#A89C80" amp={30} seed="fm" stroke={false} />{[0, 1, 2].map((i) => <LogHut key={i} x={300 + i * 650} y={660} s={0.3} smoke={false} seed={'fh' + i} />)}</Layer>
        <Layer depth={0.8}>
          <path d="M-300 700 L2300 700 L2300 1500 L-300 1500 Z" fill="#8A7A5A" stroke={OL} strokeWidth={3} />
          {[...Array(40)].map((_, i) => <path key={i} d={`M${-100 + (i % 20) * 110 + Math.floor(i / 20) * 50} ${760 + Math.floor(i / 20) * 80} q${8} -40 ${-6} -${50 + random('st' + i) * 20}`} stroke="#5A4A2A" strokeWidth={5} fill="none" strokeLinecap="round" />)}
          {b5 && [0, 1, 2].map((i) => <g key={i} transform={`translate(${700 + i * 260} 860)`}><path d="M-60 0 Q0 50 60 0 Z" fill="#B8A890" stroke={OL} strokeWidth={4} /></g>)}
        </Layer>
        <Layer depth={1}><Snow density={14} wind={0.4} seed="fs" /></Layer>
      </CameraRig>
      {b5 && <Label text="1601–1603 · up to a third of the people may have died" x={960} y={200} at={at(s, 'millions')} size={42} />}
    </>
  );
};

// ---------------------------------------------------------------- the Time of Troubles
const TROUBLES = ['s04b06', 's04b07', 's04b08', 's04b09'];
const Troubles: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const k = idx(s, TROUBLES);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, shakes: k === 1 ? [{ at: at(s, 'fought'), amp: 6, len: 8 }] : [] }}>
        <InsertBg glow={false} />
        <Layer depth={1}>
          <g transform="translate(960 640)">
            <path d="M-120 0 V-260 Q0 -330 120 -260 V0 Z" fill="#8C1D18" stroke={OL} strokeWidth={6} />
            <rect x={-150} y={-20} width={300} height={70} fill="#5E3A20" stroke={OL} strokeWidth={5} />
            <g transform={`translate(${k === 1 ? Math.sin(f / 3) * 60 : 0} ${-120 + (k === 0 ? 0 : 0)})`}><path d="M-50 0 L-60 -60 L-25 -30 L0 -70 L25 -30 L60 -60 L50 0 Z" fill={GOLD} stroke={OL} strokeWidth={5} strokeLinejoin="round" /></g>
          </g>
          {k === 1 && [0, 1].map((i) => <Chibi key={i} x={600 + i * 720} y={880} s={1.05} {...BOYAR(i ? '#2E6A5A' : '#6A4A8A')} flip={i === 1} pose={[{ at: 0, pose: 'pull' }, { at: 12, pose: 'fist' }, { at: 24, pose: 'pull' }]} expr="angry" talking={[[2, 50]]} seed={'bf' + i} />)}
          {k === 2 && [0, 1, 2].map((i) => <PopProp key={i} at={at(s, 'Pretenders') - 6 + i * 6} x={560 + i * 400} y={880}><g><Chibi x={0} y={0} s={0.95} {...PRINCE(['#B3261E', '#2E4A9A', '#5A2A6A'][i])} hat="crown" pose="raise" expr="grin" talking={[]} seed={'fd' + i} /><text y={i === 1 ? -390 : -320} textAnchor="middle" fontFamily="Hand" fontSize={46} fill="#FFD84A">"I'm the Tsar!"</text></g></PopProp>)}
          {k === 3 && <g><Flag kind="pol" x={300} y={360} s={0.8} pole={420} /><g transform="translate(1500 360)"><Flag kind="white" x={0} y={0} s={0.8} pole={420} /><path d="M70 30 V130 M30 80 H110" stroke="#2E4A9A" strokeWidth={0} /></g><text x={420} y={300} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill={PAPER}>POLAND–LITHUANIA</text><text x={1620} y={300} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill={PAPER}>SWEDEN</text></g>}
        </Layer>
      </CameraRig>
      {k === 0 && <Label text="no heir: the old dynasty ends, 1598" x={960} y={200} at={at(s, 'died')} size={48} />}
    </>
  );
};

// ---------------------------------------------------------------- Polish troops in the Kremlin, 1610
const KremlinPol: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05 }}>
        <Kremlin y={540} winter flag="pol" flagRaise={interpolate(f, [at(s, 'occupied') - 4, at(s, 'occupied') + 20], [0, 1], Easing.out)} />
        <Layer depth={1}>{[0, 1, 2, 3].map((i) => <Chibi key={i} x={500 + i * 300} y={960} s={0.9} {...POLE} pose="hold" expr="determined" talking={[]} seed={'pl' + i} />)}</Layer>
      </CameraRig>
      <Label text="Polish garrison in the Kremlin" x={960} y={110} at={at(s, 'Kremlin')} size={52} />
    </>
  );
};

// ---------------------------------------------------------------- Minin and Pozharsky
const Minin: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const x0 = interpolate(f, [0, d], [-300, 500]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Taiga winter ground={760} />
        <Layer depth={1}>
          {[...Array(6)].map((_, i) => <Chibi key={i} x={x0 + i * 150} y={920 - (i % 2) * 24} s={0.85} {...PEASANT(i)} item={i % 2 ? 'spear' : 'mallet'} legs="march" pose="hold" expr="determined" talking={[]} seed={'vm' + i} delay={i * 2} />)}
          <Chibi x={x0 + 1000} y={930} s={1.05} {...MERCHANT(1)} item="banner" legs="march" pose="raise" expr="determined" talking={[]} seed="minin" />
          <Chibi x={x0 + 1200} y={930} s={1.05} {...PRINCE('#2E4A6A')} item="sword" legs="march" pose="attack" expr="determined" talking={[]} seed="pozh" />
        </Layer>
        <Layer depth={1.1}><Snow density={25} /></Layer>
      </CameraRig>
      <Label text="Minin (merchant) & Pozharsky (prince)" x={960} y={200} at={at(s, 'merchant')} size={46} />
    </>
  );
};

// ---------------------------------------------------------------- Michael Romanov, 16
const Romanov: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b13 = s.id === 's04b13';
  const mikhail = { outfit: { top: '#C9A22A', bottom: '#3A2A22', trim: '#F4ECD8', cape: '#7A1E2E' }, hat: 'crown', hatColor: GOLD, skin: '#F6DCC4', hair: '#5A3A22' };
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05 }}>
        <Kremlin y={500} winter />
        <Layer depth={1}>
          <Chibi x={960} y={930} s={1.0} {...mikhail} pose={b13 ? 'raise' : 'idle'} expr={b13 ? 'happy' : 'shock'} talking={[]} seed="mr" />
          {[...Array(6)].map((_, i) => <Chibi key={i} x={i < 3 ? 260 + i * 150 : 1360 + (i - 3) * 150} y={950} s={0.8} {...(i % 3 === 0 ? MERCHANT(i) : i % 3 === 1 ? BOYAR(['#2E6A5A', '#6A4A8A'][i % 2]) : PRIEST)} flip={i >= 3} pose={b13 ? 'cheer' : 'present'} expr="happy" talking={[]} seed={'za' + i} />)}
        </Layer>
      </CameraRig>
      {!b13 && <Label text="Michael Romanov, aged 16" x={960} y={110} at={at(s, 'Michael')} size={56} />}
      {b13 && <Label text="Romanovs: 1613–1917" x={960} y={110} at={at(s, '300')} size={64} color="#FFD84A" />}
    </>
  );
};

// ---------------------------------------------------------------- the problem: huge land, little labour, peasants can walk away
const ProblemH = hostShot((s) => [{ at: 0, arm: 'finger', expr: 'smile' }], {
  props: (s) => <PopProp at={at(s, 'problem') - 3} x={1050} y={480}><text textAnchor="middle" fontFamily="Hand" fontSize={220} fill={RED} stroke={RED} strokeWidth={3}>?</text></PopProp>,
});
const WalkAway: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b16 = s.id === 's04b16';
  return (
    <>
      <CameraRig move={{ zoomFrom: b16 ? 1.04 : 1.1, zoomTo: b16 ? 1.0 : 1.02, focus: [960, 650] }}>
        <Taiga winter={false} ground={760} />
        <Layer depth={0.8}><LogHut x={420} y={790} s={0.5} seed="wa" /><path d="M-300 800 H700 V860 H-300 Z" fill="#B89A5A" stroke={OL} strokeWidth={3} /></Layer>
        <Layer depth={1}>
          {b16
            ? <Chibi x={interpolate(f, [0, d], [700, 1700])} y={930} s={0.95} {...PEASANT(3)} item="bundle" legs="walk" pose="carry" flip={false} expr="happy" talking={[]} seed="wk" />
            : <Chibi x={700} y={930} s={0.95} {...PEASANT(3)} item="hammer" pose="hold" expr="normal" talking={[]} seed="wk" />}
        </Layer>
      </CameraRig>
      {!b16 && <Label text="lots of land · few hands" x={960} y={200} at={at(s, 'huge')} size={58} />}
    </>
  );
};
const Needs: React.FC<SP> = ({ s }) => {
  const b18 = s.id === 's04b18';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Taiga winter={false} ground={760} />
        <Layer depth={0.75}><g transform="translate(1400 790)"><rect x={-230} y={-200} width={460} height={200} fill="#E8DCC0" stroke={OL} strokeWidth={5} /><path d="M-260 -200 L0 -320 L260 -200 Z" fill="#7A3A2A" stroke={OL} strokeWidth={5} />{[...Array(4)].map((_, i) => <rect key={i} x={-190 + i * 110} y={-150} width={50} height={70} fill="#6A7A8A" stroke={OL} strokeWidth={3} />)}</g></Layer>
        <Layer depth={1}>
          <Chibi x={760} y={930} s={1.15} {...BOYAR('#4A2E6A')} pose={b18 ? 'idle' : 'hipAngry'} expr={b18 ? 'shock' : 'angry'} talking={b18 ? [] : [[6, 50]]} seed="lo" />
          {b18 && <Chibi x={1100} y={930} s={1.05} {...dress(W.OFFICIAL(1), { hat: 'cap', hatColor: '#3A2A22', outfit: { top: '#2E4A6A' } })} item="scroll" pose="present" expr="determined" talking={[[6, 50]]} seed="tx" flip />}
        </Layer>
      </CameraRig>
      <Label text={b18 ? 'the state: "TAXES"' : 'landowner: "WORKERS"'} x={960} y={200} at={at(s, b18 ? 'taxes' : 'workers') - 2} size={58} color="#FFD84A" />
    </>
  );
};

// ---------------------------------------------------------------- 1649: the law code binds peasants to the land
const CODE = ['s04b19', 's04b20', 's04b21'];
const Chain: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number }> = ({ x1, y1, x2, y2, p }) => {
  const n = 12, links = Math.round(n * p);
  return <g>{[...Array(links)].map((_, i) => { const t = i / n; return <ellipse key={i} cx={x1 + (x2 - x1) * t} cy={y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * 30} rx={20} ry={12} fill="none" stroke="#5A5A64" strokeWidth={8} transform={`rotate(${i % 2 ? 0 : 90} ${x1 + (x2 - x1) * t} ${y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * 30})`} />; })}</g>;
};
const Code: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = idx(s, CODE);
  if (k === 0) return (
    <Insert>
      <g transform="translate(960 500) rotate(-2)">
        <rect x={-330} y={-300} width={660} height={600} rx={16} fill="#EADCB8" stroke={OL} strokeWidth={7} />
        <text y={-210} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill={RED}>SOBORNOYE ULOZHENIYE</text>
        <text y={-160} textAnchor="middle" fontFamily="Tag" fontSize={30} fill="#5A4A3A">Law Code of 1649</text>
        {[...Array(6)].map((_, i) => <path key={i} d={`M-250 ${-100 + i * 50} h${500 - (i % 3) * 60}`} stroke="#8A6A4A" strokeWidth={5} strokeLinecap="round" />)}
      </g>
      <Drop at={at(s, 'locked') - 8} x={1260} y={760} h={600} e={0.25}><g><path d="M-50 -90 Q-50 -150 0 -150 Q50 -150 50 -90" fill="none" stroke="#5A5A64" strokeWidth={18} /><rect x={-80} y={-100} width={160} height={130} rx={14} fill={GOLD} stroke={OL} strokeWidth={6} /><circle cy={-40} r={14} fill={OL} /></g></Drop>
    </Insert>
  );
  const p = interpolate(f, [k === 1 ? at(s, 'bound') - 6 : 0, (k === 1 ? at(s, 'bound') : 0) + 20], [0, 1]);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <Taiga winter={false} dusk ground={760} />
      <Layer depth={0.75}><g transform="translate(1500 790)"><rect x={-200} y={-180} width={400} height={180} fill="#E8DCC0" stroke={OL} strokeWidth={5} /><path d="M-230 -180 L0 -290 L230 -180 Z" fill="#7A3A2A" stroke={OL} strokeWidth={5} /></g></Layer>
      <Layer depth={1}>
        <Chain x1={560} y1={880} x2={1300} y2={860} p={k === 2 ? 1 : p} />
        <Chibi x={500} y={930} s={1.0} {...PEASANT(0)} pose="idle" expr="sad" talking={[]} seed="sf1" />
        {k === 2 && <PopProp at={at(s, 'children') - 6} x={330} y={930}><Chibi x={0} y={0} s={0.6} {...PEASANT(1)} pose="idle" expr="sad" talking={[]} seed="sfk" /></PopProp>}
        {k === 2 && <Chain x1={340} y1={900} x2={480} y2={890} p={interpolate(f, [at(s, 'children'), at(s, 'children') + 14], [0, 1])} />}
      </Layer>
    </CameraRig>
  );
};

// ---------------------------------------------------------------- serfdom 1649 → 1861 timeline
const Serfdom: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at(s, 'lasted') - 6, at(s, 'centuries') + 10], [0, 1], Easing.inOut);
  return (
    <Insert>
      <text x={960} y={300} textAnchor="middle" fontFamily="TagBold" fontSize={70} fill="#FFD84A">SERFDOM</text>
      <path d="M360 520 H1560" stroke="#5A5A5A" strokeWidth={14} strokeLinecap="round" />
      <path d={`M360 520 H${360 + 1200 * p}`} stroke="#C0392B" strokeWidth={22} strokeLinecap="round" />
      <text x={360} y={600} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill={PAPER}>1649</text>
      {p > 0.98 && <text x={1560} y={600} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill={PAPER}>1861</text>}
      <text x={960} y={680} textAnchor="middle" fontFamily="Hand" fontSize={60} fill={PAPER} opacity={p}>212 years</text>
    </Insert>
  );
};

// ---------------------------------------------------------------- imagine being born into it
const IMAGINE = ['s04b23', 's04b24', 's04b25', 's04b26'];
const Imagine: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = idx(s, IMAGINE);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [900, 700] }}>
        <Taiga winter={false} dusk ground={740} />
        <Layer depth={0.8}><LogHut x={1420} y={770} s={0.55} seed="im" /><path d="M-300 790 H1000 V900 H-300 Z" fill="#B89A5A" stroke={OL} strokeWidth={3} />{[...Array(10)].map((_, i) => <path key={i} d={`M${-200 + i * 110} 800 l30 80`} stroke="#8A6A3A" strokeWidth={5} />)}</Layer>
        <Layer depth={1}>
          <Chibi x={560} y={930} s={1.0} {...PEASANT(0)} item="hammer" pose={k === 2 ? 'pull' : 'hold'} expr="sad" talking={[]} seed="ig1" />
          <Chibi x={780} y={930} s={0.95} {...PEASANT(1)} pose="idle" expr="sad" talking={[]} seed="ig2" />
          {k >= 3 && <PopProp at={2} x={680} y={940}><Chibi x={0} y={0} s={0.55} {...PEASANT(2)} pose="idle" expr="sad" talking={[]} seed="ig3" /></PopProp>}
        </Layer>
      </CameraRig>
      {k === 1 && <Label text="farm: the landlord's" x={600} y={260} at={at(s, 'farm')} size={56} color="#FFD84A" />}
      {k === 2 && <Label text="labour: the landlord's" x={600} y={260} at={at(s, 'labour')} size={56} color="#FFD84A" />}
      {k === 3 && <Label text="children: born serfs" x={600} y={260} at={at(s, 'children')} size={56} color="#FFD84A" />}
    </>
  );
};

// ---------------------------------------------------------------- it's arithmetic
const Arith = hostShot((s) => {
  const k = idx(s, ['s04b27', 's04b28', 's04b29']);
  return [{ at: 0, arm: k === 0 ? 'idle' : k === 1 ? 'finger' : 'present', expr: k === 1 ? 'proud' : 'smile' }];
}, {
  props: (s) => {
    const k = idx(s, ['s04b27', 's04b28', 's04b29']);
    if (k === 0) return null;
    return <g>
      <Sign t={k === 1 ? at(s, 'arithmetic') - 2 : -99} x={1050} y={300} text="BIG LAND" size={40} bg="#C9E0A0" />
      <Sign t={k === 1 ? at(s, 'arithmetic') + 4 : -99} x={1050} y={420} text="÷ FEW PEOPLE" size={40} bg="#F4D58A" />
      {k === 2 && <Sign t={at(s, 'nobody') - 2} x={1050} y={580} text="= NOBODY LEAVES" size={42} color={RED} />}
    </g>;
  },
});

// ---------------------------------------------------------------- Peter the Great
const PeterShot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b31 = s.id === 's04b31';
  const grow = b31 ? 1.55 : interpolate(f, [at(s, 'Peter') - 4, at(s, 'Peter') + 14], [1.0, 1.55], Easing.out);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Kremlin y={520} />
        <Layer depth={1}>
          <Chibi x={960} y={960} s={grow} {...PETER} pose={b31 ? 'raise' : 'present'} expr="grin" talking={[]} seed="pt" />
          {[0, 1].map((i) => <Chibi key={i} x={620 + i * 680} y={960} s={0.95} {...BOYAR(['#6A4A8A', '#2E6A5A'][i])} flip={i === 1} pose="idle" expr="shock" talking={[]} seed={'pb' + i} />)}
          {b31 && <g transform="translate(1180 960)"><path d="M0 0 V-560" stroke={PAPER} strokeWidth={8} />{[...Array(8)].map((_, i) => <path key={i} d={`M0 ${-i * 70} h${i % 2 ? 20 : 34}`} stroke={PAPER} strokeWidth={5} />)}<text x={20} y={-580} fontFamily="TagBold" fontSize={40} fill="#FFD84A">2.03 m</text></g>}
        </Layer>
      </CameraRig>
      {!b31 && <Label text="Peter I, &quot;the Great&quot;" x={960} y={110} at={at(s, 'Peter')} size={56} />}
    </>
  );
};
const Shipyard: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05 }}>
        <Sea horizon={560} />
        <Layer depth={0.8}>
          <g transform="translate(1100 780)"><path d="M-420 -150 Q-380 40 0 50 Q380 40 420 -150 Z" fill="#9A6A3A" stroke={OL} strokeWidth={6} />{[...Array(9)].map((_, i) => <path key={i} d={`M${-380 + i * 95} -150 Q${-370 + i * 95} 20 ${-360 + i * 95} 40`} stroke="#6E4A2A" strokeWidth={4} fill="none" />)}<path d="M0 -150 V-480" stroke="#6E4A2A" strokeWidth={14} /></g>
          {[...Array(6)].map((_, i) => <path key={i} d={`M${560 + i * 160} 830 V900`} stroke="#5E3A20" strokeWidth={14} />)}
        </Layer>
        <Layer depth={1}>
          <Chibi x={760} y={930} s={1.2} {...PETER} outfit={{ top: '#8A6A4A', bottom: '#4A3A2A', belt: '#2A1B12' }} hat="cap" hatColor="#3A2A22" item="hammer" pose={[{ at: 0, pose: 'raise' }, { at: 8, pose: 'hold' }, { at: 16, pose: 'raise' }, { at: 24, pose: 'hold' }, { at: 32, pose: 'raise' }, { at: 40, pose: 'hold' }]} expr="grin" talking={[]} seed="psy" />
          <Chibi x={1320} y={930} s={0.95} {...dress(W.PEASANT('#3A5A8A', 1), { hat: 'cap', hatColor: '#2A2A34', skin: '#F6DCC4' })} pose="shrug" expr="calm" talking={[]} seed="dutch" flip />
        </Layer>
      </CameraRig>
      <Label text="Zaandam & Amsterdam, 1697" x={960} y={180} at={6} size={50} />
      <Label text="&quot;Pyotr Mikhailov&quot;, apprentice carpenter" x={760} y={330} at={at(s, 'incognito')} size={40} color="#FFD84A" />
    </>
  );
};
const Navy: React.FC<SP> = () => {
  const f = useCurrentFrame(); const d = useDuration();
  const Ship: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => <g transform={`translate(${x} ${y + Math.sin(f / 10 + x) * 6}) scale(${s})`}>
    <path d="M-160 0 Q-150 60 0 64 Q150 60 170 -10 Z" fill="#6E4A2A" stroke={OL} strokeWidth={5} />
    {[-60, 50].map((mx) => <g key={mx}><path d={`M${mx} 0 V-260`} stroke="#5E3A20" strokeWidth={9} /><path d={`M${mx - 70} -230 Q${mx} -200 ${mx + 70} -230 L${mx + 70} -120 Q${mx} -90 ${mx - 70} -120 Z`} fill="#F4ECD8" stroke={OL} strokeWidth={4} /></g>)}
    <path d="M55 -260 v-40" stroke="#5E3A20" strokeWidth={5} /><rect x={55} y={-300} width={50} height={30} fill="#fff" stroke={OL} strokeWidth={3} /><path d="M55 -300 L105 -270 M105 -300 L55 -270" stroke="#2E4A9A" strokeWidth={6} />
  </g>;
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <Sea horizon={560} />
      <Layer depth={1}>{[0, 1, 2].map((i) => <Ship key={i} x={interpolate(f, [0, d], [300, 520]) + i * 520} y={760 + (i % 2) * 60} s={1.0 - i * 0.12} />)}</Layer>
    </CameraRig>
  );
};
const Beards: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b35 = s.id === 's04b35';
  const cut = at(s, 'beards', 30);
  const boyar = BOYAR('#6A4A8A');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: b35 ? 1.12 : 1.04, focus: [1100, 620] }}>
        <Kremlin y={520} />
        <Layer depth={1}>
          <Chibi x={760} y={960} s={1.5} {...PETER} pose={b35 ? [{ at: 0, pose: 'hold' }, { at: cut - 4, pose: 'attack' }] : 'present'} expr="grin" talking={[]} seed="pbd" />
          <Chibi x={1240} y={960} s={1.1} {...boyar} beard={!(b35 && f >= cut)} flip pose={b35 && f >= cut ? 'bothUp' : 'idle'} expr={b35 && f >= cut ? 'shock' : 'calm'} talking={[]} seed="bbd" />
          {!b35 && <g transform="translate(1040 560)" opacity={springPop(f, at(s, 'Western') - 4)}><rect x={-80} y={-60} width={160} height={120} rx={10} fill="#2E3A5A" stroke={OL} strokeWidth={5} /><text y={10} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#fff">EUROPEAN</text><text y={42} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#fff">COAT</text></g>}
          {b35 && f >= cut && <Drop at={cut} x={1240} y={960} h={200} e={0.2}><path d="M-40 0 Q-50 -60 0 -70 Q50 -60 40 0 Z" fill="#5A3A22" stroke={OL} strokeWidth={4} /></Drop>}
        </Layer>
      </CameraRig>
      {b35 && <Label text="(or pay a beard tax)" x={1240} y={260} at={cut + 14} size={46} color="#FFD84A" />}
    </>
  );
};
const WindowH = hostShot(() => [{ at: 0, arm: 'present', expr: 'grin' }], {
  props: (s) => {
    const f = useCurrentFrame();
    return <PopProp at={at(s, 'window') - 4} x={1040} y={500}><g>
      <rect x={-150} y={-170} width={300} height={340} fill="#7FB2E5" stroke={OL} strokeWidth={8} />
      <path d={`M-150 30 ${[...Array(6)].map((_, i) => `q25 ${i % 2 ? -14 : 14} 50 0`).join(' ')} V170 H-150 Z`} fill="#2E6A9A" stroke={OL} strokeWidth={4} transform={`translate(${Math.sin(f / 8) * 10} 0)`} />
      <path d="M0 -170 V170 M-150 0 H150" stroke="#6E4A2A" strokeWidth={14} />
      <rect x={-170} y={-190} width={340} height={380} fill="none" stroke="#6E4A2A" strokeWidth={22} />
    </g></PopProp>;
  },
});

// ---------------------------------------------------------------- St Petersburg: swamp → labour → city
const SWAMP = ['s04b37', 's04b38', 's04b39', 's04b40', 's04b41', 's04b42'];
const Swamp: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const k = idx(s, SWAMP);
  const city = k >= 4 ? (k === 4 ? interpolate(f, [0, d], [0, 0.5]) : interpolate(f, [0, d * 0.7], [0.5, 1], Easing.out)) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: k >= 4 ? 1.0 : 1.03, zoomTo: k >= 4 ? 0.97 : 1.07 }}>
        <Layer depth={0}><rect x={-300} y={-300} width={2600} height={1700} fill={k >= 4 ? 'url(#skyDay)' : 'url(#skyDust)'} />{k >= 4 && <Cloud x={500} y={140} />}</Layer>
        <Layer depth={0.5}>
          {city > 0 && <g opacity={Math.min(1, city * 2)}>
            {[...Array(7)].map((_, i) => { const h = (150 + (i % 3) * 50) * Math.min(1, city * 1.6 - i * 0.08); return h > 0 ? <g key={i}><rect x={120 + i * 250} y={720 - h} width={220} height={h} fill={['#F2E0A0', '#E8C8C0', '#C8E0E0'][i % 3]} stroke={OL} strokeWidth={4} />{h > 100 && [...Array(3)].map((__, j) => <rect key={j} x={140 + i * 250 + j * 66} y={720 - h + 30} width={34} height={50} fill="#FFF" stroke={OL} strokeWidth={2} />)}</g> : null; })}
            {city > 0.6 && <g transform="translate(960 560)"><path d="M0 -60 V-360" stroke={GOLD} strokeWidth={14} /><path d="M-10 -360 L0 -440 L10 -360 Z" fill={GOLD} stroke={OL} strokeWidth={3} /><rect x={-70} y={-120} width={140} height={120} fill="#F2E0A0" stroke={OL} strokeWidth={4} /></g>}
          </g>}
        </Layer>
        <Layer depth={0.8}>
          <path d="M-300 720 L2300 720 L2300 1500 L-300 1500 Z" fill={k >= 4 ? '#7A8A9A' : '#6A7A4A'} stroke={OL} strokeWidth={3} />
          {k < 4 && [...Array(16)].map((_, i) => <path key={i} d={`M${-100 + i * 140} ${760 + (i % 3) * 40} q10 -40 0 -70 M${-90 + i * 140} ${760 + (i % 3) * 40} q-14 -30 -6 -54`} stroke="#3E5A2A" strokeWidth={5} fill="none" />)}
          {k < 4 && [...Array(8)].map((_, i) => <ellipse key={'p' + i} cx={100 + i * 250} cy={820 + (i % 2) * 50} rx={90} ry={20} fill="#4A6A6A" opacity={0.7} />)}
          {(k === 1 || k === 2 || k === 3) && [...Array(10)].map((_, i) => <path key={'s' + i} d={`M${300 + i * 140} 800 V${700 - (i % 2) * 20}`} stroke="#6E4A2A" strokeWidth={14} strokeLinecap="round" />)}
        </Layer>
        <Layer depth={1}>
          {k === 1 && <Chibi x={960} y={960} s={1.2} {...PETER} legs="stand" pose="shrug" expr="grin" talking={[]} seed="psw" />}
          {(k === 2 || k === 3) && [...Array(7)].map((_, i) => <Chibi key={i} x={200 + i * 240} y={940 + (i % 2) * 20} s={0.8} {...PEASANT(i)} item={i % 2 ? 'mallet' : 'sack'} pose={i % 2 ? 'raise' : 'carry'} expr="sad" talking={[]} seed={'lb' + i} delay={i * 3} />)}
        </Layer>
        {k === 3 && <Layer depth={1.2}><rect x={-300} y={-300} width={2600} height={1700} fill="#101018" opacity={interpolate(f, [0, d], [0, 0.35])} /></Layer>}
      </CameraRig>
      {k === 0 && <Label text="the Neva delta, 1703" x={960} y={200} at={at(s, 'Baltic')} size={54} />}
      {k === 3 && <Label text="deaths: estimates run into the tens of thousands" x={960} y={200} at={at(s, 'died')} size={42} />}
      {k >= 4 && <Label text="St Petersburg · capital from 1712" x={960} y={180} at={k === 5 ? at(s, 'Petersburg') : 999} size={58} color="#FFD84A" />}
    </>
  );
};
const Pattern = hostShot((s) => [{ at: 0, arm: s.id === 's04b43' ? 'present' : 'idle', expr: s.id === 's04b44' ? 'worried' : 'smile' }], {
  props: (s) => {
    const b44 = s.id === 's04b44';
    return <g>
      <PopProp at={b44 ? -99 : 6} x={1040} y={380}><g><rect x={-130} y={-110} width={260} height={110} fill="#F2E0A0" stroke={OL} strokeWidth={5} /><path d="M0 -110 V-220" stroke={GOLD} strokeWidth={10} /><path d="M-8 -220 L0 -270 L8 -220 Z" fill={GOLD} stroke={OL} strokeWidth={3} /></g></PopProp>
      {b44 && <g>{[...Array(8)].map((_, i) => <Person key={i} x={900 + (i % 4) * 80} y={600 + Math.floor(i / 4) * 110} s={0.9} c="#7A7A80" o={0.85} />)}</g>}
    </g>;
  },
});

export const SHOTS_04: ShotMap = {
  c3_vanish: Vanish, c3_volcano: Volcano, c3_famine: Famine, c3_troubles: Troubles, c3_kremlin: KremlinPol, c3_minin: Minin,
  c3_romanov: Romanov, c3_problem: ProblemH, c3_walkaway: WalkAway, c3_needs: Needs, c3_code: Code, c3_serfdom: Serfdom,
  c3_imagine: Imagine, c3_arith: Arith, c3_peter: PeterShot, c3_shipyard: Shipyard, c3_navy: Navy, c3_beards: Beards,
  c3_window: WindowH, c3_swamp: Swamp, c3_pattern: Pattern,
};
