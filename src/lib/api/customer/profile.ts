import { apiClient } from "../client";
import type { ApiResponse, CustomerTasteDto } from "@/lib/types/customer";

/**
 * 입맛 프로필 조회
 */
export async function getTasteProfile(): Promise<CustomerTasteDto> {
  const response = await apiClient.get<ApiResponse<CustomerTasteDto>>(
    "/api/user/profile/taste"
  );
  return response.result;
}

/**
 * 입맛 프로필 생성/수정
 */
export async function updateTasteProfile(
  data: CustomerTasteDto
): Promise<CustomerTasteDto> {
  const response = await apiClient.put<ApiResponse<CustomerTasteDto>>(
    "/api/user/profile/taste",
    data
  );
  return response.result;
}
