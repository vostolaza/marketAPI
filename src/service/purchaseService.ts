import { CallbackError, Document, ObjectId } from "mongoose";
import { ProductDTO } from "../utils/dtos/product";
import Product from "../models/Product";
import Purchase from "../models/Purchase";

import { PurchaseDTO } from "../utils/dtos/purchase";

type MongoosePurchaseQueryResult =
  | (Document<any, any, PurchaseDTO> & PurchaseDTO & { _id: string })
  | null;

const purchaseService = {
  create: async (
    purchase: PurchaseDTO,
    purchaseItems: Array<any>,
    purchaseTotal: Number
  ): Promise<PurchaseDTO> => {
    return new Promise<PurchaseDTO>((resolve, reject) => {
      Purchase.create(
        { ...purchase, items: purchaseItems, purchaseTotal },
        (err: CallbackError, newPurchase: PurchaseDTO) => {
          if (err) {
            reject(err);
          }
          resolve(newPurchase);
        }
      );
    });
  },
  validatePurchase: async (items: Array<any>): Promise<Array<any>> => {
    return new Promise<Array<any>>(async (resolve, reject) => {
      const sortedItems = items.sort(({ productId: idA }, { productId: idB }) =>
        idA > idB ? 1 : idB > idA ? -1 : 0
      );
      const products = await Product.find({
        _id: { $in: items.map(({ productId }) => productId) },
      });
      const sortedProducts = products.sort(({ _id: idA }, { _id: idB }) =>
        idA > idB ? 1 : idB > idA ? -1 : 0
      );
      let valid = items.length > 0;
      let purchaseTotal = 0;
      for (var i = 0; i < sortedProducts.length; i++) {
        valid =
          valid &&
          sortedItems[i].quantity > 0 &&
          sortedProducts[i].stock >= sortedItems[i].quantity;
        sortedItems[i].price =
          (sortedProducts[i].price as number) * sortedItems[i].quantity;
        sortedItems[i].name = sortedProducts[i].name;
        sortedItems[i].description = sortedProducts[i].description;
        purchaseTotal =
          purchaseTotal +
          (sortedProducts[i].price as number) * sortedItems[i].quantity;
      }

      resolve([valid, sortedItems, purchaseTotal]);
    });
  },
  reduceStock: async (items: Array<any>) => {
    items.forEach(async ({ productId, quantity }) => {
      await Product.findOneAndUpdate(
        { _id: productId },
        { $inc: { stock: -quantity } },
        { new: true, upsert: true }
      );
    });
  },
  get: async (): Promise<PurchaseDTO[]> => {
    return new Promise<PurchaseDTO[]>((resolve, reject) => {
      Purchase.find({}, (err: CallbackError, purchases: PurchaseDTO[]) => {
        if (err) {
          reject(err);
        }
        resolve(purchases);
      }).populate({ path: "items.productId", model: Product });
    });
  },
  getById: async (purchaseId: string, userId: string): Promise<PurchaseDTO> => {
    return new Promise<PurchaseDTO>((resolve, reject) => {
      Purchase.findOne(
        { _id: purchaseId, userId },
        (err: CallbackError, purchase: PurchaseDTO) => {
          if (err) {
            reject(err);
          }
          resolve(purchase);
        }
      ).populate({ path: "items.productId", model: Product });
    });
  },
  getByUserId: async (userId): Promise<any> => {
    return new Promise<PurchaseDTO>((resolve, reject) => {
      Purchase.find({ userId }, (err: CallbackError, purchase: PurchaseDTO) => {
        if (err) {
          reject(err);
        }
        resolve(purchase);
      }).populate({ path: "items.productId", model: Product });
    });
  },
};

export default purchaseService;
