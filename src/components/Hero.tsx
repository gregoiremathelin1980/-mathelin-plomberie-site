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

const HERO_SERVICES = "Dépannage plomberie • Chauffe-eau • Radiateurs • Débouchage";

export default function Hero() {
  const phoneRaw = usePhoneRaw();

  return (
    <section className="relative min-h-[420px] overflow-hidden bg-primary sm:min-h-[500px]">
      <Image
        src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1920&q=75"
        alt=""
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-primary/85" />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-14 text-center text-white sm:py-20">
        <h1 className="font-heading text-3xl font-bold leading-tight drop-shadow sm:text-4xl md:text-5xl">
          Plombier chauffagiste à Pérouges
        </h1>
        <p className="mt-3 max-w-xl text-base text-white/95 sm:text-lg">
          Urgence plomberie &amp; chauffage — Plaine de l&apos;Ain &amp; Bugey.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={`tel:${phoneRaw}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white shadow-lg ring-2 ring-white/30 transition hover:bg-orange-600 sm:w-auto sm:min-w-[220px]"
          >
            <Phone className="h-5 w-5" />
            Appeler maintenant
          </a>
          <Link
            href="/devis"
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white bg-white/10 px-6 py-3 text-base font-semibold backdrop-blur sm:w-auto hover:bg-white/20"
          >
            <FileText className="h-5 w-5" />
            Demander un devis
          </Link>
        </div>
        <p className="mt-8 text-sm text-white/85 sm:text-base">{HERO_SERVICES}</p>
        <ul className="mt-8 flex flex-wrap justify-center gap-8 sm:mt-10 sm:gap-12">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-white/95">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Icon className="h-5 w-5" />
              </span>
              <span className="font-medium text-white">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
