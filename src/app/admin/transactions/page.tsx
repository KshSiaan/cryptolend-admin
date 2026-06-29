"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAdminTransactions } from "@/hooks/use-admin-transactions";
import { cn } from "@/lib/utils";

const statusBadge: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-600",
};

const categoryLabel: Record<string, string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  investment_lock: "Investment Lock",
  investment_unlock: "Investment Unlock",
  repayment: "Repayment",
};

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminTransactions(page);

  const txs = data?.data?.data ?? [];
  const lastPage = data?.data?.last_page ?? 1;
  const total = data?.data?.total ?? 0;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>

      <Card className="shadow-none">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : txs.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No transactions found.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {txs.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-5 py-3.5 gap-4"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-sm font-medium">
                      {categoryLabel[tx.category] ?? tx.transaction_label}
                    </p>
                    {tx.meta?.reason && (
                      <p className="text-[12px] text-muted-foreground/80 italic">
                        "{tx.meta.reason}"
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {tx.user.name} · {tx.user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      className={`${statusBadge[tx.status] ?? "bg-muted text-muted-foreground"} border-0 capitalize`}
                    >
                      {tx.status}
                    </Badge>
                    <span
                      className={cn(
                        "text-sm font-semibold w-28 text-right",
                        tx.direction === "credit"
                          ? "text-green-pos"
                          : "text-destructive",
                      )}
                    >
                      {tx.direction === "credit" ? "+" : "−"}
                      {tx.amount_sol} SOL
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!isLoading && total > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {total} transaction{total !== 1 ? "s" : ""}
          </span>
          {lastPage > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-disabled={page === 1}
                    className={
                      page === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-3 py-2">
                    {page} / {lastPage}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                    aria-disabled={page === lastPage}
                    className={
                      page === lastPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}
