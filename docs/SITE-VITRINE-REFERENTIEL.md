# Référentiel site vitrine (SEO, perf, maintenance)

Document de référence pour le développement et le contenu. À faire évoluer avec l’activité réelle.

## Objectif global

Optimiser le site vitrine pour :

- SEO Google durable  
- compréhension par moteurs IA (LLM)  
- SEO local (recherches géographiques)  
- performance mobile réelle  
- structure maintenable long terme  

Le site doit refléter l’activité réelle, éviter le contenu artificiel, la duplication massive, la sur-optimisation fragile, et rester simple à maintenir.

Le contenu doit aider un client réel à comprendre :

- quel problème est résolu  
- où le service est proposé  
- comment l’intervention se déroule  
- dans quels cas contacter  

## Structure des pages

Respecter la structure existante du dépôt. Ne pas refondre inutilement les routes déjà en place.

Exemples actuels possibles :

- `/services/[slug]`  
- `/depannage/[slug]`  
- `/realisations/[slug]`  
- `/conseils/[slug]`  

Si des routes du type `/villes/[ville]` ou `/interventions/[slug]` existent ou sont prévues, les traiter comme cible progressive ou équivalent actuel (ex. pages locales existantes).

Éviter la duplication de routes similaires. Ne pas créer `/travaux` si `/depannage` couvre déjà le besoin sémantique.

## Contenu SEO utile (priorité haute)

Chaque page doit expliquer clairement :

- le problème rencontré  
- le contexte client réel  
- la solution apportée  
- le résultat concret  
- dans quels cas contacter  

Structure recommandée : introduction claire, situation typique, solution proposée, cas concrets possibles, zone d’intervention.

Longueur indicative : **300 à 900 mots**. La qualité et l’utilité priment sur la longueur.

Titres : un `h1` pertinent par page, `h2` / `h3` pour structurer (accessibilité + compréhension sémantique).

## SEO local

Créer des pages locales uniquement si :

- zone réellement desservie  
- contenu différenciable  
- utilité réelle pour l’utilisateur  

Limiter la génération massive automatique de pages villes. Éviter la duplication simple avec le nom de ville remplacé. Pages locales crédibles et réalistes.

## Données structurées JSON-LD

Implémenter uniquement les schémas réellement utiles :

- **LocalBusiness** : défini **une seule fois** comme entité principale (homepage via `RootLayout` / composant dédié), avec `@id` stable `${SITE_URL}/#localbusiness`.  
- **Service** : pages services principales.  
- **BreadcrumbList** : navigation.  
- **FAQPage** : uniquement si une FAQ réellement utile est affichée.  

Les données structurées doivent refléter le contenu visible. Ne pas multiplier les schémas artificiels.

**Avis / notes** : n’émettre `AggregateRating` / `Review` en JSON-LD que si les avis correspondants sont **visibles** sur la page (même entité `@id` que le LocalBusiness principal, sans dupliquer NAP).

**ImageObject** : uniquement pour des images importantes si pertinent ; sinon `og:image` suffit.

**WebSite + SearchAction** : uniquement si une recherche interne utile existe ; sinon ne pas l’ajouter.

## FAQ

FAQ utiles répondant à de vraies questions clients : délais d’intervention, zone desservie, type de panne, tarif indicatif, prise de rendez-vous. Le schéma FAQPage aide la compréhension sémantique même sans affichage enrichi garanti.

## Performance réaliste

Objectif : site rapide et fluide sur mobile standard.

Bonnes pratiques : images dimensionnées correctement, formats modernes (WebP ou AVIF), lazy loading hors écran, limiter le JS inutile, précharger la police principale si elle est critique.

LCP optimisé surtout sur l’image principale visible immédiatement et le texte visible immédiatement. Les images critiques peuvent dépasser 200 ko si nécessaire pour la qualité.

## Next.js

ISR recommandé : `revalidate: 3600` sur les pages publiques concernées. Éviter le rendu dynamique inutile.

## Core Web Vitals (cibles réalistes)

- LCP &lt; 2,5 s  
- CLS &lt; 0,1  
- INP &lt; 250 ms  

Un score Lighthouse élevé est souhaitable mais **non bloquant** pour la mise en production si le site est rapide en conditions réelles, le contenu est utile et la navigation est fluide. Prioriser les **données terrain** (Search Console, CWV réels).

## Mesure et objectifs business

Ne pas confondre score d’outil et résultat : suivre aussi appels, formulaires ou prises de rendez-vous selon votre activité.

## Maillage interne

Liens naturels entre services associés, réalisations liées, zones d’intervention, contenus conseils pertinents. Le maillage doit aider l’utilisateur avant d’aider le SEO. Éviter la sur-optimisation artificielle.

## URL canoniques et migrations

- Chaque page publique indexable doit avoir une **URL canonique** cohérente avec son chemin (via `buildPageMetadata` ou équivalent).  
- Ne pas définir la même canonique « accueil » pour tout le site depuis le layout racine.  
- En cas de changement d’URL : redirections **301** et mise à jour des liens internes.

## Sitemap

Inclure uniquement les pages publiques utiles. Exclure `/api`, `/admin` et pages techniques. Mise à jour automatique. Quand une date de publication / mise à jour existe dans le contenu (ISO ou parseable), l’utiliser pour `lastModified`.

## robots.txt

Autoriser l’indexation des pages publiques. Bloquer `/api` et `/admin`.

## Open Graph

Chaque page : titre clair, description concise, image principale cohérente (partage réseaux).

## Mobile first

Texte lisible sans zoom, espacement suffisant, boutons faciles à utiliser, images adaptées, menu simple.

## Google Business Profile

Cohérence entre site et fiche : nom d’activité, description des services, zones desservies, **même numéro de téléphone** partout quand c’est possible.

## Légal (France)

Mentions légales et politique de confidentialité accessibles (souvent footer), alignées sur les formulaires et le traitement des données.

## Interdictions

Ne pas implémenter : texte caché, contenu dupliqué massif, pages générées automatiquement sans valeur, keyword stuffing, cloaking. Éviter les stratégies SEO artificielles fragiles.

## Objectif final

Un site rapide, clair, crédible, compréhensible par Google et par l’IA, utile pour le client réel, maintenable sans effort excessif, évolutif avec l’activité réelle.

## Fichiers de configuration

- `content/settings/site.json` : paramètres éditoriaux (dont `company`, cohérent avec la fiche Google).  
- `site-data/site-settings.json` : surcharge affichage / entreprise / téléphone (priorité fusion côté `getSiteSettings`). Voir `site-data/site-settings.example.json` pour un modèle.
