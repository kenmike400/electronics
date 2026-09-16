"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      posthog.init("phc_q7ZQgCnnCaBzXvVReHYUzUbzjk9bthBfYTyZGGvfq9od", {
        api_host: "https://eu.i.posthog.com",
        defaults: "2026-05-30",
        person_profiles: "identified_only",
        capture_pageview: false, // we handle it manually for better SPA support
        capture_pageleave: true,
        session_recording: {
          maskAllInputs: false,
        },
      });
    }
  }, []);

  // Capture pageviews on route change
  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + "?" + searchParams.toString();
      }
      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
