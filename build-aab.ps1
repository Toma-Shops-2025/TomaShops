# TomaShops — Build signed Android App Bundle (.aab) for Google Play
# Same flow as MyRunner, ViralSnap, AlgoRhythm, RewardLoop.
#
# Prereqs (one-time):
#   1. bun installed
#   2. JDK 17 installed (winget install --id EclipseAdoptium.Temurin.17.JDK -e)
#   3. Android Studio installed (so Android SDK exists)
#   4. Keystore created at C:\Keys\tomashops.jks (alias: tomashops1)
#        keytool -genkey -v -keystore C:\Keys\tomashops.jks -alias tomashops1 -keyalg RSA -keysize 2048 -validity 10000
#   5. Run once:  bunx cap add android ; bun run build ; bunx cap sync android
#
# Usage:
#   .\build-aab.ps1

$ErrorActionPreference = "Stop"

 $ProjectRoot   = $PSScriptRoot
 $AndroidDir    = Join-Path $ProjectRoot "android"
 $BuildGradle   = Join-Path $AndroidDir "app\build.gradle"
 $CapConfig     = Join-Path $ProjectRoot "capacitor.config.json"
 $CapBackup     = Join-Path $ProjectRoot "capacitor.config.backup.json"
 $KeystorePath  = "C:\Keys\tomashops.jks"
 $KeyAlias      = "tomashops1"
 

Set-Location $ProjectRoot

if (-not (Test-Path $AndroidDir)) {
    Write-Host "android/ folder missing. Run: bunx cap add android" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $KeystorePath)) {
    Write-Host "Keystore missing at $KeystorePath" -ForegroundColor Red
    Write-Host "Create it with:" -ForegroundColor Yellow
    Write-Host "  keytool -genkey -v -keystore C:\Keys\tomashops.jks -alias tomashops1 -keyalg RSA -keysize 2048 -validity 10000"
    exit 1
}

$KeystorePassSecure = Read-Host "Keystore password" -AsSecureString
$KeystorePass = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($KeystorePassSecure))

Write-Host "[1/6] Stripping dev server.url from capacitor.config.json..." -ForegroundColor Cyan
Copy-Item $CapConfig $CapBackup -Force
$cfg = Get-Content $CapConfig -Raw | ConvertFrom-Json
if ($cfg.PSObject.Properties.Name -contains "server") {
    $cfg.PSObject.Properties.Remove("server")
}
$cfg | ConvertTo-Json -Depth 10 | Set-Content $CapConfig -Encoding UTF8

try {
    Write-Host "[2/6] bun install..." -ForegroundColor Cyan
    bun install

     Write-Host "[3/6] bun run build..." -ForegroundColor Cyan
     bun run build
 
     Write-Host "[3b/6] Auto-bumping versionCode in build.gradle..." -ForegroundColor Cyan
     $GradleContent = Get-Content $BuildGradle -Raw
     # Find current versionCode
     if ($GradleContent -match 'versionCode\s+(\d+)') {
         $OldCode = [int]$matches[1]
         $NewCode = $OldCode + 1
         $GradleContent = $GradleContent -replace "versionCode\s+$OldCode", "versionCode $NewCode"
         Set-Content $BuildGradle $GradleContent -Encoding UTF8
         Write-Host "    versionCode bumped: $OldCode -> $NewCode" -ForegroundColor Green
     } else {
         Write-Host "    WARNING: could not find versionCode in build.gradle" -ForegroundColor Yellow
     }
 
     Write-Host "[4/6] bunx cap sync android..." -ForegroundColor Cyan
     bunx cap sync android
 

    Write-Host "[5/6] gradlew bundleRelease..." -ForegroundColor Cyan
    $Gradlew = Join-Path $AndroidDir "gradlew.bat"
    if (-not (Test-Path $Gradlew)) {
        throw "gradlew.bat missing at $Gradlew. Run: Remove-Item android -Recurse -Force ; bunx cap add android ; bun run build ; bunx cap sync android"
    }
    Push-Location $AndroidDir
    try {
        & $Gradlew clean bundleRelease
        if ($LASTEXITCODE -ne 0) { throw "gradle bundleRelease failed (exit $LASTEXITCODE)" }
    } finally {
        Pop-Location
    }

    $UnsignedAab = Join-Path $AndroidDir "app\build\outputs\bundle\release\app-release.aab"
    if (-not (Test-Path $UnsignedAab)) { throw "AAB not found at $UnsignedAab" }

    Write-Host "[6/6] Signing AAB with jarsigner..." -ForegroundColor Cyan
    jarsigner -verbose `
        -sigalg SHA256withRSA `
        -digestalg SHA-256 `
        -keystore $KeystorePath `
        -storepass $KeystorePass `
        -keypass $KeystorePass `
        $UnsignedAab `
        $KeyAlias

    Write-Host ""
    Write-Host "SUCCESS" -ForegroundColor Green
    Write-Host "Signed AAB: $UnsignedAab" -ForegroundColor Green
    Write-Host "Upload to Google Play Console -> Production -> Create new release." -ForegroundColor Green

    # Pop open the folder with the AAB selected
    Start-Process "explorer.exe" -ArgumentList "/select,`"$UnsignedAab`""
}
finally {
    Write-Host ""
    Write-Host "Restoring dev capacitor.config.json..." -ForegroundColor DarkGray
    Move-Item $CapBackup $CapConfig -Force
}
