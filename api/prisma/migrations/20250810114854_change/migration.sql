/*
  Warnings:

  - The primary key for the `Favorite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Favorite` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Image` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Listing` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Listing` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `listingId` on the `Favorite` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `listingId` on the `Image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Favorite" DROP CONSTRAINT "Favorite_listingId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Image" DROP CONSTRAINT "Image_listingId_fkey";

-- AlterTable
ALTER TABLE "public"."Favorite" DROP CONSTRAINT "Favorite_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "listingId",
ADD COLUMN     "listingId" INTEGER NOT NULL,
ADD CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Image" DROP CONSTRAINT "Image_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "listingId",
ADD COLUMN     "listingId" INTEGER NOT NULL,
ADD CONSTRAINT "Image_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Listing" DROP CONSTRAINT "Listing_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Listing_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Favorite_listingId_idx" ON "public"."Favorite"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_listingId_key" ON "public"."Favorite"("userId", "listingId");

-- CreateIndex
CREATE INDEX "Image_listingId_idx" ON "public"."Image"("listingId");

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
