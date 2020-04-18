export class Cell {

	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.deadBiomass = 0;
		this.co2 = 0;
		this.o2 = 0;
		this.h2o = 0;
		this.temperature = 0;
		this.solarEnergy = 0; // amount of solar energy, influences rate of photosynthesis.
		
		// pairs of species Id + amount of biomass
		// keep this list sorted, most prevalent species first
		this.species = [];
	}

	introduceSpecies(speciesId, biomass) {

	}

}
