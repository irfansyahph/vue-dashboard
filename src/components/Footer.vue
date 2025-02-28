<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="bg-gray-400 text-white p-4 text-center shadow-md">
    <div>© {{ year }} Dashboard. All Rights Reserved.</div>
  </footer>
</template>
