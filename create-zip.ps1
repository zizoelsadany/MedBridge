# PowerShell Script to Zip Med Bridge+ project
$sourceDir = Get-Location
$destinationZip = Join-Path -Path $sourceDir -ChildPath "Med_Bridge_Plus.zip"

Write-Host "Compressing Med Bridge+ project..." -ForegroundColor Cyan

If (Test-Path $destinationZip) {
    Remove-Item $destinationZip -Force
}

$excludeItems = @(".next", "node_modules", "Med_Bridge_Plus.zip", ".git")
Get-ChildItem -Path $sourceDir | Where-Object { $excludeItems -notcontains $_.Name } | Compress-Archive -DestinationPath $destinationZip -Force

Write-Host "Med Bridge+ Project compressed successfully to Med_Bridge_Plus.zip!" -ForegroundColor Green
