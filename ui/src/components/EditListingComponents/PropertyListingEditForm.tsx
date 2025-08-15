import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUpdateProperty } from "@/services/listingServices";
import { showToast } from "@/utils/toast-utils";
import { invalidateQuery } from "@/utils/query-utils";

interface PropertyFormData {
  id: number;
  title: string;
  description: string;
  address: string;
  priceCents: number;
  propertyType: "HOUSE" | "APARTMENT" | "COMMERCIAL";
  status: "FOR_SALE" | "FOR_RENT";
}

interface PropertyListingFormProps {
  initialData: PropertyFormData;
}

export function PropertyListingForm({ initialData }: PropertyListingFormProps) {
  const [formData, setFormData] = useState<PropertyFormData>(initialData);
  const { toast } = useToast();

  useEffect(() => {
    setFormData(initialData);
  }, [initialData, setFormData]);

  const updatePropertyMutate = useUpdateProperty(
    () => {
      showToast("success", {
        message: "Property details updated",
      });
      invalidateQuery("useGetListingOne");
    },

    (error) => {
      showToast("error", {
        message: error?.response?.data?.message,
      });
    },
    formData.id,
  );
  const handleInputChange = (
    field: keyof PropertyFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // const formatPrice = (cents: number): string => {
  //   return (cents / 100).toFixed(2);
  // };

  // const parsePriceInput = (priceString: string): number => {
  //   const cleaned = priceString.replace(/[^\d.]/g, "");
  //   const parsed = Number.parseFloat(cleaned);
  //   return isNaN(parsed) ? 0 : Math.round(parsed * 100);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Property title is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Property description is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.address.trim()) {
      toast({
        title: "Validation Error",
        description: "Property address is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.priceCents <= 0) {
      toast({
        title: "Validation Error",
        description: "Property price must be greater than $0",
        variant: "destructive",
      });
      return;
    }

    const newData: PropertyFormData = {
      title: formData.title,
      description: formData.description,
      address: formData.address,
      priceCents: formData.priceCents,
      propertyType: formData.propertyType,
      status: formData.status,
    };

    updatePropertyMutate.mutate(newData);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Edit Property Details
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Update your property listing information
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Property Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter property title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your property in detail"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              required
              rows={4}
              className="w-full resize-none"
            />
          </div>

          {/* Address Field */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="Enter full property address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Price Field */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Price (USD) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <Input
                id="price"
                type="text"
                placeholder="0.00"
                value={formData.priceCents}
                onChange={(e) =>
                  handleInputChange("priceCents", parseInt(e.target.value))
                }
                required
                className="w-full pl-8"
              />
            </div>
          </div>

          {/* Property Type and Status - Mobile Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Property Type */}
            <div className="space-y-2">
              <Label htmlFor="propertyType" className="text-sm font-medium">
                Property Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.propertyType}
                onValueChange={(value) =>
                  handleInputChange("propertyType", value)
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOUSE">House</SelectItem>
                  <SelectItem value="APARTMENT">Apartment</SelectItem>
                  <SelectItem value="COMMERCIAL">Commercials</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Listing Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FOR_SALE">For Sale</SelectItem>
                  <SelectItem value="FOR_RENT">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full md:w-auto md:min-w-[200px]"
              disabled={updatePropertyMutate?.isPending}
            >
              {updatePropertyMutate?.isPending
                ? "Updating..."
                : "Update Property Details"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
