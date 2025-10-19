# Quick Cleanup - Remove the biggest space consumers

Write-Host "=== Quick Cleanup Starting ===" -ForegroundColor Cyan
Write-Host ""

$projectPath = Get-Location

# 1. Remove log files
Write-Host "Removing Java crash logs..." -ForegroundColor Yellow
$removed = 0
Get-ChildItem -Path . -Filter "hs_err_pid*.log" -File | ForEach-Object {
    Remove-Item $_.FullName -Force
    $removed++
}
Get-ChildItem -Path . -Filter "replay_pid*.log" -File | ForEach-Object {
    Remove-Item $_.FullName -Force
    $removed++
}
Write-Host "  ✓ Removed $removed log files" -ForegroundColor Green

# 2. Remove backend target
Write-Host "Removing backend/target..." -ForegroundColor Yellow
if (Test-Path "backend\target") {
    Remove-Item "backend\target" -Recurse -Force
    Write-Host "  ✓ Removed backend/target" -ForegroundColor Green
} else {
    Write-Host "  - Already clean" -ForegroundColor Gray
}

# 3. Info about node_modules
Write-Host ""
Write-Host "=== Frontend Dependencies ===" -ForegroundColor Cyan
if (Test-Path "frontend\node_modules") {
    Write-Host "frontend/node_modules exists (usually 150-400 MB)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To remove it and save space:"
    Write-Host "  Remove-Item frontend\node_modules -Recurse -Force" -ForegroundColor Gray
    Write-Host ""
    Write-Host "To restore later:"
    Write-Host "  cd frontend" -ForegroundColor Gray
    Write-Host "  npm install" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✓ Quick cleanup complete!" -ForegroundColor Green
