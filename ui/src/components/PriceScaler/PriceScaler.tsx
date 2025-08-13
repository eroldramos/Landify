"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

interface PriceScalerProps {
  min: number;
  max: number;
  step: number;
  defaultMinValue: number;
  defaultMaxValue: number;
  onValueChange: (values: [number, number]) => void;
}

export function PriceScaler({
  min,
  max,
  step,
  defaultMinValue,
  defaultMaxValue,
  onValueChange,
}: PriceScalerProps) {
  const [values, setValues] = useState<[number, number]>([
    defaultMinValue,
    defaultMaxValue,
  ]);

  useEffect(() => {
    onValueChange(values);
  }, [values, onValueChange]);

  const handleValueChange = (newValues: number[]) => {
    setValues([newValues[0], newValues[1]]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Property Price Range
        </label>
        <div className="text-sm text-gray-600">
          {formatPrice(values[0])} - {formatPrice(values[1])}
        </div>
      </div>

      <div className="px-2">
        <Slider
          value={values}
          onValueChange={handleValueChange}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>
    </div>
  );
}
