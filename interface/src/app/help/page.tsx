import Link from "next/link";

export default function HelpPage() {
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
            Help<span className="text-[#ff5500]">.</span>
          </h1>
          <p className="text-sm text-zinc-500 font-mono uppercase tracking-widest mt-2">
            Quick Start &amp; FAQ
          </p>
        </div>

        {/* Getting Started */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-tight text-[#ff5500]">Getting Started</h2>
          <div className="space-y-3">
            <div className="border border-zinc-900 bg-black p-4 space-y-2">
              <h3 className="text-sm font-bold uppercase text-white">1. Install the App</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                On your mobile or desktop browser, tap the &ldquo;Install App&rdquo; button or use your browser&apos;s
                &ldquo;Add to Home Screen&rdquo; option. Intercept runs as a Progressive Web App.
              </p>
            </div>
            <div className="border border-zinc-900 bg-black p-4 space-y-2">
              <h3 className="text-sm font-bold uppercase text-white">2. Set Your App Rules</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                On the Dashboard, use the Notification Routing Matrix to set each app to
                <strong className="text-emerald-400"> Allow</strong>,
                <strong className="text-red-400"> Block</strong>, or
                <strong className="text-[#ff5500]"> Postbox</strong> mode.
              </p>
            </div>
            <div className="border border-zinc-900 bg-black p-4 space-y-2">
              <h3 className="text-sm font-bold uppercase text-white">3. Configure Your Schedule</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Open the hamburger menu (☰) to set custom delivery times for Postbox mode,
                or choose a quick preset profile.
              </p>
            </div>
            <div className="border border-zinc-900 bg-black p-4 space-y-2">
              <h3 className="text-sm font-bold uppercase text-white">4. Check The Vault</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Held notifications appear in The Vault on the right side of the Dashboard.
                Release them individually or wait for your next scheduled batch delivery.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-tight text-[#ff5500]">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <div className="border border-zinc-900 bg-black p-4 space-y-2">
              <h3 className="text-sm font-bold text-white">Where is my data stored?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                All configuration and notification logs are stored locally in your browser&apos;s
                localStorage. Nothing is sent to any server.
              </p>
            </div>
            <div className="border border-zinc-900 bg-black p-4 space-y-2">
              <h3 className="text-sm font-bold text-white">What happens if I turn off the Master Engine?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                All notifications will bypass filtering and be delivered normally. Your rules
                and schedule are preserved and will re-activate when you re-engage the engine.
              </p>
            </div>
            <div className="border border-zinc-900 bg-black p-4 space-y-2">
              <h3 className="text-sm font-bold text-white">Can I use this on multiple devices?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Yes — install the PWA on each device. Note that settings are stored per-device
                in localStorage and are not synced between devices.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-3 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-bold uppercase tracking-tight text-[#ff5500]">Contact &amp; Support</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            For support, reach out to{" "}
            <a href="mailto:hello@itsmyapp.co.uk" className="text-[#ff5500] underline hover:text-[#ff6b00]">
              hello@itsmyapp.co.uk
            </a>
          </p>
          <p className="text-sm text-zinc-400">
            For detailed feature documentation, see the{" "}
            <Link href="/user-guide" className="text-[#ff5500] underline hover:text-[#ff6b00]">
              User Guide
            </Link>.
          </p>
        </section>
      </div>
    </main>
  );
}