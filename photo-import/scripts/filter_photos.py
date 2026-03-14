#!/usr/bin/env python3
"""
Filtrage des photos importées (export Google Photos).

Workflow pour l'utilisateur:
  1. Exporter l'album Google Photos
  2. Dézipper toutes les photos dans: photo-import/input
  3. Lancer ce script: python photo-import/scripts/filter_photos.py
  4. Vérifier le contenu de: photo-import/review
  5. Lancer: python photo-import/scripts/optimize_images.py
  6. Les images prêtes pour le site sont dans: photo-import/optimized

Règles:
  - Rejet / review: largeur < 1200 px, hauteur < 800 px, ratio > 3 ou < 0.4
  - Accepté: résolution suffisante et proportions normales
"""

import os
import shutil
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Erreur: installez Pillow avec: pip install Pillow")
    raise SystemExit(1)

# Chemins relatifs au dossier photo-import (parent du dossier scripts)
SCRIPT_DIR = Path(__file__).resolve().parent
PHOTO_IMPORT_DIR = SCRIPT_DIR.parent
INPUT_DIR = PHOTO_IMPORT_DIR / "input"
FILTERED_DIR = PHOTO_IMPORT_DIR / "filtered"
REVIEW_DIR = PHOTO_IMPORT_DIR / "review"

# Seuils de filtrage
MIN_WIDTH = 1200
MIN_HEIGHT = 800
MAX_ASPECT_RATIO = 3.0   # largeur / hauteur
MIN_ASPECT_RATIO = 0.4   # largeur / hauteur

# Extensions d'images reconnues
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff", ".tif"}


def get_aspect_ratio(width: int, height: int) -> float:
    """Ratio largeur / hauteur."""
    if height <= 0:
        return 0.0
    return width / height


def classify_image(image_path: Path) -> str:
    """
    Retourne "accept" ou "review" selon les règles de filtrage.
    """
    try:
        with Image.open(image_path) as img:
            w, h = img.size
    except Exception as e:
        print(f"  [skip] {image_path.name}: impossible à ouvrir ({e})")
        return "skip"

    if w < MIN_WIDTH or h < MIN_HEIGHT:
        return "review"
    ratio = get_aspect_ratio(w, h)
    if ratio > MAX_ASPECT_RATIO or ratio < MIN_ASPECT_RATIO:
        return "review"
    return "accept"


def main() -> None:
    INPUT_DIR.mkdir(parents=True, exist_ok=True)
    FILTERED_DIR.mkdir(parents=True, exist_ok=True)
    REVIEW_DIR.mkdir(parents=True, exist_ok=True)

    if not INPUT_DIR.exists():
        print(f"Dossier introuvable: {INPUT_DIR}")
        print("Créez-le et placez-y les photos exportées de Google Photos.")
        return

    files = [
        f for f in INPUT_DIR.iterdir()
        if f.is_file() and f.suffix.lower() in IMAGE_EXTENSIONS
    ]

    if not files:
        print(f"Aucune image trouvée dans {INPUT_DIR}")
        return

    print(f"Traitement de {len(files)} image(s) dans {INPUT_DIR}")
    print(f"  - Acceptées -> {FILTERED_DIR}")
    print(f"  - À vérifier -> {REVIEW_DIR}")
    print()

    accepted = 0
    review = 0
    skipped = 0

    for path in files:
        result = classify_image(path)
        dest_dir = FILTERED_DIR if result == "accept" else REVIEW_DIR if result == "review" else None
        if dest_dir is None:
            skipped += 1
            continue
        dest = dest_dir / path.name
        # Éviter l'écrasement: nom unique si le fichier existe déjà
        if dest.exists():
            stem, suf = path.stem, path.suffix
            n = 1
            while dest.exists():
                dest = dest_dir / f"{stem}_{n}{suf}"
                n += 1
        try:
            shutil.copy2(path, dest)
            if result == "accept":
                accepted += 1
            else:
                review += 1
        except Exception as e:
            print(f"  [erreur] {path.name}: {e}")
            skipped += 1

    print(f"Terminé: {accepted} acceptée(s), {review} à vérifier (review), {skipped} ignorée(s).")


if __name__ == "__main__":
    main()
