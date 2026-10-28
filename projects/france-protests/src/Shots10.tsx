/**
 * Act 10 — "October 2026". Restraint for the violence: night-lit empty streets, a smouldering doorway
 * at a distance, numbers. UPDATE cards carry facts that moved after the voiceover was recorded.
 */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, spring, springPop, gravityDrop, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { FranceMap } from '@engine/scenes/France';
import { ParisStreet, School, TownHall, Desk } from '@engine/scenes/FranceScenes';
import { hostShot, wordAt, PopProp, DropHtml, type ShotMap, type SP } from '@engine/kit';
import { GOLD, PEOPLE, MONEY, STATE } from './Shots01';
import { Calendar, Bars, mapXY } from './Shots04';
import { PrefectMap } from './Shots06';
import { MODERN, HIVIS, Stamp, Counter, Update } from './Shots09';

const TEEN = (c: string, i: number) => ({ ...MODERN(c, i), outfit: { top: c, bottom: '#2A3A5A' } });
const MidSept = hostShot((s) => [{ at: 0, arm: 'present', expr: 'normal' }, { at: wordAt(s, 'two'), arm: 'finger' }], {
  props: (s) => <PopProp at={wordAt(s, 'mid-September,')} x={1060} y={620}><Calendar x={0} y={0} s={0.72} month="SEPTEMBER" day={15} year={2026} color={PEOPLE} /></PopProp>,
});
const PortBlockade: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b03 = s.id === 's11b03';
  const [nx, ny] = mapXY('Nice'); const [sx, sy] = mapXY('Sète');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.1, zoomTo: 1.2, focus: [1000, 760] }}>
        <InsertBg />
        <Layer depth={1}>
          <FranceMap x={330} y={60} s={0.86} pins={[{ city: 'Nice', at: wordAt(s, 'Nice') || -99, color: PEOPLE, label: true }, ...(b03 ? [{ city: 'Sète', at: wordAt(s, 'Sete,') - 4, color: PEOPLE, label: true }] : [])]} />
          {!b03 && [0, 1, 2].map((i) => <g key={i} transform={`translate(${nx - 80 + i * 70} ${ny + 70 + Math.sin(f / 8 + i) * 4})`}><path d="M-30 0 L30 0 L22 16 L-22 16 Z" fill="#F4F7FA" stroke={OL} strokeWidth={3} /><path d="M0 0 V-36 L18 -8 Z" fill="#C0392B" stroke={OL} strokeWidth={2} /></g>)}
        </Layer>
      </CameraRig>
      {b03 && <div style={{ position: 'absolute', right: 80, top: 160, transform: `scale(${springPop(f, wordAt(s, 'diesel.') - 8)})`, transformOrigin: 'right top', background: '#C0392B', border: '6px solid #1A1410', borderRadius: 16, padding: '10px 28px', fontFamily: 'TagBold', fontSize: 60, color: '#fff' }}>⛽ DIESEL ↑</div>}
      {!b03 && <Label text="mid-September 2026" x={960} y={120} at={4} size={50} color="#FFD84A" />}
    </>
  );
};
const SchoolBlock: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s11b04', 's11b05', 's11b06', 's11b07'].indexOf(s.id);
  const n = idx === 3 ? Math.round(700 * interpolate(f, [wordAt(s, '700') - 20, wordAt(s, '700') + 6], [0.2, 1], Easing.out)) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <School blockade={idx >= 1} banner={idx >= 1 ? 'LYCÉE BLOQUÉ' : undefined} />
        <Layer depth={1.1}>{[...Array(8)].map((_, i) => <Chibi key={i} x={160 + i * 225} y={940} s={0.85} {...TEEN(['#C0392B', '#2E4A9A', '#E8C23A', '#2E6B4A', '#8A3A8A', '#B85A30', '#3A3A48', '#E8742A'][i], i)} pose={idx >= 1 ? (i % 2 ? 'raise' : 'cross') : 'idle'} expr={idx >= 1 ? 'determined' : 'normal'} talking={[]} seed={'tn' + i} />)}</Layer>
      </CameraRig>
      {idx === 2 && ['teacher', 'overcrowded', 'heat.'].map((w, i) => { const k = springPop(f, wordAt(s, w)); return k > 0 ? <div key={w} style={{ position: 'absolute', left: 300 + i * 560, top: 140, transform: `translate(-50%,0) scale(${k}) rotate(${[-4, 3, -2][i]}deg)`, fontFamily: 'TagBold', fontSize: 40, color: '#1A1410', background: '#F4ECD8', border: '5px solid #1A1410', padding: '6px 20px', whiteSpace: 'nowrap' }}>{['NO TEACHER', 'CLASSES TOO BIG', 'TOO HOT'][i]}</div> : null; })}
      {idx === 3 && <Counter label="SCHOOLS DISRUPTED:" value={`${n}+`} left={60} top={120} />}
      {idx === 3 && <Update at={wordAt(s, '700')} text="On 6 Oct the ministry counted 891 lycées disrupted" source="Interior Ministry, via AFP / Euronews" top={220} />}
      {idx === 0 && <Label text="Paris suburbs and beyond" x={960} y={140} at={wordAt(s, 'suburbs')} size={50} color="#1A1410" />}
    </>
  );
};
const March7: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = Math.round(250000 * interpolate(f, [wordAt(s, 'quarter') - 10, wordAt(s, 'million') + 6], [0, 1], Easing.out));
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <ParisStreet />
        <Layer depth={1.1}>{[...Array(12)].map((_, i) => <Chibi key={i} x={80 + i * 160} y={930 + (i % 2) * 12} s={0.85} {...TEEN(['#C0392B', '#2E4A9A', '#E8C23A', '#2E6B4A'][i % 4], i)} item={i % 4 === 1 ? 'banner' : undefined} legs="march" pose={i % 2 ? 'raise' : 'idle'} expr="determined" talking={[]} seed={'m7' + i} delay={i * 2} />)}</Layer>
      </CameraRig>
      <Counter label="MARCHING:" value={`~${n.toLocaleString('en-US')}`} left={60} top={120} />
      <Update at={wordAt(s, 'October,') + 6} text="The quarter-million march was on Tuesday 6 October" source="AFP / Paris Match, 6 Oct 2026" top={220} />
    </>
  );
};
const WhySchools = hostShot((s) => [{ at: 0, arm: 'shrug', expr: 'normal' }]);
const Classroom: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s11b10', 's11b11', 's11b12'].indexOf(s.id);
  const pack = idx === 2 ? interpolate(f, [wordAt(s, '35') - 6, wordAt(s, '40') + 6], [0, 1], Easing.inOut) : 0;
  const cols = Math.round(5 + 3 * pack), rows = Math.round(3 + 2 * pack);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#D9CDB0" /><rect x={460} y={80} width={1000} height={260} fill="#2E4A3A" stroke="#7A4E2B" strokeWidth={14} /></Layer>
        <Layer depth={1}>
          <rect x={-200} y={760} width={2400} height={600} fill="#A8865A" stroke={OL} strokeWidth={4} />
          {idx <= 1 && <><Desk x={960} y={520} s={0.8} candle={false} /><text x={960} y={260} textAnchor="middle" fontFamily="Hand" fontSize={70} fill="#F4F7FA">no teacher today</text></>}
          {idx === 2 && [...Array(rows)].map((_, r) => [...Array(cols)].map((_, c) => <g key={r + '-' + c} transform={`translate(${960 + (c - (cols - 1) / 2) * (1500 / cols)} ${450 + r * (420 / rows)})`}><rect x={-50} y={-14} width={100} height={30} fill="#7A4E2B" stroke={OL} strokeWidth={3} /><circle cy={-34} r={18} fill={['#F3D2B0', '#C68B59', '#8D5524'][(r + c) % 3]} stroke={OL} strokeWidth={3} /></g>))}
        </Layer>
      </CameraRig>
      {idx === 1 && <div style={{ position: 'absolute', left: 960, top: 420, transform: `translate(-50%,0) scale(${springPop(f, wordAt(s, '53'))})`, fontFamily: 'TagBold', fontSize: 120, color: '#B3261E', background: 'rgba(255,255,255,0.9)', padding: '0 30px', borderRadius: 16 }}>53%</div>}
      {idx === 1 && <Label text="of secondary schools missing ≥1 teacher" x={960} y={640} at={wordAt(s, 'missing')} size={46} color="#1A1410" />}
      {idx === 2 && <Label text={pack > 0.6 ? '40 in one room' : '35 in one room'} x={960} y={360} at={wordAt(s, '35')} size={56} color="#1A1410" />}
    </>
  );
};
const AddMoney = hostShot((s) => [{ at: 0, arm: 'finger', expr: 'grin' }], {
  props: (s) => s.id === 's11b18' ? <PopProp at={wordAt(s, 'debt.') - 4} x={1060} y={640}><g><rect x={-170} y={-70} width={340} height={140} rx={16} fill="#B3261E" stroke={OL} strokeWidth={6} /><text y={22} textAnchor="middle" fontFamily="TagBold" fontSize={64} fill="#fff">DEBT</text></g></PopProp>
    : <PopProp at={wordAt(s, 'money.') - 4} x={1060} y={640}><g><circle r={80} fill={MONEY} stroke={OL} strokeWidth={6} /><text y={30} textAnchor="middle" fontFamily="TagBold" fontSize={90} fill="#E8F5E8">€</text></g></PopProp>,
});
const Prices: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s11b14', 's11b15', 's11b16', 's11b17'].indexOf(s.id);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          {idx <= 1 && <Bars x={620} y={720} max={3.5} h={460} w={260} gap={160} bars={[{ label: 'AUGUST', v: 2.4, c: '#8A8A94', at: idx === 1 ? wordAt(s, '2.4') : 99999, text: '2.4%' }, { label: 'SEPTEMBER', v: 3.1, c: '#B3261E', at: idx === 0 ? wordAt(s, '3.1') : -99, text: '3.1%' }]} />}
          {idx === 2 && <g transform="translate(960 520)"><rect x={-180} y={-280} width={360} height={480} rx={22} fill="#2E6B4A" stroke={OL} strokeWidth={8} /><rect x={-140} y={-230} width={280} height={150} fill="#1E1E28" /><text y={-130} textAnchor="middle" fontFamily="TagBold" fontSize={74} fill="#7AFF7A">2.37</text><text y={-40} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#fff">€ / LITRE · DIESEL</text><path d="M180 -40 Q260 -40 260 60 V200" stroke={OL} strokeWidth={12} fill="none" /></g>}
          {idx === 3 && <g><g transform="translate(700 520)"><rect x={-110} y={-170} width={220} height={320} rx={30} fill="#3A3A48" stroke={OL} strokeWidth={7} /><path d="M-110 -80 H110 M-110 40 H110" stroke="#5A5A64" strokeWidth={10} /><text y={-10} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#F4ECD8">OIL</text></g><path d="M880 520 H1160" stroke="#FFD84A" strokeWidth={10} strokeDasharray="20 12" strokeDashoffset={-f * 2} /><g transform="translate(1340 520)"><rect x={-160} y={-80} width={320} height={160} rx={16} fill="#F4ECD8" stroke={OL} strokeWidth={6} /><text y={-10} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#1A1410">ENERGY</text><text y={40} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#B3261E">SQUEEZE</text></g></g>}
        </Layer>
      </CameraRig>
      {idx <= 1 && <Label text="inflation, year on year" x={960} y={140} at={4} size={52} color="#FFD84A" />}
      {idx === 3 && <Label text="as reported: the war in Iran" x={960} y={160} at={wordAt(s, 'Iran.')} size={52} color="#FFD84A" />}
    </>
  );
};
const DebtGauge: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s11b19', 's11b20', 's11b21', 's11b22', 's11b23', 's11b24'].indexOf(s.id);
  const hist: [number, number][] = [[1945, 120], [1950, 70], [1960, 35], [1970, 18], [1980, 20], [1990, 35], [2000, 58], [2010, 85], [2020, 115], [2026, 119]];
  const X = (y: number) => 300 + (y - 1945) * (1320 / 81), Y = (v: number) => 760 - v * 3.6;
  const draw = idx === 1 ? interpolate(f, [2, 40], [0, 1], Easing.inOut) : 1;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          {idx <= 1 && <g>
            <path d={`M300 760 H1640`} stroke="#F4ECD8" strokeWidth={5} />
            <path d={'M' + hist.map(([y, v]) => `${X(y)} ${Y(v)}`).join(' L')} stroke="#FF6B57" strokeWidth={10} fill="none" strokeDasharray="2600" strokeDashoffset={2600 * (1 - draw)} strokeLinejoin="round" />
            {hist.filter((_, i) => i === 0 || i === hist.length - 1).map(([y, v]) => <g key={y}><circle cx={X(y)} cy={Y(v)} r={14} fill="#FF6B57" stroke={OL} strokeWidth={4} /><text x={X(y)} y={Y(v) - 30} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff">{y === 2026 ? '~119%' : 'after WWII'}</text><text x={X(y)} y={800} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill="#F4ECD8">{y}</text></g>)}
            <text x={960} y={190} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#F4ECD8">PUBLIC DEBT, % OF GDP (shape is illustrative)</text>
          </g>}
          {(idx === 2 || idx === 3) && <g>
            <Bars x={460} y={720} max={6} h={420} w={240} gap={140} bars={[{ label: 'DEFICIT NOW', v: 5.4, c: '#B3261E', at: idx === 2 ? wordAt(s, '5.4') : -99, text: '5.4%' }, { label: '2027 TARGET', v: 5.0, c: '#E8A94A', at: idx === 2 ? wordAt(s, '5') : -99, text: '5.0%' }]} />
            {idx === 3 && <g transform={`translate(1460 460) scale(${springPop(f, wordAt(s, '43'))})`}><rect x={-200} y={-110} width={400} height={220} rx={18} fill={MONEY} stroke={OL} strokeWidth={7} /><text y={0} textAnchor="middle" fontFamily="TagBold" fontSize={80} fill="#fff">€43 bn</text><text y={60} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill="#E8F5E8">to find</text></g>}
          </g>}
          {idx === 4 && <g><path d="M300 760 H1640" stroke="#F4ECD8" strokeWidth={5} /><path d={`M300 700 L600 690 L800 640 L1000 520 L1200 480 L1400 420 L${300 + 1320 * Math.min(1, f / 40)} ${420 - 80 * Math.min(1, f / 40)}`} stroke="#FFD84A" strokeWidth={10} fill="none" strokeLinejoin="round" /><text x={960} y={190} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#F4ECD8">BORROWING COST: HIGHEST IN 20+ YEARS</text></g>}
          {idx === 5 && <g>
            <g transform="translate(960 560)"><path d="M-200 -160 L200 -160 L170 160 L-170 160 Z" fill="#8A8A94" stroke={OL} strokeWidth={8} /><text y={10} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill="#fff">REVENUE</text><rect x={-40} y={150} width={80} height={20} fill="#1A1410" /></g>
            {[0, 1, 2].map((i) => { const t0 = 6 + i * 14; const g = gravityDrop(f, t0, { h: 340, g: 1.4, e: 0.2 }); const through = Math.max(0, f - t0 - 30); return f >= t0 ? <g key={i} transform={`translate(${930 + i * 30} ${through > 0 ? 560 + through * through * 0.7 : 500 + g.y})`}><circle r={30} fill={MONEY} stroke={OL} strokeWidth={4} /><text y={12} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#E8F5E8">€</text></g> : null; })}
            <text x={960} y={820} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#FF6B57" opacity={springPop(f, wordAt(s, 'interest'))}>↓ INTEREST</text>
          </g>}
        </Layer>
      </CameraRig>
      {idx === 5 && <Label text="~$100 bn a year by 2027 (one projection)" x={960} y={170} at={wordAt(s, '100')} size={50} color="#FFD84A" />}
    </>
  );
};
const Collision: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s11b25', 's11b26', 's11b27'].indexOf(s.id);
  const k = idx === 0 ? interpolate(f, [2, 26], [0, 1], Easing.in) : 1;
  const hit = idx === 0 && k >= 1;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, shakes: idx === 0 ? [{ at: 26, amp: 12, len: 10 }] : [] }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform={`translate(${200 + 520 * k} 480)`}><rect x={-240} y={-90} width={480} height={180} rx={20} fill="#2E6B4A" stroke={OL} strokeWidth={7} /><text y={-6} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff">MORE SPENDING</text><text y={46} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#E8F5E8">students · teachers</text></g>
          <g transform={`translate(${1720 - 520 * k} 480)`}><rect x={-240} y={-90} width={480} height={180} rx={20} fill="#B3261E" stroke={OL} strokeWidth={7} /><text y={-6} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#fff">MUST CUT</text><text y={46} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#F4ECD8">budget · debt</text></g>
          {(hit || idx > 0) && <path d="M960 330 L990 420 L940 440 L980 560 L930 600" stroke="#FFD84A" strokeWidth={10} fill="none" />}
          {idx === 2 && <g transform="translate(960 790) scale(0.5)"><path d="M-560 0 Q0 -680 560 0" fill="none" stroke="#F4ECD8" strokeWidth={6} />{[...Array(24)].map((_, i) => { const a = Math.PI * (0.06 + 0.88 * i / 23); return <circle key={i} cx={-Math.cos(a) * 480} cy={-Math.sin(a) * 300} r={22} fill={['#C0392B', '#E8C23A', '#2E2E5A'][Math.floor(i / 8)]} stroke={OL} strokeWidth={3} />; })}</g>}
        </Layer>
      </CameraRig>
      {idx === 2 && <Label text="a split parliament" x={960} y={170} at={wordAt(s, 'split')} size={54} color="#FFD84A" />}
    </>
  );
};
const Merge: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b29 = s.id === 's11b29';
  const streams = [{ lab: 'STUDENTS', c: '#E8742A' }, { lab: 'YELLOW VESTS', c: '#E8E83A' }, { lab: 'UNIONS', c: '#C0392B' }, { lab: 'RETIREES', c: '#8A8A94' }, { lab: 'FARMERS', c: '#6A8A3A' }, { lab: 'CLIMATE', c: '#2E8B57' }];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          {streams.map((st, i) => { const show = b29 ? (i < 2 ? -99 : wordAt(s, ['unions,', 'retirees,', 'farmers', 'climate'][i - 2] || 'unions,')) : (i === 0 ? wordAt(s, 'school') : i === 1 ? wordAt(s, 'Yellow') : 99999); const k = interpolate(f, [show, show + 24], [0, 1], Easing.out); const y0 = 180 + i * 110; return k > 0 ? <g key={i}><path d={`M380 ${y0} C760 ${y0} 940 520 1300 520`} stroke={st.c} strokeWidth={34} fill="none" strokeDasharray="1300" strokeDashoffset={1300 * (1 - k)} strokeLinecap="round" opacity={0.9} /><text x={360} y={y0 + 12} textAnchor="end" fontFamily="TagBold" fontSize={30} fill="#fff">{st.lab}</text></g> : null; })}
          <path d="M1300 520 H1760" stroke="#F4ECD8" strokeWidth={70} strokeLinecap="round" opacity={b29 ? 0.95 : 0.4} />
          {b29 && <text x={1530} y={460} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#FFD84A" opacity={springPop(f, wordAt(s, 'cost'))}>COST OF LIVING</text>}
        </Layer>
      </CameraRig>
      <Label text="17 October 2026" x={1460} y={170} at={b29 ? -99 : wordAt(s, '17')} size={54} color="#FFD84A" />
    </>
  );
};
const Turnout: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s11b30', 's11b31', 's11b32'].indexOf(s.id);
  const n = idx === 0 ? Math.round(550000 * interpolate(f, [wordAt(s, '550,000') - 20, wordAt(s, '550,000') + 6], [0, 1], Easing.out)) : 550000;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        {idx === 0 ? <ParisStreet /> : <InsertBg />}
        <Layer depth={1.1}>
          {idx === 0 && [...Array(12)].map((_, i) => <Chibi key={i} x={80 + i * 160} y={930 + (i % 2) * 12} s={0.85} {...(i % 4 === 1 ? HIVIS : MODERN(['#C0392B', '#2E4A9A', '#E8C23A', '#2E6B4A'][i % 4], i))} legs="march" pose={i % 2 ? 'raise' : 'idle'} expr="determined" talking={[]} seed={'to' + i} delay={i * 2} />)}
          {idx >= 1 && <Bars x={360} y={760} max={1300000} h={480} w={300} gap={170} bars={[
            { label: 'YELLOW VESTS PEAK', v: 282000, c: '#E8E83A', at: idx === 1 ? wordAt(s, 'Yellow') : -99, text: '~282k' },
            { label: '17 OCT 2026', v: 550000, c: PEOPLE, at: idx === 1 ? wordAt(s, 'bigger') : -99, text: '~550k' },
            { label: '2023 PENSIONS PEAK', v: 1280000, c: '#2E4A9A', at: idx === 2 ? wordAt(s, '2023') : 99999, text: '~1.28m' },
          ]} />}
        </Layer>
      </CameraRig>
      {idx === 0 && <Counter label="NATIONWIDE:" value={`~${n.toLocaleString('en-US')}`} left={60} top={120} />}
      {idx === 0 && <Counter label="PARIS:" value="~110,000" left={60} top={210} k={springPop(f, wordAt(s, '110,000'))} />}
      {idx >= 1 && <div style={{ position: 'absolute', right: 40, top: 40, fontFamily: 'Tag', fontSize: 24, color: '#B8B8C0' }}>Interior Ministry counts · comparison as reported by Reuters</div>}
    </>
  );
};
const Peaceful: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
    <ParisStreet />
    <Layer depth={1.1}>{[...Array(10)].map((_, i) => <Chibi key={i} x={120 + i * 190} y={930} s={0.9} {...MODERN(['#C0392B', '#2E4A9A', '#E8C23A', '#2E6B4A', '#8A3A8A'][i % 5], i)} item={i % 3 === 0 ? 'banner' : undefined} legs="walk" pose="idle" expr="calm" talking={[]} seed={'pc' + i} delay={i * 3} />)}</Layer>
  </CameraRig>
);
/** Restraint: night-lit empty streets; a smouldering doorway at a distance. */
const NightDamage: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s11b34', 's11b35', 's11b36'].indexOf(s.id);
  return (
    <>
      <CameraRig move={{ zoomFrom: idx === 2 ? 1.0 : 1.03, zoomTo: idx === 2 ? 1.06 : 1.0, focus: [960, 520] }}>
        {idx === 2 ? <TownHall night smoulder label="HÔTEL DE VILLE" /> : <ParisStreet night />}
        {idx < 2 && <Layer depth={1.05}>{[...Array(5)].map((_, i) => { const t = (f + i * 40) % 200; return <circle key={i} cx={1400 + i * 30 + t * 0.3} cy={560 - t * 1.4} r={30 + t * 0.4} fill="#4A4A54" opacity={0.5 * (1 - t / 200)} />; })}<rect x={1380} y={600} width={60} height={110} fill="#E8742A" opacity={0.5 + 0.2 * Math.sin(f / 4)} /></Layer>}
      </CameraRig>
      {idx === 2 && <Label text="Limoges city hall" x={960} y={140} at={wordAt(s, 'Limoges')} size={54} color="#F4ECD8" />}
    </>
  );
};
const PrefectCallback: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b38 = s.id === 's11b38';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        {b38 ? <InsertBg /> : <ParisStreet night />}
        <Layer depth={1.05}>
          {!b38 && <g><rect x={560} y={330} width={800} height={430} fill="#3A4058" stroke={OL} strokeWidth={6} />{[...Array(10)].map((_, i) => <rect key={i} x={600 + (i % 5) * 150} y={380 + Math.floor(i / 5) * 160} width={80} height={110} fill={i === 7 ? '#E8C66A' : '#2A2E3A'} stroke={OL} strokeWidth={3} />)}<rect x={900} y={620} width={120} height={140} fill="#2A1B12" stroke={OL} strokeWidth={4} /><path d="M1020 620 L1060 600 L1060 760 L1020 760 Z" fill="#5A3A22" stroke={OL} strokeWidth={3} /><g transform="translate(960 300)">{[0, 1, 2].map((i) => <rect key={i} x={-90 + i * 60} y={-50} width={60} height={50} fill={['#2E4A9A', '#F4F7FA', '#C0392B'][i]} stroke={OL} strokeWidth={2} />)}</g></g>}
          {b38 && <g transform="translate(-140 0)"><PrefectMap at={-99} /></g>}
          {b38 && <g transform="translate(1500 520)"><rect x={-200} y={-200} width={400} height={300} fill="#E8DCC0" stroke={OL} strokeWidth={6} /><text y={-130} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#1A1410">PRÉFECTURE</text>{[0, 1, 2].map((i) => <rect key={i} x={-150 + i * 110} y={-90} width={80} height={110} fill="#8A9AA8" stroke={OL} strokeWidth={3} />)}</g>}
        </Layer>
      </CameraRig>
      {!b38 && <Label text="Bordeaux · the prefect's residence" x={960} y={140} at={wordAt(s, 'Bordeaux,')} size={52} color="#F4ECD8" />}
      {b38 && <Label text="1800 → 2026 · 226 years" x={1500} y={760} at={wordAt(s, '226')} size={50} color="#FFD84A" />}
      {b38 && <div style={{ position: 'absolute', left: 1500, top: 180, transform: `translate(-50%,0) rotate(-3deg) scale(${springPop(f, wordAt(s, 'prefect,'))})`, fontFamily: 'TagBold', fontSize: 64, color: '#1A1410', background: '#F4ECD8', border: '6px solid #1A1410', padding: '6px 28px', boxShadow: '8px 10px 0 rgba(0,0,0,0.25)' }}>📌 PREFECTS</div>}
    </>
  );
};
const Toll: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s11b39', 's11b40'].indexOf(s.id);
  const k = (t: number) => springPop(f, t);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}><InsertBg glow={false} /></CameraRig>
      <div style={{ position: 'absolute', left: 160, top: 220, fontFamily: 'TagBold', color: '#F4ECD8', lineHeight: 1.45 }}>
        <div style={{ fontSize: 70, transform: `scale(${idx === 0 ? k(wordAt(s, '1,800')) : 1})`, transformOrigin: 'left center' }}>~1,800 arrests</div>
        {idx === 1 && <div style={{ fontSize: 56, color: '#FFD84A', transform: `scale(${k(wordAt(s, '855'))})`, transformOrigin: 'left center' }}>855 in Paris (a record)</div>}
        {idx === 1 && <div style={{ fontSize: 56, transform: `scale(${k(wordAt(s, '500'))})`, transformOrigin: 'left center' }}>500+ police injured</div>}
      </div>
      <Update at={idx === 1 ? wordAt(s, '855') : 99999} text="By 19 Oct: 2,397 arrests and 997 police and gendarmes injured" source="Interior Ministry, via Deseret News / AP, 19 Oct 2026" top={520} />
    </>
  );
};
const Quiet: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s11b41', 's11b42', 's11b43'].indexOf(s.id);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
        <InsertBg glow={false} />
        <Layer depth={1}><g transform="translate(960 560)"><rect x={-26} y={-40} width={52} height={180} fill="#F4ECD8" stroke={OL} strokeWidth={4} /><path d={`M0 -46 Q${16 + Math.sin(f / 5) * 4} -80 0 ${-120 + Math.sin(f / 7) * 4} Q${-16 + Math.sin(f / 5) * 4} -80 0 -46 Z`} fill="#FFD84A" stroke="#E8742A" strokeWidth={3} /><circle cy={-70} r={70} fill="#FFD84A" opacity={0.12} /></g></Layer>
      </CameraRig>
      {idx === 1 && <div style={{ position: 'absolute', right: 40, top: 40, maxWidth: 680, textAlign: 'right', fontFamily: 'Tag', fontSize: 26, color: '#F4ECD8', background: 'rgba(26,20,16,0.7)', padding: '6px 14px', borderRadius: 8 }}>Reported: a 15-year-old picked up a police stun grenade (5 Oct). France then suspended their use at student protests.</div>}
    </>
  );
};
const Curfew: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b45 = s.id === 's11b45';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          {!b45 && <g transform="translate(960 480)"><circle r={200} fill="#F4F7FA" stroke={OL} strokeWidth={10} />{[...Array(12)].map((_, i) => <path key={i} d="M0 -180 V-160" stroke={OL} strokeWidth={6} transform={`rotate(${i * 30})`} />)}<path d="M0 0 V-130" stroke={OL} strokeWidth={10} transform={`rotate(${300 + Math.min(1, f / 30) * 0})`} /><path d="M0 0 V-90" stroke={OL} strokeWidth={14} transform="rotate(300)" /><text y={280} textAnchor="middle" fontFamily="TagBold" fontSize={70} fill="#FFD84A">CURFEW</text></g>}
          {b45 && <><FranceMap x={330} y={60} s={0.86} pins={[{ city: 'Paris', at: wordAt(s, 'Paris,'), color: '#3A3A48', label: true }, { city: 'Lille', at: wordAt(s, 'Lille'), color: '#3A3A48', label: true }, { city: 'Nice', at: wordAt(s, 'Nice.'), color: '#3A3A48', label: true }]} /><text x={1560} y={460} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#F4ECD8" opacity={springPop(f, wordAt(s, 'under-18s'))}>UNDER-18s</text><text x={1560} y={520} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#F4ECD8" opacity={springPop(f, wordAt(s, 'under-18s'))}>AFTER DARK</text></>}
        </Layer>
      </CameraRig>
    </>
  );
};
const Cooled: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b47 = s.id === 's11b47';
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <InsertBg />
      <Layer depth={1}>
        {!b47 && <><g transform="translate(700 470)"><rect x={-40} y={-180} width={80} height={260} rx={40} fill="#F4F7FA" stroke={OL} strokeWidth={6} /><circle cy={120} r={70} fill="#7AB8FF" stroke={OL} strokeWidth={6} /><rect x={-20} y={-60} width={40} height={180} fill="#7AB8FF" /></g><PopProp at={wordAt(s, 'another')} x={1260} y={470}><Calendar x={0} y={0} s={0.8} month="THIS" day="SAT" color={PEOPLE} /></PopProp></>}
        {b47 && [['BELGIUM', ['#1A1410', '#F2C230', '#C8102E']], ['PORTUGAL', ['#046A38', '#DA291C', '#DA291C']], ['ITALY', ['#009246', '#F4F7FA', '#CE2B37']]].map(([n, cs]: any, i) => { const k = springPop(f, wordAt(s, n.charAt(0) + n.slice(1).toLowerCase()) - 4); return k > 0 ? <g key={n} transform={`translate(${480 + i * 480} 480) scale(${k})`}>{cs.map((c: string, j: number) => <rect key={j} x={-150 + j * 100} y={-100} width={100} height={200} fill={c} stroke={OL} strokeWidth={4} />)}<text y={170} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#fff">{n}</text></g> : null; })}
      </Layer>
    </CameraRig>
  );
};
const Moodys: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform="translate(760 480)"><rect x={-260} y={-200} width={520} height={400} rx={20} fill="#F4F7FA" stroke={OL} strokeWidth={8} /><text y={-120} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#5A5A64">FRANCE · CREDIT RATING</text><text y={50} textAnchor="middle" fontFamily="TagBold" fontSize={160} fill="#1A1410">Aa3</text><text y={140} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#B3261E">outlook: negative</text></g>
          <PopProp at={wordAt(s, '23')} x={1380} y={480}><Calendar x={0} y={0} s={0.75} month="OCTOBER" day={23} year={2026} color={STATE} /></PopProp>
        </Layer>
      </CameraRig>
      <Update at={wordAt(s, 'rule')} text="Result: rating kept at Aa3, outlook still negative (no action)" source="Moody's periodic review, 23 Oct 2026, as reported" top={40} />
    </>
  );
};
const Split = hostShot((s) => [{ at: 0, arm: s.id === 's11b49' ? 'chin' : 'shrug', expr: 'normal' }], {
  props: (s) => s.id === 's11b50' ? <g transform="translate(1060 600)"><path d="M0 -160 V40" stroke="#5A3A22" strokeWidth={10} /><g transform={`translate(0 -150) rotate(${-Math.min(14, (useCurrentFrame()) * 0.8)})`}><rect x={-180} y={-24} width={180} height={50} fill="#C0392B" stroke={OL} strokeWidth={4} /></g><g transform={`translate(0 -80) rotate(${Math.min(14, (useCurrentFrame()) * 0.8)})`}><rect x={0} y={-24} width={180} height={50} fill="#2E4A9A" stroke={OL} strokeWidth={4} /></g></g> : null,
});

export const SHOTS_10: ShotMap = {
  mid_sept: MidSept, port_blockade: PortBlockade, school_block: SchoolBlock, march7: March7, why_schools: WhySchools,
  classroom: Classroom, add_money: AddMoney, prices: Prices, debt_gauge: DebtGauge, collision: Collision, merge: Merge,
  turnout: Turnout, peaceful: Peaceful, night_damage: NightDamage, prefect_callback: PrefectCallback, toll: Toll,
  quiet_candle: Quiet, curfew: Curfew, cooled: Cooled, moodys: Moodys, split: Split,
};
