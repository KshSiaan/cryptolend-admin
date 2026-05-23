import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { howl } from "@/lib/utils";
import type { WithdrawalRequest } from "@/types/auth";
import type { ApiResponse, Paginator } from "@/types/base";

export function useWithdrawalRequests(page = 1) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["withdrawal-requests", page],
    queryFn: () =>
      howl<ApiResponse<Paginator<WithdrawalRequest[]>>>(
        `/wallet/withdraw?page=${page}`,
        { token },
      ),
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}
