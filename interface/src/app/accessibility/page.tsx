import Link from "next/link";

export default function AccessibilityPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-6 text-white">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#ff5500] text-sm font-mono mb-8 transition-colors"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-4xl font-bold tracking-tight mb-2">Accessibility Statement</h1>
      <p className="text-zinc-500 text-sm font-mono mb-10">
        Last Updated: 20 May 2026 · <a href="mailto:hello@itsmyapp.co.uk" className="text-[#ff5500] hover:underline">hello@itsmyapp.co.uk</a>
      </p>

      <div className="space-y-8 text-zinc-300 leading-relaxed">
        <section className="bg-zinc-900/50 border border-zinc-800 p-4 rounded">
          <p className="text-sm">
            ItsMyApp.co.uk is committed to ensuring digital accessibility for all users of the Intercept application. We are continuously improving the user experience and applying the relevant accessibility standards to achieve this.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">Conformance Status</h2>
          <p>
            The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
          </p>
          <p className="mt-2">
            Intercept is partially conformant with <strong className="text-white">WCAG 2.1 Level AA</strong>. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">Feedback & Contact</h2>
          <p>
            We welcome your feedback on the accessibility of Intercept. Please let us know if you encounter accessibility barriers on the App:
          </p>
          <ul className="list-disc ml-6 mt-3 space-y-2 text-sm">
            <li>Email: <a href="mailto:hello@itsmyapp.co.uk" className="text-[#ff5500] hover:underline">hello@itsmyapp.co.uk</a></li>
            <li>We try to respond to feedback within 5 business days.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">Technical Specifications</h2>
          <p>
            Accessibility of Intercept relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
          </p>
          <ul className="list-disc ml-6 mt-3 space-y-2 text-sm font-mono">
            <li>HTML / Semantic DOM markup</li>
            <li>WAI-ARIA attributes where necessary</li>
            <li>CSS styling</li>
            <li>JavaScript</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-[#ff5500] pl-4">Assessment Approach</h2>
          <p>
            ItsMyApp.co.uk assessed the accessibility of Intercept by self-evaluation during the development and design stages, verifying keyboard interaction flows, contrast guidelines, and screen reader labels.
          </p>
        </section>
      </div>
    </main>
  );
}