"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { howl } from "@/lib/utils";
import type { AdminUser } from "@/types/auth";
import type { ApiResponse } from "@/types/base";

const statusBadge: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-600",
};

function UserAvatar({ user }: { user: AdminUser }) {
  if (user.profile_photo_url) {
    return (
      <Image
        src={user.profile_photo_url}
        alt={user.name}
        width={36}
        height={36}
        className="size-9 rounded-full object-cover shrink-0 border border-border"
      />
    );
  }
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="size-9 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border">
      <span className="text-xs font-semibold text-muted-foreground">
        {initials}
      </span>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function UserDetailDialog({
  user,
  onClose,
  onStatusChange,
  onRefresh,
  onViewReferrals,
}: {
  user: AdminUser;
  onClose: () => void;
  onStatusChange: (updated: AdminUser) => void;
  onRefresh?: () => void;
  onViewReferrals?: (user: AdminUser) => void;
}) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;
  const [confirmAction, setConfirmAction] = useState<
    "suspend" | "activate" | null
  >(null);
  const [pending, setPending] = useState(false);
  
  const [adjusting, setAdjusting] = useState(false);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"sol" | "eur">("sol");
  const [reason, setReason] = useState("");
  const [adjustPending, setAdjustPending] = useState(false);

  async function handleStatusUpdate() {
    if (!token || !confirmAction) return;
    const newStatus = confirmAction === "suspend" ? "suspended" : "active";
    setPending(true);
    try {
      const res = await howl<ApiResponse<AdminUser>>(
        `/admin/users/${user.id}/status`,
        { method: "PATCH", token, body: { status: newStatus } },
      );
      toast.success(
        `User ${newStatus === "active" ? "activated" : "suspended"}.`,
      );
      setConfirmAction(null);
      onStatusChange(res.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Status update failed.");
    } finally {
      setPending(false);
    }
  }

  async function handleAdjustBalance(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !amount || !reason) return;
    setAdjustPending(true);
    try {
      await howl(`/admin/users/${user.id}/balance`, {
        method: "POST",
        token,
        body: {
          amount: Number(amount),
          amount_currency: currency,
          reason,
        },
      });
      toast.success("Balance adjusted successfully.");
      setAdjusting(false);
      setAmount("");
      setReason("");
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Adjustment failed.");
    } finally {
      setAdjustPending(false);
    }
  }

  return (
    <>
      <Dialog
        open
        onOpenChange={(o) => {
          if (!o) onClose();
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!adjusting ? (
              <>
                <div className="flex items-center gap-3">
                  <UserAvatar user={user} />
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="rounded-lg border border-border divide-y divide-border text-sm">
                  {[
                    { label: "Role", value: user.role },
                    { label: "Status", value: user.status },
                    { label: "Balance", value: `${user.wallet.balance_sol} SOL${user.wallet.balance_eur ? ` (≈ ${user.wallet.balance_eur} €)` : ""}` },
                    {
                      label: "Frozen",
                      value: `${user.wallet.frozen_balance_sol} SOL${user.wallet.frozen_balance_eur ? ` (≈ ${user.wallet.frozen_balance_eur} €)` : ""}`,
                    },
                    { label: "Joined", value: formatDate(user.created_at) },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between px-3 py-2">
                      <span className="text-muted-foreground">{r.label}</span>
                      <span className="font-medium capitalize">{r.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between px-3 py-2">
                    <span className="text-muted-foreground">Email Status</span>
                    <span className="font-medium flex items-center gap-1.5 text-sm">
                      {user.email_verified_at ? (
                        <><CheckCircle2 className="w-4 h-4 text-green-500" /> Verified</>
                      ) : (
                        <><XCircle className="w-4 h-4 text-red-500" /> Unverified</>
                      )}
                    </span>
                  </div>
                  {user.referral_code && (
                    <div className="flex justify-between px-3 py-2">
                      <span className="text-muted-foreground">Referral Code</span>
                      <span className="font-medium capitalize">{user.referral_code}</span>
                    </div>
                  )}
                  {user.referrals_count !== undefined && (
                    <div className="flex justify-between px-3 py-2">
                      <span className="text-muted-foreground">Total Referred</span>
                      {user.referrals_count > 0 && onViewReferrals ? (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.referrals_count}</span>
                          <button
                            onClick={() => {
                              onViewReferrals(user);
                              onClose();
                            }}
                            className="text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary/20 px-2 py-0.5 rounded transition-colors"
                          >
                            View All
                          </button>
                        </div>
                      ) : (
                        <span className="font-medium">{user.referrals_count}</span>
                      )}
                    </div>
                  )}
                  {user.referred_by && (
                    <div className="flex justify-between px-3 py-2">
                      <span className="text-muted-foreground">Referred By</span>
                      <span className="font-medium capitalize">{user.referred_by.name} ({user.referred_by.email})</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <form onSubmit={handleAdjustBalance} className="space-y-4">
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      step="any" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 50 or -50"
                      required
                    />
                    <select 
                      value={currency} 
                      onChange={(e) => setCurrency(e.target.value as "sol"|"eur")}
                      className="border border-input rounded-md px-3 text-sm bg-background font-medium"
                    >
                      <option value="sol">SOL</option>
                      <option value="eur">EUR</option>
                    </select>
                  </div>
                  <p className="text-xs text-muted-foreground">Use negative values to deduct.</p>
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Input 
                    value={reason} 
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Why is this being adjusted?"
                    required
                    minLength={5}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setAdjusting(false)} disabled={adjustPending}>Cancel</Button>
                  <Button type="submit" disabled={adjustPending}>{adjustPending ? "Saving..." : "Adjust Balance"}</Button>
                </div>
              </form>
            )}
          </div>
          {!adjusting && (
            <DialogFooter className="sm:justify-between items-center mt-4">
              <Button type="button" variant="secondary" onClick={() => setAdjusting(true)}>Adjust Balance</Button>
              <div className="flex items-center gap-2">
                {user.status === "active" ? (
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setConfirmAction("suspend")}
                  >
                    Suspend
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setConfirmAction("activate")}
                  >
                    Activate
                  </Button>
                )}
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!confirmAction}
        onOpenChange={(o) => {
          if (!o) setConfirmAction(null);
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "suspend" ? "Suspend" : "Activate"} User
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "suspend"
                ? `Suspend ${user.name}? They will lose access to the platform.`
                : `Activate ${user.name}? They will regain access to the platform.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={pending}
              onClick={() => setConfirmAction(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant={confirmAction === "suspend" ? "destructive" : "default"}
              disabled={pending}
              onClick={handleStatusUpdate}
            >
              {pending
                ? "Updating…"
                : confirmAction === "suspend"
                  ? "Suspend"
                  : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<AdminUser | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [referrerFilter, setReferrerFilter] = useState<AdminUser | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, refetch } = useAdminUsers(page, debouncedSearch, referrerFilter?.id);

  const users = data?.data?.data ?? [];
  const lastPage = data?.data?.last_page ?? 1;
  const total = data?.data?.total ?? 0;

  function handleStatusChange(updated: AdminUser) {
    setViewing(updated);
    void refetch();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <div className="flex items-center gap-4">
          {referrerFilter && (
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm">
              <span>Referrals by: <span className="font-semibold">{referrerFilter.name}</span></span>
              <button 
                onClick={() => {
                  setReferrerFilter(null);
                  setPage(1);
                }}
                className="hover:text-primary/70 font-bold ml-1"
              >
                &times;
              </button>
            </div>
          )}
          <Input
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />
        </div>
      </div>

      <Card className="shadow-none">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No users found.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-5 py-3.5 gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <UserAvatar user={user} />
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-semibold truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                        {user.email}
                        {user.email_verified_at ? (
                          <span title="Verified" className="flex items-center">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                          </span>
                        ) : (
                          <span title="Unverified" className="flex items-center">
                            <XCircle className="w-3 h-3 text-red-500" />
                          </span>
                        )}
                      </p>
                      {user.referred_by && (
                        <p className="text-[10px] text-muted-foreground truncate">
                          Referred by: {user.referred_by.name}
                        </p>
                      )}
                      {(user.referrals_count ?? 0) > 0 && (
                        <button 
                          onClick={() => {
                            setReferrerFilter(user);
                            setPage(1);
                          }}
                          className="text-[10px] truncate text-primary hover:underline font-medium text-left cursor-pointer"
                        >
                          Total Referred: {user.referrals_count}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-right shrink-0">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-foreground">{user.wallet.balance_sol} SOL</span>
                      {user.wallet.balance_eur && <span className="text-[10px] text-muted-foreground">≈ {user.wallet.balance_eur} €</span>}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-muted-foreground">{user.wallet.frozen_balance_sol} frozen</span>
                      {user.wallet.frozen_balance_eur && <span className="text-[10px] text-muted-foreground">≈ {user.wallet.frozen_balance_eur} €</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      className={`${statusBadge[user.status] ?? ""} border-0 capitalize`}
                    >
                      {user.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setViewing(user)}
                    >
                      View
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
            {total} user{total !== 1 ? "s" : ""}
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

      {viewing && (
        <UserDetailDialog
          user={viewing}
          onClose={() => setViewing(null)}
          onStatusChange={handleStatusChange}
          onRefresh={() => {
            setViewing(null);
            void refetch();
          }}
          onViewReferrals={(user) => {
            setReferrerFilter(user);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}
