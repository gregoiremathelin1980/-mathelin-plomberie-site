# Photos des conseils (terrain uniquement)

**Une photo par conseil**, liée au slug de l’article.

## Emplacement

```
public/images/conseils/{slug}/cover.webp
```

Exemple : `public/images/conseils/toilettes-bouchees/cover.jpg`

Formats acceptés pour `cover.*` : `.webp`, `.jpg`, `.jpeg`, `.png` (≥ 600 px de large recommandé).

## Alternative

Dans le frontmatter du `.md` :

```yaml
image: /images/conseils/toilettes-bouchees/cover.webp
```

Ou chemin NAS (servi via `PHOTO_BASE_URL`) :

```yaml
image: /CHANTIERS/2026/.../photo.jpg
```

## Affichage

Activer **« Afficher les images dans les conseils »** dans `/admin/site-settings` (`showAdviceImages: true`).

Sans photo réelle → pas d’image (politique zéro stock / Unsplash).

## Liste des 30 conseils (ordre de traitement)

1. adoucisseur-co2-sel
2. bruit-chauffe-eau
3. bruit-radiateur
4. desembouage-chauffage
5. detartrage-chauffe-eau
6. douche-bouchee
7. entretien-chauffe-eau
8. entretien-plomberie
9. equilibrage-radiateurs
10. evacuation-lente
11. eviter-evier-bouche
12. eviter-evier-bouche-meximieux
13. fuite-cachee
14. fuite-robinet
15. groupe-securite
16. isolation-tuyaux
17. mousseur-robinet
18. pas-eau-chaude
19. pression-eau-faible
20. protection-gel
21. purge-radiateur
22. radiateur-chauffe-mal-amberieu
23. radiateur-froid
24. recherche-fuite
25. remplacement-resistance
26. robinet-thermostatique
27. tartre-calcaire
28. toilettes-bouchees
29. tuyaux-qui-claquent
30. vidange-chauffe-eau
