/** Hook, second half (captions 18-30 since the second take): beads, Mobile, rocket, the bridge, and the five blocks. h_bag / h_songs are no longer used. */
import React from 'react';
import { useCurrentFrame, interpolate, Easing, springPop } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { Drop, talk, type ShotMap, type SP } from '@engine/kit';
import { Stage } from '@engine/moves';
import { Chibi } from '@engine/characters/Chibi';
import { PAPER, RED, GOLD, INK, Rider } from './Kit';
import { useBeat, HostS, Sign, DarkSign, Pop, Txt, Quiet } from './Kit2';
import { VaultOn, ReactionDrop, Twirl, Puller, pullerState } from './Moves';
import { AlMap, at, Pin, Beads, Suitcase, Vinyl, Note, Rocket, ArchBridge, Moon, FiveBlocks, ease } from './KitAL';

// c001-c002: the beads drop in; "not New Orleans".
const BeadsShot: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  return (
    <Stage>
      <Drop at={b.at(0, 'beads') - 6} x={1130} y={520} h={520}><Beads s={1.25} /></Drop>
      <Sign x={1130} y={250} k={b.pop(1, 'first')} text="AMERICA'S 1ST MARDI GRAS" size={34} />
      <Pop k={b.pop(1, 'orleans')} x={1130} y={760} rot={-4}>
        <rect x={-200} y={-46} width={400} height={92} rx={12} fill={PAPER} stroke={OL} strokeWidth={5} />
        <Txt y={16} t="NEW ORLEANS" size={44} c={INK} />
        <path d="M-180 30 L180 -30" stroke={RED} strokeWidth={10} strokeLinecap="round" />
      </Pop>
      {b.k === 0
        ? <HostS s={s} x={1580} keys={[{ at: 0, arm: 'point', expr: 'grin' }]} />
        : <ReactionDrop t={b.f - (b.at(1, 'wasnt') - 2)} X={1580} talking={talk(s)} after={[{ at: 0, arm: 'finger', expr: 'grin' }]} />}
    </Stage>
  );
};

// c003-c004: Mobile 1703 vs New Orleans 1718 on the Gulf coast.
const MobileShot: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const X = 980, Y = 360, H = 700;
  const mob = at(X, Y, H, 'Mobile');
  const nola = [mob[0] - 2.03 * (H / 25.5) * (1920 / 360), mob[1] + 0.74 * (H / 25.5) * (1920 / 360)] as [number, number];
  const party = b.at(0, 'partying');
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.06, focus: [mob[0], mob[1]] }}>
      <InsertBg />
      <Layer depth={1}>
        <AlMap x={X} y={Y} h={H} sea="#9EC5DB" />
        <Pin p={mob} t={b.at(0, 'mobile') - 4} label="MOBILE · 1703" c={GOLD} star dx={30} dy={-34} size={34} />
        <Pin p={nola} t={b.at(0, 'new')} label="NEW ORLEANS · 1718" c="#8A8272" dx={24} dy={58} size={28} />
        {b.f >= party && Array.from({ length: 16 }, (_, i) => {
          const t = b.f - party - (i % 5) * 3; if (t < 0) return null;
          const a = (i / 16) * Math.PI * 2, v = 6 + (i % 3) * 2;
          const x = mob[0] + Math.cos(a) * v * t * 0.9, y = mob[1] - 20 + -Math.abs(Math.sin(a)) * v * t + 0.5 * 0.5 * t * t;
          return <rect key={i} x={x} y={y} width={12} height={8} fill={['#7B3FA0', '#2E9D57', GOLD][i % 3]} stroke={OL} strokeWidth={1.5} transform={`rotate(${t * 12 + i * 40} ${x} ${y})`} opacity={Math.max(0, 1 - t / 50)} />;
        })}
        <DarkSign x={1540} y={300} k={b.pop(0, '15')} text="15 YEARS EARLIER" size={42} />
        <Sign x={1540} y={420} k={b.pop(1, 'existed')} text="NEW ORLEANS: NOT FOUNDED YET" size={26} bg={RED} c="#fff" rot={3} />
        <Rider x={1640} y={720} s={0.42} arm="point" expr="grin" talking={talk(s)} flip />
      </Layer>
    </CameraRig>
  );
};

// c005-c008: the lost suitcase ends up in one Alabama store.
const BagShot: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const { f, g } = b;
  const slide = interpolate(g, [10, 70], [-60, 0], Easing.out);
  const mapK = b.pop(3, 'alabama');
  return (
    <Stage>
      {/* baggage carousel */}
      <g transform="translate(1100 640)">
        <rect x={-260} y={0} width={520} height={60} rx={30} fill="#5A5F68" stroke={OL} strokeWidth={5} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={-230 + ((i * 44 + g * 2) % 480)} y1={8} x2={-230 + ((i * 44 + g * 2) % 480)} y2={52} stroke="#7A808A" strokeWidth={4} />)}
      </g>
      <Drop at={b.at(0, 'suitcase') - 8} x={1100 + slide} y={640} h={420}><Suitcase s={0.9} tag={b.on(1, 'claims') ? '???' : undefined} /></Drop>
      <Sign x={1100} y={240} k={b.pop(1, 'nobody') * (1 - mapK)} text="UNCLAIMED" size={44} bg={RED} c="#fff" rot={-3} />
      <Pop k={b.pop(2, 'sale')} x={1290} y={470} rot={10}>
        <path d="M-60 -34 h100 l30 34 l-30 34 h-100 Z" fill={GOLD} stroke={OL} strokeWidth={4} strokeLinejoin="round" />
        <circle cx={44} cy={0} r={7} fill={PAPER} stroke={OL} strokeWidth={3} />
        <Txt x={-10} y={12} t="SALE" size={30} />
      </Pop>
      <Sign x={900} y={360} k={b.pop(2, 'one') * (1 - mapK)} text="ONE STORE" size={34} />
      {mapK > 0 && <g transform={`translate(1110 360) scale(${mapK}) translate(-1110 -360)`}>
        <rect x={980} y={190} width={260} height={330} rx={14} fill={PAPER} stroke={OL} strokeWidth={5} />
        <AlMap x={1110} y={355} h={280} neighbours={false} />
        <Pin p={at(1110, 355, 280, 'Scottsboro')} t={b.at(3, 'alabama') + 6} label="SCOTTSBORO" dx={-20} dy={-28} size={20} />
      </g>}
      <HostS s={s} x={1600} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at: b.at(1, 'nobody'), arm: 'shrug', expr: 'worried' }, { at: b.at(3, 'alabama'), arm: 'point', expr: 'grin' }]} />
    </Stage>
  );
};

// c009-c012: the record spins; Muscle Shoals, 14,000 people.
const SongsShot: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const { f, g } = b;
  return (
    <Stage>
      <Pop k={b.pop(0, 'songs')} x={1110} y={480}><Vinyl rot={g * 6} label="45" /></Pop>
      {b.on(0, 'songs') && [0, 1, 2, 3].map((i) => { const t = (g + i * 22) % 88; return <g key={i} transform={`translate(${1000 + i * 70 + Math.sin(t / 8) * 20} ${360 - t * 2.6})`} opacity={Math.sin((t / 88) * Math.PI)}><Note s={0.8} /></g>; })}
      <Sign x={1110} y={760} k={b.pop(2, 'alabama')} text="MUSCLE SHOALS, ALABAMA" size={32} />
      <Pop k={b.pop(2, '14000')} x={1330} y={270} rot={10}>
        <circle r={86} fill={RED} stroke={OL} strokeWidth={5} />
        <Txt y={-10} t="POP." size={30} c="#fff" />
        <Txt y={34} t="14,000" size={40} c={GOLD} />
      </Pop>
      <Twirl t={b.g - 4} X={1610} talking={talk(s)} keys={[{ at: 0, arm: b.k >= 2 ? 'point' : 'present', expr: 'proud' }]} />
    </Stage>
  );
};

// c013-c015: the moon rocket rises; "designed in Alabama".
const RocketShot: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const { g } = b;
  const t = Math.max(0, g - 26); // ignition shortly after "rocket"
  const lift = 0.5 * 0.09 * t * t;           // constant acceleration
  const shake = t > 0 && t < 40 ? Math.sin(t * 2.3) * 3 : 0;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <rect width={1920} height={1080} fill="url(#skyNight)" />
        {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 197) % 1920} cy={(i * 131) % 700} r={1.5 + (i % 3)} fill="#fff" opacity={0.5 + 0.4 * Math.sin(g / 10 + i)} />)}
        <g transform={`translate(1500 200) scale(${1 + 0.15 * b.pop(1, 'moon')})`}><circle r={130} fill="url(#warmGlow)" opacity={0.5 * b.pop(1, 'moon')} /><Moon r={90} /></g>
        <rect y={960} width={1920} height={120} fill="#2A3038" />
        <g transform={`translate(${960 + shake} ${960 - lift})`}><Rocket s={0.95} flame={t > 0 ? Math.min(1, t / 8) : 0} /></g>
        {t > 0 && Array.from({ length: 10 }, (_, i) => { const q = (t * 1.5 + i * 13) % 120; return <circle key={i} cx={960 + (i % 2 ? 1 : -1) * (40 + q * 2.2)} cy={950 - q * 0.4} r={30 + q * 0.6} fill="#E8E2D4" opacity={Math.max(0, 0.7 - q / 140)} />; })}
        <Pop k={b.pop(2, 'designed')} x={520} y={460} rot={-6}>
          <rect x={-290} y={-70} width={580} height={140} rx={10} fill="#1F4E79" stroke="#BFE0F0" strokeWidth={5} />
          <path d="M-270 -50 h540 v100 h-540 Z" fill="none" stroke="#7FAFD6" strokeWidth={2} strokeDasharray="8 8" />
          <Txt y={-6} t="DESIGNED IN" size={34} c="#BFE0F0" />
          <Txt y={46} t="ALABAMA" size={56} c="#fff" />
        </Pop>
        <Rider x={300} y={300} s={0.42} arm="point" expr="grin" talking={talk(s)} />
      </svg>
    </>
  );
};

// c016-c018 (quiet): four years earlier, a bridge. Still frame, no narrator, no motion beyond the walkers.
const BridgeShot: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const { g } = b;
  const o = ease(g, 0, 36);
  return (
    <Quiet tone="#1B2028">
      <g opacity={o}>
        <rect y={800} width={1920} height={280} fill="#232B34" />
        <g transform="translate(960 800)"><ArchBridge s={1.05} /></g>
        {Array.from({ length: 10 }, (_, i) => { const x = 420 + (i >> 1) * 46 + g * 0.35; const y = 792 - (i % 2) * 6; return <g key={i} transform={`translate(${x} ${y})`}><circle cy={-44} r={9} fill="#6A7480" /><rect x={-8} y={-36} width={16} height={36} rx={5} fill="#6A7480" /></g>; })}
        <text x={960} y={240} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#8E98A4" opacity={ease(g, b.gAt(0, 'four') < 0 ? 0 : b.gAt(0, 'four'), 30)}>1965</text>
        <text x={960} y={1000} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#6E7884" opacity={ease(g, Math.max(0, b.gAt(2, 'bridge')), 30)}>SELMA, ALABAMA</text>
      </g>
    </Quiet>
  );
};

// c019: the rocket and the bridge, side by side. "Both?"
const BothShot: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  return (
    <Stage>
      <Pop k={b.pop(0, 'how')} x={1000} y={470} rot={-4}>
        <rect x={-130} y={-200} width={260} height={360} rx={14} fill="#26343A" stroke={OL} strokeWidth={5} />
        <g transform="translate(0 120)"><Rocket s={0.42} /></g>
        <Txt y={140} t="1969" size={34} c={GOLD} />
      </Pop>
      <Pop k={b.pop(0, 'state')} x={1300} y={470} rot={4}>
        <rect x={-130} y={-200} width={260} height={360} rx={14} fill="#1B2028" stroke={OL} strokeWidth={5} />
        <g transform="translate(0 60)"><ArchBridge s={0.24} /></g>
        <Txt y={140} t="1965" size={34} c="#8E98A4" />
      </Pop>
      <Sign x={1150} y={760} k={b.pop(0, 'both')} text="BOTH?" size={56} bg={GOLD} />
      <HostS s={s} x={1640} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at: b.at(0, 'both') - 4, arm: 'idle', expr: 'shock' }]} staffMode={b.f >= b.at(0, 'both') - 4 ? 'level' : undefined} />
    </Stage>
  );
};

// c020-c021: one street, five blocks long. The street map that returns through the film.
const StreetShot: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const pull = pullerState(b.g - 2, 1620, 794);
  const five = b.gAt(0, 'five');
  const count = five < -900 ? 5 : Math.max(0, Math.min(5, Math.floor((b.g - five) / 6) + 1));
  return (
    <Stage>
      <FiveBlocks x={1140} y={pull.bottom - 274} s={0.74} draw={1} count={b.g >= five ? count : 0} />
      <Sign x={1140} y={150} k={b.pop(1, 'long')} text="5 BLOCKS" size={34} bg={GOLD} />
      <Puller t={b.g - 2} X={1620} talking={talk(s)} keys={[{ at: 0, arm: 'point', expr: 'grin' }]} />
    </Stage>
  );
};

export const SHOTS_HOOK: ShotMap = {
  h_beads: BeadsShot, h_mobile: MobileShot, h_bag: BagShot, h_songs: SongsShot, h_rocket: RocketShot,
  h_bridge: BridgeShot, h_both: BothShot, h_street: StreetShot,
};
