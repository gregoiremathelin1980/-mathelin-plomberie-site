"use client";

import { Phone } from "lucide-react";
import { usePhoneRaw } from "@/contexts/SettingsContext";

export default function MobileCallButton() {
  const phoneRaw = usePhoneRaw();

  return (
    <a
      href={`tel:${phoneRaw}`}
      className="fixed bottom-6 right-6 z-50 flex md:hidden items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-3.5 font-semibold text-white shadow-lg transition hover:bg-green-700"
      aria-label="Appeler maintenant"
    >
      <Phone className="h-5 w-5" aria-hidden />
      Appeler maintenant
    </a>
  );
}
