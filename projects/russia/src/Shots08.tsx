/** Chapter 7: A Wall Made of Other Countries (Cold War → 1991 → the 1990s). */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL, Hills, Range, Cloud } from '@engine/scenes/Parts';
import { Taiga, LogHut, Snow, SmokeColumn } from '@engine/scenes/Russia';
import { Tank } from '@engine/scenes/Vietnam';
import { Silhouette } from '@engine/cast/Silhouette';
import { hostShot, wordAt, PopProp, Drop, type ShotMap, type SP } from '@engine/kit';
import { W, dress, SKIN } from '@engine/cast/Wardrobe';
import { Bars, Calendar } from '@engine/fx/Infographics';
import { RED, PAPER, GOLD } from './Cast';
import { idx, at, Sign, Insert, Flag, Kremlin, Person, LineChart, Axes, chartXY } from './Kit2';

const CIV = (i = 0) => ({ ...W.MODERN(['#5A6A7A', '#7A5A4A', '#4A6A5A', '#6A5A7A'][i % 4], i), skin: SKIN.light });
const GORBY = dress(W.SUIT('#3A3A48', '#9A9A9A'), { hat: 'bald' });
const YELTSIN = dress(W.SUIT('#2A2E3A', '#E8E4DA'));
const PUTIN = dress(W.SUIT('#1E1E28', '#B8A890'), { hat: 'parted' });

const After = hostShot((s) => [{ at: 0, arm: 'present', expr: 'smile' }], {
  props: (s) => <PopProp at={at(s, 'Europe') - 4} x={1040} y={520}><g>{[...Array(3)].map((_, r) => [...Array(4)].map((__, c) => <rect key={r + '-' + c} x={-140 + c * 70 + (r % 2) * 35} y={-r * 46} width={66} height={42} fill={['#C96A5A', '#D88A6A', '#B85A4A'][(r + c) % 3]} stroke={OL} strokeWidth={4} />))}<text y={90} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#3A3A48">A WALL OF COUNTRIES</text></g></PopProp>,
});
const TwoViews: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b9 = s.id === 's08b09';
  return (
    <Insert>
      <g opacity={b9 ? 0.4 : 1}><Sign t={at(s, 'security', 4) - 4} x={520} y={300} text="MOSCOW: SECURITY" size={44} bg="#F4D58A" />
        <g transform="translate(520 600)"><path d="M0 -150 L130 -100 V20 Q130 120 0 170 Q-130 120 -130 20 V-100 Z" fill="#8C1D18" stroke={OL} strokeWidth={7} /><path d="M-40 0 L-10 40 L50 -40" stroke="#FFD84A" strokeWidth={16} fill="none" strokeLinecap="round" /></g></g>
      {b9 && <g>
        <Sign t={4} x={1400} y={300} text="THE PEOPLE THERE" size={44} />
        <g transform="translate(1400 640)">{[...Array(5)].map((_, i) => <Chibi key={i} x={-260 + i * 130} y={120} s={0.7} {...CIV(i)} pose="idle" expr="sad" talking={[]} seed={'tv' + i} />)}{[...Array(9)].map((_, i) => <path key={i} d={`M${-320 + i * 80} 140 V-120`} stroke="#4A4A4A" strokeWidth={8} />)}<path d="M-340 -100 H340 M-340 -20 H340" stroke="#5A5A5A" strokeWidth={4} strokeDasharray="10 8" /></g>
        <text x={1400} y={420} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#C9C2B4" opacity={springPop(f, at(s, 'repression'))}>Hungary 1956 · Czechoslovakia 1968</text>
      </g>}
    </Insert>
  );
};
const Super: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b11 = s.id === 's08b11';
  return (
    <Insert>
      <g transform="translate(960 640)"><circle r={260} fill="#4F86B8" stroke={OL} strokeWidth={8} /><path d="M-200 -120 q90 -60 210 -50 q120 -10 170 40 q-20 60 -120 60 q-140 0 -260 -50 Z" fill="#8FAE5E" stroke={OL} strokeWidth={5} /><path d="M-120 40 q60 -20 100 30 q-20 80 -80 90 q-40 -60 -20 -120 Z" fill="#8FAE5E" stroke={OL} strokeWidth={5} /></g>
      {b11 && <><g opacity={springPop(f, at(s, 'superpowers') - 6)}><Flag kind="ussr" x={500} y={260} s={0.8} pole={300} /></g><g opacity={springPop(f, at(s, 'superpowers'))}><g transform="translate(1260 260)"><rect x={-7} y={-10} width={14} height={310} fill="#8A8A90" stroke={OL} strokeWidth={4} /><g transform="translate(7 0)">{[...Array(7)].map((_, i) => <rect key={i} x={0} y={i * 18} width={190} height={18} fill={i % 2 ? '#fff' : '#B22234'} />)}<rect x={0} y={0} width={80} height={72} fill="#3C3B6E" /><rect x={0} y={0} width={190} height={126} fill="none" stroke={OL} strokeWidth={5} /></g></g></g></>}
      {!b11 && <text x={960} y={240} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill={PAPER}>THE COLD WAR</text>}
    </Insert>
  );
};
const Sputnik: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const a = f / 30;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05 }}>
        <Layer depth={0}><rect x={-300} y={-300} width={2600} height={1700} fill="#0A0E1E" />{[...Array(60)].map((_, i) => <circle key={i} cx={random('st' + i) * 1920} cy={random('su' + i) * 1080} r={1.5 + random('sv' + i) * 2} fill="#fff" opacity={0.6} />)}</Layer>
        <Layer depth={1}>
          <g transform="translate(960 1500)"><circle r={760} fill="#4F86B8" stroke={OL} strokeWidth={8} /><path d="M-500 -500 q200 -100 500 -60 q300 40 380 160 q-200 40 -500 0 Z" fill="#8FAE5E" stroke={OL} strokeWidth={6} /></g>
          <g transform={`translate(${960 + Math.cos(a) * 560} ${560 + Math.sin(a) * 160})`}><circle r={34} fill="#C8C8D0" stroke={OL} strokeWidth={5} />{[0, 1, 2, 3].map((i) => <path key={i} d={`M${Math.cos(2.4 + i * 0.25) * 30} ${Math.sin(2.4 + i * 0.25) * 30} l${-120 + i * 10} ${60 + i * 20}`} stroke="#8A8A90" strokeWidth={4} />)}{f % 30 < 10 && <circle r={60} fill="none" stroke="#FFD84A" strokeWidth={4} opacity={0.7} />}</g>
        </Layer>
      </CameraRig>
      <Label text="Sputnik 1 · 4 October 1957 · beep… beep…" x={960} y={170} at={at(s, 'Sputnik')} size={50} />
    </>
  );
};
const Gagarin: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b14 = s.id === 's08b14';
  if (b14) return (
    <Insert>
      <Calendar x={640} y={500} month="1861" day="SERFS" color="#5A4A3A" />
      <Calendar x={1280} y={500} month="1961" day="SPACE" color="#2E4A9A" />
      <path d="M860 500 H1060" stroke="#FFD84A" strokeWidth={14} strokeLinecap="round" /><path d="M1040 470 l40 30 l-40 30" stroke="#FFD84A" strokeWidth={12} fill="none" strokeLinecap="round" />
      <text x={960} y={880} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill={PAPER} opacity={springPop(f, at(s, 'century'))}>100 YEARS</text>
    </Insert>
  );
  const lift = interpolate(f, [at(s, 'orbit') - 30, d], [0, 900], Easing.in);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, shakes: [{ at: at(s, 'orbit') - 30, amp: 6, len: 30 }] }}>
        <Layer depth={0}><rect x={-300} y={-300} width={2600} height={1700} fill="url(#skyDawn)" /></Layer>
        <Layer depth={0.6}><path d="M-300 820 H2300 V1500 H-300 Z" fill="#C9B898" stroke={OL} strokeWidth={3} /><path d="M700 820 V400 M1220 820 V400 M700 500 H1220" stroke="#8A3A2A" strokeWidth={14} /></Layer>
        <Layer depth={1}>
          <g transform={`translate(960 ${820 - lift})`}>
            <path d="M-60 0 V-420 Q0 -560 60 -420 V0 Z" fill="#E8E8EC" stroke={OL} strokeWidth={6} />
            {[-1, 1].map((sd) => <path key={sd} d={`M${sd * 60} -160 l${sd * 70} 120 V20 H${sd * 60} Z`} fill="#B8B8C0" stroke={OL} strokeWidth={5} />)}
            <text y={-260} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#B3261E" transform="rotate(-90 0 -260)">CCCP</text>
            {lift > 0 && [0, 1, 2].map((i) => <path key={i} d={`M${-40 + i * 40} 10 Q${-30 + i * 40} ${90 + ((f + i * 5) % 20) * 4} ${-20 + i * 40} 10`} fill="#FFB43A" stroke="#E8622A" strokeWidth={4} />)}
          </g>
          {lift > 0 && [...Array(6)].map((_, i) => <circle key={i} cx={760 + i * 80} cy={820 - (f % 30) * 2} r={60 + i * 10} fill="#E8E8E8" opacity={0.6} />)}
        </Layer>
      </CameraRig>
      <Label text="Yuri Gagarin · Vostok 1 · 12 April 1961" x={480} y={300} at={at(s, 'Gagarin')} size={50} />
    </>
  );
};
const Bomba: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const g = interpolate(f, [at(s, 'largest') - 4, at(s, 'largest') + 30], [0, 1], Easing.out);
  return (
    <Insert>
      <text x={960} y={160} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill={PAPER}>BLAST YIELD (to scale by area)</text>
      <circle cx={520} cy={500} r={6} fill="#FFD84A" stroke={OL} strokeWidth={2} />
      <text x={520} y={580} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill={PAPER}>Hiroshima · 15 kt</text>
      <circle cx={1220} cy={500} r={270 * g} fill="#E8622A" opacity={0.85} stroke={OL} strokeWidth={6} />
      <text x={1220} y={515} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff" opacity={g}>Tsar Bomba · ≈ 50,000 kt</text>
      <text x={1220} y={850} textAnchor="middle" fontFamily="Tag" fontSize={30} fill="#C9C2B4" opacity={g}>tested over Novaya Zemlya, 30 October 1961</text>
    </Insert>
  );
};
const ECON = ['s08b16', 's08b17', 's08b18'];
const Economy: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const k = idx(s, ECON);
  if (k === 2) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Layer depth={0}><rect x={-300} y={-300} width={2600} height={1700} fill="url(#skyDust)" /></Layer>
        <Layer depth={0.4}><Range base={760} peaks={[[200, 420], [620, 520], [1100, 460], [1600, 540], [2000, 400]]} rock="#A8906A" snow="#F4F0E8" /></Layer>
        <Layer depth={0.8}><path d="M-300 760 H2300 V1500 H-300 Z" fill="#B89A6A" stroke={OL} strokeWidth={3} /></Layer>
        <Layer depth={1}>{[0, 1].map((i) => <Tank key={i} x={interpolate(f, [0, d], [300, 900]) + i * 520} y={900} s={0.6} color="#5E6B45" />)}</Layer>
      </CameraRig>
      <Label text="Afghanistan, 1979–1989 · ≈ 15,000 Soviet soldiers killed" x={960} y={170} at={at(s, 'Afghanistan')} size={44} />
    </>
  );
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Layer depth={0}><rect x={-300} y={-300} width={2600} height={1700} fill="#D8D0C0" /></Layer>
        <Layer depth={0.7}>
          {k === 0 && <g>{[0, 1, 2].map((r) => <g key={r}><rect x={240} y={260 + r * 170} width={1440} height={24} fill="#8A6A4A" stroke={OL} strokeWidth={4} />{r === 1 && [0, 1].map((i) => <rect key={i} x={600 + i * 700} y={200} width={60} height={84} fill="#C9B898" stroke={OL} strokeWidth={3} />)}</g>)}</g>}
          {k === 1 && <g><Bars x={560} y={740} bars={[{ label: 'MILITARY', v: 15, c: '#8C1D18', at: at(s, 'military') - 6, text: '≈ 15% of GDP' }, { label: 'USA', v: 6, c: '#5A6A8A', at: at(s, 'military'), text: '≈ 6%' }]} max={16} h={520} w={260} gap={260} labelSize={34} /></g>}
          <path d="M-300 860 H2300 V1500 H-300 Z" fill="#9A8E7C" stroke={OL} strokeWidth={3} />
        </Layer>
        <Layer depth={1}>{k === 0 && [...Array(8)].map((_, i) => <Chibi key={i} x={300 + i * 170} y={960} s={0.8} {...CIV(i)} item={i % 3 === 0 ? 'bundle' : undefined} pose="idle" expr="sad" talking={[]} seed={'q' + i} />)}</Layer>
      </CameraRig>
      {k === 0 && <Label text="queues & empty shelves" x={960} y={140} at={at(s, 'struggled')} size={50} />}
      {k === 1 && <Label text="1980s estimates, Soviet military spending" x={960} y={140} at={6} size={42} />}
    </>
  );
};
const Chernobyl: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b20 = s.id === 's08b20';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Layer depth={0}><rect x={-300} y={-300} width={2600} height={1700} fill="url(#skyNight)" /></Layer>
        <Layer depth={0.6}>
          <g transform="translate(960 780)"><rect x={-420} y={-260} width={840} height={260} fill="#B8B8B0" stroke={OL} strokeWidth={6} /><rect x={-100} y={-520} width={70} height={260} fill="#C8C0B8" stroke={OL} strokeWidth={5} />{[...Array(6)].map((_, i) => <path key={i} d={`M-100 ${-500 + i * 44} h70`} stroke="#B3261E" strokeWidth={10} />)}<path d="M120 -260 l40 -60 l50 40 l60 -70 l40 90 Z" fill="#2A2A30" stroke={OL} strokeWidth={4} /></g>
          <SmokeColumn x={1180} y={500} s={1.3} at={-60} seed="ch" />
          <path d="M-300 780 H2300 V1500 H-300 Z" fill="#3A3E44" stroke={OL} strokeWidth={3} />
        </Layer>
        {b20 && <Layer depth={1}><g transform="translate(560 640) rotate(-4)" opacity={springPop(f, at(s, 'hide') - 6)}><rect x={-240} y={-150} width={480} height={300} fill="#F4F0E8" stroke={OL} strokeWidth={6} /><text y={-80} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#1A1410">TASS</text><text y={-10} textAnchor="middle" fontFamily="Tag" fontSize={28} fill="#5A4A3A">"an accident has occurred…"</text><text y={40} textAnchor="middle" fontFamily="Tag" fontSize={28} fill="#5A4A3A">(first report: 28 April)</text></g></Layer>}
      </CameraRig>
      <Label text="Chernobyl, Ukraine · 26 April 1986" x={960} y={160} at={at(s, 'Chernobyl', 4)} size={50} color="#C9C2B4" />
    </>
  );
};
const Gorby: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b22 = s.id === 's08b22';
  const crack = b22 ? interpolate(f, [at(s, 'down') - 10, at(s, 'down') + 12], [0, 1]) : 0;
  return (
    <Insert>
      <Silhouette x={500} y={520} name="Mikhail Gorbachev" role="leader 1985–1991" c="#5A2A26" costume={GORBY} pose="present" />
      <Sign t={b22 ? -99 : at(s, 'reform') - 4} x={1260} y={330} text="GLASNOST" size={44} sub="openness" />
      <Sign t={b22 ? -99 : at(s, 'reform') + 4} x={1260} y={520} text="PERESTROIKA" size={44} sub="restructuring" />
      {b22 && <g transform="translate(1260 760)"><rect x={-260} y={-90} width={520} height={130} fill="#8C1D18" stroke={OL} strokeWidth={6} /><text y={0} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#FFD84A">SOVIET SYSTEM</text><path d={`M-200 -90 L${-200 + 120 * crack} ${-90 + 60 * crack} L${-200 + 260 * crack} ${-90 + 30 * crack} L${-200 + 420 * crack} ${-90 + 130 * crack}`} stroke="#F4ECD8" strokeWidth={6} fill="none" /></g>}
    </Insert>
  );
};
const FlagDown: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const t = at(s, 'down', d * 0.4);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.06, focus: [1160, 300] }}>
        <Kremlin y={540} night winter flag={f < t + 24 ? 'ussr' : 'ru'} flagRaise={f < t + 24 ? interpolate(f, [t - 10, t + 24], [1, 0]) : interpolate(f, [t + 24, d], [0, 1])} />
      </CameraRig>
      <Label text="25 December 1991, 7:32 pm" x={600} y={260} at={6} size={50} color="#C9C2B4" />
    </>
  );
};
const Borders: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = idx(s, ['s08b27', 's08b28', 's08b29']);
  const line = k === 2 ? interpolate(f, [at(s, 'borders') - 6, at(s, 'borders') + 16], [1500, 760], Easing.inOut) : 1500;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Taiga winter={false} ground={760} />
        <Layer depth={0.8}><LogHut x={960} y={790} s={0.6} seed="bh" /></Layer>
        <Layer depth={1}>
          {[0, 1, 2].map((i) => <Chibi key={i} x={760 + i * 200} y={940} s={0.9} {...CIV(i)} pose={k === 1 ? 'shrug' : 'idle'} expr={k === 2 ? 'shock' : 'normal'} talking={[]} seed={'bd' + i} />)}
          <path d={`M${line} 300 V1000`} stroke={RED} strokeWidth={10} strokeDasharray="30 18" />
          <text x={line + 30} y={360} fontFamily="TagBold" fontSize={36} fill={RED}>BORDER</text>
        </Layer>
      </CameraRig>
      {k === 0 && <Label text="≈ 25 million Russians in the other 14 republics" x={960} y={180} at={at(s, '25')} size={46} />}
    </>
  );
};
const NINE = ['s08b30', 's08b31', 's08b32', 's08b33', 's08b34'];
const Nineties: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const k = idx(s, NINE);
  const box: [number, number, number, number] = [420, 260, 1500, 760];
  if (k === 0) return (
    <Insert glow={false}><text x={960} y={520} textAnchor="middle" fontFamily="Hand" fontSize={150} fill={PAPER}>the 1990s</text></Insert>
  );
  if (k === 2) {
    const r = interpolate(f, [at(s, 'vanished') - 10, at(s, 'vanished') + 20], [1, 0.02], Easing.in);
    return (
      <Insert>
        <g transform="translate(960 600)"><path d="M-180 -200 H180 V160 Q180 220 120 220 H-120 Q-180 220 -180 160 Z" fill="rgba(200,230,255,0.25)" stroke={PAPER} strokeWidth={8} />
          <rect x={-170} y={210 - 400 * r} width={340} height={400 * r} fill="#6AA86A" opacity={0.9} /><text y={-250} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill={PAPER}>SAVINGS</text></g>
        <text x={960} y={870} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#FFD84A" opacity={1 - r}>1992 inflation: ≈ 2,500%</text>
      </Insert>
    );
  }
  const data: Record<number, { pts: [number, number][]; yr: [number, number]; yl: [number, string][]; title: string; c: string }> = {
    1: { pts: [[1989, 100], [1990, 97], [1991, 92], [1992, 78], [1993, 71], [1994, 62], [1995, 60], [1996, 58], [1997, 59], [1998, 56]], yr: [40, 105], yl: [[100, '100'], [60, '60']], title: 'ECONOMY (1989 = 100)', c: '#FF6B5A' },
    3: { pts: [[1987, 64.9], [1989, 64.2], [1991, 63.5], [1992, 62], [1993, 58.9], [1994, 57.6], [1995, 58.1], [1996, 59.6], [1997, 60.8], [1998, 61.2]], yr: [55, 66], yl: [[65, '65'], [58, '58']], title: "MEN'S LIFE EXPECTANCY (years)", c: '#FF6B5A' },
    4: { pts: [[1987, 2.50], [1988, 2.35], [1989, 2.16], [1990, 1.99], [1991, 1.79], [1992, 1.59], [1993, 1.38], [1994, 1.41], [1995, 1.36], [1996, 1.30], [1997, 1.26], [1998, 1.28], [1999, 1.21]], yr: [1.0, 2.6], yl: [[2.5, '2.5M'], [1.2, '1.2M']], title: 'BIRTHS PER YEAR', c: '#FF6B5A' },
  };
  const D = data[k];
  const xr: [number, number] = [D.pts[0][0], D.pts[D.pts.length - 1][0]];
  const p = interpolate(f, [4, d * 0.8], [0.05, 1]);
  return (
    <Insert>
      <text x={960} y={190} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill={PAPER}>{D.title}</text>
      <Axes box={box} xr={xr} yr={D.yr} xl={[[xr[0], String(xr[0])], [xr[1], String(xr[1])]]} yl={D.yl} />
      <LineChart pts={D.pts} xr={xr} yr={D.yr} p={p} box={box} color={D.c} />
    </Insert>
  );
};
/** Russia's population pyramid around 2024 (stylised from Rosstat shape): a deep notch for those born in the 1990s. */
export const PYR: [string, number][] = [['0–4', 6.4], ['5–9', 8.1], ['10–14', 8.0], ['15–19', 7.3], ['20–24', 6.4], ['25–29', 6.7], ['30–34', 9.9], ['35–39', 12.0], ['40–44', 10.9], ['45–49', 10.2], ['50–54', 9.1], ['55–59', 8.6], ['60–64', 10.0], ['65–69', 9.5], ['70+', 15]];
export const Pyramid: React.FC<{ hi?: number; p?: number }> = ({ hi = 0, p = 1 }) => (
  <g transform="translate(960 880)">
    {PYR.map(([lab, v], i) => { const w = Math.min(v, 12) * 34 * p; const notch = i === 4 || i === 5 || i === 6; return <g key={lab} transform={`translate(0 ${-i * 44})`}>
      <rect x={-w} y={-40} width={w} height={38} fill={notch && hi ? '#E8622A' : '#5A8AC8'} stroke={OL} strokeWidth={3} />
      <rect x={0} y={-40} width={w} height={38} fill={notch && hi ? '#E8622A' : '#C86A8A'} stroke={OL} strokeWidth={3} />
      <text x={-440} y={-12} textAnchor="end" fontFamily="TagBold" fontSize={22} fill={PAPER}>{lab}</text>
    </g>; })}
    <text x={-200} y={50} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill={PAPER}>MEN</text>
    <text x={200} y={50} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill={PAPER}>WOMEN</text>
  </g>
);
const Gap: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b36 = s.id === 's08b36';
  return (
    <Insert>
      <text x={960} y={140} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill={PAPER}>RUSSIA BY AGE (millions)</text>
      <Pyramid hi={b36 ? 1 : 0} p={interpolate(f, [0, 20], [0.2, 1], Easing.out)} />
      {b36 && <g opacity={springPop(f, at(s, 'gap') - 4)}><path d="M1360 640 H1480" stroke="#FFD84A" strokeWidth={8} /><text x={1500} y={650} fontFamily="TagBold" fontSize={32} fill="#FFD84A">born in the 1990s</text></g>}
    </Insert>
  );
};
const YeltsinPutin: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b38 = s.id === 's08b38';
  return (
    <Insert>
      <Silhouette x={600} y={520} name="Boris Yeltsin" role="President 1991–1999" c="#2E4A6A" costume={YELTSIN} k={b38 ? 0.9 : springPop(f, 2)} />
      {b38 && <Silhouette x={1320} y={520} name="Vladimir Putin" role="from 31 Dec 1999" c="#5A2A26" costume={PUTIN} k={springPop(f, at(s, 'Putin') - 4)} />}
      {b38 && <path d="M860 520 H1060" stroke="#FFD84A" strokeWidth={12} strokeLinecap="round" opacity={springPop(f, at(s, 'handed'))} />}
      {!b38 && <text x={1300} y={540} textAnchor="middle" fontFamily="Hand" fontSize={70} fill={PAPER} opacity={springPop(f, at(s, 'resigned'))}>"I'm leaving."</text>}
    </Insert>
  );
};

export const SHOTS_08: ShotMap = {
  c7_after: After, c7_twoviews: TwoViews, c7_super: Super, c7_sputnik: Sputnik, c7_gagarin: Gagarin, c7_bomba: Bomba,
  c7_economy: Economy, c7_chernobyl: Chernobyl, c7_gorby: Gorby, c7_flagdown: FlagDown, c7_borders: Borders,
  c7_nineties: Nineties, c7_gap: Gap, c7_yeltsin: YeltsinPutin,
};
