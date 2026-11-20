<script setup lang="ts">
import { computed, ref } from "vue";
import type { RaidBoss } from "../../types/pokemon";
import type { PokemonTypeName } from "../../utils/typeChart";
import TypeBadge from "../shared/TypeBadge.vue";

const props = defineProps<{
  boss: RaidBoss;
}>();

const emit = defineEmits<{
  select: [boss: RaidBoss];
}>();

const tierLabel = computed(() =>
  props.boss.tier.startsWith("Mega") ? "Mega" : props.boss.tier.charAt(0) + "★",
);

// shiny picture = same URL with ".s" added before ".icon.png"
const shinyImage = computed(() =>
  props.boss.image.replace(".icon.png", ".s.icon.png"),
);

// if the shiny picture doesn't exist, hide it instead of showing a broken image
const shinyFailed = ref(false);
</script>

<template>
  <button
    type="button"
    class="flex w-full flex-col items-center gap-2 rounded-2xl border border-pink-200 bg-pink-50 p-3 text-center shadow-sm transition active:scale-95"
    @click="emit('select', boss)"
  >
    <div class="flex w-full items-center justify-center gap-1">
      <img
        :src="boss.image"
        :alt="boss.name"
        class="aspect-square min-w-0 max-w-44 flex-1 object-contain"
      />
      <div
        v-if="boss.canBeShiny && !shinyFailed"
        class="relative min-w-0 max-w-44 flex-1"
      >
        <img
          :src="shinyImage"
          :alt="'Shiny ' + boss.name"
          class="aspect-square w-full object-contain"
          @error="shinyFailed = true"
        />
        <span class="absolute right-0 top-0 text-sm">✨</span>
      </div>
    </div>

    <h2 class="text-sm font-bold text-pink-900">{{ boss.name }}</h2>

    <span
      class="rounded-full bg-pink-400 px-2 py-0.5 text-xs font-semibold text-white"
    >
      {{ tierLabel }}
    </span>

    <div class="flex flex-wrap justify-center gap-1">
      <TypeBadge
        v-for="t in boss.types"
        :key="t.name"
        :type="t.name as PokemonTypeName"
      />
    </div>

    <p class="text-xs text-pink-900">
      CP {{ boss.combatPower.normal.min }} – {{ boss.combatPower.normal.max }}
    </p>
    <p class="text-xs text-pink-700">
      CP {{ boss.combatPower.boosted.min }} –
      {{ boss.combatPower.boosted.max }} ☁️
    </p>
  </button>
</template>
