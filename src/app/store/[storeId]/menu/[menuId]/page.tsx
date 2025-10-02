"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock 데이터
const mockMenuData = {
  id: 1,
  name: "기영이 김치찌개",
  price: 9000,
  points: 2000,
  description: "정성스럽게 끊인 김치찌개입니다.\n신김치와 돼지고기가 들어가 깊은 맛을 냅니다.\n집에서 직접 담근 김치로 만들어\n더욱 진한 맛을 자랑합니다.",
  images: ["/kimchi1.png", "/kimchi2.png", "/kimchi3.png"],
  store: {
    name: "기영이네 분식나라",
    availableMenus: 7,
  },
};

const deliveryPlatforms = [
  { id: 1, name: "요기요", image: "/yogiyo.png", link: "https://yogiyo.co.kr" },
  { id: 2, name: "배달의민족", image: "/baemin.png", link: "https://baemin.com" },
  { id: 3, name: "쿠팡이츠", image: "/coupangeats.png", link: "https://coupangeats.com" },
];

export default function Page({
  params,
}: {
  params: Promise<{ storeId: string; menuId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleBack = () => {
    router.push(`/store/${resolvedParams.storeId}`);
  };

  const handleSettings = () => {
    router.push("/mypage");
  };

  const handleReview = () => {
    router.push(`/store/${resolvedParams.storeId}/menu/${resolvedParams.menuId}/review`);
  };

  const handlePlatformClick = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button onClick={handleBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button onClick={handleSettings}>
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 pb-28">
        {/* Main Image */}
        <div className="w-full h-56">
          <Image
            src={mockMenuData.images[selectedImageIndex]}
            alt={mockMenuData.name}
            width={375}
            height={220}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnail Indicators */}
        <div className="bg-white px-4 py-3">
          <div className="flex gap-1.5">
            {mockMenuData.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className="flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-md overflow-hidden border border-gray-200">
                  <Image
                    src={image}
                    alt={`${mockMenuData.name} ${index + 1}`}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedImageIndex === index && (
                  <div className="h-1 bg-gray-600 rounded w-7 mt-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Info */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-gray-800 font-medium text-xl">
              {mockMenuData.name}
            </h1>
            <span className="text-gray-900 font-bold text-xl">
              {mockMenuData.price.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="px-4 pb-6">
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-gray-800 text-sm text-center whitespace-pre-line leading-relaxed">
              {mockMenuData.description}
            </p>
          </div>
        </div>

        {/* Point Info */}
        <div className="px-4 pb-6">
          <div className="flex items-center justify-center gap-1">
            <span className="text-purple-700 font-semibold text-sm">
              주문하고 맛평하면
            </span>
            <span className="text-purple-700 font-semibold text-sm">
              {mockMenuData.points.toLocaleString()}P
            </span>
          </div>
        </div>

        {/* Delivery Platforms */}
        <div className="px-4">
          <h2 className="text-gray-800 font-bold text-lg mb-4">
            바로 주문하러 가기
          </h2>
          <div className="flex gap-4 justify-center">
            {deliveryPlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handlePlatformClick(platform.link)}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-20 h-20 rounded-xl border border-gray-300 p-2">
                  <Image
                    src={platform.image}
                    alt={platform.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-gray-800 font-semibold text-sm">
                  {platform.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Fixed Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button
          className="w-full h-14 bg-purple-700 hover:bg-purple-800 text-white font-bold text-lg rounded-xl"
          onClick={handleReview}
        >
          맛 평가하기
        </Button>
      </div>
    </div>
  );
}
