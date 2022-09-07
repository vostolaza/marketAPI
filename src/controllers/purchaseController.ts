import express, { Request, response, Response, Router } from "express";
import purchaseService from "../service/purchaseService";

const purchaseController: Router = express.Router();

purchaseController.get("/", async (req: Request, res: Response) => {
  try {
    const purchases = await purchaseService.get();
    res.status(200).send(purchases);
  } catch (error) {
    response.status(500).send(error);
  }
});

purchaseController.get("/:purchaseId", async (req: Request, res: Response) => {
  try {
    const purchase = await purchaseService.getById(req.params.purchaseId);
    if (purchase === null) {
      res.status(404).send();
    } else {
      res.status(200).send(purchase);
    }
  } catch (error) {
    response.status(500).send(error);
  }
});

purchaseController.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const purchases = await purchaseService.getByUserId(req.params.userId);
    res.status(200).send(purchases);
  } catch (error) {
    response.status(500).send(error);
  }
});

purchaseController.post("/", async (req: Request, res: Response) => {
  try {
    const validPurchase = await purchaseService.validatePurchase(
      req.body.items
    );
    if (validPurchase) {
      await purchaseService.reduceStock(req.body.items);
      const purchase = await purchaseService.create(req.body);
      res.status(200).send(purchase);
    } else {
      res.status(400).send({ error: "Invalid purchase." });
    }
  } catch (error) {
    response.status(500).send(error);
  }
});

export default purchaseController;
