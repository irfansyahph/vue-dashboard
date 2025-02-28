<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const routes = [
  { name: "Berries", path: "/berries", activeNav: "berries" },
  { name: "Products", path: "/products", activeNav: "products" },
];

const goHome = () => {
  router.push("/");
};
</script>

<template>
  <div class="w-64 h-screen bg-gray-600 text-white">
    <div class="p-4 text-2xl font-bold cursor-pointer" @click="goHome">Dashboard</div>
    <nav class="mt-6">
      <ul>
        <li v-for="item in routes" :key="item.name">
          <RouterLink
            :to="item.path"
            class="block p-3 hover:bg-gray-700 transition rounded"
            :class="{ 'bg-gray-700': route.meta?.activeNav === item.activeNav }"
          >
            {{ item.name }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
nav ul {
  list-style: none;
  padding: 0;
}
</style>
