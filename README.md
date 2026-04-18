# Mathelin plomberie chauffage – Site web

Site vitrine pour **Mathelin plomberie chauffage**, plombier chauffagiste à Pérouges, Meximieux, Ambérieu-en-Bugey, Lagnieu et environs.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **TypeScript**
- **shadcn/ui** (Button, Card, Input, Form, Textarea, Dialog)
- **Lucide React** (icônes)

Optimisé pour un déploiement sur **Vercel**.

Voir **SETUP-STEPS.md** pour la checklist de mise en place (étapes 1 à 9).

## Développement local

```bash
# Installer les dépendances (à lancer depuis ce dossier)
npm install

# Lancer le serveur de dev
npm run dev
```

Ouvrir [http://localhost:3001](http://localhost:3001). (Le port 3001 est utilisé pour éviter le conflit avec une autre app sur le port 3000.)

> **Note :** Si `npm install` échoue (dossier avec espace ou caractères spéciaux), déplacer le projet dans un chemin sans espace (ex. `C:\projets\mathelin-plomberie`) puis relancer `npm install`.

## Build & déploiement

```bash
npm run build
npm start
```

Sur **Vercel** : connecter le dépôt Git du projet ; le build et le déploiement sont automatiques. Variables : **`docs/VERCEL-DEPLOY.md`** et **`.env.example`**.

## GéoComptaAE (API publique)

Quand **`GEOCOMPTA_API_BASE_URL`** est défini (Vercel ou `.env.local`), le site consomme **exclusivement** l’API read-only GéoComptaAE (`GET /api/public/*`) pour l’accueil dynamique, les avis, le sitemap `/p/*`, etc. La source de vérité est le serveur GéoComptaAE — pas d’appel Google Business Profile depuis ce dépôt.

- Contrat d’intégration côté site : **`docs/GEOCOMPTA-API.md`** — prompt agent Cursor (site) : **`docs/PROMPT_AGENT_SITE_VITRINE_GEOCOMPTAE.md`**
- Schémas Zod : **`src/lib/api/geocomptaSchemas.ts`**
- Clé API : si GéoComptaAE active `GEOCOMPTA_PUBLIC_API_KEY`, renseigner **`GEOCOMPTA_API_KEY`** avec la même valeur (header `Authorization: Bearer` sur toutes les requêtes).

**Avis** : si les listes API sont vides, l’accueil affiche un message sobre (« Aucun avis pour le moment »). Pas d’avis « démo » en fichier lorsque l’API est configurée. Pour masquer tout le bloc : **`displaySettings.showReviews`** via `site-data/site-settings.json` ou l’admin.

## Contenu (fichiers)

Hors champs dynamiques GéoComptaAE (voir section ci-dessus), une grande partie du contenu statique vient du dossier **`content/`** :

- **`content/settings/site.json`** — Téléphone, adresse, villes, message d’accueil (éditable via **`/admin`**).
- **`content/realisations/*.md`** — Une réalisation = un fichier Markdown (frontmatter + corps). Les nouvelles pages apparaissent au prochain build.
- **`content/blog/*.md`** — Un article = un fichier Markdown. Idem.

Voir **`content/README.md`** pour le format des fichiers.

## Configuration

- **Téléphone, adresse, villes, message d’accueil** : éditer **`content/settings/site.json`** ou utiliser la page **`/admin`** (les modifications sont enregistrées dans ce fichier ; sur Vercel, le système de fichiers est en lecture seule, l’admin ne peut pas écrire).
- **URL du site** : `src/lib/config.ts` (SITE_URL).
- **Métadonnées SEO** : `src/app/layout.tsx` (title, description, mots-clés).

## Structure des composants

- `Header` / `Footer` : navigation et pied de page
- `Hero` : bandeau d’accueil avec CTA (appel, devis)
- `ServiceCard` : carte de service
- `EstimateForm` : formulaire d’estimation rapide
- `ProjectGallery` : réalisations (données depuis API)
- `BlogList` : articles (données depuis API)
- `ContactForm` : formulaire de contact + bouton d’appel

SEO : métadonnées + schéma **LocalBusiness** (Plumber) pour le référencement local.
