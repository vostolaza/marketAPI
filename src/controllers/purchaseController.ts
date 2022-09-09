import express, { Request, Response, Router } from "express";
import { adminRoute } from "../middleware/adminRoute";
import purchaseService from "../service/purchaseService";

const purchaseController: Router = express.Router();

purchaseController.get("/", adminRoute, async (req: Request, res: Response) => {
  try {
    const purchases = await purchaseService.get();
    res.status(200).send(purchases);
  } catch (error) {
    res.status(500).send(error);
  }
});

purchaseController.get("/:purchaseId", async (req: Request, res: Response) => {
  try {
    if (!req.token) {
      res.status(401).send("User not logged in.");
      return;
    }
    const purchase = await purchaseService.getById(
      req.params.purchaseId,
      req.token.id
    );
    if (purchase === null) {
      res.status(404).send();
    } else {
      res.status(200).send(purchase);
    }
  } catch (error) {
    res.status(500).send("a");
  }
});

purchaseController.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    if (!req.token) {
      res.status(401).send("User not logged in.");
      return;
    }
    if (req.token.id !== req.params.userId) {
      res.status(401).send("Unauthorized.");
      return;
    }
    const purchases = await purchaseService.getByUserId(req.token.id);
    res.status(200).send(purchases);
  } catch (error) {
    res.status(500).send(error);
  }
});

purchaseController.post("/", async (req: Request, res: Response) => {
  try {
    const [validPurchase, purchaseItems, purchaseTotal] =
      await purchaseService.validatePurchase(req.body.items);
    console.log(
      "valid:",
      validPurchase,
      "\nitems:",
      purchaseItems,
      "total:",
      purchaseTotal
    );

    if (validPurchase) {
      await purchaseService.reduceStock(req.body.items);
      const purchase = await purchaseService.create(
        req.body,
        purchaseItems,
        purchaseTotal
      );
      res.status(200).send(purchase);
    } else {
      res.status(400).send({ error: "Invalid purchase." });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

export default purchaseController;
