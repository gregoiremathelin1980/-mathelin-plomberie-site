"use client";

import { MapPin } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

export default function AreaSection() {
  const settings = useSettings();
  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MapPin className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
              Zone d&apos;intervention
            </h2>
            <p className="mt-0.5 text-gray-text">
              Nous intervenons dans un rayon de {settings.service_radius} autour de Pérouges.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {settings.cities.map((city) => (
            <span
              key={city}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-primary shadow-sm"
            >
              {city}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
