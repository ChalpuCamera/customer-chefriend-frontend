import { Metadata } from "next";
import { HomeClient } from "./home-client";
import { fetchAllStores } from "@/lib/api/server";

export async function generateMetadata(): Promise<Metadata> {
  // 나중에 쿼리 파라미터나 경로에서 지역 정보를 가져올 수 있음
  const location = "마포구"; // TODO: 동적으로 받아올 수 있도록 준비

  return {
    title: `${location} 맛평 리스트 - 셰프렌드`,
    description: `여러분의 솔직한 평가가 가게를 살립니다. ${location} 맛집 리스트를 확인하고 맛 평가를 남겨보세요.`,
    openGraph: {
      title: `${location} 맛평 리스트 - 셰프렌드`,
      description: "여러분의 솔직한 평가가 가게를 살립니다.",
    },
  };
}

export default async function HomePage() {
  try {
    // 서버에서 데이터 fetch (SSR)
    const storesResponse = await fetchAllStores({ page: 0, size: 20 });
    const stores = storesResponse?.result?.content || [];

    // Debug: Log store IDs to verify data
    console.log("[HomePage] Fetched stores:", stores.map(s => ({ id: s.storeId, name: s.storeName })));

    return <HomeClient initialStores={stores} />;
  } catch (error) {
    console.error("[HomePage] Failed to fetch stores:", error);
    // Return empty list on error - error boundary will catch if needed
    return <HomeClient initialStores={[]} />;
  }
}
