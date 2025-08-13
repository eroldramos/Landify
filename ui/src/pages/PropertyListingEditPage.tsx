import { PropertyListingForm } from "@/components/EditListingComponents/PropertyListingEditForm";
import { ImageEditForm } from "@/components/EditListingComponents/ImageEditForm";
import { useParams } from "react-router-dom";
import { useGetListingOne } from "@/services/listingServices";
import LoadingScreen from "@/components/LoadingScreens/LoadingScreen";

// const mockPropertyData = {
//   id: 7,
//   title: "Apartment 2 Story",
//   description: "A beautiful apartment in the heart of the city.",
//   address: "123 Main St, Metro City",
//   priceCents: 50000,
//   propertyType: "HOUSE" as const,
//   status: "FOR_SALE" as const,
//   images: [
//     {
//       id: 19,
//       listingId: 7,
//       url: "https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/landify-bucket/uploads/1754927317559_Edinburgh-Property-management.jpg",
//       altText: "Edinburgh-Property-management.jpg",
//       position: 1,
//       createdAt: "2025-08-11T15:48:39.038Z",
//     },
//     {
//       id: 20,
//       listingId: 7,
//       url: "https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/landify-bucket/uploads/1754927317988_istockphoto-1396856251-612x612.jpg",
//       altText: "istockphoto-1396856251-612x612.jpg",
//       position: 2,
//       createdAt: "2025-08-11T15:48:39.038Z",
//     },
//     {
//       id: 21,
//       listingId: 7,
//       url: "https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/landify-bucket/uploads/1754927318232_istockphoto-2155879454-612x612.jpg",
//       altText: "istockphoto-2155879454-612x612.jpg",
//       position: 3,
//       createdAt: "2025-08-11T15:48:39.038Z",
//     },
//     {
//       id: 22,
//       listingId: 7,
//       url: "https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/landify-bucket/uploads/1754927318417_pexels-binyaminmellish-186077.jpg",
//       altText: "pexels-binyaminmellish-186077.jpg",
//       position: 4,
//       createdAt: "2025-08-11T15:48:39.038Z",
//     },
//   ],
// };

export default function PropertyListingEditPage() {
  const { listingId } = useParams();
  const id = parseInt(listingId as string);
  const { data, isSuccess, isLoading, refetch } = useGetListingOne({ id });

  return (
    <div className="space-y-6 md:mx-[200px] md:my-[100px]">
      {isLoading && <LoadingScreen />}
      {isSuccess && (
        <PropertyListingForm initialData={data?.data} refetch={refetch} />
      )}

      {data?.data && (
        <ImageEditForm
          existingImages={data?.data.images}
          propertyId={data?.data?.id}
        />
      )}
    </div>
  );
}
