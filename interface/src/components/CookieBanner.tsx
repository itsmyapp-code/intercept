"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "intercept_cookie_consent";

export type ConsentStatus = "accepted" | "rejected" | null;

export default function CookieBanner() {
  const [consent, setConsent] = useState<ConsentStatus>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentStatus;
    if (!stored) {
      // Slight delay so page renders first
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
    setConsent(stored);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setConsent("accepted");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    setConsent("rejected");
    setVisible(false);
  };

  if (!visible || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-[#0a0a0a] border-t border-zinc-800
        px-6 py-5
        transition-transform duration-500
        ${visible ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Text */}
        <div className="flex-1 text-sm text-zinc-300 leading-relaxed">
          <span className="font-semibold text-white">We use cookies & local storage</span> to store your Intercept preferences (routing rules, schedule, and engine state) on your device. We use no analytics or tracking cookies.{" "}
          <Link href="/cookies" className="text-[#ff5500] hover:underline">
            Cookie Policy
          </Link>{" "}
          ·{" "}
          <Link href="/privacy" className="text-[#ff5500] hover:underline">
            Privacy Policy
          </Link>
        </div>

        {/* Buttons — equal prominence per UK GDPR / PECR */}
        <div className="flex gap-3 flex-shrink-0">
          <button
            id="cookie-reject-btn"
            onClick={handleReject}
            className="
              px-5 py-2.5 text-sm font-semibold font-mono
              border border-zinc-600 text-zinc-300
              hover:border-zinc-400 hover:text-white
              transition-colors
            "
            aria-label="Reject non-essential cookies"
          >
            Reject Non-Essential
          </button>
          <button
            id="cookie-accept-btn"
            onClick={handleAccept}
            className="
              px-5 py-2.5 text-sm font-semibold font-mono
              border border-zinc-600 text-zinc-300
              hover:border-zinc-400 hover:text-white
              transition-colors
            "
            aria-label="Accept all cookies"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
