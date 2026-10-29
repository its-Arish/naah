/** Chapter 9 — "Peace on Paper" and Chapter 10 — "The Fall of Saigon". */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, spring, springPop, gravityDrop, random, topple } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL, Cloud } from '@engine/scenes/Parts';
import { IndochinaMap, VCITIES, vnXY, Huey, Tank, Palace, Rooftop, CarrierDeck, Flag, Capitol, WhiteHouse, Sea } from '@engine/scenes/Vietnam';
import { hostShot, wordAt, PopProp, DropHtml, type ShotMap, type SP } from '@engine/kit';
import { USA, NORTH, SOUTH, MONEY, GOLD, HO_OLD, NVA, GI, SVN, NIXON, KISSINGER, LE_DUC_THO, THIEU, VILLAGER, SUIT, PILOT, Stamp, Card, Note, Counter, Calendar, Bars } from './Cast';

const M = { x: 700, y: 40, s: 0.98 };
const mapP = (c: string) => { const [x, y] = VCITIES[c]; return [M.x + M.s * x, M.y + M.s * y]; };
const ll = (lon: number, lat: number) => { const [x, y] = vnXY(lon, lat); return [M.x + M.s * x, M.y + M.s * y]; };
const num = (s: { id: string }) => parseInt(s.id.slice(4), 10);
const MARINE = (i = 0) => ({ outfit: { top: '#6A7448', bottom: '#5E6B45' }, hat: 'helmet', hatColor: '#5E6B45', skin: i % 2 ? '#8D5524' : '#F3D2B0' });

// ------------------------------------------------------------------ Chapter 9
const Accords: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#C9B89A" />{[0, 1, 2].map((i) => <rect key={i} x={420 + i * 420} y={120} width={240} height={380} fill="#A8C6E0" stroke={OL} strokeWidth={8} />)}<path d="M-200 80 H2120" stroke={GOLD} strokeWidth={20} /></Layer>
        <Layer depth={1}>
          <rect x={-200} y={780} width={2400} height={600} fill="#7A3A2A" />
          <ellipse cx={960} cy={720} rx={620} ry={90} fill="#2E6B4A" stroke={OL} strokeWidth={6} />
          {[{ p: KISSINGER, x: 560 }, { p: SUIT('#2A2E3A', '#3A2416'), x: 760 }, { p: LE_DUC_THO, x: 1160 }, { p: SUIT('#5A5A64', '#1A1410', { skin: '#E8C49A' }), x: 1360 }].map((c, i) => <Chibi key={i} x={c.x} y={700} s={1.0} {...(c.p as any)} pose={i === 0 || i === 2 ? 'scribble' : 'idle'} expr="calm" talking={[]} seed={'pa' + i} flip={i >= 2} />)}
          {n >= 2 && ['ceasefire,', 'withdrawal', 'prisoners'].map((w, i) => { const k = springPop(f, n === 2 ? (i < 2 ? wordAt(s, w) : 99999) : n === 3 ? (i < 2 ? -99 : wordAt(s, w)) : -99); return k > 0 ? <g key={w} transform={`translate(${480 + i * 480} 250) scale(${k})`}><rect x={-200} y={-50} width={400} height={100} rx={12} fill="#F4F2EC" stroke={OL} strokeWidth={5} /><text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#1A1410">{['CEASEFIRE', 'US WITHDRAWAL', 'POWs HOME'][i]}</text></g> : null; })}
        </Layer>
      </CameraRig>
      {n === 1 && <Label text="Paris Peace Accords · 27 January 1973" x={960} y={140} at={wordAt(s, 'Paris')} size={52} color="#1A1410" />}
    </>
  );
};
const Homecoming: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = num(s);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#A8C6E0" /><Cloud x={300} y={150} /><Cloud x={1500} y={110} s={0.8} /></Layer>
        <Layer depth={0.6}>
          <rect x={-200} y={700} width={2400} height={700} fill="#8A8A84" />
          <g transform={`translate(${n === 4 ? interpolate(f, [0, d], [600, 2300]) : 640} ${n === 4 ? interpolate(f, [0, d], [560, 200]) : 520})`}><path d="M-300 0 L280 -12 Q340 0 280 12 L-300 18 Z" fill="#E8E8E0" stroke={OL} strokeWidth={5} /><path d="M20 0 L-80 -120 L-130 -120 L-50 0 Z M-240 -6 L-290 -80 L-310 -80 L-280 -2 Z" fill="#E8E8E0" stroke={OL} strokeWidth={5} /><path d="M-200 4 H200" stroke={USA} strokeWidth={8} /></g>
        </Layer>
        <Layer depth={1}>{n === 5 && [...Array(8)].map((_, i) => <Chibi key={i} x={240 + i * 200} y={940} s={0.95} {...(i % 2 ? SUIT(['#C0392B', '#3A5A8A', '#E8C23A'][i % 3], '#3A2416') : { ...GI(i), item: undefined })} pose={i % 2 ? 'cheer' : 'wave'} expr="happy" talking={[]} seed={'hc' + i} />)}</Layer>
      </CameraRig>
      {n === 5 && <Label text="Operation Homecoming" x={960} y={140} at={wordAt(s, 'Homecoming.')} size={56} color="#1A1410" />}
      {n === 5 && <Counter label="POWs RETURNED:" value="591" left={60} top={120} k={springPop(f, wordAt(s, 'Hundreds'))} />}
    </>
  );
};
const Nobel: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  const declined = n >= 8;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform="translate(560 900)"><Chibi x={0} y={0} s={1.4} {...KISSINGER} pose={n <= 7 ? 'hold' : 'idle'} expr="calm" talking={[]} seed="kis" /></g>
          <g transform="translate(1360 900)"><Chibi x={0} y={0} s={1.4} {...LE_DUC_THO} pose={declined ? 'cross' : 'idle'} expr={declined ? 'determined' : 'calm'} talking={[]} seed="ldt" flip /></g>
          <g transform={`translate(${declined ? 1360 + Math.min(1, (f - wordAt(s, 'declined')) / 14) * 0 : 960} ${declined ? 380 : 360}) scale(${springPop(f, n === 6 ? wordAt(s, 'Kissinger') : -99)})`}><circle r={90} fill={GOLD} stroke={OL} strokeWidth={6} /><circle r={66} fill="none" stroke="#B88A2E" strokeWidth={5} /><text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#5A3A22">NOBEL</text></g>
          {declined && <g transform="translate(1360 380)" opacity={springPop(f, n === 8 ? wordAt(s, 'declined') : -99)}><circle r={110} fill="none" stroke="#B3261E" strokeWidth={14} /><path d="M-78 78 L78 -78" stroke="#B3261E" strokeWidth={14} /></g>}
        </Layer>
      </CameraRig>
      {n === 6 && <Label text="Henry Kissinger · Lê Đức Thọ" x={960} y={140} at={wordAt(s, 'Kissinger')} size={52} color="#FFD84A" />}
      {n === 7 && <Label text="Nobel Peace Prize, 1973" x={960} y={140} at={wordAt(s, 'Nobel')} size={56} color="#FFD84A" />}
      {n === 8 && <Card at={wordAt(s, 'peace')} left={1360} top={600} text="“NO PEACE YET”" size={44} />}
    </>
  );
};
const PointPeace = hostShot((s) => [{ at: 0, arm: 'finger', expr: 'normal' }]);
const Unresolved: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          <IndochinaMap x={M.x} y={M.y} s={M.s} labels split parallel={1} fills={{ north: '#D9584A', south: '#E8C65A' }} />
          {n >= 11 && [...Array(9)].map((_, i) => { const [x, y] = ll(106.3 + random('nv' + i) * 2.2, 11.5 + random('nw' + i) * 5); const k = springPop(f, (n === 11 ? wordAt(s, 'remained') : -99) + i * 2); return k > 0 ? <rect key={i} x={x - 12 * k} y={y - 8 * k} width={24 * k} height={16 * k} rx={4} fill="#5E6B45" stroke={OL} strokeWidth={3} /> : null; })}
          {n === 13 && [...Array(5)].map((_, i) => { const [x, y] = ll(106.4 + i * 0.4, 12 + i * 0.9); const fl = Math.max(0, 1 - ((f + i * 13) % 36) / 10); return <circle key={i} cx={x} cy={y} r={20 * fl} fill="#FFD84A" opacity={fl} />; })}
        </Layer>
      </CameraRig>
      {n === 10 && <Card at={wordAt(s, 'control')} left={400} top={300} text="WHO CONTROLS THE SOUTH?" size={40} />}
      {n === 11 && <Label text="North Vietnamese troops stay" x={400} y={220} at={wordAt(s, 'remained')} size={46} color="#FFD84A" />}
      {n === 13 && <Stamp at={wordAt(s, 'violating')} left={400} top={420} text="CEASEFIRE VIOLATED" size={48} />}
    </>
  );
};
const Alone: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = num(s);
  if (n === 15 || n === 16) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#B8D4E0" /><Cloud x={300} y={140} /></Layer>
        <Layer depth={0.6}><Capitol x={960} y={760} s={1.0} /></Layer>
        <Layer depth={1}><rect x={-200} y={760} width={2400} height={600} fill="#7A9A5A" /></Layer>
      </CameraRig>
      {n === 16 && <Stamp at={wordAt(s, 'unwilling')} left={960} top={250} text="FUNDING CUT" size={64} />}
      {n === 15 && <Card at={wordAt(s, 'promised')} left={960} top={250} text="PROMISED SUPPORT…" size={50} />}
    </>
  );
  const away = n >= 17 ? interpolate(f, [0, d], n === 17 ? [0, 0.4] : [0.4, 1]) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#A8D4E6" /></Layer>
        <Layer depth={1}>
          <rect x={-200} y={760} width={2400} height={600} fill="#8AB860" />
          {[0, 1, 2, 3].map((i) => <Chibi key={i} x={200 + i * 170} y={940} s={1.0} {...SVN} pose="hold" expr={n >= 19 ? 'worried' : 'determined'} talking={[]} seed={'al' + i} />)}
          {[0, 1, 2].map((i) => <Chibi key={'g' + i} x={1100 + i * 170 + away * 1200} y={940} s={1.0} {...GI(i)} legs={away > 0 ? 'walk' : 'stand'} pose="hold" expr="calm" talking={[]} seed={'aw' + i} delay={i * 2} />)}
          {n === 14 && <text x={1300} y={500} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#1A1410" opacity={springPop(f, wordAt(s, 'without'))}>NO US COMBAT TROOPS</text>}
        </Layer>
      </CameraRig>
      {n === 19 && <Card at={wordAt(s, 'survive')} left={960} top={240} text="CAN THE SOUTH SURVIVE ALONE?" size={50} />}
    </>
  );
};
const Clock = hostShot((s) => [{ at: 0, arm: num(s) === 21 ? 'point' : 'present', expr: num(s) === 21 ? 'worried' : 'normal' }], {
  props: (s) => {
    const f = useCurrentFrame();
    return <PopProp at={4} x={1040} y={620}><g><circle r={150} fill="#F4F7FA" stroke={OL} strokeWidth={10} />{[...Array(12)].map((_, i) => <path key={i} d="M0 -130 V-112" stroke={OL} strokeWidth={6} transform={`rotate(${i * 30})`} />)}<path d="M0 0 V-100" stroke={OL} strokeWidth={8} transform={`rotate(${f * (num(s) === 21 ? 12 : 2)})`} /><path d="M0 0 V-70" stroke={NORTH} strokeWidth={10} transform={`rotate(${f})`} /></g></PopProp>;
  },
});

// ------------------------------------------------------------------ Chapter 10
const Offensive75: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = num(s);
  const steps: [string, number][] = [['Ban Me Thuot', 2], ['Quang Tri', 6], ['Hue', 7], ['Da Nang', 7], ['Nha Trang', 9], ['Saigon', 12]];
  const t = (i: number) => (n > steps[i][1] ? -99 : n === steps[i][1] ? 4 + (i % 3) * 8 : 99999);
  const red = steps.map((_, i) => f >= t(i));
  const [sx, sy] = mapP('Saigon');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: n >= 9 ? 1.15 : 1.04, focus: n >= 9 ? [sx, sy - 100] : [960, 470] }}>
        <InsertBg />
        <Layer depth={1}>
          <IndochinaMap x={M.x} y={M.y} s={M.s} labels split parallel={0} fills={{ north: '#D9584A', south: '#E8C65A' }} />
          {steps.slice(0, 5).map(([c], i) => { const [x, y] = mapP(c); const k = springPop(f, t(i)); return <g key={c}><circle cx={x} cy={y} r={14} fill={red[i] ? NORTH : SOUTH} stroke={OL} strokeWidth={4} />{k > 0 && <text x={x + 22} y={y - 10} fontFamily="TagBold" fontSize={26} fill="#fff" stroke={OL} strokeWidth={5} style={{ paintOrder: 'stroke' }}>{c}</text>}</g>; })}
          {n >= 7 && [...Array(4)].map((_, i) => { const k = interpolate(f, [4 + i * 6, 40 + i * 6], [0, 1], Easing.inOut); const x0 = ll(106.6 + i * 0.5, 16.5 - i * 1.4)[0], y0 = ll(0, 16.5 - i * 1.4)[1]; return <path key={i} d={`M${x0} ${y0} L${x0 + (sx - x0) * k * (n >= 9 ? 1 : 0.6)} ${y0 + (sy - y0) * k * (n >= 9 ? 1 : 0.6)}`} stroke={NORTH} strokeWidth={12} strokeLinecap="round" opacity={0.85} />; })}
        </Layer>
      </CameraRig>
      {n === 1 && <Label text="early 1975" x={400} y={200} at={wordAt(s, '1975,')} size={60} color="#FFD84A" />}
      {n === 4 && <Label text="retreat" x={400} y={300} at={wordAt(s, 'retreated')} size={56} color="#FFD84A" />}
      {n === 7 && <Stamp at={wordAt(s, 'succession.') - 6} left={420} top={420} text="CITIES FALL" size={54} />}
    </>
  );
};
const Collapse: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = num(s);
  const items = ['CONFUSED ORDERS', 'COLLAPSING MORALE', 'LOST TERRITORY'];
  if (n === 5 || n === 6) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}><InsertBg /></CameraRig>
      {items.map((t, i) => <Card key={t} at={n === 5 ? wordAt(s, ['Confused', 'morale,', 'territory'][i]) : -99} left={460 + i * 500} top={360} text={t} size={38} />)}
      {n === 6 && <Stamp at={wordAt(s, 'national')} left={960} top={600} text="NATIONAL DISASTER" size={64} />}
    </>
  );
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>{n === 3 && <g transform="translate(960 500)">{[0, 1, 2].map((i) => <rect key={i} x={-160 + (i % 2) * 20} y={-i * 110} width={320} height={100} fill={SOUTH} stroke={OL} strokeWidth={6} />)}<path d={`M-40 -260 L0 -180 L-30 -120 L20 -40 L-10 60`} stroke={OL} strokeWidth={8} fill="none" opacity={springPop(f, wordAt(s, 'fragile'))} /><text y={170} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#F4ECD8">SOUTH VIETNAM'S ARMY</text></g>}</Layer>
      </CameraRig>
      {n === 2 && <Card at={wordAt(s, 'test')} left={960} top={400} text="A TEST…" size={80} />}
    </>
  );
};
const Thieu: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = num(s);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#B8C4CC" /></Layer>
        <Layer depth={1}>
          <Palace x={960} y={800} s={0.7} />
          {n === 11 && <Chibi x={interpolate(f, [wordAt(s, 'resigned'), d], [960, 1900])} y={960} s={1.2} {...THIEU} legs="walk" pose="idle" expr="sad" talking={[]} seed="thieu" />}
          {n === 10 && <g transform="translate(1600 300)"><circle r={90} fill="#F4F7FA" stroke={OL} strokeWidth={6} /><path d="M0 0 V-70" stroke={OL} strokeWidth={6} transform={`rotate(${f * 10})`} /></g>}
        </Layer>
      </CameraRig>
      {n === 11 && <Label text="President Nguyễn Văn Thiệu · resigns 21 April 1975" x={960} y={140} at={wordAt(s, 'Thieu')} size={44} color="#1A1410" />}
    </>
  );
};
const Closing: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  const [sx, sy] = mapP('Saigon');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.2, zoomTo: 1.3, focus: [sx, sy - 120] }}>
        <InsertBg />
        <Layer depth={1}>
          <IndochinaMap x={M.x} y={M.y} s={M.s} fills={{ vn: '#D9584A' }} pins={[{ city: 'Saigon', at: 2, color: SOUTH }]} />
          <circle cx={sx} cy={sy} r={140 - (n === 12 ? Math.min(60, f) : 60)} fill="none" stroke={NORTH} strokeWidth={10} strokeDasharray="20 12" />
        </Layer>
      </CameraRig>
      {n === 14 && <Card at={wordAt(s, 'Frequent')} left={960} top={300} text="OPERATION FREQUENT WIND" size={54} />}
      {n === 13 && <Label text="the final evacuation" x={960} y={200} at={wordAt(s, 'evacuation.')} size={56} color="#FFD84A" />}
    </>
  );
};
const Airport: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  if (n === 16 || n === 17) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}><InsertBg glow={false} /></CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 320, textAlign: 'center', fontFamily: 'TagBold', fontSize: 64, color: '#E8E2D8', lineHeight: 1.5, opacity: springPop(f, n === 16 ? wordAt(s, 'Charles') : -99) }}>Cpl. Charles McMahon, 21<br />L/Cpl. Darwin Judge, 19</div>
      {n === 17 && <div style={{ position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: 'TagBold', fontSize: 36, color: '#9A9AA4', opacity: springPop(f, wordAt(s, 'last')) }}>the last US servicemen killed in combat in Vietnam</div>}
    </>
  );
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03, shakes: n === 15 ? [{ at: wordAt(s, 'shelling'), amp: 10, len: 12 }] : [] }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#B8C4CC" /></Layer>
        <Layer depth={1}>
          <rect x={-200} y={640} width={2400} height={700} fill="#8A8A84" />
          <rect x={-200} y={720} width={2400} height={120} fill="#5A5A5E" />{[...Array(12)].map((_, i) => <rect key={i} x={-160 + i * 200} y={776} width={100} height={10} fill="#F4F2EC" />)}
          <rect x={1400} y={420} width={160} height={220} fill="#D4CCBE" stroke={OL} strokeWidth={5} /><rect x={1370} y={380} width={220} height={60} fill="#A8C6E0" stroke={OL} strokeWidth={5} />
          {[0, 1, 2].map((i) => { const fl = Math.max(0, 1 - ((f + i * 17) % 40) / 10); return <circle key={i} cx={400 + i * 400} cy={760} r={60 * fl} fill="#FFD84A" opacity={fl} />; })}
          {n === 18 && <g transform="translate(700 700)"><path d="M-300 0 L280 -12 Q340 0 280 12 L-300 18 Z" fill="#E8E8E0" stroke={OL} strokeWidth={5} /><path d="M20 0 L-80 -120 L-130 -120 L-50 0 Z" fill="#E8E8E0" stroke={OL} strokeWidth={5} /></g>}
        </Layer>
      </CameraRig>
      {n === 15 && <Label text="Tân Sơn Nhứt Airport · 29 April" x={960} y={140} at={wordAt(s, 'Tan')} size={52} color="#1A1410" />}
      {n === 18 && <Stamp at={wordAt(s, 'no')} left={700} top={450} text="NO MORE FLIGHTS" size={56} />}
    </>
  );
};
const Gather: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = num(s);
  const crowd = n >= 21 ? 18 : 8;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#E8A070" /></Layer>
        <Layer depth={0.5}>{[...Array(7)].map((_, i) => <rect key={i} x={-100 + i * 320} y={380 + (i % 3) * 50} width={260} height={600} fill="#9A7A6A" stroke={OL} strokeWidth={4} />)}<rect x={1300} y={420} width={520} height={60} fill="#7A8A6A" stroke={OL} strokeWidth={4} /><text x={1560} y={462} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#fff">EVACUATION POINT</text></Layer>
        <Layer depth={1}>
          <rect x={-200} y={760} width={2400} height={600} fill="#7A6A5A" />
          {[...Array(crowd)].map((_, i) => <Chibi key={i} x={80 + (i % 9) * 200 + (i >= 9 ? 100 : 0)} y={i >= 9 ? 1010 : 900} s={0.85} {...VILLAGER(['#8A6A4A', '#5A4A3A', '#C9B98A', '#3A3A48', '#7A6A55'][i % 5], i)} item={i % 4 === 0 ? 'bundle' : undefined} pose={n >= 24 && i % 3 === 0 ? 'raise' : 'hold'} expr={n >= 24 ? 'worried' : 'normal'} talking={[]} seed={'gt' + i} />)}
        </Layer>
      </CameraRig>
      {n === 19 && <Label text="helicopters: the only way out" x={960} y={140} at={wordAt(s, 'Helicopters')} size={52} color="#1A1410" />}
      {n === 25 && <Card at={wordAt(s, 'not')} left={960} top={250} text="NOT ENOUGH SPACE FOR EVERYONE" size={52} color="#B3261E" />}
    </>
  );
};
const Lift: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = num(s);
  const cyc = (f % 150) / 150;
  const hy = cyc < 0.3 ? interpolate(cyc, [0, 0.3], [-200, 300], Easing.out) : cyc < 0.6 ? 300 : interpolate(cyc, [0.6, 1], [300, -260], Easing.in);
  const hx = cyc < 0.6 ? 960 : interpolate(cyc, [0.6, 1], [960, 1600]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Rooftop />
        <Layer depth={1}>
          <g transform={`translate(${hx} ${hy})`}><Huey x={0} y={0} s={0.85} /></g>
          {[...Array(8)].map((_, i) => <g key={i}><Chibi x={1100 - (i < 2 ? 0 : 0)} y={i < 2 ? 620 - 0 : 620} s={0} {...VILLAGER()} pose="idle" expr="normal" talking={[]} seed="none" /></g>).slice(0, 0)}
          {[...Array(6)].map((_, i) => { const up = Math.min(5, Math.floor((f / 20 + i) % 7)); return <Chibi key={i} x={1110 + Math.max(0, 5 - i) * 8} y={620 - Math.min(up, i) * 34} s={0.6} {...VILLAGER(['#8A6A4A', '#5A4A3A', '#C9B98A'][i % 3], i)} pose={i === 0 ? 'raise' : 'hold'} expr="worried" talking={[]} seed={'lf' + i} />; })}
          {[...Array(6)].map((_, i) => <g key={'r' + i} filter="url(#sil)"><Chibi x={420 + i * 120} y={820} s={0.75} {...VILLAGER('#3A3A48', i)} pose={i % 2 ? 'raise' : 'idle'} expr="normal" talking={[]} seed={'rq' + i} /></g>)}
        </Layer>
      </CameraRig>
      {n === 26 && <Label text="rooftops to ships offshore" x={960} y={140} at={wordAt(s, 'rooftops')} size={52} color="#1A1410" />}
    </>
  );
};
const ShipDeck: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = num(s);
  const push = n === 29 ? wordAt(s, 'pushed') : 99999;
  const t = Math.max(0, f - push);
  const px = 1100 + Math.min(1, t / 30) * 760 + (t > 30 ? (t - 30) * 4 : 0);
  const py = 520 + (t > 30 ? 0.5 * 1.4 * (t - 30) ** 2 : 0);
  const rot = t > 30 ? Math.min(90, (t - 30) * 4) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <CarrierDeck />
        <Layer depth={1}>
          {n === 27 && [0, 1].map((i) => { const x = interpolate(f, [0, d], [-300 + i * 600, 900 + i * 600]); return <g key={i} transform={`translate(${x} ${180 + i * 90})`}><Huey x={0} y={0} s={0.6} /></g>; })}
          {n >= 28 && <><g transform={`translate(${px} ${py}) rotate(${rot})`}><Huey x={0} y={0} s={0.7} color="#6E7A4A" /></g>{[0, 1, 2, 3].map((i) => <Chibi key={i} x={760 + i * 110 + Math.min(1, t / 30) * 300} y={600} s={0.75} {...{ outfit: { top: '#E8C23A', bottom: '#2E3A6A' }, hat: 'cap', hatColor: '#E8C23A' }} pose={t > 0 ? 'pull' : 'point'} expr="determined" talking={[]} seed={'dk' + i} />)}</>}
        </Layer>
      </CameraRig>
      {n === 29 && <Label text="aircraft pushed overboard to make room" x={960} y={140} at={wordAt(s, 'overboard')} size={50} color="#1A1410" />}
    </>
  );
};
const Tally: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  const cnt = n === 30 ? Math.round(7000 * interpolate(f, [wordAt(s, '7,000') - 30, wordAt(s, '7,000') + 4], [0, 1], Easing.out)) : 7000;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}><Sea horizon={500} /></CameraRig>
      <Counter label="EVACUATED BY HELICOPTER:" value={`${cnt.toLocaleString('en-US')}+`} left={60} top={120} />
      {n === 30 && <Counter label="IN ABOUT:" value="19 HOURS" left={60} top={210} k={springPop(f, wordAt(s, '19'))} />}
      {n === 31 && <div style={{ position: 'absolute', inset: 0, background: 'rgba(16,18,24,0.5)' }} />}
      {n === 31 && <Card at={wordAt(s, 'could')} left={960} top={420} text="MANY COULD NOT GET OUT" size={60} color="#B3261E" />}
    </>
  );
};
const PalaceGate: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = num(s);
  const crash = n === 34 ? wordAt(s, 'crashed') : n > 34 ? -60 : 99999;
  const tx = n === 33 ? interpolate(f, [0, d], [-200, 380]) : n === 34 ? interpolate(f, [0, crash, d], [0, 700, 900], Easing.out) : 900;
  const flag = n >= 35 ? 'vc' : 'svn';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03, shakes: n === 34 ? [{ at: crash, amp: 16, len: 14 }] : [] }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#B8C4CC" /><Cloud x={300} y={120} /></Layer>
        <Layer depth={1}>
          <Palace x={960} y={790} s={0.85} crash={crash} flag={flag as any} />
          {n >= 33 && <Tank x={tx} y={780} s={0.75} star num="390" />}
          {n === 33 && <Tank x={tx - 520} y={790} s={0.65} star num="843" />}
        </Layer>
      </CameraRig>
      {n === 32 && <svg style={{ position: 'absolute', left: 760, top: 200 }} width={400} height={520}><g transform="translate(200 250) scale(0.9)"><Calendar x={0} y={0} month="APRIL" day={30} year={1975} color={NORTH} /></g></svg>}
      {n === 35 && <Stamp at={wordAt(s, 'surrendered.') - 6} left={960} top={250} text="SURRENDER" size={70} />}
    </>
  );
};
const Over: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  if (n === 36) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}><IndochinaMap x={M.x} y={M.y} s={M.s} labels fills={{ vn: '#D9584A' }} /></Layer>
      </CameraRig>
      <Card at={wordAt(s, 'over.') - 6} left={400} top={400} text="THE WAR IS OVER" size={56} />
    </>
  );
  if (n <= 38) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}><IndochinaMap x={M.x} y={M.y} s={M.s} labels fills={{ vn: '#D9584A' }} pins={[{ city: 'Saigon', at: 2, color: NORTH, label: false }]} /></Layer>
      </CameraRig>
      <DropHtml at={wordAt(s, n === 37 ? 'Ho' : 'leader') - 2} left={420} top={420} h={300}><div style={{ background: '#F4F2EC', border: '6px solid #1A1410', padding: '10px 28px', fontFamily: 'TagBold', fontSize: 46, color: '#1A1410', textAlign: 'center' }}><s style={{ color: '#8A8A94' }}>SAIGON</s><br />HỒ CHÍ MINH CITY</div></DropHtml>
      {n === 38 && <Label text="1945 → 1975 · 30 years" x={420} y={640} at={wordAt(s, '30')} size={48} color="#FFD84A" />}
    </>
  );
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg glow={false} />
        <Layer depth={1}>
          <g transform="translate(960 470)"><rect x={-200} y={-260} width={400} height={480} fill="#7A4E2B" stroke={OL} strokeWidth={10} /><rect x={-170} y={-230} width={340} height={420} fill="#C9C4B0" /><g transform="translate(0 170)"><Chibi x={0} y={0} s={1.3} {...HO_OLD} pose="idle" expr="calm" talking={[]} seed="hoF" /></g></g>
          {n === 40 && <text x={960} y={830} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#F4ECD8" opacity={springPop(f, wordAt(s, '1969.'))}>1890 – 1969</text>}
          {n === 41 && <g transform="translate(1500 470)"><Flag kind="vn" x={-100} y={-100} s={0.9} pole={0} /></g>}
        </Layer>
      </CameraRig>
      {n === 39 && <Card at={wordAt(s, 'never')} left={960} top={150} text="HE NEVER SAW IT" size={52} />}
    </>
  );
};
const Verdict = hostShot((s) => [{ at: 0, arm: num(s) === 44 ? 'present' : num(s) === 47 ? 'finger' : 'chin', expr: num(s) >= 47 ? 'normal' : 'sad' }], {
  props: (s) => {
    const f = useCurrentFrame();
    const n = num(s);
    if (n === 42 || n === 43) return <PopProp at={4} x={1040} y={640}><g><rect x={-190} y={-110} width={380} height={220} rx={16} fill="#F4F7FA" stroke={OL} strokeWidth={6} /><text y={-40} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill={USA}>CENTRAL OBJECTIVE</text><path d="M-60 0 L60 80 M60 0 L-60 80" stroke="#B3261E" strokeWidth={14} /></g></PopProp>;
    if (n === 44 || n === 45) return <g>{[['WITHDRAWN', USA, 0], ['COLLAPSED', SOUTH, 45]].map(([t, c, k]: any, i) => <PopProp key={t} at={n === 44 + i ? 6 : n > 44 + i ? -99 : 99999} x={1040} y={540 + i * 160}><g><rect x={-180} y={-50} width={360} height={100} rx={14} fill={c} stroke={OL} strokeWidth={5} /><text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill={i ? '#1A1410' : '#fff'}>{t}</text></g></PopProp>)}</g>;
    if (n === 46) return <PopProp at={6} x={1040} y={620}><g transform="scale(0.5)"><Huey x={0} y={0} /></g></PopProp>;
    if (n === 48) return <PopProp at={wordAt(s, 'decades.')} x={1040} y={640}><g><rect x={-250} y={-70} width={500} height={140} rx={16} fill="#F4ECD8" stroke={OL} strokeWidth={6} /><text y={16} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#1A1410">TO BE CONTINUED</text></g></PopProp>;
    return null;
  },
});

export const SHOTS_05: ShotMap = {
  accords: Accords, homecoming: Homecoming, nobel: Nobel, point_peace: PointPeace, unresolved: Unresolved, alone: Alone, clock: Clock,
  offensive75: Offensive75, collapse: Collapse, thieu: Thieu, closing: Closing, airport: Airport, gather: Gather, lift: Lift, ship_deck: ShipDeck,
  tally: Tally, palace_gate: PalaceGate, over: Over, verdict: Verdict,
};
