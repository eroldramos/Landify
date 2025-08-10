/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('REGULAR', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."PropertyType" AS ENUM ('APARTMENT', 'HOUSE', 'COMMERCIAL');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "username",
ADD COLUMN     "name" TEXT,
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'REGULAR';
