import { ObjectId } from "mongoose";
import { PurchaseStatus } from "../types/purchaseStatus";

export interface PurchaseDTO {
  _id: string;
  userId: ObjectId;
  items: Array<any>;
  status: PurchaseStatus;
  save: () => Promise<void>;
}
