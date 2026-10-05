import { FRANCE_RENOV_URL } from "@/lib/franceRenov";

/**
 * Bandeau d'information France Rénov' fourni par l'Anah (kit « Site Web »), image officielle non modifiée.
 * Charte : en haut de page ou près du texte des travaux, cliquable vers le service public, pleine largeur sur mobile.
 */
export default function FranceRenovBandeau() {
  return (
    <a
      href={FRANCE_RENOV_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full max-w-[700px]"
      aria-label="France Rénov' : le service public vous informe gratuitement pour préparer et sécuriser votre projet"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/france-renov/bandeau-700x150.png"
        srcSet="/images/france-renov/bandeau-700x150.png 700w, /images/france-renov/bandeau-1400x300.png 1400w"
        sizes="(max-width: 700px) 100vw, 700px"
        width={700}
        height={150}
        alt="Avant de vous engager, le service public vous informe gratuitement pour préparer et sécuriser votre projet : france-renov.gouv.fr"
        className="h-auto w-full"
        loading="lazy"
      />
    </a>
  );
}
