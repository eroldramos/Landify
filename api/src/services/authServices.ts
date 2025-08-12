import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { User } from "../utils/types.ts";
import type { User as UserPrisma } from "../generated/prisma/index.d.ts";
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
class AuthService {
  static registerUser = async (
    email: string,
    password: string,
    name: string,
  ): Promise<UserPrisma> => {
    const hashPassoword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassoword,
        name,
      },
    });

    return user;
  };
  static findUserByEmail = async (email: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
      where: { email },
      omit: {
        password: true,
      },
    });
    return user;
  };

  static loginUser = async (
    email: string,
    password: string,
  ): Promise<String> => {
    const user = await this.findUserByEmail(email);
    if (!user) throw new Error("user not found");
    const isMatch = await bcrypt.compare(password, user.password!);
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
