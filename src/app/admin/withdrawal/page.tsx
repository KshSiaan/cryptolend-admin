"use client";

import { Check, Eye, X } from "lucide-react";
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
  type AdminWithdrawalStatus,
  useAdminWithdrawalRequests,
} from "@/hooks/use-admin-withdrawal-requests";
import { howl, formatSol } from "@/lib/utils";
import type { AdminWithdrawalRequest } from "@/types/auth";
import type { ApiResponse } from "@/types/base";

const statusBadge: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-blue-100 text-blue-700",
  processing: "bg-blue-100 text-blue-700",
  broadcasted: "bg-indigo-100 text-indigo-700",
  confirmed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-600",
  rejected: "bg-red-100 text-red-600",
  cancelled: "bg-muted text-muted-foreground",
  completed: "bg-green-100 text-green-700",
};

const withdrawalStatuses: AdminWithdrawalStatus[] = [
  "all",
  "pending",
  "approved",
  "processing",
  "broadcasted",
  "confirmed",
  "failed",
  "rejected",
  "cancelled",
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

function truncateAddr(addr: string) {
  if (addr.length <= 20) return addr;
  return `${addr.slice(0, 10)}…${addr.slice(-6)}`;
}

function ReviewDialog({
  req,
  onClose,
  onSuccess,
}: {
  req: AdminWithdrawalRequest;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);

  const canReview = req.status === "pending";

  async function handleApprove() {
    if (!token) return;
    setPending(true);
    try {
      await howl<ApiResponse<unknown>>(
        `/admin/withdrawal-requests/${req.id}/approve`,
        { method: "POST", token },
      );
      toast.success("Withdrawal approved.");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Approval failed.");
    } finally {
      setPending(false);
    }
  }

  async function handleMarkAsPaid() {
    if (!token) return;
    setPending(true);
    try {
      await howl<ApiResponse<unknown>>(
        `/admin/withdrawal-requests/${req.id}/mark-as-approved`,
        { method: "POST", token },
      );
      toast.success("Withdrawal marked as paid.");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Manual pay failed.");
    } finally {
      setPending(false);
    }
  }

  async function handleReject() {
    if (!token) return;
    if (!reason.trim()) {
      toast.error("Reason required for rejection.");
      return;
    }
    setPending(true);
    try {
      await howl<ApiResponse<unknown>>(
        `/admin/withdrawal-requests/${req.id}/reject`,
        { method: "POST", token, body: { reason: reason.trim() } },
      );
      toast.success("Withdrawal rejected.");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Rejection failed.");
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
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {canReview ? "Review Withdrawal" : "Withdrawal Details"} #{req.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="rounded-lg border border-border divide-y divide-border text-sm">
            {[
              { label: "User", value: `${req.user.name}` },
              { label: "Email", value: req.user.email },
              { label: "Amount", value: `${formatSol(req.amount_sol)} SOL${req.amount_eur ? ` (≈ ${req.amount_eur} €)` : ""}` },
              { label: "To", value: req.recipient_address },
              { label: "Submitted", value: formatDate(req.created_at) },
              { label: "Status", value: req.status },
              ...(req.failure_reason
                ? [{ label: "Reason", value: req.failure_reason }]
                : []),
            ].map((r) => (
              <div key={r.label} className="flex justify-between px-3 py-2">
                <span className="text-muted-foreground">{r.label}</span>
                <span className="font-medium text-right max-w-[68%] break-all">
                  {r.value}
                </span>
              </div>
            ))}
          </div>

          {canReview && (
            <>
              <div className="space-y-1.5">
                {/** biome-ignore lint/a11y/noLabelWithoutControl: intentional */}
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Rejection reason (required to reject)
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Suspicious address..."
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  className="w-full gap-1.5 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
                  onClick={handleReject}
                  disabled={pending}
                >
                  <X className="size-3.5 shrink-0" />
                  Reject
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-1.5"
                  onClick={handleMarkAsPaid}
                  disabled={pending}
                >
                  <Check className="size-3.5 shrink-0" />
                  {pending ? "..." : "Mark as Paid (Manual Pay)"}
                </Button>
                <Button
                  className="w-full gap-1.5 bg-[oklch(0.52_0.165_145)] hover:bg-[oklch(0.47_0.165_145)] text-white"
                  onClick={handleApprove}
                  disabled={pending}
                >
                  <Check className="size-3.5 shrink-0" />
                  {pending ? "…" : "Approve (Automatic Pay)"}
                </Button>
              </div>
            </>
          )}

          {!canReview && (
            <Button variant="outline" className="w-full" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function WithdrawalPage() {
  const [status, setStatus] = useState<AdminWithdrawalStatus>("all");
  const [page, setPage] = useState(1);
  const [reviewing, setReviewing] = useState<AdminWithdrawalRequest | null>(
    null,
  );

  const { data, isLoading, refetch } = useAdminWithdrawalRequests(status, page);

  const requests = data?.data?.data ?? [];
  const lastPage = data?.data?.last_page ?? 1;
  const total = data?.data?.total ?? 0;

  function handleStatusChange(v: string) {
    setStatus(v as AdminWithdrawalStatus);
    setPage(1);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Withdrawals</h1>
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {withdrawalStatuses.map((s) => (
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
          ) : requests.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No {status === "all" ? "" : `${formatStatusLabel(status)} `}
              withdrawal requests.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between px-5 py-4 gap-4"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold">#{req.id}</span>
                      <span className="text-sm font-medium">
                        {req.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {req.user.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-foreground">{formatSol(req.amount_sol)} SOL</span>
                        {req.amount_eur && <span className="text-[10px]">≈ {req.amount_eur} €</span>}
                      </div>
                      <span className="font-mono">
                        {truncateAddr(req.recipient_address)}
                      </span>
                      <span>{formatDate(req.created_at)}</span>
                    </div>
                    {req.failure_reason && (
                      <p className="text-xs text-destructive">
                        {req.failure_reason}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      className={`${statusBadge[req.status] ?? "bg-muted text-muted-foreground"} border-0 capitalize`}
                    >
                      {formatStatusLabel(req.status)}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setReviewing(req)}
                    >
                      {req.status === "pending" ? (
                        <>
                          <Eye className="size-3.5 mr-1.5" />
                          Review
                        </>
                      ) : (
                        "View"
                      )}
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
            {total} request{total !== 1 ? "s" : ""}
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
          req={reviewing}
          onClose={() => setReviewing(null)}
          onSuccess={() => {
            setReviewing(null);
            void refetch();
          }}
        />
      )}
    </div>
  );
}
