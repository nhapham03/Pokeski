// ScrapedDuck (raid boss list) shapes
// https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/raids.json

/** One active raid boss, as returned by ScrapedDuck. */
export interface RaidBoss {
  name: string;
  tier: string;
  canBeShiny: boolean;
  types: PokemonType[];
  combatPower: CombatPower;
  boostedWeather: Weather[];
  image: string;
}

/** Pokemon Type that displays name + icon. */
export interface PokemonType {
  name: string;
  image: string;
}

export interface Weather {
  name: string;
  image: string;
}

export interface CombatPowerRange {
  min: number;
  max: number;
}

/** Catch CP range, normal vs weather-boosted. */
export interface CombatPower {
  normal: CombatPowerRange;
  boosted: CombatPowerRange;
}

// pokemon-go-api (Pokédex, stats, movesets)
// https://pokemon-go-api.github.io/pokemon-go-api/api/pokedex.json

/** Base stats used in GO's damage formula. */
export interface Stats {
  stamina: number;
  attack: number;
  defense: number;
}

/** Type info as the API nests it: a raw id plus a display name. */
export interface MoveType {
  type: string; // example: "POKEMON_TYPE_PSYCHIC", not used directly - see names.English
  names: {
    English: string; //example: "Psychic" - this is what typeChart.ts wants
  };
}

/** A fast/quick move or charged (cinematic) move. */
export interface PokemonMove {
  id: string;
  power: number;
  energy: number;
  durationMs: number;
  type: MoveType;
  names: {
    English: string;
  };
}

/** Full dex entry: identity, stats, and every move it can learn. */
export interface PokedexEntry {
  dexNr: number;
  names: {
    English: string;
  };
  assets: {
    image: string;
  };
  stats: Stats;
  primaryType: MoveType;
  secondaryType: MoveType | null;
  /** Fast moves, keyed by move id. */
  quickMoves: Record<string, PokemonMove>;
  /** Charged moves, keyed by move id. */
  cinematicMoves: Record<string, PokemonMove>;
}

// App-computed shape

/**
 * One entry in a boss's top-8 counter list (see useCounters.ts) - the
 * Pokémon, its best moveset against this boss, and the score that ranked it.
 */
export interface Counter {
  pokemon: PokedexEntry;
  bestFastMove: PokemonMove;
  bestChargedMove: PokemonMove;
  /** Best multiplier this Pokémon can land on the boss, example: 1.6 or 2.56. */
  multiplier: number;
  /** Tiebreak for equal multipliers - attack stat × multiplier, higher wins. */
  score: number;
}
