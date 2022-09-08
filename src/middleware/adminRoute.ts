import { Request, Response, NextFunction } from "express";
import { USER_ROLES } from "../utils/constants/userRoles";

export const adminRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.token && req.token.role === USER_ROLES.CLIENT) {
      res.status(401).send({ error: "Unauthorized." });
    } else {
      next();
    }
  } catch (err) {
    res.status(401).send("User not logged in.");
  }
};
