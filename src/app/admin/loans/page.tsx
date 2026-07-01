"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { type AdminLoanStatus, useAdminLoans } from "@/hooks/use-admin-loans";
import { howl } from "@/lib/utils";
import type { AdminLoan } from "@/types/auth";
import type { ApiResponse } from "@/types/base";

type LoanStatus = AdminLoanStatus;
type EditableLoanStatus = Exclude<LoanStatus, "all">;

const statusBadge: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  funded: "bg-blue-100 text-blue-700",
  funding_failed: "bg-red-100 text-red-700",
  repaying: "bg-yellow-100 text-yellow-700",
  closed: "bg-muted text-muted-foreground",
};

const editableLoanStatuses: EditableLoanStatus[] = [
  "active",
  "funded",
  "funding_failed",
  "repaying",
  "closed",
];

const LOAN_STATUS_TRANSITIONS: Record<string, EditableLoanStatus[]> = {
  active: ["funded", "funding_failed", "repaying"], // "repaying" is a frontend shortcut
  funded: ["repaying"],
  funding_failed: [],
  repaying: ["closed"],
  closed: [],
};

const loanStatusFilters: LoanStatus[] = ["all", ...editableLoanStatuses];

const SECTORS = [
  "Real Estate / Rental",
  "Healthcare",
  "Retail / E-Commerce",
  "Construction",
  "Technology / IT Services",
  "Manufacturing",
  "Hospitality (Hotels & Restaurants)",
  "Transportation / Logistics",
  "Financial Services",
  "Professional Services (Consulting, Legal, Agencies)",
];

function formatStatusLabel(status: string) {
  return status.replace("_", " ");
}

interface LoanFormState {
  title: string;
  sector: string;
  description: string;
  currency: "sol" | "eur";
  target_amount: string;
  funded_amount: string;
  apr_percent: string;
  duraction_months: string;
}

const emptyForm: LoanFormState = {
  title: "",
  sector: "Real Estate / Rental",
  description: "",
  currency: "sol",
  target_amount: "",
  funded_amount: "",
  apr_percent: "",
  duraction_months: "",
};

function LoanFormFields({
  form,
  onChange,
  locked,
}: {
  form: LoanFormState;
  onChange: (f: LoanFormState) => void;
  locked?: boolean;
}) {
  const [cookies] = useCookies(["auth_token"]);
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    const token = cookies.auth_token;
    if (!token) return;
    howl<ApiResponse<any>>("/market/convert?from=sol&to=eur&amount=1", { token })
      .then((res) => {
        const r = parseFloat(res.data?.conversion?.output_amount_eur);
        if (!isNaN(r)) setRate(r);
      })
      .catch(() => {});
  }, [cookies.auth_token]);

  const set = <K extends keyof LoanFormState>(k: K, v: string) =>
    onChange({ ...form, [k]: v });

  function getConverted(amountStr: string) {
    if (!amountStr || !rate) return null;
    const val = parseFloat(amountStr);
    if (isNaN(val)) return null;
    if (form.currency === "sol") {
      return `≈ ${(val * rate).toFixed(2)} €`;
    }
    return `≈ ${(val / rate).toFixed(4)} SOL`;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Title</Label>
        <Input
          placeholder="e.g. SME Working Capital"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Sector</Label>
        <Select value={form.sector} onValueChange={(v) => set("sector", v)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SECTORS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Description</Label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <div className="flex justify-between items-end">
            <Label>Target</Label>
            {form.target_amount && rate && (
              <span className="text-[10px] text-muted-foreground">{getConverted(form.target_amount)}</span>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              min={0}
              step="any"
              value={form.target_amount}
              onChange={(e) => set("target_amount", e.target.value)}
              disabled={locked}
              className="flex-1"
            />
            <select
              value={form.currency}
              onChange={(e) => {
                const newCurrency = e.target.value as "sol" | "eur";
                if (newCurrency === form.currency) return;
                let newTarget = form.target_amount;
                let newFunded = form.funded_amount;
                if (rate) {
                  const t = parseFloat(newTarget);
                  const f = parseFloat(newFunded);
                  if (newCurrency === "eur") {
                    if (!isNaN(t)) newTarget = (t * rate).toFixed(2);
                    if (!isNaN(f)) newFunded = (f * rate).toFixed(2);
                  } else {
                    if (!isNaN(t)) newTarget = (t / rate).toFixed(4);
                    if (!isNaN(f)) newFunded = (f / rate).toFixed(4);
                  }
                }
                onChange({
                  ...form,
                  currency: newCurrency,
                  target_amount: newTarget,
                  funded_amount: newFunded,
                });
              }}
              className="border border-input rounded-md px-2 text-sm bg-background font-medium disabled:opacity-50"
              disabled={locked}
            >
              <option value="sol">SOL</option>
              <option value="eur">EUR</option>
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-end">
            <Label>Initial Funding</Label>
            {form.funded_amount && rate && (
              <span className="text-[10px] text-muted-foreground">{getConverted(form.funded_amount)}</span>
            )}
          </div>
          <Input
            type="number"
            min={0}
            step="any"
            value={form.funded_amount}
            onChange={(e) => set("funded_amount", e.target.value)}
            disabled={locked}
            placeholder="0"
          />
        </div>
        <div className="space-y-1.5">
          <Label>APR (%)</Label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={form.apr_percent}
            onChange={(e) => set("apr_percent", e.target.value)}
            disabled={locked}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Duration (mo)</Label>
          <Input
            type="number"
            min={1}
            value={form.duraction_months}
            onChange={(e) => set("duraction_months", e.target.value)}
            disabled={locked}
          />
        </div>
      </div>
      {locked && (
        <p className="text-xs text-muted-foreground">
          APR, target amount, and duration are locked after funding starts.
        </p>
      )}
    </div>
  );
}

function CreateDialog({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;
  const [form, setForm] = useState<LoanFormState>(emptyForm);
  const [fundingEndsAt, setFundingEndsAt] = useState("");
  const [pending, setPending] = useState(false);

  function formatDateTimeForApi(value: string) {
    const [datePart, timePart] = value.split("T");
    if (!datePart || !timePart) return value;
    return `${datePart} ${timePart.length === 5 ? `${timePart}:00` : timePart}`;
  }

  async function handleSubmit() {
    if (!token || !form.title.trim()) return;
    if (!fundingEndsAt) {
      toast.error("Funding end date is required.");
      return;
    }
    setPending(true);
    try {
      await howl<ApiResponse<unknown>>("/admin/loans", {
        method: "POST",
        token,
        body: {
          title: form.title,
          sector: form.sector,
          description: form.description,
          currency: form.currency,
          target_amount: parseFloat(form.target_amount),
          ...(form.funded_amount && { funded_amount: parseFloat(form.funded_amount) }),
          apr_percent: parseFloat(form.apr_percent),
          duraction_months: parseInt(form.duraction_months, 10),
          funding_ends_at: formatDateTimeForApi(fundingEndsAt),
        },
      });
      toast.success("Loan created.");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Create failed.");
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Loan</DialogTitle>
        </DialogHeader>
        <LoanFormFields form={form} onChange={setForm} />
        <div className="space-y-1.5">
          <Label>Funding Ends At</Label>
          <Input
            type="datetime-local"
            value={fundingEndsAt}
            onChange={(e) => setFundingEndsAt(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={pending}>
            {pending ? "Creating…" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditDialog({
  loan,
  onClose,
  onSuccess,
}: {
  loan: AdminLoan;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  const financiallyLocked = !["active"].includes(loan.status);
  const allowedNextStatuses = LOAN_STATUS_TRANSITIONS[loan.status] || [];

  const [form, setForm] = useState<LoanFormState>({
    title: loan.title,
    sector: loan.sector,
    description: loan.description,
    currency: "sol",
    target_amount: loan.target_amount_sol,
    funded_amount: loan.funded_amount_sol || "",
    apr_percent: loan.apr_percent,
    duraction_months: String(loan.duraction_months),
  });
  const [statusVal, setStatusVal] = useState<EditableLoanStatus>(
    loan.status as EditableLoanStatus,
  );
  const [fundingEndsAt, setFundingEndsAt] = useState(() => {
    if (!loan.funding_ends_at) return "";
    return loan.funding_ends_at.replace(" ", "T").slice(0, 16);
  });
  const [pending, setPending] = useState(false);

  function formatDateTimeForApi(value: string) {
    const [datePart, timePart] = value.split("T");
    if (!datePart || !timePart) return value;
    return `${datePart} ${timePart.length === 5 ? `${timePart}:00` : timePart}`;
  }

  async function handleSubmit() {
    if (!token) return;
    setPending(true);
    try {
      const body: Record<string, unknown> = {
        title: form.title,
        sector: form.sector,
        description: form.description,
        funding_ends_at: formatDateTimeForApi(fundingEndsAt),
      };
      if (!financiallyLocked) {
        body.currency = form.currency;
        body.target_amount = parseFloat(form.target_amount);
        if (form.funded_amount) {
          body.funded_amount = parseFloat(form.funded_amount);
        } else {
          body.funded_amount = 0;
        }
        body.apr_percent = parseFloat(form.apr_percent);
        body.duraction_months = parseInt(form.duraction_months, 10);
      }
      await howl<ApiResponse<unknown>>(`/admin/loans/${loan.id}`, {
        method: "PATCH",
        token,
        body,
      });

      if (statusVal !== loan.status) {
        if (loan.status === "active" && statusVal === "repaying") {
          // Frontend shortcut: transition to funded first, then repaying
          await howl<ApiResponse<unknown>>(`/admin/loans/${loan.id}/status`, {
            method: "PATCH",
            token,
            body: { status: "funded" },
          });
          await howl<ApiResponse<unknown>>(`/admin/loans/${loan.id}/status`, {
            method: "PATCH",
            token,
            body: { status: "repaying" },
          });
        } else {
          // Normal transition
          await howl<ApiResponse<unknown>>(`/admin/loans/${loan.id}/status`, {
            method: "PATCH",
            token,
            body: { status: statusVal },
          });
        }
      }

      toast.success("Loan updated.");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Loan #{loan.id}</DialogTitle>
        </DialogHeader>
        <LoanFormFields
          form={form}
          onChange={setForm}
          locked={financiallyLocked}
        />
        <div className="space-y-1.5">
          <Label>Funding Ends At</Label>
          <Input
            type="datetime-local"
            value={fundingEndsAt}
            onChange={(e) => setFundingEndsAt(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select
            value={statusVal}
            onValueChange={(v) => setStatusVal(v as EditableLoanStatus)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={loan.status}>
                {formatStatusLabel(loan.status)} (Current)
              </SelectItem>
              {allowedNextStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {formatStatusLabel(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={pending}>
            {pending ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDialog({
  loan,
  onClose,
  onSuccess,
}: {
  loan: AdminLoan;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!token) return;
    setPending(true);
    try {
      await howl<ApiResponse<unknown>>(`/admin/loans/${loan.id}`, {
        method: "DELETE",
        token,
      });
      toast.success("Loan deleted.");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AlertDialog
      open
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Loan</AlertDialogTitle>
          <AlertDialogDescription>
            Delete{" "}
            <span className="font-semibold text-foreground">{loan.title}</span>{" "}
            ({loan.loan_number})? This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending} onClick={onClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={pending}
          >
            {pending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function lamportsToSol(lamports: number) {
  return (lamports / 1_000_000_000).toFixed(2);
}

function fundedPercent(loan: AdminLoan) {
  if (!loan.target_amount_lamports) return 0;
  const totalFunded =
    loan.initial_funded_amount_lamports + loan.funded_amount_lamports;
  return Math.min(
    100,
    Math.round((totalFunded / loan.target_amount_lamports) * 100),
  );
}

function formatFundingEndsAt(value?: string | null) {
  if (!value) return "N/A";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LoansPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<LoanStatus>("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminLoan | null>(null);
  const [deleting, setDeleting] = useState<AdminLoan | null>(null);

  const { data, isLoading } = useAdminLoans(status, page);

  const loans = data?.data?.data ?? [];
  const lastPage = data?.data?.last_page ?? 1;
  const total = data?.data?.total ?? 0;

  const filtered = search.trim()
    ? loans.filter(
        (l) =>
          l.title.toLowerCase().includes(search.toLowerCase()) ||
          l.loan_number.toLowerCase().includes(search.toLowerCase()),
      )
    : loans;

  function handleStatusChange(v: string) {
    setStatus(v as LoanStatus);
    setPage(1);
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold tracking-tight sm:flex-1">Loans</h1>
        <Input
          placeholder="Search title or loan number…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 bg-background"
        />
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {loanStatusFilters.map((s) => (
              <SelectItem key={s} value={s}>
                {formatStatusLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="w-full sm:w-auto" onClick={() => setCreating(true)}>New Loan</Button>
      </div>

      <Card className="shadow-none">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No {status === "all" ? "" : `${formatStatusLabel(status)} `}loans found.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((loan) => {
                const pct = fundedPercent(loan);
                return (
                  <div
                    key={loan.id}
                    className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1 space-y-1 w-full">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground font-mono">
                          {loan.loan_number}
                        </span>
                        <span className="text-sm font-semibold">
                          {loan.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {loan.sector}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5 mt-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                          <span className="bg-muted/50 border px-1.5 py-0.5 rounded-md">
                            <span className="font-medium text-foreground">Total:</span> {loan.total_funded_amount_sol} / {loan.target_amount_sol} SOL
                            {loan.target_amount_eur && <span className="opacity-75"> ({loan.total_funded_amount_eur} / {loan.target_amount_eur} €)</span>}
                          </span>
                          <span className="bg-muted/50 border px-1.5 py-0.5 rounded-md">
                            <span className="font-medium text-foreground">Initial:</span> {loan.initial_funded_amount_sol} SOL
                            {loan.initial_funded_amount_eur && <span className="opacity-75"> ({loan.initial_funded_amount_eur} €)</span>}
                          </span>
                          <span className="bg-muted/50 border px-1.5 py-0.5 rounded-md">
                            <span className="font-medium text-foreground">User:</span> {loan.investor_funded_amount_sol} SOL
                            {loan.investor_funded_amount_eur && <span className="opacity-75"> ({loan.investor_funded_amount_eur} €)</span>}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap mt-0.5">
                          <span>{loan.apr_percent}% APR</span>
                          <span>{loan.duraction_months}mo</span>
                          <span>
                            Ends: {formatFundingEndsAt(loan.funding_ends_at)}
                          </span>
                          <span className="text-foreground font-medium">
                            {pct}% funded
                          </span>
                        </div>
                      </div>
                      <div className="w-full max-w-xs h-1.5 rounded-full bg-muted overflow-hidden mt-2">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto shrink-0 mt-3 sm:mt-0">
                      <Badge
                        className={`${statusBadge[loan.status] ?? ""} border-0 capitalize`}
                      >
                        {formatStatusLabel(loan.status)}
                      </Badge>
                      <Link href={`/admin/loans/${loan.id}`}>
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditing(loan)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleting(loan)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {!isLoading && total > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {total} loan{total !== 1 ? "s" : ""}
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

      {creating && (
        <CreateDialog
          onClose={() => setCreating(false)}
          onSuccess={() => {
            setCreating(false);
            queryClient.invalidateQueries({ queryKey: ["admin-loans"] });
          }}
        />
      )}

      {editing && (
        <EditDialog
          loan={editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            queryClient.invalidateQueries({ queryKey: ["admin-loans"] });
          }}
        />
      )}

      {deleting && (
        <DeleteDialog
          loan={deleting}
          onClose={() => setDeleting(null)}
          onSuccess={() => {
            setDeleting(null);
            queryClient.invalidateQueries({ queryKey: ["admin-loans"] });
          }}
        />
      )}
    </div>
  );
}
