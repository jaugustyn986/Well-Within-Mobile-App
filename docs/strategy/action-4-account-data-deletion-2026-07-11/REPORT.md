# Action 4 — Account and Cloud-Data Deletion

Date: July 11, 2026

Device: iPhone 17 Simulator, iOS 26.5

Build: Release configuration, current working tree

## Outcome

Action 4 is implemented and deployed to the production Supabase project with an authentication-method-independent contract. Verification used one uniquely named, auto-confirmed throwaway email/password account; no existing account or real chart data was changed.

The signed-in Settings screen now distinguishes:

1. clearing only this device;
2. permanently deleting backed-up chart data while keeping the account;
3. permanently deleting the account and associated data.

## Safety behavior

- Cloud and account deletion use the authenticated account ID, not the email address or magic-link callback.
- A cloud-reset marker clears stale local entries before another device can push them back.
- Account deletion is handled by a privileged Edge Function; the service-role key never enters the app bundle.
- Authenticated feedback now cascades with account deletion because it may contain contact information or optional cycle context.
- Email password sign-in can reuse the flow unchanged. New OAuth providers must add an explicit provider-cleanup adapter and otherwise fail closed.

## Verification

- Full mobile suite: **16 suites passed; 52 tests total; 51 passed and 1 existing test skipped**.
- Focused TypeScript check for the new services/storage/confirmation contract: passed.
- iOS JavaScript export: passed (954 modules bundled).
- Supabase Edge Function syntax transpilation: passed.
- Native iOS Release simulator build: **BUILD SUCCEEDED**.
- Simulator accessibility inspection confirmed all three destructive actions are present and labeled.
- Cloud-delete confirmation was opened and verified, then canceled.
- Account-delete confirmation was opened and captured in `account-delete-confirmation.png`.
- Neither destructive confirmation button was pressed.

## Production deployment and throwaway verification

- Applied `supabase/migrations/20260711220000_account_data_deletion.sql` to project `bbfwwmudofxtdylkqric`.
- Confirmed the reset column, chart-delete function, daily-entry delete policy, and feedback cascade constraint are present.
- Deployed `delete-account` Edge Function version 1 with JWT verification; an unauthenticated request was rejected with HTTP 401.
- Signed into the throwaway account using an email/password session, demonstrating that deletion is not coupled to the magic-link flow.
- Inserted a synthetic chart row and authenticated feedback row.
- Called `delete_my_chart_data()` and confirmed zero chart rows remained while `chart_data_deleted_at` was set.
- Reinserted one synthetic chart row, called `delete-account`, and confirmed the deleted account could no longer sign in.
- A final privileged database query returned `0` for the throwaway ID in `auth.users`, `profiles`, `daily_entries`, and `user_feedback`.
- The automated stale-second-device regression verifies that a newer production-style reset marker clears the simulated device's stale local entries before push.

The raw repository mobile `tsc` command remains blocked by the existing Expo `customConditions`/`moduleResolution` configuration mismatch; the focused source check and Release build cover the changed code.

## Result

Action 4 is complete. The backend contract, production deployment, simulated stale-device behavior, account deletion, feedback cascade, and post-deletion sign-in rejection are verified. Continue to use throwaway accounts—not real users—for any future destructive-flow regression checks.
