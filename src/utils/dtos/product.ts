export interface ProductDTO {
  _id: string;
  name: string;
  description: string;
  stock: Number;
  save: () => Promise<void>;
}
