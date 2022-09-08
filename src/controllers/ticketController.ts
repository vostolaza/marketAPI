import express, { Request, Response, Router } from "express";
import { adminRoute } from "../middleware/adminRoute";
import ticketService from "../service/ticketService";

const ticketController: Router = express.Router();

ticketController.get("/", async (req: Request, res: Response) => {
  try {
    console.log(req.token);
    const tickets = await ticketService.get();
    res.status(200).send(tickets);
  } catch (error) {
    res.status(500).send(error);
  }
});

ticketController.get("/:ticketId", async (req: Request, res: Response) => {
  try {
    const tickets = await ticketService.getById(req.params.ticketId);
    res.status(200).send(tickets);
  } catch (error) {
    res.status(500).send(error);
  }
});

ticketController.post("/", async (req: Request, res: Response) => {
  try {
    const ticket = await ticketService.create(req.body);
    res.status(200).send(ticket);
  } catch (error) {
    res.status(500).send(error);
  }
});

ticketController.patch(
  "/:ticketId",
  adminRoute,
  async (req: Request, res: Response) => {
    try {
      const ticket = await ticketService.updateStatusById(
        req.params.ticketId,
        req.body
      );
      res.status(200).send(ticket);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export default ticketController;
