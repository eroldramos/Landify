/*
  Warnings:

  - A unique constraint covering the columns `[listingId,position]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Image_listingId_position_key" ON "public"."Image"("listingId", "position");
