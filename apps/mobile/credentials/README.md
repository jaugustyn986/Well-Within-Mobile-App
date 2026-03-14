# App Store Connect API key (local only)

This folder is the **local** place for the App Store Connect API key used by EAS Submit (TestFlight and App Store).

## Setup

1. **Copy your key file here** (do not commit it):
   - From App Store Connect: Users and Access → Keys → create or download the `.p8` key.
   - Save it as: `AuthKey_V39393U3TH.p8` (or the Key ID you see in App Store Connect).
   - Place the file in this folder: `apps/mobile/credentials/AuthKey_V39393U3TH.p8`.

2. **Issuer ID and App ID** are already in `eas.json` for this project (`ascApiKeyIssuerId`, `ascAppId` 6760519448). If you use a different key, update `ascApiKeyId` and `ascApiKeyIssuerId` in `apps/mobile/eas.json`.

The `.p8` file is **gitignored**. Only this README and the path in `eas.json` are in the repo; the key itself stays on your machine (and on any CI where you inject it via secrets).

## Path for CLI

When EAS Submit asks for the path to the App Store Connect API key, use:

- From repo root: `apps/mobile/credentials/AuthKey_V39393U3TH.p8`
- From `apps/mobile`: `credentials/AuthKey_V39393U3TH.p8`

If your key has a different Key ID, rename the file to `AuthKey_<KEYID>.p8` and update `ascApiKeyId` (and optionally `ascApiKeyPath`) in `eas.json`.
