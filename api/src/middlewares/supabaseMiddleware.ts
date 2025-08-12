import type { Request, Response, NextFunction } from "express";

import type { SupabaseRequest } from "../utils/types";

import SupabaseService from "../services/supabaseServices";
import AuthService from "../services/authServices";

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
      return res.status(401).json({ message: "Invalid token", error });
    }
  };

  // can be use for auth and non auth scenario
  static anonymousAuthenticate = async (
    req: SupabaseRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const token = req.header("Authorization")?.replace("Bearer", "");
    if (!token) {
      next();
      return;
    }

    try {
      const email = await SupabaseService.supabaseIsUserAuthenticated(token); //return email
      console.log(email);
      req.currentUser = await AuthService.findUserByEmail(email);
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid tokesn", error });
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
      return res.status(401).json({ message: "Invalid token", error });
    }
  };
}

export default SupabaseMiddleware;
