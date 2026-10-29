/**
 * Chapter 6 — Tet, Chapter 7 — My Lai (restrained: no violence shown; an empty village at dawn,
 * numbers, and Hugh Thompson's helicopter landing between soldiers and villagers), Chapter 8 — Nixon.
 */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, spring, springPop, gravityDrop, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL, Cloud, Tree } from '@engine/scenes/Parts';
import { IndochinaMap, VCITIES, vnXY, Huey, Jet, B52, Embassy, Citadel, Village, TVSet, Flag, WhiteHouse, Capitol, Paddy } from '@engine/scenes/Vietnam';
import { hostShot, wordAt, PopProp, DropHtml, type ShotMap, type SP } from '@engine/kit';
import { USA, NORTH, SOUTH, MONEY, GOLD, NVA, VC, GI, SVN, LBJ, NIXON, ANCHOR, OFFICIAL_US, PILOT, PROTESTER, VILLAGER, SUIT, Stamp, Card, Note, Counter, Calendar, Bars } from './Cast';

const M = { x: 700, y: 40, s: 0.98 };
const mapP = (c: string) => { const [x, y] = VCITIES[c]; return [M.x + M.s * x, M.y + M.s * y]; };
const ll = (lon: number, lat: number) => { const [x, y] = vnXY(lon, lat); return [M.x + M.s * x, M.y + M.s * y]; };
const num = (s: { id: string }) => parseInt(s.id.slice(4), 10);
/** A living room watching the TV news; `screen` is drawn on the set. */
const LivingRoom: React.FC<{ screen: React.ReactNode; family?: boolean; worried?: boolean }> = ({ screen, family = true, worried }) => (
  <>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#D8B88A" />{[...Array(12)].map((_, i) => <rect key={i} x={-200 + i * 200} y={-200} width={100} height={1500} fill="#CFAE80" />)}<rect x={1500} y={160} width={300} height={260} fill="#A8C6E0" stroke={OL} strokeWidth={8} /></Layer>
    <Layer depth={1}>
      <rect x={-200} y={800} width={2400} height={600} fill="#7A5A3A" />
      <TVSet x={1240} y={560} s={1.1}>{screen}</TVSet>
      {family && <><rect x={140} y={640} width={640} height={200} rx={40} fill="#6A8A5A" stroke={OL} strokeWidth={6} />{[0, 1, 2].map((i) => <Chibi key={i} x={260 + i * 200} y={820} s={1.0} {...SUIT(['#C0392B', '#3A5A8A', '#E8C23A'][i], ['#3A2416', '#C9A66B', '#7A3A1A'][i])} legs="sit" pose={worried ? (i === 1 ? 'chin' : 'idle') : 'idle'} expr={worried ? 'worried' : 'normal'} talking={[]} seed={'fam' + i} />)}</>}
    </Layer>
  </>
);

// ------------------------------------------------------------------ Chapter 6: Tet
const Progress = hostShot((s) => [{ at: 0, arm: 'present', expr: 'smile' }], {
  props: (s) => {
    const f = useCurrentFrame();
    return <PopProp at={4} x={1040} y={620}><g><rect x={-200} y={-140} width={400} height={260} rx={14} fill="#F4F7FA" stroke={OL} strokeWidth={6} /><path d="M-160 80 L-80 30 L0 0 L80 -50 L160 -100" stroke={MONEY} strokeWidth={12} fill="none" /><path d="M140 -110 L170 -104 L160 -76" stroke={MONEY} strokeWidth={12} fill="none" /><text y={-100} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#1A1410">“PROGRESS”</text></g></PopProp>;
  },
});
const TetMap: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  const places = ['Saigon', 'Hue', 'Da Nang', 'Quang Tri', 'Khe Sanh', 'Nha Trang', 'Ban Me Thuot', 'Tay Ninh', 'Cu Chi', 'My Lai', 'Ia Drang'];
  const extra: [number, number][] = [[105.8, 10.0], [106.3, 10.4], [105.1, 9.6], [107.9, 12.7], [108.3, 14.3], [107.0, 11.9], [106.6, 11.6], [108.9, 13.9], [109.1, 12.5], [106.2, 9.8], [107.6, 15.6], [108.5, 15.3]];
  const t0 = n === 6 ? wordAt(s, 'coordinated') : n >= 7 ? -200 : 99999;
  const all = [...places.map((p) => mapP(p)), ...extra.map(([a, b]) => ll(a, b))];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, shakes: n === 6 ? [{ at: t0 + 10, amp: 8, len: 12 }] : [] }}>
        <InsertBg />
        <Layer depth={1}>
          <IndochinaMap x={M.x} y={M.y} s={M.s} labels split parallel={1} fills={{ north: '#D9584A', south: '#E8C65A' }} />
          {all.map(([x, y], i) => { const k = springPop(f, t0 + i * 2); return k > 0 ? <g key={i}><circle cx={x} cy={y} r={14 * k + Math.sin(f / 4 + i) * 2} fill="#FF4A2A" stroke={OL} strokeWidth={3} /><circle cx={x} cy={y} r={28 * k} fill="#FF4A2A" opacity={0.25} /></g> : null; })}
          {n === 5 && <g transform="translate(360 470)">{[...Array(14)].map((_, i) => { const t = (f + i * 7) % 60; return <circle key={i} cx={Math.cos(i) * (20 + t * 3)} cy={Math.sin(i * 1.7) * (20 + t * 2) - t} r={5} fill={['#FFD84A', '#FF6B57', '#7AB8FF'][i % 3]} opacity={1 - t / 60} />; })}<text y={140} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#FFD84A">TẾT · LUNAR NEW YEAR</text></g>}
        </Layer>
      </CameraRig>
      {n === 4 && <svg style={{ position: 'absolute', left: 60, top: 100 }} width={380} height={500}><g transform="translate(190 240) scale(0.75)"><Calendar x={0} y={0} month="JANUARY" day="30–31" year={1968} color={NORTH} /></g></svg>}
      {n === 7 && <Counter label="ATTACKERS:" value="80,000+" left={60} top={120} k={springPop(f, wordAt(s, '80,000'))} />}
      {n === 10 && <Counter label="PLACES HIT:" value="100+" left={60} top={120} k={springPop(f, wordAt(s, '100'))} />}
      {n === 9 && <Label text="including “secure” areas" x={380} y={300} at={wordAt(s, 'secure.')} size={50} color="#FFD84A" />}
    </>
  );
};
const EmbassyShot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  const breach = n === 12 ? interpolate(f, [wordAt(s, 'breached'), wordAt(s, 'breached') + 10], [0, 1]) : n > 12 ? 1 : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, shakes: n === 12 ? [{ at: wordAt(s, 'breached'), amp: 10, len: 10 }] : [] }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#1C2333" />{[...Array(40)].map((_, i) => <circle key={i} cx={random('es' + i) * 1920} cy={random('et' + i) * 300} r={1.6} fill="#fff" opacity={0.6} />)}</Layer>
        <Layer depth={1}>
          <Embassy x={960} y={840} s={1.0} night breach={breach} />
          <Flag kind="us" x={960} y={140} s={0.55} pole={180} wave={Math.sin(f / 8) * 3} />
          <rect x={-200} y={840} width={2400} height={500} fill="#2A2E3A" />
          {n >= 14 && <g opacity={springPop(f, n === 14 ? wordAt(s, 'not') : -99)}><path d="M720 420 L1200 420 L1200 700 L720 700 Z" fill="none" stroke="#2E8B57" strokeWidth={10} strokeDasharray="20 12" /><text x={960} y={400} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#7AFF9A">MAIN BUILDING HELD</text></g>}
        </Layer>
      </CameraRig>
      {n === 11 && <Label text="US Embassy, Saigon" x={960} y={140} at={wordAt(s, 'embassy')} size={56} color="#F4ECD8" />}
      {n === 13 && <Card at={wordAt(s, 'shocking')} left={960} top={250} text="ONE OF THE MOST SHOCKING IMAGES OF THE WAR" size={40} />}
      {n === 15 && <Stamp at={wordAt(s, 'point.')} left={960} top={250} text="BUT THAT WASN'T THE POINT" size={56} />}
    </>
  );
};
const OnTV: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  const screen = n === 16 ? <g><rect width={300} height={240} fill="#C9D6D0" /><text x={150} y={110} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#1A1410">“ENEMY</text><text x={150} y={150} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#1A1410">NEARLY BEATEN”</text></g>
    : <g><rect width={300} height={240} fill="#2A2E3A" /><g transform="translate(150 230) scale(0.32)"><Embassy x={0} y={0} night breach={1} /></g>{[...Array(4)].map((_, i) => { const fl = Math.max(0, 1 - ((f + i * 9) % 30) / 8); return <circle key={i} cx={60 + i * 60} cy={140} r={14 * fl} fill="#FFD84A" opacity={fl} />; })}<rect x={0} y={200} width={300} height={40} fill="#B3261E" /><text x={150} y={228} textAnchor="middle" fontFamily="TagBold" fontSize={22} fill="#fff">LIVE · SAIGON</text></g>;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}><LivingRoom screen={screen} worried={n >= 17} /></CameraRig>
      {n >= 19 && <Card at={n === 19 ? wordAt(s, 'collapse,') : -99} left={560} top={260} text="“ON THE VERGE OF COLLAPSE”…" size={40} />}
      {n === 20 && <Card at={wordAt(s, 'coordinate')} left={560} top={400} text="…THEN HOW THIS?" color="#B3261E" size={44} />}
    </>
  );
};
const Hue: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = num(s);
  const days = n === 23 ? Math.round(interpolate(f, [wordAt(s, '26') - 20, wordAt(s, '26') + 4], [1, 26])) : 26;
  const smoke = n >= 22 && n <= 27;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.03, zoomTo: 1.0 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={n >= 24 && n <= 27 ? '#8A8A94' : '#B8C8D4'} /></Layer>
        <Layer depth={0.7}><Citadel x={960} y={800} s={1.0} smoke={smoke} /><rect x={-200} y={800} width={2400} height={500} fill="#6A8AA8" /></Layer>
        {n === 28 && <Layer depth={0.9}><Flag kind="svn" x={960} y={180} s={0.7} pole={200} wave={Math.sin(f / 7) * 3} /></Layer>}
      </CameraRig>
      {n === 21 && <Label text="Huế" x={960} y={140} at={wordAt(s, 'Hue.')} size={72} color="#1A1410" />}
      {n === 23 && <Counter label="DAYS:" value={String(days)} left={60} top={120} />}
      {n >= 24 && n <= 27 && <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,20,26,0.35)' }} />}
      {n === 25 && <Note at={4} text="Estimates of civilians killed in Huế run to several thousand." top={120} />}
    </>
  );
};
const MilitaryDefeat: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  const rows = ['HEAVY VC LOSSES', 'NO NATIONWIDE UPRISING', 'THE SOUTH HELD'];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}><InsertBg /></CameraRig>
      <div style={{ position: 'absolute', left: 260, top: 160, fontFamily: 'TagBold', fontSize: 40, color: '#F4ECD8' }}>MILITARY SCORECARD · TẾT</div>
      {rows.map((r, i) => { const k = springPop(f, n === 30 + i ? 4 : n > 30 + i ? -99 : 99999); return k > 0 ? <div key={r} style={{ position: 'absolute', left: 260, top: 250 + i * 110, transform: `scale(${k})`, transformOrigin: 'left center', fontFamily: 'TagBold', fontSize: 52, color: '#fff' }}><span style={{ color: '#7AFF9A' }}>✓</span> {r}</div> : null; })}
      {n === 29 && <Card at={wordAt(s, 'defeat')} left={960} top={330} text="A MILITARY DEFEAT FOR THE VIET CONG" size={48} />}
      {n === 33 && <Stamp at={wordAt(s, 'won')} left={1300} top={640} text="US & SOUTH: WON THE BATTLE" size={50} color="#2E6B4A" />}
    </>
  );
};
const LostTrust: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  const crack = n === 35 ? interpolate(f, [wordAt(s, 'trust.') - 6, wordAt(s, 'trust.') + 10], [0, 1]) : n > 35 ? 1 : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform="translate(960 470)">
            <path d="M0 160 C-260 -20 -180 -220 0 -100 C180 -220 260 -20 0 160 Z" fill={USA} stroke={OL} strokeWidth={8} />
            {crack > 0 && <path d="M0 -100 L-30 -30 L20 20 L-20 80 L0 160" stroke="#F4ECD8" strokeWidth={14} fill="none" strokeDasharray="400" strokeDashoffset={400 * (1 - crack)} />}
            <text y={250} textAnchor="middle" fontFamily="TagBold" fontSize={46} fill="#F4ECD8" opacity={n >= 35 ? 1 : 0}>THE PUBLIC'S TRUST</text>
          </g>
        </Layer>
      </CameraRig>
      {n === 36 && <Card at={wordAt(s, 'promised')} left={960} top={180} text="“THE ENEMY IS WEAKENING”" size={44} />}
    </>
  );
};
const Briefing: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
      <InsertBg />
      <Layer depth={1}>
        <g transform="translate(560 520)"><rect x={-320} y={-250} width={640} height={420} rx={20} fill="#F4F7FA" stroke={OL} strokeWidth={7} /><text y={-180} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill={USA}>OFFICIAL BRIEFING</text><path d="M-260 100 L-120 40 L0 0 L120 -60 L260 -140" stroke={MONEY} strokeWidth={12} fill="none" /><text y={140} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#1A1410">“WINNING”</text></g>
        <TVSet x={1380} y={520} s={0.9}><rect width={300} height={240} fill="#2A2E3A" />{[...Array(5)].map((_, i) => { const fl = Math.max(0, 1 - ((f + i * 7) % 26) / 8); return <circle key={i} cx={40 + i * 55} cy={130 + (i % 2) * 30} r={18 * fl} fill="#FFD84A" opacity={fl} />; })}<text x={150} y={225} textAnchor="middle" fontFamily="TagBold" fontSize={22} fill="#F4ECD8">TẾT, ON TV</text></TVSet>
        {n === 37 || n === 38 ? <text x={960} y={140} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#FFD84A" opacity={springPop(f, 4)}>A MASSIVE, COORDINATED OFFENSIVE</text> : null}
        <text x={960} y={520} textAnchor="middle" fontFamily="TagBold" fontSize={90} fill="#F4ECD8" opacity={n === 39 ? springPop(f, wordAt(s, 'different')) : 0}>≠</text>
      </Layer>
    </CameraRig>
  );
};
const Cronkite: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  const screen = <g><rect width={300} height={240} fill="#C9C9C0" /><rect x={40} y={150} width={220} height={90} fill="#5A3A22" /><g transform="translate(150 170) scale(0.45)"><Chibi x={0} y={0} s={1} {...ANCHOR} pose="present" expr="calm" talking={[[0, 999]]} seed="anchor" /></g><rect x={0} y={0} width={300} height={34} fill="#1A1410" /><text x={150} y={25} textAnchor="middle" fontFamily="TagBold" fontSize={20} fill="#F4ECD8">CBS NEWS · 27 FEB 1968</text></g>;
  if (n >= 42 && n <= 45) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#E8DCC0" /><Flag kind="us" x={240} y={200} s={0.7} pole={500} /></Layer>
        <Layer depth={1}><rect x={-200} y={800} width={2400} height={600} fill="#2E3A6A" /><TVSet x={1360} y={520} s={0.9}>{screen}</TVSet><Chibi x={760} y={900} s={1.5} {...LBJ} legs="sit" pose="chin" expr={n === 42 ? 'shock' : 'sad'} talking={[]} seed="lbjtv" /></Layer>
      </CameraRig>
      {(n === 43 || n === 44) && <Card at={n === 43 ? wordAt(s, 'claims') : -99} left={760} top={250} text="“If I've lost Cronkite, I've lost Middle America.”" size={38} />}
      {n === 45 && <Note at={2} text="Widely repeated; the exact words are disputed and may never have been said." top={120} />}
    </>
  );
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}><LivingRoom screen={screen} worried /></CameraRig>
      {n === 40 && <Label text="Walter Cronkite, CBS" x={560} y={200} at={wordAt(s, 'Cronkite')} size={54} color="#1A1410" />}
      {n === 41 && <><Card at={wordAt(s, 'stalemate')} left={560} top={240} text="“STALEMATE”" size={64} /><Card at={wordAt(s, 'negotiations')} left={560} top={400} text="→ NEGOTIATE" size={44} /></>}
    </>
  );
};
const Fork: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  const C = hostShot(() => [{ at: 0, arm: n === 46 ? 'present' : n === 49 ? 'point' : 'chin', expr: n === 46 ? 'normal' : 'worried' }], {
    props: () => n >= 47 ? <g transform="translate(1060 700) scale(0.8)"><path d="M0 200 V40 M0 40 L-150 -140 M0 40 L150 -140" stroke="#7A4E2B" strokeWidth={22} fill="none" strokeLinecap="round" /><g transform={`translate(-110 -200) scale(${springPop(f, n === 48 ? wordAt(s, 'continue') : n > 48 ? -99 : 99999)})`}><rect x={-120} y={-36} width={240} height={72} rx={10} fill={USA} stroke={OL} strokeWidth={4} /><text y={12} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill="#fff">MORE TROOPS</text></g><g transform={`translate(130 -110) scale(${springPop(f, n === 49 ? wordAt(s, 'way') : 99999)})`}><rect x={-120} y={-36} width={240} height={72} rx={10} fill="#2E6B4A" stroke={OL} strokeWidth={4} /><text y={12} textAnchor="middle" fontFamily="TagBold" fontSize={26} fill="#fff">A WAY OUT</text></g></g> : null,
  });
  return <C s={s} />;
};
const LBJOut: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = num(s);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#E8DCC0" /><path d="M-200 120 Q960 -60 2120 120" fill="none" stroke="#C9B48A" strokeWidth={30} />{[0, 1, 2].map((i) => <rect key={i} x={560 + i * 300} y={160} width={180} height={360} fill="#5A6A8A" stroke={OL} strokeWidth={8} />)}<Flag kind="us" x={360} y={260} s={0.8} pole={500} /></Layer>
        <Layer depth={1}><rect x={-200} y={780} width={2400} height={600} fill="#2E3A6A" /><rect x={760} y={660} width={600} height={130} fill="#7A4E2B" stroke={OL} strokeWidth={6} />{n <= 51 ? <Chibi x={1060} y={690} s={1.4} {...LBJ} pose="present" expr="sad" talking={[[2, 400]]} seed="lbjo" /> : <Chibi x={interpolate(f, [0, d], [1060, 1900])} y={900} s={1.3} {...LBJ} legs="walk" pose="idle" expr="sad" talking={[]} seed="lbjw" />}</Layer>
      </CameraRig>
      {n === 50 && <svg style={{ position: 'absolute', left: 60, top: 100 }} width={380} height={500}><g transform="translate(190 240) scale(0.75)"><Calendar x={0} y={0} month="MARCH" day={31} year={1968} color={USA} /></g></svg>}
      {n === 50 && <Card at={wordAt(s, 'bombing')} left={1300} top={260} text="PARTIAL BOMBING HALT" size={44} />}
      {n === 51 && <Card at={wordAt(s, 'seek,')} left={1300} top={260} text="“I SHALL NOT SEEK… ANOTHER TERM”" size={38} />}
    </>
  );
};
const Gap: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  if (n === 57) return hostShot(() => [{ at: 0, arm: 'finger', expr: 'normal' }])({ s }) as any;
  const w = n === 54 ? interpolate(f, [wordAt(s, 'gap'), wordAt(s, 'gap') + 20], [0, 1]) : n > 54 ? 1 : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform={`translate(${640 - 120 * w} 470)`}><rect x={-260} y={-110} width={520} height={220} rx={18} fill="#F4F7FA" stroke={OL} strokeWidth={7} /><text y={16} textAnchor="middle" fontFamily="TagBold" fontSize={42} fill={USA}>MILITARY CLAIMS</text></g>
          <g transform={`translate(${1280 + 120 * w} 470)`}><rect x={-260} y={-110} width={520} height={220} rx={18} fill="#3A3A48" stroke={OL} strokeWidth={7} /><text y={16} textAnchor="middle" fontFamily="TagBold" fontSize={42} fill="#F4ECD8">POLITICAL REALITY</text></g>
          {w > 0 && <text x={960} y={490} textAnchor="middle" fontFamily="TagBold" fontSize={80} fill="#FFD84A" opacity={w}>↔</text>}
          {n === 56 && <g transform="translate(960 760)"><rect x={-300} y={-24} width={600} height={48} rx={24} fill="#3A3A48" stroke={OL} strokeWidth={4} /><rect x={-300} y={-24} width={600 * interpolate(f, [0, 60], [1, 0.45])} height={48} rx={24} fill={USA} /><text y={-44} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#F4ECD8">COMMITMENT</text></g>}
        </Layer>
      </CameraRig>
      {n === 53 && <Card at={wordAt(s, 'not')} left={960} top={250} text="TẾT DIDN'T BEAT THE US ARMY…" size={46} />}
    </>
  );
};

// ------------------------------------------------------------------ Chapter 7: My Lai (restrained)
const MyLai: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  if (n <= 3) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Village dawn />
        <Layer depth={1.1}>
          {n >= 2 && [0, 1, 2, 3].map((i) => <g key={i} filter="url(#sil)"><Chibi x={1180 + i * 170} y={960} s={0.95} {...GI(i)} pose="hold" expr="normal" talking={[]} seed={'ml' + i} /></g>)}
          {n === 3 && [0, 1, 2, 3, 4].map((i) => <Chibi key={'v' + i} x={240 + i * 160} y={950} s={0.85} {...VILLAGER(['#8A6A4A', '#5A4A3A', '#C9B98A', '#3A3A48', '#7A6A55'][i], i)} pose="idle" expr="shock" talking={[]} seed={'mv' + i} />)}
        </Layer>
      </CameraRig>
      {n === 1 && <Label text="Mỹ Lai · 16 March 1968" x={960} y={140} at={wordAt(s, 'March')} size={56} color="#3A2A1A" />}
      {n === 3 && <Card at={wordAt(s, 'unarmed')} left={560} top={250} text="UNARMED CIVILIANS" size={50} />}
    </>
  );
  if (n <= 9) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}><Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#14161C" /></Layer></CameraRig>
      {n >= 6 && n <= 7 && <div style={{ position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: 'TagBold', fontSize: 120, color: '#E8E2D8', opacity: springPop(f, n === 6 ? wordAt(s, '347') : -99) }}>347 – 504</div>}
      {n >= 6 && n <= 7 && <div style={{ position: 'absolute', left: 0, right: 0, top: 480, textAlign: 'center', fontFamily: 'TagBold', fontSize: 40, color: '#9A9AA4' }}>civilians killed · estimates vary</div>}
      {n === 9 && <div style={{ position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: 'TagBold', fontSize: 64, color: '#E8E2D8', opacity: springPop(f, wordAt(s, 'unarmed')) }}>NO BATTLE · UNARMED CIVILIANS</div>}
    </>
  );
  // Hugh Thompson: the helicopter lands between soldiers and villagers.
  const land = n === 11 ? interpolate(f, [wordAt(s, 'landed') - 10, wordAt(s, 'landed') + 30], [0, 1], Easing.out) : n > 11 ? 1 : 0;
  const hy = n === 10 ? 220 : 220 + 520 * land;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Village dawn />
        <Layer depth={1.1}>
          {n >= 11 && [0, 1, 2].map((i) => <g key={i} filter="url(#sil)"><Chibi x={1420 + i * 160} y={960} s={0.9} {...GI(i)} pose="idle" expr="normal" talking={[]} seed={'ts' + i} /></g>)}
          {n >= 11 && [0, 1, 2, 3].map((i) => <Chibi key={'v' + i} x={180 + i * 150} y={950} s={0.85} {...VILLAGER(['#8A6A4A', '#5A4A3A', '#C9B98A', '#3A3A48'][i], i)} pose="idle" expr={n >= 12 ? 'calm' : 'shock'} talking={[]} seed={'tv' + i} />)}
          <g transform={`translate(${n === 10 ? 1200 + Math.sin(f / 20) * 60 : 960} ${n === 10 ? 400 : hy})`}><Huey x={0} y={0} s={0.85} flip /></g>
          {n >= 12 && <Chibi x={1100} y={950} s={1.0} {...PILOT} pose="raise" expr="determined" talking={[]} seed="thompson" flip />}
        </Layer>
      </CameraRig>
      {n === 10 && <Label text="Hugh Thompson Jr." x={960} y={140} at={wordAt(s, 'Hugh')} size={60} color="#3A2A1A" />}
      {n === 13 && <Card at={wordAt(s, 'reported')} left={960} top={240} text="HE REPORTED IT" size={56} />}
      {n === 12 && <Note at={4} text="Thompson and his crew were awarded the Soldier's Medal in 1998." top={120} />}
    </>
  );
};
const Covered: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg glow={false} />
        <Layer depth={1}>
          {n <= 15 && <g transform="translate(960 470)"><rect x={-280} y={-200} width={560} height={400} fill="#F4F2EC" stroke={OL} strokeWidth={7} /><text y={-130} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#1A1410">REPORT · MARCH 1968</text>{[...Array(6)].map((_, i) => <rect key={i} x={-230} y={-80 + i * 46} width={460} height={26} fill="#1A1410" opacity={springPop(f, n === 15 ? 4 + i * 4 : n > 15 ? -99 : 99999)} />)}</g>}
          {n >= 16 && n <= 17 && <g transform={`translate(960 470) rotate(-2) scale(${springPop(f, n === 16 ? wordAt(s, 'investigations') : -99)})`}><rect x={-340} y={-230} width={680} height={460} fill="#F4F2EC" stroke={OL} strokeWidth={7} /><text y={-160} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#1A1410">THE NEWS · NOV 1969</text><rect x={-300} y={-120} width={600} height={60} fill="#1A1410" /><text y={-78} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#F4F2EC">MASSACRE REVEALED</text>{[...Array(5)].map((_, i) => <path key={i} d={`M-300 ${-10 + i * 40} H${280 - (i % 2) * 100}`} stroke="#C9C4B8" strokeWidth={8} />)}<text y={200} textAnchor="middle" fontFamily="Hand" fontSize={34} fill="#5A3A22">by Seymour Hersh</text></g>}
          {(n === 18 || n === 19) && <g><rect x={560} y={260} width={360} height={260} fill="#2A2A2E" stroke="#F4F2EC" strokeWidth={14} /><rect x={1000} y={260} width={360} height={260} fill="#2A2A2E" stroke="#F4F2EC" strokeWidth={14} /><text x={960} y={640} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#9A9AA4">{n === 18 ? 'the photographs' : 'the accounts'}</text></g>}
        </Layer>
      </CameraRig>
      {n === 14 && <Stamp at={wordAt(s, 'not')} left={960} top={240} text="NOT MADE PUBLIC" size={60} />}
      {n === 15 && <Stamp at={wordAt(s, 'concealed')} left={960} top={240} text="CONCEALED" size={70} />}
    </>
  );
};
const Calley: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg glow={false} />
        <Layer depth={1}>
          <g transform="translate(960 300)"><path d="M0 -60 V240 M-300 0 H300" stroke="#C9A66B" strokeWidth={12} /><path d="M-300 0 L-370 140 H-230 Z M300 0 L230 140 H370 Z" fill="#C9A66B" stroke={OL} strokeWidth={4} opacity={0.8} /></g>
        </Layer>
      </CameraRig>
      {n === 20 && <Card at={wordAt(s, 'convicted')} left={960} top={640} text="ONE SOLDIER CONVICTED: LT. WILLIAM CALLEY" size={44} />}
      {n === 21 && <><Card at={wordAt(s, 'life')} left={600} top={640} text="LIFE SENTENCE" size={48} /><Card at={wordAt(s, 'reduced,')} left={1320} top={640} text="REDUCED" size={48} color="#B3261E" /></>}
      {n === 22 && <Card at={wordAt(s, 'three')} left={960} top={640} text="~3½ YEARS · HOUSE ARREST" size={56} />}
    </>
  );
};
const Symbol: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg glow={false} />
        <Layer depth={1}><g transform="translate(960 480)"><Flag kind="us" x={-150} y={-260} s={1.4} pole={0} wave={0} />{n === 24 && <rect x={-150} y={-260} width={294} height={196} fill="#1A1410" opacity={0.5 * springPop(f, wordAt(s, 'slaughter'))} />}</g></Layer>
      </CameraRig>
      {n === 24 && <Card at={wordAt(s, 'freedom')} left={960} top={780} text="“DEFENDING FREEDOM”?" size={52} />}
      {n >= 26 && <Card at={n === 26 ? wordAt(s, 'misleading') : -99} left={960} top={760} text={n === 27 ? 'WHAT ELSE WERE THEY HIDING?' : 'MISLEADING ON PROGRESS…'} size={50} color={n === 27 ? '#B3261E' : '#1A1410'} />}
    </>
  );
};
const NixonIn: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#A8C6E0" /><Cloud x={300} y={140} /></Layer>
        <Layer depth={0.6}><WhiteHouse x={960} y={760} s={1.1} /></Layer>
        <Layer depth={1}><rect x={-200} y={760} width={2400} height={600} fill="#7A9A5A" /><Chibi x={960} y={960} s={1.5} {...NIXON} pose={n === 29 ? 'bothUp' : n === 30 ? 'shrug' : 'wave'} expr={n === 30 ? 'worried' : 'happy'} talking={[]} seed="nixon" /></Layer>
      </CameraRig>
      {n === 28 && <Label text="President Richard Nixon · 1969" x={960} y={140} at={wordAt(s, 'new')} size={54} color="#1A1410" />}
      {n === 29 && <Card at={wordAt(s, 'end')} left={500} top={300} text="“END THE WAR”" size={56} />}
    </>
  );
};

// ------------------------------------------------------------------ Chapter 8: Nixon's secret war
const Vietnamization: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = num(s);
  const k = interpolate(f, [0, d], [0, 1]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Paddy />
        <Layer depth={1}>
          {[0, 1, 2, 3].map((i) => <Chibi key={i} x={(n >= 2 ? 300 - k * 600 : 300) + i * 160} y={930} s={0.95} {...GI(i)} legs={n >= 2 ? 'walk' : 'stand'} pose="hold" expr="calm" talking={[]} seed={'vz' + i} flip delay={i * 2} />)}
          {[0, 1, 2, 3].map((i) => <Chibi key={'s' + i} x={1100 + i * 170} y={940} s={0.95} {...SVN} pose="hold" expr="determined" talking={[]} seed={'vs' + i} />)}
          {n >= 4 && <g transform="translate(960 300)"><rect x={-200} y={-50} width={400} height={100} rx={14} fill="#F4F7FA" stroke={OL} strokeWidth={5} /><text y={14} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill={USA}>ON PAPER ✓</text></g>}
        </Layer>
      </CameraRig>
      {n === 1 && <Label text="“Vietnamization”" x={960} y={140} at={wordAt(s, 'Vietnamization.')} size={64} color="#1A1410" />}
    </>
  );
};
const Contradiction = hostShot((s) => [{ at: 0, arm: num(s) === 6 ? 'finger' : 'present', expr: num(s) === 9 ? 'worried' : 'normal' }], {
  props: (s) => {
    const f = useCurrentFrame();
    const n = num(s);
    if (n === 6) return null;
    return <g>
      <PopProp at={n === 7 ? wordAt(s, 'reduce') : -99} x={960} y={500}><g><rect x={-120} y={-60} width={240} height={120} rx={14} fill="#2E6B4A" stroke={OL} strokeWidth={5} /><text y={-8} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#fff">LESS</text><text y={30} textAnchor="middle" fontFamily="TagBold" fontSize={24} fill="#fff">INVOLVEMENT</text></g></PopProp>
      {n >= 8 && <PopProp at={n === 8 ? wordAt(s, 'increase') : -99} x={960} y={700}><g><rect x={-120} y={-60} width={240} height={120} rx={14} fill="#B3261E" stroke={OL} strokeWidth={5} /><text y={-8} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#fff">MORE</text><text y={30} textAnchor="middle" fontFamily="TagBold" fontSize={24} fill="#fff">PRESSURE</text></g></PopProp>}
    </g>;
  },
});
const Menu: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = num(s);
  const [px, py] = mapP('Phnom Penh');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.08, focus: [1000, 640] }}>
        <InsertBg />
        <Layer depth={1}>
          <IndochinaMap x={M.x} y={M.y} s={M.s} labels split parallel={1} fills={{ north: '#D9584A', south: '#E8C65A', camb: n >= 15 ? '#C8B898' : '#D8CCB0' }} pins={[{ city: 'Phnom Penh', at: 4, color: '#5A5A64' }]} />
          {[...Array(10)].map((_, i) => { const [x, y] = ll(105.6 + random('mx' + i) * 1.5, 11.6 + random('my' + i) * 2.2); const fl = Math.max(0, 1 - ((f + i * 9) % 40) / 10); return <circle key={i} cx={x} cy={y} r={20 * fl} fill="#FFD84A" opacity={fl} />; })}
          {n === 13 && <g transform="translate(400 520)"><rect x={-200} y={-150} width={400} height={300} fill="#F4F2EC" stroke={OL} strokeWidth={6} /><text y={-90} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#1A1410">CONGRESS · BRIEFING</text>{[...Array(4)].map((_, i) => <rect key={i} x={-160} y={-40 + i * 46} width={320} height={26} fill="#1A1410" opacity={springPop(f, wordAt(s, 'hidden') + i * 4)} />)}</g>}
          {n === 14 && <g transform="translate(400 520)"><rect x={-200} y={-150} width={400} height={300} fill="#F4F2EC" stroke={OL} strokeWidth={6} /><text y={-90} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#1A1410">TARGET LOG</text><text y={-10} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#5A5A64">S. VIETNAM</text><text y={60} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#B3261E">(really: Cambodia)</text></g>}
        </Layer>
      </CameraRig>
      {n === 10 && <Label text="secret bombing of Cambodia · March 1969" x={500} y={200} at={wordAt(s, 'secret')} size={44} color="#FFD84A" />}
      {n === 11 && <Label text="Operation Menu" x={420} y={300} at={wordAt(s, 'Menu,')} size={60} color="#FFD84A" />}
      {n === 15 && <Stamp at={wordAt(s, 'neutral,')} left={420} top={420} text="OFFICIALLY NEUTRAL" size={50} color="#5A5A64" />}
      {n === 18 && <Note at={wordAt(s, 'Khmer')} text="Cambodia's slide into the Khmer Rouge era had many causes; the bombing was one factor historians cite." top={120} />}
    </>
  );
};
const Incursion: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = num(s);
  if (n >= 22) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#B8D4E0" /><Cloud x={300} y={140} /></Layer>
        <Layer depth={0.6}><Capitol x={960} y={760} s={1.0} /></Layer>
        <Layer depth={1}><rect x={-200} y={760} width={2400} height={600} fill="#7A9A5A" />{[...Array(9)].map((_, i) => <Chibi key={i} x={interpolate(f, [0, d], [100, 300]) + i * 200} y={950} s={0.95} {...PROTESTER(['#C0392B', '#E8C23A', '#3A5A8A', '#2E6B4A', '#8A3A8A'][i % 5], i, i % 3 === 0 ? 'PEACE NOW' : i % 3 === 1 ? 'BRING THEM HOME' : '')} legs="walk" pose={i % 2 ? 'raise' : 'fist'} expr="angry" talking={[]} seed={'pt' + i} delay={i * 3} />)}</Layer>
      </CameraRig>
      {n === 22 && <Label text="antiwar protests" x={960} y={140} at={wordAt(s, 'antiwar')} size={56} color="#1A1410" />}
      {n === 23 && <Card at={wordAt(s, 'ending.')} left={960} top={250} text="THE WAR WASN'T ENDING…" size={50} />}
      {n === 24 && <Card at={wordAt(s, 'spreading.') - 4} left={960} top={250} text="…IT WAS SPREADING" size={60} color="#B3261E" />}
    </>
  );
  const k = interpolate(f, [0, d], n === 19 ? [0, 0.5] : n === 20 ? [0.5, 1] : [1, 1]);
  const [sx, sy] = ll(106.4, 11.3), [tx, ty] = ll(105.5, 12.0);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.08, focus: [1000, 640] }}>
        <InsertBg />
        <Layer depth={1}>
          <IndochinaMap x={M.x} y={M.y} s={M.s} labels split parallel={1} fills={{ north: '#D9584A', south: '#E8C65A' }} />
          {[0, 1, 2].map((i) => { const x0 = sx + i * 20, y0 = sy - i * 50; return <g key={i}><path d={`M${x0} ${y0} L${x0 + (tx - x0) * k} ${y0 + (ty - y0) * k}`} stroke={USA} strokeWidth={12} strokeLinecap="round" /><path d="M0 -14 L22 0 L0 14 Z" transform={`translate(${x0 + (tx - x0) * k} ${y0 + (ty - y0) * k}) rotate(${(Math.atan2(ty - y0, tx - x0) * 180) / Math.PI})`} fill={USA} stroke={OL} strokeWidth={3} /></g>; })}
          {n === 21 && <g transform="translate(360 920)"><Chibi x={0} y={0} s={1.3} {...NIXON} pose="point" expr="determined" talking={[[2, 300]]} seed="nxc" /></g>}
        </Layer>
      </CameraRig>
      {n === 19 && <Label text="Cambodian incursion · 1970" x={420} y={200} at={wordAt(s, '1970,')} size={50} color="#FFD84A" />}
    </>
  );
};
const PentagonPapers: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = num(s);
  const pile = (cnt: number) => <g>{[...Array(cnt)].map((_, i) => <rect key={i} x={-180 + (i % 2) * 6} y={-i * 22} width={360} height={20} fill={i % 2 ? '#E8E4D8' : '#F4F2EC'} stroke={OL} strokeWidth={3} />)}</g>;
  if (n <= 28) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#3A3A48" /><rect x={300} y={140} width={1320} height={560} fill="#2E2E3A" stroke={OL} strokeWidth={6} /></Layer>
        <Layer depth={1}>
          <rect x={-200} y={780} width={2400} height={600} fill="#4A3A2A" />
          <rect x={560} y={600} width={800} height={50} fill="#7A4E2B" stroke={OL} strokeWidth={5} />
          <g transform="translate(760 590)">{pile(14)}</g>
          {n >= 27 && <Chibi x={1160} y={640} s={1.1} {...SUIT('#4A4A54', '#5A5A5A', { glasses: true })} item="notebook" pose="hold" expr="determined" talking={[]} seed="ellsberg" />}
          {n >= 27 && <g transform={`translate(${1280 + Math.min(1, (f - wordAt(s, 'leaked')) / 20) * 500 * (f > wordAt(s, 'leaked') ? 1 : 0)} 480) rotate(8)`}><rect x={-60} y={-40} width={120} height={80} fill="#F4F2EC" stroke={OL} strokeWidth={4} /></g>}
        </Layer>
      </CameraRig>
      {n === 27 && <Label text="Daniel Ellsberg" x={1160} y={260} at={wordAt(s, 'Ellsberg')} size={56} color="#F4ECD8" />}
      {n === 28 && <Card at={wordAt(s, 'Pentagon')} left={960} top={200} text="THE PENTAGON PAPERS" size={70} />}
      {n === 25 && <Label text="1971" x={960} y={200} at={wordAt(s, '1971,')} size={70} color="#FFD84A" />}
    </>
  );
  if (n <= 35) {
    const pres = ['TRUMAN', 'EISENHOWER', 'KENNEDY', 'JOHNSON'];
    return (
      <>
        <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
          <InsertBg />
          <Layer depth={1}>
            {n <= 30 && pres.map((p, i) => { const k = springPop(f, n === 30 ? wordAt(s, ['Truman', 'Eisenhower', 'Kennedy', 'Johnson.'][i]) : n === 29 ? wordAt(s, 'several') + i * 5 : -99); return k > 0 ? <g key={p} transform={`translate(${360 + i * 400} 470) scale(${k})`}><rect x={-150} y={-120} width={300} height={240} rx={14} fill="#F4F2EC" stroke={OL} strokeWidth={6} /><text y={10} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill={USA}>{p}</text></g> : null; })}
            {n >= 31 && <><g transform="translate(560 470)"><rect x={-300} y={-220} width={600} height={440} rx={20} fill="#3A3A48" stroke={OL} strokeWidth={8} /><text y={-150} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#F4ECD8">PRIVATELY</text><text y={10} textAnchor="middle" fontFamily="TagBold" fontSize={48} fill="#FF6B57">SERIOUS PROBLEMS</text></g><g transform="translate(1360 470)" opacity={n >= 32 ? 1 : 0.3}><rect x={-300} y={-220} width={600} height={440} rx={20} fill="#A8C6E0" stroke={OL} strokeWidth={8} /><text y={-150} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#1A1410">PUBLICLY</text><text y={10} textAnchor="middle" fontFamily="TagBold" fontSize={48} fill={USA}>REASSURANCE</text></g></>}
            {n === 33 && <text x={960} y={820} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#F4ECD8" opacity={springPop(f, wordAt(s, 'not'))}>not every statement was a deliberate lie…</text>}
            {n >= 34 && <text x={960} y={490} textAnchor="middle" fontFamily="TagBold" fontSize={90} fill="#FFD84A" opacity={springPop(f, n === 34 ? wordAt(s, 'pattern') : -99)}>≠</text>}
          </Layer>
        </CameraRig>
      </>
    );
  }
  if (n <= 38) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          {n <= 37 ? <g transform={`translate(960 470) rotate(-2) scale(${springPop(f, 4)})`}><rect x={-360} y={-260} width={720} height={520} fill="#F4F2EC" stroke={OL} strokeWidth={7} /><text y={-180} textAnchor="middle" fontFamily="Hand" fontSize={56} fill="#1A1410">The New York Times</text><path d="M-320 -150 H320" stroke={OL} strokeWidth={4} /><text y={-90} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#1A1410">VIETNAM ARCHIVE: PENTAGON STUDY</text>{[...Array(6)].map((_, i) => <path key={i} d={`M-320 ${-30 + i * 44} H${300 - (i % 2) * 90}`} stroke="#C9C4B8" strokeWidth={8} />)}<text y={240} textAnchor="middle" fontFamily="TagBold" fontSize={28} fill="#5A5A64">13 JUNE 1971</text></g>
            : <g transform="translate(960 560)"><rect x={-420} y={-60} width={840} height={260} fill="#F4F2EC" stroke={OL} strokeWidth={6} />{[...Array(8)].map((_, i) => <rect key={i} x={-380 + i * 110} y={-60} width={40} height={260} fill="#E0DCD0" stroke={OL} strokeWidth={3} />)}<path d="M-460 -60 L0 -240 L460 -60 Z" fill="#F4F2EC" stroke={OL} strokeWidth={6} /><text y={-110} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#1A1410">SUPREME COURT</text></g>}
        </Layer>
      </CameraRig>
      {n === 37 && <Card at={wordAt(s, 'legal')} left={960} top={860 - 60} text="PRESS FREEDOM vs SECRECY" size={44} />}
      {n === 38 && <Stamp at={wordAt(s, 'against')} left={960} top={220} text="6–3 · PUBLICATION ALLOWED" size={56} color="#2E6B4A" />}
    </>
  );
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}><InsertBg /></CameraRig>
      {['troop', 'Tet.', 'Lai.'].map((w, i) => <Card key={w} at={n === 40 + i ? wordAt(s, w) - 4 : n > 40 + i ? -99 : 99999} left={460 + i * 500} top={300} text={['TROOPS UP', 'TẾT ON TV', 'MỸ LAI'][i]} size={44} />)}
      {n >= 43 && <Card at={n === 43 ? wordAt(s, 'documentary') : -99} left={960} top={500} text="+ DOCUMENTS: DOUBTS FOR YEARS" size={46} color="#B3261E" />}
      {n === 39 && <Stamp at={wordAt(s, 'distrust.') - 4} left={960} top={400} text="PUBLIC DISTRUST ↑" size={64} />}
      {n === 45 && <Card at={wordAt(s, 'honest')} left={960} top={700} text="WAS THE GOVERNMENT EVER HONEST?" size={44} />}
    </>
  );
};
const Drawdown: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = num(s);
  if (n >= 50) {
    const [hx, hy] = mapP('Hanoi');
    return (
      <>
        <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
          <InsertBg />
          <Layer depth={1}>
            <IndochinaMap x={M.x} y={M.y} s={M.s} labels split parallel={1} fills={{ north: '#D9584A', south: '#E8C65A' }} />
            {n === 50 && [0, 1, 2].map((i) => { const k = interpolate(f, [wordAt(s, 'offensive.') - 20 + i * 4, wordAt(s, 'offensive.') + 20 + i * 4], [0, 1], Easing.out); const x0 = ll(106.3 + i * 0.4, 17.5)[0], y0 = ll(0, 17.5)[1]; return <path key={i} d={`M${x0} ${y0} L${x0 - 20 + i * 10} ${y0 + 200 * k}`} stroke={NORTH} strokeWidth={14} strokeLinecap="round" />; })}
            {(n === 51 || n === 52) && [...Array(8)].map((_, i) => { const [x, y] = ll(105.8 + random('lb' + i) * 0.9, 20.3 + random('lc' + i) * 1.1); const fl = Math.max(0, 1 - ((f + i * 9) % 36) / 10); return <circle key={i} cx={x} cy={y} r={22 * fl} fill="#FFD84A" opacity={fl} />; })}
            {(n === 51 || n === 52) && <g transform={`translate(${hx - 300 + (f * 6) % 600} ${hy - 60}) scale(0.3)`}><B52 x={0} y={0} /></g>}
            {n >= 53 && <g transform="translate(360 520)"><rect x={-220} y={-60} width={440} height={120} rx={14} fill="#F4F7FA" stroke={OL} strokeWidth={6} /><text y={16} textAnchor="middle" fontFamily="TagBold" fontSize={38} fill="#1A1410">TALKS · PARIS</text></g>}
            {n === 54 && <text x={360} y={640} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill="#F4ECD8">US: pressure to leave</text>}
            {n >= 55 && <text x={360} y={690} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill="#FF8A7A">Hanoi: US out, troops stay</text>}
          </Layer>
        </CameraRig>
        {n === 50 && <Label text="the Easter Offensive · 1972" x={420} y={200} at={wordAt(s, '1972,')} size={48} color="#FFD84A" />}
        {n === 58 && <Card at={wordAt(s, 'lasting')} left={960} top={330} text="PEACE AGREEMENT ≠ LASTING PEACE" size={52} />}
      </>
    );
  }
  const yrs = [1969, 1970, 1971, 1972];
  const vals = [475, 335, 157, 24];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
        <InsertBg />
        <Layer depth={1}>
          <Bars x={420} y={760} max={560} h={500} w={220} gap={130} bars={yrs.map((y, i) => ({ label: `END ${y}`, v: vals[i], c: USA, at: n >= 47 ? 4 + i * 6 : 99999, text: `${vals[i]}k` }))} />
          {n === 49 && [...Array(5)].map((_, i) => { const fl = Math.max(0, 1 - ((f + i * 11) % 40) / 10); return <circle key={i} cx={460 + i * 260} cy={200} r={30 * fl} fill="#FFD84A" opacity={fl} />; })}
        </Layer>
      </CameraRig>
      {n === 46 && <Label text="public support falling" x={960} y={180} at={wordAt(s, 'declined,')} size={56} color="#FFD84A" />}
      {n === 48 && <Label text="US troops in Vietnam" x={960} y={180} at={2} size={52} color="#F4ECD8" />}
      {n === 49 && <Card at={wordAt(s, 'continued.')} left={1300} top={300} text="BUT THE BOMBING CONTINUED" size={50} color="#B3261E" />}
    </>
  );
};

export const SHOTS_04: ShotMap = {
  progress: Progress, tet_map: TetMap, embassy: EmbassyShot, on_tv: OnTV, hue: Hue, military_defeat: MilitaryDefeat, lost_trust: LostTrust,
  briefing: Briefing, cronkite: Cronkite, fork: Fork, lbj_out: LBJOut, gap: Gap,
  my_lai: MyLai, covered: Covered, calley: Calley, symbol: Symbol, nixon_in: NixonIn,
  vietnamization: Vietnamization, contradiction: Contradiction, menu: Menu, incursion: Incursion, pentagon: PentagonPapers, drawdown: Drawdown,
};
