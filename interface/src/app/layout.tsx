import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Intercept",
  description: "Notification manager for scheduling and holding notifications.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-full flex flex-col bg-black">
        {children}
        <footer className="w-full mt-12 border-t border-neutral-900 bg-black py-8 px-4 flex flex-col items-center text-zinc-400 text-xs">
          <div className="flex items-center gap-2 mb-2">
            <img src="/itsmyapp_logo.png" alt="ItsMyApp Logo" className="w-6 h-6" />
            <span>Intercept is Powered by <a href="https://itsmyapp.co.uk" className="underline">ItsMyApp.co.uk</a> | All rights reserved | © 2026</span>
          </div>
          <nav className="flex gap-4">
            <a href="/terms" className="underline">Terms</a>
            <a href="/privacy" className="underline">Privacy</a>
            <a href="/cookies" className="underline">Cookies</a>
            <a href="/accessibility" className="underline">Accessibility</a>
          </nav>
        </footer>
        <script dangerouslySetInnerHTML={{
          __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', function() { navigator.serviceWorker.register('/service-worker.js'); }); }`
        }} />
      </body>
    </html>
  );
}
