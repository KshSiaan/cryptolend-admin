export const user = {
  name: "Alex Kim",
  initials: "AB",
  email: "alex@email.com",
  accountType: "Investor",
  kycStatus: "Verified",
  memberSince: "Jan 2025",
  balance: 12847.2,
  availableBalance: 1.842,
  availableUsd: 2582,
  invested: 9.5,
  earnings: 0.3124,
};

export const loans = [
  {
    id: 1,
    title: "SME Working Capital",
    sector: "Retail",
    grade: "Grade A",
    description: "Working capital for retail expansion. Collateralized by inventory.",
    durationMonths: 12,
    investors: 23,
    target: 10,
    raised: 7.4,
    apr: 14,
    minInvestment: 0.1,
    status: "active" as const,
    nextPayment: "Jun 2025",
    userEarned: 0.126,
  },
  {
    id: 2,
    title: "Tech Startup Bridge",
    sector: "Technology",
    grade: "Grade B",
    description: "Bridge financing for product launch. Secured by IP assets.",
    durationMonths: 18,
    investors: 41,
    target: 20,
    raised: 11.2,
    apr: 18,
    minInvestment: 0.25,
    status: "funded" as const,
    nextPayment: "Jun 2025",
    userEarned: 0.186,
  },
  {
    id: 3,
    title: "Import/Export Trade",
    sector: "Commerce",
    grade: "Grade C",
    description: "Trade finance for import cycle. Backed by purchase orders.",
    durationMonths: 3,
    investors: 19,
    target: 6,
    raised: 6,
    apr: 14,
    minInvestment: 0.05,
    status: "repaying" as const,
    nextPayment: null,
    userEarned: 0,
  },
];

export const transactions = [
  {
    id: 1,
    label: "Repayment received",
    date: "2025-04-15",
    amount: 0.031,
    positive: true,
  },
  {
    id: 2,
    label: "Deposit",
    date: "2025-04-30",
    amount: 77.5,
    positive: true,
  },
  {
    id: 3,
    label: "Investment – Loan #3",
    date: "2025-04-15",
    amount: 500,
    positive: false,
  },
];

export const walletTransactions = [
  { id: 1, label: "Deposit", date: "2025-04-30", amount: 1.0, positive: true },
  {
    id: 2,
    label: "Withdrawal request (pending)",
    date: "2025-04-30",
    amount: 0.1,
    positive: false,
  },
  {
    id: 3,
    label: "Investment – Loan #3",
    date: "2025-04-15",
    amount: 0.5,
    positive: false,
  },
  {
    id: 4,
    label: "Repayment received",
    date: "2025-03-10",
    amount: 0.031,
    positive: true,
  },
];

export const userPositions = [
  {
    loanId: 1,
    invested: 0.45,
    startDate: "2024-12-01",
    // months in order matching durationMonths; "paid" | "due" | "upcoming"
    schedule: [
      { month: "Dec", state: "paid" as const },
      { month: "Jan", state: "paid" as const },
      { month: "Feb", state: "paid" as const },
      { month: "Mar", state: "paid" as const },
      { month: "Apr", state: "paid" as const },
      { month: "May", state: "due" as const },
      { month: "Jun", state: "upcoming" as const },
      { month: "Jul", state: "upcoming" as const },
      { month: "Aug", state: "upcoming" as const },
      { month: "Sep", state: "upcoming" as const },
      { month: "Oct", state: "upcoming" as const },
      { month: "Nov", state: "upcoming" as const },
    ],
  },
  {
    loanId: 2,
    invested: 0.5,
    startDate: "2025-01-01",
    schedule: [
      { month: "Jan", state: "paid" as const },
      { month: "Feb", state: "paid" as const },
      { month: "Mar", state: "paid" as const },
      { month: "Apr", state: "due" as const },
      { month: "May", state: "upcoming" as const },
      { month: "Jun", state: "upcoming" as const },
      { month: "Jul", state: "upcoming" as const },
      { month: "Aug", state: "upcoming" as const },
      { month: "Sep", state: "upcoming" as const },
      { month: "Oct", state: "upcoming" as const },
      { month: "Nov", state: "upcoming" as const },
      { month: "Dec", state: "upcoming" as const },
      { month: "Jan", state: "upcoming" as const },
      { month: "Feb", state: "upcoming" as const },
      { month: "Mar", state: "upcoming" as const },
      { month: "Apr", state: "upcoming" as const },
      { month: "May", state: "upcoming" as const },
      { month: "Jun", state: "upcoming" as const },
    ],
  },
];

export const portfolioEarnings = [
  { month: "May 2025", amount: 0.0186 },
  { month: "Apr 2025", amount: 0.0312 },
  { month: "Mar 2025", amount: 0.029 },
  { month: "Feb 2025", amount: 0.0245 },
];

export const platformWallet = "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE";

export type LoanStatus = "active" | "funded" | "repaying" | "closed";
