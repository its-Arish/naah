/**
 * FranceScenes.tsx — French places and props, in the house line style (OL outlines, flat fills).
 * Backgrounds fill the 1920×1080 frame and use <Layer depth> for parallax; props take x/y/s.
 */
import React from 'react';
import { useCurrentFrame, random, interpolate, Easing } from '../lib/core';
import { Layer } from '../fx/Camera';
import { OL, Cloud, Hills, Tree } from './Parts';

const SKY = (k: 'day' | 'dusk' | 'night' | 'grey') => ({ day: 'url(#skyDay)', dusk: 'url(#skyDawn)', night: '#1C2333', grey: '#9AA3AD' }[k]);

/** Tall French window with shutters. */
export const FrWindow: React.FC<{ x: number; y: number; w?: number; h?: number; lit?: boolean; shut?: boolean }> = ({ x, y, w = 46, h = 90, lit, shut }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={-h} width={w} height={h} fill={lit ? '#FFD98A' : '#3A4A5E'} stroke={OL} strokeWidth={3} />
    {!shut && <path d={`M0 ${-h} V0 M${-w / 2} ${-h * 0.55} H${w / 2}`} stroke={OL} strokeWidth={2} />}
    {shut && <><rect x={-w / 2} y={-h} width={w / 2} height={h} fill="#6E8A7A" stroke={OL} strokeWidth={2} /><rect x={0} y={-h} width={w / 2} height={h} fill="#6E8A7A" stroke={OL} strokeWidth={2} /></>}
    <rect x={-w / 2 - 5} y={-h - 8} width={w + 10} height={8} fill="#E8DCC0" stroke={OL} strokeWidth={2} />
  </g>
);

/** The palace of Versailles, central block with wings and gilded gate. */
export const Versailles: React.FC<{ dusk?: boolean; gate?: boolean }> = ({ dusk, gate = true }) => (
  <>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={SKY(dusk ? 'dusk' : 'day')} /><Cloud x={200} y={150} /><Cloud x={1400} y={110} s={0.8} speed={0.3} /></Layer>
    <Layer depth={0.5}>
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${960 + side * 560} 0)`}>
          <rect x={-330} y={420} width={660} height={300} fill="#EADBB8" stroke={OL} strokeWidth={4} />
          <rect x={-340} y={400} width={680} height={24} fill="#D6C49C" stroke={OL} strokeWidth={3} />
          {[...Array(9)].map((_, i) => <FrWindow key={i} x={-280 + i * 70} y={700} w={34} h={80} />)}
          {[...Array(9)].map((_, i) => <FrWindow key={'u' + i} x={-280 + i * 70} y={590} w={34} h={70} />)}
        </g>
      ))}
      <rect x={640} y={330} width={640} height={390} fill="#F0E2C2" stroke={OL} strokeWidth={5} />
      <path d="M620 330 L960 250 L1300 330 Z" fill="#7A8AA0" stroke={OL} strokeWidth={5} />
      <rect x={900} y={262} width={120} height={30} fill="#E2B13C" stroke={OL} strokeWidth={3} />
      {[...Array(7)].map((_, i) => <FrWindow key={i} x={700 + i * 87} y={700} w={44} h={110} />)}
      {[...Array(7)].map((_, i) => <FrWindow key={'u' + i} x={700 + i * 87} y={540} w={44} h={90} />)}
      <circle cx={960} cy={300} r={18} fill="#E2B13C" stroke={OL} strokeWidth={3} />
    </Layer>
    <Layer depth={1}>
      <rect x={-200} y={720} width={2400} height={500} fill="#D9C9A0" stroke={OL} strokeWidth={4} />
      <path d="M-200 820 L2200 820" stroke="#C4B282" strokeWidth={3} />
      {gate && (
        <g>
          {[...Array(25)].map((_, i) => <path key={i} d={`M${560 + i * 33} 840 V700 l-5 -14 l10 0 z`} stroke="#1A1410" strokeWidth={4} fill="#E2B13C" />)}
          <rect x={556} y={835} width={808} height={10} fill="#1A1410" />
          <circle cx={960} cy={690} r={30} fill="#E2B13C" stroke={OL} strokeWidth={4} />
        </g>
      )}
    </Layer>
  </>
);

/** The Bastille: eight round towers and curtain walls. silhouette = distant, smoky, restrained. */
export const Bastille: React.FC<{ silhouette?: boolean; smoke?: boolean; night?: boolean }> = ({ silhouette, smoke, night }) => {
  const f = useCurrentFrame();
  const stone = silhouette ? '#3A3440' : '#8F8A80', dark = silhouette ? '#2A2530' : '#6E6A62';
  return (
    <>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={night ? SKY('night') : silhouette ? '#B8A68E' : SKY('day')} /></Layer>
      <Layer depth={0.6}>
        <rect x={560} y={380} width={800} height={380} fill={stone} stroke={OL} strokeWidth={silhouette ? 0 : 4} />
        {[600, 820, 1100, 1320].map((x, i) => (
          <g key={i}>
            <rect x={x - 70} y={300} width={140} height={460} rx={20} fill={dark} stroke={OL} strokeWidth={silhouette ? 0 : 4} />
            {[...Array(4)].map((_, k) => <rect key={k} x={x - 66 + k * 36} y={284} width={24} height={20} fill={dark} />)}
            {!silhouette && <rect x={x - 8} y={420} width={16} height={34} fill="#2A2530" />}
          </g>
        ))}
        {!silhouette && <rect x={900} y={640} width={120} height={120} fill="#3A2A22" stroke={OL} strokeWidth={4} />}
      </Layer>
      {smoke && (
        <Layer depth={0.7}>
          {[...Array(7)].map((_, i) => {
            const t = (f + i * 23) % 160;
            return <circle key={i} cx={700 + i * 90 + Math.sin((f + i * 30) / 30) * 30} cy={360 - t * 2} r={40 + t * 0.7} fill="#5A5560" opacity={0.45 * (1 - t / 160)} />;
          })}
        </Layer>
      )}
      <Layer depth={1}><rect x={-200} y={760} width={2400} height={500} fill={silhouette ? '#7A6A58' : '#B8A47E'} stroke={OL} strokeWidth={4} /></Layer>
    </>
  );
};

/** A street of old Paris / a French town: tall cream façades, grey-blue roofs. */
export const ParisStreet: React.FC<{ night?: boolean; empty?: boolean; modern?: boolean }> = ({ night, modern }) => {
  const sky = night ? SKY('night') : SKY('day');
  return (
    <>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={sky} />{!night && <Cloud x={500} y={120} s={0.8} />}</Layer>
      <Layer depth={0.5}>
        {[...Array(6)].map((_, i) => {
          const x = -120 + i * 380, h = 520 + (i % 3) * 40;
          return (
            <g key={i}>
              <rect x={x} y={780 - h} width={360} height={h} fill={i % 2 ? '#EDE0C4' : '#E4D6B6'} stroke={OL} strokeWidth={4} />
              <path d={`M${x - 10} ${780 - h} L${x + 40} ${700 - h} L${x + 320} ${700 - h} L${x + 370} ${780 - h} Z`} fill="#7C8AA0" stroke={OL} strokeWidth={4} />
              {[...Array(3)].map((_, r) => [...Array(4)].map((_, c) => <FrWindow key={r + '-' + c} x={x + 55 + c * 85} y={780 - h + 130 + r * 140} w={42} h={90} lit={night && random('w' + i + r + c) > 0.6} />))}
              <path d={`M${x} ${780 - h + 150} H${x + 360}`} stroke="#1A1410" strokeWidth={3} />
            </g>
          );
        })}
      </Layer>
      <Layer depth={1}>
        <rect x={-200} y={780} width={2400} height={500} fill={night ? '#3A3A44' : '#9A9488'} stroke={OL} strokeWidth={4} />
        <path d="M-200 860 H2200" stroke={night ? '#2A2A30' : '#857F74'} strokeWidth={6} />
        {modern && [300, 1300].map((x, i) => <g key={i}><rect x={x} y={560} width={10} height={300} fill="#2A3A3A" /><circle cx={x + 5} cy={556} r={16} fill={night ? '#FFE9A0' : '#C8D0D0'} stroke={OL} strokeWidth={3} /></g>)}
      </Layer>
    </>
  );
};

/** A 19th-century French town hall (hôtel de ville) with a bell tower. smoulder = night, a single distant glow, no flames shown. */
export const TownHall: React.FC<{ night?: boolean; smoulder?: boolean; label?: string }> = ({ night, smoulder, label = 'HÔTEL DE VILLE' }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={night ? SKY('night') : SKY('day')} />{night && [...Array(40)].map((_, i) => <circle key={i} cx={random('s' + i) * 1920} cy={random('t' + i) * 400} r={1.6} fill="#fff" opacity={0.6} />)}</Layer>
      <Layer depth={0.5}>
        <rect x={460} y={380} width={1000} height={400} fill={night ? '#5A5868' : '#E8DCC0'} stroke={OL} strokeWidth={5} />
        <path d="M440 380 L960 300 L1480 380 Z" fill={night ? '#3A3A4A' : '#7C8AA0'} stroke={OL} strokeWidth={5} />
        <rect x={900} y={140} width={120} height={180} fill={night ? '#5A5868' : '#E8DCC0'} stroke={OL} strokeWidth={5} />
        <path d="M890 140 L960 60 L1030 140 Z" fill={night ? '#3A3A4A' : '#7C8AA0'} stroke={OL} strokeWidth={5} />
        <circle cx={960} cy={210} r={34} fill="#F4F0E0" stroke={OL} strokeWidth={4} />
        <path d="M960 210 L960 186 M960 210 L978 218" stroke={OL} strokeWidth={4} />
        {[...Array(8)].map((_, i) => <FrWindow key={i} x={520 + i * 120} y={760} w={50} h={110} lit={false} />)}
        {[...Array(8)].map((_, i) => <FrWindow key={'u' + i} x={520 + i * 120} y={590} w={50} h={100} lit={false} />)}
        <text x={960} y={445} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill={night ? '#B8B8C8' : '#5A4A3A'} letterSpacing={4}>{label}</text>
        {[860, 960, 1060].map((x, i) => <path key={i} d={`M${x} 280 v-60 l40 12 l-40 12`} fill={['#2E4A9A', '#F4F7FA', '#C0392B'][i]} stroke={OL} strokeWidth={2} />)}
      </Layer>
      {smoulder && (
        <Layer depth={0.55}>
          <ellipse cx={960} cy={420} rx={420} ry={160} fill="#E8862A" opacity={0.18 + 0.05 * Math.sin(f / 9)} />
          {[...Array(6)].map((_, i) => { const t = (f + i * 27) % 170; return <circle key={i} cx={820 + i * 50 + Math.sin((f + i * 40) / 25) * 20} cy={360 - t * 1.6} r={30 + t * 0.6} fill="#2A2A30" opacity={0.5 * (1 - t / 170)} />; })}
        </Layer>
      )}
      <Layer depth={1}><rect x={-200} y={780} width={2400} height={500} fill={night ? '#2E2E38' : '#B8B0A0'} stroke={OL} strokeWidth={4} /></Layer>
    </>
  );
};

/** A French lycée (high school) front with blockade of bins (no violence). */
export const School: React.FC<{ blockade?: boolean; banner?: string }> = ({ blockade, banner }) => (
  <>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={SKY('day')} /><Cloud x={300} y={130} /></Layer>
    <Layer depth={0.5}>
      <rect x={300} y={330} width={1320} height={450} fill="#E9DFC9" stroke={OL} strokeWidth={5} />
      <rect x={300} y={310} width={1320} height={30} fill="#C9B998" stroke={OL} strokeWidth={4} />
      <text x={960} y={392} textAnchor="middle" fontFamily="TagBold" fontSize={44} fill="#3A4A6A" letterSpacing={6}>LYCÉE</text>
      {[...Array(10)].map((_, i) => <FrWindow key={i} x={380 + i * 130} y={760} w={60} h={110} />)}
      {[...Array(10)].map((_, i) => <FrWindow key={'u' + i} x={380 + i * 130} y={590} w={60} h={110} />)}
      {banner && <g><rect x={560} y={430} width={800} height={70} fill="#F4F7FA" stroke={OL} strokeWidth={4} /><text x={960} y={480} textAnchor="middle" fontFamily="Hand" fontSize={48} fill="#C0392B">{banner}</text></g>}
    </Layer>
    <Layer depth={1}>
      <rect x={-200} y={780} width={2400} height={500} fill="#A9A194" stroke={OL} strokeWidth={4} />
      {blockade && [...Array(9)].map((_, i) => (
        <g key={i} transform={`translate(${620 + i * 80 + (i % 2) * 10} ${850 - (i % 3) * 6})`}>
          <rect x={-30} y={-80} width={60} height={80} rx={4} fill={['#2E7D4F', '#E2B13C', '#4A6A8A'][i % 3]} stroke={OL} strokeWidth={3} />
          <rect x={-34} y={-90} width={68} height={12} rx={3} fill="#3A3A3A" stroke={OL} strokeWidth={2} />
        </g>
      ))}
    </Layer>
  </>
);

/** A royal hunting forest. */
export const Forest: React.FC = () => (
  <>
    <Layer depth={0}><rect x={-200} y={-200} width={2400} height={1500} fill={SKY('day')} /></Layer>
    <Layer depth={0.3}><Hills y={560} fill="#7FA060" amp={40} seed="fo1" stroke={false} />{[...Array(10)].map((_, i) => <Tree key={i} x={-100 + i * 230} y={600} s={1.3} c="#5E8A48" c2="#4E7A3A" />)}</Layer>
    <Layer depth={0.6}>{[...Array(7)].map((_, i) => <Tree key={i} x={-50 + i * 320} y={760} s={1.8} />)}</Layer>
    <Layer depth={1}><rect x={-200} y={780} width={2400} height={500} fill="#8FAE5E" stroke={OL} strokeWidth={4} /></Layer>
  </>
);

/** A wooden writing desk with an open diary (the page is drawn separately by DiaryPage). */
export const Desk: React.FC<{ x: number; y: number; s?: number; candle?: boolean }> = ({ x, y, s = 1, candle = true }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-300} y={-20} width={600} height={30} fill="#7A4E2B" stroke={OL} strokeWidth={4} />
      <rect x={-280} y={10} width={30} height={200} fill="#6B4A2B" stroke={OL} strokeWidth={4} />
      <rect x={250} y={10} width={30} height={200} fill="#6B4A2B" stroke={OL} strokeWidth={4} />
      <path d="M-150 -20 L-140 -60 L0 -54 L140 -60 L150 -20 Z" fill="#F4ECD8" stroke={OL} strokeWidth={3} />
      <path d="M0 -54 V-20" stroke={OL} strokeWidth={2} />
      {candle && <g transform="translate(220 -20)"><rect x={-10} y={-70} width={20} height={70} fill="#F4F0E0" stroke={OL} strokeWidth={3} /><path d={`M0 -70 Q${-8 + Math.sin(f / 4) * 3} -92 0 -104 Q${8 + Math.sin(f / 5) * 3} -92 0 -70`} fill="#FFC94A" stroke="#E8862A" strokeWidth={2} /></g>}
    </g>
  );
};

/** A diary page filling the frame; `word` written in brown ink; bleed 0..1 spreads the ink like a stain. */
export const DiaryPage: React.FC<{ word: string; date?: string; write?: number; bleed?: number }> = ({ word, date = '14 juillet 1789', write = 1, bleed = 0 }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#3A2A22" />
    <g transform="rotate(-2 960 540)">
      <rect x={420} y={80} width={1080} height={920} fill="#F4ECD8" stroke={OL} strokeWidth={6} />
      {[...Array(14)].map((_, i) => <path key={i} d={`M480 ${200 + i * 56} H1440`} stroke="#C9BFA6" strokeWidth={2} />)}
      <path d="M560 80 V1000" stroke="#D9A0A0" strokeWidth={2} />
      <text x={600} y={180} fontFamily="Hand" fontSize={46} fill="#6B4A2B">{date}</text>
      {bleed > 0 && <ellipse cx={900} cy={470} rx={60 + 700 * bleed} ry={40 + 420 * bleed} fill="#5A3A22" opacity={0.85 * bleed} filter="url(#blur6)" />}
      <text x={900} y={500} textAnchor="middle" fontFamily="Hand" fontSize={180} fill="#5A3A22" strokeDasharray="1800" strokeDashoffset={1800 * (1 - write)} stroke="#5A3A22" strokeWidth={3} fillOpacity={write >= 1 ? 1 : 0}>{word}</text>
    </g>
  </g>
);

/** Gothic cathedral interior (baptism, coronation). */
export const Cathedral: React.FC<{ snow?: boolean }> = ({ snow }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer depth={0}>
        <rect x={-200} y={-200} width={2400} height={1500} fill="#4A4258" />
        {[...Array(5)].map((_, i) => (
          <g key={i} transform={`translate(${160 + i * 400} 0)`}>
            <path d="M-90 760 V300 Q-90 120 0 80 Q90 120 90 300 V760 Z" fill="#6A6078" stroke={OL} strokeWidth={4} />
            <path d="M-50 600 V320 Q-50 200 0 170 Q50 200 50 320 V600 Z" fill={['#3E6BB0', '#C0392B', '#E2B13C', '#2E7D4F', '#8E44AD'][i]} opacity={0.75} stroke={OL} strokeWidth={3} />
            <circle cx={0} cy={260} r={30} fill="#F4D97A" opacity={0.6} />
          </g>
        ))}
        {[...Array(5)].map((_, i) => <path key={'ray' + i} d={`M${160 + i * 400 - 40} 300 L${160 + i * 400 - 220} 900 L${160 + i * 400 + 120} 900 L${160 + i * 400 + 40} 300 Z`} fill="#FFF3C0" opacity={0.08} />)}
      </Layer>
      {snow && <Layer depth={0.3}>{[...Array(40)].map((_, i) => <circle key={i} cx={(random('sx' + i) * 1920 + f * 0.6) % 1920} cy={(random('sy' + i) * 1080 + f * (1 + random('sv' + i))) % 1080} r={3 + random('sr' + i) * 3} fill="#fff" opacity={0.7} />)}</Layer>}
      <Layer depth={1}><rect x={-200} y={780} width={2400} height={500} fill="#8A7A6A" stroke={OL} strokeWidth={4} />{[...Array(12)].map((_, i) => <path key={i} d={`M${-200 + i * 200} 780 L${-260 + i * 220} 1100`} stroke="#7A6A5A" strokeWidth={3} />)}</Layer>
    </>
  );
};

/** Bishop's / pope's mitre, drawn above a chibi head at (x, y-headTop). */
export const Mitre: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = '#F4F7FA' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-42 0 L-36 -80 Q0 -120 36 -80 L42 0 Z" fill={color} stroke={OL} strokeWidth={4} />
    <path d="M0 -105 V0 M-38 -30 H38" stroke="#E2B13C" strokeWidth={8} />
  </g>
);

/** A small crown that can sit anywhere (e.g. above a wig). */
export const SmallCrown: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-40 0 L-44 -48 L-24 -28 L-10 -60 L0 -30 L10 -60 L24 -28 L44 -48 L40 0 Z" fill="#E2B13C" stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    {[-24, 0, 24].map((dx) => <circle key={dx} cx={dx} cy={-12} r={5} fill="#C0392B" />)}
  </g>
);

/** Fleur-de-lis (royal France). */
export const FleurDeLis: React.FC<{ x: number; y: number; s?: number; fill?: string }> = ({ x, y, s = 1, fill = '#E2B13C' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -60 Q-18 -30 0 0 Q18 -30 0 -60 Z M0 0 Q-40 -10 -44 -40 Q-20 -36 -8 -14 Z M0 0 Q40 -10 44 -40 Q20 -36 8 -14 Z M-26 6 H26 V16 H-26 Z M0 16 Q-14 40 -30 44 M0 16 Q14 40 30 44" fill={fill} stroke={OL} strokeWidth={4} strokeLinejoin="round" />
  </g>
);

/** Royal bedroom with tall window (the Fronde scene, Versailles interiors). */
export const RoyalRoom: React.FC<{ night?: boolean }> = ({ night }) => (
  <>
    <Layer depth={0}>
      <rect x={-200} y={-200} width={2400} height={1500} fill={night ? '#3A2E48' : '#9A5A4A'} />
      {[...Array(10)].map((_, i) => <rect key={i} x={-200 + i * 240} y={-200} width={6} height={1500} fill="#E2B13C" opacity={0.35} />)}
      <g transform="translate(1380 160)">
        <rect x={0} y={0} width={300} height={500} fill={night ? '#1C2333' : '#BFE3FF'} stroke={OL} strokeWidth={6} />
        <path d="M150 0 V500 M0 250 H300" stroke={OL} strokeWidth={4} />
        <path d="M-40 -20 Q-20 260 -40 540 L20 540 Q40 260 20 -20 Z M340 -20 Q320 260 340 540 L280 540 Q260 260 280 -20 Z" fill="#7A1E2E" stroke={OL} strokeWidth={4} />
      </g>
    </Layer>
    <Layer depth={1}><rect x={-200} y={780} width={2400} height={500} fill="#6B3A2A" stroke={OL} strokeWidth={4} />{[...Array(14)].map((_, i) => <path key={i} d={`M${-200 + i * 180} 780 L${-260 + i * 200} 1100`} stroke="#5A2E20" strokeWidth={3} />)}</Layer>
  </>
);

/** A locksmith's workbench with tools and locks (Louis XVI's hobby). */
export const Workshop: React.FC = () => (
  <>
    <Layer depth={0}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#8A6A4A" />
      {[...Array(8)].map((_, i) => <rect key={i} x={-200} y={-200 + i * 140} width={2400} height={6} fill="#6B4A2B" opacity={0.6} />)}
      <g transform="translate(300 220)">{[...Array(6)].map((_, i) => <g key={i} transform={`translate(${i * 110} ${(i % 2) * 30})`}><rect x={-30} y={0} width={60} height={70} rx={10} fill="#C9971C" stroke={OL} strokeWidth={4} /><path d="M-18 0 V-24 Q0 -50 18 -24 V0" stroke="#7A7A7A" strokeWidth={9} fill="none" /><circle cx={0} cy={34} r={8} fill={OL} /></g>)}</g>
    </Layer>
    <Layer depth={1}>
      <rect x={-200} y={780} width={2400} height={500} fill="#5A4030" stroke={OL} strokeWidth={4} />
      <rect x={200} y={640} width={1400} height={40} fill="#7A4E2B" stroke={OL} strokeWidth={5} />
      <rect x={240} y={680} width={40} height={140} fill="#6B4A2B" stroke={OL} strokeWidth={4} />
      <rect x={1520} y={680} width={40} height={140} fill="#6B4A2B" stroke={OL} strokeWidth={4} />
      <g transform="translate(420 640)"><rect x={-16} y={-60} width={32} height={60} fill="#7A7A7A" stroke={OL} strokeWidth={3} /><rect x={-50} y={-80} width={100} height={22} fill="#5A5A5A" stroke={OL} strokeWidth={3} /></g>
      <path d="M560 630 L640 600 M570 640 L660 640" stroke="#5A5A5A" strokeWidth={10} strokeLinecap="round" />
    </Layer>
  </>
);

/** Rolled scroll / bill of debt that can grow in length. */
export const Bill: React.FC<{ x: number; y: number; len: number; s?: number; text?: string; rot?: number }> = ({ x, y, len, s = 1, text = 'DEBT', rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-90} y={0} width={180} height={len} fill="#F4ECD8" stroke={OL} strokeWidth={4} />
    {[...Array(Math.max(0, Math.floor((len - 70) / 34)))].map((_, i) => <path key={i} d={`M-66 ${70 + i * 34} H${30 + (i % 3) * 18}`} stroke="#A89A7A" strokeWidth={4} />)}
    <rect x={-100} y={-16} width={200} height={32} rx={16} fill="#E0D2B0" stroke={OL} strokeWidth={4} />
    <text x={0} y={52} textAnchor="middle" fontFamily="TagBold" fontSize={34} fill="#B3261E">{text}</text>
    <rect x={-100} y={len - 16} width={200} height={32} rx={16} fill="#E0D2B0" stroke={OL} strokeWidth={4} />
  </g>
);
