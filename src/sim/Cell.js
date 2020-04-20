import { 
	MAX_SPECIES_PER_CELL, 
	PHOTOSYNTHESIS_BASE_RATE, 
	RESPIRATION_BASE_RATE, 
	CONVERSION_BASE_RATE, 
	DEATH_RATE,
	START_HEAT,
	START_CO2,
	CO2_BOILING_POINT,
	H2O_MELTING_POINT,
	MAX_STELLAR_HEAT_IN,
	SURFACE_HEAT_CAPACITY,
	START_H2O
} from "./Constants";
import { START_SPECIES, ROLE, INTERACTION } from "./StartSpecies";
import { assert } from "./assert";

export class Cell {

	// latitude in degrees, from -90 (north pole) to 90 (south pole)
	constructor(x, y, latitude) {
		this.x = x;
		this.y = y;

		// the following are all in Mol
		this.deadBiomass = 0; // dead organic material, represented by formula ch2o
		this.co2 = START_CO2;
		this.o2 = 0;
		this.h2o = START_H2O;
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
			this.removeLowestSpecies();
		}
	}

	removeLowestSpecies() {
		const last = this._species.pop();
		this.deadBiomass += last.biomass; // biomass converted from dead species
	}

	// clean up pink elephants (as in: there are not 0.0001 pink elephants in this room)
	// if the amount of species drops below 1.0 mol, then the remainder dies and is cleaned up completely.
	pinkElephantCheck() {
		this.sortSpecies();

		if (this._species.length === 0) return;

		const last = this._species[this._species.length-1];
		if (last.biomass < 1.0) {
			this.removeLowestSpecies();
		}
	}

	sortSpecies() {
		this._species.sort((a, b) => b.biomass - a.biomass);
	}

	speciesToString() {
		return this._species.map(i => `${i.speciesId}: ${i.biomass.toFixed(1)}`).join('\n  ');
	}

	// string representation of cell...
	toString() {
		return `[${this.x}, ${this.y}] Biotope: ${this.biotope}` +
		`
Heat: ${this.heat.toExponential(2)} GJ/km^2
Temperature: ${this.temperature.toFixed(0)} K
Heat gain from sun: ${this.stellarEnergy.toExponential(2)} GJ/km^2/tick
Heat loss to space: ${this.heatLoss.toExponential(2)} GJ/km^2/tick
Albedo: ${this.albedo.toFixed(2)}
${this.albedoDebugStr}
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


		for (const sp of this._species) {
			const info = START_SPECIES[sp.speciesId];

			let fitness = 1.0;
			assert (this.biotope in info.biotopeTolerances);
			fitness *= info.biotopeTolerances[this.biotope];
			
			// no chance of survival outside preferred temperature range
			if (this.temperature < info.temperatureRange[0] ||
				this.temperature > info.temperatureRange[1]) {
				fitness *= 0.1;
			}

			//TODO: fitness is affected by presence of symbionts
	
			// fitness must always be a value between 0.0 and 1.0
			assert(fitness >= 0.0 && fitness <= 1.0);

			// each species has 3 possible roles:
			// consumer, producer, reducer	
			if (info.role === ROLE.PRODUCER) {
				// lowest substrate determines growth rate.
				const minS = Math.min(this.co2, this.h2o);
				const rate = fitness * this.temperature * this.stellarEnergy * PHOTOSYNTHESIS_BASE_RATE * minS; // growth per tick
				
				const amount = Math.min(sp.biomass * rate, this.co2, this.h2o);
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
						// sp(ecies) eats other (species)
						// take some of the biomass from other, and adopt it as own biomass
						const rate = fitness * CONVERSION_BASE_RATE * other.biomass;
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
				// reducers take some of the dead biomass, and adopt it as their own biomass
				const rate = fitness * CONVERSION_BASE_RATE * this.deadBiomass;
				const amount = Math.min(sp.biomass * rate, this.deadBiomass);

				assert (amount >= 0);
				this.deadBiomass -= amount;
				sp.biomass += amount;

				assert (this.deadBiomass >= 0);
				assert (sp.biomass >= 0);
			}

			if (info.role !== ROLE.PRODUCER) {
				// simulate respiration for consumers and reducers.
				// lowest substrate determines growth rate.
				const minS = Math.min(sp.biomass, this.o2);
				// not affected by fitness - all species consume oxygen at a given rate
				const rate = RESPIRATION_BASE_RATE * minS;
				const amount = Math.min(sp.biomass, sp.biomass * rate, this.o2);

				assert (amount >= 0);
				this.o2 -= amount;
				sp.biomass -= amount;
				this.h2o += amount;
				this.co2 += amount;

				assert (this.deadBiomass >= 0);
				assert (sp.biomass >= 0);
			}

			// all species die at a given rate...
			{
				assert(sp.biomass >= 0, `Wrong value ${sp.biomass} ${sp.speciesId}`);

				// the lower the fitness, the higher the death rate
				// divisor has a minimum just above 0, to avoid division by 0
				// death rate has a maximum of 1.0 (instant death)
				const rate = Math.min(1.0, DEATH_RATE / Math.max(fitness, 0.0001));
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

		this.pinkElephantCheck();
	}

	migrateTo(other) {
		if (this._species.length === 0) return;

		for (const sp of this._species) {
			const amount = sp.biomass * 0.02;
			
			// do not migrate less than one unit - otherwise it will die immediately and will be a huge drain on early growth
			if (amount < 1.0) {
				continue;
			}

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
			// if CO2 is solid, a smaller percentage will diffuse
			const pct_exchange = this.temperature < CO2_BOILING_POINT ? 0.001 : 0.1;
			this.diffuseProperty(other, 'co2', pct_exchange);
		}

		// diffusion of H2O
		{
			// if H2O is solid, a smaller percentage will diffuse
			const pct_exchange = this.temperature < H2O_MELTING_POINT ? 0.001 : 0.1;
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
		
		// intersects y-axis at 1.0, reaches lim in infinity.
		const mapAlbedoReduction = (lim, x) => lim + ((1-lim)/(x+1));

		// intersects y-axis at base, reaches 1.0 in infinity
		const mapAlbedoRise = (base, x) => 1 - ((1-base)/(x+1));

		// start albedo
		// albedo decreased by absence of dry ice or ice
		// (this will increase albedo at the poles for a long time)
		const dryIceEffect = this.temperature < CO2_BOILING_POINT ? mapAlbedoRise(0.9, this.co2 / 1000) : 0.9;
		const iceEffect = this.temperature < H2O_MELTING_POINT ? mapAlbedoRise(0.9, this.h2o / 1000) : 0.9;
		
		const ALBEDO_BASE = 0.75;
		this.albedo = ALBEDO_BASE * iceEffect * dryIceEffect;

		let albedoDebugStr = `${ALBEDO_BASE} * ${iceEffect.toFixed(2)} [ice] * ${dryIceEffect.toFixed(2)} [dryIce]`;

		for (const sp of this._species) {
			const info = START_SPECIES[sp.speciesId];
			const speciesEffect = mapAlbedoReduction(info.albedo, sp.biomass / 500);
			this.albedo *= speciesEffect;
			albedoDebugStr += ` * ${speciesEffect.toFixed(2)} [${sp.speciesId}] `;
		}

		this.albedoDebugStr = albedoDebugStr;

		assert(this.albedo >= 0.0 && this.albedo <= 1.0);

		// receive fixed amount of energy from the sun, but part radiates back into space by albedo effect
		this.heat += (1.0 - this.albedo) * this.stellarEnergy;

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

		planet.albedoSum += this.albedo;
		planet.temperatureSum += this.temperature;

		for (const { speciesId, biomass } of this._species) {
			if (!(speciesId in planet.species)) {
				planet.species[speciesId] = 0;
			}
			planet.species[speciesId] += biomass;
		}

	}

}
