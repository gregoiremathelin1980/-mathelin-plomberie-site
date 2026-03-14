# Analyse du prompt « production-ready » vs existant

**Référence :** Site type SABEKO, 15 km autour de Pérouges, adresse, shadcn/ui, GeoCompta.

---

## 1. Éléments nouveaux par rapport à l’existant

| # | Exigence | Existant | Action |
|---|----------|----------|--------|
| 1 | **Adresse** 57 impasse des Verchères, Pérouges, France | Absent | Ajout dans config, footer, schéma LocalBusiness |
| 2 | **Rayon 15 km** + villes Leyment, Bourg-Saint-Christophe | Liste partielle | Liste complète dans config + section zone |
| 3 | **shadcn/ui** | Tailwind seul | Init shadcn, composants ui (Button, Card, Input, etc.) |
| 4 | **Routes** /devis, /realisations (au lieu de /estimate, /projects) | /estimate, /projects | Créer /devis, /realisations + redirections ou remplacement |
| 5 | **Ordre nav** Accueil, Services, Réalisations, Devis, Contact | Blog en plus | Aligner ordre, Blog en footer ou secondaire |
| 6 | **Templates** ArticleTemplate, RealisationTemplate, ServiceTemplate | Absents | Créer dans /templates |
| 7 | **Dynamique** /blog/[slug], /realisations/[slug] | [slug] seulement pour services | Ajouter blog/[slug], realisations/[slug] |
| 8 | **Réalisations** chaque job = page avec images, description, CTA | Liste seule | Page détail avec RealisationTemplate, données API (slug) |
| 9 | **Blog** carte avec **date** | Pas de date | Champ date (PostItem + BlogCard) |
| 10 | **Devis** libellé « Estimation indicative : 90€ – 160€ » + villes Saint-Vulbas, etc. | Autre libellé, villes partielles | Mise à jour formulaire + liste villes |
| 11 | **Sitemap** généré automatiquement | Absent | app/sitemap.ts |
| 12 | **SEO** plombier Saint-Vulbas | Déjà plombier Pérouges/Meximieux/Ambérieu | Ajout Saint-Vulbas dans metadata/keywords |
| 13 | **Lead management** formulaires prêts pour GeoCompta (devis, info, urgence) | Formulaires basiques | data attributes / name pour branchement API |

---

## 2. Structure cible (prompt)

```
/app
  layout.tsx, page.tsx
  /services/page.tsx
  /devis/page.tsx
  /realisations/page.tsx
  /blog/page.tsx
  /contact/page.tsx
  /blog/[slug]/page.tsx
  /realisations/[slug]/page.tsx

/components
  Header, Footer, Hero, ServiceCard, EstimateForm, ProjectCard, BlogCard, ContactForm

/templates
  ArticleTemplate, RealisationTemplate, ServiceTemplate
```

---

## 3. Doublons (déjà couverts)

- Hero (titre, sous-titre, CTA, indicateurs de confiance)
- Services (5 cartes avec icônes, liens)
- Formulaire devis (type, urgence, ville, fourchette, disclaimer)
- Réalisations (API, cartes image/titre/ville/description)
- Blog (API, cartes avec image/titre/excerpt/ville)
- Zone d’intervention
- Contact (nom, tél, message, bouton appel)
- LocalBusiness (étendu avec adresse postale)
- Polices Poppins/Inter, palette de couleurs

---

## 4. Implémentation prévue

- Config : `SITE_ADDRESS`, `CITIES_15KM`, export des villes pour formulaire et zone.
- shadcn : init + composants utilisés dans les formulaires et cartes.
- Routes : pages /devis et /realisations ; redirection /estimate → /devis, /projects → /realisations.
- Templates : wrappers de mise en page pour article, réalisation, fiche service.
- Dynamique : blog/[slug] et realisations/[slug] avec données API (slug, titre, images, description, CTA).
- Sitemap : `app/sitemap.ts` avec URLs statiques + réalisations et articles si disponibles.
- Schema : adresse postale dans LocalBusiness.
