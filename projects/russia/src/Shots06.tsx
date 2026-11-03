/** Chapter 5: Collapse, and the Man of Steel. Sombre beats are symbolic and still: no violence shown. */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL, Hills } from '@engine/scenes/Parts';
import { Taiga, LogHut, Snow, SnowPine, SmokeColumn } from '@engine/scenes/Russia';
import { Sea, Tank } from '@engine/scenes/Vietnam';
import { Factory } from '@engine/scenes/IndiaB3';
import { Silhouette } from '@engine/cast/Silhouette';
import { hostShot, wordAt, PopProp, Drop, type ShotMap, type SP } from '@engine/kit';
import { W, dress, SKIN } from '@engine/cast/Wardrobe';
import { Counter, Calendar } from '@engine/fx/Infographics';
import { PEASANT, SOLDIER_WW2, RED, PAPER, GOLD } from './Cast';
import { idx, at, Sign, Hand, Insert, Flag, Kremlin, Person, Candle, hostDim, SnowRoad } from './Kit2';

const WW1 = { outfit: { top: '#8A8A5A', bottom: '#7A7A4A', belt: '#4A3A1A' }, hat: 'cap', hatColor: '#6A6A44', skin: SKIN.light };
const WORKER = (i = 0) => ({ ...dress(W.PEASANT(['#5A4A3A', '#3A4A5A', '#6A3A2A'][i % 3], i), { hat: ['cap', 'scarf', 'cap'][i % 3], hatColor: ['#3A3A48', '#C0392B', '#2A2A34'][i % 3] }), skin: SKIN.light });
const LENIN = dress(W.SUIT('#2A2A30', '#3A2A1A'), { hat: 'bald', beard: true, beardColor: '#7A4A2A', mustache: true });
const STALIN = dress(W.GENERAL_1940, { outfit: { top: '#8A8A70', bottom: '#5A5A48' }, hat: 'hair', hair: '#2A1B12', hatColor: '#2A1B12', mustache: true });

// ---------------------------------------------------------------- 1904: war with Japan
const Japan = hostShot((s) => [{ at: 0, arm: 'present', expr: 'grin' }], {
  props: (s) => <g><PopProp at={at(s, 'Japan') - 2} x={1110} y={360}><g><rect x={-150} y={-60} width={300} height={120} rx={14} fill={PAPER} stroke={OL} strokeWidth={6} /><text y={16} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#1A1410">EASY WIN?</text></g></PopProp>
    <Flag kind="jp" x={1010} y={480} s={0.6} pole={300} /></g>,
});
const Tsushima: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b3 = s.id === 's06b03';
  const Ship: React.FC<{ x: number; flag: 'tsar' | 'jp'; tilt?: number; sink?: number }> = ({ x, flag, tilt = 0, sink = 0 }) => <g transform={`translate(${x} ${780 + sink + Math.sin(f / 9 + x) * 5}) rotate(${tilt})`}>
    <path d="M-230 0 L-200 60 H200 L240 0 Z" fill="#4A4E58" stroke={OL} strokeWidth={5} />
    <rect x={-120} y={-80} width={200} height={80} fill="#5A5E68" stroke={OL} strokeWidth={4} />
    {[-80, 20].map((cx) => <rect key={cx} x={cx} y={-150} width={34} height={70} fill="#3A3A40" stroke={OL} strokeWidth={4} />)}
    <Flag kind={flag === 'tsar' ? 'andrew' : 'jp'} x={150} y={-200} s={0.3} pole={200} />
  </g>;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Sea horizon={560} rough={0.3} />
        <Layer depth={1}>
          {!b3 && <Ship x={480} flag="tsar" tilt={interpolate(f, [at(s, 'defeat'), d], [0, 12])} sink={interpolate(f, [at(s, 'defeat'), d], [0, 60])} />}
          <Ship x={b3 ? 960 : 1400} flag="jp" />
          {!b3 && <SmokeColumn x={460} y={680} s={0.9} at={at(s, 'defeat') - 4} seed="ts" />}
        </Layer>
      </CameraRig>
      <Label text={b3 ? 'Japan: a modern Asian power' : 'Battle of Tsushima, May 1905'} x={960} y={180} at={4} size={50} />
    </>
  );
};
const WW1Shot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b5 = s.id === 's06b05';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Layer depth={0}><rect x={-300} y={-300} width={2600} height={1700} fill="url(#skyDust)" /></Layer>
        <Layer depth={0.5}><Hills y={720} fill="#8A7A5A" amp={20} seed="w1" /></Layer>
        <Layer depth={0.8}><path d="M-300 760 H2300 V1500 H-300 Z" fill="#6A5A40" stroke={OL} strokeWidth={4} />{[...Array(20)].map((_, i) => <path key={i} d={`M${-200 + i * 120} 760 l40 -40 l40 40`} stroke="#4A4A4A" strokeWidth={4} fill="none" />)}</Layer>
        <Layer depth={1}>
          {[...Array(6)].map((_, i) => <Chibi key={i} x={360 + i * 230} y={950} s={0.9} {...WW1} item={b5 ? (i === 2 ? 'musket' : undefined) : 'musket'} pose={b5 ? (i === 2 ? 'hold' : 'shrug') : 'hold'} expr={b5 ? 'sad' : 'determined'} talking={[]} seed={'w1' + i} />)}
        </Layer>
      </CameraRig>
      {!b5 && <Label text="1914" x={960} y={180} at={4} size={70} />}
      {b5 && <Label text="by 1917: millions dead, wounded or captured" x={960} y={180} at={at(s, 'without')} size={46} color="#FFD84A" />}
    </>
  );
};
const Petrograd: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b7 = s.id === 's06b07';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05 }}>
        <Layer depth={0}><rect x={-300} y={-300} width={2600} height={1700} fill="url(#skyWinter)" /></Layer>
        <Layer depth={0.5}>{[...Array(7)].map((_, i) => <rect key={i} x={-100 + i * 320} y={320} width={300} height={460} fill={['#E8D8B8', '#D8C8C0', '#C8D0D8'][i % 3]} stroke={OL} strokeWidth={4} />)}<path d="M-300 780 H2300 V1500 H-300 Z" fill="#E8EEF2" stroke={OL} strokeWidth={3} /></Layer>
        <Layer depth={1}>
          {[...Array(7)].map((_, i) => <Chibi key={i} x={200 + i * 170} y={940 + (i % 2) * 20} s={0.85} {...WORKER(i)} item={i % 3 === 0 ? 'placard:BREAD' : i % 3 === 1 ? 'placard:PEACE' : undefined} pose={i % 3 === 2 ? 'fist' : 'raise'} expr="angry" talking={[[i * 3, 60]]} seed={'pg' + i} delay={i * 2} />)}
          {[0, 1, 2].map((i) => <Chibi key={'s' + i} x={1420 + i * 160} y={950} s={0.9} {...WW1} flip item={b7 ? undefined : 'musket'} pose={b7 ? (f > at(s, 'joined') + i * 5 ? 'cheer' : 'hold') : 'hold'} expr={b7 ? 'happy' : 'determined'} talking={[]} seed={'ps' + i} />)}
        </Layer>
      </CameraRig>
      <Label text="Petrograd, February 1917" x={960} y={180} at={4} size={52} />
    </>
  );
};
const Abdicate: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const t = at(s, 'abdicated', 20);
  return (
    <Insert>
      <g transform="translate(960 640)">
        <path d="M-130 0 V-300 Q0 -380 130 -300 V0 Z" fill="#8C1D18" stroke={OL} strokeWidth={6} />
        <rect x={-160} y={-20} width={320} height={70} fill="#5E3A20" stroke={OL} strokeWidth={5} />
        <g transform={`translate(${interpolate(f, [t, t + 16], [0, 260], Easing.in)} ${f < t ? -160 : -160 + Math.min(220, 0.5 * 2.4 * (f - t) ** 2)}) rotate(${f < t ? 0 : (f - t) * 8})`}><path d="M-60 0 L-72 -70 L-30 -36 L0 -84 L30 -36 L72 -70 L60 0 Z" fill={GOLD} stroke={OL} strokeWidth={5} strokeLinejoin="round" /></g>
      </g>
      <text x={960} y={250} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill={PAPER}>NICHOLAS II ABDICATES · MARCH 1917</text>
      <text x={960} y={310} textAnchor="middle" fontFamily="Tag" fontSize={34} fill="#C9C2B4">304 years of Romanov rule end</text>
    </Insert>
  );
};
const LeninShot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05 }}>
        <Kremlin y={540} winter flag="red" flagRaise={interpolate(f, [at(s, 'seized') - 6, at(s, 'seized') + 20], [0, 1], Easing.out)} />
        <Layer depth={1}>
          <Silhouette x={520} y={560} name="Vladimir Lenin" role="Bolshevik leader" c="#8C1D18" k={springPop(f, at(s, 'Lenin') - 4)} costume={LENIN} pose="point" />
          {[0, 1, 2, 3].map((i) => <Chibi key={i} x={1000 + i * 200} y={960} s={0.85} {...WORKER(i)} item={i % 2 ? undefined : 'musket'} pose={i % 2 ? 'fist' : 'raise'} expr="determined" talking={[]} seed={'bo' + i} />)}
        </Layer>
      </CameraRig>
      <Label text="October 1917" x={1500} y={260} at={4} size={56} />
    </>
  );
};
const Ipatiev: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const outs = [...Array(7)].map((_, i) => d * 0.35 + i * 7);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03 }}>
        <InsertBg glow={false} />
        <Layer depth={1}>{outs.map((o, i) => <Candle key={i} x={540 + i * 140} y={700} s={i >= 2 ? 0.8 : 1.05} out={o} seed={'ip' + i} />)}</Layer>
      </CameraRig>
      <Label text="Yekaterinburg, 17 July 1918" x={960} y={220} at={6} size={50} color="#C9C2B4" />
    </>
  );
};
const CivilWar: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <SnowRoad dusk />
      <Layer depth={1}>
        <Flag kind="red" x={360} y={360} s={0.9} pole={460} />
        <Flag kind="white" x={1380} y={360} s={0.9} pole={460} />
        <path d="M960 380 V820" stroke="#2A1B12" strokeWidth={6} strokeDasharray="20 14" />
      </Layer>
      <Layer depth={1.2}><rect x={-300} y={-300} width={2600} height={1700} fill="#0A0A14" opacity={0.25} /></Layer>
    </CameraRig>
    <Label text="Reds vs Whites, 1918–1921" x={960} y={180} at={4} size={52} />
    <Label text="≈ 7–12 million dead, mostly civilians" x={960} y={260} at={at(s, 'millions')} size={44} color="#FFD84A" />
  </>
);
const USSR: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05 }}>
        <Kremlin y={540} winter flag="ussr" flagRaise={interpolate(f, [at(s, 'born') - 10, at(s, 'born') + 16], [0, 1], Easing.out)} />
      </CameraRig>
      <Label text="the USSR · 30 December 1922" x={600} y={260} at={at(s, 'Soviet')} size={54} color="#FFD84A" />
    </>
  );
};
const StalinShot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const t = at(s, 'Stalin', 30);
  return (
    <Insert>
      <Silhouette x={680} y={520} name="Vladimir Lenin" role="died January 1924" c="#4A4A50" k={interpolate(f, [0, t], [1, 0.85])} costume={LENIN} />
      <Silhouette x={1240} y={520} name="Joseph Stalin" role="General Secretary" c="#8C1D18" k={springPop(f, t - 4)} costume={STALIN} />
    </Insert>
  );
};
const Industry: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b15 = s.id === 's06b15';
  const rise = (i: number) => interpolate(f, [at(s, 'fast') - 20 + i * 8, at(s, 'fast') + i * 8], [0, 1], Easing.out);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Layer depth={0}><rect x={-300} y={-300} width={2600} height={1700} fill="url(#skyDust)" /></Layer>
        <Layer depth={0.7}>
          <path d="M-300 780 H2300 V1500 H-300 Z" fill="#8A8278" stroke={OL} strokeWidth={3} />
          {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(0 ${b15 ? 0 : (1 - rise(i)) * 600})`}><Factory x={250 + i * 470} y={780} s={0.7 + (i % 2) * 0.15} /></g>)}
        </Layer>
        {b15 && <Layer depth={1}>{[...Array(10)].map((_, i) => <g key={i} filter="url(#sil)" opacity={0.6}><Chibi x={200 + i * 170} y={960} s={0.7} {...WORKER(i)} pose="carry" item="brick" expr="sad" talking={[]} seed={'iw' + i} delay={i * 3} /></g>)}</Layer>}
      </CameraRig>
      {!b15 && <Label text="Five-Year Plans, from 1928" x={960} y={180} at={at(s, 'industrial')} size={52} />}
    </>
  );
};
const Collective: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const off = dress(W.OFFICIAL(0), { hat: 'cap', hatColor: '#2A2A34', outfit: { top: '#4A4A3A', bottom: '#3A3A30' }, item: 'notebook' });
  const cart = (x: number) => <g transform={`translate(${x} 860)`}><rect x={-130} y={-70} width={260} height={60} fill="#8A5A34" stroke={OL} strokeWidth={5} />{[-90, -30, 30, 90].map((sx) => <path key={sx} d={`M${sx - 28} -70 Q${sx - 32} -130 ${sx} -136 Q${sx + 32} -130 ${sx + 28} -70 Z`} fill="#D8C49A" stroke={OL} strokeWidth={4} />)}<circle cx={-80} cy={0} r={34} fill="#5E3A20" stroke={OL} strokeWidth={5} /><circle cx={80} cy={0} r={34} fill="#5E3A20" stroke={OL} strokeWidth={5} /></g>;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Taiga winter={false} dusk ground={760} />
        <Layer depth={0.8}>{[0, 1, 2].map((i) => <LogHut key={i} x={260 + i * 300} y={790} s={0.4} smoke={false} seed={'cv' + i} />)}</Layer>
        <Layer depth={1}>
          {cart(interpolate(f, [0, d], [1100, 1700]))}
          <Chibi x={980} y={930} s={0.95} {...off} pose="scribble" expr="normal" talking={[]} seed="cof" />
          {[0, 1, 2].map((i) => <Chibi key={i} x={340 + i * 170} y={930} s={0.85} {...PEASANT(i)} pose="idle" expr="sad" talking={[]} seed={'cp' + i} />)}
        </Layer>
      </CameraRig>
      <Label text="collectivisation, 1929–1933: grain quotas" x={960} y={180} at={4} size={50} />
    </>
  );
};
const TERROR = ['s06b19', 's06b20', 's06b21'];
const Terror37: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const k = idx(s, TERROR);
  const lit = (i: number) => (k === 0 ? true : k === 1 ? f < 10 + i * 6 || i % 3 === 0 : i % 5 === 0);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-300} y={-300} width={2600} height={1700} fill="url(#skyNight)" /></Layer>
        <Layer depth={0.6}>
          {[...Array(5)].map((_, b) => <g key={b}><rect x={-80 + b * 420} y={300} width={380} height={480} fill="#3A3A48" stroke={OL} strokeWidth={4} />{[...Array(12)].map((_, i) => <rect key={i} x={-50 + b * 420 + (i % 4) * 90} y={340 + Math.floor(i / 4) * 140} width={50} height={70} fill={lit(b * 12 + i) ? '#F2C230' : '#1E1E28'} stroke={OL} strokeWidth={3} />)}</g>)}
          <path d="M-300 780 H2300 V1500 H-300 Z" fill="#2A2A30" stroke={OL} strokeWidth={3} />
        </Layer>
        <Layer depth={1}>{k >= 1 && <g transform={`translate(${interpolate(f, [0, d], [-200, 700])} 860)`}><rect x={-140} y={-90} width={280} height={70} rx={20} fill="#141418" stroke="#3A3A48" strokeWidth={4} /><rect x={-90} y={-140} width={170} height={60} rx={14} fill="#141418" stroke="#3A3A48" strokeWidth={4} /><circle cx={-80} cy={-18} r={26} fill="#0A0A0E" /><circle cx={90} cy={-18} r={26} fill="#0A0A0E" /><circle cx={140} cy={-60} r={10} fill="#FFE8A0" /></g>}</Layer>
      </CameraRig>
      {k === 0 && <Label text="the Great Terror, 1937–1938" x={960} y={180} at={at(s, 'Terror')} size={52} color="#C9C2B4" />}
      {k === 2 && <Label text="≈ 680,000–750,000 executed" x={960} y={180} at={at(s, 'shot')} size={50} color="#C9C2B4" />}
    </>
  );
};
const Gulag: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <Taiga winter ground={760} />
      <Layer depth={0.8}>
        {[0, 1, 2].map((i) => <rect key={i} x={500 + i * 360} y={660} width={300} height={130} fill="#6A5A4A" stroke={OL} strokeWidth={4} />)}
        <g transform="translate(260 800)"><rect x={-20} y={-320} width={40} height={320} fill="#5E3A20" stroke={OL} strokeWidth={4} /><rect x={-70} y={-380} width={140} height={70} fill="#5E3A20" stroke={OL} strokeWidth={4} /></g>
        {[...Array(18)].map((_, i) => <path key={i} d={`M${-100 + i * 140} 860 V720`} stroke="#4A4A4A" strokeWidth={8} />)}
        {[0, 1, 2, 3].map((r) => <path key={r} d={`M-300 ${740 + r * 34} H2300`} stroke="#5A5A5A" strokeWidth={3} strokeDasharray="10 8" />)}
      </Layer>
      <Layer depth={1.1}><Snow density={60} wind={-1} /></Layer>
    </CameraRig>
    <Label text="Gulag: ≈ 18 million passed through, 1930–1953" x={960} y={180} at={at(s, 'Gulag')} size={46} color="#FFD84A" />
  </>
);
const CONTRA = ['s06b23', 's06b24', 's06b25'];
const Contra = hostDim((s) => [{ at: 0, arm: idx(s, CONTRA) === 1 ? 'present' : 'idle', expr: 'worried' }], (s) => {
  const f = useCurrentFrame();
  const k = idx(s, CONTRA);
  if (k === 0) return null;
  const fade = k === 2 ? interpolate(f, [at(s, 'destroyed') - 6, at(s, 'destroyed') + 30], [1, 0.25]) : 1;
  return <g transform="translate(950 330)">
    <text fontFamily="TagBold" fontSize={34} fill="#2A2A30">LAND</text>
    <rect y={20} width={280} height={60} fill="#8FAE5E" stroke={OL} strokeWidth={5} />
    <text y={170} fontFamily="TagBold" fontSize={34} fill="#2A2A30">PEOPLE</text>
    {[...Array(8)].map((_, i) => <Person key={i} x={30 + i * 40} y={280} s={0.7} c="#E8862A" o={i < 4 ? 1 : fade} />)}
  </g>;
}, 0.35);
const Thinking: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b27 = s.id === 's06b27';
  return (
    <Insert glow={false}>
      <Silhouette x={520} y={520} name="Stalin" role="1939" c="#5A2A26" costume={STALIN} pose="chin" />
      {!b27 && <g opacity={interpolate(f, [at(s, 'birth') - 4, at(s, 'birth') + 10], [0, 1])}><Person x={1300} y={640} s={2.0} c="#7A7A80" /><path d="M1180 400 L1420 680 M1420 400 L1180 680" stroke={RED} strokeWidth={14} strokeLinecap="round" /></g>}
      {b27 && <g>{[0, 1, 2].map((i) => <g key={i} opacity={springPop(f, at(s, 'invasion') - 8 + i * 4)}><path d={`M${1700 - i * 40} ${360 + i * 140} H${1100 + i * 40}`} stroke={RED} strokeWidth={22} strokeLinecap="round" /><path d={`M${1140 + i * 40} ${320 + i * 140} l-60 40 l60 40`} fill="none" stroke={RED} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" /></g>)}<text x={1400} y={300} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill={PAPER}>FROM THE WEST</text></g>}
    </Insert>
  );
};
const June41: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <Insert>
      <Calendar x={960} y={480} month="JUNE" day={22} year={1941} color="#8C1D18" flipAt={at(s, 'June') - 4} from={{ month: 'JUNE', day: 21 }} />
    </Insert>
  );
};

export const SHOTS_06: ShotMap = {
  c5_japan: Japan, c5_tsushima: Tsushima, c5_ww1: WW1Shot, c5_petrograd: Petrograd, c5_abdicate: Abdicate, c5_lenin: LeninShot,
  c5_ipatiev: Ipatiev, c5_civilwar: CivilWar, c5_ussr: USSR, c5_stalin: StalinShot, c5_industry: Industry, c5_collective: Collective,
  c5_terror: Terror37, c5_gulag: Gulag, c5_contra: Contra, c5_thinking: Thinking, c5_june41: June41,
};
