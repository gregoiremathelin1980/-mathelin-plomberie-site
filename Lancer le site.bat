@echo off
title Site Mathelin - Serveur
cd /d "%~dp0"

echo Demarrage du site Mathelin sur http://localhost:3001
echo.

REM Verifier que npm est disponible (souvent absent du PATH en double-clic)
where npm >nul 2>&1
if errorlevel 1 (
    echo ERREUR: "npm" introuvable. Ouvrez ce dossier dans un terminal
    echo et lancez "npm run dev", ou installez Node.js et relancez.
    echo.
    pause
    exit /b 1
)

REM Ouvrir le navigateur par defaut apres ~8 secondes (le temps que le serveur demarre)
start "" cmd /c "timeout /t 8 /nobreak >nul && start http://localhost:3001"

REM Lancer npm dans un sous-processus pour que la fenetre reste ouverte en cas d'erreur
cmd /c "npm run dev"

echo.
echo ========================================
echo Lisez le message d'erreur ci-dessus.
echo La fenetre restera ouverte 15 secondes,
echo puis appuyez sur une touche pour fermer.
echo ========================================
timeout /t 15
pause
