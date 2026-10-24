import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { FrameProvider, setAbsoluteFrame } from '../lib/core';
import { GlobalDefs } from '../fx/Defs';
import { Video, TOTAL_FRAMES } from './Video';

const root = createRoot(document.getElementById('root')!);
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
(window as any).__setFrame = (f: number) => render(f);
render(0);
document.fonts.load('60px Hand').then(() => document.fonts.load('30px Tag')).then(() => document.fonts.ready).then(() => { (window as any).__ready = true; });
