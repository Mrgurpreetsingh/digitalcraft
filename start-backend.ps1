Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DigitalCraft Backend - Demarrage" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location backend

Write-Host "[1/3] Installation des dependances..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "[2/3] Verification de la base de donnees..." -ForegroundColor Yellow
Write-Host "(Assurez-vous que MySQL est demarre)" -ForegroundColor Gray

Write-Host ""
Write-Host "[3/3] Demarrage du serveur backend..." -ForegroundColor Yellow
Write-Host "Serveur accessible sur: http://localhost:5000" -ForegroundColor Green
Write-Host "API Health Check: http://localhost:5000/api/health" -ForegroundColor Green
Write-Host ""

npm run dev 