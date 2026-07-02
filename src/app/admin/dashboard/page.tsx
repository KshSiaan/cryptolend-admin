"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useAdminDashboardStats } from "@/hooks/use-admin-dashboard-stats";
import { cn, formatSol } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const { data, isLoading } = useAdminDashboardStats();
  const stats = data?.data;

  const statCards = stats
    ? [
        {
          label: "Total users",
          value: String(stats.total_users),
          valueClass: "",
        },
        {
          label: "Active loans",
          value: String(stats.active_loans),
          valueClass: "",
        },
        {
          label: "Total invested",
          value: `${formatSol(stats.total_invested_sol)} SOL`,
          subValue: stats.total_invested_eur ? `≈ ${stats.total_invested_eur} €` : null,
          valueClass: "",
        },
        {
          label: `Repaid this month (${stats.month})`,
          value: `${formatSol(stats.total_repaid_this_month_sol)} SOL`,
          subValue: stats.total_repaid_this_month_eur ? `≈ ${stats.total_repaid_this_month_eur} €` : null,
          valueClass: "text-green-pos",
        },
      ]
    : [
        { label: "Total users", value: "—", subValue: null, valueClass: "" },
        { label: "Active loans", value: "—", subValue: null, valueClass: "" },
        { label: "Total invested", value: "—", subValue: null, valueClass: "" },
        { label: "Repaid this month", value: "—", subValue: null, valueClass: "" },
      ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="shadow-none">
            <CardContent className="p-6 flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              {isLoading ? (
                <div className="h-9 w-24 rounded bg-muted animate-pulse" />
              ) : (
                <div className={`flex flex-col gap-0.5 ${s.valueClass}`}>
                  <span className="text-3xl font-bold tracking-tight">{s.value}</span>
                  {s.subValue && <span className="text-sm font-medium text-muted-foreground">{s.subValue}</span>}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-none">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold mb-4">Recent Transactions</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {(stats?.recent_transactions ?? []).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-sm font-medium">
                      {tx.transaction_label}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {tx.user.name} · {tx.user.email} ·{" "}
                      {formatDate(tx.processed_at)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-sm font-semibold shrink-0 ml-4 flex flex-col items-end",
                      tx.direction === "credit"
                        ? "text-green-pos"
                        : "text-destructive",
                    )}
                  >
                    <span>
                      {tx.direction === "credit" ? "+" : "-"}
                      {formatSol(tx.amount_sol)} SOL
                    </span>
                    {tx.amount_eur && (
                      <span className="text-xs font-medium opacity-75">
                        {tx.direction === "credit" ? "+" : "-"}
                        {tx.amount_eur} €
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
