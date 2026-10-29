/**
 * gallery: a visual catalogue of the reusable library. Each beat is one contact page; render with
 *   node scripts/studio.mjs gallery          (stills → docs/gallery/*.png)
 * Look at docs/gallery/ before drawing anything new: reuse, recolour or re-dress first.
 */
import React, { useLayoutEffect, useRef } from 'react';
import { CameraRig, Layer } from '@engine/fx/Camera';
import { Chibi } from '@engine/characters/Chibi';
import { Host } from '@engine/characters/Host';
import { W, HATS, type Costume } from '@engine/cast/Wardrobe';
import { Silhouette } from '@engine/cast/Silhouette';
import { Stamp, Counter, Note, Card, Calendar, Bars, CoinArc } from '@engine/fx/Infographics';
import { Label } from '@engine/fx/Overlays';
import { makeOpening, makeEnd, type ShotMap, type SP } from '@engine/kit';
import * as BG from '@engine/scenes/Backgrounds';
import * as PT from '@engine/scenes/Parts';
import * as PR from '@engine/scenes/Props';
import * as IN from '@engine/scenes/India';
import * as I1 from '@engine/scenes/IndiaB1';
import * as I2 from '@engine/scenes/IndiaB2';
import * as I3 from '@engine/scenes/IndiaB3';
import * as I4 from '@engine/scenes/IndiaB4';
import * as FR from '@engine/scenes/FranceScenes';
import { FranceMap } from '@engine/scenes/France';
import * as VN from '@engine/scenes/Vietnam';

const OL = PT.OL;
const PAPER = '#EDE6D6';

/** Page frame: a light board with a title. */
const Page: React.FC<{ title: string; sub?: string; children: React.ReactNode; dark?: boolean }> = ({ title, sub, children, dark }) => (
  <CameraRig move={{ zoomFrom: 1, zoomTo: 1 }}>
    <Layer depth={0}>
      <rect x={-50} y={-50} width={2020} height={1180} fill={dark ? '#2A2A30' : PAPER} />
      <text x={40} y={62} fontFamily="TagBold" fontSize={44} fill={dark ? '#F4ECD8' : '#1A1410'}>{title}</text>
      {sub && <text x={1880} y={60} textAnchor="end" fontFamily="Tag" fontSize={26} fill={dark ? '#BDB6A8' : '#5A4A3A'}>{sub}</text>}
      {children}
    </Layer>
  </CameraRig>
);

/** Scales whatever it holds to fit a w×h box (measured with getBBox, no React state). */
const Fit: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode; max?: number }> = ({ x, y, w, h, children, max = 1.4 }) => {
  const outer = useRef<SVGGElement>(null);
  const inner = useRef<SVGGElement>(null);
  useLayoutEffect(() => {
    if (!outer.current || !inner.current) return;
    const b = inner.current.getBBox();
    if (!b.width || !b.height) return;
    const k = Math.min(w / b.width, h / b.height, max);
    outer.current.setAttribute('transform', `translate(${x + (w - b.width * k) / 2 - b.x * k} ${y + (h - b.height * k) / 2 - b.y * k}) scale(${k})`);
  });
  return <g ref={outer}><g ref={inner}>{children}</g></g>;
};

const Cap: React.FC<{ x: number; y: number; t: string; sub?: string; dark?: boolean }> = ({ x, y, t, sub, dark }) => (
  <>
    <text x={x} y={y} textAnchor="middle" fontFamily="TagBold" fontSize={t.length > 15 ? 17 : 22} fill={dark ? '#F4ECD8' : '#1A1410'}>{t}</text>
    {sub && <text x={x} y={y + 22} textAnchor="middle" fontFamily="Tag" fontSize={17} fill={dark ? '#BDB6A8' : '#6A5A4A'}>{sub}</text>}
  </>
);

/** Grid of items, each fitted into its cell with a caption. */
const Grid: React.FC<{ items: { t: string; sub?: string; el: React.ReactNode; frame?: boolean }[]; cols: number; rows: number; top?: number; dark?: boolean; pad?: number }> = ({ items, cols, rows, top = 100, dark, pad = 14 }) => {
  const cw = 1840 / cols, ch = (1060 - top) / rows;
  return <>{items.map((it, i) => {
    const cx = 40 + (i % cols) * cw, cy = top + Math.floor(i / cols) * ch;
    return <g key={i}>
      {it.frame
        ? (() => { const bw = cw - pad * 2, bh = ch - pad * 2 - 28, k = Math.min(bw / 1920, bh / 1080); return <g transform={`translate(${cx + pad + (bw - 1920 * k) / 2} ${cy + pad}) scale(${k})`}>{it.el}</g>; })()
        : <Fit x={cx + pad} y={cy + pad} w={cw - pad * 2} h={ch - pad * 2 - (it.sub ? 46 : 28)}>{it.el}</Fit>}
      <Cap x={cx + cw / 2} y={cy + ch - (it.sub ? 34 : 12)} t={it.t} sub={it.sub} dark={dark} />
    </g>;
  })}</>;
};

/** A full-frame background shrunk into a clipped thumbnail. */
const Thumb: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <g>
    <clipPath id={'th' + id}><rect x={0} y={0} width={1920} height={1080} /></clipPath>
    <g clipPath={`url(#th${id})`}>{children}</g>
    <rect x={0} y={0} width={1920} height={1080} fill="none" stroke={OL} strokeWidth={10} />
  </g>
);

const C = (c: Costume, extra: any = {}) => <Chibi x={0} y={0} s={1} {...(c as any)} pose="idle" expr="normal" talking={[]} seed="g" {...extra} />;
const people = (list: [string, Costume, string?][]) => list.map(([t, c, sub]) => ({ t, sub, el: C(c) }));

// ------------------------------------------------------------------ wardrobe pages
const Wardrobe1: React.FC<SP> = () => (
  <Page title="Wardrobe 1 · everyday people & royalty" sub="engine/cast/Wardrobe.ts · W.NAME">
    <Grid cols={9} rows={3} items={people([
      ['PEASANT', W.PEASANT()], ['PEASANT', W.PEASANT('#4A7A9A', 1), "('#4A7A9A', 1)"], ['MODERN', W.MODERN()], ['MODERN', W.MODERN('#8A3A5A', 1), '(c, 1)'], ['MODERN', W.MODERN('#3A7A4A', 2), '(c, 2)'], ['MODERN', W.MODERN('#C9862A', 3), '(c, 3)'],
      ['TEEN', W.TEEN()], ['PROTESTER', W.PROTESTER('#C0392B', 0, 'NO!'), "(c, i, 'NO!')"], ['HIVIS', W.HIVIS], ['SUIT', W.SUIT()], ['SUIT +glasses', W.SUIT('#2A2E3A', '#5A5A5A', { glasses: true }), "{ glasses: true }"], ['SUIT bald', W.SUIT('#5A5A64', '#E8E4DA', { hat: 'bald' }), "{ hat: 'bald' }"],
      ['OFFICIAL(i)', W.OFFICIAL(1)], ['LEADER', W.LEADER], ['ANCHOR', W.ANCHOR], ['DEPUTY', W.DEPUTY()], ['GOWN', W.GOWN, 'judge / scholar'], ['MONK', W.MONK()],
      ['CLERGY', W.CLERGY], ['POPE', W.POPE], ['SERVANT', W.SERVANT], ['KING', W.KING()], ['SUN_KING', W.SUN_KING], ['QUEEN', W.QUEEN()],
    ]).concat([{ t: 'NOBLE', sub: undefined, el: C(W.NOBLE()) }])} />
  </Page>
);
const Wardrobe2: React.FC<SP> = () => (
  <Page title="Wardrobe 2 · soldiers through the ages" sub="spread into <Chibi {...W.GI(0)} />">
    <Grid cols={7} rows={3} items={people([
      ['ROMAN', W.ROMAN], ['FRANK', W.FRANK], ['KNIGHT', W.KNIGHT()], ['TRICORN_GUARD', W.TRICORN_GUARD()], ['SANS_CULOTTE', W.SANS_CULOTTE()], ['GENERAL_1800', W.GENERAL_1800], ['GRENADIER', W.GRENADIER],
      ['PRUSSIAN', W.PRUSSIAN], ['POILU', W.POILU, 'WWI'], ['COLONIAL_SOLDIER', W.COLONIAL_SOLDIER()], ['COLONIAL_OFFICER', W.COLONIAL_OFFICER()], ['COLONIAL_OFFICIAL', W.COLONIAL_OFFICIAL], ['GENERAL_1940', W.GENERAL_1940], ['GI(0)', W.GI(0)],
      ['GI(2)', W.GI(2)], ['PILOT', W.PILOT], ['RIOT_POLICE', W.RIOT_POLICE], ['NVA', W.NVA], ['VC', W.VC], ['ARVN', W.ARVN], ['GENERAL_SEA', W.GENERAL_SEA],
    ])} />
  </Page>
);
const Wardrobe3: React.FC<SP> = () => (
  <Page title="Wardrobe 3 · Southeast Asia, re-dressing, silhouettes" sub="dress(W.GI(), { hat: 'cap', outfit: { top: '#8A3A2A' } })">
    <Grid cols={8} rows={2} top={100} items={[
      ...people([['FARMER_SEA', W.FARMER_SEA()], ['VILLAGER_SEA(c,0)', W.VILLAGER_SEA('#8A6A4A', 0)], ['VILLAGER_SEA(c,1)', W.VILLAGER_SEA('#5A7A8A', 1)], ['VILLAGER_SEA(c,2)', W.VILLAGER_SEA('#9A5A4A', 2)], ['ELDER_LEADER_SEA', W.ELDER_LEADER_SEA], ['YOUNG_ACTIVIST_SEA', W.YOUNG_ACTIVIST_SEA], ['STATESMAN_SEA()', W.STATESMAN_SEA()], ['STATESMAN_SEA(grey)', W.STATESMAN_SEA('#8A8A84', '#E8E4DA')]]),
      { t: 'GI()', el: C(W.GI()) },
      { t: "+ hat: 'pith'", el: C({ ...W.GI(), hat: 'pith', hatColor: '#C9B98A' }) },
      { t: '+ red top', el: C({ ...W.GI(), outfit: { ...W.GI().outfit, top: '#8A3A2A' } }) },
      { t: "+ item: 'banner'", el: C({ ...W.GI(), item: 'banner' }) },
      { t: "pose 'cheer'", el: C(W.GI(), { pose: 'cheer', expr: 'happy' }) },
      { t: 'Silhouette', sub: 'real people', el: <g transform="translate(0 0)"><Silhouette x={0} y={0} name="Prime Minister" role="2024–25" c="#1E2E6A" /></g> },
      { t: 'Silhouette', sub: 'costume={W.GENERAL_1940}', el: <Silhouette x={0} y={0} name="The General" role="1958" c="#5A6A4A" costume={W.GENERAL_1940} /> },
      { t: 'Host (narrator)', sub: 'never changes', el: <Host x={0} y={1000} keys={[{ at: 0, arm: 'present', expr: 'smile' }]} talking={[]} /> },
    ]} />
  </Page>
);
const Hats: React.FC<SP> = () => (
  <Page title="Hats · Chibi hat=…" sub="recolour with hatColor; hair colour with hair">
    <Grid cols={11} rows={3} items={HATS.map((h) => ({ t: h, el: C({ outfit: { top: '#5A6A8A', bottom: '#3A3A48' }, hat: h, hair: '#3A2416' }) }))} />
  </Page>
);
const POSES = ['idle', 'hold', 'point', 'raise', 'bothUp', 'cheer', 'present', 'cross', 'carry', 'attack', 'pass', 'scribble', 'hipAngry', 'pray', 'shrug', 'fist', 'wave', 'pull', 'chin'];
const EXPRS = ['normal', 'happy', 'calm', 'grin', 'shock', 'angry', 'sad', 'determined'];
const Poses: React.FC<SP> = () => (
  <Page title="Poses, legs & expressions" sub="pose / legs / expr (fixed or keyframed)">
    <Grid cols={10} rows={4} items={[
      ...POSES.map((p) => ({ t: p, el: C(W.MODERN('#3A5A8A', 0), { pose: p, item: p === 'hold' || p === 'attack' || p === 'carry' ? 'sword' : undefined }) })),
      ...['walk', 'march', 'sit', 'kneel'].map((l) => ({ t: 'legs ' + l, el: C(W.MODERN('#8A3A5A', 1), { legs: l }) })),
      ...EXPRS.map((e) => ({ t: 'expr ' + e, el: <g transform="scale(1.6)">{C(W.PEASANT('#C9862A'), { expr: e })}</g> })),
      ...['spear', 'shield', 'musket', 'flag', 'scroll', 'book', 'lamp', 'placard:VOTE'].map((it) => ({ t: 'item ' + it.split(':')[0], el: C(W.PEASANT('#4A7A9A', 1), { item: it, pose: 'hold' }) })),
    ]} />
  </Page>
);

// ------------------------------------------------------------------ backgrounds (full-frame)
const bgs = (list: [string, React.ReactNode][], key: string) => list.map(([t, el], i) => ({ t, frame: true, el: <Thumb id={key + i}>{el}</Thumb> }));
const Bg1: React.FC<SP> = () => (
  <Page title="Backgrounds 1 · general & Nepal" sub="engine/scenes/Backgrounds.tsx" dark>
    <Grid dark cols={4} rows={4} pad={10} items={bgs([
      ['GreyStage (host)', <BG.GreyStage />], ['InsertBg', <BG.InsertBg />], ['Himalaya', <BG.Himalaya />], ['Himalaya sunrise', <BG.Himalaya variant="sunrise" />],
      ['Valley', <BG.Valley />], ['Lumbini', <BG.Lumbini />], ['StupaHill', <BG.StupaHill />], ['Durbar', <BG.Durbar />],
      ['PalaceHall', <BG.PalaceHall />], ['HillBattle', <BG.HillBattle />], ['Jungle', <BG.Jungle />], ['FestivalNight', <BG.FestivalNight />],
      ['Street', <BG.Street />], ['Quake', <BG.Quake />], ['Quake rebuild', <BG.Quake rebuild={1} />], ['Yard-style: Hills+Tree', <><rect width={1920} height={1080} fill="url(#skyDay)" /><PT.Hills y={620} fill="#A8C07A" amp={30} seed="g" /><PT.Tree x={1500} y={800} s={1.2} /><rect x={0} y={800} width={1920} height={300} fill="#C9A66B" /></>],
    ], 'a')} />
  </Page>
);
const Bg2: React.FC<SP> = () => (
  <Page title="Backgrounds 2 · India (medieval → Mughal)" sub="engine/scenes/India*.tsx" dark>
    <Grid dark cols={4} rows={4} pad={10} items={bgs([
      ['Plain', <IN.Plain />], ['DelhiGate', <IN.DelhiGate />], ['DesertRoad', <IN.DesertRoad />], ['RajputFort', <IN.RajputFort />],
      ['Passes', <IN.Passes />], ['TempleVault', <IN.TempleVault />], ['SomnathCoast', <IN.SomnathCoast />], ['TentInterior', <IN.TentInterior />],
      ['SultanCourt', <I1.SultanCourt />], ['QutbMinar', <I1.QutbMinar />], ['Market', <I1.Market />], ['HotRoad', <I1.HotRoad />],
      ['Kitchen', <I1.Kitchen />], ['Study', <I1.Study />], ['Boulders', <I1.Boulders />], ['HampiStreet', <I2.HampiStreet />],
    ], 'b')} />
  </Page>
);
const Bg3: React.FC<SP> = () => (
  <Page title="Backgrounds 3 · India (Mughal → modern)" sub="engine/scenes/IndiaB2–B4.tsx" dark>
    <Grid dark cols={4} rows={4} pad={10} items={bgs([
      ['TajGarden', <I2.TajGarden />], ['AgraWindow', <I2.AgraWindow />], ['HillForts', <I2.HillForts />], ['DebateHall', <I2.DebateHall />],
      ['EmptyStreet', <I3.EmptyStreet />], ['TowerLondon', <I3.TowerLondon />], ['CompanyCoast', <I3.CompanyCoast />], ['EmptyVillage', <I3.EmptyVillage />],
      ['Westminster', <I3.Westminster />], ['NightPlatform', <I4.NightPlatform />], ['Shallows', <I4.Shallows />], ['Bungalow', <I4.Bungalow />],
      ['WheatFields', <I4.WheatFields />], ['Airfield', <I4.Airfield />], ['TechOffice', <I4.TechOffice />], ['DelhiParliament', <I4.DelhiParliament />],
    ], 'c')} />
  </Page>
);
const Bg4: React.FC<SP> = () => (
  <Page title="Backgrounds 4 · France & Vietnam" sub="engine/scenes/FranceScenes.tsx · Vietnam.tsx" dark>
    <Grid dark cols={5} rows={4} pad={10} items={bgs([
      ['Versailles', <FR.Versailles />], ['Bastille', <FR.Bastille />], ['ParisStreet', <FR.ParisStreet />], ['ParisStreet modern night', <FR.ParisStreet modern night />], ['TownHall', <FR.TownHall />],
      ['School', <FR.School />], ['Forest', <FR.Forest />], ['RoyalRoom', <FR.RoyalRoom />], ['Workshop', <FR.Workshop />], ['Cathedral', <FR.Cathedral />],
      ['Paddy', <VN.Paddy />], ['Village', <VN.Village />], ['Sea', <VN.Sea />], ['Sea night rough', <VN.Sea night rough={1} />], ['Valley (VN) guns', <VN.Valley guns={1} craters={4} />],
      ['Tunnels', <VN.Tunnels lamp={0} />], ['Rooftop', <VN.Rooftop />], ['CarrierDeck', <VN.CarrierDeck />], ['Plantation', <VN.Plantation />], ['MarsOrbit', <I4.MarsOrbit />],
    ], 'd')} />
  </Page>
);

// ------------------------------------------------------------------ objects
const Vehicles: React.FC<SP> = () => (
  <Page title="Vehicles, weapons & 20th-century buildings" sub="engine/scenes/Vietnam.tsx (usable in any modern film)">
    <Grid cols={7} rows={4} items={[
      { t: 'Huey', el: <VN.Huey x={0} y={0} /> }, { t: 'B52', el: <VN.B52 x={0} y={0} /> }, { t: 'Jet', el: <VN.Jet x={0} y={0} /> }, { t: 'Destroyer', el: <VN.Destroyer x={0} y={0} name="MADDOX" /> },
      { t: 'TorpedoBoat', el: <VN.TorpedoBoat x={0} y={0} /> }, { t: 'Tank', sub: 'num, star, color', el: <VN.Tank x={0} y={0} num="390" star /> }, { t: 'Artillery', el: <VN.Artillery x={0} y={0} /> },
      { t: 'LoadedBike', el: <VN.LoadedBike x={0} y={0} /> }, { t: 'TVSet', sub: 'children = screen', el: <VN.TVSet x={0} y={0} /> }, { t: 'WhiteHouse', el: <VN.WhiteHouse x={0} y={0} /> }, { t: 'Capitol', el: <VN.Capitol x={0} y={0} /> },
      { t: 'Embassy', el: <VN.Embassy x={0} y={0} /> }, { t: 'Palace', el: <VN.Palace x={0} y={0} /> }, { t: 'Citadel', el: <VN.Citadel x={0} y={0} /> },
      ...(['vn', 'svn', 'us', 'fr', 'cn', 'vc', 'white'] as const).map((k) => ({ t: `Flag ${k}`, el: <VN.Flag kind={k} x={0} y={0} /> })),
      { t: 'IndochinaMap', sub: 'split, parallel, pins', el: <VN.IndochinaMap x={0} y={0} s={0.5} labels split parallel={1} fills={{ north: '#D9584A', south: '#E8C65A' }} /> },
      { t: 'FranceMap', el: <FranceMap x={0} y={0} s={0.4} /> },
      { t: 'Factory', el: <I3.Factory x={0} y={0} /> }, { t: 'Loom', el: <I3.Loom x={0} y={0} /> }, { t: 'CompanyFlag', el: <I1.CompanyFlag x={0} y={0} /> },
      { t: 'Desk', el: <FR.Desk x={0} y={0} /> }, { t: 'Bill', el: <FR.Bill x={0} y={0} len={300} /> },
    ]} />
  </Page>
);
const Nature: React.FC<SP> = () => (
  <Page title="Animals, nature, buildings & props" sub="Parts.tsx · Props.tsx · India*.tsx · FranceScenes.tsx">
    <Grid cols={9} rows={4} items={[
      { t: 'Horse', sub: 'gait, saddle', el: <IN.Horse x={0} y={0} saddle /> }, { t: 'Camel', el: <IN.Camel x={0} y={0} load /> }, { t: 'Elephant', el: <IN.Elephant x={0} y={0} howdah /> },
      { t: 'Rhino', el: <PR.Rhino x={0} y={0} /> }, { t: 'Tiger', el: <PR.Tiger x={0} y={0} /> }, { t: 'SnowLeopard', el: <PR.SnowLeopard x={0} y={0} /> },
      ...(['rabbit', 'monkey', 'redpanda', 'yak', 'goat'] as const).map((k) => ({ t: `Critter ${k}`, el: <PT.Critter kind={k} x={0} y={0} /> })),
      { t: 'Tree', el: <PT.Tree x={0} y={0} /> }, { t: 'Pine', el: <PT.Pine x={0} y={0} /> }, { t: 'Bush', el: <PT.Bush x={0} y={0} /> }, { t: 'Fronds', el: <PT.Fronds x={0} y={0} /> },
      { t: 'Cloud', el: <PT.Cloud x={0} y={0} speed={0} /> }, { t: 'Hut', el: <PT.Hut x={0} y={0} /> }, { t: 'Pagoda', el: <PT.Pagoda x={0} y={0} /> }, { t: 'Stupa', el: <PT.Stupa x={0} y={0} /> },
      { t: 'Tent', el: <IN.Tent x={0} y={0} /> }, { t: 'TajMahal', el: <I2.TajMahal x={0} y={0} /> }, { t: 'StoneChariot', el: <I2.StoneChariot x={0} y={0} /> }, { t: 'PeacockThrone', el: <I2.PeacockThrone x={0} y={0} /> },
      { t: 'Flame', el: <PT.Flame x={0} y={0} /> }, { t: 'Diyo', el: <PT.Diyo x={0} y={0} /> }, { t: 'Crown', el: <PR.Crown x={0} y={0} /> }, { t: 'SmallCrown', el: <FR.SmallCrown x={0} y={0} /> },
      { t: 'Mitre', el: <FR.Mitre x={0} y={0} /> }, { t: 'FleurDeLis', el: <FR.FleurDeLis x={0} y={0} /> }, { t: 'Medal', el: <PR.Medal x={0} y={0} ribbon={['#C0392B', '#2E4A9A']} /> }, { t: 'Book', el: <PR.Book x={0} y={0} title="LAW" /> },
      { t: 'GlassCase', el: <PR.GlassCase x={0} y={0} /> }, { t: 'DalBhat', el: <PR.DalBhat x={0} y={0} /> }, { t: 'Momo', el: <PR.Momo x={0} y={0} /> }, { t: 'GdpPie', el: <IN.GdpPie x={0} y={0} share={0.25} label="25%" /> },
    ]} />
  </Page>
);
const Infographics: React.FC<SP> = () => (
  <>
    <Page dark title="Infographics · engine/fx/Infographics.tsx" sub="Stamp · Counter · Note · Card (HTML)  |  Calendar · Bars · CoinArc (SVG)">
      <Calendar x={260} y={420} s={0.8} month="JANUARY" day="30–31" year={1968} color="#C8102E" />
      <Bars x={620} y={700} max={600} h={420} w={110} gap={50} bars={[{ label: '1965', v: 184, c: '#2E3A6A', at: -60 }, { label: '1966', v: 385, c: '#2E3A6A', at: -60 }, { label: '1967', v: 486, c: '#2E3A6A', at: -60, text: '486k' }, { label: '1968', v: 536, c: '#C8102E', at: -60 }]} />
      <CoinArc from={[1300, 820]} to={[1760, 600]} start={0} n={30} every={3} />
      <Cap dark x={260} y={720} t="Calendar" sub="flipAt, from" />
      <Cap dark x={930} y={790} t="Bars" sub="sprung bars" />
      <Cap dark x={1530} y={880} t="CoinArc" sub="gravity parabola" />
      <Cap x={1530} y={600} t="" />
    </Page>
    <Stamp at={-60} left={1500} top={250} text="CLASSIFIED" />
    <Counter label="TROOPS:" value="543,000" left={1220} top={380} />
    <Note at={-60} text="corrects or adds precision to the narration." top={120} />
    <Card at={-60} left={760} top={200} text="BROAD WAR POWERS" size={40} sub="Card · sub line" />
    <Label text="Label (fx/Overlays)" x={1550} y={520} at={-60} size={40} />
  </>
);

export const SHOTS: ShotMap = {
  opening: makeOpening('Studio Gallery', 'Everything you can reuse'),
  wardrobe1: Wardrobe1, wardrobe2: Wardrobe2, wardrobe3: Wardrobe3, hats: Hats, poses: Poses,
  bg1: Bg1, bg2: Bg2, bg3: Bg3, bg4: Bg4, vehicles: Vehicles, nature: Nature, infographics: Infographics,
  end: makeEnd('Studio Gallery'),
};
