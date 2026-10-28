/**
 * Act 11 — "Same Fire, Different Arsonists". Every camp gets the same treatment: a labelled
 * silhouette (no likenesses of real people) and a card paraphrasing what they said, as reported.
 * The sketch at the end uses two fictional officials.
 */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, spring, springPop, gravityDrop, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { Desk } from '@engine/scenes/FranceScenes';
import { hostShot, wordAt, PopProp, DropHtml, type ShotMap, type SP } from '@engine/kit';
import { GOLD, PEOPLE, MONEY, STATE } from './Shots01';
import { PM_FIG } from './Shots07';
import { TRICOLORE } from './Shots04';

const CAMP = {
  gov: { c: '#E8C23A', ink: '#1A1410', lab: 'THE GOVERNMENT' },
  lfi: { c: '#C0392B', ink: '#fff', lab: 'FRANCE UNBOWED (far left)' },
  rn: { c: '#1E2E6A', ink: '#fff', lab: 'NATIONAL RALLY (far right)' },
  abroad: { c: '#5A5A64', ink: '#fff', lab: 'ABROAD' },
  analysts: { c: '#2E6B4A', ink: '#fff', lab: 'ECONOMISTS & ANALYSTS' },
} as const;
type Camp = keyof typeof CAMP;
const Silhouette: React.FC<{ x: number; y: number; name: string; role: string; c: string; k: number; s?: number }> = ({ x, y, name, role, c, k, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${k * s})`}>
    <rect x={-170} y={-250} width={340} height={420} rx={20} fill={c} stroke={OL} strokeWidth={7} />
    <g filter="url(#sil)"><Chibi x={0} y={90} s={1.05} {...PM_FIG} pose="idle" expr="normal" talking={[]} seed={'si' + name} /></g>
    <rect x={-170} y={100} width={340} height={70} fill="rgba(0,0,0,0.55)" />
    <text y={136} textAnchor="middle" fontFamily="TagBold" fontSize={name.length > 16 ? 26 : 32} fill="#fff">{name}</text>
    <text y={162} textAnchor="middle" fontFamily="TagBold" fontSize={20} fill="#E8E2D8">{role}</text>
  </g>
);
const Quote: React.FC<{ at: number; text: string; left?: number; top?: number; size?: number; reported?: boolean }> = ({ at, text, left = 1220, top = 430, size = 44, reported = true }) => {
  const f = useCurrentFrame();
  const k = springPop(f, at);
  return k > 0 ? <div style={{ position: 'absolute', left, top, width: 760, transform: `translate(-50%,-50%) scale(${k})`, background: '#F4ECD8', border: '6px solid #1A1410', borderRadius: 24, padding: '22px 30px', boxShadow: '8px 10px 0 rgba(0,0,0,0.3)' }}>
    <div style={{ fontFamily: 'Hand', fontSize: size, color: '#1A1410', lineHeight: 1.25 }}>{text}</div>
    {reported && <div style={{ fontFamily: 'Tag', fontSize: 20, color: '#5A4A3A', marginTop: 8 }}>as reported · paraphrased</div>}
  </div> : null;
};
const CampTag: React.FC<{ camp: Camp }> = ({ camp }) => (
  <div style={{ position: 'absolute', left: 960, top: 70, transform: 'translateX(-50%)', background: CAMP[camp].c, color: CAMP[camp].ink, border: '5px solid #1A1410', borderRadius: 12, padding: '6px 26px', fontFamily: 'TagBold', fontSize: 40, whiteSpace: 'nowrap' }}>{CAMP[camp].lab}</div>
);

const Smoke = hostShot((s) => [{ at: 0, arm: s.id === 's12b01' ? 'present' : 'finger', expr: 'normal' }], {
  props: (s) => {
    const f = useCurrentFrame();
    if (s.id !== 's12b01') return null;
    return <g transform="translate(1040 560)">{[...Array(6)].map((_, i) => { const t = (f + i * 22) % 130; return <circle key={i} cx={Math.sin(i) * 40 + t * 0.2} cy={60 - t * 1.6} r={40 + t * 0.4} fill="#8A8A94" opacity={0.6 * (1 - t / 130)} />; })}{[['#E8C23A', -150, -120], ['#C0392B', 140, -160], ['#1E2E6A', -120, 40], ['#2E6B4A', 150, 20]].map(([c, x, y]: any, i) => <circle key={i} cx={x} cy={y} r={22 * springPop(f, wordAt(s, 'different') + i * 4)} fill={c} stroke={OL} strokeWidth={4} />)}</g>;
  },
});
const GovCamp: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const id = s.id;
  const who = id === 's12b05' ? { name: 'THE PRESIDENT', role: 'Emmanuel Macron' } : ['s12b06', 's12b07', 's12b08'].includes(id) ? { name: 'THE PRIME MINISTER', role: 'Sébastien Lecornu' } : { name: 'THE GOVERNMENT', role: 'official line' };
  const q: Record<string, [string, string]> = {
    s12b04: ['hijacked', 'A peaceful protest was hijacked by a violent minority.'],
    s12b05: ['room', 'No room for violence. Rioters will be prosecuted.'],
    s12b06: ['impose', 'Nobody will impose a political agenda through violence.'],
    s12b07: ['accused', 'France Unbowed is using the unrest as a warm-up…'],
    s12b08: ['presidential', '…for the presidential election.'],
  };
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
        <InsertBg />
        <Layer depth={1}><Silhouette x={480} y={500} name={who.name} role={who.role} c={CAMP.gov.c} k={springPop(f, 2)} /></Layer>
      </CameraRig>
      <CampTag camp="gov" />
      <Quote at={wordAt(s, q[id][0]) - 4} text={q[id][1]} />
    </>
  );
};
const LfiCamp: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const q: Record<string, [string, string]> = {
    s12b09: ['rejected', 'Rejected the charge.'],
    s12b10: ['prove', '"Prove it, or apologise."'],
    s12b11: ['backed', 'Backs the students; criticises tear gas and batons against young people.'],
  };
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
        <InsertBg />
        <Layer depth={1}><Silhouette x={480} y={500} name="J.-L. MÉLENCHON" role="party leader" c={CAMP.lfi.c} k={springPop(f, 2)} /></Layer>
      </CameraRig>
      <CampTag camp="lfi" />
      <Quote at={wordAt(s, q[s.id][0]) - 4} text={q[s.id][1]} />
    </>
  );
};
const RnCamp: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const who = s.id === 's12b14' ? { name: 'JORDAN BARDELLA', role: 'party president' } : ['s12b15', 's12b16'].includes(s.id) ? { name: 'MARINE LE PEN', role: 'party figurehead' } : { name: 'NATIONAL RALLY', role: 'party line' };
  const q: Record<string, [string, string]> = {
    s12b12: ['failed', 'The government has failed…'],
    s12b13: ['basic', '…at the most basic job of a state: keeping order.'],
    s12b14: ['lamentable.', "The President's TV address was \"lamentable\"."],
    s12b15: ['exhausted', 'The government is exhausted and incapable.'],
    s12b16: ['spoiled', 'Rioters spoiled a march for purchasing power.'],
  };
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
        <InsertBg />
        <Layer depth={1}><Silhouette x={480} y={500} name={who.name} role={who.role} c={CAMP.rn.c} k={springPop(f, 2)} /></Layer>
      </CameraRig>
      <CampTag camp="rn" />
      <Quote at={wordAt(s, q[s.id][0]) - 4} text={q[s.id][1]} />
    </>
  );
};
const Abroad: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b17 = s.id === 's12b17';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
        <InsertBg />
        <Layer depth={1}>
          {b17 ? <Silhouette x={480} y={500} name="DONALD TRUMP" role="US President" c={CAMP.abroad.c} k={springPop(f, 2)} /> : <Silhouette x={480} y={500} name="THE PRESIDENT" role="Emmanuel Macron" c={CAMP.gov.c} k={springPop(f, 2)} />}
          {s.id === 's12b19' && <g transform={`translate(1500 790) scale(${springPop(f, wordAt(s, 'midterms'))})`}><rect x={-210} y={-50} width={420} height={100} rx={14} fill="#F4F7FA" stroke={OL} strokeWidth={5} /><text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#1A1410">US MIDTERMS · 3 NOV</text></g>}
        </Layer>
      </CameraRig>
      <CampTag camp={b17 ? 'abroad' : 'gov'} />
      {b17 && <Quote at={wordAt(s, 'blamed') - 4} text={"Blamed \"mass migration\" and Islam."} />}
      {!b17 && <Quote at={s.id === 's12b18' ? wordAt(s, 'foreign') - 4 : -99} text="Foreign leaders are exploiting French riots for their own election purposes." top={400} />}
    </>
  );
};
const Analysts: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s12b20', 's12b21', 's12b22'].indexOf(s.id);
  const items = [['debt,', 'DEBT', '#B3261E'], ['prices', 'PRICES', '#E8742A'], ['schools.', 'SCHOOLS', '#2E4A9A']];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
        <InsertBg />
        <Layer depth={1}>
          {items.map(([w, lab, c], i) => { const k = springPop(f, idx === 1 ? wordAt(s, w) : idx > 1 ? -99 : wordAt(s, 'three') + i * 6); return k > 0 ? <g key={i} transform={`translate(${520 + i * 440} 480) scale(${k})`}><circle r={150} fill={c} stroke={OL} strokeWidth={8} /><text y={16} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill="#fff">{lab}</text></g> : null; })}
          {idx === 2 && <g opacity={springPop(f, wordAt(s, 'drifted'))}><path d="M960 700 Q1300 700 1500 820" stroke="#F4ECD8" strokeWidth={8} strokeDasharray="16 12" fill="none" /><text x={1500} y={700} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#F4ECD8">"drifting to lawlessness"</text><text x={1500} y={740} textAnchor="middle" fontFamily="Tag" fontSize={24} fill="#B8B8C0">(some analysts)</text></g>}
        </Layer>
      </CameraRig>
      <CampTag camp="analysts" />
    </>
  );
};
/** Two columns that fill up: both can be true at once. */
const BothSides: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const order = ['s12b23', 's12b24', 's12b25', 's12b26', 's12b27', 's12b28', 's12b29', 's12b30'];
  const idx = order.indexOf(s.id);
  const L = [['half a million marched peacefully', 1], ['arson and looting hit shopkeepers', 2], ['…local workers, public services', 3], ['no grievance justifies it', 3]] as const;
  const R = [['school staffing figures are documented', 4], ['the grievances came first', 5], ['policing deserves scrutiny', 6]] as const;
  const shown = (b: number, wordIdx: number) => idx > b || (idx === b && f > 20 + wordIdx * 30);
  const both = idx === 7 ? springPop(f, wordAt(s, 'true')) : 0;
  const Col: React.FC<{ x: number; title: string; c: string; rows: readonly (readonly [string, number])[] }> = ({ x, title, c, rows }) => (
    <g transform={`translate(${x} 160)`}>
      <rect x={-380} y={0} width={760} height={600} rx={20} fill="rgba(255,255,255,0.08)" stroke={both > 0 ? '#FFD84A' : c} strokeWidth={6 + 6 * both} />
      <rect x={-380} y={0} width={760} height={90} rx={20} fill={c} />
      <text y={60} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill="#fff">{title}</text>
      {rows.map(([t, b], i) => { const on = shown(b, i === 3 ? 1 : 0); return <g key={i} opacity={on ? 1 : 0.15}><circle cx={-330} cy={150 + i * 110} r={14} fill="#F4ECD8" /><text x={-300} y={162 + i * 110} fontFamily="TagBold" fontSize={34} fill="#F4ECD8">{t}</text></g>; })}
    </g>
  );
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.01 }}>
        <InsertBg />
        <Layer depth={1}>
          <Col x={520} title="CONDEMNING THE VIOLENCE" c="#5A6A7A" rows={L} />
          <Col x={1400} title="DEFENDING THE PROTESTERS" c="#8A4A3A" rows={R} />
          {both > 0 && <text x={960} y={830} textAnchor="middle" fontFamily="TagBold" fontSize={0} fill="#FFD84A">.</text>}
        </Layer>
      </CameraRig>
      {both > 0 && <div style={{ position: 'absolute', left: 960, top: 450, transform: `translate(-50%,-50%) scale(${both})`, background: '#FFD84A', border: '6px solid #1A1410', borderRadius: 16, padding: '6px 26px', fontFamily: 'TagBold', fontSize: 52, color: '#1A1410', whiteSpace: 'nowrap' }}>BOTH CAN BE TRUE</div>}
    </>
  );
};
const NotTelling = hostShot((s) => [{ at: 0, arm: s.id === 's12b31' ? 'shrug' : s.id === 's12b32' ? 'present' : 'finger', expr: s.id === 's12b31' ? 'smile' : 'normal' }], {
  props: (s) => s.id === 's12b32' ? <PopProp at={wordAt(s, 'history')} x={1060} y={620}><g><rect x={-150} y={-190} width={300} height={380} rx={10} fill="#7A3A2A" stroke={OL} strokeWidth={7} /><rect x={-130} y={-190} width={20} height={380} fill="#5A2A1A" /><text y={-40} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill={GOLD}>HISTORY</text><text y={20} textAnchor="middle" fontFamily="Hand" fontSize={34} fill="#F4ECD8">moments like this</text></g></PopProp> : null,
});
/** Sketch: the budget. A (right) = a fictional budget director; B (left) = a fictional minister. Options pop up and get crossed out. */
const SketchBudget: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const order = ['s12b34', 's12b35', 's12b36', 's12b37', 's12b38', 's12b39', 's12b40', 's12b41', 's12b42', 's12b43', 's12b44', 's12b45', 's12b46', 's12b47'];
  const idx = order.indexOf(s.id);
  const opts = [['TAXES?', 1, 2], ['CUT SCHOOLS?', 3, 6], ['PENSIONS?', 7, 8], ['BORROW?', 9, 10]] as const;
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.0 }}>
      <Layer depth={0}>
        <rect x={-200} y={-200} width={2400} height={1500} fill="#B8B0A0" />
        <rect x={720} y={110} width={480} height={300} fill="#A8C6E0" stroke={OL} strokeWidth={8} />
        <g transform="translate(960 260)"><text textAnchor="middle" y={-60} fontFamily="TagBold" fontSize={34} fill="#1A1410">TO FIND:</text><text textAnchor="middle" y={20} fontFamily="TagBold" fontSize={90} fill="#B3261E">€43 bn</text></g>
        {opts.map(([lab, on, off], i) => { const k = idx >= on ? (idx === on ? springPop(f, 2) : 1) : 0; const x = idx >= off ? (idx === off ? interpolate(f, [8, 24], [0, 1]) : 1) : 0; return k > 0 ? <g key={i} transform={`translate(${630 + i * 220} 500) scale(${k * 0.68}) rotate(${i % 2 ? 4 : -4})`}><rect x={-150} y={-55} width={300} height={110} rx={12} fill="#F4ECD8" stroke={OL} strokeWidth={5} /><text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill="#1A1410">{lab}</text>{x > 0 && <path d={`M-140 40 L${-140 + 280 * x} ${40 - 80 * x}`} stroke="#B3261E" strokeWidth={12} strokeLinecap="round" />}</g> : null; })}
        {idx >= 12 && <g transform={`translate(960 600) scale(${idx === 12 ? springPop(f, 4) : 1})`}><rect x={-170} y={-50} width={340} height={100} rx={14} fill="#5A5A64" stroke={OL} strokeWidth={5} /><text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill="#fff">COMMITTEE</text></g>}
      </Layer>
      <Layer depth={1}>
        <rect x={-200} y={780} width={2400} height={600} fill="#6A5A48" stroke={OL} strokeWidth={4} />
        <Chibi x={420} y={900} s={1.4} outfit={{ top: '#2A2E3A', bottom: '#2A2E3A', belt: '#F4F7FA' }} hat="hair" hair="#7A7A7A" pose={s.speaker === 'B' ? 'shrug' : 'cross'} expr={s.speaker === 'B' ? (idx >= 13 ? 'grin' : 'worried') : 'normal'} talking={s.speaker === 'B' ? [[6, s.talkEnd ?? 40]] : []} seed="minister" />
        <Desk x={680} y={790} s={0.9} candle={false} />
        <Chibi x={1460} y={900} s={1.4} outfit={{ top: '#3A4A5A', bottom: '#2A2E3A', belt: '#F4F7FA' }} hat="bun" hatColor="#3A2416" item="notebook" pose={s.speaker === 'A' ? 'present' : 'hold'} expr={s.speaker === 'A' ? (idx === 8 ? 'shock' : 'normal') : 'normal'} talking={s.speaker === 'A' ? [[6, s.talkEnd ?? 40]] : []} seed="director" flip />
      </Layer>
    </CameraRig>
  );
};

export const SHOTS_11: ShotMap = {
  smoke: Smoke, gov_camp: GovCamp, lfi_camp: LfiCamp, rn_camp: RnCamp, abroad: Abroad, analysts: Analysts,
  both_sides: BothSides, not_telling: NotTelling, sketch_budget: SketchBudget,
};
