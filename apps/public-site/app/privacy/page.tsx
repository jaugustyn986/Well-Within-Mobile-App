import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../site-chrome";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Well Within handles device-only charting, optional cloud backup, feedback, exports, and deletion.",
};

export default function PrivacyPage() {
  return (
    <div className="site-shell">
      <SiteHeader active="privacy" />
      <main>
        <section className="hero privacy-hero">
          <div className="eyebrow">Privacy Policy</div>
          <h1>Your chart, your choices.</h1>
          <p className="hero-copy">
            Well Within works without an account. Cloud backup, feedback, cycle context, and
            exports happen only when you choose them.
          </p>
          <p className="effective-date">Effective July 14, 2026</p>
        </section>

        <div className="policy-layout">
          <aside className="policy-summary" aria-label="Privacy summary">
            <div className="eyebrow">At a glance</div>
            <ul>
              <li>Device-only charting is the default.</li>
              <li>An account and cloud backup are optional.</li>
              <li>Feedback cycle context is off by default.</li>
              <li>No third-party advertising or cross-app tracking.</li>
              <li>Separate controls exist for device, cloud, and account deletion.</li>
            </ul>
            <a className="text-link" href="mailto:WellWithinApp@gmail.com">
              Privacy questions <span aria-hidden="true">→</span>
            </a>
          </aside>

          <article className="policy-content">
            <PolicySection title="Overview">
              <p>
                Well Within is a cycle-charting and record-keeping app that works without an
                account. Your chart is stored on your device by default. You can choose to create
                an account for cloud backup, send feedback, include limited cycle context with
                feedback, export a PDF or data file, or share an export through iOS.
              </p>
              <p>
                We do not sell personal data. We do not use personal data for third-party
                advertising, advertising measurement, or cross-app tracking.
              </p>
            </PolicySection>

            <PolicySection title="Information handled by the app">
              <h3>Device-only charting</h3>
              <p>
                The app stores the observations you enter on your device, including dates,
                bleeding, sensation, appearance, mucus observations, notes, intercourse entries,
                and charting state. The app uses these observations on the device to create your
                chart and retrospective chart context.
              </p>
              <p>
                This device-only chart data is not sent to Well Within unless you choose cloud
                backup or affirmatively include cycle context with feedback. A PDF or data export
                is created at your request and is shared only with the destination you choose
                through iOS. Device and operating-system backups may be governed by your Apple
                settings and Apple&apos;s policies.
              </p>

              <h3>Optional account and cloud backup</h3>
              <p>
                If you choose to sign in, we collect your email address and create an account
                identifier. Your daily chart entries, entry dates, synchronization timestamps, and
                deletion or reset markers are then stored with that account in Supabase so the app
                can back up and restore your chart across supported devices.
              </p>
              <p>
                Cloud-backed health data is linked to your account. Supabase can technically
                access stored data while providing authentication, database, logging, and backup
                services. Data is encrypted in transit and at rest, but it is not end-to-end
                encrypted.
              </p>

              <h3>Optional feedback</h3>
              <p>
                If you submit feedback, we collect the feedback type, category, any confidence
                selection, the message you enter, app version, and platform. You may also choose
                to provide a contact email and permission to contact you.
              </p>
              <p>
                The Include cycle context control is off by default. If you turn it on, the
                submission includes limited chart context such as cycle length, chart phase, and
                data completeness. It does not automatically include personal notes. If you are
                signed in, the feedback may also be linked to your account identifier.
              </p>

              <h3>Service and security metadata</h3>
              <p>
                Supabase processes request, authentication, and security metadata needed to
                operate the service. This can include IP address, coarse country or location
                derived from an IP address, user-agent or device and platform information,
                timestamps, request status, and account identifier. Service and security records
                may be retained for limited periods as described in Supabase&apos;s terms and
                data-processing documentation.
              </p>
            </PolicySection>

            <PolicySection title="How we use information">
              <p>We use collected information only to:</p>
              <ul>
                <li>authenticate an optional account;</li>
                <li>provide cloud backup, synchronization, restoration, and deletion controls;</li>
                <li>receive and respond to feedback or support requests;</li>
                <li>prevent abuse, investigate errors, and keep the service reliable and secure; and</li>
                <li>comply with legal obligations.</li>
              </ul>
              <p>We do not use this information for advertising or marketing profiles.</p>
            </PolicySection>

            <PolicySection title="Service providers and user-directed sharing">
              <p>
                We use Supabase for optional authentication, cloud data storage, feedback storage,
                and related service logging. Apple and the App Store provide operating-system,
                distribution, and user-directed sharing services under their own policies.
              </p>
              <p>
                When you export or share a chart, you choose the recipient or destination. Well
                Within does not choose or receive that destination through the app.
              </p>
            </PolicySection>

            <PolicySection title="Retention and deletion">
              <p>
                Device-only chart data remains on your device until you edit or clear it, remove
                the app, or it is otherwise removed through your device or backup settings.
              </p>
              <p>
                Cloud chart data remains until you use the in-app control to delete backed-up chart
                data or delete your account. Account deletion removes application-controlled
                account data associated with that account, including linked feedback. Security
                logs and provider backups may remain for a limited period where needed for
                security, recovery, fraud prevention, or legal compliance.
              </p>
              <p>
                Feedback submitted without an account cannot automatically be matched to an
                account-deletion request. You may email WellWithinApp@gmail.com with enough
                information to locate a feedback submission and request deletion. We retain
                feedback only as long as reasonably needed to respond, improve reliability, and
                meet legal obligations.
              </p>
            </PolicySection>

            <PolicySection title="Your choices">
              <p>You can:</p>
              <ul>
                <li>use the app without an account;</li>
                <li>choose whether to create an account and enable cloud backup;</li>
                <li>keep the feedback cycle-context control off;</li>
                <li>omit a contact email from feedback;</li>
                <li>edit or clear device data;</li>
                <li>delete backed-up chart data without deleting the account;</li>
                <li>delete the account and associated application-controlled data; and</li>
                <li>create and share an export only when you choose.</li>
              </ul>
            </PolicySection>

            <PolicySection title="Security">
              <p>
                We use reasonable administrative and technical safeguards, including encrypted
                network connections, provider access controls, and row-level data access rules. No
                storage or transmission method can be guaranteed completely secure.
              </p>
            </PolicySection>

            <PolicySection title="Changes to this policy">
              <p>
                We may update this policy when the app, service providers, or legal requirements
                change. The effective date above will identify the current version.
              </p>
            </PolicySection>

            <PolicySection title="Contact">
              <p>
                Questions or privacy requests:{" "}
                <a href="mailto:WellWithinApp@gmail.com">WellWithinApp@gmail.com</a>
              </p>
            </PolicySection>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
