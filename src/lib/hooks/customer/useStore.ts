import { useQuery } from "@tanstack/react-query";
import { storeApi } from "@/lib/api/customer/store";
import type { Pageable } from "@/lib/types/customer";

export const storeKeys = {
  all: ["stores"] as const,
  list: (pageable?: Pageable) => [...storeKeys.all, "list", pageable] as const,
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

export function useAllStores(pageable?: Pageable) {
  return useQuery({
    queryKey: storeKeys.list(pageable),
    queryFn: async () => {
      const response = await storeApi.getAllStores(pageable);
      return response.result;
    },
  });
}
