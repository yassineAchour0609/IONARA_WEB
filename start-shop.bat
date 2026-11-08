@echo off
title IONARA STORE - Lancement du Site
color 0D
echo ===================================================
echo     IONARA STORE - LANCEMENT DU SITE OFFICIEL
echo     Boutique : http://localhost:3000
echo     Backend  : http://localhost:5000 (API & Base)
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/3] Demarrage de l'API Backend Node.js...
start "IONARA Backend API" cmd /k "cd /d "%~dp0backend" && node server.js"

timeout /t 1 /nobreak >nul

echo [2/3] Demarrage de la Boutique Web IONARA...
start "IONARA Web Shop" cmd /k "cd /d "%~dp0" && node serve.js"

timeout /t 2 /nobreak >nul

echo [3/3] Ouverture automatique de la boutique...
start http://localhost:3000

echo.
echo ===================================================
echo   IONARA STORE EST EN LIGNE !
echo   Visitez : http://localhost:3000
echo ===================================================
echo.
pause
