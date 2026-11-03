/** Narrator moves demo 2: Laser Pointer, Baton Twirl (spin + flip), Cane Lean, Lever, Fishing Rod, Helicopter, Sword Wipe, Pole-Vault Exit. */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop, spring, random } from '@engine/lib/core';
import { Host, hostLeftHand, hostRightHand, reach } from '@engine/characters/Host';
import { OL } from '@engine/scenes/Parts';
import { makeEnd, talk, wordAt, type ShotMap, type SP } from '@engine/kit';
import { Staff, along, aim, lerpArm, IDLE, Stage, VaultMove } from '@engine/moves';

const X = 1420, Y = 960, RED = '#B3261E', PAPER = '#F4ECD8';
const Card: React.FC<{ x: number; y: number; text: string; k?: number; rot?: number; bg?: string; c?: string; size?: number }> = ({ x, y, text, k = 1, rot = 0, bg = PAPER, c = '#1A1410', size = 38 }) => k > 0 ? (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
    <rect x={-(text.length * size * 0.33 + 34)} y={-size * 0.95} width={text.length * size * 0.66 + 68} height={size * 1.7} rx={12} fill={bg} stroke={OL} strokeWidth={5} />
    <text y={size * 0.36} textAnchor="middle" fontFamily="TagBold" fontSize={size} fill={c}>{text}</text>
  </g>) : null;

// ------------------------------------------------------------------ LASER POINTER / BATON
const Laser: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const T = [{ w: 'land', x: 1050, y: 300 }, { w: 'rivers', x: 1050, y: 470 }, { w: 'winter', x: 1050, y: 640 }].map((t) => ({ ...t, at: wordAt(s, t.w) }));
  const cur = T.reduce((acc, t, i) => (f >= t.at - 6 ? i : acc), -1);
  const arm: [number, number] = [96, 6];
  const h = hostLeftHand(X, Y, 1, arm);
  const angs = T.map((t) => aim(h.x, h.y, t.x + 40, t.y));
  let ang = 0, grip = 370;
  if (cur >= 0) {
    const t0 = T[cur].at - 6, prev = cur > 0 ? angs[cur - 1] : -10;
    ang = interpolate(f, [t0, t0 + 6], [prev, angs[cur]], Easing.out);
    const dist = Math.hypot(T[cur].x + 40 - h.x, T[cur].y - h.y);
    const tap = f - T[cur].at; // recoil on the spoken word
    grip = Math.min(560, dist - 18) - (tap >= 0 && tap < 8 ? Math.sin((tap / 8) * Math.PI) * 26 : 0);
  }
  return (
    <Stage>
      {T.map((t, i) => { const tap = f - t.at; const pulse = tap >= 0 && tap < 12 ? 1 + 0.14 * Math.sin((tap / 12) * Math.PI) : 1; return <Card key={t.w} x={t.x - 60} y={t.y} text={t.w.toUpperCase()} k={springPop(f, t.at - 8) * pulse} bg={i === cur ? '#FFE9A0' : PAPER} />; })}
      {cur < 0 ? <Host x={X} keys={[{ at: 0, arm: 'present', expr: 'smile' }]} talking={talk(s)} />
        : <><Host x={X} keys={[{ at: 0, arm: 'present', expr: 'proud' }]} talking={talk(s)} staffMode="none" leftArm={arm} /><Staff hx={h.x} hy={h.y} ang={ang} gripTop={grip} /></>}
    </Stage>
  );
};

// ------------------------------------------------------------------ BATON TWIRL: spin, then flip end-over-end and catch
const Twirl: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  if (f < 36) return <Stage><Host x={X} keys={[{ at: 0, arm: 'present', expr: 'grin' }]} talking={talk(s)} staffMode="spin" staffRot={f * 26} /></Stage>;
  if (f < 66) {
    const t = f - 36, g = 2.3, v = g * 15;
    const arm: [number, number] = [60, 20];
    const h = hostLeftHand(X, Y, 1, arm);
    const y = h.y - (v * t - 0.5 * g * t * t);
    return <Stage><Host x={X} keys={[{ at: 0, arm: 'idle', expr: 'grin' }]} talking={talk(s)} staffMode="none" leftArm={arm} /><Staff hx={h.x} hy={y} ang={t >= 29 ? 0 : t * 25} gripTop={305} /></Stage>;
  }
  return <Stage><Host x={X} keys={[{ at: 0, arm: 'present', expr: 'proud' }]} talking={talk(s)} /></Stage>;
};

// ------------------------------------------------------------------ WALKING-CANE LEAN
const Cane: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const sx = X - 95, gy1 = 640, gy2 = 690;
  const lean = interpolate(f, [0, 14], [0, -7], Easing.out) + Math.sin(f / 20) * 0.6;
  return (
    <Stage>
      <Card x={1075} y={660} text="ONCE UPON A TIME…" k={springPop(f, 8)} rot={-3} size={26} />
      <g transform={`rotate(${lean} ${X} ${Y})`}>
        <Staff hx={sx} hy={gy1} ang={0} gripTop={290} />
        <Host x={X} keys={[{ at: 0, arm: 'idle', expr: 'proud' }]} talking={talk(s)} staffMode="none" legs="crossed" leftArm={reach(X, Y, 1, -1, sx, gy1)} rightArm={reach(X, Y, 1, 1, sx, gy2)} />
      </g>
    </Stage>
  );
};

// ------------------------------------------------------------------ LEVER / CROWBAR
const Lever: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const F = { x: 1290, y: 820 }, A = 300, L = 310;
  const phi = f < 10 ? -24 : f < 40 ? interpolate(f, [10, 40], [-24, -15], Easing.inOut) : f < 48 ? interpolate(f, [40, 48], [-15, -22], Easing.in) : f < 52 ? -22 : interpolate(f, [52, 84], [-22, -6], Easing.inOut);
  const r = (phi * Math.PI) / 180, dx = Math.cos(r), dy = Math.sin(r);
  const tip = { x: F.x - A * dx, y: F.y - A * dy }, end = { x: F.x + L * dx, y: F.y + L * dy };
  const lift = Math.max(0, 960 - 18 - tip.y), beta = (Math.asin(Math.min(1, lift / 300)) * 180) / Math.PI;
  const strain = (f > 18 && f < 40) || (f > 58 && f < 84);
  const HX = 1800, lean = interpolate(f, [0, 12, 52, 84], [10, 16, 18, 30]);
  const local = (p: { x: number; y: number }) => { const mx = 2 * HX - p.x, my = p.y; const a = (-lean * Math.PI) / 180; return { x: HX + (mx - HX) * Math.cos(a) - (my - Y) * Math.sin(a), y: Y + (mx - HX) * Math.sin(a) + (my - Y) * Math.cos(a) }; };
  const g1 = local(end), g2 = local({ x: end.x + 26, y: end.y + 4 });
  return (
    <Stage shakes={strain ? [{ at: f, amp: 2.5, len: 2 }] : []}>
      <g transform={`rotate(${-beta} 930 960)`}><rect x={930} y={760} width={300} height={200} rx={10} fill="#8A8A90" stroke={OL} strokeWidth={6} /><text x={1080} y={878} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill="#F4F4F0">SERFDOM</text></g>
      <rect x={1245} y={820} width={90} height={140} rx={8} fill="#8A5A34" stroke={OL} strokeWidth={5} />
      <Staff hx={end.x} hy={end.y} ang={aim(tip.x, tip.y, end.x, end.y)} gripTop={0} />
      <g transform={`translate(${2 * HX} 0) scale(-1 1)`}><g transform={`rotate(${lean} ${HX} ${Y})`}>
        <Host x={HX} keys={[{ at: 0, arm: 'idle', expr: f > 84 ? 'grin' : strain ? 'worried' : 'smile' }]} talking={talk(s)} staffMode="none" leftArm={reach(HX, Y, 1, -1, g1.x, g1.y)} rightArm={reach(HX, Y, 1, 1, g2.x, g2.y)} />
      </g></g>
      <Card x={1080} y={620} text="1861 ✓" k={springPop(f, 86)} bg="#C9E0A0" />
    </Stage>
  );
};

// ------------------------------------------------------------------ FISHING ROD: cast up, reel the next point down
const Fish: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const arm: [number, number] = [128, 18];
  const h = hostLeftHand(X, Y, 1, arm);
  const W = ['one', 'two', 'three'].map((w) => wordAt(s, w));
  const slots = [300, 460, 620];
  let ang = -20;
  W.forEach((w) => { const c = w - 14; if (f >= c && f < c + 12) ang = f < c + 5 ? interpolate(f, [c, c + 5], [-20, 25]) : interpolate(f, [c + 5, c + 12], [25, -40], Easing.out); else if (f >= c + 12) ang = -40; });
  const crook = along(h.x, h.y, ang, 520);
  const cards = W.map((w, i) => {
    const c = w - 2, t = f - c;
    if (t < 0) return null;
    const yy = interpolate(t, [0, 16], [-140, slots[i]], Easing.out);
    const swing = t > 16 ? Math.sin((t - 16) / 3) * 10 * Math.exp(-(t - 16) / 12) : 6;
    return { i, x: 1050, y: yy, swing, line: t < 24 };
  }).filter(Boolean) as { i: number; x: number; y: number; swing: number; line: boolean }[];
  return (
    <Stage>
      {cards.map((c) => <g key={c.i}>
        {c.line && <path d={`M${crook.x} ${crook.y} Q${(crook.x + c.x) / 2} ${Math.min(crook.y, c.y) - 60} ${c.x} ${c.y - 40}`} stroke="#3A3A44" strokeWidth={2.5} fill="none" />}
        <g transform={`rotate(${c.swing} ${c.x} ${c.y - 40})`}><Card x={c.x} y={c.y} text={`POINT ${c.i + 1}`} bg={['#FFE9A0', '#C9E0A0', '#BFD8F0'][c.i]} /></g>
      </g>)}
      {cards.length === 0 || cards.every((c) => !c.line) ? null : null}
      <Host x={X} keys={[{ at: 0, arm: 'present', expr: 'grin' }]} talking={talk(s)} staffMode="none" leftArm={arm} />
      <Staff hx={h.x} hy={h.y} ang={ang} gripTop={520} />
      {W.map((w, i) => (f >= w - 14 && f < w - 2 ? <path key={i} d={`M${crook.x} ${crook.y} L${crook.x - 60} -40`} stroke="#3A3A44" strokeWidth={2.5} /> : null))}
    </Stage>
  );
};

// ------------------------------------------------------------------ HELICOPTER: staff spun over his head with both hands, lifts off
const Heli: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const up = interpolate(f, [0, 12], [0, 1], Easing.out);
  const speed = interpolate(f, [12, 40], [0, 55], Easing.in);
  const theta = (speed * f) / 2 + (f > 40 ? (f - 40) * 55 : 0);
  const lift = f < 42 ? 0 : -Math.pow(f - 42, 1.55) * 2.2;
  const dy = Math.max(lift, -200) + (f > 42 ? Math.sin(f / 8) * 10 : 0);
  const dx = f < 100 ? 0 : -interpolate(f, [100, 140], [0, 300], Easing.inOut) + (f > 150 ? (f - 150) * 40 : 0);
  const exitUp = 0;
  const hx = X + dx, hy = Y + dy + exitUp;
  const cy = hy - 660, AL = interpolate(f, [0, 12], [1, 1.55], Easing.out);
  const span = 305 * Math.abs(Math.cos((theta * Math.PI) / 180));
  const blur = Math.min(1, speed / 40);
  const la = reach(hx, hy, 1, -1, hx - 100, hy - 500, 1.55), ra = reach(hx, hy, 1, 1, hx + 100, hy - 500, 1.55);
  return (
    <Stage focus={[1300, 450]}>
      <ellipse cx={hx} cy={Y + 8} rx={Math.max(20, 90 + dy / 6)} ry={14} fill="#000" opacity={Math.max(0.05, 0.22 + dy / 2500)} />
      {f > 38 && f < 70 && [...Array(8)].map((_, i) => { const t = f - 38; return <circle key={i} cx={X + (i - 3.5) * 40 * (1 + t / 10)} cy={Y - t * 0.8} r={14 + t * 0.9} fill="#A8A8A8" opacity={Math.max(0, 0.5 - t / 60)} />; })}
      <g transform={`rotate(${f > 42 ? Math.sin(f / 9) * 4 : 0} ${hx} ${cy})`}>
        <Host x={hx} y={hy} keys={[{ at: 0, arm: 'idle', expr: f > 42 ? 'grin' : 'smile' }]} talking={talk(s)} staffMode="none" armLen={AL} leftArm={up < 1 ? lerpArm(IDLE, la, up) : la} rightArm={up < 1 ? lerpArm([18, 14], ra, up) : ra} />
        {up > 0.6 && [-1, 1].map((sd) => <path key={sd} d={`M${hx + sd * 100} ${hy - 500} L${hx + sd * 30} ${cy + 12}`} stroke={OL} strokeWidth={6} fill="none" strokeLinejoin="round" strokeLinecap="round" />)}
        {blur > 0.3 && <ellipse cx={hx} cy={cy} rx={305} ry={22} fill="#6B4A2B" opacity={blur * 0.22} />}
        <g transform={`translate(${hx} ${cy})`}>
          <line x1={-span} y1={0} x2={span} y2={0} stroke="#6B4A2B" strokeWidth={10} strokeLinecap="round" />
          <path d={`M${Math.cos((theta * Math.PI) / 180) >= 0 ? span : -span} 0 q${Math.cos((theta * Math.PI) / 180) >= 0 ? 18 : -18} -10 ${Math.cos((theta * Math.PI) / 180) >= 0 ? 6 : -6} -16`} stroke="#6B4A2B" strokeWidth={9} fill="none" strokeLinecap="round" />
          <rect x={-8} y={-12} width={16} height={24} rx={4} fill="#3B2A1A" />
        </g>
      </g>
      {f > 46 && f < 90 && <text x={hx - 470} y={cy + 60} fontFamily="TagBold" fontSize={40} fill="#3A3A48" opacity={0.7}>WHUP WHUP</text>}
    </Stage>
  );
};

// ------------------------------------------------------------------ SWORD SWEEP / WIPE
const Sweep: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const S = wordAt(s, 'clear') - 4;
  const ang = f < S - 12 ? 0 : f < S ? interpolate(f, [S - 12, S], [0, 150], Easing.out) : interpolate(f, [S, S + 8], [150, -115], Easing.in);
  const grip = { x: X - 40, y: Y - 430 };
  const la = reach(X, Y, 1, -1, grip.x, grip.y), ra = reach(X, Y, 1, 1, grip.x + 10, grip.y + 30);
  const items = ['1612?', 'BOYARS', 'TAXES', '???', 'MAPS', 'DATES'];
  return (
    <Stage shakes={[{ at: S + 6, amp: 8, len: 6 }]}>
      {items.map((t, i) => {
        const x0 = 960 + (i % 3) * 120 + random('sx' + i) * 40, y0 = 280 + Math.floor(i / 3) * 210 + random('sy' + i) * 80, r0 = (random('sr' + i) - 0.5) * 20;
        const tt = f - (S + 5);
        if (tt < 0) return <Card key={t} x={x0} y={y0} text={t} k={springPop(f, 4 + i * 4)} rot={r0} size={30} />;
        const vx = -(30 + random('vx' + i) * 18), vy = -(14 + random('vy' + i) * 14);
        return <Card key={t} x={x0 + vx * tt} y={y0 + vy * tt + 0.5 * 1.6 * tt * tt} text={t} rot={r0 + tt * (15 + i * 5)} size={30} />;
      })}
      <Card x={1080} y={460} text="FRESH START" k={springPop(f, S + 22)} bg="#C9E0A0" size={40} />
      <Host x={X} keys={[{ at: 0, arm: 'idle', expr: f > S - 12 && f < S + 10 ? 'grin' : 'smile' }]} talking={talk(s)} staffMode="none" leftArm={f < S - 14 ? IDLE : la} rightArm={f < S - 14 ? [18, 14] : ra} />
      {f >= S - 14 ? <Staff hx={grip.x} hy={grip.y} ang={ang} gripTop={540} /> : <Staff hx={hostLeftHand(X, Y, 1, IDLE).x} hy={hostLeftHand(X, Y, 1, IDLE).y} ang={0} />}
      {f >= S && f < S + 10 && <path d={`M${grip.x} ${grip.y - 520} A520 520 0 0 0 ${grip.x - 500} ${grip.y + 120}`} stroke="#fff" strokeOpacity={0.6} strokeWidth={26} fill="none" strokeLinecap="round" />}
    </Stage>
  );
};

// ------------------------------------------------------------------ POLE-VAULT SCREEN EXIT (and back in)
const Exit: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const T0 = d - 50;
  const out = f > T0 + 20 ? interpolate(f, [T0 + 20, T0 + 36], [0, 1], Easing.in) : 0;
  return (
    <Stage>
      <g transform={`translate(${-out * 900} 0)`} opacity={1 - out}><Card x={1060} y={430} text="THE TSARS" k={springPop(f, 6)} size={44} /></g>
      {f < T0 ? <Host x={X} keys={[{ at: 0, arm: 'present', expr: 'smile' }]} talking={talk(s)} /> : <VaultMove t={f - T0} from={X} plant={1700} to={2500} talking={talk(s)} />}
    </Stage>
  );
};
const Back: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return <Stage>{f < 40 ? <VaultMove t={f} from={-300} plant={1080} to={X} talking={talk(s)} /> : <Host x={X} keys={[{ at: 0, arm: 'wave', expr: 'grin' }]} talking={talk(s)} />}</Stage>;
};

const Opening: React.FC<SP> = () => <div style={{ position: 'absolute', inset: 0, background: '#C4C4C4' }} />;
export const SHOTS: ShotMap = { opening: Opening, end: makeEnd('Narrator Moves 2'), mv_laser: Laser, mv_twirl: Twirl, mv_cane: Cane, mv_lever: Lever, mv_fish: Fish, mv_heli: Heli, mv_sweep: Sweep, mv_exit: Exit, mv_back: Back };
