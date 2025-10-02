import { apiClient } from "../client";
import type {
  ApiResponse,
  PageResponse,
  CustomerFeedbackResponse,
  Pageable,
} from "@/lib/types/customer";

export const feedbackApi = {
  // 내 피드백 목록 조회
  getMyFeedbacks: (pageable: Pageable = {}) => {
    const params = {
      page: pageable.page ?? 0,
      size: pageable.size ?? 20,
      sort: pageable.sort ?? ["createdAt,desc"],
    };
    return apiClient.get<ApiResponse<PageResponse<CustomerFeedbackResponse>>>(
      "/api/customer-feedback/me",
      { params }
    );
  },
};
