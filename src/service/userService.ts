import { CallbackError, Document } from "mongoose";
import User from "../models/User";
import { UserDTO } from "../utils/dtos/user";

type MongooseUserQueryResult =
  | (Document<any, any, UserDTO> & UserDTO & { _id: string })
  | null;

const userService = {
  create: async (user: UserDTO): Promise<UserDTO> => {
    return new Promise<UserDTO>((resolve, reject) => {
      User.create(user, (err: CallbackError, newUser: UserDTO) => {
        if (err) {
          reject(err);
        }
        resolve(newUser);
      });
    });
  },
  get: async (): Promise<any> => {
    const users = await User.find({});
    return users;
  },
  getById: async (id): Promise<any> => {
    const user = await User.findOne({ _id: id });
    return user;
  },
};

export default userService;
