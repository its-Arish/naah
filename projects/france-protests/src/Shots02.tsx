/**
 * Act 2 — "The Bill". Money in green, the people in red, the crown in gold.
 */
import React from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, spring, springPop, gravityDrop, projectile, random } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Label } from '@engine/fx/Overlays';
import { Chibi } from '@engine/characters/Chibi';
import { GreyStage, InsertBg } from '@engine/scenes/Backgrounds';
import { OL, Cloud, Hills, Tree, Hut } from '@engine/scenes/Parts';
import { FranceMap, CITIES } from '@engine/scenes/France';
import { Versailles, RoyalRoom, Workshop, Desk, Bill, SmallCrown, FleurDeLis, ParisStreet } from '@engine/scenes/FranceScenes';
import { hostShot, wordAt, Drop, PopProp, DropHtml, type ShotMap, type SP } from '@engine/kit';
import type { Shot } from '@engine/types';
import { GOLD, PEOPLE, MONEY, STATE, LOUIS16, NOBLE, PEASANT } from './Shots01';

const headTop = (y: number, s: number) => y - 300 * s;
const MARIE = { outfit: { top: '#F2A7C3', robe: true, trim: '#F4F7FA', belt: '#B85A86' }, hat: 'queen', hatColor: '#F4F7FA' };
const CLERGY = { outfit: { top: '#1E1E28', robe: true, trim: '#F4F7FA' }, hat: 'skullcap', hatColor: '#C0392B' };
const Stamp: React.FC<{ at: number; left: number; top: number; text: string; color?: string; rot?: number; size?: number }> = ({ at, left, top, text, color = '#C0392B', rot = -8, size = 56 }) => (
  <DropHtml at={at} left={left} top={top} h={380}><div style={{ fontFamily: 'TagBold', fontSize: size, color, border: `7px solid ${color}`, padding: '4px 22px', borderRadius: 10, transform: `rotate(${rot}deg)`, background: 'rgba(255,255,255,0.88)', whiteSpace: 'nowrap' }}>{text}</div></DropHtml>
);
const Coin: React.FC<{ x: number; y: number; r?: number; c?: string }> = ({ x, y, r = 16, c = MONEY }) => <g><ellipse cx={x} cy={y} rx={r} ry={r} fill={c} stroke={OL} strokeWidth={3} /><text x={x} y={y + r * 0.38} textAnchor="middle" fontFamily="TagBold" fontSize={r * 1.1} fill="#E8F5E8">L</text></g>;
/** Gravity-fed stream of coins from (x0,y0) toward a target, recomputed per frame (deterministic). */
const CoinStream: React.FC<{ from: number; x0: number; y0: number; vx: number; vy: number; n?: number; every?: number; floorY?: number }> = ({ from, x0, y0, vx, vy, n = 30, every = 3, floorY = 1200 }) => {
  const f = useCurrentFrame();
  if (f < from) return null;
  return <g>{[...Array(n)].map((_, i) => {
    const st = from + i * every; if (f < st) return null;
    const p = projectile(f, st, [x0 + (random('cs' + i) - 0.5) * 30, y0], [vx + (random('cv' + i) - 0.5) * 2, vy], 1.2);
    return p.y < floorY ? <Coin key={i} x={p.x} y={p.y} /> : null;
  })}</g>;
};
const H = hostShot;

// ------------------------------------------------------------------ shots
const L16Intro: React.FC<SP> = ({ s }) => {
  const Frame = H(() => [{ at: 0, arm: 'present', expr: 'smile' }], {
    props: () => <PopProp at={6} x={1020} y={600}><g><rect x={-170} y={-230} width={340} height={420} fill="#7A4E2B" stroke={OL} strokeWidth={8} /><rect x={-145} y={-205} width={290} height={370} fill="#C9D6E3" /><g transform="translate(0 150) scale(0.9)"><Chibi x={0} y={0} s={1.1} {...LOUIS16} pose="idle" expr="calm" talking={[]} seed="pt16" /></g></g></PopProp>,
  });
  return <Frame s={s} />;
};
const L16Profile: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const dream = s.id === 's03b03' ? springPop(f, wordAt(s, 'workshop.') - 8) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.05, focus: [800, 600] }}>
        <RoyalRoom />
        <Layer depth={1}>
          <Chibi x={760} y={880} s={1.35} {...LOUIS16} pose={s.id === 's03b03' ? 'shrug' : 'idle'} expr={s.id === 's03b03' ? 'calm' : 'happy'} talking={[]} seed="l16p" />
          <SmallCrown x={760} y={headTop(880, 1.35) + 20} s={1.0} />
          {dream > 0 && <g transform={`translate(1220 360) scale(${dream})`}><ellipse cx={0} cy={0} rx={250} ry={170} fill="#fff" stroke={OL} strokeWidth={6} />{[[-210, 150, 30], [-260, 210, 18]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff" stroke={OL} strokeWidth={5} />)}<g transform="translate(0 20)"><rect x={-50} y={-30} width={100} height={110} rx={16} fill={GOLD} stroke={OL} strokeWidth={6} /><path d="M-30 -30 V-70 Q0 -120 30 -70 V-30" stroke="#8A8A8A" strokeWidth={16} fill="none" /><circle cx={0} cy={22} r={14} fill={OL} /></g><text x={0} y={-110} textAnchor="middle" fontFamily="Hand" fontSize={46} fill="#1A1410">♥ locks ♥</text></g>}
        </Layer>
      </CameraRig>
      {s.id === 's03b02' && <Label text="Louis XVI · king at 19 · 1774" x={760} y={150} at={wordAt(s, 'nineteen,')} size={52} color="#fff" />}
    </>
  );
};
const Marie: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame(); const d = useDuration();
  const x = s.id === 's03b04' ? interpolate(f, [0, d], [1700, 1100], Easing.out) : 1100;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 600] }}>
        <Versailles gate={false} />
        <Layer depth={1.1}>
          <Chibi x={x} y={860} s={1.25} {...MARIE} legs={s.id === 's03b04' && f < d * 0.8 ? 'walk' : 'stand'} pose="idle" expr="happy" talking={[]} seed="marie" flip />
          {[0, 1, 2].map((i) => <Chibi key={i} x={300 + i * 170} y={860} s={1.05} {...NOBLE(['#6A4A8A', '#2E6B4A', '#8A3A2A'][i])} pose={s.id === 's03b05' && i === 1 ? 'point' : 'cross'} expr={s.id === 's03b05' ? 'angry' : 'normal'} talking={[]} seed={'gs' + i} />)}
          {s.id === 's03b05' && <PopProp at={wordAt(s, 'disliked')} x={480} y={420}><g><ellipse rx={150} ry={70} fill="#fff" stroke={OL} strokeWidth={5} /><text y={14} textAnchor="middle" fontFamily="Hand" fontSize={44} fill="#1A1410">"l'Autrichienne"</text></g></PopProp>}
        </Layer>
      </CameraRig>
      <Label text="Marie Antoinette" x={x} y={190} at={wordAt(s, 'Marie') || 6} size={52} color="#1A1410" />
    </>
  );
};
const MoneyHost: React.FC<SP> = ({ s }) => {
  const Comp = H(() => [{ at: 0, arm: 'present', expr: 'smile' }], { props: () => <PopProp at={8} x={1050} y={520}><g><circle r={90} fill={MONEY} stroke={OL} strokeWidth={8} /><text y={36} textAnchor="middle" fontFamily="TagBold" fontSize={100} fill="#E8F5E8">L</text><text y={150} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#1A1410">livres</text></g></PopProp> });
  return <Comp s={s} />;
};
/** The three estates as a pyramid; the top two are stamped EXEMPT and the coins come out of the bottom. */
const Estates: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const order = ['s03b07', 's03b08', 's03b09', 's03b10', 's03b11', 's03b12', 's03b13'];
  const idx = order.indexOf(s.id);
  const show = (k: number, w: string) => (idx > k ? -99 : idx === k ? wordAt(s, w) : 99999);
  const t1 = show(1, 'clergy'), t2 = show(2, 'nobility'), t3 = show(3, 'Everyone');
  const exempt = show(4, 'exempt');
  const tiers = [
    { at: t1, y: 220, w: 300, c: GOLD, label: '1st · CLERGY' },
    { at: t2, y: 420, w: 560, c: '#B88A2E', label: '2nd · NOBILITY' },
    { at: t3, y: 620, w: 840, c: PEOPLE, label: '3rd · EVERYONE ELSE (98%)' },
  ];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03, focus: [800, 500] }}>
        <InsertBg />
        <Layer depth={1}>
          {tiers.map((t, i) => {
            const k = springPop(f, t.at);
            if (k <= 0) return <g key={i} transform={`translate(760 ${t.y})`} opacity={0.35}><path d={`M${-t.w / 2} 180 L${-t.w / 2 + 70} 0 L${t.w / 2 - 70} 0 L${t.w / 2} 180 Z`} fill="none" stroke="#F4ECD8" strokeWidth={5} strokeDasharray="18 12" /></g>;
            return <g key={i} transform={`translate(760 ${t.y}) scale(${k})`}><path d={`M${-t.w / 2} 180 L${-t.w / 2 + 70} 0 L${t.w / 2 - 70} 0 L${t.w / 2} 180 Z`} fill={t.c} stroke={OL} strokeWidth={6} /><text y={110} textAnchor="middle" fontFamily="TagBold" fontSize={i === 2 ? 40 : 36} fill="#fff" stroke={OL} strokeWidth={4} style={{ paintOrder: 'stroke' }}>{t.label}</text></g>;
          })}
          {idx >= 5 && <CoinStream from={idx === 5 ? wordAt(s, 'paid') - 10 : -30} x0={1000} y0={720} vx={11} vy={-9} n={40} every={2} />}
          {idx >= 5 && <g transform="translate(1520 720)"><rect x={-130} y={0} width={260} height={150} rx={14} fill="#7A4E2B" stroke={OL} strokeWidth={6} /><text x={0} y={95} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill={GOLD}>TREASURY</text></g>}
        </Layer>
      </CameraRig>
      {idx === 4 && <><Stamp at={exempt} left={1160} top={330} text="EXEMPT" /><Stamp at={exempt + 6} left={1320} top={520} text="EXEMPT" rot={6} /></>}
      {exempt === -99 && idx < 5 && null}
      {idx >= 5 && <><div style={{ position: 'absolute', left: 1080, top: 300, fontFamily: 'TagBold', fontSize: 50, color: '#C0392B', border: '7px solid #C0392B', padding: '4px 22px', borderRadius: 10, transform: 'rotate(-8deg)', background: 'rgba(255,255,255,0.88)' }}>EXEMPT</div><div style={{ position: 'absolute', left: 1240, top: 490, fontFamily: 'TagBold', fontSize: 50, color: '#C0392B', border: '7px solid #C0392B', padding: '4px 22px', borderRadius: 10, transform: 'rotate(6deg)', background: 'rgba(255,255,255,0.88)' }}>EXEMPT</div></>}
      {s.id === 's03b12' && <Label text="richest pay least" x={1400} y={150} at={wordAt(s, 'least,') - 4} size={52} color="#FFD84A" />}
      {s.id === 's03b13' && <Label text="poorest pay most" x={1400} y={150} at={wordAt(s, 'most.') - 4} size={52} color="#FF6B57" />}
    </>
  );
};
const America: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const broke = s.id === 's03b16' ? wordAt(s, 'bankruptcy.') - 6 : 99999;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 500] }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform="translate(330 470)"><rect x={-160} y={-110} width={320} height={210} fill="#F4F7FA" stroke={OL} strokeWidth={6} /><rect x={-160} y={-110} width={107} height={210} fill="#2E4A9A" /><rect x={53} y={-110} width={107} height={210} fill="#C0392B" /><FleurDeLis x={0} y={30} s={0.9} /><text y={160} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#fff">FRANCE</text></g>
          <g transform="translate(1560 470)"><rect x={-160} y={-110} width={320} height={210} fill="#F4F7FA" stroke={OL} strokeWidth={6} />{[...Array(7)].map((_, i) => <rect key={i} x={-160} y={-110 + i * 30} width={320} height={15} fill="#C0392B" />)}<rect x={-160} y={-110} width={140} height={105} fill="#2E4A9A" />{[...Array(13)].map((_, i) => <circle key={i} cx={-90 + 45 * Math.cos(i * 0.483)} cy={-57 + 38 * Math.sin(i * 0.483)} r={5} fill="#fff" />)}<text y={160} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#fff">AMERICA</text></g>
          {f < broke && <CoinStream from={6} x0={480} y0={420} vx={20} vy={-16} n={60} every={2} floorY={600} />}
          {f >= broke && <g transform={`translate(330 470) scale(${1 + 0.05 * Math.sin((f - broke) * 0.6) * Math.exp(-(f - broke) / 15)})`}><rect x={-120} y={170} width={240} height={140} rx={12} fill="#7A4E2B" stroke={OL} strokeWidth={6} /><text y={260} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill={GOLD}>EMPTY</text></g>}
        </Layer>
      </CameraRig>
      {s.id === 's03b15' && <Label text="1,000,000,000+ livres" x={960} y={760} at={wordAt(s, 'billion')} size={64} color="#8EE0A8" />}
      {s.id === 's03b16' && <Stamp at={broke} left={330} top={260} text="BANKRUPT" />}
    </>
  );
};
const Interest: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const share = s.id === 's03b17' ? 0.5 * spring(f - wordAt(s, 'half'), { damping: 12, stiffness: 120 }) : 0.5;
  const a = share * Math.PI * 2, r = 280;
  const card = s.id === 's03b18' ? springPop(f, wordAt(s, 'credit')) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform={`translate(${s.id === 's03b18' ? 520 : 960} 480)`}>
            <circle r={r} fill={GOLD} stroke={OL} strokeWidth={6} />
            {share > 0.01 && <path d={`M0 0 L0 ${-r} A${r} ${r} 0 ${share > 0.5 ? 1 : 0} 1 ${Math.sin(a) * r} ${-Math.cos(a) * r} Z`} fill={PEOPLE} stroke={OL} strokeWidth={6} />}
            <text x={130} y={10} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#fff" stroke={OL} strokeWidth={5} style={{ paintOrder: 'stroke' }}>INTEREST</text>
            <text x={-130} y={10} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#1A1410">everything</text>
            <text x={-130} y={56} textAnchor="middle" fontFamily="TagBold" fontSize={40} fill="#1A1410">else</text>
          </g>
          {card > 0 && <g transform={`translate(1370 470) scale(${card}) rotate(-6)`}><rect x={-260} y={-160} width={520} height={320} rx={30} fill="#2E4A9A" stroke={OL} strokeWidth={8} /><rect x={-200} y={-90} width={90} height={66} rx={10} fill={GOLD} stroke={OL} strokeWidth={4} /><text x={-220} y={60} fontFamily="TagBold" fontSize={44} fill="#fff">MINIMUM PAYMENT</text><text x={-220} y={115} fontFamily="Tag" fontSize={34} fill="#C8D6F0">Louis XVI · 1780s</text></g>}
        </Layer>
      </CameraRig>
      <Label text="~half the royal budget" x={s.id === 's03b18' ? 520 : 960} y={120} at={4} size={52} color="#FFD84A" />
      {s.id === 's03b18' && <Stamp at={wordAt(s, 'forever.') - 2} left={1370} top={700} text="FOREVER" />}
    </>
  );
};
/** A finance minister keeps pushing a reform through a door; the privileged slam it shut (spring). */
const Blocked: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = s.id === 's03b20' ? wordAt(s, 'blocked') : 99999;
  const slams = [at - 20, at - 8, at];
  const shut = slams.reduce((acc, t) => (f >= t ? 1 - Math.exp(-(f - t) / 3) * Math.cos((f - t) * 0.9) : acc), 0);
  const ang = 70 * (1 - Math.min(1, Math.max(0, shut)));
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 600], shakes: slams.map((t) => ({ at: t, amp: 6, len: 6 })) }}>
      <RoyalRoom />
      <Layer depth={1}>
        <rect x={1060} y={260} width={300} height={560} fill="#3A2A22" stroke={OL} strokeWidth={6} />
        <g transform={`translate(1060 260) scale(${Math.cos((ang * Math.PI) / 180)} 1)`}><rect x={0} y={0} width={300} height={560} fill="#7A4E2B" stroke={OL} strokeWidth={6} /><circle cx={260} cy={290} r={14} fill={GOLD} stroke={OL} strokeWidth={4} /><text x={150} y={150} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill={GOLD}>PRIVILEGES</text></g>
        <Chibi x={760} y={880} s={1.2} outfit={{ top: '#3A3A3A', bottom: '#F4F7FA' }} hat="hairlong" hatColor="#E8E2D0" item="scroll" pose="pass" expr={f > at ? 'sad' : 'determined'} talking={[]} seed="minister" />
        <text x={760} y={470} textAnchor="middle" fontFamily="TagBold" fontSize={36} fill="#fff" stroke={OL} strokeWidth={5} style={{ paintOrder: 'stroke' }}>"TAX THE PRIVILEGED"</text>
      </Layer>
    </CameraRig>
  );
};
const Notables: React.FC<SP> = ({ s }) => {
  const no = s.id === 's03b22' ? wordAt(s, 'no.') - 2 : 99999;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <RoyalRoom />
        <Layer depth={1}>{[...Array(6)].map((_, i) => <Chibi key={i} x={240 + i * 280} y={880} s={1.0} {...NOBLE(['#6A4A8A', '#2E6B4A', '#8A3A2A'][i % 3])} legs="sit" pose={[{ at: 0, pose: 'cross' }, { at: no + i * 2, pose: 'raise' }]} expr={[{ at: 0, expr: 'normal' }, { at: no + i * 2, expr: 'angry' }]} talking={[]} seed={'nt' + i} />)}</Layer>
      </CameraRig>
      <Label text="Assembly of Notables, 1787" x={960} y={140} at={wordAt(s, 'Assembly') || 6} size={52} color="#fff" />
      {s.id === 's03b22' && <Label text="NON." x={960} y={360} at={no} size={150} color="#C0392B" />}
    </>
  );
};
const LockedSystem: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}>
          <g transform="translate(960 560)"><rect x={-170} y={-110} width={340} height={230} rx={18} fill="#7A4E2B" stroke={OL} strokeWidth={8} /><text y={-20} textAnchor="middle" fontFamily="TagBold" fontSize={42} fill={GOLD}>TREASURY</text><g transform="translate(0 70)"><rect x={-44} y={-20} width={88} height={80} rx={12} fill={GOLD} stroke={OL} strokeWidth={6} /><path d="M-26 -20 V-56 Q0 -96 26 -56 V-20" stroke="#8A8A8A" strokeWidth={14} fill="none" /></g></g>
          <Chibi x={460} y={880} s={1.25} {...NOBLE('#6A4A8A')} pose="cross" expr="angry" talking={[]} seed="won" />
          <Chibi x={1460} y={880} s={1.25} {...PEASANT()} pose="shrug" expr="sad" talking={[]} seed="cant" flip />
        </Layer>
      </CameraRig>
      <Label text="WON'T pay" x={460} y={300} at={wordAt(s, "wouldn't") || 4} size={60} color="#FFD84A" />
      {s.id === 's03b24' && <Label text="CAN'T pay" x={1460} y={300} at={wordAt(s, "couldn't.") - 2} size={60} color="#FF6B57" />}
    </>
  );
};
/** July 1788: hailstones fall under gravity, bounce, and flatten the wheat. */
const Hail: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const start = s.id === 's03b26' ? Math.max(4, wordAt(s, 'hailstorm') - 10) : 0;
  const flat = Math.min(1, Math.max(0, (f - start - 20) / 50));
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04, focus: [960, 600], shakes: [{ at: start + 20, amp: 4, len: 30 }] }}>
        <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#7A8290" /><Cloud x={200} y={120} s={1.6} fill="#5A606C" speed={0.2} /><Cloud x={900} y={90} s={1.9} fill="#4E545E" speed={0.1} /><Cloud x={1500} y={140} s={1.5} fill="#5A606C" speed={0.25} /></Layer>
        <Layer depth={1}>
          <rect x={-200} y={720} width={2400} height={600} fill="#9A8A5A" stroke={OL} strokeWidth={4} />
          {[...Array(60)].map((_, i) => { const x = -100 + i * 35; const lean = flat * (60 + random('w' + i) * 30); return <g key={i} transform={`translate(${x} 760) rotate(${lean})`}><path d="M0 0 V-120" stroke="#C9A64A" strokeWidth={5} /><ellipse cx={0} cy={-128} rx={8} ry={18} fill="#E2B13C" stroke={OL} strokeWidth={2} /></g>; })}
          {[...Array(70)].map((_, i) => {
            const st = start + (i % 35) * 2 + Math.floor(i / 35) * 5;
            if (f < st) return null;
            const p = projectile(f, st, [random('hx' + i) * 1920, -40], [-2, 6], 1.6, { y: 740 + random('hy' + i) * 120, e: 0.35, mu: 0.6, maxBounces: 3 });
            return <circle key={i} cx={p.x} cy={p.y} r={9} fill="#F4F7FA" stroke={OL} strokeWidth={2} />;
          })}
        </Layer>
      </CameraRig>
      <Label text="13 July 1788 · hailstorm" x={960} y={150} at={wordAt(s, 'July') || 4} size={52} color="#fff" />
    </>
  );
};
const Winter: React.FC<SP> = () => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#C8D6E5" /><Hills y={560} fill="#EEF3F8" amp={40} seed="wi" /></Layer>
      <Layer depth={0.5}>{[0, 1, 2].map((i) => <Hut key={i} x={420 + i * 520} y={720} s={1.6} />)}{[0, 1, 2].map((i) => <rect key={'r' + i} x={340 + i * 520} y={560} width={160} height={30} rx={14} fill="#F4F7FA" />)}</Layer>
      <Layer depth={1}>
        <rect x={-200} y={720} width={2400} height={600} fill="#EEF3F8" stroke={OL} strokeWidth={4} />
        <path d="M-200 840 Q600 800 1000 860 T2200 830 L2200 920 Q1400 900 960 940 T-200 910 Z" fill="#A8C8E0" stroke={OL} strokeWidth={4} />
        {[0, 1].map((i) => <Chibi key={i} x={760 + i * 360} y={830} s={1.0} {...PEASANT(['#C0392B', '#8A3A2A'][i])} pose="cross" expr="sad" talking={[]} seed={'sh' + i} />)}
        {[...Array(50)].map((_, i) => <circle key={i} cx={(random('sx' + i) * 1920 + f * 1.2) % 1920} cy={(random('sy' + i) * 1080 + f * (2 + random('sv' + i))) % 1080} r={4} fill="#fff" opacity={0.85} />)}
      </Layer>
    </CameraRig>
  );
};
/** A labourer's daily wage bar, swallowed by a loaf of bread up to 88 %. */
const BreadBar: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = s.id === 's03b29' ? wordAt(s, '88') - 6 : 99999;
  const pct = f < at ? (s.id === 's03b28' ? interpolate(f, [wordAt(s, 'spiked,'), wordAt(s, 'spiked,') + 30], [0.35, 0.6]) : 0.6) : 0.6 + 0.28 * spring(f - at, { damping: 13, stiffness: 120 });
  const W = 1300;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.03 }}>
        <InsertBg />
        <Layer depth={1}>
          <text x={310} y={380} fontFamily="TagBold" fontSize={46} fill="#fff">A LABOURER'S DAILY WAGE</text>
          <rect x={310} y={420} width={W} height={150} rx={20} fill={PEOPLE} stroke={OL} strokeWidth={6} />
          <rect x={310} y={420} width={W * pct} height={150} rx={20} fill="#D9A55A" stroke={OL} strokeWidth={6} />
          <g transform={`translate(${310 + W * pct - 90} 495)`}><path d="M-110 30 Q-120 -50 0 -60 Q120 -50 110 30 Z" fill="#C9822E" stroke={OL} strokeWidth={6} />{[-50, 0, 50].map((x) => <path key={x} d={`M${x - 20} -20 L${x + 10} -44`} stroke="#8A5A1E" strokeWidth={6} strokeLinecap="round" />)}</g>
          <text x={310 + W * pct / 2} y={520} textAnchor="middle" fontFamily="TagBold" fontSize={56} fill="#1A1410">BREAD</text>
        </Layer>
      </CameraRig>
      {s.id === 's03b29' && <Label text="UP TO 88%" x={960} y={720} at={at + 8} size={96} color="#FFD84A" />}
    </>
  );
};
const Cake: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const child = s.id === 's03b31';
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <Versailles gate={false} />
        <Layer depth={1.1}>
          {!child && <><Chibi x={900} y={880} s={1.3} {...MARIE} pose="present" expr="shock" talking={[]} seed="mc" /><PopProp at={8} x={1240} y={720}><g><rect x={-80} y={-60} width={160} height={70} fill="#F4D0E0" stroke={OL} strokeWidth={5} /><rect x={-80} y={-100} width={160} height={40} fill="#F7E7EF" stroke={OL} strokeWidth={5} /><circle cx={0} cy={-112} r={12} fill="#C0392B" stroke={OL} strokeWidth={3} /></g></PopProp></>}
          {child && <><g transform="translate(560 600) rotate(-4)"><rect x={-220} y={-260} width={440} height={330} fill="#7A1E2E" stroke={OL} strokeWidth={8} /><text x={0} y={-140} textAnchor="middle" fontFamily="Hand" fontSize={56} fill={GOLD}>Les Confessions</text><text x={0} y={-60} textAnchor="middle" fontFamily="Tag" fontSize={36} fill="#F4ECD8">J.-J. Rousseau</text></g><Chibi x={1300} y={880} s={0.8} {...MARIE} pose="idle" expr="happy" talking={[]} seed="mchild" /><Label text="Marie Antoinette, aged ~10, in Austria" x={1300} y={420} at={wordAt(s, 'child')} size={40} color="#1A1410" /></>}
        </Layer>
      </CameraRig>
      {!child && <Stamp at={wordAt(s, 'never') + 2} left={1240} top={360} text="NEVER SAID IT" />}
    </>
  );
};
/** A rumour passed along a line of people, the speech bubble growing each time. */
const FeelsTrue: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
      <ParisStreet />
      <Layer depth={1.1}>
        {[...Array(5)].map((_, i) => {
          const at = 6 + i * 10;
          const k = springPop(f, at);
          return <g key={i}>
            <Chibi x={260 + i * 350} y={900} s={1.0} {...PEASANT(['#C0392B', '#8A3A2A', '#B85A30', '#A83A4A', '#7A2E2E'][i])} hat={i % 2 ? 'cap' : 'none'} hatColor="#3A3A3A" pose={f > at ? 'point' : 'idle'} expr={f > at ? 'shock' : 'normal'} talking={[]} seed={'rm' + i} />
            {k > 0 && <g transform={`translate(${300 + i * 350} 470) scale(${k * (0.6 + i * 0.12)})`}><ellipse rx={150} ry={70} fill="#fff" stroke={OL} strokeWidth={5} /><text y={14} textAnchor="middle" fontFamily="Hand" fontSize={40} fill="#C0392B">{'cake!'.padEnd(5 + i, '!')}</text></g>}
          </g>;
        })}
      </Layer>
    </CameraRig>
  );
};
const AsksPeople: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const send = s.id === 's03b37' ? wordAt(s, 'people.') - 6 : 99999;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1.04 }}>
        <RoyalRoom />
        <Layer depth={1}>
          <Chibi x={560} y={860} s={1.2} {...LOUIS16} legs="sit" pose="scribble" expr={s.id === 's03b35' ? 'sad' : 'calm'} talking={[]} seed="l16a" />
          <Desk x={800} y={760} s={1.0} />
          {f >= send && [...Array(14)].map((_, i) => { const p = projectile(f, send + i * 2, [820, 680], [10 + random('lx' + i) * 12, -14 - random('ly' + i) * 8], 0.9); return <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${(f - send) * 8 + i * 30})`}><rect x={-30} y={-20} width={60} height={40} fill="#F4ECD8" stroke={OL} strokeWidth={3} /><path d="M-30 -20 L0 6 L30 -20" fill="none" stroke={OL} strokeWidth={3} /></g>; })}
        </Layer>
      </CameraRig>
      {s.id === 's03b36' && <Label text="First since 1614 · 175 years" x={1300} y={200} at={wordAt(s, '175')} size={52} color="#FFD84A" />}
      {s.id === 's03b37' && <Label text="Estates-General summoned" x={1300} y={200} at={send} size={52} color="#FFD84A" />}
    </>
  );
};
const DynastyEnd: React.FC<SP> = () => {
  const f = useCurrentFrame(); const d = useDuration();
  const crack = interpolate(f, [d * 0.4, d * 0.8], [0, 1]);
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.12, focus: [960, 500] }}>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill="#2A1E28" /><circle cx={960} cy={480} r={360} fill="url(#warmGlow)" opacity={0.5} /></Layer>
      <Layer depth={1}>
        <path d="M720 640 Q960 580 1200 640 L1160 720 Q960 690 760 720 Z" fill="#7A1E2E" stroke={OL} strokeWidth={6} />
        <SmallCrown x={960} y={640} s={3.2} />
        <path d="M960 470 L940 520 L975 560 L950 610" fill="none" stroke="#1A1410" strokeWidth={8} strokeLinecap="round" strokeDasharray="200" strokeDashoffset={200 * (1 - crack)} />
      </Layer>
    </CameraRig>
  );
};

export const SHOTS_02: ShotMap = {
  l16_intro: L16Intro, l16_profile: L16Profile, marie: Marie, money_host: MoneyHost, estates: Estates, america: America,
  interest: Interest, blocked: Blocked, notables: Notables, locked_system: LockedSystem, hail: Hail, winter: Winter,
  bread_bar: BreadBar, cake: Cake, feels_true: FeelsTrue, asks_people: AsksPeople, dynasty_end: DynastyEnd,
};
