import { Router } from "express";
import AuthController from "../controllers/authController.ts";
import AuthMiddleware from "../middlewares/authMiddleware.ts";
import ListingService from "../services/listingServices.ts";
import ListingController from "../controllers/listingController.ts";
import SupabaseMiddleware from "../middlewares/supabaseMiddleware.ts";

const router = Router();

/**
 * @swagger
 * /api/listing/create:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: pass123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/listing/create",
  SupabaseMiddleware.authenticateAsAdmin,
  ListingController.createListingOne,
);

router.put(
  "/listing/update/{:id}",
  SupabaseMiddleware.authenticateAsAdmin,
  ListingController.updateListingOne,
);

router.delete(
  "/listing/delete",
  SupabaseMiddleware.authenticateAsAdmin,
  ListingController.deleteListingMany,
);

router.delete(
  "/listing/delete/{:id}",
  SupabaseMiddleware.authenticateAsAdmin,
  ListingController.deleteListingOne,
);

router.get("/listing/get", ListingController.getListings);

router.get("/listing/get/{:id}", ListingController.getListingById);

// /**
//  * @swagger
//  * /api/auth/login:
//  *   post:
//  *     summary: Login user
//  *     tags:
//  *       - Auth
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 example: john@example.com
//  *               password:
//  *                 type: string
//  *                 example: pass123
//  *     responses:
//  *       200:
//  *         description: Login successful
//  *       401:
//  *         description: Unauthorized
//  */
// router.post("/auth/login", AuthController.login);

// /**
//  * @swagger
//  * /api/user/{id}:
//  *   get:
//  *     summary: Get user by ID
//  *     tags:
//  *       - User
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The user's ID
//  *     responses:
//  *       200:
//  *         description: User retrieved successfully
//  *       404:
//  *         description: User not found
//  *       401:
//  *         description: Unauthorized
//  */
// router.get(
//   "/user/{id}",
//   AuthMiddleware.authenticate,
//   AuthController.getUserById,
// );

export default router;
