import React from 'react';
import { useCurrentFrame, interpolate, onTwos, isBlinking, mouthState, Easing, poseSpring, followThrough, springPop } from '../lib/core';

// Arm pose = [shoulder angle, elbow bend] in degrees. 0 = hanging straight down, 180 = straight up.
export const ARM_POSES: Record<string, [number, number]> = {
  idle: [18, 14],
  point: [92, 4],
  finger: [32, 128],
  shrug: [62, 105],
  wave: [150, 25],
  present: [70, 35],
  fist: [168, 4],
  hip: [40, -95],
  chin: [25, 150],
};

export type HostKey = { at: number; arm?: string; expr?: string };

type Props = {
  x?: number;
  y?: number; // ground line
  scale?: number;
  keys?: HostKey[]; // pose keyframes (local frames)
  talking?: [number, number][]; // frame ranges where the mouth flaps
  hatOff?: boolean;
  dim?: number; // 0..1 shading when the stage dims
  seed?: string;
};

const LINE = '#151515';

function armPath(sx: number, sy: number, side: 1 | -1, a1: number, a2: number, up = 88, lo = 82) {
  const r1 = (a1 * Math.PI) / 180;
  const ex = sx + Math.sin(r1) * up * side;
  const ey = sy + Math.cos(r1) * up;
  const r2 = ((a1 + a2) * Math.PI) / 180;
  const hx = ex + Math.sin(r2) * lo * side;
  const hy = ey + Math.cos(r2) * lo;
  return { ex, ey, hx, hy, ang: a1 + a2 };
}

function poseAt(frame: number, keys: HostKey[], field: 'arm' | 'expr', def: string) {
  let cur = def, prev = def, at = -999;
  for (const k of keys) {
    const v = k[field];
    if (v === undefined) continue;
    if (k.at <= frame) { prev = cur; cur = v; at = k.at; }
  }
  return { cur, prev, since: frame - at };
}

export const Host: React.FC<Props> = ({ x = 1130, y = 960, scale = 1, keys = [], talking = [], hatOff = false, dim = 0, seed = 'host' }) => {
  const frame = useCurrentFrame();
  const f2 = onTwos(frame);
  const arm = poseAt(f2, keys, 'arm', 'idle');
  const ex = poseAt(frame, keys, 'expr', 'normal');
  const A = ARM_POSES[arm.cur] ?? ARM_POSES.idle;
  const P = ARM_POSES[arm.prev] ?? ARM_POSES.idle;
  // spring-driven snap: fast, natural overshoot, settles
  const t = poseSpring(arm.since);
  // follow-through on loose parts (turban tail, staff cloth) and a little head lag after each arm move
  const ft2 = followThrough(arm.since, 16, 10, 9);
  let a1 = P[0] + (A[0] - P[0]) * t;
  let a2 = P[1] + (A[1] - P[1]) * t;
  if (arm.cur === 'wave') a2 += Math.sin(f2 / 3) * 22;

  const isTalking = talking.some(([s, e]) => frame >= s && frame < e);
  const m = mouthState(frame, isTalking, seed);
  const blink = isBlinking(frame, seed);
  const expr = ex.cur;
  const exprPop = (ex.cur === 'shock' || ex.cur === 'grin') && ex.since >= 0 && ex.since < 60 ? 1 + 0.2 * Math.exp(-ex.since / 4) * Math.cos(ex.since * 0.9) : 1;

  const sh = { x: 0, y: -380 };
  const R = armPath(sh.x, sh.y, 1, a1, a2);
  const L = armPath(sh.x, sh.y, -1, 42, 12, 80, 66); // holds the staff
  const breathe = Math.sin(f2 / 14) * 1.5;

  const skin = dim > 0 ? mix('#F6D2A8', '#8C7A66', dim) : '#F6D2A8';

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g filter="url(#wobble)">
        {/* staff */}
        <g transform={`translate(${L.hx} 0)`}>
          <line x1={0} y1={-600} x2={4} y2={10} stroke="#6B4A2B" strokeWidth={10} strokeLinecap="round" />
          <line x1={0} y1={-600} x2={4} y2={10} stroke={LINE} strokeWidth={14} strokeLinecap="round" opacity={0.0} />
          <path d="M-6 -600 q6 -24 14 -6" stroke="#6B4A2B" strokeWidth={9} fill="none" strokeLinecap="round" />
          {/* prayer cloth tied near top */}
          <g transform={`rotate(${ft2 * 0.8 + Math.sin(f2 / 9) * 3} 2 -560)`}>
            <path d="M2 -560 q16 4 30 22 l-12 8 q-8 -14 -18 -16 z" fill="#E8862A" stroke={LINE} strokeWidth={2.5} />
          </g>
          <rect x={-6} y={-566} width={14} height={10} rx={3} fill="#3B2A1A" />
        </g>
        {/* legs */}
        <path d="M0 -215 L-14 -110 L-38 0" stroke={LINE} strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0 -215 L16 -110 L36 0" stroke={LINE} strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-38 0 L-60 2 M36 0 L58 3" stroke={LINE} strokeWidth={4.5} strokeLinecap="round" />
        {/* body */}
        <path d={`M0 ${-408 + breathe} L0 -215`} stroke={LINE} strokeWidth={4.5} strokeLinecap="round" />
        {/* waist cloth (patuka) in dhaka pattern */}
        <path d="M-30 -236 L32 -240 L42 -172 Q6 -160 -38 -172 Z" fill="#F1E6D0" stroke={LINE} strokeWidth={3.5} strokeLinejoin="round" />
        <path d="M-2 -236 Q4 -200 -2 -166" stroke="#D8C6A0" strokeWidth={3} fill="none" />
        <path d="M-36 -236 L36 -240 L37 -224 L-36 -220 Z" fill="#E8862A" stroke={LINE} strokeWidth={3} />
        {/* sash */}
        <path d="M-10 -396 L10 -398 L22 -244 L4 -240 Z" fill="#8C1D18" stroke={LINE} strokeWidth={3} strokeLinejoin="round" transform="rotate(-16 0 -310)" />
        <path d="M0 -384 l4 12 M3 -356 l4 12 M6 -328 l4 12 M9 -300 l4 12 M12 -272 l4 12" stroke="#E2B13C" strokeWidth={2.5} transform="rotate(-16 0 -310)" />
        {/* arms */}
        <path d={`M${sh.x} ${sh.y} L${L.ex} ${L.ey} L${L.hx} ${L.hy}`} stroke={LINE} strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={L.hx} cy={L.hy} r={9} fill={skin} stroke={LINE} strokeWidth={3} />
        <path d={`M${sh.x} ${sh.y} L${R.ex} ${R.ey} L${R.hx} ${R.hy}`} stroke={LINE} strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Hand x={R.hx} y={R.hy} ang={R.ang} pose={arm.cur} />
        {/* head */}
        <g transform={`translate(0 ${breathe}) rotate(${ft2 * 0.12} 0 -410)`}>
          <circle cx={0} cy={-470} r={64} fill={skin} stroke={LINE} strokeWidth={4.5} />
          <g transform={`translate(0 -460) scale(${exprPop}) translate(0 460)`}>
            <Face expr={expr} blink={blink} mouth={m} />
          </g>
          {!hatOff && <Safa tail={ft2 + Math.sin(f2 / 11) * 4} />}
        </g>
      </g>
    </g>
  );
};

const Hand: React.FC<{ x: number; y: number; ang: number; pose: string }> = ({ x, y, ang, pose }) => {
  // angle of forearm; draw a little hand + finger for the pointing poses
  const r = (ang * Math.PI) / 180;
  const dx = Math.sin(r), dy = Math.cos(r);
  if (pose === 'point' || pose === 'finger') {
    return <path d={`M${x} ${y} l${dx * 22} ${dy * 22}`} stroke={LINE} strokeWidth={4} strokeLinecap="round" />;
  }
  if (pose === 'present' || pose === 'shrug' || pose === 'wave') {
    return (
      <g stroke={LINE} strokeWidth={3.5} strokeLinecap="round">
        <path d={`M${x} ${y} l${dx * 16 + 8} ${dy * 16 - 6}`} />
        <path d={`M${x} ${y} l${dx * 18} ${dy * 18}`} />
        <path d={`M${x} ${y} l${dx * 16 - 8} ${dy * 16 + 6}`} />
      </g>
    );
  }
  return <circle cx={x} cy={y} r={2.5} fill={LINE} />;
};

const Face: React.FC<{ expr: string; blink: boolean; mouth: number }> = ({ expr, blink, mouth }) => {
  if (expr === 'shock') {
    return (
      <g>
        <circle cx={-22} cy={-484} r={19} fill="#fff" stroke={LINE} strokeWidth={3.5} />
        <circle cx={24} cy={-484} r={19} fill="#fff" stroke={LINE} strokeWidth={3.5} />
        <circle cx={-20} cy={-482} r={4} fill={LINE} />
        <circle cx={22} cy={-482} r={4} fill={LINE} />
        <ellipse cx={1} cy={-438} rx={13} ry={17} fill={LINE} />
      </g>
    );
  }
  if (expr === 'grin') {
    return (
      <g>
        <path d="M-30 -488 q8 -8 16 0 M14 -488 q8 -8 16 0" stroke={LINE} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M-38 -452 Q0 -448 38 -452 Q32 -414 0 -412 Q-32 -414 -38 -452 Z" fill="#fff" stroke={LINE} strokeWidth={3.5} />
        <path d="M-36 -440 Q0 -434 36 -440 M-20 -452 V-414 M-6 -451 V-412 M8 -451 V-412 M22 -452 V-415" stroke={LINE} strokeWidth={2} fill="none" />
      </g>
    );
  }
  const eyes = blink ? (
    <path d="M-28 -482 h14 M16 -482 h14" stroke={LINE} strokeWidth={3.5} strokeLinecap="round" />
  ) : (
    <g>
      <circle cx={-21} cy={-482} r={5.5} fill={LINE} />
      <circle cx={23} cy={-482} r={5.5} fill={LINE} />
    </g>
  );
  const brows =
    expr === 'worried' ? <path d="M-32 -500 l18 -6 M14 -506 l18 6" stroke={LINE} strokeWidth={3.5} strokeLinecap="round" /> :
    expr === 'proud' ? <path d="M-32 -502 q9 -6 18 0 M14 -502 q9 -6 18 0" stroke={LINE} strokeWidth={3.5} fill="none" strokeLinecap="round" /> : null;
  let mouthEl;
  if (expr === 'smile' || expr === 'proud') {
    mouthEl = mouth === 2 ? <path d="M-16 -448 Q0 -420 16 -448 Z" fill={LINE} /> : <path d="M-16 -446 Q0 -430 16 -446" stroke={LINE} strokeWidth={4} fill="none" strokeLinecap="round" />;
  } else if (expr === 'worried') {
    mouthEl = <path d="M-12 -436 Q0 -446 12 -436" stroke={LINE} strokeWidth={4} fill="none" strokeLinecap="round" />;
  } else {
    mouthEl = mouth === 0 ? <ellipse cx={1} cy={-442} rx={7} ry={3.5} fill={LINE} /> : mouth === 1 ? <ellipse cx={1} cy={-442} rx={9} ry={8} fill={LINE} /> : <ellipse cx={1} cy={-441} rx={10} ry={13} fill={LINE} />;
  }
  return <g>{eyes}{brows}{mouthEl}</g>;
};

export const Topi: React.FC<{ x?: number; y?: number; s?: number }> = ({ x = 0, y = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* dhaka topi: slanted top, taller on one side */}
    <path d="M-63 -500 Q0 -514 63 -500 L58 -578 Q30 -592 8 -572 Q-20 -560 -52 -550 Z" fill="url(#dhaka)" stroke={LINE} strokeWidth={4.5} strokeLinejoin="round" />
    <path d="M8 -572 Q14 -548 10 -530" stroke={LINE} strokeWidth={2.5} fill="none" opacity={0.6} />
  </g>
);

function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const c = [16, 8, 0].map((sft) => Math.round(((pa >> sft) & 255) * (1 - t) + ((pb >> sft) & 255) * t));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}
export { mix };

/** Rajasthani-style safa turban with a loose tail that swings with follow-through. */
export const Safa: React.FC<{ tail?: number }> = ({ tail = 0 }) => (
  <g>
    <g transform={`rotate(${tail} 54 -520)`}>
      <path d="M50 -522 Q86 -490 78 -420 Q66 -428 60 -440 Q66 -480 40 -508 Z" fill="#E8862A" stroke={LINE} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M58 -500 Q70 -470 66 -440" stroke="#C0631C" strokeWidth={3} fill="none" />
    </g>
    <path d="M-66 -500 Q-74 -560 -20 -582 Q30 -600 62 -566 Q76 -540 66 -500 Q0 -516 -66 -500 Z" fill="#E8862A" stroke={LINE} strokeWidth={4.5} strokeLinejoin="round" />
    <path d="M-62 -512 Q0 -560 64 -530 M-58 -532 Q-6 -574 52 -562 M-40 -556 Q10 -586 40 -578" stroke="#C0631C" strokeWidth={4} fill="none" />
    <path d="M-66 -500 Q0 -516 66 -500" stroke="#B3261E" strokeWidth={6} fill="none" />
    <circle cx={-34} cy={-548} r={7} fill="#E2B13C" stroke={LINE} strokeWidth={2.5} />
  </g>
);
