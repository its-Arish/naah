import React from 'react';
import { useCurrentFrame, onTwos, random, interpolate, Easing, spring } from '../lib/core';
import { Layer } from '../fx/Camera';
import { OL, Cloud, Hills, Tree, Bush } from './Parts';
import { subPath } from './India';

// ---------------------------------------------------------------- Hampi market street (and the same framing in ruins)
export const HampiStreet: React.FC<{ ruin?: number }> = ({ ruin = 0 }) => {
  const f = onTwos(useCurrentFrame());
  const live = 1 - ruin;
  return (
    <>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDay)" /></Layer>
      <Layer depth={0.2}>
        {[...Array(10)].map((_, i) => <ellipse key={i} cx={-100 + i * 240} cy={520 - random('hb' + i) * 50} rx={140} ry={110} fill="#C98A6A" stroke={OL} strokeWidth={3} />)}
        {/* gopuram at the end of the street */}
        <g transform="translate(960 600)">
          <path d="M-150 0 L-110 -300 L110 -300 L150 0 Z" fill={ruin > 0.5 ? '#A89C8A' : '#D8C2A0'} stroke={OL} strokeWidth={4} />
          {[...Array(6)].map((_, i) => <path key={i} d={`M${-140 + i * 7} ${-40 - i * 45} H${140 - i * 7}`} stroke="#A89070" strokeWidth={4} />)}
          <path d="M-110 -300 Q0 -360 110 -300 Z" fill="#C9B79A" stroke={OL} strokeWidth={4} />
          <rect x={-40} y={-120} width={80} height={120} rx={40} fill="#4A3A2A" stroke={OL} strokeWidth={3} />
        </g>
      </Layer>
      <Layer depth={0.6}>
        <path d="M-200 600 L2200 600 L2200 1300 L-200 1300 Z" fill="#C9B79A" stroke={OL} strokeWidth={3} />
        <path d="M800 600 L1120 600 L1700 1300 L220 1300 Z" fill="#B9A88A" />
        {/* colonnaded bazaar on both sides */}
        {[-1, 1].map((side) => (
          <g key={side}>
            {[...Array(6)].map((_, i) => {
              const k = 1 - i * 0.14;
              const x = 960 + side * (180 + (5 - i) * 0 + i * 0) + side * (900 - i * 140) * 0.9;
              const top = 600 - 260 * k;
              const broken = ruin > 0.5 && (i + (side > 0 ? 1 : 0)) % 2 === 0;
              return (
                <g key={i}>
                  <rect x={x - 22 * k} y={broken ? 600 - 120 * k : top} width={44 * k} height={broken ? 120 * k : 260 * k} fill="#D8C2A0" stroke={OL} strokeWidth={3} />
                  {!broken && <rect x={x - 40 * k} y={top - 20 * k} width={80 * k} height={22 * k} fill="#C9B79A" stroke={OL} strokeWidth={3} />}
                </g>
              );
            })}
            {!(ruin > 0.5) && <path d={`M${960 + side * 240} ${330} L${960 + side * 1100} ${200} L${960 + side * 1100} ${230} L${960 + side * 240} ${350} Z`} fill="#B5543A" stroke={OL} strokeWidth={3} opacity={live} />}
          </g>
        ))}
      </Layer>
      <Layer depth={0.9}>
        {live > 0.02 && (
          <g opacity={live}>
            {/* gem trays */}
            {[[420, 880], [1500, 880], [640, 760], [1280, 760]].map(([x, y], i) => (
              <g key={i} transform={`translate(${x} ${y}) scale(${y > 800 ? 1 : 0.75})`}>
                <rect x={-130} y={-30} width={260} height={50} rx={8} fill="#8C5A2A" stroke={OL} strokeWidth={3} />
                {[...Array(10)].map((_, k) => {
                  const c = ['#E8EEF2', '#C0392B', '#2E9A4A', '#F4F7FA', '#2E86C1'][k % 5];
                  const tw = Math.max(0, Math.sin(f / 5 + k + i)) * 6;
                  return <g key={k}><path d={`M${-110 + k * 24} -32 l10 -12 l10 12 l-10 12 Z`} fill={c} stroke={OL} strokeWidth={1.5} />{tw > 4 && <path d={`M${-100 + k * 24} -58 v${-tw} M${-100 + k * 24 - tw / 2} ${-58 - tw / 2} h${tw}`} stroke="#fff" strokeWidth={2} />}</g>;
                })}
              </g>
            ))}
            {/* rose baskets */}
            {[[260, 960], [1680, 960]].map(([x, y], i) => (
              <g key={i} transform={`translate(${x} ${y})`}>
                <path d="M-80 0 L80 0 L60 70 L-60 70 Z" fill="#C9A47A" stroke={OL} strokeWidth={3} />
                {[...Array(9)].map((_, k) => <circle key={k} cx={-64 + (k % 5) * 32} cy={-10 - Math.floor(k / 5) * 22} r={16} fill={k % 3 ? '#D1342E' : '#E86A8A'} stroke={OL} strokeWidth={2} />)}
              </g>
            ))}
          </g>
        )}
        {ruin > 0.5 && [[500, 980], [1400, 990]].map(([x, y], i) => <rect key={i} x={x - 70} y={y - 30} width={140} height={40} fill="#BDB09A" stroke={OL} strokeWidth={3} transform={`rotate(${i ? 8 : -6} ${x} ${y})`} />)}
      </Layer>
    </>
  );
};

/** Stone chariot (Hampi icon). */
export const StoneChariot: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-160 0 L160 0 L140 -40 L-140 -40 Z" fill="#BDB09A" stroke={OL} strokeWidth={4} />
    <rect x={-120} y={-220} width={240} height={180} fill="#C9BCA6" stroke={OL} strokeWidth={4} />
    <path d="M-130 -220 L0 -330 L130 -220 Z" fill="#BDB09A" stroke={OL} strokeWidth={4} />
    {[-90, 90].map((cx) => <g key={cx}><circle cx={cx} cy={-30} r={60} fill="#B0A28A" stroke={OL} strokeWidth={4} /><circle cx={cx} cy={-30} r={14} fill="#8A7A62" />{[...Array(8)].map((_, k) => <path key={k} d={`M${cx} -30 L${cx + Math.cos(k * 0.785) * 56} ${-30 + Math.sin(k * 0.785) * 56}`} stroke="#8A7A62" strokeWidth={4} />)}</g>)}
  </g>
);

// ---------------------------------------------------------------- Panipat top-down diagram
export const PanipatDiagram: React.FC<{ charge: number; fire: number; rebound: number; label1761?: boolean }> = ({ charge, fire, rebound }) => {
  const f = useCurrentFrame();
  // Babur's line on the left; Lodi mass on the right charging left
  const front = 1500 - charge * 620 + rebound * 900;
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#C4B98A" />
      {[...Array(20)].map((_, i) => <path key={i} d={`M${random('px' + i) * 1920} ${random('py' + i) * 1080} l14 -6`} stroke="#A89C6A" strokeWidth={3} />)}
      {/* Babur's chained carts */}
      {[...Array(12)].map((_, i) => (
        <g key={i} transform={`translate(560 ${150 + i * 66})`}>
          {i % 3 === 1 ? (
            <g>{/* cannon in the gap */}<rect x={-30} y={-12} width={70} height={24} rx={10} fill="#3A3A3A" stroke={OL} strokeWidth={3} />{fire > 0 && <circle cx={60 + (f % 10) * 4} cy={0} r={12 + (f % 10) * 3} fill="#F4F0E0" opacity={Math.max(0, 0.8 - (f % 10) / 10)} />}</g>
          ) : (
            <g><rect x={-22} y={-26} width={44} height={52} fill="#8C5A2A" stroke={OL} strokeWidth={3} /><path d="M0 26 L0 40" stroke="#5A5A5A" strokeWidth={6} /></g>
          )}
        </g>
      ))}
      {/* gunners behind */}
      {[...Array(10)].map((_, i) => <circle key={i} cx={470} cy={170 + i * 80} r={14} fill="#2E6B4A" stroke={OL} strokeWidth={3} />)}
      {/* Babur's small army */}
      {[...Array(18)].map((_, i) => <rect key={i} x={260 + (i % 3) * 50} y={200 + Math.floor(i / 3) * 110} width={34} height={34} fill="#2E6B4A" stroke={OL} strokeWidth={2} />)}
      {/* enemy mass */}
      {[...Array(60)].map((_, i) => {
        const col = i % 10, row = Math.floor(i / 10);
        const x = front + col * 46 + (row % 2) * 20 + (rebound > 0 ? Math.sin(i * 7) * 30 * rebound : 0);
        return <rect key={i} x={x} y={150 + row * 140 + (col % 2) * 30} width={34} height={34} fill="#B3261E" stroke={OL} strokeWidth={2} />;
      })}
      {/* elephants at the front of the enemy */}
      {[...Array(5)].map((_, i) => {
        const ex = front - 70 + rebound * 160 + (rebound > 0 ? Math.sin(f / 3 + i) * 20 : 0);
        return (
          <g key={i} transform={`translate(${ex} ${210 + i * 160}) rotate(${rebound > 0 ? 180 + Math.sin(f / 4 + i) * 20 : 0})`}>
            <ellipse rx={44} ry={30} fill="#8E8A96" stroke={OL} strokeWidth={3} />
            <path d="M-40 0 L-70 6" stroke="#8E8A96" strokeWidth={14} strokeLinecap="round" />
          </g>
        );
      })}
      {fire > 0 && [...Array(10)].map((_, i) => {
        const t = (f * 3 + i * 17) % 60;
        return <path key={i} d={`M${600 + t * 14} ${170 + i * 66} l26 0`} stroke="#141414" strokeWidth={5} opacity={fire} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- Baburnama / diaries
export const Diary: React.FC<{ lines: { text: string; at: number }[]; stars: number; title?: string }> = ({ lines, stars, title = 'Baburnama' }) => {
  const f = useCurrentFrame();
  return (
    <g transform="translate(960 540)">
      <path d="M0 -380 L-620 -420 L-620 380 L0 420 Z M0 -380 L620 -420 L620 380 L0 420 Z" fill="#F1E2C0" stroke={OL} strokeWidth={6} />
      <path d="M0 -380 V420" stroke="#C9B79A" strokeWidth={6} />
      <text x={-310} y={-320} textAnchor="middle" fontFamily="Hand" fontSize={56} fill="#7A2A22">{title}</text>
      {[...Array(10)].map((_, i) => <path key={i} d={`M-570 ${-240 + i * 56} H-50`} stroke="#D8C6A0" strokeWidth={3} />)}
      {lines.map((l, i) => {
        const hl = interpolate(f, [l.at, l.at + 8], [0, 1]);
        return (
          <g key={i} transform={`translate(60 ${-300 + i * 110})`}>
            <rect x={-6} y={-46} width={520 * hl} height={64} fill="#FFE36A" opacity={0.8} />
            <text x={0} y={0} fontFamily="Hand" fontSize={48} fill="#3A2A1E" opacity={f > l.at - 4 ? 1 : 0.15}>{l.text}</text>
          </g>
        );
      })}
      <g transform="translate(360 -360)">
        {[...Array(5)].map((_, i) => <path key={i} transform={`translate(${i * 52} 0)`} d="M0 -22 L6 -7 L22 -7 L9 3 L14 19 L0 9 L-14 19 L-9 3 L-22 -7 L-6 -7 Z" fill={i < stars ? '#F2C230' : '#D8D2C2'} stroke={OL} strokeWidth={2.5} />)}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- Taj Mahal
export const TajMahal: React.FC<{ x?: number; y?: number; s?: number; build?: number; lean?: number; scaffold?: number }> = ({ x = 960, y = 760, s = 1, build = 1, lean = 0, scaffold = 0 }) => {
  const b = Math.max(0, Math.min(1, build));
  const stage = (lo: number, hi: number) => Math.max(0, Math.min(1, (b - lo) / (hi - lo)));
  const plinth = stage(0, 0.15), body = stage(0.15, 0.45), drum = stage(0.45, 0.6), dome = stage(0.6, 0.85), minar = stage(0.3, 0.95);
  const W = '#F4F2EC', SH = '#DAD6CC';
  const Minaret = ({ mx, dir }: { mx: number; dir: number }) => (
    <g transform={`rotate(${dir * lean} ${mx} 0)`}>
      <g transform={`translate(${mx} 0) scale(1 ${minar})`}>
        <path d="M-22 0 L-16 -400 L16 -400 L22 0 Z" fill={W} stroke={OL} strokeWidth={3} />
        {[0.3, 0.6, 0.9].map((t) => <rect key={t} x={-28} y={-400 * t - 6} width={56} height={10} fill={SH} stroke={OL} strokeWidth={2} />)}
        <path d="M-26 -400 L26 -400 L22 -420 L-22 -420 Z" fill={SH} stroke={OL} strokeWidth={2} />
        <path d="M-24 -420 Q0 -470 24 -420 Z" fill={W} stroke={OL} strokeWidth={3} />
      </g>
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* plinth */}
      <rect x={-520} y={-60 * plinth} width={1040} height={60 * plinth} fill={SH} stroke={OL} strokeWidth={3} />
      <Minaret mx={-470} dir={-1} /><Minaret mx={470} dir={1} />
      <g transform="translate(0 -60)">
        {/* main body with iwan */}
        <g transform={`scale(1 ${body})`}>
          <path d="M-300 0 L-300 -300 L-240 -340 L240 -340 L300 -300 L300 0 Z" fill={W} stroke={OL} strokeWidth={4} />
          <path d="M-100 0 L-100 -220 Q0 -340 100 -220 L100 0 Z" fill={SH} stroke={OL} strokeWidth={4} />
          <path d="M-70 0 L-70 -180 Q0 -270 70 -180 L70 0 Z" fill="#B8B2A6" stroke={OL} strokeWidth={3} />
          {[-220, 220].map((cx) => <g key={cx}><path d={`M${cx - 50} -40 L${cx - 50} -140 Q${cx} -200 ${cx + 50} -140 L${cx + 50} -40 Z`} fill={SH} stroke={OL} strokeWidth={3} /><path d={`M${cx - 50} -170 L${cx - 50} -250 Q${cx} -300 ${cx + 50} -250 L${cx + 50} -170 Z`} fill={SH} stroke={OL} strokeWidth={3} /></g>)}
        </g>
        {/* drum + onion dome + finial */}
        <g transform={`translate(0 -340) scale(1 ${drum})`}><rect x={-150} y={-80} width={300} height={80} fill={W} stroke={OL} strokeWidth={4} /></g>
        {dome > 0 && (
          <g transform={`translate(0 -420) scale(${0.6 + 0.4 * dome} ${dome})`}>
            <path d="M-170 0 Q-210 -150 -60 -250 Q-10 -290 0 -330 Q10 -290 60 -250 Q210 -150 170 0 Z" fill={W} stroke={OL} strokeWidth={4} />
            <path d="M0 -330 V-400" stroke="#C9962C" strokeWidth={8} />
            <circle cx={0} cy={-360} r={10} fill="#C9962C" />
          </g>
        )}
        {[-200, 200].map((cx) => dome > 0.5 && <g key={cx} transform={`translate(${cx} -340)`}><rect x={-34} y={-40} width={68} height={40} fill={W} stroke={OL} strokeWidth={3} /><path d="M-40 -40 Q0 -110 40 -40 Z" fill={W} stroke={OL} strokeWidth={3} /></g>)}
      </g>
      {/* scaffolding */}
      {scaffold > 0 && (
        <g opacity={scaffold} stroke="#8A6A4A" strokeWidth={6}>
          {[...Array(9)].map((_, i) => <path key={i} d={`M${-330 + i * 82} 0 V${-60 - 520 * Math.min(1, b + 0.15)}`} />)}
          {[...Array(7)].map((_, i) => <path key={i} d={`M-330 ${-80 - i * 80} H330`} />)}
        </g>
      )}
    </g>
  );
};

export const TajGarden: React.FC<{ dusk?: boolean }> = ({ dusk }) => (
  <>
    <Layer depth={0}>
      <rect x={-200} y={-200} width={2400} height={1500} fill={dusk ? 'url(#skySunrise)' : 'url(#skyDay)'} />
      <Cloud x={200} y={120} s={1} speed={0.25} />
    </Layer>
    <Layer depth={0.6}>
      <path d="M-200 760 L2200 760 L2200 1300 L-200 1300 Z" fill="#7DA850" stroke={OL} strokeWidth={3} />
      <path d="M880 760 L1040 760 L1200 1300 L720 1300 Z" fill="#7FB7C9" stroke={OL} strokeWidth={3} />
      {[...Array(6)].map((_, i) => <g key={i}><path d={`M${700 - i * 70} ${800 + i * 80} l-14 -60 l28 0 Z`} fill="#2F5E3A" stroke={OL} strokeWidth={2} /><path d={`M${1220 + i * 70} ${800 + i * 80} l-14 -60 l28 0 Z`} fill="#2F5E3A" stroke={OL} strokeWidth={2} /></g>)}
    </Layer>
  </>
);

// ---------------------------------------------------------------- Agra fort window
export const AgraWindow: React.FC = () => (
  <>
    <Layer depth={0}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="url(#skySunrise)" />
    </Layer>
    <Layer depth={0.3}>
      <path d="M-200 640 L2200 640 L2200 760 L-200 760 Z" fill="#7FA0B0" />
      <path d="M-200 640 Q960 600 2200 640" stroke="#DDEFF7" strokeWidth={4} fill="none" />
      <TajMahal x={1080} y={640} s={0.22} />
      <path d="M-200 760 L2200 760 L2200 1300 L-200 1300 Z" fill="#6E8A5A" />
    </Layer>
    <Layer depth={0.8}>
      {/* the room: dark red sandstone wall with a barred arch window */}
      <path d="M-200 -200 H2200 V1300 H-200 Z M720 300 L720 760 L1440 760 L1440 300 Q1080 60 720 300 Z" fill="#5A2418" fillRule="evenodd" stroke={OL} strokeWidth={6} />
      {[...Array(7)].map((_, i) => <path key={i} d={`M${790 + i * 95} 160 V760`} stroke="#2A1610" strokeWidth={14} />)}
      <path d="M720 520 H1440" stroke="#2A1610" strokeWidth={14} />
      <path d="M600 760 H1560 V800 H600 Z" fill="#7A3A22" stroke={OL} strokeWidth={4} />
    </Layer>
  </>
);

// ---------------------------------------------------------------- maps
export const MughalMap: React.FC<{ x: number; y: number; s?: number; extent: number; loud?: number }> = ({ x, y, s = 1, extent, loud = 0 }) => {
  const f = useCurrentFrame();
  const e = Math.max(0, Math.min(1.2, extent));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs><clipPath id="subclipM"><path d={subPath()} /></clipPath></defs>
      <path d={subPath()} fill="#E8DCC0" stroke={OL} strokeWidth={6} />
      <g clipPath="url(#subclipM)">
        <circle cx={400} cy={320} r={60 + e * 760} fill="#2E6B4A" opacity={0.88} />
      </g>
      {loud > 0 && [[300, 520], [420, 700], [620, 560], [200, 420], [520, 880]].map(([px, py], i) => {
        const k = Math.max(0, Math.min(1, loud * 6 - i));
        return k > 0 ? <g key={i} transform={`translate(${px} ${py}) scale(${k * (1 + Math.sin(f / 3 + i) * 0.08)})`}><circle r={36} fill="#B3261E" stroke={OL} strokeWidth={4} /><text y={18} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill="#fff">!</text></g> : null;
      })}
      <path d={subPath()} fill="none" stroke={OL} strokeWidth={6} />
    </g>
  );
};

/** Treasury bar that drains. */
export const TreasuryBar: React.FC<{ x: number; y: number; v: number }> = ({ x, y, v }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={0} width={600} height={60} rx={10} fill="#3A2E24" stroke={OL} strokeWidth={4} />
    <rect x={6} y={6} width={588 * Math.max(0, v)} height={48} rx={6} fill="#E2B13C" />
    <text x={300} y={-16} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#FFD84A">TREASURY</text>
  </g>
);

/** Peacock Throne. */
export const PeacockThrone: React.FC<{ x: number; y: number; s?: number; glow?: number }> = ({ x, y, s = 1, glow = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-260 0 L260 0 L240 -40 L-240 -40 Z" fill="#C9962C" stroke={OL} strokeWidth={4} />
      {[-200, 200].map((cx) => <rect key={cx} x={cx - 20} y={-400} width={40} height={360} fill="#E2B13C" stroke={OL} strokeWidth={4} />)}
      <path d="M-240 -400 Q0 -520 240 -400 Z" fill="#E2B13C" stroke={OL} strokeWidth={4} />
      {/* peacocks on the canopy */}
      {[-90, 90].map((cx, i) => (
        <g key={cx} transform={`translate(${cx} -470) scale(${i ? -1 : 1} 1)`}>
          {[...Array(7)].map((_, k) => <path key={k} d={`M0 0 Q${-60 + k * 6} ${-50 - k * 6} ${-90 + k * 20} ${-30 - Math.abs(k - 3) * 12}`} stroke="#2E9A8A" strokeWidth={10} fill="none" strokeLinecap="round" />)}
          <ellipse cx={0} cy={0} rx={22} ry={16} fill="#1E5E9A" stroke={OL} strokeWidth={3} />
          <circle cx={18} cy={-18} r={10} fill="#1E5E9A" stroke={OL} strokeWidth={3} />
        </g>
      ))}
      <rect x={-170} y={-200} width={340} height={160} rx={20} fill="#B3261E" stroke={OL} strokeWidth={4} />
      {[...Array(12)].map((_, k) => <circle key={k} cx={-150 + k * 27} cy={-250} r={9} fill={['#2E9A4A', '#C0392B', '#E8EEF2'][k % 3]} stroke={OL} strokeWidth={2} />)}
      {/* Koh-i-Noor */}
      <g transform="translate(0 -330)">
        {glow > 0 && <circle r={80 * glow} fill="url(#whiteGlow)" />}
        <path d="M0 -36 L30 -10 L18 30 L-18 30 L-30 -10 Z" fill="#E8F4FF" stroke={OL} strokeWidth={3} />
        <path d="M-30 -10 L30 -10 M0 -36 L-18 30 M0 -36 L18 30" stroke="#9BC8E8" strokeWidth={2} />
      </g>
    </g>
  );
};

export const HillForts: React.FC = () => (
  <>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDay)" /><Cloud x={500} y={160} s={1} speed={0.3} /></Layer>
    <Layer depth={0.3}>
      <path d="M-200 700 L100 330 L360 330 L520 620 L800 260 L1060 260 L1240 640 L1520 300 L1800 300 L2200 700 Z" fill="#8A7A5A" stroke={OL} strokeWidth={3} />
      {[[230, 330], [930, 260], [1660, 300]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx} ${cy})`}>
          <rect x={-120} y={-60} width={240} height={60} fill="#7A6A4A" stroke={OL} strokeWidth={3} />
          {[...Array(6)].map((_, k) => <rect key={k} x={-120 + k * 44} y={-80} width={24} height={20} fill="#7A6A4A" stroke={OL} strokeWidth={2} />)}
          <path d="M0 -80 V-150" stroke={OL} strokeWidth={4} /><path d="M0 -150 L50 -136 L0 -122 Z" fill="#E8862A" stroke={OL} strokeWidth={2} />
        </g>
      ))}
    </Layer>
    <Layer depth={0.65}>
      <path d="M-200 820 Q960 740 2200 820 L2200 1300 L-200 1300 Z" fill="#9AA06A" stroke={OL} strokeWidth={3} />
      <Bush x={200} y={830} s={0.8} c="#6E8A4A" /><Bush x={1700} y={830} s={0.9} c="#6E8A4A" />
    </Layer>
  </>
);

/** Family tree insert for Babur. */
export const FamilyTree: React.FC<{ at: number[] }> = ({ at }) => {
  const f = useCurrentFrame();
  const node = (x: number, y: number, t: string, k: number, c = '#F4EEDD') => {
    const s = Math.max(0, Math.min(1, spring(Math.max(0, f - k), { damping: 9, stiffness: 200 })));
    return s > 0 ? <g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-150} y={-38} width={300} height={76} rx={12} fill={c} stroke={OL} strokeWidth={4} /><text y={14} textAnchor="middle" fontFamily="Hand" fontSize={42}>{t}</text></g> : null;
  };
  const line = (x1: number, y1: number, x2: number, y2: number, k: number) => <path d={`M${x1} ${y1} L${x1 + (x2 - x1) * Math.min(1, Math.max(0, (f - k) / 10))} ${y1 + (y2 - y1) * Math.min(1, Math.max(0, (f - k) / 10))}`} stroke="#F4EEDD" strokeWidth={6} strokeDasharray="4 10" strokeLinecap="round" />;
  return (
    <g>
      {line(560, 260, 560, 760, at[0] + 4)}
      {line(1360, 260, 1000, 760, at[1] + 4)}
      {node(560, 220, 'Timur', at[0], '#E2B13C')}
      {[0, 1, 2].map((i) => node(560, 340 + i * 110, 'great-' + '·'.repeat(i + 1), at[0] + 6 + i * 4))}
      {node(1360, 220, 'Genghis Khan', at[1], '#E2B13C')}
      {node(800, 820, 'BABUR', at[0] + 24, '#E8862A')}
    </g>
  );
};

/** Scholars' debate hall (Ibadat Khana) — respectful, no gags. */
export const DebateHall: React.FC = () => (
  <>
    <Layer depth={0.3}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#E8D5B0" />
      {[...Array(7)].map((_, i) => <path key={i} d={`M${-100 + i * 340} 700 L${-100 + i * 340} 260 Q${70 + i * 340} 100 ${240 + i * 340} 260 L${240 + i * 340} 700`} fill="#F4EEDD" stroke={OL} strokeWidth={4} />)}
      <path d="M-200 60 H2200" stroke="#C9962C" strokeWidth={16} />
    </Layer>
    <Layer depth={0.6}>
      <path d="M-200 700 L2200 700 L2200 1300 L-200 1300 Z" fill="#8C1D18" stroke={OL} strokeWidth={3} />
      <ellipse cx={960} cy={900} rx={700} ry={130} fill="none" stroke="#E2B13C" strokeWidth={8} />
    </Layer>
  </>
);
