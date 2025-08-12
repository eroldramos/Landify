import type { Request, Response } from "express";
import type { SupabaseRequest } from "../utils/types";
import FavoriteService from "../services/favoriteServices";

class FavoriteController {
  static addFavorite = async (req: SupabaseRequest, res: Response) => {
    try {
      const listingId = req.params.id;

      const userId: number = req?.currentUser?.id!;

      const foundFavorite = await FavoriteService.getFavoriteByCompositeId(
        userId,
        parseInt(listingId),
      );

      if (foundFavorite)
        return res.status(409).json({
          message: "You already added this listing to your favorites",
        });

      const favorite = await FavoriteService.addFavorite(
        userId,
        parseInt(listingId),
      );
      return res.status(201).json(favorite);
    } catch (error: any) {
      if (error.code === "P2003") {
        // Prisma: record not found
        return res.status(404).json({
          message: "Adding a not existing listing as favorite",
          error,
        });
      }
      res.status(400).json({ message: "Adding favorite failed", error });
    }
  };

  static removeFavorite = async (req: SupabaseRequest, res: Response) => {
    try {
      const userId = req?.currentUser?.id!;
      const listingId = parseInt(req.params.id, 10);
      if (isNaN(listingId)) {
        return res.status(400).json({ message: "Invalid listing ID" });
      }

      const deleteListing = await FavoriteService.removeFavorite(
        userId,
        listingId,
      );

      return res.status(200).json(deleteListing);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Delete failed", error: error.message });
    }
  };

  static removeManyFavorites = async (req: SupabaseRequest, res: Response) => {
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
      const deleteListing = await FavoriteService.deleteManyFavorites(where);

      return res.status(200).json(deleteListing);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Delete favorite failed", error: error.message });
    }
  };

  static getFavoritesByUser = async (req: SupabaseRequest, res: Response) => {
    try {
      const userId = req.currentUser?.id!;
      const favorites = await FavoriteService.getFavoritesByUser(userId);
      return res.status(200).json(favorites);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "getting favorites failed", error });
    }
  };
}
export default FavoriteController;
