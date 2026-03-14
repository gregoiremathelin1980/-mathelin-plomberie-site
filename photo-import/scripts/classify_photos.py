#!/usr/bin/env python3
"""
Classification des photos par mot-clé dans le nom du fichier.
Lit photo-import/optimized, copie vers public/images/conseils/<catégorie>.

Lancer depuis la racine du projet:
  python photo-import/scripts/classify_photos.py
"""

import os
import shutil

INPUT = "photo-import/optimized"
OUTPUT = "public/images/conseils"

categories = {
    "radiateur": ["radiateur", "radiator"],
    "evier": ["evier", "sink"],
    "robinet": ["robinet", "faucet"],
    "chauffe-eau": ["chauffe", "ballon", "water"],
    "canalisation": ["tuyau", "pipe"],
}

default_category = "chantier"

# créer dossiers
for cat in list(categories.keys()) + [default_category]:
    os.makedirs(os.path.join(OUTPUT, cat), exist_ok=True)

def detect_category(filename):
    name = filename.lower()

    for cat, keywords in categories.items():
        for word in keywords:
            if word in name:
                return cat

    return default_category

for file in os.listdir(INPUT):

    src = os.path.join(INPUT, file)

    if not os.path.isfile(src):
        continue

    category = detect_category(file)

    dst = os.path.join(OUTPUT, category, file)

    shutil.copy(src, dst)

print("Classification terminée")
