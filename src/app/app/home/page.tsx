"use client";

import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, BarChart2 } from "lucide-react";
import { user, loans, transactions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { DepositSheet } from "@/components/sheets/deposit-sheet";
import { WithdrawSheet } from "@/components/sheets/withdraw-sheet";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const firstName = user.name.split(" ")[0];

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">CryptoLend</h1>
          <p className="text-sm text-muted-foreground">
            {getGreeting()}, {firstName}
          </p>
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

      {/* Balance Card */}
      <div className="rounded-2xl bg-foreground text-background p-5 space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest opacity-60">
            Available Balance
          </p>
          <p className="text-4xl font-bold mt-1">
            {user.availableBalance.toFixed(4)}{" "}
            <span className="text-xl font-semibold">SOL</span>
          </p>
          <p className="text-sm opacity-60 mt-0.5">
            ≈ ${user.availableUsd.toLocaleString()} USD
          </p>
        </div>
        <div className="flex gap-2">
          <DepositSheet>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors px-4 py-2.5 text-sm font-medium text-background"
            >
              <ArrowDownLeft size={16} />
              Deposit
            </button>
          </DepositSheet>
          <WithdrawSheet>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors px-4 py-2.5 text-sm font-medium text-background"
            >
              <ArrowUpRight size={16} />
              Withdraw
            </button>
          </WithdrawSheet>
          <Link
            href="/app/invest"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-background text-foreground hover:bg-background/90 transition-colors px-4 py-2.5 text-sm font-medium"
          >
            <BarChart2 size={16} />
            Invest
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card border border-border p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Invested
          </p>
          <p className="text-2xl font-bold mt-1">{user.invested.toFixed(4)}</p>
          <p className="text-xs text-muted-foreground">SOL</p>
        </div>
        <div className="rounded-2xl bg-card border border-border p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Earnings
          </p>
          <p className="text-2xl font-bold mt-1 text-green-pos">
            {user.earnings.toFixed(4)}
          </p>
          <p className="text-xs text-muted-foreground">SOL</p>
        </div>
      </div>

      {/* Active Investments */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Active Investments
        </h2>
        <div className="rounded-2xl bg-card border border-border divide-y divide-border">
          {loans
            .filter((l) => l.status === "active")
            .map((loan) => (
              <div
                key={loan.id}
                className="flex items-center justify-between px-4 py-3.5"
              >
                <div>
                  <p className="text-sm font-semibold">{loan.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {loan.apr}% APR · Next: {loan.nextPayment}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-pos">
                    +{loan.userEarned.toFixed(4)} SOL
                  </p>
                  <span className="inline-block mt-0.5 rounded-full bg-green-pos/10 text-green-pos text-[10px] px-2 py-0.5 font-medium">
                    active
                  </span>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Recent Transactions
        </h2>
        <div className="rounded-2xl bg-card border border-border divide-y divide-border">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between px-4 py-3.5"
            >
              <div>
                <p className="text-sm font-medium">{tx.label}</p>
                <p className="text-xs text-muted-foreground">{tx.date}</p>
              </div>
              <p
                className={cn(
                  "text-sm font-semibold",
                  tx.positive ? "text-green-pos" : "text-red-neg",
                )}
              >
                {tx.positive ? "+" : "-"}
                {tx.amount.toFixed(tx.amount < 1 ? 3 : 0)} SOL
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
