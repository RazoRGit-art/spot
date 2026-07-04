@echo off
rem Lanceur Toulouse Car Spot Finder : demarre un petit serveur local et ouvre l'appli.
cd /d "%~dp0"

where python >nul 2>nul
if errorlevel 1 (
  echo.
  echo Python est introuvable. Installe-le depuis https://www.python.org/downloads/
  echo en cochant "Add Python to PATH", puis relance ce fichier.
  echo.
  pause
  exit /b 1
)

echo Demarrage du serveur sur http://localhost:8000 ...
start "SpotPhoto - serveur (garde cette fenetre ouverte)" python -m http.server 8000
rem petite pause le temps que le serveur demarre
ping -n 2 127.0.0.1 >nul
start "" "http://localhost:8000/app.html"

echo.
echo L'appli s'ouvre dans ton navigateur.
echo Pour l'arreter : ferme la fenetre "SpotPhoto - serveur".
