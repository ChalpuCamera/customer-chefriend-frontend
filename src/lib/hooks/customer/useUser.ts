import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/api/customer/user";

export const userKeys = {
  all: ["user"] as const,
  current: () => [...userKeys.all, "current"] as const,
};

export function useUser(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: async () => {
      const response = await userApi.getCurrentUser();
      return response.result;
    },
    enabled: options?.enabled ?? true,
  });
}
