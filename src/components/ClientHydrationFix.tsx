"use client";

import { useEffect } from "react";

export default function ClientHydrationFix() {
  useEffect(() => {
    // If we're in a VS Code context, the vsc-initialized class might be added
    // This will run only on the client after hydration, so it won't affect
    // server rendering or cause hydration mismatches
    const handleVSCodeClass = () => {
      // Remove the class if it was added by VS Code
      if (document.body.classList.contains("vsc-initialized")) {
        document.body.classList.remove("vsc-initialized");
      }
    };

    // Run once on mount
    handleVSCodeClass();

    // Also set up an observer to handle if the class is added dynamically
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          handleVSCodeClass();
        }
      });
    });

    observer.observe(document.body, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
