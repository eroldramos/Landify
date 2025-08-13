import { Button } from "@/components/ui/button";
import type { Listing } from "../types/schema";
import { Filters } from "../components/filters";
import { PropertyCard } from "../components/PropertyCard";
import { useGetListings } from "@/services/listingServices";
import LoadingScreen from "@/components/LoadingScreens/LoadingScreen";
import { useAppStore } from "@/store/appStore";
import { useEffect, useState } from "react";
import { Pagination } from "@/Pagination/Pagination";

// function formatPrice(priceCents: number) {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   }).format(priceCents / 100);
// }

export default function PropertyListingPage() {
  const { filters, search } = useAppStore();
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data to demonstrate pagination
  const itemsPerPage = 5;
  const totalItems = 100;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = Array.from(
    { length: endIndex - startIndex },
    (_, i) => `Item ${startIndex + i + 1}`,
  );

  const { data, isLoading, isSuccess } = useGetListings({
    ...filters,
    search,
    page: currentPage,
  });

  useEffect(() => {
    if (isSuccess) {
      setCurrentPage(data?.data?.page);
    }
  }, [isSuccess, data]);
  return (
    <>
      <Filters />
      {isLoading && <LoadingScreen />}

      {isSuccess && (
        <div>
          {/* Results Header */}
          <div className="px-4 py-4 bg-white border-b">
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={data?.data?.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
            <div className="text-center text-sm text-muted-foreground mt-4">
              Page {currentPage} of {data?.data?.totalPages || 0}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Property Listings
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {data?.data?.total} properties found
                </p>
              </div>
              <Button variant="outline" size="sm">
                Sort by
              </Button>
            </div>
          </div>
          {/* Listings Grid */}
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.data?.data.map((listing: Listing) => (
                <PropertyCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
