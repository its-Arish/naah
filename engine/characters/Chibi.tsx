import React from 'react';
import { useCurrentFrame, interpolate, onTwos, isBlinking, mouthState, poseSpring, followThrough, springPop } from '../lib/core';

const OL = '#2A1B12'; // dark brown outline

export type Outfit = {
  top: string;
  bottom?: string;
  robe?: boolean; // long robe covering legs
  trim?: string;
  belt?: string;
  pattern?: string; // url(#...)
  sash?: string;
  cape?: string;
};

export type ChibiProps = {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  skin?: string;
  outfit: Outfit;
  hat?: string;
  hatColor?: string;
  hair?: string;
  mustache?: boolean;
  beard?: boolean;
  beardColor?: string;
  glasses?: boolean;
  item?: string; // khukuri | spear | brick | scroll | placard:TEXT | flag | musket | notebook | lamp | none
  itemL?: string;
  pose?: string | { at: number; pose: string }[];
  legs?: 'stand' | 'walk' | 'sit' | 'march' | 'kneel';
  expr?: string | { at: number; expr: string }[];
  talking?: [number, number][];
  seed?: string;
  delay?: number; // phase offset for walk cycles / idle
};

// [shoulder, elbow] for right arm, then left arm. 0 = down, 180 = up.
const POSES: Record<string, [number, number, number, number]> = {
  idle: [12, 10, 12, 10],
  hold: [30, 60, 12, 10],
  point: [90, 0, 14, 8],
  raise: [160, 10, 12, 10],
  bothUp: [160, 10, 160, 10],
  cheer: [150, 30, 150, 30],
  present: [70, 40, 20, 10],
  cross: [50, 110, 50, 110],
  carry: [70, 70, 70, 70],
  attack: [130, 40, 40, 30],
  pass: [80, 20, 80, 20],
  scribble: [55, 85, 60, 90],
  hipAngry: [45, -100, 45, -100],
  pray: [35, 120, 35, 120],
  shrug: [60, 110, 60, 110],
  fist: [165, 0, 15, 10],
  wave: [150, 20, 12, 10],
  pull: [120, 30, 120, 30],
  chin: [20, 150, 12, 10],
};

function pick<T extends string>(v: T | { at: number }[] | undefined, frame: number, key: string, def: string) {
  if (!v) return { cur: def, prev: def, since: 999 };
  if (typeof v === 'string') return { cur: v, prev: v, since: 999 };
  let cur = def, prev = def, at = -999;
  for (const k of v as any[]) if (k.at <= frame) { prev = cur; cur = k[key]; at = k.at; }
  return { cur, prev, since: frame - at };
}

function limb(sx: number, sy: number, side: number, a1: number, a2: number, up: number, lo: number) {
  const r1 = (a1 * Math.PI) / 180;
  const ex = sx + Math.sin(r1) * up * side;
  const ey = sy + Math.cos(r1) * up;
  const r2 = ((a1 + a2) * Math.PI) / 180;
  return { ex, ey, hx: ex + Math.sin(r2) * lo * side, hy: ey + Math.cos(r2) * lo, ang: a1 + a2 };
}

export const Chibi: React.FC<ChibiProps> = (p) => {
  const frame = useCurrentFrame();
  const f2 = onTwos(frame + (p.delay ?? 0));
  const seed = p.seed ?? 'c' + p.x;
  const skin = p.skin ?? '#E8B88A';
  const o = p.outfit;
  const ps = pick(p.pose as any, onTwos(frame), 'pose', 'idle');
  const A = POSES[ps.cur] ?? POSES.idle;
  const B = POSES[ps.prev] ?? POSES.idle;
  const t = poseSpring(ps.since);
  const ftc = followThrough(ps.since, 14, 9, 8);
  const ang = A.map((v, i) => B[i] + (v - B[i]) * t);
  const ex = pick(p.expr as any, frame, 'expr', 'normal');
  const legs = p.legs ?? 'stand';

  // walk / march cycle
  const cyc = legs === 'walk' || legs === 'march' ? Math.sin(f2 / 2.6) : 0;
  const bob = legs === 'walk' || legs === 'march' ? Math.abs(Math.sin(f2 / 2.6)) * -7 : legs === 'kneel' ? 40 : Math.sin(f2 / 16) * 1.2;
  const lean = legs === 'walk' || legs === 'march' ? 4 : 0;
  if (legs === 'march') { ang[0] = 25 + cyc * 20; ang[2] = 25 - cyc * 20; }

  const isTalking = (p.talking ?? []).some(([s, e]) => frame >= s && frame < e);
  const m = mouthState(frame, isTalking, seed);
  const blink = isBlinking(frame, seed);
  const shoulderY = -170;
  const R = limb(26, shoulderY, 1, ang[0], ang[1], 40, 38);
  const L = limb(-26, shoulderY, -1, ang[2], ang[3], 40, 38);
  const sleeve = o.top;
  const popE = (ex.cur === 'shock' || ex.cur === 'grin') && ex.since >= 0 && ex.since < 60 ? 1 + 0.2 * Math.exp(-ex.since / 4) * Math.cos(ex.since * 0.9) : 1;

  const legEls = legs === 'kneel' ? (
    <g>
      <path d="M-26 -92 L26 -92 L30 -56 L-30 -56 Z" fill={o.bottom ?? '#E9E1CF'} stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M-30 -60 L30 -60 L36 -40 L-44 -40 Z" fill={o.bottom ?? '#E9E1CF'} stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />
    </g>
  ) : legs === 'sit' ? (
    <g>
      <path d="M-26 -88 Q-10 -60 30 -66 L40 -50 Q-20 -40 -40 -70 Z" fill={o.bottom ?? '#E9E1CF'} stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M26 -88 Q10 -60 -30 -66 L-40 -50 Q20 -40 40 -70 Z" fill={o.bottom ?? '#E9E1CF'} stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />
    </g>
  ) : (
    <g>
      <Leg x={-15} swing={cyc * 22} color={o.bottom ?? '#E9E1CF'} />
      <Leg x={15} swing={-cyc * 22} color={o.bottom ?? '#E9E1CF'} />
    </g>
  );

  return (
    <g transform={`translate(${p.x} ${p.y}) scale(${(p.flip ? -1 : 1) * (p.s ?? 1)} ${p.s ?? 1})`}>
      <g transform={`translate(0 ${bob}) rotate(${lean} 0 -90)`}>
        {o.cape && <path d="M-34 -176 Q-58 -80 -48 -20 L48 -20 Q58 -80 34 -176 Z" fill={o.cape} stroke={OL} strokeWidth={3.5} />}
        {!o.robe && legEls}
        {/* back arm */}
        <Arm l={L} sx={-26} sy={shoulderY} color={sleeve} skin={skin} />
        {p.itemL && <Item kind={p.itemL} x={L.hx} y={L.hy} ang={L.ang} side={-1} frame={f2} />}
        {/* torso */}
        {o.robe ? (
          <path d="M-32 -178 Q0 -188 32 -178 L48 -6 Q0 6 -48 -6 Z" fill={o.top} stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />
        ) : (
          <path d="M-32 -178 Q0 -188 32 -178 L40 -86 Q0 -78 -40 -86 Z" fill={o.top} stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />
        )}
        {o.pattern && <path d={o.robe ? 'M-28 -170 L28 -170 L42 -12 L-42 -12 Z' : 'M-28 -170 L28 -170 L35 -92 L-35 -92 Z'} fill={o.pattern} opacity={0.55} />}
        {o.trim && <path d={o.robe ? 'M-6 -180 L-6 -4' : 'M-6 -180 L-14 -86'} stroke={o.trim} strokeWidth={8} />}
        {o.sash && <path d="M-28 -172 L30 -100" stroke={o.sash} strokeWidth={12} strokeLinecap="round" />}
        {o.belt && <path d="M-39 -100 Q0 -92 39 -100" stroke={o.belt} strokeWidth={9} fill="none" />}
        {/* head */}
        <g transform={`translate(0 -232) scale(${popE}) rotate(${ftc * 0.25}) translate(0 232)`}>
          <circle cx={0} cy={-232} r={52} fill={skin} stroke={OL} strokeWidth={3.5} />
          {p.hair && <path d="M-50 -246 Q-46 -290 0 -288 Q46 -290 50 -246 Q30 -268 0 -266 Q-30 -268 -50 -246 Z" fill={p.hair} stroke={OL} strokeWidth={3} />}
          <ChibiFace expr={ex.cur} blink={blink} mouth={m} mustache={p.mustache} beard={p.beard} beardColor={p.beardColor} />
          {p.glasses && <g><circle cx={-17} cy={-238} r={14} fill="none" stroke={OL} strokeWidth={3} /><circle cx={17} cy={-238} r={14} fill="none" stroke={OL} strokeWidth={3} /><path d="M-3 -238 H3" stroke={OL} strokeWidth={3} /></g>}
          <Hat kind={p.hat ?? 'none'} color={p.hatColor} frame={f2} />
        </g>
        {/* front arm */}
        <Arm l={R} sx={26} sy={shoulderY} color={sleeve} skin={skin} />
        {p.item && p.item !== 'none' && <Item kind={p.item} x={R.hx} y={R.hy} ang={R.ang} side={1} frame={f2} flip={p.flip} />}
      </g>
    </g>
  );
};

const Leg: React.FC<{ x: number; swing: number; color: string }> = ({ x, swing, color }) => (
  <g transform={`rotate(${swing} ${x} -90)`}>
    <path d={`M${x - 11} -92 L${x + 11} -92 L${x + 9} -14 L${x - 9} -14 Z`} fill={color} stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />
    <path d={`M${x - 10} -14 L${x + 14} -14 Q${x + 18} 0 ${x + 8} 0 L${x - 10} 0 Z`} fill="#3A2A1E" stroke={OL} strokeWidth={3} />
  </g>
);

const Arm: React.FC<{ l: any; sx: number; sy: number; color: string; skin: string }> = ({ l, sx, sy, color, skin }) => (
  <g>
    <path d={`M${sx} ${sy} L${l.ex} ${l.ey} L${l.hx} ${l.hy}`} stroke={OL} strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d={`M${sx} ${sy} L${l.ex} ${l.ey} L${l.hx} ${l.hy}`} stroke={color} strokeWidth={13} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={l.hx} cy={l.hy} r={9.5} fill={skin} stroke={OL} strokeWidth={3} />
  </g>
);

export const ChibiFace: React.FC<{ expr: string; blink: boolean; mouth: number; mustache?: boolean; beard?: boolean; beardColor?: string }> = ({ expr, blink, mouth, mustache, beard, beardColor = '#2B2018' }) => {
  const k = OL;
  let eyes: React.ReactNode, brows: React.ReactNode = null, mouthEl: React.ReactNode;
  if (expr === 'shock') {
    eyes = (
      <g>
        <ellipse cx={-18} cy={-240} rx={15} ry={17} fill="#fff" stroke={k} strokeWidth={3} />
        <ellipse cx={18} cy={-240} rx={15} ry={17} fill="#fff" stroke={k} strokeWidth={3} />
        <circle cx={-17} cy={-238} r={3.5} fill={k} /><circle cx={17} cy={-238} r={3.5} fill={k} />
      </g>
    );
    mouthEl = <ellipse cx={0} cy={-202} rx={9} ry={11} fill={k} />;
  } else if (expr === 'grin') {
    eyes = (
      <g>
        <ellipse cx={-18} cy={-242} rx={13} ry={14} fill="#fff" stroke={k} strokeWidth={3} />
        <ellipse cx={18} cy={-242} rx={13} ry={14} fill="#fff" stroke={k} strokeWidth={3} />
        <circle cx={-16} cy={-240} r={3} fill={k} /><circle cx={16} cy={-240} r={3} fill={k} />
      </g>
    );
    mouthEl = (
      <g>
        <path d="M-30 -214 Q0 -210 30 -214 Q26 -186 0 -184 Q-26 -186 -30 -214 Z" fill="#fff" stroke={k} strokeWidth={3} />
        <path d="M-28 -202 Q0 -198 28 -202 M-16 -213 V-186 M-4 -212 V-184 M8 -212 V-184 M19 -213 V-187" stroke={k} strokeWidth={1.8} fill="none" />
      </g>
    );
  } else {
    const closed = blink || expr === 'calm';
    eyes = closed ? (
      <path d={expr === 'calm' ? 'M-25 -238 q7 5 14 0 M11 -238 q7 5 14 0' : 'M-24 -238 h12 M12 -238 h12'} stroke={k} strokeWidth={3} fill="none" strokeLinecap="round" />
    ) : (
      <g><ellipse cx={-17} cy={-238} rx={4.5} ry={6} fill={k} /><ellipse cx={17} cy={-238} rx={4.5} ry={6} fill={k} /></g>
    );
    if (expr === 'angry') brows = <path d="M-28 -258 L-8 -250 M8 -250 L28 -258" stroke={k} strokeWidth={4} strokeLinecap="round" />;
    else if (expr === 'sad') brows = <path d="M-28 -250 L-10 -258 M10 -258 L28 -250" stroke={k} strokeWidth={3.5} strokeLinecap="round" />;
    else if (expr === 'determined') brows = <path d="M-27 -256 L-8 -252 M8 -252 L27 -256" stroke={k} strokeWidth={4} strokeLinecap="round" />;
    else brows = <path d="M-26 -254 q8 -4 15 0 M11 -254 q8 -4 15 0" stroke={k} strokeWidth={3} fill="none" strokeLinecap="round" />;
    if (mouth === 2) mouthEl = <ellipse cx={0} cy={-206} rx={8} ry={9} fill={k} />;
    else if (mouth === 1) mouthEl = <ellipse cx={0} cy={-207} rx={7} ry={5} fill={k} />;
    else if (expr === 'happy' || expr === 'calm') mouthEl = <path d="M-12 -210 Q0 -198 12 -210" stroke={k} strokeWidth={3.5} fill="none" strokeLinecap="round" />;
    else if (expr === 'angry' || expr === 'sad') mouthEl = <path d="M-11 -202 Q0 -212 11 -202" stroke={k} strokeWidth={3.5} fill="none" strokeLinecap="round" />;
    else mouthEl = <path d="M-8 -206 h16" stroke={k} strokeWidth={3.5} strokeLinecap="round" />;
  }
  return (
    <g>
      {eyes}
      {brows}
      {beard && <path d="M-26 -206 Q-20 -170 0 -164 Q20 -170 26 -206 Q12 -196 0 -198 Q-12 -196 -26 -206 Z" fill={beardColor} stroke={k} strokeWidth={2.5} />}
      {mouthEl}
      {mustache && <path d="M-2 -218 Q-14 -224 -30 -208 Q-16 -214 -2 -212 M2 -218 Q14 -224 30 -208 Q16 -214 2 -212" fill={beardColor} stroke={k} strokeWidth={2.5} />}
    </g>
  );
};

const Hat: React.FC<{ kind: string; color?: string; frame: number }> = ({ kind, color, frame }) => {
  switch (kind) {
    case 'gandhicap':
      return <path d="M-48 -262 L-40 -300 L40 -300 L48 -262 Q0 -270 -48 -262 Z" fill="#F4F7FA" stroke={OL} strokeWidth={3} />;
    case 'bald':
      return <path d="M-50 -232 Q-54 -250 -46 -258 M50 -232 Q54 -250 46 -258" stroke="#C9C0B0" strokeWidth={6} fill="none" strokeLinecap="round" />;
    case 'pith':
      return (
        <g>
          <path d="M-70 -252 Q0 -268 70 -252 Q60 -240 0 -242 Q-60 -240 -70 -252 Z" fill={color ?? "#E8DCC0"} stroke={OL} strokeWidth={3} />
          <path d="M-46 -254 Q-44 -312 0 -314 Q44 -312 46 -254 Z" fill={color ?? "#E8DCC0"} stroke={OL} strokeWidth={3} />
          <path d="M-44 -262 Q0 -272 44 -262" stroke="#8A7A5A" strokeWidth={5} fill="none" />
        </g>
      );
    case 'parted':
      return <path d="M-52 -238 Q-54 -294 0 -294 Q54 -294 52 -238 Q40 -262 6 -270 L0 -286 L-4 -270 Q-40 -262 -52 -238 Z" fill={color ?? '#3A2A1E'} stroke={OL} strokeWidth={3} />;
    case 'indira':
      return (
        <g>
          <path d="M-56 -224 Q-60 -296 0 -296 Q60 -296 56 -224 Q48 -262 0 -270 Q-48 -262 -56 -224 Z" fill="#2A2018" stroke={OL} strokeWidth={3} />
          <path d="M-6 -294 Q20 -280 30 -262" stroke="#F4F7FA" strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d="M-58 -230 Q-70 -160 -40 -110 L-28 -116 Q-50 -170 -46 -230 Z" fill={color ?? '#E8862A'} stroke={OL} strokeWidth={3} />
        </g>
      );
    case 'nadiri':
      return (
        <g>
          <path d="M-40 -262 Q-46 -330 -20 -350 Q0 -330 20 -350 Q46 -330 40 -262 Z" fill="#B3261E" stroke={OL} strokeWidth={3.5} />
          <path d="M-56 -248 Q-58 -280 0 -282 Q58 -280 56 -248 Q0 -264 -56 -248 Z" fill="#3A2A22" stroke={OL} strokeWidth={3.5} />
          <circle cx={0} cy={-300} r={8} fill="#E2B13C" stroke={OL} strokeWidth={2} />
          <path d={`M0 -340 Q${14 + Math.sin(frame / 6) * 4} -380 ${30 + Math.sin(frame / 6) * 6} -386`} stroke="#F4F7FA" strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      );
    case 'tricorn':
      return (
        <g>
          <path d="M-70 -258 Q-60 -310 0 -312 Q60 -310 70 -258 Q40 -276 0 -272 Q-40 -276 -70 -258 Z" fill="#1E1E28" stroke={OL} strokeWidth={3} />
          <path d="M-66 -262 Q0 -290 66 -262" stroke="#E2B13C" strokeWidth={4} fill="none" />
          <path d="M-52 -238 Q-60 -200 -50 -180 M52 -238 Q60 -200 50 -180" stroke="#F4F7FA" strokeWidth={14} strokeLinecap="round" />
        </g>
      );
    case 'queen':
      return (
        <g>
          <path d="M-56 -230 Q-62 -300 0 -300 Q62 -300 56 -230 Q60 -170 52 -140 L40 -160 Q44 -240 0 -262 Q-44 -240 -40 -160 L-52 -140 Q-60 -170 -56 -230 Z" fill="#F4F7FA" stroke={OL} strokeWidth={3} opacity={0.95} />
          <path d="M-30 -282 L-34 -318 L-16 -300 L0 -326 L16 -300 L34 -318 L30 -282 Z" fill="#E2B13C" stroke={OL} strokeWidth={3} />
        </g>
      );
    case 'europe':
      return (
        <g>
          <path d="M-80 -262 Q0 -280 80 -262 Q60 -250 0 -252 Q-60 -250 -80 -262 Z" fill="#1E1E28" stroke={OL} strokeWidth={3} />
          <path d="M-44 -262 Q-40 -316 0 -318 Q40 -316 44 -262 Z" fill="#1E1E28" stroke={OL} strokeWidth={3} />
          <path d={`M30 -300 Q${60 + Math.sin(frame / 6) * 4} -330 ${80 + Math.sin(frame / 6) * 6} -320`} stroke="#F4F7FA" strokeWidth={7} fill="none" strokeLinecap="round" />
        </g>
      );
    case 'nonla': // Vietnamese conical palm-leaf hat
      return (
        <g>
          <path d="M-96 -250 L0 -332 L96 -250 Q0 -236 -96 -250 Z" fill={color ?? '#E8D8A0'} stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />
          <path d="M-60 -262 L0 -312 M-30 -256 L0 -322 M30 -256 L0 -322 M60 -262 L0 -312" stroke="rgba(0,0,0,0.15)" strokeWidth={3} />
        </g>
      );
    case 'kepi': // French military cap: short sloped cylinder, flat top, visor, gold band
      return (
        <g>
          <path d="M-46 -258 L-40 -310 Q0 -318 40 -310 L46 -258 Z" fill={color ?? '#5A6A4A'} stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />
          <path d="M-46 -268 L46 -268" stroke="#E2B13C" strokeWidth={6} />
          <path d="M-44 -258 Q-60 -248 -76 -250 Q-60 -262 -44 -262 Z" fill="#1E1E28" stroke={OL} strokeWidth={3} />
        </g>
      );
    case 'tophat':
      return (
        <g>
          <path d="M-72 -260 Q0 -276 72 -260 Q56 -250 0 -252 Q-56 -250 -72 -260 Z" fill={color ?? '#1E1E28'} stroke={OL} strokeWidth={3} />
          <path d="M-40 -262 L-44 -350 Q0 -358 44 -350 L40 -262 Z" fill={color ?? '#1E1E28'} stroke={OL} strokeWidth={3} />
          <path d="M-41 -276 L41 -276" stroke="#5A5A64" strokeWidth={8} />
        </g>
      );
    case 'bicorne': // Napoleon's hat, worn sideways
      return (
        <g>
          <path d="M-96 -262 Q-60 -340 0 -332 Q60 -340 96 -262 Q0 -286 -96 -262 Z" fill={color ?? '#1E1E28'} stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />
          <circle cx={30} cy={-300} r={11} fill="#C0392B" stroke={OL} strokeWidth={2} /><circle cx={30} cy={-300} r={6} fill="#F4F7FA" /><circle cx={30} cy={-300} r={3} fill="#2E4A9A" />
        </g>
      );
    case 'skullcap':
      return <path d="M-48 -262 Q-46 -296 0 -298 Q46 -296 48 -262 Q0 -272 -48 -262 Z" fill={color ?? '#F4F7FA'} stroke={OL} strokeWidth={3} />;
    case 'sultan':
      return (
        <g>
          <path d="M-58 -246 Q-66 -306 0 -310 Q66 -306 58 -246 Q0 -264 -58 -246 Z" fill={color ?? '#F4F7FA'} stroke={OL} strokeWidth={3.5} />
          <path d="M-54 -264 Q0 -300 56 -266 M-44 -284 Q0 -306 46 -286" stroke="rgba(0,0,0,0.16)" strokeWidth={4} fill="none" />
          <path d="M-10 -300 L0 -340 L10 -300 Z" fill="#E2B13C" stroke={OL} strokeWidth={2.5} />
          <circle cx={0} cy={-290} r={10} fill="#2E9A4A" stroke={OL} strokeWidth={2.5} />
          <path d={`M4 -300 Q${20 + Math.sin(frame / 6) * 4} -350 ${40 + Math.sin(frame / 6) * 6} -352`} stroke="#F4F7FA" strokeWidth={7} fill="none" strokeLinecap="round" />
        </g>
      );
    case 'veil':
      return (
        <g>
          <path d="M-58 -200 Q-70 -300 0 -300 Q70 -300 58 -200 Q60 -150 70 -120 L40 -140 Q48 -200 40 -250 Q0 -272 -40 -250 Q-48 -200 -40 -140 L-70 -120 Q-60 -150 -58 -200 Z" fill={color ?? '#7A3A5A'} stroke={OL} strokeWidth={3.5} />
          <path d="M-44 -258 Q0 -280 44 -258" stroke="#E2B13C" strokeWidth={5} fill="none" />
        </g>
      );
    case 'hairlong':
      return (
        <g>
          <path d="M-54 -230 Q-58 -296 0 -296 Q58 -296 54 -230 Q60 -170 50 -140 L36 -160 Q40 -230 30 -262 Q0 -276 -30 -262 Q-40 -230 -36 -160 L-50 -140 Q-60 -170 -54 -230 Z" fill={color ?? '#1E1612'} stroke={OL} strokeWidth={3} />
          <path d="M-46 -268 Q0 -284 46 -268" stroke="#E2B13C" strokeWidth={6} fill="none" />
          <circle cx={0} cy={-282} r={7} fill="#B3261E" stroke={OL} strokeWidth={2} />
        </g>
      );
    case 'mongol':
      return (
        <g>
          <path d="M-40 -262 Q-30 -320 0 -340 Q30 -320 40 -262 Z" fill={color ?? '#7A2A22'} stroke={OL} strokeWidth={3.5} />
          <path d="M-58 -248 Q-60 -280 0 -280 Q60 -280 58 -248 Q0 -264 -58 -248 Z" fill="#8A6A4A" stroke={OL} strokeWidth={3.5} />
          <path d="M-54 -262 l8 6 M-36 -270 l6 8 M-16 -274 l4 8 M6 -274 l2 8 M28 -270 l-2 8 M46 -262 l-6 8" stroke="#5A4630" strokeWidth={3} />
        </g>
      );
    case 'pagri': {
      const col = color ?? '#C0392B';
      return (
        <g>
          <path d="M-56 -244 Q-64 -296 -10 -306 Q46 -312 58 -270 Q62 -252 56 -240 Q0 -258 -56 -244 Z" fill={col} stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />
          <path d="M-54 -258 Q0 -296 56 -262 M-46 -278 Q4 -306 50 -286" stroke="rgba(0,0,0,0.22)" strokeWidth={4} fill="none" />
          <circle cx={-6} cy={-282} r={8} fill="#E2B13C" stroke={OL} strokeWidth={2.5} />
          <path d={`M-6 -290 Q${-2 + Math.sin(frame / 6) * 3} -326 ${10 + Math.sin(frame / 6) * 4} -340`} stroke="#F4F7FA" strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      );
    }
    case 'ghurid':
      return (
        <g>
          <path d="M-46 -262 Q-40 -300 0 -340 Q40 -300 46 -262 Z" fill="#8E95A3" stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />
          <path d="M-56 -250 Q-58 -284 0 -284 Q58 -284 56 -250 Q0 -266 -56 -250 Z" fill={color ?? '#F1E6D0'} stroke={OL} strokeWidth={3.5} />
          <path d="M0 -340 V-356" stroke={OL} strokeWidth={4} />
        </g>
      );
    case 'turbanW':
      return (
        <g>
          <path d="M-56 -244 Q-62 -300 0 -304 Q62 -300 56 -244 Q0 -262 -56 -244 Z" fill={color ?? '#F4F7FA'} stroke={OL} strokeWidth={3.5} />
          <path d="M-52 -262 Q0 -298 54 -264" stroke="rgba(0,0,0,0.18)" strokeWidth={4} fill="none" />
        </g>
      );
    case 'topi':
      return <path d="M-46 -268 Q0 -278 46 -268 L42 -312 Q20 -322 4 -308 Q-16 -300 -38 -296 Z" fill="url(#dhaka)" stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />;
    case 'crown':
      return (
        <g>
          <path d="M-40 -270 L-44 -318 L-24 -298 L-10 -330 L0 -300 L10 -330 L24 -298 L44 -318 L40 -270 Z" fill="#E2B13C" stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />
          <circle cx={0} cy={-286} r={6} fill="#B3261E" stroke={OL} strokeWidth={2} />
        </g>
      );
    case 'malla':
      return (
        <g>
          <path d="M-48 -266 Q0 -282 48 -266 L36 -312 Q0 -330 -36 -312 Z" fill={color ?? '#8C1D18'} stroke={OL} strokeWidth={3.5} />
          <path d="M-36 -312 Q0 -330 36 -312 L0 -350 Z" fill="#E2B13C" stroke={OL} strokeWidth={3} />
          <path d="M-46 -272 Q0 -286 46 -272" stroke="#E2B13C" strokeWidth={6} fill="none" />
        </g>
      );
    case 'rana': {
      const sway = Math.sin(frame / 6) * 4;
      return (
        <g>
          <path d="M-50 -262 Q0 -280 50 -262 Q46 -306 0 -310 Q-46 -306 -50 -262 Z" fill="#2F2F3A" stroke={OL} strokeWidth={3.5} />
          <path d="M-50 -262 Q0 -276 50 -262" stroke="#E2B13C" strokeWidth={6} fill="none" />
          <circle cx={0} cy={-292} r={8} fill="#E8EEF2" stroke={OL} strokeWidth={2} />
          {/* bird-of-paradise plume */}
          <path d={`M4 -306 Q${30 + sway} -360 ${70 + sway} -352 Q${40 + sway} -340 ${30} -318 Q${60 + sway} -330 ${84 + sway} -318 Q${50} -312 8 -300 Z`} fill="#3E6B3A" stroke={OL} strokeWidth={2.5} />
          <path d={`M10 -310 Q${40 + sway} -350 ${66 + sway} -348`} stroke="#B9D36A" strokeWidth={2} fill="none" />
        </g>
      );
    }
    case 'helmet':
      return (
        <g>
          <path d="M-54 -248 Q-54 -304 0 -306 Q54 -304 54 -248 Q0 -262 -54 -248 Z" fill={color ?? '#6E7A4A'} stroke={OL} strokeWidth={3.5} />
          <path d="M-66 -250 Q0 -266 66 -250" stroke={OL} strokeWidth={5} fill="none" />
        </g>
      );
    case 'shako':
      return (
        <g>
          <path d="M-36 -270 L-40 -330 L40 -330 L36 -270 Z" fill="#1E1E28" stroke={OL} strokeWidth={3.5} />
          <path d="M-40 -330 L40 -330" stroke="#E2B13C" strokeWidth={5} />
          <circle cx={0} cy={-300} r={7} fill="#E2B13C" stroke={OL} strokeWidth={2} />
          <path d="M-44 -270 Q0 -260 44 -270" stroke={OL} strokeWidth={6} fill="none" />
        </g>
      );
    case 'cap':
      return <path d="M-50 -258 Q-48 -300 0 -302 Q48 -300 50 -258 Q0 -270 -50 -258 Z M30 -262 L70 -256" fill={color ?? '#3E5C8A'} stroke={OL} strokeWidth={3.5} />;
    case 'bun':
      return (
        <g>
          <path d="M-52 -238 Q-52 -292 0 -292 Q52 -292 52 -238 Q40 -270 0 -270 Q-40 -270 -52 -238 Z" fill={color ?? '#1E1612'} stroke={OL} strokeWidth={3} />
          <circle cx={0} cy={-300} r={16} fill={color ?? '#1E1612'} stroke={OL} strokeWidth={3} />
          <circle cx={30} cy={-276} r={6} fill="#B3261E" />
        </g>
      );
    case 'scarf':
      return <path d="M-56 -226 Q-60 -296 0 -298 Q60 -296 56 -226 Q50 -270 0 -272 Q-50 -270 -56 -226 Z" fill={color ?? '#B3261E'} stroke={OL} strokeWidth={3} />;
    case 'hair':
      return <path d="M-52 -238 Q-54 -294 0 -294 Q54 -294 52 -238 Q36 -268 0 -270 Q-36 -268 -52 -238 Z" fill={color ?? '#1E1612'} stroke={OL} strokeWidth={3} />;
    case 'kirat':
      return (
        <g>
          <path d="M-52 -240 Q-54 -292 0 -292 Q54 -292 52 -240 Q36 -268 0 -270 Q-36 -268 -52 -240 Z" fill="#1E1612" stroke={OL} strokeWidth={3} />
          <path d="M-52 -262 Q0 -278 52 -262" stroke="#C0392B" strokeWidth={8} fill="none" />
          <path d="M34 -272 Q48 -330 64 -338 Q56 -300 40 -270 Z" fill="#E8EEF2" stroke={OL} strokeWidth={2.5} />
        </g>
      );
    default:
      return null;
  }
};

export const Item: React.FC<{ kind: string; x: number; y: number; ang: number; side: number; frame: number; flip?: boolean }> = ({ kind, x, y, ang, side, frame, flip }) => {
  if (kind.startsWith('placard:')) {
    const txt = kind.slice(8);
    return (
      <g transform={`translate(${x} ${y})`}>
        <line x1={0} y1={30} x2={0} y2={-80} stroke="#6B4A2B" strokeWidth={7} />
        <g transform={`rotate(${Math.sin(frame / 7) * 3}) scale(${flip ? -1 : 1} 1)`}>
          <rect x={-105} y={-156} width={210} height={84} rx={4} fill="#F4EEDD" stroke={OL} strokeWidth={3.5} />
          <text x={0} y={-102} textAnchor="middle" fontFamily="Hand" fontSize={txt.length > 10 ? 27 : 36} fill="#B3261E" stroke="#B3261E" strokeWidth={1.2}>{txt}</text>
        </g>
      </g>
    );
  }
  const rot = side === 1 ? -ang + 90 : ang - 90;
  switch (kind) {
    case 'spear':
      return (
        <g transform={`translate(${x} ${y})`}>
          <line x1={0} y1={-170} x2={0} y2={90} stroke="#6B4A2B" strokeWidth={7} strokeLinecap="round" />
          <path d="M0 -206 L10 -172 L0 -166 L-10 -172 Z" fill="#A9B0B8" stroke={OL} strokeWidth={2.5} />
        </g>
      );
    case 'flag':
      return (
        <g transform={`translate(${x} ${y})`}>
          <line x1={0} y1={-170} x2={0} y2={60} stroke="#6B4A2B" strokeWidth={7} strokeLinecap="round" />
          <g transform="translate(4 -168) scale(0.55)"><MiniFlag /></g>
        </g>
      );
    case 'khukuri':
      return (
        <g transform={`translate(${x} ${y}) rotate(${side === 1 ? -ang + 180 : ang - 180})`}>
          <rect x={-5} y={-4} width={10} height={24} rx={3} fill="#4A2E1E" stroke={OL} strokeWidth={2} />
          <path d="M-4 20 Q-10 60 6 92 Q22 70 10 20 Z" fill="#C9D0D6" stroke={OL} strokeWidth={2.5} />
        </g>
      );
    case 'musket':
      return (
        <g transform={`translate(${x} ${y}) rotate(-35)`}>
          <rect x={-8} y={-140} width={8} height={170} fill="#5A3E26" stroke={OL} strokeWidth={2} />
          <rect x={-6} y={-150} width={4} height={30} fill="#7A7F8C" />
        </g>
      );
    case 'banner':
      return (
        <g transform={`translate(${x} ${y})`}>
          <line x1={0} y1={-170} x2={0} y2={60} stroke="#6B4A2B" strokeWidth={7} strokeLinecap="round" />
          <path d={`M2 -168 L${70 + Math.sin(frame / 4) * 6} -146 L2 -120 Z`} fill="#E8862A" stroke={OL} strokeWidth={3} />
          <circle cx={4} cy={-176} r={6} fill="#E2B13C" stroke={OL} strokeWidth={2} />
        </g>
      );
    case 'mallet':
      return (
        <g transform={`translate(${x} ${y}) rotate(${side === 1 ? -ang + 180 : ang - 180})`}>
          <rect x={-3} y={-6} width={6} height={130} fill="#8A6A4A" stroke={OL} strokeWidth={1.5} />
          <rect x={-20} y={118} width={40} height={14} rx={4} fill="#6B4A2B" stroke={OL} strokeWidth={2} />
        </g>
      );
    case 'book':
      return (
        <g transform={`translate(${x - 6} ${y - 24}) rotate(-6)`}>
          <path d="M0 -26 L-34 -32 L-34 22 L0 28 Z M0 -26 L34 -32 L34 22 L0 28 Z" fill="#F4EEDD" stroke={OL} strokeWidth={2.5} />
          <path d="M-36 24 L0 30 L36 24 L36 30 L0 36 L-36 30 Z" fill="#7A2A22" stroke={OL} strokeWidth={2} />
        </g>
      );
    case 'bundle':
      return (
        <g transform={`translate(${x} ${y - 20})`}>
          <path d="M-36 20 Q-44 -26 0 -34 Q44 -26 36 20 Q0 30 -36 20 Z" fill="#C9A47A" stroke={OL} strokeWidth={3} />
          <path d="M0 -34 L-8 -48 M0 -34 L10 -46" stroke={OL} strokeWidth={3} />
        </g>
      );
    case 'coin':
      return <ellipse cx={x} cy={y - 6} rx={14} ry={14} fill="#C98A3A" stroke={OL} strokeWidth={2.5} />;
    case 'sword':
      return (
        <g transform={`translate(${x} ${y}) rotate(${side === 1 ? -ang + 180 : ang - 180})`}>
          <rect x={-12} y={-2} width={24} height={6} rx={2} fill="#E2B13C" stroke={OL} strokeWidth={2} />
          <rect x={-4} y={-18} width={8} height={18} rx={2} fill="#4A2E1E" stroke={OL} strokeWidth={2} />
          <path d="M-5 4 L-5 70 Q4 96 16 104 Q8 80 6 4 Z" fill="#C9D0D6" stroke={OL} strokeWidth={2.5} />
        </g>
      );
    case 'shield':
      return (
        <g transform={`translate(${x} ${y})`}>
          <circle r={38} fill="#6B4A2B" stroke={OL} strokeWidth={3.5} />
          <circle r={28} fill="none" stroke="#E2B13C" strokeWidth={4} />
          {[0, 1, 2, 3].map((i) => <circle key={i} cx={Math.cos(i * 1.57 + 0.78) * 14} cy={Math.sin(i * 1.57 + 0.78) * 14} r={4} fill="#E2B13C" />)}
        </g>
      );
    case 'sack':
      return (
        <g transform={`translate(${x} ${y - 30})`}>
          <path d="M-30 36 Q-40 0 -14 -20 L-18 -32 L18 -32 L14 -20 Q40 0 30 36 Z" fill="#C9A47A" stroke={OL} strokeWidth={3} />
          <circle cx={0} cy={-36} r={8} fill="#E2B13C" stroke={OL} strokeWidth={2} />
          <text x={0} y={18} textAnchor="middle" fontFamily="Tag" fontSize={26} fill="#5A3E26">$</text>
        </g>
      );
    case 'brick':
      return <rect x={x - 22} y={y - 18} width={44} height={22} fill="#A84A32" stroke={OL} strokeWidth={3} />;
    case 'scroll':
      return (
        <g transform={`translate(${x} ${y})`}>
          <rect x={-6} y={-40} width={16} height={60} rx={4} fill="#EADDBB" stroke={OL} strokeWidth={2.5} />
        </g>
      );
    case 'notebook':
      return (
        <g transform={`translate(${x - 10} ${y - 30}) rotate(-8)`}>
          <rect x={-26} y={-34} width={52} height={66} fill="#F4EEDD" stroke={OL} strokeWidth={2.5} />
          <path d="M-18 -20 h36 M-18 -8 h36 M-18 4 h26" stroke="#7A7F8C" strokeWidth={2} />
        </g>
      );
    case 'lamp':
      return (
        <g transform={`translate(${x} ${y})`}>
          <path d="M-16 0 Q0 14 16 0 Z" fill="#C1793A" stroke={OL} strokeWidth={2} />
          <path d={`M0 -2 Q${-5 + Math.sin(frame) * 2} -14 0 ${-24 - (frame % 3)} Q5 -14 0 -2`} fill="#FFB21E" />
        </g>
      );
    case 'hammer':
      return (
        <g transform={`translate(${x} ${y}) rotate(${rot})`}>
          <rect x={-3} y={-50} width={6} height={60} fill="#6B4A2B" />
          <rect x={-14} y={-62} width={28} height={14} fill="#7A7F8C" stroke={OL} strokeWidth={2} />
        </g>
      );
    default:
      return null;
  }
};

/** Nepal flag: two stacked pennants, crimson with blue border, moon above, sun below. Origin = hoist top. Height ~ 120. */
export const MiniFlag: React.FC<{ wave?: number }> = ({ wave = 0 }) => {
  const w = wave;
  const outer = `M0 0 L${92 + w} ${62} L${38} ${62} L${92 - w} ${122} L0 ${122} Z`;
  return (
    <g>
      <path d={outer} fill="#003893" stroke="#003893" strokeWidth={9} strokeLinejoin="miter" />
      <path d={outer} fill="#DC143C" />
      {/* moon */}
      <path d="M14 30 A16 16 0 0 0 46 30 A16 12 0 0 1 14 30 Z" fill="#fff" />
      <circle cx={30} cy={40} r={6} fill="#fff" />
      {[...Array(8)].map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <path key={i} d={`M${30 + Math.cos(a) * 7} ${40 + Math.sin(a) * 7} L${30 + Math.cos(a + 0.2) * 11} ${40 + Math.sin(a + 0.2) * 11} L${30 + Math.cos(a + 0.4) * 7} ${40 + Math.sin(a + 0.4) * 7}`} fill="#fff" />;
      })}
      {/* sun */}
      <circle cx={26} cy={96} r={9} fill="#fff" />
      {[...Array(12)].map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <path key={i} d={`M${26 + Math.cos(a) * 9} ${96 + Math.sin(a) * 9} L${26 + Math.cos(a + 0.13) * 16} ${96 + Math.sin(a + 0.13) * 16} L${26 + Math.cos(a + 0.26) * 9} ${96 + Math.sin(a + 0.26) * 9}`} fill="#fff" />;
      })}
    </g>
  );
};
