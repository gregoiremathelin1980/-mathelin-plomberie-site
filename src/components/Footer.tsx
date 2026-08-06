"use client";

import Link from "next/link";
import { useSettings, usePhoneRaw } from "@/contexts/SettingsContext";

const FOOTER_VILLES = [
  { href: "/plombier-meximieux", label: "Plombier Meximieux" },
  { href: "/plombier-amberieu", label: "Plombier Ambérieu" },
  { href: "/zones-intervention", label: "Toutes nos zones" },
];

const FOOTER_URGENCES = [
  { href: "/urgence/fuite-eau-meximieux", label: "Fuite eau Meximieux" },
  { href: "/urgence/fuite-eau-amberieu", label: "Fuite eau Ambérieu" },
  { href: "/urgence/fuite-eau-lagnieu", label: "Fuite eau Lagnieu" },
  { href: "/urgence/wc-bouche-meximieux", label: "WC bouché Meximieux" },
  { href: "/urgence/wc-bouche-amberieu", label: "WC bouché Ambérieu" },
  { href: "/urgence/wc-bouche-lagnieu", label: "WC bouché Lagnieu" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const settings = useSettings();
  const phoneRaw = usePhoneRaw();

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <h3 className="font-heading mb-3 text-lg font-semibold">
              {settings.company}
            </h3>
            <p className="text-sm font-medium text-white">
              Maître Artisan Plombier Chauffagiste (BP Génie Climatique) à votre service depuis 2013.
            </p>
            <p className="mt-3 text-sm text-white/90">
              {settings.address}
            </p>
            <a
              href={`tel:${phoneRaw}`}
              className="mt-3 inline-block text-lg font-semibold text-accent transition hover:text-orange-300"
            >
              {settings.phone}
            </a>
          </div>

          <div>
            <h3 className="font-heading mb-3 text-lg font-semibold">Navigation</h3>
            <ul className="space-y-2 text-sm text-white/90">
              <li><Link href="/services" className="transition hover:text-white">Services</Link></li>
              <li><Link href="/depannage" className="transition hover:text-white">Dépannage</Link></li>
              <li><Link href="/realisations" className="transition hover:text-white">Réalisations</Link></li>
              <li><Link href="/devis" className="transition hover:text-white">Devis gratuit</Link></li>
              <li><Link href="/blog" className="transition hover:text-white">Blog</Link></li>
              <li><Link href="/conseils" className="transition hover:text-white">Conseils</Link></li>
              <li><Link href="/contact" className="transition hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading mb-3 text-lg font-semibold">Villes desservies</h3>
            <ul className="space-y-2 text-sm text-white/90">
              {FOOTER_VILLES.map((v) => (
                <li key={v.href}>
                  <Link href={v.href} className="transition hover:text-white">{v.label}</Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-white/70">
              Pérouges, Lagnieu, Saint-Vulbas, Villieu, Rignieux-le-Franc, Béligneux, Château-Gaillard, Pont-d&apos;Ain
            </p>
          </div>

          <div>
            <h3 className="font-heading mb-3 text-lg font-semibold">Urgences</h3>
            <ul className="space-y-2 text-sm text-white/90">
              {FOOTER_URGENCES.map((u) => (
                <li key={u.href}>
                  <Link href={u.href} className="transition hover:text-white">{u.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading mb-3 text-lg font-semibold">Zone géographique</h3>
            <p className="text-sm text-white/90">
              Rayon {settings.service_radius} autour de Pérouges (01800), département de l&apos;Ain.
              Plaine de l&apos;Ain, Côtière, Bugey.
            </p>
            <p className="mt-3 text-sm text-white/90">
              Intervention rapide 7j/7
            </p>
            <a
              href={`tel:${phoneRaw}`}
              className="mt-2 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-accent/90"
            >
              Appeler {settings.phone}
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-blue-800 pt-8 text-center text-sm text-white/85">
          <p>© {currentYear} {settings.company}. Tous droits réservés.</p>
          <nav
            className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/80"
            aria-label="Informations légales"
          >
            <Link href="/mentions-legales" className="transition hover:text-white">
              Mentions légales
            </Link>
            <Link href="/cgv" className="transition hover:text-white">
              CGV
            </Link>
            <Link href="/mentions-legales#mediation" className="transition hover:text-white">
              Médiation de la consommation (CM2C)
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
