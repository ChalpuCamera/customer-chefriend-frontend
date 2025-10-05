// Server-side API fetch functions for SSR/SSG
import type {
  ApiResponse,
  PageResponse,
  Pageable,
  StoreResponse,
  FoodItemResponse,
  PhotoResponse,
} from "@/lib/types/customer";

// Use server-only API_URL or fallback to NEXT_PUBLIC for compatibility
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "";

// Development token for server-side requests
const DEV_TOKEN =
  "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI1IiwiZW1haWwiOiJjdXN0b21lckB0ZXN0LmNvbSIsInJvbGUiOiJST0xFX0NVU1RPTUVSIiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTc1ODg2NDc4MSwiZXhwIjoyMDc0MjI0NzgxfQ.WUH7e88fjaK3FtbtEc1SJZnTuFLEZqyXUzCFBOTarBbxyY9f9eO-1_2PTQ6btgpf";

async function serverFetch<T>(
  endpoint: string,
  options?: RequestInit & { params?: Record<string, unknown> }
): Promise<T> {
  // Validate API URL
  if (!API_URL) {
    const errorMsg = "[Server API] API_URL is not configured";
    console.error(errorMsg, {
      nodeEnv: process.env.NODE_ENV,
      apiUrl: API_URL,
      nextPublicApiUrl: process.env.NEXT_PUBLIC_API_URL,
    });
    throw new Error("API_URL is not configured");
  }

  // Query parameters 처리
  let url = `${API_URL}${endpoint}`;
  if (options?.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    url += `?${searchParams.toString()}`;
  }

  console.log(`[Server API] Fetching: ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEV_TOKEN}`, // Use dev token for now
        ...options?.headers,
      },
      cache: options?.cache || "no-store", // SSR by default
    });

    console.log(`[Server API] Response: ${endpoint} - Status ${response.status}`);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));

      // Only log non-404 errors to reduce noise from known backend data issues
      if (response.status !== 404) {
        console.error(
          `[Server API Error] ${endpoint}:`,
          response.status,
          JSON.stringify(error, null, 2)
        );
      }

      throw new Error(error.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      `[Server API] Success: ${endpoint}`,
      typeof data === "object" ? Object.keys(data) : typeof data
    );
    return data;
  } catch (error) {
    console.error(`[Server API Fetch Error] ${endpoint}:`, error);
    throw error;
  }
}

// Store APIs
export async function fetchAllStores(
  pageable?: Pageable
): Promise<ApiResponse<PageResponse<StoreResponse>>> {
  return serverFetch("/api/stores/all", { params: pageable });
}

export async function fetchStore(
  storeId: number
): Promise<ApiResponse<StoreResponse>> {
  return serverFetch(`/api/stores/${storeId}`);
}

// Food APIs
export async function fetchFoodsByStore(
  storeId: number,
  pageable?: Pageable
): Promise<ApiResponse<PageResponse<FoodItemResponse>>> {
  return serverFetch(`/api/foods/store/${storeId}`, { params: pageable });
}

export async function fetchFood(
  foodId: number
): Promise<ApiResponse<FoodItemResponse>> {
  return serverFetch(`/api/foods/${foodId}`);
}

// Photo APIs
export async function fetchPhotosByFoodItem(
  foodItemId: number
): Promise<ApiResponse<PhotoResponse[]>> {
  return serverFetch(`/api/photos/food-item/${foodItemId}`);
}
