import { ref } from "vue";
import type { Product } from "../interfaces/interfaces";

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

  return {
    error,
    loading,
    products,
    fetchProducts,
  };
};
