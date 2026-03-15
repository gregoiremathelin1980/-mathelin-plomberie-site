"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { SiteSettings, DisplaySettings } from "@/lib/content";

const SettingsContext = createContext<SiteSettings | null>(null);

export function SettingsProvider({
  initialSettings,
  children,
}: {
  initialSettings: SiteSettings;
  children: React.ReactNode;
}) {
  const value = useMemo(() => initialSettings, [initialSettings]);
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SiteSettings {
  const ctx = useContext(SettingsContext);
  const defaultDisplay: DisplaySettings = {
    showReviews: true,
    showAdvice: true,
    showAdviceImages: true,
    showEstimator: true,
    showRecentInterventions: true,
  };
  if (!ctx) {
    return {
      company: "Mathelin Plomberie Chauffage",
      phone: "04 74 00 00 00",
      email: "contact@mathelin-plomberie-chauffage.fr",
      address: "57 impasse des Verchères, 01800 Pérouges, France",
      service_radius: "15 km",
      business_hours: undefined,
      show_advice_images: true,
      show_chantier_photos: true,
      displaySettings: defaultDisplay,
      cities: [
        "Pérouges",
        "Meximieux",
        "Ambérieu-en-Bugey",
        "Saint-Vulbas",
        "Lagnieu",
        "Villieu-Loyes-Mollon",
        "Blyes",
        "Leyment",
      ],
    };
  }
  if (!ctx.displaySettings) {
    return { ...ctx, displaySettings: defaultDisplay };
  }
  return ctx;
}

/** Raw phone for tel: links (no spaces) */
export function usePhoneRaw(): string {
  const s = useSettings();
  return s.phone.replace(/\s/g, "");
}
