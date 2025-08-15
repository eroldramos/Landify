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
   * Get all favorites for a user with pagination + search (title/description/address).
   * Uses a single transaction so count & data are consistent.
   */
  static getFavoritesByUser = async (
    userId: number,
    page: number = 1,
    limit: number = 10,
    search: string = "",
  ): Promise<{
    data: Favorite[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const skip = (page - 1) * limit;
    const term = search?.trim();

    // Build WHERE condition
    const whereCondition: any = {
      userId,
      ...(term
        ? {
            listing: {
              OR: [
                { title: { contains: term, mode: "insensitive" } },
                { description: { contains: term, mode: "insensitive" } },
                { address: { contains: term, mode: "insensitive" } },
              ],
            },
          }
        : {}),
    };

    const [data, total] = await prisma.$transaction([
      prisma.favorite.findMany({
        where: whereCondition,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              // password excluded
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
      prisma.favorite.count({ where: whereCondition }),
    ]);

    return {
      data,
      total,
      page,
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
