"use client";

import { use } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useStore } from "@/lib/hooks/customer/useStore";

// Mock 데이터 (메뉴 목록 - API 없음)
const mockMenus = [
  {
    id: 1,
    name: "신토불이 갈릭타코",
    price: 8000,
    points: 2000,
    reviewCount: 13,
    image: "/kimchi.png",
  },
  {
    id: 2,
    name: "오소리감투 타코",
    price: 8000,
    points: 500,
    reviewCount: 30,
    image: "/kimchi.png",
  },
  {
    id: 3,
    name: "딩가딩가 돼지타코",
    price: 8000,
    points: 500,
    reviewCount: 140,
    image: "/kimchi.png",
  },
  {
    id: 4,
    name: "신김치 타코",
    price: 8000,
    points: 500,
    reviewCount: 30,
    image: "/kimchi.png",
  },
];

export default function StoreDetailPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  // API 데이터 가져오기
  const { data: storeData, isLoading } = useStore(
    Number(resolvedParams.storeId)
  );

  // Mock 데이터와 API 데이터 병합
  const mockStoreData = {
    id: Number(resolvedParams.storeId),
    name: storeData?.storeName || "타코다코다 홍대점",
    availableMenus: mockMenus.length, // TODO: API에서 메뉴 개수 제공 필요
    reviewCount: 213, // TODO: API에서 리뷰 개수 제공 필요
    image: "/kimchi.png", // TODO: API에서 썸네일 제공 필요
    menuCategories: ["맛평 가능한 메뉴"],
    description:
      storeData?.description || "홍대입구역 4번 출구 바로 앞에 위치한 타코 맛집 입니당",
  };

  const handleBack = () => {
    router.push("/home");
  };

  const handleMenuClick = (menuId: number) => {
    router.push(`/store/${resolvedParams.storeId}/menu/${menuId}`);
  };

  // 로딩 처리
  if (isLoading) {
    return (
      <div className="h-screen w-full mx-auto bg-white flex items-center justify-center">
        <p className="text-gray-500">로딩중...</p>
      </div>
    );
  }

  return (
    <div className="bg-white w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-11">
        <button onClick={handleBack}>
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Store Info */}
      <div>

      <div className="p-4 flex items-center justify-between h-26 mb-4">
        <div className="flex items-center gap-4">
          <Image
            src={mockStoreData.image}
            alt={mockStoreData.name}
            width={72}
            height={72}
            className="rounded-full object-cover w-18 h-18"
          />
          <div>
            <h3 className="text-gray-800 text-headline-m">
              {mockStoreData.name}
            </h3>
            <p className="text-gray-700 text-sub-body-r mt-1">
              맛평 가능 메뉴 {mockStoreData.availableMenus}개
            </p>
          </div>
        </div>
        <div className="text-center flex flex-col gap-0.5">
          <p className="text-purple-700 text-body-sb">
            {mockStoreData.reviewCount}
          </p>
          <p className="text-gray-800 text-sub-body-r">맛평수</p>
        </div>
      </div>
      <div className="px-4 mb-6">
          <div className="bg-gray-100 rounded-xl p-4">
            <p className="text-body-r text-gray-800 text-center whitespace-pre-line leading-relaxed">
              {mockStoreData?.description}
              </p>
            </div>
          </div>
      </div>

      {/* Menu Categories */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-gray-800 text-headline-b">맛평 가능한 메뉴</h2>
          <span className="text-gray-600 text-sub-body-sb">
            {mockMenus.length}개
          </span>
        </div>
      </div>

      {/* Menu List */}
      <div className="">
        {mockMenus.map((menu) => (
          <div
            key={menu.id}
            className="p-4 flex items-center gap-4 h-30.5"
            onClick={() => handleMenuClick(menu.id)}
          >
            <Image
              src={menu.image}
              alt={menu.name}
              width={98}
              height={98}
              className="rounded-sm object-coverw-24.5 h-24.5"
            />
            <div className="flex-1">
              <h3 className="text-gray-800 text-headline-m">{menu.name}</h3>
              <p className="text-gray-800 text-sub-body-r">
                {menu.price.toLocaleString()}원
              </p>
              <p className="text-purple-700 text-body-sb">
                {menu.points.toLocaleString()}P 지급
              </p>
            </div>
            <div className="text-center flex flex-col gap-0.5">
              <p className="text-gray-800 text-body-sb">
                {menu.reviewCount}
              </p>
              <p className="text-gray-800 text-sub-body-r">맛평수</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
