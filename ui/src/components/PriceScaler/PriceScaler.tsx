"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface PriceScalerProps {
  min?: number;
  max?: number;
  step?: number;
  defaultMinValue?: number;
  defaultMaxValue?: number;
  onValueChange?: (values: [number, number]) => void;
  className?: string;
  formatPrice?: (price: number) => string;
}

export function PriceScaler({
  min = 0,
  max = 1000,
  step = 10,
  defaultMinValue,
  defaultMaxValue,
  onValueChange,
  className,
  formatPrice = (price) => `$${price.toLocaleString()}`,
}: PriceScalerProps) {
  const [minValue, setMinValue] = useState(defaultMinValue ?? min);
  const [maxValue, setMaxValue] = useState(defaultMaxValue ?? max);

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.min(Number(e.target.value), maxValue - step);
      setMinValue(value);
      onValueChange?.([value, maxValue]);
    },
    [maxValue, step, onValueChange],
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.max(Number(e.target.value), minValue + step);
      setMaxValue(value);
      onValueChange?.([minValue, value]);
    },
    [minValue, step, onValueChange],
  );

  return (
    <div className={cn("w-full space-y-6", className)}>
      <div className="text-center">
        <h3 className="text-lg font-semibold">Price Range</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {formatPrice(minValue)} - {formatPrice(maxValue)}
        </p>
      </div>

      <div className="space-y-4">
        {/* Minimum Price Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Minimum Price</label>
            <span className="text-sm text-muted-foreground">
              {formatPrice(minValue)}
            </span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={minValue}
            onChange={handleMinChange}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider-thumb"
          />
        </div>

        {/* Maximum Price Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Maximum Price</label>
            <span className="text-sm text-muted-foreground">
              {formatPrice(maxValue)}
            </span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={maxValue}
            onChange={handleMaxChange}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider-thumb"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>
    </div>
  );
}
