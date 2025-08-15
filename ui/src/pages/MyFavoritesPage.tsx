import { Heart, MapPin, Home, Building2, DollarSign, Edit } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/appStore";
import {
  useRemoveFavorite,
  useGetFavorites,
} from "@/services/favoriteServices";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreens/LoadingScreen";
import { Pagination } from "@/Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/utils/toast-utils";
import { invalidateQuery } from "@/utils/query-utils";

// Mock data type definitions
interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Image {
  id: number;
  listingId: number;
  url: string;
  altText: string;
  position: number;
  createdAt: string;
}

interface Listing {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  address: string;
  priceCents: number;
  propertyType: "HOUSE" | "APARTMENT" | "CONDO";
  status: "FOR_SALE" | "FOR_RENT";
  createdAt: string;
  updatedAt: string;
  images: Image[];
}

interface Favorite {
  id: number;
  userId: number;
  listingId: number | null;
  createdAt: string;
  user: User;
  listing: Listing | null;
}

// Mock data
const mockFavorites: Favorite[] = [
  {
    id: 24,
    userId: 1,
    listingId: 9,
    createdAt: "2025-08-13T05:14:37.875Z",
    user: {
      id: 1,
      email: "ramos.erold05@gmail.com",
      name: "Erold Ramos",
      role: "ADMIN",
      createdAt: "2025-08-10T06:28:00.815Z",
      updatedAt: "2025-08-10T06:28:00.815Z",
    },
    listing: {
      id: 9,
      ownerId: 1,
      title: "Apartment 2 Story",
      description: "A beautiful apartment in the heart of the city.",
      address: "123 Main St, Metro City",
      priceCents: 50000,
      propertyType: "HOUSE",
      status: "FOR_SALE",
      createdAt: "2025-08-12T03:27:08.074Z",
      updatedAt: "2025-08-12T03:27:08.074Z",
      images: [],
    },
  },
  {
    id: 23,
    userId: 1,
    listingId: 8,
    createdAt: "2025-08-13T05:14:35.860Z",
    user: {
      id: 1,
      email: "ramos.erold05@gmail.com",
      name: "Erold Ramos",
      role: "ADMIN",
      createdAt: "2025-08-10T06:28:00.815Z",
      updatedAt: "2025-08-10T06:28:00.815Z",
    },
    listing: {
      id: 8,
      ownerId: 1,
      title: "Apartment 2 Story",
      description: "A beautiful apartment in the heart of the city.",
      address: "123 Main St, Metro City",
      priceCents: 50000,
      propertyType: "HOUSE",
      status: "FOR_SALE",
      createdAt: "2025-08-12T03:12:38.634Z",
      updatedAt: "2025-08-12T03:12:38.634Z",
      images: [],
    },
  },
  {
    id: 22,
    userId: 1,
    listingId: 7,
    createdAt: "2025-08-13T05:14:33.880Z",
    user: {
      id: 1,
      email: "ramos.erold05@gmail.com",
      name: "Erold Ramos",
      role: "ADMIN",
      createdAt: "2025-08-10T06:28:00.815Z",
      updatedAt: "2025-08-10T06:28:00.815Z",
    },
    listing: {
      id: 7,
      ownerId: 1,
      title: "Apartment 2 Story",
      description: "A beautiful apartment in the heart of the city.",
      address: "123 Main St, Metro City",
      priceCents: 50000,
      propertyType: "HOUSE",
      status: "FOR_SALE",
      createdAt: "2025-08-11T15:47:53.745Z",
      updatedAt: "2025-08-11T15:47:53.745Z",
      images: [
        {
          id: 19,
          listingId: 7,
          url: "https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/landify-bucket/uploads/1754927317559_Edinburgh-Property-management.jpg",
          altText: "Edinburgh-Property-management.jpg",
          position: 1,
          createdAt: "2025-08-11T15:48:39.038Z",
        },
        {
          id: 20,
          listingId: 7,
          url: "https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/landify-bucket/uploads/1754927317988_istockphoto-1396856251-612x612.jpg",
          altText: "istockphoto-1396856251-612x612.jpg",
          position: 2,
          createdAt: "2025-08-11T15:48:39.038Z",
        },
        {
          id: 21,
          listingId: 7,
          url: "https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/landify-bucket/uploads/1754927318232_istockphoto-2155879454-612x612.jpg",
          altText: "istockphoto-2155879454-612x612.jpg",
          position: 3,
          createdAt: "2025-08-11T15:48:39.038Z",
        },
        {
          id: 22,
          listingId: 7,
          url: "https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/landify-bucket/uploads/1754927318417_pexels-binyaminmellish-186077.jpg",
          altText: "pexels-binyaminmellish-186077.jpg",
          position: 4,
          createdAt: "2025-08-11T15:48:39.038Z",
        },
        {
          id: 24,
          listingId: 7,
          url: "https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/landify-bucket/uploads/1754967896586_Edinburgh-Property-management.jpg",
          altText: "Edinburgh-Property-management.jpg",
          position: 1,
          createdAt: "2025-08-12T03:04:58.002Z",
        },
        {
          id: 25,
          listingId: 7,
          url: "https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/landify-bucket/uploads/1754967897023_istockphoto-1396856251-612x612.jpg",
          altText: "istockphoto-1396856251-612x612.jpg",
          position: 2,
          createdAt: "2025-08-12T03:04:58.002Z",
        },
        {
          id: 26,
          listingId: 7,
          url: "https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/landify-bucket/uploads/1754967897196_istockphoto-2155879454-612x612.jpg",
          altText: "istockphoto-2155879454-612x612.jpg",
          position: 3,
          createdAt: "2025-08-12T03:04:58.002Z",
        },
        {
          id: 27,
          listingId: 7,
          url: "https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/landify-bucket/uploads/1754967897407_pexels-binyaminmellish-186077.jpg",
          altText: "pexels-binyaminmellish-186077.jpg",
          position: 4,
          createdAt: "2025-08-12T03:04:58.002Z",
        },
      ],
    },
  },
  {
    id: 21,
    userId: 1,
    listingId: 6,
    createdAt: "2025-08-11T07:07:30.367Z",
    user: {
      id: 1,
      email: "ramos.erold05@gmail.com",
      name: "Erold Ramos",
      role: "ADMIN",
      createdAt: "2025-08-10T06:28:00.815Z",
      updatedAt: "2025-08-10T06:28:00.815Z",
    },
    listing: {
      id: 6,
      ownerId: 1,
      title: "Cozy 2-Bedroom Apartmentsss",
      description: "A beautiful apartment in the heart of the city.",
      address: "123 Main St, Metro City",
      priceCents: 12000000,
      propertyType: "APARTMENT",
      status: "FOR_RENT",
      createdAt: "2025-08-10T15:18:53.505Z",
      updatedAt: "2025-08-12T05:42:27.464Z",
      images: [
        {
          id: 17,
          listingId: 6,
          url: "https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/landify-bucket/uploads/1754886436406_Edinburgh-Property-management.jpg",
          altText: "Edinburgh-Property-management.jpg",
          position: 1,
          createdAt: "2025-08-11T04:27:17.398Z",
        },
        {
          id: 18,
          listingId: 6,
          url: "https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/landify-bucket/uploads/1754886436916_istockphoto-1396856251-612x612.jpg",
          altText: "istockphoto-1396856251-612x612.jpg",
          position: 2,
          createdAt: "2025-08-11T04:27:17.398Z",
        },
      ],
    },
  },
  {
    id: 20,
    userId: 1,
    listingId: 5,
    createdAt: "2025-08-11T00:55:42.132Z",
    user: {
      id: 1,
      email: "ramos.erold05@gmail.com",
      name: "Erold Ramos",
      role: "ADMIN",
      createdAt: "2025-08-10T06:28:00.815Z",
      updatedAt: "2025-08-10T06:28:00.815Z",
    },
    listing: {
      id: 5,
      ownerId: 1,
      title: "Cozy 2-Bedroom Apartment",
      description: "A beautiful apartment in the heart of the city.",
      address: "123 Main St, Metro City",
      priceCents: 12000000,
      propertyType: "APARTMENT",
      status: "FOR_RENT",
      createdAt: "2025-08-10T14:01:15.602Z",
      updatedAt: "2025-08-10T14:01:15.602Z",
      images: [],
    },
  },
];

function formatPrice(priceCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}

function getPropertyIcon(type: string) {
  switch (type) {
    case "HOUSE":
      return <Home className="h-4 w-4" />;
    case "APARTMENT":
      return <Building2 className="h-4 w-4" />;
    default:
      return <Home className="h-4 w-4" />;
  }
}

function PropertyCard({ favorite }: { favorite: Favorite }) {
  const removeFavoriteMutate = useRemoveFavorite(
    () => {
      showToast("success", {
        message: "Unmarked as favorite",
      });
      invalidateQuery(["useGetFavorites"]);
    },
    (error) => {
      showToast("error", {
        message: error?.response?.data?.message,
      });
    },
    favorite?.listing?.id as number,
  );
  const navigate = useNavigate();
  const { listing } = favorite;

  if (!listing) {
    return null; // Skip favorites with null listings
  }

  const primaryImage =
    listing.images.find((img) => img.position === 1) || listing.images[0];
  const imageUrl =
    primaryImage?.url || `/placeholder.svg?height=200&width=300&query=property`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={primaryImage?.altText || listing.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white cursor-pointer"
            onClick={() => navigate(`/admin/list_property/edit/${listing?.id}`)}
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white cursor-pointer"
            onClick={() => removeFavoriteMutate.mutate()}
          >
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
          </Button>
        </div>
        <Badge
          variant={listing.status === "FOR_SALE" ? "default" : "secondary"}
          className="absolute top-3 left-3"
        >
          {listing.status === "FOR_SALE" ? "For Sale" : "For Rent"}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {getPropertyIcon(listing.propertyType)}
          <span className="text-sm text-muted-foreground capitalize">
            {listing.propertyType.toLowerCase()}
          </span>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {listing.title}
        </h3>

        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {listing.description}
        </p>

        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{listing.address}</span>
        </div>

        <div className="flex items-center gap-1">
          <DollarSign className="h-5 w-5 text-green-600" />
          <span className="font-bold text-xl text-green-600">
            {formatPrice(listing.priceCents)}
          </span>
          {listing.status === "FOR_RENT" && (
            <span className="text-muted-foreground text-sm">/month</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full cursor-pointer"
          onClick={() => navigate(`/property_listings/${listing?.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function MyFavoritesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { search, setSearch } = useAppStore();

  const { data, isLoading, isSuccess } = useGetFavorites({
    search,
    page: currentPage,
  });

  useEffect(() => {
    if (isSuccess) {
      setCurrentPage(data?.data?.page);
    }
  }, [isSuccess, data]);

  // Filter out favorites with null listings

  return (
    <div className="min-h-screen bg-background">
      {isLoading && <LoadingScreen />}

      {data?.data?.data && (
        <>
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="h-8 w-8 fill-red-500 text-red-500" />
                <h1 className="text-3xl font-bold">My Favorites</h1>
              </div>
              <p className="text-muted-foreground">
                {data?.data?.total}{" "}
                {data?.data?.data?.length === 1 ? "property" : "properties"}{" "}
                saved
              </p>
            </div>{" "}
            <div className="flex justify-center mb-8">
              <Pagination
                currentPage={currentPage}
                totalPages={data?.data?.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
            {data?.data?.data?.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
                <p className="text-muted-foreground">
                  Start exploring properties and save your favorites here!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data?.data?.map((favorite: Favorite) => (
                  <PropertyCard key={favorite.id} favorite={favorite} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
