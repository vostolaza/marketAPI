import mongoose, { Model } from "mongoose";
import isEmail from "validator/lib/isEmail";

import { UserDTO } from "../utils/dtos/user";

const Schema = mongoose.Schema;

const VulnerableUserSchema = new Schema<UserDTO>({
  username: { type: String, required: true, index: "hashed", unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["CLIENT", "ADMIN"], default: "CLIENT" },
  email: {
    type: String,
    required: true,
    index: "hashed",
    validate: [isEmail, "Invalid email."],
    unique: true,
  },
});

const VulnerableUser: Model<UserDTO> = mongoose.model<UserDTO>(
  "vulnerableUser",
  VulnerableUserSchema,
  "user"
);

export default VulnerableUser;
