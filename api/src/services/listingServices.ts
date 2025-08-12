import { PrismaClient } from "../generated/prisma";
import type {
  Listing,
  PropertyType,
  ListingStatus,
  Prisma,
  Favorite,
} from "../generated/prisma";
const prisma = new PrismaClient();
class ListingService {
  /**
   * Create a new listing.
   */
  static createListing = async (
    title: string,
    address: string,
    priceCents: number,
    propertyType: PropertyType,
    status: ListingStatus,
    ownerId?: number,
    description?: string,
  ): Promise<Listing> => {
    const listing = await prisma.listing.create({
      data: {
        title,
        address,
        priceCents,
        propertyType,
        status,
        ownerId,
        description,
      },
    });

    return listing;
  };

  /**
   * Get listing by ID.
   */
  static getListingById = async (
    id: number,
    currentUserId?: number,
  ): Promise<
    (Listing & { favorites: Favorite[]; favoritesCount: number }) | null
  > => {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        images: true,
        owner: true,
        favorites: currentUserId
          ? {
              where: { userId: currentUserId }, // Only the current user's favorite
            }
          : false, // Skip favorites array if no user is given
        _count: {
          select: { favorites: true }, // Count total favorites
        },
      },
    });

    if (!listing) return null;

    return {
      ...listing,
      favoritesCount: listing._count.favorites,
    };
  };

  /**
   * Get listings by filter (optional).
   */
  static getListingsByFilter = async ({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "updatedAt",
    sortOrder = "desc",
    search = "",
    priceRange,
    favoritedByUserId, // 👈 new param
  }: {
    page?: number;
    limit?: number;
    filters?: Partial<{
      status: ListingStatus;
      propertyType: PropertyType;
      ownerId: number;
      id: number;
    }>;
    sortBy?: keyof Listing;
    sortOrder?: "asc" | "desc";
    search?: string;
    priceRange?: { min?: number; max?: number };
    favoritedByUserId?: number | undefined; // 👈 optional
  }): Promise<{
    data: Listing[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const skip = (page - 1) * limit;

    const where: Prisma.ListingWhereInput = {
      ...filters,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { address: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(priceRange?.min !== undefined || priceRange?.max !== undefined
        ? {
            priceCents: {
              ...(priceRange.min !== undefined ? { gte: priceRange.min } : {}),
              ...(priceRange.max !== undefined ? { lte: priceRange.max } : {}),
            },
          }
        : {}),
      ...(favoritedByUserId !== undefined
        ? {
            favorites: {
              some: { userId: favoritedByUserId },
            },
          }
        : {}),
    };

    const [data, total] = await prisma.$transaction([
      prisma.listing.findMany({
        where,
        include: {
          images: true,
          favorites: true,
          owner: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return { data, total, page, limit };
  };

  /**
   * Update listing.
   */
  static updateListing = async (
    id: number,
    data: Partial<Omit<Listing, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Listing> => {
    const listing = await prisma.listing.update({
      where: { id },
      data,
    });

    return listing;
  };

  /**
   * Delete listing (cascade deletes images, favorites).
   */
  static deleteListing = async (id: number): Promise<Listing> => {
    const listing = await prisma.listing.delete({ where: { id } });

    return listing;
  };

  /**
   * Delete multiple listings.
   */
  static deleteManyListings = async (where: Prisma.ListingWhereInput) => {
    const listing = prisma.listing.deleteMany({ where });

    return listing;
  };
  //   static findUserByEmail = async (email: string) => {
  //     return prisma.user.findUnique({ where: { email } });
  //   };

  //   static loginUser = async (email: string, password: string) => {
  //     const user = await this.findUserByEmail(email);
  //     if (!user) throw new Error("user not found");
  //     const isMatch = await bcrypt.compare(password, user.password);
  //     if (!isMatch) throw new Error("Invalid password");
  //     const token = jwt.sign({ userId: user.id }, JWT_SECRET!, {
  //       expiresIn: "1h",
  //     });
  //     return token;
  //   };
  //   static findUserById = async (id: number) => {
  //     return prisma.user.findUnique({ where: { id } });
  //   };
}

export default ListingService;
