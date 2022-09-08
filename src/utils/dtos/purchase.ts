import mongoose, { ObjectId } from "mongoose";
import { PurchaseStatus } from "../types/purchaseStatus";

export interface PurchaseDTO extends mongoose.Document  {
  _id: string;
  userId: ObjectId;
  items: Array<any>;
  status: PurchaseStatus;
  purchaseTotal: Number;
}
