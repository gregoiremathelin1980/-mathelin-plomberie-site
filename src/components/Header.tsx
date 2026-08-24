"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { useSettings, usePhoneRaw } from "@/contexts/SettingsContext";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/depannage", label: "Dépannage" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/conseils", label: "Conseils" },
  { href: "/devis", label: "Devis" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const settings = useSettings();
  const phoneRaw = usePhoneRaw();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:px-6 md:justify-between md:py-3.5">
        <div className="w-10 shrink-0 md:hidden" aria-hidden />

        <div className="min-w-0 flex-1 md:flex-none">
          <Link
            href="/"
            className="inline-flex max-w-full items-center justify-center gap-2.5 md:justify-start"
          >
            <Image
              src="/images/logo-maitre-artisan-header.png"
              alt="Maître Artisan"
              width={70}
              height={46}
              className="h-10 w-auto shrink-0 sm:h-11"
              priority
            />
            <span className="min-w-0 text-left">
              {settings.owner_name && (
                <span className="block text-sm font-medium text-gray-600">
                  {settings.owner_name}
                </span>
              )}
              <span className="font-heading block text-lg font-bold leading-tight text-primary sm:text-xl md:text-2xl">
                {settings.company}
              </span>
            </span>
          </Link>
        </div>

        <nav className="hidden shrink-0 items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-text transition hover:bg-primary/5 hover:text-primary"
            >
              {label}
            </Link>
          ))}
          <a
            href={`tel:${phoneRaw}`}
            className="ml-2 flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary"
          >
            <Phone className="h-4 w-4" />
            Appeler
          </a>
        </nav>

        <button
          type="button"
          className="shrink-0 rounded-lg p-2 text-primary md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1 text-center">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg py-3 text-gray-text hover:bg-primary/5 hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex justify-center">
            <a
              href={`tel:${phoneRaw}`}
              className="inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-base font-semibold text-white shadow hover:bg-primary"
              onClick={() => setMobileOpen(false)}
            >
              <Phone className="h-5 w-5" aria-hidden />
              Appeler
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
