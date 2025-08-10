import AuthService from "../services/authServices.ts";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../utils/types.ts";
class AuthController {
  static signup = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const existingUser = await AuthService.findUserByEmail(email);
      if (existingUser)
        return res.status(400).json({ message: "user already exists" });
      const user = await AuthService.registerUser(email, password);
      return res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Registration failed", error });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const token = await AuthService.loginUser(email, password);
      res.status(200).json({ token });
    } catch (error) {
      res.status(400).json({ message: "login failed", error: error });
    }
  };

  static getUserById = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      if (!user) return res.status(400).json({ message: "access denied" });
      const userId: string | undefined = req.params.id;
      const foundUser = await AuthService.findUserById(parseInt(userId));
      if (!foundUser)
        return res.status(400).json({ message: "user not found with this id" });
      res.status(200).json({ foundUser: foundUser, user: user });
    } catch (error) {
      res.status(500).json({ message: "internal server error", error });
    }
  };
}
export default AuthController;
