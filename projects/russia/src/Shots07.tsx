/** Chapter 6: The War That Spent 27 Million. Restraint: no bodies, no combat violence; objects, light and numbers. */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL, Hills } from '@engine/scenes/Parts';
import { Taiga, Snow, SnowPine, SmokeColumn } from '@engine/scenes/Russia';
import { Tank } from '@engine/scenes/Vietnam';
import { Factory } from '@engine/scenes/IndiaB3';
import { hostShot, wordAt, PopProp, type ShotMap, type SP } from '@engine/kit';
import { W, dress, SKIN } from '@engine/cast/Wardrobe';
import { Calendar, Bars } from '@engine/fx/Infographics';
import { SOLDIER_WW2, RED, PAPER, GOLD } from './Cast';
import { idx, at, Sign, Insert, Flag, Person, Candle, hostDim } from './Kit2';

const WORKER = (i = 0) => ({ ...dress(W.PEASANT(['#4A4A5A', '#5A4A3A', '#3A4A5A'][i % 3], i), { hat: i % 2 ? 'scarf' : 'cap', hatColor: i % 2 ? '#C0392B' : '#2A2A34' }), skin: SKIN.light });
const RED_ARMY = { ...SOLDIER_WW2, item: 'musket' };

const Barb = hostShot((s) => [{ at: 0, arm: 'present', expr: 'worried' }], {
  props: (s) => <PopProp at={4} x={1040} y={470}><Calendar x={0} y={0} s={0.7} month="JUNE" day={22} year={1941} color="#8C1D18" /></PopProp>,
});

// ---------------------------------------------------------------- siege of Leningrad
const SIEGE = ['s07b08', 's07b09', 's07b10'];
const Siege: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const k = idx(s, SIEGE);
  const days = Math.round(k === 0 ? interpolate(f, [at(s, 'lasted') - 6, at(s, 'days') + 6], [1, 872], Easing.out) : 872);
  if (k === 1) return (
    <Insert glow={false}>
      <g transform="translate(960 560)">
        <rect x={-300} y={-60} width={600} height={40} rx={8} fill="#8A6A4A" stroke={OL} strokeWidth={5} />
        <g transform="translate(0 -60)"><rect x={-40} y={-50} width={80} height={50} rx={10} fill="#6A5A44" stroke={OL} strokeWidth={4} /></g>
        <text y={-200} textAnchor="middle" fontFamily="TagBold" fontSize={56} fill={PAPER}>125 g</text>
        <text y={-140} textAnchor="middle" fontFamily="Tag" fontSize={32} fill="#C9C2B4">daily bread ration, Nov–Dec 1941</text>
      </g>
    </Insert>
  );
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-300} y={-300} width={2600} height={1700} fill="url(#skyWinter)" /><rect x={-300} y={-300} width={2600} height={1700} fill="#3A4050" opacity={0.35} /></Layer>
        <Layer depth={0.5}>{[...Array(7)].map((_, i) => <g key={i}><rect x={-100 + i * 320} y={300} width={300} height={480} fill={['#C8C0B0', '#B8B0A8', '#A8B0B8'][i % 3]} stroke={OL} strokeWidth={4} />{[...Array(9)].map((_, j) => <rect key={j} x={-70 + i * 320 + (j % 3) * 90} y={340 + Math.floor(j / 3) * 140} width={50} height={70} fill="#2A2E3A" stroke={OL} strokeWidth={3} />)}</g>)}<path d="M-300 780 H2300 V1500 H-300 Z" fill="#E8EEF2" stroke={OL} strokeWidth={3} /></Layer>
        {k === 2 && <Layer depth={0.9}><g transform="translate(700 860)"><rect x={-60} y={-40} width={120} height={40} fill="#6A5A44" stroke={OL} strokeWidth={4} /><path d="M-60 -40 L-30 -70 H30 L60 -40" fill="#C9B89A" stroke={OL} strokeWidth={4} /></g></Layer>}
        <Layer depth={1.1}><Snow density={70} wind={-0.8} /></Layer>
      </CameraRig>
      <Label text="Leningrad" x={960} y={160} at={4} size={56} color="#C9C2B4" />
      {k === 0 && <Label text={`${days} days`} x={960} y={260} at={at(s, 'lasted') - 6} size={70} color="#FFD84A" />}
      {k === 2 && <Label text="wallpaper paste · leather belts boiled for glue" x={960} y={260} at={at(s, 'wallpaper')} size={44} />}
    </>
  );
};

// ---------------------------------------------------------------- Tanya Savicheva's notebook
const ENTRIES = [
  { who: 'Zhenya (sister)', when: '28 Dec 1941' },
  { who: 'Grandmother', when: '25 Jan 1942' },
  { who: 'Leka (brother)', when: '17 Mar 1942' },
  { who: 'Uncle Vasya', when: '13 Apr 1942' },
  { who: 'Uncle Lyosha', when: '10 May 1942' },
  { who: 'Mama', when: '13 May 1942' },
];
const TANYA = ['s07b11', 's07b12', 's07b13', 's07b14', 's07b17', 's07b18', 's07b19', 's07b20', 's07b21'];
const Notebook: React.FC<{ shown: number; last: number; p: number; lo?: number[] }> = ({ shown, last, p, lo = [1, 1, 1] }) => (
  <g transform="translate(960 520)">
    <rect x={-520} y={-330} width={1040} height={640} rx={20} fill="#3A2E28" stroke={OL} strokeWidth={8} />
    <rect x={-490} y={-300} width={480} height={580} fill="#F1E8D4" stroke={OL} strokeWidth={4} />
    <rect x={10} y={-300} width={480} height={580} fill="#F1E8D4" stroke={OL} strokeWidth={4} />
    {[...Array(9)].map((_, i) => <path key={i} d={`M-470 ${-240 + i * 60} H-30 M30 ${-240 + i * 60} H470`} stroke="#C8D4E0" strokeWidth={2} />)}
    {ENTRIES.slice(0, shown).map((e, i) => (
      <g key={i} transform={`translate(${i < 3 ? -470 : 30} ${-190 + (i % 3) * 170})`} opacity={i === shown - 1 ? p : 1}>
        <text fontFamily="Hand" fontSize={52} fill="#2A2A3A">{e.who}</text>
        <text y={60} fontFamily="Hand" fontSize={40} fill="#5A5A6A">{e.when}</text>
      </g>
    ))}
    {last > 0 && <g opacity={last}>
      <rect x={-490} y={-300} width={980} height={580} fill="#F1E8D4" stroke={OL} strokeWidth={4} />
      {['The Savichevs died.', 'Everyone died.', 'Only Tanya is left.'].map((t, i) => <text key={i} x={0} y={-120 + i * 130} textAnchor="middle" fontFamily="Hand" fontSize={64} fill="#2A2A3A" opacity={lo[i]}>{t}</text>)}
    </g>}
  </g>
);
const Tanya: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const k = idx(s, TANYA);
  if (k <= 1) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 560] }}>
        <InsertBg glow={false} />
        <Layer depth={1}>
          <g transform="translate(960 520)"><rect x={-180} y={-240} width={360} height={480} rx={14} fill="#3A2E28" stroke={OL} strokeWidth={8} /><rect x={-150} y={-210} width={300} height={420} fill="#F1E8D4" /><text y={-120} textAnchor="middle" fontFamily="Hand" fontSize={54} fill="#2A2A3A">Tanya</text><text y={-60} textAnchor="middle" fontFamily="Hand" fontSize={54} fill="#2A2A3A">Savicheva</text></g>
        </Layer>
      </CameraRig>
      {k === 1 && <Label text="born 23 January 1930" x={960} y={140} at={at(s, 'eleven')} size={44} color="#C9C2B4" />}
    </>
  );
  const shown = k === 2 ? 0 : k === 3 ? 1 : k === 4 ? 3 : k === 5 ? 5 : 6;
  const p = interpolate(f, [4, 20], [0, 1]);
  const last = k >= 7 ? interpolate(f, [k === 7 ? at(s, 'few') - 10 : 0, (k === 7 ? at(s, 'few') : 0) + 2], [0, 1]) : 0;
  const dim = k === 8 ? interpolate(f, [0, d], [0, 0.55]) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03, focus: [960, 520] }}>
        <InsertBg glow={false} />
        <Layer depth={1}><Notebook shown={shown} last={last} p={p} lo={[0, 1, 2].map((i) => (k === 8 ? 1 : interpolate(f, [at(s, 'few') + i * 12, at(s, 'few') + 10 + i * 12], [0, 1])))} /></Layer>
        <Layer depth={1.2}><rect x={-300} y={-300} width={2600} height={1700} fill="#000" opacity={dim} /></Layer>
      </CameraRig>
      {k === 8 && <Label text="Tanya Savicheva · died 1 July 1944, aged 14" x={960} y={140} at={10} size={44} color="#C9C2B4" />}
    </>
  );
};
const Candles: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b23 = s.id === 's07b23';
  const n = b23 ? 30 : 12;
  return (
    <>
      <CameraRig move={{ zoomFrom: b23 ? 1.04 : 1.0, zoomTo: b23 ? 0.96 : 1.03 }}>
        <InsertBg glow={false} />
        <Layer depth={1}>{[...Array(n)].map((_, i) => <g key={i} opacity={springPop(f, i * (b23 ? 2 : 4))}><Candle x={220 + (i % 10) * 165} y={520 + Math.floor(i / 10) * 180} s={0.6} seed={'cn' + i} /></g>)}</Layer>
      </CameraRig>
      <Label text={b23 ? 'estimates: 800,000 to over 1 million civilians' : 'civilians of Leningrad'} x={960} y={160} at={6} size={46} color="#C9C2B4" />
    </>
  );
};
const SizeH = hostShot((s) => [{ at: 0, arm: 'present', expr: 'proud' }], {
  props: (s) => <PopProp at={at(s, 'size') - 3} x={1100} y={480} s={0.8}><g><path d="M-170 -40 Q-120 -110 -20 -100 Q80 -130 170 -80 Q190 -10 120 20 Q40 60 -40 40 Q-140 60 -170 -40 Z" fill={RED} stroke={OL} strokeWidth={6} /><path d="M-200 100 H200" stroke="#3A3A48" strokeWidth={6} /><path d="M-200 80 V120 M200 80 V120" stroke="#3A3A48" strokeWidth={6} /><text y={160} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#3A3A48">SPACE TO RETREAT INTO</text></g></PopProp>,
});
const FactoryEast: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const k = idx(s, ['s07b27', 's07b28', 's07b29']);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Taiga winter ground={760} />
        <Layer depth={0.7}><Factory x={600} y={780} s={0.95} /><Factory x={1400} y={780} s={0.8} /></Layer>
        <Layer depth={1}>
          {k === 0 && [...Array(6)].map((_, i) => <Chibi key={i} x={interpolate(f, [0, d], [-200, 500]) + i * 160} y={940} s={0.8} {...WORKER(i)} item={i % 2 ? 'bundle' : 'sack'} legs="walk" pose="carry" expr="determined" talking={[]} seed={'fw' + i} delay={i * 3} />)}
          {k === 1 && [...Array(5)].map((_, i) => <Chibi key={i} x={300 + i * 330} y={940} s={0.85} {...WORKER(i)} item="hammer" pose={[{ at: 0, pose: 'raise' }, { at: 10 + i * 3, pose: 'hold' }, { at: 20 + i * 3, pose: 'raise' }, { at: 30 + i * 3, pose: 'hold' }]} expr="determined" talking={[]} seed={'fh' + i} />)}
          {k === 2 && [0, 1, 2].map((i) => <Tank key={i} x={interpolate(f, [0, d], [700, 1700]) - i * 420} y={900} s={0.65} color="#4E5A3A" star />)}
        </Layer>
        <Layer depth={1.1}><Snow density={30} /></Layer>
      </CameraRig>
      {k === 1 && <Label text="beyond the Urals: out of bombers' reach" x={960} y={180} at={6} size={48} />}
      {k === 2 && <Label text="≈ 100,000 tanks built, 1941–45" x={960} y={180} at={at(s, 'tanks')} size={50} color="#FFD84A" />}
    </>
  );
};

// ---------------------------------------------------------------- Stalingrad
const STG = ['s07b30', 's07b31', 's07b32', 's07b33'];
const Stalingrad: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const k = idx(s, STG);
  if (k === 3) {
    const sw = interpolate(f, [at(s, 'turned') - 8, at(s, 'turned') + 16], [0, 180], Easing.inOut);
    return (
      <Insert>
        <g transform="translate(960 520)"><g transform={`rotate(${sw})`}><path d="M-300 0 H220" stroke={RED} strokeWidth={34} strokeLinecap="round" /><path d="M180 -70 L290 0 L180 70" fill="none" stroke={RED} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" /></g></g>
        <text x={960} y={260} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill={PAPER}>THE TIDE TURNS</text>
      </Insert>
    );
  }
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Layer depth={0}><rect x={-300} y={-300} width={2600} height={1700} fill="url(#skyDust)" /></Layer>
        <Layer depth={0.5}>
          {[...Array(7)].map((_, i) => { const h = 220 + random('sg' + i) * 220; return <g key={i}><path d={`M${-100 + i * 320} 780 V${780 - h} l60 ${30 + random('a' + i) * 40} l50 ${-40} l60 ${50} l40 -30 l50 ${40} V780 Z`} fill="#8A847A" stroke={OL} strokeWidth={4} strokeLinejoin="round" />{[...Array(4)].map((_, j) => <rect key={j} x={-60 + i * 320 + (j % 2) * 120} y={780 - h + 80 + Math.floor(j / 2) * 100} width={50} height={60} fill="#2A2A30" stroke={OL} strokeWidth={3} />)}</g>; })}
          <path d="M-300 780 H2300 V1500 H-300 Z" fill="#9A8E7C" stroke={OL} strokeWidth={3} />
          {[0, 1, 2].map((i) => <SmokeColumn key={i} x={300 + i * 600} y={560} s={0.8} at={-60} seed={'stg' + i} />)}
        </Layer>
        <Layer depth={1}>
          {k === 2 && <g><Flag kind="white" x={980} y={560} s={0.6} pole={300} />{[...Array(5)].map((_, i) => <Chibi key={i} x={760 + i * 120} y={950} s={0.8} {...dress(W.PRUSSIAN, { item: undefined, outfit: { top: '#6A6A62', bottom: '#5A5A54' }, hatColor: '#5A5A54' })} pose="bothUp" expr="sad" talking={[]} seed={'gs' + i} />)}</g>}
        </Layer>
        <Layer depth={1.1}><Snow density={k === 2 ? 60 : 20} /></Layer>
      </CameraRig>
      {k === 0 && <Label text="Stalingrad, August 1942" x={960} y={180} at={at(s, 'Stalingrad')} size={56} />}
      {k === 1 && <Label text="house by house, for five months" x={960} y={180} at={at(s, 'house')} size={52} />}
      {k === 2 && <Label text="2 February 1943 · ≈ 91,000 taken prisoner" x={960} y={180} at={at(s, 'surrendered')} size={48} />}
    </>
  );
};
const Berlin: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05 }}>
        <Layer depth={0}><rect x={-300} y={-300} width={2600} height={1700} fill="url(#skyDust)" /></Layer>
        <Layer depth={0.6}>
          <g transform="translate(960 780)">
            <rect x={-520} y={-300} width={1040} height={300} fill="#A89C88" stroke={OL} strokeWidth={6} />
            {[...Array(8)].map((_, i) => <rect key={i} x={-480 + i * 124} y={-260} width={50} height={220} fill="#8A7E6C" stroke={OL} strokeWidth={4} />)}
            <path d="M-200 -300 Q0 -470 200 -300 Z" fill="#7A8A80" stroke={OL} strokeWidth={6} />
            {[-500, 440].map((x) => <rect key={x} x={x} y={-400} width={60} height={100} fill="#A89C88" stroke={OL} strokeWidth={5} />)}
            <Flag kind="ussr" x={0} y={-640} s={0.8} pole={300} raise={interpolate(f, [at(s, 'Berlin') - 10, at(s, 'Berlin') + 16], [0, 1], Easing.out)} />
          </g>
          <path d="M-300 780 H2300 V1500 H-300 Z" fill="#9A8E7C" stroke={OL} strokeWidth={3} />
        </Layer>
      </CameraRig>
      <Label text="the Reichstag, Berlin · May 1945" x={1460} y={420} at={4} size={50} />
    </>
  );
};
const COST = ['s07b35', 's07b36', 's07b37'];
const Cost: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = idx(s, COST);
  if (k === 0) return (
    <Insert glow={false}>
      {[...Array(60)].map((_, i) => <Person key={i} x={300 + (i % 15) * 94} y={330 + Math.floor(i / 15) * 130} s={0.9} c="#9A9AA0" o={springPop(f, i * 0.6)} />)}
    </Insert>
  );
  const bars = [
    { label: 'USSR', v: 27, c: '#B3261E', at: k === 1 ? at(s, '27') - 6 : -99, text: '≈ 27M' },
    { label: 'China', v: 17.5, c: '#8A8A90', at: k === 2 ? 4 : 9999, text: '15–20M' },
    { label: 'Germany', v: 7, c: '#8A8A90', at: k === 2 ? 8 : 9999, text: '≈ 7M' },
    { label: 'Poland', v: 6, c: '#8A8A90', at: k === 2 ? 12 : 9999, text: '≈ 6M' },
    { label: 'Japan', v: 3, c: '#8A8A90', at: k === 2 ? 16 : 9999, text: '≈ 3M' },
    { label: 'USA', v: 0.42, c: '#8A8A90', at: k === 2 ? 20 : 9999, text: '0.4M' },
  ];
  return (
    <Insert glow={false}>
      <text x={960} y={140} textAnchor="middle" fontFamily="TagBold" fontSize={42} fill={PAPER}>WORLD WAR II DEATHS (military + civilian)</text>
      <Bars x={300} y={800} bars={bars} max={27} h={540} w={170} gap={50} labelSize={30} />
    </Insert>
  );
};
const Lesson = hostDim((s) => [{ at: 0, arm: s.id === 's07b39' ? 'fist' : 'chin', expr: s.id === 's07b39' ? 'worried' : 'smile' }], (s) => s.id === 's07b39'
  ? <PopProp at={at(s, 'Never') - 4} x={1040} y={560}><g>{[...Array(3)].map((_, r) => [...Array(4)].map((__, c) => <rect key={r + '-' + c} x={-140 + c * 70 + (r % 2) * 35} y={-r * 46} width={66} height={42} fill="#B8A890" stroke={OL} strokeWidth={4} />))}<text y={80} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill="#3A3A48">A WALL TO THE WEST</text></g></PopProp>
  : null, 0.2);

export const SHOTS_07: ShotMap = {
  c6_barb: Barb, c6_siege: Siege, c6_tanya: Tanya, c6_candles: Candles, c6_size: SizeH, c6_factory: FactoryEast,
  c6_stalingrad: Stalingrad, c6_berlin: Berlin, c6_cost: Cost, c6_lesson: Lesson,
};
