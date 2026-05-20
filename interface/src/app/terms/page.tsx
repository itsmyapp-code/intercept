import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-6 text-white">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#ff5500] text-sm font-mono mb-8 transition-colors"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-4xl font-bold tracking-tight mb-2">Terms of Service</h1>
      <p className="text-zinc-500 text-sm font-mono mb-10">
        Last Updated: 20 May 2026 · <a href="mailto:hello@itsmyapp.co.uk" className="text-[#ff5500] hover:underline">hello@itsmyapp.co.uk</a>
      </p>

      <div className="space-y-8 text-zinc-300 leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">1. Acceptance of Terms</h2>
          <p>By downloading, installing, or using the Intercept application (&quot;the App&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use the App.</p>
          <p className="mt-2">The App is operated by ItsMyApp.co.uk, a trading name of a UK-based software developer. References to &quot;we&quot;, &quot;us&quot;, or &quot;our&quot; mean ItsMyApp.co.uk.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">2. Description of Service</h2>
          <p>Intercept is a notification management application that intercepts, holds, and schedules the delivery of notifications from third-party applications on your Android device. The App operates entirely on your device. We do not collect, store, or process your notification content on any external server.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">3. Permitted Use</h2>
          <p>You may use the App solely for your personal, non-commercial purposes. You must not:</p>
          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li>Use the App for any unlawful purpose or in violation of any applicable law</li>
            <li>Attempt to reverse engineer, decompile, or disassemble the App</li>
            <li>Use the App to intercept notifications belonging to another person without their consent</li>
            <li>Transmit any malware, viruses, or other harmful code through the App</li>
            <li>Impersonate any person or entity or falsely state or misrepresent your affiliation with any person or entity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">4. Intellectual Property</h2>
          <p>All intellectual property rights in the App, including but not limited to the design, source code, logos, and content, are owned by ItsMyApp.co.uk or its licensors. These Terms do not transfer any intellectual property rights to you.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">5. Disclaimer of Warranties</h2>
          <p>The App is provided &quot;as is&quot; without any warranty of any kind, express or implied. We do not warrant that the App will be uninterrupted, error-free, or free of viruses or other harmful components. You use the App at your own risk.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">6. Limitation of Liability</h2>
          <p>To the maximum extent permitted by UK law, ItsMyApp.co.uk shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising from your use of or inability to use the App.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">7. Suspension and Termination</h2>
          <p>We reserve the right to suspend or terminate your access to the App at any time, without prior notice, if we reasonably believe you have breached these Terms of Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">8. Governing Law</h2>
          <p>These Terms of Service are governed by and construed in accordance with the laws of England and Wales. Any disputes arising shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">9. Changes to These Terms</h2>
          <p>We may update these Terms from time to time. Continued use of the App after changes are published constitutes acceptance of the updated Terms. We will endeavour to notify users of significant changes via an in-app notification.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">10. Contact</h2>
          <p>For any queries regarding these Terms, please contact us at: <a href="mailto:hello@itsmyapp.co.uk" className="text-[#ff5500] hover:underline">hello@itsmyapp.co.uk</a></p>
        </section>

      </div>
    </main>
  );
}