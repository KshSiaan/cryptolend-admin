"use client";

import { loans, portfolioEarnings, user } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const activeLoans = loans.filter(
  (l) => l.status === "active" || l.status === "repaying",
);

const userPositions = [
  { loanId: 1, invested: 0.45, earned: 0.0126 },
  { loanId: 2, invested: 0.5, earned: 0.0186 },
];

export default function PortfolioPage() {
  const totalEarning = portfolioEarnings[1].amount;
  const activeCount = userPositions.length;

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
        <div className="rounded-2xl bg-card border border-border divide-y divide-border">
          {userPositions.map((pos) => {
            const loan = loans.find((l) => l.id === pos.loanId)!;
            return (
              <div
                key={pos.loanId}
                className="flex items-center justify-between px-4 py-3.5"
              >
                <div>
                  <p className="text-sm font-semibold">{loan.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {pos.invested.toFixed(2)} ETH · {loan.apr}% APR · Next:{" "}
                    {loan.nextPayment}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-pos">
                    +{pos.earned.toFixed(4)} SOL
                  </p>
                  <span className="inline-block mt-0.5 rounded-full bg-green-pos/10 text-green-pos text-[10px] px-2 py-0.5 font-medium">
                    active
                  </span>
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
    </div>
  );
}
