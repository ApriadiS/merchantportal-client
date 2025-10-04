"use client";

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

export default function VercelIntegration() {
   useEffect(() => {
      async function loadSpeedInsights() {
         try {
            // Load the module on the client and log it. Avoid calling unknown
            // entrypoints to keep this safe across versions.
            const mod = await import("@vercel/speed-insights");

            // Use unknown to avoid TypeScript assumptions about the shape.
            const asUnknown = mod as unknown;
            console.log("[speed-insights] module loaded:", asUnknown);
         } catch (err) {
            console.warn("Failed to load @vercel/speed-insights:", err);
         }
      }

      loadSpeedInsights();
   }, []);

   // Render Analytics component from @vercel/analytics. It's safe to render on
   // the client and will no-op on the server.
   return <Analytics />;
}
