import { Router } from "express";
import SupabaseMiddleware from "../middlewares/supabaseMiddleware.ts";
import FavoriteController from "../controllers/favoriteController.ts";

const router = Router();

router.post(
  "/favorite/add/{:id}",
  SupabaseMiddleware.authenticate,
  FavoriteController.addFavorite,
);

router.delete(
  "/favorite/delete",
  SupabaseMiddleware.authenticateAsAdmin,
  FavoriteController.removeManyFavorites,
);

router.delete(
  "/favorite/delete/{:id}",
  SupabaseMiddleware.authenticateAsAdmin,
  FavoriteController.removeFavorite,
);

router.get("/favorite/get", FavoriteController.getFavoritesByUser);

export default router;
