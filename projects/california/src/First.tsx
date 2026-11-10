/** First Californians (0:49 to 1:30). */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Host, reach } from '@engine/characters/Host';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL, Hills, Cloud, Tree, Pine, Flame } from '@engine/scenes/Parts';
import { talk, wordAt, type ShotMap, type SP } from '@engine/kit';
import { Staff, Stage } from '@engine/moves';
import { MapTag, SHADES } from '@engine/qgis/QgisMap';
import { PAPER, RED, GOLD, INK, SEA, useGroup, gw, gf, Rider, Card, CaShape, caTransform, CA_D, Galleon } from './Kit';

const Y = 960;
const Sky: React.FC<{ id?: string }> = ({ id = 'skyDay' }) => <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={`url(#${id})`} /></Layer>;
const PERSON = (i: number) => ({ outfit: { top: ['#B98A5A', '#A8744A', '#C49A6C'][i % 3], bottom: '#7A5234', belt: '#5A3A22' }, hat: 'none', hair: '#1A1410', skin: '#B5794F' });

// c013: back thirteen thousand years. Walking-cane lean.
const Cane: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const X = 1480, sx = X - 95, gy1 = 640, gy2 = 690;
  const lean = interpolate(f, [0, 14], [0, -7], Easing.out) + Math.sin(f / 20) * 0.6;
  const yrs = wordAt(s, '13000');
  const n = Math.round(interpolate(f, [yrs, yrs + 30], [0, 13000], Easing.out) / 100) * 100;
  return (
    <Stage>
      {springPop(f, yrs - 4) > 0 && <g transform={`translate(1090 470) scale(${springPop(f, yrs - 4)})`}>
        <rect x={-170} y={-110} width={340} height={220} rx={16} fill={PAPER} stroke={OL} strokeWidth={6} />
        <text y={-10} textAnchor="middle" fontFamily="TagBold" fontSize={84} fill={RED}>{n.toLocaleString('en-US')}</text>
        <text y={62} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill={INK}>YEARS AGO</text>
      </g>}
      {[0, 1, 2, 3, 4].map((i) => { const a = springPop(f, wordAt(s, 'people') + i * 5); return a > 0 ? <g key={i} transform={`translate(${950 + i * 70} 720) scale(${a})`} opacity={0.75}><circle cy={-44} r={13} fill="#5A4A3A" /><path d="M-14 -28 h28 l6 46 h-40 Z" fill="#5A4A3A" /></g> : null; })}
      <g transform={`rotate(${lean} ${X} ${Y})`}>
        <Staff hx={sx} hy={gy1} ang={0} gripTop={290} />
        <Host x={X} keys={[{ at: 0, arm: 'idle', expr: 'proud' }]} talking={talk(s)} staffMode="none" legs="crossed" leftArm={reach(X, Y, 1, -1, sx, gy1)} rightArm={reach(X, Y, 1, 1, sx, gy2)} />
      </g>
    </Stage>
  );
};

// c014-c017: 300,000 people, about a hundred languages, hundreds of small nations.
const DOTS = (() => { const out: { x: number; y: number; c: number; o: number }[] = []; for (let r = 0; r < 30; r++) for (let c = 0; c < 20; c++) out.push({ x: 296 + c * 2.9 + (r % 2) * 1.45, y: 256 + r * 1.75, c: Math.floor(random('dc' + r + '-' + c) * SHADES.length), o: random('do' + r + '-' + c) }); return out; })();
const PeopleMap: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const { k } = useGroup(s);
  const CX = 760, CY = 470, H = 660;
  const ppl = k === 0 ? interpolate(f, [8, d - 10], [0, 1]) : 1;
  const lang = k < 1 ? 0 : k === 1 ? interpolate(f, [0, d - 6], [0, 1]) : 1;
  const nations = gw(s, k, 3, 'hundreds');
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03, focus: [CX, CY] }}>
      <InsertBg />
      <Layer depth={1}>
        <defs><clipPath id="caClip"><path d={CA_D} transform={caTransform(CX, CY, H)} /></clipPath></defs>
        <CaShape x={CX} y={CY} h={H} fill="#E9D9B0" sw={6} />
        <g clipPath="url(#caClip)"><g transform={caTransform(CX, CY, H)}>
          {DOTS.map((p, i) => (p.o < ppl ? <circle key={i} cx={p.x} cy={p.y} r={f >= nations ? 0.62 : 0.5} fill={p.o < lang ? SHADES[p.c] : '#8A5A34'} stroke={OL} strokeWidth={0.09} /> : null))}
        </g></g>
        <CaShape x={CX} y={CY} h={H} fill="none" sw={6} />
        <MapTag x={1090} y={250} anchor="start" text={`PEOPLE  ~${(Math.round(ppl * 300) * 1000).toLocaleString('en-US')}`} k={springPop(f, gf(k, 0, 6))} size={40} />
        <MapTag x={1090} y={340} anchor="start" text={`LANGUAGES  ~${Math.round(lang * 100)}`} k={springPop(f, gf(k, 1, 2))} size={40} bg={RED} />
        <MapTag x={1090} y={430} anchor="start" text="IN ONE STATE" k={springPop(f, gw(s, k, 2, 'one'))} size={40} bg={PAPER} c={INK} />
        {[['NO KINGS', 'kings', 250], ['NO EMPIRE', 'empire', 340]].map(([t, w, y], i) => { const a = springPop(f, gw(s, k, 3, w as string)); return a > 0 ? <g key={i} transform={`translate(240 ${y}) scale(${a}) rotate(${i ? 3 : -3})`}><rect x={-130} y={-36} width={260} height={72} rx={10} fill={PAPER} stroke={OL} strokeWidth={5} /><text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill={INK}>{t}</text><path d="M-120 20 L120 -20" stroke={RED} strokeWidth={8} strokeLinecap="round" /></g> : null; })}
        <MapTag x={110} y={450} anchor="start" text="HUNDREDS OF SMALL NATIONS" k={springPop(f, nations)} size={30} bg="#2F5E3A" />
        <Host x={1650} y={900} scale={0.62} keys={k === 2 ? [{ at: 0, arm: 'shrug', expr: 'shock' }] : [{ at: 0, arm: k === 3 ? 'present' : 'point', expr: 'smile' }]} talking={talk(s)} />
      </Layer>
    </CameraRig>
  );
};

// c018: Chumash plank canoes out to the islands.
const Paddler: React.FC<{ x: number; ph: number }> = ({ x, ph }) => {
  const f = useCurrentFrame();
  const a = Math.sin(f / 5 + ph) * 26;
  return (
    <g transform={`translate(${x} 0)`}>
      <g transform={`rotate(${a} 8 -44)`}><line x1={8} y1={-96} x2={8} y2={24} stroke="#5A3E26" strokeWidth={6} strokeLinecap="round" /><ellipse cx={8} cy={32} rx={10} ry={20} fill="#8A5A34" stroke={OL} strokeWidth={3} /></g>
      <path d="M-16 -50 h30 l6 46 h-42 Z" fill="#B98A5A" stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />
      <circle cy={-70} r={19} fill="#B5794F" stroke={OL} strokeWidth={3.5} /><path d="M-19 -74 q19 -26 38 0 q-19 -8 -38 0 Z" fill={INK} />
    </g>
  );
};
const Canoe: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const x = interpolate(f, [0, d], [520, 900]);
  const bob = Math.sin(f / 9) * 6;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [900, 560] }}>
        <Sky />
        <Layer depth={0.2}><Cloud x={300} y={210} /><Cloud x={1300} y={170} s={0.8} /></Layer>
        <Layer depth={0.4}>
          <path d="M1040 520 Q1140 430 1260 470 Q1340 420 1440 480 Q1520 470 1560 520 Z" fill="#7A9A6C" stroke={OL} strokeWidth={3} />
          <path d="M330 520 Q400 474 480 500 Q540 480 600 520 Z" fill="#8FAE80" stroke={OL} strokeWidth={3} />
        </Layer>
        <Layer depth={0.6}><rect x={-200} y={518} width={2400} height={700} fill={SEA} /><rect x={-200} y={518} width={2400} height={8} fill="#6FA3BD" />
          {[...Array(9)].map((_, i) => <path key={i} d={`M${(i * 260 + f * (1 + (i % 3) * 0.4)) % 2200 - 150} ${570 + (i % 4) * 44} q18 -12 36 0 t36 0 t36 0`} stroke="#fff" strokeOpacity={0.55} strokeWidth={4} fill="none" />)}
        </Layer>
        <Layer depth={1}>
          <g transform={`translate(${x} ${700 + bob}) rotate(${Math.sin(f / 9 + 1) * 2})`}>
            {[-120, -10, 100].map((px, i) => <Paddler key={i} x={px} ph={i * 0.5} />)}
            <path d="M-260 -22 Q-290 -70 -250 -84 Q-230 -40 -190 -8 L200 -8 Q240 -40 250 -84 Q290 -70 262 -22 Q210 34 0 36 Q-210 34 -260 -22 Z" fill="#9A5B2E" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
            <path d="M-236 0 Q0 26 240 0" stroke="#6B3A1A" strokeWidth={4} fill="none" />{[-150, -60, 30, 120].map((px) => <path key={px} d={`M${px} -8 v30`} stroke="#6B3A1A" strokeWidth={3} />)}
          </g>
          <path d={`M${x - 330} ${716 + bob} q-40 -6 -80 6 M${x - 320} ${734 + bob} q-50 0 -110 14`} stroke="#fff" strokeOpacity={0.7} strokeWidth={5} fill="none" strokeLinecap="round" />
          <Rider x={1560} y={330} s={0.4} arm="point" expr="grin" talking={talk(s)} flip />
        </Layer>
      </CameraRig>
      <Label text="Chumash plank canoe" x={600} y={400} at={wordAt(s, 'plank')} size={50} />
      <Label text="the Channel Islands" x={1290} y={400} at={wordAt(s, 'islands')} size={50} color={GOLD} />
    </>
  );
};

// c019: acorns ground into flour under the oaks.
const Acorn: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const pound = Math.floor(f / 9) % 2 === 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [860, 640] }}>
        <Sky />
        <Layer depth={0.2}><Cloud x={1400} y={200} /></Layer>
        <Layer depth={0.4}><Hills y={620} fill="#C9B66B" amp={70} seed="oak1" /></Layer>
        <Layer depth={0.7}><Hills y={720} fill="#B5A455" amp={30} seed="oak2" />{[[220, 700, 2.2], [1250, 690, 1.9], [1560, 720, 1.5]].map(([x, y, sc], i) => <Tree key={i} x={x} y={y} s={sc} c="#5E7F3A" c2="#48682C" />)}</Layer>
        <Layer depth={1}>
          <rect x={-200} y={820} width={2400} height={400} fill="#B5A455" />
          <Tree x={520} y={830} s={3.1} c="#567A36" c2="#3F5F28" />
          {[0, 1, 2].map((i) => { const t = (f + i * 23) % 70; return t < 40 ? <g key={i} transform={`translate(${430 + i * 90} ${330 + 0.5 * 0.55 * t * t}) rotate(${t * 6})`}><ellipse rx={9} ry={12} fill="#8A5A2E" stroke={OL} strokeWidth={2.5} /><path d="M-9 -6 q9 -12 18 0 Z" fill="#5A3E26" stroke={OL} strokeWidth={2} /></g> : null; })}
          <ellipse cx={940} cy={842} rx={130} ry={34} fill="#9A948A" stroke={OL} strokeWidth={4} /><ellipse cx={940} cy={832} rx={46} ry={12} fill="#E9DDBF" stroke={OL} strokeWidth={3} />
          <Chibi x={800} y={850} s={1.05} {...PERSON(0)} legs="kneel" pose={pound ? 'raise' : 'hold'} item="mallet" expr="calm" talking={[]} seed="ac1" />
          <g transform="translate(1110 830)"><path d="M-56 -50 Q0 -70 56 -50 L40 14 Q0 26 -40 14 Z" fill="#C49A5A" stroke={OL} strokeWidth={4} /><path d="M-50 -30 h100 M-44 -8 h88" stroke="#8A6A34" strokeWidth={3} />{[-30, -8, 16, 34, 2].map((ax, i) => <ellipse key={i} cx={ax} cy={-56 - (i % 2) * 8} rx={10} ry={12} fill="#8A5A2E" stroke={OL} strokeWidth={2.5} />)}</g>
          <Chibi x={1240} y={850} s={0.8} {...PERSON(1)} pose="carry" item="bundle" expr="happy" talking={[]} seed="ac2" flip />
          <Host x={1640} y={900} scale={0.62} keys={[{ at: 0, arm: 'present', expr: 'smile' }]} talking={talk(s)} />
        </Layer>
      </CameraRig>
      <Label text="acorn flour" x={1010} y={500} at={wordAt(s, 'acorns')} size={52} />
    </>
  );
};

// c020-c021: small, careful fires. Hold on to those fires.
const Fire: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const { k } = useGroup(s);
  const lit = gw(s, k, 0, 'small') - 4;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.02, zoomTo: 1.07, focus: [900, 640] }}>
        <Sky />
        <Layer depth={0.3}><Hills y={560} fill="#7FA070" amp={90} seed="ff1" /></Layer>
        <Layer depth={0.6}>{[[120, 700, 2.2], [380, 690, 1.8], [1000, 700, 2.4], [1320, 690, 2], [1800, 700, 2.3]].map(([x, y, sc], i) => <Pine key={i} x={x} y={y} s={sc} c="#3E6B44" />)}</Layer>
        <Layer depth={1}>
          <rect x={-200} y={800} width={2400} height={400} fill="#8C7A4A" /><path d="M-200 800 q200 -18 400 0 t400 0 t400 0 t400 0 t400 0 t400 0" fill="#A79458" stroke={OL} strokeWidth={3} />
          {[[620, 820, 3.4], [1480, 830, 3]].map(([x, y, sc], i) => <Pine key={i} x={x} y={y} s={sc} />)}
          <Tree x={230} y={826} s={2.6} c="#567A36" c2="#3F5F28" />
          {[[430, 836], [820, 842], [1010, 832], [1200, 844], [1330, 834]].map(([x, y], i) => { const a = springPop(f, lit + i * 6); return a > 0 ? <g key={i} transform={`translate(${x} ${y}) scale(${a})`}><Flame x={0} y={0} s={0.55} seed={'cf' + i} />{[0, 1].map((j) => { const t = (f + i * 9 + j * 20) % 40; return <circle key={j} cx={Math.sin(t / 6 + i) * 10} cy={-60 - t * 2.4} r={8 + t * 0.4} fill="#E8E2D4" opacity={0.35 * (1 - t / 40)} />; })}</g> : null; })}
          <Chibi x={690} y={850} s={0.95} {...PERSON(2)} pose="hold" item="lamp" expr="calm" talking={[]} seed="fr1" />
          <Host x={1640} y={900} scale={0.62} keys={k === 0 ? [{ at: 0, arm: 'present', expr: 'smile' }] : [{ at: 0, arm: 'finger', expr: 'proud' }]} talking={talk(s)} />
        </Layer>
      </CameraRig>
      <Label text="small, careful fires" x={960} y={300} at={gw(s, k, 0, 'careful')} size={54} />
      <Label text="remember these" x={960} y={390} at={gw(s, k, 1, 'fires')} size={50} color={GOLD} rot={-3} />
    </>
  );
};

// c022-c023: the gold was lying in the riverbeds, and nobody rushed anywhere.
const River: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const { k } = useGroup(s);
  const gold = gw(s, k, 0, 'gold');
  const wx = k === 1 ? interpolate(f, [0, d], [240, 1340]) : -400;
  const yrs = k === 1 ? Math.round(interpolate(f, [4, 60], [0, 13000], Easing.out) / 100) * 100 : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [900, 640] }}>
        <Sky />
        <Layer depth={0.3}><Hills y={520} fill="#B9B27A" amp={110} seed="rv1" /></Layer>
        <Layer depth={0.6}><Hills y={640} fill="#A8A062" amp={40} seed="rv2" />{[[260, 640, 1.6], [1500, 630, 1.9]].map(([x, y, sc], i) => <Tree key={i} x={x} y={y} s={sc} c="#5E7F3A" c2="#48682C" />)}</Layer>
        <Layer depth={1}>
          <rect x={-200} y={690} width={2400} height={500} fill="#A8A062" />
          <path d="M-200 720 Q500 690 960 724 T2200 716 L2200 850 Q1500 880 960 846 T-200 860 Z" fill="#8FC3DA" stroke={OL} strokeWidth={4} />
          <path d="M-200 790 Q500 770 960 800 T2200 790 L2200 850 Q1500 880 960 846 T-200 860 Z" fill="#B9A070" opacity={0.75} />
          {[...Array(7)].map((_, i) => <path key={i} d={`M${(i * 330 + f * 2.2) % 2300 - 200} ${736 + (i % 3) * 16} q16 -8 32 0 t32 0`} stroke="#fff" strokeOpacity={0.7} strokeWidth={4} fill="none" />)}
          {[[420, 818], [600, 828], [790, 814], [980, 830], [1150, 818], [1330, 826], [1500, 814]].map(([x, y], i) => { const a = springPop(f, gold + i * 3); const t = (f + i * 7) % 30; return a > 0 ? <g key={i} transform={`translate(${x} ${y}) scale(${a})`}><path d="M-14 4 Q-12 -10 2 -12 Q16 -10 14 4 Q4 12 -14 4 Z" fill={GOLD} stroke={OL} strokeWidth={3} /><path d="M0 -14 L3 -3 L14 0 L3 3 L0 14 L-3 3 L-14 0 L-3 -3 Z" transform={`translate(8 -14) scale(${0.3 + Math.sin((t / 30) * Math.PI) * 0.8})`} fill="#fff" /></g> : null; })}
          {k === 1 && <Chibi x={wx} y={742} s={0.9} {...PERSON(1)} legs="walk" pose="carry" item="bundle" expr="happy" talking={[]} seed="rw1" />}
          {k === 1 && <Chibi x={wx - 150} y={746} s={0.7} {...PERSON(0)} legs="walk" pose="idle" expr="happy" talking={[]} seed="rw2" />}
          <Host x={1650} y={700} scale={0.55} keys={k === 0 ? [{ at: 0, arm: 'point', expr: 'grin' }] : [{ at: 0, arm: 'shrug', expr: 'smile' }]} talking={talk(s)} />
        </Layer>
      </CameraRig>
      {k === 0 && <Label text="gold, right there" x={900} y={600} at={gold + 6} size={54} color={GOLD} />}
      {k === 1 && <Label text={`${yrs.toLocaleString('en-US')} years`} x={640} y={420} at={4} size={64} />}
      <Label text="nobody rushed" x={1020} y={500} at={gw(s, k, 1, 'nobody')} size={54} color={GOLD} rot={-2} />
    </>
  );
};

// c024: that was about to change. A sail on the horizon.
const Change: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const k = springPop(f, 4);
  return (
    <Stage>
      {k > 0 && <g transform={`translate(1090 500) scale(${k})`}>
        <rect x={-170} y={-150} width={340} height={300} rx={16} fill="#BFE0EE" stroke={OL} strokeWidth={6} />
        <rect x={-170} y={40} width={340} height={110} rx={0} fill={SEA} /><rect x={-170} y={-150} width={340} height={300} rx={16} fill="none" stroke={OL} strokeWidth={6} />
        <g transform={`translate(${interpolate(f, [0, d], [150, 0])} 0)`}><Galleon x={0} y={46} s={0.42} flip /></g>
      </g>}
      <Host x={1480} keys={[{ at: 0, arm: 'chin', expr: 'worried' }]} talking={talk(s)} />
    </Stage>
  );
};

export const SHOTS_FIRST: ShotMap = { fc_cane: Cane, fc_map: PeopleMap, fc_canoe: Canoe, fc_acorn: Acorn, fc_fire: Fire, fc_river: River, fc_change: Change };
