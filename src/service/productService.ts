import { CallbackError, Document } from "mongoose";
import Product from "../models/Product";
import { ProductDTO } from "../utils/dtos/product";

type MongoosePurchaseQueryResult =
  | (Document<any, any, ProductDTO> & ProductDTO & { _id: string })
  | null;

const productService = {
  create: async (product: ProductDTO): Promise<ProductDTO> => {
    return new Promise<ProductDTO>((resolve, reject) => {
      Product.create(product, (err: CallbackError, newProduct: ProductDTO) => {
        if (err) {
          reject(err);
        }
        resolve(newProduct);
      });
    });
  },
  get: async (): Promise<ProductDTO[]> => {
    return new Promise<ProductDTO[]>((resolve, reject) => {
      Product.find({}, (err: CallbackError, products: ProductDTO[]) => {
        if (err) {
          reject(err);
        }
        resolve(products);
      });
    });
  },
  getById: async (productId): Promise<ProductDTO> => {
    return new Promise<ProductDTO>((resolve, reject) => {
      Product.findOne(
        { _id: productId },
        (err: CallbackError, product: ProductDTO) => {
          if (err) {
            reject(err);
          }
          resolve(product);
        }
      );
    });
  },
  updateById: async (productId, productData): Promise<ProductDTO> => {
    return new Promise<ProductDTO>((resolve, reject) => {
      Product.findOneAndUpdate(
        { _id: productId },
        { ...productData },
        { new: true, upsert: true },
        (err: CallbackError, product: ProductDTO) => {
          if (err) {
            reject(err);
          }
          resolve(product);
        }
      );
    });
  },
  deleteById: async (productId): Promise<ProductDTO> => {
    return new Promise<ProductDTO>((resolve, reject) => {
      Product.findOneAndDelete(
        { _id: productId },
        (err: CallbackError, product: ProductDTO) => {
          if (err) {
            reject(err);
          }
          resolve(product);
        }
      );
    });
  },
};

export default productService;
