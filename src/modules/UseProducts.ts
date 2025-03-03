import { ref } from "vue";
import type { Product } from "../interfaces/interfaces";
import type { newProduct } from "../interfaces/interfaces";

export const useProducts = () => {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const products = ref<Product[]>([]);

  const fetchProducts = async (): Promise<void> => {
    loading.value = true;

    try {
      const apiBaseUrl = import.meta.env.VITE_LOCAL_HOST_API;
      const response = await fetch(`${apiBaseUrl}/products`);
      if (!response.ok) {
        throw new Error("No data available");
      }

      const data: Product[] = await response.json();

      products.value = data;
      console.log("products fetched", products.value);
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false; // no matter what happens, loading will be set to false
    }
  };

  const getTokenAndUserId = (): { token: string; userId: string } => {
    const token = localStorage.getItem("lstoken");
    const userId = localStorage.getItem("userID");
    if (!token || !userId) {
      throw new Error("No token available");
    }
    if (!userId) {
      throw new Error("No user id available");
    }
    return { token, userId };
  };

  const validateProduct = (product: newProduct): void => {
    if (!product.name) {
      throw new Error("Product name is required");
    }
  };
  const setDefaultValues = (product: newProduct, userId: string) => {
    return {
      name: product.name,
      description:
        product.description || "New Product Description Product Value",
      imageURL: product.imageURL || "https://picsum.photos/800/600",
      price: product.price || 2,
      stock: product.stock || 45,
      isOnDiscount: product.isOnDiscount || false,
      discountPct: product.discountPct || 0,
      isHidden: product.isHidden || false,
      _createdBy: userId,
    };
  };
  const addProduct = async (product: newProduct): Promise<void> => {
    try {
      const { token, userId } = getTokenAndUserId();
      validateProduct(product);
      const productWithDefault = setDefaultValues(product, userId);

      const apiBaseUrl = import.meta.env.VITE_LOCAL_HOST_API;
      const response = await fetch(`${apiBaseUrl}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(productWithDefault),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "No data available");
      }

      const newProduct: Product = await response.json();
      products.value.push(newProduct);
      console.log("new product added", newProduct);
      await fetchProducts();
    } catch (err) {
      error.value = (err as Error).message;
    }
  };

  const deleteProductFromServer = async (
    id: string,
    token: string
  ): Promise<void> => {
    const apiBaseUrl = import.meta.env.VITE_LOCAL_HOST_API;
    const response = await fetch(`${apiBaseUrl}/products/${id}`, {
      method: "DELETE",
      headers: {
        "auth-token": token,
      },
    });
    if (!response.ok) {
      console.log("error deleting product");
      throw new Error("No data available");
    }
  };
  const removeProductFromState = (id: string): void => {
    products.value = products.value.filter((product) => product._id !== id);
    console.log("products deleted", id);
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      const { token } = getTokenAndUserId();
      await deleteProductFromServer(id, token);
      removeProductFromState(id);

      console.log("id test", id);
    } catch (err) {
      error.value = (err as Error).message;
    }
  };
  return {
    error,
    loading,
    products,
    fetchProducts,
    addProduct,
    deleteProduct,
    getTokenAndUserId,
  };
};
