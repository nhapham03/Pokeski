<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRaidBosses } from "./composables/useRaidBosses";
import TierFilter from "./components/boss/TierFilter.vue";
import BossGrid from "./components/boss/BossGrid.vue";

const { fetchBosses, getByTier } = useRaidBosses();
const selectedTier = ref("All");

onMounted(fetchBosses);
</script>

<template>
  <TierFilter v-model="selectedTier" />
  <BossGrid
    :bosses="getByTier(selectedTier)"
    @select="(b) => console.log('tapped', b.name)"
  />
</template>
