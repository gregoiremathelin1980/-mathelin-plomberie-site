# Analyse : Prompts projet vs code réel

Document d’analyse comparative des différents blocs de prompt fournis, du code actuel et des écarts.  
**Objectif :** un seul cahier des charges (CDC) et une Definition of Done (DOD) sans doublons, puis corrections ciblées.

---

## 1. Doublons et incohérences entre les prompts

### 1.1 Contenu répété (à fusionner dans le CDC)

- **Rôle du site** : « Afficher le contenu exporté par GéoCompta », « pas d’intelligence SEO côté site », « site passif » — présent dans tous les blocs.
- **Source de données** : `site-data/` — idem.
- **Déploiement** : Vercel, build `npm run build` — idem.
- **Admin** : téléphone, email, zone, message urgence — idem (un prompt ajoute « stored in JSON »).
- **Images NAS** : `photos.mathelin-plomberie.fr`, `next.config.js` `remotePatterns` — idem.
- **Estimateur** : `pricing.json` + `simulateur.json`, notice indicative sous l’estimateur — idem.
- **Avis Google** : rotation aléatoire — idem.
- **Interventions récentes** : `recent-interventions.json`, affichage type « Intervention récente à Meximieux, Débouchage évier, Mars 2026 » — idem.

### 1.2 Contradictions ou écarts entre prompts

| Sujet | Prompt A / B | Prompt « Structure cible » (3e bloc) | Code actuel |
|--------|---------------|----------------------------------------|-------------|
| Structure site-data | `realisations/`, `depannage/`, `conseils/`, `pricing.json`, `simulateur.json`, `recent-interventions.json` | `site-data/services/`, `site-data/zones/`, `site-data/chantiers/` | Réel = premier (realisations, depannage, conseils). **La structure « zones / chantiers / services » n’existe pas.** |
| Routes | `/realisations/[slug]`, `/depannage/[slug]`, `/conseils/[slug]`, `/services/[slug]` | `/services`, `/zones` (ex. zones/meximieux) | Réel = premier. Pas de routes `/zones/[slug]`. |
| Contenu éditorial | `content/` = contenu manuel | — | Réel = `content/` utilisé (realisations, blog, conseils, services JSON, settings). |
| Scripts build | — | `scripts/generateSitemap.ts` (séparé), `scripts/validateContent.ts` | Réel = sitemap dans `src/app/sitemap.ts` (Next natif). Pas de `validateContent` ni `generateSitemap` en script. |
| Fichiers à créer (Steps) | — | `contentLoader.ts`, `internalLinking.ts`, `slugRegistry.ts`, `seo/metaBuilder.ts`, `seo/jsonld.ts`, `siteDataValidator.ts` | **Aucun de ces fichiers n’existe.** Métadonnées et JSON-LD sont dans les pages et composants (LocalBusinessSchema, ServiceSchema, FAQSchema, etc.). |

Conclusion : le **3e bloc** (structure cible avec zones/chantiers, scripts externes, contentLoader, etc.) décrit une cible différente ou une évolution non implémentée. Le CDC consolidé doit refléter **l’existant + les améliorations non destructives** et ne pas imposer la structure « zones / chantiers » ni les scripts séparés s’ils ne sont pas requis.

---

## 2. Comparaison code réel vs exigences des prompts

### 2.1 Ce qui est en place et conforme

- **Next.js 14** (App Router), TypeScript, Tailwind, shadcn/ui, Lucide.
- **Port dev** 3001, scripts `dev` / `build` / `start` / `lint` / `fetch-advice-images`.
- **next.config.js** : `remotePatterns` pour `photos.mathelin-plomberie.fr` + redirections `/estimate` → `/devis`, `/projects` → `/realisations`.
- **Routes** : `/`, `/services`, `/services/[slug]`, `/realisations`, `/realisations/[slug]`, `/conseils`, `/conseils/[slug]`, `/blog`, `/blog/[slug]`, `/depannage`, `/depannage/[slug]`, `/contact`, `/devis`, `/admin`, `/admin/site-settings`.
- **site-data** : lecture `depannage/`, `realisations/`, `conseils/`, `recent-interventions.json`, `reviews.json` / `google-reviews.json`, `simulateur.json`, `pricing.json`, `site-settings.json` ; pas d’appel API GéoCompta.
- **content** : `content/realisations`, `content/conseils`, `content/blog`, `content/services/*.json`, `content/settings/site.json`, `content/prix/prix.json`, `content/villes/villes.json`.
- **Fusion** : réalisations = site-data prioritaire puis content ; conseils = fusion site-data + content ; settings = content + site-data (sauf un champ, voir bug).
- **Images chantiers** : `getPhotoUrl()` (config), affichage conditionnel via `show_chantier_photos` (ProjectCard, RealisationTemplate).
- **Images conseils** : `getAdviceImage.ts` (catégories, 600 px min, fallback plomberie / Unsplash), `RandomConseilImage`, `advice-images.ts`.
- **SEO** : metadata par page, LocalBusinessSchema, ServiceSchema, FAQSchema, ReviewsSchema ; sitemap dans `src/app/sitemap.ts` (services, réalisations, blog, conseils, dépannage, pages statiques).
- **Admin** : layout, guard, login (cookie), page principale, `/admin/site-settings` (téléphone, email, zone, message urgence, showAdviceImages, showChantierPhotos) ; sauvegarde dans `site-data/site-settings.json`.
- **Estimateur** : `EstimateForm`, `estimatePrice.ts`, pricing + simulateur ; pas de vérification explicite de la notice indicative dans le code (à confirmer en UI).
- **Preuve locale** : `HomeRecentInterventions`, `LocalProofBlock`, `LocalActivityBlock`, `recent-interventions.json`.
- **Avis** : `GoogleReviewsBlock`, `getRandomReviews()`.
- **.gitignore** : `.next`, `node_modules`, `.env`, `.env*.local`, `.vercel`. Manque `.env.*` (tous .env) et `.cache` si utilisé.

### 2.2 Écarts et bugs identifiés

1. **Bug : `show_chantier_photos` non pris en compte depuis site-data**  
   Dans `src/lib/content.ts`, `getSiteSettings()` fusionne `fromSiteData` (telephone, email, zone, messageUrgence, showAdviceImages) mais **pas `showChantierPhotos`**. Donc le réglage « Afficher photos chantiers » coché/décoché dans `/admin/site-settings` n’est pas reflété dans `getSiteSettings().show_chantier_photos`.  
   **Correction :** ajouter dans la fusion :  
   `show_chantier_photos: fromSiteData.showChantierPhotos ?? base.show_chantier_photos`

2. **Pas de `robots.ts`**  
   Les prompts demandent un `robots.txt` (Allow /, Sitemap). En Next.js 14 App Router, on peut avoir `src/app/robots.ts` pour générer dynamiquement. Actuellement seul le metadata `robots: "index, follow"` est dans le layout. Pas de fichier dédié robots.  
   **Recommandation :** ajouter `src/app/robots.ts` qui renvoie les règles + URL du sitemap.

3. **Sitemap : brouillons**  
   Le sitemap utilise `getRealisations()`, `getBlogPosts()`, `getConseils()` qui excluent déjà les brouillons ; `getDepannageSlugs()` ne filtre pas les drafts (les pages dépannage excluent les drafts à la lecture). Vérifier si les slugs dépannage doivent exclure les drafts (actuellement les fichiers draft sont lus mais la page retourne null pour un draft). Cohérent si on ne génère pas de route pour un slug draft.

4. **.gitignore**  
   Un prompt demande `.env.*` et `.cache`. Actuellement : `.env*.local` et `.env`. Ajouter `.env.*` et `.cache` renforce la sécurité et évite de committer d’autres variantes d’env.

5. **next.config.js**  
   Un prompt suggère `reactStrictMode: true`, `poweredByHeader: false`, `compress: true`. À l’heure actuelle seul `redirects` et `images.remotePatterns` sont présents. Amélioration possible sans casser le comportement.

### 2.3 Demandes des prompts non implémentées (et à traiter ou non)

- **contentLoader.ts** : chargement markdown avec validation/sanitization — pas en place ; le parsing est fait dans `content.ts` et `site-data.ts` avec gray-matter. Amélioration possible (validation frontmatter, logs build).
- **internalLinking.ts** : liens internes automatiques (services, villes, articles) — partiellement couvert par les templates (liens conseils, service, réalisations). Moteur dédié = évolution.
- **slugRegistry.ts** : détection doublons de slugs — pas en place.
- **seo/metaBuilder.ts** et **seo/jsonld.ts** centralisés — métadonnées et JSON-LD sont déjà générés dans les pages/composants. Centralisation = refactor optionnel.
- **siteDataValidator.ts** : validation structure de `recent-interventions.json`, `pricing.json`, `simulateur.json` — pas en place ; peut être ajouté en script ou au build.
- **scripts/validateContent.ts** et **scripts/generateSitemap.ts** : le sitemap est déjà dans l’App Router ; un script de validation contenu (frontmatter, slugs, liens) peut être utile en CI.
- **Markdown normalization** : frontmatter unifié (title, description, slug, city, service, problem, date, updatedAt) — partiellement présent (title, city, service, date, draft, etc.). `description` et `updatedAt` pas partout. À aligner si on veut un validateur strict.

---

## 3. Éléments jugés inutiles ou améliorables

### 3.1 À ne pas dupliquer / à simplifier

- **Multiples rappels « NEVER remove existing code »** : une seule règle dans le CDC/DOD suffit (« Évolution non destructive »).
- **Structure « zones / chantiers »** : ne pas l’introduire dans le CDC comme obligation tant que GéoCompta n’exporte pas cette structure ; le code et site-data utilisent realisations/depannage/conseils.
- **GEOCOMPTA_API_URL** dans .env : le README et content/README indiquent que le site ne se connecte pas à GéoCompta ; si aucune route n’utilise cette variable, elle peut être documentée comme « legacy / optionnel » ou retirée du flux principal.

### 3.2 Améliorations recommandées (sans tout casser)

- Corriger la fusion **show_chantier_photos** dans `getSiteSettings()`.
- Ajouter **robots.ts** (Allow /, Sitemap).
- Compléter **.gitignore** (`.env.*`, `.cache`).
- Optionnel : **next.config.js** — `reactStrictMode: true`, `poweredByHeader: false`, `compress: true`.
- Optionnel : script **validateContent** (frontmatter, slugs, doublons) en warning au build ou en CI.
- Laisser les Steps 2–14 (contentLoader, internalLinking, slugRegistry, metaBuilder, jsonld, validateContent, etc.) comme **évolutions possibles** dans le CDC plutôt que comme exigences immédiates, pour éviter un big-bang.

---

## 4. Synthèse

- **Doublons** : plusieurs blocs de prompt répètent le même contexte (GéoCompta, site-data, Vercel, admin, images NAS, estimateur, avis, interventions récentes). Le CDC unique doit condenser tout ça.
- **Incohérence majeure** : la « structure cible » avec `site-data/services`, `site-data/zones`, `site-data/chantiers` et routes `/zones` n’existe pas et n’est pas utilisée ; le CDC doit s’aligner sur la structure réelle (realisations, depannage, conseils, etc.).
- **Bug à corriger** : `show_chantier_photos` non fusionné depuis site-data dans `getSiteSettings()`.
- **Petits manques** : robots.ts, .gitignore (.env.*, .cache), éventuellement options next.config.
- **Évolutions possibles** : validation markdown, registre de slugs, validateur site-data, moteur de liens internes, centralisation SEO — à inscrire au CDC comme améliorations futures, pas comme prérequis au « done » actuel.

La suite : **CDC** et **DOD** dans des fichiers dédiés, puis correction du bug de fusion `show_chantier_photos`.
