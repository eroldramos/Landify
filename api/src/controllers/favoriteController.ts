import type { Request, Response } from "express";
import ListingService from "../services/listingServices.ts";
import type { SupabaseRequest } from "../utils/types.ts";
import { ListingStatus, PropertyType } from "../generated/prisma/index.js";
import FavoriteService from "../services/favoriteServices.ts";

class FavoriteController {
  static addFavorite = async (req: SupabaseRequest, res: Response) => {
    try {
      const { listingId } = req.body;

      const userId: number = req?.currentUser?.id!;

      const favorite = await FavoriteService.addFavorite(listingId, userId);
      return res.status(201).json(favorite);
    } catch (error) {
      res.status(400).json({ message: "Adding favorite failed", error });
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
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid listing ID" });
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

  static getListings = async (req: Request, res: Response) => {
    try {
      const filter: {
        status?: ListingStatus;
        propertyType?: PropertyType;
        ownerId?: number;
        id?: number;
      } = {};

      if (typeof req.query.status === "string") {
        filter.status = req.query.status as ListingStatus;
      }

      if (typeof req.query.propertyType === "string") {
        filter.propertyType = req.query.propertyType as PropertyType;
      }

      if (typeof req.query.ownerId === "string") {
        const parsed = parseInt(req.query.ownerId, 10);
        if (!isNaN(parsed)) filter.ownerId = parsed;
      }

      const listings = await ListingService.getListingsByFilter(filter);
      return res.status(200).json(listings);
    } catch (error) {
      return res.status(400).json({ message: "Listing failed", error });
    }
  };

  static getListingById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const listingFound = await ListingService.getListingById(parseInt(id));
      if (!listingFound)
        return res
          .status(400)
          .json({ message: "Listing is not found with this id" });
      return res.status(200).json(listingFound);
    } catch (error) {
      return res.status(400).json({ message: "Listing failed", error });
    }
  };
}
export default FavoriteController;
