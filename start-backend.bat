@echo off
echo ========================================
echo   DigitalCraft Backend - Demarrage
echo ========================================
echo.

cd backend

echo [1/3] Installation des dependances...
call npm install

echo.
echo [2/3] Verification de la base de donnees...
echo (Assurez-vous que MySQL est demarre)

echo.
echo [3/3] Demarrage du serveur backend...
echo Serveur accessible sur: http://localhost:5000
echo API Health Check: http://localhost:5000/api/health
echo.

call npm run dev

pause 