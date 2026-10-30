/**
 * A Mapimator map scene (see docs/MAPS.md). Beats with "shot": "map:<name>" draw this automatically:
 * it shows frame N of build/maps/<name>/, rendered by `studio maps` to the exact length of those beats.
 * Captions, the date tag and corner notes still go on top as usual.
 */
import React from 'react';
import { useCurrentFrame } from '../lib/core';

export const MapClip: React.FC<{ name: string; offset: number; frames: number; children?: React.ReactNode }> = ({ name, offset, frames, children }) => {
  const f = Math.max(0, Math.min(frames - 1, offset + useCurrentFrame()));
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#101a2a' }}>
      <img src={`maps/${name}/f${String(f).padStart(4, '0')}.jpg`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      {children}
    </div>
  );
};
