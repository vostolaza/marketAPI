import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const dotenv = require("dotenv");
dotenv.config();

const JWT_KEY = process.env.JWT_KEY!;

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, JWT_KEY);
    req.token = decoded as JwtPayload;

    next();
  } catch (err) {
    res.status(401).send("User not logged in.");
  }
};
