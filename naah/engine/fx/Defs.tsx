import React from 'react';

/** Shared SVG defs (patterns, filters, gradients) referenced document-wide by id. */
export const GlobalDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: 'absolute' }}>
    <defs>
      {/* hand-drawn wobble for line art */}
      <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={7} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={3.2} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="wobbleSoft" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={3} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={2.2} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="18" />
      </filter>
      <filter id="sil" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0 0 0 0 0.09  0 0 0 0 0.07  0 0 0 0 0.06  0 0 0 1 0" />
      </filter>
      <filter id="blur6"><feGaussianBlur stdDeviation="6" /></filter>
      <filter id="blur2"><feGaussianBlur stdDeviation="2" /></filter>

      {/* dhaka cloth: cream base with red/black/white geometric diamonds */}
      <pattern id="dhaka" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
        <rect width="22" height="22" fill="#F1E6D0" />
        <path d="M11 1 L21 11 L11 21 L1 11 Z" fill="#B3261E" />
        <path d="M11 6 L16 11 L11 16 L6 11 Z" fill="#1E1A1A" />
        <path d="M11 9 L13 11 L11 13 L9 11 Z" fill="#F1E6D0" />
        <rect x="0" y="0" width="3" height="3" fill="#2A5A9C" />
      </pattern>
      <pattern id="dhakaSmall" width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill="#EFE3CB" />
        <path d="M7 1 L13 7 L7 13 L1 7 Z" fill="#B3261E" />
        <path d="M7 4 L10 7 L7 10 L4 7 Z" fill="#1E1A1A" />
      </pattern>
      <pattern id="brick" width="40" height="20" patternUnits="userSpaceOnUse">
        <rect width="40" height="20" fill="#A84A32" />
        <path d="M0 0.5 H40 M0 10.5 H40 M20 0 V10 M0 10 V20 M40 10 V20" stroke="#7E3322" strokeWidth="1.6" />
      </pattern>
      <pattern id="paving" width="60" height="30" patternUnits="userSpaceOnUse">
        <rect width="60" height="30" fill="#B9AE9C" />
        <path d="M0 0.5 H60 M0 15.5 H60 M30 0 V15 M0 15 V30 M60 15 V30" stroke="#9C9180" strokeWidth="1.5" />
      </pattern>
      <pattern id="woodgrain" width="300" height="46" patternUnits="userSpaceOnUse">
        <rect width="300" height="46" fill="#B08A5A" />
        <path d="M0 8 C80 4 160 12 300 7 M0 30 C90 34 180 25 300 31" stroke="#8E6C42" strokeWidth="3" fill="none" />
        <path d="M0 45 H300" stroke="#7A5A34" strokeWidth="2" />
      </pattern>
      <pattern id="terrace" width="120" height="26" patternUnits="userSpaceOnUse">
        <rect width="120" height="26" fill="#9DBB5E" />
        <path d="M0 24 C30 20 90 28 120 23" stroke="#6E8F3A" strokeWidth="3" fill="none" />
      </pattern>

      <radialGradient id="insertBg" cx="50%" cy="48%" r="70%">
        <stop offset="0%" stopColor="#3C5A3E" />
        <stop offset="45%" stopColor="#1F3A33" />
        <stop offset="100%" stopColor="#0B1512" />
      </radialGradient>
      <radialGradient id="warmGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#E3A23A" stopOpacity="0.75" />
        <stop offset="60%" stopColor="#B8742A" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#B8742A" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="whiteGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#E8EEF2" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#E8EEF2" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFE9A8" stopOpacity="0.95" />
        <stop offset="40%" stopColor="#FFC46B" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#FF9A4A" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5E9BCB" />
        <stop offset="100%" stopColor="#A9CDE6" />
      </linearGradient>
      <linearGradient id="skyDawn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6E8FC0" />
        <stop offset="60%" stopColor="#E9B98F" />
        <stop offset="100%" stopColor="#F6D7A8" />
      </linearGradient>
      <linearGradient id="skySunrise" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3F4F8A" />
        <stop offset="45%" stopColor="#D9779A" />
        <stop offset="75%" stopColor="#F4A261" />
        <stop offset="100%" stopColor="#FFD58A" />
      </linearGradient>
      <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#141F3A" />
        <stop offset="100%" stopColor="#2E3F66" />
      </linearGradient>
      <linearGradient id="skyDust" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#9C958C" />
        <stop offset="100%" stopColor="#C4B9A8" />
      </linearGradient>
      <linearGradient id="captionBand" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.45" />
      </linearGradient>
    </defs>
  </svg>
);
