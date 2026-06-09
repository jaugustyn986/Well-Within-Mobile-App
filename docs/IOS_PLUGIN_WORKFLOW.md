# iOS Plugin Workflow

This repo is Expo-first, but the Build iOS Apps plugin can build, launch, screenshot, and inspect the app once Expo has generated the native iOS project.

## One-Time Native Setup

From the clean setup branch/worktree:

```bash
npm install
cd apps/mobile
npx expo prebuild --platform ios
```

This creates `apps/mobile/ios/` with:

- `WellWithin.xcodeproj`
- `WellWithin.xcworkspace`
- `Podfile`
- `Podfile.lock`

Use the workspace after Pods are installed:

```bash
cd apps/mobile/ios
pod install
```

Recommended local toolchain:

- Ruby 3.2+ or 3.3+
- current CocoaPods installed against that Ruby

The system Ruby on macOS can be too old for current CocoaPods dependencies. If `pod install` fails because of Ruby/Gem dependency versions, install a modern Ruby rather than treating old system-Ruby gem pins as the project standard.

## Local Env

The app expects Supabase public env values in `apps/mobile/.env`, which is intentionally ignored by git.

For a separate worktree, copy or recreate the local env file before launching the dev build:

```bash
cp ../Well-Within/apps/mobile/.env apps/mobile/.env
```

Do not commit `.env`.

## Running With Metro

Start Metro for the dev client:

```bash
cd apps/mobile
npx expo start --dev-client --host localhost
```

The dev-client URL should look like:

```text
exp+modern-creighton://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8081
```

If the simulator shows the Expo development client server list, open that URL or tap the listed `localhost:8081` server.

## Build iOS Apps Plugin Defaults

Use the generated workspace, not the raw project, after running Pods:

- workspace: `apps/mobile/ios/WellWithin.xcworkspace`
- scheme: `WellWithin`
- configuration: `Debug`
- bundle id: `com.wellwithin.app`
- simulator: any available iPhone simulator, such as `iPhone 17 Pro`

The plugin flow is:

1. `session_show_defaults`
2. `discover_projs`
3. `list_schemes` for `apps/mobile/ios/WellWithin.xcworkspace`
4. `list_sims`
5. `session_set_defaults`
6. `build_sim`
7. `build_run_sim`
8. `screenshot` / `snapshot_ui`

The first native build may exceed the plugin tool timeout while Xcode compiles React Native dependencies. If the Xcode process is still running, let it finish and inspect the plugin build log. Warm builds should be much faster.

## Verified Result

On 2026-06-08, the plugin successfully:

- discovered the generated Xcode project
- listed the `WellWithin` scheme
- used the booted `iPhone 17 Pro` simulator
- built the app for iOS Simulator
- installed and launched `com.wellwithin.app`
- captured screenshots
- captured a semantic UI snapshot after the app loaded from Metro

Known non-blocking warnings observed:

- React Native require cycle: `AppNavigator.tsx -> HelpScreen.tsx -> AppNavigator.tsx`
- React Native deprecated `SafeAreaView` warning
- Xcode script phase warnings from React Native/Hermes Pods

