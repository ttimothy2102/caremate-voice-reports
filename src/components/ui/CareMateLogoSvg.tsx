
import React from 'react';

interface CareMateLogoSvgProps {
  className?: string;
  width?: number;
  height?: number;
}

export function CareMateLogoSvg({ className = "", width = 120, height = 32 }: CareMateLogoSvgProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background rounded rectangle */}
      <rect x="0" y="4" width="120" height="24" rx="12" fill="url(#caremate-gradient)" />
      
      {/* Heart icon integrated into the design */}
      <path
        d="M12 20.5c-1.5-1.5-4-4-4-6.5 0-2 1.5-3.5 3.5-3.5 1 0 2 .5 2.5 1.5.5-1 1.5-1.5 2.5-1.5 2 0 3.5 1.5 3.5 3.5 0 2.5-2.5 5-4 6.5z"
        fill="white"
      />
      
      {/* CareMate text */}
      <text
        x="26"
        y="20"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="14"
        fontWeight="700"
        fill="white"
        letterSpacing="-0.5px"
      >
        CareMate
      </text>
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="caremate-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}
