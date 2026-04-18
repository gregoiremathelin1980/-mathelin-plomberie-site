# Connexion API GéoCompta (Next.js)

## Cadre d’intégration (référence site ↔ GéoCompta ↔ outils)

Ce bloc fige les **attentes communes** pour éviter les incohérences entre le dépôt Next.js, GéoCompta et les agents (ex. Cursor).

### Architecture

- **GéoCompta** expose une **API publique stable** : contenu SEO (titres, slugs, descriptions, villes, corps, dates, marques, etc.) et références vers des **médias**.
- **Médias** (images chantier, etc.) : servis en **HTTPS** depuis un **domaine public dédié** (ex. `https://media.geocompta.fr/...`). Les **URLs d’images restent stables** dans le temps.
- Le **site Next.js** consomme l’API **uniquement côté serveur** (RSC, routes, `fetch` serveur). **Aucune clé API ni secret n’est exposé côté navigateur.**
- **Hébergement du site** (ex. Vercel) : déploiement **séparé** de l’infra GéoCompta ; le cache (ISR / `unstable_cache`) est géré par Next / la plateforme.

### Schéma JSON

- Les endpoints publics fournissent un **schéma stable**. Les champs utilisés pour le SEO et l’affichage ne changent **pas sans versionnement** (ou version d’API dédiée si évolution majeure).
- Côté site : validation **Zod** dans `geocomptaSchemas.ts` — à mettre à jour si le contrat évolue **en coordination** avec GéoCompta.

### Cache (ISR) et disponibilité

- Les **durées de revalidation** peuvent être **adaptées au type de contenu** (ex. pages SEO ~24 h, blocs plus dynamiques plus fréquents si besoin). Les valeurs effectives sont dans le code (`revalidate`, `unstable_cache`).
- En cas d’**indisponibilité temporaire** de l’API : le site peut s’appuyer sur la **dernière version en cache** et/ou **masquer la section concernée** sans rendre toute la page inutilisable. Un **fallback fichiers** (`site-data`) peut compléter selon les pages.

### Slugs et SEO

- Les **slugs** générés par GéoCompta sont **stables**. En cas de **modification d’URL nécessaire**, une **redirection** (ex. 301) doit être prévue **côté GéoCompta ou côté site** pour préserver le référencement.

### Données sensibles

- Dans ce flux **public**, **aucune donnée sensible** n’est transmise au site vitrine. Le périmètre se limite au **contenu public** et aux **médias publics**.

---

## Variables d’environnement

| Variable | Rôle |
|----------|------|
| `GEOCOMPTA_API_BASE_URL` | Origine de l’API, **sans** slash final (ex. `https://api.example.com`). Le client appelle `GET {BASE}/api/public/...`. |
| `GEOCOMPTA_API_KEY` | Optionnel. Envoyé en `Authorization: Bearer …`. Côté GéoComptaAE : définir la même valeur dans `GEOCOMPTA_PUBLIC_API_KEY` si tu actives la protection des routes `/api/public/*`. |
| `GEOCOMPTA_IMAGE_HOSTS` | Hôtes HTTPS autorisés pour `next/image` (ex. `media.geocompta.fr`), séparés par des virgules — **rebuild** après changement. |
| `GEOCOMPTA_HOME_REVALIDATE_SECONDS` | **ISR page `/`** + cache `unstable_cache` pour `GET /api/public/homepage` (défaut **1800** = 30 min, min 60, max 86400). Doit être **≤** au créneau de sync GéoCompta (ex. avis toutes les 30 min) : si la page reste en cache 1 h alors que l’API tourne toutes les 30 min, la **rotation d’avis** ne suivra pas les nouvelles données. |
| `GEOCOMPTA_REVIEWS_CACHE_SECONDS` | Cache Next pour le **pool** `GET /api/public/reviews` (défaut **900** = 15 min, min 60, max 86400). Peut être **≤** à `GEOCOMPTA_HOME_REVALIDATE_SECONDS` pour rafraîchir le pool au moins aussi souvent que la page. |
| `GEOCOMPTA_HOME_REVIEWS_DISPLAY_COUNT` | Nombre d’avis affichés en même temps sur l’accueil (défaut **6**, min 1, max 24). Le sous-ensemble est **mélangé** à chaque régénération de page (rotation parmi tout le pool). |

### Avis Google (GMB) et site vitrine

Google **n’autorise pas** un appel direct simple depuis un site vitrine vers les avis avec une seule clé publique : l’API **Google Business Profile** impose OAuth / compte de service et des droits sur l’établissement.

Le flux retenu ici :

1. **GéoCompta** synchronise les avis depuis GMB (ou équivalent) et les expose sur **`GET /api/public/reviews`** (liste complète, format validé côté Next par `GeocomptaReviewsListSchema`).
2. Le **site Next.js** lit ce endpoint, met en cache le pool (`GEOCOMPTA_REVIEWS_CACHE_SECONDS`), puis affiche jusqu’à **`GEOCOMPTA_HOME_REVIEWS_DISPLAY_COUNT`** avis avec un **mélange déterministe** à chaque régénération **ISR** de `/` (`GEOCOMPTA_HOME_REVALIDATE_SECONDS`).
3. Si `GET /api/public/reviews` est vide, repli sur **`featuredReviews`** du `GET /api/public/homepage`. Si les deux sont vides : **aucun avis fictif** — le bloc affiche un état sobre (« Aucun avis pour le moment ») tant que `showReviews` est activé ; pas de `site-data/*.json` de démo lorsque **`GEOCOMPTA_API_BASE_URL`** est défini.

**Côté GéoComptaAE (données)** : les avis doivent exister en base (ex. **GoogleReview** importés ou saisis, statut **≠ ARCHIVE**). Sinon l’API renvoie des listes vides.

**Référence déploiement** : variables Vercel / Bearer dans le dépôt GéoComptaAE (`docs/DEPLOIEMENT_VERCEL_SITE_VITRINE.md` si présent). Côté site vitrine : **`.env.example`** à la racine — copier vers **`.env.local`** pour le développement.

## Fichiers clés

- `docs/PROMPT_AGENT_SITE_VITRINE_GEOCOMPTAE.md` — **prompt agent Cursor pour ce dépôt** (contrat strict site ↔ GéoComptaAE).
- `docs/GEOCOMPTA-CURSOR.md` — cadrage agents Cursor + **prompt à coller dans le dépôt GéoCompta** (règle `.cursor/rules` optionnelle).
- `docs/VERCEL-DEPLOY.md` — variables d’environnement et checklist **déploiement Vercel**.
- `src/lib/api/geocomptaClient.ts` — client HTTP (timeout 5 s, 2 retries, validation Zod).
- `src/lib/api/geocomptaSchemas.ts` — schémas Zod / types.
- `src/lib/api/geocomptaCached.ts` — `unstable_cache` (ISR) + slugs sitemap / réalisations.
- `src/lib/api/geocomptaHomepageFallback.ts` — fallback **fichiers** si l’API échoue (accueil).

## Endpoints publics (référence)

Les chemins ci-dessous sont relatifs à `GEOCOMPTA_API_BASE_URL`. La liste peut évoluer ; aligner avec la doc produit GéoCompta.

| Méthode | Endpoint | Usage côté site |
|---------|----------|------------------|
| GET | `/api/public/homepage` | Accueil agrégé (`featuredRealisations`, `featuredAdvice`, `featuredReviews`, `featuredInterventions`, `featuredPhotos`, …). |
| GET | `/api/public/realisations` | Liste des réalisations. |
| GET | `/api/public/realisations/{slug}` | Détail réalisation. |
| GET | `/api/public/conseils/{slug}` | Détail conseil. |
| GET | `/api/public/pages/{slug}` | Pages SEO → servies sous **`/p/{slug}`** sur le site. |
| GET | `/api/public/local-pages` | Pages locales (selon contrat GéoCompta). |
| GET | `/api/public/brands` | Données marques (selon contrat GéoCompta). |
| GET | `/api/public/reviews` | Avis (liste ou format convenu). |
| GET | `/api/public/interventions` | Interventions (selon contrat). |
| GET | `/api/public/sitemap` | Chemins ou URLs à inclure (dont `/p/...`). |

> **Images** : URLs absolues sur le domaine média (ex. `media.geocompta.fr`) ; déclarer ce host dans `next.config.js` / `GEOCOMPTA_IMAGE_HOSTS`.

## Comportement implémenté côté Next (rappel)

- **Pas de clé côté navigateur** : uniquement appels serveur Next.js.
- **ISR / cache** : durées configurées dans `geocomptaCached.ts` et `revalidate` des pages (ajuster selon le cadrage ci-dessus).
- **SEO** : `seoTitle` / `seoDescription` possibles depuis l’API ; **canonical** généré côté site (`buildPageMetadata`).

Pour des **exemples JSON** par endpoint, étendre ce document au fur et à mesure que l’API GéoCompta est figée.
