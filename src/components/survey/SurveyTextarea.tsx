"use client";

import { Textarea } from "@/components/ui/textarea";

interface SurveyTextareaProps {
  question: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export function SurveyTextarea({
  question,
  placeholder = "",
  value,
  onChange,
  maxLength = 200,
}: SurveyTextareaProps) {
  return (
    <div className="mb-8">
      {/* Question */}
      <h3 className="text-gray-800 text-headline-b mb-4">{question}</h3>

      {/* Textarea */}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="min-h-[120px] text-body-r resize-none"
        />
        <div className="absolute bottom-3 right-3 text-sub-body-r text-gray-600">
          {value.length}/{maxLength}
        </div>
      </div>
    </div>
  );
}
