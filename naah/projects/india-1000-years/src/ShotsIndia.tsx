import React from 'react';
import { useCurrentFrame, interpolate, Easing, popScale, onTwos, random, gravityDrop, projectile, springPop, spring, anticipate } from '@engine/lib/core';
import { CameraRig, Layer, CamMove } from '@engine/fx/Camera';
import { Host, HostKey } from '@engine/characters/Host';
import { Chibi, Outfit } from '@engine/characters/Chibi';
import { GreyStage, InsertBg } from '@engine/scenes/Backgrounds';
import { OL, Cloud } from '@engine/scenes/Parts';
import { Label, Spotlight } from '@engine/fx/Overlays';
import { Horse, Camel, DelhiGate, DesertRoad, RajputFort, Passes, TempleVault, SomnathCoast, Plain, Tent, TentInterior, KingdomMap, GdpPie, Tally, CoinBurst } from '@engine/scenes/India';
import type { Shot } from '@engine/types';

export type SP = { s: Shot };
export const talk = (s: Shot): [number, number][] => [[6, s.talkEnd ?? 60]];
export const wordAt = (s: Shot, w: string) => s.words?.find((x) => x.w.replace(/[^\w]/g, '').toLowerCase() === w.toLowerCase())?.at ?? 20;

// ------------------------------------------------------------- cast
export const RAJPUT = (c: string): Outfit => ({ top: c, bottom: '#F1E6D0', belt: '#E2B13C', sash: '#E2B13C' });
export const PRITHVI: Outfit = { top: '#C9962C', bottom: '#F1E6D0', belt: '#8C1D18', sash: '#8C1D18', cape: '#8C1D18' };
export const MAHMUD: Outfit = { top: '#2E6B4A', robe: true, trim: '#E2B13C', belt: '#E2B13C' };
export const GHORI: Outfit = { top: '#7A2A22', bottom: '#3A2A1E', belt: '#E2B13C', cape: '#4A1A16' };
export const GHURID_SOLDIER: Outfit = { top: '#6E5A48', bottom: '#3A2A1E', belt: '#3A2A1E' };
export const AIBAK: Outfit = { top: '#3E5C8A', bottom: '#E8DCC0', belt: '#E2B13C' };
export const PERSIAN: Outfit = { top: '#7A1F2B', robe: true, trim: '#E2B13C', belt: '#E2B13C' };

/** A rider = horse + seated chibi. */
export const Rider: React.FC<{ x: number; y: number; s?: number; flip?: boolean; gait?: 'idle' | 'walk' | 'gallop'; horse?: string; phase?: number; silhouette?: boolean; rider: React.ComponentProps<typeof Chibi> | any }> = ({ x, y, s = 1, flip, gait = 'idle', horse, phase = 0, silhouette, rider }) => {
  const f = onTwos(useCurrentFrame()) + phase;
  const bob = gait === 'gallop' ? -Math.abs(Math.sin((f * 1.6) / 3)) * 14 * s : gait === 'walk' ? -Math.abs(Math.sin((f * 0.7) / 3)) * 4 * s : 0;
  const body = (
    <g>
      <Horse x={x} y={y} s={s} flip={flip} gait={gait} color={horse} phase={phase} />
      <Chibi {...rider} x={x + (flip ? 6 : -6) * s} y={y - 118 * s + bob} s={(rider.s ?? 0.9) * s} legs="sit" flip={flip} />
    </g>
  );
  return silhouette ? <g filter="url(#sil)">{body}</g> : body;
};

export const HostShot: React.FC<{ s: Shot; keys: HostKey[]; children?: React.ReactNode; overlay?: React.ReactNode; spot?: { at: number; text?: string; x?: number; y?: number }; x?: number }> = ({ s, keys, children, overlay, spot, x = 1380 }) => (
  <>
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1.035, focus: [x, 500] }}>
      <GreyStage />
      <Layer depth={1}>
        {children}
        <Host x={x} keys={keys} talking={talk(s)} />
      </Layer>
    </CameraRig>
    {spot && <Spotlight {...spot} />}
    {overlay}
  </>
);

/** Text/prop that falls in under gravity and lands with squash (caption slams, signs, sacks). */
export const Drop: React.FC<{ at: number; x: number; y: number; h?: number; children: React.ReactNode; e?: number }> = ({ at, x, y, h = 700, children, e = 0.35 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const d = gravityDrop(f, at, { h, g: 2.4, e });
  return <g transform={`translate(${x} ${y + d.y}) scale(${d.sx} ${d.sy})`}>{children}</g>;
};
export const DropHtml: React.FC<{ at: number; left: number; top: number; h?: number; children: React.ReactNode }> = ({ at, left, top, h = 700, children }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const d = gravityDrop(f, at, { h, g: 2.4, e: 0.3 });
  return <div style={{ position: 'absolute', left, top: top + d.y, transform: `translate(-50%,-50%) scale(${d.sx}, ${d.sy})`, transformOrigin: 'center bottom' }}>{children}</div>;
};

// =============================================================== OPENING / CARDS / END
export const Opening: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [8, 60], [1, 0], Easing.inOut);
  const fill = interpolate(f, [45, 70], [0, 1]);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06, focus: [960, 540] }}>
        <InsertBg />
        <Layer depth={1}><KingdomMap x={1060} y={70} s={0.86} at={0} /></Layer>
      </CameraRig>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <text x={620} y={500} textAnchor="middle" fontFamily="Hand" fontSize={128} fill="#fff" fillOpacity={fill} stroke="#141414" strokeWidth={4} strokeDasharray="1600" strokeDashoffset={1600 * draw} style={{ paintOrder: 'stroke' }}>1000 Years of</text>
        <text x={620} y={650} textAnchor="middle" fontFamily="Hand" fontSize={150} fill="#FFD84A" fillOpacity={fill} stroke="#141414" strokeWidth={4} strokeDasharray="1600" strokeDashoffset={1600 * draw} style={{ paintOrder: 'stroke' }}>Indian History</text>
      </svg>
    </>
  );
};

export const Card: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const [act, ...rest] = (s.title ?? '').split(':');
  const title = rest.join(':').trim() || act;
  const u = interpolate(f, [6, 22], [0, 1], Easing.out);
  const sc = popScale(f, 2);
  return (
    <>
      <CameraRig move={{ zoomFrom: 1, zoomTo: 1 }}>
        <GreyStage />
        <Layer depth={1}>
          <Host x={1640} keys={[{ at: 0, arm: 'idle' }, { at: 6, arm: 'present', expr: 'smile' }]} talking={[]} />
          <path d={`M150 760 L${150 + 1000 * u} 750`} stroke="#B3261E" strokeWidth={8} strokeLinecap="round" />
        </Layer>
      </CameraRig>
      {rest.length > 0 && <div style={{ position: 'absolute', left: 150, top: 250, fontFamily: 'Hand', fontSize: 64, color: '#B3261E', WebkitTextStroke: '2px #B3261E', opacity: u }}>{act}</div>}
      <div style={{ position: 'absolute', left: 150, top: 340, width: 1200, fontFamily: 'Hand', fontSize: title.length > 30 ? 96 : 118, lineHeight: 1.1, color: '#141414', WebkitTextStroke: '3px #141414', transform: `scale(${sc})`, transformOrigin: 'left center' }}>{title}</div>
    </>
  );
};

export const End: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1, zoomTo: 1 }}>
      <GreyStage />
      <Layer depth={1}><Host x={1420} keys={[{ at: 0, arm: 'wave', expr: 'smile' }]} talking={[]} /></Layer>
    </CameraRig>
    <Label text="1000 Years of Indian History" x={640} y={430} at={4} size={84} color="#fff" />
    <Label text="Thanks for watching!" x={640} y={580} at={20} size={70} color="#FFD84A" />
  </>
);

// =============================================================== COLD OPEN
export const Gate: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.12, focus: [600, 620] }}>
      <DelhiGate silhouette />
      <Layer depth={1}>
        <g filter="url(#sil)">
          <Chibi x={interpolate(f, [0, s.dur], [560, 760])} y={780} s={1.1} outfit={PERSIAN} hat="turbanW" beard legs="walk" pose="hold" item="sword" seed="nadir" />
        </g>
      </Layer>
    </CameraRig>
  );
};

export const Train: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04, panFrom: [0, 0], panTo: [40, 0] }}>
      <DesertRoad />
      <Layer depth={0.8}>
        {[...Array(9)].map((_, i) => {
          const sc = 1.1 * Math.pow(0.78, i);
          const x = 1050 - i * 10 + interpolate(f, [0, s.dur], [0, -40 * sc]);
          const y = 1020 - (1 - Math.pow(0.78, i)) * 420;
          return <Camel key={i} x={x - 300 * sc} y={y} s={sc} flip phase={i * 3} silhouette={i > 1} />;
        }).reverse()}
        <CoinBurst x={760} y={800} at={10} seed="tr1" />
        <CoinBurst x={830} y={810} at={40} seed="tr2" n={10} />
      </Layer>
    </CameraRig>
  );
};

export const Train2: React.FC<SP> = ({ s }) => {
  const at = wordAt(s, 'years') + 2;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.04, zoomTo: 1.12, focus: [700, 500], shakes: [{ at: at + 4, amp: 8, len: 8 }] }}>
        <DesertRoad />
        <Layer depth={0.8}>
          {[...Array(9)].map((_, i) => {
            const sc = 1.1 * Math.pow(0.78, i);
            const y = 1020 - (1 - Math.pow(0.78, i)) * 420;
            return <Camel key={i} x={1010 - 300 * sc - i * 10} y={y} s={sc} flip phase={i * 3} silhouette={i > 1} />;
          }).reverse()}
        </Layer>
      </CameraRig>
      <DropHtml at={at} left={960} top={330} h={500}>
        <div style={{ background: '#B3261E', color: '#fff', fontFamily: 'TagBold', fontSize: 74, padding: '14px 40px', border: '6px solid #141414', borderRadius: 8, transform: 'rotate(-4deg)', whiteSpace: 'nowrap', boxShadow: '8px 10px 0 rgba(0,0,0,0.3)' }}>PERSIA — NO TAXES FOR 3 YEARS</div>
      </DropHtml>
    </>
  );
};

export const NotBritish: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const a = wordAt(s, 'british'), b = wordAt(s, 'mongol');
  const X: React.FC<{ at: number; x: number; y: number; label: string }> = ({ at, x, y, label }) => {
    const k = popScale(f, at);
    const cross = interpolate(f, [at + 6, at + 12], [0, 1]);
    return k > 0 ? (
      <g transform={`translate(${x} ${y}) scale(${k * 1.25})`}>
        <rect x={-130} y={-50} width={260} height={100} rx={10} fill="#F4EEDD" stroke={OL} strokeWidth={5} />
        <text x={0} y={18} textAnchor="middle" fontFamily="Hand" fontSize={52} fill="#141414">{label}</text>
        <path d={`M-120 -46 L${-120 + 240 * cross} ${-46 + 92 * cross} M120 -46 L${120 - 240 * cross} ${-46 + 92 * cross}`} stroke="#B3261E" strokeWidth={12} strokeLinecap="round" />
      </g>
    ) : null;
  };
  return (
    <HostShot s={s} x={1080} keys={[{ at: 0, arm: 'finger' }, { at: a, arm: 'point' }, { at: b, arm: 'shrug', expr: 'worried' }]}>
      <X at={a} x={1520} y={400} label="British" />
      <X at={b} x={1520} y={580} label="Mongol" />
    </HostShot>
  );
};

export const Worst: React.FC<SP> = ({ s }) => (
  <HostShot s={s} keys={[{ at: 0, arm: 'finger' }, { at: wordAt(s, 'worst') - 2, arm: 'idle', expr: 'shock' }]} spot={{ at: wordAt(s, 'worst') - 4, text: 'worse?', x: 1700, y: 170 }} />
);

export const PieShot: React.FC<{ s: Shot; from: number; to: number; yearFrom: number; yearTo: number; at?: number; len?: number }> = ({ s, from, to, yearFrom, yearTo, at = 6, len = 40 }) => {
  const f = useCurrentFrame();
  const k = spring(Math.max(0, f - at), { damping: 18, stiffness: 60 });
  const share = from + (to - from) * Math.min(1, k);
  const year = Math.round(interpolate(f, [at, at + len], [yearFrom, yearTo], Easing.inOut));
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
        <InsertBg />
        <Layer depth={1}><GdpPie x={960} y={470} r={320} share={share} /></Layer>
      </CameraRig>
      <div style={{ position: 'absolute', left: 1380, top: 110, fontFamily: 'TagBold', fontSize: 72, color: '#FFD84A' }}>{year}</div>
      <div style={{ position: 'absolute', left: 1380, top: 210, fontFamily: 'Hand', fontSize: 48, color: '#fff', whiteSpace: 'nowrap' }}>India's share of</div>
      <div style={{ position: 'absolute', left: 1380, top: 266, fontFamily: 'Hand', fontSize: 48, color: '#fff', whiteSpace: 'nowrap' }}>the world economy</div>
      <div style={{ position: 'absolute', left: 1380, top: 340, fontFamily: 'TagBold', fontSize: 120, color: '#E8862A', WebkitTextStroke: '4px #141414', paintOrder: 'stroke fill' }}>{(share * 100).toFixed(share < 0.1 ? 1 : 0)}%</div>
    </>
  );
};
export const Pie1: React.FC<SP> = ({ s }) => <PieShot s={s} from={0.0} to={0.28} yearFrom={1000} yearTo={1000} at={4} />;
export const Pie2: React.FC<SP> = ({ s }) => <PieShot s={s} from={0.28} to={0.244} yearFrom={1000} yearTo={1700} at={4} len={30} />;
export const Pie3: React.FC<SP> = ({ s }) => <PieShot s={s} from={0.244} to={0.244} yearFrom={1700} yearTo={1700} />;
export const Pie4: React.FC<SP> = ({ s }) => <PieShot s={s} from={0.244} to={0.042} yearFrom={1700} yearTo={1950} at={6} len={50} />;

export const Looted: React.FC<SP> = ({ s }) => {
  const words = ['invaded', 'looted', 'split', 'starved'];
  const f = useCurrentFrame();
  return (
    <HostShot s={s} x={1720} keys={[{ at: 0, arm: 'idle', expr: 'worried' }, { at: wordAt(s, 'split'), arm: 'shrug' }]}
      overlay={<>{words.map((w, i) => {
        const at = wordAt(s, w);
        const k = popScale(f, at);
        return k > 0 ? <div key={w} style={{ position: 'absolute', left: 1200 + (i % 2) * 180, top: 300 + i * 130, transform: `translate(-50%,-50%) rotate(${(i % 2 ? 6 : -6)}deg) scale(${k})`, fontFamily: 'TagBold', fontSize: 54, color: '#fff', background: '#141414', padding: '6px 22px', borderRadius: 6 }}>{w.toUpperCase()}</div> : null;
      })}</>}
    />
  );
};

export const Populous: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'most');
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at, arm: 'fist', expr: 'proud' }]}
      overlay={popScale(f, at) > 0 ? <div style={{ position: 'absolute', left: 1700, top: 340, transform: `translate(-50%,-50%) scale(${popScale(f, at)})`, fontFamily: 'TagBold', fontSize: 130, color: '#B3261E', textAlign: 'center' }}>#1<div style={{ fontFamily: 'Hand', fontSize: 56, color: '#141414' }}>most people</div></div> : null} />
  );
};
export const Populous2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const h = (i: number) => interpolate(f, [10 + i * 5, 26 + i * 5], [0, 70 + i * 70], Easing.outBack);
  return (
    <HostShot s={s} x={1300} keys={[{ at: 0, arm: 'point', expr: 'proud' }]}>
      <g transform="translate(1520 760)">
        {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 70} y={-h(i)} width={50} height={h(i)} fill="#E8862A" stroke={OL} strokeWidth={4} />)}
        <path d={`M-10 ${-40} L${270 * Math.min(1, f / 40)} ${-40 - 280 * Math.min(1, f / 40)}`} stroke="#2E9A4A" strokeWidth={10} strokeLinecap="round" />
        <path d="M0 0 H300" stroke={OL} strokeWidth={5} />
      </g>
    </HostShot>
  );
};

export const HowQ: React.FC<SP> = ({ s }) => (
  <HostShot s={s} keys={[{ at: 0, arm: 'chin', expr: 'normal' }, { at: wordAt(s, 'robbed'), arm: 'shrug', expr: 'shock' }]} />
);
export const HowQ2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  // a little figure gets knocked over and springs back upright (physics wobble)
  const hits = [8, 30, 52];
  let ang = 0;
  hits.forEach((h) => { const t = f - h; if (t >= 0) ang += -70 * Math.exp(-t / 9) * Math.cos(t / 3.2); });
  return (
    <HostShot s={s} x={1300} keys={[{ at: 0, arm: 'present', expr: 'smile' }]}>
      <g transform={`translate(1700 900) rotate(${ang})`}>
        <ellipse cx={0} cy={0} rx={70} ry={26} fill="#C9A06A" stroke={OL} strokeWidth={4} />
        <path d="M-50 0 Q-60 -150 0 -200 Q60 -150 50 0 Z" fill="#E8862A" stroke={OL} strokeWidth={5} />
        <circle cx={0} cy={-210} r={40} fill="#F6D2A8" stroke={OL} strokeWidth={5} />
        <circle cx={-12} cy={-214} r={5} fill={OL} /><circle cx={14} cy={-214} r={5} fill={OL} />
        <path d="M-12 -194 Q0 -184 12 -194" stroke={OL} strokeWidth={4} fill="none" />
      </g>
    </HostShot>
  );
};

export const Coast: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.15, zoomTo: 1.0, focus: [1300, 400] }}><SomnathCoast /></CameraRig>
);
export const Coast2: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.08, focus: [1400, 300] }}><SomnathCoast /></CameraRig>
);

// =============================================================== ACT 1
export const NotCountry: React.FC<SP> = ({ s }) => (
  <HostShot s={s} keys={[{ at: 0, arm: 'finger' }, { at: wordAt(s, 'not'), arm: 'shrug', expr: 'worried' }]} spot={{ at: wordAt(s, 'not') - 2, text: 'no country', x: 1700, y: 170 }} />
);
export const BeClear: React.FC<SP> = ({ s }) => (
  <HostShot s={s} keys={[{ at: 0, arm: 'present' }, { at: 40, arm: 'finger', expr: 'normal' }]} />
);
export const Map1: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 0.95, zoomTo: 1.05 }}>
    <InsertBg />
    <Layer depth={1}><KingdomMap x={500} y={-10} s={0.9} at={4} /></Layer>
  </CameraRig>
);
export const Map2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const langs: [string, number, number][] = [['Kashmiri', 360, 70], ['Sindhi', 150, 420], ['Gujarati', 140, 540], ['Marathi', 330, 650], ['Kannada', 330, 830], ['Tamil', 420, 990], ['Telugu', 480, 760], ['Odia', 650, 590], ['Bengali', 790, 430]];
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.1, zoomTo: 1.1 }}>
        <InsertBg />
        <Layer depth={1}><KingdomMap x={500} y={-10} s={0.9} /></Layer>
      </CameraRig>
      {langs.map(([l, mx, my], i) => {
        const at = wordAt(s, 'dozens') + i * 3;
        const k = popScale(f, at);
        return k > 0 ? <div key={l} style={{ position: 'absolute', left: 960 + (500 + mx * 0.9 - 960) * 1.1, top: 540 + (-10 + my * 0.9 - 540) * 1.1, transform: `translate(-50%,-50%) scale(${k}) rotate(${(random('lr' + i) - 0.5) * 16}deg)`, fontFamily: 'Hand', fontSize: 40, color: '#fff', WebkitTextStroke: '6px #141414', paintOrder: 'stroke fill' }}>{l}</div> : null;
      })}
    </>
  );
};

export const Rajputs: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06, focus: [900, 600] }}>
      <RajputFort />
      <Layer depth={1}>
        {['#C0392B', '#E8862A', '#D4A017', '#8E44AD', '#2E86C1'].map((c, i) => (
          <Chibi key={i} x={460 + i * 250} y={980 - (i % 2) * 20} s={1.0} outfit={RAJPUT(c)} hat="pagri" hatColor={c} mustache item="sword" itemL="shield" pose={[{ at: 0, pose: 'idle' }, { at: 14 + i * 4, pose: 'raise' }]} expr={[{ at: 0, expr: 'determined' }, { at: 20 + i * 4, expr: 'grin' }]} seed={'rj' + i} flip={i > 2} />
        ))}
      </Layer>
    </CameraRig>
    <Label text="Rajputs" x={960} y={140} at={wordAt(s, 'rajputs')} size={80} color="#FFD84A" />
  </>
);
export const Rajputs2: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.06, zoomTo: 1.18, focus: [960, 640], push: { at: 30, to: 1.06, len: 8 } }}>
    <RajputFort />
    <Layer depth={1}>
      <Rider x={960} y={980} s={1.0} gait="idle" horse="#F4F7FA" rider={{ outfit: RAJPUT('#C0392B'), hat: 'pagri', hatColor: '#C0392B', mustache: true, item: 'sword', pose: [{ at: 0, pose: 'idle' }, { at: 30, pose: 'raise' }], expr: [{ at: 0, expr: 'determined' }], seed: 'rjr' }} />
    </Layer>
  </CameraRig>
);

export const RajFight: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const fling = 58;
  const p = projectile(f, fling, [960, 760], [17, -30], 1.4);
  const flying = f >= fling;
  // turban knocked off: projectile then bounce
  const tb = f >= fling + 4 ? gravityDrop(f, fling + 4, { h: 520, g: 1.8, e: 0.5 }) : null;
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04, focus: [960, 640], shakes: [12, 22, 30, 44].map((at) => ({ at, amp: 4 })) }}>
      <RajputFort />
      <Layer depth={1}>
        {/* dust-cloud brawl */}
        {[...Array(9)].map((_, i) => {
          const r = 110 + Math.sin(f / 3 + i) * 18;
          return <circle key={i} cx={960 + Math.cos(i * 0.7 + f / 8) * 120} cy={820 + Math.sin(i * 1.3 + f / 6) * 50} r={r} fill="#E8DCC0" stroke={OL} strokeWidth={4} />;
        })}
        {[...Array(6)].map((_, i) => {
          const a = (onTwos(f, 3) * 0.9 + i * 1.1);
          return <path key={i} d={`M${960 + Math.cos(a) * 140} ${800 + Math.sin(a) * 70} l${Math.cos(a + 1) * 60} ${Math.sin(a + 1) * 60}`} stroke="#C9D0D6" strokeWidth={8} strokeLinecap="round" />;
        })}
        {[...Array(5)].map((_, i) => (
          <text key={i} x={860 + i * 50 + Math.sin(f + i) * 20} y={760 + Math.cos(f / 2 + i) * 30} fontFamily="TagBold" fontSize={40} fill="#B3261E">{['!', '#', '@', '!', '*'][i]}</text>
        ))}
        {flying && p.y < 1300 && (
          <g transform={`translate(${p.x} ${p.y}) rotate(${(f - fling) * 18})`}>
            <Chibi x={0} y={110} s={0.8} outfit={RAJPUT('#8E44AD')} hat="none" hair="#1E1612" mustache pose="bothUp" expr="shock" seed="flung" />
          </g>
        )}
        {tb && <g transform={`translate(${1120 + Math.min(40, (f - fling - 4) * 2)} ${880 + tb.y}) scale(${tb.sx} ${tb.sy})`}>
          <path d="M-56 -4 Q-62 -60 0 -64 Q62 -60 56 -4 Q0 -22 -56 -4 Z" fill="#8E44AD" stroke={OL} strokeWidth={3.5} />
        </g>}
        <Chibi x={640} y={1000} s={0.9} outfit={RAJPUT('#2E86C1')} hat="pagri" hatColor="#2E86C1" mustache pose="cross" expr="angry" seed="watch1" />
        <Chibi x={1320} y={1000} s={0.9} outfit={RAJPUT('#D4A017')} hat="pagri" hatColor="#D4A017" mustache item="sword" pose="attack" expr="angry" seed="watch2" flip />
      </Layer>
    </CameraRig>
  );
};

export const Honour: React.FC<SP> = ({ s }) => (
  <HostShot s={s} keys={[{ at: 0, arm: 'finger', expr: 'proud' }, { at: wordAt(s, 'fair'), arm: 'present' }, { at: wordAt(s, 'warning'), arm: 'point' }]} />
);
export const Honour2: React.FC<SP> = ({ s }) => (
  <HostShot s={s} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at: 30, arm: 'hip' }]} />
);
export const Expensive: React.FC<SP> = ({ s }) => {
  const at = wordAt(s, 'expensive') + 2;
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at, arm: 'shrug', expr: 'shock' }]}>
      <Drop at={at} x={1760} y={960} h={900}>
        <g>
          <path d="M-90 0 Q-110 -110 -40 -150 L-50 -180 L50 -180 L40 -150 Q110 -110 90 0 Z" fill="#C9A47A" stroke={OL} strokeWidth={5} />
          <text x={0} y={-50} textAnchor="middle" fontFamily="TagBold" fontSize={70} fill="#5A3E26">$$</text>
        </g>
      </Drop>
    </HostShot>
  );
};

export const Ghazni: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.1, focus: [1100, 600], push: { at: wordAt(s, 'noticed'), to: 1.12, len: 8 } }}>
      <Passes />
      <Layer depth={1}>
        <Rider x={1100} y={960} s={1.05} horse="#3A2A22" rider={{ outfit: MAHMUD, hat: 'turbanW', beard: true, item: 'none', pose: [{ at: 0, pose: 'idle' }, { at: wordAt(s, 'noticed'), pose: 'point' }], expr: [{ at: 0, expr: 'normal' }, { at: wordAt(s, 'noticed') + 2, expr: 'grin' }], seed: 'mahmud' }} />
        <Chibi x={760} y={980} s={0.85} outfit={GHURID_SOLDIER} hat="ghurid" item="spear" seed="gz1" />
      </Layer>
    </CameraRig>
    <Label text="Mahmud of Ghazni" x={1300} y={160} at={wordAt(s, 'mahmud')} size={64} color="#FFD84A" />
  </>
);

export const Vault1: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'banks');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06 }}><TempleVault /></CameraRig>
      {f > at && <DropHtml at={at} left={960} top={160} h={300}><div style={{ background: '#F4EEDD', border: '6px solid #141414', fontFamily: 'TagBold', fontSize: 64, padding: '10px 36px', color: '#141414', transform: 'rotate(-3deg)' }}>BANK</div></DropHtml>}
    </>
  );
};
export const Vault2: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.06, zoomTo: 1.12, focus: [960, 820] }}>
    <TempleVault />
    <Layer depth={1}>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Chibi x={interpolate(useCurrentFrame(), [0, 60], [-100 - i * 160, 300 - i * 160], Easing.out)} y={1040} s={0.9} outfit={RAJPUT(['#C0392B', '#2E86C1', '#D4A017'][i])} hat="crown" mustache legs="walk" item="sack" pose="carry" seed={'kd' + i} />
        </g>
      ))}
      <CoinBurst x={520} y={800} at={14} seed="v2a" /><CoinBurst x={1400} y={810} at={34} seed="v2b" />
    </Layer>
  </CameraRig>
);
export const Vault3: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.12, zoomTo: 1.25, focus: [960, 480] }}><TempleVault /></CameraRig>
);

export const Raid1: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04, panFrom: [-60, 0], panTo: [60, 0] }}>
      <Passes />
      <Layer depth={1}>
        {[0, 1, 2, 3].map((i) => (
          <Rider key={i} x={interpolate(f, [0, s.dur], [-200 - i * 260, 1500 - i * 260])} y={980 - (i % 2) * 30} s={0.8} gait="gallop" phase={i * 4} horse={['#3A2A22', '#8A5A3A', '#5A4636', '#2A1E1A'][i]}
            rider={{ outfit: i === 0 ? MAHMUD : GHURID_SOLDIER, hat: i === 0 ? 'turbanW' : 'ghurid', beard: i === 0, item: i === 0 ? 'sword' : 'spear', pose: 'hold', expr: i === 0 ? 'grin' : 'determined', seed: 'rr' + i }} />
        ))}
      </Layer>
    </CameraRig>
  );
};
export const Raid2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const a = 10, b = wordAt(s, 'again') + 30;
  const n = f < a ? 1 : f < b ? 2 : 3;
  const bump = f < a ? f : f < b ? f - a : f - b;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}><TempleVault emptied={interpolate(f, [0, s.dur], [0.2, 0.7])} />
        <Layer depth={1}><CoinBurst x={760} y={820} at={a} seed="r2a" /><CoinBurst x={1160} y={830} at={b} seed="r2b" /></Layer>
      </CameraRig>
      <Tally text={`RAID ${n} OF 17`} bump={bump} />
    </>
  );
};
export const Raid17: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const n = Math.min(17, 3 + Math.floor(Math.max(0, f - 6) / 2.2));
  const done = 3 + 14 * 2.2 + 6;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.1, shakes: [{ at: Math.round(done) + 2, amp: 7 }] }}>
        <TempleVault emptied={interpolate(f, [0, 30], [0.7, 1])} />
        <Layer depth={1}>{[...Array(5)].map((_, i) => <CoinBurst key={i} x={500 + i * 230} y={800} at={6 + i * 5} n={6} seed={'r17' + i} />)}</Layer>
      </CameraRig>
      <Tally text={`RAID ${n} OF 17`} bump={f < done ? (f % 2) : f - Math.round(done)} />
      {f > done && <div style={{ position: 'absolute', left: 960, top: 420, transform: `translate(-50%,-50%) scale(${popScale(f, Math.round(done))})`, fontFamily: 'TagBold', fontSize: 220, color: '#FFD84A', WebkitTextStroke: '8px #141414', paintOrder: 'stroke fill' }}>17</div>}
    </>
  );
};

export const Somnath: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06, focus: [1350, 400] }}><SomnathCoast /></CameraRig>
    <Label text="Somnath" x={1400} y={110} at={wordAt(s, 'somnath')} size={70} color="#FFD84A" />
  </>
);
export const Somnath2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.06, zoomTo: 1.0, focus: [1000, 500] }}>
      <SomnathCoast />
      <Layer depth={1}>
        {[0, 1, 2].map((i) => <Rider key={i} x={interpolate(f, [0, s.dur], [-300 - i * 220, 500 - i * 220], Easing.out)} y={1000} s={0.75} gait={f < s.dur * 0.8 ? 'walk' : 'idle'} phase={i * 3} horse="#3A2A22" rider={{ outfit: i ? GHURID_SOLDIER : MAHMUD, hat: i ? 'ghurid' : 'turbanW', beard: !i, pose: 'hold', item: i ? 'spear' : 'none', seed: 'sm' + i }} />)}
      </Layer>
    </CameraRig>
  );
};
export const Somnath3: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05, panFrom: [40, 0], panTo: [-60, 0] }}>
      <SomnathCoast />
      <Layer depth={1}>
        {[0, 1, 2, 3, 4].map((i) => <Camel key={i} x={interpolate(f, [0, s.dur], [900 - i * 220, 300 - i * 220])} y={1010} s={0.85} flip phase={i * 4} />)}
        <CoinBurst x={860} y={800} at={10} seed="sm3" />
      </Layer>
    </CameraRig>
  );
};
export const Empire: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.08, focus: [960, 560] }}>
      <Passes />
      <Layer depth={1}>
        {/* Ghazni rises: buildings spring up out of the ground with overshoot */}
        {[[620, 300, 220], [900, 420, 260], [1200, 340, 200], [1420, 260, 180]].map(([x, h, w], i) => {
          const k = spring(Math.max(0, f - 12 - i * 6), { damping: 10, stiffness: 140 });
          return (
            <g key={i} transform={`translate(${x} 900) scale(1 ${k})`}>
              <rect x={-w / 2} y={-h} width={w} height={h} fill="#D8C2A0" stroke={OL} strokeWidth={4} />
              <path d={`M${-w / 2 - 10} ${-h} Q0 ${-h - w * 0.9} ${w / 2 + 10} ${-h} Z`} fill="#2E9A8A" stroke={OL} strokeWidth={4} />
              <rect x={-20} y={-80} width={40} height={80} rx={20} fill="#6B4A2B" stroke={OL} strokeWidth={3} />
            </g>
          );
        })}
        <Chibi x={300} y={1000} s={1.0} outfit={MAHMUD} hat="turbanW" beard pose="cheer" expr="grin" seed="mahmud2" />
      </Layer>
    </CameraRig>
  );
};

export const NeverStay: React.FC<SP> = ({ s }) => (
  <HostShot s={s} keys={[{ at: 0, arm: 'finger' }, { at: wordAt(s, 'came'), arm: 'point' }, { at: wordAt(s, 'home'), arm: 'wave', expr: 'smile' }]} />
);
export const Seventeen: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'idle', expr: 'shock' }, { at: 30, arm: 'shrug' }]}>
      {[...Array(17)].map((_, i) => (
        <Drop key={i} at={6 + i * 2} x={1520 + (i % 6) * 64 - (Math.floor(i / 6) % 2) * 32} y={960 - Math.floor(i / 6) * 60} h={900 + i * 20} e={0.3}>
          <g><path d="M-30 0 Q-36 -40 -12 -54 L-14 -64 L14 -64 L12 -54 Q36 -40 30 0 Z" fill="#C9A47A" stroke={OL} strokeWidth={3} /><circle cy={-30} r={8} fill="#E2B13C" /></g>
        </Drop>
      ))}
      <text x={1700} y={560} textAnchor="middle" fontFamily="TagBold" fontSize={120} fill="#B3261E" opacity={f > 40 ? 1 : 0}>×17</text>
    </HostShot>
  );
};

export const Kings: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const g = Math.round(s.dur * 0.5);
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
      <InsertBg glow={false} />
      <Layer depth={1}>
        {[...Array(12)].map((_, i) => {
          const row = Math.floor(i / 6), col = i % 6;
          const x = 260 + col * 280 + row * 140, y = 560 + row * 330;
          const c = ['#C0392B', '#2E86C1', '#D4A017', '#8E44AD', '#16A085', '#E8862A'][(i * 5) % 6];
          return (
            <g key={i}>
              <rect x={x - 70} y={y - 240} width={140} height={210} rx={20} fill="#8C1D18" stroke={OL} strokeWidth={3} />
              <rect x={x - 90} y={y - 40} width={180} height={40} fill="#E2B13C" stroke={OL} strokeWidth={3} />
              <Chibi x={x} y={y + 10} s={0.62} outfit={RAJPUT(c)} hat="crown" mustache legs="sit" pose={[{ at: 0, pose: 'idle' }, { at: g + i * 2, pose: 'shrug' }]} expr={[{ at: 0, expr: 'normal' }, { at: g + i * 2, expr: 'worried' }]} seed={'kg' + i} flip={i % 2 === 1} />
            </g>
          );
        })}
      </Layer>
    </CameraRig>
  );
};
export const Kings2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.05, zoomTo: 0.9 }}>
        <InsertBg glow={false} />
        <Layer depth={1}>
          {[...Array(30)].map((_, i) => {
            const x = 140 + (i % 10) * 180, y = 330 + Math.floor(i / 10) * 300;
            return <Chibi key={i} x={x} y={y + 200} s={0.5} outfit={RAJPUT(['#C0392B', '#2E86C1', '#D4A017', '#8E44AD', '#16A085'][i % 5])} hat="crown" mustache pose={[{ at: 0, pose: 'shrug' }, { at: 20 + (i % 7) * 3, pose: 'point' }]} expr="worried" seed={'k2' + i} flip={i % 2 === 0} />;
          })}
        </Layer>
      </CameraRig>
      <Label text="'Somebody else's problem'" x={960} y={120} at={wordAt(s, 'problem')} size={60} color="#FFD84A" />
    </>
  );
};

export const Ghori: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05, panFrom: [-80, 0], panTo: [40, 0] }}>
      <Passes />
      <Layer depth={1}>
        {[0, 1, 2].map((i) => <Rider key={i} x={interpolate(f, [0, s.dur], [-300 - i * 260, 1100 - i * 260], Easing.out)} y={980 - (i % 2) * 24} s={0.85} gait={f < s.dur * 0.85 ? 'gallop' : 'idle'} phase={i * 5} horse={['#2A1E1A', '#5A4636', '#8A5A3A'][i]} rider={{ outfit: i === 0 ? GHORI : GHURID_SOLDIER, hat: 'ghurid', beard: i === 0, item: 'spear', pose: 'hold', expr: 'determined', seed: 'gh' + i }} />)}
      </Layer>
    </CameraRig>
  );
};
export const Ghori2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = wordAt(s, 'gold');
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.1, zoomTo: 1.16, focus: [900, 600] }}>
        <Passes />
        <Layer depth={1}>
          <Chibi x={900} y={1000} s={1.25} outfit={GHORI} hat="ghurid" beard pose={[{ at: 0, pose: 'cross' }, { at: at, pose: 'present' }]} expr={[{ at: 0, expr: 'determined' }, { at, expr: 'angry' }]} talking={talk(s)} seed="ghori" />
          {/* a sack of gold offered — pushed away, flies off on an arc */}
          {(() => { const p = projectile(f, at + 4, [1120, 820], [16, -22], 1.4); return f < at + 4 ? <g transform="translate(1120 820)"><path d="M-40 40 Q-50 -10 -16 -30 L-20 -44 L20 -44 L16 -30 Q50 -10 40 40 Z" fill="#C9A47A" stroke={OL} strokeWidth={4} /></g> : p.y < 1300 ? <g transform={`translate(${p.x} ${p.y}) rotate(${(f - at) * 14})`}><path d="M-40 40 Q-50 -10 -16 -30 L-20 -44 L20 -44 L16 -30 Q50 -10 40 40 Z" fill="#C9A47A" stroke={OL} strokeWidth={4} /></g> : null; })()}
        </Layer>
      </CameraRig>
      <Label text="Muhammad Ghori" x={560} y={150} at={wordAt(s, 'muhammad')} size={64} color="#FFD84A" />
    </>
  );
};
export const Land: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const at = 6;
  const d = gravityDrop(f, at, { h: 600, g: 2.6, e: 0.15, maxBounces: 1 });
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.1, focus: [1100, 700], shakes: [{ at: at + 21, amp: 9, len: 8 }] }}>
      <Plain tents={false} />
      <Layer depth={1}>
        <Chibi x={700} y={1000} s={1.15} outfit={GHORI} hat="ghurid" beard pose={[{ at: 0, pose: 'idle' }, { at: at + 22, pose: 'point' }]} expr={[{ at: 0, expr: 'determined' }, { at: at + 22, expr: 'grin' }]} seed="ghori3" />
        <g transform={`translate(1180 ${900 + d.y}) scale(${d.sx} ${d.sy})`}>
          <line x1={0} y1={0} x2={0} y2={-420} stroke="#6B4A2B" strokeWidth={10} />
          <path d={`M4 -420 L${190 + Math.sin(onTwos(f) / 4) * 10} -380 L4 -330 Z`} fill="#2E6B3A" stroke={OL} strokeWidth={4} />
        </g>
        {f > at + 20 && <ellipse cx={1180} cy={905} rx={90 + Math.min(40, (f - at - 20) * 6)} ry={14} fill="#8A7A50" opacity={Math.max(0, 1 - (f - at - 20) / 20)} />}
      </Layer>
    </CameraRig>
  );
};

export const Prithviraj: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.1, focus: [960, 620], push: { at: wordAt(s, 'prithviraj'), to: 1.1, len: 8 } }}>
      <RajputFort />
      <Layer depth={1}>
        <Rider x={980} y={990} s={1.1} horse="#F4F7FA" rider={{ outfit: PRITHVI, hat: 'pagri', hatColor: '#C0392B', mustache: true, item: 'sword', pose: [{ at: 0, pose: 'idle' }, { at: wordAt(s, 'prithviraj'), pose: 'raise' }], expr: [{ at: 0, expr: 'determined' }, { at: wordAt(s, 'prithviraj') + 4, expr: 'grin' }], seed: 'prith' }} />
      </Layer>
    </CameraRig>
    <Label text="Prithviraj Chauhan" x={960} y={150} at={wordAt(s, 'prithviraj')} size={66} color="#FFD84A" />
  </>
);

export const Tarain: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const clash = wordAt(s, 'crushed');
  const gx = interpolate(f, [0, clash], [0, 300], Easing.in);
  const back = f > clash ? interpolate(f, [clash, clash + 30], [0, 500], Easing.out) : 0;
  return (
    <>
      <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05, focus: [960, 700], shakes: [{ at: clash, amp: 10, len: 10 }] }}>
        <Plain tents={false} />
        <Layer depth={1}>
          {[0, 1, 2].map((i) => <Rider key={'r' + i} x={300 + i * 140 + gx} y={960 + (i % 2) * 40} s={0.85} gait={f < clash + 10 ? 'gallop' : 'idle'} phase={i * 4} horse={i === 0 ? '#F4F7FA' : '#8A5A3A'} rider={{ outfit: i === 0 ? PRITHVI : RAJPUT(['#C0392B', '#E8862A', '#2E86C1'][i]), hat: 'pagri', hatColor: ['#C0392B', '#E8862A', '#2E86C1'][i], mustache: true, item: 'sword', pose: 'attack', expr: 'determined', seed: 'tr' + i }} />)}
          {[0, 1, 2].map((i) => <Rider key={'g' + i} x={1500 - i * 140 - gx * 0.6 + back} y={960 + (i % 2) * 40} s={0.85} flip gait="gallop" phase={i * 4 + 2} horse="#3A2A22" rider={{ outfit: i === 0 ? GHORI : GHURID_SOLDIER, hat: 'ghurid', beard: i === 0, item: 'spear', pose: 'hold', expr: f > clash ? 'shock' : 'determined', seed: 'tg' + i }} />)}
          {f > clash && f < clash + 14 && <g transform={`translate(${960 + gx * 0.2} 760) scale(${springPop(f, clash) * 1.6})`}><path d="M0 -90 L24 -26 L90 -30 L36 10 L60 80 L0 36 L-60 80 L-36 10 L-90 -30 L-24 -26 Z" fill="#FFD84A" stroke={OL} strokeWidth={5} /></g>}
        </Layer>
      </CameraRig>
      <Label text="Tarain, 1191" x={960} y={150} at={wordAt(s, 'tarain')} size={66} color="#FFD84A" />
    </>
  );
};

export const Escape: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const helmet = f > 22 ? gravityDrop(f, 22, { h: 240, g: 1.6, e: 0.55 }) : null;
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04, panFrom: [0, 0], panTo: [160, 0] }}>
      <Plain tents={false} />
      <Layer depth={1}>
        <Rider x={interpolate(f, [0, s.dur], [700, 2300])} y={970} s={1.0} flip gait="gallop" horse="#3A2A22" rider={{ outfit: GHORI, hat: 'none', hair: '#1E1612', beard: true, pose: 'bothUp', expr: 'shock', seed: 'esc' }} />
        <Chibi x={interpolate(f, [0, s.dur], [580, 2100])} y={1000} s={0.75} outfit={GHURID_SOLDIER} hat="ghurid" legs="walk" pose="pull" expr="determined" seed="escsold" flip />
        {helmet && <g transform={`translate(${760 + Math.min(80, (f - 22) * 3)} ${930 + helmet.y}) scale(${helmet.sx} ${helmet.sy}) rotate(${Math.min(160, (f - 22) * 9)})`}>
          <path d="M-40 0 Q-36 -40 0 -70 Q36 -40 40 0 Z" fill="#8E95A3" stroke={OL} strokeWidth={4} />
        </g>}
      </Layer>
    </CameraRig>
  );
};

export const Legend: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const k = popScale(f, wordAt(s, 'stories'));
  return (
    <HostShot s={s} keys={[{ at: 0, arm: 'finger' }, { at: wordAt(s, 'honourable'), arm: 'present', expr: 'proud' }]}>
      {k > 0 && <g transform={`translate(1720 520) scale(${k}) rotate(-6)`}>
        <rect x={-150} y={-190} width={300} height={380} rx={8} fill="#7A3A22" stroke={OL} strokeWidth={5} />
        <rect x={-130} y={-170} width={260} height={340} rx={4} fill="none" stroke="#E2B13C" strokeWidth={4} />
        <text x={0} y={-20} textAnchor="middle" fontFamily="Hand" fontSize={48} fill="#F4EEDD">Legends</text>
        <text x={0} y={40} textAnchor="middle" fontFamily="Hand" fontSize={34} fill="#E2B13C">(not quite</text>
        <text x={0} y={80} textAnchor="middle" fontFamily="Hand" fontSize={34} fill="#E2B13C">history)</text>
      </g>}
    </HostShot>
  );
};

/** The sketch: guard (A) reports to Prithviraj (B); Ghori kneels, weeping. */
export const Sketch1: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const A = s.speaker === 'A';
  const id = s.id;
  const guardExpr = id === 's5' ? 'shock' : id === 's9' ? 'shock' : id === 's13' ? 'worried' : 'normal';
  const prExpr = id === 's12' ? 'grin' : id === 's6' || id === 's8' ? 'proud' : 'calm';
  const ghoriExpr = id === 's4' || id === 's8' ? 'shock' : id === 's12' ? 'worried' : 'sad';
  const tearY = (k: number) => ((f + k * 7) % 20) * 3;
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.02, focus: A ? [1300, 640] : [560, 640] }}>
      <TentInterior />
      <Layer depth={1}>
        <Chibi x={560} y={810} s={1.15} outfit={PRITHVI} hat="pagri" hatColor="#C0392B" mustache legs="sit" pose={id === 's4' || id === 's8' ? 'wave' : id === 's12' ? 'fist' : 'cross'} expr={prExpr} talking={A ? [] : talk(s)} seed="prs" />
        <Chibi x={1360} y={1000} s={1.1} outfit={RAJPUT('#D4A017')} hat="pagri" hatColor="#D4A017" mustache item={id === 's13' ? 'notebook' : 'spear'} pose={id === 's13' ? 'scribble' : id === 's5' || id === 's9' ? 'shrug' : 'hold'} expr={guardExpr} talking={A ? talk(s) : []} seed="guard" flip />
        <g>
          <Chibi x={980} y={1010} s={0.95} outfit={GHORI} hat="none" hair="#1E1612" beard legs="kneel" pose="pray" expr={ghoriExpr} seed="ghorik" />
          {ghoriExpr === 'sad' && [0, 1].map((k) => <path key={k} d={`M${962 + k * 36} ${780 + tearY(k)} q6 10 0 16 q-6 -6 0 -16 Z`} fill="#9BD3F0" stroke={OL} strokeWidth={2} />)}
        </g>
      </Layer>
    </CameraRig>
  );
};

export const Dawn: React.FC<SP> = ({ s }) => (
  <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05 }}>
    <Plain dawn />
    <Layer depth={1}>
      <Tent x={500} y={960} s={1.0} closed />
      <Tent x={1300} y={970} s={1.1} closed c="#E8C9A0" />
      <Horse x={900} y={1000} s={0.8} saddle={false} color="#F4F7FA" />
      <Horse x={1720} y={1000} s={0.75} saddle={false} color="#8A5A3A" flip />
    </Layer>
  </CameraRig>
);
export const Dawn2: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (
    <CameraRig move={{ zoomFrom: 1.05, zoomTo: 1.0, shakes: [{ at: 40, amp: 5, len: 12 }] }}>
      <Plain dawn />
      <Layer depth={1}>
        <Tent x={500} y={960} s={1.0} closed />
        <Tent x={1300} y={970} s={1.1} closed c="#E8C9A0" />
        {[0, 1, 2, 3].map((i) => <Rider key={i} x={interpolate(f, [0, s.dur], [-300 - i * 200, 1500 - i * 200])} y={1000 - (i % 2) * 30} s={0.8} gait="gallop" phase={i * 4} horse={['#2A1E1A', '#3A2A22', '#5A4636', '#2A1E1A'][i]} rider={{ outfit: i ? GHURID_SOLDIER : GHORI, hat: 'ghurid', beard: !i, item: 'spear', pose: 'attack', expr: 'grin', seed: 'dw' + i }} />)}
      </Layer>
    </CameraRig>
  );
};
export const Dawn3: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const pop = (k: number) => spring(Math.max(0, f - 6 - k * 5), { damping: 9, stiffness: 160 });
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.05, focus: [800, 600] }}>
      <Plain dawn />
      <Layer depth={1}>
        <Tent x={810} y={860} s={1.5} closed={false} />
        {/* Rajputs stumble out of the tent flap, half-asleep, then shocked */}
        {[0, 1, 2].map((k) => (
          <g key={k} transform={`translate(${740 + k * 70} ${1200 - pop(k) * (330 + (k % 2) * 30)})`}>
            <Chibi x={0} y={0} s={0.95} outfit={RAJPUT('#C0392B')} hat="none" hair="#1E1612" mustache expr={f > 30 ? 'shock' : 'calm'} seed={'sl' + k} />
          </g>
        ))}
      </Layer>
    </CameraRig>
  );
};
export const Lost: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  // banner topples: rotation under gravity (angular acceleration), then bounces on the ground
  const t = Math.max(0, f - 10);
  let ang = 0, w = 0;
  for (let i = 0; i < t; i++) { w += 0.004 + Math.sin((ang * Math.PI) / 180) * 0.9; ang += w; if (ang > 88) { ang = 88; w = -w * 0.25; } }
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.06, shakes: [{ at: 36, amp: 6, len: 8 }] }}>
      <Plain dawn tents={false} />
      <Layer depth={1}>
        <g transform={`translate(1100 960) rotate(${ang})`}>
          <line x1={0} y1={0} x2={0} y2={-460} stroke="#6B4A2B" strokeWidth={10} />
          <path d="M4 -460 L200 -420 L4 -370 Z" fill="#E8862A" stroke={OL} strokeWidth={4} />
        </g>
        <Chibi x={700} y={1000} s={1.1} outfit={PRITHVI} hat="pagri" hatColor="#C0392B" mustache pose="idle" expr="sad" seed="prl" />
      </Layer>
    </CameraRig>
  );
};
export const Handover: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const throwAt = 30;
  const p = projectile(f, throwAt, [800, 700], [14.5, -18], 1.0);
  const caught = f > throwAt + 36;
  return (
    <CameraRig move={{ zoomFrom: 1.0, zoomTo: 1.04 }}>
      <Passes />
      <Layer depth={1}>
        <Chibi x={640} y={1000} s={1.15} outfit={GHORI} hat="ghurid" beard pose={[{ at: 0, pose: 'hold' }, { at: throwAt, pose: 'point' }]} item={f < throwAt ? 'scroll' : undefined} expr="happy" seed="gho4" />
        <Chibi x={1340} y={1000} s={1.1} outfit={AIBAK} hat="turbanW" pose={caught ? 'present' : 'idle'} item={caught ? 'scroll' : undefined} expr={caught ? 'shock' : 'normal'} seed="aibak" flip />
        {f >= throwAt && !caught && <g transform={`translate(${p.x} ${p.y}) rotate(${(f - throwAt) * 20})`}><rect x={-10} y={-34} width={20} height={68} rx={6} fill="#EADDBB" stroke={OL} strokeWidth={3} /></g>}
      </Layer>
    </CameraRig>
  );
};
export const Handover2: React.FC<SP> = ({ s }) => (
  <>
    <CameraRig move={{ zoomFrom: 1.04, zoomTo: 1.2, focus: [1340, 640] }}>
      <Passes />
      <Layer depth={1}>
        <Chibi x={1340} y={1000} s={1.1} outfit={AIBAK} hat="turbanW" pose="present" item="scroll" expr="happy" seed="aibak" flip />
      </Layer>
    </CameraRig>
    <Label text="trusted commander" x={1340} y={180} at={wordAt(s, 'trusted')} size={60} color="#FFD84A" />
  </>
);
export const NotPrince: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const C: React.FC<{ at: number; x: number; t: string }> = ({ at, x, t }) => {
    const k = popScale(f, at), cr = interpolate(f, [at + 8, at + 14], [0, 1]);
    return k > 0 ? <g transform={`translate(${x} 500) scale(${k})`}><text x={0} y={0} textAnchor="middle" fontFamily="Hand" fontSize={64}>{t}</text><path d={`M-110 -30 L${-110 + 220 * cr} ${-30 + 20 * cr}`} stroke="#B3261E" strokeWidth={10} strokeLinecap="round" /></g> : null;
  };
  return (
    <HostShot s={s} x={1180} keys={[{ at: 0, arm: 'finger' }, { at: wordAt(s, 'noble'), arm: 'shrug' }]}>
      <C at={wordAt(s, 'prince')} x={1640} t="prince" />
      <g transform="translate(0 150)"><C at={wordAt(s, 'noble')} x={1640} t="noble" /></g>
    </HostShot>
  );
};
export const Bought: React.FC<SP> = ({ s }) => (
  <HostShot s={s} keys={[{ at: 0, arm: 'idle', expr: 'worried' }, { at: wordAt(s, 'bought'), arm: 'idle', expr: 'shock' }]} spot={{ at: wordAt(s, 'bought') - 2, text: 'a slave?', x: 1700, y: 170 }} />
);

export const SHOTS: Record<string, React.FC<SP>> = {
  opening: Opening, end: End,
  gate: Gate, train: Train, train2: Train2, notbritish: NotBritish, worst: Worst,
  pie1: Pie1, pie2: Pie2, pie3: Pie3, pie4: Pie4, looted: Looted, populous: Populous, populous2: Populous2,
  howq: HowQ, howq2: HowQ2, coast: Coast, coast2: Coast2,
  notcountry: NotCountry, beclear: BeClear, map1: Map1, map2: Map2, rajputs: Rajputs, rajputs2: Rajputs2, rajfight: RajFight,
  honour: Honour, honour2: Honour2, expensive: Expensive, ghazni: Ghazni, vault1: Vault1, vault2: Vault2, vault3: Vault3,
  raid1: Raid1, raid2: Raid2, raid17: Raid17, somnath: Somnath, somnath2: Somnath2, somnath3: Somnath3, empire: Empire,
  neverstay: NeverStay, seventeen: Seventeen, kings: Kings, kings2: Kings2, ghori: Ghori, ghori2: Ghori2, land: Land,
  prithviraj: Prithviraj, tarain: Tarain, escape: Escape, legend: Legend, sketch1: Sketch1,
  dawn: Dawn, dawn2: Dawn2, dawn3: Dawn3, lost: Lost, handover: Handover, handover2: Handover2, notprince: NotPrince, bought: Bought,
};
