import express, { Request, Response, Router } from "express";
import { adminRoute } from "../middleware/adminRoute";
import ticketService from "../service/ticketService";

const ticketController: Router = express.Router();

ticketController.get("/", adminRoute, async (req: Request, res: Response) => {
  try {
    const tickets = await ticketService.get();
    res.status(200).send(tickets);
  } catch (error) {
    res.status(500).send(error);
  }
});

ticketController.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    if (!req.token) {
      res.status(401).send("User not logged in.");
      return;
    }
    if (req.token.id !== req.params.userId) {
      res.status(401).send("Unauthorized.");
      return;
    }
    const ticket = await ticketService.getByUserId(req.token.id);
    res.status(200).send(ticket);
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
