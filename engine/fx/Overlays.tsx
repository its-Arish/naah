import React from 'react';
import { useCurrentFrame, interpolate, Easing, popScale } from '../lib/core';

export const fmtYear = (v: number) => (v < 0 ? `${Math.max(1, Math.round(-v))} BC` : `${Math.round(v)}`);

/** Grey date tag, top-left. Rolls like an odometer from `from` to `to` at local frame 0. */
export const DateTag: React.FC<{ from: number | null; to: number | null }> = ({ from, to }) => {
  const f = useCurrentFrame();
  if (to === null) return null;
  const start = from ?? to;
  const len = Math.min(42, Math.max(18, Math.abs(to - start) / 8));
  const v = interpolate(f, [0, len], [start, to], Easing.outExpo);
  const appear = from === null ? popScale(f, 0) : 1;
  return (
    <div style={{ position: 'absolute', left: 28, top: 26, transform: `scale(${appear})`, transformOrigin: 'left top' }}>
      <div style={{ background: 'rgba(90,90,90,0.88)', color: '#fff', fontFamily: 'Tag', fontSize: 40, padding: '6px 22px 8px', borderRadius: 4, letterSpacing: 1, minWidth: 90, textAlign: 'center', boxShadow: '0 0 0 2px rgba(0,0,0,0.15)' }}>
        {fmtYear(v)}
      </div>
    </div>
  );
};

export type Word = { w: string; em: boolean; at: number };

/** Word-by-word narration. variant: host (black, beside the host) or caption (white outline, lower third). */
export const Narration: React.FC<{ words: Word[]; variant: 'host' | 'caption' | 'title'; side?: 'left' | 'right'; dark?: boolean; top?: number }> = ({ words, variant, side = 'left', dark, top }) => {
  const f = useCurrentFrame();
  const isHost = variant === 'host';
  const base: React.CSSProperties = isHost
    ? { position: 'absolute', top: top ?? 300, [side]: 110, width: 800, textAlign: side === 'left' ? 'left' : 'left', fontSize: 74, lineHeight: 1.18, color: dark ? '#F4F4F4' : '#141414' }
    : { position: 'absolute', bottom: 54, left: 150, right: 150, textAlign: 'center', fontSize: 70, lineHeight: 1.12, color: '#FFFFFF' };
  const emColor = isHost && !dark ? '#B3261E' : '#FFD84A';
  return (
    <>
      {!isHost && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 260, background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.42))' }} />}
      <div style={{ ...base, fontFamily: 'Hand', fontWeight: 400 }}>
        {words.map((w, i) => {
          const t = f - w.at;
          if (t < 0) return <span key={i} style={{ opacity: 0 }}>{w.w} </span>;
          const sc = w.em ? interpolate(t, [0, 3, 6], [0.6, 1.22, 1]) : interpolate(t, [0, 4], [0.8, 1]);
          const op = interpolate(t, [0, 4], [0, 1]);
          const style: React.CSSProperties = {
            display: 'inline-block',
            transform: `scale(${sc})`,
            opacity: op,
            marginRight: '0.34em',
            color: w.em ? emColor : undefined,
            WebkitTextStroke: isHost ? `2.2px ${w.em ? emColor : dark ? '#F4F4F4' : '#141414'}` : '10px #000',
            paintOrder: 'stroke fill',
            fontWeight: 400,
          };
          return <span key={i} style={style}>{w.w}</span>;
        })}
      </div>
    </>
  );
};

/** Big floating phrases that fan out around the host (reference: "Should we attack?" / "Will it rain?"). */
export const FanWords: React.FC<{ items: { text: string; at: number; x: number; y: number; rot?: number }[]; dark?: boolean }> = ({ items, dark }) => {
  const f = useCurrentFrame();
  return (
    <>
      {items.map((it, i) => {
        const s = popScale(f, it.at);
        if (s <= 0) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: it.x, top: it.y, transform: `translate(-50%,-50%) rotate(${it.rot ?? 0}deg) scale(${s})`, fontFamily: 'Hand', fontSize: 70, color: dark ? '#fff' : '#141414', WebkitTextStroke: `2.2px ${dark ? '#fff' : '#141414'}`, whiteSpace: 'nowrap' }}>
            {it.text}
          </div>
        );
      })}
    </>
  );
};

/** Spotlight dim: grey stage darkens with a soft white glow and a drifting ghost word. */
export const Spotlight: React.FC<{ at: number; text?: string; x?: number; y?: number }> = ({ at, text, x = 300, y = 260 }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at, at + 8], [0, 1], Easing.out);
  if (k <= 0) return null;
  const drift = (f - at) * 0.9;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: '#4A4A4A', opacity: 0.62 * k, mixBlendMode: 'multiply' }} />
      <div style={{ position: 'absolute', left: x - 330, top: y - 330, width: 660, height: 660, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 38%, rgba(255,255,255,0) 70%)', opacity: k }} />
      {text && (
        <div style={{ position: 'absolute', left: x - 60 + drift * 0.35, top: y - 40, whiteSpace: 'nowrap', transform: `translate(-50%,0) scale(${1 + (f - at) * 0.003})`, fontFamily: 'Hand', fontSize: 72, color: 'rgba(255,255,255,0.9)', WebkitTextStroke: '2px rgba(120,120,120,0.6)', opacity: k * interpolate(f - at, [0, 60, 120], [0.4, 1, 0.5]) }}>
          {text}
        </div>
      )}
    </>
  );
};

/** Label that pops on, with a little pointer line (e.g. "Kathmandu"). */
/** A solid dark outline drawn with text-shadows (keeps thin handwriting legible, unlike -webkit-text-stroke). */
const outline = (w: number) => [...Array(16)].map((_, i) => `${(Math.cos((i / 16) * Math.PI * 2) * w).toFixed(1)}px ${(Math.sin((i / 16) * Math.PI * 2) * w).toFixed(1)}px 0 #000`).join(',') + `, 0 ${w * 1.4}px ${w * 2}px rgba(0,0,0,0.5)`;
export const Label: React.FC<{ text: string; x: number; y: number; at: number; color?: string; size?: number; rot?: number }> = ({ text, x, y, at, color = '#fff', size = 54, rot = 0 }) => {
  const f = useCurrentFrame();
  const s = popScale(f, at);
  if (s <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, fontFamily: 'Hand', fontSize: size, color, textShadow: outline(Math.max(2.5, size * 0.06)), whiteSpace: 'nowrap' }}>
      {text}
    </div>
  );
};

/** Speech bubble for SKETCH dialogue: white rounded box with a tail pointing at the speaker; words reveal one by one. */
export const Bubble: React.FC<{ words: Word[]; x: number; y: number; w?: number; tailX: number; tailY: number }> = ({ words, x, y, w = 760, tailX, tailY }) => {
  const f = useCurrentFrame();
  const s = popScale(f, 0);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, transform: `scale(${s})`, transformOrigin: `${tailX - x}px ${tailY - y}px` }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={w} height={10}>
        <path d={`M${w / 2 - 40 + (tailX - x - w / 2) * 0.3} 60 L${tailX - x} ${tailY - y} L${w / 2 + 40 + (tailX - x - w / 2) * 0.3} 60 Z`} fill="#fff" stroke="#141414" strokeWidth={5} strokeLinejoin="round" />
      </svg>
      <div style={{ position: 'relative', background: '#fff', border: '5px solid #141414', borderRadius: 46, padding: '22px 36px 26px', fontFamily: 'Hand', fontSize: 62, lineHeight: 1.12, color: '#141414', boxShadow: '6px 8px 0 rgba(0,0,0,0.25)' }}>
        {words.map((wd, i) => {
          const t = f - wd.at;
          const op = interpolate(t, [0, 4], [0, 1]);
          return <span key={i} style={{ display: 'inline-block', opacity: op, transform: `scale(${t < 0 ? 0.8 : interpolate(t, [0, 4], [0.8, 1])})`, marginRight: '0.3em', WebkitTextStroke: '2px #141414' }}>{wd.w}</span>;
        })}
      </div>
    </div>
  );
};
