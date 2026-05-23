import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { howl } from "@/lib/utils";
import type { LoanItem } from "@/types/auth";
import type { ApiResponse, Paginator } from "@/types/base";

export function useLoans() {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["loans"],
    queryFn: () =>
      howl<ApiResponse<Paginator<LoanItem[]>>>("/loans", { token }),
    enabled: !!token,
    staleTime: 1000 * 60,
  });
}
