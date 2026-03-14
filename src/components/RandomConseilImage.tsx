"use client";

import Image from "next/image";
import { useMemo } from "react";

interface RandomConseilImageProps {
  /** List of image URLs (conseils first, then stock). One is picked randomly on mount. */
  imageCandidates: string[];
  /** Fallback URL when imageCandidates is empty (e.g. Unsplash). */
  fallbackUrl?: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
}

/**
 * Picks one random image from candidates for each mount (different image on each page load).
 * SEO: alt and descriptive usage required.
 */
export default function RandomConseilImage({
  imageCandidates,
  fallbackUrl,
  alt,
  fill = true,
  className = "object-cover",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: RandomConseilImageProps) {
  const src = useMemo(() => {
    if (imageCandidates.length > 0) {
      return imageCandidates[Math.floor(Math.random() * imageCandidates.length)];
    }
    return fallbackUrl ?? "";
  }, [imageCandidates, fallbackUrl]);

  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
    />
  );
}
