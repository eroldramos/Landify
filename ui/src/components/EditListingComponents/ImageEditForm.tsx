import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { X, Upload, ImageIcon, Trash2 } from "lucide-react";
import { useUploadImages } from "@/services/imageServices";
import { showToast } from "@/utils/toast-utils";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
}

interface ExistingImage {
  id: number;
  listingId: number;
  url: string;
  altText: string;
  position: number;
  createdAt: string;
}

interface ImageUploadProps {
  existingImages?: ExistingImage[];
  propertyId: number;
  refetch: () => void;
}

export function ImageEditForm({
  existingImages = [],
  propertyId,
  refetch,
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [existingImagesState, setExistingImagesState] =
    useState<ExistingImage[]>(existingImages);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDeletingExisting, setIsDeletingExisting] = useState<number | null>(
    null,
  );

  const uploadImagesMutate = useUploadImages(
    () => {
      showToast("success", {
        message: "Successfully uploaded",
      });
      refetch();
      setImages([]); // clear previews\
    },
    (error) => {
      showToast("error", {
        message: error?.response?.data?.message,
      });
    },
    propertyId,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const MAX_IMAGES = 10;

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Please upload only JPEG, PNG, or WebP images";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB";
    }
    return null;
  };

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        toast({
          title: "Invalid File",
          description: `${file.name}: ${error}`,
          variant: "destructive",
        });
        continue;
      }
      validFiles.push(file);
    }

    const totalImages =
      existingImagesState.length + images.length + validFiles.length;
    if (totalImages > MAX_IMAGES) {
      toast({
        title: "Too Many Images",
        description: `You can only have up to ${MAX_IMAGES} images total`,
        variant: "destructive",
      });
      return;
    }

    const newImages: UploadedImage[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const removeExistingImage = async (imageId: number) => {
    setIsDeletingExisting(imageId);

    try {
      const response = await fetch(
        `/api/properties/${propertyId}/images/${imageId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setExistingImagesState((prev) =>
        prev.filter((img) => img.id !== imageId),
      );

      toast({
        title: "Success!",
        description: "Image has been deleted successfully",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingExisting(null);
    }
  };

  const handleImageUpload = async () => {
    if (images.length === 0) {
      toast({
        title: "No Images Selected",
        description: "Please select at least one image to upload",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    images.forEach((img) => {
      formData.append("files", img.file); // 'files' must match your backend field name
    });

    uploadImagesMutate.mutate(formData);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const totalImages = existingImagesState.length + images.length;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Manage Property Images
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload new images or remove existing ones. Changes are applied
          immediately. (JPEG, PNG, WebP - max 10MB each)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {existingImagesState.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Current Images ({existingImagesState.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {existingImagesState.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.altText}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeExistingImage(image.id)}
                    disabled={isDeletingExisting === image.id}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                  >
                    {isDeletingExisting === image.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>

                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.altText}
                    </p>
                    <p className="text-xs text-gray-500">
                      Position: {image.position}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <Upload className="h-8 w-8 text-gray-600" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                Drop new images here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports JPEG, PNG, WebP up to 10MB each
              </p>
              <p className="text-xs text-gray-400">
                {totalImages}/{MAX_IMAGES} images ({MAX_IMAGES - totalImages}{" "}
                remaining)
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
              disabled={totalImages >= MAX_IMAGES}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Select Images
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />

        {images.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                New Images to Upload ({images.length})
              </h3>
              <Button
                onClick={handleImageUpload}
                disabled={uploadImagesMutate?.isPending}
                className="min-w-[120px]"
              >
                {uploadImagesMutate?.isPending
                  ? "Uploading..."
                  : "Upload Images"}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image.preview || "/placeholder.svg"}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(image.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
