import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { howl } from "@/lib/utils";
import type { EarningsHistoryEntry } from "@/types/auth";
import type { ApiResponse, Paginator } from "@/types/base";

export function useEarningsHistory(page = 1) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["earnings-history", page],
    queryFn: () =>
      howl<ApiResponse<Paginator<EarningsHistoryEntry[]>>>(
        `/earnings-history?page=${page}`,
        { token },
      ),
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}
