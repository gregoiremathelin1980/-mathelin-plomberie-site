"use client";

import { useEffect } from "react";

/**
 * En cas de ChunkLoadError (timeout Next.js), recharge la page une fois.
 * Évite que l'utilisateur reste bloqué sur une erreur de chunk.
 */
export default function ChunkLoadErrorHandler() {
  useEffect(() => {
    const key = "chunk-load-reload";
    const handleError = (event: ErrorEvent) => {
      const message = event.message || "";
      if (
        message.includes("ChunkLoadError") ||
        message.includes("Loading chunk") ||
        message.includes("load failed")
      ) {
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, "1");
          window.location.reload();
        }
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  return null;
}
