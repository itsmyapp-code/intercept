export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4 text-white">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <div className="text-zinc-300 text-sm mb-2">Last Updated: 20 May 2026</div>
      <ul className="list-disc ml-6 my-4 space-y-2">
        <li>Data Collection: Includes Identity (Name), Contact (Email), Technical (IP), and Usage data.</li>
        <li>Legitimate Interests (2027 Update): We process data for "Recognised Legitimate Interests" including security, emergency response, and crime prevention without requiring a balancing test.</li>
        <li>Automated Decisions: If AI is used for significant user decisions, users have the right to meaningful human intervention.</li>
        <li>Complaint Rights: Users have a right to complain directly via our electronic form. We must acknowledge all complaints within 30 days.</li>
      </ul>
      <p>Contact: <a href="mailto:hello@itsmyapp.co.uk" className="underline">hello@itsmyapp.co.uk</a></p>
    </main>
  );
}