/** Opening hook and Chapter 1 — "Before America, There Was France". */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, spring, springPop, gravityDrop, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg, Jungle } from '@engine/scenes/Backgrounds';
import { OL, Cloud } from '@engine/scenes/Parts';
import { IndochinaMap, VCITIES, Huey, B52, Tank, Palace, Rooftop, Paddy, Plantation, Flag, WhiteHouse, VN_RED } from '@engine/scenes/Vietnam';
import { hostShot, wordAt, PopProp, DropHtml, type ShotMap, type SP } from '@engine/kit';
import { USA, NORTH, SOUTH, FRANCE, MONEY, GOLD, HO_OLD, HO_YOUNG, NVA, FARMER, VILLAGER, GI, FR_OFFICIAL, FR_SOLDIER, Stamp, Card, Note, Calendar, CoinArc } from './Cast';

const MAPC = { x: 700, y: 40, s: 0.98 };
// ------------------------------------------------------------------ Opening hook
const Power = hostShot((s) => [{ at: 0, arm: 'present', expr: 'proud' }], {
  props: (s) => <><PopProp at={8} x={1040} y={380}><g transform="scale(0.55)"><B52 x={0} y={0} /></g></PopProp><PopProp at={14} x={1000} y={600}><g transform="scale(0.5)"><Huey x={0} y={0} /></g></PopProp><PopProp at={20} x={1020} y={790}><g transform="scale(0.45)"><Tank x={0} y={0} color="#5E6B45" /></g></PopProp></>,
});
const Arsenal: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b03 = s.id === 's01b03';
  const burn = b03 ? interpolate(f, [wordAt(s, 'forests'), d], [0, 1], Easing.inOut) : 0;
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#9CC8E0" /><Cloud x={300} y={140} /><Cloud x={1400} y={100} s={0.8} /></Layer>
      <Layer depth={0.5}>
        {[...Array(14)].map((_, i) => { const x = -100 + i * 160; const dead = x < -100 + burn * 2400; return <g key={i} transform={`translate(${x} 640)`}><rect x={-10} y={-120} width={20} height={120} fill={dead ? '#5A4A3A' : '#6A4A2A'} /><circle cy={-150} r={80} fill={dead ? '#8A7A5A' : '#3E7A3A'} stroke={OL} strokeWidth={4} opacity={dead ? 0.6 : 1} /></g>; })}
        <rect x={-200} y={640} width={2400} height={700} fill={burn > 0.5 ? '#9A8A62' : '#7A9A4A'} />
      </Layer>
      <Layer depth={1}>
        {!b03 && [0, 1, 2].map((i) => <g key={i} transform={`translate(${interpolate(f, [0, d], [-300 + i * 260, 1500 + i * 260])} ${140 + i * 70}) scale(0.5)`}><B52 x={0} y={0} /></g>)}
        {[...Array(9)].map((_, i) => <Chibi key={i} x={140 + i * 210} y={930} s={0.9} {...GI(i)} legs="march" pose="hold" expr="determined" talking={[]} seed={'ar' + i} delay={i * 2} />)}
      </Layer>
    </CameraRig>
  );
};
const WalkAway: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b05 = s.id === 's01b05';
  const fill = b05 ? 1 : interpolate(f, [wordAt(s, '20'), d], [0, 1]);
  const [sx, sy] = VCITIES.Saigon;
  const hx = b05 ? interpolate(f, [0, d], [0, 900]) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          <IndochinaMap x={MAPC.x} y={MAPC.y} s={MAPC.s} labels />
          <g transform="translate(240 160)"><rect x={0} y={0} width={340} height={40} rx={20} fill="#3A3A48" stroke={OL} strokeWidth={4} /><rect x={0} y={0} width={340 * fill} height={40} rx={20} fill={USA} /><text x={0} y={-14} fontFamily="TagBold" fontSize={30} fill="#F4ECD8">1955</text><text x={340} y={-14} textAnchor="end" fontFamily="TagBold" fontSize={30} fill="#F4ECD8">1975</text></g>
          {b05 && <g transform={`translate(${MAPC.x + MAPC.s * sx + hx} ${MAPC.y + MAPC.s * sy - 60 - hx * 0.3}) scale(0.32)`}><Huey x={0} y={0} /></g>}
        </Layer>
      </CameraRig>
      {b05 && <Stamp at={wordAt(s, 'without')} left={420} top={500} text="OBJECTIVE NOT MET" size={46} />}
    </>
  );
};
const Checks: React.FC<SP> = ({ s }) => {
  const idx = ['s01b06', 's01b07', 's01b08', 's01b09'].indexOf(s.id);
  const rows = ['WON MAJOR BATTLES', 'DESTROYED POSITIONS', 'MILLIONS OF TONS DROPPED'];
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>{rows.map((r, i) => { const k = springPop(f, i < idx ? -99 : i === idx ? 6 : 99999); return k > 0 ? <g key={i} transform={`translate(560 ${240 + i * 150}) scale(${k})`}><rect x={-60} y={-50} width={100} height={100} rx={14} fill="#F4F7FA" stroke={OL} strokeWidth={6} /><path d="M-35 0 L-12 24 L28 -26" stroke={MONEY} strokeWidth={14} fill="none" strokeLinecap="round" /><text x={80} y={18} fontFamily="TagBold" fontSize={52} fill="#F4ECD8">{r}</text></g> : null; })}</Layer>
      </CameraRig>
      {idx === 3 && <Stamp at={wordAt(s, 'lost')} left={960} top={720} text="AND STILL LOST THE WAR" size={64} />}
    </>
  );
};
const Outgun = hostShot((s) => [{ at: 0, arm: s.id === 's01b10' ? 'present' : 'shrug', expr: s.id === 's01b11' ? 'normal' : 'smile' }], {
  props: (s) => {
    const f = useCurrentFrame();
    if (s.id === 's01b10') return <PopProp at={6} x={1040} y={640}><g><path d="M-200 0 H200" stroke={OL} strokeWidth={10} /><path d="M0 0 V180 M-80 180 H80" stroke={OL} strokeWidth={10} /><g transform="translate(-160 -10)"><rect x={-60} y={-120} width={120} height={120} fill={USA} stroke={OL} strokeWidth={5} /><text y={-50} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#fff">USA</text></g><g transform="translate(160 -10)"><rect x={-26} y={-50} width={52} height={50} fill={NORTH} stroke={OL} strokeWidth={5} /></g></g></PopProp>;
    return <g>{['outgun,', 'outfly,', 'outspend?'].map((w, i) => <PopProp key={w} at={wordAt(s, w)} x={1040} y={420 + i * 140}><g><rect x={-170} y={-50} width={340} height={100} rx={14} fill={USA} stroke={OL} strokeWidth={5} /><text y={16} textAnchor="middle" fontFamily="TagBold" fontSize={42} fill="#fff">{w.replace(/[,?]/g, '').toUpperCase()}</text></g></PopProp>)}</g>;
  },
});
const Teasers: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s01b12', 's01b13', 's01b14'].indexOf(s.id);
  const cards = [
    { at: idx === 0 ? wordAt(s, 'long') : -99, t: 'A WAR OLDER THAN AMERICA’S PART IN IT', c: FRANCE },
    { at: idx === 1 ? wordAt(s, 'feared') : idx > 1 ? -99 : 99999, t: 'A PRESIDENT AFRAID TO LOSE', c: USA },
    { at: idx === 2 ? wordAt(s, 'never') : 99999, t: 'AN ATTACK THAT NEVER HAPPENED', c: '#5A5A64' },
    { at: idx === 2 ? wordAt(s, 'winning.') - 4 : 99999, t: '“WE’RE WINNING”', c: NORTH },
  ];
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
      <InsertBg />
      <Layer depth={1}>{cards.map((c, i) => { const k = springPop(f, c.at); return k > 0 ? <g key={i} transform={`translate(${520 + (i % 2) * 880} ${290 + Math.floor(i / 2) * 300}) scale(${k}) rotate(${i % 2 ? 2 : -2})`}><rect x={-400} y={-90} width={800} height={180} rx={18} fill={c.c} stroke={OL} strokeWidth={7} /><text y={16} textAnchor="middle" fontFamily="TagBold" fontSize={i === 0 ? 34 : 44} fill="#fff">{c.t}</text><text x={-370} y={-54} fontFamily="TagBold" fontSize={30} fill="#FFD84A">{i + 1}</text></g> : null; })}</Layer>
    </CameraRig>
  );
};
const PalaceTease: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b16 = s.id === 's01b16';
  if (b16) return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <Rooftop />
      <Layer depth={1}>
        <g transform={`translate(960 ${300 + Math.sin(f / 6) * 6})`}><Huey x={0} y={0} s={0.85} /></g>
        {[...Array(7)].map((_, i) => <g key={i} filter="url(#sil)"><Chibi x={440 + i * 140} y={820} s={0.8} {...VILLAGER('#5A4A3A', i)} pose={i === 6 ? 'raise' : 'idle'} expr="normal" talking={[]} seed={'rq' + i} /></g>)}
      </Layer>
    </CameraRig>
  );
  const crash = wordAt(s, 'crashing');
  const tx = interpolate(f, [0, crash, d], [-500, 720, 1000], Easing.out);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03, shakes: [{ at: crash, amp: 14, len: 12 }] }}>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#B8C4CC" /></Layer>
      <Layer depth={1}><Palace x={960} y={790} s={0.85} crash={crash} /><Tank x={tx} y={780} s={0.75} star num="390" /></Layer>
    </CameraRig>
  );
};
const Twist = hostShot((s) => [{ at: 0, arm: s.id === 's01b17' ? 'finger' : 'present', expr: s.id === 's01b17' ? 'grin' : 'normal' }], {
  props: (s) => s.id === 's01b18' ? <PopProp at={wordAt(s, 'before')} x={1040} y={620}><g><rect x={-200} y={-90} width={400} height={180} rx={16} fill="#F4ECD8" stroke={OL} strokeWidth={6} /><text y={-14} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#B3261E">BEFORE</text><text y={40} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#1A1410">THE FIRST SHOT</text></g></PopProp> : null,
});
const Rewind: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const b20 = s.id === 's01b20';
  const yr = b20 ? 1975 : Math.round(interpolate(f, [wordAt(s, 'back'), d - 4], [1975, 1858], Easing.inOut));
  if (b20) return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <Rooftop />
      <Layer depth={1}><g transform={`translate(${interpolate(f, [0, d], [900, 1900])} ${interpolate(f, [0, d], [300, 120])})`}><Huey x={0} y={0} s={0.6} /></g></Layer>
    </CameraRig>
  );
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <InsertBg />
      <Layer depth={1}><Calendar x={960} y={470} month="REWIND" day={yr} color="#5A5A64" /></Layer>
    </CameraRig>
  );
};

// ------------------------------------------------------------------ Chapter 1
const Invade = hostShot((s) => [{ at: 0, arm: 'present', expr: 'normal' }], {
  props: (s) => <PopProp at={wordAt(s, 'invaded')} x={1040} y={560}><g transform="scale(0.36)"><IndochinaMap x={-230} y={-400} s={1} neighbours={false} fills={{ vn: '#7AA0D8' }} /></g><Flag kind="fr" x={-30} y={-150} s={0.5} pole={200} /></PopProp>,
});
const Colony: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b03 = s.id === 's02b03';
  const k = interpolate(f, [4, 40], [0, 1]);
  const blue = (base: string, t: number) => (t > 0.5 ? '#7AA0D8' : base);
  const tLaos = b03 ? interpolate(f, [wordAt(s, 'Laos,'), wordAt(s, 'Laos,') + 6], [0, 1]) : 0;
  const tCam = b03 ? interpolate(f, [wordAt(s, 'Cambodia.'), wordAt(s, 'Cambodia.') + 6], [0, 1]) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}><IndochinaMap x={MAPC.x} y={MAPC.y} s={MAPC.s} labels fills={{ vn: b03 || k > 0.5 ? '#7AA0D8' : '#E8DCC0', laos: blue('#D8CCB0', tLaos), camb: blue('#D8CCB0', tCam) }} /></Layer>
      </CameraRig>
      {b03 && <Label text="French Indochina, 1887" x={400} y={200} at={wordAt(s, 'Indochina,')} size={56} color="#FFD84A" />}
      {b03 && <Note at={wordAt(s, 'Laos,')} text="Laos became a French protectorate in 1893 and joined the federation in 1899." top={120} />}
    </>
  );
};
const Rubber: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s02b04', 's02b05', 's02b06', 's02b07'].indexOf(s.id);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Plantation />
        <Layer depth={1}>
          {[0, 1, 2, 3].map((i) => <Chibi key={i} x={240 + i * 300} y={930} s={1.0} {...FARMER(['#6A5A45', '#5A4A3A', '#7A6A55', '#4A3A2A'][i])} pose={i % 2 ? 'carry' : 'hold'} expr="sad" talking={[]} seed={'pw' + i} />)}
          <Chibi x={1560} y={930} s={1.2} {...FR_OFFICIAL} pose={idx === 0 ? 'hipAngry' : 'point'} expr="normal" talking={[]} seed="ovs" flip />
          {idx === 3 && <><CoinArc from={[600, 700]} to={[1700, 300]} start={wordAt(s, 'wealth')} every={3} n={20} sym="₣" /><Flag kind="fr" x={1700} y={180} s={0.6} pole={200} /></>}
        </Layer>
      </CameraRig>
      {idx === 2 && ['salt,', 'alcohol,', 'opium.'].map((w, i) => <Card key={w} at={wordAt(s, w)} left={480 + i * 480} top={260} text={w.replace(/[,.]/g, '').toUpperCase()} sub="STATE MONOPOLY" size={52} rot={[-3, 2, -2][i]} />)}
      {idx === 1 && <Label text="rice and rubber for export" x={960} y={170} at={wordAt(s, 'rubber')} size={52} color="#1A1410" />}
    </>
  );
};
const RiceTax: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s02b08', 's02b09', 's02b10'].indexOf(s.id);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Paddy />
        <Layer depth={1}>
          {[0, 1, 2].map((i) => <Chibi key={i} x={340 + i * 260} y={900} s={1.0} {...FARMER()} legs="kneel" pose="hold" expr="sad" talking={[]} seed={'rf' + i} />)}
          {idx >= 1 && <Chibi x={1400} y={920} s={1.15} {...FR_OFFICIAL} item="notebook" pose="present" expr="normal" talking={[]} seed="taxman" flip />}
          {idx === 2 && <Flag kind="fr" x={1640} y={420} s={0.6} pole={480} />}
          {idx === 0 && <g transform="translate(1300 520) rotate(3)"><rect x={-10} y={0} width={20} height={300} fill="#6A4A2A" /><rect x={-200} y={-90} width={400} height={110} fill="#F4ECD8" stroke={OL} strokeWidth={5} /><text y={-20} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#1A1410">PROPRIÉTÉ</text><text y={10} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill="#5A4A3A">COLONIAL ESTATE</text></g>}
        </Layer>
      </CameraRig>
      {idx === 1 && <Stamp at={wordAt(s, 'taxes')} left={1400} top={360} text="TAX" size={56} />}
    </>
  );
};
const Exploited: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b12 = s.id === 's02b12';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}><InsertBg /></CameraRig>
      <Card at={4} left={960} top={330} text="GOVERNED" size={90} />
      {(b12 || f > wordAt(s, 'foreign')) && <div style={{ position: 'absolute', left: 700, top: 330, width: 520, height: 14, background: '#B3261E', transform: 'rotate(-8deg)', opacity: springPop(f, b12 ? -99 : wordAt(s, 'foreign')) }} />}
      {b12 && <Stamp at={wordAt(s, 'exploited')} left={960} top={560} text="EXPLOITED" size={100} />}
    </>
  );
};
const HoReveal: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b14 = s.id === 's02b14';
  const lit = b14 ? interpolate(f, [wordAt(s, 'Ho'), wordAt(s, 'Ho') + 14], [0, 1]) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.05, zoomTo: 1.0, focus: [960, 600] }}>
        <Paddy dusk />
        <Layer depth={1}><g filter={lit < 1 ? 'url(#sil)' : undefined}><Chibi x={960} y={920} s={1.7} {...HO_YOUNG} pose={b14 ? 'fist' : 'idle'} expr="determined" talking={[]} seed="hoR" /></g></Layer>
      </CameraRig>
      {b14 && <Label text="Hồ Chí Minh" x={960} y={180} at={wordAt(s, 'Ho')} size={70} color="#fff" />}
    </>
  );
};
const PLACES: [string, number, number][] = [['VIETNAM', 1560, 640], ['FRANCE', 760, 300], ['BRITAIN', 640, 200], ['SOVIET UNION', 1100, 200], ['CHINA', 1420, 440]];
const Travels: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s02b15', 's02b16', 's02b17', 's02b18', 's02b19', 's02b20'].indexOf(s.id);
  const prog = idx === 0 ? interpolate(f, [wordAt(s, '1911'), wordAt(s, '1911') + 20], [0, 1]) : idx === 1 ? 1 + interpolate(f, [wordAt(s, 'France,'), wordAt(s, 'China.') + 6], [0, 3]) : 4;
  const seg = Math.min(3.999, Math.max(0, prog));
  const a = PLACES[Math.floor(seg)], b = PLACES[Math.floor(seg) + 1];
  const t = seg - Math.floor(seg);
  const hx = a[1] + (b[1] - a[1]) * t, hy = a[2] + (b[2] - a[2]) * t;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          {idx <= 1 && <>{PLACES.map(([n, x, y], i) => <g key={n} opacity={i <= prog + 0.01 ? 1 : 0.35}><circle cx={x} cy={y} r={18} fill={i === 0 ? NORTH : '#F4ECD8'} stroke={OL} strokeWidth={4} /><text x={x} y={y - 30} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#fff">{n}</text></g>)}
            <path d={'M' + PLACES.slice(0, Math.floor(seg) + 1).map(([, x, y]) => `${x} ${y}`).join(' L') + ` L${hx} ${hy}`} stroke="#FFD84A" strokeWidth={6} strokeDasharray="14 10" fill="none" />
            <g transform={`translate(${hx} ${hy + 140})`}><Chibi x={0} y={0} s={0.6} {...HO_YOUNG} legs="walk" pose="carry" expr="determined" talking={[]} seed="hoT" /></g></>}
          {idx === 2 && <g transform={`translate(960 470) scale(${springPop(f, wordAt(s, 'studied'))})`}><rect x={-160} y={-200} width={320} height={400} rx={10} fill={NORTH} stroke={OL} strokeWidth={7} /><text y={-40} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#FFD84A">REVOLUTION</text><path d="M0 40 l12 34 h36 l-29 21 l11 34 l-30 -21 l-30 21 l11 -34 l-29 -21 h36 Z" fill="#FFD84A" /></g>}
          {idx >= 3 && <><Chibi x={760} y={900} s={1.5} {...HO_YOUNG} pose="chin" expr="calm" talking={[]} seed="hoD" />
            <g transform={`translate(1260 400) scale(${springPop(f, idx === 3 ? 6 : -99)})`}><ellipse rx={300} ry={200} fill="#F4F7FA" stroke={OL} strokeWidth={6} /><circle cx={-280} cy={190} r={22} fill="#F4F7FA" stroke={OL} strokeWidth={5} /><circle cx={-330} cy={250} r={12} fill="#F4F7FA" stroke={OL} strokeWidth={4} />
              {idx < 5 ? <text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#1A1410">{idx === 3 ? 'more than ideology…' : '…'}</text> : <><text y={-40} textAnchor="middle" fontFamily="TagBold" fontSize={50} fill={NORTH}>INDEPENDENCE</text><g transform="translate(-60 0) scale(0.55)"><Flag kind="vn" x={0} y={0} pole={0} /></g></>}</g></>}
        </Layer>
      </CameraRig>
      {idx === 0 && <Label text="born 1890 · left in 1911" x={960} y={820} at={wordAt(s, '1890,')} size={48} color="#FFD84A" />}
    </>
  );
};
const VietMinh: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s02b21', 's02b22', 's02b23'].indexOf(s.id);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Jungle />
        <Layer depth={1.1}>
          <Chibi x={420} y={940} s={1.3} {...HO_OLD} pose="present" expr="determined" talking={[]} seed="hoVM" />
          {[0, 1, 2, 3].map((i) => <Chibi key={i} x={700 + i * 170} y={950} s={1.0} {...NVA} hatColor={['#6E7A4A', '#C9B98A'][i % 2]} pose={i % 2 ? 'raise' : 'hold'} expr="determined" talking={[]} seed={'vm' + i} />)}
          {idx >= 1 && <g opacity={springPop(f, idx === 1 ? wordAt(s, 'Japanese') : -99)}><g filter="url(#sil)"><Chibi x={1660} y={950} s={1.15} outfit={{ top: '#8A8A5A', bottom: '#8A8A5A' }} hat="cap" hatColor="#6A6A4A" item="musket" pose="hold" expr="normal" talking={[]} seed="jp" flip /></g><text x={1660} y={560} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#fff" stroke={OL} strokeWidth={5} style={{ paintOrder: 'stroke' }}>JAPANESE OCCUPATION</text></g>}
        </Layer>
      </CameraRig>
      {idx === 0 && <Label text="the Việt Minh, 1941" x={960} y={140} at={wordAt(s, 'Viet')} size={56} color="#1A1410" />}
    </>
  );
};
const Surrender45: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const b25 = s.id === 's02b25';
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <InsertBg />
      <Layer depth={1}>
        <Calendar x={b25 ? 560 : 960} y={470} month="AUGUST" day={15} year={1945} color="#5A5A64" />
        {!b25 && <g transform={`translate(1420 220) scale(${springPop(f, wordAt(s, 'surrendered.'))})`}><Flag kind="white" x={0} y={0} s={0.9} wave={Math.sin(f / 7) * 4} /></g>}
        {b25 && <g transform="translate(1360 900)"><Chibi x={0} y={0} s={1.5} {...HO_OLD} pose="raise" expr="happy" talking={[]} seed="hoM" /></g>}
      </Layer>
    </CameraRig>
  );
};
const BaDinh: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s02b26', 's02b27', 's02b28', 's02b29'].indexOf(s.id);
  return (
    <>
      <CameraRig move={{ zoomFrom: idx >= 2 ? 1.08 : 1, zoomTo: idx >= 2 ? 1.12 : 1.04, focus: [960, 520] }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#A8D4E6" /><Cloud x={400} y={120} /><Cloud x={1500} y={160} s={0.8} /></Layer>
        <Layer depth={0.6}>
          <rect x={720} y={420} width={480} height={240} fill="#C9B07A" stroke={OL} strokeWidth={6} />
          <Flag kind="vn" x={700} y={180} s={0.7} pole={480} wave={Math.sin(f / 8) * 3} /><Flag kind="vn" x={1220} y={180} s={0.7} pole={480} wave={Math.sin(f / 8 + 1) * 3} />
          <Chibi x={960} y={440} s={1.1} {...HO_OLD} item="scroll" pose={idx >= 1 ? 'present' : 'raise'} expr="determined" talking={[[4, 200]]} seed="hoBD" />
          <rect x={-200} y={660} width={2400} height={700} fill="#B8A87A" />
        </Layer>
        <Layer depth={1}>{[...Array(16)].map((_, i) => <Chibi key={i} x={-20 + (i % 8) * 280 + (i >= 8 ? 140 : 0)} y={i >= 8 ? 1000 : 880} s={0.85} {...VILLAGER(['#8A6A4A', '#5A4A3A', '#C9B98A', '#3A3A48'][i % 4], i)} pose={i % 3 ? 'cheer' : 'raise'} expr="happy" talking={[]} seed={'bd' + i} />)}</Layer>
      </CameraRig>
      {idx === 0 && <Label text="Hanoi · 2 September 1945" x={960} y={120} at={wordAt(s, 'September')} size={56} color="#1A1410" />}
      {idx === 2 && <Card at={2} left={960} top={250} text="“All men are created equal.”" size={64} />}
      {idx === 3 && <><Card at={-99} left={960} top={220} text="“All men are created equal.”" size={52} /><DropHtml at={wordAt(s, 'Declaration')} left={960} top={480} h={300}><div style={{ background: '#EAD9B0', border: '6px solid #5A3A22', padding: '14px 30px', fontFamily: 'Hand', fontSize: 46, color: '#3A2416', transform: 'rotate(-2deg)' }}>U.S. Declaration of Independence · 1776</div></DropHtml></>}
    </>
  );
};
const Echo: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s02b30', 's02b31', 's02b32', 's02b33', 's02b34'].indexOf(s.id);
  if (idx === 0) return hostShot(() => [{ at: 0, arm: 'chin', expr: 'normal' }])({ s }) as any;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform="translate(560 470)"><rect x={-230} y={-260} width={460} height={520} fill="#EAD9B0" stroke="#5A3A22" strokeWidth={8} /><text y={-180} textAnchor="middle" fontFamily="Hand" fontSize={48} fill="#3A2416">1776</text>{[...Array(8)].map((_, i) => <path key={i} d={`M-180 ${-110 + i * 40} H${170 - (i % 3) * 40}`} stroke="#B8A47A" strokeWidth={5} />)}<text y={240} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#5A3A22">“all men are created equal”</text></g>
          <path d="M820 470 H1060" stroke="#FFD84A" strokeWidth={10} strokeDasharray="20 14" strokeDashoffset={-f * 2} />
          <g transform="translate(1360 900)"><Chibi x={0} y={0} s={1.5} {...HO_OLD} pose={idx >= 3 ? 'present' : 'hold'} item="scroll" expr="determined" talking={idx >= 3 ? [[4, 200]] : []} seed="hoE" /></g>
          {idx >= 3 && <g transform={`translate(1360 330) scale(${springPop(f, idx === 3 ? 4 : -99)})`}><rect x={-330} y={-100} width={660} height={170} rx={30} fill="#F4F7FA" stroke={OL} strokeWidth={6} /><text y={-20} textAnchor="middle" fontFamily="Hand" fontSize={42} fill="#1A1410">You fought for your freedom.</text>{idx === 4 && <text y={40} textAnchor="middle" fontFamily="Hand" fontSize={42} fill={NORTH}>Now help us fight for ours.</text>}</g>}
        </Layer>
      </CameraRig>
      {idx === 1 && <Label text="1945" x={1360} y={420} at={4} size={70} color="#FFD84A" />}
    </>
  );
};
const OSS: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform={`translate(960 470) rotate(-2) scale(${springPop(f, 4)})`}>
            <rect x={-520} y={-320} width={1040} height={640} fill="#F4F2EC" stroke={OL} strokeWidth={8} />
            <rect x={-490} y={-290} width={980} height={520} fill="#C8C0A8" />
            <g transform="translate(0 210)">
              {[{ p: { outfit: { top: '#8A8A5A', bottom: '#8A8A5A' }, hat: 'hair', hair: '#7A5A3A' }, x: -330 }, { p: HO_OLD, x: -110 }, { p: { outfit: { top: '#8A8A5A', bottom: '#8A8A5A' }, hat: 'hair', hair: '#C9A66B' }, x: 110 }, { p: NVA, x: 330 }].map((c, i) => <Chibi key={i} x={c.x} y={0} s={1.05} {...(c.p as any)} pose="idle" expr="calm" talking={[]} seed={'os' + i} />)}
            </g>
            <text y={290} textAnchor="middle" fontFamily="Hand" fontSize={40} fill="#3A2416">OSS team with the Việt Minh, 1945</text>
          </g>
        </Layer>
      </CameraRig>
      {s.id === 's02b36' && <Label text="American intelligence (OSS)" x={960} y={80} at={wordAt(s, 'intelligence')} size={50} color="#FFD84A" />}
    </>
  );
};
const RedFear: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const idx = ['s02b38', 's02b39', 's02b40', 's02b41'].indexOf(s.id);
  if (idx <= 1) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}><InsertBg /><Layer depth={1}><g transform="translate(960 900)"><Chibi x={0} y={0} s={1.8} {...HO_OLD} pose="idle" expr="calm" talking={[]} seed="hoC" /></g></Layer></CameraRig>
      {idx === 1 && <Stamp at={wordAt(s, 'communist.') - 4} left={960} top={260} text="COMMUNIST" size={80} />}
      {idx === 0 && <Label text="one problem" x={960} y={200} at={wordAt(s, 'problem.')} size={60} color="#FFD84A" />}
    </>
  );
  const spread = idx === 3 ? interpolate(f, [0, 40], [0.3, 1]) : interpolate(f, [wordAt(s, 'fear'), wordAt(s, 'fear') + 30], [0, 0.3]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}><IndochinaMap x={MAPC.x} y={MAPC.y} s={MAPC.s} labels chinaFill={spread > 0.2 ? '#D9584A' : '#C9C0AA'} fills={{ vn: spread > 0.6 ? '#E8A094' : '#E8DCC0', laos: spread > 0.85 ? '#E8A094' : '#D8CCB0', camb: spread > 0.95 ? '#E8A094' : '#D8CCB0' }} /></Layer>
      </CameraRig>
      {idx === 3 && <Label text="the spread of communism" x={420} y={300} at={4} size={56} color="#FF6B57" />}
    </>
  );
};
const Choice: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const idx = ['s02b42', 's02b43', 's02b44', 's02b45', 's02b46'].indexOf(s.id);
  const tip = idx >= 2 ? (idx === 2 ? spring(f - wordAt(s, 'France.'), { damping: 8, stiffness: 70 }) * (f >= wordAt(s, 'France.') ? 1 : 0) : 1) : 0;
  const ang = -10 + 0 * tip + 22 * tip;
  const dark = idx >= 3 ? interpolate(f, [0, d], idx === 3 ? [0, 0.4] : [0.4, 0.6]) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 500] }}>
        <InsertBg />
        <Layer depth={1}>
          <path d="M960 260 V780 M840 780 H1080" stroke="#C9A66B" strokeWidth={16} strokeLinecap="round" />
          <g transform={`translate(960 280) rotate(${idx >= 2 ? ang : Math.sin(f / 12) * 6})`}>
            <path d="M-440 0 H440" stroke="#C9A66B" strokeWidth={14} strokeLinecap="round" />
            {[-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * 420} 0) rotate(${-(idx >= 2 ? ang : Math.sin(f / 12) * 6)})`}><path d="M0 0 L-110 190 M0 0 L110 190" stroke="#C9A66B" strokeWidth={5} /><path d="M-140 190 Q0 250 140 190 Z" fill="#C9A66B" stroke={OL} strokeWidth={5} /><g transform="translate(-80 40) scale(0.75)"><Flag kind={sd < 0 ? 'vn' : 'fr'} x={0} y={0} pole={0} /></g><text y={310} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#F4ECD8">{sd < 0 ? 'VIETNAMESE INDEPENDENCE' : 'EUROPEAN ALLY'}</text></g>)}
          </g>
          {idx >= 2 && <g transform={`translate(1380 120) scale(${springPop(f, idx === 2 ? wordAt(s, 'chose') : -99)})`}><Flag kind="us" x={0} y={0} s={0.55} pole={0} /></g>}
        </Layer>
      </CameraRig>
      {dark > 0 && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 45%, transparent 25%, #000 90%)', opacity: dark }} />}
    </>
  );
};

export const SHOTS_01: ShotMap = {
  h_power: Power, h_arsenal: Arsenal, h_walkaway: WalkAway, h_checks: Checks, h_outgun: Outgun, h_teasers: Teasers,
  h_palace: PalaceTease, h_twist: Twist, h_rewind: Rewind,
  c1_invade: Invade, colony: Colony, rubber: Rubber, rice_tax: RiceTax, exploited: Exploited, ho_reveal: HoReveal,
  travels: Travels, viet_minh: VietMinh, surrender45: Surrender45, ba_dinh: BaDinh, echo: Echo, oss: OSS, red_fear: RedFear, choice: Choice,
};
