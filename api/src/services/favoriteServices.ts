import { PrismaClient } from "../generated/prisma/index.js";
import type { Listing, Prisma, Favorite } from "../generated/prisma";
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
    const favorite = await prisma.favorite.findMany({
      where: { userId },
      include: {
        listing: true,
      },
      orderBy: { createdAt: "desc" },
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
  static deleteManyFavorites = async (id: number): Promise<Favorite> => {
    const favorite = await prisma.favorite.delete({ where: { id } });

    return favorite;
  };
}

export default FavoriteService;
