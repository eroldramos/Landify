import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  Share,
  MapPin,
  Calendar,
  Home,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  EditIcon,
  ImageIcon,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetListingOne, useRemoveListing } from "@/services/listingServices";
import { useAuthStore } from "@/store/appStore";
import LoadingScreen from "@/components/LoadingScreens/LoadingScreen";
import { showToast } from "@/utils/toast-utils";
import { useAddFavorite, useRemoveFavorite } from "@/services/favoriteServices";
import { invalidateQuery } from "@/utils/query-utils";
import Swal from "sweetalert2";

// Mock data
// const propertyData = {
//   id: 6,
//   ownerId: 1,
//   title: "Cozy 2-Bedroom Apartment",
//   description: "A beautiful apartment in the heart of the city.",
//   address: "123 Main St, Metro City",
//   priceCents: 12000000,
//   propertyType: "APARTMENT",
//   status: "FOR_RENT",
//   createdAt: "2025-08-10T15:18:53.505Z",
//   updatedAt: "2025-08-10T15:18:53.505Z",
//   images: [
//     {
//       id: 17,
//       listingId: 6,
//       url: "https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/landify-bucket/uploads/1754886436406_Edinburgh-Property-management.jpg",
//       altText: "Edinburgh-Property-management.jpg",
//       position: 1,
//       createdAt: "2025-08-11T04:27:17.398Z",
//     },
//     {
//       id: 18,
//       listingId: 6,
//       url: "https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/landify-bucket/uploads/1754886436916_istockphoto-1396856251-612x612.jpg",
//       altText: "istockphoto-1396856251-612x612.jpg",
//       position: 2,
//       createdAt: "2025-08-11T04:27:17.398Z",
//     },
//   ],
//   favorites: [
//     {
//       id: 21,
//       userId: 1,
//       listingId: 6,
//       createdAt: "2025-08-11T07:07:30.367Z",
//     },
//   ],
//   owner: {
//     id: 1,
//     email: "ramos.erold05@gmail.com",
//     password: "$2b$10$tdkQpXa52q7ktEkc.wf0kOvfGDqElp3McRRWe0xf3rRLFN5YzExT6",
//     name: "Erold Ramos",
//     role: "ADMIN",
//     createdAt: "2025-08-10T06:28:00.815Z",
//     updatedAt: "2025-08-10T06:28:00.815Z",
//   },
// };

export default function PropertyListingSinglePage() {
  const navigate = useNavigate();
  const { auth } = useAuthStore();
  const { listingId } = useParams();
  const id = parseInt(listingId as string);
  const { data: propertyData, isSuccess, isLoading } = useGetListingOne({ id });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const addFavoriteMutate = useAddFavorite(
    () => {
      showToast("success", {
        message: "Marked as favorite",
      });
      invalidateQuery(["useGetListingOne"]);
    },
    (error) => {
      showToast("error", {
        message: error?.response?.data?.message,
      });
    },
    id,
  );

  const removeFavoriteMutate = useRemoveFavorite(
    () => {
      showToast("success", {
        message: "Unmarked as favorite",
      });
      invalidateQuery(["useGetListingOne"]);
    },
    (error) => {
      showToast("error", {
        message: error?.response?.data?.message,
      });
    },
    id,
  );

  useEffect(() => {
    if (isSuccess) {
      setIsFavorited(
        propertyData?.data?.favorites?.[0]?.userId === auth?.id &&
          propertyData?.data?.favorites?.[0]?.userId &&
          auth?.id,
      );
    }
  }, [isSuccess, propertyData, auth]);
  // Format price from cents to dollars
  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(priceCents);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "FOR_RENT":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "FOR_SALE":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "SOLD":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === propertyData?.data?.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? propertyData?.data?.images.length - 1 : prev - 1,
    );
  };

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
  const removeListing = useRemoveListing(
    () => {
      showToast("success", {
        message: "Listing deleted",
      });
      navigate("/");
    },
    (error) => {
      showToast("error", {
        message: error?.response?.data?.message,
      });
    },
    id,
  );
  const toggleDelete = () => {
    Swal.fire({
      title: `Are you sure you want to delete this listing with an ID of ${id}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "black",
      cancelButtonColor: "gray",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        removeListing.mutate();
      }
    });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && <LoadingScreen />}
        {/* Header */}
        {propertyData?.data && (
          <>
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {propertyData?.data?.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{propertyData?.data?.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={getStatusColor(propertyData?.data?.status)}
                    >
                      {propertyData?.data?.status.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline">
                      <Home className="w-3 h-3 mr-1" />
                      {propertyData?.data?.propertyType}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleFavorite}
                    className={
                      isFavorited
                        ? "text-red-600 border-red-200 cursor-pointer"
                        : "cursor-pointer"
                    }
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${
                        isFavorited ? "fill-red-600" : ""
                      }`}
                    />
                    {isFavorited ? "Favorited" : "Add to Favorites"}
                  </Button>
                  {auth?.role == "ADMIN" && (
                    <Button
                      className="cursor-pointer"
                      variant="outline"
                      size="sm"
                      onClick={toggleDelete}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  )}
                  {auth?.role === "ADMIN" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() =>
                        navigate(`/admin/list_property/edit/${listingId}`)
                      }
                    >
                      <EditIcon className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Images and Description */}
              <div className="lg:col-span-2 space-y-8">
                {/* Image Gallery */}
                <Card>
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-[16/10] relative overflow-hidden rounded-t-lg">
                        {" "}
                        {propertyData?.data?.images?.length != 0 ? (
                          <img
                            src={
                              propertyData?.data?.images[currentImageIndex]
                                ?.url || `/placeholder.svg?height=400&width=600`
                            }
                            alt={
                              propertyData?.data?.images[currentImageIndex]
                                ?.altText || "Property image"
                            }
                            className="object-cover w-full h-full"
                            style={{
                              position: "absolute",
                              inset: 0,
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-400 h-full w-full">
                            <ImageIcon className="h-12 w-12 mb-2" />
                            <span className="text-sm">No Images</span>
                          </div>
                        )}
                        {propertyData?.data?.images.length > 1 && (
                          <>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                              onClick={prevImage}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                              onClick={nextImage}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                      {propertyData?.data?.images.length > 1 && (
                        <div className="flex justify-center gap-2 p-4 bg-white">
                          {propertyData?.data?.images.map(
                            (_, index: number) => (
                              <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  index === currentImageIndex
                                    ? "bg-blue-600"
                                    : "bg-gray-300"
                                }`}
                                onClick={() => setCurrentImageIndex(index)}
                              />
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>About this property</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {propertyData?.data?.description}
                    </p>
                    <Separator className="my-6" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          Listed on {formatDate(propertyData?.data?.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          Updated {formatDate(propertyData?.data?.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Price and Owner Info */}
              <div className="space-y-6">
                {/* Price Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-green-600">
                      {formatPrice(propertyData?.data?.priceCents)}
                      {propertyData?.data?.status === "FOR_RENT" && (
                        <span className="text-base font-normal text-gray-600">
                          /month
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" size="lg">
                      {propertyData?.data?.status === "FOR_RENT"
                        ? "Contact for Rental"
                        : "Contact for Purchase"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Owner Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Property Owner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src="/placeholder-user.jpg"
                          alt={propertyData?.data?.owner.name}
                        />
                        <AvatarFallback>
                          {propertyData?.data?.owner.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {propertyData?.data?.owner.name}
                        </h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {propertyData?.data?.owner.role.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Owner
                      </Button>
                    </div>
                    <Separator className="my-4" />
                    <div className="text-xs text-gray-500">
                      <p>
                        Member since{" "}
                        {formatDate(propertyData?.data?.owner.createdAt)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Property Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Property Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property ID:</span>
                        <span className="font-medium">
                          #{propertyData?.data?.id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">
                          {propertyData?.data?.propertyType.toLowerCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium">
                          {propertyData?.data?.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium text-right">
                          {propertyData?.data?.address}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
