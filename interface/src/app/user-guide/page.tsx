import Link from "next/link";

export default function UserGuidePage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-6 text-white">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-mono text-zinc-400 hover:text-[#ff5500] transition-colors uppercase tracking-wider mb-8"
      >
        ← Back to Dashboard
      </Link>

      <div className="border border-zinc-800 bg-[#09090b] p-6 sm:p-10 space-y-10">
        {/* Title */}
        <div className="border-b border-zinc-800 pb-6">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            User Guide<span className="text-[#ff5500]">.</span>
          </h1>
          <p className="text-sm text-zinc-500 font-mono uppercase tracking-widest mt-2">
            Complete Reference Manual
          </p>
        </div>

        {/* Overview */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-[#ff5500]">Overview</h2>
          <p className="text-base text-zinc-300 leading-relaxed">
            Intercept is a privacy-first notification filter and control dashboard designed to run as a
            Progressive Web Application (PWA) synchronised with a native Android background service.
            It helps you manage digital wellbeing by intercepting, holding, and batch-delivering
            notifications based on customisable scheduling rules.
          </p>
        </section>

        {/* Supported Apps */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-[#ff5500]">Supported Applications</h2>
          <div className="space-y-2">
            {[
              { name: "Outlook", pkg: "com.microsoft.office.outlook" },
              { name: "WhatsApp", pkg: "com.whatsapp" },
              { name: "Messenger", pkg: "com.facebook.orca" },
              { name: "Text Messages (SMS)", pkg: "com.google.android.apps.messaging" },
              { name: "Gmail", pkg: "com.google.android.gm" },
            ].map((app) => (
              <div key={app.pkg} className="flex items-center gap-3 border border-zinc-900 bg-black px-4 py-3">
                <span className="font-bold text-white text-sm uppercase">{app.name}</span>
                <span className="text-xs text-zinc-500 font-mono">{app.pkg}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Interception Modes */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-tight text-[#ff5500]">Interception Modes</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            For each application, you can independently configure one of three routing modes:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="border border-emerald-900/50 bg-emerald-950/10 p-4 space-y-2">
              <h3 className="text-sm font-bold uppercase text-emerald-400">Always Allow</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Notifications bypass the filter and display immediately in the system tray.
              </p>
            </div>
            <div className="border border-red-900/50 bg-red-950/10 p-4 space-y-2">
              <h3 className="text-sm font-bold uppercase text-red-400">Always Block</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Notifications are permanently silenced and logged directly to The Vault.
              </p>
            </div>
            <div className="border border-[#ff5500]/40 bg-[#ff5500]/5 p-4 space-y-2">
              <h3 className="text-sm font-bold uppercase text-[#ff5500]">Postbox</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Notifications are intercepted and held, then batch-delivered at your scheduled times.
              </p>
            </div>
          </div>
        </section>

        {/* Postbox Schedule */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-[#ff5500]">Postbox Batch Delivery</h2>
          <ul className="space-y-2 text-sm text-zinc-300 leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#ff5500] font-bold">•</span>
              <span><strong>Add Custom Times:</strong> Open the hamburger menu (☰), use the time selector, and tap Add.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#ff5500] font-bold">•</span>
              <span><strong>Preset Profiles:</strong> Choose from Minimalist (2×/day), Deep Work (4×/day), or Hourly (10×/day).</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#ff5500] font-bold">•</span>
              <span><strong>Deliver Now:</strong> Tap the orange &ldquo;Deliver Now&rdquo; button to immediately release all queued notifications.</span>
            </li>
          </ul>
        </section>

        {/* The Vault */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-[#ff5500]">The Vault</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The Vault acts as a chronological registry of all intercepted and blocked notifications:
          </p>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li className="flex gap-2">
              <span className="text-[#ff5500] font-bold">•</span>
              <span><strong>Release Alert:</strong> Forwards the held notification to your device&apos;s system tray.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#ff5500] font-bold">•</span>
              <span><strong>Delete Alert Log:</strong> Removes the log record from the Vault registry.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#ff5500] font-bold">•</span>
              <span><strong>Clear Vault:</strong> Deletes all log records at once.</span>
            </li>
          </ul>
        </section>

        {/* Privacy */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-[#ff5500]">Privacy &amp; Local Persistence</h2>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li className="flex gap-2">
              <span className="text-[#ff5500] font-bold">•</span>
              <span><strong>Zero Cloud Storage:</strong> All configurations save instantly to your browser&apos;s localStorage.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#ff5500] font-bold">•</span>
              <span><strong>PWA Installation:</strong> Use the install button or your browser&apos;s &ldquo;Add to Home Screen&rdquo; to install Intercept on your device.</span>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
