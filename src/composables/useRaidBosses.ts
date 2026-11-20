import { ref } from "vue";
import type { RaidBoss } from "../types/pokemon";

const RAIDS_URL =
  "https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/raids.json";

export function useRaidBosses() {
  const bosses = ref<RaidBoss[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchBosses() {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(RAIDS_URL);
      const data: RaidBoss[] = await response.json();

      bosses.value = data.map((boss) => ({
        ...boss,
        types: boss.types.map((t) => ({
          ...t,
          name: t.name.charAt(0).toUpperCase() + t.name.slice(1), // capitalize type name
        })),
      }));
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : "Failed to fetch raid bosses";
    } finally {
      loading.value = false;
    }
  }

  function getByTier(tier: string) {
    if (tier === "All") return bosses.value;
    return bosses.value.filter((boss) => boss.tier === tier);
  }

  return { bosses, loading, error, fetchBosses, getByTier };
}
