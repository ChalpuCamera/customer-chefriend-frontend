"use client";

import { Slider } from "@/components/ui/slider";
import { CheckSquare, Square } from "lucide-react";

interface SurveySliderProps {
  question: string;
  labels: {
    start: string;
    middle: string;
    end: string;
  };
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  showCheckbox?: boolean;
  isChecked?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
}

export function SurveySlider({
  question,
  labels,
  value,
  onChange,
  min = 0,
  max = 100,
  showCheckbox = false,
  isChecked = false,
  onCheckboxChange,
}: SurveySliderProps) {
  const handleCheckboxClick = () => {
    const newChecked = !isChecked;
    onCheckboxChange?.(newChecked);

    // 체크 시 null로 설정 (확인 어려움), 체크 해제 시 기본값 50
    if (newChecked) {
      onChange(null);
    } else {
      onChange(50);
    }
  };

  return (
    <div className="py-[18px]">
      {/* Checkbox - 질문 위에 단독으로 */}
      {showCheckbox && (
        <button
          type="button"
          onClick={handleCheckboxClick}
          className="mb-[13px]"
          aria-label="확인이 어렵습니다"
        >
          {isChecked ? (
            <CheckSquare size={20} className="text-[#7c3bc6]" />
          ) : (
            <Square size={20} className="text-[#495057]" />
          )}
        </button>
      )}

      {/* Question */}
      <h3 className="text-[#343a40] text-headline-b mb-4 text-center">
        {question}
      </h3>

      {/* Slider */}
      <div className="mb-[10px]">
        <Slider
          value={[value ?? 50]}
          onValueChange={(v) => onChange(v[0])}
          min={min}
          max={max}
          step={1}
          className="w-full"
          disabled={isChecked}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between items-center text-sub-body-sb text-[#495057]">
        <span>{labels.start}</span>
        <span>{labels.middle}</span>
        <span>{labels.end}</span>
      </div>
    </div>
  );
}
