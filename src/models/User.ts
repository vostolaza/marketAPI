import mongoose, { Model } from "mongoose";
import isEmail from "validator/lib/isEmail";

import { UserDTO } from "../utils/dtos/user";

const Schema = mongoose.Schema;

const UserSchema = new Schema<UserDTO>({
  username: { type: String, required: true, index: "hashed" },
  password: { type: String, required: true },
  email: {
    type: String,
    required: true,
    index: "hashed",
    validate: [isEmail, "Invalid email."],
  },
});

const User: Model<UserDTO> = mongoose.model<UserDTO>("User", UserSchema);

export default User;
