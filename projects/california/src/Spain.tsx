/** Spain (1:30 to 2:51): Cabrillo, the long wait, Drake, the Russian scare, 21 missions, and the mission walls (quiet). */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Host, hostLeftHand } from '@engine/characters/Host';
import { Chibi } from '@engine/characters/Chibi';
import { GreyStage } from '@engine/scenes/Backgrounds';
import { OL, Hills, Cloud } from '@engine/scenes/Parts';
import { talk, wordAt, type ShotMap, type SP } from '@engine/kit';
import { W, dress } from '@engine/cast/Wardrobe';
import { Staff, along, Stage } from '@engine/moves';
import { P, camAt, moveCam, mixCam, toScreen, QC, Full, MapTag, MapPin, FlowLines, flowIndex } from '@engine/qgis/QgisMap';
import { PAPER, RED, GOLD, INK, SEA, useGroup, gw, gf, FlyIn, Rider, OldWorld, Galleon } from './Kit';

const Y = 960;
const KING = dress(W.KING('#7A1E2E'), { hat: 'crown' });
const Sky: React.FC<{ id?: string }> = ({ id = 'skyDay' }) => <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={`url(#${id})`} /></Layer>;

// c025-c026: Cabrillo sails up the coast, 1542.
const ROUTE: { ll: [number, number]; name?: string }[] = [
  { ll: [-104.7, 19.2], name: 'Navidad, New Spain' }, { ll: [-110.6, 22.6] }, { ll: [-116.9, 31.7] }, { ll: [-117.3, 32.6], name: 'San Diego Bay' },
  { ll: [-120.0, 34.2], name: 'Channel Islands' }, { ll: [-122.3, 36.6] }, { ll: [-123.4, 38.4], name: 'as far as the Russian River' },
];
const Cabrillo: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const { g, gd, k } = useGroup(s);
  const first = k === 1 ? g - f + wordAt(s, 'first') : 99999;
  const cam = moveCam(g, camAt(-108, 24, 5.2), camAt(-117.5, 32.5, 7.6), 20, gd - 30);
  const pts = ROUTE.map((r) => P(...r.ll));
  const start = 16, step = (gd - 70) / (pts.length - 1);
  const n = flowIndex(g, start, step, pts.length);
  const named = ROUTE.map((r, i) => ({ ...r, i })).filter((r) => r.name && r.i < n).pop();
  // the ship rides the head of the route
  const seg = Math.min(pts.length - 2, Math.max(0, Math.floor((g - start) / step)));
  const tt = Math.min(1, Math.max(0, (g - start - seg * step) / step));
  const a = pts[seg], b = pts[seg + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const cx = (a[0] + b[0]) / 2 - L * 0.14, cy = (a[1] + b[1]) / 2 + L * 0.1;
  const sx = (1 - tt) * (1 - tt) * a[0] + 2 * (1 - tt) * tt * cx + tt * tt * b[0], sy = (1 - tt) * (1 - tt) * a[1] + 2 * (1 - tt) * tt * cy + tt * tt * b[1];
  const ship = toScreen(cam, sx, sy);
  return (
    <>
      <OldWorld cam={cam}>
        {pts.slice(1).map((q, i) => {
          const p0 = pts[i], t0 = start + i * step; if (g < t0) return null;
          const len = Math.hypot(q[0] - p0[0], q[1] - p0[1]);
          const u = Math.min(1, (g - t0) / step);
          return <path key={i} d={`M${p0[0]} ${p0[1]} Q${(p0[0] + q[0]) / 2 - len * 0.14} ${(p0[1] + q[1]) / 2 + len * 0.1} ${q[0]} ${q[1]}`} pathLength={1} fill="none" stroke={RED} strokeWidth={5 / cam.z} strokeDasharray="1 1" strokeDashoffset={1 - u} strokeLinecap="round" />;
        })}
        {pts.map((p, i) => (i < n && ROUTE[i].name ? <circle key={i} cx={p[0]} cy={p[1]} r={7 / cam.z} fill={RED} stroke={QC.ink} strokeWidth={2 / cam.z} /> : null))}
      </OldWorld>
      <Full>
        <Galleon x={ship.x - 40} y={ship.y + 6} s={0.3} flag="#E2B13C" />
        <MapTag x={60} y={170} anchor="start" text="1542 · CABRILLO SAILS FOR SPAIN" k={springPop(g, 6)} size={34} />
        {named && <MapTag x={60} y={250} anchor="start" text={named.name!.toUpperCase()} k={springPop(g, Math.round(start + (named.i - 1) * step + step * 0.9))} size={30} bg={PAPER} c={INK} />}
        <MapTag x={60} y={330} anchor="start" text="FIRST EUROPEAN TO SEE IT" k={springPop(g, first)} size={30} bg={RED} />
        <FlyIn g={g} x={1560} y={360} arm="point" expr="grin" talking={talk(s)} />
      </Full>
    </>
  );
};

// c027-c028: Spain's reaction.
const React_: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const { k } = useGroup(s);
  const nice = gw(s, k, 1, 'Nice');
  const b = springPop(f, nice - 2);
  return (
    <Stage>
      <Chibi x={1150} y={940} s={1.25} {...KING} pose={f >= nice ? 'shrug' : 'idle'} expr={f >= nice ? 'happy' : 'calm'} talking={k === 1 ? [[nice, nice + 50]] : []} seed="kg1" />
      {b > 0 && <g transform={`translate(1150 420) scale(${b})`}>
        <path d="M-40 70 L-10 120 L20 70 Z" fill="#fff" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
        <rect x={-212} y={-80} width={424} height={156} rx={34} fill="#fff" stroke={OL} strokeWidth={5} />
        <rect x={-46} y={66} width={70} height={10} fill="#fff" />
        <text y={-16} textAnchor="middle" fontFamily="Hand" fontSize={56} fill={INK}>Nice.</text>
        <text y={44} textAnchor="middle" fontFamily="Hand" fontSize={35} fill={INK}>We’ll get back to you.</text>
      </g>}
      <Host x={1560} keys={k === 0 ? [{ at: 0, arm: 'present', expr: 'smile' }] : [{ at: 0, arm: 'hip', expr: 'worried' }]} talking={talk(s)} />
    </Stage>
  );
};

// c029-c030: they did. 227 years later.
const Wait: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const { g, gd, k } = useGroup(s);
  const year = Math.round(interpolate(g, [10, gd - 36], [1542, 1769], Easing.inOut));
  const later = gw(s, k, 1, 'later');
  const st = springPop(f, later - 2);
  return (
    <Stage>
      <g transform="translate(1090 440)">
        <rect x={-180} y={-130} width={360} height={230} rx={16} fill="#26343A" stroke={OL} strokeWidth={6} />
        <text y={-70} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#CFC6B2">THE YEAR</text>
        <text y={46} textAnchor="middle" fontFamily="TagBold" fontSize={120} fill={GOLD}>{year}</text>
        {g > gd * 0.35 && <g opacity={Math.min(1, (g - gd * 0.35) / 20)} stroke="#D9D4C8" strokeWidth={2.5} fill="none"><path d="M-180 -70 Q-140 -110 -110 -130 M-180 -100 Q-160 -116 -146 -130 M-172 -74 Q-150 -90 -116 -122 M-160 -84 q10 -24 28 -30" /><path d="M180 40 Q150 70 130 100 M180 70 Q166 84 156 100 M172 44 Q152 66 138 96" /></g>}
      </g>
      {st > 0 && <g transform={`translate(1090 640) rotate(-6) scale(${st})`}><rect x={-200} y={-44} width={400} height={88} rx={10} fill="rgba(255,255,255,0.92)" stroke={RED} strokeWidth={7} /><text y={17} textAnchor="middle" fontFamily="TagBold" fontSize={48} fill={RED}>227 YEARS LATER</text></g>}
      <Host x={1520} keys={k === 0 ? [{ at: 0, arm: 'chin', expr: 'smile' }] : [{ at: 0, arm: 'chin', expr: 'smile' }, { at: later, arm: 'shrug', expr: 'grin' }]} talking={talk(s)} />
    </Stage>
  );
};

// c031-c032: Drake stops by in 1579, fixes his ship, claims the place and leaves.
const Drake: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const { k } = useGroup(s);
  const claim = gw(s, k, 1, 'claimed'), left = gw(s, k, 1, 'left');
  const away = f >= left ? interpolate(f, [left, left + 60], [0, 1], Easing.in) : 0;
  const fixing = k === 0 || f < claim;
  const hammer = Math.floor(f / 7) % 2 === 0;
  const flag = springPop(f, claim);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [900, 620] }}>
        <Sky />
        <Layer depth={0.2}><Cloud x={420} y={200} /><Cloud x={1500} y={240} s={0.8} /></Layer>
        <Layer depth={0.5}><rect x={-200} y={560} width={2400} height={700} fill={SEA} />
          {[...Array(6)].map((_, i) => <path key={i} d={`M${(i * 380 + f * 1.4) % 2200 - 150} ${600 + (i % 3) * 30} q18 -12 36 0 t36 0`} stroke="#fff" strokeOpacity={0.55} strokeWidth={4} fill="none" />)}
          <path d="M1180 600 L1240 380 Q1500 330 1760 400 L2200 380 L2200 640 Z" fill="#F1ECDC" stroke={OL} strokeWidth={4} strokeLinejoin="round" /><path d="M1240 380 Q1500 330 1760 400 L2200 380 L2200 350 Q1700 320 1240 352 Z" fill="#9DBA78" stroke={OL} strokeWidth={3} />
        </Layer>
        <Layer depth={1}>
          <path d="M-200 800 Q500 730 1100 790 T2200 760 L2200 1200 L-200 1200 Z" fill="#E7D5A2" stroke={OL} strokeWidth={4} />
          <g transform={`translate(${-away * 1400} ${-away * 60})`}><Galleon x={470} y={730} s={1.25} rot={fixing ? -11 : 0} flag="#FFFFFF" /></g>
          {fixing && [0, 1, 2].map((i) => <g key={i} transform={`translate(${330 + i * 60} ${800 + (i % 2) * 14}) rotate(${10 + i * 12})`}><rect x={-34} y={-6} width={68} height={12} rx={3} fill="#A8744A" stroke={OL} strokeWidth={3} /></g>)}
          <Chibi x={760} y={840} s={0.95} outfit={{ top: '#3A3A44', bottom: '#5A4A3A', trim: '#E2B13C' }} hat="europe" beard pose={fixing ? (hammer ? 'raise' : 'hold') : f >= left ? 'wave' : 'present'} item={fixing ? 'hammer' : undefined} expr={fixing ? 'determined' : 'happy'} talking={[]} seed="dr1" flip={fixing} />
          {flag > 0 && <g transform={`translate(1010 842) scale(${flag})`}>
            <line x1={0} y1={0} x2={0} y2={-330} stroke="#5A3E26" strokeWidth={8} strokeLinecap="round" />
            <path d={`M0 -326 Q70 ${-340 + Math.sin(f / 5) * 8} 150 -322 L150 -222 Q70 ${-238 + Math.sin(f / 5) * 8} 0 -224 Z`} fill="#fff" stroke={OL} strokeWidth={4} strokeLinejoin="round" />
            <path d="M0 -276 L150 -272 M75 -330 L75 -228" stroke="#C0392B" strokeWidth={16} />
            <g transform="translate(150 -130) rotate(-4)"><rect x={-110} y={-34} width={220} height={68} rx={8} fill="#C9A66B" stroke={OL} strokeWidth={4} /><text y={12} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill={INK}>NOVA ALBION</text><line x1={0} y1={34} x2={0} y2={130} stroke="#5A3E26" strokeWidth={7} /></g>
          </g>}
          <Host x={1640} y={920} scale={0.62} keys={k === 0 ? [{ at: 0, arm: 'present', expr: 'smile' }] : [{ at: 0, arm: 'point', expr: 'smile' }, { at: left, arm: 'wave', expr: 'grin' }]} talking={talk(s)} />
        </Layer>
      </CameraRig>
      <Label text="Francis Drake, 1579" x={620} y={300} at={gw(s, k, 0, 'Drake') - 2} size={56} />
      {k === 1 && d > 0 && <Label text="…and left" x={520} y={420} at={left + 30} size={52} color={GOLD} rot={-3} />}
    </>
  );
};

// c033-c034: what finally woke Spain up? Russia.
const Woke: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const { k } = useGroup(s);
  const hit = gw(s, k, 1, 'Russia');
  const drop = f >= hit ? Math.min(1, (f - hit) / 5) : 0;
  return (
    <Stage shakes={k === 1 ? [{ at: hit + 5, amp: 9, len: 8 }] : []}>
      <Chibi x={1090} y={940} s={1.25} {...KING} pose={f >= hit + 5 ? 'bothUp' : 'idle'} expr={f >= hit + 5 ? 'shock' : 'calm'} talking={[]} seed="kg2" />
      {f < hit + 5 && [0, 1, 2].map((i) => { const t = (f + i * 14) % 42; return <text key={i} x={1180 + t * 1.6} y={560 - t * 3.4} fontFamily="TagBold" fontSize={30 + t * 0.7} fill="#5A5A66" opacity={1 - t / 42}>z</text>; })}
      {drop > 0 && <g transform={`translate(1090 ${interpolate(drop, [0, 1], [-200, 330], Easing.in)}) rotate(-4)`}><rect x={-170} y={-60} width={340} height={120} rx={12} fill={RED} stroke={OL} strokeWidth={6} /><text y={26} textAnchor="middle" fontFamily="TagBold" fontSize={78} fill="#fff">RUSSIA</text></g>}
      <Host x={1520} keys={k === 0 ? [{ at: 0, arm: 'chin', expr: 'smile' }] : [{ at: 0, arm: 'chin', expr: 'smile' }, { at: hit, arm: 'point', expr: 'grin' }]} talking={talk(s)} />
    </Stage>
  );
};

// c035-c036: Russian fur hunters creeping down from Alaska.
const FUR: [number, number][] = [[-179, 52.5], [-166.5, 53.9], [-158.5, 55.6], [-152.4, 57.6]];
const Russia: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const { g, gd, k } = useGroup(s);
  const cam = moveCam(g, camAt(-158, 56, 3.4), camAt(-140, 46, 2.9), 30, gd - 20);
  const pts = FUR.map((p) => P(...p));
  const worth = k === 1 ? g - f + wordAt(s, 'worth') : 99999;
  const dash = interpolate(g, [worth - 26, worth], [0, 1]);
  const from = P(-152.4, 57.6), to = P(-123.6, 39.2);
  const caS = toScreen(cam, ...P(-119.6, 36.9)), ak = toScreen(cam, ...P(-153, 63));
  return (
    <>
      <OldWorld cam={cam} ca={g >= worth ? GOLD : '#F3B562'}>
        <FlowLines pts={pts} cam={cam} start={14} step={26} bend={0.22} />
        {dash > 0 && <path d={`M${from[0]} ${from[1]} Q${(from[0] + to[0]) / 2 - 14} ${(from[1] + to[1]) / 2 + 10} ${to[0]} ${to[1]}`} fill="none" stroke={RED} strokeWidth={4.5 / cam.z} strokeDasharray={`${9 / cam.z} ${7 / cam.z}`} strokeLinecap="round" opacity={dash} />}
      </OldWorld>
      <Full>
        <MapTag x={ak.x} y={ak.y} text="ALASKA" k={springPop(g, 8) * 0.9} size={30} bg={PAPER} c={INK} />
        <MapTag x={60} y={170} anchor="start" text="RUSSIAN FUR HUNTERS, 1740s – 1760s" k={springPop(g, 18)} size={32} bg={RED} />
        {g >= worth && <g transform={`translate(${caS.x} ${caS.y})`}><circle r={30 + ((g - worth) % 30) * 1.6} fill="none" stroke={GOLD} strokeWidth={6} opacity={1 - ((g - worth) % 30) / 30} /></g>}
        <MapTag x={caS.x + 40} y={caS.y + 10} anchor="start" text="WORTH KEEPING" k={springPop(g, worth + 4)} size={34} />
        <Rider x={1560} y={400} arm={g >= worth ? 'finger' : 'point'} expr="worried" talking={talk(s)} flip />
      </Full>
    </>
  );
};

// c037-c039: 1769, and 21 missions from San Diego to Sonoma along one road.
export const MISSIONS: [number, number][] = [
  [-117.106, 32.784], [-117.32, 33.232], [-117.663, 33.502], [-118.107, 34.097], [-118.461, 34.273], [-119.298, 34.281], [-119.714, 34.438],
  [-120.137, 34.594], [-120.421, 34.67], [-120.664, 35.281], [-120.698, 35.745], [-121.25, 36.015], [-121.356, 36.405], [-121.92, 36.543],
  [-121.536, 36.845], [-122.029, 36.978], [-121.941, 37.349], [-121.92, 37.533], [-122.427, 37.764], [-122.528, 37.974], [-122.456, 38.294],
];
const Missions: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const { g, k } = useGroup(s);
  const cam = moveCam(g, camAt(-118, 37, 6), camAt(-119.4, 35.6, 21), 0, 46);
  const pts = MISSIONS.map((m) => P(...m));
  const at = (i: number) => (i === 0 ? gw(s, k, 0, 'marched') : k < 1 ? 99999 : k > 1 ? -999 : 6 + ((i - 1) * (d - 20)) / 20);
  const n = pts.filter((_, i) => f >= at(i)).length;
  const road = k < 2 ? 0 : interpolate(f, [wordAt(s, 'linked'), wordAt(s, 'linked') + 34], [0, 1], Easing.inOut);
  const year = n <= 1 ? 1769 : Math.round(1769 + ((n - 1) / 20) * 54);
  const sd = toScreen(cam, ...pts[0]), so = toScreen(cam, ...pts[20]);
  return (
    <>
      <OldWorld cam={cam} ca="#F6E3B0">
        {road > 0 && <path d={'M' + pts.map((p) => `${p[0]} ${p[1]}`).join('L')} pathLength={1} fill="none" stroke={RED} strokeWidth={5 / cam.z} strokeDasharray="1 1" strokeDashoffset={1 - road} strokeLinecap="round" strokeLinejoin="round" />}
        {pts.map((p, i) => <MapPin key={i} x={p[0]} y={p[1]} at={at(i)} z={cam.z} r={0.72} c={i === 0 || i === 20 ? RED : '#E8862A'} />)}
      </OldWorld>
      <Full>
        <MapTag x={1010} y={170} anchor="start" text={`${year} · MISSIONS ${n} / 21`} k={springPop(g, 30)} size={38} />
        <MapTag x={sd.x + 150} y={sd.y + 24} text="SAN DIEGO" k={springPop(f, k === 2 ? wordAt(s, 'Diego') : gw(s, k, 0, 'marched') + 14)} size={28} bg={PAPER} c={INK} />
        <MapTag x={so.x + 130} y={so.y - 34} text="SONOMA" k={springPop(f, gw(s, k, 2, 'Sonoma'))} size={28} bg={PAPER} c={INK} />
        <MapTag x={1010} y={250} anchor="start" text="EL CAMINO REAL · THE ROYAL ROAD" k={springPop(f, gw(s, k, 2, 'Camino'))} size={32} bg={RED} />
        <FlyIn g={g} x={1620} y={560} arm={k === 1 ? 'finger' : 'point'} expr="grin" talking={talk(s)} />
      </Full>
    </>
  );
};

// c040-c043: fishing rod reels down the city names. Spain's to-do list on road signs.
const SIGNS = [{ b: 0, w: 'San', t: 'SAN DIEGO' }, { b: 1, w: 'Santa', t: 'SANTA BARBARA' }, { b: 1, w: 'San', t: 'SAN FRANCISCO' }];
const Cities: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const { k } = useGroup(s);
  const X = 1500, CXS = 1085;
  const arm: [number, number] = [128, 18];
  const h = hostLeftHand(X, Y, 1, arm);
  const Wd = SIGNS.map((sg) => gw(s, k, sg.b, sg.w));
  const slots = [330, 470, 610];
  const todo = gw(s, k, 3, 'to-do');
  let ang = -20;
  Wd.forEach((w) => { const c = w - 14; if (f >= c && f < c + 12) ang = f < c + 5 ? interpolate(f, [c, c + 5], [-20, 25]) : interpolate(f, [c + 5, c + 12], [25, -46], Easing.out); else if (f >= c + 12) ang = -46; });
  const fishing = k < 2;
  const crook = along(h.x, h.y, ang, 470);
  const cards = Wd.map((w, i) => {
    const t = f - (w - 2); if (t < 0) return null;
    const yy = interpolate(t, [0, 16], [-140, slots[i]], Easing.out);
    const swing = t > 16 ? Math.sin((t - 16) / 3) * 10 * Math.exp(-(t - 16) / 12) : 6;
    return { i, y: yy, swing, line: t < 24 && fishing };
  }).filter(Boolean) as { i: number; y: number; swing: number; line: boolean }[];
  const head = springPop(f, todo - 2);
  return (
    <Stage>
      {head > 0 && <g transform={`translate(${CXS} 215) scale(${head}) rotate(-2)`}><rect x={-165} y={-36} width={330} height={72} rx={10} fill={PAPER} stroke={OL} strokeWidth={5} /><text y={13} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill={RED}>SPAIN’S TO-DO LIST</text></g>}
      {cards.map((c) => <g key={c.i}>
        {c.line && <path d={`M${crook.x} ${crook.y} Q${(crook.x + CXS) / 2} ${Math.min(crook.y, c.y) - 60} ${CXS} ${c.y - 44}`} stroke="#3A3A44" strokeWidth={2.5} fill="none" />}
        <g transform={`rotate(${c.swing} ${CXS} ${c.y - 44})`}>
          <rect x={CXS - 158} y={c.y - 44} width={316} height={88} rx={12} fill="#1E6B3C" stroke={OL} strokeWidth={5} />
          <rect x={CXS - 148} y={c.y - 34} width={296} height={68} rx={8} fill="none" stroke="#fff" strokeWidth={3} />
          <text x={CXS} y={c.y + 12} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#fff">{SIGNS[c.i].t}</text>
          {f >= todo + 6 + c.i * 6 && <g transform={`translate(${CXS + 128} ${c.y - 38}) scale(${springPop(f, todo + 6 + c.i * 6)})`}><circle r={22} fill={GOLD} stroke={OL} strokeWidth={4} /><path d="M-10 0 L-3 9 L11 -9" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>}
        </g>
      </g>)}
      {fishing ? <><Host x={X} keys={[{ at: 0, arm: 'present', expr: 'grin' }]} talking={talk(s)} staffMode="none" leftArm={arm} /><Staff hx={h.x} hy={h.y} ang={ang} gripTop={470} /></>
        : <Host x={X} keys={k === 2 ? [{ at: 0, arm: 'present', expr: 'smile' }] : [{ at: 0, arm: 'present', expr: 'smile' }, { at: todo, arm: 'finger', expr: 'grin' }]} talking={talk(s)} />}
      {fishing && Wd.map((w, i) => (f >= w - 14 && f < w - 2 ? <path key={i} d={`M${crook.x} ${crook.y} L${crook.x - 60} -40`} stroke="#3A3A44" strokeWidth={2.5} /> : null))}
    </Stage>
  );
};

// c044-c048 (quiet): inside the mission walls. Still, no narrator tricks; the candles go out.
const Walls: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const { g, gd, k } = useGroup(s);
  const lit = k < 2 ? 9 : k === 2 ? 9 - Math.floor(interpolate(f, [10, d], [0, 3.99])) : k === 3 ? 6 - Math.floor(interpolate(f, [0, d], [0, 4.99])) : f < 24 ? 1 : 0;
  const dark = interpolate(g, [0, gd * 0.55, gd], [0.05, 0.3, 0.55]);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1, focus: [960, 560] }}>
      <g transform={`translate(960 560) scale(${1 + (g / gd) * 0.07}) translate(-960 -560)`}>
        <rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDawn)" />
        <Hills y={600} fill="#8C7F6A" amp={90} seed="mw1" stroke={false} />
        <rect x={-200} y={760} width={2400} height={500} fill="#A58F6A" />
        {/* bell wall and church */}
        <path d="M250 780 L250 330 Q250 280 300 280 L470 280 Q520 280 520 330 L520 780 Z" fill="#EADBB8" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
        {[[385, 380], [330, 510], [440, 510]].map(([x, y], i) => <g key={i}><path d={`M${x - 36} ${y + 50} L${x - 36} ${y} Q${x} ${y - 46} ${x + 36} ${y} L${x + 36} ${y + 50} Z`} fill="#5E4A3A" stroke={OL} strokeWidth={4} /><path d={`M${x - 16} ${y + 34} Q${x - 18} ${y + 2} ${x} ${y - 4} Q${x + 18} ${y + 2} ${x + 16} ${y + 34} Z`} fill="#B58A3A" stroke={OL} strokeWidth={3} /></g>)}
        <path d="M385 280 v-70 M360 236 h50" stroke={OL} strokeWidth={8} strokeLinecap="round" />
        <rect x={520} y={470} width={1500} height={310} fill="#EADBB8" stroke={OL} strokeWidth={5} />
        <path d="M506 470 h1540 l-20 -46 h-1500 Z" fill="#B5553A" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
        {[...Array(12)].map((_, i) => <path key={i} d={`M${560 + i * 124} 424 v46`} stroke="#8A3A26" strokeWidth={3} />)}
        <path d="M900 780 L900 600 Q980 520 1060 600 L1060 780 Z" fill="#5A3E26" stroke={OL} strokeWidth={5} /><path d="M980 560 V780 M900 660 H1060" stroke="#3B2A1A" strokeWidth={5} />
        {[1250, 1480, 1710].map((x) => <rect key={x} x={x} y={560} width={70} height={90} rx={30} fill="#3B2A1A" stroke={OL} strokeWidth={4} />)}
        {/* candles */}
        {[...Array(9)].map((_, i) => { const x = 620 + i * 110, on = i < lit; return (
          <g key={i} transform={`translate(${x} 860)`}>
            {on && <circle cy={-46} r={46} fill="url(#warmGlow)" opacity={0.8} />}
            <rect x={-9} y={-34} width={18} height={40} rx={3} fill="#F1E8D2" stroke={OL} strokeWidth={3} />
            {on ? <path d={`M0 -64 Q${8 + Math.sin(f / 4 + i) * 2} -48 0 -36 Q${-8 + Math.sin(f / 4 + i) * 2} -48 0 -64 Z`} fill="#FFB21E" stroke={OL} strokeWidth={2} /> : <path d={`M0 -38 q${4 + Math.sin(f / 9 + i) * 3} -14 0 -28 q-5 -12 2 -24`} stroke="#D9D4C8" strokeWidth={3} fill="none" opacity={0.5} />}
          </g>); })}
        <rect x={-200} y={-200} width={2400} height={1500} fill="#101018" opacity={dark} />
      </g>
    </CameraRig>
  );
};

// c049-c050 (quiet): rush number one.
const Rush1: React.FC<SP> = ({ s }) => {
  const { g } = useGroup(s);
  const a = interpolate(g, [8, 30], [0, 1]);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02, focus: [1300, 500] }}>
      <GreyStage dim={0.28} />
      <Layer depth={1}>
        <g transform="translate(1100 470)" opacity={a}>
          <rect x={-180} y={-120} width={360} height={240} rx={14} fill="#26343A" stroke={OL} strokeWidth={6} />
          <text y={-46} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill={GOLD}>RUSH No. 1</text>
          <path d="M-120 -16 h240" stroke="#8A6A44" strokeWidth={4} />
          <text y={36} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#F4ECD8">SOULS</text>
          <text y={82} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#F4ECD8">AND EMPIRE</text>
        </g>
        <Host x={1500} keys={[{ at: 0, arm: 'idle', expr: 'worried' }]} talking={talk(s)} dim={0.28} />
      </Layer>
    </CameraRig>
  );
};

export const SHOTS_SPAIN: ShotMap = { sp_cabrillo: Cabrillo, sp_react: React_, sp_wait: Wait, sp_drake: Drake, sp_woke: Woke, sp_russia: Russia, sp_missions: Missions, sp_cities: Cities, sp_walls: Walls, sp_rush1: Rush1 };
