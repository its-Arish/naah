/**
 * Cold open + Act 1 ("The Warlord, the Emperor and the Sun King").
 * Colour language (from the script): crown = gold, the people = red, money = green, state & police = blue-grey.
 */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, spring, springPop, gravityDrop, projectile, topple, dragDistance, random, onTwos } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { Host } from '@engine/characters/Host';
import { GreyStage, InsertBg } from '@engine/scenes/Backgrounds';
import { OL, Cloud, Hills, Tree } from '@engine/scenes/Parts';
import { Plain } from '@engine/scenes/India';
import { FranceMap, FRANCE_PATH, CORSICA_PATH, CITIES } from '@engine/scenes/France';
import { Versailles, Bastille, TownHall, School, Forest, Desk, DiaryPage, Cathedral, Mitre, SmallCrown, FleurDeLis, RoyalRoom, Workshop, Bill } from '@engine/scenes/FranceScenes';
import { hostShot, wordAt, Drop, PopProp, DropHtml, Rider, type ShotMap, type SP } from '@engine/kit';
import type { Shot } from '@engine/types';

// ------------------------------------------------------------------ colour language + cast
export const GOLD = '#E2B13C', PEOPLE = '#C0392B', MONEY = '#2E8B57', STATE = '#5A6A7A';
export const LOUIS16 = { outfit: { top: '#2E4A9A', bottom: '#F4F7FA', trim: GOLD, sash: '#7FB2E5' }, hat: 'hairlong', hatColor: '#ECECEC' };
export const LOUIS14 = { outfit: { top: '#7A1E2E', bottom: '#F4F7FA', trim: GOLD, cape: '#2E4A9A' }, hat: 'hairlong', hatColor: '#3A2416' };
export const NOBLE = (c = '#6A4A8A') => ({ outfit: { top: c, bottom: '#F4F7FA', trim: GOLD }, hat: 'hairlong', hatColor: '#E8E2D0' });
export const PEASANT = (c = PEOPLE) => ({ outfit: { top: c, bottom: '#6B5A45', belt: '#3A2A22' }, hat: 'none', hair: '#3A2416' });
export const ROMAN = { outfit: { top: '#A8322A', bottom: '#C9A66B', belt: '#6B4A2B' }, hat: 'helmet', hatColor: '#B8A060' };
export const FRANK = { outfit: { top: '#6B5A3A', bottom: '#4A3A2A', cape: '#8A3A2A' }, hat: 'hairlong', hatColor: '#C9932E', beard: true, beardColor: '#A87A2A' };
export const ENGLISH = { outfit: { top: '#F4F7FA', bottom: '#5A5A5A', sash: '#C0392B' }, hat: 'helmet', hatColor: '#9AA0A6' };
export const TEEN = (c: string) => ({ outfit: { top: c, bottom: '#33415C' }, hat: 'none', hair: '#2A1B12' });

const H = (s: Shot, keys: any[], props?: (s: Shot) => React.ReactNode, overlay?: (s: Shot) => React.ReactNode, x = 1380) => hostShot(() => keys, { x, props, overlay });

/** A number that counts up between frames a and b. */
const Counter: React.FC<{ to: number; a: number; b: number; x: number; y: number; label: string; color?: string; size?: number; suffix?: string; prefix?: string }> = ({ to, a, b, x, y, label, color = '#fff', size = 64, suffix = '', prefix = '' }) => {
  const f = useCurrentFrame();
  if (f < a) return null;
  const v = Math.round(to * interpolate(f, [a, b], [0, 1], Easing.out));
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `scale(${springPop(f, a)})`, transformOrigin: 'left center', background: 'rgba(26,20,16,0.85)', borderRadius: 12, padding: '10px 24px', border: `4px solid ${color}` }}>
      <div style={{ fontFamily: 'Tag', fontSize: 28, color: '#ddd', letterSpacing: 2 }}>{label}</div>
      <div style={{ fontFamily: 'TagBold', fontSize: size, color }}>{prefix}{v.toLocaleString('en-US')}{suffix}</div>
    </div>
  );
};
/** A red X that draws itself over something. */
const XMark: React.FC<{ x: number; y: number; at: number; s?: number }> = ({ x, y, at, s = 1 }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at, at + 8], [0, 1], Easing.out);
  if (k <= 0) return null;
  return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-80 -80 L80 80" stroke="#C0392B" strokeWidth={22} strokeLinecap="round" strokeDasharray="230" strokeDashoffset={230 * (1 - Math.min(1, k * 2))} /><path d="M80 -80 L-80 80" stroke="#C0392B" strokeWidth={22} strokeLinecap="round" strokeDasharray="230" strokeDashoffset={230 * (1 - Math.max(0, k * 2 - 1))} /></g>;
};
const headTop = (y: number, s: number) => y - 300 * s;

// ================================================================== COLD OPEN
const CoHost: React.FC<SP> = ({ s }) => (
  <>
    {H(s, [{ at: 0, arm: 'present', expr: 'smile' }, { at: wordAt(s, '1789,'), arm: 'point', expr: 'proud' }], (s) => <PopProp at={wordAt(s, 'Bastille')} x={1000} y={520}><g transform="scale(0.5)"><rect x={-260} y={-160} width={520} height={320} fill="#8F8A80" stroke={OL} strokeWidth={8} />{[-200, -70, 70, 200].map((x) => <rect key={x} x={x - 50} y={-220} width={100} height={380} rx={14} fill="#6E6A62" stroke={OL} strokeWidth={8} />)}</g></PopProp>)({ s })}
    <Label text="14 July 1789" x={1000} y={760} at={6} size={70} color="#B3261E" />
  </>
);

const DiaryDesk: React.FC<SP> = ({ s }) => {
  const at = wordAt(s, 'wrote');
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.0, focus: [1000, 600], push: { at, to: 1.35, len: 24 } }}>
      <RoyalRoom />
      <Layer depth={1}>
        <Chibi x={760} y={830} s={1.25} {...LOUIS16} legs="sit" pose={[{ at: 0, pose: 'idle' }, { at: at - 6, pose: 'scribble' }]} expr="calm" talking={[]} seed="l16" />
        <Desk x={1000} y={740} s={1.1} />
      </Layer>
    </CameraRig>
  );
};

const Rien: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const write = interpolate(f, [4, 30], [0, 1], Easing.inOut);
  const bleed = interpolate(f, [Math.max(40, d - 30), d], [0, 1], Easing.in);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.08, focus: [900, 480] }}><Layer depth={0}><DiaryPage word="Rien." write={write} bleed={bleed} /></Layer></CameraRig>
      <Label text="(French: 'Nothing.')" x={960} y={760} at={34} size={44} color="#F4ECD8" />
    </>
  );
};

/** A deer that bounds away in projectile arcs. */
const Deer: React.FC<{ start: number; x0: number; y0: number }> = ({ start, x0, y0 }) => {
  const f = useCurrentFrame();
  const hop = 18; const k = Math.max(0, Math.floor((f - start) / hop));
  const p = projectile(f, start + k * hop, [x0 + k * 260, y0], [14.4, -10.8], 1.2);
  if (f < start) return <g transform={`translate(${x0} ${y0})`}><DeerBody /></g>;
  return <g transform={`translate(${p.x} ${Math.min(y0, p.y)}) rotate(${-10})`}><DeerBody /></g>;
};
const DeerBody: React.FC = () => (
  <g>
    <ellipse cx={0} cy={-70} rx={70} ry={34} fill="#A8743E" stroke={OL} strokeWidth={4} />
    {[-40, -20, 30, 50].map((x) => <path key={x} d={`M${x} -45 L${x + 4} 0`} stroke={OL} strokeWidth={7} strokeLinecap="round" />)}
    <path d="M60 -90 L84 -140 L110 -136 L96 -96 Z" fill="#A8743E" stroke={OL} strokeWidth={4} />
    <path d="M92 -140 L84 -180 M92 -140 L112 -176 M84 -160 L70 -170" stroke="#6B4A2B" strokeWidth={5} strokeLinecap="round" />
    <ellipse cx={-68} cy={-80} rx={10} ry={8} fill="#fff" stroke={OL} strokeWidth={3} />
  </g>
);
const Hunt: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const miss = s.words?.length ? wordAt(s, 'anything,') : 999;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [900, 650] }}>
        <Forest />
        <Layer depth={1}>
          <Chibi x={620} y={860} s={1.25} {...LOUIS16} hat="tricorn" item="musket" pose={[{ at: 0, pose: 'hold' }, { at: miss, pose: 'shrug' }]} expr={[{ at: 0, expr: 'determined' }, { at: miss, expr: 'sad' }]} talking={[]} seed="l16h" />
          <Deer start={8} x0={1200} y0={860} />
          <g transform="translate(470 790)"><path d="M-40 0 Q-50 70 0 80 Q50 70 40 0 Z" fill="#C9A66B" stroke={OL} strokeWidth={4} /><text x={0} y={52} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#5A3E26">0</text></g>
        </Layer>
      </CameraRig>
      <Label text="Today's hunting: nothing" x={960} y={170} at={wordAt(s, 'report.')} size={56} color="#fff" />
    </>
  );
};

const BastilleFar: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.06, zoomTo: 1.0, focus: [960, 540] }}>
      <Bastille silhouette smoke />
      <Layer depth={1}>{[...Array(14)].map((_, i) => <g key={i} filter="url(#sil)"><Chibi x={200 + i * 115} y={880 + (i % 3) * 18} s={0.7} {...PEASANT()} pose={i % 3 ? 'raise' : 'idle'} expr="determined" talking={[]} seed={'cr' + i} /></g>)}</Layer>
    </CameraRig>
    <Label text="The Bastille, Paris" x={960} y={150} at={10} size={56} color="#fff" />
  </>
);

const SplitKing: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
      <defs><clipPath id="lhalf"><rect x={-200} y={-200} width={1155} height={1500} /></clipPath><clipPath id="rhalf"><rect x={965} y={-200} width={1300} height={1500} /></clipPath></defs>
      <g clipPath="url(#lhalf)"><g transform="translate(-420 0)"><Bastille silhouette smoke /></g></g>
      <g clipPath="url(#rhalf)"><g transform="translate(420 0)"><RoyalRoom /><Layer depth={1}><Chibi x={760} y={830} s={1.2} {...LOUIS16} legs="sit" pose="scribble" expr="calm" talking={[]} seed="l16s" /><Desk x={1000} y={740} s={1.05} /></Layer></g></g>
      <rect x={952} y={-200} width={16} height={1500} fill="#1A1410" />
      <text x={480} y={140} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill="#fff" stroke={OL} strokeWidth={6} style={{ paintOrder: 'stroke' }}>PARIS</text>
      <text x={1440} y={140} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill="#fff" stroke={OL} strokeWidth={6} style={{ paintOrder: 'stroke' }}>VERSAILLES</text>
    </CameraRig>
  );
};

const Jump237: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const yr = Math.round(interpolate(f, [4, Math.min(d - 8, 50)], [1789, 2026], Easing.inOut));
  const spin = f * 14;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.2, zoomTo: 1.0, focus: [960, 500] }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform="translate(960 470)">
            <circle r={230} fill="#F4ECD8" stroke={OL} strokeWidth={10} />
            {[...Array(12)].map((_, i) => <path key={i} d={`M0 -200 V-176`} transform={`rotate(${i * 30})`} stroke={OL} strokeWidth={8} />)}
            <path d="M0 0 V-150" transform={`rotate(${spin})`} stroke={OL} strokeWidth={12} strokeLinecap="round" />
            <path d="M0 0 V-100" transform={`rotate(${spin / 12})`} stroke="#C0392B" strokeWidth={16} strokeLinecap="round" />
          </g>
        </Layer>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 730, textAlign: 'center', fontFamily: 'TagBold', fontSize: 120, color: '#FFD84A', WebkitTextStroke: '6px #1A1410', paintOrder: 'stroke fill' }}>{yr}</div>
      <Label text="+237 years" x={1500} y={300} at={wordAt(s, '237')} size={60} color="#fff" />
    </>
  );
};

const OCT17_PINS = ['Paris', 'Lille', 'Nantes', 'Limoges', 'Bordeaux', 'Marseille', 'Strasbourg'];
const MapOct17: React.FC<SP> = ({ s }) => {
  const at = wordAt(s, 'marched');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [700, 540] }}>
        <InsertBg />
        <Layer depth={1}><FranceMap x={330} y={60} s={0.86} pins={OCT17_PINS.map((c, i) => ({ city: c, at: Math.max(6, at - 30) + i * 6 }))} /></Layer>
      </CameraRig>
      <Counter to={550000} a={wordAt(s, 'half')} b={wordAt(s, 'half') + 40} x={1330} y={330} label="MARCHED, 17 OCT 2026" color="#FF6B57" />
    </>
  );
};
const Limoges: React.FC<SP> = () => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05, focus: [960, 420] }}><TownHall night smoulder /></CameraRig>
    <Label text="Limoges" x={380} y={160} at={8} size={56} color="#F4ECD8" />
  </>
);
const MapCounts: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.04, zoomTo: 1.06, focus: [700, 540] }}>
      <InsertBg />
      <Layer depth={1}><FranceMap x={330} y={60} s={0.86} pins={OCT17_PINS.map((c) => ({ city: c, at: -99, label: false }))} /></Layer>
    </CameraRig>
    {s.id === 's01b12' && <Counter to={1800} a={wordAt(s, 'arrested')} b={wordAt(s, 'arrested') + 30} x={1330} y={200} label="ARRESTED" color="#FF6B57" prefix="~" />}
    {s.id === 's01b13' && <>
      <Counter to={1800} a={-99} b={-98} x={1330} y={200} label="ARRESTED" color="#FF6B57" prefix="~" />
      <Counter to={855} a={wordAt(s, '855')} b={wordAt(s, '855') + 24} x={1330} y={400} label="PARIS (A RECORD)" color="#FFD84A" />
      <Counter to={500} a={wordAt(s, 'injured.') - 6} b={wordAt(s, 'injured.') + 18} x={1330} y={600} label="POLICE INJURED" color="#9FB4C8" suffix="+" />
    </>}
  </>
);

const NotCoup: React.FC<SP> = ({ s }) => {
  const icons = [
    { w: 'coup,', label: 'COUP', draw: <g><path d="M-70 20 Q-70 -60 0 -64 Q70 -60 70 20 Z" fill="#6E7A4A" stroke={OL} strokeWidth={6} /><rect x={-80} y={14} width={160} height={20} fill="#5A6A3A" stroke={OL} strokeWidth={5} /></g> },
    { w: 'war,', label: 'WAR', draw: <g><rect x={-80} y={-20} width={140} height={40} rx={10} fill="#3A3A3A" stroke={OL} strokeWidth={6} transform="rotate(-20)" /><circle cx={-30} cy={30} r={34} fill="#6B4A2B" stroke={OL} strokeWidth={6} /></g> },
    { w: 'election.', label: 'ELECTION', draw: <g><rect x={-70} y={-50} width={140} height={110} fill="#F4F7FA" stroke={OL} strokeWidth={6} /><rect x={-40} y={-56} width={80} height={12} fill={OL} /><path d="M-20 -90 h40 v50 h-40z" fill="#fff" stroke={OL} strokeWidth={4} /></g> },
  ];
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <InsertBg />
      <Layer depth={1}>
        {icons.map((ic, i) => (
          <g key={i}>
            <PopProp at={4 + i * 6} x={480 + i * 480} y={480} s={1.6}>{ic.draw}</PopProp>
            <text x={480 + i * 480} y={680} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill="#fff">{ic.label}</text>
            <XMark x={480 + i * 480} y={470} at={wordAt(s, ic.w)} s={1.2} />
          </g>
        ))}
      </Layer>
    </CameraRig>
  );
};

const SchoolShot: React.FC<SP> = ({ s }) => {
  const at = wordAt(s, 'teenagers');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05, focus: [960, 640] }}>
        <School blockade banner="PAS ASSEZ DE PROFS !" />
        <Layer depth={1}>
          {['#C0392B', '#2E86C1', '#E2B13C', '#8E44AD', '#27AE60'].map((c, i) => (
            <Chibi key={i} x={420 + i * 270 + (i > 2 ? 120 : 0)} y={960} s={1.0} {...TEEN(c)} item={i === 1 ? 'placard:35 PER CLASS' : i === 3 ? 'placard:WHERE IS SIR?' : 'none'} pose={[{ at: 0, pose: 'idle' }, { at: at + i * 3, pose: i % 2 ? 'hold' : 'raise' }]} expr="determined" talking={[]} seed={'tn' + i} />
          ))}
        </Layer>
      </CameraRig>
      <Label text="'Not enough teachers!'" x={960} y={170} at={wordAt(s, 'teachers.') - 4} size={52} color="#FFD84A" />
    </>
  );
};

const CoQuestion: React.FC<SP> = ({ s }) => (
  <>
    {H(s, [{ at: 0, arm: 'shrug', expr: 'smile' }, { at: s.words?.length ? wordAt(s, 'revolution?') : 999, arm: 'point', expr: 'shock' }])({ s })}
    {s.id === 's01b17' && <DropHtml at={wordAt(s, 'revolution?') - 4} left={560} top={760} h={500}><div style={{ fontFamily: 'TagBold', fontSize: 92, color: '#fff', background: PEOPLE, border: '6px solid #1A1410', padding: '10px 34px', borderRadius: 16, transform: 'rotate(-4deg)' }}>REVOLUTION?</div></DropHtml>}
  </>
);

const Checkbox: React.FC<{ x: number; y: number; at: number; label: string; tick?: number }> = ({ x, y, at, label, tick = 999 }) => {
  const f = useCurrentFrame();
  const k = springPop(f, at);
  if (k <= 0) return null;
  const t = interpolate(f, [tick, tick + 8], [0, 1]);
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x={-50} y={-50} width={100} height={100} rx={12} fill="#F4F7FA" stroke={OL} strokeWidth={8} />
      {t > 0 && <path d="M-30 0 L-6 26 L36 -30" fill="none" stroke={MONEY} strokeWidth={16} strokeLinecap="round" strokeDasharray="120" strokeDashoffset={120 * (1 - t)} />}
      <text x={80} y={18} fontFamily="TagBold" fontSize={52} fill="#fff">{label}</text>
    </g>
  );
};
const ChecklistTease: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const billAt = wordAt(s, 'bill');
  const len = interpolate(f, [billAt, billAt + 40], [60, 520], Easing.out);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <InsertBg />
      <Layer depth={1}>
        {[0, 1, 2].map((i) => <Checkbox key={i} x={260} y={300 + i * 170} at={wordAt(s, 'three') + i * 5} label="?" />)}
        {f >= billAt && <Bill x={1350} y={130} len={len} text="THE BILL" rot={-4} />}
      </Layer>
    </CameraRig>
  );
};
const Scan: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const sx = interpolate(f, [6, d - 6], [250, 1120], Easing.inOut);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <InsertBg />
      <Layer depth={1}>
        <FranceMap x={330} y={60} s={0.86} fill="#9FB4C8" />
        <rect x={sx} y={60} width={14} height={960} fill="#5AE0A0" opacity={0.8} />
        <rect x={sx - 60} y={60} width={60} height={960} fill="#5AE0A0" opacity={0.15} />
        {[0, 1, 2].map((i) => <Checkbox key={i} x={1300} y={340 + i * 170} at={6 + i * 4} label="?" />)}
      </Layer>
    </CameraRig>
  );
};
const Internet: React.FC<SP> = ({ s }) => {
  const at = wordAt(s, 'internet');
  const Phone: React.FC<{ text: string; c: string; rot: number }> = ({ text, c, rot }) => (
    <g transform={`rotate(${rot})`}>
      <rect x={-120} y={-220} width={240} height={430} rx={30} fill="#1A1410" stroke={OL} strokeWidth={6} />
      <rect x={-102} y={-190} width={204} height={360} rx={12} fill="#F4F7FA" />
      <rect x={-90} y={-150} width={180} height={110} rx={14} fill={c} />
      <text x={0} y={-82} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#fff">{text}</text>
      {[0, 1, 2].map((k) => <rect key={k} x={-86} y={-10 + k * 40} width={150 - k * 30} height={18} rx={9} fill="#C8CED6" />)}
    </g>
  );
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 500] }}>
      <GreyStage />
      <Layer depth={1}>
        <PopProp at={Math.max(2, at - 8)} x={420} y={460}><Phone text="REVOLUTION!!" c={PEOPLE} rot={-8} /></PopProp>
        <PopProp at={Math.max(4, at - 2)} x={1000} y={460}><Phone text="NOTHING TO SEE" c={STATE} rot={8} /></PopProp>
        <Host x={1480} keys={[{ at: 0, arm: 'shrug', expr: 'smile' }]} talking={[[0, s.talkEnd ?? 60]]} />
      </Layer>
    </CameraRig>
  );
};
const Rewind: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const yr = Math.round(interpolate(f, [4, d - 6], [2026, 500], Easing.inOut));
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.15, focus: [960, 480] }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform="translate(960 470)">
            <circle r={230} fill="#F4ECD8" stroke={OL} strokeWidth={10} />
            <path d="M0 0 V-150" transform={`rotate(${-f * 18})`} stroke={OL} strokeWidth={12} strokeLinecap="round" />
            <path d="M0 0 V-100" transform={`rotate(${-f * 1.5})`} stroke="#C0392B" strokeWidth={16} strokeLinecap="round" />
            <path d="M-260 -60 A270 270 0 0 1 -60 -262" fill="none" stroke="#FFD84A" strokeWidth={14} />
            <path d="M-60 -262 l-34 -20 l6 40 z" fill="#FFD84A" />
          </g>
        </Layer>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 730, textAlign: 'center', fontFamily: 'TagBold', fontSize: 120, color: '#FFD84A', WebkitTextStroke: '6px #1A1410', paintOrder: 'stroke fill' }}>{yr} AD</div>
    </>
  );
};

// ================================================================== ACT 1
const Gaul: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05, focus: [700, 540] }}>
      <InsertBg />
      <Layer depth={1}><FranceMap x={330} y={60} s={0.86} fill="#8FAE6E" corsica={false} /></Layer>
    </CameraRig>
    <Label text="GAUL" x={720} y={520} at={wordAt(s, 'Gaul.')} size={110} color="#fff" />
    <Label text="(roughly modern France)" x={1450} y={300} at={wordAt(s, 'Gaul.') + 10} size={40} color="#ddd" />
  </>
);
const Caesar: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const x = interpolate(f, [0, d], [-200, 400]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03, focus: [960, 640] }}>
        <Plain tents={false} />
        <Layer depth={1}>
          {[...Array(7)].map((_, i) => <Chibi key={i} x={x + 160 + (i % 4) * 190} y={900 + Math.floor(i / 4) * 60} s={0.95} {...ROMAN} item="spear" itemL="shield" legs="march" pose="hold" expr="determined" talking={[]} seed={'rm' + i} delay={i * 3} />)}
          <g transform={`translate(${x + 980} 640)`}><rect x={-6} y={0} width={12} height={260} fill="#6B4A2B" stroke={OL} strokeWidth={3} /><path d="M-50 -10 Q-20 -60 0 -40 Q20 -60 50 -10 Q20 -20 0 0 Q-20 -20 -50 -10 Z" fill={GOLD} stroke={OL} strokeWidth={4} /><rect x={-36} y={10} width={72} height={60} fill="#A8322A" stroke={OL} strokeWidth={3} /><text x={0} y={52} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill={GOLD}>SPQR</text></g>
        </Layer>
      </CameraRig>
      <Label text="Julius Caesar's legions" x={960} y={160} at={wordAt(s, 'Caesar')} size={56} color="#fff" />
    </>
  );
};
const RomeFalls: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const hit = wordAt(s, 'collapsed,');
  const ang = topple(f, hit - 4, { length: 520, g: 2.2, nudge: 0.03, restAngle: 86, e: 0.2 });
  const fx = interpolate(f, [wordAt(s, 'Franks'), d], [-300, 360], Easing.out);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 600], shakes: [{ at: hit + 22, amp: 10, len: 9 }] }}>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDawn)" /></Layer>
      <Layer depth={1}>
        <rect x={-200} y={820} width={2400} height={500} fill="#B8A47E" stroke={OL} strokeWidth={4} />
        <rect x={1060} y={260} width={700} height={50} fill="#E8DCC0" stroke={OL} strokeWidth={5} />
        {[1120, 1300, 1480, 1660].map((x) => <rect key={x} x={x - 30} y={310} width={60} height={510} fill="#E8DCC0" stroke={OL} strokeWidth={5} />)}
        <g transform={`translate(900 820) rotate(${-ang})`}><rect x={-32} y={-520} width={64} height={520} fill="#E8DCC0" stroke={OL} strokeWidth={5} /><rect x={-48} y={-540} width={96} height={30} fill="#D6C49C" stroke={OL} strokeWidth={4} /></g>
        {[0, 1, 2].map((i) => <Chibi key={i} x={fx - i * 170} y={930} s={1.0} {...FRANK} item="spear" legs="walk" pose="hold" expr="grin" talking={[]} seed={'fk' + i} delay={i * 4} />)}
      </Layer>
    </CameraRig>
  );
};
const FranksName: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = s.words?.length ? wordAt(s, s.id === 's02b04' ? "'France'" : 'invaded') : 0;
  const morph = s.id === 's02b05' ? 1 : interpolate(f, [at, at + 14], [0, 1]);
  return (
    <>
      {H(s, [{ at: 0, arm: 'present', expr: 'smile' }, { at: at, arm: 'point', expr: 'grin' }])({ s })}
      <div style={{ position: 'absolute', left: 140, top: 700, fontFamily: 'TagBold', fontSize: 120, color: '#1A1410' }}>
        <span>FRAN</span><span style={{ color: PEOPLE, opacity: 1 - morph, position: 'relative' }}>KS</span><span style={{ position: 'absolute', left: 0, top: 0, color: STATE, opacity: morph, transform: `translateY(${(1 - morph) * 30}px)` }}>FRANCE</span>
      </div>
    </>
  );
};
const Clovis: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const pour = s.words?.length ? wordAt(s, s.id === 's02b07' ? 'king.' : 'baptised') : 0;
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05, focus: [960, 640] }}>
      <Cathedral />
      <Layer depth={1}>
        <g transform="translate(860 860)"><path d="M-160 0 L-130 -150 L130 -150 L160 0 Z" fill="#B8B0A0" stroke={OL} strokeWidth={6} /><ellipse cx={0} cy={-150} rx={130} ry={24} fill="#8FBFE0" stroke={OL} strokeWidth={4} /></g>
        <Chibi x={860} y={760} s={1.1} {...FRANK} hat="hairlong" pose="pray" legs="kneel" expr="calm" talking={[]} seed="clv" />
        <Chibi x={1180} y={900} s={1.15} outfit={{ top: '#F4F7FA', robe: true, trim: GOLD }} hat="none" hair="#B8B0A0" beard beardColor="#D8D8D8" pose="pass" expr="happy" talking={[]} seed="bish" flip />
        <Mitre x={1180} y={headTop(900, 1.15) + 40} s={1.15} />
        {f > 6 && [...Array(10)].map((_, i) => { const p = projectile(f, 6 + i * 3, [1060, 640], [-4, -3], 1.0); return p.y < 720 ? <circle key={i} cx={p.x} cy={p.y} r={6} fill="#8FBFE0" stroke={OL} strokeWidth={1.5} /> : null; })}
        {s.id === 's02b07' && <Drop at={pour - 6} x={860} y={headTop(760, 1.1) + 30} h={420}><SmallCrown x={0} y={0} s={1.2} /></Drop>}
      </Layer>
    </CameraRig>
  );
};
const Charlemagne: React.FC<SP> = ({ s }) => {
  const at = wordAt(s, 'crowned');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06, focus: [960, 600] }}>
        <Cathedral snow />
        <Layer depth={1}>
          <Chibi x={820} y={880} s={1.25} outfit={{ top: '#2E4A9A', robe: true, trim: GOLD, cape: '#7A1E2E' }} hat="none" hair="#E8E8E8" beard beardColor="#E8E8E8" legs="kneel" pose="pray" expr="calm" talking={[]} seed="chm" />
          <Chibi x={1140} y={900} s={1.2} outfit={{ top: '#F4F7FA', robe: true, trim: GOLD }} hat="none" hair="#C8C0B0" pose="raise" expr="happy" talking={[]} seed="pope" flip />
          <Mitre x={1140} y={headTop(900, 1.2) + 40} s={1.2} />
          <Drop at={at} x={820} y={headTop(880, 1.25) + 30} h={360}><SmallCrown x={0} y={0} s={1.3} /></Drop>
        </Layer>
      </CameraRig>
      <Label text="Charlemagne · Christmas Day, 800" x={960} y={150} at={wordAt(s, 'Charlemagne,') || 10} size={56} color="#fff" />
    </>
  );
};
/** Charlemagne's empire as three blocks that drift apart at the Treaty of Verdun (843). */
const Verdun: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const split = s.id === 's02b09' ? 999 : s.id === 's02b10' ? wordAt(s, '843,') : -60;
  const dx = dragDistance(f, split, 9, 14);
  const W = 'M120 260 L420 160 L560 210 L600 420 L560 560 L620 720 L520 880 L300 900 L140 760 L180 560 Z';
  const M = 'M560 210 L760 130 L860 200 L860 420 L820 600 L900 760 L1000 960 L880 1000 L760 860 L620 720 L560 560 L600 420 Z';
  const E = 'M760 130 L1120 90 L1300 200 L1320 420 L1200 600 L980 640 L860 420 L860 200 Z';
  const glow = s.id === 's02b11' ? springPop(f, wordAt(s, 'France.') - 6) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [760, 540] }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform="translate(330 40) scale(0.8)">
            <path d={W} fill={glow > 0 ? '#F2C94C' : GOLD} stroke={OL} strokeWidth={6} transform={`translate(${-dx} 0)`} opacity={1} />
            {glow > 0 && <path d={W} fill="none" stroke="#FFF3A0" strokeWidth={6 + 10 * glow} opacity={0.6} transform={`translate(${-dx} 0)`} />}
            <path d={M} fill={GOLD} stroke={OL} strokeWidth={6} transform={`translate(0 ${dx * 0.3})`} opacity={glow > 0 ? 0.55 : 1} />
            <path d={E} fill={GOLD} stroke={OL} strokeWidth={6} transform={`translate(${dx} 0)`} opacity={glow > 0 ? 0.55 : 1} />
          </g>
        </Layer>
      </CameraRig>
      {s.id !== 's02b09' && <>
        <Label text="WEST" x={560 - dx} y={560} at={split + 6} size={50} color="#1A1410" />
        <Label text="MIDDLE" x={980} y={780} at={split + 10} size={44} color="#1A1410" />
        <Label text="EAST" x={1360 + dx} y={420} at={split + 14} size={50} color="#1A1410" />
      </>}
      <Label text="Treaty of Verdun, 843" x={1500} y={900} at={4} size={48} color="#fff" />
      {s.id === 's02b11' && <Label text="→ France" x={560 - dx} y={640} at={wordAt(s, 'France.') - 4} size={60} color="#FFF3A0" />}
    </>
  );
};
const Capet: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, s.id === 's02b13' ? 'weak.' : 'Capet');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 640] }}>
        <RoyalRoom />
        <Layer depth={1}>
          {[0, 1, 2].map((i) => <Chibi key={i} x={420 + i * 230} y={900} s={1.25} {...NOBLE(['#6A4A8A', '#2E6B4A', '#8A3A2A'][i])} hat="hair" hair="#3A2416" mustache pose="point" expr="grin" talking={[]} seed={'nb' + i} />)}
          <Chibi x={1360} y={900} s={0.8} outfit={{ top: '#9AA0A6', bottom: '#6B5A45' }} hat="none" hair="#6B4A2B" pose="shrug" expr="shock" talking={[]} seed="hugh" flip />
          {s.id === 's02b13' && <Drop at={at - 4} x={1360} y={headTop(900, 0.8) + 50} h={360}><SmallCrown x={0} y={0} s={1.5} /></Drop>}
        </Layer>
      </CameraRig>
      <Label text="Hugh Capet, 987" x={1360} y={300} at={wordAt(s, 'Capet') || 6} size={52} color="#FFD84A" />
    </>
  );
};
/** A family tree that grows down the centuries, crowns on each branch. */
const CapetTree: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const g = interpolate(f, [4, 70], [0, 1], Easing.out);
  const years = [987, 1180, 1328, 1498, 1589, 1643, 1774, 1830, 1848];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <path d="M160 540 H1760" stroke="#C9A66B" strokeWidth={10} strokeDasharray="1600" strokeDashoffset={1600 * (1 - g)} />
          {years.map((y, i) => {
            const x = 160 + i * 200;
            const k = springPop(f, 6 + i * 7);
            return k > 0 ? <g key={y} transform={`translate(${x} ${i % 2 ? 640 : 440}) scale(${k})`}><path d={`M0 ${i % 2 ? -100 : 100} V0`} stroke="#C9A66B" strokeWidth={6} /><SmallCrown x={0} y={0} s={0.8} /><text y={i % 2 ? 60 : -70} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#fff">{y}</text></g> : null;
          })}
        </Layer>
      </CameraRig>
      <Label text="800+ years on the throne" x={960} y={180} at={wordAt(s, '800')} size={60} color="#FFD84A" />
    </>
  );
};
const RememberCapet: React.FC<SP> = ({ s }) => (
  <>
    {H(s, [{ at: 0, arm: 'finger', expr: 'proud' }])({ s })}
    {s.id === 's02b15' && <DropHtml at={wordAt(s, 'Capet.') - 4} left={560} top={780} h={500}><div style={{ fontFamily: 'TagBold', fontSize: 110, color: '#1A1410', background: '#F4ECD8', border: '6px solid #1A1410', padding: '10px 40px', transform: 'rotate(-3deg)', boxShadow: '8px 10px 0 rgba(0,0,0,0.25)' }}>📌 CAPET</div></DropHtml>}
    {s.id === 's02b16' && <div style={{ position: 'absolute', left: 290, top: 690, fontFamily: 'TagBold', fontSize: 110, color: '#1A1410', background: '#F4ECD8', border: '6px solid #1A1410', padding: '10px 40px', transform: 'rotate(-3deg)', boxShadow: '8px 10px 0 rgba(0,0,0,0.25)' }}>📌 CAPET</div>}
  </>
);
const England: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [6, 40], [0, 1], Easing.out);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [700, 400] }}>
      <InsertBg />
      <Layer depth={1}>
        <FranceMap x={330} y={60} s={0.86} />
        {[[[200, 20], [480, 260]], [[0, 160], [260, 300]], [[60, 420], [300, 520]]].map(([p0, p1], i) => {
          const x = p0[0] + (p1[0] - p0[0]) * a, y = p0[1] + (p1[1] - p0[1]) * a;
          return <g key={i}><path d={`M${p0[0]} ${p0[1]} L${x} ${y}`} stroke="#C0392B" strokeWidth={18} strokeLinecap="round" /><circle cx={x} cy={y} r={20} fill="#C0392B" /><g transform={`translate(${x + 20} ${y - 60})`}><rect width={70} height={46} fill="#F4F7FA" stroke={OL} strokeWidth={3} /><path d="M35 0 V46 M0 23 H70" stroke="#C0392B" strokeWidth={10} /></g></g>;
        })}
      </Layer>
    </CameraRig>
  );
};
const Hundred: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const g = interpolate(f, [4, 40], [0, 1], Easing.out);
  const math = s.id === 's02b19' ? wordAt(s, '116') : 999;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          <rect x={260} y={500} width={1400 * g} height={60} rx={30} fill={PEOPLE} stroke={OL} strokeWidth={5} />
          <text x={260} y={470} fontFamily="TagBold" fontSize={56} fill="#fff">1337</text>
          {g > 0.95 && <text x={1660} y={470} textAnchor="end" fontFamily="TagBold" fontSize={56} fill="#fff">1453</text>}
          <text x={960} y={660} textAnchor="middle" fontFamily="Hand" fontSize={90} fill="#fff" opacity={f > math ? 0.35 : 1}>"The Hundred Years' War"</text>
          {f > math && <path d="M560 640 L1360 640" stroke="#C0392B" strokeWidth={10} />}
        </Layer>
      </CameraRig>
      <Label text="1453 − 1337 = 116 years" x={960} y={760} at={math} size={70} color="#FFD84A" />
    </>
  );
};
const Joan: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const x = interpolate(f, [0, d], [260, 900]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 640] }}>
        <Plain tents={false} />
        <Layer depth={0.7}>
          <rect x={1250} y={420} width={700} height={360} fill="#B8B0A0" stroke={OL} strokeWidth={5} />
          {[1280, 1500, 1720, 1900].map((x) => <rect key={x} x={x - 50} y={360} width={100} height={420} fill="#A8A090" stroke={OL} strokeWidth={5} />)}
          <path d="M1540 420 L1600 300 L1660 420 Z" fill="#7C8AA0" stroke={OL} strokeWidth={4} />
          <text x={1600} y={560} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#3A3A3A">ORLÉANS</text>
        </Layer>
        <Layer depth={1}>
          <Rider x={x} y={960} s={1.05} gait="gallop" horse="#F4F7FA" rider={{ outfit: { top: '#AEB6BE', bottom: '#8A9198', sash: '#2E4A9A' }, hat: 'helmet', hatColor: '#AEB6BE', item: 'banner', pose: 'raise', expr: 'determined', seed: 'joan' }} />
        </Layer>
      </CameraRig>
      <Label text="Joan of Arc, 1429" x={760} y={180} at={wordAt(s, 'Joan')} size={56} color="#fff" />
    </>
  );
};
const JoanMemorial: React.FC<SP> = () => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04, focus: [960, 560] }}>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDawn)" /><rect x={-200} y={-200} width={2400} height={1500} fill="#1A1410" opacity={0.35} /></Layer>
      <Layer depth={1}>
        <rect x={-200} y={780} width={2400} height={500} fill="#6B5A45" stroke={OL} strokeWidth={4} />
        <g transform={`translate(960 780) rotate(${Math.sin(f / 40) * 1.5})`}>
          <rect x={-6} y={-460} width={12} height={460} fill="#6B4A2B" stroke={OL} strokeWidth={3} />
          <path d={`M6 -450 Q${120 + Math.sin(f / 15) * 10} -430 220 -440 L220 -300 Q120 -310 6 -290 Z`} fill="#F4F7FA" stroke={OL} strokeWidth={4} />
          <FleurDeLis x={110} y={-340} s={0.6} />
        </g>
      </Layer>
    </CameraRig>
  );
};
const EnglandLeaves: React.FC<SP> = () => {
  const f = useCurrentFrame(); const d = useDuration();
  const x = dragDistance(f, 6, 10, 40);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDay)" /><Cloud x={300} y={160} /></Layer>
      <Layer depth={1}>
        <rect x={-200} y={720} width={2400} height={600} fill="#4A7AA8" stroke={OL} strokeWidth={4} />
        <g transform={`translate(${900 + x} ${700 + Math.sin(f / 10) * 6}) rotate(${Math.sin(f / 13) * 2})`}>
          <path d="M-260 0 L260 0 L200 90 L-200 90 Z" fill="#7A4E2B" stroke={OL} strokeWidth={6} />
          <rect x={-6} y={-330} width={12} height={330} fill="#6B4A2B" />
          <path d="M10 -320 Q140 -250 10 -110 Z" fill="#F4F7FA" stroke={OL} strokeWidth={4} />
          <path d="M60 -300 V-130 M10 -215 H120" stroke="#C0392B" strokeWidth={10} />
          {[-160, -80, 80, 160].map((cx, i) => <Chibi key={i} x={cx} y={8} s={0.55} {...ENGLISH} pose={i % 2 ? 'wave' : 'idle'} expr="sad" talking={[]} seed={'en' + i} />)}
        </g>
      </Layer>
    </CameraRig>
  );
};
const SunKing: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05, focus: [960, 600] }}>
        <Layer depth={0}>
          <rect x={-200} y={-200} width={2400} height={1500} fill="#F2C94C" />
          <g transform={`translate(960 460) rotate(${f * 0.3})`}>{[...Array(24)].map((_, i) => <path key={i} d="M0 0 L1400 -90 L1400 90 Z" transform={`rotate(${i * 15})`} fill="#fff" opacity={0.18} />)}</g>
        </Layer>
        <Layer depth={1}>
          <circle cx={960} cy={560} r={240} fill="#FFE27A" stroke={OL} strokeWidth={6} />
          <Chibi x={960} y={930} s={1.5} {...LOUIS14} pose={[{ at: 0, pose: 'idle' }, { at: 10, pose: 'present' }]} expr="proud" talking={[]} seed="l14" />
          <SmallCrown x={960} y={headTop(930, 1.5) + 10} s={1.2} />
        </Layer>
      </CameraRig>
      {s.id === 's02b24' && <Label text="Louis XIV, the Sun King" x={960} y={140} at={wordAt(s, 'Louis')} size={64} color="#1A1410" />}
      {s.id === 's02b25' && <Label text="72 years on the throne (1643–1715)" x={960} y={140} at={wordAt(s, '72')} size={56} color="#1A1410" />}
    </>
  );
};
const Fronde: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [1100, 560] }}>
      <RoyalRoom night />
      <Layer depth={0.8}>{[0, 1, 2, 3].map((i) => <g key={i} filter="url(#sil)"><Chibi x={1440 + i * 70} y={560 + (i % 2) * 20} s={0.55} {...NOBLE()} pose={i % 2 ? 'raise' : 'hipAngry'} expr="angry" talking={[]} seed={'fr' + i} /></g>)}{[0, 1].map((i) => <circle key={i} cx={1450 + i * 180} cy={320 + Math.sin(f / 4 + i) * 6} r={20} fill="#FFB347" opacity={0.8} />)}</Layer>
      <Layer depth={1}>
        <rect x={360} y={600} width={520} height={200} fill="#7A1E2E" stroke={OL} strokeWidth={6} />
        <rect x={360} y={540} width={520} height={70} rx={20} fill="#F4F7FA" stroke={OL} strokeWidth={5} />
        <Chibi x={560} y={720} s={0.75} {...LOUIS14} hatColor="#6B4A2B" pose="idle" expr="shock" talking={[]} seed="l14k" />
      </Layer>
    </CameraRig>
  );
};
const VersaillesShot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.06, zoomTo: 1.0, focus: [960, 560] }}>
        <Versailles />
        <Layer depth={1.1}>{[...Array(8)].map((_, i) => <Chibi key={i} x={interpolate(f, [0, d], [-100 + i * 140, 500 + i * 140])} y={840} s={0.75} {...NOBLE(['#6A4A8A', '#2E6B4A', '#8A3A2A', '#2E4A9A'][i % 4])} hat="hairlong" hatColor="#E8E2D0" legs="walk" pose="idle" expr="happy" talking={[]} seed={'ct' + i} delay={i * 3} />)}</Layer>
      </CameraRig>
      <Label text="Versailles" x={960} y={140} at={wordAt(s, 'Versailles,')} size={64} color="#1A1410" />
    </>
  );
};
/** Two aristocrats in a tug-of-war over the king's shirt (spring-driven back-and-forth). */
const Shirt: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const tug = Math.sin(onTwos(f) / 6) * 26;
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 600] }}>
      <RoyalRoom />
      <Layer depth={1}>
        <Chibi x={1460} y={860} s={1.3} {...LOUIS14} pose="cross" expr="proud" talking={[]} seed="l14s" flip />
        <Chibi x={560 + tug} y={860} s={1.15} {...NOBLE('#2E6B4A')} pose="pull" expr="angry" talking={[]} seed="d1" />
        <Chibi x={1060 + tug} y={860} s={1.15} {...NOBLE('#8A3A2A')} pose="pull" expr="angry" talking={[]} seed="d2" flip />
        <g transform={`translate(${810 + tug} 630) rotate(${tug / 4})`}><path d="M-70 -40 L-110 -10 L-90 20 L-60 0 L-60 70 L60 70 L60 0 L90 20 L110 -10 L70 -40 Q0 -20 -70 -40 Z" fill="#F4F7FA" stroke={OL} strokeWidth={5} /></g>
        {s.id === 's02b31' && <Label text="(no time to plot)" x={960} y={300} at={wordAt(s, 'plot')} size={52} color="#fff" />}
      </Layer>
    </CameraRig>
  );
};
const Etat: React.FC<SP> = ({ s }) => (
  <>
    {H(s, [{ at: 0, arm: 'present', expr: 'smile' }, { at: wordAt(s, 'ran'), arm: 'shrug', expr: 'grin' }], () => <PopProp at={4} x={540} y={790}><g><rect x={-300} y={-110} width={600} height={220} fill="#F4ECD8" stroke={OL} strokeWidth={6} /><text x={0} y={-10} textAnchor="middle" fontFamily="Hand" fontSize={64} fill="#1A1410">"L'État, c'est moi"</text><text x={0} y={60} textAnchor="middle" fontFamily="Tag" fontSize={34} fill="#5A4A3A">("I am the state")</text></g></PopProp>)({ s })}
    <DropHtml at={wordAt(s, 'said')} left={760} top={980} h={420}><div style={{ fontFamily: 'TagBold', fontSize: 48, color: '#C0392B', border: '6px solid #C0392B', padding: '6px 20px', borderRadius: 10, transform: 'rotate(-8deg)', background: 'rgba(255,255,255,0.85)' }}>PROBABLY NEVER SAID</div></DropHtml>
  </>
);
const Expensive: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [960, 600], shakes: [{ at: wordAt(s, 'wars.'), amp: 8, len: 8 }] }}>
      <Versailles dusk gate={false} />
      <Layer depth={1.1}>
        <rect x={-200} y={-200} width={2400} height={1500} fill="#1A1410" opacity={0.25} />
        {[...Array(26)].map((_, i) => {
          const t0 = (i * 7) % 60; const t = (f - t0 + 600) % 60;
          const p = projectile(t, 0, [700 + (i % 5) * 120, 300], [(random('ex' + i) - 0.5) * 4, 0], 1.0);
          return <ellipse key={i} cx={p.x} cy={p.y} rx={16} ry={16} fill={MONEY} stroke={OL} strokeWidth={3} opacity={p.y < 1000 ? 1 : 0} />;
        })}
        <ellipse cx={960} cy={1000} rx={300} ry={40} fill="#1A1410" stroke={OL} strokeWidth={4} />
      </Layer>
    </CameraRig>
  );
};
const Debt1715: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const out = wordAt(s, '1715');
  const flame = f < out ? 1 : Math.max(0, 1 - (f - out) / 10);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 560] }}>
        <RoyalRoom night />
        <Layer depth={1}>
          <g transform="translate(700 760)"><rect x={-14} y={-140} width={28} height={140} fill="#F4F0E0" stroke={OL} strokeWidth={4} />{flame > 0 && <path d={`M0 -140 Q-14 -180 0 -${140 + 60 * flame} Q14 -180 0 -140`} fill="#FFC94A" stroke="#E8862A" strokeWidth={3} opacity={flame} />}{flame <= 0 && <path d="M0 -150 q-10 -30 6 -60 q-14 -20 0 -50" stroke="#9A9A9A" strokeWidth={5} fill="none" opacity={0.6} />}</g>
          <Drop at={wordAt(s, 'debts,') - 4} x={1160} y={780} h={500}><Bill x={0} y={-500} len={500} text="DEBT, 1715" /></Drop>
        </Layer>
      </CameraRig>
    </>
  );
};
/** The bill handed down three generations, growing with interest. */
const BillPassed: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const second = s.id === 's02b36';
  const t = interpolate(f, [0, d], [0, 1]);
  const kings = [
    { name: 'LOUIS XIV', y: 1715, look: LOUIS14 },
    { name: 'LOUIS XV', y: 1774, look: { ...LOUIS14, outfit: { top: '#2E6B4A', bottom: '#F4F7FA', trim: GOLD }, hatColor: '#E8E2D0' } },
    { name: 'LOUIS XVI', y: 1774, look: LOUIS16 },
  ];
  const holder = second ? Math.min(2, 1 + Math.floor(t * 2)) : Math.min(1, Math.floor(t * 2));
  const len = 200 + (second ? 260 : 0) + 260 * t;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <RoyalRoom />
        <Layer depth={1}>
          {kings.map((k, i) => <Chibi key={i} x={420 + i * 540} y={900} s={1.1} {...k.look} pose={i === holder ? 'carry' : 'idle'} expr={i === holder ? 'shock' : 'happy'} talking={[]} seed={'kg' + i} />)}
          <g transform={`translate(${interpolate(t, [0, 1], [420 + (second ? 540 : 0), 420 + (second ? 1080 : 540)]) + 140} 300)`}><Bill x={0} y={0} len={len} s={0.6} text="DEBT + INTEREST" /></g>
          {kings.map((k, i) => <text key={'n' + i} x={420 + i * 540} y={230} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff" stroke={OL} strokeWidth={6} style={{ paintOrder: 'stroke' }}>{k.name}</text>)}
        </Layer>
      </CameraRig>
    </>
  );
};
const Locksmith: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'budget.') - 10;
  const d = gravityDrop(f, at, { h: 520, g: 3.0, e: 0.25 });
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [900, 600], shakes: [{ at: at + 19, amp: 10, len: 8 }] }}>
        <Workshop />
        <Layer depth={1}>
          <Chibi x={760} y={930} s={1.3} {...LOUIS16} pose={[{ at: 0, pose: 'scribble' }, { at: at + 20, pose: 'bothUp' }]} expr={[{ at: 0, expr: 'happy' }, { at: at + 20, expr: 'shock' }]} talking={[]} seed="l16w" />
          {f >= at && <g transform={`translate(1300 ${640 + d.y}) scale(${d.sx} ${d.sy})`}><Bill x={0} y={-420} len={420} s={1} text="THE BILL" /></g>}
        </Layer>
      </CameraRig>
      <Label text="Louis XVI, amateur locksmith" x={560} y={140} at={wordAt(s, 'locks,') || 6} size={52} color="#fff" />
    </>
  );
};

export const SHOTS_01: ShotMap = {
  co_host: CoHost, diary_desk: DiaryDesk, rien: Rien, hunt: Hunt, bastille_far: BastilleFar, split_king: SplitKing, jump237: Jump237,
  map_oct17: MapOct17, limoges: Limoges, map_counts: MapCounts, not_coup: NotCoup, school: SchoolShot, co_question: CoQuestion,
  checklist_tease: ChecklistTease, scan: Scan, internet: Internet, rewind: Rewind,
  gaul: Gaul, caesar: Caesar, rome_falls: RomeFalls, franks_name: FranksName, clovis: Clovis, charlemagne: Charlemagne, verdun: Verdun,
  capet: Capet, capet_tree: CapetTree, remember_capet: RememberCapet, england: England, hundred: Hundred, joan: Joan,
  joan_memorial: JoanMemorial, england_leaves: EnglandLeaves, sunking: SunKing, fronde: Fronde, versailles: VersaillesShot,
  shirt: Shirt, etat: Etat, expensive: Expensive, debt1715: Debt1715, bill_passed: BillPassed, locksmith: Locksmith,
};
