"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  }

  function acceptEssentialOnly() {
    localStorage.setItem("cookie-consent", "essential");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-lg mx-auto">
      <div className="bg-ink-card border border-ink-border rounded-xl p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-[13px] text-apple-black font-semibold mb-1">
              We value your privacy
            </p>
            <p className="text-[12px] text-apple-gray leading-relaxed">
              We use cookies to enhance your browsing experience, analyze site traffic,
              and personalize content. By continuing to use our site, you consent to our{" "}
              <a href="/privacy" className="text-gold hover:underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="/terms" className="text-gold hover:underline">
                Terms & Conditions
              </a>
              .
            </p>
          </div>
          <button
            onClick={acceptEssentialOnly}
            className="shrink-0 p-1.5 text-apple-gray hover:text-apple-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={accept}
            className="flex-1 bg-gold text-ink text-[12px] font-semibold uppercase tracking-[0.1em] px-4 py-2.5 rounded-lg hover:bg-gold-light transition-colors"
          >
            Accept
          </button>
          <button
            onClick={acceptEssentialOnly}
            className="flex-1 border border-ink-border text-apple-gray text-[12px] font-semibold uppercase tracking-[0.1em] px-4 py-2.5 rounded-lg hover:bg-ink-light transition-colors"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
}
