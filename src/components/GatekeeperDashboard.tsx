"use client";
import { useState, useEffect } from 'react';
import { Check, X, Clock } from 'lucide-react';

const APPS = [
  { key: 'gmail', name: 'Gmail', icon: '/android-chrome-192x192.png' },
  { key: 'whatsapp', name: 'WhatsApp', icon: '/android-chrome-192x192.png' },
  { key: 'slack', name: 'Slack', icon: '/android-chrome-192x192.png' },
  { key: 'sms', name: 'SMS', icon: '/android-chrome-192x192.png' },
];

const MODES = [
  { key: 'always_allow', label: 'Always Allow' },
  { key: 'always_block', label: 'Always Block' },
  { key: 'schedule', label: 'Schedule Based' },
];

type AppKey = 'gmail' | 'whatsapp' | 'slack' | 'sms';
type ModeKey = 'always_allow' | 'always_block' | 'schedule';
type VaultItem = {
  id: number;
  app: AppKey;
  title: string;
  message: string;
  timestamp: number;
  released: boolean;
};
type RulesState = {
  master: boolean;
  currentMode: string;
  connected: boolean;
  apps: { [key in AppKey]: ModeKey };
  vault: VaultItem[];
};

const DEFAULT_RULES: RulesState = {
  master: true,
  currentMode: 'Deep Work',
  connected: true,
  apps: {
    gmail: 'schedule',
    whatsapp: 'always_allow',
    slack: 'always_block',
    sms: 'schedule',
  },
  vault: [
    {
      id: 1,
      app: 'gmail',
      title: 'New Email',
      message: 'Subject: Project Update',
      timestamp: Date.now() - 1000 * 60 * 5,
      released: false,
    },
    {
      id: 2,
      app: 'whatsapp',
      title: 'Group Chat',
      message: 'Lunch at 1pm?',
      timestamp: Date.now() - 1000 * 60 * 10,
      released: false,
    },
  ],
};

const LOCAL_KEY = 'gatekeeper_rules';

function saveState(state: any) {
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
}
function loadState() {
  const raw = window.localStorage.getItem(LOCAL_KEY);
  if (!raw) return DEFAULT_RULES;
  try {
    return { ...DEFAULT_RULES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_RULES;
  }
}

export default function GatekeeperDashboard() {
  const [state, setState] = useState(DEFAULT_RULES);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    setState(loadState());
  }, []);
  useEffect(() => {
    saveState(state);
  }, [state]);

  // UI Handlers
  const setMaster = (val: boolean) => setState(s => ({ ...s, master: val }));
  const setAppRule = (app: string, rule: string) => setState(s => ({ ...s, apps: { ...s.apps, [app]: rule } }));
  const releaseVault = (id: number) => setState(s => ({ ...s, vault: s.vault.map(n => n.id === id ? { ...n, released: true } : n) }));
  const clearVault = () => setState(s => ({ ...s, vault: [] }));
  const exportRules = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gatekeeper-rules.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  const importRules = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        setState({ ...DEFAULT_RULES, ...data });
      } catch {}
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-neutral-950 text-white rounded-lg shadow p-0 sm:p-8">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8 border-b border-neutral-900 pb-4">
        <img src="/Intercept-logo.png" alt="Gatekeeper Logo" className="w-10 h-10" />
        <h1 className="text-3xl font-extrabold tracking-tight">GATEKEEPER</h1>
        <span className={`ml-auto px-3 py-1 rounded text-xs font-bold ${state.connected ? 'bg-green-700' : 'bg-red-700'}`}>{state.connected ? 'Connected' : 'Disconnected'}</span>
      </header>
      {/* Control Engine */}
      <section className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={state.master} onChange={e => setMaster(e.target.checked)} className="accent-green-600 w-5 h-5" />
          <span className="font-semibold">Notification Filtering Engine</span>
        </label>
        <div className="ml-auto flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded">
          <Clock className="w-5 h-5 text-zinc-300" />
          <span className="text-sm">{state.master ? `Current Mode: ${state.currentMode} Active – Filtering Enabled` : 'Filtering Disabled'}</span>
        </div>
      </section>
      {/* Rules Matrix */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4">Rules Configuration</h2>
        <div className="space-y-3">
          {APPS.map(app => (
            <div key={app.key} className="flex items-center gap-3 bg-neutral-900 rounded p-3">
              <img src={app.icon} alt={app.name} className="w-7 h-7 rounded" />
              <span className="font-semibold flex-1">{app.name}</span>
              {MODES.map(mode => (
                <button
                  key={mode.key}
                  className={`px-3 py-1 rounded border text-xs font-bold mx-1 ${state.apps[app.key as AppKey] === mode.key ? 'bg-white text-neutral-900 border-white' : 'bg-neutral-950 text-white border-neutral-800 hover:bg-neutral-900'}`}
                  onClick={() => setAppRule(app.key as AppKey, mode.key)}
                  aria-pressed={state.apps[app.key as AppKey] === mode.key}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </section>
      {/* Vault */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4">The Vault (Held Notifications)</h2>
        <div className="space-y-3">
          {state.vault.length === 0 && <div className="text-zinc-400">No held notifications.</div>}
          {state.vault.map(n => (
            <div key={n.id} className={`flex items-center gap-3 bg-neutral-900 rounded p-3 ${n.released ? 'opacity-50' : ''}`}>
              <img src={APPS.find(a => a.key === n.app)?.icon} alt={n.app} className="w-7 h-7 rounded" />
              <div className="flex-1">
                <div className="font-semibold">{n.title}</div>
                <div className="text-zinc-300 text-xs">{n.message}</div>
                <div className="text-zinc-500 text-xs">{new Date(n.timestamp).toLocaleString('en-GB')}</div>
              </div>
              {!n.released && (
                <button
                  className="px-3 py-1 rounded bg-green-700 text-white text-xs font-bold hover:bg-green-800"
                  onClick={() => releaseVault(n.id)}
                >
                  Release to System Tray
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
      {/* Advanced Admin Settings */}
      <section className="mb-2">
        <button
          className="text-xs underline mb-2"
          onClick={() => setAdminOpen(o => !o)}
          aria-expanded={adminOpen}
        >
          Advanced Admin Settings
        </button>
        {adminOpen && (
          <div className="bg-neutral-900 rounded p-4 mt-2 space-y-2">
            <button className="px-3 py-1 rounded bg-neutral-800 text-white text-xs font-bold mr-2" onClick={exportRules}>Export Rules JSON</button>
            <label className="px-3 py-1 rounded bg-neutral-800 text-white text-xs font-bold cursor-pointer">
              Import Rules JSON
              <input type="file" accept="application/json" className="hidden" onChange={importRules} />
            </label>
            <button className="px-3 py-1 rounded bg-red-700 text-white text-xs font-bold ml-2" onClick={clearVault}>Clear Held Notification Log</button>
          </div>
        )}
      </section>
    </div>
  );
}
