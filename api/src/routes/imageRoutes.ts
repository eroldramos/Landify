import { Router } from "express";
import SupabaseMiddleware from "../middlewares/supabaseMiddleware.ts";
import FavoriteController from "../controllers/favoriteController.ts";
import ImageController from "../controllers/imageController.ts";
import multer from "multer";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/image/uploads/{:id}",
  SupabaseMiddleware.authenticateAsAdmin,
  upload.array("files"),
  ImageController.uploadImages,
);

router.delete(
  "/image/remove_images",
  SupabaseMiddleware.authenticateAsAdmin,
  ImageController.removeImages,
);

// router.delete(
//   "/image/delete",
//   SupabaseMiddleware.authenticateAsAdmin,
//   FavoriteController.removeManyFavorites,
// );

// router.delete(
//   "/image/delete/{:id}",
//   SupabaseMiddleware.authenticateAsAdmin,
//   FavoriteController.removeFavorite,
// );

// router.get("/image/get", FavoriteController.getFavoritesByUser);

export default router;
