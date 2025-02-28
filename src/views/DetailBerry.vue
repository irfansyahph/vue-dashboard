<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useBerryStore } from "../stores/berry";

const router = useRouter();
const store = useBerryStore();
const berry = reactive({
  firmness: "",
  flavors: "",
  naturalGiftPower: 0,
});

onMounted(async () => {
  await store.fetchDetailBerry("https://pokeapi.co/api/v2/berry/cheri");
  if (store.berryDetail) {
    berry.firmness = store.berryDetail.firmness.name;
    berry.flavors = store.berryDetail.flavors
      .map((f) => `${f.flavor.name} (${f.potency})`)
      .join(", ");
    berry.naturalGiftPower = store.berryDetail.natural_gift_power;
  }
});

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
    <h2 class="text-2xl font-bold mb-4">Berry Detail</h2>
    <div v-if="store.berryDetail" class="mt-4 p-4 border rounded-lg bg-gray-100">
      <p><strong>Firmness:</strong> {{ berry.firmness }}</p>
      <p><strong>Flavors:</strong> {{ berry.flavors }}</p>
      <p><strong>Natural Gift Power:</strong> {{ berry.naturalGiftPower }}</p>
    </div>
    <p v-if="store.error" class="text-red-500 mt-2">{{ store.error }}</p>
    <button @click="goBack" class="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 cursor-pointer hover:bg-blue-600">
      Go Back
    </button>
  </div>
</template>
