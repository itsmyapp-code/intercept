export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4 text-white">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <div className="text-zinc-300 text-sm mb-2">Last Updated: 20 May 2026</div>
      <p>By using Intercept, you agree to these terms.</p>
      <ul className="list-disc ml-6 my-4 space-y-2">
        <li>Users are responsible for account security and the confidentiality of shared lockbox codes.</li>
        <li>No unlawful use, transmitting malware, or impersonating personnel.</li>
        <li>Intercept is not liable for indirect or consequential damages.</li>
        <li>We reserve the right to suspend access for breaches of these terms.</li>
      </ul>
      <p>Contact: <a href="mailto:hello@itsmyapp.co.uk" className="underline">hello@itsmyapp.co.uk</a></p>
    </main>
  );
}