import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcryptjs";
import type { User } from "../generated/prisma";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
class AuthService {
  static registerUser = async (
    username: string,
    email: string,
    password: string,
  ): Promise<User> => {
    const hashPassoword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPassoword,
      },
    });

    return user;
  };
  static findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  };

  static loginUser = async (email: string, password: string) => {
    const user = await this.findUserByEmail(email);
    if (!user) throw new Error("user not found");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");
    const token = jwt.sign({ userId: user.id }, JWT_SECRET!, {
      expiresIn: "1h",
    });
    return token;
  };
  static findUserById = async (id: number) => {
    return prisma.user.findUnique({ where: { id } });
  };
}

export default AuthService;
