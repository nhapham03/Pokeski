<script setup lang="ts">
import type { RaidBoss } from "../../types/pokemon";
import BossCard from "./BossCard.vue";

defineProps<{
  bosses: RaidBoss[];
}>();

const emit = defineEmits<{
  select: [boss: RaidBoss];
}>();
</script>
<template>
  <section>
    <p class="px-4 text-sm text-pink-700">
      {{ bosses.length }} active {{ bosses.length === 1 ? "raid" : "raids" }}
    </p>

    <p v-if="bosses.length === 0" class="p-8 text-center text-pink-700">
      No raid bosses in this tier right now.
    </p>

    <div v-else class="grid grid-cols-2 gap-3 p-4">
      <BossCard
        v-for="boss in bosses"
        :key="boss.name + boss.tier"
        :boss="boss"
        @select="emit('select', $event)"
      />
    </div>
  </section>
</template>
