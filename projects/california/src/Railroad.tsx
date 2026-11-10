/** Railroad (6:11 to 7:20): the journey problem, the Big Four, the Chinese workers, Promontory, the Exclusion Act (quiet), Stanford's farm. */
import React from 'react';
import { interpolate, Easing, springPop } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { OL, Hills, Cloud, Tree } from '@engine/scenes/Parts';
import { Horse } from '@engine/scenes/India';
import { talk, type ShotMap, type SP } from '@engine/kit';
import { Stage } from '@engine/moves';
import { P, camAt, moveCam, toScreen, Full, MapTag, FlowLines } from '@engine/qgis/QgisMap';
import { PAPER, RED, GOLD, Rider, OldWorld } from './Kit';
import { Tag, useBeat, Pop, Txt, Sign, DarkSign, Sky, Ground, HostS, Quiet, fade, Wagon, Shovel, Pan, Person, Sparkle, Uni } from './Kit2';

const SERIF = "Georgia, 'Times New Roman', serif";
const TRAIL: [number, number][] = [[-94.4, 39.1], [-104.8, 41.1], [-112.4, 42.9], [-117.7, 40.9], [-120.2, 39.3], [-121.5, 38.6]];
const SEA_WAY: [number, number][] = [[-74, 40.7], [-38, 2], [-52, -40], [-67.3, -56.5], [-82, -32], [-108, 12], [-122.4, 37.8]];
const RAIL: [number, number][] = [[-95.94, 41.26], [-100.8, 41.1], [-104.8, 41.14], [-109.2, 41.6], [-112.55, 41.62], [-115.8, 40.8], [-119.8, 39.5], [-121.5, 38.58]];
const railPath = (pts: [number, number][]) => 'M' + pts.map((p) => P(...p)).map((q) => `${q[0]} ${q[1]}`).join('L');

// c119-c120: everyone had the same problem. Getting there.
const Problem: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <Stage>
      <Pop k={springPop(B.g, 8)} x={1090} y={640}><Wagon x={0} y={0} s={1.5} f={B.g} /></Pop>
      <DarkSign x={1090} y={330} k={B.pop(1, 'Getting')} text="GETTING THERE" size={56} />
      <HostS s={s} x={1640} keys={[{ at: 0, arm: B.k === 0 ? 'present' : 'shrug', expr: 'smile' }]} />
    </Stage>
  );
};

// c121-c124: four to six months by wagon; about the same by ship around South America.
const Routes: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const t1 = B.gAt(1, 0);
  const cam = moveCam(B.g, camAt(-106, 39, 3.4), camAt(-92, -4, 1.55), t1, t1 + 50);
  return (
    <>
      <OldWorld cam={cam}>
        <FlowLines pts={TRAIL.map((p) => P(...p))} cam={cam} start={B.loc(12)} step={12} bend={0.06} />
        <FlowLines pts={SEA_WAY.map((p) => P(...p))} cam={cam} start={B.loc(t1 + 24)} step={18} bend={0.02} color="#2F6F9F" done="#2F6F9F" />
      </OldWorld>
      <Full>
        <Tag x={60} y={200} anchor="start" text="BY WAGON · 4 TO 6 MONTHS" k={B.pop(0, 'wagon')} size={34} bg={RED} />
        <Tag x={60} y={280} anchor="start" text="BY SHIP, AROUND SOUTH AMERICA" k={B.pop(1, 'ship')} size={32} bg="#2F6F9F" />
        <Tag x={60} y={356} anchor="start" text="ABOUT THE SAME" k={B.pop(2, 'same')} size={30} bg={PAPER} c="#1A1410" />
        <Rider x={1640} y={360} arm="point" expr={B.k === 3 ? 'worried' : 'grin'} talking={talk(s)} flip />
      </Full>
    </>
  );
};

// c125-c126: something crazy: a railroad across the entire continent.
const DARKMAP = { land: '#3D4C54', sea: '#17232C', ca: '#E8A84A' };
const Crazy: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const cam = moveCam(B.g, camAt(-112, 40, 5.4), camAt(-108.5, 40, 5.0), 0, B.gd);
  const t = B.gAt(1, 'railroad');
  const p = interpolate(B.g, [t, t + 50], [0, 1], Easing.inOut);
  const a = toScreen(cam, ...P(-95.94, 41.26)), z = toScreen(cam, ...P(-121.5, 38.58));
  return (
    <>
      <OldWorld cam={cam} {...DARKMAP}>
        {p > 0 && <path d={railPath(RAIL)} pathLength={1} fill="none" stroke={GOLD} strokeWidth={6 / cam.z} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" strokeLinejoin="round" />}
      </OldWorld>
      <Full>
        <Tag x={60} y={200} anchor="start" text="SOMETHING CRAZY" k={B.pop(0, 'crazy')} size={36} bg={RED} />
        <Tag x={60} y={282} anchor="start" text="A RAILROAD ACROSS THE CONTINENT" k={B.pop(1, 'railroad')} size={32} />
        <Tag x={a.x} y={a.y - 40} text="OMAHA" k={B.pop(1, 'railroad') * 0.85} size={26} bg={PAPER} c="#1A1410" />
        <Tag x={z.x + 30} y={z.y + 56} text="SACRAMENTO" k={p >= 1 ? 0.85 : 0} size={26} bg={PAPER} c="#1A1410" />
        <Rider x={1640} y={700} arm="point" expr="grin" talking={talk(s)} flip />
      </Full>
    </>
  );
};

// c127-c130: the bosses on the California side: four Sacramento shopkeepers.
const SHOPS = ['HARDWARE', 'HARDWARE', 'DRY GOODS', 'GROCERIES'];
const Four: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <Stage>
      {SHOPS.map((shop, i) => { const k = Math.max(0, springPop(B.f, B.at(0, 'four') + i * 5)); return k > 0 ? (
        <g key={i} transform={`translate(${940 + i * 128} 0)`}>
          <g transform={`translate(0 940) scale(${k}) translate(0 -940)`}><Chibi x={0} y={940} s={0.74} outfit={{ top: ['#3A3A44', '#4A3A2A', '#2F4A4A', '#3A2F4A'][i], bottom: '#2B2B33', trim: '#E2B13C' }} hat="tophat" mustache={i % 2 === 0} beard={i === 3} pose={B.k >= 2 ? 'hold' : 'idle'} item={B.k >= 2 ? 'coin' : undefined} expr="happy" talking={[]} seed={'b4' + i} /></g>
          <Pop k={B.pop(1, 'shopkeepers')} x={0} y={590} rot={i % 2 ? 3 : -3}><rect x={-58} y={-20} width={116} height={40} rx={5} fill={PAPER} stroke={OL} strokeWidth={4} /><Txt y={8} t={shop} size={19} /></Pop>
        </g>) : null; })}
      <DarkSign x={1130} y={330} k={B.pop(1, 'shopkeepers')} text="FOUR SHOPKEEPERS" size={40} />
      <Pop k={B.pop(2, 'supplies')} x={1010} y={480}><Shovel s={0.6} /></Pop>
      <Pop k={B.pop(2, 'supplies')} x={1250} y={480}><Pan s={0.6} gold /></Pop>
      <Sign x={1130} y={480} k={B.pop(3, 'pattern')} text="A PATTERN?" size={40} rot={-4} c={RED} />
      <HostS s={s} x={1680} keys={[{ at: 0, arm: B.k === 3 ? 'finger' : 'present', expr: B.k === 3 ? 'grin' : 'smile' }]} />
    </Stage>
  );
};

// c131-c135: the men who built it were mostly Chinese: granite, snow deeper than a house, less pay.
const Workers: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [1000, 640] }}>
        <Sky id="skyWinter" />
        <Layer depth={0.3}><Hills y={520} fill="#C9D4DC" amp={200} seed="wk1" /><Hills y={600} fill="#E4EBF0" amp={120} seed="wk2" /></Layer>
        <Layer depth={1}>
          <Ground y={800} fill="#EEF2F5" top="#FFFFFF" />
          <path d="M1180 820 L1240 380 Q1500 300 1800 360 L2200 340 V820 Z" fill="#8E949A" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
          <path d="M1240 380 Q1500 300 1800 360 L2200 340 V300 Q1700 250 1230 330 Z" fill="#FFFFFF" stroke={OL} strokeWidth={4} />
          <path d="M1330 820 V640 Q1420 540 1510 640 V820 Z" fill="#23262B" stroke={OL} strokeWidth={5} />
          <path d="M-200 846 H1500 M-200 870 H1500" stroke="#5A5A66" strokeWidth={7} />{[...Array(18)].map((_, i) => <rect key={i} x={-180 + i * 92} y={838} width={16} height={42} fill="#6B4A2B" stroke={OL} strokeWidth={2.5} />)}
          {[0, 1, 2, 3].map((i) => <Chibi key={i} x={640 + i * 170} y={900 + (i % 2) * 24} s={0.85} outfit={{ top: '#3F5F8A', bottom: '#2F3A4A' }} hat="nonla" pose={Math.floor((B.g + i * 9) / 9) % 2 ? 'raise' : 'hold'} item={i % 2 ? 'hammer' : 'mallet'} expr="determined" talking={[]} seed={'cw' + i} flip={i > 1} />)}
          {[...Array(40)].map((_, i) => <circle key={i} cx={(i * 211 + B.g * (1 + (i % 3))) % 2100 - 60} cy={(i * 97 + B.g * (3 + (i % 4))) % 900} r={4 + (i % 3)} fill="#fff" opacity={0.85} />)}
          <HostS s={s} x={300} y={960} scale={0.6} keys={[{ at: 0, arm: B.k === 0 ? 'present' : 'idle', expr: B.k >= 3 ? 'worried' : 'smile' }]} />
        </Layer>
      </CameraRig>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <Pop k={B.pop(1, 'nine')} x={330} y={300}>
          <rect x={-250} y={-74} width={500} height={150} rx={14} fill="#26343A" stroke={OL} strokeWidth={5} />
          {[...Array(10)].map((_, i) => <Person key={i} x={-198 + i * 44} y={30} s={0.8} c={i < 9 ? GOLD : '#7A8288'} />)}
          <Txt y={62} t="9 OUT OF 10 WORKERS" size={24} c="#F4ECD8" />
        </Pop>
        <DarkSign x={330} y={470} k={B.pop(2, '12,000')} text="12,000+ MEN" size={40} />
      </svg>
      {B.k >= 3 && <Label text="snow deeper than a house" x={1000} y={300} at={B.at(3, 'snow')} size={50} />}
      {B.k === 4 && <Label text="for less pay" x={1000} y={400} at={B.at(4, 'less')} size={50} color={GOLD} rot={-3} />}
    </>
  );
};

// c136-c138: 10 May 1869, the two tracks meet. Six months becomes one week.
const Meet: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const cam = camAt(-110, 40, 5.2);
  const t = B.gAt(1, 'meet');
  const p = interpolate(B.g, [8, Math.min(t, 99998) > 9000 ? B.gd * 0.5 : t], [0, 1], Easing.inOut);
  const west = RAIL.slice(4).reverse(), east = RAIL.slice(0, 5);
  const m = toScreen(cam, ...P(-112.55, 41.62));
  const met = p >= 1;
  return (
    <>
      <OldWorld cam={cam} {...DARKMAP}>
        <path d={railPath(east)} pathLength={1} fill="none" stroke="#7FB7E8" strokeWidth={7 / cam.z} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" strokeLinejoin="round" />
        <path d={railPath(west)} pathLength={1} fill="none" stroke={GOLD} strokeWidth={7 / cam.z} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" strokeLinejoin="round" />
      </OldWorld>
      <Full>
        <Tag x={60} y={200} anchor="start" text="MAY 10, 1869" k={springPop(B.g, 6)} size={38} />
        {met && <Sparkle x={m.x} y={m.y} f={B.g} r={48} c={GOLD} />}
        <Tag x={m.x} y={m.y - 70} text="PROMONTORY SUMMIT" k={met ? Math.max(0, springPop(B.g, t)) : 0} size={28} bg={PAPER} c="#1A1410" />
        <Tag x={960} y={800} text="6 MONTHS  →  1 WEEK" k={B.pop(2, 'one')} size={62} bg={RED} />
        <Rider x={1660} y={330} arm="finger" expr="grin" talking={talk(s)} flip />
      </Full>
    </>
  );
};

// c139-c142 (quiet): 1882, the door closes on Chinese workers.
const QuietRail: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const close = B.k < 1 ? 0 : B.k >= 3 ? 1 : interpolate(B.g, [B.gAt(1, 0), B.gAt(1, 0) + 200], [0, 1]);
  return (
    <Quiet>
      <rect x={830} y={300} width={260} height={520} fill="#0E1014" stroke="#3A4048" strokeWidth={8} />
      <rect x={838} y={308} width={244 * (1 - close)} height={504} fill="#E8D9A8" opacity={0.85} />
      <rect x={838 + 244 * (1 - close)} y={308} width={244 * close} height={504} fill="#2A2F36" stroke="#3A4048" strokeWidth={4} />
      <text x={960} y={250} textAnchor="middle" fontFamily={SERIF} fontSize={84} fill="#E8E2D4" opacity={B.k < 1 ? 0 : B.k > 1 ? 1 : fade(B.f, 4, 30)}>1882</text>
      <text x={960} y={890} textAnchor="middle" fontFamily={SERIF} fontSize={46} fill="#A8A294" opacity={B.k < 2 ? 0 : B.k > 2 ? 1 : fade(B.f, 4, 30)}>The Chinese Exclusion Act</text>
    </Quiet>
  );
};

// c143-c147: Leland Stanford, a new university on his horse farm. Remember that farm.
const Stanford: React.FC<SP> = ({ s }) => {
  const B = useBeat(s);
  const u = B.at(1, 'university');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [1000, 640] }}>
        <Sky />
        <Layer depth={0.3}><Hills y={560} fill="#C9B46A" amp={90} seed="st1" /><Cloud x={380} y={230} /><Cloud x={1500} y={260} s={0.8} /></Layer>
        <Layer depth={1}>
          <Ground y={790} fill="#8FA85A" top="#A3BC6A" />
          <Tree x={170} y={810} s={2.4} c="#567A36" c2="#3F5F28" />
          <g transform="translate(470 800)"><rect x={-140} y={-170} width={280} height={170} fill="#A8452F" stroke={OL} strokeWidth={5} /><path d="M-160 -170 L0 -270 L160 -170 Z" fill="#7A2E20" stroke={OL} strokeWidth={5} strokeLinejoin="round" /><rect x={-44} y={-110} width={88} height={110} fill="#F4ECD8" stroke={OL} strokeWidth={4} /><path d="M-44 -110 L44 0 M44 -110 L-44 0" stroke={OL} strokeWidth={4} /></g>
          {[...Array(7)].map((_, i) => <rect key={i} x={640 + i * 120} y={830} width={12} height={80} fill="#F4ECD8" stroke={OL} strokeWidth={3} />)}
          <path d="M640 850 H1372 M640 884 H1372" stroke="#F4ECD8" strokeWidth={8} />
          <Horse x={840} y={900} s={0.95} gait="idle" />
          <Uni x={1300} y={800} s={0.9} rise={interpolate(B.f, [u, u + 40], [0, 1], Easing.out)} />
          <DarkSign x={880} y={520} k={B.pop(3, 'farm')} text="REMEMBER THIS FARM" size={40} rot={-3} />
          <HostS s={s} x={1740} y={950} scale={0.6} keys={[{ at: 0, arm: B.k >= 3 ? 'finger' : 'present', expr: B.k >= 3 ? 'grin' : 'smile' }]} />
        </Layer>
      </CameraRig>
      <Label text="Leland Stanford" x={520} y={300} at={B.at(0, 'Leland')} size={56} />
      {B.k >= 1 && B.k < 3 && <Label text="a new university, 1885" x={1300} y={400} at={u + 20} size={46} color={GOLD} />}
    </>
  );
};

export const SHOTS_RAIL: ShotMap = { rr_problem: Problem, rr_routes: Routes, rr_crazy: Crazy, rr_four: Four, rr_workers: Workers, rr_meet: Meet, rr_quiet: QuietRail, rr_stanford: Stanford };
