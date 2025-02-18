export interface Product {
  id: string;
  name: string;
  description: string;
  imageURL: string;
  price: number;
  stock: number;
  isOnDiscount: boolean;
  discountPct: number;
  isHidden: boolean;
  _createdBy: string;
  __v: number;
}
