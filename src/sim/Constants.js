// mostly for simulation parameters

export const MAX_SPECIES_PER_CELL = 8;

export const PHOTOSYNTHESIS_BASE_RATE = 3.0e-5; // rate per mol co2 per mol h2o per mol organism per GJ of solar energy
export const CONVERSION_BASE_RATE = 1.0e-3; // rate per mol substrate, per mol organism
export const RESPIRATION_BASE_RATE = 1.0e-3; // rate per mol substrate, per mol organism
export const DEATH_RATE = 0.01; // percentage death per turn. will be modified by fitness factor

export const START_CO2 = 1000; // starting amount of CO2 per km^2, in GMol
export const START_H2O = 1000; // starting amount of H2O per km^2, in GMol

// export const START_TEMPERATURE = 200; // in Kelvin
export const START_HEAT = 2.2e2; // in GJ per km^2 (= cell area)
export const SURFACE_HEAT_CAPACITY = 1.0e0; // base thermal capacity of planetary surface, in GJ/K
export const MAX_STELLAR_HEAT_IN = 3.5e0; // heat added by the star in GJ per km^2 at the equator

export const CO2_BOILING_POINT = 216;
export const H2O_MELTING_POINT = 273;

// GUI parameters
export const TILESIZE = 64;