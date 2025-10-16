import { apiClient } from "../client";
import type {
  ApiResponse,
  PageResponse,
  PhotoResponse,
  PresignedUrlResponse,
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

  // Presigned URL 생성
  getPresignedUrl: async (
    fileName: string,
    contentType: string
  ): Promise<PresignedUrlResponse> => {
    const response = await apiClient.post<ApiResponse<PresignedUrlResponse>>(
      "/api/customer-feedback/presigned-urls",
      {
        fileName,
        contentType,
      }
    );
    return response.result;
  },

  // S3에 파일 업로드
  uploadToS3: async (presignedUrl: string, file: File): Promise<void> => {
    await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
  },

  // 전체 업로드 프로세스
  uploadImage: async (file: File): Promise<string> => {
    // 1. Presigned URL 요청
    const { presignedUrl, imageUrl } = await photoApi.getPresignedUrl(
      file.name,
      file.type
    );

    // 2. S3에 업로드
    await photoApi.uploadToS3(presignedUrl, file);

    // 3. 이미지 URL 반환
    return imageUrl;
  },
};
