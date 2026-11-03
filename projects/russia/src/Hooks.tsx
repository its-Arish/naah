/** Retention inserts (Nov 2026): the Kaliningrad hook, re-hooks, "the bill" receipt, the 1812/1941 callback.
 *  New narrator moves: riding his staff (broomstick-style), pole-vaulting on it, twirling it, holding it level as a gate. */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop, gravityDrop, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { Host } from '@engine/characters/Host';
import { GreyStage, InsertBg } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { LogHut, OnionChurch } from '@engine/scenes/Russia';
import { Plain } from '@engine/scenes/India';
import { talk, wordAt, PopProp, Drop, type ShotMap, type SP } from '@engine/kit';
import { W } from '@engine/cast/Wardrobe';
import { Calendar, CoinArc } from '@engine/fx/Infographics';
import type { Shot } from '@engine/types';
import timeline from '@project/build/timeline.json';
import { RED, PAPER, GOLD } from './Cast';
import { at, Sign, Hand, Person, Flag } from './Kit2';

const SHOTS_ALL = (timeline as any).shots as Shot[];
/** Frame within the run of consecutive beats that share this beat's shot id (for animation that flows across lines). */
export const useGroup = (s: Shot) => {
  const f = useCurrentFrame();
  const i = SHOTS_ALL.findIndex((x) => x.id === s.id);
  let a = i; while (a > 0 && SHOTS_ALL[a - 1].shot === s.shot && SHOTS_ALL[a - 1].from + SHOTS_ALL[a - 1].dur === SHOTS_ALL[a].from) a--;
  let b = i; while (b < SHOTS_ALL.length - 1 && SHOTS_ALL[b + 1].shot === s.shot && SHOTS_ALL[b].from + SHOTS_ALL[b].dur === SHOTS_ALL[b + 1].from) b++;
  const start = SHOTS_ALL[a]?.from ?? s.from, end = (SHOTS_ALL[b]?.from ?? s.from) + (SHOTS_ALL[b]?.dur ?? s.dur);
  return { g: s.from - start + f, gd: end - start, k: i - a };
};

/** Narrator riding his staff like a broomstick. x/y = his hips. Bobs, tilts with speed, speed-lines behind. */
export const Rider: React.FC<{ x: number; y: number; s?: number; tilt?: number; speed?: number; arm?: string; expr?: string; talking?: [number, number][]; flip?: boolean }> = ({ x, y, s = 0.6, tilt = -6, speed = 1, arm = 'point', expr = 'grin', talking = [], flip }) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 6) * 10;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${flip ? -1 : 1} 1) rotate(${tilt + Math.sin(f / 9) * 2})`}>
      {speed > 0.2 && [0, 1, 2, 3].map((i) => <path key={i} d={`M${-200 * s - i * 14} ${-150 * s + i * 34 * s} h${-(120 + ((f * 9 + i * 37) % 90)) * s * speed}`} stroke="#fff" strokeOpacity={0.55} strokeWidth={5} strokeLinecap="round" />)}
      <Host x={0} y={215 * s} scale={s} keys={[{ at: 0, arm, expr }]} talking={talking} staffMode="ride" legs="sit" />
    </g>
  );
};

/** Pole-vault: run in, plant the staff, swing over it (rotating about the staff's foot), land. Returns the narrator for local frame t. */
const HX = -107; // staff x relative to the narrator (idle left arm)
export const Vault: React.FC<{ t: number; from: number; plant: number; to: number; y?: number; s?: number; expr?: string; talking?: [number, number][] }> = ({ t, from, plant, to, y = 960, s = 1, expr = 'grin', talking = [] }) => {
  const run = 14, swing = 18;
  if (t < run) {
    const x = interpolate(t, [0, run], [from, plant], Easing.in);
    return <g transform={`translate(0 ${-Math.abs(Math.sin(t / 2)) * 12})`}><Host x={x} y={y} scale={s} keys={[{ at: 0, arm: 'fist', expr }]} talking={talking} /></g>;
  }
  if (t < run + swing) {
    const p = (t - run) / swing;
    const ang = interpolate(p, [0, 1], [-35, 70], Easing.inOut) * Math.sign(to - plant);
    const footX = plant + HX * s;
    return <g transform={`rotate(${ang} ${footX} ${y})`}><Host x={plant} y={y - Math.sin(p * Math.PI) * 40 * s} scale={s} keys={[{ at: 0, arm: 'wave', expr: 'grin' }]} talking={talking} legs="tuck" /></g>;
  }
  const tt = t - run - swing;
  const land = gravityDrop(tt, 0, { h: 160 * s, g: 2.4, e: 0.2 });
  const x = interpolate(tt, [0, 8], [plant + (to - plant) * 0.75, to], Easing.out);
  return <g transform={`translate(${x} ${y + land.y}) scale(${land.sx} ${land.sy}) translate(${-x} ${-y})`}><Host x={x} y={y} scale={s} keys={[{ at: 0, arm: 'present', expr }]} talking={talking} /></g>;
};

/** "The Bill": a receipt printer whose paper grows line by line. lines = printed entries; the last one prints at `printAt`. */
export const BILL_LINES = [
  ['BILL 1', 'SERFS', '2 centuries'],
  ['BILL 2', 'FAMINE & TERROR', 'millions'],
  ['BILL 3', 'WAR', '27,000,000'],
  ['BILL 4', '██████████', '?'],
];
export const Receipt: React.FC<{ x: number; y: number; s?: number; lines: number; printAt?: number; redacted?: boolean }> = ({ x, y, s = 1, lines, printAt = 0 }) => {
  const f = useCurrentFrame();
  const LH = 74;
  const grow = interpolate(f, [printAt, printAt + 14], [Math.max(0, lines - 1), lines], Easing.out);
  const len = 120 + grow * LH;
  const jitter = f >= printAt && f < printAt + 14 ? Math.sin(f * 3) * 2 : 0;
  return (
    <g transform={`translate(${x + jitter} ${y}) scale(${s})`}>
      <path d={`M-170 0 H170 V${len} l-20 14 l-20 -14 l-20 14 l-20 -14 l-20 14 l-20 -14 l-20 14 l-20 -14 l-20 14 l-20 -14 l-20 14 l-20 -14 l-20 14 l-20 -14 l-20 14 l-20 -14 l-10 7 Z`} fill="#FBF8F0" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
      <text y={58} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#1A1410">THE BILL</text>
      <path d="M-140 84 H140" stroke="#1A1410" strokeWidth={3} strokeDasharray="10 8" />
      {BILL_LINES.slice(0, lines).map(([n, what, amt], i) => {
        const vis = Math.max(0, Math.min(1, grow - i));
        return vis > 0 ? <g key={n} transform={`translate(0 ${130 + i * LH})`} opacity={vis}>
          <text x={-140} fontFamily="Tag" fontSize={22} fill="#7A6A5A">{n}</text>
          <text x={-140} y={32} fontFamily="TagBold" fontSize={i === 3 ? 30 : 26} fill="#1A1410">{what}</text>
          <text x={140} y={8} textAnchor="end" fontFamily="TagBold" fontSize={26} fill={RED}>{amt}</text>
        </g> : null;
      })}
      <rect x={-200} y={-60} width={400} height={70} rx={14} fill="#3A3A44" stroke={OL} strokeWidth={6} />
      <rect x={-175} y={-12} width={350} height={12} rx={4} fill="#1A1A20" />
      <circle cx={160} cy={-30} r={9} fill={f >= printAt && f < printAt + 14 ? '#6AE06A' : '#2A5A2A'} />
    </g>
  );
};

/** A left-aligned dark tag for map overlays (SVG). */
const MapTag: React.FC<{ t: number; x: number; y: number; text: string; c: string; small?: boolean }> = ({ t, x, y, text, c, small }) => {
  const f = useCurrentFrame(); const k = springPop(f, t); if (k <= 0) return null;
  const fs = small ? 26 : 32, w = text.length * fs * 0.62 + 40;
  return <g transform={`translate(${x} ${y}) scale(${k})`}><rect x={-20} y={-fs - 8} width={w} height={fs + 26} rx={10} fill="rgba(16,20,28,0.82)" stroke={c} strokeWidth={3} /><text fontFamily="TagBold" fontSize={fs} fill={c}>{text}</text></g>;
};

// ---------------------------------------------------------------- INSERT 0 (hook): Kaliningrad map + narrator flying in on his staff
const KalinExtra: React.FC<SP> = ({ s }) => {
  const { g } = useGroup(s);
  const p = interpolate(g, [0, 70], [0, 1], Easing.out);
  // fly in from top-left, loop once around the exclave (screen centre after the map's zoom), then hover right
  const a = interpolate(g, [40, 110], [Math.PI, Math.PI * 3], Easing.inOut);
  const loop = g > 40 && g < 110;
  const x = g <= 40 ? interpolate(p, [0, 1], [-300, 700]) : loop ? 960 + Math.cos(a) * 300 : interpolate(g, [110, 140], [960 + 300, 1460], Easing.out);
  const y = g <= 40 ? interpolate(p, [0, 1], [120, 420]) : loop ? 470 + Math.sin(a) * 150 : interpolate(g, [110, 140], [470, 400], Easing.out);
  const k = s.id === 's00i03' ? 1 : 0;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0 }} width={1920} height={1080}>
      <Rider x={x} y={y} s={0.42} tilt={loop ? Math.cos(a) * 10 : -6} speed={g < 140 ? 1 : 0.1} arm={k ? 'shrug' : 'point'} expr={k ? 'smile' : 'grin'} flip={loop && Math.sin(a) < 0} />
      <MapTag t={s.id === 's00i01' ? 6 : -99} x={330} y={150} text="30 SEPTEMBER 2026" c="#FFD84A" />
      {s.id !== 's00i01' && <MapTag t={s.id === 's00i02' ? at(s, 'nuclear') : -99} x={330} y={225} text="RUSSIA: 'ALL WEAPONS, INCLUDING NUCLEAR'" c="#FF8A7A" />}
      {s.id === 's00i03' && <MapTag t={at(s, 'blockade', 6) - 6} x={330} y={300} text="NATO: 'NO BLOCKADE PLANNED'" c="#A8D4FF" />}
      {s.id !== 's00i01' && <MapTag t={-99} x={1210} y={790} text="POLAND (NATO)" c="#A8D4FF" small />}
      {s.id !== 's00i01' && <MapTag t={-99} x={1350} y={300} text="LITHUANIA (NATO)" c="#A8D4FF" small />}
    </svg>
  );
};

// ---------------------------------------------------------------- "less than one-thousandth of its size"
const RUS = 'M-560 -40 Q-520 -150 -380 -170 Q-200 -230 0 -210 Q200 -250 420 -200 Q560 -170 600 -60 Q560 40 420 60 Q240 120 40 90 Q-160 130 -340 90 Q-520 80 -560 -40 Z';
const Ratio: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b5 = s.id === 's00i05';
  const zoom = b5 ? interpolate(f, [at(s, 'one-thousandth') - 4, at(s, 'one-thousandth') + 22], [1, 1.9], Easing.inOut) : 1;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform={`translate(960 520) scale(${zoom}) translate(${b5 ? 520 : 0} 0)`}>
            <g opacity={springPop(f, b5 ? -99 : 4)}><path d={RUS} fill={RED} stroke={OL} strokeWidth={6} />
              <text x={60} y={-40} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill="#fff">RUSSIA</text>
              <text x={60} y={10} textAnchor="middle" fontFamily="Tag" fontSize={30} fill="#F4ECD8">17.1 million km²</text></g>
            <g transform="translate(-640 -40)">
              <circle r={b5 ? 7 : 5} fill="#FFD84A" stroke={OL} strokeWidth={2} />
              {b5 && <g opacity={springPop(f, at(s, 'one-thousandth'))}><path d="M0 0 L-60 -70" stroke="#FFD84A" strokeWidth={3} /><text x={-64} y={-80} textAnchor="end" fontFamily="TagBold" fontSize={24} fill="#FFD84A">Kaliningrad · 15,100 km²</text></g>}
            </g>
          </g>
        </Layer>
      </CameraRig>
      {b5 && <Label text="≈ 0.09% of Russia" x={960} y={180} at={at(s, 'one-thousandth') + 10} size={64} color="#FFD84A" />}
    </>
  );
};

// ---------------------------------------------------------------- "afraid of the same thing for eight hundred years"
const Fear: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [1380, 500] }}>
      <GreyStage />
      <Layer depth={1}>
        <PopProp at={at(s, 'afraid') - 4} x={1040} y={380}><g><path d="M-90 0 Q0 -70 90 0 Q0 70 -90 0 Z" fill="#fff" stroke={OL} strokeWidth={6} /><circle r={26} fill="#2A2E3A" /></g></PopProp>
        <PopProp at={at(s, 'eight') - 2} x={1040} y={560}><g><rect x={-130} y={-50} width={260} height={100} rx={14} fill={PAPER} stroke={OL} strokeWidth={6} /><text y={18} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill={RED}>800 YRS</text></g></PopProp>
        <Host x={1380} keys={[{ at: 0, arm: 'chin', expr: 'worried' }, { at: at(s, 'eight'), arm: 'finger', expr: 'worried' }]} talking={talk(s)} />
      </Layer>
    </CameraRig>
  </>
);

// ---------------------------------------------------------------- "stay to the end… numbers the Kremlin stopped publishing… may scare it even more"
const Promise_: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = ['s00i07', 's00i08', 's00i09'].indexOf(s.id);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: k === 2 ? 1.08 : 1.03, focus: [1200, 500] }}>
      <GreyStage />
      <Layer depth={1}>
        {k >= 1 && <PopProp at={k === 1 ? at(s, 'numbers') - 4 : -99} x={1040} y={470}><g transform="rotate(-4)">
          <path d="M-150 -110 H-40 L-20 -130 H150 V120 H-150 Z" fill="#E8C878" stroke={OL} strokeWidth={6} strokeLinejoin="round" />
          <text y={-30} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#5A4A3A">RUSSIA: BIRTHS</text>
          <rect x={-110} y={0} width={220} height={24} fill="#1A1410" /><rect x={-110} y={40} width={170} height={24} fill="#1A1410" />
        </g></PopProp>}
        {k >= 1 && <Drop at={k === 1 ? at(s, 'stopped') - 6 : -99} x={1040} y={620} h={500} e={0.25}><g transform="rotate(-8)"><rect x={-150} y={-44} width={300} height={70} rx={8} fill="rgba(255,255,255,0.92)" stroke={RED} strokeWidth={6} /><text y={8} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill={RED}>NOT PUBLISHED</text></g></Drop>}
        {k === 0 && <PopProp at={6} x={1040} y={500}><g><rect x={-120} y={-60} width={240} height={120} rx={16} fill="#1A1410" /><path d="M-30 -30 L40 0 L-30 30 Z" fill="#FFD84A" /><text y={100} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#3A3A48">WATCH TO THE END</text></g></PopProp>}
        <Host x={1380} keys={[{ at: 0, arm: k === 0 ? 'point' : k === 1 ? 'present' : 'shrug', expr: k === 2 ? 'shock' : 'smile' }]} talking={talk(s)} />
      </Layer>
    </CameraRig>
  );
};

// ---------------------------------------------------------------- INSERT 1: vault from Kyiv to Moscow
const VaultShot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = ['s02i01', 's02i02', 's02i03'].indexOf(s.id);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={0.9}>
          <path d="M-100 760 Q960 700 2020 770 L2020 1200 L-100 1200 Z" fill="#3E5A44" stroke={OL} strokeWidth={4} />
          <g transform="translate(260 760)"><OnionChurch x={0} y={0} s={0.3} dome="#7FB2E5" /><text y={46} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill={PAPER}>KYIV</text></g>
          <g transform="translate(1500 760)"><LogHut x={-60} y={0} s={0.3} seed="vm1" /><LogHut x={70} y={4} s={0.26} seed="vm2" /><OnionChurch x={0} y={-4} s={0.24} /><text y={46} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill={PAPER}>MOSCOW</text></g>
        </Layer>
        <Layer depth={1}>
          {k === 0 ? <Vault t={f} from={-200} plant={720} to={1180} y={900} s={0.62} talking={talk(s)} /> : <Host x={1180} y={900} scale={0.62} keys={[{ at: 0, arm: k === 1 ? 'shrug' : 'present', expr: 'grin' }]} talking={talk(s)} />}
          {k === 0 && <CoinArc from={[1500, 720]} to={[1840, 620]} start={at(s, 'money') - 6} every={5} n={6} c={GOLD} sym="" />}
          {k === 0 && f > at(s, 'Mongols') - 4 && <Chibi x={1820} y={760} s={0.6} {...W.KNIGHT('#2E4A6A', GOLD)} hat="mongol" hatColor="#8A3A2A" pose="present" expr="grin" talking={[]} seed="vmg" flip />}
          {k === 1 && <PopProp at={at(s, 'tenth') - 4} x={1500} y={380}><g><circle r={150} fill="#4F86B8" stroke={OL} strokeWidth={7} /><path d="M0 0 L0 -150 A150 150 0 0 1 88 -121 Z" fill={RED} stroke={OL} strokeWidth={5} /><text y={200} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill={PAPER}>&gt; 1/10 OF ALL LAND</text></g></PopProp>}
          {k === 2 && <Drop at={at(s, 'Moneybag') - 8} x={1500} y={700} h={600} e={0.3}><g><path d="M-90 0 Q-115 -140 -32 -165 L-48 -198 H48 L32 -165 Q115 -140 90 0 Z" fill="#C9A66B" stroke={OL} strokeWidth={6} /><text y={-62} textAnchor="middle" fontFamily="TagBold" fontSize={70} fill={GOLD} stroke={OL} strokeWidth={3}>₽</text></g></Drop>}
        </Layer>
      </CameraRig>
      {k === 2 && <Label text="Ivan I &quot;Kalita&quot;" x={1500} y={260} at={at(s, 'Moneybag')} size={56} color="#FFD84A" />}
    </>
  );
};

// ---------------------------------------------------------------- INSERT 2: twirl the staff, the bill starts printing
const BillShot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = ['s03i01', 's03i02', 's03i03'].indexOf(s.id);
  const spinning = k === 0 && f < 34;
  const rot = spinning ? interpolate(f, [0, 34], [0, 720], Easing.out) : 0;
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.035, focus: [1300, 500] }}>
      <GreyStage />
      <Layer depth={1}>
        {k >= 1 && <Receipt x={1110} y={300} s={0.8} lines={0} printAt={9999} />}
        {k === 0 && <PopProp at={8} x={1040} y={420}><text textAnchor="middle" fontFamily="TagBold" fontSize={180} fill={RED}>1</text></PopProp>}
        <Host x={1420} keys={[{ at: 0, arm: k === 2 ? 'finger' : 'present', expr: k === 1 ? 'worried' : 'grin' }]} talking={talk(s)} staffMode={spinning ? 'spin' : 'hold'} staffRot={rot} />
      </Layer>
    </CameraRig>
  );
};
/** INSERTS 3, 6, 8 (quiet) and 10: the receipt prints its next line. */
const ReceiptShot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = ({ s04i01: 1, s06i05: 2, s07i05: 3, s10i01: 3, s10i02: 4 } as Record<string, number>)[s.id] ?? 1;
  const loud = s.id.startsWith('s10');
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: loud ? 1.06 : 1.02, focus: [960, 420] }}>
      <InsertBg glow={loud} />
      <Layer depth={1}><Receipt x={960} y={150} s={1.45} lines={n} printAt={s.id === 's10i01' ? 9999 : s.id === 's10i02' ? at(s, 'Here') - 4 : 8} /></Layer>
      {!loud && <Layer depth={1.2}><rect x={-300} y={-300} width={2600} height={1700} fill="#000" opacity={interpolate(f, [d * 0.6, d], [0, 0.25])} /></Layer>}
    </CameraRig>
  );
};

// ---------------------------------------------------------------- INSERT 4: fly alongside Napoleon's army; 1812 → 1941
const Spot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const { g } = useGroup(s);
  const k = ['s05i01', 's05i02', 's05i03', 's05i04'].indexOf(s.id);
  const x0 = interpolate(g, [0, 400], [-300, 700]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Plain tents={false} />
        <Layer depth={1}>
          {[...Array(6)].map((_, i) => <Chibi key={i} x={x0 + i * 130} y={940} s={0.8} {...W.GRENADIER} legs="march" pose="hold" expr="determined" talking={[]} seed={'sg' + i} delay={i * 2} />)}
          <Chibi x={x0 + 880} y={940} s={1.0} {...W.GENERAL_1800} legs="march" pose={k === 1 ? 'point' : 'hold'} expr="determined" talking={[]} seed="spn" />
          <Rider x={interpolate(g, [0, 60], [-200, 820], Easing.out) + Math.sin(g / 30) * 40} y={330} s={0.42} arm={k === 3 ? 'finger' : 'point'} expr="grin" speed={g < 60 ? 1 : 0.3} talking={talk(s)} />
          {k >= 2 && <g opacity={springPop(f, k === 2 ? at(s, 'same') - 6 : -99)}><Calendar x={1560} y={360} s={0.62} month="JUNE" day={k === 2 && f < at(s, 'later') - 4 ? 1812 : 1941} flipAt={k === 2 ? at(s, 'later') - 8 : undefined} from={{ month: 'JUNE', day: 1812 }} color="#8C1D18" /></g>}
          {k === 3 && <PopProp at={at(s, 'spot') - 2} x={x0 + 880} y={560}><text textAnchor="middle" fontFamily="TagBold" fontSize={120} fill={RED}>?</text></PopProp>}
        </Layer>
      </CameraRig>
      {k === 1 && <Label text="Napoleon, June 1812" x={x0 + 880} y={520} at={at(s, 'general')} size={44} color="#FFD84A" />}
    </>
  );
};

// ---------------------------------------------------------------- INSERT 5: quick score check (vault onto the stage, tick the board)
const Score: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = ['s06i01', 's06i02', 's06i03', 's06i04'].indexOf(s.id);
  const rows: [string, string, boolean, number][] = [
    ['LAND', 'biggest on Earth', true, k === 1 ? at(s, 'Earth') - 4 : k > 1 ? -99 : 9999],
    ['NAPOLEON', 'beaten', true, k === 1 ? at(s, 'beaten') - 4 : k > 1 ? -99 : 9999],
    ['PEOPLE', 'not enough', false, k === 2 ? at(s, 'enough') - 4 : k > 2 ? -99 : 9999],
  ];
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.035, focus: [1300, 500] }}>
      <GreyStage />
      <Layer depth={1}>
        <PopProp at={k === 0 ? 10 : -99} x={1060} y={430}><g>
          <rect x={-190} y={-200} width={380} height={400} rx={18} fill="#1E2A22" stroke={OL} strokeWidth={8} />
          <text y={-150} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#FFD84A">SCORE CHECK</text>
          {rows.map(([a, b, ok, t], i) => <g key={a} transform={`translate(0 ${-80 + i * 100})`}>
            <text x={-160} fontFamily="TagBold" fontSize={30} fill={PAPER}>{a}</text>
            <text x={-160} y={32} fontFamily="Tag" fontSize={22} fill="#C9C2B4">{b}</text>
            <g transform="translate(130 0)" opacity={springPop(f, t)}>{ok ? <path d="M-24 0 L-6 20 L26 -18" stroke="#6AD06A" strokeWidth={10} fill="none" strokeLinecap="round" /> : <path d="M-20 -18 L20 22 M20 -18 L-20 22" stroke="#FF6B5A" strokeWidth={10} strokeLinecap="round" />}</g>
          </g>)}
        </g></PopProp>
        {k === 0 ? <Vault t={f} from={2200} plant={1700} to={1400} y={960} s={1} talking={talk(s)} /> : <Host x={1400} keys={[{ at: 0, arm: k === 3 ? 'finger' : 'point', expr: k === 3 ? 'worried' : 'grin' }]} talking={talk(s)} />}
      </Layer>
    </CameraRig>
  );
};

// ---------------------------------------------------------------- INSERT 7: "Did you spot it?" 1812 and 1941 side by side
const Same: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const { g } = useGroup(s);
  const k = ['s07i01', 's07i02', 's07i03', 's07i04'].indexOf(s.id);
  const p1 = interpolate(g, [10, 80], [0, 1], Easing.inOut), p2 = interpolate(g, [40, 120], [0, 1], Easing.inOut);
  const bend = k === 3 ? interpolate(f, [at(s, 'first') - 6, at(s, 'first') + 20], [0, 1], Easing.inOut) : 0;
  const arrow = (y: number, p: number, c: string, label: string) => {
    const xEnd = 300 + 1100 * p - bend * 500;
    return <g><path d={`M300 ${y} H${Math.max(300, xEnd)}`} stroke={c} strokeWidth={22} strokeLinecap="round" strokeDasharray={c === '#7FB2E5' ? '40 20' : undefined} />
      {p > 0.05 && <path d={`M${xEnd - 10} ${y - 40} l50 40 l-50 40`} fill="none" stroke={c} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" transform={bend > 0.5 ? `rotate(180 ${xEnd + 15} ${y})` : undefined} />}
      <text x={290} y={y - 34} fontFamily="TagBold" fontSize={34} fill={c}>{label}</text></g>;
  };
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          <path d="M200 760 Q960 720 1760 760" stroke="#5A7A5A" strokeWidth={8} fill="none" strokeDasharray="6 14" />
          <text x={1600} y={500} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill={PAPER}>MOSCOW</text><circle cx={1600} cy={540} r={16} fill={GOLD} stroke={OL} strokeWidth={4} />
          {arrow(420, p1, '#7FB2E5', 'NAPOLEON · JUNE 1812')}
          {arrow(640, p2, '#FF6B5A', 'HITLER · JUNE 1941')}
          {k === 2 && ['SAME PLAIN', 'SAME SUMMER', 'SAME IDEA'].map((t, i) => <Sign key={t} t={at(s, 'Same') - 4 + i * 16} x={540 + i * 420} y={860} text={t} size={34} />)}
          {k === 3 && [...Array(30)].map((_, i) => <circle key={i} cx={(random('sn' + i) * 1920 + f * 3) % 1920} cy={(random('sm' + i) * 1080 + f * 6) % 1080} r={4 + random('so' + i) * 4} fill="#fff" opacity={bend * 0.8} />)}
          <Rider x={interpolate(g, [0, 120], [100, 1300], Easing.inOut)} y={260} s={0.4} speed={g < 120 ? 1 : 0.2} arm={k === 0 ? 'finger' : 'point'} expr="grin" talking={talk(s)} />
        </Layer>
      </CameraRig>
    </>
  );
};

// ---------------------------------------------------------------- INSERT 9: drops from the sky on his staff
const DropIn: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b1 = s.id === 's09i01';
  const T = 4;
  const fall = b1 ? gravityDrop(f, T, { h: 900, g: 2.6, e: 0.15 }) : { y: 0, sx: 1, sy: 1 };
  const land = b1 ? T + Math.sqrt((2 * 900) / 2.6) : -99;
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.035, focus: [1380, 500], shakes: b1 ? [{ at: Math.round(land), amp: 16, len: 12 }] : [] }}>
      <GreyStage />
      <Layer depth={1}>
        {b1 && f > land && [...Array(8)].map((_, i) => { const t = f - land; return t < 30 ? <circle key={i} cx={1380 + (i - 3.5) * 30 * (1 + t / 8)} cy={960 - t * 1.5 - (i % 2) * 10} r={18 + t} fill="#9A9A9A" opacity={Math.max(0, 0.6 - t / 50)} /> : null; })}
        {!b1 && <PopProp at={6} x={1040} y={470}><g><rect x={-160} y={-80} width={320} height={160} rx={16} fill={PAPER} stroke={OL} strokeWidth={6} /><text y={-10} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#1A1410">2000 → 2026</text><text y={44} textAnchor="middle" fontFamily="Tag" fontSize={30} fill={RED}>in your lifetime</text></g></PopProp>}
        <g transform={`translate(1380 ${960 + fall.y}) scale(${fall.sx} ${fall.sy}) translate(-1380 -960)`}>
          <Host x={1380} keys={[{ at: 0, arm: b1 && f < land ? 'wave' : 'present', expr: 'grin' }]} talking={talk(s)} legs={b1 && f < land ? 'tuck' : 'stand'} />
        </g>
      </Layer>
    </CameraRig>
  );
};

// ---------------------------------------------------------------- INSERT 9b: over the Kaliningrad map, staff held level = the gate
const GateExtra: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = ['s09i03', 's09i04', 's09i05', 's09i06', 's09i07'].indexOf(s.id);
  const svg = (children: React.ReactNode) => <svg style={{ position: 'absolute', left: 0, top: 0 }} width={1920} height={1080}>{children}</svg>;
  if (k <= 2) return svg(<g><Rider x={1520} y={360} s={0.38} speed={0.15} arm={k === 2 ? 'present' : 'point'} expr="smile" talking={talk(s)} />{k === 2 && <><MapTag t={at(s, 'Poland') - 2} x={300} y={820} text="POLAND · NATO" c="#A8D4FF" /><MapTag t={at(s, 'Lithuania') - 2} x={300} y={250} text="LITHUANIA · NATO" c="#A8D4FF" /></>}{k === 1 && <MapTag t={at(s, 'off') - 2} x={300} y={250} text="CUT OFF FROM MAINLAND RUSSIA" c="#FFD84A" />}</g>);
  return svg(<g>
    <Host x={1500} y={760} scale={0.55} keys={[{ at: 0, arm: 'idle', expr: k === 4 ? 'worried' : 'smile' }]} talking={talk(s)} staffMode="level" />
    {k === 3 && <g opacity={springPop(f, at(s, 'gate') - 4)}><rect x={1300} y={300} width={420} height={70} rx={12} fill="rgba(20,18,16,0.85)" stroke="#E8533E" strokeWidth={4} /><text x={1510} y={348} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#FF8A7A">MOSCOW: A GATE</text></g>}
    {k === 4 && <MapTag t={at(s, 'missiles') - 2} x={300} y={820} text="ISKANDER MISSILES BASED HERE" c="#FF8A7A" />}
    {k === 4 && <g opacity={springPop(f, at(s, 'fortress') - 4)}><rect x={1260} y={300} width={500} height={70} rx={12} fill="rgba(20,18,16,0.85)" stroke="#7FB2E5" strokeWidth={4} /><text x={1510} y={348} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#A8D4FF">NEIGHBOURS: A FORTRESS</text></g>}
  </g>);
};

// ---------------------------------------------------------------- opening: no title card any more, just a dark beat before the hook
export const OpeningDark: React.FC<SP> = () => <div style={{ position: 'absolute', inset: 0, background: '#101a2a' }} />;

export const SHOTS_HOOKS: ShotMap = {
  in_ratio: Ratio, in_fear: Fear, in_promise: Promise_, in_vault: VaultShot, in_bill: BillShot, in_receipt: ReceiptShot, in_receipt10: ReceiptShot,
  in_spot: Spot, in_score: Score, in_same: Same, in_drop: DropIn,
};
export const MAP_EXTRAS_HOOKS: Record<string, React.FC<SP>> = { 'map:kalin': KalinExtra, 'map:gate': GateExtra };
