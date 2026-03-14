#!/usr/bin/env python3
"""
Supprime les doublons dans photo-import/optimized (même contenu = un seul conservé).

À lancer quand on veut ne garder qu'une copie de chaque photo :
  python photo-import/scripts/deduplicate_optimized.py

Conserve la première occurrence de chaque fichier (par hash MD5), supprime les autres.
"""

import hashlib
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PHOTO_IMPORT_DIR = SCRIPT_DIR.parent
OPTIMIZED_DIR = PHOTO_IMPORT_DIR / "optimized"

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff", ".tif"}


def file_hash(path: Path, chunk_size: int = 8192) -> str:
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(chunk_size), b""):
            h.update(chunk)
    return h.hexdigest()


def main() -> None:
    if not OPTIMIZED_DIR.exists():
        print(f"Dossier introuvable: {OPTIMIZED_DIR}")
        return

    files = [
        f
        for f in OPTIMIZED_DIR.iterdir()
        if f.is_file() and f.suffix.lower() in IMAGE_EXTENSIONS
    ]
    if not files:
        print(f"Aucune image dans {OPTIMIZED_DIR}")
        return

    print(f"Scan de {len(files)} fichier(s) dans {OPTIMIZED_DIR}...")
    seen = {}
    removed = 0
    for path in files:
        h = file_hash(path)
        if h in seen:
            path.unlink()
            removed += 1
        else:
            seen[h] = path

    print(f"Terminé: {removed} doublon(s) supprimé(s), {len(seen)} photo(s) conservée(s).")


if __name__ == "__main__":
    main()
