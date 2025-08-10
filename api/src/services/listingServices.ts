import { PrismaClient } from "../generated/prisma/index.js";
import type {
  Listing,
  PropertyType,
  ListingStatus,
  Prisma,
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
  static getListingById = async (id: number): Promise<Listing | null> => {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { images: true, favorites: true, owner: true },
    });
    return listing;
  };

  /**
   * Get listings by filter (optional).
   */
  static getListingsByFilter = async (
    filter: Partial<{
      status: ListingStatus;
      propertyType: PropertyType;
      ownerId: number;
      id: number;
    }>,
  ): Promise<Listing[]> => {
    const listing = await prisma.listing.findMany({
      where: filter,
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
      orderBy: { createdAt: "desc" },
    });

    return listing;
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
