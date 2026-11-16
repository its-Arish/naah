/** Compact scene vocabulary for the later eras: one line per caption, built from signs, icons, figures, counters, GIS maps and evidence pictures. */
import React from 'react';
import { cuts, type Part, type PartArgs } from './Cuts';
import { Sign, Txt, Pop, Panel, Tag } from './Kit2';
import { RED, GOLD, INK, D } from './Kit';
import { WorldMap, MapTag, MapPin, QC, camAt, moveCam, P } from '@engine/qgis/QgisMap';
import { Evidence } from '@engine/fx/Evidence';
import { Teach } from '@engine/moves';
import { Chibi } from '@engine/characters/Chibi';
import { W } from '@engine/cast/Wardrobe';
import { talk } from '@engine/kit';
import { interpolate, Easing } from '@engine/lib/core';
import { OL } from '@engine/scenes/Parts';

const host = (a: PartArgs) => a.s.kind === 'HOST';
const CX = (a: PartArgs) => (host(a) ? 1090 : 900);

/** One or two lines of sign text, sized to fit. */
export const Sg: React.FC<{ a: PartArgs; text: string; sub?: string; y?: number; at?: number; bg?: string; c?: string; size?: number; rot?: number; x?: number }> = ({ a, text, sub, y, at = 2, bg, c, size = 64, rot, x }) => {
  const maxW = host(a) ? 430 : 1500;
  const cx = x ?? CX(a);
  const fit = (t: string, sz: number) => Math.min(sz, Math.floor((maxW - 56) / (t.length * 0.62)));
  let lines = [text];
  if (fit(text, size) < size * 0.62 && text.includes(' ')) {
    const w = text.split(' '); let best = 1, bd = 1e9;
    for (let i = 1; i < w.length; i++) { const d = Math.abs(w.slice(0, i).join(' ').length - w.slice(i).join(' ').length); if (d < bd) { bd = d; best = i; } }
    lines = [w.slice(0, best).join(' '), w.slice(best).join(' ')];
  }
  const sz = Math.max(30, Math.min(...lines.map((l) => fit(l, size))));
  const y0 = y ?? (host(a) ? 400 : 430);
  return <>{lines.map((l, i) => <Sign key={i} x={cx} y={y0 + i * sz * 1.75} k={a.pk(at + i * 4)} text={l} sub={i === lines.length - 1 ? sub : undefined} size={sz} bg={bg} c={c} rot={rot} />)}</>;
};

/* ---------- icons (centred on 0,0, about 300 wide) ---------- */
const ST = { stroke: OL, strokeWidth: 6, strokeLinejoin: 'round' as const };
export const ICONS: Record<string, React.ReactNode> = {
  temple: <g><rect x={-180} y={60} width={360} height={30} fill="#CDBB94" {...ST} />{[-140, -70, 0, 70, 140].map((x) => <rect key={x} x={x - 14} y={-70} width={28} height={130} fill="#EFE3C4" {...ST} strokeWidth={4} />)}<path d="M-190 -70 H190 L0 -150 Z" fill="#E2D2A8" {...ST} /></g>,
  crown: <g><path d="M-100 50 L-110 -50 L-55 0 L0 -75 L55 0 L110 -50 L100 50 Z" fill={GOLD} {...ST} />{[-110, 0, 110].map((x) => <circle key={x} cx={x} cy={x === 0 ? -80 : -56} r={12} fill={RED} stroke={OL} strokeWidth={3} />)}</g>,
  scales: <g><line y1={-110} y2={110} stroke="#6B4A2B" strokeWidth={10} strokeLinecap="round" /><line x1={-120} x2={120} y1={-90} y2={-90} stroke="#6B4A2B" strokeWidth={9} strokeLinecap="round" />{[-120, 120].map((x) => <g key={x}><path d={`M${x} -90 L${x - 40} -10 M${x} -90 L${x + 40} -10`} stroke="#6B4A2B" strokeWidth={5} /><path d={`M${x - 55} -10 H${x + 55} Q${x + 40} 40 ${x} 40 Q${x - 40} 40 ${x - 55} -10 Z`} fill={GOLD} {...ST} strokeWidth={5} /></g>)}<rect x={-60} y={104} width={120} height={22} rx={6} fill="#6B4A2B" {...ST} strokeWidth={4} /></g>,
  book: <g><path d="M-170 -100 Q-85 -130 0 -90 Q85 -130 170 -100 V110 Q85 80 0 120 Q-85 80 -170 110 Z" fill="#F4ECD8" {...ST} /><line x1={0} y1={-90} x2={0} y2={120} stroke={OL} strokeWidth={5} />{[-60, -20, 20, 60].map((y) => <g key={y}><line x1={-140} x2={-25} y1={y} y2={y + 6} stroke="#8A7A5A" strokeWidth={5} strokeLinecap="round" /><line x1={25} x2={140} y1={y + 6} y2={y} stroke="#8A7A5A" strokeWidth={5} strokeLinecap="round" /></g>)}</g>,
  scroll: <g><rect x={-150} y={-100} width={300} height={200} rx={14} fill="#EAD9A8" {...ST} />{[-50, -10, 30, 70].map((y) => <line key={y} x1={-110} x2={110} y1={y} y2={y} stroke="#8A6A3A" strokeWidth={6} strokeLinecap="round" strokeDasharray="22 10" />)}<rect x={-170} y={-114} width={30} height={228} rx={14} fill="#B5653A" {...ST} strokeWidth={5} /><rect x={140} y={-114} width={30} height={228} rx={14} fill="#B5653A" {...ST} strokeWidth={5} /></g>,
  menorah: <g><path d="M-120 -80 V0 Q-120 50 -60 50 H60 Q120 50 120 0 V-80 M-60 -80 V0 Q-60 50 0 50 Q60 50 60 0 V-80 M0 -100 V110" fill="none" stroke={GOLD} strokeWidth={14} strokeLinecap="round" /><rect x={-70} y={104} width={140} height={22} rx={6} fill={GOLD} {...ST} strokeWidth={4} />{[-120, -60, 0, 60, 120].map((x) => <path key={x} d={`M${x} ${x === 0 ? -110 : -90} q-14 -26 0 -46 q14 20 0 46 Z`} fill="#F08A2E" stroke={OL} strokeWidth={3} />)}</g>,
  ship: <g><path d="M-190 40 H190 L130 120 H-130 Z" fill="#6B4A2B" {...ST} /><line x1={0} y1={40} x2={0} y2={-150} stroke={OL} strokeWidth={9} /><path d="M10 -140 L140 -20 H10 Z" fill="#F4ECD8" {...ST} /><path d="M-10 -120 L-110 -20 H-10 Z" fill="#E8DCC0" {...ST} /><path d="M-230 130 q40 -22 80 0 t80 0 t80 0 t80 0 t80 0 t80 0" fill="none" stroke="#5A8AB0" strokeWidth={9} strokeLinecap="round" /></g>,
  tent: <g><path d="M-170 100 L0 -90 L170 100 Z" fill="#C9B98A" {...ST} /><path d="M0 -90 L-40 100 H40 Z" fill="#6B5A3A" {...ST} strokeWidth={5} /></g>,
  key: <g><circle cx={-90} cy={0} r={64} fill="none" stroke={GOLD} strokeWidth={26} /><rect x={-30} y={-13} width={220} height={26} fill={GOLD} {...ST} strokeWidth={5} /><rect x={120} y={10} width={22} height={52} fill={GOLD} {...ST} strokeWidth={5} /><rect x={160} y={10} width={22} height={40} fill={GOLD} {...ST} strokeWidth={5} /></g>,
  wall: <g>{[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3].map((c) => <rect key={r + '-' + c} x={-170 + c * 85 + (r % 2) * 42} y={-110 + r * 44} width={84} height={43} fill={['#D9C79A', '#CDBB8A', '#E2D2A8'][(r + c) % 3]} stroke="#7A6A48" strokeWidth={3} />))}</g>,
  star: <g><path d="M0 -110 L95 55 H-95 Z M0 110 L95 -55 H-95 Z" fill="none" stroke="#2F4A7A" strokeWidth={16} strokeLinejoin="round" /></g>,
  coin: <g><circle r={110} fill={GOLD} {...ST} /><circle r={80} fill="none" stroke="#B8902A" strokeWidth={6} /><Txt y={26} t="$" size={100} c="#8A6A1A" /></g>,
  fort: <g><path d="M-170 100 V-40 H-120 V-70 H-80 V-40 H-30 V-70 H10 V-40 H60 V-70 H100 V-40 H170 V100 Z" fill="#C9B07A" {...ST} /><path d="M-30 100 V30 Q-30 0 0 0 Q30 0 30 30 V100 Z" fill="#6B4A2B" {...ST} strokeWidth={5} /></g>,
  sword: <g transform="rotate(-35)"><rect x={-14} y={-150} width={28} height={230} fill="#CFD6DC" {...ST} strokeWidth={5} /><rect x={-70} y={74} width={140} height={20} rx={6} fill={GOLD} {...ST} strokeWidth={5} /><rect x={-10} y={92} width={20} height={64} fill="#6B4A2B" {...ST} strokeWidth={5} /></g>,
  train: <g><rect x={-190} y={-40} width={380} height={110} rx={16} fill="#5A6A78" {...ST} />{[-120, -30, 60, 140].map((x) => <rect key={x} x={x - 26} y={-18} width={52} height={44} rx={6} fill="#CFE8F5" stroke={OL} strokeWidth={4} />)}{[-130, -40, 50, 130].map((x) => <circle key={x} cx={x} cy={84} r={16} fill="#2A2A2A" />)}<line x1={-230} x2={230} y1={104} y2={104} stroke={OL} strokeWidth={8} /></g>,
  plane: <g><path d="M-190 10 L120 -20 Q190 -20 190 0 Q190 20 120 22 L-190 30 Z" fill="#E8EDF2" {...ST} /><path d="M-30 6 L-100 -120 H-60 L40 0 Z M-30 22 L-100 140 H-60 L40 24 Z" fill="#CFD6DC" {...ST} strokeWidth={5} /></g>,
  house: <g><rect x={-120} y={-20} width={240} height={140} fill="#E8D9AE" {...ST} /><path d="M-150 -20 L0 -120 L150 -20 Z" fill="#B5653A" {...ST} /><rect x={-28} y={40} width={56} height={80} fill="#6B4A2B" {...ST} strokeWidth={5} /></g>,
  handshake: <g><path d="M-190 -20 L-80 -60 L10 -20 L90 -60 L190 -20 V40 L90 90 L10 60 L-80 90 L-190 40 Z" fill="#F4D9B0" {...ST} /><path d="M-70 0 l40 30 M-20 -10 l40 30 M30 -10 l40 30" stroke={OL} strokeWidth={6} strokeLinecap="round" /></g>,
  fence: <g>{[...Array(9)].map((_, i) => <rect key={i} x={-190 + i * 46} y={-90} width={22} height={190} fill="#8A8F96" {...ST} strokeWidth={4} />)}<rect x={-200} y={-50} width={400} height={16} fill="#6A7078" {...ST} strokeWidth={4} /><rect x={-200} y={30} width={400} height={16} fill="#6A7078" {...ST} strokeWidth={4} /></g>,
  tower: <g><rect x={-60} y={-130} width={120} height={250} fill="#C9C4B8" {...ST} />{[-80, -20, 40, 90].map((y) => <rect key={y} x={-20} y={y - 14} width={40} height={24} fill="#6E7A86" stroke={OL} strokeWidth={3} />)}</g>,
  dove: <g><path d="M-150 20 Q-60 -80 40 -30 Q90 -100 160 -90 Q130 -30 70 0 Q50 70 -40 70 Q-100 70 -150 20 Z" fill="#F8F8F4" {...ST} /><circle cx={40} cy={-26} r={6} fill={INK} /></g>,
  tree: <g><rect x={-18} y={20} width={36} height={100} fill="#6B4A2B" {...ST} strokeWidth={5} /><circle cy={-30} r={100} fill="#6FA86A" {...ST} /><circle cx={-60} cy={10} r={55} fill="#5E9A5A" {...ST} strokeWidth={5} /></g>,
  hourglass: <g><path d="M-80 -120 H80 L12 0 L80 120 H-80 L-12 0 Z" fill="#F4E6B8" {...ST} /><path d="M-40 100 H40 L0 40 Z" fill="#D9A93C" /></g>,
  question: <g><Txt y={90} t="?" size={300} c={INK} /></g>,
};

type Sty = { bg?: string; bgc?: string };
const sc = (n: number, base: number, a: PartArgs) => (host(a) ? base * 0.72 : base);

/** Sign only. */
const KW: [RegExp, string][] = [[/TEMPLE|SYNAGOGUE|CHURCH/, 'temple'], [/KING|CROWN|EMPIRE|EMPEROR/, 'crown'], [/BOOK|PAMPHLET|DECLARATION|WHITE PAPER|LETTER|DECREE/, 'book'], [/WALL|BARRIER/, 'wall'], [/SHIP|SEA/, 'ship'], [/TENT|CAMP/, 'tent'], [/KEY|DOOR/, 'key'], [/MONEY|COIN|TAX/, 'coin'], [/TREATY|HANDSHAKE|PEACE|RECOGNI/, 'handshake'], [/COURT|JUSTICE|LAW|ILLEGAL/, 'scales'], [/WAR|ATTACK|INVADE|REVOLT|FIGHT|STRIKE|MILITIA|IRGUN|HAGANAH|RAID|CRUSH/, 'sword'], [/HOME|HOUSE|VILLAGE/, 'house'], [/PLANE|HIJACK|AIR FORCE/, 'plane'], [/BORDER|FENCE|BLOCKADE/, 'fence'], [/MENORAH|LIGHTS|HANUKKAH/, 'menorah'], [/\?/, 'question']];
const decor = (text: string, a: PartArgs): React.ReactNode => {
  const yr = text.match(/\b(1[0-9]{3}|20[0-9]{2})\b/);
  const y = host(a) ? 680 : 640;
  if (yr) return <g opacity={0.22}><Txt x={CX(a)} y={y + 80} t={yr[1]} size={host(a) ? 170 : 300} c="#6B5A3A" /></g>;
  const k = KW.find(([re]) => new RegExp('\\b(?:' + re.source + ')\\b').test(text.toUpperCase()));
  return k ? <Pop k={a.pk(10)} x={CX(a)} y={y} ><g transform={`scale(${host(a) ? 0.9 : 1.3})`}>{ICONS[k[1]]}</g></Pop> : null;
};
export const T = (text: string, sub?: string, o: { bg?: string; c?: string; size?: number; dark?: boolean } = {}): Part => ({
  at: 0, bg: o.dark ? 'dark' : undefined,
  draw: (a) => <>{!o.dark && !(a.s as any).quiet && decor(text, a)}<Sg a={a} text={text} sub={sub} bg={o.bg} c={o.c} size={o.size} y={host(a) ? 330 : 300} /></>,
});
/** Icon with a sign above it. */
export const I = (icon: string, text: string, sub?: string, o: { s?: number; bg?: string; dark?: boolean; c?: string } = {}): Part => ({
  at: 0, bg: o.dark ? 'dark' : undefined,
  draw: (a) => <><Pop k={a.pk(2)} x={CX(a)} y={host(a) ? 640 : 590}><g transform={`scale(${(o.s ?? 1.5) * (host(a) ? 0.8 : 1)})`}>{ICONS[icon]}</g></Pop><Sg a={a} text={text} sub={sub} y={host(a) ? 280 : 230} at={8} bg={o.bg} c={o.c} size={56} /></>,
});
/** Big counter. */
export const N = (value: number, label: string, o: { prefix?: string; suffix?: string; dark?: boolean; c?: string } = {}): Part => ({
  at: 0, bg: o.dark ? 'dark' : undefined,
  draw: (a) => {
    const v = Math.round(interpolate(a.t, [4, 24], [0, value], Easing.out));
    const w = host(a) ? 470 : 900;
    return <Panel x={CX(a)} y={host(a) ? 520 : 500} w={w} h={host(a) ? 280 : 340} k={a.pk(2)}>{o.prefix && <Txt y={host(a) ? -60 : -80} t={o.prefix.trim()} size={host(a) ? 28 : 40} c="#CFC6B2" />}<Txt y={host(a) ? 40 : 50} t={`${v.toLocaleString('en-US')}${o.suffix ?? ''}`} size={host(a) ? 70 : 140} c={o.c ?? GOLD} /><Txt y={host(a) ? 100 : 125} t={label} size={host(a) ? 26 : 44} c="#CFC6B2" /></Panel>;
  },
});
/** Costumed figure (or two) with a sign. */
export type Fig = { w: any; pose?: string; expr?: string; flip?: boolean; s?: number; item?: string };
export const F = (text: string, figs: Fig | Fig[], sub?: string, o: { bg?: string; dark?: boolean; ground?: boolean } = {}): Part => ({
  at: 0, bg: o.dark ? 'dark' : undefined,
  draw: (a) => {
    const arr = Array.isArray(figs) ? figs : [figs];
    const cx = CX(a), spread = host(a) ? 230 : 380;
    return (
      <>
        {arr.map((f, i) => {
          const x = cx + (i - (arr.length - 1) / 2) * spread;
          return <g key={i} transform={`translate(${x} 520) scale(${a.pk(2 + i * 5)})`}><Chibi x={0} y={150} s={(f.s ?? 1.45) * (host(a) ? 0.8 : 1)} {...f.w} item={f.item ?? f.w.item} pose={f.pose ?? 'idle'} expr={f.expr ?? 'normal'} flip={f.flip ?? (i % 2 === 1 && arr.length > 1)} seed={text + i} talking={[]} /></g>;
        })}
        <Sg a={a} text={text} sub={sub} y={host(a) ? 250 : 220} at={8} bg={o.bg} size={52} />
      </>
    );
  },
});
/** Simple list of facts popping in. */
export const L = (title: string, items: string[], o: { dark?: boolean } = {}): Part => ({
  at: 0, bg: o.dark ? 'dark' : undefined,
  draw: (a) => (
    <>
      <Sg a={a} text={title} y={host(a) ? 260 : 220} size={52} />
      {items.map((it, i) => <Sg key={i} a={a} text={it} y={(host(a) ? 400 : 380) + i * 120} at={14 + i * 12} bg="#F4ECD8" size={44} />)}
    </>
  ),
});
/** Real picture on the stage with the narrator pointing at it. */
export const E = (src: string, aspect: number, word: string, label: string, o: { h?: number; zoom?: number; focus?: [number, number]; quiet?: boolean; ty?: number } = {}): Part => ({
  at: 0, nar: false, bg: o.quiet ? 'dark' : undefined,
  draw: (a) => <><Evidence src={src} aspect={aspect} at={3} x={900} y={470} h={o.h ?? 500} label={label} quiet={o.quiet} len={Math.max(20, Math.min(75, a.s.dur - 12))} zoom={o.zoom ?? 1.1} focus={o.focus} /><Teach x={1660} y={1010} scale={0.5} keys={[]} talking={talk(a.s)} targets={[{ x: 1150, y: o.ty ?? 400, at: a.w(word) }]} /></>,
});

/* ---------- GIS maps ---------- */
export type MapOpt = { c?: [number, number]; to?: [number, number]; z?: number; z2?: number; hot?: string[]; hc?: string; hot2?: string[]; hc2?: string; pins?: [number, number][]; route?: [number, number][]; rc?: string; len?: number; tc?: string };
export const M = (tag: string, o: MapOpt = {}): Part => ({
  at: 0,
  full: (a) => {
    const c0 = o.c ?? [35, 31.8], c1 = o.to ?? c0, z0 = o.z ?? 8, z1 = o.z2 ?? z0 * 1.15, len = o.len ?? 70;
    const g = interpolate(a.t, [0, len], [0, 1], Easing.inOut);
    const cam = camAt(c0[0] + (c1[0] - c0[0]) * g, c0[1] + (c1[1] - c0[1]) * g, z0 + (z1 - z0) * g);
    const hot2 = o.hot2 && a.t > len * 0.5;
    const hs = hot2 ? o.hot2! : o.hot ?? [];
    const fillc = hot2 ? o.hc2 ?? o.hc : o.hc;
    const rt = (o.route ?? []).map(([lo, la]) => P(lo, la));
    let tot = 0; const segs = rt.slice(1).map((p, i) => { const d = Math.hypot(p[0] - rt[i][0], p[1] - rt[i][1]); tot += d; return d; });
    const rg = interpolate(a.t, [6, len * 0.85], [0, 1], Easing.inOut);
    const path = rt.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
    const pw = 8 / cam.z * 2;
    let hx = 0, hy = 0;
    if (rt.length > 1) { let rem = tot * rg; for (let i = 0; i < segs.length; i++) { if (rem <= segs[i] || i === segs.length - 1) { const f = Math.min(1, rem / (segs[i] || 1)); hx = rt[i][0] + (rt[i + 1][0] - rt[i][0]) * f; hy = rt[i][1] + (rt[i + 1][1] - rt[i][1]) * f; break; } rem -= segs[i]; } }
    return (
      <WorldMap data={D} cam={cam} fill={(cc: any) => (hs.includes(cc.iso) ? fillc ?? '#F3B562' : QC.land)} grid={false}>
        {rt.length > 1 && <><path d={path} fill="none" stroke={o.rc ?? RED} strokeWidth={pw} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${tot}`} strokeDashoffset={tot * (1 - rg)} /><circle cx={hx} cy={hy} r={pw * 1.6} fill={o.rc ?? RED} stroke="#fff" strokeWidth={pw / 3} /></>}
        {(o.pins ?? []).map(([lo, la], i) => { const [x, y] = P(lo, la); return <MapPin key={i} x={x} y={y} at={4 + i * 6} z={cam.z} />; })}
      </WorldMap>
    );
  },
  draw: (a) => <Tag x={900} y={220} text={tag} k={a.pk(4)} size={Math.max(30, Math.min(50, Math.floor(1000 / (tag.length * 0.6))))} bg={o.tc} />,
});

/** Split a beat evenly into the given parts (each at most ~2.5 s, so give more parts for long beats). */
export const sh = (...parts: Part[]) => ({ s }: any) => {
  const n = parts.length;
  return cuts(parts.map((p, i) => ({ ...p, at: Math.round((i * s.dur) / n) })))({ s });
};

/* ---------- costumes ---------- */
const R = (top: string, o: any = {}) => ({ outfit: { top, robe: true, sash: '#6B4A2B' }, hat: 'none', hair: '#3A2A22', beard: true, skin: '#C68B59', ...o });
export const CW = {
  elder: R('#B88A5A'), rabbi: R('#1E1E28', { hat: 'tophat', hatColor: '#1E1E28' }), prophet: R('#C8B890'), king: W.KING('#7A4A9A'),
  roman: W.ROMAN, soldier: W.GI(0), knight: W.KNIGHT(), peasant: W.PEASANT('#8A6A4A'), modern: W.MODERN('#3A5A8A'), suit: W.SUIT(),
  woman: W.QUEEN('#C97A7A'), poilu: W.POILU, pilot: W.PILOT, arab: R('#E8E2D2', { hat: 'parted', hatColor: '#F4F7FA' }), settler: W.PEASANT('#4A7A8A', 1),
  official: W.OFFICIAL(0), leader: W.LEADER, anchor: W.ANCHOR, monk: W.MONK('#7A6A4A'), noble: W.NOBLE('#6A4A8A'), refugee: W.PEASANT('#7A7A7A', 1),
};
