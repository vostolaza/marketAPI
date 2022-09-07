import { CallbackError, Document } from "mongoose";
import Ticket from "../models/Ticket";
import { TicketDTO } from "../utils/dtos/tickets";

type MongooseUserQueryResult =
  | (Document<any, any, TicketDTO> & TicketDTO & { _id: string })
  | null;

const ticketService = {
  create: async (ticket: TicketDTO): Promise<TicketDTO> => {
    return new Promise<TicketDTO>((resolve, reject) => {
      Ticket.create(ticket, (err: CallbackError, newTicket: TicketDTO) => {
        if (err) {
          reject(err);
        }
        resolve(newTicket);
      });
    });
  },
  get: async (): Promise<TicketDTO[]> => {
    return new Promise<TicketDTO[]>((resolve, reject) => {
      Ticket.find({}, (err: CallbackError, tickets: TicketDTO[]) => {
        if (err) {
          reject(err);
        }
        resolve(tickets);
      });
    });
  },
  getById: async (ticketId): Promise<TicketDTO> => {
    return new Promise<TicketDTO>((resolve, reject) => {
      Ticket.find(
        { _id: ticketId },
        (err: CallbackError, ticket: TicketDTO) => {
          if (err) {
            reject(err);
          }
          resolve(ticket);
        }
      );
    });
  },
  getByStatus: async (ticketStatus): Promise<TicketDTO[]> => {
    return new Promise<TicketDTO[]>((resolve, reject) => {
      Ticket.find(
        { status: ticketStatus },
        (err: CallbackError, tickets: TicketDTO[]) => {
          if (err) {
            reject(err);
          }
          resolve(tickets);
        }
      );
    });
  },
};

export default ticketService;
