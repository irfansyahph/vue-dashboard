<script setup lang="ts">
import { RouterView } from "vue-router";
import Sidebar from "./components/Sidebar.vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col bg-gray-100">
      <Header />
      <div class="flex-1 p-6 overflow-auto">
        <RouterView />
      </div>
      <!-- <Footer /> -->
    </div>
  </div>
</template>
