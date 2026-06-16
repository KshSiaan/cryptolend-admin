import { Button } from "@/components/ui/button";
import { LoansCarousel } from "@/components/loans-carousel";
import {
  BadgeCheck,
  Briefcase,
  Building2,
  CheckIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Coins,
  Eye,
  // Facebook,
  // Instagram,
  Layers,
  LayoutList,
  // Linkedin,
  Lock,
  Mail,
  ShieldCheck,
  // Twitter,
  Wallet,
  Wifi,
} from "lucide-react";
import Image from "next/image";

import { InvestYourWay } from "@/components/invest-your-way";
import Navig from "./navig";
export default function Page() {
  return (
    <div className="bg-white">
      <header className="bg-[#203828] h-[95dvh] w-full flex flex-col">
        <Navig />
        <div className="flex-1 w-full px-[7%] grid grid-cols-3 gap-6 pt-[3.5%] mb-[3.5%]">
          <Image
            src="/0.jpg"
            alt="Image 0"
            width={500}
            height={400}
            className="object-cover h-[60dvh] rounded-4xl"
          />
          <div className="h-full flex flex-col justify-center gap-6">
            <h1 className="text-6xl text-center font-bold text-white">
              Build wealth with confidence
            </h1>
            <p className="text-center text-white">
              Investing designed to meet your ambition, all in one place.
            </p>
            <Button
              className="w-min mx-auto px-6 py-6 bg-[#35de8d] hover:bg-[#35de8d]/90 text-foreground font-semibold"
              size="lg"
            >
              Get started
            </Button>
          </div>
          <Image
            src="https://images.unsplash.com/photo-1507041957456-9c397ce39c97?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Image 0"
            width={500}
            height={400}
            className="object-cover h-[60dvh] rounded-4xl"
          />
        </div>
        <div className="text-center py-8 flex justify-center items-center gap-[7%] text-background font-medium">
          <h3 className="flex items-center gap-2">
            <CheckIcon /> Trusted by 700k+ registered users
          </h3>
          <h3 className="flex items-center gap-2">
            <CheckIcon /> â‚¬800 m+ assets under management
          </h3>
          <h3 className="flex items-center gap-2">
            <CheckIcon /> Licensed investment firm under MiFID
          </h3>
        </div>
      </header>
      <main className="mt-12">
        <section className="py-24 px-[7%] bg-white">
          <div className="grid grid-cols-2 gap-20 items-start mx-auto max-w-7xl">
            {/* Left */}
            <div>
              <h2 className="text-[2.6rem] font-bold text-[#111827] leading-tight mb-5">
                For your financial future
              </h2>
              <p className="text-[#6b7280] text-[15px] leading-relaxed mb-10 max-w-[420px]">
                Grow your long-term wealth with flexible investments. Whether
                you&apos;re just starting out or are more experienced, we make
                investing simple.
              </p>
              <div className="space-y-16">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#eef2ee] flex items-center justify-center shrink-0">
                    <Briefcase size={17} className="text-[#203828]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111827] text-[15px] mb-1">
                      Income-generating investments
                    </p>
                    <p className="text-[#6b7280] text-[14px] leading-relaxed">
                      Earn regular returns from loans, bonds, real estate, and
                      more.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#eef2ee] flex items-center justify-center shrink-0">
                    <Wallet size={17} className="text-[#203828]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111827] text-[15px] mb-1">
                      Full flexibility
                    </p>
                    <p className="text-[#6b7280] text-[14px] leading-relaxed">
                      Get your money when you need it by cashing out or selling
                      investments.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#eef2ee] flex items-center justify-center shrink-0">
                    <CircleDollarSign size={17} className="text-[#203828]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111827] text-[15px] mb-1">
                      Low barriers
                    </p>
                    <p className="text-[#6b7280] text-[14px] leading-relaxed">
                      Start from just â‚¬50, with low and transparent fees.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#eef2ee] flex items-center justify-center shrink-0">
                    <ShieldCheck size={17} className="text-[#203828]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111827] text-[15px] mb-1">
                      Trusted and licenced
                    </p>
                    <p className="text-[#6b7280] text-[14px] leading-relaxed">
                      600k+ registered users and authorized to provide
                      investment services across the EU.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Right */}
            <div>
              <Image
                src="/1.jpg"
                alt="Investment app on phone"
                width={600}
                height={700}
                className="h-145 aspect-4/5 object-cover rounded-3xl"
                unoptimized
              />
            </div>
          </div>
        </section>

        <section className="py-24 px-[7%] bg-white">
          <div className="grid grid-cols-2 gap-20 items-center mx-auto max-w-7xl">
            {/* Left */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Briefcase size={15} className="text-[#6b7280]" />
                <span className="text-[#6b7280] text-sm font-medium">
                  Loans
                </span>
              </div>
              <h2 className="text-[3rem] font-bold text-[#111827] leading-[1.1] mb-5">
                Passive income from
                <br />
                day one
              </h2>
              <p className="text-[#6b7280] text-[15px] leading-relaxed mb-8 max-w-[420px]">
                Loans can offer competitive investment returns compared to
                traditional asset classes. Start confidently on Europe&apos;s
                leading platform for loan investments.
              </p>
              <button
                type="button"
                className="border border-[#111827] text-[#111827] text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#111827] hover:text-white transition-colors"
              >
                Explore loans
              </button>
            </div>
            {/* Right */}
            <LoansCarousel />
          </div>
        </section>
        <section className="py-24 px-[7%] bg-white">
          <div className="grid grid-cols-2 gap-20 items-center mx-auto max-w-7xl relative">
            {/* Left â€” image + floating card */}
            <div className="relative">
              <Image
                src="/3.jpg"
                alt="Person investing"
                width={560}
                height={480}
                className="w-[68%] h-[440px] object-cover rounded-3xl"
                unoptimized
              />
              {/* Floating bond list card */}
              <div className="absolute right-0 top-[-60%] translate-y-1/2 w-[58%] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.10)] overflow-hidden">
                {[
                  {
                    type: "Senior Secured Bond",
                    name: "Azerion Group Oct 2029",
                    bg: "#1b3f8b",
                    initial: "A",
                    textColor: "#fff",
                  },
                  {
                    type: "Secured Bond",
                    name: "Worldline Jun 2030",
                    bg: "#00b3a4",
                    initial: "W",
                    textColor: "#fff",
                  },
                  {
                    type: "Senior Secured Bond",
                    name: "GQM Services Apr 2029",
                    bg: "#e5e5e3",
                    initial: "G",
                    textColor: "#333",
                  },
                  {
                    type: "Senior Secured Bond",
                    name: "Kolibri Beteiligung Feb 2029",
                    bg: "#c0392b",
                    initial: "K",
                    textColor: "#fff",
                  },
                ].map((bond, i, arr) => (
                  <div
                    key={bond.name}
                    className={`flex items-center gap-3 px-4 py-6 ${i < arr.length - 1 ? "border-b border-[#f0f0ef]" : ""}`}
                  >
                    <div
                      className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: bond.bg,
                        color: bond.textColor,
                      }}
                    >
                      {bond.initial}
                    </div>
                    <div>
                      <p className="text-[11px] text-[#9ca3af] leading-none mb-0.5">
                        {bond.type}
                      </p>
                      <p className="text-[13px] font-semibold text-[#111827] leading-tight">
                        {bond.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right â€” text */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <LayoutList size={15} className="text-[#6b7280]" />
                <span className="text-[#6b7280] font-medium">Bonds</span>
              </div>
              <h2 className="text-[3rem] font-bold text-[#111827] leading-[1.1] mb-5">
                Access high-yield
                <br />
                corporate bonds
              </h2>
              <p className="text-[#6b7280] text-[15px] leading-relaxed mb-8 max-w-100">
                Earn fixed income from coupon payments. Choose automated
                portfolios or hand-pick individual bonds. Start from â‚¬50.
              </p>
              <button
                type="button"
                className="border border-[#111827] text-[#111827] text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#111827] hover:text-white transition-colors"
              >
                Explore bonds
              </button>
            </div>
          </div>
        </section>

        {/* Real estate section */}
        <section className="py-24 px-[7%] bg-white">
          <div className="grid grid-cols-2 gap-20 items-center mx-auto max-w-7xl">
            {/* Left â€” text */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Building2 size={15} className="text-[#6b7280]" />
                <span className="text-[#6b7280] text-sm font-medium">
                  Real estate
                </span>
              </div>
              <h2 className="text-[3rem] font-bold text-[#111827] leading-[1.1] mb-5">
                Rental income and
                <br />
                long-term growth
              </h2>
              <p className="text-[#6b7280] text-[15px] leading-relaxed mb-8 max-w-[400px]">
                Earn income from rent and capital appreciation. No hassle with
                property purchasing processes or maintenance.
              </p>
              <button
                type="button"
                className="border border-[#111827] text-[#111827] text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#111827] hover:text-white transition-colors"
              >
                Explore real estate
              </button>
            </div>

            {/* Right â€” staggered image composition */}
            <div className="relative h-[420px]">
              {/* Back image â€” right, taller */}
              <div className="absolute right-0 top-0 w-[57%]">
                <div className="relative">
                  <Image
                    src="/5.jpg"
                    alt="Property interior"
                    width={400}
                    height={340}
                    className="w-full h-[340px] object-cover rounded-3xl"
                    unoptimized
                  />
                  {/* Income badge â€” top left */}
                  <div className="absolute top-4 -left-1/5 rounded-br-none! bg-[#203828] text-white rounded-2xl px-4 py-3 leading-tight">
                    <p className="text-[11px] font-medium opacity-80">Income</p>
                    <p className="text-xl font-bold">+ â‚¬ 50</p>
                  </div>
                  {/* Invested badge â€” bottom */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-full px-3.5 py-1.5 shadow-md">
                    <p className="text-[13px] font-semibold text-[#111827]">
                      Invested â‚¬2200
                    </p>
                  </div>
                </div>
              </div>

              {/* Front image â€” left, smaller, overlapping */}
              <div className="absolute left-0 bottom-0 w-[48%] z-10">
                <div className="relative">
                  <Image
                    src="/4.jpg"
                    alt="Property interior"
                    width={320}
                    height={268}
                    className="w-full h-[268px] object-cover rounded-3xl"
                    unoptimized
                  />
                  {/* Invested badge â€” bottom center */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-full px-3.5 py-1.5 shadow-md whitespace-nowrap">
                    <p className="text-[13px] font-semibold text-[#111827]">
                      Invested â‚¬1500
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Crypto section */}
        <section className="py-24 px-[7%] bg-white">
          <div className="grid grid-cols-2 gap-20 items-center mx-auto max-w-7xl">
            {/* Left — image + floating elements */}
            <div className="relative h-[500px]">
              {/* Main photo — right side of column */}
              <div className="absolute right-0 top-0 bottom-0 w-[73%]">
                <Image
                  src="/6.jpg"
                  alt="Crypto investor"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover rounded-3xl"
                  unoptimized
                />
              </div>

              {/* Chart card — top-left, overlapping photo */}
              <div className="absolute top-8 left-0 w-75 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.11)] p-4 z-10">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-full bg-[#203828] flex items-center justify-center shrink-0">
                    <span className="text-white text-[8px] font-bold">Ɛ</span>
                  </div>
                  <span className="text-[11px] text-[#9ca3af]">
                    Current value
                  </span>
                </div>
                <p className="text-[17px] font-bold text-[#111827] mb-2.5">
                  € 510.00
                </p>
                <svg
                  viewBox="0 0 180 60"
                  className="w-full h-[60px]"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#35de8d"
                        stopOpacity="0.22"
                      />
                      <stop offset="100%" stopColor="#35de8d" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,56 C8,54 14,48 22,42 C30,36 36,40 44,32 C52,24 58,28 66,20 C74,13 80,17 88,11 C96,5 104,8 112,4 C120,1 130,2 140,1 C152,0 164,1 180,0"
                    fill="none"
                    stroke="#35de8d"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M0,56 C8,54 14,48 22,42 C30,36 36,40 44,32 C52,24 58,28 66,20 C74,13 80,17 88,11 C96,5 104,8 112,4 C120,1 130,2 140,1 C152,0 164,1 180,0 L180,60 L0,60 Z"
                    fill="url(#cg)"
                  />
                </svg>
                <div className="flex justify-between mt-1.5">
                  {["Jan", "May", "Sep", "Jan"].map((l) => (
                    <span key={l} className="text-[9px] text-[#9ca3af]">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bitcoin badge — bottom-left */}
              <div className="absolute bottom-12 left-24 z-10 flex items-center gap-2 bg-white rounded-full pl-1.5 pr-4 py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.13)]">
                <div className="w-8 h-8 rounded-full bg-[#f7931a] flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-[13px]">₿</span>
                </div>
                <span className="text-[13px] font-semibold text-[#111827]">
                  Bitcoin
                </span>
              </div>

              {/* Ethereum badge — right-center */}
              <div className="absolute right-[-6px] top-[44%] z-10 flex items-center gap-2 bg-white rounded-full pl-1.5 pr-4 py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.13)]">
                <div className="w-8 h-8 rounded-full bg-[#627eea] flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-[12px]">Ξ</span>
                </div>
                <span className="text-[13px] font-semibold text-[#111827]">
                  Ethereum
                </span>
              </div>
            </div>

            {/* Right — text */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Coins size={15} className="text-[#6b7280]" />
                <span className="text-[#6b7280] text-sm font-medium">
                  Crypto
                </span>
                <span className="bg-[#35de8d] text-[#111827] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  NEW
                </span>
              </div>
              <h2 className="text-[3rem] font-bold text-[#111827] leading-[1.1] mb-5">
                Straightforward
                <br />
                crypto investing
              </h2>
              <p className="text-[#6b7280] text-[15px] leading-relaxed mb-8 max-w-[400px]">
                No wallets, no keys, no separate accounts. Invest in crypto ETPs
                from just €5.
              </p>
              <button
                type="button"
                className="border border-[#111827] text-[#111827] text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#111827] hover:text-white transition-colors"
              >
                Explore Crypto
              </button>
            </div>
          </div>
        </section>

        {/* ETFs + Smart Cash cards */}
        <section className="py-16 px-[7%] bg-white">
          <div className="grid grid-cols-2 gap-5 mx-auto max-w-7xl">
            {/* ETFs card */}
            <div className="bg-[#f2f2f0] rounded-3xl p-9 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-[#111827]" />
                  <span className="text-sm font-medium text-[#111827]">
                    ETFs
                  </span>
                </div>
                <span className="bg-[#35de8d] text-[#111827] text-[11px] font-semibold px-3 py-1 rounded-full">
                  Zero fees
                </span>
              </div>
              <h2 className="text-[2rem] font-bold text-[#111827] leading-[1.15] mb-4">
                Your personalized ETF portfolio
              </h2>
              <p className="text-[#6b7280] text-[14px] leading-relaxed mb-8 flex-1">
                Diversify globally with a portfolio of ETFs tailored to your
                risk preferences. No fees for buying, holding, or selling.
              </p>
              <button
                type="button"
                className="w-fit border border-[#111827] text-[#111827] text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#111827] hover:text-white transition-colors"
              >
                Explore ETFs
              </button>
            </div>

            {/* Smart Cash card */}
            <div className="bg-[#f2f2f0] rounded-3xl p-9 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Wifi size={16} className="text-[#111827]" />
                  <span className="text-sm font-medium text-[#111827]">
                    Smart Cash
                  </span>
                </div>
                <span className="bg-[#35de8d] text-[#111827] text-[11px] font-semibold px-3 py-1 rounded-full">
                  2% Yield*
                </span>
              </div>
              <h2 className="text-[2rem] font-bold text-[#111827] leading-[1.15] mb-4">
                Better than money in the bank
              </h2>
              <p className="text-[#6b7280] text-[14px] leading-relaxed mb-8 flex-1">
                Enjoy flexibility and peace of mind without leaving money on the
                table. Your cash earns more with Smart Cash.
              </p>
              <button
                type="button"
                className="w-fit border border-[#111827] text-[#111827] text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#111827] hover:text-white transition-colors"
              >
                Explore Smart Cash
              </button>
            </div>
          </div>
        </section>

        <InvestYourWay />

        {/* Your security first */}
        <section className="py-24 px-[7%] bg-white">
          <div className="grid grid-cols-2 gap-20 items-start mx-auto max-w-7xl">
            <div>
              <h2 className="text-[2.6rem] font-bold text-[#111827] leading-tight mb-4">
                Your security first.
              </h2>
              <p className="text-[#6b7280] text-[15px] leading-relaxed mb-8 max-w-[380px]">
                Every mechanism is designed to protect your capital — from KYC
                verification to settlement and beyond.
              </p>
              <button
                type="button"
                className="border border-[#111827] text-[#111827] text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#111827] hover:text-white transition-colors"
              >
                Security overview
              </button>
            </div>
            <div className="space-y-6">
              {[
                {
                  Icon: ShieldCheck,
                  title: "Licensed and regulated",
                  desc: "Solbridge Capital operates under applicable financial regulations. All accounts are subject to KYC and AML compliance checks.",
                },
                {
                  Icon: Lock,
                  title: "Investor protection",
                  desc: "Your invested funds are held in segregated accounts, fully separated from company funds at all times.",
                },
                {
                  Icon: BadgeCheck,
                  title: "Secured investments",
                  desc: "Every loan is backed by physical or IP collateral, evaluated and verified before listing on the platform.",
                },
                {
                  Icon: Eye,
                  title: "Your data, protected",
                  desc: "End-to-end encryption, zero third-party data sales, and full GDPR compliance across all operations.",
                },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-9 h-9 rounded-xl bg-[#eef2ee] flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[#203828]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#111827] text-[15px] mb-1">
                      {title}
                    </p>
                    <p className="text-[#6b7280] text-[13px] leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted by 700k+ */}
        <section className="py-24 px-[7%] bg-white border-t border-[#f0f0ef]">
          <div className="mx-auto max-w-7xl grid grid-cols-2 gap-20 items-start">
            {/* Left — big heading */}
            <div>
              <h2 className="text-[3.5rem] font-black text-[#111827] leading-[1.05]">
                Trusted by 700k+
                <br />
                registered users
              </h2>
            </div>

            {/* Right — Trustpilot stars + testimonial */}
            <div>
              <div className="flex gap-1 mb-5">
                {["t1", "t2", "t3", "t4", "t5"].map((k) => (
                  <div
                    key={k}
                    className="w-8 h-8 bg-[#00b67a] flex items-center justify-center rounded-sm"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 fill-white"
                      aria-hidden="true"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                ))}
              </div>
              <h3 className="font-bold text-[#111827] text-xl mb-3">
                I&apos;ve been using Solbridge Capital for several years...
              </h3>
              <p className="text-[#6b7280] text-[14px] leading-relaxed mb-4">
                I&apos;ve been using Solbridge Capital for several years and it
                has consistently delivered excellent returns. The platform is
                easy to navigate, and the Auto Invest feature makes diversifying
                across different loans and countries simple and efficient.
                Solbridge provides detailed information on loan originators,
                which builds trust and transparency. Overall, it&apos;s a
                fantastic choice for anyone looking to diversify their
                investments and earn passive income. Highly recommend.
              </p>
              <p className="text-[#111827] font-semibold text-sm mb-6">
                Adelino
              </p>
              {/* Dots + arrows */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  {["d1", "d2", "d3", "d4", "d5"].map((k, i) => (
                    <div
                      key={k}
                      className={`rounded-full ${i === 1 ? "w-2 h-2 bg-[#111827]" : "w-2 h-2 bg-[#d1d5db]"}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="w-9 h-9 rounded-full border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f5f5f5] transition-colors"
                  >
                    <ChevronLeft size={15} className="text-[#111827]" />
                  </button>
                  <button
                    type="button"
                    className="w-9 h-9 rounded-full border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f5f5f5] transition-colors"
                  >
                    <ChevronRight size={15} className="text-[#111827]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* We're here to help */}
        <section className="py-24 px-[7%] bg-white">
          <div className="grid grid-cols-2 gap-20 items-center mx-auto max-w-7xl">
            <div>
              <h2 className="text-[2.6rem] font-bold text-[#111827] leading-tight mb-4">
                We&apos;re here to help.
                <br />
                Not sell.
              </h2>
              <p className="text-[#6b7280] text-[15px] leading-relaxed mb-8 max-w-[380px]">
                Our support team answers real questions about investing. No
                scripts, no upselling — just honest answers about how Solbridge
                Capital works.
              </p>
              <button
                type="button"
                className="border border-[#111827] text-[#111827] text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#111827] hover:text-white transition-colors"
              >
                Contact support
              </button>
            </div>
            <div className="relative h-[420px]">
              <Image
                src="/2.jpg"
                alt="Support team"
                width={520}
                height={420}
                className="w-full h-full object-cover rounded-3xl"
                unoptimized
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl p-4 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#35de8d] flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-[#111827]" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#111827]">
                    Response time under 2h
                  </p>
                  <p className="text-[12px] text-[#9ca3af]">
                    support@solbridgecapital.io
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA dark */}
        <section className="py-24 px-[7%] bg-[#203828]">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[3rem] font-bold text-white leading-[1.1] mb-4">
              Get more out of your money.
            </h2>
            <p className="text-white/55 text-base mb-8 max-w-md mx-auto leading-relaxed">
              Your returns are waiting. Join 700k+ investors already earning
              returns on verified investments.
            </p>
            <button
              type="button"
              className="bg-[#35de8d] text-[#111827] font-bold text-base px-8 py-4 rounded-xl hover:bg-[#35de8d]/90 transition-colors"
            >
              Start investing free
            </button>
            <p className="text-xs text-white/30 mt-4">
              No fees to join · Minimum €50 · Withdraw anytime
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 px-[7%] bg-white" id="faq">
          <div className="mx-auto max-w-7xl grid grid-cols-[280px_1fr] gap-20">
            <div>
              <h2 className="text-[2rem] font-bold text-[#111827] tracking-tight mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Still have questions?{" "}
                <span className="text-[#203828] font-medium">
                  support@solbridgecapital.io
                </span>
              </p>
            </div>
            <div className="divide-y divide-[#f0f0ef]">
              {[
                {
                  q: "What is a loan investment on Solbridge Capital?",
                  a: "You lend funds to verified borrowers through our platform. Borrowers repay principal + interest monthly, and those repayments are credited to your account.",
                },
                {
                  q: "What types of investments are available?",
                  a: "Loans, bonds, real estate, crypto ETPs, ETFs, and Smart Cash — each with different return profiles, durations, and risk grades.",
                },
                {
                  q: "How do I start investing?",
                  a: "Create an account, complete KYC, deposit funds, then browse available investments and start from as little as €50.",
                },
                {
                  q: "How much can I earn?",
                  a: "Returns range from 9–18% APR depending on investment type and grade. Our platform average is 14.2% net APR over the last 12 months.",
                },
                {
                  q: "Can I withdraw my money at any time?",
                  a: "Your uninvested balance can be withdrawn anytime. Active investments run to maturity per the investment schedule.",
                },
                {
                  q: "How does Solbridge Capital generate passive income?",
                  a: "Monthly repayments compound over time. Reinvesting returns accelerates growth — many investors reach full passive income within 12–24 months.",
                },
              ].map(({ q, a }) => (
                <details key={q} className="group py-5">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="font-semibold text-[#111827] text-sm pr-4">
                      {q}
                    </span>
                    <ChevronDown
                      size={16}
                      className="text-[#9ca3af] shrink-0 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="text-[#6b7280] text-sm leading-relaxed mt-3">
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white min-h-[100dvh] flex flex-col border-t border-[#f0f0ef]">
        {/* Main link columns */}
        <div className="flex-1 mx-auto container w-full px-[7%] pt-20">
          <div className="grid grid-cols-4 gap-12">
            {/* Investing */}
            <div>
              <p className="font-bold text-[#111827] text-sm mb-6">Investing</p>
              <ul className="space-y-3.5">
                {[
                  "Loans",
                  "Bonds",
                  "ETFs",
                  "Real estate",
                  "Crypto",
                  "Smart Cash",
                  "Fees",
                ].map((l) => (
                  <li key={l}>
                    <a
                      href="/"
                      className="text-[#6b7280] text-[13px] hover:text-[#111827] transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Company */}
            <div>
              <p className="font-bold text-[#111827] text-sm mb-6">Company</p>
              <ul className="space-y-3.5">
                {[
                  "About us",
                  "Careers",
                  "Affiliate program",
                  "Media Center",
                  "Investor relations",
                ].map((l) => (
                  <li key={l}>
                    <a
                      href="/"
                      className="text-[#6b7280] text-[13px] hover:text-[#111827] transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Learn more */}
            <div>
              <p className="font-bold text-[#111827] text-sm mb-6">
                Learn more
              </p>
              <ul className="space-y-3.5">
                {[
                  "Blog",
                  "Help Center",
                  "Investor protection on Solbridge Capital",
                  "Solbridge Capital Risk Score",
                  "Solbridge Capital Community",
                ].map((l) => (
                  <li key={l}>
                    <a
                      href="/"
                      className="text-[#6b7280] text-[13px] hover:text-[#111827] transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Get the app + Follow us */}
            <div>
              <p className="font-bold text-[#111827] text-sm mb-6">
                Get the app
              </p>
              <div className="space-y-4 mb-10">
                <a
                  href="/"
                  className="flex items-center gap-2.5 text-[#6b7280] text-[13px] hover:text-[#111827] transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 shrink-0 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Download on the App Store
                </a>
                <a
                  href="/"
                  className="flex items-center gap-2.5 text-[#6b7280] text-[13px] hover:text-[#111827] transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 shrink-0 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.326-7.528-3.232-3.222z" />
                  </svg>
                  Get it on Google Play
                </a>
              </div>
              <p className="font-bold text-[#111827] text-sm mb-4">Follow us</p>
              <div className="flex items-center gap-4">
                {[
                  {
                    label: "Instagram",
                    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
                  },
                  {
                    label: "Facebook",
                    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                  },
                  {
                    label: "X",
                    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z",
                  },
                  {
                    label: "LinkedIn",
                    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                  },
                  {
                    label: "YouTube",
                    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
                  },
                ].map(({ label, path }) => (
                  <a
                    key={label}
                    href="/"
                    className="text-[#111827] hover:text-[#6b7280] transition-colors"
                  >
                    <span className="sr-only">{label}</span>
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 fill-current"
                      aria-hidden="true"
                    >
                      <path d={path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom legal section */}
        <div className="border-t border-[#e5e7eb] flex-1">
          <div className="mx-auto container px-[7%] py-10">
            <div className="flex items-center gap-8 mb-6">
              {[
                "Legal documents",
                "Imprint",
                "Report a security vulnerability",
              ].map((l) => (
                <a
                  key={l}
                  href="/"
                  className="text-[13px] text-[#6b7280] hover:text-[#111827] transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
            <div className="space-y-3 text-[12px] text-[#9ca3af] leading-relaxed max-w-4xl">
              <p>
                Solbridge Capital (registration no. 40103903643, legal address:
                Skanstes iela 50, Riga, LV – 1013, Latvia) is an investment firm
                licensed and supervised by Latvijas Banka, the central bank of
                Latvia.
              </p>
              <p>
                Solbridge Capital is a member of the national investor
                compensation scheme established under Directive 97/9/EC. The
                scheme provides compensation if Solbridge Capital fails to
                return financial instruments or cash to investors. The
                compensation is limited to the outstanding liabilities, up to
                €20 000. The scheme doesn&apos;t compensate for losses due to
                changes in the price or liquidity of financial instruments.
              </p>
              <p>
                Investing involves risks. The value of your investment may fall
                or rise, and you may lose invested capital. Past performance,
                forecasts, or simulations don&apos;t guarantee future
                performance. Please refer to our risk information.
              </p>
            </div>
            <p className="text-[12px] text-[#9ca3af] mt-5">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
