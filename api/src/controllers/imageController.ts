import type { Request, Response } from "express";
import type { SupabaseRequest } from "../utils/types";
import ImageService from "../services/imageServices";

const bucketName = "landify-bucket";

interface MulterFile {
  /** The fieldname specified in the form */
  fieldname: string;
  /** Name of the file on the user's computer */
  originalname: string;
  /** Encoding type */
  encoding: string;
  /** Mime type of the file */
  mimetype: string;
  /** Size of the file in bytes */
  size: number;
  /** A Buffer of the entire file */
  buffer: Buffer;
  /** Optional destination, filename etc if using disk storage */
  [key: string]: any;
}

class ImageController {
  static uploadImages = async (req: SupabaseRequest, res: Response) => {
    try {
      const listingId = parseInt(req.params.id);
      const files = req.files as MulterFile[] | undefined;

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }
      let index = 0;
      const uploadedFiles = [];

      for (const file of files) {
        const { originalname, buffer, mimetype } = file;

        const publicUrl = await ImageService.uploadImages(
          originalname,
          buffer,
          mimetype,
        );

        index = index + 1;
        uploadedFiles.push({
          url: publicUrl,
          listingId: listingId,
          altText: originalname,
          position: index,
        });
      }

      const uploads = await ImageService.addManyImages(uploadedFiles);

      if (!uploads)
        return res.status(500).json({ message: "Internal Server Error" });

      return res.json({
        message: "Images uploaded successfully",
        files: uploadedFiles,
      });
    } catch (error: any) {
      if (error.code === "P2003") {
        // Prisma: record not found
        return res
          .status(404)
          .json({ message: "Adding images to a not existing listing", error });
      }
      console.error("Unexpected error:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  };

  static removeImages = async (req: SupabaseRequest, res: Response) => {
    function getFilePathFromPublicUrl(
      url: string,
      bucketName: string,
    ): string | null {
      const base = `https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/${bucketName}/`;
      if (!url.startsWith(base)) return null;
      return url.substring(base.length);
    }
    try {
      const { images } = req.body;
      const getIds = (items: { id: number }[]) => items.map((item) => item.id);
      const idsToDelete = getIds(images);
      const where = { id: { in: idsToDelete } };
      const deletedImages = await ImageService.deleteManyImages(where);

      const filePaths = images
        .map((image: any) => getFilePathFromPublicUrl(image?.url, bucketName))
        .filter((p: any): p is string => !!p);

      const removeImagesFromBucket = await ImageService.removeImages(filePaths);

      console.log(removeImagesFromBucket);

      return res.json({
        message: "Images deleted successfully",
        files: deletedImages,
        fileDetails: removeImagesFromBucket,
      });
    } catch (error: any) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  };
}
export default ImageController;
