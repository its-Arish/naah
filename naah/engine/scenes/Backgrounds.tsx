import React from 'react';
import { useCurrentFrame, onTwos, random, interpolate } from '../lib/core';
import { Layer } from '../fx/Camera';
import { OL, Cloud, Range, Hills, PrayerFlags, Hut, Tree, Pine, Bush, Fronds, Pagoda, Stupa, Diyo } from './Parts';

export const Himalaya: React.FC<{ variant?: 'day' | 'sunrise' }> = ({ variant = 'day' }) => {
  const sunrise = variant === 'sunrise';
  const f = useCurrentFrame();
  return (
    <>
      <Layer depth={0}>
        <rect x={-200} y={-200} width={2400} height={1500} fill={sunrise ? 'url(#skySunrise)' : 'url(#skyDay)'} />
        {sunrise && <circle cx={1180} cy={560 - Math.min(f, 200) * 0.25} r={260} fill="url(#sunGlow)" />}
        {sunrise && <circle cx={1180} cy={560 - Math.min(f, 200) * 0.25} r={70} fill="#FFE9A8" />}
      </Layer>
      <Layer depth={0.15}>
        <Range base={720} peaks={[[160, 330], [520, 380], [1460, 360], [1820, 300]]} rock={sunrise ? '#8C7A9C' : '#8E95A3'} snow={sunrise ? '#FFE6D6' : '#F4F7FA'} shade={sunrise ? '#D8B4C8' : '#C9D6E3'} />
        {/* Everest — the big one */}
        <Range base={740} peaks={[[960, 560]]} rock={sunrise ? '#7A6A8C' : '#7A7F8C'} snow={sunrise ? '#FFE0CC' : '#F4F7FA'} shade={sunrise ? '#D7A9BE' : '#C9D6E3'} snowLine={0.5} />
        <path d={`M972 ${190} q40 -6 ${70 + Math.sin(f / 20) * 6} ${-20}`} stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.7} fill="none" />
      </Layer>
      <Layer depth={0.25}>
        <Cloud x={200} y={260} s={1.1} speed={0.5} fill={sunrise ? '#F7D0C0' : '#F4F7FA'} />
        <Cloud x={1300} y={330} s={0.8} speed={0.35} fill={sunrise ? '#F7D0C0' : '#F4F7FA'} />
      </Layer>
      <Layer depth={0.45}>
        <Hills y={790} fill={sunrise ? '#5E6E4E' : '#7C9A5A'} amp={70} seed="hm1" />
      </Layer>
      <Layer depth={0.7}>
        <Hills y={880} fill={sunrise ? '#4E5E3E' : '#6E9B3C'} amp={50} seed="hm2" />
        <rect x={-200} y={890} width={2400} height={400} fill="url(#terrace)" opacity={sunrise ? 0.6 : 1} />
        <path d="M-200 890 L2200 890" stroke={OL} strokeWidth={3} />
      </Layer>
      <Layer depth={1.25}>
        <PrayerFlags x1={-60} y1={140} x2={620} y2={250} sag={70} n={14} />
        <path d="M-60 140 L-60 1100" stroke="#6B4A2B" strokeWidth={0} />
      </Layer>
    </>
  );
};

export const Valley: React.FC<{ tone?: 'dawn' | 'day' }> = ({ tone = 'dawn' }) => (
  <>
    <Layer depth={0}>
      <rect x={-200} y={-200} width={2400} height={1500} fill={tone === 'dawn' ? 'url(#skyDawn)' : 'url(#skyDay)'} />
      <circle cx={1500} cy={330} r={160} fill="url(#sunGlow)" />
    </Layer>
    <Layer depth={0.2}>
      <Hills y={470} fill="#8DA3B8" amp={90} seed="v0" />
      <Cloud x={300} y={200} s={0.9} speed={0.3} />
    </Layer>
    <Layer depth={0.4}>
      <Hills y={560} fill="#7C9A5A" amp={60} seed="v1" />
      <Hut x={300} y={600} s={0.6} /><Hut x={420} y={590} s={0.5} /><Hut x={1560} y={610} s={0.6} /><Hut x={1680} y={600} s={0.5} />
      <Tree x={200} y={620} s={0.5} /><Tree x={1780} y={630} s={0.55} />
    </Layer>
    <Layer depth={0.7}>
      <path d="M-200 650 L2200 650 L2200 1300 L-200 1300 Z" fill="#6E9B3C" stroke={OL} strokeWidth={3} />
      {/* river (Bagmati) */}
      <path d="M760 650 Q700 760 860 840 Q1040 930 900 1300 L1240 1300 Q1300 940 1040 840 Q900 780 860 650 Z" fill="#7FB7C9" stroke={OL} strokeWidth={3} />
      <RiverShimmer />
      <path d="M-200 760 Q300 740 600 790 L560 1300 L-200 1300 Z" fill="#9DBB5E" opacity={0.8} />
      <path d="M1400 760 Q1700 740 2200 780 L2200 1300 L1500 1300 Z" fill="#9DBB5E" opacity={0.8} />
    </Layer>
  </>
);

const RiverShimmer: React.FC = () => {
  const f = onTwos(useCurrentFrame(), 3);
  return (
    <g stroke="#E8F4F8" strokeWidth={4} strokeLinecap="round" opacity={0.8}>
      {[...Array(7)].map((_, i) => {
        const y = 700 + i * 80;
        const x = 850 + Math.sin(i * 2) * 60 + ((f + i * 13) % 40);
        return <path key={i} d={`M${x} ${y} h${30 + (i % 3) * 10}`} />;
      })}
    </g>
  );
};

export const Lumbini: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer depth={0}>
        <rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDawn)" />
        <circle cx={960} cy={420} r={520} fill="url(#sunGlow)" opacity={0.7 + Math.sin(f / 30) * 0.08} />
      </Layer>
      <Layer depth={0.3}>
        <Hills y={640} fill="#8FAE6A" amp={30} seed="lu" />
      </Layer>
      <Layer depth={0.6}>
        <path d="M-200 700 L2200 700 L2200 1300 L-200 1300 Z" fill="#7DA850" stroke={OL} strokeWidth={3} />
        {/* Maya Devi temple: white, simple */}
        <g transform="translate(1340 700)">
          <rect x={-170} y={-150} width={340} height={150} fill="#F7F4EE" stroke={OL} strokeWidth={3.5} />
          <rect x={-60} y={-230} width={120} height={80} fill="#F7F4EE" stroke={OL} strokeWidth={3.5} />
          <path d="M-70 -230 L0 -270 L70 -230 Z" fill="#E8E2D6" stroke={OL} strokeWidth={3} />
          <rect x={-30} y={-90} width={60} height={90} fill="#C9B79A" stroke={OL} strokeWidth={3} />
        </g>
        {/* pond */}
        <ellipse cx={760} cy={860} rx={300} ry={60} fill="#7FB7C9" stroke={OL} strokeWidth={3} />
        <path d="M600 860 h40 M780 880 h50 M880 850 h30" stroke="#E8F4F8" strokeWidth={4} strokeLinecap="round" />
        {/* lotus */}
        {[640, 820, 930].map((x, i) => (
          <g key={i} transform={`translate(${x} ${870 - (i % 2) * 14})`}>
            <path d="M-14 0 Q-16 -18 0 -24 Q16 -18 14 0 Z" fill="#F2B5C5" stroke={OL} strokeWidth={2} />
          </g>
        ))}
      </Layer>
      <Layer depth={0.85}>
        {/* the great sal / bodhi-like tree with prayer flags */}
        <g transform="translate(330 900)">
          <path d="M-30 0 Q-20 -200 -40 -330 L40 -330 Q20 -200 30 0 Z" fill="#6B4A2B" stroke={OL} strokeWidth={3.5} />
          <path d="M-320 -300 Q-360 -460 -200 -500 Q-160 -640 20 -610 Q200 -660 260 -500 Q380 -440 320 -300 Q0 -230 -320 -300 Z" fill="#4E8B3A" stroke={OL} strokeWidth={3.5} />
          <path d="M-200 -380 Q-140 -420 -80 -380 M60 -470 Q120 -510 180 -470 M-60 -540 Q0 -570 60 -540" stroke="#3C7030" strokeWidth={8} fill="none" />
        </g>
        <PrayerFlags x1={360} y1={520} x2={1220} y2={520} sag={90} n={18} />
      </Layer>
    </>
  );
};

export const StupaHill: React.FC = () => (
  <>
    <Layer depth={0}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDay)" />
    </Layer>
    <Layer depth={0.2}>
      <Hills y={620} fill="#8DA3B8" amp={80} seed="sh0" />
      <Cloud x={1400} y={180} s={1} speed={0.3} />
    </Layer>
    <Layer depth={0.55}>
      <path d="M200 1300 Q500 700 960 690 Q1420 700 1720 1300 Z" fill="#6E9B3C" stroke={OL} strokeWidth={3} />
      <Tree x={420} y={900} s={0.8} /><Tree x={1520} y={900} s={0.8} /><Pine x={560} y={820} s={0.7} /><Pine x={1380} y={820} s={0.7} />
      {/* radiating prayer flags from the spire */}
      <PrayerFlags x1={960} y1={225} x2={300} y2={760} sag={40} n={16} />
      <PrayerFlags x1={960} y1={225} x2={1620} y2={760} sag={40} n={16} />
      <Stupa x={960} y={720} s={1.05} />
    </Layer>
  </>
);

export const Durbar: React.FC<{ stretch?: [number, number, number]; labels?: boolean }> = ({ stretch = [1, 1, 1] }) => (
  <>
    <Layer depth={0}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDay)" />
    </Layer>
    <Layer depth={0.2}>
      <Cloud x={200} y={150} s={1} speed={0.3} />
      <Cloud x={1300} y={230} s={0.7} speed={0.25} />
      <Hills y={560} fill="#8DA3B8" amp={60} seed="du0" stroke={false} />
    </Layer>
    <Layer depth={0.55}>
      {/* back row of houses */}
      {[...Array(9)].map((_, i) => (
        <g key={i} transform={`translate(${-120 + i * 260} 760)`}>
          <rect x={0} y={-150 - (i % 3) * 20} width={240} height={150 + (i % 3) * 20} fill="url(#brick)" stroke={OL} strokeWidth={3} />
          <path d={`M-14 ${-150 - (i % 3) * 20} L120 ${-200 - (i % 3) * 20} L254 ${-150 - (i % 3) * 20} Z`} fill="#6E4A30" stroke={OL} strokeWidth={3} />
          <rect x={40} y={-110} width={40} height={50} fill="#4A2E1E" stroke={OL} strokeWidth={2.5} />
          <rect x={150} y={-110} width={40} height={50} fill="#4A2E1E" stroke={OL} strokeWidth={2.5} />
        </g>
      ))}
    </Layer>
    <Layer depth={0.8}>
      <path d="M-200 760 L2200 760 L2200 1300 L-200 1300 Z" fill="url(#paving)" stroke={OL} strokeWidth={3} />
      <Pagoda x={420} y={850} s={0.95} tiers={3} stretch={stretch[0]} />
      <Pagoda x={960} y={820} s={1.05} tiers={3} stretch={stretch[1]} />
      <Pagoda x={1500} y={850} s={0.95} tiers={2} stretch={stretch[2]} />
      <PrayerFlags x1={-40} y1={300} x2={680} y2={330} sag={80} n={16} />
      <PrayerFlags x1={1260} y1={330} x2={1980} y2={300} sag={80} n={16} />
    </Layer>
  </>
);

export const PalaceHall: React.FC<{ throne?: boolean }> = ({ throne = true }) => (
  <>
    <Layer depth={0.3}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="url(#woodgrain)" />
      {/* window to the hills */}
      <g transform="translate(1600 260)">
        <rect x={0} y={0} width={210} height={250} fill="url(#skyDay)" stroke={OL} strokeWidth={5} />
        <path d="M0 200 Q60 150 120 180 Q170 150 210 190 L210 250 L0 250 Z" fill="#7C9A5A" />
        <path d="M105 0 V250" stroke="#6E4A30" strokeWidth={8} />
      </g>
      {/* banner */}
      <g transform="translate(1180 170)">
        <rect x={0} y={0} width={110} height={190} fill="#8C1D18" stroke={OL} strokeWidth={3} />
        <circle cx={55} cy={90} r={34} fill="#E2B13C" stroke={OL} strokeWidth={3} />
        <path d="M55 64 v52 M29 90 h52" stroke="#8C1D18" strokeWidth={6} />
      </g>
    </Layer>
    <Layer depth={0.6}>
      <path d="M-200 760 L2200 760 L2200 1300 L-200 1300 Z" fill="#C49A63" stroke={OL} strokeWidth={3} />
      {[...Array(8)].map((_, i) => <path key={i} d={`M${-200 + i * 320} 760 L${-400 + i * 400} 1300`} stroke="#A67E4A" strokeWidth={3} />)}
      {/* pillars */}
      {[300, 1500].map((x) => (
        <g key={x}>
          <rect x={x - 40} y={-100} width={80} height={880} fill="#9C7347" stroke={OL} strokeWidth={4} />
          <rect x={x - 54} y={740} width={108} height={40} fill="#7A5A34" stroke={OL} strokeWidth={3} />
          <path d={`M${x - 20} 0 V720`} stroke="#86603A" strokeWidth={6} />
        </g>
      ))}
      {/* rug */}
      <path d="M600 960 L1320 960 L1400 1080 L520 1080 Z" fill="#8C1D18" stroke={OL} strokeWidth={3} />
      <path d="M640 980 L1290 980 L1350 1064 L580 1064 Z" fill="none" stroke="#E2B13C" strokeWidth={5} />
      {throne && (
        <g transform="translate(960 800)">
          <path d="M-150 0 L150 0 L130 -50 L-130 -50 Z" fill="#7A5A34" stroke={OL} strokeWidth={3} />
          <path d="M-90 -50 L-100 -300 Q0 -360 100 -300 L90 -50 Z" fill="#8C1D18" stroke={OL} strokeWidth={4} />
          <path d="M-100 -300 Q0 -360 100 -300" stroke="#E2B13C" strokeWidth={10} fill="none" />
          <rect x={-120} y={-140} width={36} height={90} fill="#E2B13C" stroke={OL} strokeWidth={3} />
          <rect x={84} y={-140} width={36} height={90} fill="#E2B13C" stroke={OL} strokeWidth={3} />
        </g>
      )}
    </Layer>
  </>
);

export const HillBattle: React.FC = () => {
  const f = onTwos(useCurrentFrame(), 2);
  return (
    <>
      <Layer depth={0}>
        <rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDay)" />
      </Layer>
      <Layer depth={0.2}>
        <Range base={560} peaks={[[300, 260], [900, 300], [1600, 280]]} />
        <Cloud x={600} y={120} s={0.9} speed={0.4} />
      </Layer>
      <Layer depth={0.45}>
        <Hills y={640} fill="#6E8F4A" amp={80} seed="hb1" />
        {/* hill fort */}
        <g transform="translate(1520 560)">
          <path d="M-180 60 L-160 -60 L160 -60 L180 60 Z" fill="#9C9180" stroke={OL} strokeWidth={3} />
          {[...Array(8)].map((_, i) => <rect key={i} x={-160 + i * 42} y={-80} width={24} height={22} fill="#9C9180" stroke={OL} strokeWidth={2.5} />)}
          <path d="M-20 -80 V-200" stroke="#6B4A2B" strokeWidth={6} />
          <g transform={`translate(-17 -200) scale(0.7)`}><path d={`M0 0 L${92 + Math.sin(f / 4) * 6} 62 L38 62 L${92 - Math.sin(f / 4) * 6} 122 L0 122 Z`} fill="#DC143C" stroke="#003893" strokeWidth={8} /></g>
        </g>
      </Layer>
      <Layer depth={0.75}>
        <path d="M-200 820 Q600 760 1200 800 Q1700 830 2200 790 L2200 1300 L-200 1300 Z" fill="#7C9A5A" stroke={OL} strokeWidth={3} />
        {/* puffs of smoke */}
        {[...Array(5)].map((_, i) => {
          const t = ((f + i * 23) % 90) / 90;
          return <circle key={i} cx={300 + i * 330 + t * 40} cy={760 - t * 200} r={30 + t * 50} fill="#E8E2D6" opacity={(1 - t) * 0.7} stroke={OL} strokeWidth={2} strokeOpacity={(1 - t) * 0.5} />;
        })}
      </Layer>
      <Layer depth={1.3}>
        <Bush x={80} y={1100} s={2.2} c="#2F4A2A" />
        <Bush x={1860} y={1100} s={2.4} c="#2F4A2A" />
      </Layer>
    </>
  );
};

export const Street: React.FC<{ festive?: boolean }> = ({ festive }) => (
  <>
    <Layer depth={0}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDay)" />
      <Cloud x={500} y={120} s={1} speed={0.4} />
    </Layer>
    <Layer depth={0.5}>
      {[...Array(8)].map((_, i) => {
        const h = 380 + (i % 3) * 70;
        return (
          <g key={i} transform={`translate(${-160 + i * 290} 760)`}>
            <rect x={0} y={-h} width={270} height={h} fill={i % 2 ? 'url(#brick)' : '#D8C2A0'} stroke={OL} strokeWidth={3} />
            {[...Array(3)].map((_, r) => (
              <g key={r}>
                <rect x={40} y={-h + 50 + r * 110} width={50} height={64} fill="#4A2E1E" stroke={OL} strokeWidth={2.5} />
                <rect x={170} y={-h + 50 + r * 110} width={50} height={64} fill="#4A2E1E" stroke={OL} strokeWidth={2.5} />
              </g>
            ))}
            <path d={`M-12 ${-h} L282 ${-h} L270 ${-h - 22} L0 ${-h - 22} Z`} fill="#6E4A30" stroke={OL} strokeWidth={3} />
          </g>
        );
      })}
      <PrayerFlags x1={-50} y1={260} x2={2000} y2={260} sag={110} n={30} />
    </Layer>
    <Layer depth={0.8}>
      <path d="M-200 760 L2200 760 L2200 1300 L-200 1300 Z" fill="#9C9180" stroke={OL} strokeWidth={3} />
    </Layer>
  </>
);

export const Jungle: React.FC = () => {
  const f = onTwos(useCurrentFrame(), 2);
  return (
    <>
      <Layer depth={0}>
        <rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDay)" />
      </Layer>
      <Layer depth={0.25}>
        <Hills y={520} fill="#4E8B3A" amp={70} seed="j0" />
        {[...Array(10)].map((_, i) => <Tree key={i} x={-100 + i * 230} y={560 + (i % 2) * 20} s={0.9 + (i % 3) * 0.15} c="#2F6B3A" c2="#245A2E" />)}
      </Layer>
      <Layer depth={0.55}>
        <path d="M-200 640 L2200 640 L2200 1300 L-200 1300 Z" fill="#B5B35C" stroke={OL} strokeWidth={3} />
        <path d="M-200 760 Q500 700 900 760 Q1400 830 2200 740 L2200 860 Q1400 930 900 860 Q500 800 -200 870 Z" fill="#7FB7C9" stroke={OL} strokeWidth={3} />
        <g stroke="#E8F4F8" strokeWidth={4} strokeLinecap="round">
          {[...Array(6)].map((_, i) => <path key={i} d={`M${100 + i * 330 + (f % 30)} ${790 + (i % 2) * 30} h40`} />)}
        </g>
      </Layer>
      <Layer depth={0.85}>
        {/* tall elephant grass */}
        {[...Array(26)].map((_, i) => {
          const x = -100 + i * 90;
          const sw = Math.sin(f / 8 + i) * 8;
          return <path key={i} d={`M${x} 1100 Q${x + 10} 960 ${x + sw} ${860 + (i % 4) * 20} Q${x + 20} 960 ${x + 26} 1100 Z`} fill={i % 2 ? '#A8A64E' : '#C2C06A'} stroke={OL} strokeWidth={2} />;
        })}
      </Layer>
    </>
  );
};

export const FestivalNight: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer depth={0}>
        <rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyNight)" />
        {[...Array(70)].map((_, i) => <circle key={i} cx={random('sx' + i) * 1920} cy={random('sy' + i) * 520} r={random('sr' + i) * 2 + 0.8} fill="#fff" opacity={0.5 + 0.5 * Math.sin(f / 9 + i)} />)}
        <circle cx={1500} cy={180} r={180} fill="url(#moonGlow)" />
        <circle cx={1500} cy={180} r={62} fill="#E8EEF2" stroke={OL} strokeWidth={2} />
        <circle cx={1480} cy={170} r={10} fill="#C9D6E3" /><circle cx={1520} cy={200} r={7} fill="#C9D6E3" />
      </Layer>
      <Layer depth={0.3}>
        <Hills y={600} fill="#24324F" amp={70} seed="fn" />
        {/* Dashain kites */}
        {[[380, 220, '#D1342E'], [700, 140, '#F2C230'], [1100, 260, '#2E9A4A']].map(([x, y, c], i) => (
          <g key={i} transform={`translate(${Number(x) + Math.sin(f / 15 + i) * 20} ${Number(y) + Math.cos(f / 12 + i) * 12}) rotate(${Math.sin(f / 10 + i) * 10})`}>
            <path d="M0 -40 L30 0 L0 40 L-30 0 Z" fill={String(c)} stroke={OL} strokeWidth={2.5} />
            <path d="M0 40 q10 30 -6 60 q-10 30 4 60" stroke="#E8EEF2" strokeWidth={1.5} fill="none" opacity={0.6} />
          </g>
        ))}
      </Layer>
      <Layer depth={0.6}>
        {[...Array(7)].map((_, i) => {
          const h = 300 + (i % 3) * 60;
          const x = -120 + i * 310;
          return (
            <g key={i} transform={`translate(${x} 800)`}>
              <rect x={0} y={-h} width={290} height={h} fill={i % 2 ? '#5A2E22' : '#4A3428'} stroke="#0E0A08" strokeWidth={3} />
              <path d={`M-12 ${-h} L302 ${-h} L290 ${-h - 22} L0 ${-h - 22} Z`} fill="#2E1E16" stroke="#0E0A08" strokeWidth={3} />
              {[...Array(2)].map((_, r) => (
                <g key={r}>
                  <rect x={50} y={-h + 50 + r * 120} width={50} height={64} fill="#F2B04A" opacity={0.85} stroke="#0E0A08" strokeWidth={2.5} />
                  <rect x={190} y={-h + 50 + r * 120} width={50} height={64} fill="#F2B04A" opacity={0.85} stroke="#0E0A08" strokeWidth={2.5} />
                </g>
              ))}
              {/* marigold garland */}
              <path d={`M0 ${-h + 10} Q145 ${-h + 70} 290 ${-h + 10}`} stroke="#F39C12" strokeWidth={12} strokeDasharray="2 12" strokeLinecap="round" fill="none" />
              {[...Array(6)].map((_, k) => <Diyo key={k} x={22 + k * 50} y={-4} s={0.9} i={i * 10 + k} />)}
            </g>
          );
        })}
      </Layer>
      <Layer depth={0.85}>
        <path d="M-200 800 L2200 800 L2200 1300 L-200 1300 Z" fill="#2F2A3A" stroke="#0E0A08" strokeWidth={3} />
        {/* rangoli */}
        <g transform="translate(960 960)">
          <ellipse rx={220} ry={60} fill="#D1342E" opacity={0.85} />
          <ellipse rx={160} ry={42} fill="#F2C230" opacity={0.9} />
          <ellipse rx={100} ry={26} fill="#2E9A4A" opacity={0.9} />
          <ellipse rx={44} ry={12} fill="#F4F7FA" />
        </g>
      </Layer>
    </>
  );
};

export const Quake: React.FC<{ rebuild?: number }> = ({ rebuild = 0 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Layer depth={0}>
        <rect x={-200} y={-200} width={2400} height={1500} fill="url(#skyDust)" />
      </Layer>
      <Layer depth={0.5}>
        {[...Array(6)].map((_, i) => {
          const tilt = rebuild > 0 ? 0 : (i % 2 ? 6 : -4);
          const broken = rebuild <= 0 || i % 3 === 0;
          const h = 300 + (i % 3) * 50;
          return (
            <g key={i} transform={`translate(${-60 + i * 350} 780) rotate(${tilt})`}>
              <path d={broken ? `M0 0 L0 ${-h} L120 ${-h + 40} L180 ${-h + 10} L300 ${-h + 90} L300 0 Z` : `M0 0 L0 ${-h} L300 ${-h} L300 0 Z`} fill={rebuild > 0 && !broken ? '#C98A6A' : '#8A8178'} stroke={OL} strokeWidth={3} />
              <path d={`M60 ${-h + 80} l40 60 l-20 40 l50 70`} stroke={OL} strokeWidth={3} fill="none" opacity={broken ? 1 : 0} />
              <rect x={40} y={-h + 120} width={50} height={60} fill="#4A4038" stroke={OL} strokeWidth={2.5} />
              <rect x={200} y={-h + 150} width={50} height={60} fill="#4A4038" stroke={OL} strokeWidth={2.5} />
            </g>
          );
        })}
      </Layer>
      <Layer depth={0.8}>
        <path d="M-200 780 L2200 780 L2200 1300 L-200 1300 Z" fill="#9C9180" stroke={OL} strokeWidth={3} />
        {/* rubble piles */}
        {[200, 760, 1400, 1780].map((x, i) => (
          <g key={i} transform={`translate(${x} 860)`}>
            {[...Array(7)].map((_, k) => <rect key={k} x={-80 + random('rb' + i + k) * 140} y={-40 + random('rc' + i + k) * 40} width={40} height={20} fill={k % 2 ? '#A84A32' : '#8A8178'} stroke={OL} strokeWidth={2.5} transform={`rotate(${random('rr' + i + k) * 60 - 30})`} />)}
          </g>
        ))}
        {rebuild <= 0 && [...Array(6)].map((_, i) => {
          const t = ((f + i * 17) % 80) / 80;
          return <circle key={i} cx={200 + i * 300 + t * 60} cy={800 - t * 260} r={40 + t * 80} fill="#C4B9A8" opacity={(1 - t) * 0.6} />;
        })}
      </Layer>
    </>
  );
};

/** The dark insert/close-up vignette. */
export const InsertBg: React.FC<{ glow?: boolean }> = ({ glow = true }) => (
  <Layer depth={0}>
    <rect x={-200} y={-200} width={2400} height={1500} fill="url(#insertBg)" />
    {glow && <circle cx={960} cy={500} r={520} fill="url(#warmGlow)" opacity={0.55} />}
  </Layer>
);

export const GreyStage: React.FC<{ dim?: number }> = ({ dim = 0 }) => (
  <Layer depth={0}>
    <rect x={-200} y={-200} width={2400} height={1500} fill={dim > 0 ? mixHex('#C4C4C4', '#5E5E5E', dim) : '#C4C4C4'} />
  </Layer>
);

export function mixHex(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const c = [16, 8, 0].map((sft) => Math.round(((pa >> sft) & 255) * (1 - t) + ((pb >> sft) & 255) * t));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}

export const ForegroundFronds: React.FC<{ c?: string }> = ({ c = '#16241C' }) => (
  <Layer depth={1.35}>
    <Fronds x={60} y={1110} s={1.4} c={c} />
    <Fronds x={1880} y={1110} s={1.4} c={c} flip />
  </Layer>
);

export { interpolate };
