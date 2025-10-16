"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export interface RadioOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface SurveyRadioProps {
  question: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
}

export function SurveyRadio({
  question,
  options,
  value,
  onChange,
}: SurveyRadioProps) {
  return (
    <div className="mb-8">
      {/* Question */}
      <h3 className="text-gray-800 text-headline-b mb-4">{question}</h3>

      {/* Radio Group */}
      <RadioGroup value={value} onValueChange={onChange} className="gap-0">
        {options.map((option) => (
          <div
            key={option.value}
            className="bg-white h-12 overflow-clip flex items-center justify-between px-4"
          >
            <Label
              htmlFor={option.value}
              className={`flex-1 cursor-pointer ${
                value === option.value
                  ? "text-purple-700 text-body-sb"
                  : "text-gray-700 text-body-r"
              }`}
            >
              {option.label}
              {option.sublabel && (
                <span className="text-gray-600 ml-1">({option.sublabel})</span>
              )}
            </Label>
            <RadioGroupItem value={option.value} id={option.value} />
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
