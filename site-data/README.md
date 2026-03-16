# Données exportées (GéoCompta)

Ce dossier contient **uniquement** les fichiers exportés par GéoCompta.  
Le site ne se connecte jamais directement à GéoCompta.

## Structure

- **`depannage/*.md`** — Pages dépannage (problème + ville).  
  Routes générées : `/depannage/[slug]` (ex. `/depannage/fuite-chauffe-eau-amberieu`).

- **`realisations/*.md`** — Réalisations enrichies (optionnel).  
  Si présent, utilisé en priorité pour les pages `/realisations/[slug]`.  
  Sinon le site utilise `content/realisations/*.md`.

- **`recent-interventions.json`** — Liste des interventions récentes pour le bloc « Interventions récentes autour de vous » (preuve locale).  
  Affiché sur la page d’accueil, services et dépannage. Optionnel : `slug` pour lier vers `/realisations/[slug]`.

- **`local-activity.json`** — Activité par ville (ex. « 12 interventions à Meximieux ces derniers mois »).

- **`conseils/*.md`** — Articles conseils (même structure que `content/conseils`). Fusionnés avec content pour les routes `/conseils` et `/conseils/[slug]`.

- **`reviews.json`** — Avis Google (note + texte). Affichés en 3 avis aléatoires avec mise en page aléatoire.

- **`simulateur.json`** — Options du sélecteur de problème pour l’estimateur de prix (step1, step2, step3).

- **`pricing.json`** — Grille de prix pour l’estimation (prioritaire sur `data/pricing.json`).

## Format `depannage/*.md`

```yaml
---
title: Fuite chauffe-eau à Ambérieu-en-Bugey
city: Ambérieu-en-Bugey
problem: Fuite chauffe-eau
excerpt: Courte description pour le SEO.
realisations:   # slugs de content/realisations ou site-data/realisations
  - reparation-fuite-perouges
  - debouchage-canalisation-meximieux
---
Texte : explication du problème.

---
Section optionnelle : intervention typique (après le séparateur ---).
```

## Format `realisations/*.md`

Identique à `content/realisations/*.md`. Optionnel : `conseils` (liste de slugs vers `content/conseils`).

```yaml
---
title: Titre
city: Ville
service: Nom du service
date: 2026-03-12
images: []
conseils: [slug-conseil-1, slug-conseil-2]
---
Description de l'intervention.
```

## Format `recent-interventions.json`

```json
[
  { "city": "Meximieux", "label": "débouchage évier", "slug": "debouchage-evier-meximieux" },
  { "city": "Ambérieu-en-Bugey", "label": "fuite chauffe-eau" }
]
```

Ou avec une clé : `{ "interventions": [ ... ] }`. Le champ `slug` optionnel lie l’item à la page `/realisations/[slug]`.

## Format `local-activity.json`

```json
[
  { "city": "Meximieux", "count": 12, "period": "ces derniers mois" }
]
```

Ou `{ "activities": [ ... ] }`. `period` est optionnel (défaut : « ces derniers mois »).

## Format `reviews.json` ou `google-reviews.json`

Le site lit d’abord `google-reviews.json`, sinon `reviews.json`. Structure :

```json
[
  { "name": "Client", "rating": 5, "text": "Intervention rapide et travail propre." },
  { "author": "Jean D.", "rating": 5, "text": "Intervention rapide et soignée.", "date": "2026-03-01" }
]
```

`name` ou `author` pour le nom du client. Trois avis aléatoires sont affichés à chaque chargement.

Ou `{ "reviews": [ ... ] }`.

## Format `simulateur.json`

Options pour l’estimateur (étape 1 = type de problème, étape 2 = détail par type, étape 3 = situation). Si absent, le site utilise des valeurs par défaut.

```json
{
  "step1": [
    { "value": "canalisation", "label": "Canalisation bouchée" },
    { "value": "fuite", "label": "Fuite d'eau" }
  ],
  "step2": {
    "canalisation": [
      { "value": "evier", "label": "Évier bouché" }
    ]
  },
  "step3": [
    { "value": "urgence", "label": "Urgence" }
  ]
}
```

## Photos chantiers (nom de fichier SEO)

Pour le référencement Google Images, nommer les fichiers selon : **`[type-de-travaux]-mathelin-plomberie-[ville].jpg`** (ex. Dépannage fuite à Ambérieu → `depannage-fuite-mathelin-plomberie-amberieu.jpg`). Le site génère les balises `alt` automatiquement à partir du titre et de la ville.

## Alias du dossier

En développement ou build, le dossier peut pointer vers un emplacement externe via la variable d’environnement **`SITE_DATA_DIR`** (ex. `C:\Users\Grégoire\SiteMathelinData`). Sinon le site utilise le sous-dossier `site-data` du projet.
