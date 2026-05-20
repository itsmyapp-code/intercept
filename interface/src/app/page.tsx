"use client";

import InterceptDashboard from "../components/InterceptDashboard";
import InstallPWAButton from "../components/InstallPWAButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-50 font-sans flex flex-col items-center py-8">
      <div className="w-full max-w-4xl px-4">
        <InstallPWAButton />
        <InterceptDashboard />
      </div>
    </div>
  );
}
