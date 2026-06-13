import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-base tracking-tight shrink-0"
          >
            <span className="w-7 h-7 rounded-lg bg-orange flex items-center justify-center text-primary-foreground text-xs font-black">
              C
            </span>
            CryptoLend
          </Link>

          <nav className="flex items-center gap-6">
            {[
              { label: "Terms of Service", href: "/terms" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "FAQs", href: "/#faq" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          <p className="text-xs text-muted-foreground shrink-0">
            © {new Date().getFullYear()} CryptoLend
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 pt-6 border-t border-border">
          Investing involves risk. Past performance is not indicative of future
          results. Capital at risk.
        </p>
      </div>
    </footer>
  );
}
