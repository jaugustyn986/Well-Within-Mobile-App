# Account and Data Deletion

Status: deployed and verified in production on July 11, 2026 using an isolated throwaway account.

## User-visible semantics

Well Within exposes three distinct destructive actions:

1. **Clear Data From This Device** removes the local chart only. The account and cloud backup remain, so data can return after sync.
2. **Delete Backed-Up Chart Data** permanently deletes `daily_entries` for the authenticated account, clears the current device, and keeps the account active.
3. **Delete Account** removes the Supabase Auth user plus all associated `profiles`, `daily_entries`, and authenticated `user_feedback`, then clears local chart/session state.

All destructive actions require an explicit confirmation. The app must not describe local-only deletion as cloud or account deletion.

## Sign-in-method independence

Deletion is bound to the authenticated account ID (`auth.uid()` / `user.id`), never to an email address, magic-link token, or callback URL.

- A future email/password flow continues to use the same backend deletion contract without changes.
- A future phone-based identity also uses the same contract.
- OAuth providers may require provider-specific token revocation. Add that behavior to `supabase/functions/delete-account/providerCleanup.ts` before enabling the provider. Unknown external providers fail closed instead of silently performing an incomplete deletion.
- If Supabase Auth is replaced entirely, keep the mobile `accountData` service contract and replace its backend adapter.

## Cross-device deletion protection

Deleting cloud rows without a reset marker is unsafe in a local-first app: a stale signed-in device could upload its older local copy later.

`delete_my_chart_data()` therefore performs one database transaction that:

1. records `profiles.chart_data_deleted_at`;
2. permanently deletes the caller's `daily_entries`;
3. returns the reset timestamp to the initiating device.

Before every pull/push cycle, each device reads that marker. If it is newer than the device's `lastCloudResetAt`, stale local entries are discarded before any push. Remote entries created after the reset can then merge normally.

## Privilege boundary

- The mobile app uses only the publishable/anonymous key and the current user's session.
- Chart-data deletion runs through an authenticated, row-level-security-protected database function.
- Account deletion runs through the `delete-account` Supabase Edge Function.
- `SUPABASE_SERVICE_ROLE_KEY` exists only in the Edge Function environment and must never be added to the app or repository.

## Deployment order

1. Apply `supabase/migrations/20260711220000_account_data_deletion.sql` to an existing project. `infra/supabase-schema.sql` remains the full clean-install schema.
2. Deploy `supabase/functions/delete-account` as the `delete-account` Edge Function with JWT verification enabled.
3. Use a throwaway account to verify cloud-chart deletion, a stale second-device reset, account deletion, and failed-session behavior.
4. Only then ship the mobile UI in TestFlight/App Store builds.

Do not test these flows with a real user's account or production chart data.

## Production verification record

The migration and `delete-account` Edge Function version 1 are deployed to Supabase project `bbfwwmudofxtdylkqric`. A throwaway email/password account verified the same authenticated contract used by magic-link and future local email sign-in methods. Chart deletion removed the synthetic chart row and set the reset marker. Full-account deletion then removed the Auth user, profile, recreated chart row, and authenticated feedback row; a subsequent sign-in attempt was rejected. The stale-second-device behavior is covered by the mobile sync regression suite.

## Verification expectations

- A cloud RPC failure leaves local chart data intact.
- A successful cloud deletion stores the reset marker locally.
- A stale device sees the marker and clears old entries before push.
- New entries made after acknowledging the marker can sync normally.
- Account deletion failure leaves local data and session intact.
- Successful account deletion clears local chart/session state after the server confirms deletion.
- Associated authenticated feedback is deleted with the account rather than anonymized.
