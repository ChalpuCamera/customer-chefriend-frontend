import { apiClient } from "../client";
import type { ApiResponse, StoreResponse } from "@/lib/types/customer";

export const storeApi = {
  // 매장 상세 조회
  getStore: (storeId: number) =>
    apiClient.get<ApiResponse<StoreResponse>>(`/api/stores/${storeId}`),
};
