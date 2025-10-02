"use client";

import React from "react";
import { Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useUser } from "@/lib/hooks/customer/useUser";
import { useMyFeedbacks } from "@/lib/hooks/customer/useFeedback";

// Mock 데이터 (가게 목록 - API 없음)

// const mockFeaturedCampaign = {
//   id: 1,
//   storeName: "마포구 타코다코다",
//   menuName: "갈릭타고 먹고 맛평하기",
//   points: 2000,
//   isNew: true,
//   image: "/taco.png",
// };

const mockStores = [
  {
    id: 1,
    name: "기영이네 분식나라",
    availableMenus: 7,
    reviewCount: 11,
    image: "/kimchi.png",
  },
  {
    id: 2,
    name: "타코다코다 홍대점",
    availableMenus: 12,
    reviewCount: 213,
    image: "/kimchi.png",
  },
  {
    id: 3,
    name: "칙힌골뱅이 마포점",
    availableMenus: 2,
    reviewCount: 54,
    image: "/kimchi.png",
  },
  {
    id: 4,
    name: "엘꼬라손베르데",
    availableMenus: 17,
    reviewCount: 3,
    image: "/kimchi.png",
  },
];

export default function Page() {
  const router = useRouter();

  // API 데이터 가져오기
  const { data: userData } = useUser();
  const { data: feedbacksData } = useMyFeedbacks();

  // Mock 데이터와 API 데이터 병합
  const mockUserData = {
    name: userData?.name || "맛평단1",
    points: 6000, // TODO: API에서 포인트 정보 제공 필요
  };

  const mockOngoingSurvey = false;

  const handleSettings = () => {
    router.push("/mypage");
  };

  const handleStoreClick = (storeId: number) => {
    router.push(`/store/${storeId}`);
  };

  const handleSurveyClick = () => {
    router.push("/feedback");
  };

  // const handleCampaignClick = () => {
  //   // 첫 번째 가게의 첫 번째 메뉴로 이동 (임시)
  //   router.push("/store/1/menu/1");
  // };

  return (
    <div className="bg-white w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-11">
        <Image src="/logo_small.png" alt="Logo" width={88} height={27} />
        <button className="" onClick={handleSettings}>
          <Image src="/setting_icon.png" alt="setting" width={20} height={20} />
        </button>
      </div>

      {/* User Greeting */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-gray-800 text-body-sb">
            반가워요, {mockUserData.name}님
          </h1>
          <div className="flex items-center text-body-sb gap-1">
            <span className="text-gray-900">P</span>
            <span className="text-purple-600">
              {mockUserData.points.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            type="text"
            placeholder="메뉴, 가게 이름 검색"
            className="w-full pl-10 pr-4 py-3 border border-gray-500 rounded-xl h-11"
          />
        </div>
      </div>

      {/* Featured Campaign */}
      {/* <div className="px-4 pb-4">
        <div
          className="bg-gradient-to-r from-green-100 to-green-50 rounded-2xl p-4 h-32 cursor-pointer"
          onClick={handleCampaignClick}
        >
          <div className="flex justify-between h-full">
            <div className="flex flex-col justify-between">
              <div>
                {mockFeaturedCampaign.isNew && (
                  <span className="inline-block bg-green-500 text-black text-xs font-bold px-2 py-0.5 rounded mb-2">
                    New Menu
                  </span>
                )}
                <span className="text-green-700 font-bold text-xs ml-2">
                  {mockFeaturedCampaign.points.toLocaleString()}P
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">{mockFeaturedCampaign.storeName}</p>
                <p className="text-gray-900 font-bold text-lg mt-1">
                  {mockFeaturedCampaign.menuName}
                </p>
              </div>
            </div>
            <div className="relative w-28 h-28 -mr-2">
              <Image
                src={mockFeaturedCampaign.image}
                alt={mockFeaturedCampaign.menuName}
                width={112}
                height={112}
                className="rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </div> */}

      {/* Ongoing Survey Alert */}
      {mockOngoingSurvey && (
        <div className="p-4">
          <div
            className="bg-white flex items-center justify-between"
            onClick={handleSurveyClick}
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 flex items-center justify-center">
                <Image
                  src="/review_icon.png"
                  alt="Survey"
                  width={40}
                  height={40}
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-gray-800 text-headline-b">
                  작성 중이던 맛 평가가 있어요
                </p>
                <p className="text-gray-700 text-sub-body-r">
                  이어서 진행하고 리워드 받기
                </p>
              </div>
            </div>
            <div className="w-7.5 h-7.5 bg-purple-700 rounded-full flex items-center justify-center">
              <ArrowRight className=" text-white"/>
            </div>
          </div>
        </div>
      )}

      {/* Store List */}
      <div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-gray-800 text-headline-b">마포구 맛평 리스트</h2>
            <span className="text-purple-700 text-body-sb">{500}P 지급</span>
          </div>
        </div>

        {/* Store Items */}
        <div className="space-y-0">
          {mockStores.map((store) => (
            <div
              key={store.id}
              className="p-4 flex items-center justify-between h-26"
              onClick={() => handleStoreClick(store.id)}
            >
              <div className="flex items-center gap-4">
                <Image
                  src={store.image}
                  alt={store.name}
                  width={72}
                  height={72}
                  className="rounded-full object-cover w-18 h-18"
                />
                <div>
                  <h3 className="text-gray-800 text-headline-b">
                    {store.name}
                  </h3>
                  <p className="text-gray-700 text-sub-body-r mt-1">
                    맛평 가능 메뉴 {store.availableMenus}개
                  </p>
                </div>
              </div>
              <div className="text-center flex flex-col gap-0.5">
                <p className="text-purple-700 text-body-sb">
                  {store.reviewCount}
                </p>
                <p className="text-gray-800 text-sub-body-r">맛평수</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
