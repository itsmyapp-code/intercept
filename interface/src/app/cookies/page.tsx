import Link from "next/link";

export default function CookiesPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-6 text-white">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#ff5500] text-sm font-mono mb-8 transition-colors"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-4xl font-bold tracking-tight mb-2">Cookie Policy</h1>
      <p className="text-zinc-500 text-sm font-mono mb-10">
        Last Updated: 20 May 2026 · <a href="mailto:hello@itsmyapp.co.uk" className="text-[#ff5500] hover:underline">hello@itsmyapp.co.uk</a>
      </p>

      <div className="space-y-8 text-zinc-300 leading-relaxed">

        <section className="bg-zinc-900/50 border border-zinc-800 p-4 rounded">
          <p className="text-sm">This Cookie Policy explains how ItsMyApp.co.uk uses cookies and similar technologies on the Intercept web application. It is intended to comply with the UK GDPR and the Privacy and Electronic Communications Regulations (PECR).</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">1. What Are Cookies?</h2>
          <p>Cookies are small text files placed on your device when you visit a website. They help websites recognise your device and remember certain information about your visit. &quot;Similar technologies&quot; include localStorage and sessionStorage, which we use for storing your App preferences on your device.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">2. How We Use Cookies and Local Storage</h2>

          <div className="space-y-4">
            <div className="border border-zinc-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">Strictly Necessary</h3>
                <span className="text-xs font-mono bg-emerald-900/60 text-emerald-400 px-2 py-1">Always Active</span>
              </div>
              <p className="text-sm">These are essential to operate the App. They include:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1 text-sm">
                <li><strong className="text-white">Intercept Engine State</strong> (localStorage) — stores whether the engine is Engaged or Disabled</li>
                <li><strong className="text-white">App Routing Rules</strong> (localStorage) — stores your per-app notification rules (Allow / Block / Postbox)</li>
                <li><strong className="text-white">Delivery Schedule</strong> (localStorage) — stores your custom notification batch delivery times</li>
                <li><strong className="text-white">Cookie Consent Preference</strong> (localStorage) — remembers your consent decision</li>
              </ul>
              <p className="text-xs text-zinc-500 mt-3">Lawful basis: Legitimate Interests. No consent required under PECR as these are strictly necessary.</p>
            </div>

            <div className="border border-zinc-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">Performance / Analytics</h3>
                <span className="text-xs font-mono bg-zinc-800 text-zinc-400 px-2 py-1">Opt-In Required</span>
              </div>
              <p className="text-sm">We do not currently use any analytics or performance tracking cookies. If we introduce them in future, we will request your explicit consent before setting them. No analytics scripts will fire without a positive &quot;Accept&quot; action.</p>
            </div>

            <div className="border border-zinc-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">Marketing / Third-Party Tracking</h3>
                <span className="text-xs font-mono bg-zinc-800 text-zinc-400 px-2 py-1">Opt-In Required</span>
              </div>
              <p className="text-sm">We do not use any marketing cookies, advertising pixels, or third-party trackers. We will never introduce these without requesting your explicit, informed consent first.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">3. Your Cookie Choices</h2>
          <p>When you first visit the App, you will be presented with a cookie consent banner offering equal-prominence &quot;Accept All&quot; and &quot;Reject Non-Essential&quot; options in accordance with UK GDPR and PECR Equal Prominence rules. You can change your preferences at any time by clearing your browser site data.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">4. Managing Cookies</h2>
          <p>You can control or delete localStorage data through your browser settings:</p>
          <ul className="list-disc ml-6 mt-3 space-y-2 text-sm">
            <li><strong className="text-white">Chrome / Edge:</strong> Settings → Privacy and Security → Clear browsing data → Cookies and other site data</li>
            <li><strong className="text-white">Firefox:</strong> Settings → Privacy &amp; Security → Cookies and Site Data → Clear Data</li>
            <li><strong className="text-white">Safari:</strong> Settings → Advanced → Website Data → Remove All Website Data</li>
          </ul>
          <p className="mt-3 text-sm text-zinc-500">Note: Clearing site data will also reset your Intercept App preferences (routing rules, schedule, engine state).</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">5. Contact</h2>
          <p>If you have any questions about our use of cookies, please contact us at: <a href="mailto:hello@itsmyapp.co.uk" className="text-[#ff5500] hover:underline">hello@itsmyapp.co.uk</a></p>
        </section>

      </div>
    </main>
  );
}