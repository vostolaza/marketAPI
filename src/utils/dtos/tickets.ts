import { ObjectId } from "mongoose";
import { TicketStatus } from "../types/ticketStatus";

export interface TicketDTO {
  _id: string;
  purchaseId: ObjectId;
  status: TicketStatus;
  userId: ObjectId;
  description: string;
  save: () => Promise<void>;
}
