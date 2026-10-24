/**
 * physics-demo — one shot per physics helper in engine/lib/physics.ts.
 * Read this file next to docs/PHYSICS.md: each shot is a minimal, copyable example.
 */
import React from 'react';
import { useCurrentFrame, interpolate, Easing, gravityDrop, projectile, topple, pendulum, spring, onTwos } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { Cloud, Hills, Tree, OL } from '@engine/scenes/Parts';
import { hostShot, makeOpening, makeEnd, wordAt, type ShotMap, type SP } from '@engine/kit';

const FLOOR = 800; // ground line, kept above the caption zone (y > 850)

/** A shared outdoor set: sky, clouds, hills and a ground strip. */
const Yard: React.FC = () => (
  <>
    <Layer depth={0}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDay)" />
      <Cloud x={200} y={160} s={1.1} />
      <Cloud x={1300} y={110} s={0.8} speed={0.25} />
    </Layer>
    <Layer depth={0.4}>
      <Hills y={620} fill="#A8C07A" amp={30} seed="pd" stroke={false} />
      <Tree x={1700} y={FLOOR - 10} s={1.1} />
    </Layer>
    <Layer depth={1}>
      <rect x={-200} y={FLOOR} width={2400} height={500} fill="#C9A66B" stroke={OL} strokeWidth={4} />
    </Layer>
  </>
);

const Crate: React.FC<{ c?: string }> = ({ c = '#C99A5E' }) => (
  <g>
    <rect x={-70} y={-140} width={140} height={140} rx={6} fill={c} stroke={OL} strokeWidth={5} />
    <path d="M-70 -140 L70 0 M70 -140 L-70 0" stroke={OL} strokeWidth={4} opacity={0.5} />
  </g>
);

// ---------------------------------------------------------------- 1. gravityDrop: bounces + squash/stretch
const Drop3: React.FC<SP> = () => {
  const f = useCurrentFrame();
  const crates = [
    { x: 520, e: 0.15, c: '#C99A5E', label: 'e = 0.15  (sand bag)' },
    { x: 960, e: 0.45, c: '#E2B13C', label: 'e = 0.45  (crate)' },
    { x: 1400, e: 0.7, c: '#E8862A', label: 'e = 0.70  (rubber)' },
  ];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03, focus: [960, 600] }}>
        <Yard />
        <Layer depth={1}>
          {crates.map((k, i) => {
            // the crate's base sits on FLOOR; scaling about the base keeps it planted while it squashes
            const d = gravityDrop(f, 10, { h: 620, g: 1.6, e: k.e, maxBounces: 6, minSpeed: 2 });
            return (
              <g key={i}>
                <ellipse cx={k.x} cy={FLOOR + 4} rx={80 * (1 - Math.min(0.7, -d.y / 900))} ry={12} fill="#000" opacity={0.18} />
                <g transform={`translate(${k.x} ${FLOOR + d.y}) scale(${d.sx} ${d.sy})`}><Crate c={k.c} /></g>
              </g>
            );
          })}
        </Layer>
      </CameraRig>
      {crates.map((k, i) => <Label key={i} text={k.label} x={k.x} y={250} at={4 + i * 4} size={46} color="#fff" />)}
    </>
  );
};

// ---------------------------------------------------------------- 2. projectile with floor bounces + rolling
const Arc: React.FC<SP> = () => {
  const f = useCurrentFrame();
  const R = 34;
  const fire = 12;
  const p = projectile(f, fire, [330, 640], [17, -30], 1.2, { y: FLOOR - R, e: 0.45, mu: 0.8 });
  const spin = ((p.x - 330) / R) * (180 / Math.PI); // rolling without slipping: angle = distance / radius
  // trail of past positions (pure function of the frame: recompute them)
  const trail = [...Array(14).keys()].map((k) => f - 2 - k * 2).filter((g) => g > fire).map((g) => projectile(g, fire, [330, 640], [17, -30], 1.2, { y: FLOOR - R, e: 0.45, mu: 0.8 }));
  const recoil = f >= fire ? -26 * Math.exp(-(f - fire) / 5) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02, focus: [960, 600], shakes: [{ at: fire, amp: 8, len: 8 }] }}>
        <Yard />
        <Layer depth={1}>
          {trail.map((q, i) => <circle key={i} cx={q.x} cy={q.y} r={6} fill="#fff" opacity={0.5 - i * 0.03} />)}
          <g transform={`translate(${260 + recoil} ${FLOOR - 40}) rotate(-45)`}>
            <rect x={-20} y={-34} width={150} height={68} rx={20} fill="#3A3A3A" stroke={OL} strokeWidth={5} />
          </g>
          <circle cx={250 + recoil} cy={FLOOR - 30} r={42} fill="#6B4A2B" stroke={OL} strokeWidth={5} />
          {f >= fire && (
            <g transform={`translate(${p.x} ${p.y}) rotate(${spin})`}>
              <circle r={R} fill="#2B2B2B" stroke={OL} strokeWidth={4} />
              <path d={`M${-R * 0.5} ${-R * 0.5} L${R * 0.2} ${-R * 0.2}`} stroke="#777" strokeWidth={6} strokeLinecap="round" />
            </g>
          )}
          {f >= fire && f < fire + 8 && <circle cx={360} cy={600} r={30 + (f - fire) * 8} fill="#FFD84A" opacity={1 - (f - fire) / 8} />}
        </Layer>
      </CameraRig>
    </>
  );
};

// ---------------------------------------------------------------- 3. topple: rigid rod falling (RK4)
const Topple: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const start = wordAt(s, 'topples');
  const L = 520;
  const ang = topple(f, start, { length: L, g: 1.6, nudge: 0.012, restAngle: 88, e: 0.2 });
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [1100, 600] }}>
      <Yard />
      <Layer depth={1}>
        <g transform={`translate(900 ${FLOOR}) rotate(${ang})`}>
          <rect x={-14} y={-L} width={28} height={L} fill="#8A5A3A" stroke={OL} strokeWidth={5} />
          <path d={`M-14 ${-L + 10} L-190 ${-L + 50} L-14 ${-L + 100} Z`} fill="#B3261E" stroke={OL} strokeWidth={4} />
        </g>
        <rect x={870} y={FLOOR - 16} width={60} height={20} fill="#5A3E26" stroke={OL} strokeWidth={4} />
        <Chibi x={640} y={FLOOR + 10} s={1} outfit={{ top: '#2E86C1', bottom: '#33415C' }} hat="none" hair="#2A1B12" pose={f > start + 40 ? 'bothUp' : 'point'} expr={f > start + 40 ? 'shock' : 'happy'} seed="tp" />
      </Layer>
    </CameraRig>
  );
};

// ---------------------------------------------------------------- 4. pendulum: hanging sign
const Swing: React.FC<SP> = () => {
  const f = useCurrentFrame();
  const a = pendulum(f, 0, 26, 300, 1.6, 70);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03, focus: [960, 450] }}>
      <Yard />
      <Layer depth={1}>
        <rect x={500} y={150} width={30} height={650} fill="#6B4A2B" stroke={OL} strokeWidth={5} />
        <rect x={500} y={150} width={520} height={26} fill="#6B4A2B" stroke={OL} strokeWidth={5} />
        <g transform={`translate(960 176) rotate(${a})`}>
          <path d="M-90 0 L-90 230 M90 0 L90 230" stroke={OL} strokeWidth={4} />
          <rect x={-170} y={230} width={340} height={140} rx={12} fill="#F4E3C0" stroke={OL} strokeWidth={6} />
          <text x={0} y={322} textAnchor="middle" fontFamily="Hand" fontSize={74} fill="#B3261E">OPEN</text>
        </g>
      </Layer>
    </CameraRig>
  );
};

// ---------------------------------------------------------------- 5. springs: under-, critically- and over-damped
const Springs: React.FC<SP> = () => {
  const f = useCurrentFrame();
  const kinds = [
    { x: 480, cfg: { damping: 5, stiffness: 200, mass: 1 }, name: 'bouncy' },
    { x: 960, cfg: { damping: 28.3, stiffness: 200, mass: 1 }, name: 'balanced' },
    { x: 1440, cfg: { damping: 60, stiffness: 200, mass: 1 }, name: 'stiff' },
  ];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1 }}>
        <InsertBg />
        <Layer depth={1}>
          {kinds.map((k, i) => {
            const v = spring(f - 10, k.cfg);
            return (
              <g key={i}>
                <line x1={k.x - 150} y1={700} x2={k.x + 150} y2={700} stroke="#fff" strokeOpacity={0.3} strokeWidth={4} strokeDasharray="10 10" />
                <g transform={`translate(${k.x} ${700 - 360 * v})`}>
                  <circle r={60} fill={['#E8862A', '#2E86C1', '#8E44AD'][i]} stroke={OL} strokeWidth={6} />
                </g>
              </g>
            );
          })}
          <line x1={200} y1={340} x2={1720} y2={340} stroke="#FFD84A" strokeWidth={4} strokeDasharray="14 10" />
        </Layer>
      </CameraRig>
      {kinds.map((k, i) => <Label key={i} text={k.name} x={k.x} y={130} at={4} size={50} color="#fff" />)}
    </>
  );
};

// ---------------------------------------------------------------- 6. walk cycle, then stop + wave (follow-through)
const Walk: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const stop = Math.round(s.dur * 0.45);
  const x = interpolate(f, [0, stop], [260, 1060], Easing.out);
  const walking = f < stop - 6;
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [900, 600], panFrom: [0, 0], panTo: [-60, 0] }}>
      <Yard />
      <Layer depth={1}>
        <Chibi x={x} y={FLOOR + 10} s={1.25} outfit={{ top: '#C0392B', bottom: '#33415C', cape: '#8E44AD' }} hat="none" hair="#2A1B12" legs={walking ? 'walk' : 'stand'} pose={walking ? 'idle' : [{ at: 0, pose: 'idle' }, { at: stop, pose: 'wave' }]} expr={walking ? 'happy' : 'grin'} seed="walker" />
      </Layer>
    </CameraRig>
  );
};

export const SHOTS: ShotMap = {
  opening: makeOpening('How Things', 'Fall'),
  end: makeEnd('How Things Fall', 'Every frame computed, not keyframed'),
  intro: hostShot((s) => [{ at: 0, arm: 'idle', expr: 'smile' }, { at: wordAt(s, 'physics,') - 4, arm: 'present', expr: 'grin' }]),
  drop: Drop3,
  arc: Arc,
  topple: Topple,
  pendulum: Swing,
  springs: Springs,
  walk: Walk,
};
