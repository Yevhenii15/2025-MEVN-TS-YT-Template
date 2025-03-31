export interface Product {
  _id: string;
  name: string;
  description: string;
  imageURL: string;
  price: number;
  stock: number;
  isOnDiscount: boolean;
  discountPct: number;
  isHidden: boolean;
  _createdBy: string;
}
/* export type newProduct = Omit<Product, "_id"> & Partial<Pick<Product, "_createdBy">>;
 */
export type newProduct = Omit<Product, "_id"> & {
  _createdBy?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  registerDate: string;
};

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageURL: string;
};

export type OrderItems = {
  _id: string;
  orderDate: string;
  total: number;
  userName: string;
  orderStatus: string;
  ordernumber: number;
  orderLine: Array<{ product: Product; quantity: number }>;
};
