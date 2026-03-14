@echo off
title Déploiement site Mathelin
cd /d "%~dp0"

echo Déploiement du site — commit et push vers le dépôt Git.
echo Le push déclenche le déploiement automatique sur Vercel.
echo.

git add .
git commit -m "Nouvelle intervention plomberie"
git push

echo.
echo Terminé. Si tout s'est bien passé, Vercel va déployer le site.
pause
