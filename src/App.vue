<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRaidBosses } from "./composables/useRaidBosses";
import TierFilter from "./components/boss/TierFilter.vue";
import BossCard from "./components/boss/BossCard.vue";

const { bosses, fetchBosses, getByTier } = useRaidBosses();
const selectedTier = ref("All");

onMounted(fetchBosses);
</script>

<template>
  <TierFilter v-model="selectedTier" />

  <p class="px-4 text-sm text-pink-700">
    {{ getByTier(selectedTier).length }} active raids
  </p>

  <div class="grid grid-cols-2 gap-3 p-4">
    <BossCard
      v-for="boss in getByTier(selectedTier)"
      :key="boss.name + boss.tier"
      :boss="boss"
      @select="(b) => console.log('tapped', b.name)"
    />
  </div>
</template>
