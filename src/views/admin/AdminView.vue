<template>
  <div class="bg-[#181818] min-h-screen lazy-css">
    <h1 class="text-3xl font-bold mb-8">Admin View</h1>
    <div v-if="loading" class="text-center">Loading...</div>
    <!-- Loading wait screen -->
    <div v-else-if="error" class="text-center text-red-500"></div>
    <!-- Error message -->
    <div v-else class="flex flex-wrap -mx-2">
      <!-- add new product section -->
      <div class="my-8 p-2 w-full">
        <h2 class="text-2xl font-semibold mb-4">Add Product</h2>
        <form @submit.prevent="addProductHandler">
          <!-- Add product form -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              v-model="newProduct.name"
              type="text"
              placeholder="Name"
              class="p-2 border rounded"
            />
            <!-- Product name -->
            <span class="absolute text-red-500 text-xs ml-2"
              >Can't be empty</span
            >
            <!-- Error message & validate -->

            <input
              v-model="newProduct.description"
              type="text"
              placeholder="Description"
              class="p-2 border rounded"
            />
            <!-- Product description -->
            <div class="p-2 border rounded">
              <span class="uppercase font-bold">Product Price: </span>
              <input
                v-model="newProduct.price"
                type="number"
                placeholder="Price"
                class="pl-2"
              />
              <!-- Product price -->
            </div>
            <div class="p-2 border rounded">
              <span class="uppercase font-bold">Product Stock: </span>
              <input
                v-model="newProduct.stock"
                type="number"
                placeholder="Stock"
                class="pl-2"
              />
              <!-- Product stock -->
            </div>
            <div class="p-2 border rounded flex items-center">
              <input
                v-model="newProduct.isOnDiscount"
                type="checkbox"
                class="border rounded w-6 h-6 mr-2"
              />
              <span class="uppercase font-bold">Discount in %:</span>
              <!-- Discount in % -->
              <input
                v-model="newProduct.discountPct"
                type="number"
                placeholder="Discount %"
                class="ml-2 pl-2"
              />
              <!-- Discount % -->
            </div>
            <div class="p-2 border rounded flex items-center">
              <input
                v-model="newProduct.isHidden"
                type="checkbox"
                class="p-2 border rounded w-6 h-6 mr-2"
              />
              <span class="uppercase font-bold">Hidden product</span>
              <!-- Hidden product -->
            </div>
            <input
              v-model="newProduct.imageURL"
              type="text"
              placeholder="Image URL"
              class="p-2 border rounded h-10"
            />
            <!-- Image URL -->
          </div>
          <button
            type="submit"
            class="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Create
          </button>
        </form>
      </div>

      <!-- Edit existing products -->
      <div class="my-8 p-2 w-full">
        <h2 class="text-2xl font-semibold mb-4">Products</h2>
        <div
          class="mb-4 p-4 border rounded bg-[#181818]"
          v-for="product in products"
          :key="product._id"
        >
          <!-- Loop through the products -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              v-model="product.name"
              placeholder="Name"
              class="p-2 border rounded"
            />
            <!-- Product name -->
            <input
              type="text"
              v-model="product.description"
              placeholder="Description"
              class="p-2 border rounded"
            />
            <!-- Product description -->
            <div class="p-2 border rounded">
              <span class="uppercase font-bold">Product Price: </span>
              <input
                type="number"
                v-model="product.price"
                placeholder="Price"
                class="pl-2"
              />
              <!-- Product price -->
            </div>
            <div class="p-2 border rounded">
              <span class="uppercase font-bold">Product Stock: </span>
              <input
                type="number"
                v-model="product.stock"
                placeholder="Stock"
                class="pl-2"
              />
              <!-- Product stock -->
            </div>
            <div class="p-2 border rounded flex items-center">
              <input
                type="checkbox"
                v-model="product.isOnDiscount"
                class="border rounded w-6 h-6 mr-2"
              />
              <span class="uppercase font-bold">Discount in %:</span>
              <!-- Discount in % -->
              <input
                type="number"
                v-model="product.discountPct"
                placeholder="Discount %"
                class="ml-2 pl-2"
              />
              <!-- Discount % -->
            </div>
            <div class="p-2 border rounded flex items-center">
              <input
                type="checkbox"
                v-model="product.isHidden"
                class="p-2 border rounded w-6 h-6 mr-2"
              />
              <span class="uppercase font-bold">Hidden product</span>
              <!-- Hidden product -->
            </div>
            <input
              type="text"
              placeholder="Image URL"
              v-model="product.imageURL"
              class="p-2 border rounded h-10"
            />
            <!-- Image URL -->
            <span>
              Thumbnail img:
              <img
                alt="Product Image"
                :src="product.imageURL"
                class="w-full h-24 object-cover mb-4 rounded-lg"
              />
              <!-- Product image -->
            </span>
          </div>

          <div class="mt-4 flex space-x-2">
            <!-- Update and delete buttons -->
            <p>ID:</p>
            <!-- Product ID for testing -->
            <button
              class="bg-red-600 text-white p-2 rounded hover:bg-red-700"
              @click="deleteProduct(product._id)"
            >
              Delete
            </button>
            <!-- Delete button -->
            <button
              class="bg-green-600 text-white p-2 rounded hover:bg-green-700"
              @click="updateProductHandler(product)"
            >
              Edit
            </button>
            <!-- Edit button -->
          </div>
        </div>
      </div>
    </div>
    <!-- Custom confirmation dialog -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useProducts } from "@/modules/UseProducts";
import type { Product } from "../../interfaces/interfaces";

const {
  products,
  error,
  loading,
  fetchProducts,
  deleteProduct,
  addProduct,
  getTokenAndUserId,
  updateProduct,
} = useProducts();

onMounted(() => {
  fetchProducts();
});

const newProduct = ref({
  name: "",
  description: "",
  price: 0,
  stock: 0,
  isOnDiscount: false,
  discountPct: 0,
  isHidden: false,
  imageURL: "",
  _createdBy: "",
});

const addProductHandler = async () => {
  const { userId } = getTokenAndUserId();
  newProduct.value._createdBy = userId;
  await addProduct(newProduct.value);
  newProduct.value = {
    ...newProduct.value,
  };
};

const updateProductHandler = async (product: Product) => {
  const updatedProduct = {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    isOnDiscount: product.isOnDiscount,
    discountPct: product.discountPct,
    isHidden: product.isHidden,
    imageURL: product.imageURL,
  };
  await updateProduct(product._id, updatedProduct);
};
</script>

<style scoped>
input {
  background-color: #2b2b2b;
}

.lazy-css {
  color: #969696;
}

input[type="checkbox"] {
  accent-color: var(--input-field-color);
}
</style>
