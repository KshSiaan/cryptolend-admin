import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { howl } from "@/lib/utils";
import type { AdminLoan } from "@/types/auth";
import type { ApiResponse, Paginator } from "@/types/base";

export type AdminLoanStatus =
  | "all"
  | "active"
  | "funded"
  | "funding_failed"
  | "repaying"
  | "closed";

export function useAdminLoans(status: AdminLoanStatus, page = 1) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["admin-loans", status, page],
    queryFn: () =>
      howl<ApiResponse<Paginator<AdminLoan[]>>>(
        `/admin/loans?status=${status}&page=${page}`,
        {
          token,
        },
      ),
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}
