// API 공통 응답 타입
export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Pageable extends Record<string, unknown> {
  page?: number;
  size?: number;
  sort?: string[];
}

// 사용자 정보
export interface UserDto {
  id: number;
  email: string;
  name: string;
  profileImageUrl?: string;
  provider: string;
  role: string;
}

// 매장 정보
export interface StoreResponse {
  storeId: number;
  storeName: string;
  address: string;
  baeminLink?: string;
  yogiyoLink?: string;
  coupangEatsLink?: string;
  description?: string;
  thumbnailUrl?: string;
}

// 음식 정보
export interface FoodItemResponse {
  foodItemId: number;
  storeId: number;
  foodName: string;
  description?: string;
  price: number;
  isActive: boolean;
  thumbnailUrl?: string;
  categoryName?: string;
  createdAt: string;
  updatedAt: string;
}

// 사진 정보
export interface PhotoResponse {
  photoId: number;
  storeId: number;
  userId: number;
  foodItemId?: number;
  imageUrl: string;
  fileName: string;
  fileSize: number;
  imageWidth: number;
  imageHeight: number;
  createdAt: string;
}

// 피드백 정보
export interface CustomerFeedbackResponse {
  feedbackId: number;
  foodName: string;
  storeName: string;
  surveyName: string;
  createdAt: string;
  surveyAnswers: SurveyAnswerResponse[];
  photoUrls: string[];
}

export interface SurveyAnswerResponse {
  id: number;
  questionId: number;
  questionText: string;
  questionType: string;
  answerText?: string;
  numericValue?: number;
}

// 리워드 정보
export interface RewardRedemptionResponse {
  id: number;
  rewardId: number;
  rewardTitle: string;
  status: string;
  expiresAt?: string;
  discountRate?: number;
  redeemedAt: string;
  usedAt?: string;
}

// 입맛 프로필
export interface CustomerTasteDto {
  spicyLevel: number; // 1: 덜 맵게, 2: 보통, 3: 더 맵게
  mealAmount: number; // 1: 0.5인분, 2: 1인분, 3: 1.5인분
  mealSpending: number; // 1: 만원 이하, 2: 만원~2만원, 3: 2만원 이상
}

// 설문 답변 요청
export interface SurveyAnswerRequest {
  questionId: number;
  answerText?: string;
  numericValue?: number;
}

// 피드백 생성 요청
export interface FeedbackCreateRequest {
  storeId: number;
  foodId: number;
  surveyId: number;
  campaignId?: number;
  surveyAnswers: SurveyAnswerRequest[];
  photoS3Keys: string[];
}

// 개별 사진 Presigned URL 정보
export interface FeedbackPhotoUrlInfo {
  originalFileName: string;
  presignedUrl: string;
  s3Key: string;
}

// Presigned URL 응답
export interface PresignedUrlResponse {
  photoUrls: FeedbackPhotoUrlInfo[];
}
