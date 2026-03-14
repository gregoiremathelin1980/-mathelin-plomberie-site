# Prompt de reprise – Site Mathelin Plomberie Chauffage

Copie ce bloc dans une **nouvelle conversation** Cursor pour reprendre le projet avec le bon contexte.

---

## Contexte projet

Site vitrine **Mathelin Plomberie Chauffage**, plombier chauffagiste (Pérouges, Meximieux, Ambérieu-en-Bugey, Lagnieu).  
Stack : **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **Lucide React**.  
Dev : `npm run dev` (port **3001**). Build : `npm run build` / `npm start`. Déploiement type **Vercel**.

**Règle importante :** répondre en **français**.

---

## Racine du projet

- **`package.json`** — Scripts : `dev`, `build`, `start`, `lint`, `fetch-advice-images`.
- **`next.config.js`** — Config Next (dont `images.remotePatterns` pour le domaine NAS des photos).
- **`.env` / `.env.example`** — Variables : `ADMIN_PASSWORD`, `SITE_DATA_DIR`, `GEOCOMPTA_API_URL`, `PHOTO_BASE_URL`, `PEXELS_API_KEY`.
- **`README.md`** — Présentation du site et du setup.
- **`content/README.md`** — Format du contenu (realisations, conseils, blog, services) et workflow GéoCompta.
- **`SETUP-STEPS.md`** — Checklist de mise en place (si présent).

---

## Dossiers et rôles

### `src/`

- **`src/app/`** — Pages et routes App Router.
  - **`page.tsx`** — Page d’accueil (réalisations, conseils, services, avis, CTA).
  - **`layout.tsx`** — Layout global, métadonnées SEO, `SettingsProvider` avec `getSiteSettings()`.
  - **`globals.css`** — Styles globaux et variables Tailwind.
  - **`services/page.tsx`** — Liste des 12 services (grille 3×4).
  - **`services/[slug]/page.tsx`** — Page détail d’un service (contenu depuis `content/services/*.json` ou `SERVICES`).
  - **`realisations/page.tsx`** — Liste réalisations (fusion site-data + content).
  - **`realisations/[slug]/page.tsx`** — Détail réalisation (images NAS, réglage « Afficher photos chantiers »).
  - **`conseils/page.tsx`**, **`conseils/[slug]/page.tsx`** — Liste et détail conseils.
  - **`blog/page.tsx`**, **`blog/[slug]/page.tsx`** — Blog.
  - **`depannage/page.tsx`**, **`depannage/[slug]/page.tsx`** — Pages dépannage (données site-data).
  - **`contact/page.tsx`**, **`devis/page.tsx`** — Contact et devis/estimateur.
  - **`admin/`** — Zone admin (layout, guard, page principale, **`site-settings/page.tsx`** pour réglages).
  - **`api/admin/`** — API admin (login, settings, site-settings, drafts, publish).
  - **`api/realisations/route.ts`**, **`api/posts/route.ts`** — APIs lecture (si utilisées).
  - **`sitemap.ts`** — Génération du sitemap à partir de `SERVICES`, pages statiques, etc.
- **`src/components/`** — Composants réutilisables.
  - **`Header.tsx`**, **`Footer.tsx`**, **`Hero.tsx`**, **`MobileCallButton.tsx`** — En-tête, pied, bandeau, appel.
  - **`ServiceCard.tsx`** — Carte service (lien `/services/[slug]`, icône via `iconKey` ; **Thermometer** pour radiateurs/chauffage, pas Radiation).
  - **`ProjectCard.tsx`**, **`ProjectGallery.tsx`** — Cartes et grille réalisations (respect du réglage « Afficher photos chantiers », images via `getPhotoUrl`).
  - **`BlogCard.tsx`**, **`BlogList.tsx`**, **`AdvicePreview.tsx`**, **`ConseilsList.tsx`** — Blog et conseils.
  - **`EstimateForm.tsx`** — Formulaire d’estimation (types de problèmes, fourchettes de prix).
  - **`ContactForm.tsx`** — Formulaire de contact.
  - **`UrgencyBlock.tsx`**, **`HomeRecentInterventions.tsx`**, **`LocalProofBlock.tsx`**, **`LocalActivityBlock.tsx`** — Blocs preuve locale / urgence.
  - **`GoogleReviewsBlock.tsx`**, **`ReviewsSchema.tsx`** — Avis et schéma SEO.
  - **`LocalBusinessSchema.tsx`**, **`ServiceSchema.tsx`**, **`FAQSchema.tsx`** — Données structurées.
  - **`RandomConseilImage.tsx`** — Image conseil (Pexels / fallback).
  - **`ui/`** — Composants shadcn (button, card, input, label, textarea, form, dialog).
- **`src/templates/`** — Mise en page des types de contenu.
  - **`RealisationTemplate.tsx`** — Page réalisation (images, conseils liés, CTA ; prop **`showChantierPhotos`**).
  - **`ServiceTemplate.tsx`** — Page service (problèmes, intervention, prix, réalisations, conseils, FAQ).
  - **`DepannageTemplate.tsx`** — Page dépannage (contenu, réalisations liées).
  - **`ArticleTemplate.tsx`** — Article (blog/conseil) avec image.
- **`src/contexts/SettingsContext.tsx`** — Contexte des réglages du site (`useSettings()`, `show_advice_images`, **`show_chantier_photos`**).
- **`src/lib/`** — Logique métier et données.
  - **`config.ts`** — Constantes : `SITE_PHONE`, `SITE_URL`, **`PHOTO_BASE_URL`**, **`getPhotoUrl(pathOrUrl)`** (URLs NAS ou chemins relatifs), adresse, villes.
  - **`services-data.ts`** — **`SERVICES`** (12 services : slugs, titres, descriptions, icônes). Type **`ServiceSlug`**. Pas d’icône Radiation ; radiateurs/chauffage utilisent **Thermometer**.
  - **`content.ts`** — Lecture **content/** : `getRealisations()`, `getRealisationBySlug()`, `getConseils()`, `getBlogPosts()`, `getServiceContent()`, `getPrix()`, `getVilles()`, **`getSiteSettings()`** (fusion content + site-data), `SiteSettings` (dont **`show_chantier_photos`**), types RealisationItem, BlogItem, ConseilsItem, etc.
  - **`site-data.ts`** — Lecture **site-data/** (exports GéoCompta, pas d’API directe) : `getRealisationsFromSiteData()`, `getRealisationBySlugFromSiteData()`, `getDepannageBySlug()`, `getConseilsFromSiteData()`, `getRecentInterventions()`, `getReviews()`, `getSimulateur()`, **`getSiteDataSettings()`** / **`writeSiteDataSettings()`** (dont **`showChantierPhotos`**), `SiteDataSettings`, types réalisation (champ **`image`** en plus de **`images`**).
  - **`estimatePrice.ts`** — Logique fourchettes de prix (estimateur).
  - **`getAdviceImage.ts`** — Résolution d’image pour les conseils (slug / catégorie).
  - **`advice-images.ts`** — Mapping images conseils (Pexels, etc.).
  - **`date.ts`**, **`utils.ts`** — Utilitaires.

### `content/`

Contenu statique (priorité moindre que **site-data** pour réalisations, conseils, pricing quand configuré).

- **`content/settings/site.json`** — Paramètres de base (téléphone, adresse, villes, etc.) ; peut être écrasé par site-data en prod.
- **`content/realisations/*.md`** — Réalisations (frontmatter : title, city, service, date, **image** / **images**, draft).
- **`content/conseils/*.md`** — Conseils (title, category, city, date, excerpt, draft).
- **`content/blog/*.md`** — Articles blog.
- **`content/services/*.json`** — Contenu détail des services (problems, intervention, faq, priceKeys, conseilCategories).
- **`content/villes/villes.json`** — Liste des villes (optionnel).
- **`content/prix/prix.json`** — Fourchettes de prix (fallback si pas de site-data).

### `site-data/`

Exports GéoCompta (aucun appel API). Répertoire par défaut : **`./site-data`** ou **`SITE_DATA_DIR`** (env).

- **`site-data/site-settings.json`** — Réglages (contact, zone, **showAdviceImages**, **showChantierPhotos**). Éditable via **/admin/site-settings**.
- **`site-data/realisations/*.md`** — Réalisations (frontmatter : **image** ou **images**, conseils liés).
- **`site-data/depannage/*.md`** — Pages dépannage.
- **`site-data/conseils/*.md`** — Conseils (fusionnés avec content pour l’affichage).
- **`site-data/recent-interventions.json`** — Interventions récentes (preuve locale).
- **`site-data/reviews.json`** ou **`google-reviews.json`** — Avis clients.
- **`site-data/pricing.json`** — Prix pour l’estimateur.
- **`site-data/simulateur.json`** — Données du simulateur (sélecteur de problème).

### Images et NAS

- Les **photos chantiers** ne sont **pas** stockées sur le site : servies par **`PHOTO_BASE_URL`** (ex. `https://photos.mathelin-plomberie.fr`). Chemins relatifs ou URLs complètes dans les données (realisations) sont résolus via **`getPhotoUrl()`** dans **`src/lib/config.ts`**.
- **next.config.js** : domaine NAS autorisé dans **`images.remotePatterns`**.
- Affichage conditionnel : réglage admin **« Afficher photos chantiers »** (**showChantierPhotos** / **show_chantier_photos**) ; si désactivé, pas d’images dans les cartes réalisations ni dans **RealisationTemplate**.

### Admin

- **/admin** — Page d’accueil admin (brouillons, lien vers site-settings).
- **/admin/site-settings** — Formulaire : contact, zone, message urgence, **« Afficher les images dans les conseils »**, **« Afficher photos chantiers »**. Sauvegarde dans **site-data/site-settings.json**.
- Authentification : cookie après login (API **/api/admin/login**). **ADMIN_PASSWORD** dans `.env`.

### Scripts

- **`scripts/fetch-advice-images.ts`** — Téléchargement d’images conseils (Pexels). Lancer avec : `npm run fetch-advice-images`.

---

## Points d’attention pour les modifications

1. **Services** : la liste des 12 services est dans **`src/lib/services-data.ts`**. Chaque service a un **slug** (ex. `installation-radiateurs`, `desembouage-chauffage`, `installation-plancher-chauffant`). Les pages détail sont **/services/[slug]** ; le sitemap et les liens utilisent ces slugs.
2. **Réalisations** : données fusionnées **site-data** (prioritaire) + **content**. Champs **`image`** (string) et **`images`** (array) ; **`getPhotoUrl()`** pour afficher les images NAS.
3. **Réglages affichage** : **show_chantier_photos** (photos chantiers) et **show_advice_images** (images conseils) viennent de **getSiteSettings()** (fusion content + site-data) et du contexte **SettingsContext** pour les composants client.
4. **Icônes services** : dans **ServiceCard**, **ICON_MAP** utilise **Thermometer** (pas Radiation) pour radiateurs/chauffage ; autres clés : Pipe, Droplets, Flame, Gauge, Bath.

---

## Utilisation

Dans la nouvelle conversation, après avoir collé ce prompt, indique simplement les **corrections ou adaptations** que tu veux (par ex. « modifier la page X », « ajouter un champ Y dans l’admin », « changer le texte Z »). L’assistant s’appuiera sur cette description du projet et des dossiers pour cibler les bons fichiers.
