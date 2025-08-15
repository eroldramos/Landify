import { Heart, MapPin, User, ImageIcon, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Listing } from "../types/schema";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/appStore";
import { useAddFavorite, useRemoveFavorite } from "@/services/favoriteServices";
import { showToast } from "@/utils/toast-utils";
import { invalidateQuery } from "@/utils/query-utils";

interface PropertyCardProps {
  listing: Listing;
}

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}

export function PropertyCard({ listing }: PropertyCardProps) {
  const { auth } = useAuthStore();

  const navigate = useNavigate();
  const isFavorited = listing?.favorites?.some(
    (item) => item?.userId === auth?.id,
  );
  console.log(isFavorited);
  const primaryImage =
    listing.images.find((img) => img.position === 1) || listing.images[0];

  const addFavoriteMutate = useAddFavorite(
    () => {
      showToast("success", {
        message: "Marked as favorite",
      });
      invalidateQuery(["useGetListings"]);
    },
    (error) => {
      showToast("error", {
        message: error?.response?.data?.message,
      });
    },
    listing?.id,
  );

  const removeFavoriteMutate = useRemoveFavorite(
    () => {
      showToast("success", {
        message: "Unmarked as favorite",
      });
      invalidateQuery(["useGetListings"]);
    },
    (error) => {
      showToast("error", {
        message: error?.response?.data?.message,
      });
    },
    listing?.id,
  );

  const toggleFavorite = () => {
    if (!auth?.accessToken) {
      showToast("warning", { message: "Please login to mark as favorite" });
    }
    if (auth?.accessToken && isFavorited) {
      removeFavoriteMutate.mutate();
    }
    if (auth?.accessToken && !isFavorited) {
      addFavoriteMutate.mutate();
    }
  };

  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative">
          <div className="aspect-video bg-gray-200 flex items-center justify-center overflow-hidden">
            {primaryImage ? (
              <img
                src={primaryImage.url || "/placeholder.svg"}
                alt={primaryImage.altText || listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <ImageIcon className="h-12 w-12 mb-2" />
                <span className="text-sm">No Image</span>
              </div>
            )}
          </div>

          <div className="absolute top-2 right-2 flex space-x-1">
            {auth?.role == "ADMIN" && (
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/80 hover:bg-white cursor-pointer"
                onClick={() =>
                  navigate(`/admin/list_property/edit/${listing.id}`)
                }
              >
                <Edit className="h-4 w-4 text-gray-600" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 hover:bg-white cursor-pointer"
              onClick={toggleFavorite}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </Button>
          </div>

          <div className="absolute top-2 left-2">
            <Badge
              variant={listing.status === "FOR_RENT" ? "default" : "secondary"}
            >
              {listing.status.replace("_", " ")}
            </Badge>
          </div>

          {listing.images.length > 1 && (
            <div className="absolute bottom-2 right-2">
              <Badge
                variant="outline"
                className="bg-black/50 text-white border-white/20"
              >
                +{listing.images.length - 1} more
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg leading-tight">
              {listing.title}
            </h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {formatPrice(listing.priceCents)}
              </div>
              <div className="text-sm text-gray-500">
                {listing.status === "FOR_RENT" ? "per month" : "total"}
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2">
            {listing.description}
          </p>

          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{listing.address}</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Badge variant="outline" className="text-xs">
              {listing.propertyType.replace("_", " ")}
            </Badge>

            <div className="flex items-center text-sm text-gray-500">
              <User className="h-4 w-4 mr-1" />
              <span className="truncate">{listing.owner?.name}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full cursor-pointer"
          onClick={() => {
            navigate(`/property_listings/${listing.id}`);
          }}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
