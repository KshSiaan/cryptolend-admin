import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { howl } from "@/lib/utils";
import type { AdminTransactionListItem } from "@/types/auth";
import type { ApiResponse, Paginator } from "@/types/base";

export function useAdminTransactions(page = 1) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["admin-transactions", page],
    queryFn: () =>
      howl<ApiResponse<Paginator<AdminTransactionListItem[]>>>(
        `/admin/transactions?page=${page}`,
        { token },
      ),
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}
