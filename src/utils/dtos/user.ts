import mongoose from "mongoose";

export interface UserDTO extends mongoose.Document {
  _id: string;
  username: string;
  password: string;
  email?: string;
}
