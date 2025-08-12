import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MapPin,
  DollarSign,
  UserIcon,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface ListingImage {
  id: number;
  listingId: number;
  url: string;
  altText: string;
  position: number;
  createdAt: string;
}

interface FavoriteUser {
  id: number;
  email: string;
  password?: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Listing {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  address: string;
  priceCents: number;
  propertyType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  images: ListingImage[];
}

interface Favorite {
  id: number;
  userId: number;
  listingId: number | null;
  createdAt: string;
  user: FavoriteUser;
  listing: Listing | null;
}

interface FavoritesDashboardProps {
  favorites: Favorite[];
}

export function FavoritesDashboard({ favorites }: FavoritesDashboardProps) {
  const validFavorites = favorites.filter((fav) => fav.listing !== null);
  const invalidFavorites = favorites.filter((fav) => fav.listing === null);

  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(priceCents / 100);
  };

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case "HOUSE":
        return "bg-blue-100 text-blue-800";
      case "COMMERCIAL":
        return "bg-purple-100 text-purple-800";
      case "APARTMENT":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FOR_SALE":
        return "bg-emerald-100 text-emerald-800";
      case "FOR_RENT":
        return "bg-orange-100 text-orange-800";
      case "SOLD":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="h-8 w-8 text-red-500 fill-red-500" />
          <h1 className="text-3xl font-bold text-gray-900">
            Favorite Properties
          </h1>
        </div>
        <p className="text-gray-600">
          You have {validFavorites.length} favorite{" "}
          {validFavorites.length === 1 ? "property" : "properties"}
          {invalidFavorites.length > 0 && (
            <span className="text-amber-600 ml-2">
              ({invalidFavorites.length} unavailable)
            </span>
          )}
        </p>
      </div>

      {invalidFavorites.length > 0 && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div>
                <h3 className="font-medium text-amber-800">
                  Some favorites are unavailable
                </h3>
                <p className="text-sm text-amber-700">
                  {invalidFavorites.length} of your favorite{" "}
                  {invalidFavorites.length === 1 ? "property" : "properties"}{" "}
                  may have been removed or is temporarily unavailable.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {validFavorites.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring properties and add them to your favorites!
            </p>
            <Button>Browse Properties</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validFavorites.map((favorite) => {
            const listing = favorite.listing!;
            return (
              <Card
                key={favorite.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gray-200">
                  {listing.images.length > 0 ? (
                    <img
                      src={listing.images[0].url || "/placeholder.svg"}
                      alt={listing.images[0].altText}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-400 text-center">
                        <MapPin className="h-12 w-12 mx-auto mb-2" />
                        <p>No image available</p>
                      </div>
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-3 right-3 h-8 w-8 p-0"
                  >
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  </Button>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {listing.title}
                    </CardTitle>
                    <div className="flex flex-col gap-1">
                      <Badge
                        className={getPropertyTypeColor(listing.propertyType)}
                      >
                        {listing.propertyType.replace("_", " ")}
                      </Badge>
                      <Badge className={getStatusColor(listing.status)}>
                        {listing.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm line-clamp-1">
                      {listing.address}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-xl font-bold text-green-600">
                      {formatPrice(listing.priceCents)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <UserIcon className="h-3 w-3" />
                        <span>Favorited by {favorite.user.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(favorite.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
