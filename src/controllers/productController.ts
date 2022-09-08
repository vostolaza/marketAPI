import express, { Request, response, Response, Router } from "express";
import productService from "../service/productService";

const productController: Router = express.Router();

productController.get("/", async (req: Request, res: Response) => {
  try {    
    const purchases = await productService.get();
    res.status(200).send(purchases);
  } catch (error) {
    response.status(500).send(error);
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
    response.status(500).send(error);
  }
});

productController.post("/", async (req: Request, res: Response) => {
  try {
    const purchases = await productService.create(req.body);
    res.status(200).send(purchases);
  } catch (error) {
    response.status(500).send(error);
  }
});

productController.patch("/:productId", async (req: Request, res: Response) => {
  try {
    const purchases = await productService.updateById(
      req.params.productId,
      req.body
    );
    res.status(200).send(purchases);
  } catch (error) {
    response.status(404).send({ error: "Product not found." });
  }
});

productController.delete("/:productId", async (req: Request, res: Response) => {
  try {
    await productService.deleteById(req.params.productId);
    res.status(204).send();
  } catch (error) {
    response.status(404).send({ error: "Product not found." });
  }
});

export default productController;
