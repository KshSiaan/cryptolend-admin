"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type LoanStatus = "active" | "funded" | "repaying" | "closed";

interface Loan {
  id: number;
  title: string;
  sector: string;
  raised: number;
  goal: number;
  unit: string;
  rate: number;
  term: number;
  status: LoanStatus;
}

const initialLoans: Loan[] = [
  {
    id: 1,
    title: "SME Working Capital",
    sector: "Finance",
    raised: 7.4,
    goal: 10,
    unit: "ETH",
    rate: 14,
    term: 12,
    status: "active",
  },
  {
    id: 2,
    title: "Agri Equipment Loan",
    sector: "Agriculture",
    raised: 5,
    goal: 5,
    unit: "ETH",
    rate: 12,
    term: 6,
    status: "funded",
  },
  {
    id: 3,
    title: "Tech Startup Bridge",
    sector: "Technology",
    raised: 11.2,
    goal: 20,
    unit: "ETH",
    rate: 18,
    term: 18,
    status: "active",
  },
  {
    id: 4,
    title: "Real Estate Short-Term",
    sector: "Real Estate",
    raised: 1,
    goal: 8,
    unit: "ETH",
    rate: 15,
    term: 9,
    status: "active",
  },
  {
    id: 5,
    title: "Import/Export Trade",
    sector: "Trade",
    raised: 6,
    goal: 6,
    unit: "ETH",
    rate: 11,
    term: 3,
    status: "repaying",
  },
];

const statusStyles: Record<LoanStatus, string> = {
  active: "bg-green-100 text-green-700 border-green-200",
  funded: "bg-blue-100 text-blue-700 border-blue-200",
  repaying: "bg-yellow-100 text-yellow-700 border-yellow-200",
  closed: "bg-muted text-muted-foreground border-border",
};

const emptyForm = { title: "", sector: "", goal: 10, rate: 14, term: 12 };

type FormState = typeof emptyForm;

function LoanFormFields({
  form,
  onChange,
  showStatus,
  status,
  onStatusChange,
}: {
  form: FormState;
  onChange: (f: FormState) => void;
  showStatus?: boolean;
  status?: LoanStatus;
  onStatusChange?: (s: LoanStatus) => void;
}) {
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    onChange({ ...form, [k]: v });

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="loan-title">Loan title</Label>
        <Input
          id="loan-title"
          placeholder="e.g. SME Working Capital"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="loan-sector">Sector</Label>
        <Input
          id="loan-sector"
          placeholder="e.g. Retail"
          value={form.sector}
          onChange={(e) => set("sector", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="loan-goal">Target (USDT)</Label>
          <Input
            id="loan-goal"
            type="number"
            min={1}
            value={form.goal}
            onChange={(e) => set("goal", Number(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="loan-rate">APR (%)</Label>
          <Input
            id="loan-rate"
            type="number"
            min={1}
            value={form.rate}
            onChange={(e) => set("rate", Number(e.target.value))}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="loan-term">Duration (months)</Label>
          <Input
            id="loan-term"
            type="number"
            min={1}
            value={form.term}
            onChange={(e) => set("term", Number(e.target.value))}
          />
        </div>
        {showStatus && onStatusChange && (
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => onStatusChange(v as LoanStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">active</SelectItem>
                <SelectItem value="funded">funded</SelectItem>
                <SelectItem value="repaying">repaying</SelectItem>
                <SelectItem value="closed">closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [search, setSearch] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<FormState>(emptyForm);

  const [editTarget, setEditTarget] = useState<Loan | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [editStatus, setEditStatus] = useState<LoanStatus>("active");

  const [deleteTarget, setDeleteTarget] = useState<Loan | null>(null);

  const filtered = loans.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = () => {
    if (!createForm.title.trim()) return;
    setLoans((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: createForm.title,
        sector: createForm.sector,
        raised: 0,
        goal: createForm.goal,
        unit: "USDT",
        rate: createForm.rate,
        term: createForm.term,
        status: "active",
      },
    ]);
    setCreateOpen(false);
    setCreateForm(emptyForm);
  };

  const openEdit = (loan: Loan) => {
    setEditTarget(loan);
    setEditForm({
      title: loan.title,
      sector: loan.sector,
      goal: loan.goal,
      rate: loan.rate,
      term: loan.term,
    });
    setEditStatus(loan.status);
  };

  const handleEdit = () => {
    if (!editTarget || !editForm.title.trim()) return;
    setLoans((prev) =>
      prev.map((l) =>
        l.id === editTarget.id
          ? {
              ...l,
              title: editForm.title,
              sector: editForm.sector,
              goal: editForm.goal,
              rate: editForm.rate,
              term: editForm.term,
              status: editStatus,
            }
          : l,
      ),
    );
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setLoans((prev) => prev.filter((l) => l.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search loans...."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-background"
        />
        <Button className="shrink-0" onClick={() => setCreateOpen(true)}>
          New Loan
        </Button>
      </div>

      <Card className="shadow-none">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold mb-4">All Loans</h2>
          <div className="divide-y divide-border">
            {filtered.map((loan) => (
              <div
                key={loan.id}
                className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm font-medium">{loan.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {loan.raised}/{loan.goal} {loan.unit} · {loan.rate}% ·{" "}
                    {loan.term}mo
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <span
                    className={cn(
                      "text-xs font-medium px-2.5 py-0.5 rounded-full border",
                      statusStyles[loan.status],
                    )}
                  >
                    {loan.status}
                  </span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => openEdit(loan)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setDeleteTarget(loan)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No loans found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create New Loan</DialogTitle>
          </DialogHeader>
          <LoanFormFields form={createForm} onChange={setCreateForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Loan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(o) => !o && setEditTarget(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Loan</DialogTitle>
          </DialogHeader>
          <LoanFormFields
            form={editForm}
            onChange={setEditForm}
            showStatus
            status={editStatus}
            onStatusChange={setEditStatus}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete AlertDialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Loan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.title}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
