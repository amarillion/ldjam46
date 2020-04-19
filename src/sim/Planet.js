// this just holds the calculated properties of our planet, such as average temperature, etc.

export class Planet {

	constructor() {
		// summary stats...
		this.reset();
	}

	reset() {
		this.temperature = 0; // in K
		this.co2 = 0;
		this.o2 = 0;
		this.h2o = 0;
		this.deadBiomass = 0;
		this.species = {};
	}

	speciesToString() {
		return Object.entries(this.species).map((speciesId, biomass) => `${speciesId}: ${biomass.toFixed(1)} `).join();
	}

	// string representation of cell...
	toString() {
		return `Average Temperature: ${this.temperature.toFixed(0)} K

CO2: ${this.co2.toFixed(1)}
H2O: ${this.h2o.toFixed(1)}
O2: ${this.o2.toFixed(1)}
Organic: ${this.deadBiomass.toFixed(1)}

Species: ${this.speciesToString()}`;
	}


}