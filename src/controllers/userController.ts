import express, { Request, Response, Router } from "express";
import { getErrorMessage } from "../utils/errorMessage";
import userService from "../service/userService";

const userController: Router = express.Router();

userController.post("/", async (req: Request, res: Response) => {
  try {
    const user = await userService.register(req.body);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

userController.post("/login", async (req: Request, res: Response) => {
  try {
    const user = await userService.login(req.body);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
});

export default userController;
