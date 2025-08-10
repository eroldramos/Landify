import type { Request, Response, NextFunction } from "express";

import { verifyToken } from "../utils/jwt.ts";
import type { SupabaseRequest } from "../utils/types.ts";

import SupabaseService from "../services/supabaseServices.ts";
import AuthService from "../services/authServices.ts";

class SupabaseMiddleware {
  static authenticate = async (
    req: SupabaseRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const token = req.header("Authorization")?.replace("Bearer", "");
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
      const email = await SupabaseService.supabaseIsUserAuthenticated(token); //return email
      req.currentUser = await AuthService.findUserByEmail(email);
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token", error });
    }
  };

  static authenticateAsAdmin = async (
    req: SupabaseRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const token = req.header("Authorization")?.replace("Bearer", "");
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
      const email = await SupabaseService.supabaseIsUserAuthenticated(token); //return email

      const user = await AuthService.findUserByEmail(email);

      if (user?.role != "ADMIN")
        return res.status(403).json({ message: "Action denied" });
      req.currentUser = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token", error });
    }
  };
}

export default SupabaseMiddleware;
