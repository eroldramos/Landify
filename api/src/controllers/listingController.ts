import type { Request, Response } from "express";
import ListingService from "../services/listingServices";
import type { SupabaseRequest } from "../utils/types";
import type {
  Listing,
  ListingStatus,
  PropertyType,
} from "../generated/prisma/index.js";
import ImageService from "../services/imageServices";
const bucketName = "landify-bucket";
class ListingController {
  static createListingOne = async (req: SupabaseRequest, res: Response) => {
    try {
      const { title, address, priceCents, propertyType, status, description } =
        req.body;

      const ownerId: number = req?.currentUser?.id!;

      const listing = await ListingService.createListing(
        title,
        address,
        priceCents,
        propertyType,
        status,
        ownerId,
        description,
      );
      return res.status(201).json(listing);
    } catch (error) {
      res.status(400).json({ message: "Listing failed", error });
    }
  };

  static updateListingOne = async (req: SupabaseRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid listing ID" });
      }

      const data: any = { ...req.body };

      // Optional: narrow enums if provided
      if (typeof data.status === "string") {
        data.status = data.status as ListingStatus;
      }
      if (typeof data.propertyType === "string") {
        data.propertyType = data.propertyType as PropertyType;
      }

      const updatedListing = await ListingService.updateListing(id, data);

      return res.status(200).json(updatedListing);
    } catch (error: any) {
      if (error.code === "P2025") {
        // Prisma: record not found
        return res.status(404).json({ message: "Listing not found", error });
      }
      return res
        .status(500)
        .json({ message: "Update failed", error: error.message });
    }
  };

  static deleteListingOne = async (req: SupabaseRequest, res: Response) => {
    function getFilePathFromPublicUrl(
      url: string,
      bucketName: string,
    ): string | null {
      const base = `https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/${bucketName}/`;
      if (!url.startsWith(base)) return null;
      return url.substring(base.length);
    }
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid listing ID" });
      }

      const listingFound = await ListingService.getListingById(id);
      if (!listingFound)
        return res
          .status(400)
          .json({ message: "Listing is not found with this id" });
      if (!listingFound?.images) {
        const filePaths = listingFound?.images
          .map((image: any) => getFilePathFromPublicUrl(image?.url, bucketName))
          .filter((p: any): p is string => !!p);

        const removeImagesFromBucket = await ImageService.removeImages(
          filePaths,
        );
      }

      const deleteListing = await ListingService.deleteListing(id);

      return res.status(200).json(deleteListing);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Delete failed", error: error.message });
    }
  };

  static deleteListingMany = async (req: SupabaseRequest, res: Response) => {
    try {
      const { idsToDelete } = req.body;

      // Validate: check if `ids` is an array of integers
      if (
        !Array.isArray(idsToDelete) ||
        idsToDelete.length === 0 ||
        !idsToDelete.every((id: number) => Number.isInteger(id))
      ) {
        return res
          .status(400)
          .json({ message: "Invalid ID list. Must be an array of integers." });
      }
      const where = { id: { in: idsToDelete } };
      const deleteListing = await ListingService.deleteManyListings(where);

      return res.status(200).json(deleteListing);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Delete failed", error: error.message });
    }
  };

  static getListings = async (req: SupabaseRequest, res: Response) => {
    try {
      const {
        page = "1",
        limit = "10",
        status,
        propertyType,
        ownerId,
        id,
        sortBy = "createdAt",
        sortOrder = "desc",
        search,
        minPrice = "0",
        maxPrice = "10000000",
        favoritedByUserId,
      } = req.query;

      const filters: {
        status?: ListingStatus;
        propertyType?: PropertyType;
        ownerId?: number;
        id?: number;
      } = {};
      const currentUserId = req?.currentUser?.id;
      const priceRange: { min?: number; max?: number } = {};

      if (typeof status === "string" && status) {
        filters.status = status.toUpperCase() as ListingStatus;
      }
      if (typeof propertyType === "string" && propertyType) {
        filters.propertyType = propertyType.toUpperCase() as PropertyType;
      }
      if (typeof ownerId === "string" && ownerId) {
        const parsed = parseInt(ownerId, 10);
        if (!isNaN(parsed)) filters.ownerId = parsed;
      }
      if (typeof id === "string" && id) {
        const parsed = parseInt(id, 10);
        if (!isNaN(parsed)) filters.id = parsed;
      }

      if (typeof minPrice === "string" && minPrice) {
        const parsed = parseInt(minPrice, 10);
        if (!isNaN(parsed)) priceRange.min = parsed;
      }
      if (typeof maxPrice === "string" && maxPrice) {
        const parsed = parseInt(maxPrice, 10);
        if (!isNaN(parsed)) priceRange.max = parsed;
      }

      const listings = await ListingService.getListingsByFilter({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        filters,
        sortBy: sortBy as keyof Listing,
        sortOrder: sortOrder === "asc" ? "asc" : "desc",
        search: typeof search === "string" ? search : undefined,
        priceRange,
        favoritedByUserId: currentUserId, // 👈 pass it here
      });

      return res.status(200).json(listings);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "Listing fetch failed", error });
    }
  };

  static getListingById = async (req: SupabaseRequest, res: Response) => {
    try {
      const id = req.params.id;

      const currentUserId = req?.currentUser?.id;

      const listingFound = await ListingService.getListingById(
        parseInt(id),
        currentUserId,
      );
      if (!listingFound)
        return res
          .status(400)
          .json({ message: "Listing is not found with this id" });
      return res.status(200).json(listingFound);
    } catch (error) {
      return res.status(400).json({ message: "Listing failed", error });
    }
  };

  //   static login = async (req: Request, res: Response) => {
  //     try {
  //       const { email, password } = req.body;
  //       const token = await AuthService.loginUser(email, password);
  //       res.status(200).json({ token });
  //     } catch (error) {
  //       res.status(400).json({ message: "login failed", error: error });
  //     }
  //   };

  //   static getUserById = async (req: AuthenticatedRequest, res: Response) => {
  //     try {
  //       const user = req.user;
  //       if (!user) return res.status(400).json({ message: "access denied" });
  //       const userId: string | undefined = req.params.id;
  //       const foundUser = await AuthService.findUserById(parseInt(userId));
  //       if (!foundUser)
  //         return res.status(400).json({ message: "user not found with this id" });
  //       res.status(200).json({ foundUser: foundUser, user: user });
  //     } catch (error) {
  //       res.status(500).json({ message: "internal server error", error });
  //     }
  //   };
}
export default ListingController;
