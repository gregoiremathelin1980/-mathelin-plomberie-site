import type { ReactNode } from "react";

const BLOCK_LABELS: Record<string, string> = {
  intro: "Introduction",
  problem: "Le problème",
  solution: "Notre approche",
  context: "Contexte",
  cta: "Prochaine étape",
};

/** Contenu `bodyJson` GéoCompta (blocs SEO) ou chaîne brute. */
export function renderPublicSeoContent(content: unknown): ReactNode {
  if (content == null) return null;
  if (typeof content === "string") {
    const t = content.trim();
    return t ? <div className="whitespace-pre-wrap text-gray-text">{t}</div> : null;
  }
  if (typeof content !== "object" || Array.isArray(content)) return null;
  const o = content as Record<string, unknown>;
  const keys = ["intro", "problem", "solution", "context", "cta"] as const;
  const parts: ReactNode[] = [];
  for (const k of keys) {
    const v = o[k];
    if (typeof v !== "string" || !v.trim()) continue;
    parts.push(
      <section key={k} className="mt-8 first:mt-0">
        <h2 className="font-heading text-xl font-semibold text-primary">{BLOCK_LABELS[k] ?? k}</h2>
        <div className="mt-3 whitespace-pre-wrap text-gray-text">{v.trim()}</div>
      </section>
    );
  }
  if (parts.length === 0) return null;
  return <>{parts}</>;
}
