import React from "react";

interface InterceptLogoProps {
  className?: string;
}

export default function InterceptLogo({ className = "w-12 h-12" }: InterceptLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Intercept Emblem"
    >
      {/* Sharp square charcoal container */}
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        fill="#0A0A0C"
        stroke="#1F1F23"
        strokeWidth="4"
        rx="0"
      />
      
      {/* Grid line hints for technical aesthetic */}
      <line x1="2" y1="50" x2="98" y2="50" stroke="#141416" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="50" y1="2" x2="50" y2="98" stroke="#141416" strokeWidth="1" strokeDasharray="2 2" />

      {/* Double chevron pointing right (white) stopped by a vertical bar (neon orange) */}
      
      {/* First Chevron */}
      <path
        d="M20 28 L40 50 L20 72 H30 L50 50 L30 28 Z"
        fill="#FFFFFF"
      />
      
      {/* Second Chevron */}
      <path
        d="M42 28 L62 50 L42 72 H52 L72 50 L52 28 Z"
        fill="#FFFFFF"
      />
      
      {/* Blocking Vertical Bar (Neon Orange) */}
      <rect
        x="78"
        y="28"
        width="8"
        height="44"
        fill="#FF5500"
        rx="1"
      />
    </svg>
  );
}
