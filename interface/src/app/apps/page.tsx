"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, MessageCircle, MessageSquare, Smartphone } from "lucide-react";
import {
  APPS,
  loadState,
  saveState,
  type AppKey,
  type AppCustomisation,
  type InterceptState,
} from "../../lib/interceptState";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  outlook: Mail,
  whatsapp: MessageCircle,
  messenger: MessageSquare,
  sms: Smartphone,
  gmail: Mail,
};

export default function AppsPage() {
  const [state, setState] = useState<InterceptState | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { setState(loadState()); }, []);
  useEffect(() => { if (state) saveState(state); }, [state]);

  const triggerToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  if (!state) return null;

  const handleModeChange = (appKey: AppKey, mode: AppCustomisation["mode"]) => {
    setState(prev => prev ? {
      ...prev,
      appCustomisations: { ...prev.appCustomisations, [appKey]: { mode } },
    } : prev);
    triggerToast(`${appKey.toUpperCase()} set to ${mode.replace("_", " ")}.`);
  };

  const handleBulkChange = (mode: AppCustomisation["mode"]) => {
    const updated = {} as Record<AppKey, AppCustomisation>;
    APPS.forEach(app => { updated[app.key] = { mode }; });
    setState(prev => prev ? { ...prev, appCustomisations: updated } : prev);
    triggerToast(`All apps set to ${mode.replace("_", " ")}.`);
  };

  return (
    <main className="max-w-3xl mx-auto py-8 px-4 text-white">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#09090b] text-[#ff5500] font-mono text-sm font-bold px-5 py-4 border border-[#ff5500] shadow-[4px_4px_0px_0px_rgba(255,85,0,1)]">
          {toast.toUpperCase()}
        </div>
      )}

      <Link href="/" className="inline-flex items-center gap-2 text-sm font-mono text-zinc-400 hover:text-[#ff5500] transition-colors uppercase tracking-wider mb-8">
        ← Dashboard
      </Link>

      <div className="border border-zinc-800 bg-[#09090b] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              App Rules<span className="text-[#ff5500]">.</span>
            </h1>
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">
              Notification Routing Matrix
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 font-mono text-xs">
            {(["ALWAYS_ALLOW", "ALWAYS_BLOCK", "POSTBOX"] as const).map(mode => (
              <button
                key={mode}
                onClick={() => handleBulkChange(mode)}
                className="bg-black border border-zinc-900 hover:border-zinc-700 px-3 py-2 text-zinc-400 hover:text-white uppercase transition-colors"
              >
                {mode === "ALWAYS_ALLOW" ? "Allow All" : mode === "ALWAYS_BLOCK" ? "Block All" : "Postbox All"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {APPS.map(app => {
            const config = state.appCustomisations[app.key];
            const AppIcon = ICON_MAP[app.key] || Mail;
            return (
              <div
                key={app.key}
                className={`border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  config.mode === "POSTBOX"
                    ? "border-[#ff5500]/40 bg-[#ff5500]/5"
                    : config.mode === "ALWAYS_BLOCK"
                    ? "border-red-900/40 bg-red-950/5"
                    : "border-zinc-900 bg-black"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 bg-zinc-950 border border-zinc-900 ${app.iconColor}`}>
                    <AppIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-base uppercase block">{app.name}</span>
                    <span className="text-xs text-zinc-500 font-mono">{app.package}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 border border-zinc-800 text-xs font-mono sm:w-80">
                  {(["ALWAYS_ALLOW", "ALWAYS_BLOCK", "POSTBOX"] as const).map(mode => {
                    const isActive = config.mode === mode;
                    const activeStyle =
                      mode === "ALWAYS_ALLOW" ? "bg-emerald-600 text-white font-bold" :
                      mode === "ALWAYS_BLOCK" ? "bg-red-600 text-white font-bold" :
                      "bg-[#ff5500] text-white font-bold";
                    return (
                      <button
                        key={mode}
                        onClick={() => handleModeChange(app.key, mode)}
                        className={`py-3.5 px-4 text-center border-r last:border-r-0 border-zinc-800 transition-all ${
                          isActive ? activeStyle : "text-zinc-500 hover:text-white"
                        }`}
                      >
                        {mode === "ALWAYS_ALLOW" ? "ALLOW" : mode === "ALWAYS_BLOCK" ? "BLOCK" : "POSTBOX"}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
