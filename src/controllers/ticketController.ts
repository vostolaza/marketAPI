import express, { Request, response, Response, Router } from "express";
import ticketService from "../service/ticketService";

const ticketController: Router = express.Router();

ticketController.get("/", async (req: Request, res: Response) => {
  try {
    const tickets = await ticketService.get();
    res.status(200).send(tickets);
  } catch (error) {
    response.status(500).send(error);
  }
});

ticketController.get("/:id", async (req: Request, res: Response) => {
  try {
    const tickets = await ticketService.getById(req.params.id);
    res.status(200).send(tickets);
  } catch (error) {
    response.status(500).send(error);
  }
});

ticketController.post("/", async (req: Request, res: Response) => {
  try {
    const ticket = await ticketService.create(req.body);
    res.status(200).send(ticket);
  } catch (error) {
    response.status(500).send(error);
  }
});

export default ticketController;
