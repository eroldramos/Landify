import { Prisma, PrismaClient } from "../generated/prisma/index.js";
import type { Image } from "../generated/prisma";

import { createClient } from "@supabase/supabase-js";
import { access } from "fs";

const supabaseUrl: string = process.env.SUPABASE_URL || "";
const supabaseKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

const prisma = new PrismaClient();

const bucketName = "landify-bucket"; // replace with your bucket
class ImageService {
  static uploadImages = async (
    originalname: string,
    buffer: Buffer,
    mimetype: string,
  ) => {
    const filePath = `uploads/${Date.now()}_${originalname}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: mimetype,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error(`Failed to upload ${originalname}:`, error);
      throw error;
    }

    const publicUrl = supabase.storage.from(bucketName).getPublicUrl(filePath)
      .data.publicUrl;

    return publicUrl;
  };

  static removeImages = async (filePaths: any[]) => {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove(filePaths);

    if (error) throw error;

    return data;
  };

  static addImage = async (
    url: string,
    listingId?: number,
    altText?: string,
    position: number = 0,
  ): Promise<Image> => {
    const image = await prisma.image.create({
      data: { url, listingId, altText, position },
    });
    return image;
  };

  static addManyImages = async (
    images: Array<{
      url: string;
      listingId?: number;
      altText?: string;
      position?: number;
    }>,
  ) => {
    const image = await prisma.image.createMany({
      data: images,
      skipDuplicates: false, // optional: skips inserting duplicates if any
    });

    return image;
  };

  static getImagesByListing = async (listingId: number): Promise<Image[]> => {
    const images = prisma.image.findMany({
      where: { listingId },
      orderBy: { position: "asc" },
    });
    return images;
  };
  static updateImage = async (
    id: number,
    data: Partial<Omit<Image, "id" | "createdAt">>,
  ): Promise<Image> => {
    const image = await prisma.image.update({
      where: { id },
      data,
    });

    return image;
  };
  static deleteImage = async (id: number): Promise<Image> => {
    const image = await prisma.image.delete({ where: { id } });
    return image;
  };
  static deleteManyImages = async (where: Prisma.ImageWhereInput) => {
    const image = await prisma.image.deleteMany({ where });
    return image;
  };
}

export default ImageService;
