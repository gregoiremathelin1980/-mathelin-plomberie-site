# Contenu du site

Le site charge son contenu **uniquement depuis ce dossier** (fichiers statiques). Aucune connexion à GeoCompta ni à une base de données sensible.

## Principe de sécurité

**Le site ne doit jamais accéder à GeoCompta directement.**  
GeoCompta exporte uniquement des fichiers de contenu publics. Le site ne lit que ces données exportées. Cela évite tout accès à des données sensibles (transactions bancaires, comptabilité, factures clients, identifiants).

## Structure

- **`settings/site.json`** — Configuration générale (téléphone, adresse, villes, message d’accueil). Modifiable depuis `/admin`.
- **`realisations/*.md`** — Chaque intervention = un fichier Markdown (title, city, service, date, images, **draft**).
- **`conseils/*.md`** — Conseils (title, category, city optionnel pour conseils localisés, date, excerpt, **draft**).
- **`services/*.json`** — Contenu SEO des pages services (problems, intervention, faq, priceKeys, conseilCategories).
- **`villes/villes.json`** — Liste des communes d’intervention (optionnel ; sinon prise depuis `settings`).
- **`prix/prix.json`** — Fourchettes de prix indicatives (formulaire de devis et pages services).
- **`blog/*.md`** — Articles actualités (title, city, date, excerpt, **draft**).

---

## Workflow GeoCompta

```
intervention → contenu généré (brouillon) → validation utilisateur → git push → site à jour → réseaux sociaux
```

### 1. Entrée intervention (exemple)

- `service` : Débouchage canalisation  
- `city` : Meximieux  
- `date` : 2026-03-12  
- `images` : ["chantier1.jpg"]

### 2. Page réalisation

Créer le fichier **`realisations/<slug>.md`** (ex. `debouchage-canalisation-meximieux.md`) :

```yaml
---
title: Débouchage canalisation à Meximieux
city: Meximieux
service: Débouchage canalisation
date: 2026-03-12
images:
  - chantier1.jpg
draft: true
---

Intervention réalisée à Meximieux suite à une canalisation bouchée.
```

- **`draft: true`** : le contenu n’apparaît pas sur le site tant qu’il n’est pas validé (via `/admin` → Publier).

### 3. Génération d’un conseil

À partir de chaque intervention, générer un article de conseil associé.

Exemple : intervention « débouchage évier à Meximieux » → conseil **Comment éviter un évier bouché**.

Créer **`conseils/eviter-evier-bouche.md`** :

```yaml
---
title: Comment éviter un évier bouché
city: Meximieux
date: 2026-03-12
excerpt: Quelques gestes simples pour limiter les bouchons.
draft: true
---

Contenu du conseil (entretien, bonnes pratiques). Privilégier maintenance et réparation avant le remplacement (ex. chauffe-eau qui chauffe mal : vérifier l’entartrage, détartrage avant d’envisager le remplacement).
```

- **Conseils localisés** : même dossier `conseils/`, avec `city` renseigné (ex. « Comment éviter un évier bouché à Meximieux »). Ils sont mélangés aux conseils généraux sur le site.

### 4. Validation du contenu

- Tout le contenu généré doit être créé avec **`draft: true`**.
- L’utilisateur valide dans **`/admin`** (section Brouillons) en cliquant sur **Publier** pour chaque réalisation / article blog / conseil.
- La publication enlève le statut brouillon (contenu visible sur le site).

### 5. Déploiement (Git)

Après validation, exécuter :

```bash
git add .
git commit -m "Nouvelle intervention plomberie"
git push
```

Ou double-cliquer sur **`Déployer le site.bat`** à la racine du projet. Le push déclenche le déploiement automatique sur Vercel.

### 6. Réseaux sociaux

Après validation, générer des posts courts pour **Google Business**, **Facebook**, **Instagram** (manuellement ou via GeoCompta à partir du contenu publié).

---

## Détail des formats

### Réalisations (`realisations/*.md`)

| Champ   | Obligatoire | Description                          |
|--------|-------------|--------------------------------------|
| title  | oui         | Titre de l’intervention              |
| city   | non         | Ville                                |
| service| non         | Type de service                      |
| date   | non         | Date (YYYY-MM-DD)                    |
| images | non         | Liste de chemins d’images            |
| draft  | non         | `true` = brouillon (masqué sur le site) |

Corps : description en Markdown.

### Blog (`blog/*.md`)

| Champ   | Obligatoire | Description                |
|--------|-------------|----------------------------|
| title  | oui         | Titre                      |
| city   | non         | Ville                      |
| date   | non         | YYYY-MM-DD                 |
| excerpt| non         | Résumé court / SEO         |
| draft  | non         | `true` = brouillon         |

### Conseils (`conseils/*.md`)

| Champ   | Obligatoire | Description                              |
|--------|-------------|------------------------------------------|
| title  | oui         | Titre du conseil                         |
| city   | non         | Vide = conseil général ; renseigné = localisé |
| date   | non         | YYYY-MM-DD                               |
| excerpt| non         | Résumé court                             |
| draft  | non         | `true` = brouillon                       |

Philosophie des conseils : privilégier **entretien et réparation** avant de recommander un remplacement (ex. chauffe-eau qui chauffe mal → vérifier l’entartrage, proposer un détartrage avant de remplacer).

---

Les images des réalisations sont à placer dans `public/images/realisations/`. Les nouvelles pages sont prises en compte au prochain build (ou au rechargement en dev).
