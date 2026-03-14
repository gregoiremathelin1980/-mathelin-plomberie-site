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

Sur **Vercel** : connecter le dépôt Git du projet ; le build et le déploiement sont automatiques.

## Contenu (fichiers, pas d’API externe)

Le site charge tout son contenu depuis le dossier **`content/`** :

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
