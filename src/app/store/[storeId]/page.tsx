import { Metadata } from "next";
import { StoreClient } from "./store-client";
import { fetchStore, fetchFoodsByStore } from "@/lib/api/server";
import type { FoodItemResponse } from "@/lib/types/customer";

interface StorePageProps {
  params: Promise<{ storeId: string }>;
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const storeId = Number(resolvedParams.storeId);

  try {
    const storeResponse = await fetchStore(storeId);
    const store = storeResponse?.result;

    if (store) {
      return {
        title: `${store.storeName} - 셰프렌드`,
        description: store.description || `${store.storeName}의 맛평 가능한 메뉴를 확인하세요.`,
        openGraph: {
          title: `${store.storeName} - 셰프렌드`,
          description: store.description || `${store.storeName}의 맛평 가능한 메뉴를 확인하세요.`,
        },
      };
    }
  } catch {
    // Silently handle metadata fetch errors
  }

  return {
    title: "가게 상세 - 셰프렌드",
    description: "맛평 가능한 메뉴를 확인하세요.",
  };
}

export default async function StoreDetailPage({ params }: StorePageProps) {
  const resolvedParams = await params;
  const storeId = Number(resolvedParams.storeId);

  try {
    // 서버에서 데이터 fetch (SSR)
    // Store와 Foods를 개별적으로 fetch (하나가 실패해도 다른 건 성공할 수 있도록)
    let storeData = null;
    let foodsData: FoodItemResponse[] = [];

    // Store 정보 fetch
    try {
      const storeResponse = await fetchStore(storeId);
      storeData = storeResponse?.result;
    } catch {
      // Silently handle store fetch errors (known backend issue with store details endpoint)
      // Store info will use default values if fetch fails
    }

    // Foods 정보 fetch
    try {
      const foodsResponse = await fetchFoodsByStore(storeId, { page: 0, size: 20 });
      foodsData = foodsResponse?.result?.content || [];
    } catch {
      // Silently handle foods fetch errors
      // Foods list will be empty if fetch fails
    }

    // Store 정보가 없으면 기본값 생성
    if (!storeData) {
      storeData = {
        storeId: storeId,
        storeName: `가게 #${storeId}`,
        description: "",
        address: "",
      };
    }

    return <StoreClient storeId={storeId} storeData={storeData} foodsData={foodsData} />;
  } catch (error) {
    console.error(`[StoreDetailPage] Unexpected error for store ${storeId}:`, error);
    throw error; // Let error boundary handle it
  }
}
