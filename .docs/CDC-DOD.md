# Cahier des charges (CDC) et Definition of Done (DOD)

**Projet :** Mathelin plomberie chauffage  
**Client / contexte :** Artisan plombier chauffagiste, zone locale (Pérouges, Meximieux, Ambérieu-en-Bugey, Lagnieu et environs).

---

## 1. Analyse et regroupement des besoins (doublons triés)

Les demandes ont été fusionnées et dédupliquées en deux livrables distincts :

| Livrable | Description |
|----------|-------------|
| **A. Page « en construction »** | Une seule page HTML statique, déployable sur Nginx (/var/www/html). |
| **B. Site complet Next.js** | Site vitrine complet déployable sur Vercel, avec API Géocompta. |

---

## 2. CDC – Cahier des charges

### 2.1 Livrable A – Page « en construction »

| Ref | Exigence | Détail |
|-----|----------|--------|
| A1 | Fichier unique | Un seul fichier HTML (pas de CSS/JS externes). |
| A2 | Design | Propre, professionnel, adapté mobile. |
| A3 | Performance | Chargement rapide, CSS inline. |
| A4 | SEO | Titre et meta description adaptés (plombier, villes). |
| A5 | Contenu – Titre | « Mathelin plomberie chauffage ». |
| A6 | Contenu – Sous-titre | « Plombier chauffagiste à Pérouges, Meximieux et Ambérieu ». |
| A7 | Contenu – Texte | Message « site en construction » + invitation à contacter pour toute intervention plomberie/chauffage. |
| A8 | CTA | Gros bouton « 📞 Appeler maintenant » + numéro de téléphone (placeholder modifiable). |
| A9 | Services | Liste courte : Débouchage canalisation, Réparation fuite, Chauffe-eau, Radiateurs, Robinetterie. |
| A10 | Pied de page | « Mathelin plomberie chauffage » + « Interventions : Pérouges – Meximieux – Ambérieu – Lagnieu ». |
| A11 | Couleurs | Bleu principal #1E40AF, accent orange #F97316, fond clair. |
| A12 | Déploiement | Fichier exploitable tel quel sur serveur Ubuntu (Nginx, /var/www/html). |

**Fichier livré :** `under-construction/index.html`

---

### 2.2 Livrable B – Site complet Next.js

| Ref | Exigence | Détail |
|-----|----------|--------|
| B1 | Stack | Next.js (App Router), Tailwind CSS, TypeScript. |
| B2 | Hébergement | Optimisé pour déploiement sur Vercel. |
| B3 | Objectifs métier | Générer des appels, permettre des demandes de devis rapides, afficher les services, les réalisations récentes et le contenu blog (externe). |
| B4 | Cible | Site simple, adapté à un artisan local. |

#### Design

| Ref | Exigence | Détail |
|-----|----------|--------|
| B5 | Polices | Poppins (titres), Inter (texte). |
| B6 | Couleurs | Bleu principal #1E40AF, bleu clair #3B82F6, accent orange #F97316, gris pour le texte. |

#### Page d’accueil – Contenu

| Ref | Bloc | Exigence |
|-----|------|----------|
| B7 | Hero | Titre : « Plombier chauffagiste à Pérouges, Meximieux et Ambérieu ». |
| B8 | Hero | Sous-titre : « Dépannage plomberie, chauffe-eau, radiateurs et débouchage canalisation ». |
| B9 | Hero | Boutons : « Appeler maintenant », « Estimer une intervention ». |
| B10 | Services | Cartes : Débouchage canalisation, Réparation fuite, Chauffe-eau, Radiateurs, Robinetterie. |
| B11 | Devis | Titre : « Estimer le prix d'une intervention ». |
| B12 | Devis | Champs : type d’intervention, urgence, ville. |
| B13 | Devis | Villes : Pérouges, Meximieux, Ambérieu, Lagnieu, Autre. |
| B14 | Devis | Affichage fourchette : « 90€ – 160€ ». |
| B15 | Devis | Bouton : « Recevoir un devis précis ». |
| B16 | Réalisations | Données depuis `GET /api/realisations` ; affichage : titre, ville, image, description. |
| B17 | Blog | Données depuis `GET /api/posts` ; affichage : titre, courte description, ville. |
| B18 | Contact | Formulaire : nom, téléphone, message + bouton d’appel. |

#### Composants réutilisables

| Ref | Composant | Rôle |
|-----|-----------|------|
| B19 | Header | En-tête et navigation. |
| B20 | Footer | Pied de page. |
| B21 | Hero | Bandeau d’accueil + CTA. |
| B22 | ServiceCard | Carte de service. |
| B23 | EstimateForm | Formulaire d’estimation. |
| B24 | ProjectGallery | Grille de réalisations. |
| B25 | BlogList | Liste d’articles. |
| B26 | ContactForm | Formulaire de contact + appel. |

#### SEO & technique

| Ref | Exigence | Détail |
|-----|----------|--------|
| B27 | SEO | Schéma LocalBusiness (type Plumber) pour le référencement local. |
| B28 | Qualité | Code propre, prêt pour mise en production sur Vercel. |

---

## 3. DOD – Definition of Done

### 3.1 Livrable A – Page « en construction »

- [ ] Un seul fichier `index.html` contenant tout le HTML et le CSS.
- [ ] Titre et meta description présents et cohérents avec l’activité et les villes.
- [ ] Affichage correct sur mobile (viewport, lisibilité, bouton d’appel visible).
- [ ] Texte « en construction » + liste de services + footer conformes au CDC.
- [ ] Couleurs #1E40AF et #F97316 utilisées comme défini.
- [ ] Lien `tel:` fonctionnel (numéro à remplacer par le vrai).
- [ ] Fichier déployable tel quel dans /var/www/html (Nginx).

### 3.2 Livrable B – Site Next.js

- [ ] Projet Next.js (App Router) avec Tailwind et TypeScript.
- [ ] Build sans erreur (`npm run build`) et déploiement Vercel possible.
- [ ] Tous les composants listés (Header, Footer, Hero, ServiceCard, EstimateForm, ProjectGallery, BlogList, ContactForm) implémentés et utilisés sur la page d’accueil.
- [ ] Hero, Services, Devis, Réalisations, Blog, Contact présents et conformes au CDC.
- [ ] Routes API internes `/api/realisations` et `/api/posts` qui consomment l’API externe (Géocompta) si `GEOCOMPTA_API_URL` est renseigné.
- [ ] Schéma JSON-LD LocalBusiness (Plumber) injecté dans la page.
- [ ] Polices Poppins (titres) et Inter (texte) configurées.
- [ ] Palette de couleurs (bleu #1E40AF, #3B82F6, orange #F97316, gris) appliquée.
- [ ] Configuration centralisée (ex. téléphone, URL) dans un fichier dédié (ex. `src/lib/config.ts`).
- [ ] Documentation minimale (README) pour install, build, déploiement et connexion API.

---

## 4. Récapitulatif des livrables

| Livrable | Fichiers / emplacement |
|----------|-------------------------|
| A. Page en construction | `under-construction/index.html` (à copier vers /var/www/html si besoin). |
| B. Site Next.js | Dépôt racine : `src/`, `package.json`, configuration Next/Tailwind, API routes, composants. |

---

*Document généré à partir des spécifications consolidées et dédupliquées du projet Mathelin plomberie chauffage.*
