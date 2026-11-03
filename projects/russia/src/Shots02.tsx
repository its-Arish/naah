/** Chapter 1: A Country With No Walls (Vikings, Kievan Rus, the Mongols). */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop, onTwos, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL, Cloud } from '@engine/scenes/Parts';
import { Plain } from '@engine/scenes/India';
import { Taiga, LogHut, Longship, RiverScene, OnionChurch, ByzDome, KhanCamp, Snow, SmokeColumn, SnowPine } from '@engine/scenes/Russia';
import { hostShot, wordAt, PopProp, Drop, Rider, type ShotMap, type SP } from '@engine/kit';
import { Calendar, CoinArc, Card } from './Cast';
import { PEASANT, VIKING, TRIBE, PRINCE, PRIEST, MONGOL, KHAN, FRIAR, MEDIEVAL, MERCHANT, SCHOLAR, RED, PAPER, GOLD } from './Cast';

// ------------------------------------------------------------------ "Stand in Germany and look east."
const LookEast = hostShot(() => [{ at: 0, arm: 'point', expr: 'smile' }], {
  props: () => <PopProp at={8} x={1040} y={560}><g>
    <rect x={-8} y={-40} width={16} height={330} fill="#6E4A2A" stroke={OL} strokeWidth={4} />
    <path d="M-150 -150 H130 L180 -100 L130 -50 H-150 Z" fill={PAPER} stroke={OL} strokeWidth={6} strokeLinejoin="round" />
    <text x={-10} y={-82} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill={RED}>EAST</text>
  </g></PopProp>,
});

// ------------------------------------------------------------------ armies, traders, invaders cross the plain
const Cross: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const k = ['s02b05', 's02b06', 's02b07'].indexOf(s.id);
  const x0 = interpolate(f, [0, d], [-200, 500]);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <Plain tents={false} />
      <Layer depth={1}>
        {k === 0 && [...Array(7)].map((_, i) => <Chibi key={i} x={x0 + i * 170} y={900 - (i % 2) * 20} s={0.95} {...MEDIEVAL(i)} legs="march" pose="hold" expr="determined" talking={[]} seed={'ar' + i} delay={i * 2} />)}
        {k === 1 && <>
          {[0, 1].map((i) => <Chibi key={i} x={x0 + 200 + i * 220} y={900} s={0.95} {...MERCHANT(i)} legs="walk" pose="carry" expr="happy" talking={[]} seed={'tr' + i} />)}
          <Rider x={x0 + 700} y={910} s={0.8} gait="walk" rider={{ ...MERCHANT(1), item: undefined }} />
        </>}
        {k === 2 && [...Array(5)].map((_, i) => <Rider key={i} x={interpolate(f, [0, d], [-400, 1500]) + i * 230 - (i % 2) * 80} y={910 - (i % 2) * 30} s={0.75} gait="gallop" phase={i * 3} silhouette rider={MONGOL(i)} />)}
      </Layer>
    </CameraRig>
  );
};

// ------------------------------------------------------------------ the Vikings on the river
const Ship: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g>
    {[-230, 170, 250].map((dx, i) => <Chibi key={i} x={x + dx * s} y={y - 20 * s} s={0.62 * s} {...VIKING(i)} pose={i === 0 ? 'point' : 'pull'} expr="determined" talking={[]} seed={'vk' + i} />)}
    <Longship x={x} y={y} s={s} />
  </g>
);
const LongshipShot: React.FC<SP> = () => {
  const f = useCurrentFrame(); const d = useDuration();
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <RiverScene />
      <Layer depth={1}><Ship x={interpolate(f, [0, d], [300, 1200])} y={820} s={0.95} /></Layer>
    </CameraRig>
  );
};
const Rus: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.06, zoomTo: 1.12, focus: [960, 600] }}>
        <RiverScene />
        <Layer depth={1}><Ship x={interpolate(f, [0, d], [880, 1040])} y={820} s={1.05} /></Layer>
      </CameraRig>
      <Label text="the Rus'" x={1250} y={220} at={wordAt(s, 'Rus') - 2} size={86} color="#FFD84A" />
    </>
  );
};

// ------------------------------------------------------------------ the invitation
const Tribes: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b13 = s.id === 's02b13';
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <Taiga winter={false} ground={760} />
      <Layer depth={0.85}><LogHut x={1560} y={790} s={0.55} seed="tb" /></Layer>
      <Layer depth={1}>
        <Chibi x={560} y={930} s={1.05} {...TRIBE(0)} pose={b13 ? 'cross' : [{ at: 0, pose: 'fist' }, { at: 14, pose: 'hipAngry' }, { at: 28, pose: 'fist' }]} expr={b13 ? 'sad' : 'angry'} talking={b13 ? [] : [[4, 60]]} seed="t1" />
        <Chibi x={820} y={930} s={1.05} {...TRIBE(1)} flip pose={b13 ? 'cross' : [{ at: 0, pose: 'hipAngry' }, { at: 12, pose: 'fist' }]} expr={b13 ? 'sad' : 'angry'} talking={b13 ? [] : [[10, 70]]} seed="t2" />
        {b13 && <Chibi x={1180} y={930} s={1.1} {...TRIBE(2)} item="scroll" pose={[{ at: 0, pose: 'scribble' }, { at: wordAt(s, 'invitation'), pose: 'present' }]} expr="calm" talking={[]} seed="t3" />}
        {!b13 && <g opacity={springPop(f, 10)}><text x={690} y={560} textAnchor="middle" fontFamily="Hand" fontSize={90} fill="#141414">#@!</text></g>}
      </Layer>
    </CameraRig>
  );
};
const Letter: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b15 = s.id === 's02b15';
  const lines = 7;
  const p = b15 ? 1 : interpolate(f, [0, d], [0, 0.75]);
  const p2 = b15 ? interpolate(f, [0, d], [0.75, 1]) : p;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform="translate(960 470) rotate(-2)">
            <rect x={-420} y={-330} width={840} height={660} rx={18} fill="#EADCB8" stroke={OL} strokeWidth={7} />
            <circle cx={-420} cy={-330} r={30} fill="#D9C79A" stroke={OL} strokeWidth={5} /><circle cx={420} cy={330} r={30} fill="#D9C79A" stroke={OL} strokeWidth={5} />
            {[...Array(lines)].map((_, i) => { const w = Math.max(0, Math.min(1, p2 * lines - i)); return w > 0 ? <path key={i} d={`M-330 ${-220 + i * 70} ${[...Array(14)].map((__, j) => `q14 ${j % 2 ? -18 : 18} ${48 * w} 0`).join(' ')}`} stroke="#5A3A22" strokeWidth={5} fill="none" strokeLinecap="round" /> : null; })}
            {b15 && <g opacity={springPop(f, wordAt(s, 'rule'))}><circle cx={260} cy={240} r={56} fill={RED} stroke={OL} strokeWidth={5} /><path d="M236 240 h48 M260 216 v48" stroke="#F4ECD8" strokeWidth={8} /></g>}
          </g>
        </Layer>
      </CameraRig>
      <Label text="Primary Chronicle (c. 1113)" x={960} y={95} at={4} size={44} color="#FFD84A" />
    </>
  );
};

// ------------------------------------------------------------------ "Historians debate…"
const Debate = hostShot((s) => [{ at: 0, arm: s.id === 's02b16' ? 'shrug' : 'finger', expr: s.id === 's02b16' ? 'smile' : 'grin' }], {
  props: (s) => s.id === 's02b16'
    ? <g>
      <Chibi x={930} y={960} s={0.8} {...SCHOLAR(0)} pose={[{ at: 0, pose: 'point' }, { at: 30, pose: 'shrug' }]} expr="angry" talking={[[4, 40]]} seed="sc1" />
      <Chibi x={1140} y={960} s={0.8} {...SCHOLAR(1)} flip pose={[{ at: 0, pose: 'cross' }, { at: 24, pose: 'point' }]} expr="angry" talking={[[30, 70]]} seed="sc2" />
    </g>
    : <Drop at={wordAt(s, 'stuck') - 8} x={1040} y={640} h={600} e={0.2}><g><rect x={-170} y={-150} width={340} height={150} rx={16} fill="#FFD84A" stroke={OL} strokeWidth={6} /><text x={0} y={-56} textAnchor="middle" fontFamily="TagBold" fontSize={70} fill={RED}>RUS'</text></g></Drop>,
});

// ------------------------------------------------------------------ Vladimir chooses Orthodox Christianity (988)
const Baptism: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05 }}>
        <RiverScene ground={640} />
        <Layer depth={0.7}><g transform="translate(1500 640)"><ByzDome x={0} y={0} s={0.42} /></g></Layer>
        <Layer depth={0.85}><path d="M-300 800 Q400 770 960 790 Q1500 810 2300 780 L2300 1500 L-300 1500 Z" fill="#8FAE5E" stroke={OL} strokeWidth={4} /></Layer>
        <Layer depth={1}>
          <Chibi x={640} y={930} s={1.15} {...PRINCE()} pose={[{ at: 0, pose: 'idle' }, { at: wordAt(s, 'chose'), pose: 'present' }]} expr="calm" talking={[]} seed="vlad" />
          <Chibi x={960} y={930} s={1.05} {...PRIEST} flip pose="present" expr="calm" talking={[]} seed="pr" />
          {[0, 1, 2, 3].map((i) => <Chibi key={i} x={1180 + i * 150} y={940} s={0.8} {...PEASANT(i)} pose="pray" expr="calm" talking={[]} seed={'bp' + i} />)}
        </Layer>
      </CameraRig>
      <Label text="Vladimir, Grand Prince of Kyiv" x={640} y={300} at={wordAt(s, 'Vladimir')} size={46} />
    </>
  );
};
const Byzantium: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const words = ['religion,', 'art,', 'politics'];
  const t = interpolate(f, [4, 30], [0, 1], Easing.out);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          <OnionChurch x={430} y={620} s={0.75} dome="#7FB2E5" />
          <ByzDome x={1500} y={620} s={0.85} />
          <path d={`M640 520 L${640 + 640 * t} 520`} stroke={GOLD} strokeWidth={10} strokeDasharray="24 14" />
          <text x={430} y={700} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#F4ECD8">KYIV</text>
          <text x={1500} y={700} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#F4ECD8">CONSTANTINOPLE</text>
        </Layer>
      </CameraRig>
      {words.map((w, i) => <Card key={w} at={wordAt(s, w) - 2} left={720 + i * 240} top={350 - (i % 2) * 40} text={w.replace(/,/g, '').toUpperCase()} size={34} rot={[-4, 3, -2][i]} />)}
    </>
  );
};

// ------------------------------------------------------------------ the Mongols, winter 1237
const MongolsShot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b22 = s.id === 's02b22';
  const start = b22 ? wordAt(s, 'Mongols') - 10 : 0;
  const x = (i: number) => interpolate(f, [start, start + 120], [2100 + i * 200, 1000 + i * 200 - (b22 ? 0 : 700)]);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05 }}>
      <Taiga winter ground={790} />
      <Layer depth={1}>
        {f >= start && [...Array(b22 ? 4 : 7)].map((_, i) => <Rider key={i} x={x(i) + (i % 2) * 60} y={900 - (i % 3) * 26} s={0.8} flip gait="gallop" phase={i * 4} rider={MONGOL(i)} />)}
        <Snow density={80} wind={-1.4} />
      </Layer>
    </CameraRig>
  );
};
const Ice: React.FC<SP> = () => {
  const f = useCurrentFrame(); const d = useDuration();
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <RiverScene frozen ground={600} />
      <Layer depth={1}>
        {[...Array(8)].map((_, i) => <Rider key={i} x={interpolate(f, [0, d], [-400, 1300]) + i * 190 - (i % 2) * 40} y={820 + (i % 2) * 40} s={0.7} gait="gallop" phase={i * 3} rider={MONGOL(i)} />)}
        <Snow density={50} />
      </Layer>
    </CameraRig>
  );
};
const Fall: React.FC<SP> = () => {
  const f = useCurrentFrame();
  const towns = [[380, 700], [800, 640], [1180, 680], [1560, 650]];
  return (
    <CameraRig move={{ zoomFrom: 1.04, zoomTo: 1.0 }}>
      <Taiga winter ground={760} />
      <Layer depth={0.7}>
        {towns.map(([x, y], i) => <g key={i}><LogHut x={x - 50} y={y + 40} s={0.22} snow smoke={false} /><LogHut x={x + 40} y={y + 46} s={0.18} snow smoke={false} /><SmokeColumn x={x} y={y} s={0.7} at={6 + i * 14} seed={'fs' + i} /></g>)}
      </Layer>
      <Layer depth={1}><Snow density={40} /></Layer>
    </CameraRig>
  );
};
const Kyiv1240: React.FC<SP> = () => (
  <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
    <InsertBg glow={false} />
    <Layer depth={1}>
      <Calendar x={700} y={470} month="DECEMBER" day={1240} color="#5A5A64" />
      <g transform="translate(1300 640)" opacity={0.9}><OnionChurch x={0} y={0} s={0.7} dome="#9A9A9A" /><SmokeColumn x={40} y={-380} s={0.6} at={0} seed="ky" /></g>
      <text x={1300} y={720} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#C9C2B4">KYIV</text>
    </Layer>
  </CameraRig>
);
const Traveller: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Taiga winter ground={720} />
        <Layer depth={0.9}>
          {[...Array(9)].map((_, i) => <g key={i} transform={`translate(${200 + i * 200 + (i % 2) * 50} ${800 + (i % 3) * 40})`}><path d="M-34 0 Q0 -26 34 0 Z" fill="#B8C4CE" stroke="#8A98A6" strokeWidth={3} /><path d="M0 -20 V-62 M-14 -48 H14" stroke="#6A6A70" strokeWidth={5} strokeLinecap="round" /></g>)}
          <Chibi x={interpolate(f, [0, d], [300, 700])} y={900} s={0.95} {...FRIAR} legs="walk" pose="idle" expr="sad" talking={[]} seed="fr" />
        </Layer>
        <Layer depth={1}><Snow density={30} /></Layer>
      </CameraRig>
      <Label text="Giovanni da Pian del Carpine, 1246" x={1200} y={200} at={8} size={42} />
    </>
  );
};

// ------------------------------------------------------------------ the khan's court: princes pay tribute
const Khan: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = ['s02b28', 's02b30', 's02b31'].indexOf(s.id);
  const princeX = (i: number) => (k === 0 ? 2300 : k === 1 ? interpolate(f, [0, 40], [2100 + i * 160, 1300 + i * 170], Easing.out) : 1300 + i * 170);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <KhanCamp />
      <Layer depth={1}>
        <rect x={760} y={790} width={400} height={50} fill="#8C1D18" stroke={OL} strokeWidth={4} />
        <Chibi x={960} y={820} s={1.25} {...KHAN} legs="sit" pose={k === 0 ? [{ at: 0, pose: 'idle' }, { at: wordAt(s, 'ruled'), pose: 'raise' }] : k === 2 ? 'present' : 'hipAngry'} expr={k === 2 ? 'grin' : 'determined'} talking={[]} seed="khan" />
        {[0, 1, 2].map((i) => <Chibi key={i} x={princeX(i)} y={870} s={0.95} {...PRINCE(['#B3261E', '#2E6A5A', '#6A4A8A'][i])} flip legs={k === 2 ? 'kneel' : 'walk'} item={k === 2 ? 'sack' : undefined} pose={k === 2 ? 'present' : 'idle'} expr="sad" talking={[]} seed={'pc' + i} />)}
        {k === 2 && <CoinArc from={[1300, 760]} to={[1040, 700]} start={wordAt(s, 'tribute') - 6} every={4} n={10} c={GOLD} sym="" />}
        {[0, 1].map((i) => <Chibi key={i} x={620 - i * 160} y={870} s={0.95} {...MONGOL(i)} pose="hold" expr="determined" talking={[]} seed={'gd' + i} />)}
      </Layer>
    </CameraRig>
  );
};

// ------------------------------------------------------------------ "one small town learned to play that game"
const Moscow = hostShot((s) => [{ at: 0, arm: 'present', expr: 'grin' }], {
  props: (s) => <PopProp at={wordAt(s, 'town') - 3} x={1040} y={720}><g>
    <path d="M-200 30 Q0 -10 200 30 L200 60 L-200 60 Z" fill="#8FAE5E" stroke={OL} strokeWidth={4} />
    <LogHut x={-100} y={30} s={0.32} seed="mh1" />
    <LogHut x={110} y={34} s={0.28} seed="mh2" />
    <OnionChurch x={10} y={20} s={0.3} />
  </g></PopProp>,
});

export const SHOTS_02: ShotMap = {
  c1_lookeast: LookEast, c1_cross: Cross, c1_longship: LongshipShot, c1_rus: Rus, c1_tribes: Tribes, c1_letter: Letter,
  c1_debate: Debate, c1_baptism: Baptism, c1_byzantium: Byzantium, c1_mongols: MongolsShot, c1_ice: Ice, c1_fall: Fall,
  c1_kyiv1240: Kyiv1240, c1_traveller: Traveller, c1_khan: Khan, c1_moscow: Moscow,
};
