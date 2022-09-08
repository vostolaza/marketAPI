import mongoose, { ObjectId } from "mongoose";
import { TicketStatus } from "../types/ticketStatus";

export interface TicketDTO extends mongoose.Document  {
  _id: string;
  purchaseId: ObjectId;
  status: TicketStatus;
  userId: ObjectId;
  description: string;
}
