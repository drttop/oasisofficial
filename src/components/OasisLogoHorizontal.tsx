import React from 'react';

export const OasisLogoHorizontal: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => {
  return (
    <svg 
      viewBox="0 0 1000 240" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Main Brushed Gold Gradient for Emblem & Letters */}
        <linearGradient id="oasis-gold-main" x1="0%" y1="10%" x2="100%" y2="90%">
          <stop offset="0%" stopColor="#C9943B" />
          <stop offset="15%" stopColor="#E9C168" />
          <stop offset="30%" stopColor="#FFF2B8" />
          <stop offset="48%" stopColor="#E2B155" />
          <stop offset="65%" stopColor="#A87328" />
          <stop offset="85%" stopColor="#F5D588" />
          <stop offset="100%" stopColor="#8C5718" />
        </linearGradient>

        {/* Highlight Gradient for Upper Curves */}
        <linearGradient id="oasis-gold-light" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FFF8D6" />
          <stop offset="35%" stopColor="#E8BF67" />
          <stop offset="70%" stopColor="#BF8832" />
          <stop offset="100%" stopColor="#6E4410" />
        </linearGradient>

        {/* Wave Specific Flow Gradient */}
        <linearGradient id="oasis-wave-grad1" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#D9A645" />
          <stop offset="35%" stopColor="#FFF0B0" />
          <stop offset="70%" stopColor="#C79237" />
          <stop offset="100%" stopColor="#7A4B12" />
        </linearGradient>

        <linearGradient id="oasis-wave-grad2" x1="0%" y1="30%" x2="100%" y2="70%">
          <stop offset="0%" stopColor="#BA862F" />
          <stop offset="40%" stopColor="#FDE191" />
          <stop offset="80%" stopColor="#9E681F" />
          <stop offset="100%" stopColor="#5E370C" />
        </linearGradient>

        {/* Soft Depth Shadows */}
        <filter id="oasis-glow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Main Container with Filter */}
      <g filter="url(#oasis-glow)">
        
        {/* ============================================================
            1. LEFT EMBLEM: Elegant 'O' Ring + Double Fluid Waves
           ============================================================ */}
        <g id="emblem-group" transform="translate(10, 0)">
          
          {/* Main Oval Ring 'O' */}
          <path
            d="M 115 15
               C 55 15, 8 68, 8 135
               C 8 165, 18 190, 35 208
               C 42 201, 52 195, 62 190
               C 42 175, 34 155, 34 135
               C 34 82, 70 42, 115 42
               C 160 42, 196 82, 196 135
               C 196 168, 178 198, 150 212
               C 178 200, 205 175, 215 145
               C 222 122, 222 68, 175 32
               C 158 19, 138 15, 115 15 Z"
            fill="url(#oasis-gold-main)"
          />

          {/* Upper Wave Ribbon */}
          <path
            d="M 2 205
               C 35 180, 80 180, 118 215
               C 155 248, 195 242, 218 210
               C 188 230, 150 232, 118 200
               C 80 162, 35 165, 2 205 Z"
            fill="url(#oasis-wave-grad1)"
          />

          {/* Lower Wave Ribbon */}
          <path
            d="M 25 228
               C 60 210, 100 212, 135 238
               C 162 258, 190 252, 210 230
               C 185 246, 155 248, 130 228
               C 95 200, 55 198, 25 228 Z"
            fill="url(#oasis-wave-grad2)"
          />
        </g>

        {/* ============================================================
            2. WORDMARK: 'O A S I S' in High-Class Serif Typography
           ============================================================ */}
        
        {/* Letter 'O' */}
        <g transform="translate(320, 32)">
          <path
            d="M 65 5
               C 28 5, 0 45, 0 98
               C 0 152, 28 192, 65 192
               C 102 192, 130 152, 130 98
               C 130 45, 102 5, 65 5 Z
               M 65 24
               C 85 24, 100 56, 100 98
               C 100 141, 85 173, 65 173
               C 45 173, 30 141, 30 98
               C 30 56, 45 24, 65 24 Z"
            fill="url(#oasis-gold-main)"
          />
        </g>

        {/* Letter 'A' */}
        <g transform="translate(490, 32)">
          <path
            d="M 52 5 L 76 5 L 128 178 L 140 178 L 140 190 L 98 190 L 98 178 L 110 178 L 98 140 L 32 140 L 20 178 L 32 178 L 32 190 L 0 190 L 0 178 L 12 178 L 52 5 Z
               M 65 38 L 39 122 L 91 122 Z"
            fill="url(#oasis-gold-main)"
          />
        </g>

        {/* Letter 'S' (First) */}
        <g transform="translate(660, 32)">
          <path
            d="M 85 20
               C 85 10, 72 5, 52 5
               C 25 5, 8 20, 8 46
               C 8 72, 26 86, 55 98
               C 78 108, 92 120, 92 144
               C 92 172, 70 192, 45 192
               C 22 192, 6 180, 4 158 L 24 158
               C 26 172, 35 178, 48 178
               C 68 178, 76 164, 76 145
               C 76 122, 60 110, 32 98
               C 12 88, 0 74, 0 46
               C 0 18, 22 0, 54 0
               C 78 0, 95 10, 96 32 L 76 32
               C 74 24, 68 20, 54 20 Z"
            fill="url(#oasis-gold-main)"
          />
        </g>

        {/* Letter 'I' */}
        <g transform="translate(805, 32)">
          <path
            d="M 5 5 L 45 5 L 45 20 L 32 20 L 32 175 L 45 175 L 45 190 L 5 190 L 5 175 L 18 175 L 18 20 L 5 20 Z"
            fill="url(#oasis-gold-main)"
          />
        </g>

        {/* Letter 'S' (Second) */}
        <g transform="translate(895, 32)">
          <path
            d="M 85 20
               C 85 10, 72 5, 52 5
               C 25 5, 8 20, 8 46
               C 8 72, 26 86, 55 98
               C 78 108, 92 120, 92 144
               C 92 172, 70 192, 45 192
               C 22 192, 6 180, 4 158 L 24 158
               C 26 172, 35 178, 48 178
               C 68 178, 76 164, 76 145
               C 76 122, 60 110, 32 98
               C 12 88, 0 74, 0 46
               C 0 18, 22 0, 54 0
               C 78 0, 95 10, 96 32 L 76 32
               C 74 24, 68 20, 54 20 Z"
            fill="url(#oasis-gold-main)"
          />
        </g>
      </g>
    </svg>
  );
};

