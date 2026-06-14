# TomaShops Android Build Scripts

Same flow we used for MyRunner, ViralSnap, AlgoRhythm, RewardLoop.

## One-time setup

```powershell
# 1. Clone the repo from GitHub (after Export to GitHub from Lovable)
git clone <your-repo-url>
cd tomashops

# 2. Install Node deps
npm install

# 3. Add the Android platform
npx cap add android

# 4. Create the release signing key (do this ONCE, back it up!)
pwsh scripts\setup-keystore.ps1
```

Required local tooling:
- Node 18+
- JDK 17 (`JAVA_HOME` set)
- Android Studio (SDK + build-tools, `ANDROID_HOME` set)

## Build the signed AAB

```powershell
pwsh scripts\build-aab.ps1
```

Output: `dist-mobile\tomashops-release.aab` — upload to Google Play Console.

## What the script does

1. Backs up `capacitor.config.json` and strips the dev `server.url` (so the released app loads its bundled `dist/`, not the Lovable preview)
2. `npm install` + `npm run build`
3. `npx cap sync android`
4. `gradlew bundleRelease`
5. Signs the AAB with `jarsigner` using `tomashops-release.jks`
6. Restores your dev `capacitor.config.json` so hot-reload still works in the sandbox

## After every Lovable update

```powershell
git pull
pwsh scripts\build-aab.ps1
```

Then bump `versionCode` / `versionName` in `android/app/build.gradle` before each Play Console upload.
