import jwt from "jsonwebtoken";
import authConfig from "./../../config/auth";
import { Request, Response } from "express";
import { AppDataSource } from "../utils/data-source";
import User from "../entities/User";
import Profile from "../entities/Profile";

class SessionController {
  async store(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await AppDataSource.getRepository(User).findOne({
      relations: ["profiles"],
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "password invalid" });
    }

    const { id, name, contact, profiles } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        contact,
        profile: profiles[0],
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
