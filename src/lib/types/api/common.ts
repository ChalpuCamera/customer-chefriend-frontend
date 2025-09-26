// Common API Response Types

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface PageResponse<T> {
  content: T[];
  page: number; // 0부터 시작
  size: number; // 기본값: 10
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Pageable {
  page?: number; // 기본값: 0
  size?: number; // 기본값: 10
  sort?: string | string[]; // 문자열 또는 배열 모두 지원
}

export interface ErrorResponse {
  code: number;
  message: string;
  timestamp?: string;
  path?: string;
}
