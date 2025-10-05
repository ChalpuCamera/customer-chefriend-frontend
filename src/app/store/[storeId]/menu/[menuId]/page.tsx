import { Metadata } from "next";
import { MenuClient } from "./menu-client";
import { fetchFood, fetchPhotosByFoodItem } from "@/lib/api/server";

interface MenuPageProps {
  params: Promise<{ storeId: string; menuId: string }>;
}

export async function generateMetadata({ params }: MenuPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const foodId = parseInt(resolvedParams.menuId);

  try {
    const menuResponse = await fetchFood(foodId);
    const menu = menuResponse?.result;

    if (menu) {
      return {
        title: `${menu.foodName} - 셰프렌드`,
        description: menu.description || `${menu.foodName} - ${menu.price.toLocaleString()}원`,
        openGraph: {
          title: `${menu.foodName} - 셰프렌드`,
          description: menu.description || `${menu.foodName} - ${menu.price.toLocaleString()}원`,
          images: menu.thumbnailUrl ? [menu.thumbnailUrl] : [],
        },
      };
    }
  } catch (error) {
    console.error(`[generateMetadata] Failed to fetch menu ${foodId}:`, error);
  }

  return {
    title: "메뉴 상세 - 셰프렌드",
    description: "맛평을 남겨보세요.",
  };
}

export default async function MenuPage({ params }: MenuPageProps) {
  const resolvedParams = await params;
  const foodId = parseInt(resolvedParams.menuId);

  try {
    // 서버에서 데이터 fetch (SSR)
    const [menuResponse, photosResponse] = await Promise.all([
      fetchFood(foodId),
      fetchPhotosByFoodItem(foodId),
    ]);

    const menuData = menuResponse?.result;
    const photos = Array.isArray(photosResponse?.result)
      ? photosResponse.result
      : [];

    if (!menuData) {
      throw new Error("Menu data not found");
    }

    return <MenuClient menuData={menuData} photos={photos} />;
  } catch (error) {
    console.error(`[MenuPage] Failed to fetch menu ${foodId}:`, error);
    throw error; // Let error boundary handle it
  }
}
