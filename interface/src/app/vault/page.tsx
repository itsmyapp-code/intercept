"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Archive, Trash2, Clock, CheckCircle2, SlidersHorizontal } from "lucide-react";
import { APPS, loadState, saveState, type InterceptState } from "../../lib/interceptState";

export default function VaultPage() {
  const [state, setState] = useState<InterceptState | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { setState(loadState()); }, []);
  useEffect(() => { if (state) saveState(state); }, [state]);

  const triggerToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  if (!state) return null;

  const { interceptedAlerts } = state;

  const handleRelease = (id: string) => {
    setState(prev => prev ? {
      ...prev,
      interceptedAlerts: prev.interceptedAlerts.map(a => a.id === id ? { ...a, isReleased: true } : a),
    } : prev);
    triggerToast("Alert released.");
  };

  const handleDelete = (id: string) => {
    setState(prev => prev ? {
      ...prev,
      interceptedAlerts: prev.interceptedAlerts.filter(a => a.id !== id),
    } : prev);
    triggerToast("Alert removed.");
  };

  const handleClear = () => {
    setState(prev => prev ? { ...prev, interceptedAlerts: [] } : prev);
    triggerToast("Vault cleared.");
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
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-3">
            <Archive className="w-6 h-6 text-white" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                The Vault<span className="text-[#ff5500]">.</span>
              </h1>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">
                Held &amp; Diverted Notifications
              </p>
            </div>
          </div>
          {interceptedAlerts.length > 0 && (
            <button
              onClick={handleClear}
              className="p-2.5 border border-zinc-900 text-zinc-500 hover:text-red-500 hover:border-zinc-800 transition-colors"
              title="Clear Vault"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="text-xs text-zinc-500 font-mono border-l border-zinc-800 pl-3">
          Notifications captured under Postbox mode are held here until delivery time or manual release.
        </div>

        <div className="space-y-3">
          {interceptedAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-600 border border-dashed border-zinc-900 text-center space-y-3">
              <SlidersHorizontal className="w-10 h-10 opacity-30" />
              <p className="font-mono text-sm uppercase tracking-wider">Vault is empty</p>
              <p className="text-xs max-w-xs px-4">
                Notifications captured from your device will appear here in chronological order.
              </p>
            </div>
          ) : (
            interceptedAlerts.map(alert => {
              const appInfo = APPS.find(a => a.key === alert.appKey);
              return (
                <div
                  key={alert.id}
                  className={`border p-4 space-y-3 transition-all ${
                    alert.isReleased
                      ? "border-zinc-900 bg-black/40 opacity-40"
                      : "border-zinc-800 bg-black hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${appInfo?.iconColor || "bg-zinc-500"}`} />
                      <span className="font-bold text-zinc-300 uppercase">{appInfo?.name || "App"}</span>
                    </div>
                    <span className="text-zinc-500">
                      {new Date(alert.timestamp).toLocaleString("en-GB", {
                        hour: "2-digit", minute: "2-digit", second: "2-digit", day: "2-digit", month: "short",
                      })}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold uppercase tracking-tight text-white">{alert.title}</h4>
                    <p className="text-sm text-zinc-300 leading-relaxed break-words">{alert.textBody}</p>
                  </div>

                  {!alert.isReleased && alert.isPostboxBatch && (
                    <div className="text-xs font-mono text-zinc-500 uppercase flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-600" />
                      Held for batch delivery
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-950 gap-2">
                    {alert.isReleased ? (
                      <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-xs uppercase">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-600" />
                        Released
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRelease(alert.id)}
                        className="bg-[#ff5500] text-white font-mono text-xs font-bold px-4 py-2 hover:bg-[#ff6b00] transition-colors uppercase"
                      >
                        Release Alert
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="p-1.5 border border-zinc-950 text-zinc-600 hover:text-red-500 hover:border-zinc-900 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
