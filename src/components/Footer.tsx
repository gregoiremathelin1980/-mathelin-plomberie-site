"use client";

import Link from "next/link";
import { useSettings, usePhoneRaw } from "@/contexts/SettingsContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const settings = useSettings();
  const phoneRaw = usePhoneRaw();

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-heading mb-3 text-lg font-semibold">
              {settings.company}
            </h3>
            <p className="text-sm font-medium text-white">
              Artisan plombier-chauffagiste diplômé (BP Génie Climatique) à votre service depuis 2013.
            </p>
            <p className="mt-3 text-sm text-white/90">
              {settings.address}
            </p>
          </div>
          <div>
            <h3 className="font-heading mb-3 text-lg font-semibold">Liens</h3>
            <ul className="space-y-2 text-sm text-white/90">
              <li>
                <Link href="/services" className="transition hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/depannage" className="transition hover:text-white">
                  Dépannage
                </Link>
              </li>
              <li>
                <Link href="/realisations" className="transition hover:text-white">
                  Réalisations
                </Link>
              </li>
              <li>
                <Link href="/devis" className="transition hover:text-white">
                  Devis
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/conseils" className="transition hover:text-white">
                  Conseils
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading mb-3 text-lg font-semibold">
              Zone d&apos;intervention
            </h3>
            <p className="text-sm text-white/90">
              Rayon {settings.service_radius} autour de Pérouges : {settings.cities.join(", ")}
            </p>
          </div>
          <div>
            <h3 className="font-heading mb-3 text-lg font-semibold">Téléphone</h3>
            <a
              href={`tel:${phoneRaw}`}
              className="text-lg font-semibold text-accent transition hover:text-orange-300"
            >
              {settings.phone}
            </a>
          </div>
        </div>
        <div className="mt-10 border-t border-blue-800 pt-8 text-center text-sm text-white/85">
          © {currentYear} {settings.company}. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
