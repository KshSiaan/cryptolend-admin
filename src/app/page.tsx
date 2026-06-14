import {
  ArrowRight,
  BarChart2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Globe,
  Lock,
  Shield,
  ShieldCheck,
  Star,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LandingFooter } from "@/components/landing-footer";
import { LandingNavbar } from "@/components/landing-navbar";

/* ── static data ── */
const trustStrip = [
  { icon: ShieldCheck, text: "KYC-verified borrowers" },
  { icon: Lock, text: "On-chain transparency" },
  { icon: Shield, text: "Collateralized loans" },
  { icon: CheckCircle2, text: "AML compliant" },
];

const portfolioFeatures = [
  {
    icon: TrendingUp,
    title: "Generate passive income",
    desc: "Earn monthly repayments from verified loans. Set it and forget it.",
  },
  {
    icon: Wallet,
    title: "Full flexibility",
    desc: "Deposit or withdraw SOL anytime. No lock-in, no minimum hold period.",
  },
  {
    icon: BarChart2,
    title: "Low barriers to entry",
    desc: "Start from just 0.05 SOL. Diversify across many loans immediately.",
  },
  {
    icon: Globe,
    title: "Trusted and transparent",
    desc: "KYC-verified users, collateralized loans, and full on-chain auditability.",
  },
];

const faqs = [
  {
    q: "What is a loan investment on CryptoLend?",
    a: "You lend SOL to verified borrowers through our platform. Borrowers repay principal + interest monthly, and those repayments are credited to your wallet.",
  },
  {
    q: "What types of loans are available on CryptoLend?",
    a: "Business loans, trade finance, and tech venture bridge loans — each with different APR ranges, durations, and risk grades.",
  },
  {
    q: "How do I start investing on CryptoLend?",
    a: "Create an account, complete KYC, deposit SOL, then browse available loans and invest from 0.05 SOL.",
  },
  {
    q: "How much can I earn?",
    a: "Returns range from 10–18% APR depending on loan grade. The platform average is 14.2% net APR over the last 12 months.",
  },
  {
    q: "Can I withdraw my money at any time?",
    a: "Your uninvested balance can be withdrawn anytime. Active investments run to maturity per the loan schedule.",
  },
  {
    q: "How does CryptoLend generate passive income?",
    a: "Monthly loan repayments compound over time. Reinvesting returns accelerates growth — many investors reach full passive income within 12–24 months.",
  },
];

const testimonials = [
  {
    name: "Maria S.",
    role: "Retail Investor",
    text: "I've been earning 14% APR consistently for 8 months. Monthly repayments hit my wallet like clockwork.",
    stars: 5,
  },
  {
    name: "James K.",
    role: "Crypto Enthusiast",
    text: "Best way to put my SOL to work. Loan grades make it easy to pick the right risk level.",
    stars: 5,
  },
  {
    name: "Priya T.",
    role: "DeFi Investor",
    text: "Transparent, fast, and the dashboard makes tracking everything effortless. Already in 6 loans.",
    stars: 5,
  },
];

function StarRow({ count, size = 13 }: { count: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          // biome-ignore lint/suspicious/noArrayIndexKey: static star display
          key={i}
          size={size}
          className="text-orange fill-orange"
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />

      {/* ── HERO ── */}
      <section className="bg-foreground text-background overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-0">
          <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-end">
            {/* left */}
            <div className="pb-16">
              <span className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 rounded-full text-xs font-semibold bg-orange/20 text-orange border border-orange/30 tracking-wide uppercase">
                Powered by Solana
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.04] tracking-tight mb-5">
                Build wealth
                <br />
                with confidence.
              </h1>
              <p className="text-background/60 text-base leading-relaxed mb-8 max-w-md">
                Invest in verified loans on the Solana blockchain. Earn up to
                18% APR with monthly repayments — automatically.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-orange text-primary-foreground hover:opacity-90 transition-opacity text-sm"
                >
                  Start investing free <ArrowRight size={15} />
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border border-background/20 text-background/75 hover:bg-background/10 transition-colors text-sm"
                >
                  Sign in
                </Link>
              </div>
            </div>

            {/* right — hero photo + return badge overlay */}
            <div className="relative self-end hidden lg:block">
              <Image
                src="/0.jpg"
                alt="Investor"
                width={420}
                height={480}
                unoptimized
                className="w-full aspect-square rounded-t-2xl object-cover"
              />
              {/* floating return badge */}
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-card text-foreground p-4 shadow-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                  Avg. net annual return
                </p>
                <p className="text-4xl font-black text-orange leading-none">
                  14.2<span className="text-2xl">%</span>
                </p>
                <div className="flex gap-3 mt-3">
                  {[
                    { v: "12%", l: "Min" },
                    { v: "14%", l: "Avg" },
                    { v: "18%", l: "Max" },
                  ].map(({ v, l }) => (
                    <div
                      key={l}
                      className="flex-1 rounded-lg bg-muted py-1.5 text-center"
                    >
                      <p className="text-xs font-black">{v}</p>
                      <p className="text-[9px] text-muted-foreground">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* trust strip */}
        <div className="border-t border-background/10 mt-0">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
            <div className="flex flex-wrap gap-6 sm:gap-10">
              {trustStrip.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon size={14} className="text-orange" />
                  <span className="text-xs text-background/60">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR YOUR PORTFOLIO ── */}
      <section className="py-20 px-4 sm:px-6 bg-card">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                For your financial future
              </h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-md">
                Grow your assets with flexible loan investments. Whether you're
                starting small or scaling up, CryptoLend adapts to your goals.
              </p>
              <ul className="space-y-6">
                {portfolioFeatures.map(({ icon: Icon, title, desc }) => (
                  <li key={title} className="flex gap-4">
                    <div className="shrink-0 w-9 h-9 rounded-xl bg-orange-bg flex items-center justify-center">
                      <Icon size={16} className="text-orange" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* right — photo */}
            <div className="flex justify-center lg:justify-end">
              <Image
                src="/1.jpg"
                alt="Person investing on phone"
                width={520}
                height={440}
                unoptimized
                className="w-full max-w-md aspect-square rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── BUSINESS LOANS ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange mb-3 block">
                Loans
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">
                Passive income from day one.
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md">
                Invest in working-capital and expansion loans for verified SMEs.
                Grade A–B loans with 6–24 month terms and 12–16% APR. Monthly
                repayments, collateralized by real assets.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-orange text-primary-foreground hover:opacity-90 transition-opacity text-sm"
              >
                Explore loans <ChevronRight size={14} />
              </Link>
            </div>
            {/* right — photo + APR badge */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <Image
                  src="/2.jpg"
                  alt="Business loan"
                  width={520}
                  height={400}
                  unoptimized
                  className="w-full aspect-square rounded-2xl object-cover"
                />
                <div className="absolute top-4 right-4 rounded-xl bg-card border border-border shadow-lg px-4 py-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    APR
                  </p>
                  <p className="text-2xl font-black text-orange">14%</p>
                  <p className="text-[10px] text-muted-foreground">Grade A</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRADE FINANCE (reversed) ── */}
      <section className="py-20 px-4 sm:px-6 bg-card">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* left — photo (reversed on desktop) */}
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative w-full max-w-md">
                <Image
                  src="/3.jpg"
                  alt="Trade finance"
                  width={520}
                  height={400}
                  unoptimized
                  className="w-full aspect-square rounded-2xl object-cover"
                />
                <div className="absolute bottom-4 left-4 rounded-xl bg-card border border-border shadow-lg px-4 py-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    APR
                  </p>
                  <p className="text-2xl font-black text-orange">12%</p>
                  <p className="text-[10px] text-muted-foreground">Grade B</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-xs font-bold uppercase tracking-widest text-orange mb-3 block">
                Trade Finance
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">
                Short-term returns, real backing.
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md">
                Fund import/export cycles backed by confirmed purchase orders.
                3–6 month loans with 10–14% APR — ideal for investors who want
                faster capital turnover.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-orange text-primary-foreground hover:opacity-90 transition-opacity text-sm"
              >
                Explore trade finance <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH VENTURES ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange mb-3 block">
                Tech Ventures
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">
                High yield, IP-secured financing.
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md">
                Bridge loans for tech startups secured by IP assets and
                recurring revenue. 14–18% APR over 12–18 months. Higher risk,
                higher reward — clearly graded.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-orange text-primary-foreground hover:opacity-90 transition-opacity text-sm"
              >
                Explore tech loans <ChevronRight size={14} />
              </Link>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <Image
                  src="/4.jpg"
                  alt="Tech ventures"
                  width={520}
                  height={400}
                  unoptimized
                  className="w-full aspect-square rounded-2xl object-cover"
                />
                <div className="absolute top-4 right-4 rounded-xl bg-card border border-border shadow-lg px-4 py-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    APR
                  </p>
                  <p className="text-2xl font-black text-orange">18%</p>
                  <p className="text-[10px] text-muted-foreground">Grade B</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INVEST YOUR WAY (dark) ── */}
      <section className="py-20 px-4 sm:px-6 bg-foreground text-background">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-orange mb-3">
                Portfolio builder
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-5">
                Invest your way.
              </h2>
              <p className="text-background/60 text-sm leading-relaxed mb-6 max-w-md">
                Mix loan types, risk grades, and durations to match your goals.
                Auto-reinvest repayments or withdraw — full control, always.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Complement your portfolio across 3 loan categories",
                  "Set risk preference — Grade A, B, or C",
                  "Reinvest repayments automatically to compound returns",
                  "Track real-time in your personal dashboard",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-3 text-sm text-background/75"
                  >
                    <CheckCircle2
                      size={15}
                      className="text-orange mt-0.5 shrink-0"
                    />
                    {t}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-orange text-primary-foreground hover:opacity-90 transition-opacity text-sm"
              >
                Build my portfolio <ArrowRight size={15} />
              </Link>
            </div>
            {/* right — photo with portfolio badge overlay */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <Image
                  src="/5.jpg"
                  alt="Investor with portfolio"
                  width={520}
                  height={480}
                  unoptimized
                  className="w-full aspect-square rounded-2xl object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-card text-foreground shadow-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    My portfolio
                  </p>
                  <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className="bg-orange h-full"
                      style={{ width: "45%" }}
                    />
                    <div
                      className="bg-purple h-full"
                      style={{ width: "30%" }}
                    />
                    <div
                      className="bg-green-pos h-full"
                      style={{ width: "25%" }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Avg. return</span>
                    <span className="font-black text-orange">14.8% APR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECURITY FIRST ── */}
      <section className="py-20 px-4 sm:px-6 bg-card">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">
                Your security first.
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
                Every mechanism on CryptoLend is designed to protect your
                capital — from KYC to on-chain settlement.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold border border-border text-foreground hover:bg-muted transition-colors text-sm"
              >
                Security overview <ChevronRight size={14} />
              </Link>
            </div>
            <ul className="space-y-6">
              {[
                {
                  icon: ShieldCheck,
                  title: "KYC & AML compliance",
                  desc: "All users and borrowers are identity-verified. AML checks run on every account.",
                },
                {
                  icon: Shield,
                  title: "Investor-grade collateral",
                  desc: "Every loan is secured by physical or IP assets. Collateral evaluated before listing.",
                },
                {
                  icon: Lock,
                  title: "Secure investment infrastructure",
                  desc: "Transactions settled on Solana — transparent, immutable, and permissionless.",
                },
                {
                  icon: Zap,
                  title: "Your data, protected",
                  desc: "End-to-end encryption, no third-party data sales, GDPR-compliant architecture.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex gap-4">
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-orange-bg flex items-center justify-center">
                    <Icon size={16} className="text-orange" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── TRUSTED ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-3">
            <StarRow count={5} size={18} />
            <span className="text-sm font-bold">Excellent · 4.8 / 5</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-12">
            Trusted by 12,400+ registered users
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map(({ name, role, text, stars }) => (
              <div
                key={name}
                className="rounded-2xl bg-card border border-border p-6"
              >
                <StarRow count={stars} />
                <p className="text-sm text-muted-foreground leading-relaxed my-4">
                  "{text}"
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-orange-bg flex items-center justify-center text-xs font-bold text-orange">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WE'RE HERE TO HELP ── */}
      <section className="py-20 px-4 sm:px-6 bg-card">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">
                We're here to help.
                <br />
                Not sell.
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
                Our support team answers real questions about investing. No
                scripts, no upselling — just honest answers about how CryptoLend
                works.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold border border-border text-foreground hover:bg-muted transition-colors text-sm"
              >
                Contact support <ChevronRight size={14} />
              </Link>
            </div>
            {/* right — photo */}
            <div className="flex justify-center lg:justify-end">
              <Image
                src="/6.jpg"
                alt="Support team"
                width={520}
                height={400}
                unoptimized
                className="w-full max-w-md aspect-square rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA (dark) ── */}
      <section className="py-20 px-4 sm:px-6 bg-foreground text-background">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Get more out of your money.
          </h2>
          <p className="text-background/55 text-base mb-8 max-w-md mx-auto leading-relaxed">
            Your returns are waiting. Join 12,400+ investors already earning up
            to 18% APR on Solana-backed loans.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-orange text-primary-foreground hover:opacity-90 transition-opacity text-base"
          >
            Start investing free <ArrowRight size={18} />
          </Link>
          <p className="text-xs text-background/35 mt-4">
            No fees to join · Minimum 0.05 SOL · Withdraw anytime
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 sm:px-6" id="faq">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-[280px_1fr] gap-14">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Still have questions?{" "}
                <span className="text-orange">support@cryptolend.io</span>
              </p>
            </div>
            <div className="divide-y divide-border">
              {faqs.map(({ q, a }) => (
                <details key={q} className="group py-4">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="font-semibold text-sm pr-4">{q}</span>
                    <ChevronDown
                      size={16}
                      className="text-muted-foreground shrink-0 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
