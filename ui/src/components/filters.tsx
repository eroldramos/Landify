import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PropertyType, ListingStatus } from "../types/schema";
import { PriceScaler } from "./PriceScaler/PriceScaler";
import { useAppStore } from "@/store/appStore";
import { useRef } from "react";

export function Filters() {
  const priceScalerRef = useRef<{ reset: () => void }>(null);
  const { filters, setFilters } = useAppStore();
  const handlePropertyTypeChange = (value: string) => {
    setFilters({
      ...filters,
      propertyType: value as PropertyType | "",
    });
  };

  const handleStatusChange = (value: string) => {
    setFilters({
      ...filters,
      status: value as ListingStatus | "",
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    setFilters({
      ...filters,
      priceRange: value,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.propertyType !== "") count++;
    if (filters.status !== "") count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000) count++;
    return count;
  };

  return (
    <div className="bg-white border-b p-4 ">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="font-medium text-gray-900">Filters</span>
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="text-xs">
              {getActiveFilterCount()}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm text-gray-600"
          onClick={() => {
            setFilters({
              propertyType: "",
              status: "",
              priceRange: [0, 10000000],
            });
            // Reset the PriceScaler component
            priceScalerRef.current?.reset();
          }}
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Property Type Filter */}
        <Select
          value={filters.propertyType}
          onValueChange={handlePropertyTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="APARTMENT">Apartment</SelectItem>
            <SelectItem value="HOUSE">House</SelectItem>
            <SelectItem value="COMMERCIAL">Commercial</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="FOR_RENT">For Rent</SelectItem>
            <SelectItem value="FOR_SALE">For Sale</SelectItem>
          </SelectContent>
        </Select>

        {/* Price Range Filter */}

        <PriceScaler
          ref={priceScalerRef}
          min={0}
          max={10000000}
          step={25}
          defaultMinValue={0}
          defaultMaxValue={10000000}
          onValueChange={(values) => handlePriceRangeChange(values)}
        />
      </div>
    </div>
  );
}
