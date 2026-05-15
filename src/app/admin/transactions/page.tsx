import { Card, CardContent } from "@/components/ui/card";

interface Transaction {
  id: number;
  type: string;
  email: string;
  amount: string;
  positive: boolean;
}

const transactions: Transaction[] = [
  { id: 1, type: "Deposit", email: "alex@email.com · just now", amount: "+1.0 USDT", positive: true },
  { id: 2, type: "Investment", email: "maria@email.com", amount: "-0.5 USDT", positive: false },
  { id: 3, type: "Deposit", email: "rockey@email.com", amount: "+0.031 USDT", positive: true },
  { id: 4, type: "Repayment out", email: "priya@email.com", amount: "-0.5 USDT", positive: false },
  { id: 5, type: "Withdrawal", email: "Ronald@email.com", amount: "-1.45 USDT", positive: false },
];

export default function TransactionsPage() {
  return (
    <div className="p-6">
      <Card className="shadow-none">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold mb-4">All Transactions</h2>
          <div className="divide-y divide-border">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{t.type}</p>
                  <p className="text-xs text-muted-foreground">{t.email}</p>
                </div>
                <span
                  className={`text-sm font-medium ${
                    t.positive
                      ? "text-[oklch(0.52_0.165_145)]"
                      : "text-destructive"
                  }`}
                >
                  {t.amount}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
