# Comparaison des spécifications – Doublons et écarts

**Projet :** Mathelin plomberie chauffage  
**Objectif :** Aligner le site existant avec la consigne « complete modern website » et repérer les doublons entre anciennes et nouvelles spécifications.

---

## 1. Ce qui existait déjà (avant consigne)

| Élément | État initial |
|--------|--------------|
| Stack | Next.js App Router, Tailwind, TypeScript |
| Polices | Poppins (titres), Inter (texte) |
| Couleurs | Primary #1E40AF, primary-light #3B82F6, accent #F97316, gray-text #6B7280 |
| Page unique | Accueil avec sections : Hero, Services, Devis, Réalisations, Blog, Zone, Contact |
| Composants | Header, Footer, Hero, ServiceCard, EstimateForm, ProjectGallery, BlogList, ContactForm |
| API | /api/realisations, /api/posts (proxy Géocompta) |
| SEO | Metadata + LocalBusiness (Plumber) |
| Navigation | Ancres #services, #devis, #realisations, #contact |

---

## 2. Doublons (spécifications répétées)

Les éléments suivants apparaissent à la fois dans l’ancienne spec et la nouvelle, sans changement de fond :

| Ref | Exigence | Ancienne spec | Nouvelle spec | Action |
|-----|----------|----------------|----------------|--------|
| D1 | Titre Hero | « Plombier chauffagiste à Pérouges, Meximieux et Ambérieu » | Identique | Conserver, améliorer visuel |
| D2 | Sous-titre Hero | « Dépannage plomberie, chauffe-eau, radiateurs, débouchage canalisation » | + « et » avant « débouchage » | Ajuster texte |
| D3 | CTA Hero | Appeler maintenant + Estimer une intervention | Identique | Conserver, renforcer visuel |
| D4 | Liste services | 5 services (débouchage, fuite, chauffe-eau, radiateurs, robinetterie) | Identique | Conserver + icônes + liens pages |
| D5 | Formulaire devis | Type, urgence, ville | Identique | Conserver + villes « Ambérieu-en-Bugey », « Autre commune » + disclaimer |
| D6 | Fourchette prix | 90€ – 160€ | Identique | Conserver |
| D7 | Réalisations | API /api/realisations, titre, ville, image, description | Identique | Conserver + composant ProjectCard |
| D8 | Blog | API /api/posts, titre, courte description, ville | + image, excerpt | Ajouter image + BlogCard |
| D9 | Zone intervention | Liste de villes | Même liste + Villieu-Loyes-Mollon, Blyes, Saint-Vulbas | Déjà complète, section plus visuelle |
| D10 | Contact | Nom, téléphone, message + bouton appel | Identique | Conserver, design « carte » |
| D11 | SEO | plombier Pérouges / Meximieux / Ambérieu, LocalBusiness | Identique | Conserver |

**Conclusion doublons :** Pas de contradiction. La nouvelle spec précise surtout le rendu (UI pro, icônes, cartes, pages dédiées) et quelques libellés (villes, disclaimer).

---

## 3. Écarts / ajouts par rapport à l’existant

| Ref | Nouvelle exigence | Existant | Action |
|-----|-------------------|----------|--------|
| E1 | **Lucide icons** | Aucune librairie d’icônes | Ajouter `lucide-react`, utiliser dans ServiceCard, trust, etc. |
| E2 | **Hero avec image de fond** | Dégradé bleu uniquement | Ajouter image de fond (plomberie) + overlay |
| E3 | **Trust indicators** | Aucun | Ajouter : Intervention rapide, Artisan local, Devis rapide |
| E4 | **Pages dédiées** | Une seule page (ancres) | Créer : /services, /estimate, /projects, /blog, /contact |
| E5 | **Service cards → pages détail** | Cartes sans lien | Lien vers /services/[slug] par service |
| E6 | **Villes devis** | Ambérieu, Autre | Remplacer par « Ambérieu-en-Bugey », « Autre commune » |
| E7 | **Disclaimer devis** | Texte court | Ajouter : « Le prix exact dépend du diagnostic sur place. » |
| E8 | **ProjectCard** | Contenu dans ProjectGallery | Extraire composant ProjectCard (image, titre, ville, description) |
| E9 | **BlogCard + image** | BlogList sans image | Composant BlogCard avec image, titre, excerpt, ville |
| E10 | **Zone intervention visuelle** | Liste simple | Section plus visuelle (cartes ou badges) |
| E11 | **Design « pro »** | Cartes basiques | Cartes avec icônes, hiérarchie, espacement, style type site pro |
| E12 | **Navigation** | Ancres | Liens vers /services, /estimate, /projects, /blog, /contact |
| E13 | **PostItem image** | shortDescription, city, slug | Ajouter champ `image` (optionnel) pour blog |

---

## 4. Synthèse des actions

- **Réutiliser sans conflit :** contenu texte (titres, sous-titres, listes), couleurs, polices, API, schéma SEO, structure des données.
- **Enrichir :** Hero (image + trust), ServiceCard (icône + lien), EstimateForm (villes + disclaimer), ProjectGallery → ProjectCard, BlogList → BlogCard avec image, Contact en « carte », Zone en section visuelle.
- **Ajouter :** lucide-react, pages /services, /estimate, /projects, /blog, /contact, pages détail /services/[slug], composants ProjectCard et BlogCard.

---

*Document de comparaison – Mathelin plomberie chauffage.*
