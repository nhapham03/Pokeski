<script setup lang="ts">
import { computed } from "vue";
import type { PokemonTypeName } from "../../utils/typeChart";

const props = defineProps<{
  type: PokemonTypeName;
}>();

const TYPE_COLORS: Record<PokemonTypeName, string> = {
  Normal: "bg-stone-400",
  Fire: "bg-orange-500",
  Water: "bg-blue-500",
  Electric: "bg-yellow-400",
  Grass: "bg-green-500",
  Ice: "bg-cyan-300",
  Fighting: "bg-red-700",
  Poison: "bg-purple-500",
  Ground: "bg-amber-600",
  Flying: "bg-indigo-300",
  Psychic: "bg-pink-500",
  Bug: "bg-lime-500",
  Rock: "bg-yellow-700",
  Ghost: "bg-violet-700",
  Dragon: "bg-indigo-600",
  Dark: "bg-stone-700",
  Steel: "bg-slate-400",
  Fairy: "bg-pink-300",
};

const colorClass = computed(() => TYPE_COLORS[props.type]);
</script>

<template>
  <span
    :class="colorClass"
    class="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
  >
    {{ type }}
  </span>
</template>
