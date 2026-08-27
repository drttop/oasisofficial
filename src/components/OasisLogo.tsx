import React from 'react';

export const OasisLogo: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => {
  return (
    <svg 
      viewBox="0 0 500 500" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Metallic Gold Gradients */}
        <linearGradient id="gold-base" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C6934A" />
          <stop offset="20%" stopColor="#E4BA69" />
          <stop offset="40%" stopColor="#FFF2B2" />
          <stop offset="60%" stopColor="#D4A053" />
          <stop offset="80%" stopColor="#8A5A21" />
          <stop offset="100%" stopColor="#E5B54F" />
        </linearGradient>

        <linearGradient id="gold-highlight" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E5B54F" />
          <stop offset="50%" stopColor="#FFECA8" />
          <stop offset="100%" stopColor="#9C6B26" />
        </linearGradient>
        
        {/* Drop shadow for 3D effect */}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="6" stdDeviation="4" floodColor="#000" floodOpacity="0.25" />
        </filter>
        <filter id="text-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.2" />
        </filter>
      </defs>

      <g filter="url(#shadow)">
        {/* The 'O' Ring */}
        <path
          d="M 250 120 
             C 160 120, 120 180, 120 240 
             C 120 300, 160 360, 230 360 
             C 240 360, 255 358, 265 355
             C 255 340, 230 325, 205 320
             C 155 310, 150 240, 150 240
             C 150 240, 165 150, 250 150
             C 330 150, 350 220, 350 240
             C 350 255, 345 285, 325 305
             C 345 300, 365 280, 375 255
             C 385 220, 380 160, 350 135
             C 320 115, 280 120, 250 120 Z"
          fill="url(#gold-base)"
        />

        {/* The bottom-right wave swoosh 1 (Upper) */}
        <path
          d="M 180 325 
             C 230 310, 280 355, 360 330 
             C 345 345, 320 360, 290 360 
             C 240 360, 195 340, 180 325 Z"
          fill="url(#gold-highlight)"
        />

        {/* The bottom-right wave swoosh 2 (Lower) */}
        <path
          d="M 230 365 
             C 280 355, 320 375, 365 350 
             C 345 375, 310 390, 270 385 
             C 250 380, 235 375, 230 365 Z"
          fill="url(#gold-base)"
        />
      </g>

      {/* The Text 'OASIS' */}
      <g filter="url(#text-shadow)">
        <text
          x="250"
          y="450"
          fontFamily="'Playfair Display', 'Times New Roman', serif"
          fontSize="85"
          fontWeight="bold"
          letterSpacing="0.18em"
          textAnchor="middle"
          fill="url(#gold-base)"
        >
          OASIS
        </text>
      </g>
    </svg>
  );
};
