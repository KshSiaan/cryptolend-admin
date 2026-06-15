import { LandingFooter } from "@/components/landing-footer";
import { LandingNavbar } from "@/components/landing-navbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <LandingNavbar />

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-16">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: June 2025
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              1. Information We Collect
            </h2>
            <p>
              When you register and use Solbridge Capital, we collect personal
              information including your name, email address, government-issued
              ID (for KYC), Solana wallet address, and transaction history. We
              also collect usage data such as IP addresses, browser type, and
              pages visited.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              2. How We Use Your Information
            </h2>
            <p>
              We use your data to operate the Platform, verify your identity,
              process transactions, send account notifications, and comply with
              legal obligations. We do not sell your personal data to third
              parties. We may share data with KYC verification partners,
              regulatory authorities, and service providers strictly necessary
              for Platform operation.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              3. KYC &amp; Identity Verification
            </h2>
            <p>
              To comply with anti-money laundering (AML) regulations, we require
              identity verification before you may invest. KYC data is processed
              by our verification partner and stored securely. We retain KYC
              records as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              4. Blockchain Data
            </h2>
            <p>
              Transactions on the Solana blockchain are public and immutable.
              Your wallet address and transaction amounts may be visible on-chain.
              Solbridge Capital does not control the public nature of blockchain data.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              5. Cookies
            </h2>
            <p>
              We use cookies and similar technologies to maintain your session,
              remember preferences, and analyze Platform usage. You may disable
              cookies in your browser, but some features may not function
              correctly as a result.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              6. Data Retention
            </h2>
            <p>
              We retain your personal data for as long as your account is active
              and as required by applicable law. Upon account deletion, we will
              anonymize or delete your data within 90 days, except where
              retention is legally mandated.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              7. Your Rights
            </h2>
            <p>
              Depending on your jurisdiction, you may have rights to access,
              correct, delete, or port your personal data. To exercise these
              rights, contact us at the email below. We will respond within 30
              days.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              8. Security
            </h2>
            <p>
              We implement industry-standard security measures including
              encryption at rest and in transit, access controls, and regular
              security audits. However, no system is completely secure. You are
              responsible for keeping your account credentials confidential.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you
              of material changes via email or a prominent notice on the
              Platform. Continued use after changes constitutes acceptance of the
              updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              10. Contact
            </h2>
            <p>
              For privacy-related inquiries, contact our Data Protection Officer
              at{" "}
              <span className="text-orange font-medium">
                privacy@solbridgecapital.io
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
