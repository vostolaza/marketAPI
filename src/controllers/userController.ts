import express, { Request, Response, Router } from "express";

const userController: Router = express.Router();

userController.get("/", (req: Request, res: Response) => {
    // DO SOMETHING
});

export default userController;
