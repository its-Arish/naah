import React, { createContext, useContext } from 'react';
import { useCurrentFrame, useDuration, interpolate, Easing, shake as shakeFn, frameSize } from '../lib/core';

export type CamMove = {
  // zoom keys: from → to over the shot; push = a quick push-in at a given frame
  zoomFrom?: number;
  zoomTo?: number;
  panFrom?: [number, number];
  panTo?: [number, number];
  focus?: [number, number];
  push?: { at: number; to: number; len?: number };
  shakes?: { at: number; len?: number; amp?: number }[];
};

type CamState = { zoom: number; fx: number; fy: number; px: number; py: number };
const CamCtx = createContext<CamState>({ zoom: 1, fx: 960, fy: 540, px: 0, py: 0 });

export const useCam = () => useContext(CamCtx);

/** Wraps a whole shot. Children use <Layer depth> to get parallax. */
export const CameraRig: React.FC<{ move?: CamMove; children: React.ReactNode; seed?: string }> = ({ move = {}, children, seed = 'cam' }) => {
  const f = useCurrentFrame();
  const d = useDuration();
  const { w: W, h: H } = frameSize();
  const { zoomFrom = 1, zoomTo = 1.04, panFrom = [0, 0], panTo = [0, 0], focus = [W / 2, H / 2], push, shakes = [] } = move;
  let zoom = interpolate(f, [0, d], [zoomFrom, zoomTo], Easing.inOut);
  let blur = 0;
  if (push) {
    const len = push.len ?? 30;
    const p = interpolate(f, [push.at, push.at + len], [0, 1], Easing.inOut);
    zoom *= 1 + (push.to - 1) * p;
    // brief motion blur during the fastest part of the push
    const mid = push.at + len / 2;
    if (len <= 10) blur = interpolate(Math.abs(f - mid), [0, len / 2], [3, 0]);
  }
  const px = interpolate(f, [0, d], [panFrom[0], panTo[0]], Easing.inOut);
  const py = interpolate(f, [0, d], [panFrom[1], panTo[1]], Easing.inOut);
  let sx = 0, sy = 0;
  shakes.forEach((s, i) => {
    const o = shakeFn(f, s.at, s.len ?? 6, s.amp ?? 4, seed + i);
    sx += o.x; sy += o.y;
  });
  return (
    <CamCtx.Provider value={{ zoom, fx: focus[0], fy: focus[1], px, py }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', transform: `translate(${sx}px, ${sy}px)`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
          {children}
        </svg>
      </div>
    </CamCtx.Provider>
  );
};

/** A parallax layer. depth 0 = fixed sky, 1 = main action plane, >1 = foreground. */
export const Layer: React.FC<{ depth: number; children: React.ReactNode }> = ({ depth, children }) => {
  const c = useCam();
  const z = 1 + (c.zoom - 1) * depth;
  const t = `translate(${c.fx} ${c.fy}) scale(${z}) translate(${-c.fx - c.px * depth} ${-c.fy - c.py * depth})`;
  return <g transform={t}>{children}</g>;
};
