"use client";

import { useState } from "react";

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
import { useAdminLoans } from "@/hooks/use-admin-loans";
import { howl } from "@/lib/utils";
import type { AdminLoan } from "@/types/auth";
import type { ApiResponse } from "@/types/base";

type LoanStatus = "active" | "funded" | "repaying" | "closed";

const statusBadge: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  funded: "bg-blue-100 text-blue-700",
  repaying: "bg-yellow-100 text-yellow-700",
  closed: "bg-muted text-muted-foreground",
};

const SECTORS = ["Retail", "Agriculture", "Healthcare", "Manufacturing"];

interface LoanFormState {
  title: string;
  sector: string;
  description: string;
  target_amount_sol: string;
  apr_percent: string;
  duraction_months: string;
}

const emptyForm: LoanFormState = {
  title: "",
  sector: "Retail",
  description: "",
  target_amount_sol: "",
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
  const set = <K extends keyof LoanFormState>(k: K, v: string) =>
    onChange({ ...form, [k]: v });

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
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label>Target (SOL)</Label>
          <Input
            type="number"
            min={0}
            step="0.0001"
            value={form.target_amount_sol}
            onChange={(e) => set("target_amount_sol", e.target.value)}
            disabled={locked}
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
          target_amount_sol: parseFloat(form.target_amount_sol),
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
      <DialogContent className="sm:max-w-md">
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

  const [form, setForm] = useState<LoanFormState>({
    title: loan.title,
    sector: loan.sector,
    description: loan.description,
    target_amount_sol: loan.target_amount_sol,
    apr_percent: loan.apr_percent,
    duraction_months: String(loan.duraction_months),
  });
  const [statusVal, setStatusVal] = useState<LoanStatus>(
    loan.status as LoanStatus,
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
        body.target_amount_sol = parseFloat(form.target_amount_sol);
        body.apr_percent = parseFloat(form.apr_percent);
        body.duraction_months = parseInt(form.duraction_months, 10);
      }
      await howl<ApiResponse<unknown>>(`/admin/loans/${loan.id}`, {
        method: "PATCH",
        token,
        body,
      });

      if (statusVal !== loan.status) {
        await howl<ApiResponse<unknown>>(`/admin/loans/${loan.id}/status`, {
          method: "PATCH",
          token,
          body: { status: statusVal },
        });
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
      <DialogContent className="sm:max-w-md">
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
            onValueChange={(v) => setStatusVal(v as LoanStatus)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["active", "funded", "repaying", "closed"] as LoanStatus[]).map(
                (s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ),
              )}
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
  return Math.min(
    100,
    Math.round(
      (loan.funded_amount_lamports / loan.target_amount_lamports) * 100,
    ),
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
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminLoan | null>(null);
  const [deleting, setDeleting] = useState<AdminLoan | null>(null);

  const { data, isLoading, refetch } = useAdminLoans(page);

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold tracking-tight flex-1">Loans</h1>
        <Input
          placeholder="Search title or loan number…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 bg-background"
        />
        <Button onClick={() => setCreating(true)}>New Loan</Button>
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
              No loans found.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((loan) => {
                const pct = fundedPercent(loan);
                return (
                  <div
                    key={loan.id}
                    className="px-5 py-4 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
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
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <span>
                          {lamportsToSol(loan.funded_amount_lamports)} /{" "}
                          {lamportsToSol(loan.target_amount_lamports)} SOL
                        </span>
                        <span>{loan.apr_percent}% APR</span>
                        <span>{loan.duraction_months}mo</span>
                        <span>
                          Funding ends: {formatFundingEndsAt(loan.funding_ends_at)}
                        </span>
                        <span className="text-foreground font-medium">
                          {pct}% funded
                        </span>
                      </div>
                      <div className="w-full max-w-xs h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        className={`${statusBadge[loan.status] ?? ""} border-0 capitalize`}
                      >
                        {loan.status}
                      </Badge>
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
            refetch();
          }}
        />
      )}

      {editing && (
        <EditDialog
          loan={editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            refetch();
          }}
        />
      )}

      {deleting && (
        <DeleteDialog
          loan={deleting}
          onClose={() => setDeleting(null)}
          onSuccess={() => {
            setDeleting(null);
            void refetch();
          }}
        />
      )}
    </div>
  );
}
