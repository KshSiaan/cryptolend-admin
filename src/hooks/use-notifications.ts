import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { howl } from "@/lib/utils";
import type { Notification } from "@/types/notification";
import type { ApiResponse, Paginator } from "@/types/base";

export function useNotifications(page = 1) {
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  return useQuery({
    queryKey: ["notifications", page],
    queryFn: () =>
      howl<ApiResponse<Paginator<Notification[]>>>(
        `/notifications?page=${page}`,
        { token },
      ),
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}
