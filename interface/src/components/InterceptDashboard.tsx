"use client";

import React, { useState, useEffect, useRef } from "react";
import { Power, Volume2, VolumeX } from "lucide-react";
import HamburgerMenu from "./HamburgerMenu";
import {
  loadState,
  saveState,
  getNextDeliveryTime,
  type InterceptState,
  type DeliveryTime,
  DEFAULT_CUSTOMISATIONS,
  DEFAULT_DELIVERY_TIMES,
} from "../lib/interceptState";

export default function InterceptDashboard() {
  const [state, setState] = useState<InterceptState | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newTimeInput, setNewTimeInput] = useState("12:00");
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Load state from localStorage on mount
  useEffect(() => {
    setState(loadState());
  }, []);

  // Save state on every change
  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!state) return null; // Loading

  const { engineEngaged, deliveryTimes } = state;

  // Handlers passed to HamburgerMenu
  const handleToggleEngine = () => {
    const next = !state.engineEngaged;
    setState(prev => prev ? { ...prev, engineEngaged: next } : prev);
    triggerToast(next ? "Filtering engine engaged." : "Filtering engine bypassed.");
  };

  const handleAddDeliveryTime = (e: React.FormEvent) => {
    e.preventDefault();
    const [h, m] = newTimeInput.split(":").map(Number);
    if (state.deliveryTimes.some(t => t.hour === h && t.minute === m)) {
      triggerToast("This delivery time already exists.");
      return;
    }
    const newTime: DeliveryTime = { id: `dt-${Date.now()}`, hour: h, minute: m, isEnabled: true };
    setState(prev => prev ? {
      ...prev,
      deliveryTimes: [...prev.deliveryTimes, newTime].sort((a, b) => (a.hour * 60 + a.minute) - (b.hour * 60 + b.minute)),
    } : prev);
    triggerToast(`Delivery time ${newTimeInput} added.`);
  };

  const handleDeleteDeliveryTime = (id: string) => {
    setState(prev => prev ? { ...prev, deliveryTimes: prev.deliveryTimes.filter(t => t.id !== id) } : prev);
    triggerToast("Delivery time removed.");
  };

  const handleManualBatchRelease = () => {
    const count = state.interceptedAlerts.filter(a => !a.isReleased && a.isPostboxBatch).length;
    if (count === 0) { triggerToast("No pending batches."); return; }
    setState(prev => prev ? {
      ...prev,
      interceptedAlerts: prev.interceptedAlerts.map(a => a.isPostboxBatch ? { ...a, isReleased: true } : a),
    } : prev);
    triggerToast(`${count} alerts released.`);
  };

  const applyPreset = (preset: "MINIMAL" | "DEEP_WORK" | "HOURLY") => {
    let times: { hour: number; minute: number }[] = [];
    if (preset === "MINIMAL") times = [{ hour: 8, minute: 0 }, { hour: 20, minute: 0 }];
    else if (preset === "DEEP_WORK") times = [{ hour: 9, minute: 0 }, { hour: 13, minute: 0 }, { hour: 17, minute: 0 }, { hour: 21, minute: 0 }];
    else for (let h = 9; h <= 18; h++) times.push({ hour: h, minute: 0 });

    setState(prev => prev ? {
      ...prev,
      deliveryTimes: times.map((t, i) => ({ id: `preset-${i}-${Date.now()}`, hour: t.hour, minute: t.minute, isEnabled: true })),
    } : prev);
    triggerToast(`${preset.replace("_", " ")} preset applied.`);
  };

  return (
    <div className="w-full max-w-full overflow-hidden text-zinc-50 font-sans min-h-[80vh] flex flex-col">

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#09090b] text-[#ff5500] font-mono text-sm font-bold px-5 py-4 border border-[#ff5500] shadow-[4px_4px_0px_0px_rgba(255,85,0,1)]">
          [SYSTEM] {toastMessage.toUpperCase()}
        </div>
      )}

      {/* Top bar with hamburger */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          NEXT: {getNextDeliveryTime(deliveryTimes)}
        </span>
        <HamburgerMenu
          engineEngaged={state.engineEngaged}
          onToggleEngine={handleToggleEngine}
          deliveryTimes={state.deliveryTimes}
          newTimeInput={newTimeInput}
          onNewTimeInputChange={setNewTimeInput}
          onAddDeliveryTime={handleAddDeliveryTime}
          onDeleteDeliveryTime={handleDeleteDeliveryTime}
          onManualBatchRelease={handleManualBatchRelease}
          onApplyPreset={applyPreset}
          nextDeliveryTime={getNextDeliveryTime(deliveryTimes)}
        />
      </div>

      {/* Hero: Large centered logo + status */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 py-10 px-4 w-full">
        {/* Video logo with sound toggle */}
        <div className="relative w-full flex justify-center">
          <video
            ref={videoRef}
            src="/Intercept.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-64 sm:w-80 md:w-96 max-w-[85vw] h-auto object-contain"
          />
          <button
            onClick={toggleMute}
            className={`absolute bottom-2 right-[7.5%] sm:right-[calc(50%-10rem)] p-2 border transition-all ${
              isMuted
                ? "border-zinc-700 bg-black/70 text-zinc-500 hover:text-white hover:border-zinc-500"
                : "border-[#ff5500] bg-[#ff5500]/20 text-[#ff5500] hover:bg-[#ff5500]/30"
            }`}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* App name */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none text-center">
          INTERCEPT<span className="text-[#ff5500]">.</span>
        </h1>

        {/* Status badge — fully responsive */}
        <button
          onClick={handleToggleEngine}
          className={`flex items-center gap-3 px-5 py-4 sm:px-8 sm:py-5 border-2 text-lg sm:text-xl font-black uppercase tracking-wider transition-all max-w-[90vw] ${
            engineEngaged
              ? "border-[#ff5500] bg-[#ff5500]/10 text-[#ff5500] hover:bg-[#ff5500]/20"
              : "border-zinc-700 bg-zinc-900/50 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
          }`}
        >
          <Power className={`w-6 h-6 flex-shrink-0 ${engineEngaged ? "text-[#ff5500]" : "text-zinc-600"}`} />
          <span className="flex-shrink-0">{engineEngaged ? "ENGAGED" : "DISABLED"}</span>
          <span className={`h-3 w-3 rounded-full flex-shrink-0 ${engineEngaged ? "bg-[#ff5500] animate-pulse" : "bg-zinc-600"}`} />
        </button>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-zinc-500 font-mono uppercase tracking-widest text-center px-4">
          {engineEngaged
            ? "Notifications are being filtered and batch-delivered."
            : "All notifications are bypassing the filter."
          }
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-900 pt-4 pb-2 text-center">
        <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
          INTERCEPT v3.1
        </span>
      </div>
    </div>
  );
}
