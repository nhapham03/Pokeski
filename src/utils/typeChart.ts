/**
 * Pokémon GO's type effectiveness chart.
 *
 * Every matchup is just one of three values (SUPER_EFFECTIVE / RESISTED / NEUTRAL below), and
 * dual types stack by multiplying them.
 * It's 1.6 * 1.6 and 0.625 * 0.625. getTypeEffectiveness()
 * does that multiplication, nothing else needed.
 */

export type PokemonTypeName =
  | "Normal"
  | "Fire"
  | "Water"
  | "Electric"
  | "Grass"
  | "Ice"
  | "Fighting"
  | "Poison"
  | "Ground"
  | "Flying"
  | "Psychic"
  | "Bug"
  | "Rock"
  | "Ghost"
  | "Dragon"
  | "Dark"
  | "Steel"
  | "Fairy";

const SUPER_EFFECTIVE = 1.6;
const RESISTED = 0.625;
const NEUTRAL = 1;

// attacker -> types it deals super effective damage to
const SUPER_EFFECTIVE_MAP: Record<PokemonTypeName, PokemonTypeName[]> = {
  Normal: [],
  Fire: ["Grass", "Ice", "Bug", "Steel"],
  Water: ["Fire", "Ground", "Rock"],
  Electric: ["Water", "Flying"],
  Grass: ["Water", "Ground", "Rock"],
  Ice: ["Grass", "Ground", "Flying", "Dragon"],
  Fighting: ["Normal", "Ice", "Rock", "Dark", "Steel"],
  Poison: ["Grass", "Fairy"],
  Ground: ["Fire", "Electric", "Poison", "Rock", "Steel"],
  Flying: ["Grass", "Fighting", "Bug"],
  Psychic: ["Fighting", "Poison"],
  Bug: ["Grass", "Psychic", "Dark"],
  Rock: ["Fire", "Ice", "Flying", "Bug"],
  Ghost: ["Psychic", "Ghost"],
  Dragon: ["Dragon"],
  Dark: ["Psychic", "Ghost"],
  Steel: ["Ice", "Rock", "Fairy"],
  Fairy: ["Fighting", "Dragon", "Dark"],
};

// attacker -> types that resist it, example: Normal vs Ghost is just resisted, not "no effect"
const RESISTED_MAP: Record<PokemonTypeName, PokemonTypeName[]> = {
  Normal: ["Rock", "Steel", "Ghost"],
  Fire: ["Fire", "Water", "Rock", "Dragon"],
  Water: ["Water", "Grass", "Dragon"],
  Electric: ["Electric", "Grass", "Dragon", "Ground"],
  Grass: ["Fire", "Grass", "Poison", "Flying", "Bug", "Dragon", "Steel"],
  Ice: ["Fire", "Water", "Ice", "Steel"],
  Fighting: ["Poison", "Flying", "Psychic", "Bug", "Fairy", "Ghost"],
  Poison: ["Poison", "Ground", "Rock", "Ghost", "Steel"],
  Ground: ["Grass", "Bug", "Flying"],
  Flying: ["Electric", "Rock", "Steel"],
  Psychic: ["Psychic", "Steel", "Dark"],
  Bug: ["Fire", "Fighting", "Poison", "Flying", "Ghost", "Steel", "Fairy"],
  Rock: ["Fighting", "Ground", "Steel"],
  Ghost: ["Dark", "Normal"],
  Dragon: ["Steel", "Fairy"],
  Dark: ["Fighting", "Dark", "Fairy"],
  Steel: ["Fire", "Water", "Electric", "Steel"],
  Fairy: ["Fire", "Poison", "Steel"],
};

/** Multiplier for one attacking type against one defending type. */
export function getSingleTypeMultiplier(
  attacker: PokemonTypeName,
  defender: PokemonTypeName,
): number {
  if (SUPER_EFFECTIVE_MAP[attacker].includes(defender)) return SUPER_EFFECTIVE;
  if (RESISTED_MAP[attacker].includes(defender)) return RESISTED;
  return NEUTRAL;
}

/**
 * Multiplies the single-type multiplier across all of the defender's types.
 * This is where the double-weak / double-resist numbers come from.
 */
export function getTypeEffectiveness(
  attackerType: PokemonTypeName,
  defenderTypes: PokemonTypeName[],
): number {
  return defenderTypes.reduce(
    (multiplier, defenderType) =>
      multiplier * getSingleTypeMultiplier(attackerType, defenderType),
    1,
  );
}
