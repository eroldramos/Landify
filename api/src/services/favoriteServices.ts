import { PrismaClient } from "../generated/prisma";
import type { Prisma, Favorite } from "../generated/prisma";
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
   * Get all favorites for a user with pagination.
   */
  static getFavoritesByUser = async (
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Favorite[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const skip = (page - 1) * limit;

    const [data, total] = await prisma.$transaction([
      prisma.favorite.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              // show only fields need to be return and included
              // can't take password: false
            },
          },
          listing: {
            include: {
              images: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.favorite.count({
        where: { userId },
      }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
