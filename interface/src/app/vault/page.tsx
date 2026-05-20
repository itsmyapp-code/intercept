"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Archive,
  Trash2,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
  Mail,
  MessageCircle,
  MessageSquare,
  Smartphone,
  Phone,
  Play,
  Terminal,
  AlertCircle
} from "lucide-react";
import { APPS, loadState, saveState, type InterceptState, type AppKey } from "../../lib/interceptState";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  outlook: Mail,
  whatsapp: MessageCircle,
  messenger: MessageSquare,
  sms: Smartphone,
  gmail: Mail,
  calls_sim1: Phone,
  calls_sim2: Phone,
};

interface SimLog {
  id: string;
  timestamp: number;
  appKey: AppKey;
  sender: string;
  message: string;
  decision: "ALLOWED" | "BLOCKED" | "POSTBOX_HELD";
  reason: string;
}

export default function VaultPage() {
  const [state, setState] = useState<InterceptState | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Simulator Form States
  const [simApp, setSimApp] = useState<AppKey>("outlook");
  const [simSender, setSimSender] = useState("Boss");
  const [simMessage, setSimMessage] = useState("URGENT: Please check the latest quarterly stats report.");
  const [simLogs, setSimLogs] = useState<SimLog[]>([]);

  useEffect(() => {
    setState(loadState());
    // Load local simulator logs if any
    const cachedLogs = window.localStorage.getItem("intercept_sim_logs");
    if (cachedLogs) {
      try {
        setSimLogs(JSON.parse(cachedLogs));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  if (!state) return null;

  const { interceptedAlerts, engineEngaged } = state;

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

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simSender.trim() || !simMessage.trim()) {
      triggerToast("Sender and message are required.");
      return;
    }

    const appConfig = state.appCustomisations[simApp] ?? { mode: "ALWAYS_ALLOW" };
    let decision: SimLog["decision"] = "ALLOWED";
    let reason = "";

    if (!engineEngaged) {
      decision = "ALLOWED";
      reason = "Master filtering engine is DISABLED. All notifications bypass the filter.";
    } else {
      switch (appConfig.mode) {
        case "ALWAYS_ALLOW":
          decision = "ALLOWED";
          reason = "App rule set to ALWAYS ALLOW. Notification bypassed the filter.";
          break;
        case "ALWAYS_BLOCK":
          decision = "BLOCKED";
          reason = "App rule set to ALWAYS BLOCK. Silenced and logged directly to The Vault.";
          break;
        case "POSTBOX":
          decision = "POSTBOX_HELD";
          reason = "App rule set to POSTBOX. Silenced and held in The Vault for scheduled batch release.";
          break;
      }
    }

    // If blocked or held, save to state alerts
    if (decision === "BLOCKED" || decision === "POSTBOX_HELD") {
      const newAlert = {
        id: `alert-${Date.now()}`,
        appKey: simApp,
        title: simSender,
        textBody: simMessage,
        timestamp: Date.now(),
        isReleased: false,
        isPostboxBatch: appConfig.mode === "POSTBOX",
      };
      setState(prev => prev ? {
        ...prev,
        interceptedAlerts: [newAlert, ...prev.interceptedAlerts],
      } : prev);
    }

    // Add to simulation log stream
    const newLog: SimLog = {
      id: `log-${Date.now()}`,
      timestamp: Date.now(),
      appKey: simApp,
      sender: simSender,
      message: simMessage,
      decision,
      reason,
    };

    const updatedLogs = [newLog, ...simLogs].slice(0, 10); // Keep last 10 logs
    setSimLogs(updatedLogs);
    window.localStorage.setItem("intercept_sim_logs", JSON.stringify(updatedLogs));

    triggerToast(decision === "ALLOWED" ? "Simulated: Allowed" : "Simulated: Intercepted");
  };

  const handleClearLogs = () => {
    setSimLogs([]);
    window.localStorage.removeItem("intercept_sim_logs");
    triggerToast("Log stream cleared.");
  };

  return (
    <main className="max-w-6xl mx-auto py-8 px-4 text-white">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#09090b] text-[#ff5500] font-mono text-sm font-bold px-5 py-4 border border-[#ff5500] shadow-[4px_4px_0px_0px_rgba(255,85,0,1)]">
          {toast.toUpperCase()}
        </div>
      )}

      <Link href="/" className="inline-flex items-center gap-2 text-sm font-mono text-zinc-400 hover:text-[#ff5500] transition-colors uppercase tracking-wider mb-8">
        ← Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Column 1: Sandbox Simulator (4 or 5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-zinc-800 bg-[#09090b] p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
              <Play className="w-5 h-5 text-[#ff5500]" />
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  Sandbox Simulator<span className="text-[#ff5500]">.</span>
                </h2>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5">
                  Offline Rule Tester
                </p>
              </div>
            </div>

            <form onSubmit={handleSimulate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
                  Source Application
                </label>
                <select
                  value={simApp}
                  onChange={(e) => setSimApp(e.target.value as AppKey)}
                  className="w-full bg-black border border-zinc-800 text-white font-mono text-xs px-3.5 py-3 outline-none focus:border-[#ff5500] transition-colors uppercase"
                >
                  {APPS.map(app => (
                    <option key={app.key} value={app.key}>
                      {app.name} ({app.package})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
                  Simulated Sender / Caller
                </label>
                <input
                  type="text"
                  value={simSender}
                  onChange={(e) => setSimSender(e.target.value)}
                  placeholder="e.g. Boss, Mom, Outlook Mailer"
                  className="w-full bg-black border border-zinc-800 text-white font-mono text-xs px-3.5 py-3 outline-none focus:border-[#ff5500] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
                  Simulated Content / Notification Body
                </label>
                <textarea
                  value={simMessage}
                  onChange={(e) => setSimMessage(e.target.value)}
                  placeholder="Enter simulated message content..."
                  rows={3}
                  className="w-full bg-black border border-zinc-800 text-white font-mono text-xs px-3.5 py-3 outline-none focus:border-[#ff5500] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff5500] text-white font-mono text-xs font-bold py-3.5 hover:bg-[#ff6b00] transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Simulate Incoming Notification
              </button>
            </form>
          </div>

          {/* Simulator Log Stream */}
          <div className="border border-zinc-800 bg-[#09090b] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2 text-zinc-400">
                <Terminal className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-mono uppercase tracking-wider">Simulator Log Stream</span>
              </div>
              {simLogs.length > 0 && (
                <button
                  onClick={handleClearLogs}
                  className="text-[10px] font-mono text-zinc-600 hover:text-red-500 transition-colors uppercase"
                >
                  Clear Logs
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {simLogs.length === 0 ? (
                <div className="text-center py-8 text-zinc-700 font-mono text-xs">
                  NO SIMULATION RECORDS FOUND
                </div>
              ) : (
                simLogs.map(log => {
                  const AppIcon = ICON_MAP[log.appKey] || Mail;
                  return (
                    <div key={log.id} className="border border-zinc-900 bg-black p-3 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5 text-zinc-400">
                          <AppIcon className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="font-bold uppercase">{log.appKey}</span>
                        </div>
                        <span className="text-zinc-600">
                          {new Date(log.timestamp).toLocaleTimeString("en-GB", { hour12: false })}
                        </span>
                      </div>

                      <div className="text-zinc-300">
                        <span className="text-zinc-500">From:</span> {log.sender}
                        <br />
                        <span className="text-zinc-500">Msg:</span> {log.message}
                      </div>

                      <div className="pt-1.5 border-t border-zinc-950 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-zinc-500">Action:</span>
                          <span className={`font-bold uppercase ${
                            log.decision === "ALLOWED" ? "text-emerald-400" :
                            log.decision === "BLOCKED" ? "text-red-400" : "text-[#ff5500]"
                          }`}>
                            {log.decision === "POSTBOX_HELD" ? "HELD (POSTBOX)" : log.decision}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-500 leading-normal">
                          {log.reason}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Column 2: The Vault (7 columns) */}
        <div className="lg:col-span-7">
          <div className="border border-zinc-800 bg-[#09090b] p-6 space-y-6 h-full">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-3">
                <Archive className="w-6 h-6 text-white" />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                    The Vault<span className="text-[#ff5500]">.</span>
                  </h1>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5">
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

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {interceptedAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-600 border border-dashed border-zinc-900 text-center space-y-3">
                  <SlidersHorizontal className="w-10 h-10 opacity-30" />
                  <p className="font-mono text-sm uppercase tracking-wider">Vault is empty</p>
                  <p className="text-xs max-w-xs px-4">
                    Notifications captured from your device or simulated above will appear here in chronological order.
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
        </div>
      </div>
    </main>
  );
}
