/** Map engines compared: the same route (Lumbini → Kathmandu → Lhasa) in the QGIS kit, Mapimator and TripTrail.
 *  Engine 3 is a slot: TripTrail renders in a browser with live map tiles, so its clip is exported on a computer with internet
 *  (see docs/MAPS.md "TripTrail") and placed here by `studio splice`/ffmpeg. */
import React from 'react';
import { useCurrentFrame, springPop } from '@engine/lib/core';
import { Host } from '@engine/characters/Host';
import { makeEnd, talk, wordAt, type ShotMap, type SP } from '@engine/kit';
import { Stage } from '@engine/moves';
import { type QData, P, camAt, WORLD_CAM, moveCam, toScreen, QC, Full, WorldMap, MapTag, FlowLines } from '@engine/qgis/QgisMap';
import raw from './src/qgis.json';

const D = raw as unknown as QData;
const PL: [number, number][] = [[83.276, 27.469], [85.324, 27.717], [91.117, 29.65]];
const NAMES = ['LUMBINI', 'KATHMANDU', 'LHASA'];
const Badge: React.FC<{ n: number; name: string }> = ({ n, name }) => {
  const f = useCurrentFrame();
  return <MapTag x={50} y={80} anchor="start" text={`ENGINE ${n}/3 · ${name}`} k={springPop(f, 2)} size={34} bg={QC.paper} c={QC.ink} />;
};

const Qgis: React.FC<SP> = () => {
  const f = useCurrentFrame();
  const cam = moveCam(f, WORLD_CAM, camAt(87.3, 28.4, 13), 0, 60);
  const pts = PL.map((q) => P(q[0], q[1]));
  return (<>
    <WorldMap data={D} cam={cam} fill={(c) => (c.iso === 'NPL' ? '#F3D58A' : QC.land)}>
      <FlowLines pts={pts} cam={cam} start={70} step={60} />
    </WorldMap>
    <Full>
      <Badge n={1} name="QGIS KIT" />
      {PL.map((q, i) => { const s = toScreen(cam, ...P(q[0], q[1])); return <MapTag key={i} x={s.x} y={s.y - 50} text={NAMES[i]} k={springPop(f, 70 + i * 60) * 0.9} size={30} bg={QC.paper} c={QC.ink} />; })}
    </Full>
  </>);
};
const MapBadge: React.FC<SP> = () => <Full><Badge n={2} name="MAPIMATOR" /></Full>;
export const MapExtras = { 'map:nepal-route': MapBadge };

const Trip: React.FC<SP> = () => {
  const f = useCurrentFrame();
  const rows = ['SATELLITE GLOBE', 'REAL ROADS AND SEA LANES', 'MP4 AT 30 OR 60 FPS', 'PHOTO POP-UPS AT STOPS'];
  return (<>
    <div style={{ position: 'absolute', inset: 0, background: '#1B2733' }} />
    <Full>
      <Badge n={3} name="TRIPTRAIL" />
      {rows.map((r, i) => <MapTag key={r} x={960} y={300 + i * 110} text={r} k={springPop(f, 12 + i * 10)} size={42} bg="#2F6EA8" c="#fff" />)}
      <MapTag x={960} y={800} text="CLIP RENDERED ON A COMPUTER WITH INTERNET" k={springPop(f, 70)} size={26} bg="#E8C65A" c={QC.ink} />
    </Full>
  </>);
};

const Intro: React.FC<SP> = ({ s }) => (
  <Stage>
    {['QGIS KIT', 'MAPIMATOR', 'TRIPTRAIL'].map((n, i) => <MapTag key={n} x={1060} y={300 + i * 130} text={n} k={1} size={46} bg={['#F3D58A', '#2B3440', '#2F6EA8'][i]} c={i ? '#F4ECD8' : QC.ink} />)}
    <Host x={1520} keys={[{ at: 0, arm: 'present', expr: 'grin' }]} talking={talk(s)} />
  </Stage>
);
const Verdict: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const rows: [string, string, string][] = [['QGIS KIT', 'NUMBERS · BORDERS · STATES', '#F3D58A'], ['MAPIMATOR', 'ROUTES · PINS · ARROWS', '#2B3440'], ['TRIPTRAIL', 'REAL TERRAIN · LONG JOURNEYS', '#2F6EA8']];
  return (<Stage>
    {rows.map(([a, b, c], i) => <React.Fragment key={a}>
      <MapTag x={1130} y={290 + i * 150} text={a} k={springPop(f, 10 + i * 12)} size={40} bg={c} c={i ? '#F4ECD8' : QC.ink} />
      <MapTag x={1500} y={290 + i * 150} text={b} k={springPop(f, 16 + i * 12)} size={26} bg={QC.paper} c={QC.ink} />
    </React.Fragment>)}
    <Host x={1800} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at: wordAt(s, 'TripTrail'), arm: 'finger', expr: 'grin' }]} talking={talk(s)} />
  </Stage>);
};
const Opening: React.FC<SP> = () => <div style={{ position: 'absolute', inset: 0, background: '#C4C4C4' }} />;
export const SHOTS: ShotMap = { opening: Opening, end: makeEnd('Map Engines Compared'), m_intro: Intro, m_qgis: Qgis, m_trip: Trip, m_verdict: Verdict };
