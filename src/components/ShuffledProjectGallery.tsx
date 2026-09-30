"use client";

import { useEffect, useState } from "react";
import ProjectGallery from "./ProjectGallery";
import type { Realisation } from "./ProjectCard";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Même galerie que ProjectGallery, mais l'ordre est mélangé à chaque chargement de page.
 * Le rendu serveur garde l'ordre d'origine (stable pour le référencement) ; le mélange
 * n'a lieu qu'après l'hydratation, côté navigateur.
 */
export default function ShuffledProjectGallery({
  realisations,
  standalone,
}: {
  realisations: Realisation[];
  standalone?: boolean;
}) {
  const [items, setItems] = useState(realisations);

  useEffect(() => {
    setItems(shuffle(realisations));
  }, [realisations]);

  return <ProjectGallery realisations={items} standalone={standalone} />;
}
