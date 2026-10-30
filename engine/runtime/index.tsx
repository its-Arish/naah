import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { FrameProvider, setAbsoluteFrame, setFrameSize } from '../lib/core';
import timeline from '@project/build/timeline.json';
import { GlobalDefs } from '../fx/Defs';
import { Video, TOTAL_FRAMES } from './Video';

const tl = timeline as any;
const W = tl.width ?? 1920, H = tl.height ?? 1080;
setFrameSize(W, H);
const rootEl = document.getElementById('root')!;
rootEl.style.width = W + 'px'; rootEl.style.height = H + 'px';
const root = createRoot(rootEl);
const render = (f: number) => {
  setAbsoluteFrame(f);
  flushSync(() =>
    root.render(
      <FrameProvider frame={f} duration={TOTAL_FRAMES}>
        <GlobalDefs />
        <Video />
      </FrameProvider>,
    ),
  );
};
(window as any).__total = TOTAL_FRAMES;
// wait for any images (map frames) to decode before the frame is captured
(window as any).__setFrame = async (f: number) => {
  render(f);
  const pending = [...document.images].filter((i) => !i.complete || !i.naturalWidth);
  if (pending.length) await Promise.all(pending.map((i) => i.decode().catch(() => {})));
};
render(0);
document.fonts.load('60px Hand').then(() => document.fonts.load('30px Tag')).then(() => document.fonts.ready).then(() => { (window as any).__ready = true; });
