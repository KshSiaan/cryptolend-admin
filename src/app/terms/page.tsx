import { LandingFooter } from "@/components/landing-footer";
import { LandingNavbar } from "@/components/landing-navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <LandingNavbar />

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-16">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: June 2025
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Solbridge Capital ("the Platform"), you agree to be
              bound by these Terms of Service. If you do not agree, you may not
              use the Platform. Solbridge Capital reserves the right to update these
              terms at any time. Continued use after changes constitutes
              acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              2. Eligibility
            </h2>
            <p>
              You must be at least 18 years of age and legally permitted to
              invest in your jurisdiction to create an account. By registering,
              you represent and warrant that you meet these requirements.
              Solbridge Capital may require identity verification (KYC) before
              permitting investment activity.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              3. Platform Services
            </h2>
            <p>
              Solbridge Capital provides a peer-to-peer lending marketplace on the
              Solana blockchain. The Platform connects investors with verified
              borrowers. Solbridge Capital does not act as a lender, broker, or
              financial advisor. All investment decisions are made solely by the
              user.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              4. Investment Risks
            </h2>
            <p>
              Investing through Solbridge Capital involves significant risk, including
              the possible loss of principal. Loans are not guaranteed, and
              borrower default may result in partial or total loss of your
              investment. Past returns are not indicative of future performance.
              You should not invest funds you cannot afford to lose.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              5. Account Responsibilities
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials. You agree to notify Solbridge Capital immediately of
              any unauthorized access. You are solely responsible for all
              activity that occurs under your account.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              6. Fees
            </h2>
            <p>
              Solbridge Capital may charge service fees on returns or transactions. All
              applicable fees will be disclosed before any transaction is
              confirmed. Solbridge Capital reserves the right to modify its fee
              structure with reasonable notice to users.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              7. Termination
            </h2>
            <p>
              Solbridge Capital may suspend or terminate your account at any time for
              violation of these Terms, fraudulent activity, or at our
              discretion. Upon termination, your access to the Platform will
              cease. Any active investments will continue per their original
              terms until resolution.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              8. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, Solbridge Capital shall not be
              liable for any indirect, incidental, or consequential damages
              arising from your use of the Platform, including investment losses,
              data loss, or service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              9. Governing Law
            </h2>
            <p>
              These Terms are governed by applicable law. Any disputes arising
              from use of the Platform shall be resolved through binding
              arbitration, except where prohibited by law.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              10. Contact
            </h2>
            <p>
              For questions regarding these Terms, contact us at{" "}
              <span className="text-orange font-medium">
                legal@solbridgecapital.io
              </span>
              .
            </p>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
