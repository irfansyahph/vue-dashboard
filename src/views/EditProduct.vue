<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "../stores/product";

const route = useRoute();
const router = useRouter();
const store = useProductStore();

const product = reactive({
  title: "",
  price: 0.1,
  description: "",
  category: "",
  image: "",
});

onMounted(async () => {
  const productId = Number(route.params.id);
  const fetchedProduct = await store.fetchDetailProduct(productId);
  if (fetchedProduct) {
    Object.assign(product, fetchedProduct);
  }
});

const submitProduct = async () => {
  const productId = Number(route.params.id);
  await store.updateProduct(productId, product);
  router.push("/products");
};
</script>

<template>
  <div class="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl">
    <h2 class="text-2xl font-bold mb-4">Edit Product</h2>
    <form @submit.prevent="submitProduct" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Title</label>
        <input
          v-model="product.title"
          type="text"
          class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Price</label>
        <input
          v-model="product.price"
          type="number"
          step="0.1"
          class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Description</label>
        <textarea
          v-model="product.description"
          class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
          required
        ></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Category</label>
        <input
          v-model="product.category"
          type="text"
          class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Image URL</label>
        <input
          v-model="product.image"
          type="url"
          class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="store.loading"
      >
        {{ store.loading ? "Updating..." : "Update Product" }}
      </button>
      <p v-if="store.error" class="text-red-500 mt-2">{{ store.error }}</p>
    </form>
  </div>
</template>
