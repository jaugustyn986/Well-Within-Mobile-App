import Link from "next/link";

export function SiteHeader({ active }: { active: "support" | "privacy" }) {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Well Within support home">
        <img src="/well-within-icon.png" alt="" width="38" height="38" />
        <span>Well Within</span>
      </Link>
      <nav aria-label="Support and privacy">
        <Link aria-current={active === "support" ? "page" : undefined} href="/">
          Support
        </Link>
        <Link aria-current={active === "privacy" ? "page" : undefined} href="/privacy">
          Privacy
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Well Within</strong>
        <span>Cycle charting, made clear.</span>
      </div>
      <div className="footer-links">
        <Link href="/">Support</Link>
        <Link href="/privacy">Privacy</Link>
        <a href="mailto:WellWithinApp@gmail.com">WellWithinApp@gmail.com</a>
      </div>
    </footer>
  );
}
