"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, FileText, Zap, User, FileCheck } from "lucide-react";
import { usePhoneRaw } from "@/contexts/SettingsContext";

const TRUST_ITEMS = [
  { icon: User, label: "Artisan local" },
  { icon: Zap, label: "Intervention rapide" },
  { icon: FileCheck, label: "Devis gratuit" },
];

const HERO_PHOTOS = [
  {
    src: "/images/hero-hands-pipes.jpg",
    alt: "Artisan travaillant près d'un radiateur avec une règle",
  },
  {
    src: "/images/hero-boiler-maintenance.jpg",
    alt: "Entretien et réglage d'un système de chauffage",
  },
  {
    src: "/images/hero-radiator-pipe.jpg",
    alt: "Installation de tuyauterie sur radiateur",
  },
];

export default function Hero() {
  const phoneRaw = usePhoneRaw();

  return (
    <section className="relative overflow-hidden bg-[#fafcfe]">
      {/* Filigrane très discret */}
      <Image
        src="/images/hero-plombier.webp"
        alt=""
        fill
        className="object-cover opacity-[0.05] mix-blend-luminosity"
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-20">
        {/* Left — text & CTAs */}
        <div className="text-center lg:text-left">
          <h1 className="font-heading text-3xl font-bold leading-tight text-slate-700 sm:text-4xl md:text-5xl">
            Maître Artisan Plombier Chauffagiste à Pérouges
          </h1>
          <p className="mt-4 max-w-lg text-base text-gray-text sm:text-lg lg:mx-0 mx-auto">
            Urgence plomberie &amp; chauffage — Plaine de l&apos;Ain &amp;
            Bugey.
            <br />
            <span className="text-sm text-gray-text/80">
              Dépannage • Chauffe-eau • Radiateurs • Débouchage
            </span>
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href={`tel:${phoneRaw}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:bg-accent sm:w-auto sm:min-w-[220px]"
            >
              <Phone className="h-5 w-5" />
              Appeler maintenant
            </a>
            <Link
              href="/devis"
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary/40 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-primary hover:bg-primary/5 sm:w-auto"
            >
              <FileText className="h-5 w-5" />
              Demander un devis
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-10 lg:justify-start">
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-gray-text">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-medium text-slate-700">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — photo mosaic */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* large photo on the left */}
          <div className="relative col-span-1 row-span-2 overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={HERO_PHOTOS[0].src}
              alt={HERO_PHOTOS[0].alt}
              fill
              className="object-cover"
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>
          {/* two stacked photos on the right */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={HERO_PHOTOS[1].src}
              alt={HERO_PHOTOS[1].alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={HERO_PHOTOS[2].src}
              alt={HERO_PHOTOS[2].alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
