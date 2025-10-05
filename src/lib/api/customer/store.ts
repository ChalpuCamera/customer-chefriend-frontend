import { apiClient } from "../client";
import type { ApiResponse, StoreResponse, PageResponse, Pageable } from "@/lib/types/customer";

export const storeApi = {
  // 매장 상세 조회
  getStore: (storeId: number) =>
    apiClient.get<ApiResponse<StoreResponse>>(`/api/stores/${storeId}`),

  // 전체 매장 목록 조회
  getAllStores: (pageable?: Pageable) =>
    apiClient.get<ApiResponse<PageResponse<StoreResponse>>>(`/api/stores/all`, {
      params: pageable,
    }),
};
