-- DropForeignKey
ALTER TABLE "public"."Favorite" DROP CONSTRAINT "Favorite_listingId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Image" DROP CONSTRAINT "Image_listingId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Listing" DROP CONSTRAINT "Listing_ownerId_fkey";

-- AlterTable
ALTER TABLE "public"."Favorite" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "listingId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Image" ALTER COLUMN "listingId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Listing" ALTER COLUMN "ownerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Listing" ADD CONSTRAINT "Listing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
