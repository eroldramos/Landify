import { PropertyListingForm } from "@/components/EditListingComponents/PropertyListingEditForm";
import { ImageEditForm } from "@/components/EditListingComponents/ImageEditForm";
import { useParams } from "react-router-dom";
import { useGetListingOne } from "@/services/listingServices";
import LoadingScreen from "@/components/LoadingScreens/LoadingScreen";
import { useEffect, useState } from "react";

interface PropertyFormData {
  id: number;
  title: string;
  description: string;
  address: string;
  priceCents: number;
  propertyType: "HOUSE" | "APARTMENT" | "COMMERCIAL";
  status: "FOR_SALE" | "FOR_RENT";
  images?: Array<{
    id: number;
    listingId: number;
    url: string;
    altText: string;
    position: number;
    createdAt: string;
  }>;
}

export default function PropertyListingEditPage() {
  const [initialData, setInitialData] = useState<PropertyFormData | null>(null); // ✅ fixed destructuring
  const { listingId } = useParams();
  const id = parseInt(listingId as string, 10);

  const { data, isSuccess, isLoading, refetch, isRefetching } =
    useGetListingOne({ id });

  useEffect(() => {
    if (isSuccess && data) {
      setInitialData(data.data);
    }
    if (isLoading || isRefetching) {
      setInitialData(null);
    }
  }, [isSuccess, data, isLoading, isRefetching]);

  return (
    <div className="space-y-6 md:mx-[200px] md:my-[100px]">
      {(isLoading || isRefetching) && <LoadingScreen />}

      {initialData && !isLoading && (
        <PropertyListingForm initialData={initialData} />
      )}

      {initialData?.images && (
        <ImageEditForm
          existingImages={initialData.images}
          propertyId={initialData.id}
          refetch={refetch}
        />
      )}
    </div>
  );
}
