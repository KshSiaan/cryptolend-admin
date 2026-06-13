import Link from "next/link";
import {
  ArrowRight,
  BarChart2,
  CheckCircle2,
  ChevronRight,
  Globe,
  Lock,
  Shield,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { LandingFooter } from "@/components/landing-footer";
import { LandingNavbar } from "@/components/landing-navbar";

const steps = [
  {
    step: "01",
    icon: Wallet,
    title: "Deposit SOL",
    desc: "Connect your Solana wallet and deposit SOL. Funds convert instantly to your CryptoLend balance.",
  },
  {
    icon: BarChart2,
    step: "02",
    title: "Browse Loans",
    desc: "Explore curated loan listings across sectors — Retail, Tech, Commerce. Filter by grade, APR, and duration.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Earn Returns",
    desc: "Receive monthly repayments directly to your wallet. Track earnings in real-time on your dashboard.",
  },
];

const features = [
  {
    icon: Shield,
    title: "Collateralized Loans",
    desc: "Every loan is backed by real assets — inventory, IP, or purchase orders. Grade A–C risk classification.",
  },
  {
    icon: TrendingUp,
    title: "Up to 18% APR",
    desc: "Earn significantly more than traditional savings. Returns paid monthly, denominated in SOL.",
  },
  {
    icon: Lock,
    title: "Solana Blockchain",
    desc: "All transactions recorded on-chain. Transparent, verifiable, and settled in seconds.",
  },
  {
    icon: CheckCircle2,
    title: "KYC Verified Borrowers",
    desc: "Every borrower undergoes identity verification before any loan is listed on the platform.",
  },
  {
    icon: Globe,
    title: "Diversify Easily",
    desc: "Spread investments across multiple loans and sectors with minimum investments from 0.05 SOL.",
  },
  {
    icon: Users,
    title: "Growing Community",
    desc: "Join 12,000+ investors already earning passive income through CryptoLend.",
  },
];

const sampleLoans = [
  {
    title: "SME Working Capital",
    sector: "Retail",
    grade: "A",
    apr: 14,
    duration: "12 mo",
    funded: 74,
    minInvestment: "0.1 SOL",
  },
  {
    title: "Tech Startup Bridge",
    sector: "Technology",
    grade: "B",
    apr: 18,
    duration: "18 mo",
    funded: 56,
    minInvestment: "0.25 SOL",
  },
  {
    title: "Import/Export Trade",
    sector: "Commerce",
    grade: "C",
    apr: 14,
    duration: "3 mo",
    funded: 100,
    minInvestment: "0.05 SOL",
  },
];

const faqs = [
  {
    q: "How do I start investing?",
    a: "Register an account, complete KYC, deposit SOL to your wallet, then browse and invest in available loans.",
  },
  {
    q: "What is the minimum investment?",
    a: "As low as 0.05 SOL per loan. You can diversify across multiple loans from day one.",
  },
  {
    q: "How are returns paid?",
    a: "Monthly repayments are credited directly to your CryptoLend wallet. Withdraw anytime to your Solana address.",
  },
  {
    q: "Are my funds safe?",
    a: "All loans are collateralized and borrowers are KYC-verified. Grades A–C reflect risk assessment by our team.",
  },
];

const gradeColor: Record<string, string> = {
  A: "text-green-pos bg-green-pos/10",
  B: "text-orange bg-orange-bg",
  C: "text-red-neg bg-red-neg/10",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />

      {/* ── Hero ── */}
      <section className="bg-foreground text-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold bg-orange text-primary-foreground tracking-wide uppercase">
              Powered by Solana
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.08] tracking-tight mb-6">
              Earn up to <span className="text-orange">18% APR</span> investing
              in real loans.
            </h1>
            <p className="text-lg text-background/70 mb-8 leading-relaxed max-w-xl">
              CryptoLend connects investors with verified borrowers on the
              Solana blockchain. Deposit SOL, browse collateralized loans, and
              receive monthly returns.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-orange text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Start Investing <ArrowRight size={16} />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-background/10 text-background hover:bg-background/20 transition-colors border border-background/20"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Platform Stats ── */}
      {/* <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {platformStats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-foreground">
                  {s.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── How It Works ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
              How it works
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Three steps to start earning passive income with your crypto.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map(({ step, icon: Icon, title, desc }) => (
              <div
                key={step}
                className="relative rounded-2xl bg-card border border-border p-6"
              >
                <span className="absolute top-5 right-5 text-4xl font-black text-muted-foreground/20 leading-none select-none">
                  {step}
                </span>
                <div className="w-11 h-11 rounded-xl bg-orange-bg flex items-center justify-center mb-4">
                  <Icon size={20} className="text-orange" />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
              Why CryptoLend?
            </h2>
            <p className="text-muted-foreground text-base max-w-sm mx-auto">
              Built for investors who want real returns without the noise.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl bg-card border border-border p-5 flex gap-4"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-orange-bg flex items-center justify-center">
                  <Icon size={18} className="text-orange" />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials / Trust ── */}
      <section className="py-20 px-4 sm:px-6 bg-foreground text-background">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
              Trusted by investors worldwide
            </h2>
            <p className="text-background/60 text-base">
              What our community says about earning with CryptoLend.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: "Maria S.",
                role: "Retail Investor",
                text: "I've been earning 14% APR consistently for 8 months. The monthly repayments hit my wallet like clockwork.",
                stars: 5,
              },
              {
                name: "James K.",
                role: "Crypto Enthusiast",
                text: "Best way to put my SOL to work. The loan grades help me pick the right risk level for my portfolio.",
                stars: 5,
              },
              {
                name: "Priya T.",
                role: "DeFi Investor",
                text: "Transparent, fast, and the dashboard makes it easy to track everything. Diversified across 6 loans already.",
                stars: 5,
              },
            ].map(({ name, role, text, stars }) => (
              <div
                key={name}
                className="rounded-2xl bg-background/10 border border-background/15 p-5"
              >
                <div className="flex mb-3">
                  {"★"
                    .repeat(stars)
                    .split("")
                    .map((_, i) => (
                      <Star
                        // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length star row, no reorder
                        key={`star-${name}-${i}`}
                        size={14}
                        className="text-orange fill-orange"
                      />
                    ))}
                </div>
                <p className="text-sm text-background/80 leading-relaxed mb-4">
                  "{text}"
                </p>
                <div>
                  <p className="text-sm font-bold text-background">{name}</p>
                  <p className="text-xs text-background/50">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 sm:px-6" id="faq">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground text-sm">
              Everything you need to know before you start.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
            {faqs.map(({ q, a }) => (
              <div key={q} className="px-6 py-5">
                <p className="font-semibold text-sm mb-1.5">{q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4 sm:px-6 bg-orange-bg">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Ready to earn with your crypto?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join 12,000+ investors already earning up to 18% APR on
            Solana-backed loans. Takes less than 2 minutes to start.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-orange text-primary-foreground hover:opacity-90 transition-opacity text-base"
          >
            Create Free Account <ArrowRight size={18} />
          </Link>
          <p className="text-xs text-muted-foreground mt-4">
            No fees to join. Minimum investment 0.05 SOL.
          </p>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
