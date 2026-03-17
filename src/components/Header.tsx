"use client";

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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          {settings.owner_name && (
            <p className="text-sm font-medium text-gray-600">{settings.owner_name}</p>
          )}
          <Link
            href="/"
            className="font-heading text-xl font-bold text-primary sm:text-2xl"
          >
            {settings.company}
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
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
            className="ml-2 flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Phone className="h-4 w-4" />
            Appeler
          </a>
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-primary md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
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
        </div>
      )}
    </header>
  );
}
