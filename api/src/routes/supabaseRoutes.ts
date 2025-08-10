import { Router } from "express";
import SupabaseController from "../controllers/supabaseController.ts";
import SupabaseMiddleware from "../middlewares/supabaseMiddleware.ts";
const router = Router();

/**
 * @swagger
 * /api/supabase/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Supabase
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *
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
router.post("/supabase/register", SupabaseController.supabaseSignup);

/**
 * @swagger
 * /api/supabase/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Supabase
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
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post("/supabase/login", SupabaseController.supabaseLogin);

/**
 * @swagger
 * /api/supabase/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - Supabase
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/supabase/{:id}",
  SupabaseMiddleware.authenticate,
  SupabaseController.supabaseGetUser,
);

export default router;
