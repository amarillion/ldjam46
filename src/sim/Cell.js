import { MAX_SPECIES_PER_CELL } from "./Constants";

export class Cell {

	constructor(x, y) {
		this.x = x;
		this.y = y;

		// the following are all in Mol
		this.deadBiomass = 100; // dead organic material, represented by formula ch2o
		this.co2 = 100;
		this.o2 = 100;
		this.h2o = 100;
		this.temperature = 200; // In Kelvin

		this.solarEnergy = 1.0; // amount of solar energy, influences rate of photosynthesis.
		
		// pairs of { speciesId, biomass }
		// keep this list sorted, most prevalent species first
		this._species = [];
	}

	// introduce a given amount of species to this cell
	addSpecies(speciesId, biomass) {
		const existing = this._species.find(i => i.speciesId === speciesId);
		if (existing) {
			existing.biomass += biomass;
			this.sortSpecies();
		}
		else {
			this._species.push({ speciesId, biomass });
			this.maxSpeciesCheck();
		}
	}

	// if there are more than a given number of species in this cell, the last one is automatically removed
	maxSpeciesCheck() {
		this.sortSpecies();
		if (this._species.length > MAX_SPECIES_PER_CELL) {
			const last = this._species.pop();
			this.deadBiomass += last.biomass; // biomass converted from dead species
		}
	}

	sortSpecies() {
		this._species.sort((a, b) => a.biomass - b.biomass);
	}

	speciesToString() {
		return this._species.map(i => `${i.speciesId}: ${i.biomass} `).join();
	}

	// string representation of cell...
	toString() {
		return `[${this.x}, ${this.y}] ` +
		`CO2: ${this.co2} H2O: ${this.h2o} O2: ${this.o2} Organic: ${this.deadBiomass} ` + 
		`Species: ${this.speciesToString()}`;
	}

}
