"use client";

import InterceptDashboard from "../components/InterceptDashboard";
import InstallPWAButton from "../components/InstallPWAButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-50 font-sans flex flex-col">
      <div className="w-full">
        <InstallPWAButton />
        <InterceptDashboard />
      </div>
    </div>
  );
}
