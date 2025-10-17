import { apiClient } from "../client";
import type {
  ApiResponse,
  PageResponse,
  PhotoResponse,
  PresignedUrlResponse,
  FeedbackPhotoUrlInfo,
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

  // Presigned URL 생성 (여러 파일)
  getPresignedUrls: async (
    fileNames: string[]
  ): Promise<PresignedUrlResponse> => {
    const response = await apiClient.post<ApiResponse<PresignedUrlResponse>>(
      "/api/customer-feedback/presigned-urls",
      { fileNames }
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

  // 단일 파일 업로드 프로세스 (s3Key 반환)
  uploadImage: async (file: File): Promise<string> => {
    // 1. Presigned URL 요청 (단일 파일도 배열로)
    const { photoUrls } = await photoApi.getPresignedUrls([file.name]);
    const photoInfo = photoUrls[0];

    // 2. S3에 업로드
    await photoApi.uploadToS3(photoInfo.presignedUrl, file);

    // 3. s3Key 반환 (photoUrls가 아님!)
    return photoInfo.s3Key;
  },

  // 여러 파일 업로드 프로세스 (s3Key 배열 반환)
  uploadImages: async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    // 1. Presigned URL들 요청
    const fileNames = files.map((f) => f.name);
    const { photoUrls } = await photoApi.getPresignedUrls(fileNames);

    // 2. 모든 파일을 S3에 업로드
    await Promise.all(
      photoUrls.map((photoInfo, index) =>
        photoApi.uploadToS3(photoInfo.presignedUrl, files[index])
      )
    );

    // 3. s3Key 배열 반환
    return photoUrls.map((p) => p.s3Key);
  },
};
