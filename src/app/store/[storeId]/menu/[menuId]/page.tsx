"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useFood } from "@/lib/hooks/customer/useFood";
import { usePhotosByFoodItem } from "@/lib/hooks/customer/usePhoto";
import { CustomButton } from "@/components/ui/custom-button";
export default function Page({
  params,
}: {
  params: Promise<{ storeId: string; menuId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const foodId = parseInt(resolvedParams.menuId);

  // API 데이터 가져오기
  const { data: menuData, isLoading } = useFood(foodId);
  const { data: photos = [] } = usePhotosByFoodItem(foodId);

  // 이미지 배열 구성 (thumbnail + photos)
  const allImages = [
    ...(menuData?.thumbnailUrl
      ? [{ url: menuData.thumbnailUrl, id: "thumbnail" }]
      : []),
    ...photos
      .filter((photo) => photo.imageUrl !== menuData?.thumbnailUrl) // 중복 썸네일 제거
      .map((photo) => ({ url: photo.imageUrl, id: photo.photoId })),
  ].slice(0, 3); // 최대 3개까지만

  const handleBack = () => {
    router.back();
  };

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

      {/* Main Content - pt 추가하여 헤더 공간 확보 */}
      <div className="">
        {/* Main Image */}
        <div className="w-full h-[220px]">
          {allImages.length > 0 ? (
            <Image
              src={allImages[selectedImageIndex]?.url || "/kimchi.png"}
              alt={menuData?.foodName || "메뉴 이미지"}
              width={375}
              height={220}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">이미지 없음</p>
            </div>
          )}
        </div>

        {/* Thumbnail Indicator with Set as Thumbnail Button */}
        <div className="bg-white px-4 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {(allImages.length > 0
                ? allImages
                : [{ url: "/kimchi.png", id: "default" }]
              ).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className="flex flex-col items-center"
                >
                  <div className="w-[38px] h-[38px] rounded-md overflow-hidden">
                    <Image
                      src={image.url}
                      alt={`메뉴 이미지 ${index + 1}`}
                      width={38}
                      height={38}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedImageIndex === index && (
                    <div className="h-1 bg-gray-500 rounded-md w-[26px] mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Info */}
        <div className="px-4 py-4 flex items-center justify-between">
          <h2 className="text-sub-title-m text-gray-800">
            {menuData?.foodName}
          </h2>
          <span className="text-headline-b text-gray-900">
            {menuData?.price?.toLocaleString()}원
          </span>
        </div>

        {/* Description */}
        <div className="px-4 mb-6">
          <div className="bg-gray-100 rounded-xl p-4">
            <p className="text-body-r text-gray-800 text-center whitespace-pre-line leading-relaxed">
              {menuData?.description}
            </p>
          </div>
        </div>

        {/* Order Section */}
        <div className="px-4 mb-6">
          <div className="flex gap-3">
            <h3 className="text-headline-b text-gray-800 mb-4">
              바로 주문하러 가기
            </h3>
            <div className="flex gap-1">
              <p className="text-body-sb text-purple-700">
                주문하고 맛평하면 {"2,000"}P
              </p>
            </div>
          </div>
          </div>
          <div className="px-4 mb-6">
          {/* Delivery Apps Grid */}
          <div className="flex gap-4 justify-between">
            {/* 요기요 */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-[74px] h-[74px] border border-[#ced4da] rounded-xl overflow-hidden mb-2">
                <Image
                  src="/yogiyo.png"
                  alt="요기요"
                  width={74}
                  height={74}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[16px] font-semibold text-[#343a40] tracking-[-0.32px]">
                요기요
              </p>
            </div>

            {/* 배달의민족 */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-[74px] h-[74px] border border-[#ced4da] rounded-xl overflow-hidden mb-2">
                <Image
                  src="/baemin.png"
                  alt="배달의민족"
                  width={74}
                  height={74}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[16px] font-semibold text-[#343a40] tracking-[-0.32px]">
                배달의민족
              </p>
            </div>

            {/* 쿠팡이츠 */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-[74px] h-[74px] border border-[#ced4da] rounded-xl overflow-hidden mb-2">
                <Image
                  src="/coupangeats.png"
                  alt="쿠팡이츠"
                  width={74}
                  height={74}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[16px] font-semibold text-[#343a40] tracking-[-0.32px]">
                쿠팡이츠
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <div className="max-w-[430px] mx-auto pb-6 flex justify-center px-4">
          <CustomButton>맛 평가하기</CustomButton>
        </div>
      </div>
    </div>
  );
}
