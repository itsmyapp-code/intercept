"use client";

import React, { useEffect, useState } from "react";
import { Wrench, AlertTriangle } from "lucide-react";

export default function MaintenancePage() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-zinc-50 font-sans flex flex-col items-center justify-center overflow-hidden p-6">
      {/* Tech grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 85, 0, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 85, 0, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating ambient glow in the background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none dynamic-glow" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full text-center">
        {/* Animated Logo */}
        <div className="relative mb-8 group">
          {/* Subtle logo outer glow */}
          <div className="absolute -inset-4 bg-orange-500/15 rounded-xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000" />
          
          <svg
            viewBox="0 0 100 100"
            className="w-36 h-36 relative z-10 border border-zinc-850 bg-[#0A0A0C] p-3 shadow-2xl rounded-xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Intercept Animated Logo"
          >
            {/* Sharp square container border inside the SVG */}
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
            
            {/* Grid line hints for technical aesthetic inside the logo container */}
            <line x1="2" y1="50" x2="98" y2="50" stroke="#141416" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="50" y1="2" x2="50" y2="98" stroke="#141416" strokeWidth="1" strokeDasharray="2 2" />

            {/* First Chevron */}
            <path
              d="M18 28 L38 50 L18 72 H28 L48 50 L28 28 Z"
              fill="#FFFFFF"
              className="animate-chevron-one"
            />
            
            {/* Second Chevron */}
            <path
              d="M40 28 L60 50 L40 72 H50 L70 50 L50 28 Z"
              fill="#FFFFFF"
              className="animate-chevron-two"
            />
            
            {/* Blocking Vertical Bar (Neon Orange) */}
            <rect
              x="76"
              y="28"
              width="8"
              height="44"
              fill="#FF5500"
              className="animate-bar-glow"
              rx="1"
            />
          </svg>
        </div>

        {/* App Name */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-[0.25em] text-white mb-3 font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          INTERCEPT
        </h1>

        {/* Maintenance Message */}
        <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs font-semibold text-orange-400 uppercase tracking-widest mb-8 animate-pulse-slow">
          <Wrench className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
          <span>System Under Maintenance</span>
        </div>

        {/* Premium status details card */}
        <div className="w-full bg-[#0d0d11]/80 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-left relative overflow-hidden">
          {/* Subtle top indicator bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60" />
          
          <h2 className="text-lg font-bold text-zinc-100 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Scheduled Upgrades
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed mb-6">
            We are performing essential system-wide updates to enhance message delivery speed and security. The dashboard will be back online shortly.
          </p>

          <div className="space-y-3.5 border-t border-zinc-850 pt-5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono">TASK</span>
              <span className="text-zinc-500 font-mono">STATUS</span>
            </div>

            {/* Subsystem 1 */}
            <div className="flex items-center justify-between bg-black/40 rounded-lg p-2.5 border border-zinc-900">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-sm text-zinc-300 font-medium">Database Optimization</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">Complete</span>
            </div>

            {/* Subsystem 2 */}
            <div className="flex items-center justify-between bg-black/40 rounded-lg p-2.5 border border-zinc-900">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.55)] animate-pulse" />
                <span className="text-sm text-zinc-300 font-medium">Intercept Engines Sync</span>
              </div>
              <span className="text-xs font-mono text-orange-400 bg-orange-500/5 px-2 py-0.5 rounded border border-orange-500/10">
                Updating{dots}
              </span>
            </div>

            {/* Subsystem 3 */}
            <div className="flex items-center justify-between bg-black/40 rounded-lg p-2.5 border border-zinc-900">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-zinc-650" />
                <span className="text-sm text-zinc-400">Queue Workers Deploy</span>
              </div>
              <span className="text-xs font-mono text-zinc-500 bg-zinc-500/5 px-2 py-0.5 rounded border border-zinc-500/10">Pending</span>
            </div>
          </div>
        </div>

        {/* Small footer reference */}
        <div className="mt-8 text-zinc-600 text-[11px] font-mono tracking-wider uppercase">
          Est. Completion: &lt; 30 Minutes
        </div>
      </div>
    </div>
  );
}
