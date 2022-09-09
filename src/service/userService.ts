import { CallbackError, Document } from "mongoose";
import User from "../models/User";
import VulnerableUser from "../models/VulnerableUser";
import { UserDTO } from "../utils/dtos/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const dotenv = require("dotenv");
dotenv.config();

const JWT_KEY = process.env.JWT_KEY!;

type MongooseUserQueryResult =
  | (Document<any, any, UserDTO> & UserDTO & { _id: string })
  | null;

const userService = {
  register: async (user: UserDTO): Promise<UserDTO> => {
    return new Promise<UserDTO>((resolve, reject) => {
      User.create(user, (err: CallbackError, newUser: UserDTO) => {
        if (err) {
          reject(err);
        }
        resolve(newUser);
      });
    });
  },
  vulnerableRegister: async (user: UserDTO): Promise<UserDTO> => {
    return new Promise<UserDTO>((resolve, reject) => {
      VulnerableUser.create(user, (err: CallbackError, newUser: UserDTO) => {
        if (err) {
          reject(err);
        }
        resolve(newUser);
      });
    });
  },
  login: async (user: UserDTO) => {
    return new Promise<Object>(async (resolve, reject) => {
      const foundUser = await User.findOne({ username: user.username });

      if (!foundUser) {
        reject("Incorrect login information");
      } else {
        const isMatch = bcrypt.compareSync(user.password, foundUser.password);
        if (isMatch) {
          const token = jwt.sign(
            {
              id: foundUser._id,
              role: foundUser.role,
            },
            JWT_KEY,
            {
              expiresIn: "2 days",
            }
          );
          resolve({
            user: {
              _id: foundUser._id,
              username: foundUser.username,
              email: foundUser.email,
              role: foundUser.role,
            },
            token,
          });
        } else {
          reject(new Error("Incorrect login information"));
        }
      }
    });
  },
};

export default userService;
