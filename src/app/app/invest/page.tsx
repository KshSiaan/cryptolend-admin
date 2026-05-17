"use client";

import { loans, user } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { LoanDetailSheet } from "@/components/sheets/loan-detail-sheet";

const statusStyles: Record<string, { badge: string; label: string }> = {
  active: { badge: "bg-green-pos/10 text-green-pos", label: "active" },
  funded: { badge: "bg-purple-bg text-purple", label: "funded" },
  repaying: { badge: "bg-orange-bg text-orange", label: "repaying" },
  closed: { badge: "bg-muted text-muted-foreground", label: "closed" },
};

export default function InvestPage() {
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
              {user.balance.toLocaleString()} SOL
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">
            {user.initials}
          </div>
        </div>
      </div>

      {/* Loan cards */}
      <div className="space-y-4">
        {loans.map((loan) => {
          const pct = Math.round((loan.raised / loan.target) * 100);
          const st = statusStyles[loan.status];
          const canInvest = loan.status === "active";

          return (
            <div
              key={loan.id}
              className="rounded-2xl bg-card border border-border p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-base font-bold">{loan.title}</h3>
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
                {loan.sector} · {loan.durationMonths} mo · {loan.investors}{" "}
                investors
              </p>

              <div className="flex items-center gap-3 text-sm">
                <span>
                  Target <span className="font-bold">{loan.target} SOL</span>
                </span>
                <span>
                  Raised <span className="font-bold">{loan.raised} SOL</span>
                </span>
                <span className="text-green-pos font-bold">
                  APR {loan.apr}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-foreground rounded-full"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{pct}% funded</p>
              </div>

              <div className="flex gap-2 pt-1">
                <LoanDetailSheet loan={loan}>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-xl bg-foreground text-background px-4 py-2.5 text-sm font-medium"
                  >
                    {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
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
                  <LoanDetailSheet loan={loan}>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-xl bg-foreground text-background px-4 py-2.5 text-sm font-medium"
                    >
                      {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
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
                  </LoanDetailSheet>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
