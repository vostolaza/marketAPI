import mongoose from "mongoose";

export interface ProductDTO extends mongoose.Document {
  _id: string;
  name: string;
  description: string;
  stock: Number;
  price: Number;
}
