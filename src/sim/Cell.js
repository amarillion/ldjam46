import { 
	MAX_SPECIES_PER_CELL, 
	PHOTOSYNTHESIS_BASE_RATE, 
	START_TEMPERATURE 
} from "./Constants";

export class Cell {

	constructor(x, y) {
		this.x = x;
		this.y = y;

		// the following are all in Mol
		this.deadBiomass = 100; // dead organic material, represented by formula ch2o
		this.co2 = 100;
		this.o2 = 100;
		this.h2o = 100;
		this.temperature = START_TEMPERATURE; // In Kelvin

		this.solarEnergy = 1.0; // amount of solar energy, influences rate of photosynthesis.
		
		// pairs of { speciesId, biomass }
		// keep this list sorted, most prevalent species first
		this._species = [];
	}

	sumLivingBiomass() {
		return this._species.reduce((acc, cur) => acc + cur.biomass, 0);
	}

	get species() {
		return this._species;
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
		return this._species.map(i => `${i.speciesId}: ${i.biomass.toFixed(1)} `).join();
	}

	// string representation of cell...
	toString() {
		return `[${this.x}, ${this.y}] ` +
		`CO2: ${this.co2.toFixed(1)} H2O: ${this.h2o.toFixed(1)} O2: ${this.o2.toFixed(1)} Organic: ${this.deadBiomass.toFixed(1)} ` + 
		`Species: ${this.speciesToString()}`;
	}

	// part of Phase I
	growAndDie() {
		// each species should grow and die based on local fitness.
		// each species has 3 possible roles:

		// consumer, producer, reducer

		for (const sp of this._species) {
			
			// PHOTOSYNTHESIS

			// let's assume all of them are producers for now
			// lowest substrate determines growth rate.
			const minS = Math.min(this.co2, this.h2o);

			const rate = PHOTOSYNTHESIS_BASE_RATE * minS; // growth per tick
			//TODO: should also depend on solar energy

			const amount = sp.biomass * rate;
			
			this.o2 += amount;
			this.co2 -= amount;
			this.h2o -= amount;
			sp.biomass += amount;

		}
		this.sortSpecies();
	}

	migrateTo(other) {
		if (this._species.length === 0) return;

		const sp = this._species[0]; // highest ranked species
		const amount = sp.biomass * 0.01;

		other.addSpecies(sp.speciesId, amount);
		sp.biomass -= amount;
	}
}
