# Conventions de développement — Site Mathelin

## Règle : modifs + commandes systématiques

**Désormais, après des modifications qui touchent le build ou le serveur de dev**, exécuter systématiquement les commandes suivantes (dans l’ordre) :

1. **Libérer le port 3001** (si un serveur tourne déjà)  
2. **Supprimer le cache Next.js** (dossier `.next`)  
3. **Relancer le serveur de dev** (`npm run dev`)

Cela limite les erreurs type **ChunkLoadError** (timeout sur `app/layout.js`) et garantit un chargement correct, y compris en navigation privée.

---

## Commandes à lancer (PowerShell, depuis la racine du projet)

```powershell
# 1. Libérer le port 3001
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

# 2. Supprimer le cache
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# 3. Démarrer le serveur (Turbopack, port 3001)
npm run dev
```

En une ligne (pour copier-coller) :

```powershell
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }; Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue; npm run dev
```

---

## Quand appliquer cette règle

- Après modification de `layout.tsx`, `next.config.js`, `package.json` (scripts ou deps)
- Après correction liée aux chunks / ChunkLoadError
- Quand le site en local ne se charge pas ou reste en timeout

---

## Rappels techniques

- **Port** : 3001 (éviter conflit avec un autre outil sur 3000)
- **Dev** : `npm run dev` utilise Turbopack (`--turbo`)
- **Layout** : Header, Footer, MobileCallButton sont chargés en `dynamic()` pour alléger le chunk layout
