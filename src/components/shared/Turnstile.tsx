"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface TurnstileProps {
  onVerify: (token: string) => void;
  siteKey?: string;
}

export default function Turnstile({ onVerify, siteKey }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const key = siteKey || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"; // Default Turnstile test sitekey

  useEffect(() => {
    const renderWidget = () => {
      if (
        typeof window !== "undefined" &&
        (window as any).turnstile &&
        containerRef.current &&
        !widgetIdRef.current
      ) {
        try {
          widgetIdRef.current = (window as any).turnstile.render(containerRef.current, {
            sitekey: key,
            callback: (token: string) => {
              onVerify(token);
            },
            "error-callback": () => {
              console.error("Turnstile verification failed or errored.");
            },
            theme: "dark",
          });
        } catch (e) {
          console.error("Error rendering Turnstile widget:", e);
        }
      }
    };

    if (typeof window !== "undefined" && (window as any).turnstile) {
      renderWidget();
    } else {
      // Define onload callback for Turnstile script
      (window as any).onloadTurnstileCallback = renderWidget;
    }

    return () => {
      if (widgetIdRef.current && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch (e) {
          // ignore cleanup errors on unmount
        }
      }
    };
  }, [key, onVerify]);

  return (
    <div className="flex justify-center my-4 min-h-[65px]">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
        async
        defer
        strategy="afterInteractive"
      />
      <div ref={containerRef} className="cf-turnstile" />
    </div>
  );
}
