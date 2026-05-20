export default function HelpPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4 text-white">
      <h1 className="text-3xl font-bold mb-4">Intercept User Guide</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>Intercept is a privacy-first notification manager and control dashboard, designed for both web and Android. It allows you to filter, hold, and release notifications based on your own rules, with full compliance and transparency.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Installation</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li><b>PWA:</b> On your mobile or desktop browser, tap the “Install App” button or use your browser’s “Add to Home Screen” option.</li>
          <li><b>Android Bridge:</b> Advanced users can install the GatekeeperNotificationService on Android for system-level notification control (see project docs).</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Dashboard Usage</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li><b>Header:</b> Shows app status, logo, and Android connection badge.</li>
          <li><b>Control Engine:</b> Master toggle to enable/disable filtering. “Current Mode” shows which rule set is active.</li>
          <li><b>Rules Matrix:</b> Set each app (Gmail, WhatsApp, Slack, SMS) to Always Allow, Always Block, or Schedule Based.</li>
          <li><b>The Vault:</b> View held notifications, release them to your system tray, or clear the log in Admin Settings.</li>
          <li><b>Admin Settings:</b> Import/export your rules as JSON, or clear all held notifications.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Compliance & Privacy</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Cookie consent banner appears on first visit. You can accept or reject all non-essential cookies with equal prominence.</li>
          <li>All compliance documents (Terms, Privacy, Cookies, Accessibility) are available in the footer.</li>
          <li>Contact: <a href="mailto:hello@itsmyapp.co.uk" className="underline">hello@itsmyapp.co.uk</a></li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Android Bridge (Advanced)</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Install the GatekeeperNotificationService on your Android device for system-level notification filtering.</li>
          <li>Configure package rules to match your dashboard settings.</li>
          <li>All blocked notifications are logged locally and can be synced to the web dashboard.</li>
        </ul>
      </section>
    </main>
  );
}