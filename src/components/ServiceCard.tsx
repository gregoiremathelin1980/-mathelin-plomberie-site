import Link from "next/link";
import {
  Wrench,
  Droplets,
  Flame,
  Thermometer,
  Gauge,
  Bath,
  LucideIcon,
  ArrowRight,
} from "lucide-react";
import type { ServiceSlug } from "@/lib/services-data";

const ICON_MAP: Record<string, LucideIcon> = {
  Pipe: Wrench,
  Wrench,
  Droplets,
  Flame,
  Thermometer,
  Gauge,
  Bath,
};

interface ServiceCardProps {
  slug: string;
  title: string;
  description?: string;
  iconKey?: string;
  variant?: "default" | "compact";
}

export default function ServiceCard({
  slug,
  title,
  description,
  iconKey = "Wrench",
  variant = "default",
}: ServiceCardProps) {
  const Icon = ICON_MAP[iconKey] ?? Wrench;

  const content = (
    <>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="font-heading text-lg font-semibold text-primary">{title}</h3>
      {description && variant === "default" && (
        <p className="mt-2 text-sm text-gray-text line-clamp-2">{description}</p>
      )}
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-light">
        En savoir plus
        <ArrowRight className="h-4 w-4" />
      </span>
    </>
  );

  return (
    <article className="group h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-primary/20 hover:shadow-md">
      <Link href={`/services/${slug}`} className="block">
        {content}
      </Link>
    </article>
  );
}

export { type ServiceSlug };
