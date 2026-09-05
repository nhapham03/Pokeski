export interface RaidBoss {
  name: string;
  tier: string;
  canBeShiny: boolean;
  types: PokemonType[];
  combatPower: CombatPower;
  boostedWeather: Weather[];
  image: string;
}
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

export interface CombatPower {
  normal: CombatPowerRange;
  boosted: CombatPowerRange;
}

export interface PokedexEntry {
  dexNr: number;
  names: {
    English: string;
  };
  assets: {
    image: string;
  };
  primaryType: {
    type: string;
  };
  secondaryType: {
    type: string;
  } | null;
}
