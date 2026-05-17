"use client";

import { user, walletTransactions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, Clock } from "lucide-react";
import { DepositSheet } from "@/components/sheets/deposit-sheet";
import { WithdrawSheet } from "@/components/sheets/withdraw-sheet";

const pendingWithdrawals = [
  {
    id: 1,
    amount: 0.1,
    address: "www",
    date: "2026-05-11",
    note: "www",
    status: "pending",
  },
];

export default function WalletPage() {
  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Wallet</h1>
          <p className="text-sm text-muted-foreground">
            Balance &amp; transfers
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card border border-border p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Available
          </p>
          <p className="text-2xl font-bold mt-1">
            {user.availableBalance.toFixed(4)}
          </p>
          <p className="text-xs text-muted-foreground">
            ≈ ${(user.availableBalance * 3826).toFixed(0)} EUR
          </p>
        </div>
        <div className="rounded-2xl bg-card border border-border p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Invested
          </p>
          <p className="text-2xl font-bold mt-1">{user.invested.toFixed(4)}</p>
          <p className="text-xs text-muted-foreground">SOL</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <DepositSheet>
          <button
            type="button"
            className="flex flex-col items-center gap-2 rounded-2xl bg-card border border-border p-4 hover:bg-muted/50 transition-colors"
          >
            <ArrowDownLeft size={24} className="text-foreground" />
            <span className="text-sm font-medium">Deposit</span>
          </button>
        </DepositSheet>
        <WithdrawSheet>
          <button
            type="button"
            className="flex flex-col items-center gap-2 rounded-2xl bg-card border border-border p-4 hover:bg-muted/50 transition-colors"
          >
            <ArrowUpRight size={24} className="text-foreground" />
            <span className="text-sm font-medium">Withdraw</span>
          </button>
        </WithdrawSheet>
      </div>

      {/* Withdrawal Requests */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Withdrawal Requests
        </h2>
        {pendingWithdrawals.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border px-4 py-6 text-center text-sm text-muted-foreground">
            No withdrawal requests yet.
          </div>
        ) : (
          <div className="rounded-2xl bg-card border border-border p-4 space-y-3">
            <div className="flex items-center gap-2 text-orange">
              <Clock size={14} />
              <p className="text-sm font-medium">
                Requires admin approval before funds are released.
              </p>
            </div>
            <div className="space-y-3 pt-1">
              {pendingWithdrawals.map((w) => (
                <div key={w.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-bold">
                      {w.amount.toFixed(4)} SOL
                    </p>
                    <span className="rounded-full bg-orange-bg text-orange text-xs px-2.5 py-0.5 font-medium">
                      pending
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{w.address}</p>
                  <p className="text-xs text-muted-foreground">
                    {w.date} · {w.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Transaction History */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Transaction History
        </h2>
        <div className="rounded-2xl bg-card border border-border divide-y divide-border">
          {walletTransactions.map((tx) => (
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
                {tx.amount.toFixed(tx.amount < 1 ? 3 : 1)} SOL
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
