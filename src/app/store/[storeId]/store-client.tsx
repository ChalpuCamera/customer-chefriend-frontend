"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { StoreResponse, FoodItemResponse } from "@/lib/types/customer";

interface StoreClientProps {
  storeId: number;
  storeData: StoreResponse;
  foodsData: FoodItemResponse[];
}

export function StoreClient({ storeId, storeData, foodsData }: StoreClientProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push("/home");
  };

  const handleMenuClick = (menuId: number) => {
    router.push(`/store/${storeId}/menu/${menuId}`);
  };

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
            src={storeData.thumbnailUrl || "/store.png"}
            alt={storeData.storeName}
            width={72}
            height={72}
            className="rounded-full object-cover w-18 h-18"
          />
          <div>
            <h3 className="text-gray-800 text-headline-m">
              {storeData.storeName}
            </h3>
            <p className="text-gray-700 text-sub-body-r mt-1">
              메뉴 {foodsData.length}개
            </p>
          </div>
        </div>
        {/* <div className="text-center flex flex-col gap-0.5">
          <p className="text-purple-700 text-body-sb">
            {0}
          </p>
          <p className="text-gray-800 text-sub-body-r">맛평수</p>
        </div> */}
      </div>
      <div className="px-4 mb-6">
          <div className="bg-gray-100 rounded-xl p-4">
            <p className="text-body-r text-gray-800 text-center whitespace-pre-line leading-relaxed">
              {storeData.description || ""}
              </p>
            </div>
          </div>
      </div>

      {/* Menu Categories */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-gray-800 text-headline-b">메뉴</h2>
          <span className="text-gray-600 text-sub-body-sb">
            {foodsData.length}개
          </span>
        </div>
      </div>

      {/* Menu List */}
      <div className="">
        {foodsData.map((food) => (
          <div
            key={food.foodItemId}
            className="p-4 flex items-center gap-4 h-30.5"
            onClick={() => handleMenuClick(food.foodItemId)}
          >
            <Image
              src={food.thumbnailUrl || "/store.png"}
              alt={food.foodName}
              width={98}
              height={98}
              className="rounded-sm object-coverw-24.5 h-24.5"
            />
            <div className="flex-1 flex flex-col justify-between h-full">
              <h3 className="text-gray-800 text-headline-m">{food.foodName}</h3>
              <p className="text-gray-800 text-sub-body-r">
                {food.price.toLocaleString()}원
              </p>
              {/* <p className="text-purple-700 text-body-sb">
                {500}P 지급
              </p> */}
            </div>
            {/* <div className="text-center flex flex-col gap-0.5">
              <p className="text-gray-800 text-body-sb">
                {0}
              </p>
              <p className="text-gray-800 text-sub-body-r">맛평수</p>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
