/** Cold open: "the country with everything except people". */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, springPop, gravityDrop, random, onTwos } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { Host } from '@engine/characters/Host';
import { InsertBg, GreyStage } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { Tank } from '@engine/scenes/Vietnam';
import { Taiga, LogHut, Snow, SnowPine } from '@engine/scenes/Russia';
import { hostShot, wordAt, talk, PopProp, type ShotMap, type SP } from '@engine/kit';
import { Calendar } from '@engine/fx/Infographics';
import { PEASANT, SOLDIER_WW2, RED, PAPER } from './Cast';

const idxOf = (s: SP['s'], ids: string[]) => ids.indexOf(s.id);

// ------------------------------------------------------------------ "Look at Russia on a map."
const Globe: React.FC = () => {
  const f = useCurrentFrame();
  const spin = (f * 0.6) % 360;
  return (
    <g>
      <circle r={170} fill="#4F86B8" stroke={OL} strokeWidth={7} />
      <clipPath id="globeClip"><circle r={166} /></clipPath>
      <g clipPath="url(#globeClip)">
        <path d={`M${-200 + (spin % 40)} -120 q90 -60 210 -50 q120 -10 190 20 q20 50 -40 70 q-120 10 -170 -10 q-80 30 -160 10 q-60 -20 -30 -40 Z`} fill="#C0392B" stroke={OL} strokeWidth={4} />
        <path d="M-150 10 q40 -20 80 0 q30 50 -10 110 q-50 20 -70 -40 Z" fill="#7FA85A" stroke={OL} strokeWidth={4} />
        <path d="M40 40 q60 -10 90 30 q-10 60 -60 70 q-40 -40 -30 -100 Z" fill="#7FA85A" stroke={OL} strokeWidth={4} />
      </g>
      <path d="M-170 0 Q0 60 170 0" stroke="#fff" strokeOpacity={0.35} strokeWidth={4} fill="none" />
    </g>
  );
};
const Look = hostShot((s) => [{ at: 0, arm: 'present', expr: 'smile' }], {
  props: (s) => <PopProp at={wordAt(s, 'map') - 4} x={1020} y={480}><Globe /></PopProp>,
});
const Strange = hostShot(() => [{ at: 0, arm: 'finger', expr: 'grin' }], {
  props: () => <PopProp at={10} x={1030} y={420}><text textAnchor="middle" fontFamily="Hand" fontSize={260} fill="#B3261E" stroke="#B3261E" strokeWidth={4}>?</text></PopProp>,
});

// ------------------------------------------------------------------ "more land than any country / never enough people"
const Vast: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b14 = s.id === 's01b14';
  return (
    <CameraRig move={{ zoomFrom: b14 ? 1.0 : 1.12, zoomTo: b14 ? 0.98 : 1.0, focus: [960, 700] }}>
      <Taiga winter />
      <Layer depth={0.8}>
        <LogHut x={1380} y={772} s={0.34} snow seed="v1" />
        {b14 && [0, 1, 2].map((i) => <Chibi key={i} x={interpolate(f, [0, d], [700 + i * 70, 860 + i * 70])} y={800} s={0.42} {...PEASANT(i)} legs="walk" pose="idle" expr="normal" talking={[]} seed={'vp' + i} delay={i * 3} />)}
      </Layer>
      <Layer depth={1}><Snow density={60} /></Layer>
    </CameraRig>
  );
};

// ------------------------------------------------------------------ the one problem
const PROBLEM = ['s01b15', 's01b16', 's01b17', 's01b18'];
const Icon: React.FC<{ kind: 'arrow' | 'chain' | 'eye' }> = ({ kind }) => {
  const f = useCurrentFrame();
  if (kind === 'arrow') return <g><path d="M-110 10 H70" stroke={RED} strokeWidth={28} strokeLinecap="round" /><path d="M50 -40 L120 10 L50 60 Z" fill={RED} stroke={OL} strokeWidth={5} strokeLinejoin="round" /></g>;
  if (kind === 'chain') return <g>{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={-90 + i * 60} cy={0} rx={38} ry={22} fill="none" stroke="#5A5A64" strokeWidth={13} transform={`rotate(${i % 2 ? 0 : 0} ${-90 + i * 60} 0)`} />)}</g>;
  return <g><path d="M-90 0 Q0 -70 90 0 Q0 70 -90 0 Z" fill="#fff" stroke={OL} strokeWidth={6} /><circle cx={Math.sin(f / 5) * 26} cy={0} r={26} fill="#2A2E3A" /></g>;
};
const Problem = hostShot((s) => {
  const k = PROBLEM.indexOf(s.id);
  return [{ at: 0, arm: k === 0 ? 'finger' : 'present', expr: k === 3 ? 'worried' : 'smile' }];
}, {
  props: (s) => {
    const k = PROBLEM.indexOf(s.id);
    const items: { kind: 'arrow' | 'chain' | 'eye'; word: string; label: string }[] = [
      { kind: 'arrow', word: 'expanding', label: 'expand' }, { kind: 'chain', word: 'chained', label: 'chain' }, { kind: 'eye', word: 'afraid', label: 'fear' },
    ];
    return <g>
      {k === 0 && <PopProp at={wordAt(s, 'one')} x={1080} y={500}><g><rect x={-150} y={-110} width={300} height={220} rx={20} fill={PAPER} stroke={OL} strokeWidth={7} /><text y={60} textAnchor="middle" fontFamily="TagBold" fontSize={180} fill={RED}>1</text></g></PopProp>}
      {k > 0 && items.map((it, i) => (i + 1 <= k ? <PopProp key={i} at={i + 1 === k ? wordAt(s, it.word) - 3 : -99} x={1090} y={330 + i * 190}><g transform="scale(0.85)"><Icon kind={it.kind} /><text x={0} y={92} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#3A3A48">{it.label.toUpperCase()}</text></g></PopProp> : null))}
    </g>;
  },
});

// ------------------------------------------------------------------ darker
const Darker: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [1380, 520] }}>
    <GreyStage dim={0.45} />
    <Layer depth={1}><Host x={1380} keys={[{ at: 0, arm: 'idle', expr: 'worried' }]} talking={talk(s)} dim={0.3} /></Layer>
  </CameraRig>
);

// ------------------------------------------------------------------ the scales: land vs people
const Scales: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b21 = s.id === 's01b21';
  const drops = b21 ? [0, 1, 2, 3, 4].map((i) => wordAt(s, 'people') - 10 + i * 5) : [];
  const landed = drops.filter((t) => f > t + 14).length;
  const tilt = b21 ? interpolate(landed, [0, 5], [14, 3]) : interpolate(f, [0, 30], [0, 14], Easing.out);
  const cx = 960, cy = 470, arm = 420;
  const end = (side: number) => [cx + Math.cos((tilt * Math.PI) / 180) * arm * side, cy + Math.sin((tilt * Math.PI) / 180) * arm * side * -1] as const;
  const [lx, ly] = end(-1), [rx, ry] = end(1);
  const pan = (x: number, y: number, children?: React.ReactNode) => <g transform={`translate(${x} ${y})`}><path d="M0 0 L-120 140 M0 0 L120 140" stroke={OL} strokeWidth={4} /><path d="M-150 140 Q0 200 150 140 Z" fill="#B88A3A" stroke={OL} strokeWidth={6} />{children}</g>;
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <InsertBg />
      <Layer depth={1}>
        <path d={`M${cx} ${cy} V820 M${cx - 120} 820 H${cx + 120}`} stroke="#B88A3A" strokeWidth={18} strokeLinecap="round" />
        <path d={`M${lx} ${ly} L${rx} ${ry}`} stroke="#B88A3A" strokeWidth={16} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={16} fill="#E2B13C" stroke={OL} strokeWidth={4} />
        {pan(lx, ly, <g transform="translate(0 140)"><rect x={-120} y={-150} width={240} height={150} fill="#8FAE5E" stroke={OL} strokeWidth={5} />{[-70, 0, 70].map((x) => <SnowPine key={x} x={x} y={-150} s={0.32} snow={false} />)}<text y={-60} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff" stroke={OL} strokeWidth={6} style={{ paintOrder: 'stroke' }}>LAND</text></g>)}
        {pan(rx, ry, <g transform="translate(0 140)">{drops.map((t, i) => { if (f < t) return null; const g = gravityDrop(f, t, { h: 420, g: 2.4, e: 0.25 }); return <g key={i} transform={`translate(${-80 + i * 40} ${g.y}) scale(${g.sx} ${g.sy})`}><Chibi x={0} y={0} s={0.38} {...PEASANT(i)} pose="idle" expr="sad" talking={[]} seed={'sc' + i} /></g>; })}<text y={70} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#F4ECD8">PEOPLE</text></g>)}
      </Layer>
    </CameraRig>
  );
};

// ------------------------------------------------------------------ serfs, famine victims, prisoners, soldiers (restrained silhouettes)
const SPENT = ['s01b22', 's01b23', 's01b24', 's01b25', 's01b26'];
const Spent: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const k = SPENT.indexOf(s.id);
  const figs = [
    { label: 'SERFS', c: { ...PEASANT(0), item: 'sack' } },
    { label: 'FAMINE VICTIMS', c: { ...PEASANT(1), item: 'bundle' } },
    { label: 'PRISONERS', c: { ...PEASANT(2), outfit: { top: '#5A5A5A', bottom: '#4A4A4A' }, hat: 'bald' } },
    { label: 'SOLDIERS', c: { ...SOLDIER_WW2, item: 'musket' } },
  ];
  const crowd = k === 4 ? interpolate(f, [0, d], [0, 1]) : 0;
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: k === 4 ? 0.94 : 1.02 }}>
      <InsertBg glow={false} />
      <Layer depth={0.6}>
        {k === 4 && [...Array(60)].map((_, i) => { const r = random('cr' + i); if (r > crowd) return null; const row = Math.floor(i / 15); return <g key={i} filter="url(#sil)" opacity={0.18 + row * 0.06}><Chibi x={80 + (i % 15) * 128 + (row % 2) * 60} y={330 + row * 110} s={0.42} {...figs[i % 4].c} pose="idle" expr="normal" talking={[]} seed={'cw' + i} /></g>; })}
      </Layer>
      <Layer depth={1}>
        {figs.map((fg, i) => i <= Math.min(k, 3) ? <g key={i} opacity={springPop(f, i === k ? 2 : -99)}>
          <g filter="url(#sil)"><Chibi x={420 + i * 360} y={760} s={1.05} {...fg.c} pose="idle" expr="normal" talking={[]} seed={'sp' + i} /></g>
          <text x={420 + i * 360} y={820} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#C9C2B4">{fg.label}</text>
        </g> : null)}
        {k === 2 && <g opacity={springPop(f, 2)}>{[...Array(5)].map((_, i) => <rect key={i} x={1090 + i * 25} y={430} width={8} height={330} fill="#3A3A40" />)}</g>}
      </Layer>
    </CameraRig>
  );
};

// ------------------------------------------------------------------ the bill: a tank stops at an empty cradle
const Cradle: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  return <g transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.sin(f / 12) * 5})`}>
    <path d="M-120 -20 Q0 70 120 -20" stroke={OL} strokeWidth={10} fill="none" />
    <path d="M-100 -30 H100 V-120 Q0 -100 -100 -120 Z" fill="#C9935A" stroke={OL} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-100 -120 Q-130 -190 -60 -190 L-60 -120" fill="#E8D8C0" stroke={OL} strokeWidth={5} />
  </g>;
};
const TankStop: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const stop = wordAt(s, 'reach');
  const tx = interpolate(f, [0, stop], [-300, 900], Easing.out);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, shakes: [{ at: stop, amp: 8, len: 8 }] }}>
      <Taiga winter ground={700} />
      <Layer depth={1}>
        <Tank x={tx} y={760} s={0.85} color="#5E6B45" />
        <path d="M1180 540 V800" stroke="#B3261E" strokeWidth={8} strokeDasharray="22 16" />
        <Cradle x={1540} y={780} s={1.1} />
      </Layer>
      <Layer depth={1}><Snow density={40} /></Layer>
    </CameraRig>
  );
};
const BirthRate: React.FC<SP> = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 26], [0, 1], Easing.inOut);
  const pts = [...Array(40)].map((_, i) => { const t = i / 39; return [480 + t * 960, 300 + t * 380 + Math.sin(t * 9) * 26 * (1 - t)]; });
  const n = Math.max(2, Math.round(p * pts.length));
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <InsertBg />
      <Layer depth={1}>
        <path d="M460 260 V720 H1460" stroke="#F4ECD8" strokeWidth={6} fill="none" />
        <path d={'M' + pts.slice(0, n).map((q) => q.join(' ')).join(' L')} stroke="#FF6B5A" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x={470} y={230} fontFamily="TagBold" fontSize={46} fill="#FFD84A">BIRTH RATE</text>
      </Layer>
    </CameraRig>
  );
};

// ------------------------------------------------------------------ rewind a thousand years
const Rewind: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b30 = s.id === 's01b30';
  const yr = Math.round(b30 ? interpolate(f, [0, d - 6], [1600, 880], Easing.inOut) : interpolate(f, [wordAt(s, 'settlement'), d], [2026, 1600], Easing.in));
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05 }}>
      <InsertBg />
      <Layer depth={1}><Calendar x={960} y={460} month="REWIND" day={yr} color="#5A5A64" /></Layer>
    </CameraRig>
  );
};
const NoWalls: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.06, zoomTo: 1.0, focus: [960, 640] }}>
        <Taiga winter={false} ground={780} />
        <Layer depth={0.9}>
          <LogHut x={640} y={800} s={0.6} seed="n1" />
          <LogHut x={1000} y={790} s={0.5} seed="n2" />
          <LogHut x={1300} y={805} s={0.55} seed="n3" />
          <Chibi x={820} y={850} s={0.7} {...PEASANT(0)} pose="idle" expr="normal" talking={[]} seed="nw1" />
          <Chibi x={1160} y={850} s={0.7} {...PEASANT(3)} item="sack" pose="carry" expr="normal" talking={[]} seed="nw2" />
        </Layer>
      </CameraRig>
      <Label text="no walls, no mountains, no sea" x={960} y={170} at={wordAt(s, 'walls')} size={60} />
    </>
  );
};

export const SHOTS_01: ShotMap = {
  co_look: Look, co_strange: Strange, co_vast: Vast, co_problem: Problem, co_darker: Darker,
  co_scales: Scales, co_spent: Spent, co_tank: TankStop, co_birthrate: BirthRate, co_rewind: Rewind, co_nowalls: NoWalls,
};
