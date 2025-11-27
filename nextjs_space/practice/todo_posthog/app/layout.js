"use client";

import { useEffect } from "react";
import { initPosthog } from "../lib/posthog";

export default function RootLayout({ children }) {
  useEffect(() => {
    initPosthog();
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
