/**
 * Act 12 — "1789 vs 2026": Goldstone's three conditions, the scoreboard, what's missing, the echoes.
 * Callbacks: the pillar-and-table (Act 7), the chained hall doors (Act 3), the march on Versailles,
 * the prefects, the bill (Act 1).
 */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, spring, springPop, gravityDrop, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { Versailles, TownHall, Bill, Bastille } from '@engine/scenes/FranceScenes';
import { hostShot, wordAt, PopProp, DropHtml, type ShotMap, type SP } from '@engine/kit';
import { GOLD, PEOPLE, MONEY, STATE, PEASANT } from './Shots01';
import { Calendar, SANS, GUARD_NAT } from './Shots04';
import { PillarTable } from './Shots07';
import { MODERN } from './Shots09';

/** Scoreboard cell states: '' empty, 'y' yes, '~' arguably, 'n' no. */
type Cell = '' | 'y' | '~' | 'n';
const ROWS = ['FISCAL CRISIS', 'ELITES DIVIDED', 'MASS ANGER', 'ARMY SWITCHES SIDES'];
export const Scoreboard: React.FC<{ a: Cell[]; b: Cell[]; at?: Record<string, number>; row4?: boolean; hi?: number; x?: number; y?: number; s?: number }> = ({ a, b, at = {}, row4 = false, hi = -1, x = 960, y = 470, s = 1 }) => {
  const f = useCurrentFrame();
  const mark = (c: Cell, key: string, cx: number, cy: number) => {
    if (!c) return null;
    const k = springPop(f, at[key] ?? -99);
    if (k <= 0) return null;
    const col = c === 'y' ? '#2E8B57' : c === '~' ? '#E8A94A' : '#8A8A94';
    return <g transform={`translate(${cx} ${cy}) scale(${k})`}><circle r={34} fill={col} stroke={OL} strokeWidth={4} />{c === 'y' && <path d="M-16 0 L-4 14 L18 -14" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />}{c === '~' && <text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#fff">~</text>}{c === 'n' && <path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke="#fff" strokeWidth={8} strokeLinecap="round" />}</g>;
  };
  const r4 = row4 ? springPop(f, at.row4 ?? -99) : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-560} y={-300} width={1120} height={row4 ? 560 : 450} rx={20} fill="rgba(20,16,12,0.75)" stroke="#F4ECD8" strokeWidth={5} />
      <text x={170} y={-230} textAnchor="middle" fontFamily="TagBold" fontSize={56} fill={GOLD}>1789</text>
      <text x={400} y={-230} textAnchor="middle" fontFamily="TagBold" fontSize={56} fill={PEOPLE}>2026</text>
      {ROWS.slice(0, 3).map((r, i) => <g key={r}><rect x={-540} y={-180 + i * 110} width={1080} height={96} rx={10} fill={hi === i ? 'rgba(255,216,74,0.18)' : 'rgba(255,255,255,0.05)'} /><text x={-510} y={-118 + i * 110} fontFamily="TagBold" fontSize={42} fill="#F4ECD8">{r}</text>{mark(a[i], 'a' + i, 170, -132 + i * 110)}{mark(b[i], 'b' + i, 400, -132 + i * 110)}</g>)}
      {row4 && r4 > 0 && <g opacity={Math.min(1, r4)}><rect x={-540} y={150} width={1080} height={96} rx={10} fill={hi === 3 ? 'rgba(255,216,74,0.18)' : 'rgba(255,255,255,0.05)'} /><text x={-510} y={212} fontFamily="TagBold" fontSize={42} fill="#FFD84A">{ROWS[3]}</text>{mark(a[3], 'a3', 170, 198)}{mark(b[3], 'b3', 400, 198)}</g>}
    </g>
  );
};

const Goldstone = hostShot((s) => [{ at: 0, arm: 'present', expr: 'normal' }, { at: wordAt(s, 'three'), arm: 'finger' }], {
  props: (s) => s.id === 's13b01' ? <PopProp at={wordAt(s, 'Goldstone')} x={1060} y={620}><g><rect x={-150} y={-200} width={300} height={400} rx={10} fill="#2E4A6A" stroke={OL} strokeWidth={7} /><rect x={-130} y={-200} width={20} height={400} fill="#1E2E4A" /><text y={-80} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill="#F4ECD8">REVOLUTION</text><text y={-40} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill="#F4ECD8">& REBELLION</text><text y={90} textAnchor="middle" fontFamily="Hand" fontSize={34} fill={GOLD}>J. Goldstone, 1991</text></g></PopProp>
    : <g>{[0, 1, 2].map((i) => <PopProp key={i} at={wordAt(s, 'three') + i * 5} x={880 + i * 110} y={640}><g><rect x={-46} y={-140} width={92} height={280} rx={10} fill={[MONEY, GOLD, PEOPLE][i]} stroke={OL} strokeWidth={5} /></g></PopProp>)}</g>,
});
const Conditions: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s13b03', 's13b04', 's13b05'].indexOf(s.id);
  const items = [{ lab: 'FISCAL CRISIS', sub: "can't pay its bills", c: MONEY }, { lab: 'ELITES DIVIDED', sub: 'fighting each other', c: GOLD }, { lab: 'MASS ANGER', sub: 'mobilised & angry', c: PEOPLE }];
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
      <InsertBg />
      <Layer depth={1}>
        {items.map((it, i) => { const k = springPop(f, i < idx ? -99 : i === idx ? 4 : 99999); return k > 0 ? <g key={i} transform={`translate(${460 + i * 500} 480) scale(${k})`} opacity={i === idx ? 1 : 0.55}>
          <rect x={-200} y={-240} width={400} height={480} rx={22} fill={it.c} stroke={OL} strokeWidth={8} />
          <text y={-160} textAnchor="middle" fontFamily="TagBold" fontSize={110} fill="#fff">{i + 1}</text>
          {i === 0 && <g transform="translate(0 0)"><rect x={-90} y={-40} width={180} height={110} rx={10} fill="#7A4E2B" stroke={OL} strokeWidth={5} /><text y={30} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill={GOLD}>EMPTY</text></g>}
          {i === 1 && <g>{[-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * 60} 40)`}><Chibi x={0} y={0} s={0.6} outfit={{ top: sd < 0 ? '#6A4A8A' : '#2E4A9A', bottom: '#F4F7FA' }} hat="hair" hair="#3A2416" pose="point" expr="angry" talking={[]} seed={'el' + sd} flip={sd > 0} /></g>)}</g>}
          {i === 2 && <g>{[-1, 0, 1].map((sd) => <g key={sd} transform={`translate(${sd * 70} 60)`}><Chibi x={0} y={0} s={0.55} {...SANS()} pose="fist" expr="angry" talking={[]} seed={'ma' + sd} /></g>)}</g>}
          <text y={160} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill="#fff">{it.lab}</text>
          <text y={205} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill="#F4ECD8">{it.sub}</text>
        </g> : null; })}
      </Layer>
    </CameraRig>
  );
};
/** The scoreboard across s13b06 – s13b31. */
const Score: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  const W = (w: string) => wordAt(s, w);
  const at: Record<string, number> = {};
  const a: Cell[] = ['', '', '', ''], b: Cell[] = ['', '', '', ''];
  if (n >= 8) { a[0] = 'y'; at.a0 = n === 8 ? W('yes,') : -99; }
  if (n >= 9) { a[1] = 'y'; at.a1 = n === 9 ? W('yes,') : -99; }
  if (n >= 11) { a[2] = 'y'; at.a2 = n === 11 ? W('yes,') : -99; }
  const row4 = n >= 12;
  at.row4 = n === 12 ? W('fourth') : -99;
  if (n >= 13) { a[3] = 'y'; at.a3 = n === 13 ? W('split.') : -99; }
  if (n >= 17) { b[0] = '~'; at.b0 = n === 17 ? W('arguably,') : -99; }
  if (n >= 23) { b[1] = 'y'; at.b1 = n === 23 ? W('yes,') : -99; }
  if (n >= 27) { b[2] = 'y'; at.b2 = n === 27 ? W('yes.') : -99; }
  const hi = n >= 8 && n <= 8 ? 0 : n >= 9 && n <= 10 ? 1 : n === 11 ? 2 : n >= 12 && n <= 15 ? 3 : n >= 17 && n <= 22 ? 0 : n >= 23 && n <= 26 ? 1 : n >= 27 ? 2 : -1;
  const side = (n >= 14 && n <= 15) || (n >= 18 && n <= 22) || (n >= 24 && n <= 26) || (n >= 28);
  const sx = side ? 560 : 960, sc = side ? 0.72 : 1;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.01 }}>
        <InsertBg />
        <Layer depth={1}>
          <Scoreboard a={a} b={b} at={at} row4={row4} hi={hi} x={sx} y={470} s={sc} />
          {(n === 14 || n === 15) && <g transform="translate(1480 820)">{[0, 1].map((i) => <Chibi key={i} x={-120 + i * 140} y={0} s={0.85} {...{ ...GUARD_NAT, outfit: { top: '#2E4A9A', bottom: '#F4F7FA', sash: '#C0392B' } }} pose="raise" expr="determined" talking={[]} seed={'fg' + i} />)}{[0, 1].map((i) => <Chibi key={'c' + i} x={160 + i * 120} y={0} s={0.8} {...SANS()} pose="cheer" expr="happy" talking={[]} seed={'fc' + i} />)}<text x={60} y={-300} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#FFD84A">French Guards join the crowd</text></g>}
          {n >= 18 && n <= 22 && <g transform="translate(1480 470)">{n <= 20 ? <><rect x={-260} y={-160} width={520} height={320} rx={18} fill="#F4ECD8" stroke={OL} strokeWidth={6} /><text y={-90} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#1A1410">NOT BANKRUPT</text><text y={-30} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#2E6B4A">markets still lend</text><text y={40} textAnchor="middle" fontFamily="Hand" fontSize={34} fill="#5A3A22">"serious but manageable"</text><text y={90} textAnchor="middle" fontFamily="Tag" fontSize={22} fill="#5A4A3A">a chief economist, to Le Monde</text></> : <><text y={-40} textAnchor="middle" fontFamily="TagBold" fontSize={80} fill="#FF6B57">~119% of GDP</text><text y={40} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#FFD84A">20-year-high borrowing costs</text>{n === 22 && <text y={130} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill="#F4ECD8" opacity={springPop(f, W('war.'))}>every budget = a war</text>}</>}</g>}
          {n >= 24 && n <= 26 && <g transform="translate(1480 560) scale(0.55)"><path d="M-560 0 Q0 -680 560 0" fill="none" stroke="#F4ECD8" strokeWidth={6} />{[...Array(24)].map((_, i) => { const a2 = Math.PI * (0.06 + 0.88 * i / 23); return <circle key={i} cx={-Math.cos(a2) * 480} cy={-Math.sin(a2) * 300} r={22} fill={['#C0392B', '#E8C23A', '#2E2E5A'][Math.floor(i / 8)]} stroke={OL} strokeWidth={3} />; })}{n === 26 && <g opacity={springPop(f, W('presidency,'))}><rect x={-300} y={40} width={600} height={100} rx={14} fill="#F4ECD8" stroke={OL} strokeWidth={5} /><text y={106} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#1A1410">WIN IT, NOT ABOLISH IT</text></g>}</g>}
          {n >= 28 && <g transform="translate(1480 470)">{n === 28 ? <><text y={-80} textAnchor="middle" fontFamily="TagBold" fontSize={70} fill="#F4ECD8">~550,000</text><text y={-20} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#FFD84A">+ students · unions · farmers · fishermen</text></> : <>{['leaderless', 'mixed demands', 'violent fringe'].map((t, i) => <g key={t} transform={`translate(0 ${-120 + i * 100}) scale(${springPop(f, n === 29 ? (i === 0 ? W('leaderless,') : i === 1 ? W('mixed,') : 99999) : n === 30 ? (i < 2 ? -99 : W('violent')) : -99)})`}><rect x={-230} y={-40} width={460} height={80} rx={12} fill="#5A5A64" stroke={OL} strokeWidth={4} /><text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#fff">{t}</text></g>)}</>}</g>}
        </Layer>
      </CameraRig>
    </>
  );
};
/** What's missing: three empty checkboxes with the contrasts. */
const Missing: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  const box = (i: number, at: number, label: string) => { const k = springPop(f, at); return k > 0 ? <g key={i} transform={`translate(200 ${280 + i * 170}) scale(${k})`}><rect x={-50} y={-50} width={100} height={100} rx={14} fill="#F4F7FA" stroke={OL} strokeWidth={7} /><path d="M-30 -30 L30 30 M30 -30 L-30 30" stroke="#B3261E" strokeWidth={10} opacity={0.0} /><text x={80} y={14} fontFamily="TagBold" fontSize={40} fill="#F4ECD8">{label}</text></g> : null; };
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
        <InsertBg />
        <Layer depth={1}>
          {n >= 33 && box(0, n === 33 ? wordAt(s, 'defection.') - 6 : -99, 'NO DEFECTION')}
          {n >= 36 && box(1, n === 36 ? wordAt(s, 'alternative') - 6 : -99, 'NO ALTERNATIVE')}
          {n >= 40 && box(2, n === 40 ? wordAt(s, 'legal') - 6 : -99, 'A LEGAL EXIT')}
          {n === 32 && <text x={960} y={480} textAnchor="middle" fontFamily="TagBold" fontSize={90} fill="#F4ECD8" opacity={springPop(f, wordAt(s, 'missing.'))}>what's missing?</text>}
          {(n === 34 || n === 35) && <g>
            <g transform="translate(1100 820)">{[0, 1].map((i) => <Chibi key={i} x={i * 150} y={0} s={0.9} {...{ outfit: { top: '#2A2E3A', bottom: '#2A2E3A' }, hat: 'kepi', hatColor: '#1E2E5A' }} pose="hold" expr="calm" talking={[]} seed={'pa' + i} />)}<text x={75} y={-310} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill="#F4ECD8">2026: on duty</text></g>
            {n === 35 && <g transform="translate(1560 820)" opacity={springPop(f, wordAt(s, '1789'))}>{[0, 1].map((i) => <Chibi key={i} x={i * 140} y={0} s={0.85} {...GUARD_NAT} pose="raise" expr="happy" talking={[]} seed={'sw' + i} />)}<text x={70} y={-310} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill={GOLD}>1789: switched</text></g>}
          </g>}
          {n >= 37 && n <= 39 && <g transform="translate(1340 520)">{n <= 38 ? <><rect x={-260} y={-150} width={520} height={300} rx={18} fill="#F4F7FA" stroke={OL} strokeWidth={6} /><text y={-60} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill="#1A1410">ELECTION</text><text y={10} textAnchor="middle" fontFamily="TagBold" fontSize={60} fill="#2E4A9A">SPRING 2027</text><text y={80} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#5A5A64">already scheduled</text></> : <><rect x={-260} y={-150} width={520} height={300} rx={18} fill="#F4ECD8" stroke={OL} strokeWidth={6} strokeDasharray="20 12" /><text y={0} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill="#5A3A22">1789: invent it</text><text y={60} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill="#5A3A22">from scratch</text></>}</g>}
          {n >= 40 && <g>
            {n === 40 && <g transform="translate(1240 820) scale(0.75)"><PillarTable x={0} y={0} at={-99} label /></g>}
            {n === 40 && <g transform={`translate(1660 400) scale(${springPop(f, wordAt(s, 'six'))})`}><Calendar x={0} y={0} s={0.6} month="SPRING" day="2027" color="#2E4A9A" glow={0.5 + 0.5 * Math.sin(f / 6)} /></g>}
            {n === 41 && <g transform="translate(1280 500)"><rect x={-180} y={-220} width={360} height={440} fill="#5A3A22" stroke={OL} strokeWidth={8} /><path d="M-180 0 H180 M-170 -200 L170 200 M170 -200 L-170 200" stroke="#8A8A8A" strokeWidth={16} strokeDasharray="24 12" /><rect x={-40} y={-30} width={80} height={70} rx={8} fill={GOLD} stroke={OL} strokeWidth={4} /><text y={290} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill={GOLD}>1789: a meeting the king didn't want</text></g>}
          </g>}
        </Layer>
      </CameraRig>
    </>
  );
};
const Echoes: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  if (n === 42) return <>{hostShot(() => [{ at: 0, arm: 'present', expr: 'normal' }])({ s })}</>;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
        <InsertBg />
        <Layer depth={1}>
          <clipPath id="ecL"><rect x={60} y={120} width={880} height={640} rx={20} /></clipPath>
          <clipPath id="ecR"><rect x={980} y={120} width={880} height={640} rx={20} /></clipPath>
          <g clipPath="url(#ecL)"><g transform="translate(60 120) scale(0.46)"><Versailles /></g>{[...Array(6)].map((_, i) => <Chibi key={i} x={150 + i * 130} y={740} s={0.6} {...PEASANT(['#C0392B', '#A83A2A', '#B85A30'][i % 3])} hat="bun" hatColor="#E8DCC0" legs="march" pose={i % 2 ? 'raise' : 'idle'} expr="determined" talking={[]} seed={'ev' + i} delay={i * 2} />)}</g>
          <g clipPath="url(#ecR)" opacity={n === 43 ? 0.25 : 1}><g transform="translate(980 120) scale(0.46)"><TownHall label="HÔTEL DE VILLE" /></g>{[...Array(6)].map((_, i) => <Chibi key={i} x={1070 + i * 130} y={740} s={0.6} {...MODERN(['#C0392B', '#2E4A9A', '#E8C23A'][i % 3], i)} legs="march" pose={i % 2 ? 'raise' : 'idle'} expr="determined" talking={[]} seed={'eh' + i} delay={i * 2} />)}</g>
          <rect x={60} y={120} width={880} height={640} rx={20} fill="none" stroke={GOLD} strokeWidth={6} />
          <rect x={980} y={120} width={880} height={640} rx={20} fill="none" stroke={PEOPLE} strokeWidth={6} />
          <text x={500} y={100} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill={GOLD}>OCTOBER 1789 · VERSAILLES</text>
          <text x={1420} y={100} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill={PEOPLE} opacity={n === 43 ? 0.3 : 1}>OCTOBER 2026 · TOWN HALLS</text>
        </Layer>
      </CameraRig>
      {n === 43 && <Label text="where the power slept" x={500} y={420} at={wordAt(s, 'slept.')} size={52} color="#FFD84A" />}
    </>
  );
};
const GreatFear: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#3A3A4A" />{[...Array(5)].map((_, i) => <g key={i} transform={`translate(${200 + i * 380} 600)`}><path d="M-80 0 L-80 -90 L0 -150 L80 -90 L80 0 Z" fill="#6A5A48" stroke={OL} strokeWidth={5} /><rect x={-20} y={-60} width={40} height={60} fill={i % 2 ? '#E8C66A' : '#2A2A34'} /></g>)}</Layer>
        <Layer depth={1}>
          <rect x={-200} y={760} width={2400} height={600} fill="#4A5A3A" stroke={OL} strokeWidth={4} />
          {[0, 1, 2, 3].map((i) => { const k = springPop(f, (n === 45 ? 10 : -99) + i * 8); return k > 0 ? <g key={i} transform={`translate(${300 + i * 420} ${380 + (i % 2) * 40}) scale(${k})`}><rect x={-110} y={-36} width={220} height={66} rx={30} fill="#F4F7FA" stroke={OL} strokeWidth={4} /><text y={10} textAnchor="middle" fontFamily="Hand" fontSize={32} fill="#1A1410">{['brigands!', 'aristocrats!', '…coming!', 'hide the grain!'][i]}</text></g> : null; })}
          {n >= 47 && [...Array(6)].map((_, i) => <Chibi key={i} x={200 + i * 230} y={930} s={0.95} {...PEASANT(['#8A3A2A', '#5A4A3A', '#6B5A45'][i % 3])} hat="cap" hatColor="#3A3A48" item={i % 2 ? 'spear' : 'mallet'} pose="hold" expr="shock" talking={[]} seed={'gf' + i} />)}
          {n === 47 && <g opacity={0.5 + 0.2 * Math.sin(f / 6)}>{[0, 1].map((i) => <path key={i} d={`M${1500 + i * 200} 900 q-30 -260 0 -300 q30 40 0 300 Z`} fill="#1A1A24" opacity={0.6} />)}<text x={1600} y={560} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#F4ECD8">?</text></g>}
        </Layer>
      </CameraRig>
      {n === 45 && <Label text="the Great Fear · summer 1789" x={960} y={140} at={wordAt(s, 'Great')} size={54} color="#FFD84A" />}
    </>
  );
};
const Suspicion: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  const cols = ['#E8C23A', '#C0392B', '#1E2E6A', '#5A5A64'];
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <InsertBg />
      <Layer depth={1}>
        {cols.map((c, i) => { const a = (i / 4) * Math.PI * 2 + Math.PI / 4; const x = 960 + Math.cos(a) * 380, y = 470 + Math.sin(a) * 260; const t = cols[(i + 1) % 4]; const a2 = ((i + 1) / 4) * Math.PI * 2 + Math.PI / 4; return <g key={i}><circle cx={x} cy={y} r={80 * springPop(f, 4 + i * 4)} fill={c} stroke={OL} strokeWidth={6} /><path d={`M${x} ${y} L${x + (960 + Math.cos(a2) * 380 - x) * 0.6} ${y + (470 + Math.sin(a2) * 260 - y) * 0.6}`} stroke="#F4ECD8" strokeWidth={8} strokeDasharray="16 10" opacity={springPop(f, 20 + i * 5)} /><text x={x} y={y + 18} textAnchor="middle" fontFamily="TagBold" fontSize={54} fill="#fff">👉</text></g>; })}
        {n === 50 && <text x={960} y={490} textAnchor="middle" fontFamily="TagBold" fontSize={70} fill="#FFD84A" opacity={springPop(f, wordAt(s, 'plot.'))}>a plot?</text>}
        {n === 49 && <g transform={`translate(960 470) scale(${springPop(f, wordAt(s, 'foreign'))})`}><circle r={90} fill="#2E6B9A" stroke={OL} strokeWidth={6} /><path d="M-60 -30 Q0 -60 60 -20 M-70 20 Q0 50 70 20" stroke="#6AA84F" strokeWidth={14} fill="none" /></g>}
      </Layer>
    </CameraRig>
  );
};
const Verdict = hostShot((s) => [{ at: 0, arm: s.id === 's13b51' ? 'chin' : s.id === 's13b53' ? 'finger' : 'present', expr: s.id === 's13b53' ? 'grin' : 'normal' }], {
  props: (s) => {
    const f = useCurrentFrame();
    if (s.id === 's13b51') return <PopProp at={wordAt(s, 'revolution?')} x={1060} y={600}><text textAnchor="middle" y={60} fontFamily="TagBold" fontSize={220} fill="#1A1410">?</text></PopProp>;
    const yet = s.id === 's13b53' ? 1 + 0.15 * Math.sin(f / 3) : 1;
    return <PopProp at={s.id === 's13b52' ? wordAt(s, 'not') : -99} x={1040} y={620}><g><rect x={-200} y={-80} width={400} height={160} rx={18} fill="#F4F7FA" stroke={OL} strokeWidth={7} /><text x={-50} y={22} textAnchor="middle" fontFamily="TagBold" fontSize={66} fill="#1A1410">NOT</text><g transform={`translate(90 0) scale(${yet})`}><text y={22} textAnchor="middle" fontFamily="TagBold" fontSize={66} fill="#B3261E">YET</text></g></g></PopProp>;
  },
});
const Hindsight: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b55 = s.id === 's13b55';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          {!b55 && <><g transform="translate(620 480)"><circle r={170} fill="#7AB8FF" opacity={0.75} stroke={OL} strokeWidth={8} /><path d="M-60 -120 L-10 -40 L-50 20 L10 90" stroke={OL} strokeWidth={6} fill="none" opacity={springPop(f, wordAt(s, 'bad'))} /><rect x={-110} y={160} width={220} height={50} rx={10} fill="#7A4E2B" stroke={OL} strokeWidth={5} /><text y={260} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#F4ECD8">PREDICTING</text></g>
            <g transform="translate(1300 480)"><rect x={-160} y={-200} width={320} height={400} rx={10} fill="#7A3A2A" stroke={OL} strokeWidth={7} /><text y={-40} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill={GOLD}>HINDSIGHT</text><text y={260} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#F4ECD8" opacity={springPop(f, wordAt(s, 'explaining'))}>EXPLAINING</text><path d="M-60 40 L-10 90 L70 -10" stroke="#2E8B57" strokeWidth={14} fill="none" opacity={springPop(f, wordAt(s, 'good'))} /></g></>}
          {b55 && <g><path d="M300 820 L420 680 L640 660 L800 700 L1000 640 L1200 690 L1400 820 Z" fill="#6A6A70" stroke={OL} strokeWidth={6} />{[...Array(5)].map((_, i) => <Chibi key={i} x={520 + i * 170} y={660} s={0.8} {...{ outfit: { top: ['#C0392B', '#2E4A9A', '#E2B13C', '#2E6B4A', '#8A3A8A'][i], bottom: '#2A3A5A' }, hat: 'hair', hair: '#3A2416' }} pose={i % 2 ? 'raise' : 'shrug'} expr="normal" talking={[]} seed={'b68' + i} />)}<g transform="translate(1520 480)"><PillarTable x={0} y={300} s={0.45} at={-99} label={false} /><text y={-120} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#2E8B57" opacity={springPop(f, wordAt(s, 'did.'))}>…it held</text></g></g>}
        </Layer>
      </CameraRig>
      {b55 && <Label text="May 1968" x={860} y={160} at={wordAt(s, 'May')} size={56} color="#FFD84A" />}
    </>
  );
};
const WhoPays: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = parseInt(s.id.slice(4), 10);
  const len = n === 57 ? interpolate(f, [wordAt(s, 'bill') - 6, wordAt(s, 'due.') + 10], [80, 300], Easing.out) : n > 57 ? 300 : 80;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          <text x={560} y={300} textAnchor="middle" fontFamily="TagBold" fontSize={110} fill={GOLD}>1789</text>
          <text x={1360} y={300} textAnchor="middle" fontFamily="TagBold" fontSize={110} fill={PEOPLE} opacity={n >= 56 ? springPop(f, n === 56 ? wordAt(s, '2026') : -99) : 0}>2026</text>
          {n >= 56 && <g opacity={springPop(f, n === 56 ? wordAt(s, 'cause,') : -99)}><path d="M720 270 H1200" stroke="#F4ECD8" strokeWidth={8} /><text x={960} y={240} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#F4ECD8">SAME CAUSE</text></g>}
          {n >= 57 && <Bill x={960} y={340} len={len} text="WHO PAYS?" rot={-3} />}
          {n >= 58 && <g opacity={springPop(f, n === 58 ? wordAt(s, 'outcome.') : -99)}><path d="M720 700 H1200" stroke="#F4ECD8" strokeWidth={8} strokeDasharray="20 16" /><text x={960} y={760} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#F4ECD8">different outcome — so far</text></g>}
        </Layer>
      </CameraRig>
    </>
  );
};
const Finale = hostShot((s) => [{ at: 0, arm: 'present', expr: 'smile' }, { at: wordAt(s, 'centuries'), arm: 'finger', expr: 'proud' }], {
  props: (s) => <PopProp at={wordAt(s, 'two')} x={1060} y={620}><g><rect x={-210} y={-90} width={420} height={180} rx={18} fill="#F4ECD8" stroke={OL} strokeWidth={7} /><text y={-10} textAnchor="middle" fontFamily="TagBold" fontSize={60} fill="#1A1410">237 YEARS</text><text y={50} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#5A4A3A">1789 → 2026</text></g></PopProp>,
});

export const SHOTS_12: ShotMap = {
  goldstone: Goldstone, conditions: Conditions, score: Score, missing: Missing, echoes: Echoes, great_fear: GreatFear,
  suspicion: Suspicion, verdict: Verdict, hindsight: Hindsight, who_pays: WhoPays, finale: Finale,
};
