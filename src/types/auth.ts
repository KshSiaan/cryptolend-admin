export interface AuthUser {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  profile_photo_path?: string | null;
  role?: string;
  status: string;
}

export interface LoginResponseData {
  token_type: string;
  token: string;
  user: AuthUser;
}

export interface RegisterResponseData {
  user: Pick<AuthUser, "id" | "name" | "email" | "status">;
}

export interface ForgotPasswordVerifyResponseData {
  email: string;
  password_reset_token: string;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface VerifyEmailBody {
  email: string;
  otp: string;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface ForgotPasswordVerifyBody {
  email: string;
  otp: string;
}

export interface ResetPasswordBody {
  email: string;
  password: string;
  password_confirmation: string;
  password_reset_token: string;
}

export interface ProfileData {
  id: number;
  name: string;
  email: string;
  profile_photo_path: string | null;
  profile_photo_url: string | null;
  role: string;
  created_at: string;
  member_since: string;
  status: string;
  wallet_balance_lamports: number;
  wallet_balance_sol: string;
  wallet_balance_eur: string;
}

export interface ChangePasswordBody {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface WalletLink {
  name: string;
  ios_url: string;
  android_url: string;
  fallback_url: string;
}

export interface DepositInstructions {
  asset: string;
  deposit_address: string;
  messages: string[];
  warnings: string[];
  wallet_links: WalletLink[];
}

export interface DepositBody {
  tx_signature: string;
  from_address: string;
}

export interface DepositRecord {
  id: number;
  user_id: number;
  amount_lamports: number;
  amount_sol: string;
  tx_signature: string;
  from_address: string;
  to_address: string;
  status: string;
  detected_at: string;
  created_at: string;
  updated_at: string;
}

export interface DepositResponseData {
  deposit: DepositRecord;
  webhook_replay: {
    matched_signature: string;
    pending_events_found: number;
    credited: number;
    processed: number;
    ignored: number;
    errors: number;
  };
}

export interface ConversionRate {
  sol_eur: string;
  source: string;
  last_updated_at: string;
  fetched_at: string;
  cache_seconds: number;
}

export interface ConversionResult {
  from: string;
  to: string;
  input_amount: string;
  output_amount_sol: string;
  output_amount_lamports: number;
}

export interface MarketConvertData {
  rate: ConversionRate;
  conversion: ConversionResult;
}

export interface WalletStats {
  available_sol: string;
  available_eur: string;
  invested_sol: string;
  invested_eur: string;
}

export interface WalletTransaction {
  id: number;
  direction: "credit" | "debit";
  category: string;
  transaction_label: string;
  status: string;
  amount_sol: string;
  amount_eur: string;
  balance_before_sol: string;
  balance_before_eur: string;
  balance_after_sol: string;
  balance_after_eur: string;
  tx_signature: string | null;
  processed_at: string | null;
  created_at: string;
  meta: Record<string, unknown>;
}

export interface WithdrawalRequest {
  id: number;
  status: string;
  amount_lamports: number;
  amount_sol: string;
  amount_eur: string;

  recipient_address: string;
  note: string;
  wallet_transaction_id: number;
  processed_at: string | null;
  failure_reason: string;
  meta: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface RecentTransaction {
  id: number;
  direction: "credit" | "debit";
  category: string;
  status: string;
  amount_sol: string;
  amount_eur: string;
  processed_at: string;
  created_at: string;
}

export interface RecentInvestment {
  id: number;
  amount_sol: string;
  amount_eur: string;
  status: string;
  created_at: string;
}

export interface LoanItem {
  id: number;
  loan_number: string;
  title: string;
  description: string;
  status: string;
  sector: string;
  duration_months: number;
  investors_count: number;
  apr_percent: number;
  target_amount_sol: string;
  raised_amount_sol: string;
  target_amount_eur: string;
  
  raised_amount_eur: string;
  funded_percent: number;
  funded_percent_label: string;
  target_amount_lamports?: number;
  raised_amount_lamports?: number;
  remaining_amount_lamports?: number;
  remaining_amount_sol?: string;
  is_fully_funded?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InvestmentResult {
  id: number;
  loan_id: number;
  amount_lamports: number;
  amount_sol: string;
  apr_percent: number;
  expected_return_lamports: number;
  expected_return_sol: string;
  status: string;
  created_at: string;
}

export interface InvestResponseData {
  investment: InvestmentResult;
  loan: LoanItem;
  conversion: null | unknown;
  wallet: {
    balance_lamports: number;
    balance_sol: string;
    balance_eur: string;
    frozen_balance_lamports: number;
    frozen_balance_sol: string;
    frozen_balance_eur: string;
  };
}

export interface HomeStats {
  total_invested_sol: string;
  total_earnings_sol: string;
  total_invested_eur: string;
  total_earning_eur: string;
  recent_investments: RecentInvestment[];
  recent_transactions: RecentTransaction[];
}

export interface InvestmentStats {
  invested_balance_sol: string;
  invested_balance_eur: string;
  earning_sol: string;
  earning_eur: string;
  total_expected_interest_sol: string;
  total_expected_interest_eur: string;
  active_loans_count: number;
}

export interface ReturnSchedule {
  id: number;
  installment_no: number;
  month_label: string;
  due_date: string;
  status: "paid" | "due" | "upcoming";
  total_due_sol: string;
  total_due_eur: string;
  paid_sol: string;
  paid_eur: string;
  paid_at: string | null;
}

export interface ActiveInvestment {
  id: number;
  status: string;
  amount_sol: string;
  amount_eur: string;
  expected_return_sol: string;
  expected_return_eur: string;
  received_sol: string;
  received_eur: string;
  apr_percent: number;
  created_at: string;
  loan: {
    id: number;
    loan_number: string;
    title: string;
    description: string;
    sector: string;
    duraction_months: number;
    status: string;
  };
  return_schedules: ReturnSchedule[];
  summary: {
    paid_count: number;
    due_count: number;
    upcoming_count: number;
    due_amount_sol: string;
    due_amount_eur: string;
  };
}

  
export interface EarningsHistoryEntry {
  month: string;
  month_key: string;
  amount_sol: string;
  amount_eur: string;
}

export interface AdminTransaction {
  id: number;
  user: { id: number; name: string; email: string };
  direction: "credit" | "debit";
  category: string;
  transaction_label: string;
  status: string;
  amount_sol: string;
  processed_at: string;
  created_at: string;
  tx_signature: string | null;
}

export interface AdminTransactionListItem {
  id: number;
  direction: "credit" | "debit";
  category: string;
  transaction_label: string;
  status: string;
  amount_sol: string;
  user: { id: number; name: string; email: string };
}

export interface AdminDashboardStats {
  total_users: number;
  active_loans: number;
  total_invested_sol: string;
  total_repaid_this_month_sol: string;
  month: string;
  recent_transactions: AdminTransaction[];
}

export interface AdminWithdrawalRequest {
  id: number;
  status: string;
  amount_lamports: number;
  amount_sol: string;
  recipient_address: string;
  note: string;
  failure_reason: string;
  processed_at: string | null;
  created_at: string;
  meta: Record<string, unknown>;
  user: { id: number; name: string; email: string };
  wallet_transaction: {
    id: number;
    status: string;
    tx_signature: string;
    processed_at: string | null;
    failed_reason: string;
  };
}

export interface AdminDeposit {
  id: number;
  user_id: number;
  amount_lamports: number;
  tx_signature: string | null;
  from_address: string;
  to_address: string;
  confirmations: number;
  status: string;
  idempotency_key: string | null;
  detected_at: string;
  confirmed_at: string | null;
  credited_at: string | null;
  failure_reason: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  review_decision: string | null;
  review_reason: string | null;
  created_at: string;
  updated_at: string;
  user: { id: number; name: string; email: string };
  reviewer: { id: number; name: string; email: string } | null;
}

export interface ActiveLoan {
  id: number;
  loan_number: string;
  title: string;
  sector: string;
  status: string;
  duration_months: number;
  apr_percent: number;
  investors_count: number;
  target_amount_sol: string;
  raised_amount_sol: string;
    target_amount_eur: string;
  raised_amount_eur: string;
  funded_percent: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  profile_photo_path: string | null;
  profile_photo_url: string | null;
  created_at: string;
  wallet: {
    balance_sol: string;
    frozen_balance_sol: string;
  };
}

export interface AdminLoan {
  id: number;
  loan_number: string;
  title: string;
  description: string;
  sector: string;
  apr_percent: string;
  target_amount_lamports: number;
  funded_amount_lamports: number;
  duraction_months: number;
  funding_ends_at?: string | null;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  target_amount_sol: string;
  funded_amount_sol: string;
  creator: { id: number; name: string; email: string };
}
