export interface NotificationData {
  type: string;
  deposit_id?: number;
  status?: string;
  amount_lamports?: number;
  amount_sol?: number;
  tx_signature?: string;
  failure_reason?: string;
  confirmed_at?: string | null;
  reviewed_at?: string | null;
  [key: string]: unknown;
}

export interface Notification {
  id: string;
  type: string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
}
