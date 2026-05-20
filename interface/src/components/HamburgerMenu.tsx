"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Power,
  Clock,
  RefreshCw,
  Plus,
  HelpCircle,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";

interface DeliveryTime {
  id: string;
  hour: number;
  minute: number;
  isEnabled: boolean;
}

interface HamburgerMenuProps {
  engineEngaged: boolean;
  onToggleEngine: () => void;
  deliveryTimes: DeliveryTime[];
  newTimeInput: string;
  onNewTimeInputChange: (val: string) => void;
  onAddDeliveryTime: (e: React.FormEvent) => void;
  onDeleteDeliveryTime: (id: string) => void;
  onManualBatchRelease: () => void;
  onApplyPreset: (preset: "MINIMAL" | "DEEP_WORK" | "HOURLY") => void;
  nextDeliveryTime: string;
}

export default function HamburgerMenu({
  engineEngaged,
  onToggleEngine,
  deliveryTimes,
  newTimeInput,
  onNewTimeInputChange,
  onAddDeliveryTime,
  onDeleteDeliveryTime,
  onManualBatchRelease,
  onApplyPreset,
  nextDeliveryTime,
}: HamburgerMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger trigger */}
      <button
        onClick={() => setOpen(true)}
        className="p-2.5 border border-zinc-800 hover:border-[#ff5500] hover:text-[#ff5500] transition-all"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Backdrop overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 menu-backdrop-enter"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Side panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[340px] max-w-[90vw] bg-[#09090b]/95 backdrop-blur-xl border-r border-zinc-800 z-50 flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <img
              src="/Intercept-logo.png"
              className="w-10 h-10 border border-zinc-800 object-cover"
              alt="Intercept Logo"
            />
            <span className="text-lg font-black uppercase tracking-tight text-white">
              INTERCEPT<span className="text-[#ff5500]">.</span>
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:text-[#ff5500] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col p-4 gap-1">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider text-zinc-300 hover:text-[#ff5500] hover:bg-[#ff5500]/5 border border-transparent hover:border-[#ff5500]/20 transition-all"
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            Dashboard
          </Link>
          <Link
            href="/help"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider text-zinc-300 hover:text-[#ff5500] hover:bg-[#ff5500]/5 border border-transparent hover:border-[#ff5500]/20 transition-all"
          >
            <HelpCircle className="w-4.5 h-4.5" />
            Help
          </Link>
          <Link
            href="/user-guide"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider text-zinc-300 hover:text-[#ff5500] hover:bg-[#ff5500]/5 border border-transparent hover:border-[#ff5500]/20 transition-all"
          >
            <BookOpen className="w-4.5 h-4.5" />
            User Guide
          </Link>
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-zinc-800" />

        {/* Engine Switch */}
        <div className="p-4">
          <div className="border border-zinc-800 bg-black p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">
                  Master Engine
                </span>
                <span className="text-base font-bold uppercase tracking-tight mt-0.5 block">
                  {engineEngaged ? "ENGAGED" : "BYPASSED"}
                </span>
              </div>
              <button
                onClick={onToggleEngine}
                className={`p-3 transition-all border ${
                  engineEngaged
                    ? "bg-[#ff5500] text-white border-[#ff5500] hover:bg-[#ff6b00]"
                    : "bg-black text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-[#ff5500]"
                }`}
                aria-label="Toggle Intercept Engine"
              >
                <Power className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Schedule section (scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
          <div className="border border-zinc-800 bg-black p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">
                  Delivery Schedule
                </span>
                <span className="text-xs text-zinc-500 mt-1 block">
                  Next: {nextDeliveryTime}
                </span>
              </div>
              <button
                onClick={onManualBatchRelease}
                className="bg-[#ff5500] text-white border border-[#ff5500] font-mono text-xs font-bold px-3 py-2 hover:bg-[#ff6b00] transition-colors uppercase flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                Deliver Now
              </button>
            </div>

            {/* Active times */}
            <div className="flex flex-wrap gap-1.5">
              {deliveryTimes.length === 0 ? (
                <span className="text-xs text-zinc-600 font-mono">
                  No times set
                </span>
              ) : (
                deliveryTimes.map((time) => (
                  <div
                    key={time.id}
                    className="flex items-center gap-1.5 border border-zinc-800 px-3 py-1.5 font-mono text-xs bg-black"
                  >
                    <Clock className="w-3 h-3 text-zinc-500" />
                    <span className="font-bold text-white">
                      {String(time.hour).padStart(2, "0")}:
                      {String(time.minute).padStart(2, "0")}
                    </span>
                    <button
                      onClick={() => onDeleteDeliveryTime(time.id)}
                      className="text-zinc-600 hover:text-red-500 transition-colors ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add time */}
            <form onSubmit={onAddDeliveryTime} className="flex gap-1.5">
              <input
                type="time"
                value={newTimeInput}
                onChange={(e) => onNewTimeInputChange(e.target.value)}
                className="bg-black border border-zinc-800 text-white font-mono text-xs px-3 py-2 outline-none focus:border-zinc-600 flex-1"
              />
              <button
                type="submit"
                className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-mono text-xs px-3 py-2 uppercase flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </form>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
              <button
                onClick={() => onApplyPreset("MINIMAL")}
                className="bg-black border border-zinc-900 hover:border-zinc-700 py-2 text-center text-zinc-500 hover:text-white uppercase transition-colors"
              >
                2x
              </button>
              <button
                onClick={() => onApplyPreset("DEEP_WORK")}
                className="bg-black border border-zinc-900 hover:border-zinc-700 py-2 text-center text-zinc-500 hover:text-white uppercase transition-colors"
              >
                4x
              </button>
              <button
                onClick={() => onApplyPreset("HOURLY")}
                className="bg-black border border-zinc-900 hover:border-zinc-700 py-2 text-center text-zinc-500 hover:text-white uppercase transition-colors"
              >
                10x
              </button>
            </div>
          </div>
        </div>

        {/* Panel footer */}
        <div className="p-4 border-t border-zinc-800 text-center">
          <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
            v3.0
          </span>
        </div>
      </div>
    </>
  );
}
