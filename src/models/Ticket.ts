import mongoose, { Model } from "mongoose";
import { TicketDTO } from "../utils/dtos/tickets";

const {
  Types: { ObjectId },
} = mongoose;

const Schema = mongoose.Schema;

const TicketSchema = new Schema<TicketDTO>({
  purchaseId: { type: ObjectId, required: true },
  status: { type: String, default: "OPEN", required: true },
  userId: { type: ObjectId, required: true },
  description: { type: String, required: true },
});

const Ticket: Model<TicketDTO> = mongoose.model<TicketDTO>(
  "ticket",
  TicketSchema
);

export default Ticket;
