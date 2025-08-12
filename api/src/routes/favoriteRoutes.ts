import { Router } from "express";
import SupabaseMiddleware from "../middlewares/supabaseMiddleware";
import FavoriteController from "../controllers/favoriteController";

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
