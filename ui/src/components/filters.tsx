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

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
}

export interface FilterState {
  propertyType: PropertyType | "";
  status: ListingStatus | "";
  priceRange: string;
}

export function Filters({ onFilterChange, activeFilters }: FiltersProps) {
  const handlePropertyTypeChange = (value: string) => {
    onFilterChange({
      ...activeFilters,
      propertyType: value as PropertyType | "",
    });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...activeFilters,
      status: value as ListingStatus | "",
    });
  };

  const handlePriceRangeChange = (value: string) => {
    onFilterChange({
      ...activeFilters,
      priceRange: value,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.propertyType !== "") count++;
    if (activeFilters.status !== "") count++;
    if (activeFilters.priceRange !== "") count++;
    return count;
  };

  return (
    <div className="bg-white border-b p-4">
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
        <Button variant="ghost" size="sm" className="text-sm text-gray-600">
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Property Type Filter */}
        <Select
          value={activeFilters.propertyType}
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
        <Select value={activeFilters.status} onValueChange={handleStatusChange}>
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
          min={50}
          max={2000}
          step={25}
          defaultMinValue={200}
          defaultMaxValue={800}
          onValueChange={(values) => console.log("Custom range:", values)}
        />
      </div>
    </div>
  );
}
