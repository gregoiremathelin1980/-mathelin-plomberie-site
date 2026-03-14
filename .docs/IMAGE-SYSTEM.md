# Système d’images (conseils + stock)

Le site affiche toujours une image pertinente pour les conseils, même sans photos chantier.

## Structure des dossiers

- **`/public/images/conseils/{category}`** — Photos réelles (chantier), classées par catégorie.
- **`/public/images/stock/{category}`** — Images de fallback (stock) par catégorie.

Catégories : `radiateur`, `chauffe-eau`, `evier`, `robinet`, `canalisation`, `chantier`.

## Règle de sélection

1. S’il existe des images dans **`/images/conseils/{category}`** → en choisir une **au hasard**.
2. Sinon → fallback sur **`/images/stock/{category}`** (une au hasard).
3. Si aucun fichier local → fallback sur l’image Unsplash (comportement actuel des conseils).

## Où c’est utilisé

- **Page conseil** (`/conseils/[slug]`) : catégorie déduite du slug (ex. `radiateur-bruit` → radiateur), image en haut d’article.
- **Liste conseils** (`/conseils`) et **bloc conseils accueil** : une image aléatoire par carte, selon la catégorie de l’article.

## SEO

- Toutes les images ont un **alt** (dérivé de la catégorie et du titre).
- Les noms de fichiers dans `conseils/` et `stock/` devraient être **descriptifs** (ex. `radiateur-chauffage.jpg`, `debouchage-evier.jpg`).

## Évolution (GeoCompta)

Quand GeoCompta fournira un export **photos.json**, le site pourra prioriser les URLs listées dans ce fichier ; en l’absence de fichier, le comportement actuel (dossiers locaux puis Unsplash) restera le fallback.
