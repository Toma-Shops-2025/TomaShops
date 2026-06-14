# TomaShops — Build signed Android App Bundle (.aab) for Google Play.
#
# Prerequisites (one-time):
#   1. Node 18+ and npm installed
#   2. Java JDK 17 installed (set JAVA_HOME)
#   3. Android Studio installed (Android SDK + build-tools)
#   4. ANDROID_HOME env var set
#   5. Run `npx cap add android` once if android/ folder doesn't exist
#   6. Run scripts\setup-keystore.ps1 once to create signing key
#
# Usage:
#   pwsh scripts\build-aab.ps1
#
# Output:
#   dist-mobile\tomashops-release.aab   <- upload this to Play Console

$ErrorActionPreference = "Stop"

$ProjectRoot   = Split-Path -Parent $PSScriptRoot
$AndroidDir    = Join-Path $ProjectRoot "android"
$CapConfig     = Join-Path $ProjectRoot "capacitor.config.json"
$CapBackup     = Join-Path $ProjectRoot "capacitor.config.backup.json"
$KeystorePath  = Join-Path $ProjectRoot "android\app\tomashops-release.jks"
$KeyAlias      = "tomashops"
$OutDir        = Join-Path $ProjectRoot "dist-mobile"
$FinalAab      = Join-Path $OutDir "tomashops-release.aab"

Set-Location $ProjectRoot

# --- Sanity checks ---
if (-not (Test-Path $AndroidDir)) {
    Write-Host "android/ folder missing. Run: npx cap add android" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $KeystorePath)) {
    Write-Host "Keystore missing at $KeystorePath. Run scripts\setup-keystore.ps1 first." -ForegroundColor Red
    exit 1
}

# --- Collect signing passwords ---
$KeystorePass = Read-Host "Keystore password" -AsSecureString
$KeyPass      = Read-Host "Key password (press Enter if same as keystore)" -AsSecureString
$KeystorePassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($KeystorePass))
$KeyPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($KeyPass))
if ([string]::IsNullOrEmpty($KeyPassPlain)) { $KeyPassPlain = $KeystorePassPlain }

# --- Backup capacitor.config.json and strip hot-reload server.url for release ---
Write-Host "[1/6] Preparing release capacitor.config.json..." -ForegroundColor Cyan
Copy-Item $CapConfig $CapBackup -Force
$cfg = Get-Content $CapConfig -Raw | ConvertFrom-Json
if ($cfg.PSObject.Properties.Name -contains "server") {
    $cfg.PSObject.Properties.Remove("server")
}
$cfg | ConvertTo-Json -Depth 10 | Set-Content $CapConfig -Encoding UTF8

try {
    # --- Install + build web bundle ---
    Write-Host "[2/6] Installing dependencies..." -ForegroundColor Cyan
    npm install

    Write-Host "[3/6] Building web bundle..." -ForegroundColor Cyan
    npm run build

    # --- Sync to native android project ---
    Write-Host "[4/6] Syncing Capacitor (android)..." -ForegroundColor Cyan
    npx cap sync android

    # --- Gradle bundleRelease ---
    Write-Host "[5/6] Building release AAB via Gradle..." -ForegroundColor Cyan
    Push-Location $AndroidDir
    try {
        .\gradlew.bat clean bundleRelease
    } finally {
        Pop-Location
    }

    $UnsignedAab = Join-Path $AndroidDir "app\build\outputs\bundle\release\app-release.aab"
    if (-not (Test-Path $UnsignedAab)) {
        throw "Expected AAB not found at $UnsignedAab"
    }

    # --- Sign with jarsigner ---
    Write-Host "[6/6] Signing AAB..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
    Copy-Item $UnsignedAab $FinalAab -Force

    jarsigner -verbose `
        -sigalg SHA256withRSA `
        -digestalg SHA-256 `
        -keystore $KeystorePath `
        -storepass $KeystorePassPlain `
        -keypass $KeyPassPlain `
        $FinalAab `
        $KeyAlias

    Write-Host ""
    Write-Host "SUCCESS" -ForegroundColor Green
    Write-Host "Signed AAB: $FinalAab" -ForegroundColor Green
    Write-Host "Upload this to Google Play Console -> Production -> Create new release." -ForegroundColor Green
}
finally {
    # --- Always restore the dev capacitor.config.json with hot-reload server.url ---
    Write-Host ""
    Write-Host "Restoring dev capacitor.config.json..." -ForegroundColor DarkGray
    Move-Item $CapBackup $CapConfig -Force
}
