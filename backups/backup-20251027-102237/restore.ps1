# Quick Restore Script
param([string]$BackupPath)

if (-not $BackupPath) {
    Write-Host "Available backups:" -ForegroundColor Yellow
    Get-ChildItem -Path "backups" -Directory | Sort-Object LastWriteTime -Descending | Select-Object -First 5 Name,LastWriteTime
    $BackupPath = Read-Host "`nEnter backup folder name to restore"
}

$fullPath = "backups/$BackupPath"
if (Test-Path $fullPath) {
    Write-Host "Restoring from $BackupPath..." -ForegroundColor Green
    
    Copy-Item "$fullPath/index.html" "index.html" -Force
    Copy-Item "$fullPath/css/style.css" "css/style.css" -Force
    Copy-Item "$fullPath/js/script.js" "js/script.js" -Force
    if (Test-Path "$fullPath/assets") {
        Copy-Item "$fullPath/assets" "assets" -Recurse -Force
    }
    
    Write-Host "✅ Restoration complete!" -ForegroundColor Green
} else {
    Write-Host "Backup not found: $BackupPath" -ForegroundColor Red
}
