/** Today (12:11 to 13:50): one in nine Americans, the bill, the fires (quiet), the AI rush, and who actually got rich. */
import React from 'react';
import { interpolate, Easing, springPop } from '@engine/lib/core';
import { Chibi } from '@engine/characters/Chibi';
import { OL, Flame } from '@engine/scenes/Parts';
import { talk, type ShotMap, type SP } from '@engine/kit';
import { Stage } from '@engine/moves';
import { Full, MapTag, Globe } from '@engine/qgis/QgisMap';
import { D, PAPER, RED, GOLD, Rider, CaShape, Board, Jeans } from './Kit';
import { Tag, useBeat, Pop, Txt, Sign, DarkSign, HostS, Quiet, fade, Person, Chip, Shovel, Pick, Pan, Nugget, Bear, Sparkle } from './Kit2';

const SERIF = "Georgia, 'Times New Roman', serif";

// c245-c246: add up the rushes: about one in every nine Americans lives in California.
const Nine: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <Stage>
      <Pop k={springPop(B.g, 6)} x={1120} y={330}><CaShape x={0} y={0} h={230} fill={GOLD} sw={4} /></Pop>
      {[...Array(9)].map((_, i) => { const k = Math.max(0, springPop(B.f, B.at(1, 'one') + i * 3)); return k > 0 ? <g key={i} transform={`translate(${900 + i * 56} 660) scale(${k})`}><Person x={0} y={0} s={1.2} c={i === 4 && B.on(1, 'nine') ? GOLD : '#F4ECD8'} /></g> : null; })}
      <DarkSign x={1124} y={790} k={B.pop(1, 'nine')} text="1 IN 9 AMERICANS" size={42} />
      <HostS s={s} x={1700} keys={[{ at: 0, arm: 'present', expr: 'smile' }]} />
    </Stage>
  );
};

// c247-c249: the bill has arrived: homes about twice the national average; more people on the street than any other state.
const Bill: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const lines = [{ at: B.at(1, 'twice'), t: 'A TYPICAL HOME', v: '2× U.S. AVERAGE' }, { at: B.at(2, 'street'), t: 'PEOPLE WITHOUT A HOME', v: 'MOST OF ANY STATE' }];
  const n = lines.filter((l) => B.f >= l.at).length;
  const h = 150 + n * 130;
  return (
    <Stage>
      <g transform="translate(1110 250)">
        <rect x={-150} y={-50} width={300} height={60} rx={10} fill="#3A3A44" stroke={OL} strokeWidth={5} />
        <path d={`M-200 0 H200 V${h} l-25 -14 l-25 14 l-25 -14 l-25 14 l-25 -14 l-25 14 l-25 -14 l-25 14 l-25 -14 l-25 14 l-25 -14 l-25 14 l-25 -14 l-25 14 l-25 -14 l-25 14 Z`} fill="#FBF7EA" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
        <Txt y={70} t="THE BILL" size={46} c={RED} /><path d="M-160 96 H160" stroke={OL} strokeWidth={3} strokeDasharray="8 8" />
        {lines.map((l, i) => (B.f >= l.at ? <g key={i} opacity={interpolate(B.f, [l.at, l.at + 10], [0, 1])}><Txt y={150 + i * 130} t={l.t} size={24} c="#5A4A3A" /><Txt y={196 + i * 130} t={l.v} size={32} /></g> : null))}
      </g>
      <HostS s={s} x={1700} keys={[{ at: 0, arm: B.k === 0 ? 'present' : 'idle', expr: 'worried' }]} />
    </Stage>
  );
};

// c250-c254 (quiet): the fires. Paradise, 2018. Los Angeles, January 2025. Then the small, careful fires return.
const QuietFire: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const o = (k: number, at = 4) => (B.k < k ? 0 : B.k > k ? 1 : fade(B.f, at, 30));
  const calm = B.k < 3 ? 0 : B.k > 3 ? 1 : fade(B.f, 6, 50);
  return (
    <Quiet tone="#22140F">
      <rect width={1920} height={1080} fill="#C8552B" opacity={0.3 * (1 - calm)} />
      <rect width={1920} height={1080} fill="#1E2A22" opacity={0.55 * calm} />
      <path d="M0 800 Q260 620 560 760 T1140 720 T1920 780 V1080 H0 Z" fill="#120C0A" />
      <g opacity={1 - calm}>
        <text x={150} y={300} fontFamily={SERIF} fontSize={84} fill="#E8E2D4" opacity={o(1)}>Paradise, 2018</text>
        <text x={150} y={450} fontFamily={SERIF} fontSize={84} fill="#E8E2D4" opacity={o(2)}>Los Angeles, January 2025</text>
        <text x={150} y={520} fontFamily={SERIF} fontSize={40} fill="#C9B8A4" opacity={o(2, 40)}>more than 16,000 buildings</text>
      </g>
      <g opacity={calm}>
        {[380, 760, 1140, 1520].map((x, i) => <g key={x}><path d={`M${x} 800 V640`} stroke="#0E1410" strokeWidth={18} /><ellipse cx={x} cy={590} rx={120} ry={90} fill="#0E1410" /><g transform={`translate(${x + 140} 800)`}><Flame x={0} y={0} s={0.45} seed={'qf' + i} /></g></g>)}
        <text x={960} y={300} textAnchor="middle" fontFamily={SERIF} fontSize={60} fill="#E8E2D4" opacity={o(4)}>Small, careful fires, returning</text>
      </g>
    </Quiet>
  );
};

// c255-c257: a new rush: artificial intelligence. The world is running to San Francisco again.
const CITIES: [number, number][] = [[-74, 40.7], [-0.1, 51.5], [2.35, 48.86], [77.6, 12.97], [116.4, 39.9], [139.7, 35.7], [151.2, -33.9], [-46.6, -23.5], [103.8, 1.35], [13.4, 52.5]];
const AiRush: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const lam = interpolate(B.g, [0, B.gd * 0.8], [20, -122.4], Easing.inOut);
  const done = B.g >= B.gd * 0.8;
  return (
    <>
      <Globe data={D} lam0={lam} phi0={30} R={390} cx={1120} cy={540} points={[...CITIES.map((ll) => ({ ll, color: '#7FB7E8' })), { ll: [-122.4, 37.8] as [number, number], color: RED }]} />
      <Full>
        {done && <g transform="translate(1120 487)"><circle r={20 + (B.g % 30) * 1.6} fill="none" stroke={GOLD} strokeWidth={6} opacity={1 - (B.g % 30) / 30} /></g>}
        <Tag x={60} y={210} anchor="start" text="A NEW RUSH" k={B.pop(0, 'rush')} size={44} bg={RED} />
        <Tag x={60} y={300} anchor="start" text="ARTIFICIAL INTELLIGENCE" k={B.pop(1, 'Artificial')} size={36} />
        <Tag x={60} y={384} anchor="start" text="SAN FRANCISCO, AGAIN" k={B.pop(2, 'San')} size={32} bg={PAPER} c="#1A1410" />
        <Rider x={1700} y={300} arm="point" expr="grin" talking={talk(s)} flip />
      </Full>
    </>
  );
};

// c258-c265: the question from the start. Who actually gets rich in California? The board fills in.
const Final: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <Stage>
      <Board x={1175} y={170} w={460} at={B.at(1, 'Who')} rows={[
        { label: 'THE FINDER', show: B.at(2, 2), mark: B.at(2, 'gold') },
        { label: 'THE LANDOWNER', show: B.at(3, 2), mark: B.at(3, 'land') },
        { label: 'BRANNAN · 1st MILLIONAIRE', show: B.at(4, 'Brannan'), mark: B.at(5, 'lost') },
        { label: 'RAILROAD · 4 SHOPKEEPERS', show: B.at(6, 'railroad'), mark: B.at(6, 'shopkeepers'), ok: true },
        { label: 'WATER · THE LAND BUYERS', show: B.at(7, 'water'), mark: B.at(7, 'land'), ok: true },
      ]} />
      {B.k === 0 && <Sign x={1120} y={460} k={B.pop(0, 'question')} text="THE QUESTION FROM THE START" size={32} rot={-3} />}
      <HostS s={s} x={1760} keys={[{ at: 0, arm: B.k === 0 ? 'finger' : B.k === 5 ? 'shrug' : 'present', expr: B.k >= 6 ? 'grin' : 'smile' }]} />
    </Stage>
  );
};

// c266-c272: one more shopkeeper, San Francisco 1853. He never dug; he sold cloth; in 1873, riveted work pants. Levi Strauss.
const Levi: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const named = B.on(6, 'Levi');
  return (
    <Stage>
      <Chibi x={980} y={940} s={1.15} outfit={{ top: '#2B2B33', bottom: '#2B2B33', trim: '#F4ECD8' }} hat="tophat" beard pose={B.k >= 4 ? 'present' : 'idle'} expr="happy" talking={[]} seed="ls" />
      <DarkSign x={990} y={270} k={B.k >= 6 ? 0 : B.pop(1, '1853')} text="SAN FRANCISCO · 1853" size={30} />
      {B.k >= 2 && B.k < 5 && <Pop k={B.pop(2, 'dug')} x={1290} y={420}><Pick s={0.9} /><path d="M-70 -70 L70 70 M70 -70 L-70 70" stroke="#E4573D" strokeWidth={12} strokeLinecap="round" /></Pop>}
      {B.k === 4 && [0, 1, 2].map((i) => <Pop key={i} k={Math.max(0, springPop(B.f, B.at(4, 'cloth') + i * 4))} x={1220 + i * 80} y={760}><rect x={-30} y={-90} width={60} height={180} rx={26} fill={['#3F6FB5', '#C9A66B', '#8A3A4A'][i]} stroke={OL} strokeWidth={5} /><ellipse cy={-90} rx={30} ry={12} fill="#F4ECD8" stroke={OL} strokeWidth={4} /></Pop>)}
      {B.k >= 5 && <Pop k={B.pop(5, 'rivets')} x={1330} y={560}><g transform="scale(2.6)"><Jeans /></g>{[[-72, -80], [-20, -80], [20, -80], [72, -80]].map(([x, y], i) => <Sparkle key={i} x={x} y={y} f={B.f + i * 5} r={20} c={GOLD} />)}</Pop>}
      {B.k === 5 && <Sign x={1330} y={860} k={B.pop(5, '1873')} text="1873 · RIVETED WORK PANTS" size={26} />}
      {named && <g><Sign x={1040} y={270} k={B.pop(6, 'Levi')} text="LEVI STRAUSS" size={52} bg={GOLD} /><Pop k={Math.max(0, springPop(B.f, B.at(6, 'Levi') + 8))} x={1330} y={860}><circle r={40} fill="#2F7D4F" stroke={OL} strokeWidth={5} /><path d="M-18 0 L-4 16 L20 -16" stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" /></Pop></g>}
      <HostS s={s} x={1720} keys={[{ at: 0, arm: B.k === 0 ? 'finger' : B.k >= 5 ? 'point' : 'present', expr: B.k >= 5 ? 'grin' : 'smile' }]} />
    </Stage>
  );
};

// c273-c275: in today's rush, a company in Santa Clara sells the chips. The shovels.
const Chips: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <Stage>
      {[0, 1, 2].map((i) => <Pop key={i} k={Math.max(0, springPop(B.f, B.at(0, 'digging') + i * 4))} x={940 + i * 70} y={820} rot={-20 + i * 20}><Pick s={0.45} /></Pop>)}
      <Sign x={1010} y={920} k={B.pop(0, 'digging')} text="everyone else digs for A.I. gold" size={22} />
      <Pop k={B.pop(1, 'chips')} x={1060} y={450}><Chip s={1.35} /></Pop>
      <DarkSign x={1150} y={250} k={B.pop(1, 'Santa')} text="SANTA CLARA" sub="sells the chips" size={38} />
      <Pop k={B.pop(2, 'shovels')} x={1220} y={450}><Txt y={26} t="=" size={90} /></Pop>
      <Pop k={B.pop(2, 'shovels')} x={1370} y={450} rot={10}><Shovel s={1.4} c={GOLD} /></Pop>
      <HostS s={s} x={1720} keys={[{ at: 0, arm: B.k === 2 ? 'finger' : 'present', expr: B.k === 2 ? 'grin' : 'smile' }]} />
    </Stage>
  );
};

// c276-c278: the gold ran out, the grizzly is gone, the island never existed.
const Gone: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const card = (i: number, w: string, label: string, el: React.ReactNode) => (
    <Pop k={B.pop(i, 0)} x={970 + i * 210} y={500}>
      <rect x={-92} y={-120} width={184} height={250} rx={14} fill={PAPER} stroke={OL} strokeWidth={5} />
      <g transform="translate(0 -20)">{el}</g>
      <Txt y={104} t={label} size={22} />
      {B.on(i, w) && <path d="M-70 -100 L70 80 M70 -100 L-70 80" stroke="#E4573D" strokeWidth={10} strokeLinecap="round" opacity={0.9} transform={`scale(${Math.min(1, Math.max(0, springPop(B.f, B.at(i, w))))})`} />}
    </Pop>
  );
  return (
    <Stage>
      {card(0, 'out', 'THE GOLD', <Pan s={0.85} />)}
      {card(1, 'gone', 'THE GRIZZLY', <Bear s={0.62} />)}
      {card(2, 'never', 'THE ISLAND', <path d="M-40 -50 Q10 -70 30 -30 Q60 10 30 50 Q-10 70 -30 30 Q-60 0 -40 -50 Z" fill="#F3B562" stroke={OL} strokeWidth={4} />)}
      <HostS s={s} x={1740} keys={[{ at: 0, arm: 'idle', expr: 'worried' }]} />
    </Stage>
  );
};

// c279-c280: but look down. The jeans are still here.
const JeansEnd: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const k = B.pop(1, 'jeans');
  return (
    <Stage>
      <Pop k={springPop(B.g, 4)} x={1100} y={330}><Txt t="↓" size={150} c={RED} /></Pop>
      <Pop k={k} x={1100} y={640}><g transform="scale(3)"><Jeans /></g>{[[-84, -92], [-24, -92], [24, -92], [84, -92]].map(([x, y], i) => <Sparkle key={i} x={x} y={y} f={B.f + i * 5} r={22} c={GOLD} />)}</Pop>
      <DarkSign x={1100} y={900} k={Math.max(0, springPop(B.f, B.at(1, 'still')))} text="STILL HERE" size={46} />
      <HostS s={s} x={1700} keys={[{ at: 0, arm: 'point', expr: 'grin' }]} />
    </Stage>
  );
};

// c281-c283: that is the entire history of California. Everybody comes for the gold; the smart ones sell the shovels.
const End: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <Stage>
      <Pop k={springPop(B.g, 4)} x={1190} y={520}><CaShape x={0} y={0} h={440} fill={GOLD} /></Pop>
      <Pop k={B.pop(1, 'gold')} x={1010} y={780}><Nugget s={1.3} /><Sparkle x={40} y={-46} f={B.g} r={24} /></Pop>
      <Pop k={B.pop(2, 'shovels')} x={1390} y={720} rot={12}><Shovel s={1.5} c="#C9D2D8" /></Pop>
      <DarkSign x={1190} y={920} k={B.pop(2, 'shovels')} text="THE SMART ONES SELL THE SHOVELS" size={32} />
      <HostS s={s} x={1720} keys={[{ at: 0, arm: B.k === 2 ? 'wave' : 'present', expr: 'grin' }]} />
    </Stage>
  );
};

export const SHOTS_TODAY: ShotMap = { td_nine: Nine, td_bill: Bill, td_fire: QuietFire, td_ai: AiRush, td_board: Final, td_levi: Levi, td_chips: Chips, td_gone: Gone, td_jeans: JeansEnd, td_end: End };
