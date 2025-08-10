import SupabaseService from "../services/supabaseServices.ts";
import AuthService from "../services/authServices.ts";
import type { Request, Response } from "express";
import type { AuthenticatedRequest, SupabaseRequest } from "../utils/types.ts";
class SupabaseController {
  static supabaseSignup = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const existingUser = await AuthService.findUserByEmail(email);
      if (existingUser)
        return res.status(400).json({ message: "User already exists" });
      const user = await SupabaseService.supabaseRegisterUser(email, password);
      const storedUser = await AuthService.registerUser(email, password);
      if (user) return res.status(201).json(storedUser);
      return res.status(500).json({ message: "Internal server error" });
    } catch (error) {
      res.status(400).json({ message: "Registration failed", error });
    }
  };

  static supabaseLogin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const data = await SupabaseService.supabaseLoginUser(email, password);
      res.cookie("refreshToken", data.session.refresh_token, {
        httpOnly: true,
      });
      res.status(200).json({
        accessToken: data.session.access_token,
        expireIn: data.session.expires_in,
        expireAt: data.session.expires_at,
        email: data.user.email,
      });
    } catch (error) {
      res.status(400).json({ message: "Login failed", error });
    }
  };

  static supabaseGetUser = async (req: SupabaseRequest, res: Response) => {
    try {
      const email = req?.currentUser?.email;

      if (!email) return res.status(400).json({ message: "access denied" });
      const userId: string | undefined = req.params.id;
      const foundUser = await AuthService.findUserById(parseInt(userId));
      if (!foundUser)
        return res.status(400).json({ message: "user not found with this id" });
      res.status(200).json({ foundUser: foundUser });
    } catch (error) {
      res.status(500).json({ message: "internal server error", error });
    }
  };
}
export default SupabaseController;
