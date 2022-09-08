import mongoose, { Model } from "mongoose";
import { ProductDTO } from "../utils/dtos/product";

const {
  Types: { ObjectId },
} = mongoose;

const Schema = mongoose.Schema;

const ProductSchema = new Schema<ProductDTO>({
  name: { type: String, required: true },
  description: { type: String },
  stock: { type: Number, default: 0, required: true },
  price: { type: Number, required: true },
});

const Product: Model<ProductDTO> = mongoose.model<ProductDTO>(
  "product",
  ProductSchema
);

export default Product;
