/**
 * The era timeline across the top of the screen. The film has no chapter cards: when the story enters a new era
 * the marker slides along this line and the label changes while the narrator keeps talking.
 * Each era is a beats section (its title is the label); the bar appears on the last line of the hook.
 */
import React from 'react';
import { useCurrentFrame, interpolate, Easing, springPop } from '@engine/lib/core';
import { Narration } from '@engine/fx/Overlays';
import type { Shot } from '@engine/types';
import timeline from '@project/build/timeline.json';

const shots = (timeline as any).shots as (Shot & { quiet?: boolean })[];
export const ERAS: { name: string; years: string }[] = [
  { name: 'First Californians', years: '11,000 BC – 1542' },
  { name: 'Spain', years: '1542 – 1821' },
  { name: 'Mexico', years: '1821 – 1848' },
  { name: 'Gold', years: '1848 – 1855' },
  { name: 'Railroad', years: '1863 – 1882' },
  { name: 'Sunshine', years: '1880s – 1920s' },
  { name: 'Dust and war', years: '1930 – 1960' },
  { name: 'Silicon', years: '1939 – 2007' },
  { name: 'Today', years: '2018 – now' },
];
const RANGE = ERAS.map((e) => {
  const mine = shots.filter((x) => x.section === e.name);
  return mine.length ? { from: mine[0].from, to: mine[mine.length - 1].from + mine[mine.length - 1].dur } : { from: 1e9, to: 1e9 };
});
/** The bar slides in on the last beat of the hook. */
const hook = shots.filter((x) => x.section === 'Hook');
export const BAR_FROM = hook.length ? hook[hook.length - 1].from : 0;

const X0 = 84, STEP = 196, Y = 26, H = 80;
/** Short labels fit under the nodes; the pill under the marker carries the full name and years. */
const SHORT: Record<string, string> = { 'First Californians': 'FIRST PEOPLES', 'Dust and war': 'DUST & WAR' };
export const TimelineBar: React.FC<{ abs: number }> = ({ abs }) => {
  if (abs < BAR_FROM) return null;
  const slide = interpolate(abs, [BAR_FROM, BAR_FROM + 14], [-120, 0], Easing.out);
  let era = -1;
  RANGE.forEach((r, i) => { if (abs >= r.from) era = i; });
  const p = era < 0 ? 0 : Math.min(1, (abs - RANGE[era].from) / Math.max(1, RANGE[era].to - RANGE[era].from));
  // the marker eases onto each new node in the first 20 frames of the era, then travels to the next one
  const settle = era < 0 ? 1 : interpolate(abs, [RANGE[era].from, RANGE[era].from + 20], [0, 1], Easing.out);
  const mx = era < 0 ? X0 : X0 + era * STEP + STEP * p * 0.96;
  const pop = era < 0 ? 1 : springPop(abs, RANGE[era].from);
  return (
    <svg width={1920} height={150} style={{ position: 'absolute', left: 0, top: slide }}>
      <rect width={1920} height={H} fill="rgba(20,18,16,0.86)" />
      <rect y={H} width={1920} height={3} fill="#8A6A44" />
      <line x1={X0} y1={Y} x2={X0 + ERAS.length * STEP} y2={Y} stroke="#6E6658" strokeWidth={4} strokeLinecap="round" />
      <line x1={X0} y1={Y} x2={mx} y2={Y} stroke="#FFD84A" strokeWidth={4} strokeLinecap="round" />
      {ERAS.map((e, i) => {
        const on = i === era, past = i < era;
        return (
          <g key={e.name} transform={`translate(${X0 + i * STEP} 0)`}>
            <circle cy={Y} r={on ? 9 : 7} fill={on || past ? '#FFD84A' : '#26221C'} stroke={on || past ? '#FFD84A' : '#8A8272'} strokeWidth={3} />
            <text x={-8} y={63} fontFamily="TagBold" fontSize={on ? 20 * (0.75 + 0.25 * Math.min(1.1, pop)) : 19} fill={on ? '#FFD84A' : past ? '#CFC6B2' : '#8E8676'} letterSpacing={0.4}>{SHORT[e.name] ?? e.name.toUpperCase()}</text>
          </g>
        );
      })}
      <g transform={`translate(${mx} ${Y})`}>
        <path d="M0 -13 L11 0 L0 13 L-11 0 Z" fill="#FFD84A" stroke="#1A1410" strokeWidth={3} />
      </g>
      {era >= 0 && (() => {
        const label = `${ERAS[era].name.toUpperCase()}  ·  ${ERAS[era].years}`;
        const w = label.length * 13.2 + 44;
        return (
          <g transform={`translate(${Math.min(1900 - w / 2, Math.max(20 + w / 2, mx))} ${H + 30}) scale(${0.6 + 0.4 * settle})`} opacity={settle}>
            <rect x={-w / 2} y={-21} width={w} height={44} rx={9} fill="rgba(20,18,16,0.88)" stroke="#8A6A44" strokeWidth={2.5} />
            <text y={10} textAnchor="middle" fontFamily="TagBold" fontSize={24} fill="#FFD84A">{label}</text>
          </g>
        );
      })()}
    </svg>
  );
};

/** Replaces the standard overlay: the usual captions, no date tag, and the timeline bar. */
export const Overlay: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame();
  const font = (timeline as any).captionFont;
  return (
    <>
      {s.words && s.words.length > 0 && <Narration words={s.words} variant={s.kind === 'HOST' ? 'host' : 'caption'} font={font} />}
      {s.kind !== 'OPENING' && <TimelineBar abs={s.from + f} />}
    </>
  );
};
