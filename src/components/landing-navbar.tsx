import Link from "next/link";

export function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-16">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
        >
          <span className="w-8 h-8 rounded-lg bg-orange flex items-center justify-center text-primary-foreground text-sm font-black">
            C
          </span>
          CryptoLend
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-orange text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
