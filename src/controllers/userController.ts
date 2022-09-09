import express, { Request, Response, Router } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getErrorMessage } from "../utils/errorMessage";
import userService from "../service/userService";
import twoFactorService from "../service/twoFactorService";
import { randomInt } from "crypto";
import { UserDTO } from "../utils/dtos/user";

const dotenv = require("dotenv");
dotenv.config();

const JWT_KEY = process.env.JWT_KEY!;

const userController: Router = express.Router();

userController.post("/", async (req: Request, res: Response) => {
  try {
    const user = await userService.register(req.body);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

userController.post("/vulnerable", async (req: Request, res: Response) => {
  try {
    const user = await userService.vulnerableRegister(req.body);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

userController.post("/login", async (req: Request, res: Response) => {
  try {
    const obj = await userService.login(req.body);
    randomInt(10000, 99999, async (err, num) => {
      if (err) {
        console.log("error generating random int");
        return res.status(500).json({ msg: "Oops, something went wrong" });
      }
      try {
        await twoFactorService.createCode(
          req.body.username,
          obj["user"]!.email,
          num
        );
        res.status(200).send(obj["token"]);
      } catch (error) {
        return res.status(500).json({ msg: "Oops, something went wrong" });
      }
    });
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
});

userController.post("/vulnerableLogin", async (req: Request, res: Response) => {
  try {
    const user = await userService.login(req.body);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
});

userController.get(
  "/login/code/:authCode",
  async (req: Request, res: Response) => {
    const { authCode } = req.params;
    if (!authCode) {
      return res.status(400).json({ msg: "Invalid 2FA token" });
    }

    console.log(`Verifying 2FA token: ${authCode}`);

    const { username: usernameCookie } = req.cookies;

    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      const decodedJWT = jwt.verify(token!, JWT_KEY) as UserDTO;
      console.log(`decoded JWT: ${JSON.stringify(decodedJWT, null, 2)}`);

      const [codesMatched, codeExpired] = twoFactorService.verifyAuthCode(
        decodedJWT.username,
        +authCode
      );

      if (codesMatched) {
        return res
          .status(202)
          .json({ msg: "2FA Success", username: decodedJWT.username });
      } else if (!codesMatched && !codeExpired) {
        console.log(
          `incorrect auth code attempt from ip ${req.body.ip}, auth code attempt: ${authCode} for username: ${usernameCookie}`
        );
        return res.status(404).json({ msg: "incorrect code" });
      } else {
        console.log(
          `expired auth code attempt from ip ${req.body.ip}, auth code attempt: ${authCode} for username: ${usernameCookie}`
        );
        return res.status(403).json({ msg: "code expired" });
      }
    } catch (err) {
      console.log(
        `error verifying username JWT: ${JSON.stringify(err, null, 2)}`
      );
      return res.status(403).json({ msg: err });
    }
  }
);

export default userController;
