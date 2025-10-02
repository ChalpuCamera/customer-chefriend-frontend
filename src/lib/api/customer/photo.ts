import { apiClient } from "../client";
import type {
  ApiResponse,
  PageResponse,
  PhotoResponse,
  Pageable,
} from "@/lib/types/customer";

export const photoApi = {
  // 음식별 사진 목록 조회
  getPhotosByFoodItem: (foodId: number, pageable: Pageable = {}) => {
    const params = {
      page: pageable.page ?? 0,
      size: pageable.size ?? 20,
      sort: pageable.sort ?? ["createdAt,desc"],
    };
    return apiClient.get<ApiResponse<PageResponse<PhotoResponse>>>(
      `/api/photos/food-item/${foodId}`,
      { params }
    );
  },
};
