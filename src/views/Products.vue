<script setup lang="ts">
import Table from "../components/Table.vue";
import { useProductStore } from "../stores/product";
import { onMounted, watch, ref } from "vue";
import { debounce } from "lodash";
import { useRoute, useRouter } from "vue-router";

const productStore = useProductStore();
const searchQuery = ref("");
const route = useRoute();
const router = useRouter();

onMounted(() => {
  const { search, offset, limit } = route.query;

  if (search) {
    searchQuery.value = search as string;
    productStore.setSearch(searchQuery.value);
  }
  if (offset) {
    productStore.offset = Number(offset);
  }
  if (limit) {
    productStore.setLimit(Number(limit));
  }

  productStore.fetchProducts();
});

const debouncedSearch = debounce(() => {
  productStore.setSearch(searchQuery.value);
  updateQueryParams();
}, 500);

watch(searchQuery, () => {
  debouncedSearch();
});

const filterLimit = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  productStore.setLimit(Number(target.value));
  updateQueryParams();
};

const updateQueryParams = () => {
  router.replace({
    query: {
      search: searchQuery.value || undefined,
      offset: productStore.offset.toString(),
      limit: productStore.limit.toString(),
    },
  });
};

watch(
  () => productStore.offset,
  () => {
    updateQueryParams();
  }
);
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search by Product Name"
      class="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-3xs"
    />
    <button
      @click="$router.push('/create-product')"
      class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Create Product
    </button>
  </div>

  <Table
    :headers="['No.', 'Name', 'Action']"
    :items="
      productStore.filteredProducts.map((product, index) => ({
        idx: index + 1 + productStore.offset,
        id: product.id,
        nama: product.title,
      }))
    "
    :actionType="['edit', 'delete']"
    redirectPath="/edit-product"
    :loading="productStore.loading"
    :error="productStore.error"
  />

  <div class="flex justify-between items-center mt-4">
    <div class="flex items-center gap-2">
      <label for="limit" class="text-sm font-medium text-gray-700">Limit:</label>
      <select
        id="limit"
        @change="filterLimit"
        :value="productStore.limit"
        class="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
    </div>

    <div class="flex gap-4">
      <button
        @click="productStore.prevPage"
        :disabled="!productStore.previous"
        class="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
      >
        Previous
      </button>

      <button
        @click="productStore.nextPage"
        :disabled="!productStore.next"
        class="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
      >
        Next
      </button>
    </div>
  </div>
</template>
