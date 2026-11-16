/**
 * Evidence: a real photograph or document shown as a framed picture on the stage.
 *
 *   import { Evidence } from '@engine/fx/Evidence';
 *   <Evidence src="02-tel-dan.jpg" aspect={1.5} at={wordAt(s, 'David')} x={900} y={430} h={520} label="Tel Dan Stele, 9th century BCE" />
 *
 * SVG group: put it inside a <Layer depth={1}> (or in the shot's SVG) BEFORE <Teach>, so the narrator's
 * staff is drawn on top of the picture and can touch it. Keep y + h/2 + label under about 850 (caption zone).
 * `aspect` = picture width / height (see evidence-log.md). The picture pops in on `at`, drifts with a slow
 * zoom (`zoom` = end scale; keep it near 1.08, and under 1.15 for low-resolution files), carries a label
 * plate, and leaves after `len` frames (default 75 = 2.5 s at 30 fps, the longest a real insert may stay).
 * `focus` ([0..1, 0..1]) is the part of the picture the zoom moves towards, for example the carved line.
 * Files live in projects/<slug>/evidence/ and are served at `evidence/<file>`.
 * `quiet` fades in instead of springing (use it on tragedy beats, with no bounce).
 * Nothing is drawn on the picture itself: the narrator points at it with <Teach>.
 */
import React from 'react';
import { useCurrentFrame, interpolate, Easing, popScale } from '@engine/lib/core';

let uid = 0;
export const Evidence: React.FC<{
  src: string; aspect: number; at: number; x: number; y: number; h?: number;
  label?: string; quiet?: boolean; len?: number; zoom?: number; focus?: [number, number]; rot?: number;
}> = ({ src, aspect, at, x, y, h = 520, label, quiet = false, len = 75, zoom = 1.08, focus = [0.5, 0.5], rot = -1.2 }) => {
  const f = useCurrentFrame();
  const id = React.useMemo(() => `ev${uid++}`, []);
  if (f < at || f > at + len + 8) return null;
  const k = (quiet ? interpolate(f, [at, at + 10], [0, 1], Easing.out) : popScale(f, at)) * interpolate(f, [at + len, at + len + 8], [1, 0], Easing.in);
  if (k <= 0) return null;
  const w = h * aspect;
  const z = interpolate(f, [at, at + len], [1, zoom], Easing.inOut);
  const fx = (focus[0] - 0.5) * w, fy = (focus[1] - 0.5) * h;
  const pad = 14;
  // wrap the label into lines of about 38 characters; the plate is at least as wide as the label
  const lines: string[] = [];
  (label ?? '').split(' ').forEach((wd) => { const l = lines[lines.length - 1]; if (l !== undefined && (l + ' ' + wd).length <= 38) lines[lines.length - 1] = l + ' ' + wd; else lines.push(wd); });
  const labelH = label ? lines.length * 34 + 16 : 0;
  const pw = Math.max(w, label ? 560 : 0);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
      <defs><clipPath id={id}><rect x={-w / 2} y={-h / 2} width={w} height={h} /></clipPath></defs>
      <rect x={-pw / 2 - pad + 10} y={-h / 2 - pad + 12} width={pw + pad * 2} height={h + pad * 2 + labelH} rx={10} fill="rgba(0,0,0,0.32)" />
      <rect x={-pw / 2 - pad} y={-h / 2 - pad} width={pw + pad * 2} height={h + pad * 2 + labelH} rx={10} fill="#F4ECD8" stroke="#1A1410" strokeWidth={6} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#1A1410" />
      <g clipPath={`url(#${id})`}>
        <g transform={`translate(${fx} ${fy}) scale(${z}) translate(${-fx} ${-fy})`}>
          <image href={`evidence/${src}`} x={-w / 2} y={-h / 2} width={w} height={h} preserveAspectRatio="xMidYMid slice" />
        </g>
      </g>
      {lines.map((l, i) => <text key={i} x={0} y={h / 2 + pad + 30 + i * 34} textAnchor="middle" fontFamily="TagBold" fontSize={30} fill="#1A1410">{l}</text>)}
    </g>
  );
};
