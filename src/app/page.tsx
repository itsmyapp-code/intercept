"use client";

import GatekeeperDashboard from "../components/GatekeeperDashboard";
import InstallPWAButton from "../components/InstallPWAButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-50 font-sans flex flex-col items-center py-8">
      <div className="w-full max-w-2xl px-4">
        <InstallPWAButton />
        <GatekeeperDashboard />
      </div>
    </div>
  );
}
