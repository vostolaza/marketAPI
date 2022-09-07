import { CallbackError, Document, ObjectId } from "mongoose";
import { ProductDTO } from "../utils/dtos/product";
import Product from "../models/Product";
import Purchase from "../models/Purchase";

import { PurchaseDTO } from "../utils/dtos/purchase";

type MongoosePurchaseQueryResult =
  | (Document<any, any, PurchaseDTO> & PurchaseDTO & { _id: string })
  | null;

const purchaseService = {
  create: async (purchase: PurchaseDTO): Promise<PurchaseDTO> => {
    return new Promise<PurchaseDTO>((resolve, reject) => {
      Purchase.create(
        purchase,
        (err: CallbackError, newPurchase: PurchaseDTO) => {
          if (err) {
            reject(err);
          }
          resolve(newPurchase);
        }
      );
    });
  },
  validatePurchase: async (items: Array<any>): Promise<Boolean> => {
    return new Promise<Boolean>(async (resolve, reject) => {
      const sortedItems = items.sort(({ productId: idA }, { productId: idB }) =>
        idA > idB ? 1 : idB > idA ? -1 : 0
      );
      const products = await Product.find({
        _id: { $in: items.map(({ productId }) => productId) },
      });
      const sortedProducts = products.sort(({ _id: idA }, { _id: idB }) =>
        idA > idB ? 1 : idB > idA ? -1 : 0
      );
      let valid = true;
      for (var i = 0; i < sortedProducts.length; i++) {
        valid = valid && sortedProducts[i].stock >= sortedItems[i].quantity;
      }
      resolve(valid);
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
  getById: async (purchaseId): Promise<PurchaseDTO> => {
    return new Promise<PurchaseDTO>((resolve, reject) => {
      Purchase.findOne(
        { _id: purchaseId },
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
