# GéoCompta et agents (Cursor)

## À quoi sert le prompt GéoCompta

Le **prompt GéoCompta** sert à ce que Cursor (ou n’importe quel agent) dans le **dépôt GéoCompta** comprenne tout de suite le cadre : tout ce que le site consomme (contenu, SEO, avis GMB via `/reviews`, homepage, médias, etc.) est **de votre côté GéoCompta**, pas à réinventer dans le site. Ça évite des features hors contrat, des schémas incompatibles avec le Next.js, ou un branchement direct GMB dans le front.

**Règle `.cursor/rules` (dépôt GéoCompta)** : même idée, mais **enregistrée** dans ce dépôt pour que chaque session Cursor la recharge automatiquement — ce n’est **pas obligatoire** si tu colles déjà le prompt quand tu travailles sur GéoCompta. Sur le site Next (ce repo), une règle ciblée existe sous `.cursor/rules/geocompta-integration.mdc`.

---

## Prompt à coller dans Cursor (dépôt GéoCompta)

Tu travailles sur **GéoCompta**, l’application qui **centralise** tout ce qui alimente le **site vitrine Next.js** (Mathelin et futurs sites). Le site **ne doit pas** gérer en direct Google Business Profile, stockage SEO principal, ni exports métier : **tout passe par l’API publique GéoCompta** et les médias sur le domaine média dédié.

### Rôle de GéoCompta

- **Contenu** : conseils, réalisations, pages SEO (`/p/[slug]`), pages locales, dépannage, marques, etc.
- **SEO** : titres, meta, slugs stables, contenus, liens internes ; en cas de changement d’URL, prévoir **301** ou contrat de redirection côté API / doc pour le site.
- **Médias** : URLs **HTTPS absolues** stables (ex. `https://media.geocompta.fr/...`), jamais de chemins NAS opaques pour le navigateur.
- **Avis** : synchronisation depuis **Google Business Profile (GMB)** ; le site lit **`GET /api/public/reviews`** avec une **liste complète** d’avis (note, texte, auteur ou nom, date). Les avis doivent exister en base (ex. **GoogleReview** importés ou saisis, statut **≠ ARCHIVE**), sinon l’API ne peut rien renvoyer de Google. Le site fait tourner un sous-ensemble côté cache / ISR ; le pool doit être **à jour** selon la fréquence de sync GMB.
- **Accueil agrégé** : **`GET /api/public/homepage`** avec au minimum : `featuredRealisations`, `featuredAdvice`, `featuredReviews`, `featuredInterventions`, `featuredPhotos` (tableaux JSON, schéma stable). Les `featuredReviews` peuvent être un sous-ensemble ; **`/reviews`** reste la source **complète** pour la rotation.
- **Cohérence** : mêmes identifiants (slugs), mêmes champs que ceux validés côté site (Zod dans `geocomptaSchemas.ts`). Toute évolution de schéma = **versionnement** ou coordination explicite avec le dépôt site.

### API publique (routes attendues par le site)

- `GET /api/public/homepage`
- `GET /api/public/reviews` — liste complète des avis (GMB), format tableau ou `{ "reviews": [ ... ] }`
- `GET /api/public/realisations`, `GET /api/public/realisations/{slug}`
- `GET /api/public/conseils/{slug}`
- `GET /api/public/pages/{slug}` — pages SEO servies en `/p/{slug}` côté site
- `GET /api/public/local-pages`, `GET /api/public/brands`, `GET /api/public/interventions`, `GET /api/public/sitemap` selon périmètre produit

Auth : header **`Authorization: Bearer …`** si `GEOCOMPTA_PUBLIC_API_KEY` est activé ; aligner avec `GEOCOMPTA_API_KEY` côté site.

### Règles de travail (code GéoCompta)

- Endpoints **publics** : pas de données sensibles ; uniquement contenu et métadonnées destinés au site.
- **Timeouts / erreurs** : réponses claires (HTTP + corps court) ; le site met en cache et a des fallbacks partiels.
- Documenter les **exemples JSON** par endpoint dans la doc interne GéoCompta quand un contrat est figé.
- Quand tu ajoutes un champ consommé par le site, **mettre à jour** la doc d’intégration partagée (`docs/GEOCOMPTA-API.md` côté site) pour que `geocomptaSchemas.ts` reste aligné.

### Ce que tu ne fais pas dans ce projet

- Ne pas pousser la logique « site-only » (canonical, sitemap XML détaillé, layout) dans GéoCompta sans besoin : le site garde la couche présentation ; GéoCompta fournit **données et médias** et, si besoin, **chemins / métas SEO** pour génération côté site.

---

## Règle Cursor dans le dépôt GéoCompta (optionnel)

1. Créer le dossier `.cursor/rules/` à la racine du repo GéoCompta.
2. Ajouter un fichier `geocompta-hub.mdc` (nom au choix) avec un **frontmatter** du type :

```yaml
---
description: GéoCompta — hub API pour sites vitrines (contenu, SEO, GMB, médias)
alwaysApply: true
---
```

3. Sous le frontmatter, coller une **version condensée** du prompt ci-dessus (ou le prompt entier si tu préfères un seul bloc).

Référence format : documentation Cursor sur les **Project Rules** (`.mdc`, `description`, `globs`, `alwaysApply`).

---

## Liens utiles (site Next, ce monorepo)

- Contrat d’intégration technique : **`docs/GEOCOMPTA-API.md`**
- Client et schémas : `src/lib/api/geocomptaClient.ts`, `src/lib/api/geocomptaSchemas.ts`, `src/lib/api/geocomptaCached.ts`
