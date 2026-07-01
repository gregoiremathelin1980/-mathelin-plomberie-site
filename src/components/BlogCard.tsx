"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDateFR } from "@/lib/date";
import { ADVICE_IMAGE_FALLBACK } from "@/lib/advice-images";
import { useSettings } from "@/contexts/SettingsContext";
import Image from "next/image";

export interface BlogCardData {
  id: string;
  title: string;
  shortDescription?: string;
  excerpt?: string;
  city?: string;
  slug?: string;
  image?: string;
  /** SEO: topic-matching alt for the card image (conseils). */
  imageAlt?: string;
  date?: string;
  category?: string;
}

interface BlogCardProps {
  post: BlogCardData;
  /** Base path for "Lire la suite" link (default: /blog). Use /conseils for advice articles. */
  baseHref?: string;
}

export default function BlogCard({ post, baseHref = "/blog" }: BlogCardProps) {
  const settings = useSettings();
  const excerpt = post.excerpt ?? post.shortDescription;
  const href = post.slug ? `${baseHref}/${post.slug}` : undefined;
  const displayDate = post.date ? formatDateFR(post.date) : undefined;
  const altText = post.imageAlt ?? post.title;
  const isConseils = baseHref === "/conseils";
  const showAdviceImages = settings?.show_advice_images !== false;
  const showConseilImage = isConseils && showAdviceImages && Boolean(post.image?.trim());

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      {showConseilImage ? (
        <div className="relative aspect-video w-full shrink-0 bg-gray-100">
          <Image
            src={post.image!}
            alt={altText}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : !isConseils ? (
        <div className="relative aspect-video w-full shrink-0 bg-gray-100">
          <Image
            src={post.image ?? ADVICE_IMAGE_FALLBACK}
            alt={altText}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading font-semibold text-primary">{post.title}</h3>
        {(displayDate || post.city) && (
          <p className="mt-1 text-sm text-gray-text">
            {[displayDate, post.city].filter(Boolean).join(" · ")}
          </p>
        )}
        {excerpt && (
          <p className="mt-2 flex-1 text-sm text-gray-text line-clamp-3">
            {excerpt}
          </p>
        )}
        {href && (
          <Link
            href={href}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-light hover:underline"
          >
            Lire la suite
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </article>
  );
}
