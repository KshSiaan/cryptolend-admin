"use client";

import { InvestSheet } from "@/components/sheets/invest-sheet";
import { LoanDetailSheet } from "@/components/sheets/loan-detail-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLoans } from "@/hooks/use-loans";
import { useProfile } from "@/hooks/use-profile";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const statusStyles: Record<string, { badge: string; label: string }> = {
  active: { badge: "bg-green-pos/10 text-green-pos", label: "active" },
  funded: { badge: "bg-purple-bg text-purple", label: "funded" },
  repaying: { badge: "bg-orange-bg text-orange", label: "repaying" },
  closed: { badge: "bg-muted text-muted-foreground", label: "closed" },
};

export default function InvestPage() {
  const [mounted, setMounted] = useState(false);
  const { data: profileData } = useProfile();
  const { data: loansData, isLoading } = useLoans();

  useEffect(() => {
    setMounted(true);
  }, []);

  const profile = profileData?.data;
  const loans = loansData?.data?.data ?? [];

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Browse Loans</h1>
          <p className="text-sm text-muted-foreground">Find opportunities</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Balance
            </p>
            <p className="text-sm font-bold">
              {profile?.wallet_balance_sol ?? "0"} SOL
            </p>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarImage src={profile?.profile_photo_url ?? ""} />
            <AvatarFallback>{initials || "??"}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Loan cards */}
      {!mounted || isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-card border border-border p-4 h-40 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => {
            const st = statusStyles[loan.status] ?? statusStyles.closed;
            const canInvest = loan.status === "active" && !loan.is_fully_funded;

            return (
              <div
                key={loan.id}
                className="rounded-2xl bg-card border border-border p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold">{loan.title}</h3>
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                      {loan.loan_number}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0",
                      st.badge,
                    )}
                  >
                    {st.label}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  {loan.sector} · {loan.duration_months} mo ·{" "}
                  {loan.investors_count} investors
                </p>

                <div className="flex items-center gap-3 text-sm">
                  <span>
                    Target{" "}
                    <span className="font-bold">
                      {loan.target_amount_sol} SOL
                    </span>
                  </span>
                  <span>
                    Raised{" "}
                    <span className="font-bold">
                      {loan.raised_amount_sol} SOL
                    </span>
                  </span>
                  <span className="text-green-pos font-bold">
                    APR {loan.apr_percent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-foreground rounded-full"
                      style={{
                        width: `${Math.min(loan.funded_percent, 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {loan.funded_percent_label}
                  </p>
                </div>

                <div className="flex gap-2 pt-1">
                  <LoanDetailSheet loan={loan}>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-xl bg-foreground text-background px-4 py-2.5 text-sm font-medium"
                    >
                      {/** biome-ignore lint/a11y/noSvgWithoutTitle: icon */}
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-4 h-4"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Details
                    </button>
                  </LoanDetailSheet>

                  {canInvest && (
                    <InvestSheet loan={loan}>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-xl bg-foreground text-background px-4 py-2.5 text-sm font-medium"
                      >
                        {/** biome-ignore lint/a11y/noSvgWithoutTitle: icon */}
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="w-4 h-4"
                        >
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                        Invest
                      </button>
                    </InvestSheet>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
