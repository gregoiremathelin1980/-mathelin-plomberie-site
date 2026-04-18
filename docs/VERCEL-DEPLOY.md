# Déployer le site sur Vercel

## 1. Créer le projet

1. Va sur [vercel.com](https://vercel.com), connecte-toi (souvent avec GitHub / GitLab / Bitbucket).
2. **Add New… → Project** → choisis le dépôt du site (ex. *mathelin-plomberie-site*).
3. **Framework Preset** : Next.js (détecté tout seul en général).
4. **Root Directory** : laisse la racine du repo (sauf si le site est dans un sous-dossier).
5. **Build Command** : `npm run build` (défaut).
6. **Install Command** : `npm install` (défaut).
7. **Output** : laissé automatique pour Next.js.

Valide le premier déploiement (même sans toutes les variables : le build peut passer ; certaines fonctions seront vides ou désactivées).

---

## 2. Variables d’environnement

**Settings → Environment Variables**

### Exemple sync avis ~30 min (GéoCompta)

| Valeur | Variable |
|--------|----------|
| `1800` | `GEOCOMPTA_HOME_REVALIDATE_SECONDS` |
| `900` | `GEOCOMPTA_REVIEWS_CACHE_SECONDS` |

### Tableau complet

| Variable | Environnements | Rôle |
|----------|----------------|------|
| `GEOCOMPTA_API_BASE_URL` | Production (+ Preview si tu testes l’API) | URL de l’API GéoCompta **sans** `/` final. Active le mode « tout passe par GéoCompta » (homepage, avis, etc.). |
| `GEOCOMPTA_API_KEY` | Idem | Optionnel : `Bearer` si l’API est protégée. |
| `GEOCOMPTA_IMAGE_HOSTS` | Production, Preview, Development | Hôtes images GéoCompta, **séparés par des virgules** (ex. `media.geocompta.fr`). Lu par **`next.config.js` au build** : après ajout ou changement → **Redeploy** obligatoire. |
| `GEOCOMPTA_HOME_REVALIDATE_SECONDS` | Prod (optionnel) | Défaut **1800** si absent. ISR page `/` + cache `homepage` GéoCompta. |
| `GEOCOMPTA_REVIEWS_CACHE_SECONDS` | Prod (optionnel) | Défaut **900**. Cache du pool `GET /api/public/reviews`. |
| `GEOCOMPTA_HOME_REVIEWS_DISPLAY_COUNT` | Prod (optionnel) | Défaut **6** avis affichés sur l’accueil. |
| `ADMIN_PASSWORD` | Production (et Preview si tu utilises `/admin` en preview) | Mot de passe de la zone **/admin**. Sans ça, le login admin renvoie une erreur. |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Production (+ Preview) | Clé Web3Forms pour le **formulaire de contact** (`NEXT_PUBLIC_` = exposé au navigateur ; normal pour ce service). |
| `PHOTO_BASE_URL` | Si besoin | Optionnel : base URL des photos si différent du défaut. |
| `SITE_DATA_DIR` | Rare sur Vercel | Optionnel : chemin absolu vers un dossier `site-data` externe. En général **non utilisé** : le repo contient déjà `site-data/`. |

### Bonnes pratiques

- Coche **Production** pour le site public ; **Preview** pour les branches / PR si tu veux les mêmes clés.
- Ne mets **jamais** `ADMIN_PASSWORD` ni `GEOCOMPTA_API_KEY` en `NEXT_PUBLIC_*`.

---

## 3. Après changement de `GEOCOMPTA_IMAGE_HOSTS`

`next.config.js` n’intègre les domaines `images.remotePatterns` **qu’au build**.

→ **Deployments → …** sur le dernier déploiement → **Redeploy** (sans changer le code si besoin).

---

## 4. Domaine

**Settings → Domains** : ajoute `mathelin-plomberie.fr` (et `www` si tu l’utilises).

Suis les **DNS** indiqués par Vercel (souvent un enregistrement **A** ou **CNAME** chez ton registrar).

Le **`middleware.ts`** du projet gère aussi des domaines satellites : rien de spécifique Vercel ; c’est côté DNS + même projet ou autre selon ton choix.

---

## 5. Vérifications rapides post-déploiement

- Page d’accueil, **contact** (soumission du formulaire), **`/admin`** (login).
- Si GéoCompta est configuré : bloc **avis**, **interventions**, images **`next/image`** depuis le host GéoCompta (sinon erreur 400 sur les images → vérifie `GEOCOMPTA_IMAGE_HOSTS` + **redeploy**).

---

## 6. Déploiements automatiques

Dès que le dépôt est lié, chaque **push** sur la branche de production (souvent `main`) déclenche un build. Les **PR** créent des **Preview URLs**.

---

## Voir aussi

- Intégration API et cache avis : **`docs/GEOCOMPTA-API.md`**
- Cadrage agents / prompt GéoCompta : **`docs/GEOCOMPTA-CURSOR.md`**
