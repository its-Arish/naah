/**
 * Alabama film: data-driven scene builders, so most shots are a table of "on this word, show this".
 * A time is [beat index in the run, word?] ; before that beat = hidden, after it = shown.
 */
import React from 'react';
import { interpolate, Easing, springPop, gravityDrop } from '@engine/lib/core';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { InsertBg } from '@engine/scenes/Backgrounds';
import { OL } from '@engine/scenes/Parts';
import { talk, type SP } from '@engine/kit';
import { Stage } from '@engine/moves';
import { MapTag, camAt, P, toScreen, mixCam, type Cam } from '@engine/qgis/QgisMap';
import type { Shot } from '@engine/types';
import { PAPER, RED, GOLD, INK, Rider, OldWorld, alPt, PLACES } from './Kit';
import { useBeat, HostS, Sign, DarkSign, Pop, Txt, Quiet, Sky, Ground } from './Kit2';
import { AlMap, Pin, Route, FiveBlocks, ease, type StreetPin } from './KitAL';

export type B = ReturnType<typeof useBeat>;
export type When = [number, (string | number)?];
export type Key = { at: number; arm?: string; expr?: string };

/** local frame of a time (−999 past, 99999 future) */
export const T = (b: B, w: When) => b.at(w[0], w[1] as any);
/** spring pop 0..~1 */
export const K = (b: B, w: When) => b.pop(w[0], w[1] as any);
/** eased progress 0..1 over len frames from the time */
export const Pg = (b: B, w: When, len = 30) => { const t = T(b, w); return t < -900 ? 1 : t > 9e4 ? 0 : interpolate(b.f, [t, t + len], [0, 1], Easing.inOut); };
export const On = (b: B, w: When) => b.f >= T(b, w);

export type Item = {
  at: When; hide?: When;
  kind: 'sign' | 'dark' | 'red' | 'gold' | 'green' | 'big' | 'art' | 'stamp';
  text?: string; sub?: string; x: number; y: number; size?: number; rot?: number; c?: string;
  el?: (b: B) => React.ReactNode; drop?: boolean; count?: number;
};
const fmtN = (n: number) => Math.round(n).toLocaleString('en-US');
/** Approximate card width, to keep cards clear of the HOST narration column (x < 930). */
const cardW = (it: Item) => {
  const size = it.size ?? 40;
  if (it.kind === 'big') { const txt = (it.count != null ? Math.round(it.count).toLocaleString('en-US') : '') + (it.text ?? ''); return Math.max(txt.length * size * 0.62, (it.sub?.length ?? 0) * 18) + 80; }
  if (it.kind === 'art') return 0;
  return Math.max((it.text?.length ?? 0) * size * 0.62, (it.sub?.length ?? 0) * size * 0.36) + 56;
};
export const Items: React.FC<{ b: B; items: Item[]; minLeft?: number }> = ({ b, items, minLeft = 930 }) => (
  <>{items.map((it0, i) => {
    const w0 = cardW(it0);
    const it = w0 > 0 && minLeft > 0 && it0.x - w0 / 2 < minLeft ? { ...it0, x: minLeft + w0 / 2 } : it0;
    let k = K(b, it.at);
    if (it.hide && On(b, it.hide)) k *= Math.max(0, 1 - Pg(b, it.hide, 10));
    if (k <= 0) return null;
    const size = it.size ?? 40;
    if (it.kind === 'sign') return <Sign key={i} x={it.x} y={it.y} k={k} text={it.text!} sub={it.sub} size={size} rot={it.rot} />;
    if (it.kind === 'dark') return <DarkSign key={i} x={it.x} y={it.y} k={k} text={it.text!} sub={it.sub} size={size} rot={it.rot} c={it.c} />;
    if (it.kind === 'red') return <Sign key={i} x={it.x} y={it.y} k={k} text={it.text!} sub={it.sub} size={size} rot={it.rot} bg={RED} c="#fff" />;
    if (it.kind === 'gold') return <Sign key={i} x={it.x} y={it.y} k={k} text={it.text!} sub={it.sub} size={size} rot={it.rot} bg={GOLD} />;
    if (it.kind === 'green') return <Sign key={i} x={it.x} y={it.y} k={k} text={it.text!} sub={it.sub} size={size} rot={it.rot} bg="#2F5E3A" c="#fff" />;
    if (it.kind === 'stamp') return (
      <Pop key={i} k={k} x={it.x} y={it.y} rot={it.rot ?? -8}>
        <rect x={-(it.text!.length * size * 0.33 + 24)} y={-size * 0.8} width={it.text!.length * size * 0.66 + 48} height={size * 1.5} rx={8} fill="none" stroke={it.c ?? RED} strokeWidth={6} />
        <Txt y={size * 0.34} t={it.text!} size={size} c={it.c ?? RED} />
      </Pop>);
    if (it.kind === 'big') {
      const t = T(b, it.at);
      const shown = it.count != null ? (t < -900 ? it.count : interpolate(b.f, [t, t + 30], [0, it.count], Easing.out)) : 0;
      const txt = it.count != null ? fmtN(shown) + (it.text ?? '') : it.text!;
      const w = Math.max(txt.length * size * 0.62, (it.sub?.length ?? 0) * 18) + 80;
      return (
        <Pop key={i} k={k} x={it.x} y={it.y} rot={it.rot}>
          <rect x={-w / 2} y={-size * 1.05} width={w} height={size * 2.1 + (it.sub ? 34 : 0)} rx={16} fill={PAPER} stroke={OL} strokeWidth={6} />
          <Txt y={size * 0.3} t={txt} size={size * 1.15} c={it.c ?? RED} />
          {it.sub && <Txt y={size * 0.3 + 46} t={it.sub} size={30} />}
        </Pop>);
    }
    // art
    if (it.drop) { const t = T(b, it.at); const d = gravityDrop(b.f, t < -900 ? -999 : t, { h: 500, g: 2.6, e: 0.3 }); return <g key={i} transform={`translate(${it.x} ${it.y + d.y}) scale(${d.sx} ${d.sy})`}>{it.el!(b)}</g>; }
    return <Pop key={i} k={k} x={it.x} y={it.y} rot={it.rot}>{it.el!(b)}</Pop>;
  })}</>
);

// ------------------------------------------------------------------ the narrator on the grey stage, with items
export type HostSpec = { X?: number; items: Item[]; keys?: (b: B) => Key[]; move?: (b: B, s: Shot) => React.ReactNode; under?: (b: B) => React.ReactNode; shakes?: { at: number; amp: number; len: number }[] };
export const hostScene = (spec: HostSpec): React.FC<SP> => ({ s }) => {
  const b = useBeat(s);
  const X = spec.X ?? 1600;
  const keys = spec.keys ? spec.keys(b) : [{ at: 0, arm: 'present', expr: 'smile' }, { at: Math.max(0, T(b, spec.items[0]?.at ?? [0])), arm: 'point', expr: 'grin' }];
  return (
    <Stage shakes={spec.shakes}>
      {spec.under?.(b)}
      <Items b={b} items={spec.items} />
      {spec.move ? spec.move(b, s) : <HostS s={s} x={X} keys={keys} />}
    </Stage>
  );
};

// ------------------------------------------------------------------ maps
export type MPin = { at: When; place?: string; ll?: [number, number]; label?: string; c?: string; star?: boolean; dx?: number; dy?: number; size?: number };
export type MRoute = { at: When; ll: [number, number][]; dur?: number; c?: string };
export type MTag = { at: When; text: string; x: number; y: number; bg?: string; size?: number; hide?: When };
export type MapSpec = {
  al?: { x: number; y: number; h: number; neighbours?: boolean; fill?: string; nbFill?: string; sea?: string | null };
  world?: { from: [number, number, number]; to?: [number, number, number]; move?: [number, number]; land?: string; al?: string | null };
  pins?: MPin[]; routes?: MRoute[]; tags?: MTag[]; items?: Item[];
  rider?: { x: number; y: number; flip?: boolean; arm?: string; expr?: string; s?: number } | null;
  extra?: (b: B, pt: (ll: [number, number]) => [number, number]) => React.ReactNode;
  bg?: 'insert' | 'none'; zoom?: number;
};
export const mapScene = (spec: MapSpec): React.FC<SP> => ({ s }) => {
  const b = useBeat(s);
  let pt: (ll: [number, number]) => [number, number];
  let cam: Cam | null = null;
  if (spec.world) {
    const a = camAt(...spec.world.from), z = spec.world.to ? camAt(...spec.world.to) : a;
    const [m0, m1] = spec.world.move ?? [0, 40];
    cam = spec.world.to ? mixCam(a, z, interpolate(b.g, [m0, m1], [0, 1], Easing.inOut)) : a;
    const c = cam;
    pt = (ll) => { const [x, y] = P(ll[0], ll[1]); const q = toScreen(c, x, y); return [q.x, q.y]; };
  } else {
    const A = spec.al!;
    pt = (ll) => alPt(A.x, A.y, A.h, ll[0], ll[1]);
  }
  const L = (p: MPin) => p.ll ?? PLACES[p.place!];
  const art = (
    <>
      {(spec.routes ?? []).map((r, i) => {
        const t = T(b, r.at);
        const p = t < -900 ? 1 : t > 9e4 ? 0 : interpolate(b.f, [t, t + (r.dur ?? 40)], [0, 1], Easing.inOut);
        return p > 0 ? <Route key={i} pts={r.ll.map(pt)} p={p} c={r.c} /> : null;
      })}
      {spec.extra?.(b, pt)}
      {(spec.pins ?? []).map((p, i) => <Pin key={i} p={pt(L(p))} t={T(b, p.at)} label={p.label} c={p.c} star={p.star} dx={p.dx} dy={p.dy} size={p.size ?? 28} />)}
      {(spec.tags ?? []).map((t, i) => { let k = K(b, t.at); if (t.hide && On(b, t.hide)) k = 0; return <MapTag key={i} x={t.x} y={t.y} text={t.text} k={k} size={t.size ?? 32} bg={t.bg} />; })}
      <Items b={b} items={spec.items ?? []} minLeft={0} />
      {spec.rider !== null && <Rider x={spec.rider?.x ?? 1640} y={spec.rider?.y ?? 640} s={spec.rider?.s ?? 0.42} arm={spec.rider?.arm ?? 'point'} expr={spec.rider?.expr ?? 'grin'} talking={talk(s)} flip={spec.rider?.flip ?? true} />}
    </>
  );
  if (spec.world) return (
    <>
      <OldWorld cam={cam!} land={spec.world.land ?? '#EFE3C4'} al={spec.world.al === undefined ? '#F3D6A0' : spec.world.al} />
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>{art}</svg>
    </>
  );
  const A = spec.al!;
  return (
    <CameraRig move={{ zoomFrom: 1, zoomTo: spec.zoom ?? 1.04, focus: [A.x, A.y] }}>
      {spec.bg !== 'none' && <InsertBg />}
      <Layer depth={1}>
        <AlMap x={A.x} y={A.y} h={A.h} neighbours={A.neighbours} fill={A.fill} nbFill={A.nbFill} sea={A.sea} />
        {art}
      </Layer>
    </CameraRig>
  );
};

// ------------------------------------------------------------------ quiet passages: still, dark, words fade in, no narrator
export type QLine = { at: When; text: string; y: number; size?: number; c?: string };
export const quietScene = (spec: { tone?: string; lines: QLine[]; art?: (b: B) => React.ReactNode }): React.FC<SP> => ({ s }) => {
  const b = useBeat(s);
  return (
    <Quiet tone={spec.tone ?? '#161A20'}>
      <g opacity={ease(b.g, 0, 30)}>{spec.art?.(b)}</g>
      {spec.lines.map((l, i) => <text key={i} x={960} y={l.y} textAnchor="middle" fontFamily="TagBold" fontSize={l.size ?? 40} fill={l.c ?? '#C9B8A0'} opacity={Pg(b, l.at, 36)}>{l.text}</text>)}
    </Quiet>
  );
};

// ------------------------------------------------------------------ the five blocks, with the pins so far
export type SPin = Omit<StreetPin, 'at'> & { at: When | 'past' };
export const streetScene = (spec: { pins: SPin[]; X?: number; keys?: (b: B) => Key[]; items?: Item[]; move?: (b: B, s: Shot) => React.ReactNode; sx?: number }): React.FC<SP> => ({ s }) => {
  const b = useBeat(s);
  const pins: StreetPin[] = spec.pins.map((p) => ({ ...p, at: p.at === 'past' ? -999 : T(b, p.at) }));
  const X = spec.X ?? 1640;
  return (
    <Stage>
      <FiveBlocks x={spec.sx ?? 1060} y={520} s={0.74} pins={pins} />
      <Items b={b} items={spec.items ?? []} />
      {spec.move ? spec.move(b, s) : <HostS s={s} x={X} keys={spec.keys ? spec.keys(b) : [{ at: 0, arm: 'point', expr: 'smile' }]} />}
    </Stage>
  );
};

// ------------------------------------------------------------------ outdoor story scenes
export const storyScene = (spec: { sky?: string; ground?: string; hills?: string; art: (b: B) => React.ReactNode; items?: Item[]; rider?: { x: number; y: number; flip?: boolean; arm?: string; expr?: string } | null; zoom?: [number, number, number, number] }): React.FC<SP> => ({ s }) => {
  const b = useBeat(s);
  const [z0, z1, fx, fy] = spec.zoom ?? [1, 1.05, 960, 600];
  return (
    <>
      <CameraRig move={{ zoomFrom: z0, zoomTo: z1, focus: [fx, fy] }}>
        <Sky id={spec.sky ?? 'skyDay'} />
        <Layer depth={1}>
          {spec.ground && <Ground y={720} fill={spec.ground} />}
          {spec.art(b)}
        </Layer>
      </CameraRig>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <Items b={b} items={spec.items ?? []} minLeft={0} />
        {spec.rider !== null && spec.rider && <Rider x={spec.rider.x} y={spec.rider.y} s={0.4} arm={spec.rider.arm ?? 'point'} expr={spec.rider.expr ?? 'grin'} talking={talk(s)} flip={spec.rider.flip} />}
      </svg>
    </>
  );
};
export { PAPER, RED, GOLD, INK };
