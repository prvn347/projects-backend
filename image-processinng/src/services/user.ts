import { userSigninInputType, userSignupInputType } from "../types/userTypes";
import bcrypt from "bcryptjs";

import { generateToken } from "../utils/jwtUtils";
import { prisma } from "../db";
export class userService {
  async createUser(userData: userSignupInputType) {
    try {
      const hashedPassword = await bcrypt.hashSync(userData.password, 10);
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
        },
      });

      const token = generateToken(user.id);

      return { user, token };
    } catch (error) {
      console.error(error);

      return new Error("error while db user creation");
    }
  }
  async findUser(userData: userSigninInputType) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: userData.email,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const isValidPassword = await bcrypt.compare(
        userData.password,
        user?.password || ""
      );
      if (!isValidPassword) {
        throw new Error("wrong password");
      }
      if (isValidPassword) {
        const token = generateToken(user.id);
        return { user, token };
      }
    } catch (error) {
      console.error(error);
      throw new Error("error while finding user");
    }
  }
}
