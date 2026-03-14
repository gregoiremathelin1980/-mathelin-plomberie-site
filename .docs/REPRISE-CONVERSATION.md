# Reprise de conversation — Site Mathelin plomberie chauffage

Ce fichier résume l’état du projet à la fin de l’ancienne conversation pour reprendre le travail dans une nouvelle session.

---

## Contexte de l’ancienne conversation

- **Objectif** : site professionnel pour **Mathelin plomberie chauffage** (Pérouges, Meximieux, Ambérieu, Lagnieu, etc.).
- **Évolution** : création Next.js → page « en construction » → CDC/DOD → UI moderne (Lucide, shadcn) → routes `/devis`, `/realisations` → templates → sitemap → contenu en fichiers → admin → port 3001 → script de lancement dev.

---

## État actuel du projet

### Stack
- **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**
- **shadcn-style** : Card, Button, Input, Label, Textarea, Form, Dialog (dans `src/components/ui/`)
- **Lucide React** pour les icônes
- **Contenu** : lecture depuis `content/` (Markdown + JSON), plus API Géocompta en direct

### Configuration
- **`src/lib/config.ts`** : téléphone (04 74 00 00 00), adresse (57 impasse des Verchères, Pérouges), `CITIES_15KM`, `DEVIS_CITIES`
- **Port dev** : **3001** (pour éviter conflit avec un logiciel sur 3000)
- **`content/settings/site.json`** : réglages du site (company, phone, address, cities, etc.) utilisés via **SettingsContext**

### Pages
- **/** : accueil (Hero, Services, Devis, Réalisations, Blog, Zone, Contact)
- **/services** + **/services/[slug]** : liste et détail des services
- **/devis** : formulaire d’estimation (90€–160€, disclaimer)
- **/realisations** + **/realisations/[slug]** : réalisations (données dans `content/realisations/*.md`)
- **/blog** + **/blog/[slug]** : articles (données dans `content/blog/*.md`)
- **/conseils** + **/conseils/[slug]** : conseils (données dans `content/conseils/*.md`)
- **/contact** : formulaire (nom, téléphone, message, objet) + bouton d’appel
- **/admin** : interface d’administration du contenu

### Données & contenu
- **Réalisations** : `content/realisations/*.md` (frontmatter : title, city, service, date, images)
- **Blog** : `content/blog/*.md` (title, city, date, excerpt)
- **Conseils** : `content/conseils/*.md`
- **Services** : `content/services/*.json` + `src/lib/services-data.ts`
- **Paramètres** : `content/settings/site.json`

### Composants principaux
- Header, Footer, Hero, ServiceCard, EstimateForm, ProjectCard, BlogCard, ContactForm
- Templates : ServiceTemplate, ArticleTemplate, RealisationTemplate
- **AreaSection** : zone 15 km autour de Pérouges

### SEO & technique
- Métadonnées par page, **LocalBusiness** (JSON-LD), **sitemap** automatique
- Formulaires avec `data-geocompta-form` pour liaison future avec GeoCompta

---

## Reprendre le travail

**Dans cette conversation (ou toute nouvelle conversation)** : tu peux continuer comme si on reprenait l’ancienne discussion. Indique simplement ce que tu veux faire ensuite, par exemple :

- Modifier un texte, une page ou un composant
- Ajouter une fonctionnalité (ex. envoi des formulaires vers une API)
- Reconnecter l’API Géocompta au lieu du contenu fichier
- Corriger un bug ou améliorer le design
- Préparer le déploiement sur Vercel
- Adapter le numéro de téléphone ou l’adresse

**Lancer le site en local** : `npm run dev` → http://localhost:3001

---

## Règle après modifs build / dev

Après des changements sur le layout, la config ou les chunks : **libérer le port 3001, supprimer `.next`, relancer `npm run dev`**. Détail des commandes : **`.docs/CONVENTIONS-DEV.md`**.

---

*Dernière mise à jour : reprise de conversation.*
