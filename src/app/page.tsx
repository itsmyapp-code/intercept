import Image from "next/image";

export default function Home() {
  return (
import ScheduleList from "../components/ScheduleList";
import AppConfigList from "../components/AppConfigList";
import NotificationStream from "../components/NotificationStream";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-50 font-sans flex flex-col items-center">
      <header className="w-full max-w-3xl px-4 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Intercept</h1>
        {/* Theme toggle placeholder */}
      </header>
      <main className="w-full max-w-3xl px-4 flex-1 flex flex-col gap-8">
        <ScheduleList />
        <AppConfigList />
        <NotificationStream />
      </main>
      <footer className="w-full max-w-3xl px-4 py-4 text-center text-zinc-500 text-xs">
        &copy; {new Date().getFullYear()} Intercept. All rights reserved.
      </footer>
    </div>
  );
  );
}
