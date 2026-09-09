import { ref } from "vue";
import type {
  Counter,
  PokedexEntry,
  PokemonMove,
  RaidBoss,
} from "../types/pokemon";
import { getTypeEffectiveness, type PokemonTypeName } from "../utils/typeChart";

const POKEDEX_URL =
  "https://pokemon-go-api.github.io/pokemon-go-api/api/pokedex.json";

// Kept outside useCounters() so every component sharing this composable hits
// the same cache - the dex only gets fetched once per page load.
let pokedexCache: PokedexEntry[] | null = null;

/** Fetches the Pokedex once, then just returns the cached copy. */
async function fetchPokedex(): Promise<PokedexEntry[]> {
  if (pokedexCache) return pokedexCache;
  const response = await fetch(POKEDEX_URL);
  const data: PokedexEntry[] = await response.json();
  pokedexCache = data;
  return data;
}

/**
 * Finds the best move in a moveset (quick or charged) against the boss's
 * type(s) - ties go to whichever move has more raw power.
 * Returns null if the Pokemon has no moves in this set.
 */
function bestMove(
  moves: Record<string, PokemonMove>,
  bossTypes: PokemonTypeName[],
) {
  let best: { move: PokemonMove; multiplier: number } | null = null;

  for (const move of Object.values(moves)) {
    const moveType = move.type.names.English as PokemonTypeName;
    const multiplier = getTypeEffectiveness(moveType, bossTypes);

    if (
      !best ||
      multiplier > best.multiplier ||
      (multiplier === best.multiplier && move.power > best.move.power)
    ) {
      best = { move, multiplier };
    }
  }

  return best;
}

/**
 * Calculates the top 8 counters for a boss. Call findCounters(boss) when a
 * boss card is tapped - counters updates reactively once it's done.
 */
export function useCounters() {
  const counters = ref<Counter[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function findCounters(boss: RaidBoss) {
    loading.value = true;
    error.value = null;

    try {
      const dex = await fetchPokedex();
      const bossTypes = boss.types.map((t) => t.name as PokemonTypeName);

      const results: Counter[] = [];

      // Score every Pokémon in the Pokédex against this boss.
      for (const pokemon of dex) {
        const fast = bestMove(pokemon.quickMoves, bossTypes);
        const charged = bestMove(pokemon.cinematicMoves, bossTypes);
        if (!fast || !charged) continue; // skip entries with no usable moveset

        // use whichever move (fast or charged) hits harder
        const multiplier = Math.max(fast.multiplier, charged.multiplier);
        results.push({
          pokemon,
          bestFastMove: fast.move,
          bestChargedMove: charged.move,
          multiplier,
          // tiebreak for Pokémon that land on the same multiplier
          score: pokemon.stats.attack * multiplier,
        });
      }

      counters.value = results
        .filter((r) => r.multiplier > 1) // not super effective, don't bother
        .sort((a, b) => b.multiplier - a.multiplier || b.score - a.score)
        .slice(0, 8); // top 8, per the README
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : "Failed to calculate counters";
    } finally {
      loading.value = false;
    }
  }

  return { counters, loading, error, findCounters };
}
