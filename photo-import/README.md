# Import et filtrage des photos (temporaire)

Système temporaire pour traiter les photos exportées d’un album Google Photos (chantiers plomberie).

---

## À garder : uniquement les photos optimisées

Seul le dossier **`optimized`** contient les images à conserver pour le site. Pas besoin de doublons : les dossiers `input` et `filtered` peuvent être vidés après chaque run. Pour supprimer les doublons dans `optimized` :

```bash
python photo-import/scripts/deduplicate_optimized.py
```

---

## Workflow

1. Exporter l’album Google Photos, dézipper dans **`photo-import/input`**.
2. `python photo-import/scripts/filter_photos.py` → photos valides dans **filtered**, à vérifier dans **review**.
3. Vérifier **review**, déplacer éventuellement des photos vers **filtered**.
4. `python photo-import/scripts/optimize_images.py` → images finales dans **optimized**.
5. (Optionnel) `python photo-import/scripts/deduplicate_optimized.py` → suppression des doublons dans **optimized**.
6. (Optionnel) `python photo-import/scripts/classify_plumbing_photos.py` → classement dans **public/images/** par catégorie.

Après un run réussi, vous pouvez vider **input** et **filtered** pour le prochain import.
