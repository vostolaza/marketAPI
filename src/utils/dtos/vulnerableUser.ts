import mongoose from "mongoose";

export interface VulnerableUserDTO extends mongoose.Document {
  _id: string;
  username: string;
  password: string;
  role?: string;
  email?: string;
}
