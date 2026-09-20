import type { ReactNode } from "react";

const BLOCK_LABELS: Record<string, string> = {
  intro: "Introduction",
  problem: "Le problème",
  solution: "Notre approche",
  context: "Contexte",
  cta: "Prochaine étape",
};

/**
 * Markdown léger pour les conseils locaux (## titres + paragraphes).
 * Pas de dépendance externe — évite d’afficher les ## en brut.
 */
export function renderConseilMarkdown(content: string): ReactNode {
  const text = content.replace(/\r\n/g, "\n").trim();
  if (!text) return null;

  const blocks = text.split(/\n{2,}/);
  const nodes: ReactNode[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]!.trim();
    if (!block) continue;

    const h2 = /^##\s+(.+)$/.exec(block);
    if (h2) {
      const title = h2[1]!.trim();
      nodes.push(
        <h2 key={`h2-${i}`} className="mt-8 font-heading text-xl font-semibold text-primary first:mt-0">
          {title}
        </h2>
      );
      continue;
    }

    nodes.push(
      <p key={`p-${i}`} className="mt-3 leading-relaxed text-gray-text first:mt-0 whitespace-pre-wrap">
        {block}
      </p>
    );
  }

  return <div className="conseil-md">{nodes}</div>;
}

/** Contenu `bodyJson` GéoCompta (blocs SEO) ou chaîne brute. */
export function renderPublicSeoContent(content: unknown): ReactNode {
  if (content == null) return null;
  if (typeof content === "string") {
    const t = content.trim();
    if (!t) return null;
    if (/^##\s/m.test(t)) return renderConseilMarkdown(t);
    return <div className="whitespace-pre-wrap text-gray-text">{t}</div>;
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
