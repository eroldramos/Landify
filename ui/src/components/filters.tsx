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

export interface FilterState {
  propertyType: PropertyType | "";
  status: ListingStatus | "";
  priceRange: [number, number];
}

export function Filters() {
  const { setFilters, filters } = useAppStore();
  const handlePropertyTypeChange = (value: string) => {
    const propertyType = value === "ALL" ? "" : value;
    setFilters({
      ...filters,
      propertyType: propertyType as PropertyType | "",
    });
  };

  const handleStatusChange = (value: string) => {
    const status = value === "ALL" ? "" : value;
    setFilters({
      ...filters,
      status: status as ListingStatus | "",
    });
  };

  const handleCustomPriceRangeChange = (values: [number, number]) => {
    setFilters({
      ...filters,
      priceRange: values,
    });
  };

  const handleClearAll = () => {
    const resetFilters = {
      propertyType: "ALL",
      status: "ALL",
      priceRange: [0, 10000000] as [number, number] | null,
    };

    setFilters(resetFilters as FilterState);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.propertyType !== "") count++;
    if (filters.status !== "") count++;
    if (
      filters.priceRange &&
      (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 10000000)
    )
      count++;
    return count;
  };

  return (
    <div className="bg-white border-b p-4">
      <div className="flex items-center justify-between mb-4">
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
          onClick={handleClearAll}
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select
            value={filters.propertyType || "ALL"}
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

          <Select
            value={filters.status || "ALL"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="FOR_RENT">For Rent</SelectItem>
              <SelectItem value="FOR_SALE">For Sale</SelectItem>
            </SelectContent>
          </Select>

          <div className="w-full">
            <PriceScaler
              min={0}
              max={10000000}
              step={10}
              defaultMinValue={0}
              defaultMaxValue={10000000}
              onValueChange={handleCustomPriceRangeChange}
              value={filters.priceRange as [number, number]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
