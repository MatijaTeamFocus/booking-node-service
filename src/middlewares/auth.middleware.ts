import { NextFunction, Request, Response } from "express";

import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["api-token"];

    if (!token || typeof token !== "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { token: token } });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.body.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
