# Checklist de mise en place — Mathelin plomberie chauffage

Ce document suit les étapes du brief de production.

---

## STEP 1 — Project initialization ✅

- **Next.js** avec App Router (`src/app/`)
- **TypeScript** activé
- **Tailwind CSS** configuré (`tailwind.config.ts`, `postcss.config.js`)

> Note : Le projet existe déjà dans le workspace. Pour créer un nouveau projet avec `npx create-next-app@latest mathelin-site`, exécuter la commande dans un dossier sans espace (ex. `C:\projets\mathelin-site`).

---

## STEP 2 — UI system ✅

- **shadcn/ui** : configuration dans `components.json` ; composants dans `src/components/ui/`
- **Composants installés** :
  - `button` — variantes (default, accent, outline, secondary), tailles
  - `card` — Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
  - `input` — champ texte avec focus ring
  - `label` — libellé formulaire
  - `textarea` — zone de texte
  - `form` — Form, FormField, FormItem, FormLabel, FormControl, FormMessage (react-hook-form + zod)
  - `dialog` — Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, etc. (Radix UI)
- **Lucide React** : icônes utilisées dans tout le site

Dépendances associées : `class-variance-authority`, `clsx`, `tailwind-merge`, `react-hook-form`, `zod`, `@hookform/resolvers`, `@radix-ui/react-dialog`.

---

## STEP 3 — Project structure ✅

```
/app
  layout.tsx
  page.tsx
  sitemap.ts
  /services/page.tsx, /services/[slug]/page.tsx
  /devis/page.tsx
  /realisations/page.tsx, /realisations/[slug]/page.tsx
  /blog/page.tsx, /blog/[slug]/page.tsx
  /contact/page.tsx

/components
  Header, Footer, Hero, ServiceCard, EstimateForm, ProjectCard, BlogCard, ContactForm
  AreaSection, LocalBusinessSchema, ProjectGallery, BlogList
  /ui (button, card, input, label, textarea, form, dialog)

/templates
  ArticleTemplate, RealisationTemplate, ServiceTemplate
```

---

## STEP 4 — Implement UI ✅

- Mise en page avec **Tailwind** et **composants shadcn/ui**
- **Lucide** pour les icônes
- Grilles responsives, cartes, espacements cohérents
- Hero avec image de fond, indicateurs de confiance, CTA
- Formulaires (devis, contact) avec champs et boutons

---

## STEP 5 — GeoCompta integration ✅

- Données chargées depuis :
  - `GET /api/realisations` → liste et pages `/realisations/[slug]`
  - `GET /api/posts` → liste et pages `/blog/[slug]`
- Variable d’environnement : `GEOCOMPTA_API_URL` (base URL de l’API)
- Fichier : `src/lib/geocompta.ts` (`getRealisations`, `getRealisationBySlug`, `getPosts`, `getPostBySlug`)

---

## STEP 6 — SEO ✅

- **Metadata** Next.js dans `layout.tsx` et sur chaque page
- **LocalBusiness** (JSON-LD) avec adresse, téléphone, zone d’intervention
- **Sitemap** : `src/app/sitemap.ts` (pages statiques + services + réalisations + blog)
- Balisage **sémantique** : `header`, `main`, `footer`, `article`, `section`, etc.

---

## STEP 7 — Test locally

À exécuter après `npm install` (de préférence dans un dossier sans espace, ex. copier le projet dans `C:\projets\mathelin-site`) :

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000 et vérifier : navigation, formulaires, responsive, routes (/, /services, /devis, /realisations, /blog, /contact, /services/[slug], etc.).

---

## STEP 8 — Final UI refactor ✅

- Marges et paddings cohérents (sections `py-16`, `max-w-6xl`, `gap-6`)
- Typographie : Poppins (titres), Inter (texte)
- Hiérarchie visuelle : titres en `text-primary`, cartes avec bordures et ombres

---

## STEP 9 — Prepare deployment ✅

- **Build** : `npm run build` (à lancer après `npm install` ; si erreur en local à cause du chemin avec espace, le build Vercel fonctionnera)
- **Images** : composant Next.js `Image` avec `sizes` et domaines autorisés dans `next.config.js`
- **Redirections** : `/estimate` → `/devis`, `/projects` → `/realisations`
- Projet prêt pour **Vercel** : connecter le dépôt Git ; Vercel exécutera `npm install` et `npm run build`
