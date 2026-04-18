# Prompt agent Cursor — site vitrine Next.js ↔ GéoComptaAE

À coller dans une règle Cursor (`.cursor/rules/*.mdc`, `alwaysApply` ou globs ciblés) ou en **premier message** d’une session sur **ce dépôt** (site Mathelin / vitrine).

---

## Contrôle d’alignement (résumé)

| Exigence | Statut côté site |
|----------|-------------------|
| Données dynamiques via `GET /api/public/*` uniquement si `GEOCOMPTA_API_BASE_URL` défini | `geocomptaClient.ts` + `geocomptaCached.ts` |
| Pas d’avis démo / hardcodés en mode API | `page.tsx` (branche GEO) + suppression du JSON fictif ; `GoogleReviewsBlock` + `geocomptaApiMode` → « Aucun avis pour le moment » |
| Repli fichier avis **uniquement** sans API | `getRandomReviews` seulement si **pas** GEO (`page.tsx` non-GEO) ; `site-data/README.md` |
| Bearer sur toutes les requêtes si clé | `getAuthHeaders()` dans `geocomptaGetJson` |
| `.env.example` sans secrets | Racine du repo |
| Doc Vercel / variables | `docs/VERCEL-DEPLOY.md`, `README.md` |
| Contrat détaillé GéoComptaAE (autre dépôt) | `docs/GEOCOMPTA-API.md` + dépôt GéoComptaAE (`docs/GEOCOMPTA-API.md`, `PROMPT_AGENT_VITRINE_API_GEOCOMPTA.md`, `FINALISATION_VITRINE_API.md`, `DEPLOIEMENT_VERCEL_SITE_VITRINE.md`) |

---

## Prompt (texte canon)

Tu travailles dans le dépôt du site vitrine Next.js (ex. Mathelin Plomberie — www.mathelin-plomberie.fr).

**Objectif**

- Consommer exclusivement l’API publique read-only GéoComptaAE pour les données dynamiques (accueil, avis, réalisations, conseils, pages SEO, sitemap, etc.).
- Ne pas appeler Google Business Profile ni dupliquer la logique SEO/avis métier : la source de vérité est le serveur GéoComptaAE.

**Contrat API (à respecter strictement)**

- Lire et t’aligner sur le contrat décrit dans le dépôt GéoComptaAE : fichier `docs/GEOCOMPTA-API.md` (routes `GET /api/public/*`, formes JSON, champs homepage : `featuredRealisations`, `featuredAdvice`, `featuredReviews`, `featuredInterventions`, `featuredPhotos`).
- Cadre produit GéoCompta vs site : `docs/PROMPT_AGENT_VITRINE_API_GEOCOMPTA.md` et `docs/FINALISATION_VITRINE_API.md` (**dépôt GéoComptaAE**).
- Schémas Zod côté site : `geocomptaSchemas.ts` (ou équivalent) — toute évolution de champ = mise à jour Zod + affichage + doc.

**Variables d’environnement (Vercel / local)**

- `GEOCOMPTA_API_BASE_URL` : URL HTTPS du serveur GéoComptaAE, **SANS** slash final. Ex. `https://…` (Tailscale Funnel / domaine public joignable par Vercel).
- `GEOCOMPTA_API_KEY` : si GéoCompta définit `GEOCOMPTA_PUBLIC_API_KEY`, envoyer `Authorization: Bearer <même valeur>` sur **toutes** les requêtes `GET /api/public/*`.
- `GEOCOMPTA_IMAGE_HOSTS` : hôtes autorisés pour `next/image` (liste séparée par virgules, sans `https://`), alignés sur les URLs absolues renvoyées par l’API (photos, cover, etc.).
- Optionnel : caches ISR / revalidate alignés sur la rotation des avis (voir `GEOCOMPTA-API.md` côté site ; `GEOCOMPTA_PUBLIC_REVIEW_ROTATION_SLOT_MINUTES` côté serveur GéoComptaAE si documenté).

**Implémentation attendue**

- Accueil : `fetch` `GET {GEOCOMPTA_API_BASE_URL}/api/public/homepage` avec timeout, gestion 401/404/500.
- Avis : ne **PAS** afficher d’avis « démo » ou hardcodés si l’API est configurée. Si `featuredReviews` (homepage) ou `GET /api/public/reviews` renvoie une liste vide, afficher un état vide sobre (« Aucun avis pour le moment ») ou masquer le bloc selon `site.json` — mais **jamais** de faux avis quand l’API est joignable.
- Si l’API est indisponible : repli documenté uniquement (fichiers `site-data` / `reviews.json`) **sans inventer** de contenu ; log côté serveur/build si pertinent.
- Images : utiliser les URLs absolues de l’API + `remotePatterns` / `GEOCOMPTA_IMAGE_HOSTS`.

**Règles de code**

- TypeScript strict, composants clairs, pas de logique métier dupliquée depuis GéoCompta.
- Ne pas commiter de secrets ; `.env.example` à jour avec les noms de variables ci-dessus.
- Après modification : build Next.js OK, pas d’erreurs de typage sur les schémas Zod.

**Livrables possibles (selon la demande utilisateur)**

- Brancher ou corriger le client API (fetch + cache), section Avis clients, homepage, sitemap, `/p/[slug]`, `/conseils/[slug]`, `/realisations`.
- Supprimer ou conditionner tout fallback « avis fictifs » pour n’afficher que les données API ou le repli fichier explicite.
- Documenter dans README du site vitrine : variables Vercel, URL GéoCompta, comportement si liste vide.

**Références déploiement Vercel** (noms de variables, Bearer) : dépôt GéoComptaAE `docs/DEPLOIEMENT_VERCEL_SITE_VITRINE.md` ; côté site : `docs/VERCEL-DEPLOY.md`.

**Ordre de travail suggéré**

1. Lire les fichiers du site qui touchent aux avis et à l’accueil (`page.tsx`, `GoogleReviewsBlock.tsx`, `lib/api/geocompta*.ts`, `.env.example`).
2. Proposer un plan court.
3. Implémenter sans élargir le périmètre.
