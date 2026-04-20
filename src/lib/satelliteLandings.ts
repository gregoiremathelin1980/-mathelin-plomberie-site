import fs from "node:fs";
import path from "node:path";
import type { SiteSettings } from "@/lib/content";

export interface SatelliteTestimonial {
  firstName: string;
  rating: number;
  text: string;
}

export interface SatelliteAggregateRating {
  ratingValue: number;
  reviewCount: number;
}

export interface SatelliteLandingsFile {
  googleAggregateRating: SatelliteAggregateRating;
  areaServed_meximieux: string[];
  areaServed_amberieu: string[];
  testimonials_meximieux: SatelliteTestimonial[];
  testimonials_amberieu: SatelliteTestimonial[];
}

const DEFAULT_AGGREGATE: SatelliteAggregateRating = { ratingValue: 5, reviewCount: 12 };

function defaultFile(): SatelliteLandingsFile {
  return {
    googleAggregateRating: DEFAULT_AGGREGATE,
    areaServed_meximieux: ["Meximieux", "Pérouges", "Villieu-Loyes-Mollon"],
    areaServed_amberieu: ["Ambérieu-en-Bugey", "Lagnieu", "Saint-Vulbas"],
    testimonials_meximieux: [],
    testimonials_amberieu: [],
  };
}

let cache: SatelliteLandingsFile | null = null;

export function getSatelliteLandingsData(): SatelliteLandingsFile {
  if (cache) return cache;
  const filePath = path.join(process.cwd(), "content", "settings", "satellite-landings.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as SatelliteLandingsFile;
    cache = {
      googleAggregateRating: parsed.googleAggregateRating ?? DEFAULT_AGGREGATE,
      areaServed_meximieux: Array.isArray(parsed.areaServed_meximieux) ? parsed.areaServed_meximieux : defaultFile().areaServed_meximieux,
      areaServed_amberieu: Array.isArray(parsed.areaServed_amberieu) ? parsed.areaServed_amberieu : defaultFile().areaServed_amberieu,
      testimonials_meximieux: Array.isArray(parsed.testimonials_meximieux) ? parsed.testimonials_meximieux : [],
      testimonials_amberieu: Array.isArray(parsed.testimonials_amberieu) ? parsed.testimonials_amberieu : [],
    };
    return cache;
  } catch {
    cache = defaultFile();
    return cache;
  }
}

/** Téléphone international pour schema.org (+33…). */
export function phoneToInternationalSchema(phone: string): string {
  const raw = phone.replace(/\s/g, "");
  if (raw.startsWith("+")) return raw;
  if (raw.startsWith("0")) return `+33${raw.slice(1)}`;
  return `+33${raw}`;
}

/** href tel: sans espaces */
export function phoneToTelHref(phone: string): string {
  const raw = phone.replace(/\s/g, "");
  if (raw.startsWith("0")) return `tel:+33${raw.slice(1)}`;
  if (raw.startsWith("+")) return `tel:${raw}`;
  return `tel:${raw}`;
}

export function getGmbSameAsUrl(settings: SiteSettings): string | undefined {
  const u = settings.googleReviewsUrl?.trim();
  if (u) return u;
  const env = process.env.NEXT_PUBLIC_GMB_REVIEWS_URL?.trim();
  return env || undefined;
}

/** Découpe « rue, CP Ville, Pays » pour PostalAddress schema. */
export function postalAddressParts(fullAddress: string): {
  streetAddress: string;
  postalCode: string;
  addressLocality: string;
  addressCountry: string;
} {
  const parts = fullAddress.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 3) {
    const country = parts[parts.length - 1]!;
    const cityZip = parts[parts.length - 2]!;
    const street = parts.slice(0, -2).join(", ");
    const m = cityZip.match(/^(\d{5})\s+(.+)$/);
    return {
      streetAddress: street,
      postalCode: m?.[1] ?? "01800",
      addressLocality: m?.[2] ?? "Pérouges",
      addressCountry: /^france$/i.test(country) ? "FR" : country.slice(0, 2).toUpperCase(),
    };
  }
  return {
    streetAddress: fullAddress,
    postalCode: "01800",
    addressLocality: "Pérouges",
    addressCountry: "FR",
  };
}
