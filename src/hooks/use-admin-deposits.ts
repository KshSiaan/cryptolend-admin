import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { howl } from "@/lib/utils";
import type { AdminDeposit } from "@/types/auth";
import type { ApiResponse, Paginator } from "@/types/base";

type DepositStatus = "pending" | "manual_review" | "confirmed" | "failed";

export function useAdminDeposits(status: DepositStatus, page = 1) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["admin-deposits", status, page],
    queryFn: () =>
      howl<ApiResponse<Paginator<AdminDeposit[]>>>(
        `/admin/deposits/review?status=${status}&page=${page}`,
        { token },
      ),
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}
