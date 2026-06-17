import { InnerNavbar } from "@/components/inner-navbar";
import { LandingFooter } from "@/components/landing-footer";
import {
  BadgeCheck,
  Eye,
  Lock,
  ShieldCheck,
} from "lucide-react";

const SECTIONS = [
  {
    icon: ShieldCheck,
    title: "Blockchain transparency as a foundation",
    body: "All transactions on Solbridge Capital are processed on the Solana blockchain — one of the fastest and most reliable blockchain networks in the world. Every loan disbursement, every repayment, and every interest payment is publicly visible, immutable, and tamper-proof. No middlemen, no hidden processes — only complete transparency.",
    items: [] as string[],
  },
  {
    icon: Lock,
    title: "Securing investor capital",
    body: "On Solbridge Capital, private individuals and companies lend money directly to other users — without routing through a bank. This means:",
    items: [
      "All funds are managed exclusively via smart contracts on the Solana blockchain. Solbridge Capital never has access to your funds at any point.",
      "Smart contracts execute repayments and interest payments automatically and rule-based — without any manual intervention.",
      "Your wallet remains under your control at all times.",
    ],
  },
  {
    icon: BadgeCheck,
    title: "Risk assessment and credit checks",
    body: "We protect our investors by carefully vetting borrowers before they are admitted to the platform. Every borrower undergoes an assessment of their creditworthiness and repayment capacity. Based on this review, loans are classified into risk categories so investors can decide for themselves how much risk they want to take on.",
    items: [] as string[],
  },
  {
    icon: Eye,
    title: "Transparent information for investors",
    body: "We provide our investors with all relevant information to make informed decisions:",
    items: [
      "Loan details: For each loan, the term, interest rate, risk class, and all conditions are clearly visible.",
      "On-chain tracking: Every transaction can be verified directly on the Solana blockchain at any time.",
      "Platform reports: Solbridge Capital publishes regular reports on platform performance, default rates, and interest rate developments.",
    ],
  },
];

export default function SecurityPage() {
  return (
    <div className="bg-white">
      <InnerNavbar />

      {/* Hero */}
      <section className="bg-[#203828] py-24 md:py-32 px-[7%] text-center">
        <p className="text-[#35de8d] text-sm font-semibold uppercase tracking-widest mb-4">
          Security
        </p>
        <h1 className="text-[2.4rem] md:text-[3.5rem] font-black text-white leading-[1.08] max-w-3xl mx-auto mb-6">
          How investors are protected on Solbridge Capital
        </h1>
        <p className="text-white/60 text-[16px] max-w-xl mx-auto leading-relaxed">
          Through the combination of modern blockchain technology and clear platform
          rules, we ensure your money is managed securely and transparently.
        </p>
      </section>

      {/* Security sections */}
      <section className="py-20 md:py-28 px-[7%]">
        <div className="mx-auto max-w-4xl space-y-16">
          {SECTIONS.map(({ icon: Icon, title, body, items }) => (
            <div key={title} className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10">
              <div className="w-11 h-11 rounded-xl bg-[#eef2ee] flex items-center justify-center shrink-0">
                <Icon size={20} className="text-[#203828]" />
              </div>
              <div>
                <h2 className="text-[1.4rem] font-bold text-[#111827] mb-3 leading-snug">
                  {title}
                </h2>
                <p className="text-[#6b7280] text-[15px] leading-relaxed mb-4">{body}</p>
                {items.length > 0 && (
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#35de8d] mt-2 shrink-0" />
                        <span className="text-[#6b7280] text-[14px] leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="px-[7%]">
        <div className="mx-auto max-w-4xl border-t border-[#f0f0ef]" />
      </div>

      {/* Important notice */}
      <section className="py-16 px-[7%]">
        <div className="mx-auto max-w-4xl">
          <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-8">
            <h3 className="font-bold text-[#111827] text-lg mb-3">
              Important notice
            </h3>
            <p className="text-[#6b7280] text-[14px] leading-relaxed italic">
              Investments on Solbridge Capital involve risks. These include, among
              others, the risk of borrower default and general market risks. The
              platform does not provide capital protection. Please only invest
              amounts whose potential loss you can bear.
            </p>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="py-16 md:py-20 px-[7%] bg-[#f9f9f7]">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h2 className="text-[1.8rem] md:text-[2.2rem] font-bold text-[#111827] mb-3">
            Built on Solana. Trusted by 500k+.
          </h2>
          <p className="text-[#6b7280] text-[15px] max-w-xl mx-auto leading-relaxed">
            Every transaction publicly verifiable on-chain. Every repayment automated by smart contract. No middlemen, no hidden fees.
          </p>
        </div>
        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              stat: "100%",
              label: "On-chain transactions",
              desc: "Every loan, repayment, and interest payment recorded on the Solana blockchain.",
            },
            {
              stat: "0",
              label: "Platform access to funds",
              desc: "Smart contracts hold all capital. Solbridge never touches investor funds.",
            },
            {
              stat: "24/7",
              label: "Automated repayments",
              desc: "Smart contracts execute payments automatically — no manual processing needed.",
            },
          ].map(({ stat, label, desc }) => (
            <div key={label} className="bg-white rounded-2xl p-7 shadow-sm">
              <p className="text-[2.5rem] font-black text-[#203828] leading-none mb-1">
                {stat}
              </p>
              <p className="font-semibold text-[#111827] text-sm mb-2">{label}</p>
              <p className="text-[#9ca3af] text-[13px] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-[7%] bg-[#203828] text-center">
        <h2 className="text-[2rem] md:text-[2.8rem] font-bold text-white mb-4 leading-tight">
          Invest with confidence.
        </h2>
        <p className="text-white/60 text-base mb-8 max-w-sm mx-auto leading-relaxed">
          Blockchain-verified, smart-contract-secured, fully transparent.
        </p>
        <button
          type="button"
          className="bg-[#35de8d] text-[#111827] font-bold text-base px-8 py-4 rounded-xl hover:bg-[#35de8d]/90 transition-colors"
        >
          Start investing free
        </button>
      </section>

      <LandingFooter />
    </div>
  );
}
