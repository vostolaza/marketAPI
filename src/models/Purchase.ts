import mongoose, { Model } from "mongoose";
import { PurchaseDTO } from "../utils/dtos/purchase";

const {
  Types: { ObjectId },
} = mongoose;

const Schema = mongoose.Schema;

const PurchaseSchema = new Schema<PurchaseDTO>(
  {
    userId: { type: ObjectId, required: true },
    items: [
      new Schema(
        {
          productId: { type: ObjectId, required: true, ref: "Product" },
          quantity: { type: Number, required: true },
        },
        { _id: false }
      ),
    ],
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

PurchaseSchema.path("items").validate(function (v) {
  return v.length > 0;
});

const Purchase: Model<PurchaseDTO> = mongoose.model<PurchaseDTO>(
  "purchase",
  PurchaseSchema
);

export default Purchase;
