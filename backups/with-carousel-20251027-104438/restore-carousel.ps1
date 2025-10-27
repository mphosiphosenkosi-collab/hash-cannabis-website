# HASH Website Restore Script - Carousel Version
param()

Write-Host "Restoring HASH Website with Carousel..." -ForegroundColor Green

$backupFiles = @(
    "index.html",
    "css/style.css",
    "js/script.js"
)

foreach ($file in $backupFiles) {
    if (Test-Path "$PSScriptRoot/$file") {
        Copy-Item "$PSScriptRoot/$file" "$file" -Force
        Write-Host "  Restored: $file" -ForegroundColor Green
    }
}

if (Test-Path "$PSScriptRoot/assets") {
    if (Test-Path "assets") {
        Remove-Item "assets" -Recurse -Force
    }
    Copy-Item "$PSScriptRoot/assets" "assets" -Recurse -Force
    Write-Host "  Restored: assets/" -ForegroundColor Green
}

Write-Host "
✅ Restoration Complete!" -ForegroundColor Green
Write-Host "The website with carousel section has been restored." -ForegroundColor Yellow
Write-Host "Open index.html to view the updated site." -ForegroundColor Cyan
