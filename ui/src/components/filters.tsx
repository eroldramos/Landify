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

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
}

export interface FilterState {
  propertyType: PropertyType | "ALL";
  status: ListingStatus | "ALL";
  priceRange: string;
}

export function Filters({ onFilterChange, activeFilters }: FiltersProps) {
  const handlePropertyTypeChange = (value: string) => {
    onFilterChange({
      ...activeFilters,
      propertyType: value as PropertyType | "ALL",
    });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...activeFilters,
      status: value as ListingStatus | "ALL",
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
    if (activeFilters.propertyType !== "ALL") count++;
    if (activeFilters.status !== "ALL") count++;
    if (activeFilters.priceRange !== "ALL") count++;
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
        <Select
          value={activeFilters.priceRange}
          onValueChange={handlePriceRangeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Prices</SelectItem>
            <SelectItem value="0-50000">Under $500</SelectItem>
            <SelectItem value="50000-100000">$500 - $1,000</SelectItem>
            <SelectItem value="100000-200000">$1,000 - $2,000</SelectItem>
            <SelectItem value="200000-500000">$2,000 - $5,000</SelectItem>
            <SelectItem value="500000+">$5,000+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
