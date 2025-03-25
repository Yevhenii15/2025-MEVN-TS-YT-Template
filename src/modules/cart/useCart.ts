import { ref } from "vue";
import type { CartItem } from "../../interfaces/interfaces";

export const useCart = () => {
  const cart = ref<CartItem[]>(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );

  const addToCart = (
    product: Omit<CartItem, "quantity">,
    quantity: number = 1
  ) => {
    const existingItem = cart.value.find((item) => item._id === product._id);

    if (existingItem) {
      // Increment the quantity by the specified amount
      existingItem.quantity += quantity;
      console.log("Updated existing cart", existingItem);
    } else {
      // Add a new product with the specified quantity
      cart.value.push({ ...product, quantity });
      console.log("Added new item to the cart", cart.value);
    }

    // Update localStorage when cart changes
    localStorage.setItem("cart", JSON.stringify(cart.value));
    console.log("Cart updated in localStorage", cart.value);
  };

  const removeFromCart = (productId: string) => {
    const existingItem = cart.value.find((item) => item._id === productId);
    if (existingItem) {
      cart.value = cart.value.filter((item) => item._id !== productId);
      localStorage.setItem("cart", JSON.stringify(cart.value));
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const item = cart.value.find((item) => item._id === productId);
    localStorage.setItem("cart", JSON.stringify(cart.value));
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        removeFromCart(productId);
      } else {
        localStorage.setItem("cart", JSON.stringify(cart.value));
      }
    }
    console.log("Updated quantity", quantity, "for product", productId);
  };

  const cartTotal = (): number => {
    return Number(
      cart.value
        .reduce((acc, item) => acc + item.price * item.quantity, 0)
        .toFixed(2)
    );
  };

  const cartTotalIndividualProduct = (productId: string): number => {
    const item = cart.value.find((item) => item._id === productId);
    return item ? item.price * item.quantity : 0;
  };

  const salesTax = (): number => {
    const taxRate = 0.25;
    return Math.round(cartTotal() * taxRate * 100) / 100;
  };

  const code = ref<string>("");

  const couponCodeDiscount = (codes: string, total: number): number => {
    const couponCodeAccepted = codes === "DISCOUNT";
    return couponCodeAccepted ? total * 0.1 : 0; // 10% discount
  };

  const grandTotal = (): number => {
    const total = cartTotal() + salesTax();
    const discount = couponCodeDiscount(code.value, total);

    return Number((total - discount).toFixed(2));
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartTotalIndividualProduct,
    salesTax,
    code,
    grandTotal,
  };
};
