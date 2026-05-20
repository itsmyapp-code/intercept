// Shared types and localStorage helpers used across all Intercept pages

export const APPS = [
  { key: "outlook", name: "Outlook", package: "com.microsoft.office.outlook", iconColor: "text-blue-600" },
  { key: "whatsapp", name: "WhatsApp", package: "com.whatsapp", iconColor: "text-emerald-500" },
  { key: "messenger", name: "Messenger", package: "com.facebook.orca", iconColor: "text-violet-500" },
  { key: "sms", name: "Text Messages", package: "com.google.android.apps.messaging", iconColor: "text-sky-500" },
  { key: "gmail", name: "Gmail", package: "com.google.android.gm", iconColor: "text-red-500" },
] as const;

export type AppKey = typeof APPS[number]["key"];

export interface AppCustomisation {
  mode: "ALWAYS_ALLOW" | "ALWAYS_BLOCK" | "POSTBOX";
}

export interface DeliveryTime {
  id: string;
  hour: number;
  minute: number;
  isEnabled: boolean;
}

export interface InterceptedAlert {
  id: string;
  appKey: AppKey;
  title: string;
  textBody: string;
  timestamp: number;
  isReleased: boolean;
  isPostboxBatch: boolean;
}

export interface InterceptState {
  engineEngaged: boolean;
  appCustomisations: Record<AppKey, AppCustomisation>;
  deliveryTimes: DeliveryTime[];
  interceptedAlerts: InterceptedAlert[];
}

export const LOCAL_STORAGE_KEY = "intercept_postbox_dashboard_state";

export const DEFAULT_CUSTOMISATIONS: Record<AppKey, AppCustomisation> = {
  outlook: { mode: "POSTBOX" },
  whatsapp: { mode: "ALWAYS_ALLOW" },
  messenger: { mode: "POSTBOX" },
  sms: { mode: "ALWAYS_ALLOW" },
  gmail: { mode: "POSTBOX" },
};

export const DEFAULT_DELIVERY_TIMES: DeliveryTime[] = [
  { id: "dt-1", hour: 9, minute: 0, isEnabled: true },
  { id: "dt-2", hour: 13, minute: 0, isEnabled: true },
  { id: "dt-3", hour: 17, minute: 0, isEnabled: true },
  { id: "dt-4", hour: 21, minute: 0, isEnabled: true },
];

export function loadState(): InterceptState {
  if (typeof window === "undefined") {
    return {
      engineEngaged: true,
      appCustomisations: DEFAULT_CUSTOMISATIONS,
      deliveryTimes: DEFAULT_DELIVERY_TIMES,
      interceptedAlerts: [],
    };
  }
  try {
    const cached = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return {
        engineEngaged: typeof parsed.engineEngaged === "boolean" ? parsed.engineEngaged : true,
        appCustomisations: parsed.appCustomisations || DEFAULT_CUSTOMISATIONS,
        deliveryTimes: parsed.deliveryTimes || DEFAULT_DELIVERY_TIMES,
        interceptedAlerts: parsed.interceptedAlerts || [],
      };
    }
  } catch (err) {
    console.error("Error loading state:", err);
  }
  return {
    engineEngaged: true,
    appCustomisations: DEFAULT_CUSTOMISATIONS,
    deliveryTimes: DEFAULT_DELIVERY_TIMES,
    interceptedAlerts: [],
  };
}

export function saveState(state: InterceptState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

export function getNextDeliveryTime(deliveryTimes: DeliveryTime[]): string {
  const enabledTimes = deliveryTimes.filter(t => t.isEnabled);
  if (enabledTimes.length === 0) return "None set";

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const sorted = [...enabledTimes].sort((a, b) => (a.hour * 60 + a.minute) - (b.hour * 60 + b.minute));
  const next = sorted.find(s => (s.hour * 60 + s.minute) > currentMinutes);

  if (next) {
    return `${String(next.hour).padStart(2, "0")}:${String(next.minute).padStart(2, "0")}`;
  }
  return `${String(sorted[0].hour).padStart(2, "0")}:${String(sorted[0].minute).padStart(2, "0")} (Tomorrow)`;
}
