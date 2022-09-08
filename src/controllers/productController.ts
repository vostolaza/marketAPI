import express, { Request, Response, Router } from "express";
import { JwtPayload } from "jsonwebtoken";
import { USER_ROLES } from "../utils/constants/userRoles";
import productService from "../service/productService";
import { adminRoute } from "../middleware/adminRoute";

const productController: Router = express.Router();

productController.get("/", async (req: Request, res: Response) => {
  try {
    const purchases = await productService.get();
    res.status(200).send(purchases);
  } catch (error) {
    res.status(500).send(error);
  }
});

productController.get("/:productId", async (req: Request, res: Response) => {
  try {
    const product = await productService.getById(req.params.productId);
    if (product === null) {
      res.status(404).send();
    } else {
      res.status(200).send(product);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

productController.post("/", adminRoute, async (req: Request, res: Response) => {
  try {
    const purchases = await productService.create(req.body);
    res.status(200).send(purchases);
  } catch (error) {
    res.status(500).send(error);
  }
});

productController.patch(
  "/:productId",
  adminRoute,
  async (req: Request, res: Response) => {
    try {
      // if(req.token && req.token.role === USER_ROLES.CLIENT) {
      //   res.status(401).send({ error: "Unauthorized." });
      //   return;
      // }
      const purchases = await productService.updateById(
        req.params.productId,
        req.body
      );
      res.status(200).send(purchases);
    } catch (error) {
      res.status(404).send({ error: "Product not found." });
    }
  }
);

productController.delete(
  "/:productId",
  adminRoute,
  async (req: Request, res: Response) => {
    try {
      await productService.deleteById(req.params.productId);
      res.status(204).send();
    } catch (error) {
      res.status(404).send({ error: "Product not found." });
    }
  }
);

export default productController;
