import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { howl } from "@/lib/utils";
import type { AdminWithdrawalRequest } from "@/types/auth";
import type { ApiResponse, Paginator } from "@/types/base";

export type AdminWithdrawalStatus =
  | "all"
  | "pending"
  | "approved"
  | "processing"
  | "broadcasted"
  | "confirmed"
  | "failed"
  | "rejected"
  | "cancelled";

export function useAdminWithdrawalRequests(
  status: AdminWithdrawalStatus,
  page = 1,
) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["admin-withdrawal-requests", status, page],
    queryFn: () =>
      howl<ApiResponse<Paginator<AdminWithdrawalRequest[]>>>(
        `/admin/withdrawal-requests?status=${status}&page=${page}`,
        { token },
      ),
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}
