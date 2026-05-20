import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-6 text-white">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#ff5500] text-sm font-mono mb-8 transition-colors"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-zinc-500 text-sm font-mono mb-10">
        Last Updated: 20 May 2026 · <a href="mailto:hello@itsmyapp.co.uk" className="text-[#ff5500] hover:underline">hello@itsmyapp.co.uk</a>
      </p>

      <div className="space-y-8 text-zinc-300 leading-relaxed">

        <section className="bg-zinc-900/50 border border-zinc-800 p-4 rounded">
          <p className="text-sm">This Privacy Policy applies to the Intercept application (&quot;the App&quot;) operated by ItsMyApp.co.uk. We are committed to protecting your personal data and your rights under UK GDPR and the Data Protection Act 2018.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">1. Data Controller</h2>
          <p>ItsMyApp.co.uk is the Data Controller for any personal data collected through the App. Contact: <a href="mailto:hello@itsmyapp.co.uk" className="text-[#ff5500] hover:underline">hello@itsmyapp.co.uk</a></p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">2. What Data We Collect</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-white mb-2">On-Device Data (Not transmitted to us)</h3>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Notification content (app name, title, body text, timestamp) — stored locally on your device only</li>
                <li>App routing rules and delivery schedule preferences — stored in your browser&apos;s localStorage</li>
                <li>Engine state (Engaged / Disabled) — stored locally</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Identity &amp; Contact Data (if you contact us)</h3>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Name and email address provided in support correspondence</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Technical Data (Web/PWA only)</h3>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>IP address (processed by Vercel hosting infrastructure)</li>
                <li>Browser type and version</li>
                <li>Device type and operating system</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">3. How We Use Your Data</h2>
          <table className="w-full text-sm border border-zinc-700">
            <thead>
              <tr className="bg-zinc-800">
                <th className="p-3 text-left font-semibold text-white">Purpose</th>
                <th className="p-3 text-left font-semibold text-white">Lawful Basis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <tr>
                <td className="p-3">Deliver App functionality (notification interception)</td>
                <td className="p-3">Contract / Legitimate Interests</td>
              </tr>
              <tr>
                <td className="p-3">Respond to support enquiries</td>
                <td className="p-3">Legitimate Interests</td>
              </tr>
              <tr>
                <td className="p-3">Improve the App</td>
                <td className="p-3">Legitimate Interests</td>
              </tr>
              <tr>
                <td className="p-3">Comply with legal obligations</td>
                <td className="p-3">Legal Obligation</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">4. Data Sharing</h2>
          <p>We do not sell, rent, or trade your personal data. We may share data with:</p>
          <ul className="list-disc ml-6 mt-3 space-y-2 text-sm">
            <li><strong className="text-white">Vercel Inc.</strong> — hosting infrastructure (subject to Vercel&apos;s Data Processing Agreement)</li>
            <li><strong className="text-white">Law enforcement</strong> — only where required by applicable law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">5. Data Retention</h2>
          <p>On-device notification data is retained until you clear it via the Vault or uninstall the App. Support correspondence is retained for a maximum of 2 years after resolution.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">6. Automated Decisions</h2>
          <p>The App uses automated rule evaluation to decide whether to intercept a notification. This does not constitute a decision that significantly affects you legally or otherwise. If AI-assisted features are introduced in future, we will update this policy and ensure you have the right to meaningful human review of any significant automated decision.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">7. Your Rights</h2>
          <p>Under UK GDPR, you have the right to:</p>
          <ul className="list-disc ml-6 mt-3 space-y-2 text-sm">
            <li><strong className="text-white">Access</strong> — request a copy of personal data we hold about you</li>
            <li><strong className="text-white">Rectification</strong> — request correction of inaccurate data</li>
            <li><strong className="text-white">Erasure</strong> — request deletion of your personal data</li>
            <li><strong className="text-white">Restriction</strong> — request we limit processing of your data</li>
            <li><strong className="text-white">Portability</strong> — receive your data in a structured, machine-readable format</li>
            <li><strong className="text-white">Objection</strong> — object to processing based on legitimate interests</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:hello@itsmyapp.co.uk" className="text-[#ff5500] hover:underline">hello@itsmyapp.co.uk</a>. We will respond within 30 days.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">8. Complaints</h2>
          <p>If you are unhappy with how we handle your data, you may complain directly to us at <a href="mailto:hello@itsmyapp.co.uk" className="text-[#ff5500] hover:underline">hello@itsmyapp.co.uk</a>. We will acknowledge all complaints within 30 days. You also have the right to lodge a complaint with the <strong className="text-white">Information Commissioner&apos;s Office (ICO)</strong> at <a href="https://ico.org.uk" className="text-[#ff5500] hover:underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">9. Security</h2>
          <p>We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. Notification data processed by the App is stored entirely on your device and is not transmitted to our servers.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via an in-app notification. Continued use of the App after changes constitutes acceptance of the updated policy.</p>
        </section>

      </div>
    </main>
  );
}