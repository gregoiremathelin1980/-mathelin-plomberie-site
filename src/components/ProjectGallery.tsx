import ProjectCard from "./ProjectCard";
import type { Realisation } from "./ProjectCard";

interface ProjectGalleryProps {
  realisations: Realisation[];
  /** When true, only the grid is rendered (for dedicated /projects page). */
  standalone?: boolean;
}

export default function ProjectGallery({ realisations, standalone }: ProjectGalleryProps) {
  if (!realisations?.length) {
    return (
      <section id="realisations" className={standalone ? "" : "bg-white px-4 py-16 sm:px-6"}>
        <div className={standalone ? "" : "mx-auto max-w-6xl"}>
          {!standalone && (
            <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
              Réalisations récentes
            </h2>
          )}
          <p className={standalone ? "mt-0 text-gray-text" : "mt-4 text-gray-text"}>
            Aucune réalisation à afficher pour le moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="realisations" className={standalone ? "" : "bg-white px-4 py-16 sm:px-6"}>
      <div className={standalone ? "" : "mx-auto max-w-6xl"}>
        {!standalone && (
          <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
            Réalisations récentes
          </h2>
        )}
        <div className={standalone ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
          {realisations.map((r) => (
            <ProjectCard key={r.id} project={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
