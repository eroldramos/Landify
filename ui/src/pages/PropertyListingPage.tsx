import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Listing } from "../types/schema";
import { Filters, type FilterState } from "../components/filters";
import { PropertyCard } from "../components/PropertyCard";
import { useGetListings } from "@/services/listingServices";
import LoadingScreen from "@/components/LoadingScreens/LoadingScreen";
import { useAppStore } from "@/store/appStore";

// function formatPrice(priceCents: number) {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   }).format(priceCents / 100);
// }

export default function PropertyListingPage() {
  const { search } = useAppStore();
  const [filters, setFilters] = useState<FilterState>({
    propertyType: "",
    status: "",
    priceRange: { minPrice: 0, maxPrice: 1000000 },
  });
  const { data, isLoading } = useGetListings({ ...filters, search });
  return (
    <>
      <Filters onFilterChange={setFilters} activeFilters={filters} />

      {/* Results Header */}
      <div className="px-4 py-4 bg-white border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Property Listings
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {data?.data?.data.length} properties found
            </p>
          </div>
          <Button variant="outline" size="sm">
            Sort by
          </Button>
        </div>
      </div>
      {isLoading && <LoadingScreen />}
      {/* Listings Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data?.data.map((listing: Listing) => (
            <PropertyCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>

      {/* Load More Button */}
      <div className="p-4 text-center">
        <Button variant="outline" className="w-full md:w-auto bg-transparent">
          Load More Properties
        </Button>
      </div>
    </>
  );
}
