/** QGIS map-style showcase: the five styles of engine/qgis/QgisMap.tsx, drawn from QGIS's world map data.
 *  Data: python3 scripts/qgis_export.py projects/qgis-showcase/src/qgis.json --provinces AUS --disputed --globe --points hackfests=projects/qgis-showcase/data/qgis-hackfests.json */
import React from 'react';
import { useCurrentFrame, useDuration, springPop } from '@engine/lib/core';
import { Host } from '@engine/characters/Host';
import { makeEnd, talk, wordAt, type ShotMap, type SP } from '@engine/kit';
import { Stage } from '@engine/moves';
import { type QData, P, camAt, WORLD_CAM, moveCam, toScreen, QC, Full, WorldMap, MapTag, Choropleth, ChoroLegend, ProvinceTrace, ProvinceLabels, DisputedLines, LineLegend, Globe, FlowLines, flowIndex } from '@engine/qgis/QgisMap';
import raw from './src/qgis.json';

const D = raw as unknown as QData;
const HF = D.points.hackfests as unknown as { p: [number, number]; ll: [number, number]; year: number; place: string }[];
const N = 6;
const Badge: React.FC<{ n: number; name: string }> = ({ n, name }) => {
  const f = useCurrentFrame();
  return <MapTag x={50} y={80} anchor="start" text={`STYLE ${n}/${N} · ${name}`} k={springPop(f, 2)} size={34} bg={QC.paper} c={QC.ink} />;
};

// 1 CHOROPLETH: provinces per country
const BINS = [0, 5, 15, 30, 60];
const Choro: React.FC<SP> = () => {
  const f = useCurrentFrame();
  const cam = moveCam(f, WORLD_CAM, camAt(-2, 54, 4.2), 120, 160);
  const uk = toScreen(cam, ...P(-2, 54));
  return (<>
    <Choropleth data={D} cam={cam} value={(c) => c.nProv} bins={BINS} />
    <Full>
      <Badge n={1} name="CHOROPLETH" />
      <ChoroLegend title="PROVINCES" bins={BINS} at={70} />
      <MapTag x={uk.x + 120} y={uk.y - 60} anchor="start" text="UK: 232" k={springPop(f, 150)} size={44} bg="#B3261E" />
    </Full>
  </>);
};

// 2 PROVINCES: Australia traced
const Prov: React.FC<SP> = () => {
  const f = useCurrentFrame();
  const cam = moveCam(f, WORLD_CAM, camAt(134, -28, 4.6), 0, 40);
  const aus = D.provinces.AUS;
  return (<>
    <WorldMap data={D} cam={cam} fill={(c) => (c.iso === 'AUS' ? '#FFF8E8' : QC.land)}><ProvinceTrace provinces={aus} cam={cam} start={40} stagger={9} /></WorldMap>
    <Full><Badge n={2} name="PROVINCES" /><ProvinceLabels provinces={aus} cam={cam} at={120} /></Full>
  </>);
};

// 3 DISPUTED BORDERS: Kashmir
const CLAIMS = { 'Indian claim': { color: '#E07B00', at: 50 }, 'Pakistani claim': { color: '#1E7F4F', at: 85 }, 'Chinese claim': { color: '#C8312B', at: 120 } };
const Disp: React.FC<SP> = () => {
  const f = useCurrentFrame();
  const cam = moveCam(f, WORLD_CAM, camAt(77, 34.2, 15), 0, 46);
  const lines = D.disputed.filter((x) => ['India', 'Pakistan', 'China'].includes(x.left));
  return (<>
    <WorldMap data={D} cam={cam} fill={(c) => (['IND', 'PAK', 'CHN'].includes(c.iso) ? '#F7EBD3' : '#E3DCCB')}><DisputedLines lines={lines} claims={CLAIMS} /></WorldMap>
    <Full>
      <Badge n={3} name="DISPUTED BORDERS" />
      <LineLegend at={46} items={Object.entries(CLAIMS).map(([k, v]) => ({ label: k.toUpperCase(), ...v }))} />
      {([['INDIA', 78.5, 31.2], ['PAKISTAN', 72.4, 33.4], ['CHINA', 79.6, 36.3]] as const).map(([n, lo, la], i) => { const q = toScreen(cam, ...P(lo, la)); return <MapTag key={n} x={q.x} y={q.y} text={n} k={springPop(f, 40 + i * 5) * 0.8} size={28} bg={QC.paper} c={QC.ink} />; })}
    </Full>
  </>);
};

// 4 GLOBE
const GlobeShot: React.FC<SP> = () => {
  const f = useCurrentFrame();
  return (<><Globe data={D} lam0={-100 + f * 1.6} points={HF.map((h) => ({ ll: h.ll }))} /><Full><Badge n={4} name="GLOBE" /></Full></>);
};

// 5 FLOW LINES: hackfests in order
const Flow: React.FC<SP> = () => {
  const f = useCurrentFrame(); const d = useDuration();
  const cam = moveCam(f, WORLD_CAM, camAt(10, 32, 2.6), 0, 30);
  const step = (d - 70) / (HF.length - 1);
  const k = flowIndex(f, 30, step, HF.length);
  const h = HF[Math.max(0, k - 1)];
  return (<>
    <WorldMap data={D} cam={cam}><FlowLines pts={HF.map((x) => x.p)} cam={cam} start={30} step={step} /></WorldMap>
    <Full><Badge n={5} name="FLOW LINES" /><MapTag x={1600} y={200} text={`${h.year} · ${h.place === 'Lisboa' ? 'Lisbon' : h.place}`} k={springPop(f, 26)} size={38} /></Full>
  </>);
};

// HOST
const Intro: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  const names = ['CHOROPLETH', 'PROVINCES', 'DISPUTED', 'GLOBE', 'FLOW', 'MAPIMATOR'];
  return (<Stage>
    {names.map((n, i) => <g key={n} transform={`translate(${1020 + (i % 2) * 230} ${330 + Math.floor(i / 2) * 150}) rotate(${i % 2 ? 3 : -3}) scale(${springPop(f, 26 + i * 5)})`}>
      <rect x={-105} y={-55} width={210} height={110} rx={12} fill={[QC.sea, '#F6C88D', '#E9A6A0', '#9FD6CF', QC.paper, '#2B3440'][i]} stroke={QC.ink} strokeWidth={4} />
      <text y={12} textAnchor="middle" fontFamily="TagBold" fontSize={24} fill={i === 5 ? '#F4ECD8' : QC.ink}>{n}</text>
    </g>)}
    <Host x={1520} keys={[{ at: 0, arm: 'present', expr: 'grin' }]} talking={talk(s)} />
  </Stage>);
};
const Outro: React.FC<SP> = ({ s }) => {
  const f = useCurrentFrame();
  return (<Stage>
    {['TERRAIN', 'SATELLITE', '3D'].map((n, i) => <MapTag key={n} x={1100} y={330 + i * 130} text={n} k={springPop(f, wordAt(s, 'real') + 10 + i * 8)} size={44} bg={['#8A6A44', '#2F5E2B', QC.dark][i]} />)}
    <Host x={1420} keys={[{ at: 0, arm: 'present', expr: 'smile' }, { at: wordAt(s, 'real'), arm: 'finger', expr: 'grin' }]} talking={talk(s)} />
  </Stage>);
};

/** Mapimator scenes are rendered separately; MapExtras draws on top of them. */
const MapBadge: React.FC<SP> = () => <Full><Badge n={6} name="MAPIMATOR" /></Full>;
export const MapExtras = { 'map:march1812': MapBadge };

const Opening: React.FC<SP> = () => <div style={{ position: 'absolute', inset: 0, background: '#C4C4C4' }} />;
export const SHOTS: ShotMap = { opening: Opening, end: makeEnd('QGIS Map Styles'), z_intro: Intro, z_choro: Choro, z_prov: Prov, z_disp: Disp, z_globe: GlobeShot, z_flow: Flow, z_outro: Outro };
