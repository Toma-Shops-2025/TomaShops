# One-time keystore generator for TomaShops AAB signing.
# Run this ONCE. Back up the resulting .jks file and the password somewhere safe.
# If you lose it, Google Play will NOT let you publish updates to the same app.

$ErrorActionPreference = "Stop"

$KeystorePath = "android\app\tomashops-release.jks"
$Alias        = "tomashops"
$Validity     = 10000  # ~27 years

if (Test-Path $KeystorePath) {
    Write-Host "Keystore already exists at $KeystorePath — aborting so it isn't overwritten." -ForegroundColor Yellow
    exit 1
}

New-Item -ItemType Directory -Force -Path (Split-Path $KeystorePath) | Out-Null

Write-Host "Generating keystore: $KeystorePath" -ForegroundColor Cyan
keytool -genkeypair `
    -v `
    -keystore $KeystorePath `
    -alias $Alias `
    -keyalg RSA `
    -keysize 2048 `
    -validity $Validity

Write-Host ""
Write-Host "Keystore created. Store these in a password manager:" -ForegroundColor Green
Write-Host "  Keystore: $KeystorePath"
Write-Host "  Alias:    $Alias"
Write-Host "  (Keystore + key passwords were just entered interactively.)"
