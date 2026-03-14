# Liste intégrale de ce que les prompts demandent de coder

Tout ce que les différents blocs de prompt demandent explicitement d’implémenter ou de mettre en place, regroupé et dédupliqué.  
*(Ne signifie pas que tout est à faire : une partie existe déjà ou est en contradiction avec une autre.)*

---

## 1. Rôle et données

| # | Demande |
|---|--------|
| 1.1 | Afficher les pages SEO générées par GéoCompta |
| 1.2 | Charger les données exportées depuis le dossier **site-data** (fichiers, pas d’API) |
| 1.3 | Générer des routes statiques pour le SEO |
| 1.4 | Ne pas analyser les requêtes Google, ne pas appeler d’API Google, ne pas générer de stratégie SEO (tout ça reste dans GéoCompta) |
| 1.5 | Lire automatiquement les fichiers site-data et générer les pages correspondantes |

---

## 2. Routes et types de pages

| # | Demande |
|---|--------|
| 2.1 | Pages **réalisations** : `/realisations/[slug]` (ex. `/realisations/remplacement-chauffe-eau-meximieux`) |
| 2.2 | Pages **dépannage local** : `/depannage/[slug]` (ex. `/depannage/fuite-chauffe-eau-amberieu`) |
| 2.3 | Pages **conseils** : `/conseils/[slug]` (ex. `/conseils/radiateur-froid`) |
| 2.4 | Pages **services** : `/services/[slug]` (ex. `/services/installation-radiateurs`) |
| 2.5 | *(Autre bloc)* Routes **zones** : `/zones/[slug]` (ex. `/zones/meximieux`) et structure site-data **zones/** (ex. `site-data/zones/meximieux.md`) |
| 2.6 | *(Autre bloc)* Structure site-data **services/** (ex. `site-data/services/plomberie.md`, `chauffage.md`) et **chantiers/** (ex. `site-data/chantiers/chantier1.json`) |

---

## 3. SEO (chaque page)

| # | Demande |
|---|--------|
| 3.1 | Générer automatiquement pour chaque page : **meta title** |
| 3.2 | Générer **meta description** |
| 3.3 | Générer des **données structurées schema.org** |
| 3.4 | Générer des **liens internes** contextuels |
| 3.5 | Liens internes entre : services, problèmes, villes, réalisations, pages conseils |
| 3.6 | **Sitemap** automatique (inclure blog, services, depannage, conseils, realisations ; exclure le contenu brouillon) |
| 3.7 | **robots.txt** : `User-agent: *`, `Allow: /`, `Sitemap: https://mathelin-plomberie.fr/sitemap.xml` |
| 3.8 | *(Steps)* **src/app/sitemap.ts** ou **scripts/generateSitemap.ts** exécuté au build |
| 3.9 | *(Step 7)* **src/lib/seo/metaBuilder.ts** : générer title, description, canonical, Open Graph, Twitter à partir des données / frontmatter |
| 3.10 | *(Step 8)* **src/lib/seo/jsonld.ts** : LocalBusiness, Service, FAQPage, BreadcrumbList ; injection automatique dans les templates |
| 3.11 | *(Step 14)* **Journal de build SEO** : pendant le build, afficher pages générées, warnings, problèmes SEO |

---

## 4. Preuve d’activité locale

| # | Demande |
|---|--------|
| 4.1 | Lire **site-data/recent-interventions.json** |
| 4.2 | Afficher sur la page d’accueil et sur les pages services (ex. « Intervention récente à Meximieux, Débouchage évier, Mars 2026 ») |
| 4.3 | *(Step 4)* Ajouter dans les templates (Article, Depannage, Service, Realisation) : bloc preuve locale, interventions récentes, liens services, liens villes proches (données depuis recent-interventions.json) |

---

## 5. Estimateur de prix

| # | Demande |
|---|--------|
| 5.1 | Utiliser **pricing.json** et **simulateur.json** |
| 5.2 | Afficher un estimateur simple |
| 5.3 | Afficher **en permanence** sous l’estimateur la notice : « Estimation indicative. Diagnostic sur place avant toute intervention. Les prix peuvent varier selon la situation. » |

---

## 6. Images

| # | Demande |
|---|--------|
| 6.1 | **Images conseils** : stock dans **public/images/conseils/** par catégorie (radiateur, chauffe-eau, evier, robinet, canalisation, plomberie, toilette-suspendue, douche, chaudiere, climatisation, plancher-chauffant) |
| 6.2 | Détecter le thème de l’article, choisir la catégorie d’image, afficher une image **aléatoire** de cette catégorie |
| 6.3 | Images d’au moins **600 px** de large |
| 6.4 | **Photos chantiers** : affichage via URL NAS (ex. https://photos.mathelin-plomberie.fr) ; configurer **next.config.js** (images.remotePatterns) pour le domaine NAS |
| 6.5 | Utiliser **next/image** pour les images (optimisation, lazy loading) |

---

## 7. Avis

| # | Demande |
|---|--------|
| 7.1 | Afficher les avis Google |
| 7.2 | Faire **tourner aléatoirement** les avis à chaque chargement de page (ordre différent pour ne pas toujours montrer les mêmes) |

---

## 8. Admin

| # | Demande |
|---|--------|
| 8.1 | Zone admin à l’URL **/admin** |
| 8.2 | Protéger par **mot de passe** (pas d’édition de code pour changer les réglages) |
| 8.3 | Permettre d’éditer : **numéro de téléphone**, **email**, **zone d’intervention**, **message urgence** |
| 8.4 | Stocker ces valeurs dans un **fichier JSON** de configuration |
| 8.5 | Exclure l’admin du SEO (**meta noindex**) |
| 8.6 | *(Autre bloc)* Admin dans **src/app/admin** |

---

## 9. Performance et déploiement

| # | Demande |
|---|--------|
| 9.1 | Optimiser pour un déploiement **Vercel** |
| 9.2 | **Génération statique** autant que possible |
| 9.3 | **Lazy loading** des images |
| 9.4 | **Peu de JavaScript côté client** |
| 9.5 | Chargement de page rapide |
| 9.6 | *(Step 11)* Optimisation images, lazy loading, **mémorisation de composants**, **cache sûr** pour les loaders de contenu ; site restant entièrement statique |
| 9.7 | Éviter fetch dynamique inutile, API routes inutiles, rendu serveur inutile |
| 9.8 | Build qui réussit avec **vercel deploy** |

---

## 10. Structure projet et config (bloc « structure cible »)

| # | Demande |
|---|--------|
| 10.1 | Racine : **package.json**, **next.config.js**, **tsconfig.json**, **postcss.config.js**, **tailwind.config.ts**, **.gitignore**, **.env.example**, **README.md** |
| 10.2 | **public** : favicon.ico, logo.png, og-image.jpg, **robots.txt** |
| 10.3 | **site-data** : dossiers services, zones, chantiers (ou realisations, depannage, conseils selon le bloc) |
| 10.4 | Dossier **scripts** |
| 10.5 | **src** : app, components, lib, contexts, templates |
| 10.6 | **Ne pas versionner** : .next, .cache, node_modules |
| 10.7 | **.gitignore** : node_modules, .next, .env, .env.local, .env.*, .cache, .vercel |
| 10.8 | **.env.example** avec : NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_PHOTO_BASE_URL, ADMIN_PASSWORD |
| 10.9 | **next.config.js** : images.remotePatterns (NAS), **reactStrictMode: true**, **poweredByHeader: false**, **compress: true** |
| 10.10 | **package.json** : scripts dev, build, start, lint ; dépendances minimales ; supprimer les dépendances inutiles |
| 10.11 | **layout.tsx** : **metadataBase** (URL du site), title, description (plombier chauffagiste Meximieux, Ambérieu, Lagnieu, Bugey) |
| 10.12 | Domaine : **HTTPS**, redirection **www** → **non-www** |

---

## 11. Steps 2–3 : Validation et chargement du contenu

| # | Demande |
|---|--------|
| 11.1 | **(Step 2)** Système de **validation du markdown** : tous les markdown doivent supporter le frontmatter : title, description, slug, city, service, problem, date, updatedAt |
| 11.2 | **(Step 2)** Validator qui vérifie : champs manquants, slugs invalides, slugs dupliqués, contenu vide |
| 11.3 | **(Step 2)** En cas de problème : **logger un warning au build** |
| 11.4 | **(Step 3)** **src/lib/contentLoader.ts** : valider le markdown, parser le frontmatter, **sanitizer le contenu**, se protéger contre les données malformées |
| 11.5 | **(Step 3)** Utiliser ce loader **partout** où du contenu est chargé |

---

## 12. Step 5 : Moteur de liens internes

| # | Demande |
|---|--------|
| 12.1 | **src/lib/internalLinking.ts** : générer des liens contextuels automatiques |
| 12.2 | Chaque page doit lier : services associés, villes proches, articles pertinents |

---

## 13. Step 6 : Sécurité SEO (slugs)

| # | Demande |
|---|--------|
| 13.1 | **src/lib/slugRegistry.ts** : registre des slugs |
| 13.2 | Détecter : pages dupliquées, slugs en conflit, patterns d’URL invalides |
| 13.3 | Logger des **warnings au build** |

---

## 14. Step 9–10 : Sitemap et validation build

| # | Demande |
|---|--------|
| 14.1 | **(Step 9)** **scripts/generateSitemap.ts** : générer le sitemap (blog, services, depannage, conseils, realisations), **exclure le contenu brouillon**, exécuter pendant le build |
| 14.2 | **(Step 10)** **scripts/validateContent.ts** : vérifier liens cassés, frontmatter manquant, slugs dupliqués, markdown invalide |
| 14.3 | **(Step 10)** Faire **échouer le build** uniquement en cas d’erreurs **critiques** |

---

## 15. Step 12 : Sécurité des données

| # | Demande |
|---|--------|
| 15.1 | Protéger contre les données malformées venant de site-data |
| 15.2 | **Sanitiser** : HTML, markdown, champs JSON |
| 15.3 | Utiliser un **parsing sûr** |

---

## 16. Step 13 : Validation site-data

| # | Demande |
|---|--------|
| 16.1 | **src/lib/siteDataValidator.ts** : validateur pour la structure de **recent-interventions.json**, **pricing.json**, **simulateur.json** |
| 16.2 | Vérifier la **cohérence de structure** |

---

## 17. Règles de conduite (ne pas coder de régression)

| # | Demande |
|---|--------|
| 17.1 | Ne **jamais** supprimer de code existant |
| 17.2 | Ne **jamais** casser une fonctionnalité existante |
| 17.3 | Ne **jamais** refactorer de façon destructive |
| 17.4 | Ne changer le comportement **que** si nécessaire (sécurité ou stabilité) |
| 17.5 | **Uniquement** améliorer, étendre, sécuriser, optimiser |
| 17.6 | Garder **toute** la logique actuelle opérationnelle |

---

## Synthèse par fichier / artefact demandé

| Fichier / artefact | Demandé par |
|--------------------|-------------|
| **src/lib/contentLoader.ts** | Step 3 |
| **src/lib/internalLinking.ts** | Step 5 |
| **src/lib/slugRegistry.ts** | Step 6 |
| **src/lib/seo/metaBuilder.ts** | Step 7 |
| **src/lib/seo/jsonld.ts** | Step 8 |
| **src/lib/siteDataValidator.ts** | Step 13 |
| **scripts/generateSitemap.ts** | Step 9 (+ bloc structure) |
| **scripts/validateContent.ts** | Step 10 |
| **src/app/sitemap.ts** | Bloc structure / SEO |
| **src/app/robots.ts** ou **robots.txt** | Bloc structure / SEO |
| **next.config.js** (remotePatterns, reactStrictMode, poweredByHeader, compress) | Bloc structure |
| **.gitignore** (liste complète) | Bloc structure |
| **.env.example** (variables listées) | Bloc structure |
| **layout** (metadataBase, title, description) | Bloc structure |
| Validator markdown (frontmatter unifié, warnings build) | Step 2 |
| Templates enrichis (preuve locale, interventions, liens services/villes) | Step 4 |
| Journal de build SEO (pages, warnings, problèmes) | Step 14 |
| Sanitization HTML / markdown / JSON, parsing sûr | Step 12 |
| Performance : memoization, cache loaders, static | Step 11 |
| Routes /realisations, /depannage, /conseils, /services (et évent. /zones) | Tous les blocs |
| Admin (mot de passe, JSON, champs éditables, noindex) | Blocs 1 et structure |
| Estimateur (pricing + simulateur + notice) | Bloc 1 |
| Images conseils (catégories, 600 px, aléatoire) + NAS (remotePatterns) | Bloc 1 + structure |
| Avis en rotation aléatoire | Bloc 1 |
| recent-interventions.json lu et affiché | Bloc 1 + Step 4 |

---

*Ce document sert de checklist exhaustive des demandes contenues dans les prompts. Le CDC et l’analyse indiquent ce qui est déjà en place, ce qui est en conflit (ex. zones/chantiers vs realisations/depannage/conseils) et ce qui reste optionnel ou à planifier.*
