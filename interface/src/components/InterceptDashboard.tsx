"use client";

import React, { useState, useEffect } from "react";
import { 
  Power, 
  Clock, 
  Archive, 
  Trash2, 
  Check, 
  X, 
  Sliders, 
  Play,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Mail,
  MessageCircle,
  MessageSquare,
  Smartphone,
  CheckCircle2
} from "lucide-react";
import InterceptLogo from "./InterceptLogo";
import HamburgerMenu from "./HamburgerMenu";

// App definitions containing Outlook, WhatsApp, Messenger, Text Messages, and Gmail
const APPS = [
  { key: "outlook", name: "Outlook", package: "com.microsoft.office.outlook", iconColor: "text-blue-600", IconComponent: Mail },
  { key: "whatsapp", name: "WhatsApp", package: "com.whatsapp", iconColor: "text-emerald-500", IconComponent: MessageCircle },
  { key: "messenger", name: "Messenger", package: "com.facebook.orca", iconColor: "text-violet-500", IconComponent: MessageSquare },
  { key: "sms", name: "Text Messages", package: "com.google.android.apps.messaging", iconColor: "text-sky-500", IconComponent: Smartphone },
  { key: "gmail", name: "Gmail", package: "com.google.android.gm", iconColor: "text-red-500", IconComponent: Mail },
] as const;

type AppKey = typeof APPS[number]["key"];

interface AppCustomisation {
  mode: "ALWAYS_ALLOW" | "ALWAYS_BLOCK" | "POSTBOX";
}

interface DeliveryTime {
  id: string;
  hour: number;
  minute: number;
  isEnabled: boolean;
}

interface InterceptedAlert {
  id: string;
  appKey: AppKey;
  title: string;
  textBody: string;
  timestamp: number;
  isReleased: boolean;
  isPostboxBatch: boolean; // Indicates if held under Postbox schedule
}

interface SimulationLog {
  id: string;
  timestamp: number;
  appKey: AppKey;
  status: "ALLOWED" | "INTERCEPTED";
  reason: string;
}

const DEFAULT_CUSTOMISATIONS: Record<AppKey, AppCustomisation> = {
  outlook: { mode: "POSTBOX" },
  whatsapp: { mode: "ALWAYS_ALLOW" },
  messenger: { mode: "POSTBOX" },
  sms: { mode: "ALWAYS_ALLOW" },
  gmail: { mode: "POSTBOX" },
};

const DEFAULT_DELIVERY_TIMES: DeliveryTime[] = [
  { id: "dt-1", hour: 9, minute: 0, isEnabled: true },
  { id: "dt-2", hour: 13, minute: 0, isEnabled: true },
  { id: "dt-3", hour: 17, minute: 0, isEnabled: true },
  { id: "dt-4", hour: 21, minute: 0, isEnabled: true },
];

const INITIAL_VAULT_ITEMS: InterceptedAlert[] = [];

const LOCAL_STORAGE_KEY = "intercept_postbox_dashboard_state";

export default function InterceptDashboard() {
  // UI and Engine state with UK English naming conventions
  const [engineEngaged, setEngineEngaged] = useState<boolean>(true);
  const [appCustomisations, setAppCustomisations] = useState<Record<AppKey, AppCustomisation>>(DEFAULT_CUSTOMISATIONS);
  const [deliveryTimes, setDeliveryTimes] = useState<DeliveryTime[]>(DEFAULT_DELIVERY_TIMES);
  const [interceptedAlerts, setInterceptedAlerts] = useState<InterceptedAlert[]>(INITIAL_VAULT_ITEMS);
  const [simulationLogs, setSimulationLogs] = useState<SimulationLog[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Time picker input state
  const [newTimeInput, setNewTimeInput] = useState<string>("12:00");

  // Simulation form state
  const [simApp, setSimApp] = useState<AppKey>("whatsapp");
  const [simSender, setSimSender] = useState<string>("");
  const [simMessage, setSimMessage] = useState<string>("");

  // Load configuration from localStorage on mount
  useEffect(() => {
    const cached = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (typeof parsed.engineEngaged === "boolean") {
          setEngineEngaged(parsed.engineEngaged);
        }
        if (parsed.appCustomisations) {
          setAppCustomisations(parsed.appCustomisations);
        }
        if (parsed.deliveryTimes) {
          setDeliveryTimes(parsed.deliveryTimes);
        }
        if (parsed.interceptedAlerts) {
          setInterceptedAlerts(parsed.interceptedAlerts);
        }
        if (parsed.simulationLogs) {
          setSimulationLogs(parsed.simulationLogs);
        }
      } catch (err) {
        console.error("Error loading serialised configuration state from local storage:", err);
      }
    }
  }, []);

  // Save configurations instantly to local storage on changes
  useEffect(() => {
    const stateToSave = {
      engineEngaged,
      appCustomisations,
      deliveryTimes,
      interceptedAlerts,
      simulationLogs
    };
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [engineEngaged, appCustomisations, deliveryTimes, interceptedAlerts, simulationLogs]);

  // Show a status toast message
  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Toggle master engine switch
  const handleToggleEngine = () => {
    const nextState = !engineEngaged;
    setEngineEngaged(nextState);
    triggerToast(nextState ? "Filtering engine engaged successfully." : "Filtering engine bypassed.");
  };

  // Change individual app rules
  const handleAppModeChange = (appKey: AppKey, mode: AppCustomisation["mode"]) => {
    setAppCustomisations(prev => ({
      ...prev,
      [appKey]: { mode }
    }));
    triggerToast(`${appKey.toUpperCase()} Customisation rule updated.`);
  };

  // Apply batch rule changes globally
  const handleBulkRuleChange = (mode: AppCustomisation["mode"]) => {
    const updated: Record<AppKey, AppCustomisation> = {} as Record<AppKey, AppCustomisation>;
    APPS.forEach(app => {
      updated[app.key] = { mode };
    });
    setAppCustomisations(updated);
    triggerToast(`All app customisations changed to ${mode.replace("_", " ")}.`);
  };

  // Add a new delivery time schedule
  const handleAddDeliveryTime = (e: React.FormEvent) => {
    e.preventDefault();
    const [hourStr, minuteStr] = newTimeInput.split(":");
    const hour = parseInt(hourStr) || 0;
    const minute = parseInt(minuteStr) || 0;

    // Avoid duplicate hours/minutes
    const exists = deliveryTimes.some(t => t.hour === hour && t.minute === minute);
    if (exists) {
      triggerToast("This delivery schedule is already active.");
      return;
    }

    const newTime: DeliveryTime = {
      id: `dt-${Date.now()}`,
      hour,
      minute,
      isEnabled: true
    };

    setDeliveryTimes(prev => [...prev, newTime].sort((a, b) => (a.hour * 60 + a.minute) - (b.hour * 60 + b.minute)));
    triggerToast(`Delivery time ${hourStr}:${minuteStr} initialised.`);
  };

  // Delete a delivery time schedule
  const handleDeleteDeliveryTime = (id: string) => {
    setDeliveryTimes(prev => prev.filter(t => t.id !== id));
    triggerToast("Delivery schedule removed.");
  };

  // Helper to calculate the next scheduled delivery time
  const getNextDeliveryTime = () => {
    const enabledTimes = deliveryTimes.filter(t => t.isEnabled);
    if (enabledTimes.length === 0) return "No delivery times configured";

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Sort active schedules chronologically
    const sorted = [...enabledTimes].sort((a, b) => (a.hour * 60 + a.minute) - (b.hour * 60 + b.minute));
    
    // Find the next one today
    const next = sorted.find(s => (s.hour * 60 + s.minute) > currentMinutes);
    if (next) {
      return `${String(next.hour).padStart(2, "0")}:${String(next.minute).padStart(2, "0")}`;
    }
    
    // Otherwise, it's the first one tomorrow
    return `${String(sorted[0].hour).padStart(2, "0")}:${String(sorted[0].minute).padStart(2, "0")} (Tomorrow)`;
  };

  // Trigger batch delivery manually, releasing all Postbox held alerts
  const handleManualBatchRelease = () => {
    const unreleasedCount = interceptedAlerts.filter(a => !a.isReleased && a.isPostboxBatch).length;
    if (unreleasedCount === 0) {
      triggerToast("No pending Postbox batches to deliver.");
      return;
    }

    setInterceptedAlerts(prev =>
      prev.map(alert => (alert.isPostboxBatch ? { ...alert, isReleased: true } : alert))
    );
    triggerToast(`Batch release processing complete. ${unreleasedCount} alerts delivered to system tray.`);
  };

  // Release a single held alert
  const handleReleaseAlert = (alertId: string) => {
    setInterceptedAlerts(prev =>
      prev.map(alert => (alert.id === alertId ? { ...alert, isReleased: true } : alert))
    );
    triggerToast("Notification alert released to system tray.");
  };

  // Remove alert record
  const handleDeleteAlert = (alertId: string) => {
    setInterceptedAlerts(prev => prev.filter(alert => alert.id !== alertId));
    triggerToast("Alert record removed from Vault registry.");
  };

  // Clear all vault records
  const handleClearVault = () => {
    setInterceptedAlerts([]);
    triggerToast("Chronological registry cleared.");
  };

  // Preset schedules
  const applyPreset = (preset: "MINIMAL" | "DEEP_WORK" | "HOURLY") => {
    let presetTimes: { hour: number; minute: number }[] = [];
    if (preset === "MINIMAL") {
      presetTimes = [{ hour: 8, minute: 0 }, { hour: 20, minute: 0 }];
    } else if (preset === "DEEP_WORK") {
      presetTimes = [{ hour: 9, minute: 0 }, { hour: 13, minute: 0 }, { hour: 17, minute: 0 }, { hour: 21, minute: 0 }];
    } else if (preset === "HOURLY") {
      for (let h = 9; h <= 18; h++) {
        presetTimes.push({ hour: h, minute: 0 });
      }
    }

    const formatted: DeliveryTime[] = presetTimes.map((t, idx) => ({
      id: `preset-${preset}-${idx}-${Date.now()}`,
      hour: t.hour,
      minute: t.minute,
      isEnabled: true
    }));

    setDeliveryTimes(formatted);
    triggerToast(`${preset.replace("_", " ")} delivery schedule preset applied.`);
  };

  // Simulate notification checking
  const handleSimulateNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simSender.trim() || !simMessage.trim()) {
      triggerToast("Please enter sender details and text body.");
      return;
    }

    const appName = APPS.find(a => a.key === simApp)?.name || simApp;
    const currentRules = appCustomisations[simApp];
    const systemTime = new Date();
    const currentHour = systemTime.getHours();
    const currentMinute = systemTime.getMinutes();

    let isBlocked = false;
    let reason = "Bypassed; filtering engine is deactivated.";
    let isPostbox = false;

    if (engineEngaged) {
      if (currentRules.mode === "ALWAYS_BLOCK") {
        isBlocked = true;
        reason = "App customisation set to block all alerts from showing.";
      } else if (currentRules.mode === "ALWAYS_ALLOW") {
        isBlocked = false;
        reason = "App customisation set to always allow alerts.";
      } else if (currentRules.mode === "POSTBOX") {
        isPostbox = true;
        // Check if the current time matches an enabled delivery time exactly
        const matchingSchedule = deliveryTimes.find(
          t => t.isEnabled && t.hour === currentHour && t.minute === currentMinute
        );

        if (matchingSchedule) {
          isBlocked = false;
          reason = `Delivered immediately during active scheduled delivery batch (${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}).`;
        } else {
          isBlocked = true;
          reason = `Held in Postbox. Diverted to Vault until next scheduled delivery batch (at ${getNextDeliveryTime()}).`;
        }
      }
    }

    const newLog: SimulationLog = {
      id: `sim-log-${Date.now()}`,
      timestamp: Date.now(),
      appKey: simApp,
      status: isBlocked ? "INTERCEPTED" : "ALLOWED",
      reason
    };

    setSimulationLogs(prev => [newLog, ...prev].slice(0, 15));

    if (isBlocked) {
      const newAlert: InterceptedAlert = {
        id: `alert-${Date.now()}`,
        appKey: simApp,
        title: simSender.trim(),
        textBody: simMessage.trim(),
        timestamp: Date.now(),
        isReleased: false,
        isPostboxBatch: isPostbox
      };
      setInterceptedAlerts(prev => [newAlert, ...prev]);
      triggerToast(`Alert cancelled: ${appName} notification held in Vault.`);
    } else {
      triggerToast(`Alert delivered: ${appName} notification shown.`);
    }

    setSimSender("");
    setSimMessage("");
  };

  return (
    <div className="w-full text-zinc-50 font-sans space-y-6">
      
      {/* Toast Alert overlay */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#09090b] text-[#ff5500] font-mono text-sm font-bold px-5 py-4 rounded-none border border-[#ff5500] shadow-[4px_4px_0px_0px_rgba(255,85,0,1)] animate-slide-in">
          [SYSTEM LOG] {toastMessage.toUpperCase()}
        </div>
      )}

      {/* Header section with brand logo */}
      <header className="flex items-center justify-between border border-zinc-800 bg-[#09090b] p-4 sm:p-6 gap-4">
        <div className="flex items-center gap-4">
          <img
            src="/Intercept-logo.png"
            className="w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 border border-zinc-800 object-cover"
            alt="Intercept Logo"
          />
          <div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
              INTERCEPT<span className="text-[#ff5500]">.</span>
            </h1>
            <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase mt-1">
              Notification Control Panel
            </p>
            <div className="flex items-center gap-2 mt-2 font-mono text-xs">
              <span className={`h-2 w-2 rounded-full ${engineEngaged ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
              <span className="text-zinc-400">{engineEngaged ? 'ENGAGED' : 'BYPASSED'}</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-500">NEXT: {getNextDeliveryTime()}</span>
            </div>
          </div>
        </div>
        <HamburgerMenu
          engineEngaged={engineEngaged}
          onToggleEngine={handleToggleEngine}
          deliveryTimes={deliveryTimes}
          newTimeInput={newTimeInput}
          onNewTimeInputChange={setNewTimeInput}
          onAddDeliveryTime={handleAddDeliveryTime}
          onDeleteDeliveryTime={handleDeleteDeliveryTime}
          onManualBatchRelease={handleManualBatchRelease}
          onApplyPreset={applyPreset}
          nextDeliveryTime={getNextDeliveryTime()}
        />
      </header>

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Span 2) - Config & Schedules */}
        <div className="lg:col-span-2 space-y-6">
          


          {/* Granular App Config Rows */}
          <section className="border border-zinc-800 bg-[#09090b] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-widest">
                  Granular App customisation
                </h2>
                <p className="text-xl font-bold uppercase tracking-tight mt-1">
                  Notification Routing matrix
                </p>
              </div>

              {/* Global control presets */}
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                <button
                  onClick={() => handleBulkRuleChange("ALWAYS_ALLOW")}
                  className="bg-black border border-zinc-900 hover:border-zinc-700 px-3 py-2 text-zinc-400 hover:text-white uppercase transition-colors"
                >
                  Allow All
                </button>
                <button
                  onClick={() => handleBulkRuleChange("ALWAYS_BLOCK")}
                  className="bg-black border border-zinc-900 hover:border-zinc-700 px-3 py-2 text-zinc-400 hover:text-white uppercase transition-colors"
                >
                  Block All
                </button>
                <button
                  onClick={() => handleBulkRuleChange("POSTBOX")}
                  className="bg-black border border-zinc-900 hover:border-zinc-700 px-3 py-2 text-zinc-400 hover:text-white uppercase transition-colors"
                >
                  Postbox All
                </button>
              </div>
            </div>

            {/* Granular App Control Rows */}
            <div className="space-y-4">
              {APPS.map(app => {
                const config = appCustomisations[app.key];
                const AppIcon = app.IconComponent;
                return (
                  <div 
                    key={app.key}
                    className={`border p-4 space-y-3 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      config.mode === "POSTBOX" 
                        ? "border-[#ff5500]/40 bg-[#ff5500]/5 hover:border-[#ff5500]/70" 
                        : config.mode === "ALWAYS_BLOCK"
                        ? "border-red-900/40 bg-red-950/5 hover:border-red-800/60"
                        : "border-zinc-900 bg-black hover:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 bg-zinc-950 border border-zinc-900 ${app.iconColor}`}>
                        <AppIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-base tracking-wide uppercase block">
                          {app.name}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono">
                          {app.package}
                        </span>
                      </div>
                    </div>

                    {/* Tabs control */}
                    <div className="grid grid-cols-3 border border-zinc-800 text-xs font-mono leading-none sm:w-80">
                      {(["ALWAYS_ALLOW", "ALWAYS_BLOCK", "POSTBOX"] as const).map(mode => {
                        const isActive = config.mode === mode;
                        let label = "";
                        if (mode === "ALWAYS_ALLOW") label = "ALLOW";
                        if (mode === "ALWAYS_BLOCK") label = "BLOCK";
                        if (mode === "POSTBOX") label = "POSTBOX";

                        const activeStyles = 
                          mode === "ALWAYS_ALLOW" ? "bg-emerald-600 text-white font-bold" :
                          mode === "ALWAYS_BLOCK" ? "bg-red-600 text-white font-bold" :
                          "bg-[#ff5500] text-white font-bold";

                        return (
                          <button
                            key={mode}
                            onClick={() => handleAppModeChange(app.key, mode)}
                            className={`py-3.5 px-4 text-center border-r last:border-r-0 border-zinc-800 transition-all ${
                              isActive 
                                ? activeStyles 
                                : "text-zinc-500 hover:text-white"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* Right Column - The Vault */}
        <div className="space-y-6">
          
          <section className="border border-zinc-800 bg-[#09090b] p-6 flex flex-col h-full space-y-6">
            
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-white" />
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">THE VAULT</h2>
                  <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-0.5">
                    Held & Diverted Notifications
                  </p>
                </div>
              </div>
              
              {interceptedAlerts.length > 0 && (
                <button
                  onClick={handleClearVault}
                  className="p-2.5 border border-zinc-900 text-zinc-500 hover:text-red-500 hover:border-zinc-800 transition-colors"
                  title="Clear Vault Registry"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              )}
            </div>

            {/* Description note using UK spelling */}
            <div className="text-xs text-zinc-500 font-mono border-l border-zinc-800 pl-3">
              Chronological registry of prioritised and processed customisations. Notifications captured under Postbox mode are held here until delivery time is reached or manually released.
            </div>

            {/* Alert List */}
            <div className="flex-1 overflow-y-auto space-y-3 max-h-[500px] lg:max-h-none pr-1">
              {interceptedAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-600 border border-dashed border-zinc-900 text-center space-y-2">
                  <SlidersHorizontal className="w-8 h-8 opacity-30" />
                  <p className="font-mono text-xs uppercase tracking-wider">
                    Vault is empty
                  </p>
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
                          <span className="font-bold text-zinc-300 uppercase">
                            {appInfo?.name || "App"}
                          </span>
                        </div>
                        <span className="text-zinc-500">
                          {new Date(alert.timestamp).toLocaleString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            day: "2-digit",
                            month: "short"
                          })}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-bold uppercase tracking-tight text-white">
                          {alert.title}
                        </h4>
                        <p className="text-sm text-zinc-300 font-sans leading-relaxed break-words">
                          {alert.textBody}
                        </p>
                      </div>

                      {/* Display Postbox batch status */}
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
                            Released to System
                          </div>
                        ) : (
                          <button
                            onClick={() => handleReleaseAlert(alert.id)}
                            className="bg-[#ff5500] text-white font-mono text-xs font-bold px-4 py-2 hover:bg-[#ff6b00] transition-colors uppercase"
                          >
                            Release Alert
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="p-1.5 border border-zinc-950 text-zinc-600 hover:text-red-500 hover:border-zinc-900 transition-colors"
                          title="Delete Alert Log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* PWA Context footer */}
            <div className="border-t border-zinc-900 pt-4 text-center">
              <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
                INTERCEPT CONTROL DEPLOYMENT v3.0
              </span>
            </div>

          </section>

        </div>

      </div>

    </div>
  );
}
