# Privacy Reconciliation Record

Status: **implementation and disclosure proposal reconciled; publication and App Store save remain external actions**

This record compares observed implementation behavior with the proposed disclosure. It is implementation evidence and an owner release decision, not privacy or legal approval.

## Release decision

Well Within remains local by default and usable without an account. Off-device collection occurs only when a user chooses optional account backup, submits feedback, includes optional cycle context, or directs an export to another destination. Because authenticated cloud records are stored under a user ID, the proposed App Store answers classify the applicable data as **Data Linked to You**, even though many users may never enable those flows.

The release proposal is:

- disclose Health, Email Address, User ID, Customer Support, Other Diagnostic Data, and Coarse Location;
- mark each disclosed type **Linked to You**, **Not Used for Tracking**, and used for **App Functionality**;
- select no advertising, marketing, analytics, or tracking purposes;
- keep the plain-language promise limited to **no third-party ad tracking**; and
- explain that device-only charting is not sent to Well Within unless the user chooses backup or affirmatively includes cycle context with feedback.

## Implementation inventory

| Flow | Data observed in implementation | Where it goes | User choice/control | Disclosure result |
| --- | --- | --- | --- | --- |
| Local charting | Daily entry payload, notes, intercourse entry, entry date, chart/sync state | AsyncStorage on device | App works without an account; edit, delete, and clear controls exist | Not collected by Well Within while it stays device-only |
| Optional authentication | Email, Supabase user ID, session tokens | Supabase Auth; session persisted locally | User initiates magic-link sign-in; sign-out and account deletion exist | Email Address and User ID; linked; app functionality |
| Optional cloud backup | User ID, entry dates, complete daily-entry payload, timestamps, deletion markers | Supabase `daily_entries` and `profiles` | Enabled only through optional account use; cloud-chart and account-deletion controls exist | Health and User ID; linked; app functionality |
| Optional feedback | Type/category/confidence/message; optional contact email; optional cycle context; app version/platform; user ID when signed in | Supabase `user_feedback` | User submits; cycle context is off by default; contact fields are optional | Customer Support, Health when included, Email when supplied, User ID when signed in, and Other Diagnostic Data |
| Service/security logging | IP, coarse country/location derived from IP, user agent/platform, timestamp, request status, and sometimes account ID | Supabase service logs | Necessary for optional network features | Coarse Location, Other Diagnostic Data, and User ID; conservative linked classification |
| Export | Completed-cycle PDF or user-requested data export | Generated locally, then passed to iOS share flow | User initiates and chooses destination | User-directed sharing; Well Within does not choose or receive the destination |
| Delete backed-up chart | Authenticated account ID and reset timestamp | Supabase RPC deletes chart rows and records reset marker; device chart is cleared | Explicit signed-in action | Policy distinguishes chart deletion from account deletion |
| Delete account | Authenticated account/session | Edge Function removes Auth user; database foreign-key cascade removes linked feedback and account data; local state/session is cleared | Explicit signed-in action | Policy describes application-controlled deletion and provider log/backup exceptions |

## Backend and SDK findings

- The mobile dependency inventory contains Expo/React Native platform packages, Supabase, navigation, storage, file/print/sharing utilities, and the local rules engine. No advertising, attribution, behavioral analytics, or third-party crash-reporting SDK was found in the release dependency list.
- Supabase is configured in `us-east-1` on the Free plan. The dashboard reports no project backups. The current Free-plan log-retention table provides one day for API and database logs.
- Supabase authentication/audit and service logs may contain IP address, user-agent/platform, request metadata, and account identifiers. The draft policy discloses this conservatively.
- Health records in optional cloud backup are stored under an authenticated `user_id`; the old **Data Not Linked to You** label is therefore not retained.
- Feedback cycle context is optional and off by default. Signed-in feedback may be associated with the account ID; account deletion cascades to associated feedback.
- The iOS `PrivacyInfo.xcprivacy` now lists the same proposed data types, linkage, no-tracking status, and App Functionality purpose as the submission packet.

## Release artifacts

- Revised policy copy: [PRIVACY_POLICY_DRAFT.md](PRIVACY_POLICY_DRAFT.md)
- App Store answers and exact metadata: [APP_STORE_SUBMISSION_PACKET.md](APP_STORE_SUBMISSION_PACKET.md)
- User-visible in-app wording: `apps/mobile/src/screens/SettingsScreen.tsx`
- iOS manifest: `apps/mobile/ios/WellWithin/PrivacyInfo.xcprivacy`
- Published policy: [Well Within Privacy Policy](https://well-within-app-support.jrypto3.chatgpt.site/privacy)
- Published support page: [Well Within Support](https://well-within-app-support.jrypto3.chatgpt.site)

## Remaining external actions

1. Replace the App Store privacy answers with the linked/no-tracking proposal above.
2. Record the final questionnaire export or screenshots and release commit in this folder.
3. Revisit retention and jurisdiction-specific consumer-health requirements if the Supabase plan, distribution geography, business model, SDKs, or data uses change.

## Authoritative references

- [Apple App Privacy Details](https://developer.apple.com/app-store/app-privacy-details/)
- [Apple app-privacy workflow](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy)
- [Apple privacy manifest guidance](https://developer.apple.com/documentation/bundleresources/describing-data-use-in-privacy-manifests)
- [Supabase Auth audit logs](https://supabase.com/docs/guides/auth/audit-logs)
- [Supabase logging](https://supabase.com/docs/guides/telemetry/logs)
- [Supabase pricing and log-retention table](https://supabase.com/pricing)
