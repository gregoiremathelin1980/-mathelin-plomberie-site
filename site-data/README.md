# Données exportées (GéoCompta)

Ce dossier contient **uniquement** les fichiers exportés par GéoCompta (mode fichiers).  
Si **`GEOCOMPTA_API_BASE_URL`** est défini (voir `docs/GEOCOMPTA-API.md`), le site consomme en priorité **l’API** pour l’accueil, `/p/[slug]`, et les fiches API ; les fichiers ci-dessous servent de **secours** ou pour les zones non encore branchées sur l’API.

## Structure

- **`depannage/*.md`** — Pages dépannage (problème + ville).  
  Routes générées : `/depannage/[slug]` (ex. `/depannage/fuite-chauffe-eau-amberieu`).

- **`realisations/*.md`** — Réalisations enrichies (optionnel).  
  Si présent, utilisé en priorité pour les pages `/realisations/[slug]`.  
  Sinon le site utilise `content/realisations/*.md`.

- **`recent-interventions.json`** — Liste de base / historique des interventions pour le bloc « Interventions récentes » (preuve locale).  
  Affiché sur la page d’accueil, services et dépannage. Optionnel : `slug` pour lier vers `/realisations/[slug]`.

- **`interventions-du-jour.json`** — **Export GéoCompta quotidien** : interventions réalisées **aujourd’hui** (ou la journée exportée).  
  Le site **fusionne** ce fichier avec `recent-interventions.json` : les lignes du jour passent **en premier**, puis la liste de base.  
  Même format que ci-dessous. Si `date` est absente, le site utilise la **date du jour** (fuseau Europe/Paris) pour l’affichage et le tri.  
  Recommandation : faire **écraser** ce fichier chaque jour par l’export (pas d’historique dans ce fichier — l’historique reste dans `recent-interventions.json` ou les réalisations).

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

## Format `recent-interventions.json` et `interventions-du-jour.json`

Même structure pour les deux fichiers.

```json
[
  { "city": "Meximieux", "label": "débouchage évier", "slug": "debouchage-evier-meximieux", "date": "2026-03-15" },
  { "city": "Ambérieu-en-Bugey", "label": "fuite chauffe-eau" }
]
```

Ou avec une clé : `{ "interventions": [ ... ] }`. Le champ `slug` optionnel lie l’item à la page `/realisations/[slug]`. Le champ **`date`** (YYYY-MM-DD ou YYYY-MM) est recommandé pour l’export du jour afin d’éviter toute ambiguïté.

### Côté GéoCompta

1. Créer un export (CSV → JSON, requête, script maison, etc.) qui produit **`interventions-du-jour.json`** dans le dossier `site-data` (ou celui pointé par **`SITE_DATA_DIR`**).
2. Planifier l’export **une fois par jour** (fin de journée ou lendemain matin) : le fichier contient **uniquement** les interventions de la période visée ; le site remplace l’affichage « du jour » à chaque déploiement ou rebuild.
3. Après export : **commit + push** (si le JSON est versionné) ou copie vers le NAS / dossier de build selon votre flux, puis **redéploiement Vercel** si les données ne sont pas lues depuis un volume au build — sur Vercel le JSON doit être présent **au moment du build** ou vous utilisez un webhook qui déclenche un nouveau déploiement après mise à jour du repo.

## Format `local-activity.json`

```json
[
  { "city": "Meximieux", "count": 12, "period": "ces derniers mois" }
]
```

Ou `{ "activities": [ ... ] }`. `period` est optionnel (défaut : « ces derniers mois »).

## Format `reviews.json` ou `google-reviews.json`

**Uniquement si `GEOCOMPTA_API_BASE_URL` n’est pas défini** (pas d’API GéoComptaAE) : l’accueil peut afficher des avis issus de ces fichiers via `getRandomReviews()`. Dès que l’API est configurée, les avis viennent **exclusivement** de GéoComptaAE (`/reviews` + `featuredReviews`) — pas de contenu démo depuis ce dossier.

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
