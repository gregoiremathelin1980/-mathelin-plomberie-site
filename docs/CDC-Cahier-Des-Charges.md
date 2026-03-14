# Cahier des charges — Site Mathelin Plomberie Chauffage

Document unique de référence fonctionnelle et technique. Les doublons des différents prompts ont été fusionnés.

---

## 1. Contexte et objectifs

- **Projet** : Site vitrine pour **Mathelin Plomberie Chauffage**, plombier chauffagiste (Pérouges, Meximieux, Ambérieu-en-Bugey, Lagnieu, Bugey).
- **Domaine** : https://mathelin-plomberie.fr (HTTPS, redirection www → non-www souhaitée).
- **Rôle du site** : Afficher le contenu exporté par **GéoCompta**. Le site est passif : il ne fait pas d’analyse de requêtes, n’appelle pas d’API Google, ne définit pas de stratégie SEO. Toute l’intelligence SEO est côté GéoCompta ; le site se contente de rendre les pages et les métadonnées.
- **Objectifs** : Site simple, rapide, stable, optimisé pour le référencement local et le déploiement Vercel.

---

## 2. Stack et environnement

- **Framework** : Next.js 14 (App Router), TypeScript, Tailwind CSS.
- **UI** : shadcn/ui (Button, Card, Input, Label, Textarea, Form, Dialog), Lucide React (icônes).
- **Dev** : `npm run dev` (port 3001).
- **Build / prod** : `npm run build`, `npm start`.
- **Déploiement** : Vercel. Pas de connexion directe à GéoCompta ; uniquement lecture de fichiers exportés.

---

## 3. Sources de données

### 3.1 Dossier `site-data/` (exports GéoCompta — prioritaire pour réalisations, conseils, pricing)

- **realisations/*.md** — Réalisations (fusion avec content pour l’affichage ; site-data prioritaire).
- **depannage/*.md** — Pages dépannage local (ex. fuite chauffe-eau à Ambérieu).
- **conseils/*.md** — Conseils (fusionnés avec content).
- **site-settings.json** — Réglages éditables via admin : téléphone, email, zone, message urgence, affichage images conseils, affichage photos chantiers.
- **recent-interventions.json** — Interventions récentes (preuve locale).
- **reviews.json** ou **google-reviews.json** — Avis clients (affichage en rotation aléatoire).
- **pricing.json** — Grille de prix pour l’estimateur.
- **simulateur.json** — Options du sélecteur de problème (estimateur).

Option : variable d’environnement **SITE_DATA_DIR** pour pointer vers un dossier externe (ex. autre disque / build).

### 3.2 Dossier `content/` (contenu éditorial / fallback)

- **settings/site.json** — Paramètres de base (surchargés par site-data si présent).
- **realisations/*.md**, **conseils/*.md**, **blog/*.md** — Contenu statique (frontmatter + corps).
- **services/*.json** — Contenu détail des services (problems, intervention, faq, priceKeys, conseilCategories).
- **villes/villes.json**, **prix/prix.json** — Villes et fourchettes de prix (fallback).

### 3.3 Images

- **Photos chantiers** : non hébergées sur le site ; servies par une URL de base (ex. **https://photos.mathelin-plomberie.fr**). Variable **PHOTO_BASE_URL**. Les chemins relatifs ou URLs dans les données sont résolus via une fonction dédiée (ex. `getPhotoUrl`). Le domaine doit être autorisé dans **next.config.js** (`images.remotePatterns`).
- **Images conseils** : stock local **public/images/conseils/** par catégorie (radiateur, chauffe-eau, evier, etc.) ; largeur minimale 600 px ; fallback par catégorie ou image par défaut. Détection de la catégorie à partir du slug de l’article.

---

## 4. Routes et types de pages

- **/** — Accueil (réalisations, conseils, services, avis, CTA, interventions récentes).
- **/services** — Liste des 12 services (grille).
- **/services/[slug]** — Page détail service (ex. installation-radiateurs, desembouage-chauffage).
- **/realisations** — Liste des réalisations (fusion site-data + content).
- **/realisations/[slug]** — Détail réalisation (images NAS, réglage « Afficher photos chantiers », conseils liés).
- **/depannage** — Liste des pages dépannage.
- **/depannage/[slug]** — Page dépannage local (ex. fuite-chauffe-eau-amberieu).
- **/conseils** — Liste des conseils.
- **/conseils/[slug]** — Détail conseil (image contextuelle).
- **/blog** — Liste des articles blog.
- **/blog/[slug]** — Détail article.
- **/contact** — Formulaire de contact.
- **/devis** — Estimateur de prix (pricing.json + simulateur.json).
- **/admin** — Zone admin (protégée par mot de passe).
- **/admin/site-settings** — Réglages : téléphone, email, zone, message urgence, affichage images conseils, affichage photos chantiers (sauvegarde dans site-data/site-settings.json).

Chaque page doit exposer des **métadonnées** (title, description) et, lorsque pertinent, des **données structurées** (LocalBusiness, Service, FAQ, BreadcrumbList, etc.) et des **liens internes** contextuels (services, villes, réalisations, conseils).

---

## 5. Fonctionnalités obligatoires

- **Preuve locale** : affichage des interventions récentes (recent-interventions.json) sur l’accueil et pages concernées (ex. type « Intervention récente à Meximieux, Débouchage évier, Mars 2026 »).
- **Estimateur** : utilisation de pricing.json et simulateur.json ; affichage d’une **notice permanente** sous l’estimateur : « Estimation indicative. Diagnostic sur place avant toute intervention. Les prix peuvent varier selon la situation. »
- **Avis** : affichage d’avis (reviews) avec **rotation aléatoire** à chaque chargement.
- **Admin** : édition du numéro de téléphone, email, zone d’intervention, message urgence, options d’affichage (images conseils, photos chantiers), sans modification de code. Stockage dans un fichier JSON (site-data/site-settings.json).
- **Réglage « Afficher photos chantiers »** : si désactivé, les photos chantiers (NAS) ne sont pas affichées dans les cartes réalisations ni sur la page détail réalisation.

---

## 6. SEO technique

- **Métadonnées** : meta title et description par page (génération automatique à partir des données / frontmatter).
- **Données structurées** : LocalBusiness, Service, FAQ, avis (Review) selon les pages.
- **Sitemap** : génération automatique (pages statiques, services, réalisations, blog, conseils, dépannage) ; exclusion du contenu en brouillon.
- **Robots** : règles d’indexation (Allow /) et URL du sitemap (robots.txt ou équivalent Next.js).
- **Liens internes** : liens contextuels entre services, problèmes, villes, réalisations et conseils.

---

## 7. Performance et déploiement

- Privilégier la **génération statique** (SSG) lorsque c’est possible.
- **Images** : optimisation (next/image), lazy loading, domaines externes autorisés dans next.config.
- **JavaScript client** : minimal ; chargement dynamique des composants lourds si besoin.
- **Build** : doit réussir avec `npm run build` ; pas de `.next`, `node_modules` ou `.env` versionnés. Variables sensibles dans `.env` (ou dashboard Vercel) ; `.env.example` pour documentation.

---

## 8. Sécurité et bonnes pratiques

- **Variables d’environnement** : ADMIN_PASSWORD, SITE_DATA_DIR, PHOTO_BASE_URL, PEXELS_API_KEY (pour script images conseils). Ne pas committer les fichiers `.env` contenant des secrets.
- **Admin** : accès protégé (authentification par mot de passe) ; zone admin exclue du référencement (noindex si pertinent).
- **Contenu** : lecture seule des fichiers exportés ; pas d’appel API vers GéoCompta. Sanitization / validation des données lues (markdown, JSON) recommandée pour limiter les risques en cas de contenu malformé.

---

## 9. Évolutions possibles (hors scope minimal)

- Validation du frontmatter markdown (champs obligatoires, slugs, doublons) en build ou script dédié.
- Registre des slugs pour détecter conflits ou doublons.
- Validateur de structure pour les JSON site-data (recent-interventions, pricing, simulateur).
- Moteur de liens internes centralisé (services, villes, articles).
- Centralisation de la génération des métadonnées et du JSON-LD dans des modules dédiés (sans changer le comportement actuel).

---

## 10. Règle de conduite des évolutions

- **Ne pas supprimer** de code existant ni casser de fonctionnalité.
- **Ne pas refactorer** de manière destructive.
- **Uniquement** améliorer, étendre, sécuriser et optimiser, en gardant toute la logique actuelle opérationnelle.
