/**
 * "What If the British Never Came?" — a 9:16 Short (1080×1920).
 *
 * Layout for Shorts: the top ~120 px and the bottom ~420 px are covered by YouTube's UI, and the
 * right edge by the like/comment buttons, so the action lives in x 60–960, y 250–1150 and the
 * word-by-word captions sit at y ≈ 1230–1420.
 */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, spring, springPop, gravityDrop, projectile, topple, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Host } from '@engine/characters/Host';
import { Chibi } from '@engine/characters/Chibi';
import { OL, Hills, Cloud } from '@engine/scenes/Parts';
import { KingdomMap, GdpPie, Camel, KINGDOMS, subPath } from '@engine/scenes/India';
import { Factory, Loom } from '@engine/scenes/IndiaB3';
import { wordAt, type ShotMap, type SP } from '@engine/kit';
import type { Shot } from '@engine/types';

const W = 1080, H = 1920;
const talk = (s: Shot): [number, number][] => [[0, s.dur]];

// ------------------------------------------------------------------ backgrounds
const Sunburst: React.FC<{ c1?: string; c2?: string; spin?: number }> = ({ c1 = '#FFD27A', c2 = '#F2A93B', spin = 0.15 }) => {
  const f = useCurrentFrame();
  const n = 18;
  return (
    <Layer depth={0}>
      <defs><radialGradient id="sbg" cx="50%" cy="38%" r="70%"><stop offset="0%" stopColor={c1} /><stop offset="100%" stopColor={c2} /></radialGradient></defs>
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="url(#sbg)" />
      <g transform={`translate(540 760) rotate(${f * spin})`}>
        {[...Array(n)].map((_, i) => {
          const a0 = (i / n) * Math.PI * 2, a1 = ((i + 0.5) / n) * Math.PI * 2, R = 2000;
          return <path key={i} d={`M0 0 L${R * Math.cos(a0)} ${R * Math.sin(a0)} L${R * Math.cos(a1)} ${R * Math.sin(a1)} Z`} fill="#fff" opacity={0.13} />;
        })}
      </g>
    </Layer>
  );
};
const Stage: React.FC<{ dim?: number }> = ({ dim = 0 }) => (
  <Layer depth={0}>
    <defs><radialGradient id="stg" cx="50%" cy="40%" r="75%"><stop offset="0%" stopColor="#D2D2D2" /><stop offset="100%" stopColor="#A9A9A9" /></radialGradient></defs>
    <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="url(#stg)" />
    {dim > 0 && <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#000" opacity={dim} />}
  </Layer>
);
const Dark: React.FC<{ glow?: string }> = ({ glow = '#3E6B4E' }) => (
  <Layer depth={0}>
    <defs><radialGradient id="drk" cx="50%" cy="36%" r="70%"><stop offset="0%" stopColor={glow} /><stop offset="100%" stopColor="#101E16" /></radialGradient></defs>
    <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="url(#drk)" />
  </Layer>
);
const Outdoors: React.FC<{ ground?: number; sky?: string; earth?: string }> = ({ ground = 1060, sky = 'url(#skyDay)', earth = '#C9A66B' }) => (
  <>
    <Layer depth={0}>
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill={sky} />
      <Cloud x={120} y={360} s={0.9} speed={0.3} />
      <Cloud x={700} y={300} s={0.7} speed={0.2} />
    </Layer>
    <Layer depth={0.4}>
      <g transform="scale(0.6) translate(0 760)"><Hills y={ground - 80} fill="#B5B98A" amp={30} seed="sh1" stroke={false} /></g>
    </Layer>
    <Layer depth={1}><rect x={-300} y={ground} width={W + 600} height={H} fill={earth} stroke={OL} strokeWidth={4} /></Layer>
  </>
);

// ------------------------------------------------------------------ small parts
/** HTML label that drops in under gravity and squashes on landing. */
const DropLabel: React.FC<{ at: number; x: number; y: number; text: string; bg?: string; fg?: string; size?: number; rot?: number; h?: number }> = ({ at, x, y, text, bg = '#B3261E', fg = '#fff', size = 64, rot = -4, h = 500 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const d = gravityDrop(f, at, { h, g: 3.2, e: 0.32 });
  return (
    <div style={{ position: 'absolute', left: x, top: y + d.y, transform: `translate(-50%,-100%) rotate(${rot}deg) scale(${d.sx}, ${d.sy})`, transformOrigin: 'center bottom' }}>
      <div style={{ background: bg, color: fg, fontFamily: 'TagBold', fontSize: size, padding: '10px 28px', borderRadius: 14, border: '5px solid #1A1410', boxShadow: '6px 8px 0 rgba(0,0,0,0.25)', whiteSpace: 'nowrap', letterSpacing: 1 }}>{text}</div>
    </div>
  );
};
/** HTML label that springs in at `at`. */
const PopLabel: React.FC<{ at: number; x: number; y: number; text: string; color?: string; size?: number; font?: string; stroke?: number }> = ({ at, x, y, text, color = '#fff', size = 80, font = 'Hand', stroke = 10 }) => {
  const f = useCurrentFrame();
  const k = springPop(f, at);
  if (k <= 0.01) return null;
  return <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${k})`, fontFamily: font, fontSize: size, color, WebkitTextStroke: `${stroke}px #1A1410`, paintOrder: 'stroke fill', whiteSpace: 'nowrap' }}>{text}</div>;
};
const MapSil: React.FC<{ x: number; y: number; s: number; fill?: string }> = ({ x, y, s, fill = '#E8862A' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><path d={subPath()} fill={fill} stroke={OL} strokeWidth={8} strokeLinejoin="round" /></g>
);
/** The narrator in the lower-right of the action area. */
const Narrator: React.FC<{ s: Shot; keys: any[]; x?: number; y?: number; scale?: number }> = ({ s, keys, x = 740, y = 1150, scale = 1.0 }) => (
  <Host x={x} y={y} scale={scale} keys={keys} talking={talk(s)} />
);

// ------------------------------------------------------------------ shots
const H1: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const hit = wordAt(s, 'India?');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.12, zoomTo: 1.0, focus: [540, 760], shakes: [{ at: hit, amp: 12, len: 9 }] }}>
        <Sunburst />
        <Layer depth={1}>
          <MapSil x={150} y={330} s={0.62} fill="#F6E7C8" />
          <Narrator s={s} x={700} y={1160} scale={1.05} keys={[{ at: 0, arm: 'shrug', expr: 'worried' }, { at: hit, arm: 'point', expr: 'shock' }]} />
        </Layer>
      </CameraRig>
      {f >= hit - 2 && (() => {
        const d = gravityDrop(f, hit - 2, { h: 650, g: 3.4, e: 0.45 });
        return <div style={{ position: 'absolute', left: 330, top: 760 + d.y, transform: `translate(-50%,-100%) scale(${d.sx}, ${d.sy}) rotate(-8deg)`, transformOrigin: 'center bottom', fontFamily: 'TagBold', fontSize: 380, color: '#B3261E', WebkitTextStroke: '14px #1A1410', paintOrder: 'stroke fill' }}>?</div>;
      })()}
    </>
  );
};

const H2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const fairy = wordAt(s, 'fairy'), pop = wordAt(s, 'expecting.');
  const grow = springPop(f, fairy);
  const deflate = f < pop ? 1 : Math.max(0, 1 - spring(f - pop, { damping: 9, stiffness: 260, mass: 0.6 }));
  const k = grow * deflate;
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [540, 700], shakes: [{ at: pop, amp: 6, len: 6 }] }}>
      <Stage />
      <Layer depth={1}>
        {k > 0.02 && (
          <g transform={`translate(330 760) scale(${k} ${grow * (f < pop ? 1 : Math.max(0.05, deflate))})`}>
            {/* a pink fairy-tale castle */}
            <rect x={-160} y={-260} width={320} height={260} fill="#F6B8D0" stroke={OL} strokeWidth={6} />
            {[-160, 160].map((x) => <g key={x}><rect x={x - 50} y={-380} width={100} height={380} fill="#F29CBF" stroke={OL} strokeWidth={6} /><path d={`M${x - 64} -380 L${x} -500 L${x + 64} -380 Z`} fill="#8E44AD" stroke={OL} strokeWidth={6} /></g>)}
            <rect x={-40} y={-120} width={80} height={120} rx={40} fill="#6B4A2B" stroke={OL} strokeWidth={5} />
            <path d="M-70 -260 L0 -400 L70 -260 Z" fill="#8E44AD" stroke={OL} strokeWidth={6} />
            {[...Array(6)].map((_, i) => { const a = f * 0.08 + i; return <path key={i} transform={`translate(${Math.cos(a) * 220} ${-250 + Math.sin(a * 1.3) * 160}) scale(${0.6 + 0.4 * Math.sin(f * 0.3 + i)})`} d="M0 -20 L5 -5 L20 0 L5 5 L0 20 L-5 5 L-20 0 L-5 -5 Z" fill="#FFF3A0" stroke={OL} strokeWidth={2} />; })}
          </g>
        )}
        {f >= pop && f < pop + 14 && <g transform={`translate(330 640) scale(${1 + (f - pop) * 0.15})`} opacity={1 - (f - pop) / 14}>{[...Array(10)].map((_, i) => <circle key={i} cx={Math.cos(i * 0.63) * 120} cy={Math.sin(i * 0.63) * 120} r={22} fill="#F6B8D0" stroke={OL} strokeWidth={3} />)}</g>}
        <Narrator s={s} x={790} y={1160} scale={0.95} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at: pop, arm: 'shrug', expr: 'worried' }]} />
      </Layer>
    </CameraRig>
  );
};

const Pie: React.FC<{ s: Shot; from: number; to: number; at: number; label: string }> = ({ s, from, to, at, label }) => {
  const f = useCurrentFrame();
  const k = f < at ? 0 : spring(f - at, { damping: 11, stiffness: 140, mass: 0.8 });
  const share = Math.max(0.004, from + (to - from) * k);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.06, focus: [540, 720], shakes: to < from ? [{ at, amp: 9, len: 8 }] : [] }}>
        <Dark glow={to < from ? '#5A3A2E' : '#3E6B4E'} />
        <Layer depth={1}><GdpPie x={540} y={720} r={330} share={share} label={share > 0.1 ? 'INDIA' : ''} /></Layer>
      </CameraRig>
      <PopLabel at={at} x={540} y={1110} text={`${Math.round(to * 100)}% of world output`} size={58} font="TagBold" color="#FFD84A" stroke={8} />
    </>
  );
};
const P1: React.FC<SP> = ({ s }) => <Pie s={s} from={0} to={0.245} at={wordAt(s, 'quarter')} label="" />;
const P2: React.FC<SP> = ({ s }) => <Pie s={s} from={0.245} to={0.042} at={wordAt(s, '4%.') - 4} label="" />;

const N1: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [540, 760] }}>
      <Stage />
      <Layer depth={1}>
        {[0, 1, 2].map((i) => <Chibi key={i} x={150 + i * 150} y={1120 - (i % 2) * 20} s={0.8} outfit={{ top: ['#2E86C1', '#C0392B', '#27AE60'][i], bottom: '#33415C' }} hat="none" hair="#2A1B12" pose="idle" expr={[{ at: 0, expr: 'normal' }, { at: wordAt(s, 'everybody') + i * 3, expr: 'happy' }]} seed={'nod' + i} />)}
        <Narrator s={s} x={800} keys={[{ at: 0, arm: 'present', expr: 'smile' }]} />
      </Layer>
    </CameraRig>
    <DropLabel at={wordAt(s, 'knows.') - 2} x={330} y={640} text="WELL KNOWN ✓" bg="#2E7D4F" size={56} />
  </>
);
const N2: React.FC<SP> = ({ s }) => {
  const at = wordAt(s, 'skip.');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.0, focus: [700, 640], push: { at: 0, to: 1.35, len: 8 } }}>
        <Stage />
        <Layer depth={1}><Narrator s={s} x={700} keys={[{ at: 0, arm: 'finger', expr: 'proud' }]} /></Layer>
      </CameraRig>
      <DropLabel at={at - 3} x={420} y={560} text="THE PART PEOPLE SKIP" bg="#1A1410" fg="#FFD84A" size={54} rot={3} />
    </>
  );
};

const U1: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'strong,');
  const split = wordAt(s, 'India.');
  const unify = f < split ? 1 : 1 - spring(f - split, { damping: 12, stiffness: 120 });
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [540, 760] }}>
        <Dark />
        <Layer depth={1}><KingdomMap x={70} y={250} s={0.94} unify={f < at ? 0 : unify} wobble={f >= split} /></Layer>
      </CameraRig>
      {f >= at && f < split + 4 && <PopLabel at={at} x={540} y={720} text="UNITED?" size={110} font="TagBold" color="#FFD84A" stroke={12} />}
      {f >= split && <DropLabel at={split} x={540} y={800} text="NOT REALLY" bg="#B3261E" size={72} rot={-6} />}
    </>
  );
};

const Dots: React.FC<{ n: number; cols: number; x: number; y: number; size: number; color: string; at: number; seed: string }> = ({ n, cols, x, y, size, color, at, seed }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {[...Array(n)].map((_, i) => {
        const k = springPop(f, at + (i % cols) * 0.4 + Math.floor(i / cols) * 0.5 + random(seed + i) * 2);
        const c = i % cols, r = Math.floor(i / cols);
        return <g key={i} transform={`translate(${x + c * size * 1.25} ${y + r * size * 1.3}) scale(${k})`}><circle r={size / 2} fill={color} stroke={OL} strokeWidth={3} /><circle cy={-size * 0.12} r={size * 0.22} fill="#F3D2B0" stroke={OL} strokeWidth={2} /></g>;
      })}
    </g>
  );
};
const C1: React.FC<SP> = ({ s }) => {
  const a = wordAt(s, '3,000'), b = wordAt(s, 'against') + 4;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [540, 700], shakes: [{ at: b + 6, amp: 8, len: 8 }] }}>
        <Dark glow="#4A5A3A" />
        <Layer depth={1}>
          <Dots n={6} cols={6} x={330} y={410} size={60} color="#C0392B" at={a} seed="sm" />
          <Dots n={100} cols={10} x={190} y={640} size={52} color="#2E6B4A" at={b - 4} seed="bg" />
        </Layer>
      </CameraRig>
      <PopLabel at={a} x={540} y={330} text="CLIVE: 3,000" size={60} font="TagBold" color="#FF8A7A" stroke={8} />
      <PopLabel at={b} x={540} y={570} text="BENGAL: 50,000" size={60} font="TagBold" color="#8EE0A8" stroke={8} />
    </>
  );
};

const C2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const buy = wordAt(s, 'buying');
  const d = gravityDrop(f, buy, { h: 600, g: 3.0, e: 0.3 });
  const landed = f >= buy && d.bounces > 0;
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.06, focus: [540, 760], shakes: [{ at: buy + 19, amp: 7, len: 7 }] }}>
      <Outdoors />
      <Layer depth={1}>
        <Chibi x={260} y={1080} s={1.15} outfit={{ top: '#C0392B', bottom: '#F4F7FA', belt: '#1A1410' }} hat="tricorn" hair="#2A1B12" pose={[{ at: 0, pose: 'idle' }, { at: buy - 6, pose: 'pass' }]} expr="happy" talking={[]} seed="clive" />
        <Chibi x={760} y={1080} s={1.15} outfit={{ top: '#2E6B4A', bottom: '#F4E3C0', sash: '#E2B13C' }} hat="pagri" hatColor="#E2B13C" mustache pose={[{ at: 0, pose: 'cross' }, { at: buy + 18, pose: 'carry' }]} expr={[{ at: 0, expr: 'determined' }, { at: buy + 20, expr: 'grin' }]} talking={[]} seed="mirj" flip />
        {f >= buy && (
          <g transform={`translate(700 ${880 + d.y}) scale(${d.sx * 1.2} ${d.sy * 1.2})`}>
            <path d="M-60 0 Q-75 -90 -20 -110 L-28 -130 L28 -130 L20 -110 Q75 -90 60 0 Z" fill="#C99A5E" stroke={OL} strokeWidth={5} />
            <text x={0} y={-35} textAnchor="middle" fontFamily="TagBold" fontSize={56} fill="#F2C230" stroke={OL} strokeWidth={3}>₹</text>
          </g>
        )}
        {landed && [...Array(8)].map((_, i) => {
          const p = projectile(f, buy + 19, [700, 860], [(random('cv' + i) - 0.5) * 18, -12 - random('cy' + i) * 8], 1.3, { y: 1080, e: 0.35, mu: 0.6 });
          return <ellipse key={i} cx={p.x} cy={p.y} rx={13} ry={p.landed ? 5 : 13} fill="#F2C230" stroke={OL} strokeWidth={2} />;
        })}
      </Layer>
    </CameraRig>
  );
};

const K1: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const c = wordAt(s, 'cracked');
  const draw = interpolate(f, [c, c + 10], [1, 0], Easing.out);
  const cracks = ['M420 250 L470 420 L430 560 L500 700 L470 860 L520 1050', 'M200 500 L330 560 L470 560', 'M500 700 L650 650 L760 720', 'M470 860 L330 920 L260 1000'];
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05, focus: [540, 760], shakes: [{ at: c, amp: 14, len: 10 }] }}>
      <Dark glow="#5A3A2E" />
      <Layer depth={1}>
        <KingdomMap x={70} y={250} s={0.94} wobble={false} />
        {f >= c && cracks.map((d, i) => <path key={i} d={d} fill="none" stroke="#1A1410" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1200" strokeDashoffset={1200 * draw} />)}
      </Layer>
    </CameraRig>
  );
};

const K2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const d = useDuration();
  const x = interpolate(f, [0, d], [380, 900]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.05, zoomTo: 1.0, focus: [540, 900] }}>
        <Outdoors earth="#D9B77A" sky="url(#skyDawn)" />
        <Layer depth={1}>
          {[0, 1, 2].map((i) => <Camel key={i} x={x - i * 230} y={1070} s={0.75} walk phase={i * 5} />)}
          <Chibi x={x + 150} y={1070} s={1.0} outfit={{ top: '#7A2E2E', bottom: '#3A2A22', robe: true, trim: '#E2B13C' }} hat="nadiri" beard pose="hold" legs="walk" expr="grin" talking={[]} seed="nadir" />
        </Layer>
      </CameraRig>
      <PopLabel at={wordAt(s, 'Shah')} x={540} y={420} text="NADIR SHAH" size={70} font="TagBold" color="#FFD84A" stroke={9} />
    </>
  );
};

const K3: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const hit = wordAt(s, 'crushed');
  const ang = topple(f, hit - 6, { length: 560, g: 2.2, nudge: 0.03, restAngle: 82, e: 0.2 });
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [540, 800], shakes: [{ at: hit + 22, amp: 10, len: 9 }] }}>
        <Outdoors earth="#B99B6A" sky="url(#skyDawn)" />
        <Layer depth={1}>
          <g transform={`translate(380 1065) rotate(${ang})`}>
            <rect x={-10} y={-560} width={20} height={560} fill="#6B4A2B" stroke={OL} strokeWidth={4} />
            {/* saffron swallow-tail banner */}
            <path d={`M10 -555 L230 -520 L170 -470 L230 -420 L10 -400 Z`} fill="#E8862A" stroke={OL} strokeWidth={5} />
          </g>
          <ellipse cx={380} cy={1070} rx={60} ry={14} fill="#000" opacity={0.2} />
        </Layer>
      </CameraRig>
      <PopLabel at={wordAt(s, 'Panipat.')} x={540} y={420} text="PANIPAT, 1761" size={66} font="TagBold" color="#fff" stroke={9} />
    </>
  );
};

const K4: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const m = wordAt(s, 'money'), w = wordAt(s, 'weapons.');
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06, focus: [540, 760] }}>
      <Dark />
      <Layer depth={1}>
        <KingdomMap x={70} y={250} s={0.94} />
        {KINGDOMS.slice(0, 18).map((k, i) => {
          const at = (i % 2 ? w : m) + (i % 6);
          const kk = springPop(f, at);
          if (kk <= 0) return null;
          const x = 70 + k.seed[0] * 0.94, y = 250 + k.seed[1] * 0.94;
          return (
            <g key={i} transform={`translate(${x} ${y - 10}) scale(${kk})`}>
              <circle r={30} fill="#fff" stroke={OL} strokeWidth={4} />
              {i % 2 ? <g transform="rotate(45)"><path d="M0 -22 L5 -14 L5 8 L-5 8 L-5 -14 Z" fill="#D8DEE4" stroke={OL} strokeWidth={2.5} /><path d="M-12 9 H12" stroke={OL} strokeWidth={5} strokeLinecap="round" /><path d="M0 10 V20" stroke="#6B4A2B" strokeWidth={6} strokeLinecap="round" /></g> : <text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill="#C9971C">$</text>}
            </g>
          );
        })}
      </Layer>
    </CameraRig>
  );
};

const S1: React.FC<SP> = ({ s }) => {
  const no = wordAt(s, 'no,'), rich = wordAt(s, 'rich,');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [600, 700] }}>
        <Stage />
        <Layer depth={1}><Narrator s={s} x={780} keys={[{ at: 0, arm: 'finger', expr: 'proud' }, { at: no + 4, arm: 'shrug', expr: 'smile' }, { at: rich, arm: 'finger', expr: 'proud' }]} /></Layer>
      </CameraRig>
      <DropLabel at={no} x={330} y={520} text="NO BRITAIN" bg="#1A1410" fg="#fff" size={52} rot={-3} />
      <PopLabel at={wordAt(s, 'automatically')} x={330} y={640} text="≠" size={150} font="TagBold" color="#B3261E" stroke={10} />
      <DropLabel at={rich} x={330} y={860} text="RICH, FREE INDIA" bg="#2E7D4F" size={50} rot={4} />
    </>
  );
};

const S2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const open = wordAt(s, 'unlocked') - 4;
  // door swings on its hinge: an under-damped spring towards 80°, so it overshoots and settles
  const ang = f < open ? 0 : 80 * spring(f - open, { damping: 5, stiffness: 60, mass: 1 });
  const walk = wordAt(s, 'walks');
  const sx = interpolate(f, [Math.max(walk, open + 6), Math.max(walk, open + 6) + 40], [540, 560], Easing.out);
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.08, focus: [540, 760] }}>
      <Layer depth={0}><rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#3A2A22" /><rect x={-300} y={1080} width={W + 600} height={H} fill="#2A1E18" /></Layer>
      <Layer depth={1}>
        {/* doorway with light behind */}
        <rect x={290} y={420} width={500} height={660} fill="#FFE9B0" stroke={OL} strokeWidth={8} />
        <rect x={290} y={420} width={500} height={660} fill="url(#warmGlow)" opacity={0.6} />
        {f >= open + 4 && <g filter="url(#sil)" opacity={interpolate(f, [open + 4, open + 16], [0, 1])}><Chibi x={sx} y={1075} s={1.3} outfit={{ top: '#333', bottom: '#222' }} hat="tricorn" pose="idle" legs={f > walk && f < walk + 40 ? 'walk' : 'stand'} expr="normal" talking={[]} seed="who" /></g>}
        {/* the door: rotated about its left hinge (drawn as a horizontal squash) */}
        <g transform={`translate(290 420) scale(${Math.cos((ang * Math.PI) / 180)} 1)`}>
          <rect x={0} y={0} width={500} height={660} fill="#7A4E2B" stroke={OL} strokeWidth={8} />
          <rect x={40} y={40} width={420} height={260} fill="none" stroke={OL} strokeWidth={5} />
          <rect x={40} y={340} width={420} height={280} fill="none" stroke={OL} strokeWidth={5} />
          <circle cx={440} cy={340} r={18} fill="#E2B13C" stroke={OL} strokeWidth={4} />
        </g>
        <text x={540} y={380} textAnchor="middle" fontFamily="TagBold" fontSize={48} fill="#FFD84A" opacity={springPop(f, open)}>UNLOCKED</text>
      </Layer>
    </CameraRig>
  );
};

const B1: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const kept = wordAt(s, 'kept');
  const n = Math.max(0, Math.min(6, Math.floor((f - kept + 8) / 6)));
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.03, focus: [540, 760] }}>
      <Layer depth={0}><rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#CDBB92" /><circle cx={820} cy={360} r={80} fill="#F4E2B0" opacity={0.5} /></Layer>
      <Layer depth={1}>
        <rect x={-300} y={1000} width={W + 600} height={H} fill="#B79E73" stroke={OL} strokeWidth={4} />
        {[[120, 1040], [300, 1080], [520, 1050]].map(([x, y], i) => <path key={i} d={`M${x} ${y} l40 20 l-20 30 l50 10`} stroke="#7C6545" strokeWidth={4} fill="none" />)}
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${170 + i * 170} 1000)`}><path d="M-55 -70 L55 -70 L42 0 L-42 0 Z" fill="#C9A66B" stroke={OL} strokeWidth={4} /><ellipse cx={0} cy={-70} rx={55} ry={12} fill="#6B4A2B" stroke={OL} strokeWidth={3} /></g>)}
        {/* the ledger keeps filling */}
        <g transform="translate(640 430) rotate(4)">
          <rect x={0} y={0} width={340} height={450} fill="#F4E9D2" stroke={OL} strokeWidth={5} />
          <text x={170} y={60} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#5A3E26">REVENUE</text>
          {[...Array(n)].map((_, i) => <text key={i} x={40} y={120 + i * 52} fontFamily="Tag" fontSize={36} fill="#3A2A22">£ {(1.2 + i * 0.3).toFixed(1)}m  ✓</text>)}
        </g>
      </Layer>
    </CameraRig>
  );
};

const T1: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const fac = wordAt(s, 'factories'), cot = wordAt(s, 'cotton.');
  const grey = interpolate(f, [fac, fac + 20], [0, 0.7]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04, focus: [540, 760] }}>
        <Outdoors earth="#C9A66B" />
        <Layer depth={1}>
          <g transform="translate(-60 300) scale(0.62)" opacity={1 - grey * 0.8}><Loom x={420} y={1250} s={1.2} /></g>
          <g transform="translate(500 330) scale(0.6)"><Factory x={600} y={1200} s={1.1} /></g>
          {[...Array(5)].map((_, i) => {
            const t = f - fac - i * 8;
            if (t < 0) return null;
            const p = projectile(t, 0, [140, 760], [9, -16], 0.55);
            return p.x < 900 ? <g key={i} transform={`translate(${p.x} ${p.y})`}><circle r={26} fill="#fff" stroke={OL} strokeWidth={3} /><circle cx={-12} cy={-6} r={14} fill="#fff" stroke={OL} strokeWidth={2} /></g> : null;
          })}
        </Layer>
      </CameraRig>
      <PopLabel at={wordAt(s, 'cloth')} x={260} y={1150} text="INDIAN CLOTH" size={46} font="TagBold" color="#fff" stroke={7} />
      <PopLabel at={cot - 6} x={540} y={420} text="→ INDIAN COTTON →" size={50} font="TagBold" color="#FFD84A" stroke={7} />
    </>
  );
};

const Q1: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [600, 700] }}>
      <Stage />
      <Layer depth={1}><Narrator s={s} x={780} keys={[{ at: 0, arm: 'chin', expr: 'smile' }]} /></Layer>
    </CameraRig>
    <DropLabel at={wordAt(s, 'real')} x={320} y={700} text="RICHER?" bg="#E2B13C" fg="#1A1410" size={70} rot={-5} />
  </>
);
const Q2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'one');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.0, focus: [400, 700], push: { at, to: 1.12, len: 10 } }}>
        <Stage />
        <Layer depth={1}>
          <g opacity={0.35}><rect x={190} y={540} width={260} height={110} rx={14} fill="#E2B13C" stroke={OL} strokeWidth={5} transform="rotate(-5 320 595)" /><path d="M170 600 L470 590" stroke="#B3261E" strokeWidth={14} strokeLinecap="round" /></g>
          <g transform={`translate(330 880) scale(${springPop(f, at) * 0.42}) translate(-500 -560)`}><path d={subPath()} fill="#E8862A" stroke={OL} strokeWidth={14} strokeLinejoin="round" /></g>
          <Narrator s={s} x={800} keys={[{ at: 0, arm: 'finger', expr: 'proud' }, { at, arm: 'point', expr: 'grin' }]} />
        </Layer>
      </CameraRig>
      <PopLabel at={at + 4} x={380} y={470} text="ONE COUNTRY?" size={64} font="TagBold" color="#B3261E" stroke={9} />
    </>
  );
};

const Q3: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'forged');
  const unify = f < at ? 0 : spring(f - at, { damping: 14, stiffness: 90 });
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05, focus: [540, 760], shakes: [{ at, amp: 12, len: 8 }] }}>
        <Dark glow="#6B3A1E" />
        <Layer depth={1}>
          <KingdomMap x={70} y={250} s={0.94} unify={unify} wobble={f < at} />
          {f >= at && f < at + 16 && [...Array(14)].map((_, i) => {
            const p = projectile(f, at, [540, 700], [(random('sp' + i) - 0.5) * 30, -10 - random('sq' + i) * 18], 1.4);
            return <circle key={i} cx={p.x} cy={p.y} r={7} fill="#FFD84A" stroke="#E8862A" strokeWidth={2} />;
          })}
        </Layer>
      </CameraRig>
      <PopLabel at={wordAt(s, 'Raj.')} x={540} y={1150} text="VS THE RAJ" size={60} font="TagBold" color="#FFD84A" stroke={8} />
    </>
  );
};

/** Remove the glue: the map's kingdoms fall apart under gravity, each with its own spin. */
const G1: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'glue.');
  const sc = 0.94, ox = 70, oy = 250;
  const bottle = f < at - 10 ? 0 : interpolate(f, [at - 10, at + 6], [0, -700], Easing.in);
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 0.96, focus: [540, 760], shakes: [{ at: at + 2, amp: 8, len: 8 }] }}>
      <Dark />
      <Layer depth={1}>
        <g transform={`translate(${ox} ${oy}) scale(${sc})`}>
          <defs><clipPath id="gclip"><path d={subPath()} /></clipPath></defs>
          {KINGDOMS.map((k, i) => {
            const start = at + 2 + Math.floor(random('gs' + i) * 10);
            const p = projectile(f, start, [0, 0], [(k.seed[0] - 500) * 0.012 + (random('gx' + i) - 0.5) * 3, -4 - random('gy' + i) * 6], 1.4);
            const fall = f >= start;
            const rot = fall ? (f - start) * (random('gr' + i) - 0.5) * 6 : 0;
            return (
              <g key={i} transform={`translate(${fall ? p.x : 0} ${fall ? p.y : 0}) rotate(${rot} ${k.seed[0]} ${k.seed[1]})`}>
                <g clipPath="url(#gclip)"><polygon points={k.poly.map((q) => q.join(',')).join(' ')} fill={k.c} stroke={OL} strokeWidth={3} /></g>
              </g>
            );
          })}
        </g>
        {f < at + 2 && <g transform={`translate(${ox} ${oy}) scale(${sc})`}><path d={subPath()} fill="none" stroke={OL} strokeWidth={6} /></g>}
        {/* glue bottle lifts away */}
        <g transform={`translate(560 ${640 + bottle})`} opacity={bottle < -500 ? 0 : 1}>
          <rect x={-60} y={-120} width={120} height={170} rx={20} fill="#F4F7FA" stroke={OL} strokeWidth={6} />
          <path d="M-20 -120 L-12 -180 L12 -180 L20 -120 Z" fill="#E8862A" stroke={OL} strokeWidth={5} />
          <text x={0} y={-30} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill="#B3261E">GLUE</text>
        </g>
      </Layer>
    </CameraRig>
  );
};

const E1: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'Comment');
  const k = springPop(f, at);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [540, 760] }}>
      <Sunburst c1="#BFE3FF" c2="#5DA9E9" />
      <Layer depth={1}>
        <g transform={`translate(330 640) scale(${k})`}>
          <path d="M-210 -150 H210 Q250 -150 250 -110 V90 Q250 130 210 130 H-40 L-120 210 L-100 130 H-210 Q-250 130 -250 90 V-110 Q-250 -150 -210 -150 Z" fill="#fff" stroke={OL} strokeWidth={8} />
          {[0, 1, 2].map((i) => <circle key={i} cx={-90 + i * 90} cy={-10 + Math.sin(f * 0.4 - i) * 10} r={24} fill="#1A1410" />)}
        </g>
        <Narrator s={s} x={800} keys={[{ at: 0, arm: 'point', expr: 'grin' }]} />
      </Layer>
    </CameraRig>
  );
};

const E2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'Thousand');
  const y = f < at ? 1300 : 1300 - 760 * spring(f - at, { damping: 12, stiffness: 170, mass: 0.7 });
  const pulse = 1 + 0.06 * Math.max(0, Math.sin((f - wordAt(s, 'check')) * 0.5)) * (f > wordAt(s, 'check') ? 1 : 0);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03, focus: [540, 760] }}>
      <Sunburst />
      <Layer depth={1}>
        <g transform={`translate(330 ${y}) rotate(-3)`}>
          <rect x={-270} y={-160} width={540} height={320} rx={16} fill="#1A1410" stroke={OL} strokeWidth={8} />
          <rect x={-252} y={-142} width={504} height={284} rx={8} fill="#C4C4C4" />
          <MapSil x={-230} y={-130} s={0.24} />
          <text x={80} y={-40} textAnchor="middle" fontFamily="Hand" fontSize={52} fill="#141414">1000 Years</text>
          <text x={80} y={20} textAnchor="middle" fontFamily="Hand" fontSize={46} fill="#B3261E">of Indian</text>
          <text x={80} y={74} textAnchor="middle" fontFamily="Hand" fontSize={46} fill="#B3261E">History</text>
          <g transform={`translate(0 220) scale(${pulse})`}>
            <rect x={-190} y={-44} width={380} height={88} rx={44} fill="#B3261E" stroke={OL} strokeWidth={6} />
            <text x={0} y={16} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#fff">▶ FULL VIDEO</text>
          </g>
        </g>
        <Narrator s={s} x={820} keys={[{ at: 0, arm: 'present', expr: 'grin' }]} />
      </Layer>
    </CameraRig>
  );
};

const End: React.FC<SP> = () => (
  <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [540, 760] }}>
    <Sunburst />
    <Layer depth={1}>
      <Host x={560} y={1180} scale={1.05} keys={[{ at: 0, arm: 'wave', expr: 'grin' }]} talking={[]} />
      <text x={540} y={420} textAnchor="middle" fontFamily="Hand" fontSize={120} fill="#fff" stroke="#1A1410" strokeWidth={12} style={{ paintOrder: 'stroke' }}>History Monkey</text>
    </Layer>
  </CameraRig>
);

export const SHOTS: ShotMap = {
  opening: () => null, end: End,
  h1: H1, h2: H2, p1: P1, p2: P2, n1: N1, n2: N2, u1: U1, c1: C1, c2: C2, k1: K1, k2: K2, k3: K3, k4: K4,
  s1: S1, s2: S2, b1: B1, t1: T1, q1: Q1, q2: Q2, q3: Q3, g1: G1, e1: E1, e2: E2,
};

// ------------------------------------------------------------------ overlay: top title, year, word-by-word captions
type Wd = { w: string; em: boolean; at: number };
function chunks(words: Wd[]): Wd[][] {
  const out: Wd[][] = []; let cur: Wd[] = [];
  words.forEach((w) => {
    cur.push(w);
    if (cur.length >= 3 || /[,.?!:;]$/.test(w.w)) { out.push(cur); cur = []; }
  });
  if (cur.length) out.push(cur);
  return out;
}
export const Overlay: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame();
  if (!s.words) return null;
  const cs = chunks(s.words);
  let ci = -1;
  cs.forEach((c, i) => { if (f >= c[0].at - 1) ci = i; });
  const chunk = ci >= 0 ? cs[ci] : null;
  const pop = chunk ? springPop(f, chunk[0].at - 1) : 0;
  const yearK = s.date != null ? springPop(f, s.prevDate === s.date ? -99 : 2) : 0;
  return (
    <>
      {/* series title */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: '#1A1410', color: '#FFD84A', fontFamily: 'TagBold', fontSize: 38, padding: '10px 26px', borderRadius: 40, letterSpacing: 1, border: '3px solid #FFD84A' }}>WHAT IF THE BRITISH NEVER CAME?</div>
      </div>
      {s.date != null && (
        <div style={{ position: 'absolute', left: 60, top: 240, transform: `scale(${yearK})`, transformOrigin: 'left top', background: 'rgba(26,20,16,0.85)', color: '#fff', fontFamily: 'TagBold', fontSize: 52, padding: '6px 22px', borderRadius: 10 }}>{s.date}</div>
      )}
      {/* captions */}
      {chunk && (
        <div style={{ position: 'absolute', left: 50, right: 50, top: 1270, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 46, rowGap: 0, transform: `scale(${0.85 + 0.15 * pop})`, transformOrigin: 'center top' }}>
          {chunk.map((w, i) => {
            const on = f >= w.at - 1;
            const curr = on && (i === chunk.length - 1 || f < chunk[i + 1].at - 1);
            const color = curr ? '#FFD84A' : w.em ? '#FFB347' : '#FFFFFF';
            return (
              <span key={i} style={{ display: 'inline-block', fontFamily: 'Hand', fontSize: 112, lineHeight: 1.15, color, WebkitTextStroke: '14px #1A1410', paintOrder: 'stroke fill', opacity: on ? 1 : 0, transform: `scale(${curr ? 1.08 : 1})` }}>{w.w}</span>
            );
          })}
        </div>
      )}
    </>
  );
};
