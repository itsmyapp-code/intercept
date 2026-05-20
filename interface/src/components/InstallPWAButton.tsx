"use client";
import { useEffect, useState } from 'react';

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    if ((window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
    }
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  if (installed || !deferredPrompt) return null;

  return (
    <button
      className="w-full bg-neutral-900 text-white font-bold py-3 rounded mb-4 border border-neutral-800 hover:bg-neutral-800"
      onClick={async () => {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setInstalled(true);
      }}
      aria-label="Install Intercept as an app"
    >
      Install App
    </button>
  );
};

export default InstallPWAButton;
