/** Chapter 4 — "The Attack That Changed Everything" and Chapter 5 — "More Bombs. More Troops. No Victory." */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, spring, springPop, gravityDrop, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { InsertBg, Jungle } from '@engine/scenes/Backgrounds';
import { OL, Cloud, Tree } from '@engine/scenes/Parts';
import { IndochinaMap, VCITIES, vnXY, Huey, Jet, B52, Destroyer, TorpedoBoat, Sea, Tunnels, Flag, WhiteHouse, Capitol, Paddy, Valley } from '@engine/scenes/Vietnam';
import { hostShot, wordAt, PopProp, DropHtml, type ShotMap, type SP } from '@engine/kit';
import { USA, NORTH, SOUTH, MONEY, GOLD, NVA, VC, GI, SVN, LBJ, OFFICIAL_US, PILOT, Stamp, Card, Note, Counter, Calendar, Bars } from './Cast';

const M = { x: 700, y: 40, s: 0.98 };
const mapP = (c: string) => { const [x, y] = VCITIES[c]; return [M.x + M.s * x, M.y + M.s * y]; };
const ll = (lon: number, lat: number) => { const [x, y] = vnXY(lon, lat); return [M.x + M.s * x, M.y + M.s * y]; };
const Sailor = (i = 0) => ({ outfit: { top: '#F4F7FA', bottom: '#2E3A6A' }, hat: 'cap', hatColor: '#F4F7FA', skin: i % 3 === 2 ? '#8D5524' : '#F3D2B0' });

/** Radar scope: a sweeping arm, with blips that may or may not be real. */
const Radar: React.FC<{ x: number; y: number; s?: number; blips?: number; ghost?: boolean }> = ({ x, y, s = 1, blips = 0, ghost }) => {
  const f = useCurrentFrame();
  const a = (f * 6) % 360;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={230} fill="#0E2A1A" stroke={OL} strokeWidth={10} />
      {[60, 120, 180].map((r) => <circle key={r} r={r} fill="none" stroke="#2E7A4A" strokeWidth={3} />)}
      <path d="M-230 0 H230 M0 -230 V230" stroke="#2E7A4A" strokeWidth={2} />
      <path d={`M0 0 L${Math.cos((a * Math.PI) / 180) * 230} ${Math.sin((a * Math.PI) / 180) * 230}`} stroke="#7AFF9A" strokeWidth={6} />
      {[...Array(blips)].map((_, i) => { const bx = (random('rb' + i) - 0.5) * 300, by = (random('rc' + i) - 0.5) * 300; const on = ghost ? Math.sin(f / 4 + i * 2) > 0.2 : true; return on ? <circle key={i} cx={bx + (ghost ? Math.sin(f / 7 + i) * 20 : 0)} cy={by} r={9} fill="#7AFF9A" opacity={ghost ? 0.5 + 0.5 * Math.sin(f / 3 + i) : 1} /> : null; })}
    </g>
  );
};

// ------------------------------------------------------------------ Chapter 4
const Maddox: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = parseInt(s.id.slice(4), 10);
  const fire = n === 5 ? Math.max(0, 1 - ((f % 20) / 6)) : 0;
  const boatX = n <= 3 ? interpolate(f, [0, d], [1900, 1400]) : 1400;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03, shakes: n === 3 ? [{ at: wordAt(s, 'attacked'), amp: 8, len: 8 }] : [] }}>
        <Sea />
        <Layer depth={0.8}>
          <Destroyer x={560} y={600 + Math.sin(f / 10) * 4} s={0.95} name="USS MADDOX" flash={fire} />
          {n >= 3 && [0, 1, 2].map((i) => <TorpedoBoat key={i} x={boatX + i * 120} y={600 + i * 50 + Math.sin(f / 6 + i) * 5} s={0.9} flip />)}
          {n === 5 && [0, 1, 2].map((i) => { const t = (f + i * 10) % 30; return <path key={i} d={`M${740 + t * 20} ${540 - t * 2} l40 -2`} stroke="#FFD84A" strokeWidth={5} />; })}
          {n === 5 && <g transform={`translate(${interpolate(f, [wordAt(s, 'aircraft'), d], [-200, 2100])} 200) scale(0.6)`}><Jet x={0} y={0} /></g>}
        </Layer>
      </CameraRig>
      {n === 2 && <Label text="2 August 1964 · Gulf of Tonkin" x={960} y={140} at={4} size={54} color="#1A1410" />}
      {n === 4 && <Card at={wordAt(s, 'real.')} left={960} top={250} text="ATTACK #1: REAL" color="#2E6B4A" size={64} />}
      {n === 6 && <><Counter label="US FATALITIES:" value="0" left={60} top={120} k={springPop(f, wordAt(s, 'fatalities,'))} /><Counter label="DAMAGE:" value="minor" left={60} top={210} k={springPop(f, wordAt(s, 'minor'))} /></>}
    </>
  );
};
const NightReports: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  const radar = n === 14 || n === 9 || n === 10;
  const rough = n >= 13 ? 1 : 0.3;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03, shakes: n === 13 ? [{ at: 4, amp: 6, len: 40 }] : [] }}>
        <Sea night rough={rough} />
        <Layer depth={0.8}>
          <Destroyer x={520} y={620 + Math.sin(f / 5) * (6 + rough * 14)} s={0.85} dark name="MADDOX" />
          {n >= 9 && <Destroyer x={1420} y={660 + Math.sin(f / 5 + 1) * (6 + rough * 14)} s={0.7} dark name="TURNER JOY" />}
          {n >= 15 && [0, 1, 2].map((i) => <Chibi key={i} x={340 + i * 150} y={590} s={0.6} {...Sailor(i)} pose={i === 1 ? 'shrug' : 'chin'} expr="shock" talking={[]} seed={'sl' + i} />)}
        </Layer>
        {(n === 12 || n === 16) && <Layer depth={1.2}><rect x={-200} y={-200} width={2400} height={1500} fill="#000" opacity={0.45} /></Layer>}
      </CameraRig>
      {radar && <svg style={{ position: 'absolute', right: 80, top: 80 }} width={500} height={500}><g transform="translate(250 250) scale(0.95)"><Radar x={0} y={0} blips={n === 14 ? 7 : 4} ghost={n === 14} /></g></svg>}
      {n === 7 && <Card at={wordAt(s, 'another')} left={960} top={250} text="ATTACK #2?" color={NORTH} size={70} />}
      {n === 8 && <Label text="…or so it seemed" x={960} y={180} at={wordAt(s, 'believed.')} size={60} color="#F4ECD8" />}
      {n === 9 && <Label text="4 August 1964" x={700} y={160} at={wordAt(s, 'August')} size={56} color="#F4ECD8" />}
      {n === 15 && [0, 1, 2].map((i) => <Card key={i} at={wordAt(s, 'struggled') + i * 6} left={600 + i * 300} top={260 + (i % 2) * 40} text="?" size={80} />)}
      {n === 16 && <Stamp at={wordAt(s, 'doubts')} left={960} top={300} text="DID IT HAPPEN?" size={70} color="#E8A94A" />}
    </>
  );
};
const LBJOffice: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  if (n <= 19) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#E8DCC0" /><path d="M-200 120 Q960 -60 2120 120" fill="none" stroke="#C9B48A" strokeWidth={30} />{[0, 1, 2].map((i) => <rect key={i} x={560 + i * 300} y={160} width={180} height={360} fill="#A8C6E0" stroke={OL} strokeWidth={8} />)}<Flag kind="us" x={360} y={260} s={0.8} pole={500} /></Layer>
        <Layer depth={1}><rect x={-200} y={780} width={2400} height={600} fill="#2E3A6A" /><rect x={760} y={660} width={600} height={130} fill="#7A4E2B" stroke={OL} strokeWidth={6} /><Chibi x={1060} y={690} s={1.4} {...LBJ} pose={n === 19 ? 'fist' : 'cross'} expr="determined" talking={[]} seed="lbj" /></Layer>
      </CameraRig>
      {n === 17 && <Stamp at={wordAt(s, 'stop')} left={960} top={230} text="DOUBTS IGNORED" size={60} />}
      {n === 18 && <Label text="President Lyndon B. Johnson" x={960} y={120} at={4} size={52} color="#1A1410" />}
    </>
  );
  const k = interpolate(f, [4, 40], [0, 1], Easing.inOut);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <InsertBg />
      <Layer depth={1}>
        <WhiteHouse x={460} y={700} s={0.6} /><Capitol x={1480} y={760} s={0.6} />
        <g transform={`translate(${520 + (1440 - 520) * k} ${520 - Math.sin(k * Math.PI) * 180}) rotate(${k * 20})`}><rect x={-80} y={-100} width={160} height={200} fill="#F4F2EC" stroke={OL} strokeWidth={5} /><text y={-40} textAnchor="middle" fontFamily="TagBold" fontSize={22} fill="#1A1410">RESOLUTION</text>{[...Array(4)].map((_, i) => <path key={i} d={`M-56 ${-10 + i * 26} H56`} stroke="#C9C4B8" strokeWidth={5} />)}</g>
        {n === 21 && <text x={960} y={200} textAnchor="middle" fontFamily="TagBold" fontSize={48} fill="#FFD84A" opacity={springPop(f, wordAt(s, 'broad'))}>BROAD WAR POWERS</text>}
      </Layer>
    </CameraRig>
  );
};
const Votes: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  const yes1 = n === 23 ? Math.round(interpolate(f, [wordAt(s, '416–0.') - 20, wordAt(s, '416–0.') + 4], [0, 416], Easing.out)) : n > 23 ? 416 : 0;
  const yes2 = n === 24 ? Math.round(interpolate(f, [wordAt(s, '88–2.') - 16, wordAt(s, '88–2.') + 4], [0, 88], Easing.out)) : n > 24 ? 88 : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          <Capitol x={960} y={820} s={0.7} />
          {n >= 23 && <g transform="translate(520 300)"><rect x={-230} y={-90} width={460} height={180} rx={14} fill="#1A1410" stroke={OL} strokeWidth={6} /><text y={-40} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#F4ECD8">HOUSE</text><text y={50} textAnchor="middle" fontFamily="TagBold" fontSize={76} fill="#7AFF9A">{yes1} – 0</text></g>}
          {n >= 24 && <g transform="translate(1400 300)"><rect x={-230} y={-90} width={460} height={180} rx={14} fill="#1A1410" stroke={OL} strokeWidth={6} /><text y={-40} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#F4ECD8">SENATE</text><text y={50} textAnchor="middle" fontFamily="TagBold" fontSize={76} fill="#7AFF9A">{yes2} – 2</text></g>}
        </Layer>
      </CameraRig>
      {n === 22 && <Card at={wordAt(s, 'approved')} left={960} top={260} text="APPROVED" color="#2E6B4A" size={80} />}
      {n === 25 && <Stamp at={wordAt(s, 'law.') - 6} left={960} top={540} text="GULF OF TONKIN RESOLUTION · LAW" size={52} color={USA} />}
      {n === 26 && <Card at={wordAt(s, 'without')} left={960} top={540} text="NO DECLARATION OF WAR" color="#B3261E" size={60} />}
    </>
  );
};
const Never: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  if (n === 27) return hostShot(() => [{ at: 0, arm: 'finger', expr: 'grin' }])({ s }) as any;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          {n === 28 && <Radar x={960} y={470} blips={0} />}
          {(n >= 29 && n <= 32) && <g transform={`translate(960 470) rotate(-2) scale(${springPop(f, n === 29 ? wordAt(s, 'National') : -99)})`}><rect x={-300} y={-260} width={600} height={520} fill="#E8DCB8" stroke={OL} strokeWidth={8} /><rect x={-300} y={-260} width={600} height={70} fill="#5A5A64" /><text y={-212} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#F4ECD8">NSA · HISTORICAL STUDY</text>{[...Array(7)].map((_, i) => <rect key={i} x={-250} y={-150 + i * 50} width={i % 3 === 1 ? 280 : 480} height={22} fill={i % 2 ? '#1A1410' : '#C9C4B8'} />)}<g transform="rotate(-12) translate(0 180)"><rect x={-180} y={-40} width={360} height={80} fill="none" stroke="#2E6B4A" strokeWidth={8} /><text y={16} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#2E6B4A">DECLASSIFIED</text></g></g>}
          {n >= 33 && <><g transform="translate(560 470)"><rect x={-300} y={-160} width={600} height={320} rx={20} fill="#2E6B4A" stroke={OL} strokeWidth={8} /><text y={-50} textAnchor="middle" fontFamily="TagBold" fontSize={54} fill="#fff">2 AUGUST</text><text y={60} textAnchor="middle" fontFamily="TagBold" fontSize={80} fill="#fff">REAL ✓</text></g>
            {n >= 34 && <g transform={`translate(1360 470) scale(${springPop(f, n === 34 ? wordAt(s, 'not.') - 6 : -99)})`}><rect x={-300} y={-160} width={600} height={320} rx={20} fill="#B3261E" stroke={OL} strokeWidth={8} /><text y={-50} textAnchor="middle" fontFamily="TagBold" fontSize={54} fill="#fff">4 AUGUST</text><text y={60} textAnchor="middle" fontFamily="TagBold" fontSize={80} fill="#fff">NOT ✗</text></g>}</>}
        </Layer>
      </CameraRig>
      {n === 28 && <Stamp at={wordAt(s, 'never')} left={960} top={760} text="ALMOST CERTAINLY NEVER HAPPENED" size={48} />}
      {n === 30 && <Label text="badly misinterpreted" x={960} y={860 - 40} at={wordAt(s, 'misinterpreted.')} size={52} color="#FFD84A" />}
      {n === 29 && <Note at={wordAt(s, 'declassified')} text="Robert Hanyok's NSA study, declassified in 2005." top={120} />}
    </>
  );
};
const Escalate: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = parseInt(s.id.slice(4), 10);
  if (n >= 38) {
    const X = (y: number) => 260 + (y - 1955) * 70;
    return (
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
        <InsertBg />
        <Layer depth={1}>
          <path d={`M${X(1955)} 600 H${X(1975)}`} stroke="#F4ECD8" strokeWidth={6} />
          {[1955, 1960, 1965, 1970, 1975].map((y) => <g key={y}><path d={`M${X(y)} 585 V615`} stroke="#F4ECD8" strokeWidth={5} /><text x={X(y)} y={660} textAnchor="middle" fontFamily="TagBold" fontSize={32} fill="#F4ECD8">{y}</text></g>)}
          <rect x={X(1955)} y={480} width={(X(1975) - X(1955)) * (n === 39 ? interpolate(f, [wordAt(s, 'nearly'), wordAt(s, 'nearly') + 20], [0, 1]) : 0)} height={60} rx={12} fill="#8A94A8" />
          <rect x={X(1965)} y={380} width={(X(1973) - X(1965)) * interpolate(f, n === 38 ? [wordAt(s, 'decade'), wordAt(s, 'decade') + 20] : [-99, -98], [0, 1])} height={60} rx={12} fill={USA} stroke="#F4ECD8" strokeWidth={3} />
          <text x={X(1965)} y={360} fontFamily="TagBold" fontSize={30} fill="#F4ECD8">COMBAT OPERATIONS · 1965–73</text>
          {n === 39 && <text x={X(1955)} y={460} fontFamily="TagBold" fontSize={30} fill="#C9D0DC">INVOLVEMENT · c. 1955–75</text>}
        </Layer>
      </CameraRig>
    );
  }
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <Paddy />
      <Layer depth={1}>
        {n === 35 && <><Chibi x={760} y={920} s={1.2} {...{ outfit: { top: '#6A7448', bottom: '#5E6B45' }, hat: 'cap', hatColor: '#5E6B45' }} item="notebook" pose="present" expr="normal" talking={[]} seed="adv1" /><path d="M960 700 L1260 700" stroke="#FFD84A" strokeWidth={12} strokeLinecap="round" /><path d="M1240 680 L1270 700 L1240 720" stroke="#FFD84A" strokeWidth={12} fill="none" /><text x={1110} y={660} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#1A1410" opacity={springPop(f, wordAt(s, 'escalation'))}>ESCALATION</text></>}
        {n >= 36 && [...Array(8)].map((_, i) => <Chibi key={i} x={interpolate(f, [0, d], [-200, 300]) + i * 200} y={930} s={1.0} {...GI(i)} legs="march" pose="hold" expr="determined" talking={[]} seed={'cb' + i} delay={i * 2} />)}
      </Layer>
    </CameraRig>
  );
};

// ------------------------------------------------------------------ Chapter 5
const Arrive65 = hostShot((s) => [{ at: 0, arm: 'present', expr: 'normal' }], {
  props: (s) => <PopProp at={wordAt(s, 'combat')} x={1040} y={640}><g><Calendar x={0} y={-60} s={0.55} month="MARCH" day={8} year={1965} color={USA} /><text y={150} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#1A1410">Marines land at Da Nang</text></g></PopProp>,
});
const RollingThunder: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = parseInt(s.id.slice(4), 10);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <IndochinaMap x={M.x} y={M.y} s={M.s} labels split parallel={1} fills={{ north: '#D9584A', south: '#E8C65A' }} pins={n === 4 ? [{ city: 'Hanoi', at: wordAt(s, 'Hanoi'), color: NORTH }] : []} />
          {[0, 1, 2].map((i) => { const t = ((f + i * 25) % 90) / 90; const [hx, hy] = ll(105.9 + i * 0.4, 20.6 - i * 0.6); return <g key={i} transform={`translate(${hx - 400 + t * 800} ${hy - 80 + i * 20}) scale(0.35)`}><Jet x={0} y={0} color="#7A8A6A" /></g>; })}
          {[...Array(8)].map((_, i) => { const [x, y] = ll(104.3 + random('bx' + i) * 2.6, 18.2 + random('by' + i) * 4); const fl = Math.max(0, 1 - ((f + i * 9) % 36) / 10); return <circle key={i} cx={x} cy={y} r={22 * fl} fill="#FFD84A" opacity={fl} />; })}
        </Layer>
      </CameraRig>
      {n === 2 && <Label text="Operation Rolling Thunder" x={400} y={200} at={wordAt(s, 'Rolling')} size={52} color="#FFD84A" />}
      {n === 4 && <Card at={wordAt(s, 'force')} left={400} top={420} text="BOMB HANOI TO THE TABLE?" size={38} />}
    </>
  );
};
const Targets: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  if (n >= 7) {
    const again = n - 7;
    const cyc = (f % 60);
    const drop = gravityDrop(cyc, 0, { h: 480, g: 1.6, e: 0.0 });
    const hit = cyc > 24;
    return (
      <>
        <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03, shakes: [{ at: 25, amp: 8, len: 8 }] }}>
          <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#A8C8D8" /></Layer>
          <Layer depth={1}>
            <rect x={-200} y={720} width={2400} height={600} fill="#7A9A4A" /><rect x={-200} y={760} width={2400} height={90} fill="#5A8AB0" />
            <rect x={460} y={680} width={1000} height={40} fill={hit && cyc < 50 ? '#5A4A3A' : '#8A7A62'} stroke={OL} strokeWidth={5} />{[0, 1, 2, 3].map((i) => <rect key={i} x={520 + i * 280} y={720} width={30} height={60} fill="#7A6A52" stroke={OL} strokeWidth={4} />)}
            {!hit && <g transform={`translate(960 ${680 + drop.y})`}><path d="M-14 -40 Q0 -60 14 -40 L14 10 Q0 24 -14 10 Z" fill="#3A3A3A" stroke={OL} strokeWidth={3} /></g>}
            {hit && cyc < 44 && <circle cx={960} cy={660} r={(cyc - 24) * 8} fill="#FFD84A" opacity={1 - (cyc - 24) / 20} />}
            {cyc > 46 && [0, 1].map((i) => <Chibi key={i} x={840 + i * 240} y={800} s={0.7} {...NVA} item="mallet" pose="hold" expr="determined" talking={[]} seed={'rp' + i} />)}
          </Layer>
        </CameraRig>
        <Counter label="BOMBED:" value={`×${again + 1}`} left={60} top={120} />
        <Label text={n === 7 ? 'bomb them again' : 'and again'} x={960} y={180} at={2} size={60} color="#1A1410" />
      </>
    );
  }
  const items = [['roads,', 'ROADS'], ['bridges,', 'BRIDGES'], ['depots,', 'DEPOTS'], ['facilities,', 'FACTORIES']];
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
      <InsertBg />
      <Layer depth={1}>{items.map(([w, lab], i) => { const k = springPop(f, n === 5 ? (i < 3 ? wordAt(s, w) : 99999) : i < 3 ? -99 : wordAt(s, w)); const x = springPop(f, n === 6 ? wordAt(s, 'destroy') + i * 4 : 99999); return k > 0 ? <g key={i} transform={`translate(${330 + i * 420} 470) scale(${k})`}><rect x={-170} y={-130} width={340} height={260} rx={18} fill="#F4ECD8" stroke={OL} strokeWidth={6} /><text y={100} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#1A1410">{lab}</text>
        {i === 0 && <path d="M-120 40 L120 -60 M-80 60 L150 -30" stroke="#5A5A64" strokeWidth={14} />}{i === 1 && <path d="M-140 20 Q0 -80 140 20 M-140 20 H140 M-80 20 V-30 M80 20 V-30" stroke="#5A5A64" strokeWidth={10} fill="none" />}{i === 2 && <g><rect x={-90} y={-60} width={180} height={100} fill="#8A7A62" stroke={OL} strokeWidth={5} /><path d="M-110 -60 L0 -110 L110 -60 Z" fill="#6A5A42" stroke={OL} strokeWidth={5} /></g>}{i === 3 && <g><rect x={-100} y={-40} width={200} height={80} fill="#A8604A" stroke={OL} strokeWidth={5} /><rect x={40} y={-110} width={30} height={70} fill="#8A4A3A" stroke={OL} strokeWidth={4} /></g>}
        {x > 0 && <path d={`M-120 -100 L${-120 + 240 * Math.min(1, x)} ${-100 + 200 * Math.min(1, x)} M120 -100 L${120 - 240 * Math.min(1, x)} ${-100 + 200 * Math.min(1, x)}`} stroke="#B3261E" strokeWidth={16} strokeLinecap="round" />}</g> : null; })}</Layer>
    </CameraRig>
  );
};
const Tonnage: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = parseInt(s.id.slice(4), 10);
  if (n <= 12) {
    const sort = Math.round(interpolate(f, [0, d], n === 10 ? [0, 120000] : n === 11 ? [120000, 300000] : [300000, 300000]));
    return (
      <>
        <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
          <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#9CC8E0" /><Cloud x={300} y={160} /><Cloud x={1500} y={120} s={0.8} /></Layer>
          <Layer depth={1}>{[...Array(6)].map((_, i) => <g key={i} transform={`translate(${((f * 9 + i * 400) % 2600) - 300} ${160 + (i % 3) * 120}) scale(0.4)`}><Jet x={0} y={0} color="#7A8A6A" /></g>)}</Layer>
        </CameraRig>
        <Counter label="SORTIES:" value={`${sort.toLocaleString('en-US')}+`} left={60} top={120} />
        {n === 12 && <Card at={wordAt(s, 'tons')} left={960} top={560} text="HUNDREDS OF THOUSANDS OF TONS · NORTH VIETNAM ALONE" size={40} />}
      </>
    );
  }
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}><Bars x={560} y={760} max={7} h={520} w={300} gap={240} labelSize={30} bars={[
          { label: 'WORLD WAR II', v: 2.5, c: '#8A8A94', at: n === 14 ? wordAt(s, 'World') : n > 14 ? -99 : 99999, text: '~2–3 million t' },
          { label: 'INDOCHINA · US', v: 6.5, c: USA, at: n === 13 ? wordAt(s, 'million') : -99, text: 'several million t' },
        ]} /></Layer>
      </CameraRig>
      {n === 15 && <Note at={2} text="Commonly cited estimates; totals vary by source and by what is counted." top={120} />}
      {n === 16 && <Label text="almost impossible to comprehend" x={960} y={140} at={wordAt(s, 'impossible')} size={50} color="#FFD84A" />}
    </>
  );
};
const StillMoving: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  const trail: [number, number][] = [[105.8, 20.9], [105.9, 18.5], [105.6, 17.6], [106.3, 16.5], [106.8, 15.2], [107.0, 13.8], [106.9, 12.5], [106.4, 11.5]];
  const pts = trail.map(([a, b]) => ll(a, b));
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <IndochinaMap x={M.x} y={M.y} s={M.s} labels split parallel={1} fills={{ north: '#D9584A', south: '#E8C65A' }} />
          {n >= 19 && [...Array(6)].map((_, i) => { const t = ((f / 60 + i / 6) % 1) * (pts.length - 1); const a = pts[Math.floor(t)], b = pts[Math.min(pts.length - 1, Math.floor(t) + 1)]; const k = t - Math.floor(t); return <rect key={i} x={a[0] + (b[0] - a[0]) * k - 10} y={a[1] + (b[1] - a[1]) * k - 7} width={20} height={14} rx={4} fill="#5E6B45" stroke={OL} strokeWidth={3} />; })}
          {n === 20 && [...Array(10)].map((_, i) => { const [x, y] = mapP(['Saigon', 'Cu Chi', 'Tay Ninh', 'Ban Me Thuot', 'Nha Trang', 'My Lai', 'Hue', 'Da Nang', 'Quang Tri', 'Ia Drang'][i]); const k = springPop(f, wordAt(s, 'expanding.') - 10 + i * 2); return k > 0 ? <circle key={i} cx={x + 4} cy={y} r={14 * k} fill="#FF7A3A" stroke={OL} strokeWidth={3} /> : null; })}
        </Layer>
      </CameraRig>
      {n === 17 && <Stamp at={wordAt(s, 'failed')} left={420} top={420} text="OBJECTIVE FAILED" size={54} />}
      {n === 18 && <Label text="the North kept fighting" x={420} y={300} at={4} size={52} color="#FFD84A" />}
    </>
  );
};
const Troops: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  const at = (i: number) => (n > 22 + i ? -99 : n === 22 + i ? (i === 0 ? wordAt(s, '184,000') : i === 1 ? wordAt(s, '385,000.') : i === 2 ? wordAt(s, 'half') : wordAt(s, '543,000.')) - 6 : 99999);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
        <InsertBg />
        <Layer depth={1}>
          {n === 21 ? [...Array(30)].map((_, i) => { const k = springPop(f, 6 + i * 2); return k > 0 ? <g key={i} transform={`translate(${240 + (i % 10) * 150} ${340 + Math.floor(i / 10) * 200}) scale(${k * 0.6})`}><Chibi x={0} y={0} s={1} {...GI(i)} pose="hold" expr="determined" talking={[]} seed={'tr' + i} /></g> : null; })
            : <Bars x={340} y={760} max={560000} h={520} w={230} gap={110} bars={[
              { label: 'END 1965', v: 184000, c: '#5A6A9A', at: at(0), text: '184k' },
              { label: 'END 1966', v: 385000, c: '#4A5A8A', at: at(1), text: '385k' },
              { label: 'END 1967', v: 486000, c: '#3A4A7A', at: at(2), text: '~486k' },
              { label: 'PEAK 1969', v: 543000, c: USA, at: at(3), text: '543k' },
            ]} />}
        </Layer>
      </CameraRig>
      {n === 26 && <Label text="…each one closer to victory?" x={960} y={140} at={wordAt(s, 'victory')} size={52} color="#FFD84A" />}
    </>
  );
};
const SearchDestroy: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  if (n <= 30) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Jungle />
        <Layer depth={1.1}>{[0, 1, 2, 3].map((i) => <Chibi key={i} x={360 + i * 200} y={960} s={1.0} {...GI(i)} legs={n >= 28 ? 'walk' : 'stand'} pose={i === 0 ? 'point' : 'hold'} expr="determined" talking={[]} seed={'sd' + i} delay={i * 3} />)}{n === 27 && <g opacity={0.3 + 0.3 * Math.sin(f / 6)}><Chibi x={1600} y={960} s={1.0} {...VC} pose="hold" expr="normal" talking={[]} seed="vch" flip /></g>}</Layer>
      </CameraRig>
      {n === 30 && <Card at={wordAt(s, 'search')} left={1300} top={300} text="“SEARCH AND DESTROY”" size={56} />}
      {n === 27 && <Label text="a different kind of war" x={960} y={160} at={wordAt(s, 'kind')} size={52} color="#1A1410" />}
    </>
  );
  const steps = ['FIND', 'ENGAGE', 'KILL', 'REPORT'];
  const cur = n - 31;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
        <InsertBg />
        <Layer depth={1}>
          {n <= 34 && steps.map((t, i) => { const k = springPop(f, i < cur ? -99 : i === cur ? 2 : 99999); return k > 0 ? <g key={t} transform={`translate(${330 + i * 420} 470) scale(${k})`}><circle r={150} fill={i === cur ? USA : '#4A5470'} stroke={OL} strokeWidth={7} /><text y={-20} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#F4ECD8">{i + 1}</text><text y={34} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#fff">{t}</text></g> : null; })}
          {n >= 35 && <g><g transform="translate(560 470)"><rect x={-300} y={-220} width={600} height={440} rx={20} fill="#1A1410" stroke={OL} strokeWidth={8} /><text y={-140} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#F4ECD8">BODY COUNT</text>{[...Array(Math.min(32, Math.floor(f / 3)))].map((_, i) => <path key={i} d={`M${-200 + (i % 16) * 24 + (i % 5 === 4 ? -60 : 0)} ${-60 + Math.floor(i / 16) * 110} ${i % 5 === 4 ? 'l90 60' : 'v80'}`} stroke="#FF6B57" strokeWidth={8} strokeLinecap="round" />)}</g>
            <g transform="translate(1380 470)" opacity={0.6}><rect x={-300} y={-220} width={600} height={440} rx={20} fill="#3A3A48" stroke={OL} strokeWidth={8} /><text y={-140} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#F4ECD8">TERRITORY SECURED</text><text y={40} textAnchor="middle" fontFamily="TagBold" fontSize={110} fill="#8A8A94">?</text></g></g>}
        </Layer>
      </CameraRig>
    </>
  );
};
const Illusion: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = parseInt(s.id.slice(4), 10);
  if (n >= 42) {
    const night = n === 44 && f > d * 0.5;
    return (
      <>
        <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
          <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={night ? '#1C2333' : '#A8D4E6'} /></Layer>
          <Layer depth={0.6}><path d="M-200 900 Q960 300 2120 900 L2120 1300 L-200 1300 Z" fill={night ? '#2E4A2E' : '#5E8E4A'} stroke={OL} strokeWidth={5} />{[...Array(7)].map((_, i) => <Tree key={i} x={100 + i * 300} y={760 + Math.abs(i - 3) * 40} s={0.6} c="#3E7A3A" c2="#2E5E2E" />)}</Layer>
          <Layer depth={1}><Flag kind={night ? 'vc' : 'us'} x={960} y={300} s={0.7} pole={340} wave={Math.sin(f / 7) * 3} /></Layer>
        </CameraRig>
        <Label text={n === 42 ? 'won the fight · same war' : n === 43 ? 'unit destroyed · fight goes on' : night ? 'tomorrow' : 'today'} x={960} y={140} at={n === 44 ? (night ? d * 0.5 : 2) : 4} size={56} color={night ? '#F4ECD8' : '#1A1410'} />
      </>
    );
  }
  const k = interpolate(f, [0, d], [0, 1]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
        <InsertBg />
        <Layer depth={1}>
          <path d="M260 800 H1660 M260 800 V260" stroke="#F4ECD8" strokeWidth={6} />
          <path d={`M260 760 Q${600 + 400 * k} 600 ${700 + 900 * (n >= 39 ? 1 : k)} ${n >= 38 ? 300 : 700 - 400 * k}`} stroke="#FF6B57" strokeWidth={10} fill="none" />
          <text x={1600} y={280} textAnchor="end" fontFamily="TagBold" fontSize={34} fill="#FF6B57">ENEMY LOSSES</text>
          {n >= 39 && <><path d="M260 640 H1640" stroke="#C8102E" strokeWidth={10} strokeDasharray="30 14" strokeDashoffset={-f * 3} /><text x={1600} y={620} textAnchor="end" fontFamily="TagBold" fontSize={34} fill="#F4ECD8">ENEMY STRENGTH · REPLACED</text></>}
        </Layer>
      </CameraRig>
      {n === 37 && <Label text="a dangerous illusion" x={960} y={140} at={wordAt(s, 'illusion.')} size={56} color="#FFD84A" />}
      {(n === 40 || n === 41) && ['local', 'outside', 'replacements.'].map((w, i) => <Card key={w} at={n === 40 ? (i === 0 ? wordAt(s, 'local') : 99999) : i === 0 ? -99 : wordAt(s, w)} left={460 + i * 500} top={180} text={['LOCAL NETWORKS', 'OUTSIDE SUPPORT', 'REPLACEMENTS'][i]} size={36} />)}
    </>
  );
};
const Trail: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  const trail: [number, number][] = [[105.8, 20.9], [105.4, 18.8], [105.0, 17.6], [105.9, 16.4], [106.5, 15.2], [106.8, 13.8], [106.7, 12.6], [106.3, 11.5]];
  const pts = trail.map(([a, b]) => ll(a, b));
  const draw = n === 45 ? interpolate(f, [wordAt(s, 'Trail'), wordAt(s, 'Trail') + 40], [0, 1]) : 1;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [1000, 450] }}>
        <InsertBg />
        <Layer depth={1}>
          <IndochinaMap x={M.x} y={M.y} s={M.s} labels split parallel={1} fills={{ north: '#D9584A', south: '#E8C65A', laos: n >= 46 ? '#E0C8A0' : '#D8CCB0', camb: n >= 46 ? '#E0C8A0' : '#D8CCB0' }} />
          <path d={'M' + pts.map((p) => p.join(' ')).join(' L')} stroke="#7A4E2B" strokeWidth={14} fill="none" strokeLinejoin="round" strokeDasharray="1400" strokeDashoffset={1400 * (1 - draw)} />
          <path d={'M' + pts.map((p) => p.join(' ')).join(' L')} stroke="#E8C66A" strokeWidth={4} fill="none" strokeDasharray="16 12" strokeDashoffset={-f * 2} opacity={draw} />
          {n === 47 && [...Array(6)].map((_, i) => { const p = pts[1 + (i % 6)]; const fl = Math.max(0, 1 - ((f + i * 11) % 40) / 10); return <circle key={i} cx={p[0] + 10} cy={p[1]} r={26 * fl} fill="#FFD84A" opacity={fl} />; })}
          {n === 48 && <path d={`M${pts[2][0]} ${pts[2][1]} Q${pts[2][0] - 80} ${(pts[2][1] + pts[4][1]) / 2} ${pts[4][0]} ${pts[4][1]}`} stroke="#7A4E2B" strokeWidth={10} fill="none" strokeDasharray="14 10" />}
        </Layer>
      </CameraRig>
      {n === 45 && <Label text="the Hồ Chí Minh Trail" x={420} y={220} at={wordAt(s, 'Trail')} size={56} color="#FFD84A" />}
      {n === 48 && <Card at={wordAt(s, 'alternative')} left={400} top={420} text="REPAIRED · REROUTED" size={44} />}
    </>
  );
};
const TunnelShot: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = parseInt(s.id.slice(4), 10);
  const rooms = n >= 52 ? 3 : n >= 51 ? 1 : 0;
  const rat = n >= 53 && n <= 55;
  const lampX = rat ? interpolate(f, [0, d], [100, 900]) : -1;
  return (
    <>
      <CameraRig move={{ zoomFrom: n >= 53 ? 1.1 : 1, zoomTo: n >= 53 ? 1.14 : 1.03, focus: [800, 560] }}>
        <Tunnels rooms={rooms} lamp={lampX} />
        <Layer depth={0.6}>
          {rat && <g transform={`translate(${260 + lampX} 470)`}><Chibi x={0} y={0} s={0.55} {...GI(0)} item="lamp" legs="kneel" pose="hold" expr="worried" talking={[]} seed="rat" /></g>}
          {n >= 56 && <><Chibi x={1100} y={300} s={0.8} {...GI(1)} legs="walk" pose="hold" expr="normal" talking={[]} seed="abv" /><g transform="translate(1200 820)"><Chibi x={0} y={0} s={0.55} {...VC} pose="hold" expr="calm" talking={[]} seed="blw" /></g></>}
          {n <= 52 && [0, 1].map((i) => <g key={i} transform={`translate(${860 + i * 460} ${i ? 700 : 460})`}><Chibi x={0} y={50} s={0.5} {...VC} item="sack" pose="carry" expr="normal" talking={[]} seed={'tv' + i} /></g>)}
        </Layer>
      </CameraRig>
      {n === 50 && <Label text="the Củ Chi tunnels" x={960} y={140} at={wordAt(s, 'Cu')} size={56} color="#1A1410" />}
      {n === 53 && <Label text="“tunnel rats”" x={960} y={140} at={wordAt(s, 'rats')} size={60} color="#1A1410" />}
      {n === 55 && ['booby', 'hidden', 'darkness.'].map((w, i) => <Card key={w} at={wordAt(s, w)} left={460 + i * 500} top={170} text={['BOOBY TRAPS', 'HIDDEN EXITS', 'TOTAL DARKNESS'][i]} size={36} />)}
    </>
  );
};
const IaDrang: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = parseInt(s.id.slice(4), 10);
  if (n === 58) return hostShot(() => [{ at: 0, arm: 'finger', expr: 'normal' }])({ s }) as any;
  if (n >= 64 && n <= 66) {
    const gap = n === 64 ? interpolate(f, [0, d], [600, 160]) : 160;
    return (
      <>
        <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
          <InsertBg />
          <Layer depth={1}>
            <path d="M200 780 H1720" stroke="#F4ECD8" strokeWidth={5} />
            <g transform={`translate(${960 - gap} 780)`}>{[0, 1].map((i) => <Chibi key={i} x={-i * 130} y={0} s={0.9} {...GI(i)} pose="hold" expr="determined" talking={[]} seed={'cd' + i} />)}</g>
            <g transform={`translate(${960 + gap} 780)`}>{[0, 1].map((i) => <Chibi key={i} x={i * 130} y={0} s={0.9} {...NVA} pose="hold" expr="determined" talking={[]} seed={'cn' + i} flip />)}</g>
            {n >= 65 && <g transform="translate(960 260)"><g transform="scale(0.5)"><Jet x={0} y={0} /></g><circle r={120} fill="none" stroke="#B3261E" strokeWidth={14} opacity={springPop(f, n === 65 ? wordAt(s, 'harder') : -99)} /><path d="M-85 85 L85 -85" stroke="#B3261E" strokeWidth={14} opacity={springPop(f, n === 65 ? wordAt(s, 'harder') : -99)} /></g>}
            <path d={`M${960 - gap + 60} 860 H${960 + gap - 60}`} stroke="#FFD84A" strokeWidth={6} strokeDasharray="14 10" />
          </Layer>
        </CameraRig>
        {n === 64 && <Label text="“grab them by the belt”" x={960} y={140} at={wordAt(s, 'close')} size={52} color="#FFD84A" />}
        {n === 66 && <Label text="too close for air power" x={960} y={140} at={2} size={52} color="#FFD84A" />}
      </>
    );
  }
  if (n >= 67) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}><InsertBg /></CameraRig>
      {['aircraft,', 'artillery,', 'weapons.'].map((w, i) => <Card key={w} at={n === 67 ? wordAt(s, w) : -99} left={460 + i * 500} top={360} text={['MORE AIRCRAFT', 'MORE ARTILLERY', 'BETTER WEAPONS'][i]} size={40} bg="#C9D0E0" />)}
      {n === 68 && <Stamp at={wordAt(s, 'reduce')} left={960} top={600} text="ADVANTAGES REDUCED" size={56} />}
    </>
  );
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#B8D4E0" /></Layer>
        <Layer depth={0.5}><path d="M-200 640 Q400 520 960 620 Q1500 700 2200 560 L2200 1300 L-200 1300 Z" fill="#B8B068" stroke={OL} strokeWidth={4} />{[...Array(8)].map((_, i) => <Tree key={i} x={-60 + i * 300} y={640 + (i % 2) * 20} s={0.7} c="#4E7A3A" c2="#3E6A2E" />)}</Layer>
        <Layer depth={1}>
          {[0, 1, 2].map((i) => { const t0 = i * 16; const y = n === 60 || n === 61 ? interpolate(f, [t0, t0 + 50], [120, 560], Easing.out) : 200 + i * 40; return <g key={i} transform={`translate(${400 + i * 520} ${y})`}><Huey x={0} y={0} s={0.55} /></g>; })}
          {(n === 62 || n === 63) && [...Array(5)].map((_, i) => <Chibi key={i} x={300 + i * 280} y={940} s={0.95} {...GI(i)} pose="hold" expr="determined" talking={[]} seed={'id' + i} />)}
        </Layer>
      </CameraRig>
      {n === 59 && <Label text="Ia Drang Valley · November 1965" x={960} y={140} at={wordAt(s, 'Ia')} size={54} color="#1A1410" />}
      {n === 61 && <Label text="air mobility" x={960} y={140} at={wordAt(s, 'mobility')} size={56} color="#1A1410" />}
    </>
  );
};
const RanchHand: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const n = parseInt(s.id.slice(4), 10);
  if (n === 69 || n === 70) return hostShot(() => [{ at: 0, arm: 'present', expr: 'normal' }])({ s }) as any;
  if (n === 74) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}><InsertBg /><Layer depth={1}><g transform="translate(960 520)"><rect x={-130} y={-200} width={260} height={360} rx={30} fill="#3E5A3A" stroke={OL} strokeWidth={8} /><rect x={-130} y={-60} width={260} height={50} fill="#E8742A" /><path d="M-130 -140 H130 M-130 80 H130" stroke="#2E4A2E" strokeWidth={8} /></g></Layer></CameraRig>
      <Label text="Agent Orange" x={960} y={160} at={wordAt(s, 'Agent')} size={70} color="#E8742A" />
    </>
  );
  if (n >= 75 && n <= 77) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}><InsertBg glow={false} /></CameraRig>
      {n === 75 && <Card at={wordAt(s, 'dioxin.') - 6} left={960} top={400} text="DIOXIN" color="#B3261E" size={90} />}
      {n >= 76 && <><Card at={n === 76 ? wordAt(s, 'illnesses') : -99} left={960} top={330} text="SERIOUS ILLNESS · LONG-TERM SUFFERING" size={44} />{n === 77 && <><Card at={wordAt(s, 'Vietnamese')} left={620} top={520} text="VIETNAMESE COMMUNITIES" size={40} /><Card at={wordAt(s, 'veterans.')} left={1300} top={520} text="AMERICAN VETERANS" size={40} /></>}</>}
    </>
  );
  const brown = n === 71 ? 0 : n === 72 ? interpolate(f, [0, d], [0, 0.4]) : n === 73 ? interpolate(f, [0, d], [0.4, 1]) : 1;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#B8D4E0" /></Layer>
        <Layer depth={0.5}>{[...Array(16)].map((_, i) => { const x = -100 + i * 150; const dead = x < -100 + brown * 2600; return <g key={i} transform={`translate(${x} 700)`}><rect x={-12} y={-150} width={24} height={150} fill="#6A4A2A" /><circle cy={-190} r={95} fill={dead ? '#A8925A' : '#3E7A3A'} stroke={OL} strokeWidth={4} opacity={dead ? 0.7 : 1} /></g>; })}<rect x={-200} y={700} width={2400} height={700} fill={brown > 0.6 ? '#9A8A5A' : '#6E8E3A'} /></Layer>
        <Layer depth={1}>{n <= 73 && [0, 1, 2].map((i) => { const px = interpolate(f, [0, d], [-300 + i * 220, 1700 + i * 220]); return <g key={i}><g transform={`translate(${px} ${180 + i * 70}) scale(0.5)`}><Jet x={0} y={0} color="#8A949E" /></g>{n >= 72 && <path d={`M${px - 120} ${200 + i * 70} Q${px - 300} ${300 + i * 70} ${px - 500} ${480}`} stroke="#E8E4D0" strokeWidth={28} fill="none" opacity={0.5} />}</g>; })}</Layer>
      </CameraRig>
      {n === 71 && <Card at={4} left={960} top={300} text="CHEMICAL HERBICIDES" size={64} />}
      {n === 72 && <Label text="Operation Ranch Hand" x={960} y={120} at={wordAt(s, 'Ranch')} size={56} color="#1A1410" />}
      {n === 79 && <Stamp at={wordAt(s, 'could')} left={960} top={300} text="THE MOVEMENT SURVIVED" size={56} color={NORTH} />}
    </>
  );
};
const Optimism: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = parseInt(s.id.slice(4), 10);
  if (n <= 83) return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}><InsertBg /></CameraRig>
      {['enormous', 'intensifying.', 'mounting.'].map((w, i) => <Card key={w} at={n === 80 + i ? wordAt(s, w) - 4 : n > 80 + i ? -99 : 99999} left={420 + i * 540} top={360} text={['MORE TROOPS ✓', 'MORE BOMBING ✓', 'MORE ENEMY LOSSES ✓'][i]} size={36} bg="#D8E8D8" />)}
      {n === 83 && <Stamp at={wordAt(s, 'no')} left={960} top={600} text="NO PATH TO VICTORY" size={60} />}
    </>
  );
  const pub = n >= 85;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.02 }}>
        <InsertBg />
        <Layer depth={1}>
          <clipPath id="opL"><rect x={60} y={100} width={880} height={720} rx={20} /></clipPath><clipPath id="opR"><rect x={980} y={100} width={880} height={720} rx={20} /></clipPath>
          <g clipPath="url(#opL)"><rect x={60} y={100} width={880} height={720} fill="#3A3A48" /><rect x={200} y={520} width={600} height={60} fill="#5A3A22" />{[0, 1, 2].map((i) => <Chibi key={i} x={300 + i * 200} y={560} s={0.9} {...OFFICIAL_US(i)} pose={['chin', 'shrug', 'chin'][i]} expr="worried" talking={[]} seed={'bc' + i} />)}<text x={500} y={170} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#F4ECD8">BEHIND CLOSED DOORS</text></g>
          <g clipPath="url(#opR)" opacity={pub ? 1 : 0.35}><rect x={980} y={100} width={880} height={720} fill="#A8C6E0" /><rect x={1340} y={520} width={160} height={200} fill="#7A4E2B" stroke={OL} strokeWidth={5} /><Chibi x={1420} y={560} s={1.0} {...OFFICIAL_US(0)} pose="present" expr="happy" talking={[[2, 200]]} seed="pod" /><text x={1420} y={170} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#1A1410">IN PUBLIC</text></g>
          <rect x={60} y={100} width={880} height={720} rx={20} fill="none" stroke="#8A8A94" strokeWidth={8} /><rect x={980} y={100} width={880} height={720} rx={20} fill="none" stroke={USA} strokeWidth={8} />
          {n >= 86 && n <= 88 && <g transform={`translate(1420 270) scale(${springPop(f, 4)})`}><rect x={-330} y={-60} width={660} height={130} rx={30} fill="#F4F7FA" stroke={OL} strokeWidth={6} /><text y={14} textAnchor="middle" fontFamily="Hand" fontSize={44} fill={USA}>{['“The enemy is weakening.”', '“The end is approaching.”', '“Victory is within reach.”'][n - 86]}</text></g>}
        </Layer>
      </CameraRig>
      {n === 89 && <Stamp at={wordAt(s, 'shattered')} left={1420} top={270} text="JANUARY 1968" size={60} />}
    </>
  );
};

export const SHOTS_03: ShotMap = {
  maddox: Maddox, night_reports: NightReports, lbj_office: LBJOffice, votes: Votes, never: Never, escalate: Escalate,
  arrive65: Arrive65, rolling: RollingThunder, targets: Targets, tonnage: Tonnage, still_moving: StillMoving, troops: Troops,
  search_destroy: SearchDestroy, illusion: Illusion, trail: Trail, tunnel: TunnelShot, ia_drang: IaDrang, ranch_hand: RanchHand, optimism: Optimism,
};
