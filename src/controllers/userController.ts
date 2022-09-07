import express, { Request, response, Response, Router } from "express";
import userService from "../service/userService";

const userController: Router = express.Router();

userController.get("/", async (req: Request, res: Response) => {
  try {
    const users = await userService.get();
    res.status(200).send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

userController.get("/:id", async (req: Request, res: Response) => {
  try {
    const users = await userService.getById(req.params.id);
    res.status(200).send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

export default userController;
