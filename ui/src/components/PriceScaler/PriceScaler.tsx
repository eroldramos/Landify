import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PriceScalerProps {
  min: number;
  max: number;
  step: number;
  defaultMinValue: number;
  defaultMaxValue: number;
  onValueChange: (values: [number, number]) => void;
  debounceMs?: number;
  value?: [number, number];
}

export const PriceScaler = ({
  min,
  max,
  step,
  defaultMinValue,
  defaultMaxValue,
  onValueChange,
  debounceMs = 300,
  value,
}: PriceScalerProps) => {
  const [values, setValues] = useState<[number, number]>([
    defaultMinValue,
    defaultMaxValue,
  ]);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (value) {
      setValues(value);
    } else {
      // Reset to default when value is undefined/null (cleared)
      setValues([defaultMinValue, defaultMaxValue]);
    }
  }, [value, defaultMinValue, defaultMaxValue]);

  const handleValueChange = (newValues: number[]) => {
    const newValuesTuple: [number, number] = [newValues[0], newValues[1]];
    setValues(newValuesTuple);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      onValueChange(newValuesTuple);
    }, debounceMs);
  };

  const handleReset = () => {
    const resetValues: [number, number] = [defaultMinValue, defaultMaxValue];
    setValues(resetValues);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    onValueChange(resetValues);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const hasCustomValues =
    values[0] !== defaultMinValue || values[1] !== defaultMaxValue;

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
          Custom Price Range
        </label>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">
            {formatPrice(values[0])} - {formatPrice(values[1])}
          </div>
          {hasCustomValues && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              title="Reset to default range"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
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
};

PriceScaler.displayName = "PriceScaler";
