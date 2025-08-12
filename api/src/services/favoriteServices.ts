import { PrismaClient } from "../generated/prisma/index.js";
import type { Listing, Prisma, Favorite } from "../generated/prisma/index.d.ts";
const prisma = new PrismaClient();
class FavoriteService {
  /**
   * Add favorite relationship.
   */
  static addFavorite = async (
    userId?: number,
    listingId?: number,
  ): Promise<Favorite> => {
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        listingId,
      },
    });

    return favorite;
  };

  /**
   * Get all favorites for a user.
   */
  static getFavoritesByUser = async (userId: number): Promise<Favorite[]> => {
    return await prisma.favorite.findMany({
      where: { userId },
      include: {
        user: true, // the user who added it as favorite
        listing: {
          include: {
            images: true, // include listing images
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  };

  /**
   * Get all favorites for a user.
   */
  static getFavoriteByCompositeId = async (
    userId: number,
    listingId: number,
  ): Promise<Favorite | null> => {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: userId,
          listingId: listingId,
        },
      },
      include: {
        listing: true,
      },
    });

    return favorite;
  };

  /**
   * Remove favorite.
   */

  static removeFavorite = async (
    userId: number,
    listingId: number,
  ): Promise<Favorite> => {
    const favorite = await prisma.favorite.delete({
      where: { userId_listingId: { userId, listingId } },
    });

    return favorite;
  };

  /**
   * Delete multiple favorites.
   */
  static deleteManyFavorites = async (where: Prisma.FavoriteWhereInput) => {
    const favorite = await prisma.favorite.deleteMany({ where });

    return favorite;
  };
}

export default FavoriteService;
