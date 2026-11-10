/** Second hook (captions 1-17, new take of 10 Nov 2026): Sweet Home Alabama -> Florida band -> Neil Young -> a tiny town -> "already in your life". */
import React from 'react';
import { OL } from '@engine/scenes/Parts';
import { talk, type ShotMap, type SP } from '@engine/kit';
import { Stage } from '@engine/moves';
import { PAPER, RED, GOLD, INK } from './Kit';
import { useBeat, HostS, Txt, Jalopy } from './Kit2';
import { Beads, Vinyl, Note, Rocket } from './KitAL';
import { VaultOn, ReactionDrop, Laser } from './Moves';
import { hostScene, mapScene, Items, T, K, On, type B } from './Factory';

const Sleeve: React.FC<{ title: string; who: string; year: string; c: string; rot?: number }> = ({ title, who, year, c, rot = 0 }) => (
  <g transform={`rotate(${rot})`}>
    <circle cx={60} cy={0} r={118} fill="#1A1A1E" stroke={OL} strokeWidth={4} />
    <rect x={-130} y={-130} width={260} height={260} rx={8} fill={c} stroke={OL} strokeWidth={5} />
    <Txt y={-60} t={who} size={22} c="#fff" />
    <Txt y={6} t={title} size={30} c="#fff" />
    <Txt y={86} t={year} size={36} c={GOLD} />
  </g>
);
const Notes: React.FC<{ b: B; x: number; y: number }> = ({ b, x, y }) => (
  <>{[0, 1, 2].map((i) => { const t = (b.g + i * 22) % 66; return <g key={i} transform={`translate(${x + 30 + t * 2.4} ${y - 30 - t * 2})`} opacity={1 - t / 66}><Note s={0.7} /></g>; })}</>
);
const Rings: React.FC = () => (
  <g><circle cx={-26} cy={0} r={44} fill="none" stroke={GOLD} strokeWidth={13} /><circle cx={-26} cy={0} r={44} fill="none" stroke={OL} strokeWidth={2} />
    <circle cx={26} cy={0} r={44} fill="none" stroke="#E4E4E8" strokeWidth={13} /><circle cx={26} cy={0} r={44} fill="none" stroke={OL} strokeWidth={2} /></g>
);
const Football: React.FC = () => (
  <g><ellipse rx={78} ry={46} fill="#8A4A26" stroke={OL} strokeWidth={5} /><path d="M-30 0 H30" stroke="#fff" strokeWidth={5} />
    {[-18, -6, 6, 18].map((x) => <path key={x} d={`M${x} -9 V9`} stroke="#fff" strokeWidth={4} />)}</g>
);
const Card: React.FC<{ w?: number; h?: number; children: React.ReactNode; label?: string }> = ({ w = 220, h = 200, children, label }) => (
  <g><rect x={-w / 2} y={-h / 2} width={w} height={h} rx={16} fill={PAPER} stroke={OL} strokeWidth={5} />{children}{label && <Txt y={h / 2 - 18} t={label} size={24} c={INK} />}</g>
);

// c001: the record drops in and spins; the narrator vaults on.
const hTitle = hostScene({ items: [
  { at: [0], kind: 'art', x: 1110, y: 520, drop: true, el: (b) => <g><Vinyl s={1.15} rot={b.g * 5} label="AL" /><Notes b={b} x={60} y={-80} /></g> },
  { at: [0, 'sweet'], kind: 'gold', text: '"SWEET HOME ALABAMA"', x: 1110, y: 240, size: 40 },
], move: (b, s) => <VaultOn t={b.f - 2} to={1600} talking={talk(s)} keys={[{ at: 0, arm: 'point', expr: 'grin' }]} /> });

// c002-c004: a wedding, a ballgame, a long drive.
const hSong = hostScene({ items: [
  { at: [0], kind: 'art', x: 1110, y: 230, el: (b) => <g><Vinyl s={0.55} rot={b.g * 5} label="AL" /><Notes b={b} x={20} y={-20} /></g> },
  { at: [0, 'wedding'], kind: 'art', x: 1000, y: 470, el: () => <Card label="A WEDDING"><g transform="translate(0 -14)"><Rings /></g></Card> },
  { at: [0, 'ball'], kind: 'art', x: 1250, y: 470, el: () => <Card label="A BALLGAME"><g transform="translate(0 -14)"><Football /></g></Card> },
  { at: [1, 'drive'], kind: 'art', x: 1125, y: 730, el: (b) => <Card w={470} h={190} label="A LONG DRIVE"><Jalopy x={-60 + (b.g % 90) * 1.4} y={30} s={0.7} f={b.g} /></Card> },
], keys: (b) => [{ at: 0, arm: 'present', expr: 'smile' }, { at: Math.max(0, T(b, [1, 'drive'])), arm: 'point', expr: 'grin' }] });

// c005-c007: the band wasn't from Alabama -> FLORIDA?! (reaction drop: a busted myth)
const HFlorida: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const fl = T(b, [2, 'florida']);
  return (
    <Stage>
      <Items b={b} items={[
        { at: [0, 'band'], kind: 'dark', text: 'THE BAND: LYNYRD SKYNYRD', x: 1110, y: 240, size: 32 },
        { at: [1, 'alabama'], kind: 'sign', text: 'FROM ALABAMA?', x: 1110, y: 380, size: 36, hide: [2, 'jacksonville'] },
        { at: [2, 'jacksonville'], kind: 'big', text: 'JACKSONVILLE', sub: 'FLORIDA', x: 1110, y: 400, size: 40 },
        { at: [2, 'florida'], kind: 'stamp', text: 'FLORIDA?!', x: 1110, y: 640, size: 64 },
      ]} />
      {b.k < 2 || fl > 9e4
        ? <HostS s={s} x={1600} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at: Math.max(0, T(b, [1, 'alabama'])), arm: 'finger', expr: 'smile' }]} />
        : <ReactionDrop t={b.f - (fl < -900 ? -999 : fl - 2)} X={1600} talking={talk(s)} after={[{ at: 0, arm: 'shrug', expr: 'grin' }]} />}
    </Stage>
  );
};

// c008-c010: a comeback, aimed at Neil Young's two songs (sleeves only; no likeness of a real person).
const HReply: React.FC<SP> = ({ s }) => {
  const b = useBeat(s);
  const tgt = [{ x: 1020, y: 470, w: [1, 'two'] as [number, string] }, { x: 1240, y: 470, w: [1, 'songs'] as [number, string] }, { x: 1130, y: 760, w: [2, 'racism'] as [number, string] }];
  return (
    <Stage>
      <Items b={b} items={[
        { at: [0, 'comeback'], kind: 'gold', text: 'SWEET HOME ALABAMA (1974) = A REPLY', x: 1130, y: 230, size: 28 },
        { at: [1, 'two'], kind: 'art', x: 1020, y: 470, el: () => <g transform="scale(0.72)"><Sleeve who="NEIL YOUNG" title="SOUTHERN MAN" year="1970" c="#4A5A6A" rot={-4} /></g> },
        { at: [1, 'songs'], kind: 'art', x: 1240, y: 470, el: () => <g transform="scale(0.72)"><Sleeve who="NEIL YOUNG" title="ALABAMA" year="1972" c="#6A4A3A" rot={4} /></g> },
        { at: [2, 'calling'], kind: 'red', text: "CALLING OUT THE SOUTH'S RACISM", x: 1130, y: 760, size: 28 },
      ]} />
      <Laser f={b.f} X={1620} talking={talk(s)} keys={[{ at: 0, arm: 'present', expr: 'grin' }]} targets={tgt.map((t) => ({ x: t.x, y: t.y, at: T(b, t.w) }))} />
    </Stage>
  );
};

// c011-c014: the shout-out to a few session musicians in a tiny town (named later, in the Moon era).
const hTown = mapScene({ al: { x: 860, y: 600, h: 760, fill: '#E9D9B0' }, rider: { x: 1640, y: 640 },
  pins: [{ at: [2, 'tiny'], place: 'Muscle Shoals', label: 'A TINY TOWN', star: true, c: GOLD, dx: 30, dy: 44, size: 32 }],
  tags: [{ at: [0, 'middle'], text: 'THE SONG GIVES A SHOUT-OUT…', x: 1450, y: 230, size: 30 }, { at: [1, 'session'], text: '…TO SESSION MUSICIANS', x: 1450, y: 300, bg: '#2E4A9A', size: 30 }, { at: [3, '16000'], text: 'POP. ~16,000', x: 1450, y: 370, bg: RED, size: 34 }],
  extra: (b, pt) => { if (!On(b, [2, 'tiny'])) return null; const p = pt([-87.67, 34.74]); return <Notes b={b} x={p[0]} y={p[1]} />; } });

// c015-c017: "already in your life": the three things about to come, as face-down cards.
const hLife = hostScene({ items: [
  { at: [0, 'alabama'], kind: 'big', text: 'ALABAMA', x: 1110, y: 250, size: 52 },
  { at: [1, 'life'], kind: 'gold', text: 'IS ALREADY IN YOUR LIFE', x: 1110, y: 390, size: 34 },
  { at: [2, 'never'], kind: 'art', x: 980, y: 620, el: () => <Card w={170} h={190}><g transform="translate(0 -6)"><Beads s={0.55} /></g></Card> },
  { at: [2, 'noticed'], kind: 'art', x: 1170, y: 620, el: (b) => <Card w={170} h={190}><g transform="translate(0 -6)"><Vinyl s={0.45} rot={b.g * 5} label="AL" /></g></Card> },
  { at: [2, 'noticed'], kind: 'art', x: 1360, y: 620, el: () => <Card w={170} h={190}><g transform="translate(0 80) scale(0.28)"><Rocket /></g></Card> },
], keys: (b) => [{ at: 0, arm: 'present', expr: 'smile' }, { at: Math.max(0, T(b, [1, 'life'])), arm: 'finger', expr: 'grin' }, { at: Math.max(0, T(b, [2, 'never'])), arm: 'shrug', expr: 'grin' }] });

export const SHOTS_HOOK2: ShotMap = { h_title: hTitle, h_song: hSong, h_florida: HFlorida, h_reply: HReply, h_town: hTown, h_life: hLife };
