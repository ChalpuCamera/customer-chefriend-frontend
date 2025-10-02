import { useQuery } from "@tanstack/react-query";
import { storeApi } from "@/lib/api/customer/store";

export const storeKeys = {
  all: ["stores"] as const,
  detail: (id: number) => [...storeKeys.all, id] as const,
};

export function useStore(storeId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: storeKeys.detail(storeId),
    queryFn: async () => {
      const response = await storeApi.getStore(storeId);
      return response.result;
    },
    enabled: options?.enabled ?? !!storeId,
  });
}
