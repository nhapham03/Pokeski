<script setup lang="ts">
import { onMounted } from "vue";
import { useRaidBosses } from "./composables/useRaidBosses";
import BossCard from "./components/boss/BossCard.vue";

const { bosses, fetchBosses } = useRaidBosses();

onMounted(fetchBosses);
</script>

<template>
  <div class="grid grid-cols-2 gap-3 p-4">
    <BossCard
      v-for="boss in bosses"
      :key="boss.name + boss.tier"
      :boss="boss"
      @select="(b) => console.log('tapped', b.name)"
    />
  </div>
</template>
