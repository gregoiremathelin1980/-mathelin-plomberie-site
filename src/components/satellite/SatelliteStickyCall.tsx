"use client";

/**
 * Bouton d’appel fixe en bas d’écran sur mobile uniquement (satellites).
 */
export default function SatelliteStickyCall({
  phoneLabel,
  telHref,
}: {
  phoneLabel: string;
  telHref: string;
}) {
  return (
    <a
      href={telHref}
      className="fixed bottom-0 left-0 right-0 z-[60] flex items-center justify-center gap-2 bg-orange-500 py-3.5 text-center text-base font-semibold text-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] md:hidden"
      aria-label={`Appeler au ${phoneLabel}`}
    >
      Appeler — {phoneLabel}
    </a>
  );
}
