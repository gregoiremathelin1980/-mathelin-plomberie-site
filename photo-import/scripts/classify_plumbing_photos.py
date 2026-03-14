#!/usr/bin/env python3
"""
Classification des photos de plomberie par catégorie (CLIP).

Lit les images dans: photo-import/optimized
Déplace chaque photo vers: public/images/<catégorie>

Catégories (détection par mots-clés CLIP):
  radiator -> radiateur
  faucet -> robinet
  sink -> evier
  water heater -> chauffe-eau
  pipes -> canalisation
  plumbing tools / bathroom -> chantier (générique)
  Si aucune correspondance claire -> chantier

Lancer depuis la racine du projet:
  python photo-import/scripts/classify_plumbing_photos.py
"""

import shutil
from pathlib import Path
from collections import defaultdict

try:
    import torch
    from PIL import Image
    import open_clip
except ImportError as e:
    print("Erreur: installez les dépendances avec:")
    print("  pip install torch pillow open-clip-torch")
    raise SystemExit(1) from e

# Chemins: script dans photo-import/scripts/, racine = parent de photo-import
SCRIPT_DIR = Path(__file__).resolve().parent
PHOTO_IMPORT_DIR = SCRIPT_DIR.parent
PROJECT_ROOT = PHOTO_IMPORT_DIR.parent
OPTIMIZED_DIR = PHOTO_IMPORT_DIR / "optimized"
PUBLIC_IMAGES = PROJECT_ROOT / "public" / "images"

# Mots-clés CLIP (anglais) et dossier cible
KEYWORDS = [
    "radiator",
    "faucet",
    "sink",
    "water heater",
    "pipes",
    "plumbing tools",
    "bathroom",
]
# Index 0->radiateur, 1->robinet, 2->evier, 3->chauffe-eau, 4->canalisation, 5 et 6->chantier
KEYWORD_TO_FOLDER = [
    "radiateur",
    "robinet",
    "evier",
    "chauffe-eau",
    "canalisation",
    "chantier",
    "chantier",
]

# Seuil de confiance sous lequel on met en "chantier"
CONFIDENCE_THRESHOLD = 0.2

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff", ".tif"}


def ensure_folders() -> None:
    """Crée les dossiers public/images/<catégorie> s'ils n'existent pas."""
    for folder in KEYWORD_TO_FOLDER:
        (PUBLIC_IMAGES / folder).mkdir(parents=True, exist_ok=True)


def load_model(device: str):
    """Charge le modèle CLIP (ViT-B-32, OpenAI)."""
    model, _, preprocess = open_clip.create_model_and_transforms(
        "ViT-B-32", pretrained="openai"
    )
    tokenizer = open_clip.get_tokenizer("ViT-B-32")
    model = model.to(device)
    model.eval()
    return model, preprocess, tokenizer


def classify_one_image(
    image_path: Path,
    model,
    preprocess,
    tokenizer,
    text_features,
    device: str,
) -> str:
    """
    Retourne le nom du dossier cible (radiateur, robinet, evier, etc.).
    """
    try:
        img = Image.open(image_path).convert("RGB")
    except Exception:
        return "chantier"
    img_tensor = preprocess(img).unsqueeze(0).to(device)
    with torch.no_grad():
        image_features = model.encode_image(img_tensor)
        image_features /= image_features.norm(dim=-1, keepdim=True)
        # Similarité (logits) avec chaque texte
        logits = (100.0 * image_features @ text_features.T).squeeze(0)
        probs = logits.softmax(dim=0).cpu()
    best_idx = int(probs.argmax().item())
    best_prob = float(probs[best_idx].item())
    if best_prob < CONFIDENCE_THRESHOLD:
        return "chantier"
    return KEYWORD_TO_FOLDER[best_idx]


def unique_dest(folder: Path, source_name: str) -> Path:
    """Retourne un chemin de destination unique (évite écrasement)."""
    dest = folder / source_name
    if not dest.exists():
        return dest
    stem = Path(source_name).stem
    suf = Path(source_name).suffix
    n = 1
    while dest.exists():
        dest = folder / f"{stem}_{n}{suf}"
        n += 1
    return dest


def main() -> None:
    ensure_folders()

    if not OPTIMIZED_DIR.exists():
        print(f"Dossier introuvable: {OPTIMIZED_DIR}")
        print("Lancez d'abord: python photo-import/scripts/optimize_images.py")
        return

    files = [
        f
        for f in OPTIMIZED_DIR.iterdir()
        if f.is_file() and f.suffix.lower() in IMAGE_EXTENSIONS
    ]
    if not files:
        print(f"Aucune image dans {OPTIMIZED_DIR}")
        return

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Chargement du modèle CLIP (device: {device})...")
    model, preprocess, tokenizer = load_model(device)

    # Embeddings des mots-clés (une fois pour toutes)
    text_tokens = tokenizer(KEYWORDS)
    with torch.no_grad():
        text_features = model.encode_text(text_tokens.to(device))
        text_features /= text_features.norm(dim=-1, keepdim=True)

    print(f"Classification de {len(files)} image(s)...")
    counts = defaultdict(int)

    for path in files:
        folder_name = classify_one_image(
            path, model, preprocess, tokenizer, text_features, device
        )
        dest_dir = PUBLIC_IMAGES / folder_name
        dest = unique_dest(dest_dir, path.name)
        shutil.move(str(path), str(dest))
        counts[folder_name] += 1

    print("\n--- Résumé ---")
    for name in ["radiateur", "robinet", "evier", "chauffe-eau", "canalisation", "chantier"]:
        print(f"  {name}: {counts[name]} photo(s)")
    print(f"  Total: {sum(counts.values())} photo(s)")


if __name__ == "__main__":
    main()
