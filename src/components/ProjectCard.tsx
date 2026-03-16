"use client";

import Image from "next/image";
import Link from "next/link";
import { useSettings } from "@/contexts/SettingsContext";
import { getSeoImageAlt } from "@/lib/seoImage";

export interface ProjectCardData {
  id: string;
  slug?: string;
  title: string;
  city?: string;
  image?: string;
  description?: string;
}

export type Realisation = ProjectCardData;

interface ProjectCardProps {
  project: ProjectCardData;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const settings = useSettings();
  const showChantierPhotos = settings?.show_chantier_photos !== false;
  const href = project.slug ? `/realisations/${project.slug}` : undefined;
  const content = (
    <>
      {showChantierPhotos && project.image ? (
        <div className="relative aspect-[4/3] w-full bg-gray-100">
          <Image
            src={project.image}
            alt={getSeoImageAlt(project.title, project.city)}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-gray-100 text-gray-400">
          <span className="text-sm">Photo réalisation</span>
        </div>
      )}
      <div className="p-5">
        <h3 className="font-heading font-semibold text-primary">{project.title}</h3>
        {project.city && (
          <p className="mt-1 text-sm text-gray-text">{project.city}</p>
        )}
        {project.description && (
          <p className="mt-2 text-sm text-gray-text line-clamp-3">
            {project.description}
          </p>
        )}
      </div>
    </>
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      {href ? (
        <Link href={href} className="block">
          {content}
        </Link>
      ) : (
        content
      )}
    </article>
  );
}
