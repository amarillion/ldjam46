import { 
	MAX_SPECIES_PER_CELL, 
	PHOTOSYNTHESIS_BASE_RATE, 
	RESPIRATION_BASE_RATE, 
	DEATH_RATE,
	START_HEAT,
	START_CO2,
	CO2_BOILING_POINT,
	H2O_MELTING_POINT,
	MAX_STELLAR_HEAT_IN,
	SURFACE_HEAT_CAPACITY
} from "./Constants";
import { START_SPECIES, ROLE, INTERACTION } from "./StartSpecies";
import { assert } from "./assert";

export class Cell {

	// latitude in degrees, from -90 (north pole) to 90 (south pole)
	constructor(x, y, latitude) {
		this.x = x;
		this.y = y;

		// the following are all in Mol
		this.deadBiomass = 10; // dead organic material, represented by formula ch2o
		this.co2 = START_CO2;
		this.o2 = 10;
		this.h2o = 1000;
		this.latitude = latitude;
		this.heat = START_HEAT;
		
		// constant amount of stellar energy per tick
		this.stellarEnergy = Math.cos(this.latitude / 180 * 3.141) * MAX_STELLAR_HEAT_IN;
		assert (this.stellarEnergy >= 0);

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
		`
Heat: ${this.heat.toExponential(2)} GJ/km^2
Temperature: ${this.temperature.toFixed(0)} K
Heat gain from sun: ${this.stellarEnergy.toExponential(2)} GJ/km^2/tick
Heat loss to space: ${this.heatLoss.toExponential(2)} GJ/km^2/tick
Latitude: ${this.latitude.toFixed(0)} deg

CO2: ${this.co2.toFixed(1)}
H2O: ${this.h2o.toFixed(1)}
O2: ${this.o2.toFixed(1)}
Organic: ${this.deadBiomass.toFixed(1)}

Species: ${this.speciesToString()}`;

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

				const rate = this.stellarEnergy * PHOTOSYNTHESIS_BASE_RATE * minS; // growth per tick
				
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

	diffuseProperty(other, prop, pct_exchange) {
		const netAmount = (this[prop] * pct_exchange) - (other[prop] * pct_exchange);
		this[prop] -= netAmount;
		other[prop] += netAmount;
		assert(this[prop] >= 0);
		assert(other[prop] >= 0);
	}

	diffusionTo(other) {

		// diffusion of CO2
		{
			// if CO2 is solid, only a small percentage will diffuse
			const pct_exchange = this.temperature < CO2_BOILING_POINT ? 0.01 : 0.1;
			this.diffuseProperty(other, 'co2', pct_exchange);
		}

		// diffusion of H2O
		{
			const pct_exchange = this.temperature < H2O_MELTING_POINT ? 0.01 : 0.1;
			this.diffuseProperty(other, 'h2o', pct_exchange);
		}

		// diffusion of o2
		{
			const pct_exchange = 0.1;
			this.diffuseProperty(other, 'o2', pct_exchange);
		}

		// heat diffusion.
		// a percentage of heat always diffuses...
		// TODO to be realistic, we should also make this dependent on weather
		{
			const pct_exchange = 0.1;
			this.diffuseProperty(other, 'heat', pct_exchange);
		}
	}

	// calculate heat, albedo, greenhouse effect
	updatePhysicalProperties() {
		this.temperature = this.heat / SURFACE_HEAT_CAPACITY; // In Kelvin
		
		// TODO
		// this.albedo = + this.sumLivingBiomass();
		// this.albedo = 1.0;

		// receive fixed amount of energy from the sun. TODO: influenced by albedo
		this.heat += this.stellarEnergy;

		// percentage of heat radiates out to space
		const heatLossPct = 0.01; // TODO: influenced by greenhouse effect and albedo
		this.heatLoss = this.heat * heatLossPct;
		this.heat -= (this.heatLoss);
	}

	updateStats(planet) {
		planet.co2 += this.co2;
		planet.o2 += this.o2;
		planet.h2o += this.h2o;
		planet.deadBiomass += this.deadBiomass;

		for (const { speciesId, biomass } of this._species) {
			if (!(speciesId in planet.species)) {
				planet.species[speciesId] = 0;
			}
			planet.species[speciesId] += biomass;
		}

	}

}
