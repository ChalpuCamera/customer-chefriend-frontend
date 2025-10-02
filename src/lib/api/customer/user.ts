import { apiClient } from "../client";
import type { ApiResponse, UserDto } from "@/lib/types/customer";

export const userApi = {
  // 현재 사용자 정보 조회
  getCurrentUser: () =>
    apiClient.get<ApiResponse<UserDto>>("/api/user/me"),
};
