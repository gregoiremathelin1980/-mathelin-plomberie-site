# Definition of Done — Site Mathelin Plomberie Chauffage

Critères de livraison et d’acceptation pour une tâche ou une release. À utiliser en complément du [CDC](CDC-Cahier-Des-Charges.md).

---

## 1. Livrabilité technique

- [ ] **Build** : `npm run build` s’exécute sans erreur (TypeScript, Next.js).
- [ ] **Lint** : `npm run lint` sans erreur (ou erreurs documentées et acceptées).
- [ ] **Pas de régression** : les routes existantes (/, /services, /realisations, /conseils, /blog, /depannage, /contact, /devis, /admin) restent accessibles et fonctionnelles.
- [ ] **Environnement** : les variables nécessaires sont documentées dans `.env.example` ; aucun secret n’est committé (`.env` et variantes dans `.gitignore`).

---

## 2. Données et contenu

- [ ] **site-data** : le site lit correctement les exports GéoCompta (realisations, depannage, conseils, recent-interventions, reviews, pricing, simulateur, site-settings).
- [ ] **Fusion** : réalisations = site-data prioritaire puis content ; conseils = fusion site-data + content ; réglages = content + site-data (y compris showChantierPhotos et showAdviceImages).
- [ ] **Brouillons** : le contenu en `draft: true` n’apparaît pas sur les pages publiques ni dans le sitemap.

---

## 3. Fonctionnalités métier

- [ ] **Réglage « Afficher photos chantiers »** : lorsqu’il est désactivé dans l’admin (site-settings), les photos chantiers ne s’affichent ni dans les listes/cartes réalisations ni sur la page détail réalisation.
- [ ] **Réglage « Afficher images conseils »** : lorsqu’il est désactivé, les images des cartes conseils ne s’affichent pas (comportement conforme au CDC).
- [ ] **Estimateur** : utilise pricing.json et simulateur.json ; la notice indicative est visible sous l’estimateur.
- [ ] **Interventions récentes** : affichées à partir de recent-interventions.json (accueil / blocs prévus).
- [ ] **Avis** : affichage avec rotation aléatoire (getRandomReviews ou équivalent).
- [ ] **Admin** : modification des réglages (téléphone, email, zone, message urgence, options d’affichage) enregistrée dans site-data/site-settings.json et reflétée sur le site après rechargement/build.

---

## 4. SEO et indexation

- [ ] **Métadonnées** : chaque type de page (accueil, service, réalisation, conseil, blog, dépannage, contact, devis) a un title et une description adaptés.
- [ ] **Données structurées** : au minimum LocalBusiness sur le layout ; Service / FAQ / Review selon les pages concernées.
- [ ] **Sitemap** : généré automatiquement (src/app/sitemap.ts ou équivalent), inclut les pages statiques, services, réalisations, blog, conseils, dépannage ; exclut les brouillons.
- [ ] **Robots** : règles d’indexation et URL du sitemap exposées (fichier ou route robots).

---

## 5. Images et médias

- [ ] **Photos chantiers** : URLs résolues via la base NAS (PHOTO_BASE_URL / getPhotoUrl) ; domaine autorisé dans next.config.js (remotePatterns).
- [ ] **Images conseils** : catégories et fallback conformes (largeur min 600 px, dossiers public/images/conseils).

---

## 6. Performance et déploiement

- [ ] **Déploiement Vercel** : le projet peut être déployé avec `vercel deploy` (ou via Git) sans erreur de build.
- [ ] **Fichiers à ne pas versionner** : .next, node_modules, .env, .env.*, .cache, .vercel sont bien exclus (.gitignore).

---

## 7. Règles d’évolution (obligatoire)

- [ ] **Aucune suppression de code** sans accord explicite ; aucune fonctionnalité existante désactivée.
- [ ] **Aucun refactor destructif** : les changements restent compatibles avec le contenu et la configuration actuels.
- [ ] Les modifications sont **additives ou correctives** (sécurité, stabilité, bugs, performance).

---

## 8. Documentation

- [ ] Les changements impactant la configuration, les variables d’environnement ou la structure des données sont reportés dans le README, le CDC ou le fichier concerné (ex. content/README.md, site-data/README.md).

---

*Une tâche ou une release est considérée « done » lorsque les critères ci-dessus applicables au périmètre de la tâche sont remplis et que le CDC est respecté.*
