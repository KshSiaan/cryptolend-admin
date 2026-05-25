"use client";

import { useState } from "react";

import { useCookies } from "react-cookie";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type DepositStatus,
  useAdminDeposits,
} from "@/hooks/use-admin-deposits";
import { howl } from "@/lib/utils";
import type { AdminDeposit } from "@/types/auth";
import type { ApiResponse } from "@/types/base";

const statusBadge: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  manual_review: "bg-orange-100 text-orange-700",
  confirmed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

const depositStatuses: DepositStatus[] = [
  "all",
  "pending",
  "manual_review",
  "confirmed",
  "failed",
];

function formatStatusLabel(status: string) {
  return status.replace("_", " ");
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function lamportsToSol(lamports: number) {
  return (lamports / 1_000_000_000).toFixed(4);
}

function truncate(str: string | null, n = 16) {
  if (!str) return "—";
  return str.length > n ? `${str.slice(0, n)}…` : str;
}

type ReviewAction =
  | { action: "reject"; reason: string }
  | { action: "confirm_chain_amount" }
  | {
      action: "confirm_custom_amount";
      custom_amount_sol: number;
      reason: string;
    };

function ReviewDialog({
  deposit,
  onClose,
  onSuccess,
}: {
  deposit: AdminDeposit;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;
  const [action, setAction] = useState<
    "reject" | "confirm_chain_amount" | "confirm_custom_amount"
  >("confirm_chain_amount");
  const [reason, setReason] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit() {
    if (!token) return;

    let body: ReviewAction;
    if (action === "reject") {
      if (!reason.trim()) {
        toast.error("Reason required for rejection.");
        return;
      }
      body = { action: "reject", reason };
    } else if (action === "confirm_chain_amount") {
      body = { action: "confirm_chain_amount" };
    } else {
      const amt = parseFloat(customAmount);
      if (!amt || amt <= 0) {
        toast.error("Enter valid custom amount.");
        return;
      }
      if (!reason.trim()) {
        toast.error("Reason required for custom amount.");
        return;
      }
      body = {
        action: "confirm_custom_amount",
        custom_amount_sol: amt,
        reason,
      };
    }

    setPending(true);
    try {
      await howl<ApiResponse<unknown>>(`/admin/deposits/${deposit.id}/review`, {
        method: "POST",
        body,
        token,
      });
      toast.success("Review submitted.");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Review failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {deposit.status !== "confirmed"
              ? `Review Deposit #${deposit.id}`
              : `View Deposit #${deposit.id}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="rounded-lg bg-muted/50 border border-border divide-y divide-border text-sm">
            {[
              {
                label: "User",
                value: `${deposit.user.name} (${deposit.user.email})`,
              },
              {
                label: "Amount",
                value: `${lamportsToSol(deposit.amount_lamports)} SOL`,
              },
              { label: "Status", value: deposit.status },
              { label: "Detected", value: formatDate(deposit.detected_at) },
              { label: "TX", value: truncate(deposit.tx_signature, 20) },
            ].map((r) => (
              <div key={r.label} className="flex justify-between px-3 py-2">
                <span className="text-muted-foreground">{r.label}</span>
                <span className="font-medium">{r.value}</span>
              </div>
            ))}
          </div>

          {deposit.status !== "confirmed" && (
            <div className="space-y-1">
              {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
              <label className="text-xs font-semibold uppercase tracking-wider">
                Action {deposit.status}
              </label>
              <Select
                value={action}
                onValueChange={(v) => setAction(v as typeof action)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirm_chain_amount">
                    Confirm chain amount
                  </SelectItem>
                  <SelectItem value="confirm_custom_amount">
                    Confirm custom amount
                  </SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {action === "confirm_custom_amount" && (
            <div className="space-y-1">
              {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
              <label className="text-xs font-semibold uppercase tracking-wider">
                Custom amount (SOL)
              </label>
              <input
                type="number"
                min="0"
                step="0.0001"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          {(action === "reject" || action === "confirm_custom_amount") && (
            <div className="space-y-1">
              {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
              <label className="text-xs font-semibold uppercase tracking-wider">
                Reason
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          )}
          {deposit.status !== "confirmed" && (
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={pending}
              >
                {pending ? "Submitting…" : "Submit"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function DepositsPage() {
  const [status, setStatus] = useState<DepositStatus>("all");
  const [page, setPage] = useState(1);
  const [reviewing, setReviewing] = useState<AdminDeposit | null>(null);

  const { data, isLoading, refetch } = useAdminDeposits(status, page);

  const deposits = data?.data?.data ?? [];
  const lastPage = data?.data?.last_page ?? 1;
  const total = data?.data?.total ?? 0;

  function handleStatusChange(v: string) {
    setStatus(v as DepositStatus);
    setPage(1);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Deposits</h1>
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {depositStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {formatStatusLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-none">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : deposits.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No {status === "all" ? "" : `${formatStatusLabel(status)} `}
              deposits.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {deposits.map((dep) => (
                <div
                  key={dep.id}
                  className="flex items-center justify-between px-5 py-4 gap-4"
                >
                  <div className="min-w-0 space-y-0.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold">#{dep.id}</span>
                      <span className="text-sm font-medium">
                        {dep.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {dep.user.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span>{lamportsToSol(dep.amount_lamports)} SOL</span>
                      <span title={dep.tx_signature ?? ""}>
                        {truncate(dep.tx_signature)}
                      </span>
                      <span>{formatDate(dep.detected_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      className={`${statusBadge[dep.status] ?? ""} border-0 capitalize`}
                    >
                      {formatStatusLabel(dep.status)}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setReviewing(dep)}
                    >
                      {dep.status !== "confirmed" ? "Review" : "View"}
                    </Button>
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
            {total} deposit{total !== 1 ? "s" : ""}
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

      {reviewing && (
        <ReviewDialog
          deposit={reviewing}
          onClose={() => setReviewing(null)}
          onSuccess={() => {
            setReviewing(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
