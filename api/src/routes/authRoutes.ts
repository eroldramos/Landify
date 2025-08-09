import { Router } from "express";
import AuthController from "../controllers/authController.ts";
import AuthMiddleware from "../middlewares/authMiddleware.ts";

const router = Router();

router.post("/auth/register", AuthController.signup);
router.post("/auth/login", AuthController.login);
router.get(
  "/user/:id",
  AuthMiddleware.authenticate,
  AuthController.getUserById,
);

export default router;
