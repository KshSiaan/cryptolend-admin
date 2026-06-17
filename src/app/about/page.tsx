import { InnerNavbar } from "@/components/inner-navbar";
import { LandingFooter } from "@/components/landing-footer";

const TIMELINE = [
  {
    year: "2015",
    text: "Solbridge Capital founded as a decentralized peer-to-peer lending platform on the Solana blockchain. Our mission from day one: democratize financing and investing — for everyone, everywhere, without banks.",
  },
  {
    year: "2016",
    text: "Reached our first 10,000 registered users and completed the first successful P2P loan matches between private individuals — proof that blockchain-based peer-to-peer lending works and is embraced by real people.",
  },
  {
    year: "2017",
    text: "Introduced fully automated smart contracts for secure, transparent, and tamper-proof loan processing. From that point on, disbursements, repayments, and interest credits run without any manual intervention.",
  },
  {
    year: "2018",
    text: "Surpassed €100 million in total loan volume facilitated through the platform — a milestone showing that user trust in decentralized lending is growing steadily.",
  },
  {
    year: "2019",
    text: "Expanded the platform to include business loans. In addition to private individuals, small and medium-sized enterprises can now raise capital through Solbridge Capital — quickly, simply, and on fair terms.",
  },
  {
    year: "2020",
    text: "Launched an automated credit scoring system with clear risk classes for all borrowers. Investors can now filter by return-to-risk profile and consciously structure their portfolio.",
  },
  {
    year: "2021",
    text: "Expanded into three new European markets and surpassed 200,000 registered users. Solbridge Capital grows into a pan-European lending platform.",
  },
  {
    year: "2022",
    text: "Launched a smart diversification tool: investors can now automatically distribute their capital across dozens of loans — for maximum risk diversification with minimal effort.",
  },
  {
    year: "2023",
    text: "Successful funding round with active participation from the Solbridge Capital community. Our users believe in our vision — and invest in our future.",
  },
  {
    year: "2024",
    text: "Market entry into Germany, France, and the Netherlands. Simultaneously introduced new business credit products, including working capital loans and growth financing.",
  },
  {
    year: "2025",
    text: "Launch of fully automated portfolio management. Investors now benefit from passive income on autopilot — the platform selects, manages, and optimizes your loan portfolios automatically.",
  },
];

const STATS = [
  { value: "500k+", label: "Registered users" },
  { value: "€600M+", label: "Total loan volume facilitated" },
  { value: "150+", label: "Team members" },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <InnerNavbar />

      {/* Hero */}
      <section className="bg-[#203828] py-24 md:py-32 px-[7%] text-center">
        <p className="text-[#35de8d] text-sm font-semibold uppercase tracking-widest mb-4">
          About us
        </p>
        <h1 className="text-[2.4rem] md:text-[3.5rem] font-black text-white leading-[1.08] max-w-3xl mx-auto">
          We are changing the way people put their money to work for others
        </h1>
      </section>

      {/* Stats */}
      <section className="py-16 px-[7%] border-b border-[#f0f0ef]">
        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 text-center md:divide-x divide-[#e5e7eb]">
          {STATS.map(({ value, label }) => (
            <div key={label} className="px-8">
              <p className="text-[3rem] md:text-[3.5rem] font-black text-[#111827] leading-none mb-2">
                {value}
              </p>
              <p className="text-[#6b7280] text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28 px-[7%]">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <h2 className="text-[2rem] md:text-[2.6rem] font-bold text-[#111827] leading-tight mb-6">
              Lending and investing,{" "}
              <span className="text-[#203828]">reinvented</span>
            </h2>
          </div>
          <div className="space-y-5 text-[#6b7280] text-[15px] leading-relaxed">
            <p>
              We founded Solbridge Capital so that private individuals and
              companies can benefit directly from each other — without banks,
              without intermediaries, without unnecessary barriers. On our
              peer-to-peer platform, lenders provide funds directly to private
              individuals or businesses and receive attractive interest in
              return. Everything runs transparently, securely, and fully
              automatically via the Solana blockchain.
            </p>
            <p>
              We believe the traditional banking system no longer meets the needs
              of modern investors. Savings account interest? Barely worth
              mentioning. Loans for private individuals? Often bureaucratic and
              slow. Solbridge Capital closes exactly this gap — with a platform
              that connects lenders and borrowers directly, leveraging the speed,
              transparency, and security of blockchain technology.
            </p>
            <p>
              Whether you want to earn a fixed return as a private individual,
              raise capital as a business, or simply put your savings to better
              use — Solbridge Capital has the right solution for you. In a few
              clicks, create your investor or borrower profile, set your terms,
              and the blockchain handles the rest.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-[7%] bg-[#f9f9f7]">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-[2rem] md:text-[2.4rem] font-bold text-[#111827] mb-3">
            Investing reinvented — one block at a time
          </h2>
          <p className="text-[#6b7280] text-[15px] mb-14">
            From our first smart contract to half a million users.
          </p>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[72px] md:left-[88px] top-0 bottom-0 w-px bg-[#e5e7eb] hidden md:block" />
            <div className="space-y-10">
              {TIMELINE.map(({ year, text }) => (
                <div key={year} className="flex gap-6 md:gap-10 items-start">
                  <div className="shrink-0 w-14 md:w-16 text-right">
                    <span className="text-[#203828] font-bold text-sm">{year}</span>
                  </div>
                  {/* Dot */}
                  <div className="hidden md:flex shrink-0 w-5 mt-0.5 items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#35de8d] border-2 border-white ring-1 ring-[#203828]" />
                  </div>
                  <p className="text-[#6b7280] text-[14px] leading-relaxed flex-1 pt-0.5">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28 px-[7%]">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <h2 className="text-[2rem] md:text-[2.6rem] font-bold text-[#111827] leading-tight">
              Meet our team
            </h2>
          </div>
          <div className="space-y-5 text-[#6b7280] text-[15px] leading-relaxed">
            <p>
              Solbridge Capital was founded with a clear vision: financing and
              investing should be accessible to everyone — regardless of banks,
              bureaucracy, or complicated financial products. Today we are an
              international team of experienced finance and blockchain experts,
              developers, and product specialists from more than 15 countries,
              all working toward a common goal: redefining peer-to-peer lending.
            </p>
            <p>
              At Solbridge Capital, we believe that technology creates trust.
              That is why we built on the Solana blockchain as the foundation of
              our platform — for maximum transparency, security, and efficiency.
              Every transaction is traceable, every contract automated, every
              payment reliable. No hidden code, no opaque logic — only open,
              auditable processes on one of the most powerful blockchains in the
              world.
            </p>
            <p>
              Our company culture is shaped by openness, accountability, and the
              unwavering commitment to creating real value for our users. We do
              not sell financial products — we build bridges between people who
              have capital and people who need it. And we do this with the
              conviction that a fair, transparent, and accessible financial
              system is not a utopia — but a question of the right technology.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-[7%] bg-[#203828] text-center">
        <h2 className="text-[2rem] md:text-[2.8rem] font-bold text-white mb-4 leading-tight">
          Ready to start lending?
        </h2>
        <p className="text-white/60 text-base mb-8 max-w-sm mx-auto leading-relaxed">
          Join 500,000+ investors already earning passive income on the Solana
          blockchain.
        </p>
        <button
          type="button"
          className="bg-[#35de8d] text-[#111827] font-bold text-base px-8 py-4 rounded-xl hover:bg-[#35de8d]/90 transition-colors"
        >
          Create free account
        </button>
      </section>

      <LandingFooter />
    </div>
  );
}
