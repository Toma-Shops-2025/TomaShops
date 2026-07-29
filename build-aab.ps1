# TomaShops - Build signed AAB for Google Play
# Usage: cd Desktop\tomashops ; .\build-aab.ps1

$ProjectPath  = "$env:USERPROFILE\Desktop\tomashops"
$KeystorePath = "C:\Keys\tomashops.jks"
$KeyAlias     = "tomashops1"
$AabPath      = "$ProjectPath\android\app\build\outputs\bundle\release\app-release.aab"

$ErrorActionPreference = "Stop"

function Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }

Step "Building Web App..."
Set-Location $ProjectPath
bun install
bun run build

Step "Syncing Capacitor..."
bunx cap sync android

Step "Bumping versionCode..."
$gradle = "android/app/build.gradle"
$content = Get-Content $gradle -Raw
if ($content -match 'versionCode\s+(\d+)') {
    $old = [int]$Matches[1]
    $new = $old + 1
    $content = $content -replace "versionCode\s+$old", "versionCode $new"
    Set-Content $gradle $content -NoNewline
    Write-Host "    versionCode: $old -> $new" -ForegroundColor Green
}

Step "Keystore credentials (typing is hidden)"
$storePassSecure = Read-Host "Keystore password" -AsSecureString
$storePass = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($storePassSecure))

Step "Building Android AAB..."
Set-Location "$ProjectPath\android"
& .\gradlew.bat clean bundleRelease "-Pandroid.injected.signing.store.file=$KeystorePath" "-Pandroid.injected.signing.store.password=$storePass" "-Pandroid.injected.signing.key.alias=$KeyAlias" "-Pandroid.injected.signing.key.password=$storePass"

Set-Location $ProjectPath
if (Test-Path $AabPath) {
    Write-Host "`n  SUCCESS! AAB Ready: $AabPath" -ForegroundColor Green
    Start-Process explorer.exe "/select,`"$AabPath`""
}
