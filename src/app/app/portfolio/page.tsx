"use client";

import { LoanDetailSheet } from "@/components/sheets/loan-detail-sheet";
import { loans, portfolioEarnings, user, userPositions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function PortfolioPage() {
  const totalEarning = portfolioEarnings[1].amount;
  const activeCount = userPositions.length;
const statusStyles: Record<string, { badge: string; label: string }> = {
  active: { badge: "bg-green-pos/10 text-green-pos", label: "active" },
  funded: { badge: "bg-purple-bg text-purple", label: "funded" },
  repaying: { badge: "bg-orange-bg text-orange", label: "repaying" },
  closed: { badge: "bg-muted text-muted-foreground", label: "closed" },
};
  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">My Portfolio</h1>
          <p className="text-sm text-muted-foreground">Your investments</p>
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card border border-border p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Earning
          </p>
          <p className="text-2xl font-bold mt-1 text-green-pos">
            {totalEarning.toFixed(4)}
          </p>
          <p className="text-xs text-muted-foreground">SOL total</p>
        </div>
        <div className="rounded-2xl bg-card border border-border p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Active Loans
          </p>
          <p className="text-2xl font-bold mt-1">{activeCount}</p>
          <p className="text-xs text-muted-foreground">Positions</p>
        </div>
      </div>

      {/* Active Investments */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Active Investments
        </h2>
        <div className="space-y-4">
          {userPositions.map((pos) => {
            const loan = loans.find((l) => l.id === pos.loanId)!;

            const paidMonths = pos.schedule.filter((s) => s.state === "paid");
            const dueMonth = pos.schedule.find((s) => s.state === "due");
            const upcomingMonths = pos.schedule.filter((s) => s.state === "upcoming");

            const monthlyReturn =
              ((pos.invested * loan.apr) / 100 / 12) +
              pos.invested / loan.durationMonths;
            const totalExpected = pos.invested + (pos.invested * loan.apr / 100 / 12) * loan.durationMonths;
            const received = paidMonths.length * monthlyReturn;
            const remaining = totalExpected - received;

            return (
              <div
                key={pos.loanId}
                className="rounded-2xl bg-card border border-border p-4 space-y-4"
              >
                {/* Top row: status + loan ID | total expected */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1.5 rounded-full bg-green-pos/10 text-green-pos text-xs font-medium px-2.5 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-pos" />
                      Active
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      #LN-{String(loan.id).padStart(4, "0")}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
                      Total Expected
                    </p>
                    <p className="text-lg font-bold text-green-pos leading-tight">
                      +{totalExpected.toFixed(4)}
                    </p>
                    <p className="text-[9px] text-muted-foreground">SOL interest</p>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base font-bold">{loan.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {loan.description} Started {new Date(pos.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}.
                  </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-5 gap-1 border-t border-border pt-3">
                  {[
                    { label: "INVESTED", value: pos.invested.toFixed(4), className: "" },
                    { label: "APR", value: `${loan.apr}%`, className: "" },
                    { label: "TERM", value: `${loan.durationMonths} mo`, className: "" },
                    { label: "RECEIVED", value: `+${received.toFixed(4)}`, className: "text-green-pos" },
                    { label: "REMAINING", value: remaining.toFixed(4), className: "" },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col gap-0.5">
                      <span className="text-[8px] uppercase tracking-widest text-muted-foreground">
                        {s.label}
                      </span>
                      <span className={`text-xs font-bold tabular-nums ${s.className}`}>
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Repayment schedule */}
                <div className="space-y-2">
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
                    Repayment Schedule
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    {pos.schedule.map((s, i) => (
                      <span
                        // biome-ignore lint/suspicious/noArrayIndexKey: static schedule
                        key={i}
                        className={[
                          "rounded-lg px-2.5 py-1.5 text-[11px] font-semibold",
                          s.state === "paid"
                            ? "bg-green-pos text-white"
                            : s.state === "due"
                              ? "bg-amber-400 text-white"
                              : "bg-muted text-muted-foreground",
                        ].join(" ")}
                      >
                        {s.month}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-pos inline-block" />
                      Paid ({paidMonths.length})
                    </span>
                    {dueMonth && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                        Due · +{monthlyReturn.toFixed(4)} SOL
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 inline-block" />
                      Upcoming ({upcomingMonths.length})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Earnings History */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Earnings History
        </h2>
        <div className="rounded-2xl bg-card border border-border divide-y divide-border">
          {portfolioEarnings.map((entry) => (
            <div
              key={entry.month}
              className="flex items-center justify-between px-4 py-3.5"
            >
              <p className="text-sm font-medium">{entry.month}</p>
              <p className="text-sm font-semibold text-green-pos">
                +{entry.amount.toFixed(4)} SOL
              </p>
            </div>
          ))}
        </div>
      </section>
      <div className="space-y-4">
              {loans.filter((loan) => loan.status !== "active").map((loan) => {
                const pct = Math.round((loan.raised / loan.target) * 100);
                const st = statusStyles[loan.status]
      
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
                    </div>
                  </div>
                );
              })}
            </div>
    </div>
  );
}
