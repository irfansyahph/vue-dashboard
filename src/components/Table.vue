<script setup lang="ts">
import { useRouter } from "vue-router";
import { useProductStore } from "../stores/product";

const props = defineProps<{
  headers: string[];
  items: { idx?: number; id: number; nama: string }[];
  actionType: ("detail" | "edit" | "delete")[];
  redirectPath?: string;
  loading?: boolean;
  error?: string;
}>();

const emit = defineEmits(["delete"]);
const router = useRouter();
const productStore = useProductStore();
const { deleteProduct } = productStore;

const handleRedirect = (id: number) => {
  if (props.redirectPath) {
    router.push(`${props.redirectPath}/${id}`);
  }
};

const handleDelete = async (id: number) => {
  await deleteProduct(id);
  emit("delete", id);
};
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm text-left border border-gray-300">
      <thead class="bg-gray-100 border-t border-b border-gray-300">
        <tr>
          <th v-for="(header, index) in headers" :key="index" class="p-3 text-center">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="headers.length" class="text-center p-3">
            <div class="animate-pulse">
              <div v-for="n in 5" :key="n" class="h-10 bg-gray-200 rounded mb-2"></div>
            </div>
          </td>
        </tr>
        <tr v-else-if="error">
          <td
            :colspan="headers.length"
            class="text-center p-3 text-red-500 border-t border-b border-gray-300"
          >
            {{ error }}
          </td>
        </tr>
        <tr v-else-if="items.length === 0">
          <td :colspan="headers.length" class="text-center p-3 border-t border-b border-gray-300">
            No data available
          </td>
        </tr>
        <template v-else>
          <tr v-for="item in items" :key="item.id" class="border-t border-b border-gray-300">
            <td class="p-2 text-center">{{ item.idx }}</td>
            <td class="p-2">{{ item.nama }}</td>
            <td class="p-2 text-center space-x-2">
              <button
                v-if="actionType.includes('detail')"
                @click="handleRedirect(item.id)"
                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer"
              >
                Detail
              </button>
              <button
                v-if="actionType.includes('edit')"
                @click="handleRedirect(item.id)"
                class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 cursor-pointer"
              >
                Edit
              </button>
              <button
                v-if="actionType.includes('delete')"
                @click="handleDelete(item.id)"
                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
              >
                Delete
              </button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
