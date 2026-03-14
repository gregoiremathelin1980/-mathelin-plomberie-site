# Images des articles conseils

Chaque sous-dossier correspond à une **catégorie** détectée à partir du slug de l’article. Une image est choisie **aléatoirement** dans le dossier de la catégorie.

**Ordre de priorité** (détection) : chauffe-eau → radiateur → chauffage → evier → robinet → canalisation → … → plomberie.

## Dossiers (catégories)

- **chauffe-eau** — ex. chauffe-eau-panne, pas-eau-chaude, detartrage-chauffe-eau
- **radiateur** — ex. bruit-radiateur, radiateur-froid, purge-radiateur
- **chauffage** — ex. desembouage-chauffage, equilibrage-radiateurs, panne-chauffage
- **evier** — ex. evier-bouche, eviter-evier-bouche, evacuation-lente
- **robinet** — ex. fuite-robinet, mousseur-robinet
- **canalisation** — ex. canalisation bouchée, pression-eau-faible, debouchage, tuyaux
- **plomberie** — fallback si aucune catégorie ne correspond
- **toilette-suspendue** — ex. toilettes-bouchees
- **douche** — ex. douche-bouchee
- **chaudiere**, **climatisation**, **plancher-chauffant**

## Qualité

Seules les images d’**au moins 600 px de large** sont utilisées (les plus petites sont ignorées).

## Fallback

Si un dossier est vide ou absent, le site utilise **plomberie**.  
**Pour afficher vos propres photos** : placez au moins une image (ex. `plomberie.jpg`) dans le dossier **plomberie**. Tant qu’aucun fichier n’est présent, une image de secours s’affiche pour éviter les zones grises.

## Formats

Fichiers acceptés : `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
