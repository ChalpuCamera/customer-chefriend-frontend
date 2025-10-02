"use client";

import { use } from "react";
import { ArrowLeft, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Mock 데이터
const mockStoreData = {
  id: 2,
  name: "타코다코다 홍대점",
  availableMenus: 12,
  reviewCount: 213,
  image: "/store2.png",
  menuCategories: ["맛평 가능한 메뉴"],
};

const mockMenus = [
  {
    id: 1,
    name: "신토불이 갈릭타코",
    price: 8000,
    points: 2000,
    reviewCount: 13,
    image: "/menu1.png",
  },
  {
    id: 2,
    name: "오소리감투 타코",
    price: 8000,
    points: 500,
    reviewCount: 30,
    image: "/menu2.png",
  },
  {
    id: 3,
    name: "딩가딩가 돼지타코",
    price: 8000,
    points: 500,
    reviewCount: 140,
    image: "/menu3.png",
  },
  {
    id: 4,
    name: "신김치 타코",
    price: 8000,
    points: 500,
    reviewCount: 30,
    image: "/menu4.png",
  },
];

export default function StoreDetailPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const handleBack = () => {
    router.push("/home");
  };

  const handleSettings = () => {
    router.push("/mypage");
  };

  const handleMenuClick = (menuId: number) => {
    router.push(`/store/${resolvedParams.storeId}/menu/${menuId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button onClick={handleBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button onClick={handleSettings}>
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Store Info */}
      <div className="bg-white px-4 py-4 border-b">
        <div className="flex items-center gap-4">
          <Image
            src={mockStoreData.image}
            alt={mockStoreData.name}
            width={72}
            height={72}
            className="rounded-full"
          />
          <div className="flex-1">
            <h1 className="text-gray-800 font-medium text-lg">
              {mockStoreData.name}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              맛평 가능 메뉴 {mockStoreData.availableMenus}개
            </p>
          </div>
          <div className="text-center">
            <p className="text-purple-700 font-semibold text-base">
              {mockStoreData.reviewCount}
            </p>
            <p className="text-gray-800 text-sm">맛평수</p>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-gray-800 font-bold text-lg">
            맛평 가능한 메뉴
          </h2>
          <span className="text-gray-600 text-sm font-semibold">
            {mockMenus.length}개
          </span>
        </div>
      </div>

      {/* Menu List */}
      <div className="">
        {mockMenus.map((menu) => (
          <div
            key={menu.id}
            className="px-4 py-4 flex items-center gap-4 border-b cursor-pointer hover:bg-gray-50"
            onClick={() => handleMenuClick(menu.id)}
          >
            <Image
              src={menu.image}
              alt={menu.name}
              width={98}
              height={98}
              className="rounded-xl object-cover border border-gray-200"
            />
            <div className="flex-1">
              <h3 className="text-gray-800 font-medium text-lg">
                {menu.name}
              </h3>
              <p className="text-purple-700 font-semibold text-base mt-1">
                {menu.points.toLocaleString()}P 지급
              </p>
              <p className="text-gray-800 text-base mt-1">
                {menu.price.toLocaleString()}원
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-800 font-semibold text-base">
                {menu.reviewCount}
              </p>
              <p className="text-gray-800 text-sm">맛평수</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
