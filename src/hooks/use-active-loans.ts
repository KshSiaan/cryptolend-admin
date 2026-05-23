import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { howl } from "@/lib/utils";
import type { ActiveLoan } from "@/types/auth";
import type { ApiResponse, Paginator } from "@/types/base";

export function useActiveLoans(page = 1) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["active-loans", page],
    queryFn: () =>
      howl<ApiResponse<Paginator<ActiveLoan[]>>>(
        `/active-loans?page=${page}`,
        { token },
      ),
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}
