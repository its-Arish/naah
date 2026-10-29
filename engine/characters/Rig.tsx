/**
 * Cut-out rigs of the studio's characters, for animating by hand in other programs.
 *
 * <ChibiRig c={W.GI()} /> and <HostRig /> draw a character in a neutral rest pose with every
 * moving part on its own named layer (data-layer), alternate mouths / eyes / brows as hidden layers,
 * and joint positions (data-pivot, in the character's own units: feet centre = 0,0; up is negative y).
 * scripts/export_rigs.mjs turns these into layered SVG, PSD and PNG parts in rigs/.
 *
 * Side names follow the character's point of view (Character Animator convention):
 * "Right Arm" is the arm on the left of the screen.
 * The in-film characters (Chibi, Host) are unchanged; these rigs copy their geometry.
 */
import React from 'react';
import { Hat, Item } from './Chibi';

const OL = '#2A1B12';
type LP = { name: string; hidden?: boolean; pivot?: [number, number]; children?: React.ReactNode };
/** A named layer. */
export const L: React.FC<LP> = ({ name, hidden, pivot, children }) => (
  <g data-layer={name} data-hidden={hidden ? '1' : undefined} data-pivot={pivot ? pivot.map((v) => Math.round(v * 10) / 10).join(',') : undefined} style={hidden ? { display: 'none' } : undefined}>{children}</g>
);

function limb(sx: number, sy: number, side: number, a1: number, a2: number, up: number, lo: number) {
  const r1 = (a1 * Math.PI) / 180;
  const ex = sx + Math.sin(r1) * up * side, ey = sy + Math.cos(r1) * up;
  const r2 = ((a1 + a2) * Math.PI) / 180;
  return { ex, ey, hx: ex + Math.sin(r2) * lo * side, hy: ey + Math.cos(r2) * lo, ang: a1 + a2 };
}
const Seg: React.FC<{ a: [number, number]; b: [number, number]; color: string; w?: number }> = ({ a, b, color, w = 13 }) => (
  <g>
    <path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} stroke={OL} strokeWidth={w + 7} strokeLinecap="round" />
    <path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} stroke={color} strokeWidth={w} strokeLinecap="round" />
  </g>
);

// ------------------------------------------------------------------ Chibi face parts, split per side
const EYE_X = 17, EYE_Y = -238;
const eyeSet = (side: 1 | -1, name: string) => {
  const x = EYE_X * side;
  return (
    <L name={`${name} Eye`} pivot={[x, EYE_Y]}>
      <L name={`${name} Pupil`}><ellipse cx={x} cy={EYE_Y} rx={4.5} ry={6} fill={OL} /></L>
      <L name={`${name} Blink`} hidden><path d={`M${x - 6} ${EYE_Y} h12`} stroke={OL} strokeWidth={3} strokeLinecap="round" /></L>
      <L name={`${name} Eye Calm`} hidden><path d={`M${x - 7} ${EYE_Y} q7 5 14 0`} stroke={OL} strokeWidth={3} fill="none" strokeLinecap="round" /></L>
      <L name={`${name} Eye Shock`} hidden><ellipse cx={18 * side} cy={-240} rx={15} ry={17} fill="#fff" stroke={OL} strokeWidth={3} /><circle cx={17 * side} cy={-238} r={3.5} fill={OL} /></L>
      <L name={`${name} Eye Grin`} hidden><ellipse cx={18 * side} cy={-242} rx={13} ry={14} fill="#fff" stroke={OL} strokeWidth={3} /><circle cx={16 * side} cy={-240} r={3} fill={OL} /></L>
    </L>
  );
};
const browSet = (side: 1 | -1, name: string) => {
  // paths drawn for the screen-left brow (side -1) and mirrored
  const m = (d: string, w = 3) => <path d={d} stroke={OL} strokeWidth={w} fill="none" strokeLinecap="round" transform={side === 1 ? 'scale(-1 1)' : undefined} />;
  return (
    <L name={`${name} Eyebrow`} pivot={[18.5 * side, -254]}>
      <L name={`${name} Eyebrow Neutral`}>{m('M-26 -254 q8 -4 15 0')}</L>
      <L name={`${name} Eyebrow Angry`} hidden>{m('M-28 -258 L-8 -250', 4)}</L>
      <L name={`${name} Eyebrow Sad`} hidden>{m('M-28 -250 L-10 -258', 3.5)}</L>
      <L name={`${name} Eyebrow Determined`} hidden>{m('M-27 -256 L-8 -252', 4)}</L>
    </L>
  );
};
/** Mouth shapes, named for Character Animator's lip sync (visemes) plus expressions. */
const mouthSet = () => {
  const E = (rx: number, ry: number, cy = -206) => <ellipse cx={0} cy={cy} rx={rx} ry={ry} fill={OL} />;
  const line = (d: string) => <path d={d} stroke={OL} strokeWidth={3.5} fill="none" strokeLinecap="round" />;
  const shapes: [string, React.ReactNode][] = [
    ['Neutral', line('M-8 -206 h16')],
    ['Smile', line('M-12 -210 Q0 -198 12 -210')],
    ['Frown', line('M-11 -202 Q0 -212 11 -202')],
    ['Surprised', E(9, 11, -202)],
    ['Aa', E(8, 9)],
    ['D', E(7, 5, -207)],
    ['Ee', E(10, 3.5, -207)],
    ['F', <g>{E(7, 4, -206)}<path d="M-6 -209 h12" stroke="#fff" strokeWidth={2.5} /></g>],
    ['L', E(7, 5, -207)],
    ['M', line('M-9 -206 h18')],
    ['Oh', E(6, 8)],
    ['R', E(6, 5, -207)],
    ['S', E(9, 3, -207)],
    ['Uh', E(7, 5.5, -206)],
    ['W-Oo', E(4.5, 5.5)],
    ['Grin', <g><path d="M-30 -214 Q0 -210 30 -214 Q26 -186 0 -184 Q-26 -186 -30 -214 Z" fill="#fff" stroke={OL} strokeWidth={3} /><path d="M-28 -202 Q0 -198 28 -202 M-16 -213 V-186 M-4 -212 V-184 M8 -212 V-184 M19 -213 V-187" stroke={OL} strokeWidth={1.8} fill="none" /></g>],
  ];
  return <L name="Mouth" pivot={[0, -206]}>{shapes.map(([n, el], i) => <L key={n} name={n} hidden={i !== 0}>{el}</L>)}</L>;
};

export type RigCostume = Record<string, any>;

/** Pivots for a Chibi in the rest pose (character units). */
export const chibiRest = () => {
  const sy = -170;
  const R = limb(-26, sy, -1, 12, 10, 40, 38); // character's right = screen left
  const Lf = limb(26, sy, 1, 12, 10, 40, 38);
  return { sy, R, L: Lf };
};

export const ChibiRig: React.FC<{ c: RigCostume; name?: string }> = ({ c, name = 'Character' }) => {
  const o = c.outfit ?? {};
  const skin = c.skin ?? '#E8B88A';
  const { sy, R, L: Lf } = chibiRest();
  const bottom = o.bottom ?? '#E9E1CF';
  const leg = (x: number, nm: string) => (
    <L name={`${nm} Leg`} pivot={[x, -90]}>
      <L name={`${nm} Thigh`}><path d={`M${x - 11} -92 L${x + 11} -92 L${x + 9} -14 L${x - 9} -14 Z`} fill={bottom} stroke={OL} strokeWidth={3.5} strokeLinejoin="round" /></L>
      <L name={`${nm} Foot`} pivot={[x, -14]}><path d={`M${x - 10} -14 L${x + 14} -14 Q${x + 18} 0 ${x + 8} 0 L${x - 10} 0 Z`} fill="#3A2A1E" stroke={OL} strokeWidth={3} /></L>
    </L>
  );
  const arm = (l: ReturnType<typeof limb>, sx: number, nm: string, item?: string, side = 1) => (
    <L name={`${nm} Arm`} pivot={[sx, sy]}>
      {item && item !== 'none' && <L name={`${nm} Item`} pivot={[l.hx, l.hy]}><Item kind={item} x={l.hx} y={l.hy} ang={l.ang} side={side} frame={0} /></L>}
      <L name={`${nm} Forearm`} pivot={[l.ex, l.ey]}><Seg a={[l.ex, l.ey]} b={[l.hx, l.hy]} color={o.top} /></L>
      <L name={`${nm} Upper Arm`} pivot={[sx, sy]}><Seg a={[sx, sy]} b={[l.ex, l.ey]} color={o.top} /></L>
      <L name={`${nm} Hand`} pivot={[l.hx, l.hy]}><circle cx={l.hx} cy={l.hy} r={9.5} fill={skin} stroke={OL} strokeWidth={3} /></L>
    </L>
  );
  return (
    <L name={name} pivot={[0, 0]}>
      {o.cape && <L name="Cape" pivot={[0, -176]}><path d="M-34 -176 Q-58 -80 -48 -20 L48 -20 Q58 -80 34 -176 Z" fill={o.cape} stroke={OL} strokeWidth={3.5} /></L>}
      {!o.robe && <>{leg(-15, 'Right')}{leg(15, 'Left')}</>}
      {arm(R, -26, 'Right', c.itemL, -1)}
      <L name="Body" pivot={[0, -90]}>
        <L name="Torso">{o.robe
          ? <path d="M-32 -178 Q0 -188 32 -178 L48 -6 Q0 6 -48 -6 Z" fill={o.top} stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />
          : <path d="M-32 -178 Q0 -188 32 -178 L40 -86 Q0 -78 -40 -86 Z" fill={o.top} stroke={OL} strokeWidth={3.5} strokeLinejoin="round" />}</L>
        {o.trim && <L name="Trim"><path d={o.robe ? 'M-6 -180 L-6 -4' : 'M-6 -180 L-14 -86'} stroke={o.trim} strokeWidth={8} /></L>}
        {o.sash && <L name="Sash"><path d="M-28 -172 L30 -100" stroke={o.sash} strokeWidth={12} strokeLinecap="round" /></L>}
        {o.belt && <L name="Belt"><path d="M-39 -100 Q0 -92 39 -100" stroke={o.belt} strokeWidth={9} fill="none" /></L>}
      </L>
      <L name="Head" pivot={[0, -180]}>
        <L name="Face"><circle cx={0} cy={-232} r={52} fill={skin} stroke={OL} strokeWidth={3.5} /></L>
        {c.hair && <L name="Hair"><path d="M-50 -246 Q-46 -290 0 -288 Q46 -290 50 -246 Q30 -268 0 -266 Q-30 -268 -50 -246 Z" fill={c.hair} stroke={OL} strokeWidth={3} /></L>}
        {eyeSet(-1, 'Right')}{eyeSet(1, 'Left')}
        {browSet(-1, 'Right')}{browSet(1, 'Left')}
        {c.beard && <L name="Beard"><path d="M-26 -206 Q-20 -170 0 -164 Q20 -170 26 -206 Q12 -196 0 -198 Q-12 -196 -26 -206 Z" fill={c.beardColor ?? '#2B2018'} stroke={OL} strokeWidth={2.5} /></L>}
        {mouthSet()}
        {c.mustache && <L name="Mustache"><path d="M-2 -218 Q-14 -224 -30 -208 Q-16 -214 -2 -212 M2 -218 Q14 -224 30 -208 Q16 -214 2 -212" fill={c.beardColor ?? '#2B2018'} stroke={OL} strokeWidth={2.5} /></L>}
        {c.glasses && <L name="Glasses"><circle cx={-17} cy={-238} r={14} fill="none" stroke={OL} strokeWidth={3} /><circle cx={17} cy={-238} r={14} fill="none" stroke={OL} strokeWidth={3} /><path d="M-3 -238 H3" stroke={OL} strokeWidth={3} /></L>}
        {c.hat && c.hat !== 'none' && <L name="Hat"><Hat kind={c.hat} color={c.hatColor} frame={0} /></L>}
      </L>
      {arm(Lf, 26, 'Left', c.item, 1)}
    </L>
  );
};

// ------------------------------------------------------------------ the narrator
const HL = '#151515';
export const HostRig: React.FC = () => {
  const sh = { x: 0, y: -380 };
  const R = limb(sh.x, sh.y, -1, 18, 14, 88, 82); // free arm, screen left
  const Lh = limb(sh.x, sh.y, 1, 42, 12, 80, 66); // holds the staff, screen right
  const skin = '#F6D2A8';
  const seg = (a: [number, number], b: [number, number]) => <path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} stroke={HL} strokeWidth={4.5} strokeLinecap="round" />;
  const E = (cx: number, rx: number, ry: number, cy = -442) => <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={HL} />;
  const mouths: [string, React.ReactNode][] = [
    ['Neutral', E(1, 7, 3.5)], ['Smile', <path d="M-16 -446 Q0 -430 16 -446" stroke={HL} strokeWidth={4} fill="none" strokeLinecap="round" />],
    ['Frown', <path d="M-12 -436 Q0 -446 12 -436" stroke={HL} strokeWidth={4} fill="none" strokeLinecap="round" />],
    ['Surprised', <ellipse cx={1} cy={-438} rx={13} ry={17} fill={HL} />], ['Aa', E(1, 10, 13, -441)], ['D', E(1, 9, 8)], ['Ee', E(1, 12, 5)],
    ['F', E(1, 9, 6)], ['L', E(1, 9, 8)], ['M', E(1, 7, 2.5)], ['Oh', E(1, 8, 11)], ['R', E(1, 8, 7)], ['S', E(1, 11, 4)], ['Uh', E(1, 9, 9)], ['W-Oo', E(1, 6, 7)],
    ['Smile Open', <path d="M-16 -448 Q0 -420 16 -448 Z" fill={HL} />],
    ['Grin', <g><path d="M-38 -452 Q0 -448 38 -452 Q32 -414 0 -412 Q-32 -414 -38 -452 Z" fill="#fff" stroke={HL} strokeWidth={3.5} /><path d="M-36 -440 Q0 -434 36 -440 M-20 -452 V-414 M-6 -451 V-412 M8 -451 V-412 M22 -452 V-415" stroke={HL} strokeWidth={2} fill="none" /></g>],
  ];
  const eye = (x: number, nm: string) => (
    <L name={`${nm} Eye`} pivot={[x, -482]}>
      <L name={`${nm} Pupil`}><circle cx={x} cy={-482} r={5.5} fill={HL} /></L>
      <L name={`${nm} Blink`} hidden><path d={`M${x - 7} -482 h14`} stroke={HL} strokeWidth={3.5} strokeLinecap="round" /></L>
      <L name={`${nm} Eye Shock`} hidden><circle cx={x} cy={-484} r={19} fill="#fff" stroke={HL} strokeWidth={3.5} /><circle cx={x} cy={-482} r={4} fill={HL} /></L>
      <L name={`${nm} Eye Grin`} hidden><path d={`M${x - 8} -488 q8 -8 16 0`} stroke={HL} strokeWidth={4} fill="none" strokeLinecap="round" /></L>
    </L>
  );
  const brow = (x: number, nm: string, worried: string, proud: string) => (
    <L name={`${nm} Eyebrow`} pivot={[x, -503]}>
      <L name={`${nm} Eyebrow Worried`} hidden><path d={worried} stroke={HL} strokeWidth={3.5} fill="none" strokeLinecap="round" /></L>
      <L name={`${nm} Eyebrow Proud`} hidden><path d={proud} stroke={HL} strokeWidth={3.5} fill="none" strokeLinecap="round" /></L>
    </L>
  );
  return (
    <L name="Host" pivot={[0, 0]}>
      <L name="Staff" pivot={[Lh.hx, Lh.hy]}>
        <g transform={`translate(${Lh.hx} 0)`}>
          <line x1={0} y1={-600} x2={4} y2={10} stroke="#6B4A2B" strokeWidth={10} strokeLinecap="round" />
          <path d="M-6 -600 q6 -24 14 -6" stroke="#6B4A2B" strokeWidth={9} fill="none" strokeLinecap="round" />
          <rect x={-6} y={-566} width={14} height={10} rx={3} fill="#3B2A1A" />
        </g>
      </L>
      <L name="Staff Cloth" pivot={[Lh.hx + 2, -560]}><g transform={`translate(${Lh.hx} 0)`}><path d="M2 -560 q16 4 30 22 l-12 8 q-8 -14 -18 -16 z" fill="#E8862A" stroke={HL} strokeWidth={2.5} /></g></L>
      <L name="Right Leg" pivot={[0, -215]}>
        <L name="Right Thigh">{seg([0, -215], [-14, -110])}</L>
        <L name="Right Shin" pivot={[-14, -110]}>{seg([-14, -110], [-38, 0])}</L>
        <L name="Right Foot" pivot={[-38, 0]}>{seg([-38, 0], [-60, 2])}</L>
      </L>
      <L name="Left Leg" pivot={[0, -215]}>
        <L name="Left Thigh">{seg([0, -215], [16, -110])}</L>
        <L name="Left Shin" pivot={[16, -110]}>{seg([16, -110], [36, 0])}</L>
        <L name="Left Foot" pivot={[36, 0]}>{seg([36, 0], [58, 3])}</L>
      </L>
      <L name="Body" pivot={[0, -215]}>
        <L name="Spine">{seg([0, -408], [0, -215])}</L>
        <L name="Waist Cloth"><path d="M-30 -236 L32 -240 L42 -172 Q6 -160 -38 -172 Z" fill="#F1E6D0" stroke={HL} strokeWidth={3.5} strokeLinejoin="round" /><path d="M-2 -236 Q4 -200 -2 -166" stroke="#D8C6A0" strokeWidth={3} fill="none" /><path d="M-36 -236 L36 -240 L37 -224 L-36 -220 Z" fill="#E8862A" stroke={HL} strokeWidth={3} /></L>
        <L name="Sash"><path d="M-10 -396 L10 -398 L22 -244 L4 -240 Z" fill="#8C1D18" stroke={HL} strokeWidth={3} strokeLinejoin="round" transform="rotate(-16 0 -310)" /><path d="M0 -384 l4 12 M3 -356 l4 12 M6 -328 l4 12 M9 -300 l4 12 M12 -272 l4 12" stroke="#E2B13C" strokeWidth={2.5} transform="rotate(-16 0 -310)" /></L>
      </L>
      <L name="Left Arm" pivot={[sh.x, sh.y]}>
        <L name="Left Upper Arm">{seg([sh.x, sh.y], [Lh.ex, Lh.ey])}</L>
        <L name="Left Forearm" pivot={[Lh.ex, Lh.ey]}>{seg([Lh.ex, Lh.ey], [Lh.hx, Lh.hy])}</L>
        <L name="Left Hand" pivot={[Lh.hx, Lh.hy]}><circle cx={Lh.hx} cy={Lh.hy} r={9} fill={skin} stroke={HL} strokeWidth={3} /></L>
      </L>
      <L name="Right Arm" pivot={[sh.x, sh.y]}>
        <L name="Right Upper Arm">{seg([sh.x, sh.y], [R.ex, R.ey])}</L>
        <L name="Right Forearm" pivot={[R.ex, R.ey]}>{seg([R.ex, R.ey], [R.hx, R.hy])}</L>
        <L name="Right Hand" pivot={[R.hx, R.hy]}><circle cx={R.hx} cy={R.hy} r={2.5} fill={HL} /></L>
        <L name="Right Hand Open" hidden pivot={[R.hx, R.hy]}><g stroke={HL} strokeWidth={3.5} strokeLinecap="round"><path d={`M${R.hx} ${R.hy} l8 12`} /><path d={`M${R.hx} ${R.hy} l-2 16`} /><path d={`M${R.hx} ${R.hy} l-10 12`} /></g></L>
      </L>
      <L name="Head" pivot={[0, -410]}>
        <L name="Face"><circle cx={0} cy={-470} r={64} fill={skin} stroke={HL} strokeWidth={4.5} /></L>
        {eye(-21, 'Right')}{eye(23, 'Left')}
        {brow(-23, 'Right', 'M-32 -500 l18 -6', 'M-32 -502 q9 -6 18 0')}{brow(23, 'Left', 'M14 -506 l18 6', 'M14 -502 q9 -6 18 0')}
        <L name="Mouth" pivot={[1, -442]}>{mouths.map(([n, el], i) => <L key={n} name={n} hidden={i !== 1}>{el}</L>)}</L>
        <L name="Turban Tail" pivot={[54, -520]}>
          <path d="M50 -522 Q86 -490 78 -420 Q66 -428 60 -440 Q66 -480 40 -508 Z" fill="#E8862A" stroke={HL} strokeWidth={3.5} strokeLinejoin="round" />
          <path d="M58 -500 Q70 -470 66 -440" stroke="#C0631C" strokeWidth={3} fill="none" />
        </L>
        <L name="Turban" pivot={[0, -540]}>
          <path d="M-66 -500 Q-74 -560 -20 -582 Q30 -600 62 -566 Q76 -540 66 -500 Q0 -516 -66 -500 Z" fill="#E8862A" stroke={HL} strokeWidth={4.5} strokeLinejoin="round" />
          <path d="M-62 -512 Q0 -560 64 -530 M-58 -532 Q-6 -574 52 -562 M-40 -556 Q10 -586 40 -578" stroke="#C0631C" strokeWidth={4} fill="none" />
          <path d="M-66 -500 Q0 -516 66 -500" stroke="#B3261E" strokeWidth={6} fill="none" />
          <circle cx={-34} cy={-548} r={7} fill="#E2B13C" stroke={HL} strokeWidth={2.5} />
        </L>
      </L>
    </L>
  );
};
