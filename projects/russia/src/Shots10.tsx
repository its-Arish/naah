/** Chapter 9 (The Bill Comes Due) and the Conclusion. */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop, random, gravityDrop } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { Taiga, LogHut, Snow, SnowPine, Ger } from '@engine/scenes/Russia';
import { Tank } from '@engine/scenes/Vietnam';
import { hostShot, wordAt, PopProp, Drop, type ShotMap, type SP } from '@engine/kit';
import { W, dress, SKIN } from '@engine/cast/Wardrobe';
import { Bars } from '@engine/fx/Infographics';
import { PEASANT, SOLDIER_WW2, MONGOL, RED, PAPER, GOLD } from './Cast';
import { idx, at, Sign, Hand, Insert, Flag, Kremlin, Person, LineChart, Axes, chartXY, hostDim, SnowRoad } from './Kit2';
import { Pyramid } from './Shots08';

const CIV = (i = 0) => ({ ...W.MODERN(['#5A6A7A', '#7A5A4A', '#4A6A5A', '#6A5A7A'][i % 4], i), skin: SKIN.light });
const Cradle: React.FC<{ x: number; y: number; s?: number; rock?: boolean }> = ({ x, y, s = 1, rock = true }) => {
  const f = useCurrentFrame();
  return <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rock ? Math.sin(f / 12) * 5 : 0})`}>
    <path d="M-120 -20 Q0 70 120 -20" stroke={OL} strokeWidth={10} fill="none" />
    <path d="M-100 -30 H100 V-120 Q0 -100 -100 -120 Z" fill="#C9935A" stroke={OL} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-100 -120 Q-130 -190 -60 -190 L-60 -120" fill="#E8D8C0" stroke={OL} strokeWidth={5} />
  </g>;
};

// ---------------------------------------------------------------- remember the problem
const Remember = hostShot((s) => [{ at: 0, arm: s.id === 's10b01' ? 'finger' : 'present', expr: 'smile' }], {
  props: (s) => {
    const k = idx(s, ['s10b01', 's10b02', 's10b03']);
    return <g>
      <Sign t={k === 1 ? at(s, 'land') - 4 : k > 1 ? -99 : 9999} x={1050} y={360} text="TOO MUCH LAND" size={44} bg="#C9E0A0" />
      <Sign t={k === 2 ? at(s, 'few') - 4 : 9999} x={1050} y={540} text="TOO FEW PEOPLE" size={44} bg="#F4D58A" />
      {k === 0 && <PopProp at={6} x={1080} y={500}><text textAnchor="middle" fontFamily="TagBold" fontSize={180} fill={RED} stroke={RED} strokeWidth={3}>1</text></PopProp>}
    </g>;
  },
});
const Expand: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const g = interpolate(f, [at(s, 'expand') - 6, at(s, 'enemies') + 6], [0.4, 1], Easing.out);
  return (
    <Insert>
      <g transform="translate(960 560)"><g transform={`scale(${g})`}><path d="M-420 -60 Q-320 -220 -60 -200 Q200 -260 420 -160 Q470 -20 300 40 Q100 120 -100 80 Q-340 120 -420 -60 Z" fill={RED} stroke={OL} strokeWidth={6} /></g>
        <circle cx={-260} cy={-60} r={18} fill={GOLD} stroke={OL} strokeWidth={4} /><text x={-260} y={-100} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill={PAPER}>Moscow</text>
        {[[-1, 0], [0, -1], [0, 1]].map(([dx, dy], i) => <path key={i} d={`M${-260 + dx * 60} ${-60 + dy * 60} l${dx * 300 * g} ${dy * 160 * g}`} stroke="#FFD84A" strokeWidth={8} strokeDasharray="16 12" />)}
      </g>
      <text x={960} y={200} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill={PAPER}>DISTANCE = SAFETY</text>
    </Insert>
  );
};
const SP2 = ['s10b05', 's10b06', 's10b07', 's10b08', 's10b09'];
const Spent2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = idx(s, SP2);
  const figs = [
    { label: 'SERFS', c: { ...PEASANT(0), item: 'sack' } },
    { label: 'PEASANTS', c: { ...PEASANT(1), item: 'bundle' } },
    { label: 'PRISONERS', c: { ...PEASANT(2), outfit: { top: '#5A5A5A', bottom: '#4A4A4A' }, hat: 'bald' } },
    { label: 'SOLDIERS', c: { ...SOLDIER_WW2, item: 'musket' } },
  ];
  return (
    <Insert glow={false}>
      {k === 0 && <text x={960} y={520} textAnchor="middle" fontFamily="Hand" fontSize={110} fill={PAPER}>…it spent people</text>}
      {k > 0 && figs.map((fg, i) => i < k ? <g key={i} opacity={springPop(f, i === k - 1 ? 2 : -99)}>
        <g filter="url(#sil)"><Chibi x={420 + i * 360} y={760} s={1.05} {...fg.c} pose="idle" expr="normal" talking={[]} seed={'sp2' + i} /></g>
        <text x={420 + i * 360} y={820} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#C9C2B4">{fg.label}</text>
      </g> : null)}
    </Insert>
  );
};
const CradleShot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b11 = s.id === 's10b11';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Taiga winter ground={700} />
        <Layer depth={1}>
          {b11 && <Tank x={interpolate(f, [0, at(s, 'again')], [-300, 820], Easing.out)} y={760} s={0.8} color="#5E6B45" />}
          <Cradle x={1460} y={780} s={1.2} />
          {!b11 && <g transform="translate(1460 520)" opacity={springPop(f, at(s, "can't") - 4)}><text textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#3A3A48">YOUNG PEOPLE</text></g>}
        </Layer>
        <Layer depth={1.1}><Snow density={35} /></Layer>
      </CameraRig>
    </>
  );
};
const PopLine: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b13 = s.id === 's10b13';
  const box: [number, number, number, number] = [420, 280, 1500, 760];
  const pts: [number, number][] = [[1991, 148.7], [1993, 148.6], [1995, 148.5], [1997, 148.0], [1999, 147.0], [2001, 145.9], [2003, 145.0], [2005, 143.5], [2008, 142.7], [2010, 142.8], [2012, 143.3], [2014, 146.3], [2016, 146.5], [2018, 146.9], [2020, 146.7], [2022, 145.6], [2024, 146.1], [2026, 145.7]];
  const { X, Y } = chartXY(box, [1990, 2027], [140, 150]);
  const p = b13 ? 1 : interpolate(f, [0, d], [0.05, 0.35]);
  return (
    <Insert>
      <text x={960} y={200} textAnchor="middle" fontFamily="TagBold" fontSize={42} fill={PAPER}>RUSSIA'S POPULATION (millions)</text>
      <Axes box={box} xr={[1990, 2027]} yr={[140, 150]} xl={[[1991, '1991'], [2026, '2026']]} yl={[[148, '148'], [142, '142']]} />
      <LineChart pts={pts} xr={[1990, 2027]} yr={[140, 150]} p={p} box={box} color="#FF6B5A" />
      <g opacity={springPop(f, b13 ? -99 : at(s, '1991'))}><circle cx={X(1991)} cy={Y(148.7)} r={14} fill="#FFD84A" stroke={OL} strokeWidth={4} /><text x={X(1991) + 30} y={Y(148.7) - 24} fontFamily="TagBold" fontSize={34} fill="#FFD84A">peak ≈ 148.7M</text></g>
      {b13 && <g opacity={springPop(f, at(s, '146') - 4)}><circle cx={X(2026)} cy={Y(145.7)} r={14} fill="#FFD84A" stroke={OL} strokeWidth={4} /><text x={X(2026) - 20} y={Y(145.7) + 60} textAnchor="end" fontFamily="TagBold" fontSize={34} fill="#FFD84A">≈ 146M, falling</text></g>}
      <text x={960} y={900} textAnchor="middle" fontFamily="Tag" fontSize={26} fill="#C9C2B4">official figures; from 2014 they include Crimea</text>
    </Insert>
  );
};
const BIRTHS = ['s10b14', 's10b15', 's10b16', 's10b17'];
const Births: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = idx(s, BIRTHS);
  const bars = [
    { label: '1990', v: 1.99, c: '#5A8AC8', at: -99, text: '1.99M' },
    { label: '1999', v: 1.21, c: '#8A8A90', at: -99, text: '1.21M' },
    { label: '2015', v: 1.94, c: '#5A8AC8', at: -99, text: '1.94M' },
    { label: '2024', v: 1.22, c: '#E8622A', at: k === 0 ? at(s, 'births') - 6 : -99, text: '1.22M' },
  ];
  return (
    <Insert>
      <text x={960} y={160} textAnchor="middle" fontFamily="TagBold" fontSize={42} fill={PAPER}>BIRTHS PER YEAR IN RUSSIA</text>
      <Bars x={430} y={760} bars={bars} max={2.1} h={480} w={200} gap={100} />
      {k === 1 && <path d={`M830 ${760 - (1.21 / 2.1) * 480 - 6} H1530`} stroke="#FFD84A" strokeWidth={6} strokeDasharray="20 12" opacity={springPop(f, at(s, 'fewest') - 4)} />}
      {k >= 2 && <Sign t={k === 2 ? at(s, 'worse') - 4 : -99} x={1600} y={250} text="EARLY 2025: LOWER STILL" size={28} bg="#F4D58A" />}
      {k === 3 && <Sign t={at(s, 'centuries') - 4} x={1600} y={160} text="'lowest in ~200 years'" size={28} sub="for some months, per Russian demographers" />}
    </Insert>
  );
};
const Fertility: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b19 = s.id === 's10b19';
  const kid = (x: number, y: number, frac = 1, key = '') => <g key={key}><clipPath id={'kc' + key}><rect x={x - 40} y={y - 120} width={80 * frac} height={140} /></clipPath><g clipPath={`url(#kc${key})`}><Person x={x} y={y} s={1.4} c="#FFD84A" /></g><g opacity={0.25}><Person x={x} y={y} s={1.4} c="#FFD84A" /></g></g>;
  return (
    <Insert>
      <text x={500} y={300} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill={PAPER}>RUSSIA TODAY</text>
      <g opacity={springPop(f, b19 ? -99 : at(s, '1.4') - 6)}>{kid(420, 580, 1, 'a')}{kid(540, 580, 0.4, 'b')}<text x={500} y={700} textAnchor="middle" fontFamily="TagBold" fontSize={64} fill="#FFD84A">≈ 1.4</text></g>
      {b19 && <g opacity={springPop(f, at(s, '2.1') - 6)}><text x={1380} y={300} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill={PAPER}>TO STAY STEADY</text>{kid(1260, 580, 1, 'c')}{kid(1380, 580, 1, 'd')}{kid(1500, 580, 0.1, 'e')}<text x={1380} y={700} textAnchor="middle" fontFamily="TagBold" fontSize={64} fill="#9fd18b">2.1</text></g>}
      <text x={960} y={880} textAnchor="middle" fontFamily="Tag" fontSize={32} fill="#C9C2B4">children per woman</text>
    </Insert>
  );
};
const PyrShot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b21 = s.id === 's10b21';
  return (
    <Insert>
      <text x={960} y={140} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill={PAPER}>RUSSIA BY AGE (millions)</text>
      <Pyramid hi={1} />
      <g opacity={springPop(f, b21 ? at(s, 'fewer') - 4 : at(s, 'gap') - 4)}><path d="M1360 640 H1480" stroke="#FFD84A" strokeWidth={8} /><text x={1500} y={650} fontFamily="TagBold" fontSize={30} fill="#FFD84A">{b21 ? '25–34s: a small generation' : 'the 1990s gap'}</text></g>
    </Insert>
  );
};
const Leaving: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <SnowRoad dusk />
        <Layer depth={1}>{[...Array(5)].map((_, i) => <g key={i} filter="url(#sil)" opacity={0.85}><Chibi x={interpolate(f, [0, d], [600, 1500]) + i * 140} y={940 - (i % 2) * 20} s={0.8} {...CIV(i)} item="bundle" legs="walk" pose="carry" expr="sad" talking={[]} seed={'lv' + i} delay={i * 4} /></g>)}</Layer>
      </CameraRig>
      <Label text="since 2022: hundreds of thousands have left" x={960} y={180} at={at(s, 'emigration')} size={46} color="#C9C2B4" />
    </>
  );
};
const Forecast: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b24 = s.id === 's10b24';
  const box: [number, number, number, number] = [420, 280, 1500, 760];
  const xr: [number, number] = [2020, 2047], yr: [number, number] = [120, 150];
  const { X, Y } = chartXY(box, xr, yr);
  const p = b24 ? 1 : interpolate(f, [at(s, 'fall') - 6, d], [0, 1]);
  return (
    <Insert>
      <text x={960} y={200} textAnchor="middle" fontFamily="TagBold" fontSize={42} fill={PAPER}>ROSSTAT FORECAST TO 2046 (millions)</text>
      <Axes box={box} xr={xr} yr={yr} xl={[[2024, '2024'], [2046, '2046']]} yl={[[146, '146'], [125, '125']]} />
      <path d={`M${X(2024)} ${Y(146)} L${X(2024 + 22 * p)} ${Y(146 - 7 * p)} L${X(2024 + 22 * p)} ${Y(146 - 16 * p)} Z`} fill="#FF6B5A" opacity={0.35} />
      <LineChart pts={[[2024, 146], [2046, 139]]} xr={xr} yr={yr} p={p} box={box} color="#FF6B5A" dash />
      <LineChart pts={[[2024, 146], [2046, 130]]} xr={xr} yr={yr} p={p} box={box} color="#FF6B5A" dash />
      {p > 0.95 && <text x={X(2046) + 20} y={Y(134.5)} fontFamily="TagBold" fontSize={34} fill="#FFD84A">130–139M</text>}
      {b24 && <g opacity={springPop(f, at(s, '1897') - 6)}><path d={`M${box[0]} ${Y(125.6)} H${box[2]}`} stroke="#9fd18b" strokeWidth={6} strokeDasharray="16 10" /><text x={box[0] + 20} y={Y(125.6) + 44} fontFamily="TagBold" fontSize={32} fill="#9fd18b">1897 census, Russian Empire: ≈ 126M</text></g>}
    </Insert>
  );
};
const POL = ['s10b25', 's10b26', 's10b27'];
const Policy: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = idx(s, POL);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}><Kremlin y={600} winter /></CameraRig>
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={1920} height={1080}>
        <Sign t={k === 1 ? at(s, 'values') - 4 : k > 1 ? -99 : 9999} x={420} y={170} text="'TRADITIONAL VALUES'" size={36} />
        <Sign t={k === 1 ? at(s, 'abortion') - 4 : k > 1 ? -99 : 9999} x={960} y={170} text="ABORTION LIMITS" size={36} />
        <Sign t={k === 2 ? at(s, 'payments') - 4 : 9999} x={1500} y={170} text="BABY PAYMENTS" size={36} bg="#C9E0A0" sub="'maternity capital'" />
      </svg>
      {k === 0 && <Label text="the Kremlin, Moscow" x={960} y={140} at={at(s, 'Kremlin')} size={52} />}
    </>
  );
};
const Stopped: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b29 = s.id === 's10b29';
  const box: [number, number, number, number] = [420, 300, 1300, 760];
  const pts: [number, number][] = [[2016, 1.89], [2017, 1.69], [2018, 1.60], [2019, 1.48], [2020, 1.44], [2021, 1.40], [2022, 1.30], [2023, 1.26], [2024, 1.22]];
  return (
    <Insert>
      <text x={860} y={220} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill={PAPER}>BIRTHS (millions)</text>
      <Axes box={box} xr={[2016, 2026]} yr={[1.0, 2.0]} xl={[[2016, '2016'], [2024, '2024']]} yl={[[1.9, '1.9'], [1.2, '1.2']]} />
      <LineChart pts={pts} xr={[2016, 2026]} yr={[1.0, 2.0]} p={b29 ? 1 : interpolate(f, [0, d], [0.2, 1])} box={box} color="#FF6B5A" />
      {b29 && <g opacity={springPop(f, at(s, 'stopped') - 6)}><rect x={1340} y={330} width={420} height={420} rx={14} fill="#EADCB8" stroke={OL} strokeWidth={6} /><text x={1550} y={440} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#5A4A3A">MONTHLY DATA</text><rect x={1390} y={500} width={320} height={40} fill="#1A1410" /><rect x={1390} y={570} width={260} height={40} fill="#1A1410" /><text x={1550} y={700} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill={RED}>NOT PUBLISHED</text></g>}
    </Insert>
  );
};
const Door = hostShot((s) => [{ at: 0, arm: s.id === 's10b34' ? 'chin' : 'present', expr: 'smile' }], {
  props: (s) => {
    const f = useCurrentFrame();
    const b35 = s.id === 's10b35';
    const open = b35 ? interpolate(f, [at(s, 'immigration') - 6, at(s, 'immigration') + 14], [0, 1], Easing.out) : 0;
    return <PopProp at={4} x={1040} y={560}><g>
      <rect x={-120} y={-260} width={240} height={360} fill="#2A2E3A" stroke={OL} strokeWidth={6} />
      <rect x={-120} y={-260} width={240 * (1 - open * 0.8)} height={360} fill="#8A5A34" stroke={OL} strokeWidth={6} />
      {open > 0.2 && <circle cx={0} cy={-80} r={80} fill="url(#warmGlow)" opacity={open} />}
      <text y={150} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill="#3A3A48">THE WAY OUT?</text>
    </g></PopProp>;
  },
});

// ---------------------------------------------------------------- Conclusion
const Chronicle: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b2 = s.id === 's11b02';
  return (
    <Insert>
      <g transform="translate(960 470) rotate(-2)">
        <rect x={-420} y={-330} width={840} height={660} rx={18} fill="#EADCB8" stroke={OL} strokeWidth={7} />
        <text y={-240} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#8A6A4A">PRIMARY CHRONICLE</text>
        {b2 && ['"Our land is great', 'and rich, but there', 'is no order in it."'].map((t, i) => <text key={i} y={-110 + i * 110} textAnchor="middle" fontFamily="Hand" fontSize={70} fill="#2A1B12" opacity={interpolate(f, [4 + i * 14, 16 + i * 14], [0, 1])}>{t}</text>)}
      </g>
    </Insert>
  );
};
const Half = hostShot((s) => [{ at: 0, arm: 'present', expr: 'smile' }], {
  props: (s) => <g>
    <Sign t={4} x={1050} y={360} text="GREAT & RICH ✓" size={40} bg="#C9E0A0" />
    <Sign t={s.id === 's11b03' ? 14 : -99} x={1050} y={520} text="NO ORDER ?" size={40} bg="#E8E0D0" />
  </g>,
});
const SURV = ['s11b06', 's11b07', 's11b08', 's11b09'];
const Survived: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = idx(s, SURV);
  const items = [['MONGOLS', '1480'], ['POLES', '1612'], ['NAPOLEON', '1812'], ['HITLER', '1945']];
  return (
    <Insert>
      {items.map(([n, y], i) => i <= k ? <g key={n} transform={`translate(${360 + i * 400} 520)`} opacity={springPop(f, i === k ? at(s, n.toLowerCase().replace(/s$/, 's'), 6) - 6 : -99)}>
        <rect x={-170} y={-170} width={340} height={340} rx={20} fill={PAPER} stroke={OL} strokeWidth={6} />
        <text y={-40} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#1A1410">{n}</text>
        <text y={30} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#5A4A3A">{y}</text>
        <path d="M-60 90 L-10 130 L70 50" stroke="#4A9A5A" strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g> : null)}
    </Insert>
  );
};
const ProblemEnd = hostDim((s) => [{ at: 0, arm: s.id === 's11b12' ? 'idle' : 'present', expr: s.id === 's11b12' ? 'worried' : 'smile' }], (s) => {
  const k = idx(s, ['s11b10', 's11b11', 's11b12']);
  return <g>
    <Sign t={k === 0 ? 6 : -99} x={1050} y={340} text="LAND ↔ PEOPLE" size={40} />
    {k >= 1 && <g transform="translate(900 470)">{[...Array(8)].map((_, i) => <Person key={i} x={30 + i * 40} y={60} s={0.7} c="#E8862A" />)}</g>}
    {k === 2 && <Sign t={at(s, 'cheapest') - 4} x={1080} y={680} text="'CHEAPEST RESOURCE'" size={28} color={RED} />}
  </g>;
}, 0.15);
const QuietRoad: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b15 = s.id === 's11b15';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 640] }}>
        <SnowRoad />
        <Layer depth={1}>{b15 && <Cradle x={1500} y={900} s={0.8} rock={false} />}</Layer>
        <Layer depth={1.1}><Snow density={40} /></Layer>
      </CameraRig>
      {!b15 && <Label text="the road to Moscow: empty" x={960} y={180} at={at(s, 'Moscow')} size={52} />}
    </>
  );
};
const REP = ['s11b16', 's11b17', 's11b18', 's11b19'];
const Replace: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const k = idx(s, REP);
  const items = [['BORDERS', 'moved', 'can be moved'], ['TERRITORY', 'taken', 'can be taken'], ['EMPIRES', 'rebuilt', 'can be rebuilt']];
  return (
    <Insert>
      {items.map(([n, w, sub], i) => i <= Math.min(k, 2) ? <Sign key={n} t={i === k ? at(s, w) - 4 : -99} x={420 + i * 540} y={330} text={n} size={44} sub={sub} /> : null)}
      {k === 3 && <g>
        <Cradle x={960} y={800} s={1.2} />
        <g transform="translate(1400 680)"><circle r={100} fill={PAPER} stroke={OL} strokeWidth={6} /><path d={`M0 0 L${Math.sin(f / 30) * 70} ${-Math.cos(f / 30) * 70}`} stroke={OL} strokeWidth={8} strokeLinecap="round" /><text y={150} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill={PAPER}>GENERATIONS</text></g>
      </g>}
    </Insert>
  );
};
const Who: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b21 = s.id === 's11b21';
  return (
    <CameraRig move={{ zoomFrom: b21 ? 1.0 : 1.04, zoomTo: b21 ? 0.92 : 1.0, focus: [960, 700] }}>
      <Taiga winter dusk ground={760} />
      <Layer depth={0.8}><LogHut x={1300} y={790} s={0.4} snow seed="end" /></Layer>
      <Layer depth={1.1}><Snow density={50} /></Layer>
      {b21 && <Layer depth={1.3}><rect x={-300} y={-300} width={2600} height={1700} fill="#000" opacity={interpolate(f, [d * 0.5, d], [0, 0.35])} /></Layer>}
    </CameraRig>
  );
};
const Subscribe = hostShot((s) => [{ at: 0, arm: s.id === 's11b22' ? 'present' : 'wave', expr: 'grin' }], {
  props: (s) => s.id === 's11b22'
    ? <PopProp at={at(s, 'Subscribe') - 4} x={1040} y={480}><g><rect x={-170} y={-60} width={340} height={120} rx={20} fill="#C0392B" stroke={OL} strokeWidth={6} /><text y={16} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#fff">SUBSCRIBE</text></g></PopProp>
    : <PopProp at={6} x={1040} y={480}><text textAnchor="middle" fontFamily="Hand" fontSize={200} fill={RED} stroke={RED} strokeWidth={3}>?</text></PopProp>,
});

export const SHOTS_10: ShotMap = {
  c9_remember: Remember, c9_expand: Expand, c9_spent: Spent2, c9_cradle: CradleShot, c9_popline: PopLine, c9_births: Births,
  c9_fertility: Fertility, c9_pyramid: PyrShot, c9_leaving: Leaving, c9_forecast: Forecast, c9_policy: Policy, c9_stopped: Stopped, c9_door: Door,
  c10_chronicle: Chronicle, c10_half: Half, c10_survived: Survived, c10_problem: ProblemEnd, c10_quiet: QuietRoad, c10_replace: Replace,
  c10_who: Who, c10_subscribe: Subscribe,
};
