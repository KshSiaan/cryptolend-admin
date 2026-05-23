"use client";

import { useState } from "react";
import type { default as React } from "react";

import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

import { DepositSheet } from "@/components/sheets/deposit-sheet";
import { WithdrawSheet } from "@/components/sheets/withdraw-sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useWalletStats } from "@/hooks/use-wallet-stats";
import { useWalletTransactions } from "@/hooks/use-wallet-transactions";
import { useWithdrawalRequests } from "@/hooks/use-withdrawal-requests";
import { cn } from "@/lib/utils";

const statusBadge: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-600",
  rejected: "bg-red-100 text-red-600",
};

const statusIcon: Record<string, React.ReactElement> = {
  confirmed: <CheckCircle2 size={14} className="text-green-600" />,
  pending: <Clock size={14} className="text-yellow-600" />,
  failed: <XCircle size={14} className="text-red-500" />,
  rejected: <XCircle size={14} className="text-red-500" />,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncateAddress(addr: string) {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

export default function WalletPage() {
  const [txPage, setTxPage] = useState(1);

  const { data: statsData, isLoading: statsLoading } = useWalletStats();
  const { data: txData, isLoading: txLoading } = useWalletTransactions(txPage);
  const { data: withdrawData, isLoading: withdrawLoading } =
    useWithdrawalRequests();

  const stats = statsData?.data;
  const txs = txData?.data?.data ?? [];
  const txLastPage = txData?.data?.last_page ?? 1;
  const withdrawals = withdrawData?.data?.data ?? [];

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Wallet</h1>
        <p className="text-sm text-muted-foreground">Balance &amp; transfers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card border border-border p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Available
          </p>
          {statsLoading ? (
            <div className="h-8 w-24 bg-muted rounded animate-pulse mt-1" />
          ) : (
            <>
              <p className="text-2xl font-bold mt-1">
                {stats ? parseFloat(stats.available_sol).toFixed(4) : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                ≈ {stats?.available_eur ?? "—"} EUR
              </p>
            </>
          )}
        </div>
        <div className="rounded-2xl bg-card border border-border p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Invested
          </p>
          {statsLoading ? (
            <div className="h-8 w-24 bg-muted rounded animate-pulse mt-1" />
          ) : (
            <>
              <p className="text-2xl font-bold mt-1">
                {stats ? parseFloat(stats.invested_sol).toFixed(4) : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                ≈ {stats?.invested_eur ?? "—"} EUR
              </p>
            </>
          )}
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
        <WithdrawSheet availableSol={stats?.available_sol ?? "0"}>
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
        {withdrawLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-16 rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border px-4 py-6 text-center text-sm text-muted-foreground">
            No withdrawal requests yet.
          </div>
        ) : (
          <div className="rounded-2xl bg-card border border-border divide-y divide-border">
            {withdrawals.map((w) => (
              <div key={w.id} className="px-4 py-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold">
                    {parseFloat(w.amount_sol).toFixed(4)} SOL
                  </p>
                  <span
                    className={cn(
                      "rounded-full text-xs px-2.5 py-0.5 font-medium flex items-center gap-1",
                      statusBadge[w.status] ?? "bg-muted text-muted-foreground",
                    )}
                  >
                    {statusIcon[w.status]}
                    {w.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  {truncateAddress(w.recipient_address)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(w.created_at)}
                  {w.failure_reason ? ` · ${w.failure_reason}` : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Transaction History */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Transaction History
        </h2>
        {txLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-14 rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : txs.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border px-4 py-6 text-center text-sm text-muted-foreground">
            No transactions yet.
          </div>
        ) : (
          <>
            <div className="rounded-2xl bg-card border border-border divide-y divide-border">
              {txs.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-4 py-3.5"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-sm font-medium">
                      {tx.transaction_label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(tx.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={cn(
                        "rounded-full text-xs px-2 py-0.5 font-medium capitalize",
                        statusBadge[tx.status] ??
                          "bg-muted text-muted-foreground",
                      )}
                    >
                      {tx.status}
                    </span>
                    <p
                      className={cn(
                        "text-sm font-semibold w-24 text-right",
                        tx.direction === "credit"
                          ? "text-green-pos"
                          : "text-destructive",
                      )}
                    >
                      {tx.direction === "credit" ? "+" : "−"}
                      {tx.amount_sol} SOL
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {txLastPage > 1 && (
              <div className="mt-3 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setTxPage((p) => Math.max(1, p - 1))}
                        aria-disabled={txPage === 1}
                        className={
                          txPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <span className="px-3 py-2 text-sm">
                        {txPage} / {txLastPage}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setTxPage((p) => Math.min(txLastPage, p + 1))
                        }
                        aria-disabled={txPage === txLastPage}
                        className={
                          txPage === txLastPage
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
