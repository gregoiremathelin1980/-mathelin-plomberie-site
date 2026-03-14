#!/usr/bin/env python3
"""
Optimisation des photos filtrées pour le site web.

À lancer après le filtrage et la vérification manuelle de photo-import/review:
  python photo-import/scripts/optimize_images.py

Lit les images dans: photo-import/filtered
Enregistre les JPEG optimisés dans: photo-import/optimized

Réglages:
  - Largeur max: 1600 px (ratio conservé)
  - Format: JPEG, qualité 80
"""

import os
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Erreur: installez Pillow avec: pip install Pillow")
    raise SystemExit(1)

SCRIPT_DIR = Path(__file__).resolve().parent
PHOTO_IMPORT_DIR = SCRIPT_DIR.parent
FILTERED_DIR = PHOTO_IMPORT_DIR / "filtered"
OPTIMIZED_DIR = PHOTO_IMPORT_DIR / "optimized"

MAX_WIDTH = 1600
JPEG_QUALITY = 80

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff", ".tif"}


def optimize_image(source: Path, dest_dir: Path) -> bool:
    """
    Redimensionne (max 1600 px de large), convertit en JPEG, enregistre dans dest_dir.
    Retourne True en cas de succès.
    """
    try:
        with Image.open(source) as img:
            # Convertir en RGB si nécessaire (palette, RGBA, etc.)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            elif img.mode != "RGB":
                img = img.convert("RGB")

            w, h = img.size
            if w > MAX_WIDTH:
                new_h = int(h * MAX_WIDTH / w)
                img = img.resize((MAX_WIDTH, new_h), Image.Resampling.LANCZOS)

            dest_name = source.stem + ".jpg"
            dest = dest_dir / dest_name
            if dest.exists():
                n = 1
                while dest.exists():
                    dest = dest_dir / f"{source.stem}_{n}.jpg"
                    n += 1

            img.save(dest, "JPEG", quality=JPEG_QUALITY, optimize=True)
            return True
    except Exception as e:
        print(f"  [erreur] {source.name}: {e}")
        return False


def main() -> None:
    FILTERED_DIR.mkdir(parents=True, exist_ok=True)
    OPTIMIZED_DIR.mkdir(parents=True, exist_ok=True)

    if not FILTERED_DIR.exists():
        print(f"Dossier introuvable: {FILTERED_DIR}")
        print("Lancez d'abord: python photo-import/scripts/filter_photos.py")
        return

    files = [
        f for f in FILTERED_DIR.iterdir()
        if f.is_file() and f.suffix.lower() in IMAGE_EXTENSIONS
    ]

    if not files:
        print(f"Aucune image dans {FILTERED_DIR}")
        return

    print(f"Optimisation de {len(files)} image(s) -> {OPTIMIZED_DIR}")
    print(f"  Max largeur: {MAX_WIDTH} px, JPEG qualité: {JPEG_QUALITY}")
    print()

    ok = 0
    for path in files:
        if optimize_image(path, OPTIMIZED_DIR):
            ok += 1

    print(f"Terminé: {ok}/{len(files)} image(s) enregistrée(s) dans {OPTIMIZED_DIR}")


if __name__ == "__main__":
    main()
