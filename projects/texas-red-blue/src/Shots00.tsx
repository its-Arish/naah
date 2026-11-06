/** Cold open: the Dial flips, Texas has done this before, the Switchers. */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop } from '@engine/lib/core';
import { wordAt, type ShotMap } from '@engine/kit';
import { Label } from '@engine/fx/Overlays';
import { OL } from '@engine/scenes/Parts';
import { P } from '@engine/qgis/QgisMap';
import { TxMap, MapNarr, camAt, moveCam, Stage, Insert, Narr, Dial, Lever, Banner, Switcher, TexasShape, txH, Tag, RED, BLUE, GOLD, INK, PAPER, type SP } from './Kit';

const DX = 1060, DY = 360; // Dial on the stage wall (prop zone between text and narrator)

const DialWall: React.FC<{ v: number; crack?: number; banner?: string; bcrack?: number; lever?: number; bannerY?: number }> = ({ v, crack = 0, banner = RED, bcrack = 0, lever, bannerY = 130 }) => (
  <>
    <Banner x={DX} y={bannerY} s={0.5} color={banner} crack={bcrack} />
    <Dial x={DX} y={DY} s={0.78} v={v} crack={crack} />
    {lever !== undefined && <Lever x={DX + 190} y={DY + 150} pull={lever} />}
  </>
);

const coDial: React.FC<SP> = ({ s }) => {
  const at = wordAt(s, 'Republican');
  return <Stage><DialWall v={-0.8} /><Narr s={s} keys={[{ at: 0, arm: 'idle', expr: 'smile' }, { at, arm: 'present', expr: 'proud' }]} point={[{ x: 1090, y: 380, at: at }]} /></Stage>;
};

const coFlip: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'not');
  const pull = interpolate(f, [at - 6, at + 2], [0, 1], Easing.in);
  const v = interpolate(f, [at, at + 14], [-0.8, 0.85], Easing.out) + (f > at + 14 ? Math.sin((f - at) / 2) * Math.exp(-(f - at - 14) / 8) * 0.08 : 0);
  return (
    <Stage shakes={[{ at, amp: 8, len: 10 }]}>
      <DialWall v={v} lever={pull} bcrack={interpolate(f, [at, at + 6], [0, 1])} />
      <Narr s={s} keys={[{ at: 0, arm: 'point', expr: 'smile' }, { at, arm: 'fist', expr: 'shock' }, { at: at + 18, arm: 'shrug', expr: 'grin' }]} point={[{ x: 1090, y: 380, at: at - 2 }]} />
    </Stage>
  );
};

/** Election result cards over a blue-filling Texas. */
const Results: React.FC<{ s: SP['s']; second?: boolean }> = ({ s, second }) => {
  const f = useCurrentFrame();
  const tw = 560, th = txH(tw);
  const fillUp = second ? 1 : interpolate(f, [4, 40], [0, 1], Easing.inOut);
  const a1 = second ? -99 : wordAt(s, 'senator');
  const a2 = second ? wordAt(s, 'governor') : 9999;
  const y88 = second ? wordAt(s, '1988') : 9999, y90 = second ? wordAt(s, '1990') : 9999;
  const Card = ({ x, title, k, yr, yk }: { x: number; title: string; k: number; yr: string; yk: number }) => k > 0 ? (
    <g transform={`translate(${x} 380) scale(${k})`}>
      <rect x={-210} y={-150} width={420} height={330} rx={22} fill={PAPER} stroke={OL} strokeWidth={6} />
      <text y={-88} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill={INK}>{title}</text>
      <circle cy={10} r={70} fill={BLUE} stroke={OL} strokeWidth={6} />
      <text y={36} textAnchor="middle" fontFamily="TagBold" fontSize={78} fill="#fff">D</text>
      {yk > 0 && <g transform={`translate(0 130) scale(${yk})`}><rect x={-170} y={-32} width={340} height={58} rx={12} fill={GOLD} stroke={OL} strokeWidth={4} /><text y={10} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill={INK}>{`FIRST SINCE ${yr}`}</text></g>}
    </g>
  ) : null;
  // GIS map: camera flies in from the whole US to Texas, then Texas fills blue west to east
  const cam = moveCam(f, camAt(-97, 37, 4.2), camAt(-99.6, 31.6, 9.5), second ? -99 : 0, second ? -60 : 36);
  const [wx0] = P(-107, 30), [wx1] = P(-93, 30);
  const sweep = wx0 + (wx1 - wx0) * fillUp;
  return (
    <>
      <TxMap cam={cam} clip={<rect x={wx0 - 5} y={0} width={sweep - wx0 + 5} height={960} fill={BLUE} opacity={0.9} />} overlay={<>
        <Card x={330} title="U.S. SENATE" k={second ? 1 : springPop(f, a1)} yr="1988" yk={springPop(f, y88)} />
        <Card x={1590} title="GOVERNOR" k={springPop(f, a2)} yr="1990" yk={springPop(f, y90)} />
      </>} />
      <MapNarr s={s} x={1720} y={830} scale={0.42} keys={[{ at: 0, arm: 'point', expr: second ? 'grin' : 'shock' }]} point={[{ x: 330, y: 380, at: second ? 6 : wordAt(s, 'senator') + 4 }, ...(second ? [{ x: 1590, y: 380, at: wordAt(s, 'governor') + 4 }] : [])]} />
      <Label text="3 November 2026" x={960} y={110} at={second ? -99 : 6} size={56} color={GOLD} />
    </>
  );
};
const coResults: React.FC<SP> = ({ s }) => <Results s={s} />;
const coResults2: React.FC<SP> = ({ s }) => <Results s={s} second />;

const coEasy: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const butAt = wordAt(s, 'but');
  const inX = interpolate(f, [4, 16], [1300, 0], Easing.out);
  const outX = interpolate(f, [butAt, butAt + 10], [0, -1400], Easing.in);
  return (
    <Stage>
      <DialWall v={0.85} bcrack={1} />
      <g transform={`translate(${inX + outX} 0)`}>
        <rect x={880} y={560} width={560} height={92} fill={RED} stroke={OL} strokeWidth={5} />
        <rect x={880} y={652} width={560} height={50} fill="#1E2A33" stroke={OL} strokeWidth={5} />
        <text x={1160} y={622} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff">THE EASY EXPLANATION</text>
        <text x={1160} y={688} textAnchor="middle" fontFamily="Tag" fontSize={28} fill="#fff">you've heard it already</text>
      </g>
      <Narr s={s} keys={[{ at: 0, arm: 'idle', expr: 'smile' }, { at: butAt - 4, arm: 'point', expr: 'grin' }, { at: butAt + 14, arm: 'finger', expr: 'smile' }]} point={[{ x: 1100, y: 420, at: 14 }]} />
    </Stage>
  );
};

const coBefore: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'before');
  const yr = Math.round(interpolate(f, [at, at + 24], [2026, 1874], Easing.inOut));
  const v = interpolate(f, [at, at + 24], [0.85, 0.85], Easing.inOut);
  return (
    <Stage>
      <DialWall v={v} banner={f > at + 12 ? BLUE : RED} bcrack={f > at + 12 ? 0 : 1} />
      <g transform="translate(1060 640)">
        <rect x={-150} y={-60} width={300} height={110} rx={16} fill={PAPER} stroke={OL} strokeWidth={6} />
        <text y={26} textAnchor="middle" fontFamily="TagBold" fontSize={80} fill={f > at ? RED : INK}>{yr}</text>
      </g>
      <Narr s={s} keys={[{ at: 0, arm: 'finger', expr: 'smile' }, { at, arm: 'present', expr: 'proud' }]} point={[{ x: 1090, y: 380, at: at }]} />
    </Stage>
  );
};

/** Timeline of the two one-party eras. */
const Eras: React.FC<{ s: SP['s']; part: 1 | 2 }> = ({ s, part }) => {
  const f = useCurrentFrame();
  const X = (y: number) => 220 + ((y - 1860) / (2030 - 1860)) * 1480;
  const blue = part === 1 ? interpolate(f, [6, 50], [0, 1], Easing.inOut) : 1;
  const red = part === 2 ? interpolate(f, [6, 40], [0, 1], Easing.inOut) : 0;
  return (
    <Insert>
      <>
        <line x1={200} y1={520} x2={1720} y2={520} stroke="#fff" strokeWidth={6} />
        {[1874, 1900, 1950, 1978, 1994, 2026].map((y) => <g key={y}><line x1={X(y)} y1={500} x2={X(y)} y2={540} stroke="#fff" strokeWidth={4} /><text x={X(y)} y={590} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#fff">{y}</text></g>)}
        <rect x={X(1874)} y={420} width={(X(1978) - X(1874)) * blue} height={80} rx={10} fill={BLUE} stroke={OL} strokeWidth={4} />
        {red > 0 && <rect x={X(1994)} y={420} width={(X(2026) - X(1994)) * red} height={80} rx={10} fill={RED} stroke={OL} strokeWidth={4} />}
        <Tag x={(X(1874) + X(1978)) / 2} y={340} text="ONE-PARTY DEMOCRATIC · ~100 YEARS" size={36} k={springPop(f, 30)} bg="#DCE7F5" />
        {part === 2 && <Tag x={(X(1994) + X(2026)) / 2 - 80} y={700} text="ONE-PARTY REPUBLICAN · ~30 YEARS" size={36} k={springPop(f, 24)} bg="#F6D9D6" />}
      </>
      <Narr s={s} x={700} y={850} scale={0.45} flip keys={[{ at: 0, arm: 'point', expr: 'smile' }]} />
    </Insert>
  );
};
const coEras: React.FC<SP> = ({ s }) => <Eras s={s} part={1} />;
const coEras2: React.FC<SP> = ({ s }) => <Eras s={s} part={2} />;

const TwoBanners: React.FC<{ crack: number; zzz?: number }> = ({ crack, zzz = 0 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Banner x={1000} y={300} s={0.42} color={BLUE} crack={crack} />
      <Banner x={1000} y={520} s={0.42} color={RED} crack={crack} />
      {zzz > 0 && [0, 1, 2].map((i) => { const t = (f + i * 12) % 36; return <text key={i} x={1150 + t * 1.5} y={260 - t * 3} fontFamily="TagBold" fontSize={34 + i * 6} fill={INK} opacity={zzz * (1 - t / 36)}>z</text>; })}
    </>
  );
};
const coSame: React.FC<SP> = ({ s }) => <Stage><TwoBanners crack={0} /><Narr s={s} keys={[{ at: 0, arm: 'present', expr: 'smile' }]} point={[{ x: 1050, y: 300, at: 14 }]} /></Stage>;
const coComfy: React.FC<SP> = ({ s }) => {
  const at = wordAt(s, 'lose');
  return <Stage><TwoBanners crack={0} zzz={1} /><Narr s={s} keys={[{ at: 0, arm: 'chin', expr: 'smile' }, { at, arm: 'shrug', expr: 'worried' }]} point={[{ x: 1050, y: 330, at: at }]} /></Stage>;
};
const coWalk: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const dur = useDuration();
  const x = interpolate(f, [0, dur * 0.55, dur * 0.7, dur], [700, 1060, 1060, 1300]);
  const walking = f < dur * 0.55 || f > dur * 0.7;
  return (
    <Stage>
      <TwoBanners crack={interpolate(f, [wordAt(s, 'walked'), wordAt(s, 'walked') + 6], [0, 1])} />
      <Switcher x={x} y={980} s={0.7} walk={walking} rosette={f > dur * 0.62 ? RED : BLUE} />
      <Narr s={s} keys={[{ at: 0, arm: 'point', expr: 'smile' }]} x={1560} />
    </Stage>
  );
};

const co190: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const yr = Math.round(interpolate(f, [4, 60], [1836, 2026], Easing.inOut));
  return (
    <Insert>
      <>
        {[...Array(9)].map((_, i) => { const k = springPop(f, 4 + i * 5); return k > 0 ? <g key={i} transform={`translate(${520 + (i % 3) * 30 + i * 10} ${560 - i * 26}) rotate(${(i % 2 ? 1 : -1) * (4 + i)}) scale(${k})`}><rect x={-220} y={-130} width={440} height={260} rx={10} fill={PAPER} stroke={OL} strokeWidth={4} />{[0, 1, 2, 3, 4].map((r) => <line key={r} x1={-180} y1={-80 + r * 40} x2={150 - (r % 2) * 80} y2={-80 + r * 40} stroke="#9B8B70" strokeWidth={6} />)}</g> : null; })}
        <text x={1320} y={470} textAnchor="middle" fontFamily="TagBold" fontSize={150} fill={GOLD} stroke={OL} strokeWidth={4}>{yr}</text>
        <Tag x={1320} y={620} text="190 YEARS OF RESULTS" size={44} k={springPop(f, 30)} />
      </>
      <Narr s={s} x={1780} y={840} scale={0.45} keys={[{ at: 0, arm: 'present', expr: 'proud' }]} point={[{ x: 1500, y: 360, at: 16 }]} />
    </Insert>
  );
};

const coStory: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const dur = useDuration();
  const tipAt = wordAt(s, 'most');
  const env = interpolate(f, [dur - 18, dur - 4], [-400, 0], Easing.in);
  return (
    <Stage>
      <Switcher x={1080} y={980} s={0.72} arms={f > tipAt ? 'tip' : 'down'} rosette={BLUE} />
      <Tag x={1080} y={430} text="THE SWITCHERS" size={44} k={springPop(f, wordAt(s, 'flip'))} rot={-4} />
      <g transform={`translate(1780 ${180 + env}) rotate(-8)`}><rect x={-80} y={-50} width={160} height={100} rx={8} fill="#F1DFB4" stroke={OL} strokeWidth={5} /><path d="M-80 -50 L0 10 L80 -50" stroke={OL} strokeWidth={5} fill="none" /><circle cy={10} r={14} fill={RED} stroke={OL} strokeWidth={3} /></g>
      <Narr s={s} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at: tipAt, arm: 'finger', expr: 'grin' }]} x={1560} />
    </Stage>
  );
};

export const SHOTS_00: ShotMap = {
  co_dial: coDial, co_flip: coFlip, co_results: coResults, co_results2: coResults2, co_easy: coEasy, co_before: coBefore,
  co_eras: coEras, co_eras2: coEras2, co_same: coSame, co_comfy: coComfy, co_walk: coWalk, co_190: co190, co_story: coStory,
};
