<script setup lang="ts">
const selected = defineModel<string>({ required: true });

const TABS = [
  { label: "All", value: "All" },
  { label: "1★", value: "1-Star Raids" },
  { label: "3★", value: "3-Star Raids" },
  { label: "5★", value: "5-Star Raids" },
  { label: "Mega", value: "Mega Raids" },
];
</script>

<template>
  <div class="flex gap-2 overflow-x-auto px-4 py-2">
    <button
      v-for="tab in TABS"
      :key="tab.value"
      type="button"
      :aria-pressed="selected === tab.value"
      class="shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95"
      :class="
        selected === tab.value
          ? 'border-pink-400 bg-pink-400 text-white'
          : 'border-pink-200 bg-pink-50 text-pink-700'
      "
      @click="selected = tab.value"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
