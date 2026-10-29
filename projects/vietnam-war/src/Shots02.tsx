/** Chapter 2 — "France Loses. America Steps In." and Chapter 3 — "The Country That Wasn't Allowed to Vote". */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, spring, springPop, gravityDrop, random, topple } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg, Jungle } from '@engine/scenes/Backgrounds';
import { OL, Cloud, Hills, Tree } from '@engine/scenes/Parts';
import { IndochinaMap, VCITIES, vnXY, Huey, Jet, Tank, Artillery, LoadedBike, Valley, Flag, Sea, Destroyer, Paddy, WhiteHouse } from '@engine/scenes/Vietnam';
import { hostShot, wordAt, PopProp, DropHtml, type ShotMap, type SP } from '@engine/kit';
import { USA, NORTH, SOUTH, FRANCE, MONEY, GOLD, HO_OLD, NVA, VC, GIAP, FARMER, VILLAGER, GI, SVN, FR_SOLDIER, FR_OFFICER, EISENHOWER, DIEM, MONK, JFK, Stamp, Card, Note, Counter, Calendar, Bars, CoinArc } from './Cast';

const M = { x: 700, y: 40, s: 0.98 };
const mapP = (c: string) => { const [x, y] = VCITIES[c]; return [M.x + M.s * x, M.y + M.s * y]; };

// ------------------------------------------------------------------ Chapter 2
const Tug = hostShot((s) => [{ at: 0, arm: 'present', expr: 'normal' }], {
  props: (s) => {
    const f = useCurrentFrame();
    const sway = Math.sin(f / 9) * 20;
    return <g transform={`translate(1040 640) scale(0.8)`}>
      <path d={`M-260 0 Q0 ${10 + Math.sin(f / 5) * 6} 260 0`} stroke="#8A6A3A" strokeWidth={12} fill="none" transform={`translate(${sway} 0)`} />
      <g transform={`translate(${-300 + sway} -150)`}><Flag kind="fr" x={0} y={0} s={0.6} pole={150} /></g>
      <g transform={`translate(${260 + sway} -150)`}><Flag kind="vn" x={0} y={0} s={0.6} pole={150} /></g>
      <path d="M0 -40 V40" stroke="#B3261E" strokeWidth={6} />
    </g>;
  },
});
const War46: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <IndochinaMap x={M.x} y={M.y} s={M.s} labels pins={[{ city: 'Hanoi', at: wordAt(s, 'war'), color: NORTH }, { city: 'Haiphong', at: wordAt(s, 'war') + 6, color: FRANCE }]} />
          {[0, 1, 2, 3].map((i) => { const [x, y] = mapP(['Hanoi', 'Haiphong', 'Hue', 'Saigon'][i]); const fl = Math.max(0, 1 - ((f + i * 11) % 30) / 10); return <circle key={i} cx={x + 20} cy={y + 10} r={30 * fl} fill="#FFD84A" opacity={fl * 0.8} />; })}
        </Layer>
      </CameraRig>
      <Label text="December 1946" x={400} y={200} at={wordAt(s, '1946,')} size={60} color="#FFD84A" />
    </>
  );
};
const Sides: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s03b05', 's03b06', 's03b07'].indexOf(s.id);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
      <InsertBg />
      <Layer depth={1}>
        <clipPath id="sdL"><rect x={60} y={100} width={880} height={700} rx={20} /></clipPath>
        <clipPath id="sdR"><rect x={980} y={100} width={880} height={700} rx={20} /></clipPath>
        <g clipPath="url(#sdL)"><rect x={60} y={100} width={880} height={700} fill="#B8C8D4" />{[...Array(6)].map((_, i) => <rect key={i} x={80 + i * 140} y={300 - (i % 3) * 60} width={110} height={400} fill="#D4CCBE" stroke={OL} strokeWidth={4} />)}<rect x={60} y={640} width={880} height={160} fill="#9A9A90" /><g transform={`translate(${interpolate(f, [0, 120], [100, 800])} 200) scale(0.5)`}><Jet x={0} y={0} /></g><Tank x={360} y={700} s={0.55} color="#A89868" /><Chibi x={760} y={790} s={0.8} {...FR_SOLDIER} pose="hold" expr="determined" talking={[]} seed="fs1" /></g>
        <g clipPath="url(#sdR)" opacity={idx >= 1 ? 1 : 0.3}><rect x={980} y={100} width={880} height={700} fill="#8AB860" />{[...Array(6)].map((_, i) => <Tree key={i} x={1000 + i * 160} y={460 + (i % 2) * 30} s={0.8} c="#2F6B3A" c2="#245A2E" />)}<rect x={980} y={640} width={880} height={160} fill="#7A9A4A" />
          <Chibi x={1120} y={790} s={0.8} {...NVA} pose="hold" expr="determined" talking={[]} seed="vm1" /><Chibi x={1300} y={790} s={0.75} {...FARMER()} item="sack" pose="carry" expr="happy" talking={[]} seed="vf1" /><Chibi x={1480} y={790} s={0.8} {...NVA} pose="point" expr="determined" talking={[]} seed="vm2" /><Chibi x={1660} y={790} s={0.75} {...VILLAGER('#8A6A4A', 1)} pose="wave" expr="happy" talking={[]} seed="vf2" /></g>
        <rect x={60} y={100} width={880} height={700} rx={20} fill="none" stroke={FRANCE} strokeWidth={8} />
        <rect x={980} y={100} width={880} height={700} rx={20} fill="none" stroke={NORTH} strokeWidth={8} />
        <text x={500} y={80} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff">THE FRENCH</text>
        <text x={1420} y={80} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff">THE VIỆT MINH</text>
        {idx >= 1 && ['support', 'terrain,', 'long'].map((w, i) => { const k = springPop(f, idx === 1 ? (i === 0 ? wordAt(s, 'support,') : 99999) : i === 0 ? -99 : wordAt(s, w)); return k > 0 ? <g key={w} transform={`translate(${1100 + i * 280} 180) scale(${k})`}><rect x={-125} y={-30} width={250} height={60} rx={10} fill="#F4ECD8" stroke={OL} strokeWidth={4} /><text y={12} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill="#1A1410">{['LOCAL SUPPORT', 'KNOW THE LAND', 'A LONG WAR'][i]}</text></g> : null; })}
      </Layer>
    </CameraRig>
  );
};
const HitRun: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b09 = s.id === 's03b09';
  const vis = b09 ? interpolate(f, [d * 0.4, d * 0.6], [0, 1]) : interpolate(f, [0, d * 0.3, d * 0.6, d * 0.8], [0, 1, 1, 0]);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <Jungle />
      <Layer depth={1.1}>
        <g transform={`translate(${interpolate(f, [0, d], b09 ? [400, 900] : [200, 700])} 900)`}><rect x={-160} y={-140} width={320} height={130} rx={10} fill="#A89868" stroke={OL} strokeWidth={5} /><rect x={110} y={-110} width={90} height={100} rx={10} fill="#A89868" stroke={OL} strokeWidth={5} /><circle cx={-100} cy={0} r={30} fill="#3A3A3A" stroke={OL} strokeWidth={4} /><circle cx={140} cy={0} r={30} fill="#3A3A3A" stroke={OL} strokeWidth={4} /></g>
        <g opacity={vis}>{[0, 1, 2].map((i) => <Chibi key={i} x={1300 + i * 170} y={960} s={1.0} {...VC} pose={i === 1 ? 'point' : 'hold'} expr="determined" talking={[]} seed={'hr' + i} flip />)}</g>
      </Layer>
    </CameraRig>
  );
};
const China49: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b11 = s.id === 's03b11';
  const red = b11 ? 1 : interpolate(f, [wordAt(s, 'communist'), wordAt(s, 'communist') + 20], [0, 1]);
  const [hx, hy] = mapP('Hanoi');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <IndochinaMap x={M.x} y={M.y} s={M.s} labels chinaFill={red > 0.5 ? '#D9584A' : '#C9C0AA'} />
          {red > 0.5 && <g transform={`translate(${M.x + 280} ${M.y + 30})`}><Flag kind="cn" x={0} y={0} s={0.45} pole={120} /></g>}
          {b11 && [0, 1, 2].map((i) => { const k = interpolate(f, [8 + i * 8, 30 + i * 8], [0, 1], Easing.out); const x0 = M.x + 200 + i * 120, y0 = M.y + 40; return <g key={i}><path d={`M${x0} ${y0} L${x0 + (hx - x0) * k} ${y0 + (hy - y0) * k}`} stroke={NORTH} strokeWidth={10} strokeLinecap="round" /></g>; })}
        </Layer>
      </CameraRig>
      {b11 && ['weapons,', 'training,', 'supplies.'].map((w, i) => <Card key={w} at={wordAt(s, w)} left={360} top={300 + i * 130} text={w.replace(/[,.]/g, '').toUpperCase()} size={44} />)}
      {!b11 && <Label text="1949: China turns communist" x={400} y={200} at={wordAt(s, 'China')} size={54} color="#FF6B57" />}
    </>
  );
};
/** Domino theory: a row of dominoes, toppled under gravity one after another. */
const Dominoes: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s03b12', 's03b13', 's03b14'].indexOf(s.id);
  const names = ['CHINA', 'VIETNAM', 'LAOS', 'CAMBODIA', 'THAILAND', 'BURMA', '…'];
  const start = idx === 2 ? wordAt(s, 'follow.') - 16 : 99999;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <path d="M120 780 H1800" stroke="#F4ECD8" strokeWidth={6} />
          {names.map((n, i) => { const t0 = start + i * 7; const a = f < t0 ? (i === 0 && idx === 2 ? 0 : 0) : Math.min(68, 0.5 * 0.9 * (f - t0) ** 2); const red = i === 0 || f >= t0 + 6; return <g key={n} transform={`translate(${260 + i * 220} 780) rotate(${a})`}><rect x={-50} y={-260} width={100} height={260} rx={10} fill={red ? '#D9584A' : '#F4F2EC'} stroke={OL} strokeWidth={5} /><text x={0} y={-130} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill={red ? '#fff' : '#1A1410'} transform="rotate(-90 0 -130)">{n}</text></g>; })}
          {idx === 1 && <g transform={`translate(1500 300) scale(${springPop(f, wordAt(s, 'Soviet'))})`}><rect x={-160} y={-60} width={320} height={120} rx={14} fill="#B3261E" stroke={OL} strokeWidth={6} /><text y={16} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#FFD84A">USSR</text></g>}
        </Layer>
      </CameraRig>
      <Label text="the “domino theory”" x={960} y={180} at={idx === 0 ? wordAt(s, 'larger') : -99} size={56} color="#FFD84A" />
    </>
  );
};
const PayFrance: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s03b15', 's03b16', 's03b17'].indexOf(s.id);
  const pie = idx >= 1 ? (idx === 1 ? interpolate(f, [wordAt(s, '80'), wordAt(s, '80') + 20], [0, 0.8], Easing.out) : 0.8) : 0;
  const arc = (p: number) => { if (p < 0.005) return ''; const a = p * Math.PI * 2 - Math.PI / 2; return `M0 0 L0 -170 A170 170 0 ${p > 0.5 ? 1 : 0} 1 ${Math.cos(a) * 170} ${Math.sin(a) * 170} Z`; };
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <InsertBg />
      <Layer depth={1}>
        <g transform="translate(300 300)"><Flag kind="us" x={0} y={0} s={0.8} pole={0} /></g>
        <CoinArc from={[480, 360]} to={[1400, 620]} start={idx === 0 ? wordAt(s, 'money') : -60} every={3} n={60} sym="$" />
        {idx === 0 ? <Chibi x={1460} y={900} s={1.4} {...FR_SOLDIER} pose="cheer" expr="happy" talking={[]} seed="pf" flip /> : <g transform="translate(1420 520)"><circle r={170} fill={FRANCE} stroke={OL} strokeWidth={6} /><path d={arc(pie)} fill={MONEY} stroke={OL} strokeWidth={4} /><text y={240} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff">FRANCE'S WAR COSTS</text><text x={60} y={-20} textAnchor="middle" fontFamily="TagBold" fontSize={54} fill="#fff">~80%</text><text x={60} y={30} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#E8F5E8">paid by the US</text></g>}
      </Layer>
    </CameraRig>
  );
};
const StopSign: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b19 = s.id === 's03b19';
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <InsertBg />
      <Layer depth={1}>
        <IndochinaMap x={M.x} y={M.y} s={M.s} labels chinaFill="#D9584A" />
        <g transform={`translate(${mapP('Hanoi')[0] + 60} ${mapP('Hanoi')[1] + 20}) scale(${springPop(f, b19 ? -99 : wordAt(s, 'stop'))})`}><path d="M-50 -120 L50 -120 L120 -50 L120 50 L50 120 L-50 120 L-120 50 L-120 -50 Z" fill="#B3261E" stroke="#fff" strokeWidth={10} /><text y={20} textAnchor="middle" fontFamily="TagBold" fontSize={66} fill="#fff">STOP</text></g>
        {b19 && <g transform="translate(360 900)"><Chibi x={0} y={0} s={1.4} {...FR_OFFICER} pose="cross" expr="proud" talking={[]} seed="fo" /></g>}
      </Layer>
    </CameraRig>
  );
};
const DBPPlan: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s03b20', 's03b21', 's03b22', 's03b23', 's03b24', 's03b25'].indexOf(s.id);
  if (idx === 1) return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.15, focus: [mapP('Dien Bien Phu')[0], mapP('Dien Bien Phu')[1]] }}><InsertBg /><Layer depth={1}><IndochinaMap x={M.x} y={M.y} s={M.s} labels pins={[{ city: 'Dien Bien Phu', at: 2, color: FRANCE }]} /></Layer></CameraRig>
    </>
  );
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Valley />
        <Layer depth={1}>
          {idx >= 2 && <Chibi x={300} y={960} s={1.25} {...FR_OFFICER} item="notebook" pose="point" expr="proud" talking={[]} seed="fo2" />}
          {idx >= 4 && <g transform={`translate(640 320) scale(${springPop(f, idx === 4 ? wordAt(s, 'mountains') : -99)})`}><ellipse rx={300} ry={130} fill="#F4F7FA" stroke={OL} strokeWidth={6} /><circle cx={-230} cy={150} r={20} fill="#F4F7FA" stroke={OL} strokeWidth={5} /><text y={-10} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#1A1410">Guns up those hills?</text><text y={40} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill={FRANCE}>Impossible.</text></g>}
        </Layer>
      </CameraRig>
      {idx === 0 && <Label text="Điện Biên Phủ, 1954" x={960} y={140} at={wordAt(s, 'Dien')} size={58} color="#1A1410" />}
      {idx >= 2 && idx <= 3 && <Card at={wordAt(s, idx === 2 ? 'battle' : 'firepower.')} left={1300} top={180} text="LURE THEM IN → DESTROY THEM" size={40} />}
    </>
  );
};
const Wrong: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.05, zoomTo: 1.0 }}><Valley guns={6} /></CameraRig>
    <Stamp at={wordAt(s, 'wrong.') - 4} left={960} top={250} text="THEY WERE WRONG" size={70} />
  </>
);
const Haul: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const idx = ['s03b27', 's03b28', 's03b29'].indexOf(s.id);
  const up = interpolate(f, [0, d], [0, 1]);
  const slope = (x: number) => 900 - (x - 200) * 0.32;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#B8CCD8" /><Cloud x={300} y={120} /></Layer>
        <Layer depth={0.6}><path d={`M-200 1000 L200 900 L1900 356 L2200 300 L2200 1300 L-200 1300 Z`} fill="#4E7A3E" stroke={OL} strokeWidth={5} />{[...Array(8)].map((_, i) => <Tree key={i} x={300 + i * 220} y={slope(300 + i * 220) - 10} s={0.5} c="#2F5E2E" c2="#244A24" />)}</Layer>
        <Layer depth={1}>
          {idx === 0 && (() => { const gx = 700 + up * 260; return <g><g transform={`translate(${gx} ${slope(gx) - 40}) rotate(-18)`}><Artillery x={0} y={0} s={0.7} angle={-10} /></g>{[0, 1, 2, 3].map((i) => { const cx = gx + 180 + i * 120; return <g key={i}><path d={`M${gx + 60} ${slope(gx) - 60} L${cx} ${slope(cx) - 90}`} stroke="#8A6A3A" strokeWidth={5} /><Chibi x={cx} y={slope(cx) + 10} s={0.8} {...NVA} item="none" legs="walk" pose="pull" expr="determined" talking={[]} seed={'hl' + i} delay={i * 3} /></g>; })}</g>; })()}
          {idx >= 1 && [0, 1, 2].map((i) => { const bx = 300 + ((up * 500 + i * 380) % 1300); return <g key={i}><g transform={`translate(${bx} ${slope(bx) - 50}) rotate(-18)`}><LoadedBike x={0} y={0} s={0.55} roll={f * 6} /></g><Chibi x={bx - 90} y={slope(bx - 90) + 6} s={0.75} {...FARMER()} legs="walk" pose="carry" expr="determined" talking={[]} seed={'bk' + i} delay={i * 4} /></g>; })}
        </Layer>
      </CameraRig>
      {idx === 0 && <Label text="General Võ Nguyên Giáp" x={500} y={160} at={wordAt(s, 'Giap,')} size={54} color="#1A1410" />}
      {idx === 1 && <Counter label="PORTERS:" value="tens of thousands" left={60} top={120} k={springPop(f, wordAt(s, 'Thousands'))} />}
    </>
  );
};
const Siege: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = parseInt(s.id.slice(4), 10);
  const craters = n >= 35 ? 14 : n >= 33 ? 8 : n >= 31 ? 3 : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03, shakes: n === 31 ? [{ at: wordAt(s, 'assault.'), amp: 10, len: 10 }] : [] }}>
        <Valley guns={6} craters={craters} />
        <Layer depth={0.9}>
          {n === 34 && [0, 1, 2, 3].map((i) => { const t0 = 8 + i * 12; const y = Math.min(700, 120 + Math.max(0, f - t0) * 6); return f > t0 ? <g key={i} transform={`translate(${400 + i * 320 + Math.sin((f + i * 20) / 10) * 20} ${y})`}><path d="M-50 0 Q0 -70 50 0 Z" fill="#F4F2EC" stroke={OL} strokeWidth={4} /><path d="M-50 0 L0 60 L50 0" stroke={OL} strokeWidth={2} fill="none" /><rect x={-16} y={60} width={32} height={30} fill="#8A6A3A" stroke={OL} strokeWidth={3} /></g> : null; })}
          {n === 34 && <g transform={`translate(${interpolate(f, [0, d], [-200, 2100])} 100) scale(0.5)`}><Jet x={0} y={0} color="#7A8A6A" /></g>}
        </Layer>
      </CameraRig>
      {n === 31 && <svg style={{ position: 'absolute', left: 60, top: 100 }} width={380} height={500}><g transform="translate(190 240) scale(0.75)"><Calendar x={0} y={0} month="MARCH" day={13} year={1954} color={NORTH} /></g></svg>}
      {n === 32 && <Counter label="DAY" value={String(Math.max(1, Math.round(interpolate(f, [4, d - 6], [1, 56]))))} left={60} top={120} />}
      {n === 35 && <Stamp at={wordAt(s, 'air')} left={960} top={250} text="AIRSTRIP UNUSABLE" size={56} />}
    </>
  );
};
const DBPFall: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}><Valley guns={6} craters={14} surrender /></CameraRig>
      {n === 36 && <svg style={{ position: 'absolute', left: 60, top: 100 }} width={380} height={500}><g transform="translate(190 240) scale(0.75)"><Calendar x={0} y={0} month="MAY" day={7} year={1954} color={NORTH} /></g></svg>}
      {n === 37 && <Counter label="TAKEN PRISONER:" value="~11,000" left={60} top={120} k={springPop(f, wordAt(s, '11,000'))} />}
      {n === 38 && <Stamp at={wordAt(s, 'catastrophic') - 4} left={960} top={250} text="CATASTROPHIC DEFEAT" size={64} color={FRANCE} />}
    </>
  );
};
const Lesson: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>{n <= 40 && <g transform="translate(960 470)"><Flag kind="fr" x={-100} y={-200} s={0.9} pole={380} wave={n === 40 ? -20 * springPop(f, wordAt(s, 'lost.')) : 0} /></g>}</Layer>
      </CameraRig>
      {n === 40 && <Stamp at={wordAt(s, 'lost.')} left={960} top={720} text="COLONIAL WAR LOST" size={56} color={FRANCE} />}
      {n >= 41 && <Card at={n === 42 ? wordAt(s, 'win') : 4} left={960} top={400} text={n === 41 ? 'THE LESSON' : 'WIN BATTLES  ≠  CONTROL A COUNTRY'} size={n === 41 ? 80 : 62} />}
    </>
  );
};
const Decision = hostShot((s) => [{ at: 0, arm: s.id === 's03b47' ? 'point' : 'present', expr: s.id === 's03b47' ? 'normal' : 'chin' }], {
  props: (s) => {
    const f = useCurrentFrame();
    const n = parseInt(s.id.slice(4), 10);
    if (n === 43) return <PopProp at={wordAt(s, 'billions')} x={1040} y={620}><g><rect x={-170} y={-70} width={340} height={140} rx={14} fill={MONEY} stroke={OL} strokeWidth={6} /><text y={20} textAnchor="middle" fontFamily="TagBold" fontSize={54} fill="#fff">$ BILLIONS</text></g></PopProp>;
    const door = (x: number, lab: string, on: boolean, k: number) => <g transform={`translate(${x} 640) scale(${k})`}><rect x={-90} y={-170} width={180} height={300} fill={on ? '#E8C66A' : '#7A4E2B'} stroke={OL} strokeWidth={6} /><circle cx={60} cy={-10} r={10} fill={GOLD} /><text y={175} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#1A1410">{lab}</text></g>;
    return <g>{door(900, 'WALK AWAY', false, springPop(f, n === 45 ? wordAt(s, 'Walk') : n > 45 ? -99 : 99999))}{door(1140, 'TAKE OVER', n === 47, springPop(f, n === 46 ? wordAt(s, 'take') : n > 46 ? -99 : 99999))}</g>;
  },
});

// ------------------------------------------------------------------ Chapter 3
const Geneva: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  const line = n === 1 ? interpolate(f, [wordAt(s, '17th'), wordAt(s, '17th') + 14], [0, 1]) : 1;
  const split = n >= 2;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          <IndochinaMap x={M.x} y={M.y} s={M.s} labels split={split} parallel={line} fills={{ north: n >= 2 ? '#D9584A' : '#E8DCC0', south: n >= 3 ? '#E8C65A' : '#E8DCC0' }} />
          {n >= 2 && <text x={mapP('Hanoi')[0] - 160} y={mapP('Hanoi')[1] + 60} fontFamily="TagBold" fontSize={44} fill="#fff" stroke={OL} strokeWidth={6} style={{ paintOrder: 'stroke' }}>NORTH</text>}
          {n >= 3 && <text x={mapP('Saigon')[0] - 60} y={mapP('Saigon')[1] - 150} fontFamily="TagBold" fontSize={44} fill="#fff" stroke={OL} strokeWidth={6} style={{ paintOrder: 'stroke' }}>SOUTH</text>}
          {n === 2 && <g transform="translate(400 900)"><Chibi x={0} y={0} s={1.2} {...HO_OLD} pose="present" expr="calm" talking={[]} seed="hoG" /></g>}
          {n === 3 && <g transform="translate(360 300)"><Flag kind="us" x={0} y={0} s={0.5} pole={120} /><Flag kind="svn" x={130} y={0} s={0.5} pole={120} /></g>}
        </Layer>
      </CameraRig>
      {n === 1 && <Label text="Geneva, July 1954 · the 17th parallel" x={400} y={200} at={wordAt(s, 'Geneva')} size={44} color="#FFD84A" />}
      {n === 4 && <Stamp at={wordAt(s, 'temporary.')} left={420} top={420} text="TEMPORARY" size={60} color="#2E6BC8" />}
    </>
  );
};
const Election: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  const pie = n === 9 ? 0 : n === 10 ? interpolate(f, [2, 22], [0, 0.8], Easing.out) : 0.8;
  const arc = (p: number) => { if (p < 0.005) return ''; const a = p * Math.PI * 2 - Math.PI / 2; return `M0 0 L0 -150 A150 150 0 ${p > 0.5 ? 1 : 0} 1 ${Math.cos(a) * 150} ${Math.sin(a) * 150} Z`; };
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          {n <= 7 && <g transform="translate(960 560)"><rect x={-200} y={-150} width={400} height={300} rx={14} fill="#6A4A2A" stroke={OL} strokeWidth={7} /><rect x={-100} y={-160} width={200} height={20} fill={OL} /><text y={20} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#F4ECD8">VOTE · 1956</text>{n === 7 && <text y={-220} textAnchor="middle" fontFamily="TagBold" fontSize={150} fill="#FFD84A">?</text>}</g>}
          {n === 8 && <><Chibi x={760} y={900} s={1.6} {...HO_OLD} pose="raise" expr="happy" talking={[]} seed="hoE8" />{[...Array(6)].map((_, i) => <Chibi key={i} x={1060 + (i % 3) * 170} y={i < 3 ? 820 : 960} s={0.75} {...VILLAGER(['#8A6A4A', '#5A4A3A', '#C9B98A'][i % 3], i)} pose="cheer" expr="happy" talking={[]} seed={'hv' + i} />)}</>}
          {(n === 9 || n === 10) && <><Chibi x={560} y={920} s={1.5} {...EISENHOWER} item="book" pose="hold" expr="normal" talking={[]} seed="ike" /><g transform="translate(1260 470)"><circle r={150} fill="#8A8A94" stroke={OL} strokeWidth={6} /><path d={arc(pie)} fill={NORTH} stroke={OL} strokeWidth={4} /><text y={230} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#fff">HO'S POSSIBLE VOTE</text>{pie > 0.5 && <text x={50} y={10} textAnchor="middle" fontFamily="TagBold" fontSize={56} fill="#fff">~80%</text>}</g></>}
          {n === 11 && <IndochinaMap x={M.x} y={M.y} s={M.s} labels fills={{ vn: '#D9584A' }} />}
        </Layer>
      </CameraRig>
      {n === 6 && <Stamp at={wordAt(s, 'never')} left={960} top={540} text="NEVER HELD" size={70} />}
      {n === 9 && <Label text="President Dwight Eisenhower" x={560} y={220} at={wordAt(s, 'Eisenhower')} size={48} color="#FFD84A" />}
      {n === 10 && <Note at={4} text="Eisenhower, Mandate for Change (1963), on a vote held at the time of the fighting." top={120} />}
    </>
  );
};
const Diem: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          <Chibi x={560} y={920} s={1.6} {...DIEM} pose={n === 14 ? 'fist' : n === 16 ? 'point' : 'cross'} expr={n >= 14 ? 'angry' : 'normal'} talking={[]} seed="diem" />
          {n <= 13 && <><g transform="translate(1300 260)"><Flag kind="us" x={0} y={0} s={0.7} pole={0} /></g><path d="M1260 420 Q960 380 760 520" stroke={MONEY} strokeWidth={14} fill="none" strokeDasharray="30 16" strokeDashoffset={-f * 3} /></>}
          {n === 15 && <g><g transform={`translate(1100 560) scale(${springPop(f, wordAt(s, 'Catholics'))})`}><rect x={-80} y={-60} width={160} height={180} fill="#E8E4D8" stroke={OL} strokeWidth={5} /><path d="M-100 -60 L0 -140 L100 -60 Z" fill="#8A6A5A" stroke={OL} strokeWidth={5} /><path d="M0 -200 V-140 M-24 -176 H24" stroke={OL} strokeWidth={8} /><text y={170} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill="#fff">FAVOURED</text></g><g transform={`translate(1500 560) scale(${springPop(f, wordAt(s, 'Buddhist'))})`}><rect x={-90} y={-40} width={180} height={160} fill="#C9A85A" stroke={OL} strokeWidth={5} /><path d="M-130 -40 Q0 -140 130 -40 Z" fill="#B0463A" stroke={OL} strokeWidth={5} /><path d="M-110 -100 Q0 -190 110 -100 Z" fill="#B0463A" stroke={OL} strokeWidth={5} /><text y={170} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill="#fff">THE MAJORITY</text></g></g>}
          {n === 16 && <g transform="translate(1400 520)">{[...Array(7)].map((_, i) => <rect key={i} x={-180 + i * 60} y={-200} width={14} height={400} fill="#5A5A64" />)}<rect x={-200} y={-210} width={400} height={20} fill="#5A5A64" /><g transform="translate(0 180)"><Chibi x={0} y={0} s={0.9} outfit={{ top: '#8A8A84', bottom: '#5A5A64' }} hat="hair" hair="#1A1410" pose="idle" expr="sad" talking={[]} seed="pris" /></g></g>}
        </Layer>
      </CameraRig>
      {n === 12 && <Label text="Ngô Đình Diệm" x={560} y={220} at={wordAt(s, 'Diem')} size={58} color="#FFD84A" />}
      {n === 14 && <Stamp at={wordAt(s, 'authoritarian.') - 4} left={1300} top={420} text="AUTHORITARIAN" size={56} />}
    </>
  );
};
const Monks: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = parseInt(s.id.slice(4), 10);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#C8D8E0" /></Layer>
        <Layer depth={0.5}>{[...Array(7)].map((_, i) => <rect key={i} x={-60 + i * 300} y={300 + (i % 2) * 60} width={250} height={500} fill="#E0D8C8" stroke={OL} strokeWidth={4} />)}<rect x={-200} y={760} width={2400} height={600} fill="#A8A498" /></Layer>
        <Layer depth={1}>
          {[...Array(8)].map((_, i) => <Chibi key={i} x={interpolate(f, [0, d], [100, 400]) + i * 200} y={930} s={0.95} {...MONK} item={i % 3 === 1 ? 'placard:RELIGIOUS FREEDOM' : undefined} legs="walk" pose="pray" expr="calm" talking={[]} seed={'mk' + i} delay={i * 3} />)}
          {n >= 19 && <g transform="translate(1660 300)"><Flag kind="us" x={0} y={0} s={0.5} pole={0} /></g>}
        </Layer>
      </CameraRig>
      {n === 17 && <Label text="the Buddhist crisis, 1963" x={960} y={160} at={wordAt(s, 'Buddhist')} size={56} color="#1A1410" />}
    </>
  );
};
const Coup: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  if (n === 21) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}><InsertBg glow={false} /><Layer depth={1}><g transform="translate(960 560)"><rect x={-110} y={-220} width={220} height={260} rx={30} fill="#5A3A22" stroke={OL} strokeWidth={6} /><rect x={-130} y={30} width={260} height={50} fill="#5A3A22" stroke={OL} strokeWidth={6} /><rect x={-110} y={80} width={24} height={140} fill="#3A2416" /><rect x={86} y={80} width={24} height={140} fill="#3A2416" /></g></Layer></CameraRig>
      <Label text="2 November 1963" x={960} y={180} at={4} size={56} color="#B8B8C0" />
    </>
  );
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          {n === 20 && <><g transform="translate(520 470) scale(0.85)"><Calendar x={0} y={0} month="NOVEMBER" day={1} year={1963} color={SOUTH} /></g>{[0, 1].map((i) => <Tank key={i} x={1180 + i * 360} y={700 + i * 60} s={0.55} color="#6E7A4A" />)}<Chibi x={1400} y={920} s={1.0} {...SVN} pose="point" expr="determined" talking={[]} seed="cp" /></>}
          {n === 22 && <g transform={`translate(960 470) rotate(-2) scale(${springPop(f, 4)})`}><rect x={-360} y={-240} width={720} height={480} fill="#F4F2EC" stroke={OL} strokeWidth={6} /><text x={-320} y={-170} fontFamily="TagBold" fontSize={30} fill="#5A5A64">CABLE · WASHINGTON → SAIGON</text>{[...Array(5)].map((_, i) => <path key={i} d={`M-320 ${-100 + i * 50} H${300 - (i % 2) * 120}`} stroke="#C9C4B8" strokeWidth={6} />)}<text y={190} textAnchor="middle" fontFamily="Hand" fontSize={40} fill="#B3261E">“We will not stand in the way.”</text></g>}
        </Layer>
      </CameraRig>
      {n === 22 && <Note at={wordAt(s, 'control')} text="Paraphrase of US messages to the generals; Washington did not order Diem's killing." top={120} />}
    </>
  );
};
const JFKDallas: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg glow={false} />
        <Layer depth={1}>
          {n <= 24 ? <g transform="translate(960 470)"><Calendar x={0} y={0} month="NOVEMBER" day={22} year={1963} color="#3A3A48" /></g>
            : <><g transform="translate(560 900)"><Chibi x={0} y={0} s={1.5} {...JFK} pose="idle" expr="calm" talking={[]} seed="jfk" /></g><g transform="translate(1260 220)"><path d="M0 0 V560" stroke="#5A5A64" strokeWidth={10} /><g transform="translate(0 220)"><Flag kind="us" x={0} y={0} s={0.7} pole={0} /></g></g>{n === 26 && <text x={1380} y={860} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#F4ECD8" opacity={springPop(f, wordAt(s, 'remained.'))}>THE COMMITMENT REMAINS</text>}</>}
        </Layer>
      </CameraRig>
      {n === 23 && <Label text="President John F. Kennedy" x={960} y={140} at={wordAt(s, 'Kennedy') || 6} size={50} color="#B8B8C0" />}
    </>
  );
};
const Advisers: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  const cnt = n === 27 ? Math.round(16000 * interpolate(f, [wordAt(s, '16,000') - 20, wordAt(s, '16,000') + 4], [0, 1], Easing.out)) : 16000;
  const ADV = { outfit: { top: '#6A7448', bottom: '#5E6B45' }, hat: 'cap', hatColor: '#5E6B45' };
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Paddy />
        <Layer depth={1}>
          {[0, 1].map((i) => <Chibi key={'a' + i} x={420 + i * 680} y={920} s={1.2} {...ADV} item={i ? 'notebook' : undefined} pose={i ? 'present' : 'point'} expr="normal" talking={[]} seed={'ad' + i} />)}
          {[0, 1, 2, 3].map((i) => <Chibi key={'s' + i} x={620 + (i % 2) * 140 + (i >= 2 ? 680 : 0)} y={940} s={1.0} {...SVN} pose="hold" expr="determined" talking={[]} seed={'sv' + i} flip />)}
        </Layer>
      </CameraRig>
      <Counter label="US PERSONNEL:" value={`~${cnt.toLocaleString('en-US')}`} left={60} top={120} />
      {n === 28 && <Label text="officially “advisers”" x={1300} y={250} at={wordAt(s, 'advisers')} size={52} color="#1A1410" />}
    </>
  );
};
const Unstable: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  const wob = Math.sin(f / 5) * 7;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          {n <= 31 && <><IndochinaMap x={M.x} y={M.y} s={M.s} labels split fills={{ north: '#D9584A', south: '#E8C65A' }} parallel={1} />{n >= 30 && [...Array(10)].map((_, i) => { const [x, y] = mapP(['Saigon', 'Cu Chi', 'Tay Ninh', 'Ban Me Thuot', 'Nha Trang', 'My Lai', 'Hue', 'Da Nang', 'Quang Tri', 'Ia Drang'][i]); const k = springPop(f, (n === 30 ? wordAt(s, 'insurgency') : -99) + i * 3); return k > 0 ? <circle key={i} cx={x + 6} cy={y} r={12 * k} fill={NORTH} stroke={OL} strokeWidth={3} /> : null; })}
            <g transform={`translate(340 640) rotate(${wob})`}><rect x={-140} y={-200} width={280} height={200} fill="#E8C65A" stroke={OL} strokeWidth={6} /><path d="M-170 -200 L0 -290 L170 -200 Z" fill="#C9A85A" stroke={OL} strokeWidth={6} /><text y={-80} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill="#1A1410">SAIGON GOV'T</text></g></>}
          {n >= 32 && <g transform="translate(960 560)"><WhiteHouse x={0} y={120} s={0.9} />{n === 33 && <text y={-260} textAnchor="middle" fontFamily="TagBold" fontSize={170} fill="#FFD84A" opacity={springPop(f, wordAt(s, 'save'))}>?</text>}</g>}
        </Layer>
      </CameraRig>
      {n === 30 && <Label text="unstable · a growing insurgency" x={400} y={220} at={wordAt(s, 'unstable,')} size={44} color="#FFD84A" />}
    </>
  );
};
const TonkinTease: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b35 = s.id === 's04b35';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Sea />
        <Layer depth={0.8}>{b35 && <Destroyer x={interpolate(f, [0, d], [700, 900])} y={560 + Math.sin(f / 10) * 4} s={0.85} />}</Layer>
        {!b35 && <Layer depth={1}><g transform="translate(960 470)"><Calendar x={0} y={0} month="SUMMER" day="1964" color={USA} /></g></Layer>}
      </CameraRig>
      {b35 && <Label text="the Gulf of Tonkin" x={960} y={160} at={wordAt(s, 'Gulf')} size={56} color="#1A1410" />}
    </>
  );
};

export const SHOTS_02: ShotMap = {
  tug: Tug, war46: War46, sides: Sides, hitrun: HitRun, china49: China49, dominoes: Dominoes, pay_france: PayFrance, stop_sign: StopSign,
  dbp_plan: DBPPlan, wrong: Wrong, haul: Haul, siege: Siege, dbp_fall: DBPFall, lesson: Lesson, decision: Decision,
  geneva: Geneva, election: Election, diem: Diem, monks: Monks, coup: Coup, jfk: JFKDallas, advisers: Advisers, unstable: Unstable, tonkin_tease: TonkinTease,
};
