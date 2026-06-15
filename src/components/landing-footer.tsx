import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.svg"
              alt="Solbridge Capital"
              width={100}
              height={34}
              className="h-7 w-auto"
              unoptimized
            />
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
            © {new Date().getFullYear()} Solbridge Capital
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
