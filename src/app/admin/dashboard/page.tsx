import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Total users", value: "128", valueClass: "" },
  { label: "Active loans", value: "3", valueClass: "" },
  { label: "Total invested", value: "24.6 USDT", valueClass: "" },
  {
    label: "Repaid this month",
    value: "1.32 USDT",
    valueClass: "text-[oklch(0.52_0.165_145)]",
  },
];

const activities = [
  {
    title: "New Deposit",
    sub: "alex@email.com · just now",
    badge: "+1.0 USDT",
    badgeClass: "text-[oklch(0.52_0.165_145)]",
  },
  {
    title: "Investment - Loan #3",
    sub: "maria@email.com",
    badge: "-0.5 USDT",
    badgeClass: "text-destructive",
  },
  {
    title: "Repayment processed",
    sub: "Loan #5",
    badge: "+0.031 USDT",
    badgeClass: "text-[oklch(0.52_0.165_145)]",
  },
  {
    title: "New user registered",
    sub: "priya@email.com",
    badge: "new",
    badgeClass:
      "bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium",
  },
  {
    title: "Investment - Loan #1",
    sub: "Ronald@email.com",
    badge: "-0.45 USDT",
    badgeClass: "text-destructive",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-none">
            <CardContent className="p-6 flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p
                className={`text-3xl font-bold tracking-tight ${s.valueClass}`}
              >
                {s.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-none">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold mb-4">Recent Activities</h2>
          <div className="divide-y divide-border">
            {activities.map((a, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: mock data
                key={i}
                className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.sub}</p>
                </div>
                {a.title === "New user registered" ? (
                  <span className={a.badgeClass}>{a.badge}</span>
                ) : (
                  <span className={`text-sm font-medium ${a.badgeClass}`}>
                    {a.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
