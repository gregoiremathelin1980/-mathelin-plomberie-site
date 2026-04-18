"use client";

import { useSettings } from "@/contexts/SettingsContext";

export default function UrgencyBlock() {
  const settings = useSettings();
  const phoneRaw = settings.phone.replace(/\s/g, "");

  return (
    <section className="bg-primary px-4 py-8 text-white sm:px-6" aria-label="Urgence plomberie">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-xl font-bold sm:text-2xl">
          Urgence plomberie ou chauffage dans le Bugey et la Côtière
        </h2>
        <p className="mt-3 text-white/95">
          Fuite d&apos;eau, chauffe-eau en panne, radiateur qui ne chauffe plus ou canalisation bouchée : intervention rapide autour de Meximieux, Ambérieu, Lagnieu et Pérouges.
        </p>
        <p className="mt-2 text-sm text-white/90">
          Urgences selon disponibilité.
        </p>
        <a
          href={`tel:${phoneRaw}`}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-primary shadow-lg transition hover:bg-primary-50"
        >
          <span aria-hidden>📞</span>
          Appeler maintenant
        </a>
      </div>
    </section>
  );
}
