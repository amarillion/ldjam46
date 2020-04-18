import { 
	MAX_SPECIES_PER_CELL, 
	PHOTOSYNTHESIS_BASE_RATE, 
	RESPIRATION_BASE_RATE, 
	START_TEMPERATURE, 
	DEATH_RATE
} from "./Constants";
import { START_SPECIES, ROLE, INTERACTION } from "./StartSpecies";
import { assert } from "./assert";

export class Cell {

	constructor(x, y) {
		this.x = x;
		this.y = y;

		// the following are all in Mol
		this.deadBiomass = 10; // dead organic material, represented by formula ch2o
		this.co2 = 1000;
		this.o2 = 10;
		this.h2o = 1000;
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
		this._species.sort((a, b) => b.biomass - a.biomass);
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

			const info = START_SPECIES[sp.speciesId];

			if (info.role === ROLE.PRODUCER) {
				// lowest substrate determines growth rate.
				const minS = Math.min(this.co2, this.h2o);

				const rate = PHOTOSYNTHESIS_BASE_RATE * minS; // growth per tick
				//TODO: should also depend on solar energy

				const amount = Math.min(sp.biomass * rate, this.co2, this.o2);
				assert (amount >= 0);

				this.co2 -= amount;
				this.h2o -= amount;

				this.o2 += amount;
				sp.biomass += amount;
				assert (sp.biomass >= 0);
			}
			else if (info.role === ROLE.CONSUMER) {
				// for each other species
				for (const other of this._species) {
					if (other.speciesId === sp.speciesId) continue; // don't interact with self

					const interaction = info.interactionMap[other.speciesId];
					if (interaction === INTERACTION.EAT) {
						// sp eats other
						// lowest substrate determines growth rate.
						const rate = RESPIRATION_BASE_RATE * other.biomass;
						const amount = Math.min(sp.biomass * rate, other.biomass);

						assert (amount >= 0);
						other.biomass -= amount;
						sp.biomass += amount;

						assert(sp.biomass >= 0);
						assert(other.biomass >= 0);
					}
				}
			}
			else if  (info.role === ROLE.REDUCER) {
				const rate = RESPIRATION_BASE_RATE * this.deadBiomass;
				const amount = Math.min(sp.biomass * rate, this.deadBiomass);

				assert (amount >= 0);
				this.deadBiomass -= amount;
				sp.biomass += amount;

				assert (this.deadBiomass >= 0);
				assert (sp.biomass >= 0);
			}

			if (info.role !== ROLE.PRODUCER) {
				// simulate respiration
				// lowest substrate determines growth rate.
				const minS = Math.min(sp.biomass, this.o2);
				const rate = RESPIRATION_BASE_RATE * minS; // growth per tick
				const amount = Math.min(sp.biomass, sp.biomass * rate, this.o2);

				assert (amount >= 0);
				this.o2 -= amount;
				sp.biomass -= amount;
				this.h2o += amount;
				this.co2 += amount;

				assert (this.deadBiomass >= 0);
				assert (sp.biomass >= 0);
			}

			const fitness = 1.0; //TODO: modify based on temperature and biotope

			// all species die at a given rate...
			{
				assert(sp.biomass >= 0, `Wrong value ${sp.biomass} ${sp.speciesId}`);

				const rate = DEATH_RATE / fitness;
				const amount = Math.min(sp.biomass * rate, sp.biomass);

				assert (amount >= 0);
				this.deadBiomass += amount;
				sp.biomass -= amount;

				assert(sp.biomass >= 0);
			}

			assert(sp.biomass >= 0);
		}

		assert (this.o2 >= 0);
		assert (this.co2 >= 0);
		assert (this.h2o >= 0);
		assert (this.deadBiomass >= 0);

		this.sortSpecies();
	}

	migrateTo(other) {
		if (this._species.length === 0) return;

		for (const sp of this._species) {
			const amount = sp.biomass * 0.01;
			other.addSpecies(sp.speciesId, amount);
			sp.biomass -= amount;
		}
	}
}
