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
      aria-label="Intercept Logo"
    >
      {/* Sharp square charcoal container */}
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        fill="#121214"
        stroke="#27272A"
        strokeWidth="4"
        rx="0"
      />
      
      {/* Grid line hints for technical aesthetic */}
      <line x1="2" y1="50" x2="98" y2="50" stroke="#1F1F23" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="50" y1="2" x2="50" y2="98" stroke="#1F1F23" strokeWidth="1" strokeDasharray="2 2" />

      {/* Fast, sharp incoming white arrow */}
      {/* Shaft */}
      <line
        x1="12"
        y1="50"
        x2="45"
        y2="50"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="square"
      />
      {/* Arrow head */}
      <polygon
        points="32,40 46,50 32,60"
        fill="#FFFFFF"
      />

      {/* Thick white diagonal blocking gate */}
      <line
        x1="76"
        y1="20"
        x2="26"
        y2="70"
        stroke="#FFFFFF"
        strokeWidth="10"
        strokeLinecap="square"
      />

      {/* Tiny orange crosshair accent at the dead-stop point */}
      <circle
        cx="46"
        cy="50"
        r="5"
        stroke="#FF5722"
        strokeWidth="2"
        fill="none"
      />
      <line
        x1="46"
        y1="41"
        x2="46"
        y2="59"
        stroke="#FF5722"
        strokeWidth="1.5"
      />
      <line
        x1="37"
        y1="50"
        x2="55"
        y2="50"
        stroke="#FF5722"
        strokeWidth="1.5"
      />
    </svg>
  );
}
