import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "./site-chrome";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Help with Well Within cycle charting, backup, exports, privacy, and account controls.",
};

const commonSteps = [
  {
    title: "A day looks wrong",
    body: "Open that date from Calendar and review the saved bleeding, sensation, and appearance.",
  },
  {
    title: "A chart marker changed",
    body: "Peak and P+ markers update when an earlier or later observation changes.",
  },
  {
    title: "You missed a day",
    body: "Keep it marked not observed, or add the observation later only if you remember it.",
  },
  {
    title: "Backup is not working",
    body: "Confirm you are signed in with the same email on both devices, then reopen Settings.",
  },
  {
    title: "You want to remove data",
    body: "Settings has separate controls for device data, backed-up chart data, and account deletion.",
  },
];

export default function SupportPage() {
  return (
    <div className="site-shell">
      <SiteHeader active="support" />
      <main>
        <section className="hero support-hero">
          <div className="eyebrow">Well Within Support</div>
          <h1>Clear help for your chart—and your choices.</h1>
          <p className="hero-copy">
            Well Within helps you record daily cycle observations, review retrospective chart
            context, compare completed charts, and export a clear record.
          </p>
        </section>

        <section className="contact-card" aria-labelledby="contact-heading">
          <div>
            <div className="eyebrow">Need help with the app?</div>
            <h2 id="contact-heading">Tell us what happened.</h2>
            <p>
              Include what you were trying to do, what happened instead, your app version from
              Settings, and a screenshot if you are comfortable sharing one.
            </p>
            <p className="privacy-note">
              Please do not email personal chart details unless they are necessary for your
              support request.
            </p>
          </div>
          <a className="primary-link" href="mailto:WellWithinApp@gmail.com">
            Email support
          </a>
        </section>

        <section className="section-block" aria-labelledby="steps-heading">
          <div className="section-heading">
            <div className="eyebrow">Common next steps</div>
            <h2 id="steps-heading">Start with the screen you were using.</h2>
          </div>
          <div className="support-grid">
            {commonSteps.map((step, index) => (
              <article className="support-card" key={step.title}>
                <span className="step-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="two-column-callout">
          <div>
            <div className="eyebrow">Privacy</div>
            <h2>Your chart is stored on your device by default.</h2>
            <p>
              Cloud backup and feedback cycle context are optional. Read how device storage,
              optional account backup, feedback, exports, and deletion work.
            </p>
            <Link className="text-link" href="/privacy">
              Read the privacy policy <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div>
            <div className="eyebrow">Charting and care</div>
            <h2>For personal interpretation, connect with qualified support.</h2>
            <p>
              Well Within is an educational charting and record-keeping tool. It does not
              diagnose, treat, confirm ovulation, or replace individualized instruction or
              medical care.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
