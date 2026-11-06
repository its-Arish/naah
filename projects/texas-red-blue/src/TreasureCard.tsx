/** Act cards as a treasure map of Texas: the narrator travels the dotted trail to each act's landmark, which springs to life. */
import React from 'react';
import { useCurrentFrame, interpolate, Easing, springPop, random } from '@engine/lib/core';
import { projectile } from '@engine/lib/physics';
import { OL } from '@engine/scenes/Parts';
import type { Shot } from '@engine/types';
import { QD, STATES, TX_BOX, TexasShape, txXY, txH, FlagArt, Star, Rider, RED, BLUE, GOLD, INK, PURPLE, FLAGS } from './Kit';

// map placement inside the 1920x1080 frame
const MX = 610, MY = 345, MW = 690;
const STOPS: { lon: number; lat: number }[] = [
  { lon: -94.9, lat: 31.6 },   // 1 Six Flags (East Texas, Caddo country)
  { lon: -98.49, lat: 29.42 }, // 2 Alamo, San Antonio
  { lon: -96.15, lat: 30.33 }, // 3 Republic, Washington-on-the-Brazos
  { lon: -94.85, lat: 29.3 },  // 4 Galveston (Juneteenth)
  { lon: -97.74, lat: 30.27 }, // 5 Austin (Reconstruction capitol)
  { lon: -94.13, lat: 30.08 }, // 6 Spindletop, Beaumont
  { lon: -96.8, lat: 32.78 },  // 7 Dallas
  { lon: -101.85, lat: 35.2 }, // 8 Panhandle
  { lon: -98.8, lat: 26.6 },   // 9 Rio Grande Valley (X marks the spot)
];
const START = txXY(-104.5, 30.4, MX, MY, MW); // trail starts out west
const PTS = STOPS.map((p) => txXY(p.lon, p.lat, MX, MY, MW));

const seg = (a: [number, number], b: [number, number], i: number) => {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const bend = (i % 2 ? 1 : -1) * 0.28;
  return { c: [mx - dy * bend, my + dx * bend] as [number, number] };
};
const qpt = (a: [number, number], c: [number, number], b: [number, number], t: number): [number, number] => [
  (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
  (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
];

const Parchment: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#4A3020" />
    {[...Array(14)].map((_, i) => <path key={i} d={`M0 ${i * 80 + 20} Q960 ${i * 80 + (i % 2 ? 40 : 0)} 1920 ${i * 80 + 20}`} stroke="#3A2416" strokeWidth={3} fill="none" opacity={0.6} />)}
    <g filter="url(#wobble)">
      <path d="M190 120 L520 100 L900 125 L1300 98 L1730 118 L1760 420 L1745 760 L1770 990 L1350 975 L960 998 L560 978 L170 995 L188 700 L160 420 Z" fill="#E9D3A3" stroke="#7A4E25" strokeWidth={10} />
      <path d="M190 120 L520 100 L900 125 L1300 98 L1730 118 L1760 420 L1745 760 L1770 990 L1350 975 L960 998 L560 978 L170 995 L188 700 L160 420 Z" fill="url(#warmGlow)" opacity={0.35} />
    </g>
    {[[300, 300], [1500, 820], [420, 880], [1580, 260]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={60 + i * 12} fill="#C9A66B" opacity={0.18} />)}
  </g>
);

const Compass: React.FC<{ f: number }> = ({ f }) => (
  <g transform={`translate(330 790) rotate(${Math.sin(f / 20) * 14})`}>
    <circle r={70} fill="none" stroke="#7A4E25" strokeWidth={4} />
    <path d="M0 -90 L14 0 L0 90 L-14 0 Z" fill={RED} stroke={OL} strokeWidth={3} />
    <path d="M-90 0 L0 14 L90 0 L0 -14 Z" fill="#E9D3A3" stroke={OL} strokeWidth={3} />
    <text y={-100} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#7A4E25">N</text>
  </g>
);

const SeaMonster: React.FC<{ f: number }> = ({ f }) => {
  const x = 1520 + Math.sin(f / 30) * 30, y = 930;
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 1, 2].map((i) => { const up = Math.max(0, Math.sin(f / 7 - i * 0.9)); return <path key={i} d={`M${i * 60 - 30} 0 Q${i * 60} ${-46 * up - 8} ${i * 60 + 30} 0`} fill="#4E8B7A" stroke={OL} strokeWidth={4} />; })}
      <g transform={`translate(-60 ${-26 - Math.max(0, Math.sin(f / 7 + 0.9)) * 20})`}>
        <ellipse rx={30} ry={22} fill="#4E8B7A" stroke={OL} strokeWidth={4} /><circle cx={-10} cy={-6} r={5} fill="#fff" /><circle cx={-11} cy={-6} r={2.5} fill={OL} />
      </g>
      {[0, 1, 2, 3].map((i) => <path key={'w' + i} d={`M${-120 + i * 70} 26 q15 -12 30 0 q15 12 30 0`} stroke="#5D8FA8" strokeWidth={4} fill="none" />)}
    </g>
  );
};

// ---------- landmark icons (drawn at origin; t = frames since arrival, 0 before)
const Visited: React.FC = () => (<g><circle r={22} fill={RED} stroke={OL} strokeWidth={4} /><path d="M-10 0 L-2 9 L12 -9" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" /></g>);
const Future: React.FC = () => (<g opacity={0.55}><circle r={22} fill="none" stroke="#7A4E25" strokeWidth={4} strokeDasharray="6 6" /><text y={11} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#7A4E25">?</text></g>);

const Landmark: React.FC<{ i: number; t: number; f: number }> = ({ i, t, f }) => {
  const k = springPop(t, 0);
  const S = (n: React.ReactNode) => <g transform={`scale(${k})`}>{n}</g>;
  switch (i) {
    case 0: // six mini flags fan out
      return S(<g>{FLAGS.map((fl, j) => { const a = -75 + j * 30, kk = springPop(t, j * 3); return <g key={fl} transform={`rotate(${a * kk}) translate(0 -70) scale(${kk}) rotate(${-a * kk})`}><g transform="translate(-24 -16)"><FlagArt kind={fl} w={48} wave={Math.sin(f / 5 + j)} /></g></g>; })}<circle r={12} fill="#7A5A3A" stroke={OL} strokeWidth={3} /></g>);
    case 1: { // Alamo pops up like a pop-up book, cannon puff
      const up = interpolate(t, [0, 10], [0, 1], Easing.out);
      return (
        <g>
          <g transform={`scale(1 ${up})`}><path d="M-70 0 V-60 H-30 Q-20 -95 0 -100 Q20 -95 30 -60 H70 V0 Z" fill="#E7D7B5" stroke={OL} strokeWidth={5} /><path d="M-14 0 V-36 Q0 -50 14 -36 V0" fill="#5B4632" /></g>
          {t > 14 && <g transform={`translate(90 -20) scale(${springPop(t, 14)})`}><circle r={20 + (t - 14) * 1.2} fill="#fff" opacity={Math.max(0, 1 - (t - 14) / 24)} /><text x={10} y={-26} fontFamily="TagBold" fontSize={34} fill={RED} opacity={Math.max(0, 1 - (t - 14) / 30)}>BOOM!</text></g>}
          <g transform="translate(70 -4)"><rect x={-4} y={-14} width={40} height={14} rx={6} fill="#3B3B3B" stroke={OL} strokeWidth={3} /><circle cx={6} cy={2} r={8} fill="#7A5A3A" stroke={OL} strokeWidth={3} /></g>
        </g>
      );
    }
    case 2: // lone star spins and bounces, empty coin flips
      return S(<g><g transform={`translate(0 ${-Math.abs(Math.sin(t / 6)) * 30})`}><Star x={0} y={-50} r={46} fill="#fff" stroke={OL} rot={t * 6} /></g><g transform={`translate(80 -30) scale(${Math.cos(t / 3)} 1)`}><circle r={22} fill={GOLD} stroke={OL} strokeWidth={3} /><text y={8} textAnchor="middle" fontFamily="TagBold" fontSize={20} fill={INK}>$0</text></g></g>);
    case 3: { // Juneteenth: sunrise over Galveston, chain links fly apart
      const rays = interpolate(t, [0, 20], [0, 1], Easing.out);
      return (
        <g>
          <g opacity={rays}>{[...Array(9)].map((_, j) => <path key={j} d={`M0 -10 L${Math.cos(Math.PI + (j * Math.PI) / 8) * 110} ${-10 + Math.sin(Math.PI + (j * Math.PI) / 8) * 110}`} stroke={GOLD} strokeWidth={8} strokeLinecap="round" />)}</g>
          <path d="M-60 -10 A60 60 0 0 1 60 -10 Z" fill="#FFB54A" stroke={OL} strokeWidth={4} transform={`translate(0 ${20 - rays * 20})`} />
          {[-1, 1].map((d) => { const p = projectile(t, 8, [0, 0], [d * 4, -12], 1.2); return <ellipse key={d} cx={d * 14 + (t > 8 ? p.x : 0)} cy={-30 + (t > 8 ? p.y : 0)} rx={14} ry={9} fill="none" stroke="#6B6F78" strokeWidth={6} opacity={t > 40 ? 0 : 1} />; })}
          <path d="M-90 10 q15 -10 30 0 q15 10 30 0 q15 -10 30 0 q15 10 30 0 q15 -10 30 0 q15 10 30 0" stroke="#5D8FA8" strokeWidth={5} fill="none" />
        </g>
      );
    }
    case 4: // ballot box, ballots flutter in
      return S(<g><rect x={-50} y={-70} width={100} height={70} rx={6} fill="#C9A66B" stroke={OL} strokeWidth={5} /><rect x={-24} y={-74} width={48} height={8} fill={OL} />{[0, 1, 2].map((j) => { const tt = t - 6 - j * 8; if (tt < 0 || tt > 22) return null; const y = interpolate(tt, [0, 22], [-200, -74], Easing.in); return <rect key={j} x={-14 + Math.sin(tt / 2 + j) * 20} y={y} width={28} height={36} rx={3} fill="#fff" stroke={OL} strokeWidth={3} transform={`rotate(${Math.sin(tt / 3) * 25} ${Math.sin(tt / 2 + j) * 20} ${y + 18})`} />; })}</g>);
    case 5: { // oil derrick gusher with droplets
      return S(
        <g>
          <path d="M-40 0 L0 -130 L40 0 M-30 -40 H30 M-20 -80 H20" stroke={OL} strokeWidth={6} fill="none" />
          {t > 6 && <path d={`M0 -130 Q-6 ${-130 - Math.min(90, (t - 6) * 9)} 0 ${-130 - Math.min(110, (t - 6) * 11)}`} stroke="#1A1A1A" strokeWidth={14} strokeLinecap="round" fill="none" />}
          {[...Array(10)].map((_, j) => { if (t < 12) return null; const p = projectile((t - 12) % 30, 0, [0, 0], [(random('dr' + j) - 0.5) * 9, -8 - random('dv' + j) * 6], 0.8); return <circle key={j} cx={p.x} cy={-230 + p.y} r={6} fill="#1A1A1A" />; })}
        </g>,
      );
    }
    case 6: { // mini dial cracks and shakes
      const sh = t > 10 && t < 22 ? Math.sin(t * 3) * 5 : 0;
      return S(<g transform={`translate(${sh} 0)`}><path d="M-60 -10 A60 60 0 0 1 60 -10" stroke={BLUE} strokeWidth={16} fill="none" /><path d="M-60 -10 A60 60 0 0 1 -20 -66" stroke={RED} strokeWidth={16} fill="none" /><path d="M0 -10 L0 -64" stroke={INK} strokeWidth={6} transform={`rotate(${interpolate(t, [10, 30], [45, 20], Easing.out)} 0 -10)`} />{t > 10 && <path d="M-40 -70 L-20 -40 L-34 -20 L-6 0" stroke={INK} strokeWidth={4} fill="none" />}</g>);
    }
    case 7: { // lever flips the needle to red
      const pull = interpolate(t, [6, 18], [0, 1], Easing.inOut);
      return S(<g><path d="M-60 -10 A60 60 0 0 1 60 -10" stroke={PURPLE} strokeWidth={16} fill="none" /><path d="M-60 -10 A60 60 0 0 1 -20 -66" stroke={RED} strokeWidth={16} fill="none" /><path d="M20 -66 A60 60 0 0 1 60 -10" stroke={BLUE} strokeWidth={16} fill="none" /><path d="M0 -10 L0 -64" stroke={INK} strokeWidth={6} transform={`rotate(${45 - pull * 95} 0 -10)`} /><g transform={`translate(80 0) rotate(${-35 + pull * 70})`}><rect x={-4} y={-70} width={8} height={70} fill="#3B3B3B" /><circle cy={-74} r={12} fill={RED} stroke={OL} strokeWidth={3} /></g></g>);
    }
    default: { // treasure chest opens with a glow and an X
      const open = interpolate(t, [8, 20], [0, 1], Easing.out);
      return S(
        <g>
          <path d="M-60 40 L60 -40 M-60 -40 L60 40" stroke={RED} strokeWidth={14} strokeLinecap="round" opacity={0.85} transform="translate(0 30)" />
          {open > 0 && <circle cx={0} cy={-40} r={70 * open} fill="url(#sunGlow)" opacity={0.9} />}
          <rect x={-55} y={-40} width={110} height={60} rx={8} fill="#8B5A2B" stroke={OL} strokeWidth={5} />
          <g transform={`rotate(${-open * 60} -55 -40)`}><path d="M-55 -40 Q0 -90 55 -40 Z" fill="#A0693A" stroke={OL} strokeWidth={5} /></g>
          <rect x={-8} y={-30} width={16} height={18} fill={GOLD} stroke={OL} strokeWidth={3} />
        </g>,
      );
    }
  }
};

export const TreasureCard: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(8, ((s as any).n ?? 1) - 1)); // stop index for this act
  const [act, ...rest] = (s.title ?? '').split(':');
  const title = rest.join(':').trim() || act;
  const from = n === 0 ? START : PTS[n - 1], to = PTS[n];
  const { c } = seg(from, to, n);
  const T0 = 14, T1 = 74;
  const p = interpolate(f, [T0, T1], [0, 1], Easing.inOut);
  const pos = qpt(from, c, to, p);
  const ahead = qpt(from, c, to, Math.min(1, p + 0.03));
  const hop = Math.abs(Math.sin(p * Math.PI * 4)) * 18;
  const arrive = f - T1;
  // camera: whole map, easing toward the current stop
  const z = interpolate(f, [0, 90], [1, 1.22], Easing.inOut);
  const fx = interpolate(f, [0, 90], [960, (from[0] + to[0]) / 2 * 0.4 + to[0] * 0.6], Easing.inOut);
  const fy = interpolate(f, [0, 90], [560, (from[1] + to[1]) / 2 * 0.4 + to[1] * 0.6], Easing.inOut);
  const cam = `translate(960 560) scale(${z}) translate(${-fx} ${-fy})`;
  const scroll = interpolate(f, [4, 22], [0, 1], Easing.out);
  // trail paths so far
  const trail: React.ReactNode[] = [];
  let prev = START;
  for (let i = 0; i < 9; i++) {
    const cc = seg(prev, PTS[i], i).c;
    const d = `M${prev[0]} ${prev[1]} Q${cc[0]} ${cc[1]} ${PTS[i][0]} ${PTS[i][1]}`;
    if (i < n) trail.push(<path key={i} d={d} stroke={RED} strokeWidth={6} strokeDasharray="14 10" fill="none" strokeLinecap="round" />);
    else if (i === n) {
      trail.push(<path key={i + 'f'} d={d} stroke="#7A4E25" strokeWidth={4} strokeDasharray="4 12" fill="none" opacity={0.6} />);
      trail.push(<path key={i} d={d} stroke={RED} strokeWidth={6} strokeDasharray="14 10" fill="none" strokeLinecap="round" pathLength={1000} style={{ strokeDasharray: `${p * 1000} 1000` }} />);
    } else trail.push(<path key={i} d={d} stroke="#7A4E25" strokeWidth={4} strokeDasharray="4 12" fill="none" opacity={0.45} />);
    prev = PTS[i];
  }
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <Parchment />
        <defs><clipPath id="parchClip"><path d="M196 128 L520 108 L900 133 L1300 106 L1722 126 L1752 420 L1737 760 L1762 982 L1350 967 L960 990 L560 970 L178 987 L196 700 L168 420 Z" /></clipPath></defs>
        <g clipPath="url(#parchClip)"><g transform={cam}>
          {/* GIS neighbours (QGIS states + Mexico) inked faintly, like an old survey map */}
          <g transform={`translate(${MX} ${MY}) scale(${MW / TX_BOX.w}) translate(${-TX_BOX.x} ${-TX_BOX.y})`}>
            {QD.countries.filter((c) => c.iso === 'MEX').map((c) => <path key={c.iso} d={c.d} fill="#E6D2A2" stroke="#8B6A3E" strokeWidth={2} strokeDasharray="6 5" vectorEffect="non-scaling-stroke" />)}
            {STATES.filter((st) => st.name !== 'Texas').map((st) => <path key={st.name} d={st.d} fill="#EAD8AC" stroke="#8B6A3E" strokeWidth={1.6} strokeDasharray="6 5" vectorEffect="non-scaling-stroke" />)}
          </g>
          <TexasShape x={MX} y={MY} w={MW} fill="#E2C690" stroke="#6B4423" sw={6} />
          {[...Array(6)].map((_, i) => <path key={i} d={`M${MX + 60 + i * 110} ${MY + txH(MW) * 0.25 + (i % 3) * 60} l14 -18 l14 18`} stroke="#9B7A4B" strokeWidth={3} fill="none" />)}
          <text x={MX + MW * 0.18} y={MY + txH(MW) * 0.72} fontFamily="Hand" fontSize={38} fill="#7A4E25" transform={`rotate(-8 ${MX + MW * 0.18} ${MY + txH(MW) * 0.72})`}>Rio Grande</text>
          <text x={MX + MW * 0.8} y={MY + txH(MW) * 0.95} fontFamily="Hand" fontSize={40} fill="#5D8FA8">Gulf of Mexico</text>
          {trail}
          <circle cx={START[0]} cy={START[1]} r={10} fill="#7A4E25" />
          {PTS.map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              {i < n && <g transform="scale(0.8)"><Visited /></g>}
              {i > n && <g transform="scale(0.8)"><Future /></g>}
              {i === n && arrive < 0 && <g transform="scale(0.8)"><Future /></g>}
              {i === n && arrive >= 0 && <g transform="translate(34 -18) scale(0.95)"><Landmark i={i} t={arrive} f={f} /></g>}
            </g>
          ))}
          {/* traveller: narrator riding his staff along the trail, then hopping off at the stop */}
          <g transform={`translate(${pos[0] - interpolate(arrive, [0, 10], [0, 70], Easing.out)} ${pos[1] - 26 - hop})`}>
            <Rider x={0} y={0} s={0.16} speed={p > 0 && p < 1 ? 0.8 : 0} flip={ahead[0] < pos[0]} arm={arrive > 0 ? 'wave' : 'point'} expr="grin" />
          </g>
        </g></g>
        <SeaMonster f={f} />
        <Compass f={f} />
      </svg>
      {/* title scroll */}
      <div style={{ position: 'absolute', left: 960 - 520 * scroll, top: 120, width: 1040 * scroll, height: 190, overflow: 'hidden', background: '#F1DFB4', border: '6px solid #7A4E25', borderRadius: 20, boxShadow: '0 8px 0 rgba(0,0,0,0.25)' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 18, textAlign: 'center', fontFamily: 'Hand', fontSize: 52, color: RED, whiteSpace: 'nowrap' }}>{act}</div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: 'Hand', fontSize: title.length > 22 ? 74 : 88, color: INK, WebkitTextStroke: '2px #141414', whiteSpace: 'nowrap', transform: `scale(${springPop(f, 16)})` }}>{title}</div>
      </div>
      <div style={{ position: 'absolute', left: 960 - 520 * scroll - 26, top: 108, width: 40, height: 214, background: '#8B5A2B', border: '5px solid #4A3020', borderRadius: 20 }} />
      <div style={{ position: 'absolute', left: 960 + 520 * scroll - 14, top: 108, width: 40, height: 214, background: '#8B5A2B', border: '5px solid #4A3020', borderRadius: 20 }} />
    </div>
  );
};
