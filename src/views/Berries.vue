<script setup lang="ts">
import Table from "../components/Table.vue";
import { useBerryStore } from "../stores/berry";
import { onMounted, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { debounce } from "lodash";

const berryStore = useBerryStore();
const route = useRoute();
const router = useRouter();
const searchQuery = ref("");

const extractBerryId = (url: string): number => {
  const match = url.match(/berry\/(\d+)\//);
  return match ? parseInt(match[1]) : 0;
};

const debouncedSearch = debounce(async () => {
  if (searchQuery.value) {
    await berryStore.fetchBerryByName(searchQuery.value);
    console.log("Berry Search Result:", berryStore.berries);
  } else {
    berryStore.fetchBerries(0, berryStore.limit);
  }
}, 500);

watch(searchQuery, () => {
  debouncedSearch();
});

onMounted(() => {
  const offset = parseInt(route.query.offset as string) || 0;
  if (route.query.limit) {
    const limit = parseInt(route.query.limit as string);
    berryStore.limit = limit;
  } else {
    berryStore.limit = 10;
  }
  berryStore.fetchBerries(offset, berryStore.limit);
});

const handlePagination = (offset: number) => {
  router.push({ query: { offset: offset.toString(), limit: berryStore.limit.toString() } });
  berryStore.fetchBerries(offset, berryStore.limit);
};

const filterLimit = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  berryStore.limit = parseInt(target.value);
  handlePagination(0);
};

watch(
  () => route.query.limit,
  (newLimit) => {
    if (newLimit) {
      berryStore.limit = parseInt(newLimit as string);
    }
  }
);
</script>

<template>
  <div class="mb-4">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search by Berry Name"
      class="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-3xs"
    />
  </div>

  <Table
    :headers="['No.', 'Name', 'Action']"
    :items="
      berryStore.berries.map((berry, index) => ({
        idx: index + 1 + berryStore.offset,
        id: extractBerryId(berry.url),
        nama: berry.name,
      }))
    "
    :actionType="['detail']"
    redirectPath="/detail-berry"
    :loading="berryStore.loading"
    :error="berryStore.error"
  />

  <div class="flex justify-between items-center mt-4">
    <div class="flex items-center gap-2">
      <label for="limit" class="text-sm font-medium text-gray-700">Limit:</label>
      <select
        id="limit"
        @change="filterLimit"
        :value="berryStore.limit"
        class="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option :value="10">10</option>
        <option :value="30">30</option>
        <option :value="50">50</option>
      </select>
    </div>

    <div v-if="berryStore.count > berryStore.limit" class="flex gap-4">
      <button
        :disabled="!berryStore.previous"
        @click="handlePagination(berryStore.offset - berryStore.limit)"
        class="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
      >
        Previous
      </button>
      <button
        :disabled="!berryStore.next"
        @click="handlePagination(berryStore.offset + berryStore.limit)"
        class="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
      >
        Next
      </button>
    </div>
  </div>
</template>
