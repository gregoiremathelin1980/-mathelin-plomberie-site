"use client";

import { usePhoneRaw } from "@/contexts/SettingsContext";

export default function MobileCallButton() {
  const phoneRaw = usePhoneRaw();

  return (
    <a
      href={`tel:${phoneRaw}`}
      className="fixed bottom-6 right-6 z-50 flex md:hidden items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-3.5 font-semibold text-white shadow-lg transition hover:bg-orange-600"
      aria-label="Appeler"
    >
      <span aria-hidden>📞</span>
      Appeler
    </a>
  );
}
